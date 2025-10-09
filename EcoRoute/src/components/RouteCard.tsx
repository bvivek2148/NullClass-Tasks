'use client';

import { Route } from '@/lib/types';
import { emissionCalculator } from '@/lib/emissions';

interface RouteCardProps {
  route: Route;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function RouteCard({ route, isSelected = false, onSelect }: RouteCardProps) {
  const { transportationMode, distance, duration, carbonEmission, cost } = route;
  
  // Calculate environmental impact
  const impact = emissionCalculator.calculateEnvironmentalImpact(carbonEmission);
  
  // Get color scheme based on emission category
  const getColorScheme = () => {
    switch (transportationMode.category) {
      case 'low':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-700',
          icon: 'text-green-600',
          badge: 'bg-green-100 text-green-800'
        };
      case 'medium':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-700',
          icon: 'text-yellow-600',
          badge: 'bg-yellow-100 text-yellow-800'
        };
      case 'high':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-700',
          icon: 'text-red-600',
          badge: 'bg-red-100 text-red-800'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-700',
          icon: 'text-gray-600',
          badge: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const colors = getColorScheme();
  
  const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  };

  const formatCost = (cost?: number): string => {
    if (!cost || cost === 0) return 'Free';
    return `₹${cost.toFixed(0)}`;
  };

  return (
    <div
      className={`
        relative rounded-lg border-2 p-4 cursor-pointer transition-all duration-200 hover:shadow-md
        ${isSelected ? 'ring-2 ring-green-500 ring-offset-2' : ''}
        ${colors.bg} ${colors.border}
      `}
      onClick={onSelect}
    >
      {/* Transportation Mode Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className={`text-2xl ${colors.icon}`}>
            {transportationMode.icon}
          </span>
          <div>
            <h4 className={`font-semibold ${colors.text}`}>
              {transportationMode.name}
            </h4>
            <p className="text-xs text-gray-500">
              {transportationMode.description}
            </p>
          </div>
        </div>
        
        {/* Emission Category Badge */}
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors.badge}`}>
          {transportationMode.category.toUpperCase()}
        </span>
      </div>

      {/* Route Details */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Distance:</span>
          <span className="font-medium">{distance.toFixed(1)} km</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Duration:</span>
          <span className="font-medium">{formatDuration(duration)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Cost:</span>
          <span className="font-medium">{formatCost(cost)}</span>
        </div>
      </div>

      {/* Carbon Emissions */}
      <div className="border-t pt-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">CO₂ Emissions:</span>
          <span className={`font-bold text-lg ${colors.text}`}>
            {carbonEmission}g
          </span>
        </div>
        
        {/* Environmental Impact Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              transportationMode.category === 'low' ? 'bg-green-500' :
              transportationMode.category === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{
              width: `${Math.min((carbonEmission / 300) * 100, 100)}%`
            }}
          ></div>
        </div>
        
        {/* Impact Description */}
        <p className="text-xs text-gray-500 mb-2">
          {impact.description}
        </p>
        
        {/* Environmental Equivalents */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center space-x-1">
            <span>🌳</span>
            <span>{impact.equivalents.treesNeeded.toFixed(2)} trees/year</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>📱</span>
            <span>{impact.equivalents.phoneCharges} charges</span>
          </div>
        </div>
      </div>

      {/* Zero Emission Badge */}
      {carbonEmission === 0 && (
        <div className="absolute -top-2 -right-2">
          <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
            ZERO EMISSION
          </div>
        </div>
      )}

      {/* Best Option Badge */}
      {transportationMode.category === 'low' && carbonEmission < 50 && (
        <div className="absolute -top-2 -left-2">
          <div className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
            ECO CHOICE
          </div>
        </div>
      )}
    </div>
  );
}
