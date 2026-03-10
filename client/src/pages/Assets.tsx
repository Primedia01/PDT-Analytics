import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useAssets, useMalls, useCreateAsset, useBulkCreateAssets } from "@/lib/api";
import { Search, SlidersHorizontal, Loader2, Plus, Upload, Download, CheckCircle2, AlertTriangle, X } from "lucide-react";
import { useAuth } from "@/lib/auth";

const ASSET_TYPES = ["Screen", "Digital Billboard", "Lightbox", "Escalator Panel", "Elevator Wrap"];
const ZONES = ["Main Entrance", "North Atrium", "South Wing", "Food Court", "Center Plaza", "Luxury Corridor"];
const MEDIA_FORMATS = ["Digital Video", "Static Print", "Interactive"];

function generateAssetId() {
  return `AST-${Math.floor(10000 + Math.random() * 90000)}`;
}

function AddAssetDialog({
  open,
  onOpenChange,
  malls,
  user,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  malls: any[];
  user: any;
}) {
  const createAsset = useCreateAsset();
  const [form, setForm] = useState({
    mallId: "",
    assetName: "",
    assetType: "",
    floor: "0",
    zone: "",
    screenSize: "",
    mediaFormat: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");
    const asset = {
      id: generateAssetId(),
      mallId: form.mallId,
      tenantId: user.tenantId,
      assetName: form.assetName,
      assetType: form.assetType,
      floor: parseInt(form.floor),
      zone: form.zone,
      posX: parseFloat((Math.random() * 20 - 10).toFixed(2)),
      posY: parseFloat((Math.random() * 2).toFixed(2)),
      posZ: parseFloat((Math.random() * 20 - 10).toFixed(2)),
      screenSize: form.screenSize || null,
      mediaFormat: form.mediaFormat || null,
      dailyImpressions: Math.floor(Math.random() * 5000) + 500,
      weeklyImpressions: Math.floor(Math.random() * 35000) + 3000,
      dwellTimeSeconds: Math.floor(Math.random() * 120) + 10,
      engagementScore: Math.floor(Math.random() * 100),
    };
    createAsset.mutate(asset, {
      onSuccess: () => {
        onOpenChange(false);
        setForm({ mallId: "", assetName: "", assetType: "", floor: "0", zone: "", screenSize: "", mediaFormat: "" });
        setError("");
      },
      onError: (err: any) => {
        setError(err?.message || "Failed to create asset. Please try again.");
      },
    });
  };

  const isValid = form.mallId && form.assetName && form.assetType && form.zone;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Add New Asset</DialogTitle>
          <DialogDescription>Create a new digital advertising asset placement.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Asset Name *</Label>
              <Input
                placeholder="e.g. Screen 101"
                value={form.assetName}
                onChange={(e) => setForm({ ...form, assetName: e.target.value })}
                data-testid="input-asset-name"
              />
            </div>
            <div className="space-y-2">
              <Label>Asset Type *</Label>
              <Select value={form.assetType} onValueChange={(v) => setForm({ ...form, assetType: v })}>
                <SelectTrigger data-testid="select-asset-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {ASSET_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Mall *</Label>
              <Select value={form.mallId} onValueChange={(v) => setForm({ ...form, mallId: v })}>
                <SelectTrigger data-testid="select-mall">
                  <SelectValue placeholder="Select mall" />
                </SelectTrigger>
                <SelectContent>
                  {malls.map((m: any) => (
                    <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Zone *</Label>
              <Select value={form.zone} onValueChange={(v) => setForm({ ...form, zone: v })}>
                <SelectTrigger data-testid="select-zone">
                  <SelectValue placeholder="Select zone" />
                </SelectTrigger>
                <SelectContent>
                  {ZONES.map((z) => (
                    <SelectItem key={z} value={z}>{z}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Floor</Label>
              <Input
                type="number"
                min="0"
                max="5"
                value={form.floor}
                onChange={(e) => setForm({ ...form, floor: e.target.value })}
                data-testid="input-floor"
              />
            </div>
            <div className="space-y-2">
              <Label>Screen Size</Label>
              <Input
                placeholder="e.g. 55 inch"
                value={form.screenSize}
                onChange={(e) => setForm({ ...form, screenSize: e.target.value })}
                data-testid="input-screen-size"
              />
            </div>
            <div className="space-y-2">
              <Label>Media Format</Label>
              <Select value={form.mediaFormat} onValueChange={(v) => setForm({ ...form, mediaFormat: v })}>
                <SelectTrigger data-testid="select-media-format">
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  {MEDIA_FORMATS.map((f) => (
                    <SelectItem key={f} value={f}>{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
            {error}
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="button-cancel-add">Cancel</Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || createAsset.isPending}
            data-testid="button-submit-asset"
          >
            {createAsset.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
            Add Asset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CSVImportDialog({
  open,
  onOpenChange,
  user,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
}) {
  const bulkCreate = useBulkCreateAssets();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<any[] | null>(null);
  const [fileName, setFileName] = useState("");
  const [parseError, setParseError] = useState("");
  const [result, setResult] = useState<{ created: number; errors: { row: number; message: string }[] } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setParseError("");
    setResult(null);

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result as string;
        const lines = text.trim().split("\n");
        if (lines.length < 2) {
          setParseError("CSV must have a header row and at least one data row.");
          return;
        }
        const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
        const requiredHeaders = ["assetname", "assettype", "mallid", "zone", "floor"];
        const missing = requiredHeaders.filter((rh) => !headers.includes(rh));
        if (missing.length > 0) {
          setParseError(`Missing required columns: ${missing.join(", ")}`);
          return;
        }

        const rows = lines.slice(1).filter(l => l.trim()).map((line) => {
          const values = line.split(",").map((v) => v.trim());
          const row: any = {};
          headers.forEach((h, i) => {
            row[h] = values[i] ?? "";
          });
          return {
            id: row.id || generateAssetId(),
            mallId: row.mallid,
            tenantId: user.tenantId,
            assetName: row.assetname,
            assetType: row.assettype,
            floor: parseInt(row.floor) || 0,
            zone: row.zone,
            posX: parseFloat(row.posx) || parseFloat((Math.random() * 20 - 10).toFixed(2)),
            posY: parseFloat(row.posy) || parseFloat((Math.random() * 2).toFixed(2)),
            posZ: parseFloat(row.posz) || parseFloat((Math.random() * 20 - 10).toFixed(2)),
            screenSize: row.screensize || null,
            mediaFormat: row.mediaformat || null,
            dailyImpressions: parseInt(row.dailyimpressions) || Math.floor(Math.random() * 5000) + 500,
            weeklyImpressions: parseInt(row.weeklyimpressions) || Math.floor(Math.random() * 35000) + 3000,
            dwellTimeSeconds: parseInt(row.dwelltimeseconds) || Math.floor(Math.random() * 120) + 10,
            engagementScore: parseInt(row.engagementscore) || Math.floor(Math.random() * 100),
          };
        });

        setPreview(rows);
      } catch {
        setParseError("Failed to parse CSV file.");
      }
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (!preview || preview.length === 0) return;
    bulkCreate.mutate(preview, {
      onSuccess: (data) => {
        setResult(data);
        setPreview(null);
      },
      onError: (err: any) => {
        setResult({ created: 0, errors: [{ row: 0, message: err?.message || "Import failed. Please check your data and try again." }] });
        setPreview(null);
      },
    });
  };

  const handleClose = () => {
    onOpenChange(false);
    setPreview(null);
    setFileName("");
    setParseError("");
    setResult(null);
  };

  const downloadTemplate = () => {
    const headers = "id,assetName,assetType,mallId,zone,floor,screenSize,mediaFormat,posX,posY,posZ,dailyImpressions,weeklyImpressions,dwellTimeSeconds,engagementScore";
    const example = "AST-99001,Screen 101,Screen,MALL-0095,Food Court,1,55 inch,Digital Video,5.2,1.0,-3.4,2500,17500,45,72";
    const csv = `${headers}\n${example}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "asset_import_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>Import Assets from CSV</DialogTitle>
          <DialogDescription>Upload a CSV file to bulk import assets. Download the template to see the expected format.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={downloadTemplate} data-testid="button-download-template">
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
          </div>

          <div
            className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => fileRef.current?.click()}
            data-testid="dropzone-csv"
          >
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
              data-testid="input-csv-file"
            />
            <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
            {fileName ? (
              <p className="text-sm font-medium">{fileName}</p>
            ) : (
              <p className="text-sm text-muted-foreground">Click to select a CSV file</p>
            )}
          </div>

          {parseError && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              {parseError}
            </div>
          )}

          {preview && preview.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">{preview.length} asset{preview.length !== 1 ? "s" : ""} ready to import</p>
              <div className="max-h-[200px] overflow-auto rounded-lg border border-border">
                <Table>
                  <TableHeader>
                    <TableRow className="text-xs">
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Mall</TableHead>
                      <TableHead>Zone</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {preview.slice(0, 10).map((row, i) => (
                      <TableRow key={i} className="text-xs">
                        <TableCell className="font-mono">{row.id}</TableCell>
                        <TableCell>{row.assetName}</TableCell>
                        <TableCell>{row.assetType}</TableCell>
                        <TableCell>{row.mallId}</TableCell>
                        <TableCell>{row.zone}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {preview.length > 10 && (
                <p className="text-xs text-muted-foreground">Showing 10 of {preview.length} rows</p>
              )}
            </div>
          )}

          {result && (
            <div className="space-y-2">
              {result.created > 0 && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 text-emerald-500 text-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  Successfully imported {result.created} asset{result.created !== 1 ? "s" : ""}.
                </div>
              )}
              {result.errors.length > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                    <AlertTriangle className="h-4 w-4 shrink-0" />
                    {result.errors.length} row{result.errors.length !== 1 ? "s" : ""} had errors:
                  </div>
                  <div className="max-h-[100px] overflow-auto text-xs text-muted-foreground space-y-1 pl-2">
                    {result.errors.map((e, i) => (
                      <p key={i}>Row {e.row}: {e.message}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} data-testid="button-cancel-import">
            {result ? "Close" : "Cancel"}
          </Button>
          {!result && (
            <Button
              onClick={handleImport}
              disabled={!preview || preview.length === 0 || bulkCreate.isPending}
              data-testid="button-submit-import"
            >
              {bulkCreate.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
              Import {preview?.length ?? 0} Assets
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AssetsPage() {
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
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

  const canManageAssets = ["admin", "internal", "sales"].includes(user.role);

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
          {canManageAssets && (
            <>
              <Button variant="outline" size="sm" onClick={() => setImportOpen(true)} data-testid="button-import-csv">
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </Button>
              <Button size="sm" onClick={() => setAddOpen(true)} data-testid="button-add-asset">
                <Plus className="h-4 w-4 mr-2" />
                Add Asset
              </Button>
            </>
          )}
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

      {canManageAssets && (
        <>
          <AddAssetDialog open={addOpen} onOpenChange={setAddOpen} malls={malls} user={user} />
          <CSVImportDialog open={importOpen} onOpenChange={setImportOpen} user={user} />
        </>
      )}
    </div>
  );
}
