import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { malls, assets } from "@/lib/mock-data";
import { CheckCircle2, TrendingUp, Users, Target } from "lucide-react";

export function CampaignSimulator() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRunning(true);
    
    // Mock simulation delay
    setTimeout(() => {
      setIsRunning(false);
      setResults({
        recommendedAssets: [
          { name: "Sandton City Escalators", type: "Escalator Panel", score: 98 },
          { name: "Mall of Africa Entrance", type: "Screen", score: 94 },
          { name: "Rosebank Mall Atrium", type: "Digital Billboard", score: 89 }
        ],
        impressions: "8.7M",
        reach: "3.4M"
      });
    }, 1500);
  };

  return (
    <Card className="border-border/50 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="h-5 w-5 text-primary" />
          Plan Campaign
        </CardTitle>
        <CardDescription>Simulate performance and optimize asset selection.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <form onSubmit={handleSimulate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="brand">Brand / Campaign Name</Label>
            <Input id="brand" placeholder="e.g. Adidas Summer Collection" required />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="audience">Target Audience</Label>
              <Select defaultValue="18-35">
                <SelectTrigger id="audience">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Demographics</SelectItem>
                  <SelectItem value="18-35">18–35 (Gen Z & Millennial)</SelectItem>
                  <SelectItem value="35-55">35–55 (Professionals)</SelectItem>
                  <SelectItem value="55+">55+ (Seniors)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City Focus</Label>
              <Select defaultValue="johannesburg">
                <SelectTrigger id="city">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="national">National (All SA)</SelectItem>
                  <SelectItem value="johannesburg">Johannesburg</SelectItem>
                  <SelectItem value="cape_town">Cape Town</SelectItem>
                  <SelectItem value="durban">Durban</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (Weeks)</Label>
              <Input id="duration" type="number" min="1" defaultValue="2" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Budget (ZAR) - Optional</Label>
              <Input id="budget" type="number" placeholder="e.g. 500000" />
            </div>
          </div>

          <Button type="submit" className="w-full mt-4" disabled={isRunning}>
            {isRunning ? "Simulating..." : "Run AI Simulation"}
          </Button>
        </form>

        {results && (
          <div className="mt-6 p-4 rounded-lg bg-secondary/50 border border-border animate-in fade-in slide-in-from-bottom-2">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Simulation Results
            </h4>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-background p-3 rounded border border-border">
                <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                  <TrendingUp className="h-3 w-3" /> Est. Impressions
                </div>
                <div className="text-xl font-bold text-primary">{results.impressions}</div>
              </div>
              <div className="bg-background p-3 rounded border border-border">
                <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                  <Users className="h-3 w-3" /> Shopper Reach
                </div>
                <div className="text-xl font-bold text-accent">{results.reach}</div>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Recommended Assets</p>
              <div className="space-y-2">
                {results.recommendedAssets.map((asset: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-sm p-2 bg-background rounded border border-border/50">
                    <div>
                      <p className="font-medium">{asset.name}</p>
                      <p className="text-xs text-muted-foreground">{asset.type}</p>
                    </div>
                    <div className="text-emerald-500 font-mono text-xs">{asset.score}% Match</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
