import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import type { KontrolnaTocka } from '../types';
import { getPodrucjeByTockaId } from '../data/podrucja';
import { PopupCard } from './PopupCard';

const { BaseLayer } = LayersControl;

// Fix for default marker icons in Leaflet with Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-expect-error - Fixing Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MapViewProps {
  kontrolneTocke: KontrolnaTocka[];
  selectedTocka: KontrolnaTocka | null;
  onTockaSelect: (tocka: KontrolnaTocka | null) => void;
}

// A cache to store created icons to avoid re-creating them on every render.
const iconCache: Record<string, L.DivIcon> = {};

// A function to create a custom colored marker icon that mimics the default Leaflet pin.
function createColoredPinIcon(color: string, posjecen: boolean = false): L.DivIcon {
  const cacheKey = `${color}-${posjecen}`;
  if (iconCache[cacheKey]) {
    return iconCache[cacheKey];
  }

  const opacity = posjecen ? 0.35 : 1.0;
  const strokeWidth = posjecen ? '1.5' : '2.5';
  const glowFilter = posjecen ? '' : `<filter id="glow-${color.replace('#', '')}">
      <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>`;
  const filterAttr = posjecen ? '' : ` filter="url(#glow-${color.replace('#', '')})"`;

  const markerHtml = `
    <svg viewBox="0 0 28 41" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">
      <defs>${glowFilter}</defs>
      <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 27 14 27s14-16.5 14-27C28 6.268 21.732 0 14 0z"
            fill="${color}"
            stroke="#fff"
            stroke-width="${strokeWidth}"
            opacity="${opacity}"${filterAttr}/>
      <circle cx="14" cy="14" r="6" fill="white" opacity="${opacity}"/>
    </svg>`;

  const icon = L.divIcon({
    className: 'custom-pin-icon',
    html: markerHtml,
    iconSize: [28, 41],
    iconAnchor: [14, 41],
    popupAnchor: [0, -41],
  });

  iconCache[cacheKey] = icon;
  return icon;
}

// Component to fly to selected marker and open popup
function MapController({ tocka, markerRefs }: { tocka: KontrolnaTocka | null; markerRefs: React.MutableRefObject<Record<string, L.Marker | null>> }) {
  const map = useMap();

  useEffect(() => {
    if (tocka) {
      // Fly to marker
      if (
        !map.getBounds().contains([tocka.lat, tocka.lng]) ||
        map.getZoom() < 13
      ) {
        map.flyTo([tocka.lat, tocka.lng], 14, {
          duration: 1.5,
        });
      }

      // Open popup after a short delay to allow fly animation
      setTimeout(() => {
        const marker = markerRefs.current[tocka.id];
        if (marker) {
          marker.openPopup();
        }
      }, 300);
    }
  }, [tocka, map, markerRefs]);

  return null;
}

export function MapView({ kontrolneTocke, selectedTocka, onTockaSelect }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRefs = useRef<Record<string, L.Marker | null>>({});

  // Croatia center coordinates
  const defaultCenter: [number, number] = [45.1, 16.0];
  const defaultZoom = 7;

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      className="h-full w-full"
      ref={mapRef}
    >
      <LayersControl position="topright">
        {/* Cestovne/Osnovne mape */}
        <BaseLayer checked name="OpenStreetMap Standard">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
        </BaseLayer>

        <BaseLayer name="OpenStreetMap HOT">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            maxZoom={19}
          />
        </BaseLayer>

        {/* Topografske mape */}
        <BaseLayer name="OpenTopoMap (Topografska)">
          <TileLayer
            attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            maxZoom={17}
          />
        </BaseLayer>

        <BaseLayer name="Stamen Terrain (Reljef)">
          <TileLayer
            attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}.png"
            maxZoom={18}
          />
        </BaseLayer>

        {/* Satelitske mape */}
        <BaseLayer name="Esri Satelit">
          <TileLayer
            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxZoom={19}
          />
        </BaseLayer>

        <BaseLayer name="Google Satelit">
          <TileLayer
            attribution='&copy; Google'
            url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
            maxZoom={20}
          />
        </BaseLayer>

        {/* Minimalistički stilovi */}
        <BaseLayer name="CartoDB Positron (Svijetla)">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
            maxZoom={19}
          />
        </BaseLayer>

        <BaseLayer name="CartoDB Dark Matter (Tamna)">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
            maxZoom={19}
          />
        </BaseLayer>

        {/* Outdoor/Hiking mape */}
        <BaseLayer name="CyclOSM (Biciklistička)">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors. Tiles style by <a href="https://www.cyclosm.org">CyclOSM</a>'
            url="https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png"
            maxZoom={20}
          />
        </BaseLayer>

        <BaseLayer name="Esri World Street Map">
          <TileLayer
            attribution='Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
            maxZoom={19}
          />
        </BaseLayer>
      </LayersControl>

      <MapController tocka={selectedTocka} markerRefs={markerRefs} />

      {kontrolneTocke.map((tocka) => {
        const podrucje = getPodrucjeByTockaId(tocka.id);
        const icon = createColoredPinIcon(podrucje?.boja || '#3388ff', tocka.posjecen || false);
        return (
          <Marker
            key={tocka.id}
            position={[tocka.lat, tocka.lng]}
            ref={(ref) => { markerRefs.current[tocka.id] = ref; }}
            eventHandlers={{
              click: () => onTockaSelect(tocka),
            }}
            icon={icon}
            >
              <Popup
                closeButton={true}
                eventHandlers={{
                  remove: () => {
                    // Clear selection when popup is closed via X button
                    if (selectedTocka?.id === tocka.id) {
                      onTockaSelect(null);
                    }
                  }
                }}
              >
                <PopupCard tocka={tocka} podrucje={podrucje} />
              </Popup>
            </Marker>
          );
        })}
    </MapContainer>
  );
}
