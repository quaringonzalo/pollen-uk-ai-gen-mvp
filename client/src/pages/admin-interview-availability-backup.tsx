import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useParams } from "wouter";
import { 
  ArrowLeft, Calendar, Clock, Plus, X, User, MapPin, Mail, 
  Video, Phone, Building, UserCheck, MessageSquare, ExternalLink,
  Copy, CheckCircle, Link2, Settings, Zap
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface AvailabilitySlot {
  date: string;
  startTime: string;
  endTime: string;
}

export default function AdminInterviewAvailability() {
  const { candidateId } = useParams<{ candidateId: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [schedulingMethod, setSchedulingMethod] = useState<'calendly' | 'manual'>('calendly');
  const [calendlyLinkCopied, setCalendlyLinkCopied] = useState(false);
  
  // Default Calendly link - in production this would come from settings
  const defaultCalendlyLink = "https://calendly.com/pollen-team/pollen-interview";
  
  const [availabilityForm, setAvailabilityForm] = useState({
    availableDates: [] as AvailabilitySlot[],
    duration: '30 minutes',
    interviewType: 'video' as 'video' | 'phone' | 'in-person',
    interviewers: ['Holly Saunders'] as string[],
    additionalNotes: '',
    nextSteps: '',
    calendlyLink: defaultCalendlyLink
  });

  const [newDateSlot, setNewDateSlot] = useState({
    date: '',
    startTime: '',
    endTime: ''
  });

  const [newInterviewer, setNewInterviewer] = useState('');

  // Function to copy Calendly link to clipboard
  const copyCalendlyLink = async () => {
    try {
      await navigator.clipboard.writeText(availabilityForm.calendlyLink);
      setCalendlyLinkCopied(true);
      toast({
        title: "Link Copied",
        description: "Calendly link has been copied to clipboard",
      });
      setTimeout(() => setCalendlyLinkCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Could not copy link to clipboard",
        variant: "destructive",
      });
    }
  };

  // Mock candidate data
  const getCandidateInfo = (id: string) => {
    if (id === "21") {
      return {
        name: 'James Mitchell',
        pronouns: 'he/him',
        email: 'james.mitchell@email.com',
        location: 'Manchester, UK',
        position: 'Marketing Assistant',
        company: 'K7 Media Group',
        profilePicture: '/api/placeholder/150/150'
      };
    } else {
      return {
        name: 'Emma Davis',
        pronouns: 'she/her', 
        email: 'emma.davis@email.com',
        location: 'Bristol, UK',
        position: 'Marketing Assistant',
        company: 'K7 Media Group',
        profilePicture: '/api/placeholder/150/150'
      };
    }
  };

  const candidateInfo = getCandidateInfo(candidateId);



  const durationOptions = [
    '15 minutes',
    '30 minutes',
    '45 minutes',
    '1 hour',
    '1.5 hours'
  ];

  const pollenTeamMembers = [
    'Holly Saunders',
    'Karen Whitelaw',
    'Sophie O\'Brien'
  ];

  // Submit availability mutation
  const submitAvailabilityMutation = useMutation({
    mutationFn: async (data: typeof availabilityForm) => {
      return await apiRequest("POST", `/api/admin/interviews/${candidateId}/availability`, {
        ...data,
        submittedBy: "Holly",
        submittedAt: new Date().toISOString(),
        candidateName: candidateInfo.name
      });
    },
    onSuccess: () => {
      toast({
        title: "Interview Availability Sent",
        description: `Your availability has been shared with ${candidateInfo.name}`,
      });
      setTimeout(() => setLocation('/admin/job-applicants-grid/1'), 1500);
    },
  });

  const handleAddDateSlot = () => {
    if (!newDateSlot.date || !newDateSlot.startTime || !newDateSlot.endTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields for the time slot",
        variant: "destructive"
      });
      return;
    }

    // Validate start time is before end time
    if (newDateSlot.startTime >= newDateSlot.endTime) {
      toast({
        title: "Invalid Time Range",
        description: "End time must be after start time",
        variant: "destructive"
      });
      return;
    }

    setAvailabilityForm(prev => ({
      ...prev,
      availableDates: [...prev.availableDates, { ...newDateSlot }]
    }));

    setNewDateSlot({ date: '', startTime: '', endTime: '' });
  };

  const handleRemoveDateSlot = (index: number) => {
    setAvailabilityForm(prev => ({
      ...prev,
      availableDates: prev.availableDates.filter((_, i) => i !== index)
    }));
  };

  const handleAddInterviewer = () => {
    if (!newInterviewer.trim()) return;
    
    setAvailabilityForm(prev => ({
      ...prev,
      interviewers: [...prev.interviewers, newInterviewer.trim()]
    }));
    setNewInterviewer('');
  };

  const handleRemoveInterviewer = (index: number) => {
    setAvailabilityForm(prev => ({
      ...prev,
      interviewers: prev.interviewers.filter((_, i) => i !== index)
    }));
  };

  const handleSubmitAvailability = () => {
    if (availabilityForm.availableDates.length === 0 || !availabilityForm.duration) {
      toast({
        title: "Please provide availability",
        description: "Please add at least one available date/time and select duration",
        variant: "destructive"
      });
      return;
    }
    
    submitAvailabilityMutation.mutate(availabilityForm);
  };

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
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'phone':
        return <Phone className="w-4 h-4" />;
      case 'in-person':
        return <Building className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => setLocation('/admin/job-applicants-grid/1')}
                className="text-gray-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Candidates
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Schedule Pollen Interview</h1>
                <p className="text-gray-600">Provide your availability for {candidateInfo.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Candidate Info */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <img 
                    src={candidateInfo.profilePicture}
                    alt={candidateInfo.name}
                    className="w-12 h-12 rounded-full border"
                  />
                  <div>
                    <div className="font-semibold">{candidateInfo.name}</div>
                    <div className="text-sm text-gray-600 font-normal">
                      {candidateInfo.pronouns}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {candidateInfo.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {candidateInfo.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-2" />
                  Applied for: {candidateInfo.position} at {candidateInfo.company}
                </div>
                <div className="pt-3 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLocation(`/admin/candidate-profile/${candidateId}`)}
                    className="w-full"
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    View Full Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Interview Type</CardTitle>
              </CardHeader>
              <CardContent>
                <Select 
                  value={availabilityForm.interviewType} 
                  onValueChange={(value: 'video' | 'phone' | 'in-person') => 
                    setAvailabilityForm(prev => ({ ...prev, interviewType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select interview type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        Video Call
                      </div>
                    </SelectItem>
                    <SelectItem value="phone">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone Call
                      </div>
                    </SelectItem>
                    <SelectItem value="in-person">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        In Person
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Calendly Scheduling */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="h-5 w-5 text-pink-600" />
                  Schedule Pollen Interview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Calendly Link
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={availabilityForm.calendlyLink}
                      onChange={(e) => setAvailabilityForm(prev => ({ ...prev, calendlyLink: e.target.value }))}
                      placeholder="https://calendly.com/your-username/interview"
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      onClick={copyCalendlyLink}
                      className="shrink-0"
                    >
                      {calendlyLinkCopied ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Interviewer
                  </label>
                  <Select 
                    value={availabilityForm.interviewers[0]} 
                    onValueChange={(value) => 
                      setAvailabilityForm(prev => ({ ...prev, interviewers: [value] }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select interviewer" />
                    </SelectTrigger>
                    <SelectContent>
                      {pollenTeamMembers.map((member) => (
                        <SelectItem key={member} value={member}>
                          {member}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Email Template
                  </label>
                  <div className="bg-gray-50 border rounded-lg p-4">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      <strong>Hi {candidateInfo.name}</strong><br/><br/>
                      We're reaching out in relation to <strong>{candidateInfo.position}</strong> with <strong>{candidateInfo.company}</strong>. Thanks so much for your application! It would be great to have an informal chat to see if it's a good fit on both sides. Please use the following booking link:<br/><br/>
                      <span className="font-mono text-blue-600">{availabilityForm.calendlyLink}</span><br/><br/>
                      Look forward to speaking soon,<br/><br/>
                      Thanks<br/>
                      <strong>{availabilityForm.interviewers[0] || 'Pollen Team'}</strong>
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    This email will be sent to {candidateInfo.name} with the booking link
                  </p>
                </div>
                </CardContent>
              </Card>
            ) : (
              // Manual scheduling method  
              <Card>
                <CardHeader>
                  <CardTitle>Manual Availability Setup</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  
                  {/* Add new time slot */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-medium mb-3">Add Available Time</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">
                        Date
                      </label>
                      <Input
                        type="date"
                        value={newDateSlot.date}
                        onChange={(e) => setNewDateSlot(prev => ({ ...prev, date: e.target.value }))}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">
                        Start Time
                      </label>
                      <Input
                        type="time"
                        value={newDateSlot.startTime}
                        onChange={(e) => setNewDateSlot(prev => ({ ...prev, startTime: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">
                        End Time
                      </label>
                      <Input
                        type="time"
                        value={newDateSlot.endTime}
                        onChange={(e) => setNewDateSlot(prev => ({ ...prev, endTime: e.target.value }))}
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={handleAddDateSlot}
                    className="mt-3 bg-pink-600 hover:bg-pink-700"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Time Slot
                  </Button>
                </div>

                {/* Display available times */}
                {availabilityForm.availableDates.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Available Times:</h4>
                    {availabilityForm.availableDates.map((slot, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">
                            {formatDate(slot.date)}
                          </span>
                          <span className="text-gray-600">
                            {slot.startTime} - {slot.endTime}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveDateSlot(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Duration */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Interview Duration
                  </label>
                  <Select 
                    value={availabilityForm.duration} 
                    onValueChange={(value) => 
                      setAvailabilityForm(prev => ({ ...prev, duration: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      {durationOptions.map((duration) => (
                        <SelectItem key={duration} value={duration}>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {duration}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                  {/* Interviewers for manual method */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      Interview Panel
                    </label>
                    <div className="space-y-2">
                      {availabilityForm.interviewers.map((interviewer, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <UserCheck className="w-4 h-4 text-green-600" />
                            <span>{interviewer}</span>
                          </div>
                          {index > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveInterviewer(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Add interviewer */}
                    <div className="flex gap-2 mt-2">
                      <Select 
                        value={newInterviewer} 
                        onValueChange={setNewInterviewer}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Add team member" />
                        </SelectTrigger>
                        <SelectContent>
                          {pollenTeamMembers
                            .filter(member => !availabilityForm.interviewers.includes(member))
                            .map((member) => (
                              <SelectItem key={member} value={member}>
                                {member}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <Button 
                        onClick={handleAddInterviewer}
                        disabled={!newInterviewer}
                        variant="outline"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Additional Notes for manual method */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      Interview Notes (Optional)
                    </label>
                    <Textarea
                      placeholder="Any specific topics to cover or preparation notes for the candidate..."
                      value={availabilityForm.additionalNotes}
                      onChange={(e) => setAvailabilityForm(prev => ({ ...prev, additionalNotes: e.target.value }))}
                      className="min-h-[80px]"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Calendly Integration Info */}
            {schedulingMethod === 'calendly' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="h-5 w-5" />
                    Calendly Integration Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">Automatic Sync</h4>
                        <p className="text-sm text-blue-700">
                          Bookings automatically appear in candidate timeline and admin dashboard
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-900">Conflict Prevention</h4>
                        <p className="text-sm text-green-700">
                          Real-time availability prevents double bookings and scheduling conflicts
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-purple-900">Professional Experience</h4>
                        <p className="text-sm text-purple-700">
                          Candidates get instant confirmation and calendar invites
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Submit Button - Updated for Calendly */}
            <div className="flex gap-3">
              <Button
                onClick={() => setLocation('/admin/job-applicants-grid/1')}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (schedulingMethod === 'calendly') {
                    // For Calendly, just send the link
                    toast({
                      title: "Calendly Link Shared",
                      description: `Interview booking link sent to ${candidateInfo.name}`,
                    });
                    setTimeout(() => setLocation('/admin/job-applicants-grid/1'), 1500);
                  } else {
                    handleSubmitAvailability();
                  }
                }}
                disabled={submitAvailabilityMutation.isPending || (schedulingMethod === 'calendly' && !availabilityForm.calendlyLink)}
                className="flex-1 bg-pink-600 hover:bg-pink-700"
              >
                {schedulingMethod === 'calendly' ? (
                  <>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Share Calendly Link
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 mr-2" />
                    {submitAvailabilityMutation.isPending ? "Sending..." : "Send Manual Availability"}
                  </>
                )}
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}