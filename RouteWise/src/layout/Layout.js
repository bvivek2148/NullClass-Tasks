import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "../utils/index.js";
import { User } from "../entities/User.js";
import { 
  Navigation, 
  Map, 
  Route, 
  History, 
  BarChart3, 
  Settings,
  Users,
  BookOpen,
  LogOut,
  User as UserIcon,
  Bell,
  HelpCircle,
  Menu,
  X
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "../Components/ui/sidebar.js";
import { Badge } from "../Components/ui/badge.js";
import { Button } from "../Components/ui/button.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../Components/ui/dropdown-menu.js";

const navigationItems = [
  {
    title: "Route Planner",
    url: createPageUrl("RoutePlanner"),
    icon: Map,
    description: "Plan your journeys"
  },
  {
    title: "My Trips",
    url: createPageUrl("MyTrips"),
    icon: History,
    description: "View saved trips"
  },
  {
    title: "Analytics",
    url: createPageUrl("Analytics"),
    icon: BarChart3,
    description: "Performance insights"
  },
  {
    title: "Shared Routes",
    url: createPageUrl("SharedRoutes"),
    icon: Users,
    description: "Community routes"
  }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const isHomePage = location.pathname === createPageUrl("Home") || location.pathname === "/";

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
    } catch (error) {
      // User not logged in
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      await User.loginWithRedirect(window.location.origin + createPageUrl("RoutePlanner"));
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await User.logout();
      setCurrentUser(null);
      navigate(createPageUrl("Home"));
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };
  
  // User data with fallback
  const user = currentUser ? {
    name: currentUser.full_name || "User",
    email: currentUser.email || "",
    role: currentUser.subscription_type === 'professional' ? "Pro User" : currentUser.role === 'admin' ? "Admin" : "Free User",
    avatar: currentUser.avatar_url || null,
    initials: currentUser.getInitials(),
    stats: {
      totalTrips: currentUser.statistics.totalTrips,
      totalDistance: currentUser.getFormattedStats().totalDistance,
      savings: currentUser.getFormattedStats().totalSavings
    }
  } : {
    name: "Guest User",
    email: "guest@example.com",
    role: "Guest",
    avatar: null,
    initials: "G",
    stats: {
      totalTrips: 0,
      totalDistance: "0 km",
      savings: "₹0"
    }
  };

  // Public website header for home page
  if (isHomePage) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Website Navigation */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-slate-200/60 shadow-sm">
          <nav className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link to={createPageUrl("Home")} className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg">
                    <Navigation className="w-6 h-6 text-white" />
                  </div>
                </div>
                <span className="text-2xl font-black text-slate-900">RouteWise</span>
                <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs">
                  Pro
                </Badge>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-8">
                <Link to={createPageUrl("RoutePlanner")} className="text-slate-700 hover:text-blue-600 font-semibold transition-colors">
                  Features
                </Link>
                <Link to={createPageUrl("Analytics")} className="text-slate-700 hover:text-blue-600 font-semibold transition-colors">
                  Analytics
                </Link>
                <a href="#pricing" className="text-slate-700 hover:text-blue-600 font-semibold transition-colors">
                  Pricing
                </a>
                <a href="#testimonials" className="text-slate-700 hover:text-blue-600 font-semibold transition-colors">
                  Customers
                </a>
              </div>

              {/* CTA Buttons */}
              <div className="hidden md:flex items-center gap-4">
                {loading ? (
                  <div className="w-20 h-10 bg-slate-200 animate-pulse rounded"></div>
                ) : currentUser ? (
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-700">Welcome, {user.name.split(' ')[0]}</span>
                    <Link to={createPageUrl("RoutePlanner")}>
                      <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-lg">
                        Go to Dashboard
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    <Button 
                      variant="ghost" 
                      className="font-semibold text-slate-700"
                      onClick={handleSignIn}
                    >
                      Sign In
                    </Button>
                    <Link to={createPageUrl("RoutePlanner")}>
                      <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold shadow-lg">
                        Start Free Trial
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden mt-4 pb-4 space-y-3">
                <Link to={createPageUrl("RoutePlanner")} className="block text-slate-700 hover:text-blue-600 font-semibold py-2">
                  Features
                </Link>
                <Link to={createPageUrl("Analytics")} className="block text-slate-700 hover:text-blue-600 font-semibold py-2">
                  Analytics
                </Link>
                <a href="#pricing" className="block text-slate-700 hover:text-blue-600 font-semibold py-2">
                  Pricing
                </a>
                <a href="#testimonials" className="block text-slate-700 hover:text-blue-600 font-semibold py-2">
                  Customers
                </a>
                <div className="pt-4 space-y-2">
                  {loading ? (
                    <div className="w-full h-10 bg-slate-200 animate-pulse rounded"></div>
                  ) : currentUser ? (
                    <Link to={createPageUrl("RoutePlanner")}>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold">
                        Go to Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Button 
                        variant="outline" 
                        className="w-full font-semibold"
                        onClick={handleSignIn}
                      >
                        Sign In
                      </Button>
                      <Link to={createPageUrl("RoutePlanner")}>
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold">
                          Start Free Trial
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}
          </nav>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    );
  }

  // App interface for other pages
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
        <style>
          {`
            :root {
              --primary-gradient: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
              --success-gradient: linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%);
              --warning-gradient: linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #fbbf24 100%);
            }
          `}
        </style>
        
        <Sidebar className="border-r border-white/60 bg-white/95 backdrop-blur-xl shadow-xl">
          <SidebarHeader className="border-b border-slate-200/50 p-6 bg-white/80">
            <Link to={createPageUrl("Home")} className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center shadow-lg">
                  <Navigation className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-xl">RouteWise Pro</h2>
                <p className="text-sm text-slate-600 font-medium">Professional Planning</p>
              </div>
            </Link>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider px-3 py-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`group relative overflow-hidden rounded-xl transition-all duration-300 ${
                          location.pathname === item.url 
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-[1.02]' 
                            : 'hover:bg-white hover:shadow-md hover:scale-[1.01] text-slate-700'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-4 px-4 py-4">
                          <div className={`p-2 rounded-lg transition-colors ${
                            location.pathname === item.url 
                              ? 'bg-white/20' 
                              : 'bg-slate-100 group-hover:bg-slate-200'
                          }`}>
                            <item.icon className={`w-5 h-5 ${
                              location.pathname === item.url ? 'text-white' : 'text-slate-600'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold">{item.title}</div>
                            <div className={`text-xs ${
                              location.pathname === item.url ? 'text-blue-100' : 'text-slate-500'
                            }`}>
                              {item.description}
                            </div>
                          </div>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-bold text-slate-500 uppercase tracking-wider px-3 py-4">
                Quick Stats
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-4 space-y-4">
                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-xl border border-emerald-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-emerald-900">Total Trips</span>
                      <Badge className="bg-emerald-500 text-white">{user.stats.totalTrips}</Badge>
                    </div>
                    <div className="text-2xl font-black text-emerald-900">{user.stats.totalDistance}</div>
                    <div className="text-xs text-emerald-700">Distance covered</div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-blue-900">Total Savings</span>
                      <Badge className="bg-blue-500 text-white">₹</Badge>
                    </div>
                    <div className="text-2xl font-black text-blue-900">{user.stats.savings}</div>
                    <div className="text-xs text-blue-700">Cost optimized</div>
                  </div>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t border-slate-200/50">
            <Button 
              variant="ghost" 
              className="w-full justify-start p-4 hover:bg-white hover:shadow-md rounded-xl group"
              onClick={() => {
                console.log('Profile button clicked!'); // Debug log
                const profileUrl = window.location.origin + createPageUrl("Profile");
                console.log('Opening profile URL:', profileUrl); // Debug log
                try {
                  const newWindow = window.open(profileUrl, '_blank', 'noopener,noreferrer,width=1200,height=800,scrollbars=yes,resizable=yes');
                  if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                    console.log('Popup blocked, using fallback'); // Debug log
                    // Fallback if popup blocked
                    window.open(profileUrl, '_blank');
                  } else {
                    console.log('New window opened successfully'); // Debug log
                  }
                } catch (error) {
                  console.error('Error opening profile:', error);
                  // Final fallback
                  window.location.href = profileUrl;
                }
              }}
            >
              <div className="flex items-center gap-4 w-full">
                <div className="w-12 h-12 rounded-xl shadow-lg group-hover:scale-110 transition-transform overflow-hidden border-2 border-white/50">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{user.initials}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-bold text-slate-900">{user.name}</div>
                  <div className="text-sm text-slate-600">{user.role}</div>
                  <div className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded-md">🔗 CLICK TO OPEN PROFILE</div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <UserIcon className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-all" />
                  <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </Button>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <header className="h-16 border-b border-slate-200/60 bg-white/95 backdrop-blur-xl flex items-center justify-between px-6 shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="lg:hidden" />
              <div>
                <h2 className="font-bold text-slate-900 text-lg">{currentPageName}</h2>
                <p className="text-sm text-slate-600">Welcome back, {user.name.split(' ')[0]}! 👋</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
              
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div className="w-10 h-10 rounded-lg shadow-md overflow-hidden border border-blue-300">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <span className="text-white font-bold">{user.initials}</span>
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">{user.name}</div>
                  <div className="text-xs text-slate-600">{user.role}</div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}