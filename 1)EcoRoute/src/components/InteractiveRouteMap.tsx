'use client';

import { useState, useEffect } from 'react';
import { Route, Location } from '@/lib/types';

interface InteractiveRouteMapProps {
  routes: Route[];
  origin: Location;
  destination: Location;
  selectedRouteId?: string;
  onRouteSelect?: (routeId: string) => void;
}

// Fallback map component that doesn't rely on external libraries

// Route colors for different transportation modes
const getRouteColor = (transportMode: string): string => {
  const colors: Record<string, string> = {
    walking: '#10b981', // green
    cycling: '#3b82f6', // blue
    electric_scooter: '#8b5cf6', // purple
    bus: '#f59e0b', // amber
    train: '#06b6d4', // cyan
    electric_car: '#10b981', // green
    hybrid_car: '#84cc16', // lime
    motorcycle: '#f97316', // orange
    car_gasoline: '#ef4444', // red
    car_diesel: '#dc2626', // red-600
    rideshare: '#ec4899', // pink
    taxi: '#f59e0b' // amber
  };
  return colors[transportMode] || '#6b7280'; // gray as fallback
};

export function InteractiveRouteMap({
  routes,
  origin,
  destination,
  selectedRouteId,
  onRouteSelect
}: InteractiveRouteMapProps) {
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => setIsMapReady(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const openInGoogleMaps = (route: Route) => {
    const origin = `${route.origin.lat},${route.origin.lng}`;
    const destination = `${route.destination.lat},${route.destination.lng}`;
    const travelMode = getTravelModeForUrl(route.transportationMode.id);
    const url = `https://www.google.com/maps/dir/${origin}/${destination}/@${origin},15z/data=!3m1!4b1!4m2!4m1!3e${travelMode}`;
    window.open(url, '_blank');
  };

  const getTravelModeForUrl = (transportModeId: string): string => {
    const modeMap: Record<string, string> = {
      walking: '2',
      cycling: '1',
      car_gasoline: '0',
      car_diesel: '0',
      hybrid_car: '0',
      electric_car: '0',
      motorcycle: '0',
      rideshare: '0',
      taxi: '0',
      bus: '3',
      train: '3',
    };
    return modeMap[transportModeId] || '0';
  };

  if (!isMapReady) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading route visualization...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Enhanced Header */}
      <div className="p-6 bg-gradient-to-r from-green-500 to-blue-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">🗺️ Smart Route Visualization</h3>
            <p className="text-green-100">
              AI-powered route comparison with real-time eco-friendly recommendations
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-green-100">Best for Environment</div>
            <div className="text-xl font-bold">
              {routes.find(r => r.carbonEmission === Math.min(...routes.map(route => route.carbonEmission)))?.transportationMode.icon}
              {routes.find(r => r.carbonEmission === Math.min(...routes.map(route => route.carbonEmission)))?.transportationMode.name}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Route Legend with Stats */}
      <div className="p-6 bg-white border-b">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">Transportation Options</h4>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-600 font-medium">
                {routes.filter(r => r.carbonEmission === 0).length} Zero Emission
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-blue-600 font-medium">
                {routes.filter(r => r.carbonEmission > 0 && r.carbonEmission < 100).length} Low Impact
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {routes.map((route, index) => (
            <button
              key={route.id}
              onClick={() => onRouteSelect?.(route.id)}
              className={`
                group relative p-3 rounded-xl text-left transition-all duration-300 transform hover:scale-105
                ${selectedRouteId === route.id
                  ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg scale-105'
                  : 'bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-gray-300'
                }
              `}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <div
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    selectedRouteId === route.id ? 'ring-2 ring-white ring-offset-2' : ''
                  }`}
                  style={{ backgroundColor: getRouteColor(route.transportationMode.id) }}
                ></div>
                <span className="text-xl">{route.transportationMode.icon}</span>
              </div>
              <div className={`font-medium text-sm mb-1 ${
                selectedRouteId === route.id ? 'text-white' : 'text-gray-900'
              }`}>
                {route.transportationMode.name}
              </div>
              <div className={`text-xs ${
                selectedRouteId === route.id ? 'text-green-100' : 'text-gray-500'
              }`}>
                {route.carbonEmission}g CO₂
              </div>
              {route.carbonEmission === 0 && (
                <div className="absolute -top-1 -right-1">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">0</span>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Enhanced Visual Route Display */}
      <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
        {/* Journey Overview */}
        <div className="mb-8 p-4 bg-white rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  A
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-lg">{origin.address}</div>
                <div className="text-sm text-green-600 font-medium">Starting Point</div>
              </div>
            </div>

            <div className="flex-1 mx-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-1 bg-gradient-to-r from-green-400 via-blue-400 to-red-400 rounded-full"></div>
                </div>
                <div className="relative flex justify-center">
                  <div className="bg-white px-4 py-2 rounded-full shadow-md border">
                    <div className="text-center">
                      <div className="font-bold text-gray-900">{routes[0]?.distance.toFixed(1)} km</div>
                      <div className="text-xs text-gray-500">Distance</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="font-semibold text-gray-900 text-lg">{destination.address}</div>
                <div className="text-sm text-red-600 font-medium">Destination</div>
              </div>
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  B
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Route Options */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Route Comparison</h4>
            <div className="text-sm text-gray-500">
              Sorted by environmental impact
            </div>
          </div>

          {routes
            .sort((a, b) => a.carbonEmission - b.carbonEmission)
            .map((route, index) => (
            <div
              key={route.id}
              className={`
                group relative p-6 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02]
                ${selectedRouteId === route.id
                  ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-xl scale-[1.02]'
                  : 'bg-white border-2 border-gray-200 hover:border-green-300 hover:shadow-lg'
                }
              `}
              onClick={() => onRouteSelect?.(route.id)}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Ranking Badge */}
              <div className={`absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                index === 0 ? 'bg-green-500 text-white' :
                index === 1 ? 'bg-blue-500 text-white' :
                index === 2 ? 'bg-yellow-500 text-white' : 'bg-gray-500 text-white'
              }`}>
                {index + 1}
              </div>

              {/* Best Choice Badge */}
              {index === 0 && (
                <div className="absolute -top-2 -right-2">
                  <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                    BEST CHOICE
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div
                      className={`w-6 h-6 rounded-full transition-all duration-300 ${
                        selectedRouteId === route.id ? 'ring-4 ring-white ring-opacity-50' : ''
                      }`}
                      style={{ backgroundColor: getRouteColor(route.transportationMode.id) }}
                    ></div>
                    {route.carbonEmission === 0 && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                    )}
                  </div>
                  <span className="text-3xl">{route.transportationMode.icon}</span>
                  <div>
                    <div className={`font-bold text-lg ${
                      selectedRouteId === route.id ? 'text-white' : 'text-gray-900'
                    }`}>
                      {route.transportationMode.name}
                    </div>
                    <div className={`text-sm ${
                      selectedRouteId === route.id ? 'text-green-100' : 'text-gray-500'
                    }`}>
                      {route.transportationMode.description}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-8">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${
                      selectedRouteId === route.id ? 'text-white' : 'text-gray-900'
                    }`}>
                      {Math.round(route.duration)}
                    </div>
                    <div className={`text-sm ${
                      selectedRouteId === route.id ? 'text-green-100' : 'text-gray-500'
                    }`}>
                      minutes
                    </div>
                  </div>

                  <div className="text-center">
                    <div className={`text-2xl font-bold ${
                      selectedRouteId === route.id ? 'text-white' : 'text-gray-900'
                    }`}>
                      ₹{(route.cost || 0).toFixed(0)}
                    </div>
                    <div className={`text-sm ${
                      selectedRouteId === route.id ? 'text-green-100' : 'text-gray-500'
                    }`}>
                      cost
                    </div>
                  </div>

                  <div className="text-center">
                    <div className={`text-2xl font-bold ${
                      selectedRouteId === route.id ? 'text-white' :
                      route.carbonEmission === 0 ? 'text-green-600' :
                      route.carbonEmission < 100 ? 'text-blue-600' :
                      route.carbonEmission < 200 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {route.carbonEmission}g
                    </div>
                    <div className={`text-sm ${
                      selectedRouteId === route.id ? 'text-green-100' : 'text-gray-500'
                    }`}>
                      CO₂ emissions
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openInGoogleMaps(route);
                    }}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                      selectedRouteId === route.id
                        ? 'bg-white text-green-600 hover:bg-gray-100'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
                    }`}
                  >
                    🗺️ Navigate
                  </button>
                </div>
              </div>

              {/* Environmental Impact Bar */}
              <div className="mt-4 pt-4 border-t border-opacity-20">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${
                    selectedRouteId === route.id ? 'text-green-100' : 'text-gray-600'
                  }`}>
                    Environmental Impact
                  </span>
                  <span className={`text-sm ${
                    selectedRouteId === route.id ? 'text-white' : 'text-gray-900'
                  }`}>
                    {route.carbonEmission === 0 ? 'Zero Impact' :
                     route.carbonEmission < 100 ? 'Very Low' :
                     route.carbonEmission < 200 ? 'Low' :
                     route.carbonEmission < 300 ? 'Moderate' : 'High'}
                  </span>
                </div>
                <div className={`w-full h-2 rounded-full ${
                  selectedRouteId === route.id ? 'bg-white bg-opacity-20' : 'bg-gray-200'
                }`}>
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      route.carbonEmission === 0 ? 'bg-green-500' :
                      route.carbonEmission < 100 ? 'bg-blue-500' :
                      route.carbonEmission < 200 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{
                      width: `${Math.min((route.carbonEmission / 300) * 100, 100)}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer with Instructions */}
      <div className="p-3 bg-gray-50 border-t">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Zero/Low Emission</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>Medium Emission</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>High Emission</span>
            </div>
          </div>
          <span>Click "Open in Maps" for detailed navigation</span>
        </div>
      </div>
    </div>
  );
}
