import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { DiscRadarChart } from "@/components/disc-radar-chart";
import { 
  Search, Filter, Grid3x3, List, Download, MessageSquare, 
  Calendar, Eye, Star, ArrowLeft, X, Users, CheckCircle,
  FileSpreadsheet, Trophy, UserCheck, Heart, Lightbulb,
  TrendingUp, Award, Brain, ChevronLeft, ChevronRight, 
  Mail, Phone, Target, Radar, Clock, AlertCircle, BarChart3
} from "lucide-react";

// Import the exact workflow system from job-candidate-matches
const getCandidateWorkflowInfo = (candidate: CandidateMatch) => {
  const { status } = candidate;
  
  switch (status) {
    case 'new':
      return {
        statusBadge: { text: 'New', variant: 'destructive' as const },
        actionMessage: { 
          text: 'Profile review required', 
          icon: Eye,
          variant: 'employer_action' as const,
          actionOwner: 'employer' as const
        },
        primaryCTA: { 
          text: 'Review Profile', 
          icon: Eye, 
          action: 'review_profile',
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
          text: 'Waiting for candidate to book interview slot', 
          icon: Clock,
          variant: 'candidate_action' as const,
          actionOwner: 'candidate' as const
        },
        primaryCTA: { 
          text: 'Review Profile', 
          icon: Eye, 
          action: 'review_profile',
          variant: 'outline' as const,
          actionOwner: 'employer' as const
        },
        secondaryActions: [
          { text: 'Send Message', icon: MessageSquare, action: 'send_message', actionOwner: 'employer' as const },
          { text: 'Export Profile', icon: FileSpreadsheet, action: 'download_pdf', actionOwner: 'employer' as const }
        ]
      };
      
    case 'interview_scheduled':
      return {
        statusBadge: { text: 'Interview Scheduled', variant: 'outline' as const },
        actionMessage: { 
          text: 'Interview confirmed - view details or add to calendar', 
          icon: Calendar,
          variant: 'neutral' as const,
          actionOwner: 'neutral' as const
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
          { text: 'Send Message', icon: MessageSquare, action: 'send_message', actionOwner: 'employer' as const },
          { text: 'Export Profile', icon: FileSpreadsheet, action: 'download_pdf', actionOwner: 'employer' as const }
        ]
      };
      
    case 'interview_complete':
      return {
        statusBadge: { text: 'Interview Complete', variant: 'secondary' as const },
        actionMessage: { 
          text: 'Provide feedback and next steps to candidate', 
          icon: AlertCircle,
          variant: 'employer_action' as const,
          actionOwner: 'employer' as const
        },
        primaryCTA: { 
          text: 'Provide Update', 
          icon: MessageSquare, 
          action: 'provide_update',
          variant: 'employer_action' as const,
          actionOwner: 'employer' as const
        },
        secondaryActions: [
          { text: 'Schedule Follow-up', icon: Calendar, action: 'schedule_followup', actionOwner: 'employer' as const },
          { text: 'Export Profile', icon: FileSpreadsheet, action: 'download_pdf', actionOwner: 'employer' as const }
        ]
      };
      
    case 'offered':
    case 'hired':
    case 'rejected':
    case 'complete':
      return {
        statusBadge: { 
          text: status === 'offered' ? 'Offer Extended' : 
                status === 'hired' ? 'Hired' : 
                status === 'rejected' ? 'Not Selected' : 'Complete',
          variant: status === 'hired' ? 'default' as const : 
                  status === 'rejected' ? 'destructive' as const : 'secondary' as const
        },
        actionMessage: null,
        primaryCTA: null,
        secondaryActions: [
          { text: 'Export Profile', icon: FileSpreadsheet, action: 'download_pdf', actionOwner: 'employer' as const }
        ]
      };
      
    default:
      return {
        statusBadge: { text: 'Unknown', variant: 'outline' as const },
        actionMessage: null,
        primaryCTA: null,
        secondaryActions: []
      };
  }
};

// Function to get dynamic motivations based on DISC profile
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

// Use exact interface from job-candidate-matches
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
  assessmentSubmission: {
    submittedAt: string;
    score: number;
    blendedScore: number;
    timeSpent: string;
    keyInsights: string[];
    demonstratedSkills: string[];
    submissionSummary: string;
  };
  pollenSummary: {
    overallAssessment: string;
    keyHighlights: string[];
    growthPotential: string;
    culturalFit: string;
    recommendedNextSteps: string[];
    matchReasoning: string;
  };
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

export default function CandidateManagementImproved() {
  console.log("🚀 CANDIDATE MANAGEMENT COMPONENT LOADED - NEW VERSION WITH CORRECT TABS");
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateMatch | null>(null);
  const [splitPosition, setSplitPosition] = useState(40);
  const [isDragging, setIsDragging] = useState(false);

  // Fetch database-backed candidates (using exact same query from job-candidate-matches)
  const { data: candidatesData, isLoading: candidatesLoading, error: candidatesError } = useQuery({
    queryKey: ['/api/job-candidates', '1'], // Default to job ID 1
    queryFn: async () => {
      const response = await fetch(`/api/job-candidates/1`);
      if (!response.ok) {
        throw new Error('Failed to fetch candidates');
      }
      return response.json();
    }
  });

  const candidates = candidatesData || [];

  // Mouse drag functionality for resizing panels
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const containerWidth = window.innerWidth;
      const newPosition = Math.max(20, Math.min(60, (e.clientX / containerWidth) * 100));
      setSplitPosition(newPosition);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const filteredCandidates = candidates.filter((candidate: CandidateMatch) => {
    const matchesSearch = candidate.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewProfile = (candidate: CandidateMatch) => {
    setSelectedCandidate(candidate);
  };

  const handleDownloadPDF = async (candidateId: number) => {
    try {
      const response = await fetch(`/api/generate-employer-pdf/${candidateId}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `Candidate_${candidateId}_Profile.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  const handleSendMessage = (candidateId: number) => {
    console.log("Send message to candidate", candidateId);
  };

  const handleManageInterview = (candidateId: number) => {
    console.log("Manage interview for candidate", candidateId);
  };

  const getCurrentCandidateIndex = () => {
    if (!selectedCandidate) return -1;
    return filteredCandidates.findIndex((c: CandidateMatch) => c.id === selectedCandidate.id);
  };

  const navigateCandidateInPanel = (direction: 'prev' | 'next') => {
    const currentIndex = getCurrentCandidateIndex();
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex >= 0 && newIndex < filteredCandidates.length) {
      setSelectedCandidate(filteredCandidates[newIndex]);
    }
  };

  if (candidatesLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    // Use proper container that works with existing layout
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b shadow-sm z-20">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/employer-dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Candidate Management</h1>
              <p className="text-sm text-gray-600">
                {filteredCandidates.length} candidates found
              </p>
            </div>
          </div>
          
          {selectedCandidate && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                {getCurrentCandidateIndex() + 1} of {filteredCandidates.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateCandidateInPanel('prev')}
                disabled={getCurrentCandidateIndex() <= 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateCandidateInPanel('next')}
                disabled={getCurrentCandidateIndex() >= filteredCandidates.length - 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedCandidate(null)}
                className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
              >
                <X className="w-4 h-4 mr-1" />
                Close Profile
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex min-h-0">
        {/* Left Panel - Filters and Table */}
        <div 
          className="bg-white flex flex-col border-r"
          style={{ width: selectedCandidate ? `${splitPosition}%` : '100%' }}
        >
          {/* Filters */}
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center gap-4 mb-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
                  <SelectItem value="interview_complete">Interview Complete</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                >
                  <List className="w-4 h-4 mr-1" />
                  Table
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3x3 className="w-4 h-4 mr-1" />
                  Grid
                </Button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto">
            {viewMode === 'table' ? (
              <CandidateTable 
                candidates={filteredCandidates}
                onViewProfile={handleViewProfile}
                onDownloadPDF={handleDownloadPDF}
                onSendMessage={handleSendMessage}
                onManageInterview={handleManageInterview}
                isCompact={!!selectedCandidate}
                selectedCandidateId={selectedCandidate?.id}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {filteredCandidates.map((candidate: CandidateMatch) => (
                  <Card 
                    key={candidate.id} 
                    className={`cursor-pointer hover:shadow-md transition-shadow ${
                      selectedCandidate?.id === candidate.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => handleViewProfile(candidate)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold">
                          {candidate.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="font-medium">{candidate.name}</h3>
                          <p className="text-sm text-gray-500">{candidate.experience}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Match Score</span>
                          <span className="font-bold text-green-600">{candidate.matchScore}%</span>
                        </div>
                        <Badge variant="secondary">{getCandidateWorkflowInfo(candidate).statusBadge.text}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Draggable Separator */}
        {selectedCandidate && (
          <div 
            className="w-1 bg-gray-300 cursor-col-resize hover:bg-gray-400 transition-colors flex-shrink-0"
            onMouseDown={handleMouseDown}
          />
        )}

        {/* Right Panel - Candidate Detail (exact same content as job-candidate-matches) */}
        {selectedCandidate && (
          <div 
            className="bg-white overflow-y-auto flex-shrink-0"
            style={{ width: `${100 - splitPosition}%` }}
          >
            <CandidateDetailPanel 
              candidate={selectedCandidate}
              onDownloadPDF={handleDownloadPDF}
              onSendMessage={handleSendMessage}
              onManageInterview={handleManageInterview}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Table component with exact structure from job-candidate-matches
function CandidateTable({ 
  candidates, 
  onViewProfile, 
  onDownloadPDF, 
  onSendMessage, 
  onManageInterview,
  isCompact = false,
  selectedCandidateId
}: {
  candidates: CandidateMatch[];
  onViewProfile: (candidate: CandidateMatch) => void;
  onDownloadPDF: (candidateId: number) => void;
  onSendMessage: (candidateId: number) => void;
  onManageInterview: (candidateId: number) => void;
  isCompact?: boolean;
  selectedCandidateId?: number;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b sticky top-0">
          <tr>
            <th className={`text-left font-medium text-gray-900 ${isCompact ? 'p-2 text-xs' : 'p-4'}`}>Candidate</th>
            <th className={`text-left font-medium text-gray-900 ${isCompact ? 'p-2 text-xs' : 'p-4'}`}>Match Score</th>
            <th className={`text-left font-medium text-gray-900 ${isCompact ? 'p-2 text-xs' : 'p-4'}`}>Status</th>
            <th className={`text-left font-medium text-gray-900 ${isCompact ? 'p-2 text-xs' : 'p-4'}`}>Applied</th>
            <th className={`text-left font-medium text-gray-900 ${isCompact ? 'p-2 text-xs' : 'p-4'}`}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate) => {
            const workflowInfo = getCandidateWorkflowInfo(candidate);
            return (
              <tr 
                key={candidate.id} 
                className={`border-b hover:bg-gray-50 cursor-pointer ${
                  selectedCandidateId === candidate.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => onViewProfile(candidate)}
              >
                <td className={isCompact ? 'p-2' : 'p-4'}>
                  <div className="flex items-center gap-3">
                    <div className={`rounded-full bg-pink-500 text-white flex items-center justify-center font-bold ${isCompact ? 'w-6 h-6 text-xs' : 'w-10 h-10'}`}>
                      {candidate.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className={`font-medium ${isCompact ? 'text-sm' : ''}`}>{candidate.name}</div>
                      <div className={`text-gray-500 ${isCompact ? 'text-xs' : 'text-sm'}`}>{candidate.pronouns}</div>
                      <div className={`text-gray-500 ${isCompact ? 'text-xs' : 'text-sm'}`}>{candidate.location}</div>
                    </div>
                  </div>
                </td>
                <td className={isCompact ? 'p-2' : 'p-4'}>
                  <div className="flex items-center gap-2">
                    <div className={`font-bold ${isCompact ? 'text-sm' : 'text-lg'}`}>{candidate.matchScore}%</div>
                    <Star className={`text-yellow-500 ${isCompact ? 'w-3 h-3' : 'w-4 h-4'}`} />
                  </div>
                </td>
                <td className={isCompact ? 'p-2' : 'p-4'}>
                  <Badge variant={workflowInfo.statusBadge.variant} className={isCompact ? 'text-xs' : ''}>
                    {workflowInfo.statusBadge.text}
                  </Badge>
                </td>
                <td className={isCompact ? 'p-2' : 'p-4'}>
                  <div className={`text-gray-600 ${isCompact ? 'text-xs' : 'text-sm'}`}>
                    {new Date(candidate.appliedDate).toLocaleDateString()}
                  </div>
                </td>
                <td className={isCompact ? 'p-2' : 'p-4'}>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSendMessage(candidate.id);
                      }}
                      className={isCompact ? 'px-2 py-1' : ''}
                    >
                      <MessageSquare className={`${isCompact ? 'w-3 h-3' : 'w-4 h-4'}`} />
                      {!isCompact && <span className="ml-1">Message</span>}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDownloadPDF(candidate.id);
                      }}
                      className={isCompact ? 'px-2 py-1' : ''}
                    >
                      <FileSpreadsheet className={`${isCompact ? 'w-3 h-3' : 'w-4 h-4'}`} />
                      {!isCompact && <span className="ml-1">PDF</span>}
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Comprehensive candidate detail panel using exact same structure as job-candidate-matches
function CandidateDetailPanel({ 
  candidate, 
  onDownloadPDF, 
  onSendMessage, 
  onManageInterview 
}: {
  candidate: CandidateMatch;
  onDownloadPDF: (candidateId: number) => void;
  onSendMessage: (candidateId: number) => void;
  onManageInterview: (candidateId: number) => void;
}) {
  // Get dynamic data using exact same functions as job-candidate-matches
  const careerMotivators = getCareerMotivators(candidate);
  const workStyleStrengths = getWorkStyleStrengths(candidate);
  const workflowInfo = getCandidateWorkflowInfo(candidate);

  return (
    <div className="p-6 space-y-6">
      {/* Profile Header - exact same as job-candidate-matches */}
      <div className="flex items-start gap-6">
        <div className="w-20 h-20 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-2xl flex-shrink-0">
          {candidate.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900">{candidate.name}</h1>
          <p className="text-gray-600">{candidate.pronouns} • {candidate.age} years old</p>
          <p className="text-sm text-gray-500">{candidate.location}</p>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="font-bold text-lg">{candidate.matchScore}% Match</span>
            </div>
            {candidate.challengeScore && (
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-pink-500" />
                <span className="font-bold text-lg">{candidate.challengeScore}% Challenge Score</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Button 
          className="flex-1"
          onClick={() => onSendMessage(candidate.id)}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Message
        </Button>
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => onDownloadPDF(candidate.id)}
        >
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
      </div>

      {/* 4-Tab System - exact same tabs as job-candidate-matches */}
      <Tabs defaultValue="pollen-insights" className="w-full">
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

        {/* Pollen Insights Tab - exact same content structure */}
        <TabsContent value="pollen-insights" className="space-y-6 mt-6">
          {/* Overview Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{candidate.matchScore}%</div>
                <div className="text-sm text-gray-500">Overall Match</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{candidate.challengeScore || 0}%</div>
                <div className="text-sm text-gray-500">Challenge Score</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{candidate.communityEngagement.proactivityScore}/10</div>
                <div className="text-sm text-gray-500">Engagement</div>
              </CardContent>
            </Card>
          </div>

          {/* Pollen Team Assessment */}
          {candidate.pollenSummary && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Pollen Team Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Overall Assessment</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {candidate.pollenSummary.overallAssessment}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Key Highlights</h4>
                  <div className="flex flex-wrap gap-2">
                    {candidate.pollenSummary?.keyHighlights?.map((highlight, index) => (
                      <Badge key={index} variant="outline" className="px-3 py-1">{highlight}</Badge>
                    )) || <p className="text-gray-500 text-sm">No highlights available</p>}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Match Reasoning</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {candidate.pollenSummary.matchReasoning}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Skills Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Core Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {candidate.skills?.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">{skill}</Badge>
                )) || <p className="text-gray-500 text-sm">No skills data available</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Tab - exact same structure */}
        <TabsContent value="profile" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-blue-600" />
                Behavioral Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* DISC Chart */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">DISC Profile</h4>
                <div className="flex items-center gap-6">
                  <div className="w-48 h-48">
                    <DiscRadarChart data={candidate.behavioralProfile.discPercentages} />
                  </div>
                  <div className="flex-1">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-lg font-bold text-blue-800">{candidate.behavioralProfile.type}</div>
                      <p className="text-blue-700 text-sm mt-1">{candidate.behavioralProfile.description}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Communication Style */}
              {candidate.detailedWorkStyle && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Communication Style</h4>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="font-semibold text-green-800">{candidate.detailedWorkStyle.communicationStyle.title}</div>
                    <p className="text-green-700 text-sm mt-1">{candidate.detailedWorkStyle.communicationStyle.description}</p>
                  </div>
                </div>
              )}

              {/* Key Strengths */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Key Strengths</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {candidate.keyStrengths?.map((strength, index) => (
                    <div key={index} className="bg-purple-50 p-3 rounded-lg">
                      <div className="font-medium text-purple-800">{strength}</div>
                    </div>
                  )) || <p className="text-purple-700 text-sm">No key strengths data available</p>}
                </div>
              </div>

              {/* Career Motivators */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Career Motivators</h4>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    {careerMotivators.map((motivator, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-yellow-600" />
                        <span className="text-yellow-800 text-sm">{motivator}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills Tab - exact same structure */}
        <TabsContent value="skills" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5 text-pink-500" />
                Skills Assessment - {candidate.challengeScore || 0}%
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Assessment Submission Details */}
              {candidate.assessmentSubmission && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Assessment Results</h4>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-green-800">Overall Score</span>
                      <span className="text-2xl font-bold text-green-700">{candidate.assessmentSubmission.score}%</span>
                    </div>
                    <p className="text-green-700 text-sm">{candidate.assessmentSubmission.submissionSummary}</p>
                  </div>
                </div>
              )}

              {/* Core Skills */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Core Skills</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {candidate.skills?.map((skill, index) => (
                    <div key={index} className="bg-blue-50 p-3 rounded-lg flex items-center justify-between">
                      <span className="font-medium text-blue-800">{skill}</span>
                      <Badge variant="secondary">{85 + (index * 2)}%</Badge>
                    </div>
                  )) || <p className="text-blue-700 text-sm">No skills data available</p>}
                </div>
              </div>

              {/* Demonstrated Skills */}
              {candidate.assessmentSubmission?.demonstratedSkills && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Demonstrated Skills</h4>
                  <div className="space-y-2">
                    {candidate.assessmentSubmission?.demonstratedSkills?.map((skill, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm">{skill}</span>
                      </div>
                    )) || <p className="text-gray-500 text-sm">No demonstrated skills data available</p>}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Candidate Management Tab - exact same structure */}
        <TabsContent value="candidate-management" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                Personal Story
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Perfect Job */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Their Perfect Job</h4>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800 italic">"{candidate.personalStory?.perfectJob || 'No perfect job description available'}"</p>
                </div>
              </div>

              {/* Motivations */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">What Motivates Them</h4>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    {candidate.personalStory?.motivations?.map((motivation, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-purple-600" />
                        <span className="text-purple-800 text-sm">{motivation}</span>
                      </div>
                    )) || <p className="text-purple-700 text-sm">No motivations data available</p>}
                  </div>
                </div>
              </div>

              {/* Community Engagement */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Community Engagement</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-yellow-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-yellow-700">{candidate.communityEngagement.totalPoints}</div>
                    <div className="text-sm text-yellow-600">Total Points</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-700">{candidate.communityEngagement.membersHelped}</div>
                    <div className="text-sm text-green-600">Members Helped</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-700">{candidate.communityEngagement.currentStreak}</div>
                    <div className="text-sm text-orange-600">Day Streak</div>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                    {candidate.communityEngagement.communityTier}
                  </Badge>
                </div>
              </div>

              {/* Proud Moments */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Proud Moments</h4>
                <div className="space-y-2">
                  {candidate.personalStory?.proudMoments?.map((moment, index) => (
                    <div key={index} className="bg-rose-50 p-3 rounded-lg">
                      <p className="text-rose-800 text-sm">{moment}</p>
                    </div>
                  )) || <p className="text-rose-700 text-sm">No proud moments data available</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}