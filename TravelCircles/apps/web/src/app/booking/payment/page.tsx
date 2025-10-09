'use client';

// Opt out of static generation for this page
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth, useAuthenticatedFetch } from '../../../contexts/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { 
  ArrowLeftIcon, 
  CreditCardIcon,
  LockClosedIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_...');

interface BookingData {
  id: string;
  bookingReference: string;
  totalAmount: number;
  passengers: any[];
  selectedSeats: string[];
  travelDate: string;
  departureTime: string;
  origin: string;
  destination: string;
  status: string;
  paymentStatus: string;
}

function PaymentForm({ booking }: { booking: BookingData }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const authenticatedFetch = useAuthenticatedFetch();

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentIntent, setPaymentIntent] = useState<any>(null);
  const [saveCard, setSaveCard] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking' | 'wallet'>('upi');
  const [upiId, setUpiId] = useState('');

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    createPaymentIntent();
  }, []);

  const createPaymentIntent = async () => {
    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/api/payments/intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: booking.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPaymentIntent(data.data.paymentIntent);
      } else {
        setPaymentError(data.message || 'Failed to initialize payment');
      }
    } catch (error) {
      setPaymentError('Failed to initialize payment');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsProcessing(true);
    setPaymentError(null);

    try {
      if (paymentMethod === 'upi') {
        // Handle UPI payment
        if (!upiId.trim()) {
          setPaymentError('Please enter a valid UPI ID');
          return;
        }

        // Simulate UPI payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        // For demo purposes, simulate successful payment
        const paymentData = {
          bookingId: booking.id,
          paymentMethod: 'UPI',
          upiId: upiId,
          amount: booking.totalAmount,
          status: 'SUCCESS'
        };

        // Navigate to confirmation page
        router.push(`/booking/confirmation?bookingId=${booking.id}`);
      } else if (paymentMethod === 'card') {
        // Handle card payment with Stripe
        if (!stripe || !elements || !paymentIntent) {
          return;
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          setPaymentError('Card element not found');
          return;
        }

        const { error, paymentIntent: confirmedPaymentIntent } = await stripe.confirmCardPayment(
          paymentIntent.clientSecret,
          {
            payment_method: {
              card: cardElement,
            },
          }
        );

        if (error) {
          setPaymentError(error.message || 'Payment failed');
        } else if (confirmedPaymentIntent?.status === 'succeeded') {
          // Navigate to confirmation page
          router.push(`/booking/confirmation?bookingId=${booking.id}`);
        }
      } else {
        // Handle other payment methods (netbanking, wallet)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Navigate to confirmation page
        router.push(`/booking/confirmation?bookingId=${booking.id}`);
      }
    } catch (error) {
      setPaymentError('Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Method Selection */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <CreditCardIcon className="h-5 w-5 mr-2" />
          Choose Payment Method
        </h3>

        {/* Payment Method Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setPaymentMethod('upi')}
            className={`p-4 border rounded-lg text-center transition-colors ${
              paymentMethod === 'upi'
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-2">📱</div>
            <div className="text-sm font-medium">UPI</div>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('card')}
            className={`p-4 border rounded-lg text-center transition-colors ${
              paymentMethod === 'card'
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-2">💳</div>
            <div className="text-sm font-medium">Card</div>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('netbanking')}
            className={`p-4 border rounded-lg text-center transition-colors ${
              paymentMethod === 'netbanking'
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-2">🏦</div>
            <div className="text-sm font-medium">Net Banking</div>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('wallet')}
            className={`p-4 border rounded-lg text-center transition-colors ${
              paymentMethod === 'wallet'
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-2">👛</div>
            <div className="text-sm font-medium">Wallet</div>
          </button>
        </div>

        {/* Payment Method Forms */}
        {paymentMethod === 'upi' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                UPI ID
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@paytm / yourname@gpay"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter your UPI ID (Google Pay, PhonePe, Paytm, etc.)
              </p>
            </div>
          </div>
        )}

        {paymentMethod === 'card' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Information
              </label>
              <div className="border border-gray-300 rounded-md p-3 bg-white">
                <CardElement options={cardElementOptions} />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="save-card"
                type="checkbox"
                checked={saveCard}
                onChange={(e) => setSaveCard(e.target.checked)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="save-card" className="ml-2 text-sm text-gray-700">
                Save this card for future payments
              </label>
            </div>
          </div>
        )}

        {paymentMethod === 'netbanking' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Your Bank
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500">
                <option value="">Choose your bank</option>
                <option value="sbi">State Bank of India</option>
                <option value="hdfc">HDFC Bank</option>
                <option value="icici">ICICI Bank</option>
                <option value="axis">Axis Bank</option>
                <option value="kotak">Kotak Mahindra Bank</option>
                <option value="pnb">Punjab National Bank</option>
              </select>
            </div>
          </div>
        )}

        {paymentMethod === 'wallet' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Wallet
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" className="p-3 border border-gray-300 rounded-lg hover:border-primary-300 text-center">
                  <div className="text-lg mb-1">📱</div>
                  <div className="text-sm">Paytm</div>
                </button>
                <button type="button" className="p-3 border border-gray-300 rounded-lg hover:border-primary-300 text-center">
                  <div className="text-lg mb-1">💰</div>
                  <div className="text-sm">PhonePe</div>
                </button>
                <button type="button" className="p-3 border border-gray-300 rounded-lg hover:border-primary-300 text-center">
                  <div className="text-lg mb-1">🎯</div>
                  <div className="text-sm">Freecharge</div>
                </button>
                <button type="button" className="p-3 border border-gray-300 rounded-lg hover:border-primary-300 text-center">
                  <div className="text-lg mb-1">💳</div>
                  <div className="text-sm">MobiKwik</div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center">
          <LockClosedIcon className="h-5 w-5 text-blue-600 mr-2" />
          <div>
            <h4 className="text-sm font-medium text-blue-900">Secure Payment</h4>
            <p className="text-sm text-blue-700">
              Your payment information is encrypted and secure. We support all major Indian payment methods.
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {paymentError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-700">{paymentError}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isProcessing || (paymentMethod === 'card' && (!stripe || !paymentIntent)) || (paymentMethod === 'upi' && !upiId.trim())}
        className={`w-full py-3 px-4 rounded-md font-medium ${
          isProcessing || (paymentMethod === 'card' && (!stripe || !paymentIntent)) || (paymentMethod === 'upi' && !upiId.trim())
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-primary-600 text-white hover:bg-primary-700'
        }`}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            {paymentMethod === 'upi' ? 'Processing UPI Payment...' :
             paymentMethod === 'card' ? 'Processing Card Payment...' :
             'Processing Payment...'}
          </div>
        ) : (
          `${paymentMethod === 'upi' ? 'Pay with UPI' :
             paymentMethod === 'card' ? 'Pay with Card' :
             paymentMethod === 'netbanking' ? 'Pay with Net Banking' :
             'Pay with Wallet'} - ₹${booking.totalAmount}`
        )}
      </button>
    </form>
  );
}

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const authenticatedFetch = useAuthenticatedFetch();

  const [booking, setBooking] = useState<BookingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const bookingId = searchParams.get('bookingId');
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!bookingId) {
      router.push('/search');
      return;
    }

    fetchBookingData();
  }, [bookingId, isAuthenticated]);

  const fetchBookingData = async () => {
    try {
      setIsLoading(true);

      const response = await authenticatedFetch(`${API_BASE_URL}/api/bookings/${bookingId}`);
      const data = await response.json();

      if (data.success) {
        setBooking(data.data);
        
        // Check if booking is still valid for payment
        if (data.data.status !== 'PENDING') {
          setError('This booking is no longer available for payment');
        } else if (data.data.paymentStatus !== 'PENDING') {
          setError('Payment has already been processed for this booking');
        }
      } else {
        setError(data.message || 'Failed to load booking details');
      }
    } catch (err) {
      setError('Failed to load booking details');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Error</h2>
          <p className="text-gray-600 mb-8">{error || 'Booking not found'}</p>
          <button
            onClick={() => router.push('/search')}
            className="btn-primary"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back
            </button>
            <h1 className="text-2xl font-bold text-primary-600">TravelCircles</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Booking Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className="flex items-center text-green-600">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  ✓
                </div>
                <span className="ml-2 font-medium">Select Seats</span>
              </div>
              <div className="w-16 h-0.5 bg-green-600 mx-4"></div>
              <div className="flex items-center text-green-600">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  ✓
                </div>
                <span className="ml-2 font-medium">Passenger Details</span>
              </div>
              <div className="w-16 h-0.5 bg-green-600 mx-4"></div>
              <div className="flex items-center text-primary-600">
                <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <span className="ml-2 font-medium">Payment</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Elements stripe={stripePromise}>
              <PaymentForm booking={booking} />
            </Elements>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Booking Details */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking Reference:</span>
                    <span className="font-medium">{booking.bookingReference}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Route:</span>
                    <span className="font-medium">{booking.origin} → {booking.destination}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{new Date(booking.travelDate).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Departure:</span>
                    <span className="font-medium">{formatTime(booking.departureTime)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Passengers:</span>
                    <span className="font-medium">{booking.passengers.length}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Seats:</span>
                    <span className="font-medium">{booking.selectedSeats.length} selected</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold text-primary-600">₹{booking.totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Payment Timer */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center">
                  <ClockIcon className="h-5 w-5 text-yellow-600 mr-2" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-900">Complete Payment Soon</h4>
                    <p className="text-sm text-yellow-700">
                      Your seats are reserved for 30 minutes. Complete payment to confirm your booking.
                    </p>
                  </div>
                </div>
              </div>

              {/* Security Features */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Security Features</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                    <span>256-bit SSL encryption</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                    <span>PCI DSS compliant</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                    <span>Secure payment processing</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                    <span>Fraud protection</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
