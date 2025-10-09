import React, { useState } from "react";
import { Input } from "../../Components/ui/input.js";
import { Button } from "../../Components/ui/button.js";
import { Label } from "../../Components/ui/label.js";
import { Badge } from "../../Components/ui/badge.js";
import { MapPin, Search, X, Building, Home, Briefcase, MapIcon } from "lucide-react";
import { Card } from "../../Components/ui/card.js";
import { motion, AnimatePresence } from "framer-motion";

export default function LocationSearch({ 
  label, 
  placeholder, 
  location, 
  onLocationSelect, 
  onMapSelect, 
  isSelecting,
  icon 
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchLocations = async (query) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsSearching(true);
    try {
      // Mock search results with Indian locations
      const mockResults = [
        {
          name: `${query} - Connaught Place`,
          address: "Connaught Place, New Delhi, Delhi 110001",
          lat: 28.6315, lng: 77.2167,
          location_type: "office",
          icon: Building
        },
        {
          name: `${query} - BKC Mumbai`,
          address: "Bandra Kurla Complex, Mumbai, Maharashtra 400051", 
          lat: 19.0596, lng: 72.8656,
          location_type: "client",
          icon: Briefcase
        },
        {
          name: `${query} - Whitefield Bangalore`,
          address: "Whitefield, Bengaluru, Karnataka 560066",
          lat: 12.9698, lng: 77.7500,
          location_type: "office",
          icon: Building
        },
        {
          name: `${query} - Salt Lake Kolkata`,
          address: "Salt Lake City, Kolkata, West Bengal 700091",
          lat: 22.5726, lng: 88.3639,
          location_type: "warehouse",
          icon: Building
        },
        {
          name: `${query} - Hitech City Hyderabad`,
          address: "HITEC City, Hyderabad, Telangana 500081",
          lat: 17.4435, lng: 78.3772,
          location_type: "office",
          icon: Building
        }
      ];
      setSuggestions(mockResults);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    searchLocations(value);
  };

  const selectLocation = (selectedLocation) => {
    onLocationSelect(selectedLocation);
    setSearchQuery("");
    setSuggestions([]);
  };

  const clearLocation = () => {
    onLocationSelect(null);
    setSearchQuery("");
    setSuggestions([]);
  };

  const getLocationTypeColor = (type) => {
    switch (type) {
      case 'office': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'client': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'home': return 'bg-green-100 text-green-800 border-green-200';
      case 'warehouse': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      <Label className="flex items-center gap-3 text-base font-black text-slate-800">
        {icon}
        {label}
      </Label>
      
      <div className="relative">
        {location ? (
          <motion.div 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-4 p-5 bg-gradient-to-r from-slate-50 to-blue-50/30 rounded-2xl border border-slate-200/60 shadow-lg"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-md">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="font-bold text-slate-900 text-lg truncate">
                  {location.name}
                </div>
                <Badge className={`${getLocationTypeColor(location.location_type)} border text-xs font-bold`}>
                  {location.location_type || 'custom'}
                </Badge>
              </div>
              {location.address && (
                <div className="text-sm text-slate-600 truncate font-medium">
                  {location.address}
                </div>
              )}
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={clearLocation}
              className="text-slate-400 hover:text-slate-600 hover:bg-white/80 p-3 rounded-xl"
            >
              <X className="w-5 h-5" />
            </Button>
          </motion.div>
        ) : (
          <>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  placeholder={placeholder}
                  value={searchQuery}
                  onChange={handleInputChange}
                  className="h-14 pl-12 pr-4 text-lg font-semibold bg-white border-2 border-slate-200 rounded-2xl shadow-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                />
                <Search className="w-6 h-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                {isSearching && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                onClick={onMapSelect}
                className={`h-14 px-6 rounded-2xl border-2 font-bold transition-all duration-300 ${
                  isSelecting 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-blue-500 shadow-lg scale-105' 
                    : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <MapIcon className="w-5 h-5" />
              </Button>
            </div>

            <AnimatePresence>
              {suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="absolute top-full left-0 right-0 mt-2 z-50 p-2 max-h-80 overflow-y-auto shadow-2xl border-0 bg-white/95 backdrop-blur-xl">
                    {suggestions.map((suggestion, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Button
                          variant="ghost"
                          onClick={() => selectLocation(suggestion)}
                          className="w-full justify-start p-5 h-auto text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-xl group transition-all duration-300"
                        >
                          <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 group-hover:from-blue-100 group-hover:to-indigo-200 rounded-xl flex items-center justify-center mr-4 transition-all duration-300">
                            <suggestion.icon className="w-6 h-6 text-slate-600 group-hover:text-blue-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="font-bold text-slate-900 truncate text-lg">
                                {suggestion.name}
                              </div>
                              <Badge className={`${getLocationTypeColor(suggestion.location_type)} border text-xs font-bold`}>
                                {suggestion.location_type}
                              </Badge>
                            </div>
                            <div className="text-sm text-slate-500 truncate font-medium">
                              {suggestion.address}
                            </div>
                          </div>
                        </Button>
                      </motion.div>
                    ))}
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      <AnimatePresence>
        {isSelecting && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-sm text-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl text-center border border-blue-200 font-bold"
          >
            🎯 Click anywhere on the map to set this location
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}