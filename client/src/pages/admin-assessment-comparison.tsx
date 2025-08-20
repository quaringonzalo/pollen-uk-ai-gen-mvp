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
  ArrowLeft, CheckCircle, Edit3, Save, User, Mail, MapPin,
  ThumbsUp, RotateCcw, FileText, Eye
} from "lucide-react";
import { useLocation, useParams } from "wouter";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface CandidateAssessment {
  id: string;
  name: string;
  email: string;
  location: string;
  profilePicture?: string;
  applicationDate: string;
  
  // Skills scores
  overallSkillsScore: number;
  technicalSkills: number;
  problemSolving: number;
  communication: number;
  creativity: number;
  
  // Admin review
  reviewStatus: 'pending' | 'approved' | 'amended';
  adminNotes?: string;
  hasOverrides?: boolean;
}

interface ScoreOverride {
  candidateId: string;
  overallSkillsScore?: number;
  technicalSkills?: number;
  problemSolving?: number;
  communication?: number;
  creativity?: number;
  reason: string;
}

export default function AdminAssessmentComparison() {
  const { jobId } = useParams<{ jobId: string }>();
  const [, setLocation] = useLocation();
  const [editingMode, setEditingMode] = useState(false);
  const [overrides, setOverrides] = useState<Record<string, ScoreOverride>>({});
  const [bulkAction, setBulkAction] = useState<'approve' | 'amend' | null>(null);
  const { toast } = useToast();

  // Fetch all candidates' assessment data
  const { data: candidates = [], isLoading } = useQuery<CandidateAssessment[]>({
    queryKey: [`/api/admin/job-assessments/${jobId}`],
    initialData: [
      {
        id: "21",
        name: "James Mitchell",
        email: "james.mitchell@email.com",
        location: "London, UK",
        profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        applicationDate: "2025-01-15",
        overallSkillsScore: 88,
        technicalSkills: 85,
        problemSolving: 90,
        communication: 95,
        creativity: 82,
        reviewStatus: 'pending',
        adminNotes: "",
        hasOverrides: false
      },
      {
        id: "30",
        name: "Lucy Brown",
        email: "lucy.brown@email.com",
        location: "Manchester, UK", 
        profilePicture: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
        applicationDate: "2025-01-14",
        overallSkillsScore: 91,
        technicalSkills: 88,
        problemSolving: 95,
        communication: 89,
        creativity: 92,
        reviewStatus: 'pending',
        adminNotes: "",
        hasOverrides: false
      },
      {
        id: "15",
        name: "Alex Chen",
        email: "alex.chen@email.com",
        location: "Birmingham, UK",
        profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        applicationDate: "2025-01-13",
        overallSkillsScore: 82,
        technicalSkills: 80,
        problemSolving: 85,
        communication: 85,
        creativity: 78,
        reviewStatus: 'pending',
        adminNotes: "",
        hasOverrides: false
      },
      {
        id: "8",
        name: "Sophie Williams",
        email: "sophie.williams@email.com",
        location: "Leeds, UK",
        profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        applicationDate: "2025-01-12",
        overallSkillsScore: 79,
        technicalSkills: 75,
        problemSolving: 82,
        communication: 86,
        creativity: 74,
        reviewStatus: 'pending', 
        adminNotes: "",
        hasOverrides: false
      }
    ]
  });

  // Save assessment reviews mutation
  const saveReviewsMutation = useMutation({
    mutationFn: async (data: { 
      action: 'approve_all' | 'amend_selected',
      overrides: Record<string, ScoreOverride>
    }) => {
      return await apiRequest("PUT", `/api/admin/job-assessments/${jobId}/bulk-review`, {
        action: data.action,
        overrides: data.overrides,
        reviewedBy: "Holly (Admin)",
        reviewedAt: new Date().toISOString()
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/admin/job-assessments/${jobId}`] });
      toast({
        title: variables.action === 'approve_all' ? "All assessments approved" : "Assessment overrides saved",
        description: `Assessment reviews have been processed successfully`,
      });
      setEditingMode(false);
      setOverrides({});
      setBulkAction(null);
    },
  });

  const handleScoreOverride = (candidateId: string, field: keyof Omit<ScoreOverride, 'candidateId' | 'reason'>, value: number) => {
    setOverrides(prev => ({
      ...prev,
      [candidateId]: {
        ...prev[candidateId],
        candidateId,
        [field]: value,
        reason: prev[candidateId]?.reason || ""
      }
    }));
  };

  const handleReasonChange = (candidateId: string, reason: string) => {
    setOverrides(prev => ({
      ...prev,
      [candidateId]: {
        ...prev[candidateId],
        candidateId,
        reason
      }
    }));
  };

  const removeOverride = (candidateId: string) => {
    setOverrides(prev => {
      const newOverrides = { ...prev };
      delete newOverrides[candidateId];
      return newOverrides;
    });
  };

  const handleApproveAll = () => {
    saveReviewsMutation.mutate({ 
      action: 'approve_all',
      overrides: {}
    });
  };

  const handleSaveAmendments = () => {
    const hasOverrides = Object.keys(overrides).length > 0;
    const allHaveReasons = Object.values(overrides).every(override => override.reason.trim());
    
    if (!hasOverrides) {
      toast({
        title: "No changes made",
        description: "Please override at least one score before saving amendments.",
        variant: "destructive",
      });
      return;
    }

    if (!allHaveReasons) {
      toast({
        title: "Missing reasons",
        description: "Please provide a reason for all score overrides.",
        variant: "destructive",
      });
      return;
    }
    
    saveReviewsMutation.mutate({ 
      action: 'amend_selected',
      overrides
    });
  };

  const getScoreDisplay = (candidateId: string, field: keyof CandidateAssessment, originalScore: number) => {
    const override = overrides[candidateId];
    const overrideValue = override?.[field as keyof ScoreOverride] as number;
    
    if (overrideValue !== undefined && overrideValue !== originalScore) {
      return (
        <div className="text-center">
          <div className="line-through text-gray-400 text-sm">{originalScore}%</div>
          <div className="font-bold text-orange-600">{overrideValue}%</div>
        </div>
      );
    }
    return <div className="text-center font-medium">{originalScore}%</div>;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800";
    if (score >= 80) return "bg-blue-100 text-blue-800";
    if (score >= 70) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
                <h1 className="text-2xl font-bold text-gray-900">Assessment Score Comparison</h1>
                <p className="text-sm text-gray-600">
                  Marketing Assistant at TechFlow Solutions • Compare and review all candidate scores
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {!editingMode ? (
                <>
                  <Button
                    onClick={handleApproveAll}
                    disabled={saveReviewsMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    Approve All Scores
                  </Button>
                  <Button
                    onClick={() => setEditingMode(true)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Override Scores
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleSaveAmendments}
                    disabled={saveReviewsMutation.isPending}
                    className="bg-orange-600 hover:bg-orange-700"
                    size="sm"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Overrides
                  </Button>
                  <Button
                    onClick={() => {
                      setEditingMode(false);
                      setOverrides({});
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Score Comparison Table */}
        <Card>
          <CardHeader>
            <CardTitle>Skills Assessment Score Comparison</CardTitle>
            <p className="text-sm text-gray-600">
              Review and compare all candidate assessment scores. Scores are weighted: Technical (30%), Problem Solving (30%), Communication (25%), Creativity (15%).
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px] sticky left-0 bg-white">Candidate</TableHead>
                    <TableHead className="text-center w-[120px]">Overall Score</TableHead>
                    <TableHead className="text-center w-[120px]">Technical Skills</TableHead>
                    <TableHead className="text-center w-[120px]">Problem Solving</TableHead>
                    <TableHead className="text-center w-[120px]">Communication</TableHead>
                    <TableHead className="text-center w-[120px]">Creativity</TableHead>
                    <TableHead className="text-center w-[100px]">Status</TableHead>
                    <TableHead className="text-center w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {candidates.map((candidate) => (
                    <TableRow key={candidate.id} className="hover:bg-gray-50">
                      {/* Candidate Info - Sticky */}
                      <TableCell className="sticky left-0 bg-white">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={candidate.profilePicture}
                            alt={candidate.name}
                            className="w-10 h-10 rounded-full border"
                          />
                          <div>
                            <div className="font-medium text-sm">{candidate.name}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(candidate.applicationDate).toLocaleDateString('en-GB', { 
                                day: '2-digit', 
                                month: 'short' 
                              })}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      
                      {/* Scores */}
                      <TableCell>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${getScoreColor(candidate.overallSkillsScore)}`}>
                          {getScoreDisplay(candidate.id, 'overallSkillsScore', candidate.overallSkillsScore)}
                        </div>
                        {editingMode && (
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={overrides[candidate.id]?.overallSkillsScore || candidate.overallSkillsScore}
                            onChange={(e) => handleScoreOverride(candidate.id, 'overallSkillsScore', parseInt(e.target.value) || candidate.overallSkillsScore)}
                            className="mt-2 w-20 text-xs"
                          />
                        )}
                      </TableCell>
                      
                      <TableCell>
                        {getScoreDisplay(candidate.id, 'technicalSkills', candidate.technicalSkills)}
                        {editingMode && (
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={overrides[candidate.id]?.technicalSkills || candidate.technicalSkills}
                            onChange={(e) => handleScoreOverride(candidate.id, 'technicalSkills', parseInt(e.target.value) || candidate.technicalSkills)}
                            className="mt-2 w-20 text-xs"
                          />
                        )}
                      </TableCell>
                      
                      <TableCell>
                        {getScoreDisplay(candidate.id, 'problemSolving', candidate.problemSolving)}
                        {editingMode && (
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={overrides[candidate.id]?.problemSolving || candidate.problemSolving}
                            onChange={(e) => handleScoreOverride(candidate.id, 'problemSolving', parseInt(e.target.value) || candidate.problemSolving)}
                            className="mt-2 w-20 text-xs"
                          />
                        )}
                      </TableCell>
                      
                      <TableCell>
                        {getScoreDisplay(candidate.id, 'communication', candidate.communication)}
                        {editingMode && (
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={overrides[candidate.id]?.communication || candidate.communication}
                            onChange={(e) => handleScoreOverride(candidate.id, 'communication', parseInt(e.target.value) || candidate.communication)}
                            className="mt-2 w-20 text-xs"
                          />
                        )}
                      </TableCell>
                      
                      <TableCell>
                        {getScoreDisplay(candidate.id, 'creativity', candidate.creativity)}
                        {editingMode && (
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={overrides[candidate.id]?.creativity || candidate.creativity}
                            onChange={(e) => handleScoreOverride(candidate.id, 'creativity', parseInt(e.target.value) || candidate.creativity)}
                            className="mt-2 w-20 text-xs"
                          />
                        )}
                      </TableCell>
                      
                      {/* Status */}
                      <TableCell className="text-center">
                        <Badge className={
                          candidate.reviewStatus === 'approved' 
                            ? "bg-green-100 text-green-800" 
                            : candidate.reviewStatus === 'amended'
                            ? "bg-orange-100 text-orange-800"
                            : "bg-gray-100 text-gray-800"
                        }>
                          {candidate.reviewStatus}
                        </Badge>
                        {overrides[candidate.id] && (
                          <Badge className="bg-orange-100 text-orange-800 mt-1">
                            Override
                          </Badge>
                        )}
                      </TableCell>
                      
                      {/* Actions */}
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setLocation(`/admin/candidate-profile/${candidate.id}`)}
                            className="h-8 w-8 p-0"
                            title="View profile"
                          >
                            <User className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setLocation(`/admin/assessment-review/${candidate.id}`)}
                            className="h-8 w-8 p-0"
                            title="View responses"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          {overrides[candidate.id] && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeOverride(candidate.id)}
                              className="h-8 w-8 p-0 text-orange-600"
                              title="Remove override"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Override Reasons Section */}
        {editingMode && Object.keys(overrides).length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Override Reasons (Required)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(overrides).map(([candidateId, override]) => {
                  const candidate = candidates.find(c => c.id === candidateId);
                  return (
                    <div key={candidateId} className="border-l-4 border-orange-500 pl-4">
                      <div className="font-medium mb-2">{candidate?.name}</div>
                      <Textarea
                        value={override.reason}
                        onChange={(e) => handleReasonChange(candidateId, e.target.value)}
                        placeholder="Why are you overriding this candidate's scores?"
                        rows={2}
                        className="w-full"
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{candidates.length}</div>
              <div className="text-sm text-gray-600">Total Candidates</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(candidates.reduce((sum, c) => sum + c.overallSkillsScore, 0) / candidates.length)}%
              </div>
              <div className="text-sm text-gray-600">Average Overall Score</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Object.keys(overrides).length}
              </div>
              <div className="text-sm text-gray-600">Score Overrides</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {candidates.filter(c => c.reviewStatus === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending Review</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}