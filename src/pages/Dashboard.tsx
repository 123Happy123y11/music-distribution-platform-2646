import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IntercomSetup } from "@/components/IntercomSetup";
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
  X,
  Headphones
} from "lucide-react";
import UploadForm from "@/components/UploadForm";
import PlanUpgradeModal from "@/components/PlanUpgradeModal";
import { EditTrackModal } from "@/components/EditTrackModal";
import { useTracksContext } from "@/contexts/TracksContext";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const [isUploadFormOpen, setIsUploadFormOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTrackForEdit, setSelectedTrackForEdit] = useState(null);
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Overview');
  const { getUserTracks, deleteTrack } = useTracksContext();
  
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

  // Handle track deletion
  const handleDeleteTrack = (trackId: string) => {
    if (window.confirm('Are you sure you want to delete this track? This action cannot be undone.')) {
      deleteTrack(trackId);
    }
  };

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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <>
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

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest uploads and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentActivity.length > 0 ? (
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(activity.status)}`}></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Music className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No recent activity</p>
                      <Button 
                        onClick={() => setIsUploadFormOpen(true)}
                        variant="outline"
                        size="sm"
                        className="mt-2"
                      >
                        Upload Your First Track
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Platform Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle>Platform Performance</CardTitle>
                  <CardDescription>Streams across different platforms</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {platformData.map((platform, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">{platform.name}</span>
                          <span className="text-gray-600">{platform.streams.toLocaleString()} streams</span>
                        </div>
                        <Progress value={platform.streams / stats.totalStreams * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        );

      case 'My Tracks':
        return (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Music Library</CardTitle>
                  <CardDescription>Manage and track your uploaded music</CardDescription>
                </div>
                <Button 
                  onClick={() => setIsUploadFormOpen(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Track
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {userTracks.length > 0 ? (
                <div className="space-y-4">
                  {userTracks.map((track) => (
                    <div key={track.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => togglePlay(track.id)}
                        >
                          {playingTrack === track.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{track.title}</h3>
                          <p className="text-gray-600">{track.artist}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{track.streams.toLocaleString()} streams</p>
                          <p className="text-sm text-gray-500">${track.revenue.toFixed(2)} earned</p>
                        </div>
                        <Badge className={`${getStatusColor(track.status)} text-white`}>
                          {getStatusText(track.status)}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedTrackForEdit(track);
                                setIsEditModalOpen(true);
                              }}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Track
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteTrack(track.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Track
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Music className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No tracks uploaded yet</h3>
                  <p className="text-gray-600 mb-6">Upload your first track to start distributing your music</p>
                  <Button 
                    onClick={() => setIsUploadFormOpen(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Your First Track
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 'Analytics':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Streaming Analytics</CardTitle>
                <CardDescription>Detailed insights into your music performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-blue-50 rounded-lg">
                    <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">{stats.totalStreams.toLocaleString()}</p>
                    <p className="text-sm text-blue-600">Total Streams</p>
                  </div>
                  <div className="text-center p-6 bg-green-50 rounded-lg">
                    <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">{Math.round(stats.totalStreams * 0.7).toLocaleString()}</p>
                    <p className="text-sm text-green-600">Unique Listeners</p>
                  </div>
                  <div className="text-center p-6 bg-purple-50 rounded-lg">
                    <Globe className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-600">42</p>
                    <p className="text-sm text-purple-600">Countries</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Breakdown</CardTitle>
                <CardDescription>Performance across streaming platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {platformData.map((platform, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{platform.name}</p>
                        <p className="text-sm text-gray-500">{platform.streams.toLocaleString()} streams • ${platform.revenue.toFixed(2)} revenue</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{((platform.streams / stats.totalStreams) * 100).toFixed(1)}%</p>
                        <Progress value={(platform.streams / stats.totalStreams) * 100} className="w-24 h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'Earnings':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="p-6">
                  <div className="text-center">
                    <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-200" />
                    <p className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
                    <p className="text-green-100">Total Earnings</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-2xl font-bold text-gray-900">${(stats.totalRevenue * 0.3).toFixed(2)}</p>
                    <p className="text-gray-600">This Month</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-2xl font-bold text-gray-900">${(stats.totalRevenue * 0.15).toFixed(2)}</p>
                    <p className="text-gray-600">This Week</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Earnings</CardTitle>
                <CardDescription>Your latest royalty payments</CardDescription>
              </CardHeader>
              <CardContent>
                {userTracks.length > 0 ? (
                  <div className="space-y-4">
                    {userTracks.slice(0, 5).map((track, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{track.title}</p>
                          <p className="text-sm text-gray-500">{track.streams.toLocaleString()} streams</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">${track.revenue.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">Dec 2024</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No earnings yet</p>
                    <p className="text-sm text-gray-400">Upload music to start earning royalties</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case 'Profile':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Artist Profile</CardTitle>
              <CardDescription>Manage your artist information and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center space-x-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={currentUser.avatar} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl">
                      {currentUser.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{currentUser.name}</h3>
                    <p className="text-gray-600">{currentUser.email}</p>
                    <Badge className="mt-2">{currentUser.plan} Plan</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Account Statistics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Member since:</span>
                        <span className="font-medium">{currentUser.joinDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total tracks:</span>
                        <span className="font-medium">{stats.totalTracks}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total streams:</span>
                        <span className="font-medium">{stats.totalStreams.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Quick Actions</h4>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Settings className="w-4 h-4 mr-2" />
                        Account Settings
                      </Button>
                      <Button variant="outline" className="w-full justify-start" onClick={() => setIsUpgradeModalOpen(true)}>
                        <Crown className="w-4 h-4 mr-2" />
                        Upgrade Plan
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'Settings':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences and settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Email notifications</p>
                        <p className="text-sm text-gray-600">Receive updates about your releases</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Payment settings</p>
                        <p className="text-sm text-gray-600">Manage how you receive royalties</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Privacy settings</p>
                        <p className="text-sm text-gray-600">Control your profile visibility</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Account Actions</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="w-4 h-4 mr-2" />
                      Download My Data
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'Support':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <IntercomSetup />
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5" />
                    Quick Help
                  </CardTitle>
                  <CardDescription>Common questions and resources</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to="/help" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Visit Help Center
                    </Button>
                  </Link>
                  <Link to="/support" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contact Support
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return <div>Select a tab from the sidebar</div>;
    }
  };

  // Sidebar navigation items
  const navigationItems = [
    { name: 'Overview', icon: BarChart3 },
    { name: 'My Tracks', icon: Music },
    { name: 'Analytics', icon: TrendingUp },
    { name: 'Earnings', icon: DollarSign },
    { name: 'Profile', icon: Users },
    { name: 'Support', icon: MessageSquare },
    { name: 'Settings', icon: Settings },
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
            <span className="ml-2 text-lg font-semibold text-gray-900">Tune Tracks</span>
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
                <button
                  key={item.name}
                  onClick={() => setActiveTab(item.name)}
                  className={`${
                    activeTab === item.name
                      ? 'bg-purple-50 border-purple-500 text-purple-700'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } w-full group flex items-center px-3 py-2 text-sm font-medium border-l-4 rounded-r-lg transition-colors`}
                >
                  <IconComponent className="mr-3 h-5 w-5" />
                  {item.name}
                </button>
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
              {(currentUser.email?.includes('support') || currentUser.email?.includes('admin')) && (
                <Link
                  to="/support/dashboard"
                  className="group flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 hover:text-blue-700 border-l-4 border-transparent rounded-r-lg"
                >
                  <Headphones className="mr-3 h-5 w-5" />
                  Support Team
                </Link>
              )}
              {currentUser.email?.includes('admin') && (
                <Link
                  to="/admin"
                  className="group flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 border-l-4 border-transparent rounded-r-lg"
                >
                  <Settings className="mr-3 h-5 w-5" />
                  Admin Panel
                </Link>
              )}
              {(currentUser.email?.includes('admin') || currentUser.name?.toLowerCase().includes('owner')) && (
                <Link
                  to="/owner"
                  className="group flex items-center px-3 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 hover:text-purple-700 border-l-4 border-transparent rounded-r-lg"
                >
                  <Crown className="mr-3 h-5 w-5" />
                  Owner Dashboard
                </Link>
              )}
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
          {/* Tab Content */}
          {renderTabContent()}
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

      {/* Edit Track Modal */}
      <EditTrackModal 
        track={selectedTrackForEdit} 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTrackForEdit(null);
        }}
      />
    </div>
  );
};

export default Dashboard;
