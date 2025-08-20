import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChevronRight, Building2, MapPin, Clock, MessageCircle, 
  Calendar, Eye, CheckCircle2, XCircle, AlertCircle,
  Star, PoundSterling, Briefcase, Trophy
} from "lucide-react";

interface Application {
  id: string;
  jobTitle: string;
  company: {
    name: string;
    logo: string;
    rating: number;
  };
  location: string;
  salary: { min: number; max: number };
  appliedDate: string;
  status: "pending" | "under_review" | "feedback_ready" | "employer_interested" | "interview_scheduled" | "rejected" | "withdrawn";
  lastUpdate: string;
  nextStep?: string;
  hasUnreadMessage?: boolean;
  hasFeedback?: boolean;
  overallScore?: number;
}

export default function ApplicationTrackerPage() {
  const [activeTab, setActiveTab] = useState("active");

  // Mock application data
  const applications: Application[] = [
    {
      id: "app-mkting-coordinator-123",
      jobTitle: "Marketing Coordinator", 
      company: {
        name: "TechFlow Solutions",
        logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=50&h=50&fit=crop&crop=centre",
        rating: 4.8
      },
      location: "London, UK",
      salary: { min: 25000, max: 32000 },
      appliedDate: "2025-01-15",
      status: "feedback_ready",
      lastUpdate: "2025-01-20",
      nextStep: "Review your assessment feedback",
      hasUnreadMessage: false,
      hasFeedback: true,
      overallScore: 78
    },
    {
      id: "app-001",
      jobTitle: "Social Media Assistant", 
      company: {
        name: "Growth Partners",
        logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=50&h=50&fit=crop&crop=centre",
        rating: 4.4
      },
      location: "Manchester, UK",
      salary: { min: 25000, max: 28000 },
      appliedDate: "2025-01-20",
      status: "employer_interested",
      lastUpdate: "2025-01-22",
      nextStep: "Respond to employer message",
      hasUnreadMessage: true
    },
    {
      id: "app-002", 
      jobTitle: "Media Planning Assistant (Premium)",
      company: {
        name: "CreativeMinds Agency",
        logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=50&h=50&fit=crop&crop=centre",
        rating: 4.6
      },
      location: "London, UK", 
      salary: { min: 26000, max: 32000 },
      appliedDate: "2024-01-18",
      status: "feedback_ready",
      lastUpdate: "2024-01-21",
      nextStep: "View feedback from employer",
      hasFeedback: true,
      overallScore: 78
    },
    {
      id: "app-003",
      jobTitle: "Client Relations Assistant",
      company: {
        name: "Adaptive Solutions Ltd",
        logo: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=50&h=50&fit=crop&crop=centre", 
        rating: 4.2
      },
      location: "Birmingham, UK",
      salary: { min: 23000, max: 27000 },
      appliedDate: "2024-01-15",
      status: "interview_scheduled",
      lastUpdate: "2024-01-21",
      nextStep: "Video interview on Jan 25, 2:00 PM"
    },
    {
      id: "app-004",
      jobTitle: "Social Media Assistant",
      company: {
        name: "Digital Dynamics",
        logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=50&h=50&fit=crop&crop=centre",
        rating: 4.1
      },
      location: "Leeds, UK",
      salary: { min: 22000, max: 26000 },
      appliedDate: "2024-01-10",
      status: "rejected", 
      lastUpdate: "2024-01-17",
      nextStep: "Application closed"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-gray-100 text-gray-800";
      case "under_review": return "bg-blue-100 text-blue-800";
      case "feedback_ready": return "bg-indigo-100 text-indigo-800";
      case "employer_interested": return "bg-green-100 text-green-800";
      case "interview_scheduled": return "bg-purple-100 text-purple-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "withdrawn": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="w-4 h-4" />;
      case "under_review": return <Eye className="w-4 h-4" />;
      case "feedback_ready": return <CheckCircle2 className="w-4 h-4" />;
      case "employer_interested": return <CheckCircle2 className="w-4 h-4" />;
      case "interview_scheduled": return <Calendar className="w-4 h-4" />;
      case "rejected": return <XCircle className="w-4 h-4" />;
      case "withdrawn": return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "Application Submitted";
      case "under_review": return "Under Review";
      case "feedback_ready": return "Feedback Ready";
      case "employer_interested": return "Employer Interested";
      case "interview_scheduled": return "Interview Scheduled";
      case "rejected": return "Not Selected";
      case "withdrawn": return "Withdrawn";
      default: return "Unknown";
    }
  };

  const activeApplications = applications.filter(app => 
    !["rejected", "withdrawn"].includes(app.status)
  );

  const closedApplications = applications.filter(app => 
    ["rejected", "withdrawn"].includes(app.status)
  );

  const ApplicationCard = ({ app }: { app: Application }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <img
              src={app.company.logo}
              alt={`${app.company.name} logo`}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {app.jobTitle}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-700">{app.company.name}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{app.company.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {app.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <PoundSterling className="w-4 h-4" />
                      £{app.salary.min.toLocaleString()} - £{app.salary.max.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mb-3">
                <Badge className={getStatusColor(app.status)}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(app.status)}
                    {getStatusText(app.status)}
                  </div>
                </Badge>
                {app.hasUnreadMessage && (
                  <Badge className="bg-red-100 text-red-800">
                    New Message
                  </Badge>
                )}
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                <div>Applied: {new Date(app.appliedDate).toLocaleDateString()}</div>
                <div>Last update: {new Date(app.lastUpdate).toLocaleDateString()}</div>
                {app.nextStep && (
                  <div className="font-medium text-gray-900">Next: {app.nextStep}</div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 ml-4">
            {app.status === "feedback_ready" && app.hasFeedback && (
              <Button 
                size="sm"
                onClick={() => window.location.href = `/application-feedback/${app.id}`}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Feedback
              </Button>
            )}
            {app.status === "employer_interested" && (
              <Button 
                size="sm"
                onClick={() => window.location.href = `/application-response/${app.id}`}
                className="bg-green-600 hover:bg-green-700"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Respond
              </Button>
            )}
            {app.status === "interview_scheduled" && (
              <Button 
                size="sm"
                variant="outline"
                className="text-purple-600 border-purple-600 hover:bg-purple-50"
              >
                <Calendar className="w-4 h-4 mr-2" />
                View Details
              </Button>
            )}
            {app.status === "under_review" && app.id === "app-002" && (
              <Button 
                size="sm"
                onClick={() => window.location.href = '/company-challenge/challenge-001'}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Complete Challenge
              </Button>
            )}
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => window.location.href = `/company-profile/2`}
            >
              <Building2 className="w-4 h-4 mr-2" />
              Company
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => {
                  window.location.href = '/home';
                }}
                className="flex items-center gap-2"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                Back to Home
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
                <p className="text-gray-600 mt-1">Track your job applications and their progress</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {activeApplications.length}
              </div>
              <div className="text-sm text-gray-600">Active Applications</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="active">
              Active Applications ({activeApplications.length})
            </TabsTrigger>
            <TabsTrigger value="closed">
              Closed Applications ({closedApplications.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <div className="space-y-4">
              {activeApplications.length > 0 ? (
                activeApplications.map((app) => (
                  <ApplicationCard key={app.id} app={app} />
                ))
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No active applications</h3>
                    <p className="text-gray-600 mb-4">
                      Start applying to jobs that match your verified skills
                    </p>
                    <Button onClick={() => window.location.href = '/job-recommendations'}>
                      Browse Jobs
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="closed">
            <div className="space-y-4">
              {closedApplications.length > 0 ? (
                closedApplications.map((app) => (
                  <ApplicationCard key={app.id} app={app} />
                ))
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <CheckCircle2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No closed applications</h3>
                    <p className="text-gray-600">
                      Completed applications will appear here
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}