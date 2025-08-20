import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  calculateComprehensiveMatch, 
  generateMatchInsights,
  type CandidateBehavioralProfile,
  type JobBehavioralRequirement,
  type SkillsChallengeResult
} from "@/lib/behavioural-matching";
import { CheckCircle, AlertCircle, TrendingUp, Users, Target, Brain } from "lucide-react";

// Demo data for testing the matching algorithm
const DEMO_CANDIDATE_PROFILE: CandidateBehavioralProfile = {
  dimensions: {
    work_style: {
      dominant: 'collaborative',
      score: 4,
      distribution: { independent: 2, collaborative: 4, structured: 3, adaptable: 3 }
    },
    communication: {
      dominant: 'supportive',
      score: 3,
      distribution: { direct: 2, diplomatic: 2, analytical: 2, supportive: 3 }
    },
    problem_solving: {
      dominant: 'creative',
      score: 4,
      distribution: { methodical: 2, creative: 4, experimental: 3, collaborative_solver: 3 }
    },
    learning_growth: {
      dominant: 'hands_on',
      score: 4,
      distribution: { hands_on: 4, research_oriented: 2, feedback_driven: 3, self_directed: 2 }
    },
    motivation: {
      dominant: 'impact',
      score: 4,
      distribution: { achievement: 2, impact: 4, growth: 3, stability: 1 }
    },
    leadership: {
      dominant: 'collaborative_leader',
      score: 3,
      distribution: { directive: 1, collaborative_leader: 3, lead_by_example: 2 }
    }
  },
  overallTraits: [
    { trait: 'collaborative', score: 4 },
    { trait: 'creative', score: 4 },
    { trait: 'hands_on', score: 4 },
    { trait: 'impact', score: 4 },
    { trait: 'adaptable', score: 3 }
  ],
  responseCount: 15,
  completedAt: new Date().toISOString()
};

const DEMO_JOB_REQUIREMENTS: JobBehavioralRequirement[] = [
  { dimensionId: 'work_style', traitId: 'collaborative', importance: 5, required: true },
  { dimensionId: 'communication', traitId: 'supportive', importance: 4, required: false },
  { dimensionId: 'problem_solving', traitId: 'creative', importance: 4, required: false },
  { dimensionId: 'motivation', traitId: 'impact', importance: 5, required: true },
  { dimensionId: 'leadership', traitId: 'collaborative_leader', importance: 3, required: false }
];

const DEMO_SKILLS_RESULTS: SkillsChallengeResult[] = [
  {
    challengeId: 'marketing_campaign',
    score: 85,
    skillsVerified: ['Marketing Strategy', 'Content Creation', 'Social Media'],
    completedAt: new Date().toISOString()
  },
  {
    challengeId: 'data_analysis',
    score: 72,
    skillsVerified: ['Data Analysis', 'Excel', 'Problem Solving'],
    completedAt: new Date().toISOString()
  }
];

const DEMO_REQUIRED_SKILLS = ['Marketing Strategy', 'Content Creation', 'Communication', 'Project Management'];
const DEMO_PREFERRED_SKILLS = ['Data Analysis', 'Social Media', 'Design'];

export default function MatchingDemo() {
  const [showDetails, setShowDetails] = useState(false);
  
  // Calculate the comprehensive match
  const matchResult = calculateComprehensiveMatch(
    DEMO_CANDIDATE_PROFILE,
    DEMO_JOB_REQUIREMENTS,
    DEMO_SKILLS_RESULTS,
    DEMO_REQUIRED_SKILLS,
    DEMO_PREFERRED_SKILLS
  );

  const insights = generateMatchInsights(matchResult);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Comprehensive Candidate Matching Demo</span>
          </CardTitle>
          <CardDescription>
            This demonstrates how behavioural assessment and skills verification combine to create robust job matching.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Overall Match Score */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className={`text-center ${getScoreBg(matchResult.overallScore)}`}>
              <CardContent className="pt-6">
                <div className={`text-4xl font-bold ${getScoreColor(matchResult.overallScore)}`}>
                  {matchResult.overallScore}%
                </div>
                <div className="text-sm font-medium text-gray-600 mt-2">Overall Match</div>
                <Progress value={matchResult.overallScore} className="mt-3" />
              </CardContent>
            </Card>

            <Card className={`text-center ${getScoreBg(matchResult.behaviouralScore)}`}>
              <CardContent className="pt-6">
                <div className={`text-4xl font-bold ${getScoreColor(matchResult.behaviouralScore)}`}>
                  {matchResult.behaviouralScore}%
                </div>
                <div className="text-sm font-medium text-gray-600 mt-2">Behavioral Fit</div>
                <Progress value={matchResult.behaviouralScore} className="mt-3" />
              </CardContent>
            </Card>

            <Card className={`text-center ${getScoreBg(matchResult.skillsScore)}`}>
              <CardContent className="pt-6">
                <div className={`text-4xl font-bold ${getScoreColor(matchResult.skillsScore)}`}>
                  {matchResult.skillsScore}%
                </div>
                <div className="text-sm font-medium text-gray-600 mt-2">Skills Verification</div>
                <Progress value={matchResult.skillsScore} className="mt-3" />
              </CardContent>
            </Card>
          </div>

          {/* Insights Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center text-green-600">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {insights.strengths.map((strength, index) => (
                    <li key={index} className="text-sm text-gray-700">
                      • {strength}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center text-red-600">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Concerns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {insights.concerns.length > 0 ? insights.concerns.map((concern, index) => (
                    <li key={index} className="text-sm text-gray-700">
                      • {concern}
                    </li>
                  )) : (
                    <p className="text-sm text-gray-500">No major concerns identified</p>
                  )}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center text-blue-600">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {insights.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-gray-700">
                      • {rec}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Breakdown Toggle */}
          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? 'Hide' : 'Show'} Detailed Breakdown
            </Button>
          </div>

          {/* Detailed Breakdown */}
          {showDetails && (
            <div className="mt-8 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Behavioral Dimension Matches
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {matchResult.breakdown.behavioural.dimensionMatches.map((match, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium capitalize">{match.dimension.replace('_', ' ')}</div>
                          <div className="text-sm text-gray-600">
                            Candidate strength: <span className="font-medium">{match.candidateStrength}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${getScoreColor(match.requirementMatch)}`}>
                            {Math.round(match.requirementMatch)}%
                          </div>
                          <div className="text-xs text-gray-500">
                            Importance: {match.importance}/5
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Brain className="w-5 h-5 mr-2" />
                    Skills Verification Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Required Skills Coverage</h4>
                      <div className="space-y-2">
                        {DEMO_REQUIRED_SKILLS.map((skill) => {
                          const isVerified = DEMO_SKILLS_RESULTS.some(result => 
                            result.skillsVerified.includes(skill)
                          );
                          return (
                            <div key={skill} className="flex items-center justify-between">
                              <span className="text-sm">{skill}</span>
                              {isVerified ? (
                                <Badge variant="default" className="bg-green-100 text-green-800">
                                  Verified
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="bg-red-100 text-red-800">
                                  Gap
                                </Badge>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Challenge Performance</h4>
                      <div className="space-y-2">
                        {DEMO_SKILLS_RESULTS.map((result, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-sm capitalize">
                                {result.challengeId.replace('_', ' ')}
                              </span>
                              <span className={`font-bold ${getScoreColor(result.score)}`}>
                                {result.score}%
                              </span>
                            </div>
                            <div className="text-xs text-gray-600">
                              Skills verified: {result.skillsVerified.join(', ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}