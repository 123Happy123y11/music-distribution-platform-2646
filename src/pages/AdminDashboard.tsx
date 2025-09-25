import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
  Search,
  Calendar,
  ArrowLeft,
  MessageCircle,
  UserCheck,
  UserX,
  FileText,
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'owner';
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;
  lastActive: string;
  totalTracks: number;
  totalStreams: number;
  totalRevenue: number;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("tracks");
  const [filter, setFilter] = useState<string>("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedTrackForReject, setSelectedTrackForReject] = useState<string | null>(null);
  const { toast } = useToast();
  const { tracks, updateTrack } = useTracksContext();

  // Mock users data
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'John Artist',
        email: 'john@example.com',
        role: 'user',
        status: 'active',
        joinDate: '2024-01-15',
        lastActive: '2 hours ago',
        totalTracks: 12,
        totalStreams: 50000,
        totalRevenue: 485.50
      },
      {
        id: '2',
        name: 'Sarah Producer',
        email: 'sarah@example.com',
        role: 'user',
        status: 'active',
        joinDate: '2024-02-20',
        lastActive: '1 day ago',
        totalTracks: 8,
        totalStreams: 25000,
        totalRevenue: 245.75
      },
      {
        id: '3',
        name: 'Mike Composer',
        email: 'mike@example.com',
        role: 'user',
        status: 'inactive',
        joinDate: '2024-03-10',
        lastActive: '1 week ago',
        totalTracks: 5,
        totalStreams: 12000,
        totalRevenue: 125.20
      }
    ];
    setUsers(mockUsers);
  }, []);

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
    ).length,
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    suspendedUsers: users.filter(u => u.status === 'suspended').length,
    totalRevenue: users.reduce((sum, user) => sum + user.totalRevenue, 0)
  };

  const handleApprove = (releaseId: string) => {
    updateTrack(releaseId, { status: "live" });
    toast({
      title: "Release Approved",
      description: "The release has been approved and will be distributed to platforms.",
    });
  };

  const handleReject = (releaseId: string, reason?: string) => {
    updateTrack(releaseId, { status: "rejected" });
    toast({
      title: "Release Rejected",
      description: reason ? `Rejected: ${reason}` : "The release has been rejected and the artist will be notified.",
      variant: "destructive"
    });
    setSelectedTrackForReject(null);
    setRejectReason("");
  };

  const handleSuspendUser = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: 'suspended' as const } : user
    ));
    toast({
      title: "User Suspended",
      description: "User account has been suspended.",
      variant: "destructive"
    });
  };

  const handleActivateUser = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: 'active' as const } : user
    ));
    toast({
      title: "User Activated",
      description: "User account has been activated.",
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
              <Link to="/admin/chat">
                <Button variant="outline">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat Management
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Revenue</p>
                  <p className="text-2xl font-bold">${stats.totalRevenue.toFixed(0)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100">Suspended</p>
                  <p className="text-2xl font-bold">{stats.suspendedUsers}</p>
                </div>
                <Shield className="h-8 w-8 text-red-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Administration</h2>
              <p className="text-gray-600">Manage content, users, and platform operations</p>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant={activeTab === "tracks" ? "default" : "outline"}
                onClick={() => setActiveTab("tracks")}
                className="flex items-center"
              >
                <Music className="w-4 h-4 mr-2" />
                Track Management
              </Button>
              <Button 
                variant={activeTab === "users" ? "default" : "outline"}
                onClick={() => setActiveTab("users")}
                className="flex items-center"
              >
                <Users className="w-4 h-4 mr-2" />
                User Management
              </Button>
              <Button 
                variant={activeTab === "analytics" ? "default" : "outline"}
                onClick={() => setActiveTab("analytics")}
                className="flex items-center"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </div>
          </div>

          {/* Track Management Tab */}
          {activeTab === "tracks" && (
            <Card>
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

                              {release.submissionNotes && (
                                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                  <p className="text-sm text-gray-700">
                                    <span className="font-medium">Notes:</span> {release.submissionNotes}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

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
                                  onClick={() => setSelectedTrackForReject(release.id)}
                                  variant="destructive"
                                  size="sm"
                                >
                                  <XCircle className="w-4 h-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                            
                            {release.status === "live" && (
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
          )}

          {/* User Management Tab */}
          {activeTab === "users" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  User Management
                </CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-gray-900">{user.name}</h3>
                            <Badge variant={user.status === 'active' ? 'default' : user.status === 'suspended' ? 'destructive' : 'secondary'}>
                              {user.status}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <span>{user.email}</span>
                            <span>{user.totalTracks} tracks</span>
                            <span>${user.totalRevenue.toFixed(2)} earned</span>
                            <span>Last active: {user.lastActive}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {user.status === 'active' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSuspendUser(user.id)}
                            className="text-red-600"
                          >
                            <UserX className="w-4 h-4 mr-2" />
                            Suspend
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleActivateUser(user.id)}
                            className="text-green-600"
                          >
                            <UserCheck className="w-4 h-4 mr-2" />
                            Activate
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Total Revenue</span>
                      <span className="font-bold">${stats.totalRevenue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Users</span>
                      <span className="font-bold">{stats.activeUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Releases</span>
                      <span className="font-bold">{adminReleases.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Approval Rate</span>
                      <span className="font-bold">{((stats.totalApproved / Math.max(adminReleases.length, 1)) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      3 releases approved today
                    </div>
                    <div className="flex items-center text-red-600">
                      <XCircle className="w-4 h-4 mr-2" />
                      1 release rejected today
                    </div>
                    <div className="flex items-center text-blue-600">
                      <Users className="w-4 h-4 mr-2" />
                      2 new users registered today
                    </div>
                    <div className="flex items-center text-yellow-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {stats.totalPending} releases awaiting review
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </Tabs>

        {/* Reject Modal */}
        {selectedTrackForReject && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Reject Release</CardTitle>
                <CardDescription>Please provide a reason for rejection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Enter rejection reason..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={4}
                  />
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleReject(selectedTrackForReject, rejectReason)}
                      variant="destructive"
                      className="flex-1"
                    >
                      Reject Release
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedTrackForReject(null);
                        setRejectReason("");
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;