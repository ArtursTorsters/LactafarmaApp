// services/database/Database.ts
import SQLite from 'react-native-sqlite-storage';

// Updated drug interface to match backend
export interface Drug {
  id: string;
  name: string;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';
  riskLevelNumber: number;
  riskDescription: string;
  summary: string;
  alternatives?: string[];
  sourceUrl: string;
  lastUpdated: string;
}

class Database {
  private db: SQLite.SQLiteDatabase | null = null;

  async init(): Promise<void> {
    try {
      this.db = await SQLite.openDatabase({
        name: 'lactafarma.db',
        location: 'default',
      });

      await this.createTables();
      console.log('Database initialized');
    } catch (error) {
      console.error('Database init failed:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    const createDrugsTable = `
      CREATE TABLE IF NOT EXISTS drugs (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        risk_level TEXT NOT NULL,
        risk_level_number INTEGER NOT NULL,
        risk_description TEXT,
        summary TEXT,
        alternatives TEXT,
        source_url TEXT,
        last_updated TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createSearchHistoryTable = `
      CREATE TABLE IF NOT EXISTS search_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        search_term TEXT NOT NULL,
        search_date DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;

    if (!this.db) throw new Error('Database not initialized');
    await this.db.executeSql(createDrugsTable);
    await this.db.executeSql(createSearchHistoryTable);
  }

  // Save a drug to database
  async saveDrug(drug: Drug): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const query = `
      INSERT OR REPLACE INTO drugs
      (id, name, risk_level, risk_level_number, risk_description, summary, alternatives, source_url, last_updated)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const alternatives = drug.alternatives ? JSON.stringify(drug.alternatives) : null;

    await this.db.executeSql(query, [
      drug.id,
      drug.name,
      drug.riskLevel,
      drug.riskLevelNumber,
      drug.riskDescription,
      drug.summary,
      alternatives,
      drug.sourceUrl,
      drug.lastUpdated,
    ]);
  }

  // Search drugs locally
  async searchDrugs(searchTerm: string): Promise<Drug[]> {
    if (!this.db) throw new Error('Database not initialized');

    const query = `
      SELECT * FROM drugs
      WHERE name LIKE ? OR summary LIKE ?
      ORDER BY name ASC
      LIMIT 20
    `;

    const searchPattern = `%${searchTerm}%`;
    const [results] = await this.db.executeSql(query, [searchPattern, searchPattern]);
    const drugs: Drug[] = [];

    for (let i = 0; i < results.rows.length; i++) {
      const row = results.rows.item(i);
      drugs.push(this.mapRowToDrug(row));
    }

    return drugs;
  }

  // Get drug by ID
  async getDrugById(drugId: string): Promise<Drug | null> {
    if (!this.db) throw new Error('Database not initialized');

    const query = 'SELECT * FROM drugs WHERE id = ?';
    const [results] = await this.db.executeSql(query, [drugId]);

    if (results.rows.length > 0) {
      return this.mapRowToDrug(results.rows.item(0));
    }

    return null;
  }

  // Add to search history
  async addToSearchHistory(searchTerm: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const query = 'INSERT INTO search_history (search_term) VALUES (?)';
    await this.db.executeSql(query, [searchTerm]);
  }

  // Get search history
  async getSearchHistory(limit: number = 10): Promise<string[]> {
    if (!this.db) throw new Error('Database not initialized');

    const query = `
      SELECT DISTINCT search_term FROM search_history
      ORDER BY search_date DESC
      LIMIT ?
    `;

    const [results] = await this.db.executeSql(query, [limit]);
    const history: string[] = [];

    for (let i = 0; i < results.rows.length; i++) {
      history.push(results.rows.item(i).search_term);
    }

    return history;
  }

  // Get all drugs (for testing)
  async getAllDrugs(): Promise<Drug[]> {
    if (!this.db) throw new Error('Database not initialized');

    const query = 'SELECT * FROM drugs ORDER BY name ASC';
    const [results] = await this.db.executeSql(query);
    const drugs: Drug[] = [];

    for (let i = 0; i < results.rows.length; i++) {
      drugs.push(this.mapRowToDrug(results.rows.item(i)));
    }

    return drugs;
  }

  // Count total drugs
  async getDrugCount(): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    const query = 'SELECT COUNT(*) as count FROM drugs';
    const [results] = await this.db.executeSql(query);
    return results.rows.item(0).count;
  }

  // Clear all drugs (for testing)
  async clearAllDrugs(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.executeSql('DELETE FROM drugs');
    await this.db.executeSql('DELETE FROM search_history');
  }

  // Map database row to Drug object
  private mapRowToDrug(row: any): Drug {
    return {
      id: row.id,
      name: row.name,
      riskLevel: row.risk_level,
      riskLevelNumber: row.risk_level_number,
      riskDescription: row.risk_description,
      summary: row.summary,
      alternatives: row.alternatives ? JSON.parse(row.alternatives) : undefined,
      sourceUrl: row.source_url,
      lastUpdated: row.last_updated,
    };
  }
}

export const database = new Database();
