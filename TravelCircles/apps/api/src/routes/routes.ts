import express from 'express';
import { body, query, validationResult } from 'express-validator';
import { authenticate, authorize, optionalAuth } from '../middleware/auth';
import { RouteService } from '../services/routeService';
import { logger } from '../utils/logger';

const router = express.Router();

// Validation middleware
const validateRouteSearch = [
  query('origin').optional().isString().trim(),
  query('destination').optional().isString().trim(),
  query('date').optional().isISO8601().withMessage('Date must be in YYYY-MM-DD format'),
  query('passengers').optional().isInt({ min: 1, max: 10 }).withMessage('Passengers must be between 1 and 10'),
  query('sortBy').optional().isIn(['price', 'duration', 'departure', 'distance']).withMessage('Invalid sort option'),
];

const validateRouteCreation = [
  body('origin').notEmpty().withMessage('Origin is required'),
  body('destination').notEmpty().withMessage('Destination is required'),
  body('distance').isFloat({ min: 0 }).withMessage('Distance must be a positive number'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be a positive number in minutes'),
  body('operator').notEmpty().withMessage('Operator is required'),
  body('amenities').isArray().withMessage('Amenities must be an array'),
  body('pricing.economy').isFloat({ min: 0 }).withMessage('Economy price must be a positive number'),
  body('pricing.premium').isFloat({ min: 0 }).withMessage('Premium price must be a positive number'),
];

const validateScheduleCreation = [
  body('routeId').notEmpty().withMessage('Route ID is required'),
  body('busId').notEmpty().withMessage('Bus ID is required'),
  body('departureTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid departure time format (HH:MM)'),
  body('arrivalTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid arrival time format (HH:MM)'),
  body('date').isISO8601().withMessage('Date must be in YYYY-MM-DD format'),
  body('totalSeats').isInt({ min: 1, max: 100 }).withMessage('Total seats must be between 1 and 100'),
  body('pricing.economy').isFloat({ min: 0 }).withMessage('Economy price must be a positive number'),
  body('pricing.premium').isFloat({ min: 0 }).withMessage('Premium price must be a positive number'),
];

// @route   GET /api/routes/search
// @desc    Search for bus routes
// @access  Public
router.get('/search', validateRouteSearch, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { origin, destination, date, passengers = 1, sortBy = 'price' } = req.query;

    logger.info('Route search:', { origin, destination, date, passengers, sortBy });

    const searchResults = await RouteService.searchRoutes({
      origin,
      destination,
      date,
      passengers: parseInt(passengers as string),
      sortBy,
    });

    res.json({
      success: true,
      data: searchResults,
    });
  } catch (error) {
    logger.error('Route search error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to search routes',
    });
  }
});

// @route   GET /api/routes/:id
// @desc    Get route details
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const route = await RouteService.getRouteById(id);

    // Mock reviews data - will be replaced with actual review service
    const reviews = [
      {
        id: '1',
        userId: '1',
        userName: 'John Doe',
        rating: 5,
        comment: 'Excellent service, comfortable seats and on-time arrival!',
        createdAt: '2024-01-15T00:00:00.000Z',
        helpful: 12,
      },
      {
        id: '2',
        userId: '2',
        userName: 'Jane Smith',
        rating: 4,
        comment: 'Good value for money. WiFi worked well throughout the journey.',
        createdAt: '2024-01-10T00:00:00.000Z',
        helpful: 8,
      },
    ];

    res.json({
      success: true,
      data: {
        ...route,
        reviews,
        rating: 4.5,
        reviewCount: reviews.length,
      },
    });
  } catch (error) {
    logger.error('Get route error:', error);

    if (error instanceof Error && error.message === 'Route not found') {
      return res.status(404).json({
        success: false,
        message: 'Route not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch route details',
    });
  }
});

// @route   GET /api/routes
// @desc    Get routes with filtering and pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { limit = 10, offset = 0, sortBy, origin, destination, maxDistance } = req.query;

    const filters = {
      origin,
      destination,
      maxDistance,
      sortBy,
    };

    const result = await RouteService.getAllRoutes(filters);

    // Apply pagination
    const startIndex = parseInt(offset as string);
    const endIndex = startIndex + parseInt(limit as string);
    const paginatedRoutes = result.routes.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        routes: paginatedRoutes,
        total: result.total,
        hasMore: endIndex < result.total,
        filters,
      },
    });
  } catch (error) {
    logger.error('Get routes error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch routes',
    });
  }
});

// @route   POST /api/routes/:id/reviews
// @desc    Add a review for a route
// @access  Private
router.post('/:id/reviews', (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: 'Rating must be between 1 and 5',
    });
  }
  
  const newReview = {
    id: Date.now().toString(),
    userId: '1', // This would come from auth middleware
    userName: 'Current User',
    rating,
    comment: comment || '',
    createdAt: new Date().toISOString(),
    helpful: 0,
  };
  
  logger.info(`New review added for route ${id}:`, newReview);
  
  res.status(201).json({
    success: true,
    message: 'Review added successfully',
    data: newReview,
  });
});

// @route   GET /api/routes/:id/seat-map
// @desc    Get seat map for a specific schedule
// @access  Public
router.get('/:id/seat-map', (req, res) => {
  const { id } = req.params;
  const { scheduleId } = req.query;
  
  // Mock seat map data
  const seatMap = {
    busType: 'Standard Coach',
    totalSeats: 40,
    layout: {
      rows: 10,
      seatsPerRow: 4,
      aislePosition: 2, // Aisle after 2nd seat
    },
    seats: Array.from({ length: 40 }, (_, index) => ({
      id: (index + 1).toString(),
      number: `${Math.floor(index / 4) + 1}${String.fromCharCode(65 + (index % 4))}`,
      type: index < 8 ? 'premium' : 'economy',
      status: Math.random() > 0.3 ? 'available' : 'occupied',
      price: index < 8 ? 65 : 45,
      features: index < 8 ? ['Extra Legroom', 'Priority Boarding'] : [],
    })),
  };
  
  res.json({
    success: true,
    data: seatMap,
  });
});

// @route   GET /api/routes/cities/popular
// @desc    Get popular cities for route suggestions
// @access  Public
router.get('/cities/popular', (req, res) => {
  const popularCities = [
    { id: '1', name: 'New York, NY', state: 'NY', routes: 45 },
    { id: '2', name: 'Boston, MA', state: 'MA', routes: 32 },
    { id: '3', name: 'Washington, DC', state: 'DC', routes: 28 },
    { id: '4', name: 'Philadelphia, PA', state: 'PA', routes: 25 },
    { id: '5', name: 'Chicago, IL', state: 'IL', routes: 38 },
    { id: '6', name: 'Los Angeles, CA', state: 'CA', routes: 42 },
    { id: '7', name: 'Miami, FL', state: 'FL', routes: 22 },
    { id: '8', name: 'Atlanta, GA', state: 'GA', routes: 30 },
  ];
  
  res.json({
    success: true,
    data: popularCities,
  });
});

// @route   POST /api/routes
// @desc    Create a new route (Admin only)
// @access  Private (Admin)
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validateRouteCreation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const routeData = req.body;
    const newRoute = await RouteService.createRoute(routeData);

    res.status(201).json({
      success: true,
      message: 'Route created successfully',
      data: newRoute,
    });
  } catch (error) {
    logger.error('Create route error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create route',
    });
  }
});

// @route   PUT /api/routes/:id
// @desc    Update a route (Admin only)
// @access  Private (Admin)
router.put('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedRoute = await RouteService.updateRoute(id, updateData);

    res.json({
      success: true,
      message: 'Route updated successfully',
      data: updatedRoute,
    });
  } catch (error) {
    logger.error('Update route error:', error);

    if (error instanceof Error && error.message === 'Route not found') {
      return res.status(404).json({
        success: false,
        message: 'Route not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update route',
    });
  }
});

// @route   DELETE /api/routes/:id
// @desc    Delete a route (Admin only)
// @access  Private (Admin)
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;

    await RouteService.deleteRoute(id);

    res.json({
      success: true,
      message: 'Route deleted successfully',
    });
  } catch (error) {
    logger.error('Delete route error:', error);

    if (error instanceof Error && error.message === 'Route not found') {
      return res.status(404).json({
        success: false,
        message: 'Route not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to delete route',
    });
  }
});

// @route   GET /api/routes/:id/schedules
// @desc    Get schedules for a route
// @access  Public
router.get('/:id/schedules', async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    const schedules = await RouteService.getSchedulesByRoute(id, date as string);

    res.json({
      success: true,
      data: {
        routeId: id,
        date: date || 'all',
        schedules,
        total: schedules.length,
      },
    });
  } catch (error) {
    logger.error('Get schedules error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch schedules',
    });
  }
});

// @route   POST /api/routes/:id/schedules
// @desc    Create a new schedule for a route (Admin only)
// @access  Private (Admin)
router.post('/:id/schedules', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validateScheduleCreation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const scheduleData = {
      ...req.body,
      routeId: id,
      availableSeats: req.body.totalSeats, // Initially all seats are available
    };

    const newSchedule = await RouteService.createSchedule(scheduleData);

    res.status(201).json({
      success: true,
      message: 'Schedule created successfully',
      data: newSchedule,
    });
  } catch (error) {
    logger.error('Create schedule error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create schedule',
    });
  }
});

// @route   GET /api/routes/:id/stops
// @desc    Get stops for a route
// @access  Public
router.get('/:id/stops', async (req, res) => {
  try {
    const { id } = req.params;

    const stops = await RouteService.getRouteStops(id);

    res.json({
      success: true,
      data: {
        routeId: id,
        stops,
        total: stops.length,
      },
    });
  } catch (error) {
    logger.error('Get route stops error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch route stops',
    });
  }
});

// @route   GET /api/routes/:id/analytics
// @desc    Get route analytics (Admin only)
// @access  Private (Admin)
router.get('/:id/analytics', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;

    const analytics = await RouteService.getRouteAnalytics(id);

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    logger.error('Get route analytics error:', error);

    if (error instanceof Error && error.message === 'Route not found') {
      return res.status(404).json({
        success: false,
        message: 'Route not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch route analytics',
    });
  }
});

// @route   GET /api/routes/destinations/popular
// @desc    Get popular destinations
// @access  Public
router.get('/destinations/popular', async (req, res) => {
  try {
    const popularDestinations = await RouteService.getPopularDestinations();

    res.json({
      success: true,
      data: popularDestinations,
    });
  } catch (error) {
    logger.error('Get popular destinations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch popular destinations',
    });
  }
});

export default router;
