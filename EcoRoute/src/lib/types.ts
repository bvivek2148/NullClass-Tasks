// Core types for the Carbon Footprint Calculator

export interface TransportationMode {
  id: string;
  name: string;
  icon: string;
  emissionFactor: number; // grams CO2 per km
  category: 'low' | 'medium' | 'high';
  description: string;
}

export interface Route {
  id: string;
  origin: Location;
  destination: Location;
  distance: number; // in kilometers
  duration: number; // in minutes
  transportationMode: TransportationMode;
  carbonEmission: number; // in grams CO2
  cost?: number;
  polyline?: string;
}

export interface Location {
  lat: number;
  lng: number;
  address: string;
  name?: string;
}

export interface RouteComparison {
  routes: Route[];
  bestEcoOption: Route;
  worstEcoOption: Route;
  potentialSavings: number; // in grams CO2
  savingsPercentage: number;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  preferences: {
    defaultTransportMode: string;
    carbonGoals: {
      daily: number;
      weekly: number;
      monthly: number;
    };
    notifications: boolean;
  };
  stats: {
    totalCO2Saved: number;
    currentStreak: number;
    totalTrips: number;
    achievements: Achievement[];
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  threshold: number;
  category: 'bronze' | 'silver' | 'gold' | 'platinum';
  unlockedAt?: Date;
  progress: number;
}

export interface TripRecord {
  id: string;
  userId: string;
  route: Route;
  actualTransportMode: TransportationMode;
  carbonEmitted: number;
  carbonSaved: number;
  timestamp: Date;
  weather?: string;
  notes?: string;
}

export interface EmissionCalculationParams {
  distance: number;
  transportationMode: TransportationMode;
  occupancy?: number;
  vehicleType?: string;
  fuelType?: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  electricityGridFactor?: number; // for electric vehicles
}

export interface AlternativeRoute {
  route: Route;
  savings: {
    co2: number;
    cost: number;
    time: number;
  };
  feasibilityScore: number; // 0-100
  realTimeData?: {
    publicTransportDelay?: number;
    bikeShareAvailability?: number;
    trafficConditions?: string;
  };
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  category: 'transport' | 'merchant' | 'environmental';
  partnerName?: string;
  expiryDate?: Date;
  termsAndConditions: string;
}

export interface UserReward {
  id: string;
  userId: string;
  rewardId: string;
  redeemedAt: Date;
  status: 'active' | 'used' | 'expired';
  code?: string;
}

export interface CarbonFootprintSummary {
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  totalEmissions: number;
  totalSavings: number;
  averagePerTrip: number;
  comparisonToPrevious: number;
  breakdown: {
    transportMode: string;
    emissions: number;
    percentage: number;
  }[];
}

export interface EnvironmentalImpact {
  co2InGrams: number;
  equivalents: {
    treesNeeded: number;
    carMilesDriven: number;
    phoneCharges: number;
    lightBulbHours: number;
  };
  description: string;
}
