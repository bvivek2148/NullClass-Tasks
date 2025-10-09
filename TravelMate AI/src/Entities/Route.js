export class Route {
  constructor({
    origin,
    destination,
    duration,
    distance,
    price,
    available_times = [],
    vehicle_type
  }) {
    this.origin = origin;
    this.destination = destination;
    this.duration = duration;
    this.distance = distance;
    this.price = price;
    this.available_times = available_times;
    this.vehicle_type = vehicle_type;
  }

  // Method to format price in INR
  getFormattedPrice() {
    return `₹${this.price.toLocaleString('en-IN')}`;
  }

  // Method to get route summary
  getSummary() {
    return `${this.origin} → ${this.destination} (${this.distance}, ${this.duration})`;
  }

  // Static method to create route from API response
  static fromAPI(data) {
    return new Route(data);
  }

  // Static method to list all routes (mock data)
  static async list() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockRoutes = [
      {
        origin: "Delhi",
        destination: "Mumbai",
        duration: "2h 15m",
        distance: "1400 km",
        price: 8500,
        available_times: ["06:00", "14:30", "21:00"],
        vehicle_type: "flight"
      },
      {
        origin: "Delhi",
        destination: "Bangalore",
        duration: "3h 30m",
        distance: "2200 km",
        price: 950,
        available_times: ["07:00", "12:30", "18:45"],
        vehicle_type: "flight"
      },
      {
        origin: "Mumbai",
        destination: "Pune",
        duration: "3h 30m",
        distance: "150 km",
        price: 450,
        available_times: ["08:00", "11:00", "15:30", "19:00"],
        vehicle_type: "bus"
      },
      {
        origin: "Delhi",
        destination: "Jaipur",
        duration: "4h 15m",
        distance: "280 km",
        price: 650,
        available_times: ["06:30", "10:15", "14:00", "17:30"],
        vehicle_type: "bus"
      },
      {
        origin: "Chennai",
        destination: "Bangalore",
        duration: "5h 30m",
        distance: "350 km",
        price: 720,
        available_times: ["22:30", "23:45"],
        vehicle_type: "train"
      },
      {
        origin: "Mumbai",
        destination: "Goa",
        duration: "12h 00m",
        distance: "600 km",
        price: 320,
        available_times: ["20:00", "21:30"],
        vehicle_type: "ferry"
      }
    ];
    
    return mockRoutes.map(route => new Route(route));
  }
}