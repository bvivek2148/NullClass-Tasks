// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  location?: string;
  phone?: string;
  dateOfBirth?: string;
  isVerified: boolean;
  role: UserRole;
  reputation: number;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  isActive: boolean;
}

export interface UserProfile extends User {
  stats: {
    tripsCompleted: number;
    routesTraveled: number;
    communityPosts: number;
    helpfulVotes: number;
    reputation: number;
  };
  badges: Badge[];
  recentActivity: Activity[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
}

export interface Activity {
  id: string;
  type: 'post' | 'tip' | 'photo' | 'review' | 'booking';
  title: string;
  createdAt: string;
}

// Route Types
export interface Route {
  id: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  price: {
    economy: number;
    premium: number;
  };
  schedules: Schedule[];
  amenities: string[];
  operator: string;
  rating: number;
  reviewCount: number;
}

export interface Schedule {
  id: string;
  departureTime: string;
  arrivalTime: string;
  available: boolean;
  availableSeats: number;
  price: {
    economy: number;
    premium: number;
  };
}

export interface RouteStop {
  id: string;
  name: string;
  arrivalTime?: string;
  departureTime?: string;
  stopOrder: number;
}

export interface SeatMap {
  busType: string;
  totalSeats: number;
  layout: {
    rows: number;
    seatsPerRow: number;
    aislePosition: number;
  };
  seats: Seat[];
}

export interface Seat {
  id: string;
  number: string;
  type: 'economy' | 'premium';
  status: 'available' | 'occupied' | 'selected';
  price: number;
  features: string[];
}

// Booking Types
export interface Booking {
  id: string;
  userId: string;
  routeId: string;
  scheduleId: string;
  bookingNumber: string;
  seatNumbers: string[];
  passengerInfo: PassengerInfo[];
  contactInfo: ContactInfo;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  status: BookingStatus;
  qrCode?: string;
  createdAt: string;
  updatedAt: string;
  travelDate: string;
  route: {
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    operator: string;
  };
}

export interface PassengerInfo {
  firstName: string;
  lastName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  seatNumber: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

// Community Types
export interface Post {
  id: string;
  userId: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    reputation: number;
    badges: string[];
  };
  title: string;
  content: string;
  category: PostCategory;
  routeId?: string;
  tags: string[];
  upvotes: number;
  downvotes: number;
  commentCount: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
  isLocked: boolean;
  bestAnswerId?: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  parentId?: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    reputation: number;
  };
  content: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  isBestAnswer: boolean;
  replies?: Comment[];
}

// Content Types
export interface Tip {
  id: string;
  userId: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    reputation: number;
  };
  title: string;
  content: string;
  category: TipCategory;
  routeId?: string;
  location?: string;
  tags: string[];
  rating: number;
  ratingCount: number;
  helpfulVotes: number;
  notHelpfulVotes: number;
  viewCount: number;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  photos: Photo[];
}

export interface Photo {
  id: string;
  userId: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  location?: string;
  routeId?: string;
  tags: string[];
  likes: number;
  viewCount: number;
  createdAt: string;
  exifData?: {
    camera?: string;
    location?: {
      lat: number;
      lng: number;
    };
    timestamp?: string;
  };
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  hasMore: boolean;
  offset: number;
  limit: number;
}

// Enums
export enum UserRole {
  USER = 'USER',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum BookingStatus {
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  NO_SHOW = 'NO_SHOW',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum PostCategory {
  GENERAL = 'GENERAL',
  ROUTE_SPECIFIC = 'ROUTE_SPECIFIC',
  DESTINATION = 'DESTINATION',
  SAFETY = 'SAFETY',
  BUDGET = 'BUDGET',
}

export enum TipCategory {
  ROUTE = 'ROUTE',
  DESTINATION = 'DESTINATION',
  SAFETY = 'SAFETY',
  BUDGET = 'BUDGET',
  FOOD = 'FOOD',
}

export enum NotificationType {
  BOOKING_CONFIRMATION = 'BOOKING_CONFIRMATION',
  BOOKING_REMINDER = 'BOOKING_REMINDER',
  PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  TRIP_UPDATE = 'TRIP_UPDATE',
  NEW_MESSAGE = 'NEW_MESSAGE',
  NEW_FOLLOWER = 'NEW_FOLLOWER',
  POST_REPLY = 'POST_REPLY',
  POST_VOTE = 'POST_VOTE',
  TIP_RATING = 'TIP_RATING',
  BADGE_EARNED = 'BADGE_EARNED',
  SYSTEM_ANNOUNCEMENT = 'SYSTEM_ANNOUNCEMENT',
}
