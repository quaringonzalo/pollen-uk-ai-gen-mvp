// Behavioral matching algorithm that connects candidate profiles to job requirements

export interface CandidateBehavioralProfile {
  dimensions: {
    [dimension: string]: {
      dominant: string;
      score: number;
      distribution: { [trait: string]: number };
    };
  };
  overallTraits: Array<{ trait: string; score: number }>;
  responseCount: number;
  completedAt: string;
}

export interface JobBehavioralRequirement {
  dimensionId: string;
  traitId: string;
  importance: number; // 1-5 scale
  required: boolean;
}

export interface SkillsChallengeResult {
  challengeId: string;
  score: number;
  skillsVerified: string[];
  completedAt: string;
}

export interface ComprehensiveMatchScore {
  overallScore: number;
  behavioralScore: number;
  skillsScore: number;
  breakdown: {
    behavioral: {
      dimensionMatches: Array<{
        dimension: string;
        candidateStrength: string;
        requirementMatch: number;
        importance: number;
        score: number;
      }>;
      totalPossibleScore: number;
      achievedScore: number;
    };
    skills: {
      verifiedSkillsMatch: number;
      challengePerformance: number;
      skillsGap: string[];
    };
  };
}

/**
 * Calculate comprehensive match score combining behavioral assessment and skills verification
 */
export function calculateComprehensiveMatch(
  candidateProfile: CandidateBehavioralProfile,
  jobRequirements: JobBehavioralRequirement[],
  skillsChallengeResults: SkillsChallengeResult[],
  requiredSkills: string[],
  preferredSkills: string[] = []
): ComprehensiveMatchScore {
  
  const behavioralMatch = calculateBehavioralMatch(candidateProfile, jobRequirements);
  const skillsMatch = calculateSkillsMatch(skillsChallengeResults, requiredSkills, preferredSkills);
  
  // Weight behavioral and skills components
  const behavioralWeight = 0.6; // 60% behavioral fit
  const skillsWeight = 0.4; // 40% skills verification
  
  const overallScore = (behavioralMatch.score * behavioralWeight) + (skillsMatch.score * skillsWeight);
  
  return {
    overallScore: Math.round(overallScore),
    behavioralScore: Math.round(behavioralMatch.score),
    skillsScore: Math.round(skillsMatch.score),
    breakdown: {
      behavioral: behavioralMatch.breakdown,
      skills: skillsMatch.breakdown
    }
  };
}

/**
 * Calculate behavioral fit between candidate and job requirements
 */
function calculateBehavioralMatch(
  candidateProfile: CandidateBehavioralProfile,
  jobRequirements: JobBehavioralRequirement[]
): { score: number; breakdown: any } {
  
  if (!jobRequirements.length) {
    return { score: 50, breakdown: { dimensionMatches: [], totalPossibleScore: 0, achievedScore: 0 } };
  }

  let totalPossibleScore = 0;
  let achievedScore = 0;
  const dimensionMatches = [];

  // Group requirements by dimension
  const requirementsByDimension = jobRequirements.reduce((acc, req) => {
    if (!acc[req.dimensionId]) acc[req.dimensionId] = [];
    acc[req.dimensionId].push(req);
    return acc;
  }, {} as { [key: string]: JobBehavioralRequirement[] });

  // Evaluate each dimension
  for (const [dimensionId, requirements] of Object.entries(requirementsByDimension)) {
    const candidateDimension = candidateProfile.dimensions[dimensionId];
    
    if (!candidateDimension) continue;

    for (const requirement of requirements) {
      const candidateStrength = candidateDimension.dominant;
      const candidateScore = candidateDimension.distribution[requirement.traitId] || 0;
      
      // Calculate match score based on candidate's strength in this trait
      let matchScore = 0;
      
      if (candidateStrength === requirement.traitId) {
        // Perfect match - candidate's dominant trait matches requirement
        matchScore = 100;
      } else if (candidateScore > 0) {
        // Partial match - candidate has some score in this trait
        matchScore = Math.min(candidateScore * 20, 80); // Scale to max 80%
      } else {
        // No match
        matchScore = 0;
      }

      // Apply importance weighting
      const weightedScore = matchScore * (requirement.importance / 5);
      const maxPossibleScore = 100 * (requirement.importance / 5);
      
      // Required traits have higher penalty for mismatch
      if (requirement.required && matchScore < 60) {
        achievedScore += weightedScore * 0.5; // Penalize poor matches on required traits
      } else {
        achievedScore += weightedScore;
      }
      
      totalPossibleScore += maxPossibleScore;

      dimensionMatches.push({
        dimension: dimensionId,
        candidateStrength,
        requirementMatch: matchScore,
        importance: requirement.importance,
        score: weightedScore
      });
    }
  }

  const finalScore = totalPossibleScore > 0 ? (achievedScore / totalPossibleScore) * 100 : 0;

  return {
    score: finalScore,
    breakdown: {
      dimensionMatches,
      totalPossibleScore,
      achievedScore
    }
  };
}

/**
 * Calculate skills verification score based on challenge results
 */
function calculateSkillsMatch(
  challengeResults: SkillsChallengeResult[],
  requiredSkills: string[],
  preferredSkills: string[] = []
): { score: number; breakdown: any } {
  
  if (!challengeResults.length) {
    return { 
      score: 0, 
      breakdown: { 
        verifiedSkillsMatch: 0, 
        challengePerformance: 0, 
        skillsGap: requiredSkills 
      } 
    };
  }

  // Get all verified skills from challenges
  const verifiedSkills = challengeResults.flatMap(result => result.skillsVerified);
  
  // Calculate required skills coverage
  const requiredSkillsCovered = requiredSkills.filter(skill => 
    verifiedSkills.includes(skill)
  ).length;
  const requiredSkillsMatch = requiredSkills.length > 0 ? 
    (requiredSkillsCovered / requiredSkills.length) * 100 : 100;

  // Calculate preferred skills bonus
  const preferredSkillsCovered = preferredSkills.filter(skill => 
    verifiedSkills.includes(skill)
  ).length;
  const preferredSkillsBonus = preferredSkills.length > 0 ? 
    (preferredSkillsCovered / preferredSkills.length) * 10 : 0; // 10% bonus

  // Calculate average challenge performance
  const averageChallengeScore = challengeResults.reduce((sum, result) => 
    sum + result.score, 0) / challengeResults.length;

  // Skills gap analysis
  const skillsGap = requiredSkills.filter(skill => !verifiedSkills.includes(skill));

  // Combined skills score (70% required skills + 20% challenge performance + 10% preferred skills)
  const skillsScore = Math.min(
    (requiredSkillsMatch * 0.7) + (averageChallengeScore * 0.2) + preferredSkillsBonus,
    100
  );

  return {
    score: skillsScore,
    breakdown: {
      verifiedSkillsMatch: requiredSkillsMatch,
      challengePerformance: averageChallengeScore,
      skillsGap
    }
  };
}

/**
 * Generate matching insights for employers
 */
export function generateMatchInsights(matchScore: ComprehensiveMatchScore): {
  strengths: string[];
  concerns: string[];
  recommendations: string[];
} {
  const insights = {
    strengths: [],
    concerns: [],
    recommendations: []
  };

  // Behavioral insights
  const topBehavioralMatches = matchScore.breakdown.behavioral.dimensionMatches
    .filter(match => match.requirementMatch >= 80)
    .sort((a, b) => b.score - a.score);

  if (topBehavioralMatches.length > 0) {
    insights.strengths.push(
      `Strong behavioral fit: Candidate shows excellent alignment in ${topBehavioralMatches.length} key behavioral areas`
    );
  }

  const poorBehavioralMatches = matchScore.breakdown.behavioral.dimensionMatches
    .filter(match => match.requirementMatch < 40 && match.importance >= 4);

  if (poorBehavioralMatches.length > 0) {
    insights.concerns.push(
      `Behavioral gaps in critical areas: ${poorBehavioralMatches.length} high-importance requirements show poor alignment`
    );
  }

  // Skills insights
  if (matchScore.breakdown.skills.verifiedSkillsMatch >= 80) {
    insights.strengths.push(
      `Strong skills verification: ${Math.round(matchScore.breakdown.skills.verifiedSkillsMatch)}% of required skills verified through challenges`
    );
  }

  if (matchScore.breakdown.skills.skillsGap.length > 0) {
    insights.concerns.push(
      `Skills gap: ${matchScore.breakdown.skills.skillsGap.length} required skills not yet verified`
    );
    insights.recommendations.push(
      `Consider additional skills challenges or training for: ${matchScore.breakdown.skills.skillsGap.join(', ')}`
    );
  }

  // Overall recommendations
  if (matchScore.overallScore >= 80) {
    insights.recommendations.push('Excellent candidate match - recommend proceeding with interview');
  } else if (matchScore.overallScore >= 60) {
    insights.recommendations.push('Good candidate potential - consider skills development opportunities');
  } else {
    insights.recommendations.push('Candidate may need significant development - evaluate cultural fit and growth potential');
  }

  return insights;
}