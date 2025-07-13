'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Viewer } from '@photo-sphere-viewer/core';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
import { VirtualBusTour, VirtualTourViewpoint, VirtualTourHotspot, Seat } from '@/lib/types';
import { useResponsive } from './ResponsiveContainer';
import { X, Maximize2, Minimize2, RotateCcw, ZoomIn, ZoomOut, Navigation, Loader2, AlertCircle } from 'lucide-react';

interface VirtualTourViewerProps {
  tour: VirtualBusTour;
  selectedSeats: string[];
  onSeatSelect: (seatId: string) => void;
  onSeatDeselect: (seatId: string) => void;
  onClose: () => void;
  isFullscreen?: boolean;
  onFullscreenToggle?: () => void;
  className?: string;
}

// Progressive loading utilities
const createLowResPlaceholder = (imageUrl: string): string => {
  // Generate a low-resolution placeholder URL
  // In a real implementation, this would be a server-side service
  return imageUrl.replace(/w=\d+/, 'w=400').replace(/h=\d+/, 'h=200');
};

const preloadImage = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
};

const preloadViewpointImages = async (viewpoints: VirtualTourViewpoint[]): Promise<void> => {
  const preloadPromises = viewpoints.map(viewpoint =>
    preloadImage(viewpoint.thumbnailUrl || createLowResPlaceholder(viewpoint.imageUrl))
  );
  await Promise.allSettled(preloadPromises);
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
  const viewerRef = useRef<HTMLDivElement>(null);
  const sphereViewerRef = useRef<Viewer | null>(null);
  const markersPluginRef = useRef<MarkersPlugin | null>(null);
  const imageCache = useRef<Map<string, boolean>>(new Map());
  const [currentViewpoint, setCurrentViewpoint] = useState<VirtualTourViewpoint>(
    tour.viewpoints.find(v => v.id === tour.defaultViewpoint) || tour.viewpoints[0]
  );
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [isImagePreloaded, setIsImagePreloaded] = useState(false);
  const [fallbackMode, setFallbackMode] = useState(false);
  const deviceInfo = useResponsive();

  // Memoized viewer configuration for performance
  const viewerConfig = useMemo(() => ({
    defaultYaw: currentViewpoint.rotation.yaw,
    defaultPitch: currentViewpoint.rotation.pitch,
    minFov: tour.settings.zoomLevels.min,
    maxFov: tour.settings.zoomLevels.max,
    defaultZoomLvl: tour.settings.zoomLevels.default,
    autorotateDelay: tour.settings.autoRotate ? 2000 : null,
    autorotateSpeed: tour.settings.autoRotateSpeed,
    navbar: false,
    loadingImg: '/images/loading-spinner.svg',
    touchmoveTwoFingers: deviceInfo.touchSupport,
    mousewheelCtrlKey: !deviceInfo.touchSupport,
    moveSpeed: deviceInfo.isMobile ? 1.5 : 1.0,
    zoomSpeed: deviceInfo.isMobile ? 2.0 : 1.0,
    // Performance optimizations
    useXmpData: false,
    fisheye: false,
    requestHeaders: {
      'Cache-Control': 'max-age=3600'
    }
  }), [currentViewpoint, tour.settings, deviceInfo]);

  // Preload images on component mount
  useEffect(() => {
    const preloadImages = async () => {
      try {
        await preloadViewpointImages(tour.viewpoints);
        setIsImagePreloaded(true);
      } catch (error) {
        console.warn('Failed to preload some images:', error);
        setIsImagePreloaded(true); // Continue anyway
      }
    };

    preloadImages();
  }, [tour.viewpoints]);

  // Enhanced Photo Sphere Viewer initialization with progressive loading
  useEffect(() => {
    if (!viewerRef.current || !currentViewpoint) return;

    const initViewer = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setLoadingProgress(0);

        // Clean up existing viewer
        if (sphereViewerRef.current) {
          sphereViewerRef.current.destroy();
        }

        // Check WebGL support for fallback
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) {
          setFallbackMode(true);
          setError('WebGL is not supported. Please use a modern browser for the full virtual tour experience.');
          return;
        }

        // Progressive loading: Start with low-res placeholder if available
        const placeholderUrl = currentViewpoint.thumbnailUrl || createLowResPlaceholder(currentViewpoint.imageUrl);
        const useProgressiveLoading = placeholderUrl !== currentViewpoint.imageUrl;

        setLoadingProgress(20);

        // Create viewer with placeholder first if using progressive loading
        const initialPanorama = useProgressiveLoading ? placeholderUrl : currentViewpoint.imageUrl;

        const viewer = new Viewer({
          container: viewerRef.current!,
          panorama: initialPanorama,
          plugins: [
            [MarkersPlugin, {
              markers: []
            }]
          ],
          ...viewerConfig
        });

        sphereViewerRef.current = viewer;
        markersPluginRef.current = viewer.getPlugin(MarkersPlugin);

        setLoadingProgress(50);

        // Enhanced event listeners with progress tracking
        viewer.addEventListener('ready', () => {
          setLoadingProgress(80);
          if (!useProgressiveLoading) {
            setIsLoading(false);
            updateMarkers();
          }
        });

        viewer.addEventListener('panorama-loaded', () => {
          setLoadingProgress(100);
          setIsLoading(false);
          updateMarkers();

          // Mark image as cached
          imageCache.current.set(currentViewpoint.imageUrl, true);
        });

        viewer.addEventListener('panorama-load-progress', (e) => {
          if (e.progress) {
            const progress = useProgressiveLoading ? 50 + (e.progress * 0.5) : e.progress;
            setLoadingProgress(Math.round(progress * 100));
          }
        });

        viewer.addEventListener('error', (error) => {
          console.error('Photo Sphere Viewer error:', error);

          // Try fallback strategies
          if (!fallbackMode) {
            setFallbackMode(true);
            setError('Failed to load high-quality image. Switching to compatibility mode.');

            // Retry with a simpler configuration
            setTimeout(() => {
              setError(null);
              initViewer();
            }, 1000);
          } else {
            setError('Failed to load virtual tour. Please check your internet connection and try again.');
          }
          setIsLoading(false);
        });

        // Progressive loading: Load high-res image after placeholder
        if (useProgressiveLoading) {
          try {
            await preloadImage(currentViewpoint.imageUrl);
            setLoadingProgress(70);
            await viewer.setPanorama(currentViewpoint.imageUrl, {
              transition: 1000,
              showLoader: false
            });
          } catch (err) {
            console.warn('Failed to load high-res image, keeping placeholder:', err);
            setIsLoading(false);
            updateMarkers();
          }
        }

      } catch (err) {
        console.error('Failed to initialize viewer:', err);
        setError('Failed to initialize virtual tour viewer. Please refresh the page and try again.');
        setIsLoading(false);
      }
    };

    // Only initialize if images are preloaded or after a timeout
    if (isImagePreloaded) {
      initViewer();
    } else {
      const timeout = setTimeout(initViewer, 2000); // Fallback timeout
      return () => clearTimeout(timeout);
    }

    return () => {
      if (sphereViewerRef.current) {
        sphereViewerRef.current.destroy();
        sphereViewerRef.current = null;
        markersPluginRef.current = null;
      }
    };
  }, [currentViewpoint, tour, isImagePreloaded, viewerConfig]);

  // Update markers when viewpoint or selected seats change
  const updateMarkers = useCallback(() => {
    if (!markersPluginRef.current || !currentViewpoint) return;

    const markers = currentViewpoint.hotspots.map((hotspot: VirtualTourHotspot) => ({
      id: hotspot.id,
      position: { yaw: hotspot.position.yaw, pitch: hotspot.position.pitch },
      html: createHotspotHTML(hotspot),
      anchor: 'center center',
      className: `hotspot hotspot-${hotspot.type}`,
      style: {
        cursor: 'pointer',
        color: hotspot.style.color,
      },
      data: hotspot,
    }));

    // Add seat markers for accessible seats from this viewpoint
    const seatMarkers = currentViewpoint.accessibleSeats.map(seatId => {
      const seat = tour.layout.seats.find(s => s.id === seatId);
      if (!seat) return null;

      return {
        id: `seat-${seatId}`,
        position: { yaw: seat.coordinates.x, pitch: seat.coordinates.y },
        html: createSeatMarkerHTML(seat),
        anchor: 'center center',
        className: `seat-marker seat-${seat.status} ${selectedSeats.includes(seatId) ? 'selected' : ''}`,
        style: {
          cursor: seat.status === 'available' ? 'pointer' : 'default',
        },
        data: { type: 'seat', seat },
      };
    }).filter(Boolean);

    markersPluginRef.current.setMarkers([...markers, ...seatMarkers]);

    // Add click handlers
    markersPluginRef.current.addEventListener('select-marker', (e) => {
      const marker = e.marker;
      const data = marker.data;

      if (data.type === 'seat') {
        handleSeatClick(data.seat);
      } else if (data.action === 'navigate') {
        handleViewpointChange(data.target);
      } else if (data.action === 'show_info') {
        // Handle info display
        console.log('Show info for:', data.title);
      }
    });
  }, [currentViewpoint, selectedSeats, tour.layout.seats]);

  const createHotspotHTML = (hotspot: VirtualTourHotspot): string => {
    const sizeClass = hotspot.style.size === 'large' ? 'w-8 h-8' : 
                     hotspot.style.size === 'medium' ? 'w-6 h-6' : 'w-4 h-4';
    const animationClass = hotspot.style.animation === 'pulse' ? 'animate-pulse' :
                          hotspot.style.animation === 'bounce' ? 'animate-bounce' : '';
    
    return `
      <div class="hotspot-container ${animationClass}">
        <div class="hotspot-icon ${sizeClass} rounded-full flex items-center justify-center text-white font-bold shadow-lg"
             style="background-color: ${hotspot.style.color}">
          ${hotspot.content.icon || '📍'}
        </div>
        <div class="hotspot-tooltip absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
          ${hotspot.content.title}
        </div>
      </div>
    `;
  };

  const createSeatMarkerHTML = (seat: Seat): string => {
    const statusColor = seat.status === 'available' ? '#10b981' :
                       seat.status === 'occupied' ? '#ef4444' :
                       seat.status === 'selected' ? '#3b82f6' :
                       seat.status === 'disabled' ? '#6b7280' : '#f59e0b';
    
    return `
      <div class="seat-marker-container">
        <div class="seat-icon w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold shadow-lg"
             style="background-color: ${statusColor}">
          ${seat.number}
        </div>
        <div class="seat-tooltip absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
          Seat ${seat.number} - ${seat.type.name}
          <br>${seat.position} seat
          ${seat.accessibility.extraLegroom ? '<br>Extra legroom' : ''}
        </div>
      </div>
    `;
  };

  const handleSeatClick = (seat: Seat) => {
    if (seat.status !== 'available') return;

    if (selectedSeats.includes(seat.id)) {
      onSeatDeselect(seat.id);
    } else {
      onSeatSelect(seat.id);
    }
  };

  const handleViewpointChange = (viewpointId: string) => {
    const newViewpoint = tour.viewpoints.find(v => v.id === viewpointId);
    if (newViewpoint) {
      setCurrentViewpoint(newViewpoint);
    }
  };

  const handleZoomIn = () => {
    if (sphereViewerRef.current) {
      sphereViewerRef.current.zoom(sphereViewerRef.current.getZoomLevel() + 10);
    }
  };

  const handleZoomOut = () => {
    if (sphereViewerRef.current) {
      sphereViewerRef.current.zoom(sphereViewerRef.current.getZoomLevel() - 10);
    }
  };

  const handleResetView = () => {
    if (sphereViewerRef.current) {
      sphereViewerRef.current.animate({
        yaw: currentViewpoint.rotation.yaw,
        pitch: currentViewpoint.rotation.pitch,
        zoom: tour.settings.zoomLevels.default,
      });
    }
  };

  // Enhanced keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!sphereViewerRef.current || isLoading || error) return;

      // Prevent default behavior for handled keys
      const handledKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', '+', '-', '=', 'r', 'f', 'Escape'];
      if (handledKeys.includes(e.key)) {
        e.preventDefault();
      }

      const viewer = sphereViewerRef.current;
      const currentPosition = viewer.getPosition();
      const currentZoom = viewer.getZoomLevel();
      const moveStep = 0.1; // radians
      const zoomStep = 10;

      switch (e.key) {
        case 'ArrowLeft':
          viewer.rotate({ yaw: currentPosition.yaw - moveStep, pitch: currentPosition.pitch });
          break;
        case 'ArrowRight':
          viewer.rotate({ yaw: currentPosition.yaw + moveStep, pitch: currentPosition.pitch });
          break;
        case 'ArrowUp':
          viewer.rotate({ yaw: currentPosition.yaw, pitch: Math.min(currentPosition.pitch + moveStep, Math.PI / 2) });
          break;
        case 'ArrowDown':
          viewer.rotate({ yaw: currentPosition.yaw, pitch: Math.max(currentPosition.pitch - moveStep, -Math.PI / 2) });
          break;
        case '+':
        case '=':
          viewer.zoom(Math.min(currentZoom + zoomStep, tour.settings.zoomLevels.max));
          break;
        case '-':
          viewer.zoom(Math.max(currentZoom - zoomStep, tour.settings.zoomLevels.min));
          break;
        case 'r':
          handleResetView();
          break;
        case 'f':
          if (onFullscreenToggle) {
            onFullscreenToggle();
          }
          break;
        case 'Escape':
          if (isFullscreen && onFullscreenToggle) {
            onFullscreenToggle();
          } else {
            onClose();
          }
          break;
      }
    };

    if (!isFullscreen) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      // In fullscreen, only listen on the viewer container
      viewerRef.current?.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      viewerRef.current?.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLoading, error, isFullscreen, currentViewpoint, tour.settings, onFullscreenToggle, onClose]);

  // Focus management for accessibility
  useEffect(() => {
    if (!isLoading && !error && viewerRef.current) {
      viewerRef.current.focus();
    }
  }, [isLoading, error]);

  return (
    <div className={`virtual-tour-viewer relative bg-black ${className} ${isFullscreen ? 'fixed inset-0 z-50' : 'rounded-lg overflow-hidden'}`}>
      {/* Enhanced Loading State with Progress */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-10">
          <div className="text-center text-white max-w-sm mx-auto p-6">
            <div className="relative mb-6">
              <Loader2 className="animate-spin h-16 w-16 mx-auto text-blue-400" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-medium">{loadingProgress}%</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>

            <p className="text-lg font-medium mb-2">Loading virtual tour...</p>
            <p className="text-sm text-gray-300">
              {loadingProgress < 30 ? 'Initializing viewer...' :
               loadingProgress < 60 ? 'Loading panoramic image...' :
               loadingProgress < 90 ? 'Preparing interactive elements...' :
               'Almost ready!'}
            </p>

            {/* Fallback mode indicator */}
            {fallbackMode && (
              <div className="mt-4 p-3 bg-yellow-900 bg-opacity-50 rounded-lg border border-yellow-600">
                <p className="text-yellow-200 text-sm">
                  Running in compatibility mode for better performance
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Enhanced Error State */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-10">
          <div className="text-center text-white max-w-md mx-auto p-6">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {fallbackMode ? 'Compatibility Issue' : 'Error Loading Tour'}
            </h3>
            <p className="text-gray-300 mb-6">{error}</p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setError(null);
                  setIsLoading(true);
                  setLoadingProgress(0);
                }}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>

              {!fallbackMode && (
                <button
                  onClick={() => {
                    setFallbackMode(true);
                    setError(null);
                    setIsLoading(true);
                  }}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Use Compatibility Mode
                </button>
              )}

              <button
                onClick={onClose}
                className="w-full px-4 py-2 border border-gray-500 text-gray-300 rounded hover:bg-gray-800 transition-colors"
              >
                Close Tour
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Sphere Viewer Container with Accessibility */}
      <div
        ref={viewerRef}
        className="w-full h-full min-h-[400px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        tabIndex={0}
        role="application"
        aria-label={`Virtual tour of ${tour.busModel.name} - ${currentViewpoint.name}`}
        aria-describedby="tour-instructions"
        aria-live="polite"
        aria-busy={isLoading}
      />

      {/* Screen Reader Instructions */}
      <div id="tour-instructions" className="sr-only">
        Use arrow keys to navigate the 360-degree view. Press plus or minus to zoom.
        Press R to reset view, F for fullscreen, and Escape to close.
        Tab to navigate between interactive elements.
      </div>

      {/* Enhanced Control Panel with Accessibility */}
      {showControls && !isLoading && !error && (
        <div className="absolute top-4 right-4 flex flex-col space-y-2 z-20" role="toolbar" aria-label="Virtual tour controls">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            title="Close Virtual Tour (Esc)"
            aria-label="Close virtual tour"
          >
            <X size={20} />
          </button>

          {/* Fullscreen Toggle */}
          {onFullscreenToggle && (
            <button
              onClick={onFullscreenToggle}
              className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              title={isFullscreen ? "Exit Fullscreen (F)" : "Enter Fullscreen (F)"}
              aria-label={isFullscreen ? "Exit fullscreen mode" : "Enter fullscreen mode"}
            >
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
          )}

          {/* Zoom Controls */}
          <button
            onClick={handleZoomIn}
            className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            title="Zoom In (+)"
            aria-label="Zoom in"
          >
            <ZoomIn size={20} />
          </button>

          <button
            onClick={handleZoomOut}
            className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            title="Zoom Out (-)"
            aria-label="Zoom out"
          >
            <ZoomOut size={20} />
          </button>

          {/* Reset View */}
          <button
            onClick={handleResetView}
            className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            title="Reset View (R)"
            aria-label="Reset view to default position"
          >
            <RotateCcw size={20} />
          </button>

          {/* Keyboard Shortcuts Help */}
          <button
            onClick={() => setShowControls(!showControls)}
            className="p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            title="Keyboard shortcuts: Arrow keys to navigate, +/- to zoom, R to reset, F for fullscreen, Esc to close"
            aria-label="View keyboard shortcuts"
          >
            <Navigation size={20} />
          </button>
        </div>
      )}

      {/* Keyboard Shortcuts Overlay */}
      {!showControls && !isLoading && !error && (
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={() => setShowControls(true)}
            className="p-2 bg-black bg-opacity-30 text-white rounded-full hover:bg-opacity-50 transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            title="Show controls"
            aria-label="Show virtual tour controls"
          >
            <Navigation size={20} />
          </button>
        </div>
      )}
    </div>
  );
};
