import { Route, Location, RouteComparison, AlternativeRoute, TransportationMode } from './types';
import { emissionCalculator, TRANSPORTATION_MODES } from './emissions';

// Mock routing service - In production, integrate with Google Maps, OpenStreetMap, or similar
export class RoutingService {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.NEXT_PUBLIC_MAPS_API_KEY || '';
  }

  /**
   * Calculate route for a specific transportation mode
   */
  async calculateRoute(
    origin: Location,
    destination: Location,
    transportationMode: TransportationMode
  ): Promise<Route> {
    // Mock implementation - replace with actual API calls
    const distance = this.calculateDistance(origin, destination);
    const duration = this.estimateDuration(distance, transportationMode);
    const carbonEmission = emissionCalculator.calculateEmissions({
      distance,
      transportationMode
    });

    return {
      id: `route_${Date.now()}_${transportationMode.id}`,
      origin,
      destination,
      distance,
      duration,
      transportationMode,
      carbonEmission,
      cost: this.estimateCost(distance, transportationMode),
      polyline: this.generateMockPolyline(origin, destination)
    };
  }

  /**
   * Get route comparisons for all available transportation modes
   */
  async getRouteComparisons(
    origin: Location,
    destination: Location,
    preferredModes?: string[]
  ): Promise<RouteComparison> {
    const modesToCompare = preferredModes 
      ? TRANSPORTATION_MODES.filter(mode => preferredModes.includes(mode.id))
      : TRANSPORTATION_MODES;

    const routes = await Promise.all(
      modesToCompare.map(mode => this.calculateRoute(origin, destination, mode))
    );

    // Sort by carbon emissions (ascending)
    const sortedByEmissions = [...routes].sort((a, b) => a.carbonEmission - b.carbonEmission);
    const bestEcoOption = sortedByEmissions[0];
    const worstEcoOption = sortedByEmissions[sortedByEmissions.length - 1];

    const potentialSavings = worstEcoOption.carbonEmission - bestEcoOption.carbonEmission;
    const savingsPercentage = worstEcoOption.carbonEmission > 0 
      ? Math.round((potentialSavings / worstEcoOption.carbonEmission) * 100)
      : 0;

    return {
      routes,
      bestEcoOption,
      worstEcoOption,
      potentialSavings,
      savingsPercentage
    };
  }

  /**
   * Get eco-friendly alternatives with detailed analysis
   */
  async getEcoAlternatives(
    origin: Location,
    destination: Location,
    currentModeId: string
  ): Promise<AlternativeRoute[]> {
    const currentMode = TRANSPORTATION_MODES.find(mode => mode.id === currentModeId);
    if (!currentMode) return [];

    const currentRoute = await this.calculateRoute(origin, destination, currentMode);
    const ecoModes = emissionCalculator.getEcoAlternatives(currentModeId);

    const alternatives = await Promise.all(
      ecoModes.map(async (mode) => {
        const route = await this.calculateRoute(origin, destination, mode);
        const savings = emissionCalculator.calculateSavings(
          route.distance,
          currentMode,
          mode
        );

        return {
          route,
          savings: {
            co2: savings.co2Saved,
            cost: (currentRoute.cost || 0) - (route.cost || 0),
            time: currentRoute.duration - route.duration
          },
          feasibilityScore: this.calculateFeasibilityScore(route, mode),
          realTimeData: await this.getRealTimeData(route, mode)
        };
      })
    );

    // Sort by feasibility score and CO2 savings
    return alternatives.sort((a, b) => {
      const scoreA = a.feasibilityScore + (a.savings.co2 / 10);
      const scoreB = b.feasibilityScore + (b.savings.co2 / 10);
      return scoreB - scoreA;
    });
  }

  /**
   * Calculate distance between two points using Haversine formula
   */
  private calculateDistance(origin: Location, destination: Location): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(destination.lat - origin.lat);
    const dLon = this.toRadians(destination.lng - origin.lng);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(origin.lat)) * Math.cos(this.toRadians(destination.lat)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return Math.round(distance * 100) / 100; // Round to 2 decimal places
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Estimate travel duration based on transportation mode
   */
  private estimateDuration(distance: number, mode: TransportationMode): number {
    const speedKmh = this.getAverageSpeed(mode);
    const durationHours = distance / speedKmh;
    return Math.round(durationHours * 60); // Convert to minutes
  }

  private getAverageSpeed(mode: TransportationMode): number {
    const speeds: Record<string, number> = {
      walking: 5,
      cycling: 15,
      electric_scooter: 20,
      bus: 25,
      train: 40,
      electric_car: 35,
      hybrid_car: 35,
      motorcycle: 40,
      car_gasoline: 35,
      car_diesel: 35,
      rideshare: 30,
      taxi: 30
    };
    return speeds[mode.id] || 30;
  }

  /**
   * Estimate cost for the trip (in Indian Rupees - ₹)
   */
  private estimateCost(distance: number, mode: TransportationMode): number {
    const costPerKm: Record<string, number> = {
      walking: 0,
      cycling: 0,
      electric_scooter: 8, // ₹8 per km (Ola Electric, Bounce)
      bus: 5, // ₹5 per km (BMTC, DTC)
      train: 3, // ₹3 per km (Metro, Local trains)
      electric_car: 12, // ₹12 per km (Tata Nexon EV, MG ZS EV)
      hybrid_car: 15, // ₹15 per km (Toyota Camry Hybrid)
      motorcycle: 8, // ₹8 per km (Petrol bikes)
      car_gasoline: 18, // ₹18 per km (Maruti, Hyundai)
      car_diesel: 16, // ₹16 per km (Diesel cars)
      rideshare: 25, // ₹25 per km (Ola, Uber)
      taxi: 30 // ₹30 per km (Local taxis)
    };
    
    const baseCost = (costPerKm[mode.id] || 15.0) * distance;
    return Math.round(baseCost * 100) / 100;
  }

  /**
   * Calculate feasibility score (0-100) based on various factors
   */
  private calculateFeasibilityScore(route: Route, mode: TransportationMode): number {
    let score = 70; // Base score
    
    // Distance factor
    if (route.distance < 2) {
      if (['walking', 'cycling', 'electric_scooter'].includes(mode.id)) score += 20;
    } else if (route.distance < 10) {
      if (['cycling', 'bus', 'train'].includes(mode.id)) score += 15;
    } else {
      if (['train', 'bus', 'electric_car'].includes(mode.id)) score += 10;
    }
    
    // Weather factor (mock - in production, integrate with weather API)
    const isGoodWeather = Math.random() > 0.3;
    if (!isGoodWeather && ['walking', 'cycling'].includes(mode.id)) {
      score -= 20;
    }
    
    // Time factor
    if (route.duration < 30) score += 10;
    else if (route.duration > 60) score -= 10;
    
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Get real-time data for transportation modes
   */
  private async getRealTimeData(route: Route, mode: TransportationMode): Promise<any> {
    // Mock implementation - integrate with real APIs in production
    const mockData: any = {};
    
    if (['bus', 'train'].includes(mode.id)) {
      mockData.publicTransportDelay = Math.random() > 0.7 ? Math.floor(Math.random() * 15) : 0;
    }
    
    if (mode.id === 'cycling') {
      mockData.bikeShareAvailability = Math.floor(Math.random() * 10) + 1;
    }
    
    if (['car_gasoline', 'car_diesel', 'rideshare', 'taxi'].includes(mode.id)) {
      const conditions = ['light', 'moderate', 'heavy'];
      mockData.trafficConditions = conditions[Math.floor(Math.random() * conditions.length)];
    }
    
    return mockData;
  }

  /**
   * Generate mock polyline for route visualization
   */
  private generateMockPolyline(origin: Location, destination: Location): string {
    // In production, this would come from the routing API
    return `mock_polyline_${origin.lat}_${origin.lng}_${destination.lat}_${destination.lng}`;
  }

  /**
   * Geocode address to coordinates
   */
  async geocodeAddress(address: string): Promise<Location | null> {
    // Mock implementation - integrate with geocoding API in production
    const mockLocations: Record<string, Location> = {
      'downtown': { lat: 40.7128, lng: -74.0060, address: 'Downtown, New York, NY' },
      'airport': { lat: 40.6413, lng: -73.7781, address: 'JFK Airport, Queens, NY' },
      'central park': { lat: 40.7829, lng: -73.9654, address: 'Central Park, New York, NY' },
      'times square': { lat: 40.7580, lng: -73.9855, address: 'Times Square, New York, NY' }
    };
    
    const normalized = address.toLowerCase();
    for (const [key, location] of Object.entries(mockLocations)) {
      if (normalized.includes(key)) {
        return location;
      }
    }
    
    // Return mock location if not found
    return {
      lat: 40.7128 + (Math.random() - 0.5) * 0.1,
      lng: -74.0060 + (Math.random() - 0.5) * 0.1,
      address: address
    };
  }
}

// Export singleton instance
export const routingService = new RoutingService();
