import QueueMonitor from '@/components/queue/QueueMonitor';
import JobsTable from '@/components/queue/JobsTable';
import { Activity, Zap, Clock, RefreshCw, Shield, Layers } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function QueuePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-r from-card/50 to-card/30 backdrop-blur-sm">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 animate-in fade-in duration-1000" />
        <div className="relative mx-auto max-w-7xl px-6 py-12">
          <div className="flex flex-col space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 animate-in fade-in zoom-in duration-700">
                <Activity className="h-6 w-6 text-primary animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Queue Monitor</h1>
                <p className="text-muted-foreground mt-1">
                  Real-time monitoring of notification queue with priority management and retry handling
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-100">
              <Badge variant="secondary" className="px-3 py-1 hover:scale-105 transition-transform">
                <Zap className="mr-1.5 h-3 w-3" />
                Priority Queues
              </Badge>
              <Badge variant="secondary" className="px-3 py-1 hover:scale-105 transition-transform">
                <Clock className="mr-1.5 h-3 w-3" />
                Auto Retry
              </Badge>
              <Badge variant="secondary" className="px-3 py-1 hover:scale-105 transition-transform">
                <RefreshCw className="mr-1.5 h-3 w-3" />
                Exponential Backoff
              </Badge>
              <Badge variant="secondary" className="px-3 py-1 hover:scale-105 transition-transform">
                <Shield className="mr-1.5 h-3 w-3" />
                Failover Support
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Stats Overview */}
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
          <QueueMonitor />
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="border-2 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 group">
            <CardHeader className="text-center">
              <div className="mx-auto mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all duration-300">
                <Layers className="h-7 w-7 text-blue-600 dark:text-blue-400 group-hover:rotate-12 transition-transform" />
              </div>
              <CardTitle className="text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Priority Levels</CardTitle>
              <CardDescription>
                4-tier priority system: Critical, High, Normal, Low
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400 group">
            <CardHeader className="text-center">
              <div className="mx-auto mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 group-hover:bg-green-500/20 group-hover:scale-110 transition-all duration-300">
                <RefreshCw className="h-7 w-7 text-green-600 dark:text-green-400 group-hover:rotate-180 transition-transform duration-500" />
              </div>
              <CardTitle className="text-lg group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">Smart Retry</CardTitle>
              <CardDescription>
                Up to 3 automatic retries with exponential backoff
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 group">
            <CardHeader className="text-center">
              <div className="mx-auto mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 group-hover:bg-purple-500/20 group-hover:scale-110 transition-all duration-300">
                <Shield className="h-7 w-7 text-purple-600 dark:text-purple-400 group-hover:animate-bounce" />
              </div>
              <CardTitle className="text-lg group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Failover</CardTitle>
              <CardDescription>
                Automatic fallback to email for failed SMS/Push
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-orange-500/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-600 group">
            <CardHeader className="text-center">
              <div className="mx-auto mb-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 group-hover:bg-orange-500/20 group-hover:scale-110 transition-all duration-300">
                <Clock className="h-7 w-7 text-orange-600 dark:text-orange-400 group-hover:animate-spin" />
              </div>
              <CardTitle className="text-lg group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">Queue Status</CardTitle>
              <CardDescription>
                Real-time monitoring of pending, processing, completed
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Queue Details */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700">
          <JobsTable />
        </div>
      </main>
    </div>
  );
}