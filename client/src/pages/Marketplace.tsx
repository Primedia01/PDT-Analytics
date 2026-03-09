import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAssets, useMalls } from "@/lib/api";
import { Search, ShoppingCart, Filter, TrendingUp, TrendingDown, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";

export default function Marketplace() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: assets = [], isLoading: assetsLoading } = useAssets();
  const { data: malls = [], isLoading: mallsLoading } = useMalls();

  const isLoading = assetsLoading || mallsLoading;

  const marketplaceInventory = assets.map(asset => {
    const mall = malls.find(m => m.id === asset.mallId);

    let basePrice = 5000;
    if (asset.assetType === "Digital Billboard") basePrice = 25000;
    if (asset.assetType === "Screen") basePrice = 12000;

    let demandModifier = 1;
    let demandStatus = "Normal";

    if (asset.engagementScore > 80 && asset.weeklyImpressions > 20000) {
      demandModifier = 1.2;
      demandStatus = "High Demand";
    } else if (asset.engagementScore < 40) {
      demandModifier = 0.8;
      demandStatus = "Low Occupancy";
    }

    const finalPrice = Math.round(basePrice * demandModifier);

    return {
      ...asset,
      mall,
      basePrice,
      finalPrice,
      demandStatus,
      demandModifier
    };
  });

  const filteredInventory = marketplaceInventory.filter(item => {
    const matchesSearch = item.assetName.toLowerCase().includes(search.toLowerCase()) || 
                          item.mall?.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || item.assetType === typeFilter;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" data-testid="text-marketplace-title">Programmatic Media Marketplace</h1>
          <p className="text-muted-foreground mt-1">Browse, filter, and buy premium retail media inventory dynamically.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" className="gap-2" onClick={() => setLocation("/campaign")} data-testid="button-launch-campaign">
            <ShoppingCart className="h-4 w-4" />
            Launch Campaign Builder
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-card p-4 rounded-lg border border-border/50">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by mall or asset name..." 
            className="pl-9 bg-background"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-testid="input-search"
          />
        </div>
        <div className="w-48">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger data-testid="select-type-filter">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Asset Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Digital Billboard">Digital Billboard</SelectItem>
              <SelectItem value="Screen">Screen</SelectItem>
              <SelectItem value="Lightbox">Lightbox</SelectItem>
              <SelectItem value="Escalator Panel">Escalator Panel</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredInventory.slice(0, 12).map((item) => (
            <Card key={item.id} className="border-border/50 flex flex-col overflow-hidden hover:border-primary/50 transition-colors group" data-testid={`card-asset-${item.id}`}>
              <div className="h-32 bg-secondary/30 relative flex items-center justify-center p-4 border-b border-border/50">
                 <div className="w-full h-full bg-background rounded border border-dashed border-border/50 flex flex-col items-center justify-center text-muted-foreground">
                   <span className="text-xs uppercase tracking-widest">{item.assetType}</span>
                 </div>
                 {item.demandStatus !== "Normal" && (
                   <Badge 
                     className={`absolute top-2 right-2 ${item.demandStatus === 'High Demand' ? 'bg-orange-500/20 text-orange-500 hover:bg-orange-500/30 border-orange-500/50' : 'bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 border-emerald-500/50'}`}
                     variant="outline"
                     data-testid={`badge-demand-${item.id}`}
                   >
                     {item.demandStatus === 'High Demand' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                     {item.demandStatus}
                   </Badge>
                 )}
              </div>
              
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base line-clamp-1" title={item.assetName} data-testid={`text-asset-name-${item.id}`}>{item.assetName}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{item.mall?.name}, {item.mall?.city}</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-4 pt-0 flex-1">
                <div className="grid grid-cols-2 gap-y-2 text-sm mt-3">
                  <div className="text-muted-foreground text-xs">Est. Reach</div>
                  <div className="text-right font-medium" data-testid={`text-reach-${item.id}`}>{(item.weeklyImpressions * 4).toLocaleString()} /mo</div>
                  
                  <div className="text-muted-foreground text-xs">Engagement</div>
                  <div className="text-right font-medium" data-testid={`text-engagement-${item.id}`}>{item.engagementScore}/100</div>
                </div>

                <div className="mt-4 pt-4 border-t border-border/50 flex items-end justify-between">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-semibold">Monthly Price</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-bold text-primary" data-testid={`text-price-${item.id}`}>R {item.finalPrice.toLocaleString()}</p>
                      {item.demandModifier !== 1 && (
                        <p className="text-xs text-muted-foreground line-through">R {item.basePrice.toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="p-4 pt-0">
                <Button className="w-full gap-2" variant="secondary" onClick={() => setLocation("/campaign")} data-testid={`button-add-to-plan-${item.id}`}>
                  Add to Plan
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {!isLoading && filteredInventory.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground" data-testid="text-no-results">No inventory matches your search.</p>
        </div>
      )}
    </div>
  );
}