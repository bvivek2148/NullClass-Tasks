import { Header } from "@/components/layout/header";
import { ComponentsShowcase } from "@/components/sections/components-showcase";
import { Footer } from "@/components/layout/footer";

const Components = () => {
  return (
    <div className="min-h-screen bg-background transition-smooth custom-scrollbar">
      <Header />
      <main className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-heading font-bold mb-6 gradient-text">
            Component Library
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our comprehensive collection of beautifully designed, accessible components
          </p>
        </div>
        <ComponentsShowcase />
      </main>
      <Footer />
    </div>
  );
};

export default Components;
