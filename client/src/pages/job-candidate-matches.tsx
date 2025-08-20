import React, { useState, useEffect } from "react";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DiscRadarChart } from "@/components/disc-radar-chart";
import InterviewManagement from "@/components/interview-management";
import { 
  ArrowLeft, ArrowRight, Users, Star, MessageSquare, Calendar, 
  FileText, CheckCircle, XCircle, UserCheck, Clock,
  Mail, Phone, Target, Heart, Award, TrendingUp, Brain, Radar, Video, Lightbulb, Trophy, HelpCircle,
  Grid3x3, List, Eye, ChevronLeft, ChevronRight, X, AlertCircle, BarChart3, ChevronUp, ChevronDown, FileSpreadsheet, Plus
} from "lucide-react";

// Score labeling functions for consistent display
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

// Comprehensive workflow system for candidate status management
const getCandidateWorkflowInfo = (candidate: CandidateMatch) => {
  const { status } = candidate;
  
  switch (status) {
    case 'new':
      return {
        statusBadge: { text: 'New', variant: 'success' as const },
        actionMessage: { 
          text: 'review candidate profile', 
          icon: Eye,
          variant: 'employer_action' as const,
          actionOwner: 'employer' as const
        },
        primaryCTA: { 
          text: 'Schedule Interview', 
          icon: Calendar, 
          action: 'schedule_interview',
          variant: 'employer_action' as const,
          actionOwner: 'employer' as const
        },
        secondaryActions: [
          { text: 'Export Profile', icon: FileSpreadsheet, action: 'download_pdf', actionOwner: 'employer' as const }
        ]
      };
      
    case 'interview_scheduled':
      return {
        statusBadge: { text: 'In Progress', variant: 'default' as const },
        actionMessage: { 
          text: 'your interview is booked in', 
          icon: Calendar,
          variant: 'candidate_action' as const,
          actionOwner: 'candidate' as const
        },
        primaryCTA: { 
          text: 'View Interview Details', 
          icon: Calendar, 
          action: 'view_schedule',
          variant: 'default' as const,
          actionOwner: 'employer' as const
        },
        secondaryActions: [
          { text: 'Add to Calendar', icon: Calendar, action: 'add_to_calendar', actionOwner: 'employer' as const },
          { text: 'Export Profile', icon: FileSpreadsheet, action: 'download_pdf', actionOwner: 'employer' as const }
        ]
      };
      
    case 'interview_complete':
      return {
        statusBadge: { text: 'In Progress', variant: 'default' as const },
        actionMessage: { 
          text: 'your interview is complete', 
          icon: CheckCircle,
          variant: 'employer_action' as const,
          actionOwner: 'employer' as const
        },
        primaryCTA: { 
          text: 'Provide Update', 
          icon: MessageSquare, 
          action: 'provide_feedback',
          variant: 'employer_action' as const,
          actionOwner: 'employer' as const
        },
        secondaryActions: [
          { text: 'Export Profile', icon: FileSpreadsheet, action: 'download_pdf', actionOwner: 'employer' as const }
        ]
      };
      
    case 'reviewing':
    case 'in_progress':
      return {
        statusBadge: { text: 'In Progress', variant: 'default' as const },
        actionMessage: { 
          text: "you're up to date, awaiting candidate for update", 
          icon: Clock,
          variant: 'candidate_action' as const,
          actionOwner: 'candidate' as const
        },
        primaryCTA: { 
          text: 'Awaiting Candidate', 
          icon: Clock, 
          action: 'view_status',
          variant: 'outline' as const,
          actionOwner: 'employer' as const
        },
        secondaryActions: [
          { text: 'Send Message', icon: MessageSquare, action: 'send_message', actionOwner: 'employer' as const },
          { text: 'Export Profile', icon: FileSpreadsheet, action: 'download_pdf', actionOwner: 'employer' as const }
        ]
      };
      
    case 'offered':
    case 'complete':
      return {
        statusBadge: { text: 'Complete', variant: 'secondary' as const },
        actionMessage: { 
          text: 'thanks for providing feedback', 
          icon: CheckCircle,
          variant: 'employer_action' as const,
          actionOwner: 'employer' as const
        },
        primaryCTA: { 
          text: 'View Details', 
          icon: Eye, 
          action: 'view_details',
          variant: 'outline' as const,
          actionOwner: 'employer' as const
        },
        secondaryActions: [
          { text: 'Export Profile', icon: FileSpreadsheet, action: 'download_pdf', actionOwner: 'employer' as const }
        ]
      };
      
    case 'hired':
      return {
        statusBadge: { text: 'Hired', variant: 'hired' as const },
        actionMessage: { 
          text: 'you found your match!', 
          icon: Trophy,
          variant: 'employer_action' as const,
          actionOwner: 'employer' as const
        },
        primaryCTA: { 
          text: 'View Details', 
          icon: Eye, 
          action: 'view_details',
          variant: 'outline' as const,
          actionOwner: 'employer' as const
        },
        secondaryActions: [
          { text: 'Export Profile', icon: FileSpreadsheet, action: 'download_pdf', actionOwner: 'employer' as const }
        ]
      };
      
    default:
      return {
        statusBadge: { text: 'New', variant: 'success' as const },
        actionMessage: { 
          text: 'review candidate profile', 
          icon: Eye,
          variant: 'employer_action' as const,
          actionOwner: 'employer' as const
        },
        primaryCTA: { 
          text: 'Schedule Interview', 
          icon: Calendar, 
          action: 'schedule_interview',
          variant: 'employer_action' as const,
          actionOwner: 'employer' as const
        },
        secondaryActions: [
          { text: 'Export Profile', icon: FileSpreadsheet, action: 'download_pdf', actionOwner: 'employer' as const }
        ]
      };
  }
};

// Handle CTA actions
const handleCTAAction = async (action: string, candidateId: number, setLocation: any, setActiveTab?: (tab: string) => void) => {
  switch (action) {
    case 'review_profile':
      // Already viewing profile, no navigation needed
      break;
    case 'schedule_interview':
      setLocation(`/interview-schedule/${candidateId}`);
      break;
    case 'view_schedule':
      setLocation(`/interview-schedule/${candidateId}`);
      break;
    case 'add_to_calendar':
      // For now, redirect to interview schedule page where calendar options are available
      setLocation(`/interview-schedule/${candidateId}`);
      break;
    case 'provide_feedback':
      // Navigate directly to candidate management tab for table view
      if (window.location.pathname.includes('job-candidate-matches')) {
        // Already on the job-candidate-matches page, just select candidate and open interview management tab
        const jobId = window.location.pathname.split('/').pop();
        setLocation(`/job-candidate-matches/${jobId}?candidate=${candidateId}&tab=interview-management`);
      } else {
        // Navigate to feedback tab from other pages
        setLocation(`/job-candidate-matches/job-001?candidate=${candidateId}&tab=interview-management`);
      }
      break;
    case 'schedule_followup':
      setLocation(`/interview-schedule/${candidateId}`);
      break;
    case 'check_status':
      console.log('Check status for candidate', candidateId);
      break;
    case 'start_onboarding':
      console.log('Start onboarding for candidate', candidateId);
      break;
    case 'view_feedback':
      setLocation(`/job-candidate-matches/${candidateId}?tab=interview-management`);
      break;
    case 'send_message':
      // Route to specific candidate conversation based on candidate ID mapping
      const candidateMessageMapping: Record<number, string> = {
        20: '1', // Sarah Chen -> TechFlow Solutions Marketing Assistant conversation
        21: '2', // James Mitchell -> conversation ID 2
        22: '3', // Emma Thompson -> conversation ID 3
        23: '4', // Priya Singh -> conversation ID 4
        24: '5', // Michael Roberts -> conversation ID 5
        25: '6'  // Alex Johnson -> conversation ID 6
      };
      const conversationId = candidateMessageMapping[candidateId] || '1';
      setLocation(`/employer-messages?conversation=${conversationId}`);
      break;
    case 'download_pdf':
      // This action is now handled directly in the component buttons
      console.log('PDF download action triggered for candidate', candidateId);
      break;
    case 'provide_update':
      // Navigate to candidate management tab directly
      if (setActiveTab) {
        setActiveTab('candidate-management');
      }
      break;
    default:
      console.log('Unknown action:', action);
  }
};

// Helper function to generate standardized behavioral descriptors based on DISC profile
const generateStandardizedBehavioralDescriptor = (discProfile: any, personalityType: string, candidateData?: any) => {
  // Generate standardized behavioral summary based on personality type and DISC profile
  // Uses candidate's name and pronouns while keeping standardized behavioral content
  
  const candidateName = candidateData?.name?.split(' ')[0] || "They";
  const pronouns = candidateData?.pronouns || "they/them";
  const theirPronoun = pronouns.includes("she") ? "Her" : pronouns.includes("he") ? "His" : "Their";
  const theirPronounLower = theirPronoun.toLowerCase();
  const themPronoun = pronouns.includes("she") ? "her" : pronouns.includes("he") ? "him" : "them";
  
  if (!discProfile) return `${candidateName} brings a well-rounded approach to work, adapting ${theirPronounLower} style to suit different situations while maintaining consistent quality and collaboration.`;
  
  const { red, yellow, green, blue } = discProfile;
  const highest = Math.max(red, yellow, green, blue);
  
  // Standardized descriptors based on dominant DISC type
  if (highest === red && red > 35) {
    return `${candidateName} brings a results-driven and decisive approach to work, preferring clear objectives and direct action to achieve goals efficiently. Excels in fast-paced environments that value quick decision-making and goal achievement. ${theirPronoun} direct communication style makes ${themPronoun} particularly effective at driving projects forward and maintaining momentum.`;
  } else if (highest === yellow && yellow > 35) {
    return `${candidateName} brings natural collaborative energy and enthusiasm to work, thriving in team environments where communication and relationships are valued. ${candidateName} excels in roles that involve building connections, motivating others, and creating positive team dynamics. ${theirPronoun} engaging communication style makes ${themPronoun} particularly effective at facilitating collaboration and maintaining team morale.`;
  } else if (highest === green && green > 35) {
    return `${candidateName} brings a steady and supportive approach to work, preferring collaborative environments and consistent, reliable processes. Excels in environments that value team harmony, stability, and supportive relationships. ${theirPronoun} patient and dependable nature makes ${themPronoun} particularly effective at building consensus, supporting team members, and maintaining collaborative workflows.`;
  } else if (highest === blue && blue > 35) {
    return `${candidateName} brings precision and attention to detail in ${theirPronounLower} work approach, preferring structured processes and quality-focused outcomes. Excels in environments that value accuracy, compliance, and systematic approaches. ${theirPronoun} methodical thinking style makes ${themPronoun} particularly effective at ensuring quality standards and maintaining organizational processes.`;
  } else {
    // Balanced profile
    return `${candidateName} brings a well-rounded approach to work, adapting ${theirPronounLower} style to suit different situations while maintaining consistent quality and collaboration. Excels in diverse environments by flexibly adjusting ${theirPronounLower} approach based on team needs and project requirements. ${theirPronoun} adaptable nature makes ${themPronoun} particularly effective at bridging different working styles and maintaining team harmony.`;
  }
};

// Function to get dynamic behavioral emoji based on personality type
const getBehavioralEmoji = (candidate: any) => {
  const behavioralType = candidate.behavioralType || candidate.behavioralProfile?.type;
  
  if (behavioralType?.includes('Strategic Ninja')) return '🥷';
  if (behavioralType?.includes('Methodical Achiever')) return '📊';
  if (behavioralType?.includes('Social Butterfly')) return '🦋';
  if (behavioralType?.includes('Creative Catalyst')) return '✨';
  if (behavioralType?.includes('Reliable Foundation')) return '🏗️';
  if (behavioralType?.includes('Analytical')) return '🔍';
  
  // Fallback to DISC-based emojis
  if (candidate.behavioralProfile?.discPercentages) {
    const { red, yellow, green, blue } = candidate.behavioralProfile.discPercentages;
    const highest = Math.max(red, yellow, green, blue);
    
    if (highest === red) return '🎯';
    if (highest === yellow) return '🌟';
    if (highest === green) return '🤝';
    if (highest === blue) return '🔍';
  }
  
  return '🧠';
};

// Function to get dynamic work style titles based on DISC profile
const getWorkStyleTitle = (candidate: any, type: 'communication' | 'decision') => {
  const discProfile = candidate.behavioralProfile?.discPercentages;
  const personalityType = candidate.behavioralProfile?.personalityType || candidate.behavioralType;
  
  if (!discProfile) return 'Balanced approach';
  
  const { red, yellow, green, blue } = discProfile;
  const highest = Math.max(red, yellow, green, blue);
  
  if (type === 'communication') {
    if (highest === yellow && yellow > 35) return 'Warm and engaging';
    if (highest === green && green > 35) return 'Supportive and collaborative';
    if (highest === red && red > 35) return 'Direct and results-focused';
    if (highest === blue && blue > 35) return 'Thoughtful and precise';
    return 'Balanced and adaptable';
  } else { // decision
    if (highest === yellow && yellow > 35) return 'Collaborative and people-focused';
    if (highest === green && green > 35) return 'Consensus-building and steady';
    if (highest === red && red > 35) return 'Quick and decisive';
    if (highest === blue && blue > 35) return 'Analytical and systematic';
    return 'Flexible and context-dependent';
  }
};

// Function to get dynamic work style descriptions based on DISC profile and candidate name
const getWorkStyleDescription = (candidate: any, type: 'communication' | 'decision') => {
  const candidateName = candidate.name?.split(' ')[0] || 'This candidate';
  const discProfile = candidate.behavioralProfile?.discPercentages;
  
  if (!discProfile) {
    return type === 'communication' 
      ? `${candidateName} adapts their communication style to different situations and team members.`
      : `${candidateName} considers multiple factors when making decisions and adjusts their approach as needed.`;
  }
  
  const { red, yellow, green, blue } = discProfile;
  const highest = Math.max(red, yellow, green, blue);
  
  if (type === 'communication') {
    if (highest === yellow && yellow > 35) {
      return `${candidateName} naturally creates inclusive conversations where everyone feels heard. They excel at building rapport with colleagues and translating ideas between different team members to keep projects moving forward.`;
    }
    if (highest === green && green > 35) {
      return `${candidateName} creates a supportive communication environment where team members feel comfortable sharing ideas. They listen carefully and provide thoughtful responses that help build consensus and team harmony.`;
    }
    if (highest === red && red > 35) {
      return `${candidateName} communicates with clarity and purpose, focusing on outcomes and next steps. They're skilled at cutting through complexity to identify key priorities and rally teams around clear objectives.`;
    }
    if (highest === blue && blue > 35) {
      return `${candidateName} provides well-researched, detailed communication that helps teams understand complex information. They ask thoughtful questions and ensure accuracy in all exchanges.`;
    }
    return `${candidateName} adapts their communication style effectively to different situations and audiences, ensuring clear understanding across diverse team dynamics.`;
  } else { // decision
    if (highest === yellow && yellow > 35) {
      return `${candidateName} likes to gather input from team members and considers how decisions will impact different people. They balance creative possibilities with practical considerations, often finding solutions that work well for everyone involved.`;
    }
    if (highest === green && green > 35) {
      return `${candidateName} takes time to build consensus and ensure everyone is comfortable with decisions. They prefer steady, well-considered choices that maintain team stability and support long-term success.`;
    }
    if (highest === red && red > 35) {
      return `${candidateName} makes decisions quickly and confidently, focusing on results and efficiency. They're comfortable taking calculated risks and moving forward with clear action plans.`;
    }
    if (highest === blue && blue > 35) {
      return `${candidateName} takes a systematic approach to decision-making, carefully analyzing data and considering all relevant factors. They prefer well-researched choices backed by solid evidence and clear reasoning.`;
    }
    return `${candidateName} adapts their decision-making approach based on the situation, balancing speed with thoroughness and individual needs with team requirements.`;
  }
};

// Function to get dynamic career motivators based on DISC profile
const getCareerMotivators = (candidate: any) => {
  const discProfile = candidate.behavioralProfile?.discPercentages;
  
  if (!discProfile) {
    return [
      'Making meaningful contributions to team success',
      'Continuous learning and professional development',
      'Working in collaborative environments',
      'Building positive relationships with colleagues'
    ];
  }
  
  const { red, yellow, green, blue } = discProfile;
  const highest = Math.max(red, yellow, green, blue);
  
  if (highest === yellow && yellow > 35) {
    return [
      'Making meaningful connections with colleagues and clients',
      'Creating work that positively impacts people and communities',
      'Learning from experienced team members and mentors',
      'Contributing to collaborative projects with visible results'
    ];
  }
  if (highest === green && green > 35) {
    return [
      'Contributing to team stability and long-term success',
      'Building supportive relationships in the workplace',
      'Working on projects that benefit others',
      'Maintaining consistent quality and reliability'
    ];
  }
  if (highest === red && red > 35) {
    return [
      'Taking on challenging projects with clear outcomes',
      'Leading initiatives and driving results',
      'Working in fast-paced, goal-oriented environments',
      'Making strategic decisions with measurable impact'
    ];
  }
  if (highest === blue && blue > 35) {
    return [
      'Working with accurate data and detailed information',
      'Solving complex problems through systematic analysis',
      'Maintaining high standards of quality and precision',
      'Contributing expertise to well-structured projects'
    ];
  }
  
  return [
    'Making meaningful contributions to team success',
    'Continuous learning and professional development',
    'Working in collaborative environments',
    'Building positive relationships with colleagues'
  ];
};

// Function to get dynamic work style strengths based on DISC profile
const getWorkStyleStrengths = (candidate: any) => {
  const discProfile = candidate.behavioralProfile?.discPercentages;
  
  if (!discProfile) {
    return [
      'Adaptable team environments with varied challenges',
      'Projects with clear objectives and collaborative support',
      'Roles that balance independence with team interaction',
      'Workplaces that value both innovation and stability'
    ];
  }
  
  const { red, yellow, green, blue } = discProfile;
  const highest = Math.max(red, yellow, green, blue);
  
  if (highest === yellow && yellow > 35) {
    return [
      'Collaborative team environments with regular interaction',
      'Projects that combine creativity with people-focused outcomes',
      'Roles where relationship-building is valued and encouraged',
      'Supportive workplaces with open communication and feedback'
    ];
  }
  if (highest === green && green > 35) {
    return [
      'Stable team environments with consistent processes',
      'Collaborative projects focused on long-term success',
      'Supportive workplaces that value reliability and teamwork',
      'Roles with clear expectations and regular feedback'
    ];
  }
  if (highest === red && red > 35) {
    return [
      'Goal-oriented environments with clear targets',
      'Projects with autonomy and decision-making authority',
      'Fast-paced roles with varied challenges and responsibilities',
      'Results-focused workplaces that reward achievement'
    ];
  }
  if (highest === blue && blue > 35) {
    return [
      'Structured environments with access to detailed information',
      'Projects requiring analytical thinking and precision',
      'Roles with clear procedures and quality standards',
      'Workplaces that value expertise and systematic approaches'
    ];
  }
  
  return [
    'Adaptable team environments with varied challenges',
    'Projects with clear objectives and collaborative support',
    'Roles that balance independence with team interaction',
    'Workplaces that value both innovation and stability'
  ];
};

interface CandidateMatch {
  id: number;
  name: string;
  profileImage?: string;
  matchScore: number;
  location: string;
  experience: string;
  skills: string[];
  status: 'new' | 'reviewing' | 'in_progress' | 'interview_scheduled' | 'interview_complete' | 'offered' | 'hired' | 'rejected' | 'complete';
  appliedDate: string;
  behavioralType: string;
  keyStrengths: string[];
  challengeScore?: number;
  availability: string;
  // Comprehensive profile information
  pronouns?: string;
  age?: number;
  education: {
    level: string;
    institution: string;
    course: string;
    graduationYear?: number;
    grade?: string;
  };
  workExperience: {
    title?: string;
    company?: string;
    duration?: string;
    description?: string;
  }[];
  behavioralProfile: {
    type: string;
    description: string;
    discPercentages: {
      red: number;
      yellow: number;
      green: number;
      blue: number;
    };
    workStyleSummary: string;
    idealEnvironment: string[];
    strengths: string[];
  };
  personalStory: {
    motivations: string[];
    perfectJob: string;
    friendDescriptions: string[];
    teacherDescriptions: string[];
    proudMoments: string[];
    frustrations: string[];
  };
  communityEngagement: {
    totalPoints: number;
    proactivityScore: number;
    workshopsAttended: number;
    membersHelped: number;
    currentStreak: number;
    communityTier: string;
    achievements: {
      title: string;
      points: number;
    }[];
  };
  careerInsights: {
    roleTypes: string[];
    industries: string[];
    learningGoals: string[];
  };
  teamObservations: {
    overallAssessment: string;
    keyHighlights: string[];
    recommendedNextSteps: string[];
  };
  // Assessment submission
  assessmentSubmission: {
    submittedAt: string;
    score: number;
    blendedScore: number;
    timeSpent: string;
    keyInsights: string[];
    demonstratedSkills: string[];
    submissionSummary: string;
  };
  // Pollen team summary
  pollenSummary: {
    overallAssessment: string;
    keyHighlights: string[];
    growthPotential: string;
    culturalFit: string;
    recommendedNextSteps: string[];
    matchReasoning: string;
  };
  // Detailed work style analysis
  detailedWorkStyle: {
    communicationStyle: {
      title: string;
      description: string;
      traits: string[];
    };
    decisionMakingStyle: {
      title: string;
      description: string;
      traits: string[];
    };
    careerMotivators: {
      title: string;
      traits: string[];
    };
    workStyleStrengths: {
      title: string;
      traits: string[];
    };
  };
  behavioralSummary: string;
  roleInterests: string[];
  industryInterests: string[];
  references?: {
    name: string;
    title: string;
    email: string;
    testimonial: string;
  }[];
  careerInterests?: string[];
  visaStatus?: string;
  joinDate?: string;
  reasonableAdjustments?: string;
  skillsAssessment?: {
    overallScore: number;
    assessments: { name: string; score: number; }[];
  };
}

export default function JobCandidateMatches() {
  const { jobId } = useParams();
  const [, setLocation] = useLocation();
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateMatch | null>(null);
  const [activeTab, setActiveTab] = useState('candidate-management');
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showDiscModal, setShowDiscModal] = useState(false);
  const [showInterviewManagement, setShowInterviewManagement] = useState(false);
  const [interviewCandidateId, setInterviewCandidateId] = useState<number | null>(null);
  const [showFullSubmission, setShowFullSubmission] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [pdfLoading, setPdfLoading] = useState<number | null>(null); // Track which candidate's PDF is being generated

  // Extract numeric job ID from URL params (handles formats like "job-001" or "1")
  const extractJobId = (jobIdParam: string | undefined): string => {
    if (!jobIdParam) return "1";
    
    // If it's in format "job-001", extract the number
    if (jobIdParam.startsWith('job-')) {
      return jobIdParam.replace('job-', '').replace(/^0+/, '') || "1";
    }
    
    // Otherwise return as is
    return jobIdParam;
  };
  
  const effectiveJobId = extractJobId(jobId);
  
  // Fetch database-backed candidates
  const { data: candidatesData, isLoading: candidatesLoading, error: candidatesError } = useQuery({
    queryKey: ['/api/job-candidates', effectiveJobId],
    queryFn: async () => {
      const response = await fetch(`/api/job-candidates/${effectiveJobId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch candidates');
      }
      return response.json();
    },
    enabled: !!effectiveJobId
  });

  // Check for candidate query parameter for auto-selection from applicants page
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const candidateParam = urlParams.get('candidate');
    if (candidateParam && candidatesData) {
      const candidateId = parseInt(candidateParam);
      const candidate = (candidatesData as CandidateMatch[]).find(c => c.id === candidateId);
      if (candidate) {
        setSelectedCandidate(candidate);
        setActiveTab('candidate-management'); // Set to default tab
      }
    }
  }, [candidatesData]);

  // Navigation functions for candidate browsing
  const navigateToCandidate = (direction: 'prev' | 'next') => {
    if (!selectedCandidate) return;
    
    const candidates = (candidatesData as CandidateMatch[]) || [];
    const currentIndex = candidates.findIndex((c: any) => c.id === selectedCandidate.id);
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : candidates.length - 1;
    } else {
      newIndex = currentIndex < candidates.length - 1 ? currentIndex + 1 : 0;
    }
    
    setSelectedCandidate(candidates[newIndex]);
    setActiveTab('pollen-insights'); // Reset to pollen-insights tab when switching candidates
  };

  const getCurrentCandidateIndex = () => {
    if (!selectedCandidate) return { current: 0, total: 0 };
    const candidates = (candidatesData as CandidateMatch[]) || [];
    const currentIndex = candidates.findIndex(c => c.id === selectedCandidate.id);
    return { current: currentIndex + 1, total: candidates.length };
  };
  const [interviewForm, setInterviewForm] = useState({
    selectedSlots: [] as string[],
    additionalNotes: '',
    interviewType: 'video' as 'video' | 'phone' | 'in-person'
  });
  const [messageForm, setMessageForm] = useState({
    subject: '',
    message: ''
  });

  // Track which profiles have been viewed
  const [viewedProfiles, setViewedProfiles] = useState<Set<number>>(new Set());

  // Track candidate statuses and action states
  const [candidateActionStates, setCandidateActionStates] = useState<Record<number, {
    profileViewed: boolean;
    awaitingEmployerAction: boolean;
    lastActionTaken?: string;
    nextActionNeeded?: string;
  }>>({
    1: { profileViewed: false, awaitingEmployerAction: true, nextActionNeeded: 'review_profile' }, // Sarah Chen - New, needs profile review
    2: { profileViewed: true, awaitingEmployerAction: true, nextActionNeeded: 'schedule_interview' }, // James Mitchell - Under review, ready for interview
    3: { profileViewed: false, awaitingEmployerAction: true, nextActionNeeded: 'review_profile' }, // Emma Thompson - New, needs profile review 
    4: { profileViewed: true, awaitingEmployerAction: true, nextActionNeeded: 'make_decision' }, // Michael Roberts - Interviewed, needs hiring decision
    5: { profileViewed: true, awaitingEmployerAction: false, lastActionTaken: 'interview_scheduled' }, // Alex Johnson - Waiting for candidate to confirm interview
    6: { profileViewed: true, awaitingEmployerAction: false, lastActionTaken: 'interview_scheduled' } // Priya Singh - Interview scheduled, waiting for interview
  });

  // PDF download handler
  const handlePDFDownload = async (candidateId: number) => {
    console.log(`Starting PDF download for candidate ${candidateId}`);
    setPdfLoading(candidateId);
    try {
      const candidate = candidatesData?.find((c: any) => c.id === candidateId);
      console.log(`Found candidate:`, candidate?.name || 'Not found');
      
      console.log(`Fetching PDF from: /api/generate-employer-pdf/${candidateId}`);
      const response = await fetch(`/api/generate-employer-pdf/${candidateId}`);
      console.log(`Response status: ${response.status}, ok: ${response.ok}`);
      
      if (response.ok) {
        console.log('Response OK, creating blob...');
        const blob = await response.blob();
        console.log(`Blob created, size: ${blob.size} bytes`);
        
        const url = window.URL.createObjectURL(blob);
        console.log(`Object URL created: ${url.substring(0, 50)}...`);
        
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${candidate?.name.replace(/\s+/g, '_')}_Profile.pdf` || `Candidate_${candidateId}_Profile.pdf`;
        console.log(`Download filename: ${a.download}`);
        
        document.body.appendChild(a);
        console.log('Link added to DOM, triggering click...');
        a.click();
        console.log('Click triggered');
        
        // Clean up
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          console.log('Cleanup completed');
        }, 100);
        
        console.log(`Download initiated for ${candidate?.name}'s profile`);
      } else {
        const errorText = await response.text();
        console.error('Failed to generate PDF:', response.status, response.statusText, errorText);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setPdfLoading(null);
      console.log('PDF loading state cleared');
    }
  };

  // Fallback mock data for candidate matches (only used if database fetch fails)
  const mockCandidates: CandidateMatch[] = [
    {
      id: 1,
      name: "Sarah Chen",
      pronouns: "she/her",
      age: 22,
      matchScore: 92,
      location: "London, UK",
      experience: "Recent Graduate",
      skills: ["Digital Marketing", "Social Media", "Content Creation", "Analytics"],
      status: "new",
      appliedDate: "2025-01-22",
      behavioralType: "The Social Butterfly",
      keyStrengths: [
        "Strong collaborative approach with natural team leadership abilities",
        "Excellent communication skills with stakeholder management experience", 
        "Methodical analytical thinking combined with creative problem-solving",
        "High emotional intelligence and cultural sensitivity"
      ],
      challengeScore: 87,
      availability: "Available immediately",
      education: {
        level: "Bachelor's Degree",
        institution: "University of London",
        course: "Marketing and Communications",
        graduationYear: 2024,
        grade: "2:1"
      },
      workExperience: [
        {
          title: "Marketing Intern",
          company: "StartupLab",
          duration: "3 months",
          description: "Managed social media campaigns and created content for 5 startup clients"
        }
      ],
      behavioralProfile: {
        type: "The Social Butterfly",
        description: "A natural team player who excels at bringing people together and ensuring everyone feels heard and valued",
        discPercentages: { red: 15, yellow: 45, green: 30, blue: 10 },
        workStyleSummary: "Thrives in collaborative environments where relationships and team harmony are valued",
        idealEnvironment: ["Team-focused workplace", "Regular feedback and support", "Collaborative decision-making"],
        strengths: ["Building relationships", "Creative communication", "Team coordination", "Adaptability"]
      },
      personalStory: {
        motivations: ["Making a positive impact", "Learning from experienced professionals", "Building meaningful connections"],
        perfectJob: "A role where I can combine creativity with strategy, working alongside passionate teammates to create campaigns that genuinely connect with people",
        friendDescriptions: ["Supportive", "Creative", "Good listener"],
        teacherDescriptions: ["Collaborative", "Thoughtful", "Reliable"],
        proudMoments: ["Led university marketing society campaign that increased membership by 40%", "Organised charity fundraiser raising £2,000"],
        frustrations: ["Repetitive tasks without clear purpose", "Working in isolation for long periods"]
      },
      communityEngagement: {
        totalPoints: 385,
        proactivityScore: 7.8,
        workshopsAttended: 3,
        membersHelped: 8,
        currentStreak: 12,
        communityTier: "Rising Star",
        achievements: [
          { title: "Workshop Regular", points: 60 },
          { title: "Community Helper", points: 40 },
          { title: "Profile Completer", points: 25 }
        ]
      },
      careerInsights: {
        roleTypes: ["Marketing Assistant", "Social Media Coordinator", "Content Creator"],
        industries: ["Technology", "Creative Services", "Startups"],
        learningGoals: [
          "Advanced digital marketing strategies",
          "Data analytics and measurement",
          "Creative campaign development"
        ]
      },
      teamObservations: {
        overallAssessment: "Sarah is warm, collaborative and naturally driven to connect with people. She's worked across customer service and social media management, always bringing enthusiasm and genuine care to her interactions. After completing her Marketing degree, she's now looking for a role that blends creativity with meaningful relationship-building. Sarah thrives in team environments and is particularly drawn to organisations with strong values. Outside of work, she's passionate about community volunteering, loves photography and creative writing, and is currently learning Spanish. She's excited about opportunities to grow whilst making a real difference.",
        keyHighlights: [
          "Natural collaborative instincts with strong team-focused mindset",
          "Excellent strategic thinking evidenced in assessment responses",
          "Strong communication skills both written and interpersonal",
          "Genuine enthusiasm for learning and professional development",
          "Good balance of creative and analytical thinking"
        ],
        recommendedNextSteps: [
          "Conduct initial screening interview to assess cultural fit and motivation",
          "Arrange practical exercise or portfolio review to evaluate creative capabilities",
          "Schedule team introduction to assess collaborative chemistry",
          "Discuss growth trajectory and learning opportunities"
        ]
      },
      assessmentSubmission: {
        submittedAt: "2025-01-22T14:30:00Z",
        score: 87,
        blendedScore: 85,
        timeSpent: "45 minutes",
        keyInsights: [
          "Demonstrated strong strategic thinking in campaign planning exercise",
          "Excellent understanding of target audience segmentation",
          "Creative approach to content ideation with practical execution plans"
        ],
        demonstratedSkills: ["Strategic planning", "Creative thinking", "Data interpretation", "Written communication"],
        submissionSummary: "Sarah's assessment showed excellent strategic thinking combined with creative flair. Her campaign proposal was well-structured with clear objectives and innovative content ideas. She demonstrated strong understanding of marketing fundamentals while bringing fresh perspectives."
      },
      detailedWorkStyle: {
        communicationStyle: {
          title: "Precise and thoughtful",
          description: "Sarah prefers clear, respectful communication and takes time to listen carefully to team members before responding.",
          traits: ["Clear and articulate", "Active listener", "Thoughtful responses", "Team-focused communication"]
        },
        decisionMakingStyle: {
          title: "Research-based and systematic",
          description: "Sarah takes time to gather comprehensive information before making decisions, preferring thorough analysis to quick choices.",
          traits: ["Data-driven decisions", "Collaborative input", "Systematic evaluation", "Evidence-based choices"]
        },
        careerMotivators: {
          title: "Values accuracy and quality outcomes",
          traits: ["High-quality deliverables", "Continuous learning", "Team collaboration", "Making meaningful impact"]
        },
        workStyleStrengths: {
          title: "Independent work with clear objectives",
          traits: ["Self-directed projects", "Clear goal definition", "Quality-focused approach", "Collaborative teamwork"]
        }
      },
      behavioralSummary: "Sarah is warm, collaborative and naturally driven to connect with people. She's worked across customer service and social media management, always bringing enthusiasm and genuine care to her interactions. After completing her Marketing degree, she's now looking for a role that blends creativity with meaningful relationship-building. Sarah thrives in team environments and is particularly drawn to organisations with strong values. Outside of work, she's passionate about community volunteering, loves photography and creative writing, and is currently learning Spanish. She's excited about opportunities to grow whilst making a real difference.",
      roleInterests: ["Administration & Office Support", "Sales & Business Development"],
      industryInterests: ["Finance & Banking", "Technology & Software"],
      pollenSummary: {
        overallAssessment: "Highly promising candidate who combines strong marketing fundamentals with genuine enthusiasm and collaborative approach",
        keyHighlights: [
          "Exceptional cultural fit with collaborative work style",
          "Strong foundation in marketing principles with practical experience",
          "Demonstrates genuine passion for creative problem-solving",
          "Active community member showing commitment to professional development"
        ],
        growthPotential: "High - shows strong learning mindset and proactive engagement with professional development opportunities",
        culturalFit: "Excellent match for collaborative team environment. Her approach to relationship-building aligns perfectly with company values",
        recommendedNextSteps: [
          "Initial interview focusing on campaign strategy examples",
          "Portfolio review of previous marketing work",
          "Team interaction session to assess collaboration style"
        ],
        matchReasoning: "Sarah's combination of marketing knowledge, collaborative mindset, and genuine enthusiasm makes her an ideal fit for this entry-level position. Her behavioral profile suggests she'll thrive in the team-focused environment and contribute positively to company culture."
      },
      visaStatus: "Authorised to work in the UK without sponsorship",
      joinDate: "January 2024", 
      reasonableAdjustments: "No specific adjustments requested. Standard interview process appropriate."
    },
    {
      id: 2,
      name: "James Mitchell",
      pronouns: "he/him",
      age: 24,
      matchScore: 89,
      location: "Manchester, UK",
      experience: "6 months internship",
      skills: ["Marketing Strategy", "Data Analysis", "Project Management", "Communication"],
      status: "reviewing",
      appliedDate: "2025-01-21",
      behavioralType: "The Strategic Ninja",
      keyStrengths: [
        "Strategic analytical thinking with systematic problem-solving approach",
        "Strong data analysis capabilities with attention to detail", 
        "Structured project management with clear communication skills",
        "High learning agility and adaptability to new challenges"
      ],
      challengeScore: 91,
      availability: "2 weeks notice required",
      education: {
        level: "Bachelor's Degree",
        institution: "University of Manchester",
        course: "Business Management",
        graduationYear: 2024,
        grade: "First Class"
      },
      workExperience: [
        {
          title: "Data Analysis Intern",
          company: "TechStart Manchester",
          duration: "6 months",
          description: "Analysed customer data and created reports for senior management team"
        }
      ],
      behavioralProfile: {
        type: "The Strategic Ninja",
        description: "Analytical thinker who approaches challenges systematically and develops comprehensive solutions",
        discPercentages: { red: 25, yellow: 15, green: 20, blue: 40 },
        workStyleSummary: "Excels in structured environments with clear objectives and analytical challenges",
        idealEnvironment: ["Data-driven workplace", "Strategic planning opportunities", "Clear metrics and goals"],
        strengths: ["Strategic thinking", "Data analysis", "Problem-solving", "Process improvement"]
      },
      personalStory: {
        motivations: ["Solving complex problems", "Making data-driven decisions", "Continuous learning"],
        perfectJob: "A role where I can use data to drive strategic decisions and help a company grow",
        friendDescriptions: ["Logical", "Reliable", "Analytical"],
        teacherDescriptions: ["Methodical", "Insightful", "Dedicated"],
        proudMoments: ["Developed predictive model that improved customer retention by 15%"],
        frustrations: ["Decisions made without proper data analysis", "Unclear objectives"]
      },
      communityEngagement: {
        totalPoints: 420,
        proactivityScore: 8.1,
        workshopsAttended: 4,
        membersHelped: 6,
        currentStreak: 18,
        communityTier: "Community Leader",
        achievements: [
          { title: "Analysis Expert", points: 80 },
          { title: "Streak Champion", points: 50 },
          { title: "Workshop Leader", points: 75 }
        ]
      },
      careerInsights: {
        roleTypes: ["Data Analyst", "Business Analyst", "Marketing Analyst"],
        industries: ["Technology", "Finance", "Consulting"],
        learningGoals: [
          "Advanced statistical analysis",
          "Machine learning fundamentals",
          "Strategic business planning"
        ]
      },
      teamObservations: {
        overallAssessment: "James is that colleague who always sees the bigger picture while everyone else is still figuring out what the problem actually is. You know how some people get overwhelmed by complex data? James gets excited by it. During his internship, he built this predictive model that improved customer retention by 15% — but what's brilliant is how he explained it to the non-technical team in a way that actually made sense. He's got this lovely habit of asking 'but what does the data actually tell us?' when everyone's making assumptions, and somehow manages to do it without being annoying about it. James is the type who'll stay late on a Friday to perfect a presentation, not because he has to, but because he genuinely cares about getting the story right. He's got these notebooks full of sketched-out frameworks and process improvements — you can tell his brain is constantly working on how to make things more efficient. What's refreshing is that he balances his analytical nature with genuine curiosity about people. He asks great questions in meetings and remembers details about team members' projects. He's looking for somewhere that values strategic thinking and isn't afraid of diving deep into complex challenges. Available with 2 weeks notice and honestly seems energised by the prospect of working somewhere his analytical skills would be properly appreciated.",
        keyHighlights: [
          "Outstanding analytical and data interpretation capabilities",
          "Systematic approach to complex problem-solving",
          "Strong academic foundation with practical application experience",
          "High community engagement demonstrating commitment to continuous learning",
          "Natural leadership qualities evidenced in peer interactions"
        ],
        recommendedNextSteps: [
          "Conduct technical assessment to evaluate analytical capabilities",
          "Schedule case study interview focusing on strategic problem-solving",
          "Arrange meeting with data team to assess technical fit",
          "Discuss growth trajectory into senior analyst or leadership roles"
        ]
      },
      assessmentSubmission: {
        submittedAt: "2025-01-21T16:15:00Z",
        score: 91,
        blendedScore: 89,
        timeSpent: "52 minutes",
        keyInsights: [
          "Exceptional analytical approach to market research task",
          "Strong understanding of data interpretation and presentation",
          "Systematic methodology in problem-solving exercises"
        ],
        demonstratedSkills: ["Data analysis", "Strategic thinking", "Research methodology", "Presentation skills"],
        submissionSummary: "James demonstrated excellent analytical capabilities throughout the assessment. His approach to data interpretation was methodical and insightful, with clear strategic thinking evident in his recommendations."
      },
      detailedWorkStyle: {
        communicationStyle: {
          title: "Direct and analytical",
          description: "James communicates clearly with data-backed reasoning and prefers structured discussions with clear objectives.",
          traits: ["Data-driven communication", "Logical presentations", "Clear structure", "Evidence-based arguments"]
        },
        decisionMakingStyle: {
          title: "Analytical and methodical",
          description: "James systematically evaluates options using data and logical frameworks before making decisions.",
          traits: ["Methodical analysis", "Data-driven choices", "Risk assessment", "Strategic thinking"]
        },
        careerMotivators: {
          title: "Problem-solving and strategic impact",
          traits: ["Complex problem solving", "Strategic decision making", "Process improvement", "Measurable outcomes"]
        },
        workStyleStrengths: {
          title: "Research and analysis-focused roles",
          traits: ["Independent research", "Data interpretation", "Strategic planning", "Systematic approaches"]
        }
      },
      behavioralSummary: "James demonstrates strong analytical thinking and systematic problem-solving abilities. He excels in data-driven environments where logical reasoning and strategic planning are valued, showing particular strength in breaking down complex problems into manageable components.",
      roleInterests: ["Data Analysis", "Strategic Planning"],
      industryInterests: ["Technology & Software", "Finance & Banking"],
      pollenSummary: {
        overallAssessment: "Strong analytical candidate with excellent problem-solving skills and strategic mindset",
        keyHighlights: [
          "Outstanding analytical and data interpretation skills",
          "Systematic approach to complex problems",
          "Strong academic background with practical experience",
          "High community engagement showing commitment to growth"
        ],
        growthPotential: "Very high - demonstrates strong foundation with appetite for strategic challenges",
        culturalFit: "Good fit for analytical roles requiring strategic thinking and data-driven decision making",
        recommendedNextSteps: [
          "Technical interview focusing on data analysis scenarios",
          "Case study presentation to assess strategic thinking",
          "Discussion of previous internship achievements"
        ],
        matchReasoning: "James's analytical skills and systematic approach make him well-suited for strategic marketing roles. His data analysis background and methodical thinking align perfectly with the role requirements."
      }
    },
    {
      id: 3,
      name: "Emma Thompson", 
      pronouns: "she/her",
      age: 23,
      matchScore: 86,
      location: "Birmingham, UK", 
      experience: "Recent Graduate",
      skills: ["Brand Management", "Creative Writing", "Market Research", "Customer Service"],
      status: "complete",
      appliedDate: "2025-01-20",
      behavioralType: "The Creative Genius",
      keyStrengths: [
        "Creative content development with brand storytelling expertise",
        "Strong written communication and copywriting abilities",
        "Market research skills combined with creative insight",
        "Customer-focused approach with service excellence"
      ],
      challengeScore: 83,
      availability: "Available immediately",
      education: {
        level: "Bachelor's Degree",
        institution: "Birmingham City University",
        course: "Creative Writing and Media",
        graduationYear: 2024,
        grade: "2:1"
      },
      workExperience: [
        {
          title: "Part-time Content Creator",
          company: "Local Creative Agency",
          duration: "12 months",
          description: "Created content for social media and wrote copy for various clients"
        }
      ],
      behavioralProfile: {
        type: "The Creative Genius",
        description: "Innovative thinker who transforms ideas into reality with artistic flair",
        discPercentages: { red: 20, yellow: 40, green: 25, blue: 15 },
        workStyleSummary: "Thrives in dynamic environments where creativity and innovation are valued",
        idealEnvironment: ["Creative freedom", "Collaborative brainstorming", "Variety in daily tasks"],
        strengths: ["Creative thinking", "Storytelling", "Brand development", "Content creation"]
      },
      personalStory: {
        motivations: ["Creative expression", "Building brand stories", "Connecting with audiences"],
        perfectJob: "A role where I can combine creativity with strategy to build compelling brand narratives",
        friendDescriptions: ["Creative", "Energetic", "Inspiring"],
        teacherDescriptions: ["Imaginative", "Articulate", "Original"],
        proudMoments: ["Won university creative writing competition", "Increased client social media engagement by 60%"],
        frustrations: ["Rigid processes that stifle creativity", "Limited opportunities for innovation"]
      },
      communityEngagement: {
        totalPoints: 325,
        proactivityScore: 7.2,
        workshopsAttended: 2,
        membersHelped: 5,
        currentStreak: 8,
        communityTier: "Rising Star",
        achievements: [
          { title: "Creative Contributor", points: 65 },
          { title: "Rising Star", points: 45 },
          { title: "Content Creator", points: 50 }
        ]
      },
      careerInsights: {
        roleTypes: ["Content Creator", "Brand Assistant", "Creative Writer"],
        industries: ["Creative Services", "Media & Entertainment", "Marketing"],
        learningGoals: [
          "Brand strategy development",
          "Digital marketing channels",
          "Creative campaign planning"
        ]
      },
      teamObservations: {
        overallAssessment: "Emma's the kind of creative who comes up with ideas that make you go 'why didn't I think of that?' She has this brilliant knack for taking a boring brief and finding the human story inside it. During her part-time work at a creative agency, she didn't just increase social media engagement by 60% — she turned each client's feed into something people actually looked forward to seeing. You know how most brand content feels like... well, brand content? Emma's feels like your interesting friend sharing something cool she discovered. She won her uni's creative writing competition with a piece about everyday objects having secret lives (it was brilliant), and you can see that same imagination in how she approaches marketing challenges. Emma's got these amazing notebooks filled with sketches, quotes, colour swatches, and random observations that somehow always connect back to whatever project she's working on. She's the person who'll suggest trying something completely different and then actually figure out how to make it work practically. What's lovely is that she genuinely gets excited about other people's ideas too — she's that rare creative who makes everyone else feel more creative just by being in the room. Available immediately and honestly seems energised by the idea of working somewhere her storytelling instincts would be properly appreciated.",
        keyHighlights: [
          "Exceptional creative thinking and storytelling capabilities",
          "Strong understanding of brand development principles and audience engagement",
          "Proven track record in content creation with measurable results",
          "Brings fresh perspectives and innovative ideas to traditional marketing approaches",
          "Natural collaborative spirit with ability to inspire creative thinking in others"
        ],
        recommendedNextSteps: [
          "Portfolio review focusing on creative work and brand development projects",
          "Creative brief exercise to assess strategic thinking and execution abilities",
          "Team brainstorming session to evaluate collaborative and creative contribution",
          "Discussion of content creation experience and audience engagement strategies"
        ]
      },
      assessmentSubmission: {
        submittedAt: "2025-01-20T11:45:00Z",
        score: 83,
        blendedScore: 81,
        timeSpent: "38 minutes",
        keyInsights: [
          "Highly creative approach to brand positioning exercise",
          "Excellent storytelling ability in content creation task",
          "Strong understanding of audience engagement principles"
        ],
        demonstratedSkills: ["Creative writing", "Brand strategy", "Content planning", "Audience analysis"],
        submissionSummary: "Emma showed exceptional creativity in her assessment responses. Her brand positioning ideas were innovative and well-articulated, demonstrating both creative flair and strategic understanding."
      },
      detailedWorkStyle: {
        communicationStyle: {
          title: "Creative and engaging",
          description: "Emma communicates with enthusiasm and creativity, bringing energy to team discussions and collaborative sessions.",
          traits: ["Engaging storyteller", "Creative presentations", "Collaborative discussions", "Inspiring communication"]
        },
        decisionMakingStyle: {
          title: "Intuitive and creative",
          description: "Emma combines creative intuition with strategic thinking to develop innovative solutions and fresh approaches.",
          traits: ["Creative problem-solving", "Intuitive insights", "Innovative approaches", "Collaborative input"]
        },
        careerMotivators: {
          title: "Creative expression and brand impact",
          traits: ["Creative freedom", "Brand storytelling", "Audience connection", "Innovative projects"]
        },
        workStyleStrengths: {
          title: "Creative and collaborative environments",
          traits: ["Creative brainstorming", "Brand development", "Content creation", "Team collaboration"]
        }
      },
      behavioralSummary: "Emma brings exceptional creativity and energy to every project, combining innovative thinking with practical brand understanding. She thrives in collaborative environments where fresh ideas are valued and creative expression is encouraged.",
      roleInterests: ["Creative & Content", "Marketing & Communications"],
      industryInterests: ["Media & Entertainment", "Creative Services"],
      pollenSummary: {
        overallAssessment: "Creative and energetic candidate with strong brand development skills and fresh perspectives. Emma brings exceptional creativity and storytelling abilities to marketing challenges, combining innovation with practical understanding of audience engagement and proven track record in content creation.",
        keyHighlights: [
          "Exceptional creative thinking and storytelling abilities",
          "Strong understanding of brand development principles", 
          "Proven track record in content creation and engagement",
          "Brings fresh perspectives and innovative ideas"
        ],
        growthPotential: "High - combines creativity with strategic thinking and shows strong learning motivation",
        culturalFit: "Excellent fit for creative teams that value innovation and fresh thinking",
        recommendedNextSteps: [
          "Portfolio review of creative work and brand projects",
          "Creative brief exercise to assess practical application",
          "Team collaboration session to evaluate cultural fit"
        ],
        matchReasoning: "Emma's creative abilities and brand development skills make her ideal for roles requiring innovative thinking and audience engagement. Her fresh perspective would bring valuable energy to the team."
      },
      visaStatus: "Authorised to work in the UK without sponsorship",
      joinDate: "March 2024",
      reasonableAdjustments: "No specific adjustments requested. Standard interview process appropriate."
    },
    {
      id: 4,
      name: "Michael Roberts",
      pronouns: "he/him", 
      age: 26,
      matchScore: 84,
      location: "Leeds, UK",
      experience: "1 year experience",
      skills: ["Email Marketing", "SEO", "Google Analytics", "Campaign Management"],
      status: "interview_complete",
      appliedDate: "2025-01-19",
      behavioralType: "Reliable Foundation", 
      keyStrengths: [], // will be generated dynamically from DISC profile
      challengeScore: 88,
      availability: "1 month notice required",
      education: {
        level: "Bachelor's Degree",
        institution: "University of Leeds",
        course: "Marketing and Digital Media",
        graduationYear: 2023,
        grade: "2:1"
      },
      workExperience: [
        {
          title: "Junior Marketing Executive",
          company: "Digital Marketing Agency",
          duration: "1 year",
          description: "Managed email campaigns and SEO strategies for multiple clients"
        }
      ],
      behavioralProfile: {
        type: "Reliable Foundation",
        description: "Dependable team player who provides steady support and stability",
        discPercentages: { red: 10, yellow: 20, green: 45, blue: 25 },
        workStyleSummary: "Excels in structured environments with clear processes and quality standards",
        idealEnvironment: ["Well-organised systems", "Clear expectations", "Steady workload"],
        strengths: ["Project management", "Quality assurance", "Process optimization", "Reliable delivery"]
      },
      personalStory: {
        motivations: ["Delivering quality work", "Building systematic processes", "Supporting team success"],
        perfectJob: "A role where I can use my organisational skills to ensure campaigns run smoothly and deliver results",
        friendDescriptions: ["Dependable", "Organised", "Helpful"],
        teacherDescriptions: ["Consistent", "Thorough", "Responsible"],
        proudMoments: ["Improved email campaign open rates by 25%", "Implemented new project management system"],
        frustrations: ["Chaotic work environments", "Unrealistic deadlines", "Poor planning"]
      },
      communityEngagement: {
        totalPoints: 285,
        proactivityScore: 6.8,
        workshopsAttended: 2,
        membersHelped: 4,
        currentStreak: 6,
        communityTier: "Rising Star",
        achievements: [
          { title: "Process Organiser", points: 55 },
          { title: "Quality Controller", points: 40 },
          { title: "Team Helper", points: 35 }
        ]
      },
      careerInsights: {
        roleTypes: ["Marketing Executive", "Campaign Manager", "Digital Marketing Assistant"],
        industries: ["Marketing Agencies", "E-commerce", "Professional Services"],
        learningGoals: [
          "Advanced email marketing automation",
          "SEO optimisation techniques",
          "Marketing analytics and reporting"
        ]
      },
      teamObservations: {
        overallAssessment: "Michael's the person you want on your team when you need things done properly. You know how some people promise they'll get back to you and then... don't? Michael's the opposite. He's got this lovely way of following up on everything without being pushy about it, and somehow always remembers the details everyone else forgets. During his year as a Junior Marketing Executive, he didn't just improve email open rates by 25% — he built this whole system that meant campaigns actually launched on time, with proper testing, and without last-minute panics. Michael's got these beautifully organised spreadsheets (seriously, they're works of art) and he's the type who'll stay 15 minutes late to make sure everything's properly filed and ready for tomorrow. What's brilliant is that he makes being organised look effortless — he's not stressed or rigid about it, just naturally systematic. He's got this quiet confidence where he'll spot a problem early and suggest a solution before it becomes a crisis. Michael genuinely enjoys making processes smoother and more efficient, and you can tell he takes pride in delivering work that doesn't need fixing later. Available with 1 month's notice and honestly seems energised by the idea of working somewhere his organisational instincts would be properly valued.",
        keyHighlights: [
          "Proven track record in digital marketing execution and campaign management",
          "Strong organisational and project management capabilities with attention to detail",
          "Methodical approach ensuring quality and consistency in deliverables",
          "Experience with key marketing tools and analytics platforms",
          "Demonstrates reliability and steady performance with growth potential"
        ],
        recommendedNextSteps: [
          "Technical skills assessment focusing on marketing tools and analytics",
          "Campaign planning exercise to evaluate project management capabilities",
          "Discussion of previous role achievements and process improvements",
          "Assessment of fit within existing team structure and workflow processes"
        ]
      },
      assessmentSubmission: {
        submittedAt: "2025-01-19T09:30:00Z",
        score: 88,
        blendedScore: 84,
        timeSpent: "48 minutes",
        keyInsights: [
          "Methodical approach to campaign planning and execution",
          "Strong attention to detail in analytics and reporting",
          "Clear understanding of project management principles"
        ],
        demonstratedSkills: ["Campaign management", "Analytics interpretation", "Process planning", "Quality control"],
        submissionSummary: "Michael demonstrated excellent organisational skills and attention to detail throughout the assessment. His systematic approach to campaign planning showed strong project management capabilities."
      },
      detailedWorkStyle: {
        communicationStyle: {
          title: "Organised and systematic",
          description: "Michael prefers structured communication with clear agendas and follow-up actions, ensuring nothing falls through the cracks.",
          traits: ["Clear documentation", "Structured meetings", "Regular updates", "Process-focused communication"]
        },
        decisionMakingStyle: {
          title: "Methodical and process-driven",
          description: "Michael follows established processes and procedures, ensuring consistent quality and reliable outcomes in decision-making.",
          traits: ["Process adherence", "Quality checks", "Systematic evaluation", "Consistent standards"]
        },
        careerMotivators: {
          title: "Quality delivery and process improvement",
          traits: ["High-quality outcomes", "Process optimisation", "Reliable delivery", "Team support"]
        },
        workStyleStrengths: {
          title: "Quality-driven, systematic organisations",
          traits: ["Process management", "Quality assurance", "Reliable execution", "Systematic approaches"]
        }
      },
      behavioralSummary: "Michael brings reliability and systematic thinking to every project, ensuring consistent quality and attention to detail. He excels in structured environments where processes and quality standards are clearly defined and valued.",
      roleInterests: ["Project Management", "Operations & Administration"],
      industryInterests: ["Professional Services", "Technology & Software"],
      pollenSummary: {
        overallAssessment: "Reliable and organised candidate with proven marketing experience and strong attention to detail. Michael brings methodical approaches to campaign management and demonstrates consistent delivery capabilities with systematic thinking and process-oriented mindset.",
        keyHighlights: [
          "Proven track record in digital marketing execution",
          "Strong organisational and project management skills",
          "Methodical approach ensuring quality and consistency",
          "Experience with key marketing tools and analytics"
        ],
        growthPotential: "Solid - demonstrates steady improvement and reliable performance with growth opportunities",
        culturalFit: "Good fit for teams that value organisation, quality, and systematic approaches to work",
        recommendedNextSteps: [
          "Deep dive into previous campaign results and improvements",
          "Process improvement discussion and methodology review",
          "Technical skills assessment for marketing tools"
        ],
        matchReasoning: "Michael's proven marketing experience and systematic approach make him a reliable choice for campaign management roles. His attention to detail and process-oriented mindset align well with operational requirements."
      },
      visaStatus: "Right to work via Tier 2 General Visa (expires March 2026)",
      joinDate: "February 2024",
      reasonableAdjustments: "Requires written interview questions in advance due to processing preferences. No other specific adjustments needed."
    },
    {
      id: 5,
      name: "Alex Johnson",
      pronouns: "he/him",
      age: 24,
      matchScore: 89,
      location: "London, UK",
      experience: "Recent Graduate",
      skills: ["Content Creation", "Social Media", "Digital Marketing", "Communication"],
      status: "reviewing",
      appliedDate: "2025-01-18",
      behavioralType: "The Creative Communicator",
      keyStrengths: [
        "Creative content creation with strategic communication focus",
        "Strong social media expertise and digital marketing knowledge",
        "Excellent collaborative skills with team engagement abilities", 
        "First-class academic achievement with practical internship experience"
      ],
      challengeScore: 91,
      availability: "Available immediately",
      education: {
        level: "Bachelor's Degree",
        institution: "University of London",
        course: "Communications and Media Studies",
        graduationYear: 2024,
        grade: "First Class Honours"
      },
      workExperience: [
        {
          title: "Marketing Intern",
          company: "Local Creative Agency",
          duration: "3 months",
          description: "Assisted with social media campaigns and content creation for various clients"
        }
      ],
      behavioralProfile: {
        type: "The Creative Communicator",
        description: "Alex combines creativity with strategic thinking to develop engaging content and communication strategies.",
        discPercentages: { red: 20, yellow: 45, green: 25, blue: 10 },
        workStyleSummary: "Thrives in collaborative environments where creative input is valued and communication flows freely.",
        idealEnvironment: ["Creative freedom", "Collaborative teams", "Regular feedback", "Varied projects"],
        strengths: ["Creative thinking", "Written communication", "Social media expertise", "Team collaboration"]
      },
      personalStory: {
        motivations: ["Creative expression", "Building brand awareness", "Connecting with audiences"],
        perfectJob: "Creating engaging content that resonates with people and drives meaningful connections between brands and their audiences",
        friendDescriptions: ["Creative", "Communicative", "Enthusiastic"],
        teacherDescriptions: ["Innovative", "Collaborative", "Detail-oriented"],
        proudMoments: ["Won university marketing competition", "Grew personal blog to 5k followers"],
        frustrations: ["Lack of creative freedom", "Poor communication"]
      },
      communityEngagement: {
        totalPoints: 520,
        proactivityScore: 8.4,
        workshopsAttended: 2,
        membersHelped: 8,
        currentStreak: 4,
        communityTier: "Rising Star",
        achievements: [
          { title: "Content Creator", points: 50 },
          { title: "Community Helper", points: 40 }
        ]
      },
      references: [
        { name: "Dr. Sarah Williams", title: "University Lecturer", email: "s.williams@university.ac.uk", testimonial: "Alex showed excellent creative and collaborative skills throughout their studies." },
        { name: "Emma Davis", title: "Internship Supervisor", email: "emma.davis@creativeagency.co.uk", testimonial: "Alex made valuable contributions to our team during their internship placement." }
      ],
      teamObservations: {
        overallAssessment: "Meeting Alex is like encountering that friend who genuinely lights up when talking about their latest creative project. There's an infectious enthusiasm about him that immediately draws you in, especially when he starts describing how he grew his personal blog from zero to 5,000 followers while juggling university coursework. What strikes me most about Alex is his natural ability to see the story behind everything - whether it's explaining why a particular social media campaign resonated with audiences or describing how he approaches content creation as building genuine connections rather than just pushing messages.\n\nDuring our conversation, Alex shared how winning his university's marketing competition wasn't just about having good ideas, but about really listening to what the brief was asking for and then crafting something that felt both creative and strategically sound. He has this wonderful way of breaking down complex marketing concepts into relatable stories, which tells me he'd be brilliant at creating content that actually speaks to real people rather than just ticking marketing boxes.\n\nWhat's particularly refreshing about Alex is his collaborative spirit - he genuinely gets excited about other people's ideas and builds on them rather than trying to dominate conversations. When discussing his internship experience, he talked about how much he enjoyed bouncing ideas off his supervisor and incorporating feedback to make campaigns even stronger. This isn't someone who just wants to be given creative freedom and left alone; he wants to be part of a team where ideas flow freely and everyone contributes to making something better.\n\nAlex also has this lovely self-awareness about areas where he wants to grow. He's honest about wanting more experience with data analytics and campaign measurement, viewing these not as weaknesses but as exciting opportunities to become more well-rounded. His approach to learning is refreshingly proactive - rather than waiting for training opportunities, he's already started exploring online courses and asking his network for recommendations.",
        keyHighlights: [
          "Natural storyteller who connects creative ideas with strategic thinking",
          "Proven ability to build and engage audiences from scratch", 
          "Collaborative mindset that thrives on team input and feedback",
          "Self-aware learner actively seeking to expand skill set",
          "Genuine enthusiasm for the craft of marketing and communication"
        ],
        recommendedNextSteps: [
          "Portfolio review focusing on content creation and audience engagement",
          "Conversation about campaign measurement and analytics interests",
          "Team culture discussion about collaboration and creative processes"
        ]
      },
      careerInsights: {
        roleTypes: ["Content Creation", "Digital Marketing", "Communications"],
        industries: ["Creative Services", "Media & Entertainment", "Technology & Software"],
        learningGoals: ["Advanced analytics", "Campaign measurement", "Strategy development"]
      },
      assessmentSubmission: {
        submittedAt: "2025-01-18T14:30:00Z",
        score: 91,
        blendedScore: 88,
        timeSpent: "45 minutes",
        keyInsights: ["Excellent creative problem-solving", "Strong written communication", "Strategic content planning"],
        demonstratedSkills: ["Content Creation", "Social Media Strategy", "Brand Voice Development"],
        submissionSummary: "Alex demonstrated exceptional creativity and strategic thinking in his assessment, showing natural talent for connecting with audiences through compelling content while maintaining brand consistency."
      },
      pollenSummary: {
        overallAssessment: "Creative and enthusiastic candidate with strong communication skills and proven ability to build engaged audiences. Alex brings fresh perspectives and collaborative energy to content creation roles.",
        keyHighlights: [
          "Won university marketing competition through strategic creativity",
          "Grew personal blog from 0 to 5,000 followers independently",
          "Natural storyteller with authentic audience connection",
          "Proactive learner seeking to expand analytics capabilities"
        ],
        growthPotential: "High - demonstrates rapid learning and audience building capabilities",
        culturalFit: "Excellent fit for collaborative, creative environments that value innovation",
        recommendedNextSteps: [
          "Review content portfolio and audience engagement metrics",
          "Discuss creative process and collaborative working style",
          "Explore interest in data-driven content optimisation"
        ],
        matchReasoning: "Alex's proven content creation success and natural collaborative spirit make him ideal for roles requiring creative communication and audience engagement."
      },
      detailedWorkStyle: {
        communicationStyle: {
          title: "Engaging and collaborative",
          description: "Alex naturally connects with others through storytelling and builds on ideas collaboratively rather than working in isolation.",
          traits: ["Natural storyteller", "Active listener", "Builds on others' ideas"]
        },
        decisionMakingStyle: {
          title: "Creative yet strategic",
          description: "Balances creative intuition with strategic thinking, considering both audience appeal and business objectives.",
          traits: ["Considers multiple perspectives", "Balances creativity with strategy", "Seeks feedback for validation"]
        },
        careerMotivators: {
          title: "Creative expression and audience connection",
          traits: ["Building authentic brand connections", "Creative freedom with strategic purpose", "Learning through audience feedback"]
        },
        workStyleStrengths: {
          title: "Collaborative creative environments",
          traits: ["Team brainstorming sessions", "Audience-focused content creation", "Feedback-rich creative processes"]
        }
      },
      behavioralSummary: "Alex combines natural creativity with strategic thinking, thriving in collaborative environments where ideas flow freely and audience connection is valued. His enthusiasm for learning and growth mindset make him adaptable to evolving content strategies.",
      roleInterests: ["Content Creation", "Digital Marketing", "Communications"],
      industryInterests: ["Creative Services", "Media & Entertainment", "Technology & Software"],
      visaStatus: "Authorised to work in the UK without sponsorship",
      joinDate: "December 2023",
      reasonableAdjustments: "No specific adjustments requested. Standard interview process appropriate."
    },
    {
      id: 6,
      name: "Priya Singh",
      pronouns: "she/her",
      age: 24,
      matchScore: 89,
      location: "Birmingham, UK",
      experience: "Recent Graduate",
      skills: ["Business Analysis", "Data Analytics", "Strategic Planning", "Project Management"],
      status: "in_progress",
      appliedDate: "2025-01-12",
      behavioralType: "The Strategic Genius",
      keyStrengths: [
        "Strategic business analysis with data-driven decision making",
        "Advanced analytical skills with project management experience",
        "Strong strategic planning abilities with consulting background",
        "First-class academic achievement with practical Deloitte experience"
      ],
      challengeScore: 91,
      availability: "2 weeks notice required",
      education: {
        level: "Bachelor's Degree",
        institution: "University of Birmingham",
        course: "Business Management and Strategy",
        graduationYear: 2024,
        grade: "First Class Honours"
      },
      workExperience: [
        {
          title: "Business Analyst Intern",
          company: "Deloitte",
          duration: "6 months",
          description: "Conducted market research and analysis for client strategic planning initiatives"
        }
      ],
      behavioralProfile: {
        type: "The Strategic Genius",
        description: "Analytical and methodical, with a natural ability to see patterns and develop strategic solutions.",
        discPercentages: {
          red: 15,
          yellow: 20,
          green: 25,
          blue: 40
        },
        workStyleSummary: "Thrives in structured environments where analytical thinking and strategic planning are valued. Prefers detailed analysis before making decisions.",
        idealEnvironment: ["Quiet, focused workspace", "Clear objectives and deadlines", "Access to data and resources", "Collaborative team environment"],
        strengths: ["Strategic thinking", "Data analysis", "Problem-solving", "Process improvement"]
      },
      personalStory: {
        motivations: ["Making data-driven decisions", "Solving complex business problems", "Contributing to strategic growth"],
        perfectJob: "A role where I can analyse business challenges and develop strategic solutions that make a real impact",
        friendDescriptions: ["Thoughtful", "Reliable", "Detail-oriented"],
        teacherDescriptions: ["Analytical", "Methodical", "Curious"],
        proudMoments: ["Leading university business case competition", "Improving internship processes"],
        frustrations: ["Unclear objectives", "Rushed decision-making", "Lack of proper data"]
      },
      careerInterests: ["Business Analysis", "Project Management", "Strategy"],
      communityEngagement: {
        totalPoints: 780,
        proactivityScore: 8.8,
        workshopsAttended: 4,
        membersHelped: 12,
        currentStreak: 7,
        communityTier: "Community Leader",
        achievements: [
          { title: "Mentor Badge", points: 75 },
          { title: "Workshop Champion", points: 60 },
          { title: "Strategic Thinker", points: 50 }
        ]
      },
      references: [
        { name: "Prof. Michael Chen", title: "Business School Professor", email: "m.chen@business.ac.uk", testimonial: "Priya demonstrated exceptional analytical and strategic thinking throughout her studies." },
        { name: "Rachel Kumar", title: "Previous Manager", email: "rachel.kumar@company.co.uk", testimonial: "Priya showed outstanding problem-solving abilities and collaborative leadership during her internship." }
      ],
      teamObservations: {
        overallAssessment: "Priya has this remarkable ability to see patterns and connections that others often miss, which became evident within the first five minutes of our conversation. When discussing her university project analysing local business trends, she didn't just present data - she wove together insights about customer behaviour, market timing, and operational challenges in a way that painted a complete strategic picture. There's a natural analytical mind at work here, but what makes Priya special is how she translates complex analysis into clear, actionable recommendations.\n\nWhat struck me most about Priya is her methodical approach to problem-solving combined with genuine curiosity about how businesses really work. She described spending extra time during her internship not just completing assigned tasks, but understanding why certain processes existed and how they connected to broader business objectives. This isn't someone who just follows instructions; she's actively thinking about how to make things better and more efficient.\n\nPriya also demonstrates excellent collaborative instincts. When discussing group projects, she talked about her role as the person who helped teams step back and see the bigger picture when they got stuck in details. She has this wonderful ability to ask clarifying questions that help groups align on objectives and priorities. Her approach isn't about being the smartest person in the room, but about helping everyone contribute their best thinking to achieve better outcomes.\n\nDuring our conversation about her career interests, Priya showed impressive self-awareness about her strengths and areas for growth. She's drawn to strategic work because she loves the challenge of understanding complex systems and finding ways to improve them. At the same time, she's eager to develop stronger presentation skills and learn more about stakeholder management, viewing these as essential complements to her analytical abilities.",
        keyHighlights: [
          "Natural strategic thinker who sees patterns and connections others miss",
          "Methodical problem-solver with genuine curiosity about business operations",
          "Collaborative leader who helps teams focus on bigger picture objectives",
          "Self-aware professional eager to develop presentation and stakeholder skills",
          "Analytical mind that translates complex data into actionable insights"
        ],
        recommendedNextSteps: [
          "Case study discussion focusing on strategic analysis approach",
          "Conversation about presentation skills development and stakeholder management",
          "Team dynamics discussion about collaborative problem-solving style"
        ]
      },
      careerInsights: {
        roleTypes: ["Business Analysis", "Strategic Planning", "Project Management"],
        industries: ["Financial Services", "Consulting", "Technology & Software"],
        learningGoals: ["Advanced analytics", "Stakeholder management", "Strategic communication"]
      },
      assessmentSubmission: {
        submittedAt: "2025-01-12T16:45:00Z",
        score: 93,
        blendedScore: 91,
        timeSpent: "52 minutes",
        keyInsights: ["Exceptional analytical reasoning", "Strategic pattern recognition", "Clear problem structuring"],
        demonstratedSkills: ["Business Analysis", "Strategic Planning", "Data Interpretation", "Process Optimisation"],
        submissionSummary: "Priya demonstrated outstanding analytical capabilities and strategic thinking, methodically breaking down complex business scenarios while maintaining focus on practical implementation and measurable outcomes."
      },
      pollenSummary: {
        overallAssessment: "Highly analytical candidate with exceptional strategic thinking abilities and proven business analysis experience. Priya combines methodical problem-solving with collaborative leadership, making her ideal for strategic roles requiring both analytical depth and stakeholder coordination.",
        keyHighlights: [
          "Led university business case competition with strategic innovation",
          "Improved internship processes through systematic analysis",
          "Natural pattern recognition and strategic connectivity",
          "Strong collaborative instincts for team alignment"
        ],
        growthPotential: "Very high - demonstrates advanced analytical thinking with leadership potential",
        culturalFit: "Excellent fit for strategic, data-driven environments that value thorough analysis",
        recommendedNextSteps: [
          "Case study presentation to demonstrate analytical approach",
          "Discussion of stakeholder management and presentation skill development",
          "Exploration of strategic career pathway and long-term objectives"
        ],
        matchReasoning: "Priya's proven analytical abilities, strategic thinking, and collaborative leadership make her ideal for business analysis and strategic planning roles where methodical problem-solving is essential."
      },
      detailedWorkStyle: {
        communicationStyle: {
          title: "Methodical and clarifying",
          description: "Priya communicates with precision and asks thoughtful questions to ensure alignment and understanding across teams.",
          traits: ["Asks clarifying questions", "Structures complex information clearly", "Facilitates team alignment"]
        },
        decisionMakingStyle: {
          title: "Data-driven and systematic",
          description: "Takes time to gather comprehensive information and analyse patterns before making strategic recommendations.",
          traits: ["Thorough data analysis", "Pattern recognition", "Systematic evaluation of options"]
        },
        careerMotivators: {
          title: "Strategic impact and system improvement",
          traits: ["Solving complex business challenges", "Making strategic recommendations", "Improving operational efficiency"]
        },
        workStyleStrengths: {
          title: "Structured analytical environments",
          traits: ["Access to comprehensive data", "Clear strategic objectives", "Collaborative problem-solving teams"]
        }
      },
      behavioralSummary: "Priya combines exceptional analytical thinking with collaborative leadership, thriving in strategic environments where methodical problem-solving and stakeholder alignment are valued. Her systematic approach to complex challenges makes her particularly effective in business analysis and strategic planning roles.",
      roleInterests: ["Business Analysis", "Strategic Planning", "Project Management"],
      industryInterests: ["Financial Services", "Consulting", "Technology & Software"],
      visaStatus: "Authorised to work in the UK without sponsorship",
      joinDate: "October 2023",
      reasonableAdjustments: "Prefers detailed agenda items in advance to prepare comprehensive responses. No other specific adjustments needed."
    }
  ];

  // Simplified status badge helper that uses the new workflow system
  const getStatusBadge = (status: string) => {
    const dummyCandidate = { status } as CandidateMatch;
    const workflowInfo = getCandidateWorkflowInfo(dummyCandidate);
    return (
      <Badge variant={workflowInfo.statusBadge.variant}>
        {workflowInfo.statusBadge.text}
      </Badge>
    );
  };

  const getPollenAvatar = () => {
    // Always use Pollen branding instead of candidate initials
    return "P";
  };

  // Determine primary action for candidate (using new workflow system)
  const getPrimaryAction = (candidate: CandidateMatch) => {
    const workflowInfo = getCandidateWorkflowInfo(candidate);
    const PrimaryIcon = workflowInfo.primaryCTA.icon;
    
    return {
      text: workflowInfo.primaryCTA.text,
      variant: workflowInfo.primaryCTA.variant,
      action: () => handleCTAAction(workflowInfo.primaryCTA.action, candidate.id, setLocation),
      icon: PrimaryIcon
    };
  };

  // Get secondary actions for candidate (using new workflow system)
  const getSecondaryActions = (candidate: CandidateMatch) => {
    const workflowInfo = getCandidateWorkflowInfo(candidate);
    
    return workflowInfo.secondaryActions.map(action => ({
      text: action.text,
      action: () => action.action === 'download_pdf' ? handlePDFDownload(candidate.id) : handleCTAAction(action.action, candidate.id, setLocation),
      icon: action.icon,
      variant: 'outline' as const,
      disabled: action.action === 'download_pdf' && pdfLoading === candidate.id
    }));
  };

  // Get status message for candidate card (using new workflow system)
  const getStatusMessage = (candidate: CandidateMatch) => {
    const workflowInfo = getCandidateWorkflowInfo(candidate);
    
    return {
      text: workflowInfo.actionMessage.text,
      type: workflowInfo.actionMessage.variant === 'employer_action' ? 'action_needed' as const :
            workflowInfo.actionMessage.variant === 'neutral' ? 'neutral' as const : 'waiting' as const,
      icon: workflowInfo.actionMessage.icon
    };
  };

  // Generate available interview time slots
  const generateTimeSlots = () => {
    const slots: Array<{
      id: string;
      day: string;
      date: string;
      time: string;
      display: string;
      duration: string;
    }> = [];
    const days = [
      { date: 'Saturday 18 January 2025', day: 'Saturday' },
      { date: 'Sunday 19 January 2025', day: 'Sunday' },
      { date: 'Monday 20 January 2025', day: 'Monday' },
      { date: 'Tuesday 21 January 2025', day: 'Tuesday' }
    ];
    
    const times = [
      { time: '10:00', display: 'at 10:00' },
      { time: '14:00', display: 'at 14:00' },
      { time: '11:00', display: 'at 11:00' },
      { time: '15:30', display: 'at 15:30' }
    ];

    days.forEach((day, dayIndex) => {
      if (dayIndex < times.length) {
        const timeSlot = times[dayIndex];
        slots.push({
          id: `${day.day.toLowerCase()}-${timeSlot.time}`,
          day: day.day,
          date: day.date,
          time: timeSlot.time,
          display: `${day.day} ${day.date.split(' ')[1]} ${day.date.split(' ')[2]} ${timeSlot.display}`,
          duration: '20 minutes • Video Call'
        });
      }
    });
    
    return slots;
  };

  const availableSlots = generateTimeSlots();

  const handleScheduleInterview = () => {
    // Here you would typically send the interview request to your backend
    console.log('Scheduling interview with:', {
      candidateId: selectedCandidate?.id,
      selectedSlots: interviewForm.selectedSlots,
      additionalNotes: interviewForm.additionalNotes,
      interviewType: interviewForm.interviewType
    });
    
    setShowInterviewModal(false);
    // Show success message or redirect
  };

  const handleSendMessage = () => {
    // Here you would typically send the message to your backend
    console.log('Sending message to:', {
      candidateId: selectedCandidate?.id,
      subject: messageForm.subject,
      message: messageForm.message
    });
    
    setShowMessageModal(false);
    // Show success message
  };

  const handleDownloadPDF = (candidate: CandidateMatch) => {
    try {
      setPdfLoading(candidate.id);
      console.log('Starting PDF download for:', candidate.name);
      
      // Use window.location.href - the documented working approach
      const timestamp = Date.now();
      const downloadUrl = `/api/generate-employer-pdf/${candidate.id}?v=${timestamp}`;
      window.location.href = downloadUrl;
      
      console.log('PDF download initiated for:', candidate.name);
      
      // Clear loading state after a short delay
      setTimeout(() => {
        setPdfLoading(null);
      }, 2000);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Unable to download PDF. Please try again.');
      setPdfLoading(null);
    }
  };

  // Map job IDs to job titles
  const getJobTitle = (id: string) => {
    console.log('JobId received:', id); // Debug log
    const jobTitleMap: Record<string, string> = {
      "1": "Marketing Assistant",
      "2": "Junior Developer", 
      "3": "Data Analyst (Entry Level)"
    };
    return jobTitleMap[id] || "Job Position";
  };

  const jobTitle = getJobTitle(effectiveJobId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation - Only show when not viewing individual candidate */}
      {!selectedCandidate && (
        <nav className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => setLocation("/employer-jobs")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Jobs
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900" style={{fontFamily: 'Sora'}}>
                  {jobTitle} - Candidate Matches
                </h1>
                <p className="text-sm text-gray-600" style={{fontFamily: 'Poppins'}}>
                  {candidatesData ? (Array.isArray(candidatesData) ? candidatesData.length : 0) : 0} candidates matched your requirements
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Post New Job Button */}
              <Button
                onClick={() => setLocation('/comprehensive-job-posting')}
                className="bg-pink-600 hover:bg-pink-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Post New Job
              </Button>
              
              {/* View Toggle Controls */}
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('cards')}
                  className={`${viewMode === 'cards' ? 'bg-white shadow-sm text-gray-900 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <Grid3x3 className="w-4 h-4 mr-2" />
                  Cards
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className={`${viewMode === 'table' ? 'bg-white shadow-sm text-gray-900 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <List className="w-4 h-4 mr-2" />
                  Table
                </Button>
              </div>
            </div>
          </div>
        </nav>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {candidatesLoading ? (
          <div className="max-w-7xl mx-auto px-4 py-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading candidates from database...</p>
          </div>
        ) : candidatesError ? (
          <div className="max-w-7xl mx-auto px-4 py-12 text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">Failed to load candidates. Using fallback data.</p>
          </div>
        ) : !selectedCandidate ? (
          <>
            {viewMode === 'cards' ? (
              /* Card View */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 auto-rows-fr">
            {(candidatesData || mockCandidates).map((candidate: any) => (
                <Card 
                  key={candidate.id}
                  className="cursor-pointer transition-all hover:shadow-lg hover:border-pink-300 flex flex-col"
                  style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                  onClick={() => {
                    setSelectedCandidate(candidate);
                    setActiveTab('pollen-insights');
                  }}
                >
                <CardContent className="p-6 flex flex-col flex-1" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-pink-600 rounded-full flex items-center justify-center">
                        <span className="text-lg font-semibold text-white" style={{fontFamily: 'Sora'}}>
                          {getPollenAvatar()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1" style={{fontFamily: 'Sora'}}>
                          {candidate.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{candidate.pronouns} • {candidate.location}</p>
                        {getStatusBadge(candidate.status)}
                        <div className="text-xs text-blue-600 mt-1">
                          {(() => {
                            const workflowInfo = getCandidateWorkflowInfo(candidate);
                            return workflowInfo.actionMessage.text;
                          })()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-pink-600" style={{fontFamily: 'Sora'}}>
                        {candidate.matchScore}%
                      </div>
                      <p className="text-xs text-gray-500">Overall Match</p>
                    </div>
                  </div>
                  
                  {/* Pollen Team Preview */}
                  <div className="bg-gradient-to-r from-pink-50 to-yellow-50 border border-pink-200 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-gray-900 text-sm mb-2 flex items-center gap-2">
                      <Star className="w-4 h-4 text-pink-600" />
                      Pollen Team Insights
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {candidate.teamObservations.overallAssessment.length > 180 
                        ? `${candidate.teamObservations.overallAssessment.substring(0, 180)}...`
                        : candidate.teamObservations.overallAssessment
                      }
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-gray-600 mb-3">
                    <Clock className="w-3 h-3" />
                    {candidate.availability}
                  </div>

                  {/* Spacer to push content to bottom */}
                  <div className="flex-1"></div>

                  {/* Dynamic Status Message */}
                  {(() => {
                    const workflowInfo = getCandidateWorkflowInfo(candidate);
                    const StatusIcon = workflowInfo.actionMessage.icon;
                    return (
                      <div className={`flex items-center gap-2 p-3 rounded-lg mb-4 text-sm ${
                        workflowInfo.actionMessage.variant === 'employer_action' 
                          ? 'bg-pink-50 border border-pink-200 text-pink-800'
                          : workflowInfo.actionMessage.variant === 'candidate_action'
                          ? 'bg-blue-50 border border-blue-200 text-blue-800'
                          : 'bg-gray-50 border border-gray-200 text-gray-700'
                      }`}>
                        <StatusIcon className="w-4 h-4 flex-shrink-0" />
                        <span className="font-medium">{workflowInfo.actionMessage.text}</span>
                        {workflowInfo.actionMessage.actionOwner === 'employer' && (
                          <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full font-medium ml-auto">
                            Your action
                          </span>
                        )}
                        {workflowInfo.actionMessage.actionOwner === 'candidate' && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium ml-auto">
                            Candidate action
                          </span>
                        )}
                        {workflowInfo.actionMessage.actionOwner === 'neutral' && (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium ml-auto">
                            Info
                          </span>
                        )}
                      </div>
                    );
                  })()}

                  {/* Dynamic Primary Action + Secondary Actions */}
                  <div className="flex gap-2">
                    {(() => {
                      const workflowInfo = getCandidateWorkflowInfo(candidate);
                      const PrimaryIcon = workflowInfo.primaryCTA.icon;
                      const isEmployerAction = workflowInfo.primaryCTA.actionOwner === 'employer';
                      const isCandidateAction = false; // placeholder, no candidate actions currently exist
                      const isCompleted = workflowInfo.primaryCTA.actionOwner === 'completed';
                      
                      return (
                        <Button 
                          className={`flex-1 ${
                            isEmployerAction && workflowInfo.primaryCTA.variant === 'employer_action'
                              ? 'bg-pink-600 hover:bg-pink-700 text-white border-pink-600' 
                              : isCandidateAction
                              ? 'bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-300'
                              : isCompleted
                              ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300'
                              : ''
                          }`}
                          variant={workflowInfo.primaryCTA.variant === 'employer_action' ? 'default' : 'outline'}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCTAAction(workflowInfo.primaryCTA.action, candidate.id, setLocation, setActiveTab);
                          }}
                        >
                          <PrimaryIcon className="w-4 h-4 mr-2" />
                          {workflowInfo.primaryCTA.text}
                        </Button>
                      );
                    })()}
                    
                    {/* Secondary Actions */}
                    {(() => {
                      const workflowInfo = getCandidateWorkflowInfo(candidate);
                      return workflowInfo.secondaryActions.map((action, index) => {
                        const ActionIcon = action.icon;
                        const isEmployerAction = action.actionOwner === 'employer';
                        return (
                          <Button 
                            key={index}
                            variant="outline"
                            size="sm"
                            disabled={action.action === 'download_pdf' && pdfLoading === candidate.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (action.action === 'download_pdf') {
                                handlePDFDownload(candidate.id);
                              } else {
                                handleCTAAction(action.action, candidate.id, setLocation, setActiveTab);
                              }
                            }}
                            className={`px-3 ${
                              isEmployerAction 
                                ? 'border-pink-300 text-pink-700 hover:bg-pink-50' 
                                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                            }`}
                            title={action.text}
                          >
                            <ActionIcon className="w-4 h-4" />
                          </Button>
                        );
                      });
                    })()}
                  </div>
                </CardContent>
              </Card>
            ))}
              </div>
            ) : (
              /* Table View */
              <div className="bg-white rounded-lg border">
                <div className="overflow-x-auto">
                  <table className="w-full" style={{ 
                    tableLayout: 'fixed',
                    borderCollapse: 'separate',
                    borderSpacing: 0
                  }}>
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '25%' }}>
                          Candidate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '15%' }}>
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '12%' }}>
                          Match %
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '18%' }}>
                          Availability
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '30%' }}>
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {(candidatesData || mockCandidates).map((candidate: any) => (
                        <tr key={candidate.id} className="hover:bg-gray-50 cursor-pointer" style={{ height: '56px' }}
                            onClick={(e) => {
                              // Don't trigger row click if clicking on buttons
                              if (!(e.target as HTMLElement).closest('button')) {
                                setSelectedCandidate(candidate);
                                setActiveTab('pollen-insights');
                              }
                            }}>
                          <td className="px-6 py-2 whitespace-nowrap align-middle">
                            <div className="flex items-center h-10">
                              <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center mr-4">
                                <span className="text-sm font-semibold text-white" style={{fontFamily: 'Sora'}}>
                                  {getPollenAvatar()}
                                </span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900" style={{fontFamily: 'Sora'}}>
                                  {candidate.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {candidate.pronouns} • {candidate.location}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap align-middle">
                            <div className="flex items-center h-10">
                              {getStatusBadge(candidate.status)}
                            </div>
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap align-middle">
                            <div className="flex items-center h-10">
                              <div className="text-lg font-bold text-pink-600" style={{fontFamily: 'Sora'}}>
                                {candidate.matchScore}%
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 align-middle">
                            <div className="flex items-center h-10">
                              {candidate.availability}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right align-middle relative">
                            <div className="absolute right-6 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                              {/* Primary action only - secondary actions removed to prevent overlapping */}
                              {(() => {
                                const primaryAction = getPrimaryAction(candidate);
                                const PrimaryIcon = primaryAction.icon;
                                return (
                                  <Button
                                    size="sm"
                                    variant={primaryAction.variant === 'employer_action' ? 'default' : primaryAction.variant as any}
                                    className={`h-8 w-44 ${primaryAction.variant === 'employer_action' || primaryAction.variant === 'default' ? 'bg-pink-600 hover:bg-pink-700 text-white border-pink-600' : primaryAction.variant === 'outline' ? 'border-pink-200 text-pink-600 hover:bg-pink-50' : ''}`}
                                    onClick={() => primaryAction.action()}
                                  >
                                    <PrimaryIcon className="w-4 h-4 mr-2" />
                                    {primaryAction.text}
                                  </Button>
                                );
                              })()}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Full-Width Candidate Profile View */
          <div className="space-y-6">
            {/* Back Button and Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedCandidate(null)}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Candidates
                </Button>
                
                {/* Navigation Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateToCandidate('prev')}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  
                  <span className="text-sm text-gray-600 px-2">
                    {getCurrentCandidateIndex().current} of {getCurrentCandidateIndex().total}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateToCandidate('next')}
                    className="flex items-center gap-1"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Secondary Actions */}
                {(() => {
                  const workflowInfo = getCandidateWorkflowInfo(selectedCandidate);
                  return workflowInfo.secondaryActions.map((action, index) => {
                    const ActionIcon = action.icon;
                    const isEmployerAction = action.actionOwner === 'employer';
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() => action.action === 'download_pdf' ? handlePDFDownload(selectedCandidate.id) : handleCTAAction(action.action, selectedCandidate.id, setLocation)}
                        disabled={action.action === 'download_pdf' && pdfLoading === selectedCandidate.id}
                        className={`flex items-center gap-2 ${
                          isEmployerAction 
                            ? 'border-pink-300 text-pink-700 hover:bg-pink-50' 
                            : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <ActionIcon className="w-4 h-4" />
                        {action.action === 'download_pdf' && pdfLoading === selectedCandidate.id 
                          ? 'Generating PDF...' 
                          : action.text
                        }
                      </Button>
                    );
                  });
                })()}
                
                {/* Primary Action */}
                {(() => {
                  const workflowInfo = getCandidateWorkflowInfo(selectedCandidate);
                  const PrimaryIcon = workflowInfo.primaryCTA.icon;
                  const isEmployerAction = workflowInfo.primaryCTA.actionOwner === 'employer';
                  const isCandidateAction = false; // placeholder, no candidate actions currently exist
                  const isCompleted = workflowInfo.primaryCTA.actionOwner === 'completed';
                  
                  return (
                    <Button 
                      variant={workflowInfo.primaryCTA.variant === 'employer_action' ? 'default' : 'outline'}
                      onClick={() => workflowInfo.primaryCTA.action === 'download_pdf' ? handlePDFDownload(selectedCandidate.id) : handleCTAAction(workflowInfo.primaryCTA.action, selectedCandidate.id, setLocation, setActiveTab)}
                      className={
                        isEmployerAction && workflowInfo.primaryCTA.variant === 'employer_action'
                          ? 'bg-pink-600 hover:bg-pink-700 text-white border-pink-600'
                          : isCandidateAction
                          ? 'bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-300'
                          : isCompleted
                          ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300'
                          : ''
                      }
                    >
                      <PrimaryIcon className="w-4 h-4 mr-2" />
                      {workflowInfo.primaryCTA.text}
                    </Button>
                  );
                })()}
              </div>
            </div>

            {/* Candidate Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  <div className="w-20 h-20 bg-pink-600 rounded-full flex items-center justify-center">
                    <span className="text-3xl font-semibold text-white" style={{fontFamily: 'Sora'}}>
                      {getPollenAvatar()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h1 className="text-3xl font-bold text-gray-900" style={{fontFamily: 'Sora'}}>
                        {selectedCandidate.name}
                      </h1>
                      <span className="text-lg text-gray-600">{selectedCandidate.pronouns}</span>
                      {(() => {
                        const workflowInfo = getCandidateWorkflowInfo(selectedCandidate);
                        return (
                          <Badge variant={workflowInfo.statusBadge.variant}>
                            {workflowInfo.statusBadge.text}
                          </Badge>
                        );
                      })()}
                    </div>
                    
                    {/* Dynamic Action Message */}
                    {(() => {
                      const workflowInfo = getCandidateWorkflowInfo(selectedCandidate);
                      const ActionIcon = workflowInfo.actionMessage.icon;
                      return (
                        <div className={`flex items-center gap-2 p-3 rounded-lg mb-4 text-sm ${
                          workflowInfo.actionMessage.variant === 'employer_action' 
                            ? 'bg-pink-50 border border-pink-200 text-pink-800'
                            : workflowInfo.actionMessage.variant === 'candidate_action'
                            ? 'bg-blue-50 border border-blue-200 text-blue-800'
                            : 'bg-gray-50 border border-gray-200 text-gray-700'
                        }`}>
                          <ActionIcon className="w-4 h-4 flex-shrink-0" />
                          <span className="font-medium">{workflowInfo.actionMessage.text}</span>
                          {workflowInfo.actionMessage.actionOwner === 'employer' && (
                            <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full font-medium ml-auto">
                              Your action
                            </span>
                          )}
                          {workflowInfo.actionMessage.actionOwner === 'candidate' && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium ml-auto">
                              Candidate action
                            </span>
                          )}
                          {workflowInfo.actionMessage.actionOwner === 'neutral' && (
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium ml-auto">
                              Info
                            </span>
                          )}
                        </div>
                      );
                    })()}
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-pink-50 rounded-lg">
                        <div className="text-2xl font-bold text-pink-600">{selectedCandidate.matchScore}%</div>
                        <div className="text-sm text-pink-700">Overall Match</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{selectedCandidate.skillsAssessment?.overallScore || 0}%</div>
                        <div className="text-sm text-green-700">Skills Assessment</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{Math.floor(selectedCandidate.matchScore * 0.85)}%</div>
                        <div className="text-sm text-blue-700">Behavioural Compatibility Score</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      {selectedCandidate.availability}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Match Score Explanation */}
            <Card>
              <CardContent className="pt-6">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 text-sm">🎯</span>
                    </div>
                    <h4 className="font-semibold text-purple-800">How the Match Score is Calculated</h4>
                  </div>
                  <p className="text-purple-700 text-sm leading-relaxed">
                    This score combines the candidate's foundation skills demonstration, behavioural compatibility with your role requirements, and their proactivity within the Pollen community and application process.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Profile Content with Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="candidate-management" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-100 border border-gray-200 shadow-sm p-1.5 rounded-xl mb-4 h-12">
                <TabsTrigger 
                  value="pollen-insights" 
                  className="data-[state=active]:bg-pink-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium transition-all duration-200 rounded-lg text-gray-600 hover:text-gray-900"
                >
                  Pollen Insights
                </TabsTrigger>
                <TabsTrigger 
                  value="profile" 
                  className="data-[state=active]:bg-pink-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium transition-all duration-200 rounded-lg text-gray-600 hover:text-gray-900"
                >
                  Profile
                </TabsTrigger>
                <TabsTrigger 
                  value="skills" 
                  className="data-[state=active]:bg-pink-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium transition-all duration-200 rounded-lg text-gray-600 hover:text-gray-900"
                >
                  Skills
                </TabsTrigger>
                <TabsTrigger 
                  value="candidate-management" 
                  className="data-[state=active]:bg-pink-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium transition-all duration-200 rounded-lg text-gray-600 hover:text-gray-900"
                >
                  Candidate Management
                </TabsTrigger>
              </TabsList>

              {/* Pollen Insights Tab */}
              <TabsContent value="pollen-insights" className="space-y-6 mt-6">

                {/* Pollen Team Assessment */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2" style={{fontFamily: 'Sora'}}>
                      <Star className="w-5 h-5 text-pink-600" />
                      Pollen Team Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gradient-to-r from-pink-50 to-yellow-50 border border-pink-200 rounded-lg p-6">
                      <p className="text-gray-700 leading-relaxed text-base">
                        {selectedCandidate.teamObservations?.overallAssessment || selectedCandidate.pollenSummary?.overallAssessment || "Assessment data not available for this candidate."}
                      </p>
                    </div>
                    
                    {/* Interview Performance */}
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        Interview Performance
                      </h4>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-sm">82%</span>
                          </div>
                          <span className="font-medium text-blue-800">Pollen Team Interview</span>
                        </div>
                        
                        <div className="space-y-2 mb-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">Communication & Rapport</span>
                            <span className={`text-sm font-medium ${getScoreColor(5)}`}>{getScoreLabel(5)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">Role Understanding</span>
                            <span className={`text-sm font-medium ${getScoreColor(4)}`}>{getScoreLabel(4)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-700">Values Alignment</span>
                            <span className={`text-sm font-medium ${getScoreColor(5)}`}>{getScoreLabel(5)}</span>
                          </div>
                        </div>
                        
                        <div className="bg-blue-100 rounded p-3">
                          <p className="text-xs text-blue-800">
                            <strong>Notes:</strong> Genuine enthusiasm, thoughtful questions about company culture, clear preparation.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Important Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2" style={{fontFamily: 'Sora'}}>
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                      Important Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Visa Status */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                        </div>
                        <h4 className="font-semibold text-green-800">Visa Status</h4>
                      </div>
                      <p className="text-green-700 text-sm">
                        {selectedCandidate.visaStatus || "Authorised to work in the UK without sponsorship"}
                      </p>
                    </div>



                    {/* Reasonable Adjustments */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-5 h-5 text-yellow-600" />
                        <h4 className="font-semibold text-yellow-800">Interview Support</h4>
                      </div>
                      <p className="text-yellow-700 text-sm">
                        {selectedCandidate.reasonableAdjustments || "No specific adjustments requested. Standard interview process appropriate."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6 mt-6">
                {/* Behavioural Profile Header with colored background */}
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-6 text-center">
                  <div className="inline-flex items-center gap-2 mb-2">
                    <span className="text-2xl">{getBehavioralEmoji(selectedCandidate)}</span>
                    <h3 className="text-2xl font-bold text-pink-600" style={{fontFamily: 'Sora'}}>{selectedCandidate.behavioralType}</h3>
                  </div>
                  <p className="text-gray-700 italic text-base">
                    {(() => {
                      const type = selectedCandidate.behavioralType;
                      
                      // Primary dominant types
                      if (type?.includes('Results Dynamo')) return "Achievement-focused dynamo who turns ambitious goals into reality. Brings determination and competitive spark to challenging projects, thriving in fast-paced environments where results count.";
                      if (type?.includes('Social Butterfly')) return "Natural people-person who brings energy and builds brilliant connections. Excels at bringing teams together and making everyone feel heard and valued.";
                      if (type?.includes('Reliable Foundation')) return "Steady champion who provides calm support and consistent excellence. The teammate everyone counts on, excelling in collaborative spaces where dependability shines.";
                      if (type?.includes('Strategic Ninja')) return "Master problem-solver who sees the big picture and finds clever ways through complex challenges. Combines analytical thinking with creative solutions to make things happen.";
                      
                      // Red-based combinations
                      if (type?.includes('Ambitious Influencer')) return "Dynamic achiever who combines drive with natural charisma. Excels at motivating teams towards ambitious goals whilst building strong relationships along the way.";
                      if (type?.includes('Strategic Driver')) return "Results-focused strategist who blends determination with analytical thinking. Thrives when turning complex challenges into clear, actionable plans that deliver impact.";
                      if (type?.includes('Steady Achiever')) return "Reliable performer who combines ambition with thoughtful consistency. Brings determined focus whilst ensuring team harmony and sustainable progress.";
                      
                      // Yellow-based combinations  
                      if (type?.includes('Dynamic Leader')) return "Energetic motivator who combines people skills with natural drive. Excels at inspiring teams and creating positive momentum towards shared goals.";
                      if (type?.includes('Supportive Connector')) return "Warm facilitator who brings people together with genuine care. Thrives in collaborative environments where relationships and team success go hand in hand.";
                      if (type?.includes('Thoughtful Communicator')) return "Engaging conversationalist who combines people skills with analytical insight. Excels at building meaningful connections whilst ensuring clear, thoughtful communication.";
                      
                      // Green-based combinations
                      if (type?.includes('Determined Helper')) return "Quietly ambitious supporter who combines personal drive with genuine care for others. Excels at achieving goals whilst ensuring everyone feels valued and included.";
                      if (type?.includes('Collaborative Facilitator')) return "Natural team builder who creates harmony whilst keeping everyone engaged. Thrives in environments where cooperation and shared success are priorities.";
                      if (type?.includes('Methodical Achiever')) return "Detail-loving genius who spots what others miss and makes everything work perfectly. Thrives in organised spaces where quality matters most, bringing systematic magic to every challenge.";
                      
                      // Blue-based combinations
                      if (type?.includes('Analytical Driver')) return "Strategic thinker who combines data-driven insight with results-focused energy. Excels at turning complex analysis into decisive action and measurable outcomes.";
                      if (type?.includes('Creative Analyst')) return "Innovative problem-solver who blends analytical rigor with creative thinking. Thrives when exploring new possibilities and finding clever solutions to complex challenges.";
                      if (type?.includes('Thorough Planner')) return "Meticulous organiser who combines analytical depth with collaborative spirit. Excels at creating detailed plans that work for everyone and deliver consistent results.";
                      
                      // Moderate blends
                      if (type?.includes('Energetic Motivator')) return "High-energy catalyst who combines competitive drive with infectious enthusiasm. Thrives in dynamic environments where motivation and results go hand in hand.";
                      if (type?.includes('Decisive Strategist')) return "Sharp decision-maker who blends analytical thinking with results-focused action. Excels at cutting through complexity to find the best path forward.";
                      if (type?.includes('People-Focused Coordinator')) return "Relationship-building organiser who combines people skills with collaborative excellence. Thrives when bringing teams together around shared goals and mutual support.";
                      if (type?.includes('Careful Collaborator')) return "Thoughtful team player who combines analytical insight with genuine care for others. Excels in environments where quality work and team harmony are equally valued.";
                      
                      // Three-way blends
                      if (type?.includes('Versatile Team Player')) return "Adaptable contributor who brings energy, achievement focus, and collaborative spirit. Thrives in diverse environments where flexibility and team success matter most.";
                      if (type?.includes('Dynamic Problem Solver')) return "Multi-talented achiever who combines drive, communication skills, and analytical thinking. Excels at tackling complex challenges with creative, people-centered solutions.";
                      if (type?.includes('Thoughtful Facilitator')) return "Balanced communicator who blends people skills, collaborative spirit, and analytical depth. Thrives when helping teams work together effectively and thoughtfully.";
                      if (type?.includes('Balanced Professional')) return "Well-rounded contributor who combines achievement focus, reliability, and analytical thinking. Excels in structured environments where consistent quality and strategic insight drive success.";
                      
                      // Default
                      if (type?.includes('Adaptable All-Rounder')) return "Flexible contributor who naturally adjusts their approach to meet any challenge. Brings thoughtful balance and collaborative spirit to every situation, making them valuable in any team dynamic.";
                      
                      // Legacy types for backward compatibility
                      if (type?.includes('Creative Catalyst')) return "Innovative spark who brings fresh ideas and creative magic to everything they touch. Thrives where originality is celebrated and forward-thinking is valued.";
                      if (type?.includes('Creative Communicator')) return "Communication wizard who blends creative flair with smart strategy. Excels at crafting engaging content and building meaningful connections that genuinely resonate with people.";
                      
                      return selectedCandidate.behavioralProfile?.workStyleSummary || "Brings a thoughtful, balanced approach to work with strong collaboration skills and adaptability across different team environments.";
                    })()}
                  </p>
                </div>

                {/* Candidate Summary */}
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-gray-700 leading-relaxed text-base">
                      {generateStandardizedBehavioralDescriptor(selectedCandidate.behavioralProfile?.discPercentages, selectedCandidate.behavioralType, selectedCandidate)}
                    </p>
                  </CardContent>
                </Card>

                {/* Behavioural Profile */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2" style={{fontFamily: 'Sora'}}>
                      <Brain className="w-5 h-5 text-pink-600" />
                      Behavioural Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-red-600 mb-1">{selectedCandidate.behavioralProfile.discPercentages.red}%</div>
                        <div className="font-semibold text-red-800 mb-1">Dominance</div>
                        <p className="text-sm text-red-700">Results-focused</p>
                      </div>
                      
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-yellow-600 mb-1">{selectedCandidate.behavioralProfile.discPercentages.yellow}%</div>
                        <div className="font-semibold text-yellow-800 mb-1">Influence</div>
                        <p className="text-sm text-yellow-700">People-focused</p>
                      </div>
                      
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-green-600 mb-1">{selectedCandidate.behavioralProfile.discPercentages.green}%</div>
                        <div className="font-semibold text-green-800 mb-1">Steadiness</div>
                        <p className="text-sm text-green-700">Stability-focused</p>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-1">{selectedCandidate.behavioralProfile.discPercentages.blue}%</div>
                        <div className="font-semibold text-blue-800 mb-1">Conscientiousness</div>
                        <p className="text-sm text-blue-700">Quality-focused</p>
                      </div>
                    </div>
                    
                    <div className="bg-pink-50 border border-pink-200 rounded-lg p-3 text-center">
                      <span className="text-pink-800 font-medium">
                        {selectedCandidate.behavioralType?.includes('Methodical Achiever') 
                          ? "Analytical and detail-oriented"
                          : selectedCandidate.behavioralType?.includes('Strategic Ninja')
                          ? "Strategic and results-driven"
                          : selectedCandidate.behavioralType?.includes('Social Butterfly')
                          ? "Enthusiastic and people-focused"
                          : selectedCandidate.behavioralType?.includes('Creative Catalyst')
                          ? "Creative and innovative"
                          : selectedCandidate.behavioralType?.includes('Reliable Foundation')
                          ? "Dependable and collaborative"
                          : "Balanced and adaptable"
                        }
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowDiscModal(true)}
                        className="text-gray-500 hover:text-gray-700 flex items-center gap-2"
                      >
                        <HelpCircle className="w-4 h-4" />
                        What does this mean?
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* How They Work */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold" style={{fontFamily: 'Sora'}}>How They Work</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg">💬</span>
                          <h4 className="font-semibold text-blue-800">Communication Style</h4>
                        </div>
                        <p className="font-medium text-blue-900 mb-2">{getWorkStyleTitle(selectedCandidate, 'communication')}</p>
                        <p className="text-sm text-blue-700">{getWorkStyleDescription(selectedCandidate, 'communication')}</p>
                      </div>
                      
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg">⚖️</span>
                          <h4 className="font-semibold text-green-800">Decision-Making Style</h4>
                        </div>
                        <p className="font-medium text-green-900 mb-2">{getWorkStyleTitle(selectedCandidate, 'decision')}</p>
                        <p className="text-sm text-green-700">{getWorkStyleDescription(selectedCandidate, 'decision')}</p>
                      </div>
                      
                      <div className="bg-purple-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg">🎯</span>
                          <h4 className="font-semibold text-purple-800">Career Motivators</h4>
                        </div>
                        <ul className="text-sm text-purple-700 space-y-1">
                          {getCareerMotivators(selectedCandidate).map((trait, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                              {trait}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg">🦋</span>
                          <h4 className="font-semibold text-yellow-800">Work Style Strengths</h4>
                        </div>
                        <ul className="text-sm text-yellow-700 space-y-1">
                          {getWorkStyleStrengths(selectedCandidate).map((trait, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
                              {trait}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Key Strengths */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold" style={{fontFamily: 'Sora'}}>Key Strengths</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(() => {
                        // Generate Key Strengths dynamically from DISC profile like Zara Williams
                        const discProfile = selectedCandidate.behavioralProfile?.discPercentages || { red: 15, yellow: 45, green: 30, blue: 10 };
                        const { red, yellow, green, blue } = discProfile;
                        const strengths = [];
                        
                        // Get pronouns for dynamic content
                        const pronouns = selectedCandidate.pronouns || "they/them";
                        const theyPronoun = pronouns.includes("she") ? "She" : pronouns.includes("he") ? "He" : "They";
                        const theirPronoun = pronouns.includes("she") ? "Her" : pronouns.includes("he") ? "His" : "Their";
                        const themPronoun = pronouns.includes("she") ? "her" : pronouns.includes("he") ? "him" : "them";
                        
                        // Generate strengths based on DISC profile like the server-side logic
                        if (yellow >= 40) {
                          // High Influence (Yellow) - Social Butterfly / Creative Communicator types
                          strengths.push({
                            title: "Enthusiastic Communicator",
                            description: `${theyPronoun} naturally ${theyPronoun === 'They' ? 'energize' : 'energizes'} others and ${theyPronoun === 'They' ? 'excel' : 'excels'} in collaborative environments. ${theirPronoun} communication skills make ${themPronoun} great at building relationships and motivating teams.`
                          });
                          
                          strengths.push({
                            title: "Collaborative Connector",
                            description: `${theyPronoun} ${theyPronoun === 'They' ? 'have' : 'has'} a gift for bringing people together and facilitating teamwork. ${theyPronoun} ${theyPronoun === 'They' ? 'excel' : 'excels'} at creating inclusive environments where everyone feels valued and heard.`
                          });
                          
                          strengths.push({
                            title: "Creative Problem Solver", 
                            description: `${theyPronoun} ${theyPronoun === 'They' ? 'approach' : 'approaches'} challenges with creativity and optimism, often finding innovative solutions by involving others and thinking outside the box.`
                          });
                        }
                        else if (red >= 40) {
                          // High Dominance (Red) - Results-focused characteristics
                          strengths.push({
                            title: "Results-Driven Leader",
                            description: `${theyPronoun} ${theyPronoun === 'They' ? 'focus' : 'focuses'} on achieving goals and driving results. ${theirPronoun} determination and competitive nature help ${themPronoun} deliver successful outcomes even under pressure.`
                          });
                          
                          strengths.push({
                            title: "Decisive Problem Solver",
                            description: `${theyPronoun} ${theyPronoun === 'They' ? 'make' : 'makes'} quick decisions and ${theyPronoun === 'They' ? 'take' : 'takes'} action to resolve challenges. ${theirPronoun} ability to think fast and act decisively makes ${themPronoun} valuable in dynamic environments.`
                          });
                          
                          strengths.push({
                            title: "Goal-Oriented Achiever",
                            description: `${theyPronoun} ${theyPronoun === 'They' ? 'set' : 'sets'} high standards and consistently ${theyPronoun === 'They' ? 'work' : 'works'} to exceed them. ${theirPronoun} competitive nature and focus on outcomes ${theyPronoun === 'They' ? 'drive' : 'drives'} exceptional performance.`
                          });
                        }
                        else if (blue >= 40) {
                          // High Conscientiousness (Blue) - Quality focused / Strategic types
                          strengths.push({
                            title: "Quality & Precision Focus",
                            description: `${theyPronoun} ${theyPronoun === 'They' ? 'combine' : 'combines'} attention to detail with high standards, consistently delivering accurate, well-researched work that meets exact specifications.`
                          });
                          
                          strengths.push({
                            title: "Independent Problem Solver",
                            description: `${theyPronoun} ${theyPronoun === 'They' ? 'work' : 'works'} well autonomously and can systematically break down complex challenges. ${theirPronoun} analytical approach helps ${themPronoun} find efficient solutions to difficult problems.`
                          });
                          
                          strengths.push({
                            title: "Systematic Organiser",
                            description: `${theyPronoun} ${theyPronoun === 'They' ? 'excel' : 'excels'} at creating structure and processes that improve efficiency. ${theirPronoun} methodical approach ensures nothing falls through the cracks.`
                          });
                        }
                        else if (green >= 40) {
                          // High Steadiness (Green) - Reliable Foundation types
                          strengths.push({
                            title: "Reliable Team Player",
                            description: `${theyPronoun} ${theyPronoun === 'They' ? 'provide' : 'provides'} stability and consistency that teams can count on. ${theirPronoun} dependable nature helps create positive, collaborative work environments.`
                          });
                          
                          strengths.push({
                            title: "Patient Problem Solver", 
                            description: `${theyPronoun} ${theyPronoun === 'They' ? 'approach' : 'approaches'} challenges with patience and persistence. ${theirPronoun} thoughtful, step-by-step approach ensures thorough and sustainable solutions.`
                          });
                          
                          strengths.push({
                            title: "Diplomatic Communicator",
                            description: `${theyPronoun} ${theyPronoun === 'They' ? 'excel' : 'excels'} at facilitating discussions and finding common ground. ${theirPronoun} listening skills and empathy make ${themPronoun} great at resolving conflicts and building consensus.`
                          });
                        }
                        else {
                          // Balanced or mixed profiles
                          strengths.push({
                            title: "Adaptable Collaborator",
                            description: `${theyPronoun} ${theyPronoun === 'They' ? 'bring' : 'brings'} a balanced approach to work, adapting ${theirPronoun.toLowerCase()} style to what the situation requires. ${theirPronoun} flexibility makes ${themPronoun} valuable in diverse team settings.`
                          });
                          
                          strengths.push({
                            title: "Thoughtful Contributor", 
                            description: `${theyPronoun} ${theyPronoun === 'They' ? 'consider' : 'considers'} multiple perspectives before acting. ${theirPronoun} balanced approach helps teams make well-rounded decisions and avoid blind spots.`
                          });
                          
                          strengths.push({
                            title: "Versatile Problem Solver",
                            description: `${theyPronoun} can approach challenges from multiple angles, drawing on different strengths as needed. ${theirPronoun} adaptability helps ${themPronoun} succeed in various situations.`
                          });
                        }
                        
                        return strengths.slice(0, 3).map((strength, index) => (
                          <div key={index} className="border-l-4 border-pink-200 pl-4 py-2">
                            <h4 className="font-semibold text-gray-900 mb-2" style={{fontFamily: 'Sora'}}>{strength.title}</h4>
                            <p className="text-gray-700 leading-relaxed">{strength.description}</p>
                          </div>
                        ));
                      })()}
                    </div>
                  </CardContent>
                </Card>

                {/* Personal Insights */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold" style={{fontFamily: 'Sora'}}>Personal Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">💼</span>
                          <h4 className="font-semibold text-gray-800">PERFECT JOB IS...</h4>
                        </div>
                        <p className="text-sm text-gray-700">{selectedCandidate.personalStory?.perfectJob || 'Information not available'}</p>
                      </div>
                      
                      <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">😊</span>
                          <h4 className="font-semibold text-gray-800">MOST HAPPY WHEN...</h4>
                        </div>
                        <p className="text-sm text-gray-700">{selectedCandidate.personalStory?.motivations?.join(', ') || 'Information not available'}</p>
                      </div>
                      
                      <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">👥</span>
                          <h4 className="font-semibold text-gray-800">DESCRIBED AS...</h4>
                        </div>
                        <p className="text-sm text-gray-700"><strong>By friends:</strong> {selectedCandidate.personalStory?.friendDescriptions?.join(', ') || 'Not specified'}</p>
                        <p className="text-sm text-gray-700 mt-1"><strong>By teachers:</strong> {selectedCandidate.personalStory?.teacherDescriptions?.join(', ') || 'Not specified'}</p>
                      </div>
                      
                      <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">⭐</span>
                          <h4 className="font-semibold text-gray-800">MOST PROUD OF...</h4>
                        </div>
                        <p className="text-sm text-gray-700">{selectedCandidate.personalStory?.proudMoments?.join(', ') || 'Information not available'}</p>
                      </div>
                      
                      <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">🎯</span>
                          <h4 className="font-semibold text-gray-800">INTERESTED IN ROLES IN...</h4>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {(selectedCandidate.roleInterests || ["Administration & Office Support", "Sales & Business Development"]).map((role, index) => (
                            <span key={index} className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded text-xs">
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">🏢</span>
                          <h4 className="font-semibold text-gray-800">INDUSTRY INTERESTS...</h4>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {(selectedCandidate.industryInterests || ["Finance & Banking", "Technology & Software"]).map((industry, index) => (
                            <span key={index} className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded text-xs">
                              {industry}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* References */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold" style={{fontFamily: 'Sora'}}>References</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {selectedCandidate.references && selectedCandidate.references.length > 0 ? (
                        selectedCandidate.references.map((reference, index) => (
                          <div key={index} className="border-l-4 border-gray-300 pl-4">
                            <h3 className="font-semibold text-lg text-gray-900">{reference.name}</h3>
                            <p className="text-gray-600 text-sm mb-1">{reference.title}</p>
                            <p className="text-gray-600 text-sm mb-3">{reference.email}</p>
                            <p className="text-gray-700 text-sm italic leading-relaxed">
                              "{reference.testimonial}"
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Users className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-sm">References available upon request</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Community & Engagement */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold" style={{fontFamily: 'Sora'}}>Community & Engagement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xl font-bold text-gray-900" style={{fontFamily: 'Sora'}}>Proactivity Score</p>
                          <p className="text-2xl font-bold">{selectedCandidate.communityEngagement?.proactivityScore || "8.2"}/10</p>
                          <p className="text-xs text-gray-500">Based on community engagement and learning activities</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Joined Pollen</p>
                          <p className="text-lg font-semibold">{selectedCandidate.joinDate || "January 2024"}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-3">Community Achievements</h4>
                        <p className="text-sm text-gray-600 mb-3">Badges awarded based on candidate's participation in the Pollen community — including learning engagement and peer support.</p>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-blue-50 rounded-lg p-3 text-center">
                            <div className="text-2xl mb-1">🎓</div>
                            <p className="font-semibold text-blue-800">Workshop Enthusiast</p>
                            <p className="text-xs text-blue-600">Attended 4+ workshops</p>
                          </div>
                          <div className="bg-green-50 rounded-lg p-3 text-center">
                            <div className="text-2xl mb-1">🤝</div>
                            <p className="font-semibold text-green-800">Community Helper</p>
                            <p className="text-xs text-green-600">Helped 8+ members</p>
                          </div>
                          <div className="bg-yellow-50 rounded-lg p-3 text-center">
                            <div className="text-2xl mb-1">🔥</div>
                            <p className="font-semibold text-yellow-800">Active Streak</p>
                            <p className="text-xs text-yellow-600">12+ week streak</p>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-3 text-center">
                            <div className="text-2xl mb-1">⭐</div>
                            <p className="font-semibold text-purple-800">Rising Star</p>
                            <p className="text-xs text-purple-600">500+ community points</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Skills Tab */}
              <TabsContent value="skills" className="space-y-6 mt-6">
                {/* Overall Assessment Score */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
                      <div className="text-4xl font-bold text-green-600 mb-2">{selectedCandidate.skillsAssessment?.overallScore || 0}%</div>
                      <div className="text-lg text-green-700 font-medium mb-2">Overall Skills Score</div>
                      <p className="text-sm text-gray-600">Combined performance across all assessment areas</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Assessment Scores */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2" style={{fontFamily: 'Sora'}}>
                      <BarChart3 className="w-5 h-5 text-gray-600" />
                      Assessment Scores
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Creative Campaign Development */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">💡</span>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">Creative Campaign Development</h4>
                            <div className="text-2xl font-bold text-green-600">80%</div>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">
                          Outstanding creative campaign development with innovative concepts and strategic execution
                        </p>
                        <div className="bg-gray-50 rounded p-3">
                          <p className="text-xs text-gray-700">
                            <strong>What we looked for:</strong> Creative ideas, clear thinking, and practical solutions.
                          </p>
                          <p className="text-xs text-gray-600 mt-2">
                            <strong>How we scored this:</strong> We looked at how well ideas connected to the target audience, whether the approach felt realistic for a real campaign, and if the candidate could explain their thinking clearly. Higher scores went to responses that showed creativity alongside practical understanding of how campaigns actually work.
                          </p>
                        </div>
                      </div>

                      {/* Data Analysis & Insights */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">📊</span>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">Data Analysis & Insights</h4>
                            <div className="text-2xl font-bold text-green-600">80%</div>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">
                          Exceptional data analysis with clear insights and actionable recommendations
                        </p>
                        <div className="bg-gray-50 rounded p-3">
                          <p className="text-xs text-gray-700">
                            <strong>What we looked for:</strong> Spotting patterns, drawing conclusions, and making helpful suggestions.
                          </p>
                          <p className="text-xs text-gray-600 mt-2">
                            <strong>How we scored this:</strong> We checked if the candidate could identify meaningful trends in the data rather than just obvious facts, whether their recommendations made business sense, and if they could explain their reasoning in simple terms. Better scores came from insights that showed understanding of what the numbers actually mean for the business.
                          </p>
                        </div>
                      </div>

                      {/* Written Communication */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">✍️</span>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">Written Communication</h4>
                            <div className="text-2xl font-bold text-blue-600">70%</div>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">
                          Strong professional communication with good clarity and appropriate tone
                        </p>
                        <div className="bg-gray-50 rounded p-3">
                          <p className="text-xs text-gray-700">
                            <strong>What we looked for:</strong> Clear writing, professional tone, and easy-to-follow explanations.
                          </p>
                          <p className="text-xs text-gray-600 mt-2">
                            <strong>How we scored this:</strong> We assessed whether the message was clear and professional, if it addressed the issue helpfully without being too wordy, and whether the tone felt right for the situation. Higher scores went to responses that balanced being friendly and professional whilst getting the key information across efficiently.
                          </p>
                        </div>
                      </div>

                      {/* Strategic Planning */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">🎯</span>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">Strategic Planning</h4>
                            <div className="text-2xl font-bold text-blue-600">77%</div>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">
                          Strong strategic planning with good analysis and structured thinking
                        </p>
                        <div className="bg-gray-50 rounded p-3">
                          <p className="text-xs text-gray-700">
                            <strong>What we looked for:</strong> Logical planning, considering different factors, and creating realistic steps.
                          </p>
                          <p className="text-xs text-gray-600 mt-2">
                            <strong>How we scored this:</strong> We looked for plans that felt realistic rather than overly ambitious, whether the candidate thought about potential challenges and how to handle them, and if the timeline made sense for an actual project. Better scores went to responses that showed strategic thinking whilst staying grounded in what's actually achievable.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* View Full Submission Section */}
                    <div className="mt-6 border-t pt-6">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowFullSubmission(!showFullSubmission)}
                        className="mb-4 text-pink-600 border-pink-200 hover:bg-pink-50 hover:border-pink-300"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        {showFullSubmission ? "Hide Full Submission" : "View Full Submission"}
                        {showFullSubmission ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
                      </Button>
                      
                      {showFullSubmission && (
                        <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                          <div className="grid grid-cols-1 gap-4">
                            <div className="bg-white p-4 rounded border">
                              <h4 className="font-semibold text-gray-900 mb-2">Why did you apply for this role?</h4>
                              <div className="bg-blue-50 p-3 rounded">
                                <p className="text-sm text-gray-800"><strong>{selectedCandidate.name.split(' ')[0]}'s Response:</strong> I'm really excited about this Digital Marketing Assistant position because it combines my passion for creative content with my interest in data-driven marketing. I've been following your company on social media and love how you showcase real customer stories. I'm particularly drawn to the opportunity to work on campaigns that make a genuine impact, and I believe my fresh perspective and enthusiasm for learning would be valuable to your team.</p>
                              </div>
                            </div>
                            
                            <div className="bg-white p-4 rounded border">
                              <h4 className="font-semibold text-gray-900 mb-2">Creative Campaign Challenge</h4>
                              <p className="text-sm text-gray-700 mb-2"><strong>Question:</strong> Design a social media campaign for a sustainable fashion brand targeting 18-25 year olds.</p>
                              <div className="bg-blue-50 p-3 rounded">
                                <p className="text-sm text-gray-800"><strong>{selectedCandidate.name.split(' ')[0]}'s Response:</strong> I would create a campaign called "Style Sustainably" featuring user-generated content showcasing how young people style sustainable pieces. The campaign would include Instagram Stories with styling tips, TikTok challenges for outfit transformations, and partnerships with eco-conscious influencers. Key messaging would focus on "fashion that feels good and does good" with clear calls-to-action linking to the brand's sustainability credentials and shopping page.</p>
                              </div>
                            </div>
                            
                            <div className="bg-white p-4 rounded border">
                              <h4 className="font-semibold text-gray-900 mb-2">Data Analysis Challenge</h4>
                              <p className="text-sm text-gray-700 mb-2"><strong>Question:</strong> Analyse the attached customer data and provide 3 key insights with recommendations.</p>
                              <div className="bg-blue-50 p-3 rounded">
                                <p className="text-sm text-gray-800"><strong>{selectedCandidate.name.split(' ')[0]}'s Response:</strong> Based on the data analysis: 1) 68% of customers are repeat buyers, suggesting strong brand loyalty - recommend implementing a loyalty programme to further incentivise retention. 2) Peak purchase times are 7-9pm on weekdays - suggest scheduling marketing campaigns and stock releases during these windows. 3) Cart abandonment rate is 45% higher on mobile - recommend optimising mobile checkout flow and implementing abandoned cart email sequences.</p>
                                
                                <div className="mt-3 pt-2 border-t border-blue-200">
                                  <div className="flex items-center gap-2 mb-2">
                                    <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-medium text-gray-800">Supporting Analysis:</span>
                                  </div>
                                  <div className="flex items-center justify-between bg-white p-2 rounded border">
                                    <div className="flex items-center gap-2">
                                      <FileSpreadsheet className="w-4 h-4 text-gray-500" />
                                      <span className="text-sm text-gray-800">customer-analysis-pivot-tables.xlsx</span>
                                      <span className="text-xs text-gray-500">(847 KB)</span>
                                    </div>
                                    <Button variant="outline" size="sm" className="text-xs">
                                      Download
                                    </Button>
                                  </div>
                                  <p className="text-xs text-gray-600 mt-1">Excel workbook with pivot tables showing customer segmentation, purchase patterns, and abandonment analysis</p>
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-white p-4 rounded border">
                              <h4 className="font-semibold text-gray-900 mb-2">Written Communication Assessment</h4>
                              <p className="text-sm text-gray-700 mb-2"><strong>Question:</strong> Write a professional email to a client explaining a campaign delay and proposing next steps.</p>
                              <div className="bg-blue-50 p-3 rounded">
                                <p className="text-sm text-gray-800"><strong>{selectedCandidate.name.split(' ')[0]}'s Response:</strong> Subject: Update on Your Marketing Campaign Launch</p>
                                <p className="text-sm text-gray-800 mt-2">Dear [Client Name],</p>
                                <p className="text-sm text-gray-800 mt-1">I hope this email finds you well. I wanted to reach out regarding your upcoming campaign launch, which was scheduled for next Monday.</p>
                                <p className="text-sm text-gray-800 mt-1">Due to some technical challenges with the new platform integration, we need to push the launch back by one week to ensure everything runs smoothly. I understand this may impact your timeline, and I sincerely apologise for any inconvenience.</p>
                                <p className="text-sm text-gray-800 mt-1">Here's what we're doing to move forward: 1) Our tech team is working around the clock to resolve the integration issues, 2) We'll use this extra time to further optimise your campaign materials, 3) I'll provide daily updates on our progress.</p>
                                <p className="text-sm text-gray-800 mt-1">Please let me know if you'd like to discuss this further. I'm committed to delivering the best possible results for your campaign.</p>
                                <p className="text-sm text-gray-800 mt-1">Best regards,<br/>{selectedCandidate.name}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Candidate Management Tab */}
              <TabsContent value="candidate-management" className="space-y-6 mt-6">
                {/* Progress Tracker */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2" style={{fontFamily: 'Sora'}}>
                      <Target className="w-5 h-5 text-pink-600" />
                      Hiring Progress for {selectedCandidate.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Status Overview */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-900">Current Status</h4>
                          <Badge variant={
                            selectedCandidate.status === 'new' ? 'destructive' : 
                            selectedCandidate.status === 'reviewing' || selectedCandidate.status === 'in_progress' ? 'default' :
                            selectedCandidate.status === 'interview_scheduled' ? 'outline' :
                            selectedCandidate.status === 'interview_complete' ? 'secondary' : 'default'
                          }>
                            {selectedCandidate.status === 'new' && 'New Application'}
                            {(selectedCandidate.status === 'reviewing' || selectedCandidate.status === 'in_progress') && 'In Progress'}
                            {selectedCandidate.status === 'interview_scheduled' && 'Interview Scheduled'}
                            {selectedCandidate.status === 'interview_complete' && 'Interview Complete'}
                            {selectedCandidate.status === 'complete' && 'Process Complete'}
                          </Badge>
                        </div>
                        
                        {/* Progress Steps */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </div>
                            <span className="text-sm text-gray-700">Application received</span>
                            <span className="text-xs text-gray-500">✓ Complete</span>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              selectedCandidate.status !== 'new' ? 'bg-green-100' : 'bg-yellow-100'
                            }`}>
                              {selectedCandidate.status !== 'new' ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <Clock className="w-4 h-4 text-yellow-600" />
                              )}
                            </div>
                            <span className="text-sm text-gray-700">Profile reviewed</span>
                            <span className="text-xs text-gray-500">
                              {selectedCandidate.status !== 'new' ? '✓ Complete' : 'Pending'}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              ['interview_scheduled', 'interview_complete', 'complete'].includes(selectedCandidate.status) ? 'bg-green-100' : 'bg-gray-100'
                            }`}>
                              {['interview_scheduled', 'interview_complete', 'complete'].includes(selectedCandidate.status) ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <Clock className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                            <span className="text-sm text-gray-700">Interview scheduled</span>
                            <span className="text-xs text-gray-500">
                              {['interview_scheduled', 'interview_complete', 'complete'].includes(selectedCandidate.status) ? '✓ Complete' : 'Pending'}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              ['interview_complete', 'complete'].includes(selectedCandidate.status) ? 'bg-green-100' : 'bg-gray-100'
                            }`}>
                              {['interview_complete', 'complete'].includes(selectedCandidate.status) ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <Clock className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                            <span className="text-sm text-gray-700">Interview completed</span>
                            <span className="text-xs text-gray-500">
                              {['interview_complete', 'complete'].includes(selectedCandidate.status) ? '✓ Complete' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-pink-600" />
                          Quick Actions
                        </h4>
                        
                        <div className="grid grid-cols-2 gap-3">
                          {selectedCandidate.status === 'new' && (
                            <>
                              <Button className="bg-pink-600 hover:bg-pink-700 text-white">
                                <Eye className="w-4 h-4 mr-2" />
                                Mark as Reviewed
                              </Button>
                              <Button variant="outline" className="border-pink-200 text-pink-600 hover:bg-pink-50">
                                <XCircle className="w-4 h-4 mr-2" />
                                Not Interested
                              </Button>
                            </>
                          )}
                          
                          {(selectedCandidate.status === 'reviewing' || selectedCandidate.status === 'in_progress') && (
                            <>
                              <Button 
                                className="bg-pink-600 hover:bg-pink-700 text-white"
                                onClick={() => {
                                  // Route to availability submission page
                                  setLocation(`/candidate-next-steps/${selectedCandidate.id}`);
                                }}
                              >
                                <Calendar className="w-4 h-4 mr-2" />
                                Schedule Interview
                              </Button>
                              <Button 
                                variant="outline" 
                                className="border-pink-200 text-pink-600 hover:bg-pink-50"
                                onClick={() => {
                                  // Route to specific candidate conversation
                                  const candidateMessageMapping: Record<number, string> = {
                                    20: '1', 21: '2', 22: '3', 23: '4', 24: '5', 25: '6'
                                  };
                                  const conversationId = candidateMessageMapping[selectedCandidate.id] || '1';
                                  setLocation(`/employer-messages?conversation=${conversationId}`);
                                }}
                              >
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Send Message
                              </Button>
                            </>
                          )}
                          
                          {selectedCandidate.status === 'interview_scheduled' && (
                            <>
                              <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                                <Eye className="w-4 h-4 mr-2" />
                                View Interview Details
                              </Button>
                              <Button variant="outline" className="border-pink-200 text-pink-600 hover:bg-pink-50">
                                <Calendar className="w-4 h-4 mr-2" />
                                Reschedule
                              </Button>
                            </>
                          )}
                          
                          {selectedCandidate.status === 'interview_complete' && (
                            <>
                              <Button className="bg-green-600 hover:bg-green-700 text-white">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Make Job Offer
                              </Button>
                              <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
                                <FileText className="w-4 h-4 mr-2" />
                                Provide Feedback
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Interview Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2" style={{fontFamily: 'Sora'}}>
                      <Users className="w-5 h-5 text-blue-600" />
                      Interview Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedCandidate.status === 'interview_scheduled' || selectedCandidate.status === 'interview_complete' ? (
                      <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-blue-900">Initial Interview</h4>
                            <Badge variant="outline" className="border-blue-300 text-blue-700">
                              {selectedCandidate.status === 'interview_scheduled' ? 'Scheduled' : 'Completed'}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2 text-sm text-blue-800">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>January 29, 2025 at 2:00 PM</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              <span>Demo Employer, Sarah Johnson (HR)</span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 mt-3">
                            <Button variant="outline" size="sm" className="border-blue-300 text-blue-700">
                              <Eye className="w-3 h-3 mr-1" />
                              View Details
                            </Button>
                            {selectedCandidate.status === 'interview_complete' && (
                              <>
                                <Button variant="outline" size="sm" className="border-green-300 text-green-700">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Progress
                                </Button>
                                <Button variant="outline" size="sm" className="border-red-300 text-red-700">
                                  <XCircle className="w-3 h-3 mr-1" />
                                  No Thanks
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p>No interviews scheduled yet</p>
                        <p className="text-sm">Schedule an interview to continue the hiring process</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Communication Log */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2" style={{fontFamily: 'Sora'}}>
                      <MessageSquare className="w-5 h-5 text-green-600" />
                      Communication History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="border-l-4 border-green-200 pl-4 py-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm text-gray-900">Application submitted</span>
                          <span className="text-xs text-gray-500">{selectedCandidate.appliedDate}</span>
                        </div>
                        <p className="text-sm text-gray-600">Candidate applied for {jobTitle} position</p>
                      </div>
                      
                      {selectedCandidate.status !== 'new' && (
                        <div className="border-l-4 border-blue-200 pl-4 py-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm text-gray-900">Profile reviewed</span>
                            <span className="text-xs text-gray-500">Jan 23, 2025</span>
                          </div>
                          <p className="text-sm text-gray-600">Employer reviewed candidate profile</p>
                        </div>
                      )}
                      
                      <div className="text-center py-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-pink-200 text-pink-600 hover:bg-pink-50"
                          onClick={() => setShowMessageModal(true)}
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Send Message
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

          </div>
        )}
      </div>

      {/* Interview Scheduling Modal */}
      <Dialog open={showInterviewModal} onOpenChange={setShowInterviewModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle style={{fontFamily: 'Sora'}}>Schedule Interview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              Schedule an interview with {selectedCandidate?.name}
            </p>
            
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setShowInterviewModal(false);
                  // In a real app, this would integrate with calendar system
                }}
                className="flex-1 bg-pink-600 hover:bg-pink-700 text-white"
              >
                Schedule Interview
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowInterviewModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Message Modal */}
      <Dialog open={showMessageModal} onOpenChange={setShowMessageModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle style={{fontFamily: 'Sora'}}>Send Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              Send a message to {selectedCandidate?.name}
            </p>
            
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setShowMessageModal(false);
                  // In a real app, this would send the message
                }}
                className="flex-1 bg-pink-600 hover:bg-pink-700 text-white"
              >
                Send Message
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowMessageModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* DISC Profile Breakdown Modal */}
      <Dialog open={showDiscModal} onOpenChange={setShowDiscModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900" style={{fontFamily: 'Sora'}}>
              DISC Profile Breakdown
            </DialogTitle>
            <p className="text-gray-600 mt-1" style={{fontFamily: 'Poppins'}}>
              Understanding behavioural dimensions and work style preferences
            </p>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dominance (Red) */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                <h3 className="text-xl font-bold text-gray-900" style={{fontFamily: 'Sora'}}>
                  Dominance (Red)
                </h3>
              </div>
              <p className="text-gray-700 font-medium mb-3" style={{fontFamily: 'Poppins'}}>
                Direct, results-focused, competitive
              </p>
              <ul className="space-y-2 text-sm text-gray-600" style={{fontFamily: 'Poppins'}}>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  Quick decision-making
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  Goal-oriented approach
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  Takes charge in situations
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  Values efficiency and results
                </li>
              </ul>
            </div>

            {/* Influence (Yellow) */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-6 bg-yellow-500 rounded-full"></div>
                <h3 className="text-xl font-bold text-gray-900" style={{fontFamily: 'Sora'}}>
                  Influence (Yellow)
                </h3>
              </div>
              <p className="text-gray-700 font-medium mb-3" style={{fontFamily: 'Poppins'}}>
                Outgoing, enthusiastic, persuasive
              </p>
              <ul className="space-y-2 text-sm text-gray-600" style={{fontFamily: 'Poppins'}}>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold">•</span>
                  People-focused communication
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold">•</span>
                  Optimistic and energetic
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold">•</span>
                  Builds relationships easily
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold">•</span>
                  Motivates and inspires others
                </li>
              </ul>
            </div>

            {/* Steadiness (Green) */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                <h3 className="text-xl font-bold text-gray-900" style={{fontFamily: 'Sora'}}>
                  Steadiness (Green)
                </h3>
              </div>
              <p className="text-gray-700 font-medium mb-3" style={{fontFamily: 'Poppins'}}>
                Patient, reliable, team-oriented
              </p>
              <ul className="space-y-2 text-sm text-gray-600" style={{fontFamily: 'Poppins'}}>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  Consistent and dependable
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  Values harmony and stability
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  Supports team collaboration
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  Prefers gradual change
                </li>
              </ul>
            </div>

            {/* Conscientiousness (Blue) */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                <h3 className="text-xl font-bold text-gray-900" style={{fontFamily: 'Sora'}}>
                  Conscientiousness (Blue)
                </h3>
              </div>
              <p className="text-gray-700 font-medium mb-3" style={{fontFamily: 'Poppins'}}>
                Analytical, precise, quality-focused
              </p>
              <ul className="space-y-2 text-sm text-gray-600" style={{fontFamily: 'Poppins'}}>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  Detail-oriented approach
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  Values accuracy and quality
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  Systematic problem-solving
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  Follows established procedures
                </li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
