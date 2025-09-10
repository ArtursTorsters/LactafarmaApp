export type RiskLevel = 'very-low' | 'low' | 'moderate' | 'high' | 'very-high' | 'unknown';

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
  id?: string;
}
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
