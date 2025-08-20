import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { 
  Calendar, Clock, MapPin, Users, Video, Phone, 
  Plus, Edit, Trash2, CheckCircle, AlertCircle,
  Send, ExternalLink, Copy, Settings
} from "lucide-react";

interface CalendarEvent {
  id: number;
  title: string;
  type: 'interview' | 'assessment' | 'callback' | 'meeting';
  candidateId?: number;
  candidateName?: string;
  employerId?: number;
  employerName?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  videoLink?: string;
  notes?: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  reminderSent: boolean;
}

interface TimeSlot {
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
  eventId?: number;
}

interface CalendarIntegrationProps {
  userId: number;
  userType: 'job_seeker' | 'employer';
}

export default function CalendarIntegration({ userId, userType }: CalendarIntegrationProps) {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Mock calendar events
  const mockEvents: CalendarEvent[] = [
    {
      id: 1,
      title: "Initial Interview - Marketing Assistant",
      type: 'interview',
      candidateId: userType === 'employer' ? 123 : undefined,
      candidateName: userType === 'employer' ? "Sarah Johnson" : undefined,
      employerId: userType === 'job_seeker' ? 456 : undefined,
      employerName: userType === 'job_seeker' ? "TechCorp Ltd" : undefined,
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000),
      location: "Video Call",
      videoLink: "https://meet.google.com/abc-def-ghi",
      notes: "Discuss marketing experience and portfolio",
      status: 'scheduled',
      reminderSent: false
    },
    {
      id: 2,
      title: "Skills Assessment - Data Analysis",
      type: 'assessment',
      candidateId: userType === 'employer' ? 124 : undefined,
      candidateName: userType === 'employer' ? "Michael Chen" : undefined,
      startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000),
      location: "Online Platform",
      notes: "Excel and analytics skills challenge",
      status: 'confirmed',
      reminderSent: true
    }
  ];

  const availableTimeSlots: TimeSlot[] = [
    { date: selectedDate, startTime: "09:00", endTime: "10:00", available: true },
    { date: selectedDate, startTime: "10:00", endTime: "11:00", available: false, eventId: 1 },
    { date: selectedDate, startTime: "11:00", endTime: "12:00", available: true },
    { date: selectedDate, startTime: "14:00", endTime: "15:00", available: true },
    { date: selectedDate, startTime: "15:00", endTime: "16:00", available: true },
    { date: selectedDate, startTime: "16:00", endTime: "17:00", available: false, eventId: 2 }
  ];

  const createEventMutation = useMutation({
    mutationFn: async (eventData: Partial<CalendarEvent>) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { id: Math.floor(Math.random() * 1000) + 100 };
    },
    onSuccess: () => {
      toast({
        title: "Event Created",
        description: "Calendar event has been scheduled successfully."
      });
      setShowCreateEvent(false);
    }
  });

  const updateEventMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<CalendarEvent> }) => {
      await new Promise(resolve => setTimeout(resolve, 800));
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Event Updated",
        description: "Calendar event has been updated successfully."
      });
    }
  });

  const sendReminderMutation = useMutation({
    mutationFn: async (eventId: number) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Reminder Sent",
        description: "Email reminder has been sent to all participants."
      });
    }
  });

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'interview': return 'bg-blue-100 text-blue-800';
      case 'assessment': return 'bg-purple-100 text-purple-800';
      case 'callback': return 'bg-green-100 text-green-800';
      case 'meeting': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Link copied to clipboard"
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Calendar & Scheduling</h1>
          <p className="text-gray-600">Manage interviews and assessment appointments</p>
        </div>
        <Button onClick={() => setShowCreateEvent(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Schedule Event
        </Button>
      </div>

      <Tabs defaultValue="calendar" className="space-y-6">
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="availability">Set Availability</TabsTrigger>
          <TabsTrigger value="settings">Integration Settings</TabsTrigger>
        </TabsList>

        {/* Calendar View */}
        <TabsContent value="calendar" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Date Picker & Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Select Date
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
                
                <div className="space-y-2">
                  <h4 className="font-medium">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Video className="w-4 h-4 mr-2" />
                      Schedule Video Interview
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Clock className="w-4 h-4 mr-2" />
                      Book Skills Assessment
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Phone className="w-4 h-4 mr-2" />
                      Schedule Callback
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Time Slots */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Available Time Slots - {new Date(selectedDate).toLocaleDateString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableTimeSlots.map((slot, index) => (
                    <Button
                      key={index}
                      variant={slot.available ? "outline" : "secondary"}
                      className={`p-4 h-auto flex-col ${!slot.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={!slot.available}
                    >
                      <div className="font-medium">{slot.startTime} - {slot.endTime}</div>
                      <div className="text-xs text-gray-500">
                        {slot.available ? 'Available' : 'Booked'}
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Upcoming Events */}
        <TabsContent value="upcoming" className="space-y-6">
          <div className="space-y-4">
            {mockEvents.map((event) => (
              <Card key={event.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold">{event.title}</h3>
                        <Badge className={getEventTypeColor(event.type)}>
                          {event.type}
                        </Badge>
                        <Badge className={getStatusColor(event.status)}>
                          {event.status}
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{event.startTime.toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>
                              {event.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                              {event.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>{event.location}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {userType === 'employer' && event.candidateName && (
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span>Candidate: {event.candidateName}</span>
                            </div>
                          )}
                          {userType === 'job_seeker' && event.employerName && (
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span>Employer: {event.employerName}</span>
                            </div>
                          )}
                          {event.videoLink && (
                            <div className="flex items-center gap-2 text-sm">
                              <Video className="w-4 h-4 text-gray-400" />
                              <button
                                onClick={() => copyToClipboard(event.videoLink!)}
                                className="text-blue-600 hover:underline"
                              >
                                Video Link
                              </button>
                              <Copy className="w-3 h-3 text-gray-400 cursor-pointer" />
                            </div>
                          )}
                        </div>
                      </div>

                      {event.notes && (
                        <div className="p-3 bg-gray-50 rounded-lg mb-4">
                          <h4 className="font-medium text-sm mb-1">Notes:</h4>
                          <p className="text-sm text-gray-600">{event.notes}</p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        {event.videoLink && (
                          <Button size="sm" variant="outline">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Join Meeting
                          </Button>
                        )}
                        {!event.reminderSent && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => sendReminderMutation.mutate(event.id)}
                            disabled={sendReminderMutation.isPending}
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Send Reminder
                          </Button>
                        )}
                        {event.status === 'scheduled' && (
                          <Button
                            size="sm"
                            onClick={() => updateEventMutation.mutate({
                              id: event.id,
                              updates: { status: 'confirmed' }
                            })}
                            disabled={updateEventMutation.isPending}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Confirm
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Set Availability */}
        <TabsContent value="availability" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Set Your Availability</CardTitle>
              <p className="text-sm text-gray-600">
                Configure your available hours for scheduling interviews and assessments
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-base font-medium">Weekly Schedule</Label>
                  <div className="space-y-3 mt-3">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                      <div key={day} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">{day}</span>
                        <div className="flex items-center gap-3">
                          <Input type="time" defaultValue="09:00" className="w-24" />
                          <span className="text-sm text-gray-500">to</span>
                          <Input type="time" defaultValue="17:00" className="w-24" />
                          <input type="checkbox" defaultChecked={day !== 'Saturday' && day !== 'Sunday'} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">Preferences</Label>
                  <div className="space-y-4 mt-3">
                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select defaultValue="GMT">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GMT">GMT (London)</SelectItem>
                          <SelectItem value="EST">EST (New York)</SelectItem>
                          <SelectItem value="PST">PST (Los Angeles)</SelectItem>
                          <SelectItem value="CET">CET (Paris)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="buffer">Buffer Time Between Events</Label>
                      <Select defaultValue="15">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 minutes</SelectItem>
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="advance">Minimum Advance Notice</Label>
                      <Select defaultValue="24">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2">2 hours</SelectItem>
                          <SelectItem value="24">24 hours</SelectItem>
                          <SelectItem value="48">48 hours</SelectItem>
                          <SelectItem value="168">1 week</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <span className="font-medium">Auto-confirm bookings</span>
                        <p className="text-sm text-gray-500">Automatically confirm new appointments</p>
                      </div>
                      <input type="checkbox" defaultChecked />
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full">
                Save Availability Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integration Settings */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Calendar Integrations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <span className="font-medium">Google Calendar</span>
                      <p className="text-sm text-gray-500">Sync with your Google Calendar</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <span className="font-medium">Outlook Calendar</span>
                      <p className="text-sm text-gray-500">Sync with Microsoft Outlook</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <span className="font-medium">Apple Calendar</span>
                      <p className="text-sm text-gray-500">Sync with iCloud Calendar</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <span className="font-medium">Email Reminders</span>
                    <p className="text-sm text-gray-500">Send email reminders for upcoming events</p>
                  </div>
                  <input type="checkbox" defaultChecked />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <span className="font-medium">SMS Notifications</span>
                    <p className="text-sm text-gray-500">Send SMS alerts for important events</p>
                  </div>
                  <input type="checkbox" />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <span className="font-medium">Browser Notifications</span>
                    <p className="text-sm text-gray-500">Show desktop notifications</p>
                  </div>
                  <input type="checkbox" defaultChecked />
                </div>

                <div>
                  <Label>Reminder Timing</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <label className="text-sm">24 hours before</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked />
                      <label className="text-sm">1 hour before</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" />
                      <label className="text-sm">15 minutes before</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" />
                      <label className="text-sm">At event time</label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Event Modal would go here */}
      {showCreateEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Schedule New Event</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Event Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="assessment">Skills Assessment</SelectItem>
                    <SelectItem value="callback">Callback</SelectItem>
                    <SelectItem value="meeting">General Meeting</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Title</Label>
                <Input placeholder="Event title" />
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
                <Label>Duration</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button 
                  className="flex-1"
                  onClick={() => createEventMutation.mutate({})}
                  disabled={createEventMutation.isPending}
                >
                  {createEventMutation.isPending ? "Creating..." : "Create Event"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateEvent(false)}
                >
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