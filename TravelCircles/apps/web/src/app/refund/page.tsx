'use client';

import React from 'react';
import Link from 'next/link';

export default function RefundPage() {
  const refundTiers = [
    {
      timeframe: '24+ hours before departure',
      refundPercentage: '100%',
      processingFee: '₹0',
      color: 'green'
    },
    {
      timeframe: '12-24 hours before departure',
      refundPercentage: '75%',
      processingFee: '₹50',
      color: 'yellow'
    },
    {
      timeframe: '2-12 hours before departure',
      refundPercentage: '50%',
      processingFee: '₹100',
      color: 'orange'
    },
    {
      timeframe: 'Less than 2 hours before departure',
      refundPercentage: '0%',
      processingFee: 'N/A',
      color: 'red'
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Refund Policy</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We understand that travel plans can change. Here's our comprehensive refund policy to help you understand 
            your options when you need to cancel your booking.
          </p>
          <p className="text-lg text-gray-500 mt-2">
            Last updated: January 15, 2024
          </p>
        </div>

        {/* Refund Tiers */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Refund Structure</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {refundTiers.map((tier, index) => (
              <div key={index} className={`bg-white rounded-lg shadow-lg p-6 border-t-4 ${
                tier.color === 'green' ? 'border-green-500' :
                tier.color === 'yellow' ? 'border-yellow-500' :
                tier.color === 'orange' ? 'border-orange-500' :
                'border-red-500'
              }`}>
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-2 ${
                    tier.color === 'green' ? 'text-green-600' :
                    tier.color === 'yellow' ? 'text-yellow-600' :
                    tier.color === 'orange' ? 'text-orange-600' :
                    'text-red-600'
                  }`}>
                    {tier.refundPercentage}
                  </div>
                  <div className="text-sm text-gray-600 mb-4">{tier.timeframe}</div>
                  <div className="text-sm text-gray-500">
                    Processing Fee: <span className="font-medium">{tier.processingFee}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* How to Cancel */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Cancel Your Booking</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Log into Your Account</h3>
                  <p className="text-gray-600">Access your TravelCircles account using your credentials.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Go to My Bookings</h3>
                  <p className="text-gray-600">Navigate to your bookings section to view all your reservations.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Select Booking to Cancel</h3>
                  <p className="text-gray-600">Find the booking you want to cancel and click on it.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Click Cancel Booking</h3>
                  <p className="text-gray-600">Review the refund amount and confirm your cancellation.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">5</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Receive Confirmation</h3>
                  <p className="text-gray-600">Get email and SMS confirmation of your cancellation and refund details.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Refund Processing */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Refund Processing</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Processing Time</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Credit/Debit Cards: 5-7 business days
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  UPI/Digital Wallets: 1-3 business days
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Net Banking: 3-5 business days
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Refund Method</h3>
              <p className="text-gray-600 mb-3">
                Refunds are processed back to the original payment method used for booking.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  <strong>Note:</strong> If the original payment method is no longer available, 
                  please contact our support team for alternative refund arrangements.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Refund Tracking</h3>
              <p className="text-gray-600">
                You can track your refund status in the "My Bookings" section of your account. 
                You'll also receive email and SMS updates about your refund progress.
              </p>
            </div>
          </div>
        </div>

        {/* Special Circumstances */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Special Circumstances</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Full Refund Scenarios
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Bus breakdown or technical issues</li>
                <li>• Route cancellation by operator</li>
                <li>• Delay of more than 2 hours</li>
                <li>• Natural disasters or emergencies</li>
                <li>• Government-imposed travel restrictions</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-6 h-6 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                No Refund Scenarios
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• No-show at departure time</li>
                <li>• Invalid or expired identification</li>
                <li>• Passenger misconduct</li>
                <li>• Personal emergencies (case-by-case basis)</li>
                <li>• Change of mind after departure</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-8">
          <h2 className="text-xl font-bold text-blue-900 mb-4">Important Notes</h2>
          <ul className="space-y-3 text-blue-800">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Refund policies may vary by bus operator and are clearly displayed during booking
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Partial cancellations are allowed for group bookings with applicable charges
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Convenience fees and payment gateway charges are non-refundable
            </li>
            <li className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Refund disputes can be raised within 30 days of the original travel date
            </li>
          </ul>
        </div>

        {/* Contact Support */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help with Refunds?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Our customer support team is available 24/7 to assist you with cancellations and refund queries.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              📞 Contact Support
            </Link>
            <Link
              href="/help"
              className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              📚 Help Center
            </Link>
          </div>
        </div>

        {/* Related Links */}
        <div className="mt-12 bg-gray-100 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Policies</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/terms" className="text-blue-600 hover:text-blue-800 font-medium">
              📋 Terms of Service
            </Link>
            <Link href="/privacy" className="text-blue-600 hover:text-blue-800 font-medium">
              🔒 Privacy Policy
            </Link>
            <Link href="/faq" className="text-blue-600 hover:text-blue-800 font-medium">
              ❓ FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
