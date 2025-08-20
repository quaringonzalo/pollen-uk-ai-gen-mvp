import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, Target, BarChart, TrendingUp, Users, Award,
  CheckCircle, Star, Zap, Clock, ArrowRight
} from "lucide-react";

interface JobMatchingProfile {
  personality: {
    bigFive: { [key: string]: number };
    workStyle: string[];
    teamCompatibility: number;
  };
  cognitive: {
    generalAbility: number;
    specificSkills: { [key: string]: number };
    learningAgility: number;
  };
  values: {
    workValues: { [key: string]: number };
    culturalFit: { [key: string]: number };
    motivators: string[];
  };
  experience: {
    skillsProficiency: { [key: string]: number };
    verifiedCompetencies: string[];
    growthPotential: number;
  };
  behavioural: {
    situationalJudgment: { [key: string]: number };
    emotionalIntelligence: number;
    adaptability: number;
  };
}

interface JobRequirements {
  role: string;
  department: string;
  level: "entry" | "junior" | "mid" | "senior";
  required: {
    personality: { [key: string]: { min: number; max: number; weight: number } };
    cognitive: { [key: string]: { min: number; weight: number } };
    skills: { [key: string]: { required: boolean; weight: number } };
    values: { [key: string]: { importance: number; weight: number } };
  };
  preferred: {
    personality: { [key: string]: number };
    experience: { [key: string]: number };
    cultural: { [key: string]: number };
  };
  dealBreakers: string[];
  successFactors: { [key: string]: number };
}

export default function JobMatchingAlgorithmPage() {
  const [activeTab, setActiveTab] = useState("overview");

  // Enhanced matching algorithm incorporating multiple assessment dimensions
  const calculateAdvancedJobMatch = (
    candidateProfile: JobMatchingProfile,
    jobRequirements: JobRequirements
  ): { overallScore: number; breakdown: any; recommendations: string[] } => {
    
    let totalScore = 0;
    let maxPossibleScore = 0;
    const breakdown = {
      personalityFit: 0,
      cognitiveFit: 0,
      skillsMatch: 0,
      valuesAlignment: 0,
      behaviouralFit: 0,
      growthPotential: 0
    };

    // 1. Personality Fit (25% weight)
    const personalityWeight = 0.25;
    let personalityScore = 0;
    let personalityMax = 0;

    Object.entries(jobRequirements.required.personality).forEach(([trait, requirement]) => {
      const candidateScore = candidateProfile.personality.bigFive[trait] || 0;
      const normalized = Math.max(0, Math.min(100, 
        ((candidateScore - requirement.min) / (requirement.max - requirement.min)) * 100
      ));
      personalityScore += normalized * requirement.weight;
      personalityMax += 100 * requirement.weight;
    });

    breakdown.personalityFit = personalityMax > 0 ? (personalityScore / personalityMax) * 100 : 0;
    totalScore += breakdown.personalityFit * personalityWeight;
    maxPossibleScore += 100 * personalityWeight;

    // 2. Cognitive Ability Fit (20% weight)
    const cognitiveWeight = 0.20;
    let cognitiveScore = 0;
    let cognitiveMax = 0;

    Object.entries(jobRequirements.required.cognitive).forEach(([ability, requirement]) => {
      const candidateScore = candidateProfile.cognitive.specificSkills[ability] || 0;
      const score = candidateScore >= requirement.min ? 100 : (candidateScore / requirement.min) * 100;
      cognitiveScore += score * requirement.weight;
      cognitiveMax += 100 * requirement.weight;
    });

    breakdown.cognitiveFit = cognitiveMax > 0 ? (cognitiveScore / cognitiveMax) * 100 : 0;
    totalScore += breakdown.cognitiveFit * cognitiveWeight;
    maxPossibleScore += 100 * cognitiveWeight;

    // 3. Skills Match (25% weight)
    const skillsWeight = 0.25;
    let skillsScore = 0;
    let skillsMax = 0;

    Object.entries(jobRequirements.required.skills).forEach(([skill, requirement]) => {
      const candidateLevel = candidateProfile.experience.skillsProficiency[skill] || 0;
      const hasVerified = candidateProfile.experience.verifiedCompetencies.includes(skill);
      const score = candidateLevel * (hasVerified ? 1.2 : 1.0); // Bonus for verified skills
      skillsScore += Math.min(100, score) * requirement.weight;
      skillsMax += 100 * requirement.weight;
    });

    breakdown.skillsMatch = skillsMax > 0 ? (skillsScore / skillsMax) * 100 : 0;
    totalScore += breakdown.skillsMatch * skillsWeight;
    maxPossibleScore += 100 * skillsWeight;

    // 4. Values Alignment (15% weight)
    const valuesWeight = 0.15;
    let valuesScore = 0;
    let valuesMax = 0;

    Object.entries(jobRequirements.required.values).forEach(([value, requirement]) => {
      const candidateValue = candidateProfile.values.workValues[value] || 0;
      const alignment = 100 - Math.abs(candidateValue - requirement.importance) * 20;
      valuesScore += Math.max(0, alignment) * requirement.weight;
      valuesMax += 100 * requirement.weight;
    });

    breakdown.valuesAlignment = valuesMax > 0 ? (valuesScore / valuesMax) * 100 : 0;
    totalScore += breakdown.valuesAlignment * valuesWeight;
    maxPossibleScore += 100 * valuesWeight;

    // 5. Behavioral Fit (10% weight)
    const behaviouralWeight = 0.10;
    const behaviouralScore = (
      candidateProfile.behavioural.emotionalIntelligence * 0.4 +
      candidateProfile.behavioural.adaptability * 0.3 +
      Object.values(candidateProfile.behavioural.situationalJudgment).reduce((sum, score) => sum + score, 0) / Object.keys(candidateProfile.behavioural.situationalJudgment).length * 0.3
    );

    breakdown.behaviouralFit = behaviouralScore;
    totalScore += breakdown.behaviouralFit * behaviouralWeight;
    maxPossibleScore += 100 * behaviouralWeight;

    // 6. Growth Potential (5% weight)
    const growthWeight = 0.05;
    breakdown.growthPotential = candidateProfile.experience.growthPotential;
    totalScore += breakdown.growthPotential * growthWeight;
    maxPossibleScore += 100 * growthWeight;

    const overallScore = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;

    // Generate recommendations based on gaps
    const recommendations = generateRecommendations(breakdown, jobRequirements);

    return { overallScore, breakdown, recommendations };
  };

  const generateRecommendations = (breakdown: any, jobRequirements: JobRequirements): string[] => {
    const recommendations = [];
    
    if (breakdown.skillsMatch < 70) {
      recommendations.push("Consider completing additional skills challenges to improve your technical competency score");
    }
    
    if (breakdown.personalityFit < 60) {
      recommendations.push("This role may not align with your natural working style - explore similar roles in different environments");
    }
    
    if (breakdown.valuesAlignment < 65) {
      recommendations.push("Research the company culture more thoroughly to ensure alignment with your work values");
    }
    
    if (breakdown.cognitiveFit < 75) {
      recommendations.push("Practice logical reasoning and problem-solving exercises to strengthen your cognitive assessment performance");
    }
    
    if (breakdown.behaviouralFit < 70) {
      recommendations.push("Develop your emotional intelligence and adaptability through targeted learning resources");
    }

    return recommendations;
  };

  // Mock data for demonstration
  const candidateProfile: JobMatchingProfile = {
    personality: {
      bigFive: { extraversion: 65, agreeableness: 78, conscientiousness: 82, neuroticism: 35, openness: 88 },
      workStyle: ["collaborative", "detail-oriented", "innovative"],
      teamCompatibility: 85
    },
    cognitive: {
      generalAbility: 78,
      specificSkills: { logical_reasoning: 72, numerical_reasoning: 85, verbal_reasoning: 90 },
      learningAgility: 88
    },
    values: {
      workValues: { autonomy: 4, achievement: 5, security: 3, variety: 4, helping: 5 },
      culturalFit: { innovation: 85, collaboration: 90, work_life_balance: 75 },
      motivators: ["growth", "impact", "recognition"]
    },
    experience: {
      skillsProficiency: { javascript: 75, react: 80, communication: 85, problem_solving: 78 },
      verifiedCompetencies: ["javascript", "communication"],
      growthPotential: 85
    },
    behavioural: {
      situationalJudgment: { teamwork: 82, customer_service: 75, leadership: 68 },
      emotionalIntelligence: 78,
      adaptability: 85
    }
  };

  const sampleJobs = [
    {
      title: "Frontend Developer",
      company: "TechStart Inc",
      requirements: {
        role: "Frontend Developer",
        department: "Engineering",
        level: "entry" as const,
        required: {
          personality: {
            conscientiousness: { min: 60, max: 95, weight: 1.0 },
            openness: { min: 70, max: 100, weight: 0.8 }
          },
          cognitive: {
            logical_reasoning: { min: 65, weight: 1.0 },
            numerical_reasoning: { min: 60, weight: 0.6 }
          },
          skills: {
            javascript: { required: true, weight: 1.0 },
            react: { required: true, weight: 0.8 },
            problem_solving: { required: true, weight: 0.9 }
          },
          values: {
            achievement: { importance: 4, weight: 1.0 },
            variety: { importance: 4, weight: 0.7 }
          }
        },
        preferred: {
          personality: { extraversion: 60 },
          experience: { teamwork: 70 },
          cultural: { innovation: 80 }
        },
        dealBreakers: [],
        successFactors: { technical_skills: 0.4, problem_solving: 0.3, teamwork: 0.3 }
      }
    }
  ];

  const jobMatch = calculateAdvancedJobMatch(candidateProfile, sampleJobs[0].requirements);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Advanced Job Matching Algorithm</h1>
          <p className="text-lg text-gray-600">
            Multi-dimensional assessment and matching system for accurate job compatibility
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Algorithm Overview</TabsTrigger>
            <TabsTrigger value="assessment">Assessment Dimensions</TabsTrigger>
            <TabsTrigger value="matching">Match Results</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-6 h-6" />
                  Enhanced Matching Algorithm
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Assessment Components</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Personality Assessment (Big Five)</span>
                        <Badge>25% Weight</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Cognitive Ability Testing</span>
                        <Badge>20% Weight</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Skills Verification</span>
                        <Badge>25% Weight</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Values Alignment</span>
                        <Badge>15% Weight</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Behavioral Assessment</span>
                        <Badge>10% Weight</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Growth Potential</span>
                        <Badge>5% Weight</Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Matching Features</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Multi-factor personality matching</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Cognitive ability thresholds</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Verified skills bonus scoring</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Cultural and values alignment</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Situational judgment evaluation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Growth potential assessment</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assessment" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    Personality (Big Five)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(candidateProfile.personality.bigFive).map(([trait, score]) => (
                      <div key={trait}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm capitalize">{trait.replace('_', ' ')}</span>
                          <span className="text-sm font-medium">{score}%</span>
                        </div>
                        <Progress value={score} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Cognitive Abilities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(candidateProfile.cognitive.specificSkills).map(([skill, score]) => (
                      <div key={skill}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm capitalize">{skill.replace('_', ' ')}</span>
                          <span className="text-sm font-medium">{score}%</span>
                        </div>
                        <Progress value={score} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Work Values
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(candidateProfile.values.workValues).map(([value, rating]) => (
                      <div key={value}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm capitalize">{value}</span>
                          <span className="text-sm font-medium">{rating}/5</span>
                        </div>
                        <Progress value={rating * 20} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="matching" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="w-6 h-6" />
                  Job Match Analysis: {sampleJobs[0].title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-green-600 mb-2">
                        {Math.round(jobMatch.overallScore)}%
                      </div>
                      <div className="text-gray-600">Overall Match Score</div>
                    </div>
                    
                    <div className="space-y-4">
                      {Object.entries(jobMatch.breakdown).map(([category, score]) => (
                        <div key={category}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <span className="text-sm font-medium">{Math.round(score as number)}%</span>
                          </div>
                          <Progress value={score as number} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Match Strengths</h3>
                    <div className="space-y-2 mb-6">
                      {Object.entries(jobMatch.breakdown)
                        .filter(([_, score]) => (score as number) >= 80)
                        .map(([category]) => (
                          <div key={category} className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</span>
                          </div>
                        ))
                      }
                    </div>

                    <h3 className="font-semibold mb-3">Areas for Development</h3>
                    <div className="space-y-2">
                      {Object.entries(jobMatch.breakdown)
                        .filter(([_, score]) => (score as number) < 70)
                        .map(([category]) => (
                          <div key={category} className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-blue-500" />
                            <span className="text-sm capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</span>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-6 h-6" />
                  Personalised Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobMatch.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                      <ArrowRight className="w-5 h-5 text-blue-600 mt-0.5" />
                      <span className="text-sm">{recommendation}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold mb-3">Next Steps</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Button className="w-full">
                      <Award className="w-4 h-4 mr-2" />
                      Complete Skills Challenges
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Users className="w-4 h-4 mr-2" />
                      Explore Similar Roles
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}