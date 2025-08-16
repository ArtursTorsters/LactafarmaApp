import NetInfo from '@react-native-community/netinfo';
import { API_CONFIG } from '../../utils/constants';
import type {
  Drug,
  DrugGroup,
  DrugDetail,
  DrugBrand,
  ApiResponse,
  SearchFilters,
  ApiError
} from '../../types';

class LactafarmaApiService {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  // Network connectivity check
  private async checkNetworkConnectivity(): Promise<boolean> {
    const netInfo = await NetInfo.fetch();
    return netInfo.isConnected ?? false;
  }

  // Generic API call method with error handling
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Check network connectivity
    const isConnected = await this.checkNetworkConnectivity();
    if (!isConnected) {
      throw new ApiError('No internet connection available');
    }

    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();

    // Set timeout
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new ApiError(
          `API Error: ${response.status} ${response.statusText}`,
          response.status.toString(),
          response.status
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error.name === 'AbortError') {
        throw new ApiError('Request timed out');
      }

      throw new ApiError('Network error occurred');
    }
  }

  // Search drugs by name or keyword
  async searchDrugs(query: string, filters?: SearchFilters): Promise<Drug[]> {
    if (!query.trim()) {
      throw new ApiError('Search query cannot be empty');
    }

    const params = new URLSearchParams({
      q: query.trim(),
      ...(filters?.category && { category: filters.category }),
      ...(filters?.riskLevel && { riskLevel: filters.riskLevel }),
      ...(filters?.limit && { limit: filters.limit.toString() }),
      ...(filters?.offset && { offset: filters.offset.toString() }),
    });

    const response = await this.makeRequest<ApiResponse<Drug[]>>(
      `/drugs/search?${params.toString()}`
    );

    return response.data || [];
  }

  // Get all drug groups/categories
  async getDrugGroups(): Promise<DrugGroup[]> {
    const response = await this.makeRequest<ApiResponse<DrugGroup[]>>('/druggroups');
    return response.data || [];
  }

  // Get detailed information about a specific drug
  async getDrugDetails(drugId: string): Promise<DrugDetail> {
    if (!drugId) {
      throw new ApiError('Drug ID is required');
    }

    const response = await this.makeRequest<ApiResponse<DrugDetail>>(
      `/drugs/${encodeURIComponent(drugId)}`
    );

    if (!response.data) {
      throw new ApiError('Drug not found');
    }

    return response.data;
  }

  // Get brands for a specific drug
  async getDrugBrands(drugId: string): Promise<DrugBrand[]> {
    if (!drugId) {
      throw new ApiError('Drug ID is required');
    }

    const response = await this.makeRequest<ApiResponse<DrugBrand[]>>(
      `/drugs/${encodeURIComponent(drugId)}/brands`
    );

    return response.data || [];
  }

  // Get drugs by category
  async getDrugsByCategory(categoryId: string, limit = 50): Promise<Drug[]> {
    if (!categoryId) {
      throw new ApiError('Category ID is required');
    }

    const params = new URLSearchParams({
      limit: limit.toString(),
    });

    const response = await this.makeRequest<ApiResponse<Drug[]>>(
      `/druggroups/${encodeURIComponent(categoryId)}/drugs?${params.toString()}`
    );

    return response.data || [];
  }

  // Get recent drug alerts/updates
  async getDrugAlerts(limit = 10): Promise<any[]> {
    const params = new URLSearchParams({
      limit: limit.toString(),
    });

    const response = await this.makeRequest<ApiResponse<any[]>>(
      `/alerts?${params.toString()}`
    );

    return response.data || [];
  }

  // Health check endpoint
  async healthCheck(): Promise<boolean> {
    try {
      await this.makeRequest<any>('/health');
      return true;
    } catch {
      return false;
    }
  }
}

// Custom API Error class
// class ApiError extends Error {
//   code?: string;
//   status?: number;

//   constructor(message: string, code?: string, status?: number) {
//     super(message);
//     this.name = 'ApiError';
//     this.code = code;
//     this.status = status;
//   }
// }

// Export singleton instance
export const lactafarmaApi = new LactafarmaApiService();
export { ApiError };

// src/hooks/useDrugSearch.ts
import { useState, useCallback } from 'react';
import { lactafarmaApi, ApiError } from '@/services/api/lactafarmaApi';
import type { Drug, SearchFilters } from '@/types';

interface UseDrugSearchResult {
  drugs: Drug[];
  loading: boolean;
  error: string | null;
  searchDrugs: (query: string, filters?: SearchFilters) => Promise<void>;
  clearResults: () => void;
  clearError: () => void;
}

export const useDrugSearch = (): UseDrugSearchResult => {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchDrugs = useCallback(async (query: string, filters?: SearchFilters) => {
    if (!query.trim()) {
      setError('Please enter a search term');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await lactafarmaApi.searchDrugs(query, filters);
      setDrugs(results);

      if (results.length === 0) {
        setError('No medications found for your search');
      }
    } catch (err) {
      const errorMessage = err instanceof ApiError
        ? err.message
        : 'An unexpected error occurred';
      setError(errorMessage);
      setDrugs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setDrugs([]);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    drugs,
    loading,
    error,
    searchDrugs,
    clearResults,
    clearError,
  };
};
