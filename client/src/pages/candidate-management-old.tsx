import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, Filter, Grid3x3, List, Download, MessageSquare, 
  Calendar, Eye, Star, ArrowLeft, X, Users, CheckCircle,
  FileSpreadsheet, Trophy, UserCheck, Heart, Lightbulb,
  TrendingUp, Award, Brain
} from "lucide-react";

// Mock data
interface CandidateMatch {
  id: number;
  name: string;
  email: string;
  pronouns: string;
  location: string;
  jobTitle: string;
  jobDepartment: string;
  appliedDate: string;
  status: 'new' | 'in_progress' | 'interview_scheduled' | 'interview_complete' | 'rejected' | 'hired' | 'offer_declined';
  matchScore: number;
  challengeScore: number;
  skills: string[];
  keyStrengths: string[];
  behavioralType: string;
  personalityInsights: string;
  motivationalFactors?: string[];
  workStylePreferences?: string[];
  educationLevel: string;
  workExperience: string;
  culturalFit: string;
  communityEngagement: {
    totalPoints: number;
    proactivityScore: number;
    communityTier: string;
    currentStreak: number;
    membersHelped: number;
  };
  pollenTeamInsights: {
    assessmentBlurb: string;
    keyTakeaways: string[];
    workingStyles: string[];
    careerAspirations: string[];
    motivation: string;
  };
}

const mockCandidates: CandidateMatch[] = [
  {
    id: 1,
    name: "Sarah Chen",
    email: "sarah.chen@email.com",
    pronouns: "she/her",
    location: "London, UK",
    jobTitle: "Marketing Assistant",
    jobDepartment: "Marketing",
    appliedDate: "2024-01-15",
    status: "new",
    matchScore: 92,
    challengeScore: 88,
    skills: ["Social Media Marketing", "Content Creation", "Analytics", "Campaign Management"],
    keyStrengths: ["Creative Problem Solving", "Data Analysis", "Team Collaboration", "Project Management"],
    behavioralType: "Collaborative Achiever",
    personalityInsights: "Thrives in team environments and enjoys tackling complex challenges with creative solutions.",
    motivationalFactors: ["Creative freedom", "Team collaboration", "Learning opportunities"],
    workStylePreferences: ["Flexible schedule", "Collaborative workspace", "Clear objectives"],
    educationLevel: "Bachelor's in Marketing",
    workExperience: "2 years in digital marketing",
    culturalFit: "Strong alignment with company values of innovation and teamwork.",
    communityEngagement: {
      totalPoints: 2450,
      proactivityScore: 8,
      communityTier: "Gold",
      currentStreak: 15,
      membersHelped: 23
    },
    pollenTeamInsights: {
      assessmentBlurb: "Sarah demonstrates exceptional creative thinking and collaborative skills. Her approach to problem-solving is methodical yet innovative, making her an ideal candidate for dynamic marketing environments.",
      keyTakeaways: ["Strong analytical mindset", "Natural team player", "Creative approach to challenges"],
      workingStyles: ["Collaborative", "Detail-oriented", "Results-focused"],
      careerAspirations: ["Marketing Manager", "Brand Strategy", "Digital Innovation"],
      motivation: "Driven by the opportunity to create meaningful connections between brands and customers while working in a supportive team environment."
    }
  },
  {
    id: 2,
    name: "Marcus Johnson",
    email: "marcus.johnson@email.com", 
    pronouns: "he/him",
    location: "Manchester, UK",
    jobTitle: "Marketing Assistant",
    jobDepartment: "Marketing",
    appliedDate: "2024-01-12",
    status: "in_progress",
    matchScore: 87,
    challengeScore: 91,
    skills: ["Digital Advertising", "SEO/SEM", "Market Research", "Brand Development"],
    keyStrengths: ["Strategic Thinking", "Data-Driven Decision Making", "Leadership Potential", "Innovation"],
    behavioralType: "Strategic Innovator",
    personalityInsights: "Natural leader with strong analytical abilities and passion for emerging marketing technologies.",
    motivationalFactors: ["Strategic impact", "Innovation", "Leadership opportunities"],
    workStylePreferences: ["Independent work", "Strategic planning", "Data-driven approach"],
    educationLevel: "Master's in Digital Marketing",
    workExperience: "3 years in marketing analytics",
    culturalFit: "Excellent fit for fast-paced, innovation-focused environment.",
    communityEngagement: {
      totalPoints: 3120,
      proactivityScore: 9,
      communityTier: "Platinum",
      currentStreak: 28,
      membersHelped: 41
    },
    pollenTeamInsights: {
      assessmentBlurb: "Marcus combines strategic vision with practical execution skills. His data-driven approach and natural leadership qualities make him standout for senior marketing roles.",
      keyTakeaways: ["Strategic mindset", "Leadership potential", "Innovation-focused"],
      workingStyles: ["Independent", "Strategic", "Data-driven"],
      careerAspirations: ["Senior Marketing Manager", "Strategy Lead", "Growth Hacking"],
      motivation: "Passionate about leveraging data and technology to drive business growth and market expansion."
    }
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    email: "emma.rodriguez@email.com",
    pronouns: "she/her",
    location: "Birmingham, UK",
    jobTitle: "Marketing Assistant",
    jobDepartment: "Marketing",
    appliedDate: "2024-01-10",
    status: "interview_scheduled",
    matchScore: 85,
    challengeScore: 82,
    skills: ["Content Strategy", "Email Marketing", "Brand Management", "Social Media"],
    keyStrengths: ["Communication", "Brand Development", "Customer Focus", "Adaptability"],
    behavioralType: "Creative Communicator",
    personalityInsights: "Excellent communicator with strong creative abilities and customer-centric mindset.",
    motivationalFactors: ["Creative expression", "Customer impact", "Brand building"],
    workStylePreferences: ["Creative freedom", "Customer interaction", "Varied projects"],
    educationLevel: "Bachelor's in Communications",
    workExperience: "18 months in content marketing",
    culturalFit: "Great fit for customer-focused, creative environment.",
    communityEngagement: {
      totalPoints: 1890,
      proactivityScore: 7,
      communityTier: "Silver",
      currentStreak: 12,
      membersHelped: 18
    },
    pollenTeamInsights: {
      assessmentBlurb: "Emma brings excellent communication skills and a fresh perspective to brand development. Her customer-focused approach and creative thinking make her valuable for customer-facing marketing roles.",
      keyTakeaways: ["Strong communication skills", "Customer-focused", "Creative thinker"],
      workingStyles: ["Creative", "Communicative", "Customer-centric"],
      careerAspirations: ["Brand Manager", "Content Director", "Customer Experience"],
      motivation: "Passionate about creating authentic brand connections that resonate with customers and drive meaningful engagement."
    }
  },
  {
    id: 4,
    name: "James Wilson",
    email: "james.wilson@email.com",
    pronouns: "he/him",
    location: "Leeds, UK",
    jobTitle: "Marketing Assistant",
    jobDepartment: "Marketing",
    appliedDate: "2024-01-08",
    status: "interview_complete",
    matchScore: 90,
    challengeScore: 94,
    skills: ["Performance Marketing", "Data Analytics", "A/B Testing", "Conversion Optimization"],
    keyStrengths: ["Analytical Thinking", "Performance Optimization", "Technical Skills", "Results-Driven"],
    behavioralType: "Data-Driven Optimizer",
    personalityInsights: "Highly analytical with excellent technical skills and focus on measurable results.",
    motivationalFactors: ["Data insights", "Performance optimization", "Technical challenges"],
    workStylePreferences: ["Data-driven decisions", "Technical tools", "Performance metrics"],
    educationLevel: "Master's in Data Science",
    workExperience: "2.5 years in performance marketing",
    culturalFit: "Perfect fit for data-driven, performance-focused culture.",
    communityEngagement: {
      totalPoints: 3450,
      proactivityScore: 10,
      communityTier: "Platinum",
      currentStreak: 35,
      membersHelped: 52
    },
    pollenTeamInsights: {
      assessmentBlurb: "James excels at turning data into actionable insights and measurable results. His technical expertise and performance-focused mindset make him ideal for growth-oriented marketing roles.",
      keyTakeaways: ["Data expertise", "Performance-focused", "Technical proficiency"],
      workingStyles: ["Analytical", "Technical", "Results-oriented"],
      careerAspirations: ["Growth Marketing Lead", "Data Science", "Performance Director"],
      motivation: "Driven by the challenge of optimizing performance through data analysis and technical innovation to achieve measurable business impact."
    }
  },
  {
    id: 5,
    name: "Priya Patel",
    email: "priya.patel@email.com",
    pronouns: "she/her",
    location: "Bristol, UK",
    jobTitle: "Marketing Assistant",
    jobDepartment: "Marketing",
    appliedDate: "2024-01-05",
    status: "hired",
    matchScore: 88,
    challengeScore: 85,
    skills: ["Project Management", "Campaign Development", "Cross-functional Collaboration", "Marketing Operations"],
    keyStrengths: ["Organization", "Leadership", "Process Improvement", "Team Building"],
    behavioralType: "Organized Leader",
    personalityInsights: "Natural organizer with strong leadership qualities and ability to coordinate complex projects.",
    motivationalFactors: ["Leadership opportunities", "Process improvement", "Team development"],
    workStylePreferences: ["Structured approach", "Team leadership", "Clear processes"],
    educationLevel: "Bachelor's in Business Administration",
    workExperience: "3 years in marketing operations",
    culturalFit: "Excellent fit for structured, growth-oriented environment.",
    communityEngagement: {
      totalPoints: 2780,
      proactivityScore: 8,
      communityTier: "Gold",
      currentStreak: 22,
      membersHelped: 34
    },
    pollenTeamInsights: {
      assessmentBlurb: "Priya demonstrates exceptional organizational skills and natural leadership abilities. Her systematic approach to project management and team coordination makes her valuable for scaling marketing operations.",
      keyTakeaways: ["Natural leader", "Process-oriented", "Team builder"],
      workingStyles: ["Organized", "Leadership-focused", "Process-driven"],
      careerAspirations: ["Marketing Operations Manager", "Team Lead", "Project Director"],
      motivation: "Motivated by the opportunity to build efficient processes and lead teams to achieve ambitious marketing goals while fostering professional growth."
    }
  },
  {
    id: 6,
    name: "Alex Thompson",
    email: "alex.thompson@email.com",
    pronouns: "they/them",
    location: "Edinburgh, UK",
    jobTitle: "Marketing Assistant",
    jobDepartment: "Marketing",
    appliedDate: "2024-01-03",
    status: "rejected",
    matchScore: 72,
    challengeScore: 78,
    skills: ["Graphic Design", "Video Editing", "Creative Strategy", "Visual Storytelling"],
    keyStrengths: ["Creative Vision", "Visual Design", "Storytelling", "Brand Aesthetics"],
    behavioralType: "Visual Creative",
    personalityInsights: "Highly creative with strong visual design skills and passion for storytelling through visual media.",
    motivationalFactors: ["Creative expression", "Visual impact", "Artistic freedom"],
    workStylePreferences: ["Creative projects", "Visual work", "Artistic freedom"],
    educationLevel: "Bachelor's in Graphic Design",
    workExperience: "1.5 years in creative agencies",
    culturalFit: "Good fit for creative, design-focused environment.",
    communityEngagement: {
      totalPoints: 1560,
      proactivityScore: 6,
      communityTier: "Bronze",
      currentStreak: 8,
      membersHelped: 12
    },
    pollenTeamInsights: {
      assessmentBlurb: "Alex brings strong creative and visual design skills to the team. Their artistic vision and storytelling abilities make them valuable for brand visual development and creative campaigns.",
      keyTakeaways: ["Creative talent", "Visual expertise", "Storytelling skills"],
      workingStyles: ["Creative", "Visual-focused", "Artistic"],
      careerAspirations: ["Creative Director", "Brand Designer", "Visual Strategist"],
      motivation: "Passionate about creating compelling visual narratives that capture brand essence and engage audiences through innovative design and storytelling."
    }
  }
];

export default function CandidateManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [showCandidateDetail, setShowCandidateDetail] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateMatch | null>(null);
  const [splitPosition, setSplitPosition] = useState(40); // Default 40% for table
  const [isDragging, setIsDragging] = useState(false);

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

  const filteredCandidates = mockCandidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewProfile = (candidate: CandidateMatch) => {
    setSelectedCandidate(candidate);
    setShowCandidateDetail(true);
  };

  const handleDownloadPDF = (candidateId: number) => {
    console.log("Download PDF for candidate", candidateId);
  };

  const handleSendMessage = (candidateId: number) => {
    console.log("Send message to candidate", candidateId);
  };

  const handleManageInterview = (candidateId: number) => {
    console.log("Manage interview for candidate", candidateId);
  };

  const getCurrentCandidateIndex = () => {
    if (!selectedCandidate) return -1;
    return filteredCandidates.findIndex(c => c.id === selectedCandidate.id);
  };

  const navigateCandidateInPanel = (direction: 'prev' | 'next') => {
    const currentIndex = getCurrentCandidateIndex();
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex >= 0 && newIndex < filteredCandidates.length) {
      setSelectedCandidate(filteredCandidates[newIndex]);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Candidate Management</h1>
            <p className="text-gray-600 mt-1">Review and manage job applications</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="px-3 py-1">
              {filteredCandidates.length} candidates
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Panel - Filters and Table/Grid */}
        <div 
          className="bg-white flex flex-col"
          style={{ width: showCandidateDetail ? `${splitPosition}%` : '100%' }}
        >
          {/* Filters and Controls */}
          <Card className="m-4 mb-2">
            <CardContent className="p-4">
              {/* Search and Filter Row */}
              <div className="flex items-center gap-4 mb-4">
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

              {/* View Mode and Actions */}
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

                {/* Back to List button - show when in split view */}
                {showCandidateDetail && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowCandidateDetail(false);
                      setSelectedCandidate(null);
                    }}
                    className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to List
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {viewMode === 'table' ? (
            <CandidateTable 
              candidates={filteredCandidates}
              onViewProfile={handleViewProfile}
              onDownloadPDF={handleDownloadPDF}
              onSendMessage={handleSendMessage}
              onManageInterview={handleManageInterview}
              isCompact={showCandidateDetail}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {filteredCandidates.map((candidate) => (
                <Card key={candidate.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold">
                        {candidate.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-medium">{candidate.name}</h3>
                        <p className="text-sm text-gray-500">{candidate.jobTitle}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Match Score</span>
                        <span className="font-bold text-green-600">{candidate.matchScore}%</span>
                      </div>
                      <Badge variant="secondary">{candidate.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Draggable Separator */}
        {showCandidateDetail && (
          <div 
            className="w-1 bg-gray-300 cursor-col-resize hover:bg-gray-400 transition-colors"
            onMouseDown={handleMouseDown}
          />
        )}

        {/* Right Panel - Candidate Detail */}
        {showCandidateDetail && selectedCandidate && (
          <div 
            className="bg-white overflow-y-auto flex-1"
            style={{ width: `${100 - splitPosition}%` }}
          >
            {/* Header with navigation and close */}
            <div className="sticky top-0 bg-white border-b p-4 z-10">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold">Candidate Profile</h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setShowCandidateDetail(false);
                    setSelectedCandidate(null);
                  }}
                  className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                >
                  <X className="w-4 h-4 mr-1" />
                  Close
                </Button>
              </div>
              
              {/* Navigation Controls */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateCandidateInPanel('prev')}
                  disabled={getCurrentCandidateIndex() <= 0}
                >
                  ← Previous
                </Button>
                
                <span className="text-sm text-gray-600 font-medium">
                  {getCurrentCandidateIndex() + 1} of {filteredCandidates.length}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateCandidateInPanel('next')}
                  disabled={getCurrentCandidateIndex() >= filteredCandidates.length - 1}
                >
                  Next →
                </Button>
              </div>
            </div>

            {/* Full Profile Content - 4-Tab System */}
            <div className="p-6">
              {/* Profile Header */}
              <div className="flex items-start gap-6 mb-6">
                <div className="w-20 h-20 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-2xl">
                  {selectedCandidate.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900">{selectedCandidate.name}</h1>
                  <p className="text-gray-600">{selectedCandidate.pronouns}</p>
                  <p className="text-sm text-gray-500">{selectedCandidate.location}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span className="font-bold text-lg">{selectedCandidate.matchScore}% Match</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-pink-500" />
                      <span className="font-bold text-lg">{selectedCandidate.challengeScore}% Challenge Score</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-3 mb-6">
                <Button 
                  className="flex-1"
                  onClick={() => handleSendMessage(selectedCandidate.id)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleDownloadPDF(selectedCandidate.id)}
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>

              {/* 4-Tab System */}
              <Tabs defaultValue="summary" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="behavioral">Behavioral</TabsTrigger>
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                  <TabsTrigger value="story">Their Story</TabsTrigger>
                </TabsList>

                {/* Summary Tab */}
                <TabsContent value="summary" className="space-y-6 mt-6">
                  {/* Overview Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">{selectedCandidate.matchScore}%</div>
                        <div className="text-sm text-gray-500">Overall Match</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{selectedCandidate.challengeScore}%</div>
                        <div className="text-sm text-gray-500">Skills Score</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">{selectedCandidate.communityEngagement.proactivityScore}/10</div>
                        <div className="text-sm text-gray-500">Engagement</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Pollen Team Assessment */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-500" />
                        Pollen Team Assessment
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Key Takeaways</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedCandidate.pollenTeamInsights.keyTakeaways.map((takeaway, index) => (
                            <Badge key={index} variant="outline" className="px-3 py-1">{takeaway}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Working Styles</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedCandidate.pollenTeamInsights.workingStyles.map((style, index) => (
                            <Badge key={index} variant="secondary" className="px-3 py-1">{style}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Assessment Notes</h4>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {selectedCandidate.pollenTeamInsights.assessmentBlurb}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Skills Overview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Core Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {selectedCandidate.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="px-3 py-1">{skill}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Behavioral Tab */}
                <TabsContent value="behavioral" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-blue-600" />
                        Behavioral Profile
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Personality Type</h4>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="text-lg font-bold text-blue-800">{selectedCandidate.behavioralType}</div>
                          <p className="text-blue-700 text-sm mt-1">Natural problem-solver with strong analytical abilities</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Communication Style</h4>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="font-semibold text-green-800">Direct & Clear</div>
                          <p className="text-green-700 text-sm mt-1">Prefers straightforward communication with clear expectations and measurable outcomes</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Work Style Strengths</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedCandidate.keyStrengths.map((strength, index) => (
                            <div key={index} className="bg-purple-50 p-3 rounded-lg">
                              <div className="font-medium text-purple-800">{strength}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Career Motivators</h4>
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <p className="text-yellow-800">{selectedCandidate.pollenTeamInsights.motivation}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Skills Tab */}
                <TabsContent value="skills" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-pink-500" />
                        Skills Assessment - {selectedCandidate.challengeScore}%
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Core Skills</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedCandidate.skills.map((skill, index) => (
                            <div key={index} className="bg-blue-50 p-3 rounded-lg flex items-center justify-between">
                              <span className="font-medium text-blue-800">{skill}</span>
                              <Badge variant="secondary">{85 + (index * 2)}%</Badge>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Challenge Performance</h4>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-green-800">Overall Score</span>
                            <span className="text-2xl font-bold text-green-700">{selectedCandidate.challengeScore}%</span>
                          </div>
                          <p className="text-green-700 text-sm">Excellent performance across technical and practical assessments</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Key Achievements</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm">Top 10% performer in skills assessments</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-green-500" />
                            <span className="text-sm">Consistent improvement across multiple challenges</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Brain className="w-4 h-4 text-purple-500" />
                            <span className="text-sm">Strong problem-solving methodology</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Their Story Tab */}
                <TabsContent value="story" className="space-y-6 mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-500" />
                        Personal Story
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Career Aspirations</h4>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex flex-wrap gap-2">
                            {selectedCandidate.pollenTeamInsights.careerAspirations.map((aspiration, index) => (
                              <Badge key={index} className="bg-blue-100 text-blue-800">{aspiration}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">What Motivates Them</h4>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <p className="text-purple-800">{selectedCandidate.pollenTeamInsights.motivation}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Community Engagement</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-yellow-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-yellow-700">{selectedCandidate.communityEngagement.totalPoints}</div>
                            <div className="text-sm text-yellow-600">Total Points</div>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-green-700">{selectedCandidate.communityEngagement.membersHelped}</div>
                            <div className="text-sm text-green-600">Members Helped</div>
                          </div>
                          <div className="bg-orange-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-orange-700">{selectedCandidate.communityEngagement.currentStreak}</div>
                            <div className="text-sm text-orange-600">Day Streak</div>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                          <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                            {selectedCandidate.communityEngagement.communityTier}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Values Fit</h4>
                        <div className="bg-rose-50 p-4 rounded-lg">
                          <p className="text-rose-800 text-sm">
                            Strong alignment with team values of collaboration, continuous learning, and results-oriented mindset. 
                            Demonstrates genuine enthusiasm for professional development and supporting others in their growth journey.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Table view component
function CandidateTable({ 
  candidates, 
  onViewProfile, 
  onDownloadPDF, 
  onSendMessage, 
  onManageInterview,
  isCompact = false
}: {
  candidates: CandidateMatch[];
  onViewProfile: (candidate: CandidateMatch) => void;
  onDownloadPDF: (candidateId: number) => void;
  onSendMessage: (candidateId: number) => void;
  onManageInterview: (candidateId: number) => void;
  isCompact?: boolean;
}) {
  return (
    <Card className="mx-4 mb-4 flex-1">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className={`text-left font-medium text-gray-900 ${isCompact ? 'p-2 text-xs' : 'p-4'}`}>Candidate</th>
                <th className={`text-left font-medium text-gray-900 ${isCompact ? 'p-2 text-xs' : 'p-4'}`}>Job Position</th>
                <th className={`text-left font-medium text-gray-900 ${isCompact ? 'p-2 text-xs' : 'p-4'}`}>Match Score</th>
                <th className={`text-left font-medium text-gray-900 ${isCompact ? 'p-2 text-xs' : 'p-4'}`}>Status</th>
                <th className={`text-left font-medium text-gray-900 ${isCompact ? 'p-2 text-xs' : 'p-4'}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr key={candidate.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => onViewProfile(candidate)}>
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
                    <div className={`font-medium ${isCompact ? 'text-sm' : ''}`}>{candidate.jobTitle}</div>
                    <div className={`text-gray-500 ${isCompact ? 'text-xs' : 'text-sm'}`}>{candidate.jobDepartment}</div>
                  </td>
                  <td className={isCompact ? 'p-2' : 'p-4'}>
                    <div className="flex items-center gap-2">
                      <div className={`font-bold ${isCompact ? 'text-sm' : 'text-lg'}`}>{candidate.matchScore}%</div>
                      <Star className={`text-yellow-500 ${isCompact ? 'w-3 h-3' : 'w-4 h-4'}`} />
                    </div>
                  </td>
                  <td className={isCompact ? 'p-2' : 'p-4'}>
                    <Badge variant="secondary" className={isCompact ? 'text-xs' : ''}>
                      {candidate.status}
                    </Badge>
                  </td>
                  <td className={isCompact ? 'p-2' : 'p-4'}>
                    <div className="flex gap-2">
                      <Button
                        size={isCompact ? "sm" : "sm"}
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSendMessage(candidate.id);
                        }}
                        className={`flex-1 ${isCompact ? 'px-2 py-1 text-xs' : ''}`}
                      >
                        <MessageSquare className={`mr-1 ${isCompact ? 'w-3 h-3' : 'w-4 h-4'}`} />
                        {isCompact ? 'Msg' : 'Message'}
                      </Button>
                      <Button
                        size={isCompact ? "sm" : "sm"}
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onManageInterview(candidate.id);
                        }}
                        className={`flex-1 ${isCompact ? 'px-2 py-1 text-xs' : ''}`}
                      >
                        <Calendar className={`mr-1 ${isCompact ? 'w-3 h-3' : 'w-4 h-4'}`} />
                        {isCompact ? 'Int' : 'Interview'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}