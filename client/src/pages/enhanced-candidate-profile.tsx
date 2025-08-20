import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Briefcase, MapPin, Calendar, Star, User, Mail, Phone, FileText, MessageSquare, Download } from 'lucide-react';

interface CandidateData {
  name: string;
  pronouns: string;
  email: string;
  location: string;
  availability: string;
  matchScore: number;
  jobTitle?: string;
  jobDepartment?: string;
  personalStory: {
    perfectJob: string;
    friendDescriptions: string[];
    teacherDescriptions: string[];
    motivations: string[];
    proudMoments: string[];
  };
  behavioralProfile: {
    personalityType: string;
    discPercentages: {
      red: number;
      yellow: number;
      green: number;
      blue: number;
    };
    communicationStyle: string;
    decisionMakingStyle: string;
    workStyleStrengths: string[];
    careerMotivators: string[];
  };
  roleInterests: string[];
  industryInterests: string[];
  keyStrengths: string[];
  communityEngagement: {
    totalPoints: number;
    proactivityScore: number;
    tier: string;
    recentActivities: string[];
  };
  skillsAssessment: {
    overallScore: number;
    assessments: Array<{
      name: string;
      score: number;
      description: string;
    }>;
  };
  pollenTeamInsights: string;
  visaStatus: string;
  interviewSupport: string;
}

interface Job {
  id: number;
  title: string;
  department: string;
}

export default function EnhancedCandidateProfile() {
  const { candidateId } = useParams<{ candidateId: string }>();
  const [location, setLocation] = useLocation();
  const [candidateData, setCandidateData] = useState<CandidateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState<Array<{id: number, name: string}>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Parse URL parameters
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const fromPage = urlParams.get('from') || 'applicants';
  const jobFilter = urlParams.get('job') || 'all';
  const statusFilter = urlParams.get('filter') || 'all';

  useEffect(() => {
    async function fetchData() {
      try {
        // Use a basic candidate template and adapt it for any candidate ID
        const candidateTemplate = {
          name: "Sample Candidate", pronouns: "they/them", matchScore: 85,
          location: "London, UK",
          skills: ["Digital Marketing", "Content Creation", "Social Media", "Analytics"],
          status: "new", appliedDate: "2025-01-22", behavioralType: "Creative Collaborator",
          keyStrengths: ["Creative thinking", "Team collaboration", "Analytical skills"],
          challengeScore: 87, availability: "Available immediately",
          jobId: 1, jobTitle: "Marketing Assistant", jobDepartment: "Marketing",
          email: "candidate@email.com", phone: "+44 7700 900123",
          educationLevel: "Bachelor's Degree", workExperience: "1-2 years",
          personalStory: {
            perfectJob: "A role where I can apply my skills and grow professionally in a collaborative environment.",
            friendDescriptions: ["Creative problem solver", "Reliable team member", "Great at communication"],
            teacherDescriptions: ["Strong analytical skills", "Leadership potential", "Strategic thinking"],
            motivations: ["Professional growth", "Making an impact", "Learning new skills"],
            proudMoments: ["Successfully completed university projects", "Demonstrated leadership in team settings", "Achieved academic excellence"]
          },
          behavioralProfile: {
            personalityType: "Creative Collaborator",
            discPercentages: { red: 25, yellow: 45, green: 20, blue: 10 },
            communicationStyle: "Collaborative and thoughtful, prefers clear communication and teamwork",
            decisionMakingStyle: "Considers multiple perspectives before making informed decisions",
            workStyleStrengths: ["Creative thinking", "Team collaboration", "Adaptability", "Communication skills"],
            careerMotivators: ["Professional growth", "Team success", "Learning opportunities", "Making an impact"]
          },
          roleInterests: ["Marketing", "Content Creation", "Digital Strategy", "Team Collaboration"],
          industryInterests: ["Technology", "Creative Industries", "Startups", "Professional Services"],
          communityEngagement: {
            totalPoints: 300,
            proactivityScore: 7.0,
            tier: "Active Member",
            recentActivities: ["Participated in community discussions", "Attended workshops", "Helped fellow members"]
          },
          skillsAssessment: {
            overallScore: 85,
            assessments: [
              { name: "Core Skills Assessment", score: 87, description: "Strong foundational skills with good growth potential" },
              { name: "Communication Skills", score: 89, description: "Excellent communication and collaboration abilities" },
              { name: "Problem Solving", score: 84, description: "Good analytical thinking with creative approach" },
              { name: "Technical Skills", score: 82, description: "Solid technical foundation with room for development" }
            ]
          },
          pollenTeamInsights: "This candidate shows strong potential with excellent communication skills and collaborative approach. They demonstrate good foundational knowledge and enthusiasm for learning and growth. Their problem-solving abilities and team-oriented mindset make them a valuable addition to any organization.",
          visaStatus: "UK Citizen",
          interviewSupport: "Confident communicator who performs well in structured interview settings"
        };

        // Create a candidate based on the requested ID with the template
        const mockCandidate = {
          ...candidateTemplate,
          id: parseInt(candidateId || '0'),
          name: `Candidate ${candidateId}`,
          email: `candidate${candidateId}@email.com`
        };
        
        setCandidateData(mockCandidate as any);

        // Create a simple list for navigation (just showing current candidate)
        const candidatesList = [{ id: mockCandidate.id, name: mockCandidate.name }];
        setCandidates(candidatesList);
        
        // Find current candidate index
        const index = candidatesList.findIndex(c => c.id.toString() === candidateId);
        setCurrentIndex(index >= 0 ? index : 0);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (candidateId) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [candidateId, jobFilter]);

  const navigateToCandidate = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex >= 0 && newIndex < candidates.length) {
      const newCandidateId = candidates[newIndex].id;
      setLocation(`/candidate-profile/${newCandidateId}?from=${fromPage}&job=${jobFilter}&filter=${statusFilter}`);
    }
  };

  const getJobContext = () => {
    if (jobFilter === 'all') {
      return 'All Jobs';
    }
    // Extract job number from jobFilter (e.g., 'job-001' -> '1')
    const jobNumber = jobFilter.replace('job-', '').replace(/^0+/, '');
    return `Job ${jobNumber}`;
  };

  const handleDownloadPDF = () => {
    window.open(`/api/candidate-profile-pdf/${candidateId}`, '_blank');
  };

  const handleSendMessage = () => {
    setLocation(`/employer-messages?candidate=${candidateId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading candidate profile...</p>
        </div>
      </div>
    );
  }

  if (!candidateData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Candidate Not Found</h1>
          <p className="text-gray-600 mb-4">The requested candidate profile could not be loaded.</p>
          <Button onClick={() => setLocation(`/${fromPage}`)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {fromPage === 'applicants' ? 'Applicants' : 'Candidates'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header with Navigation */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="outline" 
              onClick={() => setLocation(`/${fromPage}?job=${jobFilter}&filter=${statusFilter}`)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to {fromPage === 'applicants' ? 'Applicants' : 'Candidates'}
            </Button>
            
            <div className="flex items-center gap-4">
              {/* Context Badge */}
              <Badge variant="outline" className="flex items-center gap-2">
                <Briefcase className="w-3 h-3" />
                Viewing from: {getJobContext()}
              </Badge>
              
              {/* Navigation Controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateToCandidate('prev')}
                  disabled={currentIndex <= 0}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  {currentIndex + 1} of {candidates.length}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateToCandidate('next')}
                  disabled={currentIndex >= candidates.length - 1}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Candidate Profile Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-white">
                        {candidateData.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        {candidateData.name} ({candidateData.pronouns})
                      </h1>
                      <div className="flex items-center gap-4 text-gray-600 text-sm">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {candidateData.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {candidateData.availability}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-pink-500 mb-1">{candidateData.matchScore}%</div>
                    <div className="text-sm text-gray-600 flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      Overall Match
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{candidateData.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{candidateData.behavioralProfile.personalityType}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pollen Team Assessment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🍯 Pollen Team Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{candidateData.pollenTeamInsights}</p>
              </CardContent>
            </Card>

            {/* Additional profile sections would go here */}
          </div>

          {/* Sidebar Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" onClick={handleSendMessage}>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" className="w-full" onClick={handleDownloadPDF}>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </CardContent>
            </Card>

            {/* Key Information */}
            <Card>
              <CardHeader>
                <CardTitle>Key Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-gray-500">Skills Assessment</div>
                  <div className="text-lg font-bold">{candidateData.skillsAssessment.overallScore}%</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Community Engagement</div>
                  <div className="text-lg font-bold">{candidateData.communityEngagement.tier}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Visa Status</div>
                  <div className="text-sm">{candidateData.visaStatus}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}