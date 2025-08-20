import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, Users, MessageCircle, Lightbulb } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface AssessmentQuestion {
  id: string;
  question: string;
  options: Array<{
    text: string;
    disc: {
      red: number;
      yellow: number;
      green: number;
      blue: number;
    };
  }>;
}

interface DiscProfile {
  red: number;
  yellow: number;
  green: number;
  blue: number;
  dominantTraits: string[];
  influentialTraits: string[];
  steadyTraits: string[];
  conscientiousTraits: string[];
  workStyle: string;
  communicationStyle: string;
  decisionMaking: string;
  stressResponse: string;
  pointsAwarded?: number;
}

interface PersonalityInsights {
  strengths: string[];
  challenges: string[];
  idealWorkEnvironment: string[];
  motivators: string[];
  compatibleRoles: string[];
}

interface BehavioralAssessmentProps {
  onComplete?: (profile: DiscProfile, insights: PersonalityInsights) => void;
  type?: 'basic' | 'enhanced';
  showResults?: boolean;
  userId?: number;
  isRetake?: boolean;
}

export default function BehavioralAssessment({ 
  onComplete, 
  type = 'enhanced',
  showResults = true,
  userId,
  isRetake = false
}: BehavioralAssessmentProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<{ [key: string]: string }>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [results, setResults] = useState<{
    profile: DiscProfile;
    insights: PersonalityInsights;
    summary: any;
  } | null>(null);

  const { data: questionsData } = useQuery({
    queryKey: ['/api/assessment/questions'],
  });

  const calculateProfile = useMutation({
    mutationFn: async (data: { responses: any; type: string }) => {
      return await apiRequest('/api/assessment/calculate', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    onSuccess: (data) => {
      setResults(data);
      setIsCompleted(true);
      if (onComplete) {
        onComplete(data.profile, data.insights);
      }
    }
  });

  const questions: AssessmentQuestion[] = questionsData?.[type] || [];
  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  const handleAnswer = (answer: string) => {
    const newResponses = {
      ...responses,
      [questions[currentQuestion].id]: answer
    };
    setResponses(newResponses);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Assessment complete, calculate results
      calculateProfile.mutate({ responses: newResponses, type, userId });
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setResponses({});
    setIsCompleted(false);
    setResults(null);
  };

  if (!questionsData) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <Brain className="w-12 h-12 mx-auto mb-4 text-blue-500" />
          <p>Loading assessment questions...</p>
        </CardContent>
      </Card>
    );
  }

  if (isCompleted && results && showResults) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Brain className="w-6 h-6 text-blue-500" />
              Your Behavioral Profile
              {results.profile.pointsAwarded && (
                <Badge variant="default" className="ml-2 bg-green-500">
                  +{results.profile.pointsAwarded} Points!
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {isRetake ? "Updated profile based on your latest responses" : "Discover your work style and personality insights"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* DISC Scores */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {results.profile.red}%
                </div>
                <p className="text-sm font-medium">Dominant</p>
                <p className="text-xs text-gray-600">Direct & Decisive</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {results.profile.yellow}%
                </div>
                <p className="text-sm font-medium">Influential</p>
                <p className="text-xs text-gray-600">People-Focused</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {results.profile.green}%
                </div>
                <p className="text-sm font-medium">Steady</p>
                <p className="text-xs text-gray-600">Supportive & Stable</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {results.profile.blue}%
                </div>
                <p className="text-sm font-medium">Conscientious</p>
                <p className="text-xs text-gray-600">Detail-Oriented</p>
              </div>
            </div>

            {/* Multi-Dimensional Profile */}
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">
                Your Multi-Dimensional Profile
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {results.profile.red >= 20 && (
                  <div className="text-center">
                    <div className="text-red-600 font-semibold">Dominant</div>
                    <div className="text-xs text-gray-600">
                      {results.profile.dominantTraits?.slice(0, 2).join(', ')}
                    </div>
                  </div>
                )}
                {results.profile.yellow >= 20 && (
                  <div className="text-center">
                    <div className="text-yellow-600 font-semibold">Influential</div>
                    <div className="text-xs text-gray-600">
                      {results.profile.influentialTraits?.slice(0, 2).join(', ')}
                    </div>
                  </div>
                )}
                {results.profile.green >= 20 && (
                  <div className="text-center">
                    <div className="text-green-600 font-semibold">Steady</div>
                    <div className="text-xs text-gray-600">
                      {results.profile.steadyTraits?.slice(0, 2).join(', ')}
                    </div>
                  </div>
                )}
                {results.profile.blue >= 20 && (
                  <div className="text-center">
                    <div className="text-blue-600 font-semibold">Conscientious</div>
                    <div className="text-xs text-gray-600">
                      {results.profile.conscientiousTraits?.slice(0, 2).join(', ')}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="secondary">
                  <Target className="w-3 h-3 mr-1" />
                  {results.profile.workStyle}
                </Badge>
                <Badge variant="secondary">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  {results.profile.communicationStyle}
                </Badge>
              </div>
            </div>

            {/* Insights */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-yellow-500" />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {results.insights.strengths.map((strength, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    Ideal Work Environment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {results.insights.idealWorkEnvironment.map((env, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        {env}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Compatible Roles */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Compatible Career Areas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {results.insights.compatibleRoles.map((role, index) => (
                    <Badge key={index} variant="outline">
                      {role}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </CardContent>
          <CardFooter className="justify-center space-x-4">
            <Button onClick={resetAssessment} variant="outline">
              {isRetake ? "Take Again" : "Retake Assessment"}
            </Button>
            {results.profile.pointsAwarded && (
              <div className="text-sm text-gray-600">
                {isRetake ? "Earned 25 points for retaking!" : "Earned 100 points for completing!"}
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>No assessment questions available.</p>
        </CardContent>
      </Card>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-500" />
            Behavioral Assessment
          </CardTitle>
          <Badge variant="secondary">
            {currentQuestion + 1} of {questions.length}
          </Badge>
        </div>
        <Progress value={progress} className="w-full" />
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">{currentQ.question}</h3>
          <RadioGroup
            value={responses[currentQ.id] || ""}
            onValueChange={handleAnswer}
            className="space-y-3"
          >
            {currentQ.options.map((option, index) => (
              <div key={index} className="flex items-start space-x-2 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value={option.text} id={`option-${index}`} className="mt-1" />
                <Label 
                  htmlFor={`option-${index}`} 
                  className="flex-1 cursor-pointer text-sm leading-relaxed"
                >
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        <div className="text-sm text-gray-500">
          {responses[currentQ.id] ? "Click an option to continue" : "Select an answer to proceed"}
        </div>
      </CardFooter>
    </Card>
  );
}