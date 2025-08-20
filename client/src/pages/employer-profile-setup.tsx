import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import React from "react";
import { 
  Building2, Users, Globe, MapPin, Star, Heart, Award, Target,
  Upload, CheckCircle, ArrowRight, ArrowLeft, AlertTriangle,
  Briefcase, Camera, FileText, MessageSquare
} from "lucide-react";

interface CompanyProfileData {
  // Basic Information
  companyName: string;
  industry: string;
  companySize: string;
  location: string;
  website: string;
  foundedYear: string;
  
  // Company Profile
  about: string;
  mission: string;
  values: string[];
  culture: string;
  workEnvironment: string;
  diversityCommitment: string;
  
  // Benefits & Perks
  benefits: string[];
  perks: string[];
  additionalBenefits: string;
  additionalPerks: string;
  
  // Media & Branding
  logo: string;
  coverImage: string;
  companyPhotos: string[];
  
  // Contact & Social
  contactEmail: string;
  contactPhone: string;
  linkedinPage: string;
  glassdoorUrl: string;
  
  // Additional Info
  remotePolicy: string;
  workOptionsStatement: string;
  careersPage: string;
  techStack: string[];
  additionalGrowthOpportunities: string[];
}

const INDUSTRIES = [
  "Technology", "Healthcare", "Finance", "Education", "Retail", "Manufacturing",
  "Consulting", "Media & Entertainment", "Non-profit", "Government", "Energy",
  "Transportation", "Real Estate", "Food & Beverage", "Travel & Hospitality",
  "Marketing & Advertising", "Legal Services", "Architecture & Design"
];

const COMPANY_SIZES = [
  "1-10 employees", "11-50 employees", "51-200 employees", 
  "201-500 employees", "501-1000 employees", "1000+ employees"
];

const COMPANY_VALUES = [
  "Innovation", "Transparency", "Collaboration", "Excellence", "Inclusion",
  "Sustainability", "Customer Focus", "Communication", "Growth", "Work-Life Balance",
  "Impact", "Quality", "Adaptability", "Respect", "Accountability", "Creativity",
  "Empowerment", "Learning", "Community", "Results"
];

const BENEFITS_OPTIONS = [
  "Private Healthcare", "Dental Care", "Eye Care", "Life Insurance",
  "Pension Scheme", "Flexible Working Hours", "Remote Work Options", "Professional Development",
  "Training Budget", "Conference Attendance", "Gym Membership", "Mental Health Support",
  "Enhanced Maternity/Paternity Leave", "Sabbatical Leave", "Share Options", "Performance Bonuses",
  "Company Car", "Travel Allowance", "Lunch Vouchers", "Childcare Vouchers"
];

const PERKS_OPTIONS = [
  "Free Snacks & Drinks", "Catered Meals", "Team Events", "Office Games Room",
  "Casual Dress Code", "Pet-Friendly Office", "Flexible Holidays", "Birthday Off",
  "Company Retreats", "Tech Allowance", "Book Allowance", "Wellness Programmes",
  "Standing Desks", "Modern Office Space", "On-site Parking", "Bike Storage",
  "Employee Discounts", "Volunteer Time Off", "Recognition Programmes", "Mentorship Programmes"
];

const WORK_OPTIONS = [
  "Fully Remote",
  "Hybrid - In Office 1 day per week", 
  "Hybrid - In Office 2 days per week",
  "Hybrid - In Office 3 days per week",
  "Hybrid - Variable based on role",
  "Office-first with occasional remote",
  "Fully In-Office",
  "Flexible - Employee choice"
];

const ADDITIONAL_GROWTH_OPPORTUNITIES = [
  "Clear career progression paths",
  "Leadership development programmes", 
  "Cross-departmental experience opportunities",
  "Regular skills assessments and feedback",
  "External training and certification support",
  "Mentorship and coaching programmes",
  "Project ownership and responsibility growth",
  "Industry conference and networking events",
  "Internal mobility and role rotation",
  "Professional qualification sponsorship"
];

export default function EmployerProfileSetup() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [valuesInputMethod, setValuesInputMethod] = useState<'custom' | 'select'>('select');
  const [customValuesText, setCustomValuesText] = useState('');
  const [workOptionSelected, setWorkOptionSelected] = useState('');
  const [additionalBenefitsText, setAdditionalBenefitsText] = useState('');
  const [additionalPerksText, setAdditionalPerksText] = useState('');
  const [formData, setFormData] = useState<CompanyProfileData>({
    companyName: "",
    industry: "",
    companySize: "",
    location: "",
    website: "",
    foundedYear: "",
    about: "",
    mission: "",
    values: [],
    culture: "",
    workEnvironment: "",
    diversityCommitment: "",
    benefits: [],
    perks: [],
    logo: "",
    coverImage: "",
    companyPhotos: [],
    contactEmail: "",
    contactPhone: "",
    linkedinPage: "",
    glassdoorUrl: "",
    remotePolicy: "",
    workOptionsStatement: "",
    additionalBenefits: "",
    additionalPerks: "",
    careersPage: "",
    techStack: [],
    additionalGrowthOpportunities: []
  });

  const totalSteps = 4;

  // Get employer application data to pre-populate basic info
  const { data: employerApplication } = useQuery({
    queryKey: ["/api/employer-application/current"],
  });

  // Pre-populate form data from application if available
  React.useEffect(() => {
    if (employerApplication && typeof employerApplication === 'object') {
      setFormData(prev => ({
        ...prev,
        companyName: (employerApplication as any).companyName || prev.companyName,
        industry: (employerApplication as any).industry || prev.industry,
        companySize: (employerApplication as any).companySize || prev.companySize,
        website: (employerApplication as any).website || prev.website,
        contactEmail: (employerApplication as any).contactEmail || prev.contactEmail,
        location: (employerApplication as any).location || prev.location,
        about: (employerApplication as any).companyDescription || prev.about,
      }));
    }
  }, [employerApplication]);

  // File upload mutations
  const uploadLogoMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('logo', file);
      
      const response = await fetch('/api/upload/company-logo', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setFormData(prev => ({ ...prev, logo: data.url }));
        toast({
          title: "Logo uploaded successfully",
          description: "Your company logo has been uploaded.",
        });
      }
    },
    onError: () => {
      toast({
        title: "Upload failed",
        description: "Please try again with a different image.",
        variant: "destructive",
      });
    },
  });

  const uploadCoverMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('coverImage', file);
      
      const response = await fetch('/api/upload/cover-image', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setFormData(prev => ({ ...prev, coverImage: data.url }));
        toast({
          title: "Cover image uploaded successfully",
          description: "Your company cover image has been uploaded.",
        });
      }
    },
    onError: () => {
      toast({
        title: "Upload failed",
        description: "Please try again with a different image.",
        variant: "destructive",
      });
    },
  });

  // Save profile mutation for drafts
  const saveProfileMutation = useMutation({
    mutationFn: async (data: { profileData: CompanyProfileData; step: number; isComplete: boolean }) => {
      return apiRequest("POST", "/api/employer-profile/save", data);
    },
    onSuccess: () => {
      toast({
        title: "Profile Saved",
        description: "Your progress has been saved successfully"
      });
    },
    onError: () => {
      toast({
        title: "Save Failed",
        description: "Failed to save your progress. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Submit profile mutation
  const submitProfileMutation = useMutation({
    mutationFn: async (data: CompanyProfileData) => {
      return await apiRequest("POST", "/api/employer-profile", data);
    },
    onSuccess: () => {
      toast({
        title: "Profile Created Successfully!",
        description: "Redirecting to profile enhancements...",
      });
      setIsCompleted(true);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    uploadLogoMutation.mutate(file);
  };

  const handleCoverUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    uploadCoverMutation.mutate(file);
  };

  const handleSaveAndExit = () => {
    saveProfileMutation.mutate({
      profileData: formData,
      step: currentStep,
      isComplete: false
    });
    setTimeout(() => {
      setLocation("/employer-profile");
    }, 1000);
  };

  const handleSubmit = () => {
    // Add userId to formData (demo user ID is 1)
    const profileData = {
      ...formData,
      userId: 1
    };
    submitProfileMutation.mutate(profileData);
  };

  const handleValueToggle = (value: string) => {
    if (formData.values.length >= 5 && !formData.values.includes(value)) {
      toast({
        title: "Maximum values reached",
        description: "You can select up to 5 values maximum.",
        variant: "destructive",
      });
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      values: prev.values.includes(value)
        ? prev.values.filter(v => v !== value)
        : [...prev.values, value]
    }));
  };

  const handleCustomValuesSubmit = () => {
    if (!customValuesText.trim()) {
      toast({
        title: "Values required",
        description: "Please enter your company values.",
        variant: "destructive",
      });
      return;
    }

    // Split by comma, semicolon, or newline and clean up
    const customValues = customValuesText
      .split(/[,;\n]/)
      .map(value => value.trim())
      .filter(value => value.length > 0)
      .slice(0, 5); // Limit to 5 values

    setFormData(prev => ({
      ...prev,
      values: customValues
    }));

    toast({
      title: "Values saved",
      description: `Added ${customValues.length} company values.`,
    });
  };

  const handleBenefitToggle = (benefit: string) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.includes(benefit)
        ? prev.benefits.filter(b => b !== benefit)
        : [...prev.benefits, benefit]
    }));
  };

  const handlePerkToggle = (perk: string) => {
    setFormData(prev => ({
      ...prev,
      perks: prev.perks.includes(perk)
        ? prev.perks.filter(p => p !== perk)
        : [...prev.perks, perk]
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <FileText className="w-12 h-12 text-pink-600 mx-auto" />
              <h2 className="text-2xl font-bold">Company Story</h2>
              <p className="text-gray-600">Tell job seekers about your company's mission and culture</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="about">About Your Company *</Label>
                <p className="text-sm text-gray-600 mb-2">
                  Explain what your company does in simple terms that anyone can understand. Avoid jargon and focus on the real impact you make.
                </p>
                <Textarea
                  id="about"
                  value={formData.about}
                  onChange={(e) => setFormData(prev => ({ ...prev, about: e.target.value }))}
                  placeholder="Example: 'We create mobile apps that help small restaurants manage their orders and connect with customers. Think of us like the digital backbone for local food businesses - we handle the tech so they can focus on cooking great food and serving their community...'"
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tip: Start with what you do, then explain why it matters and who it helps.
                </p>
              </div>

              <div>
                <Label htmlFor="mission">Mission Statement</Label>
                <Textarea
                  id="mission"
                  value={formData.mission}
                  onChange={(e) => setFormData(prev => ({ ...prev, mission: e.target.value }))}
                  placeholder="What is your company's mission and purpose?"
                  rows={3}
                />
              </div>

              <div>
                <Label>Company Values (up to 5)</Label>
                <p className="text-sm text-gray-600 mb-4">
                  Do you already have established company values, or would you like to select from our options?
                </p>
                
                <div className="flex gap-4 mb-4">
                  <Button
                    type="button"
                    variant={valuesInputMethod === 'custom' ? 'default' : 'outline'}
                    onClick={() => {
                      setValuesInputMethod('custom');
                      if (valuesInputMethod === 'select') {
                        setFormData(prev => ({ ...prev, values: [] }));
                      }
                    }}
                    className="flex-1"
                  >
                    I have my own values
                  </Button>
                  <Button
                    type="button"
                    variant={valuesInputMethod === 'select' ? 'default' : 'outline'}
                    onClick={() => {
                      setValuesInputMethod('select');
                      if (valuesInputMethod === 'custom') {
                        setFormData(prev => ({ ...prev, values: [] }));
                        setCustomValuesText('');
                      }
                    }}
                    className="flex-1"
                  >
                    Select from options
                  </Button>
                </div>

                {valuesInputMethod === 'custom' ? (
                  <div className="space-y-3">
                    <Textarea
                      value={customValuesText}
                      onChange={(e) => setCustomValuesText(e.target.value)}
                      placeholder="Enter your company values, separated by commas or on new lines&#10;Example:&#10;Authentic relationships&#10;Bold decision-making&#10;Creative problem-solving&#10;Meaningful impact&#10;Continuous growth"
                      rows={5}
                      className="w-full"
                    />
                    <Button
                      type="button"
                      onClick={handleCustomValuesSubmit}
                      className="w-full"
                    >
                      Save My Values
                    </Button>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600 mb-3">
                      Select up to 5 values that best represent your company ({formData.values.length}/5 selected)
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {COMPANY_VALUES.map((value) => (
                        <div key={value} className="flex items-center space-x-2">
                          <Checkbox
                            id={value}
                            checked={formData.values.includes(value)}
                            onCheckedChange={() => handleValueToggle(value)}
                            disabled={formData.values.length >= 5 && !formData.values.includes(value)}
                          />
                          <Label 
                            htmlFor={value} 
                            className={`text-sm ${formData.values.length >= 5 && !formData.values.includes(value) ? 'text-gray-400' : ''}`}
                          >
                            {value}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Show selected values */}
                {formData.values.length > 0 && (
                  <div className="mt-4 p-3 bg-pink-50 rounded-lg">
                    <Label className="text-sm font-medium text-pink-900">Selected Values:</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.values.map((value, index) => (
                        <Badge key={index} variant="secondary" className="bg-pink-100 text-pink-800">
                          {value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="culture">Company Culture *</Label>
                <Textarea
                  id="culture"
                  value={formData.culture}
                  onChange={(e) => setFormData(prev => ({ ...prev, culture: e.target.value }))}
                  placeholder="Describe your company culture, team dynamics, and work atmosphere..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="diversityCommitment">Diversity & Inclusion</Label>
                <Textarea
                  id="diversityCommitment"
                  value={formData.diversityCommitment}
                  onChange={(e) => setFormData(prev => ({ ...prev, diversityCommitment: e.target.value }))}
                  placeholder="Describe your commitment to diversity, equity, and inclusion..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Award className="w-12 h-12 text-pink-600 mx-auto" />
              <h2 className="text-2xl font-bold">Benefits & Perks</h2>
              <p className="text-gray-600">Showcase what makes working at your company attractive</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label>Work Options *</Label>
                <p className="text-sm text-gray-600 mb-3">Select your work arrangement policy</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setWorkOptionSelected('office');
                      setFormData(prev => ({ ...prev, workOptionsStatement: 'Fully In-Office' }));
                    }}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      workOptionSelected === 'office' 
                        ? 'border-pink-500 bg-pink-50 text-pink-900' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">In-Office / On-Site</div>
                    <div className="text-sm text-gray-600">Full-time office based</div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setWorkOptionSelected('hybrid');
                      setFormData(prev => ({ ...prev, workOptionsStatement: '' }));
                    }}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      workOptionSelected === 'hybrid' 
                        ? 'border-pink-500 bg-pink-50 text-pink-900' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">Hybrid</div>
                    <div className="text-sm text-gray-600">Mix of office and remote</div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setWorkOptionSelected('remote');
                      setFormData(prev => ({ ...prev, workOptionsStatement: 'Fully Remote' }));
                    }}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      workOptionSelected === 'remote' 
                        ? 'border-pink-500 bg-pink-50 text-pink-900' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">Remote</div>
                    <div className="text-sm text-gray-600">Fully remote work</div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setWorkOptionSelected('varies');
                      setFormData(prev => ({ ...prev, workOptionsStatement: 'Varies by role' }));
                    }}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      workOptionSelected === 'varies' 
                        ? 'border-pink-500 bg-pink-50 text-pink-900' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">Varies by Role</div>
                    <div className="text-sm text-gray-600">Different per position</div>
                  </button>
                </div>
                
                {workOptionSelected === 'hybrid' && (
                  <div className="mt-4">
                    <Label htmlFor="hybridDetails">Hybrid Work Details *</Label>
                    <Textarea
                      id="hybridDetails"
                      value={formData.workOptionsStatement}
                      onChange={(e) => setFormData(prev => ({ ...prev, workOptionsStatement: e.target.value }))}
                      placeholder="Example: In office 3 days per week (Tuesday, Wednesday, Thursday), remote on Monday and Friday. Core collaboration hours 10am-3pm when in office."
                      rows={3}
                      className="mt-2"
                    />

                  </div>
                )}
              </div>

              <div>
                <Label>Employee Benefits (Select all that apply)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 max-h-60 overflow-y-auto">
                  {BENEFITS_OPTIONS.map((benefit) => (
                    <div key={benefit} className="flex items-center space-x-2">
                      <Checkbox
                        id={benefit}
                        checked={formData.benefits.includes(benefit)}
                        onCheckedChange={() => handleBenefitToggle(benefit)}
                      />
                      <Label htmlFor={benefit} className="text-sm">{benefit}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Additional Perks (Select all that apply)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 max-h-60 overflow-y-auto">
                  {PERKS_OPTIONS.map((perk) => (
                    <div key={perk} className="flex items-center space-x-2">
                      <Checkbox
                        id={perk}
                        checked={formData.perks.includes(perk)}
                        onCheckedChange={() => handlePerkToggle(perk)}
                      />
                      <Label htmlFor={perk} className="text-sm">{perk}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="additionalBenefits">Additional Company Benefits or Perks</Label>
                <Textarea
                  id="additionalBenefits"
                  value={formData.additionalBenefits}
                  onChange={(e) => setFormData(prev => ({ ...prev, additionalBenefits: e.target.value }))}
                  placeholder="List any other benefits, perks, or unique offerings not covered above - such as company-specific programmes, wellness initiatives, flexible arrangements, professional development opportunities, or cultural benefits..."
                  rows={4}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Camera className="w-12 h-12 text-pink-600 mx-auto" />
              <h2 className="text-2xl font-bold">Visual Identity</h2>
              <p className="text-gray-600">Add your company branding and visual elements</p>
            </div>

            <div className="space-y-6">

              <div>
                <Label htmlFor="logo">Company Logo</Label>
                <div className="mt-2">
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={uploadLogoMutation.isPending}
                    className="w-full h-24 border-dashed border-2 border-gray-300 hover:border-pink-400"
                  >
                    <div className="text-center">
                      <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                      <div className="text-sm">
                        {uploadLogoMutation.isPending 
                          ? "Uploading logo..." 
                          : "Click to upload company logo"
                        }
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        PNG, JPG (Max 5MB)
                      </div>
                    </div>
                  </Button>
                </div>
                {formData.logo && (
                  <div className="mt-3">
                    <Label>Logo Preview</Label>
                    <div className="mt-2 border rounded-lg overflow-hidden bg-gray-50 p-4">
                      <img 
                        src={formData.logo} 
                        alt="Company logo"
                        className="h-16 object-contain mx-auto"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="coverImage">Cover Image</Label>
                <div className="mt-2">
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => coverInputRef.current?.click()}
                    disabled={uploadCoverMutation.isPending}
                    className="w-full h-32 border-dashed border-2 border-gray-300 hover:border-pink-400"
                  >
                    <div className="text-center">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <div className="text-sm">
                        {uploadCoverMutation.isPending 
                          ? "Uploading cover image..." 
                          : "Click to upload cover image"
                        }
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Recommended: 1200x400px (Max 5MB)
                      </div>
                    </div>
                  </Button>
                </div>
                {formData.coverImage && (
                  <div className="mt-3">
                    <Label>Cover Image Preview</Label>
                    <div className="mt-2 border rounded-lg overflow-hidden">
                      <img 
                        src={formData.coverImage} 
                        alt="Cover image"
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>


            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <Globe className="w-12 h-12 text-pink-600 mx-auto" />
              <h2 className="text-2xl font-bold">Social & Additional Info</h2>
              <p className="text-gray-600">Add your social media links and additional company information</p>
            </div>



            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="foundedYear">Year Founded *</Label>
                <Input
                  id="foundedYear"
                  value={formData.foundedYear}
                  onChange={(e) => setFormData(prev => ({ ...prev, foundedYear: e.target.value }))}
                  placeholder="2018"
                  type="number"
                  min="1800"
                  max={new Date().getFullYear()}
                />
                <p className="text-sm text-gray-500 mt-1">
                  When was your company established?
                </p>
              </div>



              <div>
                <Label htmlFor="linkedinPage">LinkedIn Company Page</Label>
                <Input
                  id="linkedinPage"
                  value={formData.linkedinPage}
                  onChange={(e) => setFormData(prev => ({ ...prev, linkedinPage: e.target.value }))}
                  placeholder="https://linkedin.com/company/yourcompany"
                />
              </div>

              <div>
                <Label htmlFor="glassdoorUrl">Glassdoor URL</Label>
                <Input
                  id="glassdoorUrl"
                  value={formData.glassdoorUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, glassdoorUrl: e.target.value }))}
                  placeholder="https://glassdoor.com/Overview/Working-at-YourCompany"
                />
              </div>

              <div>
                <Label htmlFor="careersPage">Careers Page</Label>
                <Input
                  id="careersPage"
                  value={formData.careersPage}
                  onChange={(e) => setFormData(prev => ({ ...prev, careersPage: e.target.value }))}
                  placeholder="https://yourcompany.com/careers"
                />
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-900">Almost Done!</h3>
                  <p className="text-sm text-green-800 mt-1">
                    After submitting your profile, our team will review and if necessary suggest changes to enhance your profile further.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Show completion screen if profile is submitted
  if (isCompleted) {
    // Extended redirect timing for better readability
    setTimeout(() => {
      setLocation("/employer-profile");
    }, 6000);
    
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900">Profile Complete!</h2>
            </div>
            <Button variant="outline" onClick={() => {
              setLocation("/employer-profile");
            }}>
              <ArrowRight className="w-4 h-4 mr-2" />
              View Profile
            </Button>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Hold tight while we set up your profile</h1>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <div className="animate-spin w-4 h-4 border-2 border-pink-600 border-t-transparent rounded-full"></div>
              Taking you to your profile page...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-900">Company Profile Setup</h2>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setLocation("/employer-dashboard")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <Button variant="outline" onClick={handleSaveAndExit} disabled={saveProfileMutation.isPending}>
              {saveProfileMutation.isPending ? "Saving..." : "Save & Exit"}
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Company Profile</h1>
          <p className="text-gray-600">
            Create an engaging profile that showcases your company to potential candidates
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm font-medium text-gray-600">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-pink-600 h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Content */}
        <Card>
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button onClick={handleNext} className="bg-pink-600 hover:bg-pink-700">
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={submitProfileMutation.isPending}
              className="bg-pink-600 hover:bg-pink-700"
            >
              {submitProfileMutation.isPending ? "Creating Profile..." : "Complete Profile"}
              <CheckCircle className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}