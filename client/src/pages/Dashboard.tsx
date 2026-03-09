import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { portfolioStats, portfolioData, malls, assets, campaigns } from "@/lib/mock-data";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Building2, Eye, Users, MonitorPlay, ArrowUpRight, ArrowDownRight, AlertTriangle, Target } from "lucide-react";
import { MallMap } from "@/components/MallMap";
import { useAuth } from "@/lib/auth";

export default function Dashboard() {
  const { user } = useAuth();
  const isAdvertiser = user.role === "advertiser";
  const isMallPartner = user.role === "mall_partner";

  // Filter malls for Mall Partner
  const allowedMalls = isMallPartner && user.allowedMalls ? malls.filter(m => user.allowedMalls?.includes(m.id)) : malls;
  const mallIds = allowedMalls.map(m => m.id);
  
  // Filter assets based on role
  let accessibleAssets = assets;
  if (isMallPartner) {
    accessibleAssets = assets.filter(a => mallIds.includes(a.mall_id));
  } else if (isAdvertiser) {
    // Advertisers don't see raw assets on dashboard by default, maybe campaign specific ones
    accessibleAssets = [];
  }

  // Calculate mock occupancy
  const totalInventory = accessibleAssets.length || 1;
  const soldInventory = Math.floor(totalInventory * 0.71); // 71%
  const occupancyRate = isAdvertiser ? 0 : Math.round((soldInventory / totalInventory) * 100);

  // Advertiser specific data
  const userCampaigns = campaigns.filter(c => c.advertiser_tenant_id === user.tenant_id);
  const activeCampaigns = userCampaigns.length;

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {isAdvertiser ? "Campaign Dashboard" : isMallPartner ? "Mall Dashboard" : "Portfolio Dashboard"}
        </h1>
        <p className="text-muted-foreground mt-2">
          {isAdvertiser 
            ? `Overview of your active campaigns for ${user.organization}.`
            : isMallPartner
              ? `Performance overview for ${user.organization}.`
              : `Overview of ${allowedMalls.length} malls and ${accessibleAssets.length} advertising assets.`
          }
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isAdvertiser ? (
          <>
            <Card className="bg-card hover-elevate border-border/50 transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Campaigns</CardTitle>
                <Target className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{activeCampaigns}</div>
                <p className="text-xs text-muted-foreground mt-1">Running currently</p>
              </CardContent>
            </Card>
            <Card className="bg-card hover-elevate border-border/50 transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Campaign Spend</CardTitle>
                <Building2 className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">R 500k</div>
                <p className="text-xs text-muted-foreground mt-1">This month</p>
              </CardContent>
            </Card>
            <Card className="bg-card hover-elevate border-border/50 transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Est. Reach</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1.2M</div>
                <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3" /> Target: 1M
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card hover-elevate border-border/50 transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Impressions Delivered</CardTitle>
                <Eye className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">3.4M</div>
                <p className="text-xs text-muted-foreground mt-1">Across 12 screens</p>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card className="bg-card hover-elevate border-border/50 transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Inventory Occupancy</CardTitle>
                <MonitorPlay className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{occupancyRate}%</div>
                <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3" /> +4% from last month
                </p>
              </CardContent>
            </Card>

            {!isMallPartner && (
              <Card className="bg-card hover-elevate border-border/50 transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
                  <Building2 className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">R 1.26M</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Potential (100%): R 1.85M
                  </p>
                </CardContent>
              </Card>
            )}

            <Card className="bg-card hover-elevate border-border/50 transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{isMallPartner ? "Total Assets" : "Total Malls"}</CardTitle>
                <Building2 className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{isMallPartner ? accessibleAssets.length : allowedMalls.length}</div>
                <p className="text-xs text-muted-foreground mt-1">{isMallPartner ? "In your property" : "Across South Africa"}</p>
              </CardContent>
            </Card>

            <Card className="bg-card hover-elevate border-border/50 transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Footfall</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {isMallPartner 
                    ? (allowedMalls[0]?.footfall / 1000).toFixed(0) + 'k'
                    : (portfolioStats.totalFootfall / 1000000).toFixed(1) + 'M'
                  }
                </div>
                <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3" /> +4.2% from last month
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Map View */}
        <div className="col-span-2">
          {!isAdvertiser && <MallMap />}
          {isAdvertiser && (
            <Card className="h-[400px] border-border/50 flex flex-col items-center justify-center text-center p-8">
              <Target className="h-12 w-12 text-primary/50 mb-4" />
              <h3 className="text-xl font-medium mb-2">Campaign Map Overview</h3>
              <p className="text-muted-foreground max-w-md">
                Map view shows locations where your active campaigns are currently running.
              </p>
            </Card>
          )}
        </div>

        {/* Underperforming Assets - Only for Admin/Internal */}
        {(user.role === "admin" || user.role === "internal") && (
          <Card className="border-border/50 border-destructive/20 bg-destructive/5 col-span-1">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Underperforming Assets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-background rounded-lg border border-border/50">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-sm">Escalator Panel 14</span>
                    <span className="text-xs text-destructive font-bold">32% Occ.</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Sandton City</p>
                  <div className="mt-2 text-xs bg-destructive/10 text-destructive px-2 py-1 rounded inline-block">
                    Occupancy &lt; 40%
                  </div>
                </div>

                <div className="p-3 bg-background rounded-lg border border-border/50">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-sm">Lightbox 22</span>
                    <span className="text-xs text-destructive font-bold">Low Dwell</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Canal Walk</p>
                  <div className="mt-2 text-xs bg-destructive/10 text-destructive px-2 py-1 rounded inline-block">
                    Impressions below avg
                  </div>
                </div>
                
                <div className="p-3 bg-background rounded-lg border border-border/50">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-sm">Digital Billboard 05</span>
                    <span className="text-xs text-destructive font-bold">Offline</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Menlyn Park</p>
                  <div className="mt-2 text-xs bg-destructive/10 text-destructive px-2 py-1 rounded inline-block">
                    Hardware fault detected
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Campaign Snapshot for Advertisers */}
        {isAdvertiser && (
           <Card className="border-border/50 col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Active Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userCampaigns.map(campaign => (
                  <div key={campaign.id} className="p-4 bg-muted/30 rounded-lg border border-border/50">
                    <h4 className="font-medium">{campaign.name}</h4>
                    <div className="mt-2 text-xs text-muted-foreground flex justify-between">
                      <span>Ends: {campaign.end_date}</span>
                      <span className="text-primary font-medium">Active</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mall Partner Snapshot */}
        {isMallPartner && (
           <Card className="border-border/50 col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Property Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Screens Online</span>
                    <span className="text-emerald-500 font-medium">98%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-1.5">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '98%' }}></div>
                  </div>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Campaign Delivery</span>
                    <span className="text-primary font-medium">On Target</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">
              {isAdvertiser ? "Campaign Impressions (30 Days)" : "Portfolio Impressions (30 Days)"}
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={portfolioData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val / 1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area type="monotone" dataKey="impressions" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorImpressions)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">
              {isAdvertiser ? "Reach by Demographic" : "Footfall Trend"}
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={portfolioData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val / 1000}k`} />
                <Tooltip 
                  cursor={{fill: 'hsl(var(--muted))', opacity: 0.4}}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                />
                <Bar dataKey="footfall" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
