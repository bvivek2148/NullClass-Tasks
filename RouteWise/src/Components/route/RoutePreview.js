import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../Components/ui/card.js";
import { Button } from "../../Components/ui/button.js";
import { Badge } from "../../Components/ui/badge.js";
import { Progress } from "../../Components/ui/progress.js";
import { 
  X, 
  Clock, 
  Navigation, 
  Fuel, 
  DollarSign, 
  Zap, 
  AlertTriangle,
  TrendingUp,
  Shield,
  Target,
  BarChart3,
  Leaf,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";

export default function RoutePreview({ route, onClose, onOptimize, isOptimizing }) {
  const formatTime = (seconds) => {
    const minutes = Math.round(seconds / 60);
    return minutes > 60 ? `${Math.floor(minutes/60)}h ${minutes%60}m` : `${minutes}m`;
  };

  const formatDistance = (meters) => {
    return meters > 1000 ? `${(meters / 1000).toFixed(1)} km` : `${meters} m`;
  };

  const getEfficiencyColor = (score) => {
    if (score >= 90) return 'text-emerald-600 bg-emerald-50';
    if (score >= 75) return 'text-blue-600 bg-blue-50';
    if (score >= 60) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getTrafficColor = (traffic) => {
    switch (traffic) {
      case 'light': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'moderate': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'heavy': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="h-full bg-white/95 backdrop-blur-xl border-l border-slate-200/60 shadow-2xl">
      <style>
        {`
          .glass-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          .metric-card {
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          }
        `}
      </style>
      
      <Card className="h-full rounded-none border-0 shadow-none">
        <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-blue-50/30 p-8">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-2xl font-black">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              Route Intelligence
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClose}
              className="hover:bg-white/50 p-3 rounded-xl"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          {route && (
            <div className="mt-4">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="font-bold text-xl text-slate-900">{route.name}</h3>
                <Badge className={`${getEfficiencyColor(route.efficiency_score || 85)} border`}>
                  {route.efficiency_score || 85}% Efficient
                </Badge>
              </div>
              
              <div className="text-sm text-slate-600 mb-4">
                AI-optimized route with real-time traffic analysis
              </div>

              {/* Efficiency Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-700">Route Optimization</span>
                  <span className="font-bold text-slate-900">{route.efficiency_score || 85}%</span>
                </div>
                <Progress 
                  value={route.efficiency_score || 85} 
                  className="h-2"
                />
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Primary Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="metric-card p-6 rounded-2xl shadow-sm text-center">
              <Clock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <div className="text-3xl font-black text-slate-900 mb-1">
                {formatTime(route?.duration)}
              </div>
              <div className="text-sm text-slate-600 font-semibold">Travel Time</div>
              <div className="text-xs text-blue-600 mt-1 font-medium">Real-time traffic</div>
            </div>
            
            <div className="metric-card p-6 rounded-2xl shadow-sm text-center">
              <Navigation className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
              <div className="text-3xl font-black text-slate-900 mb-1">
                {formatDistance(route?.distance)}
              </div>
              <div className="text-sm text-slate-600 font-semibold">Total Distance</div>
              <div className="text-xs text-emerald-600 mt-1 font-medium">Optimized path</div>
            </div>
          </div>

          {/* Advanced Analytics */}
          <div>
            <h4 className="font-black text-slate-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              Advanced Analytics
            </h4>
            <div className="space-y-4">
              <div className="glass-card p-5 rounded-xl border shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-6 h-6 text-green-600" />
                    <span className="font-bold text-slate-900">Total Cost</span>
                  </div>
                  <span className="text-2xl font-black text-slate-900">
                    ${route?.route_data?.estimated_cost || '24.75'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="text-center p-2 bg-slate-50 rounded-lg">
                    <Fuel className="w-4 h-4 text-slate-500 mx-auto mb-1" />
                    <div className="font-semibold">$12.50</div>
                    <div className="text-xs text-slate-500">Fuel</div>
                  </div>
                  <div className="text-center p-2 bg-slate-50 rounded-lg">
                    <div className="font-semibold">$8.25</div>
                    <div className="text-xs text-slate-500">Tolls</div>
                  </div>
                  <div className="text-center p-2 bg-slate-50 rounded-lg">
                    <div className="font-semibold">$4.00</div>
                    <div className="text-xs text-slate-500">Parking</div>
                  </div>
                </div>
              </div>

              <div className="glass-card p-5 rounded-xl border shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Leaf className="w-6 h-6 text-emerald-600" />
                    <span className="font-bold text-slate-900">Environmental Impact</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="text-xl font-black text-emerald-800">2.1 kg</div>
                    <div className="text-sm text-emerald-600 font-semibold">CO₂ Emissions</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-xl font-black text-blue-800">1.2 L</div>
                    <div className="text-sm text-blue-600 font-semibold">Fuel Usage</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Traffic Analysis */}
          <div>
            <h4 className="font-black text-slate-900 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-600" />
              Live Traffic Analysis
            </h4>
            
            <div className="space-y-3">
              <div className={`p-4 rounded-xl border ${getTrafficColor(route?.route_data?.traffic_conditions)}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold">Current Conditions</span>
                  <Badge className={getTrafficColor(route?.route_data?.traffic_conditions)}>
                    {route?.route_data?.traffic_conditions || 'moderate'}
                  </Badge>
                </div>
                <div className="text-sm opacity-80">
                  Based on real-time traffic data and historical patterns
                </div>
              </div>
              
              {route?.trafficDelay > 300 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl border border-orange-200"
                >
                  <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-orange-800">Traffic Alert</div>
                    <div className="text-sm text-orange-700">
                      Expected delay: +{formatTime(route.trafficDelay)}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Route Optimization */}
          <div>
            <h4 className="font-black text-slate-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
              AI Optimization
            </h4>
            
            <div className="space-y-4">
              <Button 
                onClick={onOptimize}
                disabled={isOptimizing}
                className="w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xl font-bold text-lg"
              >
                {isOptimizing ? (
                  <>
                    <div className="w-5 h-5 mr-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    AI Optimizing Route...
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-6 h-6 mr-3" />
                    Enhance with AI
                  </>
                )}
              </Button>
              
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" size="sm" className="font-semibold">
                  <Shield className="w-4 h-4 mr-2" />
                  Avoid Tolls
                </Button>
                <Button variant="outline" size="sm" className="font-semibold">
                  <Leaf className="w-4 h-4 mr-2" />
                  Eco Mode
                </Button>
              </div>
            </div>
          </div>

          {/* Performance Insights */}
          <div>
            <h4 className="font-black text-slate-900 mb-4">Performance Insights</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="font-semibold text-slate-700">Route Efficiency</span>
                <span className="font-black text-slate-900">{route?.efficiency_score || 85}%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="font-semibold text-slate-700">Time Savings</span>
                <span className="font-black text-emerald-600">12 minutes</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="font-semibold text-slate-700">Cost Optimization</span>
                <span className="font-black text-blue-600">$8.50 saved</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="font-semibold text-slate-700">Carbon Reduction</span>
                <span className="font-black text-green-600">0.8 kg CO₂</span>
              </div>
            </div>
          </div>

          {/* Weather & Conditions */}
          {route?.route_data?.weather_conditions && (
            <div>
              <h4 className="font-black text-slate-900 mb-3">Conditions Report</h4>
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <div className="text-sm font-semibold text-blue-800 mb-1">Weather Conditions</div>
                <div className="text-sm text-blue-700">
                  {route.route_data.weather_conditions}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}