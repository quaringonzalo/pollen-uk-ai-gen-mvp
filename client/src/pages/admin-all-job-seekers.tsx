import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { 
  ArrowLeft, Search, Filter, User, MapPin, Star, Calendar, 
  Eye, MessageCircle, CheckCircle, Trophy, Briefcase, FileText,
  Users, Mail, Clock, Phone
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLocation } from "wouter";

interface JobSeeker {
  id: string;
  name: string;
  email: string;
  location: string;
  registrationDate: string;
  status: 'active' | 'inactive';
  profileComplete: boolean;
  assessmentCompleted: boolean;
  overallSkillsScore?: number;
  totalApplications: number;
  lastActivity: string;
  profilePicture?: string;
  keyStrengths: string[];
  experienceLevel: string;
  visaStatus?: string;
}

export default function AdminAllJobSeekers() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [applicationFilter, setApplicationFilter] = useState<string>("all");
  const [profileFilter, setProfileFilter] = useState<string>("all");

  // Fetch all job seekers
  const { data: jobSeekers = [], isLoading } = useQuery<JobSeeker[]>({
    queryKey: ["/api/admin/all-job-seekers"],
    initialData: [
      {
        id: "20",
        name: "Sarah Chen",
        email: "sarah.chen@email.com",
        location: "London, UK",
        registrationDate: "2025-01-10",
        status: "active",
        profileComplete: true,
        assessmentCompleted: false,
        totalApplications: 0,
        lastActivity: "2025-01-15",
        keyStrengths: [],
        experienceLevel: "Entry Level",
        visaStatus: "UK Citizen"
      },
      {
        id: "21",
        name: "James Mitchell",
        email: "james.mitchell@email.com",
        location: "London, UK",
        registrationDate: "2024-11-22",
        status: "active",
        profileComplete: true,
        assessmentCompleted: true,
        overallSkillsScore: 85,
        totalApplications: 4,
        lastActivity: "2025-01-16",
        keyStrengths: ["Strategic Thinking", "Communication", "Problem Solving"],
        experienceLevel: "Entry Level",
        visaStatus: "UK Citizen"
      },
      {
        id: "22",
        name: "Emma Davis",
        email: "emma.davis@email.com",
        location: "Bristol, UK",
        registrationDate: "2025-01-05",
        status: "active",
        profileComplete: true,
        assessmentCompleted: true,
        overallSkillsScore: 83,
        totalApplications: 2,
        lastActivity: "2025-01-14",
        keyStrengths: ["Creative Campaign Development", "Social Media Strategy"],
        experienceLevel: "Entry Level",
        visaStatus: "UK Citizen"
      },
      {
        id: "23",
        name: "Lucy Williams",
        email: "lucy.williams@email.com",
        location: "Birmingham, UK",
        registrationDate: "2025-01-12",
        status: "active",
        profileComplete: true,
        assessmentCompleted: true,
        overallSkillsScore: 79,
        totalApplications: 1,
        lastActivity: "2025-01-13",
        keyStrengths: ["Communication", "Content Creation", "Brand Awareness"],
        experienceLevel: "Entry Level",
        visaStatus: "UK Citizen"
      },
      {
        id: "24",
        name: "Alex Thompson",
        email: "alex.thompson@email.com",
        location: "Manchester, UK",
        registrationDate: "2025-01-08",
        status: "active",
        profileComplete: true,
        assessmentCompleted: false,
        totalApplications: 1,
        lastActivity: "2025-01-12",
        keyStrengths: ["Analytical Thinking", "Project Management"],
        experienceLevel: "Entry Level",
        visaStatus: "UK Citizen"
      },
      {
        id: "25",
        name: "Maya Patel",
        email: "maya.patel@email.com",
        location: "Leeds, UK",
        registrationDate: "2025-01-14",
        status: "active",
        profileComplete: false,
        assessmentCompleted: false,
        totalApplications: 0,
        lastActivity: "2025-01-14",
        keyStrengths: [],
        experienceLevel: "Entry Level",
        visaStatus: "Work Visa Required"
      },
      {
        id: "26",
        name: "Tom Harrison",
        email: "tom.harrison@email.com",
        location: "Liverpool, UK",
        registrationDate: "2024-12-20",
        status: "inactive",
        profileComplete: true,
        assessmentCompleted: true,
        overallSkillsScore: 76,
        totalApplications: 2,
        lastActivity: "2024-12-28",
        keyStrengths: ["Technical Skills", "Problem Solving"],
        experienceLevel: "Entry Level",
        visaStatus: "UK Citizen"
      },
      {
        id: "27",
        name: "Rachel Green",
        email: "rachel.green@email.com",
        location: "Cardiff, UK",
        registrationDate: "2025-01-16",
        status: "active",
        profileComplete: true,
        assessmentCompleted: false,
        totalApplications: 0,
        lastActivity: "2025-01-16",
        keyStrengths: ["Customer Service", "Team Leadership"],
        experienceLevel: "Entry Level",
        visaStatus: "UK Citizen"
      },
      {
        id: "28",
        name: "David Wilson",
        email: "david.wilson@email.com",
        location: "Newcastle, UK",
        registrationDate: "2025-01-11",
        status: "active",
        profileComplete: false,
        assessmentCompleted: false,
        totalApplications: 0,
        lastActivity: "2025-01-11",
        keyStrengths: [],
        experienceLevel: "Entry Level",
        visaStatus: "UK Citizen"
      }
    ]
  });

  // Filter job seekers
  const filteredJobSeekers = jobSeekers.filter(jobSeeker => {
    const matchesSearch = jobSeeker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         jobSeeker.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         jobSeeker.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || jobSeeker.status === statusFilter;
    const matchesApplication = applicationFilter === "all" || 
                              (applicationFilter === "has_applied" && jobSeeker.totalApplications > 0) ||
                              (applicationFilter === "not_applied" && jobSeeker.totalApplications === 0);
    const matchesProfile = profileFilter === "all" ||
                          (profileFilter === "complete" && jobSeeker.profileComplete) ||
                          (profileFilter === "incomplete" && !jobSeeker.profileComplete);

    return matchesSearch && matchesStatus && matchesApplication && matchesProfile;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Inactive</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>;
    }
  };

  const getProfileCompleteBadge = (isComplete: boolean) => {
    return isComplete 
      ? <Badge className="bg-green-100 text-green-800 border-green-200">Complete</Badge>
      : <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Incomplete</Badge>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job seekers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/admin")}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">All Job Seekers</h1>
                <p className="text-sm text-gray-600">{filteredJobSeekers.length} job seekers found</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Search & Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by name, email, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Account Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={applicationFilter} onValueChange={setApplicationFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Application Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="has_applied">Has Applied</SelectItem>
                    <SelectItem value="not_applied">Not Applied</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={profileFilter} onValueChange={setProfileFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Profile Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Profiles</SelectItem>
                    <SelectItem value="complete">Profile Complete</SelectItem>
                    <SelectItem value="incomplete">Profile Incomplete</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Seekers Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Job Seekers Database</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-medium">Job Seeker</TableHead>
                    <TableHead className="font-medium">Status</TableHead>
                    <TableHead className="font-medium">Profile</TableHead>
                    <TableHead className="font-medium">Assessment</TableHead>
                    <TableHead className="font-medium">Applications</TableHead>
                    <TableHead className="font-medium">Last Activity</TableHead>
                    <TableHead className="font-medium">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobSeekers.map((jobSeeker) => (
                    <TableRow key={jobSeeker.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {jobSeeker.profilePicture ? (
                              <img 
                                src={jobSeeker.profilePicture} 
                                alt={jobSeeker.name}
                                className="h-8 w-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-gray-500" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-sm">{jobSeeker.name}</div>
                            <div className="text-xs text-gray-500 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {jobSeeker.email}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {jobSeeker.location}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        {getStatusBadge(jobSeeker.status)}
                      </TableCell>
                      
                      <TableCell>
                        {getProfileCompleteBadge(jobSeeker.profileComplete)}
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center">
                          {jobSeeker.assessmentCompleted ? (
                            <>
                              <Trophy className="h-4 w-4 text-blue-500 mr-1" />
                              <span className="text-sm font-medium text-blue-600">
                                {jobSeeker.overallSkillsScore}%
                              </span>
                            </>
                          ) : (
                            <>
                              <Clock className="h-4 w-4 text-amber-500 mr-1" />
                              <span className="text-sm text-gray-500">Pending</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm">{jobSeeker.totalApplications}</span>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {new Date(jobSeeker.lastActivity).toLocaleDateString('en-GB')}
                        </span>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setLocation(`/admin/candidate-profile/${jobSeeker.id}`)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setLocation(`/admin/messages?candidate=${jobSeeker.id}`)}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Message
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {filteredJobSeekers.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No job seekers found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}