// schema/RealEstateUser.js
import mongoose from 'mongoose';

const RealEstateUserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true },
    contactNumber: { type: Number, required: true, trim: true, unique: true, index: true },
    role: {
      type: String,
      enum: ['buyer', 'seller', 'agent', 'admin'],
      default: 'buyer',
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'inactive'],
      default: function() {
        return this.role === 'buyer' ? 'active' : 'pending';
      }
    },
    isVerified: { type: Boolean, default: false },
    refreshToken: { type: String, default: null },

    // ✅ New Field: Tier ID
    tierId: {
      type: String,
      enum: ['free', 'standard', 'premium', 'enterprise', 'agent'],
      default: 'free'
    }
  },
  { timestamps: true }
);

// Auto-verify buyers
RealEstateUserSchema.pre('save', function(next) {
  if (this.role === 'buyer') {
    this.isVerified = true;
  }
  next();
});

const RealEstateUser = mongoose.model('RealEstateUser', RealEstateUserSchema);

export default RealEstateUser;
