import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Users,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  Settings,
  Search,
  MoreVertical,
  Eye,
  UserX,
  ShieldCheck,
  BarChart3,
  TrendingUp,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminChatPanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const { user } = useAuth();
  const { toast } = useToast();
  const {
    allSessions,
    supportAgents,
    queuedSessions,
    assignToSupport,
    endSupportSession,
    updateAgentStatus
  } = useChat();

  // Admin access check (in real app, this would be role-based)
  const isAdmin = user?.email?.includes('admin') || user?.name?.toLowerCase().includes('admin') || user?.name?.toLowerCase().includes('owner') || user?.email === 'test@example.com';

  const filteredSessions = allSessions.filter(session => {
    const matchesSearch = session.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         session.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAgent = selectedAgent === 'all' || session.assignedSupport === selectedAgent;
    const matchesStatus = selectedStatus === 'all' || session.status === selectedStatus;
    
    return matchesSearch && matchesAgent && matchesStatus;
  });

  const stats = {
    totalSessions: allSessions.length,
    activeSessions: allSessions.filter(s => s.status === 'connected').length,
    queuedSessions: queuedSessions.length,
    botSessions: allSessions.filter(s => s.status === 'bot').length,
    closedSessions: allSessions.filter(s => s.status === 'closed').length,
    onlineAgents: supportAgents.filter(a => a.status === 'online').length,
    totalAgents: supportAgents.length
  };

  const handleAssignToAgent = (sessionId: string, agentId: string) => {
    const agent = supportAgents.find(a => a.id === agentId);
    if (!agent) return;

    if (agent.activeSessions.length >= agent.maxSessions) {
      toast({
        title: "Cannot assign",
        description: "Agent has reached maximum session limit.",
        variant: "destructive"
      });
      return;
    }

    assignToSupport(sessionId, agentId);
    toast({
      title: "Session assigned",
      description: `Session assigned to ${agent.name}.`,
    });
  };

  const handleEndSession = (sessionId: string) => {
    endSupportSession(sessionId);
    toast({
      title: "Session ended",
      description: "Chat session has been closed.",
    });
  };

  const handleUpdateAgentStatus = (agentId: string, status: 'online' | 'busy' | 'offline') => {
    updateAgentStatus(agentId, status);
    const agent = supportAgents.find(a => a.id === agentId);
    toast({
      title: "Agent status updated",
      description: `${agent?.name} is now ${status}.`,
    });
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatDuration = (startTime: Date) => {
    const duration = Date.now() - startTime.getTime();
    const minutes = Math.floor(duration / 60000);
    const hours = Math.floor(minutes / 60);
    return hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'bot': return 'bg-blue-500';
      case 'queued': return 'bg-yellow-500';
      case 'connected': return 'bg-green-500';
      case 'closed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getAgentStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-100';
      case 'busy': return 'text-yellow-600 bg-yellow-100';
      case 'offline': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6">
          <CardContent className="text-center">
            <ShieldCheck className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">You need administrator privileges to access this panel.</p>
            <Link to="/dashboard">
              <Button>Return to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/admin" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Admin
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Chat Management</h1>
                <p className="text-gray-600">Monitor and manage live chat operations</p>
              </div>
            </div>
            <Badge variant="outline" className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Access</span>
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Sessions</p>
                  <p className="text-2xl font-bold">{stats.totalSessions}</p>
                </div>
                <MessageCircle className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Chats</p>
                  <p className="text-2xl font-bold text-green-600">{stats.activeSessions}</p>
                </div>
                <Activity className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">In Queue</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.queuedSessions}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Online Agents</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.onlineAgents}/{stats.totalAgents}</p>
                </div>
                <Users className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="sessions" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sessions">Chat Sessions</TabsTrigger>
            <TabsTrigger value="agents">Support Agents</TabsTrigger>
          </TabsList>

          <TabsContent value="sessions" className="mt-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search sessions by user name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by agent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Agents</SelectItem>
                  {supportAgents.map(agent => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="bot">Bot</SelectItem>
                  <SelectItem value="queued">Queued</SelectItem>
                  <SelectItem value="connected">Connected</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sessions Table */}
            <Card>
              <CardHeader>
                <CardTitle>Chat Sessions ({filteredSessions.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Agent
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Messages
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Duration
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredSessions.map((session) => {
                        const assignedAgent = supportAgents.find(a => a.id === session.assignedSupport);
                        return (
                          <tr key={session.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{session.userName}</div>
                                <div className="text-sm text-gray-500">ID: {session.id.split('-')[1]}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge className={cn("text-white", getStatusColor(session.status))}>
                                {session.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {assignedAgent ? assignedAgent.name : 'Unassigned'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {session.messages.length}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatDuration(session.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              {session.status === 'queued' && (
                                <Select onValueChange={(agentId) => handleAssignToAgent(session.id, agentId)}>
                                  <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Assign" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {supportAgents
                                      .filter(a => a.status === 'online' && a.activeSessions.length < a.maxSessions)
                                      .map(agent => (
                                        <SelectItem key={agent.id} value={agent.id}>
                                          {agent.name}
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                              )}
                              {(session.status === 'connected' || session.status === 'queued') && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEndSession(session.id)}
                                >
                                  End
                                </Button>
                              )}
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agents" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {supportAgents.map((agent) => (
                <Card key={agent.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{agent.name}</CardTitle>
                          <p className="text-sm text-gray-600">{agent.email}</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Status</span>
                        <Select
                          value={agent.status}
                          onValueChange={(status: 'online' | 'busy' | 'offline') => 
                            handleUpdateAgentStatus(agent.id, status)
                          }
                        >
                          <SelectTrigger className="w-24">
                            <div className="flex items-center space-x-2">
                              <div className={cn(
                                "w-2 h-2 rounded-full",
                                agent.status === 'online' ? 'bg-green-500' :
                                agent.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-500'
                              )} />
                              <SelectValue />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="online">Online</SelectItem>
                            <SelectItem value="busy">Busy</SelectItem>
                            <SelectItem value="offline">Offline</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Active Sessions</span>
                        <Badge variant="outline">
                          {agent.activeSessions.length} / {agent.maxSessions}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Capacity</span>
                          <span className="text-gray-900">
                            {Math.round((agent.activeSessions.length / agent.maxSessions) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={cn(
                              "h-2 rounded-full transition-all",
                              agent.activeSessions.length === agent.maxSessions
                                ? "bg-red-500"
                                : agent.activeSessions.length / agent.maxSessions > 0.7
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            )}
                            style={{
                              width: `${(agent.activeSessions.length / agent.maxSessions) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminChatPanel;