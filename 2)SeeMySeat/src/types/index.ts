// Virtual Tour Types
export interface VirtualBusTour {
  id: string;
  busModel: BusModel;
  viewpoints: VirtualTourViewpoint[];
  defaultViewpoint: string;
  settings: VirtualTourSettings;
  layout: BusLayout;
  metadata: TourMetadata;
}

export interface VirtualTourViewpoint {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  thumbnailUrl?: string;
  rotation: {
    yaw: number;
    pitch: number;
  };
  hotspots: VirtualTourHotspot[];
  accessibleSeats: string[];
  position: ViewpointPosition;
}

export interface VirtualTourHotspot {
  id: string;
  type: HotspotType;
  position: {
    yaw: number;
    pitch: number;
  };
  content: HotspotContent;
  style?: HotspotStyle;
  interactive: boolean;
  accessibility?: AccessibilityInfo;
}

export interface VirtualTourSettings {
  autoRotate: boolean;
  autoRotateSpeed: number;
  zoomLevels: {
    min: number;
    max: number;
    default: number;
  };
  transitionDuration: number;
  enableVR: boolean;
  enableKeyboardNavigation: boolean;
  progressiveLoading: boolean;
}

export interface TourMetadata {
  title: string;
  description: string;
  duration: number; // estimated viewing time in minutes
  difficulty: 'easy' | 'medium' | 'advanced';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  version: string;
}

// Bus and Seating Types
export interface BusModel {
  id: string;
  name: string;
  manufacturer: string;
  capacity: number;
  amenities: BusAmenity[];
  specifications: BusSpecifications;
  images: {
    exterior: string[];
    interior: string[];
  };
}

export interface BusLayout {
  id: string;
  rows: number;
  seatsPerRow: number;
  aisleWidth: number;
  seats: Seat[];
  emergencyExits: EmergencyExit[];
  amenityLocations: AmenityLocation[];
  accessibility: AccessibilityFeatures;
}

export interface Seat {
  id: string;
  row: number;
  column: string;
  position: SeatPosition;
  type: SeatType;
  status: SeatStatus;
  features: SeatFeature[];
  accessibility: SeatAccessibility;
  pricing: SeatPricing;
  coordinates: {
    x: number;
    y: number;
    z?: number; // for 3D positioning in virtual tour
  };
}

export interface SeatType {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  features: string[];
  basePrice: number;
  premiumMultiplier: number;
}

// Enums and Union Types
export type SeatStatus = 'available' | 'occupied' | 'selected' | 'reserved' | 'disabled' | 'maintenance';
export type SeatPosition = 'window' | 'aisle' | 'middle';
export type HotspotType = 'seat' | 'amenity' | 'navigation' | 'information' | 'emergency';
export type ViewpointPosition = 'front' | 'middle' | 'back' | 'driver' | 'entrance' | 'exit';

// Additional Interfaces
export interface HotspotContent {
  title: string;
  description?: string;
  icon?: string;
  image?: string;
  action?: HotspotAction;
  data?: any;
}

export interface HotspotAction {
  type: 'navigate' | 'select_seat' | 'show_info' | 'toggle_amenity';
  target?: string;
  callback?: () => void;
}

export interface HotspotStyle {
  size: number;
  color: string;
  borderColor?: string;
  backgroundColor?: string;
  opacity?: number;
  animation?: string;
}

export interface AccessibilityInfo {
  ariaLabel: string;
  description: string;
  keyboardShortcut?: string;
  screenReaderText?: string;
}

export interface BusAmenity {
  id: string;
  name: string;
  description: string;
  icon: string;
  available: boolean;
  location?: string;
  category: AmenityCategory;
}

export interface BusSpecifications {
  length: number;
  width: number;
  height: number;
  weight: number;
  fuelType: string;
  engineType: string;
  maxSpeed: number;
  range: number;
}

export interface EmergencyExit {
  id: string;
  type: 'door' | 'window' | 'roof_hatch';
  location: {
    row: number;
    side: 'left' | 'right' | 'front' | 'back';
  };
  instructions: string;
}

export interface AmenityLocation {
  amenityId: string;
  coordinates: {
    x: number;
    y: number;
    z?: number;
  };
  viewpointId?: string;
}

export interface AccessibilityFeatures {
  wheelchairAccessible: boolean;
  wheelchairSpaces: number;
  audioAnnouncements: boolean;
  visualAnnouncements: boolean;
  brailleSignage: boolean;
  lowFloorAccess: boolean;
  prioritySeating: number;
}

export interface SeatFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: FeatureCategory;
}

export interface SeatAccessibility {
  wheelchairAccessible: boolean;
  extraLegroom: boolean;
  nearEmergencyExit: boolean;
  prioritySeat: boolean;
  assistanceRequired: boolean;
}

export interface SeatPricing {
  basePrice: number;
  dynamicPrice?: number;
  discounts: PriceDiscount[];
  currency: string;
}

export interface PriceDiscount {
  type: 'student' | 'senior' | 'military' | 'group' | 'early_bird';
  percentage: number;
  amount?: number;
  conditions: string[];
}

// Enums for categories
export type AmenityCategory = 'comfort' | 'entertainment' | 'connectivity' | 'safety' | 'accessibility' | 'food_beverage';
export type FeatureCategory = 'comfort' | 'technology' | 'safety' | 'accessibility' | 'storage';

// Component Props Types
export interface VirtualTourViewerProps {
  tour: VirtualBusTour;
  selectedSeats: string[];
  onSeatSelect: (seatId: string) => void;
  onSeatDeselect: (seatId: string) => void;
  onClose: () => void;
  isFullscreen?: boolean;
  onFullscreenToggle?: () => void;
  className?: string;
}

export interface InteractiveSeatingMapProps {
  layout: BusLayout;
  selectedSeats: string[];
  onSeatSelect: (seatId: string) => void;
  onSeatDeselect: (seatId: string) => void;
  onSeatHover?: (seat: Seat | null) => void;
  maxSelectableSeats?: number;
  className?: string;
  showLegend?: boolean;
  compactMode?: boolean;
  realTimeUpdates?: boolean;
  highlightedSeats?: string[];
  showPricing?: boolean;
  showRecommendations?: boolean;
  onSeatFocus?: (seat: Seat | null) => void;
  ariaLabel?: string;
}