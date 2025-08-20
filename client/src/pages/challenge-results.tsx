import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, Star, TrendingUp, Clock, Target, 
  CheckCircle, XCircle, AlertCircle, FileText,
  BarChart3, Award, Users, Lightbulb
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";

export default function ChallengeResults() {
  const [location] = useLocation();
  const submissionId = location.split('/').pop();
  
  // For demo purposes, using mock data
  const { data: submission, isLoading } = useQuery({
    queryKey: [`/api/challenges/submissions/${submissionId}`],
    enabled: !!submissionId,
    queryFn: () => Promise.resolve(null) // Will use mock data below
  });

  // Mock submission data for development
  const mockSubmission = {
    id: submissionId,
    challengeId: 'media-planning',
    challengeTitle: 'Media Planning Challenge',
    submittedAt: '2024-01-15T10:30:00Z',
    timeSpent: 2580, // seconds
    status: 'graded',
    overallScore: 142,
    maxScore: 150,
    percentageScore: 95,
    feedback: {
      overall: "Excellent work! You demonstrated strong analytical skills and strategic thinking. Your media recommendations were well-researched and showed deep understanding of the target audience.",
      strengths: [
        "Accurate financial calculations with clear methodology",
        "Innovative media channel suggestions beyond traditional options",
        "Strong understanding of demographic targeting",
        "Professional presentation and clear reasoning"
      ],
      improvements: [
        "Could have explored more cost-effective digital options",
        "Audience segmentation could be more detailed"
      ]
    },
    rubricScores: [
      { 
        criteria: 'Mathematical Accuracy', 
        score: 38, 
        maxScore: 40, 
        feedback: 'All calculations were correct with clear working shown'
      },
      { 
        criteria: 'Media Strategy', 
        score: 55, 
        maxScore: 60, 
        feedback: 'Creative and well-reasoned recommendations. Good mix of traditional and digital channels.'
      },
      { 
        criteria: 'Audience Understanding', 
        score: 28, 
        maxScore: 30, 
        feedback: 'Strong demographic analysis. Could expand on psychographic factors.'
      },
      { 
        criteria: 'Budget Optimization', 
        score: 21, 
        maxScore: 20, 
        feedback: 'Exceeded expectations with creative budget allocation strategies'
      }
    ],
    skillsAssessed: [
      { skill: 'Media Planning', score: 92, improvement: '+12 from previous' },
      { skill: 'Budget Management', score: 88, improvement: '+8 from previous' },
      { skill: 'Audience Targeting', score: 85, improvement: 'New skill assessed' },
      { skill: 'Strategic Thinking', score: 90, improvement: '+5 from previous' }
    ],
    benchmarkData: {
      userPercentile: 78,
      averageScore: 118,
      topPercentile: 145
    },
    nextSteps: [
      "Try the advanced 'Multi-Channel Attribution' challenge",
      "Explore digital marketing specialisation track",
      "Consider applying to media planning roles - you're ready!"
    ]
  };

  const data = submission || mockSubmission;

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 75) return 'text-blue-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (percentage: number) => {
    if (percentage >= 90) return 'default';
    if (percentage >= 75) return 'secondary';
    if (percentage >= 60) return 'outline';
    return 'destructive';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-full">
            <Trophy className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">Challenge Complete!</h1>
        <p className="text-muted-foreground text-lg">{data.challengeTitle}</p>
        <div className="flex items-center justify-center gap-6 mt-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            Completed in {formatTime(data.timeSpent)}
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4" />
            Submitted {new Date(data.submittedAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Score Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="text-6xl font-bold text-blue-600">
              {data.overallScore}
            </div>
            <div className="text-2xl text-muted-foreground">
              / {data.maxScore}
            </div>
          </div>
          <CardTitle className={`text-2xl ${getScoreColor(data.percentageScore)}`}>
            {data.percentageScore}% Score
          </CardTitle>
          <CardDescription>
            You scored higher than {data.benchmarkData.userPercentile}% of candidates who took this challenge
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-green-600">{data.benchmarkData.userPercentile}th</div>
              <div className="text-sm text-muted-foreground">Percentile</div>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{data.benchmarkData.averageScore}</div>
              <div className="text-sm text-muted-foreground">Average Score</div>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <div className="text-2xl font-bold text-pink-600">{data.benchmarkData.topPercentile}</div>
              <div className="text-sm text-muted-foreground">Top 10% Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="detailed-feedback" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="detailed-feedback">Detailed Feedback</TabsTrigger>
          <TabsTrigger value="rubric-scores">Rubric Breakdown</TabsTrigger>
          <TabsTrigger value="skills-progress">Skills Progress</TabsTrigger>
          <TabsTrigger value="next-steps">Next Steps</TabsTrigger>
        </TabsList>

        <TabsContent value="detailed-feedback" className="space-y-6">
          {/* Overall Feedback */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Overall Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">{data.feedback.overall}</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Key Strengths
                  </h4>
                  <ul className="space-y-2">
                    {data.feedback.strengths.map((strength: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <Star className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-blue-600 mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Areas for Growth
                  </h4>
                  <ul className="space-y-2">
                    {data.feedback.improvements.map((improvement: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <Lightbulb className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rubric-scores" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Rubric Breakdown
              </CardTitle>
              <CardDescription>
                Detailed scoring across all evaluation criteria
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {data.rubricScores.map((rubric: any, index: number) => {
                  const percentage = (rubric.score / rubric.maxScore) * 100;
                  return (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{rubric.criteria}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant={getScoreBadgeVariant(percentage)}>
                            {rubric.score}/{rubric.maxScore}
                          </Badge>
                          <span className={`text-sm font-medium ${getScoreColor(percentage)}`}>
                            {Math.round(percentage)}%
                          </span>
                        </div>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      <p className="text-sm text-muted-foreground">
                        {rubric.feedback}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills-progress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Skills Assessment
              </CardTitle>
              <CardDescription>
                Your performance across key competencies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {data.skillsAssessed.map((skill: any, index: number) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{skill.skill}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-green-600">
                          {skill.improvement}
                        </Badge>
                        <span className={`text-lg font-bold ${getScoreColor(skill.score)}`}>
                          {skill.score}%
                        </span>
                      </div>
                    </div>
                    <Progress value={skill.score} className="h-3" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="next-steps" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Your Next Steps
              </CardTitle>
              <CardDescription>
                Recommendations to continue your skills development journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.nextSteps.map((step: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                    <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-sm">{step}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-4">
            <Button size="lg" onClick={() => window.location.href = '/skills-challenges'}>
              Browse More Challenges
            </Button>
            <Button variant="outline" size="lg" onClick={() => window.location.href = '/job-seeker-dashboard'}>
              Back to Dashboard
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}