import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, AlertTriangle, TrendingUp, Lightbulb, Users, Target, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export function AIInsights() {
  const [, setLocation] = useLocation();

  const agents = [
    {
      agent: "Asset Performance Agent",
      type: "warning",
      icon: AlertTriangle,
      color: "text-destructive",
      bg: "bg-destructive/10",
      title: "Alert: Underperforming Asset",
      subtitle: "Escalator Panel 14 - Sandton City",
      description: "Occupancy: 32% | Impressions below network average",
      recommendation: "Relocate to high footfall corridor."
    },
    {
      agent: "Opportunity Detection Agent",
      type: "opportunity",
      icon: Lightbulb,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      title: "Opportunity Detected",
      subtitle: "Location: Mall of Africa Food Court",
      description: "Footfall: 32k daily shoppers | Current assets: 0",
      recommendation: "Deploy Digital Screen. Estimated revenue: R95k per month.",
      action: () => setLocation("/explorer?mallId=MALL-1001&opportunity=true")
    },
    {
      agent: "Portfolio Intelligence Agent",
      type: "insight",
      icon: Activity,
      color: "text-primary",
      bg: "bg-primary/10",
      title: "Portfolio Insight",
      subtitle: "Format Performance Analysis",
      description: "Escalator panels generate 23% higher engagement than corridor lightboxes.",
      recommendation: "Increase escalator inventory in high footfall malls."
    },
    {
      agent: "Advertiser Planning Agent",
      type: "campaign",
      icon: Target,
      color: "text-accent",
      bg: "bg-accent/10",
      title: "Advertiser Opportunity",
      subtitle: "Category: Sportswear",
      description: "Best matching demographic malls: Sandton City, Mall of Africa",
      recommendation: "Pitch available inventory to Nike or Adidas."
    }
  ];

  return (
    <Card className="border-border/50 h-full flex flex-col">
      <CardHeader className="border-b border-border/50 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-accent" />
            AI Engine Insights
          </CardTitle>
          <div className="flex gap-1">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-1">4 active agents analyzing portfolio</p>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-4 space-y-4">
        {agents.map((insight, i) => {
          const Icon = insight.icon;
          return (
            <div key={i} className="p-4 rounded-lg border border-border/50 bg-secondary/20 hover:bg-secondary/40 transition-colors animate-in fade-in slide-in-from-right-4" style={{animationDelay: `${i * 100}ms`}}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] uppercase tracking-wider font-mono text-muted-foreground">{insight.agent}</span>
              </div>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${insight.bg} ${insight.color} mt-0.5`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-0.5">{insight.title}</h4>
                  <p className="text-xs font-medium text-foreground mb-1">{insight.subtitle}</p>
                  <p className="text-xs text-muted-foreground mb-3">{insight.description}</p>
                  
                  <div className="bg-background/80 rounded p-2.5 border border-border/50 flex items-start gap-2">
                    <Lightbulb className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${insight.color}`} />
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-0.5">Recommendation</span>
                      <span className="text-xs leading-relaxed">{insight.recommendation}</span>
                    </div>
                  </div>
                  
                  {insight.action && (
                    <Button variant="outline" size="sm" className="w-full mt-3 h-8 text-xs" onClick={insight.action}>
                      View on Digital Twin
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}