import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { 
  Users, Calendar, Star, Clock, MapPin, Briefcase,
  ChevronRight, Bell, Heart, ExternalLink, Building2, DollarSign, Trophy
} from "lucide-react";
import SimpleChatbot from "@/components/simple-chatbot";
import PlatformFeedbackDialog from "@/components/platform-feedback-dialog";
import { usePlatformFeedback } from "@/hooks/usePlatformFeedback";
import type { HiddenJob, Job } from "@shared/schema";

export default function Home() {
  const { user } = useAuth();
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

  // Fetch regular jobs (Pollen approved jobs)
  const { data: pollenJobs = [], isLoading: pollenJobsLoading } = useQuery({
    queryKey: ['/api/jobs'],
    enabled: !!user,
  });

  // Fetch hidden jobs
  const { data: hiddenJobs = [], isLoading: hiddenJobsLoading } = useQuery({
    queryKey: ['/api/hidden-jobs'],
    enabled: !!user,
  });

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

  // Combine and process featured jobs for this week
  const getFeaturedJobs = () => {
    const pollenFeaturedJobs = pollenJobs
      .filter((job: Job) => job.status === 'active')
      .slice(0, 3) // Take top 3 Pollen jobs
      .map((job: Job) => ({
        id: `pollen-${job.id}`,
        title: job.title,
        company: job.companyName || 'Company',
        location: job.location || 'Remote',
        salary: job.salaryRange || 'Competitive',
        type: 'pollen' as const,
        pollenApproved: true,
        description: job.description,
        applicationDeadline: job.applicationDeadline,
        originalJob: job
      }));

    const hiddenFeaturedJobs = hiddenJobs
      .filter((job: HiddenJob) => job.isActive && job.featured)
      .slice(0, 3) // Take top 3 hidden jobs
      .map((job: HiddenJob) => ({
        id: `hidden-${job.id}`,
        title: job.role,
        company: job.company,
        location: job.location,
        salary: job.salary || 'Not specified',
        type: 'hidden' as const,
        pollenApproved: job.pollenApproved,
        description: job.description,
        applicationDeadline: job.applicationDeadline,
        applicationLink: job.applicationLink,
        originalJob: job
      }));

    // Combine and shuffle for variety
    const allFeatured = [...pollenFeaturedJobs, ...hiddenFeaturedJobs];
    return allFeatured.slice(0, 6); // Show max 6 featured jobs
  };

  const featuredJobs = getFeaturedJobs();

  const isLoading = pollenJobsLoading || hiddenJobsLoading;

  return (
    <div className="min-h-screen bg-white">
      {/* Desktop Header */}
      <div className="bg-white border-b block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-end h-16">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.location.href = '/notifications'}
                className="relative btn-secondary"
              >
                <Bell className="h-4 w-4 text-gray-700" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  4
                </span>
              </Button>
              
              {/* User Profile */}
              {user && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.href = '/profile'}
                  className="flex items-center gap-2 btn-secondary"
                >
                  <div className="user-avatar w-8 h-8">
                    <span className="text-white font-bold text-sm">
                      {user.firstName ? user.firstName.charAt(0) : user.email?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <span className="font-semibold text-gray-800">
                    {user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.email}
                  </span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-8">
        {/* Welcome Section */}
        <div className="mb-4 sm:mb-6 lg:mb-8 px-2 sm:px-4 lg:px-0">
          <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-sora font-bold text-gray-900 mb-2">
            Welcome back to your career journey! 👋
          </h1>
          <p className="text-sm sm:text-base lg:text-lg font-poppins text-gray-600">
            Discover your perfect career match with skills-first job opportunities from top employers.
          </p>
        </div>

        {/* Complete Profile Banner */}
        <Card className="mb-8 mx-4 sm:mx-0" style={{backgroundColor: '#fff9e6'}}>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                    Complete Your Profile to Unlock Personalised Recommendations
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Once complete, you'll see jobs matched to your skills and work style preferences
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500">
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
              <div className="flex flex-col sm:flex-row items-center justify-between sm:justify-end gap-3">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-gray-700">42%</div>
                  <div className="text-xs text-gray-600">Complete</div>
                </div>
                <Button 
                  onClick={() => window.location.href = '/profile-checkpoints'}
                  variant="pollen"
                  size="sm"
                  className="w-full sm:w-auto whitespace-nowrap"
                >
                  <span className="hidden sm:inline">Complete Profile</span>
                  <span className="sm:hidden">Complete</span>
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
            <div className="mt-4">
              <Progress value={42} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* How Job Applications Work - Only show for new users or those with < 2 applications */}
        {userProgress.applicationsSubmitted < 2 && (
          <Card className="mb-8 mx-4 sm:mx-0" style={{backgroundColor: '#fff9e6'}}>
            <CardContent className="p-4 sm:p-6">
              <div className="mb-4">
                <h3 className="text-xl font-sora font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Target className="w-6 h-6 text-gray-700" />
                  What You Get From Each Application
                </h3>
                <p className="text-gray-600">
                  Every application includes a custom assessment that helps you learn what the job is really like
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gray-700 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">1</div>
                  <h4 className="font-semibold mb-2 text-gray-900">Real Job Preview</h4>
                  <p className="text-sm text-gray-600">Each assessment shows you exactly what tasks you'd do in the role - no generic tests</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gray-700 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">2</div>
                  <h4 className="font-semibold mb-2 text-gray-900">Professional Feedback</h4>
                  <p className="text-sm text-gray-600">Everyone gets detailed feedback to improve their skills and interview chances next time</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gray-700 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-3">3</div>
                  <h4 className="font-semibold mb-2 text-gray-900">Career Development</h4>
                  <p className="text-sm text-gray-600">Build confidence and experience by practicing real work scenarios</p>
                </div>
              </div>
              <div className="mt-6 text-center px-4 sm:px-0">
                <Button onClick={() => window.location.href = '/jobs'} size="lg" variant="pollen" className="w-full sm:w-auto whitespace-nowrap">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Start Browsing Jobs
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Platform Stats - Simplified */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 px-4 sm:px-0">
          <Card className="bg-white border">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-gray-700 text-sm font-poppins font-semibold truncate">Active Job Seekers</p>
                  <p className="text-xl sm:text-2xl font-sora font-bold text-gray-900">{platformStats.totalUsers.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 flex-shrink-0 ml-3" style={{ color: '#E2007A' }} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-gray-700 text-sm font-poppins font-semibold truncate">Live Job Opportunities</p>
                  <p className="text-xl sm:text-2xl font-sora font-bold text-gray-900">{platformStats.activeJobs}</p>
                </div>
                <Globe className="h-8 w-8 flex-shrink-0 ml-3" style={{ color: '#00B878' }} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-gray-700 text-sm font-poppins font-semibold truncate">Success Stories</p>
                  <p className="text-xl sm:text-2xl font-sora font-bold text-gray-900">{platformStats.successStories}</p>
                </div>
                <Heart className="h-8 w-8 flex-shrink-0 ml-3" style={{ color: '#E2007A' }} />
              </div>
            </CardContent>
          </Card>


        </div>



        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-sora">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <div 
                      key={index} 
                      className="p-3 sm:p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colours"
                      onClick={() => {
                        if (action.action === 'profile') {
                          window.location.href = '/profile';
                        } else if (action.action === 'jobs') {
                          window.location.href = '/jobs';
                        } else if (action.action === 'applications') {
                          window.location.href = '/applications';
                        } else if (action.action === 'mentoring') {
                          window.location.href = '/mentor-directory';
                        } else {
                          window.location.href = '/dashboard';
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`${action.colour} p-2 rounded-lg`}>
                          <action.icon className="h-5 w-5 text-gray-700" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{action.title}</h4>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Job Recommendations Section */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <CardTitle className="flex items-center gap-2 font-sora">
                    <Target className="w-5 h-5 text-gray-700" />
                    Recommended Jobs for You
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => window.location.href = '/saved-items'}
                      size="sm"
                      className="flex-1 sm:flex-none"
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Saved Items</span>
                      <span className="sm:hidden">Saved</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => window.location.href = '/jobs'}
                      size="sm"
                      className="flex-1 sm:flex-none"
                    >
                      <span className="hidden sm:inline">View All Jobs</span>
                      <span className="sm:hidden">All Jobs</span>
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topJobRecommendations.map((job) => (
                    <div key={job.id} className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                        <div className="flex items-start gap-3 flex-1">
                          <img
                            src={job.company.logo}
                            alt={`${job.company.name} logo`}
                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{job.title}</h4>
                            <p className="text-sm text-gray-600">{job.company.name}</p>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-gray-500 mt-1">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {job.location}
                              </span>
                              <span>£{job.salary.min.toLocaleString()} - £{job.salary.max.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right sm:text-left">
                          <div className="text-xs text-gray-500">Full-time</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end">
                        <div className="flex gap-2 w-full sm:w-auto">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleSaveJob(job.id)}
                            className={`flex-1 sm:flex-none ${savedJobs.has(job.id) ? 'bg-pink-50 border-pink-200 text-pink-600' : ''}`}
                          >
                            <Heart className={`w-3 h-3 mr-1 ${savedJobs.has(job.id) ? 'fill-pink-600 text-pink-600' : ''}`} />
                            <span className="hidden sm:inline">{savedJobs.has(job.id) ? 'Saved' : 'Save'}</span>
                            <span className="sm:hidden">{savedJobs.has(job.id) ? '♥' : '♡'}</span>
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => {
                              window.location.href = `/jobs/${job.id}/apply`;
                            }}
                            className="bg-pink-600 hover:bg-pink-700 text-white flex-1 sm:flex-none"
                          >
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Your Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  Career Development
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div>
                      <p className="text-sm font-medium text-blue-900">Current Applications</p>
                      <p className="text-xs text-blue-700">Active opportunities you're pursuing</p>
                    </div>
                    <div className="text-lg font-bold text-blue-600">{userProgress.applicationsSubmitted}</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div>
                      <p className="text-sm font-medium text-green-900">Professional Feedback</p>
                      <p className="text-xs text-green-700">Insights received to improve your applications</p>
                    </div>
                    <div className="text-lg font-bold text-green-600">{userProgress.feedbackReceived}</div>
                  </div>
                  
                  {userProgress.interviewsScheduled > 0 && (
                    <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg border border-pink-200">
                      <div>
                        <p className="text-sm font-medium text-pink-900">Interview Opportunities</p>
                        <p className="text-xs text-pink-700">Upcoming conversations with employers</p>
                      </div>
                      <div className="text-lg font-bold text-pink-600">{userProgress.interviewsScheduled}</div>
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Profile Strength</span>
                    <span className="text-sm text-gray-600">{userProgress.profileStrength}%</span>
                  </div>
                  <Progress value={userProgress.profileStrength} className="h-2" />
                  {userProgress.profileStrength < 100 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 w-full text-xs"
                      onClick={() => window.location.href = '/profile-checkpoints'}
                    >
                      Complete Profile
                    </Button>
                  )}
                </div>

                {userProgress.profileViews > 0 && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Profile Views</p>
                      <p className="text-xs text-gray-700">Employers viewing your profile this week</p>
                    </div>
                    <div className="text-lg font-bold text-gray-600">{userProgress.profileViews}</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Community Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-sora">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                  Community Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        {activity.type === "hire" && <Briefcase className="h-5 w-5 text-green-500" />}
                        {activity.type === "application" && <Target className="h-5 w-5 text-blue-500" />}
                        {activity.type === "profile" && <Users className="h-5 w-5 text-pink-500" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{activity.user}</span>
                          {activity.type === 'hire' && (
                            <Badge variant="default" className="text-xs bg-green-600">
                              Hired
                            </Badge>
                          )}
                          {activity.type === 'application' && (
                            <Badge variant="secondary" className="text-xs">
                              Applied
                            </Badge>
                          )}
                          {activity.type === 'profile' && (
                            <Badge variant="outline" className="text-xs">
                              Profile Update
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{activity.action}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Weekly Drop-in */}
            <Card style={{backgroundColor: '#fff9e6'}}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 font-sora text-base sm:text-lg">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
                  <span className="whitespace-nowrap">Weekly Community Drop-in</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Calendar className="h-4 w-4 text-gray-700" />
                    Every Monday, 1:00 PM GMT
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Users className="h-4 w-4 text-gray-700" />
                    42/100 attending this week
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Meet the Pollen team in a relaxed, low-pressure environment for career support
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1 w-full sm:w-auto"
                      variant="pollen"
                      onClick={() => window.location.href = '/weekly-drop-in'}
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-gray-700" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{event.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {event.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Clock className="h-4 w-4" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Users className="h-4 w-4" />
                      {event.attendees}/{event.maxAttendees} attending
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">with {event.mentor}</span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => window.location.href = `/join-event/${event.id}`}
                      >
                        Join
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => window.location.href = '/events'}
                >
                  View All Events <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </CardContent>
            </Card>

            {/* Today's Focus */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  Today's Focus
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Job Applications</h4>
                  <p className="text-sm text-gray-700 mb-3">
                    Browse 12 new job matches and apply to roles that interest you
                  </p>
                  <Button size="sm" variant="pollen" onClick={() => window.location.href = '/jobs'}>
                    Browse Jobs
                  </Button>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Profile Completion</h4>
                  <p className="text-sm text-gray-700 mb-3">
                    Complete your behavioural assessment to unlock personalised job recommendations
                  </p>
                  <Button size="sm" variant="outline" className="border-gray-600 text-gray-600" onClick={() => window.location.href = '/profile-checkpoints'}>
                    Complete Profile
                  </Button>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Community Goal</h4>
                  <p className="text-sm text-gray-700 mb-3">
                    Connect with other professionals and share your career journey
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-gray-600 text-gray-600"
                    onClick={() => window.location.href = '/community'}
                  >
                    Join Community
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Success Story */}
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-800 font-sora">
                  <Star className="h-5 w-5" />
                  Success Story
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#E2007A', fontFamily: 'Sora' }}>
                    <span className="text-white font-bold text-xl">M</span>
                  </div>
                  <blockquote className="text-sm text-amber-800 italic font-poppins">
                    "Pollen's personalised approach was amazing! The custom assessment really showed what I could do, and I got hired within weeks."
                  </blockquote>
                  <div className="text-xs text-amber-700 font-poppins">
                    <strong>Maria Rodriguez</strong> • Marketing Assistant at Creative Studio
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Chatbot Assistant */}
      <SimpleChatbot />
      
      {/* Platform Feedback Dialog */}
      <PlatformFeedbackDialog 
        open={showFeedbackDialog}
        onOpenChange={setShowFeedbackDialog}
      />
    </div>
  );
}