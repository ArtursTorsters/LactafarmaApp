import { Router, Request, Response } from 'express';
import { puppeteerScraper } from '../services/PuppeteerScraper';

const router = Router();

// Health check
router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    service: 'puppeteer-scraper',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Search drugs with Puppeteer (super simple!)
router.get('/search/:term', async (req: Request, res: Response) => {
  try {
    const { term } = req.params;

    if (!term || term.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Search term must be at least 2 characters'
      });
    }

    console.log(`🤖 Puppeteer search for: "${term}"`);

    // This one line does everything!
    const result = await puppeteerScraper.searchDrugWithSuggestions(term);

    res.json({
      success: true,
      data: {
        drugs: result.drugs,
        searchTerm: term,
        totalResults: result.drugs.length,
        source: 'e-lactancia.org',
        suggestions: result.suggestions, // Include suggestions for frontend
        bestMatch: result.bestMatch
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Puppeteer search error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search drugs',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get suggestions only (for autocomplete)
router.get('/suggestions/:term', async (req: Request, res: Response) => {
  try {
    const { term } = req.params;

    if (!term || term.length < 2) {
      return res.json({
        success: true,
        data: { suggestions: [] }
      });
    }

    console.log(`💡 Getting suggestions for: "${term}"`);
    const suggestions = await puppeteerScraper.getSuggestions(term);

    res.json({
      success: true,
      data: {
        suggestions,
        searchTerm: term
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Suggestions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get suggestions'
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
      scrapingMethod: 'Puppeteer browser automation'
    },
    timestamp: new Date().toISOString()
  });
});


// Add this debug route to your drugRoutes.ts

// Debug endpoint - see what Puppeteer actually sees
router.get('/debug/:term', async (req: Request, res: Response) => {
  try {
    const { term } = req.params;

    console.log(`🔍 Debug: Starting debug for "${term}"`);

    await puppeteerScraper.init();
    const browser = (puppeteerScraper as any).browser;
    const page = await browser.newPage();

    try {
      // Go to e-lactancia and take a screenshot
      await page.goto('https://www.e-lactancia.org/', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // Take screenshot before typing
      await page.screenshot({ path: 'debug-before.png', fullPage: true });
      console.log('📸 Screenshot saved: debug-before.png');

      // Get page title and URL
      const title = await page.title();
      const url = page.url();

      // Find all input elements
      const inputs = await page.evaluate(() => {
        const inputElements = document.querySelectorAll('input');
        const results: any[] = [];
        inputElements.forEach((input, index) => {
          results.push({
            index,
            type: input.type,
            placeholder: input.placeholder,
            id: input.id,
            className: input.className,
            name: input.name
          });
        });
        return results;
      });

      // Try to type in the search box
      let typingResult = 'No search input found';
      try {
        await page.waitForSelector('input[type="text"], input[type="search"], #search', { timeout: 5000 });
        await page.type('input[type="text"], input[type="search"], #search', term);
        await page.waitForTimeout(3000); // Wait 3 seconds

        // Take screenshot after typing
        await page.screenshot({ path: 'debug-after.png', fullPage: true });
        console.log('📸 Screenshot saved: debug-after.png');

        typingResult = 'Successfully typed in search box';
      } catch (error) {
        // typingResult = `Failed to type: ${error.message}`;
      }

      // Get all visible text on page
      const pageText = await page.evaluate(() => {
        return document.body.innerText.substring(0, 500);
      });

      // Look for any elements that might be suggestions
      const suggestionElements = await page.evaluate(() => {
        const suggestions: any[] = [];

        // Look for common suggestion patterns
        const selectors = [
          '.autocomplete', '.dropdown', '.suggestions', '.typeahead',
          '[role="listbox"]', '[role="option"]', '.ui-menu',
          'datalist', '.search-suggestions'
        ];

        selectors.forEach(selector => {
          const elements = document.querySelectorAll(selector);
          elements.forEach((el, index) => {
            suggestions.push({
              selector,
              index,
              text: el.textContent?.substring(0, 100),
              visible: (el as HTMLElement).offsetParent !== null,
              className: el.className
            });
          });
        });

        return suggestions;
      });

      res.json({
        success: true,
        debug: {
          term,
          pageTitle: title,
          pageUrl: url,
          pageTextPreview: pageText,
          inputElements: inputs,
          typingResult,
          suggestionElements,
          screenshots: ['debug-before.png', 'debug-after.png']
        },
        timestamp: new Date().toISOString()
      });

    } finally {
      await page.close();
    }

  } catch (error) {
    console.error('Debug failed:', error);
    res.status(500).json({
      success: false,
      // error: error.message
    });
  }
});

// Also add a simple test endpoint
router.get('/test-simple/:term', async (req: Request, res: Response) => {
  const { term } = req.params;

  // Just try the direct URL approach we know works
  const directUrl = `https://www.e-lactancia.org/breastfeeding/${term}-hydrochloride/product/`;

  console.log(`🧪 Testing direct URL: ${directUrl}`);

  try {
    const result = await puppeteerScraper.getDrugDetails(`${term}-hydrochloride`);

    res.json({
      success: true,
      data: {
        drugs: result ? [result] : [],
        searchTerm: term,
        totalResults: result ? 1 : 0,
        method: 'direct-with-suffix'
      }
    });
  } catch (error) {
    res.json({
      success: false,
      // error: error.message
    });
  }
});

export { router as drugRoutes };
