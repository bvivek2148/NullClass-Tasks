
import React, { useState, useRef, useCallback, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from "../Components/ui/card.js";
import { Button } from "../Components/ui/button.js";
import { Badge } from "../Components/ui/badge.js";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Not used in new structure
import { 
  MapPin, 
  Navigation, 
  Save, 
  X, 
  // Zap, // Not used in new structure
  // Clock, // Not used in new structure
  // DollarSign, // Not used in new structure
  // Fuel, // Not used in new structure
  // Share, // Not used in new structure
  // Download, // Not used in new structure
  // RefreshCw, // Not used in new structure
  // AlertTriangle, // Not used in new structure
  // TrendingUp, // Not used in new structure
  // Target, // Not used in new structure
  // Shield, // Not used in new structure
  // Cpu, // Not used in new structure
  // Activity, // Not used in new structure
  // BarChart3 // Not used in new structure
} from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion"; // Not used in new structure
import { Trip } from "../entities/Trip.js";

import LocationSearch from "../Components/route/LocationSearch.js";
import RoutePanel from "../Components/route/RoutePanel.js";
import WaypointsManager from "../Components/route/WaypointsManager.js";
import MapController from "../Components/route/MapController.js";
import TripSaveDialog from "../Components/route/TripSaveDialog.js";
// import RoutePreview from "../components/route/RoutePreview"; // Not used in new structure
// import EnterpriseControls from "../components/route/EnterpriseControls"; // Not used in new structure

import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function RoutePlanner() {
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [waypoints, setWaypoints] = useState([]);
  const [isSelectingStart, setIsSelectingStart] = useState(false);
  const [isSelectingEnd, setIsSelectingEnd] = useState(false);
  const [routeData, setRouteData] = useState(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  // Removed: selectedRoute, travelMode, isCalculating, showRoutePreview, activeTab, routeOptimization as they are not used in the new UI structure
  const mapRef = useRef();

  const handleMapClick = useCallback((lat, lng) => {
    if (isSelectingStart) {
      setStartLocation({ 
        lat, 
        lng, 
        name: `Origin Point`, 
        address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        location_type: 'custom'
      });
      setIsSelectingStart(false);
    } else if (isSelectingEnd) {
      setEndLocation({ 
        lat, 
        lng, 
        name: `Destination`, 
        address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        location_type: 'custom'
      });
      setIsSelectingEnd(false);
    }
  }, [isSelectingStart, isSelectingEnd]);

  const handleRouteCalculated = useCallback((route) => {
    setRouteData(route);
    // Removed: setSelectedRoute and setShowRoutePreview as RoutePreview is removed
  }, []);

  const clearRoute = () => {
    setStartLocation(null);
    setEndLocation(null);
    setWaypoints([]);
    setRouteData(null);
    // Removed: setSelectedRoute, setShowRoutePreview
  };

  const addWaypoint = (location) => {
    const newWaypoint = {
      ...location,
      order: waypoints.length,
      id: Date.now(),
      priority: 'medium', // Default priority, can be customized
      service_time: 0 // Default service time, can be customized
    };
    setWaypoints([...waypoints, newWaypoint]);
  };

  const removeWaypoint = (id) => {
    setWaypoints(waypoints.filter(wp => wp.id !== id));
  };

  const saveTrip = async (tripData) => {
    try {
      // Removed: setIsCalculating(true);
      await Trip.create({
        ...tripData,
        start_location: startLocation,
        end_location: endLocation,
        waypoints,
        route_data: routeData,
        status: 'saved' // Simplified status and removed other fields
      });
      setShowSaveDialog(false);
    } catch (error) {
      console.error('Error saving trip:', error);
    } finally {
      // Removed: setIsCalculating(false);
    }
  };

  // Removed exportRoute and optimizeRoute functions as they are not part of the new UI outline

  return (
    <>
      {/* Removed the style block as glass-morphism and gradient-border classes are removed */}
      
      <div className="h-screen flex">
        {/* Left Control Panel */}
        <div className="w-[400px] bg-white shadow-2xl flex flex-col border-r border-slate-200/60">
          {/* Header */}
          <div className="p-6 border-b border-slate-200/60">
            <h1 className="text-2xl font-black text-slate-900 mb-2">
              Route Planner
            </h1>
            <p className="text-slate-600">Plan your journey across India</p>
          </div>

          {/* Location Inputs */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <LocationSearch
              label="Start Location"
              placeholder="Search for starting point..."
              location={startLocation}
              onLocationSelect={setStartLocation}
              onMapSelect={() => setIsSelectingStart(true)}
              isSelecting={isSelectingStart}
              icon={<MapPin className="w-5 h-5 text-emerald-600" />}
            />

            <LocationSearch
              label="Destination"
              placeholder="Search for destination..."
              location={endLocation}
              onLocationSelect={setEndLocation}
              onMapSelect={() => setIsSelectingEnd(true)}
              isSelecting={isSelectingEnd}
              icon={<Navigation className="w-5 h-5 text-blue-600" />}
            />

            <WaypointsManager
              waypoints={waypoints}
              onAddWaypoint={addWaypoint}
              onRemoveWaypoint={removeWaypoint}
            />
          </div>

          {/* Action Buttons */}
          <div className="p-6 border-t border-slate-200/60 space-y-3">
            <Button 
              onClick={() => setShowSaveDialog(true)}
              disabled={!startLocation || !endLocation}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Trip
            </Button>
            <Button 
              onClick={clearRoute}
              variant="outline"
              className="w-full"
            >
              <X className="w-5 h-5 mr-2" />
              Clear All
            </Button>
          </div>
        </div>

        {/* Route Information (now directly in the layout, not a tab) */}
        {/* Note: The RoutePanel props are simplified as per the outline */}
        <RoutePanel
          startLocation={startLocation}
          endLocation={endLocation}
          waypoints={waypoints}
          routeData={routeData}
          onRouteCalculated={handleRouteCalculated}
          // Removed: travelMode, onTravelModeChange, routeOptimization, onOptimizationChange
        />

        {/* Map Container */}
        <div className="flex-1 p-6">
          <div className="h-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200/60">
            <MapContainer
              center={[20.5937, 78.9629]} // Centered on India
              zoom={5} // Adjusted zoom for India
              style={{ height: '100%', width: '100%' }}
              ref={mapRef}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors' // Simplified attribution
              />
              
              <MapController onMapClick={handleMapClick} />

              {startLocation && (
                <Marker position={[startLocation.lat, startLocation.lng]}>
                  <Popup>
                    <div className="text-center p-2">
                      <div className="font-bold text-emerald-600 mb-1">Start</div>
                      <div className="font-semibold">{startLocation.name}</div>
                      <div className="text-sm text-slate-600">{startLocation.address}</div>
                    </div>
                  </Popup>
                </Marker>
              )}

              {endLocation && (
                <Marker position={[endLocation.lat, endLocation.lng]}>
                  <Popup>
                    <div className="text-center p-2">
                      <div className="font-bold text-blue-600 mb-1">Destination</div>
                      <div className="font-semibold">{endLocation.name}</div>
                      <div className="text-sm text-slate-600">{endLocation.address}</div>
                    </div>
                  </Popup>
                </Marker>
              )}

              {waypoints.map((waypoint, index) => (
                <Marker 
                  key={waypoint.id}
                  position={[waypoint.lat, waypoint.lng]}
                >
                  <Popup>
                    <div className="text-center p-2">
                      <div className="font-bold text-orange-600 mb-1">Stop {index + 1}</div>
                      <div className="font-semibold">{waypoint.name}</div>
                      <div className="text-sm text-slate-600">{waypoint.address}</div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Removed: Enhanced Route Preview Sidebar (AnimatePresence and RoutePreview component) */}

        {/* Save Dialog */}
        <TripSaveDialog
          open={showSaveDialog}
          onClose={() => setShowSaveDialog(false)}
          onSave={saveTrip}
          startLocation={startLocation}
          endLocation={endLocation}
          routeData={routeData}
          // Removed: waypoints from TripSaveDialog props as per outline
        />
      </div>
    </>
  );
}
