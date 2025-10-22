import { useState } from "react";
import { Hero } from "@/components/Hero";
import { PlacesList } from "@/components/PlacesList";
import { AddPlaceDialog } from "@/components/AddPlaceDialog";
import { LeafletMap } from "@/components/LeafletMap";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Map } from "lucide-react";
import parisImage from "@/assets/sample-paris.jpg";
import japanImage from "@/assets/sample-japan.jpg";
import greeceImage from "@/assets/sample-greece.jpg";

const Index = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [places, setPlaces] = useState([
    {
      id: "1",
      name: "Eiffel Tower",
      location: "Paris, France",
      date: "2024-03-15",
      imageUrl: parisImage,
      isVisited: true,
    },
    {
      id: "2",
      name: "Mount Fuji",
      location: "Honshu, Japan",
      date: "2024-05-20",
      imageUrl: japanImage,
      isVisited: true,
    },
    {
      id: "3",
      name: "Santorini",
      location: "Cyclades, Greece",
      imageUrl: greeceImage,
      isVisited: false,
    },
  ]);

  const visitedPlaces = places.filter(p => p.isVisited);
  const bucketListPlaces = places.filter(p => !p.isVisited);

  const handleAddPlace = (newPlace: any) => {
    setPlaces([...places, newPlace]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 space-y-12">
        <Hero onAddPlace={() => setIsDialogOpen(true)} />

        <Tabs defaultValue="visited" className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList className="grid w-[600px] grid-cols-3">
              <TabsTrigger value="visited" className="text-base">
                Places Visited ({visitedPlaces.length})
              </TabsTrigger>
              <TabsTrigger value="bucket" className="text-base">
                Bucket List ({bucketListPlaces.length})
              </TabsTrigger>
              <TabsTrigger value="map" className="text-base">
                <Map className="mr-2 h-4 w-4" />
                Map View
              </TabsTrigger>
            </TabsList>
            
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Place
            </Button>
          </div>

          <TabsContent value="visited" className="mt-8">
            <PlacesList places={visitedPlaces} title="Places I've Visited" />
          </TabsContent>

          <TabsContent value="bucket" className="mt-8">
            <PlacesList places={bucketListPlaces} title="My Bucket List" />
          </TabsContent>

          <TabsContent value="map" className="mt-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-foreground">World Map</h2>
                <div className="flex gap-4 items-center text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-primary"></div>
                    <span>Visited</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-secondary"></div>
                    <span>Bucket List</span>
                  </div>
                </div>
              </div>
              <LeafletMap places={places} />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <AddPlaceDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAdd={handleAddPlace}
      />
    </div>
  );
};

export default Index;
