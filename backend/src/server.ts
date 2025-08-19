import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { drugRoutes } from './routes/drugRoutes'
import { errorHandler } from './middleware/errorHandler'
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting - 100 requests per 15 minutes per IP
const rateLimiter = new RateLimiterMemory({
  points: 100,
  duration: 900,
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());

// Rate limiting middleware
app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const key = req.ip || 'unknown';
    await rateLimiter.consume(key);
    next();
  } catch (rejRes: any) {
    res.status(429).json({
      error: 'Too many requests, please try again later.',
      retryAfter: Math.round((rejRes?.msBeforeNext || 60000) / 1000),
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/drugs', drugRoutes);
app.use(errorHandler);
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
})

export default app;
