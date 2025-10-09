import { db } from '@/db';
import { templates } from '@/db/schema';

async function main() {
    const sampleTemplates = [
        {
            key: 'booking.confirmation',
            defaultLocale: 'en',
            createdAt: new Date('2024-01-15').toISOString(),
            updatedAt: new Date('2024-01-15').toISOString(),
        },
        {
            key: 'journey.reminder',
            defaultLocale: 'en',
            createdAt: new Date('2024-01-16').toISOString(),
            updatedAt: new Date('2024-01-16').toISOString(),
        },
        {
            key: 'travel.offer',
            defaultLocale: 'en',
            createdAt: new Date('2024-01-17').toISOString(),
            updatedAt: new Date('2024-01-17').toISOString(),
        },
        {
            key: 'booking.cancellation',
            defaultLocale: 'en',
            createdAt: new Date('2024-01-18').toISOString(),
            updatedAt: new Date('2024-01-18').toISOString(),
        },
        {
            key: 'payment.confirmation',
            defaultLocale: 'en',
            createdAt: new Date('2024-01-19').toISOString(),
            updatedAt: new Date('2024-01-19').toISOString(),
        },
        {
            key: 'refund.processed',
            defaultLocale: 'en',
            createdAt: new Date('2024-01-20').toISOString(),
            updatedAt: new Date('2024-01-20').toISOString(),
        },
        {
            key: 'festival.travel.special',
            defaultLocale: 'hi',
            createdAt: new Date('2024-01-21').toISOString(),
            updatedAt: new Date('2024-01-21').toISOString(),
        },
        {
            key: 'delay.notification',
            defaultLocale: 'en',
            createdAt: new Date('2024-01-22').toISOString(),
            updatedAt: new Date('2024-01-22').toISOString(),
        }
    ];

    await db.insert(templates).values(sampleTemplates);
    
    console.log('✅ Templates seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});