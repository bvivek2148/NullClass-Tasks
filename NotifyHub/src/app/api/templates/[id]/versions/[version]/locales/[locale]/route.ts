import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { templates, templateVersions, templateLocales } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

interface RouteParams {
  params: {
    id: string;
    version: string;
    locale: string;
  };
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id, version, locale } = params;

    // Validate parameters
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid template ID is required",
        code: "INVALID_TEMPLATE_ID" 
      }, { status: 400 });
    }

    if (!version || isNaN(parseInt(version))) {
      return NextResponse.json({ 
        error: "Valid version number is required",
        code: "INVALID_VERSION" 
      }, { status: 400 });
    }

    // Validate locale format (2-3 characters)
    if (!locale || !/^[a-z]{2,3}$/.test(locale)) {
      return NextResponse.json({ 
        error: "Valid locale code is required (2-3 characters)",
        code: "INVALID_LOCALE" 
      }, { status: 400 });
    }

    const templateId = parseInt(id);
    const versionNumber = parseInt(version);

    // Verify template exists
    const template = await db.select()
      .from(templates)
      .where(eq(templates.id, templateId))
      .limit(1);

    if (template.length === 0) {
      return NextResponse.json({ 
        error: 'Template not found',
        code: "TEMPLATE_NOT_FOUND" 
      }, { status: 404 });
    }

    // Verify template version exists and get channel type
    const templateVersion = await db.select()
      .from(templateVersions)
      .where(and(
        eq(templateVersions.templateId, templateId),
        eq(templateVersions.version, versionNumber)
      ))
      .limit(1);

    if (templateVersion.length === 0) {
      return NextResponse.json({ 
        error: 'Template version not found',
        code: "VERSION_NOT_FOUND" 
      }, { status: 404 });
    }

    const { channel } = templateVersion[0];
    const templateVersionId = templateVersion[0].id;

    // Parse and validate request body
    const requestBody = await request.json();
    const { subject, text, html } = requestBody;

    // Prevent empty updates
    if (!subject && !text && !html) {
      return NextResponse.json({ 
        error: "At least one content field (subject, text, or html) must be provided",
        code: "EMPTY_UPDATE" 
      }, { status: 400 });
    }

    // Channel-specific content validation
    if (channel === 'email') {
      if (!subject) {
        return NextResponse.json({ 
          error: "Subject is required for email templates",
          code: "MISSING_SUBJECT" 
        }, { status: 400 });
      }
      if (!text && !html) {
        return NextResponse.json({ 
          error: "Either text or html content is required for email templates",
          code: "MISSING_CONTENT" 
        }, { status: 400 });
      }
    } else if (channel === 'sms' || channel === 'push') {
      if (!text) {
        return NextResponse.json({ 
          error: `Text content is required for ${channel} templates`,
          code: "MISSING_TEXT" 
        }, { status: 400 });
      }
    }

    // Check if locale record exists for this version
    const existingLocale = await db.select()
      .from(templateLocales)
      .where(and(
        eq(templateLocales.templateVersionId, templateVersionId),
        eq(templateLocales.locale, locale)
      ))
      .limit(1);

    let result;

    if (existingLocale.length > 0) {
      // Update existing locale
      const updateData: any = {};
      
      if (subject !== undefined) updateData.subject = subject;
      if (text !== undefined) updateData.text = text;
      if (html !== undefined) updateData.html = html;

      // For SMS/Push channels, ignore subject and html
      if (channel === 'sms' || channel === 'push') {
        delete updateData.subject;
        delete updateData.html;
      }

      const updated = await db.update(templateLocales)
        .set(updateData)
        .where(and(
          eq(templateLocales.templateVersionId, templateVersionId),
          eq(templateLocales.locale, locale)
        ))
        .returning();

      result = updated[0];
    } else {
      // Create new locale record
      const insertData: any = {
        templateVersionId,
        locale,
        subject: channel === 'email' ? subject : null,
        text,
        html: channel === 'email' ? html : null
      };

      const created = await db.insert(templateLocales)
        .values(insertData)
        .returning();

      result = created[0];
    }

    // Format response (exclude internal fields)
    const response: any = {
      locale: result.locale
    };

    if (result.subject !== null) response.subject = result.subject;
    if (result.text !== null) response.text = result.text;
    if (result.html !== null) response.html = result.html;

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('PUT template locale error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}