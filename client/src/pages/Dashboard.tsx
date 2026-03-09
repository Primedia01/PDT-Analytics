import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { portfolioStats, portfolioData, malls, assets } from "@/lib/mock-data";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Building2, Eye, Users, MonitorPlay, ArrowUpRight, ArrowDownRight, AlertTriangle } from "lucide-react";
import { MallMap } from "@/components/MallMap";

export default function Dashboard() {
  const topMalls = [...malls].sort((a, b) => b.footfall - a.footfall).slice(0, 5);
  const topAssets = [...assets].sort((a, b) => b.weekly_impressions - a.weekly_impressions).slice(0, 5);

  // Calculate mock occupancy
  const totalInventory = assets.length;
  const soldInventory = Math.floor(totalInventory * 0.71); // 71%
  const occupancyRate = Math.round((soldInventory / totalInventory) * 100);

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Portfolio Dashboard</h1>
        <p className="text-muted-foreground mt-2">Overview of 27 malls and 300 advertising assets.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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
        
        <Card className="bg-card hover-elevate border-border/50 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Malls</CardTitle>
            <Building2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{portfolioStats.totalMalls}</div>
            <p className="text-xs text-muted-foreground mt-1">Across South Africa</p>
          </CardContent>
        </Card>

        <Card className="bg-card hover-elevate border-border/50 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Impressions</CardTitle>
            <Eye className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {(portfolioStats.totalImpressions / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" /> +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card hover-elevate border-border/50 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Footfall</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {(portfolioStats.totalFootfall / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3" /> +4.2% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Map View */}
        <div className="col-span-2">
          <MallMap />
        </div>

        {/* Underperforming Assets */}
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
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Portfolio Impressions (30 Days)</CardTitle>
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
            <CardTitle className="text-lg">Footfall Trend</CardTitle>
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
