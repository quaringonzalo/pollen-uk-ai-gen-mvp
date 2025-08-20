import React, { useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, Building2, MapPin, Clock, Users, Briefcase, 
  Target, Eye, User, Zap, Calendar, Star 
} from 'lucide-react';

// Mock job data - in production this would come from API
const getJobData = (jobId: string) => {
  const jobs: Record<string, any> = {
    "1": {
      id: 1,
      title: "Marketing Assistant",
      company: "TechFlow Solutions",
      location: "London, UK",
      type: "Full-time",
      department: "Marketing",
      salary: "£22,000 - £26,000",
      posted: "2025-01-20",
      description: "Join our dynamic marketing team as a Marketing Assistant. You'll support campaign development, social media management, and content creation while learning from experienced professionals.",
      requirements: [
        "Excellent written and verbal communication skills",
        "Interest in digital marketing and social media",
        "Basic understanding of content creation",
        "Proactive attitude and willingness to learn",
        "Degree in Marketing, Communications, or related field preferred"
      ],
      benefits: [
        "Competitive salary with annual reviews",
        "25 days holiday plus bank holidays", 
        "Professional development opportunities",
        "Health insurance and pension scheme",
        "Flexible working arrangements"
      ],
      persona: {
        name: "The Collaborative Communicator",
        description: "An enthusiastic team player who combines creative thinking with strong communication skills. They thrive in collaborative environments and are passionate about building meaningful connections through marketing.",
        keyTraits: [
          "Natural collaborative energy and team focus",
          "Strong written and verbal communication abilities", 
          "Creative problem-solving approach",
          "Genuine interest in audience engagement",
          "Adaptable and eager to learn new skills"
        ],
        idealCandidate: "Someone who brings enthusiasm to team projects, enjoys crafting compelling content, and is excited about learning modern marketing techniques while contributing to campaign success.",
        workStyle: "Prefers collaborative environments with clear communication channels, values feedback and mentorship, enjoys variety in daily tasks, and thrives when given creative freedom within structured guidelines."
      },
      skillsChallenge: {
        title: "Digital Marketing Campaign Challenge",
        description: "Design a social media campaign strategy for launching a new sustainable tech product to young professionals.",
        duration: "90 minutes",
        components: [
          {
            name: "Audience Research",
            description: "Identify target demographics and their social media preferences",
            timeAllocation: "20 minutes"
          },
          {
            name: "Content Strategy", 
            description: "Develop key messages and content pillars for the campaign",
            timeAllocation: "30 minutes"
          },
          {
            name: "Platform Selection",
            description: "Choose appropriate social media platforms and justify selections",
            timeAllocation: "25 minutes"
          },
          {
            name: "Success Metrics",
            description: "Define measurable goals and KPIs for campaign effectiveness", 
            timeAllocation: "15 minutes"
          }
        ],
        skillsAssessed: [
          "Strategic thinking and planning",
          "Understanding of social media platforms",
          "Content creation and messaging",
          "Data-driven decision making",
          "Presentation and communication skills"
        ]
      }
    },
    "2": {
      id: 2,
      title: "UX Designer",
      company: "Creative Studios",
      location: "Bristol, UK",
      type: "Full-time",
      department: "Design",
      salary: "£24,000 - £28,000",
      posted: "2025-01-18",
      description: "Join our creative team as a UX Designer. You'll work on user research, wireframing, prototyping, and creating exceptional user experiences for web and mobile applications.",
      requirements: [
        "Strong understanding of UX principles and methodologies",
        "Proficiency in design tools (Figma, Sketch, Adobe Creative Suite)",
        "Experience with user research and usability testing",
        "Knowledge of responsive design principles",
        "Portfolio demonstrating UX design process"
      ],
      benefits: [
        "Competitive salary with performance bonuses",
        "28 days holiday plus bank holidays",
        "Latest design equipment and software",
        "Creative workspace and inspiring environment",
        "Professional development budget"
      ],
      persona: {
        name: "The Empathetic Problem Solver",
        description: "A creative thinker who combines analytical skills with design intuition. They are passionate about understanding user needs and creating solutions that delight and engage.",
        keyTraits: [
          "Strong empathy and user-centered thinking",
          "Creative problem-solving abilities",
          "Attention to detail and quality",
          "Collaborative and open to feedback",
          "Curious about emerging design trends"
        ],
        idealCandidate: "Someone who enjoys researching user behaviors, iterating on designs based on feedback, and collaborating with developers to bring designs to life.",
        workStyle: "Thrives in creative environments, enjoys collaborative design sessions, values user feedback, and prefers iterative design processes with regular testing."
      },
      skillsChallenge: {
        title: "Mobile App UX Design Challenge",
        description: "Design the user flow and key screens for a sustainable shopping app targeting eco-conscious millennials.",
        duration: "120 minutes",
        components: [
          {
            name: "User Research Analysis",
            description: "Analyze provided user personas and pain points",
            timeAllocation: "30 minutes"
          },
          {
            name: "User Flow Design",
            description: "Create user journey maps for key app functions",
            timeAllocation: "40 minutes"
          },
          {
            name: "Wireframe Creation",
            description: "Design low-fidelity wireframes for main screens",
            timeAllocation: "35 minutes"
          },
          {
            name: "Design Rationale",
            description: "Present design decisions and user experience reasoning",
            timeAllocation: "15 minutes"
          }
        ],
        skillsAssessed: [
          "User experience design principles",
          "Information architecture skills",
          "Visual design and layout",
          "User research interpretation",
          "Design thinking process"
        ]
      }
    },
    "3": {
      id: 3,
      title: "Junior Developer",
      company: "StartupCo",
      location: "Manchester, UK",
      type: "Full-time",
      department: "Engineering",
      salary: "£26,000 - £30,000",
      posted: "2025-01-15",
      description: "Join our fast-growing startup as a Junior Developer. You'll work with modern technologies, contribute to exciting projects, and learn from experienced developers in an agile environment.",
      requirements: [
        "Basic understanding of programming fundamentals",
        "Familiarity with at least one programming language (JavaScript, Python, Java)",
        "Understanding of web development concepts",
        "Problem-solving mindset and attention to detail",
        "Willingness to learn new technologies quickly"
      ],
      benefits: [
        "Competitive starting salary with rapid growth potential",
        "Flexible working hours and remote options",
        "Learning budget for courses and conferences",
        "Modern tech stack and equipment",
        "Equity participation in company growth"
      ],
      persona: {
        name: "The Analytical Learner",
        description: "A logical thinker who enjoys breaking down complex problems and building efficient solutions. They are eager to learn, adapt quickly to new technologies, and thrive in collaborative development environments.",
        keyTraits: [
          "Strong analytical and logical thinking",
          "Passion for continuous learning",
          "Detail-oriented with debugging skills",
          "Team-oriented and open to mentorship",
          "Interest in emerging technologies"
        ],
        idealCandidate: "Someone who enjoys coding challenges, values code quality, and is excited about contributing to innovative projects while growing their technical skills.",
        workStyle: "Prefers structured learning environments, enjoys pair programming, values code reviews and feedback, and thrives with clear technical specifications."
      },
      skillsChallenge: {
        title: "Web Application Development Challenge",
        description: "Build a simple task management web application with basic CRUD functionality using modern web technologies.",
        duration: "150 minutes",
        components: [
          {
            name: "Requirements Analysis",
            description: "Review specifications and plan application architecture",
            timeAllocation: "20 minutes"
          },
          {
            name: "Frontend Development",
            description: "Create user interface with HTML, CSS, and JavaScript",
            timeAllocation: "60 minutes"
          },
          {
            name: "Backend Implementation",
            description: "Develop API endpoints and data persistence",
            timeAllocation: "50 minutes"
          },
          {
            name: "Code Review & Testing",
            description: "Review code quality and demonstrate functionality",
            timeAllocation: "20 minutes"
          }
        ],
        skillsAssessed: [
          "Programming fundamentals",
          "Web development skills",
          "Problem-solving approach",
          "Code organization and quality",
          "Testing and debugging abilities"
        ]
      }
    },
    "4": {
      id: 4,
      title: "Content Writer",
      company: "Digital Agency",
      location: "Remote, UK",
      type: "Full-time",
      department: "Content",
      salary: "£20,000 - £24,000",
      posted: "2025-01-12",
      description: "Join our digital agency as a Content Writer. You'll create engaging content across multiple channels, work with diverse clients, and help develop compelling brand narratives.",
      requirements: [
        "Excellent writing and editing skills in British English",
        "Understanding of SEO principles and content optimization",
        "Experience with different content formats (blogs, social media, email)",
        "Research skills and ability to write on varied topics",
        "Basic understanding of content management systems"
      ],
      benefits: [
        "Fully remote working arrangement",
        "Flexible hours within core business time",
        "Professional writing tools and software",
        "Diverse client portfolio and project variety",
        "Writing workshops and skill development"
      ],
      persona: {
        name: "The Versatile Storyteller",
        description: "A creative writer who can adapt their voice to different brands and audiences. They combine creativity with strategic thinking and are passionate about creating content that engages and converts.",
        keyTraits: [
          "Adaptable writing style and voice",
          "Strong research and fact-checking skills",
          "Understanding of audience psychology",
          "Creative thinking with strategic application",
          "Deadline-driven and organised"
        ],
        idealCandidate: "Someone who enjoys variety in their work, can switch between different brand voices, and understands how content contributes to business objectives.",
        workStyle: "Works well independently, enjoys research and creative processes, values feedback and collaboration, and prefers flexible working arrangements."
      },
      skillsChallenge: {
        title: "Multi-Channel Content Creation Challenge",
        description: "Create content strategy and samples for a sustainable fashion brand launching a new eco-friendly collection.",
        duration: "100 minutes",
        components: [
          {
            name: "Brand Voice Research",
            description: "Analyze brand positioning and develop content voice guidelines",
            timeAllocation: "25 minutes"
          },
          {
            name: "Blog Post Creation",
            description: "Write SEO-optimized blog post about sustainable fashion",
            timeAllocation: "35 minutes"
          },
          {
            name: "Social Media Content",
            description: "Create social media posts for multiple platforms",
            timeAllocation: "25 minutes"
          },
          {
            name: "Email Newsletter",
            description: "Draft email campaign for collection launch",
            timeAllocation: "15 minutes"
          }
        ],
        skillsAssessed: [
          "Writing quality and style adaptation",
          "SEO and content optimization",
          "Brand voice consistency",
          "Multi-channel content strategy",
          "Research and fact-checking skills"
        ]
      }
    },
    "5": {
      id: 5,
      title: "Sales Coordinator",
      company: "SalesForce Pro",
      location: "Birmingham, UK",
      type: "Full-time",
      department: "Sales",
      salary: "£21,000 - £25,000",
      posted: "2025-01-22",
      description: "Support our sales team as a Sales Coordinator. You'll manage customer relationships, coordinate sales activities, and help drive revenue growth through excellent organisation and communication.",
      requirements: [
        "Strong organisational and time management skills",
        "Excellent communication and interpersonal abilities",
        "Experience with CRM systems or willingness to learn",
        "Customer service mindset and problem-solving skills",
        "Basic understanding of sales processes"
      ],
      benefits: [
        "Base salary plus commission opportunities",
        "Comprehensive sales training programme",
        "Career progression pathway to sales roles",
        "Health benefits and pension scheme",
        "Team building events and incentives"
      ],
      persona: {
        name: "The Organised Facilitator",
        description: "A detail-oriented professional who excels at coordination and relationship building. They thrive in fast-paced environments and enjoy supporting team success through excellent organisation.",
        keyTraits: [
          "Exceptional organisational abilities",
          "Strong relationship-building skills",
          "Process-oriented with attention to detail",
          "Proactive communication style",
          "Results-driven mindset"
        ],
        idealCandidate: "Someone who enjoys supporting sales teams, managing multiple priorities, and building relationships with customers and colleagues.",
        workStyle: "Thrives in structured environments with clear processes, enjoys team collaboration, values regular communication, and prefers measurable goals and outcomes."
      },
      skillsChallenge: {
        title: "Sales Support Coordination Challenge",
        description: "Manage a complex sales scenario involving multiple prospects, team coordination, and customer relationship management.",
        duration: "90 minutes",
        components: [
          {
            name: "Lead Prioritisation",
            description: "Analyse and prioritise incoming sales leads",
            timeAllocation: "20 minutes"
          },
          {
            name: "Team Coordination",
            description: "Coordinate sales team schedules and activities",
            timeAllocation: "25 minutes"
          },
          {
            name: "Customer Communication",
            description: "Draft customer follow-up communications",
            timeAllocation: "30 minutes"
          },
          {
            name: "Process Improvement",
            description: "Identify and propose sales process improvements",
            timeAllocation: "15 minutes"
          }
        ],
        skillsAssessed: [
          "Organisational and coordination skills",
          "Customer relationship management",
          "Communication and writing abilities",
          "Process analysis and improvement",
          "Team collaboration and support"
        ]
      }
    },
    "6": {
      id: 6,
      title: "Data Analyst",
      company: "Analytics Hub",
      location: "London, UK",
      type: "Full-time",
      department: "Analytics",
      salary: "£25,000 - £29,000",
      posted: "2025-01-25",
      description: "Join our analytics team as a Data Analyst. You'll work with large datasets, create insights and reports, and help drive data-informed decision making across the organisation.",
      requirements: [
        "Strong analytical and mathematical skills",
        "Proficiency in Excel and basic SQL knowledge",
        "Understanding of statistical concepts and data visualisation",
        "Experience with data analysis tools (Python, R, or similar)",
        "Attention to detail and accuracy in data work"
      ],
      benefits: [
        "Competitive salary with annual performance reviews",
        "Training in advanced analytics tools and techniques",
        "Exposure to diverse business challenges and data sets",
        "Professional development in data science",
        "Modern analytics tools and computing resources"
      ],
      persona: {
        name: "The Insightful Investigator",
        description: "A curious problem solver who enjoys uncovering patterns in data and translating complex information into actionable insights. They combine technical skills with business understanding.",
        keyTraits: [
          "Strong analytical and critical thinking",
          "Attention to detail and accuracy",
          "Curiosity about data patterns and trends",
          "Business acumen and insight generation",
          "Technical aptitude with analytical tools"
        ],
        idealCandidate: "Someone who enjoys working with numbers, finds satisfaction in solving complex problems, and can communicate technical findings to non-technical stakeholders.",
        workStyle: "Prefers methodical approaches to problem-solving, enjoys independent work with regular collaboration, values accuracy and quality, and thrives with clear objectives and deadlines."
      },
      skillsChallenge: {
        title: "Business Analytics Challenge",
        description: "Analyse customer data to identify trends and provide actionable recommendations for improving customer retention.",
        duration: "120 minutes",
        components: [
          {
            name: "Data Exploration",
            description: "Examine and clean the provided customer dataset",
            timeAllocation: "30 minutes"
          },
          {
            name: "Statistical Analysis",
            description: "Perform statistical analysis to identify key trends",
            timeAllocation: "40 minutes"
          },
          {
            name: "Visualisation Creation",
            description: "Create charts and graphs to communicate findings",
            timeAllocation: "30 minutes"
          },
          {
            name: "Business Recommendations",
            description: "Present insights and actionable recommendations",
            timeAllocation: "20 minutes"
          }
        ],
        skillsAssessed: [
          "Data analysis and interpretation skills",
          "Statistical thinking and methodology",
          "Data visualisation abilities",
          "Business insight generation",
          "Presentation and communication skills"
        ]
      }
    },
    "7": {
      id: 7,
      title: "Social Media Manager",
      company: "Brand Builders Ltd",
      location: "Leeds, UK",
      type: "Full-time",
      department: "Marketing",
      salary: "£23,000 - £27,000",
      posted: "2025-01-17",
      description: "Lead our social media strategy as a Social Media Manager. You'll develop engaging content, manage community relationships, and drive brand awareness across multiple platforms.",
      requirements: [
        "Experience managing social media accounts for businesses",
        "Strong understanding of social media platforms and trends",
        "Content creation skills including basic graphic design",
        "Analytics and reporting experience",
        "Creative thinking with strategic mindset"
      ],
      benefits: [
        "Creative freedom in content development",
        "Social media tools and design software",
        "Flexible working arrangements",
        "Professional development opportunities",
        "Performance-based bonuses"
      ],
      persona: {
        name: "The Creative Connector",
        description: "A digitally-native professional who understands how to build authentic connections through social media. They balance creativity with strategic thinking and data-driven insights.",
        keyTraits: [
          "Creative content development skills",
          "Strong understanding of digital trends",
          "Community building and engagement focus",
          "Data-driven decision making",
          "Brand voice and consistency awareness"
        ],
        idealCandidate: "Someone who lives and breathes social media, understands different platform nuances, and can create content that genuinely connects with audiences.",
        workStyle: "Thrives in fast-paced digital environments, enjoys creative collaboration, values real-time feedback, and prefers flexible, responsive working styles."
      },
      skillsChallenge: {
        title: "Social Media Strategy Challenge",
        description: "Develop a comprehensive social media strategy for a sustainable lifestyle brand targeting environmentally conscious consumers.",
        duration: "100 minutes",
        components: [
          {
            name: "Platform Strategy",
            description: "Select platforms and define content strategy for each",
            timeAllocation: "25 minutes"
          },
          {
            name: "Content Calendar",
            description: "Create 2-week content calendar with post ideas",
            timeAllocation: "35 minutes"
          },
          {
            name: "Community Management",
            description: "Develop engagement and response strategies",
            timeAllocation: "25 minutes"
          },
          {
            name: "Performance Metrics",
            description: "Define KPIs and measurement framework",
            timeAllocation: "15 minutes"
          }
        ],
        skillsAssessed: [
          "Social media strategy development",
          "Content planning and creation",
          "Community management skills",
          "Analytics and measurement",
          "Brand voice development"
        ]
      }
    },
    "8": {
      id: 8,
      title: "Junior Accountant",
      company: "Finance First",
      location: "Newcastle, UK",
      type: "Full-time",
      department: "Finance",
      salary: "£19,000 - £23,000",
      posted: "2025-01-16",
      description: "Start your accounting career as a Junior Accountant. You'll support financial operations, assist with bookkeeping, and learn advanced accounting practices in a supportive environment.",
      requirements: [
        "Basic understanding of accounting principles",
        "Proficiency in Excel and willingness to learn accounting software",
        "Attention to detail and numerical accuracy",
        "Interest in pursuing accounting qualifications (ACCA/CIMA)",
        "Strong organisational and time management skills"
      ],
      benefits: [
        "Study support for professional qualifications",
        "Mentorship from qualified accountants",
        "Clear career progression pathway",
        "Comprehensive training programme",
        "Competitive salary with annual reviews"
      ],
      persona: {
        name: "The Methodical Builder",
        description: "A detail-oriented professional who enjoys working with numbers and building systematic approaches to financial management. They value accuracy, process, and continuous learning.",
        keyTraits: [
          "Strong attention to detail and accuracy",
          "Systematic and methodical approach",
          "Interest in financial analysis and planning",
          "Process-oriented thinking",
          "Commitment to professional development"
        ],
        idealCandidate: "Someone who enjoys working with numbers, values precision and accuracy, and is interested in building a career in financial services.",
        workStyle: "Prefers structured environments with clear procedures, enjoys detailed work, values accuracy over speed, and thrives with regular learning opportunities."
      },
      skillsChallenge: {
        title: "Financial Analysis Challenge",
        description: "Analyse financial statements and prepare reconciliation reports for a small business scenario.",
        duration: "110 minutes",
        components: [
          {
            name: "Data Verification",
            description: "Review and verify financial transaction data",
            timeAllocation: "30 minutes"
          },
          {
            name: "Reconciliation",
            description: "Perform bank and account reconciliations",
            timeAllocation: "40 minutes"
          },
          {
            name: "Financial Reporting",
            description: "Prepare summary reports and identify discrepancies",
            timeAllocation: "30 minutes"
          },
          {
            name: "Process Improvement",
            description: "Suggest improvements to financial processes",
            timeAllocation: "10 minutes"
          }
        ],
        skillsAssessed: [
          "Numerical accuracy and attention to detail",
          "Financial analysis skills",
          "Reconciliation and verification abilities",
          "Process thinking and improvement",
          "Report writing and communication"
        ]
      }
    },
    "9": {
      id: 9,
      title: "Customer Success Representative",
      company: "TechSupport Pro",
      location: "Remote, UK",
      type: "Full-time",
      department: "Customer Success",
      salary: "£20,000 - £24,000",
      posted: "2025-01-15",
      description: "Join our customer success team to help clients achieve their goals with our technology platform. You'll provide support, drive adoption, and ensure customer satisfaction.",
      requirements: [
        "Excellent communication and interpersonal skills",
        "Problem-solving mindset and patience",
        "Basic technical aptitude and willingness to learn",
        "Customer service experience preferred",
        "Ability to work independently in remote environment"
      ],
      benefits: [
        "Fully remote working with flexible hours",
        "Comprehensive product training",
        "Career development in customer success",
        "Performance incentives and bonuses",
        "Modern technology and communication tools"
      ],
      persona: {
        name: "The Empathetic Problem Solver",
        description: "A people-focused professional who genuinely cares about helping others succeed. They combine technical aptitude with emotional intelligence and relationship-building skills.",
        keyTraits: [
          "Strong empathy and listening skills",
          "Problem-solving and troubleshooting abilities",
          "Patience and persistence with challenges",
          "Relationship building and trust development",
          "Technical curiosity and learning mindset"
        ],
        idealCandidate: "Someone who enjoys helping others, can explain complex concepts simply, and finds satisfaction in seeing customers succeed with technology solutions.",
        workStyle: "Thrives in relationship-focused environments, enjoys variety in daily interactions, values customer feedback, and prefers collaborative problem-solving approaches."
      },
      skillsChallenge: {
        title: "Customer Success Scenario Challenge",
        description: "Handle multiple customer scenarios involving technical issues, adoption challenges, and relationship management.",
        duration: "90 minutes",
        components: [
          {
            name: "Technical Troubleshooting",
            description: "Diagnose and resolve customer technical issues",
            timeAllocation: "25 minutes"
          },
          {
            name: "Adoption Strategy",
            description: "Develop plan for improving customer product usage",
            timeAllocation: "30 minutes"
          },
          {
            name: "Relationship Management",
            description: "Handle difficult customer conversation scenarios",
            timeAllocation: "25 minutes"
          },
          {
            name: "Success Metrics",
            description: "Define and track customer success indicators",
            timeAllocation: "10 minutes"
          }
        ],
        skillsAssessed: [
          "Customer communication and empathy",
          "Technical problem-solving abilities",
          "Relationship building and management",
          "Strategic thinking for customer success",
          "Conflict resolution and patience"
        ]
      }
    },
    "10": {
      id: 10,
      title: "Graphic Designer",
      company: "Creative Agency Plus",
      location: "Brighton, UK",
      type: "Full-time",
      department: "Design",
      salary: "£21,000 - £25,000",
      posted: "2025-01-14",
      description: "Create stunning visual designs as a Graphic Designer. You'll work on diverse client projects, develop brand identities, and bring creative concepts to life across digital and print media.",
      requirements: [
        "Proficiency in Adobe Creative Suite (Photoshop, Illustrator, InDesign)",
        "Strong portfolio demonstrating design skills",
        "Understanding of typography, colour theory, and layout principles",
        "Creative thinking with attention to detail",
        "Ability to work on multiple projects simultaneously"
      ],
      benefits: [
        "Creative environment with diverse projects",
        "Latest design software and equipment",
        "Professional development and workshop opportunities",
        "Collaborative team culture",
        "Flexible working arrangements"
      ],
      persona: {
        name: "The Visual Storyteller",
        description: "A creative professional who combines artistic vision with strategic thinking. They understand how design communicates messages and influences emotions, creating work that is both beautiful and effective.",
        keyTraits: [
          "Strong artistic and visual design skills",
          "Understanding of brand communication",
          "Attention to detail and quality",
          "Creative problem-solving approach",
          "Adaptability to different design styles"
        ],
        idealCandidate: "Someone who is passionate about visual communication, enjoys working on varied projects, and can translate client needs into compelling design solutions.",
        workStyle: "Thrives in creative environments, enjoys collaborative feedback sessions, values artistic freedom within client guidelines, and prefers hands-on creative work."
      },
      skillsChallenge: {
        title: "Brand Identity Design Challenge",
        description: "Create a complete brand identity for a new eco-friendly food delivery service targeting urban professionals.",
        duration: "120 minutes",
        components: [
          {
            name: "Brand Research",
            description: "Analyse target audience and competitive landscape",
            timeAllocation: "20 minutes"
          },
          {
            name: "Logo Design",
            description: "Create primary logo and variations",
            timeAllocation: "50 minutes"
          },
          {
            name: "Visual Identity",
            description: "Develop colour palette, typography, and visual style",
            timeAllocation: "35 minutes"
          },
          {
            name: "Application Design",
            description: "Apply brand to business card and app mockup",
            timeAllocation: "15 minutes"
          }
        ],
        skillsAssessed: [
          "Brand design and identity development",
          "Logo creation and visual communication",
          "Typography and colour theory",
          "Design software proficiency",
          "Creative thinking and concept development"
        ]
      }
    },
    "11": {
      id: 11,
      title: "HR Assistant",
      company: "People Solutions",
      location: "Cardiff, UK",
      type: "Full-time",
      department: "Human Resources",
      salary: "£18,000 - £22,000",
      posted: "2025-01-13",
      description: "Support our HR team as an HR Assistant. You'll help with recruitment, employee onboarding, record management, and contribute to creating a positive workplace culture.",
      requirements: [
        "Strong interpersonal and communication skills",
        "Excellent organisational abilities and attention to detail",
        "Discretion and confidentiality in handling sensitive information",
        "Basic understanding of HR processes and employment law",
        "Proficiency in MS Office and willingness to learn HR systems"
      ],
      benefits: [
        "Exposure to all aspects of HR operations",
        "Training in employment law and HR best practices",
        "Career development opportunities in human resources",
        "Supportive team environment",
        "Competitive benefits package"
      ],
      persona: {
        name: "The People-Focused Organiser",
        description: "A naturally empathetic professional who enjoys supporting others and creating positive workplace experiences. They combine strong organisational skills with genuine care for employee wellbeing.",
        keyTraits: [
          "Strong empathy and people skills",
          "Excellent organisational abilities",
          "Discretion and professional integrity",
          "Interest in employee development and wellbeing",
          "Process-oriented with attention to detail"
        ],
        idealCandidate: "Someone who enjoys helping others, values workplace culture and employee experience, and is interested in building a career in human resources.",
        workStyle: "Prefers collaborative environments with regular people interaction, values confidentiality and professionalism, enjoys variety in daily tasks, and thrives in supportive team settings."
      },
      skillsChallenge: {
        title: "HR Operations Challenge",
        description: "Handle various HR scenarios including recruitment support, employee queries, and policy implementation.",
        duration: "100 minutes",
        components: [
          {
            name: "Recruitment Support",
            description: "Screen CVs and coordinate interview scheduling",
            timeAllocation: "30 minutes"
          },
          {
            name: "Employee Onboarding",
            description: "Develop onboarding checklist and materials",
            timeAllocation: "25 minutes"
          },
          {
            name: "Policy Communication",
            description: "Draft employee communication about new policies",
            timeAllocation: "25 minutes"
          },
          {
            name: "Employee Query Resolution",
            description: "Handle various employee questions and concerns",
            timeAllocation: "20 minutes"
          }
        ],
        skillsAssessed: [
          "Organisational and coordination skills",
          "Communication and interpersonal abilities",
          "HR process understanding",
          "Discretion and professional judgement",
          "Problem-solving and support skills"
        ]
      }
    },
    "12": {
      id: 12,
      title: "Operations Coordinator",
      company: "Logistics Pro",
      location: "Glasgow, UK",
      type: "Full-time",
      department: "Operations",
      salary: "£20,000 - £24,000",
      posted: "2025-01-12",
      description: "Coordinate daily operations as an Operations Coordinator. You'll manage schedules, track performance metrics, coordinate with teams, and help ensure smooth operational efficiency.",
      requirements: [
        "Strong organisational and multitasking abilities",
        "Excellent communication and coordination skills",
        "Basic understanding of logistics and operations",
        "Proficiency in Excel and operational software",
        "Problem-solving mindset with attention to detail"
      ],
      benefits: [
        "Exposure to end-to-end operations management",
        "Training in logistics and supply chain processes",
        "Career advancement opportunities",
        "Performance-based incentives",
        "Collaborative team environment"
      ],
      persona: {
        name: "The Systematic Coordinator",
        description: "A highly organised professional who excels at managing multiple moving parts and ensuring everything runs smoothly. They thrive on coordination, efficiency, and process improvement.",
        keyTraits: [
          "Exceptional organisational abilities",
          "Strong coordination and multitasking skills",
          "Process improvement mindset",
          "Team collaboration and communication",
          "Results-oriented with attention to efficiency"
        ],
        idealCandidate: "Someone who enjoys coordinating complex operations, values efficiency and smooth processes, and finds satisfaction in ensuring everything runs on schedule.",
        workStyle: "Thrives in structured environments with clear processes, enjoys cross-team coordination, values regular communication and updates, and prefers systematic approaches to work."
      },
      skillsChallenge: {
        title: "Operations Coordination Challenge",
        description: "Manage a complex operational scenario involving scheduling, resource allocation, and performance tracking.",
        duration: "110 minutes",
        components: [
          {
            name: "Resource Planning",
            description: "Coordinate schedules and allocate resources efficiently",
            timeAllocation: "30 minutes"
          },
          {
            name: "Performance Monitoring",
            description: "Track operational metrics and identify issues",
            timeAllocation: "25 minutes"
          },
          {
            name: "Problem Resolution",
            description: "Handle operational disruptions and delays",
            timeAllocation: "35 minutes"
          },
          {
            name: "Process Improvement",
            description: "Identify and propose operational improvements",
            timeAllocation: "20 minutes"
          }
        ],
        skillsAssessed: [
          "Organisational and coordination skills",
          "Multitasking and priority management",
          "Problem-solving under pressure",
          "Process analysis and improvement",
          "Communication and team coordination"
        ]
      }
    },
    "13": {
      id: 13,
      title: "Digital Marketing Specialist",
      company: "Marketing Masters",
      location: "Edinburgh, UK",
      type: "Full-time",
      department: "Digital Marketing",
      salary: "£22,000 - £26,000",
      posted: "2025-01-11",
      description: "Drive digital marketing success as a Digital Marketing Specialist. You'll manage online campaigns, analyse performance data, and optimize digital channels to achieve marketing objectives.",
      requirements: [
        "Understanding of digital marketing channels and strategies",
        "Experience with social media advertising and Google Ads",
        "Basic knowledge of SEO and content marketing",
        "Analytics skills and data interpretation abilities",
        "Creative thinking with analytical mindset"
      ],
      benefits: [
        "Access to leading digital marketing tools",
        "Training in latest digital marketing techniques",
        "Performance bonuses based on campaign success",
        "Career development in digital marketing",
        "Creative and collaborative work environment"
      ],
      persona: {
        name: "The Data-Driven Creative",
        description: "A strategic thinker who combines creative marketing instincts with analytical rigor. They understand how to balance brand building with performance metrics and ROI.",
        keyTraits: [
          "Strategic digital marketing thinking",
          "Data analysis and interpretation skills",
          "Creative campaign development abilities",
          "Understanding of customer acquisition",
          "Results-oriented with ROI focus"
        ],
        idealCandidate: "Someone who enjoys the intersection of creativity and data, understands digital customer journeys, and is excited about driving measurable marketing results.",
        workStyle: "Thrives in fast-paced digital environments, enjoys testing and optimising campaigns, values data-driven decision making, and prefers collaborative creative processes."
      },
      skillsChallenge: {
        title: "Digital Campaign Strategy Challenge",
        description: "Develop and optimize a comprehensive digital marketing campaign for a B2B software company targeting small businesses.",
        duration: "120 minutes",
        components: [
          {
            name: "Campaign Strategy",
            description: "Develop multi-channel digital marketing strategy",
            timeAllocation: "35 minutes"
          },
          {
            name: "Content Planning",
            description: "Create content calendar and creative concepts",
            timeAllocation: "30 minutes"
          },
          {
            name: "Performance Analysis",
            description: "Analyse campaign data and optimization opportunities",
            timeAllocation: "35 minutes"
          },
          {
            name: "ROI Optimization",
            description: "Propose improvements for better campaign performance",
            timeAllocation: "20 minutes"
          }
        ],
        skillsAssessed: [
          "Digital marketing strategy development",
          "Multi-channel campaign planning",
          "Data analysis and interpretation",
          "Performance optimization thinking",
          "ROI and conversion optimization"
        ]
      }
    }
  };
  
  return jobs[jobId] || null;
};

export default function JobPostingView() {
  const [match] = useRoute('/job-posting-view/:jobId');
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('overview');

  const jobId = match ? (match as any).jobId : undefined;
  const job = jobId ? getJobData(jobId) : null;

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Job Not Found</h3>
            <p className="text-gray-600 mb-4">The requested job posting could not be found.</p>
            <Button onClick={() => setLocation('/employer-jobs')}>
              Back to Jobs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => setLocation("/employer-jobs")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Jobs
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900" style={{fontFamily: 'Sora'}}>
                  {job.title}
                </h1>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {job.company}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    {job.type}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline"
                onClick={() => setLocation('/candidates')}
                className="flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                View Candidates
              </Button>
              <Button 
                className="bg-pink-600 hover:bg-pink-700 flex items-center gap-2"
                onClick={() => setLocation(`/job-posting-form/${jobId}`)}
              >
                <Eye className="w-4 h-4" />
                Edit Job
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Job Overview</TabsTrigger>
            <TabsTrigger value="persona">Ideal Candidate Persona</TabsTrigger>
            <TabsTrigger value="challenge">Skills Challenge</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2" style={{fontFamily: 'Sora'}}>
                      <Briefcase className="w-5 h-5" />
                      Job Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700 leading-relaxed" style={{fontFamily: 'Poppins'}}>
                      {job.description}
                    </p>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3" style={{fontFamily: 'Sora'}}>
                        Requirements
                      </h4>
                      <ul className="space-y-2">
                        {job.requirements.map((requirement: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-gray-700" style={{fontFamily: 'Poppins'}}>
                            <Target className="w-4 h-4 mt-0.5 text-pink-600 flex-shrink-0" />
                            {requirement}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3" style={{fontFamily: 'Sora'}}>
                        Benefits
                      </h4>
                      <ul className="space-y-2">
                        {job.benefits.map((benefit: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-gray-700" style={{fontFamily: 'Poppins'}}>
                            <Star className="w-4 h-4 mt-0.5 text-yellow-500 flex-shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle style={{fontFamily: 'Sora'}}>Job Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Salary Range</p>
                      <p className="text-lg font-semibold text-gray-900" style={{fontFamily: 'Sora'}}>
                        {job.salary}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Department</p>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {job.department}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Posted</p>
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4" />
                        {new Date(job.posted).toLocaleDateString('en-GB', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="persona" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{fontFamily: 'Sora'}}>
                  <User className="w-5 h-5" />
                  {job.persona.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-lg text-gray-700 leading-relaxed" style={{fontFamily: 'Poppins'}}>
                  {job.persona.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3" style={{fontFamily: 'Sora'}}>
                      Key Traits
                    </h4>
                    <ul className="space-y-2">
                      {job.persona.keyTraits.map((trait: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700" style={{fontFamily: 'Poppins'}}>
                          <Zap className="w-4 h-4 mt-0.5 text-pink-600 flex-shrink-0" />
                          {trait}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3" style={{fontFamily: 'Sora'}}>
                      Work Style
                    </h4>
                    <p className="text-gray-700 leading-relaxed" style={{fontFamily: 'Poppins'}}>
                      {job.persona.workStyle}
                    </p>
                  </div>
                </div>

                <div className="bg-pink-50 border border-pink-200 rounded-lg p-4">
                  <h4 className="font-semibold text-pink-900 mb-2" style={{fontFamily: 'Sora'}}>
                    Ideal Candidate Profile
                  </h4>
                  <p className="text-pink-800" style={{fontFamily: 'Poppins'}}>
                    {job.persona.idealCandidate}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="challenge" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{fontFamily: 'Sora'}}>
                  <Target className="w-5 h-5" />
                  {job.skillsChallenge.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-900">Duration: {job.skillsChallenge.duration}</p>
                    <p className="text-sm text-yellow-700">Candidates have this amount of time to complete the challenge</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3" style={{fontFamily: 'Sora'}}>
                    Challenge Overview
                  </h4>
                  <p className="text-gray-700 leading-relaxed mb-6" style={{fontFamily: 'Poppins'}}>
                    {job.skillsChallenge.description}
                  </p>

                  <h4 className="font-semibold text-gray-900 mb-4" style={{fontFamily: 'Sora'}}>
                    Challenge Components
                  </h4>
                  <div className="space-y-4">
                    {job.skillsChallenge.components.map((component: any, index: number) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900" style={{fontFamily: 'Sora'}}>
                            {component.name}
                          </h5>
                          <Badge variant="outline" className="text-xs">
                            {component.timeAllocation}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm" style={{fontFamily: 'Poppins'}}>
                          {component.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3" style={{fontFamily: 'Sora'}}>
                    Skills Being Assessed
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {job.skillsChallenge.skillsAssessed.map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}