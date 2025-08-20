import { storage } from "./storage";

/**
 * Dynamic Scoring System for Bespoke Challenges
 * 
 * This system determines scoring categories based on:
 * 1. Job requirements from employer checkpoint configuration
 * 2. Challenge type and complexity
 * 3. Role-specific competencies
 * 4. Company-specific priorities
 */

export interface DynamicScoringCategory {
  id: string;
  name: string;
  description: string;
  weight: number; // 0-1, should sum to 1.0
  icon: string;
  evaluationCriteria: string[];
  scoringLogic: ScoringLogic;
}

export interface ScoringLogic {
  type: 'communication' | 'analytical' | 'creative' | 'technical' | 'organizational' | 'problem_solving';
  indicators: string[];
  weightFactors: Record<string, number>;
}

export interface ChallengeConfiguration {
  jobId: number;
  challengeType: 'communication' | 'quality_control' | 'pressure_management' | 'role_specific';
  roleCategory: string;
  companyPriorities: string[];
  taskComplexity: 'entry_level' | 'intermediate' | 'advanced';
  customRequirements: Record<string, any>;
}

export class DynamicScoringSystem {
  
  /**
   * Generate scoring categories based on employer checkpoint configuration
   */
  async generateScoringCategories(challengeConfig: ChallengeConfiguration): Promise<DynamicScoringCategory[]> {
    const categories: DynamicScoringCategory[] = [];
    
    // Always include core competencies with adaptive weights
    const coreCompetencies = await this.getCoreCompetencies(challengeConfig);
    categories.push(...coreCompetencies);
    
    // Add role-specific categories
    const roleSpecific = await this.getRoleSpecificCategories(challengeConfig);
    categories.push(...roleSpecific);
    
    // Add company-priority categories
    const companyPriorities = await this.getCompanyPriorityCategories(challengeConfig);
    categories.push(...companyPriorities);
    
    // Normalize weights to sum to 1.0
    return this.normalizeWeights(categories);
  }
  
  /**
   * Core competencies that appear in most challenges with adaptive weights
   */
  private async getCoreCompetencies(config: ChallengeConfiguration): Promise<DynamicScoringCategory[]> {
    const categories: DynamicScoringCategory[] = [];
    
    // Communication - always present but weight varies by role
    const communicationWeight = config.roleCategory.includes('client-facing') ? 0.35 : 0.25;
    categories.push({
      id: 'communication',
      name: 'Professional Communication',
      description: 'Clarity, tone, and effectiveness in written and verbal communication',
      weight: communicationWeight,
      icon: 'MessageSquare',
      evaluationCriteria: [
        'Clear and concise expression',
        'Appropriate professional tone',
        'Effective information structure',
        'Audience-appropriate language'
      ],
      scoringLogic: {
        type: 'communication',
        indicators: ['text_clarity', 'professional_tone', 'structure_quality'],
        weightFactors: { clarity: 0.4, tone: 0.3, structure: 0.3 }
      }
    });
    
    // Problem-solving - core to most roles
    categories.push({
      id: 'problem_solving',
      name: 'Problem-Solving Approach',
      description: 'Logical thinking, systematic analysis, and solution development',
      weight: 0.25,
      icon: 'Brain',
      evaluationCriteria: [
        'Systematic approach to challenges',
        'Logical reasoning and analysis',
        'Creative solution development',
        'Evidence-based decision making'
      ],
      scoringLogic: {
        type: 'problem_solving',
        indicators: ['systematic_approach', 'logical_reasoning', 'solution_quality'],
        weightFactors: { approach: 0.35, reasoning: 0.35, solution: 0.3 }
      }
    });
    
    return categories;
  }
  
  /**
   * Role-specific categories based on job requirements
   */
  private async getRoleSpecificCategories(config: ChallengeConfiguration): Promise<DynamicScoringCategory[]> {
    const categories: DynamicScoringCategory[] = [];
    
    switch (config.roleCategory) {
      case 'creative':
        categories.push({
          id: 'creative_thinking',
          name: 'Creative Innovation',
          description: 'Original thinking, creative problem-solving, and innovative approaches',
          weight: 0.25,
          icon: 'Lightbulb',
          evaluationCriteria: [
            'Original and innovative ideas',
            'Creative problem-solving approach',
            'Aesthetic and design sensibility',
            'Adaptability to brand requirements'
          ],
          scoringLogic: {
            type: 'creative',
            indicators: ['originality', 'innovation', 'brand_alignment'],
            weightFactors: { originality: 0.4, innovation: 0.35, brand: 0.25 }
          }
        });
        break;
        
      case 'analytical':
        categories.push({
          id: 'data_analysis',
          name: 'Data Analysis & Accuracy',
          description: 'Systematic data analysis, accuracy in calculations, and insight generation',
          weight: 0.3,
          icon: 'BarChart3',
          evaluationCriteria: [
            'Accuracy in data handling',
            'Systematic analysis methodology',
            'Meaningful insight generation',
            'Error detection and correction'
          ],
          scoringLogic: {
            type: 'analytical',
            indicators: ['data_accuracy', 'methodology', 'insights'],
            weightFactors: { accuracy: 0.4, methodology: 0.35, insights: 0.25 }
          }
        });
        break;
        
      case 'technical':
        categories.push({
          id: 'technical_execution',
          name: 'Technical Competency',
          description: 'Technical skill application, code quality, and best practices',
          weight: 0.3,
          icon: 'Code',
          evaluationCriteria: [
            'Technical skill demonstration',
            'Code quality and structure',
            'Best practice adherence',
            'Problem-solving efficiency'
          ],
          scoringLogic: {
            type: 'technical',
            indicators: ['skill_level', 'code_quality', 'best_practices'],
            weightFactors: { skill: 0.4, quality: 0.35, practices: 0.25 }
          }
        });
        break;
        
      case 'project_management':
        categories.push({
          id: 'organization',
          name: 'Project Organisation',
          description: 'Planning, coordination, and systematic approach to task management',
          weight: 0.25,
          icon: 'Target',
          evaluationCriteria: [
            'Clear project planning',
            'Effective resource coordination',
            'Timeline and milestone management',
            'Risk assessment and mitigation'
          ],
          scoringLogic: {
            type: 'organizational',
            indicators: ['planning_quality', 'coordination', 'timeline_management'],
            weightFactors: { planning: 0.4, coordination: 0.3, timeline: 0.3 }
          }
        });
        break;
    }
    
    return categories;
  }
  
  /**
   * Company-specific priority categories from employer configuration
   */
  private async getCompanyPriorityCategories(config: ChallengeConfiguration): Promise<DynamicScoringCategory[]> {
    const categories: DynamicScoringCategory[] = [];
    
    // Add categories based on company priorities from employer checkpoints
    for (const priority of config.companyPriorities) {
      switch (priority) {
        case 'attention_to_detail':
          categories.push({
            id: 'attention_to_detail',
            name: 'Attention to Detail',
            description: 'Thoroughness, accuracy, and quality control in work output',
            weight: 0.15,
            icon: 'Search',
            evaluationCriteria: [
              'Error detection and correction',
              'Thoroughness in task completion',
              'Quality control processes',
              'Consistency in output'
            ],
            scoringLogic: {
              type: 'analytical',
              indicators: ['error_detection', 'thoroughness', 'consistency'],
              weightFactors: { detection: 0.4, thoroughness: 0.35, consistency: 0.25 }
            }
          });
          break;
          
        case 'cultural_fit':
          categories.push({
            id: 'values_alignment',
            name: 'Values Alignment',
            description: 'Alignment with company values and working style preferences',
            weight: 0.1,
            icon: 'Heart',
            evaluationCriteria: [
              'Alignment with company values',
              'Cultural fit indicators',
              'Communication style match',
              'Working approach compatibility'
            ],
            scoringLogic: {
              type: 'communication',
              indicators: ['values_alignment', 'cultural_fit', 'communication_style'],
              weightFactors: { values: 0.4, culture: 0.35, communication: 0.25 }
            }
          });
          break;
      }
    }
    
    return categories;
  }
  
  /**
   * Normalize category weights to sum to 1.0
   */
  private normalizeWeights(categories: DynamicScoringCategory[]): DynamicScoringCategory[] {
    const totalWeight = categories.reduce((sum, cat) => sum + cat.weight, 0);
    
    return categories.map(category => ({
      ...category,
      weight: category.weight / totalWeight
    }));
  }
  
  /**
   * Score a submission against dynamic categories
   */
  async scoreSubmission(
    submissionId: number, 
    categories: DynamicScoringCategory[]
  ): Promise<{ categoryScores: any[], overallScore: number }> {
    const submission = await storage.getChallengeSubmissionById(submissionId);
    if (!submission) {
      throw new Error('Submission not found');
    }
    
    const categoryScores = [];
    let weightedSum = 0;
    
    for (const category of categories) {
      const score = await this.calculateCategoryScore(submission, category);
      categoryScores.push({
        category: category.name,
        score,
        description: category.description,
        reasoning: await this.generateScoreReasoning(submission, category, score),
        icon: category.icon
      });
      
      weightedSum += score * category.weight;
    }
    
    return {
      categoryScores,
      overallScore: Math.round(weightedSum)
    };
  }
  
  /**
   * Calculate score for a specific category
   */
  private async calculateCategoryScore(submission: any, category: DynamicScoringCategory): Promise<number> {
    const { scoringLogic } = category;
    let score = 60; // Base score
    
    // Apply scoring logic based on category type
    switch (scoringLogic.type) {
      case 'communication':
        score += this.evaluateCommunicationIndicators(submission, scoringLogic);
        break;
      case 'analytical':
        score += this.evaluateAnalyticalIndicators(submission, scoringLogic);
        break;
      case 'creative':
        score += this.evaluateCreativeIndicators(submission, scoringLogic);
        break;
      case 'technical':
        score += this.evaluateTechnicalIndicators(submission, scoringLogic);
        break;
      case 'organizational':
        score += this.evaluateOrganizationalIndicators(submission, scoringLogic);
        break;
      case 'problem_solving':
        score += this.evaluateProblemSolvingIndicators(submission, scoringLogic);
        break;
    }
    
    return Math.min(95, Math.max(35, score));
  }
  
  /**
   * Category-specific evaluation methods
   */
  private evaluateCommunicationIndicators(submission: any, logic: ScoringLogic): number {
    let adjustment = 0;
    const text = submission.submissionText || '';
    
    // Text clarity evaluation
    if (logic.indicators.includes('text_clarity')) {
      if (text.length > 200 && text.includes('.') && !text.includes('...')) {
        adjustment += 15 * logic.weightFactors.clarity;
      }
    }
    
    // Professional tone evaluation
    if (logic.indicators.includes('professional_tone')) {
      if (text.includes('Thank you') || text.includes('Please') || text.includes('regarding')) {
        adjustment += 20 * logic.weightFactors.tone;
      }
    }
    
    // Structure quality evaluation
    if (logic.indicators.includes('structure_quality')) {
      if (text.includes('\n') || text.includes('1.') || text.includes('•')) {
        adjustment += 15 * logic.weightFactors.structure;
      }
    }
    
    return adjustment;
  }
  
  private evaluateAnalyticalIndicators(submission: any, logic: ScoringLogic): number {
    let adjustment = 0;
    const text = submission.submissionText || '';
    
    // Data accuracy indicators
    if (logic.indicators.includes('data_accuracy')) {
      if (text.includes('calculation') || text.includes('analysis') || text.includes('data')) {
        adjustment += 20 * logic.weightFactors.accuracy;
      }
    }
    
    // Methodology indicators
    if (logic.indicators.includes('methodology')) {
      if (text.includes('approach') || text.includes('method') || text.includes('process')) {
        adjustment += 15 * logic.weightFactors.methodology;
      }
    }
    
    return adjustment;
  }
  
  private evaluateCreativeIndicators(submission: any, logic: ScoringLogic): number {
    let adjustment = 0;
    const text = submission.submissionText || '';
    
    // Originality indicators
    if (logic.indicators.includes('originality')) {
      if (text.includes('innovative') || text.includes('creative') || text.includes('unique')) {
        adjustment += 18 * logic.weightFactors.originality;
      }
    }
    
    // Innovation indicators
    if (logic.indicators.includes('innovation')) {
      if (text.includes('solution') || text.includes('idea') || text.includes('concept')) {
        adjustment += 15 * logic.weightFactors.innovation;
      }
    }
    
    return adjustment;
  }
  
  private evaluateTechnicalIndicators(submission: any, logic: ScoringLogic): number {
    let adjustment = 0;
    const hasUrl = Boolean(submission.submissionUrl);
    const text = submission.submissionText || '';
    
    // Technical skill indicators
    if (logic.indicators.includes('skill_level')) {
      if (hasUrl && text.includes('implementation')) {
        adjustment += 20 * logic.weightFactors.skill;
      }
    }
    
    return adjustment;
  }
  
  private evaluateOrganizationalIndicators(submission: any, logic: ScoringLogic): number {
    let adjustment = 0;
    const text = submission.submissionText || '';
    
    // Planning quality indicators
    if (logic.indicators.includes('planning_quality')) {
      if (text.includes('plan') || text.includes('timeline') || text.includes('schedule')) {
        adjustment += 18 * logic.weightFactors.planning;
      }
    }
    
    return adjustment;
  }
  
  private evaluateProblemSolvingIndicators(submission: any, logic: ScoringLogic): number {
    let adjustment = 0;
    const text = submission.submissionText || '';
    
    // Systematic approach indicators
    if (logic.indicators.includes('systematic_approach')) {
      if (text.includes('step') || text.includes('first') || text.includes('then')) {
        adjustment += 15 * logic.weightFactors.approach;
      }
    }
    
    return adjustment;
  }
  
  /**
   * Generate contextual reasoning for category scores
   */
  private async generateScoreReasoning(
    submission: any, 
    category: DynamicScoringCategory, 
    score: number
  ): Promise<string> {
    const basePhrases = {
      high: ['Excellent', 'Outstanding', 'Strong', 'Impressive'],
      medium: ['Good', 'Solid', 'Competent', 'Adequate'],
      low: ['Developing', 'Basic', 'Needs improvement', 'Limited']
    };
    
    const level = score >= 80 ? 'high' : score >= 65 ? 'medium' : 'low';
    const phrase = basePhrases[level][Math.floor(Math.random() * basePhrases[level].length)];
    
    return `${phrase} demonstration of ${category.name.toLowerCase()} throughout the assessment based on ${category.evaluationCriteria[0].toLowerCase()} and overall approach to the challenge.`;
  }
}

export const dynamicScoringSystem = new DynamicScoringSystem();