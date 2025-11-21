import { DrugSuggestion } from '../types/index';
import { API_CONFIG } from './constants';
import { createSlug, determineUrlType, removeDuplicates, buildDrugUrl } from './utils';
import { extractSuggestionsFromHTML } from './parsers';

export async function searchDrugs(query: string): Promise<DrugSuggestion[]> {
  try {
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.SEARCH_ENDPOINT}?query=${encodeURIComponent(query)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: API_CONFIG.HEADERS
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || '';
    let data: any;

    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        return extractSuggestionsFromHTML(text);
      }
    }

    if (!Array.isArray(data)) {
      return [];
    }

    const suggestions: DrugSuggestion[] = data.map((item: any) => {
      const name = item.nombre_en || item.nombre || item.name || item.title || String(item);
      const type = determineUrlType(item);

      // Prefer backend ID if available
      const url = item.id
        ? buildDrugUrl(item.id, type)   // Use real ID
        : buildDrugUrl(createSlug(name), type); // fallback

      return {
        name,
        url,
        category: item.category || item.categoria || undefined
      };
    }).filter((suggestion: DrugSuggestion) =>
      suggestion.name &&
      suggestion.name.length > 0 &&
      suggestion.name !== 'undefined'
    );

    return removeDuplicates(suggestions);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Search failed: ${errorMessage}`);
  }
}

export async function searchMultipleDrugs(queries: string[]): Promise<{ [key: string]: DrugSuggestion[] }> {
  const results: { [key: string]: DrugSuggestion[] } = {};

  for (const query of queries) {
    try {
      results[query] = await searchDrugs(query);
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      results[query] = [];
    }
  }

  return results;
}
