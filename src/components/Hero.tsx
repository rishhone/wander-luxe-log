import { Button } from "@/components/ui/button";
import { MapPin, Plus } from "lucide-react";
import heroImage from "@/assets/hero-travel.jpg";

interface HeroProps {
  onAddPlace: () => void;
}

export const Hero = ({ onAddPlace }: HeroProps) => {
  return (
    <div className="relative h-[70vh] min-h-[500px] overflow-hidden rounded-3xl">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
      </div>
      
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4 z-10">
        <div className="flex items-center gap-2 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <MapPin className="w-8 h-8 text-white" />
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
            WanderLog
          </h1>
        </div>
        
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
          Capture your adventures, preserve your memories, and plan your next journey
        </p>
        
        <Button 
          onClick={onAddPlace}
          size="lg" 
          className="bg-secondary hover:bg-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Your First Place
        </Button>
      </div>
    </div>
  );
};
