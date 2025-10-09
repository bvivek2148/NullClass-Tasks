import { VirtualBusTour, BusModel, BusLayout, Seat, SeatType, VirtualTourViewpoint, VirtualTourHotspot } from '@/types';

// Sample seat types
export const sampleSeatTypes: SeatType[] = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'Comfortable standard seating',
    color: '#3B82F6',
    icon: '🪑',
    features: ['Reclining', 'Armrest'],
    basePrice: 800, // ₹800
    premiumMultiplier: 1.0,
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Extra legroom and comfort',
    color: '#10B981',
    icon: '✨',
    features: ['Extra Legroom', 'Premium Cushioning', 'USB Charging'],
    basePrice: 1200, // ₹1200
    premiumMultiplier: 1.4,
  },
  {
    id: 'accessible',
    name: 'Accessible',
    description: 'Wheelchair accessible seating',
    color: '#6366F1',
    icon: '♿',
    features: ['Wheelchair Accessible', 'Priority Boarding'],
    basePrice: 800, // ₹800
    premiumMultiplier: 1.0,
  },
];

// Generate sample seats
export const generateSampleSeats = (rows: number, seatsPerRow: number): Seat[] => {
  const seats: Seat[] = [];
  const columns = ['A', 'B', 'C', 'D'];

  for (let row = 1; row <= rows; row++) {
    for (let colIndex = 0; colIndex < Math.min(seatsPerRow, columns.length); colIndex++) {
      const column = columns[colIndex];
      const seatId = `${row}${column}`;

      // Determine seat position
      let position: 'window' | 'aisle' | 'middle';
      if (colIndex === 0 || colIndex === columns.length - 1) {
        position = 'window';
      } else if (colIndex === 1 || colIndex === 2) {
        position = colIndex === 1 ? 'aisle' : 'aisle';
      } else {
        position = 'middle';
      }

      // Determine seat type
      let seatType = sampleSeatTypes[0]; // default to standard
      if (row <= 3) {
        seatType = sampleSeatTypes[1]; // premium for front rows
      } else if (row === rows && colIndex === 0) {
        seatType = sampleSeatTypes[2]; // accessible seat at back
      }

      // Random seat status for demo
      const statuses: Seat['status'][] = ['available', 'available', 'available', 'occupied', 'reserved'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

      const seat: Seat = {
        id: seatId,
        row,
        column,
        position,
        type: seatType,
        status: randomStatus,
        features: [
          {
            id: 'reclining',
            name: 'Reclining',
            description: 'Adjustable seat back',
            icon: '🔄',
            category: 'comfort',
          },
          {
            id: 'usb',
            name: 'USB Charging',
            description: 'USB port for device charging',
            icon: '🔌',
            category: 'technology',
          },
        ],
        accessibility: {
          wheelchairAccessible: seatType.id === 'accessible',
          extraLegroom: seatType.id === 'premium',
          nearEmergencyExit: row === rows,
          prioritySeat: seatType.id === 'accessible',
          assistanceRequired: false,
        },
        pricing: {
          basePrice: seatType.basePrice + (row <= 3 ? 200 : 0), // ₹200 extra for front rows
          currency: 'INR',
          discounts: [],
        },
        coordinates: {
          x: colIndex * 60 + 30,
          y: row * 80 + 40,
          z: 0,
        },
      };

      seats.push(seat);
    }
  }

  return seats;
};

// Sample bus model
export const sampleBusModel: BusModel = {
  id: 'luxury-coach-001',
  name: 'Bharat Luxury Express',
  manufacturer: 'Tata Motors',
  capacity: 48,
  amenities: [
    {
      id: 'wifi',
      name: 'Free WiFi',
      description: 'High-speed internet access',
      icon: '📶',
      available: true,
      category: 'connectivity',
    },
    {
      id: 'ac',
      name: 'Air Conditioning',
      description: 'Climate controlled environment',
      icon: '❄️',
      available: true,
      category: 'comfort',
    },
    {
      id: 'restroom',
      name: 'Onboard Restroom',
      description: 'Clean restroom facilities',
      icon: '🚻',
      available: true,
      location: 'Rear of bus',
      category: 'comfort',
    },
    {
      id: 'entertainment',
      name: 'Entertainment System',
      description: 'Individual screens with movies and music',
      icon: '📺',
      available: true,
      category: 'entertainment',
    },
  ],
  specifications: {
    length: 12.5,
    width: 2.5,
    height: 3.8,
    weight: 18000,
    fuelType: 'Diesel',
    engineType: 'Euro 6',
    maxSpeed: 100,
    range: 800,
  },
  images: {
    exterior: ['/images/bus-exterior-1.jpg', '/images/bus-exterior-2.jpg'],
    interior: ['/images/bus-interior-1.jpg', '/images/bus-interior-2.jpg'],
  },
};

// Sample viewpoints
export const sampleViewpoints: VirtualTourViewpoint[] = [
  {
    id: 'front-view',
    name: 'Front Section',
    description: 'Premium seating area with extra legroom',
    imageUrl: '/images/bus-360-front.jpg',
    thumbnailUrl: '/images/bus-thumb-front.jpg',
    rotation: { yaw: 0, pitch: 0 },
    position: 'front',
    accessibleSeats: ['1A', '2A', '3A'],
    hotspots: [
      {
        id: '1A',
        type: 'seat',
        position: { yaw: -0.5, pitch: -0.2 },
        content: {
          title: 'Seat 1A - Premium Window',
          description: 'Premium seat with extra legroom and window view',
          action: { type: 'select_seat', target: '1A' }
        },
        interactive: true,
        accessibility: {
          ariaLabel: 'Select premium window seat 1A',
          description: 'Premium seat with extra legroom and window view',
          keyboardShortcut: '1'
        }
      },
      {
        id: 'wifi-zone',
        type: 'amenity',
        position: { yaw: 0.3, pitch: 0.1 },
        content: {
          title: 'WiFi Access Point',
          description: 'High-speed internet connection available',
          icon: '📶'
        },
        interactive: false,
        accessibility: {
          ariaLabel: 'WiFi access point location',
          description: 'High-speed internet connection available in this area'
        }
      }
    ]
  },
  {
    id: 'middle-view',
    name: 'Middle Section',
    description: 'Standard seating with good accessibility',
    imageUrl: '/images/bus-360-middle.jpg',
    thumbnailUrl: '/images/bus-thumb-middle.jpg',
    rotation: { yaw: 0, pitch: 0 },
    position: 'middle',
    accessibleSeats: ['6A', '6B', '6C', '6D', '7A', '7B', '7C', '7D'],
    hotspots: [
      {
        id: 'emergency-exit',
        type: 'emergency',
        position: { yaw: -1.5, pitch: 0 },
        content: {
          title: 'Emergency Exit',
          description: 'Emergency exit window - seats nearby have extra legroom',
          icon: '🚪'
        },
        interactive: false,
        accessibility: {
          ariaLabel: 'Emergency exit location',
          description: 'Emergency exit window with extra legroom for nearby seats'
        }
      }
    ]
  },
  {
    id: 'back-view',
    name: 'Rear Section',
    description: 'Comfortable seating near restroom facilities',
    imageUrl: '/images/bus-360-back.jpg',
    thumbnailUrl: '/images/bus-thumb-back.jpg',
    rotation: { yaw: 3.14, pitch: 0 },
    position: 'back',
    accessibleSeats: ['12A', '12B', '12C', '12D'],
    hotspots: [
      {
        id: 'restroom',
        type: 'amenity',
        position: { yaw: 0, pitch: -0.3 },
        content: {
          title: 'Restroom Facilities',
          description: 'Clean and accessible restroom facilities',
          icon: '🚻'
        },
        interactive: false,
        accessibility: {
          ariaLabel: 'Restroom facilities location',
          description: 'Clean and accessible restroom facilities at rear of bus'
        }
      },
      {
        id: '12A-accessible',
        type: 'seat',
        position: { yaw: -0.8, pitch: -0.1 },
        content: {
          title: 'Seat 12A - Wheelchair Accessible',
          description: 'Wheelchair accessible seating with priority boarding',
          action: { type: 'select_seat', target: '12A' }
        },
        interactive: true,
        accessibility: {
          ariaLabel: 'Select wheelchair accessible seat 12A',
          description: 'Wheelchair accessible seat with priority boarding',
          keyboardShortcut: '2'
        }
      }
    ]
  }
];

// Sample bus layout
export const sampleBusLayout: BusLayout = {
  id: 'luxury-coach-layout',
  rows: 12,
  seatsPerRow: 4,
  aisleWidth: 0.8,
  seats: generateSampleSeats(12, 4),
  emergencyExits: [
    {
      id: 'exit-1',
      type: 'door',
      location: { row: 1, side: 'right' },
      instructions: 'Front door - primary exit'
    },
    {
      id: 'exit-2',
      type: 'window',
      location: { row: 6, side: 'left' },
      instructions: 'Emergency window - pull handle to open'
    },
    {
      id: 'exit-3',
      type: 'door',
      location: { row: 12, side: 'right' },
      instructions: 'Rear door - emergency exit'
    }
  ],
  amenityLocations: [
    {
      amenityId: 'wifi',
      coordinates: { x: 200, y: 100, z: 50 },
      viewpointId: 'front-view'
    },
    {
      amenityId: 'restroom',
      coordinates: { x: 200, y: 900, z: 0 },
      viewpointId: 'back-view'
    }
  ],
  accessibility: {
    wheelchairAccessible: true,
    wheelchairSpaces: 2,
    audioAnnouncements: true,
    visualAnnouncements: true,
    brailleSignage: false,
    lowFloorAccess: true,
    prioritySeating: 4
  }
};

// Complete sample virtual bus tour
export const sampleVirtualTour: VirtualBusTour = {
  id: 'bharat-luxury-express-001',
  busModel: sampleBusModel,
  viewpoints: sampleViewpoints,
  defaultViewpoint: 'front-view',
  layout: sampleBusLayout,
  settings: {
    autoRotate: false,
    autoRotateSpeed: 0.5,
    zoomLevels: {
      min: 30,
      max: 90,
      default: 60
    },
    transitionDuration: 1000,
    enableVR: true,
    enableKeyboardNavigation: true,
    progressiveLoading: true
  },
  metadata: {
    title: 'Bharat Luxury Express Virtual Tour',
    description: 'Experience the comfort and amenities of our premium bus service - Mumbai to Delhi route',
    duration: 5,
    difficulty: 'easy',
    tags: ['luxury', 'comfort', 'accessible', 'premium', 'mumbai-delhi', 'interstate'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-07'),
    version: '1.0.0'
  }
};