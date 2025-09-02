import { DrugSuggestion, DrugDetails } from '../types';
export class ELactanciaScraper {

  async searchDrugs(query: string): Promise<DrugSuggestion[]> {
    try {
      console.log(`🔍 Searching for: "${query}"`);
      const url = `https://www.e-lactancia.org/megasearch/?query=${encodeURIComponent(query)}`;
      console.log(`🌐 Request URL: ${url}`);

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

      console.log(`📡 Response status: ${response.status}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type') || '';
      let data: any;

      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.log('📄 Raw response preview:', text.substring(0, 500));
        try {
          data = JSON.parse(text);
        } catch {
          console.log('❌ Not JSON, might be HTML response');
          // If we get HTML, try to extract suggestions from autocomplete
          return this.extractSuggestionsFromHTML(text);
        }
      }

      console.log('📋 Search API response:', data);

      if (!Array.isArray(data)) {
        console.log('❌ Data is not an array:', typeof data);
        return [];
      }

      const suggestions: DrugSuggestion[] = data.map((item: any) => {
        const name = item.nombre_en || item.nombre || item.name || item.title || String(item);
        const id = item.id || item.drug_id || item.drugId;
        const type = item.type || item.tipo || 'product'; // default to product

        // Build URL using the slug/name format instead of ID
        const slug = this.createSlug(name);
        const url = `/breastfeeding/${slug}/${type}/`;

        console.log('🏷️ Processing item:', {
          name,
          id,
          slug,
          type,
          url,
          rawItem: item
        });

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

      const filtered = this.removeDuplicates(suggestions);
      console.log(`✅ Returning ${filtered.length} suggestions:`, filtered);
      return filtered;

    } catch (error) {
      console.error('💥 Search error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Search failed: ${errorMessage}`);
    }
  }

  private createSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  }

  private extractSuggestionsFromHTML(html: string): DrugSuggestion[] {
    // If we get HTML response (like autocomplete), try to extract suggestions
    const suggestions: DrugSuggestion[] = [];

    // Look for drug links in the HTML
    const linkPattern = /<a[^>]*href="\/breastfeeding\/([^\/]+)\/(product|writing)\/"[^>]*>([^<]+)<\/a>/gi;
    let match;

    while ((match = linkPattern.exec(html)) !== null) {
      const slug = match[1];
      const type = match[2];
      const name = match[3].trim();

      suggestions.push({
        name: name,
        url: `/breastfeeding/${slug}/${type}/`,
        category: type === 'product' ? 'Medicine' : 'Article'
      });
    }

    console.log('📋 Extracted from HTML:', suggestions);
    return this.removeDuplicates(suggestions);
  }

  async getDrugDetails(drugName: string): Promise<DrugDetails | null> {
    try {
      console.log(`🎯 Getting details for: "${drugName}"`);

      // First, search for the drug to get suggestions
      const suggestions = await this.searchDrugs(drugName);
      console.log(`🔍 Found ${suggestions.length} suggestions for details lookup`);

      if (suggestions.length === 0) {
        console.log('❌ No suggestions found, trying direct URL construction');
        // Try to construct URL directly from drug name
        const slug = this.createSlug(drugName);
        const directSuggestion: DrugSuggestion = {
          name: drugName,
          url: `/breastfeeding/${slug}/product/`,
          category: 'Medicine'
        };
        suggestions.push(directSuggestion);
      }

      // Try each suggestion until we find one that works
      for (const suggestion of suggestions) {
        try {
          const result = await this.fetchDrugDetailsFromURL(suggestion);
          if (result) {
            console.log(`✅ Successfully got details using: ${suggestion.url}`);
            return result;
          }
        } catch (error) {
          // console.log(`❌ Failed with URL ${suggestion.url}:`, error.message);
          // Continue to next suggestion
        }
      }

      // If no suggestion worked, try alternative URL patterns
      const slug = this.createSlug(drugName);
      const alternativePatterns = [
        `/breastfeeding/${slug}/product/`,
        `/breastfeeding/${slug}/writing/`,
        `/breastfeeding/${drugName.toLowerCase()}/product/`,
        `/breastfeeding/${drugName.toLowerCase()}/writing/`
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
            console.log(`✅ Successfully got details using alternative pattern: ${pattern}`);
            return result;
          }
        } catch (error) {
          // console.log(`❌ Alternative pattern failed ${pattern}:`, error.message);
        }
      }

      console.log('❌ All URL patterns failed');
      return null;

    } catch (error) {
      console.error('💥 Get drug details error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to get drug details: ${errorMessage}`);
    }
  }

  private async fetchDrugDetailsFromURL(suggestion: DrugSuggestion): Promise<DrugDetails | null> {
    if (!suggestion.url) return null;

    const detailUrl = suggestion.url.startsWith('http')
      ? suggestion.url
      : `https://www.e-lactancia.org${suggestion.url}`;

    console.log(`🌐 Fetching from: ${detailUrl}`);

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
    console.log(`📄 HTML received, length: ${html.length}`);

    // Extract slug/ID from URL for the details object
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

    console.log('✅ Extracted drug details:', drugDetails);
    return drugDetails;
  }

  private extractRiskLevel(html: string): string | undefined {
    const patterns = [
      // Look for risk level indicators
      /<div[^>]*class="[^"]*risk[^"]*"[^>]*>([^<]+)/i,
      /<span[^>]*class="[^"]*(?:risk|level|safety)[^"]*"[^>]*>([^<]+)/i,
      /<td[^>]*class="[^"]*(?:risk|level)[^"]*"[^>]*>([^<]+)/i,
      // Look for colored risk indicators
      /<div[^>]*style="[^"]*(?:background-color|color)[^"]*(?:green|red|yellow|orange)[^"]*"[^>]*>([^<]*)/i,
      // Look for specific risk terms
      /<[^>]*>([^<]*(?:very low|low|moderate|high|very high|compatible|avoid|caution)[^<]*)<\/[^>]*>/i,
      // Risk assessment text
      /(?:risk|safety|compatibility)[^:]*:\s*([^<\n.]{5,50})/i
    ];

    return this.extractFromHTML(html, patterns);
  }

  private extractDescription(html: string): string | undefined {
    const patterns = [
      // Meta description
      /<meta[^>]*name="description"[^>]*content="([^"]+)"/i,
      // Page title
      /<title[^>]*>([^<]+)<\/title>/i,
      // Main content paragraphs
      /<div[^>]*class="[^"]*(?:description|summary|content|main)[^"]*"[^>]*>\s*<p[^>]*>([^<]+)/i,
      /<p[^>]*class="[^"]*(?:description|summary)[^"]*"[^>]*>([^<]+)/i,
      // First substantial paragraph
      /<p[^>]*>([^<]{100,500})<\/p>/i,
      // Any substantial text content
      /<div[^>]*class="[^"]*content[^"]*"[^>]*>([^<]{50,300})/i
    ];

    return this.extractFromHTML(html, patterns);
  }

  private extractRiskDescription(html: string): string | undefined {
    const patterns = [
      // Specific risk description areas
      /<div[^>]*class="[^"]*risk-description[^"]*"[^>]*>([^<]+)/i,
      /<div[^>]*class="[^"]*safety[^"]*"[^>]*>([^<]+)/i,
      // Look for paragraphs containing safety/risk information
      /<p[^>]*>([^<]*(?:safe|risk|compatible|avoid|caution|breastfeeding|nursing)[^<]{20,200})</i,
      /<div[^>]*>([^<]*(?:safe|risk|compatible|avoid|caution|breastfeeding|nursing)[^<]{20,200})</i,
      // Table cells with risk info
      /<td[^>]*>([^<]*(?:safe|risk|compatible|avoid|caution)[^<]{10,100})</i
    ];

    return this.extractFromHTML(html, patterns);
  }

  private extractLastUpdate(html: string): string | undefined {
    const patterns = [
      // Update date patterns
      /<span[^>]*class="[^"]*(?:last-update|updated|date)[^"]*"[^>]*>([^<]+)/i,
      /<div[^>]*class="[^"]*(?:updated|date|last-modified)[^"]*"[^>]*>([^<]+)/i,
      // Generic date patterns in text
      /(?:updated|last\s+update|modified|fecha|actualizado):\s*([^<\n]{5,30})/i,
      // ISO date format
      /(\d{4}-\d{2}-\d{2})/,
      // US date format
      /(\d{1,2}\/\d{1,2}\/\d{4})/,
      // Written date format
      /([A-Z][a-z]{2,8}\s+\d{1,2},?\s+\d{4})/
    ];

    return this.extractFromHTML(html, patterns);
  }

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
          .substring(0, 300); // Reasonable limit

        if (result.length > 3) {
          console.log('📝 Extracted:', result.substring(0, 50), '...');
          return result;
        }
      }
    }
    return undefined;
  }

  private extractAlternatives(html: string): string[] {
    const patterns = [
      /<div[^>]*class="[^"]*alternatives[^"]*"[^>]*>(.*?)<\/div>/si,
      /<ul[^>]*class="[^"]*alternatives[^"]*"[^>]*>(.*?)<\/ul>/si,
      /<div[^>]*class="[^"]*related[^"]*"[^>]*>(.*?)<\/div>/si
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        const listItems = match[1].match(/<li[^>]*>([^<]+)<\/li>/gi) || [];
        const alternatives = listItems
          .map(item => item.replace(/<\/?[^>]+(>|$)/g, "").trim())
          .filter(alt => alt.length > 2);

        if (alternatives.length > 0) {
          console.log('🔄 Found alternatives:', alternatives);
          return alternatives;
        }
      }
    }
    return [];
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

  async searchMultipleDrugs(queries: string[]): Promise<{ [key: string]: DrugSuggestion[] }> {
    const results: { [key: string]: DrugSuggestion[] } = {};

    for (const query of queries) {
      try {
        results[query] = await this.searchDrugs(query);
        // Be respectful to the server
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error searching for "${query}":`, error);
        results[query] = [];
      }
    }

    return results;
  }

  async isHealthy(): Promise<boolean> {
    try {
      const testResults = await this.searchDrugs('aspirin');
      return testResults.length > 0;
    } catch (error) {
      return false;
    }
  }

  async close(): Promise<void> {
    // No resources to clean up
  }
}
