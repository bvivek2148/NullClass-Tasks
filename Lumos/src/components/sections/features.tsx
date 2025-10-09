import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Palette, 
  Zap, 
  Shield, 
  Smartphone, 
  Code, 
  Layers,
  Moon,
  Sun,
  Monitor
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Persistent Storage",
    description: "Your theme preference is automatically saved to localStorage and restored across browser sessions with zero configuration.",
    icon: Shield,
    badge: "Reliable",
    color: "text-emerald-500"
  },
  {
    title: "System Detection",
    description: "Intelligently detects and respects your operating system's dark mode preference on first visit.",
    icon: Monitor,
    badge: "Smart",
    color: "text-blue-500"
  },
  {
    title: "Smooth Transitions",
    description: "Beautiful CSS transitions with no flash of unstyled content (FOUC) during theme switches.",
    icon: Zap,
    badge: "Fast",
    color: "text-amber-500"
  },
  {
    title: "Mobile Optimized",
    description: "Fully responsive design that works perfectly across all devices and screen sizes.",
    icon: Smartphone,
    badge: "Responsive",
    color: "text-purple-500"
  },
  {
    title: "Developer Friendly",
    description: "Built with TypeScript, modern React patterns, and comprehensive component documentation.",
    icon: Code,
    badge: "TypeScript",
    color: "text-cyan-500"
  },
  {
    title: "Accessible Design",
    description: "WCAG compliant with proper focus states, ARIA labels, and keyboard navigation support.",
    icon: Layers,
    badge: "A11y",
    color: "text-pink-500"
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 sm:py-28 lg:py-32 relative">
      <div className="container mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="text-center mb-20">
          <Badge variant="outline" className="mb-6 border-2 px-4 py-1.5">
            Features
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold tracking-tight mb-6">
            Everything you need for
            <span className="text-gradient block mt-2"> exceptional user interfaces</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
            A complete design system built with modern web standards and best practices.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="group relative overflow-hidden border-2 border-border/50 hover:border-primary/30 bg-gradient-to-br from-card to-card/50 transition-all duration-500 hover:shadow-xl hover:-translate-y-2"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300",
                    "bg-gradient-to-br from-primary/10 to-primary/5",
                    "group-hover:from-primary/20 group-hover:to-primary/10",
                    "group-hover:scale-110 group-hover:rotate-3"
                  )}>
                    <feature.icon className={cn("h-7 w-7", feature.color)} />
                  </div>
                  <Badge variant="secondary" className="text-xs font-medium px-3">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-heading">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>

              {/* Hover Gradient Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <Card className="inline-block gradient-hero border-primary/20 shadow-lg hover:shadow-xl transition-all">
            <CardContent className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 p-8">
              <div className="flex items-center space-x-3">
                <Sun className="h-7 w-7 text-amber-500" />
                <Moon className="h-7 w-7 text-blue-400" />
              </div>
              <div className="text-center sm:text-left">
                <p className="font-semibold text-lg mb-1">Ready to experience it?</p>
                <p className="text-sm text-muted-foreground">Toggle the theme using the buttons in the header!</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}