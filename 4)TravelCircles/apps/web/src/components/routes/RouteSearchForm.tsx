'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  MagnifyingGlassIcon, 
  ArrowsRightLeftIcon,
  CalendarDaysIcon,
  UserGroupIcon 
} from '@heroicons/react/24/outline';

interface SearchFormData {
  origin: string;
  destination: string;
  date: string;
  passengers: number;
}

interface RouteSearchFormProps {
  onSearch?: (searchData: SearchFormData) => void;
  initialData?: Partial<SearchFormData>;
  className?: string;
}

export default function RouteSearchForm({ 
  onSearch, 
  initialData = {}, 
  className = '' 
}: RouteSearchFormProps) {
  const router = useRouter();
  
  const [formData, setFormData] = useState<SearchFormData>({
    origin: initialData.origin || '',
    destination: initialData.destination || '',
    date: initialData.date || new Date().toISOString().split('T')[0],
    passengers: initialData.passengers || 1,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Popular cities for autocomplete suggestions
  const popularCities = [
    'Mumbai, Maharashtra',
    'Delhi, Delhi',
    'Bangalore, Karnataka',
    'Hyderabad, Telangana',
    'Chennai, Tamil Nadu',
    'Kolkata, West Bengal',
    'Pune, Maharashtra',
    'Ahmedabad, Gujarat',
    'Jaipur, Rajasthan',
    'Surat, Gujarat',
  ];

  const handleInputChange = (field: keyof SearchFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const swapLocations = () => {
    setFormData(prev => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.origin.trim()) {
      newErrors.origin = 'Origin is required';
    }

    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination is required';
    }

    if (formData.origin === formData.destination) {
      newErrors.destination = 'Destination must be different from origin';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.date = 'Date cannot be in the past';
      }
    }

    if (formData.passengers < 1 || formData.passengers > 10) {
      newErrors.passengers = 'Passengers must be between 1 and 10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (onSearch) {
        onSearch(formData);
      } else {
        // Navigate to search results page
        const searchParams = new URLSearchParams({
          origin: formData.origin,
          destination: formData.destination,
          date: formData.date,
          passengers: formData.passengers.toString(),
        });
        
        router.push(`/search?${searchParams.toString()}`);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg border border-gray-200 p-6 ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Origin and Destination */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
          <div>
            <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-1">
              From
            </label>
            <div className="relative">
              <input
                type="text"
                id="origin"
                list="origin-cities"
                className={`input ${errors.origin ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Enter departure city"
                value={formData.origin}
                onChange={(e) => handleInputChange('origin', e.target.value)}
              />
              <datalist id="origin-cities">
                {popularCities.map(city => (
                  <option key={city} value={city} />
                ))}
              </datalist>
            </div>
            {errors.origin && (
              <p className="mt-1 text-sm text-red-600">{errors.origin}</p>
            )}
          </div>

          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
              To
            </label>
            <div className="relative">
              <input
                type="text"
                id="destination"
                list="destination-cities"
                className={`input ${errors.destination ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                placeholder="Enter destination city"
                value={formData.destination}
                onChange={(e) => handleInputChange('destination', e.target.value)}
              />
              <datalist id="destination-cities">
                {popularCities.map(city => (
                  <option key={city} value={city} />
                ))}
              </datalist>
            </div>
            {errors.destination && (
              <p className="mt-1 text-sm text-red-600">{errors.destination}</p>
            )}
          </div>

          {/* Swap button */}
          <button
            type="button"
            onClick={swapLocations}
            className="absolute top-8 left-1/2 transform -translate-x-1/2 md:translate-x-0 md:left-auto md:right-1/2 md:translate-x-1/2 bg-white border border-gray-300 rounded-full p-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 z-10"
            title="Swap locations"
          >
            <ArrowsRightLeftIcon className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        {/* Date and Passengers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Departure Date
            </label>
            <div className="relative">
              <input
                type="date"
                id="date"
                className={`input ${errors.date ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                value={formData.date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => handleInputChange('date', e.target.value)}
              />
              <CalendarDaysIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date}</p>
            )}
          </div>

          <div>
            <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-1">
              Passengers
            </label>
            <div className="relative">
              <select
                id="passengers"
                className={`input ${errors.passengers ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                value={formData.passengers}
                onChange={(e) => handleInputChange('passengers', parseInt(e.target.value))}
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {i === 0 ? 'Passenger' : 'Passengers'}
                  </option>
                ))}
              </select>
              <UserGroupIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
            {errors.passengers && (
              <p className="mt-1 text-sm text-red-600">{errors.passengers}</p>
            )}
          </div>
        </div>

        {/* Quick date options */}
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600">Quick select:</span>
          <button
            type="button"
            onClick={() => handleInputChange('date', new Date().toISOString().split('T')[0])}
            className="text-sm text-primary-600 hover:text-primary-500 underline"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => handleInputChange('date', getTomorrowDate())}
            className="text-sm text-primary-600 hover:text-primary-500 underline"
          >
            Tomorrow
          </button>
        </div>

        {/* Search button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary flex items-center justify-center py-3"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Searching...
            </div>
          ) : (
            <>
              <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
              Search Routes
            </>
          )}
        </button>
      </form>
    </div>
  );
}
