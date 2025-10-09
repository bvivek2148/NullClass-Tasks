'use client';

import React, { useState } from 'react';
import { BusRoute } from '@/lib/types';
import { BusTourModal } from './BusTourModal';
import {
  Clock,
  MapPin,
  Users,
  Leaf,
  Star,
  Eye,
  Calendar,
  DollarSign,
  Wifi,
  Zap,
  Coffee,
  Accessibility
} from 'lucide-react';

interface BusRouteCardProps {
  route: BusRoute;
  onBookingSelect: (route: BusRoute, selectedSeats: string[]) => void;
  className?: string;
  showVirtualTour?: boolean;
}

export const BusRouteCard: React.FC<BusRouteCardProps> = ({
  route,
  onBookingSelect,
  className = '',
  showVirtualTour = true,
}) => {
  const [showTourModal, setShowTourModal] = useState(false);

  const handleVirtualTourClick = () => {
    if (route.virtualTour) {
      setShowTourModal(true);
    }
  };

  const handleBookingProceed = (selectedSeats: string[]) => {
    setShowTourModal(false);
    onBookingSelect(route, selectedSeats);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getCarbonSavings = () => {
    // Calculate carbon savings compared to driving alone
    const carEmissionPerKm = 120; // grams CO2 per km for average car
    const carEmissions = route.distance * carEmissionPerKm;
    const busEmissions = route.distance * route.carbonEmission;
    return carEmissions - busEmissions;
  };

  const getPopularAmenities = () => {
    return route.amenities
      .filter(amenity => ['connectivity', 'comfort', 'entertainment'].includes(amenity.category))
      .slice(0, 4);
  };

  return (
    <>
      <div className={`bus-route-card bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow ${className}`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {route.name}
                </h3>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">{route.operator.rating}</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">
                {route.operator.name} • {route.busModel.name}
              </p>

              {/* Route Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin size={16} />
                  <span>{route.origin.name} → {route.destination.name}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock size={16} />
                  <span>{formatDuration(route.duration)}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Users size={16} />
                  <span>{route.busModel.capacity} seats</span>
                </div>
                <div className="flex items-center space-x-2 text-green-600">
                  <Leaf size={16} />
                  <span>{getCarbonSavings()}g CO₂ saved</span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="text-right ml-4">
              <div className="text-2xl font-bold text-gray-900">
                ${route.pricing.basePrice}
              </div>
              <div className="text-sm text-gray-500">per person</div>
            </div>
          </div>
        </div>

        {/* Amenities */}
        {getPopularAmenities().length > 0 && (
          <div className="px-6 py-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {getPopularAmenities().map(amenity => (
                  <span
                    key={amenity.id}
                    className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    title={amenity.description}
                  >
                    {amenity.icon} {amenity.name}
                  </span>
                ))}
                {route.amenities.length > 4 && (
                  <span className="text-blue-600 text-xs">
                    +{route.amenities.length - 4} more
                  </span>
                )}
              </div>

              {/* Accessibility Indicators */}
              {route.busModel.accessibility.wheelchairAccessible && (
                <div className="flex items-center space-x-1 text-blue-600">
                  <Accessibility size={16} />
                  <span className="text-xs">Accessible</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Schedule Preview */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar size={16} />
              <span>Next departures:</span>
            </div>
            <div className="flex space-x-3 text-sm">
              {route.schedule.slice(0, 3).map((schedule, index) => (
                <span key={index} className="text-gray-900 font-medium">
                  {schedule.departureTime}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6">
          <div className="flex space-x-3">
            {/* Virtual Tour Button */}
            {showVirtualTour && route.virtualTour && (
              <button
                onClick={handleVirtualTourClick}
                className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 font-medium"
              >
                <Eye size={18} />
                <span>Virtual Tour</span>
              </button>
            )}

            {/* Quick Book Button */}
            <button
              onClick={() => onBookingSelect(route, [])}
              className={`
                px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2
                ${route.virtualTour && showVirtualTour
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'flex-1 bg-green-600 text-white hover:bg-green-700'
                }
              `}
            >
              <DollarSign size={18} />
              <span>Book Now</span>
            </button>
          </div>

          {/* Carbon Impact */}
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2 text-green-700">
                <Leaf size={16} />
                <span>Eco-friendly choice</span>
              </div>
              <div className="text-green-800 font-medium">
                {getCarbonSavings()}g CO₂ saved vs. driving
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Virtual Tour Modal */}
      {route.virtualTour && (
        <BusTourModal
          isOpen={showTourModal}
          onClose={() => setShowTourModal(false)}
          busRoute={route}
          tour={route.virtualTour}
          onBookingProceed={handleBookingProceed}
          initialView="tour"
        />
      )}
    </>
  );
};
