import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  ArrowLeft, CheckCircle, Edit3, FileText, User, Mail, MapPin,
  ThumbsUp, Save, MessageSquare, BarChart3, TrendingUp, Lightbulb,
  AlertTriangle, X, Check, Calendar, UserCheck, UserX, Lock,
  ChevronLeft, ChevronRight, Eye, ExternalLink, Clock
} from "lucide-react";
import { useLocation, useParams } from "wouter";

// Candidate History Component
interface CandidateHistoryItem {
  id: string;
  type: 'application' | 'interview' | 'feedback' | 'match' | 'interaction';
  title: string;
  description: string;
  date: string;
  company?: string;
  role?: string;
  interviewer?: string;
  outcome?: string;
  status: 'completed' | 'in_progress' | 'cancelled' | 'scheduled';
}

function CandidateHistorySnapshot({ candidateId }: { candidateId: string }) {
  const [, setLocation] = useLocation();
  const candidateName = candidateId === "21" ? "James" : candidateId === "22" ? "Emma" : candidateId === "32" ? "Tom" : candidateId === "33" ? "Maya" : "Lucy";

  // Unified candidate data - SINGLE SOURCE OF TRUTH
  const getCandidateData = (candidateId: string) => {
    if (candidateId === "21") {
      // James Mitchell - returning candidate, fast-track eligible  
      return {
        applicationCount: 3,
        lastPollenInteraction: "2024-12-08",
        lastPollenTeamMember: "Karen Whitelaw",
        isFastTrack: true,
        interactionType: "Pollen Interview"
      };
    } else if (candidateId === "22") {
      // Emma Thompson - first application
      return {
        applicationCount: 1,
        lastPollenInteraction: null,
        lastPollenTeamMember: null,
        isFastTrack: false,
        interactionType: null
      };
    } else if (candidateId === "24") {
      // Michael Roberts - first application, no previous Pollen interaction
      return {
        applicationCount: 1,
        lastPollenInteraction: null,
        lastPollenTeamMember: null,
        isFastTrack: false,
        interactionType: null
      };
    } else if (candidateId === "25") {
      // Alex Johnson - CURRENT VIEW: 4 applications as shown in admin profile
      return {
        applicationCount: 4,
        lastPollenInteraction: "2024-10-22",
        lastPollenTeamMember: "Sophie O'Brien", 
        isFastTrack: true,
        interactionType: "Pollen Interview"
      };
    } else if (candidateId === "33") {
      // Maya Patel - first application
      return {
        applicationCount: 1,
        lastPollenInteraction: null,
        lastPollenTeamMember: null,
        isFastTrack: false,
        interactionType: null
      };
    } else {
      // Default - first application
      return {
        applicationCount: 1,
        lastPollenInteraction: null,
        lastPollenTeamMember: null,
        isFastTrack: false,
        interactionType: null
      };
    }
  };

  const candidateData = getCandidateData(candidateId);

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {candidateData.lastPollenInteraction ? (
              <>
                <span className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-xs text-white font-bold">
                  ✓
                </span>
                <div className="text-sm">
                  <span className="text-gray-900">
                    Last spoke with {candidateData.lastPollenTeamMember} on{' '}
                    {new Date(candidateData.lastPollenInteraction).toLocaleDateString('en-GB', { 
                      day: 'numeric', 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
              </>
            ) : (
              <div className="text-sm text-gray-600">
                {candidateData.applicationCount === 1 ? 'First application' : `${candidateData.applicationCount} previous applications`}
              </div>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation(`/admin/candidate-action-timeline/${candidateId}`)}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            View History
          </Button>
        </div>
      </div>
    </div>
  );
}

interface AssessmentScore {
  category: string;
  score: number;
  maxScore: number;
  percentage: number;
  icon: string;
  title: string;
  description: string;
  howScored: string;
  aiGenerated: boolean;
}

interface SkillsAssessment {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidateLocation: string;
  profilePicture?: string;
  jobTitle: string;
  company: string;
  applicationDate: string;
  
  // Overall Score
  overallScore: number;
  averageForRole: number;
  top10Threshold: number;
  basedOnCandidates: number;
  
  // Detailed Assessment Scores (matches job seeker view exactly)
  assessmentScores: AssessmentScore[];
  
  // Assessment responses
  assessmentResponses: Array<{
    questionId: number;
    question: string;
    response: string;
    wordCount: number;
  }>;
  
  // Admin review status
  reviewStatus: 'pending' | 'approved' | 'amended';
  adminNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export default function AdminAssessmentReviewSimple() {
  const { candidateId } = useParams<{ candidateId: string }>();
  const [, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentEditingScore, setCurrentEditingScore] = useState<AssessmentScore | null>(null);
  const [editedScore, setEditedScore] = useState<number>(0);
  const [editReason, setEditReason] = useState("");
  
  // New state for CTA flow
  const [scoresApproved, setScoresApproved] = useState(false);
  const [scoresLocked, setScoresLocked] = useState(false); // Locked after final action taken
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'interview' | 'reject' | 'match' | null>(null);
  const [overrideReason, setOverrideReason] = useState("");
  
  const { toast } = useToast();

  // Fetch assessment data with detailed scoring that matches job seeker view
  const { data: assessment, isLoading } = useQuery<SkillsAssessment>({
    queryKey: [`/api/admin/skills-assessment/${candidateId}`],
    initialData: {
      id: "assessment-1",
      candidateId: candidateId || "21",
      candidateName: candidateId === "21" ? "James Mitchell" : candidateId === "22" ? "Emma Thompson" : candidateId === "32" ? "Tom Harrison" : candidateId === "33" ? "Maya Patel" : "Lucy Brown",
      candidateEmail: candidateId === "21" ? "james.mitchell@email.com" : candidateId === "22" ? "emma.thompson@email.com" : candidateId === "32" ? "tom.harrison@email.com" : candidateId === "33" ? "maya.patel@email.com" : "lucy.brown@email.com",
      candidateLocation: candidateId === "21" ? "London, UK" : candidateId === "22" ? "Bristol, UK" : candidateId === "32" ? "Glasgow, UK" : candidateId === "33" ? "Edinburgh, UK" : "Manchester, UK",
      profilePicture: candidateId === "21" 
        ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
        : "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      jobTitle: "Marketing Assistant",
      company: "TechFlow Solutions",
      applicationDate: "2025-01-15",
      
      // Overall Score (matches job seeker view)
      overallScore: candidateId === "21" ? 77 : 84,
      averageForRole: 65,
      top10Threshold: 85,
      basedOnCandidates: 90,
      
      // Detailed Assessment Scores (exactly matching the job seeker view format)
      assessmentScores: [
        {
          category: "creative_campaign",
          score: candidateId === "21" ? 80 : 85,
          maxScore: 100,
          percentage: candidateId === "21" ? 80 : 85,
          icon: "Lightbulb",
          title: "Creative Campaign Development",
          description: candidateId === "21" 
            ? "Outstanding creative campaign development with innovative concepts and strategic execution"
            : "Exceptional creative thinking with original ideas and strong strategic planning",
          howScored: "This assessment evaluates your ability to develop creative marketing campaigns that engage target audiences. We look for original ideas, strategic thinking, and the ability to translate concepts into actionable campaign elements.",
          aiGenerated: true
        },
        {
          category: "data_analysis",
          score: candidateId === "21" ? 80 : 88,
          maxScore: 100,
          percentage: candidateId === "21" ? 80 : 88,
          icon: "BarChart3",
          title: "Data Analysis & Insights",
          description: candidateId === "21"
            ? "Exceptional data analysis with clear insights and actionable recommendations"
            : "Strong analytical skills with comprehensive data interpretation and strategic insights",
          howScored: "This assessment evaluates your ability to analyze data and extract meaningful insights for decision-making. We look for analytical thinking, attention to patterns, and the ability to translate data into business recommendations.",
          aiGenerated: true
        },
        {
          category: "written_communication",
          score: candidateId === "21" ? 70 : 75,
          maxScore: 100,
          percentage: candidateId === "21" ? 70 : 75,
          icon: "MessageSquare",
          title: "Written Communication",
          description: candidateId === "21"
            ? "Strong professional communication with good clarity and appropriate tone"
            : "Effective written communication with clear structure and professional style",
          howScored: "This assessment evaluates your ability to communicate clearly and professionally in written format. We look for appropriate tone, clear structure, comprehensive explanations, and the ability to convey complex ideas in an accessible way. Strong written communication demonstrates professionalism and helps build effective working relationships.",
          aiGenerated: true
        },
        {
          category: "strategic_planning",
          score: candidateId === "21" ? 77 : 82,
          maxScore: 100,
          percentage: candidateId === "21" ? 77 : 82,
          icon: "TrendingUp",
          title: "Strategic Planning",
          description: candidateId === "21"
            ? "Strong strategic planning with good analysis and structured thinking"
            : "Excellent strategic planning capabilities with comprehensive analysis and structured approach",
          howScored: "This assessment evaluates your ability to think strategically and plan effectively for achieving goals. We look for systematic thinking, consideration of multiple factors, and the ability to create actionable plans.",
          aiGenerated: true
        }
      ],
      
      assessmentResponses: [
        {
          questionId: 1,
          question: "Describe your approach to creating a social media strategy for a new product launch.",
          response: candidateId === "21" 
            ? "I would start by conducting thorough market research to understand our target audience and their social media habits. Then I'd develop a content calendar that tells a compelling story about the product, highlighting its unique benefits. I'd focus on creating engaging, shareable content across multiple platforms, with platform-specific adaptations. I'd also plan for influencer partnerships and user-generated content campaigns to build authentic buzz. Throughout the campaign, I'd monitor engagement metrics and adjust our approach based on real-time feedback."
            : "I would begin with comprehensive audience research to identify the most effective channels and content types. My strategy would include a pre-launch teaser campaign to build anticipation, followed by a coordinated launch across multiple platforms with tailored content for each. I'd incorporate user-generated content, influencer collaborations, and interactive elements like polls and contests. Post-launch, I'd focus on community management and using analytics to optimize performance and extend the campaign's reach.",
          wordCount: candidateId === "21" ? 287 : 295
        },
        {
          questionId: 2,
          question: "How would you measure the success of a digital marketing campaign?",
          response: candidateId === "21"
            ? "Success measurement should align with campaign objectives. For awareness campaigns, I'd track reach, impressions, and share of voice. For engagement, I'd monitor likes, comments, shares, and time spent on content. For conversion-focused campaigns, I'd measure click-through rates, conversion rates, and return on ad spend (ROAS). I'd also look at qualitative metrics like sentiment analysis and brand perception. Setting up proper attribution models and using tools like Google Analytics and social media insights would be essential for accurate measurement."
            : "I would establish clear KPIs before launch based on campaign objectives. For brand awareness: reach, impressions, brand mention volume, and share of voice. For engagement: likes, shares, comments, saves, and average engagement rates. For conversions: click-through rates, cost per acquisition, conversion rates, and ROAS. I'd also track qualitative metrics through sentiment analysis and surveys. Regular reporting with tools like Google Analytics, social media insights, and attribution modeling would ensure we're measuring the full customer journey accurately.",
          wordCount: candidateId === "21" ? 312 : 324
        }
      ],
      
      reviewStatus: 'pending',
      adminNotes: ""
    }
  });

  // Helper function to get icon component
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Lightbulb': return Lightbulb;
      case 'BarChart3': return BarChart3;
      case 'MessageSquare': return MessageSquare;
      case 'TrendingUp': return TrendingUp;
      default: return FileText;
    }
  };

  // Save review mutation
  const saveReviewMutation = useMutation({
    mutationFn: async (data: { 
      status: 'approved' | 'amended',
      notes: string,
      amendedScores?: { [category: string]: number }
    }) => {
      return await apiRequest("PUT", `/api/admin/skills-assessment/${candidateId}`, {
        reviewStatus: data.status,
        adminNotes: data.notes,
        amendedScores: data.amendedScores,
        reviewedBy: "Holly",
        reviewedAt: new Date().toISOString()
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/skills-assessment/${candidateId}`] });
      toast({
        title: variables.status === 'approved' ? "Assessment Approved" : "Scores Amended",
        description: `Assessment has been ${variables.status === 'approved' ? 'approved' : 'amended'} successfully`,
      });
      setEditModalOpen(false);
    },
  });

  // Edit score mutation
  const editScoreMutation = useMutation({
    mutationFn: async (data: { category: string, newScore: number, reason: string }) => {
      return await apiRequest("PUT", `/api/admin/skills-assessment/${candidateId}/edit-score`, {
        category: data.category,
        newScore: data.newScore,
        reason: data.reason,
        editedBy: "Holly",
        editedAt: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/skills-assessment/${candidateId}`] });
      toast({
        title: "Score Updated",
        description: "Assessment score has been updated successfully",
      });
      setEditModalOpen(false);
      setCurrentEditingScore(null);
      setEditedScore(0);
      setEditReason("");
    },
  });

  // Candidate action mutations
  const candidateActionMutation = useMutation({
    mutationFn: async (action: 'interview' | 'reject' | 'match') => {
      return await apiRequest("PUT", `/api/admin/candidates/${candidateId}/status`, {
        action,
        reviewedBy: "Holly",
        reviewedAt: new Date().toISOString()
      });
    },
    onSuccess: (_, action) => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/candidates/${candidateId}`] });
      
      setConfirmDialogOpen(false);
      setPendingAction(null);
      setScoresLocked(true); // Lock scores after final action
      
      // Redirect to interview availability page for interview action (no toast needed)
      if (action === 'interview') {
        setLocation(`/admin/interview-availability/${candidateId}`);
      } else {
        // Show toast for other actions only
        const actionLabels = {
          reject: 'marked as not progressing',
          match: 'matched to employer'
        };
        toast({
          title: "Candidate Updated",
          description: `Candidate has been ${actionLabels[action]} successfully`,
        });
      }
    },
  });

  const handleApprove = () => {
    saveReviewMutation.mutate({ 
      status: 'approved', 
      notes: adminNotes 
    });
  };

  const handleApproveAIScores = () => {
    setScoresApproved(true);
    toast({
      title: "AI Scores Approved",
      description: "AI assessment scores have been approved. You can now take further actions.",
    });
  };

  const handleCandidateAction = (action: 'interview' | 'reject' | 'match') => {
    if (action === 'interview') {
      // Skip confirmation dialog for interview invitations and proceed directly
      candidateActionMutation.mutate(action);
    } else {
      // Show confirmation dialog for reject/match actions
      setPendingAction(action);
      setConfirmDialogOpen(true);
    }
  };

  const confirmCandidateAction = () => {
    if (pendingAction) {
      candidateActionMutation.mutate(pendingAction);
    }
  };

  const handleAmend = () => {
    if (!overrideReason.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a reason for the score override.",
      });
      return;
    }
    
    saveReviewMutation.mutate({ 
      status: 'amended', 
      notes: `${overrideReason}\n\n${adminNotes}` 
    });
  };

  const resetOverrides = () => {
    setOverrideReason("");
    setAdminNotes("");
  };

  const handleEditScore = (score: AssessmentScore) => {
    setCurrentEditingScore(score);
    setEditedScore(score.score);
    setEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!currentEditingScore || !editReason.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a reason for the score change.",
      });
      return;
    }
    
    editScoreMutation.mutate({ 
      category: currentEditingScore.category,
      newScore: editedScore,
      reason: editReason
    });
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
          <p className="text-gray-600">The assessment could not be found.</p>
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
              
              {/* Candidate Navigation */}
              <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // Navigate to previous candidate - mock functionality
                    const prevId = candidateId === "21" ? "22" : "21";
                    setLocation(`/admin/assessment-review-simple/${prevId}`);
                  }}
                  className="p-1 h-6 w-6"
                >
                  <ChevronLeft className="h-3 w-3" />
                </Button>
                <span className="text-xs text-gray-600 px-2">
                  {candidateId === "21" ? "1" : "2"} of 2
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    // Navigate to next candidate - mock functionality
                    const nextId = candidateId === "21" ? "22" : "21";
                    setLocation(`/admin/assessment-review-simple/${nextId}`);
                  }}
                  className="p-1 h-6 w-6"
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {candidateId === "21" ? "James Mitchell" : candidateId === "22" ? "Emma Thompson" : candidateId === "32" ? "Tom Harrison" : candidateId === "33" ? "Maya Patel" : "Lucy Brown"} - Assessment
                  </h1>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLocation(`/admin/candidate-profile/${candidateId}`)}
                    className="text-xs px-2 py-1"
                  >
                    <User className="h-3 w-3 mr-1" />
                    View Profile
                  </Button>
                </div>
                <div className="space-y-2">
                  <h2 className="text-xs sm:text-sm font-medium text-gray-900">Step 1: Review & Edit Scores</h2>
                  <p className="text-xs sm:text-sm text-gray-600">
                    You can review and edit scores until providing a candidate update.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {!scoresLocked ? (
                <>
                  {!scoresApproved ? (
                    <Button
                      onClick={handleApproveAIScores}
                      disabled={saveReviewMutation.isPending}
                      className="bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      <span className="text-xs sm:text-sm">Approve Scores</span>
                    </Button>
                  ) : (
                    <Badge className="bg-green-100 text-green-800">
                      <Check className="h-3 w-3 mr-1" />
                      Scores Approved
                    </Badge>
                  )}
                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit3 className="h-3 w-3 mr-1" />
                    <span className="text-xs sm:text-sm">Edit Scores</span>
                  </Button>
                </>
              ) : (
                <Badge className="bg-gray-100 text-gray-700">
                  <Lock className="h-3 w-3 mr-1" />
                  Scores Locked
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Candidate History Snapshot */}
      <CandidateHistorySnapshot candidateId={candidateId || "21"} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Sidebar - Candidate Info */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <img 
                    src={assessment.profilePicture}
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

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={() => setLocation(`/admin/candidate-profile/${candidateId}`)}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <User className="h-4 w-4 mr-2" />
                  View Full Profile
                </Button>
                
                <Button
                  onClick={() => setLocation(`/admin/interview-availability/${candidateId}`)}
                  className="w-full justify-start bg-pink-600 hover:bg-pink-700"
                  size="sm"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Invite to Interview
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Assessment Scores (matches job seeker view exactly) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Overall Score Card - matches job seeker view */}
            <Card>
              <CardHeader className="text-center">
                <div className="text-6xl font-bold text-blue-600 mb-2">
                  {assessment?.overallScore}%
                </div>
                <CardTitle className="text-xl">Overall Score</CardTitle>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Average for this role: {assessment?.averageForRole}%</p>
                  <p>Top 10% threshold: {assessment?.top10Threshold}%</p>
                  <p>Based on {assessment?.basedOnCandidates} candidates</p>
                </div>
              </CardHeader>
            </Card>

            {/* What We Assessed */}
            <Card>
              <CardHeader>
                <CardTitle>What We Assessed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    Congratulations! Your application has progressed to the interview stage. You 
                    performed well in the assessment and show strong potential for this role.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Assessment Scores */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Your Assessment Scores
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {assessment?.assessmentScores.map((scoreData, index) => {
                  const IconComponent = getIconComponent(scoreData.icon);
                  // Color coding based on score ranges
                  const getScoreColor = (percentage: number) => {
                    if (percentage >= 85) return { bg: 'bg-green-100', text: 'text-green-600', icon: 'text-green-600' };
                    if (percentage >= 75) return { bg: 'bg-blue-100', text: 'text-blue-600', icon: 'text-blue-600' };
                    if (percentage >= 65) return { bg: 'bg-yellow-100', text: 'text-yellow-600', icon: 'text-yellow-600' };
                    return { bg: 'bg-red-100', text: 'text-red-600', icon: 'text-red-600' };
                  };
                  const scoreColors = getScoreColor(scoreData.percentage);
                  
                  return (
                    <Card key={scoreData.category} className="border border-gray-200">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 ${scoreColors.bg} rounded-lg flex items-center justify-center`}>
                              <IconComponent className={`w-5 h-5 ${scoreColors.icon}`} />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{scoreData.title}</h3>
                              <p className="text-gray-600 text-sm">{scoreData.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-3xl font-bold ${scoreColors.text}`}>
                              {scoreData.percentage}%
                            </span>
                            {scoreData.aiGenerated && (
                              <div className="flex gap-2">
                                <Button 
                                  onClick={() => handleEditScore(scoreData)}
                                  variant="outline" 
                                  size="sm"
                                  className="flex items-center gap-1"
                                >
                                  <Edit3 className="w-3 h-3" />
                                  Edit
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <strong>How we scored this:</strong> {scoreData.howScored}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </CardContent>
            </Card>

            {/* Assessment Responses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Assessment Responses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {assessment.assessmentResponses.map((response, index) => (
                  <div key={response.questionId} className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold mb-2">Question {index + 1}</h4>
                    <p className="text-gray-700 mb-3">{response.question}</p>
                    
                    <div className="bg-gray-50 p-4 rounded-lg mb-2">
                      <p className="text-gray-800 mb-2">{response.response}</p>
                      <div className="text-xs text-gray-500">
                        {response.wordCount} words
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Bottom CTAs - Candidate Actions */}
            <Card className="border-2 border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <UserCheck className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="text-sm sm:text-base">Step 2: Provide Candidate Update</span>
                </CardTitle>
                <p className="text-xs sm:text-sm text-gray-600">
                  Select an action to notify the candidate. This will lock scores and send an update.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    onClick={() => handleCandidateAction('interview')}
                    disabled={!scoresApproved || candidateActionMutation.isPending || scoresLocked}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
                    size="lg"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Invite to Pollen Interview
                  </Button>
                  
                  <Button
                    onClick={() => handleCandidateAction('match')}
                    disabled={!scoresApproved || candidateActionMutation.isPending || scoresLocked}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300"
                    size="lg"
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    Match to Employer
                  </Button>
                  
                  <Button
                    onClick={() => handleCandidateAction('reject')}
                    disabled={!scoresApproved || candidateActionMutation.isPending || scoresLocked}
                    variant="outline"
                    className="border-red-200 text-red-700 hover:bg-red-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200"
                    size="lg"
                  >
                    <UserX className="h-4 w-4 mr-2" />
                    Not Progressing
                  </Button>
                </div>
                
                {!scoresApproved && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-amber-800">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Please approve or edit AI scores before taking action on this candidate
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Admin Actions */}
            {isEditing && (
              <Card>
                <CardHeader>
                  <CardTitle>Admin Review</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Reason for Score Override (required)
                    </label>
                    <Input
                      value={overrideReason}
                      onChange={(e) => setOverrideReason(e.target.value)}
                      placeholder="Why are you changing these scores?"
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Additional Notes
                    </label>
                    <Textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Any additional notes about this review..."
                      rows={2}
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <Button 
                      onClick={handleAmend}
                      disabled={saveReviewMutation.isPending}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {saveReviewMutation.isPending ? 'Saving...' : 'Save Amended Scores'}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        resetOverrides();
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Edit Score Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Assessment Score</DialogTitle>
          </DialogHeader>
          {currentEditingScore && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">{currentEditingScore.title}</h3>
                <p className="text-sm text-gray-600">Current AI Score: {currentEditingScore.score}%</p>
              </div>
              
              <div>
                <label className="text-sm font-medium">New Score</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={editedScore}
                  onChange={(e) => setEditedScore(parseInt(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Reason for Edit</label>
                <Textarea
                  placeholder="Explain why you're changing this score..."
                  value={editReason}
                  onChange={(e) => setEditReason(e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button 
                  onClick={handleSaveEdit}
                  disabled={editScoreMutation.isPending}
                  className="flex-1"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setEditModalOpen(false)}
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700">
              {pendingAction === 'interview' && "Are you sure you want to invite this candidate to a Pollen interview?"}
              {pendingAction === 'match' && "Are you sure you want to match this candidate to an employer?"}
              {pendingAction === 'reject' && "Are you sure you want to mark this candidate as not progressing?"}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              This action cannot be undone.
            </p>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setConfirmDialogOpen(false);
                setPendingAction(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmCandidateAction}
              disabled={candidateActionMutation.isPending}
              className={
                pendingAction === 'reject' 
                  ? "bg-red-600 hover:bg-red-700" 
                  : pendingAction === 'interview'
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-green-600 hover:bg-green-700"
              }
            >
              {candidateActionMutation.isPending ? 'Processing...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}