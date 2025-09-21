import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useTracksContext, Track } from "@/contexts/TracksContext";
import { Save, X } from "lucide-react";

interface EditTrackModalProps {
  track: Track | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditTrackModal({ track, isOpen, onClose }: EditTrackModalProps) {
  const { updateTrack } = useTracksContext();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    album: "",
    genre: "",
    description: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);

  // Update form data when track changes
  useEffect(() => {
    if (track) {
      setFormData({
        title: track.title,
        artist: track.artist,
        album: track.album,
        genre: track.genre,
        description: "" // Add description field if needed
      });
    }
  }, [track]);

  const genres = [
    "Pop", "Rock", "Hip-Hop", "R&B", "Electronic", "Jazz", "Classical",
    "Country", "Folk", "Blues", "Reggae", "Punk", "Metal", "Alternative",
    "Indie", "World", "Ambient", "House", "Techno", "Dubstep"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!track) return;
    
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.title.trim() || !formData.artist.trim()) {
        toast({
          title: "Validation Error",
          description: "Title and artist are required fields.",
          variant: "destructive",
        });
        return;
      }

      // Update track with new data
      updateTrack(track.id, {
        title: formData.title.trim(),
        artist: formData.artist.trim(),
        album: formData.album.trim(),
        genre: formData.genre
      });

      toast({
        title: "Track Updated",
        description: `"${formData.title}" has been updated successfully.`,
      });

      onClose();
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update track. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!track) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="w-5 h-5 text-purple-500" />
            Edit Track Details
          </DialogTitle>
          <DialogDescription>
            Update the information for "{track.title}"
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Track Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Track Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter track title"
              disabled={isLoading}
            />
          </div>

          {/* Artist Name */}
          <div className="space-y-2">
            <Label htmlFor="artist">Artist Name *</Label>
            <Input
              id="artist"
              value={formData.artist}
              onChange={(e) => handleInputChange("artist", e.target.value)}
              placeholder="Enter artist name"
              disabled={isLoading}
            />
          </div>

          {/* Album */}
          <div className="space-y-2">
            <Label htmlFor="album">Album</Label>
            <Input
              id="album"
              value={formData.album}
              onChange={(e) => handleInputChange("album", e.target.value)}
              placeholder="Enter album name"
              disabled={isLoading}
            />
          </div>

          {/* Genre */}
          <div className="space-y-2">
            <Label htmlFor="genre">Genre</Label>
            <Select
              value={formData.genre}
              onValueChange={(value) => handleInputChange("genre", value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a genre" />
              </SelectTrigger>
              <SelectContent>
                {genres.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Add a description for your track..."
              rows={3}
              disabled={isLoading}
            />
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}