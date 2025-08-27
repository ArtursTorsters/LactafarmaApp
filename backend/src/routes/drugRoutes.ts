// src/routes/drugRoutes.ts
import express, { Router } from 'express';
import { DrugController } from '../controllers/drugController';

// Create router instance
const router: Router = express.Router();

// Create single controller instance (singleton pattern)
const drugController = new DrugController();

// Middleware for logging requests
const logRequest = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip || req.connection.remoteAddress;

  console.log(`📡 ${timestamp} - ${method} ${url} from ${ip}`);
  next();
};

// Apply logging middleware to all routes
router.use(logRequest);

// Rate limiting middleware (simple in-memory implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 100; // requests per hour
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

const rateLimit = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();

  // Clean up old entries
  for (const [ip, data] of rateLimitMap.entries()) {
    if (now > data.resetTime) {
      rateLimitMap.delete(ip);
    }
  }

  // Check current client
  const clientData = rateLimitMap.get(clientIP);

  if (!clientData) {
    // First request from this IP
    rateLimitMap.set(clientIP, {
      count: 1,
      resetTime: now + RATE_WINDOW
    });
    next();
    return;
  }

  if (now > clientData.resetTime) {
    // Reset window has passed
    rateLimitMap.set(clientIP, {
      count: 1,
      resetTime: now + RATE_WINDOW
    });
    next();
    return;
  }

  if (clientData.count >= RATE_LIMIT) {
    // Rate limit exceeded
    const resetIn = Math.ceil((clientData.resetTime - now) / 1000 / 60); // minutes
    res.status(429).json({
      success: false,
      error: 'Rate limit exceeded',
      message: `Too many requests. Try again in ${resetIn} minutes.`,
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: resetIn * 60 // seconds
    });
    return;
  }

  // Increment counter
  clientData.count++;
  next();
};

// Apply rate limiting to all routes
router.use(rateLimit);

/**
 * @route   GET /api/drugs/search/:query
 * @desc    Search for drug suggestions
 * @params  query - Drug name to search (min 2 chars, max 100 chars)
 * @returns Array of drug suggestions with names and URLs
 */
router.get('/search/:query', async (req, res) => {
  await drugController.searchDrugs(req, res);
});

/**
 * @route   GET /api/drugs/details/:name
 * @desc    Get detailed information about a specific drug
 * @params  name - Exact drug name (min 2 chars)
 * @returns Detailed drug information including risk level, description, etc.
 */
router.get('/details/:name', async (req, res) => {
  await drugController.getDrugDetails(req, res);
});

/**
 * @route   POST /api/drugs/batch-search
 * @desc    Search for multiple drugs in a single request
 * @body    { queries: string[] } - Array of drug names (max 10)
 * @returns Object with search results for each query
 */
router.post('/batch-search', async (req, res) => {
  await drugController.batchSearch(req, res);
});

/**
 * @route   GET /api/drugs/health
 * @desc    Check the health status of the scraper service
 * @returns Health status, cache info, and uptime
 */
router.get('/health', async (req, res) => {
  await drugController.healthCheck(req, res);
});

// Catch-all route for undefined endpoints
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /api/drugs/search/:query',
      'GET /api/drugs/details/:name',
      'POST /api/drugs/batch-search',
      'GET /api/drugs/health'
    ],
    requestedEndpoint: req.originalUrl
  });
});

// Error handling middleware for this router
router.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('🔥 Route error:', error);

  res.status(500).json({
    success: false,
    error: 'Route handler failed',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    code: 'ROUTE_ERROR'
  });
});

// Graceful shutdown handling
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, cleaning up drug controller...');
  await drugController.cleanup();
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, cleaning up drug controller...');
  await drugController.cleanup();
});

export default router;
