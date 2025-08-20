import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Calendar, 
  Clock, 
  MessageSquare, 
  Eye,
  CheckCircle,
  User,
  FileText,
  ExternalLink,
  Star,
  PoundSterling,
  Edit3,
  Save,
  AlertCircle
} from "lucide-react";

interface ApplicationDetail {
  id: string;
  jobTitle: string;
  companyName: string;
  companyLogo: string;
  companyRating: number;
  location: string;
  salaryRange: string;
  employmentType: string;
  appliedDate: string;
  applicationDeadline: string;
  status: 'submitted' | 'under_review' | 'feedback_ready' | 'interview_scheduled' | 'offer' | 'rejected' | 'job_offer';
  lastUpdate: string;
  feedbackAvailable?: boolean;
  interviewDate?: string;
  challengeCompleted?: boolean;
  applicationDetails: {
    motivation: string;
    challengeResponse: Record<string, string>;
    submissionTime: string;
    timeSpent: string;
  };
  skillsChallenge: {
    title: string;
    description: string;
    context: string;
    questions: {
      id: string;
      question: string;
      placeholder: string;
    }[];
  };
  timeline: {
    submitted: string;
    reviewed?: string;
    feedbackProvided?: string;
    interviewScheduled?: string;
  };
}

// Mock data for demonstration
const getMockApplicationDetail = (id: string): ApplicationDetail => {
  const baseData = {
    id,
    companyLogo: "/placeholder-logo.png",
    companyRating: 4.3,
    employmentType: "Full-time",
    salaryRange: "£25,000 - £28,000",
    challengeCompleted: true,
    applicationDetails: {
      motivation: "I'm excited about this role because it combines my passion for creative marketing with data-driven strategies. The opportunity to work with a growing tech company aligns perfectly with my career goals of developing comprehensive marketing skills while contributing to innovative products.",
      challengeResponse: {
        "target-audience": "Primary Audience (60% of budget): Women aged 25-35, urban professionals who are health-conscious, skincare enthusiasts, and early adopters. They're active on Instagram/TikTok, research before purchasing, and have pain points around dull skin and time constraints but want proven results.\n\nSecondary Audience (40% of budget): Women aged 18-28, students/early career who are beauty-focused, price-sensitive, and social media native. They're influenced by peers and creators, shop online, and struggle with acne-prone skin and budget constraints while wanting instant results.",
        "media-channels": "I recommend a digital-first approach with four key channels:\n\n1. Social Media Advertising (Instagram & TikTok) - 45% of budget\n2. Influencer Partnerships - 25% of budget\n3. Google Ads (Search & Display) - 20% of budget\n4. Content Marketing - 10% of budget\n\nThis mix leverages where our target audience spends time while balancing awareness-building with conversion-focused activities.",
        "budget-allocation": "£50,000 Budget Breakdown:\n\n• Social Media Advertising: £22,500 (45%)\n  - Instagram: £15,000 (Stories, Feed, Reels)\n  - TikTok: £7,500 (In-feed ads, branded hashtag challenge)\n\n• Influencer Partnerships: £12,500 (25%)\n  - 3 micro-influencers: £7,500\n  - 1 macro-influencer: £5,000\n\n• Google Ads: £10,000 (20%)\n  - Search campaigns: £7,000\n  - Display remarketing: £3,000\n\n• Content Marketing: £5,000 (10%)\n  - Blog posts: £2,000\n  - Email marketing: £1,500\n  - PR outreach: £1,500",
        "success-metrics": "Primary KPIs:\n• 10,000 website visits\n• 500 conversions (£100 CAC target)\n\nSecondary KPIs:\n• 50,000 social impressions\n• 2.5% engagement rate\n• 1,000 email signups\n• 25% email open rate\n\nMeasurement approach: Weekly performance reviews with Google Analytics, social media insights, and email platform metrics. Monthly ROI analysis with customer lifetime value calculations.",
        "risk-mitigation": "Key risks and mitigation strategies:\n\n1. Creative fatigue: A/B test assets before full spend, maintain creative variety\n2. Competitor activity: Monitor competitor campaigns, maintain 15% budget reserve for reactive adjustments\n3. Platform algorithm changes: Diversify across multiple channels, don't rely on single platform\n4. Seasonal fluctuations: Plan campaign timing around skincare purchase patterns\n5. Influencer authenticity: Thorough vetting process, clear content guidelines, authentic partnerships only"
      },
      submissionTime: "2025-01-01T14:30:00Z",
      timeSpent: "2 hours 45 minutes"
    },
    skillsChallenge: {
      title: "Media Planning Challenge",
      description: "You're working for a beauty brand launching a new skincare product. Create a comprehensive media planning strategy that will help them reach their target audience effectively.",
      context: "GlowFresh is launching their new Vitamin C Serum and needs a strategic media plan to drive awareness and sales. They have a £50,000 budget and want to focus on digital channels.",
      questions: [
        {
          id: "target-audience",
          question: "Who is the target audience for this product?",
          placeholder: "Describe the primary and secondary target audiences for the Vitamin C Serum..."
        },
        {
          id: "media-channels",
          question: "Which media channels would be most effective?",
          placeholder: "Explain your recommended media mix and why these channels are suitable..."
        },
        {
          id: "budget-allocation",
          question: "How would you allocate the budget across different channels?",
          placeholder: "Provide a detailed budget breakdown with percentages and rationale..."
        },
        {
          id: "success-metrics",
          question: "What would success look like and how would you measure it?",
          placeholder: "Define key performance indicators and measurement methods..."
        },
        {
          id: "risk-mitigation",
          question: "What are the key risks and how would you mitigate them?",
          placeholder: "Identify potential risks and your strategies to address them..."
        }
      ]
    },
    timeline: {
      submitted: "2025-01-01T14:30:00Z",
      reviewed: "2025-01-02T09:00:00Z",
      feedbackProvided: "2025-01-03T11:00:00Z"
    }
  };

  // Application-specific data
  const applications = {
    '1': {
      jobTitle: 'Marketing Assistant',
      companyName: 'TechFlow Solutions',
      location: 'Remote (UK)',
      appliedDate: '2025-01-01',
      applicationDeadline: '2025-01-15',
      status: 'feedback_ready' as const,
      lastUpdate: '2025-01-03',
      feedbackAvailable: true
    },
    '2': {
      jobTitle: 'Social Media Coordinator',
      companyName: 'Creative Media Co',
      location: 'London',
      appliedDate: '2025-01-02',
      applicationDeadline: '2025-01-20',
      status: 'under_review' as const,
      lastUpdate: '2025-01-02',
      feedbackAvailable: false
    },
    '3': {
      jobTitle: 'Customer Support Specialist',
      companyName: 'StartupHub',
      location: 'Manchester',
      appliedDate: '2024-12-28',
      applicationDeadline: '2025-01-10',
      status: 'under_review' as const,
      lastUpdate: '2025-01-01',
      feedbackAvailable: false
    },
    '4': {
      jobTitle: 'Creative Communications Assistant',
      companyName: 'BrightFuture Marketing',
      location: 'Bristol',
      appliedDate: '2024-12-20',
      applicationDeadline: '2024-12-31',
      status: 'feedback_ready' as const,
      lastUpdate: '2024-12-28',
      feedbackAvailable: true
    },
    '5': {
      jobTitle: 'Content Writer',
      companyName: 'Digital Agency',
      location: 'Birmingham',
      appliedDate: '2024-12-20',
      applicationDeadline: '2024-12-31',
      status: 'feedback_ready' as const,
      lastUpdate: '2024-12-22',
      feedbackAvailable: true
    },
    '6': {
      jobTitle: 'Junior Developer',
      companyName: 'DevCorp',
      location: 'Edinburgh',
      appliedDate: '2024-12-10',
      applicationDeadline: '2024-12-25',
      status: 'feedback_ready' as const,
      lastUpdate: '2024-12-18',
      feedbackAvailable: true
    },
    '7': {
      jobTitle: 'Data Analyst',
      companyName: 'Tech Startup',
      location: 'Remote (UK)',
      appliedDate: '2024-12-15',
      applicationDeadline: '2024-12-30',
      status: 'job_offer' as const,
      lastUpdate: '2024-12-28',
      feedbackAvailable: false
    }
  };

  return {
    ...baseData,
    ...applications[id as keyof typeof applications]
  };
};

export default function ApplicationDetail() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Get application ID from URL
  const pathSegments = location.split('/');
  const applicationId = pathSegments[pathSegments.length - 1] || '1';
  
  const [application, setApplication] = useState(getMockApplicationDetail(applicationId));
  const [isEditing, setIsEditing] = useState(false);
  const [editedMotivation, setEditedMotivation] = useState(application.applicationDetails.motivation);
  const [editedChallengeResponse, setEditedChallengeResponse] = useState(application.applicationDetails.challengeResponse);
  const [showJobDetails, setShowJobDetails] = useState(false);
  
  // Check if application is still editable (before deadline and not yet reviewed)
  const isEditable = () => {
    const deadline = new Date(application.applicationDeadline);
    const now = new Date();
    return now < deadline && application.status === 'submitted';
  };
  
  // Calculate days until deadline
  const getDaysUntilDeadline = () => {
    const deadline = new Date(application.applicationDeadline);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  const handleSaveChanges = () => {
    // Update application data
    setApplication(prev => ({
      ...prev,
      applicationDetails: {
        ...prev.applicationDetails,
        motivation: editedMotivation,
        challengeResponse: editedChallengeResponse
      }
    }));
    
    setIsEditing(false);
    toast({
      title: "Application Updated",
      description: "Your changes have been saved successfully.",
    });
  };
  
  const handleCancelEdit = () => {
    setEditedMotivation(application.applicationDetails.motivation);
    setEditedChallengeResponse(application.applicationDetails.challengeResponse);
    setIsEditing(false);
  };
  
  const getStatusBadge = (status: ApplicationDetail['status']) => {
    switch (status) {
      case 'submitted':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Submitted</Badge>;
      case 'under_review':
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Under Review</Badge>;
      case 'feedback_ready':
        return <Badge variant="default" className="bg-green-600"><MessageSquare className="w-3 h-3 mr-1" />Feedback Ready</Badge>;
      case 'interview_scheduled':
        return <Badge variant="default" className="bg-blue-600"><Calendar className="w-3 h-3 mr-1" />Interview Scheduled</Badge>;
      case 'offer':
        return <Badge variant="default" className="bg-purple-600"><CheckCircle className="w-3 h-3 mr-1" />Offer Received</Badge>;
      case 'job_offer':
        return <Badge variant="default" className="bg-purple-600"><CheckCircle className="w-3 h-3 mr-1" />Job Offer</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Not Selected</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/applications')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Applications
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{application.jobTitle}</h1>
            <p className="text-gray-600">{application.companyName}</p>
          </div>
        </div>
        {getStatusBadge(application.status)}
      </div>

      {/* Application Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Application Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <img 
                  src={application.companyLogo} 
                  alt={`${application.companyName} logo`}
                  className="w-12 h-12 rounded-lg bg-gray-100"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div>
                  <h3 className="font-semibold">{application.companyName}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{application.companyRating}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{application.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <PoundSterling className="w-4 h-4 text-gray-500" />
                  <span>{application.salaryRange}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{application.employmentType}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm">
                <span className="font-medium">Applied:</span> {formatDate(application.appliedDate)}
              </div>
              <div className="text-sm">
                <span className="font-medium">Application Deadline:</span> {formatDate(application.applicationDeadline)}
                {getDaysUntilDeadline() > 0 && getDaysUntilDeadline() <= 7 && (
                  <span className="ml-2 text-orange-600 font-medium">
                    ({getDaysUntilDeadline()} days remaining)
                  </span>
                )}
                {getDaysUntilDeadline() <= 0 && (
                  <span className="ml-2 text-red-600 font-medium">
                    (Deadline passed)
                  </span>
                )}
              </div>
              <div className="text-sm">
                <span className="font-medium">Last Updated:</span> {formatDate(application.lastUpdate)}
              </div>
              {application.interviewDate && (
                <div className="text-sm">
                  <span className="font-medium">Interview Date:</span> {formatDate(application.interviewDate)}
                </div>
              )}
              <div className="text-sm">
                <span className="font-medium">Challenge:</span> 
                <span className={`ml-1 ${application.challengeCompleted ? 'text-green-600' : 'text-orange-600'}`}>
                  {application.challengeCompleted ? 'Completed' : 'Pending'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills Challenge & Application Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Skills Challenge & My Responses
            </div>

            {!isEditable() && application.status === 'submitted' && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <AlertCircle className="w-4 h-4" />
                Editing deadline passed
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Challenge Summary */}
          <div>
            <h4 className="font-medium mb-2">{application.skillsChallenge.title}</h4>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              {application.skillsChallenge.description}
            </p>
            <div className="bg-blue-50 p-3 rounded border">
              <p className="text-sm text-blue-900">
                <strong>Background:</strong> {application.skillsChallenge.context}
              </p>
            </div>
          </div>
          
          <Separator />
          
          {/* Motivation Question */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium">Why did you apply for this role?</h4>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  disabled={!isEditable()}
                  className="flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit All Responses
                </Button>
              )}
            </div>
            
            {isEditing ? (
              <Textarea
                value={editedMotivation}
                onChange={(e) => setEditedMotivation(e.target.value)}
                className="min-h-[100px] text-sm resize-none"
                placeholder="Tell us what excites you about this role..."
              />
            ) : (
              <div className="bg-gray-50 p-3 rounded border">
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {application.applicationDetails.motivation}
                </div>
              </div>
            )}
          </div>
          
          <Separator />
          
          {/* Challenge Questions & Responses */}
          <div>
            <h4 className="font-medium mb-4">Challenge Questions & Responses</h4>
            <div className="space-y-6">
              {application.skillsChallenge.questions.map((question, index) => (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="mb-3">
                    <h5 className="font-medium text-sm mb-2 text-blue-900">{index + 1}. {question.question}</h5>
                  </div>
                  
                  {isEditing ? (
                    <Textarea
                      value={editedChallengeResponse[question.id] || ''}
                      onChange={(e) => setEditedChallengeResponse(prev => ({
                        ...prev,
                        [question.id]: e.target.value
                      }))}
                      className="min-h-[120px] text-sm resize-none"
                      placeholder={question.placeholder}
                    />
                  ) : (
                    <div className="bg-gray-50 p-3 rounded border">
                      <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {application.applicationDetails.challengeResponse[question.id] || 'No response provided'}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {isEditing && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button onClick={handleSaveChanges} className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save All Changes
                  </Button>
                  <Button variant="outline" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                </div>
              )}
              
              {!isEditing && (
                <div className="flex gap-4 text-xs text-gray-600 pt-2 border-t">
                  <span>Submitted: {formatDateTime(application.applicationDetails.submissionTime)}</span>
                  <span>Time Spent: {application.applicationDetails.timeSpent}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>



      {/* Application Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Application Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium text-sm">Application Submitted</p>
                <p className="text-xs text-gray-600">{formatDateTime(application.timeline.submitted)}</p>
              </div>
            </div>
            
            {application.timeline.reviewed && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-sm">Under Review</p>
                  <p className="text-xs text-gray-600">{formatDateTime(application.timeline.reviewed)}</p>
                </div>
              </div>
            )}
            
            {application.timeline.feedbackProvided && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-sm">Feedback Provided</p>
                  <p className="text-xs text-gray-600">{formatDateTime(application.timeline.feedbackProvided)}</p>
                </div>
              </div>
            )}
            
            {application.timeline.interviewScheduled && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div>
                  <p className="font-medium text-sm">Interview Scheduled</p>
                  <p className="text-xs text-gray-600">{formatDateTime(application.timeline.interviewScheduled)}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {application.feedbackAvailable && (
          <Button 
            className="bg-green-600 hover:bg-green-700"
            onClick={() => setLocation(`/application-feedback/${application.id}`)}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            View Feedback
          </Button>
        )}
        

        
        {application.status === 'interview_scheduled' && (
          <Button 
            onClick={() => setLocation(`/candidate-next-steps/${application.id}`)}
            className="bg-pink-600 hover:bg-pink-700 text-white"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Interview
          </Button>
        )}
        
        <Button 
          variant="outline"
          onClick={() => setShowJobDetails(true)}
        >
          <Eye className="w-4 h-4 mr-2" />
          View Job Description
        </Button>
      </div>

      {/* Job Details Modal */}
      <Dialog open={showJobDetails} onOpenChange={setShowJobDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Job Details - {application.jobTitle}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            {/* Company Header */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <img 
                src={application.companyLogo} 
                alt={`${application.companyName} logo`}
                className="w-16 h-16 rounded-lg bg-white"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="flex-1">
                <h2 className="text-xl font-bold">{application.jobTitle}</h2>
                <p className="text-lg text-gray-700">{application.companyName}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {application.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <PoundSterling className="w-4 h-4" />
                    {application.salaryRange}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {application.employmentType}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="font-medium">{application.companyRating}</span>
              </div>
            </div>

            {/* Job Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Key Responsibilities
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <p className="text-sm">Create and manage social media campaigns across multiple platforms</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <p className="text-sm">Develop content strategies that align with brand voice and objectives</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <p className="text-sm">Monitor campaign performance and provide insights for optimisation</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <p className="text-sm">Collaborate with design and marketing teams on creative assets</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <p className="text-sm">Engage with online communities and respond to customer inquiries</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Who Would Love This Job
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <p className="text-sm">Creative individuals passionate about digital storytelling</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <p className="text-sm">Strong communicators who enjoy building online communities</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <p className="text-sm">Detail-oriented professionals who love analyzing data trends</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <p className="text-sm">Collaborative team players excited about marketing innovation</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <p className="text-sm">Self-motivated individuals ready to grow their marketing expertise</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Challenge Information */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Skills Challenge: {application.skillsChallenge.title}
              </h3>
              <p className="text-sm text-gray-700 mb-3">{application.skillsChallenge.description}</p>
              <div className="bg-white p-3 rounded border">
                <p className="text-sm font-medium mb-2">Challenge Context:</p>
                <p className="text-sm text-gray-600">{application.skillsChallenge.context}</p>
              </div>
            </div>

            {/* Company Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-lg">About {application.companyName}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowJobDetails(false);
                    setLocation('/company-profile/2');
                  }}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Full Profile
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    TechFlow Solutions is a forward-thinking marketing agency specialising in digital transformation 
                    for growing businesses. We pride ourselves on creating innovative campaigns that drive real results 
                    for our clients across various industries.
                  </p>
                  <p className="text-sm text-gray-600">
                    Our team of 25+ professionals works in a collaborative environment where creativity meets 
                    strategy, and every team member has the opportunity to contribute to exciting projects and 
                    grow their expertise.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-500" />
                    <span>25+ employees</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    <span>Marketing & Advertising</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>London, UK (Hybrid)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>4.7/5 employee rating</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Timeline */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-lg mb-3">Application Timeline</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Applied: {formatDate(application.appliedDate)}</span>
                <span className="mx-2">•</span>
                <span>Deadline: {formatDate(application.applicationDeadline)}</span>
                <span className="mx-2">•</span>
                <span>Status: {application.status.replace('_', ' ')}</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}