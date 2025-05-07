// migrate-users.js
import mongoose from 'mongoose';
import Property from './schema/Property.js';
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

const migrateProperty = async () => {
  try {
    // Find all users without a status field
    const properties = await Property.find({ approval: { $exists: false } });
    console.log(`Found ${properties.length} properties to migrate`);
    
    // If no users to migrate
    if (properties.length === 0) {
      console.log('No Property need migration. All Property already have approval field.');
      process.exit(0);
    }
   
    for (const property of properties) {
      property.approval = 'pending';
      await property.save();
      console.log(`Updated Property ${property.title} with approval ${property.approval}`);
    }
    
    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

// Export the function for reuse
export default migrateProperty;

// Run the migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateProperty();
}