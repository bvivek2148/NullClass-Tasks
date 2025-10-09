import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { notificationPreferences } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { z } from 'zod';

const VALID_TYPES = ['transactional', 'reminder', 'promotional', 'system'] as const;
const VALID_CHANNELS = ['email', 'sms', 'push'] as const;

const preferenceSchema = z.object({
  userId: z.number().positive(),
  type: z.enum(VALID_TYPES),
  channel: z.enum(VALID_CHANNELS),
  enabled: z.boolean(),
  locale: z.string().optional(),
  snoozeUntil: z.string().optional(),
  mute: z.boolean().optional(),
});

const preferencesArraySchema = z.array(preferenceSchema);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userIdParam = searchParams.get('userId');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!userIdParam) {
      return NextResponse.json({ 
        error: "userId parameter is required",
        code: "MISSING_USER_ID" 
      }, { status: 400 });
    }

    const userId = parseInt(userIdParam);
    if (isNaN(userId) || userId <= 0) {
      return NextResponse.json({ 
        error: "Valid userId is required",
        code: "INVALID_USER_ID" 
      }, { status: 400 });
    }

    const preferences = await db.select()
      .from(notificationPreferences)
      .where(eq(notificationPreferences.userId, userId))
      .orderBy(desc(notificationPreferences.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(preferences, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const requestBody = await request.json();

    if (!Array.isArray(requestBody)) {
      return NextResponse.json({ 
        error: "Request body must be an array of preferences",
        code: "INVALID_BODY_FORMAT" 
      }, { status: 400 });
    }

    const validation = preferencesArraySchema.safeParse(requestBody);
    if (!validation.success) {
      return NextResponse.json({ 
        error: "Invalid preference data: " + validation.error.message,
        code: "VALIDATION_ERROR" 
      }, { status: 400 });
    }

    const preferencesToUpsert = validation.data;
    const updatedPreferences = [];

    for (const preference of preferencesToUpsert) {
      const { userId, type, channel, enabled, locale, snoozeUntil, mute } = preference;
      
      // Check if preference exists
      const existing = await db.select()
        .from(notificationPreferences)
        .where(and(
          eq(notificationPreferences.userId, userId),
          eq(notificationPreferences.type, type),
          eq(notificationPreferences.channel, channel)
        ))
        .limit(1);

      const now = new Date().toISOString();

      if (existing.length > 0) {
        // Update existing preference
        const updated = await db.update(notificationPreferences)
          .set({
            enabled,
            locale: locale || null,
            snoozeUntil: snoozeUntil || null,
            mute: mute || false,
            updatedAt: now
          })
          .where(and(
            eq(notificationPreferences.userId, userId),
            eq(notificationPreferences.type, type),
            eq(notificationPreferences.channel, channel)
          ))
          .returning();

        updatedPreferences.push(updated[0]);
      } else {
        // Insert new preference
        const inserted = await db.insert(notificationPreferences)
          .values({
            userId,
            type,
            channel,
            enabled,
            locale: locale || null,
            snoozeUntil: snoozeUntil || null,
            mute: mute || false,
            createdAt: now,
            updatedAt: now
          })
          .returning();

        updatedPreferences.push(inserted[0]);
      }
    }

    return NextResponse.json(updatedPreferences, { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    
    if (error instanceof Error && error.message.includes('FOREIGN KEY constraint failed')) {
      return NextResponse.json({ 
        error: "Invalid userId - user does not exist",
        code: "INVALID_USER_REFERENCE" 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}