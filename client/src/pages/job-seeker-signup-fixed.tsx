import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Sprout, ArrowLeft, ArrowRight, CheckCircle, User, MapPin, Briefcase, GraduationCap } from "lucide-react";

interface SimpleSignupData {
  // Step 1: Basic Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  
  // Step 2: Education & Background
  qualificationLevel: string;
  qualificationSubject: string;
  institution: string;
  subjects: string[];
  
  // Step 3: Career Interests
  roleInterests: string[];
  industryInterests: string[];
  workValues: string[];
  
  // Step 4: Preferences
  jobTypes: string[];
  workLocations: string[];
  availability: string;
  platformGoals: string[];
}

export default function JobSeekerSignup() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [formData, setFormData] = useState<SimpleSignupData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    qualificationLevel: "",
    qualificationSubject: "",
    institution: "",
    subjects: [],
    roleInterests: [],
    industryInterests: [],
    workValues: [],
    jobTypes: [],
    workLocations: [],
    availability: "",
    platformGoals: []
  });

  // Data options
  const qualificationLevels = [
    "GCSE/O-Level", "A-Level/IB", "Bachelor's Degree", "Master's Degree", 
    "PhD", "Professional Certification", "Apprenticeship", "Other"
  ];

  const subjectAreas = [
    "Business & Management", "Computer Science & IT", "Engineering", "Arts & Design",
    "Science & Mathematics", "Social Sciences", "Languages", "Marketing & Communications",
    "Finance & Accounting", "Healthcare", "Education", "Law", "Media & Journalism"
  ];

  const roleInterests = [
    "Marketing Assistant", "Sales Representative", "Customer Service", "Data Analyst",
    "Software Developer", "Graphic Designer", "Content Creator", "Project Coordinator",
    "HR Assistant", "Finance Assistant", "Operations Associate", "Research Assistant"
  ];

  const industryInterests = [
    "Technology", "Healthcare", "Finance", "Education", "Retail", "Marketing & Advertising",
    "Non-profit", "Media & Entertainment", "Consulting", "Manufacturing", "Hospitality",
    "Real Estate", "Government", "Energy", "Transportation"
  ];

  const workValues = [
    "Work-life balance", "Career growth", "Competitive salary", "Flexible working",
    "Team collaboration", "Making a difference", "Learning opportunities", "Job security",
    "Creative freedom", "Leadership opportunities", "Diverse environment", "Company culture"
  ];

  const jobTypes = [
    "Full-time", "Part-time", "Internship", "Graduate scheme", "Apprenticeship", "Contract"
  ];

  const workLocations = [
    "Office-based", "Remote", "Hybrid", "Flexible"
  ];

  const availabilityOptions = [
    "Immediately", "Within 1 month", "Within 3 months", "Within 6 months", "Flexible"
  ];

  const platformGoals = [
    "Find my first job", "Explore career options", "Build professional skills",
    "Get career guidance", "Connect with employers", "Access learning resources"
  ];

  const createUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { id: Math.floor(Math.random() * 1000) + 100 };
    },
    onSuccess: (user) => {
      createProfileMutation.mutate({
        userId: user.id,
        ...formData
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive"
      });
    }
  });

  const createProfileMutation = useMutation({
    mutationFn: async (profileData: any) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { id: Math.floor(Math.random() * 1000) + 100 };
    },
    onSuccess: () => {
      setIsCompleted(true);
      
      const demoUser = {
        id: Math.floor(Math.random() * 1000) + 100,
        email: formData.email,
        role: "job_seeker",
        name: `${formData.firstName} ${formData.lastName}`
      };
      
      localStorage.setItem("demo_user", JSON.stringify(demoUser));
      
      setTimeout(() => {
        window.location.href = "/job-seeker-dashboard";
      }, 3000);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUserMutation.mutate({
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      role: "job_seeker"
    });
  };

  const updateFormData = (field: keyof SimpleSignupData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArraySelection = (field: keyof SimpleSignupData, item: string) => {
    setFormData(prev => {
      const currentArray = prev[field] as string[];
      return {
        ...prev,
        [field]: currentArray.includes(item)
          ? currentArray.filter(i => i !== item)
          : [...currentArray, item]
      };
    });
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.firstName && formData.lastName && formData.email && formData.location;
      case 2:
        return formData.qualificationLevel && formData.subjects.length > 0;
      case 3:
        return formData.roleInterests.length > 0 && formData.workValues.length > 0;
      case 4:
        return formData.jobTypes.length > 0 && formData.availability && formData.platformGoals.length > 0;
      default:
        return false;
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4 border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-green-800">Welcome to Pollen!</CardTitle>
            <p className="text-green-600">Your account has been created successfully</p>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Redirecting you to your dashboard...
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{width: "100%"}}></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold">Pollen</span>
          </div>
          <Button variant="ghost" onClick={() => window.location.href = "/"}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((stepNum) => (
              <div
                key={stepNum}
                className={`flex items-center justify-center w-12 h-12 rounded-full border-2 text-sm font-medium ${
                  stepNum <= step
                    ? "bg-primary border-primary text-white"
                    : "border-gray-300 text-gray-400"
                }`}
              >
                {stepNum < step ? <CheckCircle className="w-6 h-6" /> : stepNum}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {step === 1 && <><User className="w-5 h-5" /> Personal Information</>}
                {step === 2 && <><GraduationCap className="w-5 h-5" /> Education & Background</>}
                {step === 3 && <><Briefcase className="w-5 h-5" /> Career Interests</>}
                {step === 4 && <><MapPin className="w-5 h-5" /> Work Preferences</>}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Personal Information */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => updateFormData("firstName", e.target.value)}
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => updateFormData("lastName", e.target.value)}
                        placeholder="Smith"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      placeholder="john.smith@email.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => updateFormData("phone", e.target.value)}
                      placeholder="+44 7123 456789"
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => updateFormData("location", e.target.value)}
                      placeholder="London, UK"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Education & Background */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="qualificationLevel">Highest Qualification *</Label>
                    <Select value={formData.qualificationLevel} onValueChange={(value) => updateFormData("qualificationLevel", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your highest qualification" />
                      </SelectTrigger>
                      <SelectContent>
                        {qualificationLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="qualificationSubject">Main Subject/Field</Label>
                    <Input
                      id="qualificationSubject"
                      value={formData.qualificationSubject}
                      onChange={(e) => updateFormData("qualificationSubject", e.target.value)}
                      placeholder="e.g., Business Administration, Computer Science"
                    />
                  </div>

                  <div>
                    <Label htmlFor="institution">Institution/School</Label>
                    <Input
                      id="institution"
                      value={formData.institution}
                      onChange={(e) => updateFormData("institution", e.target.value)}
                      placeholder="e.g., University of London, Manchester College"
                    />
                  </div>

                  <div>
                    <Label>Subject Areas of Interest *</Label>
                    <p className="text-sm text-gray-600 mb-3">Select areas you're interested in or have studied</p>
                    <div className="grid grid-cols-2 gap-2">
                      {subjectAreas.map((subject) => (
                        <div key={subject} className="flex items-center space-x-2">
                          <Checkbox
                            id={subject}
                            checked={formData.subjects.includes(subject)}
                            onCheckedChange={() => toggleArraySelection('subjects', subject)}
                          />
                          <Label htmlFor={subject} className="text-sm">{subject}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Career Interests */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <Label>Roles You're Interested In *</Label>
                    <p className="text-sm text-gray-600 mb-3">Select entry-level roles that interest you</p>
                    <div className="grid grid-cols-2 gap-2">
                      {roleInterests.map((role) => (
                        <div key={role} className="flex items-center space-x-2">
                          <Checkbox
                            id={role}
                            checked={formData.roleInterests.includes(role)}
                            onCheckedChange={() => toggleArraySelection('roleInterests', role)}
                          />
                          <Label htmlFor={role} className="text-sm">{role}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Industries of Interest</Label>
                    <p className="text-sm text-gray-600 mb-3">Which industries would you like to work in?</p>
                    <div className="grid grid-cols-2 gap-2">
                      {industryInterests.map((industry) => (
                        <div key={industry} className="flex items-center space-x-2">
                          <Checkbox
                            id={industry}
                            checked={formData.industryInterests.includes(industry)}
                            onCheckedChange={() => toggleArraySelection('industryInterests', industry)}
                          />
                          <Label htmlFor={industry} className="text-sm">{industry}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>What's Important to You at Work? *</Label>
                    <p className="text-sm text-gray-600 mb-3">Select your top work values</p>
                    <div className="grid grid-cols-2 gap-2">
                      {workValues.map((value) => (
                        <div key={value} className="flex items-center space-x-2">
                          <Checkbox
                            id={value}
                            checked={formData.workValues.includes(value)}
                            onCheckedChange={() => toggleArraySelection('workValues', value)}
                          />
                          <Label htmlFor={value} className="text-sm">{value}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Work Preferences */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <Label>Job Types You're Interested In *</Label>
                    <p className="text-sm text-gray-600 mb-3">Select all that apply</p>
                    <div className="grid grid-cols-2 gap-2">
                      {jobTypes.map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={type}
                            checked={formData.jobTypes.includes(type)}
                            onCheckedChange={() => toggleArraySelection('jobTypes', type)}
                          />
                          <Label htmlFor={type} className="text-sm">{type}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Work Location Preference</Label>
                    <p className="text-sm text-gray-600 mb-3">How would you prefer to work?</p>
                    <div className="grid grid-cols-2 gap-2">
                      {workLocations.map((location) => (
                        <div key={location} className="flex items-center space-x-2">
                          <Checkbox
                            id={location}
                            checked={formData.workLocations.includes(location)}
                            onCheckedChange={() => toggleArraySelection('workLocations', location)}
                          />
                          <Label htmlFor={location} className="text-sm">{location}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="availability">When Can You Start? *</Label>
                    <Select value={formData.availability} onValueChange={(value) => updateFormData("availability", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your availability" />
                      </SelectTrigger>
                      <SelectContent>
                        {availabilityOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>What Do You Hope to Achieve with Pollen? *</Label>
                    <p className="text-sm text-gray-600 mb-3">Tell us your goals</p>
                    <div className="grid grid-cols-1 gap-2">
                      {platformGoals.map((goal) => (
                        <div key={goal} className="flex items-center space-x-2">
                          <Checkbox
                            id={goal}
                            checked={formData.platformGoals.includes(goal)}
                            onCheckedChange={() => toggleArraySelection('platformGoals', goal)}
                          />
                          <Label htmlFor={goal} className="text-sm">{goal}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={step === 1}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                
                {step < 4 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStepValid()}
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={!isStepValid() || createUserMutation.isPending}
                  >
                    {createUserMutation.isPending ? "Creating Account..." : "Create Account"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}