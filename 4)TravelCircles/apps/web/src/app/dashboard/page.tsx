'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useAuthenticatedFetch } from '../../contexts/AuthContext';
import {
  TicketIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  CreditCardIcon,
  UserIcon,
  ChevronRightIcon,
  PlusIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface BookingSummary {
  id: string;
  bookingReference: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  totalAmount: number;
  passengers: any[];
  travelDate: string;
  departureTime: string;
  origin: string;
  destination: string;
  createdAt: string;
}

interface DashboardStats {
  totalBookings: number;
  upcomingTrips: number;
  completedTrips: number;
  totalSpent: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const authenticatedFetch = useAuthenticatedFetch();

  const [bookings, setBookings] = useState<BookingSummary[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'all'>('upcoming');

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchDashboardData();
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      // Fetch bookings
      const bookingsResponse = await authenticatedFetch(`${API_BASE_URL}/api/bookings?limit=50`);
      const bookingsData = await bookingsResponse.json();

      if (bookingsData.success) {
        setBookings(bookingsData.data.bookings);
        calculateStats(bookingsData.data.bookings);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (bookings: BookingSummary[]) => {
    const now = new Date();
    const upcomingTrips = bookings.filter(booking =>
      new Date(booking.travelDate) >= now && booking.status === 'CONFIRMED'
    ).length;

    const completedTrips = bookings.filter(booking =>
      booking.status === 'COMPLETED' ||
      (new Date(booking.travelDate) < now && booking.status === 'CONFIRMED')
    ).length;

    const totalSpent = bookings
      .filter(booking => booking.paymentStatus === 'PAID')
      .reduce((sum, booking) => sum + booking.totalAmount, 0);

    setStats({
      totalBookings: bookings.length,
      upcomingTrips,
      completedTrips,
      totalSpent,
    });
  };

  const getFilteredBookings = () => {
    const now = new Date();

    switch (activeTab) {
      case 'upcoming':
        return bookings.filter(booking =>
          new Date(booking.travelDate) >= now &&
          ['CONFIRMED', 'PENDING'].includes(booking.status)
        );
      case 'past':
        return bookings.filter(booking =>
          new Date(booking.travelDate) < now ||
          ['COMPLETED', 'CANCELLED'].includes(booking.status)
        );
      default:
        return bookings;
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
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-primary-600">TravelCircles</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/search')}
                className="btn-primary flex items-center gap-2"
              >
                <PlusIcon className="h-5 w-5" />
                Book New Trip
              </button>
              <div className="flex items-center space-x-2">
                <UserIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-700">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="btn-outline text-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName}!
          </h2>
          <p className="text-gray-600">
            Manage your bookings, view trip history, and plan your next journey.
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-full">
                  <TicketIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-full">
                  <CalendarIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Upcoming Trips</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.upcomingTrips}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-full">
                  <ClockIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed Trips</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedTrips}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <CreditCardIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.totalSpent.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bookings Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">My Bookings</h3>

              {/* Tab Navigation */}
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${
                    activeTab === 'upcoming'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setActiveTab('past')}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${
                    activeTab === 'past'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Past
                </button>
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1 text-sm font-medium rounded-md ${
                    activeTab === 'all'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All
                </button>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {getFilteredBookings().map((booking) => (
              <div
                key={booking.id}
                className="p-6 hover:bg-gray-50 cursor-pointer"
                onClick={() => router.push(`/dashboard/bookings/${booking.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <h4 className="text-lg font-medium text-gray-900">
                          {booking.origin} → {booking.destination}
                        </h4>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          ${booking.totalAmount}
                        </p>
                        <p className="text-sm text-gray-500">
                          {booking.passengers.length} passenger(s)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {formatDate(booking.travelDate)}
                      </div>
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {formatTime(booking.departureTime)}
                      </div>
                      <div className="flex items-center">
                        <TicketIcon className="h-4 w-4 mr-1" />
                        {booking.bookingReference}
                      </div>
                    </div>

                    {booking.status === 'PENDING' && (
                      <div className="mt-2 flex items-center text-sm text-yellow-600">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                        Payment pending - Complete payment to confirm booking
                      </div>
                    )}
                  </div>

                  <ChevronRightIcon className="h-5 w-5 text-gray-400 ml-4" />
                </div>
              </div>
            ))}
          </div>

          {getFilteredBookings().length === 0 && (
            <div className="text-center py-12">
              <TicketIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeTab === 'upcoming' ? 'No upcoming trips' :
                 activeTab === 'past' ? 'No past trips' : 'No bookings found'}
              </h3>
              <p className="text-gray-600 mb-4">
                {activeTab === 'upcoming'
                  ? 'Book your next adventure to see it here.'
                  : 'Your booking history will appear here.'}
              </p>
              {activeTab === 'upcoming' && (
                <button
                  onClick={() => router.push('/search')}
                  className="btn-primary"
                >
                  Book Your First Trip
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
