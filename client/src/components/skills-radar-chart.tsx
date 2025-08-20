import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SkillsRadarChartProps {
  data: {
    communication: number;
    problemSolving: number;
    teamwork: number;
    leadership: number;
    technical: number;
    adaptability: number;
  };
  title?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function SkillsRadarChart({ data, title = "Skills Profile", size = 'md' }: SkillsRadarChartProps) {
  const skills = [
    { key: 'communication', label: 'Communication', colour: '#10b981' },
    { key: 'problemSolving', label: 'Problem Solving', colour: '#3b82f6' },
    { key: 'teamwork', label: 'Teamwork', colour: '#ec4899' },
    { key: 'leadership', label: 'Leadership', colour: '#ec4899' },
    { key: 'technical', label: 'Technical', colour: '#f59e0b' },
    { key: 'adaptability', label: 'Adaptability', colour: '#ef4444' }
  ];

  const chartSize = size === 'sm' ? 200 : size === 'lg' ? 300 : 250;
  const centre = chartSize / 2;
  const maxRadius = centre - 40;

  // Generate radar chart points
  const generatePoints = () => {
    const points = skills.map((skill, index) => {
      const angle = (index * 60 - 90) * (Math.PI / 180); // Start from top, 60 degrees apart
      const value = data[skill.key] || 0;
      const radius = (value / 100) * maxRadius;
      const x = centre + radius * Math.cos(angle);
      const y = centre + radius * Math.sin(angle);
      return { x, y, value, ...skill };
    });
    return points;
  };

  // Generate axis lines
  const generateAxes = () => {
    return skills.map((skill, index) => {
      const angle = (index * 60 - 90) * (Math.PI / 180);
      const endX = centre + maxRadius * Math.cos(angle);
      const endY = centre + maxRadius * Math.sin(angle);
      
      // Label position (slightly outside the circle)
      const labelX = centre + (maxRadius + 25) * Math.cos(angle);
      const labelY = centre + (maxRadius + 25) * Math.sin(angle);
      
      return {
        line: `M${centre},${centre} L${endX},${endY}`,
        labelX,
        labelY,
        label: skill.label,
        colour: skill.colour
      };
    });
  };

  // Generate concentric circles for scale
  const generateScaleCircles = () => {
    return [0.2, 0.4, 0.6, 0.8, 1.0].map(scale => ({
      radius: maxRadius * scale,
      value: scale * 100
    }));
  };

  const points = generatePoints();
  const axes = generateAxes();
  const scaleCircles = generateScaleCircles();

  // Create polygon path
  const polygonPath = points.map((point, index) => 
    index === 0 ? `M${point.x},${point.y}` : `L${point.x},${point.y}`
  ).join(' ') + ' Z';

  // Calculate overall score
  const overallScore = Math.round(Object.values(data).reduce((a, b) => a + b, 0) / Object.values(data).length);

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-center text-lg">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative">
          <svg width={chartSize} height={chartSize} className="overflow-visible">
            {/* Background circles */}
            {scaleCircles.map((circle, index) => (
              <circle
                key={index}
                cx={centre}
                cy={centre}
                r={circle.radius}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="1"
                opacity={0.5}
              />
            ))}

            {/* Axis lines */}
            {axes.map((axis, index) => (
              <g key={index}>
                <path
                  d={axis.line}
                  stroke="#d1d5db"
                  strokeWidth="1"
                  opacity={0.7}
                />
              </g>
            ))}

            {/* Data polygon */}
            <path
              d={polygonPath}
              fill="rgba(236, 72, 153, 0.1)"
              stroke="#ec4899"
              strokeWidth="2"
              fillOpacity={0.3}
            />

            {/* Data points */}
            {points.map((point, index) => (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r="4"
                fill={point.colour}
                stroke="white"
                strokeWidth="2"
              />
            ))}

            {/* Labels */}
            {axes.map((axis, index) => {
              const point = points[index];
              return (
                <g key={index}>
                  <text
                    x={axis.labelX}
                    y={axis.labelY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-sm font-medium fill-gray-700"
                  >
                    {axis.label}
                  </text>
                  <text
                    x={axis.labelX}
                    y={axis.labelY + 15}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xs fill-gray-500"
                  >
                    {point.value}%
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Skills breakdown */}
        <div className="w-full mt-4 space-y-2">
          {skills.map((skill) => (
            <div key={skill.key} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: skill.colour }}
                />
                <span className="text-sm text-gray-700">{skill.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full" 
                    style={{ 
                      width: `${data[skill.key]}%`,
                      backgroundColor: skill.colour 
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-8 text-right">
                  {data[skill.key]}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default SkillsRadarChart;