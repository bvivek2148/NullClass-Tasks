import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Palette, Github, Twitter, Globe } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const links = {
    product: [
      { name: "Features", href: "#features" },
      { name: "Components", href: "#components" },
      { name: "Documentation", href: "#docs" },
      { name: "Changelog", href: "#" },
    ],
    resources: [
      { name: "Getting Started", href: "#" },
      { name: "API Reference", href: "#" },
      { name: "Examples", href: "#" },
      { name: "Best Practices", href: "#" },
    ],
    company: [
      { name: "About", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Contact", href: "#" },
    ],
  };

  return (
    <footer className="border-t border-border/50 glass-effect mt-20">
      <div className="container mx-auto max-w-7xl px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-6 group">
              <div className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl gradient-primary shadow-md group-hover:shadow-glow transition-all">
                  <Palette className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold tracking-tight">Lumos</h3>
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  Professional
                </Badge>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground mb-8 max-w-sm leading-relaxed">
              Beautiful, accessible, and customizable component library built with modern React and TypeScript. 
              Perfect for crafting professional applications with stunning design.
            </p>
            <div className="flex space-x-3">
              <a
                href="#"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-muted-foreground transition-all hover:bg-primary hover:text-white hover:shadow-md hover:-translate-y-0.5"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-muted-foreground transition-all hover:bg-primary hover:text-white hover:shadow-md hover:-translate-y-0.5"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-muted-foreground transition-all hover:bg-primary hover:text-white hover:shadow-md hover:-translate-y-0.5"
              >
                <Globe className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h4 className="font-heading font-semibold mb-5 text-sm uppercase tracking-wider">Product</h4>
            <ul className="space-y-3">
              {links.product.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-5 text-sm uppercase tracking-wider">Resources</h4>
            <ul className="space-y-3">
              {links.resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-5 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              {links.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-10 bg-border/50" />

        {/* Bottom Footer */}
        <div className="flex flex-col items-center justify-between space-y-4 text-sm text-muted-foreground md:flex-row md:space-y-0">
          <p>
            © {currentYear} Lumos. Built with React, TypeScript & Tailwind CSS.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="transition-colors hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Terms
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              License
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}