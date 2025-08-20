import { useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Calendar, Clock, MapPin, User, Video, Phone, Building, Download, ExternalLink, CheckCircle, Edit3, Save, X, CalendarDays, MessageSquare, AlertCircle, Briefcase } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface InterviewDetails {
  id: string;
  candidateName: string;
  candidatePronouns: string;
  position: string;
  company: string;
  date: string;
  time: string;
  duration: string;
  type: 'video' | 'phone' | 'in-person';
  location: string;
  interviewers: string[];
  status: 'confirmed' | 'pending' | 'cancelled';
  meetingLink?: string;
  notes?: string;
  candidateEmail: string;
  employerEmail: string;
}

export default function InterviewScheduleDetail() {
  const { interviewId } = useParams();
  const [, setLocation] = useLocation();
  const [isAddedToCalendar, setIsAddedToCalendar] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Job seeker view - no edit permissions needed
  const isJobSeeker = user?.role === 'job_seeker';
  
  // Editable state
  const [isEditingInterviewers, setIsEditingInterviewers] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editableInterviewers, setEditableInterviewers] = useState<string[]>([]);
  const [editableNotes, setEditableNotes] = useState('');
  const [newInterviewer, setNewInterviewer] = useState('');
  
  // Message and change request state
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showChangeRequestModal, setShowChangeRequestModal] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [changeRequestType, setChangeRequestType] = useState<'time' | 'date' | 'format' | 'other'>('time');
  const [changeRequestReason, setChangeRequestReason] = useState('');

  // Dynamic interview data based on interview ID
  const getInterviewDetails = (interviewId: string): InterviewDetails => {
    const interviewMap: { [key: string]: InterviewDetails } = {
      "20": {
        id: "20",
        candidateName: "Sarah Chen",
        candidatePronouns: "she/her",
        position: "Marketing Assistant",
        company: "TechFlow Solutions",
        date: "2025-01-28",
        time: "15:00",
        duration: "60 minutes",
        type: "video",
        location: "Google Meet",
        interviewers: ["Holly Saunders (Hiring Manager)", "Marcus Chen (Team Lead)"],
        status: "confirmed",
        meetingLink: "https://meet.google.com/abc-defg-hij",
        notes: "Please have examples of your social media and content marketing projects ready to discuss. We'll be covering campaign strategy and analytics experience.",
        candidateEmail: "sarah.chen@email.com",
        employerEmail: "holly.saunders@pollen.co.uk"
      },
      "21": {
        id: "21",
        candidateName: "James Mitchell",
        candidatePronouns: "he/him",
        position: "Marketing Assistant",
        company: "TechFlow Solutions",
        date: "2025-01-29",
        time: "11:00",
        duration: "60 minutes",
        type: "video",
        location: "Microsoft Teams",
        interviewers: ["Holly Saunders (Hiring Manager)", "Sarah Johnson (Marketing Director)"],
        status: "confirmed",
        meetingLink: "https://teams.microsoft.com/l/meetup-join/19%3ameeting",
        notes: "Focus on strategic marketing thinking and data analysis approach. Prepare examples of marketing strategy work and project management experience.",
        candidateEmail: "james.mitchell@email.com",
        employerEmail: "holly.saunders@pollen.co.uk"
      },
      "22": {
        id: "22",
        candidateName: "Emma Thompson",
        candidatePronouns: "she/her",
        position: "Marketing Assistant",
        company: "TechFlow Solutions",
        date: "2025-01-30",
        time: "14:00",
        duration: "60 minutes",
        type: "video",
        location: "Google Meet",
        interviewers: ["Holly Saunders (Hiring Manager)", "Marcus Chen (Team Lead)"],
        status: "confirmed",
        meetingLink: "https://meet.google.com/abc-defg-hij",
        notes: "Please have examples of your content writing and creative design projects ready to discuss. We'll be covering brand management and creative campaign strategy.",
        candidateEmail: "emma.thompson@email.com",
        employerEmail: "holly.saunders@pollen.co.uk"
      },
      "23": {
        id: "23",
        candidateName: "Priya Singh",
        candidatePronouns: "she/her",
        position: "Marketing Assistant",
        company: "TechFlow Solutions",
        date: "2025-02-02",
        time: "10:30",
        duration: "45 minutes",
        type: "video",
        location: "Microsoft Teams",
        interviewers: ["Holly Saunders (Hiring Manager)", "Jamie Foster (Senior Marketing Associate)"],
        status: "confirmed",
        meetingLink: "https://teams.microsoft.com/l/meetup-join/19%3ameeting",
        notes: "Focus on event planning coordination and team collaboration approach. Prepare examples of marketing coordination and social media management work.",
        candidateEmail: "priya.singh@email.com",
        employerEmail: "holly.saunders@pollen.co.uk"
      },
      "24": {
        id: "24",
        candidateName: "Michael Roberts",
        candidatePronouns: "he/him",
        position: "Marketing Assistant",
        company: "TechFlow Solutions",
        date: "2025-01-31",
        time: "16:00",
        duration: "60 minutes",
        type: "video",
        location: "Google Meet",
        interviewers: ["Holly Saunders (Hiring Manager)", "Alex Rodriguez (Data Manager)"],
        status: "confirmed",
        meetingLink: "https://meet.google.com/xyz-uvw-rst",
        notes: "Focus on data analysis and marketing analytics expertise. Prepare examples of campaign analysis, report writing, and data interpretation work.",
        candidateEmail: "michael.roberts@email.com",
        employerEmail: "holly.saunders@pollen.co.uk"
      },
      "25": {
        id: "25",
        candidateName: "Alex Johnson",
        candidatePronouns: "they/them",
        position: "Marketing Assistant",
        company: "TechFlow Solutions",
        date: "2025-02-03",
        time: "13:30",
        duration: "45 minutes",
        type: "video",
        location: "Microsoft Teams",
        interviewers: ["Holly Saunders (Hiring Manager)", "Emma Wilson (Customer Success Lead)"],
        status: "confirmed",
        meetingLink: "https://teams.microsoft.com/l/meetup-join/19%3ameeting2",
        notes: "Focus on customer service experience and team leadership approach. Prepare examples of customer-focused marketing and team support work.",
        candidateEmail: "alex.johnson@email.com",
        employerEmail: "holly.saunders@pollen.co.uk"
      }
    };
    
    return interviewMap[interviewId] || interviewMap["23"];
  };

  const [interviewDetails, setInterviewDetails] = useState<InterviewDetails>(
    getInterviewDetails(interviewId || "23")
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const generateCalendarEvent = (format: 'google' | 'outlook' | 'ical') => {
    const startDate = new Date(`${interviewDetails.date}T${interviewDetails.time}:00`);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Add 1 hour
    
    const title = `Interview: ${interviewDetails.candidateName} - ${interviewDetails.position}`;
    const description = `Interview with ${interviewDetails.candidateName} (${interviewDetails.candidatePronouns}) for ${interviewDetails.position} position.\n\nInterviewers: ${interviewDetails.interviewers.join(', ')}\n\n${interviewDetails.notes || ''}\n\nMeeting Link: ${interviewDetails.meetingLink || 'TBC'}`;
    const location = interviewDetails.type === 'video' ? `${interviewDetails.location} - ${interviewDetails.meetingLink}` : interviewDetails.location;

    switch (format) {
      case 'google':
        const googleStart = startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        const googleEnd = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${googleStart}/${googleEnd}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;
      
      case 'outlook':
        const outlookStart = startDate.toISOString();
        const outlookEnd = endDate.toISOString();
        return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(title)}&startdt=${outlookStart}&enddt=${outlookEnd}&body=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;
      
      case 'ical':
        const icalContent = [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'PRODID:-//Pollen//Interview Scheduler//EN',
          'BEGIN:VEVENT',
          `UID:interview-${interviewDetails.id}@pollen.co.uk`,
          `DTSTART:${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
          `DTEND:${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
          `SUMMARY:${title}`,
          `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
          `LOCATION:${location}`,
          'STATUS:CONFIRMED',
          'END:VEVENT',
          'END:VCALENDAR'
        ].join('\r\n');
        
        const blob = new Blob([icalContent], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `interview-${interviewDetails.candidateName.replace(/\s+/g, '-').toLowerCase()}.ics`;
        link.click();
        URL.revokeObjectURL(url);
        return;
    }
  };

  const handleAddToCalendar = (format: 'google' | 'outlook' | 'ical') => {
    if (format === 'ical') {
      generateCalendarEvent(format);
    } else {
      const url = generateCalendarEvent(format);
      if (url) {
        window.open(url, '_blank');
      }
    }
    setIsAddedToCalendar(true);
  };

  const getInterviewTypeIcon = () => {
    switch (interviewDetails.type) {
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'phone':
        return <Phone className="w-5 h-5" />;
      case 'in-person':
        return <Building className="w-5 h-5" />;
      default:
        return <Calendar className="w-5 h-5" />;
    }
  };

  const getStatusBadge = () => {
    switch (interviewDetails.status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Confirmation</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Initialize editable state with current data
  const initializeEditableState = () => {
    if (editableInterviewers.length === 0) {
      setEditableInterviewers([...interviewDetails.interviewers]);
    }
    if (editableNotes === '') {
      setEditableNotes(interviewDetails.notes || '');
    }
  };

  // Helper functions for editable fields
  const handleSaveInterviewers = () => {
    setInterviewDetails(prev => ({ ...prev, interviewers: [...editableInterviewers] }));
    setIsEditingInterviewers(false);
    toast({
      title: "Interviewers updated",
      description: "Interview panel has been successfully updated",
    });
  };

  const handleSaveNotes = () => {
    setInterviewDetails(prev => ({ ...prev, notes: editableNotes }));
    setIsEditingNotes(false);
    toast({
      title: "Notes updated",
      description: "Interview notes have been successfully updated",
    });
  };

  const handleAddInterviewer = () => {
    if (newInterviewer.trim()) {
      setEditableInterviewers(prev => [...prev, newInterviewer.trim()]);
      setNewInterviewer('');
    }
  };

  const handleRemoveInterviewer = (index: number) => {
    setEditableInterviewers(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddInterviewer();
    }
  };

  // Message and change request handlers
  const handleSendMessage = () => {
    // In a real app, this would send the message via API
    toast({
      title: "Message sent",
      description: `Your message has been sent to ${interviewDetails.candidateName}`,
    });
    setShowMessageModal(false);
    setMessageContent('');
  };

  const handleRequestChange = () => {
    // In a real app, this would send the change request via API
    toast({
      title: "Change request sent",
      description: `Your ${changeRequestType} change request has been sent to ${interviewDetails.candidateName}`,
    });
    setShowChangeRequestModal(false);
    setChangeRequestReason('');
  };

  const getChangeRequestTemplate = (type: string) => {
    const candidateFirstName = interviewDetails.candidateName.split(' ')[0];
    const templates: Record<string, string> = {
      time: `Hi ${candidateFirstName},\n\nI hope this message finds you well. I need to request a change to our scheduled interview time due to an unexpected scheduling conflict.\n\nCurrent interview: ${formatDate(interviewDetails.date)} at ${formatTime(interviewDetails.time)}\n\nWould you be available for any of these alternative times instead?\n• [Please suggest 2-3 alternative times]\n\nI apologise for any inconvenience this may cause and appreciate your flexibility.\n\nBest regards`,
      date: `Hi ${candidateFirstName},\n\nI hope this message finds you well. I need to request a change to our scheduled interview date due to an unexpected scheduling conflict.\n\nCurrent interview: ${formatDate(interviewDetails.date)} at ${formatTime(interviewDetails.time)}\n\nWould you be available on any of these alternative dates?\n• [Please suggest 2-3 alternative dates]\n\nI apologise for any inconvenience this may cause and appreciate your flexibility.\n\nBest regards`,
      format: `Hi ${candidateFirstName},\n\nI hope this message finds you well. I need to request a change to our scheduled interview format.\n\nCurrent format: ${interviewDetails.type} interview\nRequested format: [Please specify new format]\n\nThe interview date and time remain the same: ${formatDate(interviewDetails.date)} at ${formatTime(interviewDetails.time)}\n\nPlease let me know if this change works for you.\n\nBest regards`,
      other: `Hi ${candidateFirstName},\n\nI hope this message finds you well. I need to discuss a change regarding our scheduled interview.\n\nScheduled interview: ${formatDate(interviewDetails.date)} at ${formatTime(interviewDetails.time)}\n\n[Please describe the change needed]\n\nI apologise for any inconvenience and appreciate your understanding.\n\nBest regards`
    };
    return templates[type] || templates.other;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => setLocation("/applications")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Applications
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Sora' }}>
              Your Interview Details
            </h1>
            <p className="text-gray-600">Everything you need to know about your upcoming interview</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setLocation('/applications')}
            className="flex items-center gap-2"
          >
            <Briefcase className="w-4 h-4" />
            My Applications
          </Button>
          <Button
            onClick={() => setShowMessageModal(true)}
            className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white"
          >
            <MessageSquare className="w-4 h-4" />
            Contact Employer
          </Button>
        </div>
      </div>

      {/* Interview Details Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl" style={{ fontFamily: 'Sora' }}>
                {interviewDetails.position} Interview
              </CardTitle>
              <p className="text-gray-600">{interviewDetails.company}</p>
            </div>
            {getStatusBadge()}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900">{formatDate(interviewDetails.date)}</p>
                <p className="text-sm text-gray-600">Interview Date</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900">{formatTime(interviewDetails.time)} ({interviewDetails.duration})</p>
                <p className="text-sm text-gray-600">Start Time & Duration</p>
              </div>
            </div>
          </div>

          {/* Interview Type & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              {getInterviewTypeIcon()}
              <div>
                <p className="font-medium text-gray-900 capitalize">{interviewDetails.type} Interview</p>
                <p className="text-sm text-gray-600">Interview Format</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900">{interviewDetails.location}</p>
                <p className="text-sm text-gray-600">Location</p>
              </div>
            </div>
          </div>

          {/* Your Application Info */}
          <div className="flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-gray-500" />
            <div>
              <p className="font-medium text-gray-900">
                You're interviewing for {interviewDetails.position}
              </p>
              <p className="text-sm text-gray-600">Application submitted to {interviewDetails.company}</p>
            </div>
          </div>

          {/* Interviewers - Editable */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">Interview Panel</h4>
              {!isEditingInterviewers && isEmployer && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    initializeEditableState();
                    setIsEditingInterviewers(true);
                  }}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </Button>
              )}
            </div>
            
            {isEditingInterviewers && isEmployer ? (
              <div className="space-y-3">
                {/* Current Interviewers */}
                <div className="space-y-2">
                  {editableInterviewers.map((interviewer, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm text-gray-700">{interviewer}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveInterviewer(index)}
                        className="text-red-600 hover:text-red-800 h-6 w-6 p-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                
                {/* Add New Interviewer */}
                <div className="flex gap-2">
                  <Input
                    value={newInterviewer}
                    onChange={(e) => setNewInterviewer(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add interviewer (e.g., John Smith - Role)"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddInterviewer}
                    disabled={!newInterviewer.trim()}
                  >
                    Add
                  </Button>
                </div>
                
                {/* Save/Cancel Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={handleSaveInterviewers}
                    className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditingInterviewers(false);
                      setEditableInterviewers([...interviewDetails.interviewers]);
                      setNewInterviewer('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <ul className="space-y-1">
                {interviewDetails.interviewers.map((interviewer, index) => (
                  <li key={index} className="text-sm text-gray-600">• {interviewer}</li>
                ))}
              </ul>
            )}
          </div>

          {/* Meeting Link */}
          {interviewDetails.meetingLink && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Meeting Details</h4>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(interviewDetails.meetingLink, '_blank')}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Join Meeting
                </Button>
                <span className="text-sm text-gray-500">Link will be active 15 minutes before interview</span>
              </div>
            </div>
          )}

          {/* Notes - Editable */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">Interview Notes</h4>
              {!isEditingNotes && isEmployer && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    initializeEditableState();
                    setIsEditingNotes(true);
                  }}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </Button>
              )}
            </div>
            
            {isEditingNotes && isEmployer ? (
              <div className="space-y-3">
                <Textarea
                  value={editableNotes}
                  onChange={(e) => setEditableNotes(e.target.value)}
                  placeholder="Add interview notes, preparation instructions, or topics to cover..."
                  className="min-h-[100px]"
                />
                
                {/* Save/Cancel Buttons */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSaveNotes}
                    className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditingNotes(false);
                      setEditableNotes(interviewDetails.notes || '');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                {interviewDetails.notes || "No notes added yet"}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add to Calendar Section */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Sora' }}>Add to Calendar</CardTitle>
          <p className="text-gray-600">Add this interview to your calendar to receive reminders</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => handleAddToCalendar('google')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Calendar className="w-4 h-4" />
              Google Calendar
            </Button>
            <Button
              onClick={() => handleAddToCalendar('outlook')}
              className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900"
            >
              <Calendar className="w-4 h-4" />
              Outlook Calendar
            </Button>
            <Button
              onClick={() => handleAddToCalendar('ical')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download .ics File
            </Button>
          </div>
          
          {isAddedToCalendar && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-medium">Calendar event added successfully!</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Sora' }}>Next Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-semibold text-pink-700">1</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Calendar Confirmation</p>
              <p className="text-sm text-gray-600">Add interview to your calendar using the buttons above</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-semibold text-pink-700">2</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Automatic Notifications</p>
              <p className="text-sm text-gray-600">Both you and {interviewDetails.candidateName} will receive email confirmations and reminders</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-semibold text-pink-700">3</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Interview Preparation</p>
              <p className="text-sm text-gray-600">Review {interviewDetails.candidateName}'s profile and prepare discussion points based on the notes above</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interview Management */}
      <Card>
        <CardHeader>
          <CardTitle style={{ fontFamily: 'Sora' }}>Interview Management</CardTitle>
          <p className="text-gray-600">Access related information and manage your interview schedule</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => window.open(`/candidates/${candidateId}`, '_blank')}
              className="flex items-center gap-2 h-auto p-4 justify-start"
            >
              <User className="w-5 h-5 text-pink-600" />
              <div className="text-left">
                <div className="font-medium">View {interviewDetails.candidateName}'s Profile</div>
                <div className="text-sm text-gray-500">Review full application and assessment details</div>
              </div>
            </Button>
            <Button
              variant="outline"
              onClick={() => setLocation('/interview-schedule')}
              className="flex items-center gap-2 h-auto p-4 justify-start"
            >
              <CalendarDays className="w-5 h-5 text-pink-600" />
              <div className="text-left">
                <div className="font-medium">All Interviews</div>
                <div className="text-sm text-gray-500">View upcoming and past interview schedule</div>
              </div>
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowMessageModal(true)}
              className="flex items-center gap-2 h-auto p-4 justify-start"
            >
              <MessageSquare className="w-5 h-5 text-pink-600" />
              <div className="text-left">
                <div className="font-medium">Message {interviewDetails.candidateName}</div>
                <div className="text-sm text-gray-500">Send a direct message or additional information</div>
              </div>
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowChangeRequestModal(true)}
              className="flex items-center gap-2 h-auto p-4 justify-start"
            >
              <AlertCircle className="w-5 h-5 text-pink-600" />
              <div className="text-left">
                <div className="font-medium">Request Interview Change</div>
                <div className="text-sm text-gray-500">Request changes to time, date, or format</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Message Modal */}
      <Dialog open={showMessageModal} onOpenChange={setShowMessageModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Sora' }}>
              Message {interviewDetails.candidateName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              Send a message to {interviewDetails.candidateName} regarding your interview scheduled for {formatDate(interviewDetails.date)} at {formatTime(interviewDetails.time)}.
            </p>
            <Textarea
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              placeholder="Type your message here..."
              className="min-h-[120px]"
            />
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowMessageModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!messageContent.trim()}
                className="bg-pink-600 hover:bg-pink-700"
              >
                Send Message
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Request Modal */}
      <Dialog open={showChangeRequestModal} onOpenChange={setShowChangeRequestModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'Sora' }}>
              Request Interview Change
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              Request a change to your interview with {interviewDetails.candidateName}. They will need to approve any changes.
            </p>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Type of Change</label>
              <Select value={changeRequestType} onValueChange={(value: 'time' | 'date' | 'format' | 'other') => {
                setChangeRequestType(value);
                setChangeRequestReason(getChangeRequestTemplate(value));
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="time">Time Change</SelectItem>
                  <SelectItem value="date">Date Change</SelectItem>
                  <SelectItem value="format">Format Change (Video/Phone/In-Person)</SelectItem>
                  <SelectItem value="other">Other Change</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Message to Candidate</label>
              <Textarea
                value={changeRequestReason}
                onChange={(e) => setChangeRequestReason(e.target.value)}
                placeholder="Describe the change you need and provide alternative options..."
                className="min-h-[200px]"
              />
              <p className="text-xs text-gray-500">
                This template message has been pre-populated based on your change type. Please edit as needed.
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowChangeRequestModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRequestChange}
                disabled={!changeRequestReason.trim()}
                className="bg-pink-600 hover:bg-pink-700"
              >
                Send Change Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}