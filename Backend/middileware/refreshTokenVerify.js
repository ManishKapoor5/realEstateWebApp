import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../schema/RealEstateUser.js'; // adjust path as needed

dotenv.config();

const verifyRefreshToken = async (req, res, next) => {
  try {
    const token =
      req.cookies.refreshToken ||
      req.body.refreshToken ||
      req.query.refreshToken ||
      req.headers['x-refresh-token'];

    if (!token) {
      return res.status(401).json({ message: 'Refresh token missing' });
    }

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    req.user = { userId: decoded.userId };
    req.refreshToken = token;
    next();
  } catch (err) {
    console.error('Refresh token verification failed:', err.message);
    return res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
};

export default verifyRefreshToken;
