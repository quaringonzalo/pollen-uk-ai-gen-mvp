import { storage } from './storage';
import { dynamicScoringSystem, ChallengeConfiguration } from './dynamic-scoring-system';

export interface FeedbackScore {
  category: string;
  score: number;
  description: string;
  reasoning: string;
  icon: string;
}

export interface ApplicationFeedback {
  applicationId: string;
  jobTitle: string;
  company: string;
  submittedAt: string;
  status: string;
  overallScore: number;
  feedback: {
    keyScores: FeedbackScore[];
    strengthsHighlighted: string[];
    areasForImprovement: string[];
    standardizedBlurb: string;
    nextSteps: string;
    benchmarkComparison: {
      averageScore: number;
      topPercentile: number;
      totalCandidates: number;
    };
    isPersonalized?: boolean;
    pollenTeamNote?: string;
  };
}

export class ScoringAlgorithm {
  /**
   * Generate comprehensive feedback for an application using dynamic scoring
   */
  async generateApplicationFeedback(applicationId: number): Promise<ApplicationFeedback | null> {
    try {
      // Get application data
      const application = await storage.getApplicationById(applicationId);
      console.log('Application found:', application);
      
      // For demo purposes, create mock application data for specific IDs that have feedbackAvailable: true
      if (!application && [1, 4, 5, 6, 7].includes(applicationId)) {
        console.log('Creating mock application data for demo ID:', applicationId);
        const mockApplication = {
          id: applicationId,
          jobId: 1,
          userId: 1,
          submittedAt: new Date(),
          updatedAt: new Date(),
          status: applicationId === 4 ? 'not_progressing' : 
                 applicationId === 5 ? 'pollen_feedback' : 
                 applicationId === 6 ? 'employer_feedback' : 
                 applicationId === 7 ? 'job_offered' : 'interview_invited',
          matchScore: applicationId === 4 ? "65.2" : 
                     applicationId === 5 ? "72.8" : 
                     applicationId === 6 ? "83.4" : 
                     applicationId === 7 ? "94.2" : "78.5",
          notes: applicationId === 4 ? "Competent performance with areas for development" : 
                applicationId === 5 ? "Good performance with strong creative elements" : 
                applicationId === 6 ? "Excellent performance, made it through all interview stages" :
                applicationId === 7 ? "Outstanding performance, offered position with competitive package" :
                "Strong performance on assessment"
        };
        
        console.log('Mock application created:', mockApplication);
        const feedback = this.generateMockFeedback(mockApplication);
        console.log('Mock feedback generated for ID:', applicationId);
        return feedback;
      }
      
      if (!application) {
        console.log('No application found for ID:', applicationId);
        return null;
      }

      // Create fallback data due to database schema issues
      console.log('Using fallback data due to database schema compatibility');
      
      const job = {
        id: application.jobId,
        title: "Marketing Assistant",
        description: "Marketing role with creative and analytical components",
        category: "marketing",
        jobType: "full-time",
        companyName: "TechFlow Solutions",
        requirements: []
      };
      
      const submissions = [{
        id: 1,
        applicationId: applicationId,
        challengeId: 1,
        submissionUrl: "https://example.com/submission",
        submissionText: "Completed assessment with strong analytical and creative approach. Demonstrated good understanding of marketing principles and attention to detail.",
        score: Math.floor(parseFloat(application.matchScore)) || 75,
        feedback: application.notes || "Good performance on assessment",
        submittedAt: application.submittedAt,
        reviewedAt: application.updatedAt
      }];

      // Primary challenge submission (latest one)
      const primarySubmission = submissions[submissions.length - 1];
      
      // Generate different status examples based on application ID
      const statusExamples = this.generateStatusExamples(applicationId);
      
      // Don't include interview performance in key scores as we have a dedicated section
      const includeInterview = false;
      
      // Calculate category scores without interview performance (shown separately)
      const keyScores = this.calculateCategoryScores(primarySubmission, job, includeInterview, statusExamples.status);
      
      // Calculate overall score
      const overallScore = this.calculateOverallScore(keyScores);
      
      // Generate qualitative feedback
      const strengthsHighlighted = statusExamples.status === 'not_progressing' ? [] : this.generateStrengths(keyScores, primarySubmission, statusExamples.status);
      const areasForImprovement = this.generateImprovementAreas(keyScores, primarySubmission);
      const standardizedBlurb = this.generateStandardizedBlurb(job);
      const nextSteps = this.generateNextSteps(keyScores, job, statusExamples.status);
      
      // Calculate benchmark comparison
      const benchmarkComparison = await this.calculateBenchmarkComparison(overallScore, job.category);

      return {
        applicationId: applicationId.toString(),
        jobTitle: job.title,
        company: job.companyName || "Company",
        submittedAt: application.submittedAt?.toISOString() || new Date().toISOString(),
        status: statusExamples.status,
        overallScore,
        feedback: {
          keyScores,
          strengthsHighlighted,
          areasForImprovement,
          standardizedBlurb: statusExamples.standardizedBlurb,
          nextSteps,
          benchmarkComparison,
        },
      };
    } catch (error) {
      console.error('Error generating application feedback:', error);
      return null;
    }
  }

  /**
   * Calculate scores for role-specific assessment categories including interview performance
   */
  private calculateCategoryScores(submission: any, job: any, includeInterview: boolean = true, applicationStatus?: string): FeedbackScore[] {
    const baseScore = submission.score || 75;
    const submissionQuality = this.analyzeSubmissionQuality(submission);
    const jobAlignment = this.analyzeJobAlignment(submission, job);
    
    // Apply status-specific scoring adjustments
    const statusMultiplier = applicationStatus === 'not_progressing' ? 0.75 : 1.0;
    
    // Get role-specific assessment categories
    const assessmentCategories = this.getRoleSpecificAssessmentCategories(job);
    
    const scores = assessmentCategories.map(category => ({
      category: category.name,
      score: Math.round(this.calculateCategoryScore(category.name, submission, submissionQuality, jobAlignment) * statusMultiplier),
      description: this.getStandardizedDescription(category.name, Math.round(this.calculateCategoryScore(category.name, submission, submissionQuality, jobAlignment) * statusMultiplier)),
      reasoning: this.getStandardCategoryReasoning(category.name),
      icon: category.icon
    }));

    // Interview Performance is now handled by dedicated frontend section
    // No longer include it in keyScores to avoid duplication

    return scores;
  }

  /**
   * Get role-specific assessment categories based on job type
   */
  private getRoleSpecificAssessmentCategories(job: any): Array<{name: string, icon: string}> {
    const jobCategory = job.category?.toLowerCase() || "";
    const jobTitle = job.title?.toLowerCase() || "";
    
    // Marketing roles
    if (jobCategory.includes("marketing") || jobTitle.includes("marketing")) {
      return [
        { name: "Creative Campaign Development", icon: "Lightbulb" },
        { name: "Data Analysis & Insights", icon: "BarChart3" },
        { name: "Written Communication", icon: "MessageSquare" },
        { name: "Strategic Planning", icon: "Target" }
      ];
    }
    
    // Data roles
    if (jobCategory.includes("data") || jobTitle.includes("data") || jobTitle.includes("analyst")) {
      return [
        { name: "Data Processing & Accuracy", icon: "BarChart3" },
        { name: "Analytical Thinking", icon: "Target" },
        { name: "Technical Documentation", icon: "MessageSquare" },
        { name: "Problem-Solving Approach", icon: "Lightbulb" }
      ];
    }
    
    // Content/Writing roles
    if (jobCategory.includes("content") || jobTitle.includes("content") || jobTitle.includes("writer")) {
      return [
        { name: "Creative Writing & Storytelling", icon: "Lightbulb" },
        { name: "Content Strategy", icon: "Target" },
        { name: "Research & Fact-Checking", icon: "BarChart3" },
        { name: "Editorial Quality", icon: "MessageSquare" }
      ];
    }
    
    // Administrative roles
    if (jobCategory.includes("admin") || jobTitle.includes("admin") || jobTitle.includes("assistant")) {
      return [
        { name: "Organisation & Planning", icon: "Target" },
        { name: "Attention to Detail", icon: "BarChart3" },
        { name: "Professional Communication", icon: "MessageSquare" },
        { name: "Process Improvement", icon: "Lightbulb" }
      ];
    }
    
    // Customer service roles
    if (jobCategory.includes("customer") || jobTitle.includes("customer") || jobTitle.includes("support")) {
      return [
        { name: "Customer Communication", icon: "MessageSquare" },
        { name: "Problem Resolution", icon: "Lightbulb" },
        { name: "Empathy & Understanding", icon: "Target" },
        { name: "Process Adherence", icon: "BarChart3" }
      ];
    }
    
    // Default fallback for unknown roles
    return [
      { name: "Professional Communication", icon: "MessageSquare" },
      { name: "Attention to Detail", icon: "BarChart3" },
      { name: "Problem-Solving Skills", icon: "Lightbulb" },
      { name: "Task Organisation", icon: "Target" }
    ];
  }

  /**
   * Calculate score for a specific category based on its name
   */
  private calculateCategoryScore(categoryName: string, submission: any, submissionQuality: any, jobAlignment: any): number {
    // Map category names to existing scoring functions
    switch (categoryName) {
      case "Written Communication":
      case "Professional Communication":
      case "Technical Documentation":
      case "Editorial Quality":
      case "Customer Communication":
        return this.calculateWrittenCommunicationScore(submission, submissionQuality);
      
      case "Data Accuracy":
      case "Data Processing & Accuracy":
      case "Attention to Detail":
      case "Research & Fact-Checking":
      case "Process Adherence":
        return this.calculateDataAccuracyScore(submission, submissionQuality);
      
      case "Creative Thinking":
      case "Creative Campaign Development":
      case "Creative Writing & Storytelling":
      case "Problem Resolution":
      case "Problem-Solving Skills":
      case "Problem-Solving Approach":
      case "Process Improvement":
        return this.calculateCreativeThinkingScore(submission, jobAlignment);
      
      case "Project Organisation":
      case "Strategic Planning":
      case "Organisation & Planning":
      case "Task Organisation":
      case "Analytical Thinking":
      case "Content Strategy":
      case "Empathy & Understanding":
        return this.calculateProjectOrganisationScore(submission, jobAlignment);
      
      case "Data Analysis & Insights":
        return this.calculateDataAccuracyScore(submission, submissionQuality) * 0.7 + 
               this.calculateCreativeThinkingScore(submission, jobAlignment) * 0.3;
      
      default:
        return this.calculateWrittenCommunicationScore(submission, submissionQuality);
    }
  }

  /**
   * Get standardized reasoning for each category
   */
  private getStandardCategoryReasoning(categoryName: string): string {
    const reasoningMap: Record<string, string> = {
      "Creative Campaign Development": "This assessment evaluates your ability to develop creative marketing campaigns that engage target audiences. We look for original ideas, strategic thinking, and the ability to translate concepts into actionable campaign elements.",
      "Data Analysis & Insights": "This assessment evaluates your ability to analyze data and extract meaningful insights for decision-making. We look for analytical thinking, attention to patterns, and the ability to translate data into business recommendations.",
      "Strategic Planning": "This assessment evaluates your ability to think strategically and plan effectively for achieving goals. We look for systematic thinking, consideration of multiple factors, and the ability to create actionable plans.",
      "Data Processing & Accuracy": "This assessment evaluates your ability to handle data with precision and maintain high accuracy standards. We look for systematic approaches, quality control measures, and reliable data handling processes.",
      "Analytical Thinking": "This assessment evaluates your ability to break down complex problems and analyze information systematically. We look for logical reasoning, pattern recognition, and methodical approach to problem-solving.",
      "Technical Documentation": "This assessment evaluates your ability to create clear, accurate technical documentation. We look for clarity, precision, proper structure, and the ability to explain complex concepts in accessible terms.",
      "Creative Writing & Storytelling": "This assessment evaluates your ability to create engaging content that connects with audiences. We look for creativity, narrative skills, audience awareness, and the ability to convey messages effectively.",
      "Content Strategy": "This assessment evaluates your ability to develop strategic approaches to content creation and distribution. We look for audience understanding, platform awareness, and strategic thinking about content goals.",
      "Research & Fact-Checking": "This assessment evaluates your ability to conduct thorough research and verify information accuracy. We look for thoroughness, source credibility assessment, and systematic fact-checking processes.",
      "Editorial Quality": "This assessment evaluates your ability to maintain high editorial standards in content creation. We look for attention to detail, consistency, quality control, and adherence to style guidelines.",
      "Organisation & Planning": "This assessment evaluates your ability to organize tasks and plan effectively for successful outcomes. We look for systematic approaches, priority setting, and efficient workflow management.",
      "Professional Communication": "This assessment evaluates your ability to communicate professionally across different contexts. We look for clarity, appropriate tone, structure, and effectiveness in conveying information.",
      "Process Improvement": "This assessment evaluates your ability to identify and implement process improvements. We look for analytical thinking, innovation, and practical solutions that enhance efficiency and effectiveness.",
      "Customer Communication": "This assessment evaluates your ability to communicate effectively with customers and stakeholders. We look for clarity, empathy, professionalism, and the ability to address needs and concerns.",
      "Problem Resolution": "This assessment evaluates your ability to resolve problems effectively and efficiently. We look for analytical thinking, creativity, persistence, and the ability to find practical solutions.",
      "Empathy & Understanding": "This assessment evaluates your ability to understand and respond to others' perspectives and needs. We look for emotional intelligence, active listening, and the ability to build rapport.",
      "Process Adherence": "This assessment evaluates your ability to follow established processes and procedures consistently. We look for attention to detail, reliability, and commitment to quality standards.",
      "Problem-Solving Skills": "This assessment evaluates your ability to approach and solve problems systematically. We look for logical thinking, creativity, persistence, and the ability to develop effective solutions.",
      "Task Organisation": "This assessment evaluates your ability to organise and manage tasks effectively. We look for planning skills, prioritisation, time management, and systematic approaches to work completion."
    };
    
    return reasoningMap[categoryName] || this.getStandardWrittenCommunicationReasoning();
  }

  /**
   * Analyze submission quality indicators
   */
  private analyzeSubmissionQuality(submission: any): any {
    const textLength = submission.submissionText?.length || 0;
    const hasUrl = Boolean(submission.submissionUrl);
    const feedback = submission.feedback || "";
    
    return {
      textLength,
      hasUrl,
      detailLevel: textLength > 200 ? "high" : textLength > 100 ? "medium" : "low",
      professionalTone: this.assessProfessionalTone(submission.submissionText),
      completeness: hasUrl && textLength > 50 ? "complete" : "partial",
      clarity: this.assessClarity(submission.submissionText),
    };
  }

  /**
   * Analyze job alignment factors
   */
  private analyzeJobAlignment(submission: any, job: any): any {
    const jobType = job.jobType || "full-time";
    const category = job.category || "general";
    const requirements = job.requirements || [];
    
    return {
      jobType,
      category,
      requirements,
      relevance: this.assessRelevance(submission, job),
      innovation: this.assessInnovation(submission, job),
      strategicThinking: this.assessStrategicThinking(submission, job),
    };
  }

  /**
   * Calculate individual category scores
   */
  private calculateWrittenCommunicationScore(submission: any, quality: any): number {
    let score = submission.id === 4 ? 62 : submission.id === 5 ? 75 : 70; // Different base scores per application
    
    // Adjust based on text quality
    if (quality.textLength > 200) score += 10;
    if (quality.professionalTone === "high") score += 8;
    if (quality.clarity === "high") score += 7;
    if (quality.detailLevel === "high") score += 5;
    
    // For application 4, cap at a lower max to reflect non-progressing status
    const maxScore = submission.id === 4 ? 70 : submission.id === 5 ? 85 : 95;
    return Math.min(maxScore, Math.max(45, score));
  }

  private calculateDataAccuracyScore(submission: any, quality: any): number {
    let score = submission.id === 4 ? 58 : submission.id === 5 ? 68 : 68; // Different base scores per application
    
    // Adjust based on submission indicators
    if (quality.completeness === "complete") score += 12;
    if (quality.detailLevel === "high") score += 8;
    if (submission.feedback?.includes("accurate") || submission.feedback?.includes("precise")) score += 10;
    
    // For application 4, cap at a lower max to reflect non-progressing status
    const maxScore = submission.id === 4 ? 68 : submission.id === 5 ? 80 : 95;
    return Math.min(maxScore, Math.max(45, score));
  }

  private calculateCreativeThinkingScore(submission: any, alignment: any): number {
    let score = submission.id === 4 ? 65 : submission.id === 5 ? 78 : 72; // Different base scores per application
    
    // Adjust based on innovation and relevance
    if (alignment.innovation === "high") score += 15;
    if (alignment.relevance === "high") score += 10;
    if (submission.submissionText?.includes("creative") || submission.submissionText?.includes("innovative")) score += 8;
    
    // For application 4, cap at a lower max to reflect non-progressing status
    const maxScore = submission.id === 4 ? 72 : submission.id === 5 ? 88 : 95;
    return Math.min(maxScore, Math.max(45, score));
  }

  private calculateProjectOrganisationScore(submission: any, alignment: any): number {
    let score = submission.id === 4 ? 67 : submission.id === 5 ? 70 : 69; // Different base scores per application
    
    // Adjust based on strategic thinking and structure
    if (alignment.strategicThinking === "high") score += 12;
    if (submission.submissionUrl) score += 8; // Having deliverables shows organisation
    if (submission.submissionText?.includes("timeline") || submission.submissionText?.includes("structure")) score += 10;
    
    // For application 4, cap at a lower max to reflect non-progressing status
    const maxScore = submission.id === 4 ? 75 : submission.id === 5 ? 82 : 95;
    return Math.min(maxScore, Math.max(45, score));
  }

  /**
   * Calculate interview performance score based on standardized scoring model
   */
  private calculateInterviewPerformanceScore(submission: any, baseScore: number): number {
    // Interview score will be set by admin team using standardized criteria
    // For demo purposes, generate a realistic score based on application ID
    const applicationId = submission.applicationId || 1;
    
    // Generate consistent interview scores based on application
    const interviewScores: Record<number, number> = {
      4: 78, // Marketing Assistant - good communication, some areas for development
      5: 82, // Content Writer - strong creative discussion, good rapport
      6: 85, // Employer feedback example - made it through all interviews
    };
    
    return interviewScores[applicationId] || Math.min(100, Math.round(baseScore * 0.9 + Math.random() * 15));
  }

  /**
   * Generate interview performance description
   */
  private getInterviewPerformanceDescription(score: number): string {
    if (score >= 85) return "Excellent interview performance with strong communication and engagement";
    if (score >= 75) return "Strong interview performance with good communication and rapport";
    if (score >= 65) return "Good interview performance with clear communication";
    return "Interview performance shows potential with room for development";
  }

  /**
   * Generate interview performance reasoning
   */
  private getInterviewPerformanceReasoning(submission: any, baseScore: number): string {
    const applicationId = submission.applicationId || 1;
    
    // Application-specific reasoning based on mock interview notes
    const reasoningMap: Record<number, string> = {
      4: "Demonstrated enthusiasm and asked thoughtful questions about company culture. Communication was clear and professional throughout the conversation.",
      5: "Showed strong passion for content creation and had engaging discussion about writing approaches. Good rapport building and clear articulation of ideas.",
      6: "Excellent performance across both Pollen and employer interviews. Strong communication skills, well-prepared responses, and good cultural fit demonstrated throughout the interview process."
    };
    
    return reasoningMap[applicationId] || "Professional communication and good engagement throughout the interview discussion";
  }

  /**
   * Generate standard interview performance reasoning
   */
  private getStandardInterviewPerformanceReasoning(): string {
    return "Professional communication and good engagement throughout the interview discussion";
  }

  /**
   * Helper methods for assessment
   */
  private assessProfessionalTone(text: string): string {
    if (!text) return "low";
    const professionalWords = ["implemented", "developed", "analysed", "demonstrated", "achieved"];
    const matchCount = professionalWords.filter(word => text.toLowerCase().includes(word)).length;
    return matchCount >= 2 ? "high" : matchCount >= 1 ? "medium" : "low";
  }

  private assessClarity(text: string): string {
    if (!text) return "low";
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = text.length / sentences.length;
    return avgSentenceLength < 150 && sentences.length > 2 ? "high" : "medium";
  }

  private assessRelevance(submission: any, job: any): string {
    const jobCategory = job.category?.toLowerCase() || "";
    const submissionText = submission.submissionText?.toLowerCase() || "";
    
    if (jobCategory.includes("marketing") && submissionText.includes("campaign")) return "high";
    if (jobCategory.includes("data") && submissionText.includes("analysis")) return "high";
    if (jobCategory.includes("admin") && submissionText.includes("organisation")) return "high";
    
    return "medium";
  }

  private assessInnovation(submission: any, job: any): string {
    const text = submission.submissionText?.toLowerCase() || "";
    const innovativeWords = ["creative", "innovative", "original", "unique", "improved"];
    const matchCount = innovativeWords.filter(word => text.includes(word)).length;
    return matchCount >= 2 ? "high" : matchCount >= 1 ? "medium" : "low";
  }

  private assessStrategicThinking(submission: any, job: any): string {
    const text = submission.submissionText?.toLowerCase() || "";
    const strategicWords = ["strategy", "plan", "approach", "framework", "methodology"];
    const matchCount = strategicWords.filter(word => text.includes(word)).length;
    return matchCount >= 2 ? "high" : matchCount >= 1 ? "medium" : "low";
  }

  /**
   * Calculate overall score from category scores
   */
  private calculateOverallScore(keyScores: FeedbackScore[]): number {
    const totalScore = keyScores.reduce((sum, score) => sum + score.score, 0);
    return Math.round(totalScore / keyScores.length);
  }

  /**
   * Generate description text for each category
   */
  private getWrittenCommunicationDescription(score: number): string {
    if (score >= 85) return "Excellent written communication throughout the assessment";
    if (score >= 75) return "Strong written communication with clear structure";
    if (score >= 65) return "Good written communication with minor areas for improvement";
    return "Written communication shows potential with room for development";
  }

  private getDataAccuracyDescription(score: number): string {
    if (score >= 85) return "Outstanding attention to detail and data accuracy";
    if (score >= 75) return "Strong attention to detail in data handling";
    if (score >= 65) return "Good attention to detail with minor accuracy issues";
    return "Data handling shows promise with room for improvement";
  }

  private getCreativeThinkingDescription(score: number): string {
    if (score >= 85) return "Exceptional creative problem-solving and innovative thinking";
    if (score >= 75) return "Strong creative approach with innovative solutions";
    if (score >= 65) return "Good creative thinking with some innovative elements";
    return "Creative thinking demonstrated with potential for development";
  }

  private getProjectOrganisationDescription(score: number): string {
    if (score >= 85) return "Excellent project organisation and strategic planning";
    if (score >= 75) return "Strong project management approach with good planning";
    if (score >= 65) return "Good project organisation with some planning gaps";
    return "Project organisation shows potential with room for improvement";
  }

  /**
   * Standardized grading descriptors for all applications
   */
  private getStandardizedDescription(category: string, score: number): string {
    const gradeLevel = this.getGradeLevel(score);
    
    // Create base descriptions for each grade level
    const baseDescriptions = {
      "Excellent": "Outstanding",
      "Strong": "Strong", 
      "Developing": "Developing",
      "Foundation": "Foundation-level"
    };

    // Role-specific category descriptions
    const categoryDescriptions = {
      "Creative Campaign Development": {
        "Excellent": "Outstanding creative campaign development with innovative concepts and strategic execution",
        "Strong": "Strong creative campaign development with good conceptual thinking and practical application",
        "Developing": "Developing creative campaign skills with potential for more innovative and strategic approaches",
        "Foundation": "Foundation-level creative campaign development requiring focused development in conceptual thinking"
      },
      "Data Analysis & Insights": {
        "Excellent": "Exceptional data analysis with clear insights and actionable recommendations",
        "Strong": "Strong data analysis skills with good insight generation and clear interpretation",
        "Developing": "Developing data analysis skills with awareness of methodology but needing stronger insight generation",
        "Foundation": "Foundation-level data analysis requiring development of analytical thinking and insight extraction"
      },
      "Strategic Planning": {
        "Excellent": "Outstanding strategic planning with comprehensive analysis and systematic approach",
        "Strong": "Strong strategic planning with good analysis and structured thinking",
        "Developing": "Developing strategic planning skills with understanding of concepts but needing systematic approaches",
        "Foundation": "Foundation-level strategic planning requiring development of analytical and planning skills"
      },
      "Data Processing & Accuracy": {
        "Excellent": "Exceptional data processing with high accuracy standards and systematic verification",
        "Strong": "Strong data processing with good accuracy and reliable methods",
        "Developing": "Developing data processing skills with awareness of accuracy importance but needing stronger processes",
        "Foundation": "Foundation-level data processing requiring development of accuracy and verification skills"
      },
      "Analytical Thinking": {
        "Excellent": "Outstanding analytical thinking with logical reasoning and systematic problem-solving",
        "Strong": "Strong analytical thinking with good logical reasoning and structured approach",
        "Developing": "Developing analytical thinking skills with potential for more systematic and logical approaches",
        "Foundation": "Foundation-level analytical thinking requiring development of logical reasoning and systematic analysis"
      },
      "Technical Documentation": {
        "Excellent": "Outstanding technical documentation with clarity, precision, and comprehensive coverage",
        "Strong": "Strong technical documentation with good clarity and structured presentation",
        "Developing": "Developing technical documentation skills with potential for improvement in clarity and structure",
        "Foundation": "Foundation-level technical documentation requiring focused development in clarity and precision"
      },
      "Creative Writing & Storytelling": {
        "Excellent": "Exceptional creative writing with engaging storytelling and audience connection",
        "Strong": "Strong creative writing with good narrative skills and audience awareness",
        "Developing": "Developing creative writing skills with potential for more engaging and strategic storytelling",
        "Foundation": "Foundation-level creative writing requiring development of narrative and storytelling skills"
      },
      "Content Strategy": {
        "Excellent": "Outstanding content strategy with strategic thinking and audience understanding",
        "Strong": "Strong content strategy with good strategic approach and audience awareness",
        "Developing": "Developing content strategy skills with understanding of concepts but needing strategic thinking",
        "Foundation": "Foundation-level content strategy requiring development of strategic thinking and audience analysis"
      },
      "Research & Fact-Checking": {
        "Excellent": "Exceptional research and fact-checking with thoroughness and source credibility assessment",
        "Strong": "Strong research and fact-checking with good thoroughness and verification methods",
        "Developing": "Developing research and fact-checking skills with awareness of importance but needing systematic approaches",
        "Foundation": "Foundation-level research and fact-checking requiring development of verification and source assessment skills"
      },
      "Organisation & Planning": {
        "Excellent": "Outstanding organisation and planning with systematic approaches and effective priority setting",
        "Strong": "Strong organisation and planning with good systematic approach and priority management",
        "Developing": "Developing organisation and planning skills with understanding of principles but needing systematic approaches",
        "Foundation": "Foundation-level organisation and planning requiring development of systematic and priority management skills"
      },
      "Professional Communication": {
        "Excellent": "Outstanding professional communication with clarity, appropriate tone, and effective messaging",
        "Strong": "Strong professional communication with good clarity and appropriate tone",
        "Developing": "Developing professional communication skills with potential for improvement in clarity and tone",
        "Foundation": "Foundation-level professional communication requiring focused development in clarity and professionalism"
      },
      "Process Improvement": {
        "Excellent": "Exceptional process improvement with innovative solutions and practical implementation",
        "Strong": "Strong process improvement with good analytical thinking and practical solutions",
        "Developing": "Developing process improvement skills with awareness of concepts but needing innovative approaches",
        "Foundation": "Foundation-level process improvement requiring development of analytical thinking and solution generation"
      },
      "Customer Communication": {
        "Excellent": "Outstanding customer communication with empathy, clarity, and effective problem resolution",
        "Strong": "Strong customer communication with good empathy and clear problem-solving approach",
        "Developing": "Developing customer communication skills with potential for improvement in empathy and clarity",
        "Foundation": "Foundation-level customer communication requiring development of empathy and professional interaction skills"
      },
      "Problem Resolution": {
        "Excellent": "Exceptional problem resolution with creative solutions and systematic approach",
        "Strong": "Strong problem resolution with good analytical thinking and practical solutions",
        "Developing": "Developing problem resolution skills with potential for more creative and systematic approaches",
        "Foundation": "Foundation-level problem resolution requiring development of analytical thinking and solution generation"
      },
      "Empathy & Understanding": {
        "Excellent": "Outstanding empathy and understanding with strong emotional intelligence and rapport building",
        "Strong": "Strong empathy and understanding with good emotional intelligence and interpersonal skills",
        "Developing": "Developing empathy and understanding skills with potential for improvement in emotional intelligence",
        "Foundation": "Foundation-level empathy and understanding requiring development of emotional intelligence and interpersonal skills"
      },
      "Process Adherence": {
        "Excellent": "Exceptional process adherence with consistency, reliability, and quality commitment",
        "Strong": "Strong process adherence with good consistency and quality standards",
        "Developing": "Developing process adherence skills with awareness of importance but needing consistency improvement",
        "Foundation": "Foundation-level process adherence requiring development of consistency and quality control habits"
      },
      "Problem-Solving Skills": {
        "Excellent": "Outstanding problem-solving skills with logical thinking, creativity, and effective solutions",
        "Strong": "Strong problem-solving skills with good logical thinking and practical solutions",
        "Developing": "Developing problem-solving skills with potential for more logical and creative approaches",
        "Foundation": "Foundation-level problem-solving requiring development of logical thinking and solution generation"
      },
      "Task Organisation": {
        "Excellent": "Outstanding task organisation with effective planning, prioritisation, and time management",
        "Strong": "Strong task organisation with good planning and priority management",
        "Developing": "Developing task organisation skills with understanding of principles but needing systematic approaches",
        "Foundation": "Foundation-level task organisation requiring development of planning and priority management skills"
      }
    };

    // Add fallback for original categories
    const originalCategories = {
      "Written Communication": categoryDescriptions["Professional Communication"],
      "Data Accuracy": categoryDescriptions["Data Processing & Accuracy"],
      "Creative Thinking": categoryDescriptions["Problem-Solving Skills"],
      "Project Organisation": categoryDescriptions["Organisation & Planning"]
    };

    // Merge original categories with new ones
    const allCategories = { ...categoryDescriptions, ...originalCategories };

    return allCategories[category]?.[gradeLevel] || `${gradeLevel} performance in ${category.toLowerCase()}`;
  }

  private getGradeLevel(score: number): string {
    if (score >= 80) return "Excellent";
    if (score >= 70) return "Strong";
    if (score >= 60) return "Developing";
    return "Foundation";
  }

  /**
   * Standard explanations for how each skills challenge category is evaluated
   */
  private getStandardWrittenCommunicationReasoning(): string {
    return "This assessment evaluates your ability to communicate clearly and professionally in written format. We look for appropriate tone, clear structure, comprehensive explanations, and the ability to convey complex ideas in an accessible way. Strong written communication demonstrates professionalism and helps build effective working relationships.";
  }

  private getStandardDataAccuracyReasoning(): string {
    return "This assessment evaluates your attention to detail and accuracy when handling information, data, or requirements. We look for thoroughness, systematic checking processes, and the ability to deliver error-free work. Strong data accuracy shows reliability and helps prevent costly mistakes in professional environments.";
  }

  private getStandardCreativeThinkingReasoning(): string {
    return "This assessment evaluates your ability to generate innovative ideas and approach problems from fresh perspectives. We look for originality, strategic thinking, and the ability to develop creative solutions that align with business objectives. Strong creative thinking demonstrates adaptability and helps drive innovation in the workplace.";
  }

  private getStandardProjectOrganisationReasoning(): string {
    return "This assessment evaluates your ability to plan, structure, and manage tasks effectively. We look for systematic approaches, timeline consideration, resource planning, and the ability to break down complex projects into manageable components. Strong project organisation demonstrates efficiency and helps ensure successful project delivery.";
  }



  // Detailed feedback methods for not_progressing status
  private getDetailedWrittenCommunicationDescription(score: number): string {
    if (score >= 60) return "Written communication demonstrates basic competency with clear potential for professional development";
    if (score >= 45) return "Written communication shows foundation skills but requires focused improvement in clarity and professional tone";
    return "Written communication needs significant development to meet professional standards, though foundational elements are present";
  }

  private getDetailedDataAccuracyDescription(score: number): string {
    if (score >= 60) return "Data handling shows careful attention to basic requirements with room to develop more systematic checking processes";
    if (score >= 45) return "Data accuracy demonstrates awareness of importance but requires stronger verification and quality control habits";
    return "Data accuracy needs substantial improvement with focus on developing systematic checking processes and attention to detail";
  }

  private getDetailedCreativeThinkingDescription(score: number): string {
    if (score >= 60) return "Creative thinking shows willingness to explore ideas with potential for developing more innovative approaches";
    if (score >= 45) return "Creative thinking demonstrates basic problem-solving but lacks the depth and originality expected for this role";
    return "Creative thinking requires significant development to generate fresh ideas and innovative solutions for marketing challenges";
  }

  private getDetailedProjectOrganisationDescription(score: number): string {
    if (score >= 60) return "Project organisation shows understanding of basic planning principles with room to develop more strategic approaches";
    if (score >= 45) return "Project organisation demonstrates awareness of structure but lacks the systematic approach needed for complex tasks";
    return "Project organisation needs significant improvement in planning, prioritisation, and systematic task management";
  }

  // Detailed reasoning methods for not_progressing status
  private getDetailedWrittenCommunicationReasoning(submission: any, submissionQuality: any): string {
    const issues = [];
    if (submissionQuality.detailLevel === "low") issues.push("responses lack sufficient detail and explanation");
    if (submissionQuality.professionalTone === "low") issues.push("language needs to be more professional and polished");
    if (submissionQuality.clarity === "low") issues.push("ideas could be expressed more clearly and concisely");
    
    const baseReasoning = "While the submission shows understanding of basic communication principles, ";
    if (issues.length > 0) {
      return baseReasoning + issues.join(", ") + ". With focused practice on professional writing standards, this area can be significantly improved.";
    }
    return baseReasoning + "there's room for improvement in developing a more engaging and persuasive communication style that would resonate better with target audiences.";
  }

  private getDetailedDataAccuracyReasoning(submission: any, submissionQuality: any): string {
    const issues = [];
    if (submissionQuality.detailLevel === "low") issues.push("data analysis lacks depth and thorough verification");
    if (!submission.submissionText?.includes("data") && !submission.submissionText?.includes("analysis")) {
      issues.push("limited evidence of systematic data handling processes");
    }
    
    const baseReasoning = "The assessment shows awareness of data importance, but ";
    if (issues.length > 0) {
      return baseReasoning + issues.join(" and ") + ". Developing stronger checking processes and analytical thinking would improve accuracy and reliability.";
    }
    return baseReasoning + "there's opportunity to develop more rigorous verification methods and attention to detail that would meet professional standards.";
  }

  private getDetailedCreativeThinkingReasoning(submission: any, jobAlignment: any): string {
    const creativity = this.assessInnovation(submission, { category: "marketing" });
    const strategic = this.assessStrategicThinking(submission, { category: "marketing" });
    
    const baseReasoning = "Creative elements in the submission show potential, but ";
    if (creativity === "low" && strategic === "low") {
      return baseReasoning + "ideas lack originality and strategic depth. The response follows conventional approaches without exploring innovative solutions that could differentiate the brand or campaign.";
    }
    if (creativity === "low") {
      return baseReasoning + "ideas tend to be conventional rather than innovative. Developing fresh perspectives and unique approaches would strengthen creative contributions.";
    }
    if (strategic === "low") {
      return baseReasoning + "creative ideas lack strategic foundation. Connecting creative concepts to business objectives and target audience needs would improve effectiveness.";
    }
    return baseReasoning + "there's room to push boundaries further and develop more distinctive creative solutions that would capture audience attention.";
  }

  private getDetailedProjectOrganisationReasoning(submission: any, jobAlignment: any): string {
    const strategic = this.assessStrategicThinking(submission, { category: "marketing" });
    const textLength = submission.submissionText?.length || 0;
    
    const baseReasoning = "Project organisation demonstrates basic understanding, but ";
    if (strategic === "low" && textLength < 150) {
      return baseReasoning + "planning lacks systematic approach and strategic depth. The response shows minimal evidence of structured thinking or methodical task management.";
    }
    if (strategic === "low") {
      return baseReasoning + "planning lacks strategic framework and long-term thinking. Developing systematic approaches to project management would improve outcomes.";
    }
    if (textLength < 150) {
      return baseReasoning + "organisation needs more detailed planning and structured approach. Breaking down complex tasks into manageable components would improve execution.";
    }
    return baseReasoning + "there's opportunity to develop more sophisticated project management skills including timeline planning, resource allocation, and risk management.";
  }

  /**
   * Generate reasoning text for each category
   */
  private getWrittenCommunicationReasoning(submission: any, quality: any): string {
    const reasons = [];
    if (quality.professionalTone === "high") reasons.push("professional tone maintained throughout");
    if (quality.clarity === "high") reasons.push("clear and well-structured communication");
    if (quality.detailLevel === "high") reasons.push("comprehensive detail provided");
    if (quality.textLength > 200) reasons.push("thorough written explanations");
    
    return reasons.length > 0 
      ? `${reasons.join(", ")} demonstrated strong communication skills`
      : "Communication style and structure show good potential for professional development";
  }

  private getDataAccuracyReasoning(submission: any, quality: any): string {
    const reasons = [];
    if (quality.completeness === "complete") reasons.push("complete submission with all required elements");
    if (quality.detailLevel === "high") reasons.push("detailed attention to requirements");
    if (submission.feedback?.includes("accurate")) reasons.push("accurate execution of tasks");
    
    return reasons.length > 0
      ? `${reasons.join(", ")} shows careful approach to detail`
      : "Data handling approach demonstrates understanding with room for refinement";
  }

  private getCreativeThinkingReasoning(submission: any, alignment: any): string {
    const reasons = [];
    if (alignment.innovation === "high") reasons.push("innovative solutions demonstrated");
    if (alignment.relevance === "high") reasons.push("creative approaches aligned with role requirements");
    if (submission.submissionText?.includes("creative")) reasons.push("creative problem-solving evident");
    
    return reasons.length > 0
      ? `${reasons.join(", ")} throughout the assessment`
      : "Creative approach shows good foundation for role development";
  }

  private getProjectOrganisationReasoning(submission: any, alignment: any): string {
    const reasons = [];
    if (alignment.strategicThinking === "high") reasons.push("strategic approach to project planning");
    if (submission.submissionUrl) reasons.push("organised delivery of project components");
    if (submission.submissionText?.includes("timeline")) reasons.push("structured timeline consideration");
    
    return reasons.length > 0
      ? `${reasons.join(", ")} demonstrated throughout submission`
      : "Project approach shows good organisational foundation with room for development";
  }

  /**
   * Generate strengths and improvement areas
   */
  private generateStrengths(keyScores: FeedbackScore[], submission: any, applicationStatus?: string): string[] {
    const strengths = [];
    
    // For not_progressing applications, return empty array - no strengths shown
    if (applicationStatus === 'not_progressing') {
      return []; // Empty array for not_progressing applications
    }
    
    // For progressing applications, use entry-level appropriate language
    const topScores = keyScores.filter(score => score.score >= 80);
    topScores.forEach(score => {
      const categoryMap: { [key: string]: string } = {
        'creative campaign development': 'You have a natural talent for creative thinking and coming up with fresh ideas',
        'data analysis & insights': 'You show great potential for understanding numbers and spotting important patterns',
        'written communication': 'You communicate clearly and professionally in writing',
        'strategic planning': 'You think through problems systematically and plan well',
        'professional communication': 'You express yourself clearly and professionally',
        'data processing & accuracy': 'You pay excellent attention to detail and handle information carefully',
        'problem-solving skills': 'You approach challenges with creativity and logical thinking',
        'organisation & planning': 'You naturally organise tasks and think ahead'
      };
      
      const friendlyDescription = categoryMap[score.category.toLowerCase()] || `You show real strength in ${score.category.toLowerCase()}`;
      strengths.push(friendlyDescription);
    });
    
    // Add encouraging specific strengths based on submission
    if (submission.feedback?.includes("excellent")) {
      strengths.push("You tackled the assessment tasks with confidence and enthusiasm");
    }
    if (submission.submissionUrl) {
      strengths.push("You present your work clearly and thoughtfully");
    }
    if (submission.submissionText?.length > 300) {
      strengths.push("You take time to think things through and explain your reasoning");
    }
    
    return strengths.slice(0, 4); // Limit to 4 strengths
  }

  private generateImprovementAreas(keyScores: FeedbackScore[], submission: any): string[] {
    const improvements = [];
    
    // Add categories that scored below 75 with encouraging language
    const weakerScores = keyScores.filter(score => score.score < 75);
    weakerScores.forEach(score => {
      const categoryMap: { [key: string]: string } = {
        'creative campaign development': 'Try exploring more creative brainstorming techniques and gathering inspiration from different sources',
        'data analysis & insights': 'Practice working with numbers and data - start with simple spreadsheets and online tutorials',
        'written communication': 'Continue developing your writing skills through practice and reading professional examples',
        'strategic planning': 'Work on breaking down big problems into smaller steps and thinking about long-term goals',
        'professional communication': 'Practice professional communication in different settings to build confidence',
        'data processing & accuracy': 'Take your time with details and develop checking habits to catch small errors',
        'problem-solving skills': 'Practice approaching problems from different angles and asking "what if" questions',
        'organisation & planning': 'Try using simple planning tools and creating to-do lists to stay organised'
      };
      
      const friendlyGuidance = categoryMap[score.category.toLowerCase()] || `Continue developing your ${score.category.toLowerCase()} abilities with practice`;
      improvements.push(friendlyGuidance);
    });
    
    // Add encouraging general improvement suggestions
    improvements.push("Practice explaining your ideas in simple, clear language that anyone can understand");
    improvements.push("Build confidence by taking on small challenges and celebrating your progress");
    
    return improvements.slice(0, 3); // Limit to 3 improvement areas
  }

  private generateStandardizedBlurb(job: any): string {
    const category = job.category || "general";
    const jobType = job.jobType || "role";
    
    return `This assessment evaluated your suitability for ${category} ${jobType} positions through practical tasks relevant to the role requirements. We assessed your approach to real-world scenarios, communication skills, attention to detail, and problem-solving abilities. Your scores reflect a careful evaluation of how you approached each task, the quality of your work, and your alignment with the role requirements. These insights help employers understand your strengths and potential for development.`;
  }

  private generateNextSteps(keyScores: FeedbackScore[], job: any, status?: string): string {
    const category = job.category || "general";
    const topSkill = keyScores.reduce((prev, current) => prev.score > current.score ? prev : current);
    
    // Provide status-appropriate next steps
    switch (status) {
      case 'interview_invited':
        return `Great work on your skills assessment! Your performance shows strong potential for this ${category} role. Next step: book your Pollen screening call to discuss your application and explore how your skills align with the position.`;
      
      case 'interview_scheduled':
        return `Your skills assessment results look promising. Your screening call is scheduled - prepare to discuss your ${topSkill.category.toLowerCase()} experience and ask questions about the role and company culture.`;
      
      case 'pollen_feedback':
        return `Well done on your Pollen screening call! Based on your assessment performance and interview, you're progressing to the employer stage. Continue showcasing your ${topSkill.category.toLowerCase()} strengths.`;
      
      case 'employer_feedback':
        return `You've completed the full process - congratulations! Whether or not this specific role works out, you've gained valuable experience and feedback. Use these insights to strengthen future applications.`;
      
      case 'not_progressing':
        return `While you won't be progressing with this particular role, your assessment shows clear potential. Focus on developing your ${topSkill.category.toLowerCase()} skills further and keep applying to similar positions where your strengths can shine.`;
      
      default:
        return `Your assessment shows real potential for ${category} roles! Keep applying to similar positions where your strengths can shine. Focus on roles that value ${topSkill.category.toLowerCase()} abilities, and remember that every application is practice that helps you grow.`;
    }
  }

  /**
   * Calculate benchmark comparison
   */
  private async calculateBenchmarkComparison(overallScore: number, category: string): Promise<any> {
    // In production, this would query actual database statistics
    // For now, using realistic benchmarks based on score
    const averageScore = 65;
    const topPercentile = 85;
    
    // Simulate getting total candidates for this category
    const totalCandidates = Math.floor(Math.random() * 200) + 50;
    
    return {
      averageScore,
      topPercentile,
      totalCandidates,
    };
  }

  /**
   * Generate dynamic feedback using employer checkpoint configuration
   * This method demonstrates how scoring categories are determined from job requirements
   */
  async generateDynamicApplicationFeedback(applicationId: number): Promise<ApplicationFeedback | null> {
    try {
      // Get application and job data
      const application = await storage.getApplicationById(applicationId);
      if (!application) return null;

      // In production, this would come from employer checkpoint configuration
      // For demonstration, create a sample configuration
      const challengeConfig: ChallengeConfiguration = {
        jobId: application.jobId,
        challengeType: 'communication', // From employer checkpoint 2
        roleCategory: 'analytical', // From employer checkpoint 1 (task selections)
        companyPriorities: ['attention_to_detail', 'cultural_fit'], // From employer checkpoint 3
        taskComplexity: 'entry_level', // Platform default for 18-30 demographic
        customRequirements: {
          communicationStyle: 'professional_but_warm', // From employer checkpoint 2
          qualityStandards: 'high_accuracy_required', // From employer checkpoint 3
          pressureScenarios: ['multiple_deadlines', 'client_complaints'] // From employer checkpoint 4
        }
      };

      // Generate dynamic scoring categories based on employer configuration
      const scoringCategories = await dynamicScoringSystem.generateScoringCategories(challengeConfig);

      // Get submissions for this application
      let submissions = await storage.getChallengeSubmissionsByApplication(applicationId);
      if (!submissions || submissions.length === 0) {
        // Create fallback submission for demonstration
        submissions = [{
          id: 1,
          applicationId: applicationId,
          challengeId: 1,
          submissionUrl: "https://example.com/submission",
          submissionText: "Completed assessment with systematic approach to data analysis. Demonstrated clear communication in explaining methodology and findings.",
          score: Math.floor(parseFloat(application.matchScore)) || 75,
          feedback: application.notes || "Good performance on assessment",
          submittedAt: application.submittedAt,
          reviewedAt: application.updatedAt
        }];
      }

      // Score the submission using dynamic categories
      const { categoryScores, overallScore } = await dynamicScoringSystem.scoreSubmission(
        submissions[0].id, 
        scoringCategories
      );

      // Generate contextual feedback
      const strengthsHighlighted = this.generateDynamicStrengths(categoryScores);
      const areasForImprovement = this.generateDynamicImprovements(categoryScores);
      const standardizedBlurb = this.generateDynamicBlurb(challengeConfig);
      const nextSteps = this.generateDynamicNextSteps(categoryScores, challengeConfig);

      return {
        applicationId: applicationId.toString(),
        jobTitle: "Marketing Assistant", // From job data
        company: "TechFlow Solutions", // From job data
        submittedAt: application.submittedAt?.toISOString() || new Date().toISOString(),
        status: application.status,
        overallScore,
        feedback: {
          keyScores: categoryScores,
          strengthsHighlighted,
          areasForImprovement,
          standardizedBlurb,
          nextSteps,
          benchmarkComparison: await this.calculateBenchmarkComparison(overallScore, challengeConfig.roleCategory)
        }
      };
    } catch (error) {
      console.error('Error generating dynamic application feedback:', error);
      return null;
    }
  }

  /**
   * Generate strengths based on dynamic category performance
   */
  private generateDynamicStrengths(categoryScores: any[]): string[] {
    const strengths: string[] = [];
    
    categoryScores.forEach(category => {
      if (category.score >= 80) {
        strengths.push(`Strong ${category.category.toLowerCase()} demonstrated throughout assessment`);
      } else if (category.score >= 70) {
        strengths.push(`Good ${category.category.toLowerCase()} skills shown in challenge completion`);
      }
    });
    
    return strengths.slice(0, 4); // Limit to top 4 strengths
  }

  /**
   * Generate improvement areas based on dynamic category performance
   */
  private generateDynamicImprovements(categoryScores: any[]): string[] {
    const improvements: string[] = [];
    
    categoryScores.forEach(category => {
      if (category.score < 65) {
        improvements.push(`Consider developing ${category.category.toLowerCase()} skills further`);
      }
    });
    
    // Add general improvements if none specific
    if (improvements.length === 0) {
      improvements.push("Continue building confidence in time-pressured scenarios");
      improvements.push("Practice presenting complex information in simplified formats");
    }
    
    return improvements.slice(0, 3); // Limit to top 3 improvements
  }

  /**
   * Generate standardized blurb based on challenge configuration
   */
  private generateDynamicBlurb(config: ChallengeConfiguration): string {
    const challengeTypes = {
      communication: "professional communication and stakeholder interaction",
      quality_control: "attention to detail and quality assurance",
      pressure_management: "working under pressure and managing multiple priorities",
      role_specific: "role-specific competencies and practical application"
    };

    const roleDescriptions = {
      analytical: "analytical thinking and data-driven decision making",
      creative: "creative problem-solving and innovative thinking",
      technical: "technical competency and systematic approach",
      project_management: "project coordination and organizational skills"
    };

    return `This assessment evaluated your suitability for ${config.roleCategory} roles through practical tasks focusing on ${challengeTypes[config.challengeType]}. We assessed your ${roleDescriptions[config.roleCategory]}, along with ${config.companyPriorities.join(' and ')} based on the specific requirements of this position.`;
  }

  /**
   * Generate next steps based on dynamic scoring results
   */
  private generateDynamicNextSteps(categoryScores: any[], config: ChallengeConfiguration): string {
    const topCategory = categoryScores.reduce((prev, current) => 
      (prev.score > current.score) ? prev : current
    );

    const roleAdvice = {
      analytical: "data analysis and research positions",
      creative: "creative and marketing roles",
      technical: "technical and development positions",
      project_management: "coordination and project management roles"
    };

    return `Based on your strong performance in ${topCategory.category}, you're well-suited for ${roleAdvice[config.roleCategory]}. Focus on highlighting your ${topCategory.category.toLowerCase()} skills in future applications and continue developing the areas identified for improvement.`;
  }

  /**
   * Generate different status examples based on application ID
   */
  private generateStatusExamples(applicationId: number): { status: string; standardizedBlurb: string; nextSteps: string; isPersonalized?: boolean; pollenTeamNote?: string } {
    const statusOptions = [
      {
        status: 'under_review',
        standardizedBlurb: 'Your application is currently being reviewed by our team. We carefully assess each candidate based on their skills demonstration, behavioral fit, and alignment with the role requirements.',
        nextSteps: 'We will update you within 48 hours with either feedback on your assessment or next steps if you progress to the interview stage.'
      },
      {
        status: 'interview_invited',
        standardizedBlurb: 'Congratulations! Your application has progressed to the interview stage. You performed well in the assessment and show strong potential for this role.',
        nextSteps: 'Please book your interview using the link provided. You\'ll first speak with the Pollen team, followed by the employer interview if you progress.'
      },
      {
        status: 'interview_scheduled',
        standardizedBlurb: 'Your interviews are scheduled and we\'re excited to speak with you. Your assessment demonstrated strong skills and good cultural alignment.',
        nextSteps: 'Prepare for your Pollen team interview, then potentially the employer interview. Review the job requirements and think about specific examples of your work.'
      },
      {
        status: 'pollen_feedback',
        standardizedBlurb: 'You completed your Pollen team interview and while you won\'t be progressing to the employer interview for this specific role, you showed strong potential in several areas.',
        nextSteps: 'Use this detailed feedback to strengthen future applications. Based on your interview performance and assessment results, we\'ll continue matching you with roles that align with your strengths.',
        isPersonalized: true,
        pollenTeamNote: 'Hi Zara! I really enjoyed our conversation about your interest in marketing roles. You showed great enthusiasm and asked thoughtful questions about the company culture. Your creative thinking during our discussion about campaign ideas was impressive. \n\nYour assessment demonstrated strong creative problem-solving skills and clear communication abilities. The way you approached the marketing challenges showed genuine interest in understanding how campaigns work and connect with audiences. \n\nI\'d recommend highlighting your storytelling abilities and any social media or content creation activities in future applications. Keep an eye out for Content Marketing Assistant or Social Media Coordinator roles - I think you\'d be a great fit! \n\nFeel free to message me if you have any questions about your job search. \n\nBest wishes, \nThe Pollen Team'
      },
      {
        status: 'employer_feedback',
        standardizedBlurb: 'You completed your interviews with the employer and while you won\'t be receiving an offer for this specific role, you performed well and gained valuable interview experience.',
        nextSteps: 'Use this comprehensive feedback to strengthen future applications. Your interview performance shows you\'re ready for similar roles, and we\'ll continue matching you with relevant opportunities.',
        isPersonalized: true,
        pollenTeamNote: 'Hi Zara! You should be proud of making it through to the employer interview stage - that\'s a significant achievement! The employer was impressed with your enthusiasm and found you engaging to speak with. \n\nThey particularly noted your creative thinking and the questions you asked about the role and company culture. Your preparation really showed through in the conversation. \n\nWhile they\'ve decided to go with another candidate for this position, they specifically mentioned that you\'d be a strong fit for similar roles in the future. The feedback was very positive overall. \n\nKeep applying with confidence - you\'re clearly interview-ready and employers are responding well to your approach. We\'ll make sure to put you forward for similar opportunities. \n\nWell done on this progress! \n\nBest wishes, \nThe Pollen Team',
        employerFeedbackNote: 'Thank you for taking the time to interview with our team. We were impressed by your enthusiasm for marketing and your thoughtful questions about our company culture and values. Your communication skills were excellent throughout both interview rounds.\n\nYour assessment demonstrated strong creative problem-solving abilities and clear analytical thinking. We particularly appreciated your strategic approach to the campaign planning exercise and your ability to consider both creative and data-driven elements.\n\nWhile we\'ve decided to move forward with another candidate whose working style and availability better aligned with our current team dynamics and project timeline, we were genuinely impressed by your potential. Your interview performance showed great promise for marketing roles, especially in areas requiring creative thinking and strategic planning.\n\nWe encourage you to continue applying for marketing positions where your skills in campaign development and audience analysis will be highly valued. Thank you again for your interest in InnovateCorp.\n\nBest wishes for your job search,\nThe InnovateCorp Hiring Team'
      },
      {
        status: 'not_progressing',
        standardizedBlurb: 'While your application won\'t be progressing to the next stage, you showed potential in several areas.',
        nextSteps: 'Review the feedback provided and consider applying for other roles that align with your strengths. We\'re here to support your continued development.'
      },
      {
        status: 'job_offered',
        standardizedBlurb: 'Excellent news! The employer has extended a job offer following your successful interviews.',
        nextSteps: 'Review the offer details carefully and respond within the timeframe provided. Congratulations on your successful application!'
      }
    ];

    // Use application ID to determine which status example to show
    // Application 4: not_progressing (early rejection)
    // Application 5: pollen_feedback (rejected after Pollen interview) 
    // Application 6: employer_feedback (rejected after employer interviews)
    // Application 7: job_offered (successful application with job offer)
    let selectedIndex = applicationId % statusOptions.length;
    if (applicationId === 4) {
      selectedIndex = 5; // Force to not_progressing status - no personalized feedback
    } else if (applicationId === 5) {
      selectedIndex = 3; // Force to pollen_feedback status - has personalized feedback
    } else if (applicationId === 6) {
      selectedIndex = 4; // Force to employer_feedback status - has personalized feedback
    } else if (applicationId === 7) {
      selectedIndex = 6; // Force to job_offered status - job offer received
    }
    
    let selectedStatus = statusOptions[selectedIndex];
    
    // Customize pollen feedback based on application ID
    if (applicationId === 5 && selectedStatus.status === 'pollen_feedback') {
      selectedStatus = {
        ...selectedStatus,
        isPersonalized: true,
        pollenTeamNote: 'Hi Zara! Thanks for taking the time to chat with us about the Content Writer position. Your passion for storytelling and creative writing really came through in our conversation. You had some great ideas about content strategy and showed good understanding of audience engagement. \n\nYour assessment demonstrated strong creativity and voice, which are key strengths for content roles. The way you adapted your writing style for different scenarios showed real versatility and understanding of how to connect with various audiences. \n\nYour creative writing skills and fresh perspective would be valuable assets for many content-focused positions. I\'d suggest highlighting your storytelling abilities and any social media content you\'ve created in future applications. \n\nKeep an eye out for Content Creator or Social Media Writer roles - they might be perfect matches for your skills! \n\nFeel free to reach out if you have questions about your job search. \n\nBest wishes, \nThe Pollen Team'
      };
    }

    // Customize employer feedback based on application ID  
    if (applicationId === 6 && selectedStatus.status === 'employer_feedback') {
      selectedStatus = {
        ...selectedStatus,
        isPersonalized: true,
        standardizedBlurb: "You completed interviews with both our team and the employer. While InnovateCorp has decided to move forward with another candidate, they provided detailed feedback about your performance.",
        nextSteps: "The employer feedback shows strong potential for marketing roles. Continue applying for similar positions where your campaign thinking and communication skills will be valued.",
        pollenTeamNote: 'Hi Zara! \n\nFantastic effort making it through to the employer interview stage with InnovateCorp - this is a real achievement! \n\n**Employer Feedback Summary:** \nThe hiring manager was impressed with your enthusiasm for marketing and your thoughtful questions about their campaigns. They specifically noted your creative approach to their campaign brief and your understanding of target audience segmentation. \n\nYour communication style came across as professional and engaging, and they appreciated how you connected your personal interests to the role requirements. The team felt you demonstrated good potential for growth in a marketing environment. \n\n**Why they chose another candidate:** \nThey went with someone whose working style and availability better aligned with their current team dynamics and immediate project timeline. This was purely about team fit and timing - not your capabilities or potential. \n\n**What this means:** \nYou\'re clearly interview-ready and employers are responding positively to your approach. Marketing Coordinator roles are perfect for your interests and demonstrated abilities. \n\nKeep applying with confidence! \n\nBest wishes, \nThe Pollen Team'
      };
    }

    // Customize job offer feedback for application ID 7
    if (applicationId === 7 && selectedStatus.status === 'job_offered') {
      selectedStatus = {
        ...selectedStatus,
        standardizedBlurb: 'Congratulations! Tech Startup has extended a job offer for the Data Analyst position following your exceptional interview performance.',
        nextSteps: 'Review the complete offer details in your messages, including salary (£32,000), benefits, and start date. Please respond to the employer with your decision by Friday 3rd January.',
        isPersonalized: true,
        pollenTeamNote: 'Congratulations Zara! This is fantastic news! \n\n**Your Journey:** \nYou have successfully completed all stages of the application process - from the initial skills assessment through both Pollen and employer interviews. Your performance was consistently strong throughout. \n\n**Why Tech Startup chose you:** \n- Outstanding analytical thinking and problem-solving approach \n- Excellent technical competency with data analysis tools \n- Strong communication skills and professional presentation \n- Genuine enthusiasm for data-driven insights \n- Great cultural fit with their remote-first, learning-focused team \n\n**The Role:** \n- Data Analyst position at £32,000 \n- Remote work with monthly London meetups \n- £2,000 annual learning budget \n- Chance to work with Python, SQL, Tableau, and emerging tools \n\n**Next Steps:** \nCarefully review all the details David shared in your messages. This is a great opportunity with a growing startup that values professional development. \n\nWe are so proud of your success! Feel free to reach out if you have any questions about the offer. \n\nCongratulations again! \n\nBest wishes, \nThe Pollen Team'
      };
    }
    
    return selectedStatus;
  }

  /**
   * Generate mock feedback for demo applications
   */
  private generateMockFeedback(application: any): ApplicationFeedback {
    // Set job details based on application ID
    const job = application.id === 5 ? {
      id: application.jobId,
      title: "Content Writer",
      description: "Content writing role with creative and SEO components",
      category: "content",
      jobType: "full-time",
      companyName: "Digital Agency",
      requirements: []
    } : application.id === 6 ? {
      id: application.jobId,
      title: "Marketing Coordinator",
      description: "Marketing coordination role with campaign management and analytics components",
      category: "marketing",
      jobType: "full-time",
      companyName: "InnovateCorp",
      requirements: []
    } : application.id === 7 ? {
      id: application.jobId,
      title: "Data Analyst",
      description: "Data analysis role with Python, SQL, and visualization components",
      category: "data",
      jobType: "full-time",
      companyName: "Tech Startup",
      requirements: []
    } : {
      id: application.jobId,
      title: "Marketing Assistant",
      description: "Marketing role with creative and analytical components",
      category: "marketing",
      jobType: "full-time",
      companyName: "TechFlow Solutions",
      requirements: []
    };
    
    const submissions = [{
      id: 1,
      applicationId: application.id,
      challengeId: 1,
      submissionUrl: "https://example.com/submission",
      submissionText: "Completed assessment with strong analytical and creative approach. Demonstrated good understanding of marketing principles and attention to detail.",
      score: Math.floor(parseFloat(application.matchScore)) || 75,
      feedback: application.notes || "Good performance on assessment",
      submittedAt: application.submittedAt,
      reviewedAt: application.updatedAt
    }];

    // Primary challenge submission (latest one)
    const primarySubmission = submissions[submissions.length - 1];
    
    // Generate different status examples based on application ID first
    const statusExamples = this.generateStatusExamples(application.id);
    
    // Calculate category scores (interview performance now handled by dedicated frontend section)
    const keyScores = this.calculateCategoryScores(primarySubmission, job, false, statusExamples.status);
    
    // Calculate overall score
    const overallScore = this.calculateOverallScore(keyScores);
    
    // Generate qualitative feedback
    const strengthsHighlighted = statusExamples.status === 'not_progressing' ? [] : this.generateStrengths(keyScores, primarySubmission, statusExamples.status);
    const areasForImprovement = this.generateImprovementAreas(keyScores, primarySubmission);
    const standardizedBlurb = this.generateStandardizedBlurb(job);
    const nextSteps = this.generateNextSteps(keyScores, job, statusExamples.status);
    
    // Calculate benchmark comparison
    const benchmarkComparison = {
      averageScore: 68,
      topPercentile: 85,
      totalCandidates: 124
    };

    return {
      applicationId: application.id.toString(),
      jobTitle: job.title,
      company: job.companyName || "Company",
      submittedAt: application.submittedAt?.toISOString() || new Date().toISOString(),
      status: statusExamples.status,
      overallScore,
      feedback: {
        keyScores,
        strengthsHighlighted,
        areasForImprovement,
        standardizedBlurb: statusExamples.standardizedBlurb,
        nextSteps,
        benchmarkComparison,
        isPersonalized: statusExamples.isPersonalized,
        pollenTeamNote: statusExamples.pollenTeamNote,
        employerFeedbackNote: statusExamples.employerFeedbackNote,
        // Add comprehensive interview scores for job offer status
        ...(statusExamples.status === 'job_offered' && application.id === 7 ? {
          pollenInterviewScore: 92,
          employerInterviewScore: 96,
          keyStrengths: [
            "Data Analysis & Visualization: Exceptional ability to extract insights from complex datasets",
            "Technical Proficiency: Strong foundation in Python, SQL, and statistical analysis",
            "Problem-Solving: Systematic approach to breaking down analytical challenges",
            "Communication: Clear explanation of technical concepts to non-technical stakeholders",
            "Learning Mindset: Genuine enthusiasm for emerging data technologies and methodologies"
          ],
          growthOpportunities: [
            "Advanced Analytics: Explore machine learning applications for predictive modeling",
            "Data Architecture: Learn about cloud platforms and scalable data infrastructure",
            "Leadership Development: Develop skills for mentoring junior analysts and leading projects",
            "Industry Expertise: Deepen knowledge in specific business domains and use cases"
          ]
        } : {})
      },
    };
  }
}

export const scoringAlgorithm = new ScoringAlgorithm();