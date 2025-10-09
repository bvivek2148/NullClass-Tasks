"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import type { Channel, NotificationType, Preference } from "@/lib/notificationClient";
import { getPreferences, upsertPreferences } from "@/lib/notificationClient";
import { Settings, Bell, BellOff, Clock, Save } from "lucide-react";

const TYPES: NotificationType[] = ["transactional", "reminder", "promotional", "system"];
const CHANNELS: Channel[] = ["email", "sms", "push"];

export function PreferencesForm({ userId }: { userId: number }) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [prefs, setPrefs] = useState<Record<string, Preference>>({});
  const [globalSnooze, setGlobalSnooze] = useState<string>("");

  const keyFor = (type: NotificationType, channel: Channel) => `${type}:${channel}`;

  useEffect(() => {
    let mounted = true;
    async function run() {
      if (!userId) return;
      setLoading(true);
      try {
        const data = await getPreferences(userId);
        const map: Record<string, Preference> = {};
        for (const p of data) {
          map[keyFor(p.type, p.channel)] = p;
        }
        // ensure all combinations exist in UI state
        TYPES.forEach((t) =>
          CHANNELS.forEach((c) => {
            const k = keyFor(t, c);
            if (!map[k])
              map[k] = {
                userId,
                type: t,
                channel: c,
                enabled: t === "transactional" || t === "system", // sensible default
                mute: false,
              } as Preference;
          })
        );
        if (mounted) setPrefs(map);
      } catch (e: any) {
        toast.error("Failed to load preferences", { description: e?.message || String(e) });
      } finally {
        if (mounted) setLoading(false);
      }
    }
    run();
    return () => {
      mounted = false;
    };
  }, [userId]);

  const rows = useMemo(() => TYPES, []);
  const cols = useMemo(() => CHANNELS, []);

  function toggle(type: NotificationType, channel: Channel, value: boolean) {
    const k = keyFor(type, channel);
    setPrefs((prev) => ({
      ...prev,
      [k]: { ...(prev[k] || { userId, type, channel, enabled: false }), enabled: value },
    }));
  }

  // Global controls
  const allMuted = useMemo(() => {
    const values = Object.values(prefs);
    if (values.length === 0) return false;
    return values.every((p) => !!p.mute);
  }, [prefs]);

  function handleToggleMuteAll(next: boolean) {
    setPrefs((prev) => {
      const updated: Record<string, Preference> = {};
      for (const [k, p] of Object.entries(prev)) {
        updated[k] = { ...p, mute: next } as Preference;
      }
      return updated;
    });
  }

  function applySnoozeToAll(until: string | null) {
    setPrefs((prev) => {
      const updated: Record<string, Preference> = {};
      for (const [k, p] of Object.entries(prev)) {
        updated[k] = { ...p, snoozeUntil: until || undefined } as Preference;
      }
      return updated;
    });
  }

  async function onSave() {
    setSaving(true);
    try {
      const list = Object.values(prefs).map((p) => ({
        userId: p.userId,
        type: p.type,
        channel: p.channel,
        enabled: !!p.enabled,
        locale: p.locale ?? undefined,
        snoozeUntil: p.snoozeUntil ?? undefined,
        mute: !!p.mute,
      }));
      await upsertPreferences(list);
      toast.success("Preferences saved successfully!");
    } catch (e: any) {
      toast.error("Failed to save preferences", { description: e?.message || String(e) });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary animate-pulse" />
          Notification Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground animate-fade-in">
          Opt-in/out by channel and type. Transactional and System are recommended to keep on.
        </div>

        {/* Global controls */}
        <div className="rounded-lg border-2 bg-card p-4 hover:border-primary/30 transition-all duration-300 animate-fade-in-up">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {allMuted ? (
                  <BellOff className="h-5 w-5 text-muted-foreground animate-pulse" />
                ) : (
                  <Bell className="h-5 w-5 text-primary animate-pulse" />
                )}
                <div>
                  <div className="font-semibold text-sm">Mute All Notifications</div>
                  <div className="text-xs text-muted-foreground">Temporarily silence all channels</div>
                </div>
              </div>
              <Switch
                checked={allMuted}
                disabled={loading}
                onCheckedChange={(v) => handleToggleMuteAll(!!v)}
                aria-label="Mute all notifications"
                className="transition-all duration-200"
              />
            </div>
            <Separator />
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <input
                  type="datetime-local"
                  className="h-9 rounded-md border bg-background px-3 text-sm flex-1 hover:border-primary/50 transition-colors focus:border-primary"
                  value={globalSnooze}
                  onChange={(e) => setGlobalSnooze(e.target.value)}
                  aria-label="Snooze until"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={loading || !globalSnooze}
                  onClick={() => applySnoozeToAll(globalSnooze)}
                  className="hover:scale-105 transition-all duration-200"
                >
                  Apply Snooze
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={loading}
                  onClick={() => {
                    setGlobalSnooze("");
                    applySnoozeToAll(null);
                  }}
                  className="hover:scale-105 transition-all duration-200"
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto animate-fade-in-up animation-delay-100">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2">
                <th className="text-left p-3 font-semibold">Type</th>
                {cols.map((c, idx) => (
                  <th 
                    key={c} 
                    className="text-left p-3 capitalize font-semibold animate-fade-in-up"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((t, rowIdx) => (
                <tr 
                  key={t} 
                  className="border-b hover:bg-accent/50 transition-colors animate-fade-in-up group"
                  style={{ animationDelay: `${rowIdx * 50 + 200}ms` }}
                >
                  <td className="p-3 capitalize font-medium group-hover:text-primary transition-colors">{t}</td>
                  {cols.map((c) => {
                    const k = keyFor(t, c);
                    const enabled = !!prefs[k]?.enabled;
                    return (
                      <td key={k} className="p-3">
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={enabled}
                            disabled={loading}
                            onCheckedChange={(v) => toggle(t, c, v)}
                            aria-label={`Toggle ${t} via ${c}`}
                            className="transition-all duration-200 data-[state=checked]:scale-110"
                          />
                          <span className={`text-xs font-medium transition-all duration-200 ${
                            enabled 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-muted-foreground'
                          }`}>
                            {enabled ? "On" : "Off"}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Separator />
        <div className="flex justify-end animate-fade-in-up animation-delay-400">
          <Button 
            onClick={onSave} 
            disabled={saving || loading}
            className="gap-2 hover:scale-105 transition-all duration-200"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default PreferencesForm;