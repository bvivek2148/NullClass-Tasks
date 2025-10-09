export class Booking {
  constructor({
    passenger_name,
    passenger_email,
    passenger_phone,
    origin,
    destination,
    travel_date,
    travel_time,
    number_of_passengers = 1,
    total_price,
    status = 'pending',
    booking_reference
  }) {
    this.passenger_name = passenger_name;
    this.passenger_email = passenger_email;
    this.passenger_phone = passenger_phone;
    this.origin = origin;
    this.destination = destination;
    this.travel_date = travel_date;
    this.travel_time = travel_time;
    this.number_of_passengers = number_of_passengers;
    this.total_price = total_price;
    this.status = status;
    this.booking_reference = booking_reference || this.generateReference();
  }

  // Generate a unique booking reference
  generateReference() {
    const prefix = 'YS'; // Yatra Saathi
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 4);
    return `${prefix}${timestamp}${random}`.toUpperCase();
  }

  // Get formatted total price
  getFormattedPrice() {
    return `₹${this.total_price?.toLocaleString('en-IN') || 0}`;
  }

  // Get booking summary
  getSummary() {
    return `${this.origin} → ${this.destination} on ${this.travel_date}`;
  }

  // Update booking status
  updateStatus(newStatus) {
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (validStatuses.includes(newStatus)) {
      this.status = newStatus;
      return true;
    }
    return false;
  }

  // Static method to create booking from API response
  static fromAPI(data) {
    return new Booking(data);
  }

  // Static method to list user bookings (mock data)
  static async listUserBookings(userEmail) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockBookings = [
      {
        passenger_name: "John Doe",
        passenger_email: userEmail,
        passenger_phone: "+91 98765 43210",
        origin: "Delhi",
        destination: "Mumbai",
        travel_date: "2024-01-15",
        travel_time: "14:30",
        number_of_passengers: 2,
        total_price: 17000,
        status: "confirmed",
        booking_reference: "YS1234ABCD"
      },
      {
        passenger_name: "Jane Smith",
        passenger_email: userEmail,
        passenger_phone: "+91 87654 32109",
        origin: "Mumbai",
        destination: "Goa",
        travel_date: "2024-01-20",
        travel_time: "20:00",
        number_of_passengers: 1,
        total_price: 320,
        status: "pending",
        booking_reference: "YS5678EFGH"
      }
    ];
    
    return mockBookings.map(booking => new Booking(booking));
  }
}
