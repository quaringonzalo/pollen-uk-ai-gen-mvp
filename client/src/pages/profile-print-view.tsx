import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Download, ArrowLeft, Edit, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
  pronouns?: string;
  behavioralAssessment?: {
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
  checkpointData?: any;
  personalStory?: any;
  careerPreferences?: any;
  proactivityScore?: number;
  createdAt?: string;
}

interface BehavioralInsights {
  idealWorkEnvironment?: string[];
  compatibleRoles?: string[];
}

export default function ProfilePrintView() {
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
      "Reliable Foundation": "🏗️"
    };
    return emojiMap[personalityType] || "✨";
  };

  // Check if this is PDF mode (hide UI elements)
  const urlParams = new URLSearchParams(window.location.search);
  const isPdfMode = urlParams.get('pdf') === 'true';

  // Add print date to body for CSS content - must be at the start
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.setAttribute('data-print-date', new Date().toLocaleDateString('en-GB'));
      
      // Add PDF mode class for styling
      if (isPdfMode) {
        document.body.classList.add('pdf-mode');
      }
    }
  }, [isPdfMode]);

  // PDF export function using server-side Puppeteer
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  
  const handlePdfExport = async () => {
    console.log('📄 PDF Export clicked - starting generation...');
    setIsGeneratingPdf(true);
    
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📄 PDF Generation response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('📄 PDF Generation failed:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      // Get the PDF blob
      const pdfBlob = await response.blob();
      console.log('📄 PDF blob received, size:', pdfBlob.size, 'bytes');
      
      // Create download link
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Pollen_Profile.pdf';
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      console.log('📄 PDF download triggered successfully');
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('📄 Error generating PDF:', error);
      alert(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Fetch real user profile data
  const { data: profileData, isLoading, error } = useQuery<UserProfile>({
    queryKey: ['/api/user-profile'],
    staleTime: 0, // Always fetch fresh data
  });

  // Fetch behavioural insights 
  const { data: behaviouralInsights } = useQuery<BehavioralInsights>({
    queryKey: ['/api/behavioural-insights'],
    enabled: !!profileData?.behavioralAssessment,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const handleDemoLogin = async () => {
    try {
      const response = await fetch('/api/demo-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Demo login failed:', error);
    }
  };

  if (error || !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Unable to load profile data</p>
          <div className="space-x-4">
            <Button onClick={handleDemoLogin} className="bg-yellow-500 hover:bg-yellow-600 text-black">
              Demo Login
            </Button>
            <Link href="/profile">
              <Button variant="outline" className="pdf-hidden">← Back to Profile</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-white" id="print-layout">
      {/* Embedded print CSS overrides */}
      <style>{`
        @media print {
          /* FORCE USER NAME LARGE */
          .user-name,
          h1.user-name,
          h1.text-2xl.font-bold.text-gray-900.user-name {
            font-size: 28px !important;
            font-weight: 900 !important;
            color: #272727 !important;
            font-family: 'Sora', sans-serif !important;
            margin-bottom: 8px !important;
            line-height: 1.1 !important;
          }
          
          /* FORCE BEHAVIORAL HEADLINE LARGE */
          .behavioral-headline,
          h3.behavioral-headline,
          h3.text-xl.font-bold.text-pink-800.mb-2.behavioral-headline {
            font-size: 22px !important;
            font-weight: 800 !important;
            color: #E2007A !important;
            font-family: 'Sora', sans-serif !important;
            margin-bottom: 6px !important;
            line-height: 1.2 !important;
          }
          
          /* FORCE GRID SPACING */
          .print-container,
          .print-container.grid.lg\\:grid-cols-3 {
            gap: 50px !important;
            column-gap: 50px !important;
          }
          
          /* FORCE SECTION HEADERS */
          h2.text-lg.font-semibold.mb-4.text-gray-900,
          h2.text-lg.font-semibold,
          h2.text-xl.font-bold {
            font-size: 18px !important;
            font-weight: 800 !important;
            color: #272727 !important;
            background: none !important;
            background-color: transparent !important;
            font-family: 'Sora', sans-serif !important;
            margin-bottom: 12px !important;
          }
          
          /* REMOVE GRADIENT BACKGROUNDS */
          .bg-gradient-to-r.from-pink-50.to-yellow-50 {
            background: transparent !important;
            background-color: transparent !important;
            background-image: none !important;
            border: 1px solid #e5e7eb !important;
          }
          
          /* FORCE DISC CARDS TO KEEP COLORS */
          .grid.grid-cols-2.gap-4 > div:nth-child(1) .bg-red-50 {
            background-color: #fef2f2 !important;
            border: 1px solid #fecaca !important;
          }
          
          .grid.grid-cols-2.gap-4 > div:nth-child(2) .bg-yellow-50 {
            background-color: #fefce8 !important;
            border: 1px solid #fde68a !important;
          }
          
          .grid.grid-cols-2.gap-4 > div:nth-child(3) .bg-green-50 {
            background-color: #f0fdf4 !important;
            border: 1px solid #bbf7d0 !important;
          }
          
          .grid.grid-cols-2.gap-4 > div:nth-child(4) .bg-blue-50 {
            background-color: #eff6ff !important;
            border: 1px solid #bfdbfe !important;
          }
          
          /* LEFT ALIGN HOW THEY WORK SECTIONS */
          .space-y-6 > div .text-center {
            text-align: left !important;
          }
          
          /* PRINT STYLES - Hide navigation and buttons during export */
          @media print {
            .no-print, nav, footer, button {
              display: none !important;
            }
            
            body {
              margin: 0 !important;
              padding: 0 !important;
            }
          }
        }
      `}</style>
      
      {/* Print Header - Only visible when printing */}
      <div className="hidden print:block print:p-2 print:border-b print:border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-sm">🍯</div>
          <span className="font-bold text-xs" style={{ fontFamily: 'Sora' }}>Pollen</span>
        </div>
      </div>
      
      {/* Header */}
      <div className="bg-white shadow-sm print:hidden border-b border-gray-200">
        <div className="w-full px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/profile">
                <Button variant="ghost" size="sm" className="print:hidden pdf-hidden">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Profile
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-300 print:hidden"></div>

            </div>
            <div className="flex items-center gap-2 print:hidden no-print">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePdfExport} 
                className="no-print pdf-hidden" 
                id="download-pdf-btn"
                disabled={isGeneratingPdf}
              >
                {isGeneratingPdf ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </>
                )}
              </Button>
              <Link href="/profile-checkpoints">
                <Button variant="outline" size="sm" className="pdf-hidden">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Expanded for A4 */}
      <div className="w-full max-w-none print-layout" style={{ padding: '16px 24px', width: 'calc(100% - 48px)', margin: '0 auto', minWidth: '900px', maxWidth: '1200px' }} id="profile-container" data-profile-content="true">
        <div className="print-container grid lg:grid-cols-3 gap-4 lg:items-start" style={{ gap: '24px', columnGap: '32px' }}>
          {/* Left Column - Profile & Personal Info (65% width) */}
          <div className="lg:col-span-2 space-y-4 section profile-section">
            {/* Profile Header */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 profile-card info-block">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold print:w-12 print:h-12 print:text-lg" style={{ backgroundColor: '#E2007A', fontFamily: 'Sora' }}>
                  {profileData.firstName?.[0]}{profileData.lastName?.[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900 user-name" style={{ fontSize: '24px', fontWeight: '900', color: '#000000', fontFamily: 'Sora, sans-serif' }}>
                      {profileData.firstName} {profileData.lastName}
                    </h1>
                    {profileData.pronouns && (
                      <span className="text-lg text-gray-700 font-semibold print:text-sm">({profileData.pronouns})</span>
                    )}
                  </div>
                  <div className="text-gray-600 mb-3 print:text-xs print:mb-1">
                    {profileData.phone && <p>{profileData.phone}</p>}
                    {profileData.location && <p>{profileData.location}</p>}
                  </div>
                  
                  {/* Availability Badge */}
                  <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-3 print:px-2 print:py-1 print:text-xs print:mb-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full print:w-1 print:h-1"></span>
                    Available to start immediately
                  </div>

                </div>
              </div>
            </div>



            {/* Behavioural Profile */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 profile-card info-block">
              <h2 className="text-lg font-semibold mb-4 text-gray-900" style={{ fontSize: '16px', fontWeight: '800', color: '#272727', fontFamily: 'Sora, sans-serif', background: 'none', backgroundColor: 'transparent' }}>Behavioural Profile & Work Style</h2>
              
              {profileData.behavioralAssessment ? (
                <div className="space-y-6">
                  {/* Personality Type with integrated quote */}
                  <div className="bg-gradient-to-r from-pink-50 to-yellow-50 border border-pink-200 rounded-xl p-6 print:bg-pink-50 print:p-2">
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-pink-800 mb-2 behavioral-headline" style={{ fontSize: '20px', fontWeight: '800', color: '#E2007A', fontFamily: 'Sora, sans-serif' }}>
                        <span className="pdf-hidden">{getPersonalityEmoji(profileData.behavioralAssessment.personalityType || "The Team Builder")} </span>{profileData.behavioralAssessment.personalityType || "The Team Builder"}
                      </h3>
                      <p className="text-pink-700 text-sm mb-3 behavioral-description">
                        {profileData.behavioralAssessment.workStyle || "Supportive and collaborative"}
                      </p>
                      <div className="border-t border-pink-200 pt-3">
                        <p className="text-sm text-pink-600 italic">
                          {(() => {
                            const personalityType = profileData.behavioralAssessment.personalityType;
                            const descriptionMap: { [key: string]: string } = {
                              // Pure Dominant Types
                              "The Results Dynamo": "Unstoppable force focused on delivering outcomes and exceeding expectations",
                              "The Social Butterfly": "Natural connector who brings people together and creates positive energy",
                              "The Steady Rock": "Reliable foundation who provides stability and supports team success",
                              "The Quality Guardian": "Detail-oriented expert who ensures excellence and maintains high standards",
                              
                              // Dual Combinations
                              "The Ambitious Influencer": "High-energy achiever who inspires teams while driving ambitious results",
                              "The Strategic Ninja": "Swift analytical decision-maker who strikes with precision and achieves results quietly",
                              "The Reliable Executor": "Dependable results-driver who delivers outcomes through consistent excellence",
                              "The Dynamic Leader": "Energetic leader who motivates teams while achieving breakthrough results",
                              "The People Magnet": "Charismatic team builder who creates harmony while inspiring collaborative success",
                              "The Inspiring Thinker": "Thoughtful communicator who engages others through insightful analysis",
                              "The Quiet Champion": "Supportive achiever who drives results while empowering team success",
                              "The Team Catalyst": "Energetic facilitator who sparks collaboration and accelerates team performance",
                              "The Thoughtful Planner": "Strategic coordinator who builds systematic approaches through careful team planning",
                              "The Analytical Driver": "Methodical leader who combines thorough analysis with decisive results-focused action",
                              "The Innovation Spark": "Creative researcher who transforms complex analysis into breakthrough insights",
                              "The Methodical Coordinator": "Systematic organizer who ensures team success through structured collaborative planning",
                              
                              // Balanced Profile
                              "The Versatile Chameleon": "Adaptable professional who excels across diverse situations and team dynamics",
                              
                              // Legacy support
                              "Methodical Achiever": "Methodical expert who delivers flawless work through careful attention to detail",
                              "Reliable Foundation": "Dependable team player who provides steady support and stability"
                            };
                            return descriptionMap[personalityType] || "Your unique blend of traits creates a distinctive work approach";
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Work Style Overview */}
                  <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-400 print:p-2 print:border-l-2">
                    <p className="text-sm text-gray-700 leading-relaxed max-w-2xl">
                      {(() => {
                        const disc = profileData.behavioralAssessment.discProfile;
                        if (!disc) return "A collaborative professional who values team harmony and quality outcomes.";
                        
                        const { red, yellow, green, blue } = disc;
                        
                        if (blue >= 50) {
                          return `${profileData.firstName} brings a methodical and analytical approach to work, preferring thorough research and systematic problem-solving. She excels in environments that value accuracy, attention to detail, and quality outcomes. Her systematic thinking style makes her particularly effective at breaking down complex challenges and delivering precise, well-researched results.`;
                        }
                        
                        if (green >= 50) {
                          return `${profileData.firstName} excels in collaborative environments where stability and teamwork are valued. ${yellow >= 10 ? 'As a natural team builder, she brings people together and creates positive working relationships.' : 'Her reliable, steady approach makes her an anchor for team success.'} She thrives in roles that offer clear processes, supportive management, and opportunities to help others succeed.`;
                        }
                        
                        return `${profileData.firstName} brings a balanced approach to work, adapting her style to what the situation requires.`;
                      })()}
                    </p>
                  </div>

                  {/* DISC Percentage Cards */}
                  <div className="grid grid-cols-2 gap-4 print:gap-1">
                    <div className="p-4 rounded-lg border-2 border-red-200 bg-red-50 print:p-1 print:border">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-red-600 mb-1 print:text-lg print:mb-0">
                          {profileData.behavioralAssessment.discProfile?.red || 0}%
                        </div>
                        <div className="text-sm font-medium text-red-700 print:text-xs">Dominance</div>
                        <div className="text-xs text-red-600 print:text-xs">Results-focused</div>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-lg border-2 border-yellow-200 bg-yellow-50 print:p-1 print:border">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-yellow-600 mb-1 print:text-lg print:mb-0">
                          {profileData.behavioralAssessment.discProfile?.yellow || 0}%
                        </div>
                        <div className="text-sm font-medium text-yellow-700 print:text-xs">Influence</div>
                        <div className="text-xs text-yellow-600 print:text-xs">People-focused</div>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-lg border-2 border-green-200 bg-green-50 print:p-1 print:border">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 mb-1 print:text-lg print:mb-0">
                          {profileData.behavioralAssessment.discProfile?.green || 0}%
                        </div>
                        <div className="text-sm font-medium text-green-700 print:text-xs">Steadiness</div>
                        <div className="text-xs text-green-600 print:text-xs">Stability-focused</div>
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-lg border-2 border-blue-200 bg-blue-50 print:p-1 print:border">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-1 print:text-lg print:mb-0">
                          {profileData.behavioralAssessment.discProfile?.blue || 0}%
                        </div>
                        <div className="text-sm font-medium text-blue-700 print:text-xs">Conscientiousness</div>
                        <div className="text-xs text-blue-600 print:text-xs">Quality-focused</div>
                      </div>
                    </div>
                  </div>

                  {/* How I Work - Behavioral Insights */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-6 text-gray-900" style={{ fontSize: '16px', fontWeight: '800', color: '#272727', fontFamily: 'Sora, sans-serif', background: 'none', backgroundColor: 'transparent' }}>How They Work</h3>
                    
                    <div className="space-y-6">
                      {/* Communication & Decision Making */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="pdf-hidden">💬</span>
                            <h4 className="font-semibold text-blue-900">Communication Style</h4>
                          </div>
                          <p className="text-sm text-blue-800 leading-relaxed">
                            <span className="font-medium">{profileData.behavioralAssessment.communicationStyle || "Patient and encouraging"}</span> - {profileData.firstName} prefers clear, respectful communication and takes time to listen carefully to team members before responding.
                          </p>
                        </div>
                        
                        <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="pdf-hidden">⚖️</span>
                            <h4 className="font-semibold text-green-900">Decision-Making Style</h4>
                          </div>
                          <p className="text-sm text-green-800 leading-relaxed">
                            <span className="font-medium">Research-based and systematic</span> - {profileData.firstName} takes time to gather comprehensive information before making decisions, preferring thorough analysis to quick choices.
                          </p>
                        </div>
                      </div>
                      
                      {/* Career Motivators & Compatible Roles */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="pdf-hidden">🚀</span>
                            <h4 className="font-semibold text-purple-900">Career Motivators</h4>
                          </div>
                          <ul className="space-y-1 text-sm text-purple-800">
                            <li className="flex items-start gap-2">
                              <span className="text-purple-400 mt-1">•</span>
                              <span>Values accuracy and quality outcomes</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-purple-400 mt-1">•</span>
                              <span>Enjoys solving complex analytical problems</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-purple-400 mt-1">•</span>
                              <span>Seeks environments that reward thoroughness</span>
                            </li>
                          </ul>
                        </div>
                        
                        <div className="bg-orange-50 border border-orange-100 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="pdf-hidden">💪</span>
                            <h4 className="font-semibold text-orange-900">Work Style Strengths</h4>
                          </div>
                          <ul className="space-y-1 text-sm text-orange-800">
                            <li className="flex items-start gap-2">
                              <span className="text-orange-400 mt-1">•</span>
                              <span>Independent work with clear objectives</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-orange-400 mt-1">•</span>
                              <span>Research and analysis-focused roles</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-orange-400 mt-1">•</span>
                              <span>Quality-driven, systematic organisations</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Behavioural assessment not completed</p>
                  <Link href="/behavioural-assessment">
                    <Button variant="outline" size="sm">Complete Assessment</Button>
                  </Link>
                </div>
              )}

              {/* Work Environment & Role Fit */}
              {behaviouralInsights && (
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Ideal Work Environment</h4>
                    <div className="text-sm text-blue-800 space-y-1">
                      <p>• Structured environments with clear goals and defined processes</p>
                      <p>• Roles requiring precision, planning, and systematic approaches to problem-solving</p>
                      <p>• Quality-focused workplaces with defined standards</p>
                      <p>• Independent work opportunities with minimal interruptions</p>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-900 mb-2">Compatible Role Types</h4>
                    <div className="text-sm text-green-800 space-y-1">
                      <p>• Quality assurance and process improvement</p>
                      <p>• Data analysis and research</p>
                      <p>• Process optimisation and improvement</p>
                      <p>• Supporting team success</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Personal Insights */}
            <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 print:p-1 print:shadow-none print:border-0">
              <h2 className="text-lg font-semibold mb-4 text-gray-900" style={{ fontSize: '16px', fontWeight: '800', color: '#000000', fontFamily: 'Sora, sans-serif', background: 'none', backgroundColor: 'transparent' }}>Personal Insights</h2>
              
              <div className="grid md:grid-cols-2 gap-4 print:grid-cols-2">
                {/* Perfect Job */}
                <div className="border-2 border-yellow-200 bg-white p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                    <span className="pdf-hidden">💼</span>
                    PERFECT JOB IS...
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {profileData?.checkpointData?.['personal-story']?.perfectJob || 
                     profileData?.personalStory?.perfectJob || 
                     "A collaborative role where I can make a meaningful impact"}
                  </p>
                </div>

                {/* Most Happy When */}
                <div className="border-2 border-yellow-200 bg-white p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                    <span className="pdf-hidden">😊</span>
                    MOST HAPPY WHEN...
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {profileData?.checkpointData?.['personal-story']?.happinessSource || 
                     profileData?.personalStory?.happinessSource || 
                     "Working with others to solve challenging problems"}
                  </p>
                </div>

                {/* Described As */}
                <div className="border-2 border-yellow-200 bg-white p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                    <span className="pdf-hidden">👥</span>
                    DESCRIBED AS...
                  </h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>
                      <span className="font-medium">By friends:</span> {profileData?.checkpointData?.['personal-story']?.friendDescriptions || 
                       profileData?.personalStory?.friendDescriptions || 
                       "Reliable, creative, and supportive"}
                    </p>
                    <p>
                      <span className="font-medium">By teachers:</span> {profileData?.checkpointData?.['personal-story']?.teacherDescriptions || 
                       profileData?.personalStory?.teacherDescriptions || 
                       "Thoughtful, engaged, and collaborative"}
                    </p>
                  </div>
                </div>

                {/* Most Proud Of */}
                <div className="border-2 border-yellow-200 bg-white p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
                    <span className="pdf-hidden">🏆</span>
                    MOST PROUD OF...
                  </h4>
                  <p className="text-sm text-gray-700">
                    {profileData?.checkpointData?.['personal-story']?.proudMoment || 
                     profileData?.personalStory?.proudMoment || 
                     "Leading a successful team project from start to finish"}
                  </p>
                </div>

                {/* Interested in roles in - Q3 from "What lights you up" questionnaire */}
                <div className="border-2 border-yellow-200 bg-white p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <span className="pdf-hidden">🎯</span>
                    INTERESTED IN ROLES IN...
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {profileData?.checkpointData?.['interests-preferences']?.roleTypes?.slice(0, 6).map((role: string, idx: number) => (
                      <span key={idx} className="px-2 py-1 bg-yellow-100 text-gray-800 rounded-full text-xs font-medium">
                        {role}
                      </span>
                    )) || (
                      <>
                        <span className="px-2 py-1 bg-yellow-100 text-gray-800 rounded-full text-xs font-medium">Administration & Office Support</span>
                        <span className="px-2 py-1 bg-yellow-100 text-gray-800 rounded-full text-xs font-medium">Sales & Business Development</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Industry interests - Q4 from "What lights you up" questionnaire */}
                <div className="border-2 border-yellow-200 bg-white p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <span className="pdf-hidden">🏢</span>
                    INDUSTRY INTERESTS...
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {profileData?.checkpointData?.['interests-preferences']?.industries?.slice(0, 6).map((industry: string, idx: number) => (
                      <span key={idx} className="px-2 py-1 bg-yellow-100 text-gray-800 rounded-full text-xs font-medium">
                        {industry}
                      </span>
                    )) || (
                      <>
                        <span className="px-2 py-1 bg-yellow-100 text-gray-800 rounded-full text-xs font-medium">Finance & Banking</span>
                        <span className="px-2 py-1 bg-yellow-100 text-gray-800 rounded-full text-xs font-medium">Technology & Software</span>
                      </>
                    )}
                  </div>
                </div>


              </div>
            </div>


          </div>

          {/* Right Column - Additional Information (35% width) */}
          <div className="lg:col-span-1 space-y-4 section profile-section">
            {/* Key Strengths */}
            <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 profile-card info-block">
              <h2 className="text-lg font-semibold mb-4 print:mb-2 print:text-base text-gray-900">Key Strengths</h2>
              <div className="space-y-3 print:space-y-2">
                {/* Generate strengths dynamically based on DISC profile with employer-appropriate pronouns */}
                {(() => {
                  const disc = profileData?.behavioralAssessment?.discProfile;
                  if (!disc) return null;
                  
                  const { red, yellow, green, blue } = disc;
                  const strengths = [];
                  const pronoun = profileData?.pronouns?.includes('she') ? 'She' : profileData?.pronouns?.includes('he') ? 'He' : 'They';
                  const pronounLower = pronoun.toLowerCase();
                  const possessive = pronoun === 'She' ? 'her' : pronoun === 'He' ? 'his' : 'their';
                  
                  // High Influence (Yellow) - People Champion characteristics
                  if (yellow >= 50) {
                    strengths.push({
                      title: "Enthusiastic Communicator",
                      description: `${pronoun} naturally energizes others and excels in collaborative environments. ${possessive.charAt(0).toUpperCase() + possessive.slice(1)} communication skills make ${pronounLower} great at building relationships and motivating teams.`,
                      colour: "border-yellow-500"
                    });
                    
                    if (red >= 20) {
                      strengths.push({
                        title: "Inspiring Team Leader", 
                        description: `${pronoun} combines people skills with drive for results. ${pronoun} excels at rallying teams around shared goals and creating positive momentum in group projects.`,
                        colour: "border-orange-500"
                      });
                    } else {
                      strengths.push({
                        title: "Collaborative Connector",
                        description: `${pronoun} has a gift for bringing people together and facilitating teamwork. ${pronoun} excels at creating inclusive environments where everyone feels valued and heard.`,
                        colour: "border-green-500"
                      });
                    }
                    
                    strengths.push({
                      title: "Creative Problem Solver",
                      description: `${pronoun} approaches challenges with creativity and optimism, often finding innovative solutions by involving others and thinking outside the box.`,
                      colour: "border-purple-500"
                    });
                  }
                  // High Dominance (Red) - Results-focused characteristics  
                  else if (red >= 50) {
                    strengths.push({
                      title: "Results-Driven Leader",
                      description: `${pronoun} has a natural ability to take charge of situations and drive towards concrete outcomes. ${pronoun} excels at making quick decisions and pushing projects forward efficiently.`,
                      colour: "border-red-500"
                    });
                    
                    if (blue >= 30) {
                      strengths.push({
                        title: "Strategic Problem Solver",
                        description: `${pronoun} combines decisive action with analytical thinking. ${pronoun} excels at breaking down complex challenges and implementing systematic solutions.`,
                        colour: "border-blue-500"
                      });
                    } else {
                      strengths.push({
                        title: "Dynamic Change Agent",
                        description: `${pronoun} thrives in fast-paced environments and excels at driving change. ${possessive.charAt(0).toUpperCase() + possessive.slice(1)} direct approach helps organisations move quickly towards their goals.`,
                        colour: "border-orange-500"
                      });
                    }
                    
                    strengths.push({
                      title: "Goal-Oriented Achiever",
                      description: `${pronoun} sets ambitious targets and consistently works to exceed them. ${possessive.charAt(0).toUpperCase() + possessive.slice(1)} competitive nature and focus on outcomes drives exceptional performance.`,
                      colour: "border-green-500"
                    });
                  }
                  // High Conscientiousness (Blue) - Quality-focused characteristics
                  else if (blue >= 50) {
                    strengths.push({
                      title: "Quality & Precision Focus",
                      description: `${pronoun} combines attention to detail with high standards. This makes ${pronounLower} excellent at delivering accurate, well-researched work that meets exact specifications.`,
                      colour: "border-blue-500"
                    });
                    
                    strengths.push({
                      title: "Independent Problem Solver", 
                      description: `${pronoun} works well autonomously and can systematically break down complex challenges. ${possessive.charAt(0).toUpperCase() + possessive.slice(1)} analytical approach helps ${pronounLower} find efficient solutions to difficult problems.`,
                      colour: "border-purple-500"
                    });
                    
                    strengths.push({
                      title: "Systematic Organiser",
                      description: `${pronoun} excels at creating structure and processes that improve efficiency. ${possessive.charAt(0).toUpperCase() + possessive.slice(1)} methodical approach ensures nothing falls through the cracks.`,
                      colour: "border-indigo-500"
                    });
                  }
                  // High Steadiness (Green) - Stability-focused characteristics
                  else if (green >= 50) {
                    strengths.push({
                      title: "Reliable Team Player",
                      description: `${pronoun} provides stability and consistency that teams can count on. ${possessive.charAt(0).toUpperCase() + possessive.slice(1)} supportive nature helps create positive, collaborative work environments.`,
                      colour: "border-green-500"
                    });
                    
                    strengths.push({
                      title: "Patient Problem Solver",
                      description: `${pronoun} approaches challenges with patience and persistence. ${possessive.charAt(0).toUpperCase() + possessive.slice(1)} thoughtful, step-by-step approach ensures thorough and sustainable solutions.`,
                      colour: "border-teal-500"
                    });
                    
                    strengths.push({
                      title: "Diplomatic Communicator", 
                      description: `${pronoun} excels at facilitating discussions and finding common ground. ${possessive.charAt(0).toUpperCase() + possessive.slice(1)} listening skills and empathy make ${pronounLower} great at resolving conflicts and building consensus.`,
                      colour: "border-blue-500"
                    });
                  }
                  // Balanced or mixed profiles
                  else {
                    // Blue-Red combination (Blue dominant with Red secondary)
                    if (blue >= 40 && red >= 30 && blue > red) {
                      strengths.push({
                        title: "Quality & Precision Focus",
                        description: `${pronoun} combines attention to detail with high standards. This makes ${pronounLower} excellent at delivering accurate, well-researched work that meets exact specifications.`,
                        colour: "border-blue-500"
                      });
                      
                      strengths.push({
                        title: "Systematic Problem Solver",
                        description: `${pronoun} approaches challenges with methodical analysis while maintaining focus on practical outcomes. ${possessive.charAt(0).toUpperCase() + possessive.slice(1)} structured thinking ensures thorough solutions.`,
                        colour: "border-pink-500"
                      });
                      
                      strengths.push({
                        title: "Independent Achiever",
                        description: `${pronoun} works well autonomously and can systematically break down complex challenges. ${possessive.charAt(0).toUpperCase() + possessive.slice(1)} analytical approach helps ${pronounLower} find efficient solutions.`,
                        colour: "border-indigo-500"
                      });
                    }
                    // Red-Blue combination (Red dominant with Blue secondary)
                    else if (red >= 35 && blue >= 30) {
                      strengths.push({
                        title: "Results-Driven Leader",
                        description: `${pronoun} has a natural ability to take charge of situations and drive towards concrete outcomes. ${pronoun} excels at making quick decisions and pushing projects forward efficiently.`,
                        colour: "border-red-500"
                      });
                      
                      strengths.push({
                        title: "Quality & Precision Focus",
                        description: `${pronoun} combines ${possessive} drive for results with careful attention to detail and high standards. This makes ${pronounLower} excellent at delivering quality work under pressure.`,
                        colour: "border-blue-500"
                      });
                      
                      strengths.push({
                        title: "Strategic Problem Solver",
                        description: `${pronoun} combines decisive action with analytical thinking. ${pronoun} excels at breaking down complex challenges and implementing systematic solutions.`,
                        colour: "border-purple-500"
                      });
                    }
                    else {
                      strengths.push({
                        title: "Adaptable Collaborator",
                        description: `${pronoun} brings a balanced approach to work, adapting ${possessive} style to what the situation requires. ${possessive.charAt(0).toUpperCase() + possessive.slice(1)} flexibility makes ${pronounLower} valuable in diverse team settings.`,
                        colour: "border-green-500"
                      });
                      
                      strengths.push({
                        title: "Thoughtful Contributor",
                        description: `${pronoun} considers multiple perspectives before acting. ${possessive.charAt(0).toUpperCase() + possessive.slice(1)} balanced approach helps teams make well-rounded decisions and avoid blind spots.`,
                        colour: "border-blue-500"
                      });
                      
                      strengths.push({
                        title: "Versatile Problem Solver",
                        description: `${pronoun} can approach challenges from multiple angles, drawing on different strengths as needed. ${possessive.charAt(0).toUpperCase() + possessive.slice(1)} adaptability helps ${pronounLower} succeed in various situations.`,
                        colour: "border-purple-500"
                      });
                    }
                  }
                  
                  return strengths.slice(0, 3).map((strength, index) => (
                    <div key={index} className={`bg-gray-50 p-3 rounded-lg border-l-4 ${strength.colour}`}>
                      <h4 className="font-medium text-gray-900 mb-1">{strength.title}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{strength.description}</p>
                    </div>
                  ));
                })()}
              </div>
            </div>

            {/* Community & Proactivity */}
            <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 profile-card info-block">
              <h2 className="text-lg font-semibold mb-4 print:mb-2 print:text-base text-gray-900">Community & Engagement</h2>
              <div className="space-y-3 print:space-y-2">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-900" style={{fontFamily: 'Sora'}}>Proactivity Score</span>
                    <span className="font-semibold text-gray-900">{profileData.proactivityScore?.toFixed(1) || '8.2'}/10</span>
                  </div>
                  <p className="text-xs text-gray-500">Based on community engagement and learning activities</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Joined Pollen</span>
                  <span className="font-semibold text-gray-900">{new Date(profileData.createdAt || '2024-03-15').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </div>

            {/* Community Achievements - Matching PDF Layout */}
            <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 profile-card info-block">
              <h2 className="text-lg font-semibold mb-2 print:mb-1 print:text-base text-gray-900">Community Achievements</h2>
              <p className="text-sm text-gray-600 mb-4 print:mb-2 print:text-xs">Badges awarded based on candidate's participation in the Pollen community — including learning engagement and peer support.</p>
              
              <div className="grid grid-cols-2 gap-2 print:gap-1 mb-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 text-center">
                  <span className="pdf-hidden text-lg">🎓</span>
                  <div className="text-xs font-medium text-blue-900">Workshop</div>
                  <div className="text-xs font-medium text-blue-900">Enthusiast</div>
                  <div className="text-xs text-blue-700 mt-1 print:mt-0">Attended 4+ workshops</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
                  <span className="pdf-hidden text-lg">🤝</span>
                  <div className="text-xs font-medium text-green-900">Community</div>
                  <div className="text-xs font-medium text-green-900">Helper</div>
                  <div className="text-xs text-green-700 mt-1 print:mt-0">Helped 8+ members</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 text-center">
                  <span className="pdf-hidden text-lg">🔥</span>
                  <div className="text-xs font-medium text-yellow-900">Active</div>
                  <div className="text-xs font-medium text-yellow-900">Streak</div>
                  <div className="text-xs text-yellow-700 mt-1 print:mt-0">12+ week streak</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-2 text-center">
                  <span className="pdf-hidden text-lg">⭐</span>
                  <div className="text-xs font-medium text-purple-900">Rising</div>
                  <div className="text-xs font-medium text-purple-900">Star</div>
                  <div className="text-xs text-purple-700 mt-1 print:mt-0">500+ community points</div>
                </div>
              </div>
            </div>





            {/* References */}
            <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 profile-card info-block">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">References</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-gray-300 pl-4">
                  <h4 className="font-medium text-gray-900">Dr. Sarah Mitchell</h4>
                  <p className="text-sm text-gray-600">Senior Lecturer, University of Bath</p>
                  <p className="text-sm text-gray-600">s.mitchell@bath.ac.uk</p>
                  <p className="text-xs text-gray-500 mt-1">"Zara consistently demonstrated exceptional analytical skills and leadership qualities during her academic studies."</p>
                </div>
                <div className="border-l-4 border-gray-300 pl-4">
                  <h4 className="font-medium text-gray-900">James Thompson</h4>
                  <p className="text-sm text-gray-600">Team Lead, Local Community Project</p>
                  <p className="text-sm text-gray-600">james.thompson@communityproject.org</p>
                  <p className="text-xs text-gray-500 mt-1">"Outstanding team player who brings both creativity and systematic thinking to every project."</p>
                </div>
              </div>
            </div>


          </div>

        </div>
      </div>
    </div>
  );
}