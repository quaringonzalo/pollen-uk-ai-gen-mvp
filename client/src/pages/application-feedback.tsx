import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle2, Clock, AlertTriangle, ArrowLeft, FileText, 
  TrendingUp, Target, MessageSquare, Star, ChevronRight,
  User, Building2, Calendar, Trophy, Brain, Users, Zap, 
  Home, BarChart3, Award, Lightbulb, Loader2, Send, 
  ThumbsUp, ThumbsDown, AlertCircle
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface KeyScoreItem {
  category: string;
  score: number;
  description: string;
  reasoning: string;
  icon: string;
}

interface ApplicationFeedback {
  applicationId: string;
  jobTitle: string;
  company: string;
  submittedAt: string;
  status: 'under_review' | 'feedback_ready' | 'interview_invited' | 'interview_scheduled' | 'pollen_feedback' | 'employer_feedback' | 'not_progressing' | 'job_offered';
  overallScore: number;
  feedback: {
    keyScores: KeyScoreItem[];
    strengthsHighlighted: string[];
    areasForImprovement: string[];
    standardizedBlurb: string;
    nextSteps: string;
    benchmarkComparison: {
      averageScore: number;
      topPercentile: number;
      totalCandidates: number;
    };
    isPersonalized?: boolean;
    pollenTeamNote?: string;
    employerFeedbackNote?: string;
  };
}

const getIconForScore = (iconName: string) => {
  switch (iconName) {
    case "MessageSquare":
      return <MessageSquare className="w-5 h-5 text-blue-500" />;
    case "BarChart3":
      return <BarChart3 className="w-5 h-5 text-green-500" />;
    case "Lightbulb":
      return <Lightbulb className="w-5 h-5 text-yellow-500" />;
    case "Target":
      return <Target className="w-5 h-5 text-purple-500" />;
    default:
      return <Star className="w-5 h-5 text-gray-500" />;
  }
};

const getScoreLabel = (score: number) => {
  switch(score) {
    case 0: return 'Not Rated';
    case 1: return 'Poor';
    case 2: return 'Below Average';
    case 3: return 'Average';
    case 4: return 'Strong';
    case 5: return 'Excellent';
    default: return 'Not Rated';
  }
};

const getScoreColor = (score: number) => {
  if (score === 0) return 'text-gray-400';
  if (score >= 4) return 'text-green-600';
  if (score >= 3) return 'text-yellow-600';
  return 'text-red-600';
};

export default function ApplicationFeedback() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Get application ID from URL params
  const pathSegments = location.split('/');
  const applicationId = pathSegments[pathSegments.length - 1] || "app-mkting-coordinator-123";
  
  // Job seeker feedback submission state
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [jobSeekerFeedback, setJobSeekerFeedback] = useState({
    overallExperience: '',
    communicationRating: 5,
    processClarity: 5,
    timelyness: 5,
    fairness: 5,
    wouldRecommend: true,
    additionalComments: ''
  });
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  
  const { data: feedback, isLoading, isError, error } = useQuery({
    queryKey: ['/api/application-feedback', applicationId],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', `/api/application-feedback/${applicationId}`);
        return response.json();
      } catch (err) {
        console.error('Error fetching application feedback:', err);
        throw err;
      }
    },
  });
  
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 flex items-center justify-center h-96">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading feedback...</span>
        </div>
      </div>
    );
  }
  
  if (isError || !feedback) {
    return (
      <div className="max-w-4xl mx-auto p-6 flex items-center justify-center h-96">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Unable to load feedback</h2>
          <p className="text-gray-600">Please try again later or contact support if the issue persists.</p>
        </div>
      </div>
    );
  }
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'under_review':
        return <Clock className="w-5 h-5 text-orange-500" />;
      case 'feedback_ready':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'interview_invited':
        return <Calendar className="w-5 h-5 text-orange-500" />;
      case 'interview_scheduled':
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'pollen_feedback':
        return <MessageSquare className="w-5 h-5 text-purple-500" />;
      case 'employer_feedback':
        return <Building2 className="w-5 h-5 text-purple-600" />;
      case 'not_progressing':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'job_offered':
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleFeedbackSubmit = async () => {
    setIsSubmittingFeedback(true);
    try {
      await apiRequest('POST', `/api/job-seeker-feedback`, {
        applicationId: feedback.applicationId,
        jobTitle: feedback.jobTitle,
        company: feedback.company,
        ...jobSeekerFeedback,
        submittedAt: new Date().toISOString()
      });
      
      setFeedbackSubmitted(true);
      setShowFeedbackForm(false);
      toast({
        title: "Thank you for your feedback!",
        description: "Your feedback helps us improve the platform and assists other job seekers.",
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error submitting feedback",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const StarRating = ({ rating, setRating, label }: { rating: number; setRating: (rating: number) => void; label: string }) => (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium w-32">{label}:</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className={`w-6 h-6 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          >
            <Star className="w-4 h-4" />
          </button>
        ))}
      </div>
      <span className="text-sm text-gray-600">({rating}/5)</span>
    </div>
  );

  const getStatusText = (status: string) => {
    switch (status) {
      case 'under_review':
        return 'Under Review';
      case 'feedback_ready':
        return 'Feedback Ready';
      case 'interview_invited':
        return 'Interview - Booking Required';
      case 'interview_scheduled':
        return 'Interview Scheduled';
      case 'pollen_feedback':
        return 'Personalised Feedback from Pollen';
      case 'employer_feedback':
        return 'Interview Complete - Feedback Available';
      case 'not_progressing':
        return 'Not Progressing';
      case 'job_offered':
        return 'Job Offer Received';
      default:
        return 'Status Unknown';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 65) return 'text-blue-600';
    return 'text-amber-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 65) return 'bg-blue-100';
    return 'bg-amber-100';
  };

  const formatDate = (dateString: string) => {
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
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          onClick={() => setLocation('/applications')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Applications
        </Button>
      </div>

      {/* Application Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">{feedback.jobTitle}</CardTitle>
              <div className="flex items-center gap-2 text-gray-600">
                <Building2 className="w-4 h-4" />
                <span>{feedback.company}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                {getStatusIcon(feedback.status)}
                <span className="font-medium">{getStatusText(feedback.status)}</span>
              </div>
              <p className="text-sm text-gray-600">
                Submitted {formatDate(feedback.submittedAt)}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overall Score */}
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${getScoreColor(feedback.overallScore)}`}>
                {feedback.overallScore}%
              </div>
              <p className="text-gray-600 mb-4">Overall Score</p>
              <div className="text-sm text-gray-600">
                <p>Average for this role: {feedback.feedback.benchmarkComparison.averageScore}%</p>
                <p>Top 10% threshold: {feedback.feedback.benchmarkComparison.topPercentile}%</p>
                <p className="text-xs mt-1">Based on {feedback.feedback.benchmarkComparison.totalCandidates} candidates</p>
              </div>
            </div>

            {/* Assessment Context */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">What We Assessed</h4>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">
                  {feedback.feedback.standardizedBlurb}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Seeker Feedback Section - Only show for candidates who had employer interaction */}
      {(feedback.status === 'interview_invited' || feedback.status === 'interview_scheduled' || 
        feedback.status === 'employer_feedback' || 
        feedback.status === 'job_offer') && (
        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Rate Your Experience with This Employer
            </CardTitle>
          </CardHeader>
          <CardContent>
          {!feedbackSubmitted ? (
            <>
              <div className="bg-blue-100 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-800 font-medium mb-2">
                  🌟 Your feedback makes a difference!
                </p>
                <p className="text-sm text-blue-700">
                  Share your experience with this employer's hiring process. Your feedback helps other job seekers understand what to expect and helps employers improve their recruitment process.
                </p>
              </div>
              
              {!showFeedbackForm ? (
                <Button 
                  onClick={() => setShowFeedbackForm(true)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-base font-medium"
                  size="lg"
                >
                  <Send className="w-5 h-5" />
                  Rate This Employer
                </Button>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <StarRating 
                      rating={jobSeekerFeedback.communicationRating}
                      setRating={(rating) => setJobSeekerFeedback(prev => ({ ...prev, communicationRating: rating }))}
                      label="Communication"
                    />
                    <StarRating 
                      rating={jobSeekerFeedback.processClarity}
                      setRating={(rating) => setJobSeekerFeedback(prev => ({ ...prev, processClarity: rating }))}
                      label="Process Clarity"
                    />
                    <StarRating 
                      rating={jobSeekerFeedback.timelyness}
                      setRating={(rating) => setJobSeekerFeedback(prev => ({ ...prev, timelyness: rating }))}
                      label="Timeliness"
                    />
                    <StarRating 
                      rating={jobSeekerFeedback.fairness}
                      setRating={(rating) => setJobSeekerFeedback(prev => ({ ...prev, fairness: rating }))}
                      label="Fairness"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Would you recommend this employer to other job seekers?</label>
                    <div className="flex gap-4">
                      <Button
                        variant={jobSeekerFeedback.wouldRecommend ? "default" : "outline"}
                        onClick={() => setJobSeekerFeedback(prev => ({ ...prev, wouldRecommend: true }))}
                        className="flex items-center gap-2"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        Yes
                      </Button>
                      <Button
                        variant={!jobSeekerFeedback.wouldRecommend ? "default" : "outline"}
                        onClick={() => setJobSeekerFeedback(prev => ({ ...prev, wouldRecommend: false }))}
                        className="flex items-center gap-2"
                      >
                        <ThumbsDown className="w-4 h-4" />
                        No
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Additional Comments (Optional)</label>
                    <Textarea
                      placeholder="Share any additional thoughts about your experience..."
                      value={jobSeekerFeedback.additionalComments}
                      onChange={(e) => setJobSeekerFeedback(prev => ({ ...prev, additionalComments: e.target.value }))}
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      onClick={handleFeedbackSubmit}
                      disabled={isSubmittingFeedback}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                    >
                      {isSubmittingFeedback ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      Submit Feedback
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowFeedbackForm(false)}
                      disabled={isSubmittingFeedback}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-6">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Thank you for rating this employer!</h3>
              <p className="text-sm text-gray-600">
                Your feedback helps other job seekers understand what to expect from this employer and helps them improve their hiring process.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      )}

      {/* Employer Feedback Section - Special header for employer feedback */}
      {feedback.status === 'employer_feedback' && (
        <Card className="border-l-4 bg-pink-50" style={{ borderLeftColor: '#E2007A' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Sora' }}>
              <Building2 className="w-5 h-5" style={{ color: '#E2007A' }} />
              Feedback from {feedback.company}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-4">
              <p className="text-sm font-medium mb-2" style={{ color: '#E2007A', fontFamily: 'Sora' }}>
                📋 Direct feedback from the employer
              </p>
              <p className="text-sm" style={{ color: '#444444', fontFamily: 'Poppins' }}>
                This feedback has been provided by {feedback.company} and reviewed by our team. 
                It includes their assessment of your interview performance and specific insights about your fit for the role.
              </p>
            </div>
            
            {/* Display actual employer feedback content */}
            {feedback.feedback.employerFeedbackNote && (
              <div className="bg-white border-l-4 p-4 rounded-r-lg" style={{ borderLeftColor: '#E2007A' }}>
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                    {feedback.feedback.employerFeedbackNote}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Personalized Feedback from Pollen Team - for pollen_feedback and job_offered status */}
      {feedback.feedback.isPersonalized && feedback.feedback.pollenTeamNote && (feedback.status === 'pollen_feedback' || feedback.status === 'job_offered') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-500" />
              {feedback.status === 'job_offered' ? 'Congratulations from the Pollen Team' : 'Personal Note from the Pollen Team'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <div className="whitespace-pre-line text-sm text-gray-700 leading-relaxed">
                {feedback.feedback.pollenTeamNote}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {feedback.status === 'employer_feedback' ? 'Combined Assessment & Interview Scores' : 'Your Assessment Scores'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {feedback.feedback.keyScores.map((score: KeyScoreItem, index: number) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getIconForScore(score.icon)}
                    <span className="font-medium">{score.category}</span>
                  </div>
                  <span className={`text-xl font-bold ${getScoreColor(score.score)}`}>
                    {score.score}%
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{score.description}</p>
                <div className="bg-gray-50 p-3 rounded text-xs text-gray-600">
                  <strong>How we scored this:</strong> {score.reasoning}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interview Performance - Show for applications that reached interview stage */}
      {(feedback.status === 'pollen_feedback' || feedback.status === 'employer_feedback' || feedback.status === 'job_offered') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              Interview Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`grid grid-cols-1 ${(feedback.status === 'employer_feedback' || feedback.status === 'job_offered') ? 'md:grid-cols-2' : ''} gap-6`}>
              {/* Pollen Team Interview */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <h4 className="font-medium">Pollen Team Interview</h4>
                  <span className="text-sm font-bold text-blue-600">
                    {feedback.feedback.pollenInterviewScore || 82}%
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Communication & Rapport</span>
                    <span className="font-medium text-green-600">Excellent</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Role Understanding</span>
                    <span className="font-medium text-green-600">Strong</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Values Alignment</span>
                    <span className="font-medium text-green-600">Excellent</span>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-800">
                    <strong>Notes:</strong> Genuine enthusiasm, thoughtful questions about company culture, clear preparation.
                  </p>
                </div>
              </div>

              {/* Employer Interview - Only show for employer_feedback and job_offered status */}
              {(feedback.status === 'employer_feedback' || feedback.status === 'job_offered') && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <h4 className="font-medium">Employer Interview</h4>
                    <span className="text-sm font-bold text-purple-600">
                      {feedback.feedback.employerInterviewScore || 85}%
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Technical Discussion</span>
                      <span className="font-medium text-green-600">Excellent</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Problem-Solving</span>
                      <span className="font-medium text-green-600">Strong</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Team Fit</span>
                      <span className="font-medium text-blue-600">Good</span>
                    </div>
                  </div>

                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs text-purple-800">
                      <strong>Notes:</strong> Strategic thinking, excellent questions, genuine company interest.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}





      {/* Benchmark Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            How You Compare
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{feedback.overallScore}%</div>
              <p className="text-sm text-blue-700">Your Score</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{feedback.feedback.benchmarkComparison.averageScore}%</div>
              <p className="text-sm text-gray-700">Average Score</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{feedback.feedback.benchmarkComparison.topPercentile}%</div>
              <p className="text-sm text-green-700">Top 10% Score</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center mt-3">
            Based on {feedback.feedback.benchmarkComparison.totalCandidates} candidates who completed this assessment
          </p>
        </CardContent>
      </Card>

      {/* Mentoring Support for Feedback Recipients - only for rejected status, removed from employer_feedback */}
      {feedback.status === 'rejected' && (
        <Card className="border-pink-200 bg-pink-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Sora', color: '#E2007A' }}>
              <Users className="w-5 h-5" style={{ color: '#E2007A' }} />
              Get Personalised Career Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#444444', fontFamily: 'Poppins' }}>
              Not progressing doesn't mean you're not capable - it means you need targeted support to showcase your potential. Our community mentors can help you identify specific areas for improvement and provide practical guidance to strengthen your applications.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={() => setLocation('/mentor-directory')} 
                className="flex items-center gap-2 hover:opacity-90"
                style={{ backgroundColor: '#E2007A', color: 'white', fontFamily: 'Sora' }}
              >
                <Users className="w-4 h-4" />
                Connect with Mentors
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setLocation('/community')} 
                className="flex items-center gap-2 hover:bg-pink-50"
                style={{ borderColor: '#E2007A', color: '#E2007A', fontFamily: 'Sora' }}
              >
                <Trophy className="w-4 h-4" />
                Join Learning Activities
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChevronRight className="w-5 h-5" />
            Recommended Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {feedback.status === 'job_offered' && (
              <Button 
                onClick={() => setLocation(`/job-acceptance/${feedback.applicationId}`)} 
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle2 className="w-4 h-4" />
                Review Offer
              </Button>
            )}
            {feedback.status === 'interview_invited' && (
              <Button onClick={() => setLocation(`/interview-schedule-form/${feedback.applicationId}`)} className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Book Interview Slot
              </Button>
            )}
            {feedback.status === 'not_progressing' || feedback.status === 'pollen_feedback' || feedback.status === 'employer_feedback' ? (
              <>
                <Button onClick={() => setLocation('/jobs')} className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Apply to Similar Roles
                </Button>
                <Button 
                  onClick={() => window.open('https://calendly.com/pollen-feedback', '_blank')}
                  className="flex items-center gap-2"
                  style={{ backgroundColor: '#E2007A', color: 'white' }}
                >
                  <Calendar className="w-4 h-4" />
                  Book 1:1 Feedback
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setLocation('/community')} 
                  className="flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Access Community Support
                </Button>
              </>
            ) : feedback.status === 'job_offered' ? (
              <>
                <Button 
                  variant="outline"
                  onClick={() => setLocation('/messages')}
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Message Pollen
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setLocation('/messages')}
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Message Employer
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setLocation('/jobs')} className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Apply to Similar Roles
                </Button>
                <Button variant="outline" onClick={() => setLocation('/profile')}>
                  <User className="w-4 h-4 mr-2" />
                  Update Profile
                </Button>
                {(feedback.status === 'pollen_feedback' || feedback.status === 'employer_feedback' || feedback.status === 'interview_scheduled') && (
                  <Button 
                    variant="outline"
                    onClick={() => setLocation(`/interview-confirmation/${feedback.applicationId}`)}
                    className="flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    View Interview Details
                  </Button>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>


    </div>
  );
}