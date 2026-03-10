import { db } from "./db";
import { tenants, users, malls, assets, campaigns, analyticsData } from "@shared/schema";
import { format, subDays } from "date-fns";
import mallData from "./mall-data.json";

const SA_CITIES: Record<string, { city: string; lat: number; lng: number }> = {
  "Sandton City Mall": { city: "Johannesburg", lat: -26.1075, lng: 28.0567 },
  "Mall of Africa": { city: "Midrand", lat: -26.0159, lng: 28.1065 },
  "V & A Waterfront Mall": { city: "Cape Town", lat: -33.9036, lng: 18.4205 },
  "Menlyn Park Mall": { city: "Pretoria", lat: -25.7824, lng: 28.2754 },
  "Gateway Mall": { city: "Durban", lat: -29.7262, lng: 31.0664 },
  "Rosebank Mall": { city: "Johannesburg", lat: -26.1451, lng: 28.0406 },
  "Canal Walk Mall": { city: "Cape Town", lat: -33.8931, lng: 18.5133 },
  "Brooklyn Mall": { city: "Pretoria", lat: -25.7719, lng: 28.2343 },
  "Eastgate Mall": { city: "Johannesburg", lat: -26.1788, lng: 28.1158 },
  "Cavendish Square Mall": { city: "Cape Town", lat: -33.9788, lng: 18.4651 },
  "Pavilion Mall": { city: "Durban", lat: -29.8492, lng: 30.9348 },
  "Cresta Mall": { city: "Johannesburg", lat: -26.1287, lng: 27.9733 },
  "Centurion Mall": { city: "Pretoria", lat: -25.8587, lng: 28.1873 },
  "Greenacres Mall": { city: "Port Elizabeth", lat: -33.9482, lng: 25.5765 },
  "Walmer Park Mall": { city: "Port Elizabeth", lat: -33.9772, lng: 25.5802 },
  "Somerset Mall": { city: "Somerset West", lat: -34.0818, lng: 18.8229 },
  "Hemingways Mall": { city: "East London", lat: -32.9691, lng: 27.9015 },
  "Ilanga Mall": { city: "Nelspruit", lat: -25.4674, lng: 30.9575 },
  "Riverside Mall": { city: "Nelspruit", lat: -25.4385, lng: 30.9682 },
  "Mimosa Mall": { city: "Bloemfontein", lat: -29.1084, lng: 26.2052 },
  "Loch Logan Mall": { city: "Bloemfontein", lat: -29.1152, lng: 26.2115 },
  "Waterfall Mall": { city: "Rustenburg", lat: -25.6881, lng: 27.2642 },
  "Greenstone Mall": { city: "Johannesburg", lat: -26.1187, lng: 28.1407 },
  "Clearwater Mall": { city: "Johannesburg", lat: -26.1274, lng: 27.9042 },
  "Fourways Mall": { city: "Johannesburg", lat: -26.0175, lng: 28.0051 },
  "Maponya Mall": { city: "Johannesburg", lat: -26.2584, lng: 27.9002 },
  "Northgate Mall": { city: "Johannesburg", lat: -26.1008, lng: 27.9467 },
  "Southgate Mall": { city: "Johannesburg", lat: -26.2708, lng: 27.9922 },
  "The Glen Mall": { city: "Johannesburg", lat: -26.2553, lng: 28.0604 },
  "Bayside Mall": { city: "Cape Town", lat: -33.8000, lng: 18.5100 },
  "Blue Route Mall": { city: "Cape Town", lat: -34.0542, lng: 18.4653 },
  "Tyger Valley Mall": { city: "Cape Town", lat: -33.8706, lng: 18.6394 },
  "N1 City Mall": { city: "Cape Town", lat: -33.8900, lng: 18.5611 },
  "Table Bay Mall": { city: "Cape Town", lat: -33.8167, lng: 18.5181 },
  "Cape Gate Mall": { city: "Cape Town", lat: -33.8453, lng: 18.6475 },
  "Alberton City Mall": { city: "Johannesburg", lat: -26.2647, lng: 28.1227 },
  "Ballito Junction Regional Mall": { city: "Ballito", lat: -29.5373, lng: 31.2139 },
  "Cornubia Mall": { city: "Durban", lat: -29.7329, lng: 31.0162 },
  "Galleria Mall": { city: "Durban", lat: -29.9167, lng: 30.8500 },
  "Hyde Park Mall": { city: "Johannesburg", lat: -26.1233, lng: 28.0403 },
  "Hatfield Plaza": { city: "Pretoria", lat: -25.7506, lng: 28.2367 },
  "Kolonnade Mall": { city: "Pretoria", lat: -25.6825, lng: 28.1878 },
  "Springs Mall": { city: "Springs", lat: -26.2525, lng: 28.4408 },
  "Vaal Mall": { city: "Vanderbijlpark", lat: -26.7106, lng: 27.8111 },
  "East Rand Mall": { city: "Johannesburg", lat: -26.1728, lng: 28.1728 },
  "Woodlands Mall": { city: "Pretoria", lat: -25.7167, lng: 28.2333 },
  "Wonderpark Mall": { city: "Pretoria", lat: -25.6500, lng: 28.1833 },
  "Musgrave Mall": { city: "Durban", lat: -29.8419, lng: 31.0047 },
  "Liberty Midlands Mall": { city: "Pietermaritzburg", lat: -29.5767, lng: 30.3892 },
  "Cosmo Mall": { city: "Johannesburg", lat: -26.0383, lng: 27.9253 },
  "Monte Casino Mall": { city: "Johannesburg", lat: -26.0281, lng: 28.0119 },
  "OR Tambo International Airport": { city: "Johannesburg", lat: -26.1367, lng: 28.2411 },
  "King Shaka International Airport": { city: "Durban", lat: -29.6144, lng: 31.1197 },
  "Cape Town International Airport": { city: "Cape Town", lat: -33.9648, lng: 18.6017 },
  "Promenade Mall": { city: "Mitchells Plain", lat: -34.0456, lng: 18.6164 },
  "Festival Mall": { city: "Kempton Park", lat: -26.1033, lng: 28.2319 },
  "Jabulani Mall": { city: "Johannesburg", lat: -26.2503, lng: 27.8589 },
  "Dobsonville Mall": { city: "Johannesburg", lat: -26.2228, lng: 27.8589 },
  "Nicolway Shopping Centre": { city: "Johannesburg", lat: -26.0764, lng: 28.0322 },
  "Bedfordview Malls": { city: "Johannesburg", lat: -26.1800, lng: 28.1300 },
  "Middelburg Mall": { city: "Middelburg", lat: -25.7800, lng: 29.4600 },
  "Newcastle Mall": { city: "Newcastle", lat: -27.7650, lng: 29.9300 },
  "Mall of the North": { city: "Polokwane", lat: -23.8600, lng: 29.4700 },
  "Mall of the South": { city: "Johannesburg", lat: -26.2947, lng: 28.0383 },
  "Benmore Gardens Shopping Centre": { city: "Johannesburg", lat: -26.1075, lng: 28.0525 },
  "Sunnypark Mall": { city: "Pretoria", lat: -25.7425, lng: 28.2156 },
  "Stoneridge Centre": { city: "Johannesburg", lat: -26.1250, lng: 28.1250 },
  "Kenilworth Centre": { city: "Cape Town", lat: -33.9981, lng: 18.4794 },
  "Long Beach Mall": { city: "Cape Town", lat: -34.1267, lng: 18.4683 },
  "Golden Acre Mall": { city: "Cape Town", lat: -33.9233, lng: 18.4236 },
  "Design Square": { city: "Johannesburg", lat: -26.1342, lng: 28.0508 },
  "Westgate Mall": { city: "Johannesburg", lat: -26.1750, lng: 27.9167 },
  "Constantia Village Mall": { city: "Cape Town", lat: -34.0258, lng: 18.4361 },
  "Paarl Mall": { city: "Paarl", lat: -33.7311, lng: 18.9700 },
  "Key West Mall": { city: "Krugersdorp", lat: -26.1039, lng: 27.7769 },
  "Bridge City": { city: "Durban", lat: -29.7472, lng: 30.9717 },
  "Chris Hani Crossing": { city: "Johannesburg", lat: -26.2942, lng: 28.0267 },
  "Chatsworth Mall": { city: "Durban", lat: -29.9050, lng: 30.8939 },
  "Kalahari Mall": { city: "Upington", lat: -28.4611, lng: 21.2681 },
  "South Coast Mall": { city: "Shelly Beach", lat: -30.7833, lng: 30.4000 },
  "BT Ngebs Mall": { city: "Mthatha", lat: -31.5939, lng: 28.7778 },
};

function inferCity(name: string): { city: string; lat: number; lng: number } {
  if (SA_CITIES[name]) return SA_CITIES[name];
  const n = name.toLowerCase();
  if (n.includes("cape") || n.includes("atlantic") || n.includes("plattekloof") || n.includes("zevenwacht")) return { city: "Cape Town", lat: -33.92 + Math.random() * 0.2, lng: 18.42 + Math.random() * 0.3 };
  if (n.includes("durban") || n.includes("umhlanga") || n.includes("umlazi") || n.includes("kwa mashu") || n.includes("westville") || n.includes("pinecrest") || n.includes("phoenix") || n.includes("bluff") || n.includes("davenport") || n.includes("oceans") || n.includes("springfield") || n.includes("watercrest")) return { city: "Durban", lat: -29.85 + Math.random() * 0.2, lng: 30.9 + Math.random() * 0.2 };
  if (n.includes("pretoria") || n.includes("centurion") || n.includes("montana") || n.includes("kolonade") || n.includes("sammy marks") || n.includes("state theatre") || n.includes("lynnwood") || n.includes("atterbury")) return { city: "Pretoria", lat: -25.75 + Math.random() * 0.15, lng: 28.18 + Math.random() * 0.1 };
  if (n.includes("nelspruit") || n.includes("emalahleni") || n.includes("witbank")) return { city: "Nelspruit", lat: -25.47 + Math.random() * 0.1, lng: 30.97 + Math.random() * 0.1 };
  if (n.includes("bloemfontein")) return { city: "Bloemfontein", lat: -29.1 + Math.random() * 0.1, lng: 26.2 + Math.random() * 0.1 };
  if (n.includes("polokwane")) return { city: "Polokwane", lat: -23.9 + Math.random() * 0.05, lng: 29.45 + Math.random() * 0.05 };
  if (n.includes("pietermaritzburg") || n.includes("hayfields") || n.includes("scottsville") || n.includes("midlands")) return { city: "Pietermaritzburg", lat: -29.6 + Math.random() * 0.05, lng: 30.38 + Math.random() * 0.05 };
  if (n.includes("empangeni") || n.includes("mtuba") || n.includes("twin city")) return { city: "Richards Bay", lat: -28.75 + Math.random() * 0.1, lng: 32.0 + Math.random() * 0.1 };
  if (n.includes("rustenburg")) return { city: "Rustenburg", lat: -25.67 + Math.random() * 0.05, lng: 27.24 + Math.random() * 0.05 };
  if (n.includes("east london") || n.includes("hemingways") || n.includes("boardwalk")) return { city: "East London", lat: -33.0 + Math.random() * 0.1, lng: 27.9 + Math.random() * 0.1 };
  if (n.includes("port elizabeth") || n.includes("greenacres") || n.includes("walmer")) return { city: "Port Elizabeth", lat: -33.95 + Math.random() * 0.05, lng: 25.57 + Math.random() * 0.05 };
  return { city: "Johannesburg", lat: -26.1 + Math.random() * 0.2, lng: 27.9 + Math.random() * 0.3 };
}

const DIVISION_TO_ASSET_TYPES: Record<string, { type: string; screenSize: string | null; mediaFormat: string }[]> = {
  "Mall Digital": [
    { type: "Digital Billboard", screenSize: "55 inch", mediaFormat: "Digital Video" },
    { type: "Screen", screenSize: "42 inch", mediaFormat: "Digital Video" },
  ],
  "Mall Static": [
    { type: "Lightbox", screenSize: null, mediaFormat: "Static Print" },
  ],
  "Prime Courts": [
    { type: "Escalator Panel", screenSize: null, mediaFormat: "Digital Video" },
    { type: "Elevator Wrap", screenSize: null, mediaFormat: "Static Print" },
  ],
  "Static - TLC": [
    { type: "Lightbox", screenSize: null, mediaFormat: "Static Print" },
  ],
  "Syndication Sales": [
    { type: "Digital Billboard", screenSize: "75 inch", mediaFormat: "Digital Video" },
  ],
  "Mall Adhoc": [
    { type: "Screen", screenSize: "32 inch", mediaFormat: "Digital Video" },
  ],
};

const ZONES = ["North Atrium", "South Wing", "Food Court", "Main Entrance", "Luxury Corridor", "Center Plaza", "Parking Level", "Concourse"];

export async function seed() {
  console.log("Checking if database needs seeding...");

  const [existingMall] = await db.select().from(malls).limit(1);
  if (existingMall) {
    console.log("Database already seeded, skipping.");
    return;
  }

  console.log("Seeding database with real Primedia mall inventory...");

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
  ]);

  const mallOfAfricaIdx = Array.from(new Set((mallData as any[]).map((r: any) => r.LOCATION))).indexOf("Mall of Africa");
  const mallOfAfricaId = `MALL-${String(mallOfAfricaIdx + 1).padStart(4, "0")}`;

  await db.insert(users).values([
    { id: "U5", name: "David Ndlovu", email: "david@mallofafrica.co.za", password: "mall123", role: "mall_partner", organization: "Mall of Africa", tenantId: "TENANT-3", allowedMalls: [mallOfAfricaId] },
  ]);

  const seededRandom = (s: number) => {
    let state = s;
    return () => {
      state = (state * 16807) % 2147483647;
      return (state - 1) / 2147483646;
    };
  };
  const rng = seededRandom(42);

  type MallRow = { LOCATION: string; DIVISION: string; TOTAL_STRUCTURE_COUNT: number; AVAILABLE_SLOTS: number; SOLD_SLOTS: number; OCCUPANCY: number };
  const rows = mallData as MallRow[];

  const uniqueMalls = Array.from(new Set(rows.map((r) => r.LOCATION)));

  const mallValues = uniqueMalls.map((name, i) => {
    const geo = inferCity(name);
    const mallRows = rows.filter((r) => r.LOCATION === name);
    const totalStructures = mallRows.reduce((sum, r) => sum + (r.TOTAL_STRUCTURE_COUNT || 0), 0);

    return {
      id: `MALL-${String(i + 1).padStart(4, "0")}`,
      name,
      city: geo.city,
      sizeSqM: Math.floor(rng() * 80000) + 20000,
      floors: Math.max(1, Math.min(4, Math.ceil(totalStructures / 30))),
      footfall: Math.floor(rng() * 800000) + 100000,
      lat: geo.lat,
      lng: geo.lng,
      tenantId: name === "Mall of Africa" ? "TENANT-3" : "TENANT-1",
    };
  });

  for (let i = 0; i < mallValues.length; i += 50) {
    await db.insert(malls).values(mallValues.slice(i, i + 50));
  }

  const mallIdMap = new Map(mallValues.map((m) => [m.name, { id: m.id, floors: m.floors }]));

  let assetCounter = 1;
  const allAssets: any[] = [];

  for (const row of rows) {
    const mallInfo = mallIdMap.get(row.LOCATION);
    if (!mallInfo) continue;

    const divisionTypes = DIVISION_TO_ASSET_TYPES[row.DIVISION] || DIVISION_TO_ASSET_TYPES["Mall Adhoc"];
    const structureCount = row.TOTAL_STRUCTURE_COUNT || 0;

    for (let s = 0; s < structureCount; s++) {
      const assetDef = divisionTypes[Math.floor(rng() * divisionTypes.length)];
      const zone = ZONES[Math.floor(rng() * ZONES.length)];
      const floor = Math.floor(rng() * mallInfo.floors);

      allAssets.push({
        id: `AST-${String(assetCounter++).padStart(5, "0")}`,
        mallId: mallInfo.id,
        tenantId: "TENANT-1",
        assetName: `${assetDef.type} ${s + 1}`,
        assetType: assetDef.type,
        floor,
        zone,
        posX: (rng() - 0.5) * 40,
        posY: rng() * 2,
        posZ: (rng() - 0.5) * 40,
        screenSize: assetDef.screenSize,
        mediaFormat: assetDef.mediaFormat,
        dailyImpressions: Math.floor(rng() * 5000) + 500,
        weeklyImpressions: Math.floor(rng() * 35000) + 3500,
        dwellTimeSeconds: Math.floor(rng() * 120) + 10,
        engagementScore: Math.floor(rng() * 100),
      });
    }
  }

  for (let i = 0; i < allAssets.length; i += 100) {
    await db.insert(assets).values(allAssets.slice(i, i + 100));
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
  console.log(`  - ${allAssets.length} assets`);
  console.log(`  - ${timeSeriesData.length} analytics data points`);
}

const isDirectRun = process.argv[1]?.endsWith("seed.ts");
if (isDirectRun) {
  seed().then(() => process.exit(0)).catch((err) => {
    console.error("Seed error:", err);
    process.exit(1);
  });
}
