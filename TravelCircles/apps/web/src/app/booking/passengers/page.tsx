'use client';

// Opt out of static generation for this page
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth, useAuthenticatedFetch } from '../../../contexts/AuthContext';
import { 
  ArrowLeftIcon, 
  UserIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

interface PassengerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  ticketType: 'ADULT' | 'CHILD' | 'SENIOR' | 'STUDENT';
  seatNumber: string;
}

export default function PassengerDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const authenticatedFetch = useAuthenticatedFetch();

  const [passengers, setPassengers] = useState<PassengerData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const routeId = searchParams.get('routeId');
  const scheduleId = searchParams.get('scheduleId');
  const reservationId = searchParams.get('reservationId');
  const seats = searchParams.get('seats')?.split(',') || [];

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    if (!routeId || !scheduleId || !reservationId || seats.length === 0) {
      router.push('/search');
      return;
    }

    // Initialize passenger data
    const initialPassengers = seats.map((seat, index) => ({
      firstName: index === 0 ? user?.firstName || '' : '',
      lastName: index === 0 ? user?.lastName || '' : '',
      email: index === 0 ? user?.email || '' : '',
      phone: '',
      dateOfBirth: '',
      ticketType: 'ADULT' as const,
      seatNumber: `Seat ${index + 1}`, // Will be updated with actual seat numbers
    }));

    setPassengers(initialPassengers);
  }, [routeId, scheduleId, reservationId, seats, user]);

  const handlePassengerChange = (index: number, field: keyof PassengerData, value: string) => {
    setPassengers(prev => prev.map((passenger, i) => 
      i === index ? { ...passenger, [field]: value } : passenger
    ));

    // Clear error when user starts typing
    const errorKey = `${index}-${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    passengers.forEach((passenger, index) => {
      if (!passenger.firstName.trim()) {
        newErrors[`${index}-firstName`] = 'First name is required';
      }

      if (!passenger.lastName.trim()) {
        newErrors[`${index}-lastName`] = 'Last name is required';
      }

      if (!passenger.email.trim()) {
        newErrors[`${index}-email`] = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(passenger.email)) {
        newErrors[`${index}-email`] = 'Email is invalid';
      }

      if (!passenger.phone.trim()) {
        newErrors[`${index}-phone`] = 'Phone number is required';
      }

      if (!passenger.dateOfBirth) {
        newErrors[`${index}-dateOfBirth`] = 'Date of birth is required';
      } else {
        const birthDate = new Date(passenger.dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        if (age < 0 || age > 120) {
          newErrors[`${index}-dateOfBirth`] = 'Invalid date of birth';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const bookingData = {
        routeId,
        scheduleId,
        reservationId,
        passengers: passengers.map(passenger => ({
          firstName: passenger.firstName.trim(),
          lastName: passenger.lastName.trim(),
          email: passenger.email.trim(),
          phone: passenger.phone.trim(),
          dateOfBirth: passenger.dateOfBirth,
          ticketType: passenger.ticketType,
        })),
        selectedSeats: seats,
      };

      const response = await authenticatedFetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();

      if (data.success) {
        // Navigate to payment page
        router.push(`/booking/payment?bookingId=${data.data.id}`);
      } else {
        if (data.errors) {
          const fieldErrors: Record<string, string> = {};
          data.errors.forEach((error: any) => {
            fieldErrors[error.path || error.field] = error.msg || error.message;
          });
          setErrors(fieldErrors);
        } else {
          alert(data.message || 'Failed to create booking');
        }
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking');
    } finally {
      setIsLoading(false);
    }
  };

  const getTicketTypeOptions = () => [
    { value: 'ADULT', label: 'Adult (18+)' },
    { value: 'CHILD', label: 'Child (2-17)' },
    { value: 'SENIOR', label: 'Senior (65+)' },
    { value: 'STUDENT', label: 'Student' },
  ];

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
              <div className="flex items-center text-primary-600">
                <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <span className="ml-2 font-medium">Passenger Details</span>
              </div>
              <div className="w-16 h-0.5 bg-gray-300 mx-4"></div>
              <div className="flex items-center text-gray-400">
                <div className="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <span className="ml-2">Payment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Passenger Details Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Passenger Details</h2>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {passengers.map((passenger, index) => (
              <div key={index} className="border-b border-gray-200 pb-8 last:border-b-0">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <UserIcon className="h-5 w-5 mr-2" />
                  Passenger {index + 1} - {passenger.seatNumber}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={passenger.firstName}
                      onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                      className={`input ${errors[`${index}-firstName`] ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Enter first name"
                    />
                    {errors[`${index}-firstName`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`${index}-firstName`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={passenger.lastName}
                      onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                      className={`input ${errors[`${index}-lastName`] ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Enter last name"
                    />
                    {errors[`${index}-lastName`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`${index}-lastName`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={passenger.email}
                        onChange={(e) => handlePassengerChange(index, 'email', e.target.value)}
                        className={`input ${errors[`${index}-email`] ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="Enter email address"
                      />
                      <EnvelopeIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                    {errors[`${index}-email`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`${index}-email`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={passenger.phone}
                        onChange={(e) => handlePassengerChange(index, 'phone', e.target.value)}
                        className={`input ${errors[`${index}-phone`] ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                        placeholder="Enter phone number"
                      />
                      <PhoneIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                    {errors[`${index}-phone`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`${index}-phone`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      value={passenger.dateOfBirth}
                      onChange={(e) => handlePassengerChange(index, 'dateOfBirth', e.target.value)}
                      className={`input ${errors[`${index}-dateOfBirth`] ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                      max={new Date().toISOString().split('T')[0]}
                    />
                    {errors[`${index}-dateOfBirth`] && (
                      <p className="mt-1 text-sm text-red-600">{errors[`${index}-dateOfBirth`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ticket Type *
                    </label>
                    <select
                      value={passenger.ticketType}
                      onChange={(e) => handlePassengerChange(index, 'ticketType', e.target.value)}
                      className="input"
                    >
                      {getTicketTypeOptions().map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}

            {/* Form Actions */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.back()}
                className="btn-outline"
                disabled={isLoading}
              >
                Back to Seat Selection
              </button>
              
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Booking...
                  </div>
                ) : (
                  'Continue to Payment'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
