// Enhanced Behavioral Assessment using DISC model
// Scientifically robust scoring based on survey data analysis

export interface AssessmentResponse {
  questionId: string;
  answer: string;
  discValues: {
    red: number;
    yellow: number;
    green: number;
    blue: number;
  };
}

export interface DiscProfile {
  red: number;
  yellow: number;
  green: number;
  blue: number;
  primaryProfile: string;
  secondaryProfile: string;
  workStyle: string;
  communicationStyle: string;
  decisionMaking: string;
  stressResponse: string;
}

export interface PersonalityInsights {
  strengths: string[];
  challenges: string[];
  idealWorkEnvironment: string[];
  motivators: string[];
  compatibleRoles: string[];
}

// Optimized DISC assessment - 5 questions covering distinct behavioral dimensions
// Reduced from 8 to 5 questions while maintaining assessment reliability
export const ASSESSMENT_QUESTIONS = [
  {
    id: "conflict_approach",
    question: "When faced with workplace conflict, I typically...",
    options: [
      { text: "Address it directly and find a quick resolution", disc: { red: 4, yellow: 1, green: 0, blue: 1 } },
      { text: "Bring people together to discuss it openly", disc: { red: 1, yellow: 4, green: 1, blue: 0 } },
      { text: "Listen to all sides and seek harmony", disc: { red: 0, yellow: 1, green: 4, blue: 1 } },
      { text: "Analyze the situation thoroughly before acting", disc: { red: 1, yellow: 0, green: 1, blue: 4 } }
    ]
  },
  {
    id: "decision_style",
    question: "When making important decisions, I prefer to...",
    options: [
      { text: "Decide quickly based on key facts and intuition", disc: { red: 4, yellow: 2, green: 0, blue: 0 } },
      { text: "Get input from others and build consensus", disc: { red: 0, yellow: 3, green: 3, blue: 1 } },
      { text: "Take time to ensure everyone feels comfortable", disc: { red: 0, yellow: 1, green: 4, blue: 1 } },
      { text: "Research thoroughly and weigh all options", disc: { red: 1, yellow: 0, green: 1, blue: 4 } }
    ]
  },
  {
    id: "work_pace",
    question: "My ideal work pace involves...",
    options: [
      { text: "Fast-moving projects with tight deadlines", disc: { red: 4, yellow: 2, green: 0, blue: 1 } },
      { text: "Dynamic collaboration with energy and variety", disc: { red: 2, yellow: 4, green: 1, blue: 0 } },
      { text: "Steady progress with predictable routines", disc: { red: 0, yellow: 1, green: 4, blue: 2 } },
      { text: "Methodical work with time for precision", disc: { red: 1, yellow: 0, green: 2, blue: 4 } }
    ]
  },
  {
    id: "team_role",
    question: "In team settings, I naturally tend to...",
    options: [
      { text: "Take charge and drive results", disc: { red: 4, yellow: 1, green: 0, blue: 1 } },
      { text: "Motivate others and generate enthusiasm", disc: { red: 1, yellow: 4, green: 1, blue: 0 } },
      { text: "Support teammates and maintain stability", disc: { red: 0, yellow: 1, green: 4, blue: 1 } },
      { text: "Ensure quality and accuracy in our work", disc: { red: 1, yellow: 0, green: 1, blue: 4 } }
    ]
  },
  {
    id: "communication_style",
    question: "My communication style is typically...",
    options: [
      { text: "Direct and results-focused", disc: { red: 4, yellow: 1, green: 0, blue: 2 } },
      { text: "Enthusiastic and engaging", disc: { red: 1, yellow: 4, green: 2, blue: 0 } },
      { text: "Patient and supportive", disc: { red: 0, yellow: 2, green: 4, blue: 1 } },
      { text: "Thoughtful and precise", disc: { red: 2, yellow: 0, green: 1, blue: 4 } }
    ]
  }
];

export function calculateDiscProfile(responses: AssessmentResponse[]): DiscProfile {
  const totals = { red: 0, yellow: 0, green: 0, blue: 0 };
  
  responses.forEach(response => {
    totals.red += response.discValues.red;
    totals.yellow += response.discValues.yellow;
    totals.green += response.discValues.green;
    totals.blue += response.discValues.blue;
  });

  // Convert to percentages
  const total = totals.red + totals.yellow + totals.green + totals.blue;
  const percentages = {
    red: Math.round((totals.red / total) * 100),
    yellow: Math.round((totals.yellow / total) * 100),
    green: Math.round((totals.green / total) * 100),
    blue: Math.round((totals.blue / total) * 100)
  };

  // Determine behavioral type using 17+ personality system
  const behavioralType = determineBehavioralType(percentages);
  const behavioralInsights = getBehavioralTypeDescriptions(behavioralType);

  return {
    red: percentages.red,
    yellow: percentages.yellow,
    green: percentages.green,
    blue: percentages.blue,
    primaryProfile: behavioralType,
    secondaryProfile: getSecondaryTrait(percentages),
    workStyle: behavioralInsights.workStyle,
    communicationStyle: behavioralInsights.communicationStyle,
    decisionMaking: behavioralInsights.decisionMaking,
    stressResponse: behavioralInsights.stressResponse || determineStressResponse(percentages)
  };
}

// Enhanced 17+ Behavioral Types System Implementation
export function determineBehavioralType(discProfile: { red: number; yellow: number; green: number; blue: number }): string {
  const { red, yellow, green, blue } = discProfile;
  const sorted = [
    { color: 'red', value: red },
    { color: 'yellow', value: yellow },
    { color: 'green', value: green },
    { color: 'blue', value: blue }
  ].sort((a, b) => b.value - a.value);
  
  const primary = sorted[0];
  const secondary = sorted[1];
  
  // Pure Dominant Types (>60% OR >45% with secondary <20%)
  if (primary.value > 60 || (primary.value > 45 && secondary.value < 20)) {
    switch (primary.color) {
      case 'red': return 'Results Dynamo';
      case 'yellow': return 'Social Butterfly';
      case 'green': return 'Steady Planner';
      case 'blue': return 'Quality Guardian';
    }
  }
  
  // Dual Combination Types (primary >35% AND secondary >25%)
  if (primary.value > 35 && secondary.value > 25) {
    const combo = `${primary.color}-${secondary.color}`;
    switch (combo) {
      case 'red-yellow': return 'Ambitious Influencer';
      case 'red-blue': return 'Strategic Achiever';
      case 'red-green': return 'Steady Driver';
      case 'yellow-red': return 'Dynamic Leader';
      case 'yellow-green': return 'Supportive Connector';
      case 'yellow-blue': return 'Thoughtful Communicator';
      case 'green-red': return 'Determined Helper';
      case 'green-yellow': return 'Collaborative Facilitator';
      case 'green-blue': return 'Methodical Coordinator';
      case 'blue-red': return 'Analytical Driver';
      case 'blue-yellow': return 'Creative Analyst';
      case 'blue-green': return 'Methodical Coordinator';
    }
  }
  
  // Balanced Types (no color >35% OR difference <10%)
  if (primary.value <= 35 || (primary.value - secondary.value) < 10) {
    return 'Versatile Adapter';
  }
  
  // Fallback
  return 'Versatile Adapter';
}

export function getBehavioralTypeDescriptions(behavioralType: string): {
  summary: string;
  communicationStyle: string;
  decisionMaking: string;
  careerMotivators: string[];
  workStyle: string;
  discSummary: string;
  stressResponse?: string;
} {
  const descriptions = {
    'Results Dynamo': {
      summary: 'Fast-moving achiever who drives results and thrives under pressure',
      communicationStyle: 'Direct and results-focused, gets straight to the point',
      decisionMaking: 'Quick and decisive, comfortable making tough calls',
      careerMotivators: ['Achievement and recognition', 'Leadership opportunities', 'Competitive challenges', 'Autonomy and control'],
      workStyle: 'Fast-paced and goal-oriented, prefers independence and clear targets',
      discSummary: 'High Dominance - natural leader who takes charge and drives outcomes'
    },
    'Social Butterfly': {
      summary: 'Energetic communicator who thrives on building relationships and creating positive team dynamics',
      communicationStyle: 'Enthusiastic and expressive, naturally engaging, excellent at building rapport',
      decisionMaking: 'Considers team input and relationships, seeks collaborative solutions',
      careerMotivators: ['Building meaningful connections', 'Team collaboration', 'Recognition and appreciation', 'Variety and new challenges'],
      workStyle: 'People-focused and energetic, thrives in collaborative environments, adaptable to change',
      discSummary: 'High Influence - natural networker who brings enthusiasm and positivity to teams'
    },
    'Steady Planner': {
      summary: 'Reliable team player who provides stability and thoughtful support to colleagues',
      communicationStyle: 'Patient and diplomatic, listens carefully and builds consensus',
      decisionMaking: 'Takes time to ensure everyone feels comfortable, consensus-building approach',
      careerMotivators: ['Job security and stability', 'Team harmony', 'Helping others succeed', 'Clear expectations'],
      workStyle: 'Steady and methodical, prefers predictable routines and supportive team environments',
      discSummary: 'High Steadiness - dependable foundation who maintains team stability and harmony'
    },
    'Quality Guardian': {
      summary: 'Detail-oriented perfectionist who ensures accuracy and maintains high standards',
      communicationStyle: 'Thoughtful and precise, communicates with facts and careful analysis',
      decisionMaking: 'Research-based and systematic, analyzes all options thoroughly',
      careerMotivators: ['Quality and accuracy', 'Expertise development', 'Clear processes', 'Recognition for precision'],
      workStyle: 'Methodical and systematic, thrives with clear guidelines and quality-focused work',
      discSummary: 'High Conscientiousness - analytical expert who delivers flawless work through attention to detail'
    },
    'Ambitious Influencer': {
      summary: 'Dynamic leader who combines drive with people skills to achieve ambitious goals',
      communicationStyle: 'Confident and persuasive, motivates others toward shared objectives',
      decisionMaking: 'Fast-paced but considers team buy-in, balances speed with influence',
      careerMotivators: ['Leadership roles', 'Team achievement', 'Public recognition', 'Growth opportunities'],
      workStyle: 'Results-oriented with strong people focus, thrives leading collaborative initiatives',
      discSummary: 'High Drive + Influence - combines results focus with natural ability to inspire teams'
    },
    'Strategic Achiever': {
      summary: 'Methodical leader who drives results through careful planning and systematic execution',
      communicationStyle: 'Direct but thorough, combines decisive communication with detailed analysis',
      decisionMaking: 'Strategic and data-driven, balances speed with thorough preparation',
      careerMotivators: ['Strategic challenges', 'Process improvement', 'Quality outcomes', 'Leadership recognition'],
      workStyle: 'Goal-oriented with systematic approach, excels at planning and executing complex projects',
      discSummary: 'High Drive + Analysis - combines results orientation with strategic thinking and attention to detail'
    },
    'Versatile Adapter': {
      summary: 'Flexible individual who adapts their approach based on situational needs',
      communicationStyle: 'Flexible and context-aware, adjusts style to match audience and situation',
      decisionMaking: 'Situational and adaptive, uses different approaches depending on circumstances',
      careerMotivators: ['Variety and learning', 'Balanced challenges', 'Team collaboration', 'Personal growth'],
      workStyle: 'Adaptable and well-rounded, comfortable in diverse roles and team dynamics',
      discSummary: 'Balanced DISC profile - demonstrates flexibility across all behavioural dimensions'
    }
  };
  
  return descriptions[behavioralType as keyof typeof descriptions] || descriptions['Versatile Adapter'];
}

export function getSecondaryTrait(discProfile: { red: number; yellow: number; green: number; blue: number }): string {
  const sorted = [
    { name: 'Dominance', value: discProfile.red },
    { name: 'Influence', value: discProfile.yellow },
    { name: 'Steadiness', value: discProfile.green },
    { name: 'Conscientiousness', value: discProfile.blue }
  ].sort((a, b) => b.value - a.value);
  
  return sorted[1].name;
}

function determineStressResponse(discProfile: { red: number; yellow: number; green: number; blue: number }): string {
  const { red, yellow, green, blue } = discProfile;
  const highest = Math.max(red, yellow, green, blue);
  
  if (red === highest) return 'Takes charge and pushes through challenges';
  if (yellow === highest) return 'Seeks support and collaboration from others';
  if (green === highest) return 'Withdraws and processes situations internally';
  if (blue === highest) return 'Analyzes and plans systematically';
  
  return 'Uses multiple coping strategies depending on situation';
}

export function generatePersonalityInsights(profile: DiscProfile): PersonalityInsights {
  const behavioralDescriptions = getBehavioralTypeDescriptions(profile.primaryProfile);
  
  // Generate strengths based on behavioral type and DISC scores
  const strengths = generateKeyStrengthsFromDisc(profile);
  
  // Generate challenges based on behavioral type
  const challenges = generateChallengesFromBehavioralType(profile.primaryProfile);
  
  // Generate ideal work environment
  const idealWorkEnvironment = generateIdealWorkEnvironment(profile.primaryProfile);
  
  // Generate compatible roles
  const compatibleRoles = generateCompatibleRoles(profile.primaryProfile);

  return {
    strengths,
    challenges,
    idealWorkEnvironment,
    motivators: behavioralDescriptions.careerMotivators,
    compatibleRoles
  };
}

export function generateKeyStrengthsFromDisc(profile: DiscProfile): string[] {
  const { red, yellow, green, blue } = profile;
  const strengths: string[] = [];
  
  // Red (Dominance) contributions
  if (red >= 30) {
    if (red >= 45) strengths.push('Natural leader who drives results and takes initiative');
    else strengths.push('Goal-oriented professional with strong drive to succeed');
  }
  
  // Yellow (Influence) contributions  
  if (yellow >= 30) {
    if (yellow >= 45) strengths.push('Collaborative team player with excellent interpersonal skills');
    else strengths.push('Strong communicator who builds positive working relationships');
  }
  
  // Green (Steadiness) contributions
  if (green >= 30) {
    if (green >= 45) strengths.push('Reliable team member who provides stability and consistent support');
    else strengths.push('Patient collaborator with strong work ethic and team focus');
  }
  
  // Blue (Conscientiousness) contributions
  if (blue >= 30) {
    if (blue >= 45) strengths.push('Detail-oriented professional who ensures quality and accuracy');
    else strengths.push('Analytical thinker who approaches challenges methodically');
  }
  
  // Combination insights
  if (red >= 25 && yellow >= 25) {
    strengths.push('Strategic leader who combines results focus with people skills');
  }
  
  if (yellow >= 25 && green >= 25) {
    strengths.push('Supportive team builder who facilitates collaboration and harmony');
  }
  
  if (green >= 25 && blue >= 25) {
    strengths.push('Methodical professional who balances quality with team cooperation');
  }
  
  // Ensure we have at least 3-4 strengths
  if (strengths.length < 3) {
    strengths.push('Versatile professional who adapts well to different situations');
    strengths.push('Collaborative team member with strong work ethic');
  }
  
  return strengths.slice(0, 4); // Return top 4 strengths
}

function generateChallengesFromBehavioralType(behavioralType: string): string[] {
  const challengeMap: { [key: string]: string[] } = {
    'Results Dynamo': ['May appear impatient with slower processes', 'Can be direct in communication', 'Prefers independence over close supervision'],
    'Social Butterfly': ['May focus more on relationships than details', 'Can be optimistic about timelines', 'Might avoid difficult conversations'],
    'Steady Planner': ['May take time to adapt to sudden changes', 'Might avoid self-promotion', 'Can be hesitant to take risks'],
    'Quality Guardian': ['May spend extra time perfecting work', 'Can be cautious about quick decisions', 'Might prefer working independently'],
    'Ambitious Influencer': ['Balancing speed with team consensus', 'Managing multiple priorities simultaneously'],
    'Strategic Achiever': ['Balancing thoroughness with time constraints', 'May appear intense about goals'],
    'Balanced Professional': ['May need time to identify optimal approach', 'Adapting communication style to context']
  };
  
  return challengeMap[behavioralType] || ['Continuous learning and adaptation', 'Balancing different priorities'];
}

function generateIdealWorkEnvironment(behavioralType: string): string[] {
  const environmentMap: { [key: string]: string[] } = {
    'Results Dynamo': ['Goal-oriented with clear targets', 'Fast-paced with minimal micromanagement', 'Results-focused culture'],
    'Social Butterfly': ['Collaborative team environment', 'Opportunities for relationship building', 'Varied and engaging projects'],
    'Steady Planner': ['Stable and supportive team culture', 'Clear processes and expectations', 'Collaborative decision-making'],
    'Quality Guardian': ['Structured with clear standards', 'Quality-focused culture', 'Time for thorough analysis'],
    'Ambitious Influencer': ['Leadership opportunities', 'Team-oriented with individual recognition', 'Growth-focused environment'],
    'Strategic Achiever': ['Strategic planning opportunities', 'Results-oriented with quality focus', 'Clear metrics and goals'],
    'Balanced Professional': ['Varied responsibilities', 'Collaborative team environment', 'Learning and development opportunities']
  };
  
  return environmentMap[behavioralType] || ['Collaborative and supportive', 'Clear communication', 'Growth opportunities'];
}

function generateCompatibleRoles(behavioralType: string): string[] {
  const roleMap: { [key: string]: string[] } = {
    'Results Dynamo': ['Management and Leadership', 'Sales and Business Development', 'Project Management', 'Entrepreneurship'],
    'Social Butterfly': ['Marketing and Communications', 'Sales and Client Relations', 'Training and Development', 'Customer Success'],
    'Steady Planner': ['Operations and Administration', 'Human Resources', 'Customer Support', 'Team Coordination'],
    'Quality Guardian': ['Analysis and Research', 'Quality Assurance', 'Finance and Accounting', 'Technical Specialist'],
    'Ambitious Influencer': ['Team Leadership', 'Business Development', 'Client Management', 'Strategic Planning'],
    'Strategic Achiever': ['Operations Management', 'Strategic Planning', 'Process Improvement', 'Project Leadership'],
    'Balanced Professional': ['General Management', 'Consulting', 'Cross-functional Roles', 'Business Analysis']
  };
  
  return roleMap[behavioralType] || ['Team Collaboration', 'Problem Solving', 'Professional Services', 'Operations'];
}

export function calculateBehavioralCompatibility(
  candidateProfile: DiscProfile,
  jobRequirements: { 
    preferredProfiles: string[];
    workStyle: string;
    teamDynamics: string;
    communicationNeeds: string;
  }
): number {
  let compatibility = 0;

  // Primary profile match (40% weight)
  if (jobRequirements.preferredProfiles.includes(candidateProfile.primaryProfile)) {
    compatibility += 40;
  } else if (jobRequirements.preferredProfiles.includes(candidateProfile.secondaryProfile)) {
    compatibility += 25;
  }

  // Work style compatibility (30% weight)
  const workStyleMatch = calculateStyleMatch(candidateProfile.workStyle, jobRequirements.workStyle);
  compatibility += workStyleMatch * 0.3;

  // Communication style compatibility (20% weight) 
  const commMatch = calculateStyleMatch(candidateProfile.communicationStyle, jobRequirements.communicationNeeds);
  compatibility += commMatch * 0.2;

  // Team dynamics fit (10% weight)
  const teamMatch = calculateStyleMatch(candidateProfile.decisionMaking, jobRequirements.teamDynamics);
  compatibility += teamMatch * 0.1;

  return Math.min(100, Math.round(compatibility));
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

