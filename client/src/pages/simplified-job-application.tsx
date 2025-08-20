import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

import { 
  ArrowLeft, ArrowRight, MapPin, PoundSterling, Clock, 
  Building2, Star, Trophy, CheckCircle2, 
  FileText, Zap, Users, Shield, Home, TrendingUp, Heart, Award, X, Calendar, ExternalLink
} from "lucide-react";

interface JobData {
  id: string;
  title: string;
  company: {
    name: string;
    logo: string;
    rating: number;
  };
  location: string;
  type: string;
  salary: { min: number; max: number };
  description: {
    overview: string;
    responsibilities: string[];
    requirements: string[];
    whoWouldLoveThis?: string[];
    workingEnvironment?: string;
    growthOpportunities?: string[];
    successCriteria: string;
    keySkills: string[];
    toolsAndSoftware: string[];
  };
  challenge: {
    id: string;
    title: string;
    description: string;
    estimatedTime: string;
    instructions: string;
    tasks: Array<{
      id: string;
      question: string;
      type: "text" | "textarea" | "file";
      required: boolean;
      placeholder?: string;
    }>;
  };
}

const JOB_DATA_MAP: Record<string, JobData> = {
  "job-001": {
    id: "job-001",
    title: "Marketing Coordinator",
    company: {
      name: "Techflow Solutions",
      logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=80&h=80&fit=crop&crop=centre",
      rating: 4.6
    },
    location: "London, UK",
    type: "Full-time",
    salary: { min: 28000, max: 32000 },
    description: {
      overview: "This role involves supporting the marketing team with campaign coordination and digital marketing activities across various channels.",
      responsibilities: [
        "Execute field marketing campaigns and brand activation events across assigned territories",
        "Build and maintain relationships with retail partners and key accounts",
        "Conduct product demonstrations and sampling campaigns in high-traffic locations",
        "Support sales teams with lead generation and customer acquisition activities",
        "Collect market intelligence and customer feedback to inform strategy",
        "Maintain accurate records of campaign activities and sales performance metrics"
      ],
      requirements: [
        "Excellent interpersonal and communication skills for customer-facing interactions",
        "Enthusiasm for brand promotion and creating engaging customer experiences",
        "Comfortable working in various environments including retail locations and events",
        "Strong organisational skills with attention to detail",
        "Ability to work independently whilst representing the brand professionally",
        "Interest in sales, marketing, and building customer relationships"
      ],
      whoWouldLoveThis: [
        "Someone who enjoys meeting new people and building customer relationships",
        "A people-person who thrives in dynamic, customer-facing environments",
        "An energetic individual who loves promoting brands and products they believe in",
        "Someone looking to develop skills in field marketing, sales, and customer engagement"
      ],
      successCriteria: "Successfully execute field marketing campaigns while building strong customer relationships and contributing to sales growth across assigned territories.",
      keySkills: [
        "Customer Relationship Building",
        "Brand Activation",
        "Sales Support",
        "Event Coordination",
        "Market Intelligence"
      ],
      toolsAndSoftware: [
        "CRM Systems",
        "Microsoft Office Suite",
        "Mobile Sales Apps",
        "Social Media Platforms",
        "Event Management Tools"
      ]
    },
    challenge: {
      id: "challenge-001",
      title: "Field Marketing and Sales Assessment",
      description: "This assessment evaluates your customer engagement skills, brand promotion abilities, and understanding of field marketing principles.",
      estimatedTime: "45 minutes",
      instructions: "Please complete all sections thoughtfully. Focus on demonstrating your people skills, brand enthusiasm, and customer-focused approach.",
      tasks: [
        {
          id: "motivation",
          question: "Why did you apply for this Field Marketing and Sales Assistant role?",
          type: "textarea",
          required: true,
          placeholder: "Tell us what excites you about this role and how it aligns with your career goals..."
        },
        {
          id: "scenario-analysis",
          question: "You're representing a new energy drink brand at a music festival. How would you engage with festival-goers to create positive brand awareness and encourage product trial?",
          type: "textarea",
          required: true,
          placeholder: "Consider location setup, audience approach, engagement activities, and follow-up strategies..."
        },
        {
          id: "relationship-building",
          question: "You're tasked with building relationships with three new retail partners in your territory. How would you approach establishing these partnerships and maintaining ongoing communication?",
          type: "textarea",
          required: true,
          placeholder: "Outline your strategy for initial contact, relationship building, and long-term partnership management..."
        },
        {
          id: "problem-solving",
          question: "During a product demonstration at a busy shopping centre, you notice foot traffic is lower than expected. How would you adapt your approach to increase engagement and brand visibility?",
          type: "textarea",
          required: true,
          placeholder: "Describe specific actions you would take to improve the situation and attract more potential customers..."
        }
      ]
    }
  },
  "job-002": {
    id: "job-002",
    title: "Junior Data Analyst",
    company: {
      name: "Digital Insights Ltd",
      logo: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=80&h=80&fit=crop&crop=centre",
      rating: 4.8
    },
    location: "Manchester, UK",
    type: "Full-time",
    salary: { min: 25000, max: 30000 },
    description: {
      overview: "This entry-level position focuses on data collection, analysis, and reporting to support business decision-making processes.",
      responsibilities: [
        "Assist in collecting, cleaning, and analysing data from various sources",
        "Support the creation of reports and dashboards for business stakeholders",
        "Conduct basic statistical analysis to identify trends and patterns",
        "Help maintain data quality and integrity across systems",
        "Support data visualization projects using modern BI tools",
        "Participate in data-driven decision making processes"
      ],
      requirements: [
        "Strong analytical and problem-solving skills",
        "Proficiency in Microsoft Excel and basic statistical concepts",
        "Excellent attention to detail and accuracy",
        "Good communication skills to present findings clearly",
        "Basic understanding of databases and data management",
        "Ability to learn new analytical tools quickly"
      ],
      whoWouldLoveThis: [
        "Someone fascinated by patterns and insights hidden in data",
        "A detail-oriented person who enjoys solving puzzles with numbers",
        "An analytical thinker who wants to drive business decisions",
        "Someone looking to build a career in data science and analytics"
      ],
      successCriteria: "Successfully complete data analysis projects while developing proficiency in BI tools and building strong relationships with business stakeholders.",
      keySkills: [
        "Data Analysis",
        "Excel Proficiency",
        "Statistical Thinking",
        "Data Visualization",
        "Problem Solving"
      ],
      toolsAndSoftware: [
        "Microsoft Excel",
        "SQL",
        "Power BI",
        "Tableau",
        "Python/R (basic)",
        "Google Analytics"
      ]
    },
    challenge: {
      id: "challenge-002",
      title: "Data Analysis Assessment",
      description: "This assessment evaluates your analytical thinking, problem-solving skills, and understanding of data concepts.",
      estimatedTime: "45 minutes",
      instructions: "Please complete all sections thoughtfully. Focus on demonstrating your analytical thinking and problem-solving approach.",
      tasks: [
        {
          id: "motivation",
          question: "Why did you apply for this Junior Data Analyst role?",
          type: "textarea",
          required: true,
          placeholder: "Tell us what excites you about data analysis and how it aligns with your career goals..."
        },
        {
          id: "data-analysis",
          question: "You have a dataset showing monthly sales data for the past year. Describe how you would approach analysing this data to identify trends and insights.",
          type: "textarea",
          required: true,
          placeholder: "Describe your analytical approach and what insights you might look for..."
        },
        {
          id: "problem-solving",
          question: "You notice that the data shows a significant spike in website visits in March, but no corresponding increase in sales. How would you investigate this discrepancy?",
          type: "textarea",
          required: true,
          placeholder: "Explain your systematic approach to investigating this data anomaly..."
        },
        {
          id: "performance-analysis",
          question: "A recent email campaign had a 2% open rate (industry average is 20%). What could be the possible reasons and how would you investigate?",
          type: "textarea",
          required: true,
          placeholder: "Share your analytical approach to understanding campaign performance..."
        }
      ]
    }
  },
  "job-003": {
    id: "job-003",
    title: "Content Marketing Assistant",
    company: {
      name: "Creative Agency Pro",
      logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=80&h=80&fit=crop&crop=centre",
      rating: 4.6
    },
    location: "Birmingham, UK",
    type: "Full-time",
    salary: { min: 25000, max: 27000 },
    description: {
      overview: "This role involves creating written and visual content for various marketing channels and social media platforms.",
      responsibilities: [
        "Develop creative content for social media, blogs, and marketing materials",
        "Collaborate with design team on visual content creation",
        "Research industry trends and audience preferences",
        "Write compelling copy for various marketing channels",
        "Support photo and video content production",
        "Maintain content calendars and publishing schedules"
      ],
      requirements: [
        "Strong writing and storytelling abilities",
        "Creative thinking and visual awareness",
        "Basic design skills or willingness to learn",
        "Understanding of social media platforms",
        "Attention to detail and brand consistency",
        "Ability to meet deadlines and manage multiple projects"
      ],
      whoWouldLoveThis: [
        "Someone passionate about storytelling and creative expression",
        "A detail-oriented person who enjoys crafting compelling messages",
        "An adaptable individual comfortable with various content formats",
        "Someone looking to build a career in content marketing"
      ],
      successCriteria: "Create engaging content that achieves strong engagement metrics while developing and maintaining consistent brand voice across all content platforms.",
      keySkills: [
        "Creative Writing",
        "Visual Storytelling",
        "Social Media Strategy",
        "Content Planning",
        "Brand Voice Development"
      ],
      toolsAndSoftware: [
        "Adobe Creative Suite",
        "Canva/Figma",
        "WordPress",
        "Hootsuite/Later",
        "Grammarly"
      ]
    },
    challenge: {
      id: "challenge-003",
      title: "Content Creation Assessment",
      description: "This assessment evaluates your creative thinking, writing skills, and understanding of content strategy.",
      estimatedTime: "40 minutes",
      instructions: "Please complete all sections thoughtfully. Focus on demonstrating your creativity and strategic thinking.",
      tasks: [
        {
          id: "motivation",
          question: "Why did you apply for this Content Creator role?",
          type: "textarea",
          required: true,
          placeholder: "Tell us what excites you about content creation and how it aligns with your creative goals..."
        },
        {
          id: "content-strategy",
          question: "How would you create content to engage young professionals interested in sustainable living?",
          type: "textarea",
          required: true,
          placeholder: "Describe your approach to understanding the audience and creating relevant content..."
        },
        {
          id: "creative-challenge",
          question: "A client wants to launch a new eco-friendly product but thinks their industry is 'boring'. How would you make their content engaging?",
          type: "textarea",
          required: true,
          placeholder: "Share your creative approach to making any topic interesting and engaging..."
        },
        {
          id: "content-adaptation",
          question: "How would you adapt the same message for LinkedIn, Instagram, and a blog post?",
          type: "textarea",
          required: true,
          placeholder: "Explain how you'd tailor content for different platforms and audiences..."
        }
      ]
    }
  }
};

export default function SimplifiedJobApplication() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const jobId = params.jobId;
  
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCompanyProfile, setShowCompanyProfile] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const queryClient = useQueryClient();

  // Query for saved jobs to check if this job is already saved
  const { data: savedJobsData = [] } = useQuery({
    queryKey: ["/api/saved-jobs"],
    enabled: !!jobId,
  });

  // Update saved state when data changes
  useEffect(() => {
    if (savedJobsData && jobId) {
      // Convert job-001 to 1, job-002 to 2, etc.
      const numericJobId = parseInt(jobId.replace('job-', ''));
      const isCurrentJobSaved = Array.isArray(savedJobsData) && 
        savedJobsData.some((saved: any) => saved.id?.toString() === numericJobId.toString());
      console.log("📋 Save Job Debug:", { jobId, numericJobId, savedJobsData, isCurrentJobSaved });
      setIsSaved(isCurrentJobSaved);
    }
  }, [savedJobsData, jobId]);

  // Save job functionality
  const saveJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      // Convert job-001 to 1, job-002 to 2, etc.
      const numericJobId = parseInt(jobId.replace('job-', ''));
      return fetch(`/api/saved-jobs/${numericJobId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }).then(res => res.json());
    },
    onSuccess: () => {
      setIsSaved(true);
      queryClient.invalidateQueries({ queryKey: ['/api/saved-jobs'] });
    },
    onError: (error) => {
      console.error('Failed to save job:', error);
    }
  });

  // Remove saved job functionality
  const removeSavedJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      // Convert job-001 to 1, job-002 to 2, etc.
      const numericJobId = parseInt(jobId.replace('job-', ''));
      return fetch(`/api/saved-jobs/${numericJobId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      }).then(res => {
        if (res.status === 204) return {};
        return res.json();
      });
    },
    onSuccess: () => {
      setIsSaved(false);
      queryClient.invalidateQueries({ queryKey: ['/api/saved-jobs'] });
    },
    onError: (error) => {
      console.error('Failed to remove saved job:', error);
    }
  });

  // Handle save/unsave job
  const handleSaveJob = () => {
    if (!jobId) return;
    
    console.log("💾 Save Job Action:", { jobId, isSaved, action: isSaved ? 'unsave' : 'save' });
    
    if (isSaved) {
      removeSavedJobMutation.mutate(jobId);
    } else {
      saveJobMutation.mutate(jobId);
    }
  };


  console.log("Job ID from params:", jobId);
  console.log("Available job IDs:", Object.keys(JOB_DATA_MAP));
  
  const currentJob = jobId ? JOB_DATA_MAP[jobId] : null;

  if (!currentJob) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
          <p className="mb-4">Job ID: {jobId}</p>
          <p className="mb-4">Available jobs: {Object.keys(JOB_DATA_MAP).join(', ')}</p>
          <Button onClick={() => setLocation("/jobs")}>Back to Jobs</Button>
        </div>
      </div>
    );
  }

  const handleAnswerChange = (taskId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [taskId]: value }));
  };

  const isStepComplete = (step: number) => {
    if (step === 1) return true;
    if (step === 2) {
      return currentJob.challenge.tasks.every(task => 
        !task.required || (answers[task.id] && answers[task.id].trim().length > 0)
      );
    }
    return false;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to applications page after successful submission
      setLocation('/applications');
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitApplication = async () => {
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Redirect to application success page instead of showing inline component
      setLocation('/application-success');
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4 flex-1">
            <Button variant="ghost" size="sm" onClick={() => setLocation("/jobs")}>
              <Home className="w-4 h-4 mr-2" />
              See All Jobs
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Apply for {currentJob.title}</h1>
              <p className="text-gray-600">at {currentJob.company.name}</p>
            </div>
          </div>
          {/* Company Profile Toggle */}
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveJob}
              className={isSaved ? "text-pink-600 border-pink-600" : ""}
              disabled={saveJobMutation.isPending || removeSavedJobMutation.isPending}
            >
              <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
              {isSaved ? "Saved" : "Save Job"}
            </Button>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Job Details</span>
              <button
                onClick={() => setShowCompanyProfile(!showCompanyProfile)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colours ${
                  showCompanyProfile ? 'bg-pink-600' : 'bg-gray-200'
                }`}
                style={showCompanyProfile ? {backgroundColor: '#E2007A'} : {}}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    showCompanyProfile ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span>Company Profile</span>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-4 mb-8">
          {[1, 2].map((step) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm
                ${currentStep >= step ? 'bg-pink-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                style={currentStep >= step ? {backgroundColor: '#E2007A'} : {}}
              >
                {step}
              </div>
              <span className={`font-medium ${currentStep >= step ? 'text-pink-600' : 'text-gray-600'}`}
                style={currentStep >= step ? {color: '#E2007A'} : {}}
              >
                {step === 1 ? 'Job Overview' : 'Assessment'}
              </span>
              {step < 2 && (
                <div className={`w-12 h-1 ${currentStep > step ? 'bg-pink-600' : 'bg-gray-200'}`}
                  style={currentStep > step ? {backgroundColor: '#E2007A'} : {}}
                />
              )}
            </div>
          ))}
        </div>

        {/* Job Overview Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <img 
                  src={currentJob.company.logo}
                  alt={`${currentJob.company.name} logo`}
                  className="w-16 h-16 rounded-lg border"
                />
                <div>
                  <CardTitle className="text-xl mb-2" style={{fontFamily: 'Sora'}}>{currentJob.title}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center gap-1">
                      <Building2 className="w-4 h-4" />
                      <button 
                        onClick={() => setShowCompanyProfile(true)}
                        className="hover:text-pink-600 underline"
                      >
                        {currentJob.company.name}
                      </button>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{currentJob.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{currentJob.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <PoundSterling className="w-4 h-4" />
                    <span className="font-medium">
                      £{currentJob.salary.min.toLocaleString()} - £{currentJob.salary.max.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Job Overview */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3 text-lg" style={{fontFamily: 'Sora'}}>About This Role</h3>
              <p className="text-gray-700" style={{fontFamily: 'Poppins'}}>{currentJob.description.overview}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Key Responsibilities */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2" style={{fontFamily: 'Sora'}}>
                  <CheckCircle2 className="w-5 h-5 text-gray-600" />
                  Key Responsibilities
                </h3>
                <ul className="space-y-2">
                  {currentJob.description.responsibilities.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-gray-600 rounded-full mt-2 flex-shrink-0" />
                      <span style={{fontFamily: 'Poppins'}}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Who Would Love This Job */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2" style={{fontFamily: 'Sora'}}>
                  <Heart className="w-5 h-5 text-gray-600" />
                  Who Would Love This Job
                </h3>
                <ul className="space-y-2">
                  {currentJob.description.whoWouldLoveThis?.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-gray-600 rounded-full mt-2 flex-shrink-0" />
                      <span style={{fontFamily: 'Poppins'}}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Success Criteria */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2" style={{fontFamily: 'Sora'}}>
                <Trophy className="w-5 h-5 text-yellow-600" />
                What Success Looks Like
              </h3>
              <p className="text-sm text-gray-700" style={{fontFamily: 'Poppins'}}>{currentJob.description.successCriteria}</p>
            </div>

            {/* Key Skills and Tools Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Key Skills */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2" style={{fontFamily: 'Sora'}}>
                  <Award className="w-5 h-5 text-pink-600" />
                  Key Skills Needed
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentJob.description.keySkills.map((skill, index) => (
                    <Badge 
                      key={index}
                      variant="outline"
                      className="bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Tools & Software */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2" style={{fontFamily: 'Sora'}}>
                  <Zap className="w-5 h-5 text-blue-600" />
                  Tools & Software You'll Use
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentJob.description.toolsAndSoftware.map((tool, index) => (
                    <Badge 
                      key={index}
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                    >
                      {tool}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Job Overview */}
        {currentStep === 1 && (
          <div className="space-y-6">

            {/* Application Process */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{fontFamily: 'Sora'}}>
                  <Zap className="w-5 h-5 text-gray-600" />
                  What Happens Next
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <h4 className="font-medium text-sm mb-1" style={{fontFamily: 'Sora'}}>1. Complete Assessment</h4>
                    <p className="text-xs text-gray-600" style={{fontFamily: 'Poppins'}}>Demonstrate your skills with our practical challenge</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <h4 className="font-medium text-sm mb-1" style={{fontFamily: 'Sora'}}>2. Team Review</h4>
                    <p className="text-xs text-gray-600" style={{fontFamily: 'Poppins'}}>Our team reviews and shortlists curated applications</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Trophy className="w-5 h-5 text-purple-600" />
                    </div>
                    <h4 className="font-medium text-sm mb-1" style={{fontFamily: 'Sora'}}>3. Professional Feedback</h4>
                    <p className="text-xs text-gray-600" style={{fontFamily: 'Poppins'}}>Receive detailed feedback within 1 week guaranteed</p>
                  </div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Award className="w-5 h-5 text-orange-600" />
                    </div>
                    <h4 className="font-medium text-sm mb-1" style={{fontFamily: 'Sora'}}>4. Interview Invitation</h4>
                    <p className="text-xs text-gray-600" style={{fontFamily: 'Poppins'}}>Top candidates invited for interview</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={() => setCurrentStep(2)} size="lg" className="bg-pink-600 hover:bg-pink-700 text-white" style={{backgroundColor: '#E2007A'}}>
                Start Assessment
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Assessment */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-gray-600" />
                  {currentJob.challenge.title}
                </CardTitle>
                <p className="text-gray-600">{currentJob.challenge.description}</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>⏱️ Estimated time: {currentJob.challenge.estimatedTime} (guideline only - not timed)</span>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <p className="text-sm text-orange-800">
                      <strong>Note on AI usage:</strong> AI platforms, like Chat GPT, can be helpful for job applications, but pretty please don't copy and paste an answer for your application. We have beady-eyes and will not accept anything that is obviously AI generated. We want to know the real you, not a robot. You've got this!
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {currentJob.challenge.tasks.map((task, index) => (
                    <div key={task.id} className="space-y-2">
                      <label className="font-medium text-gray-900">
                        {index + 1}. {task.question}
                        {task.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      <Textarea
                        value={answers[task.id] || ''}
                        onChange={(e) => handleAnswerChange(task.id, e.target.value)}
                        placeholder={task.placeholder}
                        className="min-h-[100px]"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Overview
              </Button>
              <Button
                onClick={handleSubmitApplication}
                disabled={!isStepComplete(2) || isSubmitting}
                className="min-w-[140px]"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Company Profile Sliding Panel */}
      {showCompanyProfile && (
        <div 
          className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl border-l transform transition-transform duration-300 ease-in-out translate-x-0"
          style={{ zIndex: 9999 }}
        >
          {/* Close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCompanyProfile(false)}
            className="absolute top-4 right-4 z-10"
          >
            <X className="w-4 h-4" />
          </Button>

          {/* Company Profile Content */}
          <div className="h-full overflow-y-auto p-6">
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={currentJob.company.logo}
                  alt={`${currentJob.company.name} logo`}
                  className="w-16 h-16 rounded-lg border"
                />
                <div>
                  <h2 className="text-xl font-bold">{currentJob.company.name}</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Medium size company</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{currentJob.company.rating} applicant rating</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">A dynamic creative agency specialising in digital marketing, brand development, and innovative campaign strategies. We pride ourselves on fostering creativity while maintaining the highest professional standards in all our client work.</p>
              
              {/* Key Stats */}
              <div className="grid grid-cols-1 gap-3 text-sm mb-6">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gray-500" />
                  <span>Creative & Marketing</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>London, UK</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span>51-200 employees</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>Founded 2018</span>
                </div>
              </div>

              {/* Candidate Experience */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Candidate Experience</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Feedback Quality</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                      <span className="text-sm font-medium">4.6/5</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Communication Speed</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-gray-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                      </div>
                      <span className="text-sm font-medium">4.4/5</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Interview Experience</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-gray-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                      </div>
                      <span className="text-sm font-medium">4.5/5</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Process Transparency</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '86%' }}></div>
                      </div>
                      <span className="text-sm font-medium">4.3/5</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Values */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Company Values</h3>
                <div className="space-y-2">
                  {['Innovation & Creativity', 'Collaboration', 'Continuous Learning', 'Work-Life Balance'].map((value, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-gray-700">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Testimonials */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">From Our Team</h3>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700 mb-2">
                      "The support and mentorship here is incredible. I've grown so much in my role and feel valued as part of the team."
                    </p>
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">Sarah, Marketing Coordinator</span> • 2 years
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-700 mb-2">
                      "Great work-life balance and opportunities to work on exciting projects. The team is collaborative and supportive."
                    </p>
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">James, Junior Developer</span> • 1 year
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Benefits & Perks</h3>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  {['Flexible working hours', 'Professional development budget', 'Health & wellness benefits', 'Team events & socials', 'Remote work options'].map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* View Full Profile Link */}
              <div className="mt-6 pt-4 border-t">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open('/company-profile/2', '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Full Company Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay */}
      {showCompanyProfile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25"
          style={{ zIndex: 9998 }}
          onClick={() => setShowCompanyProfile(false)}
        />
      )}
    </>
  );
}