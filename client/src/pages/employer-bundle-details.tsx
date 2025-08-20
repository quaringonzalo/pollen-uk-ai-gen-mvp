import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Check, ArrowRight, ChevronLeft, Calendar, Clock, 
  Users, Star, Target, Zap, Shield, CreditCard,
  Building2, MapPin, Briefcase, PoundSterling
} from "lucide-react";

interface BundleDetails {
  id: string;
  name: string;
  price: number;
  timeToFill: string;
  features: string[];
  deliverables: string[];
  timeline: Array<{
    week: string;
    activities: string[];
  }>;
}

export default function EmployerBundleDetails() {
  const [selectedBundle, setSelectedBundle] = useState<string | null>(null);
  const [jobDetails, setJobDetails] = useState({
    title: "",
    department: "",
    location: "",
    salary: "",
    description: "",
    urgency: "standard"
  });

  useEffect(() => {
    const bundle = localStorage.getItem('selectedBundle');
    setSelectedBundle(bundle);
  }, []);

  const bundleDetails: { [key: string]: BundleDetails } = {
    "quick-hire": {
      id: "quick-hire",
      name: "Quick Hire",
      price: 299,
      timeToFill: "7-14 days",
      features: [
        "Job posting on platform",
        "Standard candidate matching (Foundation challenges)",
        "Pre-screened candidates",
        "Streamlined interview scheduling",
        "Basic candidate feedback collection"
      ],
      deliverables: [
        "5-8 pre-screened candidate profiles",
        "Skills verification reports",
        "Interview scheduling coordination",
        "Basic feedback forms",
        "Hiring recommendation report"
      ],
      timeline: [
        {
          week: "Week 1",
          activities: [
            "Job posting goes live",
            "Foundation challenges deployed",
            "Initial candidate applications"
          ]
        },
        {
          week: "Week 2",
          activities: [
            "Candidate screening and verification",
            "Skills assessment completion",
            "Shortlist preparation and delivery"
          ]
        }
      ]
    },
    "smart-match": {
      id: "smart-match",
      name: "Smart Match",
      price: 499,
      timeToFill: "10-21 days",
      features: [
        "Job posting with enhanced visibility",
        "Bespoke candidate matching (Company-specific challenges)",
        "Detailed skills verification",
        "Behavioral compatibility scoring",
        "Comprehensive candidate profiles",
        "Interview guidance and feedback tools"
      ],
      deliverables: [
        "8-12 bespoke matched candidate profiles",
        "Comprehensive skills and behavioural assessments",
        "Values fit scoring reports",
        "Interview guide with tailored questions",
        "Detailed hiring recommendation with rationale"
      ],
      timeline: [
        {
          week: "Week 1-2",
          activities: [
            "Job posting optimisation and promotion",
            "Company-specific challenge development",
            "Enhanced candidate sourcing"
          ]
        },
        {
          week: "Week 2-3",
          activities: [
            "Bespoke challenge deployment",
            "Detailed candidate assessment",
            "Values compatibility analysis",
            "Shortlist curation and delivery"
          ]
        }
      ]
    },
    "hands-off": {
      id: "hands-off",
      name: "Hands-Off Hiring",
      price: 799,
      timeToFill: "14-28 days",
      features: [
        "Fully managed job posting and promotion",
        "Bespoke candidate matching with expert curation",
        "Complete candidate screening and interviews",
        "Detailed assessment reports",
        "Managed interview scheduling and coordination",
        "Dedicated hiring consultant",
        "Pollen insights session to strengthen company profile"
      ],
      deliverables: [
        "10-15 fully assessed candidate profiles",
        "Complete screening and initial interview reports",
        "Comprehensive assessment documentation",
        "Final interview coordination",
        "Hiring decision support and onboarding guidance",
        "Company profile optimisation report"
      ],
      timeline: [
        {
          week: "Week 1-2",
          activities: [
            "Hiring consultant assignment",
            "Job optimisation and strategy development",
            "Enhanced sourcing and promotion",
            "Company profile insights session"
          ]
        },
        {
          week: "Week 2-3",
          activities: [
            "Comprehensive candidate assessment",
            "Initial screening interviews",
            "Skills and behavioural analysis"
          ]
        },
        {
          week: "Week 3-4",
          activities: [
            "Final candidate curation",
            "Interview coordination",
            "Decision support and recommendations"
          ]
        }
      ]
    },
    "talent-pipeline": {
      id: "talent-pipeline",
      name: "Talent Pipeline",
      price: 1299,
      timeToFill: "Ongoing",
      features: [
        "Access to bootcamped candidate pool",
        "Quarterly talent pipeline reports",
        "Priority access to new graduates",
        "Custom skills development programmes",
        "Dedicated account management",
        "Advanced analytics and insights",
        "White-label candidate experience"
      ],
      deliverables: [
        "20+ bootcamped candidate pool access",
        "Quarterly talent pipeline reports",
        "Custom skills development roadmap",
        "Dedicated account manager assignment",
        "Advanced hiring analytics dashboard",
        "White-label recruitment portal"
      ],
      timeline: [
        {
          week: "Month 1",
          activities: [
            "Account manager assignment",
            "Custom skills programme development",
            "Talent pipeline setup",
            "Analytics dashboard configuration"
          ]
        },
        {
          week: "Ongoing",
          activities: [
            "Continuous candidate pool management",
            "Quarterly reporting and optimisation",
            "Priority access to new bootcamp graduates",
            "Regular strategy reviews"
          ]
        }
      ]
    }
  };

  const currentBundle = selectedBundle ? bundleDetails[selectedBundle] : null;

  const handleContinue = () => {
    if (currentBundle && jobDetails.title && jobDetails.description) {
      localStorage.setItem('jobDetails', JSON.stringify(jobDetails));
      window.location.href = '/employer-payment';
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "urgent":
        return <Badge className="bg-red-100 text-red-800">Urgent (Extra fee applies)</Badge>;
      case "standard":
        return <Badge className="bg-blue-100 text-blue-800">Standard</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Flexible</Badge>;
    }
  };

  if (!currentBundle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Bundle not found</h2>
          <Button onClick={() => window.location.href = '/employer-bundle-selection'}>
            Select a bundle
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => window.location.href = '/employer-bundle-selection'}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Bundle Details & Job Information</h1>
              <p className="text-gray-600">Provide details about your role and review what's included</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Step 3 of 4</span>
            <Progress value={75} className="flex-1 max-w-md" />
            <span className="text-sm text-gray-500">Job Details</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Job Details Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
                <p className="text-gray-600">Tell us about the role you're hiring for</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    value={jobDetails.title}
                    onChange={(e) => setJobDetails({...jobDetails, title: e.target.value})}
                    placeholder="e.g. Marketing Coordinator"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={jobDetails.department}
                      onChange={(e) => setJobDetails({...jobDetails, department: e.target.value})}
                      placeholder="e.g. Marketing"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={jobDetails.location}
                      onChange={(e) => setJobDetails({...jobDetails, location: e.target.value})}
                      placeholder="e.g. London, UK"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="salary">Salary Range</Label>
                  <Input
                    id="salary"
                    value={jobDetails.salary}
                    onChange={(e) => setJobDetails({...jobDetails, salary: e.target.value})}
                    placeholder="e.g. £25,000 - £30,000"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Job Description *</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={jobDetails.description}
                    onChange={(e) => setJobDetails({...jobDetails, description: e.target.value})}
                    placeholder="Describe the role, responsibilities, and what you're looking for..."
                  />
                </div>

                <div>
                  <Label>Urgency Level</Label>
                  <div className="flex gap-2 mt-2">
                    {[
                      { value: "flexible", label: "Flexible" },
                      { value: "standard", label: "Standard" },
                      { value: "urgent", label: "Urgent (+£100)" }
                    ].map((option) => (
                      <Button
                        key={option.value}
                        variant={jobDetails.urgency === option.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setJobDetails({...jobDetails, urgency: option.value})}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bundle Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    {currentBundle.id === 'quick-hire' && <Zap className="w-6 h-6 text-blue-600" />}
                    {currentBundle.id === 'smart-match' && <Target className="w-6 h-6 text-blue-600" />}
                    {currentBundle.id === 'hands-off' && <Shield className="w-6 h-6 text-blue-600" />}
                    {currentBundle.id === 'talent-pipeline' && <Users className="w-6 h-6 text-blue-600" />}
                  </div>
                  <div>
                    <CardTitle>{currentBundle.name}</CardTitle>
                    <p className="text-gray-600">£{currentBundle.price.toLocaleString()} per hire</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                    <div className="font-medium">{currentBundle.timeToFill}</div>
                    <div className="text-xs text-gray-600">Time to fill</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Users className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                    <div className="font-medium">{getUrgencyBadge(jobDetails.urgency)}</div>
                    <div className="text-xs text-gray-600">Priority level</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">What's included:</h4>
                  <div className="space-y-2">
                    {currentBundle.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">You'll receive:</h4>
                  <div className="space-y-2">
                    {currentBundle.deliverables.map((deliverable, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Star className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{deliverable}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentBundle.timeline.map((period, index) => (
                    <div key={index} className="relative">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                        </div>
                        <h4 className="font-semibold">{period.week}</h4>
                      </div>
                      <div className="ml-11 space-y-1">
                        {period.activities.map((activity, actIndex) => (
                          <div key={actIndex} className="text-sm text-gray-600">• {activity}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pricing Summary */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="font-semibold text-blue-900 mb-2">Total Cost</h3>
                  <div className="text-3xl font-bold text-blue-900">
                    £{(currentBundle.price + (jobDetails.urgency === 'urgent' ? 100 : 0)).toLocaleString()}
                  </div>
                  {jobDetails.urgency === 'urgent' && (
                    <div className="text-sm text-blue-700 mt-1">
                      Includes £100 urgency fee
                    </div>
                  )}
                  <div className="text-sm text-blue-700 mt-2">
                    Pay only when we deliver qualified candidates
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-8">
          <Button variant="outline" onClick={() => window.location.href = '/employer-bundle-selection'}>
            <ChevronLeft className="w-4 h-4 mr-2" />
            Change Bundle
          </Button>
          
          <Button 
            onClick={handleContinue}
            disabled={!jobDetails.title || !jobDetails.description}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Proceed to Payment
            <CreditCard className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}