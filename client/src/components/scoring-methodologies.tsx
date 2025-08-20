import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";
import { 
  Target, Brain, Zap, TrendingUp, Award, Star,
  Settings, Info, ChevronDown, ChevronUp
} from "lucide-react";

interface CompatibilityScore {
  candidateId: number;
  candidateName: string;
  overallScore: number;
  breakdown: {
    skillsMatch: number;
    behaviouralMatch: number;
    experienceMatch: number;
    culturalFit: number;
    motivationAlignment: number;
  };
  strengths: string[];
  concerns: string[];
  recommendation: 'highly_recommended' | 'recommended' | 'consider' | 'not_recommended';
}

interface ScoringWeights {
  skillsMatch: number;
  behaviouralMatch: number;
  experienceMatch: number;
  culturalFit: number;
  motivationAlignment: number;
}

interface ScoringMethodologiesProps {
  jobId?: number;
  candidates?: CompatibilityScore[];
  userType: 'employer' | 'admin';
}

export default function ScoringMethodologies({ jobId, candidates = [], userType }: ScoringMethodologiesProps) {
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [scoringWeights, setScoringWeights] = useState<ScoringWeights>({
    skillsMatch: 30,
    behaviouralMatch: 25,
    experienceMatch: 20,
    culturalFit: 15,
    motivationAlignment: 10
  });
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [useAIScoring, setUseAIScoring] = useState(true);

  // Mock candidate data with comprehensive scoring
  const mockCandidates: CompatibilityScore[] = [
    {
      candidateId: 1,
      candidateName: "Emma Thompson",
      overallScore: 87,
      breakdown: {
        skillsMatch: 92,
        behaviouralMatch: 85,
        experienceMatch: 78,
        culturalFit: 90,
        motivationAlignment: 88
      },
      strengths: [
        "Excellent digital marketing skills",
        "Strong team collaboration",
        "High cultural alignment",
        "Motivated for career growth"
      ],
      concerns: [
        "Limited project management experience"
      ],
      recommendation: 'highly_recommended'
    },
    {
      candidateId: 2,
      candidateName: "James Wilson",
      overallScore: 73,
      breakdown: {
        skillsMatch: 85,
        behaviouralMatch: 70,
        experienceMatch: 65,
        culturalFit: 75,
        motivationAlignment: 72
      },
      strengths: [
        "Strong technical skills",
        "Good analytical abilities",
        "Reliable and punctual"
      ],
      concerns: [
        "Less collaborative work style",
        "May need culture onboarding",
        "Motivation unclear for role change"
      ],
      recommendation: 'recommended'
    },
    {
      candidateId: 3,
      candidateName: "Sarah Chen",
      overallScore: 81,
      breakdown: {
        skillsMatch: 88,
        behaviouralMatch: 82,
        experienceMatch: 75,
        culturalFit: 85,
        motivationAlignment: 75
      },
      strengths: [
        "Excellent communication skills",
        "Strong behavioural fit",
        "Good technical foundation",
        "Cultural alignment"
      ],
      concerns: [
        "Some skill gaps in advanced analytics"
      ],
      recommendation: 'highly_recommended'
    }
  ];

  const candidateList = candidates.length > 0 ? candidates : mockCandidates;

  const calculateOverallScore = (breakdown: any, weights: ScoringWeights) => {
    return Math.round(
      (breakdown.skillsMatch * weights.skillsMatch / 100) +
      (breakdown.behaviouralMatch * weights.behaviouralMatch / 100) +
      (breakdown.experienceMatch * weights.experienceMatch / 100) +
      (breakdown.culturalFit * weights.culturalFit / 100) +
      (breakdown.motivationAlignment * weights.motivationAlignment / 100)
    );
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'highly_recommended': return 'bg-green-100 text-green-800 border-green-200';
      case 'recommended': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'consider': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'not_recommended': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRecommendationText = (recommendation: string) => {
    switch (recommendation) {
      case 'highly_recommended': return 'Highly Recommended';
      case 'recommended': return 'Recommended';
      case 'consider': return 'Consider';
      case 'not_recommended': return 'Not Recommended';
      default: return 'Pending Review';
    }
  };

  const updateWeight = (key: keyof ScoringWeights, value: number) => {
    setScoringWeights(prev => ({ ...prev, [key]: value }));
  };

  const selectedCandidateData = candidateList.find(c => c.candidateId === selectedCandidate);

  const radarData = selectedCandidateData ? [
    { category: 'Skills', score: selectedCandidateData.breakdown.skillsMatch },
    { category: 'Behavioral', score: selectedCandidateData.breakdown.behaviouralMatch },
    { category: 'Experience', score: selectedCandidateData.breakdown.experienceMatch },
    { category: 'Culture', score: selectedCandidateData.breakdown.culturalFit },
    { category: 'Motivation', score: selectedCandidateData.breakdown.motivationAlignment }
  ] : [];

  const scoringFactors = [
    {
      key: 'skillsMatch',
      label: 'Skills Match',
      description: 'How well candidate skills align with job requirements',
      icon: <Zap className="w-4 h-4" />
    },
    {
      key: 'behaviouralMatch',
      label: 'Behavioral Fit',
      description: 'Personality and work style compatibility',
      icon: <Brain className="w-4 h-4" />
    },
    {
      key: 'experienceMatch',
      label: 'Experience Level',
      description: 'Relevant experience and career progression',
      icon: <Award className="w-4 h-4" />
    },
    {
      key: 'culturalFit',
      label: 'Cultural Fit',
      description: 'Alignment with company values and culture',
      icon: <Target className="w-4 h-4" />
    },
    {
      key: 'motivationAlignment',
      label: 'Motivation',
      description: 'Career goals and motivation alignment',
      icon: <TrendingUp className="w-4 h-4" />
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Scoring & Compatibility</h1>
          <p className="text-gray-600">AI-powered candidate assessment and ranking</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch checked={useAIScoring} onCheckedChange={setUseAIScoring} />
            <Label>AI-Enhanced Scoring</Label>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
          >
            <Settings className="w-4 h-4 mr-2" />
            {showAdvancedSettings ? 'Hide' : 'Show'} Settings
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
          <TabsTrigger value="comparison">Compare Candidates</TabsTrigger>
          <TabsTrigger value="methodology">Methodology</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Scoring Weights Configuration */}
          {showAdvancedSettings && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Scoring Configuration
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Adjust the importance of different factors in candidate scoring
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {scoringFactors.map((factor) => (
                    <div key={factor.key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {factor.icon}
                          <span className="font-medium">{factor.label}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {scoringWeights[factor.key as keyof ScoringWeights]}%
                        </span>
                      </div>
                      <Slider
                        value={[scoringWeights[factor.key as keyof ScoringWeights]]}
                        onValueChange={(value) => updateWeight(factor.key as keyof ScoringWeights, value[0])}
                        max={50}
                        min={5}
                        step={5}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500">{factor.description}</p>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="font-medium">Total Weight:</span>
                    <span className={`font-bold ${Object.values(scoringWeights).reduce((a, b) => a + b, 0) === 100 ? 'text-green-600' : 'text-red-600'}`}>
                      {Object.values(scoringWeights).reduce((a, b) => a + b, 0)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Candidate Rankings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Candidate Rankings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {candidateList
                  .sort((a, b) => b.overallScore - a.overallScore)
                  .map((candidate, index) => (
                    <div 
                      key={candidate.candidateId}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedCandidate === candidate.candidateId 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedCandidate(
                        selectedCandidate === candidate.candidateId ? null : candidate.candidateId
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                            #{index + 1}
                          </div>
                          <div>
                            <h3 className="font-semibold">{candidate.candidateName}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getRecommendationColor(candidate.recommendation)}>
                                {getRecommendationText(candidate.recommendation)}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                Overall Score: {candidate.overallScore}%
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">
                              {candidate.overallScore}%
                            </div>
                            <Progress value={candidate.overallScore} className="w-24 h-2" />
                          </div>
                          {selectedCandidate === candidate.candidateId ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </div>
                      </div>

                      {selectedCandidate === candidate.candidateId && (
                        <div className="mt-4 pt-4 border-t space-y-4">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium text-green-700 mb-2">Strengths</h4>
                              <ul className="space-y-1">
                                {candidate.strengths.map((strength, idx) => (
                                  <li key={idx} className="text-sm flex items-start gap-2">
                                    <span className="text-green-500 mt-1">•</span>
                                    {strength}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-medium text-orange-700 mb-2">Areas of Concern</h4>
                              <ul className="space-y-1">
                                {candidate.concerns.map((concern, idx) => (
                                  <li key={idx} className="text-sm flex items-start gap-2">
                                    <span className="text-orange-500 mt-1">•</span>
                                    {concern}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-3">Score Breakdown</h4>
                            <div className="grid grid-cols-5 gap-3">
                              {Object.entries(candidate.breakdown).map(([key, value]) => {
                                const factor = scoringFactors.find(f => f.key === key);
                                return (
                                  <div key={key} className="text-center">
                                    <div className="text-lg font-bold text-blue-600">{value}%</div>
                                    <div className="text-xs text-gray-500">
                                      {factor?.label || key}
                                    </div>
                                    <Progress value={value} className="h-1 mt-1" />
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Detailed Analysis Tab */}
        <TabsContent value="detailed" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Detailed Candidate Analysis</h2>
            <Select value={selectedCandidate?.toString() || ""} onValueChange={(value) => setSelectedCandidate(parseInt(value))}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select a candidate" />
              </SelectTrigger>
              <SelectContent>
                {candidateList.map((candidate) => (
                  <SelectItem key={candidate.candidateId} value={candidate.candidateId.toString()}>
                    {candidate.candidateName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCandidateData && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Score Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={Object.entries(selectedCandidateData.breakdown).map(([key, value]) => ({
                      name: scoringFactors.find(f => f.key === key)?.label || key,
                      score: value
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="score" fill="#3B82F6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Competency Radar</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="category" />
                      <PolarRadiusAxis angle={18} domain={[0, 100]} />
                      <Radar
                        name="Score"
                        dataKey="score"
                        stroke="#3B82F6"
                        fill="#3B82F6"
                        fillOpacity={0.3}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Comparison Tab */}
        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Candidate Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Candidate</th>
                      <th className="text-center p-2">Overall</th>
                      <th className="text-center p-2">Skills</th>
                      <th className="text-center p-2">Behavioral</th>
                      <th className="text-center p-2">Experience</th>
                      <th className="text-center p-2">Culture</th>
                      <th className="text-center p-2">Motivation</th>
                      <th className="text-center p-2">Recommendation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidateList.map((candidate) => (
                      <tr key={candidate.candidateId} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-medium">{candidate.candidateName}</td>
                        <td className="p-2 text-center">
                          <span className="font-bold text-blue-600">{candidate.overallScore}%</span>
                        </td>
                        <td className="p-2 text-center">{candidate.breakdown.skillsMatch}%</td>
                        <td className="p-2 text-center">{candidate.breakdown.behaviouralMatch}%</td>
                        <td className="p-2 text-center">{candidate.breakdown.experienceMatch}%</td>
                        <td className="p-2 text-center">{candidate.breakdown.culturalFit}%</td>
                        <td className="p-2 text-center">{candidate.breakdown.motivationAlignment}%</td>
                        <td className="p-2 text-center">
                          <Badge className={getRecommendationColor(candidate.recommendation)}>
                            {getRecommendationText(candidate.recommendation)}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Methodology Tab */}
        <TabsContent value="methodology" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5" />
                Scoring Methodology
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {scoringFactors.map((factor) => (
                <div key={factor.key} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    {factor.icon}
                    <h3 className="font-semibold">{factor.label}</h3>
                    <Badge variant="outline">
                      {scoringWeights[factor.key as keyof ScoringWeights]}% weight
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-3">{factor.description}</p>
                  
                  <div className="text-sm space-y-1">
                    <h4 className="font-medium">Evaluation Criteria:</h4>
                    {factor.key === 'skillsMatch' && (
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        <li>Required skills coverage percentage</li>
                        <li>Skill verification status</li>
                        <li>Skills assessment performance</li>
                        <li>Preferred skills bonus points</li>
                      </ul>
                    )}
                    {factor.key === 'behaviouralMatch' && (
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        <li>Personality assessment alignment</li>
                        <li>Work style compatibility</li>
                        <li>Communication preferences match</li>
                        <li>Team dynamics fit</li>
                      </ul>
                    )}
                    {factor.key === 'experienceMatch' && (
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        <li>Relevant work experience</li>
                        <li>Industry background</li>
                        <li>Project complexity handled</li>
                        <li>Career progression trajectory</li>
                      </ul>
                    )}
                    {factor.key === 'culturalFit' && (
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        <li>Company values alignment</li>
                        <li>Work environment preferences</li>
                        <li>Collaboration style match</li>
                        <li>Growth mindset indicators</li>
                      </ul>
                    )}
                    {factor.key === 'motivationAlignment' && (
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        <li>Career goals alignment</li>
                        <li>Role-specific motivation</li>
                        <li>Company mission resonance</li>
                        <li>Long-term commitment indicators</li>
                      </ul>
                    )}
                  </div>
                </div>
              ))}
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">AI Enhancement</h3>
                <p className="text-blue-800 text-sm">
                  When AI-Enhanced Scoring is enabled, our machine learning models analyse patterns 
                  from successful hires and market trends to provide more accurate compatibility predictions. 
                  The AI considers contextual factors like role requirements, company culture, and 
                  candidate potential beyond traditional metrics.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}