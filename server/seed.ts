import { db } from "./db";
import { tenants, users, malls, assets, campaigns, analyticsData } from "@shared/schema";
import { format, subDays } from "date-fns";

export async function seed() {
  console.log("Checking if database needs seeding...");

  const [existingMall] = await db.select().from(malls).limit(1);
  if (existingMall) {
    console.log("Database already seeded, skipping.");
    return;
  }

  console.log("Seeding database...");

  await db.insert(tenants).values([
    { id: "TENANT-1", name: "Primedia", type: "media_owner" },
    { id: "TENANT-2", name: "Adidas", type: "advertiser" },
    { id: "TENANT-3", name: "Mall of Africa", type: "mall_operator" },
  ]);

  await db.insert(users).values([
    { id: "U1", name: "Louis Botha", email: "louis@primedia.co.za", password: "admin123", role: "admin", organization: "Primedia", tenantId: "TENANT-1", allowedMalls: null },
    { id: "U2", name: "Sarah Jenkins", email: "sarah@primedia.co.za", password: "internal123", role: "internal", organization: "Primedia", tenantId: "TENANT-1", allowedMalls: null },
    { id: "U3", name: "Michael Chang", email: "michael@primedia.co.za", password: "sales123", role: "sales", organization: "Primedia Sales", tenantId: "TENANT-1", allowedMalls: null },
    { id: "U4", name: "Emma Watson", email: "emma@adidas.com", password: "advertiser123", role: "advertiser", organization: "Adidas", tenantId: "TENANT-2", allowedMalls: null },
    { id: "U5", name: "David Ndlovu", email: "david@mallofafrica.co.za", password: "mall123", role: "mall_partner", organization: "Mall of Africa", tenantId: "TENANT-3", allowedMalls: ["MALL-1001"] },
  ]);

  const southAfricanMalls = [
    { city: "Johannesburg", name: "Sandton City", lat: -26.1075, lng: 28.0567 },
    { city: "Cape Town", name: "Mall of Africa", lat: -26.0159, lng: 28.1065 },
    { city: "Durban", name: "V&A Waterfront", lat: -33.9036, lng: 18.4205 },
    { city: "Pretoria", name: "Menlyn Park", lat: -25.7824, lng: 28.2754 },
    { city: "Durban", name: "Gateway Theatre of Shopping", lat: -29.7262, lng: 31.0664 },
    { city: "Johannesburg", name: "Rosebank Mall", lat: -26.1451, lng: 28.0406 },
    { city: "Cape Town", name: "Canal Walk", lat: -33.8931, lng: 18.5133 },
    { city: "Pretoria", name: "Brooklyn Mall", lat: -25.7719, lng: 28.2343 },
    { city: "Johannesburg", name: "Eastgate Shopping Centre", lat: -26.1788, lng: 28.1158 },
    { city: "Cape Town", name: "Cavendish Square", lat: -33.9788, lng: 18.4651 },
    { city: "Durban", name: "Pavilion Shopping Centre", lat: -29.8492, lng: 30.9348 },
    { city: "Johannesburg", name: "Cresta Shopping Centre", lat: -26.1287, lng: 27.9733 },
    { city: "Pretoria", name: "Centurion Mall", lat: -25.8587, lng: 28.1873 },
    { city: "Port Elizabeth", name: "Greenacres Shopping Centre", lat: -33.9482, lng: 25.5765 },
    { city: "Bloemfontein", name: "Walmer Park Shopping Centre", lat: -33.9772, lng: 25.5802 },
    { city: "East London", name: "Somerset Mall", lat: -34.0818, lng: 18.8229 },
    { city: "Nelspruit", name: "Hemingways Mall", lat: -32.9691, lng: 27.9015 },
    { city: "Kimberley", name: "Ilanga Mall", lat: -25.4674, lng: 30.9575 },
    { city: "Polokwane", name: "Riverside Mall", lat: -25.4385, lng: 30.9682 },
    { city: "Pietermaritzburg", name: "Liberty Promenade", lat: -34.0487, lng: 18.6186 },
    { city: "George", name: "Mimosa Mall", lat: -29.1084, lng: 26.2052 },
    { city: "Rustenburg", name: "Loch Logan Waterfront", lat: -29.1152, lng: 26.2115 },
    { city: "Upington", name: "Waterfall Mall", lat: -25.6881, lng: 27.2642 },
    { city: "Potchefstroom", name: "Greenstone Shopping Centre", lat: -26.1187, lng: 28.1407 },
    { city: "Klerksdorp", name: "Clearwater Mall", lat: -26.1274, lng: 27.9042 },
    { city: "Welkom", name: "Fourways Mall", lat: -26.0175, lng: 28.0051 },
    { city: "Middelburg", name: "Maponya Mall", lat: -26.2584, lng: 27.9002 },
  ];

  const seededRandom = (seed: number) => {
    let s = seed;
    return () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  };

  const rng = seededRandom(42);

  const mallValues = southAfricanMalls.map((m, i) => ({
    id: `MALL-${1000 + i}`,
    name: m.name,
    city: m.city,
    sizeSqM: Math.floor(rng() * 80000) + 30000,
    floors: Math.floor(rng() * 4) + 1,
    footfall: Math.floor(rng() * 800000) + 150000,
    lat: m.lat,
    lng: m.lng,
    tenantId: m.name === "Mall of Africa" ? "TENANT-3" : "TENANT-OTHER",
  }));

  await db.insert(malls).values(mallValues);

  const assetTypes = ["Digital Billboard", "Screen", "Lightbox", "Elevator Wrap", "Escalator Panel"];
  const zones = ["North Atrium", "South Wing", "Food Court", "Main Entrance", "Luxury Corridor", "Center Plaza"];

  const assetValues = Array.from({ length: 300 }).map((_, i) => {
    const mall = mallValues[Math.floor(rng() * mallValues.length)];
    const type = assetTypes[Math.floor(rng() * assetTypes.length)];

    return {
      id: `AST-${5000 + i}`,
      mallId: mall.id,
      tenantId: "TENANT-1",
      assetName: `${type} ${Math.floor(rng() * 100)}`,
      assetType: type,
      floor: Math.floor(rng() * mall.floors),
      zone: zones[Math.floor(rng() * zones.length)],
      posX: (rng() - 0.5) * 40,
      posY: rng() * 2,
      posZ: (rng() - 0.5) * 40,
      screenSize: type === "Screen" || type === "Digital Billboard" ? "55 inch" : null,
      mediaFormat: type === "Lightbox" ? "Static Print" : "Digital Video",
      dailyImpressions: Math.floor(rng() * 5000) + 500,
      weeklyImpressions: Math.floor(rng() * 35000) + 3500,
      dwellTimeSeconds: Math.floor(rng() * 120) + 10,
      engagementScore: Math.floor(rng() * 100),
    };
  });

  for (let i = 0; i < assetValues.length; i += 100) {
    await db.insert(assets).values(assetValues.slice(i, i + 100));
  }

  const now = new Date();
  await db.insert(campaigns).values([
    {
      id: "CAMP-1",
      name: "Adidas Originals Launch",
      advertiserTenantId: "TENANT-2",
      startDate: format(now, "yyyy-MM-dd"),
      endDate: format(new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
      budget: 500000,
      status: "active",
      targetAudience: "18-35",
      cityFocus: "johannesburg",
    },
  ]);

  const timeSeriesData = Array.from({ length: 30 }).map((_, i) => {
    const date = subDays(now, 30 - i - 1);
    return {
      date: format(date, "MMM dd"),
      impressions: Math.floor(rng() * 50000) + 100000,
      footfall: Math.floor(rng() * 20000) + 50000,
    };
  });

  await db.insert(analyticsData).values(timeSeriesData);

  console.log("Seeding complete!");
  console.log(`  - ${mallValues.length} malls`);
  console.log(`  - ${assetValues.length} assets`);
  console.log(`  - ${timeSeriesData.length} analytics data points`);
}

const isDirectRun = process.argv[1]?.endsWith("seed.ts");
if (isDirectRun) {
  seed().then(() => process.exit(0)).catch((err) => {
    console.error("Seed error:", err);
    process.exit(1);
  });
}
