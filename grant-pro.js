// Quick script to grant PRO access for testing
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function grantPro() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('tradesignal');
    
    // Find existing user and update to PRO
    const users = await db.collection('users').find({}).limit(5).toArray();
    console.log('📋 Existing users:', users.length);
    
    if (users.length > 0) {
      const user = users[0];
      console.log(`\n👤 Updating user: ${user.email || user._id}`);
      
      const result = await db.collection('users').updateOne(
        { _id: user._id },
        { 
          $set: { 
            tier: 'PRO',
            monthlyAnalysisCount: 0,
            updatedAt: new Date()
          }
        }
      );
      
      console.log('✅ PRO access granted!');
      console.log(`Modified: ${result.modifiedCount}`);
    } else {
      console.log('⚠️  No users found. Sign up first at the web platform.');
    }
    
  } finally {
    await client.close();
  }
}

grantPro().catch(console.error);
