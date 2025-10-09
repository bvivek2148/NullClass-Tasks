import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { HeroSection } from "@/components/sections/hero";
import { FeaturesSection } from "@/components/sections/features";
import { ComponentsShowcase } from "@/components/sections/components-showcase";
import { Footer } from "@/components/layout/footer";

const Index = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-muted rounded mb-4"></div>
          <div className="h-4 w-48 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-smooth custom-scrollbar">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <ComponentsShowcase />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
