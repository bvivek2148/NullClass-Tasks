'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { VirtualBusTour } from '@/types';
import { VirtualTourViewer } from './VirtualTourViewer';
import { InteractiveSeatingMap } from './InteractiveSeatingMap';
import { LocationSelector } from './LocationSelector';
import { X, Maximize2, Minimize2, Eye, MapPin, CreditCard, Users, ArrowLeft } from 'lucide-react';

interface Route {
  id: string;
  from: string;
  to: string;
  duration: string;
  distance: string;
  price: number;
  departureTime: string;
  arrivalTime: string;
  availableSeats: number;
}

interface BusTourModalProps {
  tour: VirtualBusTour;
  isOpen: boolean;
  onClose: () => void;
  onBookingComplete?: (selectedSeats: string[]) => void;
  initialTab?: 'tour' | 'seats';
  className?: string;
}

export const BusTourModal: React.FC<BusTourModalProps> = ({
  tour,
  isOpen,
  onClose,
  onBookingComplete,
  initialTab = 'tour',
  className = '',
}) => {
  const [currentStep, setCurrentStep] = useState<'location' | 'tour' | 'seats'>('location');
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [activeTab, setActiveTab] = useState<'tour' | 'seats'>(initialTab);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Handle route selection
  const handleRouteSelect = useCallback((route: Route) => {
    setSelectedRoute(route);
    setCurrentStep('tour');
  }, []);

  // Handle seat selection
  const handleSeatSelect = useCallback((seatId: string) => {
    setSelectedSeats(prev => [...prev, seatId]);
  }, []);

  const handleSeatDeselect = useCallback((seatId: string) => {
    setSelectedSeats(prev => prev.filter(id => id !== seatId));
  }, []);

  // Handle back to location selection
  const handleBackToLocation = useCallback(() => {
    setCurrentStep('location');
    setSelectedRoute(null);
    setSelectedSeats([]);
  }, []);

  // Handle fullscreen toggle
  const handleFullscreenToggle = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isFullscreen, onClose]);

  // Handle booking completion
  const handleBooking = () => {
    if (selectedSeats.length > 0 && selectedRoute) {
      // Calculate total price using route price
      const totalPrice = selectedSeats.length * selectedRoute.price;

      // Redirect to payment page with booking details
      const params = new URLSearchParams({
        seats: selectedSeats.join(','),
        amount: totalPrice.toString(),
        route: `${selectedRoute.from}-${selectedRoute.to}`,
        busType: tour.busModel.name,
        departure: selectedRoute.departureTime,
        duration: selectedRoute.duration
      });

      window.location.href = `/payment?${params.toString()}`;
    }
  };

  // Calculate pricing using route price
  const totalPrice = selectedRoute ? selectedSeats.length * selectedRoute.price : 0;

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 ${className}`}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-75 transition-opacity"
        onClick={currentStep === 'location' ? onClose : undefined}
      />

      {/* Modal Container */}
      <div className={`
        relative w-full h-full flex items-center justify-center p-4
        ${isFullscreen ? '' : 'max-w-7xl mx-auto'}
      `}>
        {/* Location Selection Step */}
        {currentStep === 'location' && (
          <LocationSelector
            onRouteSelect={handleRouteSelect}
            onClose={onClose}
          />
        )}

        {/* Tour/Seats Steps */}
        {currentStep !== 'location' && (
          <div className="relative bg-white rounded-2xl shadow-2xl flex flex-col h-full w-full max-h-[95vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBackToLocation}
                  className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
                  title="Back to route selection"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {tour.busModel.name} Virtual Tour
                  </h2>
                  {selectedRoute && (
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-green-600" />
                        <span className="font-medium">{selectedRoute.from}</span>
                        <span>→</span>
                        <MapPin className="w-4 h-4 text-red-600" />
                        <span className="font-medium">{selectedRoute.to}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {selectedRoute.departureTime} • {selectedRoute.duration}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{tour.busModel.capacity} seats</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Tab Navigation */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setActiveTab('tour')}
                    className={`
                      flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${activeTab === 'tour'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                      }
                    `}
                  >
                    <Eye className="w-4 h-4" />
                    <span>Virtual Tour</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('seats')}
                    className={`
                      flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                      ${activeTab === 'seats'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                      }
                    `}
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Seat Selection</span>
                  </button>
                </div>

                {/* Fullscreen Toggle */}
                {activeTab === 'tour' && (
                  <button
                    onClick={handleFullscreenToggle}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                  >
                    {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                  </button>
                )}

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 relative overflow-hidden">
              {/* Virtual Tour Tab */}
              {activeTab === 'tour' && (
                <VirtualTourViewer
                  tour={tour}
                  selectedSeats={selectedSeats}
                  onSeatSelect={handleSeatSelect}
                  onSeatDeselect={handleSeatDeselect}
                  onClose={onClose}
                  isFullscreen={isFullscreen}
                  onFullscreenToggle={handleFullscreenToggle}
                  className="w-full h-full"
                />
              )}

              {/* Seat Selection Tab */}
              {activeTab === 'seats' && (
                <div className="w-full h-full p-6 overflow-auto">
                  <InteractiveSeatingMap
                    layout={tour.layout}
                    selectedSeats={selectedSeats}
                    onSeatSelect={handleSeatSelect}
                    onSeatDeselect={handleSeatDeselect}
                    className="max-w-4xl mx-auto"
                  />
                </div>
              )}


            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                {/* Quick Actions */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setActiveTab(activeTab === 'tour' ? 'seats' : 'tour')}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {activeTab === 'tour' ? 'Select Seats →' : '← View Tour'}
                  </button>

                  {selectedSeats.length > 0 && (
                    <div className="text-sm text-gray-600">
                      {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''} selected
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  {/* Pricing Display */}
                  {selectedSeats.length > 0 && selectedRoute && (
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        ₹{totalPrice.toLocaleString('en-IN')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {selectedSeats.length} × ₹{selectedRoute.price.toLocaleString('en-IN')} per seat
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>

                    {selectedSeats.length > 0 ? (
                      <button
                        onClick={handleBooking}
                        className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Book Now</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveTab('seats')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Select Seats
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
