import { eq, and, inArray, ilike, sql } from "drizzle-orm";
import { db } from "./db";
import {
  tenants, users, malls, assets, campaigns, analyticsData,
  type Tenant, type InsertTenant,
  type User, type InsertUser,
  type Mall, type InsertMall,
  type Asset, type InsertAsset,
  type Campaign, type InsertCampaign,
  type AnalyticsDataPoint, type InsertAnalyticsDataPoint,
} from "@shared/schema";

export interface IStorage {
  getTenants(): Promise<Tenant[]>;
  getTenant(id: string): Promise<Tenant | undefined>;
  createTenant(tenant: InsertTenant): Promise<Tenant>;

  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;

  getMalls(): Promise<Mall[]>;
  getMall(id: string): Promise<Mall | undefined>;
  createMall(mall: InsertMall): Promise<Mall>;

  getAssets(filters?: { mallId?: string; tenantId?: string; type?: string }): Promise<Asset[]>;
  getAsset(id: string): Promise<Asset | undefined>;
  createAsset(asset: InsertAsset): Promise<Asset>;
  bulkCreateAssets(assetList: InsertAsset[]): Promise<Asset[]>;

  getCampaigns(tenantId?: string): Promise<Campaign[]>;
  getCampaign(id: string): Promise<Campaign | undefined>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;

  getAnalyticsData(days?: number): Promise<AnalyticsDataPoint[]>;
  createAnalyticsData(data: InsertAnalyticsDataPoint): Promise<AnalyticsDataPoint>;
  bulkCreateAnalyticsData(data: InsertAnalyticsDataPoint[]): Promise<void>;

  getPortfolioStats(): Promise<{
    totalMalls: number;
    totalAssets: number;
    totalImpressions: number;
    totalFootfall: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getTenants(): Promise<Tenant[]> {
    return db.select().from(tenants);
  }

  async getTenant(id: string): Promise<Tenant | undefined> {
    const [tenant] = await db.select().from(tenants).where(eq(tenants.id, id));
    return tenant;
  }

  async createTenant(tenant: InsertTenant): Promise<Tenant> {
    const [created] = await db.insert(tenants).values(tenant).returning();
    return created;
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = `U-${Date.now()}`;
    const [created] = await db.insert(users).values({ ...user, id }).returning();
    return created;
  }

  async getMalls(): Promise<Mall[]> {
    return db.select().from(malls);
  }

  async getMall(id: string): Promise<Mall | undefined> {
    const [mall] = await db.select().from(malls).where(eq(malls.id, id));
    return mall;
  }

  async createMall(mall: InsertMall): Promise<Mall> {
    const [created] = await db.insert(malls).values(mall).returning();
    return created;
  }

  async getAssets(filters?: { mallId?: string; tenantId?: string; type?: string }): Promise<Asset[]> {
    let query = db.select().from(assets);
    const conditions = [];

    if (filters?.mallId) {
      conditions.push(eq(assets.mallId, filters.mallId));
    }
    if (filters?.tenantId) {
      conditions.push(eq(assets.tenantId, filters.tenantId));
    }
    if (filters?.type) {
      conditions.push(eq(assets.assetType, filters.type));
    }

    if (conditions.length > 0) {
      return db.select().from(assets).where(and(...conditions));
    }

    return db.select().from(assets);
  }

  async getAsset(id: string): Promise<Asset | undefined> {
    const [asset] = await db.select().from(assets).where(eq(assets.id, id));
    return asset;
  }

  async createAsset(asset: InsertAsset): Promise<Asset> {
    const [created] = await db.insert(assets).values(asset).returning();
    return created;
  }

  async bulkCreateAssets(assetList: InsertAsset[]): Promise<Asset[]> {
    if (assetList.length === 0) return [];
    return db.insert(assets).values(assetList).returning();
  }

  async getCampaigns(tenantId?: string): Promise<Campaign[]> {
    if (tenantId) {
      return db.select().from(campaigns).where(eq(campaigns.advertiserTenantId, tenantId));
    }
    return db.select().from(campaigns);
  }

  async getCampaign(id: string): Promise<Campaign | undefined> {
    const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, id));
    return campaign;
  }

  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const [created] = await db.insert(campaigns).values(campaign).returning();
    return created;
  }

  async getAnalyticsData(days: number = 30): Promise<AnalyticsDataPoint[]> {
    return db.select().from(analyticsData).limit(days);
  }

  async createAnalyticsData(data: InsertAnalyticsDataPoint): Promise<AnalyticsDataPoint> {
    const [created] = await db.insert(analyticsData).values(data).returning();
    return created;
  }

  async bulkCreateAnalyticsData(data: InsertAnalyticsDataPoint[]): Promise<void> {
    if (data.length === 0) return;
    await db.insert(analyticsData).values(data);
  }

  async getPortfolioStats(): Promise<{
    totalMalls: number;
    totalAssets: number;
    totalImpressions: number;
    totalFootfall: number;
  }> {
    const [mallCount] = await db.select({ count: sql<number>`count(*)::int` }).from(malls);
    const [assetCount] = await db.select({ count: sql<number>`count(*)::int` }).from(assets);
    const [impressionSum] = await db.select({
      total: sql<number>`coalesce(sum(weekly_impressions * 4), 0)::int`
    }).from(assets);
    const [footfallSum] = await db.select({
      total: sql<number>`coalesce(sum(footfall), 0)::int`
    }).from(malls);

    return {
      totalMalls: mallCount.count,
      totalAssets: assetCount.count,
      totalImpressions: impressionSum.total,
      totalFootfall: footfallSum.total,
    };
  }
}

export const storage = new DatabaseStorage();
