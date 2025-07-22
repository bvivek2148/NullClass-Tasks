'use client';

import { AlternativeRoute } from '@/lib/types';
import { RouteCard } from './RouteCard';

interface AlternativeRoutesProps {
  alternatives: AlternativeRoute[];
  onRouteSelect?: (route: AlternativeRoute) => void;
}

export function AlternativeRoutes({ alternatives, onRouteSelect }: AlternativeRoutesProps) {
  if (alternatives.length === 0) {
    return null;
  }

  const formatSavings = (savings: number): string => {
    if (savings === 0) return '0g';
    return savings > 0 ? `+${savings}g` : `${savings}g`;
  };

  const formatTime = (minutes: number): string => {
    if (minutes === 0) return 'Same time';
    if (minutes > 0) return `+${minutes}min`;
    return `${Math.abs(minutes)}min faster`;
  };

  const formatCost = (cost: number): string => {
    if (cost === 0) return 'Same cost';
    if (cost > 0) return `+₹${cost.toFixed(0)}`;
    return `Save ₹${Math.abs(cost).toFixed(0)}`;
  };

  const getFeasibilityColor = (score: number): string => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getFeasibilityText = (score: number): string => {
    if (score >= 80) return 'Highly Recommended';
    if (score >= 60) return 'Good Option';
    return 'Consider Conditions';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          🌱 Eco-Friendly Alternatives
        </h3>
        <div className="text-sm text-gray-500">
          Ranked by environmental impact and feasibility
        </div>
      </div>

      <div className="space-y-4">
        {alternatives.map((alternative, index) => (
          <div
            key={alternative.route.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              {/* Ranking Badge */}
              <div className="flex items-center space-x-3">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                  ${index === 0 ? 'bg-green-500 text-white' : 
                    index === 1 ? 'bg-blue-500 text-white' : 
                    'bg-gray-500 text-white'}
                `}>
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {alternative.route.transportationMode.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {alternative.route.transportationMode.description}
                  </p>
                </div>
              </div>

              {/* Feasibility Score */}
              <div className="text-right">
                <div className={`
                  px-3 py-1 rounded-full text-xs font-medium
                  ${getFeasibilityColor(alternative.feasibilityScore)}
                `}>
                  {getFeasibilityText(alternative.feasibilityScore)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {alternative.feasibilityScore}/100 feasibility
                </div>
              </div>
            </div>

            {/* Route Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-900">
                  {alternative.route.distance.toFixed(1)}km
                </div>
                <div className="text-xs text-gray-600">Distance</div>
              </div>

              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-900">
                  {Math.round(alternative.route.duration)}min
                </div>
                <div className="text-xs text-gray-600">Duration</div>
              </div>

              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-900">
                  {alternative.route.carbonEmission}g
                </div>
                <div className="text-xs text-gray-600">CO₂ Emissions</div>
              </div>

              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-900">
                  ₹{(alternative.route.cost || 0).toFixed(0)}
                </div>
                <div className="text-xs text-gray-600">Cost</div>
              </div>
            </div>

            {/* Savings Comparison */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                <div className={`text-lg font-bold ${
                  alternative.savings.co2 > 0 ? 'text-green-600' : 'text-gray-600'
                }`}>
                  {formatSavings(alternative.savings.co2)}
                </div>
                <div className="text-xs text-gray-600">CO₂ Saved</div>
              </div>

              <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className={`text-lg font-bold ${
                  alternative.savings.time <= 0 ? 'text-blue-600' : 'text-red-600'
                }`}>
                  {formatTime(alternative.savings.time)}
                </div>
                <div className="text-xs text-gray-600">Time Difference</div>
              </div>

              <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className={`text-lg font-bold ${
                  alternative.savings.cost >= 0 ? 'text-purple-600' : 'text-red-600'
                }`}>
                  {formatCost(alternative.savings.cost)}
                </div>
                <div className="text-xs text-gray-600">Cost Difference</div>
              </div>
            </div>

            {/* Real-time Data */}
            {alternative.realTimeData && (
              <div className="border-t pt-3">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Real-time Information:</h5>
                <div className="flex flex-wrap gap-2 text-xs">
                  {alternative.realTimeData.publicTransportDelay !== undefined && (
                    <span className={`px-2 py-1 rounded-full ${
                      alternative.realTimeData.publicTransportDelay === 0 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {alternative.realTimeData.publicTransportDelay === 0 
                        ? '✅ On time' 
                        : `⏰ ${alternative.realTimeData.publicTransportDelay}min delay`}
                    </span>
                  )}
                  
                  {alternative.realTimeData.bikeShareAvailability !== undefined && (
                    <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                      🚲 {alternative.realTimeData.bikeShareAvailability} bikes available
                    </span>
                  )}
                  
                  {alternative.realTimeData.trafficConditions && (
                    <span className={`px-2 py-1 rounded-full ${
                      alternative.realTimeData.trafficConditions === 'light' 
                        ? 'bg-green-100 text-green-700'
                        : alternative.realTimeData.trafficConditions === 'moderate'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      🚦 {alternative.realTimeData.trafficConditions} traffic
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="mt-4 pt-3 border-t">
              <button
                onClick={() => {
                  if (onRouteSelect) {
                    onRouteSelect(alternative);
                  } else {
                    // Default action - show success message
                    alert(`🎉 Great choice! You selected ${alternative.route.transportationMode.name} and will save ${alternative.savings.co2}g of CO₂!`);
                  }
                }}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Choose This Route
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">💡 Why Choose Eco-Friendly?</h4>
        <div className="text-sm text-gray-700 space-y-1">
          <p>• Reduce your carbon footprint and help fight climate change</p>
          <p>• Often more cost-effective than private vehicle use</p>
          <p>• Improve air quality in your community</p>
          <p>• Get exercise and improve your health with active transport</p>
        </div>
      </div>
    </div>
  );
}
