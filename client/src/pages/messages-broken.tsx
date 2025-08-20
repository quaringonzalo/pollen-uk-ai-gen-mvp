import { MessageSquare, Search, AlertCircle, Calendar, CornerDownLeft, MoreHorizontal, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function MessagesPage() {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Messages</h1>
        <p className="text-gray-600">Direct communication with employers and hiring managers</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Messages</p>
                <p className="text-2xl font-bold text-gray-900">7</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unread Messages</p>
                <p className="text-2xl font-bold text-blue-600">5</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Need Response</p>
                <p className="text-2xl font-bold text-orange-600">5</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Response Alert */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
          <div>
            <p className="text-sm text-orange-800">
              <span className="font-semibold">You have 5 messages waiting for your response</span>
            </p>
            <p className="text-sm text-orange-700 mt-1">
              Quick responses show professionalism and keep employers engaged with your applications
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search messages by company, job title, or recruiter name..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {/* Messages restored to match attachment 4 design with stats cards */}
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <img 
                src="https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=40&h=40&fit=crop&crop=face"
                alt="Sarah Chen"
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900">Sarah Chen</h3>
                    <Badge variant="outline" className="text-purple-700 border-purple-200 bg-purple-50">
                      Pollen Community
                    </Badge>
                    <Badge variant="outline" className="text-purple-700 border-purple-200 bg-purple-50">
                      Mentor
                    </Badge>
                    <Badge className="bg-orange-100 text-orange-800">
                      Response needed
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>16 Jan</span>
                    <Badge className="bg-blue-100 text-blue-800">NEW</Badge>
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-900 mb-1">Mentor Connection</p>
                  <p className="text-sm text-gray-700">
                    Hey Zara! Thanks for reaching out - I'd love to help! Finance to marketing was such a journey for me too. ...
                  </p>
                </div>
                
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                  Reply
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Additional message cards following same pattern... */}
      </div>
    </div>
  );
}
      name: "Sarah Chen",
      company: "Pollen Community",
      role: "Mentor",
      type: "mentor",
      lastMessage: "Hey Zara! Thanks for reaching out - I'd love to help! Finance to marketing was such a journey for me too. ...",
      timestamp: "16 Jan",
      unread: true,
      needsResponse: true,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=40&h=40&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Holly Saunders",
      company: "Pollen Team",
      role: "Marketing Specialist",
      type: "interview",
      lastMessage: "Hi Zara! I'm Holly from the Pollen team. I'd like to schedule a brief screening call to discuss your Marketin...",
      timestamp: "16 Jan", 
      unread: true,
      needsResponse: true,
      scheduledFor: "Monday 20 January 2025 at 14:00",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Emma Wilson",
      company: "StartupHub",
      role: "Customer Support Specialist",
      type: "interview",
      lastMessage: "Thanks for completing the Pollen screening! We'd love to meet you in person. Can you come to our office...",
      timestamp: "14 Jan",
      unread: true,
      needsResponse: true,
      scheduledFor: "Saturday 25 January 2025 at 11:00",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
    },
    {
      id: 4,
      name: "Mike Chen",
      company: "Creative Media Co",
      role: "Content Writer",
      type: "job_offer",
      lastMessage: "Congratulations! We'd love to offer you the Content Writer position at Creative Media Co. Starting salary ...",
      timestamp: "12 Jan",
      unread: true,
      needsResponse: true,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
    },
    {
      id: 5,
      name: "Sarah Tech",
      company: "Tech Startup",
      role: "Data Analyst",
      type: "job_offer",
      lastMessage: "Exciting news! We're pleased to offer you the Data Analyst position at Tech Startup. Starting salary is £32,...",
      timestamp: "28 Dec",
      unread: true,
      needsResponse: true,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=40&h=40&fit=crop&crop=face"
    },
    {
      id: 6,
      name: "Holly Saunders",
      company: "Pollen Team",
      role: "Social Media Coordinator - Creative Media Co",
      type: "interview",
      lastMessage: "Great to meet you! I've scheduled our screening call for Wednesday at 10:30 AM for your Creative Media Co applicati...",
      timestamp: "12 Jan",
      unread: false,
      scheduledFor: "Wednesday 22 January 2025 at 10:30",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
    },
    {
      id: 7,
      name: "Sarah Chen",
      company: "Digital Solutions Ltd",
      role: "Junior Developer",
      type: "interview",
      lastMessage: "Perfect! Looking forward to our technical interview next Monday at 3 PM. I'll send you the Teams link and a brief over...",
      timestamp: "13 Jan",
      unread: false,
      scheduledFor: "Tuesday 28 January 2025 at 15:00",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5c5?w=40&h=40&fit=crop&crop=face"
    }
  ];

  const totalMessages = conversations.length;
  const unreadMessages = conversations.filter(c => c.unread).length;
  const needResponse = conversations.filter(c => c.needsResponse).length;

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'mentor': return 'border-l-purple-500';
      case 'interview': return 'border-l-blue-500';
      case 'job_offer': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  const getMessageTypeBadge = (type: string) => {
    switch (type) {
      case 'mentor': 
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800 text-xs">Mentor</Badge>;
      case 'interview': 
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">Interview</Badge>;
      case 'job_offer': 
        return <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">Job Offer</Badge>;
      default: 
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
        <p className="text-gray-600">Direct communication with employers and hiring managers</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-full">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{totalMessages}</div>
                <div className="text-sm text-gray-600">Total Messages</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-full">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{unreadMessages}</div>
                <div className="text-sm text-gray-600">Unread Messages</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-full">
                <CornerDownLeft className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{needResponse}</div>
                <div className="text-sm text-gray-600">Need Response</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert */}
      <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
          <div>
            <p className="text-orange-800 font-medium">You have {needResponse} messages waiting for your response</p>
            <p className="text-orange-700 text-sm">Quick responses show professionalism and keep employers engaged with your applications</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search messages by company, job title, or recruiter name..."
            className="pl-10 bg-white"
          />
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {conversations.map((conversation) => (
          <Card key={conversation.id} className={`hover:shadow-md transition-shadow border-l-4 ${getMessageTypeColor(conversation.type)}`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <img 
                  src={conversation.avatar} 
                  alt={conversation.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{conversation.name}</h3>
                      {getMessageTypeBadge(conversation.type)}
                      {conversation.needsResponse && (
                        <Badge variant="outline" className="text-orange-600 border-orange-300">
                          Response needed
                        </Badge>
                      )}
                      {conversation.unread && (
                        <Badge className="bg-blue-600">NEW</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span className="text-sm text-gray-500">{conversation.timestamp}</span>
                      <Button variant="outline" size="sm" className="ml-2">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Reply
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <p className="text-sm font-medium text-gray-700">{conversation.role}</p>
                    {conversation.company && (
                      <p className="text-sm text-gray-600">{conversation.company}</p>
                    )}
                  </div>

                  {conversation.scheduledFor && (
                    <div className="mb-3 p-2 bg-blue-50 rounded flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-800">{conversation.scheduledFor}</span>
                    </div>
                  )}
                  
                  <p className="text-gray-700 text-sm line-clamp-2">{conversation.lastMessage}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}