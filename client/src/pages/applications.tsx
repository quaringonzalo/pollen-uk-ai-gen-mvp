import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  CheckCircle, 
  MessageSquare, 
  Calendar,
  Building2,
  MapPin,
  ArrowLeft,
  Eye,
  ExternalLink,
  Search,
  Mail,
  Bell,
  Trophy,
  X
} from "lucide-react";

interface Application {
  id: string;
  jobTitle: string;
  companyName: string;
  location: string;
  appliedDate: string;
  status: 'submitted' | 'under_review' | 'interview_invited' | 'interview_scheduled' | 'pollen_feedback' | 'employer_feedback' | 'not_progressing' | 'job_offer' | 'rejected';
  lastUpdate: string;
  feedbackAvailable?: boolean;
  interviewDate?: string;
  unreadMessages?: number;
  hasInterviews?: boolean;
}

const MOCK_APPLICATIONS: Application[] = [
  {
    id: '1',
    jobTitle: 'Marketing Assistant',
    companyName: 'TechFlow Solutions',
    location: 'Remote (UK)',
    appliedDate: '2025-01-01',
    status: 'interview_invited',
    lastUpdate: '2025-01-03',
    feedbackAvailable: true,
    unreadMessages: 1,
    hasInterviews: true
  },
  {
    id: '2',
    jobTitle: 'Social Media Coordinator',
    companyName: 'Creative Media Co',
    location: 'London',
    appliedDate: '2025-01-02',
    status: 'interview_scheduled',
    lastUpdate: '2025-01-02',
    interviewDate: '2025-01-05',
    feedbackAvailable: false,
    unreadMessages: 0,
    hasInterviews: true
  },
  {
    id: '3',
    jobTitle: 'Customer Support Specialist',
    companyName: 'StartupHub',
    location: 'Manchester',
    appliedDate: '2024-12-28',
    status: 'under_review',
    lastUpdate: '2025-01-01',
    feedbackAvailable: false,
    unreadMessages: 0,
    hasInterviews: false
  },
  {
    id: '4',
    jobTitle: 'Marketing Assistant',
    companyName: 'BrightFuture Marketing',
    location: 'Bristol',
    appliedDate: '2024-12-20',
    status: 'not_progressing',
    lastUpdate: '2024-12-28',
    feedbackAvailable: true,
    unreadMessages: 0,
    hasInterviews: false
  },
  {
    id: '5',
    jobTitle: 'Content Writer',
    companyName: 'Digital Agency',
    location: 'Birmingham',
    appliedDate: '2024-12-20',
    status: 'pollen_feedback',
    lastUpdate: '2024-12-22',
    feedbackAvailable: true,
    unreadMessages: 1,
    hasInterviews: false
  },
  {
    id: '7',
    jobTitle: 'Data Analyst',
    companyName: 'Tech Startup',
    location: 'Remote (UK)',
    appliedDate: '2024-12-15',
    status: 'job_offer',
    lastUpdate: '2024-12-28',
    feedbackAvailable: true,
    unreadMessages: 3,
    hasInterviews: true
  },
  {
    id: '6',
    jobTitle: 'Marketing Coordinator',
    companyName: 'InnovateCorp',
    location: 'Edinburgh',
    appliedDate: '2024-12-10',
    status: 'employer_feedback',
    lastUpdate: '2024-12-18',
    feedbackAvailable: true,
    unreadMessages: 0,
    hasInterviews: true
  }
];

export default function Applications() {
  const [, setLocation] = useLocation();
  
  const getStatusBadge = (status: Application['status']) => {
    switch (status) {
      case 'submitted':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Submitted</Badge>;
      case 'under_review':
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Under Review</Badge>;
      case 'interview_invited':
        return <Badge variant="default" className="bg-pink-600"><Calendar className="w-3 h-3 mr-1" />Schedule Interview</Badge>;
      case 'interview_scheduled':
        return <Badge variant="default" className="bg-blue-600"><Calendar className="w-3 h-3 mr-1" />Interview Scheduled</Badge>;
      case 'pollen_feedback':
        return <Badge variant="default" className="bg-amber-600"><MessageSquare className="w-3 h-3 mr-1" />Interview Complete</Badge>;
      case 'employer_feedback':
        return <Badge variant="default" className="bg-amber-600"><MessageSquare className="w-3 h-3 mr-1" />Interview Complete</Badge>;
      case 'not_progressing':
        return <Badge variant="destructive"><X className="w-3 h-3 mr-1" />Not Selected</Badge>;
      case 'job_offer':
        return <Badge variant="default" className="bg-green-600"><Trophy className="w-3 h-3 mr-1" />Job Offer</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Not Selected</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getStatusDescription = (application: Application) => {
    switch (application.status) {
      case 'submitted':
        return 'Your application has been submitted and is waiting for initial review.';
      case 'under_review':
        return 'Our team is reviewing your challenge response and shortlisting candidates.';
      case 'interview_invited':
        return 'Great news! You\'ve been invited to book your initial chat with the Pollen team to check this job is a good match for you.';
      case 'interview_scheduled':
        return `Interview scheduled for ${application.interviewDate}. Check your email for details.`;
      case 'pollen_feedback':
        return 'You completed your Pollen team interview. While you won\'t progress to the employer interview for this role, detailed feedback is available to help with future applications.';
      case 'employer_feedback':
        return 'You completed your interviews with the employer. While you won\'t receive an offer for this role, you gained valuable interview experience and comprehensive feedback.';
      case 'not_progressing':
        return 'Unfortunately, you were not selected for this position. Feedback is available to help with future applications.';
      case 'job_offer':
        return 'Congratulations! You have received a job offer for this position.';
      case 'rejected':
        return 'Unfortunately, you were not selected. Feedback available to help with future applications.';
      default:
        return 'Status unknown.';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6 applications-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Applications</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Track your job applications and receive feedback</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <Button 
            variant="outline" 
            onClick={() => setLocation('/messages')}
            className="flex items-center gap-2 w-full sm:w-auto text-xs sm:text-sm"
          >
            <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
            Messages
            {MOCK_APPLICATIONS.some(app => app.unreadMessages && app.unreadMessages > 0) && (
              <Badge className="ml-1 bg-red-500 text-white px-2 py-1 text-xs">
                {MOCK_APPLICATIONS.reduce((total, app) => total + (app.unreadMessages || 0), 0)}
              </Badge>
            )}
          </Button>

          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/jobs'}
            className="flex items-center gap-2 w-full sm:w-auto text-xs sm:text-sm"
          >
            <Search className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Continue Browsing Jobs</span>
            <span className="sm:hidden">Browse Jobs</span>
          </Button>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {MOCK_APPLICATIONS.map((application) => (
          <Card key={application.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4 p-5 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base sm:text-lg font-semibold mb-1" style={{ fontFamily: 'Sora, sans-serif' }}>{application.jobTitle}</CardTitle>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Building2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      {application.companyName}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                      {application.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      Applied {new Date(application.appliedDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="self-start">{getStatusBadge(application.status)}</div>
              </div>
            </CardHeader>
            
            <CardContent className="p-5 sm:p-8 pt-4 sm:pt-6">
              <p className="text-xs sm:text-sm text-gray-700 mb-6 sm:mb-8 leading-relaxed">
                {getStatusDescription(application)}
              </p>

              {/* Awaiting Feedback Example */}
              {application.status === 'under_review' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 sm:p-6 mb-5 sm:mb-6">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">Awaiting Feedback</h4>
                      <p className="text-sm text-blue-700 mb-2">
                        Your challenge response is being reviewed by our team. 
                        You'll receive detailed feedback within 1 week, regardless of outcome.
                      </p>
                      <p className="text-xs text-blue-600">
                        <strong>Expected feedback:</strong> {new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString()} by 6PM
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Pollen Feedback Example */}
              {application.status === 'pollen_feedback' && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 sm:p-6 mb-5 sm:mb-6">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-900 mb-1">Pollen Interview Complete</h4>
                      <p className="text-sm text-amber-700 mb-2">
                        You won't progress to the employer stage, but detailed feedback is available to help with future applications.
                      </p>
                      <p className="text-xs text-amber-600">
                        <strong>Includes:</strong> Interview performance and career guidance
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Employer Feedback Example */}
              {application.status === 'employer_feedback' && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 sm:p-6 mb-5 sm:mb-6">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-900 mb-1">All Interviews Complete</h4>
                      <p className="text-sm text-amber-700 mb-2">
                        While you won't receive an offer, you gained valuable experience and comprehensive feedback.
                      </p>
                      <p className="text-xs text-amber-600">
                        <strong>Includes:</strong> Both Pollen and employer interview insights
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Job Offer Example */}
              {application.status === 'job_offer' && (
                <div className="bg-pink-50 border border-pink-200 rounded-lg p-5 sm:p-6 mb-5 sm:mb-6">
                  <div className="flex items-start gap-3">
                    <Trophy className="w-5 h-5 text-pink-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-pink-900 mb-1">Job Offer Received!</h4>
                      <p className="text-sm text-pink-700 mb-2">
                        Congratulations! The employer has extended a job offer. 
                        Check your messages for full details and next steps.
                      </p>
                      <p className="text-xs text-pink-600">
                        <strong>Next steps:</strong> Review offer details, salary, and respond within the specified timeframe
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-wrap">
                {/* Primary action: Schedule Interview for interview_invited status */}
                {application.status === 'interview_invited' && (
                  <Button 
                    size="sm"
                    className="bg-pink-600 hover:bg-pink-700 w-full sm:w-auto text-xs sm:text-sm"
                    onClick={() => {
                      console.log('Navigating to interview scheduling form for application 1');
                      setLocation(`/interview-schedule-form/1`);
                    }}
                  >
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Schedule Interview
                  </Button>
                )}
                
                {application.status === 'interview_scheduled' && (
                  <>
                    {/* View Interview first for interview_scheduled */}
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full sm:w-auto text-xs sm:text-sm"
                      onClick={() => {
                        console.log('Navigating to interview confirmation:', `/interview-confirmation/${application.id}`);
                        setLocation(`/interview-confirmation/${application.id}`);
                      }}
                    >
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      View Interview
                    </Button>
                    
                    {/* View Feedback second for interview_scheduled */}
                    {application.feedbackAvailable && (
                      <Button 
                        variant="outline"
                        size="sm" 
                        className="border-green-600 text-green-600 hover:bg-green-50 w-full sm:w-auto text-xs sm:text-sm"
                        onClick={() => setLocation(`/application-feedback/${application.id}`)}
                      >
                        <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        View Feedback
                      </Button>
                    )}
                  </>
                )}

                {/* View Feedback for other statuses (not interview_scheduled) */}
                {application.feedbackAvailable && application.status !== 'interview_scheduled' && (
                  <Button 
                    variant="outline"
                    size="sm" 
                    className="border-green-600 text-green-600 hover:bg-green-50 w-full sm:w-auto text-xs sm:text-sm"
                    onClick={() => setLocation(`/application-feedback/${application.id}`)}
                  >
                    <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    View Feedback
                  </Button>
                )}

                {/* Job Offer Primary Actions */}
                {application.status === 'job_offer' && (
                  <>
                    <Button 
                      size="sm" 
                      className="bg-pink-600 hover:bg-pink-700 w-full sm:w-auto text-xs sm:text-sm"
                      onClick={() => {
                        // Map application ID to conversation ID for job offers
                        const conversationId = application.id === '7' ? '6' : '6';
                        setLocation(`/messages?conversation=${conversationId}&from=application`);
                      }}
                    >
                      <Trophy className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      View Offer Details
                    </Button>
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700 w-full sm:w-auto text-xs sm:text-sm"
                      onClick={() => setLocation(`/job-acceptance/${application.id}`)}
                    >
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      Accept Job Offer
                    </Button>
                  </>
                )}
                
                {/* Always last: View Application */}
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full sm:w-auto text-xs sm:text-sm"
                  onClick={() => setLocation(`/application-detail/${application.id}`)}
                >
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  View Application
                </Button>
              </div>

              {/* Last Updated */}
              <p className="text-xs text-gray-500 mt-2 sm:mt-3">
                Last updated: {new Date(application.lastUpdate).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State for New Users */}
      {MOCK_APPLICATIONS.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Applications Yet</h3>
          <p className="text-gray-600 mb-4">Start applying to jobs to track your progress here.</p>
          <Button onClick={() => window.location.href = '/jobs'}>
            Browse Available Jobs
          </Button>
        </div>
      )}
    </div>
  );
}