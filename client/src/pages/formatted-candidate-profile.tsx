import React, { useState, useEffect } from 'react';
import { useParams } from 'wouter';

interface CandidateData {
  id: number;
  name: string;
  email: string;
  pronouns?: string;
  status: string;
  overallMatch: number;
  skillsScore: number;
  behavioralScore: number;
  proactivityScore: number;
  totalPoints: number;
  joinedDate: string;
  personalStory: {
    perfectJob: string;
    friendDescriptions: string;
    teacherDescriptions: string;
    mostHappy: string;
    mostProudOf: string;
  };
  behavioralProfile: {
    personalityType: string;
    personalityEmoji: string;
    personalityDescription: string;
    discPercentages: {
      red: number;
      yellow: number;
      green: number;
      blue: number;
    };
    communicationStyle: {
      title: string;
      description: string;
    };
    decisionMakingStyle: {
      title: string;
      description: string;
    };
    careerMotivators: string[];
    workStyleStrengths: string[];
  };
  keyStrengths: string[];
  roleInterests: string[];
  industryInterests: string[];
  pollenTeamInsights: string;
  references: Array<{
    name: string;
    title: string;
    email: string;
    quote: string;
  }>;
  communityAchievements: {
    badges: Array<{
      name: string;
      description: string;
      icon: string;
      color: string;
    }>;
  };
  skillsAssessment: {
    overallScore: number;
    assessments: Array<{
      skill: string;
      score: number;
      description: string;
      feedback: string;
      criteria: string;
    }>;
  };
}

export default function FormattedCandidateProfile() {
  const { candidateId } = useParams<{ candidateId: string }>();
  const [candidateData, setCandidateData] = useState<CandidateData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCandidate() {
      try {
        const timestamp = Date.now();
        
        // First try comprehensive API without auth
        let response = await fetch(`/api/candidates/comprehensive/${candidateId}?t=${timestamp}`);
        
        // If that fails, try the PDF HTML endpoint which doesn't require auth
        if (!response.ok) {
          response = await fetch(`/api/candidate-pdf-html/${candidateId}?t=${timestamp}`);
          if (response.ok) {
            // If it's HTML, parse it to get the data
            const htmlText = await response.text();
            // Extract candidate data from the HTML response
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');
            const scriptTag = doc.querySelector('script[data-candidate]');
            if (scriptTag) {
              const candidateData = JSON.parse(scriptTag.textContent || '{}');
              setCandidateData(candidateData);
              return;
            }
          }
          
          // If all else fails, create a simple fallback
          setCandidateData({
            id: parseInt(candidateId),
            name: "Loading...",
            email: "",
            personalStory: { perfectJob: "", friendDescriptions: "", teacherDescriptions: "", motivations: "", proudMoments: "" },
            behavioralProfile: { 
              personalityType: "Loading...",
              discPercentages: { red: 0, yellow: 0, green: 0, blue: 0 },
              communicationStyle: "",
              decisionMakingStyle: "",
              workStyleStrengths: [],
              careerMotivators: [],
              idealWorkEnvironment: []
            },
            keyStrengths: [],
            communityPoints: 0,
            proactivityScore: 0,
            weeklyStreak: 0,
            visaStatus: "",
            reasonableAdjustments: "",
            skillsAssessment: { overallScore: 0, assessments: [] },
            pollenTeamAssessment: { interviewPerformance: 0, insights: "" }
          });
          return;
        }
        
        const data = await response.json();
        console.log('Candidate data loaded:', data);
        setCandidateData(data);
      } catch (error) {
        console.error('Error fetching candidate:', error);
        // Provide fallback data to prevent page crashes
        setCandidateData({
          id: parseInt(candidateId),
          name: "Candidate Profile",
          email: "",
          personalStory: { perfectJob: "", friendDescriptions: "", teacherDescriptions: "", motivations: "", proudMoments: "" },
          behavioralProfile: { 
            personalityType: "Profile Loading",
            discPercentages: { red: 25, yellow: 25, green: 25, blue: 25 },
            communicationStyle: "",
            decisionMakingStyle: "",
            workStyleStrengths: [],
            careerMotivators: [],
            idealWorkEnvironment: []
          },
          keyStrengths: [],
          communityPoints: 0,
          proactivityScore: 0,
          weeklyStreak: 0,
          visaStatus: "",
          reasonableAdjustments: "",
          skillsAssessment: { overallScore: 0, assessments: [] },
          pollenTeamAssessment: { interviewPerformance: 0, insights: "" }
        });
      } finally {
        setLoading(false);
      }
    }

    if (candidateId) {
      fetchCandidate();
    }
  }, [candidateId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading candidate profile...</div>
      </div>
    );
  }

  if (!candidateData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">Failed to load candidate data</div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @media print {
          body { margin: 0; padding: 0; }
          .print-hidden { display: none !important; }
          .max-w-6xl { max-width: none !important; }
          .shadow-sm { box-shadow: none !important; }
          .rounded-lg { border-radius: 0 !important; }
          .mb-6 { margin-bottom: 1rem !important; }
          .p-8 { padding: 1rem !important; }
          .gap-6 { gap: 0.5rem !important; }
          .text-4xl { font-size: 1.5rem !important; }
          .text-3xl { font-size: 1.25rem !important; }
          .text-2xl { font-size: 1.125rem !important; }
          .text-xl { font-size: 1rem !important; }
          .bg-gray-50 { background-color: white !important; }
          .bg-white { background-color: white !important; }
          .page-break { page-break-before: always; }
        }
      `}</style>
      <div className="min-h-screen bg-gray-50 p-8">
        {/* Header Section */}
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm p-8 mb-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center text-2xl font-bold text-pink-600">
            {candidateData.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-4xl font-bold text-gray-900">{candidateData.name}</h1>
              {candidateData.pronouns && (
                <span className="text-lg text-gray-600">{candidateData.pronouns}</span>
              )}
              <span className="bg-pink-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                In Progress
              </span>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-700">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">Waiting for candidate to book interview slot</span>
                </div>
                <span className="text-blue-600 text-sm font-medium">Candidate action</span>
              </div>
            </div>

            {/* Score Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-pink-50 border border-pink-200 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-pink-600 mb-2">{candidateData.overallMatch}%</div>
                <div className="text-pink-700 font-medium">Overall Match</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{candidateData.skillsScore}%</div>
                <div className="text-green-700 font-medium">Skills Assessment</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{candidateData.behavioralScore}%</div>
                <div className="text-blue-700 font-medium">Behavioural Compatibility Score</div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4 text-gray-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span>2 weeks notice required</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pollen Team Assessment */}
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm p-8 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="text-pink-600">⭐</span>
          Pollen Team Assessment
        </h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <p className="text-gray-700 leading-relaxed">{candidateData.pollenTeamInsights}</p>
        </div>
      </div>

      {/* Personality Type & Behavioural Profile */}
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm p-8 mb-6">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">{candidateData.behavioralProfile.personalityEmoji}</div>
          <h2 className="text-2xl font-bold text-pink-600 mb-4">{candidateData.behavioralProfile.personalityType}</h2>
          <p className="text-gray-700 max-w-4xl mx-auto leading-relaxed">
            {candidateData.behavioralProfile.personalityDescription}
          </p>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="text-pink-600">🧠</span>
          Behavioural Profile
        </h3>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">{candidateData.behavioralProfile.discPercentages.red}%</div>
            <div className="text-red-700 font-medium mb-1">Dominance</div>
            <div className="text-red-600 text-sm">Results-focused</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">{candidateData.behavioralProfile.discPercentages.yellow}%</div>
            <div className="text-yellow-700 font-medium mb-1">Influence</div>
            <div className="text-yellow-600 text-sm">People-focused</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{candidateData.behavioralProfile.discPercentages.green}%</div>
            <div className="text-green-700 font-medium mb-1">Steadiness</div>
            <div className="text-green-600 text-sm">Stability-focused</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{candidateData.behavioralProfile.discPercentages.blue}%</div>
            <div className="text-blue-700 font-medium mb-1">Conscientiousness</div>
            <div className="text-blue-600 text-sm">Quality-focused</div>
          </div>
        </div>

        <div className="text-center bg-pink-50 border border-pink-200 rounded-lg p-4">
          <span className="text-pink-700 font-medium">Balanced and adaptable</span>
        </div>
      </div>

      {/* How They Work */}
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm p-8 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">How They Work</h2>
        
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-purple-900 mb-2 flex items-center gap-2">
              <span>💬</span>
              Communication Style
            </h3>
            <h4 className="font-semibold text-purple-800 mb-3">{candidateData.behavioralProfile.communicationStyle.title}</h4>
            <p className="text-purple-700 text-sm leading-relaxed">{candidateData.behavioralProfile.communicationStyle.description}</p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-green-900 mb-2 flex items-center gap-2">
              <span>⚖️</span>
              Decision-Making Style
            </h3>
            <h4 className="font-semibold text-green-800 mb-3">{candidateData.behavioralProfile.decisionMakingStyle.title}</h4>
            <p className="text-green-700 text-sm leading-relaxed">{candidateData.behavioralProfile.decisionMakingStyle.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-purple-900 mb-4 flex items-center gap-2">
              <span>🎯</span>
              Career Motivators
            </h3>
            <ul className="space-y-2">
              {candidateData.behavioralProfile.careerMotivators.map((motivator, index) => (
                <li key={index} className="flex items-center gap-2 text-purple-700 text-sm">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  {motivator}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-bold text-yellow-900 mb-4 flex items-center gap-2">
              <span>🦋</span>
              Work Style Strengths
            </h3>
            <ul className="space-y-2">
              {candidateData.behavioralProfile.workStyleStrengths.map((strength, index) => (
                <li key={index} className="flex items-center gap-2 text-yellow-700 text-sm">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Key Strengths */}
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm p-8 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Key Strengths</h2>
        
        <div className="space-y-6">
          {candidateData.keyStrengths.map((strength, index) => {
            // Extract title and description if it's an object, otherwise use as title
            let title: string, description: string;
            if (typeof strength === 'object' && strength !== null && 'title' in strength) {
              title = (strength as any).title || String(strength);
              description = (strength as any).description || '';
            } else {
              title = String(strength);
              description = '';
            }
            
            return (
              <div key={index} className="border-l-4 border-pink-400 pl-6">
                <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
                {description && (
                  <p className="text-gray-700 leading-relaxed">{description}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Personal Insights */}
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm p-8 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Personal Insights</h2>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span>💼</span>
              PERFECT JOB IS...
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">{candidateData.personalStory.perfectJob}</p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span>😊</span>
              MOST HAPPY WHEN...
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              {candidateData.personalStory.mostHappy || 'Information not available'}
            </p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span>👥</span>
              DESCRIBED AS...
            </h3>
            <div className="text-gray-700 text-sm leading-relaxed">
              <div className="mb-2">
                <span className="font-medium">By friends:</span> {candidateData.personalStory.friendDescriptions}
              </div>
              <div>
                <span className="font-medium">By teachers:</span> {candidateData.personalStory.teacherDescriptions}
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span>⭐</span>
              MOST PROUD OF...
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">{candidateData.personalStory.mostProudOf}</p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span>🎯</span>
              INTERESTED IN ROLES IN...
            </h3>
            <div className="flex flex-wrap gap-2">
              {candidateData.roleInterests.map((role, index) => (
                <span key={index} className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
                  {role}
                </span>
              ))}
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span>🏢</span>
              INDUSTRY INTERESTS...
            </h3>
            <div className="flex flex-wrap gap-2">
              {candidateData.industryInterests.map((industry, index) => (
                <span key={index} className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
                  {industry}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* References */}
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm p-8 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">References</h2>
        
        <div className="space-y-6">
          {candidateData.references.map((reference, index) => (
            <div key={index} className="border-l-4 border-gray-300 pl-6">
              <h3 className="font-bold text-gray-900 text-lg">{reference.name}</h3>
              <p className="text-gray-600 mb-2">{reference.title}</p>
              <p className="text-gray-500 text-sm mb-3">{reference.email}</p>
              <p className="text-gray-700 italic leading-relaxed">"{reference.quote}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* Community & Engagement */}
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm p-8 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Community & Engagement</h2>
        
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Proactivity Score</h3>
            <div className="text-4xl font-bold text-gray-900 mb-2">{candidateData.proactivityScore}/10</div>
            <p className="text-gray-600 text-sm">Based on community engagement and learning activities</p>
          </div>
          <div className="text-right">
            <p className="text-gray-600 text-sm">Joined Pollen</p>
            <p className="font-medium text-gray-900">{candidateData.joinedDate}</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Community Achievements</h3>
          <p className="text-gray-600 text-sm mb-6">
            Badges awarded based on candidate's participation in the Pollen community — including learning engagement and peer support.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            {candidateData.communityAchievements.badges.map((badge, index) => (
              <div key={index} className={`${badge.color} rounded-lg p-4 text-center`}>
                <div className="text-2xl mb-2">{badge.icon}</div>
                <h4 className="font-bold text-gray-900 mb-1">{badge.name}</h4>
                <p className="text-gray-700 text-sm">{badge.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skills Assessment */}
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm p-8 mb-6">
        <div className="text-center mb-8">
          <div className="bg-green-100 border border-green-200 rounded-lg p-8 inline-block">
            <div className="text-5xl font-bold text-green-600 mb-2">{candidateData.skillsAssessment.overallScore}%</div>
            <div className="text-green-700 font-medium">Overall Skills Score</div>
            <p className="text-gray-600 text-sm mt-2">Combined performance across all assessment areas</p>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span>📊</span>
          Assessment Scores
        </h3>

        <div className="grid grid-cols-2 gap-6">
          {candidateData.skillsAssessment.assessments.map((assessment, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">💡</span>
                <div>
                  <h4 className="font-bold text-gray-900">{assessment.skill}</h4>
                  <div className="text-2xl font-bold text-green-600">{assessment.score}%</div>
                </div>
              </div>
              
              <p className="text-gray-700 text-sm mb-4 leading-relaxed">{assessment.description}</p>
              
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium text-gray-900">What we looked for:</span>
                  <span className="text-gray-700"> {assessment.criteria}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">How we scored this:</span>
                  <span className="text-gray-700"> {assessment.feedback}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Print Button */}
      <div className="max-w-6xl mx-auto text-center mb-8">
        <button 
          onClick={() => window.print()}
          className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-lg font-medium print-hidden"
        >
          Print/Save as PDF
        </button>
      </div>
      </div>
    </>
  );
}