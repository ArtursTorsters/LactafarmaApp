import { Request, Response } from 'express';
import { ELactanciaScraper } from '../scraper/ELactanciaScraper';

interface CacheItem {
  data: any;
  timestamp: number;
}

export class DrugController {
  private scraper: ELactanciaScraper;
  private cache: Map<string, CacheItem>;
  private readonly CACHE_TTL: number;

  constructor() {
    this.scraper = new ELactanciaScraper();
    this.cache = new Map();
    this.CACHE_TTL = 1000 * 60 * 60; // 1 hour cache
  }

  // Search for drug suggestions
  public async searchDrugs(req: Request, res: Response): Promise<void> {
    const startTime = Date.now();

    try {
      const { query } = req.params;

      if (!query || typeof query !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Query parameter is required',
          code: 'INVALID_QUERY'
        });
        return;
      }

      if (query.length < 2) {
        res.status(400).json({
          success: false,
          error: 'Query must be at least 2 characters long',
          code: 'QUERY_TOO_SHORT'
        });
        return;
      }

      if (query.length > 100) {
        res.status(400).json({
          success: false,
          error: 'Query too long (max 100 characters)',
          code: 'QUERY_TOO_LONG'
        });
        return;
      }

      const cacheKey = this.getCacheKey('search', query);
      const cachedResult = this.getCachedData(cacheKey);

      if (cachedResult) {
        const responseTime = Date.now() - startTime;
        res.json({
          success: true,
          query: query,
          suggestions: cachedResult,
          count: cachedResult.length,
          cached: true,
          responseTime: `${responseTime}ms`
        });
        return;
      }

      const suggestions = await this.scraper.searchDrugs(query);
      this.setCachedData(cacheKey, suggestions);

      const responseTime = Date.now() - startTime;

      res.json({
        success: true,
        query: query,
        suggestions: suggestions,
        count: suggestions.length,
        cached: false,
        responseTime: `${responseTime}ms`
      });

    } catch (error) {
      const responseTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      res.status(500).json({
        success: false,
        error: 'Search operation failed',
        message: process.env.NODE_ENV === 'development' ? errorMessage : 'Internal server error',
        code: 'SEARCH_FAILED',
        responseTime: `${responseTime}ms`
      });
    }
  }

  // Get detailed information about a drug
  public async getDrugDetails(req: Request, res: Response): Promise<void> {
    const startTime = Date.now();

    try {
      const { name } = req.params;

      if (!name || typeof name !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Drug name parameter is required',
          code: 'INVALID_NAME'
        });
        return;
      }

      if (name.length < 2) {
        res.status(400).json({
          success: false,
          error: 'Drug name must be at least 2 characters long',
          code: 'NAME_TOO_SHORT'
        });
        return;
      }

      const cacheKey = this.getCacheKey('details', name);
      const cachedResult = this.getCachedData(cacheKey);

      if (cachedResult) {
        const responseTime = Date.now() - startTime;
        res.json({
          success: true,
          drugName: name,
          details: cachedResult,
          cached: true,
          responseTime: `${responseTime}ms`
        });
        return;
      }

      const details = await this.scraper.getDrugDetails(name);

      if (!details) {
        const responseTime = Date.now() - startTime;
        res.status(404).json({
          success: false,
          error: 'Drug not found',
          drugName: name,
          code: 'DRUG_NOT_FOUND',
          responseTime: `${responseTime}ms`
        });
        return;
      }

      this.setCachedData(cacheKey, details);

      const responseTime = Date.now() - startTime;

      res.json({
        success: true,
        drugName: name,
        details: details,
        cached: false,
        responseTime: `${responseTime}ms`
      });

    } catch (error) {
      const responseTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve drug details',
        message: process.env.NODE_ENV === 'development' ? errorMessage : 'Internal server error',
        code: 'DETAILS_FAILED',
        responseTime: `${responseTime}ms`
      });
    }
  }

  // Search multiple drugs in a batch
  public async batchSearch(req: Request, res: Response): Promise<void> {
    const startTime = Date.now();

    try {
      const { queries } = req.body;

      if (!Array.isArray(queries)) {
        res.status(400).json({
          success: false,
          error: 'Queries must be an array',
          code: 'INVALID_QUERIES_FORMAT'
        });
        return;
      }

      if (queries.length === 0) {
        res.status(400).json({
          success: false,
          error: 'At least one query is required',
          code: 'EMPTY_QUERIES'
        });
        return;
      }

      if (queries.length > 10) {
        res.status(400).json({
          success: false,
          error: 'Maximum 10 queries allowed per batch',
          code: 'TOO_MANY_QUERIES'
        });
        return;
      }

      const invalidQueries = queries.filter(q =>
        !q || typeof q !== 'string' || q.length < 2
      );

      if (invalidQueries.length > 0) {
        res.status(400).json({
          success: false,
          error: 'All queries must be strings with at least 2 characters',
          code: 'INVALID_QUERY_FORMAT'
        });
        return;
      }

      const results = await this.scraper.searchMultipleDrugs(queries);

      const responseTime = Date.now() - startTime;
      const totalResults = Object.values(results).reduce((sum, arr) => sum + arr.length, 0);

      res.json({
        success: true,
        queries: queries,
        results: results,
        queryCount: queries.length,
        totalResults: totalResults,
        responseTime: `${responseTime}ms`
      });

    } catch (error) {
      const responseTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      res.status(500).json({
        success: false,
        error: 'Batch search operation failed',
        message: process.env.NODE_ENV === 'development' ? errorMessage : 'Internal server error',
        code: 'BATCH_SEARCH_FAILED',
        responseTime: `${responseTime}ms`
      });
    }
  }

  // Health check for the scraper service
  public async healthCheck(req: Request, res: Response): Promise<void> {
    try {
      const isHealthy = await this.scraper.isHealthy();
      const cacheSize = this.cache.size;

      res.json({
        success: true,
        status: isHealthy ? 'healthy' : 'unhealthy',
        scraper: isHealthy,
        cache: {
          size: cacheSize,
          maxAge: `${this.CACHE_TTL / 1000}s`
        },
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      res.status(500).json({
        success: false,
        status: 'error',
        error: errorMessage,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Clean up resources
  public async cleanup(): Promise<void> {
    try {
      await this.scraper.close();
      this.cache.clear();
    } catch (error) {
      // Silent cleanup
    }
  }

  private getCacheKey(type: string, query: string): string {
    return `${type}:${query.toLowerCase().trim()}`;
  }

  private getCachedData(cacheKey: string): any | null {
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    if (cached) {
      this.cache.delete(cacheKey);
    }

    return null;
  }

  private setCachedData(cacheKey: string, data: any): void {
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
  }
}
