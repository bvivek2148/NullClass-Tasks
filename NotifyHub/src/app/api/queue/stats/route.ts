import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { queueJobs } from '@/db/schema';
import { eq, sql, and, gte } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Get today's date for filtering jobs processed today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISOString = today.toISOString();

    // Get queue statistics grouped by queue and status
    const queueStats = await db
      .select({
        queue: queueJobs.queue,
        status: queueJobs.status,
        count: sql<number>`count(*)`.as('count')
      })
      .from(queueJobs)
      .groupBy(queueJobs.queue, queueJobs.status);

    // Get total jobs processed today
    const processedTodayResult = await db
      .select({
        count: sql<number>`count(*)`.as('count')
      })
      .from(queueJobs)
      .where(
        and(
          gte(queueJobs.processedAt, todayISOString),
          eq(queueJobs.status, 'completed')
        )
      );

    // Get overall totals for success/failure rates
    const overallStats = await db
      .select({
        status: queueJobs.status,
        count: sql<number>`count(*)`.as('count')
      })
      .from(queueJobs)
      .groupBy(queueJobs.status);

    // Initialize queue statistics structure
    const queueStatsStructure = {
      email: { pending: 0, active: 0, completed: 0, failed: 0, delayed: 0 },
      sms: { pending: 0, active: 0, completed: 0, failed: 0, delayed: 0 },
      push: { pending: 0, active: 0, completed: 0, failed: 0, delayed: 0 }
    };

    // Populate queue statistics
    queueStats.forEach(stat => {
      const queue = stat.queue as 'email' | 'sms' | 'push';
      const status = stat.status as 'pending' | 'active' | 'completed' | 'failed' | 'delayed';
      
      if (queueStatsStructure[queue] && queueStatsStructure[queue][status] !== undefined) {
        queueStatsStructure[queue][status] = stat.count;
      }
    });

    // Calculate overall statistics
    let totalJobs = 0;
    let completedJobs = 0;
    let failedJobs = 0;

    overallStats.forEach(stat => {
      totalJobs += stat.count;
      if (stat.status === 'completed') {
        completedJobs = stat.count;
      }
      if (stat.status === 'failed') {
        failedJobs = stat.count;
      }
    });

    const successRate = totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0;
    const failureRate = totalJobs > 0 ? Math.round((failedJobs / totalJobs) * 100) : 0;
    const processedToday = processedTodayResult[0]?.count || 0;

    const response = {
      queueStats: queueStatsStructure,
      overall: {
        totalJobs,
        successRate,
        failureRate,
        processedToday
      }
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('GET queue statistics error:', error);
    return NextResponse.json({ 
      error: 'Failed to retrieve queue statistics: ' + error,
      code: 'QUEUE_STATS_ERROR' 
    }, { status: 500 });
  }
}