import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { templates, templateVersions, templateLocales } from '@/db/schema';
import { eq, and, max, desc } from 'drizzle-orm';

const VALID_CHANNELS = ['email', 'sms', 'push'];

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const templateId = parseInt(params.id);
    
    // Validate template ID
    if (!templateId || isNaN(templateId)) {
      return NextResponse.json({
        error: "Valid template ID is required",
        code: "INVALID_TEMPLATE_ID"
      }, { status: 400 });
    }

    // Check if template exists
    const template = await db.select()
      .from(templates)
      .where(eq(templates.id, templateId))
      .limit(1);

    if (template.length === 0) {
      return NextResponse.json({
        error: "Template not found",
        code: "TEMPLATE_NOT_FOUND"
      }, { status: 404 });
    }

    const requestBody = await request.json();
    const { channel, locales } = requestBody;

    // Validation: Required fields
    if (!channel) {
      return NextResponse.json({
        error: "Channel is required",
        code: "MISSING_CHANNEL"
      }, { status: 400 });
    }

    if (!locales || typeof locales !== 'object' || Object.keys(locales).length === 0) {
      return NextResponse.json({
        error: "Locales object with at least one locale is required",
        code: "MISSING_LOCALES"
      }, { status: 400 });
    }

    // Validate channel
    if (!VALID_CHANNELS.includes(channel)) {
      return NextResponse.json({
        error: `Channel must be one of: ${VALID_CHANNELS.join(', ')}`,
        code: "INVALID_CHANNEL"
      }, { status: 400 });
    }

    // Validate locale codes and content
    for (const [locale, content] of Object.entries(locales)) {
      // Validate locale format (2-3 characters)
      if (!/^[a-z]{2,3}$/i.test(locale)) {
        return NextResponse.json({
          error: `Invalid locale code format: ${locale}. Must be 2-3 characters`,
          code: "INVALID_LOCALE_FORMAT"
        }, { status: 400 });
      }

      const localeContent = content as any;

      // Validate content based on channel
      if (channel === 'email') {
        if (!localeContent.subject) {
          return NextResponse.json({
            error: `Subject is required for email channel in locale: ${locale}`,
            code: "MISSING_EMAIL_SUBJECT"
          }, { status: 400 });
        }
        if (!localeContent.text && !localeContent.html) {
          return NextResponse.json({
            error: `Either text or html content is required for email channel in locale: ${locale}`,
            code: "MISSING_EMAIL_CONTENT"
          }, { status: 400 });
        }
      } else if (channel === 'sms' || channel === 'push') {
        if (!localeContent.text) {
          return NextResponse.json({
            error: `Text content is required for ${channel} channel in locale: ${locale}`,
            code: "MISSING_TEXT_CONTENT"
          }, { status: 400 });
        }
      }
    }

    // Get the next version number for this template and channel
    const maxVersionResult = await db.select({ maxVersion: max(templateVersions.version) })
      .from(templateVersions)
      .where(and(
        eq(templateVersions.templateId, templateId),
        eq(templateVersions.channel, channel)
      ));

    const nextVersion = (maxVersionResult[0]?.maxVersion || 0) + 1;

    // Create the template version
    const newVersion = await db.insert(templateVersions)
      .values({
        templateId,
        channel,
        version: nextVersion,
        status: 'draft',
        createdAt: new Date().toISOString()
      })
      .returning();

    if (newVersion.length === 0) {
      return NextResponse.json({
        error: "Failed to create template version",
        code: "VERSION_CREATION_FAILED"
      }, { status: 500 });
    }

    const versionId = newVersion[0].id;

    // Create locale records
    const localeRecords = [];
    for (const [locale, content] of Object.entries(locales)) {
      const localeContent = content as any;
      
      const localeRecord = await db.insert(templateLocales)
        .values({
          templateVersionId: versionId,
          locale,
          subject: localeContent.subject || null,
          text: localeContent.text || null,
          html: localeContent.html || null
        })
        .returning();

      if (localeRecord.length > 0) {
        localeRecords.push({
          locale: localeRecord[0].locale,
          subject: localeRecord[0].subject,
          text: localeRecord[0].text,
          html: localeRecord[0].html
        });
      }
    }

    // Return the created version with locale data
    const response = {
      id: newVersion[0].id,
      templateId: newVersion[0].templateId,
      channel: newVersion[0].channel,
      version: newVersion[0].version,
      status: newVersion[0].status,
      createdAt: newVersion[0].createdAt,
      locales: localeRecords
    };

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('POST template version error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + error
    }, { status: 500 });
  }
}