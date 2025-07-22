'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth, useAuthenticatedFetch } from '../../../../contexts/AuthContext';
import { 
  ArrowLeftIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  TicketIcon,
  CreditCardIcon,
  QrCodeIcon,
  ArrowDownTrayIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface BookingDetails {
  id: string;
  bookingReference: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  totalAmount: number;
  passengers: any[];
  selectedSeats: string[];
  travelDate: string;
  departureTime: string;
  arrivalTime: string;
  origin: string;
  destination: string;
  qrCode?: string;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
}

export default function BookingDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAuth();
  const authenticatedFetch = useAuthenticatedFetch();

  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  const bookingId = params.id as string;
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!bookingId) {
      router.push('/dashboard');
      return;
    }

    fetchBookingDetails();
  }, [bookingId, isAuthenticated]);

  const fetchBookingDetails = async () => {
    try {
      setIsLoading(true);

      const response = await authenticatedFetch(`${API_BASE_URL}/api/bookings/${bookingId}`);
      const data = await response.json();

      if (data.success) {
        setBooking(data.data);
      } else {
        setError(data.message || 'Failed to load booking details');
      }
    } catch (err) {
      setError('Failed to load booking details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!booking || !cancelReason.trim()) return;

    try {
      setIsCancelling(true);

      const response = await authenticatedFetch(`${API_BASE_URL}/api/bookings/${booking.id}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason: cancelReason,
        }),
      });

      if (response.ok) {
        alert('Booking cancelled successfully');
        setShowCancelModal(false);
        fetchBookingDetails(); // Refresh booking details
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking');
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircleIcon className="h-5 w-5" />;
      case 'PENDING':
        return <ClockIcon className="h-5 w-5" />;
      case 'CANCELLED':
        return <XCircleIcon className="h-5 w-5" />;
      case 'COMPLETED':
        return <CheckCircleIcon className="h-5 w-5" />;
      default:
        return <ClockIcon className="h-5 w-5" />;
    }
  };

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const canCancelBooking = () => {
    if (!booking) return false;
    
    const travelDate = new Date(booking.travelDate);
    const now = new Date();
    const hoursUntilTravel = (travelDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    return booking.status === 'CONFIRMED' && hoursUntilTravel > 24;
  };

  const canCompletePayment = () => {
    if (!booking) return false;
    
    return booking.status === 'PENDING' && booking.paymentStatus === 'PENDING';
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h2>
          <p className="text-gray-600 mb-8">{error || 'The booking you requested could not be found.'}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="btn-primary"
          >
            Back to Dashboard
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
              onClick={() => router.push('/dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-primary-600">TravelCircles</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Booking Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {booking.origin} → {booking.destination}
              </h1>
              <p className="text-gray-600">
                Booking Reference: <span className="font-medium">{booking.bookingReference}</span>
              </p>
            </div>
            <div className="text-right">
              <div className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                {getStatusIcon(booking.status)}
                <span className="ml-2">{booking.status}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                ₹{booking.totalAmount}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {canCompletePayment() && (
              <button
                onClick={() => router.push(`/booking/payment?bookingId=${booking.id}`)}
                className="btn-primary"
              >
                Complete Payment
              </button>
            )}
            
            {booking.qrCode && (
              <button className="btn-outline flex items-center gap-2">
                <ArrowDownTrayIcon className="h-4 w-4" />
                Download Ticket
              </button>
            )}
            
            <button className="btn-outline flex items-center gap-2">
              <EnvelopeIcon className="h-4 w-4" />
              Email Ticket
            </button>
            
            {canCancelBooking() && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="btn-outline text-red-600 border-red-300 hover:bg-red-50"
              >
                Cancel Booking
              </button>
            )}
          </div>

          {/* Status Messages */}
          {booking.status === 'PENDING' && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-900">Payment Required</h4>
                  <p className="text-sm text-yellow-700">
                    Complete your payment to confirm this booking. Your seats are reserved temporarily.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Trip Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Trip Information</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Travel Date</p>
                  <p className="font-medium text-gray-900">{formatDate(booking.travelDate)}</p>
                </div>
              </div>

              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Departure Time</p>
                  <p className="font-medium text-gray-900">{formatTime(booking.departureTime)}</p>
                </div>
              </div>

              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Arrival Time</p>
                  <p className="font-medium text-gray-900">{formatTime(booking.arrivalTime)}</p>
                </div>
              </div>

              <div className="flex items-center">
                <UserGroupIcon className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Passengers</p>
                  <p className="font-medium text-gray-900">{booking.passengers.length} passenger(s)</p>
                </div>
              </div>

              <div className="flex items-center">
                <TicketIcon className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Seats</p>
                  <p className="font-medium text-gray-900">{booking.selectedSeats.length} seat(s)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <CreditCardIcon className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <p className={`font-medium ${
                    booking.paymentStatus === 'PAID' ? 'text-green-600' :
                    booking.paymentStatus === 'PENDING' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {booking.paymentStatus}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Amount</span>
                  <span className="text-lg font-semibold text-gray-900">₹{booking.totalAmount}</span>
                </div>
              </div>
            </div>

            {booking.qrCode && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <QrCodeIcon className="h-4 w-4 mr-2" />
                  Digital Ticket
                </h3>
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <div className="w-24 h-24 bg-gray-300 rounded-lg mx-auto flex items-center justify-center">
                    <QrCodeIcon className="h-12 w-12 text-gray-500" />
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Show at boarding gate
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Passenger Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Passenger Details</h2>
          <div className="space-y-4">
            {booking.passengers.map((passenger, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium text-gray-900">
                      {passenger.firstName} {passenger.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Seat</p>
                    <p className="font-medium text-gray-900">{passenger.seatNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ticket Type</p>
                    <p className="font-medium text-gray-900">{passenger.ticketType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Price</p>
                    <p className="font-medium text-gray-900">₹{passenger.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cancel Booking Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Cancel Booking
              </h3>
              
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to cancel this booking? This action cannot be undone.
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cancellation Reason *
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="input"
                  rows={3}
                  placeholder="Please provide a reason for cancellation..."
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setCancelReason('');
                  }}
                  className="btn-outline"
                  disabled={isCancelling}
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleCancelBooking}
                  disabled={!cancelReason.trim() || isCancelling}
                  className="btn-primary bg-red-600 hover:bg-red-700"
                >
                  {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
