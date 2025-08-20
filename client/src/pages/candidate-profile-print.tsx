import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";
import { useRoute } from "wouter";

// Simplified candidate interface for print view
interface Candidate {
  id: string;
  name: string;
  pronouns: string;
  location: string;
  email: string;
  phone: string;
  availability: string;
  matchScore: number;
  proactivityScore: number;
  communityPoints: number;
  joinedDate: string;
  personalityType: string;
  personalityEmoji: string;
  behavioralAssessment: {
    discProfile: {
      red: number;
      yellow: number;
      green: number;
      blue: number;
    };
    personalityType: string;
    workStyle: string;
    communicationStyle: string;
    strengths: string[];
  };
  personalStory: {
    perfectJob: string;
    mostHappy: string;
    describedAs: string;
    mostProudOf: string;
  };
  careerInterests: {
    roleTypes: string[];
    industries: string[];
  };
  keyStrengths: Array<{
    title: string;
    description: string;
  }>;
  howTheyWork: {
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
  references: Array<{
    name: string;
    title: string;
    email: string;
    testimonial: string;
  }>;
}

// Get candidate data from URL params or props
function getCandidateData(candidateId: string) {
  // In a real implementation, this would fetch from API
  // For now, return Sarah Chen's data for PDF generation
  return {
    id: candidateId,
    name: "Sarah Chen",
    pronouns: "she/her",
    location: "London, UK",
    email: "sarah.chen@email.com",
    phone: "+44 7700 900123",
    availability: "Available to start immediately",
    matchScore: 87,
    proactivityScore: 8.2,
    communityPoints: 635,
    joinedDate: "October 2024",
    personalityType: "Social Butterfly",
    personalityEmoji: "🦋",
    behavioralAssessment: {
      discProfile: {
        red: 22,
        yellow: 45,
        green: 28,
        blue: 5
      },
      personalityType: "Social Butterfly",
      workStyle: "Collaborative and people-focused",
      communicationStyle: "Warm and collaborative",
      strengths: ["Natural Team Connector", "Creative Communication", "Collaborative Problem Solving"]
    },
    personalStory: {
      perfectJob: "A collaborative role where I can make a meaningful impact on people and help build something amazing with a supportive team.",
      mostHappy: "Working with others to solve challenging problems and seeing the positive impact our work has on real people.",
      describedAs: "Reliable, creative, and supportive",
      mostProudOf: "Leading a successful team project at university that improved the student experience for hundreds of people."
    },
    careerInterests: {
      roleTypes: ["Administration & Office Support", "Sales & Business Development"],
      industries: ["Finance & Banking", "Technology & Software"]
    },
    keyStrengths: [
      {
        title: "Natural Team Connector",
        description: "Sarah has this brilliant ability to bring people together and make everyone feel included. She naturally creates positive team dynamics where creative ideas can flourish and collaboration feels effortless."
      },
      {
        title: "Creative Communication", 
        description: "She excels at translating complex ideas into engaging, accessible content. Her natural communication skills help her connect with different audiences and build genuine relationships through her work."
      },
      {
        title: "Collaborative Problem Solving",
        description: "Sarah thrives when working with others to tackle challenges. She brings enthusiasm and fresh perspectives to group projects whilst ensuring everyone's voices are heard and valued."
      }
    ],
    howTheyWork: {
      communicationStyle: {
        title: "Warm and collaborative",
        description: "Sarah naturally creates inclusive conversations where everyone feels heard. She's excellent at building rapport with colleagues and translating ideas between different team members to keep projects moving forward."
      },
      decisionMakingStyle: {
        title: "Collaborative and people-focused", 
        description: "Sarah likes to gather input from team members and considers how decisions will impact different people. She balances creative possibilities with practical considerations, often finding solutions that work well for everyone involved."
      },
      careerMotivators: [
        "Making meaningful connections with colleagues and clients",
        "Creating work that positively impacts people and communities", 
        "Learning from experienced team members and mentors",
        "Contributing to collaborative projects with visible results"
      ],
      workStyleStrengths: [
        "Collaborative team environments with regular interaction",
        "Projects that combine creativity with people-focused outcomes",
        "Roles where relationship-building is valued and encouraged", 
        "Supportive workplaces with open communication and feedback"
      ]
    },
    references: [
      {
        name: "Dr. Sarah Mitchell",
        title: "Senior Lecturer, University of Bath",
        email: "s.mitchell@bath.ac.uk",
        testimonial: "Sarah demonstrated exceptional analytical and technical skills throughout her studies. Her attention to detail and systematic approach to problem-solving consistently impressed both staff and peers."
      },
      {
        name: "James Thompson", 
        title: "Team Lead, Local Community Project",
        email: "j.thompson@communityproject.org",
        testimonial: "Outstanding team player who balances both creativity and attention to detail. Communicates brilliantly with everyone and approaches technical problems with methodology and patience."
      }
    ]
  };
}

export default function CandidateProfilePrint() {
  const [match, params] = useRoute("/candidate-profile-print/:candidateId");
  const candidateId = params?.candidateId || "1";

  // Ensure we have a valid candidate ID
  if (!match || !candidateId) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Candidate Not Found</h1>
          <p className="text-gray-600">The requested candidate profile could not be loaded.</p>
        </div>
      </div>
    );
  }
  
  // Helper function for personality emojis
  const getPersonalityEmoji = (personalityType: string): string => {
    const emojiMap: { [key: string]: string } = {
      "The Strategic Ninja": "🥷",
      "The Rocket Launcher": "🚀", 
      "The Social Butterfly": "🦋",
      "The Results Machine": "⚡",
      "The Creative Genius": "🎨",
      "The People Champion": "👑",
      "The Quality Guardian": "🛡️",
      "The Innovation Catalyst": "💡",
      "The Team Builder": "🤝",
      "The Problem Solver": "🔧",
      "The Steady Rock": "🗿",
      "The Precision Master": "🎯",
      "Methodical Achiever": "📊",
      "Reliable Foundation": "🏗️",
      "Social Butterfly": "🦋"
    };
    return emojiMap[personalityType] || "✨";
  };

  // Check if this is PDF mode (hide UI elements)
  let isPdfMode = false;
  try {
    const urlParams = new URLSearchParams(window.location.search);
    isPdfMode = urlParams.get('pdf') === 'true';
  } catch (error) {
    console.log('URL params not available, defaulting to false');
  }

  // Add print date to body for CSS content and setup
  useEffect(() => {
    if (typeof document !== 'undefined') {
      try {
        document.body.setAttribute('data-print-date', new Date().toLocaleDateString('en-GB'));
        
        // Add PDF mode class for styling
        if (isPdfMode) {
          document.body.classList.add('pdf-mode');
        }
      } catch (error) {
        console.log('Document setup error:', error);
      }
    }
  }, [isPdfMode]);

  const candidate = getCandidateData(candidateId);

  // Add print styles and setup - simplified for PDF generation
  useEffect(() => {
    if (typeof document !== 'undefined') {
      try {
        // Mark page as loaded for PDF generator
        document.body.setAttribute('data-page-loaded', 'true');
        
        // Add print styles
        const style = document.createElement('style');
        style.textContent = `
          @media print {
            body { 
              margin: 0;
              padding: 0;
              background: white !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            
            #candidate-profile-export-container {
              margin: 0 !important;
              padding: 15mm !important;
              background: white !important;
              box-shadow: none !important;
              border-radius: 0 !important;
              max-width: none !important;
            }
            
            .print-header {
              display: block !important;
              margin-bottom: 20px !important;
              padding-bottom: 10px !important;
              border-bottom: 2px solid #E2007A !important;
            }
          }
          
          .print-header {
            display: none;
          }
          
          @media print {
            .print-header {
              display: block;
            }
          }
        `;
        document.head.appendChild(style);
        
        // Signal that the page is ready
        setTimeout(() => {
          document.body.setAttribute('data-pdf-ready', 'true');
        }, 1000);
        
        return () => {
          try {
            document.head.removeChild(style);
          } catch (e) {
            // Style might already be removed
          }
        };
      } catch (error) {
        console.log('Setup error:', error);
      }
    }
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-4" id="candidate-profile-export-container">
        {/* Print Header - Only visible in PDF */}
        <div className="print-header">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-lg">🍯</span>
              </div>
              <span className="font-bold text-xl" style={{fontFamily: 'Sora'}}>Pollen</span>
            </div>
            <div className="text-sm text-gray-600">
              Candidate Profile Export • Generated {new Date().toLocaleDateString('en-GB')}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6 space-y-6">
        {/* Header Section */}
        <div className="flex items-start justify-between pb-4 border-b">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-pink-600" style={{fontFamily: 'Sora'}}>
                {candidate.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-gray-900" style={{fontFamily: 'Sora'}}>
                  {candidate.name}
                </h1>
                <span className="text-gray-500 text-lg">({candidate.pronouns})</span>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                <span>{candidate.location}</span>
                <span>•</span>
                <span>{candidate.email}</span>
                <span>•</span>
                <span>{candidate.phone}</span>
              </div>
              
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                {candidate.availability}
              </Badge>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-pink-600 mb-1">{candidate.matchScore}%</div>
            <div className="text-sm text-gray-600">Overall Match</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Behavioural Profile */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 section-spacing">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{getPersonalityEmoji(candidate.personalityType)}</span>
                <h2 className="text-xl font-bold" style={{fontFamily: 'Sora'}}>Behavioural Profile & Work Style</h2>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-bold text-pink-600 mb-2" style={{fontFamily: 'Sora'}}>
                  {candidate.personalityType}
                </h3>
                <p className="text-sm text-gray-700 italic mb-3">Collaborative and people-focused</p>
                <p className="text-sm text-gray-800">
                  Sarah brings a collaborative and analytical approach to work, preferring thorough research and 
                  systematic problem-solving. She excels in environments that value accuracy, attention to 
                  detail and quality outcomes. Her systematic thinking style makes her particularly effective at 
                  breaking down complex challenges and delivering precise, well-researched results.
                </p>
                
                {/* DISC Chart - Simplified for print */}
                <div className="mt-4 grid grid-cols-4 gap-2 text-center">
                  <div>
                    <div className="text-2xl font-bold text-red-500">{candidate.behavioralAssessment.discProfile.red}%</div>
                    <div className="text-xs text-red-600 font-medium">Dominance<br/>Results-Focused</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-500">{candidate.behavioralAssessment.discProfile.yellow}%</div>
                    <div className="text-xs text-yellow-600 font-medium">Influence<br/>People-Focused</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-500">{candidate.behavioralAssessment.discProfile.green}%</div>
                    <div className="text-xs text-green-600 font-medium">Steadiness<br/>Stability-Focused</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-500">{candidate.behavioralAssessment.discProfile.blue}%</div>
                    <div className="text-xs text-blue-600 font-medium">Conscientiousness<br/>Quality-Focused</div>
                  </div>
                </div>
              </div>
            </div>

            {/* How They Work */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 section-spacing">
              <h2 className="text-xl font-bold mb-4" style={{fontFamily: 'Sora'}}>How They Work</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">💬</span>
                    <h4 className="font-semibold text-blue-800">Communication Style</h4>
                  </div>
                  <p className="font-medium text-blue-900 mb-1">{candidate.howTheyWork.communicationStyle.title}</p>
                  <p className="text-xs text-blue-700">{candidate.howTheyWork.communicationStyle.description}</p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">⚖️</span>
                    <h4 className="font-semibold text-green-800">Decision-Making Style</h4>
                  </div>
                  <p className="font-medium text-green-900 mb-1">{candidate.howTheyWork.decisionMakingStyle.title}</p>
                  <p className="text-xs text-green-700">{candidate.howTheyWork.decisionMakingStyle.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🎯</span>
                    <h4 className="font-semibold text-purple-800">Career Motivators</h4>
                  </div>
                  <ul className="text-xs text-purple-700 space-y-1">
                    {candidate.howTheyWork.careerMotivators.map((motivator, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="w-1 h-1 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                        {motivator}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🦋</span>
                    <h4 className="font-semibold text-yellow-800">Work Style Strengths</h4>
                  </div>
                  <ul className="text-xs text-yellow-700 space-y-1">
                    {candidate.howTheyWork.workStyleStrengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="w-1 h-1 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Personal Insights */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 section-spacing">
              <h2 className="text-xl font-bold mb-4" style={{fontFamily: 'Sora'}}>Personal Insights</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm">PERFECT JOB IS...</h4>
                  <p className="text-xs text-gray-700">{candidate.personalStory.perfectJob}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm">MOST HAPPY WHEN...</h4>
                  <p className="text-xs text-gray-700">{candidate.personalStory.mostHappy}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm">DESCRIBED AS...</h4>
                  <p className="text-xs text-gray-700">{candidate.personalStory.describedAs}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm">MOST PROUD OF...</h4>
                  <p className="text-xs text-gray-700">{candidate.personalStory.mostProudOf}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm">INTERESTED IN ROLES IN...</h4>
                  <p className="text-xs text-gray-700">
                    {candidate.careerInterests.roleTypes.join(" • ")}
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm">INDUSTRY INTERESTS...</h4>
                  <p className="text-xs text-gray-700">
                    {candidate.careerInterests.industries.join(" • ")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Key Strengths */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 section-spacing">
              <h3 className="text-lg font-bold mb-4" style={{fontFamily: 'Sora'}}>Key Strengths</h3>
              
              <div className="space-y-3">
                {candidate.keyStrengths.map((strength, index) => (
                  <div key={index} className="border-l-4 border-yellow-500 pl-3 py-2">
                    <h4 className="font-semibold text-sm mb-1">{strength.title}</h4>
                    <p className="text-xs text-gray-700">{strength.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Community & Engagement */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 section-spacing">
              <h3 className="text-lg font-bold mb-4" style={{fontFamily: 'Sora'}}>Community & Engagement</h3>
              
              <div className="space-y-3">
                <div>
                  <div className="text-lg font-bold text-pink-600">{candidate.proactivityScore}/10</div>
                  <div className="text-xs text-gray-600">Proactivity Score</div>
                  <div className="text-xs text-gray-500">Based on community engagement and learning activities</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Community Enthusiast</span>
                    <span className="font-medium">Helped 62 members</span>
                  </div>
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Active Learner</span>
                    <span className="font-medium">3 workshops attended</span>
                  </div>
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Rising Star</span>
                    <span className="font-medium">56% community rating</span>
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-2">
                    Joined Pollen: {candidate.joinedDate}
                  </div>
                </div>
              </div>
            </div>

            {/* References */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 section-spacing">
              <h3 className="text-lg font-bold mb-4" style={{fontFamily: 'Sora'}}>References</h3>
              
              <div className="space-y-3">
                {candidate.references.map((ref, index) => (
                  <div key={index} className="border-b border-gray-100 pb-3 last:border-b-0">
                    <div className="font-semibold text-sm text-gray-900">{ref.name}</div>
                    <div className="text-xs text-gray-600 mb-1">{ref.title}</div>
                    <div className="text-xs text-gray-500 mb-2">{ref.email}</div>
                    <p className="text-xs text-gray-700 italic">"{ref.testimonial}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}