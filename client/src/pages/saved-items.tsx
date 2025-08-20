import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Heart, Building2, MapPin, Star, PoundSterling, Clock, 
  ChevronRight, Briefcase, Users, Calendar, ExternalLink, AlertTriangle, X
} from "lucide-react";

interface SavedJob {
  id: string;
  title: string;
  company: {
    name: string;
    logo: string;
    rating: number;
  };
  location: string;
  type: string;
  salary: {
    min: number;
    max: number;
  };
  matchScore: number;
  savedDate: string;
  status: "active" | "closed" | "applied";
  applicationDeadline?: string;
}

interface SavedCompany {
  id: string;
  name: string;
  logo: string;
  industry: string;
  size: string;
  location: string;
  rating: number;
  openRoles: number;
  savedDate: string;
}

export default function SavedItemsPage() {
  const [activeTab, setActiveTab] = useState("jobs");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  // Fetch saved jobs from API
  const { data: savedJobs = [], isLoading: jobsLoading } = useQuery<SavedJob[]>({
    queryKey: ["/api/saved-jobs"],
    refetchOnWindowFocus: false,
  });

  // Fetch saved companies from API  
  const { data: savedCompanies = [], isLoading: companiesLoading } = useQuery<SavedCompany[]>({
    queryKey: ["/api/saved-companies"],
    refetchOnWindowFocus: false,
  });

  // Remove saved job mutation
  const removeSavedJobMutation = useMutation({
    mutationFn: (jobId: string) => apiRequest('DELETE', `/api/saved-jobs/${jobId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-jobs"] });
      toast({
        title: "Job removed",
        description: "The job has been removed from your saved list.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to remove job. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Remove saved company mutation
  const removeSavedCompanyMutation = useMutation({
    mutationFn: (companyId: string) => apiRequest('DELETE', `/api/saved-companies/${companyId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-companies"] });
      toast({
        title: "Company removed",
        description: "The company has been removed from your saved list.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error", 
        description: "Failed to remove company. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Mock saved jobs data for fallback
  const mockSavedJobs: SavedJob[] = [
    {
      id: "job-001",
      title: "Media Planning Assistant",
      company: {
        name: "CreativeMinds Agency",
        logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=50&h=50&fit=crop&crop=centre",
        rating: 4.6
      },
      location: "London, UK",
      type: "Full-time",
      salary: { min: 26000, max: 32000 },
      matchScore: 92,
      savedDate: "2024-01-15",
      status: "active",
      applicationDeadline: "30 Jan 2025"
    },
    {
      id: "job-002",
      title: "Client Relationship Coordinator",
      company: {
        name: "Adaptive Solutions Ltd",
        logo: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=50&h=50&fit=crop&crop=centre",
        rating: 4.4
      },
      location: "Manchester, UK",
      type: "Full-time",
      salary: { min: 25000, max: 28000 },
      matchScore: 85,
      savedDate: "2024-01-12",
      status: "applied",
      applicationDeadline: "25 Jan 2025"
    },
    {
      id: "job-003",
      title: "Marketing Assistant",
      company: {
        name: "Growth Partners",
        logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=50&h=50&fit=crop&crop=centre",
        rating: 4.5
      },
      location: "Birmingham, UK",
      type: "Full-time",
      salary: { min: 25000, max: 30000 },
      matchScore: 81,
      savedDate: "2024-01-10",
      status: "closed",
      applicationDeadline: "15 Jan 2025"
    }
  ];

  // Mock saved companies data for fallback
  const mockSavedCompanies: SavedCompany[] = [
    {
      id: "company-001",
      name: "CreativeMinds Agency",
      logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=50&h=50&fit=crop&crop=centre",
      industry: "Marketing & Advertising",
      size: "50-200 employees",
      location: "London, UK",
      rating: 4.6,
      openRoles: 4,
      savedDate: "2024-01-15"
    },
    {
      id: "company-002",
      name: "TechFlow Solutions",
      logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=50&h=50&fit=crop&crop=centre",
      industry: "Technology",
      size: "100-500 employees",
      location: "Edinburgh, UK",
      rating: 4.3,
      openRoles: 7,
      savedDate: "2024-01-12"
    },
    {
      id: "company-003",
      name: "Future Finance Group",
      logo: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=50&h=50&fit=crop&crop=centre",
      industry: "Financial Services",
      size: "200-1000 employees",
      location: "Manchester, UK",
      rating: 4.1,
      openRoles: 2,
      savedDate: "2024-01-08"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "applied": return "bg-blue-100 text-blue-800";
      case "closed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const removeSavedJob = (jobId: string) => {
    removeSavedJobMutation.mutate(jobId);
  };

  const removeSavedCompany = (companyId: string) => {
    removeSavedCompanyMutation.mutate(companyId);
  };

  // Use real data if available, otherwise fall back to mock data
  const displayedJobs = savedJobs.length > 0 ? savedJobs : mockSavedJobs;
  const displayedCompanies = savedCompanies.length > 0 ? savedCompanies : mockSavedCompanies;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b mb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Saved Items</h1>
              <p className="text-gray-600 text-sm">Your saved jobs and companies</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-red-500">
                {displayedJobs.length + displayedCompanies.length}
              </div>
              <div className="text-xs text-gray-600">Total Saved</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex bg-gray-100 rounded-full p-1 mb-4 w-fit">
            <button
              onClick={() => setActiveTab("jobs")}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-all ${
                activeTab === "jobs"
                  ? "bg-yellow-200 text-gray-900 font-semibold shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
              style={{backgroundColor: activeTab === "jobs" ? "#ffde59" : undefined}}
            >
              <Briefcase className="w-4 h-4" />
              Saved Jobs ({displayedJobs.length})
            </button>
            <button
              onClick={() => setActiveTab("companies")}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-all ${
                activeTab === "companies"
                  ? "bg-yellow-200 text-gray-900 font-semibold shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
              style={{backgroundColor: activeTab === "companies" ? "#ffde59" : undefined}}
            >
              <Building2 className="w-4 h-4" />
              Saved Companies ({displayedCompanies.length})
            </button>
          </div>

          <TabsContent value="jobs">
            <div className="space-y-3">
              {displayedJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <img
                        src={job.company.logo}
                        alt={`${job.company.name} logo`}
                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                              {job.title}
                            </h3>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-gray-700">{job.company.name}</span>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-sm text-gray-600">{job.company.rating}</span>
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mb-1">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {job.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {job.type}
                              </span>
                              <span className="flex items-center gap-1">
                                <PoundSterling className="w-4 h-4" />
                                £{job.salary.min.toLocaleString()} - £{job.salary.max.toLocaleString()}
                              </span>
                            </div>
                            {job.applicationDeadline && (
                              <div className="flex items-center gap-1 text-xs text-orange-600 mb-1">
                                <AlertTriangle className="w-4 h-4" />
                                <span>Apply by {job.applicationDeadline}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={getStatusColor(job.status)}>
                                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                Saved on {new Date(job.savedDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeSavedJob(job.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            disabled={removeSavedJobMutation.isPending}
                          >
                            <X className="w-4 h-4" />
                            {removeSavedJobMutation.isPending ? "Removing..." : "Remove"}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setLocation(`/company-profile/${job.company.name.toLowerCase().replace(/\s+/g, '-')}`)}
                          >
                            <Building2 className="w-4 h-4 mr-2" />
                            View Company
                          </Button>
                          <Button 
                            size="sm" 
                            disabled={job.status === "closed"}
                            onClick={() => job.status !== "closed" && job.status !== "applied" ? setLocation(`/job-application/${job.id}`) : undefined}
                          >
                            <Briefcase className="w-4 h-4 mr-2" />
                            {job.status === "applied" ? "Applied" : job.status === "closed" ? "Closed" : "Apply Now"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {displayedJobs.length === 0 && (
                <Card className="text-center py-8">
                  <CardContent>
                    <Heart className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-base font-medium text-gray-900 mb-2">No saved jobs yet</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Start saving jobs you're interested in to keep track of them here
                    </p>
                    <Button onClick={() => setLocation('/job-recommendations')}>
                      Browse Jobs
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="companies">
            <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-3 h-3 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">Smart Job Alerts</h3>
                  <p className="text-xs text-gray-700">
                    You'll automatically receive notifications when these companies post new roles that match your skills and interests. 
                    No need to keep checking - we'll let you know when opportunities arise.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {displayedCompanies.map((company) => (
                <Card key={company.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <img
                          src={company.logo}
                          alt={`${company.name} logo`}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {company.name}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600">{company.rating}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-600 mb-1">
                            <span className="flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              {company.industry}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {company.size}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {company.location}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                              {company.openRoles} open roles
                            </Badge>
                            <span className="text-xs text-gray-500">
                              Saved on {new Date(company.savedDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSavedCompany(company.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          disabled={removeSavedCompanyMutation.isPending}
                        >
                          <X className="w-4 h-4" />
                          {removeSavedCompanyMutation.isPending ? "Removing..." : "Remove"}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setLocation(`/company-profile/${company.name.toLowerCase().replace(/\s+/g, '-')}`)}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Profile
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => setLocation(`/company-profile/${company.name.toLowerCase().replace(/\s+/g, '-')}`)}
                        >
                          <Briefcase className="w-4 h-4 mr-2" />
                          View Jobs ({company.openRoles})
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {displayedCompanies.length === 0 && (
                <Card className="text-center py-8">
                  <CardContent>
                    <Building2 className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-base font-medium text-gray-900 mb-2">No saved companies yet</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Save companies you're interested in to keep track of their job openings
                    </p>
                    <Button onClick={() => setLocation('/companies')}>
                      Explore Companies
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}