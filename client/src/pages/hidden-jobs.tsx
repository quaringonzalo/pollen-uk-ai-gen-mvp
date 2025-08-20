import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Building2, MapPin, Calendar, ExternalLink, Search, Filter, Star, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface HiddenJob {
  id: number;
  role: string;
  company: string;
  pollenApproved: boolean;
  industry: string;
  location: string;
  contractType: string;
  salary?: string;
  applicationDeadline?: string;
  applicationLink?: string;
  description?: string;
  requirements?: string;
  benefits?: string;
  isActive: boolean;
  featured: boolean;
  createdAt: string;
}

export default function HiddenJobs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [contractFilter, setContractFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState<HiddenJob | null>(null);
  const queryClient = useQueryClient();

  const { data: hiddenJobs = [], isLoading } = useQuery({
    queryKey: ["/api/hidden-jobs"],
  });

  const applyMutation = useMutation({
    mutationFn: (jobId: number) => apiRequest(`/api/hidden-jobs/${jobId}/apply`, {
      method: "POST",
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hidden-jobs"] });
    },
  });

  // Filter jobs based on search and filters
  const filteredJobs = hiddenJobs.filter((job: HiddenJob) => {
    const matchesSearch = searchTerm === "" || 
      job.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.industry.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesIndustry = industryFilter === "all" || job.industry === industryFilter;
    const matchesLocation = locationFilter === "all" || job.location.includes(locationFilter);
    const matchesContract = contractFilter === "all" || job.contractType === contractFilter;
    
    return matchesSearch && matchesIndustry && matchesLocation && matchesContract;
  });

  // Get unique values for filters
  const industries = [...new Set(hiddenJobs.map((job: HiddenJob) => job.industry))];
  const locations = [...new Set(hiddenJobs.map((job: HiddenJob) => job.location))];
  const contractTypes = [...new Set(hiddenJobs.map((job: HiddenJob) => job.contractType))];

  // Sort jobs: featured first, then by creation date
  const sortedJobs = filteredJobs.sort((a: HiddenJob, b: HiddenJob) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

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
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Hidden Jobs Board</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Exclusive job opportunities for Pollen users. These hidden gems aren't advertised anywhere else.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
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
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={contractFilter} onValueChange={setContractFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Contract" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {contractTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="text-sm text-gray-600">
          Showing {sortedJobs.length} of {hiddenJobs.length} hidden jobs
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedJobs.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="text-center py-12">
                <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600">Try adjusting your search criteria.</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          sortedJobs.map((job: HiddenJob) => (
            <Card 
              key={job.id} 
              className={`hover:shadow-lg transition-all cursor-pointer border-t-4 ${
                job.featured ? 'border-t-[#ffde59] bg-yellow-50/20' : 
                job.pollenApproved ? 'border-t-[#E2007A] bg-pink-50/20' : 'border-t-gray-300'
              } h-fit`}
              onClick={() => setSelectedJob(job)}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Header with badges */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm leading-5 line-clamp-2 hover:text-[#E2007A] transition-colors">
                        {job.role}
                      </h3>
                    </div>
                    <div className="flex flex-col gap-1 ml-2">
                      {job.featured && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                      {job.pollenApproved && (
                        <CheckCircle className="w-4 h-4 text-[#E2007A]" />
                      )}
                    </div>
                  </div>

                  {/* Company and location */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Building2 className="w-3 h-3 flex-shrink-0" />
                      <span className="font-medium truncate">{job.company}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{job.location}</span>
                    </div>
                  </div>

                  {/* Contract type and salary */}
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs px-2 py-0.5">
                      {job.contractType}
                    </Badge>
                    <Badge variant="secondary" className="text-xs px-2 py-0.5">
                      {job.industry}
                    </Badge>
                  </div>

                  {/* Salary */}
                  {job.salary && (
                    <div className="text-xs font-medium text-gray-700">
                      {job.salary}
                    </div>
                  )}

                  {/* Description preview */}
                  {job.description && (
                    <p className="text-xs text-gray-600 line-clamp-3 leading-4">
                      {job.description}
                    </p>
                  )}

                  {/* Badges and deadline */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex gap-1">
                      {job.pollenApproved && (
                        <Badge className="bg-[#E2007A] text-white text-xs px-2 py-0.5">
                          Pollen
                        </Badge>
                      )}
                      {job.featured && (
                        <Badge className="bg-[#ffde59] text-gray-800 text-xs px-2 py-0.5">
                          Featured
                        </Badge>
                      )}
                    </div>
                    {job.applicationDeadline && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(job.applicationDeadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Job Detail Modal */}
      <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedJob && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <DialogTitle className="text-2xl">{selectedJob.role}</DialogTitle>
                      {selectedJob.featured && (
                        <Star className="w-6 h-6 text-yellow-500 fill-current" />
                      )}
                      {selectedJob.pollenApproved && (
                        <Badge className="bg-[#E2007A] text-white flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Pollen Approved
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-gray-600">
                      <span className="flex items-center gap-1 font-medium">
                        <Building2 className="w-4 h-4" />
                        {selectedJob.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {selectedJob.location}
                      </span>
                      <Badge variant="outline">{selectedJob.contractType}</Badge>
                      {selectedJob.salary && <span>• {selectedJob.salary}</span>}
                    </div>
                  </div>
                </div>
                <DialogDescription>
                  <Badge variant="secondary" className="mt-2">{selectedJob.industry}</Badge>
                  {selectedJob.applicationDeadline && (
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                      <Calendar className="w-4 h-4" />
                      Application deadline: {new Date(selectedJob.applicationDeadline).toLocaleDateString()}
                    </div>
                  )}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {selectedJob.description && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">About this role</h3>
                    <p className="text-gray-600 whitespace-pre-wrap">{selectedJob.description}</p>
                  </div>
                )}
                
                {selectedJob.requirements && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                    <p className="text-gray-600 whitespace-pre-wrap">{selectedJob.requirements}</p>
                  </div>
                )}
                
                {selectedJob.benefits && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Benefits</h3>
                    <p className="text-gray-600 whitespace-pre-wrap">{selectedJob.benefits}</p>
                  </div>
                )}
                
                <div className="flex gap-3 pt-4 border-t">
                  {selectedJob.pollenApproved ? (
                    <Button 
                      className="bg-[#E2007A] hover:bg-[#E2007A]/90 flex-1"
                      onClick={() => {
                        // For Pollen approved jobs, navigate to our job application process
                        window.location.href = `/jobs/${selectedJob.id}`;
                      }}
                    >
                      Apply via Pollen
                    </Button>
                  ) : selectedJob.applicationLink ? (
                    <Button 
                      className="bg-[#E2007A] hover:bg-[#E2007A]/90 flex-1"
                      onClick={() => window.open(selectedJob.applicationLink, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Apply External
                    </Button>
                  ) : (
                    <Button 
                      className="bg-gray-400 cursor-not-allowed flex-1"
                      disabled
                    >
                      No Application Link
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setSelectedJob(null)}>
                    Close
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