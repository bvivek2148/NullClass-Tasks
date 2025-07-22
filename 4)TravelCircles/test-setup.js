// Simple test to verify Node.js and npm are working
console.log('🔍 TravelCircles Platform Setup Test');
console.log('=====================================');
console.log('');

// Test Node.js
console.log('📦 Node.js Information:');
console.log(`   Version: ${process.version}`);
console.log(`   Platform: ${process.platform}`);
console.log(`   Architecture: ${process.arch}`);
console.log('');

// Test basic Express functionality
console.log('🧪 Testing Express.js...');
try {
  const express = require('express');
  const app = express();
  
  app.get('/test', (req, res) => {
    res.json({ 
      success: true, 
      message: 'TravelCircles platform is ready!',
      timestamp: new Date().toISOString()
    });
  });
  
  const server = app.listen(3001, () => {
    console.log('✅ Express server test successful!');
    console.log('🔗 Test server running on http://localhost:3001/test');
    console.log('');
    console.log('🎉 Your system is ready to run TravelCircles!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Open two terminal windows');
    console.log('2. Terminal 1: cd apps/api && npm install && npm run dev');
    console.log('3. Terminal 2: cd apps/web && npm install && npm run dev');
    console.log('4. Access http://localhost:3000 in your browser');
    
    // Close test server after 3 seconds
    setTimeout(() => {
      server.close(() => {
        console.log('');
        console.log('✅ Test completed successfully!');
        process.exit(0);
      });
    }, 3000);
  });
  
} catch (error) {
  console.log('❌ Express test failed:', error.message);
  console.log('');
  console.log('Please install dependencies first:');
  console.log('npm install');
  process.exit(1);
}
