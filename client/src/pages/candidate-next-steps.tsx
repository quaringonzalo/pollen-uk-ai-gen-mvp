import { useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, MessageSquare, Calendar, Send, User, ExternalLink } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function CandidateNextSteps() {
  const { candidateId } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('interview');
  const [messageForm, setMessageForm] = useState({
    subject: '',
    message: ''
  });
  const [availabilityForm, setAvailabilityForm] = useState({
    availableDates: [] as { date: string; startTime: string; endTime: string }[],
    duration: '',
    interviewers: [] as string[],
    additionalNotes: ''
  });

  const [newDateSlot, setNewDateSlot] = useState({
    date: '',
    startTime: '',
    endTime: ''
  });

  const [newInterviewer, setNewInterviewer] = useState('');

  // Mock candidate data based on ID
  const getCandidateInfo = (id: string | undefined) => {
    switch (id) {
      case '1':
        return { name: 'Sarah Chen', pronouns: 'she/her', location: 'London, UK' };
      case '2':
        return { name: 'James Mitchell', pronouns: 'he/him', location: 'Manchester, UK' };
      case '3':
        return { name: 'Emma Thompson', pronouns: 'she/her', location: 'Birmingham, UK' };
      case '4':
        return { name: 'Michael Roberts', pronouns: 'he/him', location: 'Leeds, UK' };
      case '5':
        return { name: 'Alex Johnson', pronouns: 'he/him', location: 'London, UK' };
      case '6':
        return { name: 'Priya Singh', pronouns: 'she/her', location: 'Birmingham, UK' };
      default:
        return { name: 'Candidate', pronouns: '', location: '' };
    }
  };

  const candidateInfo = getCandidateInfo(candidateId);
  const candidateName = candidateInfo.name;

  const durationOptions = [
    '15 minutes',
    '30 minutes',
    '45 minutes',
    '1 hour',
    '1.5 hours',
    '2 hours'
  ];

  // Helper function to format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleSendMessage = () => {
    if (!messageForm.subject || !messageForm.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Message Sent",
      description: `Your message has been sent to ${candidateName}`,
    });
    
    // Reset form and go back
    setMessageForm({ subject: '', message: '' });
    setTimeout(() => setLocation('/candidates'), 1000);
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
    
    // Suggest adding interviewers but don't require it
    let description = `Your availability has been shared with ${candidateName}`;
    if (availabilityForm.interviewers.length > 0) {
      description += ` with interview panel: ${availabilityForm.interviewers.join(', ')}`;
    }
    
    toast({
      title: "Interview proposal sent!",
      description: description,
    });
    
    // Reset form and go back
    setAvailabilityForm({ availableDates: [], duration: '', interviewers: [], additionalNotes: '' });
    setNewDateSlot({ date: '', startTime: '', endTime: '' });
    setNewInterviewer('');
    setTimeout(() => setLocation('/candidates'), 1000);
  };

  const addDateSlot = () => {
    if (!newDateSlot.date || !newDateSlot.startTime || !newDateSlot.endTime) {
      toast({
        title: "Complete the time slot",
        description: "Please fill in date, start time, and end time",
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

  const removeDateSlot = (index: number) => {
    setAvailabilityForm(prev => ({
      ...prev,
      availableDates: prev.availableDates.filter((_, i) => i !== index)
    }));
  };

  const addInterviewer = () => {
    if (!newInterviewer.trim()) {
      toast({
        title: "Please enter interviewer name",
        description: "Interviewer name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    if (availabilityForm.interviewers.includes(newInterviewer.trim())) {
      toast({
        title: "Interviewer already added",
        description: "This interviewer is already in the list",
        variant: "destructive"
      });
      return;
    }

    setAvailabilityForm(prev => ({
      ...prev,
      interviewers: [...prev.interviewers, newInterviewer.trim()]
    }));
    
    setNewInterviewer('');
  };

  const removeInterviewer = (index: number) => {
    setAvailabilityForm(prev => ({
      ...prev,
      interviewers: prev.interviewers.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => setLocation('/candidates')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Candidates
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2" style={{fontFamily: 'Sora'}}>
                Next Steps with {candidateInfo.name}
              </h1>
              <div className="flex items-center gap-4 text-gray-600 mb-2">
                <span>{candidateInfo.pronouns}</span>
                <span>•</span>
                <span>{candidateInfo.location}</span>
              </div>
              <p className="text-gray-600">
                Choose how you'd like to proceed with this candidate
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setLocation(`/candidates/${candidateId}`)}
              className="flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              View Profile
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Unified Action Interface */}
        <Card>
          <CardHeader>
            <CardTitle style={{fontFamily: 'Sora'}}>Connect with {candidateInfo.name}</CardTitle>
            <CardDescription>
              Send a message or propose interview times to move forward with {candidateInfo.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="interview" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Propose Interview
                </TabsTrigger>
                <TabsTrigger value="message" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Send Message
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="message" className="space-y-4 mt-6">
                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    value={messageForm.subject}
                    onChange={(e) => setMessageForm(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="e.g. Next steps for Marketing Assistant role"
                  />
                </div>
                
                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={messageForm.message}
                    onChange={(e) => setMessageForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Hi [candidate name], I'd love to discuss this role with you further. Feel free to book a convenient time using my Calendly link: [your-calendly-link] or let me know some times that work well for you. Looking forward to speaking soon!"
                    rows={6}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Tip: You can share your Calendly link for easy scheduling, or propose specific times
                  </p>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => setLocation('/candidates')}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSendMessage}
                    className="flex-1 bg-pink-600 hover:bg-pink-700"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="interview" className="space-y-4 mt-6">
                <div>
                  <Label className="text-base font-medium mb-3 block">
                    Add your available dates and times *
                  </Label>
                  
                  {/* Add new date/time slot */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={newDateSlot.date}
                          onChange={(e) => setNewDateSlot(prev => ({ ...prev, date: e.target.value }))}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <Label htmlFor="startTime">Start Time</Label>
                        <Input
                          id="startTime"
                          type="time"
                          value={newDateSlot.startTime}
                          onChange={(e) => setNewDateSlot(prev => ({ ...prev, startTime: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="endTime">End Time</Label>
                        <Input
                          id="endTime"
                          type="time"
                          value={newDateSlot.endTime}
                          onChange={(e) => setNewDateSlot(prev => ({ ...prev, endTime: e.target.value }))}
                        />
                      </div>
                    </div>
                    <Button
                      onClick={addDateSlot}
                      className="mt-3 bg-pink-600 hover:bg-pink-700"
                      size="sm"
                    >
                      Add Time Slot
                    </Button>
                  </div>

                  {/* Display added time slots */}
                  {availabilityForm.availableDates.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Your available times:</Label>
                      {availabilityForm.availableDates.map((dateSlot, index) => (
                        <div key={index} className="flex items-center justify-between bg-white border rounded-lg p-3">
                          <span className="text-sm">
                            {formatDate(dateSlot.date)} - {dateSlot.startTime} to {dateSlot.endTime}
                          </span>
                          <Button
                            onClick={() => removeDateSlot(index)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500">
                    Candidates will be able to select specific times within your available periods
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="duration">Interview duration *</Label>
                  <select
                    id="duration"
                    value={availabilityForm.duration}
                    onChange={(e) => setAvailabilityForm(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">Select duration</option>
                    {durationOptions.map((duration) => (
                      <option key={duration} value={duration}>
                        {duration}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">
                    Interview Panel
                  </Label>
                  
                  {/* Add new interviewer */}
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex gap-3">
                      <Input
                        value={newInterviewer}
                        onChange={(e) => setNewInterviewer(e.target.value)}
                        placeholder="e.g. Sarah Johnson (Hiring Manager)"
                        className="flex-1"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addInterviewer();
                          }
                        }}
                      />
                      <Button
                        onClick={addInterviewer}
                        className="bg-pink-600 hover:bg-pink-700"
                        size="sm"
                      >
                        Add Interviewer
                      </Button>
                    </div>
                  </div>

                  {/* Display added interviewers */}
                  {availabilityForm.interviewers.length > 0 && (
                    <div className="space-y-2 mt-3">
                      <Label className="text-sm font-medium text-gray-700">Interview panel:</Label>
                      {availabilityForm.interviewers.map((interviewer, index) => (
                        <div key={index} className="flex items-center justify-between bg-white border rounded-lg p-3">
                          <span className="text-sm">{interviewer}</span>
                          <Button
                            onClick={() => removeInterviewer(index)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Include names and roles for transparency (e.g. "Sarah Johnson - Hiring Manager")
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="notes">Additional message (optional)</Label>
                  <Textarea
                    id="notes"
                    value={availabilityForm.additionalNotes}
                    onChange={(e) => setAvailabilityForm(prev => ({ ...prev, additionalNotes: e.target.value }))}
                    placeholder="Any additional context about the interview format or what to expect..."
                    rows={3}
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => setLocation('/candidates')}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitAvailability}
                    className="flex-1 bg-pink-600 hover:bg-pink-700"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Propose Interview Times
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}