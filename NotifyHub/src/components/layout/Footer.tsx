import Link from "next/link";
import { Bell, Github, Twitter, Linkedin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t bg-background animate-fade-in">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1 animate-fade-in-up">
            <Link href="/" className="flex items-center gap-2 font-semibold mb-4 hover:scale-105 transition-all duration-200 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary group-hover:rotate-12 transition-transform">
                <Bell className="h-4 w-4 text-primary-foreground" />
              </div>
              <span>NotifyHub</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Enterprise-grade multi-channel notification platform with advanced queue management.
            </p>
            <div className="flex gap-3">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary hover:scale-110 transition-all duration-200">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary hover:scale-110 transition-all duration-200">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary hover:scale-110 transition-all duration-200">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div className="animate-fade-in-up animation-delay-100">
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary hover:translate-x-1 inline-block transition-all duration-200">Dashboard</Link></li>
              <li><Link href="/queue" className="hover:text-primary hover:translate-x-1 inline-block transition-all duration-200">Queue Monitor</Link></li>
              <li><Link href="/templates" className="hover:text-primary hover:translate-x-1 inline-block transition-all duration-200">Templates</Link></li>
              <li><Link href="/profile" className="hover:text-primary hover:translate-x-1 inline-block transition-all duration-200">Preferences</Link></li>
            </ul>
          </div>

          {/* Features */}
          <div className="animate-fade-in-up animation-delay-200">
            <h3 className="font-semibold mb-4">Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span className="hover:text-primary hover:translate-x-1 inline-block transition-all duration-200 cursor-pointer">Email Notifications</span></li>
              <li><span className="hover:text-primary hover:translate-x-1 inline-block transition-all duration-200 cursor-pointer">SMS Delivery</span></li>
              <li><span className="hover:text-primary hover:translate-x-1 inline-block transition-all duration-200 cursor-pointer">Push Notifications</span></li>
              <li><span className="hover:text-primary hover:translate-x-1 inline-block transition-all duration-200 cursor-pointer">Analytics</span></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="animate-fade-in-up animation-delay-300">
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span className="hover:text-primary hover:translate-x-1 inline-block transition-all duration-200 cursor-pointer">Documentation</span></li>
              <li><span className="hover:text-primary hover:translate-x-1 inline-block transition-all duration-200 cursor-pointer">API Reference</span></li>
              <li><span className="hover:text-primary hover:translate-x-1 inline-block transition-all duration-200 cursor-pointer">Support</span></li>
              <li><span className="hover:text-primary hover:translate-x-1 inline-block transition-all duration-200 cursor-pointer">Status</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t animate-fade-in-up animation-delay-400">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} NotifyHub. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-primary hover:scale-105 inline-block transition-all duration-200">Privacy Policy</Link>
              <Link href="#" className="hover:text-primary hover:scale-105 inline-block transition-all duration-200">Terms of Service</Link>
              <Link href="#" className="hover:text-primary hover:scale-105 inline-block transition-all duration-200">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};