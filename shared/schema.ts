import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, doublePrecision, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tenants = pgTable("tenants", {
  id: varchar("id", { length: 50 }).primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
});

export const users = pgTable("users", {
  id: varchar("id", { length: 50 }).primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull(),
  organization: text("organization").notNull(),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  allowedMalls: text("allowed_malls").array(),
});

export const malls = pgTable("malls", {
  id: varchar("id", { length: 50 }).primaryKey(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  sizeSqM: integer("size_sq_m").notNull(),
  floors: integer("floors").notNull(),
  footfall: integer("footfall").notNull(),
  lat: doublePrecision("lat").notNull(),
  lng: doublePrecision("lng").notNull(),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
});

export const assets = pgTable("assets", {
  id: varchar("id", { length: 50 }).primaryKey(),
  mallId: varchar("mall_id", { length: 50 }).notNull(),
  tenantId: varchar("tenant_id", { length: 50 }).notNull(),
  assetName: text("asset_name").notNull(),
  assetType: text("asset_type").notNull(),
  floor: integer("floor").notNull(),
  zone: text("zone").notNull(),
  posX: real("pos_x").notNull(),
  posY: real("pos_y").notNull(),
  posZ: real("pos_z").notNull(),
  screenSize: text("screen_size"),
  mediaFormat: text("media_format"),
  dailyImpressions: integer("daily_impressions").notNull(),
  weeklyImpressions: integer("weekly_impressions").notNull(),
  dwellTimeSeconds: integer("dwell_time_seconds").notNull(),
  engagementScore: integer("engagement_score").notNull(),
});

export const campaigns = pgTable("campaigns", {
  id: varchar("id", { length: 50 }).primaryKey(),
  name: text("name").notNull(),
  advertiserTenantId: varchar("advertiser_tenant_id", { length: 50 }).notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  budget: integer("budget").notNull(),
  status: text("status").notNull().default("active"),
  targetAudience: text("target_audience"),
  cityFocus: text("city_focus"),
});

export const analyticsData = pgTable("analytics_data", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(),
  impressions: integer("impressions").notNull(),
  footfall: integer("footfall").notNull(),
});

export const insertTenantSchema = createInsertSchema(tenants);
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertMallSchema = createInsertSchema(malls);
export const insertAssetSchema = createInsertSchema(assets);
export const insertCampaignSchema = createInsertSchema(campaigns);
export const insertAnalyticsDataSchema = createInsertSchema(analyticsData).omit({ id: true });

export type Tenant = typeof tenants.$inferSelect;
export type InsertTenant = z.infer<typeof insertTenantSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Mall = typeof malls.$inferSelect;
export type InsertMall = z.infer<typeof insertMallSchema>;
export type Asset = typeof assets.$inferSelect;
export type InsertAsset = z.infer<typeof insertAssetSchema>;
export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type AnalyticsDataPoint = typeof analyticsData.$inferSelect;
export type InsertAnalyticsDataPoint = z.infer<typeof insertAnalyticsDataSchema>;
