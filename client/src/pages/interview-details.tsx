import { useParams, useLocation } from 'wouter';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, Clock, MapPin, Users, ExternalLink, Video, Phone } from 'lucide-react';

interface Interview {
  id: string;
  company: string;
  position: string;
  date: string;
  time: string;
  duration: string;
  type: string;
  location: string;
  status: string;
  interviewers: string[];
  meetingLink?: string;
  notes: string;
}

export default function InterviewDetails() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();

  // Mock interview data - in real app this would come from API
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
      time: "14:30",
      duration: "45 minutes",
      type: "video",
      location: "Google Meet",
      status: "confirmed",
      interviewers: ["Sarah Johnson (Marketing Director)", "Mike Chen (Team Lead)"],
      meetingLink: "https://meet.google.com/xyz-abc-def",
      notes: "First round interview - discuss your interest in the marketing field and career goals"
    },
    {
      id: "int-003",
      company: "TechFlow Solutions",
      position: "Content Specialist",
      date: "2025-02-05",
      time: "10:00",
      duration: "60 minutes",
      type: "in-person",
      location: "TechFlow Office, 123 Business St, London",
      status: "confirmed",
      interviewers: ["Lisa Thompson (HR Manager)", "David Wilson (Content Team Lead)"],
      notes: "Introductory chat to discuss your interest in content writing and career aspirations"
    }
  ];

  const interview = interviews.find(int => int.id === id);

  if (!interview) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Interview Not Found</h1>
          <Button onClick={() => setLocation('/interview-schedule')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Schedule
          </Button>
        </div>
      </div>
    );
  }

  const getCompanyBadge = (company: string) => {
    if (company === 'Pollen Team') {
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pollen Team</Badge>;
    }
    return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Employer Interview</Badge>;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'phone':
        return <Phone className="w-5 h-5" />;
      case 'in-person':
        return <MapPin className="w-5 h-5" />;
      default:
        return <Calendar className="w-5 h-5" />;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/interview-schedule')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Schedule
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{interview.position}</h1>
              <p className="text-lg text-gray-600">{interview.company}</p>
            </div>
            {getCompanyBadge(interview.company)}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Details */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Interview Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Date</h3>
                    <p className="text-gray-700">{formatDate(interview.date)}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Time</h3>
                    <p className="text-gray-700">{interview.time} ({interview.duration})</p>
                  </div>
                </div>

                <Separator />

                {/* Type and Location */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    {getTypeIcon(interview.type)}
                    Interview Format
                  </h3>
                  <p className="text-gray-700 capitalize">{interview.type}</p>
                  <p className="text-gray-600 mt-1">{interview.location}</p>
                </div>

                <Separator />

                {/* Interviewers */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Interviewers
                  </h3>
                  <ul className="space-y-1">
                    {interview.interviewers.map((interviewer, index) => (
                      <li key={index} className="text-gray-700">{interviewer}</li>
                    ))}
                  </ul>
                </div>

                {interview.notes && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
                      <p className="text-gray-700">{interview.notes}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-4">
            {interview.meetingLink && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Join Interview</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full"
                    onClick={() => window.open(interview.meetingLink, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Join Meeting
                  </Button>
                  <p className="text-sm text-gray-600 mt-2">
                    Meeting link will be active 10 minutes before the scheduled time.
                  </p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Preparation Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {interview.company === 'Pollen Team' ? (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-700">• Review your application</p>
                    <p className="text-sm text-gray-700">• Prepare questions about the role</p>
                    <p className="text-sm text-gray-700">• Discuss career goals</p>
                    <p className="text-sm text-gray-700">• Ask about interview prep tips</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-700">• Research the company</p>
                    <p className="text-sm text-gray-700">• Review the job description</p>
                    <p className="text-sm text-gray-700">• Prepare relevant examples</p>
                    <p className="text-sm text-gray-700">• Test your tech setup</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  onClick={() => setLocation(`/interview-confirmation/${interview.id}`)}
                  className="w-full"
                >
                  View Confirmation Details
                </Button>
                <Button variant="outline" className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  Add to Calendar
                </Button>
                <Button variant="outline" className="w-full">
                  Reschedule
                </Button>
                {interview.company !== 'Pollen Team' && (
                  <Button variant="outline" className="w-full">
                    Contact Employer
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}