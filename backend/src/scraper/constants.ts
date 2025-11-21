export const API_CONFIG = {
  BASE_URL: 'https://www.e-lactancia.org',
  SEARCH_ENDPOINT: '/megasearch/',
  HEADERS: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': 'https://www.e-lactancia.org/',
    'Origin': 'https://www.e-lactancia.org'
  },
  HTML_HEADERS: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': 'https://www.e-lactancia.org/',
    'Cache-Control': 'no-cache'
  }
};

export const RISK_LEVEL_MAP: { [key: string]: string } = {
  '0': 'Very Low Risk',
  '1': 'Low Risk',
  '2': 'Moderate Risk',
  '3': 'High Risk',
  '4': 'Very High Risk'
};

export const CATEGORY_MAP: { [key: string]: string } = {
  'product': 'Medicine',
  'tradename': 'Brand Name',
  'writing': 'Article'
};
