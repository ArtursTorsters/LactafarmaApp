import Constants from 'expo-constants';
import { DrugDetails, DrugSuggestion, SearchResponse, DetailsResponse } from '../types/index';

export class DrugSearchService {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL?: string) {
    // Use your local IP address
    this.baseURL = baseURL ||
      Constants.expoConfig?.extra?.API_BASE_URL ||
      (__DEV__
        ? 'http://192.168.8.38:3000' // Your IP
        : 'https://your-production-backend.com');
    this.timeout = 15000; // 15 seconds
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  // Search for drug suggestions
  async searchDrugs(query: string): Promise<DrugSuggestion[]> {
    if (!query || query.length < 2) {
      return [];
    }

    try {
      const response = await this.makeRequest<SearchResponse>(
        `/api/drugs/search/${encodeURIComponent(query)}`
      );

      return response.suggestions;
    } catch (error: any) {
      console.error('Drug search failed:', error);
      throw new Error(`Search failed: ${error.message}`);
    }
  }

  // Get detailed drug information
  async getDrugDetails(drugName: string): Promise<DrugDetails | null> {
    if (!drugName) {
      throw new Error('Drug name is required');
    }

    try {
      const response = await this.makeRequest<DetailsResponse>(
        `/api/drugs/details/${encodeURIComponent(drugName)}`
      );

      return response.details;
    } catch (error: any) {
      if (error.message.includes('404')) {
        return null; // Drug not found
      }
      console.error('Get drug details failed:', error);
      throw new Error(`Failed to get details: ${error.message}`);
    }
  }

  // Search multiple drugs at once
  async batchSearch(queries: string[]): Promise<{ [key: string]: DrugSuggestion[] }> {
    if (!Array.isArray(queries) || queries.length === 0) {
      return {};
    }

    if (queries.length > 10) {
      throw new Error('Maximum 10 queries allowed per batch');
    }

    try {
      const response = await this.makeRequest<{
        success: boolean;
        results: { [key: string]: DrugSuggestion[] };
      }>('/api/drugs/batch-search', {
        method: 'POST',
        body: JSON.stringify({ queries }),
      });

      return response.results;
    } catch (error: any) {
      console.error('Batch search failed:', error);
      throw new Error(`Batch search failed: ${error.message}`);
    }
  }

  // Health check method
  async checkHealth(): Promise<boolean> {
    try {
      await this.makeRequest('/health');
      return true;
    } catch {
      return false;
    }
  }

  // Update base URL (useful for switching environments)
  updateBaseURL(newBaseURL: string) {
    this.baseURL = newBaseURL;
  }
}

export const drugSearchService = new DrugSearchService();
export default drugSearchService;
