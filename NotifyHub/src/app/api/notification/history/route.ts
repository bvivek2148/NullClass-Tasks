import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { notifications, notificationHistory } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { z } from 'zod';

const querySchema = z.object({
  userId: z.string().transform((val) => {
    const num = parseInt(val);
    if (isNaN(num)) throw new Error('Invalid userId');
    return num;
  }),
  status: z.string().optional(),
  limit: z.string().optional().default('20').transform((val) => {
    const num = parseInt(val);
    if (isNaN(num) || num < 1) return 20;
    return Math.min(num, 100);
  }),
  offset: z.string().optional().default('0').transform((val) => {
    const num = parseInt(val);
    if (isNaN(num) || num < 0) return 0;
    return num;
  }),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Validate required userId parameter
    const userIdParam = searchParams.get('userId');
    if (!userIdParam) {
      return NextResponse.json({
        error: 'userId parameter is required',
        code: 'MISSING_USER_ID'
      }, { status: 400 });
    }

    // Validate and parse query parameters
    let validatedParams;
    try {
      validatedParams = querySchema.parse({
        userId: userIdParam,
        status: searchParams.get('status') || undefined,
        limit: searchParams.get('limit') || undefined,
        offset: searchParams.get('offset') || undefined,
      });
    } catch (error) {
      return NextResponse.json({
        error: 'Invalid query parameters: ' + (error instanceof Error ? error.message : 'Unknown error'),
        code: 'INVALID_PARAMETERS'
      }, { status: 400 });
    }

    const { userId, status, limit, offset } = validatedParams;

    // Build the query with join
    let query = db
      .select({
        notificationId: notifications.id,
        title: notifications.title,
        content: notifications.content,
        type: notifications.type,
        priority: notifications.priority,
        channel: notificationHistory.channel,
        locale: notifications.locale,
        status: notificationHistory.status,
        provider: notificationHistory.provider,
        attempt: notificationHistory.attempt,
        error: notificationHistory.error,
        sentAt: notifications.sentAt,
        occurredAt: notificationHistory.occurredAt,
      })
      .from(notificationHistory)
      .innerJoin(notifications, eq(notificationHistory.notificationId, notifications.id))
      .where(eq(notifications.userId, userId));

    // Add status filter if provided
    if (status) {
      query = query.where(and(
        eq(notifications.userId, userId),
        eq(notificationHistory.status, status)
      ));
    }

    // Execute query with pagination and ordering
    const results = await query
      .orderBy(desc(notificationHistory.occurredAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });

  } catch (error) {
    console.error('GET /api/notification/history error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}