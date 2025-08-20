import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { 
  Building2, MapPin, Users, Globe, Star, Award, Heart,
  PoundSterling, Calendar, Clock, Shield, Zap, Target,
  ChevronLeft, ExternalLink, Briefcase, TrendingUp, MessageSquare, ArrowLeft
} from "lucide-react";

interface CompanyProfile {
  id: string;
  name: string;
  logo: string;
  tagline: string;
  description: string;
  industry: string;
  size: string;
  location: string;
  website: string;
  founded: string;
  candidateExperience: {
    feedbackQuality: number;
    communicationSpeed: number;
    interviewExperience: number;
    processTransparency: number;
    overallExperience: number;
  };
  values: string[];
  mission: string;
  vision: string;
  benefits: string[];
  accolades: string[];
  workEnvironment: {
    remote: boolean;
    hybrid: boolean;
    inOffice: boolean;
    flexible: boolean;
  };
  diversity: {
    score: number;
    initiatives: string[];
  };
  careers: {
    growthOpportunities: string[];
    learningProgrammes: string[];
    mentorship: boolean;
  };
  socialImpact?: {
    initiatives: string[];
    volunteerHours: number;
    sustainabilityScore: number;
  };
  pollenInsights: {
    companyStatement: string;
    pollenObservations: string[];
    totalJobsPosted: number;
    monthsOnPlatform: number;
    avgTimeToHire: number;
    badges: Array<{
      name: string;
      description: string;
      colour: string;
    }>;
  };
  candidateTestimonials: Array<{
    name: string;
    role: string;
    quote: string;
    experienceType: "interview" | "feedback" | "process";
    timeframe: string;
  }>;
  openRoles: Array<{
    id: string;
    title: string;
    department: string;
    location: string;
    type: string;
    matchScore?: number;
  }>;
}

export default function CompanyProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [match, params] = useRoute("/company-profile/:id");
  const [, setLocation] = useLocation();
  
  // Fetch employer profile data from database
  const { data: profile, isLoading } = useQuery({
    queryKey: [`/api/employer-profiles/${params?.id}`],
    enabled: !!params?.id,
  });

  // If specific ID is requested but not found, try to get the current/demo profile
  const { data: fallbackProfile } = useQuery({
    queryKey: ['/api/employer-profile/current'],
    enabled: !profile && !isLoading,
  });

  // Fetch user applications to track which jobs they've applied to
  const { data: userApplications } = useQuery({
    queryKey: ['/api/user-applications'],
  });

  // Fetch user profile for behavioural and practical matching
  const { data: userProfile } = useQuery({
    queryKey: ['/api/user-profile'],
  });

  const currentProfile = profile || fallbackProfile;

  // Create a set of applied job IDs for quick lookup
  const appliedJobIds = new Set(
    userApplications?.map((app: any) => app.jobId) || []
  );

  // Function to determine if a job should be recommended based on user profile
  const isJobRecommended = (role: any, userProfile: any) => {
    if (!userProfile) return false;

    // Practical filters (must pass all)
    const practicalMatch = {
      location: true, // Simplified for demo - would check location preferences
      workType: true, // Would check remote/hybrid/office preferences
      employment: true, // Would check full-time/part-time preferences
    };

    // Behavioral compatibility based on DISC profile and role requirements
    const behaviouralMatch = calculateBehavioralMatch(role, userProfile);
    
    // Interest alignment based on career interests and role department
    const interestMatch = calculateInterestMatch(role, userProfile);

    // Combined score (simplified matching algorithm)
    const overallScore = (behaviouralMatch * 0.6) + (interestMatch * 0.4);

    // Recommend if passes practical filters and has good compatibility (≥75%)
    return Object.values(practicalMatch).every(Boolean) && overallScore >= 0.75;
  };

  // Simplified behavioural matching based on role type and user DISC profile
  const calculateBehavioralMatch = (role: any, userProfile: any) => {
    if (!userProfile.discProfile) return 0.5; // Default neutral score

    const { red, yellow, green, blue } = userProfile.discProfile;
    
    // Role-specific behavioural preferences (simplified)
    const rolePreferences = {
      'Junior Media Planner': { red: 0.3, yellow: 0.4, green: 0.2, blue: 0.1 }, // Communication-focused
      'Account Coordinator': { red: 0.2, yellow: 0.4, green: 0.3, blue: 0.1 }, // Relationship-focused
      'Creative Assistant': { red: 0.1, yellow: 0.2, green: 0.2, blue: 0.5 }, // Detail-oriented
      'Junior Data Analyst': { red: 0.1, yellow: 0.1, green: 0.2, blue: 0.6 }, // Analytical
    };

    const rolePrefs = rolePreferences[role.title] || { red: 0.25, yellow: 0.25, green: 0.25, blue: 0.25 };
    
    // Calculate similarity score (simplified)
    const similarity = 1 - (
      Math.abs(red/100 - rolePrefs.red) +
      Math.abs(yellow/100 - rolePrefs.yellow) +
      Math.abs(green/100 - rolePrefs.green) +
      Math.abs(blue/100 - rolePrefs.blue)
    ) / 4;

    return Math.max(0, Math.min(1, similarity));
  };

  // Interest matching based on career interests and role department
  const calculateInterestMatch = (role: any, userProfile: any) => {
    if (!userProfile.careerInterests) return 0.5; // Default neutral score

    const interests = userProfile.careerInterests;
    
    // Department-interest mapping
    const departmentInterests = {
      'Media': ['marketing', 'advertising', 'communications', 'digital media'],
      'Account Management': ['client relations', 'business development', 'communications', 'project management'],
      'Creative': ['design', 'creative', 'content creation', 'marketing'],
      'Analytics': ['data analysis', 'research', 'technology', 'problem solving'],
    };

    const relevantInterests = departmentInterests[role.department] || [];
    
    // Check if user's interests align with role department
    const matchingInterests = relevantInterests.filter(interest => 
      interests.some((userInterest: string) => 
        userInterest.toLowerCase().includes(interest.toLowerCase())
      )
    );

    return matchingInterests.length / relevantInterests.length;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Company Not Found</h2>
          <p className="text-gray-600">The requested company profile could not be found.</p>
          <Button 
            onClick={() => window.location.href = '/companies'}
            className="mt-4"
          >
            Browse Companies
          </Button>
        </div>
      </div>
    );
  }

  // Transform database profile to component format
  const company: CompanyProfile = {
    id: currentProfile.id.toString(),
    name: currentProfile.companyName,
    logo: currentProfile.logo || "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&h=100&fit=crop&crop=centre",
    tagline: "Forward-thinking technology consultancy",
    description: currentProfile.about || currentProfile.companyDescription || "Technology consultancy specialising in digital transformation and innovative solutions.",
    industry: currentProfile.industry || "Technology",
    size: currentProfile.companySize || "50-200 employees",
    location: currentProfile.location || "London, UK",
    website: currentProfile.website || "https://techflowsolutions.co.uk",
    founded: currentProfile.foundedYear || "2018",
    candidateExperience: {
      feedbackQuality: parseFloat(currentProfile.feedbackQualityRating) || 4.8,
      communicationSpeed: parseFloat(currentProfile.communicationSpeedRating) || 4.9,
      interviewExperience: parseFloat(currentProfile.interviewExperienceRating) || 4.7,
      processTransparency: parseFloat(currentProfile.processTransparencyRating) || 4.6,
      overallExperience: parseFloat(currentProfile.overallRating) || 4.7
    },
    values: currentProfile.values || ["Innovation", "Collaboration", "Growth", "Integrity"],
    mission: currentProfile.mission || "To democratize technology access for businesses of all sizes.",
    vision: "A world where every business has the technological foundation to thrive in the digital age.",
    benefits: currentProfile.benefits || [
      "Private Healthcare",
      "Pension Scheme",
      "Flexible Working Hours",
      "Professional Development",
      "25 Days Holiday",
      "Mental Health Support",
      "Learning Budget",
      "Hybrid Working"
    ],
    accolades: [
      "Best Tech Employer 2023 - Tech Awards",
      "Top 50 Remote Companies - Remote Work Hub",
      "Innovation Excellence Award 2023",
      "Certified B-Corporation",
      "Great Place to Work Certified"
    ],
    workEnvironment: {
      remote: true,
      hybrid: true,
      inOffice: false,
      flexible: true
    },
    diversity: {
      score: 87,
      initiatives: [
        "Inclusive hiring practices",
        "Diversity & inclusion training", 
        "Employee resource groups",
        "Pay equity audits",
        "Mentorship programmes"
      ]
    },
    careers: {
      growthOpportunities: [
        "Clear career progression paths",
        "Leadership development programmes",
        "Cross-functional project opportunities",
        "Conference speaking opportunities"
      ],
      learningProgrammes: [
        "Annual learning budget",
        "Internal tech talks",
        "Mentorship programme",
        "External training courses"
      ],
      mentorship: true
    },
    socialImpact: {
      initiatives: [
        "Pro-bono work for nonprofits",
        "Environmental sustainability programmes", 
        "Community coding workshops",
        "Charity fundraising events"
      ],
      volunteerHours: 1200,
      sustainabilityScore: 78
    },
    pollenInsights: {
      companyStatement: "At CreativeMinds, we believe that great work comes from happy, supported people. We're not just a creative agency - we're a launching pad for careers. Every new hire gets a dedicated mentor, a clear development path, and real responsibility from day one. We've built our culture around learning, collaboration, and giving everyone the tools they need to do their best work. What makes us different? We actually mean it when we say we invest in people.",
      pollenObservations: [
        "Consistently provides detailed, constructive feedback to all candidates - even those not hired",
        "Has mentorship programmes specifically designed for entry-level hires",
        "Interview process focuses on potential and problem-solving rather than just experience",
        "Strong commitment to skills development with dedicated training budgets",
        "Transparent about career progression paths and salary ranges"
      ],
      totalJobsPosted: 23,
      monthsOnPlatform: 8,
      avgTimeToHire: 12,
      badges: [
        {
          name: "Star Employer",
          description: "Consistently high candidate satisfaction ratings",
          colour: "gold"
        },
        {
          name: "Quick Responder", 
          description: "Responds to applications within 48 hours",
          colour: "green"
        },
        {
          name: "Active Hirer",
          description: "Posted 20+ entry-level positions this year",
          colour: "blue"
        }
      ]
    },
    candidateTestimonials: [
      {
        name: "Sarah Chen",
        role: "Applied for Media Planner",
        quote: "The interview process was incredibly well-structured. They gave me a realistic brief to work on and provided detailed feedback on my approach. Even though I didn't get the role, I learned so much from their feedback.",
        experienceType: "feedback",
        timeframe: "2 weeks ago"
      },
      {
        name: "Marcus Johnson", 
        role: "Applied for Account Coordinator",
        quote: "From application to final decision took exactly 10 days as promised. They kept me informed at every step and were transparent about their process. Very professional experience overall.",
        experienceType: "process",
        timeframe: "1 month ago"
      },
      {
        name: "Elena Rodriguez",
        role: "Applied for Creative Assistant",
        quote: "The interview felt more like a collaborative discussion than an interrogation. They really wanted to understand my potential, not just my current experience. Great questions about problem-solving.",
        experienceType: "interview",
        timeframe: "3 weeks ago"
      }
    ],
    openRoles: [
      {
        id: "junior-media-001",
        title: "Junior Media Planner",
        department: "Media",
        location: "London (Hybrid)",
        type: "Full-time",
        matchScore: 91
      },
      {
        id: "account-coord-001", 
        title: "Account Coordinator",
        department: "Account Management",
        location: "London (Hybrid)",
        type: "Full-time",
        matchScore: 85
      },
      {
        id: "creative-assist-001",
        title: "Creative Assistant",
        department: "Creative",
        location: "London (In-office)",
        type: "Full-time",
        matchScore: 82
      },
      {
        id: "data-analyst-001",
        title: "Junior Data Analyst",
        department: "Analytics",
        location: "Remote",
        type: "Full-time",
        matchScore: 76
      }
    ]
  };

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(i => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium">{rating}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button variant="ghost" onClick={() => window.history.back()}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Companies
            </Button>
            <Button variant="outline" size="sm">
              <Heart className="w-4 h-4 mr-2" />
              Save Company
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Company Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-start gap-6">
              <img
                src={company.logo}
                alt={`${company.name} logo`}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{company.name}</h1>
                    <p className="text-lg text-gray-600 mb-4">{company.tagline}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {company.industry}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {company.size}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {company.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Founded {company.founded}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {renderStarRating(company.candidateExperience.overallExperience)}
                      <span className="text-sm text-gray-500">
                        Candidate Experience Rating
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                      {company.pollenInsights.badges.map((badge, index) => (
                        <Badge
                          key={index}
                          className={`${
                            badge.colour === 'gold' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                            badge.colour === 'green' ? 'bg-green-100 text-green-800 border-green-300' :
                            'bg-blue-100 text-blue-800 border-blue-300'
                          }`}
                        >
                          {badge.name}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit Website
                      </Button>
                      <Button variant="outline" onClick={() => setActiveTab('jobs')}>
                        View All Jobs ({company.openRoles.length})
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sliding Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {[
              { id: "overview", label: "Overview" },
              { id: "culture", label: "Values" },
              { id: "pollen", label: "Pollen Insights" },
              { id: "benefits", label: "Benefits" },
              { id: "careers", label: "Entry-Level" },
              { id: "reviews", label: "Feedback" },
              { id: "jobs", label: "Open Roles" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-white text-pink-600 shadow-sm border-2 border-pink-200 font-semibold"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* About */}
                <Card>
                  <CardHeader>
                    <CardTitle>About {company.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">{company.description}</p>
                  </CardContent>
                </Card>

                {/* Mission & Vision */}
                <Card>
                  <CardHeader>
                    <CardTitle>Mission & Vision</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Mission</h4>
                      <p className="text-gray-600">{company.mission}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Vision</h4>
                      <p className="text-gray-600">{company.vision}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Values */}
                <Card>
                  <CardHeader>
                    <CardTitle>Core Values</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {company.values.map(value => (
                        <Badge key={value} variant="secondary" className="px-3 py-1">
                          {value}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      Candidate Experience
                    </CardTitle>
                    <p className="text-sm text-gray-600">Based on feedback from recent applicants</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Feedback Quality</span>
                        <div className="flex items-center gap-2">
                          <Progress value={company.candidateExperience.feedbackQuality * 20} className="w-20" />
                          <span className="text-sm font-medium">{company.candidateExperience.feedbackQuality}/5</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Communication Speed</span>
                        <div className="flex items-center gap-2">
                          <Progress value={company.candidateExperience.communicationSpeed * 20} className="w-20" />
                          <span className="text-sm font-medium">{company.candidateExperience.communicationSpeed}/5</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Interview Experience</span>
                        <div className="flex items-center gap-2">
                          <Progress value={company.candidateExperience.interviewExperience * 20} className="w-20" />
                          <span className="text-sm font-medium">{company.candidateExperience.interviewExperience}/5</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Process Transparency</span>
                        <div className="flex items-center gap-2">
                          <Progress value={company.candidateExperience.processTransparency * 20} className="w-20" />
                          <span className="text-sm font-medium">{company.candidateExperience.processTransparency}/5</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Accolades */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Recognition
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {company.accolades.map((accolade, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{accolade}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Work Environment */}
                <Card>
                  <CardHeader>
                    <CardTitle>Work Environment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {company.workEnvironment.remote && (
                        <Badge variant="outline" className="justify-center">Remote</Badge>
                      )}
                      {company.workEnvironment.hybrid && (
                        <Badge variant="outline" className="justify-center">Hybrid</Badge>
                      )}
                      {company.workEnvironment.inOffice && (
                        <Badge variant="outline" className="justify-center">In-Office</Badge>
                      )}
                      {company.workEnvironment.flexible && (
                        <Badge variant="outline" className="justify-center">Flexible</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Culture Tab */}
          {activeTab === "culture" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Our Values</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {company.values.map(value => (
                      <div key={value} className="p-4 border rounded-lg">
                        <h4 className="font-semibold text-gray-900">{value}</h4>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Other tabs can be added here following the same pattern */}
          {activeTab === "jobs" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Open Roles</CardTitle>
                  <p className="text-sm text-gray-600">Current opportunities at {company.name}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {company.openRoles.map(role => (
                      <div key={role.id} className="p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-900">{role.title}</h4>
                            <p className="text-sm text-gray-600">{role.department} • {role.location}</p>
                            <Badge variant="secondary" className="mt-2">{role.type}</Badge>
                          </div>
                          <Button size="sm">Apply Now</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
                      <TrendingUp className="w-4 h-4 text-green-500 mt-0.5" />
                      <span className="text-sm">Mentorship programmes for new graduates</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500 mt-0.5" />
                      <span className="text-sm">Regular skills development opportunities</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Training & Support</CardTitle>
                  <p className="text-sm text-gray-600">Based on employer profile</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Target className="w-4 h-4 text-blue-500 mt-0.5" />
                      <span className="text-sm">Comprehensive onboarding programme</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Target className="w-4 h-4 text-blue-500 mt-0.5" />
                      <span className="text-sm">Skills-based training modules</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Target className="w-4 h-4 text-blue-500 mt-0.5" />
                      <span className="text-sm">Professional development budget</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="space-y-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Candidate Feedback</h3>
                <p className="text-sm text-gray-600">Recent experiences from job applicants</p>
              </div>
              {company.candidateTestimonials.map((testimonial, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="font-semibold text-gray-600">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{testimonial.name}</h4>
                            <p className="text-sm text-gray-600">{testimonial.role}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {testimonial.experienceType}
                              </Badge>
                              <span className="text-xs text-gray-500">{testimonial.timeframe}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="jobs">
            <div className="space-y-6">
              {/* Jobs Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Open Positions</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {company.openRoles.length} open roles at {company.name}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      Recommended
                    </Badge>
                    = Great fit for your interests and work style
                  </span>
                  <span className="flex items-center gap-1">
                    <Badge variant="outline" className="text-blue-600 border-blue-600">
                      Applied
                    </Badge>
                    = Already applied
                  </span>
                </div>
              </div>

              {/* Jobs List */}
              <div className="space-y-4">
                {company.openRoles.map(role => {
                  const hasApplied = appliedJobIds.has(role.id);
                  return (
                    <Card key={role.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold">{role.title}</h3>
                              {!hasApplied && isJobRecommended(role, userProfile) && (
                                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                                  Recommended
                                </Badge>
                              )}
                              {hasApplied && (
                                <Badge variant="outline" className="text-blue-600 border-blue-600">
                                  Applied
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <span className="flex items-center gap-1">
                                <Building2 className="w-4 h-4" />
                                {role.department}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {role.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {role.type}
                              </span>
                            </div>
                            {hasApplied && (
                              <p className="text-sm text-blue-600 font-medium">
                                ✓ You have applied to this position
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setLocation(`/jobs/${role.id}`)}
                            >
                              View Details
                            </Button>
                            {hasApplied ? (
                              <Button disabled variant="outline">
                                <Briefcase className="w-4 h-4 mr-2" />
                                Applied
                              </Button>
                            ) : (
                              <Button onClick={() => setLocation(`/jobs/${role.id}/apply`)}>
                                <Briefcase className="w-4 h-4 mr-2" />
                                Apply Now
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Back to Company Overview */}
              <div className="pt-6 border-t">
                <Button variant="outline" onClick={() => setActiveTab('overview')}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Company Overview
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}