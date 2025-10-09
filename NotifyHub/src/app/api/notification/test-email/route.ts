import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import nodemailer from 'nodemailer';

const testEmailSchema = z.object({
  email: z.string().email('Invalid email address format'),
  provider: z.enum(['sendgrid', 'smtp', 'auto']).optional().default('auto')
});

interface EmailProvider {
  name: string;
  isAvailable: () => boolean;
  send: (to: string) => Promise<{ success: boolean; messageId?: string; error?: string }>;
}

class SendGridProvider implements EmailProvider {
  name = 'SendGrid';

  isAvailable(): boolean {
    return !!process.env.SENDGRID_API_KEY;
  }

  async send(to: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const msg = {
        to,
        from: process.env.FROM_EMAIL || 'noreply@example.com',
        subject: 'Test Email from Notification System',
        text: 'This is a test email to verify your notification system is working correctly.',
        html: '<p>This is a test email to verify your notification system is working correctly.</p>'
      };

      const response = await sgMail.send(msg);
      return { 
        success: true, 
        messageId: response[0]?.headers?.['x-message-id'] || 'unknown'
      };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.body?.errors?.[0]?.message || error.message || 'SendGrid API error'
      };
    }
  }
}

class SMTPProvider implements EmailProvider {
  name = 'SMTP';

  isAvailable(): boolean {
    return !!(
      process.env.SMTP_HOST && 
      process.env.SMTP_PORT && 
      process.env.SMTP_USER && 
      process.env.SMTP_PASS
    );
  }

  async send(to: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_PORT === '465',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      const info = await transporter.sendMail({
        from: process.env.FROM_EMAIL || process.env.SMTP_USER,
        to,
        subject: 'Test Email from Notification System',
        text: 'This is a test email to verify your notification system is working correctly.',
        html: '<p>This is a test email to verify your notification system is working correctly.</p>'
      });

      return { 
        success: true, 
        messageId: info.messageId 
      };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'SMTP sending error'
      };
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validation = testEmailSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: validation.error.errors
      }, { status: 400 });
    }

    const { email, provider: requestedProvider } = validation.data;

    // Initialize providers
    const providers: EmailProvider[] = [
      new SendGridProvider(),
      new SMTPProvider()
    ];

    // Filter available providers
    const availableProviders = providers.filter(provider => provider.isAvailable());

    if (availableProviders.length === 0) {
      return NextResponse.json({
        error: 'No email providers configured. Please set up SendGrid (SENDGRID_API_KEY) or SMTP (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS) environment variables.',
        code: 'NO_PROVIDERS_CONFIGURED'
      }, { status: 500 });
    }

    // Select provider based on request or use auto fallback
    let selectedProvider: EmailProvider;
    
    if (requestedProvider === 'sendgrid') {
      const sendgridProvider = availableProviders.find(p => p.name === 'SendGrid');
      if (!sendgridProvider) {
        return NextResponse.json({
          error: 'SendGrid provider requested but not configured. Please set SENDGRID_API_KEY environment variable.',
          code: 'SENDGRID_NOT_CONFIGURED'
        }, { status: 400 });
      }
      selectedProvider = sendgridProvider;
    } else if (requestedProvider === 'smtp') {
      const smtpProvider = availableProviders.find(p => p.name === 'SMTP');
      if (!smtpProvider) {
        return NextResponse.json({
          error: 'SMTP provider requested but not configured. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS environment variables.',
          code: 'SMTP_NOT_CONFIGURED'
        }, { status: 400 });
      }
      selectedProvider = smtpProvider;
    } else {
      // Auto mode: prefer SendGrid, fallback to SMTP
      selectedProvider = availableProviders.find(p => p.name === 'SendGrid') || availableProviders[0];
    }

    // Attempt to send email with selected provider
    const result = await selectedProvider.send(email);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully',
        provider: selectedProvider.name,
        messageId: result.messageId,
        recipient: email
      }, { status: 200 });
    } else {
      // If auto mode and SendGrid failed, try SMTP fallback
      if (requestedProvider === 'auto' && selectedProvider.name === 'SendGrid') {
        const smtpProvider = availableProviders.find(p => p.name === 'SMTP');
        if (smtpProvider) {
          const fallbackResult = await smtpProvider.send(email);
          if (fallbackResult.success) {
            return NextResponse.json({
              success: true,
              message: 'Test email sent successfully (fallback to SMTP after SendGrid failure)',
              provider: smtpProvider.name,
              messageId: fallbackResult.messageId,
              recipient: email,
              fallback: true,
              primaryProviderError: result.error
            }, { status: 200 });
          }
        }
      }

      return NextResponse.json({
        error: 'Failed to send test email',
        code: 'EMAIL_SEND_FAILED',
        provider: selectedProvider.name,
        details: result.error
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Test email API error:', error);
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json({
        error: 'Invalid JSON in request body',
        code: 'INVALID_JSON'
      }, { status: 400 });
    }

    // Handle network/connection errors
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return NextResponse.json({
        error: 'Network error: Unable to connect to email service',
        code: 'NETWORK_ERROR',
        details: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      error: 'Internal server error: ' + error.message,
      code: 'INTERNAL_ERROR'
    }, { status: 500 });
  }
}