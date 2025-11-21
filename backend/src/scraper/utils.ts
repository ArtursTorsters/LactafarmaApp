import { DrugSuggestion } from '../types/index';
import { CATEGORY_MAP } from './constants';

export function createSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function determineUrlType(item: any): string {
  if (item.term === 'marca' || item.type === 'brand' || item.tipo === 'marca') {
    return 'tradename';
  }
  if (item.term === 'sinonimo' || item.type === 'synonym') {
    return 'product';
  }
  if (item.type === 'writing' || item.tipo === 'writing') {
    return 'writing';
  }
  return 'product';
}

export function getCategoryFromType(type: string): string {
  return CATEGORY_MAP[type] || 'Medicine';
}

export function removeDuplicates(suggestions: DrugSuggestion[]): DrugSuggestion[] {
  const seen = new Set<string>();
  return suggestions.filter(suggestion => {
    const key = suggestion.name.toLowerCase().trim();
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

export function buildDrugUrl(slug: string, type: string): string {
  return `/breastfeeding/${slug}/${type}/`;
}

export function extractFromHTML(html: string, patterns: RegExp[]): string | undefined {
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      const result = match[1]
        .trim()
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .substring(0, 300);

      if (result.length > 3) {
        return result;
      }
    }
  }
  return undefined;
}
