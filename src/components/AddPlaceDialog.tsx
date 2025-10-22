import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Upload } from "lucide-react";

interface AddPlaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (place: any) => void;
}

export const AddPlaceDialog = ({ open, onOpenChange, onAdd }: AddPlaceDialogProps) => {
  const [isVisited, setIsVisited] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onAdd({
      id: Date.now().toString(),
      name,
      location,
      date: isVisited ? date : undefined,
      imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800",
      isVisited,
    });

    // Reset form
    setName("");
    setLocation("");
    setDate("");
    setIsVisited(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New Place</DialogTitle>
          <DialogDescription>
            Add a place you've visited or want to visit to your collection.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Place Name</Label>
            <Input
              id="name"
              placeholder="e.g., Eiffel Tower"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g., Paris, France"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
            <div className="space-y-0.5">
              <Label>Already Visited?</Label>
              <p className="text-sm text-muted-foreground">
                Mark if you've already been to this place
              </p>
            </div>
            <Switch
              checked={isVisited}
              onCheckedChange={setIsVisited}
            />
          </div>

          {isVisited && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <Label htmlFor="date">Date Visited</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Photos/Videos</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Photos or videos up to 10MB
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Add Place
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
