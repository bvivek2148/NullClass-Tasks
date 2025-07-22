import { TransportationMode, EmissionCalculationParams, EnvironmentalImpact } from './types';

// Standardized emission factors (grams CO2 per km) based on EPA, DEFRA, and IPCC guidelines
export const TRANSPORTATION_MODES: TransportationMode[] = [
  {
    id: 'walking',
    name: 'Walking',
    icon: '🚶',
    emissionFactor: 0,
    category: 'low',
    description: 'Zero emissions, great exercise!'
  },
  {
    id: 'cycling',
    name: 'Cycling',
    icon: '🚴',
    emissionFactor: 0,
    category: 'low',
    description: 'Zero emissions, healthy and efficient'
  },
  {
    id: 'electric_scooter',
    name: 'Electric Scooter',
    icon: '🛴',
    emissionFactor: 15,
    category: 'low',
    description: 'Low emissions, convenient for short trips'
  },
  {
    id: 'bus',
    name: 'Public Bus',
    icon: '🚌',
    emissionFactor: 105,
    category: 'low',
    description: 'Shared transport reduces per-person emissions'
  },
  {
    id: 'train',
    name: 'Train/Metro',
    icon: '🚊',
    emissionFactor: 40,
    category: 'low',
    description: 'Very efficient for longer distances'
  },
  {
    id: 'electric_car',
    name: 'Electric Car',
    icon: '🔋',
    emissionFactor: 50,
    category: 'medium',
    description: 'Clean energy dependent on grid source'
  },
  {
    id: 'hybrid_car',
    name: 'Hybrid Car',
    icon: '🚗',
    emissionFactor: 120,
    category: 'medium',
    description: 'Better than conventional cars'
  },
  {
    id: 'motorcycle',
    name: 'Motorcycle',
    icon: '🏍️',
    emissionFactor: 140,
    category: 'medium',
    description: 'Fuel efficient but higher emissions per passenger'
  },
  {
    id: 'car_gasoline',
    name: 'Gasoline Car',
    icon: '⛽',
    emissionFactor: 180,
    category: 'high',
    description: 'Traditional combustion engine'
  },
  {
    id: 'car_diesel',
    name: 'Diesel Car',
    icon: '🚗',
    emissionFactor: 160,
    category: 'high',
    description: 'More efficient than gasoline but still high emissions'
  },
  {
    id: 'rideshare',
    name: 'Ride Share',
    icon: '🚕',
    emissionFactor: 200,
    category: 'high',
    description: 'Convenience comes with higher emissions'
  },
  {
    id: 'taxi',
    name: 'Taxi',
    icon: '🚖',
    emissionFactor: 210,
    category: 'high',
    description: 'High emissions due to empty return trips'
  }
];

// Grid electricity carbon intensity by region (grams CO2 per kWh)
export const ELECTRICITY_GRID_FACTORS = {
  'US_AVERAGE': 400,
  'CALIFORNIA': 200,
  'TEXAS': 450,
  'NORWAY': 20,
  'FRANCE': 60,
  'GERMANY': 350,
  'CHINA': 550,
  'INDIA': 650,
  'UK': 250,
  'AUSTRALIA': 600
};

export class EmissionCalculator {
  private gridFactor: number;

  constructor(region: string = 'US_AVERAGE') {
    this.gridFactor = ELECTRICITY_GRID_FACTORS[region as keyof typeof ELECTRICITY_GRID_FACTORS] || 400;
  }

  /**
   * Calculate CO2 emissions for a given trip
   */
  calculateEmissions(params: EmissionCalculationParams): number {
    const { distance, transportationMode, occupancy = 1, fuelType, electricityGridFactor } = params;
    
    let baseFactor = transportationMode.emissionFactor;
    
    // Adjust for electric vehicles based on grid carbon intensity
    if (transportationMode.id === 'electric_car' || fuelType === 'electric') {
      const gridFactor = electricityGridFactor || this.gridFactor;
      // Electric car efficiency: ~0.3 kWh per km
      baseFactor = (gridFactor * 0.3);
    }
    
    // Adjust for occupancy (for cars and ride-sharing)
    if (['car_gasoline', 'car_diesel', 'hybrid_car', 'electric_car', 'rideshare'].includes(transportationMode.id)) {
      baseFactor = baseFactor / Math.max(occupancy, 1);
    }
    
    // Calculate total emissions
    const totalEmissions = distance * baseFactor;
    
    return Math.round(totalEmissions);
  }

  /**
   * Calculate environmental impact equivalents
   */
  calculateEnvironmentalImpact(co2InGrams: number): EnvironmentalImpact {
    const co2InKg = co2InGrams / 1000;
    
    return {
      co2InGrams,
      equivalents: {
        // One tree absorbs ~22kg CO2 per year
        treesNeeded: Math.round((co2InKg / 22) * 365 * 100) / 100,
        // Average car emits ~4.6 metric tons CO2 per year (12,600 miles)
        carMilesDriven: Math.round((co2InKg / 4600) * 12600 * 100) / 100,
        // Smartphone charge: ~8g CO2
        phoneCharges: Math.round(co2InGrams / 8),
        // LED light bulb: ~0.5g CO2 per hour
        lightBulbHours: Math.round(co2InGrams / 0.5)
      },
      description: this.getImpactDescription(co2InGrams)
    };
  }

  /**
   * Get a human-readable description of the environmental impact
   */
  private getImpactDescription(co2InGrams: number): string {
    if (co2InGrams < 100) {
      return "Minimal environmental impact - great choice!";
    } else if (co2InGrams < 500) {
      return "Low environmental impact - you're making a difference!";
    } else if (co2InGrams < 1000) {
      return "Moderate environmental impact - consider greener alternatives.";
    } else if (co2InGrams < 2000) {
      return "High environmental impact - switching modes could save significant CO2.";
    } else {
      return "Very high environmental impact - please consider eco-friendly alternatives.";
    }
  }

  /**
   * Calculate potential savings by switching transportation modes
   */
  calculateSavings(distance: number, currentMode: TransportationMode, alternativeMode: TransportationMode): {
    co2Saved: number;
    percentage: number;
    description: string;
  } {
    const currentEmissions = this.calculateEmissions({ distance, transportationMode: currentMode });
    const alternativeEmissions = this.calculateEmissions({ distance, transportationMode: alternativeMode });
    
    const co2Saved = Math.max(0, currentEmissions - alternativeEmissions);
    const percentage = currentEmissions > 0 ? Math.round((co2Saved / currentEmissions) * 100) : 0;
    
    let description = '';
    if (co2Saved === 0) {
      description = "No savings with this alternative.";
    } else if (percentage < 25) {
      description = `Small improvement: ${co2Saved}g CO2 saved (${percentage}% reduction)`;
    } else if (percentage < 50) {
      description = `Good improvement: ${co2Saved}g CO2 saved (${percentage}% reduction)`;
    } else if (percentage < 75) {
      description = `Great improvement: ${co2Saved}g CO2 saved (${percentage}% reduction)`;
    } else {
      description = `Excellent choice: ${co2Saved}g CO2 saved (${percentage}% reduction)`;
    }
    
    return { co2Saved, percentage, description };
  }

  /**
   * Get transportation mode by ID
   */
  getTransportationMode(id: string): TransportationMode | undefined {
    return TRANSPORTATION_MODES.find(mode => mode.id === id);
  }

  /**
   * Get all transportation modes sorted by emission factor
   */
  getTransportationModesSorted(): TransportationMode[] {
    return [...TRANSPORTATION_MODES].sort((a, b) => a.emissionFactor - b.emissionFactor);
  }

  /**
   * Get eco-friendly alternatives for a given mode
   */
  getEcoAlternatives(currentModeId: string): TransportationMode[] {
    const currentMode = this.getTransportationMode(currentModeId);
    if (!currentMode) return [];
    
    return TRANSPORTATION_MODES
      .filter(mode => mode.emissionFactor < currentMode.emissionFactor)
      .sort((a, b) => a.emissionFactor - b.emissionFactor);
  }
}

// Export singleton instance
export const emissionCalculator = new EmissionCalculator();
