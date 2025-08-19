// src/services/ScraperService.ts
import axios from 'axios';
import * as cheerio from 'cheerio';

export interface DrugInfo {
  id: string;
  name: string;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';
  riskLevelNumber: number;
  riskDescription: string;
  summary: string;
  alternatives?: string[];
  lastUpdated: string;
  sourceUrl: string;
}

export interface SearchResult {
  drugs: DrugInfo[];
  searchTerm: string;
  totalResults: number;
  source: string;
}

class ScraperService {
  private baseUrl = 'https://www.e-lactancia.org';
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheExpiry = 60 * 60 * 1000; // 1 hour
  private lastRequestTime = 0;
  private requestDelay = 2000; // 2 seconds between requests

  async searchDrug(searchTerm: string): Promise<SearchResult> {
    // Check cache first
    const cacheKey = `search_${searchTerm.toLowerCase()}`;
    const cached = this.getCached(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      await this.respectRateLimit();

      // Try direct drug URL first (many drugs have predictable URLs)
      const directUrl = `${this.baseUrl}/breastfeeding/${encodeURIComponent(searchTerm.toLowerCase())}/product/`;

      try {
        const directHtml = await this.makeRequest(directUrl);
        const directDrug = this.parseDrugPage(directHtml, directUrl);

        if (directDrug) {
          const result = {
            drugs: [directDrug],
            searchTerm,
            totalResults: 1,
            source: 'e-lactancia.org'
          };
          this.setCache(cacheKey, result);
          return result;
        }
      } catch (error) {
        console.log(`Direct URL failed for ${searchTerm}, trying search...`);
      }

      // Fallback to search page
      const searchUrl = `${this.baseUrl}/buscar/?q=${encodeURIComponent(searchTerm)}`;
      const html = await this.makeRequest(searchUrl);

      const result = this.parseSearchResults(html, searchTerm);

      // Cache the result
      this.setCache(cacheKey, result);

      return result;
    } catch (error) {
      console.error('Search failed:', error);
      return {
        drugs: [],
        searchTerm,
        totalResults: 0,
        source: 'e-lactancia.org'
      };
    }
  }

  async getDrugDetails(drugUrl: string): Promise<DrugInfo | null> {
    const cacheKey = `drug_${drugUrl}`;
    const cached = this.getCached(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      await this.respectRateLimit();

      const fullUrl = drugUrl.startsWith('http') ? drugUrl : `${this.baseUrl}${drugUrl}`;
      const html = await this.makeRequest(fullUrl);

      const drugInfo = this.parseDrugPage(html, fullUrl);

      if (drugInfo) {
        this.setCache(cacheKey, drugInfo);
      }

      return drugInfo;
    } catch (error) {
      console.error('Failed to get drug details:', error);
      return null;
    }
  }

  async getPopularDrugs(): Promise<DrugInfo[]> {
    const cacheKey = 'popular_drugs';
    const cached = this.getCached(cacheKey);
    if (cached) {
      return cached;
    }

    // Return some common drugs for now
    const commonDrugs = [
      'paracetamol', 'ibuprofen', 'amoxicillin', 'aspirin', 'omeprazole'
    ];

    const drugs: DrugInfo[] = [];

    for (const drugName of commonDrugs) {
      try {
        const result = await this.searchDrug(drugName);
        if (result.drugs.length > 0) {
          drugs.push(result.drugs[0]);
        }
        await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay
      } catch (error) {
        console.error(`Failed to get popular drug ${drugName}:`, error);
      }
    }

    this.setCache(cacheKey, drugs);
    return drugs;
  }

  private async respectRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < this.requestDelay) {
      await new Promise(resolve =>
        setTimeout(resolve, this.requestDelay - timeSinceLastRequest)
      );
    }

    this.lastRequestTime = Date.now();
  }

  private async makeRequest(url: string): Promise<string> {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'LactafarmaApp-Backend/1.0 (Educational, helping mothers)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
      },
      timeout: 10000,
      maxRedirects: 3,
    });

    return response.data;
  }

  private parseSearchResults(html: string, searchTerm: string): SearchResult {
    const $ = cheerio.load(html);
    const drugs: DrugInfo[] = [];

    // Look for search result links
    $('a[href*="/breastfeeding/"]').each((_, element) => {
      try {
        const $link = $(element);
        const href = $link.attr('href');
        const text = $link.text().trim();

        if (href && text && text.length > 1 && !text.toLowerCase().includes('war')) {
          drugs.push({
            id: this.generateId(text),
            name: text,
            riskLevel: 'MODERATE', // Default, will be updated when details are fetched
            riskLevelNumber: 2,
            riskDescription: 'Click for detailed risk assessment',
            summary: 'Click for detailed compatibility information',
            sourceUrl: href.startsWith('http') ? href : `${this.baseUrl}${href}`,
            lastUpdated: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error('Error parsing search result:', error);
      }
    });

    return {
      drugs,
      searchTerm,
      totalResults: drugs.length,
      source: 'e-lactancia.org'
    };
  }

  private parseDrugPage(html: string, url: string): DrugInfo | null {
    const $ = cheerio.load(html);

    try {
      // Extract drug name from h1.term-header
      const name = $('h1.term-header').first().text().trim();

      if (!name) {
        throw new Error('No drug name found');
      }

      // Extract risk level from CSS classes
      const riskLevel = this.extractRiskLevelFromHTML(html, $);

      // Extract risk description from h2.risk-header
      const riskDescription = $('.risk-header p').first().text().trim() ||
                              $('.risk-header h4').first().text().trim() ||
                              'Risk assessment available';

      // Extract detailed summary from the content area
      const summaryParagraphs: string[] = [];
      $('.risk-comment-level0 p, .risk-comment-level1 p, .risk-comment-level2 p, .risk-comment-level3 p').each((_, el) => {
        const text = $(el).text().trim();
        if (text && !text.includes('See below') && !text.includes('More information')) {
          summaryParagraphs.push(text);
        }
      });

      const summary = summaryParagraphs.length > 0
        ? summaryParagraphs.slice(0, 3).join(' ') // First 3 paragraphs
        : 'Detailed compatibility information available';

      // Look for alternatives
      const alternatives: string[] = [];
      $('.risk-alt a, .link_r0, .link_r1').each((_, el) => {
        const alt = $(el).text().trim();
        if (alt && alt.length > 2 && !alt.includes('More information')) {
          alternatives.push(alt);
        }
      });

      // Extract last update date
      const lastUpdateText = $('.last-update').text().trim();
      const lastUpdated = lastUpdateText ?
        this.parseUpdateDate(lastUpdateText) :
        new Date().toISOString();

      return {
        id: this.generateId(name),
        name,
        riskLevel: riskLevel.level,
        riskLevelNumber: riskLevel.number,
        riskDescription,
        summary: this.cleanSummary(summary),
        alternatives: alternatives.length > 0 ? alternatives.slice(0, 5) : undefined,
        sourceUrl: url,
        lastUpdated,
      };
    } catch (error) {
      console.error('Error parsing drug page:', error);
      return null;
    }
  }

  private extractRiskLevelFromHTML(html: string, $: cheerio.CheerioAPI): { level: DrugInfo['riskLevel'], number: number } {
    // Look for risk-level classes in the HTML
    if (html.includes('risk-level0') || $('.risk-level0').length > 0) {
      return { level: 'LOW', number: 0 };
    } else if (html.includes('risk-level1') || $('.risk-level1').length > 0) {
      return { level: 'LOW', number: 1 };
    } else if (html.includes('risk-level2') || $('.risk-level2').length > 0) {
      return { level: 'HIGH', number: 2 };
    } else if (html.includes('risk-level3') || $('.risk-level3').length > 0) {
      return { level: 'VERY_HIGH', number: 3 };
    }

    // Fallback: look for text indicators
    const riskText = $('.risk-header').text().toLowerCase();
    if (riskText.includes('compatible') || riskText.includes('safe')) {
      return { level: 'LOW', number: 0 };
    } else if (riskText.includes('likely')) {
      return { level: 'LOW', number: 1 };
    } else if (riskText.includes('limited') || riskText.includes('unsafe')) {
      return { level: 'HIGH', number: 2 };
    } else if (riskText.includes('incompatible') || riskText.includes('very unsafe')) {
      return { level: 'VERY_HIGH', number: 3 };
    }

    return { level: 'MODERATE', number: 2 };
  }

  private cleanSummary(summary: string): string {
    // Remove reference numbers and clean up the text
    return summary
      .replace(/\([\w\s,]+\d{4}[^)]*\)/g, '') // Remove citation references
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
      .substring(0, 500) // Limit length
      + (summary.length > 500 ? '...' : '');
  }

  private parseUpdateDate(dateText: string): string {
    // Try to parse "Last update April 5, 2025" format
    const match = dateText.match(/(\w+)\s+(\d+),\s+(\d{4})/);
    if (match) {
      const [, month, day, year] = match;
      const monthNames = ['january', 'february', 'march', 'april', 'may', 'june',
                         'july', 'august', 'september', 'october', 'november', 'december'];
      const monthIndex = monthNames.indexOf(month.toLowerCase());
      if (monthIndex !== -1) {
        return new Date(parseInt(year), monthIndex, parseInt(day)).toISOString();
      }
    }
    return new Date().toISOString();
  }

  private generateId(name: string): string {
    return name.toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
  }

  private getCached(key: string): any {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clearExpiredCache(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp >= this.cacheExpiry) {
        this.cache.delete(key);
      }
    }
  }
}

export const scraperService = new ScraperService();

// Clean up cache every hour
setInterval(() => {
  scraperService.clearExpiredCache();
}, 60 * 60 * 1000);
