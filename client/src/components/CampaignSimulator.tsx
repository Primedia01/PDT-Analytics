import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { malls, assets } from "@/lib/mock-data";
import { CheckCircle2, TrendingUp, Users, Target, CreditCard, Sparkles, Building2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function CampaignSimulator() {
  const [isRunning, setIsRunning] = useState(false);
  const [isLaunched, setIsLaunched] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { user } = useAuth();
  
  const isAdvertiser = user.role === "advertiser";

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRunning(true);
    setIsLaunched(false);
    
    // Mock simulation delay to mimic AI optimization engine
    setTimeout(() => {
      setIsRunning(false);
      
      // Generate some dynamic pricing for the results based on mock data
      const baseCost = 120000;
      const optimizedCost = Math.round(baseCost * 0.85); // AI saved 15%
      
      setResults({
        recommendedAssets: [
          { name: "Sandton City Escalators", type: "Escalator Panel", score: 98, price: 15000 },
          { name: "Mall of Africa Entrance", type: "Screen", score: 94, price: 22000 },
          { name: "Rosebank Mall Atrium", type: "Digital Billboard", score: 89, price: 35000 }
        ],
        impressions: "8.7M",
        reach: "3.4M",
        cost: optimizedCost,
        aiInsight: "Budget reallocated from underperforming corridor lightboxes to high-engagement digital screens, resulting in a 15% lower CPM."
      });
    }, 1500);
  };

  const handleLaunch = () => {
    setIsLaunched(true);
  };

  return (
    <Card className="border-border/50 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="h-5 w-5 text-primary" />
          Campaign Builder
        </CardTitle>
        <CardDescription>
          {isAdvertiser 
            ? "Plan your campaign, let AI optimize your inventory selection, and buy programmatically." 
            : "Simulate performance and optimize asset selection for client pitches."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between overflow-auto">
        <Tabs defaultValue="build" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="build">1. Parameters & Optimization</TabsTrigger>
            <TabsTrigger value="checkout" disabled={!results}>2. Review & Launch</TabsTrigger>
          </TabsList>
          
          <TabsContent value="build">
            <form onSubmit={handleSimulate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Brand / Campaign Name</Label>
                <Input id="brand" placeholder="e.g. Summer Collection Launch" required />
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
                  <Input id="duration" type="number" min="1" defaultValue="4" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget (ZAR)</Label>
                  <Input id="budget" type="number" placeholder="e.g. 500000" defaultValue="150000" required />
                </div>
              </div>

              <Button type="submit" className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90" disabled={isRunning}>
                {isRunning ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 animate-spin" /> Optimizing with AI Engine...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" /> Run AI Campaign Optimizer
                  </span>
                )}
              </Button>
            </form>

            {results && !isRunning && (
              <div className="mt-6 p-4 rounded-lg bg-secondary/20 border border-border animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    AI Optimized Media Plan
                  </h4>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                    High Confidence Match
                  </Badge>
                </div>
                
                <div className="bg-primary/10 border border-primary/20 p-3 rounded-md mb-4 flex gap-3 text-sm">
                  <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p><span className="font-semibold text-primary">AI Insight: </span>{results.aiInsight}</p>
                </div>
                
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-background p-3 rounded border border-border">
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                      <TrendingUp className="h-3 w-3" /> Est. Impressions
                    </div>
                    <div className="text-xl font-bold">{results.impressions}</div>
                  </div>
                  <div className="bg-background p-3 rounded border border-border">
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                      <Users className="h-3 w-3" /> Shopper Reach
                    </div>
                    <div className="text-xl font-bold">{results.reach}</div>
                  </div>
                  <div className="bg-background p-3 rounded border border-border">
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                      <CreditCard className="h-3 w-3" /> Total Cost
                    </div>
                    <div className="text-xl font-bold text-primary">R {(results.cost / 1000).toFixed(0)}k</div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Top Recommended Placements</p>
                  <div className="space-y-2">
                    {results.recommendedAssets.map((asset: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-sm p-2.5 bg-background rounded border border-border/50">
                        <div>
                          <p className="font-medium">{asset.name}</p>
                          <p className="text-xs text-muted-foreground">{asset.type}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-emerald-500 font-mono text-xs">{asset.score}% Match</div>
                          <div className="text-xs font-medium">R {asset.price.toLocaleString()}/mo</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="checkout" className="space-y-6">
             <div className="bg-secondary/20 p-6 rounded-lg border border-border text-center">
               <Building2 className="h-12 w-12 text-primary mx-auto mb-3" />
               <h3 className="text-xl font-bold mb-1">Ready to Launch</h3>
               <p className="text-muted-foreground text-sm max-w-md mx-auto">
                 Your programmatic media plan for {results?.reach} shoppers is ready. The inventory will be reserved immediately upon booking.
               </p>
             </div>
             
             <div className="space-y-4 border border-border rounded-lg p-4 bg-background">
                <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Payment Method</h4>
                <div className="grid grid-cols-1 gap-3">
                  <label className="flex items-center gap-3 p-3 border border-primary bg-primary/5 rounded-md cursor-pointer">
                    <input type="radio" name="payment" defaultChecked className="text-primary focus:ring-primary h-4 w-4" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">Agency Invoice (Net 30)</p>
                      <p className="text-xs text-muted-foreground">Billed to {user.organization} account.</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-border rounded-md cursor-pointer opacity-70">
                    <input type="radio" name="payment" className="text-primary focus:ring-primary h-4 w-4" disabled />
                    <div className="flex-1">
                      <p className="font-medium text-sm flex justify-between">Credit Card <Badge variant="secondary" className="text-[10px]">Coming Soon</Badge></p>
                      <p className="text-xs text-muted-foreground">Pay immediately via secure gateway.</p>
                    </div>
                  </label>
                </div>
             </div>

             {isLaunched ? (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-center animate-in fade-in zoom-in">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                  <h4 className="font-bold text-emerald-500 mb-1">Campaign Successfully Booked!</h4>
                  <p className="text-sm text-emerald-500/80">Your programmatic buys have been secured. The creatives will begin serving on the selected dates.</p>
                </div>
             ) : (
               <Button onClick={handleLaunch} className="w-full h-12 text-base font-bold bg-primary hover:bg-primary/90">
                 Book Campaign (R {(results?.cost || 0).toLocaleString()})
               </Button>
             )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
