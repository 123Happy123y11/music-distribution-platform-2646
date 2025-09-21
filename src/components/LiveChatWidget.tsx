import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useChat } from '@/contexts/ChatContext';
import { useAuth } from '@/contexts/AuthContext';
import { MessageCircle, X, Send, Bot, User, Headphones, Clock, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const LiveChatWidget: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { user } = useAuth();
  const { 
    currentSession, 
    isChatOpen, 
    startChat, 
    sendMessage, 
    requestHumanSupport, 
    closeChat, 
    openChat 
  } = useChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!isMinimized) {
      scrollToBottom();
    }
  }, [currentSession?.messages, isMinimized]);

  useEffect(() => {
    if (!isMinimized) {
      inputRef.current?.focus();
    }
  }, [isMinimized]);

  const handleStartChat = () => {
    if (!user) return;
    
    if (!currentSession) {
      startChat(user.id, user.name);
    } else {
      openChat();
    }
    setIsMinimized(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentSession) return;

    sendMessage(message.trim(), 'user');
    setMessage('');
  };

  const handleRequestSupport = () => {
    requestHumanSupport();
  };

  const handleCloseChat = () => {
    closeChat();
    setIsMinimized(true);
  };

  const getStatusInfo = () => {
    if (!currentSession) return null;

    switch (currentSession.status) {
      case 'bot':
        return {
          icon: <Bot className="w-4 h-4" />,
          text: 'AI Assistant',
          color: 'bg-blue-500'
        };
      case 'queued':
        return {
          icon: <Clock className="w-4 h-4" />,
          text: 'In Queue',
          color: 'bg-yellow-500'
        };
      case 'connected':
        return {
          icon: <Headphones className="w-4 h-4" />,
          text: 'Support Agent',
          color: 'bg-green-500'
        };
      default:
        return null;
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Show floating button when minimized
  if (isMinimized || !isChatOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={handleStartChat}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
        {currentSession && currentSession.status === 'queued' && (
          <Badge className="absolute -top-2 -left-2 bg-yellow-500 text-white animate-pulse">
            Queue
          </Badge>
        )}
        {currentSession && currentSession.status === 'connected' && (
          <Badge className="absolute -top-2 -left-2 bg-green-500 text-white">
            Live
          </Badge>
        )}
      </div>
    );
  }

  const statusInfo = getStatusInfo();

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] max-h-[80vh]">
      <Card className="h-full flex flex-col shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        {/* Header */}
        <CardHeader className="pb-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <div>
                <h3 className="font-semibold text-sm">SoundWave Support</h3>
                {statusInfo && (
                  <div className="flex items-center space-x-1 text-xs opacity-90">
                    <div className={cn("w-2 h-2 rounded-full", statusInfo.color)} />
                    <span>{statusInfo.text}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
                className="h-6 w-6 p-0 text-white hover:bg-white/20"
              >
                <Users className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseChat}
                className="h-6 w-6 p-0 text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-full p-4">
            <div className="space-y-4">
              {currentSession?.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex flex-col space-y-1",
                    msg.sender === 'user' ? "items-end" : "items-start"
                  )}
                >
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    {msg.sender === 'user' && <User className="w-3 h-3" />}
                    {msg.sender === 'bot' && <Bot className="w-3 h-3" />}
                    {msg.sender === 'support' && <Headphones className="w-3 h-3" />}
                    <span>{msg.senderName || (msg.sender === 'user' ? user?.name : 'Assistant')}</span>
                    <span>{formatTime(msg.timestamp)}</span>
                  </div>
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                      msg.sender === 'user'
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                        : msg.sender === 'bot'
                        ? "bg-blue-50 text-gray-800 border border-blue-100"
                        : "bg-green-50 text-gray-800 border border-green-100"
                    )}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                </div>
              ))}
              
              {currentSession?.status === 'bot' && currentSession.messages.length > 1 && (
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRequestSupport}
                    className="text-xs"
                  >
                    <Headphones className="w-3 h-3 mr-1" />
                    Speak to Support Agent
                  </Button>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>

        {/* Input */}
        {currentSession && currentSession.status !== 'closed' && (
          <div className="p-4 border-t bg-gray-50">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <Input
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  currentSession.status === 'queued'
                    ? "You're in queue. Please wait..."
                    : "Type your message..."
                }
                disabled={currentSession.status === 'queued'}
                className="flex-1"
              />
              <Button
                type="submit"
                size="sm"
                disabled={!message.trim() || currentSession.status === 'queued'}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        )}

        {/* Queue status */}
        {currentSession?.status === 'queued' && (
          <div className="px-4 py-2 bg-yellow-50 border-t border-yellow-200">
            <div className="flex items-center space-x-2 text-sm text-yellow-800">
              <Clock className="w-4 h-4 animate-spin" />
              <span>Waiting for next available agent...</span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default LiveChatWidget;