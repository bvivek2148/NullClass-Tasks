"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, RefreshCw, RotateCcw, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Job {
  id: number;
  jobId: string;
  notificationId: number;
  queue: string;
  priority: number;
  status: string;
  attempts: number;
  processedAt: string | null;
  failedAt: string | null;
  completedAt: string | null;
  error: string | null;
  createdAt: string;
  notificationTitle: string;
  notificationType: string;
}

export default function JobsTable() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [queueFilter, setQueueFilter] = useState<string>('all');

  const fetchJobs = async (showToast = false) => {
    try {
      setRefreshing(true);
      
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (queueFilter !== 'all') params.append('queue', queueFilter);
      params.append('limit', '50');
      
      const response = await fetch(`/api/queue/jobs?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch jobs');
      
      const data = await response.json();
      setJobs(data);
      
      if (showToast) {
        toast.success('Jobs list refreshed');
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [statusFilter, queueFilter]);

  const handleRetry = async (jobId: string) => {
    try {
      const response = await fetch(`/api/queue/jobs/${jobId}/retry`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to retry job');
      
      toast.success('Job retry initiated');
      fetchJobs();
    } catch (error) {
      console.error('Error retrying job:', error);
      toast.error('Failed to retry job');
    }
  };

  const handleDelete = async (jobId: string) => {
    try {
      const response = await fetch(`/api/queue/jobs/${jobId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete job');
      
      toast.success('Job deleted');
      fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", className?: string }> = {
      pending: { variant: "outline", className: "border-yellow-500 text-yellow-700 dark:text-yellow-400" },
      active: { variant: "default", className: "bg-blue-500" },
      completed: { variant: "secondary", className: "bg-green-500 text-white" },
      failed: { variant: "destructive" },
      delayed: { variant: "outline", className: "border-purple-500 text-purple-700 dark:text-purple-400" },
    };
    
    const config = variants[status] || { variant: "outline" as const };
    return (
      <Badge variant={config.variant} className={config.className}>
        {status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: number) => {
    if (priority >= 8) return <Badge variant="destructive">Critical</Badge>;
    if (priority >= 6) return <Badge variant="default">High</Badge>;
    if (priority >= 4) return <Badge variant="secondary">Normal</Badge>;
    return <Badge variant="outline">Low</Badge>;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Queue Jobs</CardTitle>
            <CardDescription>Manage and monitor notification processing jobs</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchJobs(true)}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        <div className="flex gap-4 pt-4">
          <Select value={queueFilter} onValueChange={setQueueFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by queue" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Queues</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="push">Push</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="delayed">Delayed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {jobs.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            No jobs found matching the selected filters
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job ID</TableHead>
                  <TableHead>Queue</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Attempts</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-mono text-xs">
                      {job.jobId.substring(0, 20)}...
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {job.queue}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{job.notificationTitle || 'N/A'}</div>
                        <div className="text-xs text-muted-foreground">{job.notificationType}</div>
                      </div>
                    </TableCell>
                    <TableCell>{getPriorityBadge(job.priority)}</TableCell>
                    <TableCell>{getStatusBadge(job.status)}</TableCell>
                    <TableCell>
                      <span className={job.attempts > 1 ? 'text-orange-600 font-medium' : ''}>
                        {job.attempts}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(job.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {job.status === 'failed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRetry(job.jobId)}
                            title="Retry job"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        )}
                        {(job.status === 'failed' || job.status === 'completed') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(job.jobId)}
                            title="Delete job"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        {jobs.some(job => job.error) && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Recent Errors
            </h4>
            {jobs
              .filter(job => job.error)
              .slice(0, 3)
              .map((job) => (
                <div key={job.id} className="text-xs p-2 bg-destructive/10 rounded border border-destructive/20">
                  <div className="font-medium">Job {job.jobId.substring(0, 15)}...</div>
                  <div className="text-muted-foreground">{job.error}</div>
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}