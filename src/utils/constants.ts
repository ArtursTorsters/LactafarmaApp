export const API_CONFIG = {
  BASE_URL: 'http://lactafarma.bebemundi.com/api',
  TIMEOUT: 10000,
  MAX_RETRIES: 3,
} as const;

export const RISK_LEVELS = {
  very_low: { color: '#28a745', label: 'Very Low Risk' },
  low: { color: '#6f42c1', label: 'Low Risk' },
  moderate: { color: '#ffc107', label: 'Moderate Risk' },
  high: { color: '#fd7e14', label: 'High Risk' },
  very_high: { color: '#dc3545', label: 'Very High Risk' },
  unknown: { color: '#6c757d', label: 'Unknown Risk' },
} as const;
