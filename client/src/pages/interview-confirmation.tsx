import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Video, 
  Phone, 
  ArrowLeft,
  Building2,
  User,
  MessageSquare,
  CheckCircle,
  ExternalLink,
  Download,
  ChevronDown
} from "lucide-react";

interface InterviewConfirmation {
  applicationId: string;
  jobTitle: string;
  companyName: string;
  companyLogo: string;
  interviewType: 'pollen_screening' | 'first_interview' | 'final_interview' | 'technical_interview';
  interviewerName: string;
  interviewerRole: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: string;
  type: 'video' | 'phone' | 'in_person';
  location?: string;
  meetingLink?: string;
  instructions: string;
  confirmationCode: string;
  interviewQuestions?: string[];
  guidelines?: string[];
  isPollenInterview?: boolean;
}

const getMockConfirmationDetails = (applicationId: string): InterviewConfirmation => {
  // applicationId '1' or 'int-001' is a Pollen screening with Emma Davis
  if (applicationId === '1' || applicationId === 'int-001') {
    return {
      applicationId,
      jobTitle: "Marketing Coordinator",
      companyName: "Pollen Team",
      companyLogo: "/attached_assets/Holly_1752681740688.jpg",
      interviewType: 'pollen_screening',
      interviewerName: "Emma Davis",
      interviewerRole: "Talent Partner",
      scheduledDate: '2025-01-20',
      scheduledTime: '14:00',
      duration: '20 minutes',
      type: 'video',
      meetingLink: 'https://pollen.co/chat/assessment-123',
      instructions: "This is a friendly chat to get to know you better and see if it's a good fit on both sides. Join the call 2-3 minutes early, and don't worry - this is a supportive conversation, not a test!",
      confirmationCode: "POL-2025-001",
      interviewQuestions: [
        "Tell me a bit more about yourself!",
        "What in particular appeals to you about the role?",
        "How did you find the task?",
        "Do you have any questions for us?"
      ],
      guidelines: [
        "Be yourself - this is a supportive conversation, not a test",
        "Come prepared with questions about the role and company",
        "We'll review your skills challenge response together",
        "Feel free to ask for interview tips or career advice",
        "We're here to help you put your best foot forward",
        "The call will be recorded for quality purposes only"
      ],
      isPollenInterview: true
    };
  }
  
  // ApplicationId '2' is Emma's employer interview
  if (applicationId === '2') {
    return {
      applicationId,
      jobTitle: "Customer Support Specialist",
      companyName: "StartupHub",
      companyLogo: "/api/placeholder/60/60",
      interviewType: 'first_interview',
      interviewerName: "Emma Wilson",
      interviewerRole: "Hiring Manager",
      scheduledDate: '2025-01-20',
      scheduledTime: '10:00',
      duration: '45 minutes',
      type: 'video',
      meetingLink: 'https://meet.google.com/startuphub-interview-xyz',
      instructions: "Please join the video call 5 minutes early. We'll discuss your experience in customer service and your approach to problem-solving. Have specific examples ready to share.",
      confirmationCode: "SH-2025-002",
      interviewQuestions: [
        "Tell me about your experience in customer service",
        "How do you handle difficult or frustrated customers?",
        "Describe a time when you went above and beyond for a customer",
        "What do you know about our company and why do you want to work here?",
        "How do you prioritize multiple customer inquiries?"
      ],
      guidelines: [
        "Research our company and recent product launches",
        "Prepare specific examples from your customer service experience",
        "Have questions ready about our team and company culture",
        "Test your video setup in advance",
        "Be prepared to discuss scenarios and problem-solving approaches"
      ],
      isPollenInterview: false
    };
  }
  
  return {
    applicationId,
    jobTitle: "Marketing Assistant",
    companyName: "TechFlow Solutions",
    companyLogo: "/api/placeholder/60/60",
    interviewType: 'first_interview',
    interviewerName: "Sarah Johnson",
    interviewerRole: "Marketing Manager",
    scheduledDate: '2025-01-20',
    scheduledTime: '14:00',
    duration: '30 minutes',
    type: 'video',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    instructions: "Please join the video call 5 minutes early. Have your portfolio ready to share and prepare to discuss your experience with social media campaigns.",
    confirmationCode: "INT-2025-001",
    interviewQuestions: [
      "Tell me about your experience with social media marketing campaigns",
      "How do you measure the success of a marketing campaign?",
      "Describe a challenging project you worked on and how you handled it",
      "What marketing tools and platforms are you familiar with?",
      "How do you stay updated with current marketing trends?"
    ],
    guidelines: [
      "Review the job description and company website beforehand",
      "Prepare specific examples of your work and achievements",
      "Have questions ready about the role and company culture",
      "Test your video call setup in advance",
      "Be prepared to discuss your portfolio and previous projects"
    ],
    isPollenInterview: false
  };
};

export default function InterviewConfirmation() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [confirmationDetails, setConfirmationDetails] = useState<InterviewConfirmation | null>(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageSubject, setMessageSubject] = useState("");

  useEffect(() => {
    if (applicationId) {
      const details = getMockConfirmationDetails(applicationId);
      setConfirmationDetails(details);
    }
  }, [applicationId]);

  if (!confirmationDetails) {
    return <div>Loading...</div>;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInterviewTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4 text-blue-600" />;
      case 'phone': return <Phone className="w-4 h-4 text-green-600" />;
      case 'in_person': return <MapPin className="w-4 h-4 text-purple-600" />;
      default: return <Video className="w-4 h-4 text-blue-600" />;
    }
  };

  const getInterviewTypeLabel = (type: string) => {
    switch (type) {
      case 'video': return 'Video Call';
      case 'phone': return 'Phone Call';
      case 'in_person': return 'In Person';
      default: return 'Interview';
    }
  };

  const handleAddToGoogleCalendar = () => {
    const startDateTime = new Date(`${confirmationDetails.scheduledDate}T${confirmationDetails.scheduledTime}:00`);
    const endDateTime = new Date(startDateTime.getTime() + (30 * 60 * 1000)); // Add 30 minutes
    
    const formatDateTime = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
    };

    const eventDetails = {
      title: `${confirmationDetails.jobTitle} Interview - ${confirmationDetails.companyName}`,
      start: formatDateTime(startDateTime),
      end: formatDateTime(endDateTime),
      details: `Interview with ${confirmationDetails.interviewerName} (${confirmationDetails.interviewerRole})\n\n${confirmationDetails.instructions}${confirmationDetails.meetingLink ? `\n\nMeeting Link: ${confirmationDetails.meetingLink}` : ''}`,
      location: confirmationDetails.location || confirmationDetails.meetingLink || ''
    };

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${eventDetails.start}/${eventDetails.end}&details=${encodeURIComponent(eventDetails.details)}&location=${encodeURIComponent(eventDetails.location)}`;
    
    window.open(googleCalendarUrl, '_blank');
    
    toast({
      title: "Calendar Event Created",
      description: "The interview has been added to your Google Calendar",
    });
  };

  const handleAddToOutlookCalendar = () => {
    const startDateTime = new Date(`${confirmationDetails.scheduledDate}T${confirmationDetails.scheduledTime}:00`);
    const endDateTime = new Date(startDateTime.getTime() + (30 * 60 * 1000)); // Add 30 minutes
    
    const eventDetails = {
      title: `${confirmationDetails.jobTitle} Interview - ${confirmationDetails.companyName}`,
      start: startDateTime.toISOString(),
      end: endDateTime.toISOString(),
      body: `Interview with ${confirmationDetails.interviewerName} (${confirmationDetails.interviewerRole})\n\n${confirmationDetails.instructions}${confirmationDetails.meetingLink ? `\n\nMeeting Link: ${confirmationDetails.meetingLink}` : ''}`,
      location: confirmationDetails.location || confirmationDetails.meetingLink || ''
    };

    const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(eventDetails.title)}&startdt=${encodeURIComponent(eventDetails.start)}&enddt=${encodeURIComponent(eventDetails.end)}&body=${encodeURIComponent(eventDetails.body)}&location=${encodeURIComponent(eventDetails.location)}`;
    
    window.open(outlookUrl, '_blank');
    
    toast({
      title: "Calendar Event Created",
      description: "The interview has been added to your Outlook Calendar",
    });
  };

  const handleDownloadICS = () => {
    const startDateTime = new Date(`${confirmationDetails.scheduledDate}T${confirmationDetails.scheduledTime}:00`);
    const endDateTime = new Date(startDateTime.getTime() + (30 * 60 * 1000)); // Add 30 minutes
    
    const formatICSDateTime = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
    };

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Pollen//Interview Scheduler//EN
BEGIN:VEVENT
UID:${confirmationDetails.confirmationCode}@pollen.com
DTSTART:${formatICSDateTime(startDateTime)}
DTEND:${formatICSDateTime(endDateTime)}
SUMMARY:${confirmationDetails.jobTitle} Interview - ${confirmationDetails.companyName}
DESCRIPTION:Interview with ${confirmationDetails.interviewerName} (${confirmationDetails.interviewerRole})\\n\\n${confirmationDetails.instructions}${confirmationDetails.meetingLink ? `\\n\\nMeeting Link: ${confirmationDetails.meetingLink}` : ''}
LOCATION:${confirmationDetails.location || confirmationDetails.meetingLink || ''}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `interview-${confirmationDetails.confirmationCode}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Calendar File Downloaded",
      description: "Import the .ics file into your calendar application",
    });
  };

  const handleSendMessage = () => {
    setIsMessageModalOpen(true);
  };

  const handleSendMessageSubmit = () => {
    if (!messageText.trim()) return;

    // Send message logic here
    toast({
      title: "Message Sent",
      description: `Your message has been sent to ${confirmationDetails?.interviewerName}`,
    });

    // Reset form and close modal
    setMessageText("");
    setMessageSubject("");
    setIsMessageModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/applications')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Applications
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Interview Confirmed
            </h1>
            <p className="text-gray-600">{confirmationDetails.jobTitle} at {confirmationDetails.companyName}</p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-green-900">Your interview has been successfully scheduled!</p>
              <p className="text-sm text-green-700">Confirmation code: {confirmationDetails.confirmationCode}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interview Details Card */}
      <Card className="border-l-4 border-l-pink-500">
        <CardContent className="pt-4">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Interview Details</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700">{confirmationDetails.jobTitle} application</span>
                  <span className="text-gray-600"> at {confirmationDetails.companyName}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Interviewer:</span>
                  <span className="text-gray-600"> {confirmationDetails.interviewerName} at {confirmationDetails.isPollenInterview ? 'Pollen' : confirmationDetails.companyName}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Interview Type:</span>
                  <span className="text-gray-600"> {confirmationDetails.interviewType === 'pollen_screening' ? 'Initial chat with Pollen' : 
                    confirmationDetails.interviewType === 'first_interview' ? 'First Interview' : 
                    confirmationDetails.interviewType === 'final_interview' ? 'Final Interview' : 
                    'Technical Interview'}</span>
                </div>
              </div>
            </div>

            {/* Interviewer Info with Avatar */}
            <div className="flex items-center gap-3 pt-3 border-t">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img 
                  src={confirmationDetails.companyLogo} 
                  alt={confirmationDetails.interviewerName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{confirmationDetails.interviewerName}</div>
                <div className="text-sm text-gray-600">{confirmationDetails.interviewerRole}</div>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {confirmationDetails.duration}
                </span>
                <span className="flex items-center gap-1">
                  {getInterviewTypeIcon(confirmationDetails.type)}
                  {getInterviewTypeLabel(confirmationDetails.type)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Time */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Scheduled Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getInterviewTypeIcon(confirmationDetails.type)}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-lg">{formatDate(confirmationDetails.scheduledDate)}</span>
                    <span className="text-gray-600">at {confirmationDetails.scheduledTime}</span>
                  </div>
                  <div className="text-sm text-gray-600 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {confirmationDetails.duration} • {getInterviewTypeLabel(confirmationDetails.type)}
                  </div>
                  {confirmationDetails.location && (
                    <div className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {confirmationDetails.location}
                    </div>
                  )}
                  {confirmationDetails.meetingLink && (
                    <div className="text-sm text-blue-600 flex items-center gap-1 mt-1">
                      <Video className="w-3 h-3" />
                      <a href={confirmationDetails.meetingLink} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        Join Meeting
                      </a>
                    </div>
                  )}
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Add to Calendar
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleAddToGoogleCalendar}>
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    Google Calendar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleAddToOutlookCalendar}>
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    Outlook Calendar
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDownloadICS}>
                    <Download className="w-4 h-4 mr-2" />
                    Download .ics file
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Interview Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-lg border bg-blue-50 border-blue-200">
            <p className="text-sm text-blue-900">
              {confirmationDetails.instructions}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Interview Questions */}
      {confirmationDetails.interviewQuestions && confirmationDetails.interviewQuestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Interview Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-4">
                Here are some questions you can expect during the interview:
              </p>
              <div className="space-y-2">
                {confirmationDetails.interviewQuestions.map((question, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-500 min-w-[20px] mt-0.5">
                      {index + 1}.
                    </span>
                    <p className="text-sm text-gray-700">{question}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 italic mt-3">
                We may ask you to elaborate on these questions too, if appropriate.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Interview Guidelines */}
      {confirmationDetails.guidelines && confirmationDetails.guidelines.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Interview Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-4">
                Tips to help you prepare for the interview:
              </p>
              <div className="space-y-2">
                {confirmationDetails.guidelines.map((guideline, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-green-50">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                    <p className="text-sm text-green-800">
                      {guideline}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <Button 
          onClick={handleSendMessage}
          variant="outline"
          className="flex items-center gap-2"
        >
          <MessageSquare className="w-4 h-4" />
          Message Interviewer
        </Button>
        
        <Button 
          onClick={() => setLocation('/interview-schedule')}
          className="flex items-center gap-2"
        >
          <CalendarIcon className="w-4 h-4" />
          View My Schedule
        </Button>
      </div>

      {/* Message Modal */}
      <Dialog open={isMessageModalOpen} onOpenChange={setIsMessageModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Send Message to {confirmationDetails?.interviewerName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Subject</label>
              <Input
                value={messageSubject}
                onChange={(e) => setMessageSubject(e.target.value)}
                placeholder="Message subject"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Message</label>
              <Textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Ask questions about the interview, what to expect, or any specific preparation tips..."
                className="min-h-[120px]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setIsMessageModalOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSendMessageSubmit}
                disabled={!messageText.trim()}
              >
                Send Message
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}