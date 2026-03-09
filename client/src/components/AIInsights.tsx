import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, AlertTriangle, TrendingUp, Lightbulb } from "lucide-react";

export function AIInsights() {
  const insights = [
    {
      type: "opportunity",
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      title: "Escalator Performance",
      description: "Escalator panels generate 23% more impressions than corridor lightboxes.",
      recommendation: "Increase escalator inventory in high-footfall malls like Sandton City and Mall of Africa."
    },
    {
      type: "behavior",
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
      title: "Dwell Time Anomaly",
      description: "Mall of Africa delivers 18% higher shopper dwell time compared to the portfolio average.",
      recommendation: "Premium video formats >15s are optimal for this location."
    },
    {
      type: "warning",
      icon: AlertTriangle,
      color: "text-destructive",
      bg: "bg-destructive/10",
      title: "Low Engagement",
      description: "Rosebank Mall lightboxes (Level 2) have low engagement due to recent corridor layout changes.",
      recommendation: "Consider relocating 4 lightbox units to the main food court corridor."
    }
  ];

  return (
    <Card className="border-border/50 h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-accent" />
          AI Insights Engine
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, i) => {
          const Icon = insight.icon;
          return (
            <div key={i} className="p-4 rounded-lg border border-border/50 bg-secondary/20 hover:bg-secondary/40 transition-colors">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${insight.bg} ${insight.color} mt-0.5`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                  
                  <div className="bg-background/80 rounded p-2.5 border border-border/50 flex items-start gap-2">
                    <Lightbulb className="h-3.5 w-3.5 text-accent mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-0.5">Recommendation</span>
                      <span className="text-sm">{insight.recommendation}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

// Ensure Users icon is imported inside the component if needed, but we used Users above. Let's fix the missing import.
import { Users } from "lucide-react";