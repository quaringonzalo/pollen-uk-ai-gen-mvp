import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  ArrowLeft, Search, Filter, User, MapPin, Star, Calendar, 
  Eye, MessageCircle, CheckCircle, XCircle, Edit, Trophy, Briefcase, FileText,
  ThumbsUp, Save, Edit3, RotateCcw, Clock, X
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLocation, useParams } from "wouter";

interface AssessmentResponse {
  questionId: number;
  question: string;
  response: string;
  wordCount: number;
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  location: string;
  applicationDate: string;
  status: 'new' | 'in_progress' | 'complete';
  subStatus: 'new_application' | 'application_reviewed' | 'invited_to_pollen_interview' | 
            'pollen_interview_scheduled' | 'pollen_interview_complete' | 'matched_to_employer' |
            'employer_interview_requested' | 'employer_interview_booked' | 'employer_interview_complete' |
            'offer_issued' | 'not_progressing' | 'hired';
  overallSkillsScore: number;
  technicalSkills: number;
  problemSolving: number;
  communication: number;
  creativity: number;
  experienceLevel: string;
  keyStrengths: string[];
  profilePicture?: string;
  lastActivity: string;
  applicationTime: string;
  completionStage?: 'application' | 'pollen_interview' | 'employer_interview';
  feedback?: string;
  assessmentSubmission?: {
    submittedAt: string;
    estimatedTime: string;
    actualTime: string;
    responses: AssessmentResponse[];
  };
}

interface ScoreOverride {
  candidateId: string;
  overallSkillsScore?: number;
  technicalSkills?: number;
  problemSolving?: number;
  communication?: number;
  creativity?: number;
  reason: string;
}

interface JobDetails {
  id: string;
  title: string;
  company: string;
  applicantCount: number;
  status: string;
}

export default function AdminJobApplicantsGrid() {
  const { jobId } = useParams<{ jobId: string }>();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("application_date");
  const [assessmentSplitViewOpen, setAssessmentSplitViewOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<Candidate | null>(null);
  const [editingMode, setEditingMode] = useState(false);
  const [overrides, setOverrides] = useState<Record<string, ScoreOverride>>({});
  
  // Check if any candidates have completed interviews (scores should be locked)
  const hasCompletedInterviewCandidates = candidates.some(candidate => {
    return candidate.subStatus === 'pollen_interview_complete' || 
           candidate.subStatus === 'matched_to_employer' ||
           candidate.subStatus === 'employer_interview_requested' ||
           candidate.subStatus === 'employer_interview_booked' ||
           candidate.subStatus === 'employer_interview_complete' ||
           candidate.subStatus === 'offer_issued' ||
           candidate.subStatus === 'hired';
  });
  const [assessmentModalOpen, setAssessmentModalOpen] = useState(false);
  const { toast } = useToast();

  // Fetch job details
  const { data: job } = useQuery<JobDetails>({
    queryKey: [`/api/admin/jobs/${jobId}`],
    initialData: {
      id: jobId || "1",
      title: "Marketing Assistant",
      company: "TechFlow Solutions",
      applicantCount: 23,
      status: "active"
    }
  });

  // Fetch candidates for this job
  const { data: candidates = [], isLoading } = useQuery<Candidate[]>({
    queryKey: [`/api/admin/jobs/${jobId}/candidates`],
    initialData: [
      {
        id: "21",
        name: "James Mitchell",
        email: "james.mitchell@email.com",
        location: "London, UK",
        applicationDate: "2025-01-15",
        status: "in_progress",
        subStatus: "pollen_interview_complete",
        overallSkillsScore: 88,
        technicalSkills: 85,
        problemSolving: 90,
        communication: 95,
        creativity: 82,
        experienceLevel: "Entry Level",
        keyStrengths: ["Social Media Management", "Content Creation", "Team Collaboration"],
        profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        lastActivity: "2025-01-16",
        applicationTime: "2025-01-15T10:30:00Z",
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
            }
          ]
        }
      },
      {
        id: "22",
        name: "Emma Thompson",
        email: "emma.thompson@email.com", 
        location: "Bristol, UK",
        applicationDate: "2025-01-16",
        status: "new",
        subStatus: "application_reviewed",
        overallSkillsScore: 85,
        technicalSkills: 82,
        problemSolving: 87,
        communication: 85,
        creativity: 86,
        experienceLevel: "Entry Level",
        keyStrengths: ["Content Creation", "Social Media", "Storytelling"],
        profilePicture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
        lastActivity: "2025-01-16",
        applicationTime: "2025-01-16T09:15:00Z",
        assessmentSubmission: {
          submittedAt: "2025-01-16T09:15:00Z",
          estimatedTime: "45-60 minutes",
          actualTime: "47 minutes",
          responses: [
            {
              questionId: 1,
              question: "Describe your approach to creating a social media strategy for a new product launch.",
              response: "I'd begin with detailed audience research and competitor analysis to identify gaps and opportunities. My strategy would focus on storytelling that connects emotionally with the target audience while highlighting product benefits. I'd create platform-specific content calendars with engaging visuals and interactive elements to drive engagement.",
              wordCount: 198
            },
            {
              questionId: 2,
              question: "How would you measure the success of a digital marketing campaign?",
              response: "I would establish clear KPIs before launch based on campaign objectives. For brand awareness: reach, impressions, brand mention volume. For engagement: likes, shares, comments, saves, and average engagement rates. For conversions: click-through rates, cost per acquisition, conversion rates, and ROAS. I'd use tools like Google Analytics and social media insights for accurate measurement.",
              wordCount: 245
            }
          ]
        }
      },
      {
        id: "15",
        name: "Alex Chen",
        email: "alex.chen@email.com",
        location: "Birmingham, UK", 
        applicationDate: "2025-01-13",
        status: "complete",
        overallSkillsScore: 82,
        technicalSkills: 80,
        problemSolving: 85,
        communication: 85,
        creativity: 78,
        experienceLevel: "Entry Level",
        keyStrengths: ["Project Management", "Email Marketing", "Organization"],
        profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        lastActivity: "2025-01-14",
        applicationTime: "2025-01-13T16:45:00Z",
        assessmentSubmission: {
          submittedAt: "2025-01-14T16:45:00Z",
          estimatedTime: "45-60 minutes",
          actualTime: "58 minutes",
          responses: [
            {
              questionId: 1,
              question: "Describe your approach to creating a social media strategy for a new product launch.",
              response: "I would take a structured approach starting with thorough research into the target market and competitive landscape. Creating detailed buyer personas would guide content creation and platform selection. The strategy would include a content calendar with consistent messaging across platforms, while adapting format and tone for each channel. I'd plan for community engagement and user-generated content to build authentic connections. Regular monitoring and adjustment based on performance metrics would ensure the campaign stays on track.",
              wordCount: 276
            },
            {
              questionId: 2,
              question: "How would you measure the success of a digital marketing campaign?",
              response: "Measuring campaign success requires establishing clear KPIs upfront that align with business goals. I'd track awareness metrics like reach and brand mention volume, engagement through likes, comments, and shares, and conversion metrics including click-through rates and sales attribution. Tools like Google Analytics, social media insights, and UTM parameters would provide comprehensive data. I'd create regular reports showing both quantitative results and qualitative insights, including customer feedback and sentiment analysis to understand the full impact.",
              wordCount: 289
            }
          ]
        }
      },
      {
        id: "8",
        name: "Sophie Williams", 
        email: "sophie.williams@email.com",
        location: "Leeds, UK",
        applicationDate: "2025-01-12",
        status: "new",
        overallSkillsScore: 79,
        technicalSkills: 75,
        problemSolving: 82,
        communication: 86,
        creativity: 74,
        experienceLevel: "Entry Level",
        keyStrengths: ["Customer Service", "Social Media", "Communication"],
        profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        lastActivity: "2025-01-13",
        applicationTime: "2025-01-12T11:15:00Z",
        subStatus: "new_application",
        assessmentSubmission: {
          submittedAt: "2025-01-13T11:15:00Z",
          estimatedTime: "45-60 minutes",
          actualTime: "63 minutes",
          responses: [
            {
              questionId: 1,
              question: "Describe your approach to creating a social media strategy for a new product launch.",
              response: "I would start by researching the target audience and understanding which social media platforms they use most. Then I'd create a content plan that shows the product's benefits in a clear and engaging way. I think it's important to have a consistent posting schedule and to interact with followers regularly. I'd also look at what competitors are doing to make sure our approach stands out. Tracking likes, comments, and shares would help me understand what's working well.",
              wordCount: 268
            },
            {
              questionId: 2,
              question: "How would you measure the success of a digital marketing campaign?",
              response: "To measure campaign success, I would look at several different metrics depending on the campaign goals. For awareness campaigns, I'd check how many people saw our posts and how much our follower count grew. For engagement, I'd count likes, comments, and shares. If the goal is sales, I'd track how many people clicked through to our website and made purchases. I'd use social media analytics tools and Google Analytics to gather this information and create reports to show what worked best.",
              wordCount: 295
            }
          ]
        }
      },
      {
        id: "32",
        name: "Tom Harrison",
        email: "tom.harrison@email.com", 
        location: "Glasgow, UK",
        applicationDate: "2025-01-16",
        status: "new",
        subStatus: "application_reviewed",
        overallSkillsScore: 92,
        technicalSkills: 90,
        problemSolving: 95,
        communication: 88,
        creativity: 95,
        experienceLevel: "Entry Level",
        keyStrengths: ["Strategic Planning", "Data Analysis", "Innovation"],
        profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
        lastActivity: "2025-01-16",
        applicationTime: "2025-01-16T14:30:00Z",
        assessmentSubmission: {
          submittedAt: "2025-01-16T14:30:00Z",
          estimatedTime: "45-60 minutes",
          actualTime: "55 minutes",
          responses: [
            {
              questionId: 1,
              question: "Describe your approach to creating a social media strategy for a new product launch.",
              response: "My approach combines data-driven insights with creative execution. I'd start with comprehensive market research and audience segmentation, then develop a multi-phase campaign strategy with clear KPIs. The content would be optimized for each platform's algorithm while maintaining consistent brand messaging.",
              wordCount: 215
            },
            {
              questionId: 2,
              question: "How would you measure the success of a digital marketing campaign?",
              response: "I'd establish comprehensive measurement frameworks before launch, tracking awareness metrics (reach, impressions, share of voice), engagement metrics (meaningful interactions, time spent), and conversion metrics (CTR, ROAS, LTV). I'd use advanced attribution modeling and predictive analytics to optimize performance in real-time.",
              wordCount: 198
            }
          ]
        }
      },
      {
        id: "33",
        name: "Maya Patel",
        email: "maya.patel@email.com",
        location: "Edinburgh, UK", 
        applicationDate: "2025-01-15",
        status: "new",
        subStatus: "new_application",
        overallSkillsScore: 78,
        technicalSkills: 75,
        problemSolving: 80,
        communication: 82,
        creativity: 76,
        experienceLevel: "Entry Level",
        keyStrengths: ["Community Building", "Authentic Engagement", "Brand Voice"],
        profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
        lastActivity: "2025-01-15",
        applicationTime: "2025-01-15T16:45:00Z",
        assessmentSubmission: {
          submittedAt: "2025-01-15T16:45:00Z",
          estimatedTime: "45-60 minutes",
          actualTime: "51 minutes",
          responses: [
            {
              questionId: 1,
              question: "Describe your approach to creating a social media strategy for a new product launch.",
              response: "I would focus on understanding the target audience's pain points and how the product solves them. Creating authentic, relatable content that showcases real benefits would be key. I'd plan for community building and engagement rather than just broadcasting messages.",
              wordCount: 189
            },
            {
              questionId: 2,
              question: "How would you measure the success of a digital marketing campaign?",
              response: "I'd focus on meaningful engagement over vanity metrics. Quality comments, shares, and genuine interest would be more valuable than just likes or views. I'd track how well content resonates with our community and whether it builds trust and relationships with potential customers.",
              wordCount: 156
            }
          ]
        }
      }
    ]
  });

  // Update candidate status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ candidateId, status }: { candidateId: string, status: string }) => {
      return await apiRequest("PUT", `/api/admin/candidates/${candidateId}/status`, {
        status,
        updatedBy: "Holly",
        updatedDate: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/jobs/${jobId}/candidates`] });
      toast({
        title: "Status updated",
        description: "Candidate status has been updated successfully",
      });
    },
  });

  // Save assessment reviews mutation
  const saveReviewsMutation = useMutation({
    mutationFn: async (data: { 
      action: 'approve_all' | 'amend_selected',
      overrides: Record<string, ScoreOverride>
    }) => {
      return await apiRequest("PUT", `/api/admin/job-assessments/${jobId}/bulk-review`, {
        action: data.action,
        overrides: data.overrides,
        reviewedBy: "Holly",
        reviewedAt: new Date().toISOString()
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/jobs/${jobId}/candidates`] });
      toast({
        title: variables.action === 'approve_all' ? "All assessments approved" : "Assessment overrides saved",
        description: `Assessment reviews have been processed successfully`,
      });
      setEditingMode(false);
      setOverrides({});
    },
  });

  // Filter and sort candidates
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || candidate.status === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    switch (sortBy) {
      case "overall_skills":
        return b.overallSkillsScore - a.overallSkillsScore;
      case "technical_skills":
        return b.technicalSkills - a.technicalSkills;
      case "problem_solving":
        return b.problemSolving - a.problemSolving;
      case "communication":
        return b.communication - a.communication;
      case "creativity":
        return b.creativity - a.creativity;
      case "application_date":
        return new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime();
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-green-100 text-green-800">New</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'complete':
        return <Badge className="bg-gray-100 text-gray-800">Complete</Badge>;
      case 'hired':
        return <Badge className="bg-emerald-100 text-emerald-800">Hired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };


  const handleStatusUpdate = (candidateId: string, newStatus: string) => {
    updateStatusMutation.mutate({ candidateId, status: newStatus });
  };

  const handleScoreOverride = (candidateId: string, field: keyof Omit<ScoreOverride, 'candidateId' | 'reason'>, value: number) => {
    setOverrides(prev => ({
      ...prev,
      [candidateId]: {
        ...prev[candidateId],
        candidateId,
        [field]: value,
        reason: prev[candidateId]?.reason || ""
      }
    }));
  };

  const handleReasonChange = (candidateId: string, reason: string) => {
    setOverrides(prev => ({
      ...prev,
      [candidateId]: {
        ...prev[candidateId],
        candidateId,
        reason
      }
    }));
  };

  const handleApproveAll = () => {
    saveReviewsMutation.mutate({ 
      action: 'approve_all',
      overrides: {}
    });
  };

  const handleSaveAmendments = () => {
    const hasOverrides = Object.keys(overrides).length > 0;
    const allHaveReasons = Object.values(overrides).every(override => override.reason.trim());
    
    if (!hasOverrides) {
      toast({
        title: "No changes made",
        description: "Please override at least one score before saving amendments.",
        variant: "destructive",
      });
      return;
    }

    if (!allHaveReasons) {
      toast({
        title: "Missing reasons",
        description: "Please provide a reason for all score overrides.",
        variant: "destructive",
      });
      return;
    }
    
    saveReviewsMutation.mutate({ 
      action: 'amend_selected',
      overrides
    });
  };

  const getScoreDisplay = (candidateId: string, field: keyof Candidate, originalScore: number) => {
    const override = overrides[candidateId];
    const overrideValue = override?.[field as keyof ScoreOverride] as number;
    
    if (overrideValue !== undefined && overrideValue !== originalScore) {
      return (
        <div className="text-center">
          <div className="line-through text-gray-400 text-xs">{originalScore}%</div>
          <div className="font-bold text-orange-600 text-xs">{overrideValue}%</div>
        </div>
      );
    }
    return <div className="text-center font-medium text-xs">{originalScore}%</div>;
  };

  const openAssessmentModal = (candidate: Candidate) => {
    setSelectedAssessment(candidate);
    setAssessmentModalOpen(true);
  };

  const closeAssessmentModal = () => {
    setAssessmentModalOpen(false);
    setSelectedAssessment(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 admin-compact-mode">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setLocation("/admin/jobs")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Jobs
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {editingMode ? "Assessment Score Review" : "Job Applicants & Assessment Scores"}
                </h1>
                <p className="text-sm text-gray-600">
                  {job?.title} at {job?.company} • {filteredCandidates.length} of {candidates.length} candidates
                  {editingMode && " • Review and override scores as needed"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {!editingMode ? (
                <>
                  <Button
                    onClick={handleApproveAll}
                    disabled={saveReviewsMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Approve All Scores
                  </Button>
                  <Button
                    onClick={() => {
                      if (hasCompletedInterviewCandidates) {
                        toast({
                          title: "Scores Locked",
                          description: "Assessment scores cannot be edited for candidates who have completed Pollen interviews.",
                          variant: "destructive",
                        });
                      } else {
                        setEditingMode(true);
                      }
                    }}
                    variant="outline"
                    size="sm"
                    className={hasCompletedInterviewCandidates ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    {hasCompletedInterviewCandidates ? "Scores Locked" : "Override Scores"}
                  </Button>
                  <Button
                    onClick={() => setLocation(`/admin/job-review/${jobId}`)}
                    variant="outline"
                    size="sm"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Job Details
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleSaveAmendments}
                    disabled={saveReviewsMutation.isPending}
                    className="bg-orange-600 hover:bg-orange-700"
                    size="sm"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Overrides
                  </Button>
                  <Button
                    onClick={() => {
                      setEditingMode(false);
                      setOverrides({});
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="complete">Complete</SelectItem>
                <SelectItem value="hired">Hired</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overall_skills">Overall Skills</SelectItem>
                <SelectItem value="technical_skills">Technical Skills</SelectItem>
                <SelectItem value="problem_solving">Problem Solving</SelectItem>
                <SelectItem value="communication">Communication</SelectItem>
                <SelectItem value="creativity">Creativity</SelectItem>
                <SelectItem value="application_date">Application Date</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Override Reasons Section */}
        {editingMode && Object.keys(overrides).length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Override Reasons (Required)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {Object.entries(overrides).map(([candidateId, override]) => {
                  const candidate = candidates.find(c => c.id === candidateId);
                  return (
                    <div key={candidateId} className="border-l-4 border-orange-500 pl-4">
                      <div className="font-medium mb-2">{candidate?.name}</div>
                      <Textarea
                        value={override.reason}
                        onChange={(e) => handleReasonChange(candidateId, e.target.value)}
                        placeholder="Why are you overriding this candidate's scores?"
                        rows={2}
                        className="w-full"
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Candidates Table - Desktop */}
        <div className="hidden lg:block bg-white rounded-lg border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px] sticky left-0 bg-white">Candidate</TableHead>
                <TableHead className="w-[80px]">Status</TableHead>
                <TableHead className="w-[100px] text-center">Overall Skills</TableHead>
                <TableHead className="w-[100px] text-center">Technical</TableHead>
                <TableHead className="w-[100px] text-center">Problem Solving</TableHead>
                <TableHead className="w-[100px] text-center">Communication</TableHead>
                <TableHead className="w-[100px] text-center">Creativity</TableHead>
                <TableHead className="w-[100px]">Review Status</TableHead>
                <TableHead className="w-[80px]">Applied</TableHead>
                <TableHead className="w-[120px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCandidates.map((candidate) => (
                <TableRow key={candidate.id} className="hover:bg-gray-50">
                  {/* Candidate Info - Sticky */}
                  <TableCell className="sticky left-0 bg-white">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={candidate.profilePicture || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`}
                        alt={candidate.name}
                        className="w-8 h-8 rounded-full border border-gray-200"
                      />
                      <div>
                        <div className="font-medium text-sm">{candidate.name}</div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {candidate.location}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  
                  {/* Status */}
                  <TableCell>
                    {getStatusBadge(candidate.status)}
                  </TableCell>
                  
                  {/* Assessment Scores */}
                  <TableCell>
                    {getScoreDisplay(candidate.id, 'overallSkillsScore', candidate.overallSkillsScore)}
                    {editingMode && (
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={overrides[candidate.id]?.overallSkillsScore || candidate.overallSkillsScore}
                        onChange={(e) => handleScoreOverride(candidate.id, 'overallSkillsScore', parseInt(e.target.value) || candidate.overallSkillsScore)}
                        className="mt-1 w-16 text-xs h-6"
                      />
                    )}
                  </TableCell>
                  
                  <TableCell>
                    {getScoreDisplay(candidate.id, 'technicalSkills', candidate.technicalSkills)}
                    {editingMode && (
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={overrides[candidate.id]?.technicalSkills || candidate.technicalSkills}
                        onChange={(e) => handleScoreOverride(candidate.id, 'technicalSkills', parseInt(e.target.value) || candidate.technicalSkills)}
                        className="mt-1 w-16 text-xs h-6"
                      />
                    )}
                  </TableCell>
                  
                  <TableCell>
                    {getScoreDisplay(candidate.id, 'problemSolving', candidate.problemSolving)}
                    {editingMode && (
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={overrides[candidate.id]?.problemSolving || candidate.problemSolving}
                        onChange={(e) => handleScoreOverride(candidate.id, 'problemSolving', parseInt(e.target.value) || candidate.problemSolving)}
                        className="mt-1 w-16 text-xs h-6"
                      />
                    )}
                  </TableCell>
                  
                  <TableCell>
                    {getScoreDisplay(candidate.id, 'communication', candidate.communication)}
                    {editingMode && (
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={overrides[candidate.id]?.communication || candidate.communication}
                        onChange={(e) => handleScoreOverride(candidate.id, 'communication', parseInt(e.target.value) || candidate.communication)}
                        className="mt-1 w-16 text-xs h-6"
                      />
                    )}
                  </TableCell>
                  
                  <TableCell>
                    {getScoreDisplay(candidate.id, 'creativity', candidate.creativity)}
                    {editingMode && (
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={overrides[candidate.id]?.creativity || candidate.creativity}
                        onChange={(e) => handleScoreOverride(candidate.id, 'creativity', parseInt(e.target.value) || candidate.creativity)}
                        className="mt-1 w-16 text-xs h-6"
                      />
                    )}
                  </TableCell>
                  
                  {/* Review Status */}
                  <TableCell>
                    <Badge className={
                      candidate.reviewStatus === 'approved' 
                        ? "bg-green-100 text-green-800 text-xs" 
                        : candidate.reviewStatus === 'amended'
                        ? "bg-orange-100 text-orange-800 text-xs"
                        : "bg-gray-100 text-gray-800 text-xs"
                    }>
                      {candidate.reviewStatus}
                    </Badge>
                    {overrides[candidate.id] && (
                      <Badge className="bg-orange-100 text-orange-800 mt-1 text-xs">
                        Override
                      </Badge>
                    )}
                  </TableCell>
                  
                  {/* Application Date */}
                  <TableCell>
                    <div className="text-xs text-gray-600">
                      {new Date(candidate.applicationDate).toLocaleDateString('en-GB', { 
                        day: '2-digit', 
                        month: 'short' 
                      })}
                    </div>
                  </TableCell>
                  
                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setLocation(`/admin/candidate-profile/${candidate.id}`)}
                        className="h-7 px-2 text-xs"
                        title="View candidate profile"
                      >
                        <User className="h-3 w-3" />
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openAssessmentModal(candidate)}
                        className="h-7 px-2 text-xs"
                        title="View assessment responses"
                      >
                        <FileText className="h-3 w-3" />
                      </Button>
                      
                      {candidate.status === 'new' && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 h-7 px-2 text-xs"
                          onClick={() => handleStatusUpdate(candidate.id, 'in_progress')}
                          disabled={updateStatusMutation.isPending}
                        >
                          <CheckCircle className="h-3 w-3" />
                        </Button>
                      )}
                      
                      {candidate.status === 'in_progress' && (
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 h-7 px-2 text-xs"
                          onClick={() => setLocation(`/admin/candidate-action-timeline/${candidate.id}`)}
                          title="View candidate action timeline"
                        >
                          <MessageCircle className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Candidates Cards - Mobile */}
        <div className="lg:hidden space-y-6 px-1">
          {filteredCandidates.map((candidate) => (
            <Card key={candidate.id} className="shadow-sm border-0 bg-white">
              <CardContent className="p-6">
                {/* Header Section */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start space-x-4">
                    <img 
                      src={candidate.profilePicture || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`}
                      alt={candidate.name}
                      className="w-16 h-16 rounded-full border-2 border-gray-100 object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold text-gray-900 truncate mb-1">{candidate.name}</h3>
                      <div className="flex items-center text-gray-500 mb-2">
                        <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
                        <span className="text-sm">{candidate.location}</span>
                      </div>
                      <div className="text-sm text-gray-400">
                        Applied {new Date(candidate.applicationDate).toLocaleDateString('en-GB', { 
                          day: '2-digit', 
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2 ml-2">
                    {getStatusBadge(candidate.status)}
                  </div>
                </div>
                
                {/* Overall Score - Prominent Display */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl p-5 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Trophy className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-medium text-blue-800">Overall Skills Score</span>
                    </div>
                    <Badge className={
                      candidate.reviewStatus === 'approved' 
                        ? "bg-green-100 text-green-800 border-green-200" 
                        : candidate.reviewStatus === 'amended'
                        ? "bg-orange-100 text-orange-800 border-orange-200"
                        : "bg-gray-100 text-gray-600 border-gray-200"
                    }>
                      {candidate.reviewStatus}
                    </Badge>
                  </div>
                  <div className="text-3xl font-bold text-blue-900 text-center">
                    {editingMode && overrides[candidate.id]?.overallSkillsScore !== undefined 
                      ? `${overrides[candidate.id].overallSkillsScore}%`
                      : `${candidate.overallSkillsScore}%`}
                  </div>
                  {editingMode && (
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={overrides[candidate.id]?.overallSkillsScore || candidate.overallSkillsScore}
                      onChange={(e) => handleScoreOverride(candidate.id, 'overallSkillsScore', parseInt(e.target.value) || candidate.overallSkillsScore)}
                      className="mt-3 h-10 text-center font-semibold"
                      placeholder="Override score..."
                    />
                  )}
                </div>
                
                {/* Score Breakdown Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { key: 'technicalSkills', label: 'Technical', value: candidate.technicalSkills },
                    { key: 'problemSolving', label: 'Problem Solving', value: candidate.problemSolving },
                    { key: 'communication', label: 'Communication', value: candidate.communication },
                    { key: 'creativity', label: 'Creativity', value: candidate.creativity }
                  ].map(({ key, label, value }) => (
                    <div key={key} className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">{label}</div>
                      <div className="text-2xl font-bold text-gray-900 mb-2">
                        {editingMode && overrides[candidate.id]?.[key as keyof ScoreOverride] !== undefined 
                          ? `${overrides[candidate.id][key as keyof ScoreOverride]}%`
                          : `${value}%`}
                      </div>
                      {editingMode && (
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={overrides[candidate.id]?.[key as keyof ScoreOverride] as number || value}
                          onChange={(e) => handleScoreOverride(candidate.id, key as keyof Pick<ScoreOverride, 'technicalSkills' | 'problemSolving' | 'communication' | 'creativity'>, parseInt(e.target.value) || value)}
                          className="h-9 text-sm font-semibold text-center"
                        />
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Override Status Indicator */}
                {overrides[candidate.id] && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-center">
                      <Edit className="h-4 w-4 text-orange-600 mr-2" />
                      <Badge className="bg-orange-100 text-orange-800 border-orange-200 mr-3">Override Active</Badge>
                      <span className="text-sm text-orange-700 font-medium">Score changes pending save</span>
                    </div>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setLocation(`/admin/candidate-profile/${candidate.id}`)}
                      className="h-9 text-xs font-medium border-gray-200 hover:border-gray-300"
                    >
                      <User className="h-3 w-3 mr-1" />
                      Profile
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openAssessmentModal(candidate)}
                      className="h-9 text-xs font-medium border-gray-200 hover:border-gray-300"
                    >
                      <FileText className="h-3 w-3 mr-1" />
                      Assessment
                    </Button>
                  </div>
                  
                  {candidate.status === 'new' && (
                    <Button
                      size="sm"
                      className="w-full h-9 bg-green-600 hover:bg-green-700 text-xs font-medium"
                      onClick={() => handleStatusUpdate(candidate.id, 'in_progress')}
                      disabled={updateStatusMutation.isPending}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Start Review
                    </Button>
                  )}
                  
                  {candidate.status === 'in_progress' && (
                    <Button
                      size="sm"
                      className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-xs font-medium"
                      onClick={() => setLocation(`/admin/candidate-action-timeline/${candidate.id}`)}
                    >
                      <MessageCircle className="h-3 w-3 mr-1" />
                      View Timeline
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredCandidates.length === 0 && (
          <div className="text-center py-12">
            <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "No candidates have applied for this position yet"
              }
            </p>
            {(searchTerm || statusFilter !== "all") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}

        {/* Summary Stats */}
        {candidates.length > 0 && (
          <div className="mt-6 grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-3 text-center">
                <div className="text-xl font-bold text-green-600">
                  {candidates.filter(c => c.status === 'new').length}
                </div>
                <div className="text-xs text-gray-600">New</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3 text-center">
                <div className="text-xl font-bold text-blue-600">
                  {candidates.filter(c => c.status === 'in_progress').length}
                </div>
                <div className="text-xs text-gray-600">In Progress</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3 text-center">
                <div className="text-xl font-bold text-gray-600">
                  {candidates.filter(c => c.interviewStatus === 'completed').length}
                </div>
                <div className="text-xs text-gray-600">Interviews Done</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-3 text-center">
                <div className="text-xl font-bold text-emerald-600">
                  {Math.round(candidates.reduce((sum, c) => sum + c.overallSkillsScore, 0) / candidates.length)}%
                </div>
                <div className="text-xs text-gray-600">Avg Skills Score</div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      
      {/* Assessment Submission Modal */}
      <Dialog open={assessmentModalOpen} onOpenChange={setAssessmentModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden w-[95vw] sm:w-[90vw] lg:w-full mx-auto">
          <div className="flex flex-col h-full max-h-[85vh]">
          <DialogHeader>
            <div className="flex items-center justify-between pr-6">
              <div className="flex items-center gap-3">
                <img 
                  src={selectedAssessment?.profilePicture || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"}
                  alt={selectedAssessment?.name}
                  className="w-10 h-10 rounded-full border"
                />
                <div>
                  <DialogTitle className="text-xl font-bold">
                    {selectedAssessment?.name} - Assessment Submission
                  </DialogTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Marketing Assistant • Submitted {selectedAssessment?.assessmentSubmission ? new Date(selectedAssessment.assessmentSubmission.submittedAt).toLocaleDateString('en-GB') : 'N/A'}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeAssessmentModal}
                className="p-0 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          {selectedAssessment?.assessmentSubmission && (
            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
              {/* Assessment Info */}
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Estimated Time:</span>
                      <div className="font-medium">{selectedAssessment.assessmentSubmission.estimatedTime}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Actual Time:</span>
                      <div className="font-medium flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {selectedAssessment.assessmentSubmission.actualTime}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Overall Score:</span>
                      <div className="font-bold text-lg text-blue-600">{selectedAssessment.overallSkillsScore}%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Assessment Responses */}
              <div className="space-y-4">
                {selectedAssessment.assessmentSubmission.responses.map((response, index) => (
                  <Card key={response.questionId}>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center justify-between">
                        <span>Question {index + 1}</span>
                        <Badge variant="outline" className="text-xs">
                          {response.wordCount} words
                        </Badge>
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
              
              {/* Score Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Score Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{selectedAssessment.technicalSkills}%</div>
                      <div className="text-xs text-gray-600">Technical Skills</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{selectedAssessment.problemSolving}%</div>
                      <div className="text-xs text-gray-600">Problem Solving</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{selectedAssessment.communication}%</div>
                      <div className="text-xs text-gray-600">Communication</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{selectedAssessment.creativity}%</div>
                      <div className="text-xs text-gray-600">Creativity</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Quick Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setLocation(`/admin/candidate-profile/${selectedAssessment.id}`);
                    closeAssessmentModal();
                  }}
                  className="flex items-center justify-center gap-2 h-11 font-medium"
                >
                  <User className="h-4 w-4" />
                  View Full Profile
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setLocation(`/admin/assessment-review/${selectedAssessment.id}`);
                    closeAssessmentModal();
                  }}
                  className="flex items-center justify-center gap-2 h-11 font-medium"
                >
                  <FileText className="h-4 w-4" />
                  Detailed Review
                </Button>
              </div>
            </div>
          )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}