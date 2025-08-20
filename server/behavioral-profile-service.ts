/**
 * Comprehensive Behavioral Profile Service
 * Contains all personality type data structures for consistent access across the platform
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

export const BEHAVIORAL_PROFILES: Record<string, BehavioralProfileData> = {
  // Single Dominant Types (>50%)
  "Results Dynamo": {
    emoji: "🎯",
    briefDiscSummary: "Direct and results-driven",
    communicationStyle: "Confident and urgent - drives action through clear, direct interaction focused on outcomes and practical next steps",
    decisionMakingStyle: "Quick and practical - makes fast decisions based on available information and measurable results, comfortable taking decisive action",
    careerMotivators: [
      "Achievement and measurable results",
      "Leadership opportunities and influence", 
      "Fast-paced challenges with clear outcomes",
      "Recognition for performance and success"
    ],
    workStyleStrengths: [
      "Results-focused leadership and direction",
      "Quick decision-making under pressure", 
      "Goal-oriented project management",
      "Driving performance in competitive environments"
    ],
    idealWorkEnvironment: [
      {
        title: "Results-Oriented Culture",
        description: "You thrive in environments focused on achieving clear, measurable outcomes with performance recognition"
      },
      {
        title: "Fast-Paced Decision Making",
        description: "You work best when decisions are made quickly and action is taken without unnecessary delays"
      },
      {
        title: "Leadership Opportunities",
        description: "You're energised by opportunities to take charge of projects and guide teams toward ambitious goals"
      }
    ],
    compatibleRoleTypes: [
      {
        title: "Leadership and team management",
        description: "Taking charge of teams and projects to drive measurable results through clear direction"
      },
      {
        title: "Sales and business development",
        description: "Building relationships and driving revenue through confident, results-focused approaches"
      },
      {
        title: "Project leadership and coordination",
        description: "Managing complex initiatives and ensuring teams meet ambitious deadlines and targets"
      },
      {
        title: "Strategic planning and execution",
        description: "Developing and implementing plans that drive organizational performance and growth"
      }
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
      jobSeeker: "You bring a direct and results-driven approach to work, thriving in fast-paced environments where quick decisions are essential. You excel at taking charge of projects, motivating teams toward ambitious goals, and driving measurable outcomes through decisive leadership. Your competitive nature and goal-oriented mindset make you particularly effective at overcoming challenges and delivering exceptional performance under pressure.",
      employer: "They bring a direct and results-driven approach to work, thriving in fast-paced environments where quick decisions are essential. They excel at taking charge of projects, motivating teams toward ambitious goals, and driving measurable outcomes through decisive leadership. Their competitive nature and goal-oriented mindset make them particularly effective at overcoming challenges and delivering exceptional performance under pressure."
    }
  },

  "Quality Guardian": {
    emoji: "🛡️",
    briefDiscSummary: "Detail-focused and thorough",
    communicationStyle: "Precise and thoughtful - ensures accuracy through careful, methodical communication focused on quality and completeness",
    decisionMakingStyle: "Thorough and careful - takes time to analyze all factors before making well-considered decisions with attention to detail",
    careerMotivators: [
      "Quality and accuracy in work output",
      "Clear systems and procedures to follow",
      "Recognition for attention to detail",
      "Opportunities for thorough analysis"
    ],
    workStyleStrengths: [
      "Methodical attention to detail",
      "Quality control and accuracy focus",
      "Systematic problem-solving approach",
      "Thorough analysis and research skills"
    ],
    idealWorkEnvironment: [
      {
        title: "Quality-Focused Culture",
        description: "You thrive in environments that value accuracy, attention to detail, and high-quality outcomes over speed"
      },
      {
        title: "Clear Processes and Structure",
        description: "You work best with well-defined procedures and systematic approaches to tasks and decision-making"
      },
      {
        title: "Time for Thorough Analysis",
        description: "You're most effective when given adequate time to research, analyze, and ensure quality in your work"
      }
    ],
    compatibleRoleTypes: [
      {
        title: "Quality assurance and analysis",
        description: "Roles requiring careful attention to detail and systematic evaluation"
      },
      {
        title: "Research and data analysis",
        description: "Positions involving thorough investigation and methodical analysis"
      },
      {
        title: "Process improvement and compliance",
        description: "Work focused on maintaining standards and improving systems"
      }
    ],
    jobSeekerKeyStrengths: [
      {
        title: "Methodical Analysis",
        description: "You approach problems systematically, ensuring thorough understanding before taking action"
      },
      {
        title: "Quality Focus",
        description: "You naturally prioritize accuracy and attention to detail in all your work"
      },
      {
        title: "Continuous Learning",
        description: "You value understanding processes deeply and improving your knowledge base"
      }
    ],
    employerKeyStrengths: [
      {
        title: "Quality Assurance",
        description: "Natural attention to detail ensures high-quality outcomes and catches potential issues"
      },
      {
        title: "Systematic Approach",
        description: "Methodical thinking brings structure and reliability to complex tasks"
      },
      {
        title: "Thorough Analysis",
        description: "Comprehensive evaluation skills help identify risks and opportunities others might miss"
      }
    ],
    behavioralBlurb: {
      jobSeeker: "You bring a natural focus on quality and systematic thinking to your work. You thrive in environments that value thoroughness and attention to detail, preferring to understand processes deeply before taking action.",
      employer: "They bring exceptional attention to detail and systematic thinking. They excel at quality control, thorough analysis, and ensuring high standards are maintained across all work outputs."
    }
  },

  "Social Butterfly": {
    emoji: "🦋",
    briefDiscSummary: "Enthusiastic and people-focused",
    communicationStyle: "Warm and enthusiastic - builds rapport easily while motivating others through positive energy and genuine connection",
    decisionMakingStyle: "Collaborative and optimistic - involves others while focusing on positive outcomes that build team morale",
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
    idealWorkEnvironment: [
      {
        title: "Collaborative Social Culture",
        description: "You thrive in environments that value teamwork, relationships, and positive interpersonal connections"
      },
      {
        title: "Creative Expression Opportunities",
        description: "You work best when you can bring variety, innovation, and creative approaches to your projects"
      },
      {
        title: "Recognition and Appreciation",
        description: "You're energised by workplaces that celebrate contributions and acknowledge individual achievements"
      }
    ],
    compatibleRoleTypes: [
      {
        title: "Relationship building and team collaboration",
        description: "Working closely with others to build connections and facilitate positive team dynamics"
      },
      {
        title: "Creative problem-solving and innovation",
        description: "Approaching challenges with fresh perspectives and developing innovative solutions"
      },
      {
        title: "Communication and motivation",
        description: "Inspiring and encouraging others through positive communication and enthusiastic leadership"
      },
      {
        title: "Adaptability and change management",
        description: "Helping teams navigate transitions through optimism and flexible, people-focused approaches"
      }
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
      jobSeeker: "You bring an enthusiastic and people-focused approach to work, preferring collaborative environments and team-based problem-solving. You excel in environments that value relationships, creative expression, and positive team dynamics. Your natural energy and optimism make you particularly effective at building connections and motivating others through positive interactions and engaging communication.",
      employer: "They bring an enthusiastic and people-focused approach to work, preferring collaborative environments and team-based problem-solving. They excel in environments that value relationships, creative expression, and positive team dynamics. Their natural energy and optimism make them particularly effective at building connections and motivating others through positive interactions."
    }
  },

  "Reliable Foundation": {
    emoji: "🏛️",
    briefDiscSummary: "Steady and supportive",
    communicationStyle: "Patient and encouraging - creates safe spaces for discussion while ensuring everyone feels heard and valued",
    decisionMakingStyle: "Collaborative and considerate - builds consensus while carefully considering the impact on team relationships and morale",
    careerMotivators: [
      "Team harmony and collaborative success",
      "Helping others succeed and develop professionally",
      "Making meaningful contributions to organisational stability", 
      "Working in consistent, supportive environments with shared values"
    ],
    workStyleStrengths: [
      "Providing reliable support and consistency to teams",
      "Building strong relationships and trust with colleagues",
      "Creating stability during periods of change",
      "Demonstrating loyalty and dependable follow-through"
    ],
    idealWorkEnvironment: [
      {
        title: "Collaborative Team Culture",
        description: "You thrive in environments that value teamwork, mutual support, and inclusive decision-making"
      },
      {
        title: "Stable Processes and Expectations",
        description: "You work best when roles are clear and workflows are consistent and predictable"
      },
      {
        title: "Relationship-Focused Environment",
        description: "You're energised by workplaces that prioritise people, respect, and long-term professional relationships"
      }
    ],
    compatibleRoleTypes: [
      {
        title: "Team support and coordination",
        description: "Working closely with others to ensure everyone has the resources and support they need to succeed"
      },
      {
        title: "Customer service and relationship management",
        description: "Building lasting relationships with clients through patient, attentive service and genuine care"
      },
      {
        title: "Administrative coordination and support",
        description: "Organizing workflows and supporting teams through reliable, detail-oriented assistance"
      },
      {
        title: "Training and development support",
        description: "Helping others learn and grow through patient guidance and supportive collaboration"
      }
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
    communicationStyle: "Careful and detailed - ensures accuracy while providing comprehensive information in structured, well-organized interactions",
    decisionMakingStyle: "Systematic and thorough - gathers comprehensive information before making well-founded, carefully considered choices",
    careerMotivators: [
      "Quality standards and excellence in all work output",
      "Expertise development and becoming a recognized specialist",
      "Clear processes and well-defined procedures that ensure consistency",
      "Professional recognition for accuracy and thoroughness"
    ],
    workStyleStrengths: [
      "Maintaining consistently high standards in all deliverables",
      "Bringing systematic approaches to complex challenges", 
      "Exceptional attention to detail and error prevention",
      "Providing quality assurance and thorough review processes"
    ],
    idealWorkEnvironment: [
      {
        title: "Structured Standards Environment",
        description: "You thrive in environments with clear quality standards and well-defined expectations"
      },
      {
        title: "Deep Work Opportunities",
        description: "You work best with uninterrupted time to focus thoroughly on complex tasks and detailed analysis"
      },
      {
        title: "Process-Oriented Culture",
        description: "You're energised by workplaces that value systematic approaches and methodical problem-solving"
      }
    ],
    compatibleRoleTypes: [
      {
        title: "Quality assurance and process improvement",
        description: "Ensuring high standards and creating systematic approaches to maintain consistency and excellence"
      },
      {
        title: "Research and detailed analysis",
        description: "Examining information carefully and thoroughly to support well-informed decision-making"
      },
      {
        title: "Strategic planning and methodical execution",
        description: "Developing comprehensive plans and implementing them systematically to achieve quality outcomes"
      },
      {
        title: "Process organization and continuous learning",
        description: "Finding ways to make workflows more efficient while maintaining high quality standards"
      }
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



  // Red-Based Dual Combinations (40-50% + 25-35%)
  "Ambitious Influencer": {
    emoji: "🚀",
    briefDiscSummary: "Dynamic and persuasive",
    communicationStyle: "Energetic and inspiring - motivates others through enthusiasm and clear vision using dynamic, engaging approaches",
    decisionMakingStyle: "Bold and confident - acts quickly while considering team impact, taking calculated risks to achieve breakthrough results",
    careerMotivators: [
      "Leadership opportunities and building influence",
      "High-visibility projects and recognition for achievements",
      "Competitive environments with clear performance metrics",
      "Innovation and breakthrough achievements that drive change"
    ],
    workStyleStrengths: [
      "Leading change and driving innovation",
      "Motivating teams to exceed performance targets",
      "Building influential professional networks",
      "Achieving results through persuasion and relationship-building"
    ],
    idealWorkEnvironment: [
      {
        title: "Dynamic High-Energy Culture",
        description: "You thrive in fast-paced environments with opportunities for leadership and team interaction"
      },
      {
        title: "Competitive Performance Focus",
        description: "You work best in environments that recognize achievement and reward high performance"
      },
      {
        title: "Innovation and Change Opportunities",
        description: "You're energised by workplaces that embrace new ideas and breakthrough thinking"
      }
    ],
    compatibleRoleTypes: [
      {
        title: "Leadership and team management",
        description: "Taking charge of teams and inspiring others to achieve ambitious goals through vision and motivation"
      },
      {
        title: "Sales and business development",
        description: "Building relationships and driving revenue through persuasive communication and competitive drive"
      },
      {
        title: "Marketing and communications",
        description: "Creating compelling messages and campaigns that inspire action and drive engagement"
      },
      {
        title: "Strategic project management",
        description: "Leading complex initiatives that require vision, team coordination, and breakthrough thinking"
      }
    ],
    jobSeekerKeyStrengths: [
      {
        title: "Influential Leader",
        description: "You naturally inspire others to achieve ambitious goals. Your combination of drive and charisma makes you effective at building teams around shared visions."
      },
      {
        title: "Results-Driven Motivator",
        description: "You excel at creating energy and momentum in teams. Your competitive spirit helps push projects forward while keeping everyone engaged and motivated."
      },
      {
        title: "Strategic Networker",
        description: "You build meaningful professional relationships that drive results. Your social skills combined with business focus help you create valuable connections."
      }
    ],
    employerKeyStrengths: [
      {
        title: "Influential Leader",
        description: "They naturally inspire others to achieve ambitious goals. Their combination of drive and charisma makes them effective at building teams around shared visions."
      },
      {
        title: "Results-Driven Motivator",
        description: "They excel at creating energy and momentum in teams. Their competitive spirit helps push projects forward while keeping everyone engaged and motivated."
      },
      {
        title: "Strategic Networker",
        description: "They build meaningful professional relationships that drive results. Their social skills combined with business focus help them create valuable connections."
      }
    ],
    behavioralBlurb: {
      jobSeeker: "You combine natural leadership drive with strong people skills. You excel at motivating teams, building influence, and driving results through persuasion and energy.",
      employer: "They bring dynamic leadership combined with strong interpersonal skills. They excel at motivating teams, building influence, and achieving results through persuasion and relationship-building. Their energetic approach makes them effective at driving change and innovation."
    }
  },

  "Strategic Achiever": {
    emoji: "🥷",
    briefDiscSummary: "Results-focused and analytical",
    communicationStyle: "Direct and logical - presents clear reasoning while maintaining focus on practical outcomes",
    decisionMakingStyle: "Systematic and decisive - weighs important factors quickly while staying action-oriented",
    careerMotivators: [
      "Complex challenges that require both drive and careful thinking",
      "Leadership opportunities where results and quality both matter",
      "Competitive environments with clear performance expectations",
      "Opportunities to improve how things work through systematic approaches"
    ],
    workStyleStrengths: [
      "Balancing results focus with thorough consideration",
      "Direct communication combined with logical reasoning",
      "Independent thinking while maintaining team accountability",
      "Action-oriented approach with attention to important details"
    ],
    idealWorkEnvironment: [
      {
        title: "Results-Oriented Culture",
        description: "You thrive in environments that focus on achieving meaningful outcomes with clear performance expectations"
      },
      {
        title: "Information-Rich Environment",
        description: "You work best when you have access to the information needed to make well-informed decisions"
      },
      {
        title: "Leadership Opportunities",
        description: "You're energised by opportunities to guide projects and influence direction through systematic thinking"
      }
    ],
    compatibleRoleTypes: [
      {
        title: "Project coordination and systematic execution",
        description: "Combining methodical thinking with decisive action to achieve ambitious goals"
      },
      {
        title: "Problem-solving and improvement roles",
        description: "Examining situations carefully while maintaining focus on practical solutions"
      },
      {
        title: "Team leadership with performance focus",
        description: "Guiding others toward outcomes through clear direction and systematic approaches"
      },
      {
        title: "Quality-focused operations",
        description: "Ensuring standards are met while driving toward meaningful results"
      }
    ],
    jobSeekerKeyStrengths: [
      {
        title: "Balanced Results Driver",
        description: "You naturally combine drive for results with careful consideration. Your ability to stay focused on outcomes while thinking systematically makes you effective in complex situations."
      },
      {
        title: "Logical Problem Solver",
        description: "You approach challenges with both determination and analytical thinking. Your direct communication style helps teams understand priorities and move forward confidently."
      },
      {
        title: "Systematic Leader",
        description: "You naturally organize approaches while maintaining momentum. Your combination of drive and methodical thinking helps teams achieve quality outcomes efficiently."
      }
    ],
    employerKeyStrengths: [
      {
        title: "Balanced Results Driver",
        description: "They naturally combine drive for results with careful consideration. Their ability to stay focused on outcomes while thinking systematically makes them effective in complex situations."
      },
      {
        title: "Logical Problem Solver",
        description: "They approach challenges with both determination and analytical thinking. Their direct communication style helps teams understand priorities and move forward confidently."
      },
      {
        title: "Systematic Leader",
        description: "They naturally organize approaches while maintaining momentum. Their combination of drive and methodical thinking helps teams achieve quality outcomes efficiently."
      }
    ],
    behavioralBlurb: {
      jobSeeker: "You naturally balance drive for results with systematic thinking. You excel at maintaining momentum while ensuring important factors are considered, making you effective in roles requiring both action and careful judgment.",
      employer: "They bring a natural balance of results drive and systematic thinking. They excel at maintaining momentum while ensuring important factors are considered, making them effective in roles requiring both action and careful judgment."
    }
  },

  "Steady Driver": {
    emoji: "🎖️",
    briefDiscSummary: "Results-focused and reliable",
    communicationStyle: "Direct yet supportive - balances results focus with genuine team consideration through clear, honest communication",
    decisionMakingStyle: "Results-oriented and inclusive - drives toward outcomes while considering team impact, balancing performance with well-being",
    careerMotivators: [
      "Achieving meaningful results that help others succeed",
      "Stable environment with clear performance goals and expectations",
      "Recognition for consistent achievement and reliable delivery",
      "Team success through dependable leadership and support"
    ],
    workStyleStrengths: [
      "Consistent results delivery and follow-through",
      "Reliable leadership performance under pressure",
      "Team support while driving ambitious outcomes",
      "Steady progress toward long-term goals"
    ],
    idealWorkEnvironment: [
      {
        title: "Results-Oriented Team Culture",
        description: "You thrive in environments with clear goals and supportive team relationships that value both performance and people"
      },
      {
        title: "Stable Performance Standards",
        description: "You work best when expectations are clear and you can build consistent momentum toward results"
      },
      {
        title: "Collaborative Achievement Focus",
        description: "You're energised by workplaces that celebrate both individual reliability and collective success"
      }
    ],
    compatibleRoleTypes: [
      {
        title: "Operations and results delivery",
        description: "Managing workflows and processes to ensure consistent, reliable outcomes for teams and clients"
      },
      {
        title: "Team leadership with performance focus",
        description: "Leading others toward goals while maintaining supportive relationships and sustainable performance"
      },
      {
        title: "Project management and execution",
        description: "Coordinating complex initiatives through reliable planning and steady progress toward completion"
      },
      {
        title: "Client success and account management",
        description: "Building lasting relationships while consistently delivering results that meet client expectations"
      }
    ],
    jobSeekerKeyStrengths: [
      {
        title: "Reliable Results Driver",
        description: "You consistently deliver results while maintaining team harmony. Your steady yet results-focused approach helps organisations achieve sustainable success through reliable execution."
      },
      {
        title: "Supportive Performance Leader",
        description: "You excel at driving toward goals while helping others succeed. Your balanced approach creates environments where teams achieve consistently high performance."
      },
      {
        title: "Steady Achievement Maker",
        description: "You maintain momentum toward results through challenges and setbacks. Your persistence and reliability make you valuable for ambitious projects requiring sustained performance."
      }
    ],
    employerKeyStrengths: [
      {
        title: "Reliable Results Driver",
        description: "They consistently deliver results while maintaining team harmony. Their steady yet results-focused approach helps organisations achieve sustainable success through reliable execution."
      },
      {
        title: "Supportive Performance Leader",
        description: "They excel at driving toward goals while helping others succeed. Their balanced approach creates environments where teams achieve consistently high performance."
      },
      {
        title: "Steady Achievement Maker",
        description: "They maintain momentum toward results through challenges and setbacks. Their persistence and reliability make them valuable for ambitious projects requiring sustained performance."
      }
    ],
    behavioralBlurb: {
      jobSeeker: "You combine results-driven focus with team support. You excel at achieving consistent outcomes while building strong relationships and helping others succeed through reliable leadership.",
      employer: "They bring results-driven focus combined with strong team support. They excel at achieving consistent outcomes while maintaining positive team dynamics. Their reliable yet performance-focused approach makes them effective at sustained achievement and team development."
    }
  },

  // Yellow-Based Dual Combinations
  "Dynamic Leader": {
    emoji: "🌟",
    briefDiscSummary: "Charismatic and action-oriented",
    communicationStyle: "Inspiring and energetic - motivates others through compelling vision and genuine personal connection that builds excitement",
    decisionMakingStyle: "Intuitive and bold - acts confidently while inspiring team buy-in and maintaining focus on collective energy and momentum",
    careerMotivators: [
      "Leading innovative projects and inspiring teams toward breakthrough results",
      "High-energy, fast-paced challenges that require creative leadership",
      "Recognition and visibility for achievements and transformational impact",
      "Creative freedom and entrepreneurial opportunities to build something meaningful"
    ],
    workStyleStrengths: [
      "Inspiring and motivating teams through vision and personal energy",
      "Driving innovation and leading organizational change",
      "Building momentum and excitement around ambitious goals",
      "Creating compelling visions that unite and energize others"
    ],
    idealWorkEnvironment: [
      {
        title: "Dynamic High-Energy Culture",
        description: "You thrive in fast-paced environments with leadership opportunities and creative freedom to innovate"
      },
      {
        title: "Innovation and Change Focus",
        description: "You work best in environments that embrace new ideas and transformational thinking"
      },
      {
        title: "Recognition and Visibility",
        description: "You're energised by workplaces that celebrate achievement and provide opportunities for meaningful impact"
      }
    ],
    compatibleRoleTypes: [
      {
        title: "Leadership development and organized management",
        description: "Leading organizations through vision, inspiration, and bold decision-making to achieve transformational results"
      },
      {
        title: "Innovation and change management",
        description: "Driving organizational transformation through creative leadership and inspiring others to embrace new possibilities"
      },
      {
        title: "Marketing and brand leadership",
        description: "Building compelling brand stories and campaigns that inspire action and create emotional connections"
      },
      {
        title: "Entrepreneurial and startup roles",
        description: "Building new ventures and driving innovation through creative leadership and bold vision"
      }
    ],
    jobSeekerKeyStrengths: [
      {
        title: "Visionary Team Motivator",
        description: "You naturally inspire others with compelling visions and infectious energy. Your charismatic leadership helps teams achieve ambitious goals they didn't think possible."
      },
      {
        title: "Innovation Catalyst",
        description: "You excel at driving change and breakthrough thinking. Your combination of creativity and leadership helps organisations adapt and innovate successfully."
      },
      {
        title: "High-Energy Achiever",
        description: "You thrive in fast-paced environments and maintain momentum through challenges. Your dynamic approach helps teams stay energised and focused on results."
      }
    ],
    employerKeyStrengths: [
      {
        title: "Visionary Team Motivator",
        description: "They naturally inspire others with compelling visions and infectious energy. Their charismatic leadership helps teams achieve ambitious goals they didn't think possible."
      },
      {
        title: "Innovation Catalyst",
        description: "They excel at driving change and breakthrough thinking. Their combination of creativity and leadership helps organisations adapt and innovate successfully."
      },
      {
        title: "High-Energy Achiever",
        description: "They thrive in fast-paced environments and maintain momentum through challenges. Their dynamic approach helps teams stay energised and focused on results."
      }
    ],
    behavioralBlurb: {
      jobSeeker: "You combine natural charisma with strong leadership drive. You excel at inspiring teams, driving innovation, and creating the energy needed to achieve breakthrough results.",
      employer: "They bring charismatic leadership combined with strong achievement drive. They excel at inspiring teams, driving innovation, and creating high-energy environments that deliver breakthrough results. Their dynamic approach makes them effective at leading transformational change."
    }
  },

  "Steady Planner": {
    emoji: "📊",
    briefDiscSummary: "Supportive and systematic",
    communicationStyle: "Patient and thoughtful - takes time to listen carefully to team members while ensuring all perspectives are understood",
    decisionMakingStyle: "Inclusive and thorough - combines comprehensive information gathering with careful consideration of team needs and human impact",
    careerMotivators: [
      "Supporting team success through systematic planning and organization",
      "Creating stable, well-organised environments that enable consistent performance",
      "Quality outcomes achieved through careful preparation and methodical execution",
      "Building long-term relationships and sustainable processes"
    ],
    workStyleStrengths: [
      "Systematic planning with strong team focus and collaboration",
      "Research and analysis combined with inclusive decision-making",
      "Quality-driven approaches that support team success",
      "Long-term thinking and stability in complex environments"
    ],
    idealWorkEnvironment: [
      {
        title: "Structured Supportive Culture",
        description: "You thrive in environments with clear expectations and strong team relationships that value both process and people"
      },
      {
        title: "Methodical Planning Opportunities",
        description: "You work best when you can apply systematic approaches to support team success and quality outcomes"
      },
      {
        title: "Collaborative Research Environment",
        description: "You're energised by workplaces that combine careful analysis with inclusive team collaboration"
      }
    ],
    compatibleRoleTypes: [
      {
        title: "Project planning and team coordination",
        description: "Organizing complex initiatives through systematic planning while ensuring all team members feel supported"
      },
      {
        title: "Team support and development",
        description: "Helping others succeed through methodical approaches that build capabilities and sustainable processes"
      },
      {
        title: "Process improvement with people focus",
        description: "Creating better workflows that consider both efficiency and team well-being"
      },
      {
        title: "Operations and systematic coordination",
        description: "Managing workflows through careful planning that maintains quality while supporting team collaboration"
      }
    ],
    jobSeekerKeyStrengths: [
      {
        title: "Systematic Team Supporter",
        description: "You combine methodical planning with genuine care for team success. Your organised approach helps teams work together more effectively while maintaining high standards."
      },
      {
        title: "Thoughtful Process Builder",
        description: "You excel at creating structured approaches that consider everyone's needs. Your systematic thinking ensures processes work well for all team members."
      },
      {
        title: "Reliable Quality Coordinator",
        description: "You naturally maintain high standards while supporting others. Your methodical approach ensures consistent outcomes while building strong team relationships."
      }
    ],
    employerKeyStrengths: [
      {
        title: "Systematic Team Supporter",
        description: "They combine methodical planning with genuine care for team success. Their organised approach helps teams work together more effectively while maintaining high standards."
      },
      {
        title: "Thoughtful Process Builder",
        description: "They excel at creating structured approaches that consider everyone's needs. Their systematic thinking ensures processes work well for all team members."
      },
      {
        title: "Reliable Quality Coordinator",
        description: "They naturally maintain high standards while supporting others. Their methodical approach ensures consistent outcomes while building strong team relationships."
      }
    ],
    behavioralBlurb: {
      jobSeeker: "You bring a methodical and systematic approach to work, preferring thorough research and careful problem-solving. You excel in environments that value accuracy, attention to detail, and quality outcomes. Your systematic thinking style makes you particularly effective at breaking down complex challenges and delivering precise, well-researched results while supporting team success through collaborative planning.",
      employer: "They bring a methodical and systematic approach to work, preferring thorough research and careful problem-solving. They excel in environments that value accuracy, attention to detail, and quality outcomes. Their systematic thinking style makes them particularly effective at breaking down complex challenges and delivering precise, well-researched results while supporting team success through collaborative planning."
    }
  },

  "Supportive Connector": {
    emoji: "🤝",
    briefDiscSummary: "Warm and team-focused",
    communicationStyle: "Encouraging and inclusive - creates welcoming environments for collaboration while ensuring everyone feels valued and heard",
    decisionMakingStyle: "Consensus-building and considerate - involves everyone while carefully considering impact on team relationships and individual well-being",
    careerMotivators: [
      "Building meaningful team relationships and lasting professional connections",
      "Supporting others' growth and success through collaborative mentoring",
      "Creating positive work environments where everyone feels valued",
      "Collaborative achievements and shared wins that benefit the whole team"
    ],
    workStyleStrengths: [
      "Team building and relationship development across diverse groups",
      "Collaborative problem-solving that includes all perspectives",
      "Creating inclusive environments where everyone feels comfortable contributing",
      "Supporting others through change with empathy and practical assistance"
    ],
    idealWorkEnvironment: [
      {
        title: "Collaborative People-Focused Culture",
        description: "You thrive in environments with strong team relationships and mutual support where collaboration is valued"
      },
      {
        title: "Relationship Building Opportunities",
        description: "You work best when you can focus on developing meaningful connections and supporting others' success"
      },
      {
        title: "Inclusive Team Environment",
        description: "You're energised by workplaces that celebrate diversity and ensure everyone feels valued and heard"
      }
    ],
    compatibleRoleTypes: [
      {
        title: "Team coordination and support",
        description: "Facilitating team success through relationship-building and ensuring everyone has the support they need"
      },
      {
        title: "Human resources and people development",
        description: "Helping individuals and teams grow through supportive guidance and inclusive practices"
      },
      {
        title: "Client relationship management",
        description: "Building lasting partnerships through genuine care and collaborative problem-solving"
      },
      {
        title: "Community and partnership building",
        description: "Creating connections and fostering collaboration between diverse groups and stakeholders"
      }
    ],
    jobSeekerKeyStrengths: [
      {
        title: "Team Harmony Builder",
        description: "You naturally create environments where everyone feels valued and included. Your supportive approach helps teams work together more effectively and enjoyably."
      },
      {
        title: "Relationship-Focused Connector",
        description: "You excel at building bridges between people and fostering meaningful professional relationships. Your warm approach helps create lasting team bonds."
      },
      {
        title: "Collaborative Solution Finder",
        description: "You bring out the best in team problem-solving by ensuring all voices are heard. Your inclusive approach leads to solutions that everyone can support."
      }
    ],
    employerKeyStrengths: [
      {
        title: "Team Harmony Builder",
        description: "They naturally create environments where everyone feels valued and included. Their supportive approach helps teams work together more effectively and enjoyably."
      },
      {
        title: "Relationship-Focused Connector",
        description: "They excel at building bridges between people and fostering meaningful professional relationships. Their warm approach helps create lasting team bonds."
      },
      {
        title: "Collaborative Solution Finder",
        description: "They bring out the best in team problem-solving by ensuring all voices are heard. Their inclusive approach leads to solutions that everyone can support."
      }
    ],
    behavioralBlurb: {
      jobSeeker: "You combine natural enthusiasm with strong team focus. You excel at building relationships, creating inclusive environments, and helping teams collaborate effectively.",
      employer: "They bring enthusiastic team-building combined with strong collaborative focus. They excel at creating inclusive environments, building meaningful relationships, and helping teams work together effectively. Their supportive approach makes them valuable for team development and collaboration."
    }
  },

  "Thoughtful Communicator": {
    emoji: "💭",
    briefDiscSummary: "Engaging and analytical",
    communicationStyle: "Thoughtful and engaging - combines warm interaction with careful consideration to create understanding through meaningful dialogue",
    decisionMakingStyle: "Collaborative and research-based - involves others while gathering comprehensive information that balances facts with human perspectives",
    careerMotivators: [
      "Meaningful communication and connection with diverse audiences",
      "Intellectual challenges that have positive impact on people",
      "Creative problem-solving in collaborative team environments",
      "Building understanding and bridge-building between diverse groups"
    ],
    workStyleStrengths: [
      "Clear and engaging communication that makes complex topics accessible",
      "Analytical thinking combined with people-focused approaches",
      "Building consensus through thoughtful discussion and inclusive dialogue",
      "Creating compelling presentations and content that connects with audiences"
    ],
    idealWorkEnvironment: [
      {
        title: "Collaborative Analytical Culture",
        description: "You thrive in environments with opportunities for both analysis and meaningful interaction with diverse teams"
      },
      {
        title: "Communication and Presentation Focus",
        description: "You work best when you can combine research with compelling communication and content creation"
      },
      {
        title: "Inclusive Discussion Environment",
        description: "You're energised by workplaces that value thoughtful dialogue and building understanding between different perspectives"
      }
    ],
    compatibleRoleTypes: [
      {
        title: "Communications and content strategy",
        description: "Creating compelling content that combines research with engaging presentation to connect with audiences"
      },
      {
        title: "Training and development",
        description: "Helping others learn through thoughtful instruction that combines analysis with genuine care for understanding"
      },
      {
        title: "Research and insights with presentation",
        description: "Conducting thorough analysis and presenting findings in ways that build understanding and drive action"
      },
      {
        title: "Consulting and advisory roles",
        description: "Providing guidance through collaborative analysis and thoughtful communication that builds client confidence"
      }
    ],
    jobSeekerKeyStrengths: [
      {
        title: "Analytical Communicator",
        description: "You excel at breaking down complex information and presenting it in engaging, accessible ways. Your combination of analysis and communication makes complex topics clear."
      },
      {
        title: "Consensus Builder",
        description: "You bring people together around shared understanding through thoughtful discussion. Your collaborative approach helps teams reach well-informed decisions."
      },
      {
        title: "Engaging Content Creator",
        description: "You naturally combine research with compelling presentation. Your ability to make information interesting and accessible helps others learn and engage."
      }
    ],
    employerKeyStrengths: [
      {
        title: "Analytical Communicator",
        description: "They excel at breaking down complex information and presenting it in engaging, accessible ways. Their combination of analysis and communication makes complex topics clear."
      },
      {
        title: "Consensus Builder",
        description: "They bring people together around shared understanding through thoughtful discussion. Their collaborative approach helps teams reach well-informed decisions."
      },
      {
        title: "Engaging Content Creator",
        description: "They naturally combine research with compelling presentation. Their ability to make information interesting and accessible helps others learn and engage."
      }
    ],
    behavioralBlurb: {
      jobSeeker: "You combine natural communication skills with analytical thinking. You excel at making complex information accessible, building consensus, and creating engaging content that connects with people.",
      employer: "They bring thoughtful communication combined with analytical capabilities. They excel at making complex information accessible, facilitating understanding between diverse groups, and creating engaging content. Their balanced approach makes them effective at both analysis and presentation."
    }
  },

  // Green-Based Dual Combinations
  "Determined Helper": {
    emoji: "💪",
    briefDiscSummary: "Supportive and goal-driven",
    communicationStyle: "Encouraging and direct - motivates others while maintaining focus on shared goals through honest, supportive dialogue",
    decisionMakingStyle: "Team-focused and decisive - considers group needs while driving toward outcomes that balance team well-being with achievement",
    careerMotivators: [
      "Helping teams achieve meaningful goals and lasting impact",
      "Supporting others while driving measurable results and progress",
      "Stable progress with clear performance indicators and recognition",
      "Recognition for team contributions and collaborative achievements"
    ],
    workStyleStrengths: [
      "Reliable goal achievement through consistent effort and team support",
      "Team motivation and encouragement during challenging periods",
      "Persistent problem-solving that doesn't give up on important outcomes",
      "Balancing results-focus with relationship-building and team care"
    ],
    idealWorkEnvironment: [
      {
        title: "Supportive Goal-Oriented Culture",
        description: "You thrive in environments with clear objectives and strong team relationships that value both achievement and people"
      },
      {
        title: "Team-Focused Results Environment",
        description: "You work best when you can support others while driving toward meaningful, measurable outcomes"
      },
      {
        title: "Collaborative Achievement Focus",
        description: "You're energised by workplaces that celebrate team success and recognize collective contributions"
      }
    ],
    compatibleRoleTypes: [
      {
        title: "Project management and team coordination",
        description: "Leading teams toward goals while ensuring everyone feels supported and motivated throughout the process"
      },
      {
        title: "Operations and service delivery",
        description: "Managing workflows and processes that consistently deliver results while maintaining strong team relationships"
      },
      {
        title: "Team leadership and development",
        description: "Guiding others toward success through a combination of goal focus and genuine care for individual growth"
      },
      {
        title: "Client success and account management",
        description: "Building lasting client relationships while consistently delivering results that meet expectations"
      }
    ],
    jobSeekerKeyStrengths: [
      {
        title: "Results-Driven Team Supporter",
        description: "You combine genuine care for others with strong goal focus. Your approach helps teams achieve ambitious targets while maintaining positive relationships."
      },
      {
        title: "Persistent Problem Solver",
        description: "You don't give up on challenges, especially when they impact your team. Your determination combined with team focus makes you effective at overcoming obstacles."
      },
      {
        title: "Motivational Goal Achiever",
        description: "You inspire others to reach their potential while driving toward concrete results. Your balanced approach helps teams perform at their best consistently."
      }
    ],
    employerKeyStrengths: [
      {
        title: "Results-Driven Team Supporter",
        description: "They combine genuine care for others with strong goal focus. Their approach helps teams achieve ambitious targets while maintaining positive relationships."
      },
      {
        title: "Persistent Problem Solver",
        description: "They don't give up on challenges, especially when they impact their team. Their determination combined with team focus makes them effective at overcoming obstacles."
      },
      {
        title: "Motivational Goal Achiever",
        description: "They inspire others to reach their potential while driving toward concrete results. Their balanced approach helps teams perform at their best consistently."
      }
    ],
    behavioralBlurb: {
      jobSeeker: "You combine strong team support with goal-driven determination. You excel at helping others succeed while maintaining focus on achieving meaningful results together.",
      employer: "They bring supportive team focus combined with strong achievement drive. They excel at helping others succeed while maintaining focus on results. Their balanced approach makes them effective at both team development and goal achievement."
    }
  },

  "Collaborative Facilitator": {
    emoji: "⚡",
    briefDiscSummary: "People-focused and supportive",
    communicationStyle: "Warm and facilitative - creates safe spaces for open dialogue and collaboration where everyone feels comfortable contributing",
    decisionMakingStyle: "Inclusive and patient - ensures all perspectives are considered before moving forward, taking time to ensure everyone feels heard",
    careerMotivators: [
      "Building strong team relationships and lasting professional connections",
      "Facilitating group success and harmony through collaborative approaches",
      "Creating positive, supportive environments where everyone can thrive",
      "Helping others grow and develop their potential through mentoring and guidance"
    ],
    workStyleStrengths: [
      "Team facilitation and coordination that brings out everyone's best contributions",
      "Relationship building and maintenance across diverse groups and personalities",
      "Creating inclusive environments where all voices are heard and valued",
      "Supporting others through challenges with patience and understanding"
    ],
    idealWorkEnvironment: [
      {
        title: "Collaborative People-Centered Culture",
        description: "You thrive in environments with emphasis on team harmony and mutual support where relationships are valued"
      },
      {
        title: "Inclusive Team Building Opportunities",
        description: "You work best when you can focus on facilitating group success and creating positive environments"
      },
      {
        title: "Supportive Development Environment",
        description: "You're energised by workplaces that prioritize helping others grow and develop their potential"
      }
    ],
    compatibleRoleTypes: [
      {
        title: "Team facilitation and coordination",
        description: "Leading teams through collaborative processes that bring out everyone's best contributions"
      },
      {
        title: "Human resources and people development",
        description: "Supporting individual growth and building organizational culture that values all team members"
      },
      {
        title: "Training and mentoring",
        description: "Helping others develop skills and confidence through patient, supportive guidance"
      },
      {
        title: "Community building and engagement",
        description: "Creating connections and fostering collaboration across diverse groups and communities"
      }
    ],
    jobSeekerKeyStrengths: [
      {
        title: "Team Harmony Facilitator",
        description: "You create environments where everyone feels comfortable contributing their best work. Your natural ability to bring out the best in teams makes you invaluable for collaborative projects."
      },
      {
        title: "Supportive Relationship Builder",
        description: "You excel at creating lasting professional relationships based on trust and mutual respect. Your caring approach helps teams work together more effectively over time."
      },
      {
        title: "Inclusive Problem Solver",
        description: "You ensure all voices are heard when tackling challenges. Your patient, inclusive approach leads to solutions that have broad team support and buy-in."
      }
    ],
    employerKeyStrengths: [
      {
        title: "Team Harmony Facilitator",
        description: "They create environments where everyone feels comfortable contributing their best work. Their natural ability to bring out the best in teams makes them invaluable for collaborative projects."
      },
      {
        title: "Supportive Relationship Builder",
        description: "They excel at creating lasting professional relationships based on trust and mutual respect. Their caring approach helps teams work together more effectively over time."
      },
      {
        title: "Inclusive Problem Solver",
        description: "They ensure all voices are heard when tackling challenges. Their patient, inclusive approach leads to solutions that have broad team support and buy-in."
      }
    ],
    behavioralBlurb: {
      jobSeeker: "You combine natural team facilitation with strong relationship focus. You excel at creating inclusive environments where everyone can contribute their best work and feel valued.",
      employer: "They bring natural facilitation skills combined with strong relationship focus. They excel at creating inclusive environments, building team harmony, and ensuring everyone can contribute effectively. Their supportive approach makes them valuable for team development and collaboration."
    }
  },

  // Blue-Based Dual Combinations
  "Analytical Driver": {
    emoji: "🎮",
    briefDiscSummary: "Methodical and results-oriented",
    communicationStyle: "Direct and evidence-based - uses clear reasoning and practical examples to drive efficient, focused discussions",
    decisionMakingStyle: "Analytical and decisive - thoroughly researches options before acting with confidence on well-considered choices",
    careerMotivators: [
      "Complex challenges that require both logical thinking and drive for results",
      "Leadership opportunities where careful analysis and action both matter",
      "Evidence-based environments that value thorough consideration",
      "Opportunities to improve how things work through systematic approaches"
    ],
    workStyleStrengths: [
      "Balancing thorough analysis with focus on practical outcomes",
      "Direct communication combined with methodical reasoning",
      "Systematic approaches that improve efficiency and results",
      "Results-focused problem solving through careful consideration"
    ],
    idealWorkEnvironment: [
      {
        title: "Results-Oriented Strategic Culture",
        description: "You thrive in environments with access to comprehensive data and strategic responsibilities"
      },
      {
        title: "Analytical Decision-Making Environment",
        description: "You work best when you can apply thorough analysis to drive meaningful business outcomes"
      },
      {
        title: "Leadership and Innovation Focus",
        description: "You're energised by workplaces that value thoughtful planning and continuous learning"
      }
    ],
    compatibleRoleTypes: [
      {
        title: "Strategic leadership and consulting",
        description: "Leading teams through careful planning and evidence-based decision making"
      },
      {
        title: "Business analysis and optimization",
        description: "Analyzing complex business challenges and creating systematic solutions that drive results"
      },
      {
        title: "Financial planning and analysis",
        description: "Using analytical skills to guide strategic financial decisions and optimize organizational performance"
      },
      {
        title: "Operations and process improvement",
        description: "Optimizing workflows and processes through systematic analysis and results-focused implementation"
      }
    ],
    jobSeekerKeyStrengths: [
      {
        title: "Logical Results Driver",
        description: "You naturally combine thorough thinking with drive for outcomes. Your ability to consider important factors while maintaining momentum makes you effective in complex situations."
      },
      {
        title: "Systematic Problem Solver",
        description: "You excel at breaking down challenges through methodical approaches. Your logical thinking helps teams understand priorities and move forward confidently."
      },
      {
        title: "Efficient Process Improver",
        description: "You naturally spot ways to make things work better through careful observation. Your combination of analysis and action focus helps teams perform more effectively."
      }
    ],
    employerKeyStrengths: [
      {
        title: "Logical Results Driver",
        description: "They naturally combine thorough thinking with drive for outcomes. Their ability to consider important factors while maintaining momentum makes them effective in complex situations."
      },
      {
        title: "Systematic Problem Solver",
        description: "They excel at breaking down challenges through methodical approaches. Their logical thinking helps teams understand priorities and move forward confidently."
      },
      {
        title: "Efficient Process Improver",
        description: "They naturally spot ways to make things work better through careful observation. Their combination of analysis and action focus helps teams perform more effectively."
      }
    ],
    behavioralBlurb: {
      jobSeeker: "You naturally balance thorough analysis with results drive. You excel at methodical problem-solving while maintaining focus on practical outcomes and team progress.",
      employer: "They bring a natural balance of analytical thinking and results drive. They excel at methodical problem-solving, efficient processes, and maintaining focus on practical outcomes while supporting team progress."
    }
  },

  "Creative Analyst": {
    emoji: "🔬",
    briefDiscSummary: "Innovative and thorough",
    communicationStyle: "Creative and precise - presents innovative ideas through detailed analysis while making complex concepts accessible and engaging",
    decisionMakingStyle: "Research-driven and creative - combines thorough investigation with innovative thinking to develop well-considered original solutions",
    careerMotivators: [
      "Creative problem-solving that explores new approaches and possibilities",
      "Investigation that leads to meaningful discoveries and insights",
      "Innovation through careful exploration and systematic thinking",
      "Presenting complex ideas in engaging, understandable ways"
    ],
    workStyleStrengths: [
      "Creative research and thorough investigation",
      "Clear presentation that makes complex ideas accessible",
      "Innovative approaches combined with systematic thinking",
      "Engaging communication that helps others understand concepts"
    ],
    idealWorkEnvironment: [
      {
        title: "Clear Structure & Processes",
        description: "You work best when expectations are well-defined and workflows are organised"
      },
      {
        title: "Quality-Focused Culture", 
        description: "You appreciate environments that value accuracy and take pride in delivering excellent work"
      },
      {
        title: "Focused Work Time",
        description: "You're most productive with uninterrupted blocks of time to dive deep into tasks"
      }
    ],
    compatibleRoleTypes: [
      {
        title: "Quality assurance and process improvement",
        description: "Ensuring high standards and creating systematic approaches to work"
      },
      {
        title: "Analysis and research",
        description: "Examining information carefully to support decision-making"
      },
      {
        title: "Strategic planning and execution",
        description: "Combining analytical thinking with decisive action to achieve goals"
      },
      {
        title: "Process optimisation and improvement", 
        description: "Finding ways to make workflows more efficient and effective"
      }
    ],
    jobSeekerKeyStrengths: [
      {
        title: "Creative Problem Explorer",
        description: "You naturally find innovative ways to approach challenges through fresh perspectives. Your ability to think creatively while maintaining systematic approaches makes you valuable for complex projects."
      },
      {
        title: "Clear Concept Communicator",
        description: "You excel at making complex ideas accessible and engaging through creative presentation. Your combination of thorough thinking and clear communication helps others understand important concepts."
      },
      {
        title: "Innovative Solution Developer",
        description: "You naturally combine creative thinking with careful investigation to develop original approaches. Your systematic creativity leads to breakthrough insights and solutions."
      }
    ],
    employerKeyStrengths: [
      {
        title: "Innovative Research Specialist",
        description: "They bring fresh perspectives to analytical work through creative approaches. Their ability to find new ways to investigate problems makes them valuable for complex research projects."
      },
      {
        title: "Data Storyteller",
        description: "They excel at making complex analysis accessible and engaging. Their combination of thorough research and creative presentation helps others understand and act on insights."
      },
      {
        title: "Creative Problem Investigator",
        description: "They naturally find innovative ways to approach analytical challenges. Their creative methodology combined with systematic thinking leads to breakthrough insights."
      }
    ],
    behavioralBlurb: {
      jobSeeker: "You combine analytical excellence with creative innovation. You excel at thorough research, finding new approaches to complex problems, and presenting insights in engaging ways.",
      employer: "They bring analytical excellence combined with creative innovation. They excel at thorough research, developing innovative approaches to complex problems, and making analytical insights accessible and engaging."
    }
  },

  "Methodical Coordinator": {
    emoji: "📋",
    briefDiscSummary: "Systematic and team-focused",
    communicationStyle: "Careful and collaborative - ensures everyone understands plans and processes through clear, methodical explanation",
    decisionMakingStyle: "Methodical and inclusive - develops comprehensive plans with team input while balancing systematic processes with member needs",
    careerMotivators: [
      "Creating systematic approaches that help teams work more effectively",
      "Coordinating others through organized processes and clear expectations",
      "Quality planning and execution that delivers consistent results",
      "Collaborative project success through methodical team coordination"
    ],
    workStyleStrengths: [
      "Methodical coordination and organization that supports team success",
      "Team-focused process development that considers everyone's needs",
      "Quality assurance and attention to detail in collaborative environments",
      "Collaborative project coordination through systematic planning"
    ],
    idealWorkEnvironment: [
      {
        title: "Structured Team-Oriented Culture",
        description: "You thrive in environments with emphasis on planning and collaborative execution where organization is valued"
      },
      {
        title: "Methodical Coordination Opportunities",
        description: "You work best when you can apply systematic approaches to support team success and project outcomes"
      },
      {
        title: "Quality-Focused Collaborative Environment",
        description: "You're energised by workplaces that combine careful planning with strong team relationships"
      }
    ],
    compatibleRoleTypes: [
      {
        title: "Project planning and coordination",
        description: "Managing projects through systematic planning while ensuring all team members are supported and aligned"
      },
      {
        title: "Process development and improvement",
        description: "Creating better workflows that consider both efficiency and team collaboration needs"
      },
      {
        title: "Operations and systems management",
        description: "Managing operational systems through methodical coordination that supports team effectiveness"
      },
      {
        title: "Team coordination and support",
        description: "Supporting team success through organized approaches that help everyone work together effectively"
      }
    ],
    jobSeekerKeyStrengths: [
      {
        title: "Systematic Team Planner",
        description: "You excel at creating organized approaches that help teams work effectively together. Your methodical planning combined with team focus ensures successful project outcomes."
      },
      {
        title: "Collaborative Process Builder",
        description: "You naturally develop systems and processes that make everyone's work easier. Your supportive approach helps teams adopt and benefit from improved organization."
      },
      {
        title: "Quality-Focused Coordinator",
        description: "You ensure nothing falls through the cracks while maintaining positive team relationships. Your attention to detail combined with collaborative spirit helps teams deliver excellent results."
      }
    ],
    employerKeyStrengths: [
      {
        title: "Systematic Team Planner",
        description: "They excel at creating organized approaches that help teams work effectively together. Their methodical planning combined with team focus ensures successful project outcomes."
      },
      {
        title: "Collaborative Process Builder",
        description: "They naturally develop systems and processes that make everyone's work easier. Their supportive approach helps teams adopt and benefit from improved organization."
      },
      {
        title: "Quality-Focused Coordinator",
        description: "They ensure nothing falls through the cracks while maintaining positive team relationships. Their attention to detail combined with collaborative spirit helps teams deliver excellent results."
      }
    ],
    behavioralBlurb: {
      jobSeeker: "You combine systematic planning with strong team support. You excel at creating organized processes, maintaining quality standards, and helping teams work together effectively.",
      employer: "They bring systematic planning combined with strong team support. They excel at developing organized processes, maintaining quality standards, and facilitating team collaboration through effective coordination."
    }
  },

  // Moderate Blends (30-40% range)
  "Energetic Motivator": {
    emoji: "🔥",
    briefDiscSummary: "Dynamic and inspiring",
    communicationStyle: "High-energy and motivating - creates excitement and drives action through enthusiastic, fast-paced discussions that build momentum",
    decisionMakingStyle: "Fast-paced and inspiring - makes bold choices while energizing team commitment and creating excitement that drives results",
    careerMotivators: [
      "High-energy, fast-paced challenges that require dynamic leadership",
      "Motivating and inspiring others to achieve ambitious goals",
      "Competitive environments with recognition for breakthrough performance",
      "Innovation and breakthrough achievements that create lasting impact"
    ],
    workStyleStrengths: [
      "Creating energy and momentum that drives team performance",
      "Motivating teams to exceed expectations through enthusiasm and inspiration",
      "Driving results through dynamic energy and competitive spirit",
      "Leading dynamic change initiatives that energize organizations"
    ],
    idealWorkEnvironment: [
      {
        title: "High-Energy Fast-Paced Culture",
        description: "You thrive in environments with opportunities to motivate others and drive results through dynamic energy"
      },
      {
        title: "Competitive Achievement Focus",
        description: "You work best in settings that value breakthrough performance and recognize exceptional results"
      },
      {
        title: "Innovation and Change Environment",
        description: "You're energised by workplaces that embrace bold initiatives and transformational thinking"
      }
    ],
    compatibleRoleTypes: [
      {
        title: "Sales and business development",
        description: "Driving revenue growth through dynamic energy and inspirational relationship-building"
      },
      {
        title: "Marketing and communications",
        description: "Creating compelling campaigns that inspire action through energetic and motivational messaging"
      },
      {
        title: "Team leadership and motivation",
        description: "Leading teams to exceptional performance through high-energy inspiration and competitive drive"
      },
      {
        title: "Change management and innovation",
        description: "Driving organizational transformation through dynamic leadership and breakthrough thinking"
      }
    ],
    jobSeekerKeyStrengths: [
      {
        title: "High-Energy Results Driver",
        description: "You bring infectious enthusiasm that motivates teams to achieve ambitious goals. Your dynamic energy helps create momentum even in challenging situations."
      },
      {
        title: "Motivational Team Leader",
        description: "You excel at inspiring others to reach their potential through your positive energy and competitive spirit. Your enthusiasm helps teams push beyond what they thought possible."
      },
      {
        title: "Dynamic Change Catalyst",
        description: "You thrive on creating excitement around new initiatives and breakthrough thinking. Your energetic approach helps organizations embrace change and innovation."
      }
    ],
    employerKeyStrengths: [
      {
        title: "High-Energy Results Driver",
        description: "They bring infectious enthusiasm that motivates teams to achieve ambitious goals. Their dynamic energy helps create momentum even in challenging situations."
      },
      {
        title: "Motivational Team Leader",
        description: "They excel at inspiring others to reach their potential through their positive energy and competitive spirit. Their enthusiasm helps teams push beyond what they thought possible."
      },
      {
        title: "Dynamic Change Catalyst",
        description: "They thrive on creating excitement around new initiatives and breakthrough thinking. Their energetic approach helps organizations embrace change and innovation."
      }
    ],
    behavioralBlurb: {
      jobSeeker: "You combine high-energy drive with natural motivation skills. You excel at creating momentum, inspiring teams, and driving results through your dynamic and enthusiastic approach.",
      employer: "They bring high-energy drive combined with natural motivation skills. They excel at creating momentum, inspiring teams, and achieving results through their dynamic and enthusiastic leadership approach."
    }
  },

  "Strategic Analyst": {
    emoji: "🧭",
    briefDiscSummary: "Strategic and analytical",
    communicationStyle: "Clear and evidence-based - presents logical analysis with strategic insights through fact-based, efficient discussions",
    decisionMakingStyle: "Analytical and strategic - processes complex information thoroughly before making well-informed choices with long-term impact",
    careerMotivators: [
      "Complex strategic challenges that require analytical depth and leadership",
      "Leadership roles with measurable impact and strategic responsibility",
      "Fast-paced decision-making environments that value analytical thinking",
      "Innovation and competitive advantage through strategic analysis and execution"
    ],
    workStyleStrengths: [
      "Strategic thinking and rapid execution that drives organizational success",
      "Data-driven leadership that builds confidence through evidence-based decisions",
      "Complex problem-solving using both analytical depth and strategic perspective",
      "Results-focused decision making that balances speed with thorough analysis"
    ],
    idealWorkEnvironment: [
      {
        title: "Fast-Paced Strategic Culture",
        description: "You thrive in results-oriented environments with strategic responsibilities and access to comprehensive data"
      },
      {
        title: "Analytical Leadership Environment",
        description: "You work best when you can apply thoughtful planning to drive meaningful outcomes"
      },
      {
        title: "Innovation and Competition Focus",
        description: "You're energised by workplaces that value strategic advantage and competitive excellence"
      }
    ],
    compatibleRoleTypes: [
      {
        title: "Strategic leadership and management",
        description: "Leading organizations through strategic analysis and evidence-based decision making to achieve competitive advantage"
      },
      {
        title: "Business consulting and analysis",
        description: "Providing strategic guidance through comprehensive analysis and rapid execution of recommendations"
      },
      {
        title: "Operations and performance optimization",
        description: "Improving team performance through careful analysis and continuous learning initiatives"
      },
      {
        title: "Innovation and competitive strategy",
        description: "Driving innovation and creative solutions through thoughtful planning and careful analysis"
      }
    ],
    jobSeekerKeyStrengths: [
      {
        title: "Strategic Action Leader",
        description: "You excel at quickly analyzing complex situations and implementing effective strategies. Your ability to think strategically while acting decisively makes you valuable for high-stakes projects."
      },
      {
        title: "Results-Focused Strategist",
        description: "You combine thorough analysis with rapid execution to achieve measurable outcomes. Your strategic mindset helps organizations stay ahead of competition through smart decision-making."
      },
      {
        title: "Complex Problem Solver",
        description: "You thrive on tackling challenging strategic issues that require both analytical depth and quick action. Your balanced approach helps organizations navigate complex business challenges."
      }
    ],
    employerKeyStrengths: [
      {
        title: "Strategic Action Leader",
        description: "They excel at quickly analyzing complex situations and implementing effective strategies. Their ability to think strategically while acting decisively makes them valuable for high-stakes projects."
      },
      {
        title: "Results-Focused Strategist",
        description: "They combine thorough analysis with rapid execution to achieve measurable outcomes. Their strategic mindset helps organizations stay ahead of competition through smart decision-making."
      },
      {
        title: "Complex Problem Solver",
        description: "They thrive on tackling challenging strategic issues that require both analytical depth and quick action. Their balanced approach helps organizations navigate complex business challenges."
      }
    ],
    behavioralBlurb: {
      jobSeeker: "You combine thoughtful planning with decisive action. You excel at analyzing complex situations, developing effective approaches, and implementing solutions quickly and efficiently.",
      employer: "They bring thoughtful planning combined with decisive action. They excel at analyzing complex situations, developing effective approaches, and implementing solutions with speed and precision."
    }
  },

  "People-Focused Coordinator": {
    emoji: "🌈",
    briefDiscSummary: "Engaging and organized",
    communicationStyle: "Warm and structural - creates organized approaches while maintaining positive team relationships through inclusive methods",
    decisionMakingStyle: "Collaborative and systematic - builds team consensus through organized discussion that involves all members and considers relationships",
    careerMotivators: [
      "Coordinating team success and harmony through organized collaboration",
      "Creating systems that help people work together more effectively",
      "Building meaningful professional relationships across diverse groups",
      "Facilitating group achievements through structured teamwork"
    ],
    workStyleStrengths: [
      "Team coordination and facilitation that balances structure with relationships",
      "Relationship-focused organization that considers everyone's needs",
      "Creating inclusive processes that help teams work together effectively",
      "Balancing people needs with structure to achieve group success"
    ],
    idealWorkEnvironment: [
      {
        title: "Collaborative Organized Culture",
        description: "You thrive in environments with strong team relationships and clear processes that support collaboration"
      },
      {
        title: "Team Coordination Opportunities",
        description: "You work best when you can facilitate group success through organized, inclusive approaches"
      },
      {
        title: "Relationship-Focused Structure Environment",
        description: "You're energised by workplaces that balance systematic organization with meaningful team connections"
      }
    ],
    compatibleRoleTypes: [
      {
        title: "Team coordination and facilitation",
        description: "Leading teams through organized collaboration that builds relationships and achieves group goals"
      },
      {
        title: "Project management with people focus",
        description: "Managing projects through systematic approaches that prioritize team relationships and inclusive processes"
      },
      {
        title: "Human resources and team development",
        description: "Building organizational culture through structured approaches that support individual growth and team harmony"
      },
      {
        title: "Event planning and community building",
        description: "Creating meaningful experiences through organized planning that brings people together and builds connections"
      }
    ],
    jobSeekerKeyStrengths: [
      {
        title: "Team-Focused Organizer",
        description: "You excel at creating systems and processes that bring out the best in teams. Your ability to balance structure with people focus makes you effective at coordinating group success."
      },
      {
        title: "Relationship-Building Facilitator",
        description: "You naturally create environments where everyone feels included and valued. Your warm approach to organization helps teams work together more effectively and enjoyably."
      },
      {
        title: "Inclusive Process Creator",
        description: "You develop organized approaches that consider everyone's needs and perspectives. Your collaborative style ensures processes work for all team members."
      }
    ],
    employerKeyStrengths: [
      {
        title: "Team-Focused Organizer",
        description: "They excel at creating systems and processes that bring out the best in teams. Their ability to balance structure with people focus makes them effective at coordinating group success."
      },
      {
        title: "Relationship-Building Facilitator",
        description: "They naturally create environments where everyone feels included and valued. Their warm approach to organization helps teams work together more effectively and enjoyably."
      },
      {
        title: "Inclusive Process Creator",
        description: "They develop organized approaches that consider everyone's needs and perspectives. Their collaborative style ensures processes work for all team members."
      }
    ],
    behavioralBlurb: {
      jobSeeker: "You combine natural team coordination with strong relationship focus. You excel at creating organized processes that help people work together effectively while maintaining positive team dynamics.",
      employer: "They bring team coordination combined with strong relationship focus. They excel at creating organized processes that facilitate collaboration while maintaining positive team dynamics and inclusive environments."
    }
  },

  "Methodical Collaborator": {
    emoji: "🤲",
    briefDiscSummary: "Systematic and supportive",
    communicationStyle: "Patient and methodical - ensures everyone understands processes and feels comfortable participating through inclusive, thorough discussion",
    decisionMakingStyle: "Research-based and inclusive - systematically considers all options while involving team members to ensure quality and collaboration",
    careerMotivators: [
      "Supporting team success through systematic planning and collaborative approaches",
      "Creating quality outcomes through methodical collaboration and attention to detail",
      "Building stable, organized work environments that support team effectiveness",
      "Helping others through structured approaches that consider individual needs"
    ],
    workStyleStrengths: [
      "Methodical planning with strong team focus and collaborative decision-making",
      "Quality assurance through systematic collaboration and inclusive processes",
      "Creating structured supportive processes that help teams work effectively",
      "Systematic team coordination that balances organization with relationship-building"
    ],
    idealWorkEnvironment: [
      {
        title: "Stable Collaborative Culture",
        description: "You thrive in environments with emphasis on quality processes and team support where systematic approaches are valued"
      },
      {
        title: "Methodical Team Coordination Opportunities",
        description: "You work best when you can apply systematic planning to support team success and quality outcomes"
      },
      {
        title: "Quality-Focused Supportive Environment",
        description: "You're energised by workplaces that combine careful processes with strong team relationships and mutual support"
      }
    ],
    compatibleRoleTypes: [
      {
        title: "Quality assurance and team coordination",
        description: "Ensuring high standards through systematic approaches while supporting team collaboration and individual growth"
      },
      {
        title: "Process improvement with people focus",
        description: "Creating better workflows that consider both efficiency and team well-being through methodical collaboration"
      },
      {
        title: "Project coordination and support",
        description: "Managing projects through systematic planning while providing support that helps all team members succeed"
      },
      {
        title: "Team planning and development",
        description: "Supporting team growth through methodical planning that builds capabilities and sustainable collaborative processes"
      }
    ],
    jobSeekerKeyStrengths: [
      {
        title: "Quality-Focused Team Supporter",
        description: "You combine attention to detail with genuine care for team success. Your systematic approach helps teams deliver excellent results while maintaining positive working relationships."
      },
      {
        title: "Thoughtful Process Facilitator",
        description: "You excel at creating organized approaches that consider everyone's needs and concerns. Your patient methodology helps teams adopt better processes successfully."
      },
      {
        title: "Collaborative Quality Guardian",
        description: "You ensure nothing falls through the cracks while maintaining team harmony. Your careful approach helps teams deliver consistent, high-quality outcomes together."
      }
    ],
    employerKeyStrengths: [
      {
        title: "Quality-Focused Team Supporter",
        description: "They combine attention to detail with genuine care for team success. Their systematic approach helps teams deliver excellent results while maintaining positive working relationships."
      },
      {
        title: "Thoughtful Process Facilitator",
        description: "They excel at creating organized approaches that consider everyone's needs and concerns. Their patient methodology helps teams adopt better processes successfully."
      },
      {
        title: "Collaborative Quality Guardian",
        description: "They ensure nothing falls through the cracks while maintaining team harmony. Their careful approach helps teams deliver consistent, high-quality outcomes together."
      }
    ],
    behavioralBlurb: {
      jobSeeker: "You combine systematic quality focus with strong team support. You excel at creating careful processes that help teams work together effectively while maintaining high standards.",
      employer: "They bring systematic quality focus combined with strong team support. They excel at developing careful processes that facilitate effective collaboration while maintaining high standards and team harmony."
    }
  },

  // Three-Way Blends (25%+ in three colors)
  "Versatile Team Player": {
    emoji: "🎭",
    briefDiscSummary: "Adaptable and well-rounded",
    communicationStyle: "Flexible and engaging - adapts communication style to what each situation and team needs through responsive, dynamic approaches",
    decisionMakingStyle: "Balanced and inclusive - considers multiple perspectives while maintaining focus on results and adapting approach as situations require",
    careerMotivators: [
      "Variety and diverse challenges that allow you to use different skills and approaches",
      "Team success through flexible contributions that adapt to what's most needed",
      "Learning and growing across different areas through diverse experiences",
      "Collaborative achievements with meaningful impact through versatile team contributions"
    ],
    workStyleStrengths: [
      "Adaptability across different situations and changing requirements",
      "Versatile problem-solving approaches that consider multiple options",
      "Flexible team collaboration that adjusts to different group dynamics",
      "Balanced perspective on challenges that considers various viewpoints and solutions"
    ],
    idealWorkEnvironment: [
      {
        title: "Dynamic Diverse Culture",
        description: "You thrive in environments with variety in tasks and strong team collaboration where adaptability is valued"
      },
      {
        title: "Cross-Functional Collaboration Opportunities",
        description: "You work best when you can contribute across different areas and work with diverse teams and projects"
      },
      {
        title: "Learning and Growth Environment",
        description: "You're energised by workplaces that offer variety and opportunities to develop skills across different areas"
      }
    ],
    compatibleRoleTypes: [
      {
        title: "Cross-functional team roles",
        description: "Contributing across different departments and projects through adaptable skills and versatile collaboration"
      },
      {
        title: "Project coordination with variety",
        description: "Managing diverse projects that require flexible approaches and the ability to work with different teams"
      },
      {
        title: "Business support and coordination",
        description: "Providing support across various business functions through adaptable skills and balanced perspective"
      },
      {
        title: "Adaptable specialist positions",
        description: "Applying specialized skills flexibly across different contexts and situations as needs change"
      }
    ],
    jobSeekerKeyStrengths: [
      {
        title: "Adaptable Problem Solver",
        description: "You bring flexibility and versatility to tackle diverse challenges. Your ability to adapt your approach based on what's needed makes you valuable across different types of projects."
      },
      {
        title: "Versatile Team Contributor",
        description: "You excel at filling different roles within teams based on what's most helpful. Your well-rounded skills help teams succeed across various situations and challenges."
      },
      {
        title: "Balanced Perspective Provider",
        description: "You naturally consider multiple viewpoints and approaches when solving problems. Your balanced thinking helps teams make well-rounded decisions that work for everyone."
      }
    ],
    employerKeyStrengths: [
      {
        title: "Adaptable Problem Solver",
        description: "They bring flexibility and versatility to tackle diverse challenges. Their ability to adapt their approach based on what's needed makes them valuable across different types of projects."
      },
      {
        title: "Versatile Team Contributor",
        description: "They excel at filling different roles within teams based on what's most helpful. Their well-rounded skills help teams succeed across various situations and challenges."
      },
      {
        title: "Balanced Perspective Provider",
        description: "They naturally consider multiple viewpoints and approaches when solving problems. Their balanced thinking helps teams make well-rounded decisions that work for everyone."
      }
    ],
    behavioralBlurb: {
      jobSeeker: "You bring adaptability and versatility to team environments. You excel at flexible problem-solving, contributing across different areas, and helping teams succeed through your well-rounded approach.",
      employer: "They bring adaptability and versatility to team environments. They excel at flexible problem-solving, contributing across different areas, and helping teams succeed through their well-rounded and balanced approach."
    }
  },

  "Dynamic Problem Solver": {
    emoji: "🧩",
    briefDiscSummary: "Innovative and analytical",
    communicationStyle: "Engaging and logical - presents creative solutions with solid reasoning and enthusiasm through dynamic discussions that explore possibilities",
    decisionMakingStyle: "Innovative and strategic - combines creative thinking with analytical evaluation to make bold decisions supported by thorough creative analysis",
    careerMotivators: [
      "Complex, multi-faceted challenges that require innovative thinking and strategic analysis",
      "Innovation and creative problem-solving that leads to breakthrough solutions",
      "Strategic thinking with measurable impact and meaningful organizational change",
      "Leading breakthrough solutions that combine creativity with analytical rigor"
    ],
    workStyleStrengths: [
      "Creative analytical thinking that finds innovative solutions to complex problems",
      "Innovative solution development that combines imagination with strategic evaluation",
      "Strategic problem-solving using both creative exploration and logical analysis",
      "Engaging presentation of complex ideas that makes innovation accessible and compelling"
    ],
    idealWorkEnvironment: [
      {
        title: "Dynamic Innovation Culture",
        description: "You thrive in environments with complex challenges and opportunities for creative analysis where innovation is valued"
      },
      {
        title: "Strategic Problem-Solving Opportunities",
        description: "You work best when you can tackle multi-faceted challenges that require both creative and analytical thinking"
      },
      {
        title: "Creative Excellence Environment",
        description: "You're energised by workplaces that encourage breakthrough thinking and reward innovative solutions"
      }
    ],
    compatibleRoleTypes: [
      {
        title: "Innovation and strategy",
        description: "Leading strategic innovation through creative analysis and breakthrough thinking that drives organizational success"
      },
      {
        title: "Business analysis and consulting",
        description: "Providing creative analytical solutions to complex business challenges through innovative problem-solving approaches"
      },
      {
        title: "Product development and improvement",
        description: "Creating innovative products and solutions through creative analysis and strategic development processes"
      },
      {
        title: "Strategic project leadership",
        description: "Leading complex projects that require innovative thinking and strategic analysis to achieve breakthrough results"
      }
    ],
    jobSeekerKeyStrengths: [
      {
        title: "Creative Strategic Thinker",
        description: "You excel at finding innovative solutions to complex problems through creative analysis. Your ability to think outside the box while maintaining strategic focus makes you valuable for breakthrough projects."
      },
      {
        title: "Multi-Dimensional Problem Solver",
        description: "You naturally approach challenges from multiple angles, combining creative thinking with logical analysis. Your versatile problem-solving helps organizations tackle their most complex issues."
      },
      {
        title: "Innovation Catalyst",
        description: "You drive breakthrough thinking by combining analytical rigor with creative exploration. Your dynamic approach helps teams discover new possibilities and implement innovative solutions."
      }
    ],
    employerKeyStrengths: [
      {
        title: "Creative Strategic Thinker",
        description: "They excel at finding innovative solutions to complex problems through creative analysis. Their ability to think outside the box while maintaining strategic focus makes them valuable for breakthrough projects."
      },
      {
        title: "Multi-Dimensional Problem Solver",
        description: "They naturally approach challenges from multiple angles, combining creative thinking with logical analysis. Their versatile problem-solving helps organizations tackle their most complex issues."
      },
      {
        title: "Innovation Catalyst",
        description: "They drive breakthrough thinking by combining analytical rigor with creative exploration. Their dynamic approach helps teams discover new possibilities and implement innovative solutions."
      }
    ],
    behavioralBlurb: {
      jobSeeker: "You combine creative innovation with analytical thinking and results focus. You excel at solving complex problems through multi-dimensional approaches and strategic creativity.",
      employer: "They bring creative innovation combined with analytical thinking and results focus. They excel at solving complex problems through multi-dimensional approaches, thoughtful planning, and innovative solutions."
    }
  },

  "Thoughtful Facilitator": {
    emoji: "🌸",
    briefDiscSummary: "Collaborative and insightful",
    communicationStyle: "Thoughtful and inclusive - facilitates meaningful discussions that consider all perspectives through patient, understanding approach",
    decisionMakingStyle: "Research-based and collaborative - gathers comprehensive input before facilitating group decisions that everyone can support",
    careerMotivators: [
      "Facilitating meaningful team collaboration that brings out everyone's best contributions",
      "Supporting others through thoughtful analysis and inclusive problem-solving approaches",
      "Creating inclusive environments for success where all perspectives are valued",
      "Building understanding through careful communication that bridges different viewpoints"
    ],
    workStyleStrengths: [
      "Thoughtful team facilitation that considers all perspectives and builds consensus",
      "Inclusive problem-solving that involves diverse viewpoints and collaborative analysis",
      "Research-informed collaboration that combines thorough investigation with team involvement",
      "Creating understanding between diverse perspectives through patient, thoughtful communication"
    ],
    idealWorkEnvironment: [
      {
        title: "Collaborative Inclusive Culture",
        description: "You thrive in environments with emphasis on thoughtful discussion and team development where diverse perspectives are valued"
      },
      {
        title: "Research and Analysis Opportunities",
        description: "You work best when you can apply thorough analysis to support meaningful team collaboration and decision-making"
      },
      {
        title: "Team Development Focus Environment",
        description: "You're energised by workplaces that prioritize building understanding and facilitating group success through inclusive processes"
      }
    ],
    compatibleRoleTypes: [
      {
        title: "Team facilitation and development",
        description: "Leading teams through collaborative processes that build understanding and facilitate meaningful group decisions"
      },
      {
        title: "Training and organizational development",
        description: "Supporting organizational growth through inclusive training and development that considers diverse perspectives"
      },
      {
        title: "Consulting and advisory roles",
        description: "Providing thoughtful guidance through research-informed analysis and inclusive consultation processes"
      },
      {
        title: "Research and insights with team application",
        description: "Conducting thorough research and translating insights into actionable team strategies through collaborative facilitation"
      }
    ],
    jobSeekerKeyStrengths: [
      {
        title: "Insightful Team Facilitator",
        description: "You excel at creating environments where diverse perspectives can be shared and understood. Your thoughtful approach helps teams reach well-informed decisions that everyone can support."
      },
      {
        title: "Collaborative Research Specialist",
        description: "You combine thorough analysis with inclusive team processes. Your ability to gather comprehensive information while involving others makes you effective at complex group problem-solving."
      },
      {
        title: "Understanding Bridge Builder",
        description: "You naturally help people with different viewpoints find common ground. Your patient, insightful approach helps teams work through complex issues together successfully."
      }
    ],
    employerKeyStrengths: [
      {
        title: "Insightful Team Facilitator",
        description: "They excel at creating environments where diverse perspectives can be shared and understood. Their thoughtful approach helps teams reach well-informed decisions that everyone can support."
      },
      {
        title: "Collaborative Research Specialist",
        description: "They combine thorough analysis with inclusive team processes. Their ability to gather comprehensive information while involving others makes them effective at complex group problem-solving."
      },
      {
        title: "Understanding Bridge Builder",
        description: "They naturally help people with different viewpoints find common ground. Their patient, insightful approach helps teams work through complex issues together successfully."
      }
    ],
    behavioralBlurb: {
      jobSeeker: "You combine thoughtful analysis with collaborative facilitation. You excel at creating inclusive environments where teams can work through complex challenges together effectively.",
      employer: "They bring thoughtful analysis combined with collaborative facilitation skills. They excel at creating inclusive environments where teams can work through complex challenges together, fostering understanding and effective group decision-making."
    }
  },

  "Balanced Professional": {
    emoji: "⚖️",
    briefDiscSummary: "Well-rounded and strategic",
    communicationStyle: "Professional and adaptable - adjusts communication style to be most effective for each situation and audience through strategic approach",
    decisionMakingStyle: "Balanced and strategic - weighs multiple factors including results, quality, and team impact to make complex decisions that balance priorities",
    careerMotivators: [
      "Well-rounded professional challenges that require thoughtful planning and balanced judgment",
      "Thoughtful planning with practical application that drives meaningful organizational outcomes",
      "Quality outcomes with team consideration that balance excellence with collaborative relationships",
      "Balanced achievement across different areas through comprehensive professional contributions"
    ],
    workStyleStrengths: [
      "Thoughtful planning with practical execution that drives sustainable organizational success",
      "Balanced approach to complex decisions that considers multiple perspectives and priorities",
      "Quality focus with results orientation that maintains high standards while achieving outcomes",
      "Adaptable professional communication that adjusts to different audiences and situations"
    ],
    idealWorkEnvironment: [
      {
        title: "Professional Strategic Culture",
        description: "You thrive in environments with diverse challenges requiring thoughtful planning and balanced decision-making where excellence is valued"
      },
      {
        title: "Strategic Leadership Opportunities",
        description: "You work best when you can apply thoughtful planning to complex challenges that require balanced judgment and practical execution"
      },
      {
        title: "Quality and Results Environment",
        description: "You're energised by workplaces that balance quality standards with results achievement through strategic professional approaches"
      }
    ],
    compatibleRoleTypes: [
      {
        title: "Strategic management and leadership",
        description: "Leading teams through thoughtful planning and balanced decision-making that considers multiple priorities and stakeholders"
      },
      {
        title: "Business analysis and planning",
        description: "Analyzing complex business challenges and developing strategic plans that balance quality, results, and team considerations"
      },
      {
        title: "Project management with strategic focus",
        description: "Managing projects through thoughtful planning that balances quality outcomes with practical execution and team impact"
      },
      {
        title: "General management and coordination",
        description: "Coordinating organizational activities through balanced leadership that considers strategic goals and operational excellence"
      }
    ],
    jobSeekerKeyStrengths: [
      {
        title: "Strategic Balance Provider",
        description: "You excel at weighing multiple factors to make well-rounded decisions. Your ability to balance results, quality, and team needs makes you effective in complex professional environments."
      },
      {
        title: "Adaptable Professional Leader",
        description: "You bring a well-rounded approach to leadership challenges. Your ability to adapt your style while maintaining focus on strategic outcomes makes you valuable across different situations."
      },
      {
        title: "Comprehensive Problem Solver",
        description: "You naturally consider all aspects of complex challenges before developing solutions. Your balanced perspective helps organizations make decisions that work well across multiple dimensions."
      }
    ],
    employerKeyStrengths: [
      {
        title: "Strategic Balance Provider",
        description: "They excel at weighing multiple factors to make well-rounded decisions. Their ability to balance results, quality, and team needs makes them effective in complex professional environments."
      },
      {
        title: "Adaptable Professional Leader",
        description: "They bring a well-rounded approach to leadership challenges. Their ability to adapt their style while maintaining focus on strategic outcomes makes them valuable across different situations."
      },
      {
        title: "Comprehensive Problem Solver",
        description: "They naturally consider all aspects of complex challenges before developing solutions. Their balanced perspective helps organizations make decisions that work well across multiple dimensions."
      }
    ],
    behavioralBlurb: {
      jobSeeker: "You bring strategic balance to professional challenges. You excel at weighing multiple factors, making well-rounded decisions, and adapting your approach to achieve the best outcomes.",
      employer: "They bring strategic balance to professional challenges. They excel at weighing multiple factors, making well-rounded decisions, and adapting their approach to achieve optimal outcomes across different dimensions."
    }
  }
};

/**
 * Get behavioral profile data for a specific personality type
 */
export function getBehavioralProfileData(personalityType: string): BehavioralProfileData {
  return BEHAVIORAL_PROFILES[personalityType] || {
    // Default fallback profile
    emoji: "🦎",
    briefDiscSummary: "Balanced and adaptable",
    communicationStyle: "Flexible communication style that adapts to different situations and team needs",
    decisionMakingStyle: "Balanced approach that considers multiple factors before making decisions",
    careerMotivators: ["Varied work opportunities", "Skill development", "Team collaboration", "Professional growth"],
    workStyleStrengths: ["Adaptability", "Balanced perspective", "Versatile skills", "Team collaboration"],
    idealWorkEnvironment: "Flexible environment with variety and opportunities for growth",
    compatibleRoleTypes: ["Versatile team roles", "Adaptive problem-solving", "Cross-functional collaboration", "General business support"],
    jobSeekerKeyStrengths: [
      {
        title: "Adaptable Team Player",
        description: "You bring flexibility and balance to team dynamics, adapting your approach based on what the situation requires."
      }
    ],
    employerKeyStrengths: [
      {
        title: "Adaptable Team Player", 
        description: "They bring flexibility and balance to team dynamics, adapting their approach based on what the situation requires."
      }
    ],
    behavioralBlurb: {
      jobSeeker: "You have a balanced approach to work that allows you to adapt to different situations and collaborate effectively with diverse teams.",
      employer: "They bring a balanced and adaptable approach to work, demonstrating flexibility in different situations and strong collaborative skills with diverse teams."
    }
  };
}

/**
 * Get job seeker behavioral profile content (first person)
 */
export function getJobSeekerBehavioralProfile(personalityType: string): BehavioralProfileData {
  return getBehavioralProfileData(personalityType);
}

/**
 * Get employer behavioral profile content (third person)
 */
export function getEmployerBehavioralProfile(personalityType: string): BehavioralProfileData {
  return getBehavioralProfileData(personalityType);
}

/**
 * Get all available personality types
 */
export function getAllPersonalityTypes(): string[] {
  return Object.keys(BEHAVIORAL_PROFILES);
}

/**
 * Check if a personality type exists in our database
 */
export function isValidPersonalityType(personalityType: string): boolean {
  return personalityType in BEHAVIORAL_PROFILES;
}