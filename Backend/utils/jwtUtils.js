import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error("JWT secrets are not defined in environment variables");
}

// Generate Access Token (includes userId and role for authorization)
export const generateAccessToken = (userId, role) => {
  return jwt.sign({ userId, role }, ACCESS_TOKEN_SECRET, { expiresIn: '2h' });
};

// Generate Refresh Token (only userId, for obtaining new access tokens)
export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
};
