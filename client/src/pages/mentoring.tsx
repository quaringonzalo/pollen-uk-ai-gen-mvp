import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  Target, 
  ArrowLeft,
  BookOpen,
  Star,
  Clock,
  CheckCircle,
  Video,
  Coffee,
  Lightbulb,
  Trophy,
  Heart,
  User
} from "lucide-react";

const MENTORING_FEATURES = [
  {
    title: "One-on-One Career Coaching",
    description: "Connect with experienced professionals in your field for personalised guidance",
    icon: <User className="w-6 h-6" />,
    benefits: ["Career path planning", "Interview preparation", "Skills development", "Industry insights"],
    action: "Book a Session"
  },
  {
    title: "Application Review Sessions",
    description: "Get detailed feedback on your applications from industry professionals",
    icon: <MessageSquare className="w-6 h-6" />,
    benefits: ["Application feedback", "Assessment improvement", "Communication tips", "Professional writing"],
    action: "Schedule Review"
  },
  {
    title: "Skills Development Workshops",
    description: "Join interactive workshops to strengthen areas identified in your feedback",
    icon: <BookOpen className="w-6 h-6" />,
    benefits: ["Practical skills training", "Hands-on practice", "Peer learning", "Expert guidance"],
    action: "Join Workshop"
  },
  {
    title: "Mock Interview Practice",
    description: "Practice interviews with experienced professionals to build confidence",
    icon: <Video className="w-6 h-6" />,
    benefits: ["Interview confidence", "Question practice", "Body language tips", "Performance feedback"],
    action: "Practice Now"
  }
];

const MENTOR_TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Marketing Manager",
    company: "TechStart Inc",
    testimonial: "The mentoring programme helped me identify exactly what employers were looking for. My mentor provided specific, actionable feedback that improved my application success rate by 70%.",
    rating: 5,
    avatar: "/attached_assets/image_1752651597135.png"
  },
  {
    name: "Marcus Thompson",
    role: "Junior Developer",
    company: "InnovateCorp",
    testimonial: "My mentor helped me understand my strengths and how to better communicate them in applications. The interview practice sessions were invaluable.",
    rating: 5,
    avatar: "/attached_assets/image_1752590639861.png"
  },
  {
    name: "Emma Wilson",
    role: "Content Specialist",
    company: "Creative Solutions",
    testimonial: "The application review sessions helped me see my work from an employer's perspective. The feedback was constructive and specific.",
    rating: 5,
    avatar: "/attached_assets/Holly_1752681740688.jpg"
  }
];

export default function Mentoring() {
  const [location, setLocation] = useLocation();

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6 sm:mb-8">
        <Button 
          variant="ghost" 
          onClick={() => setLocation('/community')}
          className="flex items-center gap-2 text-xs sm:text-sm"
        >
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          Back to Community
        </Button>
      </div>

      {/* Hero Section */}
      <div className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-12">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mb-3 sm:mb-4">
          <Users className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Career Mentoring & Support</h1>
        </div>
        <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto">
          Get personalised guidance from experienced professionals to strengthen your applications and accelerate your career growth.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mt-4 sm:mt-6">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
            <span className="text-xs sm:text-sm text-gray-600">4.9/5 mentee satisfaction</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            <span className="text-xs sm:text-sm text-gray-600">85% application success rate</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            <span className="text-xs sm:text-sm text-gray-600">24-hour response time</span>
          </div>
        </div>
      </div>

      {/* Mentoring Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
        {MENTORING_FEATURES.map((feature, index) => (
          <Card key={index} className="border-2 hover:border-purple-200 transition-colours">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 text-base sm:text-lg">
                <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                  {feature.icon}
                </div>
                {feature.title}
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                {feature.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {feature.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                      {benefit}
                    </div>
                  ))}
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-xs sm:text-sm">
                  {feature.action}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Available Mentors Directory */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Available Mentors
          </CardTitle>
          <CardDescription>
            Connect with experienced professionals ready to guide your career
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MENTOR_TESTIMONIALS.map((mentor, index) => (
              <div key={index} className="p-6 bg-gray-50 rounded-lg border hover:border-purple-200 transition-colours">
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src={mentor.avatar} 
                    alt={mentor.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-lg">{mentor.name}</div>
                    <div className="text-sm text-gray-600">{mentor.role}</div>
                    <div className="text-xs text-gray-500">{mentor.company}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(mentor.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">{mentor.rating}/5</span>
                </div>
                
                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Specialties:</div>
                  <div className="flex flex-wrap gap-1">
                    {mentor.role.includes('Marketing') && (
                      <>
                        <Badge variant="secondary" className="text-xs">Marketing Strategy</Badge>
                        <Badge variant="secondary" className="text-xs">Brand Management</Badge>
                      </>
                    )}
                    {mentor.role.includes('Developer') && (
                      <>
                        <Badge variant="secondary" className="text-xs">Software Development</Badge>
                        <Badge variant="secondary" className="text-xs">Technical Skills</Badge>
                      </>
                    )}
                    {mentor.role.includes('Content') && (
                      <>
                        <Badge variant="secondary" className="text-xs">Content Creation</Badge>
                        <Badge variant="secondary" className="text-xs">Creative Writing</Badge>
                      </>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  "{mentor.testimonial.substring(0, 100)}..."
                </p>
                
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Connect
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Session
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Success Stories */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Success Stories
          </CardTitle>
          <CardDescription>
            See how our mentoring programme has helped other job seekers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MENTOR_TESTIMONIALS.map((testimonial, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-sm">{testimonial.name}</div>
                    <div className="text-xs text-gray-600">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  "{testimonial.testimonial}"
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Getting Started */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Lightbulb className="w-5 h-5" />
            Ready to Get Started?
          </CardTitle>
          <CardDescription className="text-purple-700">
            Begin your mentoring journey today and accelerate your career growth
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => setLocation('/community')}
            >
              <Users className="w-4 h-4 mr-2" />
              Find a Mentor
            </Button>
            <Button 
              variant="outline" 
              className="border-purple-200 text-purple-700 hover:bg-purple-50"
              onClick={() => setLocation('/community')}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Browse Workshops
            </Button>
            <Button 
              variant="outline" 
              className="border-purple-200 text-purple-700 hover:bg-purple-50"
              onClick={() => setLocation('/leaderboard')}
            >
              <Trophy className="w-4 h-4 mr-2" />
              Join Learning Activities
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}