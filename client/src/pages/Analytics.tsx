import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { malls, assets, portfolioData } from "@/lib/mock-data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

export default function Analytics() {
  const assetsByType = assets.reduce((acc, curr) => {
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
      impressions: assets.filter(a => a.mall_id === m.id).reduce((sum, a) => sum + a.weekly_impressions, 0)
    }));

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Portfolio Analytics</h1>
        <p className="text-muted-foreground mt-2">Deep dive into performance metrics across all 27 locations.</p>
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

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Engagement Heatmap Simulator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 rounded-md border border-border/50 bg-muted/20 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 blur-3xl rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-accent/20 blur-3xl rounded-full"></div>
            <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-chart-3/20 blur-3xl rounded-full"></div>
            
            <p className="text-muted-foreground z-10 font-medium">Select a mall in the Explorer to view actual spatial heatmaps</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
