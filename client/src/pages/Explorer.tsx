import { useState, useEffect, useMemo, useRef, Suspense } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Environment, ContactShadows, PerspectiveCamera } from "@react-three/drei";
import { useMalls, useAssets } from "@/lib/api";
import type { Asset } from "@shared/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X, Activity, Users, Clock, MonitorPlay, BarChart2, Lightbulb,
  Building2, Loader2, Navigation, Eye, Map, Layers, Wifi, WifiOff,
  TrendingUp, ZoomIn, ZoomOut, RotateCcw, ChevronRight
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import * as THREE from "three";

// ─── CONSTANTS ──────────────────────────────────────────────────────────────

const AD_ASSET_POSITIONS = [
  { id: "AD-001", name: "Digital Billboard - Main Entrance",  type: "Digital Billboard", x: 0,    y: 3.5, z: 4.2,   zone: "Main Entrance",   floor: 1 },
  { id: "AD-002", name: "Digital Billboard - North Atrium",   type: "Digital Billboard", x: 4,    y: 3.5, z: -1,    zone: "North Atrium",    floor: 1 },
  { id: "AD-003", name: "Digital Billboard - South Wing",     type: "Digital Billboard", x: -4,   y: 3.5, z: 1,     zone: "South Wing",      floor: 1 },
  { id: "AD-004", name: "Screen - Food Court East",           type: "Screen",            x: 10,   y: 2.5, z: 2,     zone: "Food Court",      floor: 1 },
  { id: "AD-005", name: "Screen - Food Court West",           type: "Screen",            x: -10,  y: 2.5, z: 2,     zone: "Food Court",      floor: 1 },
  { id: "AD-006", name: "Screen - Center Plaza",              type: "Screen",            x: 2,    y: 2.5, z: -4,    zone: "Center Plaza",    floor: 1 },
  { id: "AD-007", name: "Lightbox - Luxury Corridor N",       type: "Lightbox",          x: 5,    y: 2.0, z: -8,    zone: "Luxury Corridor", floor: 1 },
  { id: "AD-008", name: "Lightbox - Luxury Corridor S",       type: "Lightbox",          x: -5,   y: 2.0, z: 8,     zone: "Luxury Corridor", floor: 1 },
  { id: "AD-009", name: "Lightbox - Main Entrance Left",      type: "Lightbox",          x: -3,   y: 2.0, z: 4.2,   zone: "Main Entrance",   floor: 1 },
  { id: "AD-010", name: "Escalator Panel - Center A",         type: "Escalator Panel",   x: -2,   y: 2.5, z: 0,     zone: "Center Plaza",    floor: 2 },
  { id: "AD-011", name: "Escalator Panel - Center B",         type: "Escalator Panel",   x: 2,    y: 2.5, z: 0,     zone: "Center Plaza",    floor: 2 },
  { id: "AD-012", name: "Elevator Wrap - North Wing",         type: "Elevator Wrap",     x: 10,   y: 2.0, z: -2,    zone: "North Atrium",    floor: 1 },
  { id: "AD-013", name: "Elevator Wrap - South Wing",         type: "Elevator Wrap",     x: -10,  y: 2.0, z: -2,    zone: "South Wing",      floor: 1 },
  { id: "AD-014", name: "Digital Billboard - Roof Dome",      type: "Digital Billboard", x: 0,    y: 5.0, z: 0,     zone: "Center Plaza",    floor: 2 },
  { id: "AD-015", name: "Screen - North Entry",               type: "Screen",            x: 0,    y: 2.5, z: -12,   zone: "North Atrium",    floor: 1 },
];

// ─── ASSET TYPE CONFIG ───────────────────────────────────────────────────────
const ASSET_TYPE_CONFIG: Record<string, { color: string; emissive: string; label: string }> = {
  "Screen":           { color: "#3b82f6", emissive: "#1d4ed8", label: "SCR" },
  "Digital Billboard":{ color: "#8b5cf6", emissive: "#6d28d9", label: "DIG" },
  "Lightbox":         { color: "#f59e0b", emissive: "#b45309", label: "LBX" },
  "Escalator Panel":  { color: "#ec4899", emissive: "#be185d", label: "ESC" },
  "Elevator Wrap":    { color: "#10b981", emissive: "#047857", label: "ELV" },
};

// ─── PROCEDURAL MALL MODEL ──────────────────────────────────────────────────
function MallModel({ onLoaded }: { onLoaded: () => void }) {
  useEffect(() => { onLoaded(); }, [onLoaded]);

  const wingColor = "#1a1f2e";
  const roofColor = "#0f1320";
  const glassColor = "#1e3a5f";

  return (
    <group>
      <mesh castShadow receiveShadow position={[0, 1.5, 0]}>
        <boxGeometry args={[12, 3, 8]} />
        <meshStandardMaterial color={wingColor} metalness={0.4} roughness={0.6} />
      </mesh>
      <mesh castShadow receiveShadow position={[-10, 1, 0]}>
        <boxGeometry args={[8, 2, 6]} />
        <meshStandardMaterial color={wingColor} metalness={0.4} roughness={0.6} />
      </mesh>
      <mesh castShadow receiveShadow position={[10, 1, 0]}>
        <boxGeometry args={[8, 2, 6]} />
        <meshStandardMaterial color={wingColor} metalness={0.4} roughness={0.6} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 1, -8]}>
        <boxGeometry args={[10, 2, 8]} />
        <meshStandardMaterial color={wingColor} metalness={0.4} roughness={0.6} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 1, 8]}>
        <boxGeometry args={[10, 2, 8]} />
        <meshStandardMaterial color={wingColor} metalness={0.4} roughness={0.6} />
      </mesh>

      <mesh position={[0, 3.15, 0]}>
        <boxGeometry args={[13, 0.3, 9]} />
        <meshStandardMaterial color={roofColor} metalness={0.6} roughness={0.3} />
      </mesh>

      {[-4, -1, 2, 5].map((x, i) => (
        <mesh key={`glass-front-${i}`} position={[x, 1.5, 4.01]}>
          <planeGeometry args={[2, 2.5]} />
          <meshStandardMaterial color={glassColor} emissive="#1a3a6e" emissiveIntensity={0.4} metalness={0.9} roughness={0.1} transparent opacity={0.7} />
        </mesh>
      ))}
      {[-4, -1, 2, 5].map((x, i) => (
        <mesh key={`glass-back-${i}`} position={[x, 1.5, -4.01]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[2, 2.5]} />
          <meshStandardMaterial color={glassColor} emissive="#1a3a6e" emissiveIntensity={0.4} metalness={0.9} roughness={0.1} transparent opacity={0.7} />
        </mesh>
      ))}

      <mesh position={[0, 4, 0]}>
        <cylinderGeometry args={[3, 4, 2, 6]} />
        <meshStandardMaterial color={glassColor} emissive="#0d2847" emissiveIntensity={0.3} metalness={0.8} roughness={0.2} transparent opacity={0.5} />
      </mesh>

      {[[-7, 0, 5], [7, 0, 5], [-7, 0, -5], [7, 0, -5]].map(([x, y, z], i) => (
        <mesh key={`pillar-${i}`} position={[x, 1.5, z]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 3, 8]} />
          <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}

      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#0c1018" roughness={0.9} />
      </mesh>
    </group>
  );
}

// ─── AD ASSET MARKER ────────────────────────────────────────────────────────
function AdAssetMarker({
  assetDef,
  dbAsset,
  onClick,
  isSelected,
  showHeatmap,
}: {
  assetDef: typeof AD_ASSET_POSITIONS[0];
  dbAsset: Asset | null;
  onClick: () => void;
  isSelected: boolean;
  showHeatmap: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const config = ASSET_TYPE_CONFIG[assetDef.type] || ASSET_TYPE_CONFIG["Screen"];

  const worldX = assetDef.x;
  const worldY = assetDef.y;
  const worldZ = assetDef.z;

  useFrame((state) => {
    if (meshRef.current) {
      const pulse = isSelected
        ? 0.9 + Math.sin(state.clock.elapsedTime * 3) * 0.1
        : 0.85 + Math.sin(state.clock.elapsedTime * 1.5 + assetDef.x) * 0.05;
      meshRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group position={[worldX, worldY, worldZ]}>
      {/* Vertical pole */}
      <mesh>
        <cylinderGeometry args={[0.015, 0.015, 0.6, 8]} />
        <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Main marker */}
      <mesh
        ref={meshRef}
        position={[0, 0.5, 0]}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
      >
        <boxGeometry args={[0.25, 0.25, 0.08]} />
        <meshStandardMaterial
          color={isSelected ? "#ffffff" : config.color}
          emissive={isSelected ? config.color : config.emissive}
          emissiveIntensity={isSelected ? 1.2 : 0.5}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Heatmap radius indicator */}
      {showHeatmap && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[1.5, 32]} />
          <meshBasicMaterial
            color={config.color}
            opacity={0.15}
            transparent
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Selection ring */}
      {isSelected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.35, 0.45, 32]} />
          <meshBasicMaterial color={config.color} opacity={0.8} transparent depthWrite={false} />
        </mesh>
      )}

      {/* Floating label */}
      <Html position={[0, 1.2, 0]} center zIndexRange={[100, 0]} distanceFactor={8}>
        <div
          className="cursor-pointer select-none"
          onClick={onClick}
          style={{
            background: isSelected
              ? config.color
              : `${config.color}22`,
            border: `1px solid ${config.color}`,
            borderRadius: "4px",
            padding: "2px 6px",
            fontSize: "10px",
            fontWeight: "700",
            color: isSelected ? "#fff" : config.color,
            whiteSpace: "nowrap",
            backdropFilter: "blur(8px)",
            boxShadow: isSelected ? `0 0 12px ${config.color}66` : "none",
            transition: "all 0.2s",
            fontFamily: "monospace",
          }}
        >
          {config.label} · {assetDef.name.split(" - ")[0]}
        </div>
      </Html>
    </group>
  );
}

// ─── CAMERA CONTROLLER ───────────────────────────────────────────────────────
function CameraController({ mode }: { mode: "orbit" | "top" }) {
  const { camera } = useThree();

  useEffect(() => {
    if (mode === "top") {
      camera.position.set(0, 25, 0);
      camera.lookAt(0, 0, 0);
    } else {
      camera.position.set(0, 12, 18);
      camera.lookAt(0, 0, 0);
    }
  }, [mode, camera]);

  return null;
}

// ─── LOADING SCREEN ──────────────────────────────────────────────────────────
function LoadingOverlay() {
  return (
    <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-50 backdrop-blur-sm">
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
        <Building2 className="absolute inset-0 m-auto h-7 w-7 text-primary" />
      </div>
      <p className="text-white font-semibold text-lg mb-1">Loading Mall Digital Twin</p>
      <p className="text-white/40 text-sm">Streaming 3D environment...</p>
    </div>
  );
}

// ─── ASSET INFO PANEL ────────────────────────────────────────────────────────
function AssetInfoPanel({
  assetDef,
  dbAsset,
  onClose,
  showHeatmap,
  setShowHeatmap,
}: {
  assetDef: typeof AD_ASSET_POSITIONS[0] | null;
  dbAsset: Asset | null;
  onClose: () => void;
  showHeatmap: boolean;
  setShowHeatmap: (v: boolean) => void;
}) {
  if (!assetDef) return null;

  const config = ASSET_TYPE_CONFIG[assetDef.type] || ASSET_TYPE_CONFIG["Screen"];
  const impressions = dbAsset?.dailyImpressions ?? Math.floor(Math.random() * 12000) + 5000;
  const dwell = dbAsset?.dwellTimeSeconds ?? Math.floor(Math.random() * 20) + 8;
  const engagement = dbAsset?.engagementScore ?? Math.floor(Math.random() * 30) + 65;
  const isOnline = Math.random() > 0.15;

  const hourlyData = Array.from({ length: 12 }).map((_, i) => ({
    time: `${i + 8}:00`,
    impressions: Math.floor(Math.random() * 500) + (i === 4 || i === 10 ? 800 : 100),
  }));

  return (
    <div className="w-[420px] h-full bg-background border-l border-border/50 shadow-2xl flex flex-col animate-in slide-in-from-right-8 duration-300">
      {/* Header */}
      <div
        className="p-5 border-b flex items-start justify-between"
        style={{ borderColor: `${config.color}33` }}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: isOnline ? "#10b981" : "#ef4444" }}
            />
            <span className="text-xs font-mono text-muted-foreground">
              {isOnline ? "ONLINE" : "OFFLINE"}
            </span>
          </div>
          <h2 className="font-bold text-lg leading-tight truncate">{assetDef.name}</h2>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge
              variant="secondary"
              style={{
                backgroundColor: `${config.color}22`,
                color: config.color,
                border: `1px solid ${config.color}44`,
                fontSize: "10px",
                fontFamily: "monospace",
              }}
            >
              {assetDef.type}
            </Badge>
            <span className="text-xs text-muted-foreground">{assetDef.zone} · Floor {assetDef.floor}</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0 ml-2">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        {/* Key Metrics */}
        <div className="p-5 grid grid-cols-3 gap-3 border-b border-border/30">
          <div className="space-y-1 p-3 rounded-lg bg-muted/30">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Users className="h-3 w-3" /> Daily
            </p>
            <p className="text-xl font-bold text-primary tabular-nums">
              {impressions.toLocaleString()}
            </p>
            <p className="text-[10px] text-muted-foreground">impressions</p>
          </div>
          <div className="space-y-1 p-3 rounded-lg bg-muted/30">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Clock className="h-3 w-3" /> Dwell
            </p>
            <p className="text-xl font-bold tabular-nums">{dwell}s</p>
            <p className="text-[10px] text-muted-foreground">avg. time</p>
          </div>
          <div className="space-y-1 p-3 rounded-lg bg-muted/30">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Activity className="h-3 w-3" /> Score
            </p>
            <p className="text-xl font-bold tabular-nums" style={{ color: config.color }}>
              {engagement}
            </p>
            <p className="text-[10px] text-muted-foreground">engagement</p>
          </div>
        </div>

        {/* Hourly Traffic Chart */}
        <div className="p-5 border-b border-border/30">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <BarChart2 className="h-4 w-4" style={{ color: config.color }} />
            Hourly Traffic Today
          </h3>
          <div className="h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={config.color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={config.color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px", fontSize: "11px", color: "hsl(var(--card-foreground))" }}
                  itemStyle={{ color: "hsl(var(--card-foreground))" }}
                  labelStyle={{ color: "hsl(var(--card-foreground))" }}
                />
                <Area type="monotone" dataKey="impressions" stroke={config.color} strokeWidth={2} fillOpacity={1} fill="url(#areaGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Audience Demographics */}
        <div className="p-5 border-b border-border/30">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Users className="h-4 w-4" style={{ color: config.color }} />
            Audience Split
          </h3>
          <div className="space-y-2.5">
            {[
              { label: "18–24", pct: 15 },
              { label: "25–34", pct: 42 },
              { label: "35–44", pct: 28 },
              { label: "45+",   pct: 15 },
            ].map(({ label, pct }) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">{pct}%</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, backgroundColor: config.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Asset Details */}
        <div className="p-5 border-b border-border/30">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <MonitorPlay className="h-4 w-4" style={{ color: config.color }} />
            Asset Details
          </h3>
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <span className="text-muted-foreground text-xs">Asset ID</span>
            <span className="font-mono text-xs">{assetDef.id}</span>
            <span className="text-muted-foreground text-xs">Format</span>
            <span className="text-xs">{dbAsset?.mediaFormat ?? "Digital Display"}</span>
            <span className="text-muted-foreground text-xs">Screen Size</span>
            <span className="text-xs">{dbAsset?.screenSize ?? "2.4m × 1.35m"}</span>
            <span className="text-muted-foreground text-xs">Weekly Reach</span>
            <span className="text-xs font-medium">{(impressions * 7).toLocaleString()}</span>
          </div>
        </div>

        {/* Heatmap CTA */}
        <div className="p-5">
          <div
            className="rounded-lg p-4 border"
            style={{ backgroundColor: `${config.color}11`, borderColor: `${config.color}33` }}
          >
            <p className="text-xs font-semibold mb-2" style={{ color: config.color }}>
              Spatial Exposure Zone
            </p>
            <p className="text-xs text-muted-foreground mb-3">
              Visualize the footfall coverage radius for this placement in the 3D view.
            </p>
            <Button
              size="sm"
              variant={showHeatmap ? "default" : "outline"}
              className="w-full text-xs h-8"
              onClick={() => setShowHeatmap(!showHeatmap)}
              style={showHeatmap ? { backgroundColor: config.color, borderColor: config.color } : {}}
            >
              {showHeatmap ? "Hide Coverage Overlay" : "Show Coverage Overlay"}
            </Button>
          </div>
        </div>
      </div>

      {/* Book CTA */}
      <div className="p-4 border-t border-border/30">
        <Button className="w-full h-9 text-sm font-semibold" style={{ backgroundColor: config.color }}>
          Book This Placement
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

// ─── MAIN EXPLORER PAGE ──────────────────────────────────────────────────────
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
  const [selectedAssetDef, setSelectedAssetDef] = useState<typeof AD_ASSET_POSITIONS[0] | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [cameraMode, setCameraMode] = useState<"orbit" | "top">("orbit");
  const [showOpportunity, setShowOpportunity] = useState(false);

  useEffect(() => {
    if (allowedMalls.length > 0 && !selectedMallId) {
      setSelectedMallId(allowedMalls[0].id);
    }
  }, [allowedMalls, selectedMallId]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mallId = params.get("mallId");
    const opp = params.get("opportunity");
    if (mallId && allowedMalls.some((m: any) => m.id === mallId)) setSelectedMallId(mallId);
    if (opp === "true") setShowOpportunity(true);
  }, [allowedMalls]);

  const currentMall = allMalls.find((m: any) => m.id === selectedMallId);
  const currentMallAssets = useMemo(
    () => allAssets.filter((a: any) => a.mallId === selectedMallId),
    [allAssets, selectedMallId]
  );

  // Find matching DB asset for selected ad position
  const selectedDbAsset = useMemo(() => {
    if (!selectedAssetDef) return null;
    return currentMallAssets[Math.floor(Math.random() * Math.max(currentMallAssets.length, 1))] ?? null;
  }, [selectedAssetDef, currentMallAssets]);

  if (mallsLoading || assetsLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (allowedMalls.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-bold">No Malls Available</h2>
          <p className="text-muted-foreground mt-2">Your account does not have access to any mall environments.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full relative overflow-hidden">
      {/* ── 3D CANVAS ── */}
      <div className="flex-1 h-full w-full bg-black relative">
        <Canvas shadows camera={{ position: [0, 12, 18], fov: 50 }} gl={{ antialias: true, alpha: false }}>
          <color attach="background" args={["#080c14"]} />
          <fog attach="fog" args={["#080c14", 40, 120]} />

          {/* Lighting */}
          <ambientLight intensity={0.6} />
          <directionalLight position={[20, 30, 10]} intensity={1.2} castShadow shadow-mapSize={[2048, 2048]} />
          <directionalLight position={[-20, 20, -10]} intensity={0.4} color="#4488ff" />
          <pointLight position={[0, 8, 0]} intensity={0.5} color="#ffffff" />

          <Environment preset="city" />
          <CameraController mode={cameraMode} />

          {/* Mall Model */}
          <Suspense fallback={null}>
            <MallModel onLoaded={() => setModelLoaded(true)} />
          </Suspense>

          {/* Ground plane */}
          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
            <planeGeometry args={[200, 200]} />
            <meshStandardMaterial color="#0a0e18" roughness={1} />
          </mesh>

          {/* Ad Asset Markers */}
          {modelLoaded && AD_ASSET_POSITIONS.map((assetDef) => (
            <AdAssetMarker
              key={assetDef.id}
              assetDef={assetDef}
              dbAsset={currentMallAssets[0] ?? null}
              onClick={() => setSelectedAssetDef(
                selectedAssetDef?.id === assetDef.id ? null : assetDef
              )}
              isSelected={selectedAssetDef?.id === assetDef.id}
              showHeatmap={showHeatmap}
            />
          ))}

          <ContactShadows resolution={1024} scale={60} blur={3} opacity={0.4} far={10} color="#000000" />
          <OrbitControls
            makeDefault
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2.1}
            maxDistance={60}
            minDistance={5}
            enableDamping
            dampingFactor={0.05}
            target={[0, 0, 0]}
          />
        </Canvas>

        {/* Loading overlay */}
        {!modelLoaded && <LoadingOverlay />}

        {/* ── TOP LEFT: Mall Selector ── */}
        <div className="absolute top-5 left-5 z-10 pointer-events-auto">
          <Card className="w-72 bg-background/85 backdrop-blur-xl border-border/40 shadow-2xl">
            <CardHeader className="pb-3 pt-4 px-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-primary/20 flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-sm">Mall Explorer</CardTitle>
                  <CardDescription className="text-xs">Digital Twin Environment</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-3">
              {allowedMalls.length > 1 ? (
                <Select value={selectedMallId} onValueChange={(v) => { setSelectedMallId(v); setSelectedAssetDef(null); }}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select Mall" />
                  </SelectTrigger>
                  <SelectContent>
                    {allowedMalls.map((mall: any) => (
                      <SelectItem key={mall.id} value={mall.id} className="text-xs">{mall.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="px-3 py-2 bg-muted rounded-md text-xs font-medium">{allowedMalls[0].name}</div>
              )}

              {currentMall && (
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="text-center p-2 bg-muted/40 rounded-md">
                    <p className="text-[10px] text-muted-foreground">City</p>
                    <p className="text-xs font-semibold truncate">{currentMall.city}</p>
                  </div>
                  <div className="text-center p-2 bg-muted/40 rounded-md">
                    <p className="text-[10px] text-muted-foreground">Assets</p>
                    <p className="text-xs font-semibold text-primary">{AD_ASSET_POSITIONS.length}</p>
                  </div>
                  <div className="text-center p-2 bg-muted/40 rounded-md">
                    <p className="text-[10px] text-muted-foreground">Floors</p>
                    <p className="text-xs font-semibold">{currentMall.floors}</p>
                  </div>
                </div>
              )}

              {/* Legend */}
              <div className="pt-1 space-y-1">
                {Object.entries(ASSET_TYPE_CONFIG).map(([type, cfg]) => (
                  <div key={type} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: cfg.color }} />
                    <span className="text-[10px] text-muted-foreground">{type}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── TOP RIGHT: Controls ── */}
        <div className="absolute top-5 right-5 z-10 flex flex-col gap-2 pointer-events-auto">
          <Button
            variant={showHeatmap ? "default" : "secondary"}
            size="sm"
            className="shadow-xl text-xs h-8"
            onClick={() => setShowHeatmap(!showHeatmap)}
          >
            <Activity className="h-3.5 w-3.5 mr-1.5" />
            {showHeatmap ? "Hide Coverage" : "Coverage Overlay"}
          </Button>
          <Button
            variant={cameraMode === "top" ? "default" : "secondary"}
            size="sm"
            className="shadow-xl text-xs h-8"
            onClick={() => setCameraMode(cameraMode === "orbit" ? "top" : "orbit")}
          >
            <Map className="h-3.5 w-3.5 mr-1.5" />
            {cameraMode === "top" ? "3D View" : "Top-Down"}
          </Button>
        </div>

        {/* ── BOTTOM: Asset Count Bar ── */}
        {modelLoaded && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
            <div className="bg-background/80 backdrop-blur-xl border border-border/40 rounded-full px-5 py-2 flex items-center gap-4 shadow-xl">
              <span className="text-xs text-muted-foreground">
                {AD_ASSET_POSITIONS.length} ad placements · Click any marker to explore
              </span>
              {selectedAssetDef && (
                <>
                  <div className="w-px h-3 bg-border" />
                  <span className="text-xs font-medium text-primary">{selectedAssetDef.name}</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── ASSET INFO PANEL ── */}
      {selectedAssetDef && (
        <AssetInfoPanel
          assetDef={selectedAssetDef}
          dbAsset={selectedDbAsset}
          onClose={() => setSelectedAssetDef(null)}
          showHeatmap={showHeatmap}
          setShowHeatmap={setShowHeatmap}
        />
      )}
    </div>
  );
}

