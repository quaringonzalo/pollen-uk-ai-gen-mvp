import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Brain, Code, Palette, Users, Calculator, MessageCircle, Target, Star } from "lucide-react";

interface Assessment {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number; // minutes
  questions: number;
  skills: string[];
  icon: any;
  colour: string;
  completionRate?: number;
  averageScore?: number;
}

const assessmentCategories = [
  {
    id: "cognitive",
    name: "Cognitive Abilities", 
    icon: Brain,
    colour: "text-purple-600",
    description: "Problem-solving, logical reasoning, and analytical thinking"
  },
  {
    id: "technical",
    name: "Technical Skills",
    icon: Code,
    colour: "text-blue-600", 
    description: "Programmeming, software tools, and technical competencies"
  },
  {
    id: "creative",
    name: "Creative Thinking",
    icon: Palette,
    colour: "text-pink-600",
    description: "Innovation, design thinking, and creative problem-solving"
  },
  {
    id: "communication",
    name: "Communication",
    icon: MessageCircle,
    colour: "text-green-600",
    description: "Written, verbal, and interpersonal communication skills"
  },
  {
    id: "leadership",
    name: "Leadership & Teamwork",
    icon: Users,
    colour: "text-orange-600",
    description: "Team collaboration, leadership potential, and social skills"
  },
  {
    id: "numerical",
    name: "Numerical Reasoning",
    icon: Calculator,
    colour: "text-red-600",
    description: "Mathematical skills, data analysis, and quantitative reasoning"
  }
];

const sampleAssessments: Assessment[] = [
  {
    id: "logical-reasoning",
    title: "Logical Reasoning",
    description: "Evaluate logical thinking and pattern recognition abilities",
    category: "cognitive",
    difficulty: "intermediate",
    duration: 25,
    questions: 20,
    skills: ["Pattern Recognition", "Logical Thinking", "Problem Solving"],
    icon: Brain,
    colour: "text-purple-600",
    completionRate: 78,
    averageScore: 72
  },
  {
    id: "javascript-fundamentals",
    title: "JavaScript Fundamentals",
    description: "Test core JavaScript concepts and programming skills", 
    category: "technical",
    difficulty: "beginner",
    duration: 30,
    questions: 25,
    skills: ["JavaScript", "Programming", "Web Development"],
    icon: Code,
    colour: "text-blue-600",
    completionRate: 85,
    averageScore: 68
  },
  {
    id: "design-thinking",
    title: "Design Thinking Process",
    description: "Assess creative problem-solving and user-centreed design approach",
    category: "creative", 
    difficulty: "intermediate",
    duration: 35,
    questions: 15,
    skills: ["Design Thinking", "User Experience", "Innovation"],
    icon: Palette,
    colour: "text-pink-600",
    completionRate: 65,
    averageScore: 75
  },
  {
    id: "written-communication",
    title: "Written Communication",
    description: "Evaluate clarity, structure, and effectiveness in written communication",
    category: "communication",
    difficulty: "beginner", 
    duration: 20,
    questions: 12,
    skills: ["Writing", "Communication", "Documentation"],
    icon: MessageCircle,
    colour: "text-green-600",
    completionRate: 92,
    averageScore: 71
  },
  {
    id: "team-collaboration",
    title: "Team Collaboration Scenarios",
    description: "Assess teamwork skills through realistic workplace scenarios",
    category: "leadership",
    difficulty: "intermediate",
    duration: 28,
    questions: 18,
    skills: ["Teamwork", "Collaboration", "Conflict Resolution"],
    icon: Users,
    colour: "text-orange-600",
    completionRate: 71,
    averageScore: 69
  },
  {
    id: "data-analysis",
    title: "Data Analysis & Interpretation",
    description: "Test ability to analyse data, identify trends, and draw insights",
    category: "numerical",
    difficulty: "advanced",
    duration: 40,
    questions: 22,
    skills: ["Data Analysis", "Statistics", "Critical Thinking"],
    icon: Calculator,
    colour: "text-red-600",
    completionRate: 58,
    averageScore: 74
  }
];

export default function EnhancedAssessmentBank() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  const { data: assessments = sampleAssessments } = useQuery({
    queryKey: ["/api/assessments"],
    initialData: sampleAssessments,
  });

  const startAssessmentMutation = useMutation({
    mutationFn: async (assessmentId: string) => {
      // Simulate starting an assessment
      return { assessmentId, started: true };
    },
    onSuccess: (data) => {
      console.log("Assessment started:", data.assessmentId);
      // In real app, navigate to assessment interface
    },
  });

  const filteredAssessments = assessments.filter((assessment: Assessment) => {
    const categoryMatch = selectedCategory === "all" || assessment.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === "all" || assessment.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "text-green-600 bg-green-100";
      case "intermediate": return "text-yellow-600 bg-yellow-100";
      case "advanced": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const handleStartAssessment = (assessmentId: string) => {
    startAssessmentMutation.mutate(assessmentId);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Skills Assessment Bank</h1>
        <p className="text-lg text-muted-foreground">
          Comprehensive assessments to validate your skills and boost your profile strength
        </p>
      </div>

      {/* Category Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {assessmentCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Card 
              key={category.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedCategory === category.id ? "ring-2 ring-blue-500 shadow-lg" : ""
              }`}
              onClick={() => setSelectedCategory(selectedCategory === category.id ? "all" : category.id)}
            >
              <CardContent className="p-4 text-center">
                <Icon className={`h-8 w-8 mx-auto mb-2 ${category.colour}`} />
                <h3 className="font-medium text-sm">{category.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {assessments.filter((a: Assessment) => a.category === category.id).length} tests
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="flex gap-2">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("all")}
          >
            All Categories
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={selectedDifficulty === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedDifficulty("all")}
          >
            All Levels
          </Button>
          <Button
            variant={selectedDifficulty === "beginner" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedDifficulty("beginner")}
          >
            Beginner
          </Button>
          <Button
            variant={selectedDifficulty === "intermediate" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedDifficulty("intermediate")}
          >
            Intermediate
          </Button>
          <Button
            variant={selectedDifficulty === "advanced" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedDifficulty("advanced")}
          >
            Advanced
          </Button>
        </div>
      </div>

      {/* Assessment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssessments.map((assessment: Assessment) => {
          const Icon = assessment.icon;
          const category = assessmentCategories.find(c => c.id === assessment.category);
          
          return (
            <Card key={assessment.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className={`h-6 w-6 ${assessment.colour}`} />
                    <div>
                      <CardTitle className="text-lg">{assessment.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{category?.name}</p>
                    </div>
                  </div>
                  <Badge className={getDifficultyColor(assessment.difficulty)}>
                    {assessment.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{assessment.description}</p>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    {assessment.questions} questions
                  </span>
                  <span>{assessment.duration} min</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {assessment.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>

                {assessment.completionRate && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Completion Rate</span>
                      <span>{assessment.completionRate}%</span>
                    </div>
                    <Progress value={assessment.completionRate} className="h-2" />
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        Avg Score: {assessment.averageScore}%
                      </span>
                    </div>
                  </div>
                )}

                <Button 
                  className="w-full"
                  onClick={() => handleStartAssessment(assessment.id)}
                  disabled={startAssessmentMutation.isPending}
                >
                  {startAssessmentMutation.isPending ? "Starting..." : "Start Assessment"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredAssessments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No assessments found for the selected filters.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => {
              setSelectedCategory("all");
              setSelectedDifficulty("all");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Assessment Benefits */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Why Take Skills Assessments?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-medium mb-2">Validate Your Skills</h4>
              <p className="text-sm text-muted-foreground">
                Prove your competencies with verified assessment scores that employers trust.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-medium mb-2">Boost Profile Strength</h4>
              <p className="text-sm text-muted-foreground">
                Each completed assessment increases your profile strength and job match scores.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-medium mb-2">Identify Growth Areas</h4>
              <p className="text-sm text-muted-foreground">
                Get personalised feedback and recommendations for skill development.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}