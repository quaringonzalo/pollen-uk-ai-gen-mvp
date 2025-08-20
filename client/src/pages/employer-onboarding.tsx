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
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Globe, Award, ArrowLeft, ArrowRight, CheckCircle, Star, Heart, LogOut } from "lucide-react";

interface EmployerOnboardingData {
  // Company basics
  companyName: string;
  industry: string;
  companySize: string;
  location: string;
  website: string;
  
  // Company profile
  about: string;
  mission: string;
  values: string[];
  culture: string;
  workEnvironment: string;
  diversityCommitment: string;
  
  // Benefits & perks
  benefits: string[];
  
  // Contact info
  contactEmail: string;
  contactPhone: string;
  linkedinPage: string;
  glassdoorUrl: string;
}

const industries = [
  "Technology", "Healthcare", "Finance", "Education", "Retail", "Manufacturing",
  "Consulting", "Media & Entertainment", "Non-profit", "Government", "Energy",
  "Transportation", "Real Estate", "Food & Beverage", "Travel & Hospitality"
];

const companySizes = [
  "1-10 employees", "11-50 employees", "51-200 employees", 
  "201-500 employees", "501-1000 employees", "1000+ employees"
];

const availableValues = [
  "Innovation", "Integrity", "Collaboration", "Excellence", "Diversity & Inclusion",
  "Sustainability", "Customer Focus", "Transparency", "Growth", "Work-Life Balance",
  "Social Impact", "Quality", "Agility", "Respect", "Accountability"
];

const availableBenefits = [
  "Private Healthcare", "Dental Care", "Eye Care", "Pension Scheme",
  "Flexible Working Hours", "Remote Work Options", "Professional Development",
  "Annual Leave", "Enhanced Maternity/Paternity Leave", "Mental Health Support",
  "Gym Membership", "Free Meals", "Share Options", "Performance Bonuses",
  "Learning Budget", "Conference Attendance", "Life Insurance", "Childcare Vouchers"
];

export default function EmployerOnboarding() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<EmployerOnboardingData>({
    companyName: "",
    industry: "",
    companySize: "",
    location: "",
    website: "",
    about: "",
    mission: "",
    values: [],
    culture: "",
    workEnvironment: "",
    diversityCommitment: "",
    benefits: [],
    contactEmail: "",
    contactPhone: "",
    linkedinPage: "",
    glassdoorUrl: "",
  });

  const createProfileMutation = useMutation({
    mutationFn: async (data: EmployerOnboardingData) => {
      // Mock API call - in real app would create employer profile
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { id: Math.floor(Math.random() * 1000) + 100 };
    },
    onSuccess: () => {
      toast({
        title: "Profile Created Successfully!",
        description: "Your employer profile is pending approval. We'll notify you once it's reviewed.",
      });
      
      // Create demo user session
      const demoUser = {
        id: Math.floor(Math.random() * 1000) + 100,
        email: formData.contactEmail,
        role: "employer",
        name: formData.companyName
      };
      
      localStorage.setItem("demo_user", JSON.stringify(demoUser));
      
      setTimeout(() => {
        window.location.href = "/employer-dashboard";
      }, 2000);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive"
      });
    }
  });

  const updateFormData = (field: keyof EmployerOnboardingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArraySelection = (array: 'values' | 'benefits', item: string) => {
    setFormData(prev => {
      const currentArray = prev[array];
      return {
        ...prev,
        [array]: currentArray.includes(item)
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
        return formData.companyName && formData.industry && formData.companySize && formData.location;
      case 2:
        return formData.about && formData.mission;
      case 3:
        return formData.benefits.length > 0;
      case 4:
        return formData.contactEmail;
      default:
        return false;
    }
  };

  const handleSubmit = () => {
    createProfileMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold">Pollen</span>
          </div>
          <div className="flex items-center gap-2">

          </div>
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {step === 1 && <><Building2 className="w-5 h-5" /> Company Information</>}
              {step === 2 && <><Heart className="w-5 h-5" /> Company Culture & Values</>}
              {step === 3 && <><Award className="w-5 h-5" /> Benefits & Perks</>}
              {step === 4 && <><Users className="w-5 h-5" /> Contact Details</>}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Company Information */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => updateFormData("companyName", e.target.value)}
                    placeholder="Acme Corporation"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="industry">Industry *</Label>
                    <Select value={formData.industry} onValueChange={(value) => updateFormData("industry", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="companySize">Company Size *</Label>
                    <Select value={formData.companySize} onValueChange={(value) => updateFormData("companySize", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {companySizes.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Primary Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => updateFormData("location", e.target.value)}
                    placeholder="London, UK"
                  />
                </div>

                <div>
                  <Label htmlFor="website">Company Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => updateFormData("website", e.target.value)}
                    placeholder="https://company.com"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Company Culture & Values */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="about">About Your Company *</Label>
                  <Textarea
                    id="about"
                    value={formData.about}
                    onChange={(e) => updateFormData("about", e.target.value)}
                    placeholder="Tell us about your company, what you do, and what makes you unique..."
                    className="min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="mission">Mission Statement *</Label>
                  <Textarea
                    id="mission"
                    value={formData.mission}
                    onChange={(e) => updateFormData("mission", e.target.value)}
                    placeholder="What is your company's mission and purpose?"
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label>Company Values</Label>
                  <p className="text-sm text-gray-600 mb-3">Select the values that best represent your company</p>
                  <div className="grid grid-cols-2 gap-2">
                    {availableValues.map((value) => (
                      <div key={value} className="flex items-center space-x-2">
                        <Checkbox
                          id={value}
                          checked={formData.values.includes(value)}
                          onCheckedChange={() => toggleArraySelection('values', value)}
                        />
                        <Label htmlFor={value} className="text-sm">{value}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="culture">Company Culture</Label>
                  <Textarea
                    id="culture"
                    value={formData.culture}
                    onChange={(e) => updateFormData("culture", e.target.value)}
                    placeholder="Describe your company culture and work environment..."
                    className="min-h-[80px]"
                  />
                </div>

                <div>
                  <Label htmlFor="diversityCommitment">Diversity & Inclusion</Label>
                  <Textarea
                    id="diversityCommitment"
                    value={formData.diversityCommitment}
                    onChange={(e) => updateFormData("diversityCommitment", e.target.value)}
                    placeholder="Share your commitment to diversity and inclusion..."
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Benefits & Perks */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <Label>Employee Benefits *</Label>
                  <p className="text-sm text-gray-600 mb-3">Select all benefits you offer to employees</p>
                  <div className="grid grid-cols-2 gap-2">
                    {availableBenefits.map((benefit) => (
                      <div key={benefit} className="flex items-center space-x-2">
                        <Checkbox
                          id={benefit}
                          checked={formData.benefits.includes(benefit)}
                          onCheckedChange={() => toggleArraySelection('benefits', benefit)}
                        />
                        <Label htmlFor={benefit} className="text-sm">{benefit}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="workEnvironment">Work Environment</Label>
                  <Textarea
                    id="workEnvironment"
                    value={formData.workEnvironment}
                    onChange={(e) => updateFormData("workEnvironment", e.target.value)}
                    placeholder="Describe your office environment, remote work policy, team dynamics..."
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Contact Details */}
            {step === 4 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="contactEmail">Contact Email *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => updateFormData("contactEmail", e.target.value)}
                    placeholder="hr@company.com"
                  />
                </div>

                <div>
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={formData.contactPhone}
                    onChange={(e) => updateFormData("contactPhone", e.target.value)}
                    placeholder="+44 20 1234 5678"
                  />
                </div>

                <div>
                  <Label htmlFor="linkedinPage">LinkedIn Company Page</Label>
                  <Input
                    id="linkedinPage"
                    value={formData.linkedinPage}
                    onChange={(e) => updateFormData("linkedinPage", e.target.value)}
                    placeholder="https://linkedin.com/company/your-company"
                  />
                </div>

                <div>
                  <Label htmlFor="glassdoorUrl">Glassdoor Profile</Label>
                  <Input
                    id="glassdoorUrl"
                    value={formData.glassdoorUrl}
                    onChange={(e) => updateFormData("glassdoorUrl", e.target.value)}
                    placeholder="https://glassdoor.com/Overview/Working-at-Company"
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Next Steps</h3>
                  <p className="text-sm text-blue-800">
                    After submitting your profile, our team will review it within 1-2 business days. 
                    Once approved, you'll be able to post jobs and access candidate profiles.
                  </p>
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
              
              {step < 4 ? (
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
                  disabled={!isStepValid() || createProfileMutation.isPending}
                >
                  {createProfileMutation.isPending ? "Creating Profile..." : "Submit for Review"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}