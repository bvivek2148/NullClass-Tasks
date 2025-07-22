'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  StarIcon,
  ArrowRightIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

interface Route {
  id: string;
  origin: string;
  destination: string;
  duration: string;
  price: number;
  rating: number;
  reviews: number;
  frequency: string;
  amenities: string[];
  distance: string;
  popular: boolean;
}

const mockRoutes: Route[] = [
  {
    id: '1',
    origin: 'Mumbai',
    destination: 'Pune',
    duration: '3h 30m',
    price: 350,
    rating: 4.8,
    reviews: 234,
    frequency: 'Every 30 minutes',
    amenities: ['WiFi', 'Power Outlets', 'AC', 'Restroom'],
    distance: '148 km',
    popular: true
  },
  {
    id: '2',
    origin: 'Delhi',
    destination: 'Jaipur',
    duration: '5h 45m',
    price: 450,
    rating: 4.6,
    reviews: 189,
    frequency: 'Every 2 hours',
    amenities: ['WiFi', 'Power Outlets', 'AC', 'Restroom', 'Entertainment'],
    distance: '280 km',
    popular: true
  },
  {
    id: '3',
    origin: 'Bangalore',
    destination: 'Chennai',
    duration: '6h 15m',
    price: 520,
    rating: 4.5,
    reviews: 156,
    frequency: 'Every 3 hours',
    amenities: ['WiFi', 'Power Outlets', 'AC'],
    distance: '346 km',
    popular: false
  },
  {
    id: '4',
    origin: 'Hyderabad',
    destination: 'Vijayawada',
    duration: '4h 45m',
    price: 380,
    rating: 4.7,
    reviews: 298,
    frequency: 'Every 1.5 hours',
    amenities: ['WiFi', 'Power Outlets', 'AC', 'Restroom'],
    distance: '275 km',
    popular: true
  },
  {
    id: '5',
    origin: 'Kolkata',
    destination: 'Bhubaneswar',
    duration: '6h 20m',
    price: 420,
    rating: 4.4,
    reviews: 167,
    frequency: 'Every 4 hours',
    amenities: ['WiFi', 'Power Outlets', 'AC'],
    distance: '442 km',
    popular: false
  },
  {
    id: '6',
    origin: 'Ahmedabad',
    destination: 'Udaipur',
    duration: '4h 10m',
    price: 320,
    rating: 4.9,
    reviews: 89,
    frequency: 'Daily',
    amenities: ['WiFi', 'Power Outlets', 'AC', 'Restroom', 'Scenic Views'],
    distance: '262 km',
    popular: false
  },
  {
    id: '7',
    origin: 'Chennai',
    destination: 'Coimbatore',
    duration: '7h 30m',
    price: 480,
    rating: 4.3,
    reviews: 156,
    frequency: 'Every 3 hours',
    amenities: ['WiFi', 'Power Outlets', 'AC', 'Restroom'],
    distance: '507 km',
    popular: false
  },
  {
    id: '8',
    origin: 'Kochi',
    destination: 'Trivandrum',
    duration: '4h 45m',
    price: 380,
    rating: 4.6,
    reviews: 203,
    frequency: 'Every 2 hours',
    amenities: ['WiFi', 'Power Outlets', 'AC', 'Restroom', 'Entertainment'],
    distance: '215 km',
    popular: true
  },
  {
    id: '9',
    origin: 'Goa',
    destination: 'Mumbai',
    duration: '12h 30m',
    price: 750,
    rating: 4.4,
    reviews: 178,
    frequency: 'Daily',
    amenities: ['WiFi', 'Power Outlets', 'AC', 'Restroom', 'Entertainment', 'Sleeper'],
    distance: '597 km',
    popular: true
  }
];

export default function RoutesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [visibleRoutes, setVisibleRoutes] = useState(4);
  const [loading, setLoading] = useState(false);

  const filteredRoutes = mockRoutes
    .filter(route =>
      route.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.destination.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'duration':
          return parseFloat(a.duration) - parseFloat(b.duration);
        case 'rating':
          return b.rating - a.rating;
        default:
          return b.popular ? 1 : -1;
      }
    });

  const displayedRoutes = filteredRoutes.slice(0, visibleRoutes);
  const hasMoreRoutes = visibleRoutes < filteredRoutes.length;

  const loadMoreRoutes = () => {
    setLoading(true);
    setTimeout(() => {
      setVisibleRoutes(prev => prev + 4);
      setLoading(false);
    }, 500);
  };

  const handleRequestNewRoute = () => {
    alert('Thank you for your interest! Please contact our support team at support@travelcircles.com with your route request. We\'ll review it and add popular routes to our network.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center group">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent group-hover:from-primary-700 group-hover:to-primary-800 transition-all duration-300">
                TravelCircles
              </h1>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/routes" className="relative text-primary-600 font-semibold">
                Routes
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-full"></div>
              </Link>
              <Link href="/community" className="text-gray-600 hover:text-primary-600 font-medium transition-colors duration-200">Community</Link>
              <Link href="/tips" className="text-gray-600 hover:text-primary-600 font-medium transition-colors duration-200">Tips</Link>
              <Link href="/login" className="text-gray-600 hover:text-primary-600 font-medium transition-colors duration-200">Login</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-16">
          <div className="animate-fade-in-up">
            <span className="inline-block px-4 py-2 bg-primary-100 text-primary-600 rounded-full text-sm font-semibold mb-4">
              Explore Routes
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Popular Bus Routes
              <span className="block text-primary-600">Across India</span>
            </h1>
          </div>
          <div className="animate-fade-in-up animation-delay-200">
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover the best bus routes across India with comfortable travel, competitive prices, and reliable service.
              Book your journey today and travel with confidence.
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search routes by city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="popular">Most Popular</option>
                <option value="price">Lowest Price</option>
                <option value="duration">Shortest Duration</option>
                <option value="rating">Highest Rated</option>
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
              >
                <FunnelIcon className="h-5 w-5 mr-2" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border text-center">
            <p className="text-3xl font-bold text-primary-600">{mockRoutes.length}</p>
            <p className="text-gray-600">Available Routes</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border text-center">
            <p className="text-3xl font-bold text-green-600">50+</p>
            <p className="text-gray-600">Cities Connected</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border text-center">
            <p className="text-3xl font-bold text-blue-600">4.6</p>
            <p className="text-gray-600">Average Rating</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border text-center">
            <p className="text-3xl font-bold text-purple-600">24/7</p>
            <p className="text-gray-600">Customer Support</p>
          </div>
        </div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {displayedRoutes.map((route, index) => (
            <div key={route.id} className={`group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up`} style={{animationDelay: `${index * 100}ms`}}>
              <div className="p-8 relative">
                {route.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-bl-2xl rounded-tr-2xl">
                    <span className="text-sm font-bold">🔥 Popular</span>
                  </div>
                )}
                {/* Route Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-lg font-semibold text-gray-900">{route.origin}</div>
                    <ArrowRightIcon className="h-5 w-5 text-gray-400" />
                    <div className="text-lg font-semibold text-gray-900">{route.destination}</div>
                  </div>
                  {route.popular && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      Popular
                    </span>
                  )}
                </div>

                {/* Route Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    {route.duration}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    {route.distance}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                    From ₹{route.price}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <StarIcon className="h-4 w-4 mr-2 fill-current text-yellow-400" />
                    {route.rating} ({route.reviews} reviews)
                  </div>
                </div>

                {/* Frequency */}
                <div className="mb-4">
                  <span className="text-sm text-gray-600">Frequency: </span>
                  <span className="text-sm font-medium text-gray-900">{route.frequency}</span>
                </div>

                {/* Amenities */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {route.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Link
                    href={`/routes/${route.id}`}
                    className="flex-1 bg-primary-600 text-white text-center py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    View Details
                  </Link>
                  <Link
                    href={`/routes/${route.id}`}
                    className="flex-1 border border-primary-600 text-primary-600 text-center py-2 px-4 rounded-lg hover:bg-primary-50 transition-colors font-medium"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        {hasMoreRoutes && (
          <div className="text-center mt-8">
            <button
              onClick={loadMoreRoutes}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Load More Routes'}
            </button>
          </div>
        )}

        {!hasMoreRoutes && filteredRoutes.length > 4 && (
          <div className="text-center mt-8 text-gray-500">
            <p>You've seen all available routes!</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-primary-600 rounded-lg p-8 mt-12 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Can't Find Your Route?</h2>
          <p className="text-primary-100 mb-6">
            We're constantly adding new routes. Let us know where you'd like to travel!
          </p>
          <button
            onClick={handleRequestNewRoute}
            className="bg-white text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Request New Route
          </button>
        </div>
      </div>
    </div>
  );
}
