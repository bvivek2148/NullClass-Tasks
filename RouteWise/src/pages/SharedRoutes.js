import React, { useState, useEffect } from "react";
import { Trip } from "../entities/Trip.js";
import { Card, CardContent, CardHeader, CardTitle } from "../Components/ui/card.js";
import { Button } from "../Components/ui/button.js";
import { Badge } from "../Components/ui/badge.js";
import { Input } from "../Components/ui/input.js";
import { 
  Users, 
  MapPin, 
  Clock, 
  Star, 
  Eye, 
  Share, 
  Search,
  Filter,
  TrendingUp,
  Globe
} from "lucide-react";
import { motion } from "framer-motion";

export default function SharedRoutes() {
  const [sharedRoutes, setSharedRoutes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSharedRoutes();
  }, []);

  const loadSharedRoutes = async () => {
    try {
      // Mock shared routes data
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockSharedRoutes = [
        {
          id: 1,
          name: "Best NYC Food Tour Route",
          description: "Amazing route covering the best food spots in Manhattan",
          author: "FoodieExplorer",
          category: "vacation",
          rating: 4.8,
          views: 1250,
          likes: 89,
          distance: 12.5,
          duration: 180,
          waypoints: 8,
          tags: ["food", "manhattan", "walking", "popular"],
          created_date: "2024-01-15",
          featured: true
        },
        {
          id: 2,
          name: "Scenic Brooklyn Bridge Loop",
          description: "Beautiful walking route with stunning city views",
          author: "UrbanHiker",
          category: "personal",
          rating: 4.6,
          views: 890,
          likes: 67,
          distance: 8.2,
          duration: 120,
          waypoints: 5,
          tags: ["scenic", "brooklyn", "walking", "photography"],
          created_date: "2024-01-10"
        },
        {
          id: 3,
          name: "Business District Express",
          description: "Efficient route connecting major business centers",
          author: "BusinessPro",
          category: "business",
          rating: 4.4,
          views: 654,
          likes: 43,
          distance: 15.8,
          duration: 45,
          waypoints: 6,
          tags: ["business", "fast", "driving", "efficient"],
          created_date: "2024-01-08"
        }
      ];
      setSharedRoutes(mockSharedRoutes);
    } catch (error) {
      console.error('Error loading shared routes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRoutes = sharedRoutes.filter(route =>
    route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    route.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const CategoryBadge = ({ category }) => {
    const colors = {
      business: "bg-blue-100 text-blue-800",
      personal: "bg-emerald-100 text-emerald-800",
      vacation: "bg-purple-100 text-purple-800",
      commute: "bg-orange-100 text-orange-800"
    };
    return <Badge className={colors[category] || "bg-slate-100 text-slate-800"}>{category}</Badge>;
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-6">
            {Array(3).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Community Routes</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Discover and share amazing routes with the RouteWise community
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <Globe className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-900">{sharedRoutes.length}</div>
              <div className="text-sm text-blue-700">Shared Routes</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <CardContent className="p-6">
              <Users className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-emerald-900">1.2k+</div>
              <div className="text-sm text-emerald-700">Active Users</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <Eye className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-900">15.8k</div>
              <div className="text-sm text-purple-700">Route Views</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <TrendingUp className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-900">89%</div>
              <div className="text-sm text-orange-700">Satisfaction</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search routes, locations, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white border-slate-200"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </Button>
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  Share Your Route
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Routes Grid */}
        <div className="grid gap-6">
          {filteredRoutes.map((route, index) => (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`hover:shadow-xl transition-all duration-300 border-0 ${
                route.featured 
                  ? 'bg-gradient-to-r from-blue-50 via-white to-indigo-50 ring-2 ring-blue-200' 
                  : 'bg-white shadow-lg'
              }`}>
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {route.featured && (
                          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        <CategoryBadge category={route.category} />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">{route.name}</h3>
                      <p className="text-slate-600 mb-4 text-lg">{route.description}</p>
                      <div className="flex items-center gap-6 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          by {route.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          {route.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {route.views} views
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-slate-50 p-4 rounded-xl text-center">
                      <MapPin className="w-6 h-6 text-slate-600 mx-auto mb-2" />
                      <div className="font-bold text-slate-900">{route.distance}km</div>
                      <div className="text-sm text-slate-600">Distance</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl text-center">
                      <Clock className="w-6 h-6 text-slate-600 mx-auto mb-2" />
                      <div className="font-bold text-slate-900">{route.duration}min</div>
                      <div className="text-sm text-slate-600">Duration</div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl text-center">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-orange-600 font-bold text-sm">{route.waypoints}</span>
                      </div>
                      <div className="font-bold text-slate-900">{route.waypoints}</div>
                      <div className="text-sm text-slate-600">Stops</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {route.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="bg-slate-50">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex gap-3">
                      <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                        Use This Route
                      </Button>
                      <Button variant="outline" className="flex items-center gap-2">
                        <Share className="w-4 h-4" />
                        Share
                      </Button>
                    </div>
                    <div className="text-sm text-slate-500">
                      Created {new Date(route.created_date).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredRoutes.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No routes found</h3>
              <p className="text-slate-500 mb-6">Try adjusting your search terms or explore featured routes</p>
              <Button 
                onClick={() => setSearchQuery("")}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
              >
                Clear Search
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}