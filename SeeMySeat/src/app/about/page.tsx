'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, Target, Award, Heart, MapPin, Phone, Mail } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
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
            <Link
              href="/"
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="inline-flex items-center space-x-2 bg-blue-800/50 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-blue-700/50">
            <Users className="w-4 h-4 text-blue-200" />
            <span className="text-sm font-medium text-blue-100">Our Story</span>
          </div>

          <h2 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            About
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              SeeMySeat
            </span>
          </h2>

          <p className="text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            Revolutionizing bus travel in India with immersive virtual tours and transparent seat selection.
            Experience the future of travel booking today.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Our Story */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Story</h3>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-gray-600 mb-6">
                SeeMySeat was born from a simple idea: travelers should know exactly what they're booking before they travel. 
                We recognized that choosing bus seats in India often felt like a gamble - you never knew if you'd get a window seat, 
                if there was enough legroom, or what amenities were actually available.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our team of travel enthusiasts and technology experts came together to create the first comprehensive virtual 
                bus tour platform in India. Using cutting-edge 360° technology, we give you the power to explore every inch 
                of your bus before you book.
              </p>
              <p className="text-lg text-gray-600">
                Today, we're proud to serve thousands of travelers across India, from Mumbai to Delhi, Bangalore to Chennai, 
                and everywhere in between. Every journey starts with confidence when you SeeMySeat.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
              <div className="text-center">
                <div className="text-6xl mb-4">🚌</div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">Connecting India</h4>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">50,000+</div>
                    <div className="text-sm text-gray-600">Happy Travelers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">200+</div>
                    <div className="text-sm text-gray-600">Routes Covered</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">15+</div>
                    <div className="text-sm text-gray-600">States Connected</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">99%</div>
                    <div className="text-sm text-gray-600">Satisfaction Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Values</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Transparency</h4>
              <p className="text-gray-600">
                No hidden surprises. See exactly what you're booking with our detailed virtual tours.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Customer First</h4>
              <p className="text-gray-600">
                Every feature we build is designed with our travelers' comfort and convenience in mind.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Innovation</h4>
              <p className="text-gray-600">
                We continuously push the boundaries of travel technology to enhance your experience.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-red-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Trust</h4>
              <p className="text-gray-600">
                Building lasting relationships through reliable service and honest communication.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Get in Touch</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Visit Us</h4>
              <p className="text-gray-600">
                123 Tech Park, Sector 5<br />
                Gurgaon, Haryana 122001<br />
                India
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Call Us</h4>
              <p className="text-gray-600">
                +91 98765 43210<br />
                +91 87654 32109<br />
                Mon-Sun: 6 AM - 11 PM
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Email Us</h4>
              <p className="text-gray-600">
                support@seemyseat.in<br />
                info@seemyseat.in<br />
                We reply within 2 hours
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link href="/" className="flex items-center justify-center space-x-3 mb-4 hover:opacity-80 transition-opacity duration-200 w-fit mx-auto">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SMS</span>
            </div>
            <h3 className="text-xl font-bold">SeeMySeat</h3>
          </Link>
          <p className="text-gray-400">
            Experience your journey before you travel. Connecting India, one comfortable ride at a time.
          </p>
        </div>
      </footer>
    </div>
  );
}
