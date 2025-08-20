import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  ArrowLeft, Building2, MapPin, Users, Mail, Phone, Globe,
  CheckCircle, XCircle, Calendar, User, Target
} from "lucide-react";
import { useLocation, useParams } from "wouter";

interface EmployerApplication {
  id: string;
  companyName: string;
  companySize: string;
  industries: string[];
  location: string;
  website: string;
  contactEmail: string;
  contactName: string;
  contactRole: string;
  contactPhone?: string;
  companyDescription: string;
  whyPollen: string;
  hiringVolume: string;
  howDidYouHear: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewNotes?: string;
  reviewedBy?: string;
  reviewDate?: string;
}

export default function AdminEmployerReview() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const [, setLocation] = useLocation();
  const [reviewNotes, setReviewNotes] = useState("");
  const { toast } = useToast();

  // Fetch specific application details
  const { data: application, isLoading } = useQuery<EmployerApplication>({
    queryKey: [`/api/admin/employer-applications/${applicationId}`],
    initialData: {
      id: applicationId || "1",
      companyName: "TechFlow Solutions",
      companySize: "50-200",
      industries: ["Technology & Software"],
      location: "London, UK",
      website: "https://techflow.com",
      contactEmail: "hr@techflow.com",
      contactName: "Sarah Johnson",
      contactRole: "HR Manager",
      contactPhone: "+44 20 7123 4567",
      companyDescription: "TechFlow Solutions is a fast-growing technology company specialising in enterprise software solutions. We help businesses streamline their operations through innovative SaaS platforms and custom development services.",
      whyPollen: "We believe in skills-based hiring and want to tap into entry-level talent with strong potential. Traditional recruiting hasn't been giving us the diverse, capable candidates we need for our growing team.",
      hiringVolume: "15-50",
      howDidYouHear: "linkedin",
      submittedDate: "2024-01-15",
      status: "pending"
    }
  });

  // Review application mutation
  const reviewMutation = useMutation({
    mutationFn: async ({ status, notes }: { status: 'approved' | 'rejected', notes: string }) => {
      return await apiRequest("PUT", `/api/admin/employer-applications/${applicationId}/review`, {
        status, 
        reviewNotes: notes,
        reviewedBy: "Holly (Admin)",
        reviewDate: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/employer-applications"] });
      toast({
        title: "Application reviewed",
        description: "Employer application has been updated successfully",
      });
      setLocation("/admin/employers");
    },
  });

  const handleApprove = () => {
    if (!reviewNotes.trim()) {
      toast({
        title: "Review notes required",
        description: "Please provide review notes before approving the application",
        variant: "destructive"
      });
      return;
    }
    reviewMutation.mutate({ status: 'approved', notes: reviewNotes });
  };

  const handleReject = () => {
    if (!reviewNotes.trim()) {
      toast({
        title: "Review notes required", 
        description: "Please provide review notes before rejecting the application",
        variant: "destructive"
      });
      return;
    }
    reviewMutation.mutate({ status: 'rejected', notes: reviewNotes });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending Review</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading || !application) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setLocation("/admin/employers")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Employers
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Review Employer Application</h1>
                <p className="text-sm text-gray-600">
                  Submitted on {new Date(application.submittedDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {getStatusBadge(application.status)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Application Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Company Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{application.companyName}</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {application.industries.map((industry, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {industry}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {application.location}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    {application.companySize} employees
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {application.contactEmail}
                  </div>
                  {application.contactPhone && (
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      {application.contactPhone}
                    </div>
                  )}
                  <div className="flex items-center text-gray-600">
                    <Globe className="h-4 w-4 mr-2" />
                    <a href={application.website} target="_blank" rel="noopener noreferrer" 
                       className="text-blue-600 hover:underline">
                      {application.website}
                    </a>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <User className="h-4 w-4 mr-2" />
                    {application.contactName} ({application.contactRole})
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Company Description</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">{application.companyDescription}</p>
                </div>
              </CardContent>
            </Card>

            {/* Application Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Application Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Why Pollen?</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">{application.whyPollen}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Expected Hiring Volume</h4>
                    <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                      {application.hiringVolume} hires per year
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">How They Found Us</h4>
                    <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
                      {application.howDidYouHear.charAt(0).toUpperCase() + application.howDidYouHear.slice(1).replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>


            {/* Previous Review (if exists) */}
            {application.reviewNotes && (
              <Card>
                <CardHeader>
                  <CardTitle>Previous Review</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        Reviewed by: {application.reviewedBy}
                      </span>
                      <span className="text-sm text-gray-600">
                        {application.reviewDate && new Date(application.reviewDate).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{application.reviewNotes}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Review Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Review Decision</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Notes *
                  </label>
                  <Textarea
                    placeholder="Provide detailed feedback about this application..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    rows={6}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This message will be sent to the employer along with your decision.
                  </p>
                </div>

                {application.status === 'pending' && (
                  <div className="space-y-3">
                    <Button
                      onClick={handleApprove}
                      disabled={reviewMutation.isPending}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {reviewMutation.isPending ? "Processing..." : "Approve Application"}
                    </Button>
                    
                    <Button
                      onClick={handleReject}
                      disabled={reviewMutation.isPending}
                      variant="destructive"
                      className="w-full"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      {reviewMutation.isPending ? "Processing..." : "Reject Application"}
                    </Button>
                  </div>
                )}

                {application.status !== 'pending' && (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-600 mb-2">
                      This application has been {application.status}.
                    </p>
                    {getStatusBadge(application.status)}
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}