import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { MessageSquare, Search, AlertCircle, Calendar, CornerDownLeft, MoreHorizontal, Clock, Reply, X, Send, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  sender: string;
  senderRole: 'employer' | 'admin' | 'pollen_team';
  subject: string;
  preview: string;
  timestamp: string;
  isRead: boolean;
  category: 'application' | 'interview' | 'feedback' | 'general' | 'job_offer';
  companyName?: string;
  jobTitle?: string;
  urgent?: boolean;
  isNew?: boolean;
  scheduledDate?: string;
  conversation?: ConversationMessage[];
  hasSchedulingAction?: boolean;
}

interface ConversationMessage {
  id: string;
  sender: string;
  senderRole: 'employer' | 'admin' | 'pollen_team' | 'job_seeker';
  content: string;
  timestamp: string;
  isCurrentUser: boolean;
}

const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    sender: 'Holly Saunders',
    senderRole: 'pollen_team',
    subject: 'Interview Invitation',
    preview: 'Hi Zara! I\'m Holly from the Pollen team. I\'d like to schedule a brief screening call to discuss your Marketing...',
    timestamp: '16 Jan',
    // No scheduledDate - needs scheduling
    isRead: false,
    category: 'interview',
    companyName: 'TechFlow Solutions',
    jobTitle: 'Marketing Assistant',
    urgent: true,
    isNew: true,
    hasSchedulingAction: true,
    conversation: [
      {
        id: '1-1',
        sender: 'Holly Saunders',
        senderRole: 'pollen_team',
        content: 'Hi Zara! I\'m Holly from the Pollen team. Congratulations on your Marketing Assistant application at TechFlow Solutions - your campaign strategy response was excellent.',
        timestamp: '16 Jan',
        isCurrentUser: false
      },
      {
        id: '1-2',
        sender: 'Zara Williams',
        senderRole: 'job_seeker',
        content: 'Thank you so much, Holly! I\'m really excited about the opportunity and appreciate the feedback.',
        timestamp: '16 Jan',
        isCurrentUser: true
      },
      {
        id: '1-3',
        sender: 'Holly Saunders',
        senderRole: 'pollen_team',
        content: 'I\'d like to schedule a brief screening call to discuss your Marketing Assistant application at TechFlow Solutions. Are you available this Friday at 2 PM?',
        timestamp: '16 Jan',
        isCurrentUser: false
      }
    ]
  },
  {
    id: '2',
    sender: 'Emma Wilson',
    senderRole: 'employer',
    subject: 'Interview Invitation',
    preview: 'Thanks for completing the Pollen screening! We\'d love to meet you in person. Can you come to our office...',
    timestamp: '14 Jan',
    // No scheduledDate - needs scheduling
    isRead: false,
    category: 'interview',
    companyName: 'StartupHub',
    jobTitle: 'Customer Support Specialist',
    urgent: true,
    isNew: true,
    hasSchedulingAction: true,
    conversation: [
      {
        id: '2-1',
        sender: 'Emma Wilson',
        senderRole: 'employer',
        content: 'Hi Zara,\n\nThanks for completing the Pollen screening! Holly spoke very highly of you, and we\'d love to meet you in person.\n\nCan you come to our office in Manchester for a face-to-face interview? We\'re flexible with timing and can work around your schedule.\n\nLooking forward to hearing from you!\n\nBest,\nEmma Wilson\nStartupHub',
        timestamp: '14 Jan',
        isCurrentUser: false
      },
      {
        id: '2-2',
        sender: 'Zara Williams',
        senderRole: 'job_seeker',
        content: 'Hi Emma,\n\nThank you for the interview invitation! I\'m very excited about the Customer Support Specialist position at StartupHub.\n\nI\'ve looked at the times you suggested but unfortunately none of them work with my current schedule. Could we possibly arrange something for the following week instead?\n\nBest regards,\nZara',
        timestamp: '14 Jan',
        isCurrentUser: true
      }
    ]
  },
  {
    id: '3',
    sender: 'Mike Chen',
    senderRole: 'employer',
    subject: 'Job Offer',
    preview: 'Congratulations! We\'d love to offer you the Content Writer position at Creative Media Co. Starting salary...',
    timestamp: '12 Jan',
    isRead: false,
    category: 'job_offer',
    companyName: 'Creative Media Co',
    jobTitle: 'Content Writer',
    urgent: true,
    isNew: true,
    conversation: [
      {
        id: '3-1',
        sender: 'Mike Chen',
        senderRole: 'employer',
        content: 'Hi Zara,\n\nCongratulations! We\'d love to offer you the Content Writer position at Creative Media Co.\n\nAfter reviewing your portfolio and interview performance, we\'re impressed by your creativity and writing style. Starting salary is £28,000 with opportunities for growth.\n\nWould you be interested in discussing this further?\n\nBest,\nMike Chen\nCreative Media Co',
        timestamp: '12 Jan',
        isCurrentUser: false
      }
    ]
  },
  {
    id: '4',
    sender: 'Sarah Tech',
    senderRole: 'employer',
    subject: 'Job Offer',
    preview: 'Exciting news! We\'re pleased to offer you the Data Analyst position at Tech Startup. Starting salary is £32...',
    timestamp: '28 Dec',
    isRead: false,
    category: 'job_offer',
    companyName: 'Tech Startup',
    jobTitle: 'Data Analyst',
    urgent: true,
    isNew: true,
    conversation: [
      {
        id: '4-1',
        sender: 'Sarah Tech',
        senderRole: 'employer',
        content: 'Hi Zara,\n\nExciting news! We\'re pleased to offer you the Data Analyst position at Tech Startup. Starting salary is £32,000 with excellent benefits and remote working options.\n\nYour analytical skills and enthusiasm really impressed our team. We\'d love to have you join us!\n\nLet me know if you\'d like to discuss this further.\n\nBest,\nSarah\nTech Startup',
        timestamp: '28 Dec',
        isCurrentUser: false
      }
    ]
  },
  {
    id: '5',
    sender: 'Holly Saunders',
    senderRole: 'pollen_team',
    subject: 'Interview Scheduled',
    preview: 'Great to meet you! I\'ve scheduled our screening call for Wednesday at 10:30 AM for your Creative Media Co applicati...',
    timestamp: '15 Jan',
    scheduledDate: 'Wednesday 22 January 2025 at 10:30',
    isRead: true,
    category: 'interview',
    companyName: 'Creative Media Co',
    jobTitle: 'Social Media Coordinator',
    conversation: [
      {
        id: '5-1',
        sender: 'Holly Saunders',
        senderRole: 'pollen_team',
        content: 'Hi Zara!\n\nGreat to meet you! I\'ve scheduled our screening call for Wednesday at 10:30 AM for your Creative Media Co application.\n\nWe\'ll discuss your Social Media Coordinator application and your creative portfolio. The call should take about 20 minutes.\n\nI\'ll send you the Teams link closer to the time. Looking forward to chatting!\n\nBest,\nHolly\nPollen Team',
        timestamp: '15 Jan',
        isCurrentUser: false
      }
    ]
  },
  {
    id: '6',
    sender: 'David Martinez',
    senderRole: 'employer',
    subject: 'Job Offer - Data Analyst Position',
    preview: 'Congratulations Zara! We are delighted to offer you the Data Analyst position at Tech Startup. Your performance throughout the interview process was exceptional...',
    timestamp: '28 Dec',
    isRead: false,
    category: 'job_offer',
    companyName: 'Tech Startup',
    jobTitle: 'Data Analyst',
    urgent: true,
    conversation: [
      {
        id: '6-1',
        sender: 'David Martinez',
        senderRole: 'employer',
        content: 'Hi Zara,\n\nCongratulations! We are delighted to offer you the Data Analyst position at Tech Startup.\n\nAfter carefully reviewing your skills assessment and interview performance, our team was impressed by your analytical thinking, problem-solving approach, and genuine enthusiasm for data-driven insights.\n\nHere are the key details:\n\n**Position:** Data Analyst\n**Salary:** £32,000 per annum\n**Start Date:** Monday 3rd February 2025\n**Location:** Remote (UK) with monthly team meetups in London\n**Benefits:** 25 days holiday + bank holidays, pension scheme, learning budget, flexible working hours\n\nI\'ve attached the full offer letter with complete terms and conditions. Please take your time to review everything carefully.\n\nWe\'re excited about the possibility of you joining our team and contributing to our growing data initiatives.\n\nPlease let me know if you have any questions, and we\'d love to hear your decision by Friday 3rd January.\n\nBest regards,\nDavid Martinez\nHiring Manager, Tech Startup',
        timestamp: '28 Dec',
        isCurrentUser: false
      },
      {
        id: '6-2',
        sender: 'Zara Williams',
        senderRole: 'job_seeker',
        content: 'Hi David,\n\nThank you so much for this wonderful offer! I\'m absolutely thrilled and honoured to receive it.\n\nI\'d love to accept the Data Analyst position. The role sounds perfect for my interests, and I\'m excited about contributing to Tech Startup\'s data initiatives.\n\nI do have a couple of quick questions about the role:\n\n1. What data tools and platforms does the team primarily use?\n2. Will there be opportunities for professional development in advanced analytics?\n3. Can you tell me more about the monthly team meetups?\n\nI\'m very much looking forward to starting on 3rd February and joining the team!\n\nBest regards,\nZara',
        timestamp: '29 Dec',
        isCurrentUser: true
      },
      {
        id: '6-3',
        sender: 'David Martinez',
        senderRole: 'employer',
        content: 'Hi Zara,\n\nFantastic news! We\'re absolutely delighted that you\'re accepting the offer.\n\nHappy to answer your questions:\n\n1. **Data Tools:** We primarily use Python (pandas, numpy), SQL, Tableau for visualisation, and Google Analytics. We\'re also exploring PowerBI and are open to your input on new tools.\n\n2. **Professional Development:** Absolutely! We have a £2,000 annual learning budget per team member, plus access to online courses, conferences, and certification programmes. We actively encourage skill development.\n\n3. **Team Meetups:** Monthly full-day sessions in our London co-working space. Usually includes team planning, collaborative projects, and social activities. Great for building relationships and sharing knowledge.\n\nI\'ll get HR to send over the contract documents today, and we\'ll arrange your equipment delivery for next week.\n\nWelcome to the team, Zara! We\'re so excited to have you on board.\n\nBest regards,\nDavid',
        timestamp: '29 Dec',
        isCurrentUser: false
      }
    ]
  }
];

export default function MessagesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState("");
  const [senderFilter, setSenderFilter] = useState<'all' | 'pollen_team' | 'employer'>('all');
  const [location, setLocation] = useLocation();

  const { toast } = useToast();

  // Handler for job offer decision - routes to job acceptance page
  const handleJobOfferDecision = (conversationId: string) => {
    // Map conversation IDs to application IDs for job offers
    const applicationIdMap: Record<string, string> = {
      '3': '3', // Content Writer at Creative Media Co
      '4': '4', // Data Analyst at Tech Startup
      '6': '7', // Data Analyst conversation that maps to application 7
    };
    
    const applicationId = applicationIdMap[conversationId];
    
    if (applicationId) {
      // Route to job acceptance page to collect decision and data
      window.location.href = `/job-acceptance/${applicationId}`;
    }
  };

  // Check for conversation query parameter and auto-open specific conversation
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const conversationParam = urlParams.get('conversation');
    
    if (conversationParam === 'holly') {
      // Find Holly's conversation (the first message from Holly)
      const hollyMessage = MOCK_MESSAGES.find(msg => 
        msg.sender === 'Holly Saunders' && msg.senderRole === 'pollen_team'
      );
      if (hollyMessage) {
        setSelectedMessage(hollyMessage);
      }
    } else if (conversationParam) {
      // Find conversation by ID
      const targetMessage = MOCK_MESSAGES.find(msg => msg.id === conversationParam);
      if (targetMessage) {
        setSelectedMessage(targetMessage);
        // Mark the conversation as opened/read when auto-opened
        targetMessage.isRead = true;
      }
    }
  }, [location]);

  const filteredMessages = MOCK_MESSAGES.filter(message => {
    const matchesSearch = searchTerm === "" || 
      message.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.preview.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSenderFilter = senderFilter === 'all' || message.senderRole === senderFilter;
    
    return matchesSearch && matchesSenderFilter;
  });

  const unreadCount = MOCK_MESSAGES.filter(msg => !msg.isRead).length;

  const getSenderBadge = (role: Message['senderRole'], category: Message['category']) => {
    if (category === 'interview') {
      return <Badge className="bg-blue-100 text-blue-800 text-xs">Interview</Badge>;
    }
    if (category === 'job_offer') {
      return <Badge className="bg-green-100 text-green-800 text-xs">Job Offer</Badge>;
    }
    
    switch (role) {
      case 'pollen_team':
        return <Badge className="bg-pink-100 text-pink-800 text-xs">Pollen Team</Badge>;
      case 'employer':
        return <Badge variant="outline" className="text-xs border-gray-300">Employer</Badge>;
      case 'admin':
        return <Badge className="bg-blue-100 text-blue-800 text-xs">Admin</Badge>;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    // If it's already formatted (like "16 Jan"), return as is
    if (timestamp.includes(' ') && !timestamp.includes('T')) {
      return timestamp;
    }
    // Otherwise format the date
    return new Date(timestamp).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short'
    });
  };
  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6 messages-page">
      {/* Header - Only show when no message is selected on mobile */}
      <div className={`mb-6 ${selectedMessage ? 'hidden lg:block' : ''}`}>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Messages</h1>
        <p className="text-sm text-gray-600">Direct communication with employers and hiring managers</p>
      </div>

      {/* Split Screen Layout */}
      <div className="flex gap-6 h-[calc(100vh-12rem)]">
        {/* Left Sidebar - Messages List */}
        <div className={`${selectedMessage ? 'hidden lg:block' : ''} w-full lg:w-1/3 flex flex-col space-y-4`}>
          {/* Stats Summary */}
          <div className="flex gap-2">
            <div className="flex-1 text-center p-2 bg-gray-50 rounded">
              <div className="text-xs text-gray-600">Total</div>
              <div className="font-semibold">{MOCK_MESSAGES.length}</div>
            </div>
            <div className="flex-1 text-center p-2 bg-orange-50 rounded">
              <div className="text-xs text-orange-600">Unread</div>
              <div className="font-semibold text-orange-600">{unreadCount}</div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Sender Filter */}
            <div className="flex gap-2">
              <Button
                variant={senderFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSenderFilter('all')}
                className="text-xs"
              >
                All ({MOCK_MESSAGES.length})
              </Button>
              <Button
                variant={senderFilter === 'pollen_team' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSenderFilter('pollen_team')}
                className="text-xs bg-pink-100 text-pink-800 hover:bg-pink-200"
                style={senderFilter === 'pollen_team' ? { backgroundColor: '#E2007A', color: 'white' } : {}}
              >
                Pollen ({MOCK_MESSAGES.filter(m => m.senderRole === 'pollen_team').length})
              </Button>
              <Button
                variant={senderFilter === 'employer' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSenderFilter('employer')}
                className="text-xs"
              >
                Employers ({MOCK_MESSAGES.filter(m => m.senderRole === 'employer').length})
              </Button>
            </div>
          </div>

          {/* Messages List - Scrollable */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-2">
            {filteredMessages.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No messages found</p>
              </div>
            ) : (
              filteredMessages.map((message) => (
                <Card 
                  key={message.id} 
                  className={`transition-all cursor-pointer hover:shadow-md ${
                    !message.isRead ? 'border-l-4 border-l-orange-500' : ''
                  } ${selectedMessage?.id === message.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
                  onClick={() => setSelectedMessage(message)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.senderRole === 'pollen_team' ? 'bg-pink-100' : 'bg-blue-100'
                      }`}>
                        <span className={`text-xs font-medium ${
                          message.senderRole === 'pollen_team' ? 'text-pink-800' : 'text-blue-800'
                        }`}>
                          {message.sender.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-medium text-sm truncate ${!message.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                            {message.sender}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1 mb-1">
                          {getSenderBadge(message.senderRole, message.category)}
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(message.timestamp)}
                          </span>
                        </div>
                        {message.companyName && message.jobTitle && (
                          <p className="text-xs text-gray-500 mb-1 truncate">
                            {message.jobTitle} - {message.companyName}
                          </p>
                        )}
                        <p className="text-xs text-gray-600 line-clamp-2">{message.preview}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Right Side - Conversation View */}
        <div className={`${!selectedMessage ? 'hidden lg:flex' : 'flex'} flex-1 flex-col`}>
          {!selectedMessage ? (
            <div className="flex-1 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a message</h3>
                <p className="text-gray-600">Choose a conversation from the sidebar to view the full thread</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full bg-white border rounded-lg">
              {/* Header */}
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedMessage(null)}
                    className="lg:hidden"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-gray-900 text-xs"
                  >
                    View Application
                  </Button>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    selectedMessage.senderRole === 'pollen_team' ? 'bg-pink-100' : 'bg-blue-100'
                  }`}>
                    <span className={`text-sm font-medium ${
                      selectedMessage.senderRole === 'pollen_team' ? 'text-pink-800' : 'text-blue-800'
                    }`}>
                      {selectedMessage.sender.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{selectedMessage.sender}</h3>
                      <Badge className={
                        selectedMessage.senderRole === 'pollen_team' 
                          ? "bg-pink-100 text-pink-800 text-xs" 
                          : "bg-blue-100 text-blue-800 text-xs"
                      }>
                        {selectedMessage.senderRole === 'pollen_team' ? 'Pollen Team' : 'Employer'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {selectedMessage.jobTitle} - {selectedMessage.companyName}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Interview Details */}
              {selectedMessage.scheduledDate && (
                <div className="p-4 bg-blue-50 border-b">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <h4 className="font-semibold text-sm text-gray-900">Scheduled Interview</h4>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{selectedMessage.scheduledDate}</p>
                  <p className="text-xs text-gray-600">Video Interview</p>
                </div>
              )}

              {/* Conversation Messages */}
              <div className="flex-1 flex flex-col p-4">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-4 h-4 text-gray-700" />
                  <h4 className="font-semibold text-sm text-gray-900">Conversation</h4>
                </div>

                {/* Messages Thread */}
                <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                  {/* Display actual conversation data */}
                  {selectedMessage.conversation && selectedMessage.conversation.length > 0 ? (
                    selectedMessage.conversation.map((message, index) => (
                      <div key={message.id}>
                        <div className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                          <div className="max-w-[70%]">
                            {!message.isCurrentUser && (
                              <div className="flex items-center gap-1 mb-1 ml-2">
                                <span className={`text-xs font-medium ${
                                  message.senderRole === 'pollen_team' ? 'text-pink-600' : 'text-blue-600'
                                }`}>
                                  {message.senderRole === 'pollen_team' ? '🌸 Pollen Team' : '🏢 Employer'}
                                </span>
                              </div>
                            )}
                            <div className={`rounded-lg p-3 ${
                              message.isCurrentUser 
                                ? 'ml-8 bg-blue-600 text-white' 
                                : message.senderRole === 'pollen_team' 
                                  ? 'mr-8 bg-pink-50 text-gray-900 border-l-3 border-pink-400'
                                  : 'mr-8 bg-gray-100 text-gray-900'
                            }`}>
                              {message.content.split('\n').map((line, index) => (
                                <p key={index} className="text-sm" style={{ marginBottom: line === '' ? '0.5rem' : '0' }}>
                                  {line}
                                </p>
                              ))}
                            </div>
                            <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${message.isCurrentUser ? 'justify-end mr-2' : 'ml-2'}`}>
                              <Clock className="w-3 h-3" />
                              {message.timestamp}
                            </div>
                          </div>
                        </div>

                        {/* Job Offer Decision button - show after first employer message in job offer conversations */}
                        {selectedMessage.category === 'job_offer' && 
                         index === 0 && // First message in conversation
                         !message.isCurrentUser && 
                         message.senderRole === 'employer' && (
                          <div className="flex justify-start mt-3 mb-4">
                            <div className="max-w-[70%] mr-8">
                              <Button 
                                onClick={() => handleJobOfferDecision(selectedMessage.id)}
                                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Confirm Decision
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Interview Scheduling buttons */}
                        {selectedMessage.category === 'interview' && 
                         !message.isCurrentUser && 
                         (message.senderRole === 'employer' || message.senderRole === 'pollen_team') && // Show after employer or Pollen messages
                         (message.content.toLowerCase().includes('schedule') || 
                          message.content.toLowerCase().includes('interview') ||
                          message.content.toLowerCase().includes('available')) && (
                          <div className="flex justify-start mt-3 mb-4">
                            <div className="max-w-[70%] mr-8 flex gap-2">
                              {selectedMessage.scheduledDate ? (
                                // If already scheduled, show review details button
                                <Button 
                                  variant="outline"
                                  onClick={() => {
                                    const applicationIdMap: Record<string, string> = {
                                      '1': '1', // Marketing Assistant - TechFlow Solutions 
                                      '2': '2', // Customer Support - StartupHub 
                                    };
                                    const applicationId = applicationIdMap[selectedMessage.id] || '1';
                                    setLocation(`/interview-confirmation/${applicationId}`);
                                  }}
                                  className="flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                                >
                                  <Calendar className="w-4 h-4" />
                                  Review Interview Details
                                </Button>
                              ) : (
                                // If not scheduled, show appropriate booking option
                                <>
                                  {message.senderRole === 'pollen_team' && (
                                    <Button 
                                      onClick={() => {
                                        const applicationIdMap: Record<string, string> = {
                                          '1': '1', // Marketing Assistant - TechFlow Solutions (Holly Saunders)
                                        };
                                        const applicationId = applicationIdMap[selectedMessage.id] || '1';
                                        setLocation(`/interview-schedule-form/${applicationId}`);
                                      }}
                                      className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white"
                                    >
                                      <Calendar className="w-4 h-4" />
                                      Book Pollen Interview
                                    </Button>
                                  )}
                                  {message.senderRole === 'employer' && (
                                    <Button 
                                      onClick={() => {
                                        const applicationIdMap: Record<string, string> = {
                                          '2': '2', // Customer Support - StartupHub (Emma Wilson)
                                        };
                                        const applicationId = applicationIdMap[selectedMessage.id] || '2';
                                        setLocation(`/interview-schedule-form/${applicationId}`);
                                      }}
                                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                      <Calendar className="w-4 h-4" />
                                      Schedule Interview
                                    </Button>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        )}


                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Start the conversation</p>
                    </div>
                  )}
                </div>

                {/* Reply Input */}
                <div className="border-t pt-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        console.log('Reply sent:', replyText);
                        setReplyText('');
                      }}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}