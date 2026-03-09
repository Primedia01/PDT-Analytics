import { CampaignSimulator } from "@/components/CampaignSimulator";

export default function CampaignPage() {
  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Campaign Planning</h1>
        <p className="text-muted-foreground mt-1">Simulate and optimize your retail media campaigns.</p>
      </div>
      
      <div className="h-[600px]">
        <CampaignSimulator />
      </div>
    </div>
  );
}