import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft,
  Calendar, 
  Clock, 
  Users, 
  MapPin,
  Video,
  Coffee,
  MessageCircle,
  CheckCircle,
  Heart,
  Star,
  Mic,
  ExternalLink,
  Download,
  Check,
  ChevronDown
} from "lucide-react";
import { useState } from "react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export default function WeeklyDropInPage() {
  const { toast } = useToast();
  const [bookedSessions, setBookedSessions] = useState<Set<number>>(new Set());

  // Calendar integration functions
  const createCalendarEvent = (session: any, index: number) => {
    const startDate = new Date(`${session.date} ${session.time}`);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration
    
    return {
      title: 'Weekly Drop-in Session with Pollen Team',
      start: startDate,
      end: endDate,
      description: 'Informal career support session with the Pollen team. No agenda, just genuine conversation and guidance.',
      location: 'Online via Zoom'
    };
  };

  const handleGoogleCalendar = (session: any, index: number) => {
    const event = createCalendarEvent(session, index);
    const formatDate = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${formatDate(event.start)}/${formatDate(event.end)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
    
    window.open(googleUrl, '_blank');
  };

  const handleOutlookCalendar = (session: any, index: number) => {
    const event = createCalendarEvent(session, index);
    const formatDate = (date: Date) => date.toISOString();
    
    const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(event.title)}&startdt=${formatDate(event.start)}&enddt=${formatDate(event.end)}&body=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
    
    window.open(outlookUrl, '_blank');
  };

  const handleICalDownload = (session: any, index: number) => {
    const event = createCalendarEvent(session, index);
    const formatDate = (date: Date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const icalContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Pollen//Weekly Drop-in//EN
BEGIN:VEVENT
UID:${Date.now()}@pollen.com
DTSTART:${formatDate(event.start)}
DTEND:${formatDate(event.end)}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `weekly-drop-in-${session.date.replace(/[^a-zA-Z0-9]/g, '-')}.ics`;
    link.click();
  };

  const handleBookSession = async (index: number) => {
    setBookedSessions(prev => new Set([...prev, index]));
    
    // Award points for booking event
    try {
      const response = await fetch('/api/community/activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activityType: 'event',
          qualityScore: 5, // High quality for booking attendance
          metadata: {
            eventType: 'weekly_drop_in',
            sessionDate: upcomingSessions[index]?.date
          }
        })
      });

      if (response.ok) {
        const pointsEarned = 30; // Points for event attendance
        toast({
          title: "Session Booked!",
          description: `You've earned ${pointsEarned} points! You'll receive a Zoom link via email closer to the session time.`,
          action: (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = '/master-schedule'}
            >
              View Schedule
            </Button>
          ),
        });
      } else {
        toast({
          title: "Session Booked!",
          description: "You'll receive a Zoom link via email closer to the session time.",
          action: (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = '/master-schedule'}
            >
              View Schedule
            </Button>
          ),
        });
      }
    } catch (error) {
      console.error('Error awarding points:', error);
      toast({
        title: "Session Booked!",
        description: "You'll receive a Zoom link via email closer to the session time.",
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.href = '/master-schedule'}
          >
            View Schedule
          </Button>
        ),
      });
    }
  };

  const upcomingSessions = [
    {
      date: "December 23, 2024",
      time: "1:00 PM GMT",
      facilitator: "Pollen Team",
      attendees: 42,
      maxAttendees: 100
    },
    {
      date: "December 30, 2024", 
      time: "1:00 PM GMT",
      facilitator: "Pollen Team",
      attendees: 23,
      maxAttendees: 100
    },
    {
      date: "January 6, 2025",
      time: "1:00 PM GMT", 
      facilitator: "Pollen Team",
      attendees: 15,
      maxAttendees: 100
    }
  ];

  const benefits = [
    {
      icon: Users,
      title: "Peer Support Network",
      description: "Connect with other job seekers and professionals who understand your journey"
    },
    {
      icon: MessageCircle,
      title: "Open Discussion",
      description: "Share challenges, celebrate wins, and get advice in a supportive environment"
    },
    {
      icon: Star,
      title: "Expert Guidance",
      description: "Get insights from career coaches and industry professionals"
    },
    {
      icon: Heart,
      title: "No Pressure Environment",
      description: "Drop in when you can, no commitment required - just come as you are"
    }
  ];



  const whatToExpect = [
    "Informal, low-pressure environment to meet the Pollen team",
    "Open discussion where you can ask any career-related questions",
    "Human support and guidance from our team members"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Weekly Community Drop-in</h1>
            <p className="text-lg text-gray-600 mt-1">Your regular career support network</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <div className="p-8 rounded-lg mb-6 border" style={{ backgroundColor: '#FFFCE5' }}>
              <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Sora', color: '#272727' }}>Meet the Pollen Team Every Monday</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" style={{ color: '#E2007A' }} />
                  <span style={{ color: '#272727' }}>1:00 PM GMT</span>
                </div>
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5" style={{ color: '#E2007A' }} />
                  <span style={{ color: '#272727' }}>Online via Zoom</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" style={{ color: '#E2007A' }} />
                  <span style={{ color: '#272727' }}>Open to all community members</span>
                </div>
              </div>
              <p className="mt-4 text-gray-600" style={{ fontFamily: 'Poppins' }}>
                No agenda, no pressure - just come as you are and get the human support you need.
              </p>
              <div className="flex gap-3 mt-6">
                <Button 
                  className="hover:opacity-90"
                  style={{ backgroundColor: '#E2007A', color: 'white', fontFamily: 'Sora' }}
                  onClick={() => handleBookSession(0)}
                >
                  {bookedSessions.has(0) ? 'Booked!' : 'Join Next Session'}
                </Button>
                {bookedSessions.has(0) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="hover:bg-pink-50" style={{ borderColor: '#E2007A', color: '#E2007A' }}>
                        <Calendar className="w-4 h-4 mr-2" />
                        Add to Calendar
                        <ChevronDown className="w-4 h-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleGoogleCalendar(upcomingSessions[0], 0)}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Google Calendar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleOutlookCalendar(upcomingSessions[0], 0)}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Outlook Calendar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleICalDownload(upcomingSessions[0], 0)}>
                        <Download className="w-4 h-4 mr-2" />
                        iCalendar (.ics)
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Sora' }}>
                  <CheckCircle className="w-5 h-5" style={{ color: '#00B878' }} />
                  Session Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {whatToExpect.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-1" style={{ color: '#E2007A' }}>•</span>
                      <span className="text-sm text-gray-600" style={{ fontFamily: 'Poppins' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Upcoming Sessions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ fontFamily: 'Sora' }}>
                  <Calendar className="w-5 h-5" style={{ color: '#E2007A' }} />
                  Upcoming Sessions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingSessions.map((session, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">Weekly Drop-in Session</h4>
                          <p className="text-sm text-gray-600">With the {session.facilitator}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {session.attendees}/{session.maxAttendees}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {session.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {session.time}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {bookedSessions.has(index) ? (
                          <div className="flex items-center gap-2 w-full">
                            <Button size="sm" variant="outline" className="flex-1" disabled>
                              <Check className="w-4 h-4 mr-2" />
                              Booked
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <Calendar className="w-4 h-4 mr-2" />
                                  Calendar
                                  <ChevronDown className="w-4 h-4 ml-2" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleGoogleCalendar(session, index)}>
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  Google Calendar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleOutlookCalendar(session, index)}>
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  Outlook Calendar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleICalDownload(session, index)}>
                                  <Download className="w-4 h-4 mr-2" />
                                  iCalendar (.ics)
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full"
                            onClick={() => handleBookSession(index)}
                          >
                            {index === 0 ? 'Join This Week' : 'Book Session'}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Spread Across Both Columns */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle style={{ fontFamily: 'Sora' }}>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Do I need to attend every week?</h4>
                  <p className="text-sm text-gray-600">Not at all! Drop in whenever you can. There's no pressure or commitment required - just come when you need support.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">What if I'm shy or don't know what to ask?</h4>
                  <p className="text-sm text-gray-600">The Pollen team creates a welcoming, low-pressure environment. You can start by just listening, and we'll help you feel comfortable joining the conversation.</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Are the sessions recorded?</h4>
                  <p className="text-sm text-gray-600">No, we don't record sessions to maintain privacy and encourage open, honest discussion in a safe space.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">What kind of questions can I ask?</h4>
                  <p className="text-sm text-gray-600">Anything career-related! Whether you're stuck on applications, need interview advice, or just want to chat about your job search journey.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom CTA */}
        <Card className="mt-8 border" style={{ backgroundColor: '#FFFCE5' }}>
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'Sora', color: '#272727' }}>
              Ready to Join Our Community?
            </h3>
            <p className="text-gray-600 mb-4" style={{ fontFamily: 'Poppins' }}>
              Connect with fellow job seekers, get support, and accelerate your career journey.
            </p>
            <div className="flex gap-3 justify-center">
              <Button 
                className="hover:opacity-90"
                style={{ backgroundColor: '#E2007A', color: 'white', fontFamily: 'Sora' }}
              >
                Join Next Session
              </Button>
              <Button 
                variant="outline" 
                className="hover:bg-pink-50"
                style={{ borderColor: '#E2007A', color: '#E2007A', fontFamily: 'Sora' }}
              >
                Add to Calendar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}