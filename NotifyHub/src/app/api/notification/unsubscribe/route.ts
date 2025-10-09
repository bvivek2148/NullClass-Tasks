import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { notificationPreferences, users } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import * as jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return new NextResponse(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Unsubscribe - Missing Token</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; text-align: center; }
              .error { color: #dc3545; }
            </style>
          </head>
          <body>
            <h1 class="error">Invalid Unsubscribe Link</h1>
            <p>The unsubscribe token is missing or invalid. Please use the unsubscribe link from your email.</p>
          </body>
        </html>
      `, {
        status: 400,
        headers: { 'Content-Type': 'text/html' }
      });
    }

    const unsubscribeSecret = process.env.UNSUBSCRIBE_SECRET;
    if (!unsubscribeSecret) {
      console.error('UNSUBSCRIBE_SECRET environment variable is not set');
      return new NextResponse(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Unsubscribe - Configuration Error</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; text-align: center; }
              .error { color: #dc3545; }
            </style>
          </head>
          <body>
            <h1 class="error">Configuration Error</h1>
            <p>The unsubscribe service is temporarily unavailable. Please try again later.</p>
          </body>
        </html>
      `, {
        status: 500,
        headers: { 'Content-Type': 'text/html' }
      });
    }

    let payload: any;
    try {
      payload = jwt.verify(token, unsubscribeSecret);
    } catch (jwtError: any) {
      let errorMessage = 'The unsubscribe token is invalid or has expired.';
      if (jwtError.name === 'TokenExpiredError') {
        errorMessage = 'The unsubscribe token has expired. Please use a newer unsubscribe link from your email.';
      } else if (jwtError.name === 'JsonWebTokenError') {
        errorMessage = 'The unsubscribe token is malformed or invalid.';
      }

      return new NextResponse(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Unsubscribe - Invalid Token</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; text-align: center; }
              .error { color: #dc3545; }
            </style>
          </head>
          <body>
            <h1 class="error">Invalid Unsubscribe Token</h1>
            <p>${errorMessage}</p>
          </body>
        </html>
      `, {
        status: 400,
        headers: { 'Content-Type': 'text/html' }
      });
    }

    if (!payload.userId || typeof payload.userId !== 'number' || payload.type !== 'unsubscribe') {
      return new NextResponse(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Unsubscribe - Invalid Token</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; text-align: center; }
              .error { color: #dc3545; }
            </style>
          </head>
          <body>
            <h1 class="error">Invalid Token</h1>
            <p>The unsubscribe token format is invalid. Please use the unsubscribe link from your email.</p>
          </body>
        </html>
      `, {
        status: 400,
        headers: { 'Content-Type': 'text/html' }
      });
    }

    const userId = payload.userId;

    // Verify user exists
    const userCheck = await db.select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (userCheck.length === 0) {
      return new NextResponse(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Unsubscribe - User Not Found</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; text-align: center; }
              .error { color: #dc3545; }
            </style>
          </head>
          <body>
            <h1 class="error">User Not Found</h1>
            <p>The user associated with this unsubscribe token could not be found.</p>
          </body>
        </html>
      `, {
        status: 404,
        headers: { 'Content-Type': 'text/html' }
      });
    }

    const currentTime = new Date().toISOString();
    const notificationTypes = ['promotional', 'reminder'];

    // Process each notification type
    for (const type of notificationTypes) {
      // Check if preference already exists
      const existingPreference = await db.select()
        .from(notificationPreferences)
        .where(and(
          eq(notificationPreferences.userId, userId),
          eq(notificationPreferences.type, type),
          eq(notificationPreferences.channel, 'email')
        ))
        .limit(1);

      if (existingPreference.length > 0) {
        // Update existing preference
        await db.update(notificationPreferences)
          .set({
            enabled: false,
            updatedAt: currentTime
          })
          .where(and(
            eq(notificationPreferences.userId, userId),
            eq(notificationPreferences.type, type),
            eq(notificationPreferences.channel, 'email')
          ));
      } else {
        // Create new preference with enabled=false
        await db.insert(notificationPreferences)
          .values({
            userId,
            type,
            channel: 'email',
            enabled: false,
            createdAt: currentTime,
            updatedAt: currentTime
          });
      }
    }

    return new NextResponse(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Successfully Unsubscribed</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 40px; 
              text-align: center; 
              background-color: #f8f9fa;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: white;
              padding: 40px;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .success { color: #28a745; }
            .info { color: #6c757d; margin-top: 20px; }
            h1 { margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1 class="success">✓ Successfully Unsubscribed</h1>
            <p>You have been successfully unsubscribed from promotional and reminder email notifications.</p>
            <p class="info">You will no longer receive these types of emails. If you change your mind, you can update your notification preferences in your account settings.</p>
          </div>
        </body>
      </html>
    `, {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });

  } catch (error) {
    console.error('Unsubscribe error:', error);
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Unsubscribe - Error</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; text-align: center; }
            .error { color: #dc3545; }
          </style>
        </head>
        <body>
          <h1 class="error">Unsubscribe Error</h1>
          <p>An error occurred while processing your unsubscribe request. Please try again later or contact support.</p>
        </body>
      </html>
    `, {
      status: 500,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}