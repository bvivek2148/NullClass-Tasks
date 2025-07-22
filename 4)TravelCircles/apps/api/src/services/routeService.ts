import { logger } from '../utils/logger';

// Mock data - will be replaced with database operations
let routes: any[] = [
  {
    id: '1',
    origin: 'Mumbai, Maharashtra',
    destination: 'Pune, Maharashtra',
    distance: 148,
    duration: 210, // minutes
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    operator: 'TravelCircles Express',
    amenities: ['WiFi', 'Power Outlets', 'Air Conditioning', 'Restroom'],
    pricing: {
      economy: 350,
      premium: 450,
    },
  },
  {
    id: '2',
    origin: 'Delhi, Delhi',
    destination: 'Jaipur, Rajasthan',
    distance: 280,
    duration: 345, // minutes
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    operator: 'TravelCircles Premium',
    amenities: ['WiFi', 'Power Outlets', 'Air Conditioning', 'Restroom', 'Entertainment'],
    pricing: {
      economy: 450,
      premium: 550,
    },
  },
  {
    id: '3',
    origin: 'Bangalore, Karnataka',
    destination: 'Chennai, Tamil Nadu',
    distance: 346,
    duration: 375, // minutes
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    operator: 'TravelCircles Express',
    amenities: ['WiFi', 'Power Outlets', 'Air Conditioning'],
    pricing: {
      economy: 520,
      premium: 620,
    },
  },
];

let schedules: any[] = [
  // Mumbai to Pune schedules
  {
    id: '1',
    routeId: '1',
    busId: 'bus-001',
    departureTime: '06:00',
    arrivalTime: '10:30',
    availableSeats: 35,
    totalSeats: 40,
    status: 'ACTIVE',
    date: '2025-07-16',
    pricing: {
      economy: 350,
      premium: 450,
    },
  },
  {
    id: '2',
    routeId: '1',
    busId: 'bus-002',
    departureTime: '09:00',
    arrivalTime: '13:30',
    availableSeats: 28,
    totalSeats: 40,
    status: 'ACTIVE',
    date: '2025-07-16',
    pricing: {
      economy: 350,
      premium: 450,
    },
  },
  {
    id: '3',
    routeId: '1',
    busId: 'bus-003',
    departureTime: '14:00',
    arrivalTime: '18:30',
    availableSeats: 15,
    totalSeats: 40,
    status: 'ACTIVE',
    date: '2025-07-16',
    pricing: {
      economy: 350,
      premium: 450,
    },
  },
  {
    id: '4',
    routeId: '1',
    busId: 'bus-004',
    departureTime: '18:00',
    arrivalTime: '22:30',
    availableSeats: 32,
    totalSeats: 40,
    status: 'ACTIVE',
    date: '2025-07-16',
    pricing: {
      economy: 350,
      premium: 450,
    },
  },
  // Route 2: Delhi to Jaipur
  {
    id: '4',
    routeId: '2',
    busId: 'bus-004',
    departureTime: '07:00',
    arrivalTime: '12:45',
    availableSeats: 25,
    totalSeats: 40,
    status: 'ACTIVE',
    date: '2025-07-16',
    pricing: {
      economy: 450,
      premium: 550,
    },
  },
  {
    id: '5',
    routeId: '2',
    busId: 'bus-005',
    departureTime: '15:30',
    arrivalTime: '21:15',
    availableSeats: 18,
    totalSeats: 40,
    status: 'ACTIVE',
    date: '2025-07-16',
    pricing: {
      economy: 450,
      premium: 550,
    },
  },
  // Route 3: Bangalore to Chennai
  {
    id: '6',
    routeId: '3',
    busId: 'bus-006',
    departureTime: '08:00',
    arrivalTime: '14:15',
    availableSeats: 22,
    totalSeats: 40,
    status: 'ACTIVE',
    date: '2025-07-16',
    pricing: {
      economy: 520,
      premium: 620,
    },
  },
  // Route 4: Hyderabad to Vijayawada
  {
    id: '7',
    routeId: '4',
    busId: 'bus-007',
    departureTime: '09:30',
    arrivalTime: '14:15',
    availableSeats: 30,
    totalSeats: 40,
    status: 'ACTIVE',
    date: '2025-07-16',
    pricing: {
      economy: 380,
      premium: 480,
    },
  },
];

let routeStops: any[] = [
  {
    id: '1',
    routeId: '1',
    stopName: 'New York, NY - Port Authority',
    stopOrder: 1,
    arrivalTime: null,
    departureTime: '00:00',
    coordinates: { lat: 40.7589, lng: -73.9851 },
  },
  {
    id: '2',
    routeId: '1',
    stopName: 'Hartford, CT - Union Station',
    stopOrder: 2,
    arrivalTime: '01:30',
    departureTime: '01:45',
    coordinates: { lat: 41.7658, lng: -72.6734 },
  },
  {
    id: '3',
    routeId: '1',
    stopName: 'Springfield, MA - Bus Terminal',
    stopOrder: 3,
    arrivalTime: '02:30',
    departureTime: '02:45',
    coordinates: { lat: 42.1015, lng: -72.5898 },
  },
  {
    id: '4',
    routeId: '1',
    stopName: 'Boston, MA - South Station',
    stopOrder: 4,
    arrivalTime: '04:30',
    departureTime: null,
    coordinates: { lat: 42.3519, lng: -71.0552 },
  },
];

export class RouteService {
  // Route CRUD operations
  static async getAllRoutes(filters: any = {}) {
    try {
      let filteredRoutes = routes.filter(route => route.isActive);

      // Apply filters
      if (filters.origin) {
        filteredRoutes = filteredRoutes.filter(route =>
          route.origin.toLowerCase().includes(filters.origin.toLowerCase())
        );
      }

      if (filters.destination) {
        filteredRoutes = filteredRoutes.filter(route =>
          route.destination.toLowerCase().includes(filters.destination.toLowerCase())
        );
      }

      if (filters.maxDistance) {
        filteredRoutes = filteredRoutes.filter(route =>
          route.distance <= parseInt(filters.maxDistance)
        );
      }

      // Sort routes
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'distance':
            filteredRoutes.sort((a, b) => a.distance - b.distance);
            break;
          case 'price':
            filteredRoutes.sort((a, b) => a.pricing.economy - b.pricing.economy);
            break;
          case 'duration':
            filteredRoutes.sort((a, b) => a.duration - b.duration);
            break;
          default:
            // Default sort by creation date
            filteredRoutes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
      }

      return {
        routes: filteredRoutes,
        total: filteredRoutes.length,
      };
    } catch (error) {
      logger.error('Error fetching routes:', error);
      throw new Error('Failed to fetch routes');
    }
  }

  static async getRouteById(routeId: string) {
    try {
      const route = routes.find(r => r.id === routeId && r.isActive);
      if (!route) {
        throw new Error('Route not found');
      }

      // Get route stops
      const stops = routeStops
        .filter(stop => stop.routeId === routeId)
        .sort((a, b) => a.stopOrder - b.stopOrder);

      // Get schedules for the route
      const routeSchedules = schedules.filter(schedule => 
        schedule.routeId === routeId && schedule.status === 'ACTIVE'
      );

      return {
        ...route,
        stops,
        schedules: routeSchedules,
      };
    } catch (error) {
      logger.error('Error fetching route by ID:', error);
      throw error;
    }
  }

  static async createRoute(routeData: any) {
    try {
      const newRoute = {
        id: Date.now().toString(),
        ...routeData,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      routes.push(newRoute);
      logger.info('Route created:', { routeId: newRoute.id });

      return newRoute;
    } catch (error) {
      logger.error('Error creating route:', error);
      throw new Error('Failed to create route');
    }
  }

  static async updateRoute(routeId: string, updateData: any) {
    try {
      const routeIndex = routes.findIndex(r => r.id === routeId);
      if (routeIndex === -1) {
        throw new Error('Route not found');
      }

      routes[routeIndex] = {
        ...routes[routeIndex],
        ...updateData,
        updatedAt: new Date().toISOString(),
      };

      logger.info('Route updated:', { routeId });
      return routes[routeIndex];
    } catch (error) {
      logger.error('Error updating route:', error);
      throw error;
    }
  }

  static async deleteRoute(routeId: string) {
    try {
      const routeIndex = routes.findIndex(r => r.id === routeId);
      if (routeIndex === -1) {
        throw new Error('Route not found');
      }

      // Soft delete
      routes[routeIndex].isActive = false;
      routes[routeIndex].updatedAt = new Date().toISOString();

      logger.info('Route deleted:', { routeId });
      return { message: 'Route deleted successfully' };
    } catch (error) {
      logger.error('Error deleting route:', error);
      throw error;
    }
  }

  // Schedule operations
  static async getSchedulesByRoute(routeId: string, date?: string) {
    try {
      let routeSchedules = schedules.filter(schedule => 
        schedule.routeId === routeId && schedule.status === 'ACTIVE'
      );

      if (date) {
        routeSchedules = routeSchedules.filter(schedule => schedule.date === date);
      }

      return routeSchedules.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    } catch (error) {
      logger.error('Error fetching schedules:', error);
      throw new Error('Failed to fetch schedules');
    }
  }

  static async createSchedule(scheduleData: any) {
    try {
      const newSchedule = {
        id: Date.now().toString(),
        ...scheduleData,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      };

      schedules.push(newSchedule);
      logger.info('Schedule created:', { scheduleId: newSchedule.id });

      return newSchedule;
    } catch (error) {
      logger.error('Error creating schedule:', error);
      throw new Error('Failed to create schedule');
    }
  }

  static async updateSchedule(scheduleId: string, updateData: any) {
    try {
      const scheduleIndex = schedules.findIndex(s => s.id === scheduleId);
      if (scheduleIndex === -1) {
        throw new Error('Schedule not found');
      }

      schedules[scheduleIndex] = {
        ...schedules[scheduleIndex],
        ...updateData,
        updatedAt: new Date().toISOString(),
      };

      logger.info('Schedule updated:', { scheduleId });
      return schedules[scheduleIndex];
    } catch (error) {
      logger.error('Error updating schedule:', error);
      throw error;
    }
  }

  // Route stops operations
  static async getRouteStops(routeId: string) {
    try {
      return routeStops
        .filter(stop => stop.routeId === routeId)
        .sort((a, b) => a.stopOrder - b.stopOrder);
    } catch (error) {
      logger.error('Error fetching route stops:', error);
      throw new Error('Failed to fetch route stops');
    }
  }

  static async addRouteStop(stopData: any) {
    try {
      const newStop = {
        id: Date.now().toString(),
        ...stopData,
        createdAt: new Date().toISOString(),
      };

      routeStops.push(newStop);
      logger.info('Route stop added:', { stopId: newStop.id });

      return newStop;
    } catch (error) {
      logger.error('Error adding route stop:', error);
      throw new Error('Failed to add route stop');
    }
  }

  // Search and filtering
  static async searchRoutes(searchParams: any) {
    try {
      const { origin, destination, date, passengers = 1, sortBy = 'price' } = searchParams;

      let results = routes.filter(route => route.isActive);

      // Filter by origin and destination (flexible matching)
      if (origin) {
        results = results.filter(route => {
          const routeOrigin = route.origin.toLowerCase();
          const searchOrigin = origin.toLowerCase().trim();
          return routeOrigin.includes(searchOrigin) ||
                 searchOrigin.includes(routeOrigin.split(',')[0].trim());
        });
      }

      if (destination) {
        results = results.filter(route => {
          const routeDestination = route.destination.toLowerCase();
          const searchDestination = destination.toLowerCase().trim();
          return routeDestination.includes(searchDestination) ||
                 searchDestination.includes(routeDestination.split(',')[0].trim());
        });
      }

      // Get schedules for each route
      const routesWithSchedules = results.map(route => {
        const routeSchedules = schedules.filter(schedule =>
          schedule.routeId === route.id &&
          schedule.status === 'ACTIVE' &&
          schedule.availableSeats >= passengers &&
          (!date || schedule.date === date)
        );

        return {
          ...route,
          schedules: routeSchedules.sort((a, b) => a.departureTime.localeCompare(b.departureTime)),
          hasAvailability: routeSchedules.length > 0,
        };
      });

      // Filter out routes with no availability
      const availableRoutes = routesWithSchedules.filter(route => route.hasAvailability);

      // Sort results
      switch (sortBy) {
        case 'price':
          availableRoutes.sort((a, b) => a.pricing.economy - b.pricing.economy);
          break;
        case 'duration':
          availableRoutes.sort((a, b) => a.duration - b.duration);
          break;
        case 'departure':
          availableRoutes.sort((a, b) => {
            const aEarliest = a.schedules[0]?.departureTime || '23:59';
            const bEarliest = b.schedules[0]?.departureTime || '23:59';
            return aEarliest.localeCompare(bEarliest);
          });
          break;
        default:
          // Default sort by relevance (distance)
          availableRoutes.sort((a, b) => a.distance - b.distance);
      }

      return {
        routes: availableRoutes,
        total: availableRoutes.length,
        searchParams,
      };
    } catch (error) {
      logger.error('Error searching routes:', error);
      throw new Error('Failed to search routes');
    }
  }

  // Popular destinations and routes
  static async getPopularDestinations() {
    try {
      const destinations = new Map();

      routes.forEach(route => {
        if (route.isActive) {
          // Count destinations
          const dest = route.destination;
          destinations.set(dest, (destinations.get(dest) || 0) + 1);
        }
      });

      const popularDestinations = Array.from(destinations.entries())
        .map(([destination, count]) => ({ destination, routeCount: count }))
        .sort((a, b) => b.routeCount - a.routeCount)
        .slice(0, 10);

      return popularDestinations;
    } catch (error) {
      logger.error('Error fetching popular destinations:', error);
      throw new Error('Failed to fetch popular destinations');
    }
  }

  static async getRouteAnalytics(routeId: string) {
    try {
      const route = routes.find(r => r.id === routeId);
      if (!route) {
        throw new Error('Route not found');
      }

      const routeSchedules = schedules.filter(s => s.routeId === routeId);
      
      // Calculate analytics
      const totalSchedules = routeSchedules.length;
      const totalSeats = routeSchedules.reduce((sum, schedule) => sum + schedule.totalSeats, 0);
      const availableSeats = routeSchedules.reduce((sum, schedule) => sum + schedule.availableSeats, 0);
      const occupancyRate = totalSeats > 0 ? ((totalSeats - availableSeats) / totalSeats) * 100 : 0;

      return {
        routeId,
        totalSchedules,
        totalSeats,
        availableSeats,
        occupancyRate: Math.round(occupancyRate * 100) / 100,
        averagePrice: route.pricing.economy,
        popularTimes: ['06:00', '09:00', '14:00', '19:00'], // Mock data
      };
    } catch (error) {
      logger.error('Error fetching route analytics:', error);
      throw error;
    }
  }
}
