'use client';

import React from 'react';
import { VirtualTourViewpoint } from '@/lib/types';
import { Navigation, MapPin, Users, Car, Wifi } from 'lucide-react';

interface ViewpointNavigationProps {
  viewpoints: VirtualTourViewpoint[];
  currentViewpoint: VirtualTourViewpoint;
  onViewpointChange: (viewpointId: string) => void;
  className?: string;
}

const getViewpointIcon = (viewpointName: string) => {
  const name = viewpointName.toLowerCase();
  if (name.includes('driver') || name.includes('front')) return Car;
  if (name.includes('middle') || name.includes('center')) return Users;
  if (name.includes('back') || name.includes('rear')) return Wifi;
  return MapPin;
};

export const ViewpointNavigation: React.FC<ViewpointNavigationProps> = ({
  viewpoints,
  currentViewpoint,
  onViewpointChange,
  className = '',
}) => {
  return (
    <div className={`viewpoint-navigation ${className}`}>
      {/* Desktop Navigation - Horizontal */}
      <div className="hidden md:flex bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-lg p-2 space-x-2">
        {viewpoints.map((viewpoint) => {
          const Icon = getViewpointIcon(viewpoint.name);
          const isActive = currentViewpoint.id === viewpoint.id;
          
          return (
            <button
              key={viewpoint.id}
              onClick={() => onViewpointChange(viewpoint.id)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
              title={viewpoint.description}
            >
              <Icon size={18} />
              <span className="font-medium text-sm">{viewpoint.name}</span>
            </button>
          );
        })}
      </div>

      {/* Mobile Navigation - Vertical */}
      <div className="md:hidden bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-lg p-2 space-y-2">
        {viewpoints.map((viewpoint) => {
          const Icon = getViewpointIcon(viewpoint.name);
          const isActive = currentViewpoint.id === viewpoint.id;
          
          return (
            <button
              key={viewpoint.id}
              onClick={() => onViewpointChange(viewpoint.id)}
              className={`
                w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-all duration-200 text-left
                ${isActive 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
            >
              <Icon size={20} />
              <div>
                <div className="font-medium text-sm">{viewpoint.name}</div>
                <div className={`text-xs ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                  {viewpoint.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Navigation Dots */}
      <div className="flex justify-center mt-4 space-x-2">
        {viewpoints.map((viewpoint, index) => (
          <button
            key={viewpoint.id}
            onClick={() => onViewpointChange(viewpoint.id)}
            className={`
              w-3 h-3 rounded-full transition-all duration-200
              ${currentViewpoint.id === viewpoint.id 
                ? 'bg-blue-600 scale-125' 
                : 'bg-gray-300 hover:bg-gray-400'
              }
            `}
            title={viewpoint.name}
          />
        ))}
      </div>
    </div>
  );
};
