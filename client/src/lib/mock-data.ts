import { subDays, subMonths, format } from "date-fns";

export type TenantType = "media_owner" | "advertiser" | "agency" | "mall_operator";

export type Tenant = {
  id: string;
  name: string;
  type: TenantType;
};

export const tenants: Tenant[] = [
  { id: "TENANT-1", name: "Primedia", type: "media_owner" },
  { id: "TENANT-2", name: "Adidas", type: "advertiser" },
  { id: "TENANT-3", name: "Mall of Africa", type: "mall_operator" },
];

export type Mall = {
  id: string;
  name: string;
  city: string;
  size_sq_m: number;
  floors: number;
  footfall: number;
  coordinates: [number, number]; // [lat, lng]
  tenant_id: string; // Tenant of the mall operator
};

export type AssetType = "Digital Billboard" | "Screen" | "Lightbox" | "Elevator Wrap" | "Escalator Panel";

export type Asset = {
  id: string;
  mall_id: string;
  tenant_id: string; // Tenant of the media owner
  asset_name: string;
  asset_type: AssetType;
  floor: number;
  zone: string;
  position: [number, number, number]; // 3D coordinates [x, y, z]
  screen_size?: string;
  media_format?: string;
  daily_impressions: number;
  weekly_impressions: number;
  dwell_time_seconds: number;
  engagement_score: number; // 0-100
};

export type Campaign = {
  id: string;
  name: string;
  advertiser_tenant_id: string;
  start_date: string;
  end_date: string;
  budget: number;
};

export const campaigns: Campaign[] = [
  {
    id: "CAMP-1",
    name: "Adidas Originals Launch",
    advertiser_tenant_id: "TENANT-2", // Adidas
    start_date: format(new Date(), "yyyy-MM-dd"),
    end_date: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
    budget: 500000,
  }
];

export type AnalyticsPoint = {
  date: string;
  impressions: number;
  dwell_time: number;
  traffic_volume: number;
};

// Generate 27 South African Malls
const southAfricanMalls = [
  { city: "Johannesburg", name: "Sandton City", coordinates: [-26.1075, 28.0567] as [number, number] },
  { city: "Cape Town", name: "Mall of Africa", coordinates: [-26.0159, 28.1065] as [number, number] },
  { city: "Durban", name: "V&A Waterfront", coordinates: [-33.9036, 18.4205] as [number, number] },
  { city: "Pretoria", name: "Menlyn Park", coordinates: [-25.7824, 28.2754] as [number, number] },
  { city: "Durban", name: "Gateway Theatre of Shopping", coordinates: [-29.7262, 31.0664] as [number, number] },
  { city: "Johannesburg", name: "Rosebank Mall", coordinates: [-26.1451, 28.0406] as [number, number] },
  { city: "Cape Town", name: "Canal Walk", coordinates: [-33.8931, 18.5133] as [number, number] },
  { city: "Pretoria", name: "Brooklyn Mall", coordinates: [-25.7719, 28.2343] as [number, number] },
  { city: "Johannesburg", name: "Eastgate Shopping Centre", coordinates: [-26.1788, 28.1158] as [number, number] },
  { city: "Cape Town", name: "Cavendish Square", coordinates: [-33.9788, 18.4651] as [number, number] },
  { city: "Durban", name: "Pavilion Shopping Centre", coordinates: [-29.8492, 30.9348] as [number, number] },
  { city: "Johannesburg", name: "Cresta Shopping Centre", coordinates: [-26.1287, 27.9733] as [number, number] },
  { city: "Pretoria", name: "Centurion Mall", coordinates: [-25.8587, 28.1873] as [number, number] },
  { city: "Port Elizabeth", name: "Greenacres Shopping Centre", coordinates: [-33.9482, 25.5765] as [number, number] },
  { city: "Bloemfontein", name: "Walmer Park Shopping Centre", coordinates: [-33.9772, 25.5802] as [number, number] },
  { city: "East London", name: "Somerset Mall", coordinates: [-34.0818, 18.8229] as [number, number] },
  { city: "Nelspruit", name: "Hemingways Mall", coordinates: [-32.9691, 27.9015] as [number, number] },
  { city: "Kimberley", name: "Ilanga Mall", coordinates: [-25.4674, 30.9575] as [number, number] },
  { city: "Polokwane", name: "Riverside Mall", coordinates: [-25.4385, 30.9682] as [number, number] },
  { city: "Pietermaritzburg", name: "Liberty Promenade", coordinates: [-34.0487, 18.6186] as [number, number] },
  { city: "George", name: "Mimosa Mall", coordinates: [-29.1084, 26.2052] as [number, number] },
  { city: "Rustenburg", name: "Loch Logan Waterfront", coordinates: [-29.1152, 26.2115] as [number, number] },
  { city: "Upington", name: "Waterfall Mall", coordinates: [-25.6881, 27.2642] as [number, number] },
  { city: "Potchefstroom", name: "Greenstone Shopping Centre", coordinates: [-26.1187, 28.1407] as [number, number] },
  { city: "Klerksdorp", name: "Clearwater Mall", coordinates: [-26.1274, 27.9042] as [number, number] },
  { city: "Welkom", name: "Fourways Mall", coordinates: [-26.0175, 28.0051] as [number, number] },
  { city: "Middelburg", name: "Maponya Mall", coordinates: [-26.2584, 27.9002] as [number, number] }
];

export const malls: Mall[] = southAfricanMalls.map((m, i) => ({
  id: `MALL-${1000 + i}`,
  name: m.name,
  city: m.city,
  size_sq_m: Math.floor(Math.random() * 80000) + 30000,
  floors: Math.floor(Math.random() * 4) + 1,
  footfall: Math.floor(Math.random() * 800000) + 150000,
  coordinates: m.coordinates,
  tenant_id: m.name === "Mall of Africa" ? "TENANT-3" : "TENANT-OTHER" // Example of assigning Mall of Africa to specific tenant
}));

// Generate 300 Assets spread across malls
const assetTypes: AssetType[] = ["Digital Billboard", "Screen", "Lightbox", "Elevator Wrap", "Escalator Panel"];
const zones = ["North Atrium", "South Wing", "Food Court", "Main Entrance", "Luxury Corridor", "Center Plaza"];

export const assets: Asset[] = Array.from({ length: 300 }).map((_, i) => {
  const mall = malls[Math.floor(Math.random() * malls.length)];
  const type = assetTypes[Math.floor(Math.random() * assetTypes.length)];
  
  return {
    id: `AST-${5000 + i}`,
    mall_id: mall.id,
    tenant_id: "TENANT-1", // Primedia owns the assets
    asset_name: `${type} ${Math.floor(Math.random() * 100)}`,
    asset_type: type,
    floor: Math.floor(Math.random() * mall.floors),
    zone: zones[Math.floor(Math.random() * zones.length)],
    // Random 3D positions spread out for the viewer
    position: [
      (Math.random() - 0.5) * 40, 
      Math.random() * 2, // slight height variation
      (Math.random() - 0.5) * 40
    ],
    screen_size: type === "Screen" || type === "Digital Billboard" ? "55 inch" : undefined,
    media_format: type === "Lightbox" ? "Static Print" : "Digital Video",
    daily_impressions: Math.floor(Math.random() * 5000) + 500,
    weekly_impressions: Math.floor(Math.random() * 35000) + 3500,
    dwell_time_seconds: Math.floor(Math.random() * 120) + 10,
    engagement_score: Math.floor(Math.random() * 100),
  };
});

// Generate Portfolio Time Series Data (last 30 days)
export const generateTimeSeriesData = (days = 30) => {
  return Array.from({ length: days }).map((_, i) => {
    const date = subDays(new Date(), days - i - 1);
    return {
      date: format(date, "MMM dd"),
      impressions: Math.floor(Math.random() * 50000) + 100000, // 100k - 150k
      footfall: Math.floor(Math.random() * 20000) + 50000,
    };
  });
};

export const portfolioData = generateTimeSeriesData(30);

// Aggregates
export const portfolioStats = {
  totalMalls: malls.length,
  totalAssets: assets.length,
  totalImpressions: assets.reduce((acc, curr) => acc + curr.weekly_impressions * 4, 0), // monthly est
  totalFootfall: malls.reduce((acc, curr) => acc + curr.footfall, 0),
};
