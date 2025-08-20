import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "wouter";
import { 
  Building2, Users, Briefcase, Calendar, Star, MessageSquare, 
  Plus, Search, Filter, BarChart3, TrendingUp, Globe, Award,
  Clock, MapPin, Eye, CheckCircle, XCircle, AlertCircle, Home, LogOut,
  MessageCircle, Edit3, Target, Heart, Shield, ThumbsUp, ArrowLeft, FileText, Play, Camera, Coffee
} from "lucide-react";
import ATSDashboard from "@/components/ats-dashboard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Draft Jobs Section Component
function DraftJobsSection() {
  const { toast } = useToast();
  
  // Mock draft jobs data for demo
  const draftJobs = [
    {
      id: 1,
      title: "Marketing Assistant",
      lastSaved: "2024-01-20",
      completionPercentage: 75,
      status: "draft"
    },
    {
      id: 2,
      title: "Data Analyst (Junior)",
      lastSaved: "2024-01-18",
      completionPercentage: 45,
      status: "draft"
    }
  ];

  const publishMutation = useMutation({
    mutationFn: async (jobId: number) => {
      const response = await apiRequest("PATCH", `/api/jobs/${jobId}/publish`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Job Published",
        description: "Your job posting is now live and accepting applications.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to publish job posting. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handlePublish = (jobId: number) => {
    publishMutation.mutate(jobId);
  };

  if (draftJobs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Draft Job Postings</h3>
      <div className="grid gap-4">
        {draftJobs.map((job) => (
          <Card key={job.id} className="border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-medium text-lg">{job.title}</h3>
                    <Badge variant="outline" className="bg-orange-100 border-orange-300 text-orange-800">
                      <FileText className="w-3 h-3 mr-1" />
                      Draft
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Completion Progress</span>
                      <span className="font-medium">{job.completionPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${job.completionPercentage}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Last saved {job.lastSaved}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.location.href = `/comprehensive-job-posting?draft=${job.id}`}
                  >
                    <Edit3 className="w-4 h-4 mr-1" />
                    Complete
                  </Button>
                  {job.completionPercentage >= 80 && (
                    <Button 
                      size="sm"
                      onClick={() => handlePublish(job.id)}
                      disabled={publishMutation.isPending}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      {publishMutation.isPending ? "Publishing..." : "Publish"}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Profile Edit Section Component
function ProfileEditSection({ profile }: { profile: any }) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [showJobSeekerView, setShowJobSeekerView] = useState(false);
  const [editData, setEditData] = useState({});
  const [showTestimonialDialog, setShowTestimonialDialog] = useState(false);
  const [showRecognitionDialog, setShowRecognitionDialog] = useState(false);
  const [showProgrammeDialog, setShowProgrammeDialog] = useState(false);
  const [testimonialForm, setTestimonialForm] = useState({
    employeeName: '',
    employeeEmail: '',
    position: '',
    department: '',
    message: ''
  });
  const [recognitionForm, setRecognitionForm] = useState({
    awardName: '',
    organization: '',
    year: '',
    description: ''
  });
  const [programmeForm, setProgrammeForm] = useState({
    programmeName: '',
    description: '',
    benefits: ''
  });

  const handleEdit = () => {
    setEditData({ ...profile });
    setIsEditing(true);
  };

  const handleSave = () => {
    // Save logic would go here
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your company profile has been successfully updated.",
    });
  };

  const handleCancel = () => {
    setEditData({});
    setIsEditing(false);
  };

  const handleTestimonialSubmit = () => {
    // Here you would typically send the testimonial request to your backend
    toast({
      title: "Testimonial Request Sent",
      description: `A testimonial request has been sent to ${testimonialForm.employeeName} at ${testimonialForm.employeeEmail}.`,
    });
    setShowTestimonialDialog(false);
    setTestimonialForm({
      employeeName: '',
      employeeEmail: '',
      position: '',
      department: '',
      message: ''
    });
  };

  const handleRecognitionSubmit = () => {
    // Here you would typically save the recognition to your backend
    toast({
      title: "Recognition Added",
      description: `${recognitionForm.awardName} has been added to your company recognition.`,
    });
    setShowRecognitionDialog(false);
    setRecognitionForm({
      awardName: '',
      organization: '',
      year: '',
      description: ''
    });
  };

  const handleProgrammeSubmit = () => {
    // Here you would typically save the programme to your backend
    toast({
      title: "Programme Added",
      description: `${programmeForm.programmeName} has been added to your support programmes.`,
    });
    setShowProgrammeDialog(false);
    setProgrammeForm({
      programmeName: '',
      description: '',
      benefits: ''
    });
  };

  const currentData = isEditing ? editData : profile;

  // Job Seeker View Component
  const JobSeekerView = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Company Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="relative h-48 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-r from-blue-600/80 to-purple-600/80" />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        
        <div className="relative -mt-16 pb-6">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-end gap-6">
              <div className="w-24 h-24 bg-white rounded-lg p-2 shadow-lg">
                <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-gray-400" />
                </div>
              </div>
              
              <div className="flex-1 pb-2">
                <h1 className="text-3xl font-bold mb-2">{profile?.companyName || "TechFlow Solutions"}</h1>
                <div className="flex items-center gap-4 text-white/90">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {profile?.location || "London, UK"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {profile?.industry || "Technology"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {profile?.companySize || "50-200 employees"}
                  </span>
                </div>
              </div>
              
              <div className="text-right pb-2">
                <div className="flex items-center gap-1 mb-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-xl font-bold">4.7</span>
                </div>
                <div className="text-white/80 text-sm">Based on 23 reviews</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle>About {profile?.companyName || "TechFlow Solutions"}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {profile?.about || profile?.companyDescription || "TechFlow Solutions is a forward-thinking technology consultancy that specialises in digital transformation and innovative software solutions."}
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-500" />
                      Our Mission
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {profile?.mission || "To democratize technology access for businesses of all sizes."}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-500" />
                      Our Values
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(profile?.values || ["Innovation", "Collaboration", "Growth", "Integrity"]).map((value, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Opportunities */}
            <Card>
              <CardHeader>
                <CardTitle>Current Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-lg">Junior Software Developer</h4>
                      <Badge className="bg-pink-100 text-pink-800">Company-Level Challenge</Badge>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">Full-time • London, UK • £28,000 - £35,000</p>
                    <p className="text-gray-700 text-sm">Join our development team to build innovative solutions. Complete our technical coding challenge to demonstrate your problem-solving abilities.</p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-lg">Client Success Coordinator</h4>
                      <Badge className="bg-green-100 text-green-800">Foundation Challenge</Badge>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">Full-time • Remote/London • £25,000 - £30,000</p>
                    <p className="text-gray-700 text-sm">Be the bridge between our technical team and clients. Complete our foundation challenge focusing on communication skills.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Candidate Experience */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ThumbsUp className="w-5 h-5 text-green-500" />
                  Candidate Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">4.7</div>
                  <div className="flex justify-center gap-1 my-2">
                    {[1,2,3,4].map((star) => (
                      <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                    <Star className="w-5 h-5 text-yellow-400 fill-current opacity-70" />
                  </div>
                  <div className="text-sm text-gray-600">Based on 23 reviews</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Feedback Quality</span>
                    <span className="font-medium">4.8/5</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Communication Speed</span>
                    <span className="font-medium">4.9/5</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Interview Experience</span>
                    <span className="font-medium">4.7/5</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Process Transparency</span>
                    <span className="font-medium">4.6/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-500" />
                  Benefits & Perks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(profile?.benefits || [
                    "Private Healthcare",
                    "Pension Scheme", 
                    "Flexible Working Hours",
                    "Professional Development",
                    "25 Days Holiday"
                  ]).slice(0, 5).map((benefit: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm font-medium text-green-800">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );

  if (showJobSeekerView) {
    return (
      <div>
        {/* Header for job seeker view */}
        <div className="bg-white border-b px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => setShowJobSeekerView(false)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Profile Editor
              </Button>
              <div>
                <h1 className="font-semibold">Job Seeker View</h1>
                <p className="text-sm text-gray-600">This is how candidates see your company</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">Preview Mode</Badge>
          </div>
        </div>
        <JobSeekerView />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Company Profile</h2>
          <p className="text-gray-600">Manage your company information for better candidate matching</p>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => setShowJobSeekerView(true)}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Job Seeker View
              </Button>
              <Button onClick={handleEdit} className="flex items-center gap-2">
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </Button>
            </>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSave} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Status */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">Profile Complete & Live</span>
            <Badge className="bg-green-100 text-green-800">Verified</Badge>
          </div>
          <p className="text-gray-600 mt-2">
            Your company profile is live and visible to job seekers. Pollen team review completed.
          </p>
        </CardContent>
      </Card>

      {/* Job Seeker View - Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-pink-600" />
            How Job Seekers See You
          </CardTitle>
          <p className="text-sm text-gray-600">These badges appear on your company profile to show candidates what makes you special</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">Your Current Badges</Label>
            <div className="flex gap-2 flex-wrap">
              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300 px-3 py-1.5">
                <Star className="w-3 h-3 mr-1" />
                Star Employer
              </Badge>
              <Badge className="bg-green-100 text-green-800 border-green-300 px-3 py-1.5">
                <Clock className="w-3 h-3 mr-1" />
                Quick Responder
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 border-blue-300 px-3 py-1.5">
                <Target className="w-3 h-3 mr-1" />
                Active Hirer
              </Badge>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="font-semibold text-sm">Star Employer</span>
              </div>
              <p className="text-xs text-gray-600">Consistently high candidate satisfaction ratings (4.8/5 average)</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Clock className="w-4 h-4 text-green-500" />
                <span className="font-semibold text-sm">Quick Responder</span>
              </div>
              <p className="text-xs text-gray-600">Responds to applications within 48 hours (avg. 18 hours)</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Target className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-sm">Active Hirer</span>
              </div>
              <p className="text-xs text-gray-600">Posted 20+ entry-level positions this year (23 jobs posted)</p>
            </div>
          </div>

          <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mt-4">
            <div className="flex items-start gap-3">
              <Award className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-pink-900 text-sm">Why Badges Matter</h4>
                <p className="text-sm text-pink-800 mt-1">
                  Job seekers are 3x more likely to apply to companies with verified badges. 
                  These achievements are based on your actual platform performance and candidate feedback.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Company Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Company Name</Label>
              {isEditing ? (
                <Input
                  value={editData.companyName || ""}
                  onChange={(e) => setEditData(prev => ({ ...prev, companyName: e.target.value }))}
                />
              ) : (
                <p className="font-medium">{currentData.companyName}</p>
              )}
            </div>
            <div>
              <Label>Industry</Label>
              {isEditing ? (
                <Input
                  value={editData.industry || ""}
                  onChange={(e) => setEditData(prev => ({ ...prev, industry: e.target.value }))}
                />
              ) : (
                <p className="font-medium">{currentData.industry}</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Company Size</Label>
              {isEditing ? (
                <Select value={editData.companySize || ""} onValueChange={(value) => 
                  setEditData(prev => ({ ...prev, companySize: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 employees</SelectItem>
                    <SelectItem value="11-50">11-50 employees</SelectItem>
                    <SelectItem value="51-200">51-200 employees</SelectItem>
                    <SelectItem value="201-500">201-500 employees</SelectItem>
                    <SelectItem value="500+">500+ employees</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge variant="secondary">{currentData.companySize}</Badge>
              )}
            </div>
            <div>
              <Label>Location</Label>
              {isEditing ? (
                <Input
                  value={editData.location || ""}
                  onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
                />
              ) : (
                <p className="font-medium flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {currentData.location}
                </p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Website</Label>
              {isEditing ? (
                <Input
                  value={editData.website || ""}
                  onChange={(e) => setEditData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://yourcompany.com"
                />
              ) : (
                <p className="font-medium flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  <a href={currentData.website} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-600 hover:underline">
                    {currentData.website}
                  </a>
                </p>
              )}
            </div>
            <div>
              <Label>Founded Year</Label>
              {isEditing ? (
                <Input
                  value={editData.foundedYear || ""}
                  onChange={(e) => setEditData(prev => ({ ...prev, foundedYear: e.target.value }))}
                  placeholder="2018"
                />
              ) : (
                <p className="font-medium">{currentData.foundedYear || "Not specified"}</p>
              )}
            </div>
          </div>

          <div>
            <Label>Company Description</Label>
            {isEditing ? (
              <Textarea
                value={editData.companyDescription || ""}
                onChange={(e) => setEditData(prev => ({ ...prev, companyDescription: e.target.value }))}
                rows={4}
                placeholder="Tell us about your company..."
              />
            ) : (
              <p className="text-gray-700">{currentData.companyDescription}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Culture & Values */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Culture & Values
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Mission Statement</Label>
            {isEditing ? (
              <Textarea
                value={editData.mission || ""}
                onChange={(e) => setEditData(prev => ({ ...prev, mission: e.target.value }))}
                rows={3}
                placeholder="What is your company's mission?"
              />
            ) : (
              <p className="text-gray-700">{currentData.mission || "No mission statement provided"}</p>
            )}
          </div>

          <div>
            <Label>Company Values</Label>
            {isEditing ? (
              <Input
                value={editData.values ? editData.values.join(", ") : ""}
                onChange={(e) => setEditData(prev => ({ ...prev, values: e.target.value.split(", ").filter(v => v.trim()) }))}
                placeholder="Innovation, Collaboration, Growth, etc."
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {(currentData.values || []).map((value, idx) => (
                  <Badge key={idx} variant="outline">{value}</Badge>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label>Company Culture Description</Label>
            {isEditing ? (
              <Textarea
                value={editData.workEnvironment || ""}
                onChange={(e) => setEditData(prev => ({ ...prev, workEnvironment: e.target.value }))}
                rows={3}
                placeholder="Describe your company culture and working environment..."
              />
            ) : (
              <p className="text-gray-700">{currentData.workEnvironment || "No company culture description provided"}</p>
            )}
          </div>

          <div>
            <Label>Diversity & Inclusion Commitment</Label>
            {isEditing ? (
              <Textarea
                value={editData.diversityCommitment || ""}
                onChange={(e) => setEditData(prev => ({ ...prev, diversityCommitment: e.target.value }))}
                rows={3}
                placeholder="Describe your commitment to diversity and inclusion..."
              />
            ) : (
              <p className="text-gray-700">{currentData.diversityCommitment || "No diversity commitment provided"}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Benefits & Perks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Benefits & Perks
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Company Benefits</Label>
            {isEditing ? (
              <Textarea
                value={editData.benefits ? editData.benefits.join(", ") : ""}
                onChange={(e) => setEditData(prev => ({ ...prev, benefits: e.target.value.split(", ").filter(b => b.trim()) }))}
                rows={3}
                placeholder="Private Healthcare, Pension Scheme, Flexible Working Hours, etc."
              />
            ) : (
              <div className="space-y-2">
                {(currentData.benefits || []).map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-green-800">{benefit}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>



      {/* Entry-Level Employee Testimonials */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Entry-Level Employee Testimonials
          </CardTitle>
          <p className="text-sm text-gray-600">
            Showcase testimonials from your newest team members to highlight entry-level support.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gradient-to-r from-pink-50 to-yellow-50 border border-pink-200 rounded-lg p-4">
            <blockquote className="text-gray-800 italic mb-3">
              "Joining TechFlow as a graduate has been an incredible experience. The mentorship programme paired me with a senior developer who's been amazing at guiding my growth. I've learned more in my first 6 months here than I did in my entire final year at university. The company really invests in your development and treats you as a valued team member from day one."
            </blockquote>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                J
              </div>
              <div>
                <div className="font-medium text-gray-900">Jamie</div>
                <div className="text-xs text-gray-600">Junior Software Developer</div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <MessageCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <div className="font-medium text-yellow-900 mb-1">Request New Testimonials</div>
                <div className="text-sm text-yellow-800 mb-3">
                  Contact your newest team members directly to request authentic testimonials that showcase your entry-level support and development programmes.
                </div>
                <Dialog open={showTestimonialDialog} onOpenChange={setShowTestimonialDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="border-yellow-300 text-yellow-700 hover:bg-yellow-100">
                      Request Employee Testimonial
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Request Employee Testimonial</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="employeeName">Employee Name</Label>
                        <Input
                          id="employeeName"
                          value={testimonialForm.employeeName}
                          onChange={(e) => setTestimonialForm(prev => ({ ...prev, employeeName: e.target.value }))}
                          placeholder="Enter employee's full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="employeeEmail">Employee Email</Label>
                        <Input
                          id="employeeEmail"
                          type="email"
                          value={testimonialForm.employeeEmail}
                          onChange={(e) => setTestimonialForm(prev => ({ ...prev, employeeEmail: e.target.value }))}
                          placeholder="employee@company.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="position">Position</Label>
                        <Input
                          id="position"
                          value={testimonialForm.position}
                          onChange={(e) => setTestimonialForm(prev => ({ ...prev, position: e.target.value }))}
                          placeholder="e.g. Marketing Assistant"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          value={testimonialForm.department}
                          onChange={(e) => setTestimonialForm(prev => ({ ...prev, department: e.target.value }))}
                          placeholder="e.g. Marketing"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Personal Message (Optional)</Label>
                        <Textarea
                          id="message"
                          value={testimonialForm.message}
                          onChange={(e) => setTestimonialForm(prev => ({ ...prev, message: e.target.value }))}
                          placeholder="Add a personal note to encourage participation..."
                          rows={3}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowTestimonialDialog(false)}>
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleTestimonialSubmit}
                          disabled={!testimonialForm.employeeName || !testimonialForm.employeeEmail}
                        >
                          Send Request
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Recognition */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Company Recognition
          </CardTitle>
          <p className="text-sm text-gray-600">Awards, certifications, and industry recognition</p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-yellow-600" />
                <div>
                  <div className="font-semibold text-yellow-900">Best Tech Employer 2023</div>
                  <div className="text-sm text-yellow-700">Tech Industry Awards</div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div>
                  <div className="font-semibold text-green-900">Great Place to Work Certified</div>
                  <div className="text-sm text-green-700">Employee Satisfaction Recognition</div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Star className="w-8 h-8 text-blue-600" />
                <div>
                  <div className="font-semibold text-blue-900">Innovation Excellence Award</div>
                  <div className="text-sm text-blue-700">Business Innovation Council</div>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-pink-50 to-indigo-50 border border-pink-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-pink-600" />
                <div>
                  <div className="font-semibold text-pink-900">Top 50 Remote Companies</div>
                  <div className="text-sm text-pink-700">Remote Work Excellence</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-pink-50 border border-pink-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Award className="w-5 h-5 text-pink-600 mt-0.5" />
              <div>
                <div className="font-medium text-pink-900 mb-1">Add More Recognition</div>
                <div className="text-sm text-pink-800 mb-3">
                  Highlight additional awards, certifications, and industry recognition to establish credibility and attract top talent.
                </div>
                <Dialog open={showRecognitionDialog} onOpenChange={setShowRecognitionDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="border-pink-300 text-pink-700 hover:bg-pink-100">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Recognition
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add Company Recognition</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="awardName">Award/Recognition Name</Label>
                        <Input
                          id="awardName"
                          value={recognitionForm.awardName}
                          onChange={(e) => setRecognitionForm(prev => ({ ...prev, awardName: e.target.value }))}
                          placeholder="e.g. Best Tech Employer 2024"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="organization">Awarding Organization</Label>
                        <Input
                          id="organization"
                          value={recognitionForm.organization}
                          onChange={(e) => setRecognitionForm(prev => ({ ...prev, organization: e.target.value }))}
                          placeholder="e.g. Tech Industry Awards"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="year">Year Received</Label>
                        <Input
                          id="year"
                          value={recognitionForm.year}
                          onChange={(e) => setRecognitionForm(prev => ({ ...prev, year: e.target.value }))}
                          placeholder="e.g. 2024"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Textarea
                          id="description"
                          value={recognitionForm.description}
                          onChange={(e) => setRecognitionForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Brief description of the recognition..."
                          rows={3}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowRecognitionDialog(false)}>
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleRecognitionSubmit}
                          disabled={!recognitionForm.awardName || !recognitionForm.organization}
                        >
                          Add Recognition
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Entry-Level Support Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Entry-Level Support Programmes
          </CardTitle>
          <p className="text-sm text-gray-600">Specific programmes and support for entry-level hires</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Graduate Development Programme</Label>
            {isEditing ? (
              <Textarea
                value={editData.graduateDevelopmentProgramme || ""}
                onChange={(e) => setEditData(prev => ({ ...prev, graduateDevelopmentProgramme: e.target.value }))}
                rows={3}
                placeholder="Describe your graduate development programme..."
              />
            ) : (
              <p className="text-gray-700">{currentData.graduateDevelopmentProgramme || "6-month structured programme with dedicated mentorship, weekly skills workshops, and real project experience from day one."}</p>
            )}
          </div>

          <div>
            <Label>Mentorship Programme</Label>
            {isEditing ? (
              <Textarea
                value={editData.mentorshipProgramme || ""}
                onChange={(e) => setEditData(prev => ({ ...prev, mentorshipProgramme: e.target.value }))}
                rows={3}
                placeholder="Describe your mentorship programme..."
              />
            ) : (
              <p className="text-gray-700">{currentData.mentorshipProgramme || "Every new hire paired with experienced team member for guidance, career development, and technical support."}</p>
            )}
          </div>

          <div>
            <Label>Training & Development</Label>
            {isEditing ? (
              <Textarea
                value={editData.trainingDevelopment || ""}
                onChange={(e) => setEditData(prev => ({ ...prev, trainingDevelopment: e.target.value }))}
                rows={3}
                placeholder="Describe training and development opportunities..."
              />
            ) : (
              <p className="text-gray-700">{currentData.trainingDevelopment || "£2,000 annual learning budget, access to online courses, conference attendance, and internal skills workshops."}</p>
            )}
          </div>
          
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <div className="font-medium text-green-900 mb-1">Enhance Support Programmes</div>
                <div className="text-sm text-green-800 mb-3">
                  Detail additional mentorship, training, and development programmes to show how you support new graduates and career changers.
                </div>
                <Dialog open={showProgrammeDialog} onOpenChange={setShowProgrammeDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="border-green-300 text-green-700 hover:bg-green-100">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Programmes
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add Support Programme</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="programmeName">Programme Name</Label>
                        <Input
                          id="programmeName"
                          value={programmeForm.programmeName}
                          onChange={(e) => setProgrammeForm(prev => ({ ...prev, programmeName: e.target.value }))}
                          placeholder="e.g. Graduate Fast Track Programme"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Programme Description</Label>
                        <Textarea
                          id="description"
                          value={programmeForm.description}
                          onChange={(e) => setProgrammeForm(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Describe what this programme offers..."
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="benefits">Key Benefits</Label>
                        <Textarea
                          id="benefits"
                          value={programmeForm.benefits}
                          onChange={(e) => setProgrammeForm(prev => ({ ...prev, benefits: e.target.value }))}
                          placeholder="List the main benefits for participants..."
                          rows={3}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowProgrammeDialog(false)}>
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleProgrammeSubmit}
                          disabled={!programmeForm.programmeName || !programmeForm.description}
                        >
                          Add Programme
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team & Culture Photos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Team & Culture Photos
          </CardTitle>
          <p className="text-sm text-gray-600">
            Share authentic photos of your team, office space, and company events
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="aspect-square bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <div className="text-xs text-blue-600 font-medium">Team Photo</div>
              </div>
            </div>
            <div className="aspect-square bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Building2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-xs text-green-600 font-medium">Office Space</div>
              </div>
            </div>
            <div className="aspect-square bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Calendar className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-xs text-yellow-600 font-medium">Company Event</div>
              </div>
            </div>
            <div className="aspect-square bg-gradient-to-br from-pink-50 to-orange-50 border border-pink-200 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Coffee className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                <div className="text-xs text-pink-600 font-medium">Workspace</div>
              </div>
            </div>
            <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colours">
              <Button variant="ghost" className="flex flex-col items-center gap-2 h-full w-full">
                <Plus className="w-6 h-6 text-gray-400" />
                <span className="text-xs text-gray-500">Add Photo</span>
              </Button>
            </div>
            <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-gray-400 transition-colours">
              <Button variant="ghost" className="flex flex-col items-center gap-2 h-full w-full">
                <Plus className="w-6 h-6 text-gray-400" />
                <span className="text-xs text-gray-500">Add Photo</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diversity & Inclusion */}
      <Card>
        <CardHeader>
          <CardTitle>Diversity & Inclusion</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label>D&I Commitment</Label>
            {isEditing ? (
              <Textarea
                value={editData.diversityInclusion || ""}
                onChange={(e) => setEditData(prev => ({ ...prev, diversityInclusion: e.target.value }))}
                rows={4}
                placeholder="Describe your diversity and inclusion initiatives..."
              />
            ) : (
              <p className="text-gray-700 mb-4">{currentData.diversityInclusion || "Committed to building a diverse and inclusive workplace where everyone feels valued and can reach their full potential. We actively promote equality and belonging across all levels of our organization."}</p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-pink-50 border-pink-200 text-pink-800">
              Equal Opportunity Employer
            </Badge>
            <Badge variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-800">
              Inclusive Culture
            </Badge>
            <Badge variant="outline" className="bg-green-50 border-green-200 text-green-800">
              Diversity Training
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function EmployerDashboard() {
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const [isAutoLoggingIn, setIsAutoLoggingIn] = useState(false);
  const [shouldShowDemoLogin, setShouldShowDemoLogin] = useState(false);
  const navigate = useNavigate();

  // Check if user needs demo login
  React.useEffect(() => {
    const checkAndLogin = async () => {
      // If no user is authenticated, show demo login option
      if (!user) {
        setShouldShowDemoLogin(true);
      }
    };
    
    checkAndLogin();
  }, [user]);

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
        // Reload to trigger auth state refresh
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
  const { data: employerProfile } = useQuery({
    queryKey: ["/api/employer-profile/current"],
    retry: false,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  // Default profile data if none exists
  const defaultProfile = {
    id: 1,
    companyName: "TechFlow Solutions",
    industry: "Technology", 
    location: "London, UK",
    overallRating: 4.2,
    totalReviews: 28,
    approvalStatus: "approved",
    profileCompleted: false
  };

  // Ensure profile setup shows by forcing profileCompleted to false for demo
  const profile = employerProfile ? 
    { ...employerProfile, profileCompleted: false } : 
    defaultProfile;

  // Show demo login if user is not authenticated
  if (shouldShowDemoLogin && !user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Employer Dashboard</CardTitle>
            <p className="text-center text-muted-foreground">
              Access the employer dashboard with demo login
            </p>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p>Click below to access the employer dashboard with demo data.</p>
            <Button 
              onClick={handleDemoLogin} 
              className="w-full bg-pink-600 hover:bg-pink-700 text-white"
              disabled={isAutoLoggingIn}
            >
              {isAutoLoggingIn ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Logging in...
                </>
              ) : (
                "Demo Login (Employer)"
              )}
            </Button>
            <p className="text-sm text-muted-foreground">
              This will give you access to the full employer experience
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading state while auto-logging in or fetching profile
  if (isAutoLoggingIn || !profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E2007A] mx-auto"></div>
          <p className="mt-2 text-muted-foreground">
            {isAutoLoggingIn ? "Setting up demo..." : "Loading dashboard..."}
          </p>
        </div>
      </div>
    );
  }

  const dashboardStats = {
    activeJobs: 3,
    totalApplications: 47,
    newApplications: 12,
    scheduledInterviews: 8,
    averageRating: 4.2,
    profileViews: 156
  };

  const recentApplications = [
    {
      id: 1,
      candidateName: "Sarah Johnson",
      jobTitle: "Marketing Assistant",
      appliedDate: "2024-01-15",
      status: "pending",
      matchScore: 87,
      skillsScore: 92,
      behaviouralScore: 82
    },
    {
      id: 2,
      candidateName: "Michael Chen",
      jobTitle: "Data Analyst",
      appliedDate: "2024-01-14",
      status: "reviewed",
      matchScore: 94,
      skillsScore: 96,
      behaviouralScore: 92
    },
    {
      id: 3,
      candidateName: "Emma Williams",
      jobTitle: "Customer Service Representative",
      appliedDate: "2024-01-13",
      status: "interview_scheduled",
      matchScore: 78,
      skillsScore: 75,
      behaviouralScore: 81
    }
  ];

  const activeJobs = [
    {
      id: 1,
      title: "Marketing Assistant",
      applicants: 18,
      status: "active",
      postedDate: "2024-01-10",
      tier: "premium"
    },
    {
      id: 2,
      title: "Data Analyst",
      applicants: 23,
      status: "active",
      postedDate: "2024-01-08",
      tier: "enterprise"
    },
    {
      id: 3,
      title: "Customer Service Representative",
      applicants: 6,
      status: "paused",
      postedDate: "2024-01-12",
      tier: "basic"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending Review</Badge>;
      case "reviewed":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Reviewed</Badge>;
      case "interview_scheduled":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Interview Scheduled</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getJobStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "paused":
        return <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>;
      case "closed":
        return <Badge className="bg-red-100 text-red-800">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "basic":
        return <Badge variant="outline" className="text-gray-600">Basic</Badge>;
      case "premium":
        return <Badge className="bg-blue-100 text-blue-800">Premium</Badge>;
      case "enterprise":
        return <Badge className="bg-purple-100 text-purple-800">Enterprise</Badge>;
      default:
        return <Badge variant="outline">{tier}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{fontFamily: 'Sora'}}>{profile.companyName}</h1>
                <p className="text-gray-600" style={{fontFamily: 'Poppins'}}>{profile.industry} • {profile.location}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="font-medium">4.8</span>
                <span className="text-sm text-gray-500">(47 reviews)</span>
              </div>
              
              <Button 
                onClick={() => navigate("/comprehensive-job-posting")}
                className="bg-pink-600 hover:bg-pink-700"
                style={{fontFamily: 'Sora'}}
              >
                <Plus className="w-4 h-4 mr-2" />
                Post New Job
              </Button>
            </div>
          </div>
        </div>
      </div>
            
            {/* Profile Setup Alert */}
            {!profile.profileCompleted && (
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-orange-600 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-orange-900 mb-2">Complete Your Company Profile</h3>
                      <p className="text-orange-800 mb-4">
                        Your company profile is incomplete. Complete it to showcase your company to potential candidates 
                        and improve your visibility on the platform. This is free and only takes a few minutes.
                      </p>
                      <div className="flex gap-3">
                        <Button 
                          onClick={() => window.location.href = "/employer-profile-setup"}
                          className="bg-orange-600 hover:bg-orange-700"
                        >
                          <Building2 className="w-4 h-4 mr-2" />
                          Set Up Profile Now
                        </Button>
                        <Button 
                          variant="outline"
                          className="border-orange-300 text-orange-700 hover:bg-orange-100"
                        >
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                      <p className="text-2xl font-bold">{dashboardStats.activeJobs}</p>
                    </div>
                    <Briefcase className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Applications</p>
                      <p className="text-2xl font-bold">{dashboardStats.totalApplications}</p>
                    </div>
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">New Applications</p>
                      <p className="text-2xl font-bold">{dashboardStats.newApplications}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Interviews Scheduled</p>
                      <p className="text-2xl font-bold">{dashboardStats.scheduledInterviews}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Recent Applications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentApplications.slice(0, 3).map((application) => (
                      <div key={application.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{application.candidateName}</p>
                          <p className="text-sm text-gray-600">{application.jobTitle}</p>
                          <p className="text-xs text-gray-500">{application.appliedDate}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium mb-1">Match: {application.matchScore}%</div>
                          {getStatusBadge(application.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    View All Applications
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Average Match Score</span>
                      <span className="font-medium">86%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Response Rate</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Interview Conversion</span>
                      <span className="font-medium">34%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Profile Views (7 days)</span>
                      <span className="font-medium">{dashboardStats.profileViews}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Candidate Matches Tab */}
          <TabsContent value="candidates" className="space-y-6">
            <ATSDashboard />
          </TabsContent>

          {/* Company Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <ProfileEditSection profile={profile} />
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Company Insights</h2>
              <p className="text-gray-600">Anonymous candidate feedback and platform analytics</p>
            </div>

            {/* Candidate Experience Ratings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Candidate Experience Ratings
                </CardTitle>
                <p className="text-sm text-gray-600">Anonymous feedback from candidates who applied to your jobs</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-1">4.8</div>
                    <div className="text-sm font-medium mb-2">Feedback Quality</div>
                    <div className="flex justify-center">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-1">4.9</div>
                    <div className="text-sm font-medium mb-2">Communication Speed</div>
                    <div className="flex justify-center">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 mb-1">4.7</div>
                    <div className="text-sm font-medium mb-2">Interview Experience</div>
                    <div className="flex justify-center">
                      {[1,2,3,4].map((star) => (
                        <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                      <Star className="w-4 h-4 text-yellow-400 fill-current opacity-70" />
                    </div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600 mb-1">4.6</div>
                    <div className="text-sm font-medium mb-2">Process Transparency</div>
                    <div className="flex justify-center">
                      {[1,2,3,4].map((star) => (
                        <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                      <Star className="w-4 h-4 text-gray-300" />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-3">Recent Anonymous Reviews</h4>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[1,2,3,4,5].map((star) => (
                            <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">• Junior Developer Application</span>
                      </div>
                      <p className="text-gray-700 text-sm">
                        "Really appreciated the detailed feedback even though I wasn't successful. The interview process was well-structured and the team was very welcoming. Clear communication throughout."
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[1,2,3,4].map((star) => (
                            <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                          ))}
                          <Star className="w-4 h-4 text-gray-300" />
                        </div>
                        <span className="text-sm text-gray-600">• Marketing Assistant Application</span>
                      </div>
                      <p className="text-gray-700 text-sm">
                        "The skills challenges were relevant and actually fun to complete. Response time could be faster but overall good experience."
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hiring Activity on Pollen */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Hiring Activity on Pollen
                </CardTitle>
                <p className="text-sm text-gray-600">Your company's engagement and activity on the platform</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-1">23</div>
                    <div className="text-sm font-medium mb-2">Jobs Posted</div>
                    <div className="text-xs text-gray-600">Last 12 months</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-1">156</div>
                    <div className="text-sm font-medium mb-2">Candidates Reviewed</div>
                    <div className="text-xs text-gray-600">Total interactions</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 mb-1">12</div>
                    <div className="text-sm font-medium mb-2">Successful Hires</div>
                    <div className="text-xs text-gray-600">Through Pollen</div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-3">Recent Activity</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Briefcase className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">Posted Junior Developer position</div>
                        <div className="text-xs text-gray-600">3 days ago</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">Hired Marketing Assistant through Pollen</div>
                        <div className="text-xs text-gray-600">1 week ago</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Star className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">Received 5-star candidate review</div>
                        <div className="text-xs text-gray-600">2 weeks ago</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pollen Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Pollen Platform Insights
                </CardTitle>
                <p className="text-sm text-gray-600">Our observations about your company based on candidate interactions</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Company Statement</h4>
                  <p className="text-blue-800 text-sm leading-relaxed">
                    "At TechFlow Solutions, we believe that great technology comes from great people. We're not just a consultancy - we're a launching pad for careers. Every new hire gets a dedicated mentor, a clear development path, and real responsibility from day one. We've built our culture around learning, collaboration, and giving everyone the tools they need to do their best work."
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Pollen Observations</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-green-800">
                        Consistently provides detailed, constructive feedback to all candidates - even those not hired
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-green-800">
                        Has mentorship programmes specifically designed for entry-level hires
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-green-800">
                        Responds to applications within 48 hours on average
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-green-800">
                        Interview process includes practical, real-world scenarios rather than just theoretical questions
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>


          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Job Postings</h2>
              <Button onClick={() => window.location.href = "/comprehensive-job-posting"}>
                <Plus className="w-4 h-4 mr-2" />
                Create New Job
              </Button>
            </div>

            {/* Draft Jobs Section */}
            <DraftJobsSection />

            {/* Active Jobs Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Active Jobs</h3>
              <div className="grid gap-4">
                {activeJobs.map((job) => (
                  <Card key={job.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.location.href = `/job-posting-view/${job.id}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium text-lg">{job.title}</h3>
                            {getJobStatusBadge(job.status)}
                            {getTierBadge(job.tier)}
                          </div>
                          <div className="flex items-center gap-6 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {job.applicants} applications
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Posted {job.postedDate}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent card click
                              window.location.href = `/job-posting-view/${job.id}`;
                            }}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent card click
                              window.location.href = `/job-candidate-matches/${job.id}`;
                            }}
                          >
                            <Users className="w-4 h-4 mr-1" />
                            Matches
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent card click
                              window.location.href = `/comprehensive-job-posting?edit=${job.id}`;
                            }}
                          >
                            Edit
                          </Button>
                          {job.status === "active" ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent card click
                                toast({
                                  title: "Job Paused",
                                  description: `${job.title} has been paused and will no longer accept applications.`
                                });
                              }}
                            >
                              Pause
                            </Button>
                          ) : (
                            <Button 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent card click
                                toast({
                                  title: "Job Activated",
                                  description: `${job.title} is now active and accepting applications.`
                                });
                              }}
                            >
                              Activate
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Candidates Tab */}
          <TabsContent value="candidates" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Candidate Database</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Advanced Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Search className="w-4 h-4 mr-2" />
                  Search Skills
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Available Candidates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Browse verified candidates matched to your requirements. Premium and Enterprise tiers include advanced filtering.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">Candidate {i}</h4>
                            <p className="text-sm text-gray-600">Marketing</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Match Score:</span>
                            <span className="font-medium text-green-600">87%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Location:</span>
                            <span>London, UK</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Availability:</span>
                            <span>Immediate</span>
                          </div>
                        </div>
                        
                        <Button variant="outline" size="sm" className="w-full mt-3">
                          View Profile
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <h2 className="text-2xl font-bold">Analytics & Insights</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Application Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Application trend chart would go here</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Candidate Quality</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">High Match (80%+)</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div className="w-16 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">67%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Medium Match (60-79%)</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div className="w-8 h-2 bg-yellow-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">25%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Low Match (Below 60%)</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium">8%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Testimonials Tab */}
          <TabsContent value="testimonials" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Entry-Level Employee Testimonials</h2>
                <p className="text-gray-600">Build trust with success stories from junior employees</p>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Testimonial
              </Button>
            </div>

            <div className="space-y-4">
              {/* Sample testimonial */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">Emma Johnson</h3>
                        <Badge variant="outline">Marketing Assistant</Badge>
                      </div>
                      <p className="text-gray-700 mb-3">
                        "Starting at TechFlow as a graduate was the best decision I made. The mentorship programmeme 
                        helped me grow from knowing nothing about digital marketing to leading my own campaigns in 
                        just 6 months. The team is incredibly supportive and always willing to help."
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Joined: September 2023</span>
                        <span>Duration: 1 year</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Add new testimonial placeholder */}
              <Card className="border-dashed border-2 border-gray-300">
                <CardContent className="p-12 text-center">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Add Your First Testimonial</h3>
                  <p className="text-gray-600 mb-4">
                    Share success stories from your junior employees to show how you develop early-career talent
                  </p>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Testimonial
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Recognition Tab */}
          <TabsContent value="recognition" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Company Recognition</h2>
                <p className="text-gray-600">Highlight awards and industry recognition</p>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Recognition
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Sample recognition */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">Best Places to Work 2024</h3>
                      <p className="text-sm text-gray-600 mb-2">Great Place to Work Institute</p>
                      <p className="text-sm text-gray-700">
                        Recognised for exceptional workplace culture and employee satisfaction
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Add new recognition placeholder */}
              <Card className="border-dashed border-2 border-gray-300">
                <CardContent className="p-12 text-center">
                  <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Add Recognition</h3>
                  <p className="text-gray-600 mb-4">
                    Showcase your awards and certifications
                  </p>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Recognition
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Programmemes Tab */}
          <TabsContent value="programmemes" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Entry-Level Support Programmemes</h2>
                <p className="text-gray-600">Detail your mentorship and development programmemes</p>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Programmeme
              </Button>
            </div>

            <div className="space-y-4">
              {/* Sample programmeme */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Target className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">Graduate Development Programmeme</h3>
                        <Badge className="bg-green-100 text-green-800">6 months</Badge>
                      </div>
                      <p className="text-gray-700 mb-3">
                        Comprehensive programmeme pairing new graduates with senior mentors. Includes weekly 
                        one-to-ones, skills workshops, and structured career development planning.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">Mentorship</Badge>
                        <Badge variant="outline">Skills Training</Badge>
                        <Badge variant="outline">Career Planning</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Add new programmeme placeholder */}
              <Card className="border-dashed border-2 border-gray-300">
                <CardContent className="p-12 text-center">
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Add Support Programmeme</h3>
                  <p className="text-gray-600 mb-4">
                    Describe how you support new graduates and career changers
                  </p>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Programmeme
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>


        </Tabs>
      </div>
    </div>
  );
}