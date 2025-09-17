import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Upload, 
  Music, 
  TrendingUp, 
  DollarSign, 
  Play, 
  Pause, 
  MoreHorizontal, 
  Calendar,
  Eye,
  Download,
  Edit,
  Trash2,
  Plus,
  Crown,
  Settings,
  HelpCircle,
  MessageSquare,
  BarChart3,
  Users,
  Globe,
  Menu,
  X
} from "lucide-react";
import UploadForm from "@/components/UploadForm";
import PlanUpgradeModal from "@/components/PlanUpgradeModal";
import { useTracksContext } from "@/contexts/TracksContext";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const [isUploadFormOpen, setIsUploadFormOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { getUserTracks } = useTracksContext();
  
  // Get user data safely
  let user = null;
  try {
    const authContext = useAuth();
    user = authContext?.user || null;
  } catch (error) {
    console.log('Auth context not available, using guest mode');
  }

  // Default user data if not authenticated
  const currentUser = user || {
    id: "guest",
    name: "Guest User",
    email: "guest@example.com",
    plan: "Free",
    avatar: "",
    joinDate: "Today"
  };

  // Get only the current user's tracks
  const userTracks = getUserTracks(currentUser.id || 'guest');

  // Calculate stats from user's tracks only
  const stats = {
    totalStreams: userTracks.reduce((sum, track) => sum + track.streams, 0),
    totalRevenue: userTracks.reduce((sum, track) => sum + track.revenue, 0),
    totalTracks: userTracks.length,
    avgStreamsPerTrack: userTracks.length > 0 ? Math.round(userTracks.reduce((sum, track) => sum + track.streams, 0) / userTracks.length) : 0
  };

  // Recent activity data based on user tracks
  const recentActivity = userTracks.slice(0, 5).map(track => ({
    type: 'upload',
    title: `${track.title} was uploaded`,
    time: '2 hours ago',
    status: track.status
  }));

  // Platform analytics mock data
  const platformData = [
    { name: 'Spotify', streams: Math.round(stats.totalStreams * 0.45), revenue: stats.totalRevenue * 0.45 },
    { name: 'Apple Music', streams: Math.round(stats.totalStreams * 0.28), revenue: stats.totalRevenue * 0.28 },
    { name: 'YouTube Music', streams: Math.round(stats.totalStreams * 0.15), revenue: stats.totalRevenue * 0.15 },
    { name: 'Amazon Music', streams: Math.round(stats.totalStreams * 0.12), revenue: stats.totalRevenue * 0.12 }
  ];

  const togglePlay = (trackId: string) => {
    setPlayingTrack(playingTrack === trackId ? null : trackId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-green-500";
      case "processing":
        return "bg-yellow-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "live":
        return "Live";
      case "processing":
        return "Processing";
      case "rejected":
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  // Sidebar navigation items
  const navigationItems = [
    { name: 'Overview', icon: BarChart3, current: true },
    { name: 'My Tracks', icon: Music, current: false },
    { name: 'Analytics', icon: TrendingUp, current: false },
    { name: 'Earnings', icon: DollarSign, current: false },
    { name: 'Profile', icon: Users, current: false },
    { name: 'Settings', icon: Settings, current: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform lg:translate-x-0 lg:static lg:inset-0 transition-transform duration-200 ease-in-out`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <span className="ml-2 text-lg font-semibold text-gray-900">SoundWave</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <a
                  key={item.name}
                  href="#"
                  className={`${
                    item.current
                      ? 'bg-purple-50 border-purple-500 text-purple-700'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-3 py-2 text-sm font-medium border-l-4 rounded-r-lg`}
                >
                  <IconComponent className="mr-3 h-5 w-5" />
                  {item.name}
                </a>
              );
            })}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="space-y-2">
              <Link
                to="/help"
                className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent rounded-r-lg"
              >
                <HelpCircle className="mr-3 h-5 w-5" />
                Help Center
              </Link>
              <Link
                to="/support"
                className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent rounded-r-lg"
              >
                <MessageSquare className="mr-3 h-5 w-5" />
                Support
              </Link>
              <Link
                to="/admin"
                className="group flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 border-l-4 border-transparent rounded-r-lg"
              >
                <Settings className="mr-3 h-5 w-5" />
                Admin Panel
              </Link>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:pl-0">
        {/* Top Navigation */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="w-5 h-5" />
                </Button>
                
                <div className="flex items-center ml-4 lg:ml-0">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={currentUser.avatar} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      {currentUser.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Welcome back, {currentUser.name}</p>
                    <p className="text-xs text-gray-500">{currentUser.plan} Plan</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Button 
                  onClick={() => setIsUpgradeModalOpen(true)}
                  variant="outline"
                  size="sm"
                  className="hidden sm:flex"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade
                </Button>
                <Button 
                  onClick={() => setIsUploadFormOpen(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Total Streams</p>
                    <p className="text-2xl font-bold">{stats.totalStreams.toLocaleString()}</p>
                  </div>
                  <Play className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Total Revenue</p>
                    <p className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Active Tracks</p>
                    <p className="text-2xl font-bold">{stats.totalTracks}</p>
                  </div>
                  <Music className="h-8 w-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100">Avg. Streams</p>
                    <p className="text-2xl font-bold">{stats.avgStreamsPerTrack.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Tracks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Music className="w-5 h-5 mr-2" />
                  Recent Tracks
                </CardTitle>
                <CardDescription>Your latest uploads and their performance</CardDescription>
              </CardHeader>
              <CardContent>
                {userTracks.length > 0 ? (
                  <div className="space-y-4">
                    {userTracks.slice(0, 5).map((track) => (
                      <div key={track.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => togglePlay(track.id)}
                            className="w-8 h-8"
                          >
                            {playingTrack === track.id ? (
                              <Pause className="w-3 h-3" />
                            ) : (
                              <Play className="w-3 h-3" />
                            )}
                          </Button>
                          <div>
                            <p className="font-medium text-gray-900">{track.title}</p>
                            <p className="text-sm text-gray-500">{track.artist}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium">{track.streams.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">streams</p>
                          </div>
                          <Badge 
                            className={`${getStatusColor(track.status)} text-white`}
                            variant="secondary"
                          >
                            {getStatusText(track.status)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Music className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tracks yet</h3>
                    <p className="text-gray-600 mb-4">Upload your first track to get started</p>
                    <Button onClick={() => setIsUploadFormOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Upload Track
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Platform Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Platform Performance
                </CardTitle>
                <CardDescription>How your music performs across platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {platformData.map((platform, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{platform.name}</span>
                        <span className="text-sm text-gray-500">{platform.streams.toLocaleString()} streams</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${stats.totalStreams > 0 ? (platform.streams / stats.totalStreams) * 100 : 0}%` 
                          }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">
                        ${platform.revenue.toFixed(2)} revenue
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest actions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivity.length > 0 ? (
                <div className="flow-root">
                  <ul className="-mb-8">
                    {recentActivity.map((activity, activityIdx) => (
                      <li key={activityIdx}>
                        <div className="relative pb-8">
                          {activityIdx !== recentActivity.length - 1 ? (
                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                              <Music className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div>
                                <p className="text-sm text-gray-900">{activity.title}</p>
                                <p className="text-sm text-gray-500">{activity.time}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4">No recent activity</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}



      {/* Upload Form Modal */}
      <UploadForm 
        isOpen={isUploadFormOpen} 
        onClose={() => setIsUploadFormOpen(false)} 
        userId={currentUser.id || 'guest'}
      />

      {/* Plan Upgrade Modal */}
      <PlanUpgradeModal 
        isOpen={isUpgradeModalOpen} 
        onClose={() => setIsUpgradeModalOpen(false)} 
      />
    </div>
  );
};

export default Dashboard;
