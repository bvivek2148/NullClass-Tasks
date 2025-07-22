import express from 'express';
import { body, query, validationResult } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth';
import { BookingService } from '../services/bookingService';
import { logger } from '../utils/logger';

const router = express.Router();

// Validation middleware
const validateSeatReservation = [
  body('scheduleId').notEmpty().withMessage('Schedule ID is required'),
  body('seatIds').isArray({ min: 1 }).withMessage('At least one seat must be selected'),
  body('durationMinutes').optional().isInt({ min: 5, max: 60 }).withMessage('Duration must be between 5 and 60 minutes'),
];

const validateBookingCreation = [
  body('routeId').notEmpty().withMessage('Route ID is required'),
  body('scheduleId').notEmpty().withMessage('Schedule ID is required'),
  body('passengers').isArray({ min: 1 }).withMessage('At least one passenger is required'),
  body('passengers.*.firstName').notEmpty().withMessage('Passenger first name is required'),
  body('passengers.*.lastName').notEmpty().withMessage('Passenger last name is required'),
  body('passengers.*.ticketType').isIn(['ADULT', 'CHILD', 'SENIOR', 'STUDENT']).withMessage('Invalid ticket type'),
  body('selectedSeats').isArray({ min: 1 }).withMessage('At least one seat must be selected'),
];

// @route   POST /api/bookings/seats/check
// @desc    Check seat availability
// @access  Public
router.post('/seats/check', async (req, res) => {
  try {
    const { scheduleId, seatIds } = req.body;

    if (!scheduleId || !seatIds || !Array.isArray(seatIds)) {
      return res.status(400).json({
        success: false,
        message: 'Schedule ID and seat IDs are required',
      });
    }

    const availability = await BookingService.checkSeatAvailability(scheduleId, seatIds);

    res.json({
      success: true,
      data: availability,
    });
  } catch (error) {
    logger.error('Check seat availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check seat availability',
    });
  }
});

// @route   POST /api/bookings/seats/reserve
// @desc    Reserve seats temporarily
// @access  Private
router.post('/seats/reserve', authenticate, validateSeatReservation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { scheduleId, seatIds, durationMinutes = 15 } = req.body;
    const userId = req.user!.id;

    const reservation = await BookingService.reserveSeats(scheduleId, seatIds, userId, durationMinutes);

    res.status(201).json({
      success: true,
      message: 'Seats reserved successfully',
      data: reservation,
    });
  } catch (error) {
    logger.error('Reserve seats error:', error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to reserve seats',
    });
  }
});

// @route   DELETE /api/bookings/seats/reserve/:id
// @desc    Release seat reservation
// @access  Private
router.delete('/seats/reserve/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    await BookingService.releaseReservation(id, userId);

    res.json({
      success: true,
      message: 'Reservation released successfully',
    });
  } catch (error) {
    logger.error('Release reservation error:', error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to release reservation',
    });
  }
});

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', authenticate, validateBookingCreation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { routeId, scheduleId, passengers, selectedSeats, reservationId } = req.body;
    const userId = req.user!.id;

    const booking = await BookingService.createBooking({
      userId,
      routeId,
      scheduleId,
      passengers,
      selectedSeats,
      reservationId,
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    });
  } catch (error) {
    logger.error('Create booking error:', error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create booking',
    });
  }
});

// @route   GET /api/bookings
// @desc    Get user bookings
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, dateFrom, dateTo, limit = 20, offset = 0 } = req.query;
    const userId = req.user!.id;

    const filters = {
      status,
      dateFrom,
      dateTo,
    };

    const result = await BookingService.getUserBookings(userId, filters);
    
    // Apply pagination
    const startIndex = parseInt(offset as string);
    const endIndex = startIndex + parseInt(limit as string);
    const paginatedBookings = result.bookings.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        bookings: paginatedBookings,
        total: result.total,
        hasMore: endIndex < result.total,
        filters,
      },
    });
  } catch (error) {
    logger.error('Get user bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
    });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get booking details
// @access  Private
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const booking = await BookingService.getBookingById(id, userId);

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    logger.error('Get booking error:', error);
    
    if (error instanceof Error && (error.message === 'Booking not found' || error.message === 'Access denied')) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking details',
    });
  }
});

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status
// @access  Private (Admin)
router.put('/:id/status', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentData } = req.body;

    if (!['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const booking = await BookingService.updateBookingStatus(id, status, paymentData);

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking,
    });
  } catch (error) {
    logger.error('Update booking status error:', error);
    
    if (error instanceof Error && error.message === 'Booking not found') {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update booking status',
    });
  }
});

// @route   POST /api/bookings/:id/cancel
// @desc    Cancel booking
// @access  Private
router.post('/:id/cancel', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user!.id;

    await BookingService.cancelBooking(id, userId, reason);

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
    });
  } catch (error) {
    logger.error('Cancel booking error:', error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to cancel booking',
    });
  }
});

// @route   GET /api/bookings/analytics/overview
// @desc    Get booking analytics
// @access  Private (Admin)
router.get('/analytics/overview', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req, res) => {
  try {
    const analytics = await BookingService.getBookingAnalytics();

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    logger.error('Get booking analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking analytics',
    });
  }
});

export default router;
