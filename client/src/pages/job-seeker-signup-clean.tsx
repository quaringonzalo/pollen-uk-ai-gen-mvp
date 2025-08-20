import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Sprout, ArrowLeft, ArrowRight, CheckCircle, User, MapPin, Briefcase, Heart } from "lucide-react";

interface SignupData {
  // Single step signup
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  termsAccepted: boolean;
}

const roleInterests = [
  "Customer Service", "Sales & Marketing", "Administration", "Data Entry",
  "Content Creation", "Social Media", "Research", "Project Coordination",
  "Technical Support", "Quality Assurance", "Finance & Accounting",
  "Human Resources", "Operations", "Design", "Teaching & Training"
];

const industryInterests = [
  "Technology", "Healthcare", "Finance", "Education", "Retail",
  "Non-profit", "Media & Entertainment", "Travel & Hospitality",
  "Sports & Fitness", "Food & Beverage", "Fashion", "Real Estate",
  "Government", "Consulting", "Manufacturing"
];



const workValues = [
  "Learning & Development", "Work-Life Balance", "Team Collaboration",
  "Making a Difference", "Creativity", "Problem Solving", "Flexibility",
  "Career Growth", "Job Security", "Competitive Salary", "Remote Work",
  "Innovation", "Helping Others", "Recognition"
];

const companySizes = [
  "Startup (1-10 people)", "Small (11-50 people)", "Medium (51-200 people)",
  "Large (201-1000 people)", "Enterprise (1000+ people)", "No preference"
];

export default function JobSeekerSignupClean() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<SignupData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    termsAccepted: false
  });

  const platformGoals = [
    "Find my first job", "Change careers into a new field", "Learn about different careers", 
    "Build my professional network", "Get guidance on job searching", "Access skills training",
    "Develop new skills", "Get feedback on my applications", "Practice for interviews"
  ];

  const createUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      // Mock API call - in real app would create user
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { id: Math.floor(Math.random() * 1000) + 100 };
    },
    onSuccess: (user) => {
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
      // Mock API call - in real app would create profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { id: Math.floor(Math.random() * 1000) + 100 };
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
      
      // Redirect to home page after successful signup
      window.location.href = "/home";
    },
    onError: () => {
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

  // Removed toggleArraySelection since we don't use arrays anymore

  const nextStep = () => {
    if (step < 2) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const isStepValid = () => {
    return formData.firstName && formData.lastName && formData.email && formData.termsAccepted;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
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
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Pollen</h1>
          <p className="text-gray-600">Start your career journey with us</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" /> Create Your Account
            </CardTitle>
            <CardDescription>
              Fill in your details to get started with career opportunities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
                  placeholder="+44 7123 456789"
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


              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
                <p className="text-sm text-blue-800">
                  Join our community immediately! You can participate in discussions, attend events, and access mentoring. Complete your profile assessment later to start applying for jobs.
                </p>
              </div>
            </div>

            {/* Create Account Button */}
            <div className="flex justify-center pt-6">
              <Button
                onClick={handleSubmit}
                disabled={!isStepValid() || createUserMutation.isPending}
                className="w-full"
              >
                {createUserMutation.isPending ? "Creating Account..." : "Create Account & Continue"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}