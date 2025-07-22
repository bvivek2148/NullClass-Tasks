'use client';

import { emissionCalculator } from '@/lib/emissions';

interface EnvironmentalImpactProps {
  co2Emissions: number;
  potentialSavings?: number;
}

export function EnvironmentalImpact({ co2Emissions, potentialSavings = 0 }: EnvironmentalImpactProps) {
  const impact = emissionCalculator.calculateEnvironmentalImpact(co2Emissions);
  const savingsImpact = potentialSavings > 0 
    ? emissionCalculator.calculateEnvironmentalImpact(potentialSavings)
    : null;

  const getImpactLevel = (emissions: number): { level: string; color: string; description: string } => {
    if (emissions === 0) {
      return {
        level: 'Zero Impact',
        color: 'text-green-600 bg-green-100',
        description: 'Perfect! No carbon emissions from this trip.'
      };
    } else if (emissions < 100) {
      return {
        level: 'Very Low',
        color: 'text-green-600 bg-green-100',
        description: 'Excellent choice! Minimal environmental impact.'
      };
    } else if (emissions < 500) {
      return {
        level: 'Low',
        color: 'text-blue-600 bg-blue-100',
        description: 'Good choice! Low environmental impact.'
      };
    } else if (emissions < 1000) {
      return {
        level: 'Moderate',
        color: 'text-yellow-600 bg-yellow-100',
        description: 'Consider greener alternatives to reduce impact.'
      };
    } else if (emissions < 2000) {
      return {
        level: 'High',
        color: 'text-orange-600 bg-orange-100',
        description: 'High impact. Eco-friendly options could save significant CO₂.'
      };
    } else {
      return {
        level: 'Very High',
        color: 'text-red-600 bg-red-100',
        description: 'Very high impact. Please consider sustainable alternatives.'
      };
    }
  };

  const impactLevel = getImpactLevel(co2Emissions);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">🌍 Environmental Impact Analysis</h3>
      
      {/* Impact Level */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">Impact Level:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${impactLevel.color}`}>
            {impactLevel.level}
          </span>
        </div>
        <p className="text-sm text-gray-600">{impactLevel.description}</p>
      </div>

      {/* CO2 Emissions Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Your Trip Emissions</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Total CO₂:</span>
              <span className="font-bold text-lg text-gray-900">{co2Emissions}g</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Per kilometer:</span>
              <span className="font-medium text-gray-900">
                {impact.co2InGrams > 0 ? Math.round(co2Emissions / (impact.co2InGrams / 1000)) : 0}g/km
              </span>
            </div>
          </div>
        </div>

        {savingsImpact && (
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Potential Savings</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                <span className="text-sm text-green-700">CO₂ Saved:</span>
                <span className="font-bold text-lg text-green-700">{potentialSavings}g</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                <span className="text-sm text-green-700">Reduction:</span>
                <span className="font-medium text-green-700">
                  {Math.round((potentialSavings / (co2Emissions + potentialSavings)) * 100)}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Environmental Equivalents */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">What This Means</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-2xl mb-2">🌳</div>
            <div className="font-bold text-green-700">{impact.equivalents.treesNeeded.toFixed(2)}</div>
            <div className="text-xs text-gray-600">trees needed for 1 year to offset</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-2xl mb-2">🚗</div>
            <div className="font-bold text-blue-700">{impact.equivalents.carMilesDriven.toFixed(1)}</div>
            <div className="text-xs text-gray-600">miles driven by average car</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-2xl mb-2">📱</div>
            <div className="font-bold text-purple-700">{impact.equivalents.phoneCharges}</div>
            <div className="text-xs text-gray-600">smartphone charges</div>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="text-2xl mb-2">💡</div>
            <div className="font-bold text-yellow-700">{impact.equivalents.lightBulbHours}</div>
            <div className="text-xs text-gray-600">hours of LED light</div>
          </div>
        </div>
      </div>

      {/* Savings Equivalents */}
      {savingsImpact && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">By Choosing Eco-Friendly, You Save</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-100 rounded-lg border border-green-300">
              <div className="text-2xl mb-2">🌱</div>
              <div className="font-bold text-green-800">{savingsImpact.equivalents.treesNeeded.toFixed(2)}</div>
              <div className="text-xs text-gray-600">trees worth of CO₂</div>
            </div>
            
            <div className="text-center p-4 bg-green-100 rounded-lg border border-green-300">
              <div className="text-2xl mb-2">⛽</div>
              <div className="font-bold text-green-800">{savingsImpact.equivalents.carMilesDriven.toFixed(1)}</div>
              <div className="text-xs text-gray-600">car miles avoided</div>
            </div>
            
            <div className="text-center p-4 bg-green-100 rounded-lg border border-green-300">
              <div className="text-2xl mb-2">🔋</div>
              <div className="font-bold text-green-800">{savingsImpact.equivalents.phoneCharges}</div>
              <div className="text-xs text-gray-600">phone charges saved</div>
            </div>
            
            <div className="text-center p-4 bg-green-100 rounded-lg border border-green-300">
              <div className="text-2xl mb-2">🌍</div>
              <div className="font-bold text-green-800">
                {Math.round((potentialSavings / (co2Emissions + potentialSavings)) * 100)}%
              </div>
              <div className="text-xs text-gray-600">emission reduction</div>
            </div>
          </div>
        </div>
      )}

      {/* Action Items */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">🎯 Take Action</h4>
        <div className="space-y-2 text-sm text-gray-700">
          {co2Emissions === 0 ? (
            <p className="text-green-700 font-medium">
              ✅ Perfect! You're already making the most eco-friendly choice.
            </p>
          ) : (
            <>
              {co2Emissions > 500 && (
                <p>• Consider public transport, cycling, or walking for shorter trips</p>
              )}
              {co2Emissions > 1000 && (
                <p>• Look into carpooling or ride-sharing to split emissions</p>
              )}
              {co2Emissions > 100 && (
                <p>• Plan multiple errands in one trip to maximize efficiency</p>
              )}
              <p>• Offset your emissions by supporting verified carbon offset projects</p>
              <p>• Track your progress and set monthly carbon reduction goals</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
