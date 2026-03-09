import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, Environment, ContactShadows } from "@react-three/drei";
import { malls, assets, Asset } from "@/lib/mock-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Activity, Users, Clock, MonitorPlay, BarChart2, Lightbulb } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";

// Simple 3D Mall Representation (Floor plane + some blocks)
function MallModel() {
  return (
    <group>
      {/* Floorplan Layout representing mall corridors */}
      <mesh receiveShadow position={[0, -0.49, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#0f0f0f" roughness={0.9} />
      </mesh>
      
      {/* High Traffic Heatmap Overlay (Red/Yellow) */}
      <mesh receiveShadow position={[5, -0.48, 5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[15, 20]} />
        <meshBasicMaterial color="#ef4444" opacity={0.15} transparent depthWrite={false} />
      </mesh>
      
      {/* Medium Traffic Heatmap Overlay */}
      <mesh receiveShadow position={[-10, -0.48, -5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[25, 10]} />
        <meshBasicMaterial color="#eab308" opacity={0.15} transparent depthWrite={false} />
      </mesh>

      {/* Low Traffic Heatmap Overlay */}
      <mesh receiveShadow position={[15, -0.48, -15]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[15, 15]} />
        <meshBasicMaterial color="#3b82f6" opacity={0.1} transparent depthWrite={false} />
      </mesh>
      
      {/* Central Atrium */}
      <mesh castShadow receiveShadow position={[0, 0.5, 0]}>
        <cylinderGeometry args={[4, 4, 1, 32]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      {/* Store Layout Blocks */}
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
  if (asset.asset_type === "Screen") color = "#3b82f6"; // blue
  if (asset.asset_type === "Escalator Panel") color = "#f59e0b"; // yellow
  if (asset.asset_type === "Digital Billboard") color = "#8b5cf6"; // purple
  if (asset.asset_type === "Elevator Wrap") color = "#ec4899"; // pink
  if (isSelected) color = "hsl(var(--primary))";

  return (
    <group position={asset.position}>
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
            <div className="font-bold">{asset.asset_name}</div>
            <div className="text-xs text-muted-foreground">{asset.asset_type}</div>
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
  
  // Filter available malls based on role
  const allowedMalls = user.role === "mall_partner" && user.allowedMalls 
    ? malls.filter(m => user.allowedMalls?.includes(m.id)) 
    : malls;

  const [selectedMallId, setSelectedMallId] = useState<string>(allowedMalls[0]?.id || malls[0].id);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showOpportunity, setShowOpportunity] = useState(false);

  useEffect(() => {
    // Check for query parameters manually
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const mallId = params.get('mallId');
    const opp = params.get('opportunity');

    if (mallId) {
      // Ensure the mall ID is allowed before selecting it
      if (allowedMalls.some(m => m.id === mallId)) {
        setSelectedMallId(mallId);
      }
    }
    if (opp === 'true') {
      setShowOpportunity(true);
    }
  }, [allowedMalls]);

  const currentMallAssets = assets.filter(a => a.mall_id === selectedMallId);
  const currentMall = malls.find(m => m.id === selectedMallId);

  // Mock hourly data for the selected asset
  const hourlyData = Array.from({length: 12}).map((_, i) => ({
    time: `${i + 8}:00`,
    impressions: Math.floor(Math.random() * 500) + (i === 4 || i === 10 ? 800 : 100) // Peaks at 12pm and 6pm
  }));

  // Prevent users from accessing if they have no allowed malls
  if (allowedMalls.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-bold">No Malls Available</h2>
          <p className="text-muted-foreground mt-2">Your organization does not have access to any malls.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full relative overflow-hidden animate-in fade-in duration-500">
      {/* 3D Canvas */}
      <div className="flex-1 h-full w-full bg-black relative">
        <Canvas shadows camera={{ position: [0, 20, 30], fov: 45 }}>
          <color attach="background" args={['#0a0a0a']} />
          <fog attach="fog" args={['#0a0a0a', 30, 80]} />
          
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 20, 10]} angle={0.3} penumbra={1} intensity={1} castShadow />
          <Environment preset="city" />

          <MallModel />

          {/* Only show AI Opportunity for internal/admin roles */}
          {showOpportunity && selectedMallId === 'MALL-1001' && (user.role === 'admin' || user.role === 'internal') && (
            <OpportunityMarker />
          )}

          {currentMallAssets.map(asset => (
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

        {/* UI Overlay: Top Bar */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-start pointer-events-none">
          <div className="pointer-events-auto">
            <Card className="w-80 bg-background/80 backdrop-blur-md border-border/50">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Mall Explorer</CardTitle>
                <CardDescription>Select a property to view its digital twin.</CardDescription>
              </CardHeader>
              <CardContent>
                {allowedMalls.length > 1 ? (
                  <Select value={selectedMallId} onValueChange={(val) => {
                    setSelectedMallId(val);
                    setSelectedAsset(null);
                    setShowOpportunity(false); // hide opportunity if switching malls
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Mall" />
                    </SelectTrigger>
                    <SelectContent>
                      {allowedMalls.map(mall => (
                        <SelectItem key={mall.id} value={mall.id}>{mall.name}</SelectItem>
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
                      <p className="font-medium">{currentMall.city}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Active Assets</p>
                      <p className="font-medium text-primary">{currentMallAssets.length}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Side Panel for Asset Analytics */}
      {selectedAsset && (
        <div className="w-[400px] h-full bg-background border-l border-border/50 shadow-2xl flex flex-col animate-in slide-in-from-right-8 duration-300">
          <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-background z-10">
            <div>
              <h2 className="font-bold text-lg">{selectedAsset.asset_name}</h2>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <span className="px-2 py-0.5 bg-secondary rounded">{selectedAsset.asset_type}</span>
                <span>{selectedAsset.zone} (Fl. {selectedAsset.floor})</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setSelectedAsset(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-6 flex-1 overflow-auto space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3"/> Daily Impressions</p>
                <p className="text-2xl font-bold text-primary">{selectedAsset.daily_impressions.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3"/> Avg. Dwell</p>
                <p className="text-2xl font-bold">{selectedAsset.dwell_time_seconds}s</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1"><Activity className="h-3 w-3"/> Engagement</p>
                <p className="text-2xl font-bold text-accent">{selectedAsset.engagement_score}/100</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1"><MonitorPlay className="h-3 w-3"/> Format</p>
                <p className="text-sm font-medium mt-1">{selectedAsset.media_format || 'N/A'}</p>
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
              <h3 className="font-semibold mb-4">Audience Demographics</h3>
              <div className="space-y-3">
                {/* Mock progress bars for demo */}
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
