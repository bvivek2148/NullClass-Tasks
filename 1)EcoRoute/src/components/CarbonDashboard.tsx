'use client';

import { useState, useEffect } from 'react';
import { CarbonFootprintSummary, TripRecord } from '@/lib/types';

// Mock data - in production, this would come from your database
const mockTripData: TripRecord[] = [
  // This would be populated with real user data
];

const mockSummaryData: CarbonFootprintSummary = {
  period: 'monthly',
  totalEmissions: 2450,
  totalSavings: 1200,
  averagePerTrip: 180,
  comparisonToPrevious: -15,
  breakdown: [
    { transportMode: 'Walking', emissions: 0, percentage: 0 },
    { transportMode: 'Cycling', emissions: 0, percentage: 0 },
    { transportMode: 'Public Bus', emissions: 850, percentage: 35 },
    { transportMode: 'Train', emissions: 320, percentage: 13 },
    { transportMode: 'Electric Car', emissions: 600, percentage: 24 },
    { transportMode: 'Gasoline Car', emissions: 680, percentage: 28 }
  ]
};

export function CarbonDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [summary, setSummary] = useState<CarbonFootprintSummary>(mockSummaryData);

  const formatEmissions = (grams: number): string => {
    if (grams >= 1000) {
      return `${(grams / 1000).toFixed(1)}kg`;
    }
    return `${grams}g`;
  };

  const getEmissionColor = (percentage: number): string => {
    if (percentage === 0) return 'bg-green-500';
    if (percentage < 20) return 'bg-blue-500';
    if (percentage < 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getComparisonIcon = (comparison: number): string => {
    if (comparison < 0) return '📉'; // Improvement
    if (comparison > 0) return '📈'; // Increase
    return '➡️'; // No change
  };

  const getComparisonText = (comparison: number): string => {
    if (comparison < 0) return `${Math.abs(comparison)}% reduction`;
    if (comparison > 0) return `${comparison}% increase`;
    return 'No change';
  };

  const getComparisonColor = (comparison: number): string => {
    if (comparison < 0) return 'text-green-600';
    if (comparison > 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Carbon Footprint Overview</h3>
          <div className="flex space-x-2">
            {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  selectedPeriod === period
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">
              {formatEmissions(summary.totalEmissions)}
            </div>
            <div className="text-sm text-gray-600">Total Emissions</div>
            <div className={`text-xs mt-1 ${getComparisonColor(summary.comparisonToPrevious)}`}>
              {getComparisonIcon(summary.comparisonToPrevious)} {getComparisonText(summary.comparisonToPrevious)}
            </div>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600">
              {formatEmissions(summary.totalSavings)}
            </div>
            <div className="text-sm text-gray-600">CO₂ Saved</div>
            <div className="text-xs text-green-600 mt-1">
              🌱 Great progress!
            </div>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-600">
              {formatEmissions(summary.averagePerTrip)}
            </div>
            <div className="text-sm text-gray-600">Average per Trip</div>
            <div className="text-xs text-gray-500 mt-1">
              📊 Per journey
            </div>
          </div>

          <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600">
              {summary.breakdown.filter(b => b.emissions === 0).length}
            </div>
            <div className="text-sm text-gray-600">Zero Emission Modes</div>
            <div className="text-xs text-gray-500 mt-1">
              🚶 🚴 Used
            </div>
          </div>
        </div>
      </div>

      {/* Transportation Mode Breakdown */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Transportation Mode Breakdown</h3>
        
        <div className="space-y-4">
          {summary.breakdown.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-4 h-4 rounded-full" style={{
                  backgroundColor: item.percentage === 0 ? '#10b981' : 
                                  item.percentage < 20 ? '#3b82f6' :
                                  item.percentage < 40 ? '#f59e0b' : '#ef4444'
                }}></div>
                <span className="font-medium text-gray-900">{item.transportMode}</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {formatEmissions(item.emissions)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {item.percentage}%
                  </div>
                </div>
                
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getEmissionColor(item.percentage)}`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Goals and Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Monthly Goals</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">CO₂ Reduction Target</span>
                <span className="text-sm text-gray-600">1500g / 2000g</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-green-500 h-3 rounded-full transition-all duration-300" style={{ width: '75%' }}></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">75% complete - You're doing great!</div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Eco-Friendly Trips</span>
                <span className="text-sm text-gray-600">18 / 25</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-blue-500 h-3 rounded-full transition-all duration-300" style={{ width: '72%' }}></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">7 more trips to reach your goal</div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Zero Emission Days</span>
                <span className="text-sm text-gray-600">8 / 10</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-purple-500 h-3 rounded-full transition-all duration-300" style={{ width: '80%' }}></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">2 more days to unlock achievement</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Environmental Impact</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-green-600">🌳</span>
                <span className="text-sm font-medium text-gray-700">Trees Equivalent</span>
              </div>
              <span className="font-bold text-green-600">2.3 trees/year</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-blue-600">🚗</span>
                <span className="text-sm font-medium text-gray-700">Car Miles Avoided</span>
              </div>
              <span className="font-bold text-blue-600">45.2 miles</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-purple-600">⚡</span>
                <span className="text-sm font-medium text-gray-700">Energy Saved</span>
              </div>
              <span className="font-bold text-purple-600">1,200 charges</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-yellow-600">🏆</span>
                <span className="text-sm font-medium text-gray-700">Rank This Month</span>
              </div>
              <span className="font-bold text-yellow-600">#23 of 1,247</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
        
        <div className="space-y-3">
          {[
            { date: '2024-07-12', from: 'Home', to: 'Office', mode: 'Cycling', saved: 180, icon: '🚴' },
            { date: '2024-07-11', from: 'Office', to: 'Grocery Store', mode: 'Walking', saved: 220, icon: '🚶' },
            { date: '2024-07-11', from: 'Home', to: 'Office', mode: 'Public Bus', saved: 95, icon: '🚌' },
            { date: '2024-07-10', from: 'Home', to: 'Airport', mode: 'Train', saved: 340, icon: '🚊' },
          ].map((trip, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <span className="text-xl">{trip.icon}</span>
                <div>
                  <div className="font-medium text-gray-900">{trip.from} → {trip.to}</div>
                  <div className="text-sm text-gray-600">{trip.mode} • {trip.date}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-green-600">+{trip.saved}g saved</div>
                <div className="text-xs text-gray-500">CO₂ reduction</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
