import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar } from 'lucide-react';

// Fix for default marker icons in react-leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

interface Place {
  id: string;
  name: string;
  location: string;
  date?: string;
  imageUrl: string;
  isVisited: boolean;
  coordinates?: [number, number];
}

interface MapViewProps {
  places: Place[];
}

// Create custom icons for visited and bucket list places
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
    iconUrl: 'data:image/svg+xml;base64,' + btoa(svg),
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42],
  });
};

const visitedIcon = createIcon('hsl(210, 70%, 45%)', true);
const bucketListIcon = createIcon('hsl(15, 85%, 65%)', false);

export const MapView = ({ places }: MapViewProps) => {
  // Sample coordinates for demo places
  const placesWithCoords = places.map(place => ({
    ...place,
    coordinates: place.coordinates || getDefaultCoordinates(place.location),
  }));

  // Calculate center based on all places
  const center: L.LatLngExpression = placesWithCoords.length > 0
    ? calculateCenter(placesWithCoords)
    : [20, 0];

  return (
    <div className="w-full h-[600px] rounded-2xl overflow-hidden shadow-lg border border-border">
      <MapContainer
        center={center}
        zoom={2}
        className="w-full h-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {placesWithCoords.map((place) => (
          <Marker
            key={place.id}
            position={place.coordinates as L.LatLngExpression}
            icon={place.isVisited ? visitedIcon : bucketListIcon}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <div className="mb-2">
                  <Badge 
                    className={place.isVisited 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-secondary text-secondary-foreground"
                    }
                  >
                    {place.isVisited ? "Visited" : "Bucket List"}
                  </Badge>
                </div>
                
                <h3 className="font-bold text-lg mb-2">{place.name}</h3>
                
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                  <MapPin className="w-3 h-3" />
                  <span>{place.location}</span>
                </div>
                
                {place.date && place.isVisited && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{place.date}</span>
                  </div>
                )}
                
                <img 
                  src={place.imageUrl} 
                  alt={place.name}
                  className="w-full h-32 object-cover rounded-lg mt-3"
                />
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

// Helper function to get approximate coordinates based on location name
function getDefaultCoordinates(location: string): [number, number] {
  const locationMap: { [key: string]: [number, number] } = {
    'Paris, France': [48.8566, 2.3522],
    'Honshu, Japan': [35.6762, 139.6503],
    'Cyclades, Greece': [37.0853, 25.1488],
    'Tokyo, Japan': [35.6762, 139.6503],
    'New York, USA': [40.7128, -74.0060],
    'London, UK': [51.5074, -0.1278],
    'Rome, Italy': [41.9028, 12.4964],
    'Sydney, Australia': [-33.8688, 151.2093],
  };

  // Try to find a match
  for (const [key, coords] of Object.entries(locationMap)) {
    if (location.toLowerCase().includes(key.toLowerCase()) || 
        key.toLowerCase().includes(location.toLowerCase())) {
      return coords;
    }
  }

  // Default to a random location if not found
  return [0, 0];
}

function calculateCenter(places: Place[]): [number, number] {
  if (places.length === 0) return [0, 0];
  
  const sum = places.reduce(
    (acc, place) => {
      if (place.coordinates) {
        return {
          lat: acc.lat + place.coordinates[0],
          lng: acc.lng + place.coordinates[1],
        };
      }
      return acc;
    },
    { lat: 0, lng: 0 }
  );

  return [sum.lat / places.length, sum.lng / places.length];
}
