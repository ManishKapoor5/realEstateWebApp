import asyncHandler from 'express-async-handler';
import LimitConfig from '../schema/limitConfigModel.js';

// @desc    Get property limit configuration
// @route   GET /api/config/property-limits
// @access  Public
export const getLimitConfig = asyncHandler(async (req, res) => {
  // Find or create the limit configuration
  let limitConfig = await LimitConfig.findOne();
  
  if (!limitConfig) {
    // Create default configuration if none exists
    limitConfig = await LimitConfig.create({
      tiers: [
        { 
          id: 'free', 
          name: 'Free Tier', 
          propertyLimit: 5,
          description: 'Basic account with limited access'
        },
        { 
          id: 'standard', 
          name: 'Standard Tier', 
          propertyLimit: 15,
          description: 'Paid subscription with moderate access',
          price: 499
        },
        { 
          id: 'premium', 
          name: 'Premium Tier', 
          propertyLimit: 30,
          description: 'Premium subscription with expanded access',
          price: 999
        },
        { 
          id: 'enterprise', 
          name: 'Enterprise Tier', 
          propertyLimit: 100,
          description: 'Full access for enterprise clients',
          price: 2499
        },
        { 
          id: 'agent', 
          name: 'Agent Partnership', 
          propertyLimit: 50,
          description: 'For partnered real estate agents',
          price: 1499
        }
      ],
      showLimitExceededNotice: true,
      allowWaitlist: true
    });
  }
  
  res.json(limitConfig);
});

// @desc    Update property limit configuration
// @route   PUT /api/config/property-limits
// @access  Private/Admin
export const updateLimitConfig = asyncHandler(async (req, res) => {
  const { tiers, showLimitExceededNotice, allowWaitlist } = req.body;
  
  // Validate input
  if (!tiers || !Array.isArray(tiers)) {
    res.status(400);
    throw new Error('Tiers must be provided as an array');
  }
  
  // Validate each tier
  for (const tier of tiers) {
    if (!tier.id || !tier.name || tier.propertyLimit === undefined) {
      res.status(400);
      throw new Error('Each tier must have id, name, and propertyLimit properties');
    }
    
    if (tier.propertyLimit < 1 || tier.propertyLimit > 500) {
      res.status(400);
      throw new Error('Property limit must be between 1 and 500');
    }
  }
  
  // Find or create the limit configuration
  let limitConfig = await LimitConfig.findOne();
  
  if (!limitConfig) {
    limitConfig = new LimitConfig();
  }
  
  // Update the configuration
  limitConfig.tiers = tiers;
  limitConfig.showLimitExceededNotice = showLimitExceededNotice ?? limitConfig.showLimitExceededNotice;
  limitConfig.allowWaitlist = allowWaitlist ?? limitConfig.allowWaitlist;
  
  await limitConfig.save();
  
  res.json(limitConfig);
});
