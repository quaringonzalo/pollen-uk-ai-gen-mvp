import { useState, useEffect } from "react";
import React from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  Card, CardContent, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, Filter, Eye, Download, Mail, MessageCircle, 
  Calendar, ArrowLeft, Users, Star, MapPin, Clock, 
  TrendingUp, Award, Brain, ChevronLeft, ChevronRight, 
  Phone, Target, Radar, AlertCircle, BarChart3, Heart, 
  Briefcase
} from "lucide-react";

// Simplified candidate interface based on actual API
interface CandidateMatch {
  id: number;
  name: string;
  email: string;
  pronouns?: string;
  matchScore: number;
  status?: string;
  location: string;
  availability: string;
  visaStatus?: string;
  keyStrengths: Array<{
    title: string;
    description: string;
  }>;
  personalStory: {
    perfectJob: string;
    friendDescriptions: string[];
    teacherDescriptions: string[];
    happyActivities: string[];
    frustrations: string[];
    proudMoments: string[];
  };
  behavioralProfile: {
    type: string;
    description: string;
    workStyleSummary: string;
    idealEnvironment: any[];
    strengths: any[];
  };
  behavioralSummary: string;
  communityEngagement: {
    totalPoints: number;
    membersHelped: number;
    currentStreak: number;
    communityTier: string;
  };
  roleInterests: string[];
  industryInterests: string[];
  skillsAssessment?: {
    overallScore: number;
  };
  pollenTeamAssessment?: {
    overallAssessment: string;
    keyHighlights: string[];
    growthPotential: string;
  };
}

export default function CandidateManagementStandalone() {
  console.log("🚀 STANDALONE CANDIDATE MANAGEMENT LOADED - TOP NAVIGATION VERSION");
  console.log("🔍 Component Render: Fixed positioning should override layout");
  console.log("💡 Sidebar should be completely hidden with CSS and useEffect");
  
  // Force hide any existing sidebar elements
  React.useEffect(() => {
    // Hide any sidebar elements that might be rendered
    const sidebars = document.querySelectorAll('[class*="sidebar"], [class*="pl-64"], nav[class*="fixed"], nav[class*="lg:"]');
    sidebars.forEach(el => {
      (el as HTMLElement).style.display = 'none';
    });
    
    // Set body overflow to hidden to prevent scrolling behind modal
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobFilter, setJobFilter] = useState("all");
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateMatch | null>(null);
  const [splitPosition, setSplitPosition] = useState(40);
  const [isDragging, setIsDragging] = useState(false);

  // Use the existing API endpoint for job candidates
  const { data: candidates = [], isLoading: candidatesLoading } = useQuery({
    queryKey: ['/api/job-candidates/1'],
    enabled: true,
  });

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

  // Get available jobs for filtering
  const { data: jobs = [] } = useQuery({
    queryKey: ['/api/employer-jobs'],
    enabled: true,
  });

  // Add diverse job examples for demo purposes
  const mockJobs = [
    { id: 1, title: 'Marketing Assistant' },
    { id: 2, title: 'Junior Developer' },
    { id: 3, title: 'Product Manager' },
    { id: 4, title: 'UX Designer' },
    { id: 5, title: 'Sales Representative' },
    { id: 6, title: 'Content Writer' },
    { id: 7, title: 'Data Analyst' },
    { id: 8, title: 'Customer Success Manager' }
  ];
  
  const allJobs = jobs.length > 0 ? jobs : mockJobs;

  // Enhance candidates with diverse applied positions and statuses for demo
  const enhancedCandidates = (candidates as CandidateMatch[]).map((candidate: CandidateMatch, index: number) => {
    const jobTitles = ['Marketing Assistant', 'Junior Developer', 'Product Manager', 'UX Designer', 'Sales Representative', 'Content Writer', 'Data Analyst', 'Customer Success Manager'];
    const statuses = ['new', 'interviewed', 'offer_sent', 'reviewing'];
    
    return {
      ...candidate,
      appliedPosition: jobTitles[index % jobTitles.length],
      status: statuses[index % statuses.length]
    };
  });

  const filteredCandidates = enhancedCandidates.filter((candidate: CandidateMatch) => {
    const matchesSearch = candidate.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.keyStrengths?.some((skill: any) => skill.title?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || candidate.status === statusFilter;
    
    const matchesJob = jobFilter === 'all' || candidate.appliedPosition === jobFilter;
    
    return matchesSearch && matchesStatus && matchesJob;
  });

  const handleViewProfile = (candidate: CandidateMatch) => {
    setSelectedCandidate(candidate);
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
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar - Pollen branding */}
      <div className="bg-white border-b shadow-sm flex-none" style={{ zIndex: 999999, position: 'relative' }}>
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900" style={{fontFamily: 'Sora'}}>
                Candidate Management
              </h1>
              <p className="text-sm text-gray-600" style={{fontFamily: 'Poppins'}}>
                {filteredCandidates.length} candidates available
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
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCandidate(null)}
              >
                Close Profile
              </Button>
            </div>
          )}
          
          <Button
            variant="outline"
            onClick={() => setLocation("/employer-dashboard")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Candidate List */}
        <div 
          className="bg-white border-r" 
          style={{ width: selectedCandidate ? `${splitPosition}%` : '100%' }}
        >
          {/* Search and Filter */}
          <div className="p-4 border-b">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search candidates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>
              <select
                value={jobFilter}
                onChange={(e) => setJobFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="all">All Jobs</option>
                {allJobs.map((job: any) => (
                  <option key={job.id} value={job.title}>
                    {job.title}
                  </option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="all">All Status</option>
                <option value="new">New Applications</option>
                <option value="reviewing">Under Review</option>
                <option value="interviewed">Interviewed</option>
                <option value="offer_sent">Offer Sent</option>
              </select>
            </div>
          </div>

          {/* Candidates List */}
          <div className="overflow-y-auto h-full">
            {filteredCandidates.map((candidate: CandidateMatch) => (
              <div
                key={candidate.id}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedCandidate?.id === candidate.id ? 'bg-pink-50 border-pink-200' : ''
                }`}
                onClick={() => handleViewProfile(candidate)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                      <Badge 
                        variant={candidate.status === 'new' ? 'default' : candidate.status === 'interviewed' ? 'secondary' : 'outline'}
                        className={`text-xs ${
                          candidate.status === 'new' ? 'bg-blue-100 text-blue-800' :
                          candidate.status === 'reviewing' ? 'bg-yellow-100 text-yellow-800' :
                          candidate.status === 'interviewed' ? 'bg-orange-100 text-orange-800' :
                          candidate.status === 'offer_sent' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {candidate.status === 'new' ? 'New Application' : 
                         candidate.status === 'reviewing' ? 'Under Review' :
                         candidate.status === 'interviewed' ? 'Interviewed' :
                         candidate.status === 'offer_sent' ? 'Offer Sent' :
                         candidate.status || 'New'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{candidate.email}</p>
                    
                    {/* Applied Position */}
                    <div className="flex items-center gap-1 mt-1">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">
                        Applied for: {candidate.appliedPosition}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium">{candidate.matchScore}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{candidate.location}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {candidate.keyStrengths?.slice(0, 3).map((skill: any, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill.title || skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {/* Quick Action CTAs */}
                    <Button size="sm" variant="outline" className="text-xs">
                      <MessageCircle className="w-3 h-3 mr-1" />
                      Message
                    </Button>
                    <Button size="sm" className="text-xs bg-pink-600 hover:bg-pink-700">
                      <Calendar className="w-3 h-3 mr-1" />
                      Interview
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resize Handle */}
        {selectedCandidate && (
          <div
            className="w-1 bg-gray-200 cursor-col-resize hover:bg-gray-300 transition-colors"
            onMouseDown={() => setIsDragging(true)}
          />
        )}

        {/* Candidate Profile Panel */}
        {selectedCandidate && (
          <div 
            className="bg-white overflow-y-auto"
            style={{ width: `${100 - splitPosition}%` }}
          >
            <div className="p-6">
              {/* Profile Header */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedCandidate.name}</h2>
                    <p className="text-gray-600">{selectedCandidate.email}</p>
                    {selectedCandidate.pronouns && (
                      <p className="text-sm text-gray-500">Pronouns: {selectedCandidate.pronouns}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Mail className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                    <Button size="sm" variant="outline">
                      <Calendar className="w-4 h-4 mr-2" />
                      Interview
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      PDF
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-pink-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-pink-700">{selectedCandidate.matchScore}%</div>
                    <div className="text-sm text-pink-600">Match Score</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-700">{selectedCandidate.skillsAssessment?.overallScore || 85}%</div>
                    <div className="text-sm text-blue-600">Skills Score</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-700">{selectedCandidate.communityEngagement?.totalPoints || 0}</div>
                    <div className="text-sm text-green-600">Community Points</div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="pollen-insights" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="pollen-insights">Pollen Insights</TabsTrigger>
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                  <TabsTrigger value="candidate-management">Management</TabsTrigger>
                </TabsList>

                {/* Pollen Insights Tab */}
                <TabsContent value="pollen-insights" className="mt-6 space-y-6">
                  {/* Behavioral Profile */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Brain className="w-5 h-5 text-purple-500" />
                        Behavioral Profile
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">{selectedCandidate.behavioralProfile?.type}</h4>
                          <p className="text-gray-600 mb-4">{selectedCandidate.behavioralProfile?.description}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Work Style Summary</h4>
                          <p className="text-gray-600 mb-4">{selectedCandidate.behavioralProfile?.workStyleSummary}</p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Core Strengths</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedCandidate.behavioralProfile?.strengths?.map((strength: any, index: number) => (
                              <Badge key={index} variant="outline" className="px-3 py-1">
                                {typeof strength === 'string' ? strength : strength.title || JSON.stringify(strength)}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Ideal Environment</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedCandidate.behavioralProfile?.idealEnvironment?.map((env: any, index: number) => (
                              <Badge key={index} variant="secondary" className="px-3 py-1">
                                {typeof env === 'string' ? env : env.title || JSON.stringify(env)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Pollen Team Assessment */}
                  {selectedCandidate.pollenTeamAssessment && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-xl">Pollen Team Assessment</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <p className="text-gray-700">{selectedCandidate.pollenTeamAssessment.overallAssessment}</p>
                          
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Key Highlights</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedCandidate.pollenTeamAssessment.keyHighlights?.map((highlight: string, index: number) => (
                                <Badge key={index} variant="outline" className="px-3 py-1">
                                  {highlight}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Growth Potential</h4>
                            <p className="text-gray-600">{selectedCandidate.pollenTeamAssessment.growthPotential}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Profile Tab */}
                <TabsContent value="profile" className="mt-6 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-500" />
                        Personal Story
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Perfect Job */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Their Perfect Job</h4>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-blue-800 italic">"{selectedCandidate.personalStory?.perfectJob || 'No perfect job description available'}"</p>
                        </div>
                      </div>

                      {/* Motivations (using happyActivities as fallback) */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">What Motivates Them</h4>
                        <div className="bg-purple-50 p-4 rounded-lg">
                          <div className="space-y-2">
                            {selectedCandidate.personalStory?.happyActivities?.map((activity: string, index: number) => (
                              <div key={index} className="flex items-center gap-2">
                                <Heart className="w-4 h-4 text-purple-600" />
                                <span className="text-purple-800 text-sm">{activity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Proud Moments */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Proud Moments</h4>
                        <div className="space-y-2">
                          {selectedCandidate.personalStory?.proudMoments?.map((moment: string, index: number) => (
                            <div key={index} className="bg-rose-50 p-3 rounded-lg">
                              <p className="text-rose-800 text-sm">{moment}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Community Engagement */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Community Engagement</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-yellow-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-yellow-700">{selectedCandidate.communityEngagement?.totalPoints || 0}</div>
                            <div className="text-sm text-yellow-600">Total Points</div>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-green-700">{selectedCandidate.communityEngagement?.membersHelped || 0}</div>
                            <div className="text-sm text-green-600">Members Helped</div>
                          </div>
                          <div className="bg-orange-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-orange-700">{selectedCandidate.communityEngagement?.currentStreak || 0}</div>
                            <div className="text-sm text-orange-600">Day Streak</div>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                          <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                            {selectedCandidate.communityEngagement?.communityTier || 'Bronze'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Role and Industry Interests */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Role Interests</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {selectedCandidate.roleInterests?.map((role: string, index: number) => (
                            <div key={index} className="bg-blue-50 p-3 rounded-lg">
                              <p className="text-blue-800 font-medium">{role}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Industry Interests</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {selectedCandidate.industryInterests?.map((industry: string, index: number) => (
                            <div key={index} className="bg-green-50 p-3 rounded-lg">
                              <p className="text-green-800 font-medium">{industry}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Skills Tab */}
                <TabsContent value="skills" className="mt-6 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Core Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedCandidate.keyStrengths?.map((skill: any, index: number) => (
                          <div key={index} className="bg-blue-50 p-3 rounded-lg flex items-center justify-between">
                            <div className="flex-1">
                              <span className="font-medium text-blue-800">{skill.title || skill}</span>
                              {skill.description && (
                                <p className="text-sm text-blue-600 mt-1">{skill.description}</p>
                              )}
                            </div>
                            <Badge variant="secondary">{85 + (index * 2)}%</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Candidate Management Tab */}
                <TabsContent value="candidate-management" className="mt-6 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Candidate Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-600">Location</label>
                            <p className="text-gray-900">{selectedCandidate.location}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Availability</label>
                            <p className="text-gray-900">{selectedCandidate.availability}</p>
                          </div>
                          {selectedCandidate.visaStatus && (
                            <div>
                              <label className="text-sm font-medium text-gray-600">Visa Status</label>
                              <p className="text-gray-900">{selectedCandidate.visaStatus}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-3 pt-4">
                          <Button className="flex-1">
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Send Message
                          </Button>
                          <Button variant="outline" className="flex-1">
                            <Calendar className="w-4 h-4 mr-2" />
                            Schedule Interview
                          </Button>
                          <Button variant="outline" className="flex-1">
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF
                          </Button>
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