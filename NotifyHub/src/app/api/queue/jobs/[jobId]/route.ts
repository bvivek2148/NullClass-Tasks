import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { queueJobs } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(
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

    // Check if job exists and delete it
    const deleted = await db.delete(queueJobs)
      .where(eq(queueJobs.jobId, jobId.trim()))
      .returning();

    // Return 404 if job not found
    if (deleted.length === 0) {
      return NextResponse.json({ 
        error: 'Job not found',
        code: "JOB_NOT_FOUND" 
      }, { status: 404 });
    }

    // Return success response with deleted job information
    return NextResponse.json({
      message: 'Job deleted successfully',
      deletedJob: deleted[0]
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}