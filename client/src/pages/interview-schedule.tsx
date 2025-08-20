import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Clock, MapPin, Video, Phone, Building, ExternalLink } from 'lucide-react';

interface Interview {
  id: string;
  company: string;
  position: string;
  date: string;
  time: string;
  duration: string;
  type: 'video' | 'phone' | 'in-person';
  location: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  interviewers: string[];
  meetingLink?: string;
  notes?: string;
}

export default function InterviewSchedule() {
  const [location, setLocation] = useLocation();
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'past'>('upcoming');

  // Mock interview data for job seekers - showing their scheduled interviews
  const interviews: Interview[] = [
    {
      id: "int-001",
      company: "Pollen Team",
      position: "Marketing Assistant - CreativeMinds Agency",
      date: "2025-01-28",
      time: "11:00",
      duration: "30 minutes",
      type: "video",
      location: "Pollen Platform",
      status: "confirmed",
      interviewers: ["Emma Davis (Talent Partner)"],
      meetingLink: "https://pollen.co/chat/assessment-123",
      notes: "This is a friendly chat to get to know you better and see if it's a good fit on both sides."
    },
    {
      id: "int-002",
      company: "CreativeMinds Agency",
      position: "Marketing Assistant",
      date: "2025-01-30",
      time: "14:00",
      duration: "60 minutes",
      type: "video",
      location: "Google Meet",
      status: "confirmed",
      interviewers: ["Sarah Johnson (Hiring Manager)", "Marcus Chen (Team Lead)"],
      meetingLink: "https://meet.google.com/xyz-abc-def",
      notes: "First round interview - discuss your interest in the marketing field and career goals"
    },
    {
      id: "int-003", 
      company: "TechStart Solutions",
      position: "Junior Data Analyst",
      date: "2025-02-03",
      time: "10:30",
      duration: "45 minutes",
      type: "phone",
      location: "Phone interview",
      status: "confirmed",
      interviewers: ["David Kim (Data Team Lead)"],
      notes: "Introductory phone call to discuss your interest in data analysis and career goals"
    }
  ];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getInterviewTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'phone':
        return <Phone className="w-4 h-4" />;
      case 'in-person':
        return <Building className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getCompanyBadge = (company: string) => {
    if (company === 'Pollen Team') {
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pollen Team</Badge>;
    }
    return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Employer Interview</Badge>;
  };

  const upcomingInterviews = interviews.filter(interview => 
    interview.status === 'confirmed'
  );

  const pastInterviews = interviews.filter(interview => 
    interview.status === 'completed'
  );

  const currentInterviews = selectedTab === 'upcoming' ? upcomingInterviews : pastInterviews;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={() => setLocation('/applications')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Applications
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Sora' }}>
            My Interviews
          </h1>
          <p className="text-gray-600">View and manage your upcoming and past interviews</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setSelectedTab('upcoming')}
            className={`${
              selectedTab === 'upcoming'
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
          >
            Upcoming ({upcomingInterviews.length})
          </button>
          <button
            onClick={() => setSelectedTab('past')}
            className={`${
              selectedTab === 'past'
                ? 'border-pink-500 text-pink-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
          >
            Past ({pastInterviews.length})
          </button>
        </nav>
      </div>

      {/* Interviews List */}
      <div className="space-y-4">
        {currentInterviews.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No {selectedTab} interviews
              </h3>
              <p className="text-gray-500">
                {selectedTab === 'upcoming' 
                  ? "You don't have any upcoming interviews scheduled."
                  : "You haven't conducted any interviews yet."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          currentInterviews.map((interview) => (
            <Card 
              key={interview.id} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setLocation(`/interview-confirmation/${interview.id}`)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getInterviewTypeIcon(interview.type)}
                      <div>
                        <h3 className="font-semibold text-gray-900" style={{ fontFamily: 'Sora' }}>
                          {interview.position}
                        </h3>
                        <p className="text-sm text-gray-600">{interview.company}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(interview.date)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatTime(interview.time)} ({interview.duration})
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {interview.location}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {getCompanyBadge(interview.company)}
                    {interview.meetingLink && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(interview.meetingLink, '_blank');
                        }}
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Join Meeting
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Interview Details */}
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Interviewing with:</div>
                    <div className="text-sm text-gray-700">
                      {interview.interviewers.join(', ')}
                    </div>
                  </div>
                  
                  {interview.notes && (
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Notes:</div>
                      <div className="text-sm text-gray-700">
                        {interview.notes}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}