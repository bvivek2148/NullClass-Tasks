import { db } from '@/db';
import { notificationHistory } from '@/db/schema';

async function main() {
    const sampleNotificationHistory = [
        // Notification 1 - Email Success Flow (SendGrid)
        {
            notificationId: 1,
            channel: 'email',
            status: 'queued',
            provider: 'sendgrid',
            providerMessageId: null,
            attempt: 0,
            error: null,
            occurredAt: new Date('2024-01-15T10:00:00Z').toISOString(),
        },
        {
            notificationId: 1,
            channel: 'email',
            status: 'sent',
            provider: 'sendgrid',
            providerMessageId: 'sg_14.0b3d.89a2c1f.0123456789abcdef@sendgrid.net',
            attempt: 1,
            error: null,
            occurredAt: new Date('2024-01-15T10:00:15Z').toISOString(),
        },
        {
            notificationId: 1,
            channel: 'email',
            status: 'delivered',
            provider: 'sendgrid',
            providerMessageId: 'sg_14.0b3d.89a2c1f.0123456789abcdef@sendgrid.net',
            attempt: 1,
            error: null,
            occurredAt: new Date('2024-01-15T10:01:30Z').toISOString(),
        },

        // Notification 2 - SMS Success Flow (TextLocal)
        {
            notificationId: 2,
            channel: 'sms',
            status: 'queued',
            provider: 'textlocal',
            providerMessageId: null,
            attempt: 0,
            error: null,
            occurredAt: new Date('2024-01-15T10:05:00Z').toISOString(),
        },
        {
            notificationId: 2,
            channel: 'sms',
            status: 'sent',
            provider: 'textlocal',
            providerMessageId: 'TL_919876543210_1642234500',
            attempt: 1,
            error: null,
            occurredAt: new Date('2024-01-15T10:05:10Z').toISOString(),
        },
        {
            notificationId: 2,
            channel: 'sms',
            status: 'delivered',
            provider: 'textlocal',
            providerMessageId: 'TL_919876543210_1642234500',
            attempt: 1,
            error: null,
            occurredAt: new Date('2024-01-15T10:05:45Z').toISOString(),
        },

        // Notification 3 - SMS Failure with Retry (Invalid Number)
        {
            notificationId: 3,
            channel: 'sms',
            status: 'queued',
            provider: 'textlocal',
            providerMessageId: null,
            attempt: 0,
            error: null,
            occurredAt: new Date('2024-01-15T10:10:00Z').toISOString(),
        },
        {
            notificationId: 3,
            channel: 'sms',
            status: 'failed',
            provider: 'textlocal',
            providerMessageId: 'TL_919999999999_1642234700',
            attempt: 1,
            error: 'Invalid mobile number: Number not in service',
            occurredAt: new Date('2024-01-15T10:10:20Z').toISOString(),
        },
        {
            notificationId: 3,
            channel: 'sms',
            status: 'failed',
            provider: 'textlocal',
            providerMessageId: 'TL_919999999999_1642234820',
            attempt: 2,
            error: 'Invalid mobile number: Number not in service',
            occurredAt: new Date('2024-01-15T10:15:20Z').toISOString(),
        },

        // Notification 4 - Push Success (FCM)
        {
            notificationId: 4,
            channel: 'push',
            status: 'queued',
            provider: 'fcm',
            providerMessageId: null,
            attempt: 0,
            error: null,
            occurredAt: new Date('2024-01-15T10:20:00Z').toISOString(),
        },
        {
            notificationId: 4,
            channel: 'push',
            status: 'sent',
            provider: 'fcm',
            providerMessageId: 'fcm_1:234567890123:android:a1b2c3d4e5f6g7h8',
            attempt: 1,
            error: null,
            occurredAt: new Date('2024-01-15T10:20:05Z').toISOString(),
        },
        {
            notificationId: 4,
            channel: 'push',
            status: 'delivered',
            provider: 'fcm',
            providerMessageId: 'fcm_1:234567890123:android:a1b2c3d4e5f6g7h8',
            attempt: 1,
            error: null,
            occurredAt: new Date('2024-01-15T10:20:08Z').toISOString(),
        },

        // Notification 5 - Email Bounce (SendGrid)
        {
            notificationId: 5,
            channel: 'email',
            status: 'queued',
            provider: 'sendgrid',
            providerMessageId: null,
            attempt: 0,
            error: null,
            occurredAt: new Date('2024-01-15T10:25:00Z').toISOString(),
        },
        {
            notificationId: 5,
            channel: 'email',
            status: 'sent',
            provider: 'sendgrid',
            providerMessageId: 'sg_14.0b3d.89a2c1f.bounced123456@sendgrid.net',
            attempt: 1,
            error: null,
            occurredAt: new Date('2024-01-15T10:25:12Z').toISOString(),
        },
        {
            notificationId: 5,
            channel: 'email',
            status: 'failed',
            provider: 'sendgrid',
            providerMessageId: 'sg_14.0b3d.89a2c1f.bounced123456@sendgrid.net',
            attempt: 1,
            error: 'Email bounced: Invalid recipient email domain',
            occurredAt: new Date('2024-01-15T10:26:45Z').toISOString(),
        },

        // Notification 6 - SMS DND Error (TextLocal)
        {
            notificationId: 6,
            channel: 'sms',
            status: 'queued',
            provider: 'textlocal',
            providerMessageId: null,
            attempt: 0,
            error: null,
            occurredAt: new Date('2024-01-15T11:00:00Z').toISOString(),
        },
        {
            notificationId: 6,
            channel: 'sms',
            status: 'failed',
            provider: 'textlocal',
            providerMessageId: 'TL_919123456789_1642237200',
            attempt: 1,
            error: 'DND (Do Not Disturb) number: Promotional SMS blocked',
            occurredAt: new Date('2024-01-15T11:00:15Z').toISOString(),
        },

        // Notification 7 - Push Token Invalid (FCM)
        {
            notificationId: 7,
            channel: 'push',
            status: 'queued',
            provider: 'fcm',
            providerMessageId: null,
            attempt: 0,
            error: null,
            occurredAt: new Date('2024-01-15T11:05:00Z').toISOString(),
        },
        {
            notificationId: 7,
            channel: 'push',
            status: 'failed',
            provider: 'fcm',
            providerMessageId: null,
            attempt: 1,
            error: 'Invalid registration token: Token expired or device uninstalled app',
            occurredAt: new Date('2024-01-15T11:05:10Z').toISOString(),
        },

        // Notification 8 - SMS Success to Mumbai Number
        {
            notificationId: 8,
            channel: 'sms',
            status: 'queued',
            provider: 'textlocal',
            providerMessageId: null,
            attempt: 0,
            error: null,
            occurredAt: new Date('2024-01-15T11:10:00Z').toISOString(),
        },
        {
            notificationId: 8,
            channel: 'sms',
            status: 'sent',
            provider: 'textlocal',
            providerMessageId: 'TL_919987654321_1642237800',
            attempt: 1,
            error: null,
            occurredAt: new Date('2024-01-15T11:10:08Z').toISOString(),
        },
        {
            notificationId: 8,
            channel: 'sms',
            status: 'delivered',
            provider: 'textlocal',
            providerMessageId: 'TL_919987654321_1642237800',
            attempt: 1,
            error: null,
            occurredAt: new Date('2024-01-15T11:10:25Z').toISOString(),
        },

        // Notification 9 - Email Success to Gmail India
        {
            notificationId: 9,
            channel: 'email',
            status: 'queued',
            provider: 'sendgrid',
            providerMessageId: null,
            attempt: 0,
            error: null,
            occurredAt: new Date('2024-01-15T11:15:00Z').toISOString(),
        },
        {
            notificationId: 9,
            channel: 'email',
            status: 'sent',
            provider: 'sendgrid',
            providerMessageId: 'sg_14.0b3d.89a2c1f.india789012@sendgrid.net',
            attempt: 1,
            error: null,
            occurredAt: new Date('2024-01-15T11:15:20Z').toISOString(),
        },
        {
            notificationId: 9,
            channel: 'email',
            status: 'delivered',
            provider: 'sendgrid',
            providerMessageId: 'sg_14.0b3d.89a2c1f.india789012@sendgrid.net',
            attempt: 1,
            error: null,
            occurredAt: new Date('2024-01-15T11:16:45Z').toISOString(),
        },

        // Notification 10 - Push with Retry Success
        {
            notificationId: 10,
            channel: 'push',
            status: 'queued',
            provider: 'fcm',
            providerMessageId: null,
            attempt: 0,
            error: null,
            occurredAt: new Date('2024-01-15T11:20:00Z').toISOString(),
        },
        {
            notificationId: 10,
            channel: 'push',
            status: 'failed',
            provider: 'fcm',
            providerMessageId: null,
            attempt: 1,
            error: 'Network error: Temporary server unavailable',
            occurredAt: new Date('2024-01-15T11:20:10Z').toISOString(),
        },
        {
            notificationId: 10,
            channel: 'push',
            status: 'sent',
            provider: 'fcm',
            providerMessageId: 'fcm_1:987654321098:android:h8g7f6e5d4c3b2a1',
            attempt: 2,
            error: null,
            occurredAt: new Date('2024-01-15T11:25:15Z').toISOString(),
        },
    ];

    await db.insert(notificationHistory).values(sampleNotificationHistory);
    
    console.log('✅ Notification history seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});