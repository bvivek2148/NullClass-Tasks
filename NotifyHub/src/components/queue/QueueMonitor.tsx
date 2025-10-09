"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Activity, Clock, CheckCircle, XCircle, Loader2, RefreshCw, Pause, Play } from 'lucide-react';
import { toast } from 'sonner';

interface QueueStats {
  email: {
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
    total: number;
  };
  sms: {
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
    total: number;
  };
  push: {
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
    total: number;
  };
}

export default function QueueMonitor() {
  const [stats, setStats] = useState<QueueStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async (showToast = false) => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/queue/stats');
      if (!response.ok) throw new Error('Failed to fetch queue stats');
      
      const data = await response.json();
      setStats(data.queueStats);
      
      if (showToast) {
        toast.success('Queue stats refreshed');
      }
    } catch (error) {
      console.error('Error fetching queue stats:', error);
      toast.error('Failed to fetch queue statistics');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Auto-refresh every 5 seconds
    const interval = setInterval(() => fetchStats(), 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          No queue statistics available
        </CardContent>
      </Card>
    );
  }

  const calculateSuccessRate = (queue: any) => {
    const total = queue.completed + queue.failed;
    if (total === 0) return 0;
    return Math.round((queue.completed / total) * 100);
  };

  const renderQueueCard = (name: string, data: any, icon: React.ReactNode) => {
    const successRate = calculateSuccessRate(data);
    const activeJobs = data.active + data.waiting;

    return (
      <Card key={name}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {icon}
              <CardTitle className="text-lg capitalize">{name} Queue</CardTitle>
            </div>
            <Badge variant={activeJobs > 0 ? "default" : "secondary"}>
              {activeJobs} active
            </Badge>
          </div>
          <CardDescription>
            Success rate: {successRate}%
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Processing</span>
              <span className="font-medium">{data.active}</span>
            </div>
            <Progress value={(data.active / (data.total || 1)) * 100} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <div>
                <div className="font-medium">{data.waiting}</div>
                <div className="text-xs text-muted-foreground">Waiting</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <div className="font-medium">{data.completed}</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <div>
                <div className="font-medium">{data.failed}</div>
                <div className="text-xs text-muted-foreground">Failed</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Pause className="h-4 w-4 text-blue-500" />
              <div>
                <div className="font-medium">{data.delayed}</div>
                <div className="text-xs text-muted-foreground">Delayed</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Queue Monitor</h2>
          <p className="text-sm text-muted-foreground">Real-time queue statistics and performance</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchStats(true)}
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {renderQueueCard('email', stats.email, <Activity className="h-5 w-5 text-blue-500" />)}
        {renderQueueCard('sms', stats.sms, <Activity className="h-5 w-5 text-green-500" />)}
        {renderQueueCard('push', stats.push, <Activity className="h-5 w-5 text-purple-500" />)}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Overall Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {stats.email.total + stats.sms.total + stats.push.total}
              </div>
              <div className="text-xs text-muted-foreground">Total Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                {stats.email.completed + stats.sms.completed + stats.push.completed}
              </div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">
                {stats.email.failed + stats.sms.failed + stats.push.failed}
              </div>
              <div className="text-xs text-muted-foreground">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">
                {stats.email.active + stats.sms.active + stats.push.active}
              </div>
              <div className="text-xs text-muted-foreground">Processing</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}