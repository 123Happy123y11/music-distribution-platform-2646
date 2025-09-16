import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Music, FileAudio, Play, Pause, CheckCircle, AlertCircle, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTracksContext } from "@/contexts/TracksContext";
import { useAuth } from "@/contexts/AuthContext";

interface UploadFormProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

interface TrackFile {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'complete' | 'error';
  metadata: {
    title: string;
    artist: string;
    album: string;
    genre: string;
    releaseDate: string;
    description: string;
  };
  audioUrl?: string;
  duration?: number;
}

const genres = [
  "Pop", "Rock", "Hip Hop", "R&B", "Jazz", "Classical", "Electronic", 
  "Country", "Folk", "Reggae", "Blues", "Funk", "Alternative", "Indie", 
  "World", "Ambient", "Other"
];

const UploadForm = ({ isOpen, onClose, userId }: UploadFormProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [tracks, setTracks] = useState<TrackFile[]>([]);
  const [currentStep, setCurrentStep] = useState<'upload' | 'metadata' | 'review'>('upload');
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();
  const { addTrack } = useTracksContext();
  
  // Get user data for auto-filling artist name
  let user = null;
  try {
    const authContext = useAuth();
    user = authContext?.user || null;
  } catch (error) {
    // AuthContext not available, user will remain null
    user = null;
  }

  // Reset form when modal is closed
  const handleClose = () => {
    // Clean up any audio URLs
    tracks.forEach(track => {
      if (track.audioUrl) {
        URL.revokeObjectURL(track.audioUrl);
      }
    });
    
    // Reset all state
    setTracks([]);
    setCurrentStep('upload');
    setSelectedTrack(null);
    setIsPlaying(false);
    setDragActive(false);
    
    // Close the modal
    onClose();
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAudioFile = (file: File): boolean => {
    const validTypes = ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/aac', 'audio/mp3'];
    const maxSize = 100 * 1024 * 1024; // 100MB
    
    if (!validTypes.some(type => file.type.includes(type.split('/')[1]))) {
      toast({
        title: "Invalid file type",
        description: `${file.name} is not a supported audio format.`,
        variant: "destructive"
      });
      return false;
    }
    
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: `${file.name} exceeds the 100MB limit.`,
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const createAudioUrl = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      resolve(url);
    });
  };

  const getAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.addEventListener('loadedmetadata', () => {
        resolve(audio.duration);
      });
      audio.src = URL.createObjectURL(file);
    });
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(validateAudioFile);
    await processFiles(droppedFiles);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).filter(validateAudioFile);
      await processFiles(selectedFiles);
    }
  };

  const processFiles = async (files: File[]) => {
    const newTracks: TrackFile[] = [];
    
    for (const file of files) {
      const audioUrl = await createAudioUrl(file);
      const duration = await getAudioDuration(file);
      const fileName = file.name.replace(/\.[^/.]+$/, "");
      
      newTracks.push({
        file,
        id: generateId(),
        progress: 0,
        status: 'pending',
        audioUrl,
        duration,
        metadata: {
          title: fileName,
          artist: user?.name || "",
          album: "",
          genre: "",
          releaseDate: new Date().toISOString().split('T')[0],
          description: ""
        }
      });
    }
    
    setTracks(prev => [...prev, ...newTracks]);
    
    if (newTracks.length > 0) {
      toast({
        title: "Files added!",
        description: `${newTracks.length} audio file(s) ready for upload.`,
      });
      setCurrentStep('metadata');
    }
  };

  const removeTrack = (id: string) => {
    setTracks(prev => {
      const track = prev.find(t => t.id === id);
      if (track?.audioUrl) {
        URL.revokeObjectURL(track.audioUrl);
      }
      return prev.filter(t => t.id !== id);
    });
  };

  const updateTrackMetadata = (id: string, field: keyof TrackFile['metadata'], value: string) => {
    setTracks(prev => prev.map(track => 
      track.id === id 
        ? { ...track, metadata: { ...track.metadata, [field]: value } }
        : track
    ));
  };

  const simulateUpload = (track: TrackFile) => {
    const duration = 3000; // 3 seconds
    const interval = 50;
    const increment = 100 / (duration / interval);
    
    setTracks(prev => prev.map(t => 
      t.id === track.id ? { ...t, status: 'uploading', progress: 0 } : t
    ));
    
    const timer = setInterval(() => {
      setTracks(prev => prev.map(t => {
        if (t.id === track.id) {
          const newProgress = Math.min(t.progress + increment, 100);
          if (newProgress >= 100) {
            clearInterval(timer);
            setTimeout(() => {
              setTracks(prev2 => prev2.map(t2 => 
                t2.id === track.id ? { ...t2, status: 'processing', progress: 100 } : t2
              ));
              setTimeout(() => {
                setTracks(prev3 => prev3.map(t3 => 
                  t3.id === track.id ? { ...t3, status: 'complete', progress: 100 } : t3
                ));
              }, 2000);
            }, 500);
            return { ...t, progress: 100, status: 'uploading' };
          }
          return { ...t, progress: newProgress };
        }
        return t;
      }));
    }, interval);
  };

  const handleSubmit = () => {
    if (tracks.length === 0) {
      toast({
        title: "No tracks to upload",
        description: "Please add at least one audio file.",
        variant: "destructive"
      });
      return;
    }

    const incompleteMetadata = tracks.some(track => 
      !track.metadata.title || !track.metadata.artist
    );

    if (incompleteMetadata) {
      toast({
        title: "Incomplete metadata",
        description: "Please fill in title and artist for all tracks.",
        variant: "destructive"
      });
      setCurrentStep('metadata');
      return;
    }

    setCurrentStep('review');
    
    // Start upload simulation for all tracks
    tracks.forEach(track => {
      setTimeout(() => simulateUpload(track), Math.random() * 1000);
    });

    // Add tracks to context after upload completes
    setTimeout(() => {
      tracks.forEach(track => {
        addTrack({
          title: track.metadata.title,
          artist: track.metadata.artist,
          album: track.metadata.album || "Single",
          genre: track.metadata.genre || "Unknown",
          fileName: track.file.name
        }, userId);
      });

      toast({
        title: "Upload complete!",
        description: `${tracks.length} track(s) uploaded and distributed successfully.`,
      });
      
      // Clean up and reset form
      tracks.forEach(track => {
        if (track.audioUrl) {
          URL.revokeObjectURL(track.audioUrl);
        }
      });
      
      // Reset form state
      setTracks([]);
      setCurrentStep('upload');
      setSelectedTrack(null);
      setIsPlaying(false);
      
      // Close modal properly
      handleClose();
    }, 5000);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-4 mb-6">
      <div className={`flex items-center space-x-2 ${currentStep === 'upload' ? 'text-primary' : tracks.length > 0 ? 'text-green-600' : 'text-muted-foreground'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'upload' ? 'bg-primary text-white' : tracks.length > 0 ? 'bg-green-600 text-white' : 'bg-muted'}`}>
          {tracks.length > 0 && currentStep !== 'upload' ? <CheckCircle className="w-4 h-4" /> : '1'}
        </div>
        <span className="font-medium">Upload</span>
      </div>
      <div className={`w-8 h-0.5 ${tracks.length > 0 ? 'bg-green-600' : 'bg-muted'}`} />
      <div className={`flex items-center space-x-2 ${currentStep === 'metadata' ? 'text-primary' : currentStep === 'review' ? 'text-green-600' : 'text-muted-foreground'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'metadata' ? 'bg-primary text-white' : currentStep === 'review' ? 'bg-green-600 text-white' : 'bg-muted'}`}>
          {currentStep === 'review' ? <CheckCircle className="w-4 h-4" /> : '2'}
        </div>
        <span className="font-medium">Metadata</span>
      </div>
      <div className={`w-8 h-0.5 ${currentStep === 'review' ? 'bg-primary' : 'bg-muted'}`} />
      <div className={`flex items-center space-x-2 ${currentStep === 'review' ? 'text-primary' : 'text-muted-foreground'}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'review' ? 'bg-primary text-white' : 'bg-muted'}`}>
          3
        </div>
        <span className="font-medium">Review</span>
      </div>
    </div>
  );

  const renderUploadStep = () => (
    <div className="space-y-6">
      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
          dragActive
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-muted-foreground/25 hover:border-primary/50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="w-16 h-16 mx-auto mb-6 text-muted-foreground" />
        <h3 className="text-xl font-semibold mb-2">
          Drop your music files here
        </h3>
        <p className="text-muted-foreground mb-6">
          Support for MP3, WAV, FLAC, AAC • Max 100MB per file
        </p>
        <Input
          type="file"
          multiple
          accept="audio/*"
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />
        <Button asChild size="lg">
          <label htmlFor="file-upload" className="cursor-pointer">
            <Upload className="w-4 h-4 mr-2" />
            Browse Files
          </label>
        </Button>
      </div>

      {tracks.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">{tracks.length} Files Selected</Label>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentStep('metadata')}
            >
              Continue →
            </Button>
          </div>
          {tracks.map((track) => (
            <div key={track.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-4">
                <FileAudio className="w-6 h-6 text-primary" />
                <div>
                  <p className="font-medium">{track.metadata.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(track.file.size)} • {track.duration ? formatTime(track.duration) : 'Loading...'}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeTrack(track.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderMetadataStep = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Track Information</h3>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => setCurrentStep('upload')}>
            ← Back
          </Button>
          <Button onClick={handleSubmit}>
            Upload All →
          </Button>
        </div>
      </div>
      
      <div className="space-y-6">
        {tracks.map((track) => (
          <Card key={track.id} className="p-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <FileAudio className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-grow space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Track Title *</Label>
                    <Input
                      value={track.metadata.title}
                      onChange={(e) => updateTrackMetadata(track.id, 'title', e.target.value)}
                      placeholder="Enter track title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Artist Name *</Label>
                    <Input
                      value={track.metadata.artist}
                      onChange={(e) => updateTrackMetadata(track.id, 'artist', e.target.value)}
                      placeholder="Enter artist name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Album</Label>
                    <Input
                      value={track.metadata.album}
                      onChange={(e) => updateTrackMetadata(track.id, 'album', e.target.value)}
                      placeholder="Enter album name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Genre</Label>
                    <Select
                      value={track.metadata.genre}
                      onValueChange={(value) => updateTrackMetadata(track.id, 'genre', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select genre" />
                      </SelectTrigger>
                      <SelectContent>
                        {genres.map(genre => (
                          <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Release Date</Label>
                    <Input
                      type="date"
                      value={track.metadata.releaseDate}
                      onChange={(e) => updateTrackMetadata(track.id, 'releaseDate', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={track.metadata.description}
                    onChange={(e) => updateTrackMetadata(track.id, 'description', e.target.value)}
                    placeholder="Brief description of your track (optional)"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Uploading Your Music</h3>
        <p className="text-muted-foreground">
          Your tracks are being processed and distributed to streaming platforms
        </p>
      </div>
      
      <div className="space-y-4">
        {tracks.map((track) => (
          <Card key={track.id} className="p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {track.status === 'complete' ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : track.status === 'error' ? (
                  <AlertCircle className="w-6 h-6 text-red-600" />
                ) : (
                  <FileAudio className="w-6 h-6 text-primary" />
                )}
              </div>
              <div className="flex-grow">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">{track.metadata.title}</p>
                    <p className="text-sm text-muted-foreground">by {track.metadata.artist}</p>
                  </div>
                  <Badge variant={
                    track.status === 'complete' ? 'default' : 
                    track.status === 'error' ? 'destructive' :
                    track.status === 'processing' ? 'secondary' : 'outline'
                  }>
                    {track.status === 'pending' && 'Pending'}
                    {track.status === 'uploading' && 'Uploading'}
                    {track.status === 'processing' && 'Processing'}
                    {track.status === 'complete' && 'Complete'}
                    {track.status === 'error' && 'Error'}
                  </Badge>
                </div>
                {(track.status === 'uploading' || track.status === 'processing') && (
                  <Progress value={track.progress} className="h-2" />
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Upload Your Music</CardTitle>
              <CardDescription>
                Distribute your tracks to Spotify, Apple Music, and 150+ platforms worldwide
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {renderStepIndicator()}
          
          {currentStep === 'upload' && renderUploadStep()}
          {currentStep === 'metadata' && renderMetadataStep()}
          {currentStep === 'review' && renderReviewStep()}
        </CardContent>
      </Card>
    </div>
  );
};

export default UploadForm;