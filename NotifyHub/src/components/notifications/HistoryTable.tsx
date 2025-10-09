"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getHistory, type NotificationType, type Channel } from "@/lib/notificationClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Mail, MessageSquare, Bell, AlertCircle } from "lucide-react";

export default function HistoryTable({ userId }: { userId: number }) {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Array<{
    notificationId: number;
    title: string;
    content: string;
    type: NotificationType;
    priority: "high" | "normal" | "low";
    channel: Channel;
    locale: string;
    status: string;
    provider: string;
    attempt: number;
    error: string | null;
    sentAt: string | null;
    occurredAt: string;
  }>>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await getHistory(userId, 20);
        if (mounted) setRows(data);
      } catch (e) {
        // noop
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [userId]);

  const getChannelIcon = (channel: Channel) => {
    switch (channel) {
      case "email": return <Mail className="h-3.5 w-3.5" />;
      case "sms": return <MessageSquare className="h-3.5 w-3.5" />;
      case "push": return <Bell className="h-3.5 w-3.5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      sent: "default",
      delivered: "default",
      failed: "destructive",
      pending: "secondary",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Recent Notifications
        </CardTitle>
        <CardDescription>Last 20 notification deliveries</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Attempt</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.notificationId + r.occurredAt} className="hover:bg-accent/50">
                    <TableCell className="font-medium">#{r.notificationId}</TableCell>
                    <TableCell className="max-w-[260px]">
                      <div className="truncate font-medium" title={r.title}>{r.title}</div>
                      {r.error && (
                        <div className="flex items-center gap-1 text-xs text-destructive mt-1">
                          <AlertCircle className="h-3 w-3" />
                          <span className="truncate">{r.error}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{r.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 capitalize">
                        {getChannelIcon(r.channel)}
                        {r.channel}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(r.status)}</TableCell>
                    <TableCell className="text-muted-foreground">{r.provider}</TableCell>
                    <TableCell className="text-center">{r.attempt}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(r.occurredAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No notification history yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}