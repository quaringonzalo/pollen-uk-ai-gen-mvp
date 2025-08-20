import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  ArrowLeft, Calendar, Clock, MapPin, User, Video, Phone,
  MessageCircle, FileText, CheckCircle, X, AlertTriangle,
  Star, Send
} from "lucide-react";
import { useLocation, useParams } from "wouter";

interface InterviewDetails {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidateLocation: string;
  jobTitle: string;
  companyName: string;
  interviewType: 'pollen_interview' | 'employer_interview';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  location?: string;
  meetingLink?: string;
  interviewerName: string;
  interviewerRole: string;
  instructions?: string;
  feedback?: string;
  score?: number;
  notes?: string;
  completedAt?: string;
  noShowReason?: string;
}

export default function AdminInterviewDetails() {
  const { candidateId } = useParams<{ candidateId: string }>();
  const [, setLocation] = useLocation();
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState<number>(0);
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const { toast } = useToast();

  // Fetch interview details
  const { data: interviewDetails } = useQuery<InterviewDetails>({
    queryKey: [`/api/admin/interviews/${candidateId}`],
    initialData: candidateId === "30" ? {
      id: "int_30_001",
      candidateId: "30",
      candidateName: "Lucy Brown",
      candidateEmail: "lucy.brown@email.com",
      candidateLocation: "Manchester, UK",
      jobTitle: "Marketing Assistant",
      companyName: "TechFlow Solutions",
      interviewType: "pollen_interview",
      status: "scheduled",
      scheduledDate: "2025-01-20",
      scheduledTime: "14:30",
      duration: 30,
      meetingLink: "https://meet.google.com/abc-defg-hij",
      interviewerName: "Holly (Admin)",
      interviewerRole: "Pollen Interview Specialist",
      instructions: "This is a Pollen team interview to assess cultural fit and communication skills. Please be prepared to discuss your motivations, working style, and career goals."
    } : candidateId === "38" ? {
      id: "int_38_001", 
      candidateId: "38",
      candidateName: "Ryan O'Connor",
      candidateEmail: "ryan.oconnor@email.com",
      candidateLocation: "Belfast, UK",
      jobTitle: "Marketing Assistant",
      companyName: "TechFlow Solutions",
      interviewType: "employer_interview",
      status: "scheduled",
      scheduledDate: "2025-01-22",
      scheduledTime: "10:00",
      duration: 45,
      location: "TechFlow Solutions Office, London",
      interviewerName: "Sarah Wilson",
      interviewerRole: "Marketing Manager",
      instructions: "Please bring examples of your social media work and be prepared to discuss campaign strategies."
    } : {
      id: "int_unknown",
      candidateId: candidateId || "",
      candidateName: "Candidate",
      candidateEmail: "candidate@email.com",
      candidateLocation: "UK",
      jobTitle: "Marketing Assistant",
      companyName: "TechFlow Solutions",
      interviewType: "pollen_interview",
      status: "scheduled",
      scheduledDate: "2025-01-20",
      scheduledTime: "14:30",
      duration: 30,
      interviewerName: "Holly (Admin)",
      interviewerRole: "Pollen Interview Specialist"
    }
  });

  // Submit feedback mutation
  const submitFeedbackMutation = useMutation({
    mutationFn: async ({ feedback, score }: { feedback: string, score: number }) => {
      return await apiRequest("POST", `/api/admin/interviews/${candidateId}/feedback`, {
        feedback,
        score,
        completedAt: new Date().toISOString(),
        completedBy: "Holly (Admin)"
      });
    },
    onSuccess: () => {
      toast({
        title: "Feedback Submitted",
        description: "Interview feedback has been recorded successfully."
      });
      setFeedbackModalOpen(false);
      queryClient.invalidateQueries({ queryKey: [`/api/admin/interviews/${candidateId}`] });
    }
  });

  // Reschedule interview mutation
  const rescheduleMutation = useMutation({
    mutationFn: async ({ date, time, reason }: { date: string, time: string, reason: string }) => {
      return await apiRequest("PUT", `/api/admin/interviews/${candidateId}/reschedule`, {
        newDate: date,
        newTime: time,
        reason,
        rescheduledBy: "Holly (Admin)"
      });
    },
    onSuccess: () => {
      toast({
        title: "Interview Rescheduled",
        description: "The candidate has been notified of the new time."
      });
      setRescheduleModalOpen(false);
      queryClient.invalidateQueries({ queryKey: [`/api/admin/interviews/${candidateId}`] });
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      case 'rescheduled':
        return <Badge className="bg-yellow-100 text-yellow-800">Rescheduled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleSubmitFeedback = () => {
    if (!feedback.trim() || score === 0) {
      toast({
        title: "Missing Information",
        description: "Please provide both feedback and a score."
      });
      return;
    }
    submitFeedbackMutation.mutate({ feedback, score });
  };

  const handleReschedule = () => {
    if (!newDate || !newTime || !rescheduleReason.trim()) {
      toast({
        title: "Missing Information", 
        description: "Please fill in all reschedule details."
      });
      return;
    }
    rescheduleMutation.mutate({ date: newDate, time: newTime, reason: rescheduleReason });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/admin/job-applicants-grid/1')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Candidates
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Interview Details</h1>
            <p className="text-gray-600">{interviewDetails?.candidateName}</p>
          </div>
        </div>
        {getStatusBadge(interviewDetails?.status || "")}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Interview Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Interview Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                Interview Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Date</label>
                  <p className="text-gray-900">{new Date(interviewDetails?.scheduledDate || "").toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Time</label>
                  <p className="text-gray-900">{interviewDetails?.scheduledTime}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Duration</label>
                  <p className="text-gray-900">{interviewDetails?.duration} minutes</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Type</label>
                  <p className="text-gray-900 capitalize">{interviewDetails?.interviewType?.replace('_', ' ')}</p>
                </div>
              </div>
              
              {interviewDetails?.location && (
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Location
                  </label>
                  <p className="text-gray-900">{interviewDetails.location}</p>
                </div>
              )}

              {interviewDetails?.meetingLink && (
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <Video className="w-4 h-4" />
                    Meeting Link
                  </label>
                  <a href={interviewDetails.meetingLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {interviewDetails.meetingLink}
                  </a>
                </div>
              )}

              {interviewDetails?.instructions && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Instructions</label>
                  <p className="text-gray-900">{interviewDetails.instructions}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Interviewer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-green-500" />
                Interviewer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{interviewDetails?.interviewerName}</p>
                  <p className="text-sm text-gray-600">{interviewDetails?.interviewerRole}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feedback Section */}
          {interviewDetails?.status === 'completed' && interviewDetails?.feedback && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-500" />
                  Interview Feedback
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Score</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${star <= (interviewDetails.score || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">({interviewDetails.score}/5)</span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Feedback</label>
                  <p className="text-gray-900">{interviewDetails.feedback}</p>
                </div>
                {interviewDetails.completedAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Completed</label>
                    <p className="text-gray-900">{new Date(interviewDetails.completedAt).toLocaleDateString('en-GB')} at {new Date(interviewDetails.completedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Actions Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => setLocation(`/admin/candidate-timeline/${candidateId}`)}
                className="w-full justify-start"
                variant="outline"
              >
                <User className="w-4 h-4 mr-2" />
                View Candidate Profile
              </Button>
              
              <Button 
                className="w-full justify-start"
                variant="outline"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Send Message
              </Button>

              {interviewDetails?.status === 'scheduled' && (
                <>
                  <Button 
                    onClick={() => setFeedbackModalOpen(true)}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Complete Interview
                  </Button>
                  
                  <Button 
                    onClick={() => setRescheduleModalOpen(true)}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Reschedule
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Candidate Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Candidate Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-sm text-gray-900">{interviewDetails?.candidateEmail}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Location</label>
                <p className="text-sm text-gray-900">{interviewDetails?.candidateLocation}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Applied For</label>
                <p className="text-sm text-gray-900">{interviewDetails?.jobTitle}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Complete Interview Modal */}
      <Dialog open={feedbackModalOpen} onOpenChange={setFeedbackModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Interview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Interview Score</label>
              <div className="flex items-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 cursor-pointer ${star <= score ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    onClick={() => setScore(star)}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Feedback</label>
              <Textarea
                placeholder="Provide detailed feedback about the interview..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="mt-1"
                rows={4}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button 
                onClick={handleSubmitFeedback}
                disabled={submitFeedbackMutation.isPending}
                className="flex-1"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Submit Feedback
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setFeedbackModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reschedule Modal */}
      <Dialog open={rescheduleModalOpen} onOpenChange={setRescheduleModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reschedule Interview</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">New Date</label>
              <Input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">New Time</label>
              <Input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Reason</label>
              <Textarea
                placeholder="Explain why the interview needs to be rescheduled..."
                value={rescheduleReason}
                onChange={(e) => setRescheduleReason(e.target.value)}
                className="mt-1"
                rows={3}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button 
                onClick={handleReschedule}
                disabled={rescheduleMutation.isPending}
                className="flex-1"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Reschedule
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setRescheduleModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}