import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  ArrowLeft, Search, User, MapPin, Calendar, 
  Eye, MessageCircle, CheckCircle, FileText, Clock, X,
  MoreHorizontal, Phone, Video, ArrowRight, LayoutGrid, Kanban,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Edit3, Lightbulb, BarChart3, MessageSquare, TrendingUp,
  UserCheck, UserX, ThumbsUp, AlertTriangle, Check, Lock
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
  
  // Mock candidate history data - in real implementation this would come from API
  const getCandidateHistory = (id: string): CandidateHistoryItem[] => {
    const baseHistory = [
      {
        id: "current",
        type: "application" as const,
        title: "Marketing Assistant - Current Application",
        description: "Assessment submitted, under review",
        date: "2025-01-16",
        company: "TechFlow Solutions",
        role: "Marketing Assistant",
        status: "in_progress" as const
      }
    ];

    if (id === "21") {
      return [
        ...baseHistory,
        {
          id: "prev-1",
          type: "application" as const,
          title: "Social Media Coordinator",
          description: "Completed Pollen interview with Karen, matched to employer",
          date: "2024-12-10",
          company: "Creative Studios Ltd",
          role: "Social Media Coordinator",
          interviewer: "Karen Whitelaw",
          outcome: "Progressed to employer interview",
          status: "completed" as const
        },
        {
          id: "prev-2",
          type: "interview" as const,
          title: "Pollen Assessment Interview",
          description: "30-minute behavioural assessment with Karen",
          date: "2024-12-15",
          company: "Creative Studios Ltd",
          interviewer: "Karen Whitelaw",
          outcome: "Strong performance, recommended for employer match",
          status: "completed" as const
        },
        {
          id: "prev-3",
          type: "interaction" as const,
          title: "Profile Consultation",
          description: "Holly provided profile feedback and career guidance",
          date: "2024-11-28",
          interviewer: "Holly Saunders",
          outcome: "Profile strength increased to 85%",
          status: "completed" as const
        }
      ];
    } else if (id === "22") { // Emma Thompson
      return [
        ...baseHistory
        // New candidate - no previous history
      ];
    } else if (id === "24") { // Michael Roberts
      return [
        ...baseHistory,
        {
          id: "prev-24-1",
          type: "application" as const,
          title: "Content Marketing Assistant",
          description: "Applied for junior content creation role",
          date: "2024-10-15",
          company: "Digital Focus Agency",
          role: "Content Marketing Assistant",
          outcome: "Unsuccessful - strong profile, role filled",
          status: "completed" as const
        },
        {
          id: "prev-24-2",
          type: "interaction" as const,
          title: "Career Consultation",
          description: "Holly provided career guidance and application tips",
          date: "2024-12-01",
          interviewer: "Holly Saunders",
          outcome: "Profile optimised for marketing roles",
          status: "completed" as const
        }
      ];
    } else if (id === "25") { // Alex Johnson
      return [
        ...baseHistory,
        {
          id: "prev-25-1",
          type: "application" as const,
          title: "Junior Marketing Executive",
          description: "First application with Pollen",
          date: "2024-08-12",
          company: "Brand Innovations",
          role: "Junior Marketing Executive",
          outcome: "Unsuccessful - gained interview experience",
          status: "completed" as const
        },
        {
          id: "prev-25-2",
          type: "application" as const,
          title: "Social Media Coordinator",
          description: "Second application showing growth",
          date: "2024-09-28",
          company: "Creative Hub",
          role: "Social Media Coordinator",
          outcome: "Unsuccessful - close final decision",
          status: "completed" as const
        },
        {
          id: "prev-25-3",
          type: "interview" as const,
          title: "Pollen Assessment Interview",
          description: "Skills assessment with Karen after profile improvements",
          date: "2024-10-10",
          company: "Creative Hub",
          interviewer: "Karen Whitelaw",
          outcome: "Strong improvement, ready for senior roles",
          status: "completed" as const
        },
        {
          id: "prev-25-4",
          type: "application" as const,
          title: "Marketing Analyst",
          description: "Applied for analytical marketing position",
          date: "2024-10-22",
          company: "DataDriven Marketing",
          role: "Marketing Analyst",
          outcome: "Withdrew - accepted different opportunity",
          status: "cancelled" as const
        },
        {
          id: "prev-25-5",
          type: "interaction" as const,
          title: "Career Check-in",
          description: "Holly discussed new opportunities and updated profile",
          date: "2024-10-22",
          interviewer: "Holly Saunders",
          outcome: "Profile updated for senior marketing roles",
          status: "completed" as const
        }
      ];
    } else {
      return [
        ...baseHistory,
        {
          id: "prev-default-1",
          type: "application" as const,
          title: "Digital Marketing Assistant",
          description: "Initial application, assessment not completed",
          date: "2024-10-22",
          company: "Growth Partners",
          role: "Digital Marketing Assistant",
          outcome: "Withdrew application - family circumstances",
          status: "cancelled" as const
        },
        {
          id: "prev-default-2",
          type: "interaction" as const,
          title: "Re-engagement Call",
          description: "Holly reached out to check on availability",
          date: "2024-11-05",
          interviewer: "Holly Saunders",
          outcome: "Ready to proceed with applications again",
          status: "completed" as const
        }
      ];
    }
  };

  // Simplified candidate data for fast-track eligibility
  const getCandidateData = (id: string) => {
    if (id === "21") { // James Mitchell
      return {
        jobCount: 2,
        hasPollenInteraction: true,
        lastInteractionDate: "15 Dec 2024",
        lastPollenTeamMember: "Karen Whitelaw",
        isFastTrack: true
      };
    } else if (id === "22") { // Emma Thompson
      return {
        jobCount: 0,
        hasPollenInteraction: false,
        lastInteractionDate: null,
        lastPollenTeamMember: null,
        isFastTrack: false
      };
    } else if (id === "24") { // Michael Roberts
      return {
        jobCount: 1,
        hasPollenInteraction: true,
        lastInteractionDate: "1 Dec 2024",
        lastPollenTeamMember: "Holly Saunders",
        isFastTrack: false
      };
    } else if (id === "25") { // Alex Johnson
      return {
        jobCount: 3,
        hasPollenInteraction: true,
        lastInteractionDate: "22 Oct 2024",
        lastPollenTeamMember: "Sophie O'Brien",
        isFastTrack: true
      };
    } else {
      return {
        jobCount: 1,
        hasPollenInteraction: true,
        lastInteractionDate: "5 Nov 2024",
        lastPollenTeamMember: "Holly Saunders",
        isFastTrack: false
      };
    }
  };

  const candidateData = getCandidateData(candidateId);

  return (
    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => setLocation(`/admin/candidate-action-timeline/${candidateId}`)}>
      <div className="flex items-center gap-2">
        {candidateData.hasPollenInteraction && candidateData.lastInteractionDate ? (
          <>
            <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
            <span className="text-xs text-gray-700">
              {candidateData.lastInteractionDate} - {candidateData.lastPollenTeamMember}
            </span>
          </>
        ) : (
          <span className="text-xs text-gray-700">
            {candidateData.jobCount} {candidateData.jobCount === 1 ? 'application' : 'applications'} with Pollen
          </span>
        )}
      </div>
    </div>
  );
}

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
  status: 'new_applicants' | 'in_progress' | 'matched_to_employer' | 'complete';
  subStatus: 'under_review' | 'unopened' | 'invited_to_pollen_interview' | 'pollen_interview_complete' | 'awaiting_employer' | 'interview_requested' | 'interview_booked' | 'interview_complete' | 'offer_issued' | 'not_progressing' | 'hired';
  overallSkillsScore: number;
  profilePicture?: string;
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

interface JobDetails {
  id: string;
  title: string;
  company: string;
  applicantCount: number;
  status: string;
}

export default function AdminJobApplicantsKanban() {
  const { jobId } = useParams<{ jobId: string }>();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"kanban" | "grid">("kanban");
  const [assessmentSplitViewOpen, setAssessmentSplitViewOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<Candidate | null>(null);
  const [isMobileFullPage, setIsMobileFullPage] = useState(false);
  // New state for filtering and sorting
  const [primaryStatusFilter, setPrimaryStatusFilter] = useState<string[]>([]);
  const [subStatusFilter, setSubStatusFilter] = useState<string[]>([]);
  const [scoreFilter, setScoreFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'applicationDate' | 'score' | 'default'>('default');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    new_applicants: true,
    in_progress: true,
    matched_to_employer: true,
    complete: true
  });
  
  // New state for conditional CTA flow - initialize based on candidate's current status
  const [scoresApproved, setScoresApproved] = useState(() => {
    if (selectedAssessment) {
      // Check if candidate already has approved status
      const approvedStatuses = ['invited_to_pollen_interview', 'pollen_interview_complete', 'awaiting_employer', 'interview_requested', 'interview_booked', 'interview_complete', 'offer_issued', 'hired', 'not_progressing'];
      return approvedStatuses.includes(selectedAssessment.subStatus);
    }
    return false;
  });
  const [scoresLocked, setScoresLocked] = useState(() => {
    if (selectedAssessment) {
      // Scores are locked if candidate has been actioned (beyond invited_to_pollen_interview)
      const lockedStatuses = ['pollen_interview_complete', 'awaiting_employer', 'interview_requested', 'interview_booked', 'interview_complete', 'offer_issued', 'hired', 'not_progressing'];
      return lockedStatuses.includes(selectedAssessment.subStatus);
    }
    return false;
  });
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'interview' | 'reject' | 'match' | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedScores, setEditedScores] = useState({
    creative: 80,
    dataAnalysis: 80, 
    communication: 70,
    strategic: 77
  });
  
  const { toast } = useToast();

  // Initialize edited scores and approval states when assessment is selected
  useEffect(() => {
    if (selectedAssessment) {
      const defaultScores = selectedAssessment.id === "21" 
        ? { creative: 80, dataAnalysis: 80, communication: 70, strategic: 77 }
        : { creative: 85, dataAnalysis: 88, communication: 75, strategic: 82 };
      setEditedScores(defaultScores);
      
      // Update approval and lock states based on candidate's current status
      const approvedStatuses = ['invited_to_pollen_interview', 'pollen_interview_complete', 'awaiting_employer', 'interview_requested', 'interview_booked', 'interview_complete', 'offer_issued', 'hired', 'not_progressing'];
      const lockedStatuses = ['pollen_interview_complete', 'awaiting_employer', 'interview_requested', 'interview_booked', 'interview_complete', 'offer_issued', 'hired', 'not_progressing'];
      
      setScoresApproved(approvedStatuses.includes(selectedAssessment.subStatus));
      setScoresLocked(lockedStatuses.includes(selectedAssessment.subStatus));
    }
  }, [selectedAssessment]);

  // Helper function to determine if a candidate's scores are approved
  const isScoreApproved = (candidate: Candidate): boolean => {
    // Scores are considered approved if candidate has progressed beyond initial review stages
    // or if they are the currently selected assessment and scoresApproved is true
    if (selectedAssessment?.id === candidate.id && scoresApproved) {
      return true;
    }
    
    // Business logic: scores are considered approved if candidate has moved beyond initial review (invited to interview or beyond)
    const approvedStatuses = ['invited_to_pollen_interview', 'pollen_interview_complete', 'awaiting_employer', 'interview_requested', 'interview_booked', 'interview_complete', 'offer_issued', 'hired', 'not_progressing'];
    return approvedStatuses.includes(candidate.subStatus);
  };

  // Handle saving edited scores
  const handleSaveScores = () => {
    // In a real app, this would make an API call to save the scores
    toast({
      title: "Scores updated",
      description: "Assessment scores have been saved successfully.",
    });
    setIsEditing(false);
    setScoresApproved(false); // Reset approval status when scores are edited
  };

  // Fetch job details
  const { data: job } = useQuery<JobDetails>({
    queryKey: [`/api/admin/jobs/${jobId}`],
    initialData: {
      id: jobId || "1",
      title: "Marketing Assistant",
      company: "TechFlow Solutions",
      applicantCount: 19,
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
        profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        applicationTime: "2025-01-16T10:30:00Z",
        assessmentSubmission: {
          submittedAt: "2025-01-16T10:30:00Z",
          estimatedTime: "45-60 minutes",
          actualTime: "52 minutes",
          responses: [
            {
              questionId: 1,
              question: "Q1. Describe your approach to creating a social media strategy for a new product launch.",
              response: "I would start by conducting thorough market research to understand our target audience and their social media habits. Then I'd develop a content calendar that tells a compelling story about the product, highlighting its unique benefits. I'd focus on creating engaging, shareable content across multiple platforms, with platform-specific adaptations. I'd also plan for influencer partnerships and user-generated content campaigns to build authentic buzz. Throughout the campaign, I'd monitor engagement metrics and adjust our approach based on real-time feedback.",
              wordCount: 287
            },
            {
              questionId: 2,
              question: "Q2. How would you measure the success of a marketing campaign and what metrics would you prioritise?",
              response: "I would establish clear success metrics before campaign launch, focusing on both reach and conversion goals. Key metrics would include engagement rates, click-through rates, conversion tracking, and brand awareness metrics. I'd use tools like Google Analytics and social media insights to monitor performance daily. I'd create comprehensive reports showing ROI and actionable insights for future campaigns. I believe in data-driven decision making and would use these metrics to optimise campaigns in real-time.",
              wordCount: 268
            },
            {
              questionId: 3,
              question: "Q3. Describe a time when you had to work under pressure to meet a tight deadline. How did you manage your time and priorities?",
              response: "During my final university semester, I had three major assignments due within the same week while working part-time. I created a detailed schedule breaking down each project into smaller tasks with specific deadlines. I prioritised the most challenging assignment first when my energy was highest, and used time-blocking to ensure focused work sessions. I communicated early with my employer to adjust my work schedule and sought help from study groups for complex topics. By staying organised and proactive, I submitted all assignments on time and maintained high standards.",
              wordCount: 334
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
        status: "new_applicants",
        subStatus: "under_review",
        overallSkillsScore: 85,
        profilePicture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
        applicationTime: "2025-01-16T09:15:00Z",
        assessmentSubmission: {
          submittedAt: "2025-01-16T09:15:00Z",
          estimatedTime: "45-60 minutes",
          actualTime: "47 minutes",
          responses: [
            {
              questionId: 1,
              question: "Q1. Describe your approach to creating a social media strategy for a new product launch.",
              response: "I'd begin with detailed audience research and competitor analysis to identify gaps and opportunities. My strategy would focus on storytelling that connects emotionally with the target audience while highlighting product benefits. I'd create platform-specific content calendars with engaging visuals and interactive elements to drive engagement.",
              wordCount: 198
            },
            {
              questionId: 2,
              question: "Q2. How would you measure the success of a marketing campaign and what metrics would you prioritise?",
              response: "I'd establish clear KPIs before launching, focusing on both engagement and conversion metrics. Primary metrics would include reach, engagement rate, click-through rates, and conversion tracking. I'd use analytics tools to monitor performance in real-time and create weekly reports highlighting trends and insights. Post-campaign analysis would include ROI calculation and audience feedback to inform future strategies.",
              wordCount: 242
            },
            {
              questionId: 3,
              question: "Q3. Describe a time when you had to work under pressure to meet a tight deadline. How did you manage your time and priorities?",
              response: "During my university group project, our team had only 48 hours to completely redesign our marketing presentation after receiving major client feedback. I immediately created a task breakdown with clear priorities and deadlines for each team member. I focused on the most critical elements first - updating our key messaging and core slides. I maintained constant communication with the team through a shared workspace and scheduled quick check-ins every 4 hours. By staying organised and maintaining clear communication, we delivered a polished presentation that exceeded client expectations.",
              wordCount: 321
            },
            {
              questionId: 4,
              question: "Q4. If you noticed a colleague struggling with their workload, how would you approach offering help while maintaining your own responsibilities?",
              response: "I'd first assess my own capacity and deadlines to understand what support I could realistically offer. Then I'd approach my colleague privately to ask how they're finding things and if there's any way I could help. I might offer to take on specific smaller tasks that I could handle efficiently, or suggest we discuss workload distribution with our manager if the issue seems ongoing. I believe supporting team members ultimately benefits everyone, and I'd make sure any help I offered didn't compromise my own deliverables.",
              wordCount: 289
            },
            {
              questionId: 5,
              question: "Q5. You're tasked with promoting a new product to a target audience you're unfamiliar with. Walk us through your research and strategy development process.",
              response: "I'd start by conducting comprehensive audience research using surveys, social media analytics, and industry reports to understand their demographics, preferences, and pain points. I'd analyse competitor strategies to identify successful approaches and market gaps. Next, I'd create detailed buyer personas and map their customer journey to identify key touchpoints. I'd develop content themes that resonate with their values and interests, then test small-scale campaigns to validate messaging before full launch. Throughout the process, I'd maintain close communication with the client to ensure alignment with their brand values and business objectives.",
              wordCount: 378
            }
          ]
        }
      },
      // Add examples for all status types
      {
        id: "23",
        name: "Sarah Williams",
        email: "sarah.williams@email.com",
        location: "Manchester, UK",
        applicationDate: "2025-01-14",
        status: "matched_to_employer",
        subStatus: "awaiting_employer",
        overallSkillsScore: 92,
        profilePicture: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
        applicationTime: "2025-01-14T14:30:00Z"
      },
      {
        id: "24",
        name: "Michael Roberts",
        email: "michael.roberts@email.com",
        location: "Leeds, UK",
        applicationDate: "2025-01-12",
        status: "matched_to_employer",
        subStatus: "interview_complete",
        overallSkillsScore: 89,
        profilePicture: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=100&h=100&fit=crop&crop=face",
        applicationTime: "2025-01-12T11:15:00Z"
      },
      {
        id: "25",
        name: "Lucy Brown",
        email: "lucy.brown@email.com",
        location: "Liverpool, UK",
        applicationDate: "2025-01-17",
        status: "new_applicants",
        subStatus: "unopened",
        overallSkillsScore: 78,
        profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        applicationTime: "2025-01-17T16:45:00Z",
        assessmentSubmission: {
          submittedAt: "2025-01-17T16:45:00Z",
          estimatedTime: "45-60 minutes",
          actualTime: "47 minutes",
          responses: [
            {
              questionId: 1,
              question: "Q1. Describe your approach to creating a social media strategy for a new product launch.",
              response: "I would start by researching the target audience through social media analytics and surveys to understand their preferences and behaviors. Then I'd create engaging content that highlights the product's unique features across different platforms like Instagram, Facebook, and TikTok. I would also collaborate with influencers to reach a broader audience and create authentic buzz around the product launch.",
              wordCount: 234
            },
            {
              questionId: 2,
              question: "Q2. How would you measure the success of a marketing campaign and what metrics would you prioritise?",
              response: "I'd focus on key metrics like engagement rates, click-through rates, conversion rates, and ROI. I would use Google Analytics and social media insights to track these metrics daily. I'd also monitor brand mentions and sentiment analysis to gauge public perception. Setting up conversion tracking would help me understand which channels drive the most valuable customers and optimize budget allocation accordingly.",
              wordCount: 256
            },
            {
              questionId: 3,
              question: "Q3. Describe a time when you had to work under pressure to meet a tight deadline. How did you manage your time and priorities?",
              response: "During my final year at university, I had three major assignments due in the same week while managing a part-time job. I created a detailed schedule breaking down each project into smaller, manageable tasks with specific deadlines. I prioritized the most challenging assignment first and used the Pomodoro technique to maintain focus. I also communicated with my manager to adjust my work hours and formed a study group to share resources and support each other.",
              wordCount: 298
            }
          ]
        }
      },
      {
        id: "26",
        name: "David Clark",
        email: "david.clark@email.com",
        location: "Newcastle, UK",
        applicationDate: "2025-01-11",
        status: "complete",
        subStatus: "hired",
        overallSkillsScore: 94,
        profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
        applicationTime: "2025-01-11T13:20:00Z"
      },
      {
        id: "15",
        name: "Alex Chen",
        email: "alex.chen@email.com",
        location: "Birmingham, UK", 
        applicationDate: "2025-01-13",
        status: "complete",
        subStatus: "not_progressing",
        overallSkillsScore: 82,
        profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        applicationTime: "2025-01-14T16:45:00Z",
        completionStage: "pollen_interview",
        feedback: "Strong technical skills but communication style didn't align with team dynamics.",
        assessmentSubmission: {
          submittedAt: "2025-01-14T16:45:00Z",
          estimatedTime: "45-60 minutes",
          actualTime: "58 minutes",
          responses: [
            {
              questionId: 1,
              question: "Q1. Describe your approach to creating a social media strategy for a new product launch.",
              response: "I would take a structured approach starting with thorough research into the target market and competitive landscape. Creating detailed buyer personas would guide content creation and platform selection. The strategy would include a content calendar with consistent messaging across platforms, while adapting format and tone for each channel. I'd plan for community engagement and user-generated content to build authentic connections. Regular monitoring and adjustment based on performance metrics would ensure the campaign stays on track.",
              wordCount: 276
            },
            {
              questionId: 2,
              question: "Q2. How would you measure the success of a marketing campaign and what metrics would you prioritise?",
              response: "I'd focus on metrics that align with business objectives, starting with conversion rates and customer acquisition cost. Engagement metrics like reach, impressions, and interaction rates would help gauge audience resonance. I'd track click-through rates and time spent on content to measure engagement quality. Return on ad spend (ROAS) would be crucial for budget justification. I'd also monitor brand sentiment and share of voice to understand broader brand impact beyond immediate conversions.",
              wordCount: 258
            },
            {
              questionId: 3,
              question: "Q3. Describe a time when you had to work under pressure to meet a tight deadline. How did you manage your time and priorities?",
              response: "During my retail job, our team had to completely reorganise the store layout in just two days for a major sale event. I volunteered to coordinate the project and immediately created a detailed timeline with specific tasks for each team member. I prioritised high-impact areas first and broke down complex tasks into manageable chunks. I set up regular check-ins and was flexible when issues arose, reallocating resources as needed. Clear communication and staying calm under pressure helped us complete the project on time and the sale exceeded targets by 15%.",
              wordCount: 312
            },
            {
              questionId: 4,
              question: "Q4. If you noticed a colleague struggling with their workload, how would you approach offering help while maintaining your own responsibilities?",
              response: "I'd approach them discreetly to check how they're managing and offer specific assistance based on my available capacity. I might suggest breaking down their tasks differently or offer to take on elements that match my skills. If it's a recurring issue, I'd encourage them to speak with management or suggest we discuss team workload distribution as a group. I believe a supportive team environment benefits everyone, and helping colleagues ultimately strengthens our collective performance.",
              wordCount: 247
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
        status: "complete",
        subStatus: "hired",
        overallSkillsScore: 79,
        profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        applicationTime: "2025-01-13T11:15:00Z",
        completionStage: "employer_interview",
        assessmentSubmission: {
          submittedAt: "2025-01-13T11:15:00Z",
          estimatedTime: "45-60 minutes",
          actualTime: "63 minutes",
          responses: [
            {
              questionId: 1,
              question: "Q1. Describe your approach to creating a social media strategy for a new product launch.",
              response: "I would start by researching the target audience and understanding which social media platforms they use most. Then I'd create a content plan that shows the product's benefits in a clear and engaging way. I think it's important to have a consistent posting schedule and to interact with followers regularly. I'd also look at what competitors are doing to make sure our approach stands out. Tracking likes, comments, and shares would help me understand what's working well.",
              wordCount: 268
            },
            {
              questionId: 2,
              question: "Q2. How would you measure the success of a marketing campaign and what metrics would you prioritise?",
              response: "I'd track engagement metrics like likes, comments, and shares to see how people are responding to our content. Website traffic and click-through rates would show if people are actually visiting our site. I'd also monitor follower growth and reach to understand if we're expanding our audience. Sales numbers would be important too, to see if the campaign is actually driving purchases. I'd create simple reports to track these weekly and see what's improving.",
              wordCount: 234
            },
            {
              questionId: 3,
              question: "Q3. Describe a time when you had to work under pressure to meet a tight deadline. How did you manage your time and priorities?",
              response: "During my part-time job at a local café, we had to prepare for a large catering order with only one day's notice when another staff member called in sick. I made a list of everything that needed to be done and tackled the most time-sensitive tasks first, like ordering extra supplies. I stayed organised by setting small goals throughout the day and checking them off as I completed them. I also communicated clearly with my manager about progress. We successfully delivered the order on time and received great feedback from the customer.",
              wordCount: 298
            }
          ]
        }
      },
      // More NEW candidates
      {
        id: "28",
        name: "Michael Roberts",
        email: "michael.roberts@email.com", 
        location: "Glasgow, UK",
        applicationDate: "2025-01-16",
        status: "new_applicants",
        subStatus: "under_review",
        overallSkillsScore: 92,
        profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
        applicationTime: "2025-01-16T14:30:00Z",
        assessmentSubmission: {
          submittedAt: "2025-01-16T14:30:00Z",
          estimatedTime: "45-60 minutes",
          actualTime: "55 minutes",
          responses: [
            {
              questionId: 1,
              question: "Q1. Describe your approach to creating a social media strategy for a new product launch.",
              response: "My approach combines data-driven insights with creative execution. I'd start with comprehensive market research and audience segmentation, then develop a multi-phase campaign strategy with clear KPIs. The content would be optimized for each platform's algorithm while maintaining consistent brand messaging.",
              wordCount: 215
            },
            {
              questionId: 2,
              question: "Q2. How would you measure the success of a marketing campaign and what metrics would you prioritise?",
              response: "I'd implement a comprehensive analytics framework focusing on conversion funnel metrics, customer lifetime value, and attribution modeling. Primary KPIs would include qualified lead generation, cost per acquisition, and revenue attribution to specific campaign elements. I'd use advanced analytics tools to track cross-platform performance and conduct A/B testing to optimise campaign elements continuously. Post-campaign analysis would include incrementality testing to measure true campaign impact versus organic growth.",
              wordCount: 287
            },
            {
              questionId: 3,
              question: "Q3. Describe a time when you had to work under pressure to meet a tight deadline. How did you manage your time and priorities?",
              response: "During my internship at a marketing agency, our team had 72 hours to completely pivot a client's campaign strategy after their main competitor launched a similar product. I immediately initiated a war room approach, mapping out all deliverables and dependencies. I coordinated with designers, copywriters, and media planners to reassign priorities and streamline approval processes. I implemented hourly check-ins and used project management software to track progress in real-time. By maintaining clear communication channels and staying flexible with resource allocation, we delivered a differentiated campaign that outperformed the original by 23%.",
              wordCount: 389
            },
            {
              questionId: 4,
              question: "Q4. If you noticed a colleague struggling with their workload, how would you approach offering help while maintaining your own responsibilities?",
              response: "I'd conduct a quick assessment of both our workloads to identify opportunities for synergy or task redistribution. I'd approach them privately to understand their specific challenges and offer targeted assistance where my skills could add value without compromising my deliverables. If it's a systemic issue, I'd propose a team discussion about workload optimization and resource allocation. I believe in proactive collaboration and would document our approach to create a framework for future team support initiatives.",
              wordCount: 271
            },
            {
              questionId: 5,
              question: "Q5. You're tasked with promoting a new product to a target audience you're unfamiliar with. Walk us through your research and strategy development process.",
              response: "I'd begin with extensive primary and secondary research, including surveys, focus groups, and social listening tools to understand audience behaviours, pain points, and content preferences. I'd analyse competitor strategies and identify white space opportunities. I'd develop multiple buyer personas and create journey maps to identify optimal touchpoints. I'd then design a phased testing approach, starting with small-budget experiments across different channels and messages to validate assumptions before scaling successful approaches. Continuous optimization based on real-time data would ensure maximum ROI and audience engagement.",
              wordCount: 358
            }
          ]
        }
      },
      {
        id: "27",
        name: "Alex Johnson",
        email: "alex.johnson@email.com",
        location: "Edinburgh, UK", 
        applicationDate: "2025-01-15",
        status: "new_applicants",
        subStatus: "under_review",
        overallSkillsScore: 78,
        profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
        applicationTime: "2025-01-15T16:45:00Z",
        assessmentSubmission: {
          submittedAt: "2025-01-15T16:45:00Z",
          estimatedTime: "45-60 minutes",
          actualTime: "51 minutes",
          responses: [
            {
              questionId: 1,
              question: "Q1. Describe your approach to creating a social media strategy for a new product launch.",
              response: "I would focus on understanding the target audience's pain points and how the product solves them. Creating authentic, relatable content that showcases real benefits would be key. I'd plan for community building and engagement rather than just broadcasting messages.",
              wordCount: 189
            },
            {
              questionId: 2,
              question: "Q2. How would you measure the success of a marketing campaign and what metrics would you prioritise?",
              response: "I'd look at engagement metrics first - likes, comments, shares - to see if people are connecting with our content. Then I'd track website visits and sign-ups to see if people are taking action. I think sales figures are important too, but I'd also pay attention to brand awareness and how people talk about us online.",
              wordCount: 198
            },
            {
              questionId: 3,
              question: "Q3. Describe a time when you had to work under pressure to meet a tight deadline. How did you manage your time and priorities?",
              response: "During my final university project, I had to create a complete marketing campaign in just two weeks after my initial idea was rejected. I broke everything down into daily tasks and worked backwards from the deadline. I focused on the core elements first and asked for feedback early to avoid last-minute changes. I also reached out to classmates for help with areas I was struggling with. By staying organised and asking for help when needed, I submitted a strong project on time.",
              wordCount: 278
            }
          ]
        }
      },
      // More IN PROGRESS candidates
      {
        id: "34",
        name: "Daniel Foster",
        email: "daniel.foster@email.com",
        location: "Cardiff, UK",
        applicationDate: "2025-01-14",
        status: "in_progress",
        subStatus: "invited_to_pollen_interview",
        overallSkillsScore: 86,
        profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        applicationTime: "2025-01-14T12:20:00Z",
        assessmentSubmission: {
          submittedAt: "2025-01-14T12:20:00Z",
          estimatedTime: "45-60 minutes",
          actualTime: "49 minutes",
          responses: [
            {
              questionId: 1,
              question: "Q1. Describe your approach to creating a social media strategy for a new product launch.",
              response: "I'd create a comprehensive strategy starting with audience analysis and competitive benchmarking. The campaign would feature engaging content that tells the product story while encouraging user participation through contests and user-generated content.",
              wordCount: 203
            },
            {
              questionId: 2,
              question: "Q2. How would you measure the success of a marketing campaign and what metrics would you prioritise?",
              response: "I'd establish baseline metrics before launch and track engagement rates, reach, and conversion metrics throughout the campaign. Key indicators would include click-through rates, lead generation, and ultimately sales attribution. I'd create weekly dashboards to monitor performance and make real-time adjustments to optimise results.",
              wordCount: 201
            },
            {
              questionId: 3,
              question: "Q3. Describe a time when you had to work under pressure to meet a tight deadline. How did you manage your time and priorities?",
              response: "When planning my university's careers fair, we lost our main sponsor two weeks before the event and had to find replacement funding quickly. I immediately created an action plan, dividing tasks between team members and setting daily check-ins. I prioritised reaching out to local businesses first, then explored alternative funding sources. By staying focused on our goal and maintaining constant communication with the team, we secured new sponsors and delivered a successful event with over 200 attendees.",
              wordCount: 297
            }
          ]
        }
      },
      {
        id: "35",
        name: "Grace Thompson",
        email: "grace.thompson@email.com",
        location: "Newcastle, UK",
        applicationDate: "2025-01-13",
        status: "in_progress",
        subStatus: "pollen_interview_complete",
        overallSkillsScore: 89,
        profilePicture: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
        applicationTime: "2025-01-13T15:10:00Z",
        assessmentSubmission: {
          submittedAt: "2025-01-13T15:10:00Z",
          estimatedTime: "45-60 minutes",
          actualTime: "53 minutes",
          responses: [
            {
              questionId: 1,
              question: "Q1. Describe your approach to creating a social media strategy for a new product launch.",
              response: "My strategy would be built on deep audience insights and platform-specific optimization. I'd create a content mix that educates, entertains, and inspires action. Influencer partnerships and community management would be crucial for building authentic engagement.",
              wordCount: 221
            },
            {
              questionId: 2,
              question: "Q2. How would you measure the success of a marketing campaign and what metrics would you prioritise?",
              response: "I'd create a measurement framework that balances awareness and conversion metrics. Primary KPIs would include brand lift, engagement quality (not just quantity), lead quality scores, and customer acquisition cost. I'd use attribution modeling to understand the customer journey and measure campaign impact across multiple touchpoints, ensuring we're driving meaningful business results.",
              wordCount: 241
            },
            {
              questionId: 3,
              question: "Q3. Describe a time when you had to work under pressure to meet a tight deadline. How did you manage your time and priorities?",
              response: "As social media coordinator for a student organisation, our main event speaker cancelled 48 hours before our annual conference. I immediately activated our crisis plan, reaching out to backup speakers while simultaneously preparing alternative content formats. I coordinated with our video team to create engaging content, updated all promotional materials, and managed communications with 300+ registered attendees. By staying calm, communicating transparently, and having contingency plans ready, we pivoted successfully and received positive feedback about our adaptability.",
              wordCount: 334
            }
          ]
        }
      },
      {
        id: "36",
        name: "Oliver Kumar",
        email: "oliver.kumar@email.com",
        location: "Sheffield, UK",
        applicationDate: "2025-01-12",
        status: "matched_to_employer", 
        subStatus: "interview_booked",
        overallSkillsScore: 94,
        profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        applicationTime: "2025-01-12T10:30:00Z",
        assessmentSubmission: {
          submittedAt: "2025-01-12T10:30:00Z",
          estimatedTime: "45-60 minutes",
          actualTime: "46 minutes",
          responses: [
            {
              questionId: 1,
              question: "Q1. Describe your approach to creating a social media strategy for a new product launch.",
              response: "I would develop a data-driven strategy focusing on customer journey mapping and touchpoint optimization. The content strategy would include educational series, behind-the-scenes content, and strategic partnerships to maximize reach and engagement.",
              wordCount: 234
            },
            {
              questionId: 2,
              question: "Q2. How would you measure the success of a marketing campaign and what metrics would you prioritise?",
              response: "I'd implement advanced analytics tracking across all touchpoints, focusing on attribution modeling and lifetime value metrics. Key performance indicators would include conversion rate optimization, customer journey completion rates, and predictive analytics for future campaign performance. I'd use machine learning tools to identify patterns and optimize in real-time for maximum ROI.",
              wordCount: 239
            },
            {
              questionId: 3,
              question: "Q3. Describe a time when you had to work under pressure to meet a tight deadline. How did you manage your time and priorities?",
              response: "Leading a cross-functional team for a university tech startup competition, we had 48 hours to pivot our entire business model after initial market validation failed. I immediately restructured our approach using agile methodology, creating sprint goals and hourly stand-ups. I delegated based on each team member's core strengths while personally handling the most critical research and strategy elements. Through intensive collaboration and strategic time management, we presented a refined model that won second place.",
              wordCount: 312
            }
          ]
        }
      },
      {
        id: "37",
        name: "Zara Ahmed",
        email: "zara.ahmed@email.com",
        location: "Liverpool, UK",
        applicationDate: "2025-01-11",
        status: "matched_to_employer",
        subStatus: "interview_requested",
        overallSkillsScore: 87,
        profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        applicationTime: "2025-01-11T13:45:00Z",
        assessmentSubmission: {
          submittedAt: "2025-01-11T13:45:00Z",
          estimatedTime: "45-60 minutes",
          actualTime: "58 minutes",
          responses: [
            {
              questionId: 1,
              question: "Q1. Describe your approach to creating a social media strategy for a new product launch.",
              response: "I'd create an integrated campaign that builds anticipation pre-launch, creates excitement during launch, and maintains momentum post-launch. This would include teaser content, launch day activations, and ongoing community engagement strategies.",
              wordCount: 196
            },
            {
              questionId: 2,
              question: "Q2. How would you measure the success of a marketing campaign and what metrics would you prioritise?",
              response: "I'd focus on engagement quality over quantity, tracking meaningful interactions like saves, shares, and comment sentiment. Conversion tracking would include micro-conversions like email signups and macro-conversions like purchases. I'd also monitor brand sentiment shifts and community growth to measure long-term campaign impact beyond immediate sales.",
              wordCount: 218
            },
            {
              questionId: 3,
              question: "Q3. Describe a time when you had to work under pressure to meet a tight deadline. How did you manage your time and priorities?",
              response: "During my work experience at a PR agency, our client's product launch was moved up by two weeks due to competitor activity. I immediately prioritised the most impactful deliverables and created a revised timeline. I coordinated with designers, copywriters, and media contacts to streamline our process. I worked extra hours but also ensured the team stayed motivated by celebrating small wins. We successfully launched on the new timeline and the campaign exceeded engagement targets by 40%.",
              wordCount: 289
            }
          ]
        }
      },
      {
        id: "38",
        name: "Ryan O'Connor",
        email: "ryan.oconnor@email.com",
        location: "Belfast, UK",
        applicationDate: "2025-01-10",
        status: "matched_to_employer",
        subStatus: "interview_booked",
        overallSkillsScore: 83,
        profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        applicationTime: "2025-01-10T11:20:00Z",
        assessmentSubmission: {
          submittedAt: "2025-01-10T11:20:00Z",
          estimatedTime: "45-60 minutes",
          actualTime: "52 minutes",
          responses: [
            {
              questionId: 1,
              question: "Describe your approach to creating a social media strategy for a new product launch.",
              response: "My approach would center on authentic storytelling and community building. I'd develop content that showcases real customer benefits while creating opportunities for audience interaction and feedback. Measurement and optimization would be continuous throughout.",
              wordCount: 208
            }
          ]
        }
      },
      {
        id: "39",
        name: "Isabella Rodriguez",
        email: "isabella.rodriguez@email.com",
        location: "Brighton, UK",
        applicationDate: "2025-01-09",
        status: "matched_to_employer",
        subStatus: "interview_complete",
        overallSkillsScore: 91,
        profilePicture: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
        applicationTime: "2025-01-09T14:15:00Z",
        assessmentSubmission: {
          submittedAt: "2025-01-09T14:15:00Z",
          estimatedTime: "45-60 minutes",
          actualTime: "47 minutes",
          responses: [
            {
              questionId: 1,
              question: "Describe your approach to creating a social media strategy for a new product launch.",
              response: "I would build a comprehensive strategy that combines organic content with strategic paid promotion. The focus would be on creating shareable, value-driven content that naturally encourages word-of-mouth marketing and builds brand loyalty.",
              wordCount: 218
            }
          ]
        }
      },
      {
        id: "40",
        name: "Connor MacLeod",
        email: "connor.macleod@email.com",
        location: "Aberdeen, UK",
        applicationDate: "2025-01-08",
        status: "matched_to_employer",
        subStatus: "offer_issued",
        overallSkillsScore: 88,
        profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
        applicationTime: "2025-01-08T16:30:00Z",
        assessmentSubmission: {
          submittedAt: "2025-01-08T16:30:00Z",
          estimatedTime: "45-60 minutes",
          actualTime: "54 minutes",
          responses: [
            {
              questionId: 1,
              question: "Describe your approach to creating a social media strategy for a new product launch.",
              response: "I'd develop a multi-phased approach with pre-launch buzz building, launch day amplification, and post-launch community nurturing. Each phase would have specific goals and metrics, with content adapted for different audience segments and platforms.",
              wordCount: 225
            }
          ]
        }
      },
      // More COMPLETE candidates
      {
        id: "41",
        name: "Priya Singh",
        email: "priya.singh@email.com",
        location: "Coventry, UK",
        applicationDate: "2025-01-07",
        status: "complete",
        subStatus: "not_progressing",
        overallSkillsScore: 74,
        profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
        applicationTime: "2025-01-07T12:45:00Z",
        completionStage: "application",
        feedback: "Good foundational knowledge but lacked the creative thinking required for the role.",
        assessmentSubmission: {
          submittedAt: "2025-01-07T12:45:00Z",
          estimatedTime: "45-60 minutes",
          actualTime: "61 minutes",
          responses: [
            {
              questionId: 1,
              question: "Describe your approach to creating a social media strategy for a new product launch.",
              response: "I would create posts about the new product and share them on different social media sites. I think it's important to post regularly and use hashtags to get more people to see the posts. I would also try to get people to like and share the content.",
              wordCount: 156
            }
          ]
        }
      },
      {
        id: "42",
        name: "Jake Wilson",
        email: "jake.wilson@email.com",
        location: "Nottingham, UK",
        applicationDate: "2025-01-06",
        status: "complete",
        subStatus: "hired",
        overallSkillsScore: 96,
        profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        applicationTime: "2025-01-06T10:20:00Z",
        completionStage: "employer_interview",
        assessmentSubmission: {
          submittedAt: "2025-01-06T10:20:00Z",
          estimatedTime: "45-60 minutes",
          actualTime: "44 minutes",
          responses: [
            {
              questionId: 1,
              question: "Describe your approach to creating a social media strategy for a new product launch.",
              response: "I would develop a comprehensive strategy integrating market research, audience segmentation, and competitive analysis. The campaign would feature multi-platform content optimization, influencer partnerships, and real-time performance monitoring with adaptive optimization protocols.",
              wordCount: 267
            }
          ]
        }
      },
      {
        id: "43",
        name: "Amelia Jones",
        email: "amelia.jones@email.com",
        location: "Portsmouth, UK",
        applicationDate: "2025-01-05",
        status: "complete",
        subStatus: "not_progressing",
        overallSkillsScore: 71,
        profilePicture: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
        applicationTime: "2025-01-05T15:30:00Z",
        completionStage: "pollen_interview",
        feedback: "Assessment responses showed promise but interview revealed gaps in practical application.",
        assessmentSubmission: {
          submittedAt: "2025-01-05T15:30:00Z",
          estimatedTime: "45-60 minutes",
          actualTime: "59 minutes",
          responses: [
            {
              questionId: 1,
              question: "Describe your approach to creating a social media strategy for a new product launch.",
              response: "I think social media is really important for marketing. I would make sure to post on Facebook, Instagram, and Twitter. The posts should be interesting and have good pictures. I would try to get people to share them with their friends.",
              wordCount: 142
            }
          ]
        }
      }
    ]
  });

  // Get sub-status details
  const getSubStatusDetails = (subStatus: string) => {
    const statusMap = {
      // High Priority - Red (Action Required Immediately)
      'unopened': { label: 'Unopened', cta: 'Review Application', color: 'bg-red-100 text-red-800' },
      'pollen_interview_complete': { label: 'Pollen Interview Complete', cta: 'Provide Update', color: 'bg-red-100 text-red-800' },
      
      // Medium Priority - Orange (Under Review)
      'under_review': { label: 'Under Review', cta: 'Review Application', color: 'bg-orange-100 text-orange-800' },
      
      // Pending - Yellow (Waiting or In Process)
      'invited_to_pollen_interview': { label: 'Invited to Pollen Interview', cta: 'Send Reminder', color: 'bg-yellow-100 text-yellow-800' },
      
      // Matched to Employer - Yellow-Green (Progressing Well)
      'awaiting_employer': { label: 'Awaiting Employer', cta: 'Send Reminder', color: 'bg-lime-100 text-lime-800' },
      'interview_requested': { label: 'Interview Requested', cta: 'Coordinate Interview', color: 'bg-lime-100 text-lime-800' },
      'interview_booked': { label: 'Interview Booked', cta: 'View Details', color: 'bg-lime-100 text-lime-800' },
      'interview_complete': { label: 'Interview Complete', cta: 'Awaiting Decision', color: 'bg-lime-100 text-lime-800' },
      'offer_issued': { label: 'Offer Issued', cta: 'View Offer', color: 'bg-lime-100 text-lime-800' },
      
      // Complete - Green (Success)
      'hired': { label: 'Hired', cta: 'View Details', color: 'bg-green-100 text-green-800' },
      
      // Inactive - Gray (No Action Required)
      'not_progressing': { label: 'Not Progressing', cta: 'View Feedback', color: 'bg-gray-100 text-gray-800' }
    };
    
    // Fallback for any status not in the map - format it nicely
    const fallbackLabel = subStatus.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return statusMap[subStatus as keyof typeof statusMap] || { label: fallbackLabel, cta: 'View', color: 'bg-gray-100 text-gray-800' };
  };

  // Function to get row background color based on primary status
  const getRowColorByStatus = (status: string) => {
    const statusColors = {
      'new_applicants': 'bg-blue-50 hover:bg-blue-100 border-l-2 border-blue-300',
      'in_progress': 'bg-yellow-50 hover:bg-yellow-100 border-l-2 border-yellow-300', 
      'matched_to_employer': 'bg-green-50 hover:bg-green-100 border-l-2 border-green-300',
      'complete': 'bg-gray-50 hover:bg-gray-100 border-l-2 border-gray-300'
    };
    
    return statusColors[status as keyof typeof statusColors] || 'bg-white hover:bg-gray-50';
  };

  const getCTAColorByStatus = (status: string) => {
    const ctaColors = {
      'new_applicants': 'bg-blue-600 hover:bg-blue-700',
      'in_progress': 'bg-yellow-600 hover:bg-yellow-700', 
      'matched_to_employer': 'bg-green-600 hover:bg-green-700',
      'complete': 'bg-gray-600 hover:bg-gray-700'
    };
    
    return ctaColors[status as keyof typeof ctaColors] || 'bg-blue-600 hover:bg-blue-700';
  };

  // Update candidate status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ candidateId, subStatus }: { candidateId: string, subStatus: string }) => {
      return await apiRequest("PUT", `/api/admin/candidates/${candidateId}/status`, {
        subStatus,
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

  // Sub-status to primary status mapping
  const subStatusToPrimaryStatus: { [key: string]: string } = {
    'under_review': 'new_applicants',
    'unopened': 'new_applicants',
    'invited_to_pollen_interview': 'in_progress',
    'pollen_interview_complete': 'in_progress',
    'awaiting_employer': 'matched_to_employer',
    'interview_requested': 'matched_to_employer',
    'interview_booked': 'matched_to_employer',
    'interview_complete': 'matched_to_employer',
    'offer_issued': 'matched_to_employer',
    'not_progressing': 'complete',
    'hired': 'complete'
  };

  // Get available sub-statuses for selected primary statuses
  const getAvailableSubStatuses = () => {
    if (primaryStatusFilter.length === 0) {
      // If no primary status selected, return all sub-statuses
      return Object.keys(subStatusToPrimaryStatus);
    }
    // Return only sub-statuses that belong to the selected primary statuses
    return Object.keys(subStatusToPrimaryStatus).filter(subStatus =>
      primaryStatusFilter.includes(subStatusToPrimaryStatus[subStatus])
    );
  };

  // Filter candidates
  // Status mapping functions
  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'new_applicants': return 'New';
      case 'in_progress': return 'In Progress';
      case 'matched_to_employer': return 'Matched to Employer';
      case 'complete': return 'Complete';
      default: return status;
    }
  };

  const getSubStatusLabel = (subStatus: string) => {
    switch(subStatus) {
      case 'under_review': return 'Under Review';
      case 'unopened': return 'Unopened';
      case 'invited_to_pollen_interview': return 'Invited to Pollen Interview';
      case 'pollen_interview_complete': return 'Pollen Interview Complete';
      case 'awaiting_employer': return 'Awaiting Employer';
      case 'interview_requested': return 'Interview Requested';
      case 'interview_booked': return 'Interview Booked';
      case 'interview_complete': return 'Interview Complete';
      case 'offer_issued': return 'Offer Issued';
      case 'not_progressing': return 'Not Progressing';
      case 'hired': return 'Hired';
      default: return subStatus.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
  };

  // Advanced filtering and sorting
  const filteredCandidates = candidates
    .filter(candidate => {
      // Search filter
      const searchMatch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Primary status filter
      const primaryStatusMatch = primaryStatusFilter.length === 0 || primaryStatusFilter.includes(candidate.status);
      
      // Sub status filter  
      const subStatusMatch = subStatusFilter.length === 0 || subStatusFilter.includes(candidate.subStatus);
      
      // Score filter
      const scoreMatch = scoreFilter.length === 0 || 
                        scoreFilter.some(range => {
                          const threshold = parseInt(range);
                          return candidate.overallSkillsScore >= threshold;
                        });
      
      return searchMatch && primaryStatusMatch && subStatusMatch && scoreMatch;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch(sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'applicationDate':
          comparison = new Date(a.applicationDate).getTime() - new Date(b.applicationDate).getTime();
          break;
        case 'score':
          comparison = a.overallSkillsScore - b.overallSkillsScore;
          break;
        case 'default':
          // Default sorting: primary status first, then application date within each status
          const statusPriority = {
            'new_applicants': 1,
            'in_progress': 2,
            'matched_to_employer': 3,
            'complete': 4
          };
          const statusComparison = (statusPriority[a.status as keyof typeof statusPriority] || 5) - 
                                  (statusPriority[b.status as keyof typeof statusPriority] || 5);
          if (statusComparison !== 0) {
            comparison = statusComparison;
          } else {
            // Within same status, sort by application date (newest first)
            comparison = new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime();
          }
          break;
        default:
          comparison = 0;
      }
      
      return sortBy === 'default' ? comparison : (sortOrder === 'desc' ? -comparison : comparison);
    });

  // Group candidates by status and maintain sorting within each group
  const applySorting = (candidateList: typeof candidates) => {
    return candidateList.sort((a, b) => {
      let comparison = 0;
      
      switch(sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'applicationDate':
          comparison = new Date(a.applicationDate).getTime() - new Date(b.applicationDate).getTime();
          break;
        case 'score':
          comparison = a.overallSkillsScore - b.overallSkillsScore;
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });
  };

  const candidatesByStatus = {
    new_applicants: applySorting(filteredCandidates.filter(c => c.status === 'new_applicants')),
    in_progress: applySorting(filteredCandidates.filter(c => c.status === 'in_progress')),
    matched_to_employer: applySorting(filteredCandidates.filter(c => c.status === 'matched_to_employer')),
    complete: applySorting(filteredCandidates.filter(c => c.status === 'complete'))
  };

  const openAssessmentSplitView = (candidate: Candidate) => {
    setSelectedAssessment(candidate);
    // Check if mobile and switch to full page mode
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setIsMobileFullPage(true);
    } else {
      setAssessmentSplitViewOpen(true);
    }
    
    // Dynamic locking based on candidate status
    const isInterviewComplete = candidate.subStatus === 'pollen_interview_complete' || 
                               candidate.subStatus === 'awaiting_employer' ||
                               candidate.subStatus === 'interview_requested' ||
                               candidate.subStatus === 'interview_booked' ||
                               candidate.subStatus === 'interview_complete' ||
                               candidate.subStatus === 'offer_issued' ||
                               candidate.subStatus === 'hired';
    
    if (isInterviewComplete) {
      setScoresApproved(true); // Scores are automatically approved for completed interviews
      setScoresLocked(true); // Lock scores for completed interviews
    } else {
      setScoresApproved(false); // Reset approval state for new assessment
      setScoresLocked(false); // Reset lock state for new assessment
    }
  };

  const closeAssessmentSplitView = () => {
    setAssessmentSplitViewOpen(false);
    setIsMobileFullPage(false);
    setSelectedAssessment(null);
    setScoresApproved(false); // Reset state when closing
    setScoresLocked(false); // Reset state when closing
  };

  // Navigate between candidates within filtered view (respects all filters)
  const navigateToCandidate = (direction: 'prev' | 'next') => {
    if (!selectedAssessment) return;
    
    // Use filtered candidates instead of status group - respects all current filters
    const currentIndex = filteredCandidates.findIndex(c => c.id === selectedAssessment.id);
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredCandidates.length - 1;
    } else {
      newIndex = currentIndex < filteredCandidates.length - 1 ? currentIndex + 1 : 0;
    }
    
    const newCandidate = filteredCandidates[newIndex];
    setSelectedAssessment(newCandidate);
    
    // Dynamic locking based on new candidate status
    const isInterviewComplete = newCandidate.subStatus === 'pollen_interview_complete' || 
                               newCandidate.subStatus === 'awaiting_employer' ||
                               newCandidate.subStatus === 'interview_requested' ||
                               newCandidate.subStatus === 'interview_booked' ||
                               newCandidate.subStatus === 'interview_complete' ||
                               newCandidate.subStatus === 'offer_issued' ||
                               newCandidate.subStatus === 'hired';
    
    if (isInterviewComplete) {
      setScoresApproved(true); // Scores are automatically approved for completed interviews
      setScoresLocked(true); // Lock scores for completed interviews
    } else {
      setScoresApproved(false); // Reset approval state for new assessment
      setScoresLocked(false); // Reset lock state for new assessment
    }
    setIsEditing(false);
  };

  // Get current candidate position within filtered view
  const getCurrentCandidatePosition = () => {
    if (!selectedAssessment) return { current: 0, total: 0 };
    
    const currentIndex = filteredCandidates.findIndex(c => c.id === selectedAssessment.id);
    
    return {
      current: currentIndex + 1,
      total: filteredCandidates.length
    };
  };

  // Determine if candidate has previous Pollen interview history
  const hasPreviousPollenInterview = selectedAssessment?.id === "21" || selectedAssessment?.id === "25"; // Emma & Alex have interview history
  const canFastTrackToEmployer = hasPreviousPollenInterview;

  // Render assessment content (shared between mobile and desktop)
  const renderAssessmentContent = () => {
    if (!selectedAssessment?.assessmentSubmission) return null;

    return (
      <>
        {/* Assessment Info & Scores */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Assessment Scores</CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-2">
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-1">
                    {Math.round((editedScores.creative + editedScores.dataAnalysis + editedScores.communication + editedScores.strategic) / 4)}%
                  </div>
                  <div className="text-sm font-medium text-gray-700">Overall Score</div>
                </div>
                <div className="h-12 w-px bg-gray-300"></div>
                <div>
                  <span className="text-gray-600 text-sm">Submission Date:</span>
                  <div className="font-medium text-gray-900">{new Date(selectedAssessment.assessmentSubmission.submittedAt).toLocaleDateString('en-GB')}</div>
                </div>
              </div>
            </div>
            
            {/* Individual Scores */}
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-xs text-gray-500">1.</span>
                  <Lightbulb className="h-4 w-4 text-gray-600" />
                  <span className="font-medium text-sm">Creative Campaign Development</span>
                </div>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={editedScores.creative}
                      onChange={(e) => setEditedScores(prev => ({ ...prev, creative: parseInt(e.target.value) || 0 }))}
                      className="w-16 h-8 text-sm"
                    />
                  ) : (
                    <span className="font-bold text-gray-600">{editedScores.creative}%</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-xs text-gray-500">2.</span>
                  <BarChart3 className="h-4 w-4 text-gray-600" />
                  <span className="font-medium text-sm">Data Analysis & Insights</span>
                </div>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={editedScores.dataAnalysis}
                      onChange={(e) => setEditedScores(prev => ({ ...prev, dataAnalysis: parseInt(e.target.value) || 0 }))}
                      className="w-16 h-8 text-sm"
                    />
                  ) : (
                    <span className="font-bold text-gray-600">{editedScores.dataAnalysis}%</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-xs text-gray-500">3.</span>
                  <MessageSquare className="h-4 w-4 text-gray-600" />
                  <span className="font-medium text-sm">Communication & Clarity</span>
                </div>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={editedScores.communication}
                      onChange={(e) => setEditedScores(prev => ({ ...prev, communication: parseInt(e.target.value) || 0 }))}
                      className="w-16 h-8 text-sm"
                    />
                  ) : (
                    <span className="font-bold text-gray-600">{editedScores.communication}%</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-xs text-gray-500">4.</span>
                  <TrendingUp className="h-4 w-4 text-gray-600" />
                  <span className="font-medium text-sm">Strategic Thinking</span>
                </div>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={editedScores.strategic}
                      onChange={(e) => setEditedScores(prev => ({ ...prev, strategic: parseInt(e.target.value) || 0 }))}
                      className="w-16 h-8 text-sm"
                    />
                  ) : (
                    <span className="font-bold text-gray-600">{editedScores.strategic}%</span>
                  )}
                </div>
              </div>
            </div>

            {/* Assessment Responses */}
            {selectedAssessment.assessmentSubmission.responses && (
              <>
                <div className="border-t pt-2">
                  <h4 className="font-medium mb-2 text-sm">Assessment Responses</h4>
                  <div className="space-y-2">
                    {/* Question 1 - Why did you apply question */}
                    <div className="border rounded p-2 bg-gray-50 text-sm">
                      <div className="font-medium text-sm mb-2 text-gray-700">
                        Q1: Why did you apply for this role?
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {selectedAssessment.id === "21" ? 
                          "I'm passionate about digital marketing and love the creative challenge of building engaging campaigns. This role offers the perfect opportunity to combine my analytical skills with creative storytelling. I'm particularly excited about working with innovative brands and learning from experienced marketers while contributing fresh perspectives." :
                        selectedAssessment.id === "22" ?
                          "The role aligns perfectly with my passion for social media and content creation. I'm drawn to the collaborative environment and the opportunity to work on campaigns that make a real impact. I want to grow my skills in digital marketing while contributing to meaningful projects." :
                        selectedAssessment.id === "24" ?
                          "I'm eager to start my career in marketing with a company that values creativity and innovation. This role offers the chance to learn from industry experts while working on diverse projects. I'm particularly interested in the data-driven approach to marketing." :
                          "I'm excited about launching my marketing career and believe this role offers excellent growth opportunities. The company's focus on creativity and collaboration really appeals to me."
                        }
                      </div>
                      <div className="text-xs text-gray-500">
                        Word count: {selectedAssessment.id === "21" ? 67 : selectedAssessment.id === "22" ? 52 : selectedAssessment.id === "24" ? 48 : 35}
                      </div>
                    </div>
                    
                    {/* Original assessment questions (continue numbering from 2) */}
                    {selectedAssessment.assessmentSubmission.responses.map((response, index) => {
                      // Remove duplicate numbering from question text (e.g., "Q1. Describe..." becomes "Describe...")
                      const cleanQuestion = response.question.replace(/^Q\d+\.\s*/, '');
                      
                      return (
                        <div key={index} className="border rounded p-2 bg-gray-50 text-sm">
                          <div className="font-medium text-xs mb-1 text-gray-700">
                            Q{index + 2}: {cleanQuestion}
                          </div>
                          <div className="text-xs text-gray-600 mb-1">
                            {response.response}
                          </div>
                          <div className="text-xs text-gray-500">
                            Word count: {response.wordCount}
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Final question - Additional context questions */}
                    <div className="border rounded-lg p-3 bg-gray-50">
                      <div className="font-medium text-sm mb-2 text-gray-700">
                        Q{2 + (selectedAssessment.assessmentSubmission.responses?.length || 0)}: What interests you most about working in digital marketing?
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {selectedAssessment.id === "21" ? 
                          "The constant evolution of digital platforms fascinates me. I love how data can tell a story and guide creative decisions. The ability to reach specific audiences with tailored messages while measuring real impact is incredibly powerful." :
                        selectedAssessment.id === "22" ?
                          "I'm passionate about how digital marketing can build genuine connections between brands and people. The creative possibilities combined with analytical insights make every campaign unique and exciting." :
                        selectedAssessment.id === "24" ?
                          "The strategic aspect appeals to me most - understanding customer behaviour and creating campaigns that resonate. I'm excited about using technology and creativity to solve marketing challenges." :
                          "The blend of creativity and analytics in digital marketing is what draws me in. I love the idea of creating content that both engages and converts."
                        }
                      </div>
                      <div className="text-xs text-gray-500">
                        Word count: {selectedAssessment.id === "21" ? 58 : selectedAssessment.id === "22" ? 44 : selectedAssessment.id === "24" ? 42 : 38}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Assessment Actions */}
        <div className="p-8 sm:p-10 space-y-6">
          {/* Step 1 - Score Review */}
          <div className="border rounded-lg p-6 bg-gray-50">
            <div className="space-y-4">
              <h4 className="text-xs sm:text-sm font-medium text-gray-900">Step 1: Assessment Score Review</h4>
              <p className="text-xs text-gray-600 mb-4">Review AI-generated scores and make adjustments if needed before proceeding.</p>
              {!scoresLocked ? (
                <div className="flex flex-wrap gap-4 items-center">
                  {!scoresApproved ? (
                    <Button
                      onClick={handleApproveAIScores}
                      size="default"
                      className="bg-green-600 hover:bg-green-700 h-12 px-6 text-base font-medium"
                    >
                      <ThumbsUp className="h-5 w-5 mr-2" />
                      Approve Scores
                    </Button>
                  ) : (
                    <div className="bg-green-100 border border-green-200 rounded-lg p-4 inline-flex items-center gap-3 text-green-700">
                      <Check className="h-5 w-5" />
                      <span className="font-medium text-base">Scores Approved</span>
                    </div>
                  )}
                  
                  {isEditing ? (
                    <>
                      <Button
                        onClick={handleSaveScores}
                        size="default"
                        className="bg-green-600 hover:bg-green-700 h-12 px-6 text-base font-medium"
                      >
                        <Check className="h-5 w-5 mr-2" />
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        size="default"
                        onClick={() => setIsEditing(false)}
                        className="h-12 px-6 text-base font-medium"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="default"
                      onClick={() => setIsEditing(true)}
                      className="h-12 px-6 text-base font-medium"
                    >
                      <Edit3 className="h-5 w-5 mr-2" />
                      Edit Scores
                    </Button>
                  )}
                </div>
              ) : (
                <div className="bg-gray-100 border border-gray-200 rounded-lg p-6 text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-700">
                    <Lock className="h-4 w-4" />
                    <span className="font-medium">Scores Locked - Candidate Actioned</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {!scoresApproved && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-amber-800">
                <AlertTriangle className="h-5 w-5" />
                <span className="text-base font-medium">
                  Approve assessment scores before making candidate decision
                </span>
              </div>
            </div>
          )}

          {/* Step 2 - Candidate action buttons */}
          <div className="border rounded-lg p-6 bg-gray-50">
            <div className="space-y-4 pb-18">
              <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-2">Step 2: Candidate Decision</h4>
              <p className="text-xs text-gray-600 mb-3">Choose next action for this candidate. This will lock scores and update their status.</p>
              <div className="flex gap-4 flex-wrap">
                {/* Show different buttons based on Pollen interview history */}
                <>
                  {/* Simplified action buttons */}
                  <Button
                    onClick={() => handleCandidateAction('interview')}
                    disabled={!scoresApproved || candidateActionMutation.isPending || scoresLocked}
                    size="default"
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 h-12 px-6 text-base font-medium"
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    Invite to Pollen Interview
                  </Button>
                  
                  <Button
                    onClick={() => handleCandidateAction('match')}
                    disabled={!scoresApproved || candidateActionMutation.isPending || scoresLocked || !canFastTrackToEmployer}
                    size="default"
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 h-12 px-6 text-base font-medium"
                  >
                    <UserCheck className="h-5 w-5 mr-2" />
                    Match to Employer
                  </Button>
                </>
                
                {/* Not progressing option always available */}
                <Button
                  onClick={() => handleCandidateAction('reject')}
                  disabled={!scoresApproved || candidateActionMutation.isPending || scoresLocked}
                  variant="outline"
                  size="default"
                  className="border-red-200 text-red-700 hover:bg-red-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 h-12 px-6 text-base font-medium"
                >
                  <UserX className="h-5 w-5 mr-2" />
                  Not Progressing
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const handleStatusUpdate = (candidateId: string, newSubStatus: string) => {
    updateStatusMutation.mutate({ candidateId, subStatus: newSubStatus });
  };

  // Candidate action mutations for conditional CTA flow
  const candidateActionMutation = useMutation({
    mutationFn: async (action: 'interview' | 'reject' | 'match') => {
      return await apiRequest("PUT", `/api/admin/candidates/${selectedAssessment?.id}/status`, {
        action,
        reviewedBy: "Holly",
        reviewedAt: new Date().toISOString()
      });
    },
    onSuccess: (_, action) => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/jobs/${jobId}/candidates`] });
      
      setConfirmDialogOpen(false);
      setPendingAction(null);
      setScoresLocked(true); // Lock scores after final action
      
      // Route to interview availability page for interview invitations (no toast needed)
      if (action === 'interview' && selectedAssessment) {
        setLocation(`/admin/interview-availability/${selectedAssessment.id}`);
      } else {
        // Show toast for other actions only
        const actionLabels = {
          reject: 'marked as not progressing',
          match: 'matched to employer',
          interview: 'invited to interview'
        };
        toast({
          title: "Candidate Updated",
          description: `Candidate has been ${actionLabels[action]} successfully`,
        });
        closeAssessmentSplitView();
      }
    },
  });

  const handleApproveAIScores = () => {
    setScoresApproved(true);
    toast({
      title: "Assessment Approved",
      description: "Scores confirmed. You can now make a candidate decision.",
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

  const toggleGroupExpansion = (groupKey: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupKey]: !prev[groupKey]
    }));
  };

  const handleCTAAction = (candidate: Candidate) => {
    const subStatusDetails = getSubStatusDetails(candidate.subStatus);
    
    switch (candidate.subStatus) {
      case 'unopened':
      case 'under_review':
        openAssessmentSplitView(candidate);
        break;
      case 'pollen_interview_complete':
        // Route to admin update page for "Provide Update"
        setLocation(`/admin/provide-update/${candidate.id}`);
        break;
      case 'interview_booked':
        setLocation(`/admin/interview-details/${candidate.id}`);
        break;
      case 'invited_to_pollen_interview':
      case 'awaiting_employer':
      case 'interview_requested':
        // For "Awaiting" statuses, navigate to timeline
        setLocation(`/admin/candidate-action-timeline/${candidate.id}`);
        break;
      case 'interview_complete':
      case 'offer_issued':
      case 'hired':
        setLocation(`/admin/candidate-action-timeline/${candidate.id}`);
        break;
      case 'not_progressing':
        setLocation(`/admin/candidate-action-timeline/${candidate.id}`);
        break;
      default:
        // For other "Awaiting" statuses, show status info
        toast({
          title: "Status Info",
          description: `Candidate is currently ${subStatusDetails.label.toLowerCase()}`,
        });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 admin-compact-mode">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost" 
                size="sm"
                onClick={() => setLocation('/admin/assigned-jobs')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Jobs</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{job?.title}</h1>
                <p className="text-gray-600">{job?.company} • {candidates.length} Applicants</p>
              </div>
            </div>
          </div>

          {/* Search, Filters and View Toggle */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            

            
            {/* Primary Status Filter */}
            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="px-3 py-2 h-9 text-sm border-gray-300 hover:border-gray-400">
                    Primary Status
                    {primaryStatusFilter.length > 0 && (
                      <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs">
                        {primaryStatusFilter.length}
                      </Badge>
                    )}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem
                    className="flex items-center space-x-2 cursor-pointer"
                    onSelect={(e) => e.preventDefault()}
                    onClick={() => {
                      const isChecked = primaryStatusFilter.includes("new_applicants");
                      const newValues = isChecked 
                        ? primaryStatusFilter.filter(v => v !== "new_applicants")
                        : [...primaryStatusFilter, "new_applicants"];
                      setPrimaryStatusFilter(newValues);
                      if (isChecked) setSubStatusFilter([]);
                    }}
                  >
                    <Checkbox 
                      checked={primaryStatusFilter.includes("new_applicants")}
                      className="pointer-events-none"
                    />
                    <span>New</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center space-x-2 cursor-pointer"
                    onSelect={(e) => e.preventDefault()}
                    onClick={() => {
                      const isChecked = primaryStatusFilter.includes("in_progress");
                      const newValues = isChecked 
                        ? primaryStatusFilter.filter(v => v !== "in_progress")
                        : [...primaryStatusFilter, "in_progress"];
                      setPrimaryStatusFilter(newValues);
                      if (isChecked) setSubStatusFilter([]);
                    }}
                  >
                    <Checkbox 
                      checked={primaryStatusFilter.includes("in_progress")}
                      className="pointer-events-none"
                    />
                    <span>In Progress</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center space-x-2 cursor-pointer"
                    onSelect={(e) => e.preventDefault()}
                    onClick={() => {
                      const isChecked = primaryStatusFilter.includes("matched_to_employer");
                      const newValues = isChecked 
                        ? primaryStatusFilter.filter(v => v !== "matched_to_employer")
                        : [...primaryStatusFilter, "matched_to_employer"];
                      setPrimaryStatusFilter(newValues);
                      if (isChecked) setSubStatusFilter([]);
                    }}
                  >
                    <Checkbox 
                      checked={primaryStatusFilter.includes("matched_to_employer")}
                      className="pointer-events-none"
                    />
                    <span>Matched to Employer</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center space-x-2 cursor-pointer"
                    onSelect={(e) => e.preventDefault()}
                    onClick={() => {
                      const isChecked = primaryStatusFilter.includes("complete");
                      const newValues = isChecked 
                        ? primaryStatusFilter.filter(v => v !== "complete")
                        : [...primaryStatusFilter, "complete"];
                      setPrimaryStatusFilter(newValues);
                      if (isChecked) setSubStatusFilter([]);
                    }}
                  >
                    <Checkbox 
                      checked={primaryStatusFilter.includes("complete")}
                      className="pointer-events-none"
                    />
                    <span>Complete</span>
                  </DropdownMenuItem>
                  {primaryStatusFilter.length > 0 && (
                    <>
                      <div className="border-t my-1"></div>
                      <DropdownMenuItem
                        className="flex items-center justify-center text-blue-600 cursor-pointer"
                        onClick={() => {
                          setPrimaryStatusFilter([]);
                          setSubStatusFilter([]);
                        }}
                      >
                        Clear All
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Sub Status Filter */}
            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="px-3 py-2 h-9 text-sm border-gray-300 hover:border-gray-400"
                    disabled={getAvailableSubStatuses().length === 0}
                  >
                    Sub Status
                    {subStatusFilter.length > 0 && (
                      <Badge variant="secondary" className="ml-2 px-1.5 py-0.5 text-xs">
                        {subStatusFilter.length}
                      </Badge>
                    )}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {getAvailableSubStatuses().length === 0 ? (
                    <DropdownMenuItem disabled className="text-gray-500">
                      Select primary status first
                    </DropdownMenuItem>
                  ) : (
                    <>
                      {getAvailableSubStatuses().map(subStatus => (
                        <DropdownMenuItem
                          key={subStatus}
                          className="flex items-center space-x-2 cursor-pointer"
                          onSelect={(e) => e.preventDefault()}
                          onClick={() => {
                            const isChecked = subStatusFilter.includes(subStatus);
                            const newValues = isChecked 
                              ? subStatusFilter.filter(v => v !== subStatus)
                              : [...subStatusFilter, subStatus];
                            setSubStatusFilter(newValues);
                          }}
                        >
                          <Checkbox 
                            checked={subStatusFilter.includes(subStatus)}
                            className="pointer-events-none"
                          />
                          <span>{getSubStatusLabel(subStatus)}</span>
                        </DropdownMenuItem>
                      ))}
                      {subStatusFilter.length > 0 && (
                        <>
                          <div className="border-t my-1"></div>
                          <DropdownMenuItem
                            className="flex items-center justify-center text-blue-600 cursor-pointer"
                            onClick={() => setSubStatusFilter([])}
                          >
                            Clear All
                          </DropdownMenuItem>
                        </>
                      )}
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Score Filter */}
            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="px-3 py-2 h-9 text-sm border-gray-300 hover:border-gray-400">
                    {scoreFilter.length === 0 ? "All Scores" : `${scoreFilter.length} Score Range${scoreFilter.length !== 1 ? 's' : ''}`}
                    {scoreFilter.length > 0 && (
                      <Badge className="ml-2 bg-blue-600 text-white text-xs min-w-[18px] h-4 rounded-full flex items-center justify-center p-0">
                        {scoreFilter.length}
                      </Badge>
                    )}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-40">
                  {['90+', '80+', '70+', '60+', '50+'].map(scoreRange => (
                    <DropdownMenuItem
                      key={scoreRange}
                      className="flex items-center space-x-2 cursor-pointer"
                      onSelect={(e) => e.preventDefault()}
                      onClick={() => {
                        const isChecked = scoreFilter.includes(scoreRange);
                        const newValues = isChecked 
                          ? scoreFilter.filter(v => v !== scoreRange)
                          : [...scoreFilter, scoreRange];
                        setScoreFilter(newValues);
                      }}
                    >
                      <Checkbox 
                        checked={scoreFilter.includes(scoreRange)}
                        className="pointer-events-none"
                      />
                      <span>{scoreRange}% Score</span>
                    </DropdownMenuItem>
                  ))}
                  {scoreFilter.length > 0 && (
                    <>
                      <div className="border-t my-1"></div>
                      <DropdownMenuItem
                        className="flex items-center justify-center text-blue-600 cursor-pointer"
                        onClick={() => setScoreFilter([])}
                      >
                        Clear All
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Sort Controls */}
            <div className="flex items-center gap-2">
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as 'name' | 'applicationDate' | 'score' | 'default')}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="default">Default Order</option>
                <option value="applicationDate">Sort by Date Applied</option>
                <option value="name">Sort by Name</option>
                <option value="score">Sort by Score</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-2 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
                title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
              >
                {sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>
            
            <ToggleGroup 
              type="single" 
              value={viewMode} 
              onValueChange={(value) => value && setViewMode(value as "kanban" | "grid")}
              className="bg-gray-100 rounded-lg p-1"
            >
              <ToggleGroupItem value="kanban" className="flex items-center gap-2 px-3 py-2">
                <Kanban className="h-4 w-4" />
                Kanban
              </ToggleGroupItem>
              <ToggleGroupItem value="grid" className="flex items-center gap-2 px-3 py-2">
                <LayoutGrid className="h-4 w-4" />
                Grid
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className={`flex ${assessmentSplitViewOpen ? 'h-[calc(100vh-140px)]' : 'min-h-[calc(100vh-140px)]'} overflow-hidden relative`}>
        {/* Main Content */}
        <div className={`${assessmentSplitViewOpen ? 'w-full' : 'w-full'} ${viewMode === 'kanban' ? 'grid grid-cols-4 gap-4 p-4 h-full' : 'p-4 overflow-y-auto'}`}>
          {viewMode === 'kanban' ? (
            // Kanban View
            <>
          {/* New Applicants Column */}
          <div className="min-h-0">
            <div className="bg-white rounded-lg shadow-sm border h-full flex flex-col">
              <div className="p-3 border-b bg-blue-50">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm text-blue-900">New</h3>
                  <Badge className="bg-blue-100 text-blue-800 text-xs min-w-[24px] justify-center">
                    {candidatesByStatus.new_applicants.length}
                  </Badge>
                </div>
              </div>
              <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                {candidatesByStatus.new_applicants.map((candidate) => {
                  const subStatusDetails = getSubStatusDetails(candidate.subStatus);
                  return (
                    <Card key={candidate.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => openAssessmentSplitView(candidate)}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={candidate.profilePicture}
                              alt={candidate.name}
                              className="w-10 h-10 rounded-full border border-gray-200"
                            />
                            <div>
                              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                {candidate.name}
                                {(candidate.id === "21" || candidate.id === "25") && (
                                  <span className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-xs text-white font-bold">
                                    ✓
                                  </span>
                                )}
                              </h4>
                              <div className={`text-sm flex items-center font-medium ${
                                isScoreApproved(candidate) ? 'text-pink-600' : 'text-gray-500'
                              }`}>
                                <TrendingUp className="h-3 w-3 mr-1" />
                                {candidate.overallSkillsScore}% Score
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-3">
                          <div className="text-xs text-gray-500 flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Applied {new Date(candidate.applicationDate).toLocaleDateString('en-GB')}
                          </div>
                          <Badge className={subStatusDetails.color + " text-xs"}>
                            {subStatusDetails.label}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCTAAction(candidate);
                            }}
                            className="w-full bg-blue-600 hover:bg-blue-700"
                          >
                            {subStatusDetails.cta}
                          </Button>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setLocation(`/admin/candidate-profile/${candidate.id}`);
                              }}
                              className="flex-1 text-xs h-9"
                            >
                              <User className="h-3 w-3 mr-1" />
                              Profile
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                openAssessmentSplitView(candidate);
                              }}
                              className="flex-1 text-xs h-9"
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              Assessment
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setLocation(`/admin/candidate-message/${candidate.id}`);
                              }}
                              className="flex-1 text-xs h-9"
                            >
                              <MessageCircle className="h-3 w-3 mr-1" />
                              Message
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>

          {/* In Progress Column */}
          <div className="min-h-0">
            <div className="bg-white rounded-lg shadow-sm border h-full flex flex-col">
              <div className="p-3 border-b bg-yellow-50">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm text-yellow-900">In Progress</h3>
                  <Badge className="bg-yellow-600 text-white text-xs min-w-[24px] justify-center">
                    {candidatesByStatus.in_progress.length}
                  </Badge>
                </div>
              </div>
              <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                {candidatesByStatus.in_progress.map((candidate) => {
                  const subStatusDetails = getSubStatusDetails(candidate.subStatus);
                  return (
                    <Card key={candidate.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => openAssessmentSplitView(candidate)}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={candidate.profilePicture}
                              alt={candidate.name}
                              className="w-10 h-10 rounded-full border border-gray-200"
                            />
                            <div>
                              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                {candidate.name}
                                {(candidate.id === "21" || candidate.id === "25") && (
                                  <span className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-xs text-white font-bold">
                                    ✓
                                  </span>
                                )}
                              </h4>
                              <div className={`text-sm flex items-center font-medium ${
                                isScoreApproved(candidate) ? 'text-pink-600' : 'text-gray-500'
                              }`}>
                                <TrendingUp className="h-3 w-3 mr-1" />
                                {candidate.overallSkillsScore}% Score
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-3">
                          <div className="text-xs text-gray-500 flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Applied {new Date(candidate.applicationDate).toLocaleDateString('en-GB')}
                          </div>
                          <Badge className={subStatusDetails.color + " text-xs"}>
                            {subStatusDetails.label}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCTAAction(candidate);
                            }}
                            className="w-full bg-yellow-600 hover:bg-yellow-700"
                          >
                            {subStatusDetails.cta}
                          </Button>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setLocation(`/admin/candidate-profile/${candidate.id}`);
                              }}
                              className="flex-1 text-xs h-9"
                            >
                              <User className="h-3 w-3 mr-1" />
                              Profile
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                openAssessmentSplitView(candidate);
                              }}
                              className="flex-1 text-xs h-9"
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              Assessment
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setLocation(`/admin/candidate-message/${candidate.id}`);
                              }}
                              className="flex-1 text-xs h-9"
                            >
                              <MessageCircle className="h-3 w-3 mr-1" />
                              Message
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Matched to Employer Column */}
          <div className="min-h-0">
            <div className="bg-white rounded-lg shadow-sm border h-full flex flex-col">
              <div className="p-3 border-b bg-green-50">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm text-green-900">Matched to Employer</h3>
                  <Badge className="bg-green-100 text-green-800 text-xs min-w-[24px] justify-center">
                    {candidatesByStatus.matched_to_employer.length}
                  </Badge>
                </div>
              </div>
              <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                {candidatesByStatus.matched_to_employer.map((candidate) => {
                  const subStatusDetails = getSubStatusDetails(candidate.subStatus);
                  return (
                    <Card key={candidate.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => openAssessmentSplitView(candidate)}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={candidate.profilePicture}
                              alt={candidate.name}
                              className="w-10 h-10 rounded-full border border-gray-200"
                            />
                            <div>
                              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                {candidate.name}
                                {(candidate.id === "21" || candidate.id === "25") && (
                                  <span className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-xs text-white font-bold">
                                    ✓
                                  </span>
                                )}
                              </h4>
                              <div className={`text-sm flex items-center font-medium ${
                                isScoreApproved(candidate) ? 'text-pink-600' : 'text-gray-500'
                              }`}>
                                <TrendingUp className="h-3 w-3 mr-1" />
                                {candidate.overallSkillsScore}% Score
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-3">
                          <div className="text-xs text-gray-500 flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Applied {new Date(candidate.applicationDate).toLocaleDateString('en-GB')}
                          </div>
                          <Badge className={subStatusDetails.color + " text-xs"}>
                            {subStatusDetails.label}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCTAAction(candidate);
                            }}
                            className="w-full bg-green-600 hover:bg-green-700"
                          >
                            {subStatusDetails.cta}
                          </Button>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setLocation(`/admin/candidate-profile/${candidate.id}`);
                              }}
                              className="flex-1 text-xs h-9"
                            >
                              <User className="h-3 w-3 mr-1" />
                              Profile
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                openAssessmentSplitView(candidate);
                              }}
                              className="flex-1 text-xs h-9"
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              Assessment
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setLocation(`/admin/candidate-message/${candidate.id}`);
                              }}
                              className="flex-1 text-xs h-9"
                            >
                              <MessageCircle className="h-3 w-3 mr-1" />
                              Message
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Complete Column */}
          <div className="min-h-0">
            <div className="bg-white rounded-lg shadow-sm border h-full flex flex-col">
              <div className="p-3 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm text-gray-900">Complete</h3>
                  <Badge className="bg-gray-100 text-gray-800 text-xs min-w-[24px] justify-center">
                    {candidatesByStatus.complete.length}
                  </Badge>
                </div>
              </div>
              <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                {candidatesByStatus.complete.map((candidate) => {
                  const subStatusDetails = getSubStatusDetails(candidate.subStatus);
                  return (
                    <Card key={candidate.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => openAssessmentSplitView(candidate)}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={candidate.profilePicture}
                              alt={candidate.name}
                              className="w-10 h-10 rounded-full border border-gray-200"
                            />
                            <div>
                              <h4 className="font-medium text-gray-900">{candidate.name}</h4>
                              <div className={`text-sm flex items-center font-medium ${
                                isScoreApproved(candidate) ? 'text-pink-600' : 'text-gray-500'
                              }`}>
                                <TrendingUp className="h-3 w-3 mr-1" />
                                {candidate.overallSkillsScore}% Score
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-3">
                          <div className="text-xs text-gray-500 flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Applied {new Date(candidate.applicationDate).toLocaleDateString('en-GB')}
                          </div>
                          <Badge className={subStatusDetails.color + " text-xs"}>
                            {subStatusDetails.label}
                          </Badge>
                          {candidate.completionStage && (
                            <Badge variant="outline" className="text-xs">
                              Stopped at: {candidate.completionStage.replace('_', ' ')}
                            </Badge>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCTAAction(candidate);
                            }}
                            className="w-full bg-gray-600 hover:bg-gray-700"
                          >
                            {subStatusDetails.cta}
                          </Button>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setLocation(`/admin/candidate-profile/${candidate.id}`);
                              }}
                              className="flex-1 text-xs h-9"
                            >
                              <User className="h-3 w-3 mr-1" />
                              Profile
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                openAssessmentSplitView(candidate);
                              }}
                              className="flex-1 text-xs h-9"
                            >
                              <FileText className="h-3 w-3 mr-1" />
                              Assessment
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                setLocation(`/admin/candidate-message/${candidate.id}`);
                              }}
                              className="flex-1 text-xs h-9"
                            >
                              <MessageCircle className="h-3 w-3 mr-1" />
                              Message
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
            </>
          ) : (
            // Table Grid View
            <div className="bg-white rounded-lg border shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-3 font-semibold text-gray-900">Candidate</th>
                      <th className="text-left p-3 font-semibold text-gray-900">Score</th>
                      <th className="text-left p-3 font-semibold text-gray-900">Primary Status</th>
                      <th className="text-left p-3 font-semibold text-gray-900">Applied</th>
                      <th className="text-left p-3 font-semibold text-gray-900">Sub Status</th>
                      <th className="text-left p-3 font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCandidates.map((candidate) => {
                      const subStatusDetails = getSubStatusDetails(candidate.subStatus);
                      return (
                        <tr 
                          key={candidate.id} 
                          className={`border-b ${getRowColorByStatus(candidate.status)} hover:bg-gray-50 cursor-pointer transition-colors`}
                          onClick={() => openAssessmentSplitView(candidate)}
                        >
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <img 
                                src={candidate.profilePicture}
                                alt={candidate.name}
                                className="w-8 h-8 rounded-full border"
                              />
                              <div>
                                <div className="font-medium text-gray-900 flex items-center gap-2">
                                  {candidate.name}
                                  {(candidate.id === "21" || candidate.id === "25") && (
                                    <span className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-xs text-white font-bold">
                                      ✓
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-gray-500">{candidate.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className={`font-bold ${
                              isScoreApproved(candidate) ? 'text-pink-600' : 'text-gray-500'
                            }`}>{candidate.overallSkillsScore}%</span>
                          </td>
                          <td className="p-3">
                            <Badge className={`text-xs min-w-[80px] justify-center ${
                              candidate.status === 'new_applicants' ? 'bg-blue-600 text-white' :
                              candidate.status === 'in_progress' ? 'bg-yellow-600 text-white' :
                              candidate.status === 'matched_to_employer' ? 'bg-green-600 text-white' :
                              'bg-gray-600 text-white'
                            }`}>
                              {getStatusLabel(candidate.status)}
                            </Badge>
                          </td>
                          <td className="p-3 text-sm text-gray-600">
                            {new Date(candidate.applicationDate).toLocaleDateString('en-GB')}
                          </td>
                          <td className="p-3">
                            <div className="flex justify-start">
                              <Badge className={`${subStatusDetails.color} text-xs min-w-[100px] justify-start`}>
                                {subStatusDetails.label}
                              </Badge>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCTAAction(candidate);
                                }}
                                className={`${getCTAColorByStatus(candidate.status)} text-xs px-2 py-1`}
                              >
                                {subStatusDetails.cta}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openAssessmentSplitView(candidate);
                                }}
                                className="text-xs px-2 py-1"
                              >
                                <FileText className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setLocation(`/admin/candidate-profile/${candidate.id}`);
                                }}
                                className="text-xs px-2 py-1"
                              >
                                <User className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setLocation(`/admin/candidate-message/${candidate.id}`);
                                }}
                                className="text-xs px-2 py-1"
                              >
                                <MessageCircle className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}




                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Full-page assessment view */}
        {isMobileFullPage && selectedAssessment && (
          <div className="fixed inset-0 bg-white z-50">
            <div className="h-full flex flex-col">
              {/* Full page header with navigation */}
              <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closeAssessmentSplitView}
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    <span className="text-sm">Back</span>
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">{selectedAssessment.name}</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setLocation(`/admin/candidate-profile/${selectedAssessment.id}`)}
                      className="text-xs px-2 py-1"
                    >
                      <User className="h-3 w-3 mr-1" />
                      Profile
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateToCandidate('prev')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-600">
                    {getCurrentCandidatePosition().current} of {getCurrentCandidatePosition().total}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateToCandidate('next')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsMobileFullPage(false);
                      setAssessmentSplitViewOpen(true);
                    }}
                    className="hidden sm:flex ml-2"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    <span className="text-xs">Split View</span>
                  </Button>
                </div>
              </div>
              
              {/* Candidate header */}
              <div className="p-4 border-b bg-gray-50">
                <div className="flex items-center gap-3">
                  <img 
                    src={selectedAssessment.profilePicture}
                    alt={selectedAssessment.name}
                    className="w-10 h-10 rounded-full border"
                  />
                  <div>
                    <h3 className="font-semibold">{selectedAssessment.name} - Assessment</h3>
                    <p className="text-sm text-gray-600">
                      Marketing Assistant • Submitted {selectedAssessment.assessmentSubmission ? new Date(selectedAssessment.assessmentSubmission.submittedAt).toLocaleDateString('en-GB') : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Mobile Candidate History */}
              <div className="bg-blue-50 border-b border-blue-100">
                <div className="p-4">
                  <CandidateHistorySnapshot candidateId={selectedAssessment.id} />
                </div>
              </div>
              
              {/* Mobile assessment content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {renderAssessmentContent()}
              </div>
            </div>
          </div>
        )}

        {/* Desktop split-screen assessment view - Overlay right 2/3 of kanban */}
        {assessmentSplitViewOpen && selectedAssessment && (
          <div className="absolute top-0 right-0 w-2/3 h-full bg-white border-l flex flex-col hidden md:flex z-10">
            <div className="p-4 border-b bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img 
                    src={selectedAssessment.profilePicture}
                    alt={selectedAssessment.name}
                    className="w-10 h-10 rounded-full border"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{selectedAssessment.name} - Assessment</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLocation(`/admin/candidate-profile/${selectedAssessment.id}`)}
                        className="text-xs px-2 py-1"
                      >
                        <User className="h-3 w-3 mr-1" />
                        Profile
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600">
                      Marketing Assistant • Submitted {selectedAssessment.assessmentSubmission ? new Date(selectedAssessment.assessmentSubmission.submittedAt).toLocaleDateString('en-GB') : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Desktop navigation */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateToCandidate('prev')}
                      className="p-1 h-8 w-8"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-xs text-gray-600 px-2">
                      {getCurrentCandidatePosition().current} of {getCurrentCandidatePosition().total}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigateToCandidate('next')}
                      className="p-1 h-8 w-8"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Full-page toggle */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setAssessmentSplitViewOpen(false);
                      setIsMobileFullPage(true);
                    }}
                    className="text-xs px-2 py-1"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Full Page
                  </Button>

                  {/* Close button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closeAssessmentSplitView}
                    className="p-0 h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Candidate Background - Simplified */}
            <div className="border-b border-gray-100 px-4 py-2">
              <div className="text-sm text-gray-600 flex items-center justify-between">
                {/* Yellow tick candidates - show Pollen team contact info */}
                {(selectedAssessment.id === "21" || selectedAssessment.id === "25") ? (
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-xs text-white font-bold">✓</span>
                    <span className="text-sm">
                      {selectedAssessment.id === "21" ? "Spoke to Karen Whitelaw on 15th Oct 2024" : "Spoke to Holly Saunders on 22nd Oct 2024"}
                    </span>
                  </div>
                ) : (
                  /* No yellow tick - show application count */
                  <span className="text-sm">
                    {selectedAssessment.id === "22" ? "0 previous applications" : 
                     selectedAssessment.id === "24" ? "0 previous applications" :
                     "0 previous applications"}
                  </span>
                )}
                <button 
                  onClick={() => setLocation(`/admin/candidate-action-timeline/${selectedAssessment.id}`)}
                  className="text-xs text-gray-500 hover:text-gray-700 underline"
                >
                  View history
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {renderAssessmentContent()}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700">
              {pendingAction === 'interview' && (canFastTrackToEmployer ? 
                "Are you sure you want to re-interview this candidate with the Pollen team?" : 
                "Are you sure you want to invite this candidate to a Pollen interview?")}
              {pendingAction === 'match' && (canFastTrackToEmployer ? 
                "Are you sure you want to fast-track this candidate directly to an employer (they have previous Pollen interview experience)?" :
                "Are you sure you want to match this candidate to an employer?")}
              {pendingAction === 'reject' && "Are you sure you want to mark this candidate as not progressing?"}
            </p>
            {pendingAction === 'match' && canFastTrackToEmployer && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-800 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Fast-Track Eligible:</span>
                </div>
                <p className="text-green-700 text-sm mt-1">
                  This candidate has previously interviewed with the Pollen team and can bypass the standard interview requirement.
                </p>
              </div>
            )}
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
