'use client';

import { useState } from 'react';
import { 
  ClockIcon, 
  MapPinIcon, 
  CurrencyDollarIcon,
  StarIcon,
  WifiIcon,
  BoltIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
// Types
interface Route {
  id: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  operator: string;
  rating: number;
  reviewCount: number;
  price: {
    economy: number;
    premium: number;
  };
  schedules: Schedule[];
  amenities: string[];
}

interface Schedule {
  id: string;
  departureTime: string;
  arrivalTime: string;
  busId: string;
  availableSeats: number;
  totalSeats: number;
  available: boolean;
}

interface RouteSearchResultsProps {
  routes: Route[];
  isLoading: boolean;
  searchParams: {
    origin: string;
    destination: string;
    date: string;
    passengers: number;
  };
  onRouteSelect: (route: Route, schedule: Schedule) => void;
}

export default function RouteSearchResults({
  routes,
  isLoading,
  searchParams,
  onRouteSelect,
}: RouteSearchResultsProps) {
  const [sortBy, setSortBy] = useState<'price' | 'duration' | 'departure' | 'rating'>('price');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    maxPrice: 200,
    amenities: [] as string[],
    operators: [] as string[],
  });

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
  };

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <WifiIcon className="h-4 w-4" />;
      case 'power outlets':
        return <BoltIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const sortedRoutes = [...routes].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.price.economy - b.price.economy;
      case 'duration':
        return parseInt(a.duration) - parseInt(b.duration);
      case 'departure':
        const aEarliest = a.schedules[0]?.departureTime || '23:59';
        const bEarliest = b.schedules[0]?.departureTime || '23:59';
        return aEarliest.localeCompare(bEarliest);
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-48"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (routes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No routes found</h3>
        <p className="text-gray-600 mb-6">
          We couldn't find any routes from {searchParams.origin} to {searchParams.destination} on {searchParams.date}.
        </p>
        <div className="space-y-2 text-sm text-gray-500">
          <p>Try:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Checking your spelling</li>
            <li>Selecting a different date</li>
            <li>Searching for nearby cities</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Summary and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {routes.length} route{routes.length !== 1 ? 's' : ''} found
            </h2>
            <p className="text-sm text-gray-600">
              {searchParams.origin} → {searchParams.destination} • {searchParams.date} • {searchParams.passengers} passenger{searchParams.passengers !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="sortBy" className="text-sm font-medium text-gray-700">
                Sort by:
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="price">Price</option>
                <option value="duration">Duration</option>
                <option value="departure">Departure Time</option>
                <option value="rating">Rating</option>
              </select>
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-500"
            >
              <AdjustmentsHorizontalIcon className="h-4 w-4" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Route Results */}
      <div className="space-y-4">
        {sortedRoutes.map((route) => (
          <div key={route.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            {/* Route Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {route.origin} → {route.destination}
                </h3>
                <p className="text-sm text-gray-600">{route.operator}</p>
                <div className="flex items-center gap-1 mt-1">
                  <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">{route.rating} ({route.reviewCount} reviews)</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary-600">
                  ₹{route.price.economy}
                </p>
                <p className="text-sm text-gray-600">per person</p>
              </div>
            </div>

            {/* Route Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <ClockIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {formatDuration(parseInt(route.duration))}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {route.distance} km
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Premium: ₹{route.price.premium}
                </span>
              </div>
            </div>

            {/* Amenities */}
            <div className="flex flex-wrap gap-2 mb-4">
              {route.amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  {getAmenityIcon(amenity)}
                  {amenity}
                </span>
              ))}
            </div>

            {/* Schedules */}
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Available Times</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {route.schedules.map((schedule) => (
                  <button
                    key={schedule.id}
                    onClick={() => onRouteSelect(route, schedule)}
                    disabled={!schedule.available}
                    className={`p-3 border rounded-lg text-left transition-colors ${
                      schedule.available
                        ? 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                        : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-900">
                        {formatTime(schedule.departureTime)}
                      </span>
                      <span className="text-sm text-gray-600">
                        {formatTime(schedule.arrivalTime)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {schedule.available ? (
                        `${schedule.availableSeats || 'Few'} seats left`
                      ) : (
                        'Sold out'
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
