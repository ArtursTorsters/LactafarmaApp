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

export interface DrugGroup {
  id: string;
  name: string;
  description?: string;
  drugCount?: number;
}

export interface DrugBrand {
  id: string;
  brandName: string;
  manufacturer?: string;
  country?: string;
  drugId: string;
}

export interface DrugDetail extends Drug {
  brands?: DrugBrand[];
  warnings?: string[];
  recommendations?: string[];
  references?: string[];
  alternativeMedications?: Drug[];
}

export type RiskLevel =
  | "very_low"
  | "low"
  | "moderate"
  | "high"
  | "very_high"
  | "unknown";

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
