// Trip entity for managing route planning and trip data

export class Trip {
  constructor(data = {}) {
    this.id = data.id || `trip_${Date.now()}`;
    this.name = data.name || '';
    this.description = data.description || '';
    this.start_location = data.start_location || null;
    this.end_location = data.end_location || null;
    this.waypoints = data.waypoints || [];
    this.route_optimization = data.route_optimization || {
      algorithm: 'balanced',
      avoid_tolls: false,
      avoid_highways: false,
      avoid_ferries: false,
      prefer_highways: false,
      optimize_waypoints: true
    };
    this.route_data = data.route_data || null;
    this.vehicle_profile = data.vehicle_profile || {
      type: 'car',
      fuel_type: 'gasoline',
      fuel_efficiency: 15, // km/l
      max_speed: 120
    };
    this.business_context = data.business_context || {};
    this.travel_mode = data.travel_mode || 'driving';
    this.status = data.status || 'draft';
    this.priority = data.priority || 'medium';
    this.scheduled_departure = data.scheduled_departure || null;
    this.actual_departure = data.actual_departure || null;
    this.scheduled_arrival = data.scheduled_arrival || null;
    this.actual_arrival = data.actual_arrival || null;
    this.category = data.category || 'business';
    this.tags = data.tags || [];
    this.notes = data.notes || '';
    this.internal_notes = data.internal_notes || '';
    this.shared_with = data.shared_with || [];
    this.is_public = data.is_public || false;
    this.is_recurring = data.is_recurring || false;
    this.recurrence_pattern = data.recurrence_pattern || null;
    this.estimated_cost = data.estimated_cost || 0;
    this.actual_cost = data.actual_cost || 0;
    this.budget_limit = data.budget_limit || null;
    this.tracking_enabled = data.tracking_enabled || false;
    this.notifications_enabled = data.notifications_enabled || true;
    this.geo_fencing = data.geo_fencing || false;
    this.compliance_requirements = data.compliance_requirements || [];
    this.risk_assessment = data.risk_assessment || 'low';
    this.insurance_required = data.insurance_required || false;
    this.created_date = data.created_date || new Date().toISOString();
    this.updated_date = data.updated_date || new Date().toISOString();
    this.created_by = data.created_by || null;
  }

  // Static methods for CRUD operations
  static async list(sortBy = '-created_date', filters = {}) {
    try {
      // Get trips from localStorage
      const trips = JSON.parse(localStorage.getItem('routewise_trips') || '[]');
      
      // Apply filters
      let filteredTrips = trips;
      if (filters.status) {
        filteredTrips = filteredTrips.filter(trip => trip.status === filters.status);
      }
      if (filters.category) {
        filteredTrips = filteredTrips.filter(trip => trip.category === filters.category);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredTrips = filteredTrips.filter(trip => 
          trip.name.toLowerCase().includes(searchLower) ||
          trip.description.toLowerCase().includes(searchLower)
        );
      }
      
      // Sort trips
      filteredTrips.sort((a, b) => {
        const field = sortBy.replace('-', '');
        const ascending = !sortBy.startsWith('-');
        
        let aVal = a[field];
        let bVal = b[field];
        
        if (field === 'created_date' || field === 'updated_date') {
          aVal = new Date(aVal);
          bVal = new Date(bVal);
        }
        
        if (ascending) {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
      
      return filteredTrips.map(trip => new Trip(trip));
    } catch (error) {
      console.error('Error loading trips:', error);
      return [];
    }
  }

  static async get(id) {
    try {
      const trips = JSON.parse(localStorage.getItem('routewise_trips') || '[]');
      const trip = trips.find(t => t.id === id);
      return trip ? new Trip(trip) : null;
    } catch (error) {
      console.error('Error getting trip:', error);
      return null;
    }
  }

  static async create(data) {
    try {
      const trip = new Trip(data);
      const trips = JSON.parse(localStorage.getItem('routewise_trips') || '[]');
      trips.push(trip.toJSON());
      localStorage.setItem('routewise_trips', JSON.stringify(trips));
      return trip;
    } catch (error) {
      console.error('Error creating trip:', error);
      throw new Error('Failed to create trip');
    }
  }

  static async delete(id) {
    try {
      const trips = JSON.parse(localStorage.getItem('routewise_trips') || '[]');
      const filteredTrips = trips.filter(t => t.id !== id);
      localStorage.setItem('routewise_trips', JSON.stringify(filteredTrips));
      return true;
    } catch (error) {
      console.error('Error deleting trip:', error);
      throw new Error('Failed to delete trip');
    }
  }

  // Instance methods
  async save() {
    try {
      this.updated_date = new Date().toISOString();
      const trips = JSON.parse(localStorage.getItem('routewise_trips') || '[]');
      const index = trips.findIndex(t => t.id === this.id);
      
      if (index >= 0) {
        trips[index] = this.toJSON();
      } else {
        trips.push(this.toJSON());
      }
      
      localStorage.setItem('routewise_trips', JSON.stringify(trips));
      return this;
    } catch (error) {
      console.error('Error saving trip:', error);
      throw new Error('Failed to save trip');
    }
  }

  async delete() {
    return Trip.delete(this.id);
  }

  // Calculate route distance
  calculateDistance() {
    if (!this.route_data || !this.route_data.distance) return 0;
    return this.route_data.distance;
  }

  // Calculate route duration
  calculateDuration() {
    if (!this.route_data || !this.route_data.duration) return 0;
    return this.route_data.duration;
  }

  // Calculate estimated cost
  calculateEstimatedCost() {
    if (!this.route_data) return 0;
    
    const distance = this.calculateDistance() / 1000; // Convert to km
    const fuelEfficiency = this.vehicle_profile.fuel_efficiency || 15; // km/l
    const fuelPrice = 100; // INR per liter (mock price)
    
    const fuelCost = (distance / fuelEfficiency) * fuelPrice;
    const tollCost = this.route_data.toll_cost || 0;
    const parkingCost = this.route_data.parking_cost || 0;
    
    return Math.round(fuelCost + tollCost + parkingCost);
  }

  // Get efficiency score
  getEfficiencyScore() {
    if (!this.route_data) return 0;
    return this.route_data.efficiency_score || 85;
  }

  // Check if trip is editable
  isEditable() {
    return ['draft', 'planned'].includes(this.status);
  }

  // Check if trip is active
  isActive() {
    return this.status === 'in_progress';
  }

  // Check if trip is completed
  isCompleted() {
    return this.status === 'completed';
  }

  // Add waypoint
  addWaypoint(location) {
    const waypoint = {
      ...location,
      id: `wp_${Date.now()}`,
      order: this.waypoints.length,
      estimated_time: 0,
      service_time: 0,
      priority: 'medium'
    };
    this.waypoints.push(waypoint);
    return waypoint;
  }

  // Remove waypoint
  removeWaypoint(id) {
    this.waypoints = this.waypoints.filter(wp => wp.id !== id);
    // Reorder remaining waypoints
    this.waypoints.forEach((wp, index) => {
      wp.order = index;
    });
  }

  // Reorder waypoints
  reorderWaypoints(newOrder) {
    this.waypoints = newOrder.map((wp, index) => ({
      ...wp,
      order: index
    }));
  }

  // Add tag
  addTag(tag) {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
    }
  }

  // Remove tag
  removeTag(tag) {
    this.tags = this.tags.filter(t => t !== tag);
  }

  // Share with user
  shareWith(userEmail) {
    if (!this.shared_with.includes(userEmail)) {
      this.shared_with.push(userEmail);
    }
  }

  // Unshare with user
  unshareWith(userEmail) {
    this.shared_with = this.shared_with.filter(email => email !== userEmail);
  }

  // Clone trip
  clone() {
    const clonedData = {
      ...this.toJSON(),
      id: `trip_${Date.now()}`,
      name: `${this.name} (Copy)`,
      status: 'draft',
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString()
    };
    return new Trip(clonedData);
  }

  // Export to different formats
  exportToJSON() {
    return JSON.stringify(this.toJSON(), null, 2);
  }

  exportToCSV() {
    const data = this.toJSON();
    const headers = Object.keys(data);
    const values = Object.values(data).map(v => 
      typeof v === 'object' ? JSON.stringify(v) : v
    );
    return `${headers.join(',')}
${values.join(',')}`;
  }

  // Convert to plain object
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      start_location: this.start_location,
      end_location: this.end_location,
      waypoints: this.waypoints,
      route_optimization: this.route_optimization,
      route_data: this.route_data,
      vehicle_profile: this.vehicle_profile,
      business_context: this.business_context,
      travel_mode: this.travel_mode,
      status: this.status,
      priority: this.priority,
      scheduled_departure: this.scheduled_departure,
      actual_departure: this.actual_departure,
      scheduled_arrival: this.scheduled_arrival,
      actual_arrival: this.actual_arrival,
      category: this.category,
      tags: this.tags,
      notes: this.notes,
      internal_notes: this.internal_notes,
      shared_with: this.shared_with,
      is_public: this.is_public,
      is_recurring: this.is_recurring,
      recurrence_pattern: this.recurrence_pattern,
      estimated_cost: this.estimated_cost,
      actual_cost: this.actual_cost,
      budget_limit: this.budget_limit,
      tracking_enabled: this.tracking_enabled,
      notifications_enabled: this.notifications_enabled,
      geo_fencing: this.geo_fencing,
      compliance_requirements: this.compliance_requirements,
      risk_assessment: this.risk_assessment,
      insurance_required: this.insurance_required,
      created_date: this.created_date,
      updated_date: this.updated_date,
      created_by: this.created_by
    };
  }
}