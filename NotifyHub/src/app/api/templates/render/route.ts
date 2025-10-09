import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { templates, templateVersions, templateLocales } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

interface RenderRequest {
  key: string;
  channel: 'email' | 'sms' | 'push';
  locale?: string;
  variables: Record<string, any>;
}

interface TemplateContent {
  subject?: string;
  text?: string;
  html?: string;
}

interface RenderResponse extends TemplateContent {
  localeUsed: string;
  templateKey: string;
  channel: string;
  version: number;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

function renderTemplate(template: string, variables: Record<string, any>, isHtml: boolean = false): string {
  let result = template;

  // Handle conditional blocks {{#if variable}}content{{/if}}
  result = result.replace(/\{\{#if\s+([^}]+)\}\}(.*?)\{\{\/if\}\}/gs, (match, condition, content) => {
    const value = getNestedValue(variables, condition.trim());
    const isTruthy = value !== undefined && value !== null && value !== false && value !== 0 && value !== '';
    return isTruthy ? content : '';
  });

  // Handle each loops {{#each array}}content{{/each}}
  result = result.replace(/\{\{#each\s+([^}]+)\}\}(.*?)\{\{\/each\}\}/gs, (match, arrayPath, content) => {
    const array = getNestedValue(variables, arrayPath.trim());
    if (!Array.isArray(array)) return '';
    
    return array.map(item => {
      let itemContent = content;
      
      // Handle {{.}} for current item
      itemContent = itemContent.replace(/\{\{\.\}\}/g, () => {
        const value = typeof item === 'object' ? JSON.stringify(item) : String(item || '');
        return isHtml ? escapeHtml(value) : value;
      });
      
      // Handle {{property}} for object properties
      if (typeof item === 'object' && item !== null) {
        itemContent = itemContent.replace(/\{\{([^}]+)\}\}/g, (propMatch, propName) => {
          if (propName.trim() === '.') return propMatch; // Already handled above
          const value = getNestedValue(item, propName.trim());
          const stringValue = String(value || '');
          return isHtml ? escapeHtml(stringValue) : stringValue;
        });
      }
      
      return itemContent;
    }).join('');
  });

  // Handle simple variable substitution {{variable}} and {{object.property}}
  result = result.replace(/\{\{([^}#\/]+)\}\}/g, (match, varPath) => {
    const cleanPath = varPath.trim();
    if (cleanPath === '.') return match; // Skip if it's a current item reference
    
    const value = getNestedValue(variables, cleanPath);
    const stringValue = String(value || '');
    return isHtml ? escapeHtml(stringValue) : stringValue;
  });

  return result;
}

export async function POST(request: NextRequest) {
  try {
    const body: RenderRequest = await request.json();
    
    // Validate required fields
    if (!body.key) {
      return NextResponse.json({ 
        error: "Template key is required",
        code: "MISSING_TEMPLATE_KEY" 
      }, { status: 400 });
    }
    
    if (!body.channel) {
      return NextResponse.json({ 
        error: "Channel is required",
        code: "MISSING_CHANNEL" 
      }, { status: 400 });
    }
    
    if (!['email', 'sms', 'push'].includes(body.channel)) {
      return NextResponse.json({ 
        error: "Channel must be one of: email, sms, push",
        code: "INVALID_CHANNEL" 
      }, { status: 400 });
    }
    
    if (!body.variables || typeof body.variables !== 'object') {
      return NextResponse.json({ 
        error: "Variables must be provided as an object",
        code: "INVALID_VARIABLES" 
      }, { status: 400 });
    }

    // Find template by key
    const template = await db.select()
      .from(templates)
      .where(eq(templates.key, body.key))
      .limit(1);

    if (template.length === 0) {
      return NextResponse.json({ 
        error: "Template not found",
        code: "TEMPLATE_NOT_FOUND" 
      }, { status: 404 });
    }

    // Get latest active version for specified channel
    const activeVersion = await db.select()
      .from(templateVersions)
      .where(and(
        eq(templateVersions.templateId, template[0].id),
        eq(templateVersions.channel, body.channel),
        eq(templateVersions.status, 'active')
      ))
      .orderBy(desc(templateVersions.version))
      .limit(1);

    if (activeVersion.length === 0) {
      return NextResponse.json({ 
        error: "No active version found for this template and channel",
        code: "NO_ACTIVE_VERSION" 
      }, { status: 404 });
    }

    // Try to get locale content in order: requested -> defaultLocale -> "en"
    const localeOrder = [
      body.locale,
      template[0].defaultLocale,
      'en'
    ].filter(Boolean).filter((locale, index, array) => array.indexOf(locale) === index); // Remove duplicates

    let localeContent: any = null;
    let localeUsed: string = '';

    for (const locale of localeOrder) {
      const content = await db.select()
        .from(templateLocales)
        .where(and(
          eq(templateLocales.templateVersionId, activeVersion[0].id),
          eq(templateLocales.locale, locale!)
        ))
        .limit(1);

      if (content.length > 0) {
        localeContent = content[0];
        localeUsed = locale!;
        break;
      }
    }

    if (!localeContent) {
      return NextResponse.json({ 
        error: "No locale content found for this template",
        code: "NO_LOCALE_CONTENT" 
      }, { status: 404 });
    }

    // Render all available content with variables
    const rendered: TemplateContent = {};

    if (localeContent.subject) {
      rendered.subject = renderTemplate(localeContent.subject, body.variables, false);
    }

    if (localeContent.text) {
      rendered.text = renderTemplate(localeContent.text, body.variables, false);
    }

    if (localeContent.html) {
      rendered.html = renderTemplate(localeContent.html, body.variables, true);
    }

    const response: RenderResponse = {
      ...rendered,
      localeUsed,
      templateKey: body.key,
      channel: body.channel,
      version: activeVersion[0].version
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}