'use client';

import React from 'react';
import { VirtualTourViewpoint } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ViewpointNavigationProps {
  viewpoints: VirtualTourViewpoint[];
  currentViewpoint: VirtualTourViewpoint;
  onViewpointChange: (viewpoint: VirtualTourViewpoint) => void;
  orientation?: 'horizontal' | 'vertical';
  showThumbnails?: boolean;
  className?: string;
}

// Helper function to get appropriate icon for viewpoint
const getViewpointIcon = (position: string) => {
  switch (position.toLowerCase()) {
    case 'front':
      return '🚌'; // Bus front
    case 'middle':
      return '🪑'; // Seats
    case 'rear':
      return '🚪'; // Door/Exit
    default:
      return '📍'; // Default location pin
  }
};

export const ViewpointNavigation: React.FC<ViewpointNavigationProps> = ({
  viewpoints,
  currentViewpoint,
  onViewpointChange,
  orientation = 'horizontal',
  showThumbnails = true,
  className = '',
}) => {
  const currentIndex = viewpoints.findIndex(v => v.id === currentViewpoint.id);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onViewpointChange(viewpoints[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < viewpoints.length - 1) {
      onViewpointChange(viewpoints[currentIndex + 1]);
    }
  };

  const getViewpointIcon = (position: string) => {
    switch (position) {
      case 'front':
        return '🚌';
      case 'middle':
        return '🪑';
      case 'back':
        return '🚪';
      case 'driver':
        return '👨‍✈️';
      case 'entrance':
        return '🚪';
      case 'exit':
        return '🚪';
      default:
        return '📍';
    }
  };

  if (orientation === 'vertical') {
    return (
      <div className={`flex flex-col space-y-2 ${className}`}>
        {/* Compact Vertical Navigation */}
        <div className="bg-slate-800 bg-opacity-95 backdrop-blur-sm rounded-xl p-3 border border-slate-600 shadow-xl max-w-xs">
          {/* Header */}
          <div className="text-center mb-3">
            <h3 className="text-xs font-bold text-white mb-1">Bus Sections</h3>
            <div className="w-12 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto"></div>
          </div>

          {/* Viewpoint Cards */}
          <div className="space-y-2">
            {viewpoints.map((viewpoint, index) => (
              <button
                key={viewpoint.id}
                onClick={() => onViewpointChange(viewpoint)}
                className={`
                  w-full p-2 rounded-lg transition-all duration-300 group relative overflow-hidden
                  ${currentViewpoint.id === viewpoint.id
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/30 scale-105'
                    : 'bg-slate-700 bg-opacity-50 text-gray-300 hover:bg-slate-600 hover:text-white hover:scale-102'
                  }
                `}
                aria-label={`Go to ${viewpoint.name}`}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="w-full h-full bg-gradient-to-br from-white to-transparent"></div>
                </div>

                {/* Content */}
                <div className="relative flex flex-col items-center space-y-1">
                  {/* Icon */}
                  <div className={`text-lg transition-transform duration-300 ${
                    currentViewpoint.id === viewpoint.id ? 'scale-110' : 'group-hover:scale-105'
                  }`}>
                    {getViewpointIcon(viewpoint.position)}
                  </div>

                  {/* Name */}
                  <span className="text-xs font-medium text-center leading-tight">
                    {viewpoint.name}
                  </span>

                  {/* Position Indicator */}
                  <div className={`text-xs opacity-60 ${
                    currentViewpoint.id === viewpoint.id ? 'text-blue-100' : 'text-gray-400'
                  }`}>
                    {index + 1} of {viewpoints.length}
                  </div>

                  {/* Active Indicator */}
                  {currentViewpoint.id === viewpoint.id && (
                    <div className="absolute -right-1 -top-1 w-2 h-2 bg-green-400 rounded-full border border-white animate-pulse"></div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex justify-between mt-4 pt-3 border-t border-slate-600">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-slate-700 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-600 transition-all text-xs"
              aria-label="Previous viewpoint"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev</span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === viewpoints.length - 1}
              className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-slate-700 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-600 transition-all text-xs"
              aria-label="Next viewpoint"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-4 ${className}`}>
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        disabled={currentIndex === 0}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
        aria-label="Previous viewpoint"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Previous</span>
      </button>

      {/* Viewpoint List */}
      <div className="flex-1 flex items-center justify-center space-x-2 overflow-x-auto">
        {viewpoints.map((viewpoint) => (
          <button
            key={viewpoint.id}
            onClick={() => onViewpointChange(viewpoint)}
            className={`
              flex flex-col items-center space-y-1 p-3 rounded-lg transition-all min-w-0 flex-shrink-0
              ${currentViewpoint.id === viewpoint.id
                ? 'bg-blue-100 border-2 border-blue-500 text-blue-700'
                : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
              }
            `}
            aria-label={`Go to ${viewpoint.name}`}
          >
            {/* Viewpoint Icon/Thumbnail */}
            {showThumbnails && viewpoint.thumbnailUrl ? (
              <div className="w-12 h-8 rounded overflow-hidden">
                <img
                  src={viewpoint.thumbnailUrl}
                  alt={viewpoint.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="text-2xl">
                {getViewpointIcon(viewpoint.position)}
              </div>
            )}

            {/* Viewpoint Name */}
            <span className="text-xs font-medium text-center truncate max-w-16">
              {viewpoint.name}
            </span>

            {/* Current Indicator */}
            {currentViewpoint.id === viewpoint.id && (
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentIndex === viewpoints.length - 1}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
        aria-label="Next viewpoint"
      >
        <span className="text-sm font-medium">Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Quick Navigation Info */}
      <div className="text-xs text-gray-500 ml-4">
        {currentIndex + 1} of {viewpoints.length}
      </div>
    </div>
  );
};