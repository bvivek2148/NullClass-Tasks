'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Topics', icon: '📚' },
    { id: 'booking', name: 'Booking', icon: '🎫' },
    { id: 'payment', name: 'Payment', icon: '💳' },
    { id: 'cancellation', name: 'Cancellation', icon: '❌' },
    { id: 'account', name: 'Account', icon: '👤' },
    { id: 'technical', name: 'Technical', icon: '🔧' }
  ];

  const faqs = [
    {
      id: 1,
      category: 'booking',
      question: 'How do I book a bus ticket?',
      answer: 'You can book a bus ticket by selecting your departure and destination cities, choosing your travel date, and selecting the number of passengers. Then browse available buses and select your preferred seats.'
    },
    {
      id: 2,
      category: 'booking',
      question: 'Can I modify my booking after confirmation?',
      answer: 'Yes, you can modify your booking up to 2 hours before departure. Changes may be subject to availability and additional charges.'
    },
    {
      id: 3,
      category: 'payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, UPI, net banking, and digital wallets like Paytm, PhonePe, and Google Pay.'
    },
    {
      id: 4,
      category: 'payment',
      question: 'Is my payment information secure?',
      answer: 'Yes, all payment transactions are secured with 256-bit SSL encryption and processed through PCI DSS compliant payment gateways.'
    },
    {
      id: 5,
      category: 'cancellation',
      question: 'What is your cancellation policy?',
      answer: 'You can cancel your ticket up to 2 hours before departure. Cancellation charges vary based on the time of cancellation and bus operator policies.'
    },
    {
      id: 6,
      category: 'account',
      question: 'How do I create an account?',
      answer: 'Click on the "Sign Up" button and provide your email, phone number, and create a password. You can also sign up using your Google or Facebook account.'
    },
    {
      id: 7,
      category: 'technical',
      question: 'The website is not loading properly. What should I do?',
      answer: 'Try clearing your browser cache, disable ad blockers, or try using a different browser. If the issue persists, contact our support team.'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">TravelCircles</span>
            </Link>
            <nav className="flex items-center space-x-6">
              <Link href="/routes" className="text-gray-600 hover:text-blue-600">Routes</Link>
              <Link href="/community" className="text-gray-600 hover:text-blue-600">Community</Link>
              <Link href="/contact" className="text-gray-600 hover:text-blue-600">Contact</Link>
              <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Login</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Find answers to common questions and get the help you need
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help topics..."
                className="w-full px-6 py-4 text-lg border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-12"
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 ${
                      selectedCategory === category.id
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span className="text-lg">{category.icon}</span>
                    <span className="font-medium">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Contact */}
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Need More Help?</h3>
              <div className="space-y-4">
                <Link href="/contact" className="block p-3 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">📞</span>
                    <div>
                      <div className="font-medium text-gray-900">Call Us</div>
                      <div className="text-sm text-gray-500">+91 1800-123-4567</div>
                    </div>
                  </div>
                </Link>
                <Link href="/contact" className="block p-3 border border-gray-200 rounded-lg hover:border-blue-500 transition-colors">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">💬</span>
                    <div>
                      <div className="font-medium text-gray-900">Live Chat</div>
                      <div className="text-sm text-gray-500">Available 24/7</div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Frequently Asked Questions
                  {selectedCategory !== 'all' && (
                    <span className="text-blue-600 ml-2">
                      - {categories.find(c => c.id === selectedCategory)?.name}
                    </span>
                  )}
                </h2>
                <p className="text-gray-600 mt-1">
                  {filteredFaqs.length} question{filteredFaqs.length !== 1 ? 's' : ''} found
                </p>
              </div>

              <div className="divide-y divide-gray-200">
                {filteredFaqs.map((faq) => (
                  <div key={faq.id} className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">{faq.question}</h3>
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    <div className="mt-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        faq.category === 'booking' ? 'bg-blue-100 text-blue-800' :
                        faq.category === 'payment' ? 'bg-green-100 text-green-800' :
                        faq.category === 'cancellation' ? 'bg-red-100 text-red-800' :
                        faq.category === 'account' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {categories.find(c => c.id === faq.category)?.icon} {categories.find(c => c.id === faq.category)?.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {filteredFaqs.length === 0 && (
                <div className="p-12 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467.901-6.062 2.379C5.482 17.56 5.99 18 6.5 18h11c.51 0 1.018-.44.562-1.621A7.962 7.962 0 0112 15z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your search or browse different categories.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
