import { DrugDetails, DrugSuggestion } from '../types/index';
import { searchDrugs, searchMultipleDrugs } from './searchService';
import { getDrugDetails } from './detailsService';

export class ELactanciaScraper {

  // Search for drugs
  async searchDrugs(query: string): Promise<DrugSuggestion[]> {
    return searchDrugs(query);
  }

  // Get detailed drug information
  async getDrugDetails(drugName: string): Promise<DrugDetails | null> {
    return getDrugDetails(drugName);
  }

  // Search multiple drugs
  async searchMultipleDrugs(queries: string[]): Promise<{ [key: string]: DrugSuggestion[] }> {
    return searchMultipleDrugs(queries);
  }

  // Health check
  async isHealthy(): Promise<boolean> {
    try {
      const testResults = await this.searchDrugs('aspirin');
      return testResults.length > 0;
    } catch (error) {
      return false;
    }
  }

  // Cleanup method
  async close(): Promise<void> {
    // No resources to clean up
  }
}
