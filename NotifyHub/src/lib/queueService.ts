import { Queue, Worker, QueueEvents, Job } from 'bullmq';
import Redis from 'ioredis';
import { db } from '@/db';
import { notifications, notificationHistory, queueJobs } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { sendEmail } from './email';

// Redis connection configuration
const redisConnection = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null,
});

// Queue configurations with priority support
export const emailQueue = new Queue('email', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000, // Start with 2 seconds, doubles each retry
    },
    removeOnComplete: {
      count: 100, // Keep last 100 completed jobs
      age: 24 * 3600, // Remove jobs older than 24 hours
    },
    removeOnFail: {
      count: 500, // Keep last 500 failed jobs
    },
  },
});

export const smsQueue = new Queue('sms', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: { count: 100, age: 24 * 3600 },
    removeOnFail: { count: 500 },
  },
});

export const pushQueue = new Queue('push', {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: { count: 100, age: 24 * 3600 },
    removeOnFail: { count: 500 },
  },
});

// Priority mapping (1-10, higher = more urgent)
export const PRIORITY_MAP = {
  critical: 10,
  high: 7,
  normal: 5,
  low: 2,
} as const;

export type PriorityLevel = keyof typeof PRIORITY_MAP;

// Helper function to get queue by channel
export function getQueueByChannel(channel: 'email' | 'sms' | 'push'): Queue {
  switch (channel) {
    case 'email':
      return emailQueue;
    case 'sms':
      return smsQueue;
    case 'push':
      return pushQueue;
    default:
      throw new Error(`Invalid channel: ${channel}`);
  }
}

// Add notification to queue with priority
export async function addNotificationToQueue(
  channel: 'email' | 'sms' | 'push',
  data: {
    notificationId: number;
    userId: number;
    type: string;
    priority: PriorityLevel;
    templateKey?: string;
    content: any;
    to?: string;
    subject?: string;
  }
) {
  const queue = getQueueByChannel(channel);
  const priorityValue = PRIORITY_MAP[data.priority] || PRIORITY_MAP.normal;
  const jobId = `job_${channel}_${Date.now()}_${Math.random().toString(36).substring(7)}`;

  const job = await queue.add(
    `${channel}-notification`,
    data,
    {
      priority: priorityValue,
      jobId,
    }
  );

  // Record job in database
  await db.insert(queueJobs).values({
    notificationId: data.notificationId,
    jobId,
    queue: channel,
    priority: priorityValue,
    status: 'pending',
    attempts: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  return job;
}

// Failover: Try alternative channel if primary fails
export async function attemptFailover(
  notificationId: number,
  primaryChannel: 'email' | 'sms' | 'push',
  data: any
): Promise<boolean> {
  try {
    // Failover strategy: SMS → Email, Push → Email
    let failoverChannel: 'email' | null = null;
    
    if (primaryChannel === 'sms' || primaryChannel === 'push') {
      failoverChannel = 'email';
    }

    if (!failoverChannel) {
      console.log(`No failover channel available for ${primaryChannel}`);
      return false;
    }

    console.log(`Attempting failover from ${primaryChannel} to ${failoverChannel} for notification ${notificationId}`);

    // Update notification with failover status
    await db.update(notifications)
      .set({
        failoverChannel,
        failoverStatus: 'attempting',
        updatedAt: new Date().toISOString(),
      })
      .where(eq(notifications.id, notificationId));

    // Add to failover queue
    await addNotificationToQueue(failoverChannel, {
      ...data,
      notificationId,
      isFailover: true,
    });

    // Update failover status to success
    await db.update(notifications)
      .set({
        failoverStatus: 'success',
        updatedAt: new Date().toISOString(),
      })
      .where(eq(notifications.id, notificationId));

    return true;
  } catch (error) {
    console.error(`Failover failed for notification ${notificationId}:`, error);
    
    await db.update(notifications)
      .set({
        failoverStatus: 'failed',
        updatedAt: new Date().toISOString(),
      })
      .where(eq(notifications.id, notificationId));

    return false;
  }
}

// Process email notifications
async function processEmailJob(job: Job) {
  const { notificationId, to, subject, content } = job.data;
  
  try {
    // Update job status to active
    await db.update(queueJobs)
      .set({
        status: 'active',
        attempts: job.attemptsMade + 1,
        processedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(queueJobs.jobId, job.id!));

    // Send email (simulated for demo)
    console.log(`[EMAIL WORKER] Processing job ${job.id}`);
    console.log(`Sending email to ${to}: ${subject}`);
    
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate random failures for demo (10% chance)
    if (Math.random() < 0.1 && job.attemptsMade === 0) {
      throw new Error('Simulated email delivery failure');
    }

    // Update notification status
    await db.update(notifications)
      .set({
        status: 'sent',
        sentAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(notifications.id, notificationId));

    // Record success in history
    await db.insert(notificationHistory).values({
      notificationId,
      channel: 'email',
      status: 'delivered',
      provider: 'simulated',
      providerMessageId: `msg_${Date.now()}`,
      attempt: job.attemptsMade + 1,
      occurredAt: new Date().toISOString(),
    });

    // Update queue job as completed
    await db.update(queueJobs)
      .set({
        status: 'completed',
        completedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(queueJobs.jobId, job.id!));

    console.log(`[EMAIL WORKER] Job ${job.id} completed successfully`);
  } catch (error: any) {
    console.error(`[EMAIL WORKER] Job ${job.id} failed:`, error.message);
    
    // Update queue job as failed
    await db.update(queueJobs)
      .set({
        status: 'failed',
        failedAt: new Date().toISOString(),
        error: error.message,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(queueJobs.jobId, job.id!));

    // Record failure in history
    await db.insert(notificationHistory).values({
      notificationId,
      channel: 'email',
      status: 'failed',
      provider: 'simulated',
      attempt: job.attemptsMade + 1,
      error: error.message,
      occurredAt: new Date().toISOString(),
    });

    // Update notification retry tracking
    const nextRetryDelay = Math.pow(2, job.attemptsMade) * 2000; // Exponential backoff
    await db.update(notifications)
      .set({
        retryCount: job.attemptsMade + 1,
        lastRetryAt: new Date().toISOString(),
        nextRetryAt: new Date(Date.now() + nextRetryDelay).toISOString(),
        error: error.message,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(notifications.id, notificationId));

    // If this is the last attempt, try failover
    if (job.attemptsMade + 1 >= (job.opts.attempts || 3)) {
      console.log(`[EMAIL WORKER] Final attempt failed, no failover for email`);
      await db.update(notifications)
        .set({
          status: 'failed',
          updatedAt: new Date().toISOString(),
        })
        .where(eq(notifications.id, notificationId));
    }

    throw error; // Re-throw to let BullMQ handle retries
  }
}

// Process SMS notifications
async function processSmsJob(job: Job) {
  const { notificationId, to, content } = job.data;
  
  try {
    await db.update(queueJobs)
      .set({
        status: 'active',
        attempts: job.attemptsMade + 1,
        processedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(queueJobs.jobId, job.id!));

    console.log(`[SMS WORKER] Processing job ${job.id}`);
    console.log(`Sending SMS to ${to}: ${content}`);
    
    // Simulate SMS sending
    await new Promise(resolve => setTimeout(resolve, 800));

    // Simulate random failures for demo (15% chance)
    if (Math.random() < 0.15 && job.attemptsMade === 0) {
      throw new Error('Simulated SMS delivery failure');
    }

    await db.update(notifications)
      .set({
        status: 'sent',
        sentAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(notifications.id, notificationId));

    await db.insert(notificationHistory).values({
      notificationId,
      channel: 'sms',
      status: 'delivered',
      provider: 'simulated',
      providerMessageId: `sms_${Date.now()}`,
      attempt: job.attemptsMade + 1,
      occurredAt: new Date().toISOString(),
    });

    await db.update(queueJobs)
      .set({
        status: 'completed',
        completedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(queueJobs.jobId, job.id!));

    console.log(`[SMS WORKER] Job ${job.id} completed successfully`);
  } catch (error: any) {
    console.error(`[SMS WORKER] Job ${job.id} failed:`, error.message);
    
    await db.update(queueJobs)
      .set({
        status: 'failed',
        failedAt: new Date().toISOString(),
        error: error.message,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(queueJobs.jobId, job.id!));

    await db.insert(notificationHistory).values({
      notificationId,
      channel: 'sms',
      status: 'failed',
      provider: 'simulated',
      attempt: job.attemptsMade + 1,
      error: error.message,
      occurredAt: new Date().toISOString(),
    });

    const nextRetryDelay = Math.pow(2, job.attemptsMade) * 2000;
    await db.update(notifications)
      .set({
        retryCount: job.attemptsMade + 1,
        lastRetryAt: new Date().toISOString(),
        nextRetryAt: new Date(Date.now() + nextRetryDelay).toISOString(),
        error: error.message,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(notifications.id, notificationId));

    // If last attempt, trigger failover to email
    if (job.attemptsMade + 1 >= (job.opts.attempts || 3) && !job.data.isFailover) {
      console.log(`[SMS WORKER] Final attempt failed, attempting failover to email`);
      const failoverSuccess = await attemptFailover(notificationId, 'sms', job.data);
      
      if (!failoverSuccess) {
        await db.update(notifications)
          .set({
            status: 'failed',
            updatedAt: new Date().toISOString(),
          })
          .where(eq(notifications.id, notificationId));
      }
    }

    throw error;
  }
}

// Process Push notifications
async function processPushJob(job: Job) {
  const { notificationId, to, content, title } = job.data;
  
  try {
    await db.update(queueJobs)
      .set({
        status: 'active',
        attempts: job.attemptsMade + 1,
        processedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(queueJobs.jobId, job.id!));

    console.log(`[PUSH WORKER] Processing job ${job.id}`);
    console.log(`Sending push to ${to}: ${title}`);
    
    // Simulate push notification sending
    await new Promise(resolve => setTimeout(resolve, 600));

    // Simulate random failures for demo (12% chance)
    if (Math.random() < 0.12 && job.attemptsMade === 0) {
      throw new Error('Simulated push delivery failure');
    }

    await db.update(notifications)
      .set({
        status: 'sent',
        sentAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(notifications.id, notificationId));

    await db.insert(notificationHistory).values({
      notificationId,
      channel: 'push',
      status: 'delivered',
      provider: 'simulated',
      providerMessageId: `push_${Date.now()}`,
      attempt: job.attemptsMade + 1,
      occurredAt: new Date().toISOString(),
    });

    await db.update(queueJobs)
      .set({
        status: 'completed',
        completedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(queueJobs.jobId, job.id!));

    console.log(`[PUSH WORKER] Job ${job.id} completed successfully`);
  } catch (error: any) {
    console.error(`[PUSH WORKER] Job ${job.id} failed:`, error.message);
    
    await db.update(queueJobs)
      .set({
        status: 'failed',
        failedAt: new Date().toISOString(),
        error: error.message,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(queueJobs.jobId, job.id!));

    await db.insert(notificationHistory).values({
      notificationId,
      channel: 'push',
      status: 'failed',
      provider: 'simulated',
      attempt: job.attemptsMade + 1,
      error: error.message,
      occurredAt: new Date().toISOString(),
    });

    const nextRetryDelay = Math.pow(2, job.attemptsMade) * 2000;
    await db.update(notifications)
      .set({
        retryCount: job.attemptsMade + 1,
        lastRetryAt: new Date().toISOString(),
        nextRetryAt: new Date(Date.now() + nextRetryDelay).toISOString(),
        error: error.message,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(notifications.id, notificationId));

    // If last attempt, trigger failover to email
    if (job.attemptsMade + 1 >= (job.opts.attempts || 3) && !job.data.isFailover) {
      console.log(`[PUSH WORKER] Final attempt failed, attempting failover to email`);
      const failoverSuccess = await attemptFailover(notificationId, 'push', job.data);
      
      if (!failoverSuccess) {
        await db.update(notifications)
          .set({
            status: 'failed',
            updatedAt: new Date().toISOString(),
          })
          .where(eq(notifications.id, notificationId));
      }
    }

    throw error;
  }
}

// Initialize workers
export const emailWorker = new Worker('email', processEmailJob, {
  connection: redisConnection,
  concurrency: 5,
});

export const smsWorker = new Worker('sms', processSmsJob, {
  connection: redisConnection,
  concurrency: 3,
});

export const pushWorker = new Worker('push', processPushJob, {
  connection: redisConnection,
  concurrency: 10,
});

// Worker event handlers
[emailWorker, smsWorker, pushWorker].forEach(worker => {
  worker.on('completed', (job) => {
    console.log(`✅ Worker ${worker.name}: Job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(`❌ Worker ${worker.name}: Job ${job?.id} failed:`, err.message);
  });

  worker.on('error', (err) => {
    console.error(`⚠️ Worker ${worker.name} error:`, err);
  });
});

// Get queue statistics
export async function getQueueStats(queueName: 'email' | 'sms' | 'push') {
  const queue = getQueueByChannel(queueName);
  
  const [waiting, active, completed, failed, delayed] = await Promise.all([
    queue.getWaitingCount(),
    queue.getActiveCount(),
    queue.getCompletedCount(),
    queue.getFailedCount(),
    queue.getDelayedCount(),
  ]);

  return {
    waiting,
    active,
    completed,
    failed,
    delayed,
    total: waiting + active + completed + failed + delayed,
  };
}

// Get all queue statistics
export async function getAllQueueStats() {
  const [emailStats, smsStats, pushStats] = await Promise.all([
    getQueueStats('email'),
    getQueueStats('sms'),
    getQueueStats('push'),
  ]);

  return {
    email: emailStats,
    sms: smsStats,
    push: pushStats,
  };
}

// Graceful shutdown
export async function shutdownQueues() {
  await Promise.all([
    emailWorker.close(),
    smsWorker.close(),
    pushWorker.close(),
    emailQueue.close(),
    smsQueue.close(),
    pushQueue.close(),
  ]);
  await redisConnection.quit();
}