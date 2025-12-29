// utils/cache.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CacheEntry<T> {
    data: T;
    timestamp: number;
    expiresAt: number;
    hitCount: number; // Track popularity
}

class CacheManager {
    // Updated to 30 days
    private readonly DEFAULT_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days
    private readonly CACHE_PREFIX = '@LactaHelp_cache_';
    private readonly MAX_CACHE_SIZE = 500; // Limit number of cached items

    private getCacheKey(key: string): string {
        return `${this.CACHE_PREFIX}${key}`;
    }

    async set<T>(key: string, data: T, ttlMs?: number): Promise<void> {
        try {
            const ttl = ttlMs || this.DEFAULT_TTL;
            const now = Date.now();

            // Check if we need to clean old entries
            await this.cleanOldEntriesIfNeeded();

            const cacheEntry: CacheEntry<T> = {
                data,
                timestamp: now,
                expiresAt: now + ttl,
                hitCount: 0
            };

            await AsyncStorage.setItem(
                this.getCacheKey(key),
                JSON.stringify(cacheEntry)
            );
        } catch (error) {
            console.error('Cache set error:', error);
        }
    }

    async get<T>(key: string): Promise<T | null> {
        try {
            const cached = await AsyncStorage.getItem(this.getCacheKey(key));

            if (!cached) {
                return null;
            }

            const cacheEntry: CacheEntry<T> = JSON.parse(cached);
            const now = Date.now();

            // Check if expired
            if (now > cacheEntry.expiresAt) {
                await this.delete(key);
                return null;
            }

            // Update hit count for popularity tracking
            cacheEntry.hitCount++;
            await AsyncStorage.setItem(
                this.getCacheKey(key),
                JSON.stringify(cacheEntry)
            );

            return cacheEntry.data;
        } catch (error) {
            console.error('Cache get error:', error);
            return null;
        }
    }

    // Clean old entries if cache is getting too large
    private async cleanOldEntriesIfNeeded(): Promise<void> {
        try {
            const allKeys = await AsyncStorage.getAllKeys();
            const cacheKeys = allKeys.filter(key => key.startsWith(this.CACHE_PREFIX));

            if (cacheKeys.length >= this.MAX_CACHE_SIZE) {
                // Get all entries with their metadata
                const entries = await Promise.all(
                    cacheKeys.map(async (key) => {
                        const value = await AsyncStorage.getItem(key);
                        if (!value) return null;

                        try {
                            const entry: CacheEntry<any> = JSON.parse(value);
                            return { key, ...entry };
                        } catch {
                            return null;
                        }
                    })
                );

                const validEntries = entries.filter(e => e !== null) as any[];

                // Sort by hit count (least popular first) and timestamp (oldest first)
                validEntries.sort((a, b) => {
                    if (a.hitCount === b.hitCount) {
                        return a.timestamp - b.timestamp;
                    }
                    return a.hitCount - b.hitCount;
                });

                // Remove least popular/oldest 20% of entries
                const toRemove = Math.floor(validEntries.length * 0.2);
                const keysToRemove = validEntries.slice(0, toRemove).map(e => e.key);

                if (keysToRemove.length > 0) {
                    await AsyncStorage.multiRemove(keysToRemove);
                    console.log(`Cleaned ${keysToRemove.length} old cache entries`);
                }
            }
        } catch (error) {
            console.error('Cache cleanup error:', error);
        }
    }

    async delete(key: string): Promise<void> {
        try {
            await AsyncStorage.removeItem(this.getCacheKey(key));
        } catch (error) {
            console.error('Cache delete error:', error);
        }
    }

    async clearAll(): Promise<void> {
        try {
            const allKeys = await AsyncStorage.getAllKeys();
            const cacheKeys = allKeys.filter(key => key.startsWith(this.CACHE_PREFIX));
            await AsyncStorage.multiRemove(cacheKeys);
        } catch (error) {
            console.error('Cache clear error:', error);
        }
    }

    async getCacheInfo(): Promise<{
        totalEntries: number;
        totalSize: string;
        entries: Array<{
            key: string;
            expiresAt: Date;
            size: number;
            hitCount: number;
            daysUntilExpiry: number;
        }>;
        mostPopular: string[];
    }> {
        try {
            const allKeys = await AsyncStorage.getAllKeys();
            const cacheKeys = allKeys.filter(key => key.startsWith(this.CACHE_PREFIX));

            const entries = await Promise.all(
                cacheKeys.map(async (key) => {
                    const value = await AsyncStorage.getItem(key);
                    if (!value) return null;

                    try {
                        const entry: CacheEntry<any> = JSON.parse(value);
                        const now = Date.now();
                        const daysUntilExpiry = Math.ceil((entry.expiresAt - now) / (1000 * 60 * 60 * 24));

                        return {
                            key: key.replace(this.CACHE_PREFIX, ''),
                            expiresAt: new Date(entry.expiresAt),
                            size: value.length,
                            hitCount: entry.hitCount || 0,
                            daysUntilExpiry: Math.max(0, daysUntilExpiry)
                        };
                    } catch {
                        return null;
                    }
                })
            );

            const validEntries = entries.filter(e => e !== null) as any[];
            const totalSize = validEntries.reduce((sum, e) => sum + e.size, 0);

            // Get most popular cached items
            const mostPopular = validEntries
                .sort((a, b) => b.hitCount - a.hitCount)
                .slice(0, 5)
                .map(e => e.key.replace('search_', '').replace('details_', ''));

            return {
                totalEntries: validEntries.length,
                totalSize: this.formatBytes(totalSize),
                entries: validEntries,
                mostPopular
            };
        } catch (error) {
            console.error('Get cache info error:', error);
            return {
                totalEntries: 0,
                totalSize: '0 B',
                entries: [],
                mostPopular: []
            };
        }
    }

    private formatBytes(bytes: number): string {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

export const cache = new CacheManager();
