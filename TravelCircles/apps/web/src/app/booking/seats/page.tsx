'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Opt out of static generation for this page
export const dynamic = 'force-dynamic';
import { useAuth, useAuthenticatedFetch } from '../../../contexts/AuthContext';
import SeatMap from '../../../components/buses/SeatMap';
import { 
  ArrowLeftIcon, 
  ClockIcon, 
  MapPinIcon,
  UserGroupIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

interface RouteData {
  id: string;
  origin: string;
  destination: string;
  operator: string;
}

interface ScheduleData {
  id: string;
  departureTime: string;
  arrivalTime: string;
  date: string;
  pricing: {
    economy: number;
    premium: number;
  };
}

interface BusData {
  id: string;
  number: string;
  busType: string;
  capacity: number;
  seatConfiguration: any;
  amenities: string[];
  features: any[];
}

export default function SeatSelectionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const authenticatedFetch = useAuthenticatedFetch();

  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
  const [busData, setBusData] = useState<BusData | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [reservation, setReservation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReserving, setIsReserving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const routeId = searchParams.get('routeId');
  const scheduleId = searchParams.get('scheduleId');
  const passengers = parseInt(searchParams.get('passengers') || '1');

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!routeId || !scheduleId) {
      router.push('/search');
      return;
    }

    fetchBookingData();
  }, [routeId, scheduleId, isAuthenticated]);

  const fetchBookingData = async () => {
    try {
      setIsLoading(true);

      // Get route details
      const routeResponse = await fetch(`${API_BASE_URL}/api/routes/${routeId}`);
      const routeResult = await routeResponse.json();

      if (!routeResult.success) {
        throw new Error('Failed to load route details');
      }

      const route = routeResult.data;
      const schedule = route.schedules.find((s: any) => s.id === scheduleId);

      if (!schedule) {
        throw new Error('Schedule not found');
      }

      setRouteData({
        id: route.id,
        origin: route.origin,
        destination: route.destination,
        operator: route.operator,
      });

      setScheduleData(schedule);

      // Get bus seat configuration
      const busResponse = await fetch(`${API_BASE_URL}/api/buses/${schedule.busId}/seats`);
      const busResult = await busResponse.json();

      if (busResult.success) {
        setBusData(busResult.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load booking data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSeatSelect = async (seatId: string) => {
    const isSelected = selectedSeats.includes(seatId);
    
    if (isSelected) {
      // Remove seat
      setSelectedSeats(prev => prev.filter(id => id !== seatId));
    } else {
      // Add seat (check limit)
      if (selectedSeats.length >= passengers) {
        alert(`You can select maximum ${passengers} seats`);
        return;
      }
      
      setSelectedSeats(prev => [...prev, seatId]);
    }
  };

  const reserveSeats = async () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }

    if (selectedSeats.length !== passengers) {
      alert(`Please select exactly ${passengers} seat(s)`);
      return;
    }

    try {
      setIsReserving(true);

      const response = await authenticatedFetch(`${API_BASE_URL}/api/bookings/seats/reserve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scheduleId,
          seatIds: selectedSeats,
          durationMinutes: 15,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setReservation(data.data);
        // Navigate to passenger details page
        const params = new URLSearchParams({
          routeId: routeId!,
          scheduleId: scheduleId!,
          reservationId: data.data.id,
          seats: selectedSeats.join(','),
        });
        
        router.push(`/booking/passengers?${params.toString()}`);
      } else {
        throw new Error(data.message || 'Failed to reserve seats');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to reserve seats');
    } finally {
      setIsReserving(false);
    }
  };

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const calculateTotal = () => {
    if (!busData || !scheduleData) return 0;
    
    return selectedSeats.reduce((total, seatId) => {
      const seat = busData.seatConfiguration.seatMap.find((s: any) => s.id === seatId);
      return total + (seat?.price?.base || scheduleData.pricing.economy);
    }, 0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !routeData || !scheduleData || !busData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Error</h2>
          <p className="text-gray-600 mb-8">{error || 'Failed to load booking data'}</p>
          <button
            onClick={() => router.push('/search')}
            className="btn-primary"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

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
        {/* Booking Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className="flex items-center text-primary-600">
                <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <span className="ml-2 font-medium">Select Seats</span>
              </div>
              <div className="w-16 h-0.5 bg-gray-300 mx-4"></div>
              <div className="flex items-center text-gray-400">
                <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <span className="ml-2">Passenger Details</span>
              </div>
              <div className="w-16 h-0.5 bg-gray-300 mx-4"></div>
              <div className="flex items-center text-gray-400">
                <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <span className="ml-2">Payment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trip Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Trip Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <MapPinIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Route</p>
                <p className="font-medium">{routeData.origin} → {routeData.destination}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Departure</p>
                <p className="font-medium">{formatTime(scheduleData.departureTime)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <UserGroupIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Passengers</p>
                <p className="font-medium">{passengers}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="font-medium text-primary-600">₹{calculateTotal()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seat Map */}
          <div className="lg:col-span-2">
            <SeatMap
              busId={busData.id}
              seatConfiguration={busData.seatConfiguration}
              selectedSeats={selectedSeats}
              onSeatSelect={handleSeatSelect}
              maxSeats={passengers}
            />
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Bus Info */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Bus Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">Bus Number:</span>
                    <span className="ml-2 font-medium">{busData.number}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Type:</span>
                    <span className="ml-2 font-medium">{busData.busType}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Operator:</span>
                    <span className="ml-2 font-medium">{routeData.operator}</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {busData.amenities.map((amenity, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Continue Button */}
              <button
                onClick={reserveSeats}
                disabled={selectedSeats.length !== passengers || isReserving}
                className={`w-full py-3 px-4 rounded-md font-medium ${
                  selectedSeats.length === passengers && !isReserving
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isReserving ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Reserving Seats...
                  </div>
                ) : (
                  `Continue with ${selectedSeats.length} seat(s)`
                )}
              </button>

              {selectedSeats.length !== passengers && (
                <p className="text-sm text-gray-600 text-center">
                  Please select {passengers} seat(s) to continue
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
