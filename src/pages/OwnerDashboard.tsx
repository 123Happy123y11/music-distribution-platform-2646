import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Users,
  Crown,
  Settings,
  BarChart3,
  DollarSign,
  Music,
  ArrowLeft,
  Globe,
  Activity,
  TrendingUp,
  Calendar,
  Download,
  Upload,
  UserPlus,
  Shield,
  Mail,
  Eye,
  EyeOff,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  Server,
  Database
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'support' | 'owner';
  status: 'active' | 'inactive' | 'suspended';
  joinDate: string;
  lastActive: string;
  totalTracks?: number;
  totalStreams?: number;
  totalRevenue?: number;
  avatar?: string;
}

interface PlatformStats {
  totalUsers: number;
  totalTracks: number;
  totalRevenue: number;
  monthlyRevenue: number;
  activeTracks: number;
  totalStreams: number;
  platformGrowth: number;
  activeSessions: number;
  supportTickets: number;
  pendingReleases: number;
  serverUptime: number;
  storageUsed: number;
}

interface RevenueData {
  platform: string;
  revenue: number;
  percentage: number;
  growth: number;
}

const mockPlatformStats: PlatformStats = {
  totalUsers: 15847,
  totalTracks: 89342,
  totalRevenue: 234567.89,
  monthlyRevenue: 28540.32,
  activeTracks: 78921,
  totalStreams: 15234567,
  platformGrowth: 12.5,
  activeSessions: 1543,
  supportTickets: 23,
  pendingReleases: 45,
  serverUptime: 99.9,
  storageUsed: 75.2
};

const mockRevenueData: RevenueData[] = [
  { platform: 'Spotify', revenue: 105850.45, percentage: 45.1, growth: 15.2 },
  { platform: 'Apple Music', revenue: 65743.21, percentage: 28.0, growth: 8.7 },
  { platform: 'YouTube Music', revenue: 35184.67, percentage: 15.0, growth: 22.3 },
  { platform: 'Amazon Music', revenue: 27789.56, percentage: 11.9, growth: 5.4 }
];

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
    role: 'admin',
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
  },
  {
    id: '4',
    name: 'Emily Admin',
    email: 'emily@tunetracks.com',
    role: 'admin',
    status: 'active',
    joinDate: '2023-12-01',
    lastActive: '30 minutes ago'
  },
  {
    id: '5',
    name: 'Support Agent',
    email: 'support@tunetracks.com',
    role: 'support',
    status: 'active',
    joinDate: '2024-01-01',
    lastActive: '15 minutes ago'
  }
];

const OwnerDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'support' | 'user'>('user');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  const stats = mockPlatformStats;

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddUser = () => {
    if (!newUserEmail || !newUserName) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
      lastActive: 'Just now',
      avatar: undefined
    };

    setUsers([...users, newUser]);
    setNewUserEmail('');
    setNewUserName('');
    setNewUserRole('user');

    toast({
      title: "User Added",
      description: `${newUser.name} has been added as ${newUser.role}`,
    });
  };

  const handleDeleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user?.role === 'owner') {
      toast({
        title: "Cannot Delete",
        description: "Cannot delete owner account",
        variant: "destructive"
      });
      return;
    }

    setUsers(users.filter(u => u.id !== userId));
    toast({
      title: "User Deleted",
      description: "User has been removed from the system",
    });
  };

  const handleToggleUserStatus = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user?.role === 'owner') {
      toast({
        title: "Cannot Modify",
        description: "Cannot modify owner account status",
        variant: "destructive"
      });
      return;
    }

    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'suspended' : 'active' }
        : user
    ));
    
    const updatedUser = users.find(u => u.id === userId);
    toast({
      title: "Status Updated",
      description: `User ${updatedUser?.status === 'active' ? 'suspended' : 'activated'}`,
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'owner': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'support': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'user': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'inactive': return <Clock className="w-4 h-4" />;
      case 'suspended': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Owner Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Complete platform management and business analytics</p>
            </div>
          </div>
          <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-700">
            <Crown className="w-4 h-4 mr-2" />
            Owner Access
          </Badge>
        </div>

        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Total Tracks</p>
                  <p className="text-2xl font-bold">{stats.totalTracks.toLocaleString()}</p>
                </div>
                <Music className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Revenue</p>
                  <p className="text-2xl font-bold">${(stats.totalRevenue / 1000).toFixed(0)}K</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Active Sessions</p>
                  <p className="text-2xl font-bold">{stats.activeSessions.toLocaleString()}</p>
                </div>
                <Activity className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-100 text-sm">Support Tickets</p>
                  <p className="text-2xl font-bold">{stats.supportTickets}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-teal-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm">Server Uptime</p>
                  <p className="text-2xl font-bold">{stats.serverUptime}%</p>
                </div>
                <Server className="h-8 w-8 text-indigo-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 mb-8 bg-white p-2 rounded-lg border">
          <Button 
            variant={activeTab === "overview" ? "default" : "ghost"}
            onClick={() => setActiveTab("overview")}
            className="flex items-center"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </Button>
          <Button 
            variant={activeTab === "users" ? "default" : "ghost"}
            onClick={() => setActiveTab("users")}
            className="flex items-center"
          >
            <Users className="w-4 h-4 mr-2" />
            User Management
          </Button>
          <Button 
            variant={activeTab === "analytics" ? "default" : "ghost"}
            onClick={() => setActiveTab("analytics")}
            className="flex items-center"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Business Analytics
          </Button>
          <Button 
            variant={activeTab === "system" ? "default" : "ghost"}
            onClick={() => setActiveTab("system")}
            className="flex items-center"
          >
            <Settings className="w-4 h-4 mr-2" />
            System Settings
          </Button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Server Uptime</span>
                    <span className="text-green-600 font-bold">{stats.serverUptime}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Storage Used</span>
                    <span className="text-blue-600 font-bold">{stats.storageUsed}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Sessions</span>
                    <span className="text-purple-600 font-bold">{stats.activeSessions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Platform Growth</span>
                    <span className="text-green-600 font-bold">+{stats.platformGrowth}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockRevenueData.map((platform) => (
                    <div key={platform.platform} className="flex justify-between items-center">
                      <span className="text-sm">{platform.platform}</span>
                      <div className="text-right">
                        <div className="font-bold">${platform.revenue.toFixed(0)}</div>
                        <div className="text-xs text-green-600">+{platform.growth}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-blue-600">
                    <Users className="w-4 h-4 mr-2" />
                    15 new users registered today
                  </div>
                  <div className="flex items-center text-green-600">
                    <Music className="w-4 h-4 mr-2" />
                    23 tracks uploaded today
                  </div>
                  <div className="flex items-center text-purple-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    $1,234 revenue generated today
                  </div>
                  <div className="flex items-center text-orange-600">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    3 new support tickets
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* User Management Tab */}
        {activeTab === "users" && (
          <div className="space-y-6">
            {/* Add User Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserPlus className="w-5 h-5 mr-2" />
                  Add New Team Member
                </CardTitle>
                <CardDescription>
                  Add administrators, support agents, or grant special access
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Full name"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="user@example.com"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select value={newUserRole} onValueChange={(value: 'admin' | 'support' | 'user') => setNewUserRole(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="support">Support Agent</SelectItem>
                        <SelectItem value="admin">Administrator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleAddUser} className="w-full">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add User
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User List */}
            <Card>
              <CardHeader>
                <CardTitle>Team & User Management</CardTitle>
                <CardDescription>
                  Manage all platform users and team members
                </CardDescription>
                
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="owner">Owner</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="support">Support Agent</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-gray-900">{user.name}</h3>
                            <Badge className={`text-xs ${getRoleColor(user.role)}`}>
                              {user.role}
                            </Badge>
                            <Badge className={`text-xs ${getStatusColor(user.status)}`}>
                              {getStatusIcon(user.status)}
                              <span className="ml-1">{user.status}</span>
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <span className="flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {user.email}
                            </span>
                            <span>Joined: {user.joinDate}</span>
                            <span>Last active: {user.lastActive}</span>
                            {user.totalRevenue && (
                              <span className="text-green-600">${user.totalRevenue.toFixed(2)} earned</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {user.role !== 'owner' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleUserStatus(user.id)}
                              className={user.status === 'suspended' ? 'text-green-600' : 'text-yellow-600'}
                            >
                              {user.status === 'suspended' ? (
                                <>
                                  <Eye className="w-4 h-4 mr-2" />
                                  Activate
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-4 h-4 mr-2" />
                                  Suspend
                                </>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Business Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="font-medium">Total Revenue</span>
                    <span className="text-2xl font-bold text-green-600">${stats.totalRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b">
                    <span className="font-medium">Monthly Revenue</span>
                    <span className="text-2xl font-bold text-blue-600">${stats.monthlyRevenue.toLocaleString()}</span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-4">Platform Distribution</h4>
                    {mockRevenueData.map((platform) => (
                      <div key={platform.platform} className="flex justify-between items-center mb-3">
                        <span>{platform.platform}</span>
                        <div className="text-right">
                          <div className="font-bold">${platform.revenue.toLocaleString()}</div>
                          <div className="text-sm text-gray-500">{platform.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Streams</span>
                    <span className="font-bold">{stats.totalStreams.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Tracks</span>
                    <span className="font-bold">{stats.activeTracks.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Growth</span>
                    <span className="font-bold text-green-600">+{stats.platformGrowth}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>User Retention</span>
                    <span className="font-bold text-blue-600">87.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg. Revenue per User</span>
                    <span className="font-bold">${(stats.totalRevenue / stats.totalUsers).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Support Satisfaction</span>
                    <span className="font-bold text-green-600">94.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{stats.serverUptime}%</div>
                    <div className="text-sm text-gray-500">Server Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{stats.storageUsed}%</div>
                    <div className="text-sm text-gray-500">Storage Used</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">{stats.activeSessions}</div>
                    <div className="text-sm text-gray-500">Active Sessions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">{stats.supportTickets}</div>
                    <div className="text-sm text-gray-500">Open Tickets</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* System Settings Tab */}
        {activeTab === "system" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Platform Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">User Registration</h3>
                    <p className="text-sm text-gray-600 mb-3">Control new user registration settings</p>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Upload Limits</h3>
                    <p className="text-sm text-gray-600 mb-3">Set file size and format restrictions</p>
                    <Button variant="outline" size="sm">Manage Limits</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Payment Processing</h3>
                    <p className="text-sm text-gray-600 mb-3">Configure payment gateways and fees</p>
                    <Button variant="outline" size="sm">Setup Payments</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Security & Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-600 mb-3">Enforce 2FA for admin accounts</p>
                    <Button variant="outline" size="sm">Enable 2FA</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Session Management</h3>
                    <p className="text-sm text-gray-600 mb-3">Control user session timeouts</p>
                    <Button variant="outline" size="sm">Configure Sessions</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">API Access Control</h3>
                    <p className="text-sm text-gray-600 mb-3">Manage API keys and rate limits</p>
                    <Button variant="outline" size="sm">Manage APIs</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Platform Integrations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Streaming Platforms</h3>
                    <p className="text-sm text-gray-600 mb-3">Configure distribution APIs</p>
                    <Button variant="outline" size="sm">Manage Platforms</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Analytics Tracking</h3>
                    <p className="text-sm text-gray-600 mb-3">Setup analytics and reporting</p>
                    <Button variant="outline" size="sm">Configure Analytics</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Third-Party Services</h3>
                    <p className="text-sm text-gray-600 mb-3">Integrate external services</p>
                    <Button variant="outline" size="sm">Manage Services</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  System Maintenance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Database Backup</h3>
                    <p className="text-sm text-gray-600 mb-3">Schedule automated backups</p>
                    <Button variant="outline" size="sm">Configure Backups</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Server Monitoring</h3>
                    <p className="text-sm text-gray-600 mb-3">Monitor server performance</p>
                    <Button variant="outline" size="sm">View Monitoring</Button>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">System Updates</h3>
                    <p className="text-sm text-gray-600 mb-3">Manage platform updates</p>
                    <Button variant="outline" size="sm">Check Updates</Button>
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

export default OwnerDashboard;