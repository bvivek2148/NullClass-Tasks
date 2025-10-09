'use client';

import { useState } from 'react';
import { useAuthenticatedFetch } from '../../contexts/AuthContext';

interface BusFormData {
  number: string;
  capacity: number;
  busType: 'STANDARD' | 'PREMIUM' | 'LUXURY';
  manufacturer: string;
  model: string;
  year: number;
  licensePlate: string;
  fuelType: 'DIESEL' | 'ELECTRIC' | 'HYBRID';
  amenities: string[];
  mileage: number;
}

interface BusCreateFormProps {
  onSuccess: (bus: any) => void;
  onCancel: () => void;
}

export default function BusCreateForm({ onSuccess, onCancel }: BusCreateFormProps) {
  const [formData, setFormData] = useState<BusFormData>({
    number: '',
    capacity: 40,
    busType: 'STANDARD',
    manufacturer: '',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    fuelType: 'DIESEL',
    amenities: [],
    mileage: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const authenticatedFetch = useAuthenticatedFetch();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const availableAmenities = [
    'WiFi',
    'Power Outlets',
    'Air Conditioning',
    'Restroom',
    'Entertainment System',
    'Reclining Seats',
    'Reading Lights',
    'USB Charging',
    'Wheelchair Accessible',
    'Food Service',
  ];

  const handleInputChange = (field: keyof BusFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.number.trim()) {
      newErrors.number = 'Bus number is required';
    }

    if (formData.capacity < 10 || formData.capacity > 100) {
      newErrors.capacity = 'Capacity must be between 10 and 100';
    }

    if (!formData.manufacturer.trim()) {
      newErrors.manufacturer = 'Manufacturer is required';
    }

    if (!formData.model.trim()) {
      newErrors.model = 'Model is required';
    }

    if (formData.year < 2000 || formData.year > new Date().getFullYear() + 1) {
      newErrors.year = 'Invalid year';
    }

    if (!formData.licensePlate.trim()) {
      newErrors.licensePlate = 'License plate is required';
    }

    if (formData.mileage < 0) {
      newErrors.mileage = 'Mileage cannot be negative';
    }

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
      const response = await authenticatedFetch(`${API_BASE_URL}/api/buses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        onSuccess(data.data);
      } else {
        if (data.errors) {
          const fieldErrors: Record<string, string> = {};
          data.errors.forEach((error: any) => {
            fieldErrors[error.path || error.field] = error.msg || error.message;
          });
          setErrors(fieldErrors);
        } else {
          alert(data.message || 'Failed to create bus');
        }
      }
    } catch (error) {
      console.error('Error creating bus:', error);
      alert('Failed to create bus');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bus Number *
            </label>
            <input
              type="text"
              value={formData.number}
              onChange={(e) => handleInputChange('number', e.target.value)}
              className={`input ${errors.number ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="e.g., TC-001"
            />
            {errors.number && (
              <p className="mt-1 text-sm text-red-600">{errors.number}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacity *
            </label>
            <input
              type="number"
              min="10"
              max="100"
              value={formData.capacity}
              onChange={(e) => handleInputChange('capacity', parseInt(e.target.value))}
              className={`input ${errors.capacity ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
            />
            {errors.capacity && (
              <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bus Type *
            </label>
            <select
              value={formData.busType}
              onChange={(e) => handleInputChange('busType', e.target.value)}
              className="input"
            >
              <option value="STANDARD">Standard</option>
              <option value="PREMIUM">Premium</option>
              <option value="LUXURY">Luxury</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fuel Type *
            </label>
            <select
              value={formData.fuelType}
              onChange={(e) => handleInputChange('fuelType', e.target.value)}
              className="input"
            >
              <option value="DIESEL">Diesel</option>
              <option value="ELECTRIC">Electric</option>
              <option value="HYBRID">Hybrid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vehicle Details */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">Vehicle Details</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Manufacturer *
            </label>
            <input
              type="text"
              value={formData.manufacturer}
              onChange={(e) => handleInputChange('manufacturer', e.target.value)}
              className={`input ${errors.manufacturer ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="e.g., Volvo"
            />
            {errors.manufacturer && (
              <p className="mt-1 text-sm text-red-600">{errors.manufacturer}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Model *
            </label>
            <input
              type="text"
              value={formData.model}
              onChange={(e) => handleInputChange('model', e.target.value)}
              className={`input ${errors.model ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="e.g., B11R"
            />
            {errors.model && (
              <p className="mt-1 text-sm text-red-600">{errors.model}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year *
            </label>
            <input
              type="number"
              min="2000"
              max={new Date().getFullYear() + 1}
              value={formData.year}
              onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
              className={`input ${errors.year ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
            />
            {errors.year && (
              <p className="mt-1 text-sm text-red-600">{errors.year}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              License Plate *
            </label>
            <input
              type="text"
              value={formData.licensePlate}
              onChange={(e) => handleInputChange('licensePlate', e.target.value.toUpperCase())}
              className={`input ${errors.licensePlate ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="e.g., ABC-1234"
            />
            {errors.licensePlate && (
              <p className="mt-1 text-sm text-red-600">{errors.licensePlate}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Mileage
            </label>
            <input
              type="number"
              min="0"
              value={formData.mileage}
              onChange={(e) => handleInputChange('mileage', parseInt(e.target.value) || 0)}
              className={`input ${errors.mileage ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
              placeholder="0"
            />
            {errors.mileage && (
              <p className="mt-1 text-sm text-red-600">{errors.mileage}</p>
            )}
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">Amenities</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {availableAmenities.map((amenity) => (
            <label key={amenity} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.amenities.includes(amenity)}
                onChange={() => handleAmenityToggle(amenity)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{amenity}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="btn-outline"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Creating...
            </div>
          ) : (
            'Create Bus'
          )}
        </button>
      </div>
    </form>
  );
}
