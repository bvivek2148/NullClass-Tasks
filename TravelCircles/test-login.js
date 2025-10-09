// Simple test to verify login functionality
const bcrypt = require('bcryptjs');

console.log('🔍 Testing Login Credentials...');
console.log('');

// Test password hashing
const testPassword = 'password123';
const storedHash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';

bcrypt.compare(testPassword, storedHash, (err, result) => {
  if (err) {
    console.log('❌ Error testing password:', err);
    return;
  }
  
  if (result) {
    console.log('✅ Password hash is correct!');
    console.log('✅ Login credentials should work:');
    console.log('   Email: vivek@example.com');
    console.log('   Password: password123');
  } else {
    console.log('❌ Password hash is incorrect');
  }
  
  console.log('');
  console.log('🔧 If login still fails, check:');
  console.log('1. API server is running on http://localhost:3001');
  console.log('2. Web server is running on http://localhost:3000');
  console.log('3. No CORS errors in browser console');
  console.log('4. Network tab shows API request being made');
});
