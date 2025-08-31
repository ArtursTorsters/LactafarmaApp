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
export type RiskLevel = 'very-low' | 'low' | 'moderate' | 'high' | 'very-high' | 'unknown';
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

export interface DrugBrand {
  id: string;
  brandName: string;
  manufacturer?: string;
  country?: string;
  drugId: string;
}

// export interface DrugDetails {
//   name: string;
//   riskLevel?: string;
//   riskDescription?: string;
//   alternatives?: string[];
//   lastUpdate?: string;
//   description?: string;
// }

export interface DrugDetails extends Drug {
  brands?: DrugBrand[];
  warnings?: string[];
  recommendations?: string[];
  references?: string[];
  alternativeMedications?: Drug[];
  lastUpdate?: string;
  description?: string;
  riskDescription?: string;

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
