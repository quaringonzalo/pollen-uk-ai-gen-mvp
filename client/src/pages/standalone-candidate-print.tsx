import { useEffect, useState } from 'react';
import { useParams } from 'wouter';

interface CandidateData {
  name: string;
  pronouns: string;
  email: string;
  location: string;
  availability: string;
  matchScore: number;
  behavioralDescriptor: string;
  behavioralSummary: string;
  shortDiscSummary: string;
  personalStory: {
    perfectJob: string;
    friendDescriptions: string;
    teacherDescriptions: string;
    motivations: string;
    proudMoments: string;
    happyActivities: string;
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
  references: Array<{
    name: string;
    role?: string;
    title?: string;
    company: string;
    email: string;
    testimonial: string;
  }>;
}

export default function StandaloneCandidatePrint() {
  const { candidateId } = useParams<{ candidateId: string }>();
  const [candidateData, setCandidateData] = useState<CandidateData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCandidate() {
      try {
        // Add cache-busting timestamp
        const timestamp = Date.now();
        const response = await fetch(`/api/candidates/comprehensive/${candidateId}?t=${timestamp}`);
        if (response.ok) {
          const data = await response.json();
          console.log('Candidate data loaded for print view:', data);
          setCandidateData(data);
        } else {
          console.error('Failed to fetch candidate data:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching candidate:', error);
      } finally {
        setLoading(false);
      }
    }

    if (candidateId) {
      fetchCandidate();
    }
  }, [candidateId]);

  // Set PDF ready state for Puppeteer - moved before early return
  useEffect(() => {
    if (candidateData) {
      document.body.setAttribute('data-pdf-ready', 'true');
    }
  }, [candidateData]);

  // Always render the container immediately for Puppeteer, show loading inside
  if (loading || !candidateData) {
    return (
      <div className="min-h-screen bg-white" id="candidate-profile-export-container">
        <div className="w-full bg-white p-8 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p className="text-gray-600">
              {loading ? "Loading candidate profile..." : "Unable to load candidate profile."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Use authentic database data directly
  const candidate = candidateData;

  return (
    <div className="min-h-screen bg-white" id="candidate-profile-export-container">
      <div className="max-w-4xl mx-auto p-6 bg-white">
        {/* Header Section */}
        <div className="border-b-4 border-pink-500 pb-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-white" style={{fontFamily: 'Sora'}}>
                  {candidate.name.split(' ').map((n: string) => n[0]).join('')}
                </span>
              </div>
              
              <div>
                <h1 className="text-xl font-bold text-gray-900 mb-1" style={{fontFamily: 'Sora'}}>
                  {candidate.name} ({candidate.pronouns})
                </h1>
                <div className="text-sm text-gray-600">
                  {candidate.location} • {candidate.availability}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-pink-500">{candidate.matchScore}%</div>
              <div className="text-sm text-gray-600">Overall Match</div>
            </div>
          </div>
        </div>

        {/* Pollen Team Assessment - TOP SECTION */}
        <div className="bg-yellow-50 border border-yellow-200 p-6 mb-6 rounded-lg">
          <h2 className="text-lg font-bold text-gray-900 mb-3" style={{fontFamily: 'Sora'}}>
            🍯 Pollen Team Assessment
          </h2>
          <div className="text-sm text-gray-700 leading-relaxed">
            <p>{candidate.pollenTeamInsights}</p>
          </div>
        </div>

        {/* Important Information Section */}
        <div className="bg-gray-50 p-4 mb-6 rounded">
          <h3 className="font-bold text-gray-900 mb-3" style={{fontFamily: 'Sora'}}>Important Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Visa Status:</span> {candidate.visaStatus}
            </div>
            <div>
              <span className="font-medium">Interview Support:</span> {candidate.interviewSupport}
            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="col-span-2 space-y-6">
            
            {/* Behavioural Profile Section */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4" style={{fontFamily: 'Sora'}}>
                Behavioural Profile
              </h2>
              
              <div className="bg-gray-50 p-4 rounded mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-lg">🧠</span>
                  <div>
                    <h3 className="font-medium text-gray-900">{candidate.behavioralProfile.personalityType}</h3>
                    <p className="text-sm text-gray-600">DISC Percentages: 
                      {Object.entries(candidate.behavioralProfile.discPercentages).map(([color, value]) => 
                        ` ${color.charAt(0).toUpperCase()}${color.slice(1)}: ${value}%`
                      ).join(', ')}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {candidate.behavioralSummary}
                </p>
              </div>
            </div>

            {/* How They Work Section */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3" style={{fontFamily: 'Sora'}}>How They Work</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Communication Style:</span>
                  <p className="text-gray-600 mt-1">{candidate.behavioralProfile.communicationStyle}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Decision-Making Style:</span>
                  <p className="text-gray-600 mt-1">{candidate.behavioralProfile.decisionMakingStyle}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Work Style Strengths:</span>
                  <ul className="text-gray-600 mt-1 ml-4 list-disc">
                    {candidate.behavioralProfile.workStyleStrengths.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Career Motivators:</span>
                  <ul className="text-gray-600 mt-1 ml-4 list-disc">
                    {candidate.behavioralProfile.careerMotivators.map((motivator, index) => (
                      <li key={index}>{motivator}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Personal Insights Section */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3" style={{fontFamily: 'Sora'}}>Personal Insights</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Perfect Job:</span>
                  <p className="text-gray-600 mt-1">{candidate.personalStory.perfectJob}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Described by Friends as:</span>
                  <p className="text-gray-600 mt-1">{candidate.personalStory.friendDescriptions}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Described by Teachers as:</span>
                  <p className="text-gray-600 mt-1">{candidate.personalStory.teacherDescriptions}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Most Proud of:</span>
                  <p className="text-gray-600 mt-1">{candidate.personalStory.proudMoments}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Role Interests:</span>
                  <p className="text-gray-600 mt-1">{candidate.roleInterests.join(', ')}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Industry Interests:</span>
                  <p className="text-gray-600 mt-1">{candidate.industryInterests.join(', ')}</p>
                </div>
              </div>
            </div>

            {/* Key Strengths Section */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3" style={{fontFamily: 'Sora'}}>Key Strengths</h3>
              <div className="grid grid-cols-1 gap-3">
                {candidate.keyStrengths.map((strength, index) => (
                  <div key={index} className="bg-white border border-gray-200 p-3 rounded">
                    <p className="text-sm text-gray-700 leading-relaxed">{strength}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Assessment Section */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3" style={{fontFamily: 'Sora'}}>Skills Assessment Performance</h3>
              <div className="bg-white border border-gray-200 p-4 rounded">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl font-bold text-pink-500">{candidate.skillsAssessment.overallScore}%</span>
                  <span className="text-sm text-gray-600">Overall Skills Score</span>
                </div>
                <div className="space-y-2">
                  {candidate.skillsAssessment.assessments.map((assessment, index) => (
                    <div key={index} className="text-sm">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{assessment.name}</span>
                        <span className="text-pink-500 font-medium">{assessment.score}%</span>
                      </div>
                      <p className="text-gray-600 text-xs mt-1">{assessment.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">

            {/* References Section */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3" style={{fontFamily: 'Sora'}}>References</h3>
              <div className="space-y-4">
                {candidate.references.map((reference, index) => (
                  <div key={index} className="bg-white border border-gray-200 p-3 rounded">
                    <h4 className="font-medium text-gray-900 text-sm">{reference.name}</h4>
                    <p className="text-xs text-gray-600 mb-2">{reference.title}</p>
                    <p className="text-xs text-gray-500 mb-2">{reference.email}</p>
                    <p className="text-xs text-gray-700 leading-relaxed italic">
                      "{reference.testimonial}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Community & Engagement Section */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3" style={{fontFamily: 'Sora'}}>Community & Engagement</h3>
              <div className="bg-white border border-gray-200 p-4 rounded">
                <div className="text-center mb-3">
                  <div className="text-2xl font-bold text-pink-500">{candidate.communityEngagement.proactivityScore}/10</div>
                  <div className="text-xs text-gray-600">Proactivity Score</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Points:</span>
                    <span className="font-medium">{candidate.communityEngagement.totalPoints}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tier:</span>
                    <span className="font-medium">{candidate.communityEngagement.tier}</span>
                  </div>
                </div>
                <div className="mt-3">
                  <h4 className="text-xs font-medium text-gray-700 mb-2">Recent Activities</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {candidate.communityEngagement.recentActivities.map((activity, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="text-pink-500">•</span>
                        <span>{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}