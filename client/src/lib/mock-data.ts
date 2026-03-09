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

// Generate 27 Malls
const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville", "Fort Worth", "Columbus", "Charlotte", "San Francisco", "Indianapolis", "Seattle", "Denver", "Washington", "Boston", "El Paso", "Nashville", "Detroit", "Oklahoma City", "Portland", "Las Vegas"];

export const malls: Mall[] = Array.from({ length: 27 }).map((_, i) => ({
  id: `MALL-${1000 + i}`,
  name: `Premium Outlet ${cities[i]}`,
  city: cities[i],
  size_sq_m: Math.floor(Math.random() * 50000) + 20000,
  floors: Math.floor(Math.random() * 3) + 1,
  footfall: Math.floor(Math.random() * 500000) + 100000,
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
