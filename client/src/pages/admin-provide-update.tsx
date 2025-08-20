import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, User, CheckCircle, XCircle, MessageSquare, Calendar, Star, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function AdminProvideUpdate() {
  const [, setLocation] = useLocation();
  const candidateId = window.location.pathname.split('/').pop();
  
  // Decision flow states
  const [decision, setDecision] = useState<'not_progressing' | 'match_to_employer' | ''>('');
  const [feedbackComments, setFeedbackComments] = useState("");
  
  // Scoring states (only for not_progressing)
  const [pollenScores, setPollenScores] = useState({
    communication: 0,
    roleUnderstanding: 0,
    valuesAlignment: 0,
    overallPerformance: 0
  });
  
  // Admin assessment notes (for progressing candidates)
  const [adminAssessmentNotes, setAdminAssessmentNotes] = useState("");
  const [interviewSummary, setInterviewSummary] = useState("");
  const [generatedAssessment, setGeneratedAssessment] = useState("");
  const [isGeneratingAssessment, setIsGeneratingAssessment] = useState(false);
  const [isEditingAssessment, setIsEditingAssessment] = useState(false);
  
  // Confirmation dialog state
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Mock candidate data based on ID
  const getCandidateData = () => {
    if (candidateId === "21") {
      return {
        id: candidateId,
        name: "James Mitchell",
        email: "james.mitchell@email.com",
        location: "Manchester, UK",
        phone: "+44 7123 456789",
        profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        currentStatus: "in_progress",
        subStatus: "pollen_interview_complete",
        jobTitle: "Social Media Marketing Assistant",
        company: "K7 Media Group",
        pollenInterviewDate: "2024-12-15",
        pollenInterviewer: "Karen Whitelaw",
        interviewScore: 85,
        interviewNotes: "Strong performance in behavioral assessment. Shows excellent communication skills and cultural fit. Ready for employer matching.",
        keyStrengths: ["Creative problem-solving", "Strong communication", "Team collaboration", "Adaptability"],
        developmentAreas: ["Time management", "Technical knowledge of analytics tools"]
      };
    }
    if (candidateId === "35") {
      return {
        id: candidateId,
        name: "Grace Thompson",
        email: "grace.thompson@email.com",
        location: "Newcastle, UK",
        currentStatus: "in_progress", 
        subStatus: "pollen_interview_complete",
        jobTitle: "Marketing Assistant",
        company: "TechFlow Solutions"
      };
    }
    // Default fallback with proper name
    return {
      id: candidateId,
      name: `Candidate ${candidateId}`,
      email: "candidate@email.com",
      location: "UK",
      currentStatus: "in_progress",
      subStatus: "pollen_interview_complete",
      jobTitle: "Marketing Assistant",
      company: "K7 Media Group"
    };
  };

  const candidate = getCandidateData();

  // Score handling for Pollen interview scores
  const handleScoreChange = (category: keyof typeof pollenScores, value: number) => {
    setPollenScores(prev => {
      const newScores = { ...prev, [category]: value };
      
      // Auto-calculate overall performance from the 3 core areas
      if (category !== 'overallPerformance') {
        const { communication, roleUnderstanding, valuesAlignment } = newScores;
        if (communication > 0 && roleUnderstanding > 0 && valuesAlignment > 0) {
          newScores.overallPerformance = Math.round((communication + roleUnderstanding + valuesAlignment) / 3);
        }
      }
      
      return newScores;
    });
  };

  const getScoreLabel = (score: number) => {
    switch(score) {
      case 0: return 'Not Rated';
      case 1: return 'Poor';
      case 2: return 'Below Average';
      case 3: return 'Average';
      case 4: return 'Strong';
      case 5: return 'Excellent';
      default: return 'Not Rated';
    }
  };

  const getScoreColor = (score: number) => {
    if (score === 0) return 'text-gray-400';
    if (score >= 4) return 'text-green-600';
    if (score >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleSubmitUpdate = () => {
    if (!decision) {
      toast({
        title: "Decision Required",
        description: "Please select a decision before submitting.",
        variant: "destructive"
      });
      return;
    }

    // Validate scores for both paths
    if (Object.values(pollenScores).slice(0, 3).some(score => score === 0)) {
      toast({
        title: "Scores Required",
        description: "Please provide all Pollen interview scores (Communication, Role Understanding, Values Alignment).",
        variant: "destructive"
      });
      return;
    }

    if (decision === "not_progressing") {
      if (!feedbackComments.trim() || feedbackComments.trim().length < 50) {
        toast({
          title: "Feedback Required",
          description: "Please provide detailed feedback (minimum 50 characters) when not progressing a candidate.",
          variant: "destructive"
        });
        return;
      }
    }

    if (decision === "match_to_employer") {
      if (!adminAssessmentNotes.trim()) {
        toast({
          title: "Assessment Notes Required", 
          description: "Please provide admin assessment notes for the Pollen Team Assessment when matching to employer.",
          variant: "destructive"
        });
        return;
      }
      
      if (!interviewSummary.trim()) {
        toast({
          title: "Interview Summary Required", 
          description: "Please provide an interview summary when matching to employer.",
          variant: "destructive"
        });
        return;
      }
    }

    // Show confirmation dialog
    setShowConfirmDialog(true);
  };

  const generatePollenAssessment = async () => {
    if (!adminAssessmentNotes.trim()) {
      toast({
        title: "Notes Required",
        description: "Please add assessment notes before generating the Pollen Assessment.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingAssessment(true);
    
    try {
      const response = await fetch('/api/generate-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          candidateName: candidate.name,
          jobTitle: candidate.jobTitle,
          company: candidate.company,
          assessmentNotes: adminAssessmentNotes,
          interviewSummary: interviewSummary,
          scores: {
            communication: pollenScores.communication,
            roleUnderstanding: pollenScores.roleUnderstanding,
            valuesAlignment: pollenScores.valuesAlignment,
            overall: pollenScores.overallPerformance
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate assessment');
      }

      const data = await response.json();
      setGeneratedAssessment(data.assessment);
      
      toast({
        title: "Assessment Generated",
        description: "Professional Pollen Team Assessment has been created from your notes.",
      });
    } catch (error) {
      console.error('Error generating assessment:', error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate assessment. Please ensure OpenAI API key is configured.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingAssessment(false);
    }
  };

  const handleConfirmSubmit = async () => {
    try {
      const requestData = {
        decision,
        pollenScores,
        feedbackComments: decision === 'not_progressing' ? feedbackComments : '',
        adminAssessmentNotes: decision === 'match_to_employer' ? adminAssessmentNotes : '',
        interviewSummary: decision === 'match_to_employer' ? interviewSummary : '',
        generatedAssessment: decision === 'match_to_employer' ? generatedAssessment : ''
      };

      console.log('🚀 Submitting update for candidate:', candidateId);
      console.log('📝 Request data:', requestData);
      
      const url = `/api/admin/candidates/${candidateId}/update`;
      console.log('🌐 Request URL:', url);

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ Error response:', errorText);
        throw new Error(`Request failed with status ${response.status}: ${errorText}`);
      }

      const responseData = await response.json();
      console.log('✅ Success response:', responseData);

      toast({
        title: "Update Submitted",
        description: `${candidate.name}'s status has been updated successfully.`,
      });

      // Close dialog first
      setShowConfirmDialog(false);
      
      // Navigate to candidate timeline with success message
      if (decision === 'match_to_employer') {
        setLocation(`/admin/candidate-action-timeline/${candidateId}?success=match&candidate=${encodeURIComponent(candidate.name)}&employer=${encodeURIComponent(candidate.company)}`);
      } else {
        setLocation("/admin/job-applicants-grid/1");
      }
    } catch (error) {
      console.error('❌ Error submitting update:', error);
      toast({
        title: "Submission Failed",
        description: `Unable to submit update: ${error.message}`,
        variant: "destructive"
      });
      setShowConfirmDialog(false);
    }
  };

  // Form validation
  const isFormValid = decision !== '' && 
    Object.values(pollenScores).slice(0, 3).every(score => score > 0) &&
    (decision === 'not_progressing' ? 
      (feedbackComments.trim() !== '' &&
       feedbackComments.trim().length >= 50) : true) &&
    (decision === 'match_to_employer' ? 
      (adminAssessmentNotes.trim() !== '' && interviewSummary.trim() !== '') : true);

  return (
    <>
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLocation("/admin/job-applicants-grid/1")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Candidates
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Update Required</h1>
            <p className="text-gray-600">Decide next steps for {candidate.name}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Candidate Summary */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold" style={{fontFamily: 'Sora'}}>
                    {candidate.name}
                  </h2>
                  <p className="text-gray-600 mt-1">Applied for: {candidate.jobTitle}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <Badge className="bg-blue-100 text-blue-800">Assessment Review Required</Badge>
                    <span className="text-sm text-gray-600">
                      {candidate.pollenInterviewDate && `Interview: ${candidate.pollenInterviewDate}`}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Company: {candidate.company} • Location: {candidate.location}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Decision Section - First Priority */}
          <Card>
            <CardHeader>
              <CardTitle style={{fontFamily: 'Sora'}}>Next Steps Decision</CardTitle>
              <p className="text-sm text-gray-600">Choose the appropriate next step for this candidate</p>
            </CardHeader>
            <CardContent>
              <RadioGroup value={decision} onValueChange={(value) => setDecision(value as 'not_progressing' | 'match_to_employer' | '')} className="space-y-4">
                {/* Not Proceeding */}
                <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="not_progressing" id="not_progressing" />
                    <div className="flex-1">
                      <label htmlFor="not_progressing" className="flex items-center gap-3 cursor-pointer">
                        <XCircle className="w-5 h-5 text-red-500" />
                        <div>
                          <div className="font-medium">Not Progressing</div>
                          <div className="text-sm text-gray-600">
                            Candidate does not meet requirements for this role or employer matching
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Match to Employer */}
                <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="match_to_employer" id="match_to_employer" />
                    <div className="flex-1">
                      <label htmlFor="match_to_employer" className="flex items-center gap-3 cursor-pointer">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <div>
                          <div className="font-medium">Match to Employer</div>
                          <div className="text-sm text-gray-600">
                            Candidate passes Pollen assessment and is ready for employer review
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Pollen Interview Scores - Required for both decisions */}
          {decision && (
            <Card>
              <CardHeader>
                <CardTitle style={{fontFamily: 'Sora'}}>Pollen Team Interview Performance</CardTitle>
                <p className="text-sm text-gray-600">Rate performance across key areas (1-5 scale) - All ratings required</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { key: 'communication' as keyof typeof pollenScores, label: 'Communication Rapport' },
                  { key: 'roleUnderstanding' as keyof typeof pollenScores, label: 'Role Understanding' },
                  { key: 'valuesAlignment' as keyof typeof pollenScores, label: 'Values Alignment' }
                ].map(({ key, label }) => (
                  <div key={key} className="space-y-3">
                    <Label className="text-base font-medium">{label}</Label>
                    <div className="flex items-center gap-4">
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(score => (
                          <button
                            key={score}
                            onClick={() => handleScoreChange(key, score)}
                            className={`w-8 h-8 rounded-full border-2 text-sm font-medium transition-colors ${
                              pollenScores[key] === score
                                ? 'border-pink-600 bg-pink-600 text-white'
                                : 'border-gray-300 hover:border-pink-300'
                            }`}
                          >
                            {score}
                          </button>
                        ))}
                      </div>
                      <span className={`font-medium ${getScoreColor(pollenScores[key])}`}>
                        {getScoreLabel(pollenScores[key])}
                      </span>
                    </div>
                  </div>
                ))}
                
                {/* Overall Score - Auto-calculated */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <Label className="text-base font-medium">Overall Score</Label>
                  <div className="flex items-center gap-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {pollenScores.overallPerformance > 0 ? `${Math.round((pollenScores.overallPerformance / 5) * 100)}%` : '--%'}
                    </div>
                    <span className={`font-medium ${getScoreColor(pollenScores.overallPerformance)}`}>
                      {getScoreLabel(pollenScores.overallPerformance)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Automatically calculated from the 3 core assessment areas</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Feedback/Notes Section */}
          <Card>
            <CardHeader>
              <CardTitle style={{fontFamily: 'Sora'}}>
                {decision === 'not_progressing' ? 'Candidate Feedback' : 
                 decision === 'match_to_employer' ? 'Pollen Team Assessment Notes' : 'Additional Notes'}
              </CardTitle>
              <p className="text-sm text-gray-600">
                {decision === 'not_progressing' 
                  ? 'Provide detailed feedback for the candidate (minimum 50 characters)'
                  : decision === 'match_to_employer'
                  ? 'Your notes will feed into the AI-generated Pollen Team Assessment for employers'
                  : 'Add any relevant notes or observations'}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {decision === 'not_progressing' && (
                <Textarea
                  value={feedbackComments}
                  onChange={(e) => setFeedbackComments(e.target.value)}
                  placeholder="Provide constructive feedback explaining areas for improvement, specific examples from the interview, and recommendations for future development..."
                  className="min-h-[120px]"
                />
              )}
              
              {decision === 'match_to_employer' && (
                <>
                  <div>
                    <Label className="text-sm font-medium">Interview Summary</Label>
                    <Textarea
                      value={interviewSummary}
                      onChange={(e) => setInterviewSummary(e.target.value)}
                      placeholder="Provide a brief summary of the interview highlights, key observations about the candidate's enthusiasm, questions they asked, and overall impression..."
                      className="min-h-[100px] mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium">Assessment Notes</Label>
                    <p className="text-xs text-gray-500 mt-1 mb-2">
                      Bullet-point observations about the candidate as a person - interests, background, motivations, personality, etc.
                    </p>
                    <Textarea
                      value={adminAssessmentNotes}
                      onChange={(e) => setAdminAssessmentNotes(e.target.value)}
                      placeholder="Input your raw interview observations as bullet points - personal interests, background, motivations, personality traits, specific questions they asked, etc. The AI will convert these into a professional assessment."
                      className="min-h-[140px] mt-2 font-mono text-sm"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={generatePollenAssessment}
                      disabled={isGeneratingAssessment || !adminAssessmentNotes.trim()}
                      className="text-xs"
                    >
                      {isGeneratingAssessment ? "Generating..." : "Generate Assessment"}
                    </Button>
                  </div>
                  
                  {/* Generated Assessment Display */}
                  {generatedAssessment && (
                    <div className="mt-4 border border-green-200 bg-green-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <Label className="text-sm font-medium text-green-800">Generated Pollen Team Assessment</Label>
                        <Badge variant="outline" className="text-green-700 border-green-300">
                          Ready for Review
                        </Badge>
                      </div>
                      
                      {isEditingAssessment ? (
                        <div className="space-y-3">
                          <Textarea
                            value={generatedAssessment}
                            onChange={(e) => setGeneratedAssessment(e.target.value)}
                            className="min-h-[120px] text-sm bg-white"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setIsEditingAssessment(false)}
                              className="text-xs"
                            >
                              Save Changes
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setIsEditingAssessment(false)}
                              className="text-xs"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="text-sm text-green-900 whitespace-pre-wrap bg-white p-3 rounded border border-green-200">
                            {generatedAssessment}
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setIsEditingAssessment(true)}
                              className="text-xs"
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={generatePollenAssessment}
                              disabled={isGeneratingAssessment}
                              className="text-xs"
                            >
                              Regenerate
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Submit Section */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {decision === 'not_progressing' 
                    ? 'Candidate will be marked as not progressing and feedback will be provided.'
                    : decision === 'match_to_employer'
                    ? 'Candidate will be moved to employer matching with Pollen Team Assessment.'
                    : 'Please select a decision to continue.'}
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setLocation("/admin/job-applicants-grid/1")}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmitUpdate}
                    disabled={!isFormValid}
                    className="min-w-[120px]"
                  >
                    Submit Update
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
        
    {/* Confirmation Dialog */}
    <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Confirm Decision
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              Are you sure you want to submit this decision for <strong>{candidate.name}</strong>?
            </p>
            
            <div className="bg-gray-50 p-3 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Decision:</span>
                <Badge variant={decision === 'match_to_employer' ? 'default' : 'destructive'}>
                  {decision === 'match_to_employer' ? 'Match to Employer' : 'Not Progressing'}
                </Badge>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium">Overall Score:</span>
                <span className={`font-bold ${getScoreColor(pollenScores.overallPerformance)}`}>
                  {pollenScores.overallPerformance > 0 ? `${Math.round((pollenScores.overallPerformance / 5) * 100)}%` : '--%'}
                </span>
              </div>
              
              {decision === 'match_to_employer' && (
                <div className="text-sm text-gray-600">
                  This candidate will be moved to employer matching with their Pollen Team Assessment.
                </div>
              )}
              
              {decision === 'not_progressing' && (
                <div className="text-sm text-gray-600">
                  This candidate will be marked as not progressing and feedback will be provided.
                </div>
              )}
            </div>
            
            <p className="text-sm text-orange-600">
              <strong>Note:</strong> This action cannot be easily undone. Please ensure all information is accurate before proceeding.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>No, Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirmSubmit}
            className="bg-pink-600 hover:bg-pink-700"
          >
            Yes, Submit Decision
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}