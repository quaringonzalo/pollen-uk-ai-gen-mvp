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
import PostSignupAssessment from "@/components/post-signup-assessment";
import { Sprout, ArrowLeft, ArrowRight, CheckCircle, User, MapPin, Briefcase, Code } from "lucide-react";

interface SignupData {
  // Basic Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Basic Professional Info
  experienceLevel: string;
  currentRole?: string;
  
  // Terms acceptance
  termsAccepted: boolean;
}

export default function JobSeekerSignup() {
  const { toast } = useToast();
  const [showAssessment, setShowAssessment] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<SignupData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    experienceLevel: "",
    currentRole: "",
    termsAccepted: false
  });

  // DISC Assessment Questions from CSV
  const discQuestions = [
    {
      question: "Rules are for...",
      options: ["Avoiding unnecessary risks", "Respecting - they're there for a reason", "Breaking when they don't make sense", "Guidelines to help navigate situations"]
    },
    {
      question: "When it comes to conflict...",
      options: ["I care deeply if I'm involved, it matters to me what people think", "I remove myself from the situation", "I tackle it head-on", "I try to find a middle ground that works for everyone"]
    },
    {
      question: "Flat pack furniture...",
      options: ["Gives me a big sense of accomplishment after proper preparation", "Is a fun activity to do as a team", "Is best tackled with determination and speed", "Should come with clearer instructions"]
    },
    {
      question: "My to-do list is...",
      options: ["Extensively organised into categories", "Pretty concise, I don't have many urgent things to do", "Not overly important, flexibility is everything", "Written but regularly ignored"]
    },
    {
      question: "When playing a game I...",
      options: ["Will analyse every move and strive to do my best", "Play to win", "Focus on having fun with friends", "Like to try new strategies"]
    },
    {
      question: "When carrying out a task I...",
      options: ["Approach it systematically, ensuring all details are covered", "Invest time in deciding how to tackle it, seeking guidance from others where I can", "Jump straight in and adapt as I go", "Break it down into manageable chunks"]
    },
    {
      question: "My social life is...",
      options: ["All about close-knit bonds and shared memories", "Super busy, I'm always hanging out with different people", "Balanced between social time and alone time", "Centered around shared interests and activities"]
    },
    {
      question: "I make decisions...",
      options: ["With careful thought and analysis, every choice matters", "As a team, once I've consulted everyone's opinions", "Quickly and trust my instincts", "Based on past experiences and proven methods"]
    }
  ];

  const jobTypes = ["Permanent", "Temporary", "Internship", "Apprenticeship", "Full-time", "Part-time", "Contract / Freelance"];
  
  const ukLocations = [
    "London", "Birmingham", "Manchester", "Leeds", "Liverpool", "Newcastle", "Sheffield", 
    "Southampton", "Nottingham", "Glasgow", "Cardiff", "Bristol", "Edinburgh", "Brighton",
    "South East", "South West", "North West", "Yorkshire & The Humber", "North East", 
    "West Midlands", "East Midlands", "Wales", "Northern Ireland", "Scotland", 
    "Open to relocate", "Fully remote", "International"
  ];

  const roleTypes = [
    "Accounting & Finance", "Administration & Support", "Art & Design", "Business Dev & Strategy",
    "Consulting", "Data & Analytics", "Engineering", "Information Technology", "Legal & Compliance",
    "Marketing", "Media & Communication", "Operations", "Product Development", "Project Management",
    "Purchasing & Procurement", "Risk Management", "People / HR / Recruitment", "Research",
    "Sales & Account Management", "Software Development", "Teaching & Training", "No idea! Help!"
  ];

  const industries = [
    "Agriculture & Environment", "Art & Design", "Automotive", "Blockchain", "Charity & Community",
    "Construction & Property", "Consulting", "Data & Analytics", "eCommerce & Retail", 
    "Education & Learning", "Energy & Utilities", "Fashion & Beauty", "Financial Services",
    "FMCG", "Gaming & Entertainment", "Marketing & Advertising", "Media & News", "Healthcare",
    "Hospitality, Travel & Leisure", "HR, People & Recruitment", "Law", "Lifestyle, Health & Fitness",
    "Manufacturing & Logistics", "Publishing", "Software & Technology", "Science", "Sports", 
    "Telecommunications", "No idea! Help!"
  ];

  const subjects = [
    "English", "Maths", "Physics", "Geography", "History", "PE / Sports Science", "Business Studies",
    "Psychology", "Media Studies", "Modern Languages", "Biology", "IT / Computing", "Chemistry",
    "Law", "Design Tech", "Drama & Music", "Art", "Ancient Civilisation", "Graphic Design",
    "Sociology", "Economics", "Marketing", "Engineering"
  ];

  const workValues = [
    "Sustainability", "Salary", "Company Culture & Values", "Career Progression", "Leadership",
    "Diversity & Inclusivity", "Company Benefits", "Flexible or Remote Working"
  ];

  const platformGoals = [
    "Access resources that make job hunting easier", "Find a job", "Learn about alternative careers",
    "Guidance/support", "Join a community of like-minded people", "CV-less job applications"
  ];

  const jobSearchChallenges = [
    "Lack of feedback", "Lengthy application process", "Vague job descriptions", 
    "Lack of transparency regarding salaries", "Lack of communication", "Ghosted by employers",
    "Overemphasis on experience and education"
  ];

  const createUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      return await apiRequest("/api/users", {
        method: "POST",
        body: JSON.stringify(userData)
      });
    },
    onSuccess: (user) => {
      // Create job seeker profile
      createProfileMutation.mutate({
        userId: user.id,
        ...formData
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive"
      });
    }
  });

  const createProfileMutation = useMutation({
    mutationFn: async (profileData: any) => {
      return await apiRequest("/api/job-seeker-profiles", {
        method: "POST",
        body: JSON.stringify(profileData)
      });
    },
    onSuccess: () => {
      toast({
        title: "Welcome to Pollen!",
        description: "Your account has been created successfully."
      });
      
      // Create demo user session
      const demoUser = {
        id: Math.floor(Math.random() * 1000) + 100,
        email: formData.email,
        role: "job_seeker",
        name: `${formData.firstName} ${formData.lastName}`
      };
      
      localStorage.setItem("demo_user", JSON.stringify(demoUser));
      
      // Redirect to onboarding for detailed profile completion
      window.location.href = "/onboarding";
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = () => {
    createUserMutation.mutate({
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      role: "job_seeker"
    });
  };

  const updateFormData = (field: keyof SignupData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const toggleArraySelection = (array: keyof SignupData, item: string) => {
    setFormData(prev => {
      const currentArray = prev[array] as string[];
      return {
        ...prev,
        [array]: currentArray.includes(item)
          ? currentArray.filter(i => i !== item)
          : [...currentArray, item]
      };
    });
  };

  const updateDiscAnswer = (questionIndex: number, answer: string) => {
    setFormData(prev => ({
      ...prev,
      discQuestions: {
        ...prev.discQuestions,
        [questionIndex]: answer
      }
    }));
  };

  const nextStep = () => {
    if (step < 7) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.firstName && formData.lastName && formData.email && formData.termsAccepted;
      case 2:
        return formData.experienceLevel;
      default:
        return false;
    }
  };

  // Handle assessment completion
  const handleAssessmentComplete = () => {
    window.location.href = "/job-seeker-dashboard";
  };

  const handleAssessmentSkip = () => {
    window.location.href = "/job-seeker-dashboard";
  };

  if (showAssessment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <PostSignupAssessment 
          userId={parseInt(localStorage.getItem("demo_user") ? JSON.parse(localStorage.getItem("demo_user")!).id : "1")}
          onComplete={handleAssessmentComplete}
          onSkip={handleAssessmentSkip}
        />
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
            {[1, 2].map((stepNum) => (
              <div
                key={stepNum}
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm ${
                  stepNum <= step
                    ? "bg-primary border-primary text-white"
                    : "border-gray-300 text-gray-400"
                }`}
              >
                {stepNum < step ? <CheckCircle className="w-4 h-4" /> : stepNum}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 2) * 100}%` }}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {step === 1 && <><User className="w-5 h-5" /> Basic Information</>}
              {step === 2 && <><Briefcase className="w-5 h-5" /> Experience Level</>}
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
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                    placeholder="+44 7000 000000"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="termsAccepted"
                      checked={formData.termsAccepted}
                      onCheckedChange={(checked) => updateFormData("termsAccepted", checked)}
                      className="mt-1"
                    />
                    <Label htmlFor="termsAccepted" className="text-sm leading-relaxed">
                      I agree to Pollen's{" "}
                      <a href="/terms" target="_blank" className="text-primary underline hover:no-underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="/privacy" target="_blank" className="text-primary underline hover:no-underline">
                        Privacy Policy
                      </a>
                      , and consent to the processing of my personal data for job matching and platform services.
                    </Label>
                  </div>
                </div>


              </div>
            )}

            {/* Step 2: Professional Background */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="experienceLevel">Experience Level *</Label>
                  <Select value={formData.experienceLevel} onValueChange={(value) => updateFormData("experienceLevel", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Complete beginner">Complete beginner</SelectItem>
                      <SelectItem value="Some experience">Some experience</SelectItem>
                      <SelectItem value="Career changer">Career changer</SelectItem>
                      <SelectItem value="Recent graduate">Recent graduate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="currentRole">Current/Most Recent Role (Optional)</Label>
                  <Input
                    id="currentRole"
                    value={formData.currentRole || ""}
                    onChange={(e) => updateFormData("currentRole", e.target.value)}
                    placeholder="e.g., Student, Sales Assistant, Barista"
                  />
                </div>
                

              </div>
            )}



            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={step === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              {step < 2 ? (
                <Button
                  onClick={nextStep}
                  disabled={!isStepValid()}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!isStepValid() || createUserMutation.isPending}
                >
                  {createUserMutation.isPending ? "Creating Account..." : "Complete Registration"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}