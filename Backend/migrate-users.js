// migrate-users.js
import mongoose from 'mongoose';
import RealEstateUser from './schema/RealEstateUser.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to your database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

const migrateUsers = async () => {
  try {
    // Find all users without a status field
    const users = await RealEstateUser.find({ status: { $exists: false } });

    const tiers = await RealEstateUser.find({ tierId: { $exists: false } });
    console.log(`Found ${users.length} users to migrate`);
    console.log(`Found ${tiers.length} tiers to migrate`);
    
    // If no users to migrate
    if (users.length === 0) {
      console.log('No users need migration. All users already have status field.');
      // process.exit(0);
    }
    
    if (tiers.length === 0) {
      console.log('No users need migration. All users already have tier field.');
      process.exit(0);
    }
    for (const user of users) {
      if (user.role === 'buyer') {
        user.status = 'active';
      } else if (user.role === 'admin') {
        user.status = 'active';  
      } else {
        // Sellers and agents default to pending
        user.status = 'pending';
      }

      for (const user of users) {
        if (user.role === 'buyer'){
          user.tierId = 'free';
        }
      }
      
      await user.save();
      console.log(`Updated user ${user.email} with status ${user.status}`);
      console.log(`Updated user ${user.email} with tierId ${user.tierId}`);
    }
    
    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

// Run the migration
migrateUsers();