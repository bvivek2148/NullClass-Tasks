
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../Components/ui/card.js";
import { Button } from "../../Components/ui/button.js";
import { Badge } from "../../Components/ui/badge.js";
import { Separator } from "../../Components/ui/separator.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../Components/ui/tabs.js";
import { 
  MapIcon, 
  Clock, 
  AlertTriangle 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RoutePanel({ 
  startLocation, 
  endLocation, 
  waypoints, 
  routeData, 
  onRouteCalculated,
  travelMode, // Removed from outline, but keeping it as a prop as it exists in current file
  onTravelModeChange // Removed from outline, but keeping it as a prop as it exists in current file
}) {
  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(0);

  const calculateRoutes = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockRoutes = [
        {
          id: 0,
          name: "Fastest Route",
          distance: 18500, // meters
          duration: 2400, // seconds (40 minutes)
          trafficDelay: 420, // seconds (7 minutes)
          type: "primary",
          estimated_cost: 245, // INR
          toll_cost: 85, // INR
          fuel_cost: 160, // INR
          coordinates: [
            [startLocation.lat, startLocation.lng],
            ...waypoints.map(wp => [wp.lat, wp.lng]),
            [endLocation.lat, endLocation.lng]
          ]
        },
        {
          id: 1,
          name: "Toll-Free Route",
          distance: 22100, // meters
          duration: 3000, // seconds (50 minutes)
          trafficDelay: 180, // seconds (3 minutes)
          type: "alternative",
          estimated_cost: 195, // INR
          toll_cost: 0, // INR
          fuel_cost: 195, // INR
          coordinates: [
            [startLocation.lat, startLocation.lng],
            ...waypoints.map(wp => [wp.lat, wp.lng]),
            [endLocation.lat, endLocation.lng]
          ]
        },
        {
          id: 2,
          name: "Highway Route",
          distance: 16200, // meters
          duration: 2100, // seconds (35 minutes)
          trafficDelay: 600, // seconds (10 minutes)
          type: "alternative",
          estimated_cost: 310, // INR
          toll_cost: 145, // INR
          fuel_cost: 165, // INR
          coordinates: [
            [startLocation.lat, startLocation.lng],
            ...waypoints.map(wp => [wp.lat, wp.lng]),
            [endLocation.lat, endLocation.lng]
          ]
        }
      ];

      setRoutes(mockRoutes);
      onRouteCalculated(mockRoutes[0]);
      setSelectedRoute(0); // Ensure the first route is selected visually
    } catch (error) {
      console.error("Route calculation error:", error);
    } finally {
      setLoading(false);
    }
  }, [startLocation, endLocation, waypoints, onRouteCalculated]);

  useEffect(() => {
    if (startLocation && endLocation) {
      calculateRoutes();
    } else {
      setRoutes([]);
      onRouteCalculated(null);
    }
  }, [startLocation, endLocation, waypoints, calculateRoutes, onRouteCalculated]);

  const formatDistance = (distance) => {
    return distance > 1000 ? `${(distance / 1000).toFixed(1)} km` : `${distance} m`;
  };

  const formatDuration = (duration) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const selectRoute = (route) => {
    setSelectedRoute(route.id);
    onRouteCalculated(route);
  };

  if (!startLocation || !endLocation) {
    return (
      <div className="p-6">
        <Card className="text-center py-12 bg-gradient-to-br from-slate-50 to-blue-50/30 border-0">
          <CardContent>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-bold text-slate-800 mb-2 text-lg">Ready to Plan</h3>
            <p className="text-slate-600">
              Select your start and end points to find the best routes across India
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="font-bold text-slate-900 mb-2 text-lg">Route Options</h3>
        <p className="text-slate-600 text-sm">Compare routes with real-time Indian traffic data</p>
      </div>

      <AnimatePresence>
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {Array(3).fill(0).map((_, i) => (
              <Card key={i} className="p-4 animate-pulse border-0 shadow-md">
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-3"></div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-4 bg-slate-200 rounded"></div>
                  <div className="h-4 bg-slate-200 rounded"></div>
                  <div className="h-4 bg-slate-200 rounded"></div>
                </div>
              </Card>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {routes.map((route) => (
              <motion.div
                key={route.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-300 border-0 shadow-lg ${
                    selectedRoute === route.id 
                      ? 'ring-2 ring-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-xl' 
                      : 'hover:bg-slate-50 hover:shadow-xl'
                  }`}
                  onClick={() => selectRoute(route)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-bold text-slate-900">{route.name}</h4>
                        <p className="text-sm text-slate-600">
                          {route.type === 'primary' ? 'Recommended' : 'Alternative option'}
                        </p>
                      </div>
                      {route.trafficDelay > 300 && (
                        <Badge className="bg-orange-100 text-orange-800">
                          Heavy Traffic
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 bg-white/80 rounded-lg">
                        <MapIcon className="w-5 h-5 text-slate-500 mx-auto mb-1" />
                        <div className="font-bold text-slate-900">
                          {formatDistance(route.distance)}
                        </div>
                        <div className="text-xs text-slate-600">Distance</div>
                      </div>

                      <div className="text-center p-3 bg-white/80 rounded-lg">
                        <Clock className="w-5 h-5 text-slate-500 mx-auto mb-1" />
                        <div className="font-bold text-slate-900">
                          {formatDuration(route.duration)}
                        </div>
                        <div className="text-xs text-slate-600">Time</div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-lg border border-emerald-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-emerald-900">Total Cost</span>
                        <span className="text-2xl font-black text-emerald-900">₹{route.estimated_cost}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex justify-between text-emerald-700">
                          <span>Fuel:</span>
                          <span className="font-semibold">₹{route.fuel_cost}</span>
                        </div>
                        <div className="flex justify-between text-emerald-700">
                          <span>Tolls:</span>
                          <span className="font-semibold">₹{route.toll_cost}</span>
                        </div>
                      </div>
                    </div>

                    {route.trafficDelay > 300 && (
                      <div className="mt-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="text-sm text-orange-800 font-semibold">
                          ⚠️ +{formatDuration(route.trafficDelay)} due to traffic congestion
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
