import { db } from '@/db';
import { templates, templateVersions, templateLocales } from '@/db/schema';

async function main() {
    const now = new Date().toISOString();
    
    // 1. booking.confirmation
    const [bookingConfTemplate] = await db.insert(templates).values({
        key: 'booking.confirmation',
        defaultLocale: 'en',
        createdAt: now,
        updatedAt: now,
    }).returning();

    const [bookingEmailVer] = await db.insert(templateVersions).values({
        templateId: bookingConfTemplate.id,
        channel: 'email',
        version: 1,
        status: 'active',
        createdAt: now,
    }).returning();

    await db.insert(templateLocales).values([
        {
            templateVersionId: bookingEmailVer.id,
            locale: 'en',
            subject: 'Booking Confirmed: {{booking.id}}',
            text: 'Hi {{booking.customerName}},\n\nYour booking {{booking.id}} is confirmed for {{booking.date}} at {{booking.time}}.\nLocation: {{booking.location}}\n{{#if booking.specialRequests}}Special requests: {{booking.specialRequests}}{{/if}}\nTotal: ${{booking.total}}\n\nThank you!',
            html: '<h1>Booking Confirmed</h1><p>Hi {{booking.customerName}},</p><p>Your booking <strong>{{booking.id}}</strong> is confirmed.</p><ul><li>Date: {{booking.date}}</li><li>Time: {{booking.time}}</li><li>Location: {{booking.location}}</li>{{#if booking.specialRequests}}<li>Special requests: {{booking.specialRequests}}</li>{{/if}}</ul>{{#if booking.items}}<h3>Items:</h3><ul>{{#each booking.items}}<li>{{name}}: ${{price}}</li>{{/each}}</ul>{{/if}}<p><strong>Total: ${{booking.total}}</strong></p>',
        },
        {
            templateVersionId: bookingEmailVer.id,
            locale: 'es',
            subject: 'Reserva Confirmada: {{booking.id}}',
            text: 'Hola {{booking.customerName}},\n\nSu reserva {{booking.id}} está confirmada para {{booking.date}} a las {{booking.time}}.\nUbicación: {{booking.location}}\n{{#if booking.specialRequests}}Solicitudes especiales: {{booking.specialRequests}}{{/if}}\nTotal: ${{booking.total}}\n\n¡Gracias!',
            html: null,
        },
    ]);

    const [bookingSmsVer] = await db.insert(templateVersions).values({
        templateId: bookingConfTemplate.id,
        channel: 'sms',
        version: 1,
        status: 'active',
        createdAt: now,
    }).returning();

    await db.insert(templateLocales).values({
        templateVersionId: bookingSmsVer.id,
        locale: 'en',
        subject: null,
        text: 'Booking {{booking.id}} confirmed for {{booking.date}} at {{booking.time}}. Location: {{booking.location}}. Total: ${{booking.total}}',
        html: null,
    });

    const [bookingPushVer] = await db.insert(templateVersions).values({
        templateId: bookingConfTemplate.id,
        channel: 'push',
        version: 1,
        status: 'active',
        createdAt: now,
    }).returning();

    await db.insert(templateLocales).values({
        templateVersionId: bookingPushVer.id,
        locale: 'en',
        subject: null,
        text: 'Booking confirmed: {{booking.id}}',
        html: null,
    });

    // 2. booking.cancellation
    const [bookingCancelTemplate] = await db.insert(templates).values({
        key: 'booking.cancellation',
        defaultLocale: 'en',
        createdAt: now,
        updatedAt: now,
    }).returning();

    const [cancelEmailVer] = await db.insert(templateVersions).values({
        templateId: bookingCancelTemplate.id,
        channel: 'email',
        version: 1,
        status: 'active',
        createdAt: now,
    }).returning();

    await db.insert(templateLocales).values({
        templateVersionId: cancelEmailVer.id,
        locale: 'en',
        subject: 'Booking Cancelled: {{booking.id}}',
        text: 'Hi {{booking.customerName}},\n\nYour booking {{booking.id}} scheduled for {{booking.date}} has been cancelled.\nRefund amount: ${{booking.refundAmount}}\n\nReason: {{booking.cancellationReason}}',
        html: null,
    });

    const [cancelSmsVer] = await db.insert(templateVersions).values({
        templateId: bookingCancelTemplate.id,
        channel: 'sms',
        version: 1,
        status: 'active',
        createdAt: now,
    }).returning();

    await db.insert(templateLocales).values({
        templateVersionId: cancelSmsVer.id,
        locale: 'en',
        subject: null,
        text: 'Booking {{booking.id}} cancelled. Refund: ${{booking.refundAmount}}',
        html: null,
    });

    // 3. promo.offer
    const [promoTemplate] = await db.insert(templates).values({
        key: 'promo.offer',
        defaultLocale: 'en',
        createdAt: now,
        updatedAt: now,
    }).returning();

    const [promoEmailVer] = await db.insert(templateVersions).values({
        templateId: promoTemplate.id,
        channel: 'email',
        version: 1,
        status: 'active',
        createdAt: now,
    }).returning();

    await db.insert(templateLocales).values([
        {
            templateVersionId: promoEmailVer.id,
            locale: 'en',
            subject: 'Special Offer: {{offer.discount}}% Off!',
            text: 'Hi {{customer.name}},\n\nGet {{offer.discount}}% off with code {{offer.code}}!\nValid until {{offer.expires}}.\nMinimum purchase: ${{offer.minPurchase}}\n\nShop now: {{offer.shopUrl}}',
            html: '<h1>Special Offer Just for You!</h1><p>Hi {{customer.name}},</p><p>Get <strong>{{offer.discount}}%</strong> off your next purchase!</p><p>Use code: <code>{{offer.code}}</code></p><ul><li>Valid until: {{offer.expires}}</li><li>Minimum purchase: ${{offer.minPurchase}}</li></ul><a href="{{offer.shopUrl}}">Shop Now</a>',
        },
        {
            templateVersionId: promoEmailVer.id,
            locale: 'es',
            subject: 'Oferta Especial: {{offer.discount}}% de Descuento!',
            text: 'Hola {{customer.name}},\n\n¡Obtén {{offer.discount}}% de descuento con el código {{offer.code}}!\nVálido hasta {{offer.expires}}.\nCompra mínima: ${{offer.minPurchase}}\n\nCompra ahora: {{offer.shopUrl}}',
            html: null,
        },
    ]);

    const [promoPushVer] = await db.insert(templateVersions).values({
        templateId: promoTemplate.id,
        channel: 'push',
        version: 1,
        status: 'active',
        createdAt: now,
    }).returning();

    await db.insert(templateLocales).values({
        templateVersionId: promoPushVer.id,
        locale: 'en',
        subject: null,
        text: '{{offer.discount}}% off with code {{offer.code}}! Valid until {{offer.expires}}',
        html: null,
    });

    console.log('✅ Notification templates seeded successfully');
    console.log('  - booking.confirmation (email: en,es | sms: en | push: en)');
    console.log('  - booking.cancellation (email: en | sms: en)');
    console.log('  - promo.offer (email: en,es | push: en)');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
    process.exit(1);
});