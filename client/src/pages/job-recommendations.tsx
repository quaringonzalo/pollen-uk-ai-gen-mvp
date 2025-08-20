import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  MapPin, Clock, PoundSterling, Building2, Heart, Star, 
  Filter, Search, Briefcase, TrendingUp, Target, Users,
  ChevronRight, ExternalLink, BookOpen, Award, Crown, Zap
} from "lucide-react";
import SimpleChatbot from "@/components/simple-chatbot";

interface JobRecommendation {
  id: string;
  title: string;
  company: {
    name: string;
    logo: string;
    rating: number;
    size: string;
  };
  location: string;
  type: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  matchScore: number;
  matchReasons: string[];
  description: string;
  requirements: string[];
  benefits: string[];
  skills: string[];
  postedDate: string;
  applicationDeadline?: string;
  urgency: "low" | "medium" | "high";
  remote: boolean;
  experienceLevel: string;
  department: string;
}

export default function JobRecommendationsPage() {
  console.log("JobRecommendationsPage component loaded");
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortBy, setSortBy] = useState("match");
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      type: "bot",
      message: "Hi! I'm your Pollen assistant. Ask me about job matches, applications, or career advice."
    }
  ]);

  // Job recommendations based on Zara's verified skills and behavioural profile
  const jobRecommendations: JobRecommendation[] = [
    {
      id: "job-001",
      title: "Marketing Coordinator",
      company: {
        name: "Growth Partners",
        logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=50&h=50&fit=crop&crop=centre",
        rating: 4.4,
        size: "50-150"
      },
      location: "Manchester, UK",
      type: "Full-time",
      salary: { min: 25000, max: 28000, currency: "GBP" },
      matchScore: 89,
      // isPremium: false,
      applicationDeadline: "2024-01-28",
      matchReasons: [
        "Your organizational skills match campaign coordination requirements",
        "Communication abilities (85%) ideal for content creation and collaboration",
        "Detail-oriented approach fits campaign management needs"
      ],
      description: "Support our dynamic marketing team in executing campaigns across multiple channels. You'll coordinate content creation, manage social media schedules, and help analyse campaign performance to drive growth.",
      requirements: [
        "Strong organizational skills and attention to detail",
        "Interest in digital marketing and social media trends", 
        "Good written communication for content creation",
        "Ability to work collaboratively in a fast-paced environment"
      ],
      benefits: ["Hybrid working", "Learning budget", "Career progression", "Team events"],
      skills: ["Campaign Management", "Communication", "Organization", "Analytics"],
      postedDate: "2024-01-20",
      urgency: "medium",
      remote: true,
      experienceLevel: "Entry Level",
      department: "Marketing"
    },
    {
      id: "job-premium-001",
      title: "Media Planning Assistant",
      company: {
        name: "CreativeMinds Agency",
        logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=50&h=50&fit=crop&crop=centre",
        rating: 4.6,
        size: "50-200"
      },
      location: "London, UK",
      type: "Full-time",
      salary: { min: 26000, max: 32000, currency: "GBP" },
      matchScore: 92,
      // isPremium: true,
      applicationDeadline: "2024-01-30",
      matchReasons: [
        "Perfect match - you've completed our Media Planning Challenge with 85% communication score",
        "Your problem-solving skills (80%) align with campaign optimisation needs",
        "Creative Collaborator profile fits our team-focused culture"
      ],
      description: "Support our media planning team in developing strategic advertising campaigns. You'll analyse audience data, optimize budgets, and collaborate with creative teams to deliver impactful campaigns for diverse clients.",
      requirements: [
        "Demonstrated media planning capabilities (verified through challenges)",
        "Strong analytical and communication skills",
        "Interest in advertising and audience targeting",
        "Collaborative mindset with attention to detail"
      ],
      benefits: ["Hybrid working", "Skills development budget", "Health insurance", "Career mentorship"],
      skills: ["Media Planning", "Communication", "Problem Solving", "Analytics"],
      postedDate: "2024-01-15",
      urgency: "medium",
      remote: true,
      experienceLevel: "Entry Level",
      department: "Media & Advertising"
    },
    {
      id: "job-002", 
      title: "Client Relationship Coordinator",
      company: {
        name: "Adaptive Solutions Ltd",
        logo: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=50&h=50&fit=crop&crop=centre",
        rating: 4.4,
        size: "100-300"
      },
      location: "Manchester, UK",
      type: "Full-time",
      salary: { min: 25000, max: 28000, currency: "GBP" },
      matchScore: 85,
      matchReasons: [
        "Your 85% communication score from verified challenges matches perfectly",
        "Adaptability skills (75%) essential for diverse client needs",
        "Creative Collaborator profile valued in our client-focused environment"
      ],
      description: "Build and maintain strong relationships with our diverse client portfolio. You'll coordinate project deliverables, facilitate communication between teams, and ensure client satisfaction through proactive support and creative problem-solving.",
      requirements: [
        "Proven communication skills (demonstrated through assessments)",
        "Strong interpersonal and relationship-building abilities", 
        "Adaptability to work with varied client needs",
        "Collaborative approach to problem-solving"
      ],
      benefits: ["Flexible working arrangements", "Client relationship training", "Performance bonuses", "Professional development"],
      skills: ["Communication", "Adaptability", "Problem Solving", "Relationship Management"],
      postedDate: "2024-01-12",
      urgency: "high",
      remote: true,
      experienceLevel: "Entry Level",
      department: "Client Services"
    },
    {
      id: "job-003",
      title: "Campaign Coordinator", 
      company: {
        name: "ImpactMedia Group",
        logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=50&h=50&fit=crop&crop=centre",
        rating: 4.2,
        size: "75-150"
      },
      location: "Birmingham, UK",
      type: "Full-time",
      salary: { min: 25000, max: 30000, currency: "GBP" },
      matchScore: 82,
      matchReasons: [
        "Your problem-solving skills (80%) perfect for campaign optimisation",
        "Communication abilities (85%) essential for stakeholder coordination",
        "Adaptability (75%) valuable for managing multiple campaign requirements"
      ],
      description: "Coordinate marketing campaigns from conception to execution. You'll work with creative teams, analyse performance metrics, and ensure campaigns meet client objectives while maintaining brand consistency.",
      requirements: [
        "Strong organizational and project coordination skills",
        "Excellent communication for stakeholder management",
        "Problem-solving mindset for campaign optimisation", 
        "Adaptability to handle multiple projects simultaneously"
      ],
      benefits: ["Hybrid working", "Campaign strategy training", "Career progression", "Creative environment"],
      skills: ["Campaign Management", "Communication", "Problem Solving", "Adaptability"],
      postedDate: "2024-01-10",
      urgency: "low",
      remote: true,
      experienceLevel: "Entry Level",
      department: "Marketing"
    },
    {
      id: "job-004",
      title: "Creative Communications Assistant",
      company: {
        name: "BrightFuture Marketing",
        logo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=50&h=50&fit=crop&crop=centre",
        rating: 4.3,
        size: "25-75"
      },
      location: "Bristol, UK",
      type: "Full-time",
      salary: { min: 23000, max: 27000, currency: "GBP" },
      matchScore: 78,
      matchReasons: [
        "Communication skills (85%) essential for content creation",
        "Creative Collaborator profile fits our team environment",
        "Growth opportunity to develop new skills"
      ],
      description: "Support our communications team in creating engaging content and managing client relationships. Perfect role to develop your creative and strategic thinking while working in a supportive team environment.",
      requirements: [
        "Strong written and verbal communication skills",
        "Creative thinking and fresh perspectives",
        "Collaborative approach to teamwork",
        "Willingness to learn and take on new challenges"
      ],
      benefits: ["Flexible hours", "Mentorship programme", "Creative projects", "Skills development"],
      skills: ["Communication", "Content Creation", "Teamwork", "Creativity"],
      postedDate: "2024-01-08",
      urgency: "medium",
      remote: true,
      experienceLevel: "Entry Level",
      department: "Marketing"
    }
  ];

  const toggleSaveJob = (jobId: string) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
    // TODO: In real implementation, this would make an API call to save/unsave the job
    // await apiRequest(`/api/saved-jobs/${jobId}`, { method: savedJobs.includes(jobId) ? 'DELETE' : 'POST' });
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "bg-gray-100 text-gray-800";
      case "medium": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredJobs = jobRecommendations
    .filter(job => 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(job => !locationFilter || locationFilter === "any" || job.location.includes(locationFilter))
    .filter(job => !typeFilter || typeFilter === "any" || job.type === typeFilter)
    .sort((a, b) => {
      switch (sortBy) {
        case "match": return b.matchScore - a.matchScore;
        case "salary": return b.salary.max - a.salary.max;
        case "date": return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
        default: return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-4">
              <Button 
                variant="ghost" 
                onClick={() => window.location.href = '/home'}
                className="flex items-center gap-2"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                Back to Home
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Recommended for You</h1>
                <p className="text-gray-600 mt-1">
                  {filteredJobs.length} opportunities available
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-semibold text-gray-900">3</div>
                <div className="text-xs text-gray-600">Applications</div>
              </div>
              <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-semibold text-gray-900">3</div>
                <div className="text-xs text-gray-600">Assessments Completed</div>
              </div>
              <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 text-center">
                <div className="text-lg font-semibold text-gray-900">1</div>
                <div className="text-xs text-gray-600">Interview Invitations</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-80 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Search</label>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Search jobs or companies..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any location</SelectItem>
                      <SelectItem value="London">London</SelectItem>
                      <SelectItem value="Manchester">Manchester</SelectItem>
                      <SelectItem value="Birmingham">Birmingham</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Job Type</label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any type</SelectItem>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="match">Best Match</SelectItem>
                      <SelectItem value="salary">Highest Salary</SelectItem>
                      <SelectItem value="date">Most Recent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Profile Strength */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Profile Strength
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Profile Completeness</span>
                    <span className="text-sm font-medium">87%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gray-400 h-2 rounded-full" style={{ width: "87%" }} />
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    Complete your profile to unlock more opportunities
                  </p>
                  <Button 
                    size="sm" 
                    className="w-full bg-[#E2007A] hover:bg-[#c71868] text-white"
                    onClick={() => window.location.href = '/profile/checkpoints'}
                  >
                    Complete Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Job Listings */}
          <div className="flex-1 space-y-6">
            {filteredJobs.map(job => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={job.company.logo}
                      alt={`${job.company.name} logo`}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-semibold text-gray-900 mb-1 truncate">
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-gray-700">{job.company.name}</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600">{job.company.rating}</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-2">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {job.type}
                            </span>
                            <span className="flex items-center gap-1">
                              <PoundSterling className="w-4 h-4" />
                              £{job.salary.min.toLocaleString()} - £{job.salary.max.toLocaleString()}
                            </span>
                            {job.applicationDeadline && (
                              <span className="text-gray-700 font-medium">
                                Apply by {new Date(job.applicationDeadline).toLocaleDateString()}
                              </span>
                            )}
                            {job.remote && (
                              <Badge variant="secondary" className="bg-gray-100 text-gray-800">Remote</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className="bg-gray-100 text-gray-800 border-gray-200">
                              <Zap className="w-3 h-3 mr-1" />
                              Foundation Level Job
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-700">
                              {job.matchScore}%
                            </div>
                            <div className="text-xs text-gray-600">Match</div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSaveJob(job.id)}
                            className={savedJobs.includes(job.id) ? "text-red-500" : ""}
                          >
                            <Heart className={`w-4 h-4 ${savedJobs.includes(job.id) ? "fill-current" : ""}`} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Application Type Info */}
                  <div className="mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-gray-600" />
                        <h4 className="text-sm font-semibold text-gray-900">Foundation Level Job</h4>
                      </div>
                      <p className="text-xs text-gray-800 mb-2">
                        Apply using your profile and complete a practical assessment designed for this role.
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-700">
                        <span>• Skills-based assessment</span>
                        <span>• Real-world scenarios</span>
                        <span>• Professional feedback</span>
                      </div>
                    </div>
                  </div>

                  {/* Match Reasons */}
                  {job.matchReasons.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Why this matches you:</h4>
                      <div className="space-y-1">
                        {job.matchReasons.map((reason, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Target className="w-3 h-3 text-gray-600" />
                            <span className="text-sm text-gray-600">{reason}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Job Description */}
                  <p className="text-gray-700 mb-4">{job.description}</p>

                  {/* Skills */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map(skill => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">
                        Posted {new Date(job.postedDate).toLocaleDateString()}
                      </span>
                      {job.urgency !== "low" && (
                        <Badge className={getUrgencyColor(job.urgency)}>
                          {job.urgency === "high" ? "Urgent" : "Popular"}
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.location.href = `/company-profile/2`}
                      >
                        <Building2 className="w-4 h-4 mr-2" />
                        View Company
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => window.location.href = `/job-application/${job.id}`}
                        className="bg-[#E2007A] hover:bg-[#c71868] text-white"
                      >
                        <Briefcase className="w-4 h-4 mr-2" />
                        View & Apply
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredJobs.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your filters or search terms
                  </p>
                  <Button variant="outline">
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Simple working chatbot */}
      <SimpleChatbot />
    </div>
  );
}