// Simple test server to check if basic Express setup works
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Basic middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'TravelCircles API is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Test API route
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API endpoints are working!',
    data: {
      routes: ['auth', 'users', 'routes', 'buses', 'bookings', 'payments'],
      features: ['authentication', 'booking', 'payment', 'admin']
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 TravelCircles Test Server Started!');
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
  console.log(`🧪 Test API: http://localhost:${PORT}/api/test`);
  console.log('');
  console.log('If this works, the basic setup is correct.');
  console.log('Press Ctrl+C to stop the server.');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  process.exit(0);
});
