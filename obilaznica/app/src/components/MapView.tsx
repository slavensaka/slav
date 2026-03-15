import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, useMap, useMapEvents, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import type { KontrolnaTocka } from '../types';
import { podrucja } from '../data/podrucja';

const { BaseLayer } = LayersControl;

// Fix Leaflet default icon (required for Vite)
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-expect-error - Fixing Leaflet default icon issue with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// ─── Color lookup by podrucjeId ────────────────────────────────────────────
const colorByPodrucjeId = new Map(podrucja.map((p) => [p.id, p.boja]));

// ─── Icon factory — cached per color+state ─────────────────────────────────
const iconCache = new Map<string, L.DivIcon>();

// SVG pin path: teardrop shape with white inner circle
const PIN_PATH = 'M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20s12-11 12-20C24 5.373 18.627 0 12 0z';

function getMarkerIcon(color: string, state: 'selected' | 'completed' | 'remaining'): L.DivIcon {
  const key = `${color}-${state}`;
  if (iconCache.has(key)) return iconCache.get(key)!;

  let html: string;
  let size: [number, number];
  let anchor: [number, number];
  let tooltipAnchor: [number, number];

  if (state === 'selected') {
    html = `<div style="filter:drop-shadow(0 0 7px ${color}bb) drop-shadow(0 2px 4px rgba(0,0,0,0.4))">
      <svg width="32" height="42" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg">
        <path d="${PIN_PATH}" fill="${color}"/>
        <circle cx="12" cy="11" r="5.5" fill="white" opacity="0.95"/>
      </svg>
    </div>`;
    size = [32, 42];
    anchor = [16, 42];
    tooltipAnchor = [0, -44];
  } else if (state === 'completed') {
    html = `<svg width="18" height="24" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg" style="opacity:0.45;filter:drop-shadow(0 1px 3px rgba(0,0,0,0.3))">
      <path d="${PIN_PATH}" fill="${color}"/>
      <circle cx="12" cy="11" r="5" fill="white" opacity="0.9"/>
    </svg>`;
    size = [18, 24];
    anchor = [9, 24];
    tooltipAnchor = [0, -26];
  } else {
    html = `<svg width="24" height="32" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 2px 4px rgba(0,0,0,0.35))">
      <path d="${PIN_PATH}" fill="${color}"/>
      <circle cx="12" cy="11" r="5" fill="white" opacity="0.9"/>
    </svg>`;
    size = [24, 32];
    anchor = [12, 32];
    tooltipAnchor = [0, -34];
  }

  const icon = L.divIcon({ className: '', html, iconSize: size, iconAnchor: anchor, tooltipAnchor });
  iconCache.set(key, icon);
  return icon;
}

function MapRefCapture({ onMapReady }: { onMapReady: (map: L.Map) => void }) {
  const map = useMap();
  useEffect(() => { onMapReady(map); }, [map, onMapReady]);
  return null;
}

function MapClickHandler({ onMapClick }: { onMapClick: () => void }) {
  useMapEvents({ click: onMapClick });
  return null;
}

interface MapViewProps {
  kontrolneTocke: KontrolnaTocka[];
  selectedTocka: KontrolnaTocka | null;
  onTockaSelect: (tocka: KontrolnaTocka | null) => void;
  onMapReady: (map: L.Map) => void;
  onMapClick: () => void;
}

export function MapView({ kontrolneTocke, selectedTocka, onTockaSelect, onMapReady, onMapClick }: MapViewProps) {
  return (
    <MapContainer center={[45.1, 16.0]} zoom={7} zoomControl={false} attributionControl={false} className="h-full w-full">
      <MapRefCapture onMapReady={onMapReady} />
      <MapClickHandler onMapClick={onMapClick} />

      <LayersControl position="topright">
        <BaseLayer checked name="Karta">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
        </BaseLayer>
        <BaseLayer name="Topografska">
          <TileLayer
            attribution='Map data: &copy; OpenStreetMap | Style: &copy; OpenTopoMap'
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            maxZoom={17}
          />
        </BaseLayer>
        <BaseLayer name="Satelit">
          <TileLayer
            attribution='Tiles &copy; Esri'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxZoom={19}
          />
        </BaseLayer>
        <BaseLayer name="CartoDB (Svijetla)">
          <TileLayer
            attribution='&copy; OpenStreetMap &copy; CARTO'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
            maxZoom={19}
          />
        </BaseLayer>
      </LayersControl>

      {kontrolneTocke.map((tocka) => {
        const isSelected = selectedTocka?.id === tocka.id;
        const color = colorByPodrucjeId.get(tocka.podrucjeId ?? 0) ?? '#94A3B8';
        const state = isSelected ? 'selected' : tocka.posjecen ? 'completed' : 'remaining';
        const icon = getMarkerIcon(color, state);

        return (
          <Marker
            key={`${tocka.id}-${state}`}
            position={[tocka.lat, tocka.lng]}
            icon={icon}
            zIndexOffset={isSelected ? 1000 : 0}
            eventHandlers={{ click: () => onTockaSelect(isSelected ? null : tocka) }}
          >
            <Tooltip direction="top" offset={[0, -6]} opacity={1}>
              {tocka.naziv}
            </Tooltip>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
