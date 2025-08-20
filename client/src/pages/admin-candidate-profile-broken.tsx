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

// Extended behavioral descriptions for candidate profiles
const getBehavioralDescription = (type: string, firstName: string): string => {
  const descriptions: Record<string, string> = {
    "Supportive Connector": `${firstName} combines natural people skills with reliable stability, building strong relationships while providing consistent support. She excels in collaborative environments where both relationship building and dependable delivery are valued. Her combination of enthusiasm and steadiness makes her effective at maintaining team connections while ensuring consistent progress.`
  };
  
  return descriptions[type] || `${firstName} demonstrates a balanced approach to work, combining multiple strengths effectively in professional environments.`;
};

export default function AdminCandidateProfile() {
  const { candidateId } = useParams<{ candidateId: string }>();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("pollen-insights");
  const [expandedSkills, setExpandedSkills] = useState<Record<string, boolean>>({});

  // Fetch candidate data from database
  const { data: candidate, isLoading, error } = useQuery<CandidateDetail>({
    queryKey: [`/api/admin/candidates/${candidateId}`],
  });
      profileImageUrl: candidateId === "21" 
        ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
        : candidateId === "30" 
        ? "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
        : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      matchScore: candidateId === "21" ? 92 : candidateId === "30" ? 87 : 85,
      status: candidateId === "21" ? "new" : candidateId === "30" ? "in_progress" : "complete",
      challengeScore: candidateId === "21" ? 88 : candidateId === "30" ? 85 : 82,
      appliedDate: candidateId === "21" ? "2025-01-15" : candidateId === "30" ? "2025-01-14" : "2025-01-13",
      availability: "Available immediately",
      behavioralType: candidateId === "21" ? "Supportive Connector" : candidateId === "30" ? "Results Dynamo" : "Reliable Foundation",
      behavioralSummary: candidateId === "21" 
        ? "Natural relationship builder who combines people skills with reliable support"
        : candidateId === "30" 
        ? "Fast-paced achiever who drives results and embraces challenges with determination"
        : "Steady and dependable professional who provides stability and consistent support",
      communicationStyle: candidateId === "21" 
        ? "Warm and collaborative, builds rapport easily, prefers face-to-face interaction"
        : candidateId === "30" 
        ? "Direct and confident, results-focused, comfortable with fast-paced communication"
        : "Thoughtful and thorough, prefers structured communication, detail-oriented",
      decisionMaking: candidateId === "21" 
        ? "Considers team impact, seeks input from others, values consensus"
        : candidateId === "30" 
        ? "Quick and decisive, relies on data and instinct, takes calculated risks"
        : "Methodical and careful, analyzes all options, prefers proven approaches",
      careerMotivators: candidateId === "21" 
        ? ["Building meaningful relationships", "Making a positive impact", "Learning and development", "Team collaboration"]
        : candidateId === "30" 
        ? ["Achieving ambitious goals", "Professional advancement", "Performance recognition", "Leadership opportunities"]
        : ["Job security", "Work-life balance", "Clear processes", "Quality outcomes"],
      workStyle: candidateId === "21" 
        ? "Collaborative and supportive, thrives in team environments, adaptable to change"
        : candidateId === "30" 
        ? "Independent and driven, prefers autonomy, comfortable with pressure and deadlines"
        : "Systematic and organized, prefers structure, values consistency and quality",
      discProfile: candidateId === "21" 
        ? { red: 25, yellow: 35, green: 65, blue: 40 }
        : candidateId === "30" 
        ? { red: 70, yellow: 45, green: 30, blue: 25 }
        : { red: 20, yellow: 25, green: 70, blue: 55 },
      discSummary: candidateId === "21" 
        ? "High Steadiness with good Influence - excels at building relationships while providing consistent support"
        : candidateId === "30" 
        ? "High Dominance with strong Influence - natural leader who drives results while engaging others"
        : "High Steadiness and Compliance - reliable team player with attention to detail and quality",
      personalStory: {
        background: candidateId === "21" 
          ? "Recent graduate with a passion for connecting people and creating meaningful digital experiences. Strong background in social media management and community building."
          : candidateId === "30" 
          ? "Ambitious marketer with experience in data-driven campaigns and creative content creation. Proven track record of exceeding targets."
          : "Methodical and detail-oriented professional with experience in project coordination and team support.",
        interests: candidateId === "21" 
          ? ["Community building", "Social impact", "Digital storytelling", "Team collaboration"]
          : candidateId === "30" 
          ? ["Growth marketing", "Analytics", "Creative strategy", "Performance optimization"]
          : ["Process improvement", "Team efficiency", "Quality assurance", "Workflow optimization"]
      },
      personalInsights: {
        perfectJob: candidateId === "21" 
          ? "A role where I can help build communities and support others while learning new skills"
          : candidateId === "30" 
          ? "A fast-paced environment where I can drive meaningful results and advance quickly"
          : "A stable position with clear processes where I can contribute to quality outcomes",
        mostHappy: candidateId === "21" 
          ? "When collaborating with others on projects that make a real difference"
          : candidateId === "30" 
          ? "When achieving challenging goals and seeing measurable impact from my work"
          : "When completing detailed work accurately and supporting my team's success",
        describedByTeachers: candidateId === "21" 
          ? "Empathetic, reliable, and always willing to help classmates"
          : candidateId === "30" 
          ? "Determined, competitive, and natural leader in group projects"
          : "Thorough, dependable, and consistently produces high-quality work",
        describedByFriends: candidateId === "21" 
          ? "Loyal, supportive, and the person everyone turns to for advice"
          : candidateId === "30" 
          ? "Driven, inspiring, and always up for new challenges and adventures"
          : "Patient, thoughtful, and the most organized person they know",
        mostProudOf: candidateId === "21" 
          ? "Organizing university charity events that raised over £5,000 for local causes"
          : candidateId === "30" 
          ? "Leading a marketing campaign that increased engagement by 150% at previous internship"
          : "Developing a system that improved team efficiency by 30% in my part-time role",
        interestedInRoles: candidateId === "21" 
          ? ["Marketing Coordinator", "Community Manager", "Social Media Specialist", "Customer Success"]
          : candidateId === "30" 
          ? ["Marketing Manager", "Growth Specialist", "Digital Marketing Lead", "Campaign Manager"]
          : ["Operations Coordinator", "Project Administrator", "Marketing Assistant", "Data Analyst"],
        industryInterests: candidateId === "21" 
          ? ["Non-profit", "Education", "Sustainable brands", "Healthcare", "Community services"]
          : candidateId === "30" 
          ? ["Technology", "E-commerce", "Fintech", "SaaS", "Scale-ups"]
          : ["Professional services", "Finance", "Healthcare", "Government", "Education"]
      },
      interests: candidateId === "21" 
        ? ["Photography", "Volunteering", "Hiking", "Cooking"]
        : candidateId === "30" 
        ? ["Rock climbing", "Data visualization", "Podcasts", "Travel"]
        : ["Reading", "Chess", "Gardening", "Board games"],
      keyStrengths: candidateId === "21" 
        ? [
            "Natural relationship builder who creates authentic connections",
            "Reliable team player who consistently delivers on commitments", 
            "Adaptable communicator who adjusts style to different audiences",
            "Empathetic problem-solver who considers multiple perspectives"
          ]
        : candidateId === "30" 
        ? [
            "Results-driven achiever who consistently exceeds targets",
            "Confident decision-maker who thrives under pressure",
            "Strategic thinker who identifies growth opportunities",
            "Resilient professional who learns quickly from setbacks"
          ]
        : [
            "Methodical planner who ensures quality and accuracy",
            "Dependable team member who provides consistent support",
            "Detail-oriented analyst who spots potential issues early",
            "Patient collaborator who helps others succeed"
          ],
      proactivityScore: candidateId === "21" ? 85 : candidateId === "30" ? 92 : 78,
      communityAchievements: candidateId === "21" 
        ? ["Active in university marketing society", "Organized 3 charity fundraising events", "Mentored 5 first-year students"]
        : candidateId === "30" 
        ? ["Led university business competition team", "Completed Google Digital Marketing certification", "Volunteered for startup weekend"]
        : ["Participated in university project management club", "Completed data analysis online course", "Helped organize community events"],
      joinedPollen: candidateId === "21" ? "December 2024" : candidateId === "30" ? "January 2025" : "November 2024",
      references: [
        {
          name: candidateId === "21" ? "Dr. Sarah Johnson" : candidateId === "30" ? "Mark Thompson" : "Lisa Williams",
          relationship: candidateId === "21" ? "University Tutor" : candidateId === "30" ? "Internship Supervisor" : "Part-time Manager",
          contact: candidateId === "21" ? "s.johnson@university.ac.uk" : candidateId === "30" ? "mark.thompson@company.com" : "lisa.williams@retailer.co.uk"
        },
        {
          name: candidateId === "21" ? "Tom Wilson" : candidateId === "30" ? "Rachel Green" : "David Smith",
          relationship: candidateId === "21" ? "Charity Event Coordinator" : candidateId === "30" ? "Marketing Team Lead" : "Team Leader",
          contact: candidateId === "21" ? "tom.wilson@charity.org" : candidateId === "30" ? "rachel.green@agency.com" : "david.smith@company.co.uk"
        }
      ],
      pollenAssessment: candidateId === "30" ? null : {
        summary: candidateId === "21" 
          ? "James brings a wonderful balance of enthusiasm and empathy to his work. His natural ability to connect with others, combined with his genuine interest in social media and digital marketing, makes him an ideal candidate for this role. He approaches challenges with optimism and shows great potential for growth in a supportive environment."
          : "Alex shows remarkable consistency and attention to detail. His methodical approach and collaborative nature make him an excellent team player who can be relied upon to deliver quality work. He brings stability and thoughtful perspectives to any team.",
        interviewer: "Holly, Pollen Team",
        interviewScore: candidateId === "21" ? 4.2 : 4.1,
        confidence: candidateId === "21" ? 4 : 4,
        companyResearch: candidateId === "21" ? 4 : 4,
        questionQuality: candidateId === "21" ? 4 : 4,
        overallImpression: candidateId === "21" ? 5 : 4
      },
      skillsData: {
        overallScore: candidateId === "21" ? 88 : candidateId === "30" ? 91 : 82,
        categories: [
          {
            name: "Digital Marketing",
            score: candidateId === "21" ? 85 : candidateId === "30" ? 92 : 80,
            details: "Strong understanding of social media platforms, content creation, and basic analytics"
          },
          {
            name: "Communication", 
            score: candidateId === "21" ? 95 : candidateId === "30" ? 88 : 85,
            details: "Excellent written and verbal communication skills, adaptable to different audiences"
          },
          {
            name: "Project Management",
            score: candidateId === "21" ? 82 : candidateId === "30" ? 90 : 88,
            details: "Good organisational skills with ability to manage multiple tasks and deadlines"
          }
        ]
      },
      skillsAssessment: {
        submissions: [
          {
            challenge: "Social Media Strategy",
            score: candidateId === "21" ? 88 : candidateId === "30" ? 92 : 85,
            feedback: "Comprehensive approach with good understanding of target audience analysis"
          },
          {
            challenge: "Content Creation",
            score: candidateId === "21" ? 85 : candidateId === "30" ? 89 : 78,
            feedback: "Creative ideas with practical implementation strategies"
          }
        ]
      },
      workExperience: [
        {
          title: candidateId === "21" ? "Social Media Intern" : candidateId === "30" ? "Marketing Assistant" : "Administrative Assistant",
          company: candidateId === "21" ? "Local Charity" : candidateId === "30" ? "Digital Agency" : "Professional Services Firm",
          duration: candidateId === "21" ? "6 months" : candidateId === "30" ? "12 months" : "18 months",
          description: candidateId === "21" 
            ? "Managed social media accounts, created engaging content, and helped coordinate community events"
            : candidateId === "30" 
            ? "Supported marketing campaigns, conducted market research, and managed client communications"
            : "Coordinated projects, managed schedules, and provided administrative support to senior team"
        }
      ],
      proactivityScore: candidateId === "21" ? 7.8 : candidateId === "30" ? 8.2 : 7.5,
      assessmentCompleted: candidateId === "21" ? true : candidateId === "30" ? false : true,
      keyStrengths: candidateId === "21" 
        ? [
            { title: "Relationship Building", description: "Natural ability to connect with people and build meaningful relationships" },
            { title: "Empathetic Communication", description: "Communicates with genuine care and understanding of others' perspectives" },
            { title: "Team Collaboration", description: "Thrives in collaborative environments and supports team success" }
          ]
        : candidateId === "30" 
        ? [] // Emma hasn't had behavioral assessment yet
        : [
            { title: "Attention to Detail", description: "Meticulous approach ensuring accuracy and quality in all deliverables" },
            { title: "Process Improvement", description: "Identifies opportunities to enhance efficiency and streamline workflows" },
            { title: "Reliable Support", description: "Consistently dependable team member who provides steady support" }
          ]
    }
  });

  // Dynamic stage checking functions
  const hasPollenInterview = (candidate: CandidateDetail) => {
    return candidate.status === 'interview_complete' ||
           candidate.pollenAssessment?.interviewPerformance ||
           candidate.pollenAssessment?.interviewer ||
           candidate.pollenAssessment !== null;
  };

  const hasApprovedSkills = (candidate: CandidateDetail) => {
    return candidate.status === 'complete' || 
           candidate.status === 'hired' ||
           candidate.assessmentCompleted;
  };

  // Helper function to determine which tabs should be available
  const getAvailableTabs = (candidate: CandidateDetail) => {
    const tabs = [];
    
    // Profile tab is always available
    tabs.push({ id: 'profile', label: 'Profile' });
    
    // Pollen Team Insights only available after interview or if status indicates completion
    if (hasPollenInterview(candidate) || candidate.status === 'in_progress' || candidate.status === 'complete' || candidate.status === 'hired') {
      tabs.unshift({ id: 'pollen-insights', label: 'Pollen Team Insights' });
    }
    
    // Skills tab only available after assessment completion
    if (candidate.assessmentCompleted || candidate.status === 'complete' || candidate.status === 'hired') {
      tabs.push({ id: 'skills', label: 'Skills' });
    }
    
    return tabs;
  };

  const availableTabs = candidate ? getAvailableTabs(candidate) : [{ id: 'profile', label: 'Profile' }];
  
  // Auto-select first available tab if current active tab is not available
  React.useEffect(() => {
    if (candidate) {
      const availableTabIds = availableTabs.map(tab => tab.id);
      if (!availableTabIds.includes(activeTab)) {
        setActiveTab(availableTabIds[0] || 'profile');
      }
    }
  }, [availableTabs, activeTab, candidate]);

  const toggleSkillExpansion = (skillName: string) => {
    setExpandedSkills(prev => ({
      ...prev,
      [skillName]: !prev[skillName]
    }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-green-100 text-green-800">New Application</Badge>;
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Candidate not found</h3>
          <p className="text-gray-600">The candidate profile could not be found.</p>
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
              <div className="flex items-center space-x-4">
                <img 
                  src={candidate.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face"}
                  alt={candidate.name}
                  className="w-12 h-12 rounded-full border"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{candidate.name}</h1>
                  <p className="text-sm text-gray-600">
                    Marketing Assistant • Applied {new Date(candidate.appliedDate).toLocaleDateString('en-GB')}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setLocation(`/admin/assessment-review/${candidateId}`)}
                variant="outline"
                size="sm"
              >
                <FileText className="h-4 w-4 mr-2" />
                Assessment Review
              </Button>
              {getStatusBadge(candidate.status)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className={`grid w-full grid-cols-${availableTabs.length}`}>
            {availableTabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Pollen Team Insights Tab */}
          <TabsContent value="pollen-insights" className="space-y-6 mt-6">
            {hasPollenInterview(candidate) ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-pink-600" />
                    Pollen Team Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-pink-50 p-4 rounded-lg">
                      <p className="text-gray-800 leading-relaxed">{candidate.pollenAssessment?.summary}</p>
                      <div className="mt-3 text-sm text-gray-600">
                        <p>— {candidate.pollenAssessment?.interviewer || "Pollen Team"}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 mt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-700">{candidate.pollenAssessment?.confidence || 0}/5</div>
                        <div className="text-xs text-gray-600">Confidence</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-700">{candidate.pollenAssessment?.companyResearch || 0}/5</div>
                        <div className="text-xs text-gray-600">Company Research</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-700">{candidate.pollenAssessment?.questionQuality || 0}/5</div>
                        <div className="text-xs text-gray-600">Question Quality</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-700">{candidate.pollenAssessment?.overallImpression || 0}/5</div>
                        <div className="text-xs text-gray-600">Overall Impression</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Award className="w-12 h-12 mx-auto mb-4" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Pollen Interview Pending</h3>
                  <p className="text-gray-600 mb-4">Pollen team assessment insights will appear here once the candidate has completed their Pollen interview.</p>
                  <Button 
                    onClick={() => setLocation(`/admin/interview-availability/${candidateId}`)}
                    variant="outline"
                  >
                    Schedule Pollen Interview
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-600" />
                  Important Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Overall Match Score</div>
                    <div className="text-2xl font-bold text-blue-700">{candidate.matchScore}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Availability</div>
                    <div className="text-lg font-medium">{candidate.availability}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Location</div>
                    <div className="text-lg font-medium flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {candidate.location}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Contact</div>
                    <div className="text-lg font-medium flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {candidate.email}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  Behavioral Profile
                  <div className="text-2xl ml-2">{getBehavioralEmoji(candidate.behavioralType)}</div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg text-purple-700 mb-2">{candidate.behavioralType}</h3>
                    <p className="text-gray-700">{getBehavioralSummary(candidate.behavioralType)}</p>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 mt-6">
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-2">
                        <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                      </div>
                      <div className="text-sm font-medium">Dominant</div>
                      <div className="text-lg font-bold text-red-600">{candidate.discProfile.red}%</div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-2">
                        <div className="w-6 h-6 bg-yellow-500 rounded-full"></div>
                      </div>
                      <div className="text-sm font-medium">Influencing</div>
                      <div className="text-lg font-bold text-yellow-600">{candidate.discProfile.yellow}%</div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-2">
                        <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="text-sm font-medium">Steady</div>
                      <div className="text-lg font-bold text-green-600">{candidate.discProfile.green}%</div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-2">
                        <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                      </div>
                      <div className="text-sm font-medium">Conscientious</div>
                      <div className="text-lg font-bold text-blue-600">{candidate.discProfile.blue}%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Key Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {candidate.keyStrengths?.map((strength, index) => (
                    <div key={index} className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-semibold text-green-700">{strength.title}</h4>
                      <p className="text-gray-600">{strength.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-600" />
                  Personal Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Background</h4>
                    <p className="text-gray-700">{candidate.personalStory.background}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Professional Interests</h4>
                    <div className="flex flex-wrap gap-2">
                      {candidate.personalStory.interests.map((interest: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-pink-50 text-pink-700">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Personal Interests</h4>
                    <div className="flex flex-wrap gap-2">
                      {candidate.interests?.map((interest: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-gray-50 text-gray-700">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Community & Engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-pink-600 mb-2">
                    {candidate.proactivityScore || 0}
                  </div>
                  <p className="text-sm text-gray-600">Proactivity Score</p>
                </div>
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills Tab - Only render if available */}
          {availableTabs.some(tab => tab.id === 'skills') && (
            <TabsContent value="skills" className="space-y-6 mt-6">
            {hasApprovedSkills(candidate) ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-600" />
                      Skills Assessment Scores
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-semibold text-gray-900">Overall Score</span>
                        <span className="text-2xl font-bold text-green-600">{candidate.skillsData.overallScore}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-green-600 h-3 rounded-full" 
                          style={{ width: `${candidate.skillsData.overallScore}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Assessment Breakdown</h4>
                      {candidate.skillsData.categories.map((category: any, index: number) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-medium text-gray-900">{category.name}</h5>
                            <span className="text-lg font-semibold text-blue-600">{category.score}/100</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{category.details}</p>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${category.score}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-purple-600" />
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
                          {candidateId === "21" 
                            ? "I'm excited about this role because it combines my passion for building relationships with my interest in digital marketing. I've seen how much impact thoughtful communication can have, and I'd love to contribute to a team that values both creativity and genuine connection with audiences."
                            : candidateId === "30"
                            ? "This position perfectly aligns with my goal of driving measurable results through creative marketing strategies. I'm particularly drawn to the opportunity to work with data analytics while developing engaging campaigns that resonate with target audiences."
                            : "I'm drawn to this role because it offers the opportunity to contribute to well-structured marketing processes while supporting a collaborative team environment. I believe my attention to detail and organizational skills would be valuable assets."
                          }
                        </p>
                      </div>
                    </div>

                    {/* Challenge submissions */}
                    {candidate.skillsAssessment?.submissions.map((submission: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-2">{submission.challenge}</h4>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-gray-600">Score</span>
                          <span className="text-lg font-semibold text-green-600">{submission.score}/100</span>
                        </div>
                        <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                          <p className="text-sm text-gray-700 mb-2"><strong>Feedback:</strong></p>
                          <p className="text-sm text-gray-600">{submission.feedback}</p>
                        </div>
                        <div className="mt-3">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => toggleSkillExpansion(submission.challenge)}
                            className="text-xs"
                          >
                            <ChevronDown className="w-3 h-3 mr-1" />
                            {expandedSkills[submission.challenge] ? 'Hide' : 'Show'} Full Response
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Submission Status</h4>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-gray-700">Assessment completed and verified</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Submitted: {new Date(candidate.appliedDate).toLocaleDateString('en-GB')}</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Target className="w-12 h-12 mx-auto mb-4" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Skills Assessment Pending</h3>
                  <p className="text-gray-600 mb-4">Skills assessment data will appear here once scores have been approved.</p>
                  <Button 
                    onClick={() => setLocation(`/admin/assessment-review/${candidateId}`)}
                    variant="outline"
                  >
                    Review Assessment
                  </Button>
                </CardContent>
              </Card>
            )}
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}