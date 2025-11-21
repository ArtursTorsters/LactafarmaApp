import { DrugSuggestion } from '../types';
import { RISK_LEVEL_MAP } from './constants';
import { extractFromHTML, getCategoryFromType, removeDuplicates } from './utils';

export function extractRiskLevel(html: string): string | undefined {
  const riskLevelMatch = html.match(/class="[^"]*risk-level(\d+)[^"]*"/);
  if (riskLevelMatch) {
    const level = riskLevelMatch[1];
    if (RISK_LEVEL_MAP[level]) {
      return RISK_LEVEL_MAP[level];
    }
  }

  const riskHeaderMatch = html.match(/<h2[^>]*class="risk-header"[^>]*>.*?<p>([^<]+)<\/p>/s);
  if (riskHeaderMatch) {
    return riskHeaderMatch[1].trim();
  }

  const patterns = [
    /<div[^>]*class="[^"]*risk[^"]*"[^>]*>([^<]+)/i,
    /<span[^>]*class="[^"]*(?:risk|level|safety)[^"]*"[^>]*>([^<]+)/i,
    /<h2[^>]*>([^<]*(?:compatible|compatibility|safe|risk)[^<]*)<\/h2>/i,
    /<h4[^>]*>([^<]*(?:safe|risk|compatible|avoid|caution)[^<]*)<\/h4>/i
  ];

  return extractFromHTML(html, patterns);
}

export function extractDescription(html: string): string | undefined {
  const contentMatch = html.match(/<div[^>]*class="[^"]*risk-comment-level\d+[^"]*"[^>]*>(.*?)<\/div>/s);
  if (contentMatch) {
    const paragraphs = contentMatch[1].match(/<p[^>]*>.*?<\/p>/gs);
    if (paragraphs) {
      const cleanText = paragraphs
        .map(p => p.replace(/<[^>]*>/g, ' ').trim())
        .filter(p => p.length > 20)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (cleanText.length > 50) {
        return cleanText.substring(0, 500);
      }
    }
  }

  const metaMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/i);
  if (metaMatch) {
    return metaMatch[1].trim();
  }

  return undefined;
}

export function extractRiskDescription(html: string): string | undefined {
  const riskDescMatch = html.match(/<h4[^>]*>([^<]*(?:safe|risk|compatible|avoid|caution|adverse|effects)[^<]*)<\/h4>/i);
  if (riskDescMatch) {
    return riskDescMatch[1].trim();
  }

  const patterns = [
    /<p[^>]*>([^<]*(?:safe|risk|compatible|avoid|caution|breastfeeding|nursing)[^<]{30,200})<\/p>/i,
    /<div[^>]*>([^<]*(?:safe|risk|compatible|avoid|caution|breastfeeding|nursing)[^<]{30,200})<\/div>/i,
  ];

  return extractFromHTML(html, patterns);
}

export function extractLastUpdate(html: string): string | undefined {
  const patterns = [
    /(?:updated|last\s+update|modified|fecha|actualizado):\s*([^<\n]{5,30})/i,
    /(\d{4}-\d{2}-\d{2})/,
    /(\d{1,2}\/\d{1,2}\/\d{4})/,
    /([A-Z][a-z]{2,8}\s+\d{1,2},?\s+\d{4})/
  ];

  return extractFromHTML(html, patterns);
}

export function extractAlternatives(html: string): string[] {
  const alternativesMatch = html.match(/<div[^>]*class="[^"]*risk-alt[^"]*"[^>]*>.*?<ul[^>]*>(.*?)<\/ul>/s);
  if (alternativesMatch) {
    const listItems = alternativesMatch[1].match(/<li[^>]*>.*?<a[^>]*[^>]*>([^<]+)<\/a>/g);
    if (listItems) {
      const alternatives = listItems
        .map(item => {
          const nameMatch = item.match(/<a[^>]*>([^<]+)<\/a>/);
          return nameMatch ? nameMatch[1].trim() : '';
        })
        .filter(alt => alt.length > 2 && alt.length < 100)
        .slice(0, 10);

      if (alternatives.length > 0) {
        return alternatives;
      }
    }
  }

  const patterns = [
    /<div[^>]*class="[^"]*alternatives[^"]*"[^>]*>(.*?)<\/div>/si,
    /<ul[^>]*class="[^"]*alternatives[^"]*"[^>]*>(.*?)<\/ul>/si,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      const listItems = match[1].match(/<li[^>]*>([^<]+)<\/li>/gi) || [];
      const alternatives = listItems
        .map(item => item.replace(/<\/?[^>]+(>|$)/g, "").trim())
        .filter(alt => alt.length > 2);

      if (alternatives.length > 0) {
        return alternatives;
      }
    }
  }

  return [];
}

export function extractSuggestionsFromHTML(html: string): DrugSuggestion[] {
  const suggestions: DrugSuggestion[] = [];
  const linkPattern = /<a[^>]*href="\/breastfeeding\/([^\/]+)\/(product|writing|tradename)\/"[^>]*>([^<]+)<\/a>/gi;
  let match;

  while ((match = linkPattern.exec(html)) !== null) {
    const slug = match[1];
    const type = match[2];
    const name = match[3].trim();

    suggestions.push({
      name: name,
      url: `/breastfeeding/${slug}/${type}/`,
      category: getCategoryFromType(type)
    });
  }

  return removeDuplicates(suggestions);
}
