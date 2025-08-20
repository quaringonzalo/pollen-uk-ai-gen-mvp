import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft,
  MessageSquare,
  Calendar,
  Users,
  CheckCircle,
  Award,
  Clock,
  Target,
  TrendingUp,
  Info,
  Eye,
  UserCheck,
  Trophy,
  Send,
  X
} from "lucide-react";

const AVAILABLE_MENTORS = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Senior Marketing Manager",
    company: "TechStart Inc",
    experience: "8 years",
    specialties: ["Marketing Strategy", "Brand Management", "Digital Marketing", "Content Strategy"],
    bio: "Passionate about helping early-career professionals break into marketing. I've guided over 150 mentees through application processes and career transitions.",
    availability: "Available this week",
    responseTime: "Usually responds within 2 hours",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=face",
    interests: ["Sustainable marketing", "Creative storytelling", "Community building", "Brand authenticity", "Yoga and mindfulness", "Cooking vegetarian meals", "Hiking and nature photography"],
    personalChallenges: ["First-generation university graduate", "Career pivot from finance to marketing", "Building confidence in creative presentations"],
    passions: ["Mentoring underrepresented groups in marketing", "Sustainable business practices", "Creative problem-solving workshops"],
    discProfile: { red: 45, yellow: 35, green: 15, blue: 25 }, // High D, I - results-driven, people-focused
    industries: ["Marketing", "Technology", "Creative Services"],
    jobTypes: ["Marketing Assistant", "Content Creator", "Digital Marketing"],
    idealFor: ["High-energy candidates", "People-focused roles", "Creative problem-solving"]
  },
  {
    id: 2,
    name: "Marcus Thompson",
    role: "Senior Software Developer",
    company: "InnovateCorp",
    experience: "6 years",
    specialties: ["Software Development", "Technical Skills", "Interview Prep", "Code Reviews"],
    bio: "Self-taught developer who transitioned from hospitality to tech. I understand the challenges of career switching and love helping others make similar transitions.",
    availability: "Available next week",
    responseTime: "Usually responds within 4 hours",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face",
    interests: ["Open source contributions", "Backend architecture", "Code mentorship", "Tech accessibility", "Board games and strategy", "Rock climbing", "Playing guitar"],
    personalChallenges: ["Career transition from hospitality", "Self-taught programming journey", "Imposter syndrome in tech"],
    passions: ["Making tech accessible to career changers", "Inclusive coding practices", "Building supportive tech communities"],
    discProfile: { red: 25, yellow: 20, green: 35, blue: 40 }, // High S, C - steady, analytical
    industries: ["Technology", "Software Development", "Engineering"],
    jobTypes: ["Software Developer", "Technical Support", "Data Analyst"],
    idealFor: ["Analytical thinkers", "Detail-oriented candidates", "Career switchers"]
  },
  {
    id: 3,
    name: "Emma Wilson",
    role: "Content Strategy Lead",
    company: "Creative Solutions",
    experience: "5 years",
    specialties: ["Content Creation", "Creative Writing", "Brand Voice", "Social Media"],
    bio: "Creative professional with a background in journalism and content marketing. I help job seekers craft compelling applications and develop their personal brand.",
    availability: "Available this week",
    responseTime: "Usually responds within 1 hour",
    avatar: "/attached_assets/Holly_1752681740688.jpg",
    interests: ["Authentic storytelling", "Personal branding", "Content strategy", "Social impact campaigns", "Creative writing and poetry", "Vintage film photography", "Community gardening"],
    personalChallenges: ["ADHD in creative work", "Perfectionism in writing", "Balancing creativity with deadlines"],
    passions: ["Supporting neurodivergent creatives", "Ethical content creation", "Empowering authentic voices"],
    discProfile: { red: 20, yellow: 45, green: 20, blue: 35 }, // High I, C - creative, expressive, detail-focused
    industries: ["Creative Services", "Marketing", "Media"],
    jobTypes: ["Content Writer", "Marketing Assistant", "Social Media Manager"],
    idealFor: ["Creative personalities", "Strong communicators", "Brand-focused roles"]
  },
  {
    id: 4,
    name: "James Rodriguez",
    role: "Product Manager",
    company: "DataFlow Systems",
    experience: "7 years",
    specialties: ["Product Management", "Strategic Thinking", "Leadership", "Analytics"],
    bio: "Product leader with experience in startups and enterprise. I focus on helping candidates understand how to position themselves for product roles and demonstrate strategic thinking.",
    availability: "Available in 3 days",
    responseTime: "Usually responds within 3 hours",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face",
    interests: ["Product strategy", "User research", "Data-driven decisions", "Team leadership", "Marathon running", "Cooking international cuisine", "Reading biographies"],
    personalChallenges: ["Anxiety in public speaking", "Transitioning from technical to leadership role", "Work-life balance as a parent"],
    passions: ["Mentoring working parents", "Building inclusive product teams", "Strategic thinking development"],
    discProfile: { red: 40, yellow: 25, green: 10, blue: 45 }, // High D, C - strategic, analytical leader
    industries: ["Technology", "Product Management", "Data Analytics"],
    jobTypes: ["Product Manager", "Business Analyst", "Project Manager"],
    idealFor: ["Strategic thinkers", "Leadership potential", "Data-driven candidates"]
  },
  {
    id: 5,
    name: "Priya Patel",
    role: "UX Design Manager",
    company: "DesignCorp",
    experience: "9 years",
    specialties: ["UX Design", "Design Thinking", "Portfolio Reviews", "User Research"],
    bio: "Design leader passionate about mentoring the next generation of UX professionals. I provide detailed portfolio feedback and help with design challenge preparation.",
    availability: "Available this week",
    responseTime: "Usually responds within 2 hours",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=96&h=96&fit=crop&crop=face",
    interests: ["Inclusive design", "User accessibility", "Design systems", "Mentorship programmes", "Watercolour painting", "Traveling to art museums", "Learning new languages"],
    personalChallenges: ["Dyslexia in design communication", "Introversion in collaborative environments", "Advocating for user needs"],
    passions: ["Accessibility in design", "Supporting underrepresented designers", "Building empathetic design processes"],
    discProfile: { red: 15, yellow: 30, green: 35, blue: 40 }, // High S, C - collaborative, methodical
    industries: ["Design", "Technology", "User Experience"],
    jobTypes: ["UX Designer", "Product Designer", "Design Researcher"],
    idealFor: ["Design-focused candidates", "User-centreed thinking", "Portfolio development"]
  },
  {
    id: 6,
    name: "Alex Johnson",
    role: "Sales Director",
    company: "GrowthTech",
    experience: "10 years",
    specialties: ["Sales Strategy", "Business Development", "Communication", "Negotiation"],
    bio: "Sales professional with a track record of building high-performing teams. I help candidates develop confidence and communication skills for any role.",
    availability: "Available next week",
    responseTime: "Usually responds within 4 hours",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face",
    interests: ["Relationship building", "Communication coaching", "Sales psychology", "Team development", "Stand-up comedy", "Learning dance styles", "Volunteering at local charities"],
    personalChallenges: ["Stuttering in presentations", "Building confidence in young professionals", "Rejection resilience"],
    passions: ["Communication confidence coaching", "Supporting people with speech differences", "Building resilient sales teams"],
    discProfile: { red: 35, yellow: 50, green: 10, blue: 15 }, // High I, D - persuasive, results-focused
    industries: ["Sales", "Business Development", "Customer Success"],
    jobTypes: ["Sales Associate", "Account Manager", "Customer Success Manager"],
    idealFor: ["People-focused roles", "Communication skills", "Confidence building"]
  }
];

// Function to calculate compatibility between user and mentor DISC profiles
function calculateDiscCompatibility(userDisc: any, mentorDisc: any) {
  if (!userDisc || !mentorDisc) return 0;
  
  // Calculate similarity based on complementary matching
  // High D users work well with High S mentors (complementary leadership)
  // High I users work well with High C mentors (structure + enthusiasm)
  // High S users work well with High D mentors (guidance + support)
  // High C users work well with High I mentors (creativity + precision)
  
  const userProfile = userDisc;
  const mentorProfile = mentorDisc;
  
  let compatibility = 0;
  
  // Complementary strengths matching
  if (userProfile.red >= 35 && mentorProfile.green >= 30) compatibility += 25; // D with S
  if (userProfile.yellow >= 35 && mentorProfile.blue >= 30) compatibility += 25; // I with C
  if (userProfile.green >= 35 && mentorProfile.red >= 30) compatibility += 25; // S with D
  if (userProfile.blue >= 35 && mentorProfile.yellow >= 30) compatibility += 25; // C with I
  
  // Similar secondary traits for understanding
  const redDiff = Math.abs(userProfile.red - mentorProfile.red);
  const yellowDiff = Math.abs(userProfile.yellow - mentorProfile.yellow);
  const greenDiff = Math.abs(userProfile.green - mentorProfile.green);
  const blueDiff = Math.abs(userProfile.blue - mentorProfile.blue);
  
  const avgDiff = (redDiff + yellowDiff + greenDiff + blueDiff) / 4;
  const similarityScore = Math.max(0, 50 - avgDiff); // 50 points max for similarity
  
  return Math.min(100, compatibility + similarityScore);
}

// Function to calculate mentor relevance based on user's applications and interests
function calculateRelevance(mentor: any, userProfile: any, userApplications: any[]) {
  let relevance = 0;
  
  // Check job application history
  if (userApplications && userApplications.length > 0) {
    const appliedIndustries = userApplications.map(app => app.industry || 'General').filter(Boolean);
    const appliedJobTypes = userApplications.map(app => app.jobType || app.title).filter(Boolean);
    
    // Industry match
    const industryMatch = appliedIndustries.some(industry => 
      mentor.industries.some(mentorIndustry => 
        industry.toLowerCase().includes(mentorIndustry.toLowerCase()) ||
        mentorIndustry.toLowerCase().includes(industry.toLowerCase())
      )
    );
    if (industryMatch) relevance += 40;
    
    // Job type match
    const jobTypeMatch = appliedJobTypes.some(jobType => 
      mentor.jobTypes.some(mentorJobType => 
        jobType.toLowerCase().includes(mentorJobType.toLowerCase()) ||
        mentorJobType.toLowerCase().includes(jobType.toLowerCase())
      )
    );
    if (jobTypeMatch) relevance += 30;
  }
  
  // Check user interests from profile
  if (userProfile?.careerInterests) {
    const interestMatch = userProfile.careerInterests.some((interest: string) => 
      mentor.industries.some(industry => 
        interest.toLowerCase().includes(industry.toLowerCase()) ||
        industry.toLowerCase().includes(interest.toLowerCase())
      )
    );
    if (interestMatch) relevance += 30;
  }
  
  return Math.min(100, relevance);
}

export default function MentorDirectory() {
  const [location, setLocation] = useLocation();
  const [showAllMentors, setShowAllMentors] = useState(false);
  const [expandedMentor, setExpandedMentor] = useState<number | null>(null);
  const [selectedMentor, setSelectedMentor] = useState<any>(null);
  const [messageText, setMessageText] = useState('');
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [sessionGoals, setSessionGoals] = useState('');
  const { toast } = useToast();
  
  // Fetch user profile for personalization
  const { data: userProfile } = useQuery({
    queryKey: ['/api/user-profile'],
    enabled: true
  });
  
  // Fetch user applications for relevance calculation
  const { data: userApplications } = useQuery({
    queryKey: ['/api/applications'],
    enabled: true
  });
  
  // Calculate personalised mentor recommendations
  const personalisedMentors = AVAILABLE_MENTORS.map(mentor => {
    const discCompatibility = calculateDiscCompatibility(userProfile?.behaviouralAssessment?.discProfile, mentor.discProfile);
    const relevance = calculateRelevance(mentor, userProfile, userApplications || []);
    const overallScore = (discCompatibility * 0.6) + (relevance * 0.4);
    
    return {
      ...mentor,
      discCompatibility,
      relevance,
      overallScore,
      isRecommended: true   // Force all mentors as recommended for demo
    };
  }).sort((a, b) => b.overallScore - a.overallScore);
  
  // Get recommended mentors and remaining mentors
  const recommendedMentors = personalisedMentors.filter(m => m.isRecommended);
  const otherMentors = personalisedMentors.filter(m => !m.isRecommended);
  
  // Show recommended mentors first, then others if "View All" is clicked
  const displayMentors = showAllMentors ? personalisedMentors : recommendedMentors;

  const handleSendMessage = (mentor: any) => {
    setSelectedMentor(mentor);
    setMessageText(`Hi ${mentor.name.split(' ')[0]},

I'm interested in marketing but honestly quite nervous about it. I've been applying for entry-level positions but keep getting rejections. Your background in ${mentor.specialties[0]} really resonates with me.

Would you be willing to have a quick chat about how to stand out in applications and build confidence in this field?

Thank you so much for volunteering your time to help job seekers like me.

Best regards,
Zara`);
    setIsMessageDialogOpen(true);
  };

  const handleMessageSubmit = () => {
    if (!messageText.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message before sending.",
        variant: "destructive"
      });
      return;
    }

    // In a real implementation, this would send the message via API
    console.log('Sending message to mentor:', selectedMentor?.name, messageText);
    
    toast({
      title: "Message Sent!",
      description: `Your message has been sent to ${selectedMentor?.name}. They typically respond within ${selectedMentor?.responseTime?.toLowerCase().replace('usually responds ', '')}.`,
    });
    
    setIsMessageDialogOpen(false);
    setMessageText('');
    setSelectedMentor(null);
  };

  const handleScheduleSession = (mentor: any) => {
    setSelectedMentor(mentor);
    setSessionGoals(`I'd like help with:

• Building confidence for job applications in ${mentor.specialties[0].toLowerCase()}
• Getting feedback on my application approach
• Understanding what employers look for in entry-level candidates
• Developing strategies to stand out in a competitive market

I'm particularly interested in your experience with ${mentor.specialties[0]} and would value your insights on breaking into this field.`);
    setSelectedTimeSlot('');
    setIsScheduleDialogOpen(true);
  };

  const handleSessionSubmit = () => {
    if (!selectedTimeSlot) {
      toast({
        title: "Error",
        description: "Please select a preferred time slot.",
        variant: "destructive"
      });
      return;
    }

    if (!sessionGoals.trim()) {
      toast({
        title: "Error",
        description: "Please describe what you'd like to achieve in your session.",
        variant: "destructive"
      });
      return;
    }

    // In a real implementation, this would submit the session request via API
    console.log('Scheduling session with mentor:', selectedMentor?.name, {
      timeSlot: selectedTimeSlot,
      goals: sessionGoals
    });
    
    toast({
      title: "Session Requested!",
      description: `Your session request has been sent to ${selectedMentor?.name}. They'll confirm availability within ${selectedMentor?.responseTime?.toLowerCase().replace('usually responds ', '')}.`,
    });
    
    setIsScheduleDialogOpen(false);
    setSelectedTimeSlot('');
    setSessionGoals('');
    setSelectedMentor(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header - removed back button since sidebar navigation is available */}

      {/* Hero Section */}
      <div className="text-center space-y-4 mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Users className="w-8 h-8" style={{ color: '#E2007A' }} />
          <h1 className="text-4xl font-bold">Available Mentors</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Connect with experienced professionals who volunteer their time to help you succeed in your career journey. 
          Get points every time you schedule a session - these points boost your visibility to employers and improve your job matching ranking.
        </p>
        {userProfile && (
          <div className="bg-pink-50 rounded-lg p-4 mt-6 max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5" style={{ color: '#E2007A' }} />
              <span className="font-medium" style={{ color: '#E2007A' }}>Personalised for You</span>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              Based on your work style assessment and application history, we've highlighted mentors who would be ideal matches for your career goals.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                <span>Behavioral compatibility matching</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>Industry & role experience alignment</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>Career interests & goals overlap</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Mentoring style compatibility</span>
              </div>
            </div>
          </div>
        )}
        <div className="flex items-center justify-center gap-6 mt-6">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5" style={{ color: '#E2007A' }} />
            <span className="text-sm text-gray-600">{recommendedMentors.length} recommended for you</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="text-sm text-gray-600">Community volunteer mentors</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">Expert guidance available</span>
          </div>
        </div>
      </div>

      {/* Section Title */}
      {userProfile && (
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {showAllMentors ? 'All Available Mentors' : 'Recommended Mentors'}
          </h2>
          <p className="text-gray-600">
            {showAllMentors 
              ? 'Browse our complete mentor directory' 
              : `${recommendedMentors.length} mentors perfectly matched to your profile`}
          </p>
        </div>
      )}

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {displayMentors.map((mentor) => (
          <Card key={mentor.id} className={`border-2 hover:border-pink-200 transition-all duration-200 hover:shadow-lg ${mentor.isRecommended ? 'border-pink-300 bg-pink-50' : ''}`}>
            <CardHeader className="pb-4">
              <div className="flex items-start gap-4">
                <img 
                  src={mentor.avatar} 
                  alt={mentor.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-semibold">{mentor.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {mentor.experience}
                    </Badge>
                    {mentor.isRecommended && (
                      <Badge style={{ backgroundColor: '#E2007A', color: 'white' }} className="text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Recommended
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {mentor.role} at {mentor.company}
                  </div>
                  <div className="text-sm text-gray-600">
                    {mentor.experience} experience
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Specialties */}
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Specialties:</div>
                <div className="flex flex-wrap gap-1">
                  {mentor.specialties.map((specialty, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Bio */}
              <div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {mentor.bio}
                </p>
              </div>

              {/* Match Information */}
              {mentor.isRecommended && (
                <div className="bg-pink-50 rounded-lg p-3 mb-4">
                  <div className="text-sm font-medium" style={{ color: '#E2007A' }}>Why this mentor is perfect for you:</div>
                  <div className="space-y-1 mt-2">
                    {mentor.discCompatibility >= 70 && (
                      <div className="flex items-center gap-2 text-xs text-gray-700">
                        <CheckCircle className="w-3 h-3" style={{ color: '#E2007A' }} />
                        Complementary work styles for effective mentoring
                      </div>
                    )}
                    {mentor.relevance >= 60 && (
                      <div className="flex items-center gap-2 text-xs text-gray-700">
                        <TrendingUp className="w-3 h-3" style={{ color: '#E2007A' }} />
                        Experience in your areas of interest
                      </div>
                    )}
                    {mentor.idealFor.some(trait => userProfile?.workStyle?.includes(trait.toLowerCase())) && (
                      <div className="flex items-center gap-2 text-xs text-gray-700">
                        <Target className="w-3 h-3" style={{ color: '#E2007A' }} />
                        Specializes in your personality type
                      </div>
                    )}
                  </div>
                </div>
              )}



              {/* Availability */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">{mentor.availability}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-600">{mentor.responseTime}</span>
                </div>
              </div>

              {/* Expanded Information */}
              {expandedMentor === mentor.id && (
                <div className="space-y-4 py-4 border-t border-gray-100">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Interests & Focus Areas</h4>
                    <div className="flex flex-wrap gap-2">
                      {mentor.interests.map((interest, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Personal Challenges Overcome</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {mentor.personalChallenges.map((challenge, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#E2007A' }}></div>
                          {challenge}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Passionate About</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {mentor.passions.map((passion, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                          {passion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button 
                  className="flex-1"
                  style={{ backgroundColor: '#E2007A', color: 'white' }}
                  onClick={() => handleSendMessage(mentor)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 hover:bg-pink-50"
                  style={{ borderColor: '#E2007A', color: '#E2007A' }}
                  onClick={() => handleScheduleSession(mentor)}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Session
                </Button>
              </div>
              
              {/* Expand/Collapse Button */}
              <Button 
                variant="ghost" 
                className="w-full mt-2 hover:bg-pink-50"
                style={{ color: '#E2007A' }}
                onClick={() => setExpandedMentor(expandedMentor === mentor.id ? null : mentor.id)}
              >
                {expandedMentor === mentor.id ? 'Show Less' : 'Learn More About Me'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View All/View Recommended Toggle */}
      {userProfile && (
        <div className="text-center mt-12">
          {!showAllMentors ? (
            <div className="space-y-4">
              <p className="text-gray-600">
                Want to explore more options? View all {AVAILABLE_MENTORS.length} mentors in our directory.
              </p>
              <Button 
                onClick={() => setShowAllMentors(true)}
                variant="outline"
                className="hover:bg-pink-50"
                style={{ borderColor: '#E2007A', color: '#E2007A' }}
              >
                <Eye className="w-4 h-4 mr-2" />
                View All Mentors ({otherMentors.length} more)
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-600">
                Back to your personalised recommendations based on your profile.
              </p>
              <Button 
                onClick={() => setShowAllMentors(false)}
                style={{ backgroundColor: '#E2007A', color: 'white' }}
                className="hover:opacity-90"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                View Recommended Mentors ({recommendedMentors.length})
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Message Composer Dialog */}
      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" style={{ color: '#E2007A' }} />
              Send Message to {selectedMentor?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedMentor?.responseTime} • Volunteer community mentor
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Tips for your first message:</p>
                  <ul className="text-xs space-y-1 text-blue-700">
                    <li>• Be specific about what you're looking for help with</li>
                    <li>• Mention why their background appeals to you</li>
                    <li>• Keep it genuine and conversational</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Your Message</Label>
              <Textarea
                id="message"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Write your message here..."
                className="min-h-[200px] resize-none"
              />
              <div className="text-xs text-gray-500 text-right">
                {messageText.length} characters
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsMessageDialogOpen(false)}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={handleMessageSubmit}
                style={{ backgroundColor: '#E2007A', color: 'white' }}
                className="hover:opacity-90"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Schedule Session Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" style={{ color: '#E2007A' }} />
              Schedule Session with {selectedMentor?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedMentor?.responseTime} • Volunteer community mentor • Get 25 points for completing the session
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Trophy className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-green-800">
                  <p className="font-medium mb-1">Session Benefits:</p>
                  <ul className="text-xs space-y-1 text-green-700">
                    <li>• 25 community points for completing the session</li>
                    <li>• 10 additional points for submitting feedback</li>
                    <li>• 20 bonus points if you achieve your session goals</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Preferred Time Slot</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'This week - Weekday evenings (6-8pm)',
                  'This week - Weekend mornings (9-11am)',
                  'Next week - Weekday lunches (12-1pm)',
                  'Next week - Weekday evenings (6-8pm)',
                  'Next week - Weekend afternoons (2-4pm)',
                  'Flexible - Any time that works for mentor'
                ].map((slot) => (
                  <Button
                    key={slot}
                    variant={selectedTimeSlot === slot ? "default" : "outline"}
                    className={`text-left h-auto p-3 ${
                      selectedTimeSlot === slot 
                        ? "text-white hover:opacity-90" 
                        : "border-pink-200 hover:bg-pink-50"
                    }`}
                    style={selectedTimeSlot === slot ? { backgroundColor: '#E2007A' } : { borderColor: '#E2007A', color: '#E2007A' }}
                    onClick={() => setSelectedTimeSlot(slot)}
                  >
                    <div className="text-xs">{slot}</div>
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sessionGoals">What would you like to achieve in this session?</Label>
              <Textarea
                id="sessionGoals"
                value={sessionGoals}
                onChange={(e) => setSessionGoals(e.target.value)}
                placeholder="Describe your goals and what you'd like help with..."
                className="min-h-[150px] resize-none"
              />
              <div className="text-xs text-gray-500 text-right">
                {sessionGoals.length} characters
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsScheduleDialogOpen(false)}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={handleSessionSubmit}
                style={{ backgroundColor: '#E2007A', color: 'white' }}
                className="hover:opacity-90"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Request Session
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}