import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Search,
  Filter,
  Clock,
  Star,
  Award,
  TrendingUp,
  Users,
  Building2,
  Target,
  Zap,
  BookOpen,
  FileText,
  Calculator,
  MessageCircle,
  Presentation,
  ClipboardList,
  Brain,
  Code
} from "lucide-react";

interface SkillChallenge {
  id: string;
  title: string;
  description: string;
  category: string;
  industry: string;
  difficulty: "entry" | "intermediate" | "advanced";
  timeLimit: number;
  skills: string[];
  instructions: string;
  tasks: ChallengeTask[];
  icon: any;
  colour: string;
  completionRate?: number;
  averageScore?: number;
  totalAttempts?: number;
  employerCount?: number;
  trending?: boolean;
  featured?: boolean;
}

interface ChallengeTask {
  id: string;
  title: string;
  description: string;
  type: "calculation" | "analysis" | "creative" | "strategy" | "document";
  points: number;
  required: boolean;
}

// Enhanced skills challenges database
const enhancedSkillsChallenges: SkillChallenge[] = [
  {
    id: "office-administration",
    title: "Office Administration Mastery",
    description: "Comprehensive administrative scenario testing organizational skills, communication, and multi-tasking",
    category: "Operations & Administration",
    industry: "General Business",
    difficulty: "entry",
    timeLimit: 45,
    skills: ["Organization", "Communication", "Multi-tasking", "Time Management", "Document Control"],
    instructions: "You're the office administrator for HPS, an engineering consultancy. Handle multiple competing priorities while maintaining professional standards.",
    icon: ClipboardList,
    colour: "text-indigo-600",
    completionRate: 82,
    averageScore: 78,
    totalAttempts: 156,
    employerCount: 12,
    trending: true,
    featured: true,
    tasks: [
      {
        id: "front-office-management",
        title: "Front of House Coordination",
        description: "Handle incoming calls, greet visitors, and manage initial client interactions professionally",
        type: "strategy",
        points: 30,
        required: true
      },
      {
        id: "document-control",
        title: "Document Quality & Control",
        description: "Review, quality-check, and prepare client documents for distribution",
        type: "analysis",
        points: 25,
        required: true
      },
      {
        id: "multi-task-prioritization",
        title: "Task Prioritization Strategy",
        description: "Plan your approach to managing spreadsheets, marketing activities, and administrative duties",
        type: "strategy",
        points: 25,
        required: true
      },
      {
        id: "proactive-communication",
        title: "Initiative & Communication",
        description: "Demonstrate how you'd handle unclear instructions and maintain effective communication",
        type: "strategy",
        points: 20,
        required: true
      }
    ]
  },
  {
    id: "media-planning-advanced",
    title: "Strategic Media Planning",
    description: "Advanced media planning with budget optimization and audience targeting strategy",
    category: "Marketing & Advertising",
    industry: "Marketing",
    difficulty: "intermediate",
    timeLimit: 50,
    skills: ["Media Planning", "Budget Optimization", "Audience Analysis", "Campaign Strategy"],
    instructions: "Plan a comprehensive media campaign for an animal rescue charity with £10,000 budget, balancing cost-effectiveness with audience reach.",
    icon: TrendingUp,
    colour: "text-emerald-600",
    completionRate: 73,
    averageScore: 82,
    totalAttempts: 89,
    employerCount: 8,
    trending: true,
    featured: false,
    tasks: [
      {
        id: "cost-calculation-advanced",
        title: "Advanced Cost Analysis",
        description: "Calculate net costs for newspaper advertising including discounts, commissions, and VAT implications",
        type: "calculation",
        points: 35,
        required: true
      },
      {
        id: "channel-optimization",
        title: "Media Channel Optimization",
        description: "Recommend optimal media mix for target audience with budget constraints",
        type: "strategy",
        points: 35,
        required: true
      },
      {
        id: "audience-expansion-strategy",
        title: "Audience Development & Expansion",
        description: "Identify new target segments and justify expansion rationale with supporting data",
        type: "analysis",
        points: 30,
        required: true
      }
    ]
  },
  {
    id: "financial-analysis-pro",
    title: "Financial Analysis Professional",
    description: "Advanced P&L analysis with strategic recommendations and variance analysis",
    category: "Finance & Accounting",
    industry: "Finance",
    difficulty: "advanced",
    timeLimit: 75,
    skills: ["Financial Analysis", "Excel Modeling", "Strategic Planning", "Variance Analysis"],
    instructions: "Analyze complex financial statements, identify trends, and provide strategic business recommendations.",
    icon: Calculator,
    colour: "text-green-600",
    completionRate: 61,
    averageScore: 85,
    totalAttempts: 67,
    employerCount: 15,
    trending: false,
    featured: true,
    tasks: [
      {
        id: "financial-modeling",
        title: "Financial Model Creation",
        description: "Build comprehensive financial models with multiple scenarios",
        type: "calculation",
        points: 40,
        required: true
      },
      {
        id: "variance-analysis",
        title: "Variance Analysis & Insights",
        description: "Analyze variances and provide business insights",
        type: "analysis",
        points: 35,
        required: true
      },
      {
        id: "strategic-recommendations",
        title: "Strategic Business Recommendations",
        description: "Provide actionable strategic recommendations based on financial analysis",
        type: "strategy",
        points: 25,
        required: true
      }
    ]
  },
  {
    id: "customer-service-excellence",
    title: "Customer Service Excellence",
    description: "Handle complex customer scenarios with empathy, problem-solving, and professionalism",
    category: "Customer Service",
    industry: "Service",
    difficulty: "intermediate",
    timeLimit: 40,
    skills: ["Customer Service", "Problem Solving", "Empathy", "Conflict Resolution"],
    instructions: "Navigate challenging customer interactions while maintaining service standards and company values.",
    icon: Users,
    colour: "text-blue-600",
    completionRate: 88,
    averageScore: 76,
    totalAttempts: 203,
    employerCount: 22,
    trending: true,
    featured: false,
    tasks: [
      {
        id: "complaint-resolution",
        title: "Complaint Resolution Strategy",
        description: "Handle a complex customer complaint with professionalism and empathy",
        type: "strategy",
        points: 40,
        required: true
      },
      {
        id: "service-recovery",
        title: "Service Recovery Plan",
        description: "Design a service recovery plan to restore customer confidence",
        type: "strategy",
        points: 35,
        required: true
      },
      {
        id: "process-improvement",
        title: "Process Improvement Suggestions",
        description: "Identify process improvements to prevent similar issues",
        type: "analysis",
        points: 25,
        required: true
      }
    ]
  },
  {
    id: "data-analysis-visualization",
    title: "Data Analysis & Visualization",
    description: "Transform raw data into actionable insights with compelling visualizations",
    category: "Data & Analytics",
    industry: "Technology",
    difficulty: "intermediate",
    timeLimit: 60,
    skills: ["Data Analysis", "Visualization", "Statistical Analysis", "Business Intelligence"],
    instructions: "Analyze sales data trends, create meaningful visualizations, and provide business recommendations.",
    icon: BarChart3,
    colour: "text-purple-600",
    completionRate: 69,
    averageScore: 81,
    totalAttempts: 134,
    employerCount: 18,
    trending: true,
    featured: true,
    tasks: [
      {
        id: "data-cleaning",
        title: "Data Cleaning & Preparation",
        description: "Clean and prepare raw data for analysis",
        type: "analysis",
        points: 25,
        required: true
      },
      {
        id: "trend-analysis",
        title: "Trend Analysis & Insights",
        description: "Identify trends and patterns in the data",
        type: "analysis",
        points: 40,
        required: true
      },
      {
        id: "visualization-creation",
        title: "Compelling Visualization",
        description: "Create clear, impactful visualizations to communicate findings",
        type: "creative",
        points: 35,
        required: true
      }
    ]
  },
  {
    id: "project-coordination",
    title: "Project Coordination Challenge",
    description: "Coordinate cross-functional project delivery with stakeholder management and timeline optimization",
    category: "Project Management",
    industry: "General Business",
    difficulty: "intermediate",
    timeLimit: 55,
    skills: ["Project Management", "Stakeholder Management", "Timeline Planning", "Risk Assessment"],
    instructions: "Coordinate a software implementation project across multiple departments with competing priorities.",
    icon: Target,
    colour: "text-orange-600",
    completionRate: 75,
    averageScore: 79,
    totalAttempts: 98,
    employerCount: 14,
    trending: false,
    featured: false,
    tasks: [
      {
        id: "stakeholder-analysis",
        title: "Stakeholder Analysis & Mapping",
        description: "Identify key stakeholders and their interests/influence",
        type: "analysis",
        points: 30,
        required: true
      },
      {
        id: "timeline-optimization",
        title: "Timeline & Resource Planning",
        description: "Create optimized project timeline with resource allocation",
        type: "strategy",
        points: 40,
        required: true
      },
      {
        id: "risk-mitigation",
        title: "Risk Assessment & Mitigation",
        description: "Identify project risks and develop mitigation strategies",
        type: "strategy",
        points: 30,
        required: true
      }
    ]
  }
];

// Add BarChart3 import
import { BarChart3 } from "lucide-react";

export default function EnhancedSkillsLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedIndustry, setSelectedIndustry] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");

  // Get unique values for filters
  const categories = [...new Set(enhancedSkillsChallenges.map(c => c.category))];
  const industries = [...new Set(enhancedSkillsChallenges.map(c => c.industry))];
  const difficulties = ["entry", "intermediate", "advanced"];

  // Filter and sort challenges
  const filteredChallenges = enhancedSkillsChallenges
    .filter(challenge => {
      const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          challenge.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          challenge.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === "all" || challenge.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === "all" || challenge.difficulty === selectedDifficulty;
      const matchesIndustry = selectedIndustry === "all" || challenge.industry === selectedIndustry;
      
      return matchesSearch && matchesCategory && matchesDifficulty && matchesIndustry;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "featured":
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
        case "difficulty":
          const difficultyOrder = { "entry": 1, "intermediate": 2, "advanced": 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        case "popularity":
          return (b.totalAttempts || 0) - (a.totalAttempts || 0);
        case "score":
          return (b.averageScore || 0) - (a.averageScore || 0);
        default:
          return 0;
      }
    });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "entry": return "text-green-600 bg-green-100";
      case "intermediate": return "text-yellow-600 bg-yellow-100";
      case "advanced": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getTaskTypeIcon = (type: string) => {
    switch (type) {
      case "calculation": return Calculator;
      case "analysis": return Brain;
      case "creative": return Palette;
      case "strategy": return Target;
      case "document": return FileText;
      default: return FileText;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Enhanced Skills Challenge Library</h1>
        <p className="text-lg text-muted-foreground">
          Real-world challenges designed by industry professionals to showcase your abilities
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search challenges, skills, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {difficulties.map(difficulty => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger>
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {industries.map(industry => (
                  <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="difficulty">Difficulty</SelectItem>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="score">Average Score</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Showing {filteredChallenges.length} challenges
        </p>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            List
          </Button>
        </div>
      </div>

      {/* Challenges Grid */}
      <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
        <AnimatePresence>
          {filteredChallenges.map((challenge) => {
            const Icon = challenge.icon;
            
            return (
              <motion.div
                key={challenge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="hover:shadow-lg transition-shadow duration-200 h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-opacity-10`} style={{ backgroundColor: challenge.colour.replace('text-', '') + '20' }}>
                          <Icon className={`h-6 w-6 ${challenge.colour}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {challenge.title}
                            {challenge.featured && (
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            )}
                            {challenge.trending && (
                              <TrendingUp className="h-4 w-4 text-green-500" />
                            )}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">{challenge.category}</p>
                        </div>
                      </div>
                      <Badge className={getDifficultyColor(challenge.difficulty)}>
                        {challenge.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{challenge.description}</p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {challenge.timeLimit} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {challenge.totalAttempts} attempts
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {challenge.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {challenge.skills.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{challenge.skills.length - 3} more
                        </Badge>
                      )}
                    </div>

                    {challenge.averageScore && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Success Rate</span>
                          <span>{challenge.completionRate}%</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Avg Score</span>
                          <span>{challenge.averageScore}%</span>
                        </div>
                      </div>
                    )}

                    {/* Tasks Preview */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Challenge Tasks:</h4>
                      <div className="space-y-1">
                        {challenge.tasks.slice(0, 2).map((task) => {
                          const TaskIcon = getTaskTypeIcon(task.type);
                          return (
                            <div key={task.id} className="flex items-center text-xs text-muted-foreground">
                              <TaskIcon className="h-3 w-3 mr-2" />
                              <span>{task.title}</span>
                              <span className="ml-auto">{task.points}pts</span>
                            </div>
                          );
                        })}
                        {challenge.tasks.length > 2 && (
                          <p className="text-xs text-muted-foreground">
                            +{challenge.tasks.length - 2} more tasks...
                          </p>
                        )}
                      </div>
                    </div>

                    <Button className="w-full">
                      <Zap className="h-4 w-4 mr-2" />
                      Start Challenge
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredChallenges.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No challenges found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search criteria or filters
          </p>
          <Button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("all");
              setSelectedDifficulty("all");
              setSelectedIndustry("all");
            }}
          >
            Clear All Filters
          </Button>
        </div>
      )}

      {/* Challenge Benefits */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Why Complete Skills Challenges?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-medium mb-2">Verified Skills</h4>
              <p className="text-sm text-muted-foreground">
                Demonstrate real capabilities to employers through practical challenges.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-medium mb-2">Industry Recognition</h4>
              <p className="text-sm text-muted-foreground">
                Challenges designed by industry professionals and recognized by employers.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-medium mb-2">Career Growth</h4>
              <p className="text-sm text-muted-foreground">
                Identify development areas and track your professional progress.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
              <h4 className="font-medium mb-2">Instant Feedback</h4>
              <p className="text-sm text-muted-foreground">
                Receive detailed feedback and improvement suggestions immediately.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Add missing import
import { Palette } from "lucide-react";