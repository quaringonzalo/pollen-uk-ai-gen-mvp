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
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Using text initials for profile avatars for consistent display
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

interface EmployerMessage {
  id: string;
  candidateName: string;
  candidateEmail: string;
  candidateAvatar: string;
  jobTitle: string;
  lastMessage: string;
  timestamp: string;
  isRead: boolean;
  messageType: 'application' | 'interview' | 'offer' | 'general' | 'mentor' | 'community' | 'feedback';
  applicationId?: string;
  interviewDate?: string;
  interviewTime?: string;
  interviewType?: 'video' | 'phone' | 'in_person';
  interviewLocation?: string;
  needsResponse: boolean;
  lastSenderType: 'employer' | 'candidate';
  candidateId: number;
  employerName?: string;
  companyName?: string;
  companyLogo?: string;
  hasReviews?: boolean;
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

const MOCK_EMPLOYER_CONVERSATIONS: EmployerMessage[] = [
  {
    id: '4', // Priya Singh conversation
    candidateName: 'Priya Singh',
    candidateEmail: 'priya.singh@email.com',
    candidateAvatar: '/attached_assets/priya-singh-headshot.jpg',
    jobTitle: 'Marketing Assistant',
    lastMessage: 'Thank you for the interview opportunity! I\'m very excited about the role and would love to discuss next steps.',
    timestamp: '2025-01-16T11:30:00Z',
    isRead: false,
    messageType: 'application',
    applicationId: '4',
    needsResponse: true,
    lastSenderType: 'candidate',
    candidateId: 23,
    employerName: 'Sarah Chen',
    companyName: 'TechFlow Solutions',
    hasReviews: true
  },
  {
    id: '1', // Sarah Chen conversation
    candidateName: 'Sarah Chen',
    candidateEmail: 'sarah.chen@email.com',
    candidateAvatar: '/attached_assets/sarah-chen-headshot.jpg',
    jobTitle: 'Marketing Assistant',
    lastMessage: 'Thank you for scheduling the interview! I\'m available Friday at 2 PM and look forward to discussing the role further.',
    timestamp: '2025-01-16T10:30:00Z',
    isRead: false,
    messageType: 'interview',
    applicationId: '1',
    interviewDate: '2025-01-20',
    interviewTime: '14:00',
    interviewType: 'video',
    needsResponse: false,
    lastSenderType: 'candidate',
    candidateId: 20,
    employerName: 'Sarah Chen',
    companyName: 'TechFlow Solutions',
    hasReviews: true
  },
  {
    id: '2',
    candidateName: 'Emma Thompson',
    candidateEmail: 'emma.thompson@email.com',
    candidateAvatar: '/attached_assets/emma-wilson-headshot.jpg',
    jobTitle: 'Social Media Coordinator - Creative Media Co',
    lastMessage: 'Great to meet you! I\'ve scheduled our screening call for Wednesday at 10:30 AM for your Creative Media Co application. I\'ll send you the meeting link shortly. Looking forward to discussing your creative background!',
    timestamp: '2025-01-15T16:20:00Z',
    isRead: true,
    messageType: 'interview',
    applicationId: '2',
    interviewDate: '2025-01-22',
    interviewTime: '10:30',
    interviewType: 'video',
    needsResponse: false,
    lastSenderType: 'employer',
    candidateId: 22,
    employerName: 'Holly Saunders',
    companyName: 'Pollen Team',
    companyLogo: '/attached_assets/Holly_1752681740688.jpg',
    hasReviews: true
  }
];

const MOCK_CONVERSATION_MESSAGES: { [key: string]: Message[] } = {
  '1': [ // Sarah Chen
    {
      id: '1',
      senderId: 'employer-1',
      senderName: 'Hiring Manager',
      senderType: 'employer',
      content: 'Hi Sarah! I reviewed your Marketing Assistant application - excellent work on the content strategy assessment!',
      timestamp: '2025-01-15T14:30:00Z',
      isRead: true
    },
    {
      id: '2',
      senderId: 'candidate-1',
      senderName: 'Sarah Chen',
      senderType: 'candidate',
      content: 'Hi! Thank you for reaching out about the Marketing Assistant position. I\'m very interested in the role.',
      timestamp: '2025-01-15T15:00:00Z',
      isRead: true
    }
  ],
  '2': [ // James Mitchell
    {
      id: '1',
      senderId: 'employer-2',
      senderName: 'Hiring Manager',
      senderType: 'employer',
      content: 'Hi James! Your analytical skills assessment was impressive. Would you be available for a brief interview this week?',
      timestamp: '2025-01-14T10:30:00Z',
      isRead: true
    },
    {
      id: '2',
      senderId: 'candidate-2',
      senderName: 'James Mitchell',
      senderType: 'candidate',
      content: 'Thank you! I\'d be delighted to schedule an interview. I\'m available Tuesday through Thursday after 2 PM.',
      timestamp: '2025-01-14T12:15:00Z',
      isRead: true
    }
  ],
  '3': [ // Emma Thompson
    {
      id: '1',
      senderId: 'employer-3',
      senderName: 'Holly Saunders',
      senderType: 'employer',
      content: 'Great to meet you! I\'ve scheduled our screening call for Wednesday at 10:30 AM. I\'ll send you the meeting link shortly.',
      timestamp: '2025-01-15T16:20:00Z',
      isRead: true
    },
    {
      id: '2',
      senderId: 'candidate-3',
      senderName: 'Emma Thompson',
      senderType: 'candidate',
      content: 'Perfect! I\'ve added it to my calendar. Looking forward to discussing how I can contribute to your creative team.',
      timestamp: '2025-01-15T16:45:00Z',
      isRead: true
    }
  ],
  '4': [ // Priya Singh
    {
      id: '1',
      senderId: 'employer-4',
      senderName: 'Hiring Manager',
      senderType: 'employer',
      content: 'Hi Priya! I\'ve reviewed your application and I\'m impressed with your strategic planning assessment. Would you be interested in discussing the role further?',
      timestamp: '2025-01-16T09:00:00Z',
      isRead: true
    },
    {
      id: '2',
      senderId: 'candidate-4',
      senderName: 'Priya Singh',
      senderType: 'candidate',
      content: 'Thank you for the interview opportunity! I\'m very excited about the role and would love to discuss next steps.',
      timestamp: '2025-01-16T11:30:00Z',
      isRead: false
    }
  ],
  '5': [ // Michael Roberts
    {
      id: '1',
      senderId: 'employer-5',
      senderName: 'Hiring Manager',
      senderType: 'employer',
      content: 'Hi Michael! Your business analysis work was excellent. Are you available for a quick call this week?',
      timestamp: '2025-01-13T14:00:00Z',
      isRead: true
    },
    {
      id: '2',
      senderId: 'candidate-5',
      senderName: 'Michael Roberts',
      senderType: 'candidate',
      content: 'Absolutely! I\'m available Monday through Friday, any time that works for you.',
      timestamp: '2025-01-13T16:30:00Z',
      isRead: true
    }
  ],
  '6': [ // Alex Johnson
    {
      id: '1',
      senderId: 'employer-6',
      senderName: 'Hiring Manager',
      senderType: 'employer',
      content: 'Hi Alex! I noticed your technical assessment scores were strong. Would you like to schedule an interview to discuss the role?',
      timestamp: '2025-01-12T11:00:00Z',
      isRead: true
    },
    {
      id: '2',
      senderId: 'candidate-6',
      senderName: 'Alex Johnson',
      senderType: 'candidate',
      content: 'Thank you for considering my application! I\'m very interested and would love to schedule an interview at your convenience.',
      timestamp: '2025-01-12T13:45:00Z',
      isRead: true
    }
  ]
};

export default function EmployerMessages() {
  const [location, setLocation] = useLocation();
  const [selectedConversation, setSelectedConversation] = useState<EmployerMessage | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();

  // Auto-select conversation from URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const conversationId = urlParams.get('conversation');
    
    if (conversationId && !selectedConversation) {
      const conversation = MOCK_EMPLOYER_CONVERSATIONS.find(conv => conv.id === conversationId);
      if (conversation) {
        setSelectedConversation(conversation);
      }
    }
  }, [selectedConversation]);

  const handleViewApplication = (candidateId: number) => {
    // Route to candidate management page with candidate auto-selected
    setLocation(`/job-candidate-matches/job-001?candidate=${candidateId}`);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // In a real app, this would send the message to the backend
    console.log('Sending message:', newMessage);
    setNewMessage("");
    
    toast({
      title: "Message sent",
      description: "Your message has been sent successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-600">Manage candidate communications and interview scheduling</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Conversations
                </CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {MOCK_EMPLOYER_CONVERSATIONS
                    .filter(conv => 
                      conv.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      conv.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((conversation) => (
                      <div
                        key={conversation.id}
                        className={`p-4 cursor-pointer hover:bg-gray-50 border-b ${selectedConversation?.id === conversation.id ? 'bg-blue-50' : ''}`}
                        onClick={() => setSelectedConversation(conversation)}
                      >
                        <div className="flex items-start gap-3">
                          <ProfileAvatar 
                            name={conversation.candidateName} 
                            src={conversation.candidateAvatar}
                            size="w-10 h-10"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{conversation.candidateName}</span>
                              {!conversation.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mb-1">{conversation.jobTitle}</p>
                            <p className="text-xs text-gray-500 truncate">{conversation.lastMessage}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(conversation.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Message Thread */}
          <div className="lg:col-span-2">
            {selectedConversation ? (
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ProfileAvatar 
                        name={selectedConversation.candidateName} 
                        src={selectedConversation.candidateAvatar}
                      />
                      <div>
                        <h3 className="font-semibold">{selectedConversation.candidateName}</h3>
                        <p className="text-sm text-gray-600">{selectedConversation.jobTitle}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleViewApplication(selectedConversation.candidateId)}
                      className="flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      View Application
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    {MOCK_CONVERSATION_MESSAGES[selectedConversation.id]?.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderType === 'employer' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.senderType === 'employer'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.senderType === 'employer' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center text-gray-500 py-8">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No messages yet. Start the conversation!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
                
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 min-h-[80px]"
                    />
                    <Button 
                      onClick={handleSendMessage}
                      className="px-4"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="h-[600px] flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
                  <p>Choose a conversation from the list to start messaging</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}