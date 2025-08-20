import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  ArrowLeft, CheckCircle, XCircle, Edit3, Info, 
  FileText, User, Calendar, Mail, MapPin, AlertCircle,
  ThumbsUp, ThumbsDown, RotateCcw, Save
} from "lucide-react";
import { useLocation, useParams } from "wouter";

interface ScoreBreakdown {
  score: number;
  rationale: string;
  factors: Array<{
    factor: string;
    weight: number;
    score: number;
    explanation: string;
  }>;
}

interface AssessmentReviewData {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidateLocation: string;
  profilePicture?: string;
  jobTitle: string;
  company: string;
  applicationDate: string;
  
  // Detailed scoring with rationale
  overallScore: ScoreBreakdown;
  skillsScore: ScoreBreakdown;
  behavioralScore: ScoreBreakdown;
  communicationScore: ScoreBreakdown;
  
  // Assessment responses
  assessmentResponses: Array<{
    questionId: number;
    question: string;
    response: string;
    wordCount: number;
    aiAnalysis: string;
    contributingScores: string[];
  }>;
  
  // Admin status
  reviewStatus: 'pending' | 'approved' | 'amended';
  adminNotes?: string;
  amendmentHistory?: Array<{
    date: string;
    admin: string;
    changes: string;
    reason: string;
  }>;
}

export default function AdminAssessmentReviewRedesigned() {
  const { candidateId } = useParams<{ candidateId: string }>();
  const [, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  
  // Override states for each score category
  const [overrides, setOverrides] = useState<Record<string, { score: number; reason: string }>>({});
  
  const { toast } = useToast();

  // Fetch assessment review data
  const { data: assessment, isLoading } = useQuery<AssessmentReviewData>({
    queryKey: [`/api/admin/assessment-detailed/${candidateId}`],
    initialData: {
      id: "review-1",
      candidateId: candidateId || "21",
      candidateName: candidateId === "21" ? "James Mitchell" : "Lucy Brown",
      candidateEmail: candidateId === "21" ? "james.mitchell@email.com" : "lucy.brown@email.com",
      candidateLocation: candidateId === "21" ? "London, UK" : "Manchester, UK",
      profilePicture: candidateId === "21" 
        ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
        : "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      jobTitle: "Marketing Assistant",
      company: "TechFlow Solutions",
      applicationDate: "2025-01-15",
      
      overallScore: {
        score: candidateId === "21" ? 92 : 87,
        rationale: "Calculated as weighted average of skills (40%), behavioral fit (30%), communication (20%), and creativity (10%)",
        factors: [
          { factor: "Skills Assessment", weight: 40, score: candidateId === "21" ? 88 : 91, explanation: "Strong performance in digital marketing and social media tasks" },
          { factor: "Behavioral Fit", weight: 30, score: candidateId === "21" ? 95 : 84, explanation: "Excellent alignment with collaborative team environment" },
          { factor: "Communication", weight: 20, score: candidateId === "21" ? 95 : 89, explanation: "Clear, engaging responses with appropriate tone" },
          { factor: "Creativity", weight: 10, score: candidateId === "21" ? 85 : 92, explanation: "Demonstrated creative thinking in campaign strategies" }
        ]
      },
      
      skillsScore: {
        score: candidateId === "21" ? 88 : 91,
        rationale: "Based on practical task performance and knowledge demonstration",
        factors: [
          { factor: "Social Media Strategy", weight: 35, score: candidateId === "21" ? 90 : 92, explanation: "Comprehensive approach with clear audience targeting" },
          { factor: "Content Creation", weight: 30, score: candidateId === "21" ? 85 : 89, explanation: "Creative ideas with practical implementation" },
          { factor: "Analytics Understanding", weight: 25, score: candidateId === "21" ? 88 : 95, explanation: "Good grasp of key metrics and measurement" },
          { factor: "Campaign Planning", weight: 10, score: candidateId === "21" ? 90 : 88, explanation: "Structured approach to campaign development" }
        ]
      },
      
      behavioralScore: {
        score: candidateId === "21" ? 95 : 84,
        rationale: "Assessed through scenario responses and personality indicators",
        factors: [
          { factor: "Team Collaboration", weight: 40, score: candidateId === "21" ? 98 : 85, explanation: "Strong emphasis on teamwork and support" },
          { factor: "Adaptability", weight: 30, score: candidateId === "21" ? 92 : 82, explanation: "Demonstrates flexibility in approach" },
          { factor: "Initiative", weight: 20, score: candidateId === "21" ? 90 : 88, explanation: "Proactive problem-solving mindset" },
          { factor: "Cultural Alignment", weight: 10, score: candidateId === "21" ? 95 : 80, explanation: "Values align well with company culture" }
        ]
      },
      
      communicationScore: {
        score: candidateId === "21" ? 95 : 89,
        rationale: "Evaluated based on written responses and clarity of expression",
        factors: [
          { factor: "Clarity", weight: 40, score: candidateId === "21" ? 95 : 88, explanation: "Ideas expressed clearly and concisely" },
          { factor: "Engagement", weight: 30, score: candidateId === "21" ? 98 : 92, explanation: "Responses show genuine enthusiasm" },
          { factor: "Professional Tone", weight: 20, score: candidateId === "21" ? 92 : 88, explanation: "Appropriate professional communication style" },
          { factor: "Detail Level", weight: 10, score: candidateId === "21" ? 90 : 85, explanation: "Good balance of detail and conciseness" }
        ]
      },
      
      assessmentResponses: [
        {
          questionId: 1,
          question: "Describe your approach to creating a social media strategy for a new product launch.",
          response: "I would start by conducting thorough market research to understand our target audience and their social media habits. Then I'd develop a content calendar that tells a compelling story about the product, highlighting its unique benefits. I'd focus on creating engaging, shareable content across multiple platforms, with platform-specific adaptations. I'd also plan for influencer partnerships and user-generated content campaigns to build authentic buzz. Throughout the campaign, I'd monitor engagement metrics and adjust our approach based on real-time feedback.",
          wordCount: 287,
          aiAnalysis: "Response demonstrates strong strategic thinking and practical understanding of social media marketing. Shows awareness of audience research, content planning, and performance monitoring.",
          contributingScores: ["Social Media Strategy: 90%", "Campaign Planning: 90%", "Communication: 95%"]
        },
        {
          questionId: 2,
          question: "How would you measure the success of a digital marketing campaign?",
          response: "Success measurement should align with campaign objectives. For awareness campaigns, I'd track reach, impressions, and share of voice. For engagement, I'd monitor likes, comments, shares, and time spent on content. For conversion-focused campaigns, I'd measure click-through rates, conversion rates, and return on ad spend (ROAS). I'd also look at qualitative metrics like sentiment analysis and brand perception. Setting up proper attribution models and using tools like Google Analytics and social media insights would be essential for accurate measurement.",
          wordCount: 312,
          aiAnalysis: "Excellent understanding of marketing metrics and measurement frameworks. Demonstrates knowledge of both quantitative and qualitative measurement approaches.",
          contributingScores: ["Analytics Understanding: 95%", "Strategic Thinking: 88%", "Communication: 92%"]
        }
      ],
      
      reviewStatus: 'pending',
      adminNotes: "",
      amendmentHistory: []
    }
  });

  // Save review mutation
  const saveReviewMutation = useMutation({
    mutationFn: async (data: { 
      status: 'approved' | 'amended',
      notes: string,
      overrides: Record<string, { score: number; reason: string }>
    }) => {
      return await apiRequest("PUT", `/api/admin/assessment-detailed/${candidateId}`, {
        reviewStatus: data.status,
        adminNotes: data.notes,
        scoreOverrides: data.overrides,
        reviewedBy: "Holly (Admin)",
        reviewedAt: new Date().toISOString()
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/assessment-detailed/${candidateId}`] });
      toast({
        title: variables.status === 'approved' ? "Assessment approved" : "Assessment amended",
        description: `Assessment has been ${variables.status === 'approved' ? 'approved' : 'amended and saved'} successfully`,
      });
      setIsEditing(false);
      setOverrides({});
    },
  });

  const handleOverrideScore = (category: string, newScore: number, reason: string) => {
    setOverrides(prev => ({
      ...prev,
      [category]: { score: newScore, reason }
    }));
  };

  const removeOverride = (category: string) => {
    setOverrides(prev => {
      const newOverrides = { ...prev };
      delete newOverrides[category];
      return newOverrides;
    });
  };

  const handleApproveAssessment = () => {
    saveReviewMutation.mutate({ 
      status: 'approved', 
      notes: adminNotes,
      overrides: {} 
    });
  };

  const handleAmendAssessment = () => {
    if (Object.keys(overrides).length === 0) {
      toast({
        title: "No amendments made",
        description: "Please override at least one score before saving amendments.",
        variant: "destructive",
      });
      return;
    }
    
    saveReviewMutation.mutate({ 
      status: 'amended', 
      notes: adminNotes,
      overrides 
    });
  };

  const getScoreDisplay = (category: string, originalScore: number) => {
    const override = overrides[category];
    if (override) {
      return (
        <div className="flex items-center gap-2">
          <span className="line-through text-gray-400">{originalScore}%</span>
          <span className="font-bold text-orange-600">{override.score}%</span>
          <Badge className="bg-orange-100 text-orange-800">Override</Badge>
        </div>
      );
    }
    return <span className="font-bold text-green-600">{originalScore}%</span>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Assessment not found</h3>
          <p className="text-gray-600">The assessment review could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setLocation("/admin/job-applicants-grid/1")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Candidates
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Assessment Review & Scoring</h1>
                <p className="text-sm text-gray-600">
                  {assessment.candidateName} • {assessment.jobTitle} at {assessment.company}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {assessment.reviewStatus === 'pending' ? (
                <>
                  <Button
                    onClick={handleApproveAssessment}
                    disabled={saveReviewMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Approve Assessment
                  </Button>
                  <Button
                    onClick={() => setIsEditing(!isEditing)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Override Scores
                  </Button>
                </>
              ) : (
                <Badge className={
                  assessment.reviewStatus === 'approved' 
                    ? "bg-green-100 text-green-800" 
                    : "bg-orange-100 text-orange-800"
                }>
                  {assessment.reviewStatus === 'approved' ? 'Approved' : 'Amended'}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar - Candidate Info */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <img 
                    src={assessment.profilePicture || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"}
                    alt={assessment.candidateName}
                    className="w-12 h-12 rounded-full border"
                  />
                  <div>
                    <div className="font-semibold">{assessment.candidateName}</div>
                    <div className="text-sm text-gray-600 font-normal">
                      Applied {new Date(assessment.applicationDate).toLocaleDateString('en-GB')}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {assessment.candidateEmail}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {assessment.candidateLocation}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={() => setLocation(`/admin/candidate-profile/${candidateId}`)}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <User className="h-4 w-4 mr-2" />
                  View Full Profile
                </Button>
                <Button
                  onClick={() => setLocation(`/admin/job-applicants-grid/1`)}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Compare with Others
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Score Review */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Score Categories */}
            {[
              { key: 'overall', label: 'Overall Score', data: assessment.overallScore },
              { key: 'skills', label: 'Skills Score', data: assessment.skillsScore },
              { key: 'behavioral', label: 'Behavioral Score', data: assessment.behavioralScore },
              { key: 'communication', label: 'Communication Score', data: assessment.communicationScore }
            ].map(({ key, label, data }) => (
              <ScoreReviewCard
                key={key}
                category={key}
                label={label}
                scoreData={data}
                isEditing={isEditing}
                override={overrides[key]}
                onOverride={handleOverrideScore}
                onRemoveOverride={removeOverride}
                getScoreDisplay={getScoreDisplay}
              />
            ))}

            {/* Assessment Responses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Assessment Responses & Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {assessment.assessmentResponses.map((response, index) => (
                  <div key={response.questionId} className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold mb-2">Question {index + 1}</h4>
                    <p className="text-gray-700 mb-3">{response.question}</p>
                    
                    <div className="bg-gray-50 p-4 rounded-lg mb-3">
                      <p className="text-gray-800 mb-2">{response.response}</p>
                      <div className="text-xs text-gray-500">
                        {response.wordCount} words
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-3 rounded-lg mb-2">
                      <div className="text-sm font-medium text-blue-700 mb-1">AI Analysis:</div>
                      <p className="text-blue-800 text-sm">{response.aiAnalysis}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {response.contributingScores.map((score, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {score}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Admin Actions */}
            {isEditing && (
              <Card>
                <CardHeader>
                  <CardTitle>Admin Notes & Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Notes (required when amending scores)
                      </label>
                      <Textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Explain the reasoning for any score overrides..."
                        rows={3}
                      />
                    </div>
                    
                    {Object.keys(overrides).length > 0 && (
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-orange-800 mb-2">Score Overrides Summary:</h4>
                        {Object.entries(overrides).map(([category, override]) => (
                          <div key={category} className="text-sm text-orange-700 mb-1">
                            • {category}: Changed to {override.score}% - {override.reason}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex gap-3">
                      <Button 
                        onClick={handleAmendAssessment}
                        disabled={saveReviewMutation.isPending || Object.keys(overrides).length === 0}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {saveReviewMutation.isPending ? 'Saving...' : 'Save Amendments'}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setOverrides({});
                          setAdminNotes("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Score Review Card Component
function ScoreReviewCard({ 
  category, 
  label, 
  scoreData, 
  isEditing, 
  override, 
  onOverride, 
  onRemoveOverride, 
  getScoreDisplay 
}: {
  category: string;
  label: string;
  scoreData: any;
  isEditing: boolean;
  override?: { score: number; reason: string };
  onOverride: (category: string, score: number, reason: string) => void;
  onRemoveOverride: (category: string) => void;
  getScoreDisplay: (category: string, score: number) => React.ReactNode;
}) {
  const [overrideScore, setOverrideScore] = useState(override?.score || scoreData.score);
  const [overrideReason, setOverrideReason] = useState(override?.reason || "");
  const [showOverrideForm, setShowOverrideForm] = useState(false);

  const handleSaveOverride = () => {
    if (overrideScore !== scoreData.score && overrideReason.trim()) {
      onOverride(category, overrideScore, overrideReason);
      setShowOverrideForm(false);
    }
  };

  const handleCancelOverride = () => {
    setShowOverrideForm(false);
    setOverrideScore(override?.score || scoreData.score);
    setOverrideReason(override?.reason || "");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-3xl font-bold text-gray-900">
              {getScoreDisplay(category, scoreData.score)}
            </div>
            <div>
              <div className="text-lg font-semibold">{label}</div>
              <div className="text-sm text-gray-600">{scoreData.rationale}</div>
            </div>
          </div>
          
          {isEditing && !showOverrideForm && (
            <div className="flex gap-2">
              {override ? (
                <Button
                  onClick={() => onRemoveOverride(category)}
                  size="sm"
                  variant="outline"
                  className="text-orange-600 border-orange-300"
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Revert
                </Button>
              ) : (
                <Button
                  onClick={() => setShowOverrideForm(true)}
                  size="sm"
                  variant="outline"
                >
                  <Edit3 className="h-4 w-4 mr-1" />
                  Override
                </Button>
              )}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {showOverrideForm && (
          <div className="mb-6 bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h4 className="font-semibold text-orange-800 mb-3">Override Score</h4>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium mb-1">New Score (%)</label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={overrideScore}
                  onChange={(e) => setOverrideScore(parseInt(e.target.value) || 0)}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reason for Override</label>
                <Input
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="Why override this score?"
                  className="w-full"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveOverride} size="sm" disabled={!overrideReason.trim() || overrideScore === scoreData.score}>
                Save Override
              </Button>
              <Button onClick={handleCancelOverride} size="sm" variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          {scoreData.factors.map((factor: any, index: number) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
              <div className="flex-1">
                <div className="font-medium text-sm">{factor.factor}</div>
                <div className="text-xs text-gray-600">{factor.explanation}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-blue-600">{factor.score}%</div>
                <div className="text-xs text-gray-500">Weight: {factor.weight}%</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}