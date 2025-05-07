import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet'; // Helmet for basic security headers
import rateLimit from 'express-rate-limit'; // Rate limiting
import connectDB from './dbConnection/dbConnection.js';
import RealEstateUser from './router/RealEstateUser.js';
import Property from './router/Property.js';
import configRoutes from './router/configRoutes.js';


import path from 'path';
import { fileURLToPath } from 'url';

// middleware
import { notFound, errorHandler } from './middileware/errorMiddleware.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔐 Middlewares
app.use(helmet()); // Set secure HTTP headers
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true, // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Prevent brute force attacks by rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
});

app.use(limiter);
app.use(express.json());

app.use(cookieParser()); // Parse cookies

// 🔗 Routes
app.use('/api/v1/RealEstateUser', RealEstateUser);
app.use('/api/v1/Property', Property);
app.use('/api/v1/config', configRoutes);


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../Frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend", "dist", "index.html"));
  });
}

app.get('/', (req, res) => {
  res.send('👋 Hello, working!');
});

// 🔌 Connect DB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
});
