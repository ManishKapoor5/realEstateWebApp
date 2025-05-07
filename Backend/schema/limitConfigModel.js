import mongoose from 'mongoose';

const tierLimitSchema = new mongoose.Schema({
  id: {
    type: String,
    enum: ['free', 'standard', 'premium', 'enterprise', 'agent'],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  propertyLimit: {
    type: Number,
    required: true,
    min: 1,
    max: 500
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number
  }
});

const limitConfigSchema = new mongoose.Schema(
  {
    tiers: [tierLimitSchema],
    showLimitExceededNotice: {
      type: Boolean,
      default: true
    },
    allowWaitlist: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const LimitConfig = mongoose.model('LimitConfig', limitConfigSchema);

export default LimitConfig;