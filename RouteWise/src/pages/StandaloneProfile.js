import React, { useState, useEffect, useRef } from "react";
import { User } from "../entities/User.js";
import { 
  User as UserIcon, 
  Settings, 
  Bell, 
  Shield, 
  Camera, 
  Save, 
  Edit3, 
  MapPin,
  Calendar,
  Award,
  TrendingUp,
  Users,
  Navigation as RouteIcon,
  Clock,
  DollarSign,
  Mail,
  Phone,
  Building,
  Globe,
  Check,
  X,
  Upload,
  ArrowLeft,
  ExternalLink,
  Star,
  Target,
  Zap
} from "lucide-react";
import { Button } from "../Components/ui/button.js";
import { Badge } from "../Components/ui/badge.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../Components/ui/card.js";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../Components/ui/tabs.js";

export default function StandaloneProfile() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadUser();
    document.title = "User Profile - RouteWise Pro";
  }, []);

  const loadUser = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);
      setEditData({
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        organization: user.organization,
      });
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await currentUser.update(editData);
      setCurrentUser({ ...currentUser, ...editData });
      setEditMode(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const avatarUrl = await currentUser.uploadAvatar(file);
        setCurrentUser({ ...currentUser, avatar_url: avatarUrl });
      } catch (error) {
        console.error('Failed to upload avatar:', error);
      }
    }
  };

  const handleNotificationToggle = async (type) => {
    try {
      const newPreferences = {
        ...currentUser.preferences,
        notifications: {
          ...currentUser.preferences.notifications,
          [type]: !currentUser.preferences.notifications[type]
        }
      };
      await currentUser.updatePreferences(newPreferences);
      setCurrentUser({ ...currentUser, preferences: newPreferences });
    } catch (error) {
      console.error('Failed to update notifications:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Profile...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Profile Unavailable</h2>
          <p className="text-blue-200">Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  const formatStats = currentUser.getFormattedStats();
  const stats = [
    { icon: RouteIcon, label: "Total Routes", value: formatStats.totalTrips, change: "+12%", color: "blue" },
    { icon: MapPin, label: "Distance Covered", value: formatStats.totalDistance, change: "+8%", color: "green" },
    { icon: DollarSign, label: "Cost Saved", value: formatStats.totalSavings, change: "+15%", color: "emerald" },
    { icon: Clock, label: "Time Saved", value: formatStats.totalTimeSaved, change: "+22%", color: "purple" },
  ];

  const achievements = currentUser.getAchievements().map(achievement => ({
    icon: achievement.icon === 'Award' ? Award : 
          achievement.icon === 'TrendingUp' ? TrendingUp :
          achievement.icon === 'Users' ? Users : Globe,
    title: achievement.title,
    description: achievement.description,
    earned: achievement.earned
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideInUp {
          animation: slideInUp 0.6s ease-out;
        }
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeInScale {
          animation: fadeInScale 0.5s ease-out;
        }
      `}</style>
      {/* Professional Header */}
      <header className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <RouteIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">RouteWise Pro</h1>
                <p className="text-blue-200 text-sm">Professional Profile Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                <Star className="w-3 h-3 mr-1" />
                Professional Account
              </Badge>
              <Button
                variant="outline" 
                size="sm"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => window.close()}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Close
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Enhanced Profile Header */}
        <Card className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden">
          <div className="relative">
            {/* Cover Background with Animation */}
            <div className="h-64 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-purple-600/80 to-indigo-700/90"></div>
              
              {/* Animated Background Elements */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
                <div className="absolute top-20 right-20 w-20 h-20 bg-white/5 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
                <div className="absolute bottom-10 left-1/3 w-16 h-16 bg-white/10 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
                <div className="absolute bottom-20 right-10 w-24 h-24 bg-white/5 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              </div>
              
              {/* Geometric Pattern */}
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
                  radial-gradient(circle at 80% 80%, rgba(255,255,255,0.05) 0%, transparent 50%),
                  radial-gradient(circle at 40% 40%, rgba(255,255,255,0.03) 0%, transparent 50%)
                `
              }}></div>
              
              {/* Floating Icons */}
              <div className="absolute inset-0">
                <div className="absolute top-16 left-16 opacity-20">
                  <RouteIcon className="w-8 h-8 text-white animate-float" />
                </div>
                <div className="absolute top-32 right-32 opacity-15">
                  <MapPin className="w-6 h-6 text-white animate-float" style={{animationDelay: '1.5s'}} />
                </div>
                <div className="absolute bottom-32 left-24 opacity-10">
                  <TrendingUp className="w-7 h-7 text-white animate-float" style={{animationDelay: '3s'}} />
                </div>
              </div>
            </div>
            
            {/* Profile Content */}
            <div className="relative px-8 pb-8 -mt-32">
              <div className="flex flex-col lg:flex-row lg:items-end gap-8">
                <div className="relative animate-fadeInScale">
                  {/* Enhanced Avatar with Glow Effect */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur-lg opacity-75 animate-pulse"></div>
                    <div className="relative w-40 h-40 rounded-3xl bg-white shadow-2xl flex items-center justify-center overflow-hidden border-8 border-white/30 backdrop-blur-sm">
                      {currentUser.avatar_url ? (
                        <img 
                          src={currentUser.avatar_url} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-5xl font-bold text-slate-600">
                          {currentUser.getInitials()}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Enhanced Upload Button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-3 -right-3 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl flex items-center justify-center shadow-2xl transition-all hover:scale-110 border-4 border-white/20"
                  >
                    <Camera className="w-7 h-7" />
                  </button>
                  
                  {/* Status Indicator */}
                  <div className="absolute top-3 right-3 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white animate-pulse flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>
                
                <div className="flex-1 text-white lg:pb-4">
                  <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                    <div>
                      <h1 className="text-4xl font-bold mb-2">{currentUser.full_name}</h1>
                      <p className="text-blue-100 text-lg mb-3">{currentUser.email}</p>
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge className="bg-white/20 text-white border-white/30 px-3 py-1">
                          <Target className="w-3 h-3 mr-1" />
                          {currentUser.subscription_type === 'professional' ? 'Pro User' : 'Free User'}
                        </Badge>
                        {currentUser.is_verified && (
                          <Badge className="bg-emerald-500/20 text-emerald-100 border-emerald-300/30 px-3 py-1">
                            <Check className="w-3 h-3 mr-1" />
                            Verified Account
                          </Badge>
                        )}
                        <Badge className="bg-purple-500/20 text-purple-100 border-purple-300/30 px-3 py-1">
                          <Zap className="w-3 h-3 mr-1" />
                          Member since 2024
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button
                        onClick={() => setEditMode(!editMode)}
                        variant={editMode ? "secondary" : "outline"}
                        className="bg-white/10 border-white/30 text-white hover:bg-white/20 px-6"
                      >
                        {editMode ? (
                          <>
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </>
                        ) : (
                          <>
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit Profile
                          </>
                        )}
                      </Button>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Share Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Enhanced Professional Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl hover:shadow-2xl transition-all hover:scale-105 group animate-slideInUp" style={{animationDelay: `${index * 0.1}s`}}>
              <CardContent className="p-6 relative overflow-hidden">
                {/* Background Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color}-500/20 to-${stat.color}-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 shadow-lg group-hover:shadow-xl transition-all group-hover:scale-110`}>
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-right">
                      <Badge className={`bg-${stat.color}-500/20 text-${stat.color}-300 border-${stat.color}-500/30 mb-2`}>
                        {stat.change}
                      </Badge>
                      <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r from-${stat.color}-400 to-${stat.color}-500 rounded-full transition-all duration-1000 group-hover:w-full`} style={{width: '75%'}}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-blue-200">{stat.label}</p>
                    <p className="text-3xl font-bold text-white group-hover:text-4xl transition-all duration-300">{stat.value}</p>
                    
                    {/* Mini Chart Indicator */}
                    <div className="flex items-center gap-1">
                      {[...Array(12)].map((_, i) => (
                        <div 
                          key={i}
                          className={`w-1 bg-gradient-to-t from-${stat.color}-600 to-${stat.color}-400 rounded-full transition-all duration-1000`}
                          style={{
                            height: `${Math.random() * 20 + 8}px`,
                            animationDelay: `${i * 0.1}s`
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Additional Analytics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-slideInUp" style={{animationDelay: '0.5s'}}>
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Efficiency Rating</h3>
                <Star className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-blue-200">Overall</span>
                  <span className="text-2xl font-bold text-white">94%</span>
                </div>
                <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-1000" style={{width: '94%'}}></div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <div className="text-emerald-300 font-semibold">Route</div>
                    <div className="text-white">96%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-blue-300 font-semibold">Cost</div>
                    <div className="text-white">92%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-purple-300 font-semibold">Time</div>
                    <div className="text-white">94%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Monthly Progress</h3>
                <TrendingUp className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-blue-200">This Month</span>
                  <span className="text-2xl font-bold text-emerald-400">+18%</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-300">Routes Completed</span>
                    <span className="text-white">12/15</span>
                  </div>
                  <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full" style={{width: '80%'}}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Achievement Level</h3>
                <Award className="w-6 h-6 text-purple-400" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-blue-200">Expert</span>
                  <span className="text-2xl font-bold text-purple-400">Lvl 7</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-300">XP Progress</span>
                    <span className="text-white">2,840/3,500</span>
                  </div>
                  <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full" style={{width: '81%'}}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Professional Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-blue-500/30">
              <UserIcon className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-white data-[state=active]:bg-emerald-500/30">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="achievements" className="text-white data-[state=active]:bg-purple-500/30">
              <Award className="w-4 h-4 mr-2" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="security" className="text-white data-[state=active]:bg-orange-500/30">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Personal Information */}
              <div className="lg:col-span-2">
                <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-white text-xl">Personal Information</CardTitle>
                    <CardDescription className="text-blue-200">
                      Manage your account details and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-blue-200">Full Name</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={editData.full_name}
                            onChange={(e) => setEditData({...editData, full_name: e.target.value})}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-blue-200"
                          />
                        ) : (
                          <p className="text-white font-medium text-lg">{currentUser.full_name}</p>
                        )}
                      </div>
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-blue-200">Email Address</label>
                        {editMode ? (
                          <input
                            type="email"
                            value={editData.email}
                            onChange={(e) => setEditData({...editData, email: e.target.value})}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-blue-200"
                          />
                        ) : (
                          <p className="text-white font-medium text-lg">{currentUser.email}</p>
                        )}
                      </div>
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-blue-200">Phone Number</label>
                        {editMode ? (
                          <input
                            type="tel"
                            value={editData.phone}
                            onChange={(e) => setEditData({...editData, phone: e.target.value})}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-blue-200"
                          />
                        ) : (
                          <p className="text-white font-medium text-lg">{currentUser.phone || 'Not provided'}</p>
                        )}
                      </div>
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-blue-200">Organization</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={editData.organization}
                            onChange={(e) => setEditData({...editData, organization: e.target.value})}
                            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-blue-200"
                          />
                        ) : (
                          <p className="text-white font-medium text-lg">{currentUser.organization || 'Not provided'}</p>
                        )}
                      </div>
                    </div>

                    {editMode && (
                      <div className="flex justify-end gap-3 pt-6 border-t border-white/20">
                        <Button
                          variant="outline"
                          onClick={() => setEditMode(false)}
                          disabled={saving}
                          className="border-white/30 text-white hover:bg-white/10"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSave}
                          disabled={saving}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {saving ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Subscription Info */}
              <div>
                <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl mb-6">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Subscription
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center p-6 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl border border-blue-500/30">
                        <Badge className="bg-blue-600 text-white mb-3 text-base px-4 py-2">
                          {currentUser.subscription_type.toUpperCase()}
                        </Badge>
                        <p className="text-blue-200 mb-4">
                          {currentUser.hasActiveSubscription() ? 'Active Professional Plan' : 'Free Plan'}
                        </p>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          {currentUser.hasActiveSubscription() ? 'Manage Plan' : 'Upgrade Now'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="achievements">
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white text-xl">Achievements & Milestones</CardTitle>
                <CardDescription className="text-blue-200">
                  Track your progress and unlock new achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-4 p-6 rounded-xl border-2 transition-all hover:scale-105 ${
                        achievement.earned
                          ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 border-emerald-500/30'
                          : 'bg-white/5 border-white/20'
                      }`}
                    >
                      <div className={`p-4 rounded-xl ${
                        achievement.earned ? 'bg-emerald-500/30' : 'bg-white/10'
                      }`}>
                        <achievement.icon className={`w-6 h-6 ${
                          achievement.earned ? 'text-emerald-300' : 'text-blue-300'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium text-lg ${
                          achievement.earned ? 'text-emerald-300' : 'text-blue-200'
                        }`}>
                          {achievement.title}
                        </h4>
                        <p className={`text-sm ${
                          achievement.earned ? 'text-emerald-200' : 'text-blue-300'
                        }`}>
                          {achievement.description}
                        </p>
                      </div>
                      {achievement.earned && (
                        <Check className="w-6 h-6 text-emerald-400" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Account Settings */}
              <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white text-xl">Account Settings</CardTitle>
                  <CardDescription className="text-blue-200">
                    Manage your account preferences and security settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-blue-400" />
                        <div>
                          <h4 className="font-medium text-white">Language</h4>
                          <p className="text-sm text-blue-300">Choose your preferred language</p>
                        </div>
                      </div>
                      <select className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500">
                        <option value="en" className="bg-slate-800">English</option>
                        <option value="hi" className="bg-slate-800">हिंदी</option>
                        <option value="es" className="bg-slate-800">Español</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-5 h-5 text-emerald-400" />
                        <div>
                          <h4 className="font-medium text-white">Currency</h4>
                          <p className="text-sm text-blue-300">Select your preferred currency</p>
                        </div>
                      </div>
                      <select className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500">
                        <option value="INR" className="bg-slate-800">₹ INR</option>
                        <option value="USD" className="bg-slate-800">$ USD</option>
                        <option value="EUR" className="bg-slate-800">€ EUR</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-purple-400" />
                        <div>
                          <h4 className="font-medium text-white">Time Zone</h4>
                          <p className="text-sm text-blue-300">Your local time zone</p>
                        </div>
                      </div>
                      <select className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500">
                        <option value="Asia/Kolkata" className="bg-slate-800">Asia/Kolkata</option>
                        <option value="America/New_York" className="bg-slate-800">America/New_York</option>
                        <option value="Europe/London" className="bg-slate-800">Europe/London</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-3">
                        <Settings className="w-5 h-5 text-orange-400" />
                        <div>
                          <h4 className="font-medium text-white">Theme</h4>
                          <p className="text-sm text-blue-300">Choose your interface theme</p>
                        </div>
                      </div>
                      <select className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500">
                        <option value="dark" className="bg-slate-800">Dark Mode</option>
                        <option value="light" className="bg-slate-800">Light Mode</option>
                        <option value="auto" className="bg-slate-800">Auto</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white text-xl">Notifications</CardTitle>
                  <CardDescription className="text-blue-200">
                    Control how you receive notifications and updates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-blue-400" />
                        <div>
                          <h4 className="font-medium text-white">Email Notifications</h4>
                          <p className="text-sm text-blue-300">Receive updates via email</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleNotificationToggle('email')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          currentUser.preferences.notifications?.email ? 'bg-blue-600' : 'bg-white/30'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            currentUser.preferences.notifications?.email ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-purple-400" />
                        <div>
                          <h4 className="font-medium text-white">Push Notifications</h4>
                          <p className="text-sm text-blue-300">Receive push notifications</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleNotificationToggle('push')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          currentUser.preferences.notifications?.push ? 'bg-purple-600' : 'bg-white/30'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            currentUser.preferences.notifications?.push ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-emerald-400" />
                        <div>
                          <h4 className="font-medium text-white">SMS Notifications</h4>
                          <p className="text-sm text-blue-300">Important updates via SMS</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleNotificationToggle('sms')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          currentUser.preferences.notifications?.sms ? 'bg-emerald-600' : 'bg-white/30'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            currentUser.preferences.notifications?.sms ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-white/10">
                    <h4 className="text-white font-medium mb-3">Notification Frequency</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <button className="p-2 bg-blue-600 text-white rounded-lg text-sm font-medium">Instant</button>
                      <button className="p-2 bg-white/10 text-blue-300 rounded-lg text-sm hover:bg-white/20">Daily</button>
                      <button className="p-2 bg-white/10 text-blue-300 rounded-lg text-sm hover:bg-white/20">Weekly</button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security">
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white text-xl">Security Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-200">Security settings coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}