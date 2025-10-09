import { BusRoute, VirtualBusTour, Seat, SeatType, BusLayout } from './types';

// Sample seat types
export const seatTypes: SeatType[] = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'Comfortable standard seating',
    features: ['Adjustable backrest', 'Cup holder'],
    priceModifier: 1.0,
    color: '#10b981',
    icon: '💺'
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Extra comfort with more legroom',
    features: ['Extra legroom', 'Adjustable backrest', 'Cup holder', 'USB charging'],
    priceModifier: 1.5,
    color: '#3b82f6',
    icon: '🛋️'
  },
  {
    id: 'accessible',
    name: 'Accessible',
    description: 'Wheelchair accessible seating',
    features: ['Wheelchair accessible', 'Priority boarding', 'Assistance available'],
    priceModifier: 1.0,
    color: '#8b5cf6',
    icon: '♿'
  }
];

// Generate sample seats for a bus layout
export const generateSampleSeats = (rows: number, seatsPerRow: number): Seat[] => {
  const seats: Seat[] = [];
  const columns = ['A', 'B', 'C', 'D', 'E', 'F'].slice(0, seatsPerRow);
  
  for (let row = 1; row <= rows; row++) {
    for (let colIndex = 0; colIndex < columns.length; colIndex++) {
      const column = columns[colIndex];
      const seatNumber = `${row}${column}`;
      
      // Determine seat position
      let position: 'window' | 'aisle' | 'middle';
      if (seatsPerRow === 4) {
        position = (colIndex === 0 || colIndex === 3) ? 'window' : 'aisle';
      } else if (seatsPerRow === 6) {
        if (colIndex === 0 || colIndex === 5) position = 'window';
        else if (colIndex === 2 || colIndex === 3) position = 'aisle';
        else position = 'middle';
      } else {
        position = (colIndex === 0 || colIndex === seatsPerRow - 1) ? 'window' : 'aisle';
      }
      
      // Determine seat type
      let seatType = seatTypes[0]; // default to standard
      if (row <= 3) {
        seatType = seatTypes[1]; // premium for front rows
      }
      if (row === 1 && (column === 'A' || column === 'B')) {
        seatType = seatTypes[2]; // accessible seats
      }
      
      // Random seat status for demo
      const statuses = ['available', 'available', 'available', 'occupied', 'available'];
      const status = statuses[Math.floor(Math.random() * statuses.length)] as Seat['status'];
      
      const seat: Seat = {
        id: `seat-${seatNumber}`,
        number: seatNumber,
        row,
        column,
        type: seatType,
        position,
        status,
        coordinates: {
          x: (colIndex - seatsPerRow / 2) * 30, // Spread seats horizontally
          y: (row - rows / 2) * 40, // Spread seats vertically
          z: 0
        },
        accessibility: {
          wheelchairAccessible: seatType.id === 'accessible',
          nearRestroom: row > rows - 3, // Back rows near restroom
          extraLegroom: seatType.id === 'premium' || row === 1
        },
        price: seatType.id === 'premium' ? 5.00 : 0
      };
      
      seats.push(seat);
    }
  }
  
  return seats;
};

// Create sample bus layout
export const createSampleBusLayout = (): BusLayout => {
  const rows = 14;
  const seatsPerRow = 4;
  const seats = generateSampleSeats(rows, seatsPerRow);
  
  // Create seat map
  const seatMap: { [row: number]: { [column: string]: Seat } } = {};
  seats.forEach(seat => {
    if (!seatMap[seat.row]) {
      seatMap[seat.row] = {};
    }
    seatMap[seat.row][seat.column] = seat;
  });
  
  return {
    id: 'layout-sample',
    busModelId: 'model-sample',
    name: 'Standard 4x14 Layout',
    totalSeats: seats.length,
    rows,
    seatsPerRow,
    aisleConfiguration: 'single',
    seats,
    seatMap,
    emergencyExits: [
      {
        id: 'exit-front',
        location: 'Front Door',
        coordinates: { x: 0, y: -280, z: 0 }
      },
      {
        id: 'exit-rear',
        location: 'Rear Door',
        coordinates: { x: 0, y: 280, z: 0 }
      }
    ]
  };
};

// Create sample virtual tour
export const createSampleVirtualTour = (): VirtualBusTour => {
  const layout = createSampleBusLayout();
  
  return {
    id: 'tour-sample',
    busId: 'bus-sample',
    busModel: {
      id: 'model-sample',
      name: 'EcoCoach 3000',
      manufacturer: 'GreenTech Motors',
      capacity: 56,
      amenities: [
        {
          id: 'wifi',
          name: 'Free WiFi',
          icon: '📶',
          description: 'High-speed internet throughout the journey',
          category: 'connectivity',
          available: true,
          location: { section: 'throughout' }
        },
        {
          id: 'usb',
          name: 'USB Charging',
          icon: '🔌',
          description: 'USB ports at every seat',
          category: 'connectivity',
          available: true,
          location: { section: 'throughout' }
        },
        {
          id: 'ac',
          name: 'Air Conditioning',
          icon: '❄️',
          description: 'Climate controlled environment',
          category: 'comfort',
          available: true,
          location: { section: 'throughout' }
        },
        {
          id: 'restroom',
          name: 'Restroom',
          icon: '🚻',
          description: 'Clean onboard restroom facilities',
          category: 'comfort',
          available: true,
          location: { section: 'back', coordinates: { x: 0, y: 250, z: 0 } }
        }
      ],
      specifications: {
        length: 12.5,
        width: 2.5,
        height: 3.2,
        fuelType: 'electric',
        emissionStandard: 'Euro 6'
      },
      accessibility: {
        wheelchairAccessible: true,
        audioAnnouncements: true,
        visualAids: true
      }
    },
    layout,
    viewpoints: [
      {
        id: 'vp-front',
        name: 'Front Section',
        description: 'Premium seating area with extra legroom',
        imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=2048&h=1024&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=200&fit=crop',
        position: { x: 0, y: -200, z: 150 },
        rotation: { yaw: 0, pitch: 0 },
        hotspots: [
          {
            id: 'hotspot-driver',
            type: 'info',
            position: { yaw: 0, pitch: -10 },
            content: {
              title: 'Driver Area',
              description: 'Professional driver with safety certification',
              icon: '👨‍✈️',
              action: 'show_info'
            },
            style: {
              color: '#3b82f6',
              size: 'medium',
              animation: 'pulse'
            }
          },
          {
            id: 'hotspot-nav-middle',
            type: 'navigation',
            position: { yaw: 180, pitch: 0 },
            content: {
              title: 'Go to Middle Section',
              icon: '➡️',
              action: 'navigate',
              target: 'vp-middle'
            },
            style: {
              color: '#10b981',
              size: 'large',
              animation: 'bounce'
            }
          }
        ],
        accessibleSeats: ['1A', '1B', '1C', '1D', '2A', '2B', '2C', '2D', '3A', '3B', '3C', '3D']
      },
      {
        id: 'vp-middle',
        name: 'Middle Section',
        description: 'Main seating area with standard comfort',
        imageUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=2048&h=1024&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=200&fit=crop',
        position: { x: 0, y: 0, z: 150 },
        rotation: { yaw: 0, pitch: 0 },
        hotspots: [
          {
            id: 'hotspot-nav-front',
            type: 'navigation',
            position: { yaw: 0, pitch: 0 },
            content: {
              title: 'Go to Front Section',
              icon: '⬅️',
              action: 'navigate',
              target: 'vp-front'
            },
            style: {
              color: '#10b981',
              size: 'large',
              animation: 'bounce'
            }
          },
          {
            id: 'hotspot-nav-back',
            type: 'navigation',
            position: { yaw: 180, pitch: 0 },
            content: {
              title: 'Go to Back Section',
              icon: '➡️',
              action: 'navigate',
              target: 'vp-back'
            },
            style: {
              color: '#10b981',
              size: 'large',
              animation: 'bounce'
            }
          },
          {
            id: 'hotspot-wifi',
            type: 'amenity',
            position: { yaw: 90, pitch: 20 },
            content: {
              title: 'WiFi Zone',
              description: 'High-speed internet access',
              icon: '📶',
              action: 'show_info'
            },
            style: {
              color: '#8b5cf6',
              size: 'medium',
              animation: 'pulse'
            }
          }
        ],
        accessibleSeats: ['7A', '7B', '7C', '7D', '8A', '8B', '8C', '8D', '9A', '9B', '9C', '9D']
      },
      {
        id: 'vp-back',
        name: 'Back Section',
        description: 'Rear seating with restroom access',
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=2048&h=1024&fit=crop',
        thumbnailUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop',
        position: { x: 0, y: 200, z: 150 },
        rotation: { yaw: 180, pitch: 0 },
        hotspots: [
          {
            id: 'hotspot-nav-middle-back',
            type: 'navigation',
            position: { yaw: 0, pitch: 0 },
            content: {
              title: 'Go to Middle Section',
              icon: '⬅️',
              action: 'navigate',
              target: 'vp-middle'
            },
            style: {
              color: '#10b981',
              size: 'large',
              animation: 'bounce'
            }
          },
          {
            id: 'hotspot-restroom',
            type: 'amenity',
            position: { yaw: -90, pitch: 0 },
            content: {
              title: 'Restroom',
              description: 'Clean and accessible facilities',
              icon: '🚻',
              action: 'show_info'
            },
            style: {
              color: '#f59e0b',
              size: 'large',
              animation: 'pulse'
            }
          }
        ],
        accessibleSeats: ['12A', '12B', '12C', '12D', '13A', '13B', '13C', '13D', '14A', '14B', '14C', '14D']
      }
    ],
    defaultViewpoint: 'vp-front',
    metadata: {
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
      version: '1.0',
      photographer: 'VirtualTours Pro',
      equipment: 'Insta360 Pro 2'
    },
    settings: {
      autoRotate: false,
      autoRotateSpeed: 1,
      zoomLevels: {
        min: 30,
        max: 90,
        default: 60
      },
      transitionDuration: 1000
    }
  };
};

// Sample bus routes with virtual tours
export const sampleBusRoutes: BusRoute[] = [
  {
    id: 'route-downtown-express',
    operatorId: 'greenline-express',
    operator: {
      id: 'greenline-express',
      name: 'GreenLine Express',
      logo: '/logos/greenline.png',
      rating: 4.5,
      contactInfo: {
        phone: '+1-555-0123',
        email: 'info@greenline.com',
        website: 'https://greenline.com'
      },
      policies: {
        cancellation: '24 hours before departure for full refund',
        refund: 'Full refund within 48 hours of booking',
        baggage: '2 bags up to 50lbs each included'
      }
    },
    routeNumber: 'GL-101',
    name: 'Downtown Express',
    origin: {
      lat: 40.7128,
      lng: -74.0060,
      address: '123 Main Terminal, New York, NY 10001',
      name: 'NYC Main Terminal'
    },
    destination: {
      lat: 40.7589,
      lng: -73.9851,
      address: 'Times Square Transit Hub, New York, NY 10036',
      name: 'Times Square Hub'
    },
    stops: [
      {
        id: 'stop-1',
        name: 'Union Square',
        location: { lat: 40.7359, lng: -73.9911, address: 'Union Square, NY' },
        arrivalTime: '08:15',
        departureTime: '08:17',
        amenities: ['WiFi', 'Seating']
      },
      {
        id: 'stop-2',
        name: 'Herald Square',
        location: { lat: 40.7505, lng: -73.9934, address: 'Herald Square, NY' },
        arrivalTime: '08:30',
        departureTime: '08:32',
        amenities: ['WiFi', 'Seating', 'Food Court']
      }
    ],
    schedule: [
      {
        id: 'schedule-morning',
        departureTime: '08:00',
        arrivalTime: '08:45',
        frequency: 30,
        operatingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
      },
      {
        id: 'schedule-midday',
        departureTime: '12:00',
        arrivalTime: '12:45',
        frequency: 30,
        operatingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
      },
      {
        id: 'schedule-evening',
        departureTime: '18:00',
        arrivalTime: '18:45',
        frequency: 30,
        operatingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
      }
    ],
    duration: 45,
    distance: 25,
    pricing: {
      basePrice: 15.99,
      currency: 'USD',
      discounts: {
        student: 0.2,
        senior: 0.15,
        child: 0.5
      }
    },
    busModel: {
      id: 'ecocoach-3000',
      name: 'EcoCoach 3000',
      manufacturer: 'GreenTech Motors',
      capacity: 56,
      amenities: [
        {
          id: 'wifi',
          name: 'Free WiFi',
          icon: '📶',
          description: 'High-speed internet throughout the journey',
          category: 'connectivity',
          available: true,
          location: { section: 'throughout' }
        },
        {
          id: 'usb-charging',
          name: 'USB Charging',
          icon: '🔌',
          description: 'USB ports at every seat',
          category: 'connectivity',
          available: true,
          location: { section: 'throughout' }
        },
        {
          id: 'air-conditioning',
          name: 'Air Conditioning',
          icon: '❄️',
          description: 'Climate controlled environment',
          category: 'comfort',
          available: true,
          location: { section: 'throughout' }
        },
        {
          id: 'restroom',
          name: 'Restroom',
          icon: '🚻',
          description: 'Clean onboard restroom facilities',
          category: 'comfort',
          available: true,
          location: { section: 'back' }
        }
      ],
      specifications: {
        length: 12.5,
        width: 2.5,
        height: 3.2,
        fuelType: 'electric',
        emissionStandard: 'Euro 6'
      },
      accessibility: {
        wheelchairAccessible: true,
        audioAnnouncements: true,
        visualAids: true
      }
    },
    virtualTour: createSampleVirtualTour(),
    amenities: [
      {
        id: 'wifi',
        name: 'Free WiFi',
        icon: '📶',
        description: 'High-speed internet',
        category: 'connectivity',
        available: true
      },
      {
        id: 'usb-charging',
        name: 'USB Charging',
        icon: '🔌',
        description: 'USB ports at every seat',
        category: 'connectivity',
        available: true
      },
      {
        id: 'air-conditioning',
        name: 'Air Conditioning',
        icon: '❄️',
        description: 'Climate controlled',
        category: 'comfort',
        available: true
      },
      {
        id: 'restroom',
        name: 'Restroom',
        icon: '🚻',
        description: 'Onboard facilities',
        category: 'comfort',
        available: true
      }
    ],
    carbonEmission: 45 // grams CO2 per passenger per km
  }
];

// Utility functions
export const getBusRouteById = (id: string): BusRoute | undefined => {
  return sampleBusRoutes.find(route => route.id === id);
};

export const getAvailableSeats = (layout: BusLayout): Seat[] => {
  return layout.seats.filter(seat => seat.status === 'available');
};

export const getSeatById = (layout: BusLayout, seatId: string): Seat | undefined => {
  return layout.seats.find(seat => seat.id === seatId);
};

export const calculateTotalPrice = (route: BusRoute, seatIds: string[]): number => {
  const baseTotal = route.pricing.basePrice * seatIds.length;
  const seatPremiums = seatIds.reduce((total, seatId) => {
    const seat = getSeatById(route.virtualTour!.layout, seatId);
    return total + (seat?.price || 0);
  }, 0);
  return baseTotal + seatPremiums;
};
