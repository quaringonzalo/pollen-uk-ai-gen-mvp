import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { 
  Building2, MapPin, Users, Globe, Star, Award, Heart,
  PoundSterling, Calendar, Clock, Shield, Zap, Target,
  ChevronLeft, ExternalLink, Briefcase, TrendingUp, MessageSquare, ArrowLeft,
  ChevronRight, Camera, Image, GraduationCap
} from "lucide-react";

interface CompanyProfile {
  id: string;
  name: string;
  logo: string;
  tagline: string;
  description: string;
  industry: string;
  industries?: string[];
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
  programmes?: string[];
  initiatives?: string[];
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
  companyRecognitions?: string[];
  workEnvironmentDetails?: string;
  diversityCommitment?: string;
  entryLevelProgrammes?: Array<{
    title: string;
    description: string;
  }>;
  coverImage?: string;
  companyPhotos?: string[];
  workOptionsStatement?: string;
  glassdoorUrl?: string;
}

export default function CompanyProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [candidateExperienceDialogOpen, setCandidateExperienceDialogOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [match, params] = useRoute("/company-profile/:id");
  const [slugMatch, slugParams] = useRoute("/company/:slug");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [demoSavedState, setDemoSavedState] = useState<boolean | null>(null);
  
  // Use either id or slug parameter
  const companyIdentifier = params?.id || slugParams?.slug;

  // Check if company is saved
  const { data: savedStatus } = useQuery({
    queryKey: ['/api/saved-companies', companyIdentifier, 'check'],
    queryFn: async () => {
      const response = await fetch(`/api/saved-companies/${companyIdentifier}/check`);
      if (!response.ok) {
        if (response.status === 401) {
          return { isSaved: false };
        }
        throw new Error('Failed to check save status');
      }
      return response.json();
    },
    enabled: !!companyIdentifier
  });

  // Save company mutation
  const saveCompanyMutation = useMutation({
    mutationFn: async () => {
      // Ensure authentication first
      const demoResponse = await fetch('/api/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'job_seeker' })
      });
      
      if (!demoResponse.ok) {
        throw new Error('Authentication failed');
      }
      
      // Wait a moment for session to be established
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const response = await fetch('/api/saved-companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId: companyIdentifier,
          companyName: company.name
        })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save company');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/saved-companies'] });
      queryClient.invalidateQueries({ queryKey: ['/api/saved-companies', companyIdentifier, 'check'] });
    },
    onError: (error: any) => {
      // In demo mode, silently handle errors but maintain UI state
      console.log('Demo mode - save handled locally:', error.message);
    }
  });

  // Remove saved company mutation
  const removeSavedCompanyMutation = useMutation({
    mutationFn: async () => {
      // Ensure authentication first
      const demoResponse = await fetch('/api/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'job_seeker' })
      });
      
      if (!demoResponse.ok) {
        throw new Error('Authentication failed');
      }
      
      // Wait a moment for session to be established
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const response = await fetch(`/api/saved-companies/${companyIdentifier}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to remove saved company');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/saved-companies'] });
      queryClient.invalidateQueries({ queryKey: ['/api/saved-companies', companyIdentifier, 'check'] });
    },
    onError: (error: any) => {
      // In demo mode, silently handle errors but maintain UI state
      console.log('Demo mode - remove handled locally:', error.message);
    }
  });

  const handleSaveToggle = async () => {
    // Use demo state if available, otherwise fall back to API status
    const currentlySaved = demoSavedState !== null ? demoSavedState : savedStatus?.isSaved;
    
    if (currentlySaved) {
      // Remove from saved - immediate visual feedback
      setDemoSavedState(false);
      toast({
        title: "Company Removed",
        description: `You'll no longer receive alerts for ${company.name} job postings.`
      });
      // Try API call but don't block on errors
      try {
        removeSavedCompanyMutation.mutate();
      } catch (error) {
        console.log('Demo mode - remove state handled locally');
      }
    } else {
      // Save company - immediate visual feedback
      setDemoSavedState(true);
      toast({
        title: "Company Saved!",
        description: `You'll get alerts when ${company.name} posts new roles.`
      });
      // Try API call but don't block on errors
      try {
        saveCompanyMutation.mutate();
      } catch (error) {
        console.log('Demo mode - save state handled locally');
      }
    }
  };
  
  // Dynamic company data based on ID
  const getCompanyInfo = (id: string) => {
    switch (id) {
      case "2":
      case "techflow-solutions":
        return {
          name: "TechFlow Solutions",
          logo: "🚀",
          tagline: "Leading fintech transforming digital payments",
          industry: "Technology",
          description: "A forward-thinking fintech company specialising in digital payments, financial technology solutions, and innovative payment processing. We pride ourselves on nurturing young talent and creating an environment where fresh perspectives drive exceptional results."
        };
      case "digital-insights-ltd":
        return {
          name: "Digital Insights Ltd",
          logo: "📊",
          tagline: "Data-driven insights for business growth",
          industry: "Data & Analytics",
          description: "A specialist data analytics consultancy helping businesses unlock the power of their data. We focus on developing analytical talent and providing actionable insights that drive strategic decision-making."
        };
      case "creative-agency-pro":
        return {
          name: "Creative Agency Pro",
          logo: "🎨",
          tagline: "Creative solutions that inspire action",
          industry: "Creative & Marketing",
          description: "An award-winning creative agency specialising in content marketing, brand storytelling, and digital campaigns. We believe in nurturing creative talent and producing work that makes a meaningful impact."
        };
      case "people-first-consulting":
        return {
          name: "People First Consulting",
          logo: "👥",
          tagline: "Putting people at the heart of business",
          industry: "Human Resources",
          description: "A progressive HR consultancy focused on creating inclusive, engaging workplaces. We specialise in talent development, employee engagement, and building cultures where people thrive."
        };
      case "numbers-co-accountancy":
        return {
          name: "Numbers & Co Accountancy",
          logo: "💼",
          tagline: "Clear numbers, confident decisions",
          industry: "Finance & Accounting",
          description: "A modern accountancy firm providing comprehensive financial services to growing businesses. We focus on developing finance professionals while delivering exceptional client service."
        };
      case "innovation-hub":
        return {
          name: "Innovation Hub",
          logo: "⚡",
          tagline: "Where innovation meets execution",
          industry: "Innovation & Strategy",
          description: "A dynamic innovation consultancy helping organisations transform ideas into reality. We specialise in project management, strategic planning, and fostering innovative thinking across teams."
        };
      default:
        return {
          name: "CreativeMinds Agency",
          logo: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iMTYiIGZpbGw9IiNFMjAwN0EiLz4KPHN2ZyB4PSIyMCIgeT0iMjAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMTMgMTNIMTdWMTdIMTNWMTNaTTEzIDFIOEM1Ljc5IDEgNCAyLjc5IDQgNVYxN0M0IDE5LjIxIDUuNzkgMjEgOCAyMUgxNkMxOC4yMSAyMSAyMCAxOS4yMSAyMCAxN1Y5SDEzVjFaTTggOUM4IDcuMzQgOS4zNCA2IDExIDZTMTQgNy4zNCAxNCA5IDEyLjY2IDEyIDExIDEyIDggMTAuNjYgOCA5WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cjwvc3ZnPgo=",
          tagline: "Where creativity meets strategy",
          industry: "Creative & Marketing",
          description: "A forward-thinking creative agency specialising in digital marketing, brand strategy, and innovative campaign development. We pride ourselves on nurturing young talent and creating an environment where fresh perspectives drive exceptional results."
        };
    }
  };

  const companyInfo = getCompanyInfo(companyIdentifier || "2");
  
  // Get company-specific data
  const getCompanyData = (id: string) => {
    switch (id) {
      case "2":
      case "techflow-solutions":
        return {
          industries: ["Technology", "FinTech", "Financial Services"],
          size: "50-200 employees",
          location: "London, UK",
          website: "https://techflow-solutions.com",
          founded: "2019",
          workOptionsStatement: "Hybrid - Flexible remote and office working",
          glassdoorUrl: "https://www.glassdoor.com/Overview/Working-at-TechFlow-Solutions-EI_IE789012.htm"
        };
      case "digital-insights-ltd":
        return {
          industries: ["Data & Analytics", "Business Intelligence", "Consulting"],
          size: "20-50 employees",
          location: "Manchester, UK",
          website: "https://digital-insights.co.uk",
          founded: "2020",
          workOptionsStatement: "Hybrid - 3 days in office, 2 remote",
          glassdoorUrl: "https://www.glassdoor.com/Overview/Working-at-Digital-Insights-EI_IE567890.htm"
        };
      case "creative-agency-pro":
        return {
          industries: ["Creative Services", "Content Marketing", "Digital Media"],
          size: "30-80 employees",
          location: "Birmingham, UK",
          website: "https://creative-agency-pro.com",
          founded: "2017",
          workOptionsStatement: "Hybrid - Flexible working with creative collaboration days",
          glassdoorUrl: "https://www.glassdoor.com/Overview/Working-at-Creative-Agency-Pro-EI_IE345678.htm"
        };
      case "people-first-consulting":
        return {
          industries: ["Human Resources", "Organizational Development", "Consulting"],
          size: "15-40 employees",
          location: "Edinburgh, UK",
          website: "https://people-first-consulting.co.uk",
          founded: "2021",
          workOptionsStatement: "Hybrid - Client-focused with flexible home working",
          glassdoorUrl: "https://www.glassdoor.com/Overview/Working-at-People-First-Consulting-EI_IE234567.htm"
        };
      case "numbers-co-accountancy":
        return {
          industries: ["Accounting", "Financial Services", "Tax Advisory"],
          size: "25-60 employees",
          location: "Glasgow, UK",
          website: "https://numbers-accountancy.co.uk",
          founded: "2016",
          workOptionsStatement: "Hybrid - Office-based with remote flexibility",
          glassdoorUrl: "https://www.glassdoor.com/Overview/Working-at-Numbers-Accountancy-EI_IE456789.htm"
        };
      case "innovation-hub":
        return {
          industries: ["Innovation Consulting", "Strategy", "Project Management"],
          size: "40-100 employees",
          location: "Bristol, UK",
          website: "https://innovation-hub.co.uk",
          founded: "2018",
          workOptionsStatement: "Hybrid - Innovation-focused with collaborative workspace",
          glassdoorUrl: "https://www.glassdoor.com/Overview/Working-at-Innovation-Hub-EI_IE678901.htm"
        };
      default:
        return {
          industries: ["Marketing & Advertising", "Creative Services", "Digital Media"],
          size: "50-100 employees",
          location: "London, UK",
          website: "https://creativeminds.co.uk",
          founded: "2018",
          workOptionsStatement: "Hybrid - In Office 2 days per week",
          glassdoorUrl: "https://www.glassdoor.com/Overview/Working-at-CreativeMinds-Agency-EI_IE123456.htm"
        };
    }
  };

  const companyData = getCompanyData(companyIdentifier || "2");

  // Mock company data for demo
  const company: CompanyProfile = {
    id: companyIdentifier || "2",
    name: companyInfo.name,
    logo: companyInfo.logo,
    tagline: companyInfo.tagline,
    description: companyInfo.description,
    industry: companyInfo.industry,
    industries: companyData.industries,
    size: companyData.size,
    location: companyData.location,
    website: companyData.website,
    founded: companyData.founded,
    workOptionsStatement: companyData.workOptionsStatement,
    glassdoorUrl: companyData.glassdoorUrl,
    candidateExperience: {
      feedbackQuality: 4.8,
      communicationSpeed: 4.6,
      interviewExperience: 4.7,
      processTransparency: 4.5,
      overallExperience: 4.6
    },
    values: (() => {
      switch (companyIdentifier) {
        case "2":
        case "techflow-solutions":
          return ["Innovation First", "Transparency & Trust", "Growth Mindset", "Customer Obsessed", "Team Over Individual"];
        case "digital-insights-ltd":
          return ["Data-Driven Decisions", "Continuous Learning", "Client Success", "Analytical Excellence", "Collaborative Growth"];
        case "creative-agency-pro":
          return ["Creative Excellence", "Bold Storytelling", "Client Partnership", "Innovative Thinking", "Meaningful Impact"];
        case "people-first-consulting":
          return ["People-Centric Approach", "Inclusive Excellence", "Authentic Leadership", "Continuous Development", "Positive Impact"];
        case "numbers-co-accountancy":
          return ["Accuracy & Integrity", "Client Trust", "Professional Excellence", "Clear Communication", "Reliable Service"];
        case "innovation-hub":
          return ["Innovation Excellence", "Strategic Thinking", "Collaborative Delivery", "Future-Focused", "Results-Driven"];
        default:
          return ["Creativity Unleashed", "Fearlessly Collaborative", "Learn & Grow Together", "Authentically Bold", "Innovation at Heart"];
      }
    })(),
    mission: (() => {
      switch (companyIdentifier) {
        case "2":
        case "techflow-solutions":
          return "To revolutionize financial technology by creating secure, innovative payment solutions that empower businesses and consumers while fostering a culture of learning and growth for the next generation of fintech professionals.";
        case "digital-insights-ltd":
          return "To unlock the power of data for businesses across the UK, providing actionable insights and analytical expertise that drive strategic decision-making while developing the next generation of data professionals.";
        case "creative-agency-pro":
          return "To create compelling content and brand experiences that inspire action and drive results, while nurturing creative talent and building lasting partnerships with forward-thinking brands.";
        case "people-first-consulting":
          return "To transform workplaces into environments where people thrive, creating inclusive cultures and effective HR strategies that drive both human and business success.";
        case "numbers-co-accountancy":
          return "To provide exceptional financial services that give businesses clarity and confidence in their financial decisions, while developing skilled finance professionals who deliver outstanding client service.";
        case "innovation-hub":
          return "To bridge the gap between innovative ideas and successful execution, helping organizations transform their strategic vision into reality while developing the next generation of innovation leaders.";
        default:
          return "To create meaningful connections between brands and their audiences through innovative, creative solutions that drive real business results while nurturing the next generation of creative talent in an environment where bold ideas flourish.";
      }
    })(),
    vision: (() => {
      switch (companyIdentifier) {
        case "2":
        case "techflow-solutions":
          return "To be the leading fintech company that transforms how businesses and consumers interact with money, setting the standard for secure, accessible financial technology while developing the industry's future innovators.";
        case "digital-insights-ltd":
          return "To be the UK's most trusted data analytics partner, known for transforming complex data into clear business value and for developing exceptional analytical talent.";
        case "creative-agency-pro":
          return "To be the creative agency that sets the standard for content marketing excellence, known for campaigns that truly connect with audiences and for developing the industry's creative leaders.";
        case "people-first-consulting":
          return "To be the leading HR consultancy that transforms workplace cultures, setting the standard for inclusive, people-focused practices that drive organizational success.";
        case "numbers-co-accountancy":
          return "To be Scotland's most trusted accountancy partner, known for exceptional client service and for developing skilled finance professionals who drive business success.";
        case "innovation-hub":
          return "To be the UK's premier innovation consultancy, known for turning bold ideas into successful realities and for developing strategic innovation leaders.";
        default:
          return "To be the creative agency that transforms how brands connect with the next generation, setting the standard for inclusive, innovative marketing that drives meaningful change while developing the industry's future leaders.";
      }
    })(),
    benefits: (() => {
      switch (companyIdentifier) {
        case "2":
        case "techflow-solutions":
          return ["25 days holiday + bank holidays", "Flexible remote working", "£2,000 learning & development budget", "Private healthcare & dental", "Stock options programme", "Latest tech equipment", "Mental health support", "FinTech conference attendance"];
        case "digital-insights-ltd":
          return ["25 days holiday + bank holidays", "Hybrid working flexibility", "Data analytics training budget", "Health & wellbeing package", "Professional certification support", "Modern analytics tools", "Team development days", "Industry conference attendance"];
        case "creative-agency-pro":
          return ["25 days holiday + bank holidays", "Creative flexibility hours", "Professional development budget", "Health & wellbeing support", "Creative software licenses", "Team inspiration trips", "Industry event attendance", "Mental health resources"];
        case "people-first-consulting":
          return ["28 days holiday + bank holidays", "Flexible working arrangements", "HR certification funding", "Comprehensive healthcare", "Professional coaching support", "Modern workspace", "Wellbeing initiatives", "CIPD membership"];
        case "numbers-co-accountancy":
          return ["25 days holiday + bank holidays", "Flexible working hours", "Accounting qualification support", "Private healthcare", "Pension scheme", "Professional development", "Study leave provision", "Industry training courses"];
        case "innovation-hub":
          return ["25 days holiday + bank holidays", "Innovation days off", "Learning & development fund", "Health & wellness programme", "Project management certification", "Collaborative workspace", "Innovation conferences", "Team innovation challenges"];
        default:
          return ["25 days holiday + bank holidays", "Flexible working arrangements", "Professional development budget", "Health & wellbeing package", "Team social events", "Cycle to work scheme", "Free breakfast & coffee", "Regular industry training"];
      }
    })(),
    accolades: (() => {
      switch (companyIdentifier) {
        case "2":
        case "techflow-solutions":
          return ["FinTech Innovation Award 2024", "Best Places to Work - Technology", "Top 50 FinTech Companies to Watch", "Excellence in Graduate Development Award", "Cyber Essentials Plus Certified", "London Tech Awards - Rising Star"];
        case "digital-insights-ltd":
          return ["Data Analytics Excellence Award 2024", "Best Places to Work - Data & Analytics", "Top 30 Data Companies UK", "Graduate Development Recognition", "ISO 27001 Certified", "Manchester Digital Awards - Innovation"];
        case "creative-agency-pro":
          return ["Content Marketing Agency of the Year 2024", "Best Places to Work - Creative Industries", "Top 40 Creative Agencies UK", "Excellence in Creative Development", "B Corp Certified 2023", "Birmingham Creative Awards - Rising Star"];
        case "people-first-consulting":
          return ["HR Consultancy of the Year 2024", "Best Places to Work - Consulting", "Top 25 HR Consultancies Scotland", "Excellence in People Development", "Investors in People Gold", "Edinburgh Business Awards - People Excellence"];
        case "numbers-co-accountancy":
          return ["Accountancy Firm of the Year 2024", "Best Places to Work - Professional Services", "Top 50 Accountancy Firms Scotland", "Excellence in Client Service", "ICAEW Quality Assured", "Glasgow Business Awards - Finance Excellence"];
        case "innovation-hub":
          return ["Innovation Consultancy of the Year 2024", "Best Places to Work - Consulting", "Top 30 Innovation Companies UK", "Excellence in Strategic Development", "ISO 9001 Certified", "Bristol Innovation Awards - Consultancy Leader"];
        default:
          return ["Campaign Agency of the Year 2023", "Best Places to Work - Creative Industries", "Top 50 Agencies to Watch", "Excellence in Graduate Development Award", "B Corp Certified 2024", "London Creative Awards - Innovation Prize"];
      }
    })(),
    companyRecognitions: [
      "Campaign Agency of the Year 2023",
      "Best Places to Work - Creative Industries", 
      "Top 50 Agencies to Watch",
      "Excellence in Graduate Development Award",
      "B Corp Certified 2024",
      "London Creative Awards - Innovation Prize"
    ],
    workEnvironmentDetails: "Our culture is built on creativity, collaboration, and genuine care for each other's growth. We foster an environment where fresh ideas are celebrated, everyone's voice matters, and learning never stops. You'll find people genuinely excited about their work, supporting each other through challenges, and taking time to celebrate wins together. We believe the best work happens when people feel valued and inspired.",
    entryLevelProgrammes: [
      {
        title: "Creative Kickstart Programme",
        description: "12-month structured development journey with dedicated mentorship, hands-on project experience, and comprehensive training across all creative disciplines."
      },
      {
        title: "Digital Native Graduate Scheme", 
        description: "18-month rotation programme across digital strategy, social media, and content creation with real client exposure and quarterly skills assessments."
      },
      {
        title: "Account Management Accelerator",
        description: "6-month intensive programme combining client relationship training, project management skills, and business development fundamentals with senior mentor support."
      }
    ],
    coverImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=400&fit=crop&crop=center",
    companyPhotos: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop&crop=center", 
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop&crop=center"
    ],
    workEnvironment: {
      remote: true,
      hybrid: true,
      inOffice: true,
      flexible: true
    },
    diversity: {
      score: 85,
      initiatives: [
        "Diverse hiring practices",
        "Inclusion & belonging programmes",
        "Equal pay audits",
        "Mentorship programmes"
      ]
    },
    programmes: [
      "Graduate Mentorship Programme",
      "Skills Accelerator Programme", 
      "Leadership Development Track",
      "Cross-Functional Projects"
    ],
    initiatives: [
      "Graduate Mentorship Programme",
      "Skills Accelerator Programme",
      "Leadership Development Track", 
      "Cross-Functional Projects"
    ],
    diversityCommitment: "At CreativeMinds, diversity isn't just a buzzword—it's the foundation of our creative excellence. We actively seek talent from all backgrounds because we know that different perspectives create breakthrough ideas. Our commitment includes transparent hiring processes, regular bias training for all staff, flexible working arrangements to support diverse needs, and mentorship programmes specifically designed to support underrepresented groups in the creative industry.",
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
      }
    ],
    openRoles: [
      {
        id: "job-001",
        title: "Media Planning Assistant",
        department: "Media",
        location: "London (Hybrid)",
        type: "Full-time",
        matchScore: 92
      },
      {
        id: "job-002", 
        title: "Marketing Coordinator",
        department: "Account Management",
        location: "London (Hybrid)",
        type: "Full-time",
        matchScore: 85
      },
      {
        id: "job-003",
        title: "Content Creator", 
        department: "Digital",
        location: "Manchester (Hybrid)",
        type: "Full-time",
        matchScore: 75
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
            <Button variant="ghost" onClick={() => setLocation('/companies')}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Companies
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Company Cover Image */}
        {company.coverImage && (
          <div className="relative mb-8 rounded-xl overflow-hidden">
            <img
              src={company.coverImage}
              alt={`${company.name} office`}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70 flex items-end">
              <div className="p-6 text-white">
                <h1 className="text-4xl font-bold" style={{
                  fontFamily: 'Sora', 
                  textShadow: '4px 4px 8px rgba(0,0,0,1), 2px 2px 4px rgba(0,0,0,0.9), 0 0 10px rgba(0,0,0,0.8)',
                  filter: 'contrast(1.3) brightness(1.1)',
                  color: '#ffffff'
                }}>{company.name}</h1>
              </div>
            </div>
            {company.companyPhotos && company.companyPhotos.length > 0 && (
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-4 right-4 bg-white/90 hover:bg-white"
                onClick={() => setPhotoDialogOpen(true)}
              >
                <Camera className="w-4 h-4 mr-2" />
                View Photos ({company.companyPhotos.length})
              </Button>
            )}
          </div>
        )}

        {/* Company Header - Simplified Layout */}
        <div className="mb-8 space-y-6">
          {/* Main Company Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-6">
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  {!company.coverImage && (
                    <div className="mb-4">
                      <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{fontFamily: 'Sora'}}>{company.name}</h1>
                      <p className="text-lg text-gray-600" style={{fontFamily: 'Poppins'}}>{company.tagline}</p>
                    </div>
                  )}
                  
                  {/* Industry Tags - Colorful and integrated */}
                  {(company.industries && company.industries.length > 0) && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {company.industries.map((industry, index) => {
                        // Define colorful industry tag styles
                        const getIndustryStyle = (industry: string) => {
                          const styles: {[key: string]: string} = {
                            'Marketing & Advertising': 'bg-purple-100 text-purple-800 border-purple-200',
                            'Creative Services': 'bg-pink-100 text-pink-800 border-pink-200',
                            'Digital Media': 'bg-blue-100 text-blue-800 border-blue-200',
                            'Technology & Software': 'bg-green-100 text-green-800 border-green-200',
                            'Finance & Banking': 'bg-indigo-100 text-indigo-800 border-indigo-200',
                            'Healthcare': 'bg-red-100 text-red-800 border-red-200',
                            'Education': 'bg-yellow-100 text-yellow-800 border-yellow-200',
                            'Retail & E-commerce': 'bg-orange-100 text-orange-800 border-orange-200',
                            'Manufacturing': 'bg-gray-100 text-gray-800 border-gray-200',
                            'Consulting': 'bg-teal-100 text-teal-800 border-teal-200',
                            'Media & Entertainment': 'bg-violet-100 text-violet-800 border-violet-200',
                            'Non-Profit': 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          };
                          return styles[industry] || 'bg-blue-100 text-blue-800 border-blue-200';
                        };
                        
                        return (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className={`${getIndustryStyle(industry)} font-medium px-3 py-1 text-xs border hover:shadow-sm transition-all`}
                          >
                            {industry}
                          </Badge>
                        );
                      })}
                    </div>
                  )}

                  {/* Company Details */}
                  <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {company.location}
                    </span>
                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {company.size}
                    </span>
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Founded {company.founded}
                    </span>
                  </div>

                  {/* Rating */}
                  <div>
                    <div 
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
                      onClick={() => setCandidateExperienceDialogOpen(true)}
                    >
                      {renderStarRating(company.candidateExperience.overallExperience)}
                      <span className="text-sm text-gray-500">
                        Candidate Experience ({company.candidateExperience.overallExperience})
                      </span>
                      {company.glassdoorUrl && (
                        <>
                          <span className="mx-2 text-gray-400">•</span>
                          <a href={company.glassdoorUrl} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline flex items-center gap-1" style={{color: '#0caa41'}}>
                            <Star className="w-4 h-4" />
                            Glassdoor Reviews
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>



          {/* Badges and Actions */}
          <div className="flex items-center justify-between">
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
              <Button 
                variant={(demoSavedState !== null ? demoSavedState : savedStatus?.isSaved) ? "default" : "outline"}
                onClick={handleSaveToggle}
                disabled={saveCompanyMutation.isPending || removeSavedCompanyMutation.isPending}
                className={(demoSavedState !== null ? demoSavedState : savedStatus?.isSaved) ? "bg-pink-600 hover:bg-pink-700 text-white" : ""}
                title={(demoSavedState !== null ? demoSavedState : savedStatus?.isSaved) ? "You'll receive alerts when this company posts new roles" : "Save this company to receive job alerts"}
              >
                <Heart className={`w-4 h-4 mr-2 ${(demoSavedState !== null ? demoSavedState : savedStatus?.isSaved) ? 'fill-current' : ''}`} />
                {(demoSavedState !== null ? demoSavedState : savedStatus?.isSaved) ? "Saved" : "Save"}
              </Button>
            </div>
          </div>
        </div>

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
                style={{fontFamily: 'Sora'}}
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
                    <CardTitle style={{fontFamily: 'Sora'}}>About {company.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed" style={{fontFamily: 'Poppins'}}>{company.description}</p>
                  </CardContent>
                </Card>

                {/* Our Mission */}
                <Card>
                  <CardHeader>
                    <CardTitle style={{fontFamily: 'Sora'}}>Our Mission</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed" style={{fontFamily: 'Poppins'}}>{company.mission}</p>
                  </CardContent>
                </Card>

                {/* Work Environment Details */}
                {company.workEnvironmentDetails && (
                  <Card>
                    <CardHeader>
                      <CardTitle style={{fontFamily: 'Sora'}}>Our Culture</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed" style={{fontFamily: 'Poppins'}}>{company.workEnvironmentDetails}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Company Recognitions */}
                {company.companyRecognitions && company.companyRecognitions.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle style={{fontFamily: 'Sora'}}>Awards & Recognition</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-3">
                        {company.companyRecognitions.map((recognition, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                            <Award className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                            <span className="text-gray-700" style={{fontFamily: 'Poppins'}}>{recognition}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="space-y-6">
                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2" style={{fontFamily: 'Sora'}}>
                      <Star className="w-5 h-5 text-yellow-500" />
                      Candidate Experience
                    </CardTitle>
                    <p className="text-sm text-gray-600">Based on feedback from recent applicants</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div 
                      className="space-y-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
                      onClick={() => setCandidateExperienceDialogOpen(true)}
                    >
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
                      <p className="text-xs text-gray-500 text-center mt-2">Click to see detailed feedback breakdown</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Work Options */}
                <Card>
                  <CardHeader>
                    <CardTitle style={{fontFamily: 'Sora'}}>Work Options</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 font-medium" style={{fontFamily: 'Poppins'}}>
                      {company.workOptionsStatement || "Hybrid - In Office 2 days per week"}
                    </p>
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
                  <CardTitle style={{fontFamily: 'Sora'}}>Our Values</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-1 gap-4">
                    {company.values.map(value => (
                      <div key={value} className="p-4 border rounded-lg">
                        <h4 className="font-semibold text-gray-900" style={{fontFamily: 'Sora'}}>{value}</h4>
                      </div>
                    ))}
                  </div>

                  {/* Diversity & Inclusion Commitment */}
                  {company.diversityCommitment && (
                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2" style={{fontFamily: 'Sora'}}>
                          <Shield className="w-5 h-5 text-pink-600" />
                          Diversity & Inclusion Commitment
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 leading-relaxed" style={{fontFamily: 'Poppins'}}>{company.diversityCommitment}</p>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Pollen Insights Tab */}
          {activeTab === "pollen" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle style={{fontFamily: 'Sora'}}>Pollen Insights</CardTitle>
                  <p className="text-sm text-gray-600">How {company.name} performs on our platform</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-pink-600">{company.pollenInsights.totalJobsPosted}</div>
                      <div className="text-sm text-gray-600">Jobs Posted</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-pink-600">{company.pollenInsights.monthsOnPlatform}</div>
                      <div className="text-sm text-gray-600">Months on Platform</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-pink-600">{company.pollenInsights.avgTimeToHire} days</div>
                      <div className="text-sm text-gray-600">Avg. Time to Hire</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3" style={{fontFamily: 'Sora'}}>In their own words</h4>
                    <p className="text-gray-600 leading-relaxed">{company.pollenInsights.companyStatement}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3" style={{fontFamily: 'Sora'}}>Our Observations</h4>
                    <ul className="space-y-2">
                      {company.pollenInsights.pollenObservations.map((observation, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-pink-500 mt-2 flex-shrink-0"></div>
                          <span className="text-gray-600">{observation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Benefits Tab */}
          {activeTab === "benefits" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle style={{fontFamily: 'Sora'}}>Employee Benefits</CardTitle>
                  <p className="text-sm text-gray-600">What {company.name} offers their team</p>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {company.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Entry-Level Careers Tab */}
          {activeTab === "careers" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle style={{fontFamily: 'Sora'}}>Entry-Level Programmes</CardTitle>
                  <p className="text-sm text-gray-600">Structured development pathways at {company.name}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Development Initiatives */}
                  {company.initiatives && company.initiatives.length > 0 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {company.initiatives.map((initiative, index) => (
                          <div key={index} className="p-4 border rounded-lg bg-gray-50">
                            <div className="flex items-center gap-2 mb-2">
                              <GraduationCap className="w-5 h-5 text-pink-600" />
                              <h4 className="font-semibold text-gray-900" style={{fontFamily: 'Sora'}}>{initiative}</h4>
                            </div>
                            <p className="text-sm text-gray-600" style={{fontFamily: 'Poppins'}}>
                              Structured development pathway designed to accelerate career growth and build essential skills for early-career professionals.
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3" style={{fontFamily: 'Sora'}}>Additional Growth Opportunities</h4>
                    <div className="space-y-2">
                      {company.careers.growthOpportunities.map((opportunity, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <TrendingUp className="w-4 h-4 text-pink-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600" style={{fontFamily: 'Poppins'}}>{opportunity}</span>
                        </div>
                      ))}
                    </div>
                  </div>


                </CardContent>
              </Card>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle style={{fontFamily: 'Sora'}}>Candidate Feedback</CardTitle>
                  <p className="text-sm text-gray-600">What recent applicants say about {company.name}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {company.candidateTestimonials.map((testimonial, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900" style={{fontFamily: 'Sora'}}>{testimonial.name}</h4>
                          <p className="text-sm text-gray-600">{testimonial.role} • {testimonial.timeframe}</p>
                        </div>

                      </div>
                      <blockquote className="text-gray-700 italic">"{testimonial.quote}"</blockquote>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Jobs Tab */}
          {activeTab === "jobs" && (
            <div className="space-y-6">
              {/* Recommended Jobs */}
              <Card>
                <CardHeader>
                  <CardTitle style={{fontFamily: 'Sora'}}>Recommended for You</CardTitle>
                  <p className="text-sm text-gray-600">Based on your profile and preferences</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {company.openRoles.filter(role => role.matchScore && role.matchScore > 80).map(role => (
                      <div key={role.id} className="p-4 border-2 border-pink-200 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900" style={{fontFamily: 'Sora'}}>{role.title}</h4>
                              <Badge className="bg-pink-600 text-white">
                                Recommended
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{role.department} • {role.location}</p>
                            <Badge variant="secondary" className="mt-2">{role.type}</Badge>
                          </div>
                          <Button 
                            size="sm" 
                            className="bg-pink-600 hover:bg-pink-700 text-white"
                            onClick={() => window.location.href = `/jobs/${role.id}/apply`}
                          >
                            View and Apply
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {/* Example of Already Applied Job */}
                    <div className="p-4 border-2 border-gray-200 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-500" style={{fontFamily: 'Sora'}}>Social Media Assistant</h4>
                            <Badge className="bg-gray-500 text-white">
                              Applied
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">Marketing • London</p>
                          <Badge variant="secondary" className="mt-2 bg-gray-100 text-gray-600">Full-time</Badge>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.location.href = '/applications'}
                          className="text-blue-600 border-blue-300 hover:bg-blue-50"
                        >
                          View Application
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Other Open Roles */}
              <Card>
                <CardHeader>
                  <CardTitle style={{fontFamily: 'Sora'}}>Other Open Roles</CardTitle>
                  <p className="text-sm text-gray-600">Additional opportunities at {company.name}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {company.openRoles.filter(role => !role.matchScore || role.matchScore <= 80).map(role => (
                      <div key={role.id} className="p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-900" style={{fontFamily: 'Sora'}}>{role.title}</h4>
                            <p className="text-sm text-gray-600">{role.department} • {role.location}</p>
                            <Badge variant="secondary" className="mt-2">{role.type}</Badge>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.location.href = `/jobs/${role.id}/apply`}
                          >
                            View and Apply
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Company Photos Dialog */}
        <Dialog open={photoDialogOpen} onOpenChange={setPhotoDialogOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle style={{fontFamily: 'Sora'}}>Company Photos</DialogTitle>
            </DialogHeader>
            {company.companyPhotos && company.companyPhotos.length > 0 && (
              <div className="space-y-4">
                {/* Main Photo Display */}
                <div className="relative">
                  <img
                    src={company.companyPhotos[currentPhotoIndex]}
                    alt={`${company.name} workplace ${currentPhotoIndex + 1}`}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  {company.companyPhotos.length > 1 && (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                        onClick={() => setCurrentPhotoIndex((prev) => 
                          prev === 0 ? company.companyPhotos!.length - 1 : prev - 1
                        )}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                        onClick={() => setCurrentPhotoIndex((prev) => 
                          prev === company.companyPhotos!.length - 1 ? 0 : prev + 1
                        )}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
                
                {/* Photo Thumbnails */}
                {company.companyPhotos.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {company.companyPhotos.map((photo, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPhotoIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentPhotoIndex 
                            ? 'border-pink-600 shadow-lg' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={photo}
                          alt={`${company.name} workplace thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Candidate Experience Detail Dialog */}
        <Dialog open={candidateExperienceDialogOpen} onOpenChange={setCandidateExperienceDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle style={{fontFamily: 'Sora'}}>Candidate Experience at {company.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-gray-900" style={{fontFamily: 'Sora'}}>Feedback Quality</h4>
                      <span className="text-lg font-bold text-pink-600">{company.candidateExperience.feedbackQuality}/5</span>
                    </div>
                    <Progress value={company.candidateExperience.feedbackQuality * 20} className="mb-2" />
                    <p className="text-sm text-gray-600" style={{fontFamily: 'Poppins'}}>
                      Candidates receive detailed, constructive feedback regardless of the outcome. 
                      Reviews highlight specific strengths and areas for development.
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-gray-900" style={{fontFamily: 'Sora'}}>Communication Speed</h4>
                      <span className="text-lg font-bold text-pink-600">{company.candidateExperience.communicationSpeed}/5</span>
                    </div>
                    <Progress value={company.candidateExperience.communicationSpeed * 20} className="mb-2" />
                    <p className="text-sm text-gray-600" style={{fontFamily: 'Poppins'}}>
                      Average response time is 2-3 business days. Candidates are kept informed 
                      at each stage of the process with clear next steps.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-gray-900" style={{fontFamily: 'Sora'}}>Interview Experience</h4>
                      <span className="text-lg font-bold text-pink-600">{company.candidateExperience.interviewExperience}/5</span>
                    </div>
                    <Progress value={company.candidateExperience.interviewExperience * 20} className="mb-2" />
                    <p className="text-sm text-gray-600" style={{fontFamily: 'Poppins'}}>
                      Structured interviews that focus on potential and growth mindset. 
                      Interviewers are well-prepared and create a welcoming environment.
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-gray-900" style={{fontFamily: 'Sora'}}>Process Transparency</h4>
                      <span className="text-lg font-bold text-pink-600">{company.candidateExperience.processTransparency}/5</span>
                    </div>
                    <Progress value={company.candidateExperience.processTransparency * 20} className="mb-2" />
                    <p className="text-sm text-gray-600" style={{fontFamily: 'Poppins'}}>
                      Clear information about role expectations, company culture, and career 
                      progression opportunities shared upfront.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900" style={{fontFamily: 'Sora'}}>Overall Experience Rating</h4>
                    <p className="text-sm text-gray-600">Based on feedback from {Math.floor(Math.random() * 50) + 25} recent candidates</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-pink-600">{company.candidateExperience.overallExperience}/5</div>
                    <div className="flex">
                      {renderStarRating(company.candidateExperience.overallExperience)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}