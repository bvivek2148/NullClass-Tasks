import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { templates, templateVersions, templateLocales } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid template ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const templateId = parseInt(id);

    // Get template
    const template = await db.select()
      .from(templates)
      .where(eq(templates.id, templateId))
      .limit(1);

    if (template.length === 0) {
      return NextResponse.json({ 
        error: 'Template not found',
        code: 'TEMPLATE_NOT_FOUND' 
      }, { status: 404 });
    }

    // Get all template versions for this template
    const versions = await db.select()
      .from(templateVersions)
      .where(eq(templateVersions.templateId, templateId))
      .orderBy(templateVersions.channel, desc(templateVersions.version));

    // Get all locales for all versions
    const versionIds = versions.map(v => v.id);
    let locales: any[] = [];
    
    if (versionIds.length > 0) {
      locales = await db.select()
        .from(templateLocales)
        .where(eq(templateLocales.templateVersionId, versionIds[0]));
      
      // Get locales for all versions
      for (const versionId of versionIds) {
        const versionLocales = await db.select()
          .from(templateLocales)
          .where(eq(templateLocales.templateVersionId, versionId));
        
        // Add locales that aren't already included
        for (const locale of versionLocales) {
          if (!locales.find(l => l.templateVersionId === locale.templateVersionId && l.locale === locale.locale)) {
            locales.push(locale);
          }
        }
      }
    }

    // Build response structure
    const versionsWithLocales = versions.map(version => ({
      id: version.id,
      channel: version.channel,
      version: version.version,
      status: version.status,
      createdAt: version.createdAt,
      locales: locales
        .filter(locale => locale.templateVersionId === version.id)
        .map(locale => ({
          locale: locale.locale,
          subject: locale.subject,
          text: locale.text,
          html: locale.html
        }))
    }));

    const response = {
      id: template[0].id,
      key: template[0].key,
      defaultLocale: template[0].defaultLocale,
      createdAt: template[0].createdAt,
      updatedAt: template[0].updatedAt,
      versions: versionsWithLocales
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('GET template error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error,
      code: 'INTERNAL_ERROR' 
    }, { status: 500 });
  }
}