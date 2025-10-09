'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % 3);
    }, 5000);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Mumbai",
      text: "TravelCircles made my journey from Mumbai to Pune so comfortable. The community tips helped me discover amazing local spots!",
      rating: 5,
      avatar: "PS",
      verified: true
    },
    {
      name: "Rajesh Kumar",
      location: "Delhi",
      text: "Best bus booking platform I've used. The seat selection and real-time updates are fantastic. Highly recommended!",
      rating: 5,
      avatar: "RK",
      verified: true
    },
    {
      name: "Anita Patel",
      location: "Bangalore",
      text: "Love the community features! Met fellow travelers and got great advice for my trip to Chennai. Amazing experience!",
      rating: 5,
      avatar: "AP",
      verified: true
    }
  ];

  const features = [
    {
      icon: "⚡",
      title: "Lightning Fast Booking",
      description: "Book your bus tickets in under 60 seconds with our streamlined interface and smart seat selection.",
      color: "from-cyan-500 to-blue-600",
      bgColor: "bg-cyan-100",
      textColor: "text-cyan-800",
      badge: "60s Booking"
    },
    {
      icon: "👥",
      title: "Vibrant Community",
      description: "Connect with 50,000+ travelers, share experiences, and discover hidden gems across India.",
      color: "from-purple-500 to-violet-600",
      bgColor: "bg-purple-100",
      textColor: "text-purple-800",
      badge: "50K+ Members"
    },
    {
      icon: "🔒",
      title: "Bank-Grade Security",
      description: "Your data and payments are protected with enterprise-level security and verified operators.",
      color: "from-emerald-500 to-green-600",
      bgColor: "bg-emerald-100",
      textColor: "text-emerald-800",
      badge: "100% Secure"
    },
    {
      icon: "📱",
      title: "Real-Time Updates",
      description: "Get live bus tracking, delay notifications, and instant updates on your mobile device.",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-100",
      textColor: "text-orange-800",
      badge: "Live Tracking"
    },
    {
      icon: "🤖",
      title: "Smart Recommendations",
      description: "AI-powered suggestions for routes, timings, and travel companions based on your preferences.",
      color: "from-pink-500 to-rose-600",
      bgColor: "bg-pink-100",
      textColor: "text-pink-800",
      badge: "AI Powered"
    },
    {
      icon: "💰",
      title: "Best Price Guarantee",
      description: "Compare prices across operators and get the best deals with our price match guarantee.",
      color: "from-indigo-500 to-purple-600",
      bgColor: "bg-indigo-100",
      textColor: "text-indigo-800",
      badge: "Best Prices"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-slideIn {
          animation: slideIn 0.6s ease-out forwards;
        }

        .animate-pulse-custom {
          animation: pulse 2s ease-in-out infinite;
        }

        .glass-effect {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.18);
        }

        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-pattern {
          background-image:
            radial-gradient(circle at 25px 25px, rgba(255,255,255,0.2) 2px, transparent 0),
            radial-gradient(circle at 75px 75px, rgba(255,255,255,0.1) 2px, transparent 0);
          background-size: 100px 100px;
        }
      `}</style>
      {/* Enhanced Professional Header */}
      <header className={`${isScrolled ? 'bg-white/98 shadow-lg' : 'bg-white/95'} backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className={`flex items-center ${isVisible ? 'animate-slideIn' : 'opacity-0'}`}>
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">TravelCircles</h1>
                  <p className="text-xs text-gray-500 font-medium">India's #1 Bus Platform</p>
                </div>
              </Link>
            </div>

            <nav className={`hidden md:flex items-center space-x-6 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
              <Link href="/routes" className="relative text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 px-4 py-2 rounded-lg hover:bg-blue-50 group">
                <span className="flex items-center space-x-2">
                  <span>🚌</span>
                  <span>Routes</span>
                </span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></div>
              </Link>
              <Link href="/community" className="relative text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 px-4 py-2 rounded-lg hover:bg-blue-50 group">
                <span className="flex items-center space-x-2">
                  <span>👥</span>
                  <span>Community</span>
                </span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></div>
              </Link>
              <Link href="/tips" className="relative text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 px-4 py-2 rounded-lg hover:bg-blue-50 group">
                <span className="flex items-center space-x-2">
                  <span>💡</span>
                  <span>Tips</span>
                </span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></div>
              </Link>
              <div className="flex items-center space-x-3">
                <Link href="/register" className="text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 px-4 py-2 rounded-lg hover:bg-gray-50">
                  Sign Up
                </Link>
                <Link href="/login" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-bold hover:shadow-lg transition-all duration-300 hover:scale-105 border border-blue-500/30 relative overflow-hidden group">
                  <span className="relative z-10">Login</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </div>
            </nav>

            {/* Enhanced Mobile Menu Button */}
            <div className="md:hidden">
              <button className="text-gray-700 hover:text-blue-600 transition-colors p-3 rounded-xl hover:bg-gray-100 relative group">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <div className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800">
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        {/* Enhanced Animated Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-cyan-400 rounded-full filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute top-40 right-10 w-64 h-64 bg-pink-400 rounded-full filter blur-3xl opacity-15 animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-violet-400 rounded-full filter blur-3xl opacity-15 animate-float" style={{animationDelay: '4s'}}></div>
          <div className="absolute top-1/2 left-20 w-32 h-32 bg-yellow-400 rounded-full filter blur-2xl opacity-20 animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/3 right-20 w-48 h-48 bg-emerald-400 rounded-full filter blur-3xl opacity-15 animate-float" style={{animationDelay: '3s'}}></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-cyan-300/40 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-pink-300/50 rounded-full animate-pulse" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute bottom-1/4 left-1/3 w-5 h-5 bg-violet-300/40 rounded-full animate-pulse" style={{animationDelay: '2.5s'}}></div>
          <div className="absolute top-2/3 right-1/4 w-6 h-6 bg-yellow-300/30 rounded-full animate-pulse" style={{animationDelay: '3.5s'}}></div>
          <div className="absolute bottom-1/3 right-2/3 w-4 h-4 bg-emerald-300/40 rounded-full animate-pulse" style={{animationDelay: '4.5s'}}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <div className="mb-8">
              <span className="inline-flex items-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-full text-sm font-bold mb-6 shadow-lg border border-cyan-400/30 hover:shadow-xl transition-all duration-300 group">
                <span className="mr-2 text-lg animate-bounce">🚀</span>
                <span>India's Premier Bus Travel Platform</span>
                <span className="ml-2 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
              <span className="block text-white drop-shadow-lg animate-fadeInUp">
                Travel Together,
              </span>
              <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg animate-fadeInUp" style={{animationDelay: '0.3s'}}>
                Share Stories
              </span>
            </h1>

            <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto text-slate-200 leading-relaxed font-medium animate-fadeInUp" style={{animationDelay: '0.6s'}}>
              Experience seamless bus travel across India with our intelligent booking platform.
              Connect with fellow travelers, discover hidden gems, and create unforgettable memories.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-fadeInUp" style={{animationDelay: '0.9s'}}>
              <Link
                href="/routes"
                className="group bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-12 py-5 rounded-2xl text-xl font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center space-x-3 border border-cyan-400/30 shadow-lg relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center space-x-3">
                  <span>🎫 Find Routes</span>
                  <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>

              <Link
                href="/community"
                className="group bg-white/10 backdrop-blur-sm text-white px-12 py-5 rounded-2xl text-xl font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center space-x-3 border border-white/40 hover:bg-white/20 relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center space-x-3">
                  <span>👥 Join Community</span>
                  <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Enhanced Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto animate-fadeInUp" style={{animationDelay: '1.2s'}}>
              <div className="group text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="text-4xl md:text-5xl font-bold text-cyan-300 mb-2 drop-shadow-lg group-hover:scale-110 transition-transform duration-300">50K+</div>
                <div className="text-white text-base md:text-lg font-medium">Happy Travelers</div>
                <div className="w-full h-1 bg-cyan-300/30 rounded-full mt-3">
                  <div className="h-full bg-cyan-300 rounded-full w-4/5 group-hover:w-full transition-all duration-500"></div>
                </div>
              </div>
              <div className="group text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="text-4xl md:text-5xl font-bold text-emerald-300 mb-2 drop-shadow-lg group-hover:scale-110 transition-transform duration-300">200+</div>
                <div className="text-white text-base md:text-lg font-medium">Routes Available</div>
                <div className="w-full h-1 bg-emerald-300/30 rounded-full mt-3">
                  <div className="h-full bg-emerald-300 rounded-full w-3/4 group-hover:w-full transition-all duration-500"></div>
                </div>
              </div>
              <div className="group text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="text-4xl md:text-5xl font-bold text-violet-300 mb-2 drop-shadow-lg group-hover:scale-110 transition-transform duration-300">15+</div>
                <div className="text-white text-base md:text-lg font-medium">Cities Connected</div>
                <div className="w-full h-1 bg-violet-300/30 rounded-full mt-3">
                  <div className="h-full bg-violet-300 rounded-full w-2/3 group-hover:w-full transition-all duration-500"></div>
                </div>
              </div>
              <div className="group text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="text-4xl md:text-5xl font-bold text-pink-300 mb-2 drop-shadow-lg group-hover:scale-110 transition-transform duration-300">99.9%</div>
                <div className="text-white text-base md:text-lg font-medium">Uptime</div>
                <div className="w-full h-1 bg-pink-300/30 rounded-full mt-3">
                  <div className="h-full bg-pink-300 rounded-full w-full group-hover:w-full transition-all duration-500"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center space-y-2">
            <span className="text-white/70 text-sm font-medium">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-bounce"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-24 bg-gradient-to-br from-cyan-50 via-white to-purple-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="inline-flex items-center bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-3 rounded-full text-sm font-bold mb-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <span className="mr-2 text-lg group-hover:rotate-12 transition-transform duration-300">✨</span>
              <span>Premium Features</span>
              <span className="ml-2 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Everything You Need for
              <span className="block bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">Perfect Bus Travel</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium">
              Experience the future of bus travel with our cutting-edge platform designed specifically for the Indian market.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-gray-100 relative overflow-hidden"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Hover Effect Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

                <div className="relative z-10">
                  <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <span className="text-3xl">{feature.icon}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center group-hover:text-gray-800 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed mb-6 group-hover:text-gray-700 transition-colors duration-300">
                    {feature.description}
                  </p>
                  <div className="flex justify-center">
                    <span className={`${feature.bgColor} ${feature.textColor} px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2 group-hover:scale-105 transition-transform duration-300`}>
                      <span>{feature.icon}</span>
                      <span>{feature.badge}</span>
                    </span>
                  </div>
                </div>

                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>

          {/* Additional Trust Indicators */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Trusted by Millions</h3>
              <p className="text-gray-600">Join the growing community of satisfied travelers</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">🏆</div>
                <div className="text-lg font-bold text-gray-900">Award Winner</div>
                <div className="text-sm text-gray-600">Best Travel App 2024</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">⭐</div>
                <div className="text-lg font-bold text-gray-900">4.8/5 Rating</div>
                <div className="text-sm text-gray-600">50,000+ Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🔒</div>
                <div className="text-lg font-bold text-gray-900">SSL Secured</div>
                <div className="text-sm text-gray-600">256-bit Encryption</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">📞</div>
                <div className="text-lg font-bold text-gray-900">24/7 Support</div>
                <div className="text-sm text-gray-600">Always Here to Help</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-white via-cyan-50/30 to-purple-50/30 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 bg-cyan-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500 rounded-full filter blur-3xl"></div>
          <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-pink-500 rounded-full filter blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center bg-gradient-to-r from-emerald-600 to-cyan-600 text-white px-8 py-3 rounded-full text-sm font-bold mb-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <span className="mr-2 text-lg group-hover:scale-110 transition-transform duration-300">💬</span>
              <span>Customer Stories</span>
              <span className="ml-2 flex space-x-1">
                <span className="w-1 h-1 bg-white rounded-full animate-pulse"></span>
                <span className="w-1 h-1 bg-white rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></span>
                <span className="w-1 h-1 bg-white rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></span>
              </span>
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Loved by <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">50,000+ Travelers</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto font-medium">
              See what our community says about their TravelCircles experience
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`group bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200 relative overflow-hidden ${
                  index === currentTestimonial ? 'scale-105 ring-2 ring-blue-500 shadow-blue-200' : ''
                }`}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>

                {/* Verified Badge */}
                {testimonial.verified && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full shadow-lg">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}

                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-6 h-6 text-yellow-400 drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-sm text-gray-500 font-medium">Verified Review</span>
                  </div>

                  <p className="text-gray-800 mb-6 leading-relaxed italic text-lg font-medium group-hover:text-gray-900 transition-colors duration-300">
                    "{testimonial.text}"
                  </p>

                  <div className="flex items-center">
                    <div className="relative w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      {testimonial.avatar}
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors duration-300">
                        {testimonial.name}
                      </div>
                      <div className="text-gray-600 text-base font-medium flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {testimonial.location}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative Corner */}
                <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-tl-3xl"></div>
              </div>
            ))}
          </div>

          {/* Testimonial Navigation */}
          <div className="flex justify-center space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial
                    ? 'bg-blue-600 scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 overflow-hidden">
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-40 h-40 bg-cyan-400 rounded-full filter blur-3xl opacity-15 animate-float"></div>
          <div className="absolute bottom-20 right-20 w-56 h-56 bg-pink-400 rounded-full filter blur-3xl opacity-15 animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-violet-400 rounded-full filter blur-3xl opacity-15 animate-float" style={{animationDelay: '4s'}}></div>
          <div className="absolute top-1/3 left-1/4 w-24 h-24 bg-emerald-400 rounded-full filter blur-3xl opacity-10 animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-1/3 right-1/4 w-36 h-36 bg-yellow-400 rounded-full filter blur-3xl opacity-10 animate-float" style={{animationDelay: '3s'}}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <span className="inline-flex items-center bg-gradient-to-r from-cyan-400 to-pink-400 text-gray-900 px-8 py-3 rounded-full text-sm font-bold mb-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <span className="mr-2 text-lg group-hover:rotate-12 transition-transform duration-300">🎉</span>
              <span>Join the Revolution</span>
              <span className="ml-2 flex space-x-1">
                <span className="w-2 h-2 bg-gray-900 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-900 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                <span className="w-2 h-2 bg-gray-900 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
              </span>
            </span>

            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight drop-shadow-lg">
              Ready to Transform Your
              <span className="block bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
                Travel Experience?
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-slate-200 mb-12 leading-relaxed font-medium">
              Join 50,000+ smart travelers who've already discovered the future of bus travel in India.
              Your next adventure is just one click away.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Link
                href="/routes"
                className="group bg-gradient-to-r from-cyan-400 to-pink-400 text-gray-900 px-12 py-5 rounded-2xl text-xl font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center space-x-3 shadow-lg border border-cyan-300 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-violet-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center space-x-3">
                  <span>🚀 Start Your Journey</span>
                  <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>

              <Link
                href="/community"
                className="group bg-white/10 backdrop-blur-sm text-white px-12 py-5 rounded-2xl text-xl font-bold hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center space-x-3 border border-white/40 hover:bg-white/20 relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center space-x-3">
                  <span>💬 Join Community</span>
                  <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
            </div>

            {/* Enhanced Trust Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-center space-x-3 text-white bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <span className="text-2xl">✨</span>
                <span className="font-medium">No hidden fees</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-white bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <span className="text-2xl">🔒</span>
                <span className="font-medium">Secure payments</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-white bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <span className="text-2xl">📱</span>
                <span className="font-medium">Instant confirmation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Professional Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="py-16">
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
              {/* Enhanced Brand Section */}
              <div className="lg:col-span-2">
                <div className="flex items-center space-x-3 mb-6 group">
                  <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">TravelCircles</h3>
                    <p className="text-xs text-gray-400 font-medium">Connecting India, One Journey at a Time</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed max-w-md">
                  India's most trusted bus travel platform, connecting millions of travelers with seamless booking experiences and vibrant communities. Join us in revolutionizing travel across the subcontinent.
                </p>

                {/* Enhanced Social Links */}
                <div className="flex space-x-4 mb-6">
                  <a href="#" className="group w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-700 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl">
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="group w-12 h-12 bg-blue-800 rounded-xl flex items-center justify-center hover:bg-blue-900 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl">
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                    </svg>
                  </a>
                  <a href="#" className="group w-12 h-12 bg-pink-600 rounded-xl flex items-center justify-center hover:bg-pink-700 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl">
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                    </svg>
                  </a>
                  <a href="#" className="group w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center hover:bg-red-700 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl">
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                  <a href="#" className="group w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center hover:bg-green-700 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-xl">
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                  </a>
                </div>

                {/* Newsletter Signup */}
                <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700">
                  <h4 className="text-lg font-bold mb-2 text-white">Stay Updated</h4>
                  <p className="text-gray-300 text-sm mb-3">Get travel tips and exclusive offers</p>
                  <div className="flex space-x-2">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 text-sm font-medium">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>

              {/* Enhanced Quick Links */}
              <div>
                <h4 className="text-lg font-bold mb-6 text-white flex items-center">
                  <span className="mr-2">🚀</span>
                  Quick Links
                </h4>
                <ul className="space-y-3">
                  <li><Link href="/routes" className="group text-gray-300 hover:text-white transition-all duration-300 flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800/50"><span className="text-lg group-hover:scale-110 transition-transform duration-300">🚌</span><span>Routes</span></Link></li>
                  <li><Link href="/community" className="group text-gray-300 hover:text-white transition-all duration-300 flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800/50"><span className="text-lg group-hover:scale-110 transition-transform duration-300">👥</span><span>Community</span></Link></li>
                  <li><Link href="/tips" className="group text-gray-300 hover:text-white transition-all duration-300 flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800/50"><span className="text-lg group-hover:scale-110 transition-transform duration-300">💡</span><span>Travel Tips</span></Link></li>
                  <li><Link href="/search" className="group text-gray-300 hover:text-white transition-all duration-300 flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800/50"><span className="text-lg group-hover:scale-110 transition-transform duration-300">🔍</span><span>Search</span></Link></li>
                  <li><Link href="/dashboard" className="group text-gray-300 hover:text-white transition-all duration-300 flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800/50"><span className="text-lg group-hover:scale-110 transition-transform duration-300">📊</span><span>Dashboard</span></Link></li>
                </ul>
              </div>

              {/* Enhanced Support */}
              <div>
                <h4 className="text-lg font-bold mb-6 text-white flex items-center">
                  <span className="mr-2">🛟</span>
                  Support
                </h4>
                <ul className="space-y-3">
                  <li><Link href="/help" className="group text-gray-300 hover:text-white transition-all duration-300 flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800/50"><span className="text-lg group-hover:scale-110 transition-transform duration-300">❓</span><span>Help Center</span></Link></li>
                  <li><Link href="/contact" className="group text-gray-300 hover:text-white transition-all duration-300 flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800/50"><span className="text-lg group-hover:scale-110 transition-transform duration-300">📞</span><span>Contact Us</span></Link></li>
                  <li><Link href="/safety" className="group text-gray-300 hover:text-white transition-all duration-300 flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800/50"><span className="text-lg group-hover:scale-110 transition-transform duration-300">🛡️</span><span>Safety</span></Link></li>
                  <li><Link href="/faq" className="group text-gray-300 hover:text-white transition-all duration-300 flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800/50"><span className="text-lg group-hover:scale-110 transition-transform duration-300">💬</span><span>FAQ</span></Link></li>
                  <li>
                    <div className="flex items-center space-x-3 p-2">
                      <span className="text-lg">📱</span>
                      <div>
                        <div className="text-gray-300 text-sm">24/7 Support</div>
                        <div className="text-white font-semibold">+91 1800-123-4567</div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Enhanced Legal */}
              <div>
                <h4 className="text-lg font-bold mb-6 text-white flex items-center">
                  <span className="mr-2">⚖️</span>
                  Legal
                </h4>
                <ul className="space-y-3">
                  <li><Link href="/privacy" className="group text-gray-300 hover:text-white transition-all duration-300 flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800/50"><span className="text-lg group-hover:scale-110 transition-transform duration-300">🔒</span><span>Privacy Policy</span></Link></li>
                  <li><Link href="/terms" className="group text-gray-300 hover:text-white transition-all duration-300 flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800/50"><span className="text-lg group-hover:scale-110 transition-transform duration-300">📋</span><span>Terms of Service</span></Link></li>
                  <li><Link href="/refund" className="group text-gray-300 hover:text-white transition-all duration-300 flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800/50"><span className="text-lg group-hover:scale-110 transition-transform duration-300">💰</span><span>Refund Policy</span></Link></li>
                  <li><Link href="/cookies" className="group text-gray-300 hover:text-white transition-all duration-300 flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800/50"><span className="text-lg group-hover:scale-110 transition-transform duration-300">🍪</span><span>Cookie Policy</span></Link></li>
                  <li>
                    <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-green-400">🔐</span>
                        <span className="text-white font-semibold text-sm">SSL Secured</span>
                      </div>
                      <div className="text-gray-400 text-xs">Your data is protected with 256-bit encryption</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Enhanced Bottom Footer */}
          <div className="border-t border-gray-700 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              <div className="text-gray-300 text-center lg:text-left">
                <p className="flex items-center justify-center lg:justify-start space-x-2">
                  <span>&copy; 2024 TravelCircles. All rights reserved.</span>
                  <span className="hidden md:inline">•</span>
                  <span className="flex items-center space-x-1">
                    <span>Made with</span>
                    <span className="text-red-500 animate-pulse">❤️</span>
                    <span>in India</span>
                  </span>
                </p>
                <p className="text-sm text-gray-400 mt-1">Empowering travelers since 2024</p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-300">
                <div className="flex items-center space-x-2 bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-700">
                  <span className="text-green-400">🔒</span>
                  <span>Secure Payments</span>
                </div>
                <div className="flex items-center space-x-2 bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-700">
                  <span className="text-blue-400">📱</span>
                  <span>Mobile App</span>
                </div>
                <div className="flex items-center space-x-2 bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-700">
                  <span className="text-yellow-400">⭐</span>
                  <span>4.8/5 Rating</span>
                </div>
                <div className="flex items-center space-x-2 bg-gray-800/50 px-3 py-2 rounded-lg border border-gray-700">
                  <span className="text-purple-400">🏆</span>
                  <span>Award Winner</span>
                </div>
              </div>
            </div>

            {/* Additional Footer Info */}
            <div className="mt-6 pt-6 border-t border-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm text-gray-400">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-green-400">✅</span>
                  <span>ISO 27001 Certified</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-blue-400">🌍</span>
                  <span>Serving 15+ States</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-purple-400">⚡</span>
                  <span>99.9% Uptime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
