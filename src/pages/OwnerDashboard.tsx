import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Upload
} from 'lucide-react';

interface PlatformStats {
  totalUsers: number;
  totalTracks: number;
  totalRevenue: number;
  monthlyRevenue: number;
  activeTracks: number;
  totalStreams: number;
  platformGrowth: number;
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
  platformGrowth: 12.5
};

const mockRevenueData: RevenueData[] = [
  { platform: 'Spotify', revenue: 105850.45, percentage: 45.1, growth: 15.2 },
  { platform: 'Apple Music', revenue: 65743.21, percentage: 28.0, growth: 8.7 },
  { platform: 'YouTube Music', revenue: 35184.67, percentage: 15.0, growth: 22.3 },
  { platform: 'Amazon Music', revenue: 27789.56, percentage: 11.9, growth: 5.4 }
];

const OwnerDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'support' | 'user'>('user');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const { toast } = useToast();

  const stats = mockSystemStats;

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
              <p className="text-gray-600 mt-1">Manage users, roles, and system settings</p>
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
                  <p className="text-indigo-100 text-sm">Pending Releases</p>
                  <p className="text-2xl font-bold">{stats.pendingReleases}</p>
                </div>
                <Globe className="h-8 w-8 text-indigo-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
            <TabsTrigger value="settings">System Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            {/* Add User Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserPlus className="w-5 h-5 mr-2" />
                  Add New User
                </CardTitle>
                <CardDescription>
                  Add team members with specific roles and permissions
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
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage all users in the system
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
          </TabsContent>

          <TabsContent value="roles" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Roles & Permissions
                </CardTitle>
                <CardDescription>
                  Configure role permissions and access levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Owner Role */}
                  <div className="p-4 border rounded-lg bg-purple-50 border-purple-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Crown className="w-5 h-5 text-purple-600" />
                        <h3 className="font-semibold text-gray-900">Owner</h3>
                        <Badge className={getRoleColor('owner')}>Highest Level</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Full system access and control</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <span className="text-green-600">✓ User Management</span>
                      <span className="text-green-600">✓ Role Assignment</span>
                      <span className="text-green-600">✓ System Settings</span>
                      <span className="text-green-600">✓ Financial Access</span>
                      <span className="text-green-600">✓ Admin Controls</span>
                      <span className="text-green-600">✓ Support Management</span>
                      <span className="text-green-600">✓ Content Moderation</span>
                      <span className="text-green-600">✓ Platform Analytics</span>
                    </div>
                  </div>

                  {/* Admin Role */}
                  <div className="p-4 border rounded-lg bg-red-50 border-red-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Settings className="w-5 h-5 text-red-600" />
                        <h3 className="font-semibold text-gray-900">Administrator</h3>
                        <Badge className={getRoleColor('admin')}>High Level</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">System administration and user management</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <span className="text-green-600">✓ Content Moderation</span>
                      <span className="text-green-600">✓ User Support</span>
                      <span className="text-green-600">✓ Release Management</span>
                      <span className="text-green-600">✓ Basic Analytics</span>
                      <span className="text-red-600">✗ User Creation</span>
                      <span className="text-red-600">✗ Role Changes</span>
                      <span className="text-red-600">✗ System Settings</span>
                      <span className="text-red-600">✗ Financial Access</span>
                    </div>
                  </div>

                  {/* Support Role */}
                  <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <MessageSquare className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-gray-900">Support Agent</h3>
                        <Badge className={getRoleColor('support')}>Medium Level</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Customer support and assistance</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <span className="text-green-600">✓ Live Chat</span>
                      <span className="text-green-600">✓ Ticket Management</span>
                      <span className="text-green-600">✓ User Assistance</span>
                      <span className="text-green-600">✓ Basic User Info</span>
                      <span className="text-red-600">✗ Content Moderation</span>
                      <span className="text-red-600">✗ Release Management</span>
                      <span className="text-red-600">✗ User Management</span>
                      <span className="text-red-600">✗ System Access</span>
                    </div>
                  </div>

                  {/* User Role */}
                  <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Users className="w-5 h-5 text-green-600" />
                        <h3 className="font-semibold text-gray-900">User</h3>
                        <Badge className={getRoleColor('user')}>Basic Level</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Standard user with music distribution access</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <span className="text-green-600">✓ Music Upload</span>
                      <span className="text-green-600">✓ Track Management</span>
                      <span className="text-green-600">✓ Analytics View</span>
                      <span className="text-green-600">✓ Earnings Tracking</span>
                      <span className="text-red-600">✗ Admin Access</span>
                      <span className="text-red-600">✗ User Management</span>
                      <span className="text-red-600">✗ System Settings</span>
                      <span className="text-red-600">✗ Support Tools</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  System Settings
                </CardTitle>
                <CardDescription>
                  Configure platform-wide settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Platform Configuration</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>• User registration settings</p>
                      <p>• Upload limits and restrictions</p>
                      <p>• Payment processing configuration</p>
                      <p>• Email notification settings</p>
                    </div>
                    <Button variant="outline" size="sm" className="mt-3">Configure Platform</Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Security Settings</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>• Two-factor authentication</p>
                      <p>• Session management</p>
                      <p>• API access control</p>
                      <p>• Account security policies</p>
                    </div>
                    <Button variant="outline" size="sm" className="mt-3">Manage Security</Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Integration Settings</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>• Streaming platform APIs</p>
                      <p>• Payment gateway configuration</p>
                      <p>• Analytics tracking</p>
                      <p>• Third-party services</p>
                    </div>
                    <Button variant="outline" size="sm" className="mt-3">Configure Integrations</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OwnerDashboard;