import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin,
  Video,
  Coffee,
  GraduationCap,
  Network,
  CheckCircle,
  ArrowLeft,
  Plus,
  CalendarPlus,
  Download
} from "lucide-react";
import { Link } from "wouter";

interface Event {
  id: string;
  title: string;
  type: 'workshop' | 'networking' | 'masterclass' | 'drop-in' | 'interview';
  date: string;
  time: string;
  duration: string;
  location: string;
  description: string;
  attendees?: number;
  maxAttendees?: number;
  facilitator?: string;
  company?: string;
  status?: 'upcoming' | 'booked' | 'completed' | 'invited' | 'scheduled';
  points?: number;
}

const MASTER_SCHEDULE_EVENTS: Event[] = [
  // Weekly Drop-ins (Booked)
  {
    id: 'drop-in-1',
    title: 'Weekly Community Drop-in',
    type: 'drop-in',
    date: '2025-01-20',
    time: '13:00',
    duration: '60 minutes',
    location: 'Online via Zoom',
    description: 'Informal chat with the Pollen team - no agenda, just genuine conversation and career support',
    attendees: 42,
    maxAttendees: 100,
    facilitator: 'Pollen Team',
    status: 'booked',
    points: 30
  },
  {
    id: 'drop-in-2',
    title: 'Weekly Community Drop-in',
    type: 'drop-in',
    date: '2025-01-27',
    time: '13:00',
    duration: '60 minutes',
    location: 'Online via Zoom',
    description: 'Informal chat with the Pollen team - no agenda, just genuine conversation and career support',
    attendees: 23,
    maxAttendees: 100,
    facilitator: 'Pollen Team',
    status: 'booked',
    points: 30
  },
  
  // Events (Booked)
  {
    id: 'workshop-1',
    title: 'Skills Showcase Workshop',
    type: 'workshop',
    date: '2025-01-22',
    time: '18:00',
    duration: '90 minutes',
    location: 'Online via Zoom',
    description: 'Learn how to effectively demonstrate your skills through real-world projects and applications',
    attendees: 85,
    maxAttendees: 100,
    facilitator: 'Sarah Chen',
    status: 'booked',
    points: 50
  },
  {
    id: 'networking-1',
    title: 'Virtual Networking Night',
    type: 'networking',
    date: '2025-01-24',
    time: '19:00',
    duration: '120 minutes',
    location: 'Online via Zoom',
    description: 'Connect with fellow job seekers and industry professionals',
    attendees: 45,
    maxAttendees: 60,
    facilitator: 'Emma Wilson',
    status: 'booked',
    points: 40
  },
  {
    id: 'masterclass-1',
    title: 'Interview Confidence Masterclass',
    type: 'masterclass',
    date: '2025-01-25',
    time: '14:00',
    duration: '2 hours',
    location: 'Online via Zoom',
    description: 'Master the art of interviewing with confidence and authenticity',
    attendees: 120,
    maxAttendees: 150,
    facilitator: 'Holly Saunders',
    status: 'booked',
    points: 80
  },
  
  // Interviews (Confirmed)
  {
    id: 'interview-1',
    title: 'Marketing Assistant Interview',
    type: 'interview',
    date: '2025-01-21',
    time: '14:00',
    duration: '30 minutes',
    location: 'Online via Google Meet',
    description: 'Interview with Holly Saunders (Pollen Screening)',
    company: 'Pollen Platform',
    status: 'scheduled',
    points: 30
  },
  {
    id: 'interview-2',
    title: 'Content Writer Interview',
    type: 'interview',
    date: '2025-01-23',
    time: '10:00',
    duration: '45 minutes',
    location: 'Online via Zoom',
    description: 'Interview with Hiring Manager',
    company: 'Creative Solutions Ltd',
    status: 'scheduled',
    points: 30
  }
];

const getEventIcon = (type: string) => {
  switch (type) {
    case 'workshop': return GraduationCap;
    case 'networking': return Network;
    case 'masterclass': return Users;
    case 'drop-in': return Coffee;
    case 'interview': return Video;
    default: return Calendar;
  }
};

const getEventColor = (type: string) => {
  switch (type) {
    case 'interview': return 'bg-blue-50 border-blue-200 text-blue-700';
    case 'workshop': 
    case 'networking':
    case 'masterclass': 
    case 'drop-in': return 'bg-gray-50 border-gray-200 text-gray-700';
    default: return 'bg-gray-50 border-gray-200 text-gray-700';
  }
};

const getStatusBadge = (status: string, type: string) => {
  switch (status) {
    case 'booked':
      return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Booked</Badge>;
    case 'scheduled':
      return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Scheduled</Badge>;
    case 'invited':
      return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Needs Booking</Badge>;
    case 'completed':
      return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Completed</Badge>;
    default:
      return <Badge variant="outline">Available</Badge>;
  }
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

const formatTime = (timeString: string) => {
  const [hours, minutes] = timeString.split(':');
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes));
  return date.toLocaleTimeString('en-GB', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
};

export default function MasterSchedulePage() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const filteredEvents = MASTER_SCHEDULE_EVENTS.filter(event => {
    if (selectedTab === "all") return true;
    return event.type === selectedTab;
  });

  const sortedEvents = filteredEvents.sort((a, b) => {
    return new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime();
  });

  // Calendar functions
  const createCalendarEvent = (event: Event) => {
    const startDateTime = new Date(`${event.date}T${event.time}:00`);
    const durationMinutes = parseInt(event.duration.split(' ')[0]) * (event.duration.includes('hour') ? 60 : 1);
    const endDateTime = new Date(startDateTime.getTime() + (durationMinutes * 60 * 1000));
    
    return {
      title: event.title,
      start: startDateTime,
      end: endDateTime,
      description: `${event.description}${event.facilitator ? `\n\nFacilitator: ${event.facilitator}` : ''}${event.company ? `\nCompany: ${event.company}` : ''}`,
      location: event.location
    };
  };

  const handleAddToGoogleCalendar = (event: Event) => {
    const calendarEvent = createCalendarEvent(event);
    
    const formatDateTime = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
    };

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(calendarEvent.title)}&dates=${formatDateTime(calendarEvent.start)}/${formatDateTime(calendarEvent.end)}&details=${encodeURIComponent(calendarEvent.description)}&location=${encodeURIComponent(calendarEvent.location)}`;
    
    window.open(googleCalendarUrl, '_blank');
    
    toast({
      title: "Added to Google Calendar",
      description: `${event.title} has been added to your calendar`,
    });
  };

  const handleAddToOutlookCalendar = (event: Event) => {
    const calendarEvent = createCalendarEvent(event);
    
    const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(calendarEvent.title)}&startdt=${encodeURIComponent(calendarEvent.start.toISOString())}&enddt=${encodeURIComponent(calendarEvent.end.toISOString())}&body=${encodeURIComponent(calendarEvent.description)}&location=${encodeURIComponent(calendarEvent.location)}`;
    
    window.open(outlookUrl, '_blank');
    
    toast({
      title: "Added to Outlook Calendar",
      description: `${event.title} has been added to your calendar`,
    });
  };

  const handleDownloadICS = (event: Event) => {
    const calendarEvent = createCalendarEvent(event);
    
    const formatICSDateTime = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
    };

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Pollen Platform//Schedule//EN
BEGIN:VEVENT
UID:${event.id}@pollen.app
DTSTART:${formatICSDateTime(calendarEvent.start)}
DTEND:${formatICSDateTime(calendarEvent.end)}
SUMMARY:${calendarEvent.title}
DESCRIPTION:${calendarEvent.description.replace(/\n/g, '\\n')}
LOCATION:${calendarEvent.location}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.title.replace(/[^a-z0-9]/gi, '_')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Calendar File Downloaded",
      description: `${event.title}.ics has been downloaded`,
    });
  };

  const handleAddAllToCalendar = (calendarType: 'google' | 'outlook' | 'ics') => {
    sortedEvents.forEach((event, index) => {
      setTimeout(() => {
        if (calendarType === 'google') {
          handleAddToGoogleCalendar(event);
        } else if (calendarType === 'outlook') {
          handleAddToOutlookCalendar(event);
        } else {
          handleDownloadICS(event);
        }
      }, index * 500); // Stagger the additions by 500ms to avoid overwhelming the browser
    });
    
    toast({
      title: "Adding All Events to Calendar",
      description: `${sortedEvents.length} events are being added to your calendar`,
    });
  };

  const getInterviewRoute = (event: Event) => {
    // Map interview events to their application IDs for routing
    const interviewApplicationMap: { [key: string]: string } = {
      'interview-1': '1', // Marketing Assistant 
      'interview-2': '3'  // Content Writer
    };
    
    const applicationId = interviewApplicationMap[event.id];
    if (!applicationId) return '/applications';
    
    // Route to confirmation page for scheduled interviews, booking page for invited
    return event.status === 'scheduled' 
      ? `/interview-confirmation/${applicationId}`
      : `/interview-schedule/${applicationId}`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            My Schedule
          </h1>
          <p className="text-gray-600">Your confirmed events, drop-ins, and interviews</p>
        </div>
        
        {/* Add All to Calendar Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="flex items-center gap-2">
              <CalendarPlus className="w-4 h-4" />
              Add All to Calendar
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleAddAllToCalendar('google')}>
              <Calendar className="w-4 h-4 mr-2" />
              Google Calendar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddAllToCalendar('outlook')}>
              <Calendar className="w-4 h-4 mr-2" />
              Outlook Calendar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddAllToCalendar('ics')}>
              <Download className="w-4 h-4 mr-2" />
              Download .ics
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>



      {/* Filter Tabs - Enhanced sliding bar visibility */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="interview">Interviews</TabsTrigger>
          <TabsTrigger value="drop-in">Drop-ins</TabsTrigger>
          <TabsTrigger value="workshop">Workshops</TabsTrigger>
          <TabsTrigger value="networking">Networking</TabsTrigger>
          <TabsTrigger value="masterclass">Masterclass</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedEvents.map((event) => {
              const IconComponent = getEventIcon(event.type);
              return (
                <Card key={event.id} className={`${getEventColor(event.type)} border-l-4 h-full`}>
                  <CardContent className="p-4 h-full flex flex-col">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 text-sm leading-tight">{event.title}</h3>
                          {getStatusBadge(event.status || 'upcoming', event.type)}
                        </div>
                        {event.points && (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-800 text-xs mb-2">
                            +{event.points} points
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-3 flex-1">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(event.time)} • {event.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{event.location}</span>
                      </div>
                      {event.attendees && (
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Users className="w-3 h-3" />
                          <span>{event.attendees}/{event.maxAttendees} attending</span>
                        </div>
                      )}
                      {event.facilitator && (
                        <p className="text-xs text-gray-500 truncate">
                          {event.type === 'interview' ? 'Interviewer' : 'Facilitator'}: {event.facilitator}
                        </p>
                      )}
                      {event.company && (
                        <p className="text-xs text-gray-500 truncate">Company: {event.company}</p>
                      )}
                    </div>
                    
                    <div className="mt-auto space-y-2">
                      {/* Event-specific Action Button */}
                      {event.type === 'interview' && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full text-xs"
                          onClick={() => setLocation(getInterviewRoute(event))}
                        >
                          View Interview Details
                        </Button>
                      )}
                      {event.type === 'drop-in' && (
                        <Button size="sm" variant="outline" className="w-full text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Booked
                        </Button>
                      )}
                      {['workshop', 'networking', 'masterclass'].includes(event.type) && (
                        <Button size="sm" variant="outline" className="w-full text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Registered
                        </Button>
                      )}
                      
                      {/* Add to Calendar Dropdown for each event */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost" className="w-full text-xs text-gray-600">
                            <CalendarPlus className="w-3 h-3 mr-1" />
                            Add to Calendar
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleAddToGoogleCalendar(event)}>
                            <Calendar className="w-3 h-3 mr-2" />
                            Google Calendar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAddToOutlookCalendar(event)}>
                            <Calendar className="w-3 h-3 mr-2" />
                            Outlook Calendar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownloadICS(event)}>
                            <Download className="w-3 h-3 mr-2" />
                            Download .ics
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}