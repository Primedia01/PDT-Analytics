import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, Environment, ContactShadows } from "@react-three/drei";
import { malls, assets, Asset } from "@/lib/mock-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Activity, Users, Clock, MonitorPlay, BarChart2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

// Simple 3D Mall Representation (Floor plane + some blocks)
function MallModel() {
  return (
    <group>
      {/* Floor */}
      <mesh receiveShadow position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>
      
      {/* Central Atrium Pillar */}
      <mesh castShadow receiveShadow position={[0, 2, 0]}>
        <cylinderGeometry args={[2, 2, 5, 32]} />
        <meshStandardMaterial color="#333" />
      </mesh>

      {/* Some abstract store blocks */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 15;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <mesh key={i} castShadow receiveShadow position={[x, 1.5, z]}>
            <boxGeometry args={[4, 4, 4]} />
            <meshStandardMaterial color="#222" roughness={0.5} />
          </mesh>
        );
      })}
    </group>
  );
}

function AssetMarker({ asset, onClick, isSelected }: { asset: Asset, onClick: () => void, isSelected: boolean }) {
  return (
    <group position={asset.position}>
      <mesh onClick={(e) => { e.stopPropagation(); onClick(); }}>
        <sphereGeometry args={[isSelected ? 0.6 : 0.4, 32, 32]} />
        <meshStandardMaterial 
          color={isSelected ? "hsl(var(--primary))" : "hsl(var(--accent))"} 
          emissive={isSelected ? "hsl(var(--primary))" : "hsl(var(--accent))"}
          emissiveIntensity={isSelected ? 1 : 0.5}
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

export default function Explorer() {
  const [selectedMallId, setSelectedMallId] = useState<string>(malls[0].id);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const currentMallAssets = assets.filter(a => a.mall_id === selectedMallId);
  const currentMall = malls.find(m => m.id === selectedMallId);

  // Mock hourly data for the selected asset
  const hourlyData = Array.from({length: 12}).map((_, i) => ({
    time: `${i + 8}:00`,
    impressions: Math.floor(Math.random() * 500) + (i === 4 || i === 10 ? 800 : 100) // Peaks at 12pm and 6pm
  }));

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
                <Select value={selectedMallId} onValueChange={(val) => {
                  setSelectedMallId(val);
                  setSelectedAsset(null);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Mall" />
                  </SelectTrigger>
                  <SelectContent>
                    {malls.map(mall => (
                      <SelectItem key={mall.id} value={mall.id}>{mall.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
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
