// src/types/index.ts - Fixed with modal props

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

// UI Drug interface (for components)
export interface Drug {
  id: string;
  name: string;
  description?: string;
  riskLevel: RiskLevel;
  aliases?: string[];
  scientificName?: string;
  category?: string;
  lastUpdated?: string;
}

// Extended drug details (combining DrugDetails with UI Drug)
export interface ExtendedDrugDetails extends DrugDetails {
  brands?: DrugBrand[];
  warnings?: string[];
  recommendations?: string[];
  references?: string[];
  alternativeMedications?: Drug[];
  // Override id to make it required
  id: string;
}

export interface DrugBrand {
  id: string;
  brandName: string;
  manufacturer?: string;
  country?: string;
  drugId: string;
}

export interface DrugGroup {
  id: string;
  name: string;
  description?: string;
  drugCount?: number;
}

export interface DrugCardProps {
  drug: Drug;
  onPress: (drug: Drug) => void;
  onFavorite?: (drug: Drug) => void;
  isFavorite?: boolean;
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

export interface SearchFilters {
  category?: string;
  riskLevel?: RiskLevel;
  limit?: number;
  offset?: number;
}

// modal interface
export interface DrugDetailsModalProps {
  visible: boolean;
  selectedDrug: DrugDetails | null;
  selectedDrugForUI: Drug | null;
  loadingDetails: boolean;
  error: string | null;
  onClose: () => void;
}

// Utility functions for type conversion
export const convertDetailsToUIDrug = (details: DrugDetails): Drug => {
  return {
    id: details.id || details.name,
    name: details.name,
    description: details.description,
    riskLevel: mapRiskLevelString(details.riskLevel),
    category: undefined, // Not available in DrugDetails
    lastUpdated: details.lastUpdate,
  };
};

export const mapRiskLevelString = (riskLevel?: string): RiskLevel => {
  if (!riskLevel) return 'unknown';

  const normalized = riskLevel.toLowerCase();

  if (normalized.includes('very low') || normalized.includes('very-low')) return 'very-low';
  if (normalized.includes('low')) return 'low';
  if (normalized.includes('moderate') || normalized.includes('medium')) return 'moderate';
  if (normalized.includes('high') && !normalized.includes('very')) return 'high';
  if (normalized.includes('very high') || normalized.includes('very-high')) return 'very-high';

  return 'unknown';
};
