import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, Clock, User, MessageSquare, FileText, CheckCircle, 
  XCircle, Plus, Send, Eye, AlertTriangle, Award, Briefcase,
  Edit3, Save, Star, ThumbsUp, ThumbsDown, Users, Gift
} from "lucide-react";

interface InterviewNote {
  id: string;
  timestamp: string;
  author: string;
  content: string;
  type: 'pre_interview' | 'during_interview' | 'post_interview';
  isPrivate: boolean;
}

interface FeedbackItem {
  category: string;
  rating: number;
  comments: string;
  examples?: string;
}

interface InterviewData {
  candidateId: number;
  candidateName: string;
  jobTitle: string;
  interviewDate: string;
  interviewType: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  interviewer: string[];
  notes: InterviewNote[];
  feedback: FeedbackItem[];
  outcome: 'pending' | 'progress' | 'reject' | 'offer';
  nextSteps: string[];
}

interface JobOfferData {
  salary: string;
  startDate: string;
  benefits: string[];
  conditions: string;
  probationPeriod: string;
  workingHours: string;
  location: string;
}

export default function InterviewManagement({ candidateId, candidateName, jobTitle, onClose }: { candidateId: number; candidateName?: string; jobTitle?: string; onClose?: () => void }) {
  const [activeTab, setActiveTab] = useState("notes");
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [currentNote, setCurrentNote] = useState("");
  const [noteType, setNoteType] = useState<'pre_interview' | 'during_interview' | 'post_interview'>('during_interview');
  const [isPrivate, setIsPrivate] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showAdditionalInterviewModal, setShowAdditionalInterviewModal] = useState(false);

  // Mock interview data
  const [interviewData, setInterviewData] = useState<InterviewData>({
    candidateId: candidateId,
    candidateName: candidateName || "Sarah Chen",
    jobTitle: jobTitle || "Marketing Assistant",
    interviewDate: "2025-01-29T14:00:00",
    interviewType: "Initial Interview",
    status: "completed",
    interviewer: ["Emma Wilson", "James Parker"],
    notes: [
      {
        id: "1",
        timestamp: "2025-01-29T13:45:00",
        author: "Emma Wilson",
        content: "Candidate arrived early and well-prepared. Good first impression.",
        type: "pre_interview",
        isPrivate: false
      },
      {
        id: "2", 
        timestamp: "2025-01-29T14:15:00",
        author: "Emma Wilson",
        content: "Strong communication skills demonstrated during portfolio review. Creative approach to campaign examples.",
        type: "during_interview",
        isPrivate: false
      }
    ],
    feedback: [
      {
        category: "Technical Skills",
        rating: 4,
        comments: "Solid understanding of digital marketing fundamentals. Good analytical thinking.",
        examples: "Explained social media metrics clearly, demonstrated understanding of campaign ROI"
      },
      {
        category: "Communication",
        rating: 5,
        comments: "Excellent verbal and written communication. Clear, concise responses.",
        examples: "Articulated complex marketing concepts well, asked thoughtful follow-up questions"
      },
      {
        category: "Cultural Fit",
        rating: 4,
        comments: "Aligns well with company values. Shows enthusiasm for collaborative work.",
        examples: "Mentioned enjoying team projects, expressed interest in learning from colleagues"
      },
      {
        category: "Problem Solving",
        rating: 4,
        comments: "Good analytical approach to challenges. Creative problem-solving demonstrated.",
        examples: "Provided innovative solutions to hypothetical campaign challenges"
      }
    ],
    outcome: "progress",
    nextSteps: [
      "Schedule portfolio review session with marketing team",
      "Arrange team meet-and-greet",
      "Conduct reference checks"
    ]
  });

  const [offerData, setOfferData] = useState<JobOfferData>({
    salary: "",
    startDate: "",
    benefits: [],
    conditions: "",
    probationPeriod: "3 months",
    workingHours: "37.5 hours per week",
    location: "London Office / Hybrid"
  });

  const addNote = () => {
    if (!currentNote.trim()) return;

    const newNote: InterviewNote = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      author: "Emma Wilson", // Current user
      content: currentNote,
      type: noteType,
      isPrivate: isPrivate
    };

    setInterviewData(prev => ({
      ...prev,
      notes: [...prev.notes, newNote]
    }));

    setCurrentNote("");
    setIsEditingNotes(false);
  };

  const updateOutcome = (outcome: 'pending' | 'progress' | 'reject' | 'offer') => {
    setInterviewData(prev => ({ ...prev, outcome }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOutcomeBadge = (outcome: string) => {
    const outcomeConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending Decision", icon: Clock },
      progress: { color: "bg-blue-100 text-blue-800", label: "Progress to Next Stage", icon: CheckCircle },
      reject: { color: "bg-red-100 text-red-800", label: "Not Progressing", icon: XCircle },
      offer: { color: "bg-green-100 text-green-800", label: "Offer Extended", icon: Award }
    };
    
    const config = outcomeConfig[outcome as keyof typeof outcomeConfig] || outcomeConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{fontFamily: 'Sora'}}>
            Interview Management
          </h1>
          <p className="text-gray-600">
            {interviewData.candidateName} • {interviewData.jobTitle}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {getOutcomeBadge(interviewData.outcome)}
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      {/* Interview Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Interview Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Date & Time</Label>
              <p className="text-sm">{formatDate(interviewData.interviewDate)}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Interview Type</Label>
              <p className="text-sm">{interviewData.interviewType}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Interviewers</Label>
              <p className="text-sm">{interviewData.interviewer.join(", ")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notes">Notes & Comments</TabsTrigger>
          <TabsTrigger value="feedback">Interview Feedback</TabsTrigger>
          <TabsTrigger value="decision">Decision & Next Steps</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Interview Notes</CardTitle>
                <Button 
                  onClick={() => setIsEditingNotes(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Note
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Note Form */}
              {isEditingNotes && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Note Type</Label>
                        <Select value={noteType} onValueChange={(value: any) => setNoteType(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pre_interview">Pre-Interview</SelectItem>
                            <SelectItem value="during_interview">During Interview</SelectItem>
                            <SelectItem value="post_interview">Post-Interview</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="private-note"
                          checked={isPrivate}
                          onChange={(e) => setIsPrivate(e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="private-note" className="text-sm">
                          Private note (internal only)
                        </Label>
                      </div>
                    </div>
                    <div>
                      <Label>Note Content</Label>
                      <Textarea
                        value={currentNote}
                        onChange={(e) => setCurrentNote(e.target.value)}
                        placeholder="Add your interview observations, key points discussed, or follow-up items..."
                        rows={4}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button onClick={addNote} className="flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        Save Note
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditingNotes(false)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Existing Notes */}
              <div className="space-y-3">
                {interviewData.notes.map((note) => (
                  <Card key={note.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Badge variant={note.type === 'during_interview' ? 'default' : 'secondary'}>
                            {note.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                          {note.isPrivate && (
                            <Badge variant="outline" className="text-red-600 border-red-300">
                              Private
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {note.author} • {new Date(note.timestamp).toLocaleString()}
                        </div>
                      </div>
                      <p className="text-gray-700">{note.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Interview Feedback & Assessment</CardTitle>
                <Button onClick={() => setShowFeedbackModal(true)}>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Feedback
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {interviewData.feedback.map((item, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{item.category}</h4>
                    <div className="flex items-center gap-2">
                      {getRatingStars(item.rating)}
                      <span className="text-sm text-gray-600">({item.rating}/5)</span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2">{item.comments}</p>
                  {item.examples && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <strong>Examples:</strong> {item.examples}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pollen Team Review */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <AlertTriangle className="w-5 h-5" />
                Feedback for Candidate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-800 mb-4">
                This feedback will be reviewed by the Pollen team before being shared with the candidate if they are not successful.
              </p>
              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-medium mb-2">Constructive Feedback Summary</h4>
                <p className="text-gray-700 text-sm">
                  Sarah demonstrated strong technical knowledge and excellent communication skills throughout the interview. 
                  Her portfolio showed creative thinking and practical application of marketing principles. 
                  Areas for future development could include advanced analytics and campaign optimization techniques.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="decision" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Interview Outcome</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-base font-medium">Decision</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                  <Button
                    variant={interviewData.outcome === 'pending' ? 'default' : 'outline'}
                    onClick={() => updateOutcome('pending')}
                    className="flex items-center gap-2"
                  >
                    <Clock className="w-4 h-4" />
                    Pending
                  </Button>
                  <Button
                    variant={interviewData.outcome === 'progress' ? 'default' : 'outline'}
                    onClick={() => updateOutcome('progress')}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Progress
                  </Button>
                  <Button
                    variant={interviewData.outcome === 'reject' ? 'default' : 'outline'}
                    onClick={() => updateOutcome('reject')}
                    className="flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </Button>
                  <Button
                    variant={interviewData.outcome === 'offer' ? 'default' : 'outline'}
                    onClick={() => updateOutcome('offer')}
                    className="flex items-center gap-2"
                  >
                    <Award className="w-4 h-4" />
                    Offer
                  </Button>
                </div>
              </div>

              {interviewData.outcome === 'progress' && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-3 text-blue-900">Next Steps</h4>
                    <ul className="space-y-2">
                      {interviewData.nextSteps.map((step, index) => (
                        <li key={index} className="flex items-center gap-2 text-blue-800">
                          <CheckCircle className="w-4 h-4" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {interviewData.outcome === 'reject' && (
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2 text-red-900">Feedback Will Be Provided</h4>
                    <p className="text-red-800 text-sm">
                      The feedback collected will be reviewed by the Pollen team and shared with the candidate 
                      to help them in future applications.
                    </p>
                  </CardContent>
                </Card>
              )}

              {interviewData.outcome === 'offer' && (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2 text-green-900">Ready to Extend Offer</h4>
                    <p className="text-green-800 text-sm mb-3">
                      Use the job offer functionality to create and send a formal offer to this candidate.
                    </p>
                    <Button onClick={() => setShowOfferModal(true)} className="bg-green-600 hover:bg-green-700">
                      <Gift className="w-4 h-4 mr-2" />
                      Create Job Offer
                    </Button>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Additional Interviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm">
                  Schedule follow-up interviews with different team members or for specific assessments.
                </p>
                <Button 
                  onClick={() => setShowAdditionalInterviewModal(true)}
                  className="w-full flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Schedule Additional Interview
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Communication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm">
                  Send messages or updates to the candidate about their application.
                </p>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center gap-2"
                    onClick={() => {
                      // Navigate to messages for this candidate
                      const candidateMessageMapping: Record<number, string> = {
                        20: '1', // Sarah Chen
                        21: '2', // James Mitchell
                        22: '3', // Emma Thompson
                        23: '4', // Priya Singh
                        24: '5', // Michael Roberts
                        25: '6'  // Alex Johnson
                      };
                      const conversationId = candidateMessageMapping[candidateId] || '1';
                      window.open(`/employer-messages?conversation=${conversationId}`, '_blank');
                    }}
                  >
                    <MessageSquare className="w-4 h-4" />
                    Send Message
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center gap-2"
                    onClick={() => {
                      // Navigate back to candidate profile in new tab
                      window.open(`/candidates/${candidateId}`, '_blank');
                    }}
                  >
                    <FileText className="w-4 h-4" />
                    View Full Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Job Offer Modal */}
      <Dialog open={showOfferModal} onOpenChange={setShowOfferModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Job Offer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Annual Salary</Label>
                <Input
                  placeholder="£25,000"
                  value={offerData.salary}
                  onChange={(e) => setOfferData(prev => ({ ...prev, salary: e.target.value }))}
                />
              </div>
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={offerData.startDate}
                  onChange={(e) => setOfferData(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
            </div>
            
            <div>
              <Label>Working Hours</Label>
              <Input
                value={offerData.workingHours}
                onChange={(e) => setOfferData(prev => ({ ...prev, workingHours: e.target.value }))}
              />
            </div>

            <div>
              <Label>Work Location</Label>
              <Input
                value={offerData.location}
                onChange={(e) => setOfferData(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>

            <div>
              <Label>Probation Period</Label>
              <Select 
                value={offerData.probationPeriod} 
                onValueChange={(value) => setOfferData(prev => ({ ...prev, probationPeriod: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3 months">3 months</SelectItem>
                  <SelectItem value="6 months">6 months</SelectItem>
                  <SelectItem value="12 months">12 months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Additional Terms & Conditions</Label>
              <Textarea
                placeholder="Any additional terms, benefits, or conditions..."
                value={offerData.conditions}
                onChange={(e) => setOfferData(prev => ({ ...prev, conditions: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2 pt-4">
              <Button onClick={() => setShowOfferModal(false)} className="flex-1">
                <Send className="w-4 h-4 mr-2" />
                Send Offer
              </Button>
              <Button variant="outline" onClick={() => setShowOfferModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Additional Interview Modal */}
      <Dialog open={showAdditionalInterviewModal} onOpenChange={setShowAdditionalInterviewModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Schedule Additional Interview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Interview Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select interview type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical Assessment</SelectItem>
                  <SelectItem value="team">Team Interview</SelectItem>
                  <SelectItem value="final">Final Interview</SelectItem>
                  <SelectItem value="presentation">Presentation/Portfolio Review</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date</Label>
                <Input type="date" />
              </div>
              <div>
                <Label>Time</Label>
                <Input type="time" />
              </div>
            </div>

            <div>
              <Label>Interviewers</Label>
              <Input placeholder="Enter interviewer names" />
            </div>

            <div>
              <Label>Interview Focus</Label>
              <Textarea
                placeholder="What will this interview focus on? Any specific areas to assess?"
                rows={3}
              />
            </div>

            <div className="flex items-center gap-2 pt-4">
              <Button onClick={() => setShowAdditionalInterviewModal(false)} className="flex-1">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Interview
              </Button>
              <Button variant="outline" onClick={() => setShowAdditionalInterviewModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}