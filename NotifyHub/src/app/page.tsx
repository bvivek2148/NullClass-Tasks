"use client";

import MetricsCards from "@/components/notifications/MetricsCards";
import HistoryTable from "@/components/notifications/HistoryTable";
import PreferencesForm from "@/components/notifications/PreferencesForm";
import SendTestCard from "@/components/notifications/SendTestCard";
import Link from "next/link";
import { Activity, Bell, Zap, Shield, Globe, TrendingUp, Sparkles, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const demoUserId = 1;
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-background border-b">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25" />
        
        {/* Animated gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-glow animation-delay-500" />
        
        <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="flex flex-col items-center text-center space-y-6">
            <Badge variant="secondary" className="px-4 py-1.5 animate-fade-in-up">
              <Zap className="mr-1.5 h-3.5 w-3.5" />
              Enterprise-Grade Notification System
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl animate-fade-in-up animation-delay-100">
              Multi-Channel Notification
              <span className="block text-primary mt-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Management Platform
              </span>
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground md:text-xl animate-fade-in-up animation-delay-200">
              Send, track, and manage email, SMS, and push notifications with advanced queue management, 
              retry logic, and failover strategies. Built for scale and reliability.
            </p>
            <div className="flex flex-wrap gap-3 justify-center animate-fade-in-up animation-delay-300">
              <Link href="#metrics">
                <Button size="lg" className="gap-2 hover:scale-105 transition-all duration-200 group">
                  <TrendingUp className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                  View Metrics
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/templates">
                <Button size="lg" variant="outline" className="gap-2 hover:scale-105 transition-all duration-200 group">
                  <Globe className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                  Manage Templates
                </Button>
              </Link>
              <Link href="/queue">
                <Button size="lg" variant="outline" className="gap-2 hover:scale-105 transition-all duration-200 group">
                  <Activity className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                  Queue Monitor
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Features</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Everything You Need for Notifications
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Powerful features to manage notifications at enterprise scale
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-2 hover:border-primary/50 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group animate-fade-in-up animation-delay-100">
            <CardHeader>
              <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                <Bell className="h-6 w-6 text-primary group-hover:rotate-12 transition-transform" />
              </div>
              <CardTitle className="group-hover:text-primary transition-colors">Multi-Channel Delivery</CardTitle>
              <CardDescription>
                Send notifications via email, SMS, and push with automatic channel selection based on user preferences
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="border-2 hover:border-primary/50 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group animate-fade-in-up animation-delay-200">
            <CardHeader>
              <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all duration-300">
                <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400 group-hover:rotate-12 transition-transform" />
              </div>
              <CardTitle className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Advanced Queue System</CardTitle>
              <CardDescription>
                Priority-based queuing with retry logic, exponential backoff, and automatic failover for failed deliveries
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="border-2 hover:border-primary/50 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group animate-fade-in-up animation-delay-300">
            <CardHeader>
              <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10 group-hover:bg-green-500/20 group-hover:scale-110 transition-all duration-300">
                <Shield className="h-6 w-6 text-green-600 dark:text-green-400 group-hover:rotate-12 transition-transform" />
              </div>
              <CardTitle className="group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">Template Engine</CardTitle>
              <CardDescription>
                Versioned templates with multi-language support and dynamic variable substitution for personalized content
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Queue System Highlight */}
      <section className="mx-auto max-w-6xl px-6 pb-12">
        <Card className="border-2 bg-gradient-to-br from-card to-primary/5 hover:shadow-2xl transition-all duration-500 animate-fade-in-up">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary animate-pulse-glow">
                  <Activity className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle>Queue System Overview</CardTitle>
                  <CardDescription className="mt-1">
                    Phase 6: Advanced queue management with retry logic, exponential backoff, and automatic failover
                  </CardDescription>
                </div>
              </div>
              <Link href="/queue">
                <Button variant="outline" size="sm" className="gap-2 hover:scale-105 transition-all duration-200 group">
                  View Details
                  <Activity className="h-3.5 w-3.5 group-hover:rotate-12 transition-transform" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border-2 bg-card p-4 hover:border-blue-500/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group animate-fade-in-up animation-delay-100">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform inline-block">Priority Queues</div>
                <div className="text-sm text-muted-foreground mt-1">Critical, High, Normal, Low tiers</div>
              </div>
              <div className="rounded-lg border-2 bg-card p-4 hover:border-green-500/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group animate-fade-in-up animation-delay-200">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform inline-block">Auto Retry</div>
                <div className="text-sm text-muted-foreground mt-1">Exponential backoff up to 3 attempts</div>
              </div>
              <div className="rounded-lg border-2 bg-card p-4 hover:border-purple-500/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group animate-fade-in-up animation-delay-300">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform inline-block">Failover</div>
                <div className="text-sm text-muted-foreground mt-1">SMS/Push → Email backup</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Metrics Section */}
      <section id="metrics" className="mx-auto max-w-6xl px-6 pb-12 scroll-mt-20">
        <div className="mb-6 animate-fade-in-up">
          <h2 className="text-2xl font-bold tracking-tight">Delivery Metrics & Analytics</h2>
          <p className="text-muted-foreground mt-1">Monitor notification performance across all channels</p>
        </div>
        <MetricsCards />
      </section>

      {/* Main Content Grid */}
      <main className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="animate-fade-in-up animation-delay-100">
              <h2 className="text-xl font-bold tracking-tight mb-4">Recent Activity</h2>
              <HistoryTable userId={demoUserId} />
            </div>
            <div className="animate-fade-in-up animation-delay-200">
              <h2 className="text-xl font-bold tracking-tight mb-4">Test Notifications</h2>
              <SendTestCard userId={demoUserId} />
            </div>
          </div>
          <div className="lg:col-span-1 animate-fade-in-up animation-delay-300">
            <h2 className="text-xl font-bold tracking-tight mb-4">User Preferences</h2>
            <PreferencesForm userId={demoUserId} />
          </div>
        </div>
      </main>
    </div>
  );
}