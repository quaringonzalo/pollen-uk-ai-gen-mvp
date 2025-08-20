import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, Clock, PoundSterling, Users, Star, Filter, Search,
  Briefcase, Building, Calendar, ArrowRight, Heart, Bookmark
} from "lucide-react";

interface Job {
  id: number;
  title: string;
  description: string;
  employerId: number;
  location: string;
  isRemote: boolean;
  salaryMin: string;
  salaryMax: string;
  requiredSkills: string[];
  preferredSkills: string[];
  challengeId?: number;
  status: string;
  createdAt: string;
  employer?: {
    companyName: string;
    industry: string;
  };
  matchScore?: number;
}

export default function JobOpportunities() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [remoteFilter, setRemoteFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  const { data: jobs, isLoading } = useQuery({
    queryKey: ["/api/jobs"]
  });

  const { data: applications } = useQuery({
    queryKey: ["/api/applications/job-seeker/1"]
  });

  // Mock match scores for demo
  const jobsWithScores = jobs?.map((job: Job) => ({
    ...job,
    matchScore: Math.floor(Math.random() * 30) + 70, // 70-100% match
    employer: {
      companyName: ["TechStart Inc", "InnovateCorp", "BuildTech", "DataFlow", "CodeCraft"][Math.floor(Math.random() * 5)],
      industry: ["Technology", "Healthcare", "Finance", "E-commerce", "Education"][Math.floor(Math.random() * 5)]
    }
  })) || [];

  const appliedJobIds = new Set(applications?.map((app: any) => app.jobId) || []);

  const filteredJobs = jobsWithScores.filter((job: Job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.employer?.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = locationFilter === "all" || 
                           (locationFilter === "remote" && job.isRemote) ||
                           job.location.toLowerCase().includes(locationFilter.toLowerCase());
    
    const matchesRemote = remoteFilter === "all" ||
                         (remoteFilter === "yes" && job.isRemote) ||
                         (remoteFilter === "no" && !job.isRemote);

    return matchesSearch && matchesLocation && matchesRemote;
  });

  const getTabJobs = () => {
    switch (activeTab) {
      case "recommended":
        return filteredJobs.filter((job: Job) => (job.matchScore || 0) >= 85);
      case "applied":
        return filteredJobs.filter((job: Job) => appliedJobIds.has(job.id));
      case "saved":
        return []; // Would filter by saved jobs
      default:
        return filteredJobs;
    }
  };

  const displayJobs = getTabJobs();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Job Opportunities</h2>
          <p className="text-gray-600">Discover roles that match your verified skills</p>
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Advanced Filters
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search jobs, companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="san francisco">San Francisco</SelectItem>
                <SelectItem value="new york">New York</SelectItem>
                <SelectItem value="austin">Austin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={experienceFilter} onValueChange={setExperienceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="entry">Entry Level</SelectItem>
                <SelectItem value="junior">Junior</SelectItem>
                <SelectItem value="mid">Mid Level</SelectItem>
                <SelectItem value="senior">Senior</SelectItem>
              </SelectContent>
            </Select>
            <Select value={remoteFilter} onValueChange={setRemoteFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Remote" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="yes">Remote</SelectItem>
                <SelectItem value="no">On-site</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Job Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            All Jobs ({filteredJobs.length})
          </TabsTrigger>
          <TabsTrigger value="recommended">
            Recommended ({filteredJobs.filter((job: Job) => (job.matchScore || 0) >= 85).length})
          </TabsTrigger>
          <TabsTrigger value="applied">
            Applied ({filteredJobs.filter((job: Job) => appliedJobIds.has(job.id)).length})
          </TabsTrigger>
          <TabsTrigger value="saved">
            Saved (0)
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {displayJobs.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms</p>
              </CardContent>
            </Card>
          ) : (
            displayJobs.map((job: Job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                        {job.matchScore && job.matchScore >= 85 && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            <Star className="h-3 w-3 mr-1" />
                            {job.matchScore}% Match
                          </Badge>
                        )}
                        {appliedJobIds.has(job.id) && (
                          <Badge variant="outline" className="text-blue-600 border-blue-600">
                            Applied
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          {job.employer?.companyName}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.isRemote ? "Remote" : job.location}
                        </div>
                        {job.salaryMin && job.salaryMax && (
                          <div className="flex items-center gap-1">
                            <PoundSterling className="h-4 w-4" />
                            £{job.salaryMin}k - £{job.salaryMax}k
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(job.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4 line-clamp-2">
                        {job.description}
                      </p>

                      <div className="space-y-3">
                        <div>
                          <span className="text-sm font-medium text-gray-900 mr-2">Required Skills:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {job.requiredSkills?.slice(0, 5).map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {(job.requiredSkills?.length || 0) > 5 && (
                              <Badge variant="outline" className="text-xs">
                                +{(job.requiredSkills?.length || 0) - 5} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        {job.preferredSkills && job.preferredSkills.length > 0 && (
                          <div>
                            <span className="text-sm font-medium text-gray-900 mr-2">Preferred Skills:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {job.preferredSkills.slice(0, 3).map((skill, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {job.preferredSkills.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{job.preferredSkills.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-6">
                      <Button variant="ghost" size="sm">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-4">
                      {job.challengeId && (
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                          <Users className="h-4 w-4" />
                          Skills Challenge Required
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        Posted {Math.floor(Math.random() * 7) + 1} days ago
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      {appliedJobIds.has(job.id) ? (
                        <Button disabled size="sm">
                          Applied
                        </Button>
                      ) : (
                        <Button size="sm">
                          Apply Now
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}