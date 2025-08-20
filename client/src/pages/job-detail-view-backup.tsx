import React, { useState } from "react";
import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  ArrowLeft, Users, Eye, Plus, Play, Pause, X, 
  Building2, MapPin, Clock, PoundSterling, ChevronRight,
  FileText, Target, Lightbulb, Award, CheckCircle2,
  Edit3, Save, Shield, Heart
} from "lucide-react";

interface JobDetailProps {
  jobId: string;
}

export default function JobDetailView() {
  const [, params] = useRoute("/job-detail/:jobId");
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const jobId = params?.jobId;
  
  // Check if in admin mode and get source information
  const urlParams = new URLSearchParams(window.location.search);
  const isAdminMode = urlParams.get('admin') === 'true';
  const source = urlParams.get('source');
  const reviewId = urlParams.get('reviewId');
  
  // Admin editing states
  const [isEditing, setIsEditing] = useState(false);
  const [editedJobData, setEditedJobData] = useState<any>(null);

  // Query for saved jobs to check if this job is saved
  const { data: savedJobsData = [] } = useQuery({
    queryKey: ["/api/saved-jobs"],
    enabled: !!jobId && !isAdminMode // Only fetch if not in admin mode
  });

  // Save job mutation
  const saveJobMutation = useMutation({
    mutationFn: (jobId: string) => apiRequest(`/api/saved-jobs/${jobId}`, 'POST'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-jobs"] });
      toast({
        title: "Job saved!",
        description: "You can find this job in your saved jobs list."
      });
    }
  });

  // Remove saved job mutation
  const removeSavedJobMutation = useMutation({
    mutationFn: (jobId: string) => apiRequest(`/api/saved-jobs/${jobId}`, 'DELETE'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-jobs"] });
      toast({
        title: "Job removed",
        description: "Job has been removed from your saved jobs."
      });
    }
  });

  // Check if job is saved
  const isJobSaved = Array.isArray(savedJobsData) && savedJobsData.some((saved: any) => saved.id === jobId?.replace('job-', ''));

  // Handle save/unsave job
  const handleSaveJob = () => {
    if (!jobId) return;
    
    const numericJobId = jobId.replace('job-', '');
    
    if (isJobSaved) {
      removeSavedJobMutation.mutate(numericJobId);
    } else {
      saveJobMutation.mutate(numericJobId);
    }
  };

  // Fetch job data from API
  const { data: jobData, isLoading: jobLoading } = useQuery({
    queryKey: ["/api/hidden-jobs", jobId],
    select: (data) => {
      if (!Array.isArray(data)) return null;
      const numericId = jobId?.replace('job-', '');
      return data.find(job => job.id.toString() === numericId) || null;
    },
    enabled: !!jobId
  });

  // Convert API job data to expected format
  const jobDetail = getJobData(jobData);
  
  function getJobData(apiJob: any) {
    if (!apiJob) return null;
    
    // Get job-specific data based on role
    const jobSpecificData = getJobSpecificData(apiJob.role);
    
    return {
      id: apiJob.id,
      title: apiJob.role,
      company: apiJob.company,
      location: apiJob.location,
      type: "Full-time",
      salary: apiJob.salary,
      status: "active",
      matches: 8,
      newCandidates: 3,
      postedDate: new Date(apiJob.createdAt).toISOString().split('T')[0],
      description: apiJob.description,
      ...jobSpecificData
    };
  }

  function getJobSpecificData(role: string) {
    switch (role) {
      case "Marketing Coordinator":
        return {
          keyResponsibilities: [
            "Assist in planning and executing integrated marketing campaigns",
            "Coordinate with external agencies and internal stakeholders",
            "Track campaign performance and prepare regular reports",
            "Support social media management and content creation",
            "Help organise events and trade show participation",
            "Maintain marketing materials and brand consistency"
          ],
          whoWouldLove: [
            "Someone passionate about marketing and brand building",
            "A creative individual who enjoys variety in their work",
            "An organised person who thrives on coordination and planning",
            "Someone looking to grow their career in marketing"
          ],
          successLooks: "Successfully coordinate integrated marketing campaigns while improving performance metrics and building strong relationships with internal agencies and vendors.",
          keySkills: ["Project Management", "Digital Marketing", "Stakeholder Management", "Social Media Management", "Campaign Analysis"],
          toolsSoftware: ["Microsoft Office Suite", "Google Analytics", "Hootsuite/Buffer", "Mailchimp", "Canva", "Trello/Asana"]
        };
      case "Junior Data Analyst":
        return {
          keyResponsibilities: [
            "Collect, clean, and analyze data from various sources",
            "Create reports and dashboards to support business decisions",
            "Assist in identifying trends and patterns in data",
            "Support data quality initiatives and validation processes",
            "Collaborate with teams to understand analytical requirements",
            "Help maintain and improve data collection processes"
          ],
          whoWouldLove: [
            "Someone curious about data and enjoys problem-solving",
            "A detail-oriented individual who likes working with numbers",
            "An analytical person who wants to support business decisions",
            "Someone interested in learning data analysis tools and techniques"
          ],
          successLooks: "Provide accurate, timely data analysis that helps teams make informed decisions while continuously improving analytical skills.",
          keySkills: ["Data Analysis", "Excel/Google Sheets", "Statistical Analysis", "Data Visualization", "Critical Thinking"],
          toolsSoftware: ["Excel", "Google Analytics", "Tableau/Power BI", "SQL", "Python/R (basic)", "SPSS"]
        };
      case "Content Marketing Assistant":
        return {
          keyResponsibilities: [
            "Create engaging content for various digital platforms",
            "Assist in planning and executing social media campaigns",
            "Support content calendar management and scheduling",
            "Help with copywriting for marketing materials",
            "Monitor content performance and engagement metrics",
            "Collaborate with design team on visual content creation"
          ],
          whoWouldLove: [
            "Someone creative who enjoys writing and storytelling",
            "A social media savvy individual who understands digital trends",
            "An organized person who can manage multiple content projects",
            "Someone passionate about brand building and audience engagement"
          ],
          successLooks: "Create compelling content that engages audiences and supports marketing objectives while building strong brand presence.",
          keySkills: ["Content Creation", "Social Media Marketing", "Copywriting", "Brand Voice", "Analytics"],
          toolsSoftware: ["Canva", "Hootsuite/Buffer", "Google Analytics", "WordPress", "Adobe Creative Suite", "Mailchimp"]
        };
      default:
        return {
          keyResponsibilities: ["Key responsibilities will be discussed during the interview process"],
          whoWouldLove: ["Candidates passionate about this role and industry"],
          successLooks: "Excel in the role while contributing to team and company success",
          keySkills: ["Industry-specific skills", "Communication", "Problem-solving", "Teamwork"],
          toolsSoftware: ["Industry-standard tools and software"]
        };
    }
  }

  // Check if job exists and show loading state
  if (jobLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!jobDetail) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
            <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => setLocation('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Update the job reference to use the new structure
  const job = jobDetail;

  if (false) {
    // Keep the old hardcoded structure for reference but never execute
    const oldJobs = {
      "job-002": {
        id: 2,
        title: "Sales Coordinator",
        company: "TechFlow Solutions",
        location: "London, UK", 
        type: "Full-time",
        salary: "£28,000 - £35,000",
        status: "active",
        matches: 12,
        newCandidates: 2,
        postedDate: "2024-01-10",
        description: "Support our sales team by coordinating client communications, managing pipelines, and ensuring smooth sales operations.",
        keyResponsibilities: [
          "Coordinate sales activities and client communications",
          "Maintain and update CRM systems and sales pipelines",
          "Prepare sales proposals and presentation materials",
          "Schedule meetings and coordinate sales team calendars",
          "Track sales metrics and prepare performance reports",
          "Support onboarding of new clients and account management"
        ],
        whoWouldLove: [
          "Someone who enjoys working with people and building relationships",
          "An organised individual who thrives in fast-paced environments",
          "A detail-oriented person who values accuracy and follow-through",
          "Someone interested in sales and business development"
        ],
        successLooks: "Effectively coordinate sales operations while improving team efficiency and contributing to revenue growth through excellent client support.",
        keySkills: [
          "CRM Management",
          "Client Communication",
          "Sales Operations",
          "Data Analysis", 
          "Relationship Building"
        ],
        toolsSoftware: [
          "Salesforce/HubSpot",
          "Microsoft Office Suite",
          "Google Workspace",
          "Zoom/Teams",
          "DocuSign",
          "LinkedIn Sales Navigator"
        ],
        persona: {
          name: "The Relationship Builder",
          description: "A people-focused professional who excels at building relationships and supporting others' success through excellent organisation and communication.",
          behavioralProfile: "Supportive Connector with Analytical Thinker qualities",
          keyTraits: [
            "Natural relationship builder who connects easily with clients and colleagues",
            "Highly organised with exceptional attention to detail",
            "Analytical mindset combined with people-first approach",
            "Proactive support style - anticipates needs and provides solutions",
            "Technology-comfortable with a service-oriented mindset"
          ],
          idealBehavioralMatch: [
            "High People Skills Score - builds rapport with clients naturally",
            "Strong Organisational Abilities - maintains accurate records and systems",
            "Service-Oriented Mindset - genuinely motivated by helping others succeed",
            "Detail-Focused Approach - catches important details others might miss",
            "Adaptable Communication Style - adjusts approach based on client needs"
          ]
        },
        assessment: {
          title: "Sales Coordination Assessment", 
          description: "This assessment evaluates your communication skills, organisational abilities, and sales aptitude.",
          estimatedTime: "40 minutes",
          questions: [
            {
              id: 1,
              question: "What attracts you to sales coordination and how does it fit your career goals?",
              description: "Share your interest in sales operations and support functions..."
            },
            {
              id: 2,
              question: "A key client is unhappy with delayed project delivery. How would you handle this situation?",
              description: "Describe your approach to managing client relationships during challenges..."
            },
            {
              id: 3,
              question: "How would you prioritise and manage multiple urgent requests from different sales team members?",
              description: "Explain your approach to managing competing priorities..."
            },
            {
              id: 4,
              question: "What information would you track to measure sales team performance and how would you present it?",
              description: "Share your approach to sales analytics and reporting..."
            }
          ]
        }
      },
      "job-003": {
        id: 3,
        title: "Content Creator",
        company: "TechFlow Solutions",
        location: "London, UK",
        type: "Full-time", 
        salary: "£24,000 - £30,000",
        status: "active",
        matches: 5,
        newCandidates: 1,
        postedDate: "2024-01-20",
        description: "Create engaging content across multiple channels to build our brand presence and connect with our target audience.",
        keyResponsibilities: [
          "Develop content for social media, blog, and marketing materials",
          "Create visual content including graphics and short videos",
          "Research industry trends and competitor content strategies",
          "Collaborate with marketing team on content calendars",
          "Monitor content performance and engagement metrics",
          "Maintain brand voice and visual consistency across channels"
        ],
        whoWouldLove: [
          "A creative individual passionate about storytelling and brand building",
          "Someone who stays current with social media trends and digital platforms",
          "An organised person who can manage multiple content projects",
          "Someone interested in growing their skills in content marketing"
        ],
        successLooks: "Consistently create high-quality, engaging content that increases brand awareness and audience engagement while maintaining brand consistency.",
        keySkills: [
          "Content Creation",
          "Social Media Management",
          "Graphic Design",
          "Video Editing",
          "Brand Strategy"
        ],
        toolsSoftware: [
          "Adobe Creative Suite",
          "Canva",
          "Hootsuite/Buffer",
          "Google Analytics",
          "WordPress",
          "Figma"
        ],
        persona: {
          name: "The Creative Communicator",
          description: "A naturally creative individual who combines artistic vision with strategic thinking, bringing brands to life through compelling content and storytelling.",
          behavioralProfile: "Creative Driver with Independent Achiever strengths",
          keyTraits: [
            "Naturally creative with strong visual and artistic sensibilities",
            "Excellent storyteller who connects with audiences emotionally",
            "Self-motivated with ability to work independently on multiple projects",
            "Trend-aware and digitally native with platform expertise",
            "Brand-focused with strategic understanding of content impact"
          ],
          idealBehavioralMatch: [
            "High Creativity Score - generates original ideas and visual concepts",
            "Strong Independent Working Style - manages projects autonomously",
            "Excellent Communication Skills - crafts compelling brand messages",
            "Adaptable Content Approach - adjusts style for different platforms",
            "Strategic Creative Thinking - aligns content with brand objectives"
          ]
        },
        assessment: {
          title: "Content Creation Assessment",
          description: "This assessment evaluates your creative abilities, understanding of content strategy, and digital marketing knowledge.",
          estimatedTime: "50 minutes",
          questions: [
            {
              id: 1,
              question: "What draws you to content creation and how do you stay inspired?",
              description: "Share your passion for content and creative processes..."
            },
            {
              id: 2,
              question: "How would you develop a content strategy for a new product launch across social media?",
              description: "Describe your approach to strategic content planning..."
            },
            {
              id: 3,
              question: "A piece of content you created received negative feedback online. How would you handle this?",
              description: "Explain your approach to managing challenging situations..."
            },
            {
              id: 4,
              question: "How do you measure the success of your content and what metrics matter most?",
              description: "Share your understanding of content performance measurement..."
            }
          ]
        }
      },
      "job-007": {
        id: 7,
        title: "Social Media Manager",
        company: "Brand Builders Ltd",
        location: "Birmingham, UK",
        type: "Full-time",
        salary: "£28,000 - £35,000",
        status: "pending",
        matches: 0,
        newCandidates: 0,
        postedDate: "2025-01-17",
        description: "Lead our social media strategy and create engaging content that builds brand awareness and drives audience engagement across multiple platforms.",
        keyResponsibilities: [
          "Develop and execute comprehensive social media strategies",
          "Create engaging content for Instagram, TikTok, LinkedIn, and Facebook",
          "Monitor brand mentions and engage with community conversations",
          "Analyze social media performance and report on key metrics",
          "Collaborate with marketing team on integrated campaigns",
          "Stay current with social media trends and platform updates"
        ],
        whoWouldLove: [
          "Someone passionate about social media and digital storytelling",
          "A creative individual who understands different platform audiences",
          "An analytical person who enjoys measuring and optimizing performance",
          "Someone excited about building brand communities online"
        ],
        successLooks: "Build engaged social media communities that drive brand awareness and business results through creative content and strategic community management.",
        keySkills: [
          "Social Media Strategy",
          "Content Creation",
          "Community Management",
          "Analytics & Reporting",
          "Brand Voice Development"
        ],
        toolsSoftware: [
          "Meta Business Suite",
          "Hootsuite/Later",
          "Canva/Adobe Creative Suite",
          "Google Analytics",
          "TikTok Creator Studio",
          "LinkedIn Campaign Manager"
        ],
        persona: {
          name: "The Digital Community Builder",
          description: "A socially savvy professional who combines creativity with strategic thinking to build authentic brand communities and drive engagement through compelling content.",
          behavioralProfile: "Creative Driver with Supportive Connector qualities",
          keyTraits: [
            "Naturally social with strong understanding of online communities",
            "Creative storyteller who adapts content for different platforms",
            "Data-driven approach to measuring and optimizing content performance",
            "Brand-focused mindset with attention to voice and consistency",
            "Trend-aware and quick to adapt to platform changes"
          ],
          idealBehavioralMatch: [
            "High Social Intelligence - understands community dynamics and engagement",
            "Creative Problem Solving - develops innovative content and campaign ideas",
            "Analytical Mindset - uses data to inform strategy and measure success",
            "Brand Awareness - maintains consistent voice and messaging across platforms",
            "Adaptability - stays current with rapidly changing social media landscape"
          ]
        },
        assessment: {
          title: "Social Media Strategy Assessment",
          description: "This assessment evaluates your social media strategy skills, content creation abilities, and community management approach.",
          estimatedTime: "45 minutes",
          questions: [
            {
              id: 1,
              question: "What draws you to social media management and how do you stay current with platform trends?",
              description: "Share your passion for social media and approach to staying informed..."
            },
            {
              id: 2,
              question: "How would you develop a social media strategy for a B2B company entering a competitive market?",
              description: "Outline your strategic approach to social media planning..."
            },
            {
              id: 3,
              question: "A post about your company is receiving negative comments and going viral. How would you respond?",
              description: "Describe your crisis management approach for social media..."
            },
            {
              id: 4,
              question: "How would you handle a negative comment that's gaining traction on our company's social media post?",
              description: "Explain your crisis management approach and communication strategy..."
            }
          ]
        }
      }
    };
    return jobs[id as keyof typeof jobs];
  };

  const job = jobId ? getJobData(jobId) : null;
  
  // Initialize edited data when job loads
  if (job && !editedJobData) {
    setEditedJobData(job);
  }
  
  // Admin save functionality
  const handleSaveChanges = () => {
    toast({
      title: "Changes Saved",
      description: "Job posting has been updated successfully.",
    });
    setIsEditing(false);
    // In real app, this would save to the backend
  };

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-4">The job you're looking for doesn't exist.</p>
          <Button onClick={() => setLocation("/employer-dashboard")}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const handleJobAction = (action: string) => {
    switch (action) {
      case "pause":
        toast({
          title: "Job Paused",
          description: "The job posting has been paused and is no longer accepting applications.",
        });
        break;
      case "close":
        toast({
          title: "Job Closed",
          description: "The job posting has been closed and marked as filled.",
        });
        break;
      case "viewCandidates":
        setLocation(`/candidates?job=${job.id}`);
        break;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "paused":
        return <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>;
      case "closed":
        return <Badge className="bg-red-100 text-red-800">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Mode Alert */}
      {isAdminMode && (
        <div className="bg-red-50 border-b border-red-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-red-600 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-red-800">Admin Review Mode</h4>
                  <p className="text-xs text-red-600">You are reviewing and editing employer-submitted job content</p>
                </div>
              </div>
              {isEditing ? (
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveChanges} className="bg-green-600 hover:bg-green-700">
                    <Save className="w-4 h-4 mr-1" />
                    Save Changes
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button size="sm" onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Edit3 className="w-4 h-4 mr-1" />
                  Edit Job Content
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              onClick={() => {
                if (isAdminMode && source === 'job-review' && reviewId) {
                  setLocation(`/admin/job-review/${reviewId}`);
                } else if (isAdminMode) {
                  setLocation("/admin/assigned-jobs");
                } else {
                  setLocation("/employer-dashboard");
                }
              }}
              className="flex items-center text-gray-600 hover:text-gray-900"
              style={{fontFamily: 'Sora'}}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {isAdminMode && source === 'job-review' ? "Back to Job Review" : isAdminMode ? "Back to Admin Jobs" : "Back to Dashboard"}
            </Button>
            
            <div className="flex items-center gap-2">
              {getStatusBadge(job.status)}
              {job.status === 'active' && !isAdminMode && (
                <>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        style={{fontFamily: 'Sora'}}
                      >
                        <Pause className="w-4 h-4 mr-1" />
                        Pause Job
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Pause Job Posting?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will pause the "{job.title}" job posting. It will no longer accept new applications, 
                          but you can reactivate it later.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleJobAction('pause')}
                          className="bg-yellow-600 hover:bg-yellow-700"
                        >
                          Pause Job
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        style={{fontFamily: 'Sora'}}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Close Job
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Close Job Posting?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently close the "{job.title}" job posting and mark it as filled. 
                          Closed jobs cannot be reactivated.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleJobAction('close')}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Close Job
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Job Header Summary */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                {isAdminMode && isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                      <Input
                        value={editedJobData?.title || job.title}
                        onChange={(e) => setEditedJobData((prev: any) => ({ ...prev, title: e.target.value }))}
                        className="text-2xl font-bold h-auto py-2"
                        style={{fontFamily: 'Sora'}}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                        <Input
                          value={editedJobData?.location || job.location}
                          onChange={(e) => setEditedJobData((prev: any) => ({ ...prev, location: e.target.value }))}
                          placeholder="e.g., London, UK"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                        <Input
                          value={editedJobData?.type || job.type}
                          onChange={(e) => setEditedJobData((prev: any) => ({ ...prev, type: e.target.value }))}
                          placeholder="e.g., Full-time"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                      <Input
                        value={editedJobData?.salary || job.salary}
                        onChange={(e) => setEditedJobData((prev: any) => ({ ...prev, salary: e.target.value }))}
                        placeholder="e.g., £25,000 - £32,000"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{fontFamily: 'Sora'}}>
                      {editedJobData?.title || job.title}
                    </h1>
                    <div className="flex items-center gap-4 text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {job.company}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {editedJobData?.location || job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {editedJobData?.type || job.type}
                      </div>
                      <div className="flex items-center gap-1">
                        <PoundSterling className="w-4 h-4" />
                        {editedJobData?.salary || job.salary}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Matches</p>
                    <p className="text-2xl font-bold text-blue-900">{job.matches}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">New Candidates</p>
                    <p className="text-2xl font-bold text-green-900">{job.newCandidates}</p>
                  </div>
                  <Plus className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-pink-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-pink-600">Days Posted</p>
                    <p className="text-2xl font-bold text-pink-900">
                      {Math.floor((new Date().getTime() - new Date(job.postedDate).getTime()) / (1000 * 3600 * 24))}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-pink-600" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            {!isAdminMode && (
              <div className="flex gap-3">
                <Button
                  onClick={() => handleJobAction('viewCandidates')}
                  className="bg-pink-600 hover:bg-pink-700"
                  style={{fontFamily: 'Sora'}}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View All Candidates
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setLocation(`/job-posting?edit=${job.id}`)}
                  style={{fontFamily: 'Sora'}}
                >
                  Edit Job Posting
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSaveJob}
                  disabled={saveJobMutation.isPending || removeSavedJobMutation.isPending}
                  className={isJobSaved ? "text-pink-600" : ""}
                  style={{fontFamily: 'Sora'}}
                >
                  <Heart className={`w-4 h-4 mr-1 ${isJobSaved ? "fill-current" : ""}`} />
                  {isJobSaved ? "Saved" : "Save"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 3-Tab System */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description" style={{fontFamily: 'Sora'}}>Job Description</TabsTrigger>
            <TabsTrigger value="persona" style={{fontFamily: 'Sora'}}>Ideal Candidate</TabsTrigger>
            <TabsTrigger value="assessment" style={{fontFamily: 'Sora'}}>Skills Assessment</TabsTrigger>
          </TabsList>

          {/* Job Description Tab */}
          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-8">
                <div className="space-y-8">
                  {/* About This Role */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{fontFamily: 'Sora'}}>
                      About This Role
                      {isAdminMode && (
                        <span className="text-sm font-normal text-red-600 ml-2">
                          (Admin can edit for candidate suitability)
                        </span>
                      )}
                    </h2>
                    {isAdminMode && isEditing ? (
                      <Textarea
                        value={editedJobData?.description || job.description}
                        onChange={(e) => setEditedJobData((prev: any) => ({ ...prev, description: e.target.value }))}
                        className="text-lg min-h-24"
                        placeholder="Edit job description to ensure it's suitable for candidates..."
                      />
                    ) : (
                      <p className="text-gray-700 text-lg leading-relaxed">
                        {editedJobData?.description || job.description}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Key Responsibilities */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <CheckCircle2 className="w-5 h-5 text-gray-600" />
                        <h3 className="text-xl font-semibold text-gray-900" style={{fontFamily: 'Sora'}}>
                          Key Responsibilities
                        </h3>
                      </div>
                      {isAdminMode && isEditing ? (
                        <div className="space-y-3">
                          {(editedJobData?.keyResponsibilities || job.keyResponsibilities).map((responsibility: string, index: number) => (
                            <div key={index} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-pink-600 rounded-full mt-3 flex-shrink-0"></span>
                              <Textarea
                                value={responsibility}
                                onChange={(e) => {
                                  const updated = [...(editedJobData?.keyResponsibilities || job.keyResponsibilities)];
                                  updated[index] = e.target.value;
                                  setEditedJobData((prev: any) => ({ ...prev, keyResponsibilities: updated }));
                                }}
                                className="text-sm resize-none"
                                rows={2}
                              />
                              <Button
                                onClick={() => {
                                  const updated = (editedJobData?.keyResponsibilities || job.keyResponsibilities).filter((_: string, i: number) => i !== index);
                                  setEditedJobData((prev: any) => ({ ...prev, keyResponsibilities: updated }));
                                }}
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-1"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            onClick={() => {
                              const updated = [...(editedJobData?.keyResponsibilities || job.keyResponsibilities), "New responsibility"];
                              setEditedJobData((prev: any) => ({ ...prev, keyResponsibilities: updated }));
                            }}
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add Responsibility
                          </Button>
                        </div>
                      ) : (
                        <ul className="space-y-3">
                          {(editedJobData?.keyResponsibilities || job.keyResponsibilities).map((responsibility: string, index: number) => (
                            <li key={index} className="flex items-start gap-2 text-gray-700">
                              <span className="w-1.5 h-1.5 bg-pink-600 rounded-full mt-2 flex-shrink-0"></span>
                              {responsibility}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Who Would Love This Job */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Target className="w-5 h-5 text-gray-600" />
                        <h3 className="text-xl font-semibold text-gray-900" style={{fontFamily: 'Sora'}}>
                          Who Would Love This Job
                        </h3>
                      </div>
                      {isAdminMode && isEditing ? (
                        <div className="space-y-3">
                          {(editedJobData?.whoWouldLove || job.whoWouldLove).map((trait: string, index: number) => (
                            <div key={index} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-3 flex-shrink-0"></span>
                              <Textarea
                                value={trait}
                                onChange={(e) => {
                                  const updated = [...(editedJobData?.whoWouldLove || job.whoWouldLove)];
                                  updated[index] = e.target.value;
                                  setEditedJobData((prev: any) => ({ ...prev, whoWouldLove: updated }));
                                }}
                                className="text-sm resize-none"
                                rows={2}
                              />
                              <Button
                                onClick={() => {
                                  const updated = (editedJobData?.whoWouldLove || job.whoWouldLove).filter((_: string, i: number) => i !== index);
                                  setEditedJobData((prev: any) => ({ ...prev, whoWouldLove: updated }));
                                }}
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-1"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            onClick={() => {
                              const updated = [...(editedJobData?.whoWouldLove || job.whoWouldLove), "Someone who..."];
                              setEditedJobData((prev: any) => ({ ...prev, whoWouldLove: updated }));
                            }}
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add Trait
                          </Button>
                        </div>
                      ) : (
                        <ul className="space-y-3">
                          {(editedJobData?.whoWouldLove || job.whoWouldLove).map((trait: string, index: number) => (
                            <li key={index} className="flex items-start gap-2 text-gray-700">
                              <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
                              {trait}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* What Success Looks Like */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Award className="w-5 h-5 text-gray-600" />
                      <h3 className="text-xl font-semibold text-gray-900" style={{fontFamily: 'Sora'}}>
                        What Success Looks Like
                      </h3>
                    </div>
                    {isAdminMode && isEditing ? (
                      <Textarea
                        value={editedJobData?.successLooks || job.successLooks}
                        onChange={(e) => setEditedJobData((prev: any) => ({ ...prev, successLooks: e.target.value }))}
                        className="bg-yellow-50 border-yellow-200 min-h-24"
                        placeholder="Describe what success looks like in this role..."
                      />
                    ) : (
                      <p className="text-gray-700 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        {editedJobData?.successLooks || job.successLooks}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Key Skills Needed */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Lightbulb className="w-5 h-5 text-gray-600" />
                        <h3 className="text-xl font-semibold text-gray-900" style={{fontFamily: 'Sora'}}>
                          Key Skills Needed
                        </h3>
                      </div>
                      {isAdminMode && isEditing ? (
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-2">
                            {(editedJobData?.keySkills || job.keySkills).map((skill: string, index: number) => (
                              <div key={index} className="flex items-center gap-1 bg-pink-50 border border-pink-200 rounded-md px-2 py-1">
                                <Input
                                  value={skill}
                                  onChange={(e) => {
                                    const updated = [...(editedJobData?.keySkills || job.keySkills)];
                                    updated[index] = e.target.value;
                                    setEditedJobData((prev: any) => ({ ...prev, keySkills: updated }));
                                  }}
                                  className="border-0 bg-transparent p-0 h-auto text-sm text-pink-700 font-medium"
                                />
                                <Button
                                  onClick={() => {
                                    const updated = (editedJobData?.keySkills || job.keySkills).filter((_: string, i: number) => i !== index);
                                    setEditedJobData((prev: any) => ({ ...prev, keySkills: updated }));
                                  }}
                                  size="sm"
                                  variant="ghost"
                                  className="h-4 w-4 p-0 text-red-600 hover:text-red-700"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                          <Button
                            onClick={() => {
                              const updated = [...(editedJobData?.keySkills || job.keySkills), "New Skill"];
                              setEditedJobData((prev: any) => ({ ...prev, keySkills: updated }));
                            }}
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add Skill
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {(editedJobData?.keySkills || job.keySkills).map((skill: string, index: number) => (
                            <Badge key={index} variant="outline" className="bg-pink-50 text-pink-700 border-pink-200">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Tools & Software */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <FileText className="w-5 h-5 text-gray-600" />
                        <h3 className="text-xl font-semibold text-gray-900" style={{fontFamily: 'Sora'}}>
                          Tools & Software You'll Use
                        </h3>
                      </div>
                      {isAdminMode && isEditing ? (
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-2">
                            {(editedJobData?.toolsSoftware || job.toolsSoftware).map((tool: string, index: number) => (
                              <div key={index} className="flex items-center gap-1 bg-blue-50 border border-blue-200 rounded-md px-2 py-1">
                                <Input
                                  value={tool}
                                  onChange={(e) => {
                                    const updated = [...(editedJobData?.toolsSoftware || job.toolsSoftware)];
                                    updated[index] = e.target.value;
                                    setEditedJobData((prev: any) => ({ ...prev, toolsSoftware: updated }));
                                  }}
                                  className="border-0 bg-transparent p-0 h-auto text-sm text-blue-700 font-medium"
                                />
                                <Button
                                  onClick={() => {
                                    const updated = (editedJobData?.toolsSoftware || job.toolsSoftware).filter((_: string, i: number) => i !== index);
                                    setEditedJobData((prev: any) => ({ ...prev, toolsSoftware: updated }));
                                  }}
                                  size="sm"
                                  variant="ghost"
                                  className="h-4 w-4 p-0 text-red-600 hover:text-red-700"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                          <Button
                            onClick={() => {
                              const updated = [...(editedJobData?.toolsSoftware || job.toolsSoftware), "New Tool"];
                              setEditedJobData((prev: any) => ({ ...prev, toolsSoftware: updated }));
                            }}
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add Tool
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {(editedJobData?.toolsSoftware || job.toolsSoftware).map((tool: string, index: number) => (
                            <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ideal Candidate Persona Tab */}
          <TabsContent value="persona" className="mt-6">
            <Card>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{fontFamily: 'Sora'}}>
                      {job.persona.name}
                      {isAdminMode && (
                        <span className="text-sm font-normal text-gray-600 ml-2">
                          (View only - persona editing not available)
                        </span>
                      )}
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      {job.persona.description}
                    </p>
                  </div>

                  <div className="space-y-8">
                    {/* Behavioral Profile */}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3" style={{fontFamily: 'Sora'}}>
                        Behavioral Profile Match
                      </h3>
                      <p className="text-gray-700 bg-pink-50 p-4 rounded-lg border border-pink-200 font-medium">
                        {job.persona.behavioralProfile}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4" style={{fontFamily: 'Sora'}}>
                          Key Traits & Characteristics
                        </h3>
                        <ul className="space-y-3">
                          {job.persona.keyTraits.map((trait, index) => (
                            <li key={index} className="flex items-start gap-2 text-gray-700">
                              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                              {trait}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-4" style={{fontFamily: 'Sora'}}>
                          Ideal Behavioral Match
                        </h3>
                        <ul className="space-y-3">
                          {job.persona.idealBehavioralMatch.map((match, index) => (
                            <li key={index} className="flex items-start gap-2 text-gray-700">
                              <Target className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                              {match}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills Assessment Tab */}
          <TabsContent value="assessment" className="mt-6">
            <Card>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{fontFamily: 'Sora'}}>
                        {editedJobData?.assessment?.title || job.assessment.title}
                        {isAdminMode && (
                          <span className="text-sm font-normal text-red-600 ml-2">
                            (Edit skills challenge for candidate suitability)
                          </span>
                        )}
                      </h2>
                      {isAdminMode && isEditing ? (
                        <div className="space-y-4">
                          <Textarea
                            value={editedJobData?.assessment?.description || job.assessment.description}
                            onChange={(e) => setEditedJobData((prev: any) => ({
                              ...prev,
                              assessment: { ...prev?.assessment, description: e.target.value }
                            }))}
                            className="min-h-20"
                            placeholder="Edit assessment description..."
                          />
                          <Input
                            value={editedJobData?.assessment?.estimatedTime || job.assessment.estimatedTime}
                            onChange={(e) => setEditedJobData((prev: any) => ({
                              ...prev,
                              assessment: { ...prev?.assessment, estimatedTime: e.target.value }
                            }))}
                            placeholder="Estimated time (e.g., 45 minutes)"
                            className="max-w-xs"
                          />
                        </div>
                      ) : (
                        <>
                          <p className="text-gray-700 mb-4">
                            {editedJobData?.assessment?.description || job.assessment.description}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            Estimated time: {editedJobData?.assessment?.estimatedTime || job.assessment.estimatedTime}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold text-gray-900" style={{fontFamily: 'Sora'}}>
                        Assessment Questions
                      </h3>
                      {isAdminMode && isEditing && (
                        <Button
                          onClick={() => {
                            const newId = Math.max(...(editedJobData?.assessment?.questions || job.assessment.questions).map((q: any) => q.id)) + 1;
                            const newQuestion = {
                              id: newId,
                              question: "New question?",
                              description: "Describe what you're looking for in the candidate's response..."
                            };
                            setEditedJobData((prev: any) => ({
                              ...prev,
                              assessment: {
                                ...prev?.assessment,
                                questions: [...(prev?.assessment?.questions || job.assessment.questions), newQuestion]
                              }
                            }));
                          }}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add Question
                        </Button>
                      )}
                    </div>
                    
                    {(editedJobData?.assessment?.questions || job.assessment.questions).map((question: any, index: number) => (
                      <div key={question.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-semibold text-gray-700">{question.id}</span>
                          </div>
                          <div className="flex-1">
                            {isAdminMode && isEditing ? (
                              <div className="space-y-3">
                                <Textarea
                                  value={question.question}
                                  onChange={(e) => {
                                    const updatedQuestions = [...(editedJobData?.assessment?.questions || job.assessment.questions)];
                                    updatedQuestions[index] = { ...updatedQuestions[index], question: e.target.value };
                                    setEditedJobData((prev: any) => ({
                                      ...prev,
                                      assessment: { ...prev?.assessment, questions: updatedQuestions }
                                    }));
                                  }}
                                  className="font-semibold resize-none"
                                  rows={2}
                                  placeholder="Enter the question..."
                                />
                                <Textarea
                                  value={question.description}
                                  onChange={(e) => {
                                    const updatedQuestions = [...(editedJobData?.assessment?.questions || job.assessment.questions)];
                                    updatedQuestions[index] = { ...updatedQuestions[index], description: e.target.value };
                                    setEditedJobData((prev: any) => ({
                                      ...prev,
                                      assessment: { ...prev?.assessment, questions: updatedQuestions }
                                    }));
                                  }}
                                  className="text-sm"
                                  rows={2}
                                  placeholder="Describe what you're looking for in the response..."
                                />
                              </div>
                            ) : (
                              <>
                                <h4 className="font-semibold text-gray-900 mb-2" style={{fontFamily: 'Sora'}}>
                                  {question.question}
                                </h4>
                                <p className="text-gray-600 text-sm">
                                  {question.description}
                                </p>
                              </>
                            )}
                          </div>
                          {isAdminMode && isEditing && (
                            <Button
                              onClick={() => {
                                const updatedQuestions = (editedJobData?.assessment?.questions || job.assessment.questions).filter((_: any, i: number) => i !== index);
                                setEditedJobData((prev: any) => ({
                                  ...prev,
                                  assessment: { ...prev?.assessment, questions: updatedQuestions }
                                }));
                              }}
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <div className="ml-11">
                          <div className="bg-gray-50 border border-gray-200 rounded-md p-4 h-24">
                            <span className="text-gray-400 text-sm">Candidate response area...</span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {isAdminMode && isEditing && (editedJobData?.assessment?.questions || job.assessment.questions).length === 0 && (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <p className="text-gray-500 mb-4">No questions yet. Add your first question to get started.</p>
                        <Button
                          onClick={() => {
                            const newQuestion = {
                              id: 1,
                              question: "Why did you apply for this role?",
                              description: "Tell us what excites you about this position and how it aligns with your career goals..."
                            };
                            setEditedJobData((prev: any) => ({
                              ...prev,
                              assessment: {
                                ...prev?.assessment,
                                questions: [newQuestion]
                              }
                            }));
                          }}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add First Question
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-2" style={{fontFamily: 'Sora'}}>
                          Assessment Overview
                        </h4>
                        <p className="text-blue-800 text-sm">
                          This assessment is designed to evaluate candidates' practical skills and thinking processes 
                          relevant to the {job.title} role. Responses are scored on clarity, relevance, and demonstration 
                          of key competencies required for success in this position.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}