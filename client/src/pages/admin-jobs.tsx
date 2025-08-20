import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  FileText, Eye, CheckCircle, XCircle, Search, ArrowLeft,
  MapPin, Clock, Users, Building2, AlertTriangle, Edit
} from "lucide-react";
import { useLocation } from "wouter";

interface JobPosting {
  id: string;
  jobTitle: string;
  companyName: string;
  location: string;
  jobType: string;
  salaryRange: string;
  description: string;
  roleOverview: string;
  keyResponsibilities: string[];
  idealPersona: {
    behavioralTraits: string[];
    keySkills: string[];
    workStyle: string;
  };
  workingArrangements: string;
  benefits: string[];
  growthOpportunities: string;
  applicationProcess: string;
  submittedDate: string;
  submittedBy: string;
  status: 'pending' | 'approved' | 'rejected' | 'needs_revision';
  reviewNotes?: string;
  reviewedBy?: string;
  reviewDate?: string;
}

export default function AdminJobs() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const { toast } = useToast();

  // Fetch job postings awaiting approval
  const { data: jobPostings = [], isLoading } = useQuery<JobPosting[]>({
    queryKey: ["/api/admin/job-postings"],
    initialData: [
      {
        id: "1",
        jobTitle: "Marketing Assistant",
        companyName: "TechFlow Solutions",
        location: "London",
        jobType: "Full-time",
        salaryRange: "£22,000 - £28,000",
        description: "Join our growing marketing team and help drive our brand forward through innovative campaigns and strategic initiatives.",
        roleOverview: "We're seeking a passionate marketing professional to support our expanding digital presence and customer engagement strategies. You'll work closely with our senior marketing team to execute campaigns across multiple channels and contribute to our brand development.",
        keyResponsibilities: [
          "Assist in developing and executing digital marketing campaigns",
          "Create engaging content for social media platforms",
          "Support email marketing initiatives and automation",
          "Conduct market research and competitor analysis",
          "Assist with event planning and coordination",
          "Monitor and report on campaign performance metrics"
        ],
        idealPersona: {
          behavioralTraits: ["Creative Problem Solver", "Detail-Oriented Communicator", "Collaborative Team Player"],
          keySkills: ["Social Media Management", "Content Creation", "Data Analysis", "Email Marketing", "Project Coordination"],
          workStyle: "Thrives in collaborative environments, enjoys creative challenges, and values continuous learning"
        },
        workingArrangements: "Hybrid working with 3 days in our London office, flexible start times between 8-10am",
        benefits: ["Health Insurance", "25 Days Holiday", "Learning Budget", "Flexible Hours", "Mental Health Support"],
        growthOpportunities: "Clear progression path to Senior Marketing Assistant within 18 months, with opportunities to lead campaigns and mentor new team members",
        applicationProcess: "Submit application through Pollen platform including behavioral assessment and skills demonstration",
        submittedDate: "2024-01-15",
        submittedBy: "Sarah Johnson (HR Manager)",
        status: "pending"
      },
      {
        id: "2",
        jobTitle: "UX Designer", 
        companyName: "Creative Studios",
        location: "Manchester",
        jobType: "Full-time",
        salaryRange: "£28,000 - £35,000",
        description: "Shape user experiences that delight and engage through thoughtful design and user-centered approaches.",
        roleOverview: "Join our creative team where you'll be responsible for designing intuitive and engaging user experiences for our diverse client portfolio. You'll work on projects ranging from web applications to mobile interfaces, always keeping the user at the center of your design decisions.",
        keyResponsibilities: [
          "Conduct user research and usability testing",
          "Create wireframes, prototypes, and high-fidelity designs",
          "Collaborate with developers and product managers",
          "Maintain and evolve design systems",
          "Present design concepts to clients and stakeholders",
          "Stay current with UX trends and best practices"
        ],
        idealPersona: {
          behavioralTraits: ["Empathetic Researcher", "Visual Communicator", "Iterative Thinker"],
          keySkills: ["User Research", "Prototyping", "Design Systems", "Usability Testing", "Client Presentation"],
          workStyle: "User-focused approach with strong attention to detail and passion for creating accessible designs"
        },
        workingArrangements: "Full-time office based in Manchester Northern Quarter with occasional remote days",
        benefits: ["Health Insurance", "Creative Workshop Budget", "Flexible Hours", "Team Retreats", "Professional Development"],
        growthOpportunities: "Opportunity to lead client projects and mentor junior designers, with pathway to Senior UX Designer role",
        applicationProcess: "Portfolio review followed by design challenge and team interview",
        submittedDate: "2024-01-14",
        submittedBy: "James Thompson (Creative Director)",
        status: "pending"
      },
      {
        id: "3",
        jobTitle: "Junior Developer",
        companyName: "StartupCo",
        location: "Birmingham",
        jobType: "Full-time", 
        salaryRange: "£25,000 - £32,000",
        description: "Build innovative web applications using modern technologies in a supportive, learning-focused environment.",
        roleOverview: "Perfect opportunity for a developer ready to grow their skills in a startup environment. You'll work on real products used by thousands of users while receiving mentorship from experienced developers.",
        keyResponsibilities: [
          "Develop and maintain web applications using React and Node.js",
          "Write clean, testable code following best practices",
          "Participate in code reviews and team planning sessions",
          "Debug and troubleshoot application issues",
          "Contribute to technical documentation",
          "Learn new technologies and frameworks as needed"
        ],
        idealPersona: {
          behavioralTraits: ["Curious Learner", "Logical Problem Solver", "Team Collaborator"],
          keySkills: ["JavaScript/TypeScript", "React", "API Development", "Testing", "Version Control"],
          workStyle: "Eager to learn, comfortable with rapid iteration, and enjoys tackling technical challenges"
        },
        workingArrangements: "Hybrid working with minimum 2 days per week in Birmingham office",
        benefits: ["Health Insurance", "Learning Budget", "Share Options", "Flexible Hours", "Modern Tech Stack"],
        growthOpportunities: "Clear technical progression with regular skills assessments and opportunities to lead features",
        applicationProcess: "Technical assessment followed by pair programming session with the team",
        submittedDate: "2024-01-13",
        submittedBy: "Alex Kumar (CTO)",
        status: "approved",
        reviewedBy: "Holly (Admin)",
        reviewDate: "2024-01-14",
        reviewNotes: "Excellent job posting that aligns perfectly with Pollen's skills-first approach. Clear behavioral traits and key skills defined without any experience requirements. Approved for immediate publication."
      }
    ]
  });

  // Review job posting mutation
  const reviewMutation = useMutation({
    mutationFn: async ({ jobId, status, notes }: { 
      jobId: string, 
      status: 'approved' | 'rejected' | 'needs_revision', 
      notes?: string 
    }) => {
      return await apiRequest("PUT", `/api/admin/job-postings/${jobId}/review`, {
        status, 
        reviewNotes: notes,
        reviewedBy: "Holly (Admin)",
        reviewDate: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/job-postings"] });
      toast({
        title: "Job posting reviewed",
        description: "Job posting has been updated successfully",
      });
    },
  });

  // Filter job postings
  const filteredJobs = jobPostings.filter(job => {
    const matchesSearch = job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleReview = (jobId: string, status: 'approved' | 'rejected' | 'needs_revision', notes?: string) => {
    reviewMutation.mutate({ jobId, status, notes });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending Review</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'needs_revision':
        return <Badge className="bg-orange-100 text-orange-800">Needs Revision</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };



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
                onClick={() => setLocation("/admin")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Jobs Approval</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search jobs or companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Job Postings List */}
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="bg-white">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {job.jobTitle}
                      </h3>
                      {getStatusBadge(job.status)}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 mr-2" />
                        {job.companyName}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {job.jobType}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        {job.salaryRange}
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-3">{job.description}</p>
                    
                    <div className="text-xs text-gray-500">
                      Submitted by {job.submittedBy} on {new Date(job.submittedDate).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    {job.status === 'pending' && (
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => setLocation(`/admin/job-review/${job.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Review Job
                      </Button>
                    )}
                    {job.status === 'approved' && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => setLocation(`/admin/job-review/${job.id}`)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        View Approved
                      </Button>
                    )}
                    {job.status === 'rejected' && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setLocation(`/admin/job-review/${job.id}`)}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        View Rejected
                      </Button>
                    )}
                    {job.status === 'needs_revision' && (
                      <Button
                        size="sm"
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                        onClick={() => setLocation(`/admin/job-review/${job.id}`)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        View Requested Changes
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