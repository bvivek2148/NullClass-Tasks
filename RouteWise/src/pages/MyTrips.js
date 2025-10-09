
import React, { useState, useEffect } from "react";
import { Trip } from "../entities/Trip.js";
import { Card, CardContent, CardHeader, CardTitle } from "../Components/ui/card.js";
import { Button } from "../Components/ui/button.js";
import { Badge } from "../Components/ui/badge.js";
import { MapPin, Navigation, Clock, MapIcon, Trash2, Edit } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const fetchedTrips = await Trip.list('-created_date');
      setTrips(fetchedTrips);
    } catch (error) {
      console.error('Error loading trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTrip = async (id) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        await Trip.delete(id);
        setTrips(trips.filter(trip => trip.id !== id));
      } catch (error) {
        console.error('Error deleting trip:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-800';
      case 'saved': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-orange-100 text-orange-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const formatDistance = (distance) => {
    if (!distance) return 'N/A';
    return distance > 1000 ? `${(distance / 1000).toFixed(1)} km` : `${distance.toFixed(0)} m`;
  };

  const formatDuration = (duration) => {
    if (!duration) return 'N/A';
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-6">
            {Array(3).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Trips</h1>
          <p className="text-slate-600">Manage your saved journeys and travel plans</p>
        </div>

        {trips.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <MapIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No trips yet</h3>
              <p className="text-slate-500 mb-6">Start planning your first journey with the route planner</p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Plan Your First Trip
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {trips.map((trip, index) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow duration-300 border-slate-200/60">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-slate-900">{trip.name}</h3>
                          <Badge className={getStatusColor(trip.status)}>
                            {trip.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-500 mb-4">
                          Created {format(new Date(trip.created_date), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteTrip(trip.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-slate-900">From</div>
                            <div className="text-sm text-slate-600">
                              {trip.start_location?.name || trip.start_location?.address || 'Unknown location'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <Navigation className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-slate-900">To</div>
                            <div className="text-sm text-slate-600">
                              {trip.end_location?.name || trip.end_location?.address || 'Unknown location'}
                            </div>
                          </div>
                        </div>

                        {trip.waypoints && trip.waypoints.length > 0 && (
                          <div className="flex items-start gap-3">
              <MapIcon className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="font-medium text-slate-900">Waypoints</div>
                              <div className="text-sm text-slate-600">
                                {trip.waypoints.length} stops planned
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        {trip.route_data && (
                          <>
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                              <span className="text-sm font-medium text-slate-700">Distance</span>
                              <span className="font-bold text-slate-900">
                                {formatDistance(trip.route_data.distance)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                              <span className="text-sm font-medium text-slate-700">Duration</span>
                              <span className="font-bold text-slate-900">
                                {formatDuration(trip.route_data.duration)}
                              </span>
                            </div>
                          </>
                        )}
                        
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <span className="text-sm font-medium text-slate-700">Travel Mode</span>
                          <span className="font-bold text-slate-900 capitalize">
                            {trip.travel_mode || 'driving'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {trip.notes && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <div className="text-sm font-medium text-blue-900 mb-1">Notes</div>
                        <div className="text-sm text-blue-800">{trip.notes}</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
