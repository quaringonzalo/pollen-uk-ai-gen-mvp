import { useState } from "react";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  MessageCircle, Calendar, Clock, CheckCircle2, 
  Building2, User, Send, CalendarDays, Video,
  ChevronLeft, Star, MapPin
} from "lucide-react";

interface AvailabilitySlot {
  date: string;
  times: string[];
}

export default function ApplicationResponsePage() {
  const { applicationId } = useParams();
  const [selectedTab, setSelectedTab] = useState("chat");
  const [chatMessage, setChatMessage] = useState("");
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([
    { date: "2024-01-25", times: [] },
    { date: "2024-01-26", times: [] },
    { date: "2024-01-29", times: [] },
    { date: "2024-01-30", times: [] },
    { date: "2024-01-31", times: [] }
  ]);

  // Mock application data
  const applicationData = {
    id: applicationId || "app-001",
    jobTitle: "Marketing Coordinator",
    company: {
      name: "Growth Partners",
      logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=50&h=50&fit=crop&crop=centre",
      rating: 4.4,
      location: "Manchester, UK"
    },
    submittedDate: "2024-01-20",
    status: "employer_interested",
    employerMessage: "Hi! We're really impressed with your profile and verified skills. We'd love to have a conversation about this role and learn more about your interest in marketing coordination. Would you be available for a 30-minute video call this week?",
    employerName: "James Wilson",
    employerTitle: "Marketing Manager"
  };

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
  ];

  const toggleTimeSlot = (dateIndex: number, time: string) => {
    setAvailability(prev => 
      prev.map((slot, index) => 
        index === dateIndex 
          ? {
              ...slot,
              times: slot.times.includes(time)
                ? slot.times.filter(t => t !== time)
                : [...slot.times, time].sort()
            }
          : slot
      )
    );
  };

  const sendChatMessage = () => {
    if (chatMessage.trim()) {
      console.log("Sending chat message:", chatMessage);
      setChatMessage("");
      // In real app, this would send the message via API
    }
  };

  const submitAvailability = () => {
    const selectedSlots = availability.filter(slot => slot.times.length > 0);
    console.log("Submitting availability:", selectedSlots);
    // In real app, this would send availability via API
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => window.location.href = '/saved-items'}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Applications
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Application Response</h1>
                <p className="text-gray-600">{applicationData.jobTitle} at {applicationData.company.name}</p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Employer Interested
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Application Summary */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <img
                src={applicationData.company.logo}
                alt={`${applicationData.company.name} logo`}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{applicationData.jobTitle}</h2>
                <div className="flex items-center gap-4 text-gray-600 mb-3">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {applicationData.company.name}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{applicationData.company.rating}</span>
                  </div>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {applicationData.company.location}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Applied on {new Date(applicationData.submittedDate).toLocaleDateString()} • Response received
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employer Message */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Message from {applicationData.employerName}
            </CardTitle>
            <p className="text-sm text-gray-600">{applicationData.employerTitle}</p>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-700">{applicationData.employerMessage}</p>
            </div>
          </CardContent>
        </Card>

        {/* Response Options */}
        <Card>
          <CardHeader>
            <CardTitle>How would you like to respond?</CardTitle>
            <p className="text-gray-600">Choose your preferred way to connect with the employer</p>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Chat & Arrange
                </TabsTrigger>
                <TabsTrigger value="calendar" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Share Availability
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Chat with the Employer</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Start a conversation to discuss the role, ask questions, and arrange a time to meet.
                  </p>
                  
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Type your message here... e.g., 'Thank you for your interest! I'm excited to learn more about this role. When would be a good time for a call?'"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      className="min-h-[100px]"
                    />
                    
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500">
                        Your message will be sent directly to {applicationData.employerName}
                      </p>
                      <Button onClick={sendChatMessage} disabled={!chatMessage.trim()}>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Benefits of Chat</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Ask questions about the role before committing to a meeting</li>
                    <li>• Build rapport with the hiring manager</li>
                    <li>• Arrange a time that works for both of you</li>
                    <li>• Get a feel for company culture through conversation</li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="calendar" className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Share Your Availability</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Select times when you're available for a 30-minute video call. The employer will pick a time that works for them and send you a calendar invite.
                  </p>

                  <div className="space-y-4">
                    {availability.map((slot, dateIndex) => {
                      const date = new Date(slot.date);
                      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      
                      return (
                        <div key={slot.date} className="border rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <CalendarDays className="w-4 h-4 text-gray-500" />
                            <span className="font-medium">{dayName}, {dateStr}</span>
                            {slot.times.length > 0 && (
                              <Badge variant="secondary">{slot.times.length} slots selected</Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-6 gap-2">
                            {timeSlots.map(time => (
                              <Button
                                key={time}
                                variant={slot.times.includes(time) ? "default" : "outline"}
                                size="sm"
                                onClick={() => toggleTimeSlot(dateIndex, time)}
                                className="text-xs"
                              >
                                {time}
                              </Button>
                            ))}
                          </div>
                        </div>
                      );
                    })}

                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="text-sm font-medium mb-2 block">Preferred Meeting Platform</label>
                        <select className="w-full p-2 border rounded-md">
                          <option>No preference (let employer choose)</option>
                          <option>Google Meet</option>
                          <option>Microsoft Teams</option>
                          <option>Zoom</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4">
                      <p className="text-xs text-gray-500">
                        Total slots selected: {availability.reduce((sum, slot) => sum + slot.times.length, 0)}
                      </p>
                      <Button 
                        onClick={submitAvailability}
                        disabled={availability.every(slot => slot.times.length === 0)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Share Availability
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">How This Works</h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Select multiple time slots to give the employer flexibility</li>
                    <li>• They'll choose one slot and send you a calendar invite</li>
                    <li>• Meeting link will be included in the invite</li>
                    <li>• You'll get a confirmation email 24 hours before the meeting</li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}