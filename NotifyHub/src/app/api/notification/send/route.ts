import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { notifications, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { addNotificationToQueue, PRIORITY_MAP, type PriorityLevel } from '@/lib/queueService';

const sendNotificationSchema = z.object({
  userId: z.number().int().positive('User ID must be a positive integer'),
  type: z.enum(['transactional', 'reminder', 'promotional', 'system'], {
    errorMap: () => ({ message: 'Type must be one of: transactional, reminder, promotional, system' })
  }),
  priority: z.enum(['critical', 'high', 'normal', 'low']).default('normal').optional(),
  templateKey: z.string().optional(),
  locale: z.string().default('en').optional(),
  channelOverride: z.enum(['email', 'sms', 'push']).optional(),
  to: z.string().optional(),
  subject: z.string().optional(),
  data: z.object({}).passthrough().optional()
});

async function renderTemplateContent(templateKey: string, channel: string, locale: string, variables: Record<string, any>): Promise<{ subject?: string; text?: string; html?: string } | null> {
  try {
    const renderRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/templates/render`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: templateKey,
        channel,
        locale,
        variables
      })
    });

    if (!renderRes.ok) {
      console.warn(`Template render failed for ${templateKey}: ${renderRes.status}`);
      return null;
    }

    return await renderRes.json();
  } catch (error) {
    console.error('Template rendering error:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();

    // Validate request body
    const validationResult = sendNotificationSchema.safeParse(requestBody);
    if (!validationResult.success) {
      return NextResponse.json({
        error: validationResult.error.errors[0]?.message || 'Invalid request data',
        code: 'VALIDATION_ERROR'
      }, { status: 400 });
    }

    const {
      userId,
      type,
      priority = 'normal',
      templateKey,
      locale = 'en',
      channelOverride,
      to,
      subject,
      data
    } = validationResult.data;

    // Verify user exists
    const userExists = await db.select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (userExists.length === 0) {
      return NextResponse.json({
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      }, { status: 404 });
    }

    const user = userExists[0];
    let title = subject || 'Notification';
    let content = 'You have a new notification.';
    let channel = channelOverride || 'email';
    let recipientAddress = to || user.email;

    // Get template content if templateKey is provided
    if (templateKey) {
      const rendered = await renderTemplateContent(
        templateKey,
        channelOverride || 'email',
        locale,
        data || {}
      );

      if (rendered) {
        title = rendered.subject || title;
        content = rendered.text || rendered.html || content;
      }
    }

    const currentTimestamp = new Date().toISOString();

    // Create notification record
    const newNotification = await db.insert(notifications)
      .values({
        userId,
        type,
        priority,
        title,
        content,
        channel,
        locale,
        templateKey: templateKey || null,
        data: data ? data : null,
        status: 'queued',
        createdAt: currentTimestamp,
        updatedAt: currentTimestamp
      })
      .returning();

    if (newNotification.length === 0) {
      return NextResponse.json({
        error: 'Failed to create notification',
        code: 'CREATION_FAILED'
      }, { status: 500 });
    }

    // Add to priority queue
    const job = await addNotificationToQueue(
      channel as 'email' | 'sms' | 'push',
      {
        notificationId: newNotification[0].id,
        userId,
        type,
        priority: priority as PriorityLevel,
        templateKey: templateKey || undefined,
        content,
        to: recipientAddress,
        subject: title,
      }
    );

    return NextResponse.json({
      notificationId: newNotification[0].id,
      jobId: job.id,
      status: newNotification[0].status,
      priority: PRIORITY_MAP[priority as PriorityLevel],
      message: 'Notification queued successfully with priority handling'
    }, { status: 201 });

  } catch (error) {
    console.error('POST /api/notification/send error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + error,
      code: 'INTERNAL_ERROR'
    }, { status: 500 });
  }
}