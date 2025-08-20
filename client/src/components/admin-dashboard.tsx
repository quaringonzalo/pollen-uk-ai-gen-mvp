import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle, XCircle, Clock, Building, Users, TrendingUp, Target, Home } from "lucide-react";
import { useLocation } from "wouter";

interface EmployerApplication {
  id: number;
  companyName: string;
  companySize: string;
  industry: string;
  website: string;
  contactEmail: string;
  contactName: string;
  contactRole: string;
  companyDescription: string;
  whyPollen: string;
  hiringVolume: string;
  diversity: boolean;
  remote: boolean;
  glassdoorRating?: string;
  linkedinUrl?: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reviewNotes?: string;
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedApplication, setSelectedApplication] = useState<EmployerApplication | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [, setLocation] = useLocation();

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ["/api/employer-applications"],
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/analytics/platform-stats"],
  });

  const reviewMutation = useMutation({
    mutationFn: async ({ applicationId, status, notes }: { applicationId: number, status: string, notes: string }) => {
      return await apiRequest(`/api/employer-applications/${applicationId}/review`, {
        method: "PUT",
        body: JSON.stringify({
          status,
          reviewNotes: notes,
          reviewedBy: 1, // In real app, get from auth context
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employer-applications"] });
      setSelectedApplication(null);
      setReviewNotes("");
      toast({
        title: "Review Submitted",
        description: "Employer application has been reviewed successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Review Failed",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleReview = (status: "approved" | "rejected") => {
    if (!selectedApplication) return;
    
    reviewMutation.mutate({
      applicationId: selectedApplication.id,
      status,
      notes: reviewNotes,
    });
  };

  const pendingApplications = applications.filter((app: EmployerApplication) => app.status === "pending");
  const approvedApplications = applications.filter((app: EmployerApplication) => app.status === "approved");
  const rejectedApplications = applications.filter((app: EmployerApplication) => app.status === "rejected");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Manage employer applications and platform operations</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="px-3 py-1">Admin</Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocation("/home")}
                className="flex items-center space-x-2"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Platform Overview</h2>
            <p className="text-muted-foreground">Monitor applications and platform statistics</p>
          </div>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingApplications.length}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Employers</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedApplications.length}</div>
            <p className="text-xs text-muted-foreground">
              Active on platform
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Job Seekers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalJobSeekers || 0}</div>
            <p className="text-xs text-muted-foreground">
              Platform participants
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Challenges Completed</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalChallengesCompleted || 0}</div>
            <p className="text-xs text-muted-foreground">
              Skills verified
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Applications Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications List */}
        <Card>
          <CardHeader>
            <CardTitle>Employer Applications</CardTitle>
            <p className="text-sm text-muted-foreground">
              Review and approve employer applications to join the platform
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingApplications.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                No pending applications to review
              </p>
            ) : (
              pendingApplications.map((application: EmployerApplication) => (
                <div
                  key={application.id}
                  className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colours"
                  onClick={() => setSelectedApplication(application)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{application.companyName}</h4>
                      <p className="text-sm text-muted-foreground">{application.industry}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{application.companySize}</Badge>
                        <Badge variant="outline">{application.hiringVolume}</Badge>
                        {application.remote && <Badge variant="secondary">Remote</Badge>}
                        {application.diversity && <Badge variant="secondary">Diversity Focus</Badge>}
                      </div>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {application.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Submitted {new Date(application.submittedAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Application Review */}
        <Card>
          <CardHeader>
            <CardTitle>Application Review</CardTitle>
            {selectedApplication && (
              <p className="text-sm text-muted-foreground">
                Reviewing {selectedApplication.companyName}
              </p>
            )}
          </CardHeader>
          <CardContent>
            {!selectedApplication ? (
              <p className="text-center py-8 text-muted-foreground">
                Select an application to review
              </p>
            ) : (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Company Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Company:</strong> {selectedApplication.companyName}</p>
                    <p><strong>Industry:</strong> {selectedApplication.industry}</p>
                    <p><strong>Size:</strong> {selectedApplication.companySize}</p>
                    <p><strong>Website:</strong> 
                      <a href={selectedApplication.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                        {selectedApplication.website}
                      </a>
                    </p>
                    <p><strong>Contact:</strong> {selectedApplication.contactName} ({selectedApplication.contactRole})</p>
                    <p><strong>Email:</strong> {selectedApplication.contactEmail}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Company Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedApplication.companyDescription}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Why Pollen?</h4>
                  <p className="text-sm text-muted-foreground">{selectedApplication.whyPollen}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Hiring Details</h4>
                  <div className="flex gap-2">
                    <Badge variant="outline">{selectedApplication.hiringVolume}</Badge>
                    {selectedApplication.remote && <Badge variant="secondary">Remote Work</Badge>}
                    {selectedApplication.diversity && <Badge variant="secondary">Diversity Commitment</Badge>}
                  </div>
                </div>

                {selectedApplication.glassdoorRating && (
                  <div>
                    <h4 className="font-medium mb-2">Glassdoor Rating</h4>
                    <p className="text-sm">{selectedApplication.glassdoorRating}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-medium mb-2">Review Notes</h4>
                  <Textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Add review notes (optional)..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => handleReview("approved")}
                    disabled={reviewMutation.isPending}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleReview("rejected")}
                    disabled={reviewMutation.isPending}
                    variant="destructive"
                    className="flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Employer Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-3 text-green-600">Recently Approved</h4>
              {approvedApplications.slice(0, 3).map((app: EmployerApplication) => (
                <div key={app.id} className="border-l-4 border-green-500 pl-3 mb-3">
                  <p className="font-medium">{app.companyName}</p>
                  <p className="text-sm text-muted-foreground">{app.industry}</p>
                </div>
              ))}
            </div>
            <div>
              <h4 className="font-medium mb-3 text-red-600">Recently Rejected</h4>
              {rejectedApplications.slice(0, 3).map((app: EmployerApplication) => (
                <div key={app.id} className="border-l-4 border-red-500 pl-3 mb-3">
                  <p className="font-medium">{app.companyName}</p>
                  <p className="text-sm text-muted-foreground">{app.industry}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}