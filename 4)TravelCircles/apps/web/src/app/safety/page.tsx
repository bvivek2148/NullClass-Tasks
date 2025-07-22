'use client';

import React from 'react';
import Link from 'next/link';

export default function SafetyPage() {
  const safetyFeatures = [
    {
      icon: '🛡️',
      title: 'Verified Bus Operators',
      description: 'All bus operators on our platform are thoroughly verified and licensed by transport authorities.'
    },
    {
      icon: '👨‍✈️',
      title: 'Trained Drivers',
      description: 'All drivers undergo regular training and health checkups to ensure safe driving standards.'
    },
    {
      icon: '🚌',
      title: 'Vehicle Safety Checks',
      description: 'Regular maintenance and safety inspections ensure all vehicles meet safety standards.'
    },
    {
      icon: '📱',
      title: 'Real-time Tracking',
      description: 'Track your bus in real-time and share your journey details with family and friends.'
    },
    {
      icon: '🆘',
      title: '24/7 Emergency Support',
      description: 'Round-the-clock emergency assistance and support for any travel-related issues.'
    },
    {
      icon: '🔒',
      title: 'Secure Payments',
      description: 'All transactions are protected with bank-level security and encryption.'
    }
  ];

  const safetyTips = [
    {
      category: 'Before Travel',
      tips: [
        'Verify your booking details and bus operator information',
        'Share your travel details with family or friends',
        'Keep emergency contact numbers handy',
        'Carry valid identification documents',
        'Check weather conditions and plan accordingly'
      ]
    },
    {
      category: 'During Travel',
      tips: [
        'Keep your belongings secure and within sight',
        'Stay hydrated and carry necessary medications',
        'Follow bus safety instructions and guidelines',
        'Avoid sharing personal information with strangers',
        'Keep your phone charged for emergencies'
      ]
    },
    {
      category: 'Emergency Situations',
      tips: [
        'Contact our 24/7 helpline: +91 1800-123-4567',
        'Use the emergency button in our mobile app',
        'Contact local authorities if needed (Police: 100)',
        'Stay calm and follow driver instructions',
        'Keep important documents and emergency cash accessible'
      ]
    }
  ];

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Safety is Our Priority</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            At TravelCircles, we are committed to providing safe, secure, and reliable bus travel experiences across India. 
            Learn about our safety measures and travel tips to ensure your journey is both comfortable and secure.
          </p>
        </div>

        {/* Safety Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Safety Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {safetyFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Statistics */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Safety by Numbers</h2>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold text-white mb-2">99.9%</div>
              <div className="text-blue-100">Safety Record</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-blue-100">Verified Operators</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-100">Emergency Support</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">1M+</div>
              <div className="text-blue-100">Safe Journeys</div>
            </div>
          </div>
        </div>

        {/* Safety Tips */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Travel Safety Tips</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            {safetyTips.map((section, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 text-blue-600 font-bold">
                    {index + 1}
                  </span>
                  {section.category}
                </h3>
                <ul className="space-y-3">
                  {section.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-red-800 mb-6 flex items-center">
            <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            Emergency Contacts
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl mb-2">🚨</div>
              <div className="font-semibold text-red-800">TravelCircles Emergency</div>
              <div className="text-red-600">+91 1800-123-4567</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">👮</div>
              <div className="font-semibold text-red-800">Police</div>
              <div className="text-red-600">100</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🚑</div>
              <div className="font-semibold text-red-800">Ambulance</div>
              <div className="text-red-600">108</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🔥</div>
              <div className="font-semibold text-red-800">Fire Department</div>
              <div className="text-red-600">101</div>
            </div>
          </div>
        </div>

        {/* Safety Certifications */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Safety Certifications & Compliance</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">ISO 27001 Certified</h3>
              <p className="text-gray-600">Information security management standards</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">PCI DSS Compliant</h3>
              <p className="text-gray-600">Secure payment card data handling</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467.901-6.062 2.379C5.482 17.56 5.99 18 6.5 18h11c.51 0 1.018-.44.562-1.621A7.962 7.962 0 0112 15z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Government Approved</h3>
              <p className="text-gray-600">Licensed by transport authorities</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Have Safety Concerns?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            If you have any safety-related questions or concerns, our dedicated safety team is here to help. 
            Don't hesitate to reach out to us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              📞 Contact Safety Team
            </Link>
            <Link
              href="/help"
              className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              📚 Safety Guidelines
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
