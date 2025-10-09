'use client';

import React from 'react';

interface Seat3DProps {
  seatId: string;
  isSelected: boolean;
  isOccupied: boolean;
  onClick: () => void;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  type?: 'window' | 'aisle' | 'middle';
}

export const Seat3D: React.FC<Seat3DProps> = ({
  seatId,
  isSelected,
  isOccupied,
  onClick,
  className = '',
  size = 'medium',
  type = 'aisle'
}) => {
  // Size configurations
  const sizeConfig = {
    small: { width: 'w-12', height: 'h-14', text: 'text-xs' },
    medium: { width: 'w-14', height: 'h-16', text: 'text-sm' },
    large: { width: 'w-16', height: 'h-18', text: 'text-base' }
  };

  const config = sizeConfig[size];

  // Get seat colors based on state
  const getSeatColors = () => {
    if (isOccupied) {
      return {
        base: 'from-red-400 to-red-600',
        shadow: 'shadow-red-500/30',
        border: 'border-red-300',
        backrest: 'from-red-500 to-red-700',
        cushion: 'from-red-300 to-red-500',
        armrest: 'from-red-600 to-red-800'
      };
    } else if (isSelected) {
      return {
        base: 'from-emerald-400 to-emerald-600',
        shadow: 'shadow-emerald-500/40',
        border: 'border-emerald-300',
        backrest: 'from-emerald-500 to-emerald-700',
        cushion: 'from-emerald-300 to-emerald-500',
        armrest: 'from-emerald-600 to-emerald-800'
      };
    } else {
      return {
        base: 'from-blue-400 to-blue-600',
        shadow: 'shadow-blue-500/30',
        border: 'border-blue-300',
        backrest: 'from-blue-500 to-blue-700',
        cushion: 'from-blue-300 to-blue-500',
        armrest: 'from-blue-600 to-blue-800'
      };
    }
  };

  const colors = getSeatColors();

  return (
    <button
      onClick={onClick}
      disabled={isOccupied}
      className={`
        ${config.width} ${config.height} relative transition-all duration-300
        transform-gpu perspective-1000 group
        ${isOccupied ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-105 hover:-translate-y-1'}
        ${isSelected ? 'animate-seat-float' : ''}
        ${className}
      `}
      aria-label={`Seat ${seatId} ${isOccupied ? '(Occupied)' : isSelected ? '(Selected)' : '(Available)'}`}
    >
      {/* 3D Seat Container */}
      <div className={`
        relative w-full h-full transform-gpu transition-all duration-300
        ${!isOccupied ? 'group-hover:rotateX-5 group-hover:rotateY-2' : ''}
      `}>
        
        {/* Seat Shadow */}
        <div className={`
          absolute -bottom-1 left-1/2 transform -translate-x-1/2
          w-10 h-3 bg-black opacity-20 rounded-full blur-sm
          transition-all duration-300
          ${!isOccupied ? 'group-hover:w-12 group-hover:opacity-30' : ''}
        `} />

        {/* Main Seat Body */}
        <div className={`
          relative w-full h-full rounded-xl border-2 ${colors.border}
          bg-gradient-to-br ${colors.base} ${colors.shadow} shadow-lg
          transform-gpu transition-all duration-300
          overflow-hidden
        `}>
          
          {/* Seat Backrest (3D effect) */}
          <div className={`
            absolute top-0 left-0 right-0 h-3/5
            bg-gradient-to-b ${colors.backrest}
            rounded-t-xl border-b border-white/20
            transform-gpu
          `}>
            {/* Backrest highlight */}
            <div className="absolute top-1 left-1 right-1 h-2 bg-white/30 rounded-t-lg" />
            
            {/* Headrest */}
            <div className={`
              absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1
              w-8 h-3 bg-gradient-to-b ${colors.backrest}
              rounded-t-full border border-white/20
            `} />
          </div>

          {/* Seat Cushion (3D effect) */}
          <div className={`
            absolute bottom-0 left-0 right-0 h-2/5
            bg-gradient-to-t ${colors.cushion}
            rounded-b-xl border-t border-white/20
            transform-gpu
          `}>
            {/* Cushion highlight */}
            <div className="absolute bottom-1 left-1 right-1 h-1 bg-white/20 rounded-b-lg" />
          </div>

          {/* Left Armrest */}
          <div className={`
            absolute left-0 top-1/3 bottom-1/4
            w-1 bg-gradient-to-b ${colors.armrest}
            rounded-l-sm transform-gpu
            shadow-inner
          `} />

          {/* Right Armrest */}
          <div className={`
            absolute right-0 top-1/3 bottom-1/4
            w-1 bg-gradient-to-b ${colors.armrest}
            rounded-r-sm transform-gpu
            shadow-inner
          `} />

          {/* Seat Number */}
          <div className={`
            absolute inset-0 flex items-center justify-center
            ${config.text} font-bold text-white
            drop-shadow-lg z-10
            transition-all duration-300
            ${!isOccupied ? 'group-hover:scale-110' : ''}
          `}>
            {seatId}
          </div>

          {/* 3D Lighting Effects */}
          <div className="absolute inset-0 rounded-xl">
            {/* Top light */}
            <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/40 to-transparent rounded-t-xl" />

            {/* Side light */}
            <div className="absolute top-0 left-0 bottom-0 w-1/3 bg-gradient-to-r from-white/25 to-transparent rounded-l-xl" />

            {/* Bottom shadow */}
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent rounded-b-xl" />

            {/* Right shadow for depth */}
            <div className="absolute top-0 right-0 bottom-0 w-1/4 bg-gradient-to-l from-black/15 to-transparent rounded-r-xl" />
          </div>

          {/* Selection Glow Effect */}
          {isSelected && (
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-xl opacity-50 blur-sm animate-pulse" />
          )}

          {/* Occupied Pattern */}
          {isOccupied && (
            <div className="absolute inset-0 bg-red-900/20 rounded-xl">
              <div className="absolute inset-2 border-2 border-red-300/50 rounded-lg border-dashed" />
            </div>
          )}

          {/* Hover Glow */}
          {!isOccupied && (
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-30" />
          )}
        </div>

        {/* Seat Type Indicator */}
        {type === 'window' && (
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-sky-400 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
            <span className="text-xs">🪟</span>
          </div>
        )}
      </div>
    </button>
  );
};
