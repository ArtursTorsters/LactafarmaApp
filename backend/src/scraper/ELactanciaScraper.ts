// src/scrapers/ELactanciaScraper.ts
import puppeteer, { Browser, Page } from "puppeteer";

export interface DrugSuggestion {
  name: string;
  url?: string;
  category?: string;
}

export interface DrugDetails {
  name: string;
  riskLevel?: string;
  riskDescription?: string;
  alternatives?: string[];
  lastUpdate?: string;
  description?: string;
}

export class ELactanciaScraper {
  private browser: Browser | null = null;
  private page: Page | null = null;

  async initialize(): Promise<void> {
    if (this.browser) return; // Already initialized

    this.browser = await puppeteer.launch({
      headless: process.env.NODE_ENV === "production" ? "new" : false,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor",
        "--no-first-run",
        "--disable-default-apps",
      ],
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    });

    this.page = await this.browser.newPage();

    // Set realistic user agent
    await this.page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    // Set viewport
    await this.page.setViewport({ width: 1366, height: 768 });

    console.log("🚀 Puppeteer initialized");
  }

  async searchDrugs(query: string): Promise<DrugSuggestion[]> {
    try {
      if (!this.page) await this.initialize();

      console.log(`🔍 Searching for: "${query}"`);

      // Navigate to the website
      await this.page!.goto("https://www.e-lactancia.org/", {
        waitUntil: "networkidle2",
        timeout: 30000,
      });

      // Wait for the search input
      await this.page!.waitForSelector("#search_input", { timeout: 10000 });

      // Clear and type the query
      await this.page!.click("#search_input");
      await this.page!.keyboard.down("Control");
      await this.page!.keyboard.press("KeyA");
      await this.page!.keyboard.up("Control");
      await this.page!.keyboard.press("Backspace");

      // Type character by character to trigger autocomplete
      for (const char of query) {
        await this.page!.keyboard.type(char);
        await this.page!.waitForTimeout(100);
      }

      // Wait for suggestions to appear
      await this.page!.waitForTimeout(2000);

      // Extract suggestions using different possible selectors
      const suggestions = await this.page!.evaluate(() => {
        const results: DrugSuggestion[] = [];

        // Try multiple selectors for Twitter Typeahead suggestions
        const selectors = [
          ".tt-suggestion",
          ".tt-selectable",
          ".twitter-typeahead .tt-suggestion",
          ".typeahead .tt-suggestion",
          '[class*="tt-suggestion"]',
          ".tt-dataset-0 .tt-suggestion",
          ".tt-menu .tt-suggestion",
        ];

        for (const selector of selectors) {
          const elements = document.querySelectorAll(selector);
          console.log(
            `Trying selector: ${selector}, found: ${elements.length}`
          );

          if (elements.length > 0) {
            elements.forEach((el: Element) => {
              const name = el.textContent?.trim();
              if (name && name.length > 0) {
                const href =
                  el.getAttribute("href") ||
                  el.querySelector("a")?.getAttribute("href") ||
                  el.getAttribute("data-url");

                results.push({
                  name,
                  url: href || undefined,
                  category: el.getAttribute("data-category") || undefined,
                });
              }
            });
            break; // Found results, stop trying other selectors
          }
        }

        return results;
      });

      console.log(`✅ Found ${suggestions.length} suggestions for "${query}"`);
      return suggestions;
    } catch (error) {
      console.error("❌ Search error:", error);
      throw new Error(`Search failed: ${error.message}`);
    }
  }

  async getDrugDetails(drugName: string): Promise<DrugDetails | null> {
    try {
      if (!this.page) await this.initialize();

      console.log(`📋 Getting details for: "${drugName}"`);

      // First search to get suggestions
      const suggestions = await this.searchDrugs(drugName);

      if (suggestions.length === 0) {
        console.log(`❌ No suggestions found for "${drugName}"`);
        return null;
      }

      // Try to navigate to drug page
      let targetUrl = suggestions[0].url;

      if (!targetUrl) {
        // Search and press Enter if no direct URL
        await this.page!.goto("https://www.e-lactancia.org/", {
          waitUntil: "networkidle2",
        });

        await this.page!.waitForSelector("#search_input");
        await this.page!.click("#search_input");
        await this.page!.keyboard.down("Control");
        await this.page!.keyboard.press("KeyA");
        await this.page!.keyboard.up("Control");
        await this.page!.type("#search_input", drugName);
        await this.page!.keyboard.press("Enter");

        await this.page!.waitForNavigation({ waitUntil: "networkidle2" });
      } else {
        // Navigate to direct URL
        if (!targetUrl.startsWith("http")) {
          targetUrl =
            "https://www.e-lactancia.org" +
            (targetUrl.startsWith("/") ? "" : "/") +
            targetUrl;
        }
        await this.page!.goto(targetUrl, { waitUntil: "networkidle2" });
      }

      // Extract drug information from the page
      const drugDetails = await this.page!.evaluate(() => {
        const getText = (selector: string): string => {
          const el = document.querySelector(selector);
          return el?.textContent?.trim() || "";
        };

        const getAllTexts = (selector: string): string[] => {
          const elements = document.querySelectorAll(selector);
          return Array.from(elements)
            .map((el) => el.textContent?.trim() || "")
            .filter((text) => text.length > 0);
        };

        // Extract drug name from page title or h1
        const name =
          getText("h1") ||
          getText(".drug-title") ||
          getText(".page-title") ||
          document.title.split("-")[0]?.trim();

        // Look for risk level indicators
        const riskLevel =
          getText(".risk-level") ||
          getText(".safety-rating") ||
          getText('[class*="risk"]') ||
          getText(".level") ||
          getText('[class*="safety"]');

        // Get description from common content areas
        const description =
          getText(".drug-info") ||
          getText(".description") ||
          getText(".content p") ||
          getText("main p") ||
          getText(".summary");

        // Look for alternatives
        const alternatives =
          getAllTexts(".alternatives li") ||
          getAllTexts(".alternative-drugs") ||
          getAllTexts('[class*="alternative"] li');

        // Get last update info
        const lastUpdate =
          getText(".last-updated") ||
          getText(".update-date") ||
          getText('[class*="update"]');

        const riskDescription =
          getText(".risk-description") ||
          getText(".safety-description") ||
          getText(".risk-info");

        return {
          name,
          riskLevel,
          description,
          alternatives: alternatives.length > 0 ? alternatives : undefined,
          lastUpdate: lastUpdate || undefined,
          riskDescription: riskDescription || undefined,
        };
      });

      console.log(`✅ Retrieved details for: "${drugDetails.name}"`);
      return drugDetails;
    } catch (error) {
      console.error("❌ Get details error:", error);
      throw new Error(`Failed to get drug details: ${error.message}`);
    }
  }

  async searchMultipleDrugs(
    queries: string[]
  ): Promise<{ [key: string]: DrugSuggestion[] }> {
    const results: { [key: string]: DrugSuggestion[] } = {};

    for (const query of queries) {
      try {
        console.log(`🔍 Batch searching: ${query}`);
        results[query] = await this.searchDrugs(query);

        // Respectful delay between requests
        await new Promise((resolve) => setTimeout(resolve, 1500));
      } catch (error) {
        console.error(`❌ Batch search failed for "${query}":`, error);
        results[query] = [];
      }
    }

    return results;
  }

  async close(): Promise<void> {
    try {
      if (this.page) {
        await this.page.close();
        this.page = null;
        console.log("📄 Page closed");
      }

      if (this.browser) {
        await this.browser.close();
        this.browser = null;
        console.log("🔒 Browser closed");
      }
    } catch (error) {
      console.error("❌ Error closing scraper:", error);
    }
  }

  // Health check method
  async isHealthy(): Promise<boolean> {
    try {
      if (!this.browser || !this.page) {
        await this.initialize();
      }

      // Simple test navigation
      await this.page!.goto("https://www.e-lactancia.org/", {
        waitUntil: "domcontentloaded",
        timeout: 10000,
      });

      return true;
    } catch (error) {
      console.error("❌ Health check failed:", error);
      return false;
    }
  }
}
