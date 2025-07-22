import express from 'express';
import { body, query, validationResult } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth';
import { PaymentService } from '../services/paymentService';
import { logger } from '../utils/logger';
import Stripe from 'stripe';

const router = express.Router();

// Initialize Stripe for webhook verification
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_...', {
  apiVersion: '2023-10-16',
});

// Validation middleware
const validatePaymentIntent = [
  body('bookingId').notEmpty().withMessage('Booking ID is required'),
];

const validatePaymentMethod = [
  body('paymentMethodId').notEmpty().withMessage('Payment method ID is required'),
  body('isDefault').optional().isBoolean().withMessage('isDefault must be a boolean'),
];

const validateRefund = [
  body('transactionId').notEmpty().withMessage('Transaction ID is required'),
  body('reason').notEmpty().withMessage('Refund reason is required'),
  body('amount').optional().isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
];

// @route   POST /api/payments/intent
// @desc    Create payment intent for booking
// @access  Private
router.post('/intent', authenticate, validatePaymentIntent, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { bookingId } = req.body;
    const userId = req.user!.id;

    const result = await PaymentService.createPaymentIntent(bookingId, userId);

    res.status(201).json({
      success: true,
      message: 'Payment intent created successfully',
      data: result,
    });
  } catch (error) {
    logger.error('Create payment intent error:', error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create payment intent',
    });
  }
});

// @route   POST /api/payments/confirm
// @desc    Confirm payment
// @access  Private
router.post('/confirm', authenticate, async (req, res) => {
  try {
    const { paymentIntentId, paymentMethodId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment intent ID is required',
      });
    }

    const result = await PaymentService.confirmPayment(paymentIntentId, paymentMethodId);

    res.json({
      success: true,
      message: 'Payment confirmed successfully',
      data: result,
    });
  } catch (error) {
    logger.error('Confirm payment error:', error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to confirm payment',
    });
  }
});

// @route   POST /api/payments/methods
// @desc    Save payment method
// @access  Private
router.post('/methods', authenticate, validatePaymentMethod, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { paymentMethodId, isDefault = false } = req.body;
    const userId = req.user!.id;

    const paymentMethod = await PaymentService.savePaymentMethod(userId, paymentMethodId, isDefault);

    res.status(201).json({
      success: true,
      message: 'Payment method saved successfully',
      data: paymentMethod,
    });
  } catch (error) {
    logger.error('Save payment method error:', error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to save payment method',
    });
  }
});

// @route   GET /api/payments/methods
// @desc    Get user payment methods
// @access  Private
router.get('/methods', authenticate, async (req, res) => {
  try {
    const userId = req.user!.id;

    const result = await PaymentService.getUserPaymentMethods(userId);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('Get payment methods error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment methods',
    });
  }
});

// @route   DELETE /api/payments/methods/:id
// @desc    Delete payment method
// @access  Private
router.delete('/methods/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    await PaymentService.deletePaymentMethod(id, userId);

    res.json({
      success: true,
      message: 'Payment method deleted successfully',
    });
  } catch (error) {
    logger.error('Delete payment method error:', error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to delete payment method',
    });
  }
});

// @route   POST /api/payments/refund
// @desc    Process refund
// @access  Private (Admin)
router.post('/refund', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validateRefund, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { transactionId, amount, reason } = req.body;
    const requestedBy = req.user!.id;

    const result = await PaymentService.processRefund({
      transactionId,
      amount,
      reason,
      requestedBy,
    });

    res.json({
      success: true,
      message: 'Refund processed successfully',
      data: result,
    });
  } catch (error) {
    logger.error('Process refund error:', error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to process refund',
    });
  }
});

// @route   GET /api/payments/transactions
// @desc    Get user transactions
// @access  Private
router.get('/transactions', authenticate, async (req, res) => {
  try {
    const { status, dateFrom, dateTo, limit = 20, offset = 0 } = req.query;
    const userId = req.user!.id;

    const filters = {
      status,
      dateFrom,
      dateTo,
    };

    const result = await PaymentService.getUserTransactions(userId, filters);
    
    // Apply pagination
    const startIndex = parseInt(offset as string);
    const endIndex = startIndex + parseInt(limit as string);
    const paginatedTransactions = result.transactions.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        transactions: paginatedTransactions,
        total: result.total,
        hasMore: endIndex < result.total,
        filters,
      },
    });
  } catch (error) {
    logger.error('Get user transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions',
    });
  }
});

// @route   GET /api/payments/transactions/:id
// @desc    Get transaction details
// @access  Private
router.get('/transactions/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const transaction = await PaymentService.getTransactionById(id, userId);

    res.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    logger.error('Get transaction error:', error);
    
    if (error instanceof Error && (error.message === 'Transaction not found' || error.message === 'Access denied')) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch transaction details',
    });
  }
});

// @route   POST /api/payments/webhook
// @desc    Handle Stripe webhooks
// @access  Public (but verified)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!endpointSecret) {
      logger.error('Stripe webhook secret not configured');
      return res.status(400).send('Webhook secret not configured');
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      logger.error('Webhook signature verification failed:', err);
      return res.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }

    // Handle the event
    await PaymentService.handleStripeWebhook(event);

    res.json({ received: true });
  } catch (error) {
    logger.error('Webhook handler error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed',
    });
  }
});

// @route   GET /api/payments/analytics/overview
// @desc    Get payment analytics
// @access  Private (Admin)
router.get('/analytics/overview', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req, res) => {
  try {
    const analytics = await PaymentService.getPaymentAnalytics();

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    logger.error('Get payment analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment analytics',
    });
  }
});

// @route   GET /api/payments/config
// @desc    Get Stripe publishable key
// @access  Public
router.get('/config', (req, res) => {
  res.json({
    success: true,
    data: {
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_...',
    },
  });
});

export default router;
