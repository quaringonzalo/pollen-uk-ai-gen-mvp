import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  Building2, FileText, Users, MessageSquare, 
  Eye, Calendar, CheckCircle, Bell, BarChart3,
  UserPlus, TrendingUp, MapPin, UserCheck, Settings, User
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DashboardStats {
  totalJobSeekers: number;
  newSignupsToday: number;
  totalEmployers: number;
  newEmployersRequiringApproval: number;
  liveJobs: number;
  pendingJobApprovals: number;
}

interface AssignedJob {
  id: number;
  jobTitle: string;
  companyName: string;
  status: 'live' | 'pending_approval' | 'needs_attention';
  assignedDate: string;
  totalApplications: number;
  newApplicationsToReview: number;
  pollenInterviewsBooked: number;
  feedbackSent: number;
  candidatesMatchedToEmployer: number;
  needsApproval?: boolean;
  assignedTo?: string;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();

  // Fetch dashboard statistics
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["/api/admin/dashboard-stats"],
    initialData: {
      totalJobSeekers: 1247,
      newSignupsToday: 8,
      totalEmployers: 184,
      newEmployersRequiringApproval: 11,
      liveJobs: 23,
      pendingJobApprovals: 7
    }
  });

  // Fetch jobs assigned to current admin (Holly)
  const { data: myAssignedJobs } = useQuery<AssignedJob[]>({
    queryKey: ["/api/admin/my-assigned-jobs"],
    initialData: [
      {
        id: 1,
        jobTitle: "Marketing Assistant",
        companyName: "TechFlow Solutions",
        status: "live",
        assignedDate: "2025-01-10",
        totalApplications: 15,
        newApplicationsToReview: 5,
        pollenInterviewsBooked: 3,
        feedbackSent: 6,
        candidatesMatchedToEmployer: 1,
        assignedTo: "Holly (You)"
      },
      {
        id: 2,
        jobTitle: "UX Designer",
        companyName: "Creative Studios",
        status: "live",
        assignedDate: "2025-01-08",
        totalApplications: 12,
        newApplicationsToReview: 2,
        pollenInterviewsBooked: 1,
        feedbackSent: 8,
        candidatesMatchedToEmployer: 2,
        assignedTo: "Holly (You)"
      },
      {
        id: 3,
        jobTitle: "Content Writer",
        companyName: "Digital Media Co",
        status: "live",
        assignedDate: "2025-01-12",
        totalApplications: 8,
        newApplicationsToReview: 3,
        pollenInterviewsBooked: 2,
        feedbackSent: 3,
        candidatesMatchedToEmployer: 0,
        assignedTo: "Holly (You)"
      }
    ]
  });

  // Notifications data
  const notifications: any[] = [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Live</Badge>;
      case 'pending_approval':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending Approval</Badge>;
      case 'needs_attention':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Needs Attention</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 admin-compact-mode">
      {/* Header with Alerts */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, Holly 💛</h1>
            
            {/* Notification and Message Alerts */}
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setLocation("/admin/notifications")}
                className="relative"
              >
                <Bell className="h-4 w-4 mr-1" />
                Notifications
                <Badge className="ml-2 bg-red-100 text-red-800 text-xs">1</Badge>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setLocation("/admin/messages")}
                className="relative"
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Messages
                <Badge className="ml-2 bg-blue-100 text-blue-800 text-xs">8</Badge>
              </Button>

              {/* User Profile Icon */}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setLocation("/admin/settings")}
                className="relative p-1"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-sm bg-purple-500 text-white font-medium">
                    HS
                  </AvatarFallback>
                </Avatar>
              </Button>
            </div>
          </div>

          {/* Notification Alerts */}
          {notifications.length > 0 && (
            <div className="pb-4 space-y-2">
              {notifications.map((notification) => (
                <Alert key={notification.id} className={`cursor-pointer transition-colors ${
                  notification.type === 'urgent' ? 'border-orange-200 bg-orange-50' : 'border-blue-200 bg-blue-50'
                }`} onClick={() => setLocation(notification.route)}>
                  <Bell className="h-4 w-4" />
                  <AlertDescription className="flex items-center justify-between">
                    <span>{notification.message}</span>
                    <Button variant="ghost" size="sm" className="text-xs">
                      Review →
                    </Button>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Job Seekers Card */}
          <Card className="cursor-pointer hover:shadow-md transition-shadow border-blue-200 bg-blue-50" onClick={() => setLocation("/admin/all-job-seekers")}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-700 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Job Seekers
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold text-gray-900">{stats?.totalJobSeekers.toLocaleString()}</div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="text-xs p-1" onClick={(e) => { e.stopPropagation(); setLocation("/admin/all-job-seekers"); }}>
                    <Users className="h-3 w-3 mr-1" />
                    View All
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs p-1" onClick={(e) => { e.stopPropagation(); setLocation("/admin/comprehensive-analytics"); }}>
                    <BarChart3 className="h-3 w-3 mr-1" />
                    Analytics
                  </Button>
                </div>
              </div>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                <span className="text-sm text-green-600 font-medium">+{stats?.newSignupsToday} today</span>
              </div>
            </CardContent>
          </Card>

          {/* Employers Card */}
          <Card className="cursor-pointer hover:shadow-md transition-shadow border-purple-200 bg-purple-50" onClick={() => setLocation("/admin/employers")}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-purple-700 flex items-center">
                <Building2 className="h-4 w-4 mr-2" />
                Employers
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold text-gray-900">{stats?.totalEmployers}</div>
                <Button variant="ghost" size="sm" className="text-xs p-1">
                  <UserCheck className="h-3 w-3 mr-1" />
                  Manage
                </Button>
              </div>
              <div className="flex items-center mt-1">
                <UserPlus className="h-3 w-3 text-orange-600 mr-1" />
                <span className="text-sm text-orange-600 font-medium">{stats?.newEmployersRequiringApproval} need approval</span>
              </div>
            </CardContent>
          </Card>

          {/* Live Jobs Card */}
          <Card className="cursor-pointer hover:shadow-md transition-shadow border-green-200 bg-green-50" onClick={() => setLocation("/admin/assigned-jobs?tab=awaiting-approval")}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-700 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Live Jobs
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-bold text-gray-900">{stats?.liveJobs}</div>
                <Button variant="ghost" size="sm" className="text-xs p-1">
                  <Eye className="h-3 w-3 mr-1" />
                  Review
                </Button>
              </div>
              <div className="flex items-center mt-1">
                <CheckCircle className="h-3 w-3 text-blue-600 mr-1" />
                <span className="text-sm text-blue-600 font-medium">{stats?.pendingJobApprovals} pending approval</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Assigned Jobs Section */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">My Assigned Jobs</h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setLocation("/admin/assigned-jobs")}
              >
                View All Jobs
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {myAssignedJobs?.map((job) => (
              <Card key={job.id} className="cursor-pointer hover:shadow-md transition-shadow border border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium text-gray-900">{job.jobTitle}</h3>
                        {getStatusBadge(job.status)}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <Building2 className="h-4 w-4 mr-1" />
                        {job.companyName}
                        <span className="mx-2">•</span>
                        <Calendar className="h-4 w-4 mr-1" />
                        Assigned {new Date(job.assignedDate).toLocaleDateString()}
                      </div>

                      {/* Application Summary - Compact */}
                      <div className="flex gap-4 text-sm mb-3">
                        <span className="text-gray-600">{job.totalApplications} Total</span>
                        {job.newApplicationsToReview > 0 && (
                          <span className="text-green-700 font-medium">{job.newApplicationsToReview} New</span>
                        )}
                        {job.pollenInterviewsBooked > 0 && (
                          <span className="text-blue-700 font-medium">{job.pollenInterviewsBooked} Interviews</span>
                        )}
                        <span className="text-purple-700">{job.feedbackSent} Feedback</span>
                        {job.candidatesMatchedToEmployer > 0 && (
                          <span className="text-yellow-700 font-medium">{job.candidatesMatchedToEmployer} Matched</span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">
                      <Button
                        size="sm"
                        onClick={() => setLocation(`/admin/job-applicants-grid/${job.id}`)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        View Candidates
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setLocation(`/job-posting-view/${job.id}?admin=true`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Job Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Quick Actions Section */}
        <div className="bg-white rounded-lg shadow-sm border mt-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="justify-start h-12"
                onClick={() => setLocation("/admin/comprehensive-analytics")}
              >
                <BarChart3 className="w-5 h-5 mr-3 text-blue-600" />
                <div className="text-left">
                  <div className="font-medium">Analytics Dashboard</div>
                  <div className="text-xs text-gray-500">View comprehensive insights</div>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="justify-start h-12"
                onClick={() => setLocation("/admin/hidden-jobs")}
              >
                <Eye className="w-5 h-5 mr-3 text-purple-600" />
                <div className="text-left">
                  <div className="font-medium">Hidden Jobs Board</div>
                  <div className="text-xs text-gray-500">Manage exclusive opportunities</div>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="justify-start h-12"
                onClick={() => setLocation("/admin/all-job-seekers")}
              >
                <Users className="w-5 h-5 mr-3 text-green-600" />
                <div className="text-left">
                  <div className="font-medium">All Job Seekers</div>
                  <div className="text-xs text-gray-500">Manage user profiles</div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}