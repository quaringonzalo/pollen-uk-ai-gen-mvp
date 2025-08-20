import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { 
  Building2, Users, Briefcase, Calendar, Star, Plus, Search, Filter, 
  BarChart3, TrendingUp, Globe, Award, Clock, MapPin, Eye, CheckCircle, 
  XCircle, AlertCircle, Edit3, Target, FileText, Play, Pause
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default function EmployerJobs() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch jobs from API
  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ['/api/employer-jobs'],
    enabled: !!user
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "paused":
        return <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>;
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
      case "closed":
        return <Badge className="bg-red-100 text-red-800">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleJobAction = (jobId: number, action: string) => {
    switch (action) {
      case "view":
        // Convert job ID to proper job key format for consistency
        const jobKey = `job-${jobId.toString().padStart(3, '0')}`;
        setLocation(`/job-posting-detail/${jobKey}`);
        break;
      case "edit":
        // Store the job ID for editing and route to service selection
        localStorage.setItem('editingJobId', jobId.toString());
        setLocation(`/simplified-service-selection?edit=true`);
        break;
      case "pause":
        toast({
          title: "Job Paused",
          description: "The job posting has been paused and is no longer accepting applications.",
        });
        break;
      case "activate":
        toast({
          title: "Job Activated",
          description: "The job posting is now active and accepting applications.",
        });
        break;
      case "viewMatches":
        // Ensure consistent routing format for view matches
        const matchesJobKey = `job-${jobId.toString().padStart(3, '0')}`;
        setLocation(`/job-candidate-matches/${matchesJobKey}`);
        break;
    }
  };

  const filteredJobs = jobs.filter((job: any) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" style={{fontFamily: 'Sora'}}>Job Management</h1>
          <p className="text-gray-600" style={{fontFamily: 'Poppins'}}>
            Manage your job postings and track candidate matches
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={() => setLocation("/job-candidate-matches/job-001")}
            style={{fontFamily: 'Sora'}}
          >
            <Users className="w-4 h-4 mr-2" />
            View All Applicants
          </Button>
          <Button 
            onClick={() => {
              // Clear any existing job posting data to start fresh
              localStorage.removeItem('completeJobFormData');
              localStorage.removeItem('checkoutData');
              // Route to initial job posting form - start with job setup before payment
              setLocation("/job-posting");
            }}
            className="bg-pink-600 hover:bg-pink-700"
            style={{fontFamily: 'Sora'}}
          >
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                <p className="text-2xl font-bold">{jobs.length}</p>
              </div>
              <Briefcase className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold">{jobs.filter((j: any) => j.status === 'active').length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Draft Jobs</p>
                <p className="text-2xl font-bold">{jobs.filter((j: any) => j.status === 'draft').length}</p>
              </div>
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Matches</p>
                <p className="text-2xl font-bold">{jobs.reduce((sum: number, job: any) => sum + job.applicationsCount, 0)}</p>
              </div>
              <Users className="w-8 h-8 text-pink-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search jobs by title or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline" style={{fontFamily: 'Sora'}}>
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <Card 
            key={job.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => {
              if (job.status === 'active') {
                setLocation(`/applicants/job-${job.id.toString().padStart(3, '0')}`);
              } else if (job.status === 'draft') {
                handleJobAction(job.id, 'edit');
              }
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold" style={{fontFamily: 'Sora'}}>{job.title}</h3>
                    {getStatusBadge(job.status)}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      {job.department}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {job.jobType}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {job.applicationsCount} matches
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    {job.postedDate && (
                      <span>Posted: {new Date(job.postedDate).toLocaleDateString()}</span>
                    )}
                    {job.deadline && (
                      <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                    )}
                    <span>Salary: {job.salary}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {job.status === 'active' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLocation(`/applicants/job-${job.id.toString().padStart(3, '0')}`);
                        }}
                        style={{fontFamily: 'Sora'}}
                      >
                        <Users className="w-4 h-4 mr-1" />
                        View Matches ({job.applicationsCount})
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLocation(`/job-candidate-matches/job-${job.id.toString().padStart(3, '0')}`);
                        }}
                        style={{fontFamily: 'Sora'}}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        All Applicants
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleJobAction(job.id, 'pause');
                        }}
                        style={{fontFamily: 'Sora'}}
                      >
                        <Pause className="w-4 h-4 mr-1" />
                        Pause
                      </Button>
                    </>
                  )}
                  
                  {job.status === 'paused' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJobAction(job.id, 'activate');
                      }}
                      style={{fontFamily: 'Sora'}}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Activate
                    </Button>
                  )}

                  {job.status === 'draft' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJobAction(job.id, 'edit');
                      }}
                      style={{fontFamily: 'Sora'}}
                    >
                      <Edit3 className="w-4 h-4 mr-1" />
                      Complete
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJobAction(job.id, 'view');
                    }}
                    style={{fontFamily: 'Sora'}}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2" style={{fontFamily: 'Sora'}}>No jobs found</h3>
            <p className="text-gray-600 mb-4" style={{fontFamily: 'Poppins'}}>
              {searchTerm ? 'No jobs match your search criteria.' : 'You haven\'t posted any jobs yet.'}
            </p>
            <Button 
              onClick={() => setLocation("/hiring-service-selection")}
              className="bg-pink-600 hover:bg-pink-700"
              style={{fontFamily: 'Sora'}}
            >
              <Plus className="w-4 h-4 mr-2" />
              Post Your First Job
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}