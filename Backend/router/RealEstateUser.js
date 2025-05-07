import express from 'express';
import {
  signup,
  login,
  logout,
  refreshAccessToken,
  getPendingUsers,
  approveUser,
  rejectUser,
  getAllAgentsAndSellers,
  promoteToAdmin
} from '../controller/RealEstateuser.js';

import verifyRefreshToken from '../middileware/refreshTokenVerify.js';
import accessTokenverify from '../middileware/acessTokenVerify.js';
import { signupValidationRules, loginValidationRules, validate } from '../utils/validationUser.js';

const router = express.Router();

// 🔐 Public Routes
router.post('/signup', signupValidationRules(), validate, signup);  // Validation middleware added
router.post('/login', loginValidationRules(), validate, login);  // Validation middleware added

// 🔐 Protected Route (Logout) — requires access token
router.post('/logout', accessTokenverify, logout);

// 🔄 Refresh token route — uses refresh token middleware
router.post('/refresh-token', verifyRefreshToken, refreshAccessToken);

// Admin route middleware
const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

// Admin routes - protected with access token verification and role check
router.get('/pending', accessTokenverify, adminOnly, getPendingUsers);
router.put('/approveUser/:userId', accessTokenverify, adminOnly, approveUser);
router.put('/rejectUser/:userId', accessTokenverify, adminOnly, rejectUser);
router.get('/getAllAgentsAndSellers', accessTokenverify, adminOnly, getAllAgentsAndSellers);
router.put('/promote-to-admin/:userId', accessTokenverify, adminOnly, promoteToAdmin);

export default router;