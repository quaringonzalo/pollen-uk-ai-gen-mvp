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
  Building2, Users, Briefcase, Calendar, Star, MessageSquare, 
  Plus, Search, Filter, BarChart3, TrendingUp, Globe, Award,
  Clock, MapPin, Eye, CheckCircle, XCircle, AlertCircle, Home, LogOut,
  MessageCircle, Edit3, Target, Heart, Shield, ThumbsUp, ArrowLeft, FileText, Play, Camera, Coffee, Bell
} from "lucide-react";

export default function EmployerDashboard() {
  const { toast } = useToast();
  const { user, isLoading, logout } = useAuth();
  const [isAutoLoggingIn, setIsAutoLoggingIn] = useState(false);
  const [shouldShowDemoLogin, setShouldShowDemoLogin] = useState(false);
  const [, setLocation] = useLocation();

  // Check if user needs demo login
  React.useEffect(() => {
    const checkAndLogin = async () => {
      // Only show demo login if authentication is complete and there's no user or wrong role
      if (!isLoading && (!user || user.role !== 'employer')) {
        setShouldShowDemoLogin(true);
      } else if (user && user.role === 'employer') {
        setShouldShowDemoLogin(false);
      }
    };
    
    checkAndLogin();
  }, [user, isLoading]);

  // Manual demo login function
  const handleDemoLogin = async () => {
    try {
      setIsAutoLoggingIn(true);
      setShouldShowDemoLogin(false);
      
      const response = await apiRequest("POST", "/api/demo-login", { role: "employer" });
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Demo login successful!",
          description: "You can now access the employer dashboard",
        });
        window.location.reload();
      }
    } catch (error) {
      console.error("Demo login error:", error);
      toast({
        title: "Login failed",
        description: "Please try again",
        variant: "destructive"
      });
      setShouldShowDemoLogin(true);
    } finally {
      setIsAutoLoggingIn(false);
    }
  };

  // Fetch employer profile from API
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['/api/employer-profile/current'],
    enabled: !!user
  });

  // Fetch employer jobs for live job cards
  const { data: employerJobs, isLoading: jobsLoading } = useQuery({
    queryKey: ['/api/employer-jobs'],
    enabled: !!user
  });

  // Dashboard stats (simplified for Phase 1)
  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/employer-dashboard-stats'],
    enabled: !!user
  });

  // Provide default values with proper typing
  const profileData = (profile as any) || { profileCompleted: false };
  const statsData = (dashboardStats as any) || {
    activeJobs: 2,
    totalApplications: 47,
    newApplications: 8,
    scheduledInterviews: 3
  };

  // Show loading while authentication is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show demo login if user not authenticated
  if (shouldShowDemoLogin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center" style={{fontFamily: 'Sora'}}>Access Employer Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-6 text-center" style={{fontFamily: 'Poppins'}}>
              Please log in to access your employer dashboard
            </p>
            <Button 
              onClick={handleDemoLogin}
              disabled={isAutoLoggingIn}
              className="w-full bg-pink-600 hover:bg-pink-700"
              style={{fontFamily: 'Sora'}}
            >
              {isAutoLoggingIn ? "Logging in..." : "Demo Login"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simplified Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900" style={{fontFamily: 'Sora'}}>
              Welcome back, {profileData?.companyName || 'TechFlow Solutions'}
            </h1>
            <p className="text-sm text-gray-600 mt-1" style={{fontFamily: 'Poppins'}}>
              Manage your hiring pipeline
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/employer-messages")}
              className="relative p-2 hover:bg-gray-100"
            >
              <MessageSquare className="w-5 h-5 text-gray-600" />
              <Badge className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs px-1.5 py-0.5 min-w-0 h-5">
                3
              </Badge>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/notifications")}
              className="relative p-2 hover:bg-gray-100"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <Badge className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs px-1.5 py-0.5 min-w-0 h-5">
                5
              </Badge>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-6 max-w-6xl mx-auto space-y-8">

        {/* Profile Setup Alert */}
        {!profileData.profileCompleted && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-medium text-orange-900 mb-1" style={{fontFamily: 'Sora'}}>Complete Your Company Profile</h3>
                  <p className="text-sm text-orange-800 mb-3" style={{fontFamily: 'Poppins'}}>
                    Complete your profile to attract quality candidates and improve your visibility.
                  </p>
                  <Button 
                    onClick={() => setLocation("/employer-profile-setup")}
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700"
                    style={{fontFamily: 'Sora'}}
                  >
                    Set Up Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions - Primary 4 buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            variant="outline"
            size="lg"
            className="h-24 flex flex-col items-center justify-center gap-2 border-gray-200 hover:border-pink-200 hover:bg-pink-50"
            onClick={() => setLocation("/employer-profile")}
            style={{fontFamily: 'Sora'}}
          >
            <Building2 className="w-6 h-6 text-gray-600" />
            <span className="text-sm font-medium">Profile Setup</span>
          </Button>
          
          <Button
            size="lg"
            className="h-24 flex flex-col items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700"
            onClick={() => setLocation("/create-job")}
            style={{fontFamily: 'Sora'}}
          >
            <Plus className="w-6 h-6" />
            <span className="text-sm font-medium">Post Job</span>
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="h-24 flex flex-col items-center justify-center gap-2 border-gray-200 hover:border-green-200 hover:bg-green-50"
            onClick={() => setLocation("/applicants")}
            style={{fontFamily: 'Sora'}}
          >
            <Users className="w-6 h-6 text-gray-600" />
            <span className="text-sm font-medium">Candidates</span>
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="h-24 flex flex-col items-center justify-center gap-2 border-gray-200 hover:border-blue-200 hover:bg-blue-50"
            onClick={() => setLocation("/employer-insights")}
            style={{fontFamily: 'Sora'}}
          >
            <BarChart3 className="w-6 h-6 text-gray-600" />
            <span className="text-sm font-medium">Insights</span>
          </Button>
        </div>

      {/* Recent Activity & Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{fontFamily: 'Sora'}}>
            <Bell className="w-5 h-5" />
            Recent Activity & Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-blue-900" style={{fontFamily: 'Sora'}}>New Application Received</h4>
                <p className="text-sm text-blue-700" style={{fontFamily: 'Poppins'}}>
                  Sarah Chen applied for Marketing Assistant position
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-blue-600">2 hours ago</span>
                  <Button 
                    size="sm" 
                    className="h-6 px-2 text-xs bg-blue-600 hover:bg-blue-700"
                    onClick={() => setLocation("/applicants")}
                  >
                    Review
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-orange-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-orange-900" style={{fontFamily: 'Sora'}}>Applications Awaiting Review</h4>
                <p className="text-sm text-orange-700" style={{fontFamily: 'Poppins'}}>
                  3 applications for Junior Developer need your attention
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-orange-600">5 hours ago</span>
                  <Button 
                    size="sm" 
                    className="h-6 px-2 text-xs bg-orange-600 hover:bg-orange-700"
                    onClick={() => setLocation("/applicants")}
                  >
                    Review All
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-green-900" style={{fontFamily: 'Sora'}}>Interview Scheduled</h4>
                <p className="text-sm text-green-700" style={{fontFamily: 'Poppins'}}>
                  Interview with Alex Johnson scheduled for tomorrow at 10:00 AM
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-green-600">1 day ago</span>
                  <Button 
                    size="sm" 
                    className="h-6 px-2 text-xs bg-green-600 hover:bg-green-700"
                    onClick={() => setLocation("/messages")}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => setLocation("/notifications")}
              style={{fontFamily: 'Sora'}}
            >
              View All Notifications
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Live Job Cards with Direct Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2" style={{fontFamily: 'Sora'}}>
              <Briefcase className="w-5 h-5" />
              Your Active Jobs
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setLocation("/employer-jobs/create")}
                style={{fontFamily: 'Sora'}}
              >
                <Plus className="w-4 h-4 mr-1" />
                Post New Job
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setLocation("/employer-jobs")}
                style={{fontFamily: 'Sora'}}
              >
                Manage All Jobs
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {jobsLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse bg-gray-200 h-20 rounded-lg"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {(employerJobs || []).map((job: any) => (
                <div key={job.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900" style={{fontFamily: 'Sora'}}>
                          {job.title}
                        </h4>
                        <Badge 
                          className={`${job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                        >
                          {job.status === 'active' ? 'Active' : 'Draft'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location || 'London, UK'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.employmentType || 'Full-time'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {job.candidateCount || 0} candidates
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-600">
                            Posted {format(new Date(job.createdAt || Date.now()), 'MMM d')}
                          </span>
                          {job.candidateCount > 0 && (
                            <span className="text-sm font-medium text-pink-600">
                              {job.newCandidates || 0} new this week
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setLocation(`/employer-jobs/${job.id}/edit`)}
                            className="h-8 px-3 text-xs"
                          >
                            <Edit3 className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => {
                              console.log(`🚀 NAVIGATING TO CANDIDATES for job ${job.id}`);
                              setLocation(`/applicants?job=${job.id}`);
                            }}
                            className="h-8 px-3 text-xs bg-pink-600 hover:bg-pink-700"
                            disabled={!job.candidateCount || job.candidateCount === 0}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View Candidates ({job.candidateCount || 0})
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {(!employerJobs || employerJobs.length === 0) && (
                <div className="text-center py-8">
                  <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2" style={{fontFamily: 'Sora'}}>No active jobs yet</h3>
                  <p className="text-gray-600 mb-4" style={{fontFamily: 'Poppins'}}>
                    Create your first job posting to start receiving candidate matches
                  </p>
                  <Button 
                    onClick={() => setLocation("/employer-jobs/create")}
                    className="bg-pink-600 hover:bg-pink-700"
                    style={{fontFamily: 'Sora'}}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Post Your First Job
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}