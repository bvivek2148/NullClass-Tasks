'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function CookiesPage() {
  const [cookieSettings, setCookieSettings] = useState({
    essential: true, // Always enabled
    functional: true,
    analytics: true,
    marketing: false
  });

  const handleCookieToggle = (type: string) => {
    if (type === 'essential') return; // Essential cookies cannot be disabled
    
    setCookieSettings(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const saveCookieSettings = () => {
    // In a real app, this would save to localStorage or send to server
    alert('Cookie preferences saved successfully!');
  };

  const cookieTypes = [
    {
      id: 'essential',
      name: 'Essential Cookies',
      description: 'These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you which amount to a request for services.',
      examples: ['Session management', 'Security tokens', 'Load balancing'],
      canDisable: false
    },
    {
      id: 'functional',
      name: 'Functional Cookies',
      description: 'These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third party providers whose services we have added to our pages.',
      examples: ['Language preferences', 'Region selection', 'User interface customization'],
      canDisable: true
    },
    {
      id: 'analytics',
      name: 'Analytics Cookies',
      description: 'These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular.',
      examples: ['Google Analytics', 'Page view tracking', 'User behavior analysis'],
      canDisable: true
    },
    {
      id: 'marketing',
      name: 'Marketing Cookies',
      description: 'These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts.',
      examples: ['Targeted advertising', 'Social media integration', 'Remarketing'],
      canDisable: true
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn about how we use cookies and similar technologies to improve your experience on TravelCircles.
          </p>
          <p className="text-lg text-gray-500 mt-2">
            Last updated: January 15, 2024
          </p>
        </div>

        {/* What are Cookies */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What are Cookies?</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Cookies are small text files that are placed on your computer or mobile device when you visit a website. 
            They are widely used to make websites work more efficiently and provide information to website owners.
          </p>
          <p className="text-gray-600 leading-relaxed">
            We use cookies to enhance your browsing experience, analyze site traffic, personalize content, and serve 
            targeted advertisements. This policy explains what cookies we use and why.
          </p>
        </div>

        {/* Cookie Types and Settings */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Cookie Settings</h2>
          <p className="text-gray-600 mb-8">
            You can control which cookies you accept by adjusting the settings below. Note that disabling certain 
            cookies may affect the functionality of our website.
          </p>

          <div className="space-y-6">
            {cookieTypes.map((cookie) => (
              <div key={cookie.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{cookie.name}</h3>
                    <p className="text-gray-600 mb-3">{cookie.description}</p>
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Examples:</h4>
                      <div className="flex flex-wrap gap-2">
                        {cookie.examples.map((example, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="ml-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={cookieSettings[cookie.id as keyof typeof cookieSettings]}
                        onChange={() => handleCookieToggle(cookie.id)}
                        disabled={!cookie.canDisable}
                        className={`w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 ${
                          !cookie.canDisable ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        {cookie.canDisable ? 'Optional' : 'Required'}
                      </span>
                    </label>
                  </div>
                </div>
                {!cookie.canDisable && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-yellow-800 text-sm">
                      These cookies are essential for the website to function properly and cannot be disabled.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={saveCookieSettings}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Save Cookie Preferences
            </button>
          </div>
        </div>

        {/* Third-Party Cookies */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Third-Party Cookies</h2>
          <p className="text-gray-600 mb-6">
            We also use third-party services that may set cookies on your device. These include:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Google Analytics</h3>
              <p className="text-gray-600 text-sm mb-3">
                Helps us understand how visitors interact with our website by collecting and reporting information anonymously.
              </p>
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" 
                 className="text-blue-600 hover:text-blue-800 text-sm">
                Google Privacy Policy →
              </a>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Payment Processors</h3>
              <p className="text-gray-600 text-sm mb-3">
                Secure payment processing services may set cookies to ensure transaction security and fraud prevention.
              </p>
              <span className="text-gray-500 text-sm">Stripe, Razorpay, PayU</span>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Social Media</h3>
              <p className="text-gray-600 text-sm mb-3">
                Social media plugins may set cookies when you interact with social sharing buttons.
              </p>
              <span className="text-gray-500 text-sm">Facebook, Twitter, WhatsApp</span>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Customer Support</h3>
              <p className="text-gray-600 text-sm mb-3">
                Live chat and support tools may use cookies to maintain conversation context and user preferences.
              </p>
              <span className="text-gray-500 text-sm">Intercom, Zendesk</span>
            </div>
          </div>
        </div>

        {/* Managing Cookies */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Managing Cookies</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Browser Settings</h3>
              <p className="text-gray-600 mb-4">
                You can control cookies through your browser settings. Here's how to manage cookies in popular browsers:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• <strong>Chrome:</strong> Settings → Privacy and security → Cookies</li>
                <li>• <strong>Firefox:</strong> Options → Privacy & Security → Cookies</li>
                <li>• <strong>Safari:</strong> Preferences → Privacy → Cookies</li>
                <li>• <strong>Edge:</strong> Settings → Cookies and site permissions</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Opt-Out Tools</h3>
              <p className="text-gray-600 mb-4">
                You can also use these tools to opt out of certain types of tracking:
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" 
                       className="text-blue-600 hover:text-blue-800">Google Analytics Opt-out</a></li>
                <li>• <a href="http://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" 
                       className="text-blue-600 hover:text-blue-800">Digital Advertising Alliance</a></li>
                <li>• <a href="http://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" 
                       className="text-blue-600 hover:text-blue-800">Network Advertising Initiative</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 mb-12">
          <h2 className="text-xl font-bold text-yellow-900 mb-4">Important Notes</h2>
          <ul className="space-y-3 text-yellow-800">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Disabling cookies may affect website functionality and your user experience
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Some cookies are essential for security and cannot be disabled
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Clearing your browser cookies will reset your preferences
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              We may update this policy from time to time to reflect changes in our practices
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions About Cookies?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            If you have any questions about our use of cookies or this policy, please don't hesitate to contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              📧 Contact Us
            </Link>
            <Link
              href="/privacy"
              className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              🔒 Privacy Policy
            </Link>
          </div>
        </div>

        {/* Related Links */}
        <div className="mt-12 bg-gray-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Policies</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/privacy" className="text-blue-600 hover:text-blue-800 font-medium">
              🔒 Privacy Policy
            </Link>
            <Link href="/terms" className="text-blue-600 hover:text-blue-800 font-medium">
              📋 Terms of Service
            </Link>
            <Link href="/refund" className="text-blue-600 hover:text-blue-800 font-medium">
              💰 Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
