import { PlaceCard } from "./PlaceCard";

interface Place {
  id: string;
  name: string;
  location: string;
  date?: string;
  imageUrl: string;
  isVisited: boolean;
}

interface PlacesListProps {
  places: Place[];
  title: string;
}

export const PlacesList = ({ places, title }: PlacesListProps) => {
  if (places.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-lg">
          No places yet. Start adding your adventures!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-foreground">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {places.map((place) => (
          <PlaceCard key={place.id} {...place} />
        ))}
      </div>
    </div>
  );
};
