import Stripe from 'stripe';
import { logger } from '../utils/logger';
import { BookingService } from './bookingService';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_...', {
  apiVersion: '2023-10-16',
});

// Payment interfaces
export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status: string;
  bookingId: string;
  userId: string;
  createdAt: string;
}

export interface PaymentMethod {
  id: string;
  type: 'STRIPE' | 'PAYPAL' | 'APPLE_PAY' | 'GOOGLE_PAY';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  userId: string;
  createdAt: string;
}

export interface PaymentTransaction {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'PROCESSING' | 'SUCCEEDED' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
  paymentMethod: string;
  paymentIntentId?: string;
  stripePaymentId?: string;
  paypalTransactionId?: string;
  failureReason?: string;
  refundAmount?: number;
  refundReason?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface RefundRequest {
  transactionId: string;
  amount?: number; // Partial refund amount, full refund if not specified
  reason: string;
  requestedBy: string;
}

// Mock data - will be replaced with database operations
let paymentIntents: PaymentIntent[] = [];
let paymentMethods: PaymentMethod[] = [];
let paymentTransactions: PaymentTransaction[] = [];

export class PaymentService {
  // Stripe Payment Intent Management
  static async createPaymentIntent(bookingId: string, userId: string) {
    try {
      // Get booking details
      const booking = await BookingService.getBookingById(bookingId, userId);
      
      if (booking.status !== 'PENDING') {
        throw new Error('Booking is not in pending status');
      }

      if (booking.paymentStatus !== 'PENDING') {
        throw new Error('Payment already processed for this booking');
      }

      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(booking.totalAmount * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          bookingId,
          userId,
          bookingReference: booking.bookingReference,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      // Store payment intent
      const paymentIntentRecord: PaymentIntent = {
        id: paymentIntent.id,
        clientSecret: paymentIntent.client_secret!,
        amount: booking.totalAmount,
        currency: 'usd',
        status: paymentIntent.status,
        bookingId,
        userId,
        createdAt: new Date().toISOString(),
      };

      paymentIntents.push(paymentIntentRecord);

      // Create transaction record
      const transaction: PaymentTransaction = {
        id: `txn-${Date.now()}`,
        bookingId,
        userId,
        amount: booking.totalAmount,
        currency: 'usd',
        status: 'PENDING',
        paymentMethod: 'STRIPE',
        paymentIntentId: paymentIntent.id,
        metadata: {
          bookingReference: booking.bookingReference,
          passengers: booking.passengers.length,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      paymentTransactions.push(transaction);

      logger.info('Payment intent created:', { 
        paymentIntentId: paymentIntent.id, 
        bookingId, 
        amount: booking.totalAmount 
      });

      return {
        paymentIntent: paymentIntentRecord,
        transaction,
      };
    } catch (error) {
      logger.error('Error creating payment intent:', error);
      throw error;
    }
  }

  static async confirmPayment(paymentIntentId: string, paymentMethodId?: string) {
    try {
      // Get payment intent from Stripe
      const stripePaymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      // Find our payment intent record
      const paymentIntentRecord = paymentIntents.find(pi => pi.id === paymentIntentId);
      if (!paymentIntentRecord) {
        throw new Error('Payment intent not found');
      }

      // Update transaction status
      const transaction = paymentTransactions.find(t => t.paymentIntentId === paymentIntentId);
      if (transaction) {
        transaction.status = stripePaymentIntent.status === 'succeeded' ? 'SUCCEEDED' : 'PROCESSING';
        transaction.stripePaymentId = stripePaymentIntent.id;
        transaction.updatedAt = new Date().toISOString();

        if (paymentMethodId) {
          transaction.paymentMethod = paymentMethodId;
        }
      }

      // Update booking status if payment succeeded
      if (stripePaymentIntent.status === 'succeeded') {
        await BookingService.updateBookingStatus(
          paymentIntentRecord.bookingId,
          'CONFIRMED',
          {
            status: 'PAID',
            method: 'STRIPE',
            id: stripePaymentIntent.id,
          }
        );

        logger.info('Payment confirmed and booking updated:', {
          paymentIntentId,
          bookingId: paymentIntentRecord.bookingId,
        });
      }

      return {
        paymentIntent: stripePaymentIntent,
        transaction,
        booking: await BookingService.getBookingById(paymentIntentRecord.bookingId),
      };
    } catch (error) {
      logger.error('Error confirming payment:', error);
      throw error;
    }
  }

  // Payment Method Management
  static async savePaymentMethod(userId: string, paymentMethodId: string, isDefault: boolean = false) {
    try {
      // Get payment method from Stripe
      const stripePaymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

      // Create payment method record
      const paymentMethod: PaymentMethod = {
        id: paymentMethodId,
        type: 'STRIPE',
        last4: stripePaymentMethod.card?.last4,
        brand: stripePaymentMethod.card?.brand,
        expiryMonth: stripePaymentMethod.card?.exp_month,
        expiryYear: stripePaymentMethod.card?.exp_year,
        isDefault,
        userId,
        createdAt: new Date().toISOString(),
      };

      // If this is set as default, unset other defaults
      if (isDefault) {
        paymentMethods.forEach(pm => {
          if (pm.userId === userId) {
            pm.isDefault = false;
          }
        });
      }

      paymentMethods.push(paymentMethod);

      logger.info('Payment method saved:', { paymentMethodId, userId });

      return paymentMethod;
    } catch (error) {
      logger.error('Error saving payment method:', error);
      throw error;
    }
  }

  static async getUserPaymentMethods(userId: string) {
    try {
      const userPaymentMethods = paymentMethods.filter(pm => pm.userId === userId);
      
      return {
        paymentMethods: userPaymentMethods,
        total: userPaymentMethods.length,
      };
    } catch (error) {
      logger.error('Error fetching user payment methods:', error);
      throw new Error('Failed to fetch payment methods');
    }
  }

  static async deletePaymentMethod(paymentMethodId: string, userId: string) {
    try {
      // Detach from Stripe
      await stripe.paymentMethods.detach(paymentMethodId);

      // Remove from our records
      const index = paymentMethods.findIndex(pm => pm.id === paymentMethodId && pm.userId === userId);
      if (index === -1) {
        throw new Error('Payment method not found');
      }

      paymentMethods.splice(index, 1);

      logger.info('Payment method deleted:', { paymentMethodId, userId });

      return { message: 'Payment method deleted successfully' };
    } catch (error) {
      logger.error('Error deleting payment method:', error);
      throw error;
    }
  }

  // Refund Management
  static async processRefund(refundRequest: RefundRequest) {
    try {
      const { transactionId, amount, reason, requestedBy } = refundRequest;

      // Find transaction
      const transaction = paymentTransactions.find(t => t.id === transactionId);
      if (!transaction) {
        throw new Error('Transaction not found');
      }

      if (transaction.status !== 'SUCCEEDED') {
        throw new Error('Can only refund successful transactions');
      }

      // Calculate refund amount
      const refundAmount = amount || transaction.amount;
      
      if (refundAmount > transaction.amount) {
        throw new Error('Refund amount cannot exceed transaction amount');
      }

      // Process refund with Stripe
      let stripeRefund;
      if (transaction.stripePaymentId) {
        stripeRefund = await stripe.refunds.create({
          payment_intent: transaction.stripePaymentId,
          amount: Math.round(refundAmount * 100), // Convert to cents
          reason: 'requested_by_customer',
          metadata: {
            transactionId,
            requestedBy,
            reason,
          },
        });
      }

      // Update transaction
      transaction.status = 'REFUNDED';
      transaction.refundAmount = refundAmount;
      transaction.refundReason = reason;
      transaction.updatedAt = new Date().toISOString();

      // Update booking status
      await BookingService.updateBookingStatus(
        transaction.bookingId,
        'CANCELLED',
        {
          status: 'REFUNDED',
          refundAmount,
          refundReason: reason,
        }
      );

      logger.info('Refund processed:', {
        transactionId,
        refundAmount,
        stripeRefundId: stripeRefund?.id,
      });

      return {
        refund: stripeRefund,
        transaction,
        refundAmount,
      };
    } catch (error) {
      logger.error('Error processing refund:', error);
      throw error;
    }
  }

  // Transaction Management
  static async getTransactionById(transactionId: string, userId?: string) {
    try {
      const transaction = paymentTransactions.find(t => t.id === transactionId);
      
      if (!transaction) {
        throw new Error('Transaction not found');
      }

      // Check user access if userId provided
      if (userId && transaction.userId !== userId) {
        throw new Error('Access denied');
      }

      return transaction;
    } catch (error) {
      logger.error('Error fetching transaction:', error);
      throw error;
    }
  }

  static async getUserTransactions(userId: string, filters: any = {}) {
    try {
      let userTransactions = paymentTransactions.filter(t => t.userId === userId);

      // Apply filters
      if (filters.status) {
        userTransactions = userTransactions.filter(t => t.status === filters.status);
      }

      if (filters.dateFrom) {
        userTransactions = userTransactions.filter(t => t.createdAt >= filters.dateFrom);
      }

      if (filters.dateTo) {
        userTransactions = userTransactions.filter(t => t.createdAt <= filters.dateTo);
      }

      // Sort by creation date (newest first)
      userTransactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return {
        transactions: userTransactions,
        total: userTransactions.length,
      };
    } catch (error) {
      logger.error('Error fetching user transactions:', error);
      throw new Error('Failed to fetch transactions');
    }
  }

  // Webhook handling
  static async handleStripeWebhook(event: Stripe.Event) {
    try {
      logger.info('Processing Stripe webhook:', { type: event.type, id: event.id });

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
          break;
        
        case 'payment_intent.payment_failed':
          await this.handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
          break;
        
        case 'charge.dispute.created':
          await this.handleChargeDispute(event.data.object as Stripe.Dispute);
          break;
        
        default:
          logger.info('Unhandled webhook event type:', event.type);
      }

      return { received: true };
    } catch (error) {
      logger.error('Error handling Stripe webhook:', error);
      throw error;
    }
  }

  private static async handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    const bookingId = paymentIntent.metadata.bookingId;
    
    if (bookingId) {
      await this.confirmPayment(paymentIntent.id);
    }
  }

  private static async handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
    const transaction = paymentTransactions.find(t => t.paymentIntentId === paymentIntent.id);
    
    if (transaction) {
      transaction.status = 'FAILED';
      transaction.failureReason = paymentIntent.last_payment_error?.message || 'Payment failed';
      transaction.updatedAt = new Date().toISOString();
    }
  }

  private static async handleChargeDispute(dispute: Stripe.Dispute) {
    // Handle dispute logic here
    logger.warn('Charge dispute created:', { disputeId: dispute.id, amount: dispute.amount });
  }

  // Analytics
  static async getPaymentAnalytics() {
    try {
      const totalTransactions = paymentTransactions.length;
      const successfulTransactions = paymentTransactions.filter(t => t.status === 'SUCCEEDED').length;
      const failedTransactions = paymentTransactions.filter(t => t.status === 'FAILED').length;
      const refundedTransactions = paymentTransactions.filter(t => t.status === 'REFUNDED').length;
      
      const totalRevenue = paymentTransactions
        .filter(t => t.status === 'SUCCEEDED')
        .reduce((sum, t) => sum + t.amount, 0);

      const totalRefunds = paymentTransactions
        .filter(t => t.status === 'REFUNDED')
        .reduce((sum, t) => sum + (t.refundAmount || 0), 0);

      const averageTransactionValue = successfulTransactions > 0 ? totalRevenue / successfulTransactions : 0;
      const successRate = totalTransactions > 0 ? (successfulTransactions / totalTransactions) * 100 : 0;

      return {
        totalTransactions,
        successfulTransactions,
        failedTransactions,
        refundedTransactions,
        totalRevenue,
        totalRefunds,
        netRevenue: totalRevenue - totalRefunds,
        averageTransactionValue: Math.round(averageTransactionValue * 100) / 100,
        successRate: Math.round(successRate * 100) / 100,
      };
    } catch (error) {
      logger.error('Error fetching payment analytics:', error);
      throw new Error('Failed to fetch payment analytics');
    }
  }
}
