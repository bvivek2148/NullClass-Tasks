const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting TravelCircles Platform...\n');

// Start API Server
console.log('📡 Starting API Server...');
const apiServer = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'apps', 'api'),
  stdio: 'inherit',
  shell: true
});

// Wait a bit before starting web server
setTimeout(() => {
  console.log('\n🌐 Starting Web Server...');
  const webServer = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, 'apps', 'web'),
    stdio: 'inherit',
    shell: true
  });

  webServer.on('error', (error) => {
    console.error('❌ Web Server Error:', error);
  });
}, 3000);

apiServer.on('error', (error) => {
  console.error('❌ API Server Error:', error);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down servers...');
  apiServer.kill();
  process.exit();
});

console.log('\n✅ Servers starting...');
console.log('📡 API Server: http://localhost:3001');
console.log('🌐 Web Server: http://localhost:3000');
console.log('\nPress Ctrl+C to stop servers');
