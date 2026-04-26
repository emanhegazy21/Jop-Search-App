import express from 'express';
import connectDB from './config/connection.js';
import cors from "cors";
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import authRoutes from './modules/Auth/routes/auth.route.js';
import userRoutes from './modules/User/routes/user.route.js';
import chatRoutes from './modules/Chat/routes/chat.route.js';
import companyRoutes from './modules/Company/routes/company.route.js';
import applicationRoutes from './modules/Application/routes/application.route.js';
import jobRoutes from './modules/Jobs/routes/job.route.js';
import adminRoutes from './modules/Admin/routes/admin.route.js';

const app = express();

//Store Socket.IO instance
let io = null;

// Export getIO function for use in controllers
export const getIO = () => io;
export const setIO = (socketIO) => {
  io = socketIO;
};

//Security Middleware
app.use(helmet()); // Add security headers

// CORS Configuration - Only allow trusted origins
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate Limiting - Prevent brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Stricter limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, 
  skipSuccessfulRequests: true,
  message: 'Too many login attempts, please try again later.'
});

app.use(express.json());

connectDB();
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/application", applicationRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/admin", adminRoutes);

export default app;