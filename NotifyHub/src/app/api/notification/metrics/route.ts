import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { notifications, notificationHistory } from '@/db/schema';
import { eq, and, gte, sql, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const daysParam = searchParams.get('days');
    const channelFilter = searchParams.get('channel');
    const typeFilter = searchParams.get('type');

    // Validate days parameter
    const validDays = ['7', '30'];
    const days = daysParam && validDays.includes(daysParam) ? parseInt(daysParam) : 30;

    // Calculate date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString();

    // Apply optional filters
    let whereConditions = [
      gte(notificationHistory.occurredAt, startDateStr)
    ];

    if (channelFilter) {
      const validChannels = ['email', 'sms', 'push'];
      if (!validChannels.includes(channelFilter)) {
        return NextResponse.json({ 
          error: "Invalid channel. Must be one of: email, sms, push",
          code: "INVALID_CHANNEL" 
        }, { status: 400 });
      }
      whereConditions.push(eq(notificationHistory.channel, channelFilter));
    }

    if (typeFilter) {
      const validTypes = ['transactional', 'reminder', 'promotional', 'system'];
      if (!validTypes.includes(typeFilter)) {
        return NextResponse.json({ 
          error: "Invalid type. Must be one of: transactional, reminder, promotional, system",
          code: "INVALID_TYPE" 
        }, { status: 400 });
      }
      whereConditions.push(eq(notifications.type, typeFilter));
    }

    // Execute query with all conditions
    const results = await db
      .select({
        notificationId: notifications.id,
        type: notifications.type,
        channel: notificationHistory.channel,
        status: notificationHistory.status,
        occurredAt: notificationHistory.occurredAt,
        createdAt: notifications.createdAt,
        sentAt: notifications.sentAt
      })
      .from(notifications)
      .innerJoin(notificationHistory, eq(notifications.id, notificationHistory.notificationId))
      .where(and(...whereConditions));

    // Initialize metrics structure
    const summary = {
      totalSent: 0,
      totalDelivered: 0,
      totalFailed: 0,
      successRate: 0
    };

    const byChannel = {
      email: { sent: 0, delivered: 0, failed: 0, successRate: 0 },
      sms: { sent: 0, delivered: 0, failed: 0, successRate: 0 },
      push: { sent: 0, delivered: 0, failed: 0, successRate: 0 }
    };

    const byType = {
      transactional: { sent: 0, delivered: 0, failed: 0, successRate: 0 },
      reminder: { sent: 0, delivered: 0, failed: 0, successRate: 0 },
      promotional: { sent: 0, delivered: 0, failed: 0, successRate: 0 },
      system: { sent: 0, delivered: 0, failed: 0, successRate: 0 }
    };

    // Timeline data (group by date)
    const timelineMap = new Map<string, { sent: number, delivered: number, failed: number }>();

    // Process results
    for (const result of results) {
      const isSuccess = ['sent', 'delivered'].includes(result.status);
      const isFailed = ['failed', 'bounced'].includes(result.status);

      // Get date for timeline
      const date = new Date(result.occurredAt).toISOString().split('T')[0];
      if (!timelineMap.has(date)) {
        timelineMap.set(date, { sent: 0, delivered: 0, failed: 0 });
      }
      const timelineEntry = timelineMap.get(date)!;

      // Update summary
      summary.totalSent++;
      if (isSuccess) {
        summary.totalDelivered++;
        if (result.status === 'delivered') {
          timelineEntry.delivered++;
        } else {
          timelineEntry.sent++;
        }
      } else if (isFailed) {
        summary.totalFailed++;
        timelineEntry.failed++;
      }

      // Update by channel
      if (byChannel[result.channel as keyof typeof byChannel]) {
        const channelStats = byChannel[result.channel as keyof typeof byChannel];
        channelStats.sent++;
        if (isSuccess) {
          channelStats.delivered++;
        } else if (isFailed) {
          channelStats.failed++;
        }
      }

      // Update by type
      if (byType[result.type as keyof typeof byType]) {
        const typeStats = byType[result.type as keyof typeof byType];
        typeStats.sent++;
        if (isSuccess) {
          typeStats.delivered++;
        } else if (isFailed) {
          typeStats.failed++;
        }
      }
    }

    // Calculate success rates
    summary.successRate = summary.totalSent > 0 
      ? Math.round((summary.totalDelivered / summary.totalSent) * 100) 
      : 0;

    // Calculate channel success rates
    Object.keys(byChannel).forEach(channel => {
      const channelData = byChannel[channel as keyof typeof byChannel];
      channelData.successRate = channelData.sent > 0 
        ? Math.round((channelData.delivered / channelData.sent) * 100) 
        : 0;
    });

    // Calculate type success rates
    Object.keys(byType).forEach(type => {
      const typeData = byType[type as keyof typeof byType];
      typeData.successRate = typeData.sent > 0 
        ? Math.round((typeData.delivered / typeData.sent) * 100) 
        : 0;
    });

    // Convert timeline map to sorted array
    const timeline = Array.from(timelineMap.entries())
      .map(([date, stats]) => ({ date, ...stats }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json({
      summary,
      byChannel,
      byType,
      timeline
    });

  } catch (error) {
    console.error('GET /api/notification/metrics error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}