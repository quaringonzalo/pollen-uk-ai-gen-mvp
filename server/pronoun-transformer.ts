// Dynamic pronoun transformation for behavioral profiles
// Allows single content to adapt between job seeker ("You") and employer (third person) views

export interface PronounContext {
  viewerRole: 'job_seeker' | 'employer' | 'admin';
  subjectName?: string; // For employer view: "Sarah", "John", etc.
  subjectGender?: 'he' | 'she' | 'they'; // Default to 'they' for inclusive language
}

/**
 * Transforms behavioral profile content from job seeker perspective ("You")
 * to employer perspective (third person with name/pronouns)
 */
export function transformPronouns(text: string, context: PronounContext): string {
  // If viewer is job seeker, return original "You" text
  if (context.viewerRole === 'job_seeker') {
    return text;
  }
  
  // Transform for employer/admin view
  const name = context.subjectName || 'This person';
  const pronoun = context.subjectGender === 'he' ? 'he' : 
                  context.subjectGender === 'she' ? 'she' : 'they';
  const possessive = context.subjectGender === 'he' ? 'his' : 
                     context.subjectGender === 'she' ? 'her' : 'their';
  const objective = context.subjectGender === 'he' ? 'him' : 
                    context.subjectGender === 'she' ? 'her' : 'them';
  
  let transformed = text;
  
  // Transform "You" patterns
  transformed = transformed.replace(/\bYou're\b/g, `${name} is`);
  transformed = transformed.replace(/\bYou\b/g, name);
  transformed = transformed.replace(/\byou're\b/g, `${pronoun} ${pronoun === 'they' ? 'are' : 'is'}`);
  transformed = transformed.replace(/\byou\b/g, pronoun);
  
  // Transform "Your" patterns
  transformed = transformed.replace(/\bYour\b/g, `${name}'s`);
  transformed = transformed.replace(/\byour\b/g, possessive);
  
  // Transform verb patterns for third person
  transformed = transformed.replace(/\bhave\b/g, pronoun === 'they' ? 'have' : 'has');
  transformed = transformed.replace(/\bare\b/g, pronoun === 'they' ? 'are' : 'is');
  
  // Transform action patterns
  transformed = transformed.replace(/would help you/g, `would help ${objective}`);
  transformed = transformed.replace(/would make you/g, `would make ${objective}`);
  
  // Clean up any double names (e.g., "Sarah Sarah" -> "Sarah")
  const namePattern = new RegExp(`\\b${name}\\s+${name}\\b`, 'g');
  transformed = transformed.replace(namePattern, name);
  
  return transformed;
}

/**
 * Transform key strengths descriptions for employer view
 */
export function transformKeyStrengths(keyStrengths: Array<{title: string; description: string}>, context: PronounContext): Array<{title: string; description: string}> {
  if (context.viewerRole === 'job_seeker') {
    return keyStrengths;
  }
  
  return keyStrengths.map(strength => ({
    title: strength.title,
    description: transformPronouns(strength.description, context)
  }));
}

/**
 * Transform all behavioral profile content for viewing context
 */
export function transformBehavioralProfile(profile: any, context: PronounContext) {
  return {
    ...profile,
    description: transformPronouns(profile.description, context),
    keyStrengths: transformKeyStrengths(profile.keyStrengths, context),
    communicationStyle: transformPronouns(profile.communicationStyle, context),
    decisionMaking: transformPronouns(profile.decisionMaking, context),
    personalisedWorkStyleSummary: transformPronouns(profile.personalisedWorkStyleSummary, context),
    idealWorkEnvironment: transformPronouns(profile.idealWorkEnvironment, context)
  };
}