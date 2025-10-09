'use client';

import React from 'react';
import Link from 'next/link';
import {
  Eye, MapPin, Users, Star, Wifi, Coffee, Zap, Shield, Clock,
  Award, CheckCircle, ArrowRight, Play, Phone, Mail, MapIcon,
  Smartphone, CreditCard, HeadphonesIcon
} from 'lucide-react';

export default function HomePage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" id="main-content">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity duration-200">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">SMS</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  SeeMySeat
                </h1>
                <p className="text-xs text-gray-500 font-medium">Virtual Bus Tours</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200">Features</a>
              <a href="#routes" className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200">Routes</a>
              <Link href="/about" className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200">About</Link>
              <Link href="/contact" className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200">Contact</Link>
              <Link
                href="/virtual-tour"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Start Tour
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-blue-800/50 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-blue-700/50">
                <Star className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium text-blue-100">India's #1 Virtual Bus Tour Platform</span>
              </div>

              <h2 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Experience Your
                <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Journey Before
                </span>
                You Travel
              </h2>

              <p className="text-xl text-blue-100 mb-8 max-w-2xl leading-relaxed">
                Take an immersive 360° virtual tour of our premium buses. Select your perfect seat with confidence
                and travel comfortably across India with our luxury fleet.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">50K+</div>
                  <div className="text-sm text-blue-200">Happy Travelers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">100+</div>
                  <div className="text-sm text-blue-200">Routes Covered</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">4.8★</div>
                  <div className="text-sm text-blue-200">User Rating</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/virtual-tour"
                  className="group flex items-center justify-center space-x-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-8 py-4 rounded-xl font-bold hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/25 transform hover:-translate-y-1"
                >
                  <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span>Start Virtual Tour</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/virtual-tour"
                  className="group flex items-center justify-center space-x-3 border-2 border-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-300"
                >
                  <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Select Seats</span>
                </Link>
              </div>
            </div>

            {/* Right Content - Interactive Preview */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
                <Link href="/virtual-tour" className="aspect-video bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl overflow-hidden relative group cursor-pointer block">

                  {/* Video Preview Placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2">360° Bus Interior</h4>
                      <p className="text-blue-100 text-sm">Click to explore virtually</p>
                    </div>
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>

                {/* Feature Pills */}
                <div className="flex flex-wrap gap-2 mt-6">
                  <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-medium border border-green-500/30">
                    ✓ 3D Seat Models
                  </span>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium border border-blue-500/30">
                    ✓ Real-time Availability
                  </span>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium border border-purple-500/30">
                    ✓ Instant Booking
                  </span>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-10 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full mb-6">
              <Award className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-600">Award-Winning Technology</span>
            </div>
            <h3 className="text-4xl font-bold text-gray-900 mb-6">
              Why Choose Our Virtual Tour?
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience the future of bus travel booking with our cutting-edge virtual tour technology.
              See exactly what you're booking before you travel.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Feature 1 */}
            <div className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2">
              <div className="absolute top-6 right-6 w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-blue-600 font-bold text-sm">01</span>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">360° Virtual Experience</h4>
              <p className="text-gray-600 leading-relaxed mb-6">
                Immerse yourself in our premium buses with stunning 360-degree panoramic views.
                Explore every corner, from driver's seat to rear exit.
              </p>
              <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                <span>Explore Now</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-gradient-to-br from-emerald-50 to-green-50 p-8 rounded-2xl border border-emerald-100 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-2">
              <div className="absolute top-6 right-6 w-8 h-8 bg-emerald-500/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-emerald-600 font-bold text-sm">02</span>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">3D Seat Selection</h4>
              <p className="text-gray-600 leading-relaxed mb-6">
                Revolutionary 3D seat models with realistic lighting and animations.
                See exactly how your seat looks and feels before booking.
              </p>
              <div className="flex items-center text-emerald-600 font-semibold group-hover:translate-x-2 transition-transform">
                <span>Try 3D Seats</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-gradient-to-br from-purple-50 to-indigo-50 p-8 rounded-2xl border border-purple-100 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-2">
              <div className="absolute top-6 right-6 w-8 h-8 bg-purple-500/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-purple-600 font-bold text-sm">03</span>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-4">Instant Booking</h4>
              <p className="text-gray-600 leading-relaxed mb-6">
                Seamless booking experience with real-time seat availability,
                secure payments, and instant confirmation.
              </p>
              <div className="flex items-center text-purple-600 font-semibold group-hover:translate-x-2 transition-transform">
                <span>Book Now</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>
          </div>

          {/* Additional Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h5 className="font-semibold text-gray-900 mb-2">Real-time Updates</h5>
              <p className="text-sm text-gray-600">Live seat availability</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <Shield className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <h5 className="font-semibold text-gray-900 mb-2">Secure Payments</h5>
              <p className="text-sm text-gray-600">256-bit SSL encryption</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <HeadphonesIcon className="w-8 h-8 text-purple-500 mx-auto mb-3" />
              <h5 className="font-semibold text-gray-900 mb-2">24/7 Support</h5>
              <p className="text-sm text-gray-600">Always here to help</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <Clock className="w-8 h-8 text-orange-500 mx-auto mb-3" />
              <h5 className="font-semibold text-gray-900 mb-2">Quick Booking</h5>
              <p className="text-sm text-gray-600">Book in under 2 minutes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bus Preview Card */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-12 shadow-2xl border border-gray-200/50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full -translate-y-32 translate-x-32 opacity-50"></div>

            <div className="grid lg:grid-cols-2 gap-12 items-center relative">
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-gray-600 bg-yellow-50 px-3 py-1 rounded-full">
                    Premium Experience
                  </span>
                </div>

                <h3 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  Premium Luxury Coach
                  <span className="block text-2xl text-blue-600 font-normal mt-2">
                    Luxury Coach Experience
                  </span>
                </h3>

                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Experience premium travel across India with our state-of-the-art Tata Motors coach.
                  Featuring modern amenities and comfortable seating for up to 48 passengers.
                </p>

                {/* Enhanced Amenities */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Free WiFi</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Air Conditioning</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Charging Ports</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Entertainment System</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Comfortable Seating</span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">Reading Lights</span>
                  </div>
                </div>

                {/* Enhanced Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/virtual-tour"
                    className="group flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <Eye className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span>Take Virtual Tour</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/virtual-tour"
                    className="group flex items-center justify-center space-x-3 border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
                  >
                    <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>View Seating</span>
                  </Link>
                </div>

                {/* Trust indicators */}
                <div className="flex items-center space-x-6 mt-8 pt-8 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">4.8★</div>
                    <div className="text-xs text-gray-500">User Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">50K+</div>
                    <div className="text-xs text-gray-500">Happy Customers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">100%</div>
                    <div className="text-xs text-gray-500">Safe & Secure</div>
                  </div>
                </div>
              </div>

              <div className="relative">
                {/* Enhanced Preview Card */}
                <Link href="/virtual-tour" className="aspect-video bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl overflow-hidden relative group cursor-pointer shadow-2xl block">

                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse"></div>

                  {/* Content */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-all duration-500 shadow-lg">
                        <Play className="w-12 h-12 text-white ml-1" />
                      </div>
                      <h4 className="text-2xl font-bold text-white mb-3">360° Bus Interior</h4>
                      <p className="text-blue-100 mb-6 max-w-xs">Experience our premium bus interior with immersive virtual reality</p>

                      {/* Feature badges */}
                      <div className="flex flex-wrap gap-2 justify-center">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-medium">
                          4K Quality
                        </span>
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-medium">
                          360° View
                        </span>
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs font-medium">
                          Interactive
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="flex items-center justify-between text-white">
                        <span className="text-sm font-medium">Click to start tour</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Floating elements for visual appeal */}
                <div className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-80 animate-bounce delay-1000"></div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-60 animate-pulse delay-500"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Routes Section */}
      <section id="routes" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full mb-6">
              <MapIcon className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-600">Most Popular Routes</span>
            </div>
            <h3 className="text-4xl font-bold text-gray-900 mb-6">
              Travel Across India
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience comfortable and safe travel with our premium bus services connecting major cities across India
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Route 1 - Mumbai to Delhi */}
            <div className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-2">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-500">PREMIUM ROUTE</span>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">Mumbai → Delhi</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>24h journey</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>48 seats</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">₹1,200</div>
                  <div className="text-sm text-gray-500">Starting from</div>
                </div>
              </div>

              <div className="flex items-center space-x-2 mb-6">
                <div className="flex items-center space-x-1">
                  <Wifi className="w-4 h-4 text-blue-500" />
                  <span className="text-xs text-gray-600">Free WiFi</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Coffee className="w-4 h-4 text-brown-500" />
                  <span className="text-xs text-gray-600">Meals</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs text-gray-600">Charging</span>
                </div>
              </div>

              <Link
                href="/virtual-tour"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl group-hover:scale-105 text-center block"
              >
                View Seats & Book
              </Link>
            </div>

            {/* Route 2 - Bangalore to Chennai */}
            <div className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-2xl hover:border-emerald-200 transition-all duration-300 hover:-translate-y-2">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-500">EXPRESS ROUTE</span>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">Bangalore → Chennai</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>6h journey</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>48 seats</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">₹800</div>
                  <div className="text-sm text-gray-500">Starting from</div>
                </div>
              </div>

              <div className="flex items-center space-x-2 mb-6">
                <div className="flex items-center space-x-1">
                  <Wifi className="w-4 h-4 text-blue-500" />
                  <span className="text-xs text-gray-600">Free WiFi</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Coffee className="w-4 h-4 text-brown-500" />
                  <span className="text-xs text-gray-600">Snacks</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs text-gray-600">Charging</span>
                </div>
              </div>

              <Link
                href="/virtual-tour"
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl group-hover:scale-105 text-center block"
              >
                View Seats & Book
              </Link>
            </div>

            {/* Route 3 - Pune to Goa */}
            <div className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-2xl hover:border-purple-200 transition-all duration-300 hover:-translate-y-2">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-500">SCENIC ROUTE</span>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">Pune → Goa</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>12h journey</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>48 seats</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">₹1,000</div>
                  <div className="text-sm text-gray-500">Starting from</div>
                </div>
              </div>

              <div className="flex items-center space-x-2 mb-6">
                <div className="flex items-center space-x-1">
                  <Wifi className="w-4 h-4 text-blue-500" />
                  <span className="text-xs text-gray-600">Free WiFi</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Coffee className="w-4 h-4 text-brown-500" />
                  <span className="text-xs text-gray-600">Meals</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs text-gray-600">Charging</span>
                </div>
              </div>

              <Link
                href="/virtual-tour"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl group-hover:scale-105 text-center block"
              >
                View Seats & Book
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        </div>

        <div className="relative">
          {/* Main Footer Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid lg:grid-cols-4 gap-12">
              {/* Brand Section */}
              <div className="lg:col-span-2">
                <Link href="/" className="flex items-center space-x-4 mb-6 hover:opacity-80 transition-opacity duration-200 w-fit">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">SMS</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                      SeeMySeat
                    </h3>
                    <p className="text-sm text-gray-400">Virtual Bus Tours</p>
                  </div>
                </Link>
                <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-md">
                  Experience your journey before you travel with our immersive virtual tour technology.
                  Connecting India, one comfortable ride at a time.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">50K+</div>
                    <div className="text-xs text-gray-400">Happy Travelers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-400">100+</div>
                    <div className="text-xs text-gray-400">Routes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">4.8★</div>
                    <div className="text-xs text-gray-400">Rating</div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-6">Quick Links</h4>
                <ul className="space-y-4">
                  <li><a href="#features" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Features</a></li>
                  <li><a href="#routes" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Popular Routes</a></li>
                  <li><Link href="/about" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">About Us</Link></li>
                  <li><Link href="/contact" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Contact</Link></li>
                </ul>
              </div>

              {/* Contact Info */}
              <div id="contact">
                <h4 className="text-lg font-semibold text-white mb-6">Get in Touch</h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-300">+91 98765 43210</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-300">support@seemyseat.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapIcon className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-300">Mumbai, India</span>
                  </div>
                </div>

                {/* CTA Button */}
                <Link
                  href="/virtual-tour"
                  className="mt-6 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center block"
                >
                  Start Virtual Tour
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="text-gray-400 text-sm">
                  © 2024 SeeMySeat. All rights reserved. Made with ❤️ in India.
                </div>
                <div className="flex space-x-6 text-sm">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Privacy Policy</a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Terms of Service</a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Support</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>


    </div>
  );
}