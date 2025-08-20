import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  ArrowLeft, User, Calendar, Clock, MessageCircle, FileText, 
  CheckCircle, AlertTriangle, Send, Phone, Video, Mail, 
  Star, Eye, Download, Edit
} from "lucide-react";
import { useLocation, useParams } from "wouter";

interface TimelineEvent {
  id: string;
  type: 'application' | 'review' | 'interview_invite' | 'interview_scheduled' | 'interview_completed' | 'feedback' | 'status_change' | 'message';
  date: string;
  time: string;
  title: string;
  description: string;
  actor: string;
  status?: string;
  metadata?: any;
}

interface CandidateProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location: string;
  profilePicture?: string;
  applicationDate: string;
  currentStatus: string;
  currentSubStatus: string;
  overallSkillsScore: number;
  jobTitle: string;
  companyName: string;
  timeline: TimelineEvent[];
  unreadMessages: number;
  hasInterviews: boolean;
  nextAction?: string;
}

export default function AdminCandidateTimeline() {
  const { candidateId } = useParams<{ candidateId: string }>();
  const [, setLocation] = useLocation();
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [updateText, setUpdateText] = useState("");
  const [updateType, setUpdateType] = useState<'progress' | 'feedback' | 'status'>('progress');
  const { toast } = useToast();

  // Fetch candidate profile with timeline
  const { data: candidate } = useQuery<CandidateProfile>({
    queryKey: [`/api/admin/candidates/${candidateId}/timeline`],
    initialData: candidateId === "21" ? {
      id: "21",
      name: "James Mitchell",
      email: "james.mitchell@email.com",
      phone: "+44 7123 456789",
      location: "London, UK",
      profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      applicationDate: "2025-01-15",
      currentStatus: "new",
      currentSubStatus: "new_application",
      overallSkillsScore: 88,
      jobTitle: "Marketing Assistant",
      companyName: "TechFlow Solutions",
      unreadMessages: 0,
      hasInterviews: false,
      nextAction: "Review application and assessment submission",
      timeline: [
        {
          id: "t1",
          type: "application",
          date: "2025-01-15",
          time: "15:30",
          title: "Application Submitted",
          description: "James submitted his application for Marketing Assistant role and completed the assessment",
          actor: "James Mitchell"
        },
        {
          id: "t2",
          type: "review",
          date: "2025-01-16",
          time: "09:15",
          title: "Application Under Review",
          description: "Application moved to review queue. Assessment score: 88/100",
          actor: "System",
          status: "under_review"
        }
      ]
    } : candidateId === "30" ? {
      id: "30",
      name: "Lucy Brown",
      email: "lucy.brown@email.com",
      phone: "+44 7987 654321",
      location: "Manchester, UK",
      profilePicture: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      applicationDate: "2025-01-14",
      currentStatus: "in_progress",
      currentSubStatus: "pollen_interview_scheduled",
      overallSkillsScore: 91,
      jobTitle: "Marketing Assistant",
      companyName: "TechFlow Solutions",
      unreadMessages: 1,
      hasInterviews: true,
      nextAction: "Conduct Pollen interview on Jan 20th",
      timeline: [
        {
          id: "t1",
          type: "application",
          date: "2025-01-14",
          time: "14:20",
          title: "Application Submitted",
          description: "Lucy submitted her application and completed the assessment with excellent results",
          actor: "Lucy Brown"
        },
        {
          id: "t2",
          type: "review",
          date: "2025-01-15",
          time: "10:30",
          title: "Application Approved",
          description: "Application reviewed and approved for Pollen interview. Score: 91/100",
          actor: "Holly (Admin)",
          status: "approved"
        },
        {
          id: "t3",
          type: "interview_invite",
          date: "2025-01-16",
          time: "11:45",
          title: "Pollen Interview Invited",
          description: "Invitation sent for Pollen team interview to assess cultural fit",
          actor: "Holly (Admin)"
        },
        {
          id: "t4",
          type: "interview_scheduled",
          date: "2025-01-17",
          time: "16:20",
          title: "Interview Scheduled",
          description: "Pollen interview scheduled for January 20th at 2:30 PM",
          actor: "Lucy Brown",
          metadata: { interviewDate: "2025-01-20", interviewTime: "14:30" }
        },
        {
          id: "t5",
          type: "message",
          date: "2025-01-18",
          time: "09:15",
          title: "Message Received",
          description: "Lucy sent a message asking about interview preparation materials",
          actor: "Lucy Brown"
        }
      ]
    } : {
      id: candidateId || "",
      name: "Candidate",
      email: "candidate@email.com",
      location: "UK",
      applicationDate: "2025-01-15",
      currentStatus: "new",
      currentSubStatus: "new_application",
      overallSkillsScore: 0,
      jobTitle: "Marketing Assistant",
      companyName: "TechFlow Solutions",
      unreadMessages: 0,
      hasInterviews: false,
      timeline: []
    }
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      return await apiRequest("POST", `/api/admin/candidates/${candidateId}/message`, {
        message,
        sentBy: "Holly (Admin)",
        sentAt: new Date().toISOString()
      });
    },
    onSuccess: () => {
      toast({
        title: "Message Sent",
        description: `Your message has been sent to ${candidate?.name}.`
      });
      setMessageModalOpen(false);
      setMessageText("");
      queryClient.invalidateQueries({ queryKey: [`/api/admin/candidates/${candidateId}/timeline`] });
    }
  });

  // Add update mutation
  const addUpdateMutation = useMutation({
    mutationFn: async ({ update, type }: { update: string, type: string }) => {
      return await apiRequest("POST", `/api/admin/candidates/${candidateId}/update`, {
        update,
        type,
        addedBy: "Holly (Admin)",
        addedAt: new Date().toISOString()
      });
    },
    onSuccess: () => {
      toast({
        title: "Update Added",
        description: "Timeline has been updated successfully."
      });
      setUpdateModalOpen(false);
      setUpdateText("");
      queryClient.invalidateQueries({ queryKey: [`/api/admin/candidates/${candidateId}/timeline`] });
    }
  });

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'application': return FileText;
      case 'review': return Eye;
      case 'interview_invite': return Mail;
      case 'interview_scheduled': return Calendar;
      case 'interview_completed': return CheckCircle;
      case 'feedback': return Star;
      case 'status_change': return AlertTriangle;
      case 'message': return MessageCircle;
      default: return FileText;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'application': return 'bg-blue-100 text-blue-600';
      case 'review': return 'bg-purple-100 text-purple-600';
      case 'interview_invite': return 'bg-green-100 text-green-600';
      case 'interview_scheduled': return 'bg-orange-100 text-orange-600';
      case 'interview_completed': return 'bg-emerald-100 text-emerald-600';
      case 'feedback': return 'bg-yellow-100 text-yellow-600';
      case 'status_change': return 'bg-red-100 text-red-600';
      case 'message': return 'bg-cyan-100 text-cyan-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getSubStatusBadge = (subStatus: string) => {
    const statusMap = {
      'new_application': { label: 'New Application', color: 'bg-blue-100 text-blue-800' },
      'application_reviewed': { label: 'Application Reviewed', color: 'bg-green-100 text-green-800' },
      'invited_to_pollen_interview': { label: 'Invited to Pollen Interview', color: 'bg-yellow-100 text-yellow-800' },
      'pollen_interview_scheduled': { label: 'Pollen Interview Scheduled', color: 'bg-purple-100 text-purple-800' },
      'pollen_interview_complete': { label: 'Pollen Interview Complete', color: 'bg-indigo-100 text-indigo-800' },
      'matched_to_employer': { label: 'Matched to Employer', color: 'bg-orange-100 text-orange-800' },
      'employer_interview_requested': { label: 'Employer Interview Requested', color: 'bg-pink-100 text-pink-800' },
      'employer_interview_booked': { label: 'Employer Interview Booked', color: 'bg-cyan-100 text-cyan-800' },
      'employer_interview_complete': { label: 'Employer Interview Complete', color: 'bg-teal-100 text-teal-800' },
      'offer_issued': { label: 'Offer Issued', color: 'bg-emerald-100 text-emerald-800' },
      'not_progressing': { label: 'Not Progressing', color: 'bg-red-100 text-red-800' },
      'hired': { label: 'Hired', color: 'bg-green-100 text-green-800' }
    };
    
    const status = statusMap[subStatus as keyof typeof statusMap] || { label: subStatus, color: 'bg-gray-100 text-gray-800' };
    return <Badge className={status.color}>{status.label}</Badge>;
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) {
      toast({
        title: "Empty Message",
        description: "Please enter a message before sending."
      });
      return;
    }
    sendMessageMutation.mutate({ message: messageText });
  };

  const handleAddUpdate = () => {
    if (!updateText.trim()) {
      toast({
        title: "Empty Update",
        description: "Please enter update details before saving."
      });
      return;
    }
    addUpdateMutation.mutate({ update: updateText, type: updateType });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
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
            <h1 className="text-2xl font-bold text-gray-900">Candidate Timeline</h1>
            <p className="text-gray-600">{candidate?.name} - {candidate?.jobTitle}</p>
          </div>
        </div>
        {candidate && getSubStatusBadge(candidate.currentSubStatus)}
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Candidate Profile Summary */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Candidate Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                {candidate?.profilePicture ? (
                  <img 
                    src={candidate.profilePicture} 
                    alt={candidate.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-500" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900">{candidate?.name}</p>
                  <p className="text-sm text-gray-600">{candidate?.location}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div>
                  <label className="text-xs font-medium text-gray-500">Email</label>
                  <p className="text-sm text-gray-900">{candidate?.email}</p>
                </div>
                {candidate?.phone && (
                  <div>
                    <label className="text-xs font-medium text-gray-500">Phone</label>
                    <p className="text-sm text-gray-900">{candidate.phone}</p>
                  </div>
                )}
                <div>
                  <label className="text-xs font-medium text-gray-500">Applied Date</label>
                  <p className="text-sm text-gray-900">{new Date(candidate?.applicationDate || "").toLocaleDateString('en-GB')}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Skills Score</label>
                  <p className="text-sm text-gray-900 font-semibold">{candidate?.overallSkillsScore}/100</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => setLocation(`/admin/candidate-profile/${candidateId}`)}
                className="w-full justify-start"
                variant="outline"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Full Profile
              </Button>
              
              <Button 
                onClick={() => setMessageModalOpen(true)}
                className="w-full justify-start"
                variant="outline"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Send Message
                {candidate && candidate.unreadMessages > 0 && (
                  <Badge className="ml-auto bg-red-500">{candidate.unreadMessages}</Badge>
                )}
              </Button>

              {candidate?.hasInterviews && (
                <Button 
                  onClick={() => setLocation(`/admin/interview-details/${candidateId}`)}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Interview Details
                </Button>
              )}

              <Button 
                onClick={() => setUpdateModalOpen(true)}
                className="w-full justify-start"
                variant="outline"
              >
                <Edit className="w-4 h-4 mr-2" />
                Add Update
              </Button>
            </CardContent>
          </Card>

          {/* Next Action */}
          {candidate?.nextAction && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-orange-800">Next Action Required</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-orange-700">{candidate.nextAction}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Timeline */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Activity Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {candidate?.timeline.map((event, index) => {
                  const Icon = getEventIcon(event.type);
                  const isLast = index === candidate.timeline.length - 1;
                  
                  return (
                    <div key={event.id} className="flex gap-4">
                      {/* Timeline line and icon */}
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getEventColor(event.type)}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        {!isLast && <div className="w-px h-8 bg-gray-200 mt-2" />}
                      </div>
                      
                      {/* Event content */}
                      <div className="flex-1 pb-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">{event.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                              <span>{new Date(event.date).toLocaleDateString('en-GB')}</span>
                              <span>•</span>
                              <span>{event.time}</span>
                              <span>•</span>
                              <span>by {event.actor}</span>
                            </div>
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(event.date + 'T' + event.time).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
                          </div>
                        </div>
                        
                        {/* Additional metadata */}
                        {event.metadata?.interviewDate && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">
                              <Calendar className="w-4 h-4 inline mr-1" />
                              Interview: {new Date(event.metadata.interviewDate).toLocaleDateString('en-GB')} at {event.metadata.interviewTime}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                
                {(!candidate?.timeline || candidate.timeline.length === 0) && (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p>No timeline events yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Send Message Modal */}
      <Dialog open={messageModalOpen} onOpenChange={setMessageModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Message to {candidate?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Message</label>
              <Textarea
                placeholder="Type your message here..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="mt-1"
                rows={4}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button 
                onClick={handleSendMessage}
                disabled={sendMessageMutation.isPending}
                className="flex-1"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setMessageModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Update Modal */}
      <Dialog open={updateModalOpen} onOpenChange={setUpdateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Timeline Update</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Update Type</label>
              <select 
                value={updateType}
                onChange={(e) => setUpdateType(e.target.value as 'progress' | 'feedback' | 'status')}
                className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-md"
              >
                <option value="progress">Progress Update</option>
                <option value="feedback">Feedback</option>
                <option value="status">Status Change</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Update Details</label>
              <Textarea
                placeholder="Describe the update..."
                value={updateText}
                onChange={(e) => setUpdateText(e.target.value)}
                className="mt-1"
                rows={4}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button 
                onClick={handleAddUpdate}
                disabled={addUpdateMutation.isPending}
                className="flex-1"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Add Update
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setUpdateModalOpen(false)}
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