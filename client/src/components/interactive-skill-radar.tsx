import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Radar, 
  Star, 
  TrendingUp, 
  Zap, 
  Target,
  Award,
  Brain,
  Users,
  Code,
  Palette,
  Calculator,
  MessageCircle
} from "lucide-react";

interface SkillCategory {
  id: string;
  name: string;
  icon: any;
  colour: string;
  description: string;
  skills: Skill[];
}

interface Skill {
  id: string;
  name: string;
  level: number; // 0-100
  verified: boolean;
  assessments: number;
  trending: boolean;
  category: string;
}

interface RadarDataPoint {
  category: string;
  score: number;
  maxScore: number;
  colour: string;
  skills: number;
}

const skillCategories: SkillCategory[] = [
  {
    id: "technical",
    name: "Technical Skills",
    icon: Code,
    colour: "#3B82F6",
    description: "Programming, software tools, and technical competencies",
    skills: [
      { id: "javascript", name: "JavaScript", level: 85, verified: true, assessments: 3, trending: true, category: "technical" },
      { id: "react", name: "React", level: 78, verified: true, assessments: 2, trending: false, category: "technical" },
      { id: "python", name: "Python", level: 65, verified: false, assessments: 1, trending: true, category: "technical" },
      { id: "sql", name: "SQL", level: 72, verified: true, assessments: 2, trending: false, category: "technical" }
    ]
  },
  {
    id: "analytical",
    name: "Analytical Thinking",
    icon: Brain,
    colour: "#ec4899",
    description: "Problem-solving, logical reasoning, and data analysis",
    skills: [
      { id: "problem-solving", name: "Problem Solving", level: 88, verified: true, assessments: 4, trending: false, category: "analytical" },
      { id: "data-analysis", name: "Data Analysis", level: 75, verified: true, assessments: 2, trending: true, category: "analytical" },
      { id: "critical-thinking", name: "Critical Thinking", level: 82, verified: false, assessments: 1, trending: false, category: "analytical" }
    ]
  },
  {
    id: "communication",
    name: "Communication",
    icon: MessageCircle,
    colour: "#10B981",
    description: "Written, verbal, and interpersonal communication skills",
    skills: [
      { id: "written-comm", name: "Written Communication", level: 90, verified: true, assessments: 3, trending: false, category: "communication" },
      { id: "presentation", name: "Presentation Skills", level: 70, verified: false, assessments: 1, trending: true, category: "communication" },
      { id: "teamwork", name: "Teamwork", level: 85, verified: true, assessments: 2, trending: false, category: "communication" }
    ]
  },
  {
    id: "creative",
    name: "Creative Thinking",
    icon: Palette,
    colour: "#F59E0B",
    description: "Innovation, design thinking, and creative problem-solving",
    skills: [
      { id: "design-thinking", name: "Design Thinking", level: 68, verified: false, assessments: 1, trending: true, category: "creative" },
      { id: "innovation", name: "Innovation", level: 73, verified: false, assessments: 0, trending: false, category: "creative" },
      { id: "creativity", name: "Creative Problem-Solving", level: 80, verified: true, assessments: 2, trending: true, category: "creative" }
    ]
  },
  {
    id: "leadership",
    name: "Leadership",
    icon: Users,
    colour: "#EF4444",
    description: "Team leadership, project management, and influence",
    skills: [
      { id: "team-leadership", name: "Team Leadership", level: 60, verified: false, assessments: 0, trending: false, category: "leadership" },
      { id: "project-management", name: "Project Management", level: 75, verified: true, assessments: 2, trending: true, category: "leadership" },
      { id: "mentoring", name: "Mentoring", level: 65, verified: false, assessments: 1, trending: false, category: "leadership" }
    ]
  },
  {
    id: "numerical",
    name: "Numerical Skills",
    icon: Calculator,
    colour: "#06B6D4",
    description: "Mathematical skills, financial analysis, and quantitative reasoning",
    skills: [
      { id: "financial-analysis", name: "Financial Analysis", level: 72, verified: true, assessments: 2, trending: false, category: "numerical" },
      { id: "statistics", name: "Statistics", level: 68, verified: false, assessments: 1, trending: true, category: "numerical" },
      { id: "data-modeling", name: "Data Modeling", level: 58, verified: false, assessments: 0, trending: false, category: "numerical" }
    ]
  }
];

interface InteractiveSkillRadarProps {
  showControls?: boolean;
  animateOnLoad?: boolean;
  interactive?: boolean;
}

export default function InteractiveSkillRadar({ 
  showControls = true, 
  animateOnLoad = true,
  interactive = true 
}: InteractiveSkillRadarProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Flatten all skills
  useEffect(() => {
    const allSkills = skillCategories.flatMap(cat => cat.skills);
    setSkills(allSkills);
  }, []);

  // Calculate radar data
  const radarData: RadarDataPoint[] = skillCategories.map(category => {
    const categorySkills = category.skills;
    const averageScore = categorySkills.reduce((sum, skill) => sum + skill.level, 0) / categorySkills.length;
    
    return {
      category: category.name,
      score: averageScore,
      maxScore: 100,
      colour: category.colour,
      skills: categorySkills.length
    };
  });

  // Animation sequence
  useEffect(() => {
    if (animateOnLoad) {
      const phases = [0, 1, 2, 3];
      let currentPhase = 0;
      
      const interval = setInterval(() => {
        setAnimationPhase(phases[currentPhase]);
        currentPhase++;
        
        if (currentPhase >= phases.length) {
          clearInterval(interval);
        }
      }, 800);
      
      return () => clearInterval(interval);
    }
  }, [animateOnLoad]);

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centreX = canvas.width / 2;
      const centreY = canvas.height / 2;
      const maxRadius = Math.min(centreX, centreY) - 40;
      
      // Draw background circles
      const levels = [0.2, 0.4, 0.6, 0.8, 1.0];
      levels.forEach((level, index) => {
        ctx.beginPath();
        ctx.arc(centreX, centreY, maxRadius * level, 0, 2 * Math.PI);
        ctx.strokeStyle = `rgba(148, 163, 184, ${0.3 - index * 0.05})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });
      
      // Draw axis lines
      const angleStep = (2 * Math.PI) / radarData.length;
      radarData.forEach((_, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const x = centreX + Math.cos(angle) * maxRadius;
        const y = centreY + Math.sin(angle) * maxRadius;
        
        ctx.beginPath();
        ctx.moveTo(centreX, centreY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });
      
      // Draw skill polygon
      if (animationPhase >= 2) {
        ctx.beginPath();
        radarData.forEach((dataPoint, index) => {
          const angle = index * angleStep - Math.PI / 2;
          const distance = (dataPoint.score / 100) * maxRadius;
          const x = centreX + Math.cos(angle) * distance;
          const y = centreY + Math.sin(angle) * distance;
          
          if (index === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });
        ctx.closePath();
        
        // Fill with gradient
        const gradient = ctx.createRadialGradient(centreX, centreY, 0, centreX, centreY, maxRadius);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0.1)');
        ctx.fillStyle = gradient;
        ctx.fill();
        
        ctx.strokeStyle = '#3B82F6';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      // Draw data points
      if (animationPhase >= 3) {
        radarData.forEach((dataPoint, index) => {
          const angle = index * angleStep - Math.PI / 2;
          const distance = (dataPoint.score / 100) * maxRadius;
          const x = centreX + Math.cos(angle) * distance;
          const y = centreY + Math.sin(angle) * distance;
          
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, 2 * Math.PI);
          ctx.fillStyle = dataPoint.colour;
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();
        });
      }
    };

    draw();
  }, [radarData, animationPhase]);

  const getOverallScore = () => {
    const totalScore = radarData.reduce((sum, data) => sum + data.score, 0);
    return Math.round(totalScore / radarData.length);
  };

  const getProfileStrength = (score: number) => {
    if (score >= 80) return { label: "Expert", colour: "text-green-600", bg: "bg-green-100" };
    if (score >= 65) return { label: "Advanced", colour: "text-blue-600", bg: "bg-blue-100" };
    if (score >= 50) return { label: "Intermediate", colour: "text-yellow-600", bg: "bg-yellow-100" };
    return { label: "Developing", colour: "text-gray-600", bg: "bg-gray-100" };
  };

  const overallScore = getOverallScore();
  const profileStrength = getProfileStrength(overallScore);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Radar className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Overall Score</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{overallScore}%</div>
              <Badge className={`${profileStrength.colour} ${profileStrength.bg} mt-1`}>
                {profileStrength.label}
              </Badge>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Award className="h-5 w-5 text-green-600" />
                <span className="font-medium">Verified Skills</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {skills.filter(s => s.verified).length}
              </div>
              <p className="text-xs text-muted-foreground">of {skills.length} total</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-pink-600" />
                <span className="font-medium">Trending Skills</span>
              </div>
              <div className="text-2xl font-bold text-pink-600">
                {skills.filter(s => s.trending).length}
              </div>
              <p className="text-xs text-muted-foreground">high demand</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="h-5 w-5 text-orange-600" />
                <span className="font-medium">Assessments</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">
                {skills.reduce((sum, skill) => sum + skill.assessments, 0)}
              </div>
              <p className="text-xs text-muted-foreground">completed</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radar className="h-5 w-5" />
              Skill Profile Radar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={400}
                height={400}
                className="w-full h-auto max-w-md mx-auto"
              />
              
              {/* Category Labels */}
              <div className="absolute inset-0 pointer-events-none">
                {radarData.map((dataPoint, index) => {
                  const angleStep = (2 * Math.PI) / radarData.length;
                  const angle = index * angleStep - Math.PI / 2;
                  const radius = 180; // Adjust based on canvas size
                  const x = 50 + Math.cos(angle) * radius;
                  const y = 50 + Math.sin(angle) * radius;
                  
                  return (
                    <motion.div
                      key={dataPoint.category}
                      className="absolute text-xs font-medium text-center transform -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${x}%`, top: `${y}%` }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: animationPhase >= 1 ? 1 : 0,
                        scale: animationPhase >= 1 ? 1 : 0
                      }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div 
                        className="px-2 py-1 rounded-md text-white text-xs"
                        style={{ backgroundColor: dataPoint.colour }}
                      >
                        {dataPoint.category}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {Math.round(dataPoint.score)}%
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skill Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Skill Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {skillCategories.map((category, index) => {
              const Icon = category.icon;
              const categoryData = radarData.find(d => d.category === category.name);
              const isSelected = selectedCategory === category.id;
              
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedCategory(isSelected ? null : category.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${category.colour}20` }}
                      >
                        <Icon className="h-5 w-5" style={{ colour: category.colour }} />
                      </div>
                      <div>
                        <h4 className="font-medium">{category.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {category.skills.length} skills
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold" style={{ colour: category.colour }}>
                        {Math.round(categoryData?.score || 0)}%
                      </div>
                      <div className="flex gap-1">
                        {category.skills.map(skill => (
                          <div
                            key={skill.id}
                            className={`w-2 h-2 rounded-full ${
                              skill.verified ? "bg-green-500" : "bg-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <Progress 
                    value={categoryData?.score || 0} 
                    className="h-2 mb-2"
                  />
                  
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 space-y-2"
                      >
                        {category.skills.map(skill => (
                          <div
                            key={skill.id}
                            className="flex items-center justify-between p-2 bg-white rounded border"
                            onMouseEnter={() => setHoveredSkill(skill)}
                            onMouseLeave={() => setHoveredSkill(null)}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{skill.name}</span>
                              {skill.verified && (
                                <Badge variant="outline" className="text-xs">
                                  Verified
                                </Badge>
                              )}
                              {skill.trending && (
                                <TrendingUp className="h-3 w-3 text-green-500" />
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">
                                {skill.level}%
                              </span>
                              <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < Math.floor(skill.level / 20)
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      {showControls && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap gap-4 justify-center"
        >
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Zap className="h-4 w-4 mr-2" />
            Take Skills Assessment
          </Button>
          <Button variant="outline">
            <Target className="h-4 w-4 mr-2" />
            Find Matching Jobs
          </Button>
          <Button variant="outline">
            <TrendingUp className="h-4 w-4 mr-2" />
            Skill Development Plan
          </Button>
        </motion.div>
      )}

      {/* Skill Hover Tooltip */}
      <AnimatePresence>
        {hoveredSkill && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-4 right-4 p-4 bg-white border rounded-lg shadow-lg z-50 max-w-sm"
          >
            <h4 className="font-medium">{hoveredSkill.name}</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Level: {hoveredSkill.level}% • {hoveredSkill.assessments} assessments
            </p>
            <div className="flex gap-2">
              {hoveredSkill.verified && (
                <Badge className="text-xs">Verified</Badge>
              )}
              {hoveredSkill.trending && (
                <Badge variant="outline" className="text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Trending
                </Badge>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}