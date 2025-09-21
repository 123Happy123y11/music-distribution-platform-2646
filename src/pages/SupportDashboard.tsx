import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  MessageCircle,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  Bot,
  User,
  Headphones,
  Phone,
  Mail,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

const SupportDashboard: React.FC = () => {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [agentStatus, setAgentStatus] = useState<'online' | 'busy' | 'offline'>('online');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { user } = useAuth();
  const { toast } = useToast();
  const {
    allSessions,
    supportAgents,
    queuedSessions,
    sendMessage,
    acceptChat,
    endSupportSession,
    updateAgentStatus
  } = useChat();

  // Find current agent (mock - in real app this would be based on authentication)
  const currentAgent = supportAgents.find(agent => agent.email === user?.email) || supportAgents[0];

  const activeSessions = allSessions.filter(session => 
    session.status === 'connected' && session.assignedSupport === currentAgent?.id
  );

  const selectedSessionData = selectedSession 
    ? allSessions.find(s => s.id === selectedSession)
    : null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedSessionData?.messages]);

  useEffect(() => {
    if (selectedSession) {
      inputRef.current?.focus();
    }
  }, [selectedSession]);

  // Update agent status when component mounts
  useEffect(() => {
    if (currentAgent) {
      updateAgentStatus(currentAgent.id, 'online');
    }
  }, []);

  const handleAcceptChat = (sessionId: string) => {
    if (!currentAgent) return;

    if (currentAgent.activeSessions.length >= currentAgent.maxSessions) {
      toast({
        title: "Cannot accept chat",
        description: "You have reached your maximum session limit.",
        variant: "destructive"
      });
      return;
    }

    acceptChat(sessionId, currentAgent.id);
    setSelectedSession(sessionId);
    
    toast({
      title: "Chat accepted",
      description: "You are now connected with the customer.",
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedSession || !currentAgent) return;

    sendMessage(message.trim(), 'support', currentAgent.name);
    setMessage('');
  };

  const handleEndSession = (sessionId: string) => {
    endSupportSession(sessionId);
    if (selectedSession === sessionId) {
      setSelectedSession(null);
    }
    
    toast({
      title: "Session ended",
      description: "The chat session has been closed.",
    });
  };

  const handleStatusChange = (status: 'online' | 'busy' | 'offline') => {
    if (currentAgent) {
      updateAgentStatus(currentAgent.id, status);
      setAgentStatus(status);
      
      toast({
        title: "Status updated",
        description: `You are now ${status}.`,
      });
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatDuration = (startTime: Date) => {
    const duration = Date.now() - startTime.getTime();
    const minutes = Math.floor(duration / 60000);
    return `${minutes}m`;
  };

  const getSessionPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6">
          <CardContent>
            <p>Please log in to access the support dashboard.</p>
            <Link to="/dashboard">
              <Button className="mt-4">Go to Dashboard</Button>
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
              <Link to="/dashboard" className="flex items-center text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Support Dashboard</h1>
                <p className="text-gray-600">Manage customer support conversations</p>
              </div>
            </div>

            {/* Agent Status */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{currentAgent?.name}</p>
                <p className="text-xs text-gray-600">{currentAgent?.email}</p>
              </div>
              <Select value={agentStatus} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-32">
                  <div className="flex items-center space-x-2">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      agentStatus === 'online' ? 'bg-green-500' :
                      agentStatus === 'busy' ? 'bg-yellow-500' : 'bg-gray-500'
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
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Left Sidebar - Session List */}
          <div className="lg:col-span-1">
            <Tabs defaultValue="queue" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="queue">
                  Queue ({queuedSessions.length})
                </TabsTrigger>
                <TabsTrigger value="active">
                  Active ({activeSessions.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="queue" className="mt-4">
                <div className="space-y-2">
                  {queuedSessions.length === 0 ? (
                    <Card>
                      <CardContent className="p-4 text-center">
                        <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">No customers in queue</p>
                      </CardContent>
                    </Card>
                  ) : (
                    queuedSessions.map((session) => (
                      <Card key={session.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4 text-gray-500" />
                              <span className="font-medium text-sm">{session.userName}</span>
                            </div>
                            <Badge variant="secondary" className={cn("text-xs", getSessionPriorityColor(session.priority))}>
                              {session.priority}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                            <span>Waiting {formatDuration(session.createdAt)}</span>
                            <span>{session.messages.length} msgs</span>
                          </div>
                          <Button 
                            size="sm" 
                            className="w-full"
                            onClick={() => handleAcceptChat(session.id)}
                            disabled={currentAgent && currentAgent.activeSessions.length >= currentAgent.maxSessions}
                          >
                            Accept Chat
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="active" className="mt-4">
                <div className="space-y-2">
                  {activeSessions.length === 0 ? (
                    <Card>
                      <CardContent className="p-4 text-center">
                        <MessageCircle className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">No active sessions</p>
                      </CardContent>
                    </Card>
                  ) : (
                    activeSessions.map((session) => (
                      <Card 
                        key={session.id}
                        className={cn(
                          "cursor-pointer transition-shadow",
                          selectedSession === session.id 
                            ? "ring-2 ring-purple-500 shadow-md"
                            : "hover:shadow-md"
                        )}
                        onClick={() => setSelectedSession(session.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full" />
                              <span className="font-medium text-sm">{session.userName}</span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {formatDuration(session.lastActivity)}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                            <span>{session.messages.length} messages</span>
                            <span>Priority: {session.priority}</span>
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSession(session.id);
                              }}
                            >
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEndSession(session.id);
                              }}
                            >
                              End
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Side - Chat Interface */}
          <div className="lg:col-span-3">
            {selectedSessionData ? (
              <Card className="h-full flex flex-col">
                {/* Chat Header */}
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <User className="w-8 h-8 bg-gray-100 rounded-full p-2" />
                      <div>
                        <CardTitle className="text-lg">{selectedSessionData.userName}</CardTitle>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Badge variant="outline" className={getSessionPriorityColor(selectedSessionData.priority)}>
                            {selectedSessionData.priority} priority
                          </Badge>
                          <span>•</span>
                          <span>Started {formatTime(selectedSessionData.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Phone className="w-4 h-4 mr-1" />
                        Call
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="w-4 h-4 mr-1" />
                        Email
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleEndSession(selectedSessionData.id)}
                      >
                        End Session
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 p-0">
                  <ScrollArea className="h-[400px] p-4">
                    <div className="space-y-4">
                      {selectedSessionData.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={cn(
                            "flex flex-col space-y-1",
                            msg.sender === 'support' ? "items-end" : "items-start"
                          )}
                        >
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            {msg.sender === 'user' && <User className="w-3 h-3" />}
                            {msg.sender === 'bot' && <Bot className="w-3 h-3" />}
                            {msg.sender === 'support' && <Headphones className="w-3 h-3" />}
                            <span>{msg.senderName}</span>
                            <span>{formatTime(msg.timestamp)}</span>
                          </div>
                          <div
                            className={cn(
                              "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                              msg.sender === 'support'
                                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                                : msg.sender === 'bot'
                                ? "bg-blue-50 text-gray-800 border border-blue-100"
                                : "bg-gray-100 text-gray-800"
                            )}
                          >
                            <div className="whitespace-pre-wrap">{msg.content}</div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </CardContent>

                {/* Message Input */}
                {selectedSessionData.status === 'connected' && (
                  <div className="p-4 border-t">
                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                      <Input
                        ref={inputRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your reply..."
                        className="flex-1"
                      />
                      <Button
                        type="submit"
                        disabled={!message.trim()}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                )}
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center">
                  <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-gray-600">Choose a queued or active session to start helping customers</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportDashboard;