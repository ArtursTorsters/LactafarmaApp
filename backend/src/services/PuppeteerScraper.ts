import puppeteer from 'puppeteer';

export interface DrugInfo {
  id: string;
  name: string;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';
  riskLevelNumber: number;
  riskDescription: string;
  summary: string;
  alternatives?: string[];
  sourceUrl: string;
  lastUpdated: string;
}

export class PuppeteerScraper {
  private browser: any = null;

  async init() {
    if (this.browser) return; // Already initialized

    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
      ]
    });
    console.log('🤖 Puppeteer browser launched');
  }

  async getSuggestions(searchTerm: string): Promise<string[]> {
    await this.init();

    const page = await this.browser.newPage();

    try {
      console.log(`🤖 Puppeteer: Getting suggestions for "${searchTerm}"`);

      // Go to e-lactancia.org
      await page.goto('https://www.e-lactancia.org/', {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // Find search input and type
      await page.waitForSelector('input[type="text"], input[type="search"], #search', { timeout: 10000 });

      // Clear any existing text and type new search term
      await page.evaluate(() => {
        const input = document.querySelector('input[type="text"], input[type="search"], #search') as HTMLInputElement;
        if (input) {
          input.value = '';
          input.focus();
        }
      });

      await page.type('input[type="text"], input[type="search"], #search', searchTerm);

      // Wait for suggestions to appear
      await page.waitForTimeout(2000);

      // Extract suggestions - this code runs IN THE BROWSER
      const suggestions = await page.evaluate(() => {
        const results: string[] = [];

        // Look for various suggestion elements
        const suggestionSelectors = [
          '.autocomplete-suggestion',
          '.suggestion',
          '.dropdown-item',
          'datalist option',
          '.typeahead-suggestion',
          '.ui-menu-item',
          '.search-suggestion',
          '[role="option"]'
        ];

        for (const selector of suggestionSelectors) {
          const elements = document.querySelectorAll(selector);
          elements.forEach((el: any) => {
            const text = el.textContent?.trim() || el.value?.trim();
            if (text && text.length > 2 && !results.includes(text)) {
              results.push(text);
            }
          });
        }

        // Also look for dropdown/autocomplete containers
        const containers = document.querySelectorAll('.autocomplete, .dropdown, .suggestions');
        containers.forEach((container: any) => {
          const items = container.querySelectorAll('a, li, div, span');
          items.forEach((item: any) => {
            const text = item.textContent?.trim();
            if (text && text.length > 2 && !results.includes(text)) {
              results.push(text);
            }
          });
        });

        return results;
      });

      console.log(`✅ Puppeteer found ${suggestions.length} suggestions:`, suggestions);
      return suggestions.slice(0, 8);

    } catch (error) {
      console.error('Puppeteer suggestions failed:', error);
      return [];
    } finally {
      await page.close();
    }
  }

  async searchDrugWithSuggestions(searchTerm: string): Promise<any> {
    try {
      // Step 1: Try common drug name patterns first (quick wins)
      const commonPatterns = [
        searchTerm,
        `${searchTerm}-hydrochloride`,
        `${searchTerm}-sulfate`,
        `${searchTerm}-phosphate`,
        `${searchTerm}-sodium`
      ];

      for (const pattern of commonPatterns) {
        const directResult = await this.getDrugDetailsDirect(pattern);
        if (directResult && directResult.name !== 'Not Found') {
          console.log(`✅ Found drug with pattern: ${pattern}`);
          return {
            drugs: [directResult],
            suggestions: [pattern],
            searchTerm,
            bestMatch: pattern
          };
        }
      }

      // Step 2: If patterns fail, try suggestions
      const suggestions = await this.getSuggestions(searchTerm);

      if (suggestions.length > 0) {
        // Try the best suggestion
        const bestMatch = suggestions[0];
        const drugDetails = await this.getDrugDetails(bestMatch);

        if (drugDetails && drugDetails.name !== 'Not Found') {
          return {
            drugs: [drugDetails],
            suggestions,
            searchTerm,
            bestMatch
          };
        }
      }

      // Step 3: No results found
      return {
        drugs: [],
        suggestions,
        searchTerm,
        bestMatch: null
      };

    } catch (error) {
      console.error('Search with suggestions failed:', error);
      return { drugs: [], suggestions: [], searchTerm };
    }
  }

  async getDrugDetails(drugName: string): Promise<DrugInfo | null> {
    await this.init();

    const page = await this.browser.newPage();

    try {
      // Convert drug name to URL format
      const urlName = drugName.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

      const url = `https://www.e-lactancia.org/breastfeeding/${urlName}/product/`;

      console.log(`🤖 Puppeteer: Getting details from ${url}`);

      await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 30000
      });

      // Extract drug information - this code runs IN THE BROWSER
      const drugInfo = await page.evaluate((currentUrl: string) => {
        const name = document.querySelector('h1.term-header, h1')?.textContent?.trim() || 'Unknown';
        const riskDescription = document.querySelector('.risk-header p, .risk-header h4, .risk-header')?.textContent?.trim() || 'Risk assessment available';

        // Get first paragraph for summary
        const paragraphs = document.querySelectorAll('p');
        let summary = 'Details available on source page';
        for (let i = 0; i < paragraphs.length; i++) {
          const text = paragraphs[i].textContent?.trim();
          if (text && text.length > 50) {
            summary = text.substring(0, 300) + (text.length > 300 ? '...' : '');
            break;
          }
        }

        // Extract risk level from page content
        let riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH' = 'MODERATE';
        let riskLevelNumber = 2;

        const bodyHTML = document.body.innerHTML;
        if (bodyHTML.includes('risk-level0')) {
          riskLevel = 'LOW';
          riskLevelNumber = 0;
        } else if (bodyHTML.includes('risk-level1')) {
          riskLevel = 'LOW';
          riskLevelNumber = 1;
        } else if (bodyHTML.includes('risk-level2')) {
          riskLevel = 'HIGH';
          riskLevelNumber = 2;
        } else if (bodyHTML.includes('risk-level3')) {
          riskLevel = 'VERY_HIGH';
          riskLevelNumber = 3;
        }

        // Look for alternatives
        const alternatives: string[] = [];
        const altLinks = document.querySelectorAll('.risk-alt a, a[class*="link_r"]');
        altLinks.forEach((link: any) => {
          const text = link.textContent?.trim();
          if (text && text.length > 2 && text.length < 50) {
            alternatives.push(text);
          }
        });

        return {
          name,
          riskLevel,
          riskLevelNumber,
          riskDescription,
          summary,
          alternatives: alternatives.length > 0 ? alternatives.slice(0, 5) : undefined,
          sourceUrl: currentUrl,
          lastUpdated: new Date().toISOString(),
          id: name.toLowerCase().replace(/[^a-z0-9]/g, '_')
        };
      }, url);

      return drugInfo as DrugInfo;

    } catch (error) {
      console.error('Failed to get drug details:', error);
      return null;
    } finally {
      await page.close();
    }
  }

  // Fallback method for direct search without suggestions
  async getDrugDetailsDirect(searchTerm: string): Promise<DrugInfo | null> {
    return await this.getDrugDetails(searchTerm);
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      console.log('🤖 Puppeteer browser closed');
    }
  }
}

export const puppeteerScraper = new PuppeteerScraper();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down Puppeteer...');
  await puppeteerScraper.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await puppeteerScraper.close();
  process.exit(0);
});
