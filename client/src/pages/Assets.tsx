import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAssets, useMalls } from "@/lib/api";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";

export default function AssetsPage() {
  const [search, setSearch] = useState("");
  const { user } = useAuth();
  const { data: assets = [], isLoading: assetsLoading } = useAssets();
  const { data: malls = [], isLoading: mallsLoading } = useMalls();

  const isLoading = assetsLoading || mallsLoading;

  const accessibleAssets = assets.filter((asset: any) => {
    if (user.role === "admin" || user.role === "internal" || user.role === "sales") {
      return asset.tenantId === user.tenantId;
    }
    if (user.role === "mall_partner" && user.allowedMalls) {
      return user.allowedMalls.includes(asset.mallId);
    }
    return false;
  });

  const filteredAssets = accessibleAssets.filter((asset: any) =>
    asset.assetName.toLowerCase().includes(search.toLowerCase()) ||
    asset.assetType.toLowerCase().includes(search.toLowerCase()) ||
    malls.find((m: any) => m.id === asset.mallId)?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" data-testid="text-page-title">Asset Inventory</h1>
          <p className="text-muted-foreground mt-1">Manage and monitor digital advertising assets.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search assets, types, or malls..." 
              className="pl-9 bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-search"
            />
          </div>
          <button
            className="flex items-center justify-center h-10 w-10 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
            data-testid="button-filters"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Card className="border-border/50">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16" data-testid="status-loading">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-3 text-muted-foreground">Loading assets…</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Asset Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Wk Impressions</TableHead>
                  <TableHead className="text-right">Dwell Time</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.slice(0, 50).map((asset: any) => {
                  const mall = malls.find((m: any) => m.id === asset.mallId);
                  return (
                    <TableRow key={asset.id} className="border-border/50 hover:bg-muted/50 cursor-pointer transition-colors" data-testid={`row-asset-${asset.id}`}>
                      <TableCell className="font-mono text-xs text-muted-foreground">{asset.id}</TableCell>
                      <TableCell className="font-medium">{asset.assetName}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{mall?.name}</span>
                          <span className="text-xs text-muted-foreground">{asset.zone} (Fl. {asset.floor})</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                          {asset.assetType}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-primary font-medium">
                        {asset.weeklyImpressions.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {asset.dwellTimeSeconds}s
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium text-emerald-500 bg-emerald-500/10">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                          Active
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredAssets.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground" data-testid="text-no-assets">
                      No assets found for your organization.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
          {!isLoading && filteredAssets.length > 50 && (
            <div className="p-4 text-center border-t border-border/50 text-sm text-muted-foreground" data-testid="text-showing-count">
              Showing 50 of {filteredAssets.length} assets
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
