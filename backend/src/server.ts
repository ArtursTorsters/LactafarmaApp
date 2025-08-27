// src/server.ts
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import drugRoutes from './routes/drugRoutes';

// Load environment variables
dotenv.config();

// Create Express application
const app: Application = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Trust proxy (important for getting real IP addresses)
app.set('trust proxy', true);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (mobile apps, postman, etc.)
    if (!origin) return callback(null, true);

    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'http://localhost:8081',
      'http://192.168.1.100:8081',
      'exp://192.168.1.100:8081'
    ];

    // Allow any localhost or local network in development
    if (NODE_ENV === 'development') {
      if (origin.includes('localhost') || origin.includes('192.168.') || origin.includes('10.0.')) {
        return callback(null, true);
      }
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`🚫 CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: false,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const userAgent = req.get('User-Agent') || 'Unknown';
  const ip = req.ip;

  console.log(`📡 ${timestamp} - ${method} ${url} - IP: ${ip} - UA: ${userAgent.substring(0, 50)}...`);
  next();
});

// Health check endpoint (before other routes)
app.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    status: 'healthy',
    service: 'Drug Scraper API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
    }
  });
});

// API routes
app.use('/api/drugs', drugRoutes);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Drug Scraper API is running',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      search: '/api/drugs/search/:query',
      details: '/api/drugs/details/:name',
      batchSearch: '/api/drugs/batch-search',
      drugsHealth: '/api/drugs/health'
    },
    documentation: 'https://github.com/your-repo/drug-scraper-api'
  });
});

// 404 handler for undefined routes
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `The endpoint ${req.method} ${req.originalUrl} does not exist`,
    availableEndpoints: [
      'GET /',
      'GET /health',
      'GET /api/drugs/search/:query',
      'GET /api/drugs/details/:name',
      'POST /api/drugs/batch-search',
      'GET /api/drugs/health'
    ]
  });
});

// Global error handling middleware
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error('🔥 Unhandled error:', error);

  // Don't leak error details in production
  const isDevelopment = NODE_ENV === 'development';

  res.status(error.status || 500).json({
    success: false,
    error: 'Internal server error',
    message: isDevelopment ? error.message : 'Something went wrong',
    stack: isDevelopment ? error.stack : undefined,
    timestamp: new Date().toISOString()
  });
});

// Start the server
const server = app.listen(PORT, () => {
  console.log('🚀==========================================🚀');
  console.log(`🚀 Drug Scraper API Server Started`);
  console.log(`🚀 Environment: ${NODE_ENV}`);
  console.log(`🚀 Port: ${PORT}`);
  console.log(`🚀 Health Check: http://localhost:${PORT}/health`);
  console.log(`🚀 API Docs: http://localhost:${PORT}/`);
  console.log('🚀==========================================🚀');
});

// Graceful shutdown handling
const gracefulShutdown = (signal: string) => {
  console.log(`\n🛑 ${signal} received, shutting down gracefully...`);

  server.close((err) => {
    if (err) {
      console.error('❌ Error during server shutdown:', err);
      process.exit(1);
    }

    console.log('✅ HTTP server closed');
    console.log('✅ Graceful shutdown completed');
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error('⚠️ Forceful shutdown after timeout');
    process.exit(1);
  }, 10000);
};

// Handle different shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

export default app;
