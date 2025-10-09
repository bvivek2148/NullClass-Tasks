import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { templates, templateVersions, templateLocales } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; version: string } }
) {
  try {
    const { id, version } = params;

    // Validate template ID and version are valid integers
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

    // Verify version exists for the template
    const versionRecord = await db.select()
      .from(templateVersions)
      .where(
        and(
          eq(templateVersions.templateId, templateId),
          eq(templateVersions.version, versionNumber)
        )
      )
      .limit(1);

    if (versionRecord.length === 0) {
      return NextResponse.json({ 
        error: 'Template version not found',
        code: "VERSION_NOT_FOUND"
      }, { status: 404 });
    }

    const currentVersion = versionRecord[0];

    // Verify version is currently in "draft" or "archived" status
    if (currentVersion.status === 'active') {
      return NextResponse.json({ 
        error: 'Cannot activate already active version',
        code: "VERSION_ALREADY_ACTIVE"
      }, { status: 409 });
    }

    if (currentVersion.status !== 'draft' && currentVersion.status !== 'archived') {
      return NextResponse.json({ 
        error: 'Version must be in draft or archived status to activate',
        code: "INVALID_VERSION_STATUS"
      }, { status: 400 });
    }

    // Archive all active versions for the same template + channel combination
    await db.update(templateVersions)
      .set({
        status: 'archived'
      })
      .where(
        and(
          eq(templateVersions.templateId, templateId),
          eq(templateVersions.channel, currentVersion.channel),
          eq(templateVersions.status, 'active')
        )
      );

    // Set the specified version status to "active"
    const activatedVersion = await db.update(templateVersions)
      .set({
        status: 'active'
      })
      .where(eq(templateVersions.id, currentVersion.id))
      .returning();

    if (activatedVersion.length === 0) {
      return NextResponse.json({ 
        error: 'Failed to activate version',
        code: "ACTIVATION_FAILED"
      }, { status: 500 });
    }

    // Update template's updatedAt timestamp
    await db.update(templates)
      .set({
        updatedAt: new Date().toISOString()
      })
      .where(eq(templates.id, templateId));

    // Get all locales for the activated version
    const locales = await db.select({
      locale: templateLocales.locale,
      subject: templateLocales.subject,
      text: templateLocales.text,
      html: templateLocales.html
    })
      .from(templateLocales)
      .where(eq(templateLocales.templateVersionId, currentVersion.id));

    // Return the activated version with locale data
    const response = {
      id: activatedVersion[0].id,
      templateId: activatedVersion[0].templateId,
      channel: activatedVersion[0].channel,
      version: activatedVersion[0].version,
      status: activatedVersion[0].status,
      createdAt: activatedVersion[0].createdAt,
      locales: locales
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}