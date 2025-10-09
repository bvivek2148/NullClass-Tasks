import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { templates, templateVersions, templateLocales } from '@/db/schema';
import { eq, like, and, or, desc, sql } from 'drizzle-orm';

const VALID_CHANNELS = ['email', 'sms', 'push'];
const VALID_STATUSES = ['draft', 'active', 'archived'];

function validateLocale(locale: string): boolean {
  return /^[a-z]{2}(-[A-Z]{2})?$/.test(locale);
}

function validateTemplateKey(key: string): boolean {
  return /^[a-zA-Z0-9._-]+$/.test(key) && key.length > 0;
}

function validateChannels(channels: any): boolean {
  return Array.isArray(channels) && 
         channels.length > 0 && 
         channels.every(channel => VALID_CHANNELS.includes(channel));
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');

    let query = db
      .select({
        id: templates.id,
        key: templates.key,
        defaultLocale: templates.defaultLocale,
        createdAt: templates.createdAt,
        updatedAt: templates.updatedAt,
      })
      .from(templates);

    if (search) {
      query = query.where(
        or(
          like(templates.key, `%${search}%`),
          like(templates.defaultLocale, `%${search}%`)
        )
      );
    }

    const templateList = await query
      .orderBy(desc(templates.createdAt))
      .limit(limit)
      .offset(offset);

    // Get channel information with versions and locales for each template
    const templatesWithChannels = await Promise.all(
      templateList.map(async (template) => {
        // Get active versions per channel
        const versions = await db
          .select({
            channel: templateVersions.channel,
            version: templateVersions.version,
            templateVersionId: templateVersions.id,
          })
          .from(templateVersions)
          .where(
            and(
              eq(templateVersions.templateId, template.id),
              eq(templateVersions.status, 'active')
            )
          );

        // Get locales for each active version
        const channels = await Promise.all(
          versions.map(async (version) => {
            const locales = await db
              .select({
                locale: templateLocales.locale,
              })
              .from(templateLocales)
              .where(eq(templateLocales.templateVersionId, version.templateVersionId));

            return {
              channel: version.channel,
              version: version.version,
              locales: locales.map(l => l.locale),
            };
          })
        );

        return {
          ...template,
          channels,
        };
      })
    );

    return NextResponse.json({ templates: templatesWithChannels });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + error,
        code: 'INTERNAL_SERVER_ERROR'
      }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, defaultLocale = 'en', channels } = body;

    // Validate required fields
    if (!key) {
      return NextResponse.json(
        { 
          error: 'Template key is required',
          code: 'MISSING_REQUIRED_FIELD'
        }, 
        { status: 400 }
      );
    }

    if (!channels) {
      return NextResponse.json(
        { 
          error: 'Channels array is required',
          code: 'MISSING_REQUIRED_FIELD'
        }, 
        { status: 400 }
      );
    }

    // Validate key format
    if (!validateTemplateKey(key)) {
      return NextResponse.json(
        { 
          error: 'Template key must contain only alphanumeric characters, dots, and dashes',
          code: 'INVALID_TEMPLATE_KEY'
        }, 
        { status: 400 }
      );
    }

    // Validate locale
    if (!validateLocale(defaultLocale)) {
      return NextResponse.json(
        { 
          error: 'Default locale must be a valid locale code (e.g., en, es, en-US)',
          code: 'INVALID_LOCALE'
        }, 
        { status: 400 }
      );
    }

    // Validate channels
    if (!validateChannels(channels)) {
      return NextResponse.json(
        { 
          error: 'Channels must be an array containing only email, sms, or push',
          code: 'INVALID_CHANNELS',
          details: { validChannels: VALID_CHANNELS }
        }, 
        { status: 400 }
      );
    }

    // Check if key already exists
    const existingTemplate = await db
      .select()
      .from(templates)
      .where(eq(templates.key, key))
      .limit(1);

    if (existingTemplate.length > 0) {
      return NextResponse.json(
        { 
          error: 'Template key already exists',
          code: 'DUPLICATE_TEMPLATE_KEY',
          details: { key }
        }, 
        { status: 409 }
      );
    }

    const now = new Date().toISOString();

    // Create template
    const newTemplate = await db
      .insert(templates)
      .values({
        key,
        defaultLocale,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    const template = newTemplate[0];

    // Create initial draft versions for each channel
    const versionPromises = channels.map(async (channel: string) => {
      const newVersion = await db
        .insert(templateVersions)
        .values({
          templateId: template.id,
          channel,
          version: 1,
          status: 'draft',
          createdAt: now,
        })
        .returning();

      return {
        channel,
        version: 1,
        templateVersionId: newVersion[0].id,
        locales: [] as string[],
      };
    });

    const channelVersions = await Promise.all(versionPromises);

    const response = {
      ...template,
      channels: channelVersions,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    
    // Handle specific database errors
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
      return NextResponse.json(
        { 
          error: 'Template key already exists',
          code: 'DUPLICATE_TEMPLATE_KEY'
        }, 
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Internal server error: ' + error,
        code: 'INTERNAL_SERVER_ERROR'
      }, 
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: 'Valid template ID is required',
          code: 'INVALID_ID'
        }, 
        { status: 400 }
      );
    }

    const body = await request.json();
    const { key, defaultLocale } = body;

    // Check if template exists
    const existingTemplate = await db
      .select()
      .from(templates)
      .where(eq(templates.id, parseInt(id)))
      .limit(1);

    if (existingTemplate.length === 0) {
      return NextResponse.json(
        { 
          error: 'Template not found',
          code: 'TEMPLATE_NOT_FOUND'
        }, 
        { status: 404 }
      );
    }

    const updates: any = {
      updatedAt: new Date().toISOString(),
    };

    // Validate and update key if provided
    if (key !== undefined) {
      if (!validateTemplateKey(key)) {
        return NextResponse.json(
          { 
            error: 'Template key must contain only alphanumeric characters, dots, and dashes',
            code: 'INVALID_TEMPLATE_KEY'
          }, 
          { status: 400 }
        );
      }

      // Check for duplicate key (excluding current template)
      if (key !== existingTemplate[0].key) {
        const duplicateCheck = await db
          .select()
          .from(templates)
          .where(eq(templates.key, key))
          .limit(1);

        if (duplicateCheck.length > 0) {
          return NextResponse.json(
            { 
              error: 'Template key already exists',
              code: 'DUPLICATE_TEMPLATE_KEY',
              details: { key }
            }, 
            { status: 409 }
          );
        }
      }

      updates.key = key;
    }

    // Validate and update defaultLocale if provided
    if (defaultLocale !== undefined) {
      if (!validateLocale(defaultLocale)) {
        return NextResponse.json(
          { 
            error: 'Default locale must be a valid locale code (e.g., en, es, en-US)',
            code: 'INVALID_LOCALE'
          }, 
          { status: 400 }
        );
      }

      updates.defaultLocale = defaultLocale;
    }

    const updatedTemplate = await db
      .update(templates)
      .set(updates)
      .where(eq(templates.id, parseInt(id)))
      .returning();

    // Get channel information for the updated template
    const versions = await db
      .select({
        channel: templateVersions.channel,
        version: templateVersions.version,
        templateVersionId: templateVersions.id,
      })
      .from(templateVersions)
      .where(
        and(
          eq(templateVersions.templateId, parseInt(id)),
          eq(templateVersions.status, 'active')
        )
      );

    const channels = await Promise.all(
      versions.map(async (version) => {
        const locales = await db
          .select({
            locale: templateLocales.locale,
          })
          .from(templateLocales)
          .where(eq(templateLocales.templateVersionId, version.templateVersionId));

        return {
          channel: version.channel,
          version: version.version,
          locales: locales.map(l => l.locale),
        };
      })
    );

    const response = {
      ...updatedTemplate[0],
      channels,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('PUT error:', error);

    if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
      return NextResponse.json(
        { 
          error: 'Template key already exists',
          code: 'DUPLICATE_TEMPLATE_KEY'
        }, 
        { status: 409 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Internal server error: ' + error,
        code: 'INTERNAL_SERVER_ERROR'
      }, 
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: 'Valid template ID is required',
          code: 'INVALID_ID'
        }, 
        { status: 400 }
      );
    }

    // Check if template exists
    const existingTemplate = await db
      .select()
      .from(templates)
      .where(eq(templates.id, parseInt(id)))
      .limit(1);

    if (existingTemplate.length === 0) {
      return NextResponse.json(
        { 
          error: 'Template not found',
          code: 'TEMPLATE_NOT_FOUND'
        }, 
        { status: 404 }
      );
    }

    // Get template versions and locales before deletion for response
    const versions = await db
      .select({
        id: templateVersions.id,
        channel: templateVersions.channel,
        version: templateVersions.version,
      })
      .from(templateVersions)
      .where(eq(templateVersions.templateId, parseInt(id)));

    // Delete template locales first (due to foreign key constraints)
    for (const version of versions) {
      await db
        .delete(templateLocales)
        .where(eq(templateLocales.templateVersionId, version.id));
    }

    // Delete template versions
    await db
      .delete(templateVersions)
      .where(eq(templateVersions.templateId, parseInt(id)));

    // Delete template
    const deletedTemplate = await db
      .delete(templates)
      .where(eq(templates.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'Template deleted successfully',
      template: deletedTemplate[0],
      deletedVersions: versions.length,
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error: ' + error,
        code: 'INTERNAL_SERVER_ERROR'
      }, 
      { status: 500 }
    );
  }
}