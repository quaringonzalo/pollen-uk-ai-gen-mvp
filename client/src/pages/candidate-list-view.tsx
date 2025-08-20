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
import { Input } from "@/components/ui/input";
import { 
  Search, Filter, Eye, Download, Mail, MessageCircle, 
  Calendar, ArrowLeft, Users, Star, MapPin, Clock, 
  TrendingUp, Award, Brain, ChevronLeft, ChevronRight, 
  Phone, Target, Radar, AlertCircle, BarChart3, Heart, 
  Briefcase, ArrowRight, FileText, CheckCircle, XCircle,
  Plus, Globe
} from "lucide-react";

// Updated candidate interface matching API response
interface CandidateMatch {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  pronouns?: string;
  matchScore: number;
  status?: string;
  location: string;
  availability: string;
  appliedDate: string;
  behavioralType: string;
  keyStrengths?: Array<{
    title: string;
    description: string;
    color: string;
  }>;
  communityEngagement?: {
    totalPoints: number;
    membersHelped: number;
    currentStreak: number;
    communityTier: string;
  };
  pollenAssessment?: {
    overallAssessment: string;
  };
  jobTitle?: string; // For job-specific views
  jobAppliedFor?: string; // Display name for job applied for
}

interface Job {
  id: number;
  title: string;
  location?: string;
  applicationsCount?: number;
}

export default function CandidateListView() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Get job filter from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const jobParam = urlParams.get('job');
    const statusParam = urlParams.get('status');
    
    if (jobParam) {
      setSelectedJobId(parseInt(jobParam));
    }
    if (statusParam) {
      setStatusFilter(statusParam);
    }
  }, []);

  // Fetch employer jobs for filtering
  const { data: employerJobs, isLoading: jobsLoading } = useQuery({
    queryKey: ['/api/employer-jobs']
  });

  // Fetch candidates with optional job filtering
  const candidatesEndpoint = selectedJobId 
    ? `/api/job-candidates/${selectedJobId}`
    : '/api/all-candidates';
    
  const { data: candidates, isLoading: candidatesLoading } = useQuery({
    queryKey: [candidatesEndpoint],
    enabled: true
  });

  const candidateList = (candidates || []) as CandidateMatch[];
  const jobsList = (employerJobs || []) as Job[];
  const selectedJob = jobsList.find(job => job.id === selectedJobId);

  // Map candidates with job information for display
  const candidatesWithJobInfo = candidateList.map(candidate => ({
    ...candidate,
    jobAppliedFor: selectedJob?.title || (selectedJobId ? 'Marketing Assistant' : 'Multiple Roles'),
    pronouns: candidate.pronouns || (candidate.firstName === 'Priya' ? 'she/her' : 
                                   candidate.firstName === 'James' ? 'he/him' : 
                                   candidate.firstName === 'Michael' ? 'he/him' : 
                                   candidate.firstName === 'Sarah' ? 'she/her' : 
                                   candidate.firstName === 'Emma' ? 'she/her' : 'they/them')
  }));

  // Map database status to main 4-status system for filtering
  const getMainStatus = (status: string) => {
    switch(status) {
      case 'new_application':
      case 'new':
        return 'new';
      case 'interview_scheduled':
      case 'interview_complete':
      case 'interview_completed':
      case 'in_progress':
        return 'in_progress';
      case 'job_offered':
      case 'complete':
        return 'complete';
      case 'hired':
        return 'hired';
      default:
        return 'new';
    }
  };

  // Filter candidates based on search and status
  const filteredCandidates = candidatesWithJobInfo.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
    const candidateMainStatus = getMainStatus(candidate.status || 'new_application');
    const matchesStatus = statusFilter === "all" || candidateMainStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Dynamic action system based on employer portal redesign plan
  const getCandidateActionInfo = (candidate: CandidateMatch) => {
    const status = candidate.status || 'new_application';
    // Use same CTA logic as candidate-detail-view for consistency
    switch(status) {
      case 'new_application':
      case 'new':
        return { 
          text: 'Schedule Interview', 
          className: 'bg-green-600 hover:bg-green-700 text-white', 
          variant: 'default' as const 
        };
      case 'interview_scheduled':
        return { 
          text: 'View Interview Details', 
          className: 'bg-blue-600 hover:bg-blue-700 text-white', 
          variant: 'default' as const 
        };
      case 'interview_complete':
      case 'interview_completed':
        return { 
          text: 'Provide Update', 
          className: 'bg-orange-600 hover:bg-orange-700 text-white', 
          variant: 'default' as const 
        };
      case 'in_progress':
        return { 
          text: 'Awaiting Candidate', 
          className: 'bg-orange-600 hover:bg-orange-700 text-white', 
          variant: 'default' as const 
        };
      case 'complete':
        return { 
          text: 'View Feedback', 
          className: 'bg-gray-600 hover:bg-gray-700 text-white', 
          variant: 'default' as const 
        };
      case 'job_offered':
        return { 
          text: 'View Details', 
          className: 'bg-gray-600 hover:bg-gray-700 text-white', 
          variant: 'default' as const 
        };
      case 'hired':
        return { 
          text: 'View Details', 
          className: 'bg-emerald-600 hover:bg-emerald-700 text-white', 
          variant: 'default' as const 
        };
      default:
        return { 
          text: 'Schedule Interview', 
          className: 'bg-green-600 hover:bg-green-700 text-white', 
          variant: 'default' as const 
        };
    }
  };

  const getStatusBadge = (status: string) => {
    // Map old status to new 4-status system
    const getMainStatus = (status: string) => {
      switch(status) {
        case 'new_application':
        case 'new':
          return 'new';
        case 'interview_scheduled':
        case 'interview_complete':
        case 'interview_completed':
        case 'in_progress':
          return 'in_progress';
        case 'job_offered':
        case 'complete':
          return 'complete';
        case 'hired':
          return 'hired';
        default:
          return 'new';
      }
    };

    const mainStatus = getMainStatus(status);
    
    switch(mainStatus) {
      case 'new':
        return <Badge className="bg-green-100 text-green-800">New</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'complete':
        return <Badge className="bg-gray-100 text-gray-800">Complete</Badge>;
      case 'hired':
        return <Badge className="bg-emerald-100 text-emerald-800">Hired</Badge>;
      default:
        return <Badge className="bg-green-100 text-green-800">New</Badge>;
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

  return (
    <div className="p-6 space-y-6">
      {/* Header with breadcrumb navigation */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => setLocation("/employer-dashboard")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
              
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Dashboard</span>
                <ChevronRight className="w-4 h-4" />
                <span className="font-medium text-gray-900">
                  {selectedJob ? `${selectedJob.title} Candidates` : 'All Candidates'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setLocation("/interview-schedule")}
                className="flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Interviews
              </Button>
              <Button
                variant="outline"
                onClick={() => setLocation("/employer-jobs/create")}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Post New Job
              </Button>
            </div>
          </div>
          
          {selectedJob && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-blue-900" style={{fontFamily: 'Sora'}}>
                    Viewing candidates for: {selectedJob.title}
                  </h3>
                  <p className="text-sm text-blue-700" style={{fontFamily: 'Poppins'}}>
                    {selectedJob.applicationsCount || 0} candidates matched to this position
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedJobId(null);
                    setLocation("/candidates");
                  }}
                  className="text-blue-700 border-blue-300 hover:bg-blue-100"
                >
                  View All Candidates
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filters and search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search candidates by name or email..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Job filter dropdown */}
              <select
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={selectedJobId || ""}
                onChange={(e) => {
                  const jobId = e.target.value ? parseInt(e.target.value) : null;
                  setSelectedJobId(jobId);
                  
                  // Update URL to stay on candidates page
                  if (jobId) {
                    setLocation(`/candidates?job=${jobId}`);
                  } else {
                    setLocation("/candidates");
                  }
                }}
              >
                <option value="">All Jobs</option>
                {jobsList.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title} ({job.applicationsCount || 0} candidates)
                  </option>
                ))}
              </select>
              
              {/* Status filter */}
              <select
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
                <option value="complete">Complete</option>
                <option value="hired">Hired</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Candidates grid/list */}
      <div className="space-y-4">
        {candidatesLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCandidates.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-medium text-gray-900 mb-2" style={{fontFamily: 'Sora'}}>
                No candidates found
              </h3>
              <p className="text-gray-600" style={{fontFamily: 'Poppins'}}>
                {searchTerm ? 'Try adjusting your search criteria.' : 'No candidates match the current filters.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredCandidates.map((candidate) => {
              const actionInfo = getCandidateActionInfo(candidate);
              
              return (
                <Card 
                  key={candidate.id} 
                  className="hover:shadow-lg hover:border-pink-200 transition-all duration-200 cursor-pointer group"
                  onClick={() => setLocation(`/candidates/${candidate.id}`)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full flex items-center justify-center group-hover:opacity-90 transition-colors" style={{backgroundColor: '#fce7f3'}}>
                          <span className="font-medium" style={{fontFamily: 'Sora', color: '#E2007A'}}>
                            {candidate.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        
                        {/* Candidate info - Clean format */}
                        <div className="flex-1 min-w-0">
                          {/* Name and pronouns */}
                          <div className="mb-2">
                            <h3 className="font-medium text-gray-900 group-hover:text-pink-600 transition-colors" style={{fontFamily: 'Sora', fontSize: '18px'}}>
                              {candidate.name} <span className="text-sm text-gray-500 font-normal">({candidate.pronouns || 'she/her'})</span>
                            </h3>
                          </div>
                          
                          {/* Job applied for */}
                          <div className="mb-2">
                            <span className="text-sm text-gray-700" style={{fontFamily: 'Poppins'}}>
                              Applied for: <span className="font-medium">Digital Marketing Assistant</span>
                            </span>
                          </div>
                          
                          {/* Match Rating - Prominent display */}
                          <div className="mb-3">
                            <span className="font-bold text-2xl" style={{color: '#E2007A'}}>{candidate.matchScore}%</span>
                            <span className="text-sm text-gray-600 ml-1">match</span>
                          </div>

                          {/* Status */}
                          <div className="mb-3">
                            {getStatusBadge(candidate.status || 'new_application')}
                          </div>

                          {/* Sub-status description */}
                          <div className="mb-3">
                            <div className="text-sm text-blue-800">
                              {getPersonalizedSubStatusDescription(candidate.status || 'new_application', candidate.firstName)}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Simplified action buttons - brand aligned */}
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Map candidate ID to conversation ID for direct messaging
                            const candidateMessageMapping: Record<string, string> = {
                              '20': '1', // Sarah Chen
                              '21': '2', // James Mitchell
                              '22': '3', // Emma Thompson
                              '23': '4', // Priya Singh
                              '24': '5', // Michael Roberts
                              '25': '6'  // Alex Johnson
                            };
                            const conversationId = candidateMessageMapping[candidate.id.toString()] || '1';
                            setLocation(`/employer-messages?conversation=${conversationId}`);
                          }}
                          className="border-gray-300 text-gray-600 hover:border-pink-600 hover:text-pink-600 hover:bg-pink-50"
                          style={{fontFamily: 'Sora'}}
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Message
                        </Button>
                        
                        <Button
                          size="sm"
                          variant={actionInfo.variant}
                          className={`${actionInfo.className} font-medium`}
                          onClick={(e) => {
                            e.stopPropagation();
                            // Route based on the action type
                            if (actionInfo.text === 'View Interview Details') {
                              setLocation(`/interview-schedule-detail/${candidate.id}`);
                            } else if (actionInfo.text === 'Schedule Interview') {
                              setLocation(`/candidate-next-steps/${candidate.id}`);
                            } else if (actionInfo.text === 'Review Feedback' || actionInfo.text === 'View Feedback') {
                              setLocation(`/provide-update/${candidate.id}`);
                            } else {
                              setLocation(`/candidate-status/${candidate.id}`);
                            }
                          }}
                          style={{fontFamily: 'Sora'}}
                        >
                          {actionInfo.text}
                          {candidate.status !== 'in_progress' && <ArrowRight className="w-4 h-4 ml-1" />}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Pagination (if needed) */}
      {filteredCandidates.length > 10 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {filteredCandidates.length} candidates
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}