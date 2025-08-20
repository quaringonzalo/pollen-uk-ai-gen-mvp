import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  Clock, 
  Star, 
  Download, 
  MessageSquare, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Calendar,
  TrendingUp,
  UserCheck,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Candidate {
  id: number;
  name: string;
  matchScore: number;
  skillsScore: number;
  behaviouralScore: number;
  profileStrength: number;
  applicationDate: string;
  status: 'new' | 'reviewed' | 'interviewing' | 'feedback_pending';
  avatar?: string;
  summary: string;
  keyStrengths: string[];
  pollenNotes: string;
}

interface JobMatch {
  id: number;
  title: string;
  candidates: Candidate[];
  totalApplications: number;
  newCandidates: number;
  feedbackPending: number;
  shortlistStatus: 'pending' | 'delivered' | 'feedback_required';
  batchNumber: number;
  feedbackDeadline?: string;
}

const mockCandidates: Candidate[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    matchScore: 89,
    skillsScore: 92,
    behaviouralScore: 85,
    profileStrength: 88,
    applicationDate: "2025-01-20",
    status: "new",
    summary: "Excellent communication skills with strong attention to detail. Previous experience in customer service shows transferable skills.",
    keyStrengths: ["Communication", "Problem Solving", "Team Collaboration"],
    pollenNotes: "Strong cultural fit based on behavioural assessment. Shows growth mindset and coachability."
  },
  {
    id: 2,
    name: "Marcus Williams",
    matchScore: 87,
    skillsScore: 85,
    behaviouralScore: 90,
    profileStrength: 82,
    applicationDate: "2025-01-19",
    status: "reviewed",
    summary: "Recent graduate with impressive academic performance and relevant internship experience.",
    keyStrengths: ["Analytical Thinking", "Quick Learning", "Adaptability"],
    pollenNotes: "Demonstrates excellent potential for growth. Strong technical foundation from academic projects."
  },
  {
    id: 3,
    name: "Emma Thompson",
    matchScore: 84,
    skillsScore: 88,
    behaviouralScore: 82,
    profileStrength: 90,
    applicationDate: "2025-01-18",
    status: "feedback_pending",
    summary: "Career changer from retail with excellent people skills and proven track record of learning new systems.",
    keyStrengths: ["Customer Focus", "Learning Agility", "Resilience"],
    pollenNotes: "Strong motivation for career transition. Excellent references from previous managers highlight reliability."
  }
];

const mockJobMatches: JobMatch[] = [
  {
    id: 1,
    title: "Marketing Assistant",
    candidates: mockCandidates,
    totalApplications: 3,
    newCandidates: 1,
    feedbackPending: 1,
    shortlistStatus: 'feedback_required',
    batchNumber: 1,
    feedbackDeadline: "2025-01-25"
  }
];

export default function ATSDashboard() {
  const { toast } = useToast();
  const [selectedJob, setSelectedJob] = useState<JobMatch | null>(mockJobMatches[0]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    decision: '',
    overallScore: 0,
    skillsScore: 0,
    behaviouralScore: 0,
    culturalFitScore: 0,
    strengths: '',
    concerns: '',
    specificFeedback: ''
  });

  const handleCandidateSelect = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleProvideFeedback = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setFeedbackModal(true);
  };

  const submitFeedback = async () => {
    // Validation
    if (!feedbackData.decision || !feedbackData.strengths || !feedbackData.specificFeedback) {
      toast({
        title: "Incomplete Feedback",
        description: "Please complete all required fields before submitting.",
        variant: "destructive"
      });
      return;
    }

    if (feedbackData.overallScore < 1 || feedbackData.skillsScore < 1 || 
        feedbackData.behaviouralScore < 1 || feedbackData.culturalFitScore < 1) {
      toast({
        title: "Missing Scores",
        description: "Please provide scores (1-10) for all categories.",
        variant: "destructive"
      });
      return;
    }

    // Submit feedback (would be API call in real implementation)
    toast({
      title: "Feedback Submitted",
      description: "Your feedback will be reviewed by our team before being shared with the candidate.",
    });

    setFeedbackModal(false);
    setSelectedCandidate(null);
    setFeedbackData({
      decision: '',
      overallScore: 0,
      skillsScore: 0,
      behaviouralScore: 0,
      culturalFitScore: 0,
      strengths: '',
      concerns: '',
      specificFeedback: ''
    });
  };

  const downloadCandidateProfile = async (candidate: Candidate) => {
    try {
      toast({
        title: "Download Starting",
        description: `Generating ${candidate.name}'s profile PDF...`
      });

      // Add cache-busting timestamp to force fresh data
      const timestamp = Date.now();
      const response = await fetch(`/api/generate-employer-pdf/${candidate.id}?v=${timestamp}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${candidate.name.replace(/\s+/g, '_')}_Profile.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        
        toast({
          title: "Download Complete",
          description: `${candidate.name}'s profile has been downloaded successfully.`
        });
      } else {
        console.error('Failed to generate PDF:', response.statusText);
        toast({
          title: "Download Failed",
          description: "Unable to generate PDF. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Download Error",
        description: "An error occurred while generating the PDF.",
        variant: "destructive"
      });
    }
  };

  const requestMoreCandidates = () => {
    if (selectedJob?.feedbackPending && selectedJob.feedbackPending > 0) {
      toast({
        title: "Feedback Required",
        description: "Please provide feedback on current candidates before requesting more.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Request Submitted",
      description: "Our team will provide additional candidates within 24 hours."
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header with Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Matches</p>
                <p className="text-2xl font-bold">{selectedJob?.totalApplications || 0}</p>
              </div>
              <Users className="h-5 w-5 text-pink-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">New Candidates</p>
                <p className="text-2xl font-bold text-green-600">{selectedJob?.newCandidates || 0}</p>
              </div>
              <UserCheck className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Feedback Pending</p>
                <p className="text-2xl font-bold text-orange-600">{selectedJob?.feedbackPending || 0}</p>
              </div>
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Match Score</p>
                <p className="text-2xl font-bold text-pink-600">87%</p>
              </div>
              <TrendingUp className="h-5 w-5 text-pink-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main ATS Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job Selection & Candidate List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Job Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{selectedJob?.title}</CardTitle>
                  <CardDescription>
                    Batch #{selectedJob?.batchNumber} • Shortlist delivered {selectedJob?.feedbackDeadline && `• Feedback due ${selectedJob.feedbackDeadline}`}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={requestMoreCandidates}
                    disabled={selectedJob?.feedbackPending ? selectedJob.feedbackPending > 0 : false}
                  >
                    Request More Candidates
                  </Button>
                  {selectedJob?.shortlistStatus === 'feedback_required' && (
                    <Badge variant="destructive" className="gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Feedback Required
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Candidates List */}
          <div className="space-y-3">
            {selectedJob?.candidates.map((candidate) => (
              <Card 
                key={candidate.id} 
                className={`cursor-pointer transition-all ${
                  selectedCandidate?.id === candidate.id ? 'ring-2 ring-pink-500' : 'hover:shadow-md'
                }`}
                onClick={() => handleCandidateSelect(candidate)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                          <span className="text-pink-700 font-semibold">
                            {candidate.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold">{candidate.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Matched {new Date(candidate.applicationDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge 
                          variant={
                            candidate.status === 'new' ? 'default' :
                            candidate.status === 'reviewed' ? 'secondary' :
                            candidate.status === 'interviewing' ? 'default' :
                            'destructive'
                          }
                          className="ml-auto"
                        >
                          {candidate.status === 'feedback_pending' ? 'Feedback Pending' : candidate.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Match Score</p>
                          <p className="font-semibold text-pink-600">{candidate.matchScore}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Skills</p>
                          <p className="font-semibold">{candidate.skillsScore}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Behavioural</p>
                          <p className="font-semibold">{candidate.behaviouralScore}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Profile</p>
                          <p className="font-semibold">{candidate.profileStrength}%</p>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-2">{candidate.summary}</p>
                      
                      <div className="flex gap-2 mb-3">
                        {candidate.keyStrengths.map((strength, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {strength}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2 flex-wrap">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open('/profile-print', '_blank');
                          }}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View Profile
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadCandidateProfile(candidate);
                          }}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download Profile
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-pink-600 hover:bg-pink-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProvideFeedback(candidate);
                          }}
                        >
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Provide Feedback
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Candidate Detail Panel */}
        <div className="space-y-4">
          {selectedCandidate ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Candidate Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-pink-700 font-bold text-lg">
                        {selectedCandidate.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg">{selectedCandidate.name}</h3>
                    <p className="text-muted-foreground">Matched {new Date(selectedCandidate.applicationDate).toLocaleDateString()}</p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Overall Match</span>
                        <span>{selectedCandidate.matchScore}%</span>
                      </div>
                      <Progress value={selectedCandidate.matchScore} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Skills Alignment</span>
                        <span>{selectedCandidate.skillsScore}%</span>
                      </div>
                      <Progress value={selectedCandidate.skillsScore} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Behavioural Fit</span>
                        <span>{selectedCandidate.behaviouralScore}%</span>
                      </div>
                      <Progress value={selectedCandidate.behaviouralScore} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Pollen Team Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{selectedCandidate.pollenNotes}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Key Strengths</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedCandidate.keyStrengths.map((strength, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{strength}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-muted-foreground">Select a candidate to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Feedback Modal */}
      {feedbackModal && selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Provide Feedback: {selectedCandidate.name}</CardTitle>
              <CardDescription>
                Your feedback helps candidates improve and is reviewed by our team before sharing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Decision */}
              <div>
                <Label>Decision *</Label>
                <div className="flex gap-2 mt-1">
                  <Button 
                    variant={feedbackData.decision === 'progress' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFeedbackData(prev => ({ ...prev, decision: 'progress' }))}
                  >
                    Progress to Interview
                  </Button>
                  <Button 
                    variant={feedbackData.decision === 'reject' ? 'destructive' : 'outline'}
                    size="sm"
                    onClick={() => setFeedbackData(prev => ({ ...prev, decision: 'reject' }))}
                  >
                    Not Suitable
                  </Button>
                </div>
              </div>

              {/* Scores */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Overall Score (1-10) *</Label>
                  <input 
                    type="number" 
                    min="1" 
                    max="10" 
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    value={feedbackData.overallScore || ''}
                    onChange={(e) => setFeedbackData(prev => ({ ...prev, overallScore: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label>Skills Score (1-10) *</Label>
                  <input 
                    type="number" 
                    min="1" 
                    max="10" 
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    value={feedbackData.skillsScore || ''}
                    onChange={(e) => setFeedbackData(prev => ({ ...prev, skillsScore: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label>Behavioural Score (1-10) *</Label>
                  <input 
                    type="number" 
                    min="1" 
                    max="10" 
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    value={feedbackData.behaviouralScore || ''}
                    onChange={(e) => setFeedbackData(prev => ({ ...prev, behaviouralScore: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label>Cultural Fit Score (1-10) *</Label>
                  <input 
                    type="number" 
                    min="1" 
                    max="10" 
                    className="w-full mt-1 px-3 py-2 border rounded-md"
                    value={feedbackData.culturalFitScore || ''}
                    onChange={(e) => setFeedbackData(prev => ({ ...prev, culturalFitScore: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              {/* Feedback Text Areas */}
              <div>
                <Label>Key Strengths *</Label>
                <Textarea 
                  placeholder="What are this candidate's main strengths for this role?"
                  value={feedbackData.strengths}
                  onChange={(e) => setFeedbackData(prev => ({ ...prev, strengths: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Areas for Development</Label>
                <Textarea 
                  placeholder="What areas could this candidate develop further?"
                  value={feedbackData.concerns}
                  onChange={(e) => setFeedbackData(prev => ({ ...prev, concerns: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Specific Feedback *</Label>
                <Textarea 
                  placeholder="Provide specific, constructive feedback that will help this candidate improve"
                  value={feedbackData.specificFeedback}
                  onChange={(e) => setFeedbackData(prev => ({ ...prev, specificFeedback: e.target.value }))}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={submitFeedback} className="bg-pink-600 hover:bg-pink-700">
                  Submit Feedback
                </Button>
                <Button variant="outline" onClick={() => setFeedbackModal(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}