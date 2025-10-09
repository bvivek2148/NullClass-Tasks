import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Palette, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Styles", href: "/styles" },
    { name: "Features", href: "/#features" },
    { name: "Components", href: "/components" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 glass-effect shadow-sm">
      <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="relative">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-primary shadow-md group-hover:shadow-glow transition-all duration-300">
              <Palette className="h-6 w-6 text-white" />
            </div>
            <div className="absolute inset-0 rounded-xl gradient-primary opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />
          </div>
          <div>
            <h1 className="text-xl font-heading font-bold tracking-tight">Lumos</h1>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              Pro
            </Badge>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigation.map((item) => {
            const isActive = item.href.startsWith('/#') 
              ? location.pathname === '/' && location.hash === item.href.slice(1)
              : location.pathname === item.href;
            
            return item.href.startsWith('/#') ? (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "text-foreground bg-secondary" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                {item.name}
              </a>
            ) : (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "text-foreground bg-secondary" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-3">
          <Button variant="ghost" size="sm" className="hover:bg-secondary">
            Docs
          </Button>
          <Button size="sm" className="gradient-primary text-white shadow-md hover:shadow-lg transition-all">
            Get Started
          </Button>
          <ThemeToggle />
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-border/50 glass-effect md:hidden animate-fade-in">
          <div className="container mx-auto px-6 py-6">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => {
                const isActive = item.href.startsWith('/#') 
                  ? location.pathname === '/' && location.hash === item.href.slice(1)
                  : location.pathname === item.href;
                
                return item.href.startsWith('/#') ? (
                  <a
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "px-4 py-3 rounded-lg text-sm font-medium transition-all",
                      isActive 
                        ? "text-foreground bg-secondary" 
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "px-4 py-3 rounded-lg text-sm font-medium transition-all",
                      isActive 
                        ? "text-foreground bg-secondary" 
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <div className="flex flex-col space-y-2 pt-4 border-t border-border/50">
                <Button variant="ghost" size="sm">
                  Documentation
                </Button>
                <Button size="sm" className="gradient-primary text-white">
                  Get Started
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}