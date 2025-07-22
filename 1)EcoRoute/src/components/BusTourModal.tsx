'use client';

import React, { useState, useEffect } from 'react';
import { VirtualTourViewer } from './VirtualTourViewer';
import { InteractiveSeatingMap } from './InteractiveSeatingMap';
import { ViewpointNavigation } from './ViewpointNavigation';
import { VirtualBusTour, BusRoute, VirtualTourViewpoint } from '@/lib/types';
import { 
  X, 
  Eye, 
  Map, 
  ArrowRight, 
  ArrowLeft, 
  Maximize2,
  Info,
  Star,
  Users,
  Clock,
  MapPin
} from 'lucide-react';

interface BusTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  busRoute: BusRoute;
  tour: VirtualBusTour;
  onBookingProceed: (selectedSeats: string[]) => void;
  initialView?: 'tour' | 'seating';
}

export const BusTourModal: React.FC<BusTourModalProps> = ({
  isOpen,
  onClose,
  busRoute,
  tour,
  onBookingProceed,
  initialView = 'tour',
}) => {
  const [currentView, setCurrentView] = useState<'tour' | 'seating'>(initialView);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [currentViewpoint, setCurrentViewpoint] = useState<VirtualTourViewpoint>(
    tour.viewpoints.find(v => v.id === tour.defaultViewpoint) || tour.viewpoints[0]
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showBusInfo, setShowBusInfo] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentView(initialView);
      setSelectedSeats([]);
      setIsFullscreen(false);
      setShowBusInfo(false);
    }
  }, [isOpen, initialView]);

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

  const handleSeatSelect = (seatId: string) => {
    setSelectedSeats(prev => [...prev, seatId]);
  };

  const handleSeatDeselect = (seatId: string) => {
    setSelectedSeats(prev => prev.filter(id => id !== seatId));
  };

  const handleViewpointChange = (viewpointId: string) => {
    const newViewpoint = tour.viewpoints.find(v => v.id === viewpointId);
    if (newViewpoint) {
      setCurrentViewpoint(newViewpoint);
    }
  };

  const handleProceedToBooking = () => {
    if (selectedSeats.length > 0) {
      onBookingProceed(selectedSeats);
    }
  };

  const calculateTotalPrice = () => {
    return selectedSeats.reduce((total, seatId) => {
      const seat = tour.layout.seats.find(s => s.id === seatId);
      return total + (seat?.price || 0) + busRoute.pricing.basePrice;
    }, 0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-75 transition-opacity"
        onClick={() => !isFullscreen && onClose()}
      />

      {/* Modal Content */}
      <div className={`
        relative w-full h-full flex flex-col
        ${isFullscreen ? '' : 'max-w-7xl mx-auto my-4 h-[calc(100vh-2rem)]'}
      `}>
        {/* Header */}
        {!isFullscreen && (
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg">
            <div className="flex items-center space-x-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {busRoute.name} - Virtual Tour
                </h2>
                <p className="text-sm text-gray-600">
                  {busRoute.operator.name} • {tour.busModel.name}
                </p>
              </div>
              
              <button
                onClick={() => setShowBusInfo(!showBusInfo)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Bus Information"
              >
                <Info size={20} />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setCurrentView('tour')}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${currentView === 'tour' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                    }
                  `}
                >
                  <Eye size={16} />
                  <span>Virtual Tour</span>
                </button>
                <button
                  onClick={() => setCurrentView('seating')}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${currentView === 'seating' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                    }
                  `}
                >
                  <Map size={16} />
                  <span>Seat Selection</span>
                </button>
              </div>

              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Bus Information Panel */}
        {showBusInfo && !isFullscreen && (
          <div className="bg-blue-50 border-b border-blue-200 px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Users size={16} className="text-blue-600" />
                <span>Capacity: {tour.busModel.capacity} passengers</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock size={16} className="text-blue-600" />
                <span>Duration: {busRoute.duration} minutes</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-blue-600" />
                <span>Distance: {busRoute.distance} km</span>
              </div>
            </div>
            
            {tour.busModel.amenities.length > 0 && (
              <div className="mt-3 pt-3 border-t border-blue-200">
                <div className="flex flex-wrap gap-2">
                  {tour.busModel.amenities.slice(0, 6).map(amenity => (
                    <span
                      key={amenity.id}
                      className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {amenity.icon} {amenity.name}
                    </span>
                  ))}
                  {tour.busModel.amenities.length > 6 && (
                    <span className="text-blue-600 text-xs">
                      +{tour.busModel.amenities.length - 6} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 bg-white overflow-hidden rounded-b-lg">
          {currentView === 'tour' ? (
            <div className="h-full flex flex-col">
              {/* Virtual Tour Viewer */}
              <div className="flex-1 relative">
                <VirtualTourViewer
                  tour={tour}
                  selectedSeats={selectedSeats}
                  onSeatSelect={handleSeatSelect}
                  onSeatDeselect={handleSeatDeselect}
                  onClose={onClose}
                  isFullscreen={isFullscreen}
                  onFullscreenToggle={() => setIsFullscreen(!isFullscreen)}
                  className="h-full"
                />
              </div>

              {/* Viewpoint Navigation */}
              {!isFullscreen && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
                  <ViewpointNavigation
                    viewpoints={tour.viewpoints}
                    currentViewpoint={currentViewpoint}
                    onViewpointChange={handleViewpointChange}
                  />
                </div>
              )}

              {/* Tour Controls */}
              {!isFullscreen && (
                <div className="absolute bottom-4 right-4 z-20">
                  <button
                    onClick={() => setCurrentView('seating')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-lg"
                  >
                    <span>Select Seats</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col">
              {/* Seating Map */}
              <div className="flex-1 overflow-auto p-6">
                <InteractiveSeatingMap
                  layout={tour.layout}
                  selectedSeats={selectedSeats}
                  onSeatSelect={handleSeatSelect}
                  onSeatDeselect={handleSeatDeselect}
                  maxSelectableSeats={4}
                  showLegend={true}
                />
              </div>

              {/* Seating Controls */}
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setCurrentView('tour')}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <ArrowLeft size={16} />
                    <span>Back to Tour</span>
                  </button>

                  <div className="flex items-center space-x-4">
                    {selectedSeats.length > 0 && (
                      <div className="text-right">
                        <div className="text-sm text-gray-600">
                          {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''} selected
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          ${calculateTotalPrice().toFixed(2)}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handleProceedToBooking}
                      disabled={selectedSeats.length === 0}
                      className={`
                        px-6 py-3 rounded-lg font-medium transition-colors
                        ${selectedSeats.length > 0
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }
                      `}
                    >
                      Proceed to Booking
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
