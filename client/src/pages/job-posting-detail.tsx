import { useParams, useLocation } from 'wouter';
import { ArrowLeft, Users, MapPin, Clock, Calendar, Briefcase, Target, Shield, Heart, Coffee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const JobPostingDetailPage = () => {
  const { jobId } = useParams();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Save job functionality
  const saveJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
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
      
      const response = await apiRequest('POST', `/api/saved-jobs/${jobId}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save job');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-jobs"] });
      toast({
        title: "Job Saved!",
        description: "This job has been added to your saved jobs.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save job. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Remove saved job functionality
  const removeSavedJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
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
      
      const response = await fetch(`/api/saved-jobs/${jobId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to remove saved job');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-jobs"] });
      toast({
        title: "Job Removed",
        description: "This job has been removed from your saved jobs.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Remove Failed",
        description: error.message || "Failed to remove saved job. Please try again.",
        variant: "destructive",
      });
    },
  });

  const { data: savedJobs = [] } = useQuery({
    queryKey: ["/api/saved-jobs"],
  });

  const isJobSaved = Array.isArray(savedJobs) && savedJobs.some((saved: any) => saved.id === jobId);

  // Mock job posting data - in real app would fetch from API
  const getJobPosting = (id: string) => {
    const jobs = {
      'job-001': {
        id: 'job-001',
        title: 'Marketing Assistant',
        department: 'Marketing',
        location: 'London, UK',
        type: 'Full-time',
        salary: '£22,000 - £26,000',
        experience: 'Entry level',
        postedDate: '2025-01-15',
        applicationDeadline: '2025-02-15',
        description: `We're looking for an enthusiastic Marketing Assistant to join our growing team. This is a fantastic opportunity for someone starting their career in marketing to gain hands-on experience across all aspects of digital marketing, content creation, and campaign management.

You'll work closely with our Marketing Manager to support campaign development, manage social media content, and help analyze the performance of our marketing initiatives. We're looking for someone who's creative, detail-oriented, and eager to learn in a fast-paced environment.`,
        
        responsibilities: [
          'Support the development and execution of digital marketing campaigns',
          'Create engaging content for social media platforms and website',
          'Assist with market research and competitor analysis',
          'Help manage email marketing campaigns and customer communications',
          'Track and report on marketing campaign performance using analytics tools',
          'Support event planning and promotional activities',
          'Maintain marketing databases and CRM systems',
          'Collaborate with design team on marketing materials'
        ],
        
        requirements: [
          'Recent graduate or school leaver with passion for marketing',
          'Strong written and verbal communication skills',
          'Basic understanding of social media platforms and digital marketing',
          'Proficiency in Microsoft Office suite (Word, Excel, PowerPoint)',
          'Creative mindset with attention to detail',
          'Ability to work collaboratively in a team environment',
          'Enthusiasm for learning and professional development',
          'Some experience with content creation (coursework, personal projects, or internships)'
        ],
        
        benefits: [
          'Competitive starting salary with annual reviews',
          '25 days annual leave plus bank holidays',
          'Professional development budget and training opportunities',
          'Flexible working arrangements including hybrid options',
          'Health and wellness benefits including gym membership',
          'Company pension scheme with employer contributions',
          'Friendly, collaborative team environment',
          'Regular team social events and company outings'
        ],
        
        applicationProcess: [
          'Submit your application through our platform',
          'Complete foundation skills assessment (30-45 minutes)',
          'Initial screening interview with HR team',
          'Final interview with Marketing Manager and team member',
          'Reference checks and offer discussion'
        ],
        
        companyInfo: {
          name: 'TechFlow Solutions',
          industry: 'Technology Services',
          size: '50-100 employees',
          description: 'A innovative technology consultancy helping businesses transform their digital presence through strategic marketing and technology solutions.'
        }
      },
      'job-002': {
        id: 'job-002',
        title: 'Sales Coordinator',
        department: 'Sales',
        location: 'Manchester, UK',
        type: 'Full-time',
        salary: '£24,000 - £28,000',
        experience: 'Entry level',
        postedDate: '2025-01-18',
        applicationDeadline: '2025-02-20',
        description: `Join our dynamic sales team as a Sales Coordinator! This role is perfect for someone who thrives in a fast-paced environment and wants to build a career in sales and business development.

You'll support our sales team by managing client relationships, processing orders, and helping to identify new business opportunities. This is an excellent opportunity to learn the fundamentals of B2B sales while making a real impact on our business growth.`,
        
        responsibilities: [
          'Support sales team with lead qualification and follow-up',
          'Maintain customer database and CRM system',
          'Process sales orders and coordinate with fulfillment team',
          'Assist with proposal preparation and contract administration',
          'Schedule meetings and manage sales team calendars',
          'Prepare sales reports and performance analytics',
          'Handle customer inquiries and provide exceptional service',
          'Support sales events and trade show activities'
        ],
        
        requirements: [
          'Recent graduate or equivalent with interest in sales/business development',
          'Excellent communication and interpersonal skills',
          'Strong organizational abilities and attention to detail',
          'Proficiency in Microsoft Office and willingness to learn CRM systems',
          'Customer service mindset with problem-solving abilities',
          'Ability to work under pressure and meet deadlines',
          'Team player with positive, can-do attitude',
          'Some experience in customer-facing roles preferred but not essential'
        ],
        
        benefits: [
          'Competitive base salary plus performance bonuses',
          'Commission structure with uncapped earning potential',
          'Comprehensive sales training and development program',
          '28 days annual leave',
          'Career progression opportunities within growing team',
          'Company car allowance or travel expenses',
          'Health and dental insurance',
          'Regular team incentives and rewards'
        ],
        
        applicationProcess: [
          'Submit application with cover letter highlighting sales interest',
          'Complete behavioral assessment and sales aptitude test',
          'Phone screening with Sales Manager',
          'Face-to-face interview including role-play scenarios',
          'Meet the team session and final decision'
        ],
        
        companyInfo: {
          name: 'Growth Dynamics Ltd',
          industry: 'Business Services',
          size: '100-200 employees',
          description: 'A leading business consultancy specialising in helping SMEs scale their operations through strategic sales and marketing initiatives.'
        }
      }
    };
    
    return jobs[id as keyof typeof jobs];
  };

  const jobPosting = getJobPosting(jobId!);

  if (!jobPosting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h1>
          <p className="text-gray-600 mb-4">The job posting you're looking for doesn't exist.</p>
          <Button onClick={() => setLocation('/employer-jobs')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => setLocation("/employer-jobs")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900" style={{fontFamily: 'Sora'}}>
                {jobPosting.title}
              </h1>
              <p className="text-sm text-gray-600" style={{fontFamily: 'Poppins'}}>
                {jobPosting.companyInfo.name} • {jobPosting.department}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline"
              onClick={() => setLocation(`/job-candidate-matches/${jobId}`)}
            >
              <Users className="w-4 h-4 mr-2" />
              View Candidates
            </Button>
            <Button>
              Edit Job Posting
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{fontFamily: 'Sora'}}>
                  <Briefcase className="w-5 h-5 text-pink-600" />
                  Job Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Location:</span>
                    <span>{jobPosting.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Type:</span>
                    <span>{jobPosting.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Experience:</span>
                    <span>{jobPosting.experience}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Posted:</span>
                    <span>{new Date(jobPosting.postedDate).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-gray-700 leading-relaxed">{jobPosting.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Information Tabs */}
            <Tabs defaultValue="responsibilities" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-100 border border-gray-200 shadow-sm p-1.5 rounded-xl mb-4 h-12">
                <TabsTrigger 
                  value="responsibilities" 
                  className="data-[state=active]:bg-pink-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium transition-all duration-200 rounded-lg text-gray-600 hover:text-gray-900"
                >
                  Responsibilities
                </TabsTrigger>
                <TabsTrigger 
                  value="requirements" 
                  className="data-[state=active]:bg-pink-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium transition-all duration-200 rounded-lg text-gray-600 hover:text-gray-900"
                >
                  Requirements
                </TabsTrigger>
                <TabsTrigger 
                  value="benefits" 
                  className="data-[state=active]:bg-pink-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium transition-all duration-200 rounded-lg text-gray-600 hover:text-gray-900"
                >
                  Benefits
                </TabsTrigger>
                <TabsTrigger 
                  value="process" 
                  className="data-[state=active]:bg-pink-600 data-[state=active]:text-white data-[state=active]:shadow-md font-medium transition-all duration-200 rounded-lg text-gray-600 hover:text-gray-900"
                >
                  Process
                </TabsTrigger>
              </TabsList>

              <TabsContent value="responsibilities" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Key Responsibilities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {jobPosting.responsibilities.map((responsibility, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-pink-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{responsibility}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="requirements" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Requirements & Qualifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {jobPosting.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="benefits" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Benefits & Perks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {jobPosting.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="process" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Application Process</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {jobPosting.applicationProcess.map((step, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-pink-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                            {index + 1}
                          </div>
                          <span className="text-gray-700">{step}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">Salary Range</span>
                  <div className="text-lg font-semibold text-gray-900">{jobPosting.salary}</div>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-600">Application Deadline</span>
                  <div className="text-sm text-gray-900">
                    {new Date(jobPosting.applicationDeadline).toLocaleDateString('en-GB', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-600">Department</span>
                  <div className="text-sm text-gray-900">{jobPosting.department}</div>
                </div>
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle>About {jobPosting.companyInfo.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-700">{jobPosting.companyInfo.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Industry:</span>
                    <span className="text-gray-900">{jobPosting.companyInfo.industry}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Company Size:</span>
                    <span className="text-gray-900">{jobPosting.companyInfo.size}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                <Button 
                  className="w-full bg-[#E2007A] hover:bg-[#E2007A]/90" 
                  onClick={() => setLocation(`/job-application/${jobId}`)}
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Apply Now
                </Button>
                <Button 
                  variant="outline" 
                  className={`w-full ${isJobSaved ? "text-[#E2007A] border-[#E2007A]" : ""}`}
                  onClick={() => {
                    if (isJobSaved) {
                      removeSavedJobMutation.mutate(jobId!);
                    } else {
                      saveJobMutation.mutate(jobId!);
                    }
                  }}
                  disabled={saveJobMutation.isPending || removeSavedJobMutation.isPending}
                >
                  <Heart className={`w-4 h-4 mr-2 ${isJobSaved ? "fill-current" : ""}`} />
                  {saveJobMutation.isPending || removeSavedJobMutation.isPending 
                    ? "Processing..." 
                    : isJobSaved 
                      ? "Remove from Saved" 
                      : "Save Job"
                  }
                </Button>
                <Button variant="outline" className="w-full">
                  <Shield className="w-4 h-4 mr-2" />
                  Share Job
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPostingDetailPage;