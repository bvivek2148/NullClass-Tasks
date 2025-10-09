'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// Opt out of static generation for this page
export const dynamic = 'force-dynamic';
import RouteSearchForm from '../../components/routes/RouteSearchForm';
import RouteSearchResults from '../../components/routes/RouteSearchResults';
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

interface SearchFormData {
  origin: string;
  destination: string;
  date: string;
  passengers: number;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchData, setSearchData] = useState<SearchFormData>({
    origin: searchParams.get('origin') || '',
    destination: searchParams.get('destination') || '',
    date: searchParams.get('date') || new Date().toISOString().split('T')[0],
    passengers: parseInt(searchParams.get('passengers') || '1'),
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Perform search when component mounts or search params change
  useEffect(() => {
    if (searchData.origin && searchData.destination) {
      performSearch(searchData);
    }
  }, []);

  const performSearch = async (formData: SearchFormData) => {
    setIsLoading(true);
    setSearchData(formData);

    try {
      const queryParams = new URLSearchParams({
        origin: formData.origin,
        destination: formData.destination,
        date: formData.date,
        passengers: formData.passengers.toString(),
        sortBy: 'price',
      });

      const response = await fetch(`${API_BASE_URL}/api/routes/search?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        setRoutes(data.data.routes || []);
        
        // Update URL with search parameters
        const newSearchParams = new URLSearchParams({
          origin: formData.origin,
          destination: formData.destination,
          date: formData.date,
          passengers: formData.passengers.toString(),
        });
        
        router.replace(`/search?${newSearchParams.toString()}`, { scroll: false });
      } else {
        console.error('Search failed:', data.message);
        setRoutes([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setRoutes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRouteSelect = (route: Route, schedule: Schedule) => {
    // Store selection in sessionStorage for booking process
    const selectionData = {
      route,
      schedule,
      searchParams: searchData,
      timestamp: Date.now(),
    };
    
    sessionStorage.setItem('selectedRoute', JSON.stringify(selectionData));
    
    // Navigate to seat selection page
    router.push(`/booking/seats?routeId=${route.id}&scheduleId=${schedule.id}`);
  };

  const hasSearched = searchData.origin && searchData.destination;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/')}
                className="text-2xl font-bold text-primary-600 hover:text-primary-500"
              >
                TravelCircles
              </button>
            </div>
            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => router.push('/routes')}
                className="text-gray-700 hover:text-primary-600"
              >
                Routes
              </button>
              <button
                onClick={() => router.push('/community')}
                className="text-gray-700 hover:text-primary-600"
              >
                Community
              </button>
              <button
                onClick={() => router.push('/tips')}
                className="text-gray-700 hover:text-primary-600"
              >
                Tips
              </button>
            </nav>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/login')}
                className="text-gray-700 hover:text-primary-600"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push('/register')}
                className="btn-primary"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Search Form Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Find Your Route
              </h1>
              <RouteSearchForm
                onSearch={performSearch}
                initialData={searchData}
              />
              
              {/* Popular Routes */}
              <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Popular Routes
                </h3>
                <div className="space-y-3">
                  {[
                    { from: 'Mumbai, Maharashtra', to: 'Pune, Maharashtra', price: '₹450' },
                    { from: 'Delhi, Delhi', to: 'Jaipur, Rajasthan', price: '₹380' },
                    { from: 'Bangalore, Karnataka', to: 'Chennai, Tamil Nadu', price: '₹520' },
                  ].map((route, index) => (
                    <button
                      key={index}
                      onClick={() => performSearch({
                        origin: route.from,
                        destination: route.to,
                        date: searchData.date,
                        passengers: searchData.passengers,
                      })}
                      className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {route.from} → {route.to}
                          </p>
                        </div>
                        <span className="text-primary-600 font-semibold text-sm">
                          {route.price}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Search Results */}
          <div className="lg:col-span-3">
            {hasSearched ? (
              <RouteSearchResults
                routes={routes}
                isLoading={isLoading}
                searchParams={searchData}
                onRouteSelect={handleRouteSelect}
              />
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-primary-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Start Your Journey
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Enter your departure and destination cities to find available bus routes.
                  </p>
                  <div className="text-sm text-gray-500">
                    <p className="mb-2">✓ Real-time availability</p>
                    <p className="mb-2">✓ Best price guarantee</p>
                    <p>✓ Instant booking confirmation</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
