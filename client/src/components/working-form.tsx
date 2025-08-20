import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface EmployerData {
  companyName: string;
  companySize: string;
  industries: string[];
  otherIndustry: string;
  location: string;
  website: string;
  contactEmail: string;
  contactName: string;
  contactRole: string;
  contactPhone: string;
  companyDescription: string;
  whyPollen: string;
  hiringVolume: string;
  howDidYouHear: string;
  diversity: boolean;
  remote: boolean;
}

export default function WorkingForm() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<EmployerData>({
    companyName: "",
    companySize: "",
    industries: [],
    otherIndustry: "",
    location: "",
    website: "",
    contactEmail: "",
    contactName: "",
    contactRole: "",
    contactPhone: "",
    companyDescription: "",
    whyPollen: "",
    hiringVolume: "",
    howDidYouHear: "",
    diversity: false,
    remote: false
  });

  const updateField = (field: keyof EmployerData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const industryOptions = [
    "Technology & Software",
    "Finance & Banking", 
    "Healthcare & Medical",
    "Education & Training",
    "Marketing & Advertising",
    "Media & Creative",
    "Retail & E-commerce",
    "Consulting & Professional Services",
    "Manufacturing & Engineering",
    "Non-profit & Social Impact",
    "Government & Public Sector",
    "Hospitality & Tourism",
    "Construction & Real Estate",
    "Energy & Environment",
    "Transport & Logistics",
    "Food & Beverage",
    "Sports & Entertainment",
    "Legal Services",
    "Other"
  ];

  const handleIndustryToggle = (industry: string) => {
    const currentIndustries = formData.industries;
    if (currentIndustries.includes(industry)) {
      updateField('industries', currentIndustries.filter(i => i !== industry));
      // Clear other industry field if "Other" is deselected
      if (industry === "Other") {
        updateField('otherIndustry', '');
      }
    } else {
      updateField('industries', [...currentIndustries, industry]);
    }
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        const hasIndustries = formData.industries.length > 0;
        const hasOtherIndustrySpecified = !formData.industries.includes("Other") || formData.otherIndustry.trim().length > 0;
        return formData.companyName && formData.companySize && hasIndustries && hasOtherIndustrySpecified && formData.location && formData.website;
      case 2:
        return formData.contactEmail && formData.contactName && formData.contactRole;
      case 3:
        return formData.companyDescription && formData.whyPollen && formData.hiringVolume && formData.howDidYouHear;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    
    setIsSubmitting(true);
    try {
      // Prepare data for submission - replace "Other" with actual industry if specified
      const submissionData = { ...formData };
      if (formData.industries.includes("Other") && formData.otherIndustry.trim()) {
        submissionData.industries = formData.industries.map(industry => 
          industry === "Other" ? formData.otherIndustry.trim() : industry
        );
      }
      // Remove the otherIndustry field as it's not needed in the backend
      const { otherIndustry, ...dataToSubmit } = submissionData;
      
      await apiRequest("POST", "/api/employer-applications", dataToSubmit);
      setIsSubmitted(true);
      toast({
        title: "Application Submitted!",
        description: "We'll review your application and get back to you within 1 business day.",
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact support if the issue persists.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
            <p className="text-gray-600 mb-8">
              Thank you for your interest in joining Pollen. We'll review your application and get back to you within 1 business day.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Join Pollen as an Employer</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Step {currentStep} of 3</p>
            </div>
            <div className="flex space-x-1">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full ${
                    step <= currentStep ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Company Information</h3>
              <div>
                <label className="block text-sm font-medium mb-1">Company Name *</label>
                <Input
                  value={formData.companyName}
                  onChange={(e) => updateField('companyName', e.target.value)}
                  placeholder="Enter your company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Company Size *</label>
                <Select value={formData.companySize} onValueChange={(value) => updateField('companySize', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10 employees</SelectItem>
                    <SelectItem value="10-50">10-50 employees</SelectItem>
                    <SelectItem value="50-200">50-200 employees</SelectItem>
                    <SelectItem value="200-1000">200-1000 employees</SelectItem>
                    <SelectItem value="1000+">1000+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Industries * (Select all that apply)</label>
                <p className="text-xs text-gray-600 mb-3">This helps us match you with relevant candidates</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto border rounded-md p-3">
                  {industryOptions.map((industry) => (
                    <div key={industry} className="flex items-center space-x-2">
                      <Checkbox
                        id={industry}
                        checked={formData.industries.includes(industry)}
                        onCheckedChange={() => handleIndustryToggle(industry)}
                      />
                      <label 
                        htmlFor={industry} 
                        className="text-sm cursor-pointer flex-1"
                      >
                        {industry}
                      </label>
                    </div>
                  ))}
                </div>
                {formData.industries.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {formData.industries.map((industry) => (
                      <Badge key={industry} variant="secondary" className="text-xs">
                        {industry}
                      </Badge>
                    ))}
                  </div>
                )}
                {formData.industries.includes("Other") && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium mb-1">Please specify your industry</label>
                    <Input
                      value={formData.otherIndustry}
                      onChange={(e) => updateField('otherIndustry', e.target.value)}
                      placeholder="e.g., Renewable Energy, Biotechnology"
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location *</label>
                <Input
                  value={formData.location}
                  onChange={(e) => updateField('location', e.target.value)}
                  placeholder="e.g., London, UK"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Website *</label>
                <Input
                  value={formData.website}
                  onChange={(e) => updateField('website', e.target.value)}
                  placeholder="https://yourcompany.com"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              <div>
                <label className="block text-sm font-medium mb-1">Contact Email *</label>
                <Input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => updateField('contactEmail', e.target.value)}
                  placeholder="your.email@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contact Name *</label>
                <Input
                  value={formData.contactName}
                  onChange={(e) => updateField('contactName', e.target.value)}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Your Role *</label>
                <Input
                  value={formData.contactRole}
                  onChange={(e) => updateField('contactRole', e.target.value)}
                  placeholder="e.g., HR Manager, Founder, Recruiter"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contact Phone</label>
                <Input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => updateField('contactPhone', e.target.value)}
                  placeholder="+44 20 1234 5678"
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Additional Details</h3>
              <div>
                <label className="block text-sm font-medium mb-1">Company Description *</label>
                <Textarea
                  value={formData.companyDescription}
                  onChange={(e) => updateField('companyDescription', e.target.value)}
                  placeholder="Tell us about your company, mission, and culture..."
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Why Pollen? *</label>
                <Textarea
                  value={formData.whyPollen}
                  onChange={(e) => updateField('whyPollen', e.target.value)}
                  placeholder="Why are you interested in skills-based hiring and entry-level talent?"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Expected Hiring Volume for Entry-Level or Junior Positions *</label>
                <Select value={formData.hiringVolume} onValueChange={(value) => updateField('hiringVolume', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select expected hiring volume per year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-5">1-5 hires per year</SelectItem>
                    <SelectItem value="5-15">5-15 hires per year</SelectItem>
                    <SelectItem value="15-50">15-50 hires per year</SelectItem>
                    <SelectItem value="50+">50+ hires per year</SelectItem>
                    <SelectItem value="one-off">One-off / Infrequent hiring</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">How did you hear about us? *</label>
                <Select value={formData.howDidYouHear} onValueChange={(value) => updateField('howDidYouHear', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select how you heard about Pollen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="search-engine">Search engine</SelectItem>
                    <SelectItem value="news-article">In a news article / feature</SelectItem>
                    <SelectItem value="word-of-mouth">Word of mouth</SelectItem>
                    <SelectItem value="podcast">On a podcast / radio</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="pollen-team">Someone from the Pollen team</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            {currentStep < 3 ? (
              <Button 
                type="button" 
                onClick={nextStep}
                disabled={!validateStep(currentStep)}
              >
                Next
              </Button>
            ) : (
              <Button 
                type="button"
                disabled={isSubmitting || !validateStep(3)}
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleSubmit}
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}