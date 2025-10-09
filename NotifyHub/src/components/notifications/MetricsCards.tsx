"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Clock, TrendingUp, Mail, MessageSquare, Bell } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { getMetrics, type MetricsResponse, type Channel, type NotificationType } from "@/lib/notificationClient";
import { Skeleton } from "@/components/ui/skeleton";

const channelOptions: Array<{ label: string; value: Channel | "all" }> = [
  { label: "All", value: "all" },
  { label: "Email", value: "email" },
  { label: "SMS", value: "sms" },
  { label: "Push", value: "push" },
];

const typeOptions: Array<{ label: string; value: NotificationType | "all" }> = [
  { label: "All", value: "all" },
  { label: "Transactional", value: "transactional" },
  { label: "Reminders", value: "reminder" },
  { label: "Promotional", value: "promotional" },
  { label: "System", value: "system" },
];

export default function MetricsCards() {
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState<7 | 30>(7);
  const [channel, setChannel] = useState<Channel | "all">("all");
  const [type, setType] = useState<NotificationType | "all">("all");

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await getMetrics({
          days,
          channel: channel === "all" ? undefined : channel,
          type: type === "all" ? undefined : type,
        });
        if (mounted) setMetrics(data);
      } catch (e) {
        // ignore for demo; could use toast
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [days, channel, type]);

  if (loading || !metrics) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-in fade-in slide-in-from-bottom-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Add safe defaults for all metrics
  const totalSent = metrics?.totalSent ?? 0;
  const delivered = metrics?.delivered ?? 0;
  const failed = metrics?.failed ?? 0;
  const pending = metrics?.pending ?? 0;
  const deliveryRate = metrics?.deliveryRate ?? 0;
  const emailCount = metrics?.byChannel?.email ?? 0;
  const smsCount = metrics?.byChannel?.sms ?? 0;
  const pushCount = metrics?.byChannel?.push ?? 0;
  const transactionalCount = metrics?.byType?.transactional ?? 0;
  const promotionalCount = metrics?.byType?.promotional ?? 0;
  const systemCount = metrics?.byType?.system ?? 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-2 hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">Total Sent</CardTitle>
          <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 group-hover:scale-110 transition-all duration-300">
            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400 group-hover:rotate-12 transition-transform" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold group-hover:scale-105 transition-transform inline-block">{totalSent.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">All channels combined</p>
        </CardContent>
      </Card>

      <Card className="border-2 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Delivered</CardTitle>
          <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 group-hover:scale-110 transition-all duration-300">
            <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400 group-hover:rotate-12 transition-transform" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold group-hover:scale-105 transition-transform inline-block">{delivered.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">
            <span className="text-blue-600 dark:text-blue-400 font-medium">{deliveryRate}%</span> delivery rate
          </p>
        </CardContent>
      </Card>

      <Card className="border-2 hover:border-red-500/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">Failed</CardTitle>
          <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 group-hover:scale-110 transition-all duration-300">
            <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 group-hover:animate-pulse" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold group-hover:scale-105 transition-transform inline-block">{failed.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {failed > 0 ? "Includes retries" : "No failures"}
          </p>
        </CardContent>
      </Card>

      <Card className="border-2 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">Pending</CardTitle>
          <div className="h-8 w-8 rounded-full bg-yellow-500/10 flex items-center justify-center group-hover:bg-yellow-500/20 group-hover:scale-110 transition-all duration-300">
            <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400 group-hover:animate-spin" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold group-hover:scale-105 transition-transform inline-block">{pending.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">In queue</p>
        </CardContent>
      </Card>

      {/* Channel Breakdown */}
      <Card className="md:col-span-2 lg:col-span-2 border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 group">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors">
            <Mail className="h-5 w-5 group-hover:rotate-12 transition-transform" />
            Channel Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group/item">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                  <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-medium">Email</span>
              </div>
              <span className="text-2xl font-bold group-hover/item:scale-110 transition-transform">{emailCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group/item">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                  <MessageSquare className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <span className="font-medium">SMS</span>
              </div>
              <span className="text-2xl font-bold group-hover/item:scale-110 transition-transform">{smsCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group/item">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-purple-500/10 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                  <Bell className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="font-medium">Push</span>
              </div>
              <span className="text-2xl font-bold group-hover/item:scale-110 transition-transform">{pushCount.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Type Breakdown */}
      <Card className="md:col-span-2 lg:col-span-2 border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-600 group">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 group-hover:text-primary transition-colors">
            <TrendingUp className="h-5 w-5 group-hover:rotate-12 transition-transform" />
            Type Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group/item">
              <span className="font-medium">Transactional</span>
              <span className="text-2xl font-bold group-hover/item:scale-110 transition-transform">{transactionalCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group/item">
              <span className="font-medium">Promotional</span>
              <span className="text-2xl font-bold group-hover/item:scale-110 transition-transform">{promotionalCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group/item">
              <span className="font-medium">System Alerts</span>
              <span className="text-2xl font-bold group-hover/item:scale-110 transition-transform">{systemCount.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}