'use client';

import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-600">
            Last updated: January 15, 2024
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 prose prose-lg max-w-none">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing and using TravelCircles ("we," "our," or "us"), you accept and agree to be bound by the terms and 
              provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              TravelCircles is an online platform that facilitates bus ticket booking and travel-related services. We provide:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Bus ticket search and booking services</li>
              <li>Travel information and route details</li>
              <li>Customer support and assistance</li>
              <li>Community features for travelers</li>
              <li>Travel tips and recommendations</li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
            <p className="text-gray-600 mb-4">
              To access certain features of our service, you may be required to create an account. You agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your account information</li>
              <li>Keep your password secure and confidential</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Booking Terms</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 Booking Process</h3>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>All bookings are subject to availability</li>
              <li>Prices may change without notice until booking is confirmed</li>
              <li>You must provide accurate passenger information</li>
              <li>Valid identification is required for travel</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">4.2 Payment</h3>
            <ul className="list-disc pl-6 text-gray-600 mb-4 space-y-2">
              <li>Payment must be made in full at the time of booking</li>
              <li>We accept various payment methods as displayed</li>
              <li>All payments are processed securely through third-party providers</li>
              <li>Additional fees may apply for certain payment methods</li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cancellation and Refunds</h2>
            <p className="text-gray-600 mb-4">
              Cancellation and refund policies vary by bus operator and are clearly displayed during booking:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Cancellation requests must be made through our platform</li>
              <li>Refund amounts depend on the time of cancellation</li>
              <li>Processing fees may apply to cancellations</li>
              <li>Refunds are processed within 5-7 business days</li>
              <li>No-show passengers are not eligible for refunds</li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. User Conduct</h2>
            <p className="text-gray-600 mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Use the service for any unlawful purpose</li>
              <li>Impersonate any person or entity</li>
              <li>Upload or transmit harmful content</li>
              <li>Interfere with the service's operation</li>
              <li>Attempt to gain unauthorized access</li>
              <li>Use automated systems to access the service</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
            <p className="text-gray-600">
              The service and its original content, features, and functionality are owned by TravelCircles and are protected by 
              international copyright, trademark, patent, trade secret, and other intellectual property laws. You may not reproduce, 
              distribute, modify, or create derivative works of our content without explicit permission.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Disclaimers</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>We act as an intermediary between you and bus operators</li>
              <li>We are not responsible for the quality of services provided by operators</li>
              <li>Travel schedules and routes may change without notice</li>
              <li>We do not guarantee the accuracy of all information</li>
              <li>Use of the service is at your own risk</li>
            </ul>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-600">
              To the maximum extent permitted by law, TravelCircles shall not be liable for any indirect, incidental, special, 
              consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other 
              intangible losses, resulting from your use of the service.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Force Majeure</h2>
            <p className="text-gray-600">
              We shall not be liable for any failure or delay in performance due to circumstances beyond our reasonable control, 
              including but not limited to acts of God, natural disasters, war, terrorism, strikes, or government actions.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law</h2>
            <p className="text-gray-600">
              These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under 
              these terms shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to Terms</h2>
            <p className="text-gray-600">
              We reserve the right to modify these terms at any time. We will notify users of any material changes by posting 
              the new terms on this page. Your continued use of the service after such modifications constitutes acceptance of 
              the updated terms.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Termination</h2>
            <p className="text-gray-600">
              We may terminate or suspend your account and access to the service immediately, without prior notice, for conduct 
              that we believe violates these terms or is harmful to other users, us, or third parties, or for any other reason.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Contact Information</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 mb-2"><strong>Email:</strong> legal@travelcircles.com</p>
              <p className="text-gray-600 mb-2"><strong>Phone:</strong> +91 1800-123-4567</p>
              <p className="text-gray-600 mb-2"><strong>Address:</strong> 123 Tech Park, Sector 5, Mumbai, Maharashtra 400001, India</p>
            </div>
          </div>
        </div>

        {/* Related Links */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Policies</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/privacy" className="text-blue-600 hover:text-blue-800 font-medium">
              🔒 Privacy Policy
            </Link>
            <Link href="/refund" className="text-blue-600 hover:text-blue-800 font-medium">
              💰 Refund Policy
            </Link>
            <Link href="/cookies" className="text-blue-600 hover:text-blue-800 font-medium">
              🍪 Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
