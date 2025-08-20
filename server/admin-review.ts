import { storage } from './storage';

export interface JobPostingReview {
  jobId: number;
  submittedAt: Date;
  status: 'pending' | 'approved' | 'requires_changes' | 'rejected';
  reviewedAt?: Date;
  reviewedBy?: number;
  recommendations: JobRecommendation[];
  flaggedIssues: string[];
  approvalNotes?: string;
}

export interface AssessmentConfigReview {
  configId: string;
  jobId: number;
  submittedAt: Date;
  status: 'pending' | 'approved' | 'requires_changes';
  reviewedAt?: Date;
  reviewedBy?: number;
  challengeDraft: string;
  personaData: any;
  recommendations: AssessmentRecommendation[];
  approvalNotes?: string;
}

export interface JobRecommendation {
  type: 'job_title' | 'requirements' | 'description' | 'language' | 'entry_level';
  severity: 'high' | 'medium' | 'low';
  current: string;
  suggested: string;
  reasoning: string;
}

export interface AssessmentRecommendation {
  type: 'challenge_difficulty' | 'time_allocation' | 'skill_focus' | 'persona_accuracy';
  severity: 'high' | 'medium' | 'low';
  issue: string;
  suggestion: string;
  reasoning: string;
}

const PROBLEMATIC_KEYWORDS = [
  'rockstar', 'ninja', 'guru', 'wizard',
  'years experience', 'senior', 'expert', 'advanced',
  'degree required', 'university graduate',
  'proven track record', 'extensive experience'
];

const ENTRY_LEVEL_INDICATORS = [
  'entry level', 'junior', 'graduate', 'trainee',
  'no experience required', 'willing to learn',
  'development opportunity', 'growth potential'
];

const INCLUSIVE_LANGUAGE_REPLACEMENTS = {
  'guys': 'team members',
  'manpower': 'workforce',
  'chairman': 'chairperson',
  'manmade': 'artificial',
  'culture fit': 'values fit'
};

export class AdminReviewService {
  
  async submitJobForReview(jobId: number): Promise<JobPostingReview> {
    const job = await storage.getJobById(jobId);
    if (!job) throw new Error('Job not found');
    
    const recommendations = this.analyzeJobPosting(job);
    const flaggedIssues = this.identifyJobIssues(job);
    
    const review: JobPostingReview = {
      jobId,
      submittedAt: new Date(),
      status: flaggedIssues.length > 0 ? 'requires_changes' : 'pending',
      recommendations,
      flaggedIssues
    };
    
    await storage.saveJobReview(review);
    
    // Set expected review time: 4 hours during business hours
    this.scheduleReviewReminder(jobId, 'job_posting');
    
    return review;
  }
  
  async submitAssessmentForReview(configId: string, jobId: number): Promise<AssessmentConfigReview> {
    const config = await storage.getAssessmentConfig(configId);
    if (!config) throw new Error('Assessment configuration not found');
    
    const recommendations = this.analyzeAssessmentConfig(config);
    const challengeDraft = await this.generateChallengeDraft(config);
    const personaData = config.personaData;
    
    const review: AssessmentConfigReview = {
      configId,
      jobId,
      submittedAt: new Date(),
      status: 'pending',
      challengeDraft,
      personaData,
      recommendations
    };
    
    await storage.saveAssessmentReview(review);
    
    // Set expected review time: 24 hours
    this.scheduleReviewReminder(configId, 'assessment_config');
    
    return review;
  }
  
  private analyzeJobPosting(job: any): JobRecommendation[] {
    const recommendations: JobRecommendation[] = [];
    
    // Check job title for entry-level appropriateness
    if (job.title.includes('Senior') || job.title.includes('Lead')) {
      recommendations.push({
        type: 'job_title',
        severity: 'high',
        current: job.title,
        suggested: job.title.replace(/Senior|Lead/g, '').trim(),
        reasoning: 'Platform focuses on entry-level opportunities. Remove senior indicators.'
      });
    }
    
    // Check requirements for experience demands
    const requirementsText = job.requirements?.join(' ') || '';
    const experienceMatch = requirementsText.match(/(\d+)[\+\-\s]*years?\s+experience/i);
    if (experienceMatch) {
      recommendations.push({
        type: 'requirements',
        severity: 'high',
        current: experienceMatch[0],
        suggested: 'Willingness to learn and grow in the role',
        reasoning: 'Replace experience requirements with learning attitude focus for entry-level roles.'
      });
    }
    
    // Check for problematic keywords
    PROBLEMATIC_KEYWORDS.forEach(keyword => {
      if (job.description.toLowerCase().includes(keyword.toLowerCase())) {
        recommendations.push({
          type: 'language',
          severity: 'medium',
          current: keyword,
          suggested: this.getSuggestedReplacement(keyword),
          reasoning: `"${keyword}" may discourage entry-level candidates. Use more inclusive language.`
        });
      }
    });
    
    // Check for inclusive language
    Object.entries(INCLUSIVE_LANGUAGE_REPLACEMENTS).forEach(([problematic, inclusive]) => {
      if (job.description.toLowerCase().includes(problematic.toLowerCase())) {
        recommendations.push({
          type: 'language',
          severity: 'low',
          current: problematic,
          suggested: inclusive,
          reasoning: 'Use more inclusive language that welcomes all candidates.'
        });
      }
    });
    
    // Check description length and clarity
    if (job.description.length < 200) {
      recommendations.push({
        type: 'description',
        severity: 'medium',
        current: 'Brief description',
        suggested: 'Add more detail about day-to-day responsibilities, growth opportunities, and team culture',
        reasoning: 'Entry-level candidates need clear understanding of role expectations and development support.'
      });
    }
    
    return recommendations;
  }
  
  private analyzeAssessmentConfig(config: any): AssessmentRecommendation[] {
    const recommendations: AssessmentRecommendation[] = [];
    
    // Check challenge difficulty calibration
    if (config.challengeCalibration.difficulty === 'expert' || config.challengeCalibration.difficulty === 'advanced') {
      recommendations.push({
        type: 'challenge_difficulty',
        severity: 'high',
        issue: 'Challenge difficulty too high for entry-level focus',
        suggestion: 'Adjust to intermediate or beginner level with growth potential assessment',
        reasoning: 'Platform targets 18-30 demographic entering workforce or changing careers.'
      });
    }
    
    // Check time allocation reasonableness
    const timeExpected = parseInt(config.challengeCalibration.timeExpectation);
    if (timeExpected > 180) { // More than 3 hours
      recommendations.push({
        type: 'time_allocation',
        severity: 'medium',
        issue: 'Challenge time requirement too long',
        suggestion: 'Reduce to 90-120 minutes maximum',
        reasoning: 'Long assessments deter candidates and may not reflect actual job requirements.'
      });
    }
    
    // Check persona accuracy based on DISC profile
    const persona = config.personaData;
    if (persona && persona.discProfile) {
      const dominanceHigh = persona.discProfile.red > 50;
      const roleRequiresCollaboration = config.roleContext?.teamDynamics?.includes('collaborative');
      
      if (dominanceHigh && roleRequiresCollaboration) {
        recommendations.push({
          type: 'persona_accuracy',
          severity: 'low',
          issue: 'High dominance profile may conflict with collaborative role requirements',
          suggestion: 'Review checkpoint responses for consistency in team dynamics expectations',
          reasoning: 'Ensure persona aligns with actual role requirements and team culture.'
        });
      }
    }
    
    return recommendations;
  }
  
  private identifyJobIssues(job: any): string[] {
    const issues: string[] = [];
    
    // Critical issues that require changes
    if (job.salary && job.salary.min > 35000) {
      issues.push('Salary minimum above entry-level range');
    }
    
    if (job.requirements?.some((req: string) => req.toLowerCase().includes('degree required'))) {
      issues.push('Hard degree requirement excludes bootcamp/self-taught candidates');
    }
    
    if (!job.title || job.title.length < 3) {
      issues.push('Job title too brief or missing');
    }
    
    if (!job.description || job.description.length < 100) {
      issues.push('Job description insufficient for candidate understanding');
    }
    
    return issues;
  }
  
  private getSuggestedReplacement(keyword: string): string {
    const replacements: { [key: string]: string } = {
      'rockstar': 'talented individual',
      'ninja': 'skilled professional',
      'guru': 'knowledgeable person',
      'wizard': 'capable team member',
      'years experience': 'enthusiasm to learn',
      'senior': 'motivated',
      'expert': 'developing',
      'advanced': 'growing'
    };
    
    return replacements[keyword.toLowerCase()] || 'qualified candidate';
  }
  
  private async generateChallengeDraft(config: any): Promise<string> {
    // This would integrate with the challenge generation system
    // For now, return a structured draft outline
    return `
CHALLENGE DRAFT - ${config.roleContext?.roleTitle || 'Position'}

Time Allocation: ${config.challengeCalibration?.timeExpectation || 90} minutes

Assessment Focus:
${config.challengeCalibration?.assessmentFocus?.map((focus: string) => `- ${focus}`).join('\n') || '- Problem-solving approach\n- Communication clarity\n- Attention to detail'}

Challenge Scenario:
Based on your checkpoint responses, this challenge will assess the candidate's ability to handle ${config.roleContext?.primaryTasks || 'key role responsibilities'} while demonstrating ${config.scenarioAssessment?.keyQualities || 'collaborative problem-solving and quality focus'}.

Success Criteria:
- Demonstrates logical thinking process
- Shows attention to quality and detail
- Communicates clearly throughout
- Exhibits growth mindset and coachability

Custom Requirements:
${config.challengeCalibration?.customRequirements || 'Standard entry-level assessment approach'}
    `.trim();
  }
  
  private scheduleReviewReminder(id: string | number, type: 'job_posting' | 'assessment_config') {
    const hours = type === 'job_posting' ? 4 : 24;
    const reminderTime = new Date(Date.now() + (hours * 60 * 60 * 1000));
    
    // In a real implementation, this would integrate with a job queue system
    console.log(`Review reminder scheduled for ${type} ${id} at ${reminderTime}`);
  }
  
  async getJobReview(jobId: number): Promise<JobPostingReview | null> {
    return await storage.getJobReview(jobId);
  }
  
  async getAssessmentReview(configId: string): Promise<AssessmentConfigReview | null> {
    return await storage.getAssessmentReview(configId);
  }
  
  async approveJobPosting(jobId: number, adminId: number, notes?: string): Promise<void> {
    await storage.updateJobReview(jobId, {
      status: 'approved',
      reviewedAt: new Date(),
      reviewedBy: adminId,
      approvalNotes: notes
    });
    
    // Activate the job posting
    await storage.activateJobPosting(jobId);
  }
  
  async approveAssessmentConfig(configId: string, adminId: number, notes?: string): Promise<void> {
    await storage.updateAssessmentReview(configId, {
      status: 'approved', 
      reviewedAt: new Date(),
      reviewedBy: adminId,
      approvalNotes: notes
    });
    
    // Activate the assessment configuration
    await storage.activateAssessmentConfig(configId);
  }
}