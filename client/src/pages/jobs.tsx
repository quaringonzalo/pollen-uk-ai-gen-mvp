import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Building2, MapPin, Calendar, ExternalLink, Search, Filter, Star, CheckCircle, Shield, Grid3X3, List, Heart, AlertCircle, Eye, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface Job {
  id: number;
  role: string;
  company: string;
  pollenApproved: boolean;
  industry: string;
  location: string;
  contractType: string | string[]; // Support both single string and array
  salary?: string;
  applicationDeadline?: string;
  applicationLink?: string;
  description?: string;
  requirements?: string;
  benefits?: string;
  isActive: boolean;
  featured: boolean;
  createdAt: string;
  rating?: number; // Star rating for Pollen-approved jobs
  estimatedTime?: string; // E.g. "45-60 min", "30-45 min"
  personalised?: boolean; // Whether this job is personalised for the user
}

export default function Jobs() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState<string[]>(["all"]);
  const [locationFilter, setLocationFilter] = useState<string[]>(["all"]);
  const [contractFilter, setContractFilter] = useState<string[]>(["all"]);
  const [jobTypeFilter, setJobTypeFilter] = useState("all"); // all, pollen, external
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [viewMode, setViewMode] = useState<"personalised" | "all">("personalised");
  const [showAllInPersonalized, setShowAllInPersonalized] = useState(false);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  // Check if user profile is complete enough to apply to Pollen jobs
  const isProfileComplete = (user: any): boolean => {
    if (!user) return false;
    
    // Essential profile fields for job applications
    const hasBasicInfo = user.firstName && user.lastName && user.email;
    const hasBehavioralAssessment = user.behavioralAssessment && user.behavioralAssessment.personalityType;
    
    // For demo purposes, we'll consider the profile complete if user has basic info and behavioral assessment
    // In production, this might include additional checks like:
    // - Skills assessments completed
    // - Work experience added  
    // - Education details
    // - Profile checkpoints completed
    
    return hasBasicInfo && hasBehavioralAssessment;
  };

  // Fetch both job types
  const { data: hiddenJobs = [], isLoading: loadingHidden } = useQuery({
    queryKey: ["/api/hidden-jobs"],
  });

  const { data: externalJobs = [], isLoading: loadingExternal } = useQuery({
    queryKey: ["/api/external-jobs"],
  });

  // Combine all jobs
  const allJobs = [...(Array.isArray(hiddenJobs) ? hiddenJobs : []), ...(Array.isArray(externalJobs) ? externalJobs : [])];
  const isLoading = loadingHidden || loadingExternal;

  const applyMutation = useMutation({
    mutationFn: (jobId: number) => apiRequest("POST", `/api/hidden-jobs/${jobId}/apply`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hidden-jobs"] });
    },
  });

  const saveJobMutation = useMutation({
    mutationFn: async (jobId: number) => {
      // Check if job is already saved
      const isAlreadySaved = Array.isArray(savedJobs) && savedJobs.some((saved: any) => String(saved.id) === String(jobId));
      
      // Ensure authentication first
      const demoResponse = await fetch('/api/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'job_seeker' })
      });
      
      if (!demoResponse.ok) {
        throw new Error('Authentication failed');
      }
      
      // Wait a moment for session to be established
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (isAlreadySaved) {
        const response = await fetch(`/api/saved-jobs/${jobId}`, {
          method: 'DELETE',
          credentials: 'include'
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to remove saved job');
        }
        return { action: 'removed' };
      } else {
        const response = await fetch(`/api/saved-jobs/${jobId}`, {
          method: 'POST',
          credentials: 'include'
        });
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to save job');
        }
        return { action: 'saved' };
      }
    },
    onSuccess: (data, jobId) => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-jobs"] });
      
      if (data.action === 'removed') {
        toast({
          title: "Job removed",
          description: "The job has been removed from your saved list.",
        });
      } else {
        toast({
          title: "Job saved",
          description: "The job has been added to your saved list.",
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update saved job. Please try again.",
        variant: "destructive",
      });
    },
  });

  const { data: savedJobs = [] } = useQuery({
    queryKey: ["/api/saved-jobs"],
  });

  // Helper function to get job contract types as array
  const getJobContractTypes = (job: Job): string[] => {
    if (Array.isArray(job.contractType)) {
      return job.contractType;
    }
    return [job.contractType];
  };

  // Filter jobs based on search and filters
  const filteredJobs = allJobs.filter((job: Job) => {
    const matchesSearch = searchTerm === "" || 
      job.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.industry.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesIndustry = industryFilter.includes("all") || industryFilter.includes(job.industry);
    let cleanLocation = job.location.replace(/, UK$|, United Kingdom$/, '');
    // Consolidate remote options for filtering
    if (cleanLocation === 'Remote (UK)' || cleanLocation === 'Remote UK') {
      cleanLocation = 'Remote';
    }
    const matchesLocation = locationFilter.includes("all") || locationFilter.some(filter => cleanLocation.includes(filter));
    
    // Updated contract matching for multiple selections
    const matchesContract = contractFilter.includes("all") || 
      getJobContractTypes(job).some(type => contractFilter.includes(type));
    
    const matchesJobType = jobTypeFilter === "all" || 
      (jobTypeFilter === "pollen" && job.pollenApproved) ||
      (jobTypeFilter === "external" && !job.pollenApproved);
    
    return matchesSearch && matchesIndustry && matchesLocation && matchesContract && matchesJobType;
  });

  // Get unique values for filters
  const industries = Array.from(new Set(allJobs.map((job: Job) => job.industry)));
  const locations = Array.from(new Set(allJobs.map((job: Job) => {
    let location = job.location.replace(/, UK$|, United Kingdom$/, ''); // Remove UK/United Kingdom suffixes
    // Consolidate remote options
    if (location === 'Remote (UK)' || location === 'Remote UK') {
      location = 'Remote';
    }
    return location;
  })));
  // Flatten all contract types from all jobs
  const contractTypes = Array.from(new Set(
    allJobs.flatMap((job: Job) => getJobContractTypes(job))
  ));

  // Helper function to determine if a job is personalised for the user
  const isJobPersonalized = (job: Job): boolean => {
    if (!user) return false;
    
    // Simple personalization logic - you can expand this based on user profile
    const userSkills = user.skills || [];
    const userPreferences = user.preferences || {};
    
    // Jobs are personalised if they match user's industry preference or are entry-level
    const matchesIndustry = userPreferences.preferredIndustries?.includes(job.industry);
    const isEntryLevel = job.role.toLowerCase().includes('junior') || 
                        job.role.toLowerCase().includes('assistant') || 
                        job.role.toLowerCase().includes('coordinator');
    
    return matchesIndustry || isEntryLevel || job.pollenApproved;
  };

  // Get jobs based on view mode
  const getJobsForDisplay = () => {
    if (viewMode === "all") {
      // Table view - show all filtered jobs
      return filteredJobs;
    } else {
      // Card view - show personalised jobs first, or all if user chooses to see all
      if (showAllInPersonalized) {
        return filteredJobs;
      }
      return filteredJobs.filter(job => isJobPersonalized(job));
    }
  };

  // Sort jobs: featured first, Pollen-approved next, then by creation date
  const sortedJobs = getJobsForDisplay().sort((a: Job, b: Job) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    if (a.pollenApproved && !b.pollenApproved) return -1;
    if (!a.pollenApproved && b.pollenApproved) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Helper function to generate company website URL for external jobs
  const getCompanyWebsiteUrl = (companyName: string): string => {
    // Convert company name to a reasonable website URL
    const domain = companyName.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    return `https://www.${domain}.com`;
  };

  const handleJobAction = (job: Job) => {
    console.log('🚀 Button clicked! Job:', job);
    console.log('🚀 User data:', user);
    console.log('🚀 Is Pollen approved?', job.pollenApproved);
    
    if (job.pollenApproved) {
      // DEMO MODE: Profile completion check bypassed for demo purposes
      // In live version, uncomment the code below to enforce profile completion:
      /*
      const profileComplete = isProfileComplete(user);
      console.log('🚀 Is profile complete?', profileComplete);
      
      if (!profileComplete) {
        console.log('🚀 Profile not complete, showing toast');
        toast({
          title: "Complete Your Profile",
          description: "You need to complete your profile and assessments before applying to Pollen approved jobs.",
          variant: "destructive",
        });
        // Redirect to profile completion
        setLocation("/profile-checkpoints");
        return;
      }
      */

      // Map to proper job application pages
      const jobIdMap: { [key: number]: string } = {
        1: "job-001", // Marketing Coordinator maps to job-001
        2: "job-002", // Junior Data Analyst maps to job-002
        3: "job-003", // Content Marketing Assistant maps to job-003
        4: "job-004",
        5: "job-005",
        6: "job-006"
      };
      
      const mappedId = jobIdMap[job.id] || "job-001";
      console.log('🚀 Navigating to:', `/job-application/${mappedId}`);
      setLocation(`/job-application/${mappedId}`);
    } else {
      // External jobs don't require profile completion - open application links directly
      console.log('🚀 External job, opening link:', job.applicationLink);
      if (job.applicationLink) {
        window.open(job.applicationLink, '_blank');
      } else {
        console.log('🚀 No application link found!');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-40 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-4 jobs-page">
      <div className="text-left mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Find Your Next Opportunity</h1>
        
        {/* Job Types Explanation */}
        <div className="grid md:grid-cols-2 gap-4 w-full mb-6">
          {/* Pollen Approved Jobs */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-[#E2007A] rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-[#E2007A] text-sm">Pollen Approved Jobs</h3>
                <p className="text-xs text-gray-600">Vetted employers with fair hiring</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3 text-[#E2007A]" />
                <span>No CV required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3 text-[#E2007A]" />
                <span>Guaranteed feedback</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3 text-[#E2007A]" />
                <span>Custom assessments</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3 h-3 text-[#E2007A]" />
                <span>Fair hiring process</span>
              </div>
            </div>
          </div>

          {/* External Jobs */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                <ExternalLink className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-700 text-sm">External Jobs</h3>
                <p className="text-xs text-gray-500">Entry-level opportunities from other sites</p>
              </div>
            </div>
            <div className="text-xs text-gray-600">
              <p>These jobs are from external websites. We thought they looked like a safe bet, but they aren't affiliated with Pollen, and we don't endorse the companies or positions listed, so please make sure to research each opportunity before applying.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border space-y-3">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search jobs, companies, or industries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-4">
            <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Jobs</SelectItem>
                <SelectItem value="pollen">Pollen Approved</SelectItem>
                <SelectItem value="external">External</SelectItem>
              </SelectContent>
            </Select>
            <div className="w-[180px]">
              <Select value={industryFilter.includes("all") ? "all" : (industryFilter.length === 1 ? industryFilter[0] : "multiple")} onValueChange={(value) => {
                if (value === "all") {
                  setIndustryFilter(["all"]);
                } else {
                  if (industryFilter.includes("all")) {
                    setIndustryFilter([value]);
                  } else {
                    if (industryFilter.includes(value)) {
                      const newFilter = industryFilter.filter(i => i !== value);
                      setIndustryFilter(newFilter.length === 0 ? ["all"] : newFilter);
                    } else {
                      setIndustryFilter([...industryFilter.filter(i => i !== "all"), value]);
                    }
                  }
                }
              }}>
                <SelectTrigger>
                  <SelectValue>
                    {industryFilter.includes("all") 
                      ? "All Industries" 
                      : industryFilter.length === 1 
                        ? industryFilter[0]
                        : `${industryFilter.length} selected`
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  {industries.filter(industry => industry && industry.trim()).map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={industryFilter.includes(industry) && !industryFilter.includes("all")}
                          readOnly
                          className="w-3 h-3"
                        />
                        {industry}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-[180px]">
              <Select value={locationFilter.includes("all") ? "all" : (locationFilter.length === 1 ? locationFilter[0] : "multiple")} onValueChange={(value) => {
                if (value === "all") {
                  setLocationFilter(["all"]);
                } else {
                  if (locationFilter.includes("all")) {
                    setLocationFilter([value]);
                  } else {
                    if (locationFilter.includes(value)) {
                      const newFilter = locationFilter.filter(l => l !== value);
                      setLocationFilter(newFilter.length === 0 ? ["all"] : newFilter);
                    } else {
                      setLocationFilter([...locationFilter.filter(l => l !== "all"), value]);
                    }
                  }
                }
              }}>
                <SelectTrigger>
                  <SelectValue>
                    {locationFilter.includes("all") 
                      ? "All Locations" 
                      : locationFilter.length === 1 
                        ? locationFilter[0]
                        : `${locationFilter.length} selected`
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.filter(location => location && location.trim()).map((location) => (
                    <SelectItem key={location} value={location}>
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={locationFilter.includes(location) && !locationFilter.includes("all")}
                          readOnly
                          className="w-3 h-3"
                        />
                        {location}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-[180px]">
              <Select value={contractFilter.includes("all") ? "all" : (contractFilter.length === 1 ? contractFilter[0] : "multiple")} onValueChange={(value) => {
                if (value === "all") {
                  setContractFilter(["all"]);
                } else {
                  if (contractFilter.includes("all")) {
                    setContractFilter([value]);
                  } else {
                    if (contractFilter.includes(value)) {
                      const newFilter = contractFilter.filter(t => t !== value);
                      setContractFilter(newFilter.length === 0 ? ["all"] : newFilter);
                    } else {
                      setContractFilter([...contractFilter.filter(t => t !== "all"), value]);
                    }
                  }
                }
              }}>
                <SelectTrigger>
                  <SelectValue>
                    {contractFilter.includes("all") 
                      ? "All Types" 
                      : contractFilter.length === 1 
                        ? contractFilter[0]
                        : `${contractFilter.length} selected`
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {contractTypes.filter(type => type && type.trim()).map((type) => (
                    <SelectItem key={type} value={type}>
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          checked={contractFilter.includes(type) && !contractFilter.includes("all")}
                          readOnly
                          className="w-3 h-3"
                        />
                        {type}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary and View Toggle */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {sortedJobs.length} of {allJobs.length} jobs
        </p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-[#E2007A]" />
              <span>Pollen Approved</span>
            </div>
            <div className="flex items-center gap-1">
              <ExternalLink className="w-3 h-3 text-gray-400" />
              <span>External Application</span>
            </div>
          </div>
          <div className="flex items-center gap-1 border rounded-md">
            <Button
              variant={viewMode === "personalised" ? "default" : "ghost"}
              size="sm"
              onClick={() => {
                setViewMode("personalised");
                setShowAllInPersonalized(false);
              }}
              className="h-8 px-3 text-xs"
            >
              <Star className="w-4 h-4 mr-1" />
              For You
            </Button>
            <Button
              variant={viewMode === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("all")}
              className="h-8 px-3 text-xs"
            >
              <List className="w-4 h-4 mr-1" />
              All Jobs
            </Button>
          </div>
        </div>
      </div>

      {/* Jobs Display */}
      {viewMode === "all" ? (
        // Table View
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-medium text-gray-900 w-[280px]">Role</th>
                <th className="text-left p-4 font-medium text-gray-900 w-[180px]">Company</th>
                <th className="text-left p-4 font-medium text-gray-900 w-[140px]">Location</th>
                <th className="text-left p-4 font-medium text-gray-900 w-[100px]">Type</th>
                <th className="text-left p-4 font-medium text-gray-900 w-[120px]">Salary</th>
                <th className="text-left p-4 font-medium text-gray-900 w-[200px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedJobs.map((job: Job) => {
                const isJobSaved = Array.isArray(savedJobs) && savedJobs.some((saved: any) => String(saved.id) === String(job.id));
                return (
                  <tr key={job.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {job.pollenApproved ? (
                          <Shield className="w-4 h-4 text-[#E2007A] flex-shrink-0" />
                        ) : (
                          <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        )}
                        <div>
                          <h3 className="font-medium text-gray-900">{job.role}</h3>
                          {job.pollenApproved && job.rating && (
                            <div className="flex items-center gap-1 mt-1" title="Average applicant rating from candidates who've completed assessments">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs text-gray-600">{job.rating} applicant rating</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-left">
                        {job.pollenApproved ? (
                          <a
                            href={`/company/${job.company.toLowerCase().replace(/\s+/g, '-')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-900 font-medium hover:text-[#E2007A] hover:underline cursor-pointer text-left"
                          >
                            {job.company}
                          </a>
                        ) : (
                          <a
                            href={getCompanyWebsiteUrl(job.company)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-900 font-medium hover:text-blue-600 hover:underline cursor-pointer text-left"
                          >
                            {job.company}
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-gray-600">
                        <MapPin className="w-3 h-3" />
                        <span className="text-sm">{job.location}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="text-xs">
                        {Array.isArray(job.contractType) ? job.contractType[0] : job.contractType}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-900">
                        {job.salary?.startsWith('£') ? job.salary : job.salary ? `£${job.salary}` : "Competitive"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => saveJobMutation.mutate(job.id)}
                          className={isJobSaved ? "text-pink-600" : "text-gray-400"}
                          disabled={saveJobMutation.isPending}
                        >
                          <Heart className={`w-4 h-4 ${isJobSaved ? "fill-current" : ""}`} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedJob(job);
                            setShowJobDetails(true);
                          }}
                          className="text-gray-600 hover:text-[#E2007A] border-gray-300"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Details
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleJobAction(job)}
                          className="bg-[#E2007A] hover:bg-[#E2007A]/90 text-white"
                        >
                          {job.pollenApproved ? "View & Apply" : "Apply"} →
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        // Personalized Card View
        <div className="space-y-4">
          {/* Personalized Jobs Header */}
          {!showAllInPersonalized && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Jobs picked for you</h3>
                    <p className="text-sm text-gray-600">Based on your profile and preferences</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowAllInPersonalized(true)}
                  className="text-blue-600 border-blue-400 hover:bg-blue-500 hover:text-white"
                >
                  View All Jobs
                </Button>
              </div>
            </div>
          )}
          
          {/* Show message if viewing all in personalised mode */}
          {showAllInPersonalized && (
            <div className="flex items-center justify-between bg-gray-50 border rounded-lg p-3 mb-6">
              <div className="flex items-center gap-2 text-gray-600">
                <List className="w-4 h-4" />
                <span className="text-sm">Showing all available jobs</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowAllInPersonalized(false)}
                className="text-blue-600 hover:bg-blue-50"
              >
                Back to personalised
              </Button>
            </div>
          )}
          
          {sortedJobs.length === 0 ? (
            <div className="text-center py-12">
              <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {showAllInPersonalized ? "No jobs found" : "No personalised jobs available"}
              </h3>
              <p className="text-gray-600 mb-4">
                {showAllInPersonalized 
                  ? "Try adjusting your search filters" 
                  : "Complete your profile to get better recommendations"}
              </p>
              {!showAllInPersonalized && (
                <Button 
                  onClick={() => setShowAllInPersonalized(true)}
                  variant="outline"
                  className="text-blue-600 border-blue-400"
                >
                  View All Jobs
                </Button>
              )}
            </div>
          ) : (
            sortedJobs.map((job: Job) => {
              const isJobSaved = Array.isArray(savedJobs) && savedJobs.some((saved: any) => String(saved.id) === String(job.id));
              return (
                <Card key={job.id} className="border border-gray-200 bg-white">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  {/* Company Logo - Improved Design */}
                  <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center border-2 border-gray-50">
                    <span className="text-gray-700 font-bold text-lg">{job.company.charAt(0).toUpperCase()}</span>
                  </div>
                  
                  {/* Job Details - Redesigned Layout */}
                  <div className="flex-1 space-y-3">
                    {/* Job Title and Status */}
                    <div className="space-y-1">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-xl text-gray-900 leading-tight">{job.role}</h3>
                          {job.pollenApproved && (
                            <Badge className="bg-[#E2007A] text-white text-xs font-medium mt-1 w-fit">
                              <Shield className="w-3 h-3 mr-1 text-white" />
                              Pollen Approved
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 text-gray-600">
                        {job.pollenApproved ? (
                          <a
                            href={`/company/${job.company.toLowerCase().replace(/\s+/g, '-')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-700 font-medium text-base hover:text-[#E2007A] hover:underline cursor-pointer"
                          >
                            {job.company}
                          </a>
                        ) : (
                          <a
                            href={getCompanyWebsiteUrl(job.company)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-700 font-medium text-base hover:text-blue-600 hover:underline cursor-pointer"
                          >
                            {job.company}
                          </a>
                        )}
                        
                        {job.pollenApproved && job.rating && (
                          <div className="flex items-center gap-1" title="Average applicant rating from candidates who've completed assessments">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-gray-600">{job.rating} applicant rating</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Job Details Row */}
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-gray-800">{job.salary?.startsWith('£') ? job.salary : job.salary ? `£${job.salary}` : "Competitive"}</span>
                      </div>
                      <Badge variant="outline" className="text-xs border-gray-300">{getJobContractTypes(job)[0]}</Badge>
                    </div>
                    
                    {/* Application Deadline */}
                    {job.applicationDeadline && (
                      <div className="flex items-center gap-1.5 text-orange-600 text-sm bg-orange-50 px-3 py-1.5 rounded-md">
                        <span className="font-medium">Apply by {new Date(job.applicationDeadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    )}
                    
                    {/* External Job Badge */}
                    {!job.pollenApproved && (
                      <Badge variant="outline" className="border-gray-400 text-gray-600 text-xs w-fit">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        External Job
                      </Badge>
                    )}
                  </div>
                  
                  {/* Action Buttons - Vertical Layout */}
                  <div className="flex flex-col gap-2 items-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => saveJobMutation.mutate(job.id)}
                      className={`p-2 ${isJobSaved ? "text-[#E2007A] bg-pink-50" : "text-gray-400 hover:text-[#E2007A] hover:bg-gray-50"}`}
                      disabled={saveJobMutation.isPending}
                    >
                      <Heart className={`w-4 h-4 ${isJobSaved ? "fill-current" : ""}`} />
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedJob(job);
                          setShowJobDetails(true);
                        }}
                        className="text-gray-600 hover:text-[#E2007A] border-gray-300"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Details
                      </Button>
                      <Button 
                        onClick={() => handleJobAction(job)}
                        className="bg-[#E2007A] hover:bg-[#E2007A]/90 text-white px-4 py-2 text-sm font-medium rounded-lg shadow-sm"
                      >
                        {job.pollenApproved ? "View & Apply" : "Apply"} →
                      </Button>
                    </div>
                  </div>
                </div>
                </CardContent>
              </Card>
              );
            })
          )}
        </div>
      )}

      {/* Job Details Modal */}
      <Dialog open={showJobDetails} onOpenChange={setShowJobDetails}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedJob && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-gray-50">
                      <span className="text-gray-700 font-bold text-lg">{selectedJob.company.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <DialogTitle className="text-xl font-semibold text-gray-900">
                        {selectedJob.role}
                      </DialogTitle>
                      {selectedJob.pollenApproved ? (
                        <a
                          href={`/company/${selectedJob.company.toLowerCase().replace(/\s+/g, '-')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 font-medium hover:text-[#E2007A] hover:underline cursor-pointer text-left"
                        >
                          {selectedJob.company}
                        </a>
                      ) : (
                        <a
                          href={getCompanyWebsiteUrl(selectedJob.company)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 font-medium hover:text-blue-600 hover:underline cursor-pointer text-left"
                        >
                          {selectedJob.company}
                        </a>
                      )}
                    </div>
                  </div>
                  {selectedJob.pollenApproved && (
                    <Badge className="bg-[#E2007A] text-white">
                      <Shield className="w-3 h-3 mr-1" />
                      Pollen Approved
                    </Badge>
                  )}
                </div>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {/* Basic Job Information */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedJob.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="font-medium">{selectedJob.salary?.startsWith('£') ? selectedJob.salary : selectedJob.salary ? `£${selectedJob.salary}` : "Competitive salary"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Badge variant="outline">{getJobContractTypes(selectedJob).join(', ')}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Badge variant="outline" className="bg-gray-50">{selectedJob.industry}</Badge>
                  </div>
                </div>

                {/* Application Deadline */}
                {selectedJob.applicationDeadline && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-orange-700">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">Application Deadline: {new Date(selectedJob.applicationDeadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>
                )}

                {/* About this role - Only show for Pollen approved jobs */}
                {selectedJob.description && selectedJob.pollenApproved && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">About this role</h3>
                    <div className="text-gray-700 text-sm leading-relaxed">
                      {selectedJob.description}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setShowJobDetails(false)}
                    className="flex-1"
                  >
                    Close
                  </Button>
                  {!selectedJob.pollenApproved && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(getCompanyWebsiteUrl(selectedJob.company), '_blank')}
                      className="flex-1 text-gray-600 hover:text-blue-600"
                    >
                      <Building2 className="w-4 h-4 mr-2" />
                      View Company
                    </Button>
                  )}
                  <Button 
                    onClick={() => {
                      setShowJobDetails(false);
                      handleJobAction(selectedJob);
                    }}
                    className="bg-[#E2007A] hover:bg-[#E2007A]/90 text-white flex-1"
                  >
                    {selectedJob.pollenApproved ? "View & Apply" : "Apply"} →
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}