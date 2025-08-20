import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { 
  Users, 
  Target, 
  Brain, 
  Heart,
  TrendingUp,
  CheckCircle,
  ArrowRight
} from "lucide-react";

// Enhanced DISC assessment with work scenario questions
const enhancedDiscQuestions = [
  {
    id: "leadership_style",
    category: "Leadership & Influence",
    question: "When leading a team project with tight deadlines, you typically:",
    options: [
      { 
        text: "Take charge immediately and delegate specific tasks to ensure quick execution", 
        disc: { red: 3, yellow: 1, green: 0, blue: 0 },
        descriptor: "Direct & Decisive"
      },
      { 
        text: "Motivate the team with enthusiasm and encourage creative collaboration", 
        disc: { red: 1, yellow: 3, green: 1, blue: 0 },
        descriptor: "Inspiring & Energetic"
      },
      { 
        text: "Focus on team harmony and ensure everyone feels supported throughout", 
        disc: { red: 0, yellow: 1, green: 3, blue: 0 },
        descriptor: "Supportive & Collaborative"
      },
      { 
        text: "Develop a detailed plan with clear processes and quality checkpoints", 
        disc: { red: 0, yellow: 0, green: 1, blue: 3 },
        descriptor: "Systematic & Thorough"
      }
    ]
  },
  {
    id: "problem_solving",
    category: "Problem Solving",
    question: "When faced with a complex workplace challenge, your first instinct is to:",
    options: [
      { 
        text: "Act quickly on your gut instinct and adjust as needed", 
        disc: { red: 3, yellow: 1, green: 0, blue: 0 },
        descriptor: "Action-Oriented"
      },
      { 
        text: "Brainstorm creative solutions with others and generate excitement", 
        disc: { red: 1, yellow: 3, green: 1, blue: 0 },
        descriptor: "Innovative & Social"
      },
      { 
        text: "Seek input from team members and build consensus gradually", 
        disc: { red: 0, yellow: 1, green: 3, blue: 0 },
        descriptor: "Consultative & Patient"
      },
      { 
        text: "Research thoroughly and analyse all available data before deciding", 
        disc: { red: 0, yellow: 0, green: 1, blue: 3 },
        descriptor: "Analytical & Careful"
      }
    ]
  },
  {
    id: "communication_style",
    category: "Communication",
    question: "In team meetings, you're most likely to:",
    options: [
      { 
        text: "Drive the agenda forward and push for concrete decisions", 
        disc: { red: 3, yellow: 0, green: 0, blue: 1 },
        descriptor: "Results-Focused"
      },
      { 
        text: "Share ideas enthusiastically and encourage open discussion", 
        disc: { red: 1, yellow: 3, green: 1, blue: 0 },
        descriptor: "Expressive & Engaging"
      },
      { 
        text: "Listen carefully to others and help facilitate understanding", 
        disc: { red: 0, yellow: 1, green: 3, blue: 0 },
        descriptor: "Diplomatic & Inclusive"
      },
      { 
        text: "Ask detailed questions and provide well-researched insights", 
        disc: { red: 0, yellow: 0, green: 1, blue: 3 },
        descriptor: "Precise & Thoughtful"
      }
    ]
  },
  {
    id: "work_environment",
    category: "Work Environment",
    question: "You perform best in a work environment that is:",
    options: [
      { 
        text: "Fast-paced with clear authority and competitive goals", 
        disc: { red: 3, yellow: 1, green: 0, blue: 0 },
        descriptor: "Dynamic & Competitive"
      },
      { 
        text: "Energetic with lots of interaction and variety in tasks", 
        disc: { red: 1, yellow: 3, green: 1, blue: 0 },
        descriptor: "Social & Varied"
      },
      { 
        text: "Stable with supportive colleagues and predictable routines", 
        disc: { red: 0, yellow: 0, green: 3, blue: 1 },
        descriptor: "Stable & Supportive"
      },
      { 
        text: "Organized with clear procedures and quality standards", 
        disc: { red: 0, yellow: 0, green: 1, blue: 3 },
        descriptor: "Structured & Quality-Focused"
      }
    ]
  },
  {
    id: "stress_response",
    category: "Stress Management",
    question: "When under significant work pressure, you tend to:",
    options: [
      { 
        text: "Become more direct and focused on getting results quickly", 
        disc: { red: 3, yellow: 0, green: 0, blue: 1 },
        descriptor: "Intensely Focused"
      },
      { 
        text: "Seek support from others and try to maintain team morale", 
        disc: { red: 0, yellow: 2, green: 2, blue: 0 },
        descriptor: "Socially Supportive"
      },
      { 
        text: "Prefer to work steadily and avoid additional changes", 
        disc: { red: 0, yellow: 0, green: 3, blue: 1 },
        descriptor: "Consistent & Steady"
      },
      { 
        text: "Double-check your work and ensure everything meets standards", 
        disc: { red: 0, yellow: 0, green: 1, blue: 3 },
        descriptor: "Careful & Meticulous"
      }
    ]
  },
  {
    id: "decision_making",
    category: "Decision Making",
    question: "When making important work decisions, you prefer to:",
    options: [
      { 
        text: "Decide quickly based on experience and move forward", 
        disc: { red: 3, yellow: 1, green: 0, blue: 0 },
        descriptor: "Quick & Confident"
      },
      { 
        text: "Discuss options with others and consider the human impact", 
        disc: { red: 0, yellow: 2, green: 2, blue: 0 },
        descriptor: "Collaborative & People-Focused"
      },
      { 
        text: "Take time to consider how changes will affect team stability", 
        disc: { red: 0, yellow: 0, green: 3, blue: 1 },
        descriptor: "Stability-Conscious"
      },
      { 
        text: "Gather comprehensive data and analyse all possible outcomes", 
        disc: { red: 0, yellow: 0, green: 0, blue: 3 },
        descriptor: "Data-Driven & Thorough"
      }
    ]
  },
  {
    id: "motivation_factors",
    category: "Motivation",
    question: "You're most motivated by work that offers:",
    options: [
      { 
        text: "Opportunities to lead, compete, and achieve ambitious goals", 
        disc: { red: 3, yellow: 1, green: 0, blue: 0 },
        descriptor: "Achievement-Driven"
      },
      { 
        text: "Recognition, variety, and the chance to inspire others", 
        disc: { red: 1, yellow: 3, green: 1, blue: 0 },
        descriptor: "Recognition & Impact-Seeking"
      },
      { 
        text: "Job security, team harmony, and helping others succeed", 
        disc: { red: 0, yellow: 1, green: 3, blue: 0 },
        descriptor: "Service & Stability-Oriented"
      },
      { 
        text: "Expertise development, accuracy, and systematic improvement", 
        disc: { red: 0, yellow: 0, green: 1, blue: 3 },
        descriptor: "Mastery & Quality-Focused"
      }
    ]
  },
  {
    id: "conflict_resolution",
    category: "Conflict Resolution",
    question: "When workplace conflicts arise, you typically:",
    options: [
      { 
        text: "Address the issue head-on and work toward a quick resolution", 
        disc: { red: 3, yellow: 1, green: 0, blue: 0 },
        descriptor: "Direct & Assertive"
      },
      { 
        text: "Try to mediate and find creative solutions that work for everyone", 
        disc: { red: 0, yellow: 3, green: 1, blue: 0 },
        descriptor: "Creative & Diplomatic"
      },
      { 
        text: "Listen to all parties and help them find common ground", 
        disc: { red: 0, yellow: 1, green: 3, blue: 0 },
        descriptor: "Patient & Understanding"
      },
      { 
        text: "Analyze the situation objectively and propose fact-based solutions", 
        disc: { red: 0, yellow: 0, green: 1, blue: 3 },
        descriptor: "Objective & Systematic"
      }
    ]
  }
];

const assessmentSchema = z.object({
  responses: z.record(z.string()).refine(
    (data) => Object.keys(data).length === enhancedDiscQuestions.length,
    "Please answer all questions"
  )
});

type AssessmentData = z.infer<typeof assessmentSchema>;

interface DiscProfile {
  red: number;
  yellow: number;
  green: number;
  blue: number;
  primaryProfile: string;
  secondaryProfile: string;
  workStyle: string;
  strengths: string[];
  developmentAreas: string[];
  idealRoles: string[];
  teamContribution: string;
}

interface EnhancedDiscAssessmentProps {
  onComplete: (profile: DiscProfile) => void;
  embedded?: boolean;
}

export default function EnhancedDiscAssessment({ onComplete, embedded = false }: EnhancedDiscAssessmentProps) {
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [discProfile, setDiscProfile] = useState<DiscProfile | null>(null);

  const form = useForm<AssessmentData>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      responses: {}
    }
  });

  const assessmentMutation = useMutation({
    mutationFn: async (data: AssessmentData) => {
      // Calculate DISC scores
      const scores = { red: 0, yellow: 0, green: 0, blue: 0 };
      
      Object.entries(data.responses).forEach(([questionId, selectedOption]) => {
        const question = enhancedDiscQuestions.find(q => q.id === questionId);
        const option = question?.options.find(opt => opt.text === selectedOption);
        
        if (option) {
          scores.red += option.disc.red;
          scores.yellow += option.disc.yellow;
          scores.green += option.disc.green;
          scores.blue += option.disc.blue;
        }
      });

      // Normalize scores to percentages
      const total = scores.red + scores.yellow + scores.green + scores.blue;
      const normalizedScores = {
        red: Math.round((scores.red / total) * 100),
        yellow: Math.round((scores.yellow / total) * 100),
        green: Math.round((scores.green / total) * 100),
        blue: Math.round((scores.blue / total) * 100)
      };

      // Determine primary and secondary profiles
      const profiles = [
        { name: "Dominant", score: normalizedScores.red, colour: "red" },
        { name: "Influencing", score: normalizedScores.yellow, colour: "yellow" },
        { name: "Steady", score: normalizedScores.green, colour: "green" },
        { name: "Conscientious", score: normalizedScores.blue, colour: "blue" }
      ].sort((a, b) => b.score - a.score);

      const profile: DiscProfile = {
        ...normalizedScores,
        primaryProfile: profiles[0].name,
        secondaryProfile: profiles[1].name,
        workStyle: getWorkStyle(profiles[0].name, profiles[1].name),
        strengths: getStrengths(profiles[0].name),
        developmentAreas: getDevelopmentAreas(profiles[0].name),
        idealRoles: getIdealRoles(profiles[0].name),
        teamContribution: getTeamContribution(profiles[0].name)
      };

      return profile;
    },
    onSuccess: (profile) => {
      setDiscProfile(profile);
      setShowResults(true);
      onComplete(profile);
    }
  });

  const getWorkStyle = (primary: string, secondary: string): string => {
    const combinations: Record<string, string> = {
      "Dominant-Influencing": "Direct and persuasive leader who drives results through people",
      "Dominant-Steady": "Determined achiever who values both results and relationships", 
      "Dominant-Conscientious": "Results-focused perfectionist with high standards",
      "Influencing-Dominant": "Charismatic leader who inspires action and change",
      "Influencing-Steady": "People-focused team player who builds consensus",
      "Influencing-Conscientious": "Enthusiastic communicator with attention to detail",
      "Steady-Dominant": "Reliable achiever who balances stability with drive",
      "Steady-Influencing": "Supportive team member who facilitates collaboration",
      "Steady-Conscientious": "Dependable specialist who ensures quality and consistency",
      "Conscientious-Dominant": "Analytical achiever who pursues excellence systematically",
      "Conscientious-Influencing": "Detail-oriented communicator who educates and informs",
      "Conscientious-Steady": "Methodical team member who maintains high standards"
    };
    
    return combinations[`${primary}-${secondary}`] || "Balanced and adaptable professional";
  };

  const getStrengths = (profile: string): string[] => {
    const strengths: Record<string, string[]> = {
      "Dominant": [
        "Takes charge in challenging situations",
        "Makes quick decisions under pressure", 
        "Drives results and meets deadlines",
        "Comfortable with authority and responsibility",
        "Competitive and goal-oriented"
      ],
      "Influencing": [
        "Builds rapport and networks effectively",
        "Motivates and inspires team members",
        "Communicates ideas persuasively",
        "Adapts well to change and variety",
        "Optimistic and enthusiastic approach"
      ],
      "Steady": [
        "Provides stability and consistency",
        "Works well in team environments",
        "Shows patience and understanding",
        "Reliable and dependable performer",
        "Supportive of others' development"
      ],
      "Conscientious": [
        "Maintains high quality standards",
        "Analyzes situations thoroughly",
        "Follows procedures and processes",
        "Provides accurate and detailed work",
        "Systematic problem-solving approach"
      ]
    };
    
    return strengths[profile] || [];
  };

  const getDevelopmentAreas = (profile: string): string[] => {
    const development: Record<string, string[]> = {
      "Dominant": [
        "Practicing active listening and patience",
        "Considering others' feelings in decisions",
        "Delegating without micromanaging",
        "Building consensus when appropriate"
      ],
      "Influencing": [
        "Following through on detail-oriented tasks",
        "Working independently for extended periods",
        "Managing time and priorities effectively",
        "Providing critical feedback constructively"
      ],
      "Steady": [
        "Adapting quickly to sudden changes",
        "Taking initiative in ambiguous situations",
        "Expressing disagreement when necessary",
        "Promoting personal achievements"
      ],
      "Conscientious": [
        "Making decisions with incomplete information",
        "Accepting 'good enough' solutions when appropriate",
        "Building relationships beyond work topics",
        "Communicating with less technical audiences"
      ]
    };
    
    return development[profile] || [];
  };

  const getIdealRoles = (profile: string): string[] => {
    const roles: Record<string, string[]> = {
      "Dominant": [
        "Team Leader / Manager",
        "Project Manager", 
        "Sales Manager",
        "Operations Director",
        "Entrepreneur"
      ],
      "Influencing": [
        "Sales Representative",
        "Marketing Coordinator",
        "Customer Success Manager",
        "Training Specialist",
        "Public Relations"
      ],
      "Steady": [
        "Human Resources Specialist",
        "Customer Service Representative",
        "Administrative Coordinator",
        "Team Support Specialist",
        "Account Manager"
      ],
      "Conscientious": [
        "Data Analyst",
        "Quality Assurance Specialist",
        "Financial Analyst",
        "Research Specialist",
        "Technical Writer"
      ]
    };
    
    return roles[profile] || [];
  };

  const getTeamContribution = (profile: string): string => {
    const contributions: Record<string, string> = {
      "Dominant": "Drives team performance and ensures goals are met through decisive leadership",
      "Influencing": "Energizes the team and facilitates collaboration through positive communication",
      "Steady": "Provides team stability and supports member development through consistent care",
      "Conscientious": "Ensures team quality and accuracy through systematic attention to detail"
    };
    
    return contributions[profile] || "Brings unique value to team dynamics";
  };

  const handleNext = () => {
    if (currentQuestion < enhancedDiscQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    assessmentMutation.mutate(form.getValues());
  };

  const progress = ((currentQuestion + 1) / enhancedDiscQuestions.length) * 100;
  const currentQ = enhancedDiscQuestions[currentQuestion];
  const isLastQuestion = currentQuestion === enhancedDiscQuestions.length - 1;
  const allQuestionsAnswered = Object.keys(form.watch("responses")).length === enhancedDiscQuestions.length;

  if (showResults && discProfile) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader className="text-center">
            <div className="mb-4">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-2xl">Your DISC Profile: {discProfile.primaryProfile}</CardTitle>
              <p className="text-muted-foreground mt-2">{discProfile.workStyle}</p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* DISC Scores Visualization */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{discProfile.red}%</div>
                <div className="text-sm font-medium">Dominant</div>
                <div className="text-xs text-muted-foreground">Direct & Decisive</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{discProfile.yellow}%</div>
                <div className="text-sm font-medium">Influencing</div>
                <div className="text-xs text-muted-foreground">Inspiring & Social</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{discProfile.green}%</div>
                <div className="text-sm font-medium">Steady</div>
                <div className="text-xs text-muted-foreground">Supportive & Stable</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{discProfile.blue}%</div>
                <div className="text-sm font-medium">Conscientious</div>
                <div className="text-xs text-muted-foreground">Careful & Accurate</div>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Key Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {discProfile.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Development Areas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {discProfile.developmentAreas.map((area, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <ArrowRight className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{area}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Ideal Roles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {discProfile.idealRoles.map((role, index) => (
                      <Badge key={index} variant="secondary">{role}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Team Contribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{discProfile.teamContribution}</p>
                </CardContent>
              </Card>
            </div>

            {!embedded && (
              <div className="text-center pt-4">
                <Button onClick={() => window.location.reload()}>
                  Take Assessment Again
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="text-center mb-4">
            <CardTitle className="text-2xl">Enhanced DISC Assessment</CardTitle>
            <p className="text-muted-foreground">
              Discover your work style and behavioural preferences
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Question {currentQuestion + 1} of {enhancedDiscQuestions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>

        <CardContent>
          <form>
            <div className="space-y-6">
              <div>
                <Badge variant="outline" className="mb-4">{currentQ.category}</Badge>
                <h3 className="text-lg font-medium mb-4">{currentQ.question}</h3>
                
                <RadioGroup
                  value={form.watch(`responses.${currentQ.id}`) || ""}
                  onValueChange={(value) => {
                    form.setValue(`responses.${currentQ.id}`, value);
                  }}
                  className="space-y-3"
                >
                  {currentQ.options.map((option, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <RadioGroupItem value={option.text} id={`option-${index}`} className="mt-1" />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        <div>
                          <div className="font-medium">{option.text}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Style: {option.descriptor}
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              
              {isLastQuestion ? (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!allQuestionsAnswered || assessmentMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {assessmentMutation.isPending ? "Analyzing..." : "Complete Assessment"}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!form.watch(`responses.${currentQ.id}`)}
                >
                  Next
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}