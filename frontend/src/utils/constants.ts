export const API_CONFIG = {
  BASE_URL: 'https://api.fda.gov',
  TIMEOUT: 10000,
  MAX_RETRIES: 3,
} as const;

export const RISK_LEVELS = {
  'very-low': { label: 'Very Low Risk', color: '#28a745' },
  'low': { label: 'Low Risk', color: '#db9e27' },
  'moderate': { label: 'Moderate Risk', color: '#ffc107' },
  'high': { label: 'High Risk', color: '#fd7e14' },
  'very-high': { label: 'Very High Risk', color: '#dc3545' },
  'unknown': { label: 'Unknown Risk', color: '#6c757d' },
};
