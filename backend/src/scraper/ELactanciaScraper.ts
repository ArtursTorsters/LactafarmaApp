import { DrugSuggestion, DrugDetails } from '../types';

export class ELactanciaScraper {

  // Main search method that queries e-lactancia API and returns drug suggestions
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
          return this.extractSuggestionsFromHTML(text);
        }
      }

      if (!Array.isArray(data)) {
        return [];
      }

      const suggestions: DrugSuggestion[] = data.map((item: any) => {
        const name = item.nombre_en || item.nombre || item.name || item.title || String(item);
        const id = item.id || item.drug_id || item.drugId;
        const type = this.determineUrlType(item);

        const slug = this.createSlug(name);
        const url = `/breastfeeding/${slug}/${type}/`;

        return {
          name: name,
          url: url,
          category: item.category || item.categoria || undefined
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

  // Determines the correct URL type (product/tradename/writing) based on API response data
  private determineUrlType(item: any): string {
    if (item.term === 'marca' || item.type === 'brand' || item.tipo === 'marca') {
      return 'tradename';
    }

    if (item.term === 'sinonimo' || item.type === 'synonym') {
      return 'product';
    }

    if (item.type === 'writing' || item.tipo === 'writing') {
      return 'writing';
    }

    return 'product';
  }

  // Converts drug names to URL-safe slugs for e-lactancia URLs
  private createSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  // Fallback method to extract suggestions from HTML when JSON parsing fails
  private extractSuggestionsFromHTML(html: string): DrugSuggestion[] {
    const suggestions: DrugSuggestion[] = [];

    const linkPattern = /<a[^>]*href="\/breastfeeding\/([^\/]+)\/(product|writing|tradename)\/"[^>]*>([^<]+)<\/a>/gi;
    let match;

    while ((match = linkPattern.exec(html)) !== null) {
      const slug = match[1];
      const type = match[2];
      const name = match[3].trim();

      suggestions.push({
        name: name,
        url: `/breastfeeding/${slug}/${type}/`,
        category: this.getCategoryFromType(type)
      });
    }

    return this.removeDuplicates(suggestions);
  }

  // Maps URL type to human-readable category name
  private getCategoryFromType(type: string): string {
    switch (type) {
      case 'product': return 'Medicine';
      case 'tradename': return 'Brand Name';
      case 'writing': return 'Article';
      default: return 'Medicine';
    }
  }

  // Main method to get detailed drug information by trying multiple URL patterns
  async getDrugDetails(drugName: string): Promise<DrugDetails | null> {
    try {
      const suggestions = await this.searchDrugs(drugName);

      if (suggestions.length === 0) {
        const slug = this.createSlug(drugName);
        const directSuggestion: DrugSuggestion = {
          name: drugName,
          url: `/breastfeeding/${slug}/product/`,
          category: 'Medicine'
        };
        suggestions.push(directSuggestion);
      }

      for (const suggestion of suggestions) {
        try {
          const result = await this.fetchDrugDetailsFromURL(suggestion);
          if (result) {
            return result;
          }
        } catch (error) {
          continue;
        }
      }

      const slug = this.createSlug(drugName);
      const alternativePatterns = [
        `/breastfeeding/${slug}/product/`,
        `/breastfeeding/${slug}/tradename/`,
        `/breastfeeding/${slug}/writing/`,
        `/breastfeeding/${this.createSlug(drugName)}/product/`,
        `/breastfeeding/${this.createSlug(drugName)}/tradename/`,
        `/breastfeeding/${this.createSlug(drugName)}/writing/`
      ];

      for (const pattern of alternativePatterns) {
        try {
          const suggestion: DrugSuggestion = {
            name: drugName,
            url: pattern,
            category: 'Medicine'
          };
          const result = await this.fetchDrugDetailsFromURL(suggestion);
          if (result) {
            return result;
          }
        } catch (error) {
          continue;
        }
      }

      return null;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to get drug details: ${errorMessage}`);
    }
  }

  // Fetches and parses drug details from a specific URL
  private async fetchDrugDetailsFromURL(suggestion: DrugSuggestion): Promise<DrugDetails | null> {
    if (!suggestion.url) return null;

    const detailUrl = suggestion.url.startsWith('http')
      ? suggestion.url
      : `https://www.e-lactancia.org${suggestion.url}`;

    const response = await fetch(detailUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.e-lactancia.org/',
        'Cache-Control': 'no-cache'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();

    const urlMatch = detailUrl.match(/\/breastfeeding\/([^\/]+)\//);
    const extractedId = urlMatch ? urlMatch[1] : this.createSlug(suggestion.name);

    const drugDetails: DrugDetails = {
      name: suggestion.name,
      id: extractedId,
      riskLevel: this.extractRiskLevel(html),
      description: this.extractDescription(html),
      riskDescription: this.extractRiskDescription(html),
      lastUpdate: this.extractLastUpdate(html),
      alternatives: this.extractAlternatives(html)
    };

    return drugDetails;
  }

  // Extracts breastfeeding risk level from CSS classes and header text
  private extractRiskLevel(html: string): string | undefined {
    const riskLevelMatch = html.match(/class="[^"]*risk-level(\d+)[^"]*"/);
    if (riskLevelMatch) {
      const level = riskLevelMatch[1];
      const riskLevelMap: { [key: string]: string } = {
        '0': 'Very Low Risk',
        '1': 'Low Risk',
        '2': 'Moderate Risk',
        '3': 'High Risk',
        '4': 'Very High Risk'
      };

      if (riskLevelMap[level]) {
        return riskLevelMap[level];
      }
    }

    const riskHeaderMatch = html.match(/<h2[^>]*class="risk-header"[^>]*>.*?<p>([^<]+)<\/p>/s);
    if (riskHeaderMatch) {
      return riskHeaderMatch[1].trim();
    }

    const patterns = [
      /<div[^>]*class="[^"]*risk[^"]*"[^>]*>([^<]+)/i,
      /<span[^>]*class="[^"]*(?:risk|level|safety)[^"]*"[^>]*>([^<]+)/i,
      /<h2[^>]*>([^<]*(?:compatible|compatibility|safe|risk)[^<]*)<\/h2>/i,
      /<h4[^>]*>([^<]*(?:safe|risk|compatible|avoid|caution)[^<]*)<\/h4>/i
    ];

    return this.extractFromHTML(html, patterns);
  }

  // Extracts the main drug description from content paragraphs
  private extractDescription(html: string): string | undefined {
    const contentMatch = html.match(/<div[^>]*class="[^"]*risk-comment-level\d+[^"]*"[^>]*>(.*?)<\/div>/s);
    if (contentMatch) {
      const paragraphs = contentMatch[1].match(/<p[^>]*>.*?<\/p>/gs);
      if (paragraphs) {
        const cleanText = paragraphs
          .map(p => p.replace(/<[^>]*>/g, ' ').trim())
          .filter(p => p.length > 20)
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();

        if (cleanText.length > 50) {
          return cleanText.substring(0, 500);
        }
      }
    }

    const metaMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/i);
    if (metaMatch) {
      return metaMatch[1].trim();
    }

    return undefined;
  }

  // Extracts specific risk description text from h4 tags and risk-related paragraphs
  private extractRiskDescription(html: string): string | undefined {
    const riskDescMatch = html.match(/<h4[^>]*>([^<]*(?:safe|risk|compatible|avoid|caution|adverse|effects)[^<]*)<\/h4>/i);
    if (riskDescMatch) {
      return riskDescMatch[1].trim();
    }

    const patterns = [
      /<p[^>]*>([^<]*(?:safe|risk|compatible|avoid|caution|breastfeeding|nursing)[^<]{30,200})<\/p>/i,
      /<div[^>]*>([^<]*(?:safe|risk|compatible|avoid|caution|breastfeeding|nursing)[^<]{30,200})<\/div>/i,
    ];

    return this.extractFromHTML(html, patterns);
  }

  // Extracts last update date from various date patterns in the HTML
  private extractLastUpdate(html: string): string | undefined {
    const patterns = [
      /(?:updated|last\s+update|modified|fecha|actualizado):\s*([^<\n]{5,30})/i,
      /(\d{4}-\d{2}-\d{2})/,
      /(\d{1,2}\/\d{1,2}\/\d{4})/,
      /([A-Z][a-z]{2,8}\s+\d{1,2},?\s+\d{4})/
    ];

    return this.extractFromHTML(html, patterns);
  }

  // Extracts alternative medications from the alternatives sidebar section
  private extractAlternatives(html: string): string[] {
    const alternativesMatch = html.match(/<div[^>]*class="[^"]*risk-alt[^"]*"[^>]*>.*?<ul[^>]*>(.*?)<\/ul>/s);
    if (alternativesMatch) {
      const listItems = alternativesMatch[1].match(/<li[^>]*>.*?<a[^>]*[^>]*>([^<]+)<\/a>/g);
      if (listItems) {
        const alternatives = listItems
          .map(item => {
            const nameMatch = item.match(/<a[^>]*>([^<]+)<\/a>/);
            return nameMatch ? nameMatch[1].trim() : '';
          })
          .filter(alt => alt.length > 2 && alt.length < 100)
          .slice(0, 10);

        if (alternatives.length > 0) {
          return alternatives;
        }
      }
    }

    const patterns = [
      /<div[^>]*class="[^"]*alternatives[^"]*"[^>]*>(.*?)<\/div>/si,
      /<ul[^>]*class="[^"]*alternatives[^"]*"[^>]*>(.*?)<\/ul>/si,
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        const listItems = match[1].match(/<li[^>]*>([^<]+)<\/li>/gi) || [];
        const alternatives = listItems
          .map(item => item.replace(/<\/?[^>]+(>|$)/g, "").trim())
          .filter(alt => alt.length > 2);

        if (alternatives.length > 0) {
          return alternatives;
        }
      }
    }

    return [];
  }

  // Generic HTML text extraction helper that tries multiple regex patterns
  private extractFromHTML(html: string, patterns: RegExp[]): string | undefined {
    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        const result = match[1]
          .trim()
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&nbsp;/g, ' ')
          .replace(/\s+/g, ' ')
          .substring(0, 300);

        if (result.length > 3) {
          return result;
        }
      }
    }
    return undefined;
  }

  // Removes duplicate suggestions based on drug name
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

  // Searches multiple drugs in sequence with delay to avoid rate limiting
  async searchMultipleDrugs(queries: string[]): Promise<{ [key: string]: DrugSuggestion[] }> {
    const results: { [key: string]: DrugSuggestion[] } = {};

    for (const query of queries) {
      try {
        results[query] = await this.searchDrugs(query);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        results[query] = [];
      }
    }

    return results;
  }

  // Health check method that tests basic search functionality
  async isHealthy(): Promise<boolean> {
    try {
      const testResults = await this.searchDrugs('aspirin');
      return testResults.length > 0;
    } catch (error) {
      return false;
    }
  }

  // Cleanup method (no-op since no persistent connections to close)
  async close(): Promise<void> {
    // No resources to clean up
  }
}
