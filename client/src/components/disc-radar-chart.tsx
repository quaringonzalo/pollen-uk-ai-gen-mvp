import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { HelpCircle } from "lucide-react";

interface DiscRadarChartProps {
  data: {
    red: number;
    yellow: number;
    green: number;
    blue: number;
  };
  title?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function DiscRadarChart({ data, title = "DISC Profile", size = 'md' }: DiscRadarChartProps) {
  const dimensions = [
    { 
      key: 'red' as const, 
      label: 'Dominance', 
      colour: '#ff4d4f', 
      shortDesc: 'Results-focused',
      tooltip: 'Direct, decisive, and results-oriented. Thrives on challenges and taking charge. Values efficiency and getting things done quickly.',
      extendedContent: {
        traits: ['Direct', 'Results-oriented', 'Decisive', 'Competitive', 'Independent'],
        strengths: ['Natural leader', 'Makes quick decisions', 'Drives results', 'Handles pressure well', 'Takes initiative'],
        workStyle: 'Prefers autonomy, challenging projects, and clear goals. Works best with minimal supervision and direct communication.',
        motivation: 'Achievement, control, and overcoming challenges. Motivated by winning and getting results.',
        communication: 'Direct and to-the-point. Appreciates brevity and efficiency in communication.',
        idealEnvironment: 'Fast-paced, goal-oriented environments with opportunities for leadership and achievement.'
      }
    },
    { 
      key: 'yellow' as const, 
      label: 'Influence', 
      colour: '#ffec3d', 
      shortDesc: 'People-focused',
      tooltip: 'Enthusiastic, optimistic, and people-oriented. Excels at communication and inspiring others. Values collaboration and positive relationships.',
      extendedContent: {
        traits: ['Enthusiastic', 'Optimistic', 'Persuasive', 'Talkative', 'People-oriented'],
        strengths: ['Excellent communicator', 'Builds relationships easily', 'Inspires others', 'Creative thinker', 'Adapts well to change'],
        workStyle: 'Thrives in collaborative environments with variety and social interaction. Enjoys brainstorming and team projects.',
        motivation: 'Recognition, social approval, and exciting challenges. Motivated by interaction and appreciation.',
        communication: 'Warm, expressive, and engaging. Enjoys verbal communication and storytelling.',
        idealEnvironment: 'Dynamic, people-centreed environments with opportunities for creativity and recognition.'
      }
    },
    { 
      key: 'green' as const, 
      label: 'Steadiness', 
      colour: '#52c41a', 
      shortDesc: 'Stability-focused',
      tooltip: 'Patient, reliable, and supportive. Prefers stable environments and team harmony. Values consistency and helping others succeed.',
      extendedContent: {
        traits: ['Patient', 'Reliable', 'Supportive', 'Loyal', 'Cooperative'],
        strengths: ['Excellent team player', 'Consistent performer', 'Good listener', 'Calming influence', 'Dependable'],
        workStyle: 'Values stability, routine, and clear expectations. Works methodically and prefers gradual change.',
        motivation: 'Security, harmony, and helping others. Motivated by appreciation and job security.',
        communication: 'Thoughtful and considerate. Prefers one-on-one conversations and listening.',
        idealEnvironment: 'Stable, harmonious environments with clear procedures and supportive colleagues.'
      }
    },
    { 
      key: 'blue' as const, 
      label: 'Conscientiousness', 
      colour: '#1890ff', 
      shortDesc: 'Quality-focused',
      tooltip: 'Analytical, precise, and quality-focused. Values accuracy and systematic approaches. Excels at detailed work and following procedures.',
      extendedContent: {
        traits: ['Analytical', 'Precise', 'Systematic', 'Quality-focused', 'Cautious'],
        strengths: ['Attention to detail', 'High-quality work', 'Logical thinking', 'Problem-solving', 'Planning abilities'],
        workStyle: 'Methodical approach with focus on accuracy and standards. Prefers time to analyse and plan.',
        motivation: 'Quality, accuracy, and expertise. Motivated by opportunities to learn and perfect skills.',
        communication: 'Factual and precise. Appreciates detailed information and logical explanations.',
        idealEnvironment: 'Structured environments with clear standards, minimal interruptions, and quality focus.'
      }
    }
  ];

  const chartSize = size === 'sm' ? 300 : size === 'lg' ? 400 : 350;
  const centre = chartSize / 2;
  const maxRadius = centre - 30;

  // Create grid circles
  const gridCircles = [
    { radius: maxRadius * 0.2, label: '20%' },
    { radius: maxRadius * 0.4, label: '40%' },
    { radius: maxRadius * 0.6, label: '60%' },
    { radius: maxRadius * 0.8, label: '80%' },
    { radius: maxRadius, label: '100%' }
  ];

  // Calculate data points
  const points = dimensions.map((dimension, index) => {
    const angle = (index * 90 - 90) * (Math.PI / 180); // Start from top, go clockwise
    const value = data[dimension.key];
    const radius = (value / 100) * maxRadius;
    const x = centre + radius * Math.cos(angle);
    const y = centre + radius * Math.sin(angle);
    return { x, y, value, ...dimension };
  });

  // Create path data for the filled area
  const pathData = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')} Z`;

  // Create axis lines
  const axisLines = dimensions.map((dimension, index) => {
    const angle = (index * 90 - 90) * (Math.PI / 180);
    const endX = centre + maxRadius * Math.cos(angle);
    const endY = centre + maxRadius * Math.sin(angle);
    return { startX: centre, startY: centre, endX, endY, ...dimension };
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-center">{title}</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2 h-8 w-8">
                <HelpCircle className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Understanding Your DISC Profile</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <p className="text-gray-600">
                  The DISC assessment measures four key behavioural dimensions that influence how you work and interact with others. 
                  Understanding your profile helps you leverage your strengths and work more effectively with different personality types.
                </p>
                
                <div className="grid gap-6">
                  {dimensions.map((dimension) => (
                    <div key={dimension.key} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center gap-3 mb-3">
                        <div 
                          className="w-6 h-6 rounded-full flex-shrink-0" 
                          style={{ backgroundColor: dimension.colour }}
                        />
                        <h3 className="text-xl font-bold text-gray-900">
                          {dimension.label} ({data[dimension.key]}%)
                        </h3>
                      </div>
                      
                      <p className="text-gray-700 mb-4">{dimension.tooltip}</p>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Key Traits</h4>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {dimension.extendedContent.traits.map((trait, index) => (
                              <span key={index} className="px-2 py-1 bg-white text-xs rounded border text-gray-700">
                                {trait}
                              </span>
                            ))}
                          </div>
                          
                          <h4 className="font-semibold text-gray-900 mb-2">Strengths</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            {dimension.extendedContent.strengths.map((strength, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">Work Style</h4>
                            <p className="text-sm text-gray-700">{dimension.extendedContent.workStyle}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">Motivation</h4>
                            <p className="text-sm text-gray-700">{dimension.extendedContent.motivation}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">Communication Style</h4>
                            <p className="text-sm text-gray-700">{dimension.extendedContent.communication}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-1">Ideal Environment</h4>
                            <p className="text-sm text-gray-700">{dimension.extendedContent.idealEnvironment}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">Career Development Tips</h3>
                  <p className="text-sm text-blue-800">
                    Your DISC profile is used to match you with roles and companies where you'll naturally thrive. 
                    Use this information to identify your ideal work environment, understand your communication preferences, 
                    and highlight your strengths during interviews. Remember, all profiles are valuable - 
                    diversity in thinking styles makes teams stronger.
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <svg width={chartSize} height={chartSize} className="mb-4">
            {/* Grid circles */}
            {gridCircles.map((circle, index) => (
              <circle
                key={index}
                cx={centre}
                cy={centre}
                r={circle.radius}
                fill="none"
                stroke="#e5e5e5"
                strokeWidth="1"
                strokeDasharray={index === gridCircles.length - 1 ? "none" : "2,2"}
              />
            ))}
            
            {/* Axis lines */}
            {axisLines.map((line, index) => (
              <line
                key={index}
                x1={line.startX}
                y1={line.startY}
                x2={line.endX}
                y2={line.endY}
                stroke="#d1d5db"
                strokeWidth="1"
              />
            ))}
            
            {/* Data area */}
            <path
              d={pathData}
              fill={`rgba(59, 130, 246, 0.2)`}
              stroke="#3b82f6"
              strokeWidth="2"
            />
            
            {/* Data points */}
            {points.map((point, index) => (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r="6"
                fill={point.colour}
                stroke="white"
                strokeWidth="2"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
              />
            ))}
            
            {/* Labels */}
            {dimensions.map((dimension, index) => {
              const angle = (index * 90 - 90) * (Math.PI / 180);
              const labelRadius = maxRadius + 25;
              const labelX = centre + labelRadius * Math.cos(angle);
              const labelY = centre + labelRadius * Math.sin(angle);
              
              return (
                <text
                  key={index}
                  x={labelX}
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-sm font-medium fill-gray-700"
                >
                  {dimension.label}
                </text>
              );
            })}
          </svg>
          
          {/* Legend */}
          <div className="grid grid-cols-2 gap-3 mt-4 w-full max-w-md">
            {dimensions.map((dimension, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: dimension.colour }}
                />
                <span className="text-gray-700 text-sm">
                  {dimension.label}: {data[dimension.key]}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}