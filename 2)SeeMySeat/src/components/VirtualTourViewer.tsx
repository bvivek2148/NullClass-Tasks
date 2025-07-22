'use client';

import React, { useEffect, useState, useRef } from 'react';
import { VirtualTourViewerProps, VirtualTourViewpoint } from '@/types';
import { X, Maximize2, Minimize2, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Seat3D } from './Seat3D';

// Helper function to get appropriate icon for bus section
const getSectionIcon = (sectionName: string) => {
  const name = sectionName.toLowerCase();
  if (name.includes('front')) return '🚌';
  if (name.includes('middle')) return '🪑';
  if (name.includes('rear')) return '🚪';
  return '📍';
};

export const VirtualTourViewer: React.FC<VirtualTourViewerProps> = ({
  tour,
  selectedSeats,
  onSeatSelect,
  onSeatDeselect,
  onClose,
  isFullscreen = false,
  onFullscreenToggle,
  className = '',
}) => {
  const [currentViewpoint, setCurrentViewpoint] = useState<VirtualTourViewpoint>(
    tour.viewpoints.find(v => v.id === tour.defaultViewpoint) || tour.viewpoints[0]
  );
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: -100 });
  const [zoom, setZoom] = useState(0.5);
  const [lastMousePosition, setLastMousePosition] = useState<{ x: number; y: number } | null>(null);
  const [controlMode, setControlMode] = useState<'rotate' | 'move'>('rotate');
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize demo mode
  useEffect(() => {
    setIsLoading(true);
    // Reset view for each section
    setRotation({ x: 0, y: 0 });
    setPosition({ x: 0, y: -100 });
    setZoom(0.5);

    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Focus the container for keyboard events
      if (containerRef.current) {
        containerRef.current.focus();
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [currentViewpoint]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default behavior for navigation keys
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key.toLowerCase()) {
        case 'arrowleft':
          if (controlMode === 'rotate') {
            setRotation(prev => ({ ...prev, y: (prev.y - 5) % 360 }));
          } else {
            setPosition(prev => ({ ...prev, x: prev.x - 10 }));
          }
          break;
        case 'a':
          // A key only works for movement, not rotation
          if (controlMode === 'move') {
            setPosition(prev => ({ ...prev, x: prev.x - 10 }));
          }
          break;
        case 'arrowright':
          if (controlMode === 'rotate') {
            setRotation(prev => ({ ...prev, y: (prev.y + 5) % 360 }));
          } else {
            setPosition(prev => ({ ...prev, x: prev.x + 10 }));
          }
          break;
        case 'd':
          // D key only works for movement, not rotation
          if (controlMode === 'move') {
            setPosition(prev => ({ ...prev, x: prev.x + 10 }));
          }
          break;
        case 'arrowup':
        case 'w':
          if (controlMode === 'rotate') {
            setRotation(prev => ({ ...prev, x: Math.max(-90, prev.x - 5) }));
          } else {
            setPosition(prev => ({ ...prev, y: prev.y - 10 }));
          }
          break;
        case 'arrowdown':
          if (controlMode === 'rotate') {
            setRotation(prev => ({ ...prev, x: Math.min(90, prev.x + 5) }));
          } else {
            setPosition(prev => ({ ...prev, y: prev.y + 10 }));
          }
          break;
        case 's':
          // S key only works for movement, not rotation
          if (controlMode === 'move') {
            setPosition(prev => ({ ...prev, y: prev.y + 10 }));
          }
          break;
        case '+':
        case '=':
          setZoom(prev => Math.min(3, prev + 0.1));
          break;
        case '-':
          setZoom(prev => Math.max(0.5, prev - 0.1));
          break;
        case 'r':
          handleResetView();
          break;
        case 't':
          setControlMode(prev => prev === 'rotate' ? 'move' : 'rotate');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [controlMode]);

  // Get viewpoint index for navigation
  const currentIndex = tour.viewpoints.findIndex(v => v.id === currentViewpoint.id);

  // Demo occupied seats (in real app, this would come from API)
  const occupiedSeats = ['2A', '4B', '6A', '8B'];
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentViewpoint(tour.viewpoints[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < tour.viewpoints.length - 1) {
      setCurrentViewpoint(tour.viewpoints[currentIndex + 1]);
    }
  };

  // Handle seat click in demo mode
  const handleSeatClick = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      onSeatDeselect(seatId);
    } else {
      onSeatSelect(seatId);
    }
  };

  // Handle mouse interactions for 360° experience
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMousePosition({ x: e.clientX, y: e.clientY });
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && lastMousePosition) {
      const deltaX = e.clientX - lastMousePosition.x;
      const deltaY = e.clientY - lastMousePosition.y;

      if (controlMode === 'rotate') {
        setRotation(prev => ({
          x: Math.max(-90, Math.min(90, prev.x + deltaY * 0.5)),
          y: (prev.y + deltaX * 0.5) % 360
        }));
      } else if (controlMode === 'move') {
        setPosition(prev => ({
          x: prev.x + deltaX * 0.5,
          y: prev.y + deltaY * 0.5
        }));
      }

      setLastMousePosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setLastMousePosition(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  // Reset view
  const handleResetView = () => {
    setRotation({ x: 0, y: 0 });
    setPosition({ x: 0, y: -100 });
    setZoom(0.5);
  };

  // Add global mouse event listeners for better drag experience
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging && lastMousePosition) {
        const deltaX = e.clientX - lastMousePosition.x;
        const deltaY = e.clientY - lastMousePosition.y;

        if (controlMode === 'rotate') {
          setRotation(prev => ({
            x: Math.max(-90, Math.min(90, prev.x + deltaY * 0.5)),
            y: (prev.y + deltaX * 0.5) % 360
          }));
        } else if (controlMode === 'move') {
          setPosition(prev => ({
            x: prev.x + deltaX * 0.5,
            y: prev.y + deltaY * 0.5
          }));
        }

        setLastMousePosition({ x: e.clientX, y: e.clientY });
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setLastMousePosition(null);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, lastMousePosition]);

  return (
    <div className={`relative w-full h-full bg-gray-900 ${className}`} style={{ minHeight: '100vh' }}>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-lg">Loading Virtual Tour...</p>
            <p className="text-sm text-gray-300 mt-2">Preparing {currentViewpoint.name}</p>
          </div>
        </div>
      )}

      {/* Demo Virtual Tour Content */}
      {!isLoading && (
        <>
          {/* Virtual Tour Display */}
          <div
            ref={containerRef}
            className={`relative w-full h-full bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-auto ${
              controlMode === 'rotate' ? 'cursor-grab' : 'cursor-move'
            }`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            tabIndex={0}
            onKeyDown={(e) => {
              // Handle keyboard events directly on the container
              if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
                e.preventDefault();
              }

              switch (e.key.toLowerCase()) {
                case 'arrowleft':
                  if (controlMode === 'rotate') {
                    setRotation(prev => ({ ...prev, y: (prev.y - 5) % 360 }));
                  } else {
                    setPosition(prev => ({ ...prev, x: prev.x - 10 }));
                  }
                  break;
                case 'a':
                  // A key only works for movement, not rotation
                  if (controlMode === 'move') {
                    setPosition(prev => ({ ...prev, x: prev.x - 10 }));
                  }
                  break;
                case 'arrowright':
                  if (controlMode === 'rotate') {
                    setRotation(prev => ({ ...prev, y: (prev.y + 5) % 360 }));
                  } else {
                    setPosition(prev => ({ ...prev, x: prev.x + 10 }));
                  }
                  break;
                case 'd':
                  // D key only works for movement, not rotation
                  if (controlMode === 'move') {
                    setPosition(prev => ({ ...prev, x: prev.x + 10 }));
                  }
                  break;
                case 'arrowup':
                  if (controlMode === 'rotate') {
                    setRotation(prev => ({ ...prev, x: Math.max(-90, prev.x - 5) }));
                  } else {
                    setPosition(prev => ({ ...prev, y: prev.y - 10 }));
                  }
                  break;
                case 'w':
                  // W key only works for movement, not rotation
                  if (controlMode === 'move') {
                    setPosition(prev => ({ ...prev, y: prev.y - 10 }));
                  }
                  break;
                case 'arrowdown':
                  if (controlMode === 'rotate') {
                    setRotation(prev => ({ ...prev, x: Math.min(90, prev.x + 5) }));
                  } else {
                    setPosition(prev => ({ ...prev, y: prev.y + 10 }));
                  }
                  break;
                case 's':
                  // S key only works for movement, not rotation
                  if (controlMode === 'move') {
                    setPosition(prev => ({ ...prev, y: prev.y + 10 }));
                  }
                  break;
                case 't':
                  setControlMode(prev => prev === 'rotate' ? 'move' : 'rotate');
                  break;
                case 'r':
                  handleResetView();
                  break;
              }
            }}
            style={{
              cursor: isDragging
                ? (controlMode === 'rotate' ? 'grabbing' : 'move')
                : (controlMode === 'rotate' ? 'grab' : 'move'),
              outline: 'none'
            }}
            onClick={() => containerRef.current?.focus()}
          >
            {/* Dynamic Background with Rotation Effect */}
            <div
              className="absolute inset-0 opacity-10 transition-transform duration-100"
              style={{
                transform: `rotateX(${rotation.x * 0.3}deg) rotateY(${rotation.y * 0.3}deg) scale(${zoom})`,
                backgroundImage: 'radial-gradient(circle at 25% 25%, white 2px, transparent 2px)',
                backgroundSize: '60px 60px'
              }}
            ></div>

            {/* 360° Bus Interior Simulation */}
            <div
              className="absolute inset-0 flex items-start justify-center transition-transform duration-100 overflow-visible py-8"
              style={{
                transform: `perspective(1200px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translateX(${position.x}px) translateY(${position.y}px) scale(${zoom})`,
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Professional Bus Interior Container */}
              <div className="relative w-full flex flex-col items-center justify-start min-h-full pb-32">
                <div className="relative max-w-6xl w-full px-4">

                  {/* Section Header */}
                  <div className="text-center mb-8 mt-4">
                    <div className="inline-flex items-center space-x-3 bg-slate-800 bg-opacity-80 backdrop-blur-sm rounded-2xl px-6 py-3 border border-slate-600 shadow-2xl">
                      <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                      <h2 className="text-2xl font-bold text-white">{currentViewpoint.name}</h2>
                      <div className="text-xs text-blue-200 bg-blue-500 bg-opacity-30 px-3 py-1 rounded-full border border-blue-400 border-opacity-30">360° View</div>
                    </div>
                    <p className="text-blue-200 mt-3 text-base max-w-2xl mx-auto">{currentViewpoint.description}</p>
                  </div>

                  {/* Professional Bus Interior Layout */}
                  <div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-black rounded-3xl p-8 border border-slate-600 shadow-2xl backdrop-blur-sm min-h-[500px]">

                    {/* Bus Ceiling */}
                    <div className="flex justify-between mb-6">
                      <div className="w-full h-6 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded-lg opacity-40 border border-gray-500"></div>
                    </div>

                    {/* Main Seating Area */}
                    <div className="grid grid-cols-9 gap-4 items-center">

                      {/* Left Windows */}
                      <div className="space-y-4">
                        <div className="w-10 h-16 bg-gradient-to-br from-sky-200 via-sky-300 to-sky-400 rounded-lg opacity-60 border border-sky-300 shadow-inner"></div>
                        <div className="w-10 h-16 bg-gradient-to-br from-sky-200 via-sky-300 to-sky-400 rounded-lg opacity-60 border border-sky-300 shadow-inner"></div>
                      </div>

                      {/* Left Window Seats */}
                      <div className="space-y-4">
                        {currentViewpoint.accessibleSeats?.slice(0, 2).map((seatId) => (
                          <Seat3D
                            key={`window-left-${seatId}`}
                            seatId={seatId}
                            isSelected={selectedSeats.includes(seatId)}
                            isOccupied={occupiedSeats.includes(seatId)}
                            onClick={() => handleSeatClick(seatId)}
                            size="medium"
                            type="window"
                          />
                        ))}
                      </div>

                      {/* Left Aisle Seats */}
                      <div className="space-y-4">
                        {currentViewpoint.accessibleSeats?.slice(2, 4).map((seatId) => (
                          <Seat3D
                            key={`aisle-left-${seatId}`}
                            seatId={seatId}
                            isSelected={selectedSeats.includes(seatId)}
                            isOccupied={occupiedSeats.includes(seatId)}
                            onClick={() => handleSeatClick(seatId)}
                            size="medium"
                            type="aisle"
                          />
                        ))}
                      </div>

                      {/* Center Aisle */}
                      <div className="flex flex-col items-center space-y-6 px-3">
                        <div className="w-2 h-24 bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 rounded-full opacity-70 shadow-lg"></div>
                        <div className="text-xs text-blue-300 font-bold rotate-90 whitespace-nowrap tracking-wider">AISLE</div>
                        <div className="w-2 h-24 bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 rounded-full opacity-70 shadow-lg"></div>
                      </div>

                      {/* Right Aisle Seats */}
                      <div className="space-y-4">
                        {currentViewpoint.accessibleSeats?.slice(4, 6).map((seatId) => (
                          <Seat3D
                            key={`aisle-right-${seatId}`}
                            seatId={seatId}
                            isSelected={selectedSeats.includes(seatId)}
                            isOccupied={occupiedSeats.includes(seatId)}
                            onClick={() => handleSeatClick(seatId)}
                            size="medium"
                            type="aisle"
                          />
                        ))}
                      </div>

                      {/* Right Window Seats */}
                      <div className="space-y-4">
                        {currentViewpoint.accessibleSeats?.slice(6, 8).map((seatId) => (
                          <Seat3D
                            key={`window-right-${seatId}`}
                            seatId={seatId}
                            isSelected={selectedSeats.includes(seatId)}
                            isOccupied={occupiedSeats.includes(seatId)}
                            onClick={() => handleSeatClick(seatId)}
                            size="medium"
                            type="window"
                          />
                        ))}
                      </div>

                      {/* Right Windows */}
                      <div className="space-y-4">
                        <div className="w-10 h-16 bg-gradient-to-br from-sky-200 via-sky-300 to-sky-400 rounded-lg opacity-60 border border-sky-300 shadow-inner"></div>
                        <div className="w-10 h-16 bg-gradient-to-br from-sky-200 via-sky-300 to-sky-400 rounded-lg opacity-60 border border-sky-300 shadow-inner"></div>
                      </div>
                    </div>

                    {/* Bus Floor */}
                    <div className="mt-6 h-3 bg-gradient-to-r from-gray-600 via-gray-500 to-gray-600 rounded-full opacity-40 border border-gray-500"></div>
                  </div>
                </div>
              </div>

              {/* Enhanced Status Legend and Seat Selection Panel */}
              <div className="mt-12 flex justify-center z-40">
                <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-black bg-opacity-95 backdrop-blur-md rounded-3xl p-8 border-2 border-slate-600 shadow-2xl max-w-4xl w-full mx-4">

                  {/* Header */}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">Seat Selection</h3>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full mx-auto"></div>
                  </div>

                  {/* Status Legend */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="flex items-center justify-center space-x-3 bg-blue-500 bg-opacity-20 rounded-xl p-4 border border-blue-400 border-opacity-30">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-lg"></div>
                      <span className="text-blue-100 font-semibold text-lg">Available</span>
                    </div>
                    <div className="flex items-center justify-center space-x-3 bg-emerald-500 bg-opacity-20 rounded-xl p-4 border border-emerald-400 border-opacity-30">
                      <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg shadow-lg"></div>
                      <span className="text-emerald-100 font-semibold text-lg">Selected</span>
                    </div>
                    <div className="flex items-center justify-center space-x-3 bg-gray-500 bg-opacity-20 rounded-xl p-4 border border-gray-400 border-opacity-30">
                      <div className="w-6 h-6 bg-gradient-to-br from-gray-400 to-gray-600 rounded-lg shadow-lg"></div>
                      <span className="text-gray-100 font-semibold text-lg">Occupied</span>
                    </div>
                  </div>

                  {/* Selected Seats Summary */}
                  {selectedSeats.length > 0 ? (
                    <div className="bg-emerald-500 bg-opacity-10 rounded-2xl p-6 border border-emerald-400 border-opacity-30">
                      <div className="flex items-center justify-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-emerald-400 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <h4 className="text-2xl font-bold text-emerald-100">Selected Seats</h4>
                      </div>
                      <div className="flex flex-wrap gap-3 justify-center mb-4">
                        {selectedSeats.map((seatId) => (
                          <div
                            key={seatId}
                            className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-white px-6 py-3 rounded-xl text-lg font-bold shadow-lg border-2 border-emerald-300 transform hover:scale-105 transition-transform"
                          >
                            {seatId}
                          </div>
                        ))}
                      </div>
                      <div className="text-center">
                        <p className="text-emerald-200 text-lg font-semibold">
                          Total {selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''} selected
                        </p>
                        <p className="text-emerald-300 text-sm mt-2">
                          Price: ₹{selectedSeats.length * 850} ({selectedSeats.length} × ₹850)
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-blue-500 bg-opacity-10 rounded-2xl p-6 border border-blue-400 border-opacity-30 text-center">
                      <div className="w-16 h-16 bg-blue-400 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <h4 className="text-xl font-bold text-blue-100 mb-2">Select Your Seats</h4>
                      <p className="text-blue-200">Click on available seats to select them for your journey</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Hotspot Indicators */}
            {currentViewpoint.hotspots?.map((hotspot) => (
              <div
                key={hotspot.id}
                className="absolute w-6 h-6 bg-blue-500 border-2 border-white rounded-full cursor-pointer hover:scale-125 transition-transform"
                style={{
                  left: `${50 + (hotspot.position.yaw * 20)}%`,
                  top: `${50 + (hotspot.position.pitch * 20)}%`,
                }}
                title={hotspot.content.title}
              >
                <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                  {hotspot.type === 'seat' ? 'S' : hotspot.type === 'amenity' ? 'A' : 'i'}
                </div>
              </div>
            ))}
          </div>

          {/* Professional Controls Overlay */}
            {/* Top Controls Bar */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-50">
              <div className="flex items-center space-x-3">
                <div className="bg-slate-800 bg-opacity-90 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-medium border border-slate-600 shadow-lg">
                  {currentViewpoint.name}
                </div>
                <div className="bg-slate-800 bg-opacity-90 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-medium border border-slate-600 shadow-lg">
                  {currentIndex + 1} of {tour.viewpoints.length}
                </div>
                <div className="bg-slate-800 bg-opacity-90 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-medium border border-slate-600 shadow-lg">
                  Zoom: {Math.round(zoom * 100)}%
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Professional Control Buttons */}
                <button
                  onClick={() => setZoom(prev => Math.min(3, prev + 0.2))}
                  className="bg-slate-800 bg-opacity-90 backdrop-blur-sm text-white p-3 rounded-xl hover:bg-slate-700 transition-all duration-200 border border-slate-600 shadow-lg hover:scale-105"
                  title="Zoom In"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setZoom(prev => Math.max(0.5, prev - 0.2))}
                  className="bg-slate-800 bg-opacity-90 backdrop-blur-sm text-white p-3 rounded-xl hover:bg-slate-700 transition-all duration-200 border border-slate-600 shadow-lg hover:scale-105"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>

                {/* Reset View */}
                <button
                  onClick={handleResetView}
                  className="bg-slate-800 bg-opacity-90 backdrop-blur-sm text-white p-3 rounded-xl hover:bg-slate-700 transition-all duration-200 border border-slate-600 shadow-lg hover:scale-105"
                  title="Reset View"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>

                {onFullscreenToggle && (
                  <button
                    onClick={onFullscreenToggle}
                    className="bg-slate-800 bg-opacity-90 backdrop-blur-sm text-white p-3 rounded-xl hover:bg-slate-700 transition-all duration-200 border border-slate-600 shadow-lg hover:scale-105"
                    title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                  >
                    {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="bg-red-600 bg-opacity-90 backdrop-blur-sm text-white p-3 rounded-xl hover:bg-red-700 transition-all duration-200 border border-red-500 shadow-lg hover:scale-105"
                  title="Close Tour"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

              {/* Compact Section Navigation - Right Side */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-50">
                <div className="bg-slate-800 bg-opacity-95 backdrop-blur-sm rounded-xl p-3 border border-slate-600 shadow-xl max-w-xs">
                  {/* Header */}
                  <div className="text-center mb-3">
                    <h3 className="text-xs font-bold text-white mb-1">Bus Sections</h3>
                    <div className="w-12 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto"></div>
                  </div>

                  {/* Section Cards */}
                  <div className="space-y-2">
                    {tour.viewpoints.map((viewpoint, index) => (
                      <button
                        key={viewpoint.id}
                        onClick={() => setCurrentViewpoint(viewpoint)}
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
                            {getSectionIcon(viewpoint.name)}
                          </div>

                          {/* Name */}
                          <span className="text-xs font-medium text-center leading-tight">
                            {viewpoint.name}
                          </span>

                          {/* Position Indicator */}
                          <div className={`text-xs opacity-60 ${
                            currentViewpoint.id === viewpoint.id ? 'text-blue-100' : 'text-gray-400'
                          }`}>
                            {index + 1} of {tour.viewpoints.length}
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
                      aria-label="Previous section"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Prev</span>
                    </button>

                    <button
                      onClick={handleNext}
                      disabled={currentIndex === tour.viewpoints.length - 1}
                      className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-slate-700 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-600 transition-all text-xs"
                      aria-label="Next section"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 360° Experience Instructions - Side Panel */}
              <div className="absolute left-6 top-1/2 transform -translate-y-1/2 z-40">
                {/* Toggle Button */}
                <button
                  onClick={() => setShowControls(!showControls)}
                  className="bg-slate-800 bg-opacity-90 backdrop-blur-sm text-white p-3 rounded-xl hover:bg-slate-700 transition-all duration-200 border border-slate-600 shadow-lg hover:scale-105 mb-4"
                  title={showControls ? "Hide Controls" : "Show Controls"}
                >
                  <span className="text-sm">ℹ️</span>
                </button>

                {/* Instructions Panel */}
                {showControls && (
                  <div className="bg-slate-800 bg-opacity-95 backdrop-blur-sm text-white p-4 rounded-2xl shadow-2xl border border-slate-600 max-w-xs transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                        <span className="text-sm font-bold text-blue-200">Controls</span>
                      </div>
                      <button
                        onClick={() => setShowControls(false)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                    {/* Control Mode Toggle */}
                    <div className="mb-4">
                      <div className="text-xs text-blue-200 mb-2 font-semibold">Control Mode</div>
                      <div className="flex space-x-1 bg-slate-700 rounded-lg p-1">
                        <button
                          onClick={() => setControlMode('rotate')}
                          className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 ${
                            controlMode === 'rotate'
                              ? 'bg-blue-500 text-white shadow-md'
                              : 'text-gray-300 hover:text-white hover:bg-slate-600'
                          }`}
                        >
                          🔄 Rotate
                        </button>
                        <button
                          onClick={() => setControlMode('move')}
                          className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-all duration-200 ${
                            controlMode === 'move'
                              ? 'bg-emerald-500 text-white shadow-md'
                              : 'text-gray-300 hover:text-white hover:bg-slate-600'
                          }`}
                        >
                          ↔️ Move
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-gray-300">
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-400">🖱️</span>
                        <span>{controlMode === 'rotate' ? 'Drag to rotate view' : 'Drag to move around'}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-400">🔍</span>
                        <span>Scroll to zoom</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-400">⌨️</span>
                        <span>Arrow keys to navigate</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-400">👆</span>
                        <span>Click here first for keyboard controls</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-400">🪑</span>
                        <span>Click seats to select</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
          </>
        )}
    </div>
  );
};
