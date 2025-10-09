import React, { useState, useEffect } from "react";
import { Trip } from "../entities/Trip.js";
import { Card, CardContent, CardHeader, CardTitle } from "../Components/ui/card.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../Components/ui/tabs.js";
import { Badge } from "../Components/ui/badge.js";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Clock, 
  MapPin, 
  DollarSign, 
  Fuel, 
  Calendar,
  Award,
  Target
} from "lucide-react";
import { motion } from "framer-motion";

export default function Analytics() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

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

  const analytics = {
    totalTrips: trips.length,
    totalDistance: trips.reduce((sum, trip) => sum + (trip.route_data?.distance || 0), 0),
    totalTime: trips.reduce((sum, trip) => sum + (trip.route_data?.duration || 0), 0),
    totalCost: trips.reduce((sum, trip) => sum + (trip.estimated_cost || 0), 0),
    avgTripDistance: trips.length ? trips.reduce((sum, trip) => sum + (trip.route_data?.distance || 0), 0) / trips.length : 0,
    completedTrips: trips.filter(trip => trip.status === 'completed').length,
    efficiency: trips.length ? (trips.filter(trip => trip.status === 'completed').length / trips.length * 100) : 0
  };

  const categoryData = [
    { name: 'Business', value: trips.filter(t => t.category === 'business').length, color: '#3b82f6' },
    { name: 'Personal', value: trips.filter(t => t.category === 'personal').length, color: '#10b981' },
    { name: 'Vacation', value: trips.filter(t => t.category === 'vacation').length, color: '#f59e0b' },
    { name: 'Commute', value: trips.filter(t => t.category === 'commute').length, color: '#ef4444' }
  ];

  const monthlyData = [
    { month: 'Jan', trips: 12, distance: 450, cost: 180 },
    { month: 'Feb', trips: 15, distance: 380, cost: 160 },
    { month: 'Mar', trips: 8, distance: 290, cost: 120 },
    { month: 'Apr', trips: 18, distance: 520, cost: 210 },
    { month: 'May', trips: 22, distance: 680, cost: 280 },
    { month: 'Jun', trips: 20, distance: 590, cost: 240 }
  ];

  const StatCard = ({ title, value, icon: Icon, trend, color, prefix = "", suffix = "" }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 mb-2">{title}</p>
              <p className="text-3xl font-bold text-slate-900">
                {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
              </p>
              {trend && (
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                  <span className="text-sm text-emerald-600 font-medium">{trend}</span>
                </div>
              )}
            </div>
            <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
              <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array(4).fill(0).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-slate-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Travel Analytics</h1>
            <p className="text-slate-600 text-lg">Comprehensive insights into your journey patterns</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-emerald-100 text-emerald-800 px-4 py-2">
              <Award className="w-4 h-4 mr-2" />
              Efficiency: {analytics.efficiency.toFixed(1)}%
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
              <Target className="w-4 h-4 mr-2" />
              {analytics.completedTrips}/{analytics.totalTrips} Completed
            </Badge>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Journeys"
            value={analytics.totalTrips}
            icon={MapPin}
            trend="+12% this month"
            color="bg-blue-500"
          />
          <StatCard
            title="Distance Traveled"
            value={(analytics.totalDistance / 1000).toFixed(1)}
            icon={TrendingUp}
            trend="+8% this month"
            color="bg-emerald-500"
            suffix=" km"
          />
          <StatCard
            title="Time Spent"
            value={Math.round(analytics.totalTime / 3600)}
            icon={Clock}
            trend="+5% this month"
            color="bg-orange-500"
            suffix=" hrs"
          />
          <StatCard
            title="Total Cost"
            value={analytics.totalCost.toFixed(0)}
            icon={DollarSign}
            trend="+15% this month"
            color="bg-purple-500"
            prefix="$"
          />
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4 bg-white shadow-sm">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Overview</TabsTrigger>
            <TabsTrigger value="trends" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Trends</TabsTrigger>
            <TabsTrigger value="categories" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Categories</TabsTrigger>
            <TabsTrigger value="efficiency" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">Efficiency</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="w-5 h-5 text-blue-600" />
                    Monthly Trip Volume
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="trips" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    Distance & Cost Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="distance" stroke="#10b981" strokeWidth={3} />
                      <Line type="monotone" dataKey="cost" stroke="#f59e0b" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Trip Categories Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle>Category Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {categoryData.map((category) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <Badge variant="outline">{category.value} trips</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}