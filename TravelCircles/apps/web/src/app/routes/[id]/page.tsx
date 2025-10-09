'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ClockIcon, 
  MapPinIcon, 
  StarIcon,
  WifiIcon,
  BoltIcon,
  ArrowLeftIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';

interface RouteDetails {
  id: string;
  origin: string;
  destination: string;
  distance: number;
  duration: number;
  operator: string;
  amenities: string[];
  pricing: {
    economy: number;
    premium: number;
  };
  stops: Array<{
    id: string;
    stopName: string;
    arrivalTime: string | null;
    departureTime: string | null;
    stopOrder: number;
  }>;
  schedules: Array<{
    id: string;
    departureTime: string;
    arrivalTime: string;
    availableSeats: number;
    totalSeats: number;
    date: string;
    pricing: {
      economy: number;
      premium: number;
    };
  }>;
  reviews: Array<{
    id: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
    helpful: number;
  }>;
  rating: number;
  reviewCount: number;
}

export default function RouteDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const routeId = params.id as string;
  
  const [route, setRoute] = useState<RouteDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchRouteDetails();
  }, [routeId]);

  const fetchRouteDetails = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/routes/${routeId}`);
      const data = await response.json();

      if (data.success) {
        setRoute(data.data);
      } else {
        setError(data.message || 'Failed to load route details');
      }
    } catch (err) {
      setError('Failed to load route details');
      console.error('Error fetching route details:', err);
    } finally {
      setIsLoading(false);
    }
  };

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
        return <WifiIcon className="h-5 w-5" />;
      case 'power outlets':
        return <BoltIcon className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const handleBookRoute = (scheduleId: string) => {
    if (!route) return;
    
    const schedule = route.schedules.find(s => s.id === scheduleId);
    if (!schedule) return;

    // Store selection for booking process
    const selectionData = {
      route,
      schedule,
      searchParams: {
        origin: route.origin,
        destination: route.destination,
        date: selectedDate,
        passengers: 1,
      },
      timestamp: Date.now(),
    };
    
    sessionStorage.setItem('selectedRoute', JSON.stringify(selectionData));
    router.push(`/booking/seats?routeId=${route.id}&scheduleId=${scheduleId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !route) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Route Not Found</h2>
          <p className="text-gray-600 mb-8">{error || 'The requested route could not be found.'}</p>
          <button
            onClick={() => router.push('/search')}
            className="btn-primary"
          >
            Search Routes
          </button>
        </div>
      </div>
    );
  }

  const filteredSchedules = route.schedules.filter(schedule => schedule.date === selectedDate);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-primary-600">TravelCircles</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Route Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {route.origin} → {route.destination}
              </h1>
              <p className="text-lg text-gray-600 mb-2">{route.operator}</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-medium">{route.rating}</span>
                  <span className="text-gray-600">({route.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <ClockIcon className="h-5 w-5" />
                  <span>{formatDuration(route.duration)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPinIcon className="h-5 w-5" />
                  <span>{route.distance} km</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary-600">
                ₹{route.pricing.economy}
              </p>
              <p className="text-gray-600">starting from</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Route Map/Stops */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Route Stops</h2>
              <div className="space-y-4">
                {route.stops.map((stop, index) => (
                  <div key={stop.id} className="flex items-center">
                    <div className="flex flex-col items-center mr-4">
                      <div className={`w-4 h-4 rounded-full ${
                        index === 0 || index === route.stops.length - 1 
                          ? 'bg-primary-600' 
                          : 'bg-gray-300'
                      }`}></div>
                      {index < route.stops.length - 1 && (
                        <div className="w-0.5 h-8 bg-gray-300 mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{stop.stopName}</p>
                      <div className="flex gap-4 text-sm text-gray-600">
                        {stop.arrivalTime && (
                          <span>Arrives: {formatTime(stop.arrivalTime)}</span>
                        )}
                        {stop.departureTime && (
                          <span>Departs: {formatTime(stop.departureTime)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {route.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    {getAmenityIcon(amenity)}
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Reviews ({route.reviewCount})
              </h2>
              <div className="space-y-6">
                {route.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{review.userName}</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{review.comment}</p>
                    <button className="text-sm text-gray-500 hover:text-gray-700">
                      Helpful ({review.helpful})
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Date Selection */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Date</h3>
                <div className="relative">
                  <input
                    type="date"
                    value={selectedDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="input w-full"
                  />
                  <CalendarDaysIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Available Times */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Times</h3>
                {filteredSchedules.length > 0 ? (
                  <div className="space-y-3">
                    {filteredSchedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-900">
                            {formatTime(schedule.departureTime)} - {formatTime(schedule.arrivalTime)}
                          </span>
                          <span className="text-sm text-gray-600">
                            {schedule.availableSeats} seats left
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-lg font-bold text-primary-600">
                            ₹{schedule.pricing.economy}
                          </span>
                          <span className="text-sm text-gray-600">
                            Premium: ₹{schedule.pricing.premium}
                          </span>
                        </div>
                        <button
                          onClick={() => handleBookRoute(schedule.id)}
                          disabled={schedule.availableSeats === 0}
                          className={`w-full py-2 px-4 rounded-md font-medium ${
                            schedule.availableSeats > 0
                              ? 'bg-primary-600 text-white hover:bg-primary-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {schedule.availableSeats > 0 ? 'Select Seats' : 'Sold Out'}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-4">
                    No schedules available for selected date
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
