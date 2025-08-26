import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { 
  ArrowLeft, FileText, Download, MessageSquare, Calendar, 
  User, Mail, MapPin, Clock, CheckCircle, Award, 
  Target, Users, Briefcase, Heart, Star, TrendingUp,
  ChevronDown, ChevronRight, ExternalLink, Phone, AlertCircle
} from "lucide-react";

// Mock data for candidate
const mockCandidate: CandidateDetail = {
  id: 123,
  name: "Emma Davis",
  firstName: "Emma",
  lastName: "Davis",
  email: "emma.davis@example.com",
  location: "Manchester, UK",
  profileImageUrl: "https://randomuser.me/api/portraits/women/23.jpg",
  matchScore: 92,
  status: "shortlisted",
  challengeScore: 87,
  appliedDate: "2025-07-15T14:30:00Z",
  availability: "Available immediately",
  behavioralType: "Social Butterfly",
  behavioralSummary: "Enthusiastic team player with excellent communication skills and creative problem-solving abilities.",
  discProfile: {
    red: 25,
    yellow: 68,
    green: 42,
    blue: 35
  },
  personalStory: {
    perfectJob: "A role that allows me to collaborate with diverse teams, exercise creativity, and make a meaningful impact on projects while constantly learning and growing.",
    friendDescriptions: ["Energetic", "Supportive", "Resourceful", "Persuasive", "Optimistic"],
    teacherDescriptions: ["Creative", "Talkative", "Engaging", "Enthusiastic"],
    happyActivities: [
      "Collaborating with a team on creative projects",
      "Presenting ideas and getting immediate feedback",
      "Helping others solve problems or learn new skills",
      "Working in a fast-paced, dynamic environment"
    ],
    frustrations: [
      "Repetitive tasks with little variety",
      "Isolated work with minimal team interaction",
      "Rigid processes that limit creativity"
    ],
    proudMoments: [
      "Led a student marketing campaign that increased event attendance by 45%",
      "Created an innovative approach to customer feedback that was adopted company-wide",
      "Mediated a team conflict that resulted in improved collaboration"
    ]
  },
  interests: {
    roleTypes: ["Marketing", "Customer Experience", "Creative Design", "Project Management"],
    industries: ["Technology", "Education", "Sustainability", "Media"],
    courseInterests: ["Digital Marketing", "Design Thinking", "Communication"]
  },
  keyStrengths: [
    {
      title: "Relationship Building",
      description: "Naturally connects with people and builds rapport quickly, making her excellent at establishing positive client and team relationships.",
      color: "pink"
    },
    {
      title: "Persuasive Communication",
      description: "Articulates ideas clearly and convincingly, with an ability to adapt communication style to different audiences.",
      color: "purple"
    },
    {
      title: "Creative Problem Solving",
      description: "Approaches challenges with innovative thinking and generates unique solutions by connecting seemingly unrelated ideas.",
      color: "blue"
    },
    {
      title: "Team Motivation",
      description: "Inspires enthusiasm in teammates and creates positive energy that helps teams overcome obstacles.",
      color: "amber"
    }
  ],
  proactivityScore: "8.5",
  assessmentCompleted: true,
  visaStatus: "UK Citizen - Full right to work",
  interviewSupport: "Standard interview preparation and feedback provided",
  pollenAssessment: {
    overallAssessment: "Emma demonstrates exceptional communication skills and creative thinking. She connects naturally with others and brings positive energy to teams. Her enthusiasm for learning new things and ability to adapt quickly make her well-suited for dynamic roles requiring interpersonal skills. She may benefit from developing more structured approaches to task management and detail orientation.",
    interviewPerformance: {
      overallScore: 88,
      communicationRapport: "Excellent",
      roleUnderstanding: "Very Good",
      valuesAlignment: "Strong",
      notes: "Emma showed great enthusiasm and connected well during the interview. She articulated her experiences clearly and asked thoughtful questions about the role and company culture. Her natural communication skills were evident, and she demonstrated good understanding of how her strengths would contribute to the position."
    }
  },
  skillsAssessment: {
    overallScore: 84,
    assessments: [
      {
        name: "Digital Marketing",
        score: 91,
        description: "Exceptional understanding of social media platforms, content strategy, and audience engagement tactics with practical implementation experience."
      },
      {
        name: "Customer Experience Design",
        score: 85,
        description: "Strong grasp of customer journey mapping and experience optimization with evidence of applying these concepts in previous projects."
      },
      {
        name: "Project Coordination",
        score: 78,
        description: "Good foundation in project management principles with some experience in coordinating team activities and tracking deliverables."
      },
      {
        name: "Data Analysis",
        score: 72,
        description: "Basic understanding of analytics tools and data interpretation, with room for growth in applying insights to strategic planning."
      }
    ]
  },
  workExperience: [
    {
      role: "Marketing Assistant",
      company: "CreativeMinds Agency",
      duration: "Jan 2024 - Present",
      description: "Assisted with social media campaigns, created content for various platforms, and supported the team with client presentations and reporting."
    },
    {
      role: "Customer Experience Intern",
      company: "TechSolutions Ltd",
      duration: "Summer 2023",
      description: "Analyzed customer feedback, suggested improvements to customer journey, and assisted with implementing changes to the onboarding process."
    }
  ],
  references: [
    {
      name: "Dr. Sarah Johnson",
      title: "Marketing Professor, Manchester University",
      email: "s.johnson@manchester.edu",
      testimonial: "Emma was one of the most engaged students I've taught. She consistently demonstrated creativity in her projects and had a natural ability to lead group discussions and team projects. Her enthusiasm was contagious."
    },
    {
      name: "Michael Thompson",
      title: "Marketing Director, CreativeMinds Agency",
      email: "m.thompson@creativeminds.com",
      testimonial: "Emma quickly became an invaluable team member during her time with us. Her ability to connect with clients and understand their needs, combined with her creative approach to problem-solving, allowed her to make significant contributions despite being early in her career."
    }
  ]
};

// Types for the candidate data structure - Updated to match new API
interface CandidateDetail {
  behavioralSummary: string;
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  profileImageUrl: string | null;
  matchScore: number;
  status: string;
  challengeScore?: number;
  appliedDate: string;
  availability?: string;
  behavioralType?: string;
  discProfile?: { red: number; yellow: number; green: number; blue: number };
  personalStory?: {
    perfectJob?: string;
    friendDescriptions?: string[];
    teacherDescriptions?: string[];
    happyActivities?: string[];
    frustrations?: string[];
    proudMoments?: string[];
  };
  interests?: {
    roleTypes?: string[];
    industries?: string[];
    courseInterests?: string[];
  };
  keyStrengths?: Array<{
    title: string;
    description: string;
    color: string;
  }>;
  proactivityScore?: string;
  assessmentCompleted?: boolean;
  visaStatus?: string;
  interviewSupport?: string;
  pollenAssessment?: {
    overallAssessment?: string;
    interviewPerformance?: {
      overallScore: number;
      communicationRapport: string;
      roleUnderstanding: string;
      valuesAlignment: string;
      notes: string;
    };
  };
  skillsAssessment?: {
    overallScore: number;
    assessments: Array<{
      name: string;
      score: number;
      description: string;
    }>;
  };
  workExperience?: Array<{
    role: string;
    company: string;
    duration: string;
    description: string;
  }>;
  references?: Array<{
    name: string;
    title: string;
    email: string;
    testimonial: string;
  }>;
}

export default function AdminCandidateProfile() {
  const { candidateId } = useParams<{ candidateId: string }>();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("pollen-insights");
  const [expandedSkills, setExpandedSkills] = useState<Record<string, boolean>>({});
  const [scoresApproved, setScoresApproved] = useState(true); // Set to true to display skills scores

  // Use the mock candidate data
  const candidate: CandidateDetail = mockCandidate;
  
  // Dynamic stage checking functions
  const hasPollenInterview = (candidate: CandidateDetail) => {
    return candidate?.pollenAssessment?.overallAssessment || candidate?.pollenAssessment?.interviewPerformance;
  };

  const hasSkillsAssessment = (candidate: CandidateDetail) => {
    return candidate?.skillsAssessment && candidate.skillsAssessment.assessments.length > 0;
  };

  // Dynamic tab determination based on candidate status
  const getAvailableTabs = () => {
    const tabs = [];
    
    // Always show Pollen Team Insights tab (will show empty state if no interview)
    tabs.push("pollen-insights");
    
    // Always show Profile tab
    tabs.push("profile");
    
    // Always show Skills tab (will show empty state if no assessment)
    tabs.push("skills");
    
    return tabs;
  };

  const toggleSkillExpansion = (skillName: string) => {
    setExpandedSkills(prev => ({
      ...prev,
      [skillName]: !prev[skillName]
    }));
  };


  const availableTabs = getAvailableTabs();
  
  // Ensure current active tab is available
  if (!availableTabs.includes(activeTab)) {
    setActiveTab(availableTabs[0]);
  }

  return (
    <div className="min-h-screen bg-gray-50 admin-compact-mode">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => setLocation('/admin/job-applicants-grid/1')}
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Candidates
              </Button>
              <div className="flex items-center gap-3">
                {candidate.profileImageUrl ? (
                  <img 
                    src={candidate.profileImageUrl}
                    alt={candidate.name}
                    className="w-12 h-12 rounded-full border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-400" />
                  </div>
                )}
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{candidate.name}</h1>
                  <p className="text-sm text-gray-600">Marketing Assistant at BrightTech Solutions</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
                Match Score: {candidate.matchScore}%
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setLocation(`/admin/candidate-profile/${candidate.id}/actions`)}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Actions & History
              </Button>
              <Button variant="outline" size="sm">
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Message
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Interview
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Condensed Basic Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-gray-600" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-gray-900">{candidate.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-gray-900">{candidate.location}</span>
              </div>
              {candidate.availability && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-900">{candidate.availability}</span>
                </div>
              )}
              {candidate.visaStatus && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-900">{candidate.visaStatus}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Content - Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pollen-insights" disabled={!availableTabs.includes("pollen-insights")}>
              Pollen Team Insights
            </TabsTrigger>
            <TabsTrigger value="profile" disabled={!availableTabs.includes("profile")}>
              Profile
            </TabsTrigger>
            <TabsTrigger value="skills" disabled={!availableTabs.includes("skills")}>
              Skills
            </TabsTrigger>
          </TabsList>

          {/* Pollen Team Insights Tab */}
          <TabsContent value="pollen-insights" className="space-y-6">
            {hasPollenInterview(candidate) ? (
              <>
                {candidate.pollenAssessment?.overallAssessment && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-pink-600" />
                        Pollen Team Assessment
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-700 leading-relaxed">{candidate.pollenAssessment.overallAssessment}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Pollen Team Interview Performance - Detailed */}
                {candidate.pollenAssessment?.interviewPerformance && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-pink-600" />
                        Pollen Team Interview Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Overall Score */}
                      <div className="text-center">
                        <div className="text-3xl font-bold text-gray-900 mb-1">
                          {candidate.pollenAssessment.interviewPerformance.overallScore}/100
                        </div>
                        <p className="text-sm text-gray-600">Overall Score</p>
                      </div>

                      {/* Individual Scores Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Communication</span>
                            <span className="text-sm font-medium">Rapport</span>
                          </div>
                          <div className="text-lg font-semibold text-green-600">
                            {candidate.pollenAssessment.interviewPerformance.communicationRapport}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Values Alignment</span>
                            <span className="text-sm font-medium"></span>
                          </div>
                          <div className="text-lg font-semibold text-green-600">
                            {candidate.pollenAssessment.interviewPerformance.valuesAlignment}
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Role Understanding</span>
                            <span className="text-sm font-medium"></span>
                          </div>
                          <div className="text-lg font-semibold text-green-600">
                            {candidate.pollenAssessment.interviewPerformance.roleUnderstanding}
                          </div>
                        </div>
                      </div>

                      {/* Notes */}
                      {candidate.pollenAssessment.interviewPerformance.notes && (
                        <div>
                          <h4 className="font-medium text-sm text-gray-900 mb-2">Notes</h4>
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                            {candidate.pollenAssessment.interviewPerformance.notes}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Pollen Interview Yet</h3>
                  <p className="text-gray-600 mb-4">
                    This candidate hasn't had a Pollen interview yet, so there are no team insights available.
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setLocation(`/admin/candidate-action-timeline/${candidateId}`)}
                    className="bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Full History & Timeline
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Comprehensive Behavioral Profile */}
              {candidate.behavioralType && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-600" />
                      Behavioral Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Behavioral Headline & Type */}
                    <div>
                      <Badge className="mb-3 bg-blue-100 text-blue-800 border-blue-200 text-base px-3 py-1">
                        {candidate.behavioralType}
                      </Badge>
                      <p className="text-sm text-gray-700 font-medium mb-2">
                        {candidate.behavioralSummary || "Comprehensive behavioral assessment completed - detailed insights available"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {candidate.pollenAssessment?.overallAssessment?.split('.').slice(0, 3).join('.') + '.' || 'Comprehensive behavioral assessment completed - detailed insights from Pollen team interview available.'}
                      </p>
                    </div>

                    {/* DISC Profile */}
                    {candidate.discProfile && (
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm text-gray-900">DISC Profile</h4>
                        <p className="text-xs text-gray-600 mb-3">
                          {candidate.behavioralType === "Results Dynamo" ? "Direct and results-driven" :
                           candidate.behavioralType === "Quality Guardian" ? "Careful and analytical" :
                           candidate.behavioralType === "Reliable Foundation" ? "Steady and supportive" :
                           candidate.behavioralType === "Social Butterfly" ? "Enthusiastic and people-focused" :
                           "Balanced behavioral approach"}
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-red-600 font-medium">Dominance</span>
                              <span className="text-xs font-bold">{candidate.discProfile.red}%</span>
                            </div>
                            <Progress value={candidate.discProfile.red} className="h-2" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-yellow-600 font-medium">Influence</span>
                              <span className="text-xs font-bold">{candidate.discProfile.yellow}%</span>
                            </div>
                            <Progress value={candidate.discProfile.yellow} className="h-2" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-green-600 font-medium">Steadiness</span>
                              <span className="text-xs font-bold">{candidate.discProfile.green}%</span>
                            </div>
                            <Progress value={candidate.discProfile.green} className="h-2" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-blue-600 font-medium">Conscientiousness</span>
                              <span className="text-xs font-bold">{candidate.discProfile.blue}%</span>
                            </div>
                            <Progress value={candidate.discProfile.blue} className="h-2" />
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Key Strengths */}
              {candidate.keyStrengths && candidate.keyStrengths.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-amber-600" />
                      Key Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {candidate.keyStrengths.map((strength, index) => (
                        <div key={index} className="border-l-4 border-pink-200 pl-4">
                          <h4 className="font-medium text-sm text-gray-900 mb-1">{strength.title}</h4>
                          <p className="text-sm text-gray-600">{strength.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* How They Work */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-purple-600" />
                    How They Work
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-2">Communication Style</h4>
                      <p className="text-sm text-gray-600">
                        {candidate.behavioralType === "Results Dynamo" ? 
                          "Direct and assertive communicator who prefers clear, action-oriented conversations. Values efficiency and gets straight to the point." :
                         candidate.behavioralType === "Quality Guardian" ?
                          "Thoughtful and precise communicator who values accuracy and detail. Prefers structured discussions with clear documentation." :
                         candidate.behavioralType === "Reliable Foundation" ?
                          "Collaborative and supportive communicator who listens actively and builds consensus. Values harmony and team input." :
                         candidate.behavioralType === "Social Butterfly" ?
                          "Enthusiastic and engaging communicator who energizes conversations. Values personal connections and interactive dialogue." :
                         "Adaptable communication style that adjusts to team and situational needs."}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-2">Decision Making</h4>
                      <p className="text-sm text-gray-600">
                        {candidate.behavioralType === "Results Dynamo" ? 
                          "Makes quick, decisive choices based on results and outcomes. Comfortable with calculated risks and rapid implementation." :
                         candidate.behavioralType === "Quality Guardian" ?
                          "Takes time to analyze all available data before making careful, well-researched decisions. Values accuracy over speed." :
                         candidate.behavioralType === "Reliable Foundation" ?
                          "Seeks input from team members and considers impact on relationships. Prefers consensus-building and collaborative choices." :
                         candidate.behavioralType === "Social Butterfly" ?
                          "Makes decisions quickly but considers people impact. Values team input and maintains optimistic outlook on outcomes." :
                         "Balanced decision-making approach that considers multiple factors and stakeholder input."}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-2">Career Motivators</h4>
                      <div className="flex flex-wrap gap-2">
                        {candidate.behavioralType === "Results Dynamo" ? 
                          ["Achievement", "Competition", "Leadership", "Challenge"].map((motivator, index) => (
                            <Badge key={index} variant="outline" className="text-xs">{motivator}</Badge>
                          )) :
                         candidate.behavioralType === "Quality Guardian" ?
                          ["Excellence", "Expertise", "Quality", "Analysis"].map((motivator, index) => (
                            <Badge key={index} variant="outline" className="text-xs">{motivator}</Badge>
                          )) :
                         candidate.behavioralType === "Reliable Foundation" ?
                          ["Stability", "Collaboration", "Support", "Harmony"].map((motivator, index) => (
                            <Badge key={index} variant="outline" className="text-xs">{motivator}</Badge>
                          )) :
                         candidate.behavioralType === "Social Butterfly" ?
                          ["Connection", "Recognition", "Variety", "Innovation"].map((motivator, index) => (
                            <Badge key={index} variant="outline" className="text-xs">{motivator}</Badge>
                          )) :
                         ["Growth", "Impact", "Learning", "Purpose"].map((motivator, index) => (
                           <Badge key={index} variant="outline" className="text-xs">{motivator}</Badge>
                         ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-2">Work Style Strengths</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {candidate.behavioralType === "Results Dynamo" ? 
                          ["Drives projects to completion", "Thrives under pressure", "Natural problem-solver", "Competitive edge"].map((strength, index) => (
                            <li key={index}>• {strength}</li>
                          )) :
                         candidate.behavioralType === "Quality Guardian" ?
                          ["Attention to detail", "Systematic approach", "Quality assurance", "Risk management"].map((strength, index) => (
                            <li key={index}>• {strength}</li>
                          )) :
                         candidate.behavioralType === "Reliable Foundation" ?
                          ["Team support", "Consistent delivery", "Patient guidance", "Conflict resolution"].map((strength, index) => (
                            <li key={index}>• {strength}</li>
                          )) :
                         candidate.behavioralType === "Social Butterfly" ?
                          ["Team motivation", "Creative thinking", "Networking skills", "Adaptability"].map((strength, index) => (
                            <li key={index}>• {strength}</li>
                          )) :
                         ["Balanced approach", "Adaptability", "Collaborative mindset", "Continuous learning"].map((strength, index) => (
                           <li key={index}>• {strength}</li>
                         ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Personal Insights */}
            {candidate.personalStory && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-pink-600" />
                    Personal Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {candidate.personalStory.perfectJob && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-1">Perfect Job Is</h4>
                      <p className="text-sm text-gray-600">{candidate.personalStory.perfectJob}</p>
                    </div>
                  )}

                  {candidate.personalStory.happyActivities && candidate.personalStory.happyActivities.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-1">Most Happy When</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {candidate.personalStory.happyActivities.map((activity: string, index: number) => (
                          <li key={index}>• {activity}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {candidate.personalStory.friendDescriptions && candidate.personalStory.friendDescriptions.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-2">Described by Friends As</h4>
                      <div className="flex flex-wrap gap-2">
                        {candidate.personalStory.friendDescriptions.map((description: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                            {description}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {candidate.personalStory.teacherDescriptions && candidate.personalStory.teacherDescriptions.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-2">Described by Teachers As</h4>
                      <div className="flex flex-wrap gap-2">
                        {candidate.personalStory.teacherDescriptions.map((description: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs bg-green-50 text-green-700">
                            {description}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {candidate.personalStory.proudMoments && candidate.personalStory.proudMoments.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-1">Most Proud Of</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {candidate.personalStory.proudMoments.map((moment: string, index: number) => (
                          <li key={index}>• {moment}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {candidate.interests?.roleTypes && candidate.interests.roleTypes.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-2">Interested in Roles In</h4>
                      <div className="flex flex-wrap gap-2">
                        {candidate.interests.roleTypes.map((role: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs bg-purple-50 text-purple-700">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {candidate.interests?.industries && candidate.interests.industries.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-2">Industry Interests</h4>
                      <div className="flex flex-wrap gap-2">
                        {candidate.interests.industries.map((industry: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs bg-amber-50 text-amber-700">
                            {industry}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* References */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-indigo-600" />
                  References
                </CardTitle>
              </CardHeader>
              <CardContent>
                {candidate.references && candidate.references.length > 0 ? (
                  <div className="space-y-6">
                    {candidate.references.map((reference: any, index: number) => (
                      <div key={index}>
                        <div className="flex items-start gap-3 mb-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{reference.name}</h4>
                            <p className="text-sm text-gray-600 mb-1">{reference.title}</p>
                            <p className="text-sm text-gray-500">{reference.email}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">Academic Supervisor</Badge>
                        </div>
                        {reference.testimonial && (
                          <blockquote className="bg-gray-50 p-3 rounded-lg border-l-4 border-indigo-200">
                            <p className="text-sm text-gray-700 italic">"{reference.testimonial}"</p>
                          </blockquote>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">References available upon request</p>
                )}
              </CardContent>
            </Card>

            {/* Important Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  Important Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium text-sm text-gray-900 mb-1">Visa Requirements</h4>
                  <p className="text-sm text-gray-600">
                    {candidate.visaStatus || "UK Right to Work - No visa sponsorship required"}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm text-gray-900 mb-1">Interview Support</h4>
                  <p className="text-sm text-gray-600">
                    {candidate.interviewSupport ? candidate.interviewSupport : 
                     "Standard interview preparation and feedback provided. Additional support available if needed."}
                  </p>
                </div>


              </CardContent>
            </Card>


          </TabsContent>

          {/* Skills Tab - Dynamic visibility based on assessment completion */}
          <TabsContent value="skills" className="space-y-6">
            {candidate.skillsAssessment && scoresApproved ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-600" />
                      Overall Skills Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {candidate.skillsAssessment.overallScore}%
                      </div>
                      <Progress value={candidate.skillsAssessment.overallScore} className="h-3 mb-2" />
                      <p className="text-sm text-gray-600">
                        Based on {candidate.skillsAssessment.assessments.length} skill assessments
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {candidate.proactivityScore && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-purple-600" />
                        Proactivity Score
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600 mb-2">
                          {candidate.proactivityScore}/10
                        </div>
                        <Progress value={parseFloat(candidate.proactivityScore) * 10} className="h-3 mb-2" />
                        <p className="text-sm text-gray-600">Community engagement and initiative</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {/* Skills Assessments */}
                {candidate.skillsAssessment?.assessments && candidate.skillsAssessment.assessments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                    Skills Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {candidate.skillsAssessment.assessments.map((assessment, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{assessment.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {assessment.score}%
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{assessment.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Skills Assessment Pending</h3>
                  <p className="text-gray-600 mb-4">
                    {candidate.status === "new" ? 
                      "Assessment scores are pending admin approval." : 
                      "Skills assessment has not been completed yet."}
                  </p>
                  {candidate.status === "new" && (
                    <Button variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      Awaiting Assessment Review
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}