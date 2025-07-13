'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { BusLayout, Seat, SeatType } from '@/lib/types';
import {
  User,
  UserX,
  UserCheck,
  Accessibility,
  Wifi,
  Zap,
  Coffee,
  MapPin,
  Info,
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye
} from 'lucide-react';

interface InteractiveSeatingMapProps {
  layout: BusLayout;
  selectedSeats: string[];
  onSeatSelect: (seatId: string) => void;
  onSeatDeselect: (seatId: string) => void;
  onSeatHover?: (seat: Seat | null) => void;
  maxSelectableSeats?: number;
  className?: string;
  showLegend?: boolean;
  compactMode?: boolean;
  realTimeUpdates?: boolean;
  highlightedSeats?: string[]; // Seats to highlight (e.g., from virtual tour)
  showPricing?: boolean;
  showRecommendations?: boolean;
  onSeatFocus?: (seat: Seat | null) => void;
  ariaLabel?: string;
}

export const InteractiveSeatingMap: React.FC<InteractiveSeatingMapProps> = ({
  layout,
  selectedSeats,
  onSeatSelect,
  onSeatDeselect,
  onSeatHover,
  maxSelectableSeats = 4,
  className = '',
  showLegend = true,
  compactMode = false,
  realTimeUpdates = false,
  highlightedSeats = [],
  showPricing = true,
  showRecommendations = false,
  onSeatFocus,
  ariaLabel = 'Interactive bus seating map',
}) => {
  const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null);
  const [focusedSeat, setFocusedSeat] = useState<Seat | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [seatUpdates, setSeatUpdates] = useState<Map<string, { status: Seat['status'], timestamp: number }>>(new Map());
  const [recommendations, setRecommendations] = useState<string[]>([]);

  // Real-time seat status updates simulation
  useEffect(() => {
    if (!realTimeUpdates) return;

    const interval = setInterval(() => {
      // Simulate random seat status changes
      const availableSeats = layout.seats.filter(seat => seat.status === 'available');
      if (availableSeats.length > 0 && Math.random() < 0.1) {
        const randomSeat = availableSeats[Math.floor(Math.random() * availableSeats.length)];
        setSeatUpdates(prev => new Map(prev).set(randomSeat.id, {
          status: Math.random() < 0.7 ? 'occupied' : 'reserved',
          timestamp: Date.now()
        }));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [layout.seats, realTimeUpdates]);

  // Generate seat recommendations based on user preferences
  useEffect(() => {
    if (!showRecommendations) return;

    const windowSeats = layout.seats.filter(seat =>
      seat.position === 'window' &&
      seat.status === 'available' &&
      !selectedSeats.includes(seat.id)
    );

    const premiumSeats = layout.seats.filter(seat =>
      seat.type.id === 'premium' &&
      seat.status === 'available' &&
      !selectedSeats.includes(seat.id)
    );

    const recommended = [...windowSeats.slice(0, 2), ...premiumSeats.slice(0, 2)]
      .map(seat => seat.id)
      .slice(0, 3);

    setRecommendations(recommended);
  }, [layout.seats, selectedSeats, showRecommendations]);

  // Organize seats by row for rendering
  const seatsByRow = useMemo(() => {
    const rows: { [row: number]: Seat[] } = {};
    layout.seats.forEach(seat => {
      if (!rows[seat.row]) {
        rows[seat.row] = [];
      }
      rows[seat.row].push(seat);
    });
    
    // Sort seats within each row by column
    Object.keys(rows).forEach(rowKey => {
      rows[parseInt(rowKey)].sort((a, b) => a.column.localeCompare(b.column));
    });
    
    return rows;
  }, [layout.seats]);

  const getSeatIcon = (seat: Seat) => {
    if (seat.status === 'available') return User;
    if (seat.status === 'occupied') return UserX;
    if (seat.status === 'selected' || selectedSeats.includes(seat.id)) return UserCheck;
    if (seat.status === 'disabled') return UserX;
    return User;
  };

  const getSeatColor = (seat: Seat) => {
    if (selectedSeats.includes(seat.id)) return 'bg-blue-600 text-white border-blue-700';
    if (seat.status === 'available') return 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200';
    if (seat.status === 'occupied') return 'bg-red-100 text-red-800 border-red-300';
    if (seat.status === 'disabled') return 'bg-gray-100 text-gray-500 border-gray-300';
    if (seat.status === 'reserved') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-gray-100 text-gray-600 border-gray-300';
  };

  const handleSeatClick = (seat: Seat) => {
    if (seat.status !== 'available') return;
    
    if (selectedSeats.includes(seat.id)) {
      onSeatDeselect(seat.id);
    } else if (selectedSeats.length < maxSelectableSeats) {
      onSeatSelect(seat.id);
    }
  };

  const handleSeatHover = (seat: Seat | null) => {
    setHoveredSeat(seat);
    setShowTooltip(!!seat);
    onSeatHover?.(seat);
  };

  const seatSize = compactMode ? 'w-8 h-8 text-xs' : 'w-12 h-12 text-sm';
  const gapSize = compactMode ? 'gap-1' : 'gap-2';

  return (
    <div className={`interactive-seating-map ${className}`}>
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Select Your Seats
        </h3>
        <p className="text-sm text-gray-600">
          {selectedSeats.length} of {maxSelectableSeats} seats selected
        </p>
      </div>

      {/* Bus Layout */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 overflow-x-auto">
        {/* Driver Area Indicator */}
        <div className="flex justify-center mb-4">
          <div className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium">
            🚗 Driver
          </div>
        </div>

        {/* Seating Grid */}
        <div className="space-y-2">
          {Object.keys(seatsByRow)
            .map(Number)
            .sort((a, b) => a - b)
            .map(rowNumber => (
              <div key={rowNumber} className="flex items-center justify-center">
                {/* Row Number */}
                <div className="w-8 text-center text-sm font-medium text-gray-500 mr-2">
                  {rowNumber}
                </div>

                {/* Seats */}
                <div className={`flex ${gapSize} items-center`}>
                  {seatsByRow[rowNumber].map((seat, index) => {
                    const SeatIcon = getSeatIcon(seat);
                    const isSelectable = seat.status === 'available' && 
                      (selectedSeats.includes(seat.id) || selectedSeats.length < maxSelectableSeats);
                    
                    return (
                      <React.Fragment key={seat.id}>
                        {/* Add aisle gap */}
                        {layout.aisleConfiguration === 'single' && index === Math.floor(seatsByRow[rowNumber].length / 2) && (
                          <div className="w-4 flex justify-center">
                            <div className="w-px h-8 bg-gray-300"></div>
                          </div>
                        )}
                        
                        <button
                          onClick={() => handleSeatClick(seat)}
                          onMouseEnter={() => handleSeatHover(seat)}
                          onMouseLeave={() => handleSeatHover(null)}
                          disabled={!isSelectable}
                          className={`
                            ${seatSize} border-2 rounded-lg flex items-center justify-center
                            transition-all duration-200 relative group
                            ${getSeatColor(seat)}
                            ${isSelectable ? 'cursor-pointer transform hover:scale-105' : 'cursor-not-allowed'}
                            ${seat.accessibility.wheelchairAccessible ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}
                          `}
                          title={`Seat ${seat.number} - ${seat.type.name} (${seat.position})`}
                        >
                          <SeatIcon size={compactMode ? 16 : 20} />
                          
                          {/* Seat Number */}
                          <span className="absolute -bottom-1 -right-1 bg-white text-gray-700 text-xs rounded-full w-4 h-4 flex items-center justify-center border border-gray-300">
                            {seat.number}
                          </span>

                          {/* Accessibility Indicator */}
                          {seat.accessibility.wheelchairAccessible && (
                            <Accessibility
                              size={8}
                              className="absolute -top-1 -left-1 text-blue-600 bg-white rounded-full p-0.5"
                            />
                          )}

                          {/* Extra Legroom Indicator */}
                          {seat.accessibility.extraLegroom && (
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                          )}
                        </button>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>

        {/* Emergency Exits */}
        {layout.emergencyExits.length > 0 && (
          <div className="mt-4 flex justify-center space-x-4">
            {layout.emergencyExits.map(exit => (
              <div key={exit.id} className="flex items-center space-x-1 text-red-600 text-sm">
                <MapPin size={16} />
                <span>Emergency Exit - {exit.location}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="mt-4 bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Legend</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-green-100 border-2 border-green-300 rounded flex items-center justify-center">
                <User size={14} className="text-green-800" />
              </div>
              <span>Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-600 border-2 border-blue-700 rounded flex items-center justify-center">
                <UserCheck size={14} className="text-white" />
              </div>
              <span>Selected</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-red-100 border-2 border-red-300 rounded flex items-center justify-center">
                <UserX size={14} className="text-red-800" />
              </div>
              <span>Occupied</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gray-100 border-2 border-gray-300 rounded flex items-center justify-center">
                <UserX size={14} className="text-gray-500" />
              </div>
              <span>Unavailable</span>
            </div>
          </div>
          
          {/* Special Features */}
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <Accessibility size={16} className="text-blue-600" />
                <span>Wheelchair Accessible</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Extra Legroom</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-px h-4 bg-gray-300"></div>
                <span>Aisle</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Seat Details Tooltip */}
      {hoveredSeat && showTooltip && (
        <div className="fixed z-50 bg-black text-white p-3 rounded-lg shadow-lg pointer-events-none max-w-xs">
          <div className="font-semibold">Seat {hoveredSeat.number}</div>
          <div className="text-sm text-gray-300">{hoveredSeat.type.name}</div>
          <div className="text-sm text-gray-300">{hoveredSeat.position} seat</div>
          {hoveredSeat.accessibility.extraLegroom && (
            <div className="text-sm text-green-400">Extra legroom</div>
          )}
          {hoveredSeat.accessibility.wheelchairAccessible && (
            <div className="text-sm text-blue-400">Wheelchair accessible</div>
          )}
          {hoveredSeat.price && (
            <div className="text-sm font-medium text-yellow-400">
              +${hoveredSeat.price.toFixed(2)}
            </div>
          )}
        </div>
      )}

      {/* Selected Seats Summary */}
      {selectedSeats.length > 0 && (
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">Selected Seats</h4>
          <div className="flex flex-wrap gap-2">
            {selectedSeats.map(seatId => {
              const seat = layout.seats.find(s => s.id === seatId);
              if (!seat) return null;
              
              return (
                <div
                  key={seatId}
                  className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                >
                  <span>Seat {seat.number}</span>
                  <button
                    onClick={() => onSeatDeselect(seatId)}
                    className="hover:bg-blue-700 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
