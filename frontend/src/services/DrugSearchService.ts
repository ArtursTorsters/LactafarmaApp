import { ELactanciaScraper } from '../../../backend/src/scraper/index'
import { DrugSuggestion, DrugDetails } from '../types';
import { cache } from '../utils/cache';
import NetInfo from '@react-native-community/netinfo';

class DrugSearchService {
  private scraper: ELactanciaScraper;
  private isOnline: boolean = true;

  constructor() {
    this.scraper = new ELactanciaScraper();
    this.initNetworkListener();
  }

  private initNetworkListener() {
    NetInfo.addEventListener(state => {
      this.isOnline = state.isConnected ?? false;
    });
  }

  async searchDrugs(query: string): Promise<DrugSuggestion[]> {
    try {
      const normalizedQuery = query.toLowerCase().trim();
      const cacheKey = `search_${normalizedQuery}`;

      // Always check cache first
      const cachedResults = await cache.get<DrugSuggestion[]>(cacheKey);

      // If offline, return cached data or empty
      if (!this.isOnline) {
        return cachedResults || [];
      }


      if (cachedResults) {
        const cacheAge = await this.getCacheAge(cacheKey);
        if (cacheAge > 7) {
          this.refreshInBackground(query);
        }

        return cachedResults;
      }

      // No cache, fetch from scraper
      const results = await this.scraper.searchDrugs(query);

      // Cache the results
      await cache.set(cacheKey, results);

      return results;
    } catch (error) {
      // If fetch fails, try to return cached data
      const cacheKey = `search_${query.toLowerCase().trim()}`;
      const cachedResults = await cache.get<DrugSuggestion[]>(cacheKey);

      if (cachedResults) {
        return cachedResults;
      }

      throw error;
    }
  }

  async getDrugDetails(drugName: string): Promise<DrugDetails | null> {
    try {
      const normalizedName = drugName.toLowerCase().trim();
      const cacheKey = `details_${normalizedName}`;

      // Check cache first
      const cachedDetails = await cache.get<DrugDetails>(cacheKey);

      // If offline, return cached data
      if (!this.isOnline) {
        return cachedDetails;
      }

      if (cachedDetails) {

        // Refresh in background if old
        const cacheAge = await this.getCacheAge(cacheKey);
        if (cacheAge > 7) {
          this.refreshDetailsInBackground(drugName);
        }

        return cachedDetails;
      }

      // No cache, fetch from scraper
      const details = await this.scraper.getDrugDetails(drugName);

      if (details) {
        await cache.set(cacheKey, details);
      }

      return details;
    } catch (error) {
      // Try stale cache on error
      const cacheKey = `details_${drugName.toLowerCase().trim()}`;
      const cachedDetails = await cache.get<DrugDetails>(cacheKey);

      if (cachedDetails) {
        return cachedDetails;
      }

      throw error;
    }
  }

  // Background refresh (non-blocking)
  private async refreshInBackground(query: string): Promise<void> {
    try {
      const results = await this.scraper.searchDrugs(query);
      const cacheKey = `search_${query.toLowerCase().trim()}`;
      await cache.set(cacheKey, results);
    } catch (error) {
    }
  }

  private async refreshDetailsInBackground(drugName: string): Promise<void> {
    try {
      const details = await this.scraper.getDrugDetails(drugName);
      if (details) {
        const cacheKey = `details_${drugName.toLowerCase().trim()}`;
        await cache.set(cacheKey, details);
      }
    } catch (error) {
    }
  }

  private async getCacheAge(cacheKey: string): Promise<number> {
    // Return days since cached
    return 0;
  }

  async getCacheStats() {
    return await cache.getCacheInfo();
  }

  async clearCache() {
    await cache.clearAll();
  }
}

export default new DrugSearchService();
