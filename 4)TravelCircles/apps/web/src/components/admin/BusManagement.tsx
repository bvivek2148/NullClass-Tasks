'use client';

import { useState, useEffect } from 'react';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  WrenchScrewdriverIcon,
  TruckIcon,
  ChartBarIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useAuthenticatedFetch } from '../../contexts/AuthContext';
import BusCreateForm from './BusCreateForm';

interface Bus {
  id: string;
  number: string;
  capacity: number;
  busType: 'STANDARD' | 'PREMIUM' | 'LUXURY';
  manufacturer: string;
  model: string;
  year: number;
  licensePlate: string;
  amenities: string[];
  maintenanceStatus: 'ACTIVE' | 'MAINTENANCE' | 'OUT_OF_SERVICE';
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  mileage: number;
  fuelType: 'DIESEL' | 'ELECTRIC' | 'HYBRID';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BusAnalytics {
  totalBuses: number;
  activeBuses: number;
  maintenanceBuses: number;
  averageCapacity: number;
  totalCapacity: number;
  busTypeDistribution: Record<string, number>;
  utilizationRate: number;
}

export default function BusManagement() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [analytics, setAnalytics] = useState<BusAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState({
    busType: '',
    maintenanceStatus: '',
    sortBy: 'number',
  });

  const authenticatedFetch = useAuthenticatedFetch();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchBuses();
    fetchAnalytics();
  }, [filters]);

  const fetchBuses = async () => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        ...filters,
        limit: '50',
        offset: '0',
      });

      const response = await authenticatedFetch(`${API_BASE_URL}/api/buses?${queryParams}`);
      const data = await response.json();

      if (data.success) {
        setBuses(data.data.buses);
      }
    } catch (error) {
      console.error('Error fetching buses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/api/buses/analytics/overview`);
      const data = await response.json();

      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const handleDeleteBus = async (busId: string) => {
    if (!confirm('Are you sure you want to delete this bus?')) return;

    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/api/buses/${busId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBuses(buses.filter(bus => bus.id !== busId));
        alert('Bus deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting bus:', error);
      alert('Failed to delete bus');
    }
  };

  const getBusTypeColor = (type: string) => {
    switch (type) {
      case 'LUXURY':
        return 'bg-purple-100 text-purple-800';
      case 'PREMIUM':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMaintenanceStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'MAINTENANCE':
        return 'bg-yellow-100 text-yellow-800';
      case 'OUT_OF_SERVICE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Bus Fleet Management</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Add New Bus
        </button>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full">
                <TruckIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Buses</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalBuses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <ChartBarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Buses</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.activeBuses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-full">
                <WrenchScrewdriverIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Maintenance</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.maintenanceBuses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <TruckIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Capacity</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalCapacity}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bus Type
            </label>
            <select
              value={filters.busType}
              onChange={(e) => setFilters({ ...filters, busType: e.target.value })}
              className="input"
            >
              <option value="">All Types</option>
              <option value="STANDARD">Standard</option>
              <option value="PREMIUM">Premium</option>
              <option value="LUXURY">Luxury</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maintenance Status
            </label>
            <select
              value={filters.maintenanceStatus}
              onChange={(e) => setFilters({ ...filters, maintenanceStatus: e.target.value })}
              className="input"
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="OUT_OF_SERVICE">Out of Service</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
              className="input"
            >
              <option value="number">Bus Number</option>
              <option value="capacity">Capacity</option>
              <option value="year">Year</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={fetchBuses}
              className="btn-outline w-full"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Bus List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Fleet Overview ({buses.length} buses)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bus Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type & Capacity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Maintenance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {buses.map((bus) => (
                <tr key={bus.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {bus.number}
                      </div>
                      <div className="text-sm text-gray-500">
                        {bus.manufacturer} {bus.model} ({bus.year})
                      </div>
                      <div className="text-sm text-gray-500">
                        {bus.licensePlate}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBusTypeColor(bus.busType)}`}>
                        {bus.busType}
                      </span>
                      <div className="text-sm text-gray-500 mt-1">
                        {bus.capacity} seats
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMaintenanceStatusColor(bus.maintenanceStatus)}`}>
                      {bus.maintenanceStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      Last: {new Date(bus.lastMaintenanceDate).toLocaleDateString()}
                    </div>
                    <div>
                      Next: {new Date(bus.nextMaintenanceDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedBus(bus)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {/* Edit functionality */}}
                        className="text-green-600 hover:text-green-900"
                        title="Edit Bus"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBus(bus.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Bus"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {buses.length === 0 && (
          <div className="text-center py-12">
            <TruckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No buses found</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first bus to the fleet.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              Add New Bus
            </button>
          </div>
        )}
      </div>

      {/* Create Bus Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Bus</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <BusCreateForm
              onSuccess={(newBus) => {
                setBuses([...buses, newBus]);
                setShowCreateModal(false);
                fetchAnalytics(); // Refresh analytics
              }}
              onCancel={() => setShowCreateModal(false)}
            />
          </div>
        </div>
      )}

      {/* Bus Details Modal */}
      {selectedBus && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Bus Details - {selectedBus.number}
              </h3>
              <button
                onClick={() => setSelectedBus(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Basic Information</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Number:</span> {selectedBus.number}</div>
                  <div><span className="font-medium">Type:</span> {selectedBus.busType}</div>
                  <div><span className="font-medium">Capacity:</span> {selectedBus.capacity} seats</div>
                  <div><span className="font-medium">Manufacturer:</span> {selectedBus.manufacturer}</div>
                  <div><span className="font-medium">Model:</span> {selectedBus.model}</div>
                  <div><span className="font-medium">Year:</span> {selectedBus.year}</div>
                  <div><span className="font-medium">License Plate:</span> {selectedBus.licensePlate}</div>
                  <div><span className="font-medium">Fuel Type:</span> {selectedBus.fuelType}</div>
                  <div><span className="font-medium">Mileage:</span> {selectedBus.mileage.toLocaleString()} miles</div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Status & Maintenance</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Status:</span>
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getMaintenanceStatusColor(selectedBus.maintenanceStatus)}`}>
                      {selectedBus.maintenanceStatus}
                    </span>
                  </div>
                  <div><span className="font-medium">Last Maintenance:</span> {new Date(selectedBus.lastMaintenanceDate).toLocaleDateString()}</div>
                  <div><span className="font-medium">Next Maintenance:</span> {new Date(selectedBus.nextMaintenanceDate).toLocaleDateString()}</div>
                </div>

                <h4 className="font-medium text-gray-900 mb-3 mt-6">Amenities</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedBus.amenities.map((amenity, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
