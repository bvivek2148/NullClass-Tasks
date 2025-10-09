import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/Components/ui/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs.jsx";
import { MessageCircle, Calendar, MapPin, Ticket, Sparkles, Clock, Shield, Award, TrendingUp, Users, Globe, CheckCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from "@/utils/index.js";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const features = [
  {
    icon: MessageCircle,
    title: "24/7 AI Support",
    description: "Get instant answers to your questions at any time. Our AI assistant is always ready to help you with your travel needs.",
    color: "orange",
    gradient: "from-orange-500 to-orange-600"
  },
  {
    icon: Calendar,
    title: "Easy Booking",
    description: "Book your travel in seconds. Just chat with our assistant and get your trip booked instantly.",
    color: "blue",
    gradient: "from-blue-500 to-blue-600"
  },
  {
    icon: MapPin,
    title: "Route Information",
    description: "Get information on available routes, schedules, and pricing. Find all details for your journey.",
    color: "green",
    gradient: "from-green-500 to-green-600"
  },
  {
    icon: Clock,
    title: "Real-time Updates",
    description: "Stay informed with live schedule updates and instant notifications about your journey.",
    color: "purple",
    gradient: "from-purple-500 to-purple-600"
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Your transactions are protected with bank-level security and encryption protocols.",
    color: "red",
    gradient: "from-red-500 to-red-600"
  },
  {
    icon: Award,
    title: "Best Price Guarantee",
    description: "We ensure you get the best prices for all your travel bookings with our price match guarantee.",
    color: "yellow",
    gradient: "from-yellow-500 to-yellow-600"
  }
];

const stats = [
  { icon: Users, value: "1M+", label: "Happy Travelers" },
  { icon: MapPin, value: "500+", label: "Available Routes" },
  { icon: TrendingUp, value: "98%", label: "Satisfaction Rate" },
  { icon: Globe, value: "100+", label: "Connected Cities" }
];

const testimonials = [
  {
    name: "Vivek Bukka",
    role: "Frequent Traveler",
    content: "TravelMate AI has revolutionized how I book my travels. The AI assistant is incredibly helpful and saves me so much time!",
    rating: 5
  },
  {
    name: "Rajesh Kumar",
    role: "Family Traveler",
    content: "The best travel booking platform I've used. The interface is intuitive and the support is excellent.",
    rating: 5
  },
  {
    name: "Anita Patel",
    role: "Weekend Explorer",
    content: "I love how easy it is to find routes and book tickets. The real-time updates are game changers!",
    rating: 5
  }
];

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-emerald-600 text-white overflow-hidden flex items-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/3 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00em0wIDEwYzAtMi4yMSAxLjc5LTQgNC00czQgMS43OSA0IDQtMS43OSA0LTQgNC00LTEuNzktNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24 w-full">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center space-y-8 max-w-4xl mx-auto"
          >
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 shadow-lg mb-6">
                <Sparkles className="h-5 w-5" />
                <span className="text-sm font-semibold">AI-Powered Travel Platform</span>
              </div>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight"
            >
              Smart Travel with
              <span className="block mt-2">AI Assistance</span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-2xl text-orange-50 leading-relaxed"
            >
              Experience seamless booking with instant assistance, real-time updates, and personalized travel recommendations.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-8 w-full max-w-md mx-auto sm:max-w-none"
            >
              <Link to={createPageUrl("Chat")} className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  className="w-full gap-2 bg-white text-blue-700 hover:bg-blue-50 shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 text-lg px-10 py-7 rounded-2xl font-semibold transform hover:scale-105"
                >
                  <MessageCircle className="h-6 w-6" />
                  Chat Now
                </Button>
              </Link>
              <Link to={createPageUrl("Routes")} className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full gap-2 border-2 border-white text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-300 text-lg px-10 py-7 rounded-2xl font-semibold transform hover:scale-105"
                >
                  <MapPin className="h-6 w-6" />
                  View Routes
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-slate-900 mb-2">{stat.value}</div>
                  <div className="text-slate-600 font-medium">{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Features Section with Tabs */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Powerful features designed to make your travel experience seamless and enjoyable
            </p>
          </motion.div>

          <Tabs defaultValue="overview" className="space-y-12" onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 h-16 bg-slate-100 p-1.5 rounded-2xl">
              <TabsTrigger 
                value="overview" 
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300 text-base font-semibold"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="features" 
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300 text-base font-semibold"
              >
                <Award className="h-5 w-5 mr-2" />
                Features
              </TabsTrigger>
              <TabsTrigger 
                value="how-it-works" 
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300 text-base font-semibold"
              >
                <Globe className="h-5 w-5 mr-2" />
                How It Works
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.slice(0, 3).map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      whileHover={{ y: -5 }}
                    >
                      <Card className="h-full border-slate-200 hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                        <CardHeader className="pb-4">
                          <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                            <Icon className="h-8 w-8 text-white" />
                          </div>
                          <CardTitle className="text-2xl">{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-slate-600 leading-relaxed text-base">
                            {feature.description}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="features">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      whileHover={{ scale: 1.03 }}
                    >
                      <Card className="h-full border-slate-200 hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                        <CardHeader className="pb-4">
                          <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                            <Icon className="h-8 w-8 text-white" />
                          </div>
                          <CardTitle className="text-2xl">{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-slate-600 leading-relaxed text-base">
                            {feature.description}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="how-it-works">
              <div className="max-w-4xl mx-auto space-y-8">
                {[
                  {
                    step: "01",
                    title: "Start a Conversation",
                    description: "Click the chat button and tell our AI assistant where you want to go.",
                    icon: MessageCircle,
                    color: "orange"
                  },
                  {
                    step: "02",
                    title: "Explore Options",
                    description: "Get instant personalized route suggestions, schedules, and pricing.",
                    icon: MapPin,
                    color: "blue"
                  },
                  {
                    step: "03",
                    title: "Book Your Trip",
                    description: "Confirm your booking details and receive instant confirmation.",
                    icon: Ticket,
                    color: "green"
                  },
                  {
                    step: "04",
                    title: "Travel with Confidence",
                    description: "Get real-time updates and support throughout your journey.",
                    icon: Shield,
                    color: "purple"
                  }
                ].map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.15, duration: 0.5 }}
                    >
                      <Card className="border-slate-200 hover:shadow-xl transition-all duration-300 bg-white overflow-hidden">
                        <CardContent className="p-8 flex items-start gap-8">
                          <div className={`flex-shrink-0 w-20 h-20 bg-gradient-to-br from-${step.color}-500 to-${step.color}-600 rounded-2xl flex items-center justify-center shadow-xl`}>
                            <Icon className="h-10 w-10 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-bold text-slate-400 mb-3">Step {step.step}</div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">{step.title}</h3>
                            <p className="text-slate-600 leading-relaxed text-base">{step.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Loved by Travelers
            </h2>
            <p className="text-xl text-slate-600">
              See what our customers have to say about their experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full border-slate-200 hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-slate-700 leading-relaxed mb-6 italic">
                      "{testimonial.content}"
                    </p>
                    <div>
                      <p className="font-semibold text-slate-900">{testimonial.name}</p>
                      <p className="text-sm text-slate-500">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-emerald-600 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-8"
            >
              <Sparkles className="h-20 w-20 mx-auto" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Your Journey?</h2>
            <p className="text-xl text-orange-50 mb-10 leading-relaxed">
              Join thousands of satisfied travelers and experience the future of travel booking today.
            </p>
            <Link to={createPageUrl("Chat")}>
              <Button 
                size="lg" 
                className="gap-2 bg-white text-blue-700 hover:bg-blue-50 shadow-2xl hover:shadow-white/50 transition-all duration-300 text-lg px-10 py-7 rounded-2xl font-semibold transform hover:scale-105"
              >
                <MessageCircle className="h-6 w-6" />
                Get Started Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}