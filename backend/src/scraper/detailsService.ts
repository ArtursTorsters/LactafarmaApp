import { DrugDetails, DrugSuggestion } from '../types/index';
import { API_CONFIG } from './constants';
import { createSlug, buildDrugUrl } from './utils';
import {
  extractRiskLevel,
  extractDescription,
  extractRiskDescription,
  extractLastUpdate,
  extractAlternatives
} from './parsers';
import { searchDrugs } from './searchService';

export async function fetchDrugDetailsFromURL(suggestion: DrugSuggestion): Promise<DrugDetails | null> {
  if (!suggestion.url) return null;

  const detailUrl = suggestion.url.startsWith('http')
    ? suggestion.url
    : `${API_CONFIG.BASE_URL}${suggestion.url}`;

  const response = await fetch(detailUrl, {
    method: 'GET',
    headers: API_CONFIG.HTML_HEADERS
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const html = await response.text();

  const urlMatch = detailUrl.match(/\/breastfeeding\/([^\/]+)\//);
  const extractedId = urlMatch ? urlMatch[1] : createSlug(suggestion.name);

  const drugDetails: DrugDetails = {
    name: suggestion.name,
    id: extractedId,
    riskLevel: extractRiskLevel(html),
    description: extractDescription(html),
    riskDescription: extractRiskDescription(html),
    lastUpdate: extractLastUpdate(html),
    alternatives: extractAlternatives(html)
  };

  return drugDetails;
}
export async function getDrugDetails(drugName: string): Promise<DrugDetails | null> {
  try {
    const normalized = drugName.toLowerCase().trim();

    // 1️⃣ Fetch suggestions from backend
    const rawSuggestions: any[] = await searchDrugs(drugName);

    if (rawSuggestions.length === 0) {
      // fallback: direct URL guess
      const slug = createSlug(drugName);
      const directSuggestion: DrugSuggestion = {
        name: drugName,
        url: buildDrugUrl(slug, 'product'),
        category: 'Medicine',
      };
      return fetchDrugDetailsFromURL(directSuggestion);
    }

    // 2️⃣ Map backend objects to frontend DrugSuggestion
    const mappedSuggestions: DrugSuggestion[] = rawSuggestions.map(s => ({
      name: s.nombre_en || s.nombre || s.term || 'Unknown',
      url: s.url ?? buildDrugUrl(s.id, 'product'),
      category: 'Medicine',
    }));

    // 3️⃣ Exact match first
    const exactMatches = mappedSuggestions.filter(
      s => s.name.toLowerCase().trim() === normalized
    );

    for (const suggestion of exactMatches) {
      try {
        const result = await fetchDrugDetailsFromURL(suggestion);
        if (result) return result;
      } catch {}
    }

    // 4️⃣ Partial matches / fallback suggestions
    const filtered = mappedSuggestions.filter(s => {
      const n = s.name.toLowerCase();

      // Special case: skip Dexibuprofen if searching Ibuprofen
      if (normalized === 'ibuprofen' && n.includes('dexi')) return false;

      return true;
    });

    for (const suggestion of filtered) {
      try {
        const result = await fetchDrugDetailsFromURL(suggestion);
        if (result) return result;
      } catch {}
    }

    // 5️⃣ Final attempt: try slug-based URL patterns
    const slug = createSlug(drugName);
    const patterns = ['product', 'tradename', 'writing'];

    for (const pattern of patterns) {
      const suggestion: DrugSuggestion = {
        name: drugName,
        url: buildDrugUrl(slug, pattern),
        category: 'Medicine',
      };

      try {
        const result = await fetchDrugDetailsFromURL(suggestion);
        if (result) return result;
      } catch {}
    }

    return null;

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to get drug details: ${message}`);
  }
}
