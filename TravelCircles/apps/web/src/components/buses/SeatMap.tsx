'use client';

import { useState, useEffect } from 'react';
import { 
  UserIcon, 
  CheckIcon,
  XMarkIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

interface Seat {
  id: string;
  number: string;
  row: number;
  position: number;
  type: 'ECONOMY' | 'PREMIUM' | 'ACCESSIBILITY';
  features: string[];
  isAvailable: boolean;
  price?: {
    base: number;
    premium: number;
  };
}

interface SeatConfiguration {
  layout: {
    rows: number;
    seatsPerRow: number;
    aislePosition: number;
  };
  seatTypes: {
    economy: number;
    premium: number;
    accessibility: number;
  };
  seatMap: Seat[];
}

interface SeatMapProps {
  busId: string;
  seatConfiguration: SeatConfiguration;
  selectedSeats: string[];
  onSeatSelect: (seatId: string) => void;
  maxSeats?: number;
  readonly?: boolean;
  className?: string;
}

export default function SeatMap({
  busId,
  seatConfiguration,
  selectedSeats,
  onSeatSelect,
  maxSeats = 4,
  readonly = false,
  className = '',
}: SeatMapProps) {
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);

  const { layout, seatMap } = seatConfiguration;
  const { rows, seatsPerRow, aislePosition } = layout;

  const getSeatStatus = (seat: Seat) => {
    if (!seat.isAvailable) return 'occupied';
    if (selectedSeats.includes(seat.id)) return 'selected';
    return 'available';
  };

  const getSeatColor = (seat: Seat) => {
    const status = getSeatStatus(seat);
    
    switch (status) {
      case 'occupied':
        return 'bg-gray-400 text-white cursor-not-allowed';
      case 'selected':
        return 'bg-primary-600 text-white border-primary-700';
      case 'available':
        switch (seat.type) {
          case 'PREMIUM':
            return 'bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200';
          case 'ACCESSIBILITY':
            return 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200';
          default:
            return 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200';
        }
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getSeatIcon = (seat: Seat) => {
    const status = getSeatStatus(seat);
    
    if (status === 'occupied') {
      return <XMarkIcon className="h-4 w-4" />;
    }
    
    if (status === 'selected') {
      return <CheckIcon className="h-4 w-4" />;
    }
    
    if (seat.type === 'ACCESSIBILITY') {
      return <HeartIcon className="h-4 w-4" />;
    }
    
    return <UserIcon className="h-4 w-4" />;
  };

  const handleSeatClick = (seat: Seat) => {
    if (readonly || !seat.isAvailable) return;
    
    const isSelected = selectedSeats.includes(seat.id);
    
    if (isSelected) {
      // Deselect seat
      onSeatSelect(seat.id);
    } else {
      // Check if we can select more seats
      if (selectedSeats.length >= maxSeats) {
        alert(`You can select maximum ${maxSeats} seats`);
        return;
      }
      
      // Select seat
      onSeatSelect(seat.id);
    }
  };

  const renderSeatRow = (rowNumber: number) => {
    const rowSeats = seatMap.filter(seat => seat.row === rowNumber);
    const seatElements = [];

    for (let position = 1; position <= seatsPerRow; position++) {
      const seat = rowSeats.find(s => s.position === position);
      
      if (seat) {
        seatElements.push(
          <button
            key={seat.id}
            onClick={() => handleSeatClick(seat)}
            onMouseEnter={() => setHoveredSeat(seat.id)}
            onMouseLeave={() => setHoveredSeat(null)}
            disabled={readonly || !seat.isAvailable}
            className={`
              relative w-10 h-10 border-2 rounded-lg flex items-center justify-center
              transition-all duration-200 text-xs font-medium
              ${getSeatColor(seat)}
              ${!readonly && seat.isAvailable ? 'cursor-pointer' : ''}
              ${hoveredSeat === seat.id ? 'scale-110 z-10' : ''}
            `}
            title={`Seat ${seat.number} - ${seat.type} - ${seat.isAvailable ? 'Available' : 'Occupied'}`}
          >
            {getSeatIcon(seat)}
            <span className="absolute -bottom-5 text-xs text-gray-600">
              {seat.number}
            </span>
          </button>
        );
      } else {
        // Empty space
        seatElements.push(
          <div key={`empty-${rowNumber}-${position}`} className="w-10 h-10" />
        );
      }

      // Add aisle space
      if (position === aislePosition && position < seatsPerRow) {
        seatElements.push(
          <div key={`aisle-${rowNumber}-${position}`} className="w-6" />
        );
      }
    }

    return (
      <div key={`row-${rowNumber}`} className="flex items-center justify-center gap-2 mb-8">
        <div className="w-8 text-center text-sm font-medium text-gray-600">
          {rowNumber}
        </div>
        <div className="flex gap-2">
          {seatElements}
        </div>
      </div>
    );
  };

  const selectedSeatDetails = seatMap.filter(seat => selectedSeats.includes(seat.id));
  const totalPrice = selectedSeatDetails.reduce((sum, seat) => sum + (seat.price?.base || 0), 0);

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
      {/* Bus Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Select Your Seats</h3>
          <div className="text-sm text-gray-600">
            {selectedSeats.length} of {maxSeats} seats selected
          </div>
        </div>
        
        {/* Driver area */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-800 text-white px-4 py-2 rounded-t-lg text-sm font-medium">
            Driver
          </div>
        </div>
      </div>

      {/* Seat Map */}
      <div className="mb-6">
        {Array.from({ length: rows }, (_, index) => renderSeatRow(index + 1))}
      </div>

      {/* Legend */}
      <div className="border-t border-gray-200 pt-4 mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-100 border border-gray-300 rounded flex items-center justify-center">
              <UserIcon className="h-3 w-3 text-gray-600" />
            </div>
            <span className="text-gray-600">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary-600 border border-primary-700 rounded flex items-center justify-center">
              <CheckIcon className="h-3 w-3 text-white" />
            </div>
            <span className="text-gray-600">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-400 rounded flex items-center justify-center">
              <XMarkIcon className="h-3 w-3 text-white" />
            </div>
            <span className="text-gray-600">Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-100 border border-yellow-300 rounded flex items-center justify-center">
              <UserIcon className="h-3 w-3 text-yellow-600" />
            </div>
            <span className="text-gray-600">Premium</span>
          </div>
        </div>
      </div>

      {/* Selected Seats Summary */}
      {selectedSeats.length > 0 && (
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Selected Seats</h4>
          <div className="space-y-2">
            {selectedSeatDetails.map((seat) => (
              <div key={seat.id} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Seat {seat.number}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    seat.type === 'PREMIUM' ? 'bg-yellow-100 text-yellow-800' :
                    seat.type === 'ACCESSIBILITY' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {seat.type}
                  </span>
                </div>
                <span className="font-medium">${seat.price?.base || 0}</span>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-2 flex justify-between items-center font-semibold">
              <span>Total</span>
              <span className="text-primary-600">${totalPrice}</span>
            </div>
          </div>
        </div>
      )}

      {/* Seat Details Tooltip */}
      {hoveredSeat && (
        <div className="fixed z-50 bg-gray-900 text-white p-3 rounded-lg shadow-lg pointer-events-none">
          {(() => {
            const seat = seatMap.find(s => s.id === hoveredSeat);
            if (!seat) return null;
            
            return (
              <div className="text-sm">
                <div className="font-medium">Seat {seat.number}</div>
                <div className="text-gray-300">{seat.type}</div>
                {seat.features.length > 0 && (
                  <div className="text-gray-300 text-xs mt-1">
                    {seat.features.join(', ')}
                  </div>
                )}
                {seat.price && (
                  <div className="text-green-400 font-medium mt-1">
                    ${seat.price.base}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
