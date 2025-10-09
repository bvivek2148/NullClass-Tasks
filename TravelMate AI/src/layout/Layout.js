import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { createPageUrl } from "@/utils/index.js";
import { MessageCircle, Home, MapPin, Menu, X, Phone, Mail, MapPin as LocationIcon } from "lucide-react";
import { Button } from "@/Components/ui/button.jsx";
import ChatWidget from "../Components/ChatWidget.js";

const navigationItems = [
  {
    title: "Home",
    url: createPageUrl("Home"),
    icon: Home,
  },
  {
    title: "Routes",
    url: createPageUrl("Routes"),
    icon: MapPin,
  },
  {
    title: "Support",
    url: createPageUrl("Chat"),
    icon: MessageCircle,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isFullPage = currentPageName === "Chat";

  if (isFullPage) {
    return (
      <div className="min-h-screen">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Navigation Bar */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm"
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow"
              >
                <MessageCircle className="w-6 h-6 text-white" />
              </motion.div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  TravelMate AI
                </h1>
                <p className="text-xs text-slate-500">Smart Travel with AI</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.url;
                return (
                  <Link key={item.title} to={item.url}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={`gap-2 transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                          : "hover:bg-blue-50 hover:text-blue-700"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.title}
                    </Button>
                  </Link>
                );
              })}
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <Link to={createPageUrl("Chat")}>
                <Button className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <MessageCircle className="w-4 h-4" />
                  Get Help
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-slate-200 bg-white overflow-hidden"
            >
              <div className="px-4 py-6 space-y-3">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.url;
                  return (
                    <Link
                      key={item.title}
                      to={item.url}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className={`w-full justify-start gap-3 ${
                          isActive
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                            : ""
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {item.title}
                      </Button>
                    </Link>
                  );
                })}
                <Link to={createPageUrl("Chat")} onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    <MessageCircle className="w-5 h-5" />
                    Get Help
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold">TravelMate AI</h3>
              </div>
              <p className="text-slate-400 text-sm">
                Your trusted travel companion. Making travel booking easier with AI technology.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4 text-lg">Quick Links</h4>
              <ul className="space-y-2">
                {navigationItems.map((item) => (
                  <li key={item.title}>
                    <Link
                      to={item.url}
                      className="text-slate-400 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold mb-4 text-lg">Services</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li className="hover:text-white transition-colors cursor-pointer">Bus Booking</li>
                <li className="hover:text-white transition-colors cursor-pointer">Train Booking</li>
                <li className="hover:text-white transition-colors cursor-pointer">Flight Booking</li>
                <li className="hover:text-white transition-colors cursor-pointer">Cab Booking</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4 text-lg">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-slate-400 text-sm">
                  <Phone className="w-4 h-4" />
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center gap-3 text-slate-400 text-sm">
                  <Mail className="w-4 h-4" />
                  <span>support@travelmateai.com</span>
                </li>
                <li className="flex items-center gap-3 text-slate-400 text-sm">
                  <LocationIcon className="w-4 h-4" />
                  <span>Connaught Place, New Delhi</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              © {new Date().getFullYear()} TravelMate AI. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}