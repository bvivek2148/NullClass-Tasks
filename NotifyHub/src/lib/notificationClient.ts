export type NotificationType = "transactional" | "reminder" | "promotional" | "system";
export type Channel = "email" | "sms" | "push";

export interface Preference {
  id?: number;
  userId: number;
  type: NotificationType;
  channel: Channel;
  enabled: boolean;
  locale?: string | null;
  snoozeUntil?: string | null;
  mute?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MetricsResponse {
  summary: { totalSent: number; totalDelivered: number; totalFailed: number; successRate: number };
  byChannel: Record<Channel, { sent: number; delivered: number; failed: number; successRate: number }>;
  byType: Record<NotificationType, { sent: number; delivered: number; failed: number; successRate: number }>;
  timeline: Array<{ date: string; sent: number; delivered: number; failed: number }>;
}

export async function getPreferences(userId: number) {
  const res = await fetch(`/api/notification/preferences?userId=${userId}`);
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as Preference[];
}

export async function upsertPreferences(prefs: Preference[]) {
  const res = await fetch(`/api/notification/preferences`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      prefs.map((p) => ({
        userId: p.userId,
        type: p.type,
        channel: p.channel,
        enabled: p.enabled,
        locale: p.locale ?? undefined,
        snoozeUntil: p.snoozeUntil ?? undefined,
        mute: p.mute ?? false,
      }))
    ),
  });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as Preference[];
}

export async function getHistory(userId: number, limit = 20) {
  const res = await fetch(`/api/notification/history?userId=${userId}&limit=${limit}`);
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as Array<{
    notificationId: number;
    title: string;
    content: string;
    type: NotificationType;
    priority: "high" | "normal" | "low";
    channel: Channel;
    locale: string;
    status: string;
    provider: string;
    attempt: number;
    error: string | null;
    sentAt: string | null;
    occurredAt: string;
  }>;
}

export async function getMetrics(params?: { days?: 7 | 30; channel?: Channel; type?: NotificationType }) {
  const query = new URLSearchParams();
  if (params?.days) query.set("days", String(params.days));
  if (params?.channel) query.set("channel", params.channel);
  if (params?.type) query.set("type", params.type);
  const res = await fetch(`/api/notification/metrics${query.toString() ? `?${query.toString()}` : ""}`);
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as MetricsResponse;
}

export async function sendNotification(payload: {
  userId: number;
  type: NotificationType;
  priority?: "high" | "normal" | "low";
  templateKey?: string;
  locale?: string;
  channelOverride?: Channel;
  data?: Record<string, any>;
}) {
  const res = await fetch(`/api/notification/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

export async function testEmail(email: string, provider: "sendgrid" | "smtp" | "auto" = "auto") {
  const res = await fetch(`/api/notification/test-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, provider }),
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}