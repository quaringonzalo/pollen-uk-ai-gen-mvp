import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { User, Trophy, Target, Clock, Star, CheckCircle, Lock, ArrowRight, Zap, Crown, Heart, Users, Radar, FileText, Home, MessageSquare, Plus, Mail, Check, Clock3, Edit, Book, Save, X, Briefcase, HelpCircle, Award, Camera, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DiscRadarChart } from "@/components/disc-radar-chart";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { getJobSeekerBehavioralProfile } from '@/services/behavioral-profile-service';
import { Building2, MapPin, Globe, Calendar, Users2, Settings, Eye, Brain } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from 'recharts';



// Simulated user data after completing profile
const USER_PROFILE = {
  name: "Zara Williams",
  email: "zara.williams@email.com",
  joinDate: "December 2024",
  behaviouralProfile: "Creative Collaborator",
  // Points system removed - focus on skills-first approach
  completedApplications: 2,
  profileStrength: 87, // Profile completion percentage
  unlockedFeatures: {
    companyPlaybook: false,
    bootcamp: false
  },
  // Behavioral assessment data
  behaviouralDimensions: {
    drive: 75,
    influence: 85, // High influence for Creative Influencer
    steadiness: 65,
    compliance: 60,
    creativity: 90, // High creativity for Creative Influencer
    leadership: 70
  },
  // Career readiness profile derived from behavioural assessment and experience
  careerReadiness: {
    communication: 92, // Derived from Yellow (Influence) DISC score + application feedback
    problemSolving: 85, // Derived from Red (Dominance) + Blue (Conscientiousness) scores
    teamwork: 88, // Derived from Green (Steadiness) + application collaboration scenarios
    leadership: 78, // Derived from Red (Dominance) + workshop participation
    technical: 82, // Derived from application performance in technical challenges
    adaptability: 90 // Derived from Yellow (Influence) + community engagement variety
  },
  // Personal insights from onboarding
  personalBackground: {
    happinessSource: "I love connecting with people and working on creative projects that make a real impact in the community.",
    proudMoment: "Leading a university marketing campaign that increased student engagement by 40% through innovative social media strategies.",
    personalityTraits: ["Creative", "Collaborative", "Strategic", "Empathetic"]
  },
  // Community features moved to dedicated community section
  // References and testimonials
  testimonials: [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Team Lead",
      company: "TechStart Inc",
      relationship: "Former Project Manager",
      testimonial: "Alex demonstrated exceptional creativity and leadership during our marketing campaign project. Their ability to think outside the box while maintaining attention to detail made them an invaluable team member. They consistently delivered high-quality work and showed great initiative in problem-solving.",
      date: "November 2024",
      verified: true,
      email: "s.chen@techstart.com"
    },
    {
      id: 2,
      name: "Dr. Michael Rodriguez",
      role: "Senior Lecturer",
      company: "University Marketing Department",
      relationship: "Academic Tutor",
      testimonial: "Alex was one of my most engaged students, constantly bringing fresh perspectives to our discussions. Their final project on digital marketing strategies showed remarkable analytical thinking and creativity. I'm confident they will excel in any marketing role.",
      date: "October 2024",
      verified: true,
      email: "m.rodriguez@university.edu"
    }
  ],
  pendingRequests: [
    {
      id: 1,
      name: "Emma Wilson",
      role: "Internship Supervisor", 
      company: "Creative Agency",
      email: "emma.wilson@creativeagency.com",
      requestedDate: "December 15, 2024",
      status: "pending",
      message: "Hi Emma, I'd love to include a reference from you in my professional profile. Could you provide a brief testimonial about our work together during my internship?"
    }
  ],
  careerPreferences: {
    idealJobDescription: "A role where I can combine creative strategy with data-driven insights, working with diverse teams to solve challenging problems and create meaningful impact.",
    industryTypes: ["Marketing & Advertising", "Non-profit & Social Impact", "Creative Services", "Technology & Software", "Media & Entertainment"],
    workEnvironment: ["Collaborative", "Fast-paced", "Creative freedom", "Learning opportunities"]
  },
  workStyleInsights: {
    primaryStrengths: [
      "Builds strong relationships and rapport with team members",
      "Communicates ideas clearly and persuasively", 
      "Maintains team harmony and collaborative spirit"
    ],
    communicationStyle: "Warm and engaging communicator who prefers face-to-face interaction and values team input in decision-making"
  }
};

const COMPLETED_APPLICATIONS = [
  {
    id: 'marketing-assistant-role',
    title: 'Marketing Assistant - Creative Agency',
    appliedDate: 'Today',
    status: 'Assessment Complete - Employer Review',
    assessmentScore: 87,
    company: 'Bright Ideas Marketing'
  }
];

// Function to get application history summary
function getApplicationSummary(applications: any[]) {
  return {
    total: applications.length,
    underReview: applications.filter(app => app.status === 'Under Review').length,
    interviewed: applications.filter(app => app.status === 'Interview').length,
    successful: applications.filter(app => app.status === 'Offer').length
  };
}

const APPLICATION_MILESTONES = [
  {
    title: 'Profile Complete',
    description: 'Ready for job applications',
    unlocked: true,
    icon: CheckCircle,
    colour: 'text-green-600',
    achievement: 'Profile completed and behavioural assessment finished'
  },
  {
    title: 'First Application',
    description: 'Started applying for jobs',
    unlocked: true,
    icon: Briefcase,
    colour: 'text-blue-600',
    achievement: '2 applications submitted'
  },
  {
    title: 'Active Learner',
    description: 'Engaged in professional development',
    unlocked: true, // Workshop attendance check
    icon: Book,
    colour: 'text-orange-600',
    achievement: `8 workshops attended`
  },
  {
    title: 'Community Helper',
    description: 'Supporting other job seekers',
    unlocked: true, // Community help check
    icon: Users,
    colour: 'text-pink-600',
    achievement: `Helped 12 community members`
  }
];



// Helper function to generate behavioral type from DISC percentages
const generateBehavioralTypeFromDisc = (discProfile: any) => {
  if (!discProfile || (!discProfile.red && !discProfile.yellow && !discProfile.green && !discProfile.blue)) {
    return "The Balanced Achiever"; // Default for zero scores
  }

  const scores = [
    { name: "Dominant", value: discProfile.red || 0, label: "D" },
    { name: "Influential", value: discProfile.yellow || 0, label: "I" },  
    { name: "Steady", value: discProfile.green || 0, label: "S" },
    { name: "Conscientious", value: discProfile.blue || 0, label: "C" }
  ].sort((a, b) => b.value - a.value);
  
  const primary = scores[0];
  const secondary = scores[1];
  
  // Streamlined personality type mapping (12 total types, matching server logic)
  
  // Pure Profiles (70%+ single dimension)
  if (primary.value >= 70) {
    switch (primary.name) {
      case "Dominant": return "The Results Machine";
      case "Influential": return "The Social Butterfly";
      case "Steady": return "The Steady Rock";
      case "Conscientious": return "The Quality Guardian";
    }
  }
  // Blended Profiles (primary 40-69% + secondary 30%+)
  else if (primary.value >= 40 && primary.value < 70 && secondary.value >= 30) {
    if (primary.name === "Dominant" && secondary.name === "Influential") return "The Rocket Launcher";
    if (primary.name === "Dominant" && secondary.name === "Conscientious") return "The Strategic Ninja";
    if (primary.name === "Dominant" && secondary.name === "Steady") return "The Steady Achiever";
    if (primary.name === "Influential" && secondary.name === "Dominant") return "The People Champion";
    if (primary.name === "Influential" && secondary.name === "Steady") return "The Team Builder";
    if (primary.name === "Influential" && secondary.name === "Conscientious") return "The Creative Genius";
    if (primary.name === "Steady" && secondary.name === "Dominant") return "The Reliable Achiever";
    if (primary.name === "Steady" && secondary.name === "Influential") return "The Supportive Communicator";
    if (primary.name === "Steady" && secondary.name === "Conscientious") return "The Patient Perfectionist";
    if (primary.name === "Conscientious" && secondary.name === "Dominant") return "The Methodical Achiever";
    if (primary.name === "Conscientious" && secondary.name === "Influential") return "The Engaging Analyst";
    if (primary.name === "Conscientious" && secondary.name === "Steady") return "The Thorough Collaborator";
    return "The Balanced Achiever";
  }
  // All other cases: Balanced Profile
  else {
    return "The Balanced Achiever";
  }
};

// Helper function to get personality emoji
const getPersonalityEmoji = (personalityType: string): string => {
  const emojiMap: { [key: string]: string } = {
    // Pure Profiles (4)
    "The Results Machine": "⚡",
    "The Social Butterfly": "🦋",
    "The Steady Rock": "🗿",
    "The Quality Guardian": "🛡️",
    // Blended Profiles (12)
    "The Rocket Launcher": "🚀",
    "The Strategic Ninja": "🥷",
    "The Steady Achiever": "🏆",
    "The People Champion": "👑",
    "The Team Builder": "🤝",
    "The Creative Genius": "🎨",
    "The Reliable Achiever": "🏗️",
    "The Supportive Communicator": "📢",
    "The Patient Perfectionist": "🎯",
    "The Methodical Achiever": "📊",
    "The Engaging Analyst": "💬",
    "The Thorough Collaborator": "🔧",
    // Balanced Profile (1)
    "The Balanced Achiever": "⚖️"
  };
  return emojiMap[personalityType] || "✨";
};

// Helper function to get personality description
const getPersonalityDescription = (personalityType: string): string => {
  const descriptionMap: { [key: string]: string } = {
    "The Results Dynamo": "Unstoppable force focused on delivering outcomes and exceeding expectations",
    "The Social Butterfly": "Natural connector who brings people together and creates positive energy",
    "The Steady Rock": "Reliable foundation who provides stability and supports team success",
    "The Quality Guardian": "Detail-oriented expert who ensures excellence and maintains high standards",
    "The Rocket Launcher": "Dynamic leader who accelerates results through bold action and innovation",
    "The People Champion": "Inspiring leader who empowers others while driving meaningful results",
    "The Creative Genius": "Innovative thinker who transforms ideas into breakthrough solutions",
    "The Innovation Catalyst": "Energetic creator who sparks new ideas and drives positive change",
    "The Team Builder": "Collaborative facilitator who creates harmony while achieving shared goals",
    "The Problem Solver": "Strategic thinker who tackles challenges with determination and skill",
    "The Results Machine": "Reliable achiever who consistently delivers exceptional outcomes",
    "The Strategic Ninja": "Precise analyst who achieves goals through careful planning and execution",
    "Methodical Achiever": "Systematic expert who delivers excellence through careful attention to detail",
    "The Balanced Achiever": "Versatile professional who adapts successfully across diverse situations",
    "The Versatile Professional": "Adaptable individual who excels through a balanced approach to work"
  };
  return descriptionMap[personalityType] || "Your unique blend of traits creates a distinctive work approach";
};

export default function UserProfile() {
  const [isEditingInsights, setIsEditingInsights] = useState(false);
  const [isEditingEducation, setIsEditingEducation] = useState(false);
  const [isEditingCareer, setIsEditingCareer] = useState(false);
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showLearnMoreDialog, setShowLearnMoreDialog] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  
  // State for edited insights (moved up to avoid hooks order violation)
  const [editedInsights, setEditedInsights] = useState({
    happyWhen: "Collaborating with diverse teams to solve creative challenges and seeing ideas come to life",
    proudOf: "Leading my university's sustainability campaign which reduced campus waste by 40% and engaged over 500 students in environmental initiatives",
    friendsDescribe: "Creative, supportive, always brings positive energy",
    teachersDescribe: "Thoughtful, analytical, great at connecting ideas",
    perfectJob: "A role where I can combine creative strategy with data-driven insights, working with diverse teams to solve challenging problems and create meaningful impact.",
    // Education data
    qualification: "University Graduate",
    institution: "University of Edinburgh",
    subjects: "Business & Management, Marketing & Communications",
    additionalLearning: ["Online courses", "Self-taught design skills", "Professional development courses"],
    // Career interests
    industryTypes: USER_PROFILE.careerPreferences.industryTypes,
    workEnvironment: USER_PROFILE.careerPreferences.workEnvironment
  });
  
  // Fetch actual user profile data instead of using static USER_PROFILE
  const { data: profileData, isLoading, error } = useQuery({
    queryKey: ['user-profile'],
    queryFn: () => fetch('/api/user-profile').then(res => {
      if (!res.ok) {
        throw new Error('Not authenticated');
      }
      return res.json();
    }),
    staleTime: 0, // Always fetch fresh data
    refetchOnMount: true, // Always refetch when component mounts
    retry: false // Don't retry on 401 errors
  });

  // Check if behavioral assessment data is available - check the behavioralAssessment object
  const hasBehavioralData = profileData && 
    profileData.behavioralAssessment && 
    profileData.behavioralAssessment.discProfile && 
    (profileData.behavioralAssessment.discProfile.red > 0 || 
     profileData.behavioralAssessment.discProfile.yellow > 0 || 
     profileData.behavioralAssessment.discProfile.green > 0 || 
     profileData.behavioralAssessment.discProfile.blue > 0);

  // Debug: Log the behavioral data detection
  console.log('🔍 Behavioral Data Debug:', {
    profileData: profileData,
    behavioralAssessment: profileData?.behavioralAssessment,
    discProfile: profileData?.behavioralAssessment?.discProfile,
    hasBehavioralData: hasBehavioralData
  });

  // Detect if user is an employer and fetch employer profile data
  const isEmployer = profileData?.role === 'employer';

  const { data: employerProfile, isLoading: employerLoading } = useQuery({
    queryKey: ['employer-profile-current'],
    queryFn: () => fetch('/api/employer-profile/current').then(res => res.json()),
    enabled: isEmployer,
    staleTime: 0,
    refetchOnMount: true
  });

  // Demo login mutation
  const demoLogin = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        throw new Error('Demo login failed');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    }
  });

  // Profile picture upload mutation (moved up to avoid hooks order violation)
  const uploadProfilePicture = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('profile-picture', file);
      
      const response = await fetch(`/api/users/${profileData?.id}/profile-picture`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload profile picture');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Profile Picture Updated",
        description: "Your profile picture has been successfully updated.",
      });
      // Invalidate and refetch user profile data
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: "Failed to upload profile picture. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsUploadingPicture(false);
    },
  });

  // Show loading state for both job seeker and employer profiles
  if (isLoading || (profileData?.role === 'employer' && employerLoading)) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show demo login for unauthenticated users
  if (error || !profileData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="mb-4">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Demo Profile Access</h3>
            <p className="text-gray-600 text-sm mb-4">
              View a demonstration of the Pollen platform experience
            </p>
          </div>
          <Button 
            onClick={() => demoLogin.mutate()}
            disabled={demoLogin.isPending}
            className="bg-pink-600 hover:bg-pink-700 text-white"
          >
            {demoLogin.isPending ? 'Loading...' : 'Demo Login'}
          </Button>
        </div>
      </div>
    );
  }

  // Show employer profile for employer users
  if (profileData?.role === 'employer') {
    // Employer profile would go here - for now redirect to dashboard
    return (
      <div className="text-center py-12">
        <p>Employer profile functionality coming soon</p>
        <Button onClick={() => setLocation('/dashboard')}>Go to Dashboard</Button>
      </div>
    );
  }

  // Handler functions (no hooks here)

  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select an image file.",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      
      setIsUploadingPicture(true);
      uploadProfilePicture.mutate(file);
    }
  };

  // Get application summary data
  const applicationSummary = getApplicationSummary(COMPLETED_APPLICATIONS);

  const handleSaveInsights = () => {
    // Here you would typically save to the backend
    console.log('Saving insights:', editedInsights);
    setIsEditingInsights(false);
    // Show success message or toast
  };

  const handleCancelEdit = () => {
    // Reset to original values
    setEditedInsights({
      happyWhen: "Collaborating with diverse teams to solve creative challenges and seeing ideas come to life",
      proudOf: "Leading my university's sustainability campaign which reduced campus waste by 40% and engaged over 500 students in environmental initiatives",
      friendsDescribe: "Creative, supportive, always brings positive energy",
      teachersDescribe: "Thoughtful, analytical, great at connecting ideas",
      perfectJob: "",
      // Education data
      qualification: "University Graduate",
      institution: "University of Edinburgh",
      subjects: "Business & Management, Marketing & Communications",
      additionalLearning: ["Online courses", "Self-taught design skills", "Professional development courses"],
      // Career interests
      industryTypes: USER_PROFILE.careerPreferences.industryTypes,
      workEnvironment: USER_PROFILE.careerPreferences.workEnvironment
    });
    setIsEditingInsights(false);
    setIsEditingEducation(false);
    setIsEditingCareer(false);
  };

  // Helper functions for personality emojis and descriptions
  const getPersonalityEmoji = (personalityType: string): string => {
    const emojiMap: { [key: string]: string } = {
      "The Strategic Ninja": "🥷",
      "The Rocket Launcher": "🚀",
      "The Social Butterfly": "🦋",
      "The Results Machine": "⚡",
      "The Creative Genius": "🎨",
      "The People Champion": "👑", 
      "The Quality Guardian": "🛡️",
      "The Innovation Catalyst": "💡",
      "The Team Builder": "🤝",
      "The Problem Solver": "🔧",
      "The Steady Rock": "🗿",
      "The Precision Master": "🎯",
      "Methodical Achiever": "📊",
      "Reliable Foundation": "🏗️"
    };
    return emojiMap[personalityType] || "✨";
  };

  const getPersonalityDescription = (personalityType: string): string => {
    const descriptionMap: { [key: string]: string } = {
      // Pure Dominant Types
      "The Results Dynamo": "Unstoppable force focused on delivering outcomes and exceeding expectations",
      "The Social Butterfly": "Natural connector who brings people together and creates positive energy",
      "The Steady Rock": "Reliable foundation who provides stability and supports team success",
      "The Quality Guardian": "Detail-oriented expert who ensures excellence and maintains high standards",
      
      // Dual Combinations
      "The Ambitious Influencer": "High-energy achiever who inspires teams while driving ambitious results",
      "The Strategic Ninja": "Swift analytical decision-maker who strikes with precision and achieves results quietly",
      "The Reliable Executor": "Dependable results-driver who delivers outcomes through consistent excellence",
      "The Dynamic Leader": "Energetic leader who motivates teams while achieving breakthrough results",
      "The People Magnet": "Charismatic team builder who creates harmony while inspiring collaborative success",
      "The Inspiring Thinker": "Thoughtful communicator who engages others through insightful analysis",
      "The Quiet Champion": "Supportive achiever who drives results while empowering team success",
      "The Team Catalyst": "Energetic facilitator who sparks collaboration and accelerates team performance",
      "The Thoughtful Planner": "Strategic coordinator who builds systematic approaches through careful team planning",
      "The Analytical Driver": "Methodical leader who combines thorough analysis with decisive results-focused action",
      "The Innovation Spark": "Creative researcher who transforms complex analysis into breakthrough insights",
      "The Methodical Coordinator": "Systematic organizer who ensures team success through structured collaborative planning",
      
      // Balanced Profile
      "The Versatile Chameleon": "Adaptable professional who excels across diverse situations and team dynamics",
      
      // Legacy support
      "Methodical Achiever": "Methodical expert who delivers flawless work through careful attention to detail",
      "Reliable Foundation": "Dependable team player who provides steady support and stability"
    };
    return descriptionMap[personalityType] || "Your unique blend of traits creates a distinctive work approach";
  };

  // Function to generate modern behavioral type from DISC data (matching assessment logic)
  const generateBehavioralTypeFromDisc = (discProfile: any) => {
    if (!discProfile || (!discProfile.red && !discProfile.yellow && !discProfile.green && !discProfile.blue)) {
      return "The Balanced Achiever"; // Default for zero scores
    }

    const scores = [
      { name: "Dominant", value: discProfile.red || 0, label: "D" },
      { name: "Influential", value: discProfile.yellow || 0, label: "I" },  
      { name: "Steady", value: discProfile.green || 0, label: "S" },
      { name: "Conscientious", value: discProfile.blue || 0, label: "C" }
    ].sort((a, b) => b.value - a.value);
    
    const primary = scores[0];
    const secondary = scores[1];
    
    // Generate profile type name (matching assessment logic)
    if (primary.value >= 35) {
      switch (primary.name) {
        case "Dominant":
          if (secondary.name === "Influential") return "The Rocket Launcher";
          if (secondary.name === "Steady") return "The Results Machine";
          if (secondary.name === "Conscientious") return "The Strategic Ninja";
          return "The Problem Solver";
        case "Influential":
          if (secondary.name === "Dominant") return "The People Champion";
          if (secondary.name === "Steady") return "The Social Butterfly";
          if (secondary.name === "Conscientious") return "The Creative Genius";
          return "The Innovation Catalyst";
        case "Steady":
          if (secondary.name === "Dominant") return "The Steady Rock";
          if (secondary.name === "Influential") return "The Team Builder";
          if (secondary.name === "Conscientious") return "The Quality Guardian";
          return "The Team Builder";
        case "Conscientious":
          if (secondary.name === "Dominant") return "The Methodical Achiever";
          if (secondary.name === "Influential") return "The Engaging Analyst";
          if (secondary.name === "Steady") return "The Patient Perfectionist";
          return "The Detail Master";
      }
    }
    
    return primary.value - secondary.value <= 10 ? "The Balanced Achiever" : "The Versatile Professional";
  };

  // Function to generate role recommendations based on DISC profile (matches behavioral assessment logic exactly)
  const generateRoleRecommendations = (discProfile: any) => {
    if (!discProfile || (!discProfile.red && !discProfile.yellow && !discProfile.green && !discProfile.blue)) {
      return null; // Return null to show fallback content
    }

    const roleTypes = [];
    const { red, yellow, green, blue } = discProfile;
    
    // Use higher thresholds and more specific logic for unique role recommendations
    if (blue >= 50) {
      roleTypes.push({
        title: "Quality assurance and process improvement",
        description: "Ensuring high standards and creating systematic approaches to work"
      });
      roleTypes.push({
        title: "Data analysis and research",
        description: "Examining information carefully to support decision-making"
      });
    }
    
    if (red >= 50) {
      roleTypes.push({
        title: "Leading projects and initiatives",
        description: "Taking charge of important work and driving results"
      });
      roleTypes.push({
        title: "Client-facing and business development",
        description: "Building relationships with external stakeholders and growing business"
      });
    }
    
    if (yellow >= 50) {
      roleTypes.push({
        title: "Team coordination and communication",
        description: "Facilitating collaboration and keeping everyone connected"
      });
      roleTypes.push({
        title: "Training and development",
        description: "Helping others learn and grow through engaging interactions"
      });
    }
    
    if (green >= 50) {
      roleTypes.push({
        title: "Customer service and support",
        description: "Providing consistent, patient assistance to help others succeed"
      });
      roleTypes.push({
        title: "Operations and administration",
        description: "Maintaining steady processes that keep the organisation running"
      });
    }
    
    // Mixed profiles with high secondary traits
    if (red >= 35 && blue >= 35) {
      roleTypes.push({
        title: "Strategic planning and execution",
        description: "Combining analytical thinking with decisive action to achieve goals"
      });
    }
    
    if (yellow >= 35 && green >= 35) {
      roleTypes.push({
        title: "Human resources and people development",
        description: "Supporting team members while maintaining positive workplace culture"
      });
    }
    
    // Add fallback role types to ensure exactly 4 points
    const fallbackRoleTypes = [
      {
        title: "Adapting to different situations",
        description: "Working flexibly across various team dynamics and projects"
      },
      {
        title: "Supporting team success",
        description: "Contributing to collective achievement and team goals"
      },
      {
        title: "Solving problems creatively",
        description: "Finding innovative solutions to workplace challenges"
      },
      {
        title: "Contributing to positive culture",
        description: "Helping create welcoming and productive work environments"
      }
    ];
    
    // Add fallback role types if needed to reach exactly 4
    for (let i = 0; i < fallbackRoleTypes.length && roleTypes.length < 4; i++) {
      const fallback = fallbackRoleTypes[i];
      if (!roleTypes.some(role => role.title === fallback.title)) {
        roleTypes.push(fallback);
      }
    }
    
    return roleTypes.slice(0, 4); // Ensure exactly 4 role types
  };

  // Function to generate work environment preferences based on DISC profile
  const generateWorkEnvironmentPreferences = (discProfile: any) => {
    if (!discProfile || (!discProfile.red && !discProfile.yellow && !discProfile.green && !discProfile.blue)) {
      return null; // Return null to show fallback content
    }

    const preferences = [];
    const { red, yellow, green, blue } = discProfile;

    // Dominance-focused environment preferences (high red)
    if (red >= 40) {
      preferences.push({
        title: "Results-Driven Culture",
        description: "You thrive in environments that value achievement, clear goals, and direct communication"
      });
      preferences.push({
        title: "Autonomy & Decision-Making",
        description: "You prefer independence in your work with the authority to make decisions and drive outcomes"
      });
    }

    // Influence-focused environment preferences (high yellow)
    if (yellow >= 40) {
      preferences.push({
        title: "Collaborative & Social Environment",
        description: "You excel in team-oriented cultures with regular interaction and relationship-building"
      });
      preferences.push({
        title: "Dynamic & Engaging Atmosphere",
        description: "You thrive in energetic environments with variety, enthusiasm, and positive team dynamics"
      });
    }

    // Steadiness-focused environment preferences (high green)
    if (green >= 40) {
      preferences.push({
        title: "Supportive & Stable Culture",
        description: "You perform best in environments that value cooperation, consistency, and mutual support"
      });
      preferences.push({
        title: "Structured Team Environment",
        description: "You appreciate clear processes, regular check-ins, and a harmonious team atmosphere"
      });
    }

    // Conscientiousness-focused environment preferences (high blue)
    if (blue >= 40) {
      preferences.push({
        title: "Quality-Focused Culture",
        description: "You appreciate environments that value accuracy, excellence, and take pride in delivering quality work"
      });
      preferences.push({
        title: "Focused Work Time",
        description: "You're most productive with uninterrupted blocks of time to dive deep into tasks"
      });
    }

    // Multi-dimensional environment preferences for balanced profiles
    if (red >= 30 && green >= 30) {
      preferences.push({
        title: "Balanced Independence & Collaboration",
        description: "You enjoy autonomy in your work while maintaining strong team relationships and support"
      });
    }

    if (yellow >= 30 && blue >= 30) {
      preferences.push({
        title: "Social Yet Detail-Oriented",
        description: "You value both interpersonal connection and the opportunity to produce high-quality, thorough work"
      });
    }

    // Ensure we have at least 3-4 recommendations
    if (preferences.length < 3) {
      preferences.push({
        title: "Flexible & Adaptive Environment",
        description: "You work well in various settings that can adapt to your unique working style and preferences"
      });
    }

    return preferences.slice(0, 4); // Limit to 4 preferences
  };

  // Show authentication prompt if user is not logged in
  if (error && (error as any)?.message === 'Not authenticated') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle>Demo Login Required</CardTitle>
            <CardDescription>
              To view your behavioral assessment results and profile data, please log in with demo credentials.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              onClick={() => demoLogin.mutate()} 
              disabled={demoLogin.isPending}
              className="w-full"
            >
              {demoLogin.isPending ? 'Logging in...' : 'Demo Login'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main profile container */}
      <div className="max-w-screen-xl mx-auto px-6" id="profile-export-container">
        {/* Header */}
        <div className="p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative group">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#E2007A', fontFamily: 'Sora' }}>
                {profileData?.profileImageUrl ? (
                  <img 
                    src={profileData.profileImageUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-xl">
                    {profileData?.firstName && profileData?.lastName 
                      ? `${profileData.firstName[0]}${profileData.lastName[0]}`.toUpperCase()
                      : 'ZW'
                    }
                  </span>
                )}
              </div>
              
              {/* Upload overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <label htmlFor="profile-picture-upload" className="cursor-pointer">
                  <Camera className="w-6 h-6 text-white" />
                  <input
                    id="profile-picture-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    className="hidden"
                    disabled={isUploadingPicture}
                  />
                </label>
              </div>
              
              {/* Loading overlay */}
              {isUploadingPicture && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">{profileData?.firstName} {profileData?.lastName}</h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Joined {profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <Button variant="outline" onClick={() => window.location.href = '/profile-print'} className="w-full sm:w-auto pdf-hidden">
              <FileText className="mr-2 h-4 w-4" />
              Employer View
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/home'} className="w-full sm:w-auto pdf-hidden">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </div>
        </div>
        
        {/* Dynamic Profile Status Card */}
        <div className="rounded-lg p-4 sm:p-6 border border-gray-200" style={{backgroundColor: hasBehavioralData ? '#fff9e6' : '#f3f4f6'}}>
          <div className="flex items-start gap-3 sm:gap-4">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
              hasBehavioralData ? 'bg-yellow-100' : 'bg-pink-100'
            }`}>
              {hasBehavioralData ? (
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              ) : (
                <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-pink-600" />
              )}
            </div>
            <div className="flex-1">
              {hasBehavioralData ? (
                <>
                  <h3 className="font-semibold text-gray-900 mb-1 text-base sm:text-lg">
                    🎉 Your profile is ready for job applications
                  </h3>
                  <p className="text-gray-700 text-sm mb-3">
                    You can now apply for Pollen approved jobs that match your skills and behavioural profile. 
                    Apply to jobs to demonstrate your skills through bespoke assessments.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-gray-700" />
                      <span className="font-medium">Profile Complete</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4 text-gray-700" />
                      <span className="font-medium">Job Matching Active</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-semibold text-gray-900 mb-1 text-base sm:text-lg">
                    Get started by learning more about your work style strengths
                  </h3>
                  <p className="text-gray-700 text-sm mb-3">
                    Complete your behavioural assessment to unlock personalised job matching, discover your ideal work environment, and receive career insights tailored to your unique strengths.
                  </p>
                  <Button 
                    onClick={() => setLocation('/behavioral-assessment?start=true')}
                    size="sm" 
                    className="bg-pink-600 hover:bg-pink-700 text-white"
                    style={{backgroundColor: "#E2007A"}}
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 h-auto">
          <TabsTrigger value="overview" className="text-xs sm:text-sm px-1 sm:px-3 data-[state=active]:font-bold data-[state=active]:border-b-2 data-[state=active]:bg-yellow-50" style={{borderColor: '#E2007A'}}>Overview</TabsTrigger>
          <TabsTrigger value="behavioural" className="text-xs sm:text-sm px-1 sm:px-3 data-[state=active]:font-bold data-[state=active]:border-b-2 data-[state=active]:bg-yellow-50" style={{borderColor: '#E2007A'}}>Behavioural</TabsTrigger>
          <TabsTrigger value="testimonials" className="text-xs sm:text-sm px-1 sm:px-3 data-[state=active]:font-bold data-[state=active]:border-b-2 data-[state=active]:bg-yellow-50" style={{borderColor: '#E2007A'}}>References</TabsTrigger>
          <TabsTrigger value="insights" className="text-xs sm:text-sm px-1 sm:px-3 data-[state=active]:font-bold data-[state=active]:border-b-2 data-[state=active]:bg-yellow-50" style={{borderColor: '#E2007A'}}>Personal Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          
          {/* Two-column responsive layout */}
          <div className="max-w-screen-xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* LEFT COLUMN */}
              <section className="space-y-6">
                {/* Profile Strength */}
                <Card className="rounded-2xl shadow-md bg-white border border-gray-200">
                  <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2" style={{fontFamily: 'Sora'}}>
                    <Target className="w-5 h-5" style={{color: "#E2007A"}} />
                    Profile Strength
                  </CardTitle>
                  <CardDescription>
                    Complete your profile sections to improve your job matching
                  </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Profile Completion</span>
                          <span className="font-medium">{profileData?.profileCompleteness || 80}%</span>
                        </div>
                        <Progress value={profileData?.profileCompleteness || 80} className="h-2" />
                        {(profileData?.profileCompleteness || 80) < 100 && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 w-full text-xs"
                            onClick={() => window.location.href = '/profile-checkpoints'}
                          >
                            Complete Profile
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div className="text-center p-3 bg-gray-50 rounded border">
                          <div className="font-semibold text-gray-900">{USER_PROFILE.completedApplications}</div>
                          <div className="text-gray-600">Applications</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded border">
                          <div className="font-semibold text-gray-900">{profileData?.assessmentScore || 87}%</div>
                          <div className="text-gray-600">Best Score</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded border">
                          <div className="font-semibold text-gray-900">Active</div>
                          <div className="text-gray-600">Job Matching</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Application - Full width */}
                <Card className="rounded-2xl shadow-md bg-white border border-gray-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2" style={{fontFamily: 'Sora'}}>
                        <Mail className="w-5 h-5 text-green-600" />
                        Recent Application
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.location.href = '/applications'}
                        className="text-xs"
                      >
                        View All Applications
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {COMPLETED_APPLICATIONS.map((application) => (
                      <div key={application.id} className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{application.title}</h4>
                            <p className="text-sm text-muted-foreground">Applied {application.appliedDate} • {application.company}</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              {application.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-green-50 rounded border border-green-200">
                          <p className="text-sm text-green-800">
                            <strong>Assessment Score:</strong> {application.assessmentScore}/100
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

              </section>

              {/* RIGHT COLUMN */}
              <section className="space-y-6">



                {/* Other Recommended Actions */}
                <Card className="rounded-2xl shadow-md bg-white border border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg" style={{fontFamily: 'Sora'}}>Other Recommended Actions</CardTitle>
                    <CardDescription>
                      Continue building your profile and engaging with opportunities
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <Button className="w-full" onClick={() => window.location.href = '/jobs'}>
                        <Star className="mr-2 h-4 w-4" />
                        Browse Job Opportunities
                      </Button>
                      <Button variant="outline" className="w-full" onClick={() => setActiveTab('testimonials')}>
                        <Users className="mr-2 h-4 w-4" />
                        Add References
                      </Button>
                      <Button variant="outline" className="w-full" onClick={() => window.location.href = '/community'}>
                        <Heart className="mr-2 h-4 w-4" />
                        Join Community Activities
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Recommended Job Opportunities */}
                <Card className="rounded-2xl shadow-md bg-white border border-gray-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2" style={{fontFamily: 'Sora'}}>
                        <Star className="w-5 h-5 text-yellow-600" />
                        Recommended Job Opportunities
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLocation('/jobs')}
                        className="text-xs"
                      >
                        View All Jobs
                      </Button>
                    </div>
                    <CardDescription>
                      Based on your behavioural profile and experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <h5 className="font-medium">Social Media Coordinator</h5>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button size="sm" onClick={() => setLocation('/job-application/job-001')}>
                            View Role
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <h5 className="font-medium">Marketing Assistant</h5>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button size="sm" onClick={() => setLocation('/job-application/job-002')}>
                            View Role
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>
            </div>
          </div>
        </TabsContent>

        {/* Behavioural Profile Tab */}
        <TabsContent value="behavioural" className="space-y-6">
          {!hasBehavioralData ? (
            // Show assessment prompt when no behavioural data
            <div className="text-center py-12">
              <Card className="max-w-md mx-auto">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-8 h-8 text-pink-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Take Your Behavioural Assessment</h3>
                  <p className="text-gray-600 mb-6">
                    Complete our behavioural assessment to unlock personalised insights about your work style, communication preferences, and ideal career paths.
                  </p>
                  <Button 
                    onClick={() => setLocation('/behavioral-assessment')}
                    className="bg-pink-600 hover:bg-pink-700 text-white"
                    style={{backgroundColor: "#E2007A"}}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <>
              {/* Personality Type Display */}
              {profileData?.behavioralAssessment && (
                <div className="bg-pink-50 border-pink-200 rounded-lg p-6 border text-center">
                  <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Sora', color: '#E2007A' }}>
                    🚀 {profileData.behavioralAssessment.personalityType}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {profileData.behavioralAssessment.summary}
                  </p>
                </div>
              )}

              {/* Behavioral Breakdown - IDENTICAL to Assessment */}
              {profileData?.behavioralAssessment?.discProfile && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      🧠 Behavioural Breakdown
                    </h3>
                    <Dialog open={showLearnMoreDialog} onOpenChange={setShowLearnMoreDialog}>
                      <DialogTrigger asChild>
                        <button className="text-blue-600 text-sm font-medium hover:text-blue-800">Learn More</button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Understanding Your Behavioural Assessment</DialogTitle>
                          <DialogDescription>
                            Learn about the DISC assessment and what your results mean
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">What is DISC?</h4>
                            <p className="text-sm text-gray-600">
                              DISC is a behavioral assessment tool that measures your natural preferences in four key areas:
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                                <h5 className="font-medium">Dominance (D)</h5>
                              </div>
                              <p className="text-sm text-gray-600">
                                How you approach problems and challenges. High D indicates a direct, results-oriented style.
                              </p>
                            </div>
                            
                            <div className="border rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <h5 className="font-medium">Influence (I)</h5>
                              </div>
                              <p className="text-sm text-gray-600">
                                How you influence and persuade others. High I indicates an outgoing, people-focused style.
                              </p>
                            </div>
                            
                            <div className="border rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                                <h5 className="font-medium">Steadiness (S)</h5>
                              </div>
                              <p className="text-sm text-gray-600">
                                How you respond to pace and stability. High S indicates a steady, patient approach.
                              </p>
                            </div>
                            
                            <div className="border rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                                <h5 className="font-medium">Conscientiousness (C)</h5>
                              </div>
                              <p className="text-sm text-gray-600">
                                How you respond to rules and procedures. High C indicates an analytical, detail-oriented style.
                              </p>
                            </div>
                          </div>
                          
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-800 mb-2">How to Use Your Results</h4>
                            <ul className="text-sm text-blue-700 space-y-1">
                              <li>• Your personality type reflects your natural working style</li>
                              <li>• Use this insight when applying for roles that match your strengths</li>
                              <li>• Share your behavioral preferences with potential employers</li>
                              <li>• Remember: there are no "good" or "bad" profiles - just different approaches</li>
                            </ul>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Reliable Results Section */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <h4 className="font-semibold text-green-800">Reliable Results</h4>
                    </div>
                    <p className="text-green-700 text-sm">
                      This data provides a reliable analysis of your natural behavioural preferences and work style. It's not about strengths or weaknesses, but simply how you naturally approach tasks and interact with others.
                    </p>
                  </div>

                  {/* Pie Chart */}
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
                        {(() => {
                          const { red, yellow, green, blue } = profileData.behavioralAssessment.discProfile;
                          const total = red + yellow + green + blue;
                          if (total === 0) return null;
                          
                          let cumulativeAngle = 0;
                          const slices = [
                            { value: red, color: '#dc2626' },
                            { value: yellow, color: '#eab308' },
                            { value: green, color: '#16a34a' },
                            { value: blue, color: '#2563eb' }
                          ].filter(slice => slice.value > 0);
                          
                          return slices.map((slice, index) => {
                            const angle = (slice.value / total) * 360;
                            const startAngle = cumulativeAngle;
                            const endAngle = cumulativeAngle + angle;
                            cumulativeAngle += angle;
                            
                            const x1 = 100 + 80 * Math.cos((startAngle * Math.PI) / 180);
                            const y1 = 100 + 80 * Math.sin((startAngle * Math.PI) / 180);
                            const x2 = 100 + 80 * Math.cos((endAngle * Math.PI) / 180);
                            const y2 = 100 + 80 * Math.sin((endAngle * Math.PI) / 180);
                            const largeArcFlag = angle > 180 ? 1 : 0;
                            
                            return (
                              <path
                                key={index}
                                d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                                fill={slice.color}
                                stroke="white"
                                strokeWidth="3"
                              />
                            );
                          });
                        })()}
                      </svg>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex justify-center mb-6">
                    <div className="flex gap-6">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                        <span className="text-sm">Dominance</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm">Influence</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                        <span className="text-sm">Steadiness</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                        <span className="text-sm">Conscientiousness</span>
                      </div>
                    </div>
                  </div>

                  {/* Percentage Boxes */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-red-600 mb-1">{profileData.behavioralAssessment.discProfile.red}%</div>
                      <div className="text-sm font-semibold text-red-800">Dominance</div>
                      <div className="text-xs text-red-600">Results-Focused</div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-600 mb-1">{profileData.behavioralAssessment.discProfile.yellow}%</div>
                      <div className="text-sm font-semibold text-yellow-800">Influence</div>
                      <div className="text-xs text-yellow-600">People-Focused</div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">{profileData.behavioralAssessment.discProfile.green}%</div>
                      <div className="text-sm font-semibold text-green-800">Steadiness</div>
                      <div className="text-xs text-green-600">Process-Focused</div>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-1">{profileData.behavioralAssessment.discProfile.blue}%</div>
                      <div className="text-sm font-semibold text-blue-800">Conscientiousness</div>
                      <div className="text-xs text-blue-600">Detail-Focused</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Two Column Layout for Detailed Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* How You Make Decisions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">How You Make Decisions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-gray-700">
                          You like to make quick, confident decisions focused on results and outcomes. You're comfortable with taking calculated risks to achieve your goals.
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">You prefer having enough information before deciding</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">You consider potential outcomes and results</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">You're comfortable making quick decisions when needed</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Communication Style */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Your Communication Style</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-gray-700">
                          You communicate in a clear, direct way and appreciate when others do the same. You focus on results and practical solutions.
                        </p>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">You prefer direct, to-the-point communication</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">You focus on results and practical solutions</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">You appreciate efficiency in conversations</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Career Motivators */}
                  {profileData?.behavioralAssessment?.careerMotivators && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Career Motivators</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">Achieving challenging goals and measurable results</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">Having autonomy and control over your work</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">Professional growth and development opportunities</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">Recognition for your contributions and achievements</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Two-column layout for Work Environment and Role Types */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Ideal Work Environment */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Ideal Work Environment</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                              <h4 className="font-medium text-gray-900 mb-1">Results-Oriented Culture</h4>
                              <p className="text-sm text-gray-600">You perform well in environments that focus on outcomes and achievement</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                              <h4 className="font-medium text-gray-900 mb-1">Professional Development</h4>
                              <p className="text-sm text-gray-600">You benefit from environments that offer learning opportunities and career growth support</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                              <h4 className="font-medium text-gray-900 mb-1">Recognition & Achievement</h4>
                              <p className="text-sm text-gray-600">You thrive where contributions are acknowledged and achievements are celebrated</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                              <h4 className="font-medium text-gray-900 mb-1">Supportive Leadership</h4>
                              <p className="text-sm text-gray-600">You work best with managers who provide clear guidance and constructive feedback</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Compatible Role Types */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Compatible Role Types</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                              <h4 className="font-medium text-gray-900 mb-1">Leading projects and initiatives</h4>
                              <p className="text-sm text-gray-600">Taking charge of important work and driving results</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                              <h4 className="font-medium text-gray-900 mb-1">Client-facing and business development</h4>
                              <p className="text-sm text-gray-600">Building relationships with external stakeholders and growing business</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                              <h4 className="font-medium text-gray-900 mb-1">Process optimisation and improvement</h4>
                              <p className="text-sm text-gray-600">Finding ways to make workflows more efficient and effective</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                              <h4 className="font-medium text-gray-900 mb-1">Supporting team success</h4>
                              <p className="text-sm text-gray-600">Contributing to collective achievement and team goals</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              {/* Key Strengths - Full Width */}
              {profileData?.behavioralAssessment?.keyStrengths && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Key Strengths</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {profileData.behavioralAssessment.keyStrengths.map((strength: any, index: number) => (
                        <div key={index} className="border-l-4 border-pink-200 pl-4 bg-pink-50 p-4 rounded-r-lg">
                          <h4 className="font-semibold text-gray-900 mb-2">{strength.title}</h4>
                          <p className="text-gray-600 text-sm">{strength.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        {/* References Tab */}
        <TabsContent value="testimonials" className="space-y-6">
          <div className="max-w-screen-xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* LEFT COLUMN - Professional References */}
              <section className="space-y-6">
                <Card className="rounded-2xl shadow-md bg-white border border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2" style={{fontFamily: 'Sora'}}>
                      <MessageSquare className="w-5 h-5" style={{color: "#E2007A"}} />
                      Professional References
                    </CardTitle>
                    <CardDescription>
                      Testimonials from colleagues, supervisors, and mentors
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Reference 1 */}
                    <div className="border-l-4 border-blue-200 pl-4 bg-blue-50 p-4 rounded-r-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            Sarah Chen
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          </h4>
                          <p className="text-sm text-gray-600">Team Lead at TechStart Inc</p>
                          <p className="text-xs text-gray-500">Former Project Manager</p>
                        </div>
                        <span className="text-xs text-gray-400">November 2024</span>
                      </div>
                      <blockquote className="text-sm text-gray-700 italic">
                        "Alex demonstrated exceptional creativity and leadership during our marketing campaign project. Their ability to think outside the box while maintaining attention to detail made them an invaluable team member. They consistently delivered high-quality work and showed great initiative in problem-solving."
                      </blockquote>
                    </div>

                    {/* Reference 2 */}
                    <div className="border-l-4 border-green-200 pl-4 bg-green-50 p-4 rounded-r-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                            Dr. Michael Rodriguez
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          </h4>
                          <p className="text-sm text-gray-600">Lecturer at University Marketing Department</p>
                          <p className="text-xs text-gray-500">Academic Supervisor</p>
                        </div>
                        <span className="text-xs text-gray-400">October 2024</span>
                      </div>
                      <blockquote className="text-sm text-gray-700 italic">
                        "Alex was one of my most engaged students, constantly bringing fresh perspectives to our discussions. Their final project on digital marketing strategies showed remarkable analytical thinking and creativity. I'm confident they will excel in any marketing role."
                      </blockquote>
                    </div>


                  </CardContent>
                </Card>

                {/* Request New Reference Form */}
                <Card className="rounded-2xl shadow-md bg-white border border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-green-600" style={{fontFamily: 'Sora'}}>
                      <Plus className="w-5 h-5" />
                      Request New Reference
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Reference Name</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder="e.g. Sarah Johnson"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Email Address</label>
                        <input 
                          type="email" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder="sarah@company.com"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Their Role/Title</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder="Marketing Manager"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Company/Organisation</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          placeholder="Tech Company Ltd"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Your relationship (e.g. Former Manager, Professor)</label>
                      <input 
                        type="text" 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="Former Direct Manager"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Personal message to include with your request...</label>
                      <textarea 
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                        placeholder="Hi [Name], I hope you're well. I'm updating my professional profile and would love to include a reference from you about our work together..."
                      ></textarea>
                    </div>
                    <Button 
                      className="w-full text-white"
                      style={{backgroundColor: "#E2007A"}}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Send Reference Request
                    </Button>
                  </CardContent>
                </Card>
              </section>

              {/* RIGHT COLUMN - Pending Requests & Tips */}
              <section className="space-y-6">
                {/* Pending Requests */}
                <Card className="rounded-2xl shadow-md bg-white border border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2" style={{fontFamily: 'Sora'}}>
                      <Clock className="w-5 h-5" style={{color: "#ff9500"}} />
                      Pending Requests
                    </CardTitle>
                    <CardDescription>
                      Reference requests awaiting response
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-l-4 border-orange-200 pl-4 bg-orange-50 p-4 rounded-r-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">Emma Wilson</h4>
                          <p className="text-sm text-gray-600">Internship Supervisor at Creative Agency</p>
                          <p className="text-xs text-gray-500">Requested on December 13, 2024</p>
                        </div>
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">Pending</span>
                      </div>
                      <p className="text-sm text-gray-700">
                        "Hi Emma, I'd love to include a reference from you in my professional profile. Could you provide a brief testimonial about our work together during my internship?"
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Tips for Great References */}
                <Card className="rounded-2xl shadow-md bg-white border border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle style={{fontFamily: 'Sora'}}>Tips for Great References</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-gray-700">Choose people who know your work well and can speak to specific achievements</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-gray-700">Include a variety of perspectives: supervisors, colleagues, professors, or clients</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-gray-700">Give context in your message about what role you're applying for</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-gray-700">Follow up politely if you don't hear back within a week</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Reference Statistics */}
                <Card className="rounded-2xl shadow-md bg-white border border-gray-200">
                  <CardHeader className="pb-4">
                    <CardTitle style={{fontFamily: 'Sora'}}>Reference Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-1">2</div>
                        <div className="text-sm font-medium text-blue-800">Active References</div>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-green-600 mb-1">2</div>
                        <div className="text-sm font-medium text-green-800">Verified</div>
                      </div>
                    </div>
                    <p className="text-center text-xs text-gray-500 mt-4">
                      References strengthen your profile credibility
                    </p>
                  </CardContent>
                </Card>
              </section>
            </div>
          </div>
        </TabsContent>

        {/* Personal Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="max-w-6xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Personal Insights</h1>
                <p className="text-gray-600 mt-1">Your personal story and motivations</p>
              </div>
              <Button 
                onClick={() => setIsEditingInsights(!isEditingInsights)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                {isEditingInsights ? 'Save Changes' : 'Edit Insights'}
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Most Happy When */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg text-teal-600 flex items-center gap-2">
                      <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                      MOST HAPPY WHEN...
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditingInsights ? (
                      <Textarea
                        value={editedInsights.happyWhen}
                        onChange={(e) => setEditedInsights({...editedInsights, happyWhen: e.target.value})}
                        className="min-h-[80px]"
                        placeholder="What makes you happiest at work?"
                      />
                    ) : (
                      <p className="text-gray-700">{editedInsights.happyWhen}</p>
                    )}
                  </CardContent>
                </Card>

                {/* Most Proud Of */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg text-teal-600 flex items-center gap-2">
                      <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                      MOST PROUD OF...
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditingInsights ? (
                      <Textarea
                        value={editedInsights.proudOf}
                        onChange={(e) => setEditedInsights({...editedInsights, proudOf: e.target.value})}
                        className="min-h-[80px]"
                        placeholder="What achievement are you most proud of?"
                      />
                    ) : (
                      <p className="text-gray-700">{editedInsights.proudOf}</p>
                    )}
                  </CardContent>
                </Card>



                {/* Described by Friends */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg text-teal-600 flex items-center gap-2">
                      <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                      DESCRIBED BY FRIENDS AS...
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditingInsights ? (
                      <Input
                        value={editedInsights.friendsDescribe}
                        onChange={(e) => setEditedInsights({...editedInsights, friendsDescribe: e.target.value})}
                        placeholder="How do friends describe you?"
                      />
                    ) : (
                      <p className="text-gray-700">{editedInsights.friendsDescribe}</p>
                    )}
                  </CardContent>
                </Card>

                {/* Described by Teachers */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg text-teal-600 flex items-center gap-2">
                      <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                      DESCRIBED BY TEACHERS AS...
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditingInsights ? (
                      <Input
                        value={editedInsights.teachersDescribe}
                        onChange={(e) => setEditedInsights({...editedInsights, teachersDescribe: e.target.value})}
                        placeholder="How do teachers describe you?"
                      />
                    ) : (
                      <p className="text-gray-700">{editedInsights.teachersDescribe}</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Perfect Job */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg text-teal-600 flex items-center gap-2">
                      <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                      PERFECT JOB IS...
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isEditingInsights ? (
                      <Textarea
                        value={editedInsights.perfectJob}
                        onChange={(e) => setEditedInsights({...editedInsights, perfectJob: e.target.value})}
                        className="min-h-[80px]"
                        placeholder="Describe your ideal role..."
                      />
                    ) : (
                      <p className="text-gray-700">{editedInsights.perfectJob}</p>
                    )}
                  </CardContent>
                </Card>

                {/* Career Interests */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg text-teal-600">CAREER INTERESTS</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Interested in roles in...</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">Marketing & Advertising</Badge>
                        <Badge variant="secondary">Non-profit & Social Impact</Badge>
                        <Badge variant="secondary">Creative Services</Badge>
                        <Badge variant="secondary">Technology & Software</Badge>
                        <Badge variant="secondary">Media & Entertainment</Badge>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Ideal work environment...</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">Collaborative</Badge>
                        <Badge variant="secondary">Fast paced</Badge>
                        <Badge variant="secondary">Creative freedom</Badge>
                        <Badge variant="secondary">Learning opportunities</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Application Journey */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg text-gray-900">Application Journey</CardTitle>
                    <CardDescription>Your career development progress</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">Profile Complete</h4>
                        <p className="text-sm text-gray-600">Ready for job applications</p>
                        <p className="text-sm text-green-600">Profile completed and behavioural assessment finished</p>
                        <Badge className="mt-1 bg-green-600 text-white text-xs">✓ Achieved</Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">First Application</h4>
                        <p className="text-sm text-gray-600">Started applying for jobs</p>
                        <p className="text-sm text-green-600">2 applications submitted</p>
                        <Badge className="mt-1 bg-green-600 text-white text-xs">✓ Achieved</Badge>
                      </div>
                    </div>


                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Save/Cancel Buttons for Edit Mode */}
            {isEditingInsights && (
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveInsights}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}
