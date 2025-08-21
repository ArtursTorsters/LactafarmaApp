import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { errorHandler } from './middleware/errorHandler';
import dotenv from 'dotenv';
// import { simpleDrugRoutes } from './routes/drugRoutes';

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
  origin: process.env.FRONTEND_URL || '*',
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
    service: 'e-lactancia scraper API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    features: ['autocomplete', 'drug_search', 'drug_details', 'caching']
  });
});

// api route to front
app.use('/api', simpleDrugRoutes)
app.use(errorHandler);

// 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    availableRoutes: [
      'GET /health - Health check',
      'GET /api/health - API health check',
      'GET /api/autocomplete/:term - Get drug suggestions',
      'GET /api/drug/:drugId - Get drug details',
      'GET /api/search/:term - Search with optional details',
      'POST /api/autocomplete/batch - Batch autocomplete',
      'GET /api/popular - Popular drugs',
      'POST /api/cache/clear - Clear cache',
      'GET /api/attribution - Data attribution info'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🔍 API Health: http://localhost:${PORT}/api/health`);
  console.log(`📋 Available endpoints:`);
  console.log(`   - Autocomplete: http://localhost:${PORT}/api/autocomplete/{drug_name}`);
  console.log(`   - Search: http://localhost:${PORT}/api/search/{drug_name}`);
  console.log(`   - Popular drugs: http://localhost:${PORT}/api/popular`);
});

export default app;
