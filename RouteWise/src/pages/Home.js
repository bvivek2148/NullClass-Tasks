
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils/index.js";
import { Button } from "../Components/ui/button.js";
import { Card, CardContent, CardHeader, CardTitle } from "../Components/ui/card.js";
import { Badge } from "../Components/ui/badge.js";
import { 
  Navigation, 
  Zap, 
  Shield, 
  TrendingUp, 
  Globe, 
  Clock, 
  DollarSign,
  Users,
  CheckCircle2,
  ArrowRight,
  Star,
  BarChart3,
  Target,
  Sparkles,
  Award,
  ChevronRight,
  Play
} from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const features = [
    {
      icon: Zap,
      title: "AI-Powered Optimization",
      description: "Advanced algorithms optimize your routes in real-time across India's diverse road networks, saving time and fuel costs.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption and compliance with Indian data protection standards.",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: TrendingUp,
      title: "Performance Analytics",
      description: "Comprehensive insights into your travel patterns, costs, and efficiency metrics in INR.",
      color: "from-emerald-500 to-green-600"
    },
    {
      icon: Globe,
      title: "Pan-India Coverage",
      description: "Plan routes across all Indian cities with real-time traffic updates from Mumbai to Delhi, Bangalore to Kolkata.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share routes with your team, coordinate deliveries, and manage fleet operations seamlessly.",
      color: "from-cyan-500 to-blue-500"
    },
    {
      icon: Clock,
      title: "Real-Time Traffic Updates",
      description: "Live traffic conditions, monsoon alerts, festival rush predictions, and dynamic route adjustments.",
      color: "from-red-500 to-orange-500"
    }
  ];

  const stats = [
    { value: "50L+", label: "Routes Planned", icon: Navigation },
    { value: "99.9%", label: "Uptime SLA", icon: Shield },
    { value: "15L+", label: "Active Users", icon: Users },
    { value: "42%", label: "Cost Savings", icon: DollarSign }
  ];

  const testimonials = [
    {
      name: "Vivek Bukka",
      role: "Founder & CEO",
      company: "TechLogistics India",
      content: "RouteWise has completely revolutionized how we handle our nationwide delivery network. The AI optimization saves us over ₹5 lakhs monthly in fuel costs across our fleet.",
      rating: 5,
      image: "VB"
    },
    {
      name: "Vivek Bukka",
      role: "Operations Manager",
      company: "Delhivery Logistics",
      content: "RouteWise has transformed our delivery operations across Delhi-NCR. We've cut fuel costs by 35% and improved on-time delivery rates significantly during peak traffic hours.",
      rating: 5,
      image: "PS"
    },
    {
      name: "Rajesh Kumar",
      role: "Fleet Director",
      company: "BlueDart Express",
      content: "The AI optimization handles Indian traffic conditions brilliantly. Our drivers love how it adapts to festival seasons, monsoons, and metro city rush hours.",
      rating: 5,
      image: "RK"
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "Free",
      period: "",
      description: "Perfect for individuals",
      features: [
        "Up to 10 routes per month",
        "Basic route optimization",
        "Mobile access",
        "Community support",
        "Indian traffic integration"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "₹999",
      period: "/month",
      description: "For power users & SMEs",
      features: [
        "Unlimited routes",
        "AI-powered optimization",
        "Advanced analytics dashboard",
        "Priority support (IST hours)",
        "Team collaboration (5 users)",
        "Export & sharing",
        "GST invoicing"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations",
      features: [
        "Everything in Professional",
        "Custom integrations",
        "Dedicated account manager",
        "SLA guarantees",
        "Advanced security & compliance",
        "White-label options",
        "Unlimited team members",
        "On-premise deployment option"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Badge className="mb-6 bg-blue-500/20 text-blue-300 border-blue-400/30 px-4 py-2 text-sm font-semibold">
              <Sparkles className="w-4 h-4 mr-2 inline" />
              AI-Powered Route Intelligence for India
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
              Smart Route Planning
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Made for India
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              Navigate India's roads smarter with AI-powered optimization, real-time traffic updates, and intelligent routing. Save time, reduce costs, and improve efficiency across all Indian cities.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to={createPageUrl("RoutePlanner")}>
                <Button className="h-14 px-8 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-lg shadow-2xl shadow-blue-500/50 group">
                  शुरू करें - Start Free
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Button variant="outline" className="h-14 px-8 border-2 border-white/20 hover:bg-white/10 text-white font-bold text-lg backdrop-blur-sm">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
            
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-blue-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Free forever plan
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Cancel anytime
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                GST compliant
              </div>
            </div>
          </motion.div>

          {/* Hero Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-blue-300" />
                  <div className="text-3xl font-black mb-1">{stat.value}</div>
                  <div className="text-sm text-blue-200">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800 px-4 py-2">
              <Target className="w-4 h-4 mr-2 inline" />
              Powerful Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              Built for Indian Roads
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Optimized for Your Journey
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Navigate Mumbai traffic, Delhi metro expansion zones, Bangalore tech corridors, and highway tolls with confidence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-300 border-0 bg-white group hover:-translate-y-1">
                  <CardHeader>
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-800 px-4 py-2">
              <Award className="w-4 h-4 mr-2 inline" />
              Customer Stories
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              Trusted by India's Leading
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Logistics Companies
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              From Mumbai to Kolkata, businesses trust RouteWise for their daily operations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-slate-700 mb-6 leading-relaxed italic">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                        {testimonial.image}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{testimonial.name}</div>
                        <div className="text-sm text-slate-600">{testimonial.role}</div>
                        <div className="text-sm text-slate-500">{testimonial.company}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-emerald-100 text-emerald-800 px-4 py-2">
              <DollarSign className="w-4 h-4 mr-2 inline" />
              Simple Pricing in INR
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              Affordable Plans for
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Every Business Size
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Transparent pricing with GST included. Pay in INR via UPI, cards, or net banking
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className={`h-full relative ${
                  plan.popular 
                    ? 'border-2 border-blue-500 shadow-2xl shadow-blue-500/20 scale-105' 
                    : 'border border-slate-200 hover:shadow-xl'
                } transition-all duration-300`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-1 shadow-lg">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-2xl font-bold text-slate-900 mb-2">
                      {plan.name}
                    </CardTitle>
                    <p className="text-slate-600 mb-6">{plan.description}</p>
                    <div className="flex items-end justify-center gap-1">
                      <span className="text-5xl font-black text-slate-900">{plan.price}</span>
                      {plan.period && (
                        <span className="text-slate-600 mb-2">{plan.period}</span>
                      )}
                    </div>
                    {plan.price !== "Free" && plan.price !== "Custom" && (
                      <p className="text-sm text-slate-500 mt-2">+ 18% GST</p>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {plan.features.map((feature, fIndex) => (
                      <div key={fIndex} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">{feature}</span>
                      </div>
                    ))}
                    <Link to={createPageUrl("RoutePlanner")}>
                      <Button 
                        className={`w-full h-12 mt-6 font-bold ${
                          plan.popular
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                        }`}
                      >
                        Get Started
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-slate-600 mb-4">
              All plans include: UPI/Card/Net Banking payments • GST invoicing • 24/7 Support (IST hours)
            </p>
            <Badge variant="outline" className="text-emerald-600 border-emerald-300">
              30-day money-back guarantee • No questions asked
            </Badge>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Ready to Transform Your Indian Routes?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Join thousands of Indian businesses optimizing their logistics with RouteWise
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("RoutePlanner")}>
                <Button className="h-14 px-8 bg-white hover:bg-slate-100 text-blue-600 font-bold text-lg shadow-2xl">
                  Start Free Trial - निःशुल्क आरंभ करें
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button variant="outline" className="h-14 px-8 border-2 border-white/30 hover:bg-white/10 text-white font-bold text-lg backdrop-blur-sm">
                Contact Sales - संपर्क करें
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Navigation className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-black text-white">RouteWise</span>
              </div>
              <p className="text-slate-400 leading-relaxed mb-4">
                Professional route planning platform for Indian businesses.
              </p>
              <p className="text-sm text-slate-500">
                Made in India 🇮🇳 • Serving India's logistics needs
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link to={createPageUrl("RoutePlanner")} className="hover:text-white transition-colors">Route Planner</Link></li>
                <li><Link to={createPageUrl("Analytics")} className="hover:text-white transition-colors">Analytics</Link></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Integration</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support (IST 9AM-9PM)</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Refund Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GST Compliance</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400">
              © 2024 RouteWise India Pvt. Ltd. All rights reserved. • GSTIN: 27XXXXX1234X1ZX
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Twitter</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">LinkedIn</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
