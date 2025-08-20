import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Brain, Target, Lightbulb, Users, TrendingUp, Clock,
  CheckCircle, Star, Award, Zap, BarChart, Heart
} from "lucide-react";

interface AssessmentModule {
  id: string;
  title: string;
  description: string;
  duration: number;
  questions: any[];
  type: "personality" | "cognitive" | "situational" | "values" | "skills";
}

export default function ComprehensiveAssessmentPage() {
  const [currentModule, setCurrentModule] = useState(0);
  const [responses, setResponses] = useState<{ [key: string]: any }>({});
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  const assessmentModules: AssessmentModule[] = [
    {
      id: "big_five",
      title: "Personality Profile (Big Five)",
      description: "Scientifically validated personality assessment based on the Five-Factor Model",
      duration: 8,
      type: "personality",
      questions: [
        {
          id: "extraversion_1",
          question: "I am someone who is talkative",
          type: "likert",
          scale: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
          trait: "extraversion"
        },
        {
          id: "extraversion_2", 
          question: "I am someone who is reserved",
          type: "likert",
          scale: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
          trait: "extraversion",
          reverse: true
        },
        {
          id: "agreeableness_1",
          question: "I am someone who is helpful and unselfish with others",
          type: "likert",
          scale: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
          trait: "agreeableness"
        },
        {
          id: "conscientiousness_1",
          question: "I am someone who does a thorough job",
          type: "likert",
          scale: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
          trait: "conscientiousness"
        },
        {
          id: "neuroticism_1",
          question: "I am someone who can be tense",
          type: "likert",
          scale: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
          trait: "neuroticism"
        },
        {
          id: "openness_1",
          question: "I am someone who is original, comes up with new ideas",
          type: "likert",
          scale: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
          trait: "openness"
        }
      ]
    },
    {
      id: "cognitive_ability",
      title: "Cognitive Ability Assessment",
      description: "Evaluate reasoning, problem-solving, and learning capacity",
      duration: 15,
      type: "cognitive",
      questions: [
        {
          id: "logical_reasoning_1",
          question: "If all roses are flowers and some flowers fade quickly, which statement must be true?",
          type: "multiple_choice",
          options: [
            "All roses fade quickly",
            "Some roses might fade quickly", 
            "No roses fade quickly",
            "All flowers are roses"
          ],
          correct: 1,
          skill: "logical_reasoning"
        },
        {
          id: "numerical_reasoning_1",
          question: "A company's sales increased by 25% in Q1 and decreased by 20% in Q2. If Q1 sales were £100,000, what were Q2 sales?",
          type: "multiple_choice",
          options: ["£80,000", "£100,000", "£105,000", "£125,000"],
          correct: 1,
          skill: "numerical_reasoning"
        },
        {
          id: "pattern_recognition_1",
          question: "What comes next in the sequence: 2, 6, 18, 54, ?",
          type: "multiple_choice",
          options: ["108", "162", "216", "270"],
          correct: 1,
          skill: "pattern_recognition"
        }
      ]
    },
    {
      id: "situational_judgment",
      title: "Situational Judgment Test",
      description: "Assess decision-making in realistic workplace scenarios",
      duration: 12,
      type: "situational",
      questions: [
        {
          id: "teamwork_scenario_1",
          question: "You're working on a team project with a tight deadline. One team member consistently misses meetings and doesn't complete their tasks on time. What's the most effective approach?",
          type: "ranking",
          options: [
            "Speak privately with the team member to understand any challenges they're facing",
            "Redistribute their tasks among other team members to ensure project completion",
            "Report the issue to your manager immediately",
            "Confront them during the next team meeting about their performance"
          ],
          skills: ["teamwork", "communication", "problem_solving"]
        },
        {
          id: "customer_service_scenario_1",
          question: "A customer is upset because they received the wrong product and needs it for an important event tomorrow. The correct item is out of stock. How do you handle this?",
          type: "ranking",
          options: [
            "Apologize sincerely and offer a full refund plus expedited shipping credit for future orders",
            "Contact other store locations to find the item and arrange same-day delivery",
            "Offer a similar upgraded product at the same price with guaranteed delivery",
            "Explain company policy and suggest they check with competitors"
          ],
          skills: ["customer_service", "problem_solving", "empathy"]
        }
      ]
    },
    {
      id: "work_values",
      title: "Work Values Assessment",
      description: "Identify what motivates and drives you in a work environment",
      duration: 6,
      type: "values",
      questions: [
        {
          id: "value_importance_1",
          question: "Rate the importance of each work value to you:",
          type: "value_rating",
          values: [
            { id: "autonomy", label: "Independence and autonomy", description: "Having freedom to make decisions and work independently" },
            { id: "achievement", label: "Achievement and accomplishment", description: "Reaching goals and seeing tangible results" },
            { id: "security", label: "Job security and stability", description: "Having a stable, predictable work environment" },
            { id: "variety", label: "Variety and change", description: "Having diverse tasks and changing responsibilities" },
            { id: "helping", label: "Helping others", description: "Making a positive impact on people's lives" },
            { id: "creativity", label: "Creativity and innovation", description: "Being able to express creativity and develop new ideas" },
            { id: "recognition", label: "Recognition and status", description: "Being acknowledged for good work and having prestige" },
            { id: "learning", label: "Learning and growth", description: "Continuously developing new skills and knowledge" }
          ]
        }
      ]
    },
    {
      id: "emotional_intelligence",
      title: "Emotional Intelligence",
      description: "Assess your ability to understand and manage emotions effectively",
      duration: 10,
      type: "personality", 
      questions: [
        {
          id: "self_awareness_1",
          question: "You've just received criticism from your manager about a project. How do you typically react?",
          type: "multiple_choice",
          options: [
            "Feel defensive and want to explain why the criticism is unfair",
            "Feel disappointed but recognise it as an opportunity to improve",
            "Feel anxious and worry about your job security",
            "Feel motivated to prove them wrong through better performance"
          ],
          skill: "self_awareness"
        },
        {
          id: "empathy_1",
          question: "A colleague seems unusually quiet and withdrawn during team meetings. What would you most likely do?",
          type: "multiple_choice",
          options: [
            "Give them space and assume they'll speak up if they need help",
            "Ask them privately if everything is okay and if they need support",
            "Mention to your manager that they seem disengaged",
            "Try to include them more actively in team discussions"
          ],
          skill: "empathy"
        },
        {
          id: "social_skills_1",
          question: "You need to deliver disappointing news to a client about a project delay. How do you approach this?",
          type: "ranking",
          options: [
            "Call them immediately to explain the situation and apologize",
            "Prepare a detailed email explaining the delay and next steps",
            "Schedule a video call to discuss the situation face-to-face",
            "Have your manager deliver the news since it's bad news"
          ],
          skill: "social_skills"
        }
      ]
    }
  ];

  const currentAssessment = assessmentModules[currentModule];
  const progress = ((currentModule + 1) / assessmentModules.length) * 100;

  const handleModuleComplete = (moduleId: string, moduleResponses: any) => {
    setResponses(prev => ({ ...prev, [moduleId]: moduleResponses }));
    setCompletedModules(prev => [...prev, moduleId]);
    
    if (currentModule < assessmentModules.length - 1) {
      setCurrentModule(prev => prev + 1);
    } else {
      // Assessment complete - calculate comprehensive profile
      const profile = calculateComprehensiveProfile(responses);
      console.log("Comprehensive Profile:", profile);
      // Navigate to results or next step
    }
  };

  const renderQuestion = (question: any, questionIndex: number, moduleResponses: any, setModuleResponses: any) => {
    switch (question.type) {
      case "likert":
        return (
          <Card key={question.id} className="p-4">
            <h4 className="font-medium mb-4">{questionIndex + 1}. {question.question}</h4>
            <RadioGroup
              value={moduleResponses[question.id]?.toString() || ""}
              onValueChange={(value) => setModuleResponses((prev: any) => ({ ...prev, [question.id]: parseInt(value) }))}
            >
              {question.scale.map((option: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={index.toString()} id={`${question.id}-${index}`} />
                  <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </Card>
        );

      case "multiple_choice":
        return (
          <Card key={question.id} className="p-4">
            <h4 className="font-medium mb-4">{questionIndex + 1}. {question.question}</h4>
            <RadioGroup
              value={moduleResponses[question.id]?.toString() || ""}
              onValueChange={(value) => setModuleResponses((prev: any) => ({ ...prev, [question.id]: parseInt(value) }))}
            >
              {question.options.map((option: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={index.toString()} id={`${question.id}-${index}`} />
                  <Label htmlFor={`${question.id}-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          </Card>
        );

      case "ranking":
        return (
          <Card key={question.id} className="p-4">
            <h4 className="font-medium mb-4">{questionIndex + 1}. {question.question}</h4>
            <p className="text-sm text-gray-600 mb-4">Rank these options from most effective (1) to least effective (4):</p>
            <div className="space-y-3">
              {question.options.map((option: string, index: number) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <select
                    value={moduleResponses[question.id]?.[index] || ""}
                    onChange={(e) => {
                      const rankings = { ...moduleResponses[question.id] };
                      rankings[index] = parseInt(e.target.value);
                      setModuleResponses((prev: any) => ({ ...prev, [question.id]: rankings }));
                    }}
                    className="w-16 p-1 border rounded"
                  >
                    <option value="">-</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                  <span className="flex-1">{option}</span>
                </div>
              ))}
            </div>
          </Card>
        );

      case "value_rating":
        return (
          <Card key={question.id} className="p-4">
            <h4 className="font-medium mb-4">{questionIndex + 1}. {question.question}</h4>
            <div className="space-y-6">
              {question.values.map((value: any) => (
                <div key={value.id} className="space-y-2">
                  <div>
                    <h5 className="font-medium">{value.label}</h5>
                    <p className="text-sm text-gray-600">{value.description}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">Not Important</span>
                    <Slider
                      value={[moduleResponses[question.id]?.[value.id] || 3]}
                      onValueChange={(values) => {
                        const ratings = { ...moduleResponses[question.id] };
                        ratings[value.id] = values[0];
                        setModuleResponses((prev: any) => ({ ...prev, [question.id]: ratings }));
                      }}
                      max={5}
                      min={1}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-500">Very Important</span>
                    <span className="w-8 text-center font-medium">
                      {moduleResponses[question.id]?.[value.id] || 3}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Comprehensive Career Assessment</h1>
          <p className="text-lg text-gray-600">
            Complete multiple assessment modules for accurate job matching
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Assessment Progress</h3>
              <span className="text-sm text-gray-600">
                {completedModules.length} of {assessmentModules.length} modules completed
              </span>
            </div>
            <Progress value={progress} className="h-3 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {assessmentModules.map((module, index) => (
                <div
                  key={module.id}
                  className={`p-3 rounded-lg border ${
                    completedModules.includes(module.id)
                      ? "bg-green-50 border-green-200"
                      : index === currentModule
                      ? "bg-blue-50 border-blue-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {completedModules.includes(module.id) ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : index === currentModule ? (
                      <Clock className="w-4 h-4 text-blue-600" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                    )}
                    <span className="font-medium text-sm">{module.title}</span>
                  </div>
                  <p className="text-xs text-gray-600">{module.duration} minutes</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Assessment Module */}
        <AssessmentModule
          module={currentAssessment}
          onComplete={handleModuleComplete}
          renderQuestion={renderQuestion}
        />
      </div>
    </div>
  );
}

function AssessmentModule({ 
  module, 
  onComplete, 
  renderQuestion 
}: { 
  module: AssessmentModule;
  onComplete: (moduleId: string, responses: any) => void;
  renderQuestion: any;
}) {
  const [moduleResponses, setModuleResponses] = useState<any>({});

  const isComplete = module.questions.every(q => {
    if (q.type === "value_rating") {
      return q.values.every((v: any) => moduleResponses[q.id]?.[v.id] !== undefined);
    } else if (q.type === "ranking") {
      return q.options.every((_: any, index: number) => moduleResponses[q.id]?.[index] !== undefined);
    }
    return moduleResponses[q.id] !== undefined;
  });

  const handleComplete = () => {
    onComplete(module.id, moduleResponses);
  };

  const getModuleIcon = (type: string) => {
    switch (type) {
      case "personality": return <Brain className="w-6 h-6" />;
      case "cognitive": return <Lightbulb className="w-6 h-6" />;
      case "situational": return <Users className="w-6 h-6" />;
      case "values": return <Heart className="w-6 h-6" />;
      default: return <Target className="w-6 h-6" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
            {getModuleIcon(module.type)}
          </div>
          <div>
            <CardTitle className="text-xl">{module.title}</CardTitle>
            <p className="text-gray-600">{module.description}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {module.duration} minutes
              </span>
              <span>{module.questions.length} questions</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="max-h-96 overflow-y-auto space-y-4">
          {module.questions.map((question, index) => 
            renderQuestion(question, index, moduleResponses, setModuleResponses)
          )}
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-600">
            {Object.keys(moduleResponses).length} of {module.questions.length} questions answered
          </div>
          <Button onClick={handleComplete} disabled={!isComplete}>
            Complete Module
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function calculateComprehensiveProfile(responses: any) {
  const profile = {
    personality: {},
    cognitive: {},
    values: {},
    emotionalIntelligence: {},
    situationalJudgment: {},
    overallMatch: 0
  };

  // Process Big Five personality results
  if (responses.big_five) {
    const traits = { extraversion: 0, agreeableness: 0, conscientiousness: 0, neuroticism: 0, openness: 0 };
    
    Object.entries(responses.big_five).forEach(([questionId, score]: [string, any]) => {
      const question = assessmentModules.find(m => m.id === "big_five")?.questions.find(q => q.id === questionId);
      if (question) {
        const adjustedScore = question.reverse ? (6 - score) : score;
        traits[question.trait as keyof typeof traits] += adjustedScore;
      }
    });

    profile.personality = traits;
  }

  // Process cognitive ability results
  if (responses.cognitive_ability) {
    const cognitive = { logical_reasoning: 0, numerical_reasoning: 0, pattern_recognition: 0 };
    
    Object.entries(responses.cognitive_ability).forEach(([questionId, answer]: [string, any]) => {
      const question = assessmentModules.find(m => m.id === "cognitive_ability")?.questions.find(q => q.id === questionId);
      if (question && answer === question.correct) {
        cognitive[question.skill as keyof typeof cognitive] += 1;
      }
    });

    profile.cognitive = cognitive;
  }

  // Process work values
  if (responses.work_values) {
    profile.values = responses.work_values.value_importance_1 || {};
  }

  return profile;
}

const assessmentModules: AssessmentModule[] = [];