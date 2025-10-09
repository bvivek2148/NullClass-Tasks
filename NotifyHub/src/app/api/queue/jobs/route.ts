import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { queueJobs, notifications } from '@/db/schema';
import { eq, like, and, or, desc, asc, inArray } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse and validate pagination parameters
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');
    let limit = 20; // default limit
    let offset = 0; // default offset
    
    if (limitParam) {
      const parsedLimit = parseInt(limitParam);
      if (isNaN(parsedLimit) || parsedLimit < 1) {
        return NextResponse.json({ 
          error: 'Invalid limit parameter. Must be a positive integer.',
          code: 'INVALID_LIMIT' 
        }, { status: 400 });
      }
      limit = Math.min(parsedLimit, 100); // max limit of 100
    }
    
    if (offsetParam) {
      const parsedOffset = parseInt(offsetParam);
      if (isNaN(parsedOffset) || parsedOffset < 0) {
        return NextResponse.json({ 
          error: 'Invalid offset parameter. Must be a non-negative integer.',
          code: 'INVALID_OFFSET' 
        }, { status: 400 });
      }
      offset = parsedOffset;
    }
    
    // Parse and validate status filter
    const statusParam = searchParams.get('status');
    let statusFilter: string[] = [];
    if (statusParam) {
      statusFilter = statusParam.split(',').map(s => s.trim());
      const validStatuses = ['pending', 'active', 'completed', 'failed', 'delayed', 'waiting'];
      const invalidStatuses = statusFilter.filter(s => !validStatuses.includes(s));
      if (invalidStatuses.length > 0) {
        return NextResponse.json({ 
          error: `Invalid status values: ${invalidStatuses.join(', ')}. Valid values are: ${validStatuses.join(', ')}`,
          code: 'INVALID_STATUS' 
        }, { status: 400 });
      }
    }
    
    // Parse and validate queue filter
    const queueParam = searchParams.get('queue');
    let queueFilter: string[] = [];
    if (queueParam) {
      queueFilter = queueParam.split(',').map(q => q.trim());
      const validQueues = ['email', 'sms', 'push', 'webhook', 'default'];
      const invalidQueues = queueFilter.filter(q => !validQueues.includes(q));
      if (invalidQueues.length > 0) {
        return NextResponse.json({ 
          error: `Invalid queue values: ${invalidQueues.join(', ')}. Valid values are: ${validQueues.join(', ')}`,
          code: 'INVALID_QUEUE' 
        }, { status: 400 });
      }
    }
    
    // Parse and validate priority filter
    const priorityParam = searchParams.get('priority');
    let priorityFilter: number[] = [];
    if (priorityParam) {
      const priorities = priorityParam.split(',').map(p => p.trim());
      for (const p of priorities) {
        const priority = parseInt(p);
        if (isNaN(priority) || priority < 1 || priority > 10) {
          return NextResponse.json({ 
            error: 'Invalid priority values. Must be integers between 1 and 10.',
            code: 'INVALID_PRIORITY' 
          }, { status: 400 });
        }
        priorityFilter.push(priority);
      }
    }
    
    // Parse and validate sorting parameters
    const sortParam = searchParams.get('sort');
    const orderParam = searchParams.get('order');
    let sortField = 'createdAt'; // default sort field
    let sortOrder = 'desc'; // default sort order
    
    if (sortParam) {
      const validSortFields = ['createdAt', 'priority', 'attempts', 'processedAt', 'failedAt', 'completedAt'];
      if (!validSortFields.includes(sortParam)) {
        return NextResponse.json({ 
          error: `Invalid sort field. Valid values are: ${validSortFields.join(', ')}`,
          code: 'INVALID_SORT_FIELD' 
        }, { status: 400 });
      }
      sortField = sortParam;
    }
    
    if (orderParam) {
      if (!['asc', 'desc'].includes(orderParam.toLowerCase())) {
        return NextResponse.json({ 
          error: 'Invalid order parameter. Valid values are: asc, desc',
          code: 'INVALID_ORDER' 
        }, { status: 400 });
      }
      sortOrder = orderParam.toLowerCase();
    }
    
    // Build the query with join
    let query = db
      .select({
        id: queueJobs.id,
        notificationId: queueJobs.notificationId,
        jobId: queueJobs.jobId,
        queue: queueJobs.queue,
        priority: queueJobs.priority,
        status: queueJobs.status,
        attempts: queueJobs.attempts,
        processedAt: queueJobs.processedAt,
        failedAt: queueJobs.failedAt,
        completedAt: queueJobs.completedAt,
        error: queueJobs.error,
        createdAt: queueJobs.createdAt,
        updatedAt: queueJobs.updatedAt,
        notificationTitle: notifications.title,
        notificationType: notifications.type,
        notificationUserId: notifications.userId,
      })
      .from(queueJobs)
      .leftJoin(notifications, eq(queueJobs.notificationId, notifications.id));
    
    // Apply filters
    const conditions = [];
    
    if (statusFilter.length > 0) {
      conditions.push(inArray(queueJobs.status, statusFilter));
    }
    
    if (queueFilter.length > 0) {
      conditions.push(inArray(queueJobs.queue, queueFilter));
    }
    
    if (priorityFilter.length > 0) {
      conditions.push(inArray(queueJobs.priority, priorityFilter));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    // Apply sorting
    const sortColumn = queueJobs[sortField as keyof typeof queueJobs];
    if (sortOrder === 'asc') {
      query = query.orderBy(asc(sortColumn));
    } else {
      query = query.orderBy(desc(sortColumn));
    }
    
    // Apply pagination
    const results = await query.limit(limit).offset(offset);
    
    return NextResponse.json(results, { status: 200 });
    
  } catch (error) {
    console.error('GET queue jobs error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}