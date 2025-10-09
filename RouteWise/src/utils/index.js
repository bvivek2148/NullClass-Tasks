// Utility functions for RouteWise application

// Create page URLs for routing
export const createPageUrl = (pageName) => {
  const routes = {
    Home: '/',
    RoutePlanner: '/planner',
    MyTrips: '/trips',
    Analytics: '/analytics',
    SharedRoutes: '/shared',
    Profile: '/profile'
  };
  return routes[pageName] || '/';
};

// Format distance in meters to human-readable format
export const formatDistance = (distance) => {
  if (!distance || distance === 0) return '0 m';
  if (distance < 1000) {
    return `${Math.round(distance)} m`;
  }
  return `${(distance / 1000).toFixed(1)} km`;
};

// Format duration in seconds to human-readable format
export const formatDuration = (duration) => {
  if (!duration || duration === 0) return '0 min';
  
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

// Format cost in INR
export const formatCurrency = (amount, currency = 'INR') => {
  if (!amount || amount === 0) return '₹0';
  
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency === 'INR' ? 'INR' : 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
  
  return formatted;
};

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Debounce function for search inputs
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Get status color classes
export const getStatusColor = (status) => {
  const colors = {
    completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
    planned: 'bg-purple-100 text-purple-800 border-purple-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
    draft: 'bg-slate-100 text-slate-800 border-slate-200',
    saved: 'bg-blue-100 text-blue-800 border-blue-200'
  };
  return colors[status] || colors.draft;
};

// Get priority color classes
export const getPriorityColor = (priority) => {
  const colors = {
    low: 'bg-slate-100 text-slate-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800',
    critical: 'bg-red-200 text-red-900'
  };
  return colors[priority] || colors.medium;
};

// Calculate route efficiency score
export const calculateEfficiencyScore = (route) => {
  if (!route) return 0;
  
  // Mock calculation based on distance, time, and cost
  const distanceScore = Math.min(100, (route.distance / 1000) * 2);
  const timeScore = Math.min(100, (route.duration / 60) * 1.5);
  const costScore = route.estimated_cost ? Math.min(100, route.estimated_cost * 0.1) : 50;
  
  return Math.round((distanceScore + timeScore + costScore) / 3);
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate Indian phone number
export const isValidIndianPhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

// Format Indian phone number
export const formatIndianPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
};

// Get Indian state from coordinates (mock implementation)
export const getIndianState = (lat, lng) => {
  // Mock mapping - in real app, use reverse geocoding API
  const states = [
    { name: 'Maharashtra', center: [19.7515, 75.7139] },
    { name: 'Delhi', center: [28.7041, 77.1025] },
    { name: 'Karnataka', center: [15.3173, 75.7139] },
    { name: 'West Bengal', center: [22.9868, 87.8550] },
    { name: 'Tamil Nadu', center: [11.1271, 78.6569] }
  ];
  
  // Find closest state (simplified)
  let closest = states[0];
  let minDistance = Infinity;
  
  states.forEach(state => {
    const distance = Math.sqrt(
      Math.pow(lat - state.center[0], 2) + 
      Math.pow(lng - state.center[1], 2)
    );
    if (distance < minDistance) {
      minDistance = distance;
      closest = state;
    }
  });
  
  return closest.name;
};

// Storage utilities
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return false;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }
};

// Date utilities
export const dateUtils = {
  formatDate: (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  },
  
  formatDateTime: (date) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  },
  
  isToday: (date) => {
    const today = new Date();
    const checkDate = new Date(date);
    return today.toDateString() === checkDate.toDateString();
  },
  
  isTomorrow: (date) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const checkDate = new Date(date);
    return tomorrow.toDateString() === checkDate.toDateString();
  }
};