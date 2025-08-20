import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Building2, Eye, CheckCircle, XCircle, Search, Filter,
  Calendar, MapPin, Mail, Phone, Users, ArrowLeft
} from "lucide-react";
import { useLocation } from "wouter";

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

interface EmployerProfileSetup {
  id: string;
  companyName: string;
  industry: string;
  contactEmail: string;
  location: string;
  employeeCount: string;
  submittedDate: string;
  status: 'profile_complete';
}

export default function AdminEmployers() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const { toast } = useToast();

  // Fetch employer applications
  const { data: applications = [], isLoading } = useQuery<EmployerApplication[]>({
    queryKey: ["/api/admin/employer-applications"],
    initialData: [
      {
        id: "1",
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
      },
      {
        id: "2",
        companyName: "Creative Studios",
        companySize: "10-50",
        industries: ["Marketing & Advertising", "Media & Creative"],
        location: "Manchester, UK",
        website: "https://creativestudios.co.uk",
        contactEmail: "talent@creativestudios.co.uk",
        contactName: "James Thompson",
        contactRole: "Creative Director",
        contactPhone: "+44 161 234 5678",
        companyDescription: "Creative Studios is a boutique creative agency specialising in brand development, digital marketing, and content creation. We work with ambitious brands to create meaningful connections through compelling storytelling.",
        whyPollen: "Traditional portfolios don't show creative thinking ability. We want to see how candidates actually approach problems and develop solutions through practical challenges.",
        hiringVolume: "5-15",
        howDidYouHear: "word-of-mouth",
        submittedDate: "2024-01-14",
        status: "pending"
      },
      {
        id: "3",
        companyName: "DataTech Solutions",
        companySize: "200-1000",
        industries: ["Technology & Software", "Finance & Banking"],
        location: "Birmingham, UK",
        website: "https://datatech.io",
        contactEmail: "jobs@datatech.io",
        contactName: "Michael Chen",
        contactRole: "Head of People",
        contactPhone: "+44 121 345 6789",
        companyDescription: "DataTech Solutions provides advanced data analytics and business intelligence solutions to enterprise clients. We help organisations make data-driven decisions through cutting-edge analytics platforms.",
        whyPollen: "We need analytical minds who can think differently about data problems. Academic credentials don't always translate to practical problem-solving skills that we value.",
        hiringVolume: "15-50",
        howDidYouHear: "search-engine",
        submittedDate: "2024-01-13",
        status: "approved",
        reviewedBy: "Holly (Admin)",
        reviewDate: "2024-01-14",
        reviewNotes: "Excellent application with clear company information. Strong alignment with skills-first approach and good hiring volume potential. Approved for platform access."
      }
    ]
  });

  // Fetch employer profiles needing approval
  const { data: profileSetups = [] } = useQuery<EmployerProfileSetup[]>({
    queryKey: ["/api/admin/employer-profile-setups"],
    initialData: [
      {
        id: "4",
        companyName: "StartupCo",
        industry: "Technology",
        contactEmail: "admin@startupco.com",
        location: "London",
        employeeCount: "10-25",
        submittedDate: "2024-01-12",
        status: "profile_complete"
      }
    ]
  });

  // Review application mutation
  const reviewMutation = useMutation({
    mutationFn: async ({ applicationId, status, notes }: { 
      applicationId: string, 
      status: 'approved' | 'rejected', 
      notes?: string 
    }) => {
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
    },
  });

  // Filter applications
  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.industries.some(industry => industry.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = selectedStatus === "all" || app.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleReview = (applicationId: string, status: 'approved' | 'rejected', notes?: string) => {
    reviewMutation.mutate({ applicationId, status, notes });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending Review</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'profile_complete':
        return <Badge className="bg-blue-100 text-blue-800">Profile Complete</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setLocation("/admin")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Employers Management</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="applications" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="applications">
              New Applications ({applications.filter(a => a.status === 'pending').length})
            </TabsTrigger>
            <TabsTrigger value="profiles">
              Profile Setups ({profileSetups.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="mt-6">
            {/* Search and Filter */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search companies or industries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Applications List */}
            <div className="space-y-4">
              {filteredApplications.map((application) => (
                <Card key={application.id} className="bg-white">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {application.companyName}
                          </h3>
                          {getStatusBadge(application.status)}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Building2 className="h-4 w-4 mr-2" />
                            {application.industries.join(", ")}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            {application.location}
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            {application.companySize} employees
                          </div>
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2" />
                            {application.contactEmail}
                          </div>
                          {application.contactPhone && (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-2" />
                              {application.contactPhone}
                            </div>
                          )}
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(application.submittedDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2 ml-4">
                        {application.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                              onClick={() => setLocation(`/admin/employer-review/${application.id}`)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Review Application
                            </Button>
                          </>
                        )}
                        {application.status === 'approved' && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => setLocation(`/admin/employer-review/${application.id}`)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            View Approved
                          </Button>
                        )}
                        {application.status === 'rejected' && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setLocation(`/admin/employer-review/${application.id}`)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            View Rejected
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="profiles" className="mt-6">
            <div className="space-y-4">
              {profileSetups.map((profile) => (
                <Card key={profile.id} className="bg-white">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {profile.companyName}
                          </h3>
                          {getStatusBadge(profile.status)}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Building2 className="h-4 w-4 mr-2" />
                            {profile.industry}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2" />
                            {profile.location}
                          </div>
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2" />
                            {profile.contactEmail}
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`/company-profile/${profile.id}`, '_blank')}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Review Profile
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleReview(profile.id, 'approved')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}