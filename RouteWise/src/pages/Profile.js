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
  Upload
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

export default function Profile() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadUser();
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Profile Unavailable</h2>
          <p className="text-slate-600">Please sign in to view your profile.</p>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-white/60 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 h-32 relative">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-end gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl bg-white shadow-lg flex items-center justify-center overflow-hidden border-4 border-white">
                    {currentUser.avatar_url ? (
                      <img 
                        src={currentUser.avatar_url} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-slate-600">
                        {currentUser.getInitials()}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>
                <div className="flex-1 text-white pb-2">
                  <h1 className="text-3xl font-bold">{currentUser.full_name}</h1>
                  <p className="text-blue-100 text-lg">{currentUser.email}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge className="bg-white/20 text-white border-white/30">
                      {currentUser.subscription_type === 'professional' ? 'Pro User' : 'Free User'}
                    </Badge>
                    {currentUser.is_verified && (
                      <Badge className="bg-emerald-500/20 text-emerald-100 border-emerald-300/30">
                        <Check className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="pb-2">
                  <Button
                    onClick={() => setEditMode(!editMode)}
                    variant={editMode ? "secondary" : "outline"}
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20"
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
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white/95 backdrop-blur-xl border border-white/60 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-${stat.color}-50 border border-${stat.color}-200`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <Badge className={`bg-${stat.color}-500 text-white`}>
                    {stat.change}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-white/95 backdrop-blur-xl border border-white/60 shadow-lg">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Notifications
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card className="bg-white/95 backdrop-blur-xl border border-white/60 shadow-xl">
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Manage your account details and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Full Name</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={editData.full_name}
                            onChange={(e) => setEditData({...editData, full_name: e.target.value})}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-slate-900 font-medium">{currentUser.full_name}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Email Address</label>
                        {editMode ? (
                          <input
                            type="email"
                            value={editData.email}
                            onChange={(e) => setEditData({...editData, email: e.target.value})}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-slate-900 font-medium">{currentUser.email}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Phone Number</label>
                        {editMode ? (
                          <input
                            type="tel"
                            value={editData.phone}
                            onChange={(e) => setEditData({...editData, phone: e.target.value})}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-slate-900 font-medium">{currentUser.phone || 'Not provided'}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Organization</label>
                        {editMode ? (
                          <input
                            type="text"
                            value={editData.organization}
                            onChange={(e) => setEditData({...editData, organization: e.target.value})}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        ) : (
                          <p className="text-slate-900 font-medium">{currentUser.organization || 'Not provided'}</p>
                        )}
                      </div>
                    </div>

                    {editMode && (
                      <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button
                          variant="outline"
                          onClick={() => setEditMode(false)}
                          disabled={saving}
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
              </TabsContent>

              <TabsContent value="settings">
                <Card className="bg-white/95 backdrop-blur-xl border border-white/60 shadow-xl">
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                      Configure your account preferences and privacy settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-slate-900">Language</h4>
                          <p className="text-sm text-slate-600">Choose your preferred language</p>
                        </div>
                        <select className="px-3 py-1 border border-slate-300 rounded-lg bg-white">
                          <option value="en">English</option>
                          <option value="hi">हिंदी</option>
                          <option value="es">Español</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-slate-900">Currency</h4>
                          <p className="text-sm text-slate-600">Select your preferred currency</p>
                        </div>
                        <select className="px-3 py-1 border border-slate-300 rounded-lg bg-white">
                          <option value="INR">₹ INR</option>
                          <option value="USD">$ USD</option>
                          <option value="EUR">€ EUR</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div>
                          <h4 className="font-medium text-slate-900">Time Zone</h4>
                          <p className="text-sm text-slate-600">Your local time zone</p>
                        </div>
                        <select className="px-3 py-1 border border-slate-300 rounded-lg bg-white">
                          <option value="Asia/Kolkata">Asia/Kolkata</option>
                          <option value="America/New_York">America/New_York</option>
                          <option value="Europe/London">Europe/London</option>
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications">
                <Card className="bg-white/95 backdrop-blur-xl border border-white/60 shadow-xl">
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Choose how you want to receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-slate-600" />
                          <div>
                            <h4 className="font-medium text-slate-900">Email Notifications</h4>
                            <p className="text-sm text-slate-600">Receive updates via email</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleNotificationToggle('email')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            currentUser.preferences.notifications?.email ? 'bg-blue-600' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              currentUser.preferences.notifications?.email ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Bell className="w-5 h-5 text-slate-600" />
                          <div>
                            <h4 className="font-medium text-slate-900">Push Notifications</h4>
                            <p className="text-sm text-slate-600">Receive push notifications</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleNotificationToggle('push')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            currentUser.preferences.notifications?.push ? 'bg-blue-600' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              currentUser.preferences.notifications?.push ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-slate-600" />
                          <div>
                            <h4 className="font-medium text-slate-900">SMS Notifications</h4>
                            <p className="text-sm text-slate-600">Receive important updates via SMS</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleNotificationToggle('sms')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            currentUser.preferences.notifications?.sms ? 'bg-blue-600' : 'bg-slate-300'
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
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Achievements and Activity */}
          <div className="space-y-6">
            {/* Subscription Info */}
            <Card className="bg-white/95 backdrop-blur-xl border border-white/60 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Subscription
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <Badge className="bg-blue-600 text-white mb-2">
                      {currentUser.subscription_type.toUpperCase()}
                    </Badge>
                    <p className="text-sm text-slate-600 mb-3">
                      {currentUser.hasActiveSubscription() ? 'Active Subscription' : 'Free Plan'}
                    </p>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      {currentUser.hasActiveSubscription() ? 'Manage Plan' : 'Upgrade Now'}
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-700">Features:</p>
                    <ul className="text-sm text-slate-600 space-y-1">
                      {currentUser.getSubscriptionFeatures().slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="bg-white/95 backdrop-blur-xl border border-white/60 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-all ${
                        achievement.earned
                          ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${
                        achievement.earned ? 'bg-emerald-100' : 'bg-slate-200'
                      }`}>
                        <achievement.icon className={`w-4 h-4 ${
                          achievement.earned ? 'text-emerald-600' : 'text-slate-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium text-sm ${
                          achievement.earned ? 'text-emerald-900' : 'text-slate-600'
                        }`}>
                          {achievement.title}
                        </h4>
                        <p className={`text-xs ${
                          achievement.earned ? 'text-emerald-700' : 'text-slate-500'
                        }`}>
                          {achievement.description}
                        </p>
                      </div>
                      {achievement.earned && (
                        <Check className="w-4 h-4 text-emerald-500" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-white/95 backdrop-blur-xl border border-white/60 shadow-xl">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Privacy Settings
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                  <X className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}