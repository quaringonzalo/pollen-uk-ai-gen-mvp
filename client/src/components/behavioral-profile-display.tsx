import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Users, Target, Star } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { 
  getJobSeekerBehavioralProfile, 
  getEmployerBehavioralProfile, 
  formatDiscProfile, 
  type KeyStrength 
} from '@/services/behavioral-profile-service';

interface BehavioralProfileDisplayProps {
  personalityType: string;
  discPercentages: any;
  viewType: 'jobSeeker' | 'employer';
  showFullProfile?: boolean;
  className?: string;
}

export function BehavioralProfileDisplay({
  personalityType,
  discPercentages,
  viewType,
  showFullProfile = true,
  className = ""
}: BehavioralProfileDisplayProps) {
  const profileData = viewType === 'jobSeeker' 
    ? getJobSeekerBehavioralProfile(personalityType)
    : getEmployerBehavioralProfile(personalityType);
  
  const discFormatted = formatDiscProfile(discPercentages);

  if (!profileData) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">🧠</span>
            <h3 className="text-lg font-semibold text-gray-700">{personalityType}</h3>
          </div>
          <p className="text-gray-500">Behavioral profile data is being loaded...</p>
        </CardContent>
      </Card>
    );
  }

  const keyStrengths = viewType === 'jobSeeker' 
    ? profileData.jobSeekerKeyStrengths 
    : profileData.employerKeyStrengths;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Personality Type Header */}
      <Card className="bg-gradient-to-r from-pink-50 to-yellow-50 border-pink-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{profileData.emoji}</span>
            <h2 className="text-2xl font-bold text-gray-900 font-sora">{personalityType}</h2>
          </div>
          <p className="text-gray-700 italic mb-4">{profileData.briefDiscSummary}</p>
          {profileData.behavioralBlurb && (
            <p className="text-gray-600 leading-relaxed">
              {viewType === 'jobSeeker' 
                ? profileData.behavioralBlurb.jobSeeker 
                : profileData.behavioralBlurb.employer}
            </p>
          )}
        </CardContent>
      </Card>

      {showFullProfile && (
        <>
          {/* Behavioural Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-pink-600">
                <Brain className="w-5 h-5" />
                Behavioural Breakdown
              </CardTitle>
              <p className="text-sm text-gray-500">
                {viewType === 'jobSeeker' ? 'Your' : 'Their'} behavioural dimensions and work style preferences
              </p>
            </CardHeader>
            <CardContent>
              <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm font-medium text-green-800">✅ Reliable Results</p>
                <p className="text-sm text-green-600">This data provides a reliable analysis of your natural behavioural preferences and work style. It's not about strengths or weaknesses, but simply how you naturally approach tasks and interact with others.</p>
              </div>
              
              {/* Pie Chart */}
              <div className="h-80 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={discFormatted.percentageDisplay.map(disc => ({
                        name: disc.label,
                        value: disc.percentage,
                        color: getDiscHexColor(disc.color)
                      }))}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {discFormatted.percentageDisplay.map((disc, index) => (
                        <Cell key={`cell-${index}`} fill={getDiscHexColor(disc.color)} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => [`${value}%`, name]}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      formatter={(value, entry) => (
                        <span style={{ color: entry.color, fontWeight: '500' }}>
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Summary Grid Below Chart */}
              <div className="grid grid-cols-2 gap-3">
                {discFormatted.percentageDisplay.map((disc) => (
                  <div 
                    key={disc.label}
                    className={`p-3 rounded-lg border-2 ${getDiscColorClasses(disc.color)}`}
                  >
                    <div className="text-center">
                      <div className={`text-lg font-bold ${getDiscTextColor(disc.color)}`}>
                        {disc.percentage}%
                      </div>
                      <div className="text-sm font-medium">{disc.label}</div>
                      <div className="text-sm text-gray-600">{disc.focus}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <p className="text-center font-medium text-pink-600">{discFormatted.summaryText}</p>
            </CardContent>
          </Card>

          {/* Career Motivators */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-sora">Career Motivators</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {profileData.careerMotivators.map((motivator, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">{motivator}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* How They Work */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-sora">
                How {viewType === 'jobSeeker' ? 'You' : 'They'} Work
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <h4 className="font-medium text-blue-800">Communication Style</h4>
                  </div>
                  <p className="text-sm text-blue-700">
                    {typeof profileData.communicationStyle === 'string' 
                      ? profileData.communicationStyle 
                      : profileData.communicationStyle.summary}
                  </p>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-yellow-600" />
                    <h4 className="font-medium text-yellow-800">Decision-Making Style</h4>
                  </div>
                  <p className="text-sm text-yellow-700">
                    {typeof profileData.decisionMakingStyle === 'string' 
                      ? profileData.decisionMakingStyle 
                      : profileData.decisionMakingStyle.summary}
                  </p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-pink-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-pink-600" />
                    <h4 className="font-medium text-pink-800">Work Style Strengths</h4>
                  </div>
                  <ul className="text-sm text-pink-700 space-y-1">
                    {profileData.workStyleStrengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="w-1 h-1 bg-pink-400 rounded-full mt-2 flex-shrink-0" />
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Only show Ideal Work Environment for job seekers */}
                {viewType === 'jobSeeker' && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-4 h-4 text-green-600" />
                      <h4 className="font-medium text-green-800">Ideal Work Environment</h4>
                    </div>
                    <p className="text-sm text-green-700">
                      {typeof profileData.idealWorkEnvironment === 'string' 
                        ? profileData.idealWorkEnvironment 
                        : profileData.idealWorkEnvironment.map(env => env.description).join('. ')}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Key Strengths */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-sora">Key Strengths</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {keyStrengths.map((strength, index) => (
                <div key={index} className="border-l-4 border-pink-300 pl-4 py-2">
                  <h4 className="font-semibold text-gray-900 mb-2">{strength.title}</h4>
                  <p className="text-gray-700 leading-relaxed">{strength.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

// Helper functions for DISC color styling
function getDiscColorClasses(color: string): string {
  switch (color) {
    case 'red':
      return 'bg-red-50 border-red-200';
    case 'yellow':
      return 'bg-yellow-50 border-yellow-200';
    case 'green':
      return 'bg-green-50 border-green-200';
    case 'blue':
      return 'bg-blue-50 border-blue-200';
    default:
      return 'bg-gray-50 border-gray-200';
  }
}

function getDiscTextColor(color: string): string {
  switch (color) {
    case 'red':
      return 'text-red-600';
    case 'yellow':
      return 'text-yellow-600';
    case 'green':
      return 'text-green-600';
    case 'blue':
      return 'text-blue-600';
    default:
      return 'text-gray-600';
  }
}

function getDiscHexColor(color: string): string {
  switch (color) {
    case 'red':
      return '#dc2626'; // red-600
    case 'yellow':
      return '#eab308'; // yellow-500
    case 'green':
      return '#16a34a'; // green-600
    case 'blue':
      return '#2563eb'; // blue-600
    default:
      return '#6b7280'; // gray-500
  }
}