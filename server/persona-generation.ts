import { DiscProfile } from './enhanced-disc-assessment';

export interface PersonaData {
  id: string;
  name: string;
  description: string;
  roleType: string;
  discProfile: {
    red: number;
    yellow: number; 
    green: number;
    blue: number;
  };
  keyTraits: PersonaTrait[];
  mindset: PersonaMindset;
  skillsMatch: string[];
  redFlags: string[];
  roleAlignmentScore: number;
  generatedAt: Date;
}

export interface PersonaTrait {
  title: string;
  description: string;
  sourceCheckpoint: string;
  icon: string;
  color: string;
}

export interface PersonaMindset {
  thrivesOn: string;
  motivatedBy: string;
  approach: string;
  growthStyle: string;
}

export interface CheckpointData {
  checkpoint1: JobPostingData;
  checkpoint2: RoleContextData;
  checkpoint3: RoleSpecificData;
  checkpoint4: ScenarioData;
  checkpoint5: ChallengeCalibrationData;
}

export interface JobPostingData {
  roleTitle: string;
  keyTasks: string[];
  workEnvironment: string;
  teamSize: string;
  clientFacing: boolean;
}

export interface RoleContextData {
  communicationStyle: string;
  workPace: string;
  autonomyLevel: string;
  feedbackPreference: string;
  teamDynamics: string;
}

export interface RoleSpecificData {
  qualityStandards: string[];
  attentionToDetail: string;
  errorHandling: string;
  processApproach: string;
}

export interface ScenarioData {
  pressureResponse: string;
  multitaskingAbility: string;
  decisionMaking: string;
  communicationBreakdown: string;
}

export interface ChallengeCalibrationData {
  difficulty: string;
  timeExpectation: string;
  assessmentFocus: string[];
  customRequirements: string;
}

// Persona name templates based on role characteristics
const PERSONA_TEMPLATES = {
  collaborative_coordinator: {
    name: "The Collaborative Coordinator",
    description: "Naturally organized and client-focused, this person brings reliability to fast-paced environments while maintaining the personal touch that builds lasting relationships.",
    keyWords: ["organized", "client-focused", "reliable", "relationship-building"]
  },
  strategic_problem_solver: {
    name: "The Strategic Problem-Solver", 
    description: "Analytically-minded with strong attention to detail, this person approaches challenges systematically while maintaining clear communication with stakeholders.",
    keyWords: ["analytical", "systematic", "detail-oriented", "problem-solving"]
  },
  creative_catalyst: {
    name: "The Creative Catalyst",
    description: "Imaginative and adaptable, this person brings fresh perspectives to projects while ensuring deliverables meet high standards and deadlines.",
    keyWords: ["creative", "adaptable", "innovative", "deadline-focused"]
  },
  reliable_organizer: {
    name: "The Reliable Organiser",
    description: "Process-oriented and methodical, this person excels at managing multiple moving parts while maintaining quality and keeping everyone informed.",
    keyWords: ["process-oriented", "methodical", "multi-tasking", "communication"]
  },
  growth_minded_connector: {
    name: "The Growth-Minded Connector",
    description: "Relationship-focused with genuine enthusiasm for learning, this person builds bridges between people while continuously developing their skills.",
    keyWords: ["relationship-focused", "learning-oriented", "bridge-building", "development"]
  }
};

export function generatePersona(checkpointData: CheckpointData): PersonaData {
  // Determine persona type based on role characteristics
  const personaType = determinePersonaType(checkpointData);
  const template = PERSONA_TEMPLATES[personaType];
  
  // Calculate DISC profile based on role requirements
  const discProfile = calculateIdealDiscProfile(checkpointData);
  
  // Generate key traits from checkpoint responses
  const keyTraits = generateKeyTraits(checkpointData);
  
  // Create mindset based on role context
  const mindset = generateMindset(checkpointData, personaType);
  
  // Extract skills and red flags
  const skillsMatch = extractSkillsMatch(checkpointData);
  const redFlags = generateRedFlags(checkpointData);
  
  // Calculate role alignment score
  const roleAlignmentScore = calculateRoleAlignment(checkpointData);
  
  return {
    id: generatePersonaId(),
    name: template.name,
    description: template.description,
    roleType: checkpointData.checkpoint1.roleTitle,
    discProfile,
    keyTraits,
    mindset,
    skillsMatch,
    redFlags,
    roleAlignmentScore,
    generatedAt: new Date()
  };
}

function determinePersonaType(data: CheckpointData): keyof typeof PERSONA_TEMPLATES {
  const { keyTasks, clientFacing, teamSize } = data.checkpoint1;
  const { communicationStyle, teamDynamics } = data.checkpoint2;
  
  // Analyze key indicators
  const isClientFacing = clientFacing || communicationStyle.includes('client');
  const isCollaborative = teamDynamics.includes('collaborative') || parseInt(teamSize) > 3;
  const isCreative = keyTasks.some(task => 
    task.includes('creative') || task.includes('design') || task.includes('content')
  );
  const isAnalytical = keyTasks.some(task =>
    task.includes('analysis') || task.includes('data') || task.includes('research')
  );
  const isOrganizational = keyTasks.some(task =>
    task.includes('project') || task.includes('coordination') || task.includes('organization')
  );
  
  // Decision logic for persona type
  if (isClientFacing && isCollaborative && isOrganizational) {
    return 'collaborative_coordinator';
  } else if (isAnalytical && !isCreative) {
    return 'strategic_problem_solver';
  } else if (isCreative) {
    return 'creative_catalyst';
  } else if (isOrganizational && !isClientFacing) {
    return 'reliable_organizer';
  } else {
    return 'growth_minded_connector';
  }
}

function calculateIdealDiscProfile(data: CheckpointData): { red: number; yellow: number; green: number; blue: number } {
  const { keyTasks, clientFacing } = data.checkpoint1;
  const { communicationStyle, autonomyLevel } = data.checkpoint2;
  const { pressureResponse, decisionMaking } = data.checkpoint4;
  
  let red = 10; // Base dominance
  let yellow = 20; // Base influence  
  let green = 35; // Base steadiness
  let blue = 35; // Base conscientiousness
  
  // Adjust based on role requirements
  if (clientFacing || communicationStyle.includes('frequent')) {
    yellow += 15;
    green += 5;
    red -= 5;
    blue -= 15;
  }
  
  if (autonomyLevel.includes('high') || decisionMaking.includes('independent')) {
    red += 10;
    blue += 5;
    green -= 10;
    yellow -= 5;
  }
  
  if (keyTasks.some(task => task.includes('quality') || task.includes('detail'))) {
    blue += 10;
    red -= 5;
    yellow -= 5;
  }
  
  if (pressureResponse.includes('calm') || keyTasks.some(task => task.includes('support'))) {
    green += 10;
    red -= 10;
  }
  
  // Normalize to ensure they sum to 100
  const total = red + yellow + green + blue;
  return {
    red: Math.round((red / total) * 100),
    yellow: Math.round((yellow / total) * 100),
    green: Math.round((green / total) * 100), 
    blue: Math.round((blue / total) * 100)
  };
}

function generateKeyTraits(data: CheckpointData): PersonaTrait[] {
  const traits: PersonaTrait[] = [];
  
  // Trait 1: From communication/client focus
  if (data.checkpoint1.clientFacing || data.checkpoint2.communicationStyle.includes('client')) {
    traits.push({
      title: "Client Relationship Builder",
      description: "Naturally develops rapport while maintaining professional boundaries",
      sourceCheckpoint: "From your Checkpoint 2 responses",
      icon: "💬",
      color: "#f59e0b"
    });
  }
  
  // Trait 2: From pressure/scenario responses  
  if (data.checkpoint4.pressureResponse.includes('proactive') || data.checkpoint4.communicationBreakdown.includes('anticipate')) {
    traits.push({
      title: "Proactive Communicator", 
      description: "Anticipates issues and provides regular updates without prompting",
      sourceCheckpoint: "From your Checkpoint 4 scenarios",
      icon: "⚡",
      color: "#3b82f6"
    });
  }
  
  // Trait 3: From quality standards
  if (data.checkpoint3.qualityStandards.length > 0 || data.checkpoint3.attentionToDetail.includes('high')) {
    traits.push({
      title: "Quality-Conscious",
      description: "Takes personal pride in error-free, professional deliverables", 
      sourceCheckpoint: "From your Checkpoint 3 standards",
      icon: "🎯",
      color: "#16a34a"
    });
  }
  
  return traits.slice(0, 3); // Return top 3 traits
}

function generateMindset(data: CheckpointData, personaType: keyof typeof PERSONA_TEMPLATES): PersonaMindset {
  const mindsets = {
    collaborative_coordinator: {
      thrivesOn: "Building genuine connections while delivering results",
      motivatedBy: "Making a positive impact through organized teamwork", 
      approach: "Let me understand your needs, then exceed expectations",
      growthStyle: "Learns through feedback and relationship building"
    },
    strategic_problem_solver: {
      thrivesOn: "Analyzing complex challenges and finding elegant solutions",
      motivatedBy: "Solving problems that make real business impact",
      approach: "Research thoroughly, then act decisively with clear reasoning",
      growthStyle: "Learns through systematic analysis and experimentation"
    },
    creative_catalyst: {
      thrivesOn: "Bringing fresh ideas to life while meeting practical constraints",
      motivatedBy: "Creating work that resonates and drives engagement",  
      approach: "Explore possibilities, then craft solutions that inspire",
      growthStyle: "Learns through creative exploration and constructive feedback"
    },
    reliable_organizer: {
      thrivesOn: "Creating order from chaos and keeping everything on track",
      motivatedBy: "Enabling others to succeed through solid foundations",
      approach: "Plan systematically, communicate clearly, deliver consistently", 
      growthStyle: "Learns through process improvement and structured development"
    },
    growth_minded_connector: {
      thrivesOn: "Helping people and ideas come together successfully",
      motivatedBy: "Personal growth while contributing to team success",
      approach: "Listen actively, learn continuously, contribute meaningfully",
      growthStyle: "Learns through relationship building and diverse experiences"
    }
  };
  
  return mindsets[personaType];
}

function extractSkillsMatch(data: CheckpointData): string[] {
  const skills: string[] = [];
  
  // Extract from key tasks
  data.checkpoint1.keyTasks.forEach(task => {
    if (task.includes('client') || task.includes('communication')) {
      skills.push('Client Relations');
    }
    if (task.includes('project') || task.includes('coordination')) {
      skills.push('Project Coordination');  
    }
    if (task.includes('social media')) {
      skills.push('Social Media Mgmt');
    }
    if (task.includes('quality') || task.includes('review')) {
      skills.push('Quality Control');
    }
  });
  
  return Array.from(new Set(skills)); // Remove duplicates
}

function generateRedFlags(data: CheckpointData): string[] {
  const redFlags: string[] = [];
  
  if (data.checkpoint4.multitaskingAbility.includes('struggle')) {
    redFlags.push('Poor multitaskers');
  }
  
  if (data.checkpoint1.clientFacing && data.checkpoint2.communicationStyle.includes('frequent')) {
    redFlags.push('Communication-averse candidates');
  }
  
  if (data.checkpoint3.qualityStandards.length > 2) {
    redFlags.push('Detail-neglecting applicants');
  }
  
  return redFlags;
}

function calculateRoleAlignment(data: CheckpointData): number {
  let score = 85; // Base score
  
  // Boost score based on completeness and specificity
  if (data.checkpoint1.keyTasks.length >= 3) score += 3;
  if (data.checkpoint2.communicationStyle.length > 50) score += 2;
  if (data.checkpoint3.qualityStandards.length >= 2) score += 3;
  if (data.checkpoint4.pressureResponse.length > 100) score += 4;
  if (data.checkpoint5.customRequirements.length > 0) score += 3;
  
  return Math.min(score, 98); // Cap at 98%
}

function generatePersonaId(): string {
  return `persona_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function getPersonaVisualizationData(persona: PersonaData) {
  return {
    name: persona.name,
    description: persona.description,
    roleType: persona.roleType,
    alignmentScore: persona.roleAlignmentScore,
    discProfile: persona.discProfile,
    keyTraits: persona.keyTraits,
    mindset: persona.mindset,
    skillsMatch: persona.skillsMatch,
    redFlags: persona.redFlags
  };
}