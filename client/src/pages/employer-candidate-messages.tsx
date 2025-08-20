import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MessageSquare, 
  Send, 
  Search, 
  Building2, 
  Calendar,
  ArrowLeft,
  Clock,
  CheckCircle,
  User,
  Video,
  Phone,
  MapPin,
  AlertCircle,
  Reply,
  Bell,
  X,
  Users,
  Star,
  FileText,
  Briefcase
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Using Pollen branding for profile avatars for consistent display
const getPollenAvatar = () => {
  return "P";
};

const ProfileAvatar = ({ name, src, size = "w-12 h-12" }: { name: string; src?: string; size?: string }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const pollenAvatar = getPollenAvatar();
  const isLarge = size.includes('w-12');
  const fontSize = isLarge ? '18px' : '16px';
  
  // Try to load the image if provided
  if (src) {
    return (
      <div className={`${size} rounded-full text-white flex items-center justify-center font-bold relative overflow-hidden`} style={{ backgroundColor: '#E2007A', fontFamily: 'Sora' }}>
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center z-10"
               style={{ fontSize }}>
            {pollenAvatar}
          </div>
        )}
        
        <img
          src={src}
          alt={name}
          className={`w-full h-full object-cover rounded-full ${imageLoaded ? 'block' : 'hidden'}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(false)}
        />
      </div>
    );
  }
  
  // Fallback to Pollen branding
  return (
    <div className={`${size} rounded-full text-white flex items-center justify-center font-bold`} 
         style={{ backgroundColor: '#E2007A', fontFamily: 'Sora', fontSize }}>
      {pollenAvatar}
    </div>
  );
};

interface CandidateMessage {
  id: string;
  candidateName: string;
  candidateAvatar?: string;
  jobTitle: string;
  applicationId: string;
  lastMessage: string;
  timestamp: string;
  isRead: boolean;
  messageType: 'application' | 'interview' | 'offer' | 'response' | 'question';
  needsResponse: boolean;
  lastSenderType: 'employer' | 'candidate';
  status: 'active' | 'interview_scheduled' | 'offered' | 'hired' | 'declined';
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderType: 'employer' | 'candidate';
  content: string;
  timestamp: string;
  isRead: boolean;
}

// Mock data showing conversations FROM employer perspective (with candidates)
const MOCK_CANDIDATE_CONVERSATIONS: CandidateMessage[] = [
  {
    id: '1',
    candidateName: 'Zara Williams',
    candidateAvatar: '/attached_assets/zara-profile.jpg',
    jobTitle: 'Marketing Assistant',
    applicationId: 'app-001',
    lastMessage: 'Thank you for the interview opportunity! I\'m very excited about joining the TechFlow team.',
    timestamp: '2025-01-16T14:30:00Z',
    isRead: false,
    messageType: 'response',
    needsResponse: true,
    lastSenderType: 'candidate',
    status: 'interview_scheduled'
  },
  {
    id: '2',
    candidateName: 'Marcus Johnson',
    candidateAvatar: '/attached_assets/marcus-profile.jpg',
    jobTitle: 'Social Media Coordinator',
    applicationId: 'app-002',
    lastMessage: 'I\'d love to accept the position! When would be a good time to discuss the start date and onboarding process?',
    timestamp: '2025-01-16T11:15:00Z',
    isRead: false,
    messageType: 'offer',
    needsResponse: true,
    lastSenderType: 'candidate',
    status: 'offered'
  },
  {
    id: '3',
    candidateName: 'Sarah Mitchell',
    candidateAvatar: '/attached_assets/sarah-profile.jpg',
    jobTitle: 'Customer Support Specialist',
    applicationId: 'app-003',
    lastMessage: 'Perfect! I\'ll be there at 2 PM on Friday. Should I bring anything specific to the interview?',
    timestamp: '2025-01-15T16:45:00Z',
    isRead: true,
    messageType: 'interview',
    needsResponse: false,
    lastSenderType: 'candidate',
    status: 'interview_scheduled'
  },
  {
    id: '4',
    candidateName: 'Alex Thompson',
    candidateAvatar: '/attached_assets/alex-profile.jpg',
    jobTitle: 'Content Writer',
    applicationId: 'app-004',
    lastMessage: 'Hi! I have some questions about the role requirements and team structure. Could we schedule a quick call?',
    timestamp: '2025-01-15T09:20:00Z',
    isRead: true,
    messageType: 'question',
    needsResponse: false,
    lastSenderType: 'candidate',
    status: 'active'
  },
  {
    id: '5',
    candidateName: 'Emma Chen',
    candidateAvatar: '/attached_assets/emma-profile.jpg',
    jobTitle: 'Junior Developer',
    applicationId: 'app-005',
    lastMessage: 'Thank you for the technical interview! I really enjoyed working through the coding challenges with the team.',
    timestamp: '2025-01-14T17:30:00Z',
    isRead: true,
    messageType: 'response',
    needsResponse: false,
    lastSenderType: 'candidate',
    status: 'active'
  }
];

const MOCK_CANDIDATE_MESSAGES: Record<string, Message[]> = {
  '1': [
    {
      id: '1',
      senderId: 'employer-demo',
      senderName: 'Demo Employer',
      senderType: 'employer',
      content: 'Hi Zara! Thank you for your application to the Marketing Assistant position. I\'d love to schedule an interview to discuss your background and the role in more detail.',
      timestamp: '2025-01-16T09:00:00Z',
      isRead: true
    },
    {
      id: '2',
      senderId: 'zara-williams',
      senderName: 'Zara Williams',
      senderType: 'candidate',
      content: 'Thank you for the interview opportunity! I\'m very excited about joining the TechFlow team.',
      timestamp: '2025-01-16T14:30:00Z',
      isRead: false
    }
  ],
  '2': [
    {
      id: '3',
      senderId: 'employer-demo',
      senderName: 'Demo Employer',
      senderType: 'employer',
      content: 'Hi Marcus! We\'re impressed with your application and would like to offer you the Social Media Coordinator position. Starting salary is £26,000 with excellent benefits.',
      timestamp: '2025-01-16T10:00:00Z',
      isRead: true
    },
    {
      id: '4',
      senderId: 'marcus-johnson',
      senderName: 'Marcus Johnson',
      senderType: 'candidate',
      content: 'I\'d love to accept the position! When would be a good time to discuss the start date and onboarding process?',
      timestamp: '2025-01-16T11:15:00Z',
      isRead: false
    }
  ],
  '3': [
    {
      id: '5',
      senderId: 'employer-demo',
      senderName: 'Demo Employer',
      senderType: 'employer',
      content: 'Hi Sarah! Thank you for your application. Could you come in for an interview this Friday at 2 PM?',
      timestamp: '2025-01-15T14:00:00Z',
      isRead: true
    },
    {
      id: '6',
      senderId: 'sarah-mitchell',
      senderName: 'Sarah Mitchell',
      senderType: 'candidate',
      content: 'Perfect! I\'ll be there at 2 PM on Friday. Should I bring anything specific to the interview?',
      timestamp: '2025-01-15T16:45:00Z',
      isRead: true
    }
  ]
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'interview_scheduled':
      return <Badge className="bg-blue-100 text-blue-700">Interview Scheduled</Badge>;
    case 'offered':
      return <Badge className="bg-green-100 text-green-700">Offer Extended</Badge>;
    case 'hired':
      return <Badge className="bg-purple-100 text-purple-700">Hired</Badge>;
    case 'declined':
      return <Badge className="bg-gray-100 text-gray-700">Declined</Badge>;
    default:
      return <Badge className="bg-yellow-100 text-yellow-700">Under Review</Badge>;
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export default function EmployerCandidateMessages() {
  const [location, setLocation] = useLocation();
  const [selectedConversation, setSelectedConversation] = useState<CandidateMessage | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [fromNotifications, setFromNotifications] = useState(false);
  const { toast } = useToast();

  // Fetch current user profile data
  const { data: currentUser } = useQuery({
    queryKey: ['user-profile'],
    queryFn: () => fetch('/api/user-profile').then(res => res.json()),
  });

  // Handle direct linking from notifications
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const conversationId = urlParams.get('conversation');
    const fromNotif = urlParams.get('from') === 'notifications';
    
    if (conversationId && fromNotif) {
      const conversation = MOCK_CANDIDATE_CONVERSATIONS.find(conv => conv.id === conversationId);
      if (conversation) {
        setSelectedConversation(conversation);
        setFromNotifications(fromNotif);
      }
    }
  }, [location]);

  const filteredConversations = MOCK_CANDIDATE_CONVERSATIONS.filter(conv =>
    conv.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      console.log("Sending message:", newMessage);
      setNewMessage("");
      toast({
        title: "Message sent",
        description: `Your message has been sent to ${selectedConversation.candidateName}.`,
      });
    }
  };

  if (selectedConversation) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => {
                setSelectedConversation(null);
                setFromNotifications(false);
                setLocation('/employer-messages');
              }}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Messages
            </Button>
            <div className="flex items-center gap-3">
              <ProfileAvatar 
                name={selectedConversation.candidateName}
                src={selectedConversation.candidateAvatar}
                size="w-10 h-10"
              />
              <div>
                <h1 className="font-semibold">{selectedConversation.candidateName}</h1>
                <p className="text-sm text-gray-600">{selectedConversation.jobTitle}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {fromNotifications && (
              <Button 
                variant="outline" 
                onClick={() => setLocation('/notifications')}
                className="flex items-center gap-2"
              >
                <Bell className="w-4 h-4" />
                Back to Notifications
              </Button>
            )}
            {getStatusBadge(selectedConversation.status)}
          </div>
        </div>

        {/* Application Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Application Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Position</p>
                <p className="font-semibold">{selectedConversation.jobTitle}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Application ID</p>
                <p className="font-mono text-sm">{selectedConversation.applicationId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                {getStatusBadge(selectedConversation.status)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Actions</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <User className="w-4 h-4 mr-1" />
                    View Profile
                  </Button>
                  <Button size="sm" variant="outline">
                    <Briefcase className="w-4 h-4 mr-1" />
                    View Application
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Conversation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {(MOCK_CANDIDATE_MESSAGES[selectedConversation.id] || []).map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.senderType === 'employer' ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Profile picture for candidate messages */}
                  {message.senderType === 'candidate' && (
                    <div className="order-1">
                      <ProfileAvatar 
                        name={message.senderName}
                        src={selectedConversation.candidateAvatar}
                        size="w-8 h-8"
                      />
                    </div>
                  )}
                  
                  {/* Message content */}
                  <div className={`order-2 max-w-xs lg:max-w-md ${message.senderType === 'employer' ? 'order-3' : ''}`}>
                    <div className={`p-3 rounded-lg ${
                      message.senderType === 'employer' 
                        ? 'bg-pink-500 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p>{message.content}</p>
                    </div>
                    <p className={`text-xs text-gray-500 mt-1 flex items-center gap-1 ${
                      message.senderType === 'employer' ? 'justify-end' : 'justify-start'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString('en-GB', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                      {message.isRead && <CheckCircle className="w-3 h-3" />}
                    </p>
                  </div>

                  {/* Profile picture for employer messages */}
                  {message.senderType === 'employer' && (
                    <div className="order-4">
                      <ProfileAvatar 
                        name="Demo Employer"
                        size="w-8 h-8"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Message input */}
            <div className="flex gap-2">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 min-h-[80px]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <Button 
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="self-end"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Candidate Messages</h1>
          <p className="text-gray-600 mt-1">Communicate with applicants and manage conversations</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Conversations List */}
      <div className="grid gap-4">
        {filteredConversations.map((conversation) => (
          <Card 
            key={conversation.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedConversation(conversation)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <ProfileAvatar 
                  name={conversation.candidateName}
                  src={conversation.candidateAvatar}
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold truncate">{conversation.candidateName}</h3>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(conversation.status)}
                      <span className="text-xs text-gray-500">
                        {new Date(conversation.timestamp).toLocaleDateString('en-GB')}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{conversation.jobTitle}</p>
                  
                  <p className="text-sm text-gray-700 truncate">{conversation.lastMessage}</p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">App ID: {conversation.applicationId}</span>
                    <div className="flex items-center gap-2">
                      {conversation.needsResponse && (
                        <Badge variant="destructive" className="text-xs">
                          Needs Response
                        </Badge>
                      )}
                      {!conversation.isRead && (
                        <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredConversations.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations found</h3>
            <p className="text-gray-500">
              {searchTerm ? "Try adjusting your search terms." : "New candidate messages will appear here."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}