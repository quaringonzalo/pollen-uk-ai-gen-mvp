// Compatibility scoring system combining skills and behavioral assessment

export interface CompatibilityScore {
  skillsScore: number;
  behavioralScore: number;
  proactivityScore: number;
  overallCompatibility: number;
  practicalFilter?: {
    passes: boolean;
    failures: string[];
  };
  breakdown: {
    skillsMatch: {
      requiredSkillsCovered: number;
      preferredSkillsBonus: number;
      skillsGap: string[];
    };
    behavioralMatch: {
      primaryProfileAlignment: number;
      secondaryProfileAlignment: number;
      workStyleCompatibility: number;
      teamFitScore: number;
    };
    proactivityMatch: {
      communityEngagement: number;
      learningCommitment: number;
      overallProactivity: number;
    };
  };
}

export function calculateJobCompatibility(
  candidateProfile: {
    skills: string[];
    discRedScore: number;
    discYellowScore: number;
    discGreenScore: number;
    discBlueScore: number;
    primaryProfile: string;
    secondaryProfile: string;
    proactivityScore?: number;
    communityPoints?: number;
    learningPoints?: number;
    eventsAttended?: number;
    masterclassesCompleted?: number;
  },
  jobRequirements: {
    requiredSkills: string[];
    preferredSkills: string[];
    preferredDiscProfiles: string[];
    workStylePreferences: any;
    teamDynamicsRequirements: any;
    proactivityWeight?: number; // 0-1, defaults to 0.1 (10%)
  }
): CompatibilityScore {
  
  // Skills Scoring (0-100)
  const skillsScore = calculateSkillsCompatibility(candidateProfile, jobRequirements);
  
  // Behavioral Scoring (0-100)
  const behavioralScore = calculateBehavioralCompatibility(candidateProfile, jobRequirements);
  
  // Proactivity Scoring (0-100, scaled from 0-10)
  const proactivityScore = Math.round((candidateProfile.proactivityScore || 6.0) * 10);
  
  // Simplified weighted average: 70% skills, 30% behavioral
  const skillsWeight = 0.7; // Updated to 70% for skills
  const behavioralWeight = 0.3; // Fixed 30% for behavioral
  
  const overallCompatibility = Math.round(
    (skillsScore * skillsWeight) + 
    (behavioralScore * behavioralWeight)
  );
  
  return {
    skillsScore,
    behavioralScore,
    proactivityScore,
    overallCompatibility,
    breakdown: {
      skillsMatch: getSkillsBreakdown(candidateProfile, jobRequirements),
      behavioralMatch: getBehavioralBreakdown(candidateProfile, jobRequirements),
      proactivityMatch: getProactivityBreakdown(candidateProfile)
    }
  };
}

function calculateSkillsCompatibility(candidateProfile: any, jobRequirements: any): number {
  const candidateSkills = candidateProfile.skills || [];
  const requiredSkills = jobRequirements.requiredSkills || [];
  const preferredSkills = jobRequirements.preferredSkills || [];
  
  // For simplified system: If no verified skills, use basic relevance scoring
  if (candidateSkills.length === 0) {
    return 75; // Neutral score for entry-level candidates
  }
  
  // Required skills coverage (70% weight)
  const requiredMatches = requiredSkills.filter((skill: string) => 
    candidateSkills.some((candidateSkill: string) => 
      candidateSkill.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(candidateSkill.toLowerCase())
    )
  );
  const requiredCoverage = requiredSkills.length > 0 ? (requiredMatches.length / requiredSkills.length) * 70 : 70;
  
  // Preferred skills bonus (30% weight)
  const preferredMatches = preferredSkills.filter((skill: string) => 
    candidateSkills.some((candidateSkill: string) => 
      candidateSkill.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(candidateSkill.toLowerCase())
    )
  );
  const preferredBonus = preferredSkills.length > 0 ? (preferredMatches.length / preferredSkills.length) * 30 : 30;
  
  return Math.min(100, Math.round(requiredCoverage + preferredBonus));
}

// Job relevance assessment based on interests and behavioral fit (no quantified scoring)
function assessJobRelevance(candidateProfile: any, jobRequirements: any): {
  isRelevant: boolean;
  reasons: string[];
  practicalFit: boolean;
} {
  const reasons: string[] = [];
  let isRelevant = false;
  let practicalFit = true;
  
  // Stage 1: Practical Requirements Filter (Pass/Fail) - ALL must pass
  
  // 1. Visa/Work Authorization
  if (jobRequirements.visaSponsorship === false && candidateProfile.workAuthorization !== 'authorized') {
    practicalFit = false;
  }
  
  // 2. Location Compatibility
  if (jobRequirements.location && candidateProfile.locationPreferences) {
    const locationMatch = candidateProfile.locationPreferences.some((pref: string) => 
      pref.toLowerCase().includes(jobRequirements.location.toLowerCase()) ||
      jobRequirements.location.toLowerCase().includes(pref.toLowerCase())
    );
    if (!locationMatch) {
      practicalFit = false;
    }
  }
  
  // 3. Job Type Alignment (Full-time vs Part-time)
  if (jobRequirements.employmentType && candidateProfile.jobTypePreference) {
    if (jobRequirements.employmentType !== candidateProfile.jobTypePreference) {
      practicalFit = false;
    }
  }
  
  // 4. Employment Type Preferences (Office vs Remote vs Hybrid)
  if (jobRequirements.workArrangement && candidateProfile.workArrangementPreference) {
    if (jobRequirements.workArrangement !== candidateProfile.workArrangementPreference) {
      practicalFit = false;
    }
  }
  
  // 5. Driving License Requirements
  if (jobRequirements.drivingLicenseRequired && !candidateProfile.hasDriversLicense) {
    practicalFit = false;
  }
  
  // 6. Salary Range Compatibility
  if (jobRequirements.salaryRange && candidateProfile.salaryExpectations) {
    const salaryFit = candidateProfile.salaryExpectations.min <= jobRequirements.salaryRange.max &&
                     candidateProfile.salaryExpectations.max >= jobRequirements.salaryRange.min;
    if (!salaryFit) {
      practicalFit = false;
    }
  }
  
  // Interest alignment (no education/experience factors)
  const candidateInterests = candidateProfile.careerInterests || [];
  const jobCategories = jobRequirements.categories || [];
  
  const interestMatch = candidateInterests.some((interest: string) =>
    jobCategories.some((category: string) => 
      interest.toLowerCase().includes(category.toLowerCase()) ||
      category.toLowerCase().includes(interest.toLowerCase())
    )
  );
  
  if (interestMatch) {
    isRelevant = true;
    reasons.push("Matches your expressed career interests");
  }
  
  // Behavioral fit indicators
  const preferredProfiles = jobRequirements.preferredDiscProfiles || [];
  if (preferredProfiles.length > 0) {
    const candidateProfiles = [candidateProfile.primaryProfile, candidateProfile.secondaryProfile].filter(Boolean);
    const behavioralFit = candidateProfiles.some((profile: string) => 
      preferredProfiles.includes(profile)
    );
    
    if (behavioralFit) {
      isRelevant = true;
      reasons.push("Your work style aligns well with this role");
    }
  }
  
  // Always allow exploration - even if not flagged as relevant
  return {
    isRelevant,
    reasons,
    practicalFit
  };
}

function calculateBehavioralCompatibility(candidateProfile: any, jobRequirements: any): number {
  const preferredProfiles = jobRequirements.preferredDiscProfiles || [];
  
  if (preferredProfiles.length === 0) {
    return 75; // Default good compatibility if no preferences specified
  }
  
  let compatibilityScore = 0;
  
  // Primary profile match (60% weight)
  if (preferredProfiles.includes(candidateProfile.primaryProfile)) {
    compatibilityScore += 60;
  } else {
    // Partial compatibility based on DISC scores
    compatibilityScore += calculateDiscAlignment(candidateProfile, preferredProfiles) * 0.6;
  }
  
  // Secondary profile consideration (25% weight)
  if (preferredProfiles.includes(candidateProfile.secondaryProfile)) {
    compatibilityScore += 25;
  }
  
  // Work style alignment (15% weight)
  compatibilityScore += calculateWorkStyleAlignment(candidateProfile, jobRequirements) * 0.15;
  
  return Math.min(100, Math.round(compatibilityScore));
}

function calculateDiscAlignment(candidateProfile: any, preferredProfiles: string[]): number {
  // Calculate alignment based on DISC scores
  const candidateDisc = {
    red: candidateProfile.discRedScore || 0,
    yellow: candidateProfile.discYellowScore || 0,
    green: candidateProfile.discGreenScore || 0,
    blue: candidateProfile.discBlueScore || 0
  };
  
  // Simple alignment score based on dominant traits
  let alignmentScore = 0;
  
  preferredProfiles.forEach(profile => {
    if (profile.includes('Red') && candidateDisc.red > 30) alignmentScore += 25;
    if (profile.includes('Yellow') && candidateDisc.yellow > 30) alignmentScore += 25;
    if (profile.includes('Green') && candidateDisc.green > 30) alignmentScore += 25;
    if (profile.includes('Blue') && candidateDisc.blue > 30) alignmentScore += 25;
  });
  
  return Math.min(100, alignmentScore);
}

function calculateWorkStyleAlignment(candidateProfile: any, jobRequirements: any): number {
  // Default good alignment if no specific work style requirements
  return 80;
}

function getSkillsBreakdown(candidateProfile: any, jobRequirements: any) {
  const candidateSkills = candidateProfile.skills || [];
  const requiredSkills = jobRequirements.requiredSkills || [];
  const preferredSkills = jobRequirements.preferredSkills || [];
  
  const requiredMatches = requiredSkills.filter((skill: string) => 
    candidateSkills.some((candidateSkill: string) => 
      candidateSkill.toLowerCase().includes(skill.toLowerCase())
    )
  );
  
  const preferredMatches = preferredSkills.filter((skill: string) => 
    candidateSkills.some((candidateSkill: string) => 
      candidateSkill.toLowerCase().includes(skill.toLowerCase())
    )
  );
  
  const skillsGap = requiredSkills.filter((skill: string) => 
    !candidateSkills.some((candidateSkill: string) => 
      candidateSkill.toLowerCase().includes(skill.toLowerCase())
    )
  );
  
  return {
    requiredSkillsCovered: requiredSkills.length > 0 ? Math.round((requiredMatches.length / requiredSkills.length) * 100) : 100,
    preferredSkillsBonus: preferredSkills.length > 0 ? Math.round((preferredMatches.length / preferredSkills.length) * 100) : 100,
    skillsGap
  };
}

function getBehavioralBreakdown(candidateProfile: any, jobRequirements: any) {
  const preferredProfiles = jobRequirements.preferredDiscProfiles || [];
  
  return {
    primaryProfileAlignment: preferredProfiles.includes(candidateProfile.primaryProfile) ? 100 : 60,
    secondaryProfileAlignment: preferredProfiles.includes(candidateProfile.secondaryProfile) ? 100 : 40,
    workStyleCompatibility: 80, // Default good compatibility
    teamFitScore: 85 // Default good team fit
  };
}

function getProactivityBreakdown(candidateProfile: any) {
  const communityPoints = candidateProfile.communityPoints || 0;
  const learningPoints = candidateProfile.learningPoints || 0;
  const eventsAttended = candidateProfile.eventsAttended || 0;
  const masterclassesCompleted = candidateProfile.masterclassesCompleted || 0;
  
  // Community engagement score (0-100)
  const communityEngagement = Math.min(100, Math.round(
    (communityPoints / 200) * 70 + // Points contribute 70%
    (eventsAttended * 5) // Event attendance contributes 30%
  ));
  
  // Learning commitment score (0-100)
  const learningCommitment = Math.min(100, Math.round(
    (learningPoints / 500) * 60 + // Learning points contribute 60%
    (masterclassesCompleted * 20) // Masterclass completion contributes 40%
  ));
  
  // Overall proactivity (weighted average)
  const overallProactivity = Math.round((communityEngagement * 0.4) + (learningCommitment * 0.6));
  
  return {
    communityEngagement,
    learningCommitment,
    overallProactivity
  };
}

export function generateFeedbackForEmployer(ratings: {
  responseTimeRating: number;
  interviewStyleRating: number;
  communicationRating: number;
  processTransparencyRating: number;
  overallExperienceRating: number;
}): {
  overallScore: number;
  strengths: string[];
  improvementAreas: string[];
  recommendedActions: string[];
} {
  const scores = Object.values(ratings);
  const overallScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length * 20); // Convert to 100 scale
  
  const strengths: string[] = [];
  const improvementAreas: string[] = [];
  const recommendedActions: string[] = [];
  
  // Response Time
  if (ratings.responseTimeRating >= 4) {
    strengths.push("Excellent communication timing and responsiveness");
  } else if (ratings.responseTimeRating <= 2) {
    improvementAreas.push("Response time to candidates");
    recommendedActions.push("Set up automated acknowledgment emails and commit to response timeframes");
  }
  
  // Interview Style
  if (ratings.interviewStyleRating >= 4) {
    strengths.push("Positive and engaging interview experience");
  } else if (ratings.interviewStyleRating <= 2) {
    improvementAreas.push("Interview process and candidate experience");
    recommendedActions.push("Consider interview training for hiring managers and structured interview processes");
  }
  
  // Communication
  if (ratings.communicationRating >= 4) {
    strengths.push("Clear and professional communication throughout process");
  } else if (ratings.communicationRating <= 2) {
    improvementAreas.push("Communication clarity and frequency");
    recommendedActions.push("Implement regular candidate updates and feedback checkpoints");
  }
  
  // Process Transparency
  if (ratings.processTransparencyRating >= 4) {
    strengths.push("Transparent hiring process with clear expectations");
  } else if (ratings.processTransparencyRating <= 2) {
    improvementAreas.push("Process transparency and setting expectations");
    recommendedActions.push("Create clear hiring process documentation and share timelines with candidates");
  }
  
  return {
    overallScore,
    strengths,
    improvementAreas,
    recommendedActions
  };
}