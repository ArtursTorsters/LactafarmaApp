import puppeteer from 'puppeteer';

interface DrugSuggestion {
  name: string;
  url?: string;
  category?: string;
}

interface DrugDetails {
  name: string;
  riskLevel?: string;
  riskDescription?: string;
  alternatives?: string[];
  lastUpdate?: string;
  description?: string;
}

export class ELactanciaScaper {
  private browser: puppeteer.Browser | null = null;
  private page: puppeteer.Page | null = null;

  async initialize() {
    this.browser = await puppeteer.launch({
      headless: true, // Set to false for debugging
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });

    this.page = await this.browser.newPage();

    // Set realistic user agent
    await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    // Set viewport
    await this.page.setViewport({ width: 1920, height: 1080 });
  }

  async searchDrugs(query: string): Promise<DrugSuggestion[]> {
    if (!this.page) await this.initialize();

    try {
      // Navigate to the website
      await this.page!.goto('https://www.e-lactancia.org/', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // Wait for the search input to be available
      await this.page!.waitForSelector('#search_input', { timeout: 10000 });

      // Clear any existing text and type the query
      await this.page!.click('#search_input');
      await this.page!.keyboard.down('Control');
      await this.page!.keyboard.press('KeyA');
      await this.page!.keyboard.up('Control');
      await this.page!.keyboard.press('Backspace');

      // Type the query character by character to trigger autocomplete
      for (const char of query) {
        await this.page!.keyboard.type(char);
        await this.page!.waitForTimeout(50); // Small delay between characters
      }

      // Wait a bit longer for suggestions to appear
      await this.page!.waitForTimeout(1500);

      // Look for Twitter Typeahead suggestions - common patterns
      const suggestions = await this.page!.evaluate(() => {
        const results: DrugSuggestion[] = [];

        // Common selectors for Twitter Typeahead suggestions
        const selectors = [
          '.tt-suggestion',
          '.tt-selectable',
          '.twitter-typeahead .tt-suggestion',
          '.typeahead-suggestion',
          '[class*="tt-suggestion"]',
          '.tt-dataset .tt-suggestion',
          '.tt-menu .tt-suggestion'
        ];

        for (const selector of selectors) {
          const elements = document.querySelectorAll(selector);
          if (elements.length > 0) {
            elements.forEach((el: Element) => {
              const name = el.textContent?.trim();
              const href = el.getAttribute('href') ||
                          el.querySelector('a')?.getAttribute('href') ||
                          el.getAttribute('data-url');

              if (name && name.length > 0) {
                results.push({
                  name,
                  url: href || undefined,
                  category: el.getAttribute('data-category') || undefined
                });
              }
            });
            break; // Found suggestions, no need to continue
          }
        }

        return results;
      });

      console.log(`Found ${suggestions.length} suggestions for "${query}"`);
      return suggestions;

    } catch (error) {
      console.error('Error searching drugs:', error);
      return [];
    }
  }

  async getDrugDetails(drugName: string): Promise<DrugDetails | null> {
    if (!this.page) await this.initialize();

    try {
      // First get suggestions to find the exact URL
      const suggestions = await this.searchDrugs(drugName);

      if (suggestions.length === 0) {
        console.log(`No suggestions found for ${drugName}`);
        return null;
      }

      // Try to navigate to the first suggestion
      let targetUrl = suggestions[0].url;

      if (!targetUrl) {
        // If no direct URL, try searching and clicking the first result
        await this.page!.click('#search_input');
        await this.page!.keyboard.down('Control');
        await this.page!.keyboard.press('KeyA');
        await this.page!.keyboard.up('Control');
        await this.page!.type('#search_input', drugName);
        await this.page!.keyboard.press('Enter');

        // Wait for results page
        await this.page!.waitForNavigation({ waitUntil: 'networkidle2' });

        // Look for the first drug result link
        const firstResultSelector = 'a[href*="breastfeeding"], .drug-link, .result-link, h3 a, .search-result a';
        await this.page!.waitForSelector(firstResultSelector, { timeout: 5000 });
        await this.page!.click(firstResultSelector);
        await this.page!.waitForNavigation({ waitUntil: 'networkidle2' });
      } else {
        // Navigate directly to the drug page
        if (!targetUrl.startsWith('http')) {
          targetUrl = 'https://www.e-lactancia.org' + (targetUrl.startsWith('/') ? '' : '/') + targetUrl;
        }
        await this.page!.goto(targetUrl, { waitUntil: 'networkidle2' });
      }

      // Extract drug details from the page
      const drugDetails = await this.page!.evaluate(() => {
        const getTextContent = (selector: string): string => {
          const element = document.querySelector(selector);
          return element?.textContent?.trim() || '';
        };

        const getAllTextContent = (selector: string): string[] => {
          const elements = document.querySelectorAll(selector);
          return Array.from(elements).map(el => el.textContent?.trim() || '').filter(text => text.length > 0);
        };

        // Common selectors for drug information (may need adjustment based on actual site structure)
        const name = getTextContent('h1') ||
                    getTextContent('.drug-name') ||
                    getTextContent('.title');

        const riskLevel = getTextContent('.risk-level') ||
                         getTextContent('.safety-level') ||
                         getTextContent('[class*="risk"]') ||
                         getTextContent('.level');

        const description = getTextContent('.description') ||
                          getTextContent('.drug-description') ||
                          getTextContent('p');

        const alternatives = getAllTextContent('.alternatives li') ||
                           getAllTextContent('.alternative-drugs li') ||
                           getAllTextContent('[class*="alternative"] li');

        return {
          name,
          riskLevel,
          description,
          alternatives,
          lastUpdate: getTextContent('.last-update') || getTextContent('[class*="update"]'),
          riskDescription: getTextContent('.risk-description') || getTextContent('.safety-info')
        };
      });

      console.log(`Retrieved details for: ${drugDetails.name}`);
      return drugDetails;

    } catch (error) {
      console.error('Error getting drug details:', error);
      return null;
    }
  }

  async searchMultipleDrugs(queries: string[]): Promise<{ [key: string]: DrugSuggestion[] }> {
    const results: { [key: string]: DrugSuggestion[] } = {};

    for (const query of queries) {
      console.log(`Searching for: ${query}`);
      results[query] = await this.searchDrugs(query);

      // Add delay between searches to be respectful
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return results;
  }

  async close() {
    if (this.page) {
      await this.page.close();
      this.page = null;
    }
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}

// Usage example
export async function searchDrugsExample() {
  const scraper = new ELactanciaScaper();

  try {
    // Search for drug suggestions
    console.log('Searching for "aspirin"...');
    const suggestions = await scraper.searchDrugs('aspirin');
    console.log('Suggestions:', suggestions);

    if (suggestions.length > 0) {
      // Get detailed information about the first suggestion
      const drugDetails = await scraper.getDrugDetails(suggestions[0].name);
      console.log('Drug details:', drugDetails);
    }

    // Search for multiple drugs at once
    const multipleDrugs = await scraper.searchMultipleDrugs(['ibuprofen', 'paracetamol', 'amoxicillin']);
    console.log('Multiple drug results:', multipleDrugs);

  } catch (error) {
    console.error('Scraping failed:', error);
  } finally {
    await scraper.close();
  }
}

// Express.js API endpoints for React Native integration
export function createExpressRoutes(app: any) {
  const scraper = new ELactanciaScaper();

  // Search endpoint
  app.get('/api/drugs/search/:query', async (req: any, res: any) => {
    try {
      const suggestions = await scraper.searchDrugs(req.params.query);
      res.json({
        success: true,
        query: req.params.query,
        suggestions,
        count: suggestions.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to search drugs',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Drug details endpoint
  app.get('/api/drugs/details/:name', async (req: any, res: any) => {
    try {
      const details = await scraper.getDrugDetails(req.params.name);
      if (details) {
        res.json({
          success: true,
          drugName: req.params.name,
          details
        });
      } else {
        res.status(404).json({
          success: false,
          error: 'Drug not found',
          drugName: req.params.name
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to get drug details',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Cleanup on app shutdown
  process.on('SIGTERM', async () => {
    await scraper.close();
  });

  process.on('SIGINT', async () => {
    await scraper.close();
  });
}
