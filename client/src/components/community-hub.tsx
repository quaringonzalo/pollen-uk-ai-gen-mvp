import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, GraduationCap, MessageSquare, Clock, MapPin, Video, Award } from "lucide-react";

export default function CommunityHub() {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // Mock data for demo - in production this would come from API
  const events = [
    {
      id: 1,
      title: "Skills Showcase Masterclass",
      description: "Learn how to effectively demonstrate your abilities through practical projects and applications",
      eventType: "masterclass",
      startDate: "2024-12-20T18:00:00Z",
      location: "Virtual",
      isVirtual: true,
      maxAttendees: 50,
      currentAttendees: 32,
      cost: 0,
      facilitator: "Sarah Johnson, Career Coach",
      tags: ["Skills Development", "Project Portfolio", "Career Growth"],
      status: "upcoming"
    },
    {
      id: 2,
      title: "Tech Industry Networking Event",
      description: "Connect with professionals and hiring managers in the tech industry",
      eventType: "networking",
      startDate: "2024-12-22T19:00:00Z",
      location: "London Tech Hub, 123 Innovation Street",
      isVirtual: false,
      maxAttendees: 30,
      currentAttendees: 18,
      cost: 15,
      facilitator: "Pollen Community Team",
      tags: ["Networking", "Tech", "Career Opportunities"],
      status: "upcoming"
    },
    {
      id: 3,
      title: "Interview Skills Workshop",
      description: "Master the art of interviewing with practice sessions and expert feedback",
      eventType: "workshop",
      startDate: "2024-12-25T14:00:00Z",
      location: "Virtual",
      isVirtual: true,
      maxAttendees: 25,
      currentAttendees: 12,
      cost: 0,
      facilitator: "Mark Thompson, HR Director",
      tags: ["Interviews", "Skills", "Practice"],
      status: "upcoming"
    },
    {
      id: 4,
      title: "1-on-1 Career Mentorship Session",
      description: "Get personalised guidance from experienced professionals in your field",
      eventType: "mentorship",
      startDate: "2024-12-23T10:00:00Z",
      location: "Virtual (30-min sessions)",
      isVirtual: true,
      maxAttendees: 10,
      currentAttendees: 7,
      cost: 0,
      facilitator: "Various Industry Mentors",
      tags: ["Mentorship", "Career Guidance", "Personal Development"],
      status: "upcoming"
    }
  ];

  const getEventIcon = (type: string) => {
    switch (type) {
      case "masterclass": return GraduationCap;
      case "workshop": return Users;
      case "networking": return MessageSquare;
      case "mentorship": return Award;
      default: return Calendar;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "masterclass": return "bg-blue-100 text-blue-800";
      case "workshop": return "bg-green-100 text-green-800";
      case "networking": return "bg-purple-100 text-purple-800";
      case "mentorship": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-UK', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const EventCard = ({ event }: { event: any }) => {
    const Icon = getEventIcon(event.eventType);
    const spotsLeft = event.maxAttendees - event.currentAttendees;
    
    return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedEvent(event)}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${getEventColor(event.eventType)}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">{event.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{event.facilitator}</p>
              </div>
            </div>
            <Badge variant={event.cost > 0 ? "default" : "secondary"}>
              {event.cost > 0 ? `£${event.cost}` : "Free"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{formatDate(event.startDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {event.isVirtual ? (
                <Video className="h-4 w-4 text-muted-foreground" />
              ) : (
                <MapPin className="h-4 w-4 text-muted-foreground" />
              )}
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{event.currentAttendees}/{event.maxAttendees} attendees</span>
              {spotsLeft <= 5 && spotsLeft > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {spotsLeft} spots left
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-4">
            {event.tags.map((tag: string) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <Button className="w-full" disabled={spotsLeft === 0}>
            {spotsLeft === 0 ? "Fully Booked" : "Register Now"}
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Pollen Community</h2>
        <p className="text-lg text-muted-foreground">
          Build confidence, gain skills, and connect with like-minded professionals
        </p>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="masterclasses">Masterclasses</TabsTrigger>
          <TabsTrigger value="networking">Networking</TabsTrigger>
          <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="masterclasses">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.filter(e => e.eventType === "masterclass").map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="networking">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.filter(e => e.eventType === "networking").map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mentorship">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-6 w-6" />
                  Mentorship Programme
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Connect with experienced professionals who can guide your career journey. 
                  Our mentors are carefully selected industry experts committed to helping you succeed.
                </p>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 border rounded-lg">
                    <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h4 className="font-semibold">50+ Mentors</h4>
                    <p className="text-sm text-muted-foreground">Across various industries</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h4 className="font-semibold">Flexible Sessions</h4>
                    <p className="text-sm text-muted-foreground">30-60 minute sessions</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <MessageSquare className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h4 className="font-semibold">Ongoing Support</h4>
                    <p className="text-sm text-muted-foreground">Follow-up guidance</p>
                  </div>
                </div>
                <Button className="w-full">
                  Find a Mentor
                </Button>
              </CardContent>
            </Card>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.filter(e => e.eventType === "mentorship").map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <h4 className="text-2xl font-bold text-primary">2,500+</h4>
            <p className="text-sm text-muted-foreground">Community Members</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h4 className="text-2xl font-bold text-primary">150+</h4>
            <p className="text-sm text-muted-foreground">Events This Year</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h4 className="text-2xl font-bold text-primary">85%</h4>
            <p className="text-sm text-muted-foreground">Job Success Rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <h4 className="text-2xl font-bold text-primary">4.9/5</h4>
            <p className="text-sm text-muted-foreground">Community Rating</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}