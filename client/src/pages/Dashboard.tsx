import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { portfolioStats, portfolioData, malls, assets } from "@/lib/mock-data";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Building2, Eye, Users, MonitorPlay, ArrowUpRight } from "lucide-react";

export default function Dashboard() {
  const topMalls = [...malls].sort((a, b) => b.footfall - a.footfall).slice(0, 5);
  const topAssets = [...assets].sort((a, b) => b.weekly_impressions - a.weekly_impressions).slice(0, 5);

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Portfolio Dashboard</h1>
        <p className="text-muted-foreground mt-2">Overview of 27 malls and 300 advertising assets.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card hover-elevate border-border/50 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Malls</CardTitle>
            <Building2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{portfolioStats.totalMalls}</div>
            <p className="text-xs text-muted-foreground mt-1">Across 27 cities</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card hover-elevate border-border/50 transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Assets</CardTitle>
            <MonitorPlay className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{portfolioStats.totalAssets}</div>
            <p className="text-xs text-muted-foreground mt-1">Active screens & billboards</p>
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

      {/* Tables Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Top Performing Malls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topMalls.map((mall, i) => (
                <div key={mall.id} className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{mall.name}</p>
                    <p className="text-xs text-muted-foreground">{mall.city}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{(mall.footfall / 1000).toFixed(1)}k</p>
                    <p className="text-xs text-muted-foreground">Footfall</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Top Assets by Impressions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topAssets.map((asset, i) => (
                <div key={asset.id} className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded text-muted-foreground">{asset.id}</span>
                      <p className="font-medium text-sm">{asset.asset_name}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{malls.find(m => m.id === asset.mall_id)?.name} - {asset.zone}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{(asset.weekly_impressions / 1000).toFixed(1)}k</p>
                    <p className="text-xs text-muted-foreground">Weekly</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
