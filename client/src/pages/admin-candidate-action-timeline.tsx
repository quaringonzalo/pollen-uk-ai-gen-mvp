import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MessageSquare, 
  User, 
  Mail,
  MapPin,
  Phone,
  Video,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send,
  ClipboardCheck,
  Building
} from "lucide-react";

interface TimelineItem {
  id: string;
  type: 'join' | 'profile' | 'interaction' | 'application' | 'assessment' | 'review' | 'interview' | 'feedback' | 'match' | 'status_change';
  title: string;
  description: string;
  timestamp: string;
  actor: string;
  status?: 'completed' | 'pending' | 'cancelled';
}

export default function AdminCandidateActionTimeline() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const candidateId = window.location.pathname.split('/').pop();
  const [message, setMessage] = useState("");
  const [interviewNotes, setInterviewNotes] = useState("");
  
  // Helper function to handle assessment view logic
  const handleViewAssessment = () => {
    // For mock candidates (34, 37), show info toast instead of navigating to non-existent profile
    if (candidateId === "34" || candidateId === "37") {
      toast({
        title: "Assessment Information",
        description: "Assessment details are available in the job applicants grid view with detailed scoring and feedback.",
      });
    } else {
      setLocation(`/admin/candidate-profile/${candidateId}?tab=skills`);
    }
  };
  
  // Check for success message from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const isSuccess = urlParams.get('success') === 'match';
  const candidateName = urlParams.get('candidate');
  const employerName = urlParams.get('employer');

  // Mock candidate data - would come from API
  const getCandidateData = () => {
    switch (candidateId) {
      case "21":
        return {
          id: candidateId,
          name: "James Mitchell",
          email: "james.mitchell@email.com",
          location: "Manchester, UK",
          phone: "+44 7123 456789",
          profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
          currentStatus: "in_progress",
          subStatus: "pollen_interview_complete",
          applicationCount: 3,
          lastPollenInteraction: "2024-11-15",
          lastPollenTeamMember: "Holly",
          jobTitle: "Social Media Marketing Assistant",
          company: "K7 Media Group"
        };
      case "22":
        return {
          id: candidateId,
          name: "Emma Thompson",
          email: "emma.thompson@email.com",
          location: "Leeds, UK",
          phone: "+44 7456 789123",
          profilePicture: "https://images.unsplash.com/photo-1494790108755-2616b36c4039?w=100&h=100&fit=crop&crop=face",
          currentStatus: "in_progress",
          subStatus: "application_reviewed",
          applicationCount: 1,
          lastPollenInteraction: null,
          lastPollenTeamMember: null,
          jobTitle: "Marketing Assistant",
          company: "K7 Media Group"
        };
      case "24":
        return {
          id: candidateId,
          name: "Michael Roberts",
          email: "michael.roberts@email.com",
          location: "Birmingham, UK",
          phone: "+44 7789 456123",
          profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
          currentStatus: "in_progress",
          subStatus: "assessment_submitted",
          applicationCount: 2,
          lastPollenInteraction: "2024-12-01",
          lastPollenTeamMember: "Holly",
          jobTitle: "Marketing Assistant",
          company: "K7 Media Group"
        };
      case "25":
        return {
          id: candidateId,
          name: "Alex Johnson",
          email: "alex.johnson@email.com",
          location: "London, UK",
          phone: "+44 7456 123789",
          profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
          currentStatus: "in_progress",
          subStatus: "assessment_submitted",
          applicationCount: 4,
          lastPollenInteraction: "2024-10-22",
          lastPollenTeamMember: "Sophie O'Brien",
          jobTitle: "Marketing Assistant",
          company: "K7 Media Group"
        };
      case "32":
        return {
          id: candidateId,
          name: "Tom Harrison",
          email: "tom.harrison@email.com",
          location: "Glasgow, UK",
          phone: "+44 7987 654321",
          profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
          currentStatus: "new",
          subStatus: "application_reviewed",
          applicationCount: 2,
          lastPollenInteraction: "2024-12-01",
          lastPollenTeamMember: "Holly",
          jobTitle: "Marketing Assistant",
          company: "K7 Media Group"
        };
      case "33":
        return {
          id: candidateId,
          name: "Maya Patel",
          email: "maya.patel@email.com",
          location: "Birmingham, UK",
          phone: "+44 7123 987654",
          profilePicture: "https://images.unsplash.com/photo-1494790108755-2616b36c4039?w=100&h=100&fit=crop&crop=face",
          currentStatus: "new",
          subStatus: "new_application",
          applicationCount: 4,
          lastPollenInteraction: "2024-10-22",
          lastPollenTeamMember: "Holly",
          jobTitle: "Marketing Assistant",
          company: "K7 Media Group"
        };
      case "23":
        return {
          id: candidateId,
          name: "Priya Singh",
          email: "priya.singh@email.com",
          location: "London, UK",
          phone: "+44 7345 123456",
          profilePicture: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
          currentStatus: "in_progress",
          subStatus: "pollen_interview_scheduled",
          applicationCount: 1,
          lastPollenInteraction: "2025-01-14",
          lastPollenTeamMember: "Karen Williams",
          jobTitle: "Digital Marketing Assistant",
          company: "K7 Media Group",
          hasPollenInterview: true,
          pollenInterviewDetails: {
            scheduledDate: "2025-01-16",
            scheduledTime: "14:00", 
            duration: "45 minutes",
            interviewer: "Karen Williams, Pollen Team",
            meetingLink: "https://calendly.com/pollen-team/priya-singh-interview",
            notes: "Initial screening interview to assess cultural fit and role understanding"
          }
        };
      case "37":
        return {
          id: candidateId,
          name: "Zara Ahmed",
          email: "zara.ahmed@email.com",
          location: "Liverpool, UK", 
          phone: "+44 7789 123456",
          profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
          currentStatus: "in_progress",
          subStatus: "employer_interview_requested",
          applicationCount: 1,
          lastPollenInteraction: "2025-01-11",
          lastPollenTeamMember: "Holly",
          jobTitle: "Digital Marketing Assistant",
          company: "K7 Media Group"
        };
      case "34":
        return {
          id: candidateId,
          name: "Daniel Foster",
          email: "daniel.foster@email.com",
          location: "Cardiff, UK", 
          phone: "+44 7567 890123",
          profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
          currentStatus: "in_progress",
          subStatus: "invited_to_pollen_interview",
          applicationCount: 1,
          lastPollenInteraction: "2025-01-14",
          lastPollenTeamMember: "Holly",
          jobTitle: "Digital Marketing Assistant",
          company: "K7 Media Group"
        };
      // COMPLETE CANDIDATES
      case "15": // Alex Chen - Not Progressing
        return {
          id: candidateId,
          name: "Alex Chen",
          email: "alex.chen@email.com",
          location: "Birmingham, UK",
          phone: "+44 7234 567890",
          profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
          currentStatus: "complete",
          subStatus: "not_progressing",
          applicationCount: 1,
          lastPollenInteraction: "2025-01-14",
          lastPollenTeamMember: "Holly",
          jobTitle: "Marketing Assistant",
          company: "TechFlow Solutions",
          completionStage: "pollen_interview",
          feedback: "Thanks for taking the time to chat with us about the Marketing Assistant position. Your analytical approach and attention to detail really came through in our conversation. You showed great understanding of data-driven marketing principles and demonstrated solid technical skills that would be valuable assets for marketing roles. Your systematic thinking and problem-solving abilities are key strengths for analytical marketing positions. I'd suggest highlighting your data analysis capabilities and any marketing automation experience in future applications. Keep an eye out for Marketing Analyst or Digital Marketing Coordinator roles - they might be perfect matches for your skillset!",
          interviewScores: {
            communicationRapport: 3,
            roleUnderstanding: 4,
            valuesAlignment: 3,
            overall: 3.3,
            notes: "Strong analytical skills and technical understanding. Very methodical approach to problem-solving. Could benefit from more dynamic communication style for client-facing roles."
          }
        };
      case "8": // Sophie Williams - Hired
        return {
          id: candidateId,
          name: "Sophie Williams",
          email: "sophie.williams@email.com",
          location: "Leeds, UK",
          phone: "+44 7345 678901",
          profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
          currentStatus: "complete",
          subStatus: "hired",
          applicationCount: 1,
          lastPollenInteraction: "2025-01-12",
          lastPollenTeamMember: "Karen Williams",
          jobTitle: "Marketing Assistant",
          company: "TechFlow Solutions",
          completionStage: "employer_interview",
          hireDate: "2025-01-13"
        };
      case "41": // Priya Singh - Not Progressing
        return {
          id: candidateId,
          name: "Priya Singh",
          email: "priya.singh@email.com",
          location: "Coventry, UK",
          phone: "+44 7456 789012",
          profilePicture: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
          currentStatus: "complete",
          subStatus: "not_progressing",
          applicationCount: 1,
          lastPollenInteraction: "2025-01-07",
          lastPollenTeamMember: "Holly",
          jobTitle: "Marketing Assistant",
          company: "TechFlow Solutions",
          completionStage: "application",
          feedback: "Thanks for your interest in the Marketing Assistant position. Your enthusiasm for marketing and solid understanding of digital platforms really stood out during our conversation. You demonstrated good foundational knowledge and showed genuine passion for the field. Your social media awareness and content creation interests are valuable skills for marketing roles. I'd suggest exploring Content Creator or Social Media Assistant positions where your creativity and platform knowledge would really shine. Feel free to reach out if you have questions about your job search!"
        };
      case "42": // Jake Wilson - Hired
        return {
          id: candidateId,
          name: "Jake Wilson",
          email: "jake.wilson@email.com",
          location: "Nottingham, UK",
          phone: "+44 7567 890123",
          profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
          currentStatus: "complete",
          subStatus: "hired",
          applicationCount: 1,
          lastPollenInteraction: "2025-01-06",
          lastPollenTeamMember: "Karen Williams",
          jobTitle: "Marketing Assistant",
          company: "TechFlow Solutions",
          completionStage: "employer_interview",
          hireDate: "2025-01-07"
        };
      case "43": // Amelia Jones - Not Progressing
        return {
          id: candidateId,
          name: "Amelia Jones",
          email: "amelia.jones@email.com",
          location: "Portsmouth, UK",
          phone: "+44 7678 901234",
          profilePicture: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
          currentStatus: "complete",
          subStatus: "not_progressing",
          applicationCount: 1,
          lastPollenInteraction: "2025-01-05",
          lastPollenTeamMember: "Holly",
          jobTitle: "Marketing Assistant",
          company: "TechFlow Solutions",
          completionStage: "employer_interview",
          feedback: "Thanks for your time during our interview process. Your creativity and enthusiasm for marketing really came through in both our chat and the employer interview. You demonstrated strong creative thinking and showed genuine passion for brand storytelling. Your portfolio examples were impressive and showcased your design sensibilities well. The employer felt you'd be a great fit for more creative-focused roles. I'd suggest looking at Creative Marketing Assistant or Brand Content Creator positions where your artistic skills would really shine!",
          interviewScores: {
            communicationRapport: 4,
            roleUnderstanding: 3,
            valuesAlignment: 4,
            overall: 3.7,
            notes: "Excellent creative skills and very engaging personality. Strong visual thinking but could develop more analytical marketing skills."
          },
          employerFeedback: "Amelia was a pleasure to interview and clearly has strong creative abilities. Her portfolio work was impressive and she communicated her ideas well. However, for this particular role we needed someone with more experience in performance marketing and data analysis. We'd definitely consider her for future creative-focused positions."
        };
      default:
        // For unknown candidate IDs, return null to show error state
        return null;
    }
  };

  const candidate = getCandidateData();

  // If candidate not found, redirect to jobs page
  if (!candidate) {
    useEffect(() => {
      setLocation("/admin/jobs");
    }, []);
    return <div>Candidate not found. Redirecting...</div>;
  }

  // Mock timeline data - in ascending chronological order
  const getTimelineData = (): TimelineItem[] => {
    const baseTimeline: TimelineItem[] = [
      {
        id: "1",
        type: "join",
        title: "Joined Pollen",
        description: "",
        timestamp: candidateId === "21" ? "2024-11-20T10:00:00Z" : (candidateId === "22" ? "2025-01-09T10:00:00Z" : "2025-01-10T14:30:00Z"),
        actor: candidate.name,
        status: "completed"
      },
      {
        id: "2",
        type: "profile",
        title: "Profile Completed",
        description: "",
        timestamp: candidateId === "21" ? "2024-11-21T15:30:00Z" : (candidateId === "22" ? "2025-01-09T16:15:00Z" : "2025-01-10T16:15:00Z"),
        actor: candidate.name,
        status: "completed"
      }
    ];

    if (candidateId === "21") {
      // James has more history - previous applications and interactions
      baseTimeline.push(
        {
          id: "3",
          type: "interaction",
          title: "Attended Digital Marketing Masterclass",
          description: "",
          timestamp: "2024-11-25T18:00:00Z",
          actor: "Karen Whitelaw",
          status: "completed"
        },
        {
          id: "4",
          type: "application",
          title: "Applied for Social Media Coordinator at Creative Studios",
          description: "",
          timestamp: "2024-12-02T11:20:00Z",
          actor: candidate.name,
          status: "completed"
        },
        {
          id: "5",
          type: "interview",
          title: "Pollen Interview",
          description: "",
          timestamp: "2024-12-08T14:00:00Z",
          actor: "Karen Whitelaw",
          status: "completed"
        },
        {
          id: "6",
          type: "match",
          title: "Matched to Employer",
          description: "",
          timestamp: "2024-12-10T10:30:00Z",
          actor: "Karen Whitelaw",
          status: "completed"
        },
        {
          id: "7",
          type: "interview",
          title: "Employer Interview at Creative Studios",
          description: "",
          timestamp: "2024-12-15T11:00:00Z",
          actor: "Creative Studios",
          status: "completed"
        },
        {
          id: "8",
          type: "feedback",
          title: "Not Selected",
          description: "",
          timestamp: "2024-12-18T16:00:00Z",
          actor: "Holly",
          status: "completed"
        },
        {
          id: "9",
          type: "application",
          title: "Applied for Digital Marketing Assistant at Growth Partners",
          description: "",
          timestamp: "2024-12-22T09:15:00Z",
          actor: candidate.name,
          status: "completed"
        },
        {
          id: "10",
          type: "status_change",
          title: "Application Withdrawn",
          description: "",
          timestamp: "2024-12-28T13:30:00Z",
          actor: candidate.name,
          status: "completed"
        },
        {
          id: "11",
          type: "interaction",
          title: "Career Guidance Session",
          description: "",
          timestamp: "2025-01-05T10:00:00Z",
          actor: "Holly",
          status: "completed"
        },
        {
          id: "12",
          type: "application",
          title: "Applied for Marketing Assistant at K7 Media Group",
          description: "",
          timestamp: "2025-01-11T09:30:00Z",
          actor: candidate.name,
          status: "completed"
        },
        {
          id: "13",
          type: "review",
          title: "Assessment Reviewed",
          description: "",
          timestamp: "2025-01-11T14:20:00Z",
          actor: "Holly",
          status: "completed"
        },
        {
          id: "14",
          type: "interview",
          title: "Pollen Interview Scheduled",
          description: "",
          timestamp: "2025-01-11T16:45:00Z",
          actor: "Holly",
          status: "pending"
        }
      );
    } else if (candidateId === "22") {
      // Emma Thompson - first-time applicant with different timeline
      baseTimeline.push(
        {
          id: "3",
          type: "application",
          title: "Applied for Marketing Assistant at K7 Media Group",
          description: "",
          timestamp: "2025-01-10T09:30:00Z",
          actor: candidate.name,
          status: "completed"
        },
        {
          id: "4",
          type: "review",
          title: "Assessment Reviewed",
          description: "",
          timestamp: "2025-01-10T14:20:00Z",
          actor: "Karen (Admin)",
          status: "completed"
        }
      );
    } else if (candidateId === "25") {
      // Alex Johnson - returning candidate with 4 applications total
      baseTimeline.push(
        {
          id: "3",
          type: "application",
          title: "Applied for Digital Marketing Coordinator at TechStartup Ltd",
          description: "",
          timestamp: "2024-09-15T09:00:00Z",
          actor: candidate.name,
          status: "completed"
        },
        {
          id: "4",
          type: "application",
          title: "Applied for Social Media Assistant at Creative Agency",
          description: "",
          timestamp: "2024-10-08T11:30:00Z",
          actor: candidate.name,
          status: "completed"
        },
        {
          id: "5",
          type: "interview",
          title: "Pollen Interview",
          description: "",
          timestamp: "2024-10-22T14:00:00Z",
          actor: "Sophie O'Brien",
          status: "completed"
        },
        {
          id: "6",
          type: "application",
          title: "Applied for Marketing Coordinator at Growth Partners",
          description: "",
          timestamp: "2024-11-20T10:45:00Z",
          actor: candidate.name,
          status: "completed"
        },
        {
          id: "7",
          type: "application",
          title: "Applied for Marketing Assistant at K7 Media Group",
          description: "",
          timestamp: "2025-01-11T10:15:00Z",
          actor: candidate.name,
          status: "completed"
        },
        {
          id: "8",
          type: "assessment",
          title: "Skills Assessment Submitted",
          description: "",
          timestamp: "2025-01-11T15:30:00Z",
          actor: candidate.name,
          status: "completed"
        }
      );
    } else if (candidateId === "15") {
      // Alex Chen - Not Progressing after Pollen Interview
      baseTimeline.push(
        {
          id: "3",
          type: "application",
          title: "Applied for Marketing Assistant at TechFlow Solutions",
          description: "",
          timestamp: "2025-01-12T10:15:00Z",
          actor: candidate.name,
          status: "completed"
        },
        {
          id: "4",
          type: "assessment",
          title: "Skills Assessment Submitted",
          description: "",
          timestamp: "2025-01-12T15:30:00Z",
          actor: candidate.name,
          status: "completed"
        },
        {
          id: "5",
          type: "review",
          title: "Assessment Reviewed",
          description: "",
          timestamp: "2025-01-13T11:00:00Z",
          actor: "Holly",
          status: "completed"
        },
        {
          id: "6",
          type: "interview",
          title: "Pollen Interview",
          description: "",
          timestamp: "2025-01-14T14:00:00Z",
          actor: "Holly",
          status: "completed"
        }
      );
    } else {
      // Lucy Brown - first-time applicant
      baseTimeline.push(
        {
          id: "3",
          type: "application",
          title: "Applied for Marketing Assistant at K7 Media Group",
          description: "",
          timestamp: "2025-01-11T09:30:00Z",
          actor: candidate.name,
          status: "completed"
        },
        {
          id: "4",
          type: "review",
          title: "Assessment Reviewed",
          description: "",
          timestamp: "2025-01-11T14:20:00Z",
          actor: "Sophie",
          status: "completed"
        },
        {
          id: "5",
          type: "interview",
          title: "Pollen Interview Scheduled",
          description: "",
          timestamp: "2025-01-11T16:45:00Z",
          actor: "Admin Team",
          status: "pending"
        }
      );
    }

    // Add timeline entries for complete candidates
    if (candidate.currentStatus === "complete") {
      if (candidate.subStatus === "not_progressing") {
        // Add feedback provided entry
        baseTimeline.push({
          id: "feedback",
          type: "feedback",
          title: "Feedback Provided",
          description: candidate.feedback || "Feedback provided to candidate",
          timestamp: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          actor: candidate.lastPollenTeamMember || "Pollen Team",
          status: "completed"
        });
      } else if (candidate.subStatus === "hired") {
        // Add successful hire entry
        baseTimeline.push({
          id: "hired",
          type: "status_change",
          title: "Successfully Hired",
          description: `Hired for ${candidate.jobTitle} position at ${candidate.company}`,
          timestamp: candidate.hireDate || new Date(Date.now() - 86400000).toISOString(),
          actor: candidate.lastPollenTeamMember || "Pollen Team",
          status: "completed"
        });
      }
    }

    return baseTimeline.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const timeline = getTimelineData();

  const getTimelineIcon = (type: string, status?: string) => {
    switch (type) {
      case 'join':
        return <User className="h-3 w-3" />;
      case 'profile':
        return <CheckCircle className="h-3 w-3" />;
      case 'interaction':
        return <Users className="h-3 w-3" />;
      case 'application':
        return <Mail className="h-3 w-3" />;
      case 'assessment':
        return <CheckCircle className="h-3 w-3" />;
      case 'review':
        return status === 'completed' ? <CheckCircle className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />;
      case 'interview':
        return <Calendar className="h-3 w-3" />;
      case 'feedback':
        return <MessageSquare className="h-3 w-3" />;
      case 'match':
        return <CheckCircle className="h-3 w-3" />;
      case 'status_change':
        return <AlertCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-blue-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // Would send message via API
      console.log('Sending message:', message);
      setMessage("");
    }
  };



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation('/admin/job-applicants-grid/1')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Applicants</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          
          {/* Success Message Banner */}
          {isSuccess && candidateName && employerName && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-green-900">
                      Match Successful!
                    </h3>
                    <p className="text-green-700">
                      {candidateName} and {employerName} have been notified of the match!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Candidate Info Card */}
          <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <img 
                    src={candidate.profilePicture}
                    alt={candidate.name}
                    className="w-12 h-12 rounded-full border"
                  />
                  <div>
                    <div className="font-semibold">{candidate.name}</div>
                    <div className="text-sm text-gray-600 font-normal">
                      {candidate.applicationCount} {candidate.applicationCount === 1 ? 'application' : 'applications'}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {candidate.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {candidate.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      {candidate.phone}
                    </div>
                  </div>
                  
                  <div className="col-span-2">
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLocation(`/admin/candidate-message/${candidateId}`)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        View Message History
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setLocation(`/admin/candidate-profile/${candidateId}`)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        View Full Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

          {/* Application History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Application History ({candidate.applicationCount} {candidate.applicationCount === 1 ? "application" : "applications"})
              </CardTitle>
            </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {candidateId === "21" ? (
                    <>
                      <div className="grid grid-cols-5 gap-2 text-xs font-medium text-gray-700 border-b border-gray-200 pb-1">
                        <div>Job Applied To</div>
                        <div>Date</div>
                        <div>Stage Reached</div>
                        <div>Outcome</div>
                        <div>Assessment</div>
                      </div>
                      <div className="grid grid-cols-5 gap-2 text-xs text-gray-600">
                        <div>Social Media Coordinator</div>
                        <div>02 Dec 24</div>
                        <div>Employer Interview</div>
                        <div>Not Selected</div>
                        <div>
                          <button 
                            onClick={handleViewAssessment}
                            className="text-pink-600 hover:text-pink-700 hover:underline"
                          >
                            View
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-5 gap-2 text-xs text-gray-600">
                        <div>Digital Marketing Assistant</div>
                        <div>22 Dec 24</div>
                        <div>Application Review</div>
                        <div>Withdrawn</div>
                        <div>
                          <button 
                            onClick={handleViewAssessment}
                            className="text-pink-600 hover:text-pink-700 hover:underline"
                          >
                            View
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-5 gap-2 text-xs text-gray-600">
                        <div>Marketing Assistant</div>
                        <div>11 Jan 25</div>
                        <div>Pollen Interview</div>
                        <div>In Progress</div>
                        <div>
                          <button 
                            onClick={handleViewAssessment}
                            className="text-pink-600 hover:text-pink-700 hover:underline"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </>
                  ) : candidateId === "22" ? (
                    <>
                      <div className="grid grid-cols-5 gap-2 text-xs font-medium text-gray-700 border-b border-gray-200 pb-1">
                        <div>Job Applied To</div>
                        <div>Date</div>
                        <div>Stage Reached</div>
                        <div>Outcome</div>
                        <div>Assessment</div>
                      </div>
                      <div className="grid grid-cols-5 gap-2 text-xs text-gray-600">
                        <div>Marketing Assistant</div>
                        <div>10 Jan 25</div>
                        <div>Assessment Review</div>
                        <div>In Progress</div>
                        <div>
                          <button 
                            onClick={handleViewAssessment}
                            className="text-pink-600 hover:text-pink-700 hover:underline"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </>
                  ) : candidateId === "25" ? (
                    <>
                      <div className="grid grid-cols-5 gap-2 text-xs font-medium text-gray-700 border-b border-gray-200 pb-1">
                        <div>Job Applied To</div>
                        <div>Date</div>
                        <div>Stage Reached</div>
                        <div>Outcome</div>
                        <div>Assessment</div>
                      </div>
                      <div className="grid grid-cols-5 gap-2 text-xs text-gray-600">
                        <div>Digital Marketing Coordinator</div>
                        <div>15 Sep 24</div>
                        <div>Pollen Interview</div>
                        <div>Not Selected</div>
                        <div>
                          <button 
                            onClick={handleViewAssessment}
                            className="text-pink-600 hover:text-pink-700 hover:underline"
                          >
                            View
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-5 gap-2 text-xs text-gray-600">
                        <div>Social Media Assistant</div>
                        <div>08 Oct 24</div>
                        <div>Application Review</div>
                        <div>Not Selected</div>
                        <div>
                          <button 
                            onClick={handleViewAssessment}
                            className="text-pink-600 hover:text-pink-700 hover:underline"
                          >
                            View
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-5 gap-2 text-xs text-gray-600">
                        <div>Marketing Coordinator</div>
                        <div>20 Nov 24</div>
                        <div>Application Review</div>
                        <div>Not Selected</div>
                        <div>
                          <button 
                            onClick={handleViewAssessment}
                            className="text-pink-600 hover:text-pink-700 hover:underline"
                          >
                            View
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-5 gap-2 text-xs text-gray-600">
                        <div>Marketing Assistant</div>
                        <div>11 Jan 25</div>
                        <div>Assessment Review</div>
                        <div>In Progress</div>
                        <div>
                          <button 
                            onClick={handleViewAssessment}
                            className="text-pink-600 hover:text-pink-700 hover:underline"
                          >
                            View
                          </button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-3 pt-2 border-t border-gray-100">
                        Last spoke with Sophie O'Brien on 22/10/2024
                      </div>
                    </>
                  ) : candidateId === "15" ? (
                    <>
                      <div className="grid grid-cols-5 gap-2 text-xs font-medium text-gray-700 border-b border-gray-200 pb-1">
                        <div>Job Applied To</div>
                        <div>Date</div>
                        <div>Stage Reached</div>
                        <div>Outcome</div>
                        <div>Assessment</div>
                      </div>
                      <div className="grid grid-cols-5 gap-2 text-xs text-gray-600">
                        <div>Marketing Assistant</div>
                        <div>12 Jan 25</div>
                        <div>Pollen Interview</div>
                        <div>Not Progressing</div>
                        <div>
                          <button 
                            onClick={handleViewAssessment}
                            className="text-pink-600 hover:text-pink-700 hover:underline"
                          >
                            View
                          </button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-3 pt-2 border-t border-gray-100">
                        Last spoke with Holly on 14/01/2025
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-5 gap-2 text-xs font-medium text-gray-700 border-b border-gray-200 pb-1">
                        <div>Job Applied To</div>
                        <div>Date</div>
                        <div>Stage Reached</div>
                        <div>Outcome</div>
                        <div>Assessment</div>
                      </div>
                      <div className="grid grid-cols-5 gap-2 text-xs text-gray-600">
                        <div>Marketing Assistant</div>
                        <div>11 Jan 25</div>
                        <div>Pollen Interview</div>
                        <div>In Progress</div>
                        <div>
                          <button 
                            onClick={handleViewAssessment}
                            className="text-pink-600 hover:text-pink-700 hover:underline"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {candidate.lastPollenInteraction && (
                  <div className="text-xs text-gray-500 mt-3 pt-2 border-t border-gray-200">
                    Last spoke with {candidate.lastPollenTeamMember} on {new Date(candidate.lastPollenInteraction).toLocaleDateString('en-GB')}
                  </div>
                )}
              </CardContent>
            </Card>

          {/* Interview Cards - Calendly Integration */}
          {candidate.hasPollenInterview && candidate.pollenInterviewDetails && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-blue-900">
                  <Calendar className="w-4 h-4" />
                  Upcoming Pollen Interview
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-gray-700 mb-1">Date & Time</div>
                      <div className="text-gray-600">
                        {new Date(candidate.pollenInterviewDetails.scheduledDate).toLocaleDateString('en-GB', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="text-gray-600">{candidate.pollenInterviewDetails.scheduledTime} ({candidate.pollenInterviewDetails.duration})</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700 mb-1">Interviewer</div>
                      <div className="text-gray-600">{candidate.pollenInterviewDetails.interviewer}</div>
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-700 mb-1">Notes</div>
                    <div className="text-sm text-gray-600">{candidate.pollenInterviewDetails.notes}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => window.open(candidate.pollenInterviewDetails.meetingLink, '_blank')}
                    >
                      <Video className="h-3 w-3 mr-1" />
                      Join Meeting
                    </Button>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      Calendly Scheduled
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {(candidate as any).hasEmployerInterview && (candidate as any).employerInterviewDetails && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-green-900">
                  <Calendar className="w-4 h-4" />
                  Upcoming Employer Interview
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-gray-700 mb-1">Date & Time</div>
                      <div className="text-gray-600">
                        {new Date((candidate as any).employerInterviewDetails.scheduledDate).toLocaleDateString('en-GB', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="text-gray-600">{(candidate as any).employerInterviewDetails.scheduledTime} ({(candidate as any).employerInterviewDetails.duration})</div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700 mb-1">Interviewer</div>
                      <div className="text-gray-600">{(candidate as any).employerInterviewDetails.interviewer}</div>
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-700 mb-1">Notes</div>
                    <div className="text-sm text-gray-600">{(candidate as any).employerInterviewDetails.notes}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => window.open((candidate as any).employerInterviewDetails.meetingLink, '_blank')}
                    >
                      <Video className="h-3 w-3 mr-1" />
                      Join Meeting
                    </Button>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      Calendly Scheduled
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Interview Scores Section */}
          {(candidate as any).interviewScores && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-blue-900">
                  <ClipboardCheck className="w-4 h-4" />
                  Pollen Interview Scores
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-800">Communication & Rapport</span>
                      <span className="font-medium text-blue-900">{(candidate as any).interviewScores.communicationRapport}/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-800">Role Understanding</span>
                      <span className="font-medium text-blue-900">{(candidate as any).interviewScores.roleUnderstanding}/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-800">Values Alignment</span>
                      <span className="font-medium text-blue-900">{(candidate as any).interviewScores.valuesAlignment}/5</span>
                    </div>
                    <div className="flex justify-between border-t border-blue-200 pt-2">
                      <span className="font-medium text-blue-900">Overall Score</span>
                      <span className="font-bold text-blue-900">{(candidate as any).interviewScores.overall}/5</span>
                    </div>
                  </div>
                  {(candidate as any).interviewScores.notes && (
                    <div className="text-xs text-blue-700 pt-2 border-t border-blue-200">
                      <div className="font-medium mb-1">Interview Notes</div>
                      <p>{(candidate as any).interviewScores.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Employer Feedback Section */}
          {(candidate as any).employerFeedback && (
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-purple-900">
                  <Building className="w-4 h-4" />
                  Employer Interview Feedback
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-sm text-purple-800">
                  <p>{(candidate as any).employerFeedback}</p>
                </div>
                <div className="text-xs text-purple-700 pt-2 border-t border-purple-200 mt-3">
                  Feedback from {candidate.company} on {new Date(candidate.lastPollenInteraction || Date.now()).toLocaleDateString('en-GB')}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Feedback Section for completed candidates */}
          {candidate.currentStatus === "complete" && candidate.subStatus === "not_progressing" && candidate.feedback && (
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-amber-900">
                  <MessageSquare className="w-4 h-4" />
                  Pollen Team Feedback
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="text-sm text-amber-800">
                    <p className="text-amber-800">{candidate.feedback}</p>
                  </div>
                  <div className="text-xs text-amber-700 pt-2 border-t border-amber-200">
                    Feedback provided by {candidate.lastPollenTeamMember || "Pollen Team"} on {new Date(candidate.lastPollenInteraction || Date.now()).toLocaleDateString('en-GB')}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timeline - Compact Notion-Style */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Clock className="w-3 h-3" />
                Pollen Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1">
                {timeline.map((item, index) => (
                  <div key={item.id} className="flex items-center gap-2 py-1 text-xs">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${getStatusColor(item.status)}`} />
                    
                    <div className="flex-1 min-w-0 flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-gray-900 font-medium truncate">
                          {item.title}
                        </span>
                        {/* Only show actor for Pollen team actions */}
                        {(item.actor === 'Holly' || item.actor === 'Karen' || item.actor === 'Sophie' || 
                          item.actor === 'Admin Team' || item.actor === 'Karen (Admin)' ||
                          item.type === 'review' || item.type === 'interview' || item.type === 'feedback' || 
                          item.type === 'interaction') && (
                          <span className="text-gray-500 text-xs">
                            {item.actor}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-gray-500 text-xs">
                          {new Date(item.timestamp).toLocaleDateString('en-GB', { 
                            day: 'numeric', 
                            month: 'short' 
                          })}
                        </span>
                        {item.status === 'pending' && (
                          <Badge 
                            variant="outline" 
                            className="text-xs py-0 px-1 h-4 bg-blue-50 text-blue-700 border-blue-200"
                          >
                            Pending
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}