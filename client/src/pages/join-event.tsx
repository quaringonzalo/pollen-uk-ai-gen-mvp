import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin,
  Video,
  GraduationCap,
  Network,
  Target,
  ArrowLeft,
  CheckCircle,
  Star,
  Coffee
} from "lucide-react";

interface EventDetails {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  type: 'workshop' | 'networking' | 'masterclass';
  format: string;
  attendees: number;
  maxAttendees: number;
  mentor: string;
  mentorRole: string;
  location: string;
  tags: string[];
  whatYouLearn: string[];
  points: number;
  icon: any;
}

const getEventDetails = (eventId: string): EventDetails | null => {
  const events: Record<string, EventDetails> = {
    'workshop-1': {
      id: 'workshop-1',
      title: "CV Writing Workshop",
      description: "Learn how to create a compelling CV that highlights your skills and gets you noticed by employers.",
      date: "2025-01-22",
      time: "18:00",
      duration: "90 minutes",
      type: "workshop",
      format: "online",
      attendees: 85,
      maxAttendees: 100,
      mentor: "Sarah Chen",
      mentorRole: "Career Coach",
      location: "Online via Zoom",
      tags: ["CV Writing", "Career Development", "Job Applications"],
      whatYouLearn: [
        "How to structure your CV for maximum impact",
        "Writing compelling personal statements",
        "Highlighting your achievements effectively",
        "Tailoring your CV for different roles"
      ],
      points: 50,
      icon: GraduationCap
    },
    'networking-1': {
      id: 'networking-1',
      title: "Virtual Networking Night",
      description: "Connect with fellow job seekers and industry professionals in a relaxed, supportive environment.",
      date: "2025-01-24",
      time: "19:00",
      duration: "120 minutes",
      type: "networking",
      format: "online",
      attendees: 45,
      maxAttendees: 60,
      mentor: "Emma Wilson",
      mentorRole: "Community Facilitator",
      location: "Online Breakout Rooms",
      tags: ["Networking", "Community", "Professional Development"],
      whatYouLearn: [
        "How to introduce yourself professionally",
        "Building meaningful connections",
        "Sharing experiences and learning from others",
        "Expanding your professional network"
      ],
      points: 40,
      icon: Network
    },
    'masterclass-1': {
      id: 'masterclass-1',
      title: "Interview Confidence Masterclass",
      description: "Master the art of interviewing with confidence and authenticity. Learn advanced techniques from industry experts.",
      date: "2025-01-25",
      time: "14:00",
      duration: "2 hours",
      type: "masterclass",
      format: "online",
      attendees: 120,
      maxAttendees: 150,
      mentor: "Holly Saunders",
      mentorRole: "Senior Talent Partner",
      location: "Online via Zoom",
      tags: ["Interview Skills", "Confidence Building", "Career Advancement"],
      whatYouLearn: [
        "Advanced interview techniques and strategies",
        "Building authentic confidence",
        "Handling difficult interview questions",
        "Post-interview follow-up best practices"
      ],
      points: 80,
      icon: Target
    },
    '2': {
      id: '2',
      title: "Tech Interview Prep",
      description: "Master the art of technical interviews with hands-on practice and expert guidance from industry professionals.",
      date: "2025-01-25",
      time: "18:00",
      duration: "90 minutes",
      type: "masterclass",
      format: "online",
      attendees: 45,
      maxAttendees: 50,
      mentor: "Alex Chen",
      mentorRole: "Senior Software Engineer",
      location: "Online via Zoom",
      tags: ["Interview Skills", "Technical Prep", "Career Development"],
      whatYouLearn: [
        "How to approach technical interview questions",
        "Problem-solving strategies under pressure", 
        "Communication techniques during coding challenges",
        "Post-interview follow-up best practices"
      ],
      points: 60,
      icon: Target
    },
    '3': {
      id: '3',
      title: "Networking Coffee Chat",
      description: "Join our relaxed morning networking session where you can connect with fellow job seekers and share experiences over virtual coffee.",
      date: "2025-01-26",
      time: "10:00",
      duration: "60 minutes",
      type: "networking",
      format: "online",
      attendees: 12,
      maxAttendees: 15,
      mentor: "Community",
      mentorRole: "Community Facilitator",
      location: "Online Breakout Rooms",
      tags: ["Networking", "Community", "Coffee Chat"],
      whatYouLearn: [
        "Building professional relationships in virtual settings",
        "Sharing job search experiences and tips",
        "Finding support in your career journey",
        "Connecting with like-minded professionals"
      ],
      points: 30,
      icon: Coffee
    }
  };
  
  return events[eventId] || null;
};

const getEventIcon = (type: string) => {
  switch (type) {
    case 'workshop': return GraduationCap;
    case 'networking': return Network;
    case 'masterclass': return Target;
    default: return Calendar;
  }
};

const getEventColor = (type: string) => {
  switch (type) {
    case 'workshop': return 'bg-blue-50 border-blue-200';
    case 'networking': return 'bg-green-50 border-green-200';
    case 'masterclass': return 'bg-pink-50 border-pink-200';
    default: return 'bg-gray-50 border-gray-200';
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

export default function JoinEventPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    motivation: '',
    questions: ''
  });

  useEffect(() => {
    if (eventId) {
      const details = getEventDetails(eventId);
      setEventDetails(details);
    }
  }, [eventId]);

  const handleJoinEvent = async () => {
    if (!eventDetails) return;

    setIsSubmitting(true);
    
    try {
      // Award points for joining event
      const response = await fetch('/api/community/activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activityType: eventDetails.type === 'masterclass' ? 'masterclass' : 'event',
          qualityScore: 5,
          metadata: {
            eventType: eventDetails.type,
            eventId: eventDetails.id,
            eventTitle: eventDetails.title,
            motivation: formData.motivation,
            questions: formData.questions
          }
        })
      });

      if (response.ok) {
        toast({
          title: "Successfully Joined Event!",
          description: `You've earned ${eventDetails.points} points! You'll receive a Zoom link via email before the event.`,
        });
      } else {
        toast({
          title: "Event Joined!",
          description: "You'll receive a Zoom link via email before the event.",
        });
      }

      // Redirect to events page after a delay
      setTimeout(() => {
        setLocation('/events');
      }, 2000);
    } catch (error) {
      console.error('Error joining event:', error);
      toast({
        title: "Event Joined!",
        description: "You'll receive a Zoom link via email before the event.",
      });
      
      setTimeout(() => {
        setLocation('/events');
      }, 2000);
    }
    
    setIsSubmitting(false);
  };

  if (!eventDetails) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h1>
        <p className="text-gray-600 mb-6">The event you're looking for doesn't exist.</p>
        <Button onClick={() => setLocation('/events')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Events
        </Button>
      </div>
    );
  }

  const IconComponent = getEventIcon(eventDetails.type);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          onClick={() => setLocation('/events')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Join Event</h1>
          <p className="text-gray-600">Complete your registration below</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Event Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className={`${getEventColor(eventDetails.type)} border-l-4`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{eventDetails.title}</h2>
                  <Badge variant="secondary" className="mt-1">
                    {eventDetails.type.charAt(0).toUpperCase() + eventDetails.type.slice(1)}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{eventDetails.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{formatDate(eventDetails.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{formatTime(eventDetails.time)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{eventDetails.attendees}/{eventDetails.maxAttendees} attending</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{eventDetails.location}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {eventDetails.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* What You'll Learn */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                What You'll Learn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {eventDetails.whatYouLearn.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Registration Form */}
          <Card>
            <CardHeader>
              <CardTitle>Complete Your Registration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="motivation">What motivated you to join this event? *</Label>
                <Textarea
                  id="motivation"
                  placeholder="Tell us what you hope to gain from this event..."
                  value={formData.motivation}
                  onChange={(e) => setFormData({...formData, motivation: e.target.value})}
                  className="mt-1"
                  required
                />
              </div>
              

              <div>
                <Label htmlFor="questions">Any specific questions or topics you'd like covered?</Label>
                <Textarea
                  id="questions"
                  placeholder="Let us know if there's anything specific you'd like to learn..."
                  value={formData.questions}
                  onChange={(e) => setFormData({...formData, questions: e.target.value})}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium">Points Reward</p>
                  <p className="text-sm text-gray-600">+{eventDetails.points} points</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Facilitator</p>
                  <p className="text-sm text-gray-600">{eventDetails.mentor}</p>
                  <p className="text-xs text-gray-500">{eventDetails.mentorRole}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Duration</p>
                  <p className="text-sm text-gray-600">{eventDetails.duration}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Video className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium">Format</p>
                  <p className="text-sm text-gray-600">Online via Zoom</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-yellow-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-900">Free Event</h3>
              </div>
              <p className="text-sm text-green-700 mb-3">
                This event is completely free for all Pollen community members.
              </p>
              <Button 
                onClick={handleJoinEvent}
                disabled={!formData.motivation.trim() || isSubmitting}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? 'Joining...' : 'Join Event'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}