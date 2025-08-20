// Frontend types that mirror backend data structures
export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobSeekerProfile {
  id: number;
  userId: number;
  preferredRole?: string;
  location?: string;
  experience?: string;
  education?: string;
  skills: string[];
  portfolioProjects: Array<{ name: string; url: string; description: string }>;
  profileStrength: number;
  discRedScore: number;
  discYellowScore: number;
  discGreenScore: number;
  discBlueScore: number;
  primaryProfile?: string;
  secondaryProfile?: string;
  assessmentCompleted: boolean;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployerProfile {
  id: number;
  userId: number;
  companyName: string;
  companySize?: string;
  industry?: string;
  companyDescription?: string;
  website?: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: number;
  employerId: number;
  title: string;
  description: string;
  location?: string;
  isRemote: boolean;
  salaryMin?: string;
  salaryMax?: string;
  requiredSkills: string[];
  preferredSkills: string[];
  status: string;
  challengeId?: number;
  createdAt: string;
  updatedAt: string;
  employer?: EmployerProfile;
  matchScore?: number;
}

export interface Challenge {
  id: number;
  title: string;
  description: string;
  instructions: string;
  difficulty: string;
  estimatedTime?: string;
  skills: string[];
  maxScore: number;
  isActive: boolean;
  usageCount: number;
  averageScore?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: number;
  jobId: number;
  jobSeekerId: number;
  status: string;
  matchScore?: string;
  notes?: string;
  submittedAt: string;
  updatedAt: string;
}