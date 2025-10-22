import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Badge } from "@/components/ui/badge";

interface Place {
  id: string;
  name: string;
  location: string;
  date?: string;
  imageUrl: string;
  isVisited: boolean;
  coordinates?: [number, number];
}

interface LeafletMapProps {
  places: Place[];
}

const createIcon = (color: string, isVisited: boolean) => {
  const svg = isVisited
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">
        <path fill="${color}" stroke="white" stroke-width="2" d="M16 0C7.163 0 0 7.163 0 16c0 13 16 26 16 26s16-13 16-26C32 7.163 24.837 0 16 0z"/>
        <circle cx="16" cy="16" r="6" fill="white"/>
      </svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">
        <path fill="${color}" stroke="white" stroke-width="2" d="M16 0C7.163 0 0 7.163 0 16c0 13 16 26 16 26s16-13 16-26C32 7.163 24.837 0 16 0z"/>
        <path fill="white" d="M16 10l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z"/>
      </svg>`;

  return L.icon({
    iconUrl: "data:image/svg+xml;base64," + btoa(svg),
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42],
  });
};

const visitedIcon = createIcon("hsl(210, 70%, 45%)", true);
const bucketListIcon = createIcon("hsl(15, 85%, 65%)", false);

export const LeafletMap = ({ places }: LeafletMapProps) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersLayer = useRef<L.LayerGroup | null>(null);

  // Initialize map once
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [20, 0],
      zoom: 2,
      worldCopyJump: true,
      zoomControl: true,
    });
    mapInstance.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    markersLayer.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapInstance.current = null;
      markersLayer.current = null;
    };
  }, []);

  // Update markers when places change
  useEffect(() => {
    if (!mapInstance.current || !markersLayer.current) return;

    const map = mapInstance.current;
    const layer = markersLayer.current;

    layer.clearLayers();

    const bounds: L.LatLngBoundsLiteral = [[90, 180], [-90, -180]]; // placeholder to extend
    let hasAny = false;

    places
      .map((p) => ({ ...p, coordinates: p.coordinates || getDefaultCoordinates(p.location) }))
      .forEach((place) => {
        if (!place.coordinates) return;
        hasAny = true;
        const icon = place.isVisited ? visitedIcon : bucketListIcon;
        const marker = L.marker(place.coordinates as L.LatLngExpression, { icon });
        const popupHtml = `
          <div style="min-width:200px">
            <div style="margin-bottom:6px">
              <span style="display:inline-block;padding:2px 8px;border-radius:999px;background:${
                place.isVisited ? "hsl(210, 70%, 45%)" : "hsl(15, 85%, 65%)"
              };color:white;font-size:12px;">${place.isVisited ? "Visited" : "Bucket List"}</span>
            </div>
            <div style="font-weight:700;font-size:16px;margin-bottom:6px">${place.name}</div>
            <div style="color:#666;font-size:12px;margin-bottom:6px">${place.location}$${
              place.date && place.isVisited ? ` • ${place.date}` : ""
            }</div>
            <img src="${place.imageUrl}" alt="${place.name}" style="width:100%;height:120px;object-fit:cover;border-radius:8px"/>
          </div>`;
        marker.bindPopup(popupHtml);
        marker.addTo(layer);

        // expand bounds
        (bounds as any).push(place.coordinates);
      });

    // Fit map to markers if any
    if (hasAny) {
      try {
        const group = L.featureGroup(layer.getLayers() as L.Marker[]);
        map.fitBounds(group.getBounds().pad(0.2));
      } catch {
        map.setView([20, 0], 2);
      }
    } else {
      map.setView([20, 0], 2);
    }
  }, [places]);

  return <div ref={mapRef} className="w-full h-[600px] rounded-2xl overflow-hidden shadow-lg border border-border" />;
};

// Helper function to get approximate coordinates based on location name
function getDefaultCoordinates(location: string): [number, number] {
  const locationMap: { [key: string]: [number, number] } = {
    "Paris, France": [48.8566, 2.3522],
    "Honshu, Japan": [35.6762, 139.6503],
    "Cyclades, Greece": [37.0853, 25.1488],
    "Tokyo, Japan": [35.6762, 139.6503],
    "New York, USA": [40.7128, -74.006],
    "London, UK": [51.5074, -0.1278],
    "Rome, Italy": [41.9028, 12.4964],
    "Sydney, Australia": [-33.8688, 151.2093],
  };

  for (const [key, coords] of Object.entries(locationMap)) {
    if (
      location.toLowerCase().includes(key.toLowerCase()) ||
      key.toLowerCase().includes(location.toLowerCase())
    ) {
      return coords;
    }
  }
  return [0, 0];
}
