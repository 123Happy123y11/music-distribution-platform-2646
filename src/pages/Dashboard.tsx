import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  Music, 
  TrendingUp, 
  DollarSign, 
  Edit,
  Trash2,
  Plus,
  User,
  BarChart3,
  Search,
  Copy,
  RefreshCw,
  Menu,
  Save
} from "lucide-react";
import UploadForm from "@/components/UploadForm";
import { useTracksContext } from "@/contexts/TracksContext";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const [isUploadFormOpen, setIsUploadFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    country: "",
    genre: "",
    bio: ""
  });
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  
  const { toast } = useToast();

  // Safely get contexts with error handling
  let getUserTracks, deleteTrack, updateTrack, user;
  
  try {
    const tracksContext = useTracksContext();
    const authContext = useAuth();
    
    getUserTracks = tracksContext.getUserTracks;
    deleteTrack = tracksContext.deleteTrack;
    updateTrack = tracksContext.updateTrack;
    user = authContext.user;
  } catch (error) {
    console.error('Context error:', error);
    // Provide fallback functions
    getUserTracks = () => [];
    deleteTrack = () => {};
    updateTrack = () => {};
    user = null;
  }

  // Load profile data from localStorage or user context
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfileData(JSON.parse(savedProfile));
    } else if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        country: "",
        genre: "",
        bio: ""
      });
    }
  }, [user]);

  // Save profile data
  const handleSaveProfile = async () => {
    setIsProfileSaving(true);
    try {
      // Save to localStorage
      localStorage.setItem('userProfile', JSON.stringify(profileData));
      
      // Show success message
      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProfileSaving(false);
    }
  };

  // Handle profile field changes
  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const userTracks = getUserTracks ? getUserTracks(user?.id || 'guest') : [];

  // Calculate stats
  const stats = {
    totalTracks: userTracks.length,
    totalStreams: userTracks.reduce((sum, track) => sum + (track.streams || 0), 0),
    totalRevenue: userTracks.reduce((sum, track) => sum + (track.revenue || 0), 0),
    activeTracks: userTracks.filter(track => track.status === 'live').length
  };

  // Filter tracks
  const filteredTracks = userTracks.filter(track => {
    const matchesSearch = track.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterBy === 'all' || track.status === filterBy;
    return matchesSearch && matchesFilter;
  });

  const handleDeleteTrack = (trackId: string) => {
    if (window.confirm('Are you sure you want to delete this track?')) {
      if (deleteTrack) deleteTrack(trackId);
    }
  };

  const handleCopyLink = (track: any) => {
    const link = `https://tunetracks.com/track/${track.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link).catch(console.error);
    }
    console.log('Link copied:', link);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tracks</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTracks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Streams</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStreams.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tracks</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeTracks}</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Get started with your music distribution</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button onClick={() => setIsUploadFormOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Upload New Track
          </Button>
          <Button variant="outline" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            View Analytics
          </Button>
          <Button variant="outline" className="gap-2">
            <DollarSign className="h-4 w-4" />
            Check Earnings
          </Button>
        </CardContent>
      </Card>

      {/* Recent Tracks */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Tracks</CardTitle>
          <CardDescription>Your latest uploads</CardDescription>
        </CardHeader>
        <CardContent>
          {userTracks.length === 0 ? (
            <div className="text-center py-8">
              <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No tracks uploaded yet</p>
              <Button onClick={() => setIsUploadFormOpen(true)} className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                Upload Your First Track
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {userTracks.slice(0, 5).map((track) => (
                <div key={track.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Music className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium">{track.title}</h3>
                      <p className="text-sm text-muted-foreground">{track.artist}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={track.status === 'live' ? 'default' : 'secondary'}>
                      {track.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {track.streams?.toLocaleString() || 0} streams
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderMyTracks = () => (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search tracks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterBy} onValueChange={setFilterBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tracks</SelectItem>
            <SelectItem value="live">Live</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tracks List */}
      <div className="space-y-4">
        {filteredTracks.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No tracks found</p>
            </CardContent>
          </Card>
        ) : (
          filteredTracks.map((track) => (
            <Card key={track.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Music className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{track.title}</h3>
                      <p className="text-muted-foreground">{track.artist}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                        <span>{track.streams?.toLocaleString() || 0} streams</span>
                        <span>${track.revenue?.toFixed(2) || '0.00'} earned</span>
                        <Badge variant={track.status === 'live' ? 'default' : 'secondary'}>
                          {track.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyLink(track)}
                      className="gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copy Link
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (updateTrack) {
                          updateTrack(track.id, { 
                            streams: (track.streams || 0) + Math.floor(Math.random() * 100) + 10 
                          });
                        }
                      }}
                      className="gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Refresh Stats
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteTrack(track.id)}
                      className="gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
          <CardDescription>Track your music performance across platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-4">Platform Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Spotify</span>
                  <span>{Math.round(stats.totalStreams * 0.45).toLocaleString()} streams</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Apple Music</span>
                  <span>{Math.round(stats.totalStreams * 0.28).toLocaleString()} streams</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>YouTube Music</span>
                  <span>{Math.round(stats.totalStreams * 0.15).toLocaleString()} streams</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Others</span>
                  <span>{Math.round(stats.totalStreams * 0.12).toLocaleString()} streams</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-4">Revenue Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Streaming Revenue</span>
                  <span>${(stats.totalRevenue * 0.8).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Download Revenue</span>
                  <span>${(stats.totalRevenue * 0.15).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Sync Revenue</span>
                  <span>${(stats.totalRevenue * 0.05).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Manage your artist profile and account settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="text-2xl">
                {profileData.name?.charAt(0) || user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm">
                Change Avatar
              </Button>
              <p className="text-xs text-muted-foreground mt-1">Upload a new avatar image</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Artist Name *</label>
              <Input 
                value={profileData.name} 
                onChange={(e) => handleProfileChange('name', e.target.value)}
                className="mt-1" 
                placeholder="Enter your artist name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email *</label>
              <Input 
                value={profileData.email} 
                onChange={(e) => handleProfileChange('email', e.target.value)}
                className="mt-1"
                type="email"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Country</label>
              <Input 
                value={profileData.country}
                onChange={(e) => handleProfileChange('country', e.target.value)}
                placeholder="United States" 
                className="mt-1" 
              />
            </div>
            <div>
              <label className="text-sm font-medium">Primary Genre</label>
              <Input 
                value={profileData.genre}
                onChange={(e) => handleProfileChange('genre', e.target.value)}
                placeholder="Pop, Hip Hop, Rock, etc." 
                className="mt-1" 
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Bio</label>
            <Textarea 
              value={profileData.bio}
              onChange={(e) => handleProfileChange('bio', e.target.value)}
              className="mt-1"
              rows={4}
              placeholder="Tell us about yourself, your music style, influences, and what makes you unique..."
            />
            <p className="text-xs text-muted-foreground mt-1">
              {profileData.bio.length}/500 characters
            </p>
          </div>

          <div className="pt-4 flex gap-3">
            <Button 
              onClick={handleSaveProfile}
              disabled={isProfileSaving || !profileData.name || !profileData.email}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              {isProfileSaving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                const savedProfile = localStorage.getItem('userProfile');
                if (savedProfile) {
                  setProfileData(JSON.parse(savedProfile));
                }
                toast({
                  title: "Changes Discarded",
                  description: "Your unsaved changes have been reverted.",
                });
              }}
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button onClick={() => setIsUploadFormOpen(true)} className="gap-2">
              <Upload className="h-4 w-4" />
              Upload Track
            </Button>
            <Avatar>
              <AvatarFallback>
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`bg-white border-r w-64 min-h-screen ${isSidebarOpen ? 'block' : 'hidden md:block'}`}>
          <nav className="p-6">
            <div className="space-y-2">
              <Button
                variant={activeTab === "overview" ? "default" : "ghost"}
                className="w-full justify-start gap-2"
                onClick={() => setActiveTab("overview")}
              >
                <BarChart3 className="h-4 w-4" />
                Overview
              </Button>
              <Button
                variant={activeTab === "tracks" ? "default" : "ghost"}
                className="w-full justify-start gap-2"
                onClick={() => setActiveTab("tracks")}
              >
                <Music className="h-4 w-4" />
                My Tracks
              </Button>
              <Button
                variant={activeTab === "analytics" ? "default" : "ghost"}
                className="w-full justify-start gap-2"
                onClick={() => setActiveTab("analytics")}
              >
                <TrendingUp className="h-4 w-4" />
                Analytics
              </Button>
              <Button
                variant={activeTab === "profile" ? "default" : "ghost"}
                className="w-full justify-start gap-2"
                onClick={() => setActiveTab("profile")}
              >
                <User className="h-4 w-4" />
                Profile
              </Button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === "overview" && renderOverview()}
          {activeTab === "tracks" && renderMyTracks()}
          {activeTab === "analytics" && renderAnalytics()}
          {activeTab === "profile" && renderProfile()}
        </main>
      </div>

      {/* Upload Form Modal */}
      <UploadForm 
        isOpen={isUploadFormOpen} 
        onClose={() => setIsUploadFormOpen(false)} 
      />
    </div>
  );
};

export default Dashboard;