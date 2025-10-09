import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { notificationHistory, notifications } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

const SUPPORTED_PROVIDERS = ['sendgrid', 'twilio', 'fcm', 'onesignal'];

// Status mapping for each provider
const STATUS_MAPPINGS = {
  sendgrid: {
    processed: 'queued',
    deferred: 'queued',
    delivered: 'delivered',
    open: 'opened',
    click: 'clicked',
    bounce: 'bounced',
    dropped: 'failed',
    spamreport: 'failed',
    unsubscribe: 'failed',
    group_unsubscribe: 'failed',
    group_resubscribe: 'failed'
  },
  twilio: {
    queued: 'queued',
    sending: 'sending',
    sent: 'sent',
    delivered: 'delivered',
    undelivered: 'failed',
    failed: 'failed',
    read: 'opened'
  },
  fcm: {
    sent: 'sent',
    delivered: 'delivered',
    failed: 'failed'
  },
  onesignal: {
    sent: 'sent',
    delivered: 'delivered',
    clicked: 'clicked',
    failed: 'failed'
  }
};

function validateApiKey(request: NextRequest): boolean {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return true; // No API key configured, skip validation

  const requestApiKey = request.headers.get('X-API-KEY') || request.headers.get('x-api-key');
  return requestApiKey === apiKey;
}

function mapProviderStatus(provider: string, providerStatus: string): string {
  const mapping = STATUS_MAPPINGS[provider as keyof typeof STATUS_MAPPINGS];
  return mapping?.[providerStatus as keyof typeof mapping] || 'failed';
}

async function processSendGridWebhook(events: any[]): Promise<any[]> {
  const processedEvents = [];
  
  for (const event of events) {
    const { event: eventType, sg_message_id, timestamp, reason } = event;
    
    processedEvents.push({
      providerMessageId: sg_message_id,
      status: mapProviderStatus('sendgrid', eventType),
      error: reason || null,
      occurredAt: timestamp ? new Date(timestamp * 1000).toISOString() : new Date().toISOString()
    });
  }
  
  return processedEvents;
}

async function processTwilioWebhook(payload: any): Promise<any[]> {
  const { MessageStatus, MessageSid, ErrorCode, ErrorMessage } = payload;
  
  return [{
    providerMessageId: MessageSid,
    status: mapProviderStatus('twilio', MessageStatus),
    error: ErrorMessage || null,
    occurredAt: new Date().toISOString()
  }];
}

async function processFcmWebhook(payload: any): Promise<any[]> {
  const { message_id, status, error_message } = payload;
  
  return [{
    providerMessageId: message_id,
    status: mapProviderStatus('fcm', status),
    error: error_message || null,
    occurredAt: new Date().toISOString()
  }];
}

async function processOneSignalWebhook(payload: any): Promise<any[]> {
  const { id, event, timestamp, error } = payload;
  
  return [{
    providerMessageId: id,
    status: mapProviderStatus('onesignal', event),
    error: error || null,
    occurredAt: timestamp ? new Date(timestamp).toISOString() : new Date().toISOString()
  }];
}

export async function POST(request: NextRequest, { params }: { params: { provider: string } }) {
  try {
    const { provider } = params;
    
    // Validate provider parameter
    if (!provider || !SUPPORTED_PROVIDERS.includes(provider.toLowerCase())) {
      return NextResponse.json({ 
        error: "Invalid or unsupported provider",
        code: "INVALID_PROVIDER" 
      }, { status: 400 });
    }
    
    // Validate API key if configured
    if (!validateApiKey(request)) {
      return NextResponse.json({ 
        error: "Invalid API key",
        code: "INVALID_API_KEY" 
      }, { status: 401 });
    }
    
    const body = await request.json();
    
    if (!body) {
      return NextResponse.json({ 
        error: "Request body is required",
        code: "MISSING_BODY" 
      }, { status: 400 });
    }
    
    let processedEvents: any[] = [];
    
    // Process webhook based on provider
    try {
      switch (provider.toLowerCase()) {
        case 'sendgrid':
          if (!Array.isArray(body)) {
            return NextResponse.json({ 
              error: "SendGrid webhook expects an array of events",
              code: "INVALID_SENDGRID_PAYLOAD" 
            }, { status: 400 });
          }
          processedEvents = await processSendGridWebhook(body);
          break;
          
        case 'twilio':
          processedEvents = await processTwilioWebhook(body);
          break;
          
        case 'fcm':
          processedEvents = await processFcmWebhook(body);
          break;
          
        case 'onesignal':
          processedEvents = await processOneSignalWebhook(body);
          break;
          
        default:
          return NextResponse.json({ 
            error: "Provider not implemented",
            code: "PROVIDER_NOT_IMPLEMENTED" 
          }, { status: 400 });
      }
    } catch (error) {
      return NextResponse.json({ 
        error: "Failed to process webhook payload: " + error,
        code: "PAYLOAD_PROCESSING_ERROR" 
      }, { status: 400 });
    }
    
    if (processedEvents.length === 0) {
      return NextResponse.json({ 
        error: "No valid events found in webhook payload",
        code: "NO_EVENTS_FOUND" 
      }, { status: 400 });
    }
    
    // Update notification history for each event
    const updatedRecords = [];
    
    for (const event of processedEvents) {
      try {
        // Find the notification by provider message ID
        const existingHistory = await db.select()
          .from(notificationHistory)
          .where(eq(notificationHistory.providerMessageId, event.providerMessageId))
          .limit(1);
        
        let notificationId = null;
        let attempt = 1;
        let channel = 'email'; // Default channel
        
        if (existingHistory.length > 0) {
          notificationId = existingHistory[0].notificationId;
          attempt = existingHistory[0].attempt + 1;
          channel = existingHistory[0].channel;
        } else {
          // Try to find notification by searching existing history or notifications table
          // This is a fallback - ideally provider message ID should always exist in history
          continue; // Skip if we can't find the original notification
        }
        
        // Insert new history record
        const historyRecord = await db.insert(notificationHistory)
          .values({
            notificationId,
            channel,
            status: event.status,
            provider: provider.toLowerCase(),
            providerMessageId: event.providerMessageId,
            attempt,
            error: event.error,
            occurredAt: event.occurredAt
          })
          .returning();
        
        // Update the main notification status if this is a final status
        if (['delivered', 'failed', 'bounced'].includes(event.status)) {
          await db.update(notifications)
            .set({
              status: event.status,
              error: event.error,
              updatedAt: new Date().toISOString()
            })
            .where(eq(notifications.id, notificationId));
        }
        
        updatedRecords.push(historyRecord[0]);
        
      } catch (dbError) {
        console.error(`Failed to update notification history for message ${event.providerMessageId}:`, dbError);
        // Continue processing other events even if one fails
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      processed: updatedRecords.length,
      total: processedEvents.length
    }, { status: 200 });
    
  } catch (error) {
    console.error('POST provider webhook error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}