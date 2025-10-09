#!/usr/bin/env node

/**
 * TravelCircles Platform Test Script
 * 
 * This script tests the main functionality of the TravelCircles platform
 * to ensure all components are working correctly.
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3001';
const WEB_BASE_URL = 'http://localhost:3000';

// Test configuration
const testUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  password: 'password123'
};

let authToken = '';
let testBookingId = '';

// Helper function to make authenticated requests
const authenticatedRequest = (config) => {
  return axios({
    ...config,
    headers: {
      ...config.headers,
      'Authorization': `Bearer ${authToken}`
    }
  });
};

// Test functions
async function testAPIHealth() {
  console.log('🔍 Testing API Health...');
  try {
    const response = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ API Health Check:', response.data);
    return true;
  } catch (error) {
    console.log('❌ API Health Check Failed:', error.message);
    return false;
  }
}

async function testUserRegistration() {
  console.log('🔍 Testing User Registration...');
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/register`, testUser);
    console.log('✅ User Registration:', response.data.success);
    authToken = response.data.data.token;
    return true;
  } catch (error) {
    console.log('❌ User Registration Failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testUserLogin() {
  console.log('🔍 Testing User Login...');
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ User Login:', response.data.success);
    authToken = response.data.data.token;
    return true;
  } catch (error) {
    console.log('❌ User Login Failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testRouteSearch() {
  console.log('🔍 Testing Route Search...');
  try {
    const response = await axios.get(`${API_BASE_URL}/api/routes?origin=New York&destination=Boston`);
    console.log('✅ Route Search:', response.data.success, `- Found ${response.data.data.routes.length} routes`);
    return response.data.data.routes.length > 0;
  } catch (error) {
    console.log('❌ Route Search Failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testBusFleet() {
  console.log('🔍 Testing Bus Fleet Management...');
  try {
    const response = await authenticatedRequest({
      method: 'GET',
      url: `${API_BASE_URL}/api/buses`
    });
    console.log('✅ Bus Fleet:', response.data.success, `- Found ${response.data.data.buses.length} buses`);
    return true;
  } catch (error) {
    console.log('❌ Bus Fleet Failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testSeatAvailability() {
  console.log('🔍 Testing Seat Availability...');
  try {
    const response = await axios.post(`${API_BASE_URL}/api/bookings/seats/check`, {
      scheduleId: 'schedule-1',
      seatIds: ['seat-1-A', 'seat-1-B']
    });
    console.log('✅ Seat Availability:', response.data.success);
    return true;
  } catch (error) {
    console.log('❌ Seat Availability Failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testBookingCreation() {
  console.log('🔍 Testing Booking Creation...');
  try {
    const response = await authenticatedRequest({
      method: 'POST',
      url: `${API_BASE_URL}/api/bookings`,
      data: {
        routeId: 'route-1',
        scheduleId: 'schedule-1',
        passengers: [{
          firstName: 'Test',
          lastName: 'Passenger',
          email: 'passenger@example.com',
          phone: '+1234567890',
          dateOfBirth: '1990-01-01',
          ticketType: 'ADULT'
        }],
        selectedSeats: ['seat-1-A']
      }
    });
    console.log('✅ Booking Creation:', response.data.success);
    testBookingId = response.data.data.id;
    return true;
  } catch (error) {
    console.log('❌ Booking Creation Failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testPaymentIntent() {
  console.log('🔍 Testing Payment Intent...');
  if (!testBookingId) {
    console.log('❌ Payment Intent Failed: No booking ID available');
    return false;
  }
  
  try {
    const response = await authenticatedRequest({
      method: 'POST',
      url: `${API_BASE_URL}/api/payments/intent`,
      data: {
        bookingId: testBookingId
      }
    });
    console.log('✅ Payment Intent:', response.data.success);
    return true;
  } catch (error) {
    console.log('❌ Payment Intent Failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testUserProfile() {
  console.log('🔍 Testing User Profile...');
  try {
    const response = await authenticatedRequest({
      method: 'GET',
      url: `${API_BASE_URL}/api/users/profile`
    });
    console.log('✅ User Profile:', response.data.success);
    return true;
  } catch (error) {
    console.log('❌ User Profile Failed:', error.response?.data?.message || error.message);
    return false;
  }
}

async function testWebsiteAccess() {
  console.log('🔍 Testing Website Access...');
  try {
    const response = await axios.get(WEB_BASE_URL);
    console.log('✅ Website Access: Available');
    return true;
  } catch (error) {
    console.log('❌ Website Access Failed:', error.message);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting TravelCircles Platform Tests...\n');
  
  const tests = [
    { name: 'API Health', fn: testAPIHealth },
    { name: 'Website Access', fn: testWebsiteAccess },
    { name: 'User Registration', fn: testUserRegistration },
    { name: 'User Login', fn: testUserLogin },
    { name: 'Route Search', fn: testRouteSearch },
    { name: 'Bus Fleet', fn: testBusFleet },
    { name: 'Seat Availability', fn: testSeatAvailability },
    { name: 'Booking Creation', fn: testBookingCreation },
    { name: 'Payment Intent', fn: testPaymentIntent },
    { name: 'User Profile', fn: testUserProfile },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${test.name} Error:`, error.message);
      failed++;
    }
    console.log(''); // Add spacing between tests
  }

  console.log('📊 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

  if (failed === 0) {
    console.log('\n🎉 All tests passed! TravelCircles platform is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the logs above for details.');
  }

  return failed === 0;
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('Test runner error:', error);
    process.exit(1);
  });
}

module.exports = { runTests };
