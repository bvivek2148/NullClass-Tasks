// Debug script to check the development environment
console.log('🔍 TravelCircles Platform Debug Information');
console.log('==========================================');
console.log('');

// Check Node.js version
console.log('📦 Node.js Information:');
console.log(`   Version: ${process.version}`);
console.log(`   Platform: ${process.platform}`);
console.log(`   Architecture: ${process.arch}`);
console.log(`   Current Directory: ${process.cwd()}`);
console.log('');

// Check environment variables
console.log('🔧 Environment Variables:');
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
console.log(`   PORT: ${process.env.PORT || 'not set'}`);
console.log('');

// Check if required modules can be loaded
console.log('📚 Module Availability Check:');

const modules = [
  'express',
  'cors',
  'helmet',
  'morgan',
  'dotenv',
  'bcrypt',
  'jsonwebtoken',
  'express-validator',
  'winston'
];

modules.forEach(moduleName => {
  try {
    require.resolve(moduleName);
    console.log(`   ✅ ${moduleName}: Available`);
  } catch (error) {
    console.log(`   ❌ ${moduleName}: Missing`);
  }
});

console.log('');

// Check file system access
console.log('📁 File System Check:');
const fs = require('fs');
const path = require('path');

const filesToCheck = [
  'package.json',
  'src/index.ts',
  'src/services/userService.ts',
  'src/routes/auth.ts',
  '.env'
];

filesToCheck.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    console.log(`   ✅ ${file}: Exists`);
  } else {
    console.log(`   ❌ ${file}: Missing`);
  }
});

console.log('');

// Try to start a basic Express server
console.log('🚀 Testing Basic Express Server:');
try {
  const express = require('express');
  const app = express();
  
  app.get('/test', (req, res) => {
    res.json({ message: 'Server is working!' });
  });
  
  const server = app.listen(3001, () => {
    console.log('   ✅ Express server started successfully on port 3001');
    console.log('   🔗 Test URL: http://localhost:3001/test');
    
    // Close the server after a moment
    setTimeout(() => {
      server.close(() => {
        console.log('   ✅ Test server closed successfully');
        console.log('');
        console.log('🎉 Basic setup appears to be working!');
        console.log('');
        console.log('Next steps:');
        console.log('1. Install dependencies: npm install');
        console.log('2. Start the full server: npm run dev');
        console.log('3. Check the browser at http://localhost:3001');
      });
    }, 2000);
  });
  
} catch (error) {
  console.log(`   ❌ Express server failed: ${error.message}`);
  console.log('');
  console.log('🔧 Troubleshooting:');
  console.log('1. Make sure Node.js is installed: node --version');
  console.log('2. Install dependencies: npm install');
  console.log('3. Check for any missing modules above');
}
