import express from 'express';
import { body, query, validationResult } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth';
import { BusService } from '../services/busService';
import { logger } from '../utils/logger';

const router = express.Router();

// Validation middleware
const validateBusCreation = [
  body('number').notEmpty().withMessage('Bus number is required'),
  body('capacity').isInt({ min: 10, max: 100 }).withMessage('Capacity must be between 10 and 100'),
  body('busType').isIn(['STANDARD', 'PREMIUM', 'LUXURY']).withMessage('Invalid bus type'),
  body('manufacturer').notEmpty().withMessage('Manufacturer is required'),
  body('model').notEmpty().withMessage('Model is required'),
  body('year').isInt({ min: 2000, max: new Date().getFullYear() + 1 }).withMessage('Invalid year'),
  body('licensePlate').notEmpty().withMessage('License plate is required'),
  body('fuelType').isIn(['DIESEL', 'ELECTRIC', 'HYBRID']).withMessage('Invalid fuel type'),
];

const validateMaintenanceRecord = [
  body('busId').notEmpty().withMessage('Bus ID is required'),
  body('type').isIn(['ROUTINE', 'REPAIR', 'INSPECTION', 'EMERGENCY']).withMessage('Invalid maintenance type'),
  body('description').notEmpty().withMessage('Description is required'),
  body('scheduledDate').isISO8601().withMessage('Invalid scheduled date'),
];

// @route   GET /api/buses
// @desc    Get all buses with filtering
// @access  Private (Admin)
router.get('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req, res) => {
  try {
    const { busType, maintenanceStatus, capacity, sortBy, limit = 20, offset = 0 } = req.query;
    
    const filters = {
      busType,
      maintenanceStatus,
      capacity,
      sortBy,
    };

    const result = await BusService.getAllBuses(filters);
    
    // Apply pagination
    const startIndex = parseInt(offset as string);
    const endIndex = startIndex + parseInt(limit as string);
    const paginatedBuses = result.buses.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        buses: paginatedBuses,
        total: result.total,
        hasMore: endIndex < result.total,
        filters,
      },
    });
  } catch (error) {
    logger.error('Get buses error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch buses',
    });
  }
});

// @route   GET /api/buses/:id
// @desc    Get bus details
// @access  Private (Admin)
router.get('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    
    const bus = await BusService.getBusById(id);
    
    res.json({
      success: true,
      data: bus,
    });
  } catch (error) {
    logger.error('Get bus error:', error);
    
    if (error instanceof Error && error.message === 'Bus not found') {
      return res.status(404).json({
        success: false,
        message: 'Bus not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch bus details',
    });
  }
});

// @route   POST /api/buses
// @desc    Create a new bus
// @access  Private (Admin)
router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validateBusCreation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const busData = req.body;
    const newBus = await BusService.createBus(busData);

    res.status(201).json({
      success: true,
      message: 'Bus created successfully',
      data: newBus,
    });
  } catch (error) {
    logger.error('Create bus error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create bus',
    });
  }
});

// @route   PUT /api/buses/:id
// @desc    Update a bus
// @access  Private (Admin)
router.put('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedBus = await BusService.updateBus(id, updateData);

    res.json({
      success: true,
      message: 'Bus updated successfully',
      data: updatedBus,
    });
  } catch (error) {
    logger.error('Update bus error:', error);
    
    if (error instanceof Error && error.message === 'Bus not found') {
      return res.status(404).json({
        success: false,
        message: 'Bus not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update bus',
    });
  }
});

// @route   DELETE /api/buses/:id
// @desc    Delete a bus
// @access  Private (Admin)
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;

    await BusService.deleteBus(id);

    res.json({
      success: true,
      message: 'Bus deleted successfully',
    });
  } catch (error) {
    logger.error('Delete bus error:', error);
    
    if (error instanceof Error && error.message === 'Bus not found') {
      return res.status(404).json({
        success: false,
        message: 'Bus not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to delete bus',
    });
  }
});

// @route   GET /api/buses/:id/seats
// @desc    Get bus seat configuration
// @access  Public (for booking)
router.get('/:id/seats', async (req, res) => {
  try {
    const { id } = req.params;
    
    const bus = await BusService.getBusById(id);
    
    res.json({
      success: true,
      data: {
        busId: id,
        busNumber: bus.number,
        busType: bus.busType,
        capacity: bus.capacity,
        seatConfiguration: bus.seatConfiguration,
        amenities: bus.amenities,
        features: bus.features,
      },
    });
  } catch (error) {
    logger.error('Get bus seats error:', error);
    
    if (error instanceof Error && error.message === 'Bus not found') {
      return res.status(404).json({
        success: false,
        message: 'Bus not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch bus seat configuration',
    });
  }
});

// @route   GET /api/buses/:id/availability
// @desc    Check bus availability for a specific date
// @access  Public
router.get('/:id/availability', async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date parameter is required',
      });
    }

    const availability = await BusService.checkBusAvailability(id, date as string);

    res.json({
      success: true,
      data: availability,
    });
  } catch (error) {
    logger.error('Check bus availability error:', error);
    
    if (error instanceof Error && error.message === 'Bus not found') {
      return res.status(404).json({
        success: false,
        message: 'Bus not found',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to check bus availability',
    });
  }
});

// @route   GET /api/buses/:id/maintenance
// @desc    Get maintenance records for a bus
// @access  Private (Admin)
router.get('/:id/maintenance', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req, res) => {
  try {
    const { id } = req.params;
    
    const maintenanceRecords = await BusService.getMaintenanceRecords(id);
    
    res.json({
      success: true,
      data: {
        busId: id,
        records: maintenanceRecords,
        total: maintenanceRecords.length,
      },
    });
  } catch (error) {
    logger.error('Get maintenance records error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch maintenance records',
    });
  }
});

// @route   POST /api/buses/:id/maintenance
// @desc    Create maintenance record for a bus
// @access  Private (Admin)
router.post('/:id/maintenance', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validateMaintenanceRecord, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const recordData = {
      ...req.body,
      busId: id,
    };

    const newRecord = await BusService.createMaintenanceRecord(recordData);

    res.status(201).json({
      success: true,
      message: 'Maintenance record created successfully',
      data: newRecord,
    });
  } catch (error) {
    logger.error('Create maintenance record error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create maintenance record',
    });
  }
});

// @route   GET /api/buses/analytics/overview
// @desc    Get bus fleet analytics
// @access  Private (Admin)
router.get('/analytics/overview', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req, res) => {
  try {
    const analytics = await BusService.getBusAnalytics();

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    logger.error('Get bus analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bus analytics',
    });
  }
});

export default router;
