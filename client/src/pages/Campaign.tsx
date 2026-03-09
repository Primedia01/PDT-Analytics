import { CampaignSimulator } from "@/components/CampaignSimulator";
import { useAuth } from "@/lib/auth";

export default function CampaignPage() {
  const { user } = useAuth();
  
  // Internal, Admin, and Sales see the planning simulator
  // Advertisers see it as their own campaign planner
  const title = user.role === "advertiser" ? "Campaign Planner" : "Campaign Simulator";
  const desc = user.role === "advertiser" 
    ? "Plan and estimate reach for your upcoming retail media campaigns."
    : "Simulate and optimize retail media campaigns for client pitches.";

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-1">{desc}</p>
      </div>
      
      <div className="h-[600px]">
        <CampaignSimulator />
      </div>
    </div>
  );
}