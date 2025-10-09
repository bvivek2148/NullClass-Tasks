
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Route } from '@/Entities/Route.js';
import { Button } from "@/Components/ui/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card.jsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs.jsx";
import { Input } from "@/Components/ui/input.jsx";
import { Badge } from "@/Components/ui/badge.jsx";
import { MapPin, Clock, DollarSign, Calendar, Bus, Train, Plane, Ship, Search, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select.jsx";

const vehicleIcons = {
  bus: Bus,
  train: Train,
  flight: Plane,
  ferry: Ship
};

export default function RoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadRoutes();
  }, []);

  const applyFilters = useCallback(() => {
    let filtered = [...routes];

    if (searchTerm) {
      filtered = filtered.filter(route =>
        route.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.destination.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (vehicleFilter !== 'all') {
      filtered = filtered.filter(route => route.vehicle_type === vehicleFilter);
    }

    if (activeTab === 'popular') {
      filtered = filtered.sort((a, b) => b.price - a.price).slice(0, 6);
    } else if (activeTab === 'budget') {
      filtered = filtered.sort((a, b) => a.price - b.price);
    }

    setFilteredRoutes(filtered);
  }, [routes, searchTerm, vehicleFilter, activeTab]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const loadRoutes = async () => {
    setIsLoading(true);
    const data = await Route.list();
    setRoutes(data);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-slate-900 mb-4">रूट खोजें</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            पूरे देश में सर्वोत्तम यात्रा मार्गों की खोज करें
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="शहर या गंतव्य खोजें..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 text-base rounded-xl border-slate-200 focus:border-orange-300 focus:ring-orange-200"
              />
            </div>
            <Select value={vehicleFilter} onValueChange={setVehicleFilter}>
              <SelectTrigger className="h-12 rounded-xl border-slate-200">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="वाहन प्रकार" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">सभी वाहन</SelectItem>
                <SelectItem value="bus">बस</SelectItem>
                <SelectItem value="train">ट्रेन</SelectItem>
                <SelectItem value="flight">फ्लाइट</SelectItem>
                <SelectItem value="ferry">फेरी</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="all" onValueChange={setActiveTab} className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <TabsList className="grid w-full max-w-xl mx-auto grid-cols-3 h-14 bg-slate-100 p-1 rounded-2xl">
              <TabsTrigger 
                value="all" 
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-300"
              >
                सभी रूट
              </TabsTrigger>
              <TabsTrigger 
                value="popular" 
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-300"
              >
                लोकप्रिय
              </TabsTrigger>
              <TabsTrigger 
                value="budget" 
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-300"
              >
                बजट
              </TabsTrigger>
            </TabsList>
          </motion.div>

          <TabsContent value="all" className="space-y-6">
            <RoutesList routes={filteredRoutes} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="popular" className="space-y-6">
            <RoutesList routes={filteredRoutes} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="budget" className="space-y-6">
            <RoutesList routes={filteredRoutes} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function RoutesList({ routes, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-3">
              <div className="h-6 bg-slate-200 rounded w-3/4" />
              <div className="h-4 bg-slate-200 rounded w-1/2" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="h-4 bg-slate-200 rounded" />
              <div className="h-4 bg-slate-200 rounded w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.05
          }
        }
      }}
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <AnimatePresence>
        {routes.map((route, index) => {
          const VehicleIcon = vehicleIcons[route.vehicle_type] || Bus;
          return (
            <motion.div
              key={route.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Card className="h-full border-slate-200 hover:shadow-xl transition-all duration-300 bg-white overflow-hidden group">
                <div className="h-2 bg-gradient-to-r from-orange-500 to-green-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                        <VehicleIcon className="h-5 w-5 text-white" />
                      </div>
                      <Badge variant="secondary" className="capitalize">
                        {route.vehicle_type === 'bus' ? 'बस' : 
                         route.vehicle_type === 'train' ? 'ट्रेन' : 
                         route.vehicle_type === 'flight' ? 'फ्लाइट' : 'फेरी'}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-2">
                    {route.origin} → {route.destination}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-slate-600">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{route.duration}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{route.distance}</span>
                    </div>
                  </div>

                  {route.available_times && route.available_times.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {route.available_times.slice(0, 3).map((time, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {time}
                        </Badge>
                      ))}
                      {route.available_times.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{route.available_times.length - 3} और
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-slate-900">₹{route.price}</span>
                    </div>
                    <Button className="bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700">
                      बुक करें
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}
