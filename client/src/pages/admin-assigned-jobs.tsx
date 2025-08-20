import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Briefcase, Search, ArrowLeft, Clock, Building2,
  Calendar, CheckCircle, Users, Eye, Edit, UserCircle, Filter
} from "lucide-react";
import { useLocation } from "wouter";

interface AssignedJob {
  id: string;
  jobTitle: string;
  companyName: string;
  status: 'live' | 'paused' | 'cancelled' | 'complete' | 'pending_approval';
  assignedDate: string | null;
  assignedTo: string | null; // null means unassigned
  // Actionable sub-status summaries
  totalApplications: number;
  newApplicationsToReview: number;
  pollenInterviewsBooked: number;
  feedbackSent: number;
  candidatesMatchedToEmployer: number;
  // Additional workflow tracking
  interviewsCompleted: number;
  candidatesInProgress: number;
  // Job approval fields
  submittedDate?: string;
  submittedBy?: string;
  needsApproval?: boolean;
}

export default function AdminAssignedJobs() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedAssignment, setSelectedAssignment] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"all" | "approval" | "management">("all");
  const { toast } = useToast();

  // Read tab parameter from URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    
    if (tabParam === 'awaiting-approval') {
      setActiveTab('approval');
    } else if (tabParam === 'management') {
      setActiveTab('management');
    } else {
      setActiveTab('all');
    }
  }, []);

  // Fetch all jobs (assigned and unassigned)
  const { data: assignedJobs = [], isLoading } = useQuery<AssignedJob[]>({
    queryKey: ["/api/admin/all-jobs"], // All jobs for admin overview
    initialData: [
      // Holly's assigned jobs
      {
        id: "1",
        jobTitle: "Marketing Assistant",
        companyName: "TechFlow Solutions",
        status: "live",
        assignedDate: "2024-01-10",
        assignedTo: "Holly (You)",
        totalApplications: 15,
        newApplicationsToReview: 5,
        pollenInterviewsBooked: 3,
        feedbackSent: 6,
        candidatesMatchedToEmployer: 1,
        interviewsCompleted: 4,
        candidatesInProgress: 8
      },
      {
        id: "2", 
        jobTitle: "UX Designer",
        companyName: "Creative Studios",
        status: "live",
        assignedDate: "2024-01-08",
        assignedTo: "Holly (You)",
        totalApplications: 12,
        newApplicationsToReview: 2,
        pollenInterviewsBooked: 1,
        feedbackSent: 8,
        candidatesMatchedToEmployer: 2,
        interviewsCompleted: 6,
        candidatesInProgress: 3
      },
      // Karen's assigned jobs
      {
        id: "3",
        jobTitle: "Junior Developer",
        companyName: "StartupCo",
        status: "live",
        assignedDate: "2024-01-05",
        assignedTo: "Karen Whitelaw",
        totalApplications: 18,
        newApplicationsToReview: 4,
        pollenInterviewsBooked: 2,
        feedbackSent: 10,
        candidatesMatchedToEmployer: 2,
        interviewsCompleted: 8,
        candidatesInProgress: 6
      },
      {
        id: "4",
        jobTitle: "Content Writer",
        companyName: "Digital Agency",
        status: "complete",
        assignedDate: "2024-01-02",
        assignedTo: "Karen Whitelaw",
        totalApplications: 22,
        newApplicationsToReview: 0,
        pollenInterviewsBooked: 0,
        feedbackSent: 22,
        candidatesMatchedToEmployer: 1,
        interviewsCompleted: 8,
        candidatesInProgress: 0
      },
      // Sophie's assigned jobs
      {
        id: "5",
        jobTitle: "Sales Coordinator",
        companyName: "SalesForce Pro",
        status: "live",
        assignedDate: "2024-01-12",
        assignedTo: "Sophie O'Brien",
        totalApplications: 8,
        newApplicationsToReview: 3,
        pollenInterviewsBooked: 1,
        feedbackSent: 4,
        candidatesMatchedToEmployer: 0,
        interviewsCompleted: 2,
        candidatesInProgress: 3
      },
      {
        id: "6",
        jobTitle: "Data Analyst",
        companyName: "Analytics Hub",
        status: "live",
        assignedDate: "2024-01-15",
        assignedTo: "Sophie O'Brien",
        totalApplications: 11,
        newApplicationsToReview: 4,
        pollenInterviewsBooked: 2,
        feedbackSent: 5,
        candidatesMatchedToEmployer: 0,
        interviewsCompleted: 3,
        candidatesInProgress: 5
      },
      // Jobs pending approval
      {
        id: "7",
        jobTitle: "Social Media Manager",
        companyName: "Brand Builders Ltd",
        status: "pending_approval",
        assignedDate: null,
        assignedTo: null,
        totalApplications: 0,
        newApplicationsToReview: 0,
        pollenInterviewsBooked: 0,
        feedbackSent: 0,
        candidatesMatchedToEmployer: 0,
        interviewsCompleted: 0,
        candidatesInProgress: 0,
        submittedDate: "2025-01-17",
        submittedBy: "Brand Builders Ltd",
        needsApproval: true
      },
      {
        id: "8",
        jobTitle: "Junior Accountant",
        companyName: "Finance First",
        status: "pending_approval",
        assignedDate: null,
        assignedTo: null,
        totalApplications: 0,
        newApplicationsToReview: 0,
        pollenInterviewsBooked: 0,
        feedbackSent: 0,
        candidatesMatchedToEmployer: 0,
        interviewsCompleted: 0,
        candidatesInProgress: 0,
        submittedDate: "2025-01-16",
        submittedBy: "Finance First",
        needsApproval: true
      },
      {
        id: "9",
        jobTitle: "Customer Success Representative",
        companyName: "TechSupport Pro",
        status: "pending_approval",
        assignedDate: null,
        assignedTo: null,
        totalApplications: 0,
        newApplicationsToReview: 0,
        pollenInterviewsBooked: 0,
        feedbackSent: 0,
        candidatesMatchedToEmployer: 0,
        interviewsCompleted: 0,
        candidatesInProgress: 0,
        submittedDate: "2025-01-15",
        submittedBy: "TechSupport Pro",
        needsApproval: true
      },
      {
        id: "10",
        jobTitle: "Graphic Designer",
        companyName: "Creative Agency Plus",
        status: "pending_approval",
        assignedDate: null,
        assignedTo: null,
        totalApplications: 0,
        newApplicationsToReview: 0,
        pollenInterviewsBooked: 0,
        feedbackSent: 0,
        candidatesMatchedToEmployer: 0,
        interviewsCompleted: 0,
        candidatesInProgress: 0,
        submittedDate: "2025-01-14",
        submittedBy: "Creative Agency Plus",
        needsApproval: true
      },
      {
        id: "11",
        jobTitle: "HR Assistant",
        companyName: "People Solutions",
        status: "pending_approval",
        assignedDate: null,
        assignedTo: null,
        totalApplications: 0,
        newApplicationsToReview: 0,
        pollenInterviewsBooked: 0,
        feedbackSent: 0,
        candidatesMatchedToEmployer: 0,
        interviewsCompleted: 0,
        candidatesInProgress: 0,
        submittedDate: "2025-01-13",
        submittedBy: "People Solutions",
        needsApproval: true
      },
      {
        id: "12",
        jobTitle: "Operations Coordinator",
        companyName: "Logistics Pro",
        status: "pending_approval",
        assignedDate: null,
        assignedTo: null,
        totalApplications: 0,
        newApplicationsToReview: 0,
        pollenInterviewsBooked: 0,
        feedbackSent: 0,
        candidatesMatchedToEmployer: 0,
        interviewsCompleted: 0,
        candidatesInProgress: 0,
        submittedDate: "2025-01-12",
        submittedBy: "Logistics Pro",
        needsApproval: true
      },
      {
        id: "13",
        jobTitle: "Digital Marketing Specialist", 
        companyName: "Marketing Masters",
        status: "pending_approval",
        assignedDate: null,
        assignedTo: null,
        totalApplications: 0,
        newApplicationsToReview: 0,
        pollenInterviewsBooked: 0,
        feedbackSent: 0,
        candidatesMatchedToEmployer: 0,
        interviewsCompleted: 0,
        candidatesInProgress: 0,
        submittedDate: "2025-01-11",
        submittedBy: "Marketing Masters",
        needsApproval: true
      }
    ]
  });


  // Filter jobs based on tab selection and other filters
  const filteredJobs = assignedJobs.filter(job => {
    const matchesSearch = job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || job.status === selectedStatus;
    const matchesAssignment = selectedAssignment === "all" || 
                             (selectedAssignment === "assigned" && job.assignedTo !== null) ||
                             (selectedAssignment === "mine" && job.assignedTo === "Holly (You)") ||
                             (selectedAssignment === "karen" && job.assignedTo === "Karen Whitelaw") ||
                             (selectedAssignment === "sophie" && job.assignedTo === "Sophie O'Brien");
    
    // Tab-based filtering
    const matchesTab = activeTab === "all" || 
                      (activeTab === "approval" && job.needsApproval) ||
                      (activeTab === "management" && !job.needsApproval);
    
    return matchesSearch && matchesStatus && matchesAssignment && matchesTab;
  });

  // Get counts for tab badges
  const approvalCount = assignedJobs.filter(job => job.needsApproval).length;
  const managementCount = assignedJobs.filter(job => !job.needsApproval).length;


  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return <Badge className="bg-green-100 text-green-800">Live</Badge>;
      case 'paused':
        return <Badge className="bg-orange-100 text-orange-800">Paused</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      case 'complete':
        return <Badge className="bg-blue-100 text-blue-800">Complete</Badge>;
      case 'pending_approval':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Approval</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const hasActionRequired = (job: AssignedJob) => {
    return job.newApplicationsToReview > 0 || job.pollenInterviewsBooked > 0 || job.needsApproval;
  };

  const getActionSummary = (job: AssignedJob) => {
    const actions = [];
    if (job.needsApproval) {
      actions.push("Job approval required");
    }
    if (job.newApplicationsToReview > 0) {
      actions.push(`${job.newApplicationsToReview} new applications to review`);
    }
    if (job.pollenInterviewsBooked > 0) {
      actions.push(`${job.pollenInterviewsBooked} pollen interviews booked`);
    }
    if (actions.length === 0) {
      return "No immediate actions required";
    }
    return actions.join(" • ");
  };

  return (
    <div className="min-h-screen bg-gray-50 admin-compact-mode">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setLocation("/admin")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-xl font-bold text-gray-900">Jobs Management</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Toggle Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-1 mb-6">
          <div className="flex">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "all"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Users className="h-4 w-4" />
              All Jobs
              <Badge variant="outline" className="ml-1 text-xs">
                {assignedJobs.length}
              </Badge>
            </button>
            <button
              onClick={() => setActiveTab("approval")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "approval"
                  ? "bg-yellow-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <CheckCircle className="h-4 w-4" />
              Jobs Awaiting Approval
              <Badge variant="outline" className="ml-1 text-xs">
                {approvalCount}
              </Badge>
            </button>
            <button
              onClick={() => setActiveTab("management")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "management"
                  ? "bg-green-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Eye className="h-4 w-4" />
              Applicant Management
              <Badge variant="outline" className="ml-1 text-xs">
                {managementCount}
              </Badge>
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedAssignment}
            onChange={(e) => setSelectedAssignment(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="all">All Jobs</option>
            <option value="mine">My Assigned Jobs</option>
            <option value="karen">Karen's Jobs</option>
            <option value="sophie">Sophie's Jobs</option>
            <option value="assigned">All Assigned</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending_approval">Pending Approval</option>
            <option value="live">Live</option>
            <option value="paused">Paused</option>
            <option value="cancelled">Cancelled</option>
            <option value="complete">Complete</option>
          </select>
        </div>

        {/* Jobs Section */}
        <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {activeTab === "approval" 
                  ? `Jobs Awaiting Approval (${filteredJobs.length})`
                  : activeTab === "management"
                  ? `Applicant Management (${filteredJobs.length})`
                  : `All Jobs (${filteredJobs.length})`
                }
              </h3>
              {activeTab === "approval" && filteredJobs.length > 0 && (
                <div className="text-sm text-gray-600 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                  <CheckCircle className="h-4 w-4 inline mr-1" />
                  {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} need{filteredJobs.length === 1 ? 's' : ''} your approval
                </div>
              )}
              {activeTab === "management" && filteredJobs.length > 0 && (
                <div className="text-sm text-gray-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                  <Eye className="h-4 w-4 inline mr-1" />
                  {filteredJobs.filter(j => j.newApplicationsToReview > 0 || j.pollenInterviewsBooked > 0).length} job{filteredJobs.filter(j => j.newApplicationsToReview > 0 || j.pollenInterviewsBooked > 0).length !== 1 ? 's' : ''} need attention
                </div>
              )}
            </div>
            
            {/* Legend for visual indicators */}
            {filteredJobs.some(job => hasActionRequired(job)) && (
              <div className="flex items-center gap-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-md border">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-green-500 rounded"></div>
                  <span>Green border indicates action required</span>
                </div>
              </div>
            )}
            
            {filteredJobs.map((job) => (
              <Card 
                key={job.id} 
                className={`bg-white hover:shadow-md transition-shadow cursor-pointer ${
                  hasActionRequired(job) ? 'border-l-4 border-l-green-500' : ''
                }`}
                onClick={() => setLocation(`/admin/job-applicants-grid/${job.id}`)}
              >
                <CardContent className="p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-base font-semibold text-gray-900">{job.jobTitle}</h3>
                        {getStatusBadge(job.status)}
                        {job.assignedTo ? (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                            <UserCircle className="h-3 w-3 mr-1" />
                            {job.assignedTo}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">
                            <UserCircle className="h-3 w-3 mr-1" />
                            Unassigned
                          </Badge>
                        )}

                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 mb-4">
                        <Building2 className="h-4 w-4 mr-2" />
                        {job.companyName}
                        {job.assignedDate && (
                          <>
                            <span className="mx-2">•</span>
                            <Calendar className="h-4 w-4 mr-1" />
                            Assigned {new Date(job.assignedDate).toLocaleDateString()}
                          </>
                        )}
                      </div>

                      {/* Actionable Sub-Status Summary - Compact */}
                      <div className="flex gap-3 text-sm mb-2">
                        <span className="text-gray-600">{job.totalApplications} Total</span>
                        
                        {job.newApplicationsToReview > 0 && (
                          <span className="text-green-700 font-medium">{job.newApplicationsToReview} New</span>
                        )}
                        
                        {job.pollenInterviewsBooked > 0 && (
                          <span className="text-blue-700 font-medium">{job.pollenInterviewsBooked} Interviews</span>
                        )}
                        
                        <span className="text-purple-700">{job.feedbackSent} Feedback</span>
                        
                        {job.candidatesMatchedToEmployer > 0 && (
                          <span className="text-yellow-700 font-medium">{job.candidatesMatchedToEmployer} Matched</span>
                        )}
                        

                      </div>

                      {/* Job Posting Link - Subtle - Only show for approved jobs */}
                      {!job.needsApproval && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-50 h-7 px-2 font-normal"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(`/job-detail/job-${job.id.toString().padStart(3, '0')}?admin=true`, '_blank');
                            }}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            See Job Posting
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      {job.needsApproval ? (
                        // Review action for pending jobs
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLocation(`/admin/job-review/${job.id}`);
                          }}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Review Job
                        </Button>
                      ) : (
                        // Standard actions for assigned/live jobs
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLocation(`/admin/job-applicants-grid/${job.id}`);
                          }}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Candidates
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>


      </div>
    </div>
  );
}