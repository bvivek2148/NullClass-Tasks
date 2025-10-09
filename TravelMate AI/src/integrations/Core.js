// Core integration utilities for TravelMate AI
export const Core = {
  // Mock API utilities
  api: {
    get: async (endpoint) => {
      console.log(`Mock GET request to: ${endpoint}`);
      // Return mock data based on endpoint
      if (endpoint.includes('/routes')) {
        return {
          data: [
            {
              origin: "Delhi",
              destination: "Mumbai", 
              duration: "2h 15m",
              distance: "1400 km",
              price: 8500,
              available_times: ["06:00", "14:30", "21:00"],
              vehicle_type: "flight"
            }
          ]
        };
      }
      return { data: [] };
    },
    
    post: async (endpoint, data) => {
      console.log(`Mock POST request to: ${endpoint}`, data);
      return { success: true, data };
    }
  },
  
  // Utility functions
  utils: {
    formatPrice: (price) => `₹${price.toLocaleString('en-IN')}`,
    formatDuration: (duration) => duration,
    formatDistance: (distance) => distance
  },
  
  // Configuration
  config: {
    apiBaseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
    environment: process.env.NODE_ENV || 'development'
  }
};

// Mock file upload function
export const UploadFile = async ({ file }) => {
  // Simulate file upload delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock file URL
  return {
    file_url: `https://example.com/uploads/${file.name}`,
    success: true
  };
};