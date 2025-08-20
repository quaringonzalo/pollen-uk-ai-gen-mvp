import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { 
  Calculator, 
  TrendingUp, 
  Users, 
  MessageCircle, 
  Presentation, 
  FileText,
  Timer,
  CheckCircle,
  Star,
  ClipboardList,
  Target,
  Briefcase,
  MapPin,
  Building2
} from "lucide-react";

interface ProfessionalChallenge {
  id: string;
  title: string;
  description: string;
  category: string;
  industry: string;
  difficulty: "entry" | "intermediate" | "advanced";
  timeLimit: number; // minutes
  skills: string[];
  instructions: string;
  tasks: Task[];
  icon: any;
  colour: string;
  examplePrompt?: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  type: "calculation" | "analysis" | "creative" | "strategy" | "document";
  points: number;
  required: boolean;
}

// Based on your actual assessment examples
const professionalChallenges: ProfessionalChallenge[] = [
  {
    id: "media-planning",
    title: "Media Planning Challenge",
    description: "Plan an advertising campaign across multiple channels within budget constraints",
    category: "Marketing & Advertising",
    industry: "Marketing",
    difficulty: "intermediate",
    timeLimit: 45,
    skills: ["Media Planning", "Budget Management", "Strategic Thinking", "Client Services"],
    instructions: "You're working with an animal rescue charity planning a £10,000 advertising campaign. Calculate costs, recommend channels, and justify your strategy.",
    icon: Presentation,
    colour: "text-blue-600",
    examplePrompt: "Calculate newspaper advertising costs with 15% discount and 5% commission, then recommend additional channels for 55+ animal lovers.",
    tasks: [
      {
        id: "cost-calculation",
        title: "Newspaper Cost Analysis",
        description: "Calculate net cost and VAT for newspaper advertising with discounts and commission",
        type: "calculation",
        points: 30,
        required: true
      },
      {
        id: "channel-strategy",
        title: "Media Channel Recommendations",
        description: "Recommend and justify new media channels for the target audience",
        type: "strategy",
        points: 40,
        required: true
      },
      {
        id: "audience-expansion",
        title: "Audience Development Strategy",
        description: "Identify additional target audiences and explain rationale",
        type: "analysis",
        points: 30,
        required: true
      }
    ]
  },
  {
    id: "financial-analysis",
    title: "P&L Analysis Challenge",
    description: "Create comprehensive Profit & Loss statements and provide business insights",
    category: "Finance & Accounting",
    industry: "Finance",
    difficulty: "intermediate",
    timeLimit: 60,
    skills: ["Financial Analysis", "Excel/Spreadsheets", "Business Insight", "Data Interpretation"],
    instructions: "Analyze a clothing business's financial data to create P&L statements and provide strategic recommendations.",
    icon: Calculator,
    colour: "text-green-600",
    examplePrompt: "Calculate gross profit, operating expenses, and net income, then provide strategic insights and recommendations.",
    tasks: [
      {
        id: "pl-calculations",
        title: "P&L Statement Creation",
        description: "Calculate gross profit, operating income, and net income from provided data",
        type: "calculation",
        points: 40,
        required: true
      },
      {
        id: "financial-analysis",
        title: "Business Insights Analysis",
        description: "Analyze the financial performance and identify areas for investigation",
        type: "analysis",
        points: 35,
        required: true
      },
      {
        id: "recommendations",
        title: "Strategic Recommendations",
        description: "Provide actionable business recommendations based on the financial data",
        type: "strategy",
        points: 25,
        required: true
      }
    ]
  },
  {
    id: "task-management",
    title: "Workplace Organisation Challenge",
    description: "Demonstrate prioritisation and crisis management skills in a multi-task environment",
    category: "Operations & Management",
    industry: "General Business",
    difficulty: "entry",
    timeLimit: 30,
    skills: ["Task Prioritisation", "Time Management", "Customer Service", "Problem Solving"],
    instructions: "Manage multiple competing priorities while handling an urgent client complaint in a small business environment.",
    icon: Users,
    colour: "text-purple-600",
    examplePrompt: "Prioritise database updates, marketing tasks, and document review while managing a client complaint.",
    tasks: [
      {
        id: "prioritization-strategy",
        title: "Task Prioritisation Plan",
        description: "Outline your approach to organising and prioritising the given tasks",
        type: "strategy",
        points: 40,
        required: true
      },
      {
        id: "crisis-management",
        title: "Client Complaint Resolution",
        description: "Detail how you would handle the urgent client complaint while managing other tasks",
        type: "strategy",
        points: 35,
        required: true
      },
      {
        id: "time-allocation",
        title: "Daily Management Approach",
        description: "Explain your methods for staying organised and meeting deadlines",
        type: "analysis",
        points: 25,
        required: true
      }
    ]
  },
  {
    id: "social-media-strategy",
    title: "Brand Communication Challenge",
    description: "Create authentic social media content that reflects brand values and engages target audiences",
    category: "Marketing & Communications",
    industry: "Marketing",
    difficulty: "entry",
    timeLimit: 30,
    skills: ["Content Creation", "Brand Voice", "Social Media Strategy", "Visual Communication"],
    instructions: "Design a social media post for Pollen, including platform selection rationale and content strategy.",
    icon: MessageCircle,
    colour: "text-pink-600",
    examplePrompt: "Create a mock social media post about Pollen's mission, statistics, partnerships, or success stories with platform justification.",
    tasks: [
      {
        id: "platform-selection",
        title: "Platform Strategy",
        description: "Choose and justify the most appropriate social media platform for your content",
        type: "strategy",
        points: 25,
        required: true
      },
      {
        id: "content-creation",
        title: "Content Development",
        description: "Create engaging copy and visual concept that aligns with Pollen's brand",
        type: "creative",
        points: 50,
        required: true
      },
      {
        id: "brand-alignment",
        title: "Brand Voice Analysis",
        description: "Demonstrate understanding of Pollen's mission and values in your content",
        type: "analysis",
        points: 25,
        required: true
      }
    ]
  },
  {
    id: "office-administration",
    title: "Office Administration Challenge",
    description: "Comprehensive administrative scenario testing organizational skills, communication, and multi-tasking",
    category: "Operations & Administration",
    industry: "General Business",
    difficulty: "entry",
    timeLimit: 45,
    skills: ["Organization", "Communication", "Multi-tasking", "Time Management", "Document Control"],
    instructions: "You're the office administrator for HPS, an engineering consultancy. Handle multiple competing priorities while maintaining professional standards.",
    icon: ClipboardList,
    colour: "text-indigo-600",
    examplePrompt: "Manage front-of-house duties, spreadsheet work, social media tasks, and document quality control while prioritizing effectively.",
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
    examplePrompt: "Calculate media costs with industry discounts, recommend channel mix for 55+ animal lovers, and justify audience expansion strategy.",
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
  }
];

export default function ProfessionalSkillsChallenges() {
  const { toast } = useToast();
  const [selectedChallenge, setSelectedChallenge] = useState<ProfessionalChallenge | null>(null);
  const [currentTask, setCurrentTask] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [challengeStarted, setChallengeStarted] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionData, setCompletionData] = useState<{ score: number; challengeTitle: string } | null>(null);

  const submitChallengeMutation = useMutation({
    mutationFn: async (data: { challengeId: string, responses: Record<string, string>, timeSpent: number }) => {
      // Simulate submission
      return { success: true, score: Math.floor(Math.random() * 30) + 70 };
    },
    onSuccess: (data) => {
      toast({
        title: "Challenge Submitted Successfully!",
        description: `You scored ${data.score}%. Great work on demonstrating your professional skills!`,
      });
      setSelectedChallenge(null);
      setChallengeStarted(false);
      setResponses({});
      setCurrentTask(0);
      
      // Show completion modal with job recommendations
      setShowCompletionModal(true);
      setCompletionData({ score: data.score, challengeTitle: selectedChallenge?.title || "" });
    },
  });

  const startChallenge = (challenge: ProfessionalChallenge) => {
    setSelectedChallenge(challenge);
    setTimeRemaining(challenge.timeLimit * 60); // Convert to seconds
    setChallengeStarted(true);
    setCurrentTask(0);
    setResponses({});
    
    // Start countdown timer
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev && prev <= 1) {
          clearInterval(timer);
          handleSubmitChallenge();
          return 0;
        }
        return prev ? prev - 1 : 0;
      });
    }, 1000);
  };

  const handleSubmitChallenge = () => {
    if (!selectedChallenge) return;
    
    const timeSpent = selectedChallenge.timeLimit * 60 - (timeRemaining || 0);
    submitChallengeMutation.mutate({
      challengeId: selectedChallenge.id,
      responses,
      timeSpent
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "entry": return "text-green-600 bg-green-100";
      case "intermediate": return "text-yellow-600 bg-yellow-100";
      case "advanced": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  if (challengeStarted && selectedChallenge) {
    const currentTaskData = selectedChallenge.tasks[currentTask];
    const isLastTask = currentTask === selectedChallenge.tasks.length - 1;
    const completedTasks = Object.keys(responses).length;

    return (
      <div className="max-w-4xl mx-auto p-6">
        {/* Challenge Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">{selectedChallenge.title}</h1>
              <p className="text-muted-foreground">{selectedChallenge.category}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-red-600">
                {timeRemaining ? formatTime(timeRemaining) : "00:00"}
              </div>
              <p className="text-sm text-muted-foreground">Time Remaining</p>
            </div>
          </div>
          
          <Progress 
            value={(completedTasks / selectedChallenge.tasks.length) * 100} 
            className="h-2 mb-2" 
          />
          <p className="text-sm text-muted-foreground">
            Task {currentTask + 1} of {selectedChallenge.tasks.length} • {completedTasks} completed
          </p>
        </div>

        {/* Current Task */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <span className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                  {currentTask + 1}
                </span>
                {currentTaskData.title}
              </CardTitle>
              <Badge variant="outline">
                {currentTaskData.points} points
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{currentTaskData.description}</p>
            
            <div>
              <Label htmlFor="response">Your Response *</Label>
              <Textarea
                id="response"
                value={responses[currentTaskData.id] || ""}
                onChange={(e) => setResponses(prev => ({
                  ...prev,
                  [currentTaskData.id]: e.target.value
                }))}
                placeholder="Provide your detailed response here..."
                rows={8}
                className="mt-2"
              />
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentTask(Math.max(0, currentTask - 1))}
                disabled={currentTask === 0}
              >
                Previous Task
              </Button>
              
              {isLastTask ? (
                <Button
                  onClick={handleSubmitChallenge}
                  disabled={!responses[currentTaskData.id] || submitChallengeMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {submitChallengeMutation.isPending ? "Submitting..." : "Submit Challenge"}
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentTask(currentTask + 1)}
                  disabled={!responses[currentTaskData.id]}
                >
                  Next Task
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Task Overview Sidebar */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Task Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedChallenge.tasks.map((task, index) => (
                <div 
                  key={task.id}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colours ${
                    index === currentTask ? "bg-blue-50 border-blue-200" : 
                    responses[task.id] ? "bg-green-50 border-green-200" : "bg-gray-50"
                  }`}
                  onClick={() => setCurrentTask(index)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      responses[task.id] ? "bg-green-600 text-white" : 
                      index === currentTask ? "bg-blue-600 text-white" : "bg-gray-400 text-white"
                    }`}>
                      {responses[task.id] ? <CheckCircle className="h-4 w-4" /> : index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.points} points</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Professional Skills Challenges</h1>
        <p className="text-lg text-muted-foreground">
          Real-world scenarios that demonstrate your practical skills to employers
        </p>
      </div>

      {/* Challenge Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {professionalChallenges.map((challenge) => {
          const Icon = challenge.icon;
          
          return (
            <Card key={challenge.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className={`h-8 w-8 ${challenge.colour}`} />
                    <div>
                      <CardTitle className="text-xl">{challenge.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{challenge.category}</p>
                    </div>
                  </div>
                  <Badge className={getDifficultyColor(challenge.difficulty)}>
                    {challenge.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{challenge.description}</p>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Timer className="h-4 w-4" />
                    {challenge.timeLimit} minutes
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    {challenge.tasks.length} tasks
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {challenge.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>

                {challenge.examplePrompt && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Example:</strong> {challenge.examplePrompt}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Challenge Tasks:</h4>
                  {challenge.tasks.slice(0, 2).map((task, index) => (
                    <div key={task.id} className="flex items-center justify-between text-xs">
                      <span>{index + 1}. {task.title}</span>
                      <span className="text-muted-foreground">{task.points}pts</span>
                    </div>
                  ))}
                  {challenge.tasks.length > 2 && (
                    <p className="text-xs text-muted-foreground">
                      +{challenge.tasks.length - 2} more tasks...
                    </p>
                  )}
                </div>

                <Button 
                  className="w-full"
                  onClick={() => startChallenge(challenge)}
                >
                  Start Challenge
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Benefits Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Why Professional Skills Challenges Matter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-medium mb-2">Real-World Application</h4>
              <p className="text-sm text-muted-foreground">
                Demonstrate skills through practical scenarios that mirror actual job responsibilities.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-medium mb-2">Employer Confidence</h4>
              <p className="text-sm text-muted-foreground">
                Verified performance on job-relevant tasks builds employer trust in your capabilities.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-medium mb-2">Industry Relevance</h4>
              <p className="text-sm text-muted-foreground">
                Challenges designed by industry professionals reflect current workplace demands.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}