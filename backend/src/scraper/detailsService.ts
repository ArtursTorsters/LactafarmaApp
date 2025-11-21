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
    let suggestions = await searchDrugs(drugName);

    if (suggestions.length === 0) {
      const slug = createSlug(drugName);
      const directSuggestion: DrugSuggestion = {
        name: drugName,
        url: buildDrugUrl(slug, 'product'),
        category: 'Medicine'
      };
      suggestions.push(directSuggestion);
    }

    // Try each suggestion
    for (const suggestion of suggestions) {
      try {
        const result = await fetchDrugDetailsFromURL(suggestion);
        if (result) {
          return result;
        }
      } catch (error) {
        continue;
      }
    }

    // Try alternative patterns
    const slug = createSlug(drugName);
    const alternativePatterns = [
      'product',
      'tradename',
      'writing'
    ];

    for (const pattern of alternativePatterns) {
      try {
        const suggestion: DrugSuggestion = {
          name: drugName,
          url: buildDrugUrl(slug, pattern),
          category: 'Medicine'
        };
        const result = await fetchDrugDetailsFromURL(suggestion);
        if (result) {
          return result;
        }
      } catch (error) {
        continue;
      }
    }

    return null;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to get drug details: ${errorMessage}`);
  }
}
