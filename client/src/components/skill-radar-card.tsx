import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import InteractiveSkillRadar from "./interactive-skill-radar";
import { Radar, Eye, EyeOff, Maximize2 } from "lucide-react";

interface SkillRadarCardProps {
  userId?: number;
  compact?: boolean;
  showActions?: boolean;
}

export default function SkillRadarCard({ 
  userId, 
  compact = false, 
  showActions = true 
}: SkillRadarCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6 text-center">
          <div className="text-muted-foreground mb-4">
            <EyeOff className="h-8 w-8 mx-auto mb-2" />
            <p>Skill radar is hidden</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setIsVisible(true)}
            size="sm"
          >
            <Eye className="h-4 w-4 mr-2" />
            Show Skill Radar
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (compact && !isExpanded) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Radar className="h-5 w-5 text-blue-600" />
                Skill Profile
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(true)}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
                {showActions && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsVisible(false)}
                  >
                    <EyeOff className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Mini Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">78%</div>
                  <div className="text-xs text-muted-foreground">Overall</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">12</div>
                  <div className="text-xs text-muted-foreground">Verified</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">6</div>
                  <div className="text-xs text-muted-foreground">Trending</div>
                </div>
              </div>

              {/* Top Skills */}
              <div>
                <h4 className="text-sm font-medium mb-2">Top Skills</h4>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs">JavaScript 85%</Badge>
                  <Badge variant="secondary" className="text-xs">Communication 90%</Badge>
                  <Badge variant="secondary" className="text-xs">Problem Solving 88%</Badge>
                </div>
              </div>

              <Button 
                className="w-full" 
                size="sm"
                onClick={() => setIsExpanded(true)}
              >
                View Full Radar
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Radar className="h-6 w-6 text-blue-600" />
              Interactive Skill Radar
            </CardTitle>
            <div className="flex gap-2">
              {isExpanded && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                >
                  Minimize
                </Button>
              )}
              {showActions && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsVisible(false)}
                >
                  <EyeOff className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <InteractiveSkillRadar 
            showControls={isExpanded}
            animateOnLoad={true}
            interactive={true}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}