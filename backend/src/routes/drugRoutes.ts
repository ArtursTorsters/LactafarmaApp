import express, { Router } from 'express';
import { DrugController } from '../controllers/drugController';

const router: Router = express.Router();
const drugController = new DrugController();

// Simple rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 100; // requests per hour
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

const rateLimit = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();

  // Clean up expired entries
  for (const [ip, data] of rateLimitMap.entries()) {
    if (now > data.resetTime) {
      rateLimitMap.delete(ip);
    }
  }

  const clientData = rateLimitMap.get(clientIP);

  if (!clientData) {
    rateLimitMap.set(clientIP, {
      count: 1,
      resetTime: now + RATE_WINDOW
    });
    next();
    return;
  }

  if (now > clientData.resetTime) {
    rateLimitMap.set(clientIP, {
      count: 1,
      resetTime: now + RATE_WINDOW
    });
    next();
    return;
  }

  if (clientData.count >= RATE_LIMIT) {
    const resetIn = Math.ceil((clientData.resetTime - now) / 1000 / 60);
    res.status(429).json({
      success: false,
      error: 'Rate limit exceeded',
      message: `Too many requests. Try again in ${resetIn} minutes.`,
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: resetIn * 60
    });
    return;
  }

  clientData.count++;
  next();
};

router.use(rateLimit);

// Search for drug suggestions
router.get('/search/:query', async (req, res) => {
  await drugController.searchDrugs(req, res);
});

// Get detailed drug information
router.get('/details/:name', async (req, res) => {
  await drugController.getDrugDetails(req, res);
});

// Search multiple drugs at once
router.post('/batch-search', async (req, res) => {
  await drugController.batchSearch(req, res);
});

// Health check endpoint
router.get('/health', async (req, res) => {
  await drugController.healthCheck(req, res);
});

// Error handling
router.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(500).json({
    success: false,
    error: 'Route handler failed',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    code: 'ROUTE_ERROR'
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await drugController.cleanup();
});

process.on('SIGINT', async () => {
  await drugController.cleanup();
});

export default router;
