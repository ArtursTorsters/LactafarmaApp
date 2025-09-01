export type RiskLevel = 'very-low' | 'low' | 'moderate' | 'high' | 'very-high' | 'unknown';

// Core drug suggestion interface (used by search results)
export interface DrugSuggestion {
  name: string;
  url?: string;
  category?: string;
}

// Detailed drug information (from scraper/API)
export interface DrugDetails {
  name: string;
  riskLevel?: string;
  riskDescription?: string;
  alternatives?: string[];
  lastUpdate?: string;
  description?: string;
  id?: string;
}

// API Response interfaces
export interface SearchResponse {
  success: boolean;
  query: string;
  suggestions: DrugSuggestion[];
  count: number;
  cached?: boolean;
  responseTime?: string;
}

export interface DetailsResponse {
  success: boolean;
  drugName: string;
  details: DrugDetails;
  cached?: boolean;
  responseTime?: string;
}

export interface ApiResponse<T> {
  data?: T;
  success?: boolean;
  message?: string;
  timestamp?: string;
}
