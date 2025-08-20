import React, { useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight,
  ChevronDown,
  MessageCircle,
  Download,
  Calendar,
  CheckCircle,
  Clock,
  Mail,
  FileText,
  MapPin,
  Globe,
  Star,
  Award,
  Brain,
  Heart,
  Briefcase,
  Users,
  TrendingUp,
  Target,
  AlertCircle,
  Eye,
  Info,
  X
} from 'lucide-react';

interface CandidateDetail {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  profileImageUrl?: string;
  matchScore: number;
  status: string;
  challengeScore: number;
  appliedDate: string;
  availability: string;
  behavioralType: string;
  discProfile: {
    red: number;
    yellow: number;
    green: number;
    blue: number;
  };
  personalStory: any;
  interests: any;
  pollenAssessment: any;
  skillsData: any;
  skillsAssessment: any;
  workExperience: any[];
  proactivityScore: number;
  assessmentCompleted: boolean;
  keyStrengths?: Array<{
    title: string;
    description: string;
  }>;
}

// Helper function to get behavioral emoji
const getBehavioralEmoji = (behavioralType: string): string => {
  const emojiMap: Record<string, string> = {
    "Results Dynamo": "🎯",
    "Social Butterfly": "🦋",
    "Reliable Foundation": "🏗️",
    "Quality Guardian": "🔍",
    "Ambitious Influencer": "🌟",
    "Strategic Driver": "🥷",
    "Steady Achiever": "📊",
    "Dynamic Leader": "⚡",
    "Supportive Connector": "🤝",
    "Thoughtful Communicator": "💭",
    "Determined Helper": "💪",
    "Collaborative Facilitator": "🌱",
    "Steady Organiser": "📋",
    "Analytical Coordinator": "🔬",
    "Careful Collaborator": "🛡️",
    "Adaptable All-Rounder": "🦎"
  };
  
  return emojiMap[behavioralType] || "🧠";
};

// Helper functions for behavioral type descriptions
const getBehavioralSummary = (type: string): string => {
  const summaries: Record<string, string> = {
    "Results Dynamo": "Fast-paced achiever who drives results and embraces challenges with determination.",
    "Social Butterfly": "Natural communicator who builds strong relationships and energises teams.",
    "Reliable Foundation": "Steady and dependable professional who provides stability and consistent support.",
    "Quality Guardian": "Systematic and precise professional who maintains high standards and accuracy.",
    "Ambitious Influencer": "Results-driven leader who combines achievement focus with people influence.",
    "Strategic Driver": "Systematic achiever who combines results focus with analytical planning.",
    "Steady Achiever": "Reliable performer who combines achievement drive with consistent delivery.",
    "Dynamic Leader": "Energetic leader who combines people skills with results drive.",
    "Supportive Connector": "Relationship builder who combines people focus with reliable stability.",
    "Thoughtful Communicator": "Analytical communicator who combines people skills with systematic thinking.",
    "Determined Helper": "Supportive achiever who combines helping others with results orientation.",
    "Collaborative Facilitator": "Team builder who combines stability with enthusiastic people focus.",
    "Steady Organiser": "Reliable coordinator who combines stability with systematic organization.",
    "Analytical Driver": "Strategic performer who combines systematic analysis with results drive.",
    "Creative Analyst": "Innovative thinker who combines analytical depth with people creativity.",
    "Thorough Planner": "Systematic coordinator who combines analytical precision with reliable stability.",
    "Energetic Motivator": "Dynamic performer who combines results drive with people energy.",
    "Decisive Strategist": "Strategic leader who combines results focus with analytical thinking.",
    "People-Focused Coordinator": "Relationship-centered organizer who combines people skills with stability.",
    "Careful Collaborator": "Thoughtful team player who combines stability with quality focus.",
    "Versatile Team Player": "Adaptable professional balanced across multiple dimensions with team focus.",
    "Dynamic Problem Solver": "Multi-dimensional performer with balanced results, people, and analytical capabilities.",
    "Thoughtful Facilitator": "Balanced facilitator with people focus, stability, and quality orientation.",
    "Balanced Professional": "Multi-faceted professional with balanced capabilities across results, stability, and quality.",
    "Adaptable All-Rounder": "Versatile professional with equal strengths across all behavioral dimensions."
  };
  return summaries[type] || "Adaptable professional with well-rounded capabilities across multiple dimensions.";
};

const getBehavioralDescription = (type: string, firstName: string): string => {
  const descriptions: Record<string, string> = {
    "Social Butterfly": `${firstName} brings natural collaborative energy and enthusiasm to work, thriving in team environments where communication and relationships are valued. She excels in roles that involve building connections, motivating others, and creating positive team dynamics. Her engaging communication style makes her particularly effective at facilitating collaboration and maintaining team morale.`,
    "Results Dynamo": `${firstName} demonstrates strong drive and determination, focusing on achieving results and overcoming challenges. She thrives in fast-paced environments where quick decisions and decisive action are valued. Her competitive nature and results orientation make her effective at driving projects forward and meeting ambitious targets.`,
    "Reliable Foundation": `${firstName} provides steady, consistent support in team environments, building trust through reliability and patience. She excels in roles that require stability, careful planning, and supportive collaboration. Her steady approach and focus on team harmony make her particularly effective at maintaining consistent progress and supporting others' success.`,
    "Quality Guardian": `${firstName} brings systematic precision and analytical thinking to her work, ensuring high standards and accuracy in all deliverables. She thrives in environments that value careful analysis, methodical approaches, and quality outcomes. Her attention to detail and systematic mindset make her particularly effective at maintaining standards and optimizing processes.`,
    "Supportive Connector": `${firstName} combines natural people skills with reliable stability, building strong relationships while providing consistent support. She excels in collaborative environments where both relationship building and dependable delivery are valued. Her combination of enthusiasm and steadiness makes her effective at maintaining team connections while ensuring consistent progress.`,
    "People-Focused Coordinator": `${firstName} brings together strong people skills with reliable coordination abilities, focusing on team harmony and stable progress. She thrives in environments where relationship building and organized collaboration are valued. Her balanced approach to people and processes makes her effective at facilitating team success while maintaining steady momentum.`
  };
  return descriptions[type] || `${firstName} demonstrates exceptional creative problem-solving abilities with a natural talent for engaging people in innovative solutions. Her collaborative approach combined with strategic thinking makes her an ideal candidate for dynamic environments where creativity meets meaningful impact.`;
};

export default function CandidateDetailView() {
  const { id } = useParams<{ id: string }>();
  const [location, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('insights');

  // Parse URL parameters
  const searchParams = new URLSearchParams(window.location.search);
  const jobFilter = searchParams.get('job') || 'all';
  const statusFilter = searchParams.get('status') || 'all';
  const fromPage = searchParams.get('from') || 'candidates';

  // Fetch candidate details
  const { data: candidateData, isLoading: loading, error } = useQuery({
    queryKey: ['/api/candidates', id],
    queryFn: async () => {
      if (!id) throw new Error('No candidate ID provided');
      const response = await fetch(`/api/candidates/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch candidate: ${response.status}`);
      }
      return response.json();
    },
    enabled: !!id
  });

  // Fetch all candidates for navigation
  const { data: allCandidates } = useQuery({
    queryKey: ['/api/all-candidates']
  });

  // Get current candidate index for navigation
  const getCurrentCandidateIndex = () => {
    if (!allCandidates || !Array.isArray(allCandidates) || !id) return -1;
    return allCandidates.findIndex((c: any) => c.id === parseInt(id));
  };

  // Navigate to previous/next candidate
  const navigateToCandidate = (direction: 'prev' | 'next') => {
    if (!allCandidates || !Array.isArray(allCandidates)) return;
    
    const currentIndex = getCurrentCandidateIndex();
    const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex >= 0 && newIndex < allCandidates.length) {
      const newCandidate = allCandidates[newIndex];
      const params = new URLSearchParams();
      if (jobFilter !== 'all') params.set('job', jobFilter);
      if (statusFilter !== 'all') params.set('status', statusFilter);
      params.set('from', fromPage);
      
      setLocation(`/candidates/${newCandidate.id}?${params.toString()}`);
    }
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

  // Get personalized sub-status descriptive copy
  const getPersonalizedSubStatusDescription = (status: string, firstName: string) => {
    const name = firstName || 'this candidate';
    switch (status) {
      case 'new':
      case 'new_application':
        return `it's time to review ${name}'s profile`;
      case 'interview_scheduled':
        return `your interview with ${name} is booked in`;
      case 'interview_complete':
      case 'interview_completed':
        return `it's time to provide ${name} with feedback following your interview`;
      case 'reviewing':
      case 'in_progress':
        return `you're up to date, awaiting ${name} for update`;
      case 'complete':
      case 'job_offered':
        return `thanks for providing feedback on ${name}`;
      case 'hired':
        return `you found your match with ${name}!`;
      default:
        return `it's time to review ${name}'s profile`;
    }
  };

  // Dynamic action based on status - keeping detailed CTAs while simplifying main status
  const getCandidateActionInfo = (status: string) => {
    switch(status) {
      case 'new_application':
      case 'new':
        return { text: 'Schedule Interview', color: 'bg-green-600 hover:bg-green-700', icon: Calendar };
      case 'interview_scheduled':
        return { text: 'View Interview Details', color: 'bg-blue-600 hover:bg-blue-700', icon: Calendar };
      case 'interview_completed':
      case 'interview_complete':
        return { text: 'Provide Update', color: 'bg-orange-600 hover:bg-orange-700', icon: CheckCircle };
      case 'in_progress':
        return { text: 'Awaiting Candidate', color: 'bg-orange-600 hover:bg-orange-700', icon: Clock };
      case 'complete':
        return { text: 'View Details', color: 'bg-gray-600 hover:bg-gray-700', icon: Eye };
      case 'job_offered':
        return { text: 'Monitor Offer', color: 'bg-green-600 hover:bg-green-700', icon: Mail };
      case 'hired':
        return { text: 'View Details', color: 'bg-emerald-600 hover:bg-emerald-700', icon: Eye };
      default:
        return { text: 'Schedule Interview', color: 'bg-green-600 hover:bg-green-700', icon: Calendar };
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'new_application':
      case 'new':
        return <Badge className="bg-green-100 text-green-800">New</Badge>;
      case 'interview_scheduled':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'interview_completed':
      case 'interview_complete':
        return <Badge className="bg-orange-100 text-orange-800">In Progress</Badge>;
      case 'in_progress':
        return <Badge className="bg-orange-100 text-orange-800">In Progress</Badge>;
      case 'complete':
        return <Badge className="bg-gray-100 text-gray-800">Complete</Badge>;
      case 'job_offered':
        return <Badge className="bg-gray-100 text-gray-800">Complete</Badge>;
      case 'hired':
        return <Badge className="bg-emerald-100 text-emerald-800">Hired</Badge>;
      default:
        return <Badge className="bg-green-100 text-green-800">New</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading candidate profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Candidate fetch error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Candidate Not Found</h1>
          <p className="text-gray-600 mb-4">Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
          <p className="text-gray-600 mb-4">Candidate ID: {id}</p>
          <Button onClick={() => setLocation(`/candidates`)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Candidates
          </Button>
        </div>
      </div>
    );
  }

  if (!candidateData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Candidate Not Found</h1>
          <p className="text-gray-600 mb-4">The requested candidate profile could not be loaded.</p>
          <p className="text-gray-600 mb-4">Candidate ID: {id}</p>
          <Button onClick={() => setLocation(`/candidates`)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Candidates
          </Button>
        </div>
      </div>
    );
  }

  const candidate = candidateData as CandidateDetail;
  const actionInfo = getCandidateActionInfo(candidate.status || 'new');
  const ActionIcon = actionInfo.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Breadcrumb and Back */}
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  const params = new URLSearchParams();
                  if (jobFilter !== 'all') params.set('job', jobFilter);
                  if (statusFilter !== 'all') params.set('status', statusFilter);
                  setLocation(`/candidates?${params.toString()}`);
                }}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Candidates
              </Button>
              
              <div className="text-sm text-gray-500">
                Dashboard &gt; Candidates &gt; {candidate.name}
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateToCandidate('prev')}
                disabled={getCurrentCandidateIndex() <= 0}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <span className="text-sm text-gray-600 px-3">
                {getCurrentCandidateIndex() + 1} of {Array.isArray(allCandidates) ? allCandidates.length : 0}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateToCandidate('next')}
                disabled={getCurrentCandidateIndex() >= (Array.isArray(allCandidates) ? allCandidates.length : 0) - 1}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Card */}
        <Card className="mb-8">
          <CardContent className="p-6">
            {/* Top Row - Name, Status, Action Buttons */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="w-20 h-20 bg-pink-600 rounded-full flex items-center justify-center text-white text-2xl font-bold" style={{fontFamily: 'Sora'}}>
                  P
                </div>
                
                {/* Basic Info */}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{candidate.name}</h1>
                    {getStatusBadge(candidate.status || 'new')}
                  </div>
                  
                  <div className="flex items-center gap-4 text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {candidate.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {candidate.availability}
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Eligible to work in UK
                    </div>
                  </div>
                  
                  {/* Match Score */}
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-lg font-semibold text-gray-900">
                      {candidate.matchScore}% Match
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-start gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    // Navigate to employer messages with correct conversation mapping
                    const candidateMessageMapping: Record<number, string> = {
                      20: '1', // Sarah Chen
                      21: '2', // James Mitchell
                      22: '3', // Emma Thompson
                      23: '4', // Priya Singh
                      24: '5', // Michael Roberts
                      25: '6'  // Alex Johnson
                    };
                    const conversationId = candidateMessageMapping[candidate.id] || '1';
                    setLocation(`/employer-messages?conversation=${conversationId}`);
                  }}
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Message
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => window.open(`/api/candidate-profile-pdf/${candidate.id}`, '_blank')}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  PDF Export
                </Button>
                
                <Button
                  className={actionInfo.color}
                  onClick={() => {
                    console.log(`🚀 Action for candidate ${candidate.id}: ${actionInfo.text}`);
                    
                    // Handle status-specific actions
                    const status = candidate.status || 'new';
                    
                    switch(status) {
                      case 'new_application':
                      case 'new':
                        // Navigate to availability submission
                        setLocation(`/candidate-next-steps/${candidate.id}`);
                        break;
                      case 'interview_scheduled':
                        // Navigate to interview details/calendar
                        setLocation(`/candidate-next-steps/${candidate.id}`);
                        break;
                      case 'interview_completed':
                      case 'interview_complete':
                        // Navigate to feedback/update page
                        setLocation(`/provide-update/${candidate.id}`);
                        break;
                      case 'in_progress':
                        // Navigate to candidate status/communication page
                        setLocation(`/candidate-status/${candidate.id}`);
                        break;
                      case 'complete':
                      case 'hired':
                        // Stay on current page or navigate to detailed status view
                        setLocation(`/candidate-status/${candidate.id}`);
                        break;
                      case 'job_offered':
                        // Navigate to offer monitoring page
                        setLocation(`/candidate-status/${candidate.id}`);
                        break;
                      default:
                        // Default to availability submission
                        setLocation(`/candidate-next-steps/${candidate.id}`);
                        break;
                    }
                  }}
                >
                  <ActionIcon className="w-4 h-4 mr-2" />
                  {actionInfo.text}
                </Button>
              </div>
            </div>
            
            {/* Sub-status Description Row - properly positioned */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <div className="text-sm font-medium text-blue-800">
                  {getPersonalizedSubStatusDescription(candidate.status || 'new', candidate.firstName)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="insights">Pollen Insights</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>

          {/* Pollen Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            {/* Pollen Team Assessment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Pollen Team Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed" style={{fontFamily: 'Poppins'}}>
                  {candidate.pollenAssessment?.overallAssessment?.replace(/They/g, candidate.firstName || 'They').replace(/they/g, 'they') || 
                    `${candidate.firstName} is thoughtful, capable and ready to make an impact. They've completed their studies with a focus on practical application and collaborative problem-solving. They're excited by the opportunity to join a team where they can contribute their skills while continuing to grow professionally. With experience in project coordination and team collaboration, they bring both reliability and fresh perspective. ${candidate.firstName}'s genuine interest in meaningful work shines through, and they're keen to support initiatives that create positive impact. They're adaptable, eager to learn, and ready to get started.`
                  }
                </p>
              </CardContent>
            </Card>

            {/* Pollen Team Interview Performance */}
            {candidate.pollenAssessment?.interviewPerformance && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Pollen Team Interview Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6 mb-4">
                    <div>
                      <span className="text-sm text-gray-500">Overall Score</span>
                      <div className="text-2xl font-bold text-gray-900">
                        {candidate.pollenAssessment.interviewPerformance.overallScore}/100
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Communication Rapport</span>
                      <div className="text-lg font-semibold text-green-600">
                        {candidate.pollenAssessment.interviewPerformance.communicationRapport}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Role Understanding</span>
                      <div className="text-lg font-semibold text-green-600">
                        {candidate.pollenAssessment.interviewPerformance.roleUnderstanding}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Values Alignment</span>
                      <div className="text-lg font-semibold text-green-600">
                        {candidate.pollenAssessment.interviewPerformance.valuesAlignment}
                      </div>
                    </div>
                  </div>
                  {candidate.pollenAssessment.interviewPerformance.notes && (
                    <div className="pt-4 border-t">
                      <h4 className="font-medium text-gray-700 mb-2">Notes</h4>
                      <p className="text-gray-600">{candidate.pollenAssessment.interviewPerformance.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Important Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Important Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <div>
                      <span className="font-medium text-gray-700">Visa Status:</span>
                      <span className="text-gray-600 ml-2">Eligible to work in UK</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="w-4 h-4 text-gray-500 mt-1" />
                    <div>
                      <span className="font-medium text-gray-700">Interview Support:</span>
                      <div className="mt-1 text-gray-600">
                        {candidate.id === 23 ? ( // Priya Singh - ADHD example
                          <p>Would benefit from receiving interview questions in advance to allow for preparation time. This helps manage ADHD symptoms and ensures she can demonstrate her full potential during the interview.</p>
                        ) : candidate.id === 20 ? ( // Sarah Chen - anxiety support
                          <p>Prefers a structured interview format with clear expectations outlined beforehand. Benefits from knowing the interview panel composition and general topics to be covered.</p>
                        ) : candidate.id === 21 ? ( // James Mitchell - autism spectrum
                          <p>Works best with a quiet interview environment and advance notice of any changes to the scheduled format. Appreciates clear, direct questions and time to process responses.</p>
                        ) : candidate.id === 22 ? ( // Emma Thompson - dyslexia
                          <p>Benefits from having key information provided in multiple formats and extra time for written components if applicable. Performs best in verbal discussions about her experience.</p>
                        ) : candidate.id === 24 ? ( // Michael Roberts - migraines
                          <p>Requests flexibility around interview timing due to occasional migraines. Prefers morning interviews when symptoms are typically better managed.</p>
                        ) : (
                          <p>No specific adjustments requested. Standard interview process appropriate.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            {/* Behavioral Profile & Work Style */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Behavioral Profile & Work Style
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Behavioral Headline */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="text-2xl">{getBehavioralEmoji(candidate.behavioralType)}</span>
                    The {candidate.behavioralType}
                  </h3>
                  <p className="text-lg text-gray-700 mb-4">
                    {getBehavioralSummary(candidate.behavioralType)}
                  </p>
                  
                  {/* Behavioral Description */}
                  <p className="text-gray-600 leading-relaxed">
                    {getBehavioralDescription(candidate.behavioralType, candidate.name.split(' ')[0])}
                  </p>
                </div>

                {/* DISC Breakdown */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <h4 className="font-semibold text-gray-900">DISC Assessment</h4>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="p-1 h-6 w-6 rounded-full hover:bg-gray-100">
                          <Info className="w-4 h-4 text-gray-500" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-bold text-gray-900">
                            DISC Profile Breakdown
                          </DialogTitle>
                          <p className="text-gray-600 text-sm mt-1">
                            Understanding your behavioural dimensions and work style preferences
                          </p>
                        </DialogHeader>
                        <div className="space-y-4">
                          {/* Dominance Section */}
                          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
                            <div className="flex items-start gap-3 mb-3">
                              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">●</span>
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-red-600 mb-1">Dominance (Red)</h3>
                                <p className="text-red-700 font-medium mb-2">Direct, results-focused, competitive</p>
                                <ul className="space-y-1 text-sm text-red-700">
                                  <li>• Quick decision-making</li>
                                  <li>• Goal-oriented approach</li>
                                  <li>• Takes charge in situations</li>
                                  <li>• Values efficiency and results</li>
                                </ul>
                              </div>
                            </div>
                          </div>

                          {/* Influence Section */}
                          <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4">
                            <div className="flex items-start gap-3 mb-3">
                              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">●</span>
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-yellow-600 mb-1">Influence (Yellow)</h3>
                                <p className="text-yellow-700 font-medium mb-2">Outgoing, enthusiastic, persuasive</p>
                                <ul className="space-y-1 text-sm text-yellow-700">
                                  <li>• People-focused communication</li>
                                  <li>• Optimistic and energetic</li>
                                  <li>• Builds relationships easily</li>
                                  <li>• Motivates and inspires others</li>
                                </ul>
                              </div>
                            </div>
                          </div>

                          {/* Steadiness Section */}
                          <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
                            <div className="flex items-start gap-3 mb-3">
                              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">●</span>
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-green-600 mb-1">Steadiness (Green)</h3>
                                <p className="text-green-700 font-medium mb-2">Patient, reliable, team-oriented</p>
                                <ul className="space-y-1 text-sm text-green-700">
                                  <li>• Consistent and dependable</li>
                                  <li>• Values harmony and stability</li>
                                  <li>• Supports team collaboration</li>
                                  <li>• Prefers gradual change</li>
                                </ul>
                              </div>
                            </div>
                          </div>

                          {/* Conscientiousness Section */}
                          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
                            <div className="flex items-start gap-3 mb-3">
                              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">●</span>
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-blue-600 mb-1">Conscientiousness (Blue)</h3>
                                <p className="text-blue-700 font-medium mb-2">Analytical, precise, quality-focused</p>
                                <ul className="space-y-1 text-sm text-blue-700">
                                  <li>• Detail-oriented approach</li>
                                  <li>• Values accuracy and quality</li>
                                  <li>• Systematic problem-solving</li>
                                  <li>• Follows established procedures</li>
                                </ul>
                              </div>
                            </div>
                          </div>

                          {/* How to Read Section */}
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">How to Read This Profile</h4>
                            <p className="text-sm text-gray-700 mb-2">
                              Each dimension is scored as a percentage (0-100%). Higher percentages indicate stronger natural tendencies in that area.
                            </p>
                            <ul className="text-sm text-gray-700 space-y-1">
                              <li>• <strong>High scores (60%+):</strong> Dominant traits that strongly influence behavior</li>
                              <li>• <strong>Moderate scores (40-60%):</strong> Present but not defining characteristics</li>
                              <li>• <strong>Lower scores (&lt;40%):</strong> Less natural, may require more energy to display</li>
                            </ul>
                            <p className="text-sm text-gray-600 mt-3 italic">
                              Most people show a combination of traits, with 1-2 dimensions being more prominent in their natural work style.
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-red-50 rounded">
                      <div className="text-2xl font-bold text-red-600 mb-1">
                        {Math.round(candidate.discProfile.red)}%
                      </div>
                      <div className="text-sm text-gray-600">Dominant</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded">
                      <div className="text-2xl font-bold text-yellow-600 mb-1">
                        {Math.round(candidate.discProfile.yellow)}%
                      </div>
                      <div className="text-sm text-gray-600">Influencing</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        {Math.round(candidate.discProfile.green)}%
                      </div>
                      <div className="text-sm text-gray-600">Steady</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {Math.round(candidate.discProfile.blue)}%
                      </div>
                      <div className="text-sm text-gray-600">Conscientious</div>
                    </div>
                  </div>
                  <p className="text-center text-sm text-gray-600 italic">
                    {candidate.discProfile.yellow > 40 ? "Enthusiastic and people-focused" : 
                     candidate.discProfile.green > 40 ? "Steady and supportive" :
                     candidate.discProfile.red > 40 ? "Direct and results-driven" :
                     candidate.discProfile.blue > 40 ? "Analytical and detail-oriented" :
                     "Balanced across all dimensions"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* How They Work */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  How They Work
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Communication Style</h4>
                  <p className="text-gray-700">Enthusiastic and engaging, with ability to champion ideas while contributing original perspectives</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Decision Making</h4>
                  <p className="text-gray-700">Collaborative approach with focus on creative solutions that engage stakeholders</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Career Motivators</h4>
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Creative problem-solving opportunities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Collaborative team environments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Meaningful impact through work</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Continuous learning and development</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Work Style Strengths</h4>
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Exceptional creative problem-solving</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Strong collaborative skills</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Strategic campaign thinking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Innovative engagement approaches</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Personal Insights */}
            {candidate.personalStory && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Personal Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                  {candidate.personalStory.perfectJob && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Perfect Job Is...</h4>
                      <p className="text-gray-700">{candidate.personalStory.perfectJob}</p>
                    </div>
                  )}
                  {candidate.personalStory.happyActivities && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Most Happy When...</h4>
                      <p className="text-gray-700">{candidate.personalStory.happyActivities.join(", ")}</p>
                    </div>
                  )}
                  <div className="md:col-span-2">
                    <h4 className="font-semibold text-gray-900 mb-3">Described As</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      {candidate.personalStory.friendDescriptions && (
                        <div>
                          <h5 className="font-medium text-gray-700 mb-2">...by Friends</h5>
                          <div className="flex flex-wrap gap-2">
                            {candidate.personalStory.friendDescriptions.map((desc: string, index: number) => (
                              <Badge key={index} variant="secondary">{desc}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {candidate.personalStory.teacherDescriptions && (
                        <div>
                          <h5 className="font-medium text-gray-700 mb-2">...by Teachers</h5>
                          <div className="flex flex-wrap gap-2">
                            {candidate.personalStory.teacherDescriptions.map((desc: string, index: number) => (
                              <Badge key={index} variant="secondary">{desc}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {candidate.personalStory.proudMoments && (
                    <div className="md:col-span-2">
                      <h4 className="font-semibold text-gray-900 mb-2">Most Proud Of...</h4>
                      <ul className="space-y-2">
                        {candidate.personalStory.proudMoments.map((moment: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{moment}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {candidate.interests?.roleTypes && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Interested in Roles in</h4>
                      <div className="flex flex-wrap gap-2">
                        {candidate.interests.roleTypes.map((role: string, index: number) => (
                          <Badge key={index} variant="outline">{role}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {candidate.interests?.industries && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Industry Interests</h4>
                      <div className="flex flex-wrap gap-2">
                        {candidate.interests.industries.map((industry: string, index: number) => (
                          <Badge key={index} variant="outline">{industry}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Key Strengths */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Key Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {candidate.keyStrengths?.map((strength: any, index: number) => (
                    <div key={index} className={`border-l-4 border-${strength.color}-400 pl-4`}>
                      <h4 className="font-semibold text-gray-900 mb-2">{strength.title}</h4>
                      <p className="text-sm text-gray-700">{strength.description}</p>
                    </div>
                  )) || (
                    // Fallback content if no keyStrengths from database
                    <>
                      <div className="border-l-4 border-blue-400 pl-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Quality & Precision Focus</h4>
                        <p className="text-sm text-gray-700">She combines attention to detail with high standards. This makes her excellent at delivering accurate, well-researched work that meets exact specifications.</p>
                      </div>
                      <div className="border-l-4 border-purple-400 pl-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Independent Problem Solver</h4>
                        <p className="text-sm text-gray-700">She works well autonomously and can systematically break down complex challenges. Her analytical approach helps her find efficient solutions to difficult problems.</p>
                      </div>
                      <div className="border-l-4 border-blue-400 pl-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Systematic Organiser</h4>
                        <p className="text-sm text-gray-700">She excels at creating structure and processes that improve efficiency. Her methodical approach ensures nothing falls through the cracks.</p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Community & Engagement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Community & Engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Proactivity Score</h4>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-pink-600 mb-2">
                      {candidate.proactivityScore || 0}
                    </div>
                    <p className="text-sm text-gray-600">Overall engagement and initiative score</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-semibold text-gray-900 mb-3">Community Achievements</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="text-lg font-semibold text-gray-900">2</div>
                      <div className="text-sm text-gray-600">Events Attended</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="text-lg font-semibold text-gray-900">3</div>
                      <div className="text-sm text-gray-600">Masterclasses</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="text-lg font-semibold text-gray-900">8</div>
                      <div className="text-sm text-gray-600">Contributions</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <div className="text-lg font-semibold text-gray-900">Active</div>
                      <div className="text-sm text-gray-600">Member Tier</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* References */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  References
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">Dr. Emily Watson</h4>
                    <span className="text-sm text-gray-500">Academic Supervisor</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Marketing Lecturer, University of London</p>
                  <p className="text-sm text-gray-500 mb-3">emily.watson@london.ac.uk</p>
                  <blockquote className="border-l-4 border-gray-300 pl-4 italic text-sm text-gray-600">
                    "Sarah consistently demonstrated exceptional collaborative skills and creative thinking throughout her studies. Her ability to bring people together while maintaining focus on deliverables made her a natural team leader in group projects."
                  </blockquote>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-6">
            {/* Skills Assessment Scores */}
            {candidate.skillsAssessment && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Skills Assessment Scores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-semibold text-gray-900">Overall Score</span>
                      <span className="text-2xl font-bold text-green-600">{candidate.skillsAssessment.overallScore}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-green-600 h-3 rounded-full" 
                        style={{ width: `${candidate.skillsAssessment.overallScore}%` }}
                      ></div>
                    </div>
                  </div>

                  {candidate.skillsAssessment.assessments && (
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Assessment Breakdown</h4>
                      {candidate.skillsAssessment.assessments.map((assessment: any, index: number) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-medium text-gray-900">{assessment.name}</h5>
                            <span className="text-lg font-semibold text-blue-600">{assessment.score}/100</span>
                          </div>
                          {assessment.description && (
                            <p className="text-sm text-gray-600 mb-2">{assessment.description}</p>
                          )}
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${assessment.score}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Assessment Submission */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Assessment Submission
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Why did you apply for this role? */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Why did you apply for this role?</h4>
                  <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                    <p className="text-sm text-gray-700 mb-2"><strong>{candidate.firstName}'s Response:</strong></p>
                    <p className="text-sm text-gray-600">
                      I'm really excited about this Digital Marketing Assistant position because it combines my passion for creative content with my interest in data-driven marketing. 
                      I've been following your company on social media and love how you showcase real customer stories. I'm particularly drawn to the opportunity to work on campaigns that make a 
                      genuine impact, and I believe my fresh perspective and enthusiasm for learning would be valuable to your team.
                    </p>
                  </div>
                </div>

                {/* Creative Campaign Challenge */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Creative Campaign Challenge</h4>
                  <p className="text-sm text-gray-600 mb-3"><strong>Question:</strong> Design a social media campaign for a sustainable fashion brand targeting 18-25 year olds.</p>
                  <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                    <p className="text-sm text-gray-700 mb-2"><strong>{candidate.firstName}'s Response:</strong></p>
                    <p className="text-sm text-gray-600 mb-3">
                      I would create a campaign called "Style Sustainably" featuring user-generated content showcasing how young people style sustainable pieces. The campaign 
                      would include Instagram Stories with styling tips, TikTok challenges for outfit transformations, and partnerships with eco-conscious influencers. Key messaging would focus on 
                      "fashion that feels good and does good" with clear calls-to-action linking to the brand's sustainability credentials and shopping page.
                    </p>
                    <Button variant="outline" size="sm" className="text-xs">
                      <ChevronDown className="w-3 h-3 mr-1" />
                      Show Full Campaign Details
                    </Button>
                  </div>
                </div>

                {/* Data Analysis Challenge */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Data Analysis Challenge</h4>
                  <p className="text-sm text-gray-600 mb-3"><strong>Question:</strong> Analyse the attached customer data and provide 3 key insights with recommendations.</p>
                  <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                    <p className="text-sm text-gray-700 mb-2"><strong>{candidate.firstName}'s Response:</strong></p>
                    <p className="text-sm text-gray-600 mb-3">
                      Based on the data analysis: 1) 68% of customers are repeat buyers, suggesting strong brand loyalty - recommend implementing a loyalty programme to further 
                      incentivise retention. 2) Peak purchase times are 7-9pm on weekdays - suggest scheduling marketing campaigns and stock releases during these windows. 3) Cart abandonment 
                      rate is 45% higher on mobile - recommend optimising mobile checkout flow and implementing abandoned cart email sequences.
                    </p>
                    <div className="flex items-center gap-2 mt-3 p-2 bg-gray-100 rounded">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-600">customer-analysis-pivot-tables.xlsx (847 KB)</span>
                      <Button variant="ghost" size="sm" className="text-xs ml-auto">Download</Button>
                    </div>
                  </div>
                </div>

                {/* Written Communication Assessment */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Written Communication Assessment</h4>
                  <p className="text-sm text-gray-600 mb-3"><strong>Question:</strong> Write a professional email to a client explaining a campaign delay and proposing next steps.</p>
                  <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                    <p className="text-sm text-gray-700 mb-2"><strong>{candidate.firstName}'s Response:</strong></p>
                    <div className="text-sm text-gray-600 space-y-2">
                      <p><strong>Subject:</strong> Update on Your Marketing Campaign Launch</p>
                      <p>Dear [Client Name],</p>
                      <p>I hope this email finds you well. I wanted to reach out regarding your upcoming campaign launch, which was scheduled for next Monday.</p>
                      <p>Due to some technical challenges with the new platform integration, we need to push the launch back by one week to ensure everything runs smoothly. I understand this may impact your timeline, and I sincerely apologise for any inconvenience.</p>
                      <p>Here's what we're doing to move forward: 1) Our tech team is working around the clock to resolve the integration issues. 2) We'll use this extra time to further optimise your campaign materials. 3) I'll provide daily updates on our progress.</p>
                      <p>Please let me know if you'd like to discuss this further. I'm committed to delivering the best possible results for your campaign.</p>
                      <p>Best regards,<br/>{candidate.firstName} {candidate.lastName}</p>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs mt-3">
                      <ChevronDown className="w-3 h-3 mr-1" />
                      Hide Full Submission
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Submission Status</h4>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-700">Assessment completed and verified</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Submitted: December 15, 2024</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}