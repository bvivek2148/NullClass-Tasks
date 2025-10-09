import Link from "next/link";
import { Bell, Activity, FileText, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-slide-down">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold transition-all duration-200 hover:text-primary hover:scale-105 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary group-hover:rotate-12 transition-transform">
            <Bell className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg">NotifyHub</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="transition-all duration-200 hover:text-primary hover:scale-105 relative group">
            Dashboard
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full" />
          </Link>
          <Link href="/queue" className="flex items-center gap-1.5 transition-all duration-200 hover:text-primary hover:scale-105 relative group">
            <Activity className="h-4 w-4 group-hover:rotate-12 transition-transform" />
            Queue
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full" />
          </Link>
          <Link href="/templates" className="flex items-center gap-1.5 transition-all duration-200 hover:text-primary hover:scale-105 relative group">
            <FileText className="h-4 w-4 group-hover:rotate-12 transition-transform" />
            Templates
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full" />
          </Link>
          <Link href="/profile" className="flex items-center gap-1.5 transition-all duration-200 hover:text-primary hover:scale-105 relative group">
            <User className="h-4 w-4 group-hover:rotate-12 transition-transform" />
            Profile
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full" />
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="md:hidden hover:scale-105 transition-all duration-200">
            <Link href="/profile">
              <User className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};