import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Music, 
  Users, 
  TrendingUp, 
  DollarSign,
  Play,
  Pause,
  Eye,
  Download,
  Flag,
  Shield,
  Settings,
  Filter,
  Search,
  Calendar,
  ArrowLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTracksContext } from "@/contexts/TracksContext";

interface AdminRelease {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genre: string;
  duration: string;
  uploadDate: string;
  userId: string;
  status: "pending" | "live" | "processing" | "rejected";
  fileUrl?: string;
  artwork?: string;
  streams: number;
  revenue: number;
  metadata: {
    explicit: boolean;
    copyright: string;
    isrc?: string;
  };
  submissionNotes?: string;
}

const AdminDashboard = () => {
  const [filter, setFilter] = useState<string>("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const { toast } = useToast();
  const { tracks, updateTrack } = useTracksContext();

  // Convert tracks from context to admin format
  const adminReleases: AdminRelease[] = tracks.map(track => ({
    id: track.id,
    title: track.title,
    artist: track.artist,
    album: track.album,
    genre: track.genre || "Unknown",
    duration: track.duration || "3:00",
    uploadDate: track.uploadDate || new Date().toISOString(),
    userId: track.userId || "unknown",
    status: track.status === "live" ? "live" : track.status === "processing" ? "pending" : track.status,
    streams: track.streams,
    revenue: track.revenue,
    metadata: {
      explicit: false,
      copyright: `2024 ${track.artist}`,
      isrc: `US-SW-24-${track.id.slice(-5)}`
    },
    submissionNotes: "Artist uploaded via platform"
  }));

  const filteredReleases = adminReleases.filter(release => {
    const matchesFilter = filter === "all" || 
      (filter === "pending" && (release.status === "pending" || release.status === "processing")) ||
      (filter === "approved" && release.status === "live") ||
      (filter === "rejected" && release.status === "rejected");
    const matchesSearch = searchQuery === "" || 
      release.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      release.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      release.genre.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    totalPending: adminReleases.filter(r => r.status === "pending" || r.status === "processing").length,
    totalApproved: adminReleases.filter(r => r.status === "live").length,
    totalRejected: adminReleases.filter(r => r.status === "rejected").length,
    totalToday: adminReleases.filter(r => 
      new Date(r.uploadDate).toDateString() === new Date().toDateString()
    ).length
  };

  const handleApprove = (releaseId: string) => {
    updateTrack(releaseId, { status: "live" });
    toast({
      title: "Release Approved",
      description: "The release has been approved and will be distributed to platforms.",
    });
  };

  const handleReject = (releaseId: string) => {
    updateTrack(releaseId, { status: "rejected" });
    toast({
      title: "Release Rejected",
      description: "The release has been rejected and the artist will be notified.",
      variant: "destructive"
    });
  };

  const handleTakedown = (releaseId: string) => {
    // In a real app, this would mark for takedown
    toast({
      title: "Takedown Initiated",
      description: "The release will be removed from all platforms within 24 hours.",
      variant: "destructive"
    });
  };

  const togglePlay = (trackId: string) => {
    setPlayingTrack(playingTrack === trackId ? null : trackId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500 text-white";
      case "pending":
        return "bg-yellow-500 text-white";
      case "rejected":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Manage releases and content moderation</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Link to="/dashboard">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100">Pending Review</p>
                  <p className="text-2xl font-bold">{stats.totalPending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Approved</p>
                  <p className="text-2xl font-bold">{stats.totalApproved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100">Rejected</p>
                  <p className="text-2xl font-bold">{stats.totalRejected}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Today's Submissions</p>
                  <p className="text-2xl font-bold">{stats.totalToday}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Music className="w-5 h-5 mr-2" />
              Release Management
            </CardTitle>
            <CardDescription>Review, approve, reject, or takedown music releases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by title, artist, or genre..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="all">All Releases</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Releases List */}
            <div className="space-y-4">
              {filteredReleases.map((release) => (
                <Card key={release.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        {/* Play Button */}
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => togglePlay(release.id)}
                          className="mt-1"
                        >
                          {playingTrack === release.id ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </Button>

                        {/* Release Info */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {release.title}
                            </h3>
                            <Badge className={getStatusColor(release.status)}>
                              {getStatusIcon(release.status)}
                              <span className="ml-1 capitalize">{release.status}</span>
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Artist:</span> {release.artist}
                            </div>
                            <div>
                              <span className="font-medium">Genre:</span> {release.genre}
                            </div>
                            <div>
                              <span className="font-medium">Duration:</span> {release.duration}
                            </div>
                            <div>
                              <span className="font-medium">Uploaded:</span> {formatDate(release.uploadDate)}
                            </div>
                          </div>

                          {release.album && (
                            <div className="text-sm text-gray-600 mt-1">
                              <span className="font-medium">Album:</span> {release.album}
                            </div>
                          )}

                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            {release.metadata.explicit && (
                              <Badge variant="outline" className="text-red-600 border-red-200">
                                Explicit
                              </Badge>
                            )}
                            {release.metadata.isrc && (
                              <span>ISRC: {release.metadata.isrc}</span>
                            )}
                            <span>{release.metadata.copyright}</span>
                          </div>

                          {release.submissionNotes && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-700">
                                <span className="font-medium">Submission Notes:</span> {release.submissionNotes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2 ml-4">
                        <Button variant="outline" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Download className="w-4 h-4" />
                        </Button>
                        
                        {release.status === "pending" && (
                          <>
                            <Button 
                              onClick={() => handleApprove(release.id)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                              size="sm"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              onClick={() => handleReject(release.id)}
                              variant="destructive"
                              size="sm"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        
                        {release.status === "approved" && (
                          <Button 
                            onClick={() => handleTakedown(release.id)}
                            variant="destructive"
                            size="sm"
                          >
                            <Flag className="w-4 h-4 mr-1" />
                            Takedown
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredReleases.length === 0 && (
                <div className="text-center py-12">
                  <Music className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No releases found
                  </h3>
                  <p className="text-gray-600">
                    {searchQuery ? "Try adjusting your search terms" : "No releases match the current filter"}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;