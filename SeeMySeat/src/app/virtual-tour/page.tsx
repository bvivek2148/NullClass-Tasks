'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, X } from 'lucide-react';
import { BusTourModal } from '@/components/BusTourModal';
import { sampleVirtualTour } from '@/lib/sampleData';

export default function VirtualTourPage() {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const handleBookingComplete = (seats: string[]) => {
    console.log('Booking completed for seats:', seats);
    setSelectedSeats(seats);
    // Redirect to payment page
    window.location.href = '/payment';
  };

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
            
            <div className="flex items-center space-x-4">
              <Link 
                href="/"
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Virtual Tour Content */}
      <div className="relative">
        {/* Full-screen Virtual Tour Modal */}
        <BusTourModal
          tour={sampleVirtualTour}
          isOpen={true}
          onClose={() => window.history.back()}
          onBookingComplete={handleBookingComplete}
          initialTab="tour"
        />
      </div>
    </div>
  );
}
