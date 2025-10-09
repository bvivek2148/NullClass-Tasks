import { db } from "@/db";
import { notifications, notificationHistory, notificationPreferences, notificationTemplates, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import Mustache from "mustache";
import sgMail from "@sendgrid/mail";
import nodemailer from "nodemailer";
import twilioPkg from "twilio";
import OneSignal from "onesignal-node";
import admin from "firebase-admin";
import { addToQueue, startQueueProcessor } from "@/lib/queue";

export type NotificationJob = { notificationId: number };

function nowISO() { return new Date().toISOString(); }

function env(name: string) {
  return process.env[name];
}

// Init providers lazily
function hasSendgrid() { return !!env("SENDGRID_API_KEY"); }
function hasSMTP() { return !!(env("SMTP_HOST") && env("SMTP_PORT") && env("SMTP_USER") && env("SMTP_PASS")); }
function hasTwilio() { return !!(env("TWILIO_ACCOUNT_SID") && env("TWILIO_AUTH_TOKEN") && env("TWILIO_FROM_NUMBER")); }
function hasOneSignal() { return !!(env("ONESIGNAL_APP_ID") && env("ONESIGNAL_API_KEY")); }
function hasFCM() { return !!env("GOOGLE_APPLICATION_CREDENTIALS_JSON"); }

async function renderTemplate(templateKey: string | null, channel: string, locale: string, fallback: { subject: string; body: string }, data?: Record<string, any>) {
  if (!templateKey) return fallback;
  const rows = await db.select().from(notificationTemplates).where(and(
    eq(notificationTemplates.key, templateKey),
    eq(notificationTemplates.channel, channel),
    eq(notificationTemplates.locale, locale),
    eq(notificationTemplates.isActive, true)
  )).limit(1);
  if (!rows.length) return fallback;
  const t = rows[0];
  const subject = t.subject ? Mustache.render(t.subject, data || {}) : fallback.subject;
  const body = t.bodyText ? Mustache.render(t.bodyText, data || {}) : fallback.body;
  return { subject, body };
}

async function respectPreferences(userId: number, type: string, channel: string) {
  // default fallback: allow transactional/system via email if unspecified
  const pref = await db.select().from(notificationPreferences).where(and(
    eq(notificationPreferences.userId, userId),
    eq(notificationPreferences.type, type as any),
    eq(notificationPreferences.channel, channel as any)
  )).limit(1);
  if (!pref.length) {
    if ((type === "transactional" || type === "system") && channel === "email") return { allowed: true };
    return { allowed: false };
  }
  const p = pref[0];
  if (p.mute) return { allowed: false };
  if (p.snoozeUntil && new Date(p.snoozeUntil) > new Date()) return { allowed: false };
  return { allowed: !!p.enabled };
}

async function recordHistory(args: {
  notificationId: number;
  channel: string;
  status: string;
  provider: string;
  providerMessageId?: string | null;
  error?: string | null;
}) {
  const rec = await db.insert(notificationHistory).values({
    notificationId: args.notificationId,
    channel: args.channel,
    status: args.status,
    provider: args.provider,
    providerMessageId: args.providerMessageId || null,
    attempt: 1,
    error: args.error || null,
    occurredAt: nowISO(),
  }).returning();
  return rec[0];
}

async function sendEmail(to: string, subject: string, body: string) {
  // Try SendGrid then SMTP
  if (hasSendgrid()) {
    try {
      sgMail.setApiKey(env("SENDGRID_API_KEY")!);
      const res = await sgMail.send({
        to,
        from: env("FROM_EMAIL") || "noreply@example.com",
        subject,
        text: body,
        html: `<p>${body}</p>`
      });
      const msgId = res?.[0]?.headers?.["x-message-id"] || undefined;
      return { provider: "sendgrid", messageId: msgId };
    } catch (e: any) {
      // fallback to SMTP
    }
  }
  if (hasSMTP()) {
    const transporter = nodemailer.createTransport({
      host: env("SMTP_HOST"),
      port: parseInt(env("SMTP_PORT") || "587"),
      secure: env("SMTP_PORT") === "465",
      auth: { user: env("SMTP_USER"), pass: env("SMTP_PASS") },
    });
    const info = await transporter.sendMail({
      from: env("FROM_EMAIL") || env("SMTP_USER"),
      to,
      subject,
      text: body,
      html: `<p>${body}</p>`
    });
    return { provider: "smtp", messageId: info.messageId as string };
  }
  // simulate in dev
  return { provider: "simulated", messageId: `sim-${Date.now()}` };
}

async function sendSMS(to: string, body: string) {
  if (hasTwilio()) {
    const twilio = twilioPkg(env("TWILIO_ACCOUNT_SID"), env("TWILIO_AUTH_TOKEN"));
    const msg = await twilio.messages.create({
      from: env("TWILIO_FROM_NUMBER")!,
      to,
      body,
    });
    return { provider: "twilio", messageId: msg.sid };
  }
  return { provider: "simulated", messageId: `sim-${Date.now()}` };
}

async function sendPush(userExternalId: string, title: string, body: string) {
  if (hasFCM() && !admin.apps.length) {
    try {
      const creds = JSON.parse(env("GOOGLE_APPLICATION_CREDENTIALS_JSON")!);
      admin.initializeApp({ credential: admin.credential.cert(creds) });
    } catch {}
  }
  if (admin.apps.length) {
    try {
      const res = await admin.messaging().send({
        topic: userExternalId,
        notification: { title, body },
      });
      return { provider: "fcm", messageId: res };
    } catch {
      // fallback to OneSignal
    }
  }
  if (hasOneSignal()) {
    const client = new OneSignal.Client(env("ONESIGNAL_APP_ID")!, env("ONESIGNAL_API_KEY")!);
    const response = await client.createNotification({
      include_external_user_ids: [userExternalId],
      headings: { en: title },
      contents: { en: body },
    } as any);
    return { provider: "onesignal", messageId: (response as any).id };
  }
  return { provider: "simulated", messageId: `sim-${Date.now()}` };
}

export async function processNotification(job: NotificationJob) {
  // Load notification and user
  const rows = await db.select().from(notifications).where(eq(notifications.id, job.notificationId)).limit(1);
  if (!rows.length) return;
  const n = rows[0];
  if (n.status !== "queued") return; // already processed

  const userRows = await db.select().from(users).where(eq(users.id, n.userId)).limit(1);
  if (!userRows.length) {
    await db.update(notifications).set({ status: "failed", error: "USER_NOT_FOUND", updatedAt: nowISO() }).where(eq(notifications.id, n.id));
    return;
  }
  const user = userRows[0];

  // Determine channel
  let channel: "email" | "sms" | "push" = (n.channel as any) || "email";

  // Respect preferences for primary channel; if not allowed, fallback to email
  const allowed = await respectPreferences(n.userId, n.type, channel);
  if (!allowed.allowed) {
    if (channel !== "email") {
      const allowedEmail = await respectPreferences(n.userId, n.type, "email");
      if (allowedEmail.allowed) channel = "email";
      else {
        await db.update(notifications).set({ status: "failed", error: "PREFERENCE_BLOCKED", updatedAt: nowISO() }).where(eq(notifications.id, n.id));
        await recordHistory({ notificationId: n.id, channel, status: "failed", provider: "policy", error: "blocked by preferences" });
        return;
      }
    } else {
      await db.update(notifications).set({ status: "failed", error: "PREFERENCE_BLOCKED", updatedAt: nowISO() }).where(eq(notifications.id, n.id));
      await recordHistory({ notificationId: n.id, channel, status: "failed", provider: "policy", error: "blocked by preferences" });
      return;
    }
  }

  // Render content
  const rendered = await renderTemplate(n.templateKey || null, channel, n.locale || "en", { subject: n.title, body: n.content }, n.data as any);

  let provider = "simulated";
  let messageId: string | undefined;
  let error: string | undefined;
  let status: string = "sent";

  try {
    if (channel === "email") {
      const r = await sendEmail(user.email, rendered.subject, rendered.body);
      provider = r.provider; messageId = r.messageId; status = "sent";
    } else if (channel === "sms") {
      // For demo, assume user.name as phone placeholder; in real app, store phone
      const phone = (user as any).phone || env("TEST_SMS_TO") || "+15555555555";
      const r = await sendSMS(phone, rendered.body);
      provider = r.provider; messageId = r.messageId; status = "sent";
    } else if (channel === "push") {
      const externalId = String(user.id);
      const r = await sendPush(externalId, rendered.subject, rendered.body);
      provider = r.provider; messageId = r.messageId; status = "sent";
    }
  } catch (e: any) {
    error = e?.message || String(e);
    // Failover: if not email already, try email as backup per spec
    if (channel !== "email") {
      try {
        const r = await sendEmail(user.email, rendered.subject, rendered.body);
        provider = r.provider; messageId = r.messageId; status = "sent";
        channel = "email"; // record as email
        error = undefined;
      } catch (e2: any) {
        error = e2?.message || String(e2);
        status = "failed";
      }
    } else {
      status = "failed";
    }
  }

  // Update DB
  await recordHistory({ notificationId: n.id, channel, status, provider, providerMessageId: messageId || null, error: error || null });
  await db.update(notifications).set({ status, sentAt: status === "sent" ? nowISO() : n.sentAt, error: error || null, updatedAt: nowISO(), channel }).where(eq(notifications.id, n.id));
}

let processorStarted = false;
export function ensureProcessor() {
  if (processorStarted) return;
  startQueueProcessor<NotificationJob>(processNotification);
  processorStarted = true;
}

export async function queueNotification(notificationId: number) {
  ensureProcessor();
  await addToQueue<NotificationJob>({ notificationId }, { attempts: 3 });
}