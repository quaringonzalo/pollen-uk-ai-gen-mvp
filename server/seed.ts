import { storage } from "./storage";

export async function seedDatabase() {
  try {
    // Create sample users
    const jobSeeker = await storage.createUser({
      email: "alex.chen@example.com",
      firstName: "Alex",
      lastName: "Chen",
      role: "job_seeker",
    });

    const employer = await storage.createUser({
      email: "sarah.wilson@techstart.com",
      firstName: "Sarah",
      lastName: "Wilson", 
      role: "employer",
    });

    const admin = await storage.createUser({
      email: "admin@pollen.com",
      firstName: "Admin",
      lastName: "User",
      role: "admin",
    });

    // Create job seeker profile
    const jobSeekerProfile = await storage.createJobSeekerProfile({
      userId: jobSeeker.id,
      preferredRole: "Frontend Developer",
      skills: ["React", "TypeScript", "JavaScript", "CSS", "Node.js"],
      portfolioProjects: [
        {
          name: "E-commerce Platform",
          url: "https://github.com/alexchen/ecommerce",
          description: "Full-stack e-commerce platform built with React and Node.js"
        },
        {
          name: "Task Management App",
          url: "https://github.com/alexchen/taskapp",
          description: "Collaborative task management application with real-time updates"
        }
      ],
      profileStrength: 85,
      bio: "Passionate frontend developer with 3 years of experience building modern web applications. I love creating intuitive user experiences and writing clean, maintainable code.",
    });

    // Create employer profile
    const employerProfile = await storage.createEmployerProfile({
      userId: employer.id,
      companyName: "TechStart Inc.",
      companySize: "50-100",
      industry: "Software Development",
      companyDescription: "We're a fast-growing startup building the next generation of productivity tools for remote teams.",
      website: "https://techstart.com",
    });

    // Create challenges
    const reactChallenge = await storage.createChallenge({
      title: "React Component Challenge",
      description: "Build a responsive product card component with interactive features including image carousel, add to cart functionality, and rating system.",
      instructions: "Create a React component that displays product information in an attractive card format. The component should be fully responsive and include hover effects, image zoom, and smooth animations.",
      difficulty: "intermediate",
      estimatedTime: "2-3 hours",
      skills: ["React", "CSS", "JavaScript"],
      maxScore: 100,
      isActive: true,
      usageCount: 23,
      averageScore: "78.5",
    });

    const apiChallenge = await storage.createChallenge({
      title: "API Design Challenge", 
      description: "Design and implement a RESTful API for a task management system with user authentication, CRUD operations, and real-time notifications.",
      instructions: "Build a complete backend API using Node.js and Express. Include proper error handling, input validation, and API documentation.",
      difficulty: "advanced",
      estimatedTime: "4-5 hours",
      skills: ["Node.js", "Express", "MongoDB", "REST API"],
      maxScore: 100,
      isActive: true,
      usageCount: 15,
      averageScore: "82.3",
    });

    // Create jobs
    const frontendJob = await storage.createJob({
      employerId: employerProfile.id,
      title: "Senior Frontend Developer",
      description: "Join our team to build the next generation of productivity tools. You'll work on our React-based web application, focusing on user experience and performance optimization.",
      location: "San Francisco, CA",
      isRemote: true,
      salaryMin: "95000",
      salaryMax: "130000",
      requiredSkills: ["React", "TypeScript", "JavaScript"],
      preferredSkills: ["Node.js", "GraphQL", "AWS"],
      status: "active",
      challengeId: reactChallenge.id,
    });

    const backendJob = await storage.createJob({
      employerId: employerProfile.id,
      title: "Backend Engineer",
      description: "Build scalable backend systems and APIs that power our platform. Work with modern technologies and contribute to architectural decisions.",
      location: "Remote",
      isRemote: true,
      salaryMin: "90000",
      salaryMax: "125000",
      requiredSkills: ["Node.js", "Python", "PostgreSQL"],
      preferredSkills: ["Docker", "Kubernetes", "AWS"],
      status: "active",
      challengeId: apiChallenge.id,
    });

    // Create workflows for jobs
    await storage.createWorkflow({
      jobId: frontendJob.id,
      currentStage: "challenge_review",
      totalStages: 5,
      progress: "60",
      status: "active",
    });

    await storage.createWorkflow({
      jobId: backendJob.id,
      currentStage: "applications",
      totalStages: 5,
      progress: "20",
      status: "active",
    });

    // Create applications
    const application = await storage.createApplication({
      jobId: frontendJob.id,
      jobSeekerId: jobSeekerProfile.id,
      status: "challenge_completed",
      matchScore: "94.5",
      notes: "Excellent technical skills and great cultural fit",
    });

    // Create challenge submission
    await storage.createChallengeSubmission({
      applicationId: application.id,
      challengeId: reactChallenge.id,
      submissionUrl: "https://github.com/alexchen/react-challenge",
      submissionText: "I implemented the product card component with all requested features plus additional accessibility improvements and smooth animations.",
      score: 92,
      feedback: "Excellent implementation with clean code structure and great attention to detail. The accessibility features are particularly impressive.",
      reviewedBy: employer.id,
    });

    console.log("Database seeded successfully!");
    return true;
  } catch (error) {
    console.error("Error seeding database:", error);
    return false;
  }
}