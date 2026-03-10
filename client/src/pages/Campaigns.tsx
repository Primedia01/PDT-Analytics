import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCampaigns, useMalls } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Target, Calendar, CreditCard, MapPin, Users, Loader2, Plus, TrendingUp } from "lucide-react";
import { Link } from "wouter";

export default function CampaignsPage() {
  const { user } = useAuth();
  const { data: allCampaigns = [], isLoading } = useCampaigns();
  const { data: malls = [] } = useMalls();

  const userCampaigns = user.role === "admin" || user.role === "internal" || user.role === "sales"
    ? allCampaigns
    : allCampaigns.filter((c: any) => c.advertiserTenantId === user.tenantId);

  const activeCampaigns = userCampaigns.filter((c: any) => c.status === "active");
  const completedCampaigns = userCampaigns.filter((c: any) => c.status !== "active");

  const totalBudget = userCampaigns.reduce((sum: number, c: any) => sum + (c.budget || 0), 0);
  const activeBudget = activeCampaigns.reduce((sum: number, c: any) => sum + (c.budget || 0), 0);

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" data-testid="text-page-title">
            {user.role === "advertiser" ? "My Campaigns" : "All Campaigns"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {user.role === "advertiser"
              ? "Track and manage your active retail media campaigns."
              : "Overview of all campaigns across the portfolio."}
          </p>
        </div>
        <Link href="/campaign">
          <Button data-testid="button-new-campaign">
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold" data-testid="text-total-campaigns">{userCampaigns.length}</p>
                <p className="text-xs text-muted-foreground">Total Campaigns</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-500" data-testid="text-active-campaigns">{activeCampaigns.length}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold" data-testid="text-active-budget">R{(activeBudget / 1000).toFixed(0)}k</p>
                <p className="text-xs text-muted-foreground">Active Spend</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold" data-testid="text-total-budget">R{(totalBudget / 1000).toFixed(0)}k</p>
                <p className="text-xs text-muted-foreground">Total Budget</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {activeCampaigns.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Active Campaigns</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeCampaigns.map((campaign: any) => (
              <CampaignCard key={campaign.id} campaign={campaign} malls={malls} />
            ))}
          </div>
        </div>
      )}

      {completedCampaigns.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-muted-foreground">Completed</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {completedCampaigns.map((campaign: any) => (
              <CampaignCard key={campaign.id} campaign={campaign} malls={malls} />
            ))}
          </div>
        </div>
      )}

      {userCampaigns.length === 0 && (
        <Card className="border-border/50">
          <CardContent className="py-16 text-center">
            <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No Campaigns Yet</h3>
            <p className="text-muted-foreground mb-4">Launch your first campaign to start reaching shoppers across the mall network.</p>
            <Link href="/campaign">
              <Button data-testid="button-create-first-campaign">
                <Plus className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function CampaignCard({ campaign, malls }: { campaign: any; malls: any[] }) {
  const isActive = campaign.status === "active";
  const estimatedImpressions = Math.floor(campaign.budget * 1.8);
  const estimatedReach = Math.floor(campaign.budget * 0.4);

  return (
    <Card className="border-border/50 hover:border-primary/30 transition-colors" data-testid={`card-campaign-${campaign.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base">{campaign.name}</CardTitle>
          <Badge variant={isActive ? "default" : "secondary"} className={isActive ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : ""}>
            {campaign.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span className="text-xs">{campaign.startDate} — {campaign.endDate}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <CreditCard className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">R{campaign.budget.toLocaleString()}</span>
          </div>
        </div>

        {campaign.cityFocus && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {campaign.cityFocus}
          </div>
        )}
        {campaign.targetAudience && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            {campaign.targetAudience}
          </div>
        )}

        <div className="pt-2 border-t border-border/30 grid grid-cols-2 gap-2">
          <div className="text-center p-2 bg-muted/30 rounded">
            <p className="text-xs text-muted-foreground">Est. Impressions</p>
            <p className="text-sm font-semibold text-primary">{(estimatedImpressions / 1000).toFixed(0)}k</p>
          </div>
          <div className="text-center p-2 bg-muted/30 rounded">
            <p className="text-xs text-muted-foreground">Est. Reach</p>
            <p className="text-sm font-semibold">{(estimatedReach / 1000).toFixed(0)}k</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
