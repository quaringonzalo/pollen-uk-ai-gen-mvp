import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Clock, Trophy, Star, CheckCircle, ArrowRight, ArrowLeft,
  Target, Award, Lightbulb, Brain, BarChart
} from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: number;
  questions: Question[];
  category: string;
  skills: string[];
  passingScore: number;
}

interface Question {
  id: string;
  type: "multiple_choice" | "short_answer" | "scenario" | "practical";
  question: string;
  options?: string[];
  correctAnswer?: string | number;
  points: number;
  explanation?: string;
}

export default function SkillsChallengePage() {
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [challengeStarted, setChallengeStarted] = useState(false);

  // Mock challenges data
  const challenges: Challenge[] = [
    {
      id: "digital_marketing",
      title: "Digital Marketing Fundamentals",
      description: "Test your knowledge of SEO, social media, and campaign management basics",
      duration: 15,
      category: "Marketing",
      skills: ["SEO", "Social Media", "Analytics"],
      passingScore: 70,
      questions: [
        {
          id: "q1",
          type: "multiple_choice",
          question: "What does SEO stand for?",
          options: [
            "Search Engine Optimization",
            "Social Engagement Online", 
            "Site Enhancement Operations",
            "Strategic Email Outreach"
          ],
          correctAnswer: 0,
          points: 10,
          explanation: "SEO stands for Search Engine Optimization, which helps websites rank higher in search results."
        },
        {
          id: "q2",
          type: "multiple_choice",
          question: "Which metric is most important for measuring social media engagement?",
          options: [
            "Number of followers",
            "Likes, comments, and shares",
            "Post frequency",
            "Account age"
          ],
          correctAnswer: 1,
          points: 15,
          explanation: "Engagement metrics like likes, comments, and shares show how actively your audience interacts with your content."
        },
        {
          id: "q3",
          type: "scenario",
          question: "A client wants to increase their Instagram followers. What would be your first recommendation?",
          options: [
            "Post more frequently",
            "Buy followers", 
            "Create engaging, high-quality content",
            "Use more hashtags"
          ],
          correctAnswer: 2,
          points: 20,
          explanation: "Quality content that resonates with your target audience is the foundation of organic growth."
        },
        {
          id: "q4",
          type: "short_answer",
          question: "Describe one way a small business could use social media to connect with their local community.",
          points: 25,
          explanation: "Good answers might include: hosting local events, featuring local customers, partnering with other local businesses, or sharing community news."
        }
      ]
    },
    {
      id: "customer_service",
      title: "Customer Service Excellence", 
      description: "Handle customer situations with professionalism and empathy",
      duration: 10,
      category: "Customer Service",
      skills: ["Communication", "Problem Solving", "Empathy"],
      passingScore: 75,
      questions: [
        {
          id: "q1",
          type: "scenario",
          question: "A customer is upset because their order arrived late. How do you respond?",
          options: [
            "Tell them it's not your fault and blame the delivery company",
            "Apologize sincerely and ask how you can make it right",
            "Offer a discount on their next order immediately",
            "Explain that delays sometimes happen"
          ],
          correctAnswer: 1,
          points: 25,
          explanation: "A sincere apology followed by asking how to resolve the issue shows empathy and a solution-focused approach."
        },
        {
          id: "q2",
          type: "multiple_choice", 
          question: "What is the most important skill in customer service?",
          options: [
            "Speaking quickly",
            "Active listening",
            "Product knowledge",
            "Following scripts"
          ],
          correctAnswer: 1,
          points: 20,
          explanation: "Active listening helps you understand the customer's real needs and concerns."
        },
        {
          id: "q3",
          type: "scenario",
          question: "A customer asks for a refund on a product that's outside your return policy. What do you do?",
          options: [
            "Refuse immediately because of the policy",
            "Listen to their situation and explore possible solutions",
            "Automatically approve the refund",
            "Transfer them to a manager"
          ],
          correctAnswer: 1,
          points: 30,
          explanation: "Understanding their situation first allows you to find creative solutions within company guidelines."
        },
        {
          id: "q4",
          type: "short_answer",
          question: "How would you handle a situation where you don't know the answer to a customer's question?",
          points: 25,
          explanation: "Good responses include: admitting you don't know, promising to find out, setting a timeframe for follow-up, and thanking them for their patience."
        }
      ]
    },
    {
      id: "data_analysis",
      title: "Data Analysis Basics",
      description: "Analyze data patterns and create meaningful insights",
      duration: 20,
      category: "Analytics", 
      skills: ["Excel", "Data Visualization", "Analysis"],
      passingScore: 70,
      questions: [
        {
          id: "q1",
          type: "multiple_choice",
          question: "In Excel, which function would you use to find the average of a range of numbers?",
          options: ["SUM", "AVERAGE", "MEAN", "TOTAL"],
          correctAnswer: 1,
          points: 15,
          explanation: "The AVERAGE function calculates the arithmetic mean of a range of numbers."
        },
        {
          id: "q2",
          type: "practical",
          question: "Looking at this sales data: Jan: £1000, Feb: £1200, Mar: £800, Apr: £1500. What's the trend?",
          options: [
            "Consistent growth",
            "Declining sales", 
            "Volatile with overall growth",
            "No clear pattern"
          ],
          correctAnswer: 2,
          points: 25,
          explanation: "Despite the dip in March, there's an overall upward trend from £1000 to £1500."
        },
        {
          id: "q3",
          type: "multiple_choice",
          question: "What type of chart is best for showing how parts relate to the whole?",
          options: ["Line chart", "Bar chart", "Pie chart", "Scatter plot"],
          correctAnswer: 2,
          points: 20,
          explanation: "Pie charts effectively show proportions and how individual parts make up the whole."
        },
        {
          id: "q4",
          type: "short_answer", 
          question: "If you notice a sudden spike in website traffic, what are three questions you would ask to understand why?",
          points: 30,
          explanation: "Good questions might include: What marketing campaigns are running? Were there any external events? What pages are getting the most traffic? What's the traffic source?"
        }
      ]
    }
  ];

  const currentChallenge = challenges.find(c => c.id === selectedChallenge);
  const currentQ = currentChallenge?.questions[currentQuestion];
  const progress = currentChallenge ? ((currentQuestion + 1) / currentChallenge.questions.length) * 100 : 0;

  const startChallenge = (challengeId: string) => {
    setSelectedChallenge(challengeId);
    setChallengeStarted(true);
    setCurrentQuestion(0);
    setAnswers({});
    const challenge = challenges.find(c => c.id === challengeId);
    if (challenge) {
      setTimeRemaining(challenge.duration * 60); // Convert to seconds
    }
  };

  const handleAnswer = (answer: string) => {
    if (currentQ) {
      setAnswers(prev => ({ ...prev, [currentQ.id]: answer }));
    }
  };

  const nextQuestion = () => {
    if (currentChallenge && currentQuestion < currentChallenge.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      completeChallenge();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const completeChallenge = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    if (!currentChallenge) return 0;
    
    let totalPoints = 0;
    let earnedPoints = 0;
    
    currentChallenge.questions.forEach(q => {
      totalPoints += q.points;
      const userAnswer = answers[q.id];
      
      if (q.type === "multiple_choice" || q.type === "scenario" || q.type === "practical") {
        if (userAnswer && parseInt(userAnswer) === q.correctAnswer) {
          earnedPoints += q.points;
        }
      } else if (q.type === "short_answer") {
        // For short answers, award points if they provided an answer
        if (userAnswer && userAnswer.trim().length > 10) {
          earnedPoints += q.points * 0.8; // Award 80% for attempting
        }
      }
    });
    
    return Math.round((earnedPoints / totalPoints) * 100);
  };

  const score = calculateScore();
  const passed = currentChallenge ? score >= currentChallenge.passingScore : false;

  if (!selectedChallenge) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Skills Challenges</h1>
            <p className="text-lg text-gray-600">
              Complete challenges to verify your skills and improve your job matches
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map(challenge => (
              <Card key={challenge.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline">{challenge.category}</Badge>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-500">{challenge.duration}m</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{challenge.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{challenge.description}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Skills Tested:</h4>
                      <div className="flex flex-wrap gap-1">
                        {challenge.skills.map(skill => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Questions: {challenge.questions.length}</span>
                      <span className="text-gray-600">Pass: {challenge.passingScore}%</span>
                    </div>
                  </div>

                  <Button 
                    onClick={() => startChallenge(challenge.id)}
                    className="w-full mt-4"
                  >
                    Start Challenge
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-2xl w-full mx-4">
          <CardContent className="pt-8 text-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
              passed ? "bg-green-100" : "bg-orange-100"
            }`}>
              {passed ? (
                <Trophy className="w-12 h-12 text-green-600" />
              ) : (
                <Target className="w-12 h-12 text-orange-600" />
              )}
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Challenge Complete!
            </h2>
            
            <div className="text-4xl font-bold mb-2">
              <span className={passed ? "text-green-600" : "text-orange-600"}>
                {score}%
              </span>
            </div>
            
            <p className="text-gray-600 mb-6">
              {passed 
                ? `Congratulations! You passed the ${currentChallenge?.title} challenge.`
                : `You scored ${score}%. Keep practicing - you need ${currentChallenge?.passingScore}% to pass.`
              }
            </p>

            {passed && (
              <div className="bg-green-50 p-4 rounded-lg mb-6">
                <h3 className="font-medium text-green-900 mb-2">Skills Verified:</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {currentChallenge?.skills.map(skill => (
                    <Badge key={skill} className="bg-green-100 text-green-800">
                      <Award className="w-3 h-3 mr-1" />
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <Button 
                variant="outline"
                onClick={() => {
                  setSelectedChallenge(null);
                  setChallengeStarted(false);
                  setShowResults(false);
                }}
              >
                Back to Challenges
              </Button>
              <Button onClick={() => window.location.href = "/job-recommendations"}>
                View Job Matches
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!challengeStarted || !currentChallenge || !currentQ) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{currentChallenge.title}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>Question {currentQuestion + 1} of {currentChallenge.questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </div>

        {/* Question */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{currentQ.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentQ.type === "multiple_choice" || currentQ.type === "scenario" || currentQ.type === "practical" ? (
              <RadioGroup 
                value={answers[currentQ.id] || ""} 
                onValueChange={(value) => handleAnswer(value)}
              >
                {currentQ.options?.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <Textarea
                placeholder="Type your answer here..."
                value={answers[currentQ.id] || ""}
                onChange={(e) => handleAnswer(e.target.value)}
                rows={4}
              />
            )}

            <div className="flex justify-between pt-4">
              <Button 
                variant="outline"
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <Button 
                onClick={nextQuestion}
                disabled={!answers[currentQ.id]}
              >
                {currentQuestion === currentChallenge.questions.length - 1 ? "Complete" : "Next"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}