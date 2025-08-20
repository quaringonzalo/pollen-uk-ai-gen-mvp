import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, Search, Filter, Grid3x3, List, Eye, FileDown, 
  MapPin, Clock, Star, Calendar, MessageSquare, CheckCircle,
  XCircle, AlertCircle, Briefcase, GraduationCap, Trophy,
  FileSpreadsheet, MoreHorizontal, Plus
} from "lucide-react";

// Enhanced candidate interface with job information
interface CandidateWithJob {
  id: number;
  name: string;
  pronouns: string;
  matchScore: number;
  location: string;
  skills: string[];
  status: string;
  appliedDate: string;
  behavioralType: string;
  keyStrengths: string[];
  challengeScore: number;
  availability: string;
  jobId: number;
  jobTitle: string;
  jobDepartment: string;
  pollenTeamInsights?: string; // Added this property
  communityEngagement: {
    totalPoints: number;
    proactivityScore: number;
    workshopsAttended: number;
    membersHelped: number;
    currentStreak: number;
    communityTier: string;
  };
}

// Mock job data for filtering
const mockJobs = [
  { id: 1, title: "Marketing Assistant", department: "Marketing", openPositions: 3 },
  { id: 2, title: "Sales Coordinator", department: "Sales", openPositions: 2 },
  { id: 3, title: "Content Creator", department: "Marketing", openPositions: 1 },
  { id: 4, title: "Customer Success Associate", department: "Customer Success", openPositions: 2 },
  { id: 5, title: "Junior Data Analyst", department: "Analytics", openPositions: 1 }
];

// Enhanced applicants data with candidates for multiple jobs
const mockApplicants: CandidateWithJob[] = [
  // Marketing Assistant job candidates (7 total)
  {
    id: 20, name: "Sarah Chen", pronouns: "she/her", matchScore: 92,
    location: "London, UK", 
    skills: ["Digital Marketing", "Social Media", "Content Creation", "Analytics"],
    status: "new", appliedDate: "2025-01-22", behavioralType: "The Social Butterfly",
    keyStrengths: ["Natural collaborative energy", "Creative problem-solving", "Thoughtful communication"],
    challengeScore: 87, availability: "Available immediately",
    jobId: 1, jobTitle: "Marketing Assistant", jobDepartment: "Marketing",
    communityEngagement: { totalPoints: 385, proactivityScore: 7.8, workshopsAttended: 3, membersHelped: 8, currentStreak: 12, communityTier: "Rising Star" }
  },
  {
    id: 21, name: "James Mitchell", pronouns: "he/him", matchScore: 89,
    location: "Manchester, UK",
    skills: ["Marketing Strategy", "Data Analysis", "Project Management", "Communication"],
    status: "in_progress", appliedDate: "2025-01-21", behavioralType: "Strategic Achiever",
    keyStrengths: ["Analytical thinking", "Strategic planning", "Process improvement"],
    challengeScore: 91, availability: "2 weeks notice required",
    jobId: 1, jobTitle: "Marketing Assistant", jobDepartment: "Marketing",
    communityEngagement: { totalPoints: 420, proactivityScore: 8.2, workshopsAttended: 4, membersHelped: 12, currentStreak: 8, communityTier: "Community Leader" }
  },
  {
    id: 22, name: "Emma Thompson", pronouns: "she/her", matchScore: 85,
    location: "Birmingham, UK",
    skills: ["Content Writing", "Social Media", "Brand Management", "Creative Design"],
    status: "new", appliedDate: "2025-01-20", behavioralType: "Creative Analyst",
    keyStrengths: ["Creative problem-solving", "Written communication", "Brand awareness"],
    challengeScore: 88, availability: "Available immediately",
    jobId: 1, jobTitle: "Marketing Assistant", jobDepartment: "Marketing",
    communityEngagement: { totalPoints: 310, proactivityScore: 7.2, workshopsAttended: 2, membersHelped: 6, currentStreak: 15, communityTier: "Rising Star" }
  },
  {
    id: 23, name: "Priya Singh", pronouns: "she/her", matchScore: 86,
    location: "Edinburgh, UK",
    skills: ["Marketing", "Social Media", "Event Planning", "Communication"],
    status: "interview_scheduled", appliedDate: "2025-01-19", behavioralType: "Steady Planner",
    keyStrengths: ["Event coordination", "Team collaboration", "Creative thinking"],
    challengeScore: 85, availability: "Available immediately",
    jobId: 1, jobTitle: "Marketing Assistant", jobDepartment: "Marketing",
    communityEngagement: { totalPoints: 780, proactivityScore: 8.8, workshopsAttended: 6, membersHelped: 22, currentStreak: 18, communityTier: "Top Contributor" }
  },
  {
    id: 24, name: "Michael Roberts", pronouns: "he/him", matchScore: 90,
    location: "Bristol, UK",
    skills: ["Data Analysis", "Marketing Analytics", "Report Writing", "Campaign Management"],
    status: "interview_complete", appliedDate: "2025-01-18", behavioralType: "Analytical Driver",
    keyStrengths: ["Data interpretation", "Analytical skills", "Attention to detail"],
    challengeScore: 92, availability: "Available immediately",
    jobId: 1, jobTitle: "Marketing Assistant", jobDepartment: "Marketing",
    communityEngagement: { totalPoints: 450, proactivityScore: 8.5, workshopsAttended: 5, membersHelped: 15, currentStreak: 20, communityTier: "Top Contributor" }
  },
  {
    id: 25, name: "Alex Johnson", pronouns: "they/them", matchScore: 88,
    location: "Leeds, UK",
    skills: ["Customer Service", "Communication", "Problem Solving", "Team Leadership"],
    status: "interview_scheduled", appliedDate: "2025-01-17", behavioralType: "Versatile Team Player",
    keyStrengths: ["Customer focus", "Team support", "Reliability"],
    challengeScore: 84, availability: "1 month notice required",
    jobId: 1, jobTitle: "Marketing Assistant", jobDepartment: "Marketing",
    communityEngagement: { totalPoints: 290, proactivityScore: 6.8, workshopsAttended: 3, membersHelped: 5, currentStreak: 6, communityTier: "Rising Star" }
  },
  {
    id: 26, name: "Sophie Williams", pronouns: "she/her", matchScore: 83,
    location: "Glasgow, UK",
    skills: ["Social Media", "Content Creation", "Photography", "Design"],
    status: "new", appliedDate: "2025-01-16", behavioralType: "Creative Analyst",
    keyStrengths: ["Visual creativity", "Content strategy", "Social engagement"],
    challengeScore: 80, availability: "Available immediately",
    jobId: 1, jobTitle: "Marketing Assistant", jobDepartment: "Marketing",
    communityEngagement: { totalPoints: 215, proactivityScore: 6.5, workshopsAttended: 2, membersHelped: 3, currentStreak: 5, communityTier: "Rising Star" }
  },
  // Sales Coordinator candidates
  {
    id: 27, name: "David Wilson", pronouns: "he/him", matchScore: 89,
    location: "London, UK",
    skills: ["Sales", "Customer Relations", "CRM", "Lead Generation"],
    status: "new", appliedDate: "2025-01-21", behavioralType: "Results Dynamo",
    keyStrengths: ["Target achievement", "Client relationship building", "Persuasive communication"],
    challengeScore: 85, availability: "Available immediately",
    jobId: 2, jobTitle: "Sales Coordinator", jobDepartment: "Sales",
    communityEngagement: { totalPoints: 320, proactivityScore: 7.5, workshopsAttended: 2, membersHelped: 6, currentStreak: 10, communityTier: "Rising Star" }
  },
  {
    id: 28, name: "Rachel Green", pronouns: "she/her", matchScore: 91,
    location: "Birmingham, UK",
    skills: ["Business Development", "Sales Strategy", "Communication", "Negotiation"],
    status: "interview_scheduled", appliedDate: "2025-01-20", behavioralType: "Ambitious Influencer",
    keyStrengths: ["Relationship building", "Goal orientation", "Strategic thinking"],
    challengeScore: 88, availability: "2 weeks notice required",
    jobId: 2, jobTitle: "Sales Coordinator", jobDepartment: "Sales",
    communityEngagement: { totalPoints: 395, proactivityScore: 8.1, workshopsAttended: 3, membersHelped: 9, currentStreak: 14, communityTier: "Community Leader" }
  },
  // Content Creator candidates
  {
    id: 29, name: "Oliver Taylor", pronouns: "he/him", matchScore: 87,
    location: "Bristol, UK",
    skills: ["Content Writing", "Video Production", "Creative Design", "Social Media"],
    status: "new", appliedDate: "2025-01-19", behavioralType: "Creative Catalyst",
    keyStrengths: ["Creative storytelling", "Visual design", "Content strategy"],
    challengeScore: 83, availability: "Available immediately",
    jobId: 3, jobTitle: "Content Creator", jobDepartment: "Marketing",
    communityEngagement: { totalPoints: 275, proactivityScore: 7.0, workshopsAttended: 2, membersHelped: 4, currentStreak: 8, communityTier: "Rising Star" }
  },
  // Customer Success Associate candidates
  {
    id: 30, name: "Lucy Brown", pronouns: "she/her", matchScore: 93,
    location: "Manchester, UK",
    skills: ["Customer Support", "Problem Solving", "Communication", "CRM Management"],
    status: "in_progress", appliedDate: "2025-01-18", behavioralType: "Supportive Connector",
    keyStrengths: ["Customer empathy", "Problem resolution", "Team collaboration"],
    challengeScore: 90, availability: "Available immediately",
    jobId: 4, jobTitle: "Customer Success Associate", jobDepartment: "Customer Success",
    communityEngagement: { totalPoints: 465, proactivityScore: 8.4, workshopsAttended: 4, membersHelped: 14, currentStreak: 16, communityTier: "Top Contributor" }
  },
  {
    id: 31, name: "Tom Anderson", pronouns: "he/him", matchScore: 86,
    location: "Leeds, UK",
    skills: ["Customer Relations", "Technical Support", "Documentation", "Training"],
    status: "interview_complete", appliedDate: "2025-01-17", behavioralType: "Methodical Collaborator",
    keyStrengths: ["Technical expertise", "Patient communication", "Process improvement"],
    challengeScore: 87, availability: "1 month notice required",
    jobId: 4, jobTitle: "Customer Success Associate", jobDepartment: "Customer Success",
    communityEngagement: { totalPoints: 340, proactivityScore: 7.6, workshopsAttended: 3, membersHelped: 8, currentStreak: 12, communityTier: "Community Leader" }
  },
  // Junior Data Analyst candidate
  {
    id: 32, name: "Hannah Clarke", pronouns: "she/her", matchScore: 94,
    location: "Edinburgh, UK",
    skills: ["Data Analysis", "Python", "SQL", "Data Visualization"],
    status: "new", appliedDate: "2025-01-16", behavioralType: "Analytical Driver",
    keyStrengths: ["Statistical analysis", "Data interpretation", "Technical problem solving"],
    challengeScore: 92, availability: "Available immediately",
    jobId: 5, jobTitle: "Junior Data Analyst", jobDepartment: "Analytics",
    communityEngagement: { totalPoints: 410, proactivityScore: 8.0, workshopsAttended: 4, membersHelped: 11, currentStreak: 15, communityTier: "Community Leader" }
  }
];

const getStatusBadge = (status: string) => {
  const statusConfig = {
    new: { color: "bg-blue-100 text-blue-800", label: "New" },
    reviewing: { color: "bg-yellow-100 text-yellow-800", label: "Reviewing" },
    shortlisted: { color: "bg-green-100 text-green-800", label: "Shortlisted" },
    interview_scheduled: { color: "bg-cyan-100 text-cyan-800", label: "Interview Scheduled" },
    rejected: { color: "bg-red-100 text-red-800", label: "Not Selected" },
    offered: { color: "bg-purple-100 text-purple-800", label: "Offer Extended" },
    hired: { color: "bg-emerald-100 text-emerald-800", label: "Hired" }
  };
  
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
  return <Badge className={`${config.color} text-xs`}>{config.label}</Badge>;
};

export default function ApplicantsPage() {
  const [location, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");
  const [sortBy, setSortBy] = useState<string>("appliedDate");
  
  // Check if we're coming from a specific job context and auto-filter
  useEffect(() => {
    const urlParams = new URLSearchParams(location.split('?')[1] || '');
    const jobParam = urlParams.get('job');
    if (jobParam && jobParam !== 'all') {
      setSelectedJob(jobParam);
    }
  }, [location]);

  // Get unique departments for filtering
  const departments = Array.from(new Set(mockApplicants.map(a => a.jobDepartment)));

  // Filter and sort applicants
  const filteredApplicants = useMemo(() => {
    let filtered = mockApplicants.filter(applicant => {
      const matchesSearch = applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           applicant.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesJob = selectedJob === "all" || applicant.jobId.toString() === selectedJob;
      const matchesStatus = selectedStatus === "all" || applicant.status === selectedStatus;
      const matchesDepartment = selectedDepartment === "all" || applicant.jobDepartment === selectedDepartment;
      
      return matchesSearch && matchesJob && matchesStatus && matchesDepartment;
    });

    // Sort applicants
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "matchScore":
          return b.matchScore - a.matchScore;
        case "appliedDate":
          return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
        case "challengeScore":
          return b.challengeScore - a.challengeScore;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedJob, selectedStatus, selectedDepartment, sortBy]);

  const handleViewCandidate = (candidateId: number) => {
    // Navigate to detailed candidate view with candidate pre-selected and preserve filter context
    const candidate = filteredApplicants.find(c => c.id === candidateId);
    if (candidate) {
      // Route to job-candidate-matches with correct job format (job-001, etc.)
      const jobKey = `job-00${candidate.jobId}`;
      // Add returnTo parameter to maintain filtered applicants context
      setLocation(`/job-candidate-matches/${jobKey}?candidate=${candidateId}&returnTo=applicants-standalone&filter=${selectedJob || 'all'}`);
    }
  };

  const handleCTAAction = (action: string, candidateId: number) => {
    const candidate = filteredApplicants.find(c => c.id === candidateId);
    if (!candidate) return;

    console.log('🎯 CTA Action clicked:', action, 'for candidate:', candidateId);
    console.log('🎯 Candidate found:', candidate);
    console.log('🎯 Current location before navigation:', location);

    switch (action) {
      case 'view_status':
        console.log('🎯 About to navigate to status summary for candidate:', candidateId);
        const targetRoute = `/candidate-status/${candidateId}`;
        console.log('🎯 Target route:', targetRoute);
        setLocation(targetRoute);
        console.log('🎯 setLocation called with:', targetRoute);
        
        // Verify navigation happened
        setTimeout(() => {
          console.log('🎯 Location after navigation attempt:', window.location.pathname);
        }, 100);
        break;
      case 'review_profile':
        handleViewCandidate(candidateId);
        break;
      case 'view_schedule':
        setLocation(`/interview-schedule/${candidateId}`);
        break;
      case 'provide_feedback':
        setLocation(`/provide-interview-update/${candidateId}`);
        break;
      case 'send_message':
        // Route to specific candidate conversation
        const candidateMessageMapping: Record<number, string> = {
          23: '4', // Priya Singh
          30: '5'  // Lucy Brown
        };
        const conversationId = candidateMessageMapping[candidateId] || '1';
        setLocation(`/employer-messages?conversation=${conversationId}`);
        break;
      default:
        handleViewCandidate(candidateId);
    }
  };

  const handleCardClick = (candidate: CandidateWithJob) => {
    // Route to the specific job posting for this candidate
    const jobRouteMapping: Record<number, string> = {
      1: 'job-001', // Marketing Assistant
      2: 'job-002', // Sales Coordinator  
      3: 'job-003', // Content Creator
      4: 'job-004', // Customer Success Associate
      5: 'job-005'  // Junior Data Analyst
    };
    const jobRoute = jobRouteMapping[candidate.jobId] || 'job-001';
    setLocation(`/job-candidate-matches/${jobRoute}?candidate=${candidate.id}`);
  };

  // Get sub-status descriptive copy
  const getSubStatusDescription = (status: string) => {
    switch (status) {
      case 'new':
      case 'new_application':
        return 'review candidate profile';
      case 'interview_scheduled':
        return 'your interview is booked in';
      case 'interview_complete':
      case 'interview_completed':
        return 'your interview is complete';
      case 'reviewing':
      case 'in_progress':
        return "you're up to date, awaiting candidate for update";
      case 'complete':
      case 'job_offered':
        return 'thanks for providing feedback';
      case 'hired':
        return 'you found your match!';
      default:
        return 'review candidate profile';
    }
  };

  // Import the workflow function from job-candidate-matches
  const getCandidateWorkflowInfo = (candidate: CandidateWithJob) => {
    const status = candidate.status;
    
    switch (status) {
      case 'new':
      case 'new_application':
        return {
          statusBadge: { text: 'New', variant: 'success' as const },
          primaryCTA: { 
            text: 'Schedule Interview', 
            icon: Calendar, 
            action: 'schedule_interview',
            variant: 'employer_action' as const,
          },
          secondaryActions: [
            { text: 'Export Profile', icon: FileSpreadsheet, action: 'download_pdf' }
          ]
        };
        
      case 'interview_scheduled':
        return {
          statusBadge: { text: 'In Progress', variant: 'default' as const },
          primaryCTA: { 
            text: 'View Interview Details', 
            icon: Calendar, 
            action: 'view_schedule',
            variant: 'default' as const,
          },
          secondaryActions: [
            { text: 'Add to Calendar', icon: Calendar, action: 'add_to_calendar' },
            { text: 'Export Profile', icon: FileSpreadsheet, action: 'download_pdf' }
          ]
        };
        
      case 'interview_complete':
      case 'interview_completed':
        return {
          statusBadge: { text: 'In Progress', variant: 'default' as const },
          primaryCTA: { 
            text: 'Provide Update', 
            icon: MessageSquare, 
            action: 'provide_feedback',
            variant: 'employer_action' as const,
          },
          secondaryActions: [
            { text: 'Export Profile', icon: FileSpreadsheet, action: 'download_pdf' }
          ]
        };
        
      case 'reviewing':
      case 'in_progress':
        return {
          statusBadge: { text: 'In Progress', variant: 'default' as const },
          primaryCTA: { 
            text: 'Awaiting Candidate', 
            icon: Clock, 
            action: 'view_status',
            variant: 'outline' as const,
          },
          secondaryActions: [
            { text: 'Send Message', icon: MessageSquare, action: 'send_message' },
            { text: 'Export Profile', icon: FileSpreadsheet, action: 'download_pdf' }
          ]
        };
        
      case 'complete':
      case 'job_offered':
        return {
          statusBadge: { text: 'Complete', variant: 'secondary' as const },
          primaryCTA: { 
            text: 'View Details', 
            icon: Eye, 
            action: 'view_details',
            variant: 'outline' as const,
          },
          secondaryActions: [
            { text: 'Export Profile', icon: FileSpreadsheet, action: 'download_pdf' }
          ]
        };
        
      case 'hired':
        return {
          statusBadge: { text: 'Hired', variant: 'hired' as const },
          primaryCTA: { 
            text: 'View Details', 
            icon: Eye, 
            action: 'view_details',
            variant: 'outline' as const,
          },
          secondaryActions: [
            { text: 'Export Profile', icon: FileSpreadsheet, action: 'download_pdf' }
          ]
        };
        
      default:
        return {
          statusBadge: { text: 'New', variant: 'success' as const },
          primaryCTA: { 
            text: 'Schedule Interview', 
            icon: Calendar, 
            action: 'schedule_interview',
            variant: 'employer_action' as const,
          },
          secondaryActions: [
            { text: 'Export Profile', icon: FileSpreadsheet, action: 'download_pdf' }
          ]
        };
    }
  };

  const CandidateCard = ({ candidate }: { candidate: CandidateWithJob }) => {
    const workflowInfo = getCandidateWorkflowInfo(candidate);
    const PrimaryIcon = workflowInfo.primaryCTA.icon;
    
    return (
      <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleViewCandidate(candidate.id)}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg font-semibold" style={{fontFamily: 'Sora'}}>
                {candidate.name}
              </CardTitle>
              <p className="text-sm text-gray-600">{candidate.pronouns}</p>
            </div>
            <Badge className={`${
              workflowInfo.statusBadge.variant === 'success' ? 'bg-green-100 text-green-800 border-green-200' :
              workflowInfo.statusBadge.variant === 'default' ? 'bg-blue-100 text-blue-800 border-blue-200' :
              workflowInfo.statusBadge.variant === 'secondary' ? 'bg-gray-100 text-gray-800 border-gray-200' :
              workflowInfo.statusBadge.variant === 'hired' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
              'bg-gray-100 text-gray-800 border-gray-200'
            } text-xs`}>
              {workflowInfo.statusBadge.text}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Match Score */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-bold" style={{color: '#E2007A'}}>{candidate.matchScore}%</span>
            <span className="text-sm text-gray-600">Overall Match</span>
          </div>

          {/* Pollen Team Insights */}
          <div className="bg-pink-50 rounded-lg p-3 mb-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 text-pink-600">⭐</div>
              <span className="text-sm font-medium text-gray-800">Pollen Team Insights</span>
            </div>
            <p className="text-xs text-gray-700 line-clamp-3">
              {candidate.pollenTeamInsights || `${candidate.name.split(' ')[0]} brings natural collaborative energy and genuine care to collaborative environments. Having coordinated successful projects involving teams...`}
            </p>
          </div>

          {/* Notice requirement */}
          <div className="flex items-center gap-2 mb-3 text-xs text-gray-600">
            <Clock className="w-3 h-3" />
            <span>1 month notice required</span>
          </div>

          {/* Status section - matching job-candidate-matches exactly */}
          <div className="bg-blue-50 rounded-lg p-3 mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <div className="flex-1">
                <div className="text-sm font-medium text-blue-800">
                  {getSubStatusDescription(candidate.status)}
                </div>
                <div className="text-xs text-blue-600">Sub status</div>
              </div>
            </div>
          </div>

          {/* Action Buttons - exact design matching job-candidate-matches */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white" style={{ backgroundColor: '#E2007A', fontFamily: 'Sora' }}>
                P
              </div>
              <div className="text-xs text-gray-500">
                Applied {new Date(candidate.appliedDate).toLocaleDateString()}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={workflowInfo.primaryCTA.variant === 'employer_action' ? 'default' : 'outline'}
                className={`text-xs ${
                  workflowInfo.primaryCTA.variant === 'employer_action' 
                    ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCTAAction(workflowInfo.primaryCTA.action, candidate.id);
                }}
              >
                <PrimaryIcon className="w-3 h-3 mr-1" />
                {workflowInfo.primaryCTA.text}
              </Button>
              
              {/* Secondary actions - Export Profile button */}
              {workflowInfo.secondaryActions.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs border-gray-300 text-gray-600 hover:bg-gray-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle PDF download
                    console.log('Downloading PDF for candidate:', candidate.id);
                  }}
                >
                  <FileSpreadsheet className="w-3 h-3 mr-1" />
                  Export
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const TableRow = ({ candidate }: { candidate: CandidateWithJob }) => {
    const workflowInfo = getCandidateWorkflowInfo(candidate);
    const PrimaryIcon = workflowInfo.primaryCTA.icon;
    
    return (
      <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => handleViewCandidate(candidate.id)}>
        <td className="px-6 py-4">
          <div>
            <p className="font-medium">{candidate.name}</p>
            <p className="text-sm text-gray-500">{candidate.pronouns}</p>
          </div>
        </td>
        <td className="px-6 py-4">
          <div>
            <p className="font-medium">{candidate.jobTitle}</p>
            <p className="text-sm text-gray-500">{candidate.jobDepartment}</p>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="space-y-1">
            <Badge className={`${
              workflowInfo.statusBadge.variant === 'success' ? 'bg-green-100 text-green-800 border-green-200' :
              workflowInfo.statusBadge.variant === 'default' ? 'bg-blue-100 text-blue-800 border-blue-200' :
              workflowInfo.statusBadge.variant === 'secondary' ? 'bg-gray-100 text-gray-800 border-gray-200' :
              workflowInfo.statusBadge.variant === 'hired' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
              'bg-gray-100 text-gray-800 border-gray-200'
            } text-xs`}>
              {workflowInfo.statusBadge.text}
            </Badge>
            <div className="text-xs text-blue-600">
              {getSubStatusDescription(candidate.status)}
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span>{candidate.matchScore}%</span>
          </div>
        </td>
        <td className="px-6 py-4">{candidate.location}</td>
        <td className="px-6 py-4">
          <div className="flex flex-wrap gap-1">
            {candidate.keyStrengths.slice(0, 2).map((strength, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {strength}
              </Badge>
            ))}
            {candidate.keyStrengths.length > 2 && (
              <span className="text-xs text-gray-500">+{candidate.keyStrengths.length - 2}</span>
            )}
          </div>
        </td>
        <td className="px-6 py-4 text-sm text-gray-500">
          {new Date(candidate.appliedDate).toLocaleDateString()}
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <Button
              className={`px-3 py-1.5 text-xs ${
                workflowInfo.primaryCTA.variant === 'employer_action' 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : workflowInfo.primaryCTA.variant === 'outline' 
                  ? 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  : 'bg-gray-900 hover:bg-gray-800 text-white'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleCTAAction(workflowInfo.primaryCTA.action, candidate.id);
              }}
            >
              <PrimaryIcon className="w-3 h-3 mr-1" />
              {workflowInfo.primaryCTA.text}
            </Button>
            
            {/* Secondary actions */}
            {workflowInfo.secondaryActions.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="px-2"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle secondary actions - placeholder for now
                }}
              >
                <MoreHorizontal className="w-3 h-3" />
              </Button>
            )}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900" style={{fontFamily: 'Sora'}}>
              All Applicants
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and review applicants across all your job postings
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => setLocation('/comprehensive-job-posting')}
              className="bg-pink-600 hover:bg-pink-700 text-white"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Post New Job
            </Button>
            <Button variant="outline" size="sm">
              <FileDown className="w-4 h-4 mr-2" />
              Export
            </Button>
            <div className="flex items-center gap-1 bg-white rounded-lg border p-1">
              <Button
                variant={viewMode === "card" ? "default" : "ghost"}
                size="sm"
                className="px-3"
                onClick={() => setViewMode("card")}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                className="px-3"
                onClick={() => setViewMode("table")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    placeholder="Search applicants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={selectedJob} onValueChange={setSelectedJob}>
                <SelectTrigger>
                  <SelectValue placeholder="All Jobs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jobs</SelectItem>
                  {mockJobs.map(job => (
                    <SelectItem key={job.id} value={job.id.toString()}>
                      {job.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="reviewing">Reviewing</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
                  <SelectItem value="rejected">Not Selected</SelectItem>
                  <SelectItem value="offered">Offer Extended</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="appliedDate">Application Date</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="matchScore">Match Score</SelectItem>
                  <SelectItem value="challengeScore">Challenge Score</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Showing {filteredApplicants.length} of {mockApplicants.length} applicants
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {mockApplicants.length} Total
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {mockApplicants.filter(a => a.status === 'new').length} New
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {mockApplicants.filter(a => a.status === 'interview_scheduled').length} Interviews
            </span>
          </div>
        </div>

        {/* Content */}
        {viewMode === "card" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApplicants.map(candidate => (
              <CandidateCard key={candidate.id} candidate={candidate} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Candidate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Position
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Match
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Key Strengths
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applied
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredApplicants.map(candidate => (
                      <TableRow key={candidate.id} candidate={candidate} />
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {filteredApplicants.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applicants found</h3>
              <p className="text-gray-500">
                Try adjusting your filters or search terms to find applicants.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}