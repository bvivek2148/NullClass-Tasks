import React, { useState } from "react";
import { Button } from "../../Components/ui/button.js";
import { Card } from "../../Components/ui/card.js";
import { Plus, MapPin, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import LocationSearch from "./LocationSearch.js";

export default function WaypointsManager({ waypoints, onAddWaypoint, onRemoveWaypoint }) {
  const [showAddWaypoint, setShowAddWaypoint] = useState(false);

  const handleAddWaypoint = (location) => {
    onAddWaypoint(location);
    setShowAddWaypoint(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-700">Waypoints</div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowAddWaypoint(!showAddWaypoint)}
          className="text-orange-600 border-orange-200 hover:bg-orange-50"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <AnimatePresence>
        {showAddWaypoint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="p-4 border-orange-200 bg-orange-50/50">
              <LocationSearch
                label="Add Stop"
                placeholder="Search for waypoint"
                location={null}
                onLocationSelect={handleAddWaypoint}
                onMapSelect={() => {}}
                icon={<MapPin className="w-4 h-4 text-orange-600" />}
              />
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {waypoints.map((waypoint, index) => (
          <motion.div
            key={waypoint.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200"
          >
            <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-slate-900 text-sm truncate">
                {waypoint.name}
              </div>
              {waypoint.address && (
                <div className="text-xs text-slate-500 truncate">
                  {waypoint.address}
                </div>
              )}
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onRemoveWaypoint(waypoint.id)}
              className="text-orange-600 hover:text-orange-700 hover:bg-orange-100 p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>

      {waypoints.length === 0 && !showAddWaypoint && (
        <div className="text-xs text-slate-500 text-center py-2">
          No waypoints added. Click + to add stops along your route.
        </div>
      )}
    </div>
  );
}