import { logger } from '../utils/logger';
import { BusService } from './busService';
import { RouteService } from './routeService';

// Booking interfaces
export interface Booking {
  id: string;
  userId: string;
  routeId: string;
  scheduleId: string;
  busId: string;
  bookingReference: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  passengers: Passenger[];
  selectedSeats: string[];
  totalAmount: number;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  paymentMethod?: string;
  paymentId?: string;
  bookingDate: string;
  travelDate: string;
  departureTime: string;
  arrivalTime: string;
  origin: string;
  destination: string;
  qrCode?: string;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string; // For temporary reservations
}

export interface Passenger {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  idType?: 'PASSPORT' | 'DRIVERS_LICENSE' | 'NATIONAL_ID';
  idNumber?: string;
  seatNumber: string;
  ticketType: 'ADULT' | 'CHILD' | 'SENIOR' | 'STUDENT';
  price: number;
}

export interface SeatReservation {
  id: string;
  scheduleId: string;
  seatIds: string[];
  userId: string;
  expiresAt: string;
  createdAt: string;
}

// Mock data - will be replaced with database operations
let bookings: Booking[] = [];
let seatReservations: SeatReservation[] = [];
let bookingCounter = 1000;

export class BookingService {
  // Seat availability and reservation
  static async checkSeatAvailability(scheduleId: string, seatIds: string[]) {
    try {
      // Get existing bookings for this schedule
      const existingBookings = bookings.filter(
        booking => booking.scheduleId === scheduleId && 
        ['CONFIRMED', 'PENDING'].includes(booking.status)
      );

      // Get active reservations
      const activeReservations = seatReservations.filter(
        reservation => reservation.scheduleId === scheduleId &&
        new Date(reservation.expiresAt) > new Date()
      );

      // Collect occupied seats
      const occupiedSeats = new Set<string>();
      
      existingBookings.forEach(booking => {
        booking.selectedSeats.forEach(seatId => occupiedSeats.add(seatId));
      });

      activeReservations.forEach(reservation => {
        reservation.seatIds.forEach(seatId => occupiedSeats.add(seatId));
      });

      // Check if requested seats are available
      const unavailableSeats = seatIds.filter(seatId => occupiedSeats.has(seatId));

      return {
        available: unavailableSeats.length === 0,
        unavailableSeats,
        totalOccupied: occupiedSeats.size,
      };
    } catch (error) {
      logger.error('Error checking seat availability:', error);
      throw new Error('Failed to check seat availability');
    }
  }

  static async reserveSeats(scheduleId: string, seatIds: string[], userId: string, durationMinutes: number = 15) {
    try {
      // Check availability first
      const availability = await this.checkSeatAvailability(scheduleId, seatIds);
      
      if (!availability.available) {
        throw new Error(`Seats not available: ${availability.unavailableSeats.join(', ')}`);
      }

      // Create reservation
      const reservation: SeatReservation = {
        id: `res-${Date.now()}`,
        scheduleId,
        seatIds,
        userId,
        expiresAt: new Date(Date.now() + durationMinutes * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
      };

      seatReservations.push(reservation);

      // Clean up expired reservations
      this.cleanupExpiredReservations();

      logger.info('Seats reserved:', { reservationId: reservation.id, seatIds, userId });

      return reservation;
    } catch (error) {
      logger.error('Error reserving seats:', error);
      throw error;
    }
  }

  static async releaseReservation(reservationId: string, userId: string) {
    try {
      const reservationIndex = seatReservations.findIndex(
        res => res.id === reservationId && res.userId === userId
      );

      if (reservationIndex === -1) {
        throw new Error('Reservation not found');
      }

      seatReservations.splice(reservationIndex, 1);
      logger.info('Reservation released:', { reservationId, userId });

      return { message: 'Reservation released successfully' };
    } catch (error) {
      logger.error('Error releasing reservation:', error);
      throw error;
    }
  }

  static cleanupExpiredReservations() {
    const now = new Date();
    const initialCount = seatReservations.length;
    
    seatReservations = seatReservations.filter(
      reservation => new Date(reservation.expiresAt) > now
    );

    const removedCount = initialCount - seatReservations.length;
    if (removedCount > 0) {
      logger.info(`Cleaned up ${removedCount} expired reservations`);
    }
  }

  // Booking operations
  static async createBooking(bookingData: {
    userId: string;
    routeId: string;
    scheduleId: string;
    passengers: Omit<Passenger, 'id'>[];
    selectedSeats: string[];
    reservationId?: string;
  }) {
    try {
      // Validate reservation if provided
      if (bookingData.reservationId) {
        const reservation = seatReservations.find(
          res => res.id === bookingData.reservationId && res.userId === bookingData.userId
        );

        if (!reservation) {
          throw new Error('Invalid or expired reservation');
        }

        if (new Date(reservation.expiresAt) <= new Date()) {
          throw new Error('Reservation has expired');
        }
      }

      // Get route and schedule details
      const route = await RouteService.getRouteById(bookingData.routeId);
      const schedule = route.schedules.find(s => s.id === bookingData.scheduleId);

      if (!schedule) {
        throw new Error('Schedule not found');
      }

      // Get bus details for seat information
      const bus = await BusService.getBusById(schedule.busId);

      // Calculate total amount
      let totalAmount = 0;
      const passengers: Passenger[] = bookingData.passengers.map((passenger, index) => {
        const seatId = bookingData.selectedSeats[index];
        const seat = bus.seatConfiguration.seatMap.find(s => s.id === seatId);
        const price = seat?.price?.base || schedule.pricing.economy;
        
        totalAmount += price;

        return {
          id: `pass-${Date.now()}-${index}`,
          ...passenger,
          seatNumber: seat?.number || '',
          price,
        };
      });

      // Generate booking reference
      const bookingReference = `TC${String(bookingCounter++).padStart(6, '0')}`;

      // Create booking
      const booking: Booking = {
        id: `booking-${Date.now()}`,
        userId: bookingData.userId,
        routeId: bookingData.routeId,
        scheduleId: bookingData.scheduleId,
        busId: schedule.busId,
        bookingReference,
        status: 'PENDING',
        passengers,
        selectedSeats: bookingData.selectedSeats,
        totalAmount,
        paymentStatus: 'PENDING',
        bookingDate: new Date().toISOString(),
        travelDate: schedule.date,
        departureTime: schedule.departureTime,
        arrivalTime: schedule.arrivalTime,
        origin: route.origin,
        destination: route.destination,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes to complete payment
      };

      bookings.push(booking);

      // Remove reservation if it exists
      if (bookingData.reservationId) {
        await this.releaseReservation(bookingData.reservationId, bookingData.userId);
      }

      logger.info('Booking created:', { bookingId: booking.id, reference: bookingReference });

      return booking;
    } catch (error) {
      logger.error('Error creating booking:', error);
      throw error;
    }
  }

  static async getBookingById(bookingId: string, userId?: string) {
    try {
      const booking = bookings.find(b => b.id === bookingId);
      
      if (!booking) {
        throw new Error('Booking not found');
      }

      // Check user access if userId provided
      if (userId && booking.userId !== userId) {
        throw new Error('Access denied');
      }

      return booking;
    } catch (error) {
      logger.error('Error fetching booking:', error);
      throw error;
    }
  }

  static async getUserBookings(userId: string, filters: any = {}) {
    try {
      let userBookings = bookings.filter(booking => booking.userId === userId);

      // Apply filters
      if (filters.status) {
        userBookings = userBookings.filter(booking => booking.status === filters.status);
      }

      if (filters.dateFrom) {
        userBookings = userBookings.filter(booking => booking.travelDate >= filters.dateFrom);
      }

      if (filters.dateTo) {
        userBookings = userBookings.filter(booking => booking.travelDate <= filters.dateTo);
      }

      // Sort by travel date (upcoming first)
      userBookings.sort((a, b) => new Date(a.travelDate).getTime() - new Date(b.travelDate).getTime());

      return {
        bookings: userBookings,
        total: userBookings.length,
      };
    } catch (error) {
      logger.error('Error fetching user bookings:', error);
      throw new Error('Failed to fetch bookings');
    }
  }

  static async updateBookingStatus(bookingId: string, status: Booking['status'], paymentData?: any) {
    try {
      const bookingIndex = bookings.findIndex(b => b.id === bookingId);
      
      if (bookingIndex === -1) {
        throw new Error('Booking not found');
      }

      const booking = bookings[bookingIndex];
      
      // Update booking
      booking.status = status;
      booking.updatedAt = new Date().toISOString();

      if (paymentData) {
        booking.paymentStatus = paymentData.status;
        booking.paymentMethod = paymentData.method;
        booking.paymentId = paymentData.id;
      }

      // Generate QR code for confirmed bookings
      if (status === 'CONFIRMED' && !booking.qrCode) {
        booking.qrCode = this.generateQRCode(booking);
      }

      // Remove expiration for confirmed bookings
      if (status === 'CONFIRMED') {
        delete booking.expiresAt;
      }

      logger.info('Booking status updated:', { bookingId, status });

      return booking;
    } catch (error) {
      logger.error('Error updating booking status:', error);
      throw error;
    }
  }

  static async cancelBooking(bookingId: string, userId: string, reason?: string) {
    try {
      const booking = await this.getBookingById(bookingId, userId);
      
      if (booking.status === 'CANCELLED') {
        throw new Error('Booking is already cancelled');
      }

      if (booking.status === 'COMPLETED') {
        throw new Error('Cannot cancel completed booking');
      }

      // Update booking status
      await this.updateBookingStatus(bookingId, 'CANCELLED');

      // TODO: Process refund if payment was made

      logger.info('Booking cancelled:', { bookingId, userId, reason });

      return { message: 'Booking cancelled successfully' };
    } catch (error) {
      logger.error('Error cancelling booking:', error);
      throw error;
    }
  }

  // Utility methods
  static generateQRCode(booking: Booking): string {
    // In a real implementation, this would generate an actual QR code
    // For now, return a base64 encoded string of booking data
    const qrData = {
      reference: booking.bookingReference,
      route: `${booking.origin} → ${booking.destination}`,
      date: booking.travelDate,
      time: booking.departureTime,
      seats: booking.passengers.map(p => p.seatNumber).join(', '),
    };

    return Buffer.from(JSON.stringify(qrData)).toString('base64');
  }

  static async getBookingAnalytics() {
    try {
      const totalBookings = bookings.length;
      const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED').length;
      const pendingBookings = bookings.filter(b => b.status === 'PENDING').length;
      const cancelledBookings = bookings.filter(b => b.status === 'CANCELLED').length;
      
      const totalRevenue = bookings
        .filter(b => b.paymentStatus === 'PAID')
        .reduce((sum, booking) => sum + booking.totalAmount, 0);

      const averageBookingValue = confirmedBookings > 0 ? totalRevenue / confirmedBookings : 0;

      return {
        totalBookings,
        confirmedBookings,
        pendingBookings,
        cancelledBookings,
        totalRevenue,
        averageBookingValue: Math.round(averageBookingValue * 100) / 100,
        conversionRate: totalBookings > 0 ? (confirmedBookings / totalBookings) * 100 : 0,
      };
    } catch (error) {
      logger.error('Error fetching booking analytics:', error);
      throw new Error('Failed to fetch booking analytics');
    }
  }

  // Cleanup expired bookings
  static cleanupExpiredBookings() {
    const now = new Date();
    const initialCount = bookings.length;
    
    bookings = bookings.filter(booking => {
      if (booking.expiresAt && new Date(booking.expiresAt) <= now && booking.status === 'PENDING') {
        logger.info('Expired booking cleaned up:', { bookingId: booking.id });
        return false;
      }
      return true;
    });

    const removedCount = initialCount - bookings.length;
    if (removedCount > 0) {
      logger.info(`Cleaned up ${removedCount} expired bookings`);
    }
  }
}
