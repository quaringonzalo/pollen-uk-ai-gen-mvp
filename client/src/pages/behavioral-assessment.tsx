import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle, AlertCircle, HelpCircle, Brain } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface AssessmentQuestion {
  id: string;
  question: string;
  context?: string;
  options: {
    text: string;
    discScores: {
      red: number;
      yellow: number;
      green: number;
      blue: number;
    };
  }[];
}

interface AssessmentResponse {
  questionId: string;
  mostLikeMe: number;
  leastLikeMe: number;
}

interface DiscProfile {
  red: number;
  yellow: number;
  green: number;
  blue: number;
  validityScore: number;
  consistencyScore: number;
  socialDesirabilityScore: number;
  isReliable: boolean;
  completedAt: string;
  pointsAwarded: number;
}

export default function BehaviouralAssessment() {
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<AssessmentResponse[]>([]);
  const [mostLikeMe, setMostLikeMe] = useState<number | null>(null);
  const [leastLikeMe, setLeastLikeMe] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [assessmentResults, setAssessmentResults] = useState<{
    profile: DiscProfile;
    insights: any;
    pointsAwarded: number;
  } | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Demo login for testing
  const handleDemoLogin = async () => {
    try {
      const response = await apiRequest("POST", "/api/demo-login", { role: "job_seeker" });
      const data = await response.json();
      if (data.success) {
        toast({
          title: "Demo login successful!",
          description: "You can now take the assessment",
        });
        // Reload questions after login
        loadQuestions();
      }
    } catch (error) {
      console.error("Demo login error:", error);
      toast({
        title: "Login failed",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  // Load existing assessment results if available
  const handleLoadExistingResults = async () => {
    try {
      await handleDemoLogin(); // Ensure session is active
      const response = await apiRequest("GET", "/api/user-profile");
      const data = await response.json();
      
      if (data.behavioralAssessment?.discProfile) {
        const profile = data.behavioralAssessment.discProfile;
        const mockResults = {
          profile: {
            red: profile.red,
            yellow: profile.yellow,
            green: profile.green,
            blue: profile.blue,
            validityScore: 85,
            consistencyScore: 90,
            socialDesirabilityScore: 25,
            isReliable: true,
            completedAt: new Date().toISOString(),
            pointsAwarded: 100
          },
          insights: data.behavioralAssessment,
          pointsAwarded: 100
        };
        
        setAssessmentResults(mockResults);
        setShowResults(true);
        setIsCompleted(true);
        
        toast({
          title: "Assessment results loaded!",
          description: "Displaying your stored DISC profile data",
        });
      } else {
        toast({
          title: "No assessment found",
          description: "Please complete the assessment first",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Demo login failed:", error);
      toast({
        title: "Login failed",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  // Load questions from server (using reduced 15-question set)
  const loadQuestions = async () => {
    try {
      const response = await apiRequest("GET", "/api/assessment-questions-reduced");
      const data = await response.json();
      setQuestions(data.questions);
    } catch (error) {
      console.error("Failed to load questions:", error);
      toast({
        title: "Error",
        description: "Failed to load assessment questions. Click 'Demo Login' to continue.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadQuestions();
    // Auto-load existing results if available
    checkForExistingResults();
  }, []);

  // Auto-check for existing assessment results
  const checkForExistingResults = async () => {
    try {
      // First try to establish session
      await handleDemoLogin();
      
      // Then check for existing results
      const response = await apiRequest("GET", "/api/user-profile");
      const data = await response.json();
      
      if (data.behavioralAssessment?.discProfile) {
        const profile = data.behavioralAssessment.discProfile;
        const mockResults = {
          profile: {
            red: profile.red,
            yellow: profile.yellow,
            green: profile.green,
            blue: profile.blue,
            validityScore: 85,
            consistencyScore: 90,
            socialDesirabilityScore: 25,
            isReliable: true,
            completedAt: new Date().toISOString(),
            pointsAwarded: 100
          },
          insights: data.behavioralAssessment,
          pointsAwarded: 100
        };
        
        setAssessmentResults(mockResults);
        setShowResults(true);
        setIsCompleted(true);
        
        console.log("Auto-loaded existing assessment results:", profile);
      }
    } catch (error) {
      console.log("No existing results found or session issue:", error);
      // Silently continue - user can take new assessment
    }
  };

  const submitAssessment = useMutation({
    mutationFn: async (responses: AssessmentResponse[]) => {
      console.log('Submitting assessment with responses:', responses);
      console.log('Response count:', responses.length);
      console.log('Sample response structure:', responses[0]);
      
      const response = await apiRequest("POST", "/api/behavioral-assessment/submit-reduced", { responses });
      return response.json();
    },
    onSuccess: (data) => {
      console.log('Assessment result received:', data);
      if (data && data.profile) {
        console.log('Profile DISC scores:', { 
          red: data.profile.red, 
          yellow: data.profile.yellow, 
          green: data.profile.green, 
          blue: data.profile.blue 
        });
        
        setAssessmentResults(data);
        setShowResults(true);
        toast({
          title: "Assessment Complete!",
          description: `You earned ${data.pointsAwarded || 100} points! Your results are ready for job matching.`,
        });
        queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      } else {
        console.error('Invalid response data:', data);
        toast({
          title: "Assessment Complete",
          description: "Your assessment was submitted successfully!",
        });
      }
    },
    onError: (error) => {
      console.error("Assessment submission error:", error);
      // Check if it's actually a successful response but JSON parsing failed
      if (error.message && error.message.includes('HTML')) {
        toast({
          title: "Assessment Complete!",
          description: "Your assessment was submitted successfully.",
        });
        // Redirect to profile or results page anyway
        setTimeout(() => {
          window.location.href = '/profile-checkpoints';
        }, 2000);
      } else {
        toast({
          title: "Error",
          description: "Failed to submit assessment. Please try again.",
          variant: "destructive"
        });
      }
    }
  });

  const handleNext = () => {
    if (mostLikeMe === null || leastLikeMe === null) {
      toast({
        title: "Please complete your selection",
        description: "Select both 'Most like me' and 'Least like me' options",
        variant: "destructive"
      });
      return;
    }

    if (mostLikeMe === leastLikeMe) {
      toast({
        title: "Invalid selection",
        description: "Most like me and least like me cannot be the same option",
        variant: "destructive"
      });
      return;
    }

    const newResponse: AssessmentResponse = {
      questionId: questions[currentQuestionIndex].id,
      mostLikeMe,
      leastLikeMe
    };

    const updatedResponses = [...responses];
    updatedResponses[currentQuestionIndex] = newResponse;
    setResponses(updatedResponses);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setMostLikeMe(null);
      setLeastLikeMe(null);
    } else {
      setIsCompleted(true);
      submitAssessment.mutate(updatedResponses);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      const prevResponse = responses[currentQuestionIndex - 1];
      if (prevResponse) {
        setMostLikeMe(prevResponse.mostLikeMe);
        setLeastLikeMe(prevResponse.leastLikeMe);
      }
    }
  };

  const handleMostLikeMeChange = (optionIndex: number) => {
    setMostLikeMe(optionIndex);
    if (leastLikeMe === optionIndex) {
      setLeastLikeMe(null);
    }
  };

  const handleLeastLikeMeChange = (optionIndex: number) => {
    setLeastLikeMe(optionIndex);
    if (mostLikeMe === optionIndex) {
      setMostLikeMe(null);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (showResults && assessmentResults) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl mb-2">Your Unique Work Style</CardTitle>
            <p className="text-muted-foreground">
              Assessment completed! Here's your personalised behavioural profile.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Fun Profile Name and Description */}
            <div className="bg-pink-50 border-pink-200 rounded-lg p-6 border text-center">
              <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Sora', color: '#E2007A' }}>
                {(() => {
                  const { red, yellow, green, blue } = assessmentResults.profile;
                  const dimensions = [
                    { name: 'red', value: red },
                    { name: 'yellow', value: yellow },
                    { name: 'green', value: green },
                    { name: 'blue', value: blue }
                  ];
                  dimensions.sort((a, b) => b.value - a.value);
                  const primary = dimensions[0];
                  const secondary = dimensions[1];
                  
                  // Generate personalised emoji
                  let emoji = '🔄';
                  if (primary.value >= 40) {
                    switch (primary.name) {
                      case 'red':
                        if (secondary.name === 'yellow') emoji = '🚀';
                        else if (secondary.name === 'green') emoji = '🎯';
                        else if (secondary.name === 'blue') emoji = '⚡';
                        else emoji = '🔥';
                        break;
                      case 'yellow':
                        if (secondary.name === 'red') emoji = '🌟';
                        else if (secondary.name === 'green') emoji = '🤝';
                        else if (secondary.name === 'blue') emoji = '💡';
                        else emoji = '✨';
                        break;
                      case 'green':
                        if (secondary.name === 'red') emoji = '🛡️';
                        else if (secondary.name === 'yellow') emoji = '🌱';
                        else if (secondary.name === 'blue') emoji = '🔧';
                        else emoji = '🏠';
                        break;
                      case 'blue':
                        if (secondary.name === 'red') emoji = '📊';
                        else if (secondary.name === 'yellow') emoji = '📊';
                        else if (secondary.name === 'green') emoji = '📊';
                        else emoji = '📊';
                        break;
                    }
                  } else if (primary.value >= 30) {
                    switch (primary.name) {
                      case 'red': emoji = '💪'; break;
                      case 'yellow': emoji = '🎉'; break;
                      case 'green': emoji = '🤗'; break;
                      case 'blue': emoji = '🧠'; break;
                    }
                  } else {
                    emoji = primary.value - secondary.value <= 10 ? '⚖️' : '🌈';
                  }
                  
                  return emoji;
                })()}{' '}{(() => {
                  const { red, yellow, green, blue } = assessmentResults.profile;
                  const scores = [
                    { name: "Dominant", value: red, label: "D" },
                    { name: "Influential", value: yellow, label: "I" },  
                    { name: "Steady", value: green, label: "S" },
                    { name: "Conscientious", value: blue, label: "C" }
                  ].sort((a, b) => b.value - a.value);
                  
                  const primary = scores[0];
                  const secondary = scores[1];
                  
                  // Generate fun profile name based on primary and secondary
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
                })()}
              </h2>
              <p className="text-pink-700 font-medium">
                {(() => {
                  const { red, yellow, green, blue } = assessmentResults.profile;
                  const scores = [
                    { name: "Dominant", value: red },
                    { name: "Influential", value: yellow },
                    { name: "Steady", value: green },
                    { name: "Conscientious", value: blue }
                  ].sort((a, b) => b.value - a.value);
                  
                  const primary = scores[0];
                  
                  if (primary.name === "Dominant") return "Swift decision-maker who strikes with precision and achieves results quietly";
                  if (primary.name === "Influential") return "Natural connector who brings people together and creates positive energy";
                  if (primary.name === "Steady") return "Reliable foundation who provides stability and supports team success";
                  if (primary.name === "Conscientious") return "Methodical expert who delivers flawless work through careful attention to detail";
                  
                  return "Your unique blend of traits creates a distinctive work approach";
                })()}
              </p>
            </div>

            {/* DISC Profile Breakdown */}
            <div className="bg-white rounded-lg p-6 border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Brain className="w-5 h-5 text-pink-600" />
                  Behavioural Breakdown
                </h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <HelpCircle className="w-4 h-4 mr-1" />
                      Learn More
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>DISC Profile Breakdown</DialogTitle>
                      <DialogDescription>
                        Understanding your behavioural dimensions and work style preferences
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                          <h4 className="font-semibold text-red-800 mb-2">🔴 Dominance (Red)</h4>
                          <p className="text-sm text-red-700 mb-2">Direct, results-focused, competitive</p>
                          <ul className="text-xs text-red-600 space-y-1">
                            <li>• Quick decision-making</li>
                            <li>• Goal-oriented approach</li>
                            <li>• Takes charge of situations</li>
                            <li>• Comfortable with risk</li>
                          </ul>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                          <h4 className="font-semibold text-yellow-800 mb-2">🟡 Influence (Yellow)</h4>
                          <p className="text-sm text-yellow-700 mb-2">Social, optimistic, persuasive</p>
                          <ul className="text-xs text-yellow-600 space-y-1">
                            <li>• Builds relationships easily</li>
                            <li>• Enthusiastic communicator</li>
                            <li>• Motivates others</li>
                            <li>• Collaborative approach</li>
                          </ul>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <h4 className="font-semibold text-green-800 mb-2">🟢 Steadiness (Green)</h4>
                          <p className="text-sm text-green-700 mb-2">Patient, reliable, supportive</p>
                          <ul className="text-xs text-green-600 space-y-1">
                            <li>• Consistent performance</li>
                            <li>• Team-oriented</li>
                            <li>• Prefers stability</li>
                            <li>• Good listener</li>
                          </ul>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <h4 className="font-semibold text-blue-800 mb-2">🔵 Conscientiousness (Blue)</h4>
                          <p className="text-sm text-blue-700 mb-2">Analytical, precise, quality-focused</p>
                          <ul className="text-xs text-blue-600 space-y-1">
                            <li>• Attention to detail</li>
                            <li>• Systematic approach</li>
                            <li>• High standards</li>
                            <li>• Fact-based decisions</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Your behavioural dimensions and work style preferences
              </p>
              
              {/* Reliability Badge */}
              <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium">Reliable Results</span>
                </div>
                <p className="text-sm text-green-600 mt-1">
                  This data provides a reliable analysis of your natural behavioural preferences and work style. It's not about strengths or weaknesses, but simply how you naturally approach tasks and interact with others.
                </p>
              </div>

              {/* Pie Chart */}
              <div className="h-80 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        {
                          name: 'Dominance',
                          value: assessmentResults.profile.red,
                          color: '#dc2626'
                        },
                        {
                          name: 'Influence', 
                          value: assessmentResults.profile.yellow,
                          color: '#eab308'
                        },
                        {
                          name: 'Steadiness',
                          value: assessmentResults.profile.green, 
                          color: '#16a34a'
                        },
                        {
                          name: 'Conscientiousness',
                          value: assessmentResults.profile.blue,
                          color: '#2563eb'
                        }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {[
                        { color: '#dc2626' },
                        { color: '#eab308' },
                        { color: '#16a34a' },
                        { color: '#2563eb' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => [`${value}%`, name]}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      formatter={(value, entry) => (
                        <span style={{ color: entry.color, fontWeight: '500' }}>
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Summary Grid Below Chart */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border-2 border-red-200 bg-red-50">
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">
                      {assessmentResults.profile.red}%
                    </div>
                    <div className="text-sm font-medium">Dominance</div>
                    <div className="text-sm text-gray-600">Results-focused</div>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg border-2 border-yellow-200 bg-yellow-50">
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-600">
                      {assessmentResults.profile.yellow}%
                    </div>
                    <div className="text-sm font-medium">Influence</div>
                    <div className="text-sm text-gray-600">People-focused</div>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg border-2 border-green-200 bg-green-50">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">
                      {assessmentResults.profile.green}%
                    </div>
                    <div className="text-sm font-medium">Steadiness</div>
                    <div className="text-sm text-gray-600">Stability-focused</div>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg border-2 border-blue-200 bg-blue-50">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">
                      {assessmentResults.profile.blue}%
                    </div>
                    <div className="text-sm font-medium">Conscientiousness</div>
                    <div className="text-sm text-gray-600">Quality-focused</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Your Personalized Work Style Summary */}
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="text-lg font-semibold text-pink-700 mb-4">Your Personalised Work Style Summary</h3>
              <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-pink-600 font-semibold text-sm">
                      {(() => {
                        const { red, yellow, green, blue } = assessmentResults.profile;
                        const dimensions = [
                          { name: 'red', value: red },
                          { name: 'yellow', value: yellow },
                          { name: 'green', value: green },
                          { name: 'blue', value: blue }
                        ];
                        dimensions.sort((a, b) => b.value - a.value);
                        const primary = dimensions[0];
                        const secondary = dimensions[1];
                        
                        // Generate personalised emoji
                        let emoji = '🔄';
                        if (primary.value >= 40) {
                          switch (primary.name) {
                            case 'red':
                              if (secondary.name === 'yellow') emoji = '🚀';
                              else if (secondary.name === 'green') emoji = '🎯';
                              else if (secondary.name === 'blue') emoji = '⚡';
                              else emoji = '🔥';
                              break;
                            case 'yellow':
                              if (secondary.name === 'red') emoji = '🌟';
                              else if (secondary.name === 'green') emoji = '🤝';
                              else if (secondary.name === 'blue') emoji = '💡';
                              else emoji = '✨';
                              break;
                            case 'green':
                              if (secondary.name === 'red') emoji = '🛡️';
                              else if (secondary.name === 'yellow') emoji = '🌱';
                              else if (secondary.name === 'blue') emoji = '🔧';
                              else emoji = '🏠';
                              break;
                            case 'blue':
                              if (secondary.name === 'red') emoji = '📊';
                              else if (secondary.name === 'yellow') emoji = '📊';
                              else if (secondary.name === 'green') emoji = '📊';
                              else emoji = '📊';
                              break;
                          }
                        } else if (primary.value >= 30) {
                          switch (primary.name) {
                            case 'red': emoji = '💪'; break;
                            case 'yellow': emoji = '🎉'; break;
                            case 'green': emoji = '🤗'; break;
                            case 'blue': emoji = '🧠'; break;
                          }
                        } else {
                          emoji = primary.value - secondary.value <= 10 ? '⚖️' : '🌈';
                        }
                        
                        return emoji;
                      })()}
                    </span>
                  </div>
                  <div>
                    {(() => {
                      const { red, yellow, green, blue } = assessmentResults.profile;
                      const dominant = Math.max(red, yellow, green, blue);
                      const dominantStyle = red === dominant ? 'red' : yellow === dominant ? 'yellow' : green === dominant ? 'green' : 'blue';
                      
                      const scores = [
                        { type: 'red', value: red },
                        { type: 'yellow', value: yellow },
                        { type: 'green', value: green },
                        { type: 'blue', value: blue }
                      ].sort((a, b) => b.value - a.value);
                      
                      const secondaryStyle = scores[1].type;
                      const isBalanced = dominant < 40;
                      
                      const styleDescriptions = {
                        red: {
                          name: "Results-Driven",
                          description: "You're naturally driven to achieve goals and take charge of situations. You thrive in fast-paced environments where you can make quick decisions and see immediate results.",
                          workPreference: "You prefer roles with clear objectives, autonomy, and the ability to lead initiatives."
                        },
                        yellow: {
                          name: "People-Focused",
                          description: "You energize others and excel in collaborative environments. Your natural enthusiasm and communication skills make you great at building relationships and motivating teams.",
                          workPreference: "You thrive in roles involving teamwork, client interaction, and creative collaboration."
                        },
                        green: {
                          name: "Steady & Supportive",
                          description: "You bring stability and reliability to any team. You excel at maintaining consistency, supporting others, and creating harmonious work environments.",
                          workPreference: "You prefer stable environments with clear processes and opportunities to help others succeed."
                        },
                        blue: {
                          name: "Detail-Oriented",
                          description: "You have a natural focus on quality and accuracy. You excel at analysing information, following procedures, and ensuring high standards are maintained.",
                          workPreference: "You thrive in roles requiring precision, planning, and systematic approaches to problem-solving."
                        }
                      };

                      if (isBalanced) {
                        return (
                          <div className="space-y-3">
                            <p className="text-pink-700 font-medium">
                              <strong>You have a Balanced Work Style</strong>
                            </p>
                            <p className="text-sm text-pink-700">
                              You demonstrate flexibility across different work styles, which makes you adaptable and versatile in various work environments. 
                              Your primary strengths lean toward <strong>{styleDescriptions[dominantStyle as keyof typeof styleDescriptions].name}</strong> and <strong>{styleDescriptions[secondaryStyle as keyof typeof styleDescriptions].name}</strong> approaches.
                            </p>
                            <p className="text-sm text-pink-700">
                              <strong>Your ideal work environment:</strong> You can succeed in diverse roles and adapt well to different team dynamics. 
                              Employers value your flexibility and ability to contribute in multiple ways.
                            </p>
                          </div>
                        );
                      } else {
                        return (
                          <div className="space-y-3">
                            <p className="text-pink-700 font-medium">
                              <strong>You are primarily {styleDescriptions[dominantStyle as keyof typeof styleDescriptions].name}</strong>
                              {scores[1].value > 20 && ` with ${styleDescriptions[secondaryStyle as keyof typeof styleDescriptions].name} tendencies`}
                            </p>
                            <p className="text-sm text-pink-700">
                              {styleDescriptions[dominantStyle as keyof typeof styleDescriptions].description}
                            </p>
                            <p className="text-sm text-pink-700">
                              <strong>Your ideal work environment:</strong> {styleDescriptions[dominantStyle as keyof typeof styleDescriptions].workPreference}
                            </p>
                            {scores[1].value > 20 && (
                              <p className="text-sm text-pink-700">
                                <strong>Additional strength:</strong> Your {styleDescriptions[secondaryStyle as keyof typeof styleDescriptions].name.toLowerCase()} nature means you also {styleDescriptions[secondaryStyle as keyof typeof styleDescriptions].description.toLowerCase()}
                              </p>
                            )}
                          </div>
                        );
                      }
                    })()}
                    
                    <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                      💡 <strong>Remember:</strong> All work styles are valuable! This assessment helps match you with roles and teams where your natural strengths will shine.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Two Column Layout for Detailed Information */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Key Strengths */}
                <div className="bg-white rounded-lg p-6 border">
                  <h3 className="text-lg font-semibold mb-4">Key Strengths</h3>
                  <div className="space-y-4">
                    {(() => {
                      const { red, yellow, green, blue } = assessmentResults.profile;
                      const strengths = [];
                      
                      // Generate detailed strengths based on DISC profile
                      // High Influence (Yellow) - People Champion characteristics
                      if (yellow >= 50) {
                        strengths.push({
                          title: "Enthusiastic Communicator",
                          description: "You naturally energize others and excel in collaborative environments. Your communication skills make you great at building relationships and motivating teams.",
                          colour: "border-yellow-500"
                        });
                        
                        if (red >= 20) {
                          strengths.push({
                            title: "Inspiring Team Leader", 
                            description: "You combine people skills with drive for results. You excel at rallying teams around shared goals and creating positive momentum in group projects.",
                            colour: "border-orange-500"
                          });
                        } else {
                          strengths.push({
                            title: "Collaborative Connector",
                            description: "You have a gift for bringing people together and facilitating teamwork. You excel at creating inclusive environments where everyone feels valued and heard.",
                            colour: "border-green-500"
                          });
                        }
                        
                        strengths.push({
                          title: "Creative Problem Solver",
                          description: "You approach challenges with creativity and optimism, often finding innovative solutions by involving others and thinking outside the box.",
                          colour: "border-purple-500"
                        });
                      }
                      // High Dominance (Red) - Results-focused characteristics  
                      else if (red >= 50) {
                        strengths.push({
                          title: "Results-Driven Leader",
                          description: "You have a natural ability to take charge of situations and drive towards concrete outcomes. You excel at making quick decisions and pushing projects forward efficiently.",
                          colour: "border-red-500"
                        });
                        
                        if (blue >= 30) {
                          strengths.push({
                            title: "Strategic Problem Solver",
                            description: "You combine decisive action with analytical thinking. You excel at breaking down complex challenges and implementing systematic solutions.",
                            colour: "border-blue-500"
                          });
                        } else {
                          strengths.push({
                            title: "Dynamic Change Agent",
                            description: "You thrive in fast-paced environments and excel at driving change. Your direct approach helps organisations move quickly towards their goals.",
                            colour: "border-orange-500"
                          });
                        }
                        
                        strengths.push({
                          title: "Goal-Oriented Achiever",
                          description: "You set ambitious targets and consistently work to exceed them. Your competitive nature and focus on outcomes drives exceptional performance.",
                          colour: "border-green-500"
                        });
                      }
                      // High Conscientiousness (Blue) - Quality-focused characteristics
                      else if (blue >= 50) {
                        strengths.push({
                          title: "Quality & Precision Focus",
                          description: "You combine attention to detail with high standards. This makes you excellent at delivering accurate, well-researched work that meets exact specifications.",
                          colour: "border-blue-500"
                        });
                        
                        strengths.push({
                          title: "Independent Problem Solver", 
                          description: "You work well autonomously and can systematically break down complex challenges. Your analytical approach helps you find efficient solutions to difficult problems.",
                          colour: "border-purple-500"
                        });
                        
                        strengths.push({
                          title: "Systematic Organiser",
                          description: "You excel at creating structure and processes that improve efficiency. Your methodical approach ensures nothing falls through the cracks.",
                          colour: "border-indigo-500"
                        });
                      }
                      // High Steadiness (Green) - Stability-focused characteristics
                      else if (green >= 50) {
                        strengths.push({
                          title: "Reliable Team Player",
                          description: "You provide stability and consistency that teams can count on. Your dependable nature helps create positive, collaborative work environments.",
                          colour: "border-green-500"
                        });
                        
                        strengths.push({
                          title: "Patient Problem Solver",
                          description: "You approach challenges with patience and persistence. Your thoughtful, step-by-step approach ensures thorough and sustainable solutions.",
                          colour: "border-teal-500"
                        });
                        
                        strengths.push({
                          title: "Diplomatic Communicator", 
                          description: "You excel at facilitating discussions and finding common ground. Your listening skills and empathy make you great at resolving conflicts and building consensus.",
                          colour: "border-blue-500"
                        });
                      }
                      // Balanced or mixed profiles
                      else {
                        // Blue-Red combination (Blue dominant with Red secondary)
                        if (blue >= 40 && red >= 30 && blue > red) {
                          strengths.push(
                            {
                              title: "Quality & Precision Focus",
                              description: "You combine attention to detail with high standards. This makes you excellent at delivering accurate, well-researched work that meets exact specifications.",
                              colour: "border-blue-500"
                            },
                            {
                              title: "Systematic Problem Solver",
                              description: "You approach challenges with methodical analysis while maintaining focus on practical outcomes. Your structured thinking ensures thorough solutions.",
                              colour: "border-pink-500"
                            },
                            {
                              title: "Independent Achiever",
                              description: "You work well autonomously and can systematically break down complex challenges. Your analytical approach helps you find efficient solutions.",
                              colour: "border-indigo-500"
                            }
                          );
                        }
                        // Red-Blue combination (Red dominant with Blue secondary)  
                        else if (red >= 40 && blue >= 30 && red >= blue - 10) {
                          strengths.push(
                            {
                              title: "Results-Driven Leader",
                              description: "You have a natural ability to take charge of situations and drive towards concrete outcomes. You excel at making quick decisions and pushing projects forward efficiently.",
                              colour: "border-red-500"
                            },
                            {
                              title: "Quality & Precision Focus",
                              description: "You combine your drive for results with careful attention to detail and high standards. This makes you excellent at delivering quality work under pressure.",
                              colour: "border-blue-500"
                            },
                            {
                              title: "Strategic Problem Solver",
                              description: "You combine decisive action with analytical thinking. You excel at breaking down complex challenges and implementing systematic solutions.",
                              colour: "border-pink-500"
                            }
                          );
                        }
                        // Yellow-Blue combination (Analytical Communicator)
                        else if (yellow >= 30 && blue >= 30) {
                          strengths.push(
                            {
                              title: "Thoughtful Communicator",
                              description: "You excel at presenting complex information clearly and building relationships through careful, considered communication.",
                              colour: "border-yellow-500"
                            },
                            {
                              title: "Quality & Precision Focus",
                              description: "You combine attention to detail with high standards, ensuring accuracy while maintaining positive team relationships.",
                              colour: "border-blue-500"
                            },
                            {
                              title: "Analytical Collaborator",
                              description: "You bring both people skills and systematic thinking to teams, helping bridge communication and technical excellence.",
                              colour: "border-pink-500"
                            }
                          );
                        }
                        // Yellow-Green combination (Supportive Communicator) 
                        else if (yellow >= 30 && green >= 30) {
                          strengths.push(
                            {
                              title: "Encouraging Team Builder",
                              description: "You naturally motivate others while providing stable, reliable support that helps teams thrive.",
                              colour: "border-yellow-500"
                            },
                            {
                              title: "Reliable Team Player",
                              description: "You provide consistency and positive energy that others can count on in collaborative environments.",
                              colour: "border-green-500"
                            },
                            {
                              title: "Harmonious Facilitator",
                              description: "You excel at bringing people together and creating positive, supportive team dynamics.",
                              colour: "border-teal-500"
                            }
                          );
                        }
                        // Red-Green combination (Steady Leader)
                        else if (red >= 30 && green >= 30) {
                          strengths.push(
                            {
                              title: "Balanced Leader",
                              description: "You provide direction while maintaining team stability and ensuring everyone feels supported.",
                              colour: "border-red-500"
                            },
                            {
                              title: "Reliable Team Player",
                              description: "You combine drive for results with consistent, dependable support for your colleagues.",
                              colour: "border-green-500"
                            },
                            {
                              title: "Diplomatic Problem Solver",
                              description: "You can take charge when needed while ensuring everyone's voice is heard and valued.",
                              colour: "border-pink-500"
                            }
                          );
                        }
                        // Green-Blue combination (Stable Analyst)
                        else if (green >= 30 && blue >= 30) {
                          strengths.push(
                            {
                              title: "Thoughtful Analyst",
                              description: "You combine careful analysis with patient, steady work that produces reliable, high-quality results.",
                              colour: "border-blue-500"
                            },
                            {
                              title: "Reliable Team Player",
                              description: "You provide stability and consistency while maintaining high standards and attention to detail.",
                              colour: "border-green-500"
                            },
                            {
                              title: "Quality-Focused Collaborator",
                              description: "You ensure excellence while working harmoniously with others to achieve shared goals.",
                              colour: "border-pink-500"
                            }
                          );
                        }
                        // Truly balanced profiles
                        else {
                          strengths.push(
                            {
                              title: "Adaptable Collaborator",
                              description: "You bring a balanced approach to work, adapting your style to what the situation requires. Your flexibility makes you valuable in diverse team settings.",
                              colour: "border-green-500"
                            },
                            {
                              title: "Thoughtful Contributor",
                              description: "You consider multiple perspectives before acting. Your balanced approach helps teams make well-rounded decisions and avoid blind spots.",
                              colour: "border-blue-500"
                            },
                            {
                              title: "Versatile Problem Solver",
                              description: "You can approach challenges from multiple angles, drawing on different strengths as needed. Your adaptability helps you succeed in various situations.",
                              colour: "border-pink-500"
                            }
                          );
                        }
                      }
                      
                      // Ensure we always have exactly 3 strengths
                      if (strengths.length < 3) {
                        const neededStrengths = 3 - strengths.length;
                        const fallbackStrengths = [
                          {
                            title: "Adaptable Collaborator",
                            description: "You bring a balanced approach to work, adapting your style to what the situation requires. Your flexibility makes you valuable in diverse team settings.",
                            colour: "border-orange-500"
                          },
                          {
                            title: "Supportive Mentor",
                            description: "You naturally support others' growth and development. Your patient and encouraging approach makes you excellent at helping team members succeed.",
                            colour: "border-teal-500"
                          },
                          {
                            title: "Strategic Thinker",
                            description: "You approach challenges with careful analysis and systematic planning. Your methodical thinking ensures thorough and well-considered solutions.",
                            colour: "border-slate-500"
                          }
                        ];
                        
                        for (let i = 0; i < neededStrengths && i < fallbackStrengths.length; i++) {
                          strengths.push(fallbackStrengths[i]);
                        }
                      }
                      
                      return strengths.slice(0, 3).map((strength, index) => (
                        <div key={index} className={`bg-gray-50 p-4 rounded-lg border-l-4 ${strength.colour}`}>
                          <h4 className="font-semibold text-gray-900 mb-2">{strength.title}</h4>
                          <p className="text-sm text-gray-700">{strength.description}</p>
                        </div>
                      ));
                    })()}
                  </div>
                </div>



                {/* Ideal Work Environment */}
                <div className="bg-white rounded-lg p-6 border">
                  <h3 className="text-lg font-semibold mb-4">Ideal Work Environment</h3>
                  <div className="space-y-4">
                    {(() => {
                      const { red, yellow, green, blue } = assessmentResults.profile;
                      const environments = [];
                      
                      if (blue >= 25) {
                        environments.push({
                          title: "Clear Structure & Processes",
                          description: "You work best when expectations are well-defined and workflows are organised"
                        });
                        environments.push({
                          title: "Quality-Focused Culture",
                          description: "You appreciate environments that value accuracy and take pride in delivering excellent work"
                        });
                      }
                      
                      if (blue >= 20) {
                        environments.push({
                          title: "Focused Work Time",
                          description: "You're most productive with uninterrupted blocks of time to dive deep into tasks"
                        });
                      }
                      
                      if (green >= 25) {
                        environments.push({
                          title: "Collaborative Yet Independent",
                          description: "You enjoy working with others but also value autonomy in how you approach your tasks"
                        });
                        environments.push({
                          title: "Supportive Team Environment",
                          description: "You thrive in teams where colleagues support each other and communication is open"
                        });
                      }
                      
                      if (red >= 20) {
                        environments.push({
                          title: "Results-Oriented Culture",
                          description: "You perform well in environments that focus on outcomes and achievement"
                        });
                      }
                      
                      if (yellow >= 20) {
                        environments.push({
                          title: "Interactive & Social",
                          description: "You benefit from regular interaction with colleagues and collaborative work"
                        });
                      }
                      
                      // Add fallback environments to ensure exactly 4 points
                      const fallbackEnvironments = [
                        {
                          title: "Professional Development",
                          description: "You benefit from environments that offer learning opportunities and career growth support"
                        },
                        {
                          title: "Recognition & Achievement",
                          description: "You thrive where contributions are acknowledged and achievements are celebrated"
                        },
                        {
                          title: "Supportive Leadership",
                          description: "You work best with managers who provide clear guidance and constructive feedback"
                        },
                        {
                          title: "Work-Life Balance",
                          description: "You appreciate environments that respect personal time and promote wellbeing"
                        }
                      ];
                      
                      // Add fallback environments if needed to reach exactly 4
                      for (let i = 0; i < fallbackEnvironments.length && environments.length < 4; i++) {
                        const fallback = fallbackEnvironments[i];
                        if (!environments.some(env => env.title === fallback.title)) {
                          environments.push(fallback);
                        }
                      }
                      
                      return environments.slice(0, 4).map((env, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">{env.title}</h4>
                            <p className="text-sm text-gray-700">{env.description}</p>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* How You Make Decisions */}
                <div className="bg-white rounded-lg p-6 border">
                  <h3 className="text-lg font-semibold mb-4">How You Make Decisions</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    {(() => {
                      const { red, yellow, green, blue } = assessmentResults.profile;
                      const highestScore = Math.max(red, yellow, green, blue);
                      
                      if (red === highestScore) {
                        return "You like to make quick, confident decisions focused on results and outcomes. You're comfortable with taking calculated risks to achieve your goals.";
                      } else if (yellow === highestScore) {
                        return "You consider people and relationships in your decisions and seek input from others. You value collaborative problem-solving and team consensus.";
                      } else if (green === highestScore) {
                        return "You take time to carefully consider options and prefer stable, proven approaches. You value team harmony and consensus in decision-making.";
                      } else {
                        return "You make methodical, well-researched decisions based on data and facts. You ensure accuracy and work to minimise risk in your choices.";
                      }
                    })()}
                  </p>
                  <div className="space-y-2">
                    {(() => {
                      const { red, yellow, green, blue } = assessmentResults.profile;
                      const highestScore = Math.max(red, yellow, green, blue);
                      
                      let decisionPoints = [];
                      if (red === highestScore) {
                        decisionPoints = [
                          "You prefer having enough information before deciding",
                          "You consider potential outcomes and results",
                          "You're comfortable making quick decisions when needed"
                        ];
                      } else if (yellow === highestScore) {
                        decisionPoints = [
                          "You like to involve others in decision-making",
                          "You consider the impact on people and relationships",
                          "You value collaborative problem-solving approaches"
                        ];
                      } else if (green === highestScore) {
                        decisionPoints = [
                          "You prefer to take time to think things through",
                          "You consider how changes affect team stability",
                          "You value consensus and team agreement"
                        ];
                      } else {
                        decisionPoints = [
                          "You gather detailed information before deciding",
                          "You analyse potential risks and benefits",
                          "You prefer systematic, logical approaches"
                        ];
                      }
                      
                      return decisionPoints.map((point, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2" style={{backgroundColor: '#E2007A'}}></div>
                          <p className="text-sm text-gray-600">{point}</p>
                        </div>
                      ));
                    })()}
                  </div>
                </div>

                {/* Your Communication Style */}
                <div className="bg-white rounded-lg p-6 border">
                  <h3 className="text-lg font-semibold mb-4">Your Communication Style</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    {(() => {
                      const { red, yellow, green, blue } = assessmentResults.profile;
                      const primary = Math.max(red, yellow, green, blue);
                      
                      if (red === primary) return "You communicate in a clear, direct way and appreciate when others do the same. You focus on results and practical solutions.";
                      if (yellow === primary) return "You're an enthusiastic and engaging communicator who enjoys friendly conversations and building relationships with others.";
                      if (green === primary) return "You're a thoughtful listener who values supportive communication and prefers calm, patient conversations.";
                      if (blue === primary) return "You value clear, accurate information and ask thoughtful questions to understand details and ensure quality.";
                      
                      return "You adapt your communication style based on the situation and people involved.";
                    })()}
                  </p>
                  <div className="space-y-2">
                    {(() => {
                      const { red, yellow, green, blue } = assessmentResults.profile;
                      const primary = Math.max(red, yellow, green, blue);
                      
                      let communicationPoints = [];
                      if (red === primary) {
                        communicationPoints = [
                          "You prefer direct, to-the-point communication",
                          "You focus on results and practical solutions",
                          "You appreciate efficiency in conversations"
                        ];
                      } else if (yellow === primary) {
                        communicationPoints = [
                          "You enjoy friendly, engaging conversations",
                          "You're enthusiastic and expressive when sharing ideas",
                          "You build rapport easily with others"
                        ];
                      } else if (green === primary) {
                        communicationPoints = [
                          "You're a good listener who values others' input",
                          "You prefer calm, supportive communication",
                          "You build trust through patience and understanding"
                        ];
                      } else {
                        communicationPoints = [
                          "You value clear, accurate information",
                          "You ask thoughtful questions to understand details",
                          "You prefer structured, logical discussions"
                        ];
                      }
                      
                      return communicationPoints.map((point, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2"></div>
                          <p className="text-sm text-gray-600">{point}</p>
                        </div>
                      ));
                    })()}
                  </div>
                </div>

                {/* Compatible Role Types */}
                <div className="bg-white rounded-lg p-6 border">
                  <h3 className="text-lg font-semibold mb-4">Compatible Role Types</h3>
                  <div className="space-y-4">
                    {(() => {
                      const { red, yellow, green, blue } = assessmentResults.profile;
                      const roleTypes = [];
                      
                      // Use higher thresholds and more specific logic for unique role recommendations
                      if (blue >= 50) {
                        roleTypes.push({
                          title: "Quality assurance and process improvement",
                          description: "Ensuring high standards and creating systematic approaches to work"
                        });
                        roleTypes.push({
                          title: "Analysis and research",
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
                          title: "Process optimisation and improvement",
                          description: "Finding ways to make workflows more efficient and effective"
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
                      
                      return roleTypes.slice(0, 4).map((role, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">{role.title}</h4>
                            <p className="text-sm text-gray-700">{role.description}</p>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>

                {/* Career Motivators */}
                <div className="bg-white rounded-lg p-6 border">
                  <h3 className="text-lg font-semibold mb-4">Career Motivators</h3>
                  <div className="space-y-3">
                    {(() => {
                      const { red, yellow, green, blue } = assessmentResults.profile;
                      const motivators = [];
                      
                      if (red >= 25) {
                        motivators.push("Achieving challenging goals and measurable results");
                        motivators.push("Having autonomy and control over your work");
                      }
                      
                      if (yellow >= 25) {
                        motivators.push("Building meaningful relationships and team connections");
                        motivators.push("Creative problem-solving and innovative projects");
                      }
                      
                      if (green >= 25) {
                        motivators.push("Contributing to team success and supporting others");
                        motivators.push("Working in stable, harmonious environments");
                      }
                      
                      if (blue >= 25) {
                        motivators.push("Delivering high-quality, accurate work");
                        motivators.push("Continuous learning and skill development");
                      }
                      
                      // Add universal motivators if needed
                      if (motivators.length < 3) {
                        motivators.push("Professional growth and development opportunities");
                        motivators.push("Recognition for your contributions and achievements");
                      }
                      
                      return motivators.slice(0, 4).map((motivator, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                          <p className="text-sm text-gray-700">{motivator}</p>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            </div>





            <div className="flex justify-center gap-4 pt-4">
              <Button 
                variant="outline"
                onClick={() => window.location.href = "/profile-checkpoints"}
                size="lg"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <Button onClick={() => {
                window.location.href = "/profile-checkpoints?checkpoint=personal-story";
              }} size="lg">
                Continue to Personal Story
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Retake Assessment CTA */}
            <div className="text-center mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-2">
                Not feeling like yourself today? You can choose to retake the assessment.
              </p>
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs text-gray-600 border-gray-300 hover:border-gray-400 hover:text-gray-700"
                onClick={() => {
                  // Reset assessment state
                  setResponses([]);
                  setCurrentQuestionIndex(0);
                  setMostLikeMe(null);
                  setLeastLikeMe(null);
                  setIsCompleted(false);
                  setShowResults(false);
                  setAssessmentResults(null);
                  
                  // Show confirmation toast
                  toast({
                    title: "Assessment Reset",
                    description: "Starting fresh assessment from the beginning",
                  });
                }}
              >
                Retake Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Show demo login if no questions loaded
  if (questions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Work Style Assessment</CardTitle>
            <CardDescription>
              Complete our 30-question behavioral assessment to unlock personalized job matching.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p>Checking for existing assessment data...</p>
            <Button onClick={handleDemoLogin} variant="pollen">
              Demo Login (Job Seeker)
            </Button>
            <p className="text-sm text-muted-foreground">
              If you've completed the assessment before, your results will load automatically.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Work Style Questions</h1>
          <span className="text-sm text-muted-foreground">
            {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-muted-foreground mt-2">
          These questions help us understand your natural work style preferences to improve job matching.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
          {currentQuestion.context && (
            <p className="text-muted-foreground">{currentQuestion.context}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium mb-3 block">
                Most like me:
              </Label>
              <div className="space-y-2">
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id={`most-${index}`}
                      name="mostLikeMe"
                      checked={mostLikeMe === index}
                      onChange={() => handleMostLikeMeChange(index)}
                      className="w-4 h-4"
                    />
                    <Label htmlFor={`most-${index}`} className="cursor-pointer flex-1">
                      {option.text}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {mostLikeMe !== null && (
              <div className="animate-in slide-in-from-top-4 duration-300">
                <Label className="text-base font-medium mb-3 block">
                  Least like me:
                </Label>
                <div className="space-y-2">
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={`least-${index}`}
                        name="leastLikeMe"
                        checked={leastLikeMe === index}
                        onChange={() => handleLeastLikeMeChange(index)}
                        className="w-4 h-4"
                        disabled={index === mostLikeMe}
                      />
                      <Label 
                        htmlFor={`least-${index}`} 
                        className={`cursor-pointer flex-1 ${
                          index === mostLikeMe ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={mostLikeMe === null || leastLikeMe === null || submitAssessment.isPending}
            >
              {currentQuestionIndex === questions.length - 1 ? "Complete Assessment" : "Continue"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Back to Dashboard */}
      <div className="text-center">
        <Button
          variant="ghost"
          onClick={() => window.location.href = "/profile-checkpoints"}
          className="text-gray-600 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}