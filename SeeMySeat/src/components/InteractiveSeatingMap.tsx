'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { InteractiveSeatingMapProps, BusLayout, Seat, SeatType } from '@/types';
import {
  User,
  UserX,
  UserCheck,
  Wifi,
  Zap,
  Coffee,
  MapPin,
  Info,
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  X,
  Accessibility
} from 'lucide-react';

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

  // Get effective seat status (considering real-time updates)
  const getEffectiveSeatStatus = (seat: Seat): Seat['status'] => {
    const update = seatUpdates.get(seat.id);
    return update ? update.status : seat.status;
  };

  // Handle seat interaction
  const handleSeatClick = (seat: Seat) => {
    const effectiveStatus = getEffectiveSeatStatus(seat);

    if (effectiveStatus !== 'available') return;

    const isSelected = selectedSeats.includes(seat.id);

    if (isSelected) {
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

  const handleSeatFocus = (seat: Seat | null) => {
    setFocusedSeat(seat);
    onSeatFocus?.(seat);
  };

  // Get seat visual properties
  const getSeatProps = (seat: Seat) => {
    const effectiveStatus = getEffectiveSeatStatus(seat);
    const isSelected = selectedSeats.includes(seat.id);
    const isHighlighted = highlightedSeats.includes(seat.id);
    const isRecommended = recommendations.includes(seat.id);
    const isHovered = hoveredSeat?.id === seat.id;
    const isFocused = focusedSeat?.id === seat.id;

    let bgColor = 'bg-gray-300';
    let borderColor = 'border-gray-400';
    let textColor = 'text-gray-700';
    let cursor = 'cursor-not-allowed';

    switch (effectiveStatus) {
      case 'available':
        bgColor = isSelected ? 'bg-green-500' : 'bg-blue-100';
        borderColor = isSelected ? 'border-green-600' : 'border-blue-300';
        textColor = isSelected ? 'text-white' : 'text-blue-800';
        cursor = 'cursor-pointer';
        break;
      case 'occupied':
        bgColor = 'bg-red-200';
        borderColor = 'border-red-400';
        textColor = 'text-red-800';
        break;
      case 'reserved':
        bgColor = 'bg-yellow-200';
        borderColor = 'border-yellow-400';
        textColor = 'text-yellow-800';
        break;
      case 'disabled':
        bgColor = 'bg-gray-200';
        borderColor = 'border-gray-300';
        textColor = 'text-gray-500';
        break;
    }

    if (isHighlighted) {
      borderColor = 'border-purple-500 border-2';
    }

    if (isRecommended && effectiveStatus === 'available') {
      bgColor = isSelected ? 'bg-green-500' : 'bg-amber-100';
      borderColor = 'border-amber-400';
    }

    if (isHovered || isFocused) {
      bgColor = bgColor.replace('100', '200').replace('200', '300');
    }

    return {
      bgColor,
      borderColor,
      textColor,
      cursor,
      isInteractive: effectiveStatus === 'available',
      isSelected,
      isHighlighted,
      isRecommended,
      isHovered,
      isFocused
    };
  };

  // Render seat component
  const renderSeat = (seat: Seat, index: number) => {
    const props = getSeatProps(seat);
    const effectiveStatus = getEffectiveSeatStatus(seat);

    return (
      <div
        key={seat.id}
        className={`
          relative flex items-center justify-center border-2 rounded-lg transition-all duration-200
          ${props.bgColor} ${props.borderColor} ${props.textColor} ${props.cursor}
          ${compactMode ? 'w-8 h-8 text-xs' : 'w-12 h-12 text-sm'}
          ${props.isInteractive ? 'hover:scale-105 active:scale-95' : ''}
          ${props.isFocused ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
          ${props.isRecommended ? 'animate-pulse' : ''}
        `}
        onClick={() => handleSeatClick(seat)}
        onMouseEnter={() => handleSeatHover(seat)}
        onMouseLeave={() => handleSeatHover(null)}
        onFocus={() => handleSeatFocus(seat)}
        onBlur={() => handleSeatFocus(null)}
        tabIndex={props.isInteractive ? 0 : -1}
        role="button"
        aria-label={`Seat ${seat.row}${seat.column} - ${effectiveStatus} - ${seat.type.name} - $${seat.pricing.basePrice}`}
        aria-pressed={props.isSelected}
        aria-describedby={hoveredSeat?.id === seat.id ? `tooltip-${seat.id}` : undefined}
      >
        {/* Seat Number */}
        <span className="font-medium">
          {compactMode ? seat.column : `${seat.row}${seat.column}`}
        </span>

        {/* Status Icons */}
        <div className="absolute -top-1 -right-1">
          {props.isSelected && (
            <CheckCircle className="w-3 h-3 text-green-600 bg-white rounded-full" />
          )}
          {props.isRecommended && !props.isSelected && (
            <Star className="w-3 h-3 text-amber-500 bg-white rounded-full" />
          )}
          {seat.accessibility.wheelchairAccessible && (
            <Accessibility className="w-3 h-3 text-blue-600 bg-white rounded-full" />
          )}
        </div>

        {/* Real-time Update Indicator */}
        {seatUpdates.has(seat.id) && (
          <div className="absolute -bottom-1 -left-1">
            <Clock className="w-3 h-3 text-orange-500 bg-white rounded-full animate-pulse" />
          </div>
        )}

        {/* Features Icons */}
        {!compactMode && seat.features.length > 0 && (
          <div className="absolute bottom-0 left-0 flex space-x-1">
            {seat.features.slice(0, 2).map((feature, idx) => (
              <div key={idx} className="w-2 h-2 bg-blue-400 rounded-full" />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Group seats by row
  const seatsByRow = useMemo(() => {
    const rows: { [key: number]: Seat[] } = {};
    layout.seats.forEach(seat => {
      if (!rows[seat.row]) rows[seat.row] = [];
      rows[seat.row].push(seat);
    });

    // Sort seats within each row by column
    Object.keys(rows).forEach(rowKey => {
      rows[parseInt(rowKey)].sort((a, b) => a.column.localeCompare(b.column));
    });

    return rows;
  }, [layout.seats]);

  // Calculate pricing summary
  const pricingSummary = useMemo(() => {
    const selectedSeatObjects = layout.seats.filter(seat => selectedSeats.includes(seat.id));
    const totalPrice = selectedSeatObjects.reduce((sum, seat) => sum + seat.pricing.basePrice, 0);
    const averagePrice = selectedSeatObjects.length > 0 ? totalPrice / selectedSeatObjects.length : 0;

    return {
      totalPrice,
      averagePrice,
      selectedCount: selectedSeats.length,
      maxSeats: maxSelectableSeats
    };
  }, [selectedSeats, layout.seats, maxSelectableSeats]);

  return (
    <div className={`w-full ${className}`} role="region" aria-label={ariaLabel}>
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Select Your Seats
        </h3>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            {pricingSummary.selectedCount} of {pricingSummary.maxSeats} seats selected
          </span>
          {showPricing && pricingSummary.selectedCount > 0 && (
            <span className="font-medium text-green-600">
              Total: ${pricingSummary.totalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {/* Recommendations */}
      {showRecommendations && recommendations.length > 0 && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center mb-2">
            <Star className="w-4 h-4 text-amber-500 mr-2" />
            <span className="text-sm font-medium text-amber-800">Recommended Seats</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {recommendations.map(seatId => {
              const seat = layout.seats.find(s => s.id === seatId);
              return seat ? (
                <button
                  key={seatId}
                  onClick={() => handleSeatClick(seat)}
                  className="px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded hover:bg-amber-200 transition-colors"
                >
                  {seat.row}{seat.column}
                </button>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Bus Layout */}
      <div className="relative bg-gray-50 border-2 border-gray-200 rounded-lg p-4 mb-4">
        {/* Bus Front Indicator */}
        <div className="flex items-center justify-center mb-4 pb-2 border-b border-gray-300">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-8 h-6 bg-gray-400 rounded-t-full flex items-center justify-center">
              <User className="w-3 h-3 text-white" />
            </div>
            <span>Driver</span>
          </div>
        </div>

        {/* Seating Grid */}
        <div className="space-y-2">
          {Object.keys(seatsByRow)
            .map(Number)
            .sort((a, b) => a - b)
            .map(rowNumber => (
              <div key={rowNumber} className="flex items-center justify-center space-x-2">
                {/* Row Number */}
                <div className="w-8 text-center text-sm font-medium text-gray-500">
                  {rowNumber}
                </div>

                {/* Left Side Seats */}
                <div className="flex space-x-1">
                  {seatsByRow[rowNumber]
                    .filter(seat => seat.column <= 'B')
                    .map((seat, index) => renderSeat(seat, index))}
                </div>

                {/* Aisle */}
                <div className={`${compactMode ? 'w-4' : 'w-8'} flex justify-center`}>
                  <div className="w-1 h-8 bg-gray-300 rounded"></div>
                </div>

                {/* Right Side Seats */}
                <div className="flex space-x-1">
                  {seatsByRow[rowNumber]
                    .filter(seat => seat.column > 'B')
                    .map((seat, index) => renderSeat(seat, index))}
                </div>
              </div>
            ))}
        </div>

        {/* Emergency Exits */}
        {layout.emergencyExits.map(exit => (
          <div
            key={exit.id}
            className="absolute text-xs text-red-600 font-medium"
            style={{
              [exit.location.side]: '4px',
              top: `${(exit.location.row / Object.keys(seatsByRow).length) * 100}%`
            }}
          >
            🚪 EXIT
          </div>
        ))}
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 border border-green-600 rounded"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-200 border border-red-400 rounded"></div>
            <span>Occupied</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-200 border border-yellow-400 rounded"></div>
            <span>Reserved</span>
          </div>
          {showRecommendations && (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-amber-100 border border-amber-400 rounded relative">
                <Star className="w-2 h-2 text-amber-500 absolute top-0 right-0" />
              </div>
              <span>Recommended</span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Accessibility className="w-4 h-4 text-blue-600" />
            <span>Accessible</span>
          </div>
        </div>
      )}

      {/* Tooltip */}
      {hoveredSeat && showTooltip && (
        <div
          id={`tooltip-${hoveredSeat.id}`}
          className="fixed z-50 bg-black text-white text-sm rounded-lg p-3 shadow-lg pointer-events-none"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="font-medium mb-1">
            Seat {hoveredSeat.row}{hoveredSeat.column}
          </div>
          <div className="text-gray-300 mb-2">
            {hoveredSeat.type.name} - {hoveredSeat.position}
          </div>
          {showPricing && (
            <div className="text-green-400 font-medium">
              ${hoveredSeat.pricing.basePrice}
            </div>
          )}
          {hoveredSeat.features.length > 0 && (
            <div className="mt-2 text-xs">
              Features: {hoveredSeat.features.map(f => f.name).join(', ')}
            </div>
          )}
          {hoveredSeat.accessibility.wheelchairAccessible && (
            <div className="mt-1 text-blue-400 text-xs">
              ♿ Wheelchair Accessible
            </div>
          )}
        </div>
      )}

      {/* Selected Seats Summary */}
      {selectedSeats.length > 0 && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">Selected Seats</h4>
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedSeats.map(seatId => {
              const seat = layout.seats.find(s => s.id === seatId);
              return seat ? (
                <div
                  key={seatId}
                  className="flex items-center space-x-2 bg-white px-2 py-1 rounded border"
                >
                  <span className="text-sm font-medium">
                    {seat.row}{seat.column}
                  </span>
                  <button
                    onClick={() => onSeatDeselect(seatId)}
                    className="text-red-500 hover:text-red-700"
                    aria-label={`Remove seat ${seat.row}${seat.column}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : null;
            })}
          </div>
          {showPricing && (
            <div className="text-right">
              <div className="text-lg font-bold text-green-700">
                Total: ₹{pricingSummary.totalPrice.toFixed(0)}
              </div>
              {pricingSummary.selectedCount > 1 && (
                <div className="text-sm text-green-600">
                  Average: ₹{pricingSummary.averagePrice.toFixed(0)} per seat
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};