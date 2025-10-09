"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, FileText, Eye } from "lucide-react";

type Channel = "email" | "sms" | "push";

interface TemplateListItem {
  id: number;
  key: string;
  defaultLocale: string;
  createdAt: string;
  updatedAt: string;
  channels: Array<{
    channel: Channel;
    version: number;
    locales: string[];
  }>;
}

interface TemplatesResponse {
  templates: TemplateListItem[];
}

interface RenderResponse {
  subject?: string;
  text?: string;
  html?: string;
  localeUsed: string;
  templateKey: string;
  channel: Channel;
  version: number;
}

const exampleVariables: Record<string, any> = {
  "booking.confirmation": {
    booking: {
      id: "ABC123",
      customerName: "Ava Patel",
      date: "2025-10-05",
      time: "14:00",
      location: "Downtown Station",
      specialRequests: "Window seat",
      total: 129.99,
      items: [
        { name: "Base fare", price: 99.99 },
        { name: "Priority boarding", price: 30 }
      ]
    }
  },
  "booking.cancellation": {
    booking: {
      id: "ABC123",
      customerName: "Ava Patel",
      date: "2025-10-05",
      time: "14:00",
      refundAmount: 129.99,
      cancellationReason: "Customer request"
    }
  },
  "promo.offer": {
    offer: {
      discount: 20,
      code: "SAVE20",
      expires: "2025-10-31",
      minPurchase: 100,
      shopUrl: "https://example.com/shop"
    },
    customer: { name: "Ava" }
  }
};

function getAuthHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("bearer_token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function TemplatesManager() {
  const [data, setData] = useState<TemplatesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedKey, setSelectedKey] = useState<string>("");
  const [selectedChannel, setSelectedChannel] = useState<Channel | "">("");
  const [selectedLocale, setSelectedLocale] = useState<string>("");
  const [variablesText, setVariablesText] = useState<string>("{}");

  const [rendering, setRendering] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [result, setResult] = useState<RenderResponse | null>(null);

  // Fetch templates list
  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/templates", {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `Failed to load templates (${res.status})`);
      }
      const j: TemplatesResponse = await res.json();
      setData(j);
      // Preselect first template/channel/locale
      if (j.templates.length > 0 && !selectedKey) {
        const t = j.templates[0];
        setSelectedKey(t.key);
        const ch = t.channels[0]?.channel || "email";
        setSelectedChannel(ch as Channel);
        const loc = t.channels[0]?.locales?.[0] || t.defaultLocale || "en";
        setSelectedLocale(loc);
        const sample = exampleVariables[t.key] ?? {};
        setVariablesText(JSON.stringify(sample, null, 2));
      }
    } catch (e: any) {
      setError(e.message || "Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedTemplate = useMemo(() => {
    return data?.templates.find((t) => t.key === selectedKey) || null;
  }, [data, selectedKey]);

  const availableChannels: Channel[] = useMemo(() => {
    return (selectedTemplate?.channels?.map((c) => c.channel) as Channel[]) || [];
  }, [selectedTemplate]);

  const availableLocales: string[] = useMemo(() => {
    if (!selectedTemplate) return [];
    const channelEntry = selectedTemplate.channels.find((c) => c.channel === selectedChannel);
    return channelEntry?.locales?.length ? channelEntry.locales : [selectedTemplate.defaultLocale];
  }, [selectedTemplate, selectedChannel]);

  useEffect(() => {
    // Reset selections when template or channel changes
    if (selectedTemplate) {
      if (!availableChannels.includes(selectedChannel as Channel)) {
        setSelectedChannel((availableChannels[0] as Channel) || "email");
      }
      const sample = exampleVariables[selectedTemplate.key] ?? {};
      setVariablesText(JSON.stringify(sample, null, 2));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTemplate?.key]);

  useEffect(() => {
    if (availableLocales.length && !availableLocales.includes(selectedLocale)) {
      setSelectedLocale(availableLocales[0]);
    }
  }, [availableLocales, selectedLocale]);

  async function handleRender() {
    setRendering(true);
    setRenderError(null);
    setResult(null);

    let parsedVars: Record<string, any>;
    try {
      parsedVars = variablesText.trim() ? JSON.parse(variablesText) : {};
    } catch (e) {
      setRendering(false);
      setRenderError("Variables JSON is invalid");
      return;
    }

    try {
      const res = await fetch("/api/templates/render", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          key: selectedKey,
          channel: selectedChannel,
          locale: selectedLocale,
          variables: parsedVars,
        }),
      });
      const j = await res.json();
      if (!res.ok) {
        throw new Error(j.error || `Render failed (${res.status})`);
      }
      setResult(j as RenderResponse);
    } catch (e: any) {
      setRenderError(e.message || "Render failed");
    } finally {
      setRendering(false);
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-12">
          <div className="flex items-center gap-2 text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Loading templates…
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="p-6 text-destructive">
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.templates.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-sm text-muted-foreground">No templates found. Templates are seeded automatically.</p>
          <Button onClick={fetchTemplates} variant="outline" className="mt-4">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Left: Template Browser & Controls */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Template Browser</CardTitle>
                <CardDescription>Select and configure template for preview</CardDescription>
              </div>
              <Button onClick={fetchTemplates} variant="ghost" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="template-select">Template</Label>
              <select
                id="template-select"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedKey}
                onChange={(e) => setSelectedKey(e.target.value)}
              >
                {data.templates.map((t) => (
                  <option key={t.id} value={t.key}>
                    {t.key}
                  </option>
                ))}
              </select>
              {selectedTemplate && (
                <div className="flex flex-wrap gap-2 pt-1">
                  <Badge variant="secondary" className="text-xs">
                    Default: {selectedTemplate.defaultLocale}
                  </Badge>
                  {availableChannels.map((ch) => (
                    <Badge key={ch} variant="outline" className="text-xs">
                      {ch}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="channel-select">Channel</Label>
              <select
                id="channel-select"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value as Channel)}
              >
                {availableChannels.map((ch) => (
                  <option key={ch} value={ch}>
                    {ch}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="locale-select">Locale</Label>
              <select
                id="locale-select"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={selectedLocale}
                onChange={(e) => setSelectedLocale(e.target.value)}
              >
                {availableLocales.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="variables-input">Variables (JSON)</Label>
              <textarea
                id="variables-input"
                className="flex min-h-[160px] w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={variablesText}
                onChange={(e) => setVariablesText(e.target.value)}
                spellCheck={false}
              />
            </div>

            <Button
              onClick={handleRender}
              disabled={rendering || !selectedKey || !selectedChannel}
              className="w-full"
            >
              {rendering ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Rendering…
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Render Preview
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Right: Preview */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>Rendered template output</CardDescription>
          </CardHeader>
          <CardContent>
            {!result && !renderError && (
              <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-12 text-center">
                <Eye className="h-8 w-8 text-muted-foreground/50" />
                <p className="mt-3 text-sm text-muted-foreground">
                  Configure options and click Render Preview
                </p>
              </div>
            )}

            {renderError && (
              <div className="rounded-md border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
                {renderError}
              </div>
            )}

            {result && (
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="html" disabled={!result.html}>HTML Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="content" className="space-y-4 mt-4">
                  <div className="rounded-md border bg-muted/50 p-3">
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <Badge variant="secondary">{result.templateKey}</Badge>
                      <Badge variant="outline">{result.channel}</Badge>
                      <Badge variant="outline">v{result.version}</Badge>
                      <Badge variant="outline">{result.localeUsed}</Badge>
                    </div>
                  </div>

                  {result.subject && (
                    <div className="space-y-2">
                      <Label>Subject</Label>
                      <div className="rounded-md border bg-background p-3 text-sm font-medium">
                        {result.subject}
                      </div>
                    </div>
                  )}

                  {result.text && (
                    <div className="space-y-2">
                      <Label>Text Content</Label>
                      <pre className="max-h-80 overflow-auto rounded-md border bg-background p-3 text-xs whitespace-pre-wrap font-mono">
                        {result.text}
                      </pre>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="html" className="mt-4">
                  {result.html && (
                    <div className="rounded-md border overflow-hidden">
                      <iframe 
                        title="html-preview" 
                        className="h-[520px] w-full bg-white" 
                        srcDoc={result.html} 
                      />
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}