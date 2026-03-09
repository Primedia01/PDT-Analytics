import { useState, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, Environment, ContactShadows } from "@react-three/drei";
import { useMalls, useAssets } from "@/lib/api";
import type { Asset } from "@shared/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Activity, Users, Clock, MonitorPlay, BarChart2, Lightbulb, Building2, Loader2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";

function MallModel({ showHeatmap }: { showHeatmap: boolean }) {
  return (
    <group>
      <mesh receiveShadow position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#0f0f0f" roughness={0.9} />
      </mesh>
      
      {showHeatmap && (
        <group>
          <mesh position={[5, 0.01, 5]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[25, 25]} />
            <meshBasicMaterial color="#ef4444" opacity={0.6} transparent depthWrite={false} />
          </mesh>
          
          <mesh position={[-10, 0.01, -5]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[35, 20]} />
            <meshBasicMaterial color="#eab308" opacity={0.5} transparent depthWrite={false} />
          </mesh>

          <mesh position={[15, 0.01, -15]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[25, 25]} />
            <meshBasicMaterial color="#3b82f6" opacity={0.3} transparent depthWrite={false} />
          </mesh>
        </group>
      )}
      
      <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
        <cylinderGeometry args={[4, 4, 1, 32]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      {[...Array(16)].map((_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const radius = 20;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <mesh key={i} castShadow receiveShadow position={[x, 2, z]}>
            <boxGeometry args={[6, 4, 6]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
          </mesh>
        );
      })}
    </group>
  );
}

function AssetMarker({ asset, onClick, isSelected }: { asset: Asset, onClick: () => void, isSelected: boolean }) {
  let color = "hsl(var(--accent))";
  if (asset.assetType === "Screen") color = "#3b82f6";
  if (asset.assetType === "Escalator Panel") color = "#f59e0b";
  if (asset.assetType === "Digital Billboard") color = "#8b5cf6";
  if (asset.assetType === "Elevator Wrap") color = "#ec4899";
  if (isSelected) color = "hsl(var(--primary))";

  const position: [number, number, number] = [asset.posX, asset.posY, asset.posZ];

  return (
    <group position={position}>
      <mesh onClick={(e) => { e.stopPropagation(); onClick(); }}>
        <boxGeometry args={[isSelected ? 0.8 : 0.6, isSelected ? 1.6 : 1.2, 0.2]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={isSelected ? 0.8 : 0.4}
        />
      </mesh>
      {isSelected && (
        <Html position={[0, 1.5, 0]} center zIndexRange={[100, 0]}>
          <div className="bg-card text-card-foreground border border-primary px-3 py-1.5 rounded-md shadow-xl text-sm whitespace-nowrap animate-in fade-in zoom-in-95 duration-200">
            <div className="font-bold">{asset.assetName}</div>
            <div className="text-xs text-muted-foreground">{asset.assetType}</div>
          </div>
        </Html>
      )}
    </group>
  );
}

function OpportunityMarker() {
  return (
    <group position={[6, 0.5, 6]}>
      <mesh>
        <cylinderGeometry args={[1.5, 1.5, 0.1, 32]} />
        <meshBasicMaterial color="#10b981" opacity={0.4} transparent />
      </mesh>
      <Html position={[0, 1.5, 0]} center zIndexRange={[100, 0]}>
        <div className="bg-emerald-500/20 backdrop-blur-md text-emerald-500 border border-emerald-500 px-3 py-1.5 rounded-md shadow-[0_0_15px_rgba(16,185,129,0.5)] text-sm whitespace-nowrap animate-pulse flex items-center gap-2">
          <Lightbulb className="h-4 w-4" />
          <div className="font-bold">Opportunity: Screen Placement</div>
        </div>
      </Html>
    </group>
  );
}

export default function Explorer() {
  const { user } = useAuth();
  const { data: allMalls = [], isLoading: mallsLoading } = useMalls();
  const { data: allAssets = [], isLoading: assetsLoading } = useAssets();

  const allowedMalls = useMemo(() => {
    if (user.role === "mall_partner" && user.allowedMalls) {
      return allMalls.filter((m: any) => user.allowedMalls?.includes(m.id));
    }
    return allMalls;
  }, [allMalls, user.role, user.allowedMalls]);

  const [selectedMallId, setSelectedMallId] = useState<string>("");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showOpportunity, setShowOpportunity] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);

  useEffect(() => {
    if (allowedMalls.length > 0 && !selectedMallId) {
      setSelectedMallId(allowedMalls[0].id);
    }
  }, [allowedMalls, selectedMallId]);

  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const mallId = params.get('mallId');
    const opp = params.get('opportunity');

    if (mallId) {
      if (allowedMalls.some((m: any) => m.id === mallId)) {
        setSelectedMallId(mallId);
      }
    }
    if (opp === 'true') {
      setShowOpportunity(true);
    }
  }, [allowedMalls]);

  const currentMallAssets = useMemo(() => 
    allAssets.filter((a: any) => a.mallId === selectedMallId),
    [allAssets, selectedMallId]
  );
  const currentMall = allMalls.find((m: any) => m.id === selectedMallId);

  const hourlyData = Array.from({length: 12}).map((_, i) => ({
    time: `${i + 8}:00`,
    impressions: Math.floor(Math.random() * 500) + (i === 4 || i === 10 ? 800 : 100)
  }));

  if (mallsLoading || assetsLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background" data-testid="explorer-loading">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (allowedMalls.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-bold" data-testid="text-no-malls">No Malls Available</h2>
          <p className="text-muted-foreground mt-2">Your organization does not have access to any malls.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full relative overflow-hidden animate-in fade-in duration-500">
      <div className="flex-1 h-full w-full bg-black relative">
        <Canvas shadows camera={{ position: [0, 20, 30], fov: 45 }}>
          <color attach="background" args={['#0a0a0a']} />
          <fog attach="fog" args={['#0a0a0a', 30, 80]} />
          
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 20, 10]} angle={0.3} penumbra={1} intensity={1} castShadow />
          <Environment preset="city" />

          <MallModel showHeatmap={showHeatmap} />

          {showOpportunity && selectedMallId === 'MALL-1001' && (user.role === 'admin' || user.role === 'internal') && (
            <OpportunityMarker />
          )}

          {currentMallAssets.map((asset: Asset) => (
            <AssetMarker 
              key={asset.id} 
              asset={asset} 
              onClick={() => setSelectedAsset(asset)}
              isSelected={selectedAsset?.id === asset.id}
            />
          ))}

          <ContactShadows resolution={1024} scale={50} blur={2} opacity={0.5} far={10} color="#000000" />
          <OrbitControls 
            makeDefault 
            minPolarAngle={0} 
            maxPolarAngle={Math.PI / 2.1}
            maxDistance={50}
            minDistance={10}
          />
        </Canvas>

        <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none z-10">
          <div className="pointer-events-auto">
            <Card className="w-80 bg-background/80 backdrop-blur-md border-border/50 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Mall Explorer</CardTitle>
                <CardDescription>Select a property to view its digital twin.</CardDescription>
              </CardHeader>
              <CardContent>
                {allowedMalls.length > 1 ? (
                  <Select value={selectedMallId} onValueChange={(val) => {
                    setSelectedMallId(val);
                    setSelectedAsset(null);
                    setShowOpportunity(false);
                  }}>
                    <SelectTrigger data-testid="select-mall-explorer">
                      <SelectValue placeholder="Select Mall" />
                    </SelectTrigger>
                    <SelectContent>
                      {allowedMalls.map((mall: any) => (
                        <SelectItem key={mall.id} value={mall.id} data-testid={`select-mall-${mall.id}`}>{mall.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="p-3 bg-muted rounded-md text-sm font-medium">
                    {allowedMalls[0].name}
                  </div>
                )}
                
                {currentMall && (
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">City</p>
                      <p className="font-medium" data-testid="text-mall-city">{currentMall.city}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Active Assets</p>
                      <p className="font-medium text-primary" data-testid="text-active-assets">{currentMallAssets.length}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="pointer-events-auto flex flex-col gap-3">
            <Button 
              variant={showHeatmap ? "default" : "secondary"} 
              size="lg"
              className="shadow-xl font-medium"
              onClick={() => setShowHeatmap(!showHeatmap)}
              data-testid="button-toggle-heatmap"
            >
              <Activity className="h-5 w-5 mr-2" />
              {showHeatmap ? "Hide Heatmap Overlay" : "Show Heatmap Overlay"}
            </Button>
          </div>
        </div>
      </div>

      {selectedAsset && (
        <div className="w-[400px] h-full bg-background border-l border-border/50 shadow-2xl flex flex-col animate-in slide-in-from-right-8 duration-300">
          <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-background z-10">
            <div>
              <h2 className="font-bold text-lg" data-testid="text-asset-name">{selectedAsset.assetName}</h2>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <span className="px-2 py-0.5 bg-secondary rounded" data-testid="text-asset-type">{selectedAsset.assetType}</span>
                <span>{selectedAsset.zone} (Fl. {selectedAsset.floor})</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSelectedAsset(null)} data-testid="button-close-asset">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-6 flex-1 overflow-auto space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3"/> Daily Impressions</p>
                <p className="text-2xl font-bold text-primary" data-testid="text-daily-impressions">{selectedAsset.dailyImpressions.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3"/> Avg. Dwell</p>
                <p className="text-2xl font-bold" data-testid="text-dwell-time">{selectedAsset.dwellTimeSeconds}s</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1"><Activity className="h-3 w-3"/> Engagement</p>
                <p className="text-2xl font-bold text-accent" data-testid="text-engagement">{selectedAsset.engagementScore}/100</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1"><MonitorPlay className="h-3 w-3"/> Format</p>
                <p className="text-sm font-medium mt-1" data-testid="text-format">{selectedAsset.mediaFormat || 'N/A'}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-border/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-primary" />
                  Hourly Traffic (Today)
                </h3>
              </div>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={hourlyData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorHourly" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Area type="monotone" dataKey="impressions" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorHourly)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="pt-4 border-t border-border/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" />
                  Spatial Engagement Heatmap
                </h3>
              </div>
              <div className="space-y-4">
                <p className="text-xs text-muted-foreground">Visualize shopper traffic patterns around this asset's zone.</p>
                <div className="h-40 rounded-md border border-border/50 bg-background relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                  <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/30 blur-2xl rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-accent/30 blur-xl rounded-full"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-chart-3/20 blur-2xl rounded-full"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {!showHeatmap && (
                      <Button variant="secondary" size="sm" onClick={() => setShowHeatmap(true)} className="shadow-md">
                        Show on Floorplan
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/50">
              <h3 className="font-semibold mb-4">Audience Demographics</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">18-24</span>
                    <span>15%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{width: '15%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">25-34</span>
                    <span>42%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{width: '42%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">35-44</span>
                    <span>28%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{width: '28%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">45+</span>
                    <span>15%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-muted-foreground" style={{width: '15%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
