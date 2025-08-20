import { storage } from "./storage";

export async function seedDemoData() {
  try {
    // Create demo challenges
    const challenges = [
      {
        title: "React Component Mastery",
        description: "Build a responsive React component with proper state management and event handling.",
        instructions: "Create a TodoList component that allows users to add, edit, delete, and mark tasks as complete. Include proper TypeScript types and error handling.",
        difficulty: "intermediate",
        skills: ["React", "TypeScript", "CSS", "JavaScript"],
        estimatedTime: "45 minutes",
        passingScore: 75,
        category: "frontend",
        tags: ["react", "components", "state"],
        isPremium: false
      },
      {
        title: "API Design Challenge",
        description: "Design and implement a RESTful API with proper authentication and data validation.",
        instructions: "Create an API for a book management system with endpoints for CRUD operations, authentication, and search functionality.",
        difficulty: "advanced",
        skills: ["Node.js", "Express", "Database", "Authentication"],
        estimatedTime: "90 minutes",
        maxScore: 100
      },
      {
        title: "Database Optimization Quest",
        description: "Optimize database queries and design efficient schemas for high-performance applications.",
        instructions: "Given a slow-performing e-commerce database, identify bottlenecks and implement optimizations including indexing, query optimization, and schema improvements.",
        difficulty: "expert",
        skills: ["SQL", "Database Design", "Performance", "Indexing"],
        estimatedTime: "120 minutes",
        maxScore: 100
      },
      {
        title: "CSS Layout Magic",
        description: "Create complex responsive layouts using modern CSS techniques.",
        instructions: "Build a responsive dashboard layout using CSS Grid, Flexbox, and custom properties. Must work on mobile, tablet, and desktop.",
        difficulty: "beginner",
        skills: ["CSS", "HTML", "Responsive Design"],
        estimatedTime: "30 minutes",
        maxScore: 100
      }
    ];

    const createdChallenges = [];
    for (const challenge of challenges) {
      const created = await storage.createChallenge(challenge);
      createdChallenges.push(created);
      console.log(`Created challenge: ${challenge.title}`);
    }

    // Create demo jobs
    const jobs = [
      {
        title: "Frontend Developer",
        description: "Join our team to build amazing user interfaces using React and TypeScript. We're looking for someone passionate about creating great user experiences.",
        employerId: 1,
        location: "San Francisco, CA",
        isRemote: true,
        salaryMin: "80000",
        salaryMax: "120000",
        requiredSkills: ["React", "TypeScript", "CSS", "JavaScript"],
        preferredSkills: ["Next.js", "GraphQL", "Testing"],
        status: "active",
        challengeId: createdChallenges[0]?.id
      },
      {
        title: "Full Stack Engineer",
        description: "We need a versatile engineer who can work across the entire stack. You'll be building features from database to UI.",
        employerId: 1,
        location: "Austin, TX",
        isRemote: false,
        salaryMin: "90000",
        salaryMax: "140000",
        requiredSkills: ["Node.js", "React", "Database", "API Design"],
        preferredSkills: ["Docker", "AWS", "MongoDB"],
        status: "active",
        challengeId: createdChallenges[1]?.id
      },
      {
        title: "Database Architect",
        description: "Lead our data architecture initiatives and optimize our database systems for scale and performance.",
        employerId: 1,
        location: "Remote",
        isRemote: true,
        salaryMin: "130000",
        salaryMax: "180000",
        requiredSkills: ["SQL", "Database Design", "Performance Optimization"],
        preferredSkills: ["PostgreSQL", "Redis", "Data Modeling"],
        status: "active",
        challengeId: createdChallenges[2]?.id
      },
      {
        title: "UI/UX Developer",
        description: "Create beautiful and intuitive user interfaces. Perfect for someone who loves both design and code.",
        employerId: 1,
        location: "New York, NY",
        isRemote: true,
        salaryMin: "70000",
        salaryMax: "100000",
        requiredSkills: ["CSS", "HTML", "JavaScript", "Design"],
        preferredSkills: ["Figma", "Animation", "Accessibility"],
        status: "active",
        challengeId: createdChallenges[3]?.id
      }
    ];

    for (const job of jobs) {
      await storage.createJob(job);
      console.log(`Created job: ${job.title}`);
    }

    console.log("Demo data seeded successfully!");
  } catch (error) {
    console.error("Error seeding demo data:", error);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDemoData().then(() => process.exit(0));
}