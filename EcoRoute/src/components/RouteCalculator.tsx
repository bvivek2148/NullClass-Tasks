'use client';

import { useState, useEffect } from 'react';
import { Location, RouteComparison, AlternativeRoute } from '@/lib/types';
import { routingService } from '@/lib/routing';
import { emissionCalculator } from '@/lib/emissions';
import { RouteCard } from './RouteCard';
import { AlternativeRoutes } from './AlternativeRoutes';
import { EnvironmentalImpact } from './EnvironmentalImpact';
import { InteractiveRouteMap } from './InteractiveRouteMap';
import { RealTimeDataDisplay } from './RealTimeDataDisplay';

export function RouteCalculator() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [routeComparison, setRouteComparison] = useState<RouteComparison | null>(null);
  const [alternatives, setAlternatives] = useState<AlternativeRoute[]>([]);
  const [selectedModeId, setSelectedModeId] = useState('car_gasoline');
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [userChoices, setUserChoices] = useState<{route?: string, alternative?: string}>({});
  const [error, setError] = useState<string | null>(null);

  const handleCalculateRoutes = async () => {
    if (!origin.trim() || !destination.trim()) {
      setError('Please enter both origin and destination');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // Geocode addresses
      const originLocation = await routingService.geocodeAddress(origin);
      const destinationLocation = await routingService.geocodeAddress(destination);

      if (!originLocation || !destinationLocation) {
        setError('Could not find one or both locations. Please check your addresses and try again.');
        return;
      }

      // Get route comparisons
      const comparison = await routingService.getRouteComparisons(
        originLocation,
        destinationLocation
      );
      setRouteComparison(comparison);

      // Get eco-friendly alternatives
      const ecoAlternatives = await routingService.getEcoAlternatives(
        originLocation,
        destinationLocation,
        selectedModeId
      );
      setAlternatives(ecoAlternatives);

    } catch (error) {
      console.error('Error calculating routes:', error);
      setError('Error calculating routes. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearResults = () => {
    setRouteComparison(null);
    setAlternatives([]);
    setSelectedRoute(null);
    setUserChoices({});
    setError(null);
  };

  return (
    <div className="space-y-8">
      {/* Route Input Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Plan Your Journey</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-2">
              From
            </label>
            <input
              type="text"
              id="origin"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Enter starting location"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
            />
            {origin && (
              <div className="text-xs text-green-600 mt-1">
                ✓ Origin: {origin}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
              To
            </label>
            <input
              type="text"
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter destination"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
            />
            {destination && (
              <div className="text-xs text-green-600 mt-1">
                ✓ Destination: {destination}
              </div>
            )}
          </div>
        </div>

        {/* Quick Fill Buttons */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium text-gray-700 mb-2">Quick Test Examples:</div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setOrigin('Downtown');
                setDestination('Airport');
              }}
              className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
            >
              Downtown → Airport
            </button>
            <button
              onClick={() => {
                setOrigin('Central Park');
                setDestination('Times Square');
              }}
              className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
            >
              Central Park → Times Square
            </button>
            <button
              onClick={() => {
                setOrigin('Home');
                setDestination('Office');
              }}
              className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
            >
              Home → Office
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="transport-mode" className="block text-sm font-medium text-gray-700 mb-2">
            Your Current Transportation Mode
          </label>
          <select
            id="transport-mode"
            value={selectedModeId}
            onChange={(e) => setSelectedModeId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white"
          >
            <option value="car_gasoline">🚗 Gasoline Car</option>
            <option value="car_diesel">🚗 Diesel Car</option>
            <option value="hybrid_car">🚗 Hybrid Car</option>
            <option value="electric_car">🔋 Electric Car</option>
            <option value="motorcycle">🏍️ Motorcycle</option>
            <option value="rideshare">🚕 Ride Share</option>
            <option value="taxi">🚖 Taxi</option>
            <option value="bus">🚌 Public Bus</option>
            <option value="train">🚊 Train/Metro</option>
            <option value="cycling">🚴 Cycling</option>
            <option value="walking">🚶 Walking</option>
            <option value="electric_scooter">🛴 Electric Scooter</option>
          </select>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleCalculateRoutes}
            disabled={isLoading}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Calculating...
              </div>
            ) : (
              'Calculate Routes & Emissions'
            )}
          </button>
          
          {routeComparison && (
            <button
              onClick={handleClearResults}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              Clear Results
            </button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <span className="text-red-500">⚠️</span>
            <span className="text-red-700 font-medium">Error</span>
          </div>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Real-Time Conditions */}
      <RealTimeDataDisplay
        origin={routeComparison ? routeComparison.routes[0].origin : null}
        destination={routeComparison ? routeComparison.routes[0].destination : null}
        selectedTransportMode={selectedModeId}
        baseEmissions={routeComparison ? routeComparison.routes.find(r => r.transportationMode.id === selectedModeId)?.carbonEmission || 0 : 0}
      />

      {/* Results */}
      {routeComparison && (
        <div className="space-y-6">
          {/* Environmental Impact Summary */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Environmental Impact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {routeComparison.bestEcoOption.carbonEmission}g
                </div>
                <div className="text-sm text-gray-600">Best Option CO₂</div>
                <div className="text-xs text-gray-500 mt-1">
                  {routeComparison.bestEcoOption.transportationMode.name}
                </div>
              </div>
              
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {routeComparison.worstEcoOption.carbonEmission}g
                </div>
                <div className="text-sm text-gray-600">Highest Option CO₂</div>
                <div className="text-xs text-gray-500 mt-1">
                  {routeComparison.worstEcoOption.transportationMode.name}
                </div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {routeComparison.potentialSavings}g
                </div>
                <div className="text-sm text-gray-600">Potential Savings</div>
                <div className="text-xs text-gray-500 mt-1">
                  {routeComparison.savingsPercentage}% reduction
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Route Map */}
          <InteractiveRouteMap
            routes={routeComparison.routes}
            origin={routeComparison.routes[0].origin}
            destination={routeComparison.routes[0].destination}
            selectedRouteId={selectedRoute || undefined}
            onRouteSelect={(routeId) => {
              setSelectedRoute(routeId);
              const route = routeComparison.routes.find(r => r.id === routeId);
              if (route) {
                setUserChoices({...userChoices, route: route.transportationMode.name});
              }
            }}
          />

          {/* Route Comparison */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Route Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {routeComparison.routes
                .sort((a, b) => a.carbonEmission - b.carbonEmission)
                .map((route) => (
                  <RouteCard
                    key={route.id}
                    route={route}
                    isSelected={selectedRoute === route.id}
                    onSelect={() => {
                      setSelectedRoute(route.id);
                      setUserChoices({...userChoices, route: route.transportationMode.name});
                      alert(`🚀 You selected ${route.transportationMode.name}!\n\nTrip Details:\n• Distance: ${route.distance.toFixed(1)}km\n• Duration: ${Math.round(route.duration)}min\n• CO₂ Emissions: ${route.carbonEmission}g\n• Cost: ₹${(route.cost || 0).toFixed(0)}\n\nGreat choice for your journey!`);
                    }}
                  />
                ))}
            </div>
          </div>

          {/* Eco-Friendly Alternatives */}
          {alternatives.length > 0 && (
            <AlternativeRoutes
              alternatives={alternatives}
              onRouteSelect={(alternative: AlternativeRoute) => {
                setUserChoices({...userChoices, alternative: alternative.route.transportationMode.name});
                alert(`🌱 Excellent eco-friendly choice!\n\nYou selected: ${alternative.route.transportationMode.name}\n\nEnvironmental Impact:\n• CO₂ Saved: ${alternative.savings.co2}g\n• Cost Difference: ${alternative.savings.cost >= 0 ? `Save ₹${alternative.savings.cost.toFixed(0)}` : `+₹${Math.abs(alternative.savings.cost).toFixed(0)}`}\n• Time Difference: ${alternative.savings.time <= 0 ? `${Math.abs(alternative.savings.time)}min faster` : `+${alternative.savings.time}min`}\n\nThank you for choosing sustainable transportation! 🌍`);
              }}
            />
          )}

          {/* Environmental Impact Details */}
          <EnvironmentalImpact
            co2Emissions={routeComparison.bestEcoOption.carbonEmission}
            potentialSavings={routeComparison.potentialSavings}
          />

          {/* User Choices Summary */}
          {(userChoices.route || userChoices.alternative) && (
            <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">🎯 Your Choices Summary</h3>
              <div className="space-y-2">
                {userChoices.route && (
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">✅</span>
                    <span className="text-gray-700">Selected Route: <strong>{userChoices.route}</strong></span>
                  </div>
                )}
                {userChoices.alternative && (
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-600">🌱</span>
                    <span className="text-gray-700">Eco Alternative: <strong>{userChoices.alternative}</strong></span>
                  </div>
                )}
                <div className="mt-3 pt-3 border-t border-green-200">
                  <p className="text-sm text-gray-600">
                    Great job planning your sustainable journey! Your choices help reduce carbon emissions and protect our environment.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Tips */}
      <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 Eco-Friendly Travel Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div className="flex items-start space-x-2">
            <span className="text-green-600">🚶</span>
            <span>Walk or cycle for trips under 2km for zero emissions and great exercise</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-blue-600">🚌</span>
            <span>Use public transport to reduce per-person emissions significantly</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-purple-600">🚗</span>
            <span>Carpool or use ride-sharing to split emissions among passengers</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-yellow-600">⚡</span>
            <span>Choose electric vehicles when available for cleaner transportation</span>
          </div>
        </div>
      </div>
    </div>
  );
}
