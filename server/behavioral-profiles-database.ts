// Comprehensive Behavioral Profiles Database
// Contains all content for 17 personality types across required output areas

export interface KeyStrength {
  title: string;
  description: string;
}

export interface BehavioralProfile {
  // Behavioural Profile & Work Style
  headline: string; // "The Social Butterfly"
  summary: string; // "Natural communicator who builds strong relationships and energises teams."
  description: string; // Master version in "You" language - dynamically transforms to third person
  shortDiscStatement: string; // "Enthusiastic and people-focused"
  keyStrengths: KeyStrength[]; // 3 key strengths with descriptions
  
  // How They Work
  communicationStyle: string;
  decisionMaking: string;
  careerMotivators: string[];
  workStyleStrengths: string[];
  
  // Job Seeker Specific Content
  personalisedWorkStyleSummary: string;
  idealWorkEnvironment: string;
  compatibleRoleTypes: string[];
}

export const behavioralProfiles: Record<string, BehavioralProfile> = {
  // PURE PROFILES (70%+ single dimension)
  "The Results Machine": {
    headline: "The Results Machine",
    summary: "Direct achiever who gets things done through focused action and clear goal setting.",
    description: "You're the type of person who naturally steps up when things need to happen. You have an inner drive to achieve goals and aren't intimidated by challenges. Your direct, no-nonsense approach would help you make things happen in fast-paced environments.",
    shortDiscStatement: "Direct and results-focused",
    keyStrengths: [
      {
        title: "Natural Drive",
        description: "You have an inner motivation to achieve goals and push yourself to succeed. This determination would help you excel in roles where results and progress matter."
      },
      {
        title: "Takes Action", 
        description: "You're the type of person who steps up and makes things happen rather than waiting for someone else to take the lead. This initiative would be valuable in dynamic work environments."
      },
      {
        title: "Decisive Nature",
        description: "You're comfortable making decisions and moving forward, even when you don't have all the information. This confidence would help you thrive in fast-paced roles."
      }
    ],
    
    communicationStyle: "You communicate directly and get straight to the point. You prefer clear expectations and straightforward conversations that focus on outcomes rather than lengthy discussions.",
    decisionMaking: "You make decisions quickly and confidently, focusing on what will deliver results. You're comfortable making tough calls under pressure and don't get stuck in analysis paralysis.",
    careerMotivators: ["Achieving ambitious goals", "Leading projects and people", "Having control over outcomes", "Working in competitive environments"],
    workStyleStrengths: ["Drives Results Forward", "Takes Charge of Situations", "Makes Quick Decisions", "Handles Pressure Well", "Motivates Action"],
    
    personalisedWorkStyleSummary: "You are primarily Results-Driven with natural leadership tendencies. You excel in high-pressure environments where quick decisions and bold action are valued. Your direct approach helps you cut through complexity to achieve what matters most.",
    idealWorkEnvironment: "Fast-Paced Environment - You thrive when there's energy and momentum, with clear goals to work toward. Leadership Opportunities - You enjoy having influence over outcomes and the ability to drive initiatives forward. Results-Focused Culture - You appreciate environments that measure success and celebrate achievement.",
    compatibleRoleTypes: ["Leadership and management roles", "Sales and business development", "Project management and delivery", "Operations and execution"]
  },

  "The Social Butterfly": {
    headline: "The Social Butterfly",
    summary: "Natural communicator who energises teams and builds genuine connections with everyone.",
    description: "You're the type of person who naturally lights up a room and makes others feel at ease. You have a gift for connecting with people and creating positive environments where everyone feels included. Your warm, engaging personality would help you build great relationships in any workplace.",
    shortDiscStatement: "Enthusiastic and people-focused",
    keyStrengths: [
      {
        title: "People Person",
        description: "You have a natural ability to connect with others and build genuine relationships. People are drawn to your positive energy and feel comfortable opening up to you."
      },
      {
        title: "Team Player", 
        description: "You instinctively bring people together and help create collaborative environments where everyone contributes. Your inclusive nature would make you a valued team member."
      },
      {
        title: "Great Communicator",
        description: "You have a gift for expressing ideas in ways that resonate with others. Your warm, approachable communication style would help you succeed in people-focused roles."
      }
    ],
    
    communicationStyle: "You communicate with warmth and enthusiasm, naturally building rapport with others. You encourage open dialogue and create space for everyone to share ideas and feel heard.",
    decisionMaking: "You prefer making decisions collaboratively, seeking input from others and considering how choices will affect team relationships and morale.",
    careerMotivators: ["Building strong team relationships", "Working in positive, supportive cultures", "Having variety and creative projects", "Helping others succeed and grow"],
    workStyleStrengths: ["Builds Strong Relationships", "Creates Positive Energy", "Facilitates Great Collaboration", "Communicates With Impact", "Inspires and Motivates"],
    
    personalisedWorkStyleSummary: "You are primarily People-Focused with natural collaborative strengths. You thrive in environments where your ability to connect with others can flourish. Your enthusiasm is contagious and helps bring out the best in everyone around you.",
    idealWorkEnvironment: "Collaborative Team Culture - You excel in environments with strong team dynamics and regular interaction with colleagues. Positive Work Environment - You thrive in supportive cultures that value relationships and celebrate success together. Creative Freedom - You appreciate opportunities for creative expression and variety in your work.",
    compatibleRoleTypes: ["Marketing and communications", "People operations and HR", "Sales and client relations", "Training and development"]
  },

  "The Steady Rock": {
    headline: "The Steady Rock",
    summary: "Reliable team player who provides steady support and creates stability for everyone around them.",
    description: "You're naturally the person others feel comfortable turning to for support. You have a calming presence and instinctively help create stability in challenging situations. Your patient, thoughtful approach would make you invaluable in roles where consistency and reliability matter.",
    shortDiscStatement: "Patient and supportive",
    keyStrengths: [
      {
        title: "Natural Reliability",
        description: "You're the type of person others instinctively trust to follow through. Your steady, dependable nature would make you a cornerstone of any team."
      },
      {
        title: "Supportive Nature", 
        description: "You have an instinct for helping others succeed and creating environments where everyone feels valued. Your caring approach would make you a wonderful colleague."
      },
      {
        title: "Thoughtful Approach",
        description: "You naturally take time to consider all angles before making decisions. This careful, measured thinking would help you avoid rushed mistakes and build sustainable success."
      }
    ],
    
    communicationStyle: "You communicate with patience and genuine care, listening actively before responding. You create safe spaces for others to share ideas and concerns without judgment.",
    decisionMaking: "You prefer to take time to consider decisions carefully, gathering input from others and thinking through how choices will affect everyone involved.",
    careerMotivators: ["Working in stable, supportive environments", "Helping team members succeed", "Having clear expectations and processes", "Maintaining work-life balance"],
    workStyleStrengths: ["Provides Steady Foundation", "Supports Team Success", "Works Consistently", "Builds Trust", "Maintains Quality"],
    
    personalisedWorkStyleSummary: "You are primarily Team-Oriented with steady, supportive strengths. You provide the reliable foundation that allows teams to thrive. Your patient approach and genuine care for others make you invaluable in any team environment.",
    idealWorkEnvironment: "Stable, Supportive Culture - You thrive in environments with clear processes and reasonable expectations. Strong Team Relationships - You appreciate working with people who value collaboration and mutual support. Consistent Workflow - You work best when you can establish routines and maintain steady progress.",
    compatibleRoleTypes: ["Operations and support roles", "Customer service and relations", "Administrative and coordination", "Quality assurance and process improvement"]
  },

  "The Quality Guardian": {
    headline: "The Quality Guardian",
    summary: "Detail-focused expert who ensures excellence through careful analysis and high standards.",
    description: "You're naturally curious and love understanding how things work. You have an instinct for spotting when something doesn't seem quite right and genuinely care about quality. Your thorough, systematic nature would make you brilliant in roles where precision and careful analysis are important.",
    shortDiscStatement: "Analytical and detail-focused",
    keyStrengths: [
      {
        title: "Sharp Eye for Detail",
        description: "You naturally notice things others might overlook and have an instinct for accuracy. This careful attention would make you excellent at catching important details."
      },
      {
        title: "Quality Instinct", 
        description: "You intuitively sense when something could be improved and genuinely care about doing things properly. This quality focus would be valuable in many professional settings."
      },
      {
        title: "Logical Thinker",
        description: "You naturally approach challenges step-by-step and enjoy understanding the 'why' behind things. This systematic thinking would help you excel in analytical roles."
      }
    ],
    
    communicationStyle: "You communicate with precision and prefer to have all the facts before sharing your thoughts. You value thorough explanations and structured information that helps everyone understand the details.",
    decisionMaking: "You make decisions based on careful analysis and comprehensive research. You prefer having all the information before deciding and like to consider potential risks and outcomes.",
    careerMotivators: ["Maintaining high-quality standards", "Mastering technical skills and expertise", "Improving processes and systems", "Working with complex, challenging problems"],
    workStyleStrengths: ["Ensures High Quality", "Maintains Standards", "Analyses Thoroughly", "Spots Issues Early", "Improves Systems"],
    
    personalisedWorkStyleSummary: "You are primarily Detail-Oriented with analytical strengths. You excel in environments where precision and quality are paramount. Your systematic mind and attention to detail ensure exceptional outcomes in everything you do.",
    idealWorkEnvironment: "Structured, Quality-Focused Environment - You thrive when expectations are clear and there's respect for doing things properly. Time for Deep Work - You're most productive with adequate time to analyse thoroughly and deliver high-quality results. Recognition for Expertise - You appreciate environments that value technical skill and attention to detail.",
    compatibleRoleTypes: ["Quality assurance and testing", "Data analysis and research", "Process improvement and compliance", "Technical specialisation"]
  },

  // BLENDED PROFILES - Red Primary
  "The Rocket Launcher": {
    headline: "The Rocket Launcher", 
    summary: "Highly ambitious people who create, motivate, and achieve rapid advancements. They're driven by their commitment to get things done quickly and achieve with others.",
    description: "You're a natural catalyst who combines high-energy leadership with infectious enthusiasm. You excel at rallying teams around ambitious goals while maintaining the drive needed to achieve exceptional results. Your ability to inspire others while pushing for swift execution makes you particularly effective at launching new initiatives.",
    shortDiscStatement: "Dynamic and inspiring",
    keyStrengths: [
      {
        title: "Dynamic Leadership",
        description: "You naturally take charge and inspire others with your energy and vision, creating momentum that drives teams toward ambitious goals."
      },
      {
        title: "Results Achievement",
        description: "You combine enthusiasm with determination, consistently delivering outcomes that exceed expectations through focused execution."
      },
      {
        title: "Team Motivation", 
        description: "You have a gift for energising others and building excitement around projects, helping teams push through challenges together."
      }
    ],
    
    communicationStyle: "You communicate with energy and passion, naturally inspiring others with your vision while being clear about expectations and goals.",
    decisionMaking: "You make decisions quickly and with confidence, building excitement and buy-in from others while maintaining focus on results.",
    careerMotivators: ["Leading teams and driving change", "Achieving rapid growth and results", "Working on innovative, challenging projects", "Receiving recognition for achievements"],
    workStyleStrengths: ["Energises Teams", "Drives Results Forward", "Makes Quick Decisions", "Builds Excitement", "Leads Change"],
    
    personalisedWorkStyleSummary: "You are primarily Results-Driven with strong People-Focused tendencies. You excel at creating momentum and driving results through infectious energy and inspiring leadership. Your dynamic approach motivates teams to achieve ambitious goals.",
    idealWorkEnvironment: "High-Energy, Growth-Focused Culture - You thrive in environments with ambitious goals and fast-paced execution. Leadership Opportunities - You enjoy having influence over outcomes and the ability to inspire others. Team Collaboration - You appreciate working with motivated colleagues who share your enthusiasm for success.",
    compatibleRoleTypes: ["Team leadership and management", "Sales and business development", "Project management and delivery", "Change management and transformation"]
  },

  "The Strategic Ninja": {
    headline: "The Strategic Ninja",
    summary: "Results-focused strategist who delivers excellence through analytical precision and decisive execution.",
    description: "You're a powerful combination of strategic thinking and execution excellence. You excel at analysing complex situations, developing comprehensive solutions, and driving implementation with unwavering focus. Your ability to balance thorough analysis with decisive action makes you particularly effective at managing high-stakes projects.",
    shortDiscStatement: "Strategic and precise",
    keyStrengths: [
      {
        title: "Strategic Planning",
        description: "You excel at seeing the big picture and developing comprehensive strategies that address complex challenges with clear, actionable steps."
      },
      {
        title: "Analytical Problem Solving",
        description: "You break down complex problems systematically, using data and careful analysis to identify the most effective solutions."
      },
      {
        title: "Quality Execution", 
        description: "You combine strategic thinking with flawless implementation, ensuring that plans are executed with precision and attention to detail."
      }
    ],
    
    communicationStyle: "You communicate with structure and clarity, presenting well-reasoned arguments supported by data while ensuring everyone understands the strategic rationale.",
    decisionMaking: "You make decisions based on thorough research and analysis, but act decisively once you have the information needed to move forward confidently.",
    careerMotivators: ["Working on strategic, high-impact projects", "Solving complex, challenging problems", "Achieving excellence and quality results", "Receiving recognition for expertise"],
    workStyleStrengths: ["Plans Strategically", "Analyses Thoroughly", "Executes Precisely", "Manages Risk", "Delivers Quality"],
    
    personalisedWorkStyleSummary: "You are primarily Results-Driven with strong Detail-Oriented tendencies. You excel at turning complex challenges into clear strategies and flawless execution. Your combination of analytical depth and results focus makes you exceptionally effective at strategic initiatives.",
    idealWorkEnvironment: "Strategic, Performance-Driven Culture - You thrive in environments that value strategic thinking and quality execution. Complex Challenges - You enjoy working on sophisticated problems that require analytical depth. Recognition for Expertise - You appreciate environments that recognise and reward strategic thinking and execution excellence.",
    compatibleRoleTypes: ["Strategy and consulting", "Operations management", "Strategic project management", "Business analysis and planning"]
  },

  "The Steady Achiever": {
    headline: "The Steady Achiever",
    summary: "Results-driven professional who combines goal achievement with strong team awareness and support.",
    description: "A balanced performer who delivers consistent results while maintaining strong team relationships. They excel at driving progress through collaborative approaches, ensuring that ambitious goals are achieved without sacrificing team harmony. Their ability to maintain momentum while supporting others makes them particularly effective at leading sustainable growth initiatives.",
    shortDiscStatement: "Balanced and collaborative",
    keyStrengths: ["Team Leadership", "Consistent Performance", "Relationship Management", "Goal Achievement", "Collaborative Problem Solving"],
    
    communicationStyle: "Clear, supportive, and goal-oriented. Balances directness with consideration for team dynamics.",
    decisionMaking: "Collaborative but decisive, considering both results and team impact in decision-making process.",
    careerMotivators: ["Team Success", "Sustainable Growth", "Leadership Development", "Work-Life Integration", "Collaborative Achievement"],
    workStyleStrengths: ["Builds Consensus", "Drives Results", "Supports Team", "Maintains Balance", "Sustains Performance"],
    
    personalisedWorkStyleSummary: "You have the rare ability to drive strong results while keeping your team engaged and motivated. This balance makes you an exceptional leader.",
    idealWorkEnvironment: "Collaborative, results-oriented culture with team focus, reasonable pace, and opportunities for sustainable growth.",
    compatibleRoleTypes: ["Team Management", "Customer Success", "Business Development", "Operations", "Program Management"]
  },

  // BLENDED PROFILES - Yellow Primary
  "The People Champion": {
    headline: "The People Champion",
    summary: "Inspiring leader who drives results through genuine care for people and infectious enthusiasm.",
    description: "A passionate advocate who combines natural charisma with results-driven determination to create exceptional team performance. They excel at building high-performing cultures where people feel valued and motivated to achieve extraordinary things. Their ability to inspire action while maintaining authentic relationships makes them particularly effective at leading transformational change.",
    shortDiscStatement: "Inspiring and driven",
    keyStrengths: ["People Leadership", "Team Inspiration", "Cultural Development", "Performance Management", "Change Leadership"],
    
    communicationStyle: "Passionate, authentic, and results-focused. Combines genuine care for people with clear performance expectations.",
    decisionMaking: "People-centred but decisive, considering team development and engagement alongside business outcomes.",
    careerMotivators: ["People Development", "Cultural Impact", "Leadership Growth", "Team Achievement", "Meaningful Work"],
    workStyleStrengths: ["Develops People", "Builds Culture", "Drives Engagement", "Achieves Results", "Leads Change"],
    
    personalisedWorkStyleSummary: "You have a gift for bringing out the best in others while driving exceptional results. Your authentic leadership style creates lasting positive impact.",
    idealWorkEnvironment: "People-focused, high-performance culture with leadership opportunities, team development focus, and meaningful challenges.",
    compatibleRoleTypes: ["People Leadership", "HR Leadership", "Team Management", "Organisational Development", "Executive Coaching"]
  },

  "The Team Builder": {
    headline: "The Team Builder",
    summary: "Collaborative leader who creates strong team dynamics through genuine connection and consistent support.",
    description: "A natural team catalyst who brings people together to achieve common goals through collaboration and mutual support. They excel at creating inclusive environments where diverse perspectives contribute to better outcomes. Their ability to facilitate cooperation while maintaining positive team spirit makes them particularly effective at managing cross-functional initiatives.",
    shortDiscStatement: "Collaborative and supportive",
    keyStrengths: ["Team Facilitation", "Relationship Building", "Conflict Resolution", "Inclusive Leadership", "Communication"],
    
    communicationStyle: "Inclusive, empathetic, and encouraging. Creates safe spaces for open dialogue and diverse perspectives.",
    decisionMaking: "Consensus-building approach, ensuring all voices are heard while moving toward practical solutions.",
    careerMotivators: ["Team Harmony", "Inclusive Culture", "Collaborative Success", "People Development", "Positive Impact"],
    workStyleStrengths: ["Facilitates Collaboration", "Builds Relationships", "Resolves Conflicts", "Includes Everyone", "Supports Growth"],
    
    personalisedWorkStyleSummary: "You create environments where teams truly thrive together. Your ability to bring out the best in group dynamics is exceptional.",
    idealWorkEnvironment: "Collaborative, inclusive culture with team-based work, diverse perspectives, and supportive relationships.",
    compatibleRoleTypes: ["Team Leadership", "Project Management", "HR & People Operations", "Training & Development", "Customer Success"]
  },

  "The Creative Genius": {
    headline: "The Creative Genius",
    summary: "Innovative thinker who combines enthusiastic creativity with analytical depth to solve complex challenges.",
    description: "A brilliant innovator who brings fresh perspectives and systematic thinking to complex problems. They excel at generating creative solutions while ensuring practical implementation through thorough analysis. Their ability to balance imaginative thinking with analytical rigour makes them particularly effective at driving innovation initiatives.",
    shortDiscStatement: "Creative and analytical",
    keyStrengths: ["Creative Problem Solving", "Innovation", "Analytical Thinking", "Strategic Vision", "Technical Excellence"],
    
    communicationStyle: "Enthusiastic, insightful, and detailed. Shares ideas passionately while supporting them with thorough analysis.",
    decisionMaking: "Creative but methodical, exploring innovative options while ensuring practical viability.",
    careerMotivators: ["Innovation Opportunities", "Creative Expression", "Technical Mastery", "Problem Solving", "Knowledge Sharing"],
    workStyleStrengths: ["Generates Ideas", "Solves Problems", "Analyses Thoroughly", "Thinks Strategically", "Drives Innovation"],
    
    personalisedWorkStyleSummary: "You combine creative brilliance with analytical precision, making you exceptionally effective at solving complex challenges through innovation.",
    idealWorkEnvironment: "Innovation-focused culture with creative freedom, technical challenges, and opportunities for analytical deep-work.",
    compatibleRoleTypes: ["Product Innovation", "Research & Development", "Strategic Planning", "Technical Leadership", "Creative Direction"]
  },

  // BLENDED PROFILES - Green Primary
  "The Reliable Achiever": {
    headline: "The Reliable Achiever",
    summary: "Steady performer who delivers consistent results through reliable execution and team-focused approach.",
    description: "A dependable professional who combines steady performance with goal-oriented drive to achieve sustainable success. They excel at maintaining consistent progress while supporting team objectives, ensuring that long-term goals are achieved through reliable, methodical work. Their ability to balance stability with achievement makes them particularly effective at managing ongoing operations.",
    shortDiscStatement: "Reliable and goal-focused",
    keyStrengths: ["Consistent Performance", "Team Support", "Goal Achievement", "Process Management", "Reliable Execution"],
    
    communicationStyle: "Steady, supportive, and clear. Maintains open communication while keeping focus on objectives and team success.",
    decisionMaking: "Methodical and team-conscious, balancing careful consideration with the need to achieve results.",
    careerMotivators: ["Steady Progress", "Team Success", "Skill Development", "Job Security", "Sustainable Growth"],
    workStyleStrengths: ["Maintains Consistency", "Supports Team", "Achieves Goals", "Manages Processes", "Delivers Reliably"],
    
    personalisedWorkStyleSummary: "You provide the steady foundation for achievement that every team needs. Your reliable approach to goal delivery is invaluable.",
    idealWorkEnvironment: "Stable, supportive culture with clear goals, team collaboration, and opportunities for steady career progression.",
    compatibleRoleTypes: ["Operations Management", "Project Coordination", "Customer Success", "Account Management", "Process Management"]
  },

  "The Supportive Communicator": {
    headline: "The Supportive Communicator",
    summary: "Patient facilitator who builds strong connections through empathetic communication and steady collaboration.",
    description: "A natural relationship builder who combines patient communication with genuine care for others to create positive team dynamics. They excel at facilitating understanding between diverse perspectives while maintaining supportive, inclusive environments. Their ability to listen deeply while fostering connection makes them particularly effective at managing stakeholder relationships.",
    shortDiscStatement: "Patient and connecting",
    keyStrengths: ["Empathetic Communication", "Relationship Building", "Team Facilitation", "Conflict Resolution", "Stakeholder Management"],
    
    communicationStyle: "Patient, empathetic, and inclusive. Creates space for everyone to contribute while maintaining positive relationships.",
    decisionMaking: "Collaborative and considerate, ensuring all stakeholders feel heard and valued in the decision-making process.",
    careerMotivators: ["Relationship Building", "Team Harmony", "Helping Others", "Communication Excellence", "Positive Impact"],
    workStyleStrengths: ["Facilitates Communication", "Builds Relationships", "Supports Others", "Resolves Issues", "Maintains Harmony"],
    
    personalisedWorkStyleSummary: "You have a gift for bringing people together and facilitating understanding. Your patient, supportive approach creates lasting positive relationships.",
    idealWorkEnvironment: "Collaborative, people-focused culture with emphasis on communication, relationship building, and supportive teamwork.",
    compatibleRoleTypes: ["Customer Relations", "HR & People Operations", "Training & Development", "Account Management", "Team Coordination"]
  },

  "The Patient Perfectionist": {
    headline: "The Patient Perfectionist",
    summary: "Quality-focused professional who delivers excellence through steady attention to detail and systematic approach.",
    description: "A meticulous craftsperson who combines unwavering attention to detail with patient, systematic work methods to deliver exceptional quality. They excel at creating processes that ensure consistent excellence while maintaining supportive team relationships. Their ability to balance perfectionism with collaboration makes them particularly effective at quality-critical initiatives.",
    shortDiscStatement: "Methodical and quality-focused",
    keyStrengths: ["Quality Excellence", "Attention to Detail", "Process Development", "Team Support", "Systematic Thinking"],
    
    communicationStyle: "Thoughtful, detailed, and supportive. Provides comprehensive information while maintaining patient, helpful approach.",
    decisionMaking: "Methodical and thorough, ensuring decisions are well-researched while considering team impact and quality standards.",
    careerMotivators: ["Quality Excellence", "Process Improvement", "Team Support", "Skill Mastery", "Continuous Learning"],
    workStyleStrengths: ["Ensures Quality", "Develops Processes", "Supports Team", "Maintains Standards", "Works Systematically"],
    
    personalisedWorkStyleSummary: "You combine exceptional attention to detail with genuine care for team success. Your systematic approach to quality is both thorough and supportive.",
    idealWorkEnvironment: "Quality-focused, supportive culture with adequate time for thorough work, team collaboration, and process improvement opportunities.",
    compatibleRoleTypes: ["Quality Assurance", "Process Management", "Project Management", "Operations Support", "Training & Development"]
  },

  // BLENDED PROFILES - Blue Primary
  "The Methodical Achiever": {
    headline: "The Methodical Achiever",
    summary: "Methodical expert who delivers flawless work through careful attention to detail.",
    description: "You have a natural eye for detail and care deeply about getting things right. You're the type of person who naturally spots things others might miss and has an instinct for quality work. Your methodical nature means you'd thrive in roles where accuracy and thoroughness are valued.",
    shortDiscStatement: "Analytical and detail-oriented",
    keyStrengths: [
      {
        title: "Natural Quality Focus",
        description: "You instinctively care about doing things properly and have a keen eye for spotting when something isn't quite right. This attention to detail would make you brilliant in roles requiring accuracy."
      },
      {
        title: "Independent Thinker", 
        description: "You're comfortable working through problems on your own and naturally break things down step by step. Your logical approach would help you tackle complex challenges with confidence."
      },
      {
        title: "Organised Approach",
        description: "You have a natural tendency to create order and structure, which would help you excel in roles where planning and systematic thinking are important."
      }
    ],
    
    communicationStyle: "You communicate with precision and attention to detail, ensuring accuracy and clarity in all your interactions. You value clear, concise communication and focus on facts and practical solutions.",
    decisionMaking: "You make decisions based on careful analysis and thorough research, ensuring all details are considered. You prefer having enough information before deciding and consider potential outcomes and risks.",
    careerMotivators: ["Achieving concrete, measurable results", "Working with challenging, complex problems", "Having autonomy and control over work", "Maintaining high-quality standards"],
    workStyleStrengths: ["Delivers Consistent Quality", "Works Independently", "Solves Complex Problems", "Maintains High Standards", "Organises Systematically"],
    
    personalisedWorkStyleSummary: "You are primarily Detail-Oriented with Results-Driven tendencies. You have a natural focus on quality and accuracy, following procedures and ensuring high standards are maintained. Your ideal work environment involves roles requiring precision and systematic approaches to problem-solving.",
    idealWorkEnvironment: "Clear Structure & Processes - You thrive in environments where expectations are well-defined and workflows are organised. Quality-Focused Culture - You appreciate environments that value accuracy and take pride in delivering excellent work. Focused Work Time - You're most productive with uninterrupted blocks of time to dive deep into tasks.",
    compatibleRoleTypes: ["Quality assurance and process improvement", "Analysis and research", "Strategic planning and execution", "Process optimisation and improvement"]
  },

  "The Engaging Analyst": {
    headline: "The Engaging Analyst",
    summary: "Detail-oriented communicator who combines analytical precision with exceptional interpersonal skills.",
    description: "A skilled professional who brings both analytical expertise and natural communication abilities to complex challenges. They excel at translating detailed analysis into accessible insights while building strong stakeholder relationships. Their ability to combine technical depth with engaging communication makes them particularly effective at bridging technical and business teams.",
    shortDiscStatement: "Analytical and personable",
    keyStrengths: ["Technical Communication", "Stakeholder Management", "Data Analysis", "Relationship Building", "Knowledge Transfer"],
    
    communicationStyle: "Clear, engaging, and informative. Makes complex information accessible while building strong professional relationships.",
    decisionMaking: "Data-driven but collaborative, ensuring stakeholder buy-in while maintaining analytical rigour.",
    careerMotivators: ["Technical Excellence", "Stakeholder Impact", "Knowledge Sharing", "Professional Growth", "Meaningful Contribution"],
    workStyleStrengths: ["Communicates Clearly", "Analyses Thoroughly", "Builds Relationships", "Shares Knowledge", "Engages Stakeholders"],
    
    personalisedWorkStyleSummary: "You have the rare ability to make complex analysis both accessible and engaging. Your combination of technical depth and communication skill is highly valuable.",
    idealWorkEnvironment: "Collaborative, technically-focused culture with stakeholder interaction, knowledge sharing, and analytical challenges.",
    compatibleRoleTypes: ["Business Analysis", "Technical Consulting", "Customer Success", "Training & Development", "Product Management"]
  },

  "The Thorough Collaborator": {
    headline: "The Thorough Collaborator",
    summary: "Detail-focused team player who ensures excellence through systematic collaboration and quality focus.",
    description: "A meticulous team member who combines analytical precision with genuine commitment to team success. They excel at ensuring that all details are considered while maintaining supportive, collaborative relationships. Their ability to balance thoroughness with team harmony makes them particularly effective at complex, collaborative projects.",
    shortDiscStatement: "Thorough and collaborative",
    keyStrengths: ["Detailed Analysis", "Team Collaboration", "Quality Assurance", "Process Improvement", "Systematic Thinking"],
    
    communicationStyle: "Thoughtful, detailed, and team-focused. Provides comprehensive information while maintaining supportive team relationships.",
    decisionMaking: "Thorough and inclusive, ensuring all details are considered while maintaining team consensus and support.",
    careerMotivators: ["Quality Excellence", "Team Success", "Process Improvement", "Collaborative Achievement", "Skill Development"],
    workStyleStrengths: ["Ensures Quality", "Supports Team", "Analyses Details", "Improves Processes", "Collaborates Effectively"],
    
    personalisedWorkStyleSummary: "You combine exceptional attention to detail with genuine commitment to team success. Your thorough, collaborative approach ensures excellence.",
    idealWorkEnvironment: "Quality-focused, collaborative culture with team-based work, process improvement opportunities, and supportive relationships.",
    compatibleRoleTypes: ["Quality Assurance", "Process Management", "Project Support", "Team Coordination", "Operations Support"]
  },

  // BALANCED PROFILE
  "The Balanced Achiever": {
    headline: "The Balanced Achiever",
    summary: "Adaptable professional who adjusts style to match situation demands while maintaining consistent performance.",
    description: "A versatile performer who brings flexibility and adaptability to diverse challenges and team environments. They excel at reading situations and adjusting their approach to meet specific needs, whether that requires decisive leadership, collaborative teamwork, analytical thinking, or supportive facilitation. Their natural adaptability makes them particularly effective in dynamic, changing environments.",
    shortDiscStatement: "Adaptable and versatile",
    keyStrengths: ["Adaptability", "Versatile Problem Solving", "Situational Leadership", "Flexible Communication", "Balanced Perspective"],
    
    communicationStyle: "Flexible and situational, adapting communication style to match audience needs and context requirements.",
    decisionMaking: "Context-sensitive approach, adjusting decision-making style based on situation requirements and stakeholder needs.",
    careerMotivators: ["Variety", "Learning Opportunities", "Flexible Environment", "Diverse Challenges", "Balanced Growth"],
    workStyleStrengths: ["Adapts to Context", "Balances Perspectives", "Solves Flexibly", "Communicates Effectively", "Leads Situationally"],
    
    personalisedWorkStyleSummary: "You have the valuable ability to adapt your approach to meet any situation's demands. This versatility makes you effective across diverse challenges.",
    idealWorkEnvironment: "Dynamic, varied culture with diverse challenges, learning opportunities, and flexibility to apply different approaches.",
    compatibleRoleTypes: ["General Management", "Consulting", "Project Management", "Business Development", "Operations"]
  }
};

// Helper function to get behavioral profile by personality type
export function getBehavioralProfile(personalityType: string): BehavioralProfile | null {
  return behavioralProfiles[personalityType] || null;
}

// Helper function to get all available personality types
export function getAllPersonalityTypes(): string[] {
  return Object.keys(behavioralProfiles);
}