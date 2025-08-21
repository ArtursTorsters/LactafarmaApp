// // src/routes/simpleDrugRoutes.ts - Working scraper routes
// import { Router, Request, Response } from 'express';
// // import { workingElactanciaScraper } from '../services/Scraper';

// const router = Router();

// // Health check
// router.get('/health', (req: Request, res: Response) => {
//   res.json({
//     success: true,
//     status: 'healthy',
//     service: 'simple e-lactancia scraper',
//     timestamp: new Date().toISOString()
//   });
// });

// // Simple autocomplete endpoint
// router.get('/autocomplete/:term', async (req: Request, res: Response) => {
//   try {
//     const { term } = req.params;

//     if (!term || term.length < 1) {
//       return res.status(400).json({
//         success: false,
//         error: 'Search term is required'
//       });
//     }

//     console.log(`🔍 Autocomplete request for: "${term}"`);
//     // const result = await workingElactanciaScraper.getAutocompleteSuggestions(term);

//     res.json({
//       success: result.totalResults > 0,
//       data: {
//         suggestions: result.suggestions,
//         searchTerm: term,
//         totalResults: result.totalResults,
//         method: result.method,
//       },
//       timestamp: new Date().toISOString()
//     });

//   } catch (error) {
//     console.error('❌ Autocomplete error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'Autocomplete failed',
//       message: error instanceof Error ? error.message : 'Unknown error'
//     });
//   }
// });

// // Test endpoint with debug info
// router.get('/test/:term', async (req: Request, res: Response) => {
//   try {
//     const { term } = req.params;

//     console.log(`🧪 Test request for: "${term}"`);

//     // Test the search
//     const result = await workingElactanciaScraper.getAutocompleteSuggestions(term);

//     res.json({
//       success: true,
//       test: {
//         searchTerm: term,
//         result: result,
//         debug: {
//           searchUrl: `https://www.e-lactancia.org/buscar/?q=${encodeURIComponent(term)}`,
//           method: result.method,
//           likelyUrls: [
//             `https://www.e-lactancia.org/breastfeeding/${term.toLowerCase()}/product/`,
//             `https://www.e-lactancia.org/breastfeeding/${term.toLowerCase()}-hydrochloride/product/`,
//           ]
//         }
//       },
//       timestamp: new Date().toISOString()
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error instanceof Error ? error.message : 'Test failed'
//     });
//   }
// });

// // Debug endpoint to test specific URLs
// router.get('/debug/test-url/:term', async (req: Request, res: Response) => {
//   try {
//     const { term } = req.params;
//     console.log(`🔗 Testing direct URLs for: "${term}"`);

//     const testUrls = [
//       `https://www.e-lactancia.org/breastfeeding/${term.toLowerCase()}/product/`,
//       `https://www.e-lactancia.org/breastfeeding/${term.toLowerCase()}-hydrochloride/product/`,
//       `https://www.e-lactancia.org/buscar/?q=${encodeURIComponent(term)}`,
//     ];

//     const results = [];

//     for (const url of testUrls) {
//       try {
//         const axios = require('axios');
//         const response = await axios.get(url, { timeout: 10000 });
//         results.push({
//           url,
//           status: response.status,
//           success: true,
//           title: response.data.match(/<title>(.*?)<\/title>/)?.[1] || 'No title'
//         });
//       } catch (error: any) {
//         results.push({
//           url,
//           status: error.response?.status || 'timeout',
//           success: false,
//           error: error.message
//         });
//       }
//     }

//     res.json({
//       success: true,
//       urlTests: results,
//       timestamp: new Date().toISOString()
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: 'URL test failed',
//       message: error instanceof Error ? error.message : 'Unknown error'
//     });
//   }
// });

// // Debug endpoint to see discovered endpoints
// router.get('/debug/discover', async (req: Request, res: Response) => {
//   try {
//     console.log(`🕵️ Running endpoint discovery...`);

//     // Force discovery by making a test search
//     await workingElactanciaScraper.getAutocompleteSuggestions('test');

//     const discoveredEndpoint = workingElactanciaScraper.getDiscoveredEndpoint();

//     res.json({
//       success: true,
//       discovery: {
//         discoveredEndpoint,
//         hasEndpoint: !!discoveredEndpoint,
//         message: discoveredEndpoint
//           ? `Found autocomplete endpoint: ${discoveredEndpoint}`
//           : 'No autocomplete endpoint discovered yet'
//       },
//       timestamp: new Date().toISOString()
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: 'Discovery failed',
//       message: error instanceof Error ? error.message : 'Unknown error'
//     });
//   }
// });

// // Clear cache
// router.post('/cache/clear', (req: Request, res: Response) => {
//   try {
//     workingElactanciaScraper.clearCache();
//     res.json({
//       success: true,
//       message: 'Cache cleared',
//       timestamp: new Date().toISOString()
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: 'Failed to clear cache'
//     });
//   }
// });

// // Attribution
// router.get('/attribution', (req: Request, res: Response) => {
//   res.json({
//     success: true,
//     data: {
//       dataSource: 'e-lactancia.org',
//       organization: 'APILAM',
//       disclaimer: 'This information complements but does not replace medical advice.',
//       scrapingMethod: 'Simple search page scraping'
//     },
//     timestamp: new Date().toISOString()
//   });
// });

// export { router as simpleDrugRoutes };
