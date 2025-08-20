import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  MessageSquare, ArrowLeft, Search, Send, Reply,
  Clock, User, Building2, Filter, CheckCircle,
  AlertCircle, Star, Archive, Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: 'employer_inquiry' | 'candidate_support' | 'technical_issue' | 'platform_feedback';
  subject: string;
  content: string;
  senderName: string;
  senderEmail: string;
  senderType: 'employer' | 'candidate' | 'system';
  timestamp: string;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  assignedTo?: string;
  companyName?: string;
  candidateId?: string;
  relatedJob?: string;
}

export default function AdminMessages() {
  const [, setLocation] = useLocation();
  const { candidateId } = useParams<{ candidateId?: string }>();
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [filterType, setFilterType] = useState<string>(candidateId ? "candidate_specific" : "all");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  // Get candidate details if viewing specific candidate messages
  const { data: candidateDetails } = useQuery({
    queryKey: [`/api/candidates/${candidateId}`],
    enabled: !!candidateId,
    initialData: candidateId ? {
      id: candidateId,
      name: candidateId === "21" ? "James Mitchell" : 
            candidateId === "22" ? "Emma Thompson" : 
            candidateId === "23" ? "Priya Singh" : 
            candidateId === "24" ? "Michael Roberts" : 
            candidateId === "25" ? "Alex Johnson" : 
            candidateId === "34" ? "Daniel Foster" : 
            candidateId === "37" ? "Zara Ahmed" : 
            candidateId === "8" ? "Sophie Williams" : 
            candidateId === "15" ? "Alex Chen" : 
            candidateId === "41" ? "Priya Singh" : 
            candidateId === "42" ? "Jake Wilson" : 
            candidateId === "43" ? "Amelia Jones" : 
            `Candidate ${candidateId}`
    } : undefined
  });

  const { data: messages } = useQuery<Message[]>({
    queryKey: ["/api/admin/messages"],
    initialData: [
      {
        id: "1",
        type: "employer_inquiry",
        subject: "Question about candidate assessment scores",
        content: "Hi Holly, I'm reviewing the candidates for our Marketing Assistant role and noticed some of the assessment scores seem quite high. Could you provide more context on how these are calculated? Specifically interested in Emma Thompson's strategic planning score of 82%. Thanks, Sarah",
        senderName: "Sarah Mitchell",
        senderEmail: "sarah@techflowsolutions.com",
        senderType: "employer",
        timestamp: "2025-01-14T10:30:00Z",
        isRead: false,
        priority: "medium",
        status: "new",
        companyName: "TechFlow Solutions",
        relatedJob: "Marketing Assistant"
      },
      {
        id: "2",
        type: "candidate_support",
        subject: "Unable to complete behavioral assessment",
        content: "Hello, I'm having trouble submitting my behavioral assessment. The page keeps freezing on question 15 and I can't proceed. I've tried refreshing and using a different browser but the issue persists. Could you please help? My application deadline is tomorrow. Best regards, James Mitchell",
        senderName: "James Mitchell",
        senderEmail: "james.mitchell@email.com",
        senderType: "candidate",
        timestamp: "2025-01-14T09:15:00Z",
        isRead: false,
        priority: "high",
        status: "new",
        candidateId: "21"
      },
      {
        id: "3",
        type: "employer_inquiry",
        subject: "Next steps for shortlisted UX Designer candidates",
        content: "Hi team, we've reviewed the 3 UX Designer candidates you matched us with and would like to proceed with interviews for all of them. When would be the best time to schedule these? We're keen to move quickly on this role. Also, should we prepare any specific materials for the candidates beforehand? Thanks, Michael",
        senderName: "Michael Roberts",
        senderEmail: "michael@creativestudios.co.uk",
        senderType: "employer",
        timestamp: "2025-01-14T08:45:00Z",
        isRead: true,
        priority: "medium",
        status: "in_progress",
        assignedTo: "Holly",
        companyName: "Creative Studios",
        relatedJob: "UX Designer"
      },
      {
        id: "4",
        type: "technical_issue",
        subject: "PDF export not working for candidate profiles",
        content: "We're experiencing issues with the PDF export feature for candidate profiles. When we click the download button, nothing happens. This is affecting our ability to share profiles with our hiring team offline. Please prioritize this fix. Best, David Chen",
        senderName: "David Chen",
        senderEmail: "david@digitalmediacorp.com",
        senderType: "employer",
        timestamp: "2025-01-13T16:20:00Z",
        isRead: true,
        priority: "high",
        status: "resolved",
        companyName: "Digital Media Corp"
      },
      {
        id: "5",
        type: "platform_feedback",
        subject: "Fantastic candidate matching system!",
        content: "Just wanted to say how impressed we are with Pollen's matching algorithm. The candidates we've received for our Content Writer role are exactly what we were looking for. The behavioral insights are particularly valuable. Keep up the excellent work! Best regards, Lisa Thompson",
        senderName: "Lisa Thompson",
        senderEmail: "lisa@growthtech.io",
        senderType: "employer",
        timestamp: "2025-01-13T14:10:00Z",
        isRead: true,
        priority: "low",
        status: "closed",
        companyName: "GrowthTech"
      },
      {
        id: "6",
        type: "candidate_support",
        subject: "Profile visibility question",
        content: "Hi, I completed my profile and assessment last week but haven't heard back from any employers yet. Is my profile visible to hiring managers? Should I be doing anything else to increase my chances? Any advice would be appreciated. Thanks, Priya",
        senderName: "Priya Singh",
        senderEmail: "priya.singh@email.com",
        senderType: "candidate",
        timestamp: "2025-01-13T11:30:00Z",
        isRead: true,
        priority: "medium",
        status: "resolved",
        candidateId: "23"
      },
      {
        id: "7",
        type: "candidate_support",
        subject: "Interview availability confirmation",
        content: "Hi Holly, Thank you for letting me know about the interview opportunity with K7 Media Group! I'm very excited about this role. I wanted to confirm my availability for next week - I'm free Monday through Wednesday between 10am-4pm, and Friday after 2pm. Please let me know what works best for their schedule. Looking forward to meeting the team. Best regards, Emma",
        senderName: "Emma Thompson",
        senderEmail: "emma.thompson@email.com",
        senderType: "candidate",
        timestamp: "2025-01-12T09:15:00Z",
        isRead: true,
        priority: "medium",
        status: "resolved",
        candidateId: "22"
      },
      {
        id: "8",
        type: "platform_feedback",
        subject: "Assessment interface improvement suggestion",
        content: "Hi team, I wanted to share some feedback about the assessment interface. Overall it's intuitive, but I noticed the timer isn't visible on mobile devices which made me anxious about running out of time. Also, it would be helpful to have a progress indicator showing how many questions are left. Thanks for creating such a thorough platform! Best, Alex",
        senderName: "Alex Johnson",
        senderEmail: "alex.johnson@email.com",
        senderType: "candidate",
        timestamp: "2025-01-13T16:45:00Z",
        isRead: true,
        priority: "low",
        status: "in_progress",
        candidateId: "25"
      },
      {
        id: "9",
        type: "technical_issue",
        subject: "Video upload failed during assessment",
        content: "Hello, I encountered a technical issue while uploading my video response for the final assessment question. The upload keeps failing after reaching 90% completion. I've tried multiple times and different browsers. Could you please help me submit this? I don't want to miss the deadline. Thank you, Michael",
        senderName: "Michael Roberts",
        senderEmail: "michael.roberts@email.com",
        senderType: "candidate",
        timestamp: "2025-01-13T14:20:00Z",
        isRead: false,
        priority: "high",
        status: "new",
        candidateId: "24"
      },
      {
        id: "10",
        type: "candidate_support",
        subject: "Thank you for the feedback and next steps",
        content: "Hi Holly, Thank you so much for the detailed feedback after my Pollen interview yesterday. I really appreciate the constructive comments about improving my presentation skills and the recommendation for the online course. I've already enrolled and am excited to start. I wanted to ask about potential next steps - are there any other roles coming up that might be a good fit? I'm particularly interested in the marketing assistant positions. Thanks again for all your support throughout the process. Best regards, Sophie",
        senderName: "Sophie Williams",
        senderEmail: "sophie.williams@email.com",
        senderType: "candidate",
        timestamp: "2025-01-13T11:30:00Z",
        isRead: false,
        priority: "medium",
        status: "new",
        candidateId: "8"
      },
      {
        id: "11",
        type: "candidate_support",
        subject: "Interview scheduling confirmation",
        content: "Hello, I just wanted to confirm my Pollen interview is scheduled for tomorrow at 2pm. I've received the calendar invite and have prepared thoroughly. Looking forward to discussing the marketing assistant opportunity at TechFlow Solutions. Is there anything specific I should bring or prepare? Thanks, Sophie",
        senderName: "Sophie Williams",
        senderEmail: "sophie.williams@email.com",
        senderType: "candidate",
        timestamp: "2025-01-12T14:15:00Z",
        isRead: true,
        priority: "low",
        status: "resolved",
        candidateId: "8"
      }
    ]
  });

  const replyMutation = useMutation({
    mutationFn: async (data: { messageId: string, content: string }) => {
      return await apiRequest("POST", `/api/admin/messages/${data.messageId}/reply`, {
        content: data.content,
        repliedBy: "Holly"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/messages"] });
      setReplyContent("");
      toast({
        title: "Reply sent",
        description: "Your reply has been sent successfully",
      });
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: string) => {
      return await apiRequest("PUT", `/api/admin/messages/${messageId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/messages"] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (data: { messageId: string, status: string }) => {
      return await apiRequest("PUT", `/api/admin/messages/${data.messageId}/status`, {
        status: data.status
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/messages"] });
      toast({
        title: "Status updated",
        description: "Message status has been updated",
      });
    },
  });



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'employer_inquiry':
        return <Building2 className="h-4 w-4" />;
      case 'candidate_support':
        return <User className="h-4 w-4" />;
      case 'technical_issue':
        return <AlertCircle className="h-4 w-4" />;
      case 'platform_feedback':
        return <Star className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getSenderTypeInfo = (senderType: string) => {
    switch (senderType) {
      case 'employer':
        return {
          icon: <Building2 className="h-4 w-4" />,
          label: 'Employer',
          badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
          borderColor: 'border-l-blue-500'
        };
      case 'candidate':
        return {
          icon: <User className="h-4 w-4" />,
          label: 'Job Seeker',
          badgeColor: 'bg-green-100 text-green-800 border-green-200',
          borderColor: 'border-l-green-500'
        };
      default:
        return {
          icon: <User className="h-4 w-4" />,
          label: 'User',
          badgeColor: 'bg-gray-100 text-gray-800 border-gray-200',
          borderColor: 'border-l-gray-500'
        };
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const filteredMessages = messages?.filter(message => {
    // If candidateId is provided, filter to show only messages for that candidate
    if (candidateId) {
      return message.candidateId === candidateId;
    }
    
    // Otherwise, use the normal filtering logic
    const matchesFilter = filterType === "all" || message.type === filterType || message.status === filterType;
    const matchesSearch = searchQuery === "" || 
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const unreadCount = messages?.filter(m => !m.isRead).length || 0;

  return (
    <div className="min-h-screen bg-gray-50 admin-compact-mode">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                onClick={() => setLocation("/admin")}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-xl font-bold text-gray-900 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                {candidateId ? `Messages for ${candidateDetails?.name || `Candidate ${candidateId}`}` : 'Messages'}
                {unreadCount > 0 && (
                  <Badge className="ml-2 bg-red-100 text-red-800">{unreadCount} unread</Badge>
                )}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Messages List */}
          <div className="flex-1">
            {/* Filters and Search */}
            <div className="mb-4 flex gap-4">
              <div className="flex-1 relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-md text-sm"
              >
                <option value="all">All Messages</option>
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
                <option value="employer_inquiry">Employer Inquiries</option>
                <option value="candidate_support">Candidate Support</option>
                <option value="technical_issue">Technical Issues</option>
              </select>
            </div>

            {/* Messages List */}
            <div className="space-y-3">
              {filteredMessages?.map((message) => {
                const senderInfo = getSenderTypeInfo(message.senderType);
                return (
                  <Card 
                    key={message.id}
                    className={`cursor-pointer transition-all hover:shadow-md border-l-4 ${
                      !message.isRead ? `${senderInfo.borderColor} bg-blue-50` : senderInfo.borderColor
                    } ${selectedMessage?.id === message.id ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => {
                      setSelectedMessage(message);
                      if (!message.isRead) {
                        markAsReadMutation.mutate(message.id);
                      }
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(message.type)}
                          <h3 className="font-medium text-gray-900">{message.subject}</h3>
                          {!message.isRead && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={senderInfo.badgeColor}>
                            {senderInfo.icon}
                            <span className="ml-1">{senderInfo.label}</span>
                          </Badge>

                          <Badge className={getStatusColor(message.status)}>
                            {message.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <div className="flex items-center space-x-4">
                          <span className="font-medium">{message.senderName}</span>
                          {message.companyName && (
                            <span className="text-gray-500">• {message.companyName}</span>
                          )}
                          {message.relatedJob && (
                            <span className="text-gray-500">• {message.relatedJob}</span>
                          )}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTimestamp(message.timestamp)}
                        </div>
                      </div>
                      
                      <p className="text-gray-700 text-sm line-clamp-2">{message.content}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Message Detail Panel */}
          {selectedMessage && (
            <div className="w-1/2">
              <Card className="h-fit">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{selectedMessage.subject}</CardTitle>
                      <div className="flex items-center space-x-2 mt-2 text-sm text-gray-600">
                        <span>{selectedMessage.senderName}</span>
                        <span>•</span>
                        <span>{selectedMessage.senderEmail}</span>
                        {selectedMessage.companyName && (
                          <>
                            <span>•</span>
                            <span>{selectedMessage.companyName}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Badge className={getSenderTypeInfo(selectedMessage.senderType).badgeColor}>
                        {getSenderTypeInfo(selectedMessage.senderType).icon}
                        <span className="ml-1">{getSenderTypeInfo(selectedMessage.senderType).label}</span>
                      </Badge>

                      <Badge className={getStatusColor(selectedMessage.status)}>
                        {selectedMessage.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="mb-6">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.content}</p>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2 mb-4">
                    <Button 
                      size="sm"
                      onClick={() => updateStatusMutation.mutate({ 
                        messageId: selectedMessage.id, 
                        status: 'in_progress' 
                      })}
                      disabled={selectedMessage.status === 'in_progress'}
                    >
                      Mark In Progress
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatusMutation.mutate({ 
                        messageId: selectedMessage.id, 
                        status: 'resolved' 
                      })}
                      disabled={selectedMessage.status === 'resolved'}
                    >
                      Mark Resolved
                    </Button>
                  </div>

                  {/* Reply Section */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Reply</h4>
                    <Textarea 
                      placeholder="Type your reply..."
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      className="mb-3"
                      rows={4}
                    />
                    <Button 
                      onClick={() => replyMutation.mutate({ 
                        messageId: selectedMessage.id, 
                        content: replyContent 
                      })}
                      disabled={!replyContent.trim() || replyMutation.isPending}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Reply
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}