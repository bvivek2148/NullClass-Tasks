'use client';

import { useState, useEffect } from 'react';
import { Location } from '@/lib/types';
import { useRealTimeData, useTrafficAwareEmissions, usePublicTransportInfo, useWeatherFeasibility, useBikeShareData } from '@/hooks/useRealTimeData';

interface RealTimeDataDisplayProps {
  origin: Location | null;
  destination: Location | null;
  selectedTransportMode?: string;
  baseEmissions?: number;
}

export function RealTimeDataDisplay({ 
  origin, 
  destination, 
  selectedTransportMode = 'car_gasoline',
  baseEmissions = 0
}: RealTimeDataDisplayProps) {
  const { data: realTimeData, loading, error, lastUpdated, refresh } = useRealTimeData(origin, destination);
  const { adjustedEmissions, trafficImpact, emissionIncrease } = useTrafficAwareEmissions(
    baseEmissions, 
    selectedTransportMode, 
    origin, 
    destination
  );
  const { delays, availability } = usePublicTransportInfo(origin, destination);
  const { weather, walkingFeasible, cyclingFeasible } = useWeatherFeasibility(origin);
  const { bikeShare, hasAvailableBikes, nearbyStation } = useBikeShareData(origin);

  if (!origin || !destination) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
        Enter origin and destination to see real-time conditions
      </div>
    );
  }

  if (loading && !realTimeData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
            <div className="h-4 bg-gray-300 rounded w-32"></div>
          </div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-300 rounded w-full"></div>
            <div className="h-3 bg-gray-300 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <span className="text-red-500">⚠️</span>
          <span className="text-red-700 font-medium">Real-time data unavailable</span>
        </div>
        <p className="text-red-600 text-sm mt-1">{error}</p>
        <button 
          onClick={refresh}
          className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
        >
          Try again
        </button>
      </div>
    );
  }

  const getTrafficColor = (level: string) => {
    switch (level) {
      case 'light': return 'text-green-600 bg-green-100';
      case 'moderate': return 'text-yellow-600 bg-yellow-100';
      case 'heavy': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return '☀️';
      case 'cloudy': return '☁️';
      case 'rainy': return '🌧️';
      case 'snowy': return '❄️';
      case 'windy': return '💨';
      default: return '🌤️';
    }
  };

  const getFeasibilityColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">🚦 Real-Time Conditions</h3>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">
            Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}
          </span>
          <button 
            onClick={refresh}
            disabled={loading}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Traffic Conditions */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Traffic</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTrafficColor(trafficImpact?.level || 'light')}`}>
              {trafficImpact?.level || 'Light'}
            </span>
          </div>
          <div className="text-xs text-gray-600">
            {trafficImpact?.delayMinutes ? `+${trafficImpact.delayMinutes} min delay` : 'No delays'}
          </div>
          {emissionIncrease > 0 && (
            <div className="text-xs text-red-600 mt-1">
              +{emissionIncrease}g CO₂ due to traffic
            </div>
          )}
        </div>

        {/* Weather Conditions */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Weather</span>
            <span className="text-lg">{getWeatherIcon(weather?.condition || 'sunny')}</span>
          </div>
          <div className="text-xs text-gray-600">
            {weather?.temperature}°C • {weather?.condition}
          </div>
          {weather?.precipitation && weather.precipitation > 0 && (
            <div className="text-xs text-blue-600 mt-1">
              {weather.precipitation.toFixed(1)}mm rain
            </div>
          )}
        </div>

        {/* Public Transport */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Public Transport</span>
            <span className="text-lg">🚌</span>
          </div>
          <div className="text-xs text-gray-600">
            Bus: {delays?.bus ? `+${delays.bus}min` : 'On time'}
          </div>
          <div className="text-xs text-gray-600">
            Train: {delays?.train ? `+${delays.train}min` : 'On time'}
          </div>
        </div>

        {/* Bike Share */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Bike Share</span>
            <span className="text-lg">🚲</span>
          </div>
          <div className="text-xs text-gray-600">
            {bikeShare?.availableBikes || 0} bikes available
          </div>
          <div className="text-xs text-gray-600">
            {bikeShare?.stationDistance ? `${(bikeShare.stationDistance * 1000).toFixed(0)}m away` : 'No nearby station'}
          </div>
        </div>
      </div>

      {/* Feasibility Recommendations */}
      <div className="border-t pt-4">
        <h4 className="font-semibold text-gray-900 mb-3">🎯 Current Recommendations</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🚶</span>
              <span className="font-medium text-gray-900">Walking</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFeasibilityColor(weather?.walkingFeasibility || 0)}`}>
                {walkingFeasible ? 'Good' : 'Poor'} conditions
              </span>
              <span className="text-sm text-gray-600">
                {weather?.walkingFeasibility || 0}/100
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🚴</span>
              <span className="font-medium text-gray-900">Cycling</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getFeasibilityColor(weather?.cyclingFeasibility || 0)}`}>
                {cyclingFeasible ? 'Good' : 'Poor'} conditions
              </span>
              <span className="text-sm text-gray-600">
                {weather?.cyclingFeasibility || 0}/100
              </span>
            </div>
          </div>
        </div>

        {/* Smart Recommendations */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <h5 className="font-medium text-blue-900 mb-2">💡 Smart Suggestions</h5>
          <div className="space-y-1 text-sm text-blue-800">
            {walkingFeasible && cyclingFeasible && (
              <p>• Perfect weather for active transportation! Consider walking or cycling.</p>
            )}
            {trafficImpact?.level === 'heavy' && (
              <p>• Heavy traffic detected. Public transport or cycling recommended.</p>
            )}
            {hasAvailableBikes && nearbyStation && (
              <p>• Bike share available nearby - great eco-friendly option!</p>
            )}
            {delays?.bus && delays.bus > 5 && (
              <p>• Bus delays reported. Consider alternative routes or modes.</p>
            )}
            {weather?.condition === 'rainy' && (
              <p>• Rainy conditions. Indoor transport options recommended.</p>
            )}
          </div>
        </div>
      </div>

      {/* Adjusted Emissions Display */}
      {baseEmissions > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-900">Adjusted CO₂ Emissions:</span>
            <div className="text-right">
              <span className="text-lg font-bold text-gray-900">{adjustedEmissions}g</span>
              {emissionIncrease > 0 && (
                <span className="text-sm text-red-600 ml-2">
                  (+{emissionIncrease}g from traffic)
                </span>
              )}
            </div>
          </div>
          <div className="text-xs text-gray-600 mt-1">
            Real-time conditions factored into emission calculations
          </div>
        </div>
      )}
    </div>
  );
}
