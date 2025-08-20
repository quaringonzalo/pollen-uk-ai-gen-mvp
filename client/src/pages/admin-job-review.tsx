import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  ArrowLeft, Building2, MapPin, Users, Calendar, User, 
  CheckCircle, XCircle, Edit, Target, Briefcase, Star, Clock, ExternalLink, Eye,
  FileText, Award, Lightbulb, UserPlus
} from "lucide-react";
import { useLocation, useParams } from "wouter";

interface JobPosting {
  id: string;
  jobTitle: string;
  companyName: string;
  companyId: string;
  location: string;
  jobType: string;
  salaryRange: string;
  description: string;
  keyResponsibilities: string[];
  whoWouldLove: string[];
  successLooks: string;
  keySkills: string[];
  toolsSoftware: string[];
  assessment: {
    title: string;
    description: string;
    estimatedTime: string;
    questions: {
      id: number;
      question: string;
      description: string;
    }[];
  };
  submittedDate: string;
  submittedBy: string;
  status: 'pending' | 'approved' | 'rejected' | 'needs_revision';
  reviewNotes?: string;
  reviewedBy?: string;
  reviewDate?: string;
  assignedTo?: string;
}

export default function AdminJobReview() {
  const { jobId } = useParams<{ jobId: string }>();
  const [, setLocation] = useLocation();
  const [reviewNotes, setReviewNotes] = useState("");
  const [assignedTeamMember, setAssignedTeamMember] = useState("");
  const { toast } = useToast();

  // Pollen team members
  const teamMembers = [
    { id: "holly", name: "Holly Saunders", role: "" },
    { id: "karen", name: "Karen Whitelaw", role: "" },
    { id: "sophie", name: "Sophie O'Brien", role: "" }
  ];

  // Job data mapping
  const getJobData = (id: string): JobPosting => {
    const jobsMap: Record<string, JobPosting> = {
      "1": {
        id: "1",
        jobTitle: "Marketing Assistant",
        companyName: "TechFlow Solutions",
        companyId: "techflow-solutions",
        location: "London",
        jobType: "Full-time",
        salaryRange: "£25,000 - £32,000",
        description: "Join our growing marketing team and help coordinate impactful campaigns across digital and traditional channels.",
        keyResponsibilities: [
          "Assist in planning and executing integrated marketing campaigns",
          "Coordinate with external agencies and internal stakeholders",
          "Track campaign performance and prepare regular reports",
          "Support social media management and content creation",
          "Help organise events and trade show participation",
          "Maintain marketing materials and brand consistency"
        ],
        whoWouldLove: [
          "Someone super curious who loves discovering what makes people tick",
          "A highly organised person who gets satisfaction from bringing order to complex projects",
          "Someone who thrives on variety and gets energised by juggling multiple tasks",
          "A natural connector who enjoys building relationships with different teams"
        ],
        successLooks: "Successfully coordinate integrated marketing campaigns while improving performance metrics and building strong relationships with internal agencies and vendors.",
        keySkills: [
          "Project Management",
          "Digital Marketing",
          "Stakeholder Management",
          "Social Media Management",
          "Campaign Analysis"
        ],
        toolsSoftware: [
          "Microsoft Office Suite",
          "Google Analytics",
          "Hootsuite/Buffer",
          "Mailchimp",
          "Canva",
          "Trello/Asana"
        ],
        assessment: {
          title: "Marketing Coordination Assessment",
          description: "This assessment evaluates your organisational skills, marketing understanding, and communication abilities through practical scenarios.",
          estimatedTime: "45 minutes",
          questions: [
            {
              id: 1,
              question: "Why did you apply for this Marketing Assistant role?",
              description: "Tell us what excites you about marketing coordination and how it aligns with your career goals..."
            },
            {
              id: 2,
              question: "You need to coordinate a product launch campaign across email, social media, and events. How would you organise this project?",
              description: "Describe your approach to planning and coordinating multiple campaign elements..."
            },
            {
              id: 3,
              question: "You're working with an external agency that's behind schedule on creative deliverables. How would you handle this situation?",
              description: "Explain your approach to managing this challenge while maintaining relationships..."
            },
            {
              id: 4,
              question: "A recent email campaign had a 2% open rate (industry average is 20%). What could be the possible reasons and how would you investigate?",
              description: "Share your analytical approach to understanding campaign performance..."
            }
          ]
        },
        submittedDate: "2024-01-15",
        submittedBy: "Sarah Johnson (HR Manager)",
        status: "approved"
      },
      "7": {
        id: "7",
        jobTitle: "Social Media Manager",
        companyName: "Brand Builders Ltd",
        companyId: "brand-builders-ltd",
        location: "Birmingham",
        jobType: "Full-time",
        salaryRange: "£28,000 - £35,000",
        description: "Lead our social media strategy and create engaging content that builds our brand presence across multiple platforms.",
        keyResponsibilities: [
          "Develop and execute comprehensive social media strategies",
          "Create compelling content for Instagram, LinkedIn, TikTok, and Twitter",
          "Monitor social media trends and competitor activity",
          "Engage with our community and respond to comments/messages",
          "Analyse performance metrics and optimise content strategy",
          "Collaborate with marketing team on integrated campaigns"
        ],
        whoWouldLove: [
          "Someone who's naturally creative and loves experimenting with new ideas",
          "A people person who gets energised by building genuine connections online",
          "Someone detail-oriented who loves diving deep into data to find patterns",
          "A persistent problem solver who won't give up until they've figured something out"
        ],
        successLooks: "Successfully grow our social media following by 40% while increasing engagement rates and driving measurable traffic to our website.",
        keySkills: [
          "Social Media Strategy",
          "Content Creation",
          "Community Management",
          "Analytics and Reporting",
          "Brand Management"
        ],
        toolsSoftware: [
          "Hootsuite/Buffer",
          "Canva/Adobe Creative Suite",
          "Google Analytics",
          "Sprout Social",
          "TikTok Creator Tools",
          "Instagram Business Tools"
        ],
        assessment: {
          title: "Social Media Strategy Assessment",
          description: "This assessment evaluates your strategic thinking, creativity, and understanding of social media best practices.",
          estimatedTime: "50 minutes",
          questions: [
            {
              id: 1,
              question: "Why are you interested in this Social Media Manager position?",
              description: "Tell us about your passion for social media and how you see this role fitting your career goals..."
            },
            {
              id: 2,
              question: "Our Instagram engagement has dropped by 25% over the past month. How would you investigate and address this issue?",
              description: "Describe your analytical approach and potential solutions..."
            },
            {
              id: 3,
              question: "Create a content strategy for launching a new product on social media. What platforms would you prioritise and why?",
              description: "Outline your strategic thinking and platform selection rationale..."
            },
            {
              id: 4,
              question: "How would you handle a negative comment that's gaining traction on our company's social media post?",
              description: "Explain your crisis management approach and communication strategy..."
            }
          ]
        },
        submittedDate: "2025-01-17",
        submittedBy: "Brand Builders Ltd",
        status: "pending"
      }
    };
    
    return jobsMap[id] || jobsMap["1"]; // Fallback to Marketing Assistant if ID not found
  };

  // Fetch specific job posting details
  const { data: job, isLoading } = useQuery<JobPosting>({
    queryKey: [`/api/admin/job-postings/${jobId}`],
    initialData: getJobData(jobId || "1")
  });

  // Review job posting mutation
  const reviewMutation = useMutation({
    mutationFn: async ({ status, notes, assignedTo }: { status: 'approved' | 'rejected' | 'needs_revision', notes: string, assignedTo?: string }) => {
      return await apiRequest("PUT", `/api/admin/job-postings/${jobId}/review`, {
        status, 
        reviewNotes: notes,
        assignedTo,
        reviewedBy: "Holly",
        reviewDate: new Date().toISOString()
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/job-postings"] });
      const assignedMember = teamMembers.find(m => m.id === variables.assignedTo);
      toast({
        title: variables.status === 'approved' ? "Job Approved & Assigned" : "Job Updated",
        description: variables.status === 'approved' && assignedMember 
          ? `Job approved and assigned to ${assignedMember.name}`
          : "Job posting has been updated successfully",
      });
      setLocation("/admin/assigned-jobs");
    },
  });

  const handleApprove = () => {
    if (!assignedTeamMember) {
      toast({
        title: "Team member required",
        description: "Please assign a team member before approving the job posting",
        variant: "destructive"
      });
      return;
    }
    reviewMutation.mutate({ 
      status: 'approved', 
      notes: reviewNotes || `Approved and assigned to ${teamMembers.find(m => m.id === assignedTeamMember)?.name}`,
      assignedTo: assignedTeamMember 
    });
  };

  const handleRequestChanges = () => {
    reviewMutation.mutate({ 
      status: 'needs_revision', 
      notes: reviewNotes || "Changes requested by admin team"
    });
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

  if (isLoading || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setLocation("/admin/assigned-jobs")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Jobs
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Review Job Posting</h1>
                <p className="text-sm text-gray-600">
                  Submitted on {new Date(job.submittedDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {getStatusBadge(job.status)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Job Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Job Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{job.jobTitle}</h3>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(`/company-profile/${job.companyId}`, '_blank');
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                    >
                      {job.companyName}
                      <ExternalLink className="h-3 w-3" />
                    </button>
                    <span className="text-xs text-gray-500">• Company Profile</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    {job.jobType}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    {job.salaryRange}
                  </div>
                </div>

                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.open(`/job-detail/job-${job.id.toString().padStart(3, '0')}?admin=true&source=job-review&reviewId=${job.id}`, '_blank');
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View & Edit Job Posting
                </Button>
              </CardContent>
            </Card>

            {/* About This Role */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  About This Role
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-sm leading-relaxed">{job.description}</p>
              </CardContent>
            </Card>

            {/* Key Responsibilities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Key Responsibilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.keyResponsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-700">
                      <CheckCircle className="h-3 w-3 mr-2 mt-1 text-green-600 flex-shrink-0" />
                      {responsibility}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Who Would Love This Job */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Who Would Love This Job?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.whoWouldLove.map((trait, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-700">
                      <CheckCircle className="h-3 w-3 mr-2 mt-1 text-green-600 flex-shrink-0" />
                      {trait}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* What Success Looks Like */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  What Success Looks Like
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-sm leading-relaxed">{job.successLooks}</p>
              </CardContent>
            </Card>

            {/* Key Skills Needed */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2" />
                  Key Skills Needed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {job.keySkills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tools & Software You'll Use */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Tools & Software You'll Use
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {job.toolsSoftware.map((tool, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-50 text-gray-700">
                      {tool}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skills Assessment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Skills Assessment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">{job.assessment.title}</h4>
                  <p className="text-sm text-gray-700 mb-3">{job.assessment.description}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    Estimated time: {job.assessment.estimatedTime}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Assessment Questions ({job.assessment.questions.length})</h5>
                  <div className="space-y-3">
                    {job.assessment.questions.map((question, index) => (
                      <div key={question.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-semibold text-blue-700">{question.id}</span>
                          </div>
                          <div className="flex-1">
                            <h6 className="font-medium text-gray-900 text-sm mb-1">{question.question}</h6>
                            <p className="text-xs text-gray-600">{question.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Previous Review (if exists) */}
            {job.reviewNotes && (
              <Card>
                <CardHeader>
                  <CardTitle>Previous Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        Reviewed by: {job.reviewedBy}
                      </span>
                      <span className="text-sm text-gray-600">
                        {job.reviewDate && new Date(job.reviewDate).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{job.reviewNotes}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Review Panel */}
          <div className="space-y-6">
            {/* Team Assignment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserPlus className="h-5 w-5 mr-2" />
                  Assign Pollen Team Member
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Assign to team member
                  </label>
                  <Select value={assignedTeamMember} onValueChange={setAssignedTeamMember}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team member..." />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {assignedTeamMember && (
                    <p className="text-xs text-gray-500">
                      This team member will be responsible for candidate management and employer communication.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Review Decision */}
            <Card>
              <CardHeader>
                <CardTitle>Review Decision</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Suggested Changes or Admin Notes
                  </label>
                  <Textarea
                    placeholder="Add any suggested changes or notes for the employer (optional)..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    rows={3}
                    className="w-full"
                  />
                </div>

                {job.status === 'pending' && (
                  <div className="space-y-3">
                    <Button
                      onClick={handleApprove}
                      disabled={!assignedTeamMember}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve & Assign
                    </Button>
                    
                    <Button
                      onClick={handleRequestChanges}
                      className="w-full bg-orange-600 hover:bg-orange-700"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Request Changes
                    </Button>
                  </div>
                )}

                {!assignedTeamMember && job.status === 'pending' && (
                  <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                    Please assign a team member before approving the job posting.
                  </p>
                )}

                {job.status !== 'pending' && (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-600 mb-2">
                      This job posting has been {job.status === 'needs_revision' ? 'returned for changes' : job.status}.
                    </p>
                    {getStatusBadge(job.status)}
                    {job.assignedTo && (
                      <p className="text-xs text-gray-500 mt-2">
                        Assigned to: {teamMembers.find(m => m.id === job.assignedTo)?.name}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}