import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Heart } from "lucide-react";
import { useState } from "react";

interface PlaceCardProps {
  id: string;
  name: string;
  location: string;
  date?: string;
  imageUrl: string;
  isVisited: boolean;
}

export const PlaceCard = ({ name, location, date, imageUrl, isVisited }: PlaceCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className="group overflow-hidden border-0 transition-all duration-300 hover:shadow-2xl"
      style={{ boxShadow: isHovered ? 'var(--shadow-hover)' : 'var(--shadow-card)' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        <div className="absolute top-4 right-4">
          <Badge 
            className={isVisited 
              ? "bg-primary text-primary-foreground border-0" 
              : "bg-secondary text-secondary-foreground border-0"
            }
          >
            {isVisited ? "Visited" : "Bucket List"}
          </Badge>
        </div>

        {!isVisited && (
          <Heart className="absolute top-4 left-4 w-6 h-6 text-white/90 fill-white/20 transition-all duration-300 group-hover:fill-secondary group-hover:text-secondary cursor-pointer" />
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-2xl font-bold mb-2 group-hover:text-accent transition-colors duration-300">
            {name}
          </h3>
          
          <div className="flex items-center gap-4 text-sm text-white/90">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </div>
            
            {date && isVisited && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{date}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
