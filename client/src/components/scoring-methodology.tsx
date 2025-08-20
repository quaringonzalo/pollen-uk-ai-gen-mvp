import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from "recharts";
import { 
  Target, Brain, Zap, Users, TrendingUp, Award, 
  Scale, CheckCircle, AlertTriangle, Info, Settings,
  Eye, Calculator, Lightbulb, Gauge
} from "lucide-react";

interface ScoringCriteria {
  id: string;
  name: string;
  weight: number;
  maxScore: number;
  description: string;
  category: 'skills' | 'behavioural' | 'assessment' | 'experience';
}

interface CandidateScore {
  candidateId: number;
  candidateName: string;
  overallScore: number;
  skillsScore: number;
  behaviouralScore: number;
  assessmentScore: number;
  experienceScore: number;
  breakdown: {
    [criteriaId: string]: number;
  };
  strengths: string[];
  areasForImprovement: string[];
  recommendation: 'strong_hire' | 'hire' | 'maybe' | 'no_hire';
}

interface ScoringMethodologyProps {
  jobId?: number;
  candidateId?: number;
  viewMode: 'configure' | 'view' | 'compare';
}

export default function ScoringMethodology({ jobId, candidateId, viewMode }: ScoringMethodologyProps) {
  const [selectedJobId, setSelectedJobId] = useState(jobId || 1);
  const [weightings, setWeightings] = useState({
    skills: 40,
    behavioural: 30,
    assessment: 20,
    experience: 10
  });

  // Mock scoring criteria
  const scoringCriteria: ScoringCriteria[] = [
    {
      id: 'technical_skills',
      name: 'Technical Skills',
      weight: 35,
      maxScore: 100,
      description: 'Proficiency in required technical competencies',
      category: 'skills'
    },
    {
      id: 'communication',
      name: 'Communication Skills',
      weight: 25,
      maxScore: 100,
      description: 'Verbal and written communication effectiveness',
      category: 'behavioural'
    },
    {
      id: 'problem_solving',
      name: 'Problem Solving',
      weight: 20,
      maxScore: 100,
      description: 'Analytical thinking and solution development',
      category: 'assessment'
    },
    {
      id: 'teamwork',
      name: 'Teamwork & Collaboration',
      weight: 15,
      maxScore: 100,
      description: 'Ability to work effectively in team environments',
      category: 'behavioural'
    },
    {
      id: 'relevant_experience',
      name: 'Relevant Experience',
      weight: 5,
      maxScore: 100,
      description: 'Previous experience in similar roles or industries',
      category: 'experience'
    }
  ];

  // Mock candidate scores
  const candidateScores: CandidateScore[] = [
    {
      candidateId: 1,
      candidateName: "Sarah Johnson",
      overallScore: 85,
      skillsScore: 88,
      behaviouralScore: 82,
      assessmentScore: 87,
      experienceScore: 75,
      breakdown: {
        technical_skills: 88,
        communication: 85,
        problem_solving: 87,
        teamwork: 80,
        relevant_experience: 75
      },
      strengths: ["Strong technical foundation", "Excellent problem-solving", "Clear communication"],
      areasForImprovement: ["Team leadership experience", "Industry-specific knowledge"],
      recommendation: 'strong_hire'
    },
    {
      candidateId: 2,
      candidateName: "Michael Chen",
      overallScore: 78,
      skillsScore: 82,
      behaviouralScore: 75,
      assessmentScore: 80,
      experienceScore: 70,
      breakdown: {
        technical_skills: 82,
        communication: 78,
        problem_solving: 80,
        teamwork: 72,
        relevant_experience: 70
      },
      strengths: ["Good technical skills", "Analytical mindset", "Eager to learn"],
      areasForImprovement: ["Communication confidence", "Collaborative experience"],
      recommendation: 'hire'
    },
    {
      candidateId: 3,
      candidateName: "Emily Rodriguez",
      overallScore: 72,
      skillsScore: 70,
      behaviouralScore: 78,
      assessmentScore: 75,
      experienceScore: 65,
      breakdown: {
        technical_skills: 70,
        communication: 80,
        problem_solving: 75,
        teamwork: 76,
        relevant_experience: 65
      },
      strengths: ["Excellent interpersonal skills", "Strong team player", "Adaptable"],
      areasForImprovement: ["Technical depth", "Complex problem-solving"],
      recommendation: 'maybe'
    }
  ];

  const radarData = candidateScores.map(candidate => ({
    name: candidate.candidateName,
    Skills: candidate.skillsScore,
    Behavioral: candidate.behaviouralScore,
    Assessment: candidate.assessmentScore,
    Experience: candidate.experienceScore
  }));

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'strong_hire': return 'bg-green-100 text-green-800 border-green-200';
      case 'hire': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'maybe': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'no_hire': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRecommendationText = (recommendation: string) => {
    switch (recommendation) {
      case 'strong_hire': return 'Strong Hire';
      case 'hire': return 'Hire';
      case 'maybe': return 'Maybe';
      case 'no_hire': return 'No Hire';
      default: return 'Pending Review';
    }
  };

  const updateWeighting = (category: string, value: number[]) => {
    setWeightings(prev => ({
      ...prev,
      [category]: value[0]
    }));
  };

  const calculateOverallScore = (candidate: CandidateScore) => {
    return (
      (candidate.skillsScore * weightings.skills +
       candidate.behaviouralScore * weightings.behavioural +
       candidate.assessmentScore * weightings.assessment +
       candidate.experienceScore * weightings.experience) / 100
    ).toFixed(1);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Scoring Methodology</h1>
          <p className="text-gray-600">Configure and view candidate evaluation criteria</p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedJobId.toString()} onValueChange={(value) => setSelectedJobId(parseInt(value))}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select job position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Marketing Assistant</SelectItem>
              <SelectItem value="2">Data Analyst</SelectItem>
              <SelectItem value="3">Customer Support</SelectItem>
              <SelectItem value="4">Project Coordinator</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Configure Scoring
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="criteria">Scoring Criteria</TabsTrigger>
          <TabsTrigger value="candidates">Candidate Scores</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Candidates</p>
                    <p className="text-2xl font-bold">{candidateScores.length}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Score</p>
                    <p className="text-2xl font-bold">
                      {(candidateScores.reduce((sum, c) => sum + c.overallScore, 0) / candidateScores.length).toFixed(1)}
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Strong Hires</p>
                    <p className="text-2xl font-bold">
                      {candidateScores.filter(c => c.recommendation === 'strong_hire').length}
                    </p>
                  </div>
                  <Award className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Assessment Rate</p>
                    <p className="text-2xl font-bold">89%</p>
                  </div>
                  <Gauge className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="w-5 h-5" />
                  Scoring Weight Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Skills & Technical</span>
                    <span className="text-sm font-bold">{weightings.skills}%</span>
                  </div>
                  <Progress value={weightings.skills} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Behavioral Traits</span>
                    <span className="text-sm font-bold">{weightings.behavioural}%</span>
                  </div>
                  <Progress value={weightings.behavioural} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Assessment Results</span>
                    <span className="text-sm font-bold">{weightings.assessment}%</span>
                  </div>
                  <Progress value={weightings.assessment} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Experience</span>
                    <span className="text-sm font-bold">{weightings.experience}%</span>
                  </div>
                  <Progress value={weightings.experience} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Score Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={candidateScores}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="candidateName" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="overallScore" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Scoring Criteria */}
        <TabsContent value="criteria" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Evaluation Criteria
              </CardTitle>
              <p className="text-sm text-gray-600">
                Configure the criteria and weightings used to evaluate candidates
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {scoringCriteria.map((criteria) => (
                  <div key={criteria.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{criteria.name}</h3>
                          <Badge className={
                            criteria.category === 'skills' ? 'bg-blue-100 text-blue-800' :
                            criteria.category === 'behavioural' ? 'bg-purple-100 text-purple-800' :
                            criteria.category === 'assessment' ? 'bg-green-100 text-green-800' :
                            'bg-orange-100 text-orange-800'
                          }>
                            {criteria.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{criteria.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Weight</p>
                        <p className="text-lg font-bold">{criteria.weight}%</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium">Weight (%)</label>
                        <Slider
                          value={[criteria.weight]}
                          onValueChange={(value) => {
                            // In real app, would update criteria weight
                            console.log(`Update ${criteria.id} weight to ${value[0]}`);
                          }}
                          max={50}
                          step={5}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Max Score</label>
                        <div className="mt-2 p-2 bg-gray-50 rounded text-center font-medium">
                          {criteria.maxScore}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Pass Threshold</label>
                        <div className="mt-2 p-2 bg-gray-50 rounded text-center font-medium">
                          70%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                  <span className="font-medium">Total Weight</span>
                  <span className="text-lg font-bold">
                    {scoringCriteria.reduce((sum, c) => sum + c.weight, 0)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Candidate Scores */}
        <TabsContent value="candidates" className="space-y-6">
          <div className="space-y-4">
            {candidateScores.map((candidate) => (
              <Card key={candidate.candidateId}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{candidate.candidateName}</h3>
                      <p className="text-sm text-gray-600">Overall Score: {candidate.overallScore}/100</p>
                    </div>
                    <Badge className={getRecommendationColor(candidate.recommendation)}>
                      {getRecommendationText(candidate.recommendation)}
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Zap className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                      <p className="text-sm text-gray-600">Skills</p>
                      <p className="text-lg font-bold text-blue-600">{candidate.skillsScore}</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <Brain className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                      <p className="text-sm text-gray-600">Behavioral</p>
                      <p className="text-lg font-bold text-purple-600">{candidate.behaviouralScore}</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <Target className="w-6 h-6 text-green-600 mx-auto mb-1" />
                      <p className="text-sm text-gray-600">Assessment</p>
                      <p className="text-lg font-bold text-green-600">{candidate.assessmentScore}</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <Award className="w-6 h-6 text-orange-600 mx-auto mb-1" />
                      <p className="text-sm text-gray-600">Experience</p>
                      <p className="text-lg font-bold text-orange-600">{candidate.experienceScore}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Strengths
                      </h4>
                      <ul className="space-y-1">
                        {candidate.strengths.map((strength, index) => (
                          <li key={index} className="text-sm text-green-700">
                            • {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                        Areas for Improvement
                      </h4>
                      <ul className="space-y-1">
                        {candidate.areasForImprovement.map((area, index) => (
                          <li key={index} className="text-sm text-orange-700">
                            • {area}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex gap-2">
                      <Button size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <Calculator className="w-4 h-4 mr-2" />
                        Recalculate
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Candidate Comparison Radar</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData[0] ? [radarData[0], radarData[1], radarData[2]] : []}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="Skills" />
                    <PolarRadiusAxis angle={0} domain={[0, 100]} />
                    <Radar name="Sarah Johnson" dataKey="Skills" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} />
                    <Radar name="Michael Chen" dataKey="Skills" stroke="#10B981" fill="#10B981" fillOpacity={0.1} />
                    <Radar name="Emily Rodriguez" dataKey="Skills" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.1} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Score Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-900">High Performer</span>
                  </div>
                  <p className="text-sm text-blue-800">
                    Sarah Johnson shows exceptional performance across all categories, particularly in technical skills and problem-solving.
                  </p>
                </div>

                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="font-medium text-yellow-900">Development Opportunity</span>
                  </div>
                  <p className="text-sm text-yellow-800">
                    Emily Rodriguez has strong interpersonal skills but may benefit from additional technical training.
                  </p>
                </div>

                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-green-600" />
                    <span className="font-medium text-green-900">Balanced Candidate</span>
                  </div>
                  <p className="text-sm text-green-800">
                    Michael Chen demonstrates well-rounded capabilities with good growth potential across all areas.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Scoring Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Category Weightings</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="font-medium">Skills & Technical ({weightings.skills}%)</label>
                    </div>
                    <Slider
                      value={[weightings.skills]}
                      onValueChange={(value) => updateWeighting('skills', value)}
                      max={70}
                      step={5}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="font-medium">Behavioral Traits ({weightings.behavioural}%)</label>
                    </div>
                    <Slider
                      value={[weightings.behavioural]}
                      onValueChange={(value) => updateWeighting('behavioural', value)}
                      max={50}
                      step={5}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="font-medium">Assessment Results ({weightings.assessment}%)</label>
                    </div>
                    <Slider
                      value={[weightings.assessment]}
                      onValueChange={(value) => updateWeighting('assessment', value)}
                      max={40}
                      step={5}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="font-medium">Experience ({weightings.experience}%)</label>
                    </div>
                    <Slider
                      value={[weightings.experience]}
                      onValueChange={(value) => updateWeighting('experience', value)}
                      max={30}
                      step={5}
                    />
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between">
                      <span className="font-medium">Total Weight:</span>
                      <span className={`font-bold ${
                        Object.values(weightings).reduce((a, b) => a + b, 0) === 100 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {Object.values(weightings).reduce((a, b) => a + b, 0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-4">Threshold Settings</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-medium">Minimum Overall Score</label>
                    <Slider defaultValue={[70]} max={100} step={5} className="mt-2" />
                  </div>
                  <div>
                    <label className="font-medium">Strong Hire Threshold</label>
                    <Slider defaultValue={[85]} max={100} step={5} className="mt-2" />
                  </div>
                </div>
              </div>

              <Button className="w-full">
                Save Scoring Configuration
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}