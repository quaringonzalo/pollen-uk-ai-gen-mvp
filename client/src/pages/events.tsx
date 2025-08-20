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
  BookOpen,
  Mic,
  Target
} from "lucide-react";

export default function EventsPage() {
  const events = [
    {
      id: 2,
      title: "Tech Interview Prep",
      description: "Master the most common technical interview questions and learn how to showcase your problem-solving skills effectively.",
      date: "Thursday, Dec 19, 2024",
      time: "6:00 PM GMT",
      duration: "90 minutes",
      type: "masterclass",
      format: "online",
      attendees: 45,
      maxAttendees: 50,
      mentor: "Alex Chen",
      mentorRole: "Senior Software Engineer",
      location: "Online via Zoom",
      tags: ["Interview Prep", "Technical Skills", "Career Development"],
      whatYouLearn: [
        "Common technical interview formats and expectations",
        "How to approach coding problems step-by-step",
        "Effective communication during problem-solving",
        "Questions to ask interviewers"
      ],
      icon: Target
    },
    {
      id: 3,
      title: "Networking Coffee Chat",
      description: "Informal networking session where you can connect with other professionals, share experiences, and build your network.",
      date: "Friday, Dec 20, 2024", 
      time: "10:00 AM GMT",
      duration: "60 minutes",
      type: "networking",
      format: "online",
      attendees: 12,
      maxAttendees: 15,
      mentor: "Community",
      mentorRole: "Facilitated Discussion",
      location: "Online Breakout Rooms",
      tags: ["Networking", "Community", "Career Chat"],
      whatYouLearn: [
        "How to introduce yourself professionally",
        "Building meaningful connections",
        "Sharing experiences and learning from others",
        "Expanding your professional network"
      ],
      icon: Coffee
    },
    {
      id: 4,
      title: "Skills Showcase Workshop",
      description: "Learn how to effectively demonstrate your abilities through practical projects and real-world applications.",
      date: "Monday, Dec 23, 2024",
      time: "7:00 PM GMT", 
      duration: "2 hours",
      type: "workshop",
      format: "online",
      attendees: 28,
      maxAttendees: 40,
      mentor: "Sarah Johnson",
      mentorRole: "Career Coach",
      location: "Online Interactive Session",
      tags: ["Skills Development", "Career Growth", "Project Portfolio"],
      whatYouLearn: [
        "How to build a compelling project portfolio",
        "Demonstrating skills through practical examples",
        "Showcasing your work in job applications",
        "Creating evidence of your capabilities"
      ],
      icon: BookOpen
    },
    {
      id: 5,
      title: "Industry Insights: Marketing",
      description: "Hear from marketing professionals about current industry trends, career paths, and what employers are looking for.",
      date: "Wednesday, Dec 25, 2024",
      time: "6:30 PM GMT",
      duration: "75 minutes", 
      type: "industry_talk",
      format: "online",
      attendees: 35,
      maxAttendees: 60,
      mentor: "Marketing Panel",
      mentorRole: "Industry Experts",
      location: "Online Panel Discussion",
      tags: ["Marketing", "Industry Insights", "Career Paths"],
      whatYouLearn: [
        "Current marketing industry trends",
        "Different career paths in marketing",
        "Skills employers are seeking",
        "How to break into marketing"
      ],
      icon: Mic
    }
  ];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'masterclass':
        return 'bg-pink-100 text-pink-800';
      case 'networking':
        return 'bg-green-100 text-green-800';
      case 'workshop':
        return 'bg-yellow-100 text-yellow-800';
      case 'industry_talk':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Events & Workshops</h1>
              <p className="text-lg text-gray-600 mt-1">Join learning opportunities and connect with professionals</p>
            </div>
            <Link href="/community">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Check out other community activities
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Weekly Drop-in Promotion */}
        <Card className="mb-8 bg-yellow-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-yellow-700" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    Weekly Community Drop-in
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    Join our regular community sessions for career support and networking
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Every Monday, 1:00 PM GMT
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Open to all members
                    </span>
                  </div>
                </div>
              </div>
              <Link href="/weekly-drop-in">
                <Button variant="pollen" className="shadow-none">
                  Learn More
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{backgroundColor: "#fff9e6"}}>
                      <event.icon className="w-5 h-5" style={{color: "#E2007A"}} />
                    </div>
                    <div>
                      <CardTitle className="text-lg mb-1">{event.title}</CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className={getEventTypeColor(event.type)}>
                          {event.type.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {event.format}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{event.description}</p>
                
                {/* Event Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    {event.time} • {event.duration}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    {event.attendees}/{event.maxAttendees} attending
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {event.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* What You'll Learn */}
                <div className="mb-4">
                  <h4 className="font-semibold text-sm text-gray-900 mb-2">What You'll Learn:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {event.whatYouLearn.slice(0, 2).map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="mt-1" style={{color: "#E2007A"}}>•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Mentor */}
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Led by <span className="font-medium">{event.mentor}</span>
                    <br />
                    <span className="text-gray-400">{event.mentorRole}</span>
                  </div>
                  <Link href={`/join-event/${event.type === 'workshop' ? 'workshop-1' : event.type === 'networking' ? 'networking-1' : 'masterclass-1'}`}>
                    <Button size="sm" variant="pollen">
                      Join Event
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>


      </div>
    </div>
  );
}