import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { malls, assets, portfolioData } from "@/lib/mock-data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { AIInsights } from "@/components/AIInsights";
import { useAuth } from "@/lib/auth";
import { Building2 } from "lucide-react";

export default function Analytics() {
  const { user } = useAuth();

  // Protect route - theoretically this should be at the router level, but we handle it here for mockup simplicity
  if (user.role === "advertiser" || user.role === "sales" || user.role === "mall_partner") {
    return (
      <div className="flex h-[80vh] items-center justify-center p-8 animate-in fade-in">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-bold">Access Restricted</h2>
          <p className="text-muted-foreground mt-2">Your role ({user.role}) does not have access to internal portfolio analytics.</p>
        </div>
      </div>
    );
  }

  // Admin and Internal roles only past this point
  
  const accessibleAssets = assets.filter(a => a.tenant_id === user.tenant_id);

  const assetsByType = accessibleAssets.reduce((acc, curr) => {
    acc[curr.asset_type] = (acc[curr.asset_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(assetsByType).map(([name, value]) => ({ name, value }));
  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  const mallPerformance = [...malls]
    .sort((a, b) => b.footfall - a.footfall)
    .slice(0, 10)
    .map(m => ({
      name: m.name.replace('Premium Outlet ', ''),
      footfall: m.footfall,
      impressions: accessibleAssets.filter(a => a.mall_id === m.id).reduce((sum, a) => sum + a.weekly_impressions, 0)
    }));

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Portfolio Analytics</h1>
        <p className="text-muted-foreground mt-2">Deep dive into performance metrics across all locations.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Asset Distribution by Type</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Top 10 Locations Performance (Weekly)</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mallPerformance} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val / 1000}k`} />
                <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} width={80} />
                <Tooltip 
                  cursor={{fill: 'hsl(var(--muted))', opacity: 0.4}}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                />
                <Legend />
                <Bar dataKey="impressions" name="Impressions" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                <Bar dataKey="footfall" name="Footfall" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        <AIInsights />
      </div>
    </div>
  );
}
