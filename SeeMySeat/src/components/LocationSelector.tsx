'use client';

import React, { useState } from 'react';
import { MapPin, Navigation, Clock, Calendar, Users, ArrowRight } from 'lucide-react';

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

interface City {
  id: string;
  name: string;
  coordinates: {
    x: number; // percentage from left
    y: number; // percentage from top
  };
}

interface LocationSelectorProps {
  onRouteSelect: (route: Route) => void;
  onClose: () => void;
}

const popularRoutes: Route[] = [
  {
    id: 'mumbai-delhi',
    from: 'Mumbai',
    to: 'Delhi',
    duration: '24h 30m',
    distance: '1,400 km',
    price: 1200,
    departureTime: '20:00',
    arrivalTime: '20:30+1',
    availableSeats: 28
  },
  {
    id: 'bangalore-chennai',
    from: 'Bangalore',
    to: 'Chennai',
    duration: '6h 15m',
    distance: '350 km',
    price: 800,
    departureTime: '22:00',
    arrivalTime: '04:15+1',
    availableSeats: 15
  },
  {
    id: 'pune-goa',
    from: 'Pune',
    to: 'Goa',
    duration: '12h 45m',
    distance: '460 km',
    price: 1000,
    departureTime: '21:30',
    arrivalTime: '10:15+1',
    availableSeats: 22
  },
  {
    id: 'delhi-jaipur',
    from: 'Delhi',
    to: 'Jaipur',
    duration: '5h 30m',
    distance: '280 km',
    price: 600,
    departureTime: '06:00',
    arrivalTime: '11:30',
    availableSeats: 35
  },
  {
    id: 'hyderabad-bangalore',
    from: 'Hyderabad',
    to: 'Bangalore',
    duration: '8h 45m',
    distance: '570 km',
    price: 900,
    departureTime: '23:00',
    arrivalTime: '07:45+1',
    availableSeats: 18
  },
  {
    id: 'kolkata-bhubaneswar',
    from: 'Kolkata',
    to: 'Bhubaneswar',
    duration: '7h 15m',
    distance: '440 km',
    price: 750,
    departureTime: '22:30',
    arrivalTime: '05:45+1',
    availableSeats: 25
  }
];

// Major Indian cities with approximate map coordinates
const cities: City[] = [
  { id: 'mumbai', name: 'Mumbai', coordinates: { x: 25, y: 65 } },
  { id: 'delhi', name: 'Delhi', coordinates: { x: 45, y: 25 } },
  { id: 'bangalore', name: 'Bangalore', coordinates: { x: 45, y: 75 } },
  { id: 'chennai', name: 'Chennai', coordinates: { x: 55, y: 80 } },
  { id: 'pune', name: 'Pune', coordinates: { x: 30, y: 60 } },
  { id: 'goa', name: 'Goa', coordinates: { x: 30, y: 75 } },
  { id: 'hyderabad', name: 'Hyderabad', coordinates: { x: 50, y: 70 } },
  { id: 'kolkata', name: 'Kolkata', coordinates: { x: 70, y: 55 } },
  { id: 'ahmedabad', name: 'Ahmedabad', coordinates: { x: 35, y: 50 } },
  { id: 'jaipur', name: 'Jaipur', coordinates: { x: 40, y: 35 } },
  { id: 'kochi', name: 'Kochi', coordinates: { x: 40, y: 85 } },
  { id: 'bhubaneswar', name: 'Bhubaneswar', coordinates: { x: 65, y: 60 } }
];

const majorCities = cities.map(city => city.name);

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  onRouteSelect,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'popular' | 'manual' | 'map'>('popular');
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [filteredFromCities, setFilteredFromCities] = useState<string[]>([]);
  const [filteredToCities, setFilteredToCities] = useState<string[]>([]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [selectedFrom, setSelectedFrom] = useState<City | null>(null);
  const [selectedTo, setSelectedTo] = useState<City | null>(null);

  const handleFromCityChange = (value: string) => {
    setFromCity(value);
    if (value.length > 0) {
      const filtered = majorCities.filter(city => 
        city.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredFromCities(filtered);
      setShowFromDropdown(true);
    } else {
      setShowFromDropdown(false);
    }
  };

  const handleToCityChange = (value: string) => {
    setToCity(value);
    if (value.length > 0) {
      const filtered = majorCities.filter(city => 
        city.toLowerCase().includes(value.toLowerCase()) && city !== fromCity
      );
      setFilteredToCities(filtered);
      setShowToDropdown(true);
    } else {
      setShowToDropdown(false);
    }
  };

  const handleManualSearch = () => {
    if (fromCity && toCity && departureDate) {
      // Create a mock route for manual search
      const mockRoute: Route = {
        id: `${fromCity.toLowerCase()}-${toCity.toLowerCase()}`,
        from: fromCity,
        to: toCity,
        duration: '8h 30m',
        distance: '500 km',
        price: 850,
        departureTime: '20:00',
        arrivalTime: '04:30+1',
        availableSeats: 20
      };
      onRouteSelect(mockRoute);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const handleCitySelect = (city: City) => {
    if (!selectedFrom) {
      // First click - select as "from" city
      setSelectedFrom(city);
      setFromCity(city.name);
    } else if (!selectedTo && city.id !== selectedFrom.id) {
      // Second click - select as "to" city (if different from "from")
      setSelectedTo(city);
      setToCity(city.name);
    } else if (city.id === selectedFrom.id) {
      // Clicking on "from" city again - deselect it
      setSelectedFrom(null);
      setFromCity('');
      if (selectedTo) {
        // Move "to" city to "from" position
        setSelectedFrom(selectedTo);
        setFromCity(selectedTo.name);
        setSelectedTo(null);
        setToCity('');
      }
    } else if (selectedTo && city.id === selectedTo.id) {
      // Clicking on "to" city again - deselect it
      setSelectedTo(null);
      setToCity('');
    } else {
      // Both cities already selected, replace "to" city
      setSelectedTo(city);
      setToCity(city.name);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Select Your Journey</h2>
            <p className="text-blue-100">Choose your route to start the virtual tour</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('popular')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'popular'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Popular Routes
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'manual'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Manual Search
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
              activeTab === 'map'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Map View
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-h-[60vh] overflow-y-auto">
        {/* Popular Routes Tab */}
        {activeTab === 'popular' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Routes</h3>
            <div className="grid gap-4">
              {popularRoutes.map((route) => (
                <div
                  key={route.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => onRouteSelect(route)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-gray-900">{route.from}</span>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <MapPin className="w-5 h-5 text-red-600" />
                        <span className="font-semibold text-gray-900">{route.to}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">₹{route.price}</div>
                      <div className="text-sm text-gray-500">per seat</div>
                    </div>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{route.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Navigation className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{route.distance}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{route.departureTime} - {route.arrivalTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{route.availableSeats} seats</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Manual Search Tab */}
        {activeTab === 'manual' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Search Routes</h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              {/* From City */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                <div className="relative">
                  <input
                    type="text"
                    value={fromCity}
                    onChange={(e) => handleFromCityChange(e.target.value)}
                    onFocus={() => setShowFromDropdown(true)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter departure city"
                  />
                  <MapPin className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                </div>
                
                {showFromDropdown && filteredFromCities.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredFromCities.map((city) => (
                      <button
                        key={city}
                        onClick={() => {
                          setFromCity(city);
                          setShowFromDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors"
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* To City */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                <div className="relative">
                  <input
                    type="text"
                    value={toCity}
                    onChange={(e) => handleToCityChange(e.target.value)}
                    onFocus={() => setShowToDropdown(true)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter destination city"
                  />
                  <MapPin className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                </div>
                
                {showToDropdown && filteredToCities.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredToCities.map((city) => (
                      <button
                        key={city}
                        onClick={() => {
                          setToCity(city);
                          setShowToDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors"
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Departure Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Departure Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    min={getTomorrowDate()}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            <button
              onClick={handleManualSearch}
              disabled={!fromCity || !toCity || !departureDate}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Search Routes
            </button>
          </div>
        )}

        {/* Map View Tab */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Interactive Route Map</h3>
            
            {/* Interactive India Map */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg h-96 relative overflow-hidden border border-gray-200 shadow-inner">
              {/* Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-yellow-50 to-orange-100 opacity-30"></div>

              {/* India Map Outline (Simplified) */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">
                {/* Simplified India outline */}
                <path
                  d="M80 50 L120 40 L160 45 L200 50 L240 60 L280 80 L300 120 L290 160 L270 200 L240 230 L200 250 L160 240 L120 220 L100 180 L90 140 L85 100 Z"
                  fill="rgba(34, 197, 94, 0.1)"
                  stroke="rgba(34, 197, 94, 0.3)"
                  strokeWidth="2"
                  className="drop-shadow-sm"
                />

                {/* State boundaries (simplified) */}
                <g stroke="rgba(34, 197, 94, 0.2)" strokeWidth="1" fill="none">
                  <path d="M120 80 L180 85 L200 120 L160 140 L120 130 Z" />
                  <path d="M160 140 L220 145 L240 180 L200 200 L160 190 Z" />
                  <path d="M100 120 L160 125 L180 160 L140 180 L100 170 Z" />
                </g>
              </svg>

              {/* City Markers */}
              {cities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => handleCitySelect(city)}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
                    selectedFrom?.id === city.id || selectedTo?.id === city.id
                      ? 'scale-125 z-20'
                      : 'hover:scale-110 z-10'
                  }`}
                  style={{
                    left: `${city.coordinates.x}%`,
                    top: `${city.coordinates.y}%`,
                  }}
                  title={city.name}
                >
                  <div className={`relative ${
                    selectedFrom?.id === city.id
                      ? 'text-green-600'
                      : selectedTo?.id === city.id
                      ? 'text-red-600'
                      : 'text-blue-600 hover:text-blue-700'
                  }`}>
                    <MapPin className="w-6 h-6 drop-shadow-lg" />
                    <div className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded text-xs font-medium whitespace-nowrap shadow-lg ${
                      selectedFrom?.id === city.id
                        ? 'bg-green-600 text-white'
                        : selectedTo?.id === city.id
                        ? 'bg-red-600 text-white'
                        : 'bg-white text-gray-700 border'
                    }`}>
                      {city.name}
                      {selectedFrom?.id === city.id && <span className="ml-1">📍</span>}
                      {selectedTo?.id === city.id && <span className="ml-1">🎯</span>}
                    </div>
                  </div>
                </button>
              ))}

              {/* Route Line */}
              {selectedFrom && selectedTo && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0.8" />
                    </linearGradient>
                  </defs>
                  <line
                    x1={selectedFrom.coordinates.x}
                    y1={selectedFrom.coordinates.y}
                    x2={selectedTo.coordinates.x}
                    y2={selectedTo.coordinates.y}
                    stroke="url(#routeGradient)"
                    strokeWidth="0.5"
                    strokeDasharray="2,1"
                    className="animate-pulse"
                  />
                  {/* Route direction arrow */}
                  <polygon
                    points={`${selectedTo.coordinates.x - 1},${selectedTo.coordinates.y - 0.5} ${selectedTo.coordinates.x + 1},${selectedTo.coordinates.y} ${selectedTo.coordinates.x - 1},${selectedTo.coordinates.y + 0.5}`}
                    fill="#ef4444"
                    className="animate-pulse"
                  />
                </svg>
              )}

              {/* Map Legend */}
              <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-3 shadow-lg border">
                <div className="text-xs font-medium text-gray-700 mb-2">Map Legend</div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span className="text-gray-600">From City</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-red-600" />
                    <span className="text-gray-600">To City</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-0.5 bg-gradient-to-r from-green-500 to-red-500"></div>
                    <span className="text-gray-600">Route</span>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="absolute top-4 left-4 bg-blue-600 bg-opacity-90 backdrop-blur-sm text-white px-3 py-2 rounded-lg shadow-lg">
                <div className="text-xs font-medium">Click cities to select route</div>
              </div>
            </div>
            
            {/* Quick route buttons for map view */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {popularRoutes.slice(0, 6).map((route) => (
                <button
                  key={route.id}
                  onClick={() => onRouteSelect(route)}
                  className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                >
                  <div className="font-medium text-gray-900">{route.from} → {route.to}</div>
                  <div className="text-sm text-gray-600">₹{route.price}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
