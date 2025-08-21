// services/ApiService.ts
import axios from 'axios';

// API Base URL - adjust for your setup
const API_BASE_URL = __DEV__
  ? 'http://192.168.8.38:3001/api'   // Your actual IP
  : 'https://your-backend-url.com/api';

export interface Drug {
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

export interface SearchResult {
  drugs: Drug[];
  searchTerm: string;
  totalResults: number;
  source: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  error?: string;
}

class ApiService {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log(`✅ API Response: ${response.status}`);
        return response;
      },
      (error) => {
        console.error('❌ API Response Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Search for drugs
  async searchDrugs(searchTerm: string): Promise<SearchResult> {
    try {
      const response = await this.axiosInstance.get<ApiResponse<SearchResult>>(
        `/drugs/search/${encodeURIComponent(searchTerm)}`
      );

      if (!response.data.success) {
        throw new Error(response.data.error || 'Search failed');
      }

      return response.data.data;
    } catch (error) {
      console.error('Search drugs failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Search failed');
    }
  }

  // Get drug details
  async getDrugDetails(drugUrl: string): Promise<Drug> {
    try {
      const response = await this.axiosInstance.get<ApiResponse<Drug>>(
        `/drugs/details?url=${encodeURIComponent(drugUrl)}`
      );

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to get drug details');
      }

      return response.data.data;
    } catch (error) {
      console.error('Get drug details failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to get drug details');
    }
  }

  // Test backend connection
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.axiosInstance.get('/drugs/health');

      if (response.data.success) {
        return {
          success: true,
          message: 'Backend connected successfully!'
        };
      } else {
        return {
          success: false,
          message: 'Backend is not responding properly'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Get risk level color for UI
  getRiskLevelColor(riskLevel: Drug['riskLevel']): string {
    switch (riskLevel) {
      case 'LOW':
        return '#4CAF50'; // Green
      case 'MODERATE':
        return '#FF9800'; // Orange
      case 'HIGH':
        return '#F44336'; // Red
      case 'VERY_HIGH':
        return '#9C27B0'; // Purple
      default:
        return '#757575'; // Grey
    }
  }

  // Get risk level text for UI
  getRiskLevelText(riskLevel: Drug['riskLevel']): string {
    switch (riskLevel) {
      case 'LOW':
        return 'Low Risk';
      case 'MODERATE':
        return 'Moderate Risk';
      case 'HIGH':
        return 'High Risk';
      case 'VERY_HIGH':
        return 'Very High Risk';
      default:
        return 'Unknown Risk';
    }
  }
}

export const apiService = new ApiService();
