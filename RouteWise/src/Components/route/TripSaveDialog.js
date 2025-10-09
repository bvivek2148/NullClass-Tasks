import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../Components/ui/dialog.js";
import { Button } from "../../Components/ui/button.js";
import { Input } from "../../Components/ui/input.js";
import { Textarea } from "../../Components/ui/textarea.js";
import { Label } from "../../Components/ui/label.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../Components/ui/select.js";
import { Badge } from "../../Components/ui/badge.js";
import { Save, MapPin, Navigation, Calendar, Tag } from "lucide-react";

export default function TripSaveDialog({ 
  open, 
  onClose, 
  onSave, 
  startLocation, 
  endLocation, 
  routeData 
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "personal",
    priority: "medium",
    scheduled_date: "",
    scheduled_time: "",
    tags: [],
    notes: "",
    is_public: false
  });

  const [newTag, setNewTag] = useState("");

  const handleSave = () => {
    onSave(formData);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Save className="w-5 h-5 text-blue-600" />
            Save Your Professional Trip
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Route Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
            <h3 className="font-semibold text-slate-900 mb-3">Route Summary</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span className="text-slate-600">From:</span>
                <span className="font-medium">{startLocation?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-blue-600" />
                <span className="text-slate-600">To:</span>
                <span className="font-medium">{endLocation?.name}</span>
              </div>
              {routeData && (
                <>
                  <div className="text-slate-600">
                    Distance: <span className="font-medium">{(routeData.distance / 1000).toFixed(1)}km</span>
                  </div>
                  <div className="text-slate-600">
                    Duration: <span className="font-medium">{Math.round(routeData.duration / 60)}min</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Trip Details Form */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-semibold">Trip Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Morning Business Meeting"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-sm font-semibold">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({...formData, category: value})}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="vacation">Vacation</SelectItem>
                    <SelectItem value="commute">Commute</SelectItem>
                    <SelectItem value="delivery">Delivery</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority" className="text-sm font-semibold">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({...formData, priority: value})}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="scheduled_date" className="text-sm font-semibold">Date</Label>
                  <Input
                    id="scheduled_date"
                    type="date"
                    value={formData.scheduled_date}
                    onChange={(e) => setFormData({...formData, scheduled_date: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="scheduled_time" className="text-sm font-semibold">Time</Label>
                  <Input
                    id="scheduled_time"
                    type="time"
                    value={formData.scheduled_time}
                    onChange={(e) => setFormData({...formData, scheduled_time: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold">Tags</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    placeholder="Add tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    className="flex-1"
                  />
                  <Button onClick={addTag} size="sm" variant="outline">
                    <Tag className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-semibold">Description</Label>
            <Textarea
              id="description"
              placeholder="Add details about your trip..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="mt-1 h-24"
            />
          </div>

          <div>
            <Label htmlFor="notes" className="text-sm font-semibold">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes or reminders..."
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="mt-1 h-20"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!formData.name.trim()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Trip
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}