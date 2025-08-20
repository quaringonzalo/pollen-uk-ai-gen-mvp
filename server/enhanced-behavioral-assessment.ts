// Enhanced Behavioral Assessment with Complete DISC Scoring
// Based on CSV data analysis for improved matchmaking

import { behavioralProfiles } from './behavioral-profiles-database.js';

export interface EnhancedDiscProfile {
  red: number;
  yellow: number;
  green: number;
  blue: number;
  dominantTraits: string[];
  influentialTraits: string[];
  steadyTraits: string[];
  conscientiousTraits: string[];
  workStyle: string;
  personalityType: string;  // Dynamic personality type name
  communicationStyle: string;
  decisionMaking: string;
  stressResponse: string;
  teamRole: string;
  leadership: string;
  completedAt: Date;
  pointsAwarded: number;
}

export interface PersonalityInsights {
  strengths: string[];
  challenges: string[];
  idealWorkEnvironment: string[];
  motivators: string[];
  compatibleRoles: string[];
  workingStylePreferences: string[];
}

// Complete DISC Assessment Questions from CSV Analysis
export const ENHANCED_ASSESSMENT_QUESTIONS = [
  {
    id: "rules",
    question: "Rules are for...",
    options: [
      { text: "Avoiding unnecessary risks", disc: { red: 0, yellow: 0, green: 3, blue: 2 } },
      { text: "Respecting - they're there for a reason", disc: { red: 0, yellow: 0, green: 2, blue: 3 } },
      { text: "Breaking when they don't make sense", disc: { red: 3, yellow: 2, green: 0, blue: 0 } },
      { text: "Guidelines to help navigate situations", disc: { red: 1, yellow: 2, green: 1, blue: 1 } }
    ]
  },
  {
    id: "conflict",
    question: "When it comes to conflict...",
    options: [
      { text: "I care deeply if I'm involved, it matters to me what people think", disc: { red: 0, yellow: 1, green: 3, blue: 1 } },
      { text: "I remove myself from the situation", disc: { red: 0, yellow: 0, green: 2, blue: 3 } },
      { text: "I tackle it head-on", disc: { red: 3, yellow: 1, green: 0, blue: 1 } },
      { text: "I try to find a middle ground that works for everyone", disc: { red: 1, yellow: 2, green: 2, blue: 0 } }
    ]
  },
  {
    id: "furniture",
    question: "Flat pack furniture...",
    options: [
      { text: "Is a fun activity to do as a team", disc: { red: 0, yellow: 3, green: 2, blue: 0 } },
      { text: "Gives me a big sense of accomplishment after proper preparation", disc: { red: 1, yellow: 0, green: 1, blue: 3 } },
      { text: "Is best tackled with determination and speed", disc: { red: 3, yellow: 1, green: 0, blue: 1 } },
      { text: "Should come with clearer instructions", disc: { red: 1, yellow: 1, green: 1, blue: 2 } }
    ]
  },
  {
    id: "todo",
    question: "My to-do list is...",
    options: [
      { text: "Extensively organised into categories", disc: { red: 1, yellow: 0, green: 1, blue: 3 } },
      { text: "Pretty concise, I don't have many urgent things to do", disc: { red: 0, yellow: 1, green: 2, blue: 1 } },
      { text: "Not overly important, flexibility is everything", disc: { red: 1, yellow: 3, green: 1, blue: 0 } },
      { text: "Written but regularly ignored", disc: { red: 2, yellow: 2, green: 0, blue: 0 } }
    ]
  },
  {
    id: "games",
    question: "When playing a game I...",
    options: [
      { text: "Will analyse every move and strive to do my best", disc: { red: 2, yellow: 0, green: 0, blue: 3 } },
      { text: "Play to win", disc: { red: 3, yellow: 1, green: 0, blue: 1 } },
      { text: "Focus on having fun with friends", disc: { red: 0, yellow: 3, green: 2, blue: 0 } },
      { text: "Like to try new strategies", disc: { red: 1, yellow: 2, green: 1, blue: 1 } }
    ]
  },
  {
    id: "tasks",
    question: "When carrying out a task I...",
    options: [
      { text: "Approach it systematically, ensuring all details are covered", disc: { red: 1, yellow: 0, green: 1, blue: 3 } },
      { text: "Invest time in deciding how to tackle it, seeking guidance from others where I can", disc: { red: 0, yellow: 1, green: 3, blue: 2 } },
      { text: "Jump straight in and adapt as I go", disc: { red: 3, yellow: 2, green: 0, blue: 0 } },
      { text: "Break it down into manageable chunks", disc: { red: 1, yellow: 1, green: 2, blue: 2 } }
    ]
  },
  {
    id: "social",
    question: "My social life is...",
    options: [
      { text: "All about close-knit bonds and shared memories", disc: { red: 0, yellow: 1, green: 3, blue: 1 } },
      { text: "Super busy, I'm always hanging out with different people", disc: { red: 1, yellow: 3, green: 0, blue: 0 } },
      { text: "Balanced between social time and alone time", disc: { red: 1, yellow: 1, green: 2, blue: 2 } },
      { text: "Centered around shared interests and activities", disc: { red: 1, yellow: 2, green: 1, blue: 2 } }
    ]
  },
  {
    id: "decisions",
    question: "I make decisions...",
    options: [
      { text: "With careful thought and analysis, every choice matters", disc: { red: 0, yellow: 0, green: 1, blue: 3 } },
      { text: "As a team, once I've consulted everyone's opinions", disc: { red: 0, yellow: 1, green: 3, blue: 1 } },
      { text: "Quickly and trust my instincts", disc: { red: 3, yellow: 2, green: 0, blue: 0 } },
      { text: "Based on past experiences and proven methods", disc: { red: 1, yellow: 0, green: 2, blue: 2 } }
    ]
  }
];

// Additional Behavioral Assessment Questions for Enhanced Profiling
export const EXTENDED_BEHAVIORAL_QUESTIONS = [
  {
    id: "planning",
    question: "When making plans I...",
    options: [
      { text: "Keep it open-ended, who knows where the adventure leads?", disc: { red: 1, yellow: 3, green: 0, blue: 0 } },
      { text: "Involve everyone, plans are stronger together", disc: { red: 0, yellow: 2, green: 3, blue: 1 } },
      { text: "Plan meticulously with contingencies", disc: { red: 2, yellow: 0, green: 1, blue: 3 } },
      { text: "Make quick decisions and go with it", disc: { red: 3, yellow: 1, green: 0, blue: 1 } }
    ]
  },
  {
    id: "homework",
    question: "At school, I would complete homework...",
    options: [
      { text: "To the best of my ability, having thoroughly checked it through", disc: { red: 1, yellow: 0, green: 1, blue: 3 } },
      { text: "As quickly as possible so I could do better things", disc: { red: 2, yellow: 2, green: 0, blue: 0 } },
      { text: "With friends, making it more enjoyable", disc: { red: 0, yellow: 3, green: 2, blue: 0 } },
      { text: "When absolutely necessary", disc: { red: 2, yellow: 1, green: 0, blue: 1 } }
    ]
  },
  {
    id: "problems",
    question: "If I have a tough problem to solve...",
    options: [
      { text: "I seek input and opinions to find the best solution", disc: { red: 0, yellow: 2, green: 3, blue: 1 } },
      { text: "I analyse it systematically until I understand it completely", disc: { red: 1, yellow: 0, green: 0, blue: 3 } },
      { text: "I tackle it head-on with determination", disc: { red: 3, yellow: 1, green: 0, blue: 1 } },
      { text: "I brainstorm creative solutions", disc: { red: 1, yellow: 3, green: 1, blue: 0 } }
    ]
  },
  {
    id: "fears",
    question: "I'm most fearful of...",
    options: [
      { text: "Feeling disconnected from others or being misunderstood", disc: { red: 0, yellow: 1, green: 3, blue: 1 } },
      { text: "Making the wrong decision", disc: { red: 0, yellow: 0, green: 2, blue: 3 } },
      { text: "Being controlled or micromanaged", disc: { red: 3, yellow: 2, green: 0, blue: 0 } },
      { text: "Missing out on opportunities", disc: { red: 2, yellow: 3, green: 0, blue: 0 } }
    ]
  },
  {
    id: "phone_calls",
    question: "When someone calls me up I...",
    options: [
      { text: "Answer enthusiastically, conversations energise me", disc: { red: 1, yellow: 3, green: 1, blue: 0 } },
      { text: "Answer warmly, eager to connect", disc: { red: 0, yellow: 2, green: 3, blue: 0 } },
      { text: "Answer if I have time and energy", disc: { red: 1, yellow: 1, green: 1, blue: 2 } },
      { text: "Get straight to the point", disc: { red: 3, yellow: 0, green: 0, blue: 2 } }
    ]
  },
  {
    id: "accomplishment",
    question: "If I've done a good job I...",
    options: [
      { text: "Feel accomplished and validated", disc: { red: 1, yellow: 2, green: 2, blue: 1 } },
      { text: "Look for the next challenge", disc: { red: 3, yellow: 1, green: 0, blue: 1 } },
      { text: "Share the success with my team", disc: { red: 0, yellow: 2, green: 3, blue: 0 } },
      { text: "Analyse what made it successful", disc: { red: 1, yellow: 0, green: 0, blue: 3 } }
    ]
  },
  {
    id: "worst_party",
    question: "At the worst party ever I...",
    options: [
      { text: "Try to amplify the fun factor with music and games", disc: { red: 1, yellow: 3, green: 1, blue: 0 } },
      { text: "Wonder who's responsible for organising it", disc: { red: 2, yellow: 0, green: 0, blue: 2 } },
      { text: "Focus on connecting with one or two people", disc: { red: 0, yellow: 1, green: 3, blue: 1 } },
      { text: "Leave early", disc: { red: 2, yellow: 0, green: 1, blue: 2 } }
    ]
  },
  {
    id: "work_environment",
    question: "I work best...",
    options: [
      { text: "In dynamic settings with human interactions", disc: { red: 1, yellow: 3, green: 1, blue: 0 } },
      { text: "In a supportive and cooperative environment", disc: { red: 0, yellow: 1, green: 3, blue: 1 } },
      { text: "Under pressure, striving for results", disc: { red: 3, yellow: 0, green: 0, blue: 1 } },
      { text: "In quiet, organised spaces", disc: { red: 0, yellow: 0, green: 1, blue: 3 } }
    ]
  }
];

export function calculateDiscProfile(responses: { [key: string]: string }): EnhancedDiscProfile {
  let red = 0, yellow = 0, green = 0, blue = 0;
  let totalQuestions = 0;

  // Calculate scores from responses object
  Object.entries(responses).forEach(([questionId, answer]) => {
    // Find the question in our reduced assessment
    const question = ENHANCED_ASSESSMENT_QUESTIONS.find(q => q.id === questionId);
    if (question) {
      const option = question.options.find(opt => opt.text === answer);
      if (option && option.disc) {
        red += option.disc.red;
        yellow += option.disc.yellow;
        green += option.disc.green;
        blue += option.disc.blue;
        totalQuestions++;
      }
    }
  });

  // If no valid responses found, check for forced-choice format
  if (totalQuestions === 0) {
    Object.entries(responses).forEach(([questionId, response]) => {
      if (typeof response === 'object' && response.mostLikeMe !== undefined && response.leastLikeMe !== undefined) {
        // Handle forced-choice format
        totalQuestions++;
        
        // Each response contributes to DISC dimensions based on the choice patterns
        // Most like me: positive contribution
        // Least like me: negative contribution (reduced impact)
        
        // Simple pattern-based scoring until we align question structures
        const mostChoice = response.mostLikeMe;
        const leastChoice = response.leastLikeMe;
        
        // Implement proper weighted DISC scoring based on response patterns
        // Analyze the response patterns to determine DISC preferences
        
        // For responses where user heavily weights towards choice 0 (most aggressive/direct options)
        // This indicates Red (Dominance) preference
        if (mostChoice === 0) {
          red += 4; // Strong indicator for dominance
          yellow += 1; // May have some influence elements
        }
        // Choice 1 typically represents social/people-focused options (Yellow - Influence)
        else if (mostChoice === 1) {
          yellow += 4;
          red += 1; // May have some assertive elements
        }
        // Choice 2 often represents collaborative/supportive options (Green - Steadiness)
        else if (mostChoice === 2) {
          green += 4;
          yellow += 1; // May be social but steady
        }
        // Choice 3 usually represents methodical/careful options (Blue - Conscientiousness)
        else if (mostChoice === 3) {
          blue += 4;
          green += 1; // May have stability elements
        }
        
        // Negative scoring for "least like me" reduces those traits
        if (leastChoice === 0) red -= 2;
        else if (leastChoice === 1) yellow -= 2;
        else if (leastChoice === 2) green -= 2;
        else if (leastChoice === 3) blue -= 2;
      }
    });
  }

  console.log("Raw DISC scores before normalization:", { red, yellow, green, blue, total: red + yellow + green + blue, totalQuestions });
  
  // Prevent negative scores from affecting final percentages
  red = Math.max(0, red);
  yellow = Math.max(0, yellow);
  green = Math.max(0, green);
  blue = Math.max(0, blue);
  
  // Normalize scores to percentages  
  const total = red + yellow + green + blue;
  console.log("Positive DISC scores:", { red, yellow, green, blue, total });
  
  if (total > 0) {
    red = Math.round((red / total) * 100);
    yellow = Math.round((yellow / total) * 100);
    green = Math.round((green / total) * 100);
    blue = Math.round((blue / total) * 100);
    
    // Ensure percentages add up to 100
    const percentageTotal = red + yellow + green + blue;
    if (percentageTotal !== 100) {
      const difference = 100 - percentageTotal;
      const highest = Math.max(red, yellow, green, blue);
      if (red === highest) red += difference;
      else if (yellow === highest) yellow += difference;
      else if (green === highest) green += difference;
      else blue += difference;
    }
  } else {
    // Default balanced profile if no scoring occurred
    red = yellow = green = blue = 25;
  }
  
  console.log("Normalized DISC scores:", { red, yellow, green, blue });

  // Map traits across all dimensions
  const dominantTraits = getDimensionTraits('red', red);
  const influentialTraits = getDimensionTraits('yellow', yellow);
  const steadyTraits = getDimensionTraits('green', green);
  const conscientiousTraits = getDimensionTraits('blue', blue);

  const scores = [
    { type: 'red', value: red },
    { type: 'yellow', value: yellow },
    { type: 'green', value: green },
    { type: 'blue', value: blue }
  ].sort((a, b) => b.value - a.value);

  return {
    red,
    yellow,
    green,
    blue,
    dominantTraits,
    influentialTraits,
    steadyTraits,
    conscientiousTraits,
    workStyle: determineWorkStyle(scores),
    personalityType: generatePersonalityType(scores),
    communicationStyle: determineCommunicationStyle(scores),
    decisionMaking: determineDecisionMaking(scores),
    stressResponse: determineStressResponse(scores),
    teamRole: determineTeamRole(scores),
    leadership: determineLeadershipStyle(scores),
    completedAt: new Date(),
    pointsAwarded: 100 // Base points for completion
  };
}

function getDimensionTraits(dimension: string, score: number): string[] {
  const traits = {
    red: {
      high: ['Results-oriented', 'Decisive', 'Direct', 'Competitive', 'Independent'],
      medium: ['Goal-focused', 'Assertive', 'Task-oriented', 'Self-reliant'],
      low: ['Collaborative', 'Patient', 'Thoughtful', 'Team-oriented']
    },
    yellow: {
      high: ['Enthusiastic', 'Optimistic', 'People-focused', 'Persuasive', 'Expressive'],
      medium: ['Social', 'Communicative', 'Inspiring', 'Energetic'],
      low: ['Reflective', 'Reserved', 'Analytical', 'Cautious']
    },
    green: {
      high: ['Supportive', 'Patient', 'Reliable', 'Steady', 'Loyal'],
      medium: ['Cooperative', 'Helpful', 'Consistent', 'Diplomatic'],
      low: ['Adaptable', 'Fast-paced', 'Change-oriented', 'Flexible']
    },
    blue: {
      high: ['Analytical', 'Precise', 'Systematic', 'Quality-focused', 'Thorough'],
      medium: ['Organised', 'Detail-oriented', 'Methodical', 'Careful'],
      low: ['Spontaneous', 'Intuitive', 'Big-picture', 'Flexible']
    }
  };

  const dimensionTraits = traits[dimension as keyof typeof traits];
  if (!dimensionTraits) return [];

  if (score >= 30) return dimensionTraits.high;
  if (score >= 15) return dimensionTraits.medium;
  return dimensionTraits.low;
}

function determineWorkStyle(scores: { type: string; value: number }[]): string {
  const primary = scores[0];
  
  if (primary.type === 'red') return 'Results-oriented and fast-paced';
  if (primary.type === 'yellow') return 'Collaborative and people-focused';
  if (primary.type === 'green') return 'Steady and supportive';
  if (primary.type === 'blue') return 'Analytical and detail-oriented';
  
  return 'Adaptable and balanced';
}

function determineCommunicationStyle(scores: { type: string; value: number }[]): string {
  const primary = scores[0];
  
  if (primary.type === 'red') return 'Direct and assertive';
  if (primary.type === 'yellow') return 'Enthusiastic and expressive';
  if (primary.type === 'green') return 'Patient and diplomatic';
  if (primary.type === 'blue') return 'Precise and thoughtful';
  
  return 'Flexible and context-aware';
}

function determineDecisionMaking(scores: { type: string; value: number }[]): string {
  const primary = scores[0];
  
  if (primary.type === 'red') return 'Quick and decisive';
  if (primary.type === 'yellow') return 'Consultative and optimistic';
  if (primary.type === 'green') return 'Consensus-building and careful';
  if (primary.type === 'blue') return 'Research-based and systematic';
  
  return 'Situational and adaptive';
}

function determineStressResponse(scores: { type: string; value: number }[]): string {
  const primary = scores[0];
  
  if (primary.type === 'red') return 'Takes charge and pushes through';
  if (primary.type === 'yellow') return 'Seeks support from others';
  if (primary.type === 'green') return 'Withdraws and processes internally';
  if (primary.type === 'blue') return 'Analyses and plans systematically';
  
  return 'Uses multiple coping strategies';
}

function determineTeamRole(scores: { type: string; value: number }[]): string {
  const primary = scores[0];
  
  if (primary.type === 'red') return 'Driver and goal-setter';
  if (primary.type === 'yellow') return 'Motivator and relationship-builder';
  if (primary.type === 'green') return 'Supporter and stabilizer';
  if (primary.type === 'blue') return 'Analyser and quality controller';
  
  return 'Versatile team player';
}

function generatePersonalityType(scores: { type: string; value: number }[]): string {
  // Get the actual DISC values from the scores array
  const redScore = scores.find(s => s.type === 'red')?.value || 0;
  const yellowScore = scores.find(s => s.type === 'yellow')?.value || 0;
  const greenScore = scores.find(s => s.type === 'green')?.value || 0;
  const blueScore = scores.find(s => s.type === 'blue')?.value || 0;

  // Use the same logic as server routes for consistency
  // Check for specific combination types first
  if (blueScore >= 50 && redScore >= 30) {
    return "Methodical Achiever";
  }
  
  if (greenScore >= 50) {
    return "Reliable Foundation";
  }

  const [primary, secondary] = scores;
  
  // Special high combinations (both >= 40)
  if (primary.value >= 40 && secondary.value >= 40) {
    if (primary.type === 'red' && secondary.type === 'yellow') return "The Rocket Launcher";
    if (primary.type === 'yellow' && secondary.type === 'red') return "The People Champion";
    if (primary.type === 'red' && secondary.type === 'blue') return "The Strategic Ninja";
    if (primary.type === 'blue' && secondary.type === 'red') return "The Strategic Ninja";
    if (primary.type === 'yellow' && secondary.type === 'green') return "The Team Builder";
    if (primary.type === 'green' && secondary.type === 'yellow') return "The Team Builder";
  }

  // Single dominant types (>=50%)
  if (primary.value >= 50) {
    if (primary.type === 'red') return "The Results Machine";
    if (primary.type === 'yellow') return "The Social Butterfly";
    if (primary.type === 'green') return "The Steady Rock";
    if (primary.type === 'blue') return "The Quality Guardian";
  }

  // Moderate combinations (primary 30-49%, secondary 20+)
  if (primary.value >= 30 && secondary.value >= 20) {
    if (primary.type === 'red' && secondary.type === 'yellow') return "The Innovation Catalyst";
    if (primary.type === 'yellow' && secondary.type === 'red') return "The Creative Genius";
    if (primary.type === 'red' && secondary.type === 'blue') return "The Problem Solver";
    if (primary.type === 'blue' && secondary.type === 'red') return "The Problem Solver";
    if (primary.type === 'yellow' && secondary.type === 'green') return "The People Champion";
    if (primary.type === 'green' && secondary.type === 'yellow') return "The People Champion";
    if (primary.type === 'blue' && secondary.type === 'green') return "The Precision Master";
    if (primary.type === 'green' && secondary.type === 'blue') return "The Precision Master";
  }

  // Default for balanced profiles
  return "Balanced Professional";
}

function determineLeadershipStyle(scores: { type: string; value: number }[]): string {
  const primary = scores[0];
  
  if (primary.type === 'red') return 'Authoritative and results-focused';
  if (primary.type === 'yellow') return 'Inspirational and people-centered';
  if (primary.type === 'green') return 'Supportive and consensus-building';
  if (primary.type === 'blue') return 'Technical and process-oriented';
  
  return 'Situational and adaptive';
}

export function generatePersonalityInsights(profile: EnhancedDiscProfile): PersonalityInsights {
  const insights: PersonalityInsights = {
    strengths: [],
    challenges: [],
    idealWorkEnvironment: [],
    motivators: [],
    compatibleRoles: [],
    workingStylePreferences: []
  };

  // Generate insights based on all dimensions
  const allTraits = [
    ...profile.dominantTraits,
    ...profile.influentialTraits,
    ...profile.steadyTraits,
    ...profile.conscientiousTraits
  ];

  // Results-driven approach (high red)
  if (profile.red >= 35) {
    insights.strengths = ['Leadership', 'Decision-making', 'Goal-oriented', 'Problem-solving', 'Initiative', 'Results-driven', 'Direct communication'];
    insights.challenges = ['Impatience', 'Difficulty delegating', 'May seem blunt', 'Stress under micromanagement'];
    insights.idealWorkEnvironment = ['Autonomous', 'Results-focused', 'Fast-paced', 'Minimal supervision'];
    insights.motivators = ['Achievement', 'Control', 'Competition', 'Innovation', 'Authority'];
    insights.compatibleRoles = ['Leading projects and teams', 'Solving tough problems', 'Getting results fast', 'Making big changes happen'];
    
    // Add entrepreneurial contexts for very high red scores
    if (profile.red >= 45) {
      insights.compatibleRoles.push('Starting new things', 'Building teams from nothing', 'Trying new ways of doing things');
      insights.motivators.push('Independence', 'Creating something new');
      insights.strengths.push('Risk-taking', 'Vision', 'Drive');
    }
  }

  // People-focused approach (high yellow)
  if (profile.yellow >= 25) {
    insights.strengths.push(...['Communication', 'Enthusiasm', 'Team building', 'Creativity']);
    insights.challenges.push(...['Detail orientation', 'Follow-through']);
    insights.idealWorkEnvironment.push(...['Collaborative', 'Social', 'People-focused']);
    insights.motivators.push(...['Recognition', 'Social interaction', 'Variety']);
    insights.compatibleRoles.push(...['Making friends at work', 'Sharing ideas with others', 'Helping teams get along', 'Creative work with people']);
  }

  // Supportive approach (high green)
  if (profile.green >= 25) {
    insights.strengths.push(...['Reliability', 'Patience', 'Teamwork', 'Listening']);
    insights.challenges.push(...['Change adaptation', 'Assertiveness']);
    insights.idealWorkEnvironment.push(...['Supportive', 'Team-oriented', 'Stable']);
    insights.motivators.push(...['Security', 'Helping others', 'Teamwork']);
    insights.compatibleRoles.push(...['Helping team members', 'Keeping things consistent', 'Getting everyone to agree', 'Being reliable and helpful']);
  }

  // Analytical approach (high blue)
  if (profile.blue >= 30) {
    insights.strengths.push(...['Accuracy', 'Analysis', 'Planning', 'Quality focus']);
    insights.challenges.push(...['Perfectionism', 'Risk-taking']);
    insights.idealWorkEnvironment.push(...['Structured', 'Quality-focused', 'Clear standards']);
    insights.motivators.push(...['Quality', 'Expertise', 'Recognition for accuracy']);
    insights.compatibleRoles.push(...['Making sense of information', 'Making sure things are done right', 'Creating better systems', 'Keeping quality high']);
  }

  // Strategic combination (high red + blue)
  if (profile.red >= 45 && profile.blue >= 30) {
    insights.compatibleRoles.push('Planning big projects with detailed thinking', 'Leading teams with data and facts', 'Building better systems');
    insights.strengths.push('Strategic thinking', 'Analytical leadership', 'Data-driven decisions');
    insights.idealWorkEnvironment.push('Strategic planning environments', 'Analytical leadership roles');
    insights.motivators.push('Building systems', 'Optimizing performance');
  }

  // Deduplicate arrays using filter
  insights.strengths = insights.strengths.filter((item, index) => insights.strengths.indexOf(item) === index);
  insights.challenges = insights.challenges.filter((item, index) => insights.challenges.indexOf(item) === index);
  insights.idealWorkEnvironment = insights.idealWorkEnvironment.filter((item, index) => insights.idealWorkEnvironment.indexOf(item) === index);
  insights.motivators = insights.motivators.filter((item, index) => insights.motivators.indexOf(item) === index);
  insights.compatibleRoles = insights.compatibleRoles.filter((item, index) => insights.compatibleRoles.indexOf(item) === index);

  // For broad profiles, prioritise and combine compatible roles to keep it concise (max 4-5 items)
  if (insights.compatibleRoles.length > 5) {
    insights.compatibleRoles = prioritiseAndCombineRoles(profile, insights.compatibleRoles);
  }

  return insights;
}

// Helper function to prioritise and combine roles for broad profiles
function prioritiseAndCombineRoles(profile: EnhancedDiscProfile, allRoles: string[]): string[] {
  // Sort DISC dimensions by strength to prioritise
  const dimensions = [
    { type: 'blue', value: profile.blue, category: 'analytical' },
    { type: 'yellow', value: profile.yellow, category: 'people' },
    { type: 'green', value: profile.green, category: 'supportive' },
    { type: 'red', value: profile.red, category: 'leadership' }
  ].sort((a, b) => b.value - a.value);

  const prioritisedRoles: string[] = [];
  
  // Take the top 2 strongest dimensions and create combined roles
  const strongest = dimensions[0];
  const secondary = dimensions[1];
  
  if (strongest.type === 'blue' && secondary.type === 'yellow') {
    prioritisedRoles.push(
      'Making sense of information and sharing insights',
      'Creating better systems with team input',
      'Helping people understand complex things',
      'Building quality processes that work for everyone'
    );
  } else if (strongest.type === 'blue' && secondary.type === 'green') {
    prioritisedRoles.push(
      'Making sure things are done right consistently',
      'Supporting teams with reliable analysis',
      'Creating systems that help everyone succeed',
      'Keeping quality high while helping others'
    );
  } else if (strongest.type === 'yellow' && secondary.type === 'green') {
    prioritisedRoles.push(
      'Helping teams get along and work well together',
      'Making friends whilst being reliable',
      'Supporting people with creative solutions',
      'Building consensus through good communication'
    );
  } else if (strongest.type === 'red' && secondary.type === 'blue') {
    prioritisedRoles.push(
      'Leading projects with detailed thinking',
      'Making decisions based on facts and data',
      'Getting results whilst maintaining quality',
      'Solving problems systematically'
    );
  } else {
    // For other combinations, pick the most representative roles from each category
    const rolesByCategory: { [key: string]: string[] } = {
      analytical: ['Making sense of information', 'Creating better systems'],
      people: ['Making friends at work', 'Helping teams get along'],
      supportive: ['Being reliable and helpful', 'Keeping things consistent'],
      leadership: ['Leading projects and teams', 'Getting results fast']
    };
    
    // Add one role from strongest category, one from secondary, plus balanced combinations
    if (rolesByCategory[strongest.category]) {
      prioritisedRoles.push(rolesByCategory[strongest.category][0]);
    }
    if (rolesByCategory[secondary.category]) {
      prioritisedRoles.push(rolesByCategory[secondary.category][0]);
    }
    
    // Add 2-3 combined roles based on the profile balance
    prioritisedRoles.push(
      'Working with information and people together',
      'Supporting teams whilst maintaining quality'
    );
  }
  
  return prioritisedRoles.slice(0, 4); // Always return exactly 4 roles
}

// Helper functions to get primary/secondary DISC types
function getTopDiscType(profile: EnhancedDiscProfile): string {
  const dimensions = [
    { type: 'red', value: profile.red },
    { type: 'yellow', value: profile.yellow },
    { type: 'green', value: profile.green },
    { type: 'blue', value: profile.blue }
  ];
  dimensions.sort((a, b) => b.value - a.value);
  return dimensions[0].type;
}

function getSecondaryDiscType(profile: EnhancedDiscProfile): string {
  const dimensions = [
    { type: 'red', value: profile.red },
    { type: 'yellow', value: profile.yellow },
    { type: 'green', value: profile.green },
    { type: 'blue', value: profile.blue }
  ];
  dimensions.sort((a, b) => b.value - a.value);
  return dimensions[1].type;
}

// Compatibility scoring for job matching
export function calculateBehavioralCompatibility(
  candidateProfile: EnhancedDiscProfile,
  jobRequirements: {
    preferredProfiles: string[];
    workStyle: string;
    teamDynamics: string;
    communicationNeeds: string;
  }
): number {
  let compatibility = 0;

  // Primary profile match (40% weight) - using computed profile types
  const primaryType = getTopDiscType(candidateProfile);
  const secondaryType = getSecondaryDiscType(candidateProfile);
  
  if (jobRequirements.preferredProfiles.includes(primaryType)) {
    compatibility += 40;
  } else if (jobRequirements.preferredProfiles.includes(secondaryType)) {
    compatibility += 25;
  }

  // Work style compatibility (30% weight) - simplified for now
  compatibility += 15; // Default moderate compatibility

  // Communication style compatibility (20% weight) - simplified for now
  compatibility += 10; // Default moderate compatibility

  // Team dynamics fit (10% weight) - simplified for now
  compatibility += 5; // Default moderate compatibility
  
  return Math.min(100, Math.max(0, compatibility));
}

function calculateStyleMatch(candidateStyle: string, requirement: string): number {
  // Simple keyword matching - can be enhanced with ML
  const candidateKeywords = candidateStyle.toLowerCase().split(' ');
  const requirementKeywords = requirement.toLowerCase().split(' ');
  
  let matches = 0;
  for (const keyword of candidateKeywords) {
    if (requirementKeywords.some(req => req.includes(keyword) || keyword.includes(req))) {
      matches++;
    }
  }
  
  return Math.min(100, (matches / Math.max(candidateKeywords.length, requirementKeywords.length)) * 100);
}

// Generate summary content using central behavioral profiles database
export function generateDiscSummary(profile: EnhancedDiscProfile): any {
  // Get content from the central behavioral profiles database
  const behavioralProfile = behavioralProfiles[profile.personalityType];
  if (behavioralProfile) {
    return {
      personalityType: profile.personalityType,
      headline: behavioralProfile.headline,
      summary: behavioralProfile.summary,
      description: behavioralProfile.description,
      shortDiscStatement: behavioralProfile.shortDiscStatement,
      keyStrengths: behavioralProfile.keyStrengths
    };
  }
  
  // Fallback if personality type not found in database
  return {
    personalityType: profile.personalityType,
    headline: profile.personalityType,
    summary: `${profile.personalityType} - A unique combination of traits.`,
    description: "This profile represents a distinctive blend of behavioral characteristics.",
    shortDiscStatement: "Balanced approach",
    keyStrengths: [
      { title: "Adaptability", description: "Able to adjust approach based on situation" },
      { title: "Balance", description: "Brings multiple perspectives to challenges" },
      { title: "Versatility", description: "Comfortable in various work environments" }
    ]
  };
}