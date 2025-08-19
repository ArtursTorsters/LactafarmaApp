import { Router, Request, Response, NextFunction } from 'express';
import { scraperService } from '../services/ScraperService';
import { body, param, validationResult } from 'express-validator';

const router = Router();

// Validation middleware
const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// Search drugs
router.get('/search/:term',
  param('term').isLength({ min: 2, max: 100 }).escape(),
  handleValidationErrors,
  async (req: Request, res: Response) => {
    try {
      const { term } = req.params;
      const searchResult = await scraperService.searchDrug(term);

      res.json({
        success: true,
        data: searchResult,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to search drugs',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

// Get drug details
router.get('/details',
  async (req: Request, res: Response) => {
    try {
      const { url } = req.query;

      if (!url || typeof url !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'URL parameter is required'
        });
      }

      const drugInfo = await scraperService.getDrugDetails(url);

      if (!drugInfo) {
        return res.status(404).json({
          success: false,
          error: 'Drug information not found'
        });
      }

      res.json({
        success: true,
        data: drugInfo,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Drug details error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get drug details',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

// Get popular drugs
router.get('/popular', async (req: Request, res: Response) => {
  try {
    const popularDrugs = await scraperService.getPopularDrugs();

    res.json({
      success: true,
      data: {
        drugs: popularDrugs,
        totalResults: popularDrugs.length,
        source: 'e-lactancia.org'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Popular drugs error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get popular drugs',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Attribution endpoint (required by CC license)
router.get('/attribution', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      dataSource: 'e-lactancia.org',
      organization: 'APILAM (Asociación para la Promoción e Investigación científica y cultural de la Lactancia Materna)',
      license: 'CC BY-NC-SA 4.0',
      url: 'https://www.e-lactancia.org/',
      disclaimer: 'This information complements but does not replace medical advice. Always consult your healthcare provider.',
      medicalDisclaimer: `
        ⚠️ IMPORTANT MEDICAL DISCLAIMER:
        This app provides educational information only and is not intended as a substitute for professional medical advice, diagnosis, or treatment.
        • Always consult your healthcare provider before making decisions about medications while breastfeeding
        • Drug compatibility can vary based on individual circumstances
        • This information complements but does not replace medical advice
        • In case of emergency, contact your healthcare provider immediately
      `
    },
    timestamp: new Date().toISOString()
  });
});

// Health check for this service
router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    service: 'drug-scraper',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

export { router as drugRoutes };
