import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BehaviouralRadarChartProps {
  data: {
    red: number;
    yellow: number;
    green: number;
    blue: number;
  };
  title?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function BehaviouralRadarChart({ data, title = "Behavioural Profile", size = 'md' }: BehaviouralRadarChartProps) {
  const dimensions = [
    { key: 'red', label: 'Dominance', colour: '#ef4444' },
    { key: 'yellow', label: 'Influence', colour: '#f59e0b' },
    { key: 'green', label: 'Steadiness', colour: '#10b981' },
    { key: 'blue', label: 'Conscientiousness', colour: '#3b82f6' }
  ];

  const chartSize = size === 'sm' ? 250 : size === 'lg' ? 400 : 320;
  const centre = chartSize / 2;
  const maxRadius = centre - 40;

  // Generate radar chart points
  const generatePoints = () => {
    const points = dimensions.map((dimension, index) => {
      const angle = (index * 90 - 90) * (Math.PI / 180); // Start from top, 90 degrees apart
      const value = data[dimension.key] || 0;
      const radius = (value / 100) * maxRadius;
      const x = centre + radius * Math.cos(angle);
      const y = centre + radius * Math.sin(angle);
      return { x, y, value, ...dimension };
    });
    return points;
  };

  // Generate axis lines
  const generateAxes = () => {
    return dimensions.map((dimension, index) => {
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
        label: dimension.label,
        colour: dimension.colour
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

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-center text-lg">{title}</CardTitle>
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
              fill="rgba(59, 130, 246, 0.1)"
              stroke="#3b82f6"
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

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
          {dimensions.map((dimension) => (
            <div key={dimension.key} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: dimension.colour }}
              />
              <span className="text-gray-700">
                {dimension.label}: {data[dimension.key]}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default BehaviouralRadarChart;