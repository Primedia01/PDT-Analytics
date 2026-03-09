import { subDays, subMonths, format } from "date-fns";

export type Mall = {
  id: string;
  name: string;
  city: string;
  size_sq_m: number;
  floors: number;
  footfall: number;
};

export type AssetType = "Digital Billboard" | "Screen" | "Lightbox" | "Elevator Wrap" | "Escalator Panel";

export type Asset = {
  id: string;
  mall_id: string;
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

export type AnalyticsPoint = {
  date: string;
  impressions: number;
  dwell_time: number;
  traffic_volume: number;
};

// Generate 27 South African Malls
const southAfricanMalls = [
  { city: "Johannesburg", name: "Sandton City" },
  { city: "Cape Town", name: "Mall of Africa" },
  { city: "Durban", name: "V&A Waterfront" },
  { city: "Pretoria", name: "Menlyn Park" },
  { city: "Durban", name: "Gateway Theatre of Shopping" },
  { city: "Johannesburg", name: "Rosebank Mall" },
  { city: "Cape Town", name: "Canal Walk" },
  { city: "Pretoria", name: "Brooklyn Mall" },
  { city: "Johannesburg", name: "Eastgate Shopping Centre" },
  { city: "Cape Town", name: "Cavendish Square" },
  { city: "Durban", name: "Pavilion Shopping Centre" },
  { city: "Johannesburg", name: "Cresta Shopping Centre" },
  { city: "Pretoria", name: "Centurion Mall" },
  { city: "Port Elizabeth", name: "Greenacres Shopping Centre" },
  { city: "Bloemfontein", name: "Walmer Park Shopping Centre" },
  { city: "East London", name: "Somerset Mall" },
  { city: "Nelspruit", name: "Hemingways Mall" },
  { city: "Kimberley", name: "Ilanga Mall" },
  { city: "Polokwane", name: "Riverside Mall" },
  { city: "Pietermaritzburg", name: "Liberty Promenade" },
  { city: "George", name: "Mimosa Mall" },
  { city: "Rustenburg", name: "Loch Logan Waterfront" },
  { city: "Upington", name: "Waterfall Mall" },
  { city: "Potchefstroom", name: "Greenstone Shopping Centre" },
  { city: "Klerksdorp", name: "Clearwater Mall" },
  { city: "Welkom", name: "Fourways Mall" },
  { city: "Middelburg", name: "Maponya Mall" }
];

export const malls: Mall[] = southAfricanMalls.map((m, i) => ({
  id: `MALL-${1000 + i}`,
  name: m.name,
  city: m.city,
  size_sq_m: Math.floor(Math.random() * 80000) + 30000,
  floors: Math.floor(Math.random() * 4) + 1,
  footfall: Math.floor(Math.random() * 800000) + 150000,
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
