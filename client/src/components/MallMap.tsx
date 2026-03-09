import { useEffect, useRef } from 'react';
import { useMalls, useAssets } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export function MallMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const { data: malls } = useMalls();
  const { data: allAssets } = useAssets();

  useEffect(() => {
    if (!mapRef.current || !malls || !allAssets) return;

    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }

    const map = L.map(mapRef.current).setView([-28.4793, 24.6727], 5);
    mapInstance.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    malls.forEach((mall: any) => {
      const mallAssets = allAssets.filter((a: any) => a.mallId === mall.id);
      const totalAssets = mallAssets.length;
      const occupancy = Math.floor(Math.random() * 40) + 50;

      const badgeColor = occupancy > 70 ? 'bg-primary text-primary-foreground' : 'bg-destructive text-destructive-foreground';

      const popupContent = `
        <div class="font-sans">
          <h3 class="font-bold text-sm m-0">${mall.name}</h3>
          <p class="text-xs text-muted-foreground mt-0 mb-2">${mall.city}</p>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span class="text-muted-foreground block">Assets</span>
              <span class="font-medium">${totalAssets}</span>
            </div>
            <div>
              <span class="text-muted-foreground block">Occupancy</span>
              <span class="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${badgeColor}">
                ${occupancy}%
              </span>
            </div>
          </div>
        </div>
      `;

      L.marker([mall.lat, mall.lng])
        .addTo(map)
        .bindPopup(popupContent, {
          className: 'custom-popup'
        });
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [malls, allAssets]);

  return (
    <Card className="border-border/50 col-span-full h-[500px] flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">South Africa Mall Distribution</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 relative">
        <div 
          ref={mapRef} 
          style={{ height: '100%', width: '100%', borderBottomLeftRadius: '0.5rem', borderBottomRightRadius: '0.5rem' }} 
        />
      </CardContent>
    </Card>
  );
}

