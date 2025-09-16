import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  uploadDate: string;
  status: "processing" | "live" | "rejected";
  streams: number;
  earnings: number;
  platforms: string[];
  artwork: string;
  fileName: string;
  userId?: string; // Associate tracks with users
}

interface TracksContextType {
  tracks: Track[];
  getUserTracks: (userId?: string) => Track[];
  addTrack: (trackData: Omit<Track, "id" | "uploadDate" | "status" | "streams" | "earnings" | "platforms" | "artwork" | "userId">, userId?: string) => void;
  updateTrack: (id: string, updates: Partial<Track>) => void;
  deleteTrack: (id: string) => void;
}

const TracksContext = createContext<TracksContextType | undefined>(undefined);

export const useTracksContext = () => {
  const context = useContext(TracksContext);
  if (!context) {
    throw new Error("useTracksContext must be used within a TracksProvider");
  }
  return context;
};

interface TracksProviderProps {
  children: ReactNode;
}

export const TracksProvider = ({ children }: TracksProviderProps) => {
  const [tracks, setTracks] = useState<Track[]>([]);

  // Load tracks from localStorage on mount
  useEffect(() => {
    const savedTracks = localStorage.getItem("uploadedTracks");
    if (savedTracks) {
      try {
        const parsedTracks = JSON.parse(savedTracks);
        setTracks(parsedTracks);
      } catch (error) {
        console.error("Error loading saved tracks:", error);
        // Initialize with mock data if localStorage is empty or corrupted
        initializeMockData();
      }
    } else {
      initializeMockData();
    }
  }, []);

  // Save tracks to localStorage whenever tracks change
  useEffect(() => {
    localStorage.setItem("uploadedTracks", JSON.stringify(tracks));
  }, [tracks]);

  const initializeMockData = () => {
    const mockTracks: Track[] = [
      {
        id: "1",
        title: "Midnight Dreams",
        artist: "Demo Artist",
        album: "Night Sessions",
        genre: "Electronic",
        fileName: "midnight-dreams.mp3",
        uploadDate: "2024-01-15",
        status: "live",
        streams: 15420,
        earnings: 123.45,
        platforms: ["Spotify", "Apple Music", "YouTube Music"],
        artwork: "/placeholder.svg"
      },
      {
        id: "2", 
        title: "Electric Vibes",
        artist: "Demo Artist",
        album: "Electronic EP",
        genre: "Electronic",
        fileName: "electric-vibes.wav",
        uploadDate: "2024-01-10",
        status: "processing",
        streams: 0,
        earnings: 0,
        platforms: [],
        artwork: "/placeholder.svg"
      },
      {
        id: "3",
        title: "Summer Groove",
        artist: "Demo Artist",
        album: "Single",
        genre: "Pop",
        fileName: "summer-groove.mp3",
        uploadDate: "2024-01-05",
        status: "live",
        streams: 8930,
        earnings: 67.89,
        platforms: ["Spotify", "Apple Music", "Amazon Music"],
        artwork: "/placeholder.svg"
      }
    ];
    setTracks(mockTracks);
  };

  const getUserTracks = (userId?: string) => {
    if (!userId) return [];
    return tracks.filter(track => track.userId === userId);
  };

  const addTrack = (trackData: Omit<Track, "id" | "uploadDate" | "status" | "streams" | "earnings" | "platforms" | "artwork" | "userId">, userId?: string) => {
    const newTrack: Track = {
      ...trackData,
      id: Date.now().toString(),
      uploadDate: new Date().toISOString().split('T')[0],
      status: "processing",
      streams: 0,
      earnings: 0,
      platforms: [],
      artwork: "/placeholder.svg",
      userId: userId || 'guest'
    };

    setTracks(prev => [newTrack, ...prev]);

    // Simulate processing completion after 5 seconds
    setTimeout(() => {
      setTracks(prev => prev.map(track => 
        track.id === newTrack.id 
          ? { ...track, status: "live", platforms: ["Spotify", "Apple Music", "YouTube Music"] }
          : track
      ));
    }, 5000);
  };

  const updateTrack = (id: string, updates: Partial<Track>) => {
    setTracks(prev => prev.map(track => 
      track.id === id ? { ...track, ...updates } : track
    ));
  };

  const deleteTrack = (id: string) => {
    setTracks(prev => prev.filter(track => track.id !== id));
  };

  return (
    <TracksContext.Provider value={{ tracks, getUserTracks, addTrack, updateTrack, deleteTrack }}>
      {children}
    </TracksContext.Provider>
  );
};