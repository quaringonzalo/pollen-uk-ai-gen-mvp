import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { 
  Users, Calendar, Star, Clock, MapPin, Briefcase,
  ChevronRight, Bell, Heart, ExternalLink, Building2, Banknote, Trophy
} from "lucide-react";
import SimpleChatbot from "@/components/simple-chatbot";
import PlatformFeedbackDialog from "@/components/platform-feedback-dialog";
import { usePlatformFeedback } from "@/hooks/usePlatformFeedback";
import type { HiddenJob, Job } from "@shared/schema";
import { useLocation } from "wouter";

export default function Home() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  
  // Debug user state for deployment
  console.log("🔵 Home component - User:", !!user, user?.firstName, user?.email);
  
  // Platform feedback system
  const { showFeedback } = usePlatformFeedback();
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);

  // Show feedback dialog when conditions are met
  useEffect(() => {
    console.log('showFeedback changed:', showFeedback);
    if (showFeedback) {
      console.log('Setting showFeedbackDialog to true');
      setShowFeedbackDialog(true);
    }
  }, [showFeedback]);

  // Debug state changes
  useEffect(() => {
    console.log('showFeedbackDialog state:', showFeedbackDialog);
  }, [showFeedbackDialog]);

  // Using hardcoded featured jobs for now
  const pollenJobsLoading = false;
  const hiddenJobsLoading = false;

  // Function to handle job saving/unsaving
  const handleSaveJob = (jobId: string) => {
    setSavedJobs(prev => {
      const newSavedJobs = new Set(prev);
      if (newSavedJobs.has(jobId)) {
        newSavedJobs.delete(jobId);
      } else {
        newSavedJobs.add(jobId);
      }
      return newSavedJobs;
    });
  };

  // Fetch featured jobs from API
  const { data: featuredJobsData = [], isLoading: featuredJobsLoading } = useQuery({
    queryKey: ["/api/hidden-jobs"],
  });

  // Transform API data for featured jobs display
  const getFeaturedJobs = () => {
    if (!Array.isArray(featuredJobsData) || featuredJobsData.length === 0) {
      return [];
    }
    
    // Prioritize Pollen approved jobs first, then other jobs
    const pollenJobs = featuredJobsData.filter(job => job.pollenApproved);
    const otherJobs = featuredJobsData.filter(job => !job.pollenApproved);
    const prioritizedJobs = [...pollenJobs, ...otherJobs];
    
    // Get first 6 jobs from prioritized list (Pollen jobs first)
    return prioritizedJobs.slice(0, 6).map((job: any) => ({
      id: `job-${job.id}`,
      title: job.role,
      company: job.company,
      location: job.location,
      salary: job.salary,
      type: job.pollenApproved ? 'pollen' as const : 'external' as const,
      pollenApproved: job.pollenApproved,
      description: job.description,
      applicationDeadline: job.applicationDeadline,
      applicationLink: job.applicationLink,
      originalJob: { id: job.id }
    }));
  };

  const featuredJobs = getFeaturedJobs();
  const isLoading = featuredJobsLoading;

  return (
    <div className="min-h-screen bg-white home-page">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-1 pb-3">
        {/* Welcome Section */}
        <div className="mb-6 -mt-2">
          <h1 className="text-7xl lg:text-8xl font-sora font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName || 'there'}! 👋
          </h1>
          <p className="text-lg text-gray-600">
            Let's find you a job you love.
          </p>
        </div>

        {/* How to Use Pollen Video Section */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              {/* Video Container - Compact */}
              <div className="relative w-32 h-20 flex-shrink-0">
                <div className="w-full h-full bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                  <div className="w-8 h-8 bg-[#E2007A] rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Video Info */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Platform Tutorial</h3>
                <p className="text-sm text-gray-600 mb-2">Quick 3-minute guide to get started</p>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  3 min watch
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Complete Profile Banner */}
        <Card className="mb-8" style={{backgroundColor: '#fff9e6'}}>
          <CardContent className="p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Star className="w-6 h-6 text-gray-700" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Complete Your Profile to Unlock Personalised Recommendations
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Once complete, you'll be able to apply for Pollen approved, CV-less jobs, where you receive guaranteed feedback
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Takes 10-15 minutes
                    </span>
                    <span className="flex items-center gap-1">
                      <Trophy className="w-4 h-4" />
                      Required for job applications
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-700">42%</div>
                  <div className="text-xs text-gray-600">Complete</div>
                </div>
                <Button 
                  onClick={() => window.location.href = '/profile-checkpoints'}
                  variant="pollen"
                  size="sm"
                  className="whitespace-nowrap"
                >
                  Complete Profile
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
            <div className="mt-4">
              <Progress value={42} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Featured Jobs - Full Width */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-sora text-lg">
              <Star className="h-5 w-5 text-gray-700" />
              This Week's Featured Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="border rounded-lg p-5 sm:p-6 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    ))}
                  </div>
                ) : featuredJobs.length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No featured jobs available</h3>
                    <p className="text-gray-600 mb-4">Check back soon for new opportunities</p>
                    <Button onClick={() => window.location.href = '/jobs'} variant="pollen">
                      Browse All Jobs
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {featuredJobs.map((job) => (
                      <div key={job.id} className="border rounded-lg p-5 sm:p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900">{job.title}</h3>
                              {job.pollenApproved && (
                                <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                                  Pollen Approved
                                </Badge>
                              )}
                              {job.type === 'external' && (
                                <Badge variant="outline" className="text-xs">
                                  External
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <span className="flex items-center gap-1">
                                <Building2 className="w-4 h-4" />
                                <button 
                                  className="text-gray-600 hover:text-blue-600 hover:underline cursor-pointer"
                                  onClick={() => {
                                    // Map company names to their proper routes
                                    const companyRoutes = {
                                      'Techflow Solutions': '/company-profile/2',
                                      'Digital Insights Ltd': '/company/digital-insights-ltd',
                                      'Creative Agency Pro': '/company/creative-agency-pro',
                                      'People First Consulting': '/company/people-first-consulting',
                                      'Numbers & Co Accountancy': '/company/numbers-co-accountancy',
                                      'Innovation Hub': '/company/innovation-hub'
                                    };
                                    
                                    const route = companyRoutes[job.company as keyof typeof companyRoutes];
                                    if (route) {
                                      window.location.href = route;
                                    } else {
                                      // Fallback: convert company name to slug format
                                      const slug = job.company.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '');
                                      window.location.href = `/company/${slug}`;
                                    }
                                  }}
                                >
                                  {job.company}
                                </button>
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {job.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Banknote className="w-4 h-4" />
                                {job.salary}
                              </span>
                            </div>
                            {job.description && (
                              <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
                            )}
                            {job.applicationDeadline && (
                              <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                                <Clock className="w-3 h-3" />
                                Apply by {new Date(job.applicationDeadline).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSaveJob(job.id)}
                              className={savedJobs.has(job.id) ? "text-pink-600" : ""}
                            >
                              <Heart className={`w-4 h-4 ${savedJobs.has(job.id) ? "fill-current" : ""}`} />
                            </Button>
                            {job.pollenApproved ? (
                              <Button
                                size="sm"
                                variant="pollen"
                                onClick={() => setLocation(`/job-application/job-${String(job.originalJob?.id || 1).padStart(3, '0')}`)}
                              >
                                View and Apply
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => job.applicationLink && window.open(job.applicationLink, '_blank')}
                                disabled={!job.applicationLink}
                              >
                                <ExternalLink className="w-4 h-4 mr-1" />
                                Apply
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="text-center pt-4">
                      <Button 
                        variant="ghost" 
                        onClick={() => window.location.href = '/jobs'}
                        className="w-full"
                      >
                        View All Jobs
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

        {/* Weekly Community Drop-in - Full Width Banner */}
        <Card style={{backgroundColor: '#fff9e6'}} className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 font-sora text-lg">
              <Users className="h-5 w-5 text-gray-700" />
              Weekly Community Drop-in
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-700 mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-700" />
                    Every Monday, 1:00 PM GMT
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-700" />
                    42/100 attending this week
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Meet the Pollen team in a relaxed, low-pressure environment for career support
                </p>
              </div>
              <div className="sm:ml-6">
                <Button 
                  size="sm" 
                  variant="pollen"
                  onClick={() => window.open('https://calendly.com/pollencareers/ask-us-anything', '_blank')}
                  className="w-full sm:w-auto"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform feedback dialog */}
      <PlatformFeedbackDialog 
        open={showFeedbackDialog} 
        onClose={() => setShowFeedbackDialog(false)} 
      />

      {/* Simple chatbot */}
      <SimpleChatbot />
    </div>
  );
}