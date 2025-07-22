const bcrypt = require('bcrypt');

async function testPasswordHash() {
  console.log('🔍 Testing Password Hash...');
  
  const password = 'password123';
  const storedHash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
  
  try {
    // Test if the stored hash matches the password
    const isValid = await bcrypt.compare(password, storedHash);
    console.log(`Password "${password}" matches stored hash:`, isValid);
    
    if (!isValid) {
      console.log('❌ Hash does not match! Generating new hash...');
      
      // Generate new hash
      const saltRounds = 10;
      const newHash = await bcrypt.hash(password, saltRounds);
      console.log('✅ New hash for "password123":', newHash);
      
      // Test the new hash
      const newHashValid = await bcrypt.compare(password, newHash);
      console.log('New hash validation:', newHashValid);
    } else {
      console.log('✅ Hash is correct!');
    }
    
    // Also test admin password
    console.log('\n🔍 Testing admin password...');
    const adminPassword = 'admin123';
    const adminHashValid = await bcrypt.compare(adminPassword, storedHash);
    console.log(`Password "${adminPassword}" matches stored hash:`, adminHashValid);
    
    if (!adminHashValid) {
      const adminHash = await bcrypt.hash(adminPassword, 10);
      console.log('✅ New hash for "admin123":', adminHash);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testPasswordHash();
