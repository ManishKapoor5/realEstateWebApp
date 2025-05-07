// utils/checkTierLimit.js
import LimitConfig from '../schema/limitConfigModel.js';
import Property from '../schema/Property.js'; // adjust path as needed
import RealEstateUser from '../schema/RealEstateUser.js';

export const canUserPostProperty = async (userId) => {
  const user = await RealEstateUser.findById(userId);
  if (!user) throw new Error('User not found');

  const config = await LimitConfig.findOne();
  const tier = config?.tiers?.find(t => t.id === user.tierId);

  if (!tier) throw new Error(`Tier "${user.tierId}" not found in configuration`);

  const currentCount = await Property.countDocuments({ postedBy: userId });
  return currentCount < tier.propertyLimit;
};
