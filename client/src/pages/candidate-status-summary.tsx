import React from "react";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { 
  ArrowLeft, Calendar, Clock, CheckCircle, User, MessageSquare, 
  Eye, AlertCircle, Mail, Phone, Video, Building2 
} from "lucide-react";

interface StatusUpdate {
  id: string;
  timestamp: string;
  action: string;
  description: string;
  performer: 'employer' | 'candidate' | 'system';
  status: 'completed' | 'pending' | 'overdue';
}

export default function CandidateStatusSummary() {
  const { candidateId } = useParams();
  const [, setLocation] = useLocation();

  console.log('🔥 CandidateStatusSummary rendered with candidateId:', candidateId);

  // Fetch real candidate data
  const { data: candidate, isLoading: candidateLoading } = useQuery({
    queryKey: [`/api/candidates/${candidateId}`],
    enabled: !!candidateId
  });

  // Generate status history based on actual candidate status
  const generateStatusHistory = (candidateData: any): StatusUpdate[] => {
    if (!candidateData) return [];
    
    const baseHistory = [
      {
        id: '1',
        timestamp: '2025-01-20 14:30',
        action: 'Application Received',
        description: `${candidateData.firstName} ${candidateData.lastName} applied for ${candidateData.jobAppliedFor || 'Marketing Assistant'} position`,
        performer: 'candidate' as const,
        status: 'completed' as const
      },
      {
        id: '2', 
        timestamp: '2025-01-20 15:45',
        action: 'Profile Review Completed',
        description: `You reviewed ${candidateData.firstName}'s profile and marked ${candidateData.firstName === 'Priya' ? 'her' : 'him'} as suitable for interview`,
        performer: 'employer' as const,
        status: 'completed' as const
      }
    ];

    // Add status-specific entries based on current status
    switch(candidateData.status) {
      case 'new':
      case 'new_application':
        return baseHistory;
      
      case 'interview_scheduled':
        return [
          ...baseHistory,
          {
            id: '3',
            timestamp: '2025-01-21 09:15',
            action: 'Interview Invitation Sent',
            description: 'Interview invitation sent with 3 available time slots for next week',
            performer: 'employer' as const,
            status: 'completed' as const
          },
          {
            id: '4',
            timestamp: '2025-01-21 09:16',
            action: 'Interview Scheduled',
            description: 'Interview confirmed for Friday, 24 Jan at 2:00 PM',
            performer: 'candidate' as const,
            status: 'completed' as const
          }
        ];
      
      case 'in_progress':
        return [
          ...baseHistory,
          {
            id: '3',
            timestamp: '2025-01-21 09:15',
            action: 'Interview Invitation Sent',
            description: 'Interview invitation sent with 3 available time slots for next week',
            performer: 'employer' as const,
            status: 'completed' as const
          },
          {
            id: '4',
            timestamp: '2025-01-21 09:16',
            action: 'Waiting for Interview Booking',
            description: 'Candidate needs to select and confirm interview time slot',
            performer: 'candidate' as const,
            status: 'pending' as const
          }
        ];
      
      case 'interview_complete':
      case 'interview_completed':
        return [
          ...baseHistory,
          {
            id: '3',
            timestamp: '2025-01-21 09:15',
            action: 'Interview Invitation Sent',
            description: 'Interview invitation sent with 3 available time slots for next week',
            performer: 'employer' as const,
            status: 'completed' as const
          },
          {
            id: '4',
            timestamp: '2025-01-21 10:30',
            action: 'Interview Completed',
            description: 'Interview conducted successfully. Candidate demonstrated strong knowledge and cultural fit.',
            performer: 'employer' as const,
            status: 'completed' as const
          }
        ];
      
      case 'complete':
      case 'job_offered':
        return [
          ...baseHistory,
          {
            id: '3',
            timestamp: '2025-01-21 09:15',
            action: 'Interview Invitation Sent',
            description: 'Interview invitation sent with 3 available time slots for next week',
            performer: 'employer' as const,
            status: 'completed' as const
          },
          {
            id: '4',
            timestamp: '2025-01-21 10:30',
            action: 'Interview Completed',
            description: 'Interview conducted successfully. Candidate demonstrated strong knowledge and cultural fit.',
            performer: 'employer' as const,
            status: 'completed' as const
          },
          {
            id: '5',
            timestamp: '2025-01-21 14:20',
            action: 'Feedback Provided',
            description: 'Interview feedback completed: Communication (4/5), Role Understanding (4/5), Values Alignment (5/5). Constructive feedback provided focusing on strengths and development areas.',
            performer: 'employer' as const,
            status: 'completed' as const
          }
        ];
      
      default:
        return baseHistory;
    }
  };

  // Use real candidate data to generate status history
  const statusHistory = candidate ? generateStatusHistory(candidate) : [];

  if (candidateLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Candidate Not Found</h1>
            <Button onClick={() => setLocation('/candidates')}>
              Back to Candidates
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPerformerColor = (performer: string) => {
    switch (performer) {
      case 'employer':
        return 'text-blue-700 bg-blue-50';
      case 'candidate':
        return 'text-green-700 bg-green-50';
      case 'system':
        return 'text-gray-700 bg-gray-50';
      default:
        return 'text-gray-700 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => setLocation('/candidates')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Candidates
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900" style={{fontFamily: 'Sora'}}>
              Candidate Actions & Timeline
            </h1>
            <p className="text-gray-600">
              {candidate.firstName} {candidate.lastName} • {candidate.jobAppliedFor || 'Marketing Assistant'}
            </p>
          </div>
        </div>

        {/* Candidate Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold" style={{fontFamily: 'Sora'}}>
                    {candidate.firstName[0]}{candidate.lastName[0]}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">
                    {candidate.firstName} {candidate.lastName}
                  </h2>
                  <p className="text-gray-600">
                    {candidate.jobAppliedFor || 'Marketing Assistant'}
                  </p>
                </div>
              </div>
              <Badge variant="default" className={
                candidate.status === 'complete' || candidate.status === 'job_offered' || candidate.status === 'hired' 
                  ? "bg-gray-100 text-gray-800" 
                  : candidate.status === 'new' || candidate.status === 'new_application'
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }>
                {candidate.status === 'complete' || candidate.status === 'job_offered' ? 'Complete' : 
                 candidate.status === 'hired' ? 'Hired' :
                 candidate.status === 'new' || candidate.status === 'new_application' ? 'New' : 'In Progress'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Applied: {candidate.appliedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm">Match Score: {candidate.matchScore}%</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span className="text-sm">{candidate.email}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Status Alert */}
        <Card className={`mb-6 ${
          candidate.status === 'complete' || candidate.status === 'job_offered' || candidate.status === 'hired'
            ? 'border-gray-200 bg-gray-50' 
            : candidate.status === 'new' || candidate.status === 'new_application'
            ? 'border-green-200 bg-green-50'
            : 'border-yellow-200 bg-yellow-50'
        }`}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {candidate.status === 'complete' || candidate.status === 'job_offered' || candidate.status === 'hired' ? 
                <CheckCircle className="w-5 h-5 text-gray-600 mt-0.5" /> :
                candidate.status === 'new' || candidate.status === 'new_application' ?
                <AlertCircle className="w-5 h-5 text-green-600 mt-0.5" /> :
                <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
              }
              <div>
                <h3 className={`font-semibold text-sm ${
                  candidate.status === 'complete' || candidate.status === 'job_offered' || candidate.status === 'hired'
                    ? 'text-gray-800' 
                    : candidate.status === 'new' || candidate.status === 'new_application'
                    ? 'text-green-800'
                    : 'text-yellow-800'
                }`}>
                  {candidate.status === 'complete' || candidate.status === 'job_offered' ? 'Feedback Provided' : 
                   candidate.status === 'hired' ? 'Successfully Hired' :
                   candidate.status === 'new' || candidate.status === 'new_application' ? 'New Application' :
                   candidate.status === 'interview_scheduled' ? 'Interview Scheduled' :
                   candidate.status === 'interview_complete' || candidate.status === 'interview_completed' ? 'Interview Complete' :
                   'Awaiting Candidate Response'}
                </h3>
                <p className={`text-sm mt-1 ${
                  candidate.status === 'complete' || candidate.status === 'job_offered' || candidate.status === 'hired'
                    ? 'text-gray-600' 
                    : candidate.status === 'new' || candidate.status === 'new_application'
                    ? 'text-green-700'
                    : 'text-yellow-700'
                }`}>
                  {candidate.status === 'complete' || candidate.status === 'job_offered' ? 
                    'All interview feedback has been submitted. Candidate review process is complete.' :
                   candidate.status === 'hired' ?
                    `Congratulations! ${candidate.firstName} has been successfully hired for this position.` :
                   candidate.status === 'new' || candidate.status === 'new_application' ?
                    `${candidate.firstName} has submitted their application and is ready for profile review.` :
                   candidate.status === 'interview_scheduled' ?
                    'Interview has been scheduled and confirmed with the candidate.' :
                   candidate.status === 'interview_complete' || candidate.status === 'interview_completed' ?
                    'Interview has been completed, waiting for your feedback.' :
                    `Interview invitation sent on Jan 21, 9:15 AM. Waiting for ${candidate.firstName} to select and confirm an interview time slot.`
                  }
                </p>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => {
                    // Map candidate ID to conversation ID for direct messaging
                    const candidateMessageMapping: Record<string, string> = {
                      '20': '1', // Sarah Chen
                      '21': '2', // James Mitchell
                      '22': '3', // Emma Thompson
                      '23': '4', // Priya Singh
                      '24': '5', // Michael Roberts
                      '25': '6'  // Alex Johnson
                    };
                    const conversationId = candidateMessageMapping[candidateId || ''] || '1';
                    setLocation(`/employer-messages?conversation=${conversationId}`);
                  }}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setLocation(`/candidates/${candidateId}`)}>
                    <Eye className="w-4 h-4 mr-2" />
                    View Profile
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conversation History & Actions Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Complete Conversation History</CardTitle>
            <p className="text-sm text-gray-600">All interactions, messages, and actions with this candidate</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statusHistory.map((update, index) => (
                <div key={update.id} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    {getStatusIcon(update.status)}
                    {index < statusHistory.length - 1 && (
                      <div className="w-px h-8 bg-gray-200 mt-2"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900">{update.action}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`text-xs ${getPerformerColor(update.performer)}`}>
                          {update.performer === 'employer' ? 'You' : update.performer.charAt(0).toUpperCase() + update.performer.slice(1)}
                        </Badge>
                        <span className="text-xs text-gray-500">{update.timestamp}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{update.description}</p>
                    {/* Show detailed feedback for completed feedback action */}
                    {candidate.status === 'complete' && update.action === 'Feedback Provided' && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <h5 className="font-medium text-blue-800 mb-2">Interview Feedback</h5>
                        <div className="space-y-2 text-sm text-blue-700">
                          <p><strong>Overall Performance:</strong> Excellent - demonstrated strong digital marketing knowledge and creative thinking</p>
                          <p><strong>Technical Skills:</strong> Strong understanding of social media platforms, content strategy, and basic analytics</p>
                          <p><strong>Communication:</strong> Clear, confident communication style with good listening skills</p>
                          <p><strong>Cultural Fit:</strong> Enthusiastic about collaborative work environment and shows genuine interest in company mission</p>
                          <p><strong>Next Steps:</strong> Application marked as complete with positive assessment. Strong candidate for future opportunities.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setLocation(`/candidates/${candidateId}`)}
              >
                <Eye className="w-4 h-4" />
                View Full Profile
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => {
                  // Map candidate ID to conversation ID for direct messaging
                  const candidateMessageMapping: Record<string, string> = {
                    '20': '1', // Sarah Chen
                    '21': '2', // James Mitchell
                    '22': '3', // Emma Thompson
                    '23': '4', // Priya Singh
                    '24': '5', // Michael Roberts
                    '25': '6'  // Alex Johnson
                  };
                  const conversationId = candidateMessageMapping[candidateId || ''] || '1';
                  setLocation(`/employer-messages?conversation=${conversationId}`);
                }}
              >
                <MessageSquare className="w-4 h-4" />
                Send Message
              </Button>
              {candidate.status !== 'complete' && candidate.status !== 'job_offered' && candidate.status !== 'hired' && (
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => setLocation(`/candidate-next-steps/${candidateId}`)}
                >
                  <Calendar className="w-4 h-4" />
                  View Interview Details
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}