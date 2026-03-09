import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAssetSchema, insertCampaignSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get("/api/tenants", async (_req, res) => {
    const tenants = await storage.getTenants();
    res.json(tenants);
  });

  app.get("/api/users", async (_req, res) => {
    const users = await storage.getUsers();
    const safeUsers = users.map(({ password, ...u }) => u);
    res.json(safeUsers);
  });

  app.get("/api/users/:id", async (req, res) => {
    const user = await storage.getUser(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const { password, ...safeUser } = user;
    res.json(safeUser);
  });

  app.get("/api/malls", async (_req, res) => {
    const mallList = await storage.getMalls();
    res.json(mallList);
  });

  app.get("/api/malls/:id", async (req, res) => {
    const mall = await storage.getMall(req.params.id);
    if (!mall) return res.status(404).json({ message: "Mall not found" });
    res.json(mall);
  });

  app.get("/api/assets", async (req, res) => {
    const filters: { mallId?: string; tenantId?: string; type?: string } = {};
    if (req.query.mallId) filters.mallId = req.query.mallId as string;
    if (req.query.tenantId) filters.tenantId = req.query.tenantId as string;
    if (req.query.type) filters.type = req.query.type as string;
    const assetList = await storage.getAssets(filters);
    res.json(assetList);
  });

  app.post("/api/assets", async (req, res) => {
    const parsed = insertAssetSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid asset data", errors: parsed.error.issues });
    }
    const asset = await storage.createAsset(parsed.data);
    res.status(201).json(asset);
  });

  app.post("/api/assets/bulk", async (req, res) => {
    const { assets: assetRows } = req.body;
    if (!Array.isArray(assetRows) || assetRows.length === 0) {
      return res.status(400).json({ message: "Request body must contain a non-empty 'assets' array" });
    }
    const results: { created: number; errors: { row: number; message: string }[] } = { created: 0, errors: [] };
    const validAssets: any[] = [];

    for (let i = 0; i < assetRows.length; i++) {
      const parsed = insertAssetSchema.safeParse(assetRows[i]);
      if (!parsed.success) {
        results.errors.push({ row: i + 1, message: parsed.error.issues.map(e => `${e.path.join(".")}: ${e.message}`).join("; ") });
      } else {
        validAssets.push(parsed.data);
      }
    }

    if (validAssets.length > 0) {
      try {
        await storage.bulkCreateAssets(validAssets);
        results.created = validAssets.length;
      } catch (err: any) {
        const msg = err?.message || "Database error during bulk insert";
        if (msg.includes("duplicate key")) {
          results.errors.push({ row: 0, message: "One or more asset IDs already exist. Use unique IDs." });
        } else {
          results.errors.push({ row: 0, message: msg });
        }
      }
    }

    res.status(results.errors.length > 0 && results.created === 0 ? 400 : results.errors.length > 0 ? 207 : 201).json(results);
  });

  app.get("/api/assets/:id", async (req, res) => {
    const asset = await storage.getAsset(req.params.id);
    if (!asset) return res.status(404).json({ message: "Asset not found" });
    res.json(asset);
  });

  app.get("/api/campaigns", async (req, res) => {
    const tenantId = req.query.tenantId as string | undefined;
    const campaignList = await storage.getCampaigns(tenantId);
    res.json(campaignList);
  });

  app.post("/api/campaigns", async (req, res) => {
    const parsed = insertCampaignSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid campaign data", errors: parsed.error.issues });
    }
    const campaign = await storage.createCampaign(parsed.data);
    res.status(201).json(campaign);
  });

  app.get("/api/analytics", async (req, res) => {
    const days = parseInt(req.query.days as string) || 30;
    const data = await storage.getAnalyticsData(days);
    res.json(data);
  });

  app.get("/api/portfolio/stats", async (_req, res) => {
    const stats = await storage.getPortfolioStats();
    res.json(stats);
  });

  return httpServer;
}
