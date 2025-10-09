import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle, ThemeToggleSwitch } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sun, Moon, Zap, Palette, Shield } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28 lg:py-32">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 gradient-mesh opacity-40" />
      
      {/* Animated Glow Orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 gradient-primary opacity-20 blur-3xl rounded-full animate-glow-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 gradient-accent opacity-15 blur-3xl rounded-full animate-glow-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="relative container mx-auto max-w-7xl px-6">
        <div className="text-center">
          {/* Badge */}
          <div className="mb-8 flex justify-center animate-fade-in">
            <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 px-4 py-1.5 text-sm shadow-md">
              <Zap className="mr-2 h-4 w-4" />
              Enhanced Design System
            </Badge>
          </div>

          {/* Main Headline */}
          <h1 className="mb-6 font-heading font-bold tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-display-lg animate-fade-in-up">
            Craft Beautiful
            <span className="relative inline-block mx-3">
              <span className="text-gradient">
                Experiences
              </span>
              <div className="absolute -inset-2 gradient-primary opacity-20 blur-2xl" />
            </span>
            <br />
            <span className="text-muted-foreground">With Modern UI</span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-12 max-w-3xl text-lg sm:text-xl leading-relaxed text-muted-foreground animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            A professional component library featuring stunning dark mode, seamless animations, 
            and a refined design system. Built with precision by Vivek using React, TypeScript, and Tailwind CSS.
          </p>

          {/* CTA Buttons */}
          <div className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Button size="lg" className="h-14 px-10 gradient-primary text-white shadow-elegant hover:shadow-glow transition-all hover:-translate-y-0.5 text-base font-medium">
              Explore Components
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="h-14 px-10 text-base font-medium border-2 hover:bg-secondary/80">
              View Showcase
            </Button>
          </div>

          {/* Feature Pills */}
          <div className="mb-20 flex flex-wrap justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center rounded-full bg-background/80 backdrop-blur-sm border-2 border-border/50 px-5 py-2.5 text-sm font-medium shadow-sm hover:shadow-md hover-lift">
              <Palette className="mr-2 h-4 w-4 text-primary" />
              Theme System
            </div>
            <div className="flex items-center rounded-full bg-background/80 backdrop-blur-sm border-2 border-border/50 px-5 py-2.5 text-sm font-medium shadow-sm hover:shadow-md hover-lift">
              <Shield className="mr-2 h-4 w-4 text-green-500" />
              Type Safe
            </div>
            <div className="flex items-center rounded-full bg-background/80 backdrop-blur-sm border-2 border-border/50 px-5 py-2.5 text-sm font-medium shadow-sm hover:shadow-md hover-lift">
              <Zap className="mr-2 h-4 w-4 text-amber-500" />
              Optimized Performance
            </div>
          </div>

          {/* Theme Demo Card */}
          <div className="mx-auto max-w-lg animate-scale-in" style={{ animationDelay: '0.4s' }}>
            <Card className="shadow-xl border-border/50 hover:shadow-2xl transition-all hover:-translate-y-1 overflow-hidden bg-gradient-to-br from-card via-card to-card/50">
              <CardHeader className="text-center space-y-3 pb-4">
                <CardTitle className="flex items-center justify-center space-x-3 text-xl font-heading">
                  <Sun className="h-6 w-6 text-amber-500" />
                  <span>Interactive Demo</span>
                  <Moon className="h-6 w-6 text-blue-400" />
                </CardTitle>
                <CardDescription className="text-base">
                  Experience the smooth theme transitions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 px-6 pb-8">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-subtle">
                  <span className="text-sm font-semibold">Button Toggle</span>
                  <ThemeToggle />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-subtle">
                  <span className="text-sm font-semibold">Switch Toggle</span>
                  <ThemeToggleSwitch />
                </div>
                <div className="rounded-xl bg-muted/50 p-5 text-center border border-border/50">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    ✨ Notice the seamless animations and color transitions!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}