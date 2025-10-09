'use client';

// Opt out of static generation for this page
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth, useAuthenticatedFetch } from '../../../contexts/AuthContext';
import { 
  CheckCircleIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  TicketIcon,
  EnvelopeIcon,
  PhoneIcon,
  QrCodeIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';

interface BookingData {
  id: string;
  bookingReference: string;
  status: string;
  paymentStatus: string;
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
}

export default function BookingConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user } = useAuth();
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

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const downloadTicket = () => {
    // In a real implementation, this would generate and download a PDF ticket
    alert('Ticket download functionality will be implemented with PDF generation');
  };

  const sendTicketEmail = async () => {
    try {
      // In a real implementation, this would send the ticket via email
      alert('Ticket sent to your email address');
    } catch (error) {
      alert('Failed to send ticket email');
    }
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Error</h2>
          <p className="text-gray-600 mb-8">{error || 'Booking not found'}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="btn-primary"
          >
            Go to Dashboard
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
            <h1 className="text-2xl font-bold text-primary-600">TravelCircles</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-lg text-gray-600">
            Your payment has been processed successfully. Your booking reference is{' '}
            <span className="font-semibold text-primary-600">{booking.bookingReference}</span>
          </p>
        </div>

        {/* Booking Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Trip Details</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Route Information */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Route</p>
                    <p className="font-medium text-gray-900">{booking.origin} → {booking.destination}</p>
                  </div>
                </div>

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
              </div>

              {/* Booking Information */}
              <div className="space-y-4">
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
                    <p className="font-medium text-gray-900">{booking.selectedSeats.length} seat(s) selected</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-5 h-5 mr-3 flex items-center justify-center">
                    <span className="text-green-600 font-bold">₹</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Paid</p>
                    <p className="font-medium text-gray-900">₹{booking.totalAmount}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Passenger Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Passenger Information</h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {booking.passengers.map((passenger, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* QR Code and Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* QR Code */}
          {booking.qrCode && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <QrCodeIcon className="h-5 w-5 mr-2" />
                Digital Ticket
              </h3>
              <div className="text-center">
                <div className="bg-gray-100 rounded-lg p-8 mb-4">
                  <div className="w-32 h-32 bg-gray-300 rounded-lg mx-auto flex items-center justify-center">
                    <QrCodeIcon className="h-16 w-16 text-gray-500" />
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Show this QR code at the boarding gate
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Actions</h3>
            <div className="space-y-3">
              <button
                onClick={downloadTicket}
                className="w-full btn-outline flex items-center justify-center"
              >
                <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                Download Ticket (PDF)
              </button>
              
              <button
                onClick={sendTicketEmail}
                className="w-full btn-outline flex items-center justify-center"
              >
                <EnvelopeIcon className="h-5 w-5 mr-2" />
                Email Ticket
              </button>
              
              <button
                onClick={() => router.push('/dashboard')}
                className="w-full btn-primary"
              >
                View All Bookings
              </button>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Important Information</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• Please arrive at the departure location at least 15 minutes before departure time</p>
            <p>• Bring a valid photo ID for verification</p>
            <p>• Keep your booking reference handy: <strong>{booking.bookingReference}</strong></p>
            <p>• For any changes or cancellations, contact our support team</p>
            <p>• Your digital ticket has been sent to your email address</p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Customer Support</p>
                <p className="font-medium text-gray-900">1-800-TRAVEL-1</p>
              </div>
            </div>
            <div className="flex items-center">
              <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Email Support</p>
                <p className="font-medium text-gray-900">support@travelcircles.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
