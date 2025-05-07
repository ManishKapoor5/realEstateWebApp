// create-admin.js

import mongoose from 'mongoose';
import RealEstateUser from './schema/RealEstateUser.js';
import { hashPassword } from './utils/bcryptUtlis.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Admin user details - customize as needed
const adminDetails = {
  fullName: 'Admin User',
  email: 'admin@yourdomain.com',
  password: 'secureAdminPassword123',  // Use a strong password
  contactNumber: '1234567890',
  role: 'admin',
  status: 'active',
  isVerified: true
};

const createAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await RealEstateUser.findOne({ email: adminDetails.email });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log({
        _id: existingAdmin._id,
        email: existingAdmin.email,
        role: existingAdmin.role
      });
      process.exit(0);
    }
    
    // Hash the password
    const hashedPassword = await hashPassword(adminDetails.password);
    
    // Create the admin user
    const admin = new RealEstateUser({
      fullName: adminDetails.fullName,
      email: adminDetails.email,
      password: hashedPassword,
      contactNumber: adminDetails.contactNumber,
      role: adminDetails.role,
      status: adminDetails.status,
      isVerified: adminDetails.isVerified
    });
    
    await admin.save();
    
    console.log('Admin user created successfully!');
    console.log({
      _id: admin._id,
      email: admin.email,
      role: admin.role,
      status: admin.status
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

// Export the createAdmin function
export default createAdmin;

// Automatically execute the function if the file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createAdmin();
}