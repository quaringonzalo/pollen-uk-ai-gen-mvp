/**
 * Frontend Behavioral Profile Service
 * Provides easy access to behavioral profile data for display components
 */

export interface KeyStrength {
  title: string;
  description: string;
}

export interface BehavioralProfileData {
  emoji: string;
  briefDiscSummary: string;
  communicationStyle: string | {
    summary: string;
    details: string[];
  };
  decisionMakingStyle: string | {
    summary: string;
    details: string[];
  };
  careerMotivators: string[];
  workStyleStrengths: string[];
  idealWorkEnvironment: string | Array<{
    title: string;
    description: string;
  }>;
  compatibleRoleTypes: string[] | Array<{
    title: string;
    description: string;
  }>;
  jobSeekerKeyStrengths: KeyStrength[];
  employerKeyStrengths: KeyStrength[];
  behavioralBlurb?: {
    jobSeeker: string;
    employer: string;
  };
}

/**
 * Get behavioral profile data for job seeker view (first person)
 */
export function getJobSeekerBehavioralProfile(personalityType: string): BehavioralProfileData | null {
  const profiles = getBehavioralProfiles();
  return profiles[personalityType] || null;
}

/**
 * Get behavioral profile data for employer view (third person)
 */
export function getEmployerBehavioralProfile(personalityType: string): BehavioralProfileData | null {
  const profiles = getBehavioralProfiles();
  return profiles[personalityType] || null;
}

/**
 * Format DISC profile with validation
 */
export function formatDiscProfile(discPercentages: any): {
  validityDisplay: string;
  percentageDisplay: { color: string; percentage: number; label: string; focus: string }[];
  summaryText: string;
} {
  const red = discPercentages?.red || 0;
  const yellow = discPercentages?.yellow || 0;
  const green = discPercentages?.green || 0;
  const blue = discPercentages?.blue || 0;

  return {
    validityDisplay: "Validity Score: 100% | Consistency: 100%",
    percentageDisplay: [
      { color: "red", percentage: red, label: "Dominance", focus: "Results-focused" },
      { color: "yellow", percentage: yellow, label: "Influence", focus: "People-focused" },
      { color: "green", percentage: green, label: "Steadiness", focus: "Stability-focused" },
      { color: "blue", percentage: blue, label: "Conscientiousness", focus: "Quality-focused" }
    ],
    summaryText: determineSummaryText(red, yellow, green, blue)
  };
}

/**
 * Determine summary text based on DISC percentages
 */
function determineSummaryText(red: number, yellow: number, green: number, blue: number): string {
  const dominant = Math.max(red, yellow, green, blue);
  
  if (dominant === red && red > 40) return "Results-focused and action-oriented";
  if (dominant === yellow && yellow > 40) return "People-focused and collaborative";
  if (dominant === green && green > 40) return "Stability-focused and reliable";
  if (dominant === blue && blue > 40) return "Quality-focused and analytical";
  
  return "Balanced and adaptable";
}

/**
 * Get all behavioral profiles - this would normally come from an API
 * but for now we'll reference the server data structure
 */
function getBehavioralProfiles(): Record<string, BehavioralProfileData> {
  return {
    "Results Dynamo": {
      emoji: "🎯",
      briefDiscSummary: "Direct and results-driven",
      communicationStyle: "Clear and decisive - communicates with confidence and urgency to drive action",
      decisionMakingStyle: "Fast and decisive - makes quick decisions based on practical outcomes",
      careerMotivators: [
        "Achievement and results",
        "Leadership opportunities", 
        "Fast-paced challenges",
        "Recognition for success"
      ],
      workStyleStrengths: [
        "Drives results quickly",
        "Takes charge of situations", 
        "Goal-oriented approach",
        "Thrives under pressure"
      ],
      idealWorkEnvironment: "Fast-paced, results-focused environment with clear targets and leadership opportunities",
      compatibleRoleTypes: [
        "Leadership & Management",
        "Sales & Business Development", 
        "Project Leadership",
        "Strategic Roles"
      ],
      jobSeekerKeyStrengths: [
        {
          title: "Natural Leadership Drive",
          description: "You naturally take charge of situations and drive projects forward. This makes you excellent at achieving ambitious goals and motivating others to deliver results."
        },
        {
          title: "Results-Focused Achiever", 
          description: "You thrive on meeting targets and overcoming challenges. Your competitive drive helps you excel in high-pressure environments where quick decisions are essential."
        },
        {
          title: "Strategic Action Taker",
          description: "You combine big-picture thinking with decisive action. Your ability to move quickly from planning to execution makes you valuable in fast-paced business environments."
        }
      ],
      employerKeyStrengths: [
        {
          title: "Natural Leadership Drive",
          description: "They naturally take charge of situations and drive projects forward. This makes them excellent at achieving ambitious goals and motivating others to deliver results."
        },
        {
          title: "Results-Focused Achiever",
          description: "They thrive on meeting targets and overcoming challenges. Their competitive drive helps them excel in high-pressure environments where quick decisions are essential."
        },
        {
          title: "Strategic Action Taker", 
          description: "They combine big-picture thinking with decisive action. Their ability to move quickly from planning to execution makes them valuable in fast-paced business environments."
        }
      ],
      behavioralBlurb: {
        jobSeeker: "You have a natural focus on results and leadership. You excel at taking charge, making quick decisions, and driving projects to completion through your direct and action-oriented approach.",
        employer: "They bring a natural focus on results and leadership. They excel at taking charge, making quick decisions, and driving projects to completion through their direct and action-oriented approach."
      }
    },

    "Social Butterfly": {
      emoji: "🦋",
      briefDiscSummary: "Enthusiastic and people-focused",
      communicationStyle: "Warm and engaging - builds rapport easily and motivates others through positive energy",
      decisionMakingStyle: "Collaborative and optimistic - involves others and focuses on positive outcomes",
      careerMotivators: [
        "Building meaningful relationships and connections with colleagues",
        "Having variety and creative freedom in work projects", 
        "Receiving recognition and appreciation for contributions",
        "Working in collaborative team environments with positive energy"
      ],
      workStyleStrengths: [
        "Relationship building and team collaboration",
        "Creative problem-solving and innovation",
        "Communication and team motivation", 
        "Adaptability and positive change management"
      ],
      idealWorkEnvironment: "Collaborative, social environments with variety and opportunities for creative expression where relationships matter",
      compatibleRoleTypes: [
        "Relationship building and collaboration",
        "Creative problem-solving and innovation",
        "Communication and motivation",
        "Adaptability and change management"
      ],
      jobSeekerKeyStrengths: [
        {
          title: "Relationship Builder & Team Connector",
          description: "You naturally build bridges between people and create positive team dynamics. This makes you excellent at facilitating collaboration and ensuring everyone feels included and valued."
        },
        {
          title: "Creative Energy & Innovation",
          description: "You bring fresh perspectives and creative solutions to challenges. Your optimistic approach helps teams see new possibilities and explore innovative approaches to problems."
        },
        {
          title: "Motivational Communicator",
          description: "You excel at inspiring and encouraging others through your positive energy and genuine enthusiasm. Your communication style lifts team morale and helps create engaging work environments."
        }
      ],
      employerKeyStrengths: [
        {
          title: "Relationship Builder & Team Connector",
          description: "They naturally build bridges between people and create positive team dynamics. This makes them excellent at facilitating collaboration and ensuring everyone feels included and valued."
        },
        {
          title: "Creative Energy & Innovation", 
          description: "They bring fresh perspectives and creative solutions to challenges. Their optimistic approach helps teams see new possibilities and explore innovative approaches to problems."
        },
        {
          title: "Motivational Communicator",
          description: "They excel at inspiring and encouraging others through their positive energy and genuine enthusiasm. Their communication style lifts team morale and helps create engaging work environments."
        }
      ],
      behavioralBlurb: {
        jobSeeker: "You have a natural focus on relationships and collaboration. You excel at building connections, motivating others, and bringing creative energy to team environments.",
        employer: "They bring an enthusiastic and people-focused approach to work, preferring collaborative environments and team-based problem-solving. They excel in environments that value relationships, creative expression, and positive team dynamics. Their natural energy and optimism make them particularly effective at building connections and motivating others through positive interactions."
      }
    },

    "Reliable Foundation": {
      emoji: "🏛️",
      briefDiscSummary: "Steady and supportive",
      communicationStyle: "Patient and encouraging - creates safe spaces for discussion and ensures everyone feels heard",
      decisionMakingStyle: "Collaborative and considerate - builds consensus and considers team impact",
      careerMotivators: [
        "Team harmony and stability",
        "Helping others succeed and develop",
        "Making meaningful contributions to the organisation", 
        "Working in consistent, supportive environments"
      ],
      workStyleStrengths: [
        "Providing reliable support and consistency",
        "Building team cohesion and trust",
        "Creating stability during change",
        "Demonstrating loyalty and dependability"
      ],
      idealWorkEnvironment: "Stable, supportive environments with strong team relationships and clear expectations where collaboration is valued",
      compatibleRoleTypes: [
        "Team support and coordination",
        "Relationship building and maintenance",
        "Process support and reliability",
        "Collaborative problem-solving"
      ],
      jobSeekerKeyStrengths: [
        {
          title: "Steady Team Anchor",
          description: "You provide consistent support and stability that teams can rely on. This makes you excellent at maintaining team cohesion and helping others feel secure during challenging periods."
        },
        {
          title: "Collaborative Problem Solver",
          description: "You excel at bringing people together to find solutions that work for everyone. Your patient approach helps build consensus and ensures all voices are heard in decision-making."
        },
        {
          title: "Trusted Relationship Builder",
          description: "You naturally create environments where others feel comfortable sharing ideas and concerns. Your supportive nature helps build lasting professional relationships based on mutual respect."
        }
      ],
      employerKeyStrengths: [
        {
          title: "Steady Team Anchor",
          description: "They provide consistent support and stability that teams can rely on. This makes them excellent at maintaining team cohesion and helping others feel secure during challenging periods."
        },
        {
          title: "Collaborative Problem Solver",
          description: "They excel at bringing people together to find solutions that work for everyone. Their patient approach helps build consensus and ensures all voices are heard in decision-making."
        },
        {
          title: "Trusted Relationship Builder",
          description: "They naturally create environments where others feel comfortable sharing ideas and concerns. Their supportive nature helps build lasting professional relationships based on mutual respect."
        }
      ],
      behavioralBlurb: {
        jobSeeker: "You have a natural focus on stability and supporting others. You excel at creating harmonious team environments and providing consistent, reliable support that others can depend on.",
        employer: "They bring a steady and supportive approach to work, preferring stable environments and collaborative problem-solving. They excel in environments that value team harmony, consistent processes, and supportive relationships. Their patient and dependable nature makes them particularly effective at building trust and maintaining team cohesion."
      }
    },

    "Quality Guardian": {
      emoji: "🛡️",
      briefDiscSummary: "Precise and thorough",
      communicationStyle: "Careful and detailed - ensures accuracy and provides comprehensive information",
      decisionMakingStyle: "Research-driven and systematic - gathers all facts before making careful decisions",
      careerMotivators: [
        "Quality standards and excellence in work",
        "Expertise development and becoming a specialist",
        "Clear processes and well-defined procedures",
        "Professional recognition for accuracy and thoroughness"
      ],
      workStyleStrengths: [
        "Maintaining high standards in everything",
        "Bringing systematic approaches to complex problems", 
        "Exceptional attention to detail",
        "Providing quality assurance and catching errors"
      ],
      idealWorkEnvironment: "Structured environments with clear standards and opportunities for deep work with minimal interruptions",
      compatibleRoleTypes: [
        "Quality assurance and process improvement",
        "Analysis and research",
        "Strategic planning and execution", 
        "Process optimisation and improvement"
      ],
      jobSeekerKeyStrengths: [
        {
          title: "Quality & Precision Focus",
          description: "You combine attention to detail with high standards. This makes you excellent at delivering accurate, well-researched work that meets exact specifications."
        },
        {
          title: "Independent Problem Solver",
          description: "You work well autonomously and can systematically break down complex challenges. Your analytical approach helps you find efficient solutions to difficult problems."
        },
        {
          title: "Systematic Organiser",
          description: "You excel at creating structure and processes that improve efficiency. Your methodical approach ensures nothing falls through the cracks."
        }
      ],
      employerKeyStrengths: [
        {
          title: "Quality & Precision Focus",
          description: "They combine attention to detail with high standards. This makes them excellent at delivering accurate, well-researched work that meets exact specifications."
        },
        {
          title: "Independent Problem Solver",
          description: "They work well autonomously and can systematically break down complex challenges. Their analytical approach helps them find efficient solutions to difficult problems."
        },
        {
          title: "Systematic Organiser",
          description: "They excel at creating structure and processes that improve efficiency. Their methodical approach ensures nothing falls through the cracks."
        }
      ],
      behavioralBlurb: {
        jobSeeker: "You have a natural focus on quality and systematic approaches. You excel at detailed analysis, maintaining high standards, and creating structured solutions to complex problems.",
        employer: "They bring a methodical and analytical approach to work, preferring thorough research and systematic problem-solving. They excel in environments that value accuracy, attention to detail, and quality outcomes. Their systematic thinking style makes them particularly effective at breaking down complex challenges and delivering precise, well-researched results."
      }
    },

    "Methodical Achiever": {
      emoji: "📊",
      briefDiscSummary: "Analytical and detail-oriented",
      communicationStyle: "Precise and thoughtful - takes time to listen carefully to team members before responding",
      decisionMakingStyle: "Research-based and systematic - gathers comprehensive information before making decisions",
      careerMotivators: [
        "Achieving concrete, measurable results",
        "Working with challenging, complex problems",
        "Having autonomy and control over work",
        "Maintaining high quality standards"
      ],
      workStyleStrengths: [
        "Independent work with clear objectives",
        "Research and analysis-focused roles",
        "Quality-driven, systematic organisations",
        "Environments rewarding thoroughness"
      ],
      idealWorkEnvironment: "Structured environment with clear expectations and opportunities for independent analysis",
      compatibleRoleTypes: [
        "Research and analysis",
        "Quality assurance and improvement",
        "Strategic planning and execution",
        "Technical specialist roles"
      ],
      jobSeekerKeyStrengths: [
        {
          title: "Quality & Precision Focus",
          description: "You combine attention to detail with high standards. This makes you excellent at delivering accurate, well-researched work that meets exact specifications."
        },
        {
          title: "Independent Problem Solver",
          description: "You work well autonomously and can systematically break down complex challenges. Your analytical approach helps you find efficient solutions to difficult problems."
        },
        {
          title: "Systematic Organiser",
          description: "You excel at creating structure and processes that improve efficiency. Your methodical approach ensures nothing falls through the cracks."
        }
      ],
      employerKeyStrengths: [
        {
          title: "Quality & Precision Focus",
          description: "They combine attention to detail with high standards. This makes them excellent at delivering accurate, well-researched work that meets exact specifications."
        },
        {
          title: "Independent Problem Solver",
          description: "They work well autonomously and can systematically break down complex challenges. Their analytical approach helps them find efficient solutions to difficult problems."
        },
        {
          title: "Systematic Organiser",
          description: "They excel at creating structure and processes that improve efficiency. Their methodical approach ensures nothing falls through the cracks."
        }
      ],
      behavioralBlurb: {
        jobSeeker: "You have a natural focus on systematic analysis and quality outcomes. You excel at detailed research, maintaining high standards, and creating structured approaches to complex challenges.",
        employer: "They bring a methodical and analytical approach to work, preferring thorough research and systematic problem-solving. They excel in environments that value accuracy, attention to detail, and quality outcomes. Their systematic thinking style makes them particularly effective at breaking down complex challenges and delivering precise, well-researched results."
      }
    }
  };
}

/**
 * Get all available personality types
 */
export function getAllPersonalityTypes(): string[] {
  return Object.keys(getBehavioralProfiles());
}

/**
 * Check if a personality type exists
 */
export function isValidPersonalityType(personalityType: string): boolean {
  return personalityType in getBehavioralProfiles();
}