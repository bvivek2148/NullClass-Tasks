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

// Bus Tour Feature Types

export interface BusOperator {
  id: string;
  name: string;
  logo?: string;
  rating: number;
  contactInfo: {
    phone?: string;
    email?: string;
    website?: string;
  };
  policies: {
    cancellation: string;
    refund: string;
    baggage: string;
  };
}

export interface BusModel {
  id: string;
  name: string;
  manufacturer: string;
  capacity: number;
  amenities: BusAmenity[];
  specifications: {
    length: number;
    width: number;
    height: number;
    fuelType: 'diesel' | 'electric' | 'hybrid' | 'cng';
    emissionStandard: string;
  };
  accessibility: {
    wheelchairAccessible: boolean;
    audioAnnouncements: boolean;
    visualAids: boolean;
  };
}

export interface BusAmenity {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: 'comfort' | 'entertainment' | 'connectivity' | 'safety' | 'accessibility';
  available: boolean;
  location?: {
    section: 'front' | 'middle' | 'back' | 'throughout';
    coordinates?: { x: number; y: number; z: number };
  };
}

export interface SeatType {
  id: string;
  name: string;
  description: string;
  features: string[];
  priceModifier: number; // multiplier for base price
  color: string; // for visual representation
  icon: string;
}

export interface Seat {
  id: string;
  number: string;
  row: number;
  column: string;
  type: SeatType;
  position: 'window' | 'aisle' | 'middle';
  status: 'available' | 'occupied' | 'selected' | 'disabled' | 'reserved';
  coordinates: {
    x: number; // position in 3D space for overlay
    y: number;
    z: number;
  };
  accessibility: {
    wheelchairAccessible: boolean;
    nearRestroom: boolean;
    extraLegroom: boolean;
  };
  price?: number;
}

export interface VirtualTourViewpoint {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    yaw: number;
    pitch: number;
  };
  hotspots: VirtualTourHotspot[];
  accessibleSeats: string[]; // seat IDs visible from this viewpoint
}

export interface VirtualTourHotspot {
  id: string;
  type: 'amenity' | 'seat' | 'navigation' | 'info';
  position: {
    yaw: number;
    pitch: number;
  };
  content: {
    title: string;
    description?: string;
    icon?: string;
    action?: 'navigate' | 'select_seat' | 'show_info';
    target?: string; // viewpoint ID or seat ID
  };
  style: {
    color: string;
    size: 'small' | 'medium' | 'large';
    animation?: 'pulse' | 'bounce' | 'none';
  };
}

export interface BusLayout {
  id: string;
  busModelId: string;
  name: string;
  totalSeats: number;
  rows: number;
  seatsPerRow: number;
  aisleConfiguration: 'single' | 'double';
  seats: Seat[];
  seatMap: {
    [row: number]: {
      [column: string]: Seat;
    };
  };
  emergencyExits: {
    id: string;
    location: string;
    coordinates: { x: number; y: number; z: number };
  }[];
}

export interface VirtualBusTour {
  id: string;
  busId: string;
  busModel: BusModel;
  layout: BusLayout;
  viewpoints: VirtualTourViewpoint[];
  defaultViewpoint: string; // viewpoint ID
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    version: string;
    photographer?: string;
    equipment?: string;
  };
  settings: {
    autoRotate: boolean;
    autoRotateSpeed: number;
    zoomLevels: {
      min: number;
      max: number;
      default: number;
    };
    transitionDuration: number;
  };
}

export interface BusRoute {
  id: string;
  operatorId: string;
  operator: BusOperator;
  routeNumber: string;
  name: string;
  origin: Location;
  destination: Location;
  stops: BusStop[];
  schedule: BusSchedule[];
  duration: number; // in minutes
  distance: number; // in kilometers
  pricing: {
    basePrice: number;
    currency: string;
    discounts: {
      student: number;
      senior: number;
      child: number;
    };
  };
  busModel: BusModel;
  virtualTour?: VirtualBusTour;
  amenities: BusAmenity[];
  carbonEmission: number; // grams CO2 per passenger per km
}

export interface BusStop {
  id: string;
  name: string;
  location: Location;
  arrivalTime: string;
  departureTime: string;
  platform?: string;
  amenities: string[];
}

export interface BusSchedule {
  id: string;
  departureTime: string;
  arrivalTime: string;
  frequency: number; // minutes between buses
  operatingDays: ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday')[];
  seasonalSchedule?: {
    startDate: Date;
    endDate: Date;
    specialNotes: string;
  };
}

export interface BusBooking {
  id: string;
  userId: string;
  routeId: string;
  route: BusRoute;
  selectedSeats: Seat[];
  passengers: {
    name: string;
    age: number;
    type: 'adult' | 'child' | 'senior' | 'student';
    seatId: string;
  }[];
  travelDate: Date;
  departureTime: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  bookingDate: Date;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  carbonFootprint: number; // grams CO2 for this trip
  virtualTourViewed: boolean;
}

export interface VirtualTourSession {
  id: string;
  userId?: string;
  tourId: string;
  startTime: Date;
  endTime?: Date;
  viewpoints: {
    viewpointId: string;
    timeSpent: number; // seconds
    interactions: number;
  }[];
  seatsViewed: string[];
  seatsSelected: string[];
  deviceInfo: {
    type: 'desktop' | 'tablet' | 'mobile';
    browser: string;
    screenSize: string;
    touchSupport: boolean;
  };
  conversionData: {
    proceededToBooking: boolean;
    bookingCompleted: boolean;
    bookingId?: string;
  };
}
