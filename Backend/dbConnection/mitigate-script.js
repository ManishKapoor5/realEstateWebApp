// migration-script.js
import mongoose from 'mongoose';
import RealEstateUser from './schema/RealEstateUser.js';

// Connect to your database
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const migrateUsers = async () => {
  try {
    // Find all users without a status field
    const users = await RealEstateUser.find({ status: { $exists: false } });
    console.log(`Found ${users.length} users to migrate`);
    
    for (const user of users) {
      // Set status based on role
      if (user.role === 'buyer') {
        user.status = 'active';
      } else if (user.role === 'admin') {
        user.status = 'active';
      } else {
        // Sellers and agents default to pending
        user.status = 'pending';
      }
      
      await user.save();
      console.log(`Updated user ${user.email} with status ${user.status}`);
    }
    
    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateUsers();