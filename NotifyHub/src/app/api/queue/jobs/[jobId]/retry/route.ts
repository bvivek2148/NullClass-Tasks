import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { queueJobs, notifications } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const { jobId } = params;

    // Validate jobId parameter
    if (!jobId || typeof jobId !== 'string' || jobId.trim() === '') {
      return NextResponse.json({ 
        error: "Valid job ID is required",
        code: "INVALID_JOB_ID" 
      }, { status: 400 });
    }

    // Find the job record
    const job = await db.select()
      .from(queueJobs)
      .where(eq(queueJobs.jobId, jobId.trim()))
      .limit(1);

    if (job.length === 0) {
      return NextResponse.json({ 
        error: 'Job not found',
        code: "JOB_NOT_FOUND" 
      }, { status: 404 });
    }

    // Validate job is in failed status
    if (job[0].status !== 'failed') {
      return NextResponse.json({ 
        error: "Job must be in failed status to retry",
        code: "INVALID_JOB_STATUS" 
      }, { status: 400 });
    }

    const currentTimestamp = new Date().toISOString();
    const nextRetryAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes from now

    // Update the job status to pending and increment attempts
    const updatedJob = await db.update(queueJobs)
      .set({
        status: 'pending',
        attempts: job[0].attempts + 1,
        failedAt: null,
        error: null,
        updatedAt: currentTimestamp
      })
      .where(eq(queueJobs.jobId, jobId.trim()))
      .returning();

    // Update the related notification retry fields
    await db.update(notifications)
      .set({
        retryCount: (job[0].attempts || 0) + 1,
        lastRetryAt: currentTimestamp,
        nextRetryAt: nextRetryAt,
        updatedAt: currentTimestamp
      })
      .where(eq(notifications.id, job[0].notificationId));

    if (updatedJob.length === 0) {
      return NextResponse.json({ 
        error: 'Failed to update job',
        code: "UPDATE_FAILED" 
      }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Job retry initiated successfully',
      job: updatedJob[0]
    }, { status: 200 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}