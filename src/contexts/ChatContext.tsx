import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot' | 'support';
  timestamp: Date;
  senderName?: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  userName: string;
  status: 'bot' | 'queued' | 'connected' | 'closed';
  messages: ChatMessage[];
  assignedSupport?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  lastActivity: Date;
}

export interface SupportAgent {
  id: string;
  name: string;
  email: string;
  status: 'online' | 'busy' | 'offline';
  activeSessions: string[];
  maxSessions: number;
}

interface ChatContextType {
  // User chat state
  currentSession: ChatSession | null;
  isChatOpen: boolean;
  
  // Admin/Support state
  allSessions: ChatSession[];
  supportAgents: SupportAgent[];
  queuedSessions: ChatSession[];
  
  // Actions
  startChat: (userId: string, userName: string) => void;
  sendMessage: (content: string, sender: 'user' | 'bot' | 'support', senderName?: string) => void;
  requestHumanSupport: () => void;
  assignToSupport: (sessionId: string, agentId: string) => void;
  closeChat: () => void;
  openChat: () => void;
  
  // Support actions
  acceptChat: (sessionId: string, agentId: string) => void;
  endSupportSession: (sessionId: string) => void;
  updateAgentStatus: (agentId: string, status: 'online' | 'busy' | 'offline') => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Mock support agents
const mockSupportAgents: SupportAgent[] = [
  {
    id: 'agent-1',
    name: 'Sarah Johnson',
    email: 'sarah@soundwave.com',
    status: 'online',
    activeSessions: [],
    maxSessions: 3
  },
  {
    id: 'agent-2',
    name: 'Mike Chen',
    email: 'mike@soundwave.com',
    status: 'online',
    activeSessions: [],
    maxSessions: 3
  },
  {
    id: 'agent-3',
    name: 'Emma Rodriguez',
    email: 'emma@soundwave.com',
    status: 'busy',
    activeSessions: ['session-1', 'session-2'],
    maxSessions: 2
  }
];

// AI Bot knowledge base from help center
const helpCenterKnowledge = {
  "getting started": {
    keywords: ["start", "begin", "new", "first", "setup", "account"],
    response: "Welcome to SoundWave! I can help you get started. Here are the basics:\n\n1. **Set up your profile** with accurate artist information\n2. **Upload your first track** using WAV or FLAC format\n3. **Add artwork** (3000x3000 pixels)\n4. **Fill in metadata** completely\n5. **Choose your release date**\n\nYour music will appear on 150+ platforms within 24-48 hours. Would you like more details about any of these steps?"
  },
  "upload": {
    keywords: ["upload", "file", "format", "audio", "wav", "mp3", "quality"],
    response: "For uploading music, here are the requirements:\n\n**Supported formats:**\n• WAV (44.1kHz/16-bit minimum) ✅\n• FLAC (lossless, preferred) ✅\n• MP3 (320kbps minimum) ⚠️\n\n**Quality specs:**\n• Maximum 500MB per track\n• Maximum 30 minutes length\n• No clipping or distortion\n\n**Artwork requirements:**\n• Exactly 3000x3000 pixels\n• RGB color mode\n• JPG or PNG format\n\nNeed help with a specific upload issue?"
  },
  "royalties": {
    keywords: ["pay", "payment", "royalty", "money", "earnings", "revenue"],
    response: "Here's how royalties work on SoundWave:\n\n**Payment schedule:**\n• Monthly payments by the 15th\n• 2-month delay for processing\n• Minimum thresholds: $10 (PayPal), $50 (Bank)\n\n**Revenue share:**\n• Free plan: Keep 85% of royalties\n• Paid plans: Keep 100% of royalties\n\n**Streaming rates vary by platform:**\n• Spotify: ~$0.003-0.005 per stream\n• Apple Music: ~$0.01 per stream\n• YouTube Music: ~$0.008 per stream\n\nWould you like details about payment methods or maximizing revenue?"
  },
  "distribution": {
    keywords: ["platform", "spotify", "apple", "distribute", "streaming", "when", "live"],
    response: "Your music distributes to 150+ platforms:\n\n**Major platforms & timing:**\n• Spotify, Apple Music: 24-48 hours ⚡\n• YouTube Music, Amazon: 48-72 hours\n• Secondary platforms: Up to 1 week\n\n**What's included:**\n• All major streaming services\n• Digital stores (iTunes, Amazon MP3)\n• Social platforms (TikTok, Instagram)\n• International/regional platforms\n\n**Tips for success:**\n• Submit playlist pitches 4+ weeks early\n• Use consistent metadata across platforms\n• Plan your release strategy\n\nHaving issues with a specific platform?"
  },
  "support": {
    keywords: ["help", "support", "problem", "issue", "error", "human", "agent", "person"],
    response: "I'm here to help! I have access to our complete help center knowledge base and can answer most questions about:\n\n• Getting started & account setup\n• Music uploading & distribution\n• Royalties & payments\n• Technical troubleshooting\n• Platform-specific issues\n\nWhat specific question can I help you with? If you need to speak with a human support agent, just let me know and I can connect you!"
  }
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [allSessions, setAllSessions] = useState<ChatSession[]>([]);
  const [supportAgents, setSupportAgents] = useState<SupportAgent[]>(mockSupportAgents);
  const sessionIdRef = useRef(0);

  // Generate AI response based on user message
  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Check for request to speak to human
    if (message.includes('human') || message.includes('agent') || message.includes('person') || 
        message.includes('speak to someone') || message.includes('talk to support')) {
      return "I'd be happy to connect you with a human support agent! Let me transfer you to our support team. Please hold on while I find an available agent for you.";
    }

    // Find matching knowledge
    for (const [category, data] of Object.entries(helpCenterKnowledge)) {
      if (data.keywords.some(keyword => message.includes(keyword))) {
        return data.response;
      }
    }

    // Default response
    return "I'm here to help with your SoundWave questions! I can assist with:\n\n• Getting started & account setup\n• Music uploading & distribution\n• Royalties & payments\n• Technical issues\n• Platform problems\n\nWhat would you like to know more about? Or if you'd prefer to speak with a human agent, just ask!";
  };

  const queuedSessions = allSessions.filter(session => session.status === 'queued');

  const startChat = (userId: string, userName: string) => {
    const sessionId = `session-${++sessionIdRef.current}-${Date.now()}`;
    const newSession: ChatSession = {
      id: sessionId,
      userId,
      userName,
      status: 'bot',
      messages: [
        {
          id: `msg-${Date.now()}`,
          content: `Hi ${userName}! 👋 I'm SoundWave's AI assistant. I can help you with questions about music distribution, royalties, uploads, and more. How can I assist you today?`,
          sender: 'bot',
          timestamp: new Date(),
          senderName: 'SoundWave Bot'
        }
      ],
      priority: 'medium',
      createdAt: new Date(),
      lastActivity: new Date()
    };

    setCurrentSession(newSession);
    setAllSessions(prev => [...prev, newSession]);
    setIsChatOpen(true);
  };

  const sendMessage = (content: string, sender: 'user' | 'bot' | 'support', senderName?: string) => {
    if (!currentSession) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      content,
      sender,
      timestamp: new Date(),
      senderName
    };

    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, newMessage],
      lastActivity: new Date()
    };

    setCurrentSession(updatedSession);
    setAllSessions(prev => prev.map(s => s.id === currentSession.id ? updatedSession : s));

    // Generate bot response if user sent message and session is in bot mode
    if (sender === 'user' && currentSession.status === 'bot') {
      setTimeout(() => {
        const botResponse = generateBotResponse(content);
        const botMessage: ChatMessage = {
          id: `msg-${Date.now()}-bot`,
          content: botResponse,
          sender: 'bot',
          timestamp: new Date(),
          senderName: 'SoundWave Bot'
        };

        const finalSession = {
          ...updatedSession,
          messages: [...updatedSession.messages, botMessage],
          lastActivity: new Date()
        };

        setCurrentSession(finalSession);
        setAllSessions(prev => prev.map(s => s.id === currentSession.id ? finalSession : s));

        // Check if bot is suggesting human transfer
        if (botResponse.includes('transfer you to our support team')) {
          setTimeout(() => requestHumanSupport(), 2000);
        }
      }, 1000 + Math.random() * 2000); // Simulate bot thinking time
    }
  };

  const requestHumanSupport = () => {
    if (!currentSession) return;

    // Find available support agent
    const availableAgent = supportAgents.find(agent => 
      agent.status === 'online' && agent.activeSessions.length < agent.maxSessions
    );

    const updatedSession = {
      ...currentSession,
      status: availableAgent ? 'connected' as const : 'queued' as const,
      assignedSupport: availableAgent?.id,
      priority: 'high' as const,
      lastActivity: new Date()
    };

    if (availableAgent) {
      // Connect immediately
      const connectMessage: ChatMessage = {
        id: `msg-${Date.now()}-system`,
        content: `You've been connected with ${availableAgent.name} from our support team. They'll be happy to help you!`,
        sender: 'bot',
        timestamp: new Date(),
        senderName: 'System'
      };

      const supportMessage: ChatMessage = {
        id: `msg-${Date.now()}-support`,
        content: `Hi ${currentSession.userName}! I'm ${availableAgent.name} from the SoundWave support team. I can see your previous conversation. How can I help you today?`,
        sender: 'support',
        timestamp: new Date(),
        senderName: availableAgent.name
      };

      updatedSession.messages = [...updatedSession.messages, connectMessage, supportMessage];

      // Update agent's active sessions
      setSupportAgents(prev => prev.map(agent => 
        agent.id === availableAgent.id 
          ? { ...agent, activeSessions: [...agent.activeSessions, currentSession.id] }
          : agent
      ));
    } else {
      // Add to queue
      const queueMessage: ChatMessage = {
        id: `msg-${Date.now()}-system`,
        content: `All our support agents are currently busy. You've been added to the queue (position: ${queuedSessions.length + 1}). We'll connect you with the next available agent. Average wait time is 5-10 minutes.`,
        sender: 'bot',
        timestamp: new Date(),
        senderName: 'System'
      };

      updatedSession.messages = [...updatedSession.messages, queueMessage];
    }

    setCurrentSession(updatedSession);
    setAllSessions(prev => prev.map(s => s.id === currentSession.id ? updatedSession : s));
  };

  const acceptChat = (sessionId: string, agentId: string) => {
    const session = allSessions.find(s => s.id === sessionId);
    const agent = supportAgents.find(a => a.id === agentId);
    
    if (!session || !agent) return;

    const updatedSession = {
      ...session,
      status: 'connected' as const,
      assignedSupport: agentId,
      lastActivity: new Date()
    };

    const connectMessage: ChatMessage = {
      id: `msg-${Date.now()}-support`,
      content: `Hi ${session.userName}! I'm ${agent.name} from the SoundWave support team. I can see your previous conversation. How can I help you today?`,
      sender: 'support',
      timestamp: new Date(),
      senderName: agent.name
    };

    updatedSession.messages = [...updatedSession.messages, connectMessage];

    setAllSessions(prev => prev.map(s => s.id === sessionId ? updatedSession : s));
    
    // Update current session if it's the active one
    if (currentSession?.id === sessionId) {
      setCurrentSession(updatedSession);
    }

    // Update agent's active sessions
    setSupportAgents(prev => prev.map(a => 
      a.id === agentId 
        ? { ...a, activeSessions: [...a.activeSessions, sessionId] }
        : a
    ));
  };

  const assignToSupport = (sessionId: string, agentId: string) => {
    acceptChat(sessionId, agentId);
  };

  const endSupportSession = (sessionId: string) => {
    const session = allSessions.find(s => s.id === sessionId);
    if (!session) return;

    const updatedSession = {
      ...session,
      status: 'closed' as const,
      lastActivity: new Date()
    };

    setAllSessions(prev => prev.map(s => s.id === sessionId ? updatedSession : s));

    if (currentSession?.id === sessionId) {
      setCurrentSession(updatedSession);
    }

    // Remove from agent's active sessions
    if (session.assignedSupport) {
      setSupportAgents(prev => prev.map(agent => 
        agent.id === session.assignedSupport 
          ? { ...agent, activeSessions: agent.activeSessions.filter(id => id !== sessionId) }
          : agent
      ));
    }
  };

  const closeChat = () => {
    if (currentSession) {
      endSupportSession(currentSession.id);
    }
    setIsChatOpen(false);
  };

  const openChat = () => {
    setIsChatOpen(true);
  };

  const updateAgentStatus = (agentId: string, status: 'online' | 'busy' | 'offline') => {
    setSupportAgents(prev => prev.map(agent => 
      agent.id === agentId ? { ...agent, status } : agent
    ));
  };

  const value: ChatContextType = {
    currentSession,
    isChatOpen,
    allSessions,
    supportAgents,
    queuedSessions,
    startChat,
    sendMessage,
    requestHumanSupport,
    assignToSupport,
    closeChat,
    openChat,
    acceptChat,
    endSupportSession,
    updateAgentStatus
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};