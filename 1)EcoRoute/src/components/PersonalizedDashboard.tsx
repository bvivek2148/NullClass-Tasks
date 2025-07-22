'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { UserProfile, TripRecord, CarbonFootprintSummary } from '@/lib/types';

// Vivek Bukka's personalized profile data
const mockUserProfile: UserProfile = {
  id: 'vivek-bukka-2024',
  email: 'vivek.bukka@ecoroute.com',
  name: 'Vivek Bukka',
  preferences: {
    defaultTransportMode: 'electric_car',
    carbonGoals: {
      daily: 800, // grams
      weekly: 5600, // grams
      monthly: 24000 // grams
    },
    notifications: true
  },
  stats: {
    totalCO2Saved: 18750, // grams - Vivek is an eco champion!
    currentStreak: 12, // days - impressive streak
    totalTrips: 67,
    achievements: []
  }
};

// Vivek's impressive weekly performance data
const mockWeeklyData = [
  { date: '2024-07-06', emissions: 320, savings: 280, trips: 4, mood: '😊' },
  { date: '2024-07-07', emissions: 180, savings: 420, trips: 3, mood: '🌟' },
  { date: '2024-07-08', emissions: 0, savings: 650, trips: 5, mood: '🎉' },
  { date: '2024-07-09', emissions: 120, savings: 380, trips: 4, mood: '💚' },
  { date: '2024-07-10', emissions: 80, savings: 520, trips: 3, mood: '🚀' },
  { date: '2024-07-11', emissions: 0, savings: 720, trips: 6, mood: '🏆' },
  { date: '2024-07-12', emissions: 60, savings: 480, trips: 4, mood: '⭐' }
];

// Vivek's outstanding monthly progress - showing continuous improvement
const mockMonthlyData = [
  { month: 'Jan', emissions: 9200, savings: 1800, goal: 2000 },
  { month: 'Feb', emissions: 7800, savings: 3200, goal: 2500 },
  { month: 'Mar', emissions: 6100, savings: 4800, goal: 3000 },
  { month: 'Apr', emissions: 4900, savings: 6200, goal: 3500 },
  { month: 'May', emissions: 3600, savings: 7800, goal: 4000 },
  { month: 'Jun', emissions: 2400, savings: 9500, goal: 4500 },
  { month: 'Jul', emissions: 1800, savings: 11200, goal: 5000 }
];

// Vivek's smart transportation choices - tech-savvy and eco-conscious
const mockTransportModeData = [
  { name: 'Electric Car', value: 40, emissions: 800, color: '#8b5cf6', trend: '+5%' },
  { name: 'Cycling', value: 30, emissions: 0, color: '#3b82f6', trend: '+12%' },
  { name: 'Walking', value: 15, emissions: 0, color: '#10b981', trend: '+8%' },
  { name: 'Public Transport', value: 10, emissions: 600, color: '#f59e0b', trend: '-3%' },
  { name: 'E-Scooter', value: 5, emissions: 15, color: '#06b6d4', trend: '+15%' }
];

interface PersonalizedDashboardProps {
  user?: UserProfile;
}

export function PersonalizedDashboard({ user = mockUserProfile }: PersonalizedDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Mock login state
  const [isLoading, setIsLoading] = useState(false);

  // Local state for user preferences
  const [userPreferences, setUserPreferences] = useState({
    defaultTransportMode: user.preferences.defaultTransportMode,
    monthlyGoal: user.preferences.carbonGoals.monthly,
    notifications: user.preferences.notifications
  });

  // Handle preference changes
  const handleTransportModeChange = (mode: string) => {
    setUserPreferences(prev => ({ ...prev, defaultTransportMode: mode }));
  };

  const handleMonthlyGoalChange = (goal: number) => {
    setUserPreferences(prev => ({ ...prev, monthlyGoal: goal }));
  };

  const handleNotificationToggle = () => {
    setUserPreferences(prev => ({ ...prev, notifications: !prev.notifications }));
  };

  const handleSavePreferences = async () => {
    // Validate monthly goal
    if (userPreferences.monthlyGoal < 0) {
      alert('❌ Monthly goal must be a positive number');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In production, this would save to the database
    alert(`✅ Preferences saved!\n\nDefault Transport: ${userPreferences.defaultTransportMode}\nMonthly Goal: ${userPreferences.monthlyGoal}g CO₂\nNotifications: ${userPreferences.notifications ? 'Enabled' : 'Disabled'}`);

    setIsLoading(false);
  };

  // Calculate current period stats
  const currentWeekSavings = mockWeeklyData.reduce((sum, day) => sum + day.savings, 0);
  const currentWeekEmissions = mockWeeklyData.reduce((sum, day) => sum + day.emissions, 0);
  const weeklyGoalProgress = (currentWeekSavings / user.preferences.carbonGoals.weekly) * 100;

  if (!isLoggedIn) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔐</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Sign In Required</h3>
          <p className="text-gray-600 mb-6">
            Create an account or sign in to access your personalized carbon footprint dashboard with detailed analytics and progress tracking.
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => setIsLoggedIn(true)}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
            >
              Sign In with Google
            </button>
            <button 
              onClick={() => setIsLoggedIn(true)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Sign In with Email
            </button>
            <button 
              onClick={() => setIsLoggedIn(true)}
              className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
            >
              Create New Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Professional Executive Dashboard Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-2xl font-bold text-slate-700">VB</span>
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-semibold">Vivek Bukka</h1>
                <p className="text-slate-300 text-sm">Senior Software Engineer • Sustainability Lead</p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <span className="text-slate-300 text-xs">Active • Platinum Eco Champion</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right text-white">
                <div className="text-sm text-slate-300">Last Login</div>
                <div className="text-sm font-medium">Today, 9:15 AM</div>
              </div>
              <button
                onClick={() => setIsLoggedIn(false)}
                className="bg-slate-600 hover:bg-slate-500 px-4 py-2 rounded-lg transition-colors text-white text-sm font-medium border border-slate-500"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Executive Summary Cards */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Current Streak */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{user.stats.currentStreak}</div>
                  <div className="text-gray-500 text-sm font-medium">Day Streak</div>
                </div>
              </div>
              <div className="text-xs text-gray-600">Consecutive eco-friendly days</div>
            </div>

            {/* CO2 Saved */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{(user.stats.totalCO2Saved / 1000).toFixed(1)}kg</div>
                  <div className="text-gray-500 text-sm font-medium">CO₂ Reduced</div>
                </div>
              </div>
              <div className="text-xs text-gray-600">Total carbon footprint reduction</div>
            </div>

            {/* Sustainable Trips */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707L16 7.586A1 1 0 0015.414 7H14z" />
                  </svg>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{user.stats.totalTrips}</div>
                  <div className="text-gray-500 text-sm font-medium">Eco Trips</div>
                </div>
              </div>
              <div className="text-xs text-gray-600">Sustainable transportation choices</div>
            </div>

            {/* Cost Savings */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">₹{Math.round(user.stats.totalTrips * 45)}</div>
                  <div className="text-gray-500 text-sm font-medium">Cost Savings</div>
                </div>
              </div>
              <div className="text-xs text-gray-600">Compared to traditional transport</div>
            </div>
          </div>

          {/* Professional Achievement Progress */}
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Sustainability Achievement Progress</h3>
                <p className="text-gray-600 text-sm">Advancing to Diamond Eco Champion Status</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-700">85%</div>
                  <div className="text-slate-500 text-sm">Progress</div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center shadow-sm">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-gradient-to-r from-slate-600 to-slate-500 h-3 rounded-full transition-all duration-1000 relative" style={{ width: '85%' }}>
                  <div className="absolute right-0 top-0 w-3 h-3 bg-white rounded-full shadow-sm transform translate-x-1.5"></div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-3">
                <span className="font-medium">Current: Platinum Level</span>
                <span className="font-medium">Target: Diamond Level (15% remaining)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Analytics Dashboard */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Analytics Header */}
        <div className="bg-slate-50 border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-1">Environmental Impact Analytics</h3>
              <p className="text-gray-600">Comprehensive sustainability metrics and performance indicators</p>
            </div>
            <div className="flex space-x-2">
              {(['week', 'month', 'year'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedPeriod === period
                      ? 'bg-slate-700 text-white shadow-sm'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}ly
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Professional KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-emerald-600 text-xs font-medium bg-emerald-50 px-2 py-1 rounded">+12% WoW</div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{currentWeekSavings}g</div>
              <div className="text-gray-600 text-sm font-medium">CO₂ Emissions Reduced</div>
              <div className="text-xs text-gray-500 mt-1">This week vs baseline</div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707L16 7.586A1 1 0 0015.414 7H14z" />
                  </svg>
                </div>
                <div className="text-blue-600 text-xs font-medium bg-blue-50 px-2 py-1 rounded">+8% WoW</div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{mockWeeklyData.reduce((sum, day) => sum + day.trips, 0)}</div>
              <div className="text-gray-600 text-sm font-medium">Sustainable Trips</div>
              <div className="text-xs text-gray-500 mt-1">Eco-friendly transportation</div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-orange-600 text-xs font-medium bg-orange-50 px-2 py-1 rounded">vs baseline</div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">₹{Math.round(currentWeekSavings * 0.8)}</div>
              <div className="text-gray-600 text-sm font-medium">Cost Optimization</div>
              <div className="text-xs text-gray-500 mt-1">Savings vs traditional transport</div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-purple-600 text-xs font-medium bg-purple-50 px-2 py-1 rounded">Target: 100%</div>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{Math.round(weeklyGoalProgress)}%</div>
              <div className="text-gray-600 text-sm font-medium">Goal Achievement</div>
              <div className="text-xs text-gray-500 mt-1">Monthly sustainability target</div>
            </div>
          </div>

          {/* Professional Charts Section */}
          <div className="space-y-8 mb-8">
            {/* Weekly Performance Chart */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Weekly Performance Metrics</h4>
                    <p className="text-gray-600 text-sm">CO₂ reduction and sustainability indicators</p>
                  </div>
                  <div className="bg-slate-50 border border-gray-200 px-4 py-2 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{currentWeekSavings}g</div>
                      <div className="text-xs text-gray-600">Total Reduction</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Chart Area */}
              <div className="p-6">
                <div className="relative h-64 bg-gray-50 rounded-lg p-4">
                  <div className="absolute inset-4 flex items-end justify-between">
                    {mockWeeklyData.map((day, index) => (
                      <div key={day.date} className="flex flex-col items-center space-y-2 group">
                        {/* Data Value */}
                        <div className="bg-white px-2 py-1 rounded shadow-sm border text-xs font-medium text-gray-700">
                          {day.savings}g
                        </div>

                        {/* Professional Bar */}
                        <div
                          className="w-12 bg-slate-600 hover:bg-slate-700 transition-colors duration-300 relative"
                          style={{
                            height: `${Math.max((day.savings / 800) * 200, 8)}px`,
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-700 to-slate-500"></div>
                        </div>

                        {/* Day Label */}
                        <div className="text-center">
                          <div className="font-medium text-gray-900 text-xs">
                            {new Date(day.date).toLocaleDateString('en-IN', { weekday: 'short' })}
                          </div>
                          <div className="text-xs text-gray-500">{day.trips} trips</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-4 h-52 flex flex-col justify-between text-xs text-gray-500">
                    <span>800g</span>
                    <span>600g</span>
                    <span>400g</span>
                    <span>200g</span>
                    <span>0g</span>
                  </div>
                </div>

                {/* Professional Legend */}
                <div className="flex items-center justify-center mt-4 space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-slate-600 rounded"></div>
                    <span className="text-gray-700 text-sm font-medium">CO₂ Emissions Reduced (grams)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-300 rounded"></div>
                    <span className="text-gray-700 text-sm font-medium">Trip Count</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Transportation Mode Analysis */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Transportation Mode Distribution</h4>
                    <p className="text-gray-600 text-sm">Usage patterns and sustainability metrics</p>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-bold text-emerald-700">A+</div>
                      <div className="text-xs text-emerald-600">Sustainability Score</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Transportation Modes */}
                  <div className="lg:col-span-2 space-y-4">
                    {mockTransportModeData.map((mode, index) => (
                      <div key={mode.name} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: mode.color }}
                            ></div>
                            <div>
                              <div className="font-semibold text-gray-900">{mode.name}</div>
                              <div className="text-gray-600 text-sm">{mode.emissions}g CO₂/km</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-xl text-gray-900">{mode.value}%</div>
                            <div className={`text-xs font-medium px-2 py-1 rounded ${
                              mode.trend?.startsWith('+') ? 'text-emerald-700 bg-emerald-100' : 'text-red-700 bg-red-100'
                            }`}>
                              {mode.trend}
                            </div>
                          </div>
                        </div>

                        {/* Professional Progress Bar */}
                        <div className="w-full bg-gray-200 rounded h-2">
                          <div
                            className="h-2 rounded transition-all duration-1000"
                            style={{
                              width: `${mode.value}%`,
                              backgroundColor: mode.color,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Professional Summary Stats */}
                  <div className="space-y-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <h5 className="text-sm font-semibold text-gray-900 mb-3">Sustainability Metrics</h5>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            <span className="text-gray-700 text-sm font-medium">Zero Emission</span>
                          </div>
                          <div className="font-bold text-emerald-600">
                            {mockTransportModeData.filter(m => m.emissions === 0).reduce((sum, m) => sum + m.value, 0)}%
                          </div>
                        </div>

                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-gray-700 text-sm font-medium">Electric Powered</span>
                          </div>
                          <div className="font-bold text-blue-600">
                            {mockTransportModeData.filter(m => m.name.includes('Electric') || m.name.includes('E-')).reduce((sum, m) => sum + m.value, 0)}%
                          </div>
                        </div>

                        <div className="flex items-center justify-between py-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span className="text-gray-700 text-sm font-medium">Low Carbon</span>
                          </div>
                          <div className="font-bold text-orange-600">
                            {mockTransportModeData.filter(m => m.emissions < 100).reduce((sum, m) => sum + m.value, 0)}%
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-gray-200 rounded-lg p-4">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center mx-auto mb-3">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                        <div className="font-bold text-lg text-gray-900">Platinum Level</div>
                        <div className="text-gray-600 text-sm">Eco Champion Status</div>
                        <div className="mt-3 bg-white rounded p-2 border">
                          <div className="text-xs text-gray-600">Progress to Diamond</div>
                          <div className="text-lg font-bold text-gray-900">85%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Trend Chart */}
        {selectedPeriod === 'week' && (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockWeeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => format(new Date(date), 'EEE')}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(date) => format(new Date(date), 'MMM dd, yyyy')}
                  formatter={(value, name) => [
                    `${value}g`,
                    name === 'emissions' ? 'CO₂ Emissions' : 'CO₂ Saved'
                  ]}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="savings" 
                  stackId="1" 
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.6}
                  name="CO₂ Saved"
                />
                <Area 
                  type="monotone" 
                  dataKey="emissions" 
                  stackId="2" 
                  stroke="#ef4444" 
                  fill="#ef4444" 
                  fillOpacity={0.6}
                  name="CO₂ Emissions"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Monthly Trend Chart */}
        {selectedPeriod === 'month' && (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockMonthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}g`, '']} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="emissions" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  name="CO₂ Emissions"
                />
                <Line 
                  type="monotone" 
                  dataKey="savings" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="CO₂ Saved"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Enhanced Transportation & Goals Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Professional Transportation Mode Analysis */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Transportation Mode Analysis</h3>
                <p className="text-sm text-gray-600">Monthly usage distribution and efficiency metrics</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
                <span className="text-emerald-700 text-sm font-medium">Optimized</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Enhanced Mode List */}
            <div className="space-y-4 mb-6">
              {mockTransportModeData.map((mode, index) => (
                <div key={mode.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full shadow-sm"
                        style={{ backgroundColor: mode.color }}
                      ></div>
                      <div>
                        <div className="font-semibold text-gray-900">{mode.name}</div>
                        <div className="text-sm text-gray-600">{mode.emissions}g CO₂/km</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="font-bold text-lg text-gray-900">{mode.value}%</div>
                      <div className={`text-xs font-medium px-2 py-1 rounded ${
                        mode.trend?.startsWith('+') ? 'text-emerald-700 bg-emerald-100' : 'text-red-700 bg-red-100'
                      }`}>
                        {mode.trend}
                      </div>
                    </div>

                    {/* Mini Progress Circle */}
                    <div className="relative w-12 h-12">
                      <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="2"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke={mode.color}
                          strokeWidth="2"
                          strokeDasharray={`${mode.value}, 100`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-700">{mode.value}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="text-lg font-bold text-emerald-600">
                  {mockTransportModeData.filter(m => m.emissions === 0).reduce((sum, m) => sum + m.value, 0)}%
                </div>
                <div className="text-xs text-gray-600">Zero Emission</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {mockTransportModeData.filter(m => m.emissions < 50).reduce((sum, m) => sum + m.value, 0)}%
                </div>
                <div className="text-xs text-gray-600">Low Carbon</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">
                  {Math.round(mockTransportModeData.reduce((sum, m) => sum + (m.emissions * m.value), 0) / 100)}g
                </div>
                <div className="text-xs text-gray-600">Avg CO₂/km</div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Weekly Goals & Performance */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Weekly Performance Goals</h3>
                <p className="text-sm text-gray-600">Sustainability targets and achievement tracking</p>
              </div>
              <div className="bg-slate-50 border border-gray-200 px-3 py-1 rounded-lg">
                <span className="text-slate-700 text-sm font-medium">Week {Math.ceil(new Date().getDate() / 7)}</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Primary Goal - CO₂ Savings */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="font-semibold text-gray-900">CO₂ Reduction Target</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">{currentWeekSavings}g / {user.preferences.carbonGoals.weekly}g</div>
                  <div className="text-xs text-gray-600">{Math.round(weeklyGoalProgress)}% complete</div>
                </div>
              </div>

              {/* Enhanced Progress Bar */}
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-4 rounded-full transition-all duration-1000 relative"
                    style={{ width: `${Math.min(weeklyGoalProgress, 100)}%` }}
                  >
                    <div className="absolute inset-0 bg-white bg-opacity-20 rounded-full"></div>
                  </div>
                </div>
                <div className="absolute right-0 top-0 h-4 flex items-center">
                  <div className="w-4 h-4 bg-white border-2 border-emerald-500 rounded-full shadow-sm"></div>
                </div>
              </div>

              <div className="flex justify-between text-xs text-gray-600 mt-2">
                <span>0g</span>
                <span className="font-medium">
                  {weeklyGoalProgress >= 100 ? '🎯 Target Achieved!' : `${(user.preferences.carbonGoals.weekly - currentWeekSavings)}g remaining`}
                </span>
                <span>{user.preferences.carbonGoals.weekly}g</span>
              </div>
            </div>

            {/* Secondary Goals */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                      <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707L16 7.586A1 1 0 0015.414 7H14z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Sustainable Trips</div>
                    <div className="text-sm text-gray-600">Weekly target: 15 trips</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-blue-600">{mockWeeklyData.reduce((sum, day) => sum + day.trips, 0)}/15</div>
                  <div className="text-xs text-gray-600">{Math.round((mockWeeklyData.reduce((sum, day) => sum + day.trips, 0) / 15) * 100)}%</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Consistency Streak</div>
                    <div className="text-sm text-gray-600">Target: 7 consecutive days</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-orange-600">{user.stats.currentStreak}/7</div>
                  <div className="text-xs text-gray-600">{Math.round((user.stats.currentStreak / 7) * 100)}%</div>
                </div>
              </div>
            </div>

            {/* Achievement Badge */}
            <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Weekly Performance</div>
                    <div className="text-sm text-gray-600">
                      {weeklyGoalProgress >= 100 ? 'Excellent - Target Exceeded' :
                       weeklyGoalProgress >= 80 ? 'Good - On Track' :
                       weeklyGoalProgress >= 60 ? 'Fair - Needs Improvement' : 'Below Target'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${
                    weeklyGoalProgress >= 100 ? 'text-emerald-600' :
                    weeklyGoalProgress >= 80 ? 'text-blue-600' :
                    weeklyGoalProgress >= 60 ? 'text-orange-600' : 'text-red-600'
                  }`}>
                    {weeklyGoalProgress >= 100 ? 'A+' :
                     weeklyGoalProgress >= 80 ? 'A' :
                     weeklyGoalProgress >= 60 ? 'B' : 'C'}
                  </div>
                  <div className="text-xs text-gray-600">Grade</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Activity & Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Transportation Activity</h3>
              <div className="text-sm text-gray-500">Last 7 days</div>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {[
                { date: '2024-07-12', mode: 'Electric Car', from: 'Koramangala', to: 'Whitefield Tech Park', saved: 420, cost: 180 },
                { date: '2024-07-11', mode: 'Cycling', from: 'HSR Layout', to: 'Indiranagar Café', saved: 280, cost: 0 },
                { date: '2024-07-11', mode: 'E-Scooter', from: 'Indiranagar', to: 'MG Road Office', saved: 150, cost: 25 },
                { date: '2024-07-10', mode: 'Walking', from: 'Home', to: 'Local Gym', saved: 320, cost: 0 },
                { date: '2024-07-09', mode: 'Metro', from: 'Koramangala', to: 'Kempegowda Airport', saved: 380, cost: 65 },
              ].map((trip, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                      <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{trip.from} → {trip.to}</div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>{trip.mode}</span>
                        <span>•</span>
                        <span>{new Date(trip.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">{trip.saved}g CO₂</div>
                    <div className="text-sm text-gray-600">₹{trip.cost}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Summary */}
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">Weekly Performance Summary</div>
                  <div className="text-sm text-gray-600">Environmental impact metrics</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">+{currentWeekSavings}g</div>
                  <div className="text-sm text-gray-500">Total CO₂ saved</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">⚙️ Vivek's Smart Preferences</h3>
            <div className="text-sm text-gray-500">Customize your experience</div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                🚗 Preferred Transportation Mode
              </label>
              <select
                value={userPreferences.defaultTransportMode}
                onChange={(e) => handleTransportModeChange(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white font-medium transition-all duration-300"
              >
                <option value="walking">🚶 Walking - Zero emissions</option>
                <option value="cycling">🚴 Cycling - Zero emissions</option>
                <option value="electric_scooter">🛴 E-Scooter - Ultra low emissions</option>
                <option value="bus">🚌 Public Bus - Shared emissions</option>
                <option value="train">🚊 Train/Metro - Efficient transport</option>
                <option value="electric_car">🔋 Electric Car - Clean energy</option>
              </select>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4">
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                🎯 Monthly CO₂ Savings Goal
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={userPreferences.monthlyGoal}
                  onChange={(e) => handleMonthlyGoalChange(Number(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white font-medium transition-all duration-300"
                  placeholder="Enter your goal in grams"
                />
                <div className="absolute right-3 top-3 text-gray-500 font-medium">grams</div>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Current goal: <span className="font-semibold text-green-600">{userPreferences.monthlyGoal}g CO₂ savings</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-gray-800 mb-1">📧 Smart Notifications</div>
                  <div className="text-xs text-gray-600">Get personalized eco tips and achievements</div>
                </div>
                <button
                  onClick={handleNotificationToggle}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transform hover:scale-105 ${
                    userPreferences.notifications ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gray-300'
                  }`}
                >
                  <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 shadow-lg ${
                    userPreferences.notifications ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>

            <button
              onClick={handleSavePreferences}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-4 px-6 rounded-xl hover:from-green-600 hover:to-blue-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg transform hover:scale-105"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Saving Your Preferences...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span className="mr-2">💾</span>
                  Save Preferences
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
