import { Location } from './types';

// Real-time data interfaces
export interface TrafficData {
  level: 'light' | 'moderate' | 'heavy';
  delayMinutes: number;
  emissionMultiplier: number; // 1.0 = normal, 1.5 = 50% more emissions due to traffic
}

export interface PublicTransportData {
  delays: {
    bus: number; // minutes
    train: number; // minutes
    metro: number; // minutes
  };
  availability: {
    frequency: number; // vehicles per hour
    capacity: number; // percentage full
  };
}

export interface BikeShareData {
  availableBikes: number;
  availableDocks: number;
  stationDistance: number; // km to nearest station
}

export interface WeatherData {
  temperature: number; // Celsius
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';
  precipitation: number; // mm
  windSpeed: number; // km/h
  walkingFeasibility: number; // 0-100 score
  cyclingFeasibility: number; // 0-100 score
}

export interface RealTimeDataResponse {
  traffic: TrafficData;
  publicTransport: PublicTransportData;
  bikeShare: BikeShareData;
  weather: WeatherData;
  timestamp: Date;
}

// Real-time data service class
export class RealTimeDataService {
  private apiKey: string;
  private cache: Map<string, { data: RealTimeDataResponse; expiry: Date }> = new Map();

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.NEXT_PUBLIC_REALTIME_API_KEY || '';
  }

  /**
   * Get comprehensive real-time data for a route
   */
  async getRealTimeData(origin: Location, destination: Location): Promise<RealTimeDataResponse> {
    const cacheKey = `${origin.lat},${origin.lng}-${destination.lat},${destination.lng}`;
    
    // Check cache first (5-minute expiry)
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expiry > new Date()) {
      return cached.data;
    }

    try {
      // In production, these would be real API calls
      const [traffic, publicTransport, bikeShare, weather] = await Promise.all([
        this.getTrafficData(origin, destination),
        this.getPublicTransportData(origin, destination),
        this.getBikeShareData(origin),
        this.getWeatherData(origin)
      ]);

      const realTimeData: RealTimeDataResponse = {
        traffic,
        publicTransport,
        bikeShare,
        weather,
        timestamp: new Date()
      };

      // Cache the result
      this.cache.set(cacheKey, {
        data: realTimeData,
        expiry: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
      });

      return realTimeData;
    } catch (error) {
      console.error('Error fetching real-time data:', error);
      return this.getMockData();
    }
  }

  /**
   * Get traffic data using Google Distance Matrix API (mock implementation)
   */
  private async getTrafficData(origin: Location, destination: Location): Promise<TrafficData> {
    // Mock implementation - in production, use Google Distance Matrix API
    // const response = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.lat},${origin.lng}&destinations=${destination.lat},${destination.lng}&departure_time=now&traffic_model=best_guess&key=${this.apiKey}`);
    
    // Simulate traffic conditions
    const hour = new Date().getHours();
    let level: TrafficData['level'] = 'light';
    let delayMinutes = 0;
    let emissionMultiplier = 1.0;

    // Rush hour logic
    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
      level = Math.random() > 0.5 ? 'heavy' : 'moderate';
      delayMinutes = level === 'heavy' ? Math.floor(Math.random() * 20) + 10 : Math.floor(Math.random() * 10) + 5;
      emissionMultiplier = level === 'heavy' ? 1.4 : 1.2;
    } else if (hour >= 10 && hour <= 16) {
      level = Math.random() > 0.7 ? 'moderate' : 'light';
      delayMinutes = level === 'moderate' ? Math.floor(Math.random() * 8) + 2 : 0;
      emissionMultiplier = level === 'moderate' ? 1.1 : 1.0;
    }

    return { level, delayMinutes, emissionMultiplier };
  }

  /**
   * Get public transport data using GTFS feeds (mock implementation)
   */
  private async getPublicTransportData(origin: Location, destination: Location): Promise<PublicTransportData> {
    // Mock implementation - in production, integrate with local GTFS feeds
    // Real implementation would query transit agencies' real-time APIs
    
    const baseDelays = {
      bus: Math.floor(Math.random() * 8), // 0-7 minutes
      train: Math.floor(Math.random() * 5), // 0-4 minutes
      metro: Math.floor(Math.random() * 3) // 0-2 minutes
    };

    const availability = {
      frequency: Math.floor(Math.random() * 8) + 4, // 4-12 vehicles per hour
      capacity: Math.floor(Math.random() * 40) + 30 // 30-70% full
    };

    return { delays: baseDelays, availability };
  }

  /**
   * Get bike share availability data
   */
  private async getBikeShareData(location: Location): Promise<BikeShareData> {
    // Mock implementation - in production, integrate with bike share APIs
    // (Citi Bike, Divvy, etc.)
    
    return {
      availableBikes: Math.floor(Math.random() * 15) + 1, // 1-15 bikes
      availableDocks: Math.floor(Math.random() * 10) + 5, // 5-14 docks
      stationDistance: Math.random() * 0.8 + 0.1 // 0.1-0.9 km
    };
  }

  /**
   * Get weather data affecting transportation
   */
  private async getWeatherData(location: Location): Promise<WeatherData> {
    // Mock implementation - in production, use OpenWeatherMap or similar
    
    const conditions: WeatherData['condition'][] = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy'];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    const temperature = Math.floor(Math.random() * 30) + 5; // 5-35°C
    const precipitation = condition === 'rainy' ? Math.random() * 10 : 0;
    const windSpeed = Math.random() * 25; // 0-25 km/h

    // Calculate feasibility scores
    let walkingFeasibility = 80;
    let cyclingFeasibility = 75;

    if (condition === 'rainy') {
      walkingFeasibility -= 30;
      cyclingFeasibility -= 40;
    } else if (condition === 'snowy') {
      walkingFeasibility -= 40;
      cyclingFeasibility -= 60;
    } else if (condition === 'windy' && windSpeed > 15) {
      cyclingFeasibility -= 25;
    }

    if (temperature < 0) {
      walkingFeasibility -= 20;
      cyclingFeasibility -= 30;
    } else if (temperature > 30) {
      walkingFeasibility -= 15;
      cyclingFeasibility -= 20;
    }

    return {
      temperature,
      condition,
      precipitation,
      windSpeed,
      walkingFeasibility: Math.max(0, Math.min(100, walkingFeasibility)),
      cyclingFeasibility: Math.max(0, Math.min(100, cyclingFeasibility))
    };
  }

  /**
   * Get mock data for fallback
   */
  getMockData(): RealTimeDataResponse {
    return {
      traffic: {
        level: 'moderate',
        delayMinutes: 5,
        emissionMultiplier: 1.1
      },
      publicTransport: {
        delays: { bus: 3, train: 1, metro: 0 },
        availability: { frequency: 6, capacity: 45 }
      },
      bikeShare: {
        availableBikes: 8,
        availableDocks: 12,
        stationDistance: 0.3
      },
      weather: {
        temperature: 22,
        condition: 'cloudy',
        precipitation: 0,
        windSpeed: 8,
        walkingFeasibility: 85,
        cyclingFeasibility: 80
      },
      timestamp: new Date()
    };
  }

  /**
   * Calculate adjusted emissions based on real-time conditions
   */
  calculateAdjustedEmissions(baseEmissions: number, transportMode: string, realTimeData: RealTimeDataResponse): number {
    let adjustedEmissions = baseEmissions;

    // Apply traffic multiplier for car-based transport
    if (['car_gasoline', 'car_diesel', 'hybrid_car', 'rideshare', 'taxi'].includes(transportMode)) {
      adjustedEmissions *= realTimeData.traffic.emissionMultiplier;
    }

    // Apply weather impact for active transport
    if (transportMode === 'walking' || transportMode === 'cycling') {
      // No direct emission impact, but affects feasibility
      return adjustedEmissions;
    }

    // Apply public transport efficiency based on capacity
    if (['bus', 'train'].includes(transportMode)) {
      const capacityFactor = realTimeData.publicTransport.availability.capacity / 100;
      // More crowded = more efficient per person
      adjustedEmissions *= (1 - capacityFactor * 0.2); // Up to 20% more efficient when full
    }

    return Math.round(adjustedEmissions);
  }
}

// Export singleton instance
export const realTimeDataService = new RealTimeDataService();
