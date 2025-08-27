// src/controllers/drugController.ts
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

    console.log('🎮 DrugController initialized');
  }

  private getCacheKey(type: string, query: string): string {
    return `${type}:${query.toLowerCase().trim()}`;
  }

  private getCachedData(cacheKey: string): any | null {
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      console.log(`💾 Cache HIT for: ${cacheKey}`);
      return cached.data;
    }

    if (cached) {
      console.log(`🗑️ Cache EXPIRED for: ${cacheKey}`);
      this.cache.delete(cacheKey);
    }

    console.log(`❌ Cache MISS for: ${cacheKey}`);
    return null;
  }

  private setCachedData(cacheKey: string, data: any): void {
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    console.log(`💾 Cached data for: ${cacheKey}`);
  }

  // GET /api/drugs/search/:query
  public async searchDrugs(req: Request, res: Response): Promise<void> {
    const startTime = Date.now();

    try {
      const { query } = req.params;

      // Validation
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

      console.log(`🔍 Search request: "${query}" from ${req.ip}`);

      // Check cache first
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

      // Perform actual search
      const suggestions = await this.scraper.searchDrugs(query);

      // Cache the results
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

      console.log(`✅ Search completed: ${suggestions.length} results in ${responseTime}ms`);

    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.error('❌ Search error:', error);

      res.status(500).json({
        success: false,
        error: 'Search operation failed',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
        code: 'SEARCH_FAILED',
        responseTime: `${responseTime}ms`
      });
    }
  }

  // GET /api/drugs/details/:name
  public async getDrugDetails(req: Request, res: Response): Promise<void> {
    const startTime = Date.now();

    try {
      const { name } = req.params;

      // Validation
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

      console.log(`📋 Details request: "${name}" from ${req.ip}`);

      // Check cache first
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

      // Get drug details
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

      // Cache the results
      this.setCachedData(cacheKey, details);

      const responseTime = Date.now() - startTime;

      res.json({
        success: true,
        drugName: name,
        details: details,
        cached: false,
        responseTime: `${responseTime}ms`
      });

      console.log(`✅ Details completed for "${details.name}" in ${responseTime}ms`);

    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.error('❌ Details error:', error);

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve drug details',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
        code: 'DETAILS_FAILED',
        responseTime: `${responseTime}ms`
      });
    }
  }

  // POST /api/drugs/batch-search
  public async batchSearch(req: Request, res: Response): Promise<void> {
    const startTime = Date.now();

    try {
      const { queries } = req.body;

      // Validation
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

      // Validate each query
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

      console.log(`📦 Batch search request: ${queries.length} queries from ${req.ip}`);

      // Perform batch search
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

      console.log(`✅ Batch search completed: ${totalResults} total results in ${responseTime}ms`);

    } catch (error) {
      const responseTime = Date.now() - startTime;
      console.error('❌ Batch search error:', error);

      res.status(500).json({
        success: false,
        error: 'Batch search operation failed',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
        code: 'BATCH_SEARCH_FAILED',
        responseTime: `${responseTime}ms`
      });
    }
  }

  // GET /api/drugs/health
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
      res.status(500).json({
        success: false,
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Cleanup method
  public async cleanup(): Promise<void> {
    console.log('🧹 Cleaning up DrugController...');

    try {
      await this.scraper.close();
      this.cache.clear();
      console.log('✅ Cleanup completed');
    } catch (error) {
      console.error('❌ Cleanup error:', error);
    }
  }
}
