import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowRight, MapPin, PoundSterling, Clock, 
  Building2, Star, Trophy, CheckCircle2, 
  AlertTriangle, Target, Zap, Users, 
  BookOpen, FileText, Settings, Home, Bookmark
} from "lucide-react";
import { useLocation } from "wouter";

// Sample user profile completion data
const USER_PROFILE_STATUS = {
  overallCompletion: 85, // Temporarily set to complete for demo
  isComplete: true, // Enable applications for demo purposes
  sections: {
    workStyle: { completed: true, title: "Work Style Assessment" },
    personalStory: { completed: true, title: "Personal Story" },
    education: { completed: false, title: "Education & Learning" },
    careerInterests: { completed: true, title: "Career Interests" },
    practical: { completed: false, title: "Practical Information" },
    background: { completed: false, title: "Background Information" }
  }
};

// Sample job recommendations based on profile completion
const PERSONALIZED_JOBS = [
  {
    id: "job-002",
    title: "Marketing Coordinator",
    company: { id: "2", name: "TechFlow Solutions", logo: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=60&h=60&fit=crop&crop=centre", rating: 4.8 },
    location: "London, UK",
    type: "Full-time",
    salary: { min: 25000, max: 32000 },
    matchScore: 92,
    challengeTime: "45-60 min",
    applicationDeadline: "15 Jan 2025"
  },
  {
    id: "job-003",
    title: "Content Creator",
    company: { id: "5", name: "Creative Studio", logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=60&h=60&fit=crop&crop=centre", rating: 4.6 },
    location: "Manchester, UK",
    type: "Full-time",
    salary: { min: 25000, max: 28000 },
    matchScore: 88,
    challengeTime: "30-45 min",
    applicationDeadline: "20 Jan 2025"
  },
  {
    id: "job-004",
    title: "Social Media Assistant",
    company: { id: "3", name: "Digital Agency", logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=60&h=60&fit=crop&crop=centre", rating: 4.7 },
    location: "Remote",
    type: "Part-time",
    salary: { min: 25000, max: 30000 },
    matchScore: 85,
    challengeTime: "40-50 min",
    applicationDeadline: "25 Jan 2025"
  }
];

const GENERAL_JOBS = [
  {
    id: "job-005",
    title: "Administrative Assistant",
    company: { id: "4", name: "Local Business", logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=60&h=60&fit=crop&crop=centre", rating: 4.2 },
    location: "Birmingham, UK",
    type: "Full-time",
    salary: { min: 25000, max: 30000 },
    challengeTime: "25-35 min",
    applicationDeadline: "30 Jan 2025"
  },
  {
    id: "job-006",
    title: "Customer Service Representative",
    company: { id: "6", name: "Support Solutions", logo: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=60&h=60&fit=crop&crop=centre", rating: 4.1 },
    location: "Leeds, UK",
    type: "Full-time",
    salary: { min: 25000, max: 29000 },
    challengeTime: "30-40 min",
    applicationDeadline: "28 Jan 2025"
  }
];

export default function SimplifiedJobSeekerDashboard() {
  const [, setLocation] = useLocation();
  const [showProfileAlert, setShowProfileAlert] = useState(USER_PROFILE_STATUS.overallCompletion < 80);

  const isProfileComplete = USER_PROFILE_STATUS.isComplete;
  const incompleteSections = Object.entries(USER_PROFILE_STATUS.sections)
    .filter(([, section]) => !section.completed)
    .map(([key, section]) => ({ key, ...section }));

  const handleApplyToJob = (jobId: string) => {
    if (isProfileComplete) {
      setLocation(`/jobs/${jobId}/apply`);
    } else {
      // Profile must be complete to apply
      setLocation("/profile-checkpoints");
    }
  };

  const handleCompleteProfile = () => {
    setLocation("/profile-checkpoints");
  };





  const renderJobCard = (job: any, isPersonalized = false) => (
    <Card key={job.id} className={isPersonalized ? "border-green-200" : ""}>
      <CardHeader className="p-4 sm:p-6">
        <div className="flex items-start gap-2 sm:gap-3">
          <img 
            src={job.company.logo} 
            alt={`${job.company.name} logo`}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base sm:text-lg mb-1">
                  <button 
                    onClick={() => handleApplyToJob(job.id)}
                    className="text-left hover:text-blue-600 transition-colors cursor-pointer line-clamp-2"
                  >
                    {job.title}
                  </button>
                </CardTitle>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-gray-600 text-sm mb-2">
                  <button 
                    onClick={() => window.open(`/company-profile/${job.company.id}`, '_blank')}
                    className="hover:text-blue-600 transition-colors cursor-pointer text-left"
                  >
                    {job.company.name}
                  </button>
                  {job.company.rating && (
                    <>
                      <span className="hidden sm:inline">•</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{job.company.rating}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              {isPersonalized && job.reasons && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs self-start">
                  <span className="hidden sm:inline">You might like this</span>
                  <span className="sm:hidden">Match</span>
                </Badge>
              )}
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <PoundSterling className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">£{job.salary.min.toLocaleString()}-£{job.salary.max.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{job.challengeTime}</span>
              </div>
            </div>
            {job.applicationDeadline && (
              <div className="flex items-center gap-1 text-xs sm:text-sm text-orange-600 mb-3">
                <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Apply by {job.applicationDeadline}</span>
              </div>
            )}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">{job.type}</Badge>
              </div>
              {isProfileComplete ? (
                <Button onClick={() => handleApplyToJob(job.id)} size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
                  View & Apply
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={() => handleApplyToJob(job.id)} 
                  size="sm" 
                  variant="outline"
                  className="w-full sm:w-auto text-xs sm:text-sm"
                >
                  View & Apply
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Find Your Next Opportunity</h1>
        <p className="text-sm sm:text-base text-gray-600">
          Apply to jobs with custom assessments designed for each role
        </p>
      </div>



      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Personalized Jobs (only show if profile is reasonably complete) */}
          {isProfileComplete ? (
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3 sm:gap-0">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  <h2 className="text-lg sm:text-xl font-semibold">Recommended for You</h2>
                  <Badge className="bg-green-100 text-green-700 text-xs">Personalised</Badge>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  <Button variant="outline" size="sm" onClick={() => setLocation("/companies")} className="w-full sm:w-auto whitespace-nowrap text-xs sm:text-sm">
                    <Building2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Browse Companies
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setLocation("/saved-items")} className="w-full sm:w-auto whitespace-nowrap text-xs sm:text-sm">
                    <Bookmark className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Saved Items
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                {PERSONALIZED_JOBS.map(job => renderJobCard(job, true))}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3 sm:gap-0">
                <h2 className="text-lg sm:text-xl font-semibold">Available Opportunities</h2>
                <Button variant="outline" size="sm" onClick={handleCompleteProfile} className="w-full sm:w-auto text-xs sm:text-sm">
                  <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  <span className="hidden sm:inline">Complete Profile for Personalised Jobs</span>
                  <span className="sm:hidden">Complete Profile</span>
                </Button>
              </div>
              <div className="space-y-4">
                {GENERAL_JOBS.map(job => renderJobCard(job, false))}
              </div>
            </div>
          )}

          {/* All Jobs Section */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-4">More Opportunities</h2>
            <div className="space-y-4">
              {(isProfileComplete ? GENERAL_JOBS : PERSONALIZED_JOBS).map(job => renderJobCard(job, false))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-3 sm:space-y-4 lg:space-y-6 order-first lg:order-last">

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Applications</span>
                  <span className="font-semibold">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Assessments Completed</span>
                  <span className="font-semibold">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Interview Invitations</span>
                  <span className="font-semibold">1</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hidden Jobs Board Card */}
          <Card className="border-2 border-purple-200 bg-purple-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                Hidden Jobs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-gray-600">
                Exclusive opportunities only available to Pollen users. Never advertised elsewhere.
              </p>
              
              <Button 
                onClick={() => setLocation("/hidden-jobs")} 
                className="w-full text-xs sm:text-sm bg-purple-600 hover:bg-purple-700"
                size="sm"
              >
                Explore Hidden Jobs
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}