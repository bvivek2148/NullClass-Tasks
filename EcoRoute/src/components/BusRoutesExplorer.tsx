'use client';

import React, { useState, useEffect } from 'react';
import { BusRouteCard } from './BusRouteCard';
import { BusRoute, Location } from '@/lib/types';
import { sampleBusRoutes } from '@/lib/busData';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign,
  SlidersHorizontal,
  Leaf
} from 'lucide-react';

interface BusRoutesExplorerProps {
  onRouteSelect: (route: BusRoute, selectedSeats: string[]) => void;
  className?: string;
}

export const BusRoutesExplorer: React.FC<BusRoutesExplorerProps> = ({
  onRouteSelect,
  className = '',
}) => {
  const [routes, setRoutes] = useState<BusRoute[]>([]);
  const [filteredRoutes, setFilteredRoutes] = useState<BusRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    origin: '',
    destination: '',
    date: '',
    passengers: 1,
    maxPrice: 100,
    amenities: [] as string[],
    accessibility: false,
    virtualTour: false,
  });

  // Load sample data - In a real app, this would come from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRoutes(sampleBusRoutes);
      setFilteredRoutes(sampleBusRoutes);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter routes based on search and filters
  useEffect(() => {
    let filtered = routes;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(route =>
        route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.operator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.origin.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.destination.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price filter
    filtered = filtered.filter(route => route.pricing.basePrice <= filters.maxPrice);

    // Virtual tour filter
    if (filters.virtualTour) {
      filtered = filtered.filter(route => route.virtualTour);
    }

    // Accessibility filter
    if (filters.accessibility) {
      filtered = filtered.filter(route => route.busModel.accessibility.wheelchairAccessible);
    }

    setFilteredRoutes(filtered);
  }, [routes, searchQuery, filters]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      origin: '',
      destination: '',
      date: '',
      passengers: 1,
      maxPrice: 100,
      amenities: [],
      accessibility: false,
      virtualTour: false,
    });
    setSearchQuery('');
  };

  return (
    <div className={`bus-routes-explorer ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Explore Bus Routes
        </h2>
        <p className="text-lg text-gray-600">
          Find eco-friendly bus routes with virtual tours and comfortable seating.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search routes, operators, or destinations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <button
            onClick={() => handleFilterChange('virtualTour', !filters.virtualTour)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${filters.virtualTour 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            <Eye size={16} className="inline mr-2" />
            Virtual Tour Available
          </button>
          
          <button
            onClick={() => handleFilterChange('accessibility', !filters.accessibility)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${filters.accessibility 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            <Users size={16} className="inline mr-2" />
            Wheelchair Accessible
          </button>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <SlidersHorizontal size={16} className="inline mr-2" />
            More Filters
          </button>

          {(searchQuery || Object.values(filters).some(v => v !== '' && v !== 1 && v !== 100 && v !== false && (!Array.isArray(v) || v.length > 0))) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-full text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Price per Person
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-sm text-gray-600 mt-1">
                  Up to ${filters.maxPrice}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Passengers
                </label>
                <select
                  value={filters.passengers}
                  onChange={(e) => handleFilterChange('passengers', parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num} passenger{num !== 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Travel Date
                </label>
                <input
                  type="date"
                  value={filters.date}
                  onChange={(e) => handleFilterChange('date', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mb-4 flex items-center justify-between">
        <div className="text-gray-600">
          {loading ? 'Loading...' : `${filteredRoutes.length} route${filteredRoutes.length !== 1 ? 's' : ''} found`}
        </div>
        
        {filteredRoutes.length > 0 && (
          <div className="flex items-center space-x-2 text-sm text-green-600">
            <Leaf size={16} />
            <span>Eco-friendly transportation options</span>
          </div>
        )}
      </div>

      {/* Route Cards */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse"></div>
          ))}
        </div>
      ) : filteredRoutes.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRoutes.map(route => (
            <BusRouteCard
              key={route.id}
              route={route}
              onBookingSelect={onRouteSelect}
              showVirtualTour={true}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🚌</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No routes found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search criteria or filters to find more options.
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};
