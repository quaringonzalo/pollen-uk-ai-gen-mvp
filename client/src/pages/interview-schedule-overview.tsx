import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Video, 
  Phone, 
  ArrowLeft,
  Building2,
  User,
  MessageSquare,
  CheckCircle,
  ExternalLink,
  Plus,
  Download,
  ChevronDown
} from "lucide-react";

interface InterviewItem {
  id: string;
  applicationId: string;
  jobTitle: string;
  companyName: string;
  companyLogo: string;
  interviewDate: string;
  interviewTime: string;
  interviewType: 'video' | 'phone' | 'in_person';
  interviewLocation?: string;
  interviewerName: string;
  interviewerRole: string;
  status: 'invited' | 'scheduled' | 'completed' | 'cancelled';
  duration: string;
  meetingLink?: string;
  notes?: string;
}

const MOCK_INTERVIEWS: InterviewItem[] = [
  // Upcoming interviews
  {
    id: '1',
    applicationId: '1',
    jobTitle: 'Marketing Assistant - TechFlow Solutions',
    companyName: 'Pollen Team',
    companyLogo: '/attached_assets/Holly_1752681740688.jpg',
    interviewDate: '2025-07-20',
    interviewTime: '14:00',
    interviewType: 'video',
    interviewerName: 'Holly Saunders',
    interviewerRole: 'Talent Partner',
    status: 'scheduled',
    duration: '20 minutes',
    meetingLink: 'https://meet.google.com/pol-len-team',
    notes: 'Initial screening call to discuss your background and the Marketing Assistant role at TechFlow Solutions. We\'ll cover your experience, motivations, and answer any questions about the position.'
  },
  {
    id: '2',
    applicationId: '2',
    jobTitle: 'Social Media Coordinator - Creative Media Co',
    companyName: 'Pollen Team',
    companyLogo: '/attached_assets/Holly_1752681740688.jpg',
    interviewDate: '',
    interviewTime: '',
    interviewType: 'video',
    interviewerName: 'Holly Saunders',
    interviewerRole: 'Talent Partner',
    status: 'invited',
    duration: '20 minutes',
    notes: 'You\'ve been invited to schedule a Pollen screening call. Please book a time that works for you to discuss the Social Media Coordinator role at Creative Media Co.'
  },
  {
    id: '3',
    applicationId: '3',
    jobTitle: 'Customer Support Specialist',
    companyName: 'StartupHub',
    companyLogo: 'https://images.unsplash.com/photo-1494790108755-2616b9c96436?w=150&h=150&fit=crop&crop=face',
    interviewDate: '2025-07-25',
    interviewTime: '11:00',
    interviewType: 'in_person',
    interviewLocation: 'StartupHub Office, 456 Innovation Street, London SW1A 1AA',
    interviewerName: 'Emma Wilson',
    interviewerRole: 'Customer Success Manager',
    status: 'scheduled',
    duration: '45 minutes',
    meetingLink: '',
    notes: 'Final interview - meet the team and discuss specific scenarios. Please bring examples of how you\'ve handled challenging customer situations.'
  },
  {
    id: '4',
    applicationId: '4',
    jobTitle: 'Junior Developer',
    companyName: 'Digital Solutions Ltd',
    companyLogo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    interviewDate: '',
    interviewTime: '',
    interviewType: 'video',
    interviewerName: 'Sarah Chen',
    interviewerRole: 'Engineering Manager',
    status: 'invited',
    duration: '60 minutes',
    meetingLink: 'https://teams.microsoft.com/l/meetup-join/19...',
    notes: 'Technical interview covering coding fundamentals, problem-solving, and team collaboration. We\'ll do some live coding exercises together.'
  },
  // Past interviews
  {
    id: '5',
    applicationId: '5',
    jobTitle: 'Content Writer - Creative Media Co',
    companyName: 'Pollen Team',
    companyLogo: '/attached_assets/Holly_1752681740688.jpg',
    interviewDate: '2025-01-10',
    interviewTime: '16:00',
    interviewType: 'video',
    interviewerName: 'Holly Saunders',
    interviewerRole: 'Talent Partner',
    status: 'completed',
    duration: '30 minutes',
    notes: 'Initial screening completed for Creative Media Co Content Writer position - discussed writing experience and creative process. Feedback: Strong portfolio, good communication skills.'
  },
  {
    id: '6',
    applicationId: '6',
    jobTitle: 'Data Analyst',
    companyName: 'TechFlow Solutions',
    companyLogo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    interviewDate: '2025-01-08',
    interviewTime: '13:00',
    interviewType: 'phone',
    interviewerName: 'Michael Chen',
    interviewerRole: 'Data Team Lead',
    status: 'completed',
    duration: '45 minutes',
    notes: 'Technical discussion about data analysis methods and tools. Good understanding of Python and SQL. Awaiting final decision.'
  }
];

export default function InterviewScheduleOverview() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const getInterviewTypeIcon = (type: 'video' | 'phone' | 'in_person') => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4 text-blue-600" />;
      case 'phone':
        return <Phone className="w-4 h-4 text-green-600" />;
      case 'in_person':
        return <MapPin className="w-4 h-4 text-purple-600" />;
      default:
        return <CalendarIcon className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'invited':
        return <Badge variant="default" className="bg-orange-600">Needs Booking</Badge>;
      case 'scheduled':
        return <Badge variant="default" className="bg-blue-600">Scheduled</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-600">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleAddToGoogleCalendar = (interview: InterviewItem) => {
    const startDate = new Date(`${interview.interviewDate}T${interview.interviewTime}`);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour later
    
    const eventTitle = `Interview - ${interview.jobTitle}`;
    const eventDescription = `Interview with ${interview.companyName} for ${interview.jobTitle} position\\n\\nInterviewer: ${interview.interviewerName} (${interview.interviewerRole})\\n${interview.notes ? `\\nNotes: ${interview.notes}` : ''}`;
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${startDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}/${endDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}&details=${encodeURIComponent(eventDescription)}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  const handleAddToOutlookCalendar = (interview: InterviewItem) => {
    const startDate = new Date(`${interview.interviewDate}T${interview.interviewTime}`);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour later
    
    const eventTitle = `Interview - ${interview.jobTitle}`;
    const eventDescription = `Interview with ${interview.companyName} for ${interview.jobTitle} position\\n\\nInterviewer: ${interview.interviewerName} (${interview.interviewerRole})\\n${interview.notes ? `\\nNotes: ${interview.notes}` : ''}`;
    
    const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(eventTitle)}&startdt=${encodeURIComponent(startDate.toISOString())}&enddt=${encodeURIComponent(endDate.toISOString())}&body=${encodeURIComponent(eventDescription)}`;
    
    window.open(outlookUrl, '_blank');
  };

  const handleDownloadICS = (interview: InterviewItem) => {
    const startDate = new Date(`${interview.interviewDate}T${interview.interviewTime}`);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour later
    
    const formatICSDateTime = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
    };

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Pollen//Interview Scheduler//EN
BEGIN:VEVENT
UID:${interview.id}@pollen.com
DTSTART:${formatICSDateTime(startDate)}
DTEND:${formatICSDateTime(endDate)}
SUMMARY:${eventTitle}
DESCRIPTION:${eventDescription}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `interview-${interview.id}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const upcomingInterviews = MOCK_INTERVIEWS.filter(interview => {
    if (interview.status === 'invited') {
      return true; // Show all invited interviews
    }
    if (interview.status === 'scheduled') {
      const interviewDate = new Date(interview.interviewDate);
      const today = new Date();
      return interviewDate >= today;
    }
    return false;
  }).sort((a, b) => {
    // Sort invited interviews first, then by date
    if (a.status === 'invited' && b.status !== 'invited') return -1;
    if (b.status === 'invited' && a.status !== 'invited') return 1;
    
    if (a.status === 'scheduled' && b.status === 'scheduled') {
      return new Date(a.interviewDate).getTime() - new Date(b.interviewDate).getTime();
    }
    
    return 0;
  });

  const pastInterviews = MOCK_INTERVIEWS.filter(interview => 
    interview.status === 'completed'
  ).sort((a, b) => new Date(b.interviewDate).getTime() - new Date(a.interviewDate).getTime());

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Interview Schedule</h1>
          <p className="text-gray-600 mt-1">Manage your upcoming and past interviews</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => setLocation('/applications')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Applications
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/home')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>
      </div>

      {/* Upcoming Interviews */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Interviews</h2>
          <Badge variant="secondary">{upcomingInterviews.length} interviews</Badge>
        </div>

        {upcomingInterviews.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Upcoming Interviews</h3>
              <p className="text-gray-600 mb-4">When you're invited to interviews, they'll appear here</p>
              <Button onClick={() => setLocation('/applications')}>
                View My Applications
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {upcomingInterviews.map((interview) => (
              <Card 
                key={interview.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                  if (interview.status === 'invited') {
                    setLocation(`/interview-schedule/${interview.applicationId}`);
                  } else {
                    setLocation(`/interview-confirmation/${interview.applicationId}`);
                  }
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{interview.jobTitle}</CardTitle>
                        {interview.companyName === 'Pollen Team' ? (
                          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                            Chat with Pollen
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
                            Employer Stage
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {interview.companyName}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {interview.interviewerName} ({interview.interviewerRole})
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(interview.status)}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center gap-6 mb-4">
                    {interview.status === 'invited' ? (
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-medium text-orange-700">Awaiting your booking</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium">{formatDate(interview.interviewDate)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{interview.interviewTime} ({interview.duration})</span>
                        </div>
                      </>
                    )}
                    <div className="flex items-center gap-2">
                      {getInterviewTypeIcon(interview.interviewType)}
                      <span className="text-sm capitalize">{interview.interviewType.replace('_', ' ')}</span>
                    </div>
                  </div>

                  {interview.interviewLocation && (
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{interview.interviewLocation}</span>
                    </div>
                  )}

                  {interview.notes && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <p className="text-sm text-blue-800">
                        <strong>Interview Notes:</strong> {interview.notes}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    {interview.status === 'invited' ? (
                      <Button
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLocation(`/interview-schedule/${interview.applicationId}`);
                        }}
                      >
                        <CalendarIcon className="w-4 h-4" />
                        Schedule Interview
                      </Button>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="sm"
                            className="flex items-center gap-2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Plus className="w-4 h-4" />
                            Add to Calendar
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleAddToGoogleCalendar(interview); }}>
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            Google Calendar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleAddToOutlookCalendar(interview); }}>
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            Outlook Calendar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDownloadICS(interview); }}>
                            <Download className="w-4 h-4 mr-2" />
                            Download .ics file
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                    
                    {interview.meetingLink && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); window.open(interview.meetingLink, '_blank'); }}
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Join Meeting
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); setLocation(`/application-detail/${interview.applicationId}`); }}
                      className="flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      View Application
                    </Button>
                  </div>

                  <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <span>💡 Click anywhere on this card to view interview details and questions</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Past Interviews */}
      {pastInterviews.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Past Interviews</h2>
            <Badge variant="secondary">{pastInterviews.length} completed</Badge>
          </div>

          <div className="space-y-4">
            {pastInterviews.map((interview) => (
              <Card 
                key={interview.id} 
                className="opacity-75 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setLocation(`/interview-schedule/${interview.applicationId}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getInterviewTypeIcon(interview.interviewType)}
                        <span className="font-medium">{interview.jobTitle}</span>
                      </div>
                      <Badge variant="secondary">{interview.companyName}</Badge>
                      <span className="text-sm text-gray-600">
                        {formatDate(interview.interviewDate)} at {interview.interviewTime}
                      </span>
                    </div>
                    {getStatusBadge(interview.status)}
                  </div>
                  <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <span>💡 Click to view interview details</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}