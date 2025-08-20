import React, { useState, useEffect, useMemo } from "react";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DiscRadarChart } from "@/components/disc-radar-chart";
import InterviewManagement from "@/components/interview-management";
import { 
  Users, Search, Filter, Grid3x3, List, Eye, FileDown, 
  MapPin, Clock, Star, Calendar, MessageSquare, CheckCircle,
  XCircle, AlertCircle, Briefcase, GraduationCap, Trophy,
  FileSpreadsheet, MoreHorizontal, ArrowLeft, ArrowRight,
  Mail, Phone, Target, Heart, Award, TrendingUp, Brain, 
  Radar, Video, Lightbulb, HelpCircle, BarChart3, ChevronUp, 
  ChevronDown, Plus, X, UserCheck
} from "lucide-react";

// Combined candidate interface
interface CandidateMatch {
  id: number;
  name: string;
  pronouns: string;
  matchScore: number;
  location: string;
  skills: string[];
  status: string;
  appliedDate: string;
  behavioralType: string;
  keyStrengths: string[];
  challengeScore: number;
  availability: string;
  jobId: number;
  jobTitle: string;
  jobDepartment: string;
  communityEngagement: {
    totalPoints: number;
    proactivityScore: number;
    workshopsAttended: number;
    membersHelped: number;
    currentStreak: number;
    communityTier: string;
  };
  email?: string;
  phone?: string;
  profileImageUrl?: string;
  educationLevel?: string;
  workExperience?: string;
  personalityInsights?: string;
  motivationalFactors?: string[];
  workStylePreferences?: string[];
  culturalFit?: string;
  portfolioLink?: string;
  linkedInProfile?: string;
  certifications?: string[];
  languages?: string[];
  hobbies?: string[];
  volunteerWork?: string[];
  personalStatement?: string;
  references?: string[];
  salaryExpectation?: string;
  noticePeriod?: string;
  workAuthorization?: string;
  interviewAvailability?: string[];
  pollenTeamInsights?: {
    keyTakeaways: string[];
    workingStyles: string[];
    careerAspirations: string[];
    motivation: string;
    assessmentBlurb: string;
  };
}

// Mock job data
const mockJobs = [
  { id: 1, title: "Marketing Assistant", department: "Marketing", openPositions: 3 },
  { id: 2, title: "Sales Coordinator", department: "Sales", openPositions: 2 },
  { id: 3, title: "Content Creator", department: "Marketing", openPositions: 1 },
  { id: 4, title: "Customer Success Associate", department: "Customer Success", openPositions: 2 },
  { id: 5, title: "Junior Data Analyst", department: "Analytics", openPositions: 1 }
];

// Combined mock candidates data
const mockCandidates: CandidateMatch[] = [
  // Marketing Assistant candidates
  {
    id: 20, name: "Sarah Chen", pronouns: "she/her", matchScore: 92,
    location: "London, UK", 
    skills: ["Digital Marketing", "Social Media", "Content Creation", "Analytics"],
    status: "new", appliedDate: "2025-01-22", behavioralType: "The Social Butterfly",
    keyStrengths: ["Natural collaborative energy", "Creative problem-solving", "Thoughtful communication"],
    challengeScore: 87, availability: "Available immediately",
    jobId: 1, jobTitle: "Marketing Assistant", jobDepartment: "Marketing",
    communityEngagement: { totalPoints: 385, proactivityScore: 7.8, workshopsAttended: 3, membersHelped: 8, currentStreak: 12, communityTier: "Rising Star" },
    email: "sarah.chen@email.com", phone: "+44 7700 900123",
    educationLevel: "Bachelor's in Marketing", workExperience: "2 years",
    personalityInsights: "Highly collaborative with strong creative instincts. Thrives in team environments and excels at building relationships.",
    motivationalFactors: ["Creative freedom", "Team collaboration", "Learning opportunities"],
    workStylePreferences: ["Flexible hours", "Collaborative environment", "Regular feedback"],
    culturalFit: "Strong alignment with company values of innovation and teamwork",
    portfolioLink: "https://sarahchen.design",
    linkedInProfile: "https://linkedin.com/in/sarahchen",
    certifications: ["Google Analytics", "HubSpot Content Marketing"],
    languages: ["English (Native)", "Mandarin (Fluent)"],
    hobbies: ["Photography", "Blogging", "Hiking"],
    pollenTeamInsights: {
      keyTakeaways: ["Natural collaborative energy", "Creative problem-solving approach", "Strong digital marketing foundation"],
      workingStyles: ["Thrives in team environments", "Prefers structured feedback cycles", "Enjoys creative brainstorming sessions"],
      careerAspirations: ["Lead creative campaigns", "Develop expertise in data-driven marketing", "Build strong client relationships"],
      motivation: "Driven by the opportunity to create meaningful connections between brands and audiences through innovative marketing strategies",
      assessmentBlurb: "Sarah is creative, ambitious and naturally collaborative with exceptional ability to bring analytical thinking and creative flair to problem-solving. Recently completing her studies, she's excited about joining dynamic teams where creativity meets meaningful impact. What impressed us was her innovative approach to engaging people in solutions — she doesn't just solve problems, she finds creative ways to involve others in the process. Sarah thrives in collaborative environments whilst bringing original ideas to life. She's particularly drawn to roles combining strategy with creativity, developing campaigns that genuinely connect with people. She finds real satisfaction in collaborative projects and facilitates productive discussions whilst maintaining focus on deliverable outcomes. Outside work, she's passionate about design and marketing, constantly exploring trends that could enhance professional work. She's ready to bring creative skills and collaborative energy to teams that appreciate fresh perspectives and meaningful work."
    }
  },
  {
    id: 21, name: "James Mitchell", pronouns: "he/him", matchScore: 89,
    location: "Manchester, UK",
    skills: ["Marketing Strategy", "Data Analysis", "Project Management", "Communication"],
    status: "in_progress", appliedDate: "2025-01-21", behavioralType: "Strategic Achiever",
    keyStrengths: ["Analytical thinking", "Strategic planning", "Process improvement"],
    challengeScore: 91, availability: "2 weeks notice required",
    jobId: 1, jobTitle: "Marketing Assistant", jobDepartment: "Marketing",
    communityEngagement: { totalPoints: 420, proactivityScore: 8.2, workshopsAttended: 4, membersHelped: 12, currentStreak: 8, communityTier: "Community Leader" },
    email: "james.mitchell@email.com", phone: "+44 7700 900124",
    educationLevel: "Master's in Business Administration", workExperience: "3 years",
    personalityInsights: "Detail-oriented strategist who excels at turning data into actionable insights. Strong leadership potential.",
    motivationalFactors: ["Strategic challenges", "Data-driven decisions", "Leadership opportunities"],
    workStylePreferences: ["Structured planning", "Clear objectives", "Autonomy"],
    culturalFit: "Excellent fit for analytical and goal-oriented culture",
    pollenTeamInsights: {
      keyTakeaways: ["Analytical thinking", "Strategic planning expertise", "Natural leadership qualities"],
      workingStyles: ["Structured approach", "Data-driven decisions", "Collaborative leadership"],
      careerAspirations: ["Marketing strategy leadership", "Data analytics specialisation", "Team management"],
      motivation: "Driven by solving complex business challenges through strategic thinking and data analysis",
      assessmentBlurb: "James is a strategic thinker with exceptional analytical capabilities and natural leadership instincts. With his MBA background, he brings sophisticated business acumen to marketing challenges, consistently identifying opportunities others miss. What stands out is his ability to translate complex data into actionable strategies while maintaining clear communication with diverse stakeholders. James excels at systematic problem-solving and thrives in structured environments where he can drive measurable results. He's particularly energized by strategic planning sessions and enjoys mentoring junior team members. His approach combines rigorous analysis with collaborative leadership, making him valuable for projects requiring both analytical depth and team coordination. James is drawn to roles where he can influence strategic direction and implement data-driven solutions that deliver meaningful business impact."
    }
  },
  {
    id: 23, name: "Priya Singh", pronouns: "she/her", matchScore: 85,
    location: "Birmingham, UK",
    skills: ["Content Marketing", "SEO", "Brand Management", "Creative Writing"],
    status: "interview_scheduled", appliedDate: "2025-01-20", behavioralType: "Creative Communicator",
    keyStrengths: ["Creative storytelling", "Brand awareness", "Content strategy"],
    challengeScore: 82, availability: "Available immediately",
    jobId: 1, jobTitle: "Marketing Assistant", jobDepartment: "Marketing",
    communityEngagement: { totalPoints: 350, proactivityScore: 7.2, workshopsAttended: 2, membersHelped: 6, currentStreak: 15, communityTier: "Rising Star" },
    email: "priya.singh@email.com", phone: "+44 7700 900125",
    educationLevel: "Bachelor's in English Literature", workExperience: "1.5 years",
    personalityInsights: "Creative and empathetic communicator with strong writing skills and brand intuition.",
    motivationalFactors: ["Creative expression", "Brand building", "Content impact"],
    workStylePreferences: ["Creative freedom", "Feedback culture", "Growth opportunities"],
    culturalFit: "Strong fit for creative and dynamic environment",
    pollenTeamInsights: {
      keyTakeaways: ["Creative storytelling ability", "Strong brand intuition", "Content strategy thinking"],
      workingStyles: ["Creative collaboration", "Iterative feedback cycles", "Brand-focused approach"],
      careerAspirations: ["Content marketing leadership", "Brand strategy development", "Creative campaign management"],
      motivation: "Passionate about creating compelling content that builds authentic brand connections",
      assessmentBlurb: "Priya is a natural storyteller with exceptional creative instincts and strong brand intuition. Her English Literature background gives her unique perspective on crafting compelling narratives that resonate with diverse audiences. What impressed us most was her ability to understand brand personality and translate complex ideas into engaging, accessible content. Priya thrives in collaborative creative environments where she can bounce ideas off others while contributing original thinking. She's particularly skilled at content strategy, understanding how different pieces work together to build cohesive brand experiences. Her approach combines creative flair with strategic thinking, making her valuable for campaigns requiring both creativity and clear messaging. Priya is energized by projects where she can develop authentic brand voices and create content that genuinely connects with people."
    }
  },
  {
    id: 24, name: "Alex Chen", pronouns: "they/them", matchScore: 91,
    location: "London, UK",
    skills: ["Digital Strategy", "Analytics", "Content Creation", "Project Management"],
    status: "feedback_sent", appliedDate: "2025-01-18", behavioralType: "Strategic Thinker",
    keyStrengths: ["Strategic planning", "Data-driven decisions", "Cross-functional collaboration"],
    challengeScore: 88, availability: "Available immediately",
    jobId: 1, jobTitle: "Marketing Assistant", jobDepartment: "Marketing",
    communityEngagement: { totalPoints: 420, proactivityScore: 8.1, workshopsAttended: 4, membersHelped: 12, currentStreak: 15, communityTier: "Community Champion" },
    pollenTeamInsights: {
      keyTakeaways: ["Strategic thinking", "Multi-platform understanding", "Audience connection"],
      workingStyles: ["Strategic approach", "Data-driven", "Cross-functional collaboration"],
      careerAspirations: ["Digital strategy lead", "Analytics specialist", "Growth marketing"],
      motivation: "Creating data-driven strategies that drive meaningful engagement",
      assessmentBlurb: "Alex shows remarkable strategic thinking and has a natural ability to connect with audiences across different platforms. Positive feedback sent, awaiting response."
    }
  },
  {
    id: 25, name: "David Kumar", pronouns: "he/him", matchScore: 92,
    location: "Liverpool, UK",
    skills: ["Marketing Automation", "Data Analysis", "Campaign Management", "A/B Testing"],
    status: "hired", appliedDate: "2025-01-14", behavioralType: "Analytical Achiever",
    keyStrengths: ["Data analysis", "Process optimization", "Technical skills"],
    challengeScore: 94, availability: "Hired - starting next month",
    jobId: 1, jobTitle: "Marketing Assistant", jobDepartment: "Marketing",
    communityEngagement: { totalPoints: 450, proactivityScore: 8.7, workshopsAttended: 5, membersHelped: 15, currentStreak: 18, communityTier: "Expert Contributor" },
    pollenTeamInsights: {
      keyTakeaways: ["Technical expertise", "Creative vision", "Process optimization"],
      workingStyles: ["Analytical approach", "Technical precision", "Results-focused"],
      careerAspirations: ["Marketing automation lead", "Data analysis expert", "Campaign optimization"],
      motivation: "Optimizing marketing processes through technical innovation",
      assessmentBlurb: "David's technical expertise combined with creative vision makes him an excellent addition to the marketing team. Accepted offer."
    }
  },
  {
    id: 26, name: "Maya Patel", pronouns: "she/her", matchScore: 78,
    location: "Edinburgh, UK",
    skills: ["Content Writing", "Social Media", "Brand Management", "Market Research"],
    status: "rejected", appliedDate: "2025-01-12", behavioralType: "Enthusiastic Learner",
    keyStrengths: ["Learning agility", "Communication", "Brand awareness"],
    challengeScore: 72, availability: "Available immediately",
    jobId: 1, jobTitle: "Marketing Assistant", jobDepartment: "Marketing",
    communityEngagement: { totalPoints: 250, proactivityScore: 5.9, workshopsAttended: 2, membersHelped: 4, currentStreak: 6, communityTier: "New Member" },
    pollenTeamInsights: {
      keyTakeaways: ["Solid foundation", "Learning potential", "Brand awareness"],
      workingStyles: ["Eager learning", "Communication focus", "Growth mindset"],
      careerAspirations: ["Content specialist", "Brand coordinator", "Social media expert"],
      motivation: "Growing skills while contributing to brand development",
      assessmentBlurb: "Maya has solid foundational skills but may be better suited for a more junior position to develop further."
    }
  },
  {
    id: 27, name: "Tom Rodriguez", pronouns: "he/him", matchScore: 88,
    location: "Newcastle, UK",
    skills: ["Performance Marketing", "PPC", "Analytics", "Conversion Optimization"],
    status: "offer_declined", appliedDate: "2025-01-10", behavioralType: "Results Driver",
    keyStrengths: ["Performance focus", "Analytical thinking", "Goal orientation"],
    challengeScore: 85, availability: "Declined offer",
    jobId: 1, jobTitle: "Marketing Assistant", jobDepartment: "Marketing",
    communityEngagement: { totalPoints: 380, proactivityScore: 7.5, workshopsAttended: 3, membersHelped: 9, currentStreak: 11, communityTier: "Rising Star" },
    pollenTeamInsights: {
      keyTakeaways: ["Performance marketing expertise", "Results-driven", "Analytical mindset"],
      workingStyles: ["Performance focus", "Data-driven decisions", "Goal-oriented"],
      careerAspirations: ["Performance marketing lead", "PPC specialist", "Conversion optimization"],
      motivation: "Driving measurable results through optimized campaigns",
      assessmentBlurb: "Tom showed excellent skills and cultural fit but ultimately chose a different opportunity that better aligned with his career goals."
    }
  },
  {
    id: 28, name: "Rachel Foster", pronouns: "she/her", matchScore: 86,
    location: "Cardiff, UK",
    skills: ["Brand Marketing", "Creative Strategy", "Campaign Development", "Market Analysis"],
    status: "new", appliedDate: "2025-01-29", behavioralType: "Creative Strategist",
    keyStrengths: ["Creative vision", "Strategic thinking", "Brand development"],
    challengeScore: 83, availability: "Available immediately",
    jobId: 1, jobTitle: "Marketing Assistant", jobDepartment: "Marketing",
    communityEngagement: { totalPoints: 295, proactivityScore: 6.9, workshopsAttended: 2, membersHelped: 7, currentStreak: 14, communityTier: "Active Member" },
    pollenTeamInsights: {
      keyTakeaways: ["Creative vision", "Strategic thinking", "Brand development"],
      workingStyles: ["Creative approach", "Strategic planning", "Brand-focused"],
      careerAspirations: ["Brand strategist", "Creative director", "Campaign manager"],
      motivation: "Developing innovative brand strategies that resonate with audiences",
      assessmentBlurb: "Rachel demonstrates strong creative strategy skills with excellent brand development experience from her previous internships."
    }
  },
  {
    id: 29, name: "Michael Thompson", pronouns: "he/him", matchScore: 84,
    location: "Glasgow, UK",
    skills: ["Digital Marketing", "Email Marketing", "Marketing Automation", "Customer Journey"],
    status: "interview_complete", appliedDate: "2025-01-25", behavioralType: "Process Optimizer",
    keyStrengths: ["Process improvement", "Automation", "Customer focus"],
    challengeScore: 81, availability: "2 weeks notice",
    jobId: 1, jobTitle: "Marketing Assistant", jobDepartment: "Marketing",
    communityEngagement: { totalPoints: 340, proactivityScore: 7.3, workshopsAttended: 3, membersHelped: 8, currentStreak: 12, communityTier: "Rising Star" },
    pollenTeamInsights: {
      keyTakeaways: ["Process improvement", "Automation expertise", "Customer focus"],
      workingStyles: ["Process optimization", "Technical approach", "Customer-centric"],
      careerAspirations: ["Marketing automation specialist", "Process manager", "Customer journey expert"],
      motivation: "Optimizing customer experiences through automated processes",
      assessmentBlurb: "Michael showed strong technical skills and process thinking during interview. Team felt he would bring valuable automation expertise."
    }
  },
  // Sales Coordinator candidates
  {
    id: 30, name: "Alex Thompson", pronouns: "they/them", matchScore: 88,
    location: "Leeds, UK",
    skills: ["Sales Strategy", "Client Relations", "CRM Management", "Communication"],
    status: "new", appliedDate: "2025-01-19", behavioralType: "Relationship Builder",
    keyStrengths: ["Client relationship management", "Sales process optimization", "Team collaboration"],
    challengeScore: 85, availability: "Available immediately",
    jobId: 2, jobTitle: "Sales Coordinator", jobDepartment: "Sales",
    communityEngagement: { totalPoints: 320, proactivityScore: 6.8, workshopsAttended: 2, membersHelped: 5, currentStreak: 10, communityTier: "Active Member" },
    email: "alex.thompson@email.com", phone: "+44 7700 900126",
    pollenTeamInsights: {
      keyTakeaways: ["Client relationship expertise", "Sales process optimization", "Team collaboration skills"],
      workingStyles: ["Relationship-focused approach", "Systematic sales methodology", "Collaborative teamwork"],
      careerAspirations: ["Senior sales coordination", "Client success management", "Sales team leadership"],
      motivation: "Energized by building strong client relationships and contributing to team sales success",
      assessmentBlurb: "Alex is a natural relationship builder with exceptional client management skills and strong systematic approach to sales processes. They excel at understanding client needs and creating solutions that deliver genuine value. What stands out is their ability to coordinate complex sales activities while maintaining strong relationships with diverse stakeholders. Alex thrives in collaborative team environments where they can contribute to collective success while developing their own expertise. They're particularly skilled at process optimization, consistently finding ways to improve efficiency without compromising relationship quality. Their approach combines systematic methodology with genuine care for client outcomes, making them valuable for sales coordination roles requiring both organizational skills and relationship management."
    }
  },
  {
    id: 31, name: "Sophie Williams", pronouns: "she/her", matchScore: 82,
    location: "Brighton, UK",
    skills: ["Customer Success", "Account Management", "Sales Support", "Data Analysis"],
    status: "feedback_sent", appliedDate: "2025-01-23", behavioralType: "Customer Champion",
    keyStrengths: ["Customer advocacy", "Problem solving", "Communication"],
    challengeScore: 79, availability: "1 month notice",
    jobId: 2, jobTitle: "Sales Coordinator", jobDepartment: "Sales",
    communityEngagement: { totalPoints: 275, proactivityScore: 6.4, workshopsAttended: 2, membersHelped: 6, currentStreak: 9, communityTier: "Active Member" },
    pollenTeamInsights: {
      keyTakeaways: ["Customer advocacy", "Problem solving", "Communication skills"],
      workingStyles: ["Customer-focused", "Analytical approach", "Collaborative"],
      careerAspirations: ["Customer success manager", "Account management", "Sales support lead"],
      motivation: "Ensuring customer success through proactive support and relationship building",
      assessmentBlurb: "Sophie excels at customer relationship management and has strong analytical skills. Positive feedback sent regarding next steps."
    }
  },
  {
    id: 32, name: "Jordan Lee", pronouns: "he/him", matchScore: 90,
    location: "Norwich, UK",
    skills: ["Business Development", "Sales Analytics", "Lead Generation", "Presentation"],
    status: "hired", appliedDate: "2025-01-15", behavioralType: "Growth Driver",
    keyStrengths: ["Business growth", "Strategic thinking", "Results delivery"],
    challengeScore: 87, availability: "Hired - starting February",
    jobId: 2, jobTitle: "Sales Coordinator", jobDepartment: "Sales",
    communityEngagement: { totalPoints: 410, proactivityScore: 8.0, workshopsAttended: 4, membersHelped: 11, currentStreak: 16, communityTier: "Community Champion" },
    pollenTeamInsights: {
      keyTakeaways: ["Business growth expertise", "Strategic thinking", "Results delivery"],
      workingStyles: ["Growth-oriented", "Strategic approach", "Results-focused"],
      careerAspirations: ["Business development lead", "Sales analytics specialist", "Growth manager"],
      motivation: "Driving business growth through strategic lead generation and analytics",
      assessmentBlurb: "Jordan impressed with strategic business thinking and proven track record in lead generation. Strong cultural fit and accepted offer."
    }
  }
];

// Workflow status management
const getCandidateWorkflowInfo = (candidate: CandidateMatch) => {
  const { status } = candidate;
  
  switch (status) {
    case 'new':
      return {
        statusBadge: { text: 'New', variant: 'destructive' as const },
        actionMessage: { 
          text: 'Profile review required', 
          icon: Eye,
          variant: 'employer_action' as const,
          actionOwner: 'employer' as const
        },
        primaryCTA: { 
          text: 'View Full Profile', 
          icon: Eye, 
          action: 'review_profile',
          variant: 'employer_action' as const,
          actionOwner: 'employer' as const
        },
        secondaryActions: [
          { text: 'Export Profile', icon: FileSpreadsheet, action: 'download_pdf', actionOwner: 'employer' as const }
        ]
      };
      
    case 'reviewing':
    case 'in_progress':
      return {
        statusBadge: { text: 'In Progress', variant: 'default' as const },
        actionMessage: { 
          text: 'Waiting for candidate to book interview slot', 
          icon: Clock,
          variant: 'candidate_action' as const,
          actionOwner: 'candidate' as const
        },
        primaryCTA: { 
          text: 'View Full Profile', 
          icon: Eye, 
          action: 'review_profile',
          variant: 'outline' as const,
          actionOwner: 'employer' as const
        },
        secondaryActions: [
          { text: 'Send Message', icon: MessageSquare, action: 'send_message', actionOwner: 'employer' as const },
          { text: 'Export Profile', icon: FileSpreadsheet, action: 'download_pdf', actionOwner: 'employer' as const }
        ]
      };
      
    case 'interview_scheduled':
      return {
        statusBadge: { text: 'Interview Scheduled', variant: 'outline' as const },
        actionMessage: { 
          text: 'Interview confirmed for Jan 25, 2:00 PM', 
          icon: Calendar,
          variant: 'scheduled' as const,
          actionOwner: 'both' as const
        },
        primaryCTA: { 
          text: 'Manage Interview', 
          icon: Calendar, 
          action: 'manage_interview',
          variant: 'outline' as const,
          actionOwner: 'employer' as const
        },
        secondaryActions: [
          { text: 'Send Message', icon: MessageSquare, action: 'send_message', actionOwner: 'employer' as const },
          { text: 'Export Profile', icon: FileSpreadsheet, action: 'download_pdf', actionOwner: 'employer' as const }
        ]
      };
      
    case 'interview_complete':
      return {
        statusBadge: { text: 'Interview Complete', variant: 'outline' as const },
        actionMessage: { 
          text: 'Provide feedback and update status', 
          icon: MessageSquare,
          variant: 'employer_action' as const,
          actionOwner: 'employer' as const
        },
        primaryCTA: { 
          text: 'Provide Update', 
          icon: MessageSquare, 
          action: 'manage_interview',
          variant: 'outline' as const,
          actionOwner: 'employer' as const
        },
        secondaryActions: [
          { text: 'View Profile', icon: Eye, action: 'review_profile', actionOwner: 'employer' as const },
          { text: 'Export Profile', icon: FileSpreadsheet, action: 'download_pdf', actionOwner: 'employer' as const }
        ]
      };
      
    case 'feedback_sent':
      return {
        statusBadge: { text: 'Feedback Sent', variant: 'outline' as const },
        actionMessage: { 
          text: 'Awaiting candidate response', 
          icon: Clock,
          variant: 'candidate_action' as const,
          actionOwner: 'candidate' as const
        },
        primaryCTA: { 
          text: 'View Profile', 
          icon: Eye, 
          action: 'review_profile',
          variant: 'outline' as const,
          actionOwner: 'employer' as const
        },
        secondaryActions: [
          { text: 'Send Message', icon: MessageSquare, action: 'send_message', actionOwner: 'employer' as const },
          { text: 'Export Profile', icon: FileSpreadsheet, action: 'download_pdf', actionOwner: 'employer' as const }
        ]
      };
      
    case 'rejected':
      return {
        statusBadge: { text: 'Rejected', variant: 'destructive' as const },
        actionMessage: { 
          text: 'Application declined', 
          icon: X,
          variant: 'completed' as const,
          actionOwner: 'completed' as const
        },
        primaryCTA: { 
          text: 'View Profile', 
          icon: Eye, 
          action: 'review_profile',
          variant: 'outline' as const,
          actionOwner: 'completed' as const
        },
        secondaryActions: [
          { text: 'Export Profile', icon: FileSpreadsheet, action: 'download_pdf', actionOwner: 'employer' as const }
        ]
      };
      
    case 'offer_declined':
      return {
        statusBadge: { text: 'Offer Declined', variant: 'destructive' as const },
        actionMessage: { 
          text: 'Candidate declined offer', 
          icon: X,
          variant: 'completed' as const,
          actionOwner: 'completed' as const
        },
        primaryCTA: { 
          text: 'View Profile', 
          icon: Eye, 
          action: 'review_profile',
          variant: 'outline' as const,
          actionOwner: 'completed' as const
        },
        secondaryActions: [
          { text: 'Export Profile', icon: FileSpreadsheet, action: 'download_pdf', actionOwner: 'employer' as const }
        ]
      };
      
    case 'hired':
      return {
        statusBadge: { text: 'Hired', variant: 'outline' as const },
        actionMessage: { 
          text: 'Candidate successfully hired', 
          icon: CheckCircle,
          variant: 'completed' as const,
          actionOwner: 'completed' as const
        },
        primaryCTA: { 
          text: 'View Profile', 
          icon: Eye, 
          action: 'review_profile',
          variant: 'outline' as const,
          actionOwner: 'completed' as const
        },
        secondaryActions: [
          { text: 'Export Profile', icon: FileSpreadsheet, action: 'download_pdf', actionOwner: 'employer' as const }
        ]
      };
      
    default:
      return {
        statusBadge: { text: status, variant: 'secondary' as const },
        actionMessage: null,
        primaryCTA: null,
        secondaryActions: []
      };
  }
};

export default function CandidateManagement() {
  const params = useParams();
  const [location, setLocation] = useLocation();
  
  // Extract job filter from URL params - handle both /applicants/job-001 and query params
  let jobFilter: number | null = null;
  if (params.jobId) {
    // Handle path params like /applicants/job-001
    const jobIdStr = params.jobId.replace('job-', '');
    jobFilter = parseInt(jobIdStr);
  } else {
    // Handle query params like /applicants?job=1
    const urlParams = new URLSearchParams(window.location.search);
    const jobParam = urlParams.get('job');
    if (jobParam) {
      jobFilter = parseInt(jobParam);
    }
  }
  
  // State management
  const [selectedJobFilter, setSelectedJobFilter] = useState<number | null>(jobFilter);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("match_score");
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateMatch | null>(null);
  const [showCandidateDetail, setShowCandidateDetail] = useState(false);
  
  // Split view resizing state
  const [splitPosition, setSplitPosition] = useState(35); // Initial 35% for table, 65% for profile
  const [isDragging, setIsDragging] = useState(false);

  // URL parameter handling for auto-selection and status filtering
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const candidateId = urlParams.get('candidate');
    const statusParam = urlParams.get('status');
    
    if (candidateId) {
      const candidate = mockCandidates.find(c => c.id === parseInt(candidateId));
      if (candidate) {
        setSelectedCandidate(candidate);
        setShowCandidateDetail(true);
      }
    }
    
    // Set status filter from URL parameter
    if (statusParam) {
      setStatusFilter(statusParam);
    }
  }, []);

  // Filter and sort candidates
  const filteredCandidates = useMemo(() => {
    let filtered = mockCandidates.filter(candidate => {
      const matchesJob = !selectedJobFilter || candidate.jobId === selectedJobFilter;
      const matchesSearch = !searchTerm || 
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        candidate.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || candidate.status === statusFilter;
      
      return matchesJob && matchesSearch && matchesStatus;
    });

    // Sort candidates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'match_score':
          return b.matchScore - a.matchScore;
        case 'applied_date':
          return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'challenge_score':
          return b.challengeScore - a.challengeScore;
        default:
          return 0;
      }
    });

    return filtered;
  }, [selectedJobFilter, searchTerm, statusFilter, sortBy]);

  // Action handlers
  const handleViewProfile = (candidate: CandidateMatch) => {
    // Open candidate profile in side panel instead of navigating away
    console.log('Opening candidate in split view:', candidate.name);
    setSelectedCandidate(candidate);
    setShowCandidateDetail(true);
  };

  // Navigation function for split view
  const navigateCandidateInPanel = (direction: 'prev' | 'next') => {
    if (!selectedCandidate) return;
    
    const currentIndex = filteredCandidates.findIndex(c => c.id === selectedCandidate.id);
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex - 1;
    } else {
      newIndex = currentIndex + 1;
    }
    
    if (newIndex >= 0 && newIndex < filteredCandidates.length) {
      setSelectedCandidate(filteredCandidates[newIndex]);
    }
  };

  // Get current candidate index for navigation
  const getCurrentCandidateIndex = () => {
    if (!selectedCandidate) return 0;
    return filteredCandidates.findIndex(c => c.id === selectedCandidate.id);
  };

  const handleDownloadPDF = async (candidateId: number) => {
    try {
      const response = await fetch(`/api/candidate-profile-pdf/${candidateId}`, {
        method: 'GET',
        headers: { 'Accept': 'application/pdf' }
      });
      
      if (!response.ok) throw new Error('PDF generation failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `candidate-${candidateId}-profile.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('PDF download failed:', error);
    }
  };

  const handleSendMessage = (candidateId: number) => {
    // Direct link to start conversation with specific candidate
    setLocation(`/employer-messages?candidate=${candidateId}&action=compose`);
  };

  const handleManageInterview = (candidateId: number) => {
    setLocation(`/interview-schedule-detail/${candidateId}`);
  };

  // Get current job info for header
  const currentJob = selectedJobFilter ? mockJobs.find(job => job.id === selectedJobFilter) : null;

  // Mouse handlers for resizing
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const newPosition = (e.clientX / window.innerWidth) * 100;
    if (newPosition >= 20 && newPosition <= 60) {
      setSplitPosition(newPosition);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add event listeners for dragging
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging]);

  return (
    <div className={`min-h-screen bg-gray-50 ${showCandidateDetail ? 'flex absolute inset-0 z-50' : 'p-6'}`}>
      {/* Main Content Area */}
      <div 
        className={showCandidateDetail ? 'overflow-y-auto border-r border-gray-200 p-2' : 'w-full p-6'}
        style={{ width: showCandidateDetail ? `${splitPosition}%` : '100%' }}
      >
        <div className={`${showCandidateDetail ? 'max-w-none' : 'max-w-7xl mx-auto'}`}>
        {/* Header */}
        <div className={`${showCandidateDetail ? 'mb-3' : 'mb-6'}`}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className={`font-bold text-gray-900 ${showCandidateDetail ? 'text-base mb-1' : 'text-3xl mb-2'}`}>
                {showCandidateDetail 
                  ? 'Candidates' 
                  : (currentJob ? `${currentJob.title} Candidates` : 'All Candidates')
                }
              </h1>
              {!showCandidateDetail && (
                <p className="text-gray-600">
                  {currentJob 
                    ? `Manage applications for ${currentJob.title} position`
                    : 'Manage all candidate applications across your open positions'
                  }
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {showCandidateDetail && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowCandidateDetail(false);
                    setSelectedCandidate(null);
                  }}
                  className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to List
                </Button>
              )}
              {!showCandidateDetail && (
                <>
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'cards' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('cards')}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className={`${showCandidateDetail ? 'mb-3' : 'mb-6'}`}>
          <CardContent className={`${showCandidateDetail ? 'pt-3 pb-3' : 'pt-6'}`}>
            <div className={`grid gap-2 ${showCandidateDetail ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-4 gap-4'}`}>
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${showCandidateDetail ? 'w-3 h-3' : 'w-4 h-4'}`} />
                <Input
                  placeholder={showCandidateDetail ? "Search..." : "Search candidates..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-8 ${showCandidateDetail ? 'h-8 text-sm' : 'pl-10'}`}
                />
              </div>
              
              <Select value={selectedJobFilter?.toString() || "all"} onValueChange={(value) => 
                setSelectedJobFilter(value === "all" ? null : parseInt(value))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by job" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jobs</SelectItem>
                  {mockJobs.map(job => (
                    <SelectItem key={job.id} value={job.id.toString()}>
                      {job.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
                  <SelectItem value="interview_complete">Interview Complete</SelectItem>
                  <SelectItem value="feedback_sent">Feedback Sent</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="offer_declined">Offer Declined</SelectItem>
                  <SelectItem value="hired">Hired</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="applied_date">Application Date</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="challenge_score">Challenge Score</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {filteredCandidates.length} candidates
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {viewMode === 'table' ? (
          <CandidateTable 
            candidates={filteredCandidates}
            onViewProfile={handleViewProfile}
            onDownloadPDF={handleDownloadPDF}
            onSendMessage={handleSendMessage}
            onManageInterview={handleManageInterview}
            isCompact={showCandidateDetail}
          />
        ) : (
          <CandidateCards 
            candidates={filteredCandidates}
            onViewProfile={handleViewProfile}
            onDownloadPDF={handleDownloadPDF}
            onSendMessage={handleSendMessage}
            onManageInterview={handleManageInterview}
            jobId={selectedJobFilter?.toString() || "all"}
            activeFilter={statusFilter}
            setLocation={setLocation}
          />
        )}

        {/* Remove modal - using split view instead */}
        </div>
      </div>

      {/* Resizer */}
      {showCandidateDetail && (
        <div
          className="w-1 bg-gray-300 hover:bg-gray-400 cursor-col-resize flex-shrink-0 relative group"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute inset-y-0 -left-1 -right-1 group-hover:bg-blue-200 group-hover:opacity-50" />
        </div>
      )}

      {/* Full Profile Panel - Split View */}
      {showCandidateDetail && selectedCandidate && (
        <div 
          className="bg-white overflow-y-auto flex-1"
          style={{ width: `${100 - splitPosition}%` }}
        >
          {/* Header with navigation and close */}
          <div className="sticky top-0 bg-white border-b p-4 z-10">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold">Candidate Profile</h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setShowCandidateDetail(false);
                  setSelectedCandidate(null);
                }}
                className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
              >
                <X className="w-4 h-4 mr-1" />
                Close
              </Button>
            </div>
            
            {/* Navigation Controls */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateCandidateInPanel('prev')}
                disabled={getCurrentCandidateIndex() <= 0}
              >
                ← Previous
              </Button>
              
              <span className="text-sm text-gray-600 font-medium">
                {getCurrentCandidateIndex() + 1} of {filteredCandidates.length}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateCandidateInPanel('next')}
                disabled={getCurrentCandidateIndex() >= filteredCandidates.length - 1}
              >
                Next →
              </Button>
            </div>
          </div>

          {/* Full Profile Content - 4-Tab System */}
          <div className="p-6">
            {/* Profile Header */}
            <div className="flex items-start gap-6 mb-6">
              <div className="w-20 h-20 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-2xl">
                {selectedCandidate.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900">{selectedCandidate.name}</h1>
                <p className="text-gray-600">{selectedCandidate.pronouns}</p>
                <p className="text-sm text-gray-500">{selectedCandidate.location}</p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span className="font-bold text-lg">{selectedCandidate.matchScore}% Match</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-pink-500" />
                    <span className="font-bold text-lg">{selectedCandidate.challengeScore}% Challenge Score</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3 mb-6">
              <Button 
                className="flex-1"
                onClick={() => handleSendMessage(selectedCandidate.id)}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Message
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => handleDownloadPDF(selectedCandidate.id)}
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>

            {/* 4-Tab System */}
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="behavioral">Behavioral</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="story">Their Story</TabsTrigger>
              </TabsList>

              {/* Summary Tab */}
              <TabsContent value="summary" className="space-y-6 mt-6">
                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">{selectedCandidate.matchScore}%</div>
                      <div className="text-sm text-gray-500">Overall Match</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">{selectedCandidate.challengeScore}%</div>
                      <div className="text-sm text-gray-500">Skills Score</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">{selectedCandidate.communityEngagement.proactivityScore}/10</div>
                      <div className="text-sm text-gray-500">Engagement</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Pollen Team Assessment */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                      Pollen Team Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Key Takeaways</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCandidate.pollenTeamInsights.keyTakeaways.map((takeaway, index) => (
                          <Badge key={index} variant="outline" className="px-3 py-1">{takeaway}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Working Styles</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCandidate.pollenTeamInsights.workingStyles.map((style, index) => (
                          <Badge key={index} variant="secondary" className="px-3 py-1">{style}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Assessment Notes</h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {selectedCandidate.pollenTeamInsights.assessmentBlurb}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Skills Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Core Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedCandidate.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="px-3 py-1">{skill}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Behavioral Tab */}
              <TabsContent value="behavioral" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-blue-600" />
                      Behavioral Profile
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Personality Type</h4>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-lg font-bold text-blue-800">{selectedCandidate.behavioralType}</div>
                        <p className="text-blue-700 text-sm mt-1">Natural problem-solver with strong analytical abilities</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Communication Style</h4>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="font-semibold text-green-800">Direct & Clear</div>
                        <p className="text-green-700 text-sm mt-1">Prefers straightforward communication with clear expectations and measurable outcomes</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Work Style Strengths</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedCandidate.keyStrengths.map((strength, index) => (
                          <div key={index} className="bg-purple-50 p-3 rounded-lg">
                            <div className="font-medium text-purple-800">{strength}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Career Motivators</h4>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <p className="text-yellow-800">{selectedCandidate.pollenTeamInsights.motivation}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Skills Tab */}
              <TabsContent value="skills" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-pink-500" />
                      Skills Assessment - {selectedCandidate.challengeScore}%
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Core Skills</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedCandidate.skills.map((skill, index) => (
                          <div key={index} className="bg-blue-50 p-3 rounded-lg flex items-center justify-between">
                            <span className="font-medium text-blue-800">{skill}</span>
                            <Badge variant="secondary">{85 + (index * 2)}%</Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Challenge Performance</h4>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-green-800">Overall Score</span>
                          <span className="text-2xl font-bold text-green-700">{selectedCandidate.challengeScore}%</span>
                        </div>
                        <p className="text-green-700 text-sm">Excellent performance across technical and practical assessments</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Key Achievements</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm">Top 10% performer in skills assessments</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="text-sm">Consistent improvement across multiple challenges</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Brain className="w-4 h-4 text-purple-500" />
                          <span className="text-sm">Strong problem-solving methodology</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Their Story Tab */}
              <TabsContent value="story" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Heart className="w-5 h-5 text-red-500" />
                      Personal Story
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Career Aspirations</h4>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex flex-wrap gap-2">
                          {selectedCandidate.pollenTeamInsights.careerAspirations.map((aspiration, index) => (
                            <Badge key={index} className="bg-blue-100 text-blue-800">{aspiration}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">What Motivates Them</h4>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-purple-800">{selectedCandidate.pollenTeamInsights.motivation}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Community Engagement</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-yellow-50 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-yellow-700">{selectedCandidate.communityEngagement.totalPoints}</div>
                          <div className="text-sm text-yellow-600">Total Points</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-green-700">{selectedCandidate.communityEngagement.membersHelped}</div>
                          <div className="text-sm text-green-600">Members Helped</div>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-orange-700">{selectedCandidate.communityEngagement.currentStreak}</div>
                          <div className="text-sm text-orange-600">Day Streak</div>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                        <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                          {selectedCandidate.communityEngagement.communityTier}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Values Fit</h4>
                      <div className="bg-rose-50 p-4 rounded-lg">
                        <p className="text-rose-800 text-sm">
                          Strong alignment with team values of collaboration, continuous learning, and results-oriented mindset. 
                          Demonstrates genuine enthusiasm for professional development and supporting others in their growth journey.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
}

// Table view component
function CandidateTable({ 
  candidates, 
  onViewProfile, 
  onDownloadPDF, 
  onSendMessage, 
  onManageInterview,
  isCompact = false
}: {
  candidates: CandidateMatch[];
  onViewProfile: (candidate: CandidateMatch) => void;
  onDownloadPDF: (candidateId: number) => void;
  onSendMessage: (candidateId: number) => void;
  onManageInterview: (candidateId: number) => void;
  isCompact?: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className={`text-left font-medium text-gray-900 ${isCompact ? 'p-2 text-xs' : 'p-4'}`}>Candidate</th>
                <th className={`text-left font-medium text-gray-900 ${isCompact ? 'p-2 text-xs' : 'p-4'}`}>Job Position</th>
                <th className={`text-left font-medium text-gray-900 ${isCompact ? 'p-2 text-xs' : 'p-4'}`}>Match Score</th>
                <th className={`text-left font-medium text-gray-900 ${isCompact ? 'p-2 text-xs' : 'p-4'}`}>Status</th>
                <th className={`text-left font-medium text-gray-900 ${isCompact ? 'p-2 text-xs' : 'p-4'}`}>Next Steps</th>
                <th className={`text-left font-medium text-gray-900 ${isCompact ? 'p-2 text-xs' : 'p-4'}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => {
                const workflowInfo = getCandidateWorkflowInfo(candidate);
                return (
                  <tr key={candidate.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => onViewProfile(candidate)}>
                    <td className={isCompact ? 'p-2' : 'p-4'}>
                      <div className="flex items-center gap-3">
                        <div className={`rounded-full bg-pink-500 text-white flex items-center justify-center font-bold ${isCompact ? 'w-6 h-6 text-xs' : 'w-10 h-10'}`}>
                          {candidate.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className={`font-medium ${isCompact ? 'text-sm' : ''}`}>{candidate.name}</div>
                          <div className={`text-gray-500 ${isCompact ? 'text-xs' : 'text-sm'}`}>{candidate.pronouns}</div>
                          <div className={`text-gray-500 ${isCompact ? 'text-xs' : 'text-sm'}`}>{candidate.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className={isCompact ? 'p-2' : 'p-4'}>
                      <div className={`font-medium ${isCompact ? 'text-sm' : ''}`}>{candidate.jobTitle}</div>
                      <div className={`text-gray-500 ${isCompact ? 'text-xs' : 'text-sm'}`}>{candidate.jobDepartment}</div>
                    </td>
                    <td className={isCompact ? 'p-2' : 'p-4'}>
                      <div className="flex items-center gap-2">
                        <div className={`font-bold ${isCompact ? 'text-sm' : 'text-lg'}`}>{candidate.matchScore}%</div>
                        <Star className={`text-yellow-500 ${isCompact ? 'w-3 h-3' : 'w-4 h-4'}`} />
                      </div>
                    </td>
                    <td className={isCompact ? 'p-2' : 'p-4'}>
                      <Badge variant={workflowInfo.statusBadge.variant} className={isCompact ? 'text-xs' : ''}>
                        {workflowInfo.statusBadge.text}
                      </Badge>
                    </td>
                    <td className={isCompact ? 'p-2' : 'p-4'}>
                      <div className="text-sm text-gray-600">Review candidate profile</div>
                    </td>
                    <td className={isCompact ? 'p-2' : 'p-4'}>
                      <div className="flex gap-2">
                        <Button
                          size={isCompact ? "sm" : "sm"}
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSendMessage(candidate.id);
                          }}
                          className={`flex-1 ${isCompact ? 'px-2 py-1 text-xs' : ''}`}
                        >
                          <MessageSquare className={`mr-1 ${isCompact ? 'w-3 h-3' : 'w-4 h-4'}`} />
                          {isCompact ? 'Msg' : 'Message'}
                        </Button>
                        <Button
                          size={isCompact ? "sm" : "sm"}
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            onManageInterview(candidate.id);
                          }}
                          className={`flex-1 ${isCompact ? 'px-2 py-1 text-xs' : ''}`}
                        >
                          <Calendar className={`mr-1 ${isCompact ? 'w-3 h-3' : 'w-4 h-4'}`} />
                          {isCompact ? 'Int' : 'Interview'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Key Strengths</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {selectedCandidate.keyStrengths.map((strength, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Pollen Team Assessment */}
            {selectedCandidate.pollenTeamInsights && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-pink-600" />
                    Pollen Team Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg border-l-4 border-pink-500">
                    <p className="text-gray-700 leading-relaxed">
                      {selectedCandidate.pollenTeamInsights.assessmentBlurb}
                    </p>
                  </div>
                  
                  {/* Key Takeaways */}
                  {selectedCandidate.pollenTeamInsights?.keyTakeaways && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Key Takeaways</h4>
                      <ul className="space-y-1">
                        {selectedCandidate.pollenTeamInsights.keyTakeaways.map((takeaway, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="text-pink-500 mt-1">•</span>
                            {takeaway}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Working Styles */}
                  {selectedCandidate.pollenTeamInsights?.workingStyles && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Working Styles</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCandidate.pollenTeamInsights.workingStyles.map((style, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {style}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Career Aspirations */}
                  {selectedCandidate.pollenTeamInsights?.careerAspirations && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Career Aspirations</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCandidate.pollenTeamInsights.careerAspirations.map((aspiration, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {aspiration}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Motivation */}
                  {selectedCandidate.pollenTeamInsights?.motivation && (
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Motivation</h4>
                      <p className="text-sm text-gray-700 italic">
                        "{selectedCandidate.pollenTeamInsights.motivation}"
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Behavioral Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-blue-600" />
                  Behavioral Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-3xl mb-2">🎯</div>
                  <h3 className="text-xl font-bold text-blue-600 mb-2">{selectedCandidate.behavioralType}</h3>
                  <p className="text-gray-700 text-sm">
                    {selectedCandidate.personalityInsights}
                  </p>
                </div>

                {/* Work style preferences */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2 text-sm">Motivational Factors</h4>
                    <ul className="space-y-1">
                      {selectedCandidate.motivationalFactors?.map((factor, index) => (
                        <li key={index} className="text-xs text-blue-800">• {factor}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2 text-sm">Work Style Preferences</h4>
                    <ul className="space-y-1">
                      {selectedCandidate.workStylePreferences?.map((pref, index) => (
                        <li key={index} className="text-xs text-green-800">• {pref}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Story */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Personal Story
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">Education & Experience</h4>
                    <p className="text-sm text-gray-700">
                      <strong>Education:</strong> {selectedCandidate.educationLevel}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      <strong>Experience:</strong> {selectedCandidate.workExperience}
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">Values Fit</h4>
                    <p className="text-sm text-gray-700">
                      {selectedCandidate.culturalFit}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Community Engagement */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Community Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Total Points</span>
                    <p className="font-bold text-lg">{selectedCandidate.communityEngagement.totalPoints}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Proactivity Score</span>
                    <p className="font-bold text-lg">{selectedCandidate.communityEngagement.proactivityScore}/10</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Community Tier</span>
                    <Badge variant="outline">{selectedCandidate.communityEngagement.communityTier}</Badge>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Current Streak</span>
                    <p className="font-bold text-lg">{selectedCandidate.communityEngagement.currentStreak} days</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Application Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Application Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Applied For</span>
                    <p className="font-medium">{selectedCandidate.jobTitle}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Department</span>
                    <p className="font-medium">{selectedCandidate.jobDepartment}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Application Date</span>
                    <p className="font-medium">{selectedCandidate.appliedDate}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Status</span>
                    <Badge variant="secondary">{selectedCandidate.status}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

// Table view component
function CandidateTable({ 
  candidates, 
  onViewProfile, 
  onDownloadPDF, 
  onSendMessage, 
  onManageInterview,
  isCompact = false
}: {
  candidates: CandidateMatch[];
  onViewProfile: (candidate: CandidateMatch) => void;
  onDownloadPDF: (candidateId: number) => void;
  onSendMessage: (candidateId: number) => void;
  onManageInterview: (candidateId: number) => void;
  isCompact?: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className={`text-left font-medium text-gray-900 ${isCompact ? 'p-2 text-xs' : 'p-4'}`}>Candidate</th>
                <th className={`text-left font-medium text-gray-900 ${isCompact ? 'p-2 text-xs' : 'p-4'}`}>Job Position</th>
                <th className={`text-left font-medium text-gray-900 ${isCompact ? 'p-2 text-xs' : 'p-4'}`}>Match Score</th>
                <th className={`text-left font-medium text-gray-900 ${isCompact ? 'p-2 text-xs' : 'p-4'}`}>Status</th>
                <th className={`text-left font-medium text-gray-900 ${isCompact ? 'p-2 text-xs' : 'p-4'}`}>Next Steps</th>
                <th className={`text-left font-medium text-gray-900 ${isCompact ? 'p-2 text-xs' : 'p-4'}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => {
                const workflowInfo = getCandidateWorkflowInfo(candidate);
                return (
                  <tr key={candidate.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => onViewProfile(candidate)}>
                    <td className={isCompact ? 'p-2' : 'p-4'}>
                      <div className="flex items-center gap-3">
                        <div className={`rounded-full bg-pink-500 text-white flex items-center justify-center font-bold ${isCompact ? 'w-6 h-6 text-xs' : 'w-10 h-10'}`}>
                          {candidate.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className={`font-medium ${isCompact ? 'text-sm' : ''}`}>{candidate.name}</div>
                          <div className={`text-gray-500 ${isCompact ? 'text-xs' : 'text-sm'}`}>{candidate.pronouns}</div>
                          <div className={`text-gray-500 ${isCompact ? 'text-xs' : 'text-sm'}`}>{candidate.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className={isCompact ? 'p-2' : 'p-4'}>
                      <div className={`font-medium ${isCompact ? 'text-sm' : ''}`}>{candidate.jobTitle}</div>
                      <div className={`text-gray-500 ${isCompact ? 'text-xs' : 'text-sm'}`}>{candidate.jobDepartment}</div>
                    </td>
                    <td className={isCompact ? 'p-2' : 'p-4'}>
                      <div className="flex items-center gap-2">
                        <div className={`font-bold ${isCompact ? 'text-sm' : 'text-lg'}`}>{candidate.matchScore}%</div>
                        <Star className={`text-yellow-500 ${isCompact ? 'w-3 h-3' : 'w-4 h-4'}`} />
                      </div>
                    </td>
                    <td className={isCompact ? 'p-2' : 'p-4'}>
                      <Badge variant={workflowInfo.statusBadge.variant} className={isCompact ? 'text-xs' : ''}>
                        {workflowInfo.statusBadge.text}
                      </Badge>
                    </td>
                    <td className={isCompact ? 'p-2' : 'p-4'}>
                      {(() => {
                        const getNextStepsInfo = (status: string) => {
                          switch (status) {
                            case 'new':
                              return {
                                description: 'Review profile and assess match quality',
                                actionRequired: true
                              };
                            case 'in_progress':
                              return {
                                description: 'Candidate invited to book interview slot',
                                actionRequired: false
                              };
                            case 'interview_scheduled':
                              return {
                                description: 'Interview confirmed for Jan 25, 2:00 PM',
                                actionRequired: false
                              };
                            case 'interview_complete':
                              return {
                                description: 'Provide feedback on interview outcome',
                                actionRequired: true
                              };
                            case 'feedback_sent':
                              return {
                                description: 'Positive feedback sent, awaiting candidate response',
                                actionRequired: false
                              };
                            case 'rejected':
                              return {
                                description: 'Application declined',
                                actionRequired: false
                              };
                            case 'hired':
                              return {
                                description: 'Candidate hired, starting next month',
                                actionRequired: false
                              };
                            case 'offer_declined':
                              return {
                                description: 'Candidate declined job offer',
                                actionRequired: false
                              };
                            default:
                              return {
                                description: 'Review required',
                                actionRequired: true
                              };
                          }
                        };
                        
                        const nextSteps = getNextStepsInfo(candidate.status);
                        
                        return (
                          <div className="flex items-center gap-2">
                            <div className="text-sm text-gray-700">
                              {nextSteps.description}
                            </div>
                            {nextSteps.actionRequired && (
                              <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-red-600 bg-red-50">
                                <span>❗</span>
                                Action required
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {(() => {
                          const getStatusAction = (status: string) => {
                            switch (status) {
                              case 'new':
                                return {
                                  text: 'Review Match',
                                  action: () => onViewProfile(candidate),
                                  variant: 'default' as const,
                                  className: 'bg-pink-600 hover:bg-pink-700 text-white'
                                };
                              case 'in_progress':
                                return {
                                  text: 'View Profile',
                                  action: () => onViewProfile(candidate),
                                  variant: 'outline' as const,
                                  className: ''
                                };
                              case 'interview_scheduled':
                                return {
                                  text: 'View Interview',
                                  action: () => onManageInterview(candidate.id),
                                  variant: 'outline' as const,
                                  className: ''
                                };
                              case 'interview_complete':
                                return {
                                  text: 'Provide Update',
                                  action: () => onManageInterview(candidate.id),
                                  variant: 'outline' as const,
                                  className: ''
                                };
                              case 'rejected':
                                return {
                                  text: 'View Profile',
                                  action: () => onViewProfile(candidate),
                                  variant: 'outline' as const,
                                  className: 'opacity-60'
                                };
                              case 'hired':
                                return {
                                  text: 'View Profile',
                                  action: () => onViewProfile(candidate),
                                  variant: 'outline' as const,
                                  className: 'border-green-200 text-green-700'
                                };
                              default:
                                return {
                                  text: 'View Profile',
                                  action: () => onViewProfile(candidate),
                                  variant: 'outline' as const,
                                  className: ''
                                };
                            }
                          };
                          
                          const statusAction = getStatusAction(candidate.status);
                          
                          return (
                            <Button
                              size="sm"
                              variant={statusAction.variant}
                              className={statusAction.className}
                              onClick={(e) => {
                                e.stopPropagation();
                                statusAction.action();
                              }}
                            >
                              {statusAction.text}
                            </Button>
                          );
                        })()}
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDownloadPDF(candidate.id);
                          }}
                        >
                          <FileSpreadsheet className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSendMessage(candidate.id);
                          }}
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

// Cards view component (simplified from original)
function CandidateCards({ 
  candidates, 
  onViewProfile, 
  onDownloadPDF, 
  onSendMessage, 
  onManageInterview,
  jobId,
  activeFilter,
  setLocation
}: {
  candidates: CandidateMatch[];
  onViewProfile: (candidate: CandidateMatch) => void;
  onDownloadPDF: (candidateId: number) => void;
  onSendMessage: (candidateId: number) => void;
  onManageInterview: (candidateId: number) => void;
  jobId?: string;
  activeFilter: string;
  setLocation: (path: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {candidates.map((candidate) => {
        const workflowInfo = getCandidateWorkflowInfo(candidate);
        return (
          <Card key={candidate.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => {
            // Navigate directly to candidate profile with context
            const currentJobId = jobId || 'all';
            setLocation(`/candidate-profile/${candidate.id}?from=applicants&job=${currentJobId}&filter=${activeFilter}`);
          }}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold">
                    {candidate.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold">{candidate.name}</h3>
                    <p className="text-sm text-gray-500">{candidate.pronouns}</p>
                  </div>
                </div>
                <Badge variant={workflowInfo.statusBadge.variant}>
                  {workflowInfo.statusBadge.text}
                </Badge>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Match Score</span>
                  <div className="flex items-center gap-1">
                    <span className="font-bold">{candidate.matchScore}%</span>
                    <Star className="w-4 h-4 text-yellow-500" />
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-1">{candidate.jobTitle}</p>
                  <p className="text-sm text-gray-500">{candidate.location}</p>
                </div>

                {/* Pollen Team Assessment Preview */}
                {candidate.pollenTeamInsights && (
                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-3 rounded-lg border-l-4 border-pink-500">
                    <div className="flex items-start gap-2 mb-2">
                      <Lightbulb className="w-4 h-4 text-pink-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-pink-900 mb-1">Pollen Team Assessment</h4>
                        <p className="text-xs text-pink-800 line-clamp-3">
                          {candidate.pollenTeamInsights.assessmentBlurb}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLocation(`/job-candidate-matches/job-${candidate.jobId.toString().padStart(3, '0')}?candidate=${candidate.id}`);
                  }}
                  className="flex-1"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSendMessage(candidate.id);
                  }}
                >
                  <MessageSquare className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownloadPDF(candidate.id);
                  }}
                >
                  <FileSpreadsheet className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// Candidate detail modal (simplified)
function CandidateDetailModal({
  candidate,
  isOpen,
  onClose,
  onDownloadPDF,
  onSendMessage,
  onManageInterview
}: {
  candidate: CandidateMatch;
  isOpen: boolean;
  onClose: () => void;
  onDownloadPDF: (candidateId: number) => void;
  onSendMessage: (candidateId: number) => void;
  onManageInterview: (candidateId: number) => void;
}) {
  const [, setLocation] = useLocation();
  const workflowInfo = getCandidateWorkflowInfo(candidate);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-pink-500 text-white flex items-center justify-center font-bold text-sm">
              {candidate.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{candidate.name}</h2>
              <p className="text-gray-600">{candidate.jobTitle}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Profile Overview */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Profile Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Location</Label>
                    <p className="text-sm text-gray-600">{candidate.location}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Availability</Label>
                    <p className="text-sm text-gray-600">{candidate.availability}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Match Score</Label>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">{candidate.matchScore}%</span>
                      <Star className="w-4 h-4 text-yellow-500" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Challenge Score</Label>
                    <p className="font-bold text-lg">{candidate.challengeScore}%</p>
                  </div>
                </div>

                {candidate.pollenTeamInsights && (
                  <div>
                    <Label className="text-sm font-medium">Pollen Team Assessment</Label>
                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg border-l-4 border-pink-500 mt-2">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm text-pink-800 leading-relaxed">
                            {candidate.pollenTeamInsights.assessmentBlurb}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium">Key Strengths</Label>
                  <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                    {candidate.keyStrengths.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {workflowInfo.actionMessage && (
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <workflowInfo.actionMessage.icon className="w-4 h-4" />
                    <span className="text-sm">{workflowInfo.actionMessage.text}</span>
                  </div>
                )}

                {workflowInfo.primaryCTA && (
                  <Button 
                    className="w-full" 
                    onClick={() => {
                      if (workflowInfo.primaryCTA.action === 'manage_interview') {
                        onManageInterview(candidate.id);
                      } else if (workflowInfo.primaryCTA.action === 'review_profile') {
                        // Close modal and navigate to full profile page using job-candidate-matches route
                        onClose();
                        setTimeout(() => {
                          setLocation(`/job-candidate-matches/job-${candidate.jobId.toString().padStart(3, '0')}?candidate=${candidate.id}`);
                        }, 100);
                      }
                    }}
                  >
                    <workflowInfo.primaryCTA.icon className="w-4 h-4 mr-2" />
                    {workflowInfo.primaryCTA.text}
                  </Button>
                )}



                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => onSendMessage(candidate.id)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message
                </Button>
              </CardContent>
            </Card>


          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}