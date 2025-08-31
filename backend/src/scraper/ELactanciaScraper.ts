
export interface DrugSuggestion {
  name: string;
  url?: string;
  category?: string;
}

export interface DrugDetails {
  name: string;
  riskLevel?: string;
  riskDescription?: string;
  alternatives?: string[];
  lastUpdate?: string;
  description?: string;
}

export class ELactanciaScraper {

  // Search for drug suggestions using the API endpoint
  async searchDrugs(query: string): Promise<DrugSuggestion[]> {
    try {
      const url = `https://www.e-lactancia.org/megasearch/?query=${encodeURIComponent(query)}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Referer': 'https://www.e-lactancia.org/',
          'Origin': 'https://www.e-lactancia.org'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type') || '';
      let data: any;

      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error('Response is not valid JSON');
        }
      }

      if (!Array.isArray(data)) {
        return [];
      }

      const suggestions: DrugSuggestion[] = data.map((item: any) => {
        const name = item.nombre_en || item.nombre || item.name || item.title || String(item);
        const id = item.id;
        const url = id ? `/breastfeeding/${id}/` : undefined;

        return {
          name: name,
          url: url,
          category: item.category || item.tipo || undefined
        };
      }).filter((suggestion: DrugSuggestion) =>
        suggestion.name &&
        suggestion.name.length > 0 &&
        suggestion.name !== 'undefined'
      );

      return this.removeDuplicates(suggestions);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Search failed: ${errorMessage}`);
    }
  }

  // Get detailed information about a specific drug
  async getDrugDetails(drugName: string): Promise<DrugDetails | null> {
    try {
      const suggestions = await this.searchDrugs(drugName);

      if (suggestions.length === 0) {
        return null;
      }

      const bestMatch = suggestions.find(s =>
        s.name.toLowerCase() === drugName.toLowerCase()
      ) || suggestions[0];

      if (!bestMatch.url) {
        return null;
      }

      const detailUrl = bestMatch.url.startsWith('http')
        ? bestMatch.url
        : `https://www.e-lactancia.org${bestMatch.url}`;

      const response = await fetch(detailUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Referer': 'https://www.e-lactancia.org/'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const html = await response.text();

      const drugDetails: DrugDetails = {
        name: bestMatch.name,
        riskLevel: this.extractFromHTML(html, [
          /<div[^>]*class="[^"]*risk[^"]*"[^>]*>([^<]+)/i,
          /<span[^>]*class="[^"]*level[^"]*"[^>]*>([^<]+)/i,
          /<div[^>]*class="[^"]*safety[^"]*"[^>]*>([^<]+)/i
        ]),
        description: this.extractFromHTML(html, [
          /<meta[^>]*name="description"[^>]*content="([^"]+)"/i,
          /<p[^>]*class="[^"]*description[^"]*"[^>]*>([^<]+)/i,
          /<div[^>]*class="[^"]*summary[^"]*"[^>]*>([^<]+)/i
        ]),
        riskDescription: this.extractFromHTML(html, [
          /<div[^>]*class="[^"]*risk-description[^"]*"[^>]*>([^<]+)/i,
          /<p[^>]*class="[^"]*safety[^"]*"[^>]*>([^<]+)/i
        ]),
        lastUpdate: this.extractFromHTML(html, [
          /<span[^>]*class="[^"]*last-update[^"]*"[^>]*>([^<]+)/i,
          /<div[^>]*class="[^"]*updated[^"]*"[^>]*>([^<]+)/i
        ])
      };

      return drugDetails;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to get drug details: ${errorMessage}`);
    }
  }

  // Search multiple drugs in a batch
  async searchMultipleDrugs(queries: string[]): Promise<{ [key: string]: DrugSuggestion[] }> {
    const results: { [key: string]: DrugSuggestion[] } = {};

    for (const query of queries) {
      try {
        results[query] = await this.searchDrugs(query);
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        results[query] = [];
      }
    }

    return results;
  }

  // Check if the scraper is working
  async isHealthy(): Promise<boolean> {
    try {
      const testResults = await this.searchDrugs('aspirin');
      return testResults.length > 0;
    } catch (error) {
      return false;
    }
  }

  // No-op cleanup method
  async close(): Promise<void> {
    // No resources to clean up
  }

  private extractFromHTML(html: string, patterns: RegExp[]): string | undefined {
    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        return match[1].trim()
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>');
      }
    }
    return undefined;
  }

  private removeDuplicates(suggestions: DrugSuggestion[]): DrugSuggestion[] {
    const seen = new Set<string>();
    return suggestions.filter(suggestion => {
      const key = suggestion.name.toLowerCase().trim();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }
}
