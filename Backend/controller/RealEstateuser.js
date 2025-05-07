import dotenv from 'dotenv';
dotenv.config();

import RealEstateUser from '../schema/RealEstateUser.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwtUtils.js';
import { hashPassword, comparePassword } from '../utils/bcryptUtlis.js';

// Signup
export const signup = async (req, res) => {
  try {
    const { fullName, email, password, role, contactNumber } = req.body;

    const existingUser = await RealEstateUser.findOne({
      $or: [{ email }, { contactNumber }],
    });

    if (existingUser) {
      const errorMessage = existingUser.email === email
        ? 'User already exists with this email'
        : 'Contact number already in use';
      return res.status(400).json({ message: errorMessage });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = new RealEstateUser({ fullName, email, password: hashedPassword, role, contactNumber });
    await newUser.save();

    res.status(201).json({
      message: 'User created successfully',
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
      contactNumber: newUser.contactNumber,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error signing up' });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await RealEstateUser.findOne({ email }).select('+password');
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid password' });

    if (user.status === 'pending') {
      return res.status(403).json({
        message: 'Your account is pending approval. Please check back later.',
        status: 'pending',
      });
    }

    if (user.status === 'inactive') {
      return res.status(403).json({
        message: 'Your account has been deactivated. Please contact support for assistance.',
        status: 'inactive',
      });
    }

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: 'Login successful',
      _id: user._id,
      email: user.email,
      role: user.role,
      contactNumber: user.contactNumber,
      status: user.status,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error logging in' });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const refreshToken =
      req.body.refreshToken ||
      req.query.refreshToken ||
      req.headers['x-refresh-token'] ||
      req.cookies.refreshToken;

    const user = await RealEstateUser.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (refreshToken && user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: 'Refresh token mismatch' });
    }

    user.refreshToken = null;
    await user.save();

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error logging out' });
  }
};

// Refresh Token
export const refreshAccessToken = async (req, res) => {
  try {
    const userId = req.user.userId;
    const refreshToken = req.refreshToken;

    const user = await RealEstateUser.findById(userId);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const newAccessToken = generateAccessToken(user._id, user.role);

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: false,
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({
      message: 'Access token refreshed successfully',
      accessToken: newAccessToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error refreshing token' });
  }
};

// Get all users pending approval
export const getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await RealEstateUser.find({
      status: 'pending',
      role: { $in: ['seller', 'agent'] },
    }).select('-password -refreshToken');

    res.status(200).json({
      success: true,
      count: pendingUsers.length,
      users: pendingUsers,
    });
  } catch (err) {
    console.error('Error fetching pending users:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching pending users',
    });
  }
};

// Approve a user
export const approveUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await RealEstateUser.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.role === 'admin' || user.role === 'buyer') {
      return res.status(400).json({
        success: false,
        message: `Cannot approve user with role '${user.role}'`,
      });
    }

    user.status = 'active';
    user.isVerified = 'true';
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User approved successfully',
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    console.error('Error approving user:', err);
    res.status(500).json({
      success: false,
      message: 'Error approving user',
    });
  }
};

// Reject a user
export const rejectUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await RealEstateUser.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.role === 'admin' || user.role === 'buyer') {
      return res.status(400).json({
        success: false,
        message: `Cannot reject user with role '${user.role}'`,
      });
    }

    user.status = 'inactive';
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User rejected successfully',
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    console.error('Error rejecting user:', err);
    res.status(500).json({
      success: false,
      message: 'Error rejecting user',
    });
  }
};

// Get all agents and sellers
export const getAllAgentsAndSellers = async (req, res) => {
  try {
    const users = await RealEstateUser.find({
      role: { $in: ['seller', 'agent'] },
    }).select('-password -refreshToken');

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
    });
  }
};

// Promote user to admin
export const promoteToAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can promote users',
      });
    }

    const user = await RealEstateUser.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.role = 'admin';
    user.status = 'active';

    await user.save();

    console.log(`User ${req.user.userId} promoted ${user.email} to admin at ${new Date()}`);

    res.status(200).json({
      success: true,
      message: 'User promoted to admin successfully',
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error('Error promoting user:', error);
    res.status(500).json({
      success: false,
      message: 'Error promoting user to admin',
    });
  }
};

// Upgrade tier
export const upgradeTier = async (req, res) => {
  const { newTier } = req.body;
  const userId = req.user.id;

  if (!newTier) return res.status(400).json({ message: 'Tier is required' });

  try {
    await RealEstateUser.findByIdAndUpdate(userId, { tier: newTier });
    return res.status(200).json({ message: 'Tier upgraded successfully' });
  } catch (err) {
    console.error('Tier upgrade error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
