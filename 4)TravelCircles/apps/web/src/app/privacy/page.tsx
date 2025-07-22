'use client';

import React from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
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
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600">
            Last updated: January 15, 2024
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 prose prose-lg max-w-none">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-600 leading-relaxed">
              At TravelCircles, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, 
              mobile application, and services.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Information</h3>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Name, email address, and phone number</li>
              <li>Date of birth and gender</li>
              <li>Government-issued ID details for verification</li>
              <li>Payment information (processed securely through third-party providers)</li>
              <li>Travel preferences and booking history</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Automatically Collected Information</h3>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Usage patterns and preferences</li>
              <li>Location data (with your consent)</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Process and manage your bookings</li>
              <li>Provide customer support and assistance</li>
              <li>Send booking confirmations and travel updates</li>
              <li>Improve our services and user experience</li>
              <li>Prevent fraud and ensure platform security</li>
              <li>Send promotional offers (with your consent)</li>
              <li>Comply with legal obligations</li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Sharing</h2>
            <p className="text-gray-600 mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Bus Operators:</strong> Necessary booking details for travel arrangements</li>
              <li><strong>Payment Processors:</strong> Secure payment processing</li>
              <li><strong>Service Providers:</strong> Third-party services that help us operate our platform</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
            <p className="text-gray-600 mb-4">
              We implement industry-standard security measures to protect your personal information:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>256-bit SSL encryption for data transmission</li>
              <li>Secure servers with regular security updates</li>
              <li>Access controls and authentication measures</li>
              <li>Regular security audits and monitoring</li>
              <li>PCI DSS compliance for payment processing</li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
            <p className="text-gray-600 mb-4">You have the following rights regarding your personal information:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data</li>
              <li><strong>Portability:</strong> Receive your data in a portable format</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Restriction:</strong> Limit how we process your data</li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking</h2>
            <p className="text-gray-600 mb-4">
              We use cookies and similar technologies to enhance your experience:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for basic website functionality</li>
              <li><strong>Performance Cookies:</strong> Help us understand how you use our site</li>
              <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
              <li><strong>Marketing Cookies:</strong> Deliver relevant advertisements (with consent)</li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
            <p className="text-gray-600">
              We retain your personal information for as long as necessary to provide our services and comply with legal obligations. 
              Booking data is typically retained for 7 years for tax and legal purposes. You can request deletion of your account 
              and associated data at any time, subject to legal requirements.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
            <p className="text-gray-600">
              Our services are not intended for children under 13 years of age. We do not knowingly collect personal information 
              from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, 
              please contact us immediately.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">International Transfers</h2>
            <p className="text-gray-600">
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards 
              are in place to protect your personal information in accordance with applicable data protection laws.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
            <p className="text-gray-600">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new 
              Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy 
              periodically for any changes.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 mb-2"><strong>Email:</strong> privacy@travelcircles.com</p>
              <p className="text-gray-600 mb-2"><strong>Phone:</strong> +91 1800-123-4567</p>
              <p className="text-gray-600 mb-2"><strong>Address:</strong> 123 Tech Park, Sector 5, Mumbai, Maharashtra 400001, India</p>
            </div>
          </div>
        </div>

        {/* Related Links */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Policies</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/terms" className="text-blue-600 hover:text-blue-800 font-medium">
              📋 Terms of Service
            </Link>
            <Link href="/cookies" className="text-blue-600 hover:text-blue-800 font-medium">
              🍪 Cookie Policy
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
