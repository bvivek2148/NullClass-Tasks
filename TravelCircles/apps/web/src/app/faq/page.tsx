'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function FAQPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      id: 1,
      category: 'Booking',
      question: 'How do I book a bus ticket on TravelCircles?',
      answer: 'To book a ticket: 1) Enter your departure and destination cities, 2) Select your travel date, 3) Choose the number of passengers, 4) Browse available buses and select your preferred option, 5) Choose your seats, 6) Enter passenger details, 7) Make payment. You\'ll receive a confirmation email and SMS with your ticket details.'
    },
    {
      id: 2,
      category: 'Booking',
      question: 'Can I book tickets for someone else?',
      answer: 'Yes, you can book tickets for family members and friends. During the booking process, you can enter their details as passengers. However, the primary passenger must carry a valid ID that matches the booking details.'
    },
    {
      id: 3,
      category: 'Payment',
      question: 'What payment methods are accepted?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), debit cards, UPI payments (Google Pay, PhonePe, Paytm), net banking from all major banks, and digital wallets. All transactions are secured with 256-bit SSL encryption.'
    },
    {
      id: 4,
      category: 'Payment',
      question: 'Is it safe to make payments on TravelCircles?',
      answer: 'Absolutely! We use industry-standard security measures including SSL encryption, PCI DSS compliance, and secure payment gateways. Your payment information is never stored on our servers and is processed through trusted payment partners.'
    },
    {
      id: 5,
      category: 'Cancellation',
      question: 'What is your cancellation policy?',
      answer: 'Cancellation policies vary by bus operator but generally: 1) Free cancellation up to 24 hours before departure, 2) 50% refund for cancellations 12-24 hours before departure, 3) 25% refund for cancellations 2-12 hours before departure, 4) No refund for cancellations within 2 hours of departure.'
    },
    {
      id: 6,
      category: 'Cancellation',
      question: 'How do I cancel my booking?',
      answer: 'To cancel your booking: 1) Log into your account, 2) Go to "My Bookings", 3) Find your booking and click "Cancel", 4) Confirm cancellation, 5) Refund will be processed according to the cancellation policy. You can also call our customer support for assistance.'
    },
    {
      id: 7,
      category: 'Account',
      question: 'Do I need to create an account to book tickets?',
      answer: 'While you can book as a guest, creating an account offers benefits like: faster booking process, booking history, easy cancellations and modifications, exclusive offers, and loyalty points. It takes just a minute to sign up!'
    },
    {
      id: 8,
      category: 'Account',
      question: 'How do I reset my password?',
      answer: 'To reset your password: 1) Go to the login page, 2) Click "Forgot Password", 3) Enter your registered email address, 4) Check your email for reset instructions, 5) Click the reset link and create a new password. If you don\'t receive the email, check your spam folder.'
    },
    {
      id: 9,
      category: 'Travel',
      question: 'What should I carry while traveling?',
      answer: 'Essential items to carry: 1) Valid government-issued photo ID (Aadhaar, PAN, Driving License, Passport), 2) Printed or digital copy of your ticket, 3) Comfortable clothing and travel essentials, 4) Snacks and water (though most buses have refreshment stops), 5) Phone charger and entertainment for long journeys.'
    },
    {
      id: 10,
      category: 'Travel',
      question: 'What if my bus is delayed or cancelled?',
      answer: 'In case of delays or cancellations: 1) You\'ll be notified via SMS and email, 2) For delays over 2 hours, you can get a full refund, 3) For cancellations, we\'ll help you find alternative buses or provide a full refund, 4) Our customer support team is available 24/7 to assist you.'
    },
    {
      id: 11,
      category: 'Technical',
      question: 'The website is not working properly. What should I do?',
      answer: 'If you\'re experiencing technical issues: 1) Clear your browser cache and cookies, 2) Try using a different browser or incognito mode, 3) Disable ad blockers, 4) Check your internet connection, 5) Try accessing from a different device. If issues persist, contact our technical support team.'
    },
    {
      id: 12,
      category: 'Support',
      question: 'How can I contact customer support?',
      answer: 'You can reach our customer support through: 1) Phone: +91 1800-123-4567 (24/7), 2) Email: support@travelcircles.com, 3) Live chat on our website, 4) WhatsApp: +91 98765-43210, 5) Contact form on our website. Our team is available 24/7 to assist you.'
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = Array.from(new Set(faqs.map(faq => faq.category)));

  const toggleFaq = (id: number) => {
    setOpenFaq(openFaq === id ? null : id);
  };

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
              <Link href="/help" className="text-gray-600 hover:text-blue-600">Help</Link>
              <Link href="/contact" className="text-gray-600 hover:text-blue-600">Contact</Link>
              <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Login</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Find quick answers to common questions about booking, payments, cancellations, and more.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search FAQs..."
                className="w-full px-6 py-4 text-lg border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-12"
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <span
              key={category}
              className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
            >
              {category}
            </span>
          ))}
        </div>

        {/* FAQ List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {filteredFaqs.length} Question{filteredFaqs.length !== 1 ? 's' : ''} Found
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredFaqs.map((faq) => (
              <div key={faq.id} className="p-6">
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full text-left flex justify-between items-start focus:outline-none group"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {faq.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {faq.question}
                    </h3>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <svg
                      className={`w-6 h-6 text-gray-400 transition-transform duration-200 ${
                        openFaq === faq.id ? 'transform rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {openFaq === faq.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="p-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467.901-6.062 2.379C5.482 17.56 5.99 18 6.5 18h11c.51 0 1.018-.44.562-1.621A7.962 7.962 0 0112 15z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No FAQs found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search terms or browse all categories.
              </p>
            </div>
          )}
        </div>

        {/* Still Need Help */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Still need help?</h2>
          <p className="text-blue-100 mb-6">
            Can't find what you're looking for? Our support team is here to help you 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              📧 Contact Support
            </Link>
            <Link
              href="/help"
              className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
            >
              📚 Help Center
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
