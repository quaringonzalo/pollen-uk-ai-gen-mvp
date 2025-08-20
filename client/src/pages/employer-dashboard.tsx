import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
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
  Building2, Users, Briefcase, Plus, BarChart3, MessageSquare, 
  Bell, AlertCircle, Clock, MapPin, Edit3, Eye
} from "lucide-react";

export default function EmployerDashboard() {
  const { toast } = useToast();
  const { user, isLoading, logout } = useAuth();
  const [isAutoLoggingIn, setIsAutoLoggingIn] = useState(false);
  const [shouldShowDemoLogin, setShouldShowDemoLogin] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [, setLocation] = useLocation();

  // Check if user needs demo login - prevent flashing by only setting state after initial load
  React.useEffect(() => {
    const checkAndLogin = async () => {
      if (!isLoading) {
        if (!user || user.role !== 'employer') {
          setShouldShowDemoLogin(true);
        } else if (user && user.role === 'employer') {
          setShouldShowDemoLogin(false);
        }
        setIsInitialized(true);
      }
    };
    
    checkAndLogin();
  }, [user, isLoading]);

  // Manual demo login function
  const handleDemoLogin = async () => {
    try {
      setIsAutoLoggingIn(true);
      setShouldShowDemoLogin(false);
      setIsInitialized(false); // Reset initialization to show loading
      
      // Clear all cache to prevent stale data
      queryClient.clear();
      
      const response = await apiRequest("POST", "/api/demo-login", { role: "employer" });
      const data = await response.json();
      
      if (data.success) {
        // Force a complete page reload to ensure clean state
        window.location.href = window.location.href;
      }
    } catch (error) {
      console.error("Demo login error:", error);
      toast({
        title: "Login failed",
        description: "Please try again",
        variant: "destructive"
      });
      setShouldShowDemoLogin(true);
      setIsInitialized(true);
    } finally {
      setIsAutoLoggingIn(false);
    }
  };

  // Fetch employer profile from API
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['/api/employer-profile/current', user?.id],
    enabled: !!user && user.role === 'employer'
  });

  // Provide default values
  const profileData = (profile as any) || { profileCompleted: false };

  // Show loading while authentication is being checked OR before initialization is complete
  if (isLoading || !isInitialized || isAutoLoggingIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {isAutoLoggingIn ? "Logging in..." : "Loading dashboard..."}
          </p>
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

  // Show loading when profile is still loading for authenticated employer
  if (user?.role === 'employer' && profileLoading) {
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
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
            <h1 className="text-2xl font-semibold text-gray-900" style={{fontFamily: 'Sora'}}>
              Welcome back{profileData?.companyName ? `, ${profileData.companyName}` : ''}
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
      </div>
      
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto space-y-8">
        {/* CACHE BUSTER: Updated Dashboard v2.1 */}
        {!profileData.profileCompleted && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-medium text-blue-900 mb-1" style={{fontFamily: 'Sora'}}>Complete Your Company Profile</h3>
                  <p className="text-sm text-blue-800 mb-3" style={{fontFamily: 'Poppins'}}>
                    Complete your profile to attract quality candidates and improve your visibility.
                  </p>
                  <Button 
                    onClick={() => setLocation("/employer-profile-setup")}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
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
            onClick={() => setLocation("/job-posting")}
            style={{fontFamily: 'Sora'}}
          >
            <Plus className="w-6 h-6" />
            <span className="text-sm font-medium">Post Job</span>
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="h-24 flex flex-col items-center justify-center gap-2 border-gray-200 hover:border-green-200 hover:bg-green-50"
            onClick={() => setLocation("/candidates")}
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

        {/* Your Live Jobs (Quick Navigation) */}
        <Card>
          <CardHeader>
            <CardTitle style={{fontFamily: 'Sora'}}>Your Live Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Marketing Assistant Job */}
              <div 
                className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
                onClick={() => setLocation("/job-detail/job-001")}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900" style={{fontFamily: 'Sora'}}>
                    Digital Marketing Assistant
                  </h4>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  3 candidates • 2 new
                </p>
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button 
                    size="sm" 
                    onClick={() => setLocation("/candidates?job=1")}
                    className="bg-pink-600 hover:bg-pink-700"
                    style={{fontFamily: 'Sora'}}
                  >
                    View Candidates
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="outline"
                        style={{fontFamily: 'Sora'}}
                      >
                        Pause Job
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Pause Job Posting?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will pause the "Marketing Assistant" job posting. It will no longer accept new applications, 
                          but you can reactivate it later.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            toast({
                              title: "Job Paused",
                              description: "The Marketing Assistant job has been paused.",
                            });
                          }}
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
                        size="sm" 
                        variant="outline"
                        style={{fontFamily: 'Sora'}}
                      >
                        Close Job
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Close Job Posting?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently close the "Marketing Assistant" job posting and mark it as filled. 
                          Closed jobs cannot be reactivated.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            toast({
                              title: "Job Closed",
                              description: "The Marketing Assistant job has been closed and marked as filled.",
                            });
                          }}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Close Job
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              {/* Sales Coordinator Job */}
              <div 
                className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
                onClick={() => setLocation("/job-detail/job-002")}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900" style={{fontFamily: 'Sora'}}>
                    Sales Coordinator
                  </h4>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  12 candidates • 2 interviews scheduled
                </p>
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button 
                    size="sm" 
                    onClick={() => setLocation("/candidates?job=2")}
                    className="bg-pink-600 hover:bg-pink-700"
                    style={{fontFamily: 'Sora'}}
                  >
                    View Candidates
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="outline"
                        style={{fontFamily: 'Sora'}}
                      >
                        Pause Job
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Pause Job Posting?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will pause the "Sales Coordinator" job posting. It will no longer accept new applications, 
                          but you can reactivate it later.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            toast({
                              title: "Job Paused",
                              description: "The Sales Coordinator job has been paused.",
                            });
                          }}
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
                        size="sm" 
                        variant="outline"
                        style={{fontFamily: 'Sora'}}
                      >
                        Close Job
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Close Job Posting?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently close the "Sales Coordinator" job posting and mark it as filled. 
                          Closed jobs cannot be reactivated.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            toast({
                              title: "Job Closed",
                              description: "The Sales Coordinator job has been closed and marked as filled.",
                            });
                          }}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Close Job
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              {/* Content Creator Job - Draft */}
              <div className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900" style={{fontFamily: 'Sora'}}>
                    Content Creator
                  </h4>
                  <Badge className="bg-gray-100 text-gray-800">Draft</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Job posting incomplete • Ready to complete
                </p>
                <div className="flex gap-2">
                  <Button 
                    size="sm"
                    onClick={() => {
                      toast({
                        title: "Resume Draft",
                        description: "Redirecting to hiring process dashboard...",
                      });
                      setLocation("/hiring-process-dashboard");
                    }}
                    className="bg-pink-600 hover:bg-pink-700"
                    style={{fontFamily: 'Sora'}}
                  >
                    Complete Draft
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="outline"
                        style={{fontFamily: 'Sora'}}
                      >
                        Delete Draft
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Draft Job Posting?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the "Content Creator" draft job posting. 
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            toast({
                              title: "Draft Deleted",
                              description: "The draft job posting has been deleted.",
                            });
                          }}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete Draft
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              {/* Customer Service Job - Paused */}
              <div className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900" style={{fontFamily: 'Sora'}}>
                    Customer Service Representative
                  </h4>
                  <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  15 candidates • Paused for review
                </p>
                <div className="flex gap-2">
                  <Button 
                    size="sm"
                    onClick={() => {
                      toast({
                        title: "Job Reactivated",
                        description: "The job posting is now active and accepting applications.",
                      });
                    }}
                    className="bg-pink-600 hover:bg-pink-700"
                    style={{fontFamily: 'Sora'}}
                  >
                    Reactivate Job
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setLocation("/candidates?job=4")}
                    style={{fontFamily: 'Sora'}}
                  >
                    View Candidates
                  </Button>
                </div>
              </div>

              {/* Data Analyst Job - Closed */}
              <div className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900" style={{fontFamily: 'Sora'}}>
                    Junior Data Analyst
                  </h4>
                  <Badge className="bg-red-100 text-red-800">Closed</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Position filled • 23 candidates processed
                </p>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setLocation("/candidates?job=5")}
                    style={{fontFamily: 'Sora'}}
                  >
                    View Results
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      toast({
                        title: "Job Reposted",
                        description: "Creating a new posting based on this closed job...",
                      });
                      setLocation("/job-posting");
                    }}
                    style={{fontFamily: 'Sora'}}
                  >
                    Repost Job
                  </Button>
                </div>
              </div>

              {/* Content Creator Job */}
              <div 
                className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow cursor-pointer"
                onClick={() => setLocation("/job-detail/job-003")}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900" style={{fontFamily: 'Sora'}}>
                    Content Creator
                  </h4>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  5 candidates • 1 needs update
                </p>
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button 
                    size="sm" 
                    onClick={() => setLocation("/candidates?job=3")}
                    className="bg-pink-600 hover:bg-pink-700"
                    style={{fontFamily: 'Sora'}}
                  >
                    View Candidates
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="outline"
                        style={{fontFamily: 'Sora'}}
                      >
                        Pause Job
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Pause Job Posting?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will pause the "Content Creator" job posting. It will no longer accept new applications, 
                          but you can reactivate it later.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            toast({
                              title: "Job Paused",
                              description: "The Content Creator job has been paused.",
                            });
                          }}
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
                        size="sm" 
                        variant="outline"
                        style={{fontFamily: 'Sora'}}
                      >
                        Close Job
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Close Job Posting?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently close the "Content Creator" job posting and mark it as filled. 
                          Closed jobs cannot be reactivated.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            toast({
                              title: "Job Closed",
                              description: "The Content Creator job has been closed and marked as filled.",
                            });
                          }}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Close Job
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}