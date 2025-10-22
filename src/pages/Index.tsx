import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Hero } from "@/components/Hero";
import { PlacesList } from "@/components/PlacesList";
import { AddPlaceDialog } from "@/components/AddPlaceDialog";
import { LeafletMap } from "@/components/LeafletMap";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Map, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchPlaces();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchPlaces = async () => {
    try {
      const { data, error } = await supabase
        .from('places')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedPlaces = data?.map((place) => ({
        id: place.id,
        name: place.name,
        location: place.location,
        date: place.date_visited,
        imageUrl: place.media_urls?.[0] || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800",
        isVisited: place.is_visited,
        latitude: place.latitude,
        longitude: place.longitude,
      })) || [];

      setPlaces(formattedPlaces);
    } catch (error: any) {
      toast.error("Failed to load places");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const visitedPlaces = places.filter(p => p.isVisited);
  const bucketListPlaces = places.filter(p => !p.isVisited);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 space-y-12">
        <div className="flex justify-end">
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
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
        onAdd={fetchPlaces}
      />
    </div>
  );
};

export default Index;
