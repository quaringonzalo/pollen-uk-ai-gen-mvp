import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  ArrowLeft, Star, Clock, CheckCircle, Eye, 
  FileText, User, Calendar, Mail, MapPin
} from "lucide-react";
import { useLocation, useParams } from "wouter";

interface AssessmentReview {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidateLocation: string;
  profilePicture?: string;
  jobTitle: string;
  company: string;
  applicationDate: string;
  overallMatchScore: number;
  skillsScore: number;
  behavioralScore: number;
  productivityScore: number;
  assessmentTitle: string;
  assessmentSubmission: {
    submittedAt: string;
    estimatedTime: string;
    actualTime: string;
    responses: {
      questionId: number;
      question: string;
      response: string;
      wordCount: number;
    }[];
  };
  preliminaryScores: {
    technicalSkills: number;
    problemSolving: number;
    communication: number;
    creativity: number;
    attention: number;
  };
  adminNotes?: string;
  reviewStatus: 'pending' | 'reviewed' | 'approved';
}

export default function AdminAssessmentReview() {
  const { candidateId } = useParams<{ candidateId: string }>();
  const [, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [reviewStatus, setReviewStatus] = useState<'pending' | 'reviewed' | 'approved'>('pending');
  const { toast } = useToast();

  // Fetch assessment review data
  const { data: assessment, isLoading } = useQuery<AssessmentReview>({
    queryKey: [`/api/admin/assessment-review/${candidateId}`],
    initialData: {
      id: "review-1",
      candidateId: candidateId || "21",
      candidateName: candidateId === "21" ? "James Mitchell" : "Lucy Brown",
      candidateEmail: candidateId === "21" ? "james.mitchell@email.com" : "lucy.brown@email.com",
      candidateLocation: candidateId === "21" ? "London, UK" : "Manchester, UK",
      profilePicture: candidateId === "21" 
        ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
        : "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      jobTitle: "Marketing Assistant",
      company: "TechFlow Solutions",
      applicationDate: "2025-01-15",
      overallMatchScore: candidateId === "21" ? 92 : 87,
      skillsScore: candidateId === "21" ? 88 : 91,
      behavioralScore: candidateId === "21" ? 95 : 84,
      productivityScore: candidateId === "21" ? 87 : 79,
      assessmentTitle: "Marketing Assistant Skills Assessment",
      assessmentSubmission: {
        submittedAt: "2025-01-16T10:30:00Z",
        estimatedTime: "45-60 minutes",
        actualTime: "52 minutes",
        responses: [
          {
            questionId: 1,
            question: "Describe your approach to creating a social media strategy for a new product launch.",
            response: "I would start by conducting thorough market research to understand our target audience and their social media habits. Then I'd develop a content calendar that tells a compelling story about the product, highlighting its unique benefits. I'd focus on creating engaging, shareable content across multiple platforms, with platform-specific adaptations. I'd also plan for influencer partnerships and user-generated content campaigns to build authentic buzz. Throughout the campaign, I'd monitor engagement metrics and adjust our approach based on real-time feedback.",
            wordCount: 287
          },
          {
            questionId: 2,
            question: "How would you measure the success of a digital marketing campaign?",
            response: "Success measurement should align with campaign objectives. For awareness campaigns, I'd track reach, impressions, and share of voice. For engagement, I'd monitor likes, comments, shares, and time spent on content. For conversion-focused campaigns, I'd measure click-through rates, conversion rates, and return on ad spend (ROAS). I'd also look at qualitative metrics like sentiment analysis and brand perception. Setting up proper attribution models and using tools like Google Analytics and social media insights would be essential for accurate measurement.",
            wordCount: 312
          },
          {
            questionId: 3,
            question: "Tell us about a time when you had to adapt your communication style for different audiences.",
            response: "During my university group project, I had to present our research to both academic professors and industry professionals. For the professors, I focused on methodology, data analysis, and theoretical frameworks, using academic language and detailed citations. For the industry audience, I emphasized practical applications, ROI potential, and real-world implementation, using more accessible language and visual examples. I learned that effective communication requires understanding your audience's priorities and adapting your message accordingly while maintaining the core content integrity.",
            wordCount: 298
          }
        ]
      },
      preliminaryScores: {
        technicalSkills: candidateId === "21" ? 85 : 88,
        problemSolving: candidateId === "21" ? 90 : 85,
        communication: candidateId === "21" ? 95 : 89,
        creativity: candidateId === "21" ? 88 : 92,
        attention: candidateId === "21" ? 87 : 83
      },
      adminNotes: "",
      reviewStatus: 'pending'
    }
  });

  // Save review mutation
  const saveReviewMutation = useMutation({
    mutationFn: async (data: { notes: string, status: string }) => {
      return await apiRequest("PUT", `/api/admin/assessment-review/${candidateId}`, {
        adminNotes: data.notes,
        reviewStatus: data.status,
        reviewedBy: "Holly (Admin)",
        reviewedAt: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/assessment-review/${candidateId}`] });
      toast({
        title: "Review saved",
        description: "Assessment review has been saved successfully",
      });
      setIsEditing(false);
    },
  });

  const handleSaveReview = () => {
    saveReviewMutation.mutate({ notes: adminNotes, status: reviewStatus });
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-700";
    if (score >= 80) return "text-blue-700";
    if (score >= 70) return "text-orange-700";
    return "text-red-700";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-800">Pending Review</Badge>;
      case 'reviewed':
        return <Badge className="bg-blue-100 text-blue-800">Reviewed</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Assessment not found</h3>
          <p className="text-gray-600">The assessment review could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setLocation("/admin/job-applicants-grid/1")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Candidates
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Assessment Review</h1>
                <p className="text-sm text-gray-600">
                  {assessment.candidateName} • {assessment.jobTitle} at {assessment.company}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setLocation(`/candidates/${candidateId}`)}
                variant="outline"
                size="sm"
              >
                <User className="h-4 w-4 mr-2" />
                View Profile
              </Button>
              {getStatusBadge(assessment.reviewStatus)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Candidate Summary */}
          <div className="space-y-6">
            {/* Candidate Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <img 
                    src={assessment.profilePicture || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"}
                    alt={assessment.candidateName}
                    className="w-12 h-12 rounded-full border"
                  />
                  <div>
                    <div className="font-semibold">{assessment.candidateName}</div>
                    <div className="text-sm text-gray-600 font-normal">
                      Applied {new Date(assessment.applicationDate).toLocaleDateString('en-GB')}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {assessment.candidateEmail}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {assessment.candidateLocation}
                </div>
              </CardContent>
            </Card>

            {/* Match Scores */}
            <Card>
              <CardHeader>
                <CardTitle>Match Scores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(assessment.overallMatchScore)}`}>
                      {assessment.overallMatchScore}%
                    </div>
                    <div className="text-xs text-gray-600">Overall</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(assessment.skillsScore)}`}>
                      {assessment.skillsScore}%
                    </div>
                    <div className="text-xs text-gray-600">Skills</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(assessment.behavioralScore)}`}>
                      {assessment.behavioralScore}%
                    </div>
                    <div className="text-xs text-gray-600">Behavioral</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(assessment.productivityScore)}`}>
                      {assessment.productivityScore}%
                    </div>
                    <div className="text-xs text-gray-600">Productivity</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preliminary Assessment Scores */}
            <Card>
              <CardHeader>
                <CardTitle>Preliminary Assessment Scores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(assessment.preliminaryScores).map(([key, score]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-sm capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className={`font-semibold ${getScoreColor(score)}`}>
                      {score}%
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Assessment Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Assessment Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {assessment.assessmentTitle}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    {assessment.assessmentSubmission.actualTime}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Estimated Time:</span>
                    <div className="font-medium">{assessment.assessmentSubmission.estimatedTime}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Actual Time:</span>
                    <div className="font-medium">{assessment.assessmentSubmission.actualTime}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Submitted:</span>
                    <div className="font-medium">
                      {new Date(assessment.assessmentSubmission.submittedAt).toLocaleDateString('en-GB')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assessment Responses */}
            <div className="space-y-4">
              {assessment.assessmentSubmission.responses.map((response, index) => (
                <Card key={response.questionId}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Question {index + 1}
                      <span className="ml-2 text-sm font-normal text-gray-600">
                        ({response.wordCount} words)
                      </span>
                    </CardTitle>
                    <p className="text-gray-700 font-normal">{response.question}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-800 leading-relaxed">{response.response}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Admin Review Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Admin Review
                  {!isEditing && (
                    <Button size="sm" onClick={() => setIsEditing(true)}>
                      Edit Review
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Review Status</label>
                      <select 
                        value={reviewStatus}
                        onChange={(e) => setReviewStatus(e.target.value as any)}
                        className="w-full border rounded-md px-3 py-2"
                      >
                        <option value="pending">Pending Review</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="approved">Approved</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Admin Notes</label>
                      <Textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Add your review notes here..."
                        rows={4}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleSaveReview}
                        disabled={saveReviewMutation.isPending}
                      >
                        {saveReviewMutation.isPending ? 'Saving...' : 'Save Review'}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setAdminNotes(assessment.adminNotes || "");
                          setReviewStatus(assessment.reviewStatus);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Status:</span>
                      <div className="mt-1">{getStatusBadge(assessment.reviewStatus)}</div>
                    </div>
                    {assessment.adminNotes && (
                      <div>
                        <span className="text-sm text-gray-600">Notes:</span>
                        <div className="mt-1 text-gray-800">{assessment.adminNotes}</div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}