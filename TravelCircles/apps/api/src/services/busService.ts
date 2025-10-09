import { logger } from '../utils/logger';

// Bus types and interfaces
export interface Bus {
  id: string;
  number: string;
  capacity: number;
  busType: 'STANDARD' | 'PREMIUM' | 'LUXURY';
  manufacturer: string;
  model: string;
  year: number;
  licensePlate: string;
  amenities: string[];
  features: BusFeature[];
  seatConfiguration: SeatConfiguration;
  maintenanceStatus: 'ACTIVE' | 'MAINTENANCE' | 'OUT_OF_SERVICE';
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  mileage: number;
  fuelType: 'DIESEL' | 'ELECTRIC' | 'HYBRID';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BusFeature {
  id: string;
  name: string;
  description: string;
  category: 'COMFORT' | 'ENTERTAINMENT' | 'SAFETY' | 'ACCESSIBILITY';
  isAvailable: boolean;
}

export interface SeatConfiguration {
  layout: {
    rows: number;
    seatsPerRow: number;
    aislePosition: number; // Position of aisle (e.g., 2 means aisle after 2nd seat)
  };
  seatTypes: {
    economy: number;
    premium: number;
    accessibility: number;
  };
  seatMap: Seat[];
}

export interface Seat {
  id: string;
  number: string;
  row: number;
  position: number; // Position in row (A, B, C, D)
  type: 'ECONOMY' | 'PREMIUM' | 'ACCESSIBILITY';
  features: string[];
  isAvailable: boolean;
  price?: {
    base: number;
    premium: number;
  };
}

export interface MaintenanceRecord {
  id: string;
  busId: string;
  type: 'ROUTINE' | 'REPAIR' | 'INSPECTION' | 'EMERGENCY';
  description: string;
  scheduledDate: string;
  completedDate?: string;
  cost?: number;
  technician?: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Driver {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  licenseExpiry: string;
  phone: string;
  email: string;
  experience: number; // years
  rating: number;
  status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';
  assignedRoutes: string[];
  createdAt: string;
  updatedAt: string;
}

// Mock data - will be replaced with database operations
let buses: Bus[] = [
  {
    id: 'bus-001',
    number: 'TC-001',
    capacity: 40,
    busType: 'STANDARD',
    manufacturer: 'Volvo',
    model: 'B11R',
    year: 2022,
    licensePlate: 'ABC-1234',
    amenities: ['WiFi', 'Power Outlets', 'Air Conditioning', 'Restroom'],
    features: [
      { id: 'f1', name: 'WiFi', description: 'High-speed internet', category: 'ENTERTAINMENT', isAvailable: true },
      { id: 'f2', name: 'USB Charging', description: 'USB ports at every seat', category: 'COMFORT', isAvailable: true },
      { id: 'f3', name: 'Reclining Seats', description: 'Adjustable seat backs', category: 'COMFORT', isAvailable: true },
    ],
    seatConfiguration: {
      layout: {
        rows: 10,
        seatsPerRow: 4,
        aislePosition: 2,
      },
      seatTypes: {
        economy: 32,
        premium: 8,
        accessibility: 2,
      },
      seatMap: [], // Will be generated
    },
    maintenanceStatus: 'ACTIVE',
    lastMaintenanceDate: '2024-01-15T00:00:00.000Z',
    nextMaintenanceDate: '2024-04-15T00:00:00.000Z',
    mileage: 45000,
    fuelType: 'DIESEL',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

let maintenanceRecords: MaintenanceRecord[] = [];
let drivers: Driver[] = [];

export class BusService {
  // Bus CRUD operations
  static async getAllBuses(filters: any = {}) {
    try {
      let filteredBuses = buses.filter(bus => bus.isActive);

      // Apply filters
      if (filters.busType) {
        filteredBuses = filteredBuses.filter(bus => bus.busType === filters.busType);
      }

      if (filters.maintenanceStatus) {
        filteredBuses = filteredBuses.filter(bus => bus.maintenanceStatus === filters.maintenanceStatus);
      }

      if (filters.capacity) {
        const minCapacity = parseInt(filters.capacity);
        filteredBuses = filteredBuses.filter(bus => bus.capacity >= minCapacity);
      }

      // Sort buses
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'number':
            filteredBuses.sort((a, b) => a.number.localeCompare(b.number));
            break;
          case 'capacity':
            filteredBuses.sort((a, b) => b.capacity - a.capacity);
            break;
          case 'year':
            filteredBuses.sort((a, b) => b.year - a.year);
            break;
          default:
            filteredBuses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
      }

      return {
        buses: filteredBuses,
        total: filteredBuses.length,
      };
    } catch (error) {
      logger.error('Error fetching buses:', error);
      throw new Error('Failed to fetch buses');
    }
  }

  static async getBusById(busId: string) {
    try {
      const bus = buses.find(b => b.id === busId && b.isActive);
      if (!bus) {
        throw new Error('Bus not found');
      }

      // Generate seat map if not exists
      if (bus.seatConfiguration.seatMap.length === 0) {
        bus.seatConfiguration.seatMap = this.generateSeatMap(bus.seatConfiguration);
      }

      // Get maintenance records
      const maintenance = maintenanceRecords.filter(record => record.busId === busId);

      return {
        ...bus,
        maintenanceHistory: maintenance.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
      };
    } catch (error) {
      logger.error('Error fetching bus by ID:', error);
      throw error;
    }
  }

  static async createBus(busData: Partial<Bus>) {
    try {
      const newBus: Bus = {
        id: `bus-${Date.now()}`,
        number: busData.number || '',
        capacity: busData.capacity || 40,
        busType: busData.busType || 'STANDARD',
        manufacturer: busData.manufacturer || '',
        model: busData.model || '',
        year: busData.year || new Date().getFullYear(),
        licensePlate: busData.licensePlate || '',
        amenities: busData.amenities || [],
        features: busData.features || [],
        seatConfiguration: busData.seatConfiguration || {
          layout: { rows: 10, seatsPerRow: 4, aislePosition: 2 },
          seatTypes: { economy: 32, premium: 8, accessibility: 2 },
          seatMap: [],
        },
        maintenanceStatus: 'ACTIVE',
        lastMaintenanceDate: new Date().toISOString(),
        nextMaintenanceDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days
        mileage: busData.mileage || 0,
        fuelType: busData.fuelType || 'DIESEL',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Generate seat map
      newBus.seatConfiguration.seatMap = this.generateSeatMap(newBus.seatConfiguration);

      buses.push(newBus);
      logger.info('Bus created:', { busId: newBus.id, number: newBus.number });

      return newBus;
    } catch (error) {
      logger.error('Error creating bus:', error);
      throw new Error('Failed to create bus');
    }
  }

  static async updateBus(busId: string, updateData: Partial<Bus>) {
    try {
      const busIndex = buses.findIndex(b => b.id === busId);
      if (busIndex === -1) {
        throw new Error('Bus not found');
      }

      buses[busIndex] = {
        ...buses[busIndex],
        ...updateData,
        updatedAt: new Date().toISOString(),
      };

      // Regenerate seat map if configuration changed
      if (updateData.seatConfiguration) {
        buses[busIndex].seatConfiguration.seatMap = this.generateSeatMap(
          buses[busIndex].seatConfiguration
        );
      }

      logger.info('Bus updated:', { busId });
      return buses[busIndex];
    } catch (error) {
      logger.error('Error updating bus:', error);
      throw error;
    }
  }

  static async deleteBus(busId: string) {
    try {
      const busIndex = buses.findIndex(b => b.id === busId);
      if (busIndex === -1) {
        throw new Error('Bus not found');
      }

      // Soft delete
      buses[busIndex].isActive = false;
      buses[busIndex].updatedAt = new Date().toISOString();

      logger.info('Bus deleted:', { busId });
      return { message: 'Bus deleted successfully' };
    } catch (error) {
      logger.error('Error deleting bus:', error);
      throw error;
    }
  }

  // Seat map generation
  static generateSeatMap(config: SeatConfiguration): Seat[] {
    const seats: Seat[] = [];
    const { rows, seatsPerRow } = config.layout;
    const seatLabels = ['A', 'B', 'C', 'D', 'E', 'F'];
    
    let premiumSeatsAssigned = 0;
    let accessibilitySeatsAssigned = 0;

    for (let row = 1; row <= rows; row++) {
      for (let position = 1; position <= seatsPerRow; position++) {
        const seatNumber = `${row}${seatLabels[position - 1]}`;
        
        // Determine seat type
        let seatType: 'ECONOMY' | 'PREMIUM' | 'ACCESSIBILITY' = 'ECONOMY';
        
        // First 2 rows are premium
        if (row <= 2 && premiumSeatsAssigned < config.seatTypes.premium) {
          seatType = 'PREMIUM';
          premiumSeatsAssigned++;
        }
        // Last row has accessibility seats
        else if (row === rows && accessibilitySeatsAssigned < config.seatTypes.accessibility) {
          seatType = 'ACCESSIBILITY';
          accessibilitySeatsAssigned++;
        }

        const seat: Seat = {
          id: `seat-${row}-${position}`,
          number: seatNumber,
          row,
          position,
          type: seatType,
          features: seatType === 'PREMIUM' ? ['Extra Legroom', 'Priority Boarding'] : 
                   seatType === 'ACCESSIBILITY' ? ['Wheelchair Accessible', 'Extra Space'] : [],
          isAvailable: true,
          price: {
            base: seatType === 'PREMIUM' ? 65 : 45,
            premium: seatType === 'PREMIUM' ? 85 : 65,
          },
        };

        seats.push(seat);
      }
    }

    return seats;
  }

  // Maintenance operations
  static async getMaintenanceRecords(busId?: string) {
    try {
      let records = maintenanceRecords;
      
      if (busId) {
        records = records.filter(record => record.busId === busId);
      }

      return records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      logger.error('Error fetching maintenance records:', error);
      throw new Error('Failed to fetch maintenance records');
    }
  }

  static async createMaintenanceRecord(recordData: Partial<MaintenanceRecord>) {
    try {
      const newRecord: MaintenanceRecord = {
        id: `maint-${Date.now()}`,
        busId: recordData.busId || '',
        type: recordData.type || 'ROUTINE',
        description: recordData.description || '',
        scheduledDate: recordData.scheduledDate || new Date().toISOString(),
        cost: recordData.cost,
        technician: recordData.technician,
        status: 'SCHEDULED',
        notes: recordData.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      maintenanceRecords.push(newRecord);
      logger.info('Maintenance record created:', { recordId: newRecord.id });

      return newRecord;
    } catch (error) {
      logger.error('Error creating maintenance record:', error);
      throw new Error('Failed to create maintenance record');
    }
  }

  // Bus availability checking
  static async checkBusAvailability(busId: string, date: string) {
    try {
      const bus = buses.find(b => b.id === busId);
      if (!bus) {
        throw new Error('Bus not found');
      }

      // Check maintenance status
      if (bus.maintenanceStatus !== 'ACTIVE') {
        return { available: false, reason: 'Bus under maintenance' };
      }

      // Check scheduled maintenance
      const scheduledMaintenance = maintenanceRecords.find(record => 
        record.busId === busId && 
        record.status === 'SCHEDULED' &&
        record.scheduledDate.split('T')[0] === date
      );

      if (scheduledMaintenance) {
        return { available: false, reason: 'Scheduled maintenance' };
      }

      return { available: true, bus };
    } catch (error) {
      logger.error('Error checking bus availability:', error);
      throw error;
    }
  }

  // Analytics
  static async getBusAnalytics() {
    try {
      const totalBuses = buses.filter(b => b.isActive).length;
      const activeBuses = buses.filter(b => b.isActive && b.maintenanceStatus === 'ACTIVE').length;
      const maintenanceBuses = buses.filter(b => b.isActive && b.maintenanceStatus === 'MAINTENANCE').length;
      
      const averageCapacity = buses.reduce((sum, bus) => sum + bus.capacity, 0) / totalBuses;
      const totalCapacity = buses.reduce((sum, bus) => sum + bus.capacity, 0);

      const busTypeDistribution = buses.reduce((acc, bus) => {
        acc[bus.busType] = (acc[bus.busType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalBuses,
        activeBuses,
        maintenanceBuses,
        averageCapacity: Math.round(averageCapacity),
        totalCapacity,
        busTypeDistribution,
        utilizationRate: (activeBuses / totalBuses) * 100,
      };
    } catch (error) {
      logger.error('Error fetching bus analytics:', error);
      throw new Error('Failed to fetch bus analytics');
    }
  }
}
