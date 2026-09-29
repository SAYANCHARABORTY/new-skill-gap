export type UserRole = 'student' | 'recruiter' | 'academic' | 'mentor';

export interface BaseUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  avatarUrl?: string;
}

export interface StudentProfile extends BaseUser {
  role: 'student';
  college: string;
  degree: string;
  branch: string;
  year: string; // e.g. "1st Year", "2nd Year", "3rd Year", "Final Year"
  skills: StudentSkill[];
  targetCareer: string; // e.g. "Full Stack Developer", "AI Engineer", "Product Designer"
  learningInterests: string[];
  bio?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  latestAnalysis?: AIAnalysisResult;
}


export interface StudentSkill {
  id: string;
  name: string;
  category?: string; // e.g. "Frontend", "Backend", "AI/ML", "DevOps"
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  yearsExperience?: number;
  addedAt: string;
}

export interface MentorProfile extends BaseUser {
  role: 'mentor';
  professionalRole: string; // e.g. "Staff Engineer @ CloudTech"
  industry: string; // e.g. "Fintech", "Software", "Semiconductors"
  experienceYears: number;
  subjectsTaught: string[]; // e.g. ["React", "System Design", "Cloud Architecture"]
  bio: string;
  teachingPreference: '1-on-1 Mentorship' | 'Group Sessions' | 'Async Code Review' | 'Career Guidance';
  availability: string; // e.g. "Weekends 4-7 PM", "Flexible weekday evenings"
  portfolioUrl?: string;
  instagramId?: string;
  whatsAppNumber?: string;
  telegramUrl?: string;
  otherLinks?: string[];
}

export interface RecruiterProfile extends BaseUser {
  role: 'recruiter';
  company: string;
  industry: string;
  recruiterRole: string; // e.g. "Technical Recruiter", "Head of Talent"
  companyWebsite?: string;
  companySize?: string;
  location?: string;
  companyDescription?: string;
}

export interface AcademicAdminProfile extends BaseUser {
  role: 'academic';
  institution: string; // e.g. "National Institute of Technology"
  department: string; // e.g. "Computer Science & Engineering"
  officialEmailDomain?: string;
}

export type AnyUserProfile = StudentProfile | MentorProfile | RecruiterProfile | AcademicAdminProfile;

export interface Opportunity {
  id: string;
  recruiterId: string;
  companyName: string;
  title: string;
  type: 'job' | 'internship';
  industry: string;
  location: string;
  isRemote: boolean;
  requiredSkills: string[];
  experienceRequirement: string; // e.g. "Fresher", "0-1 years", "2+ years"
  stipendOrSalary?: string;
  duration?: string; // For internships e.g. "3 Months", "6 Months"
  description: string;
  responsibilities: string[];
  perks?: string[];
  deadline?: string;
  createdAt: string;
}

export interface Application {
  id: string;
  opportunityId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentCollege: string;
  studentDegree: string;
  studentSkills: string[];
  coverLetter?: string;
  resumeUrl?: string;
  status: 'applied' | 'under_review' | 'interview_scheduled' | 'accepted' | 'rejected';
  appliedAt: string;
  updatedAt: string;
}

export interface MentorConnection {
  id: string;
  mentorId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  subjectOfInterest: string;
  message: string;
  status: 'pending' | 'connected' | 'completed' | 'declined';
  createdAt: string;
}

export interface LearningResource {
  id: string;
  title: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  category: string;
  url?: string;
  description: string;
  tags: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  createdAt: string;
}

export interface PracticeProject {
  id: string;
  creatorId: string;
  creatorName: string;
  title: string;
  description: string;
  targetSkills: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Hard';
  githubRepoTemplate?: string;
  submissionsCount: number;
  createdAt: string;
}

export interface SkillGapItem {
  skill: string;
  marketDemandScore: number;
  isPossessedByStudent: boolean;
  category: string;
}

export interface NirvanaChatMessage {
  id: string;
  sender: 'user' | 'nirvana';
  text: string;
  timestamp: string;
  metadata?: {
    identifiedSkills?: string[];
    suggestedRoadmap?: string[];
  };
}

export interface AIAnalysisResult {
  score: number; // 0-100 clamped score from Groq
  summary: string;
  strongSkills: string[];
  moderateSkills: string[];
  weakSkills: string[];
  missingSkills: string[];
  industryRequiredSkills: string[];
  recommendations: string[];
  projects: string[];
  roadmap: string[];
  analyzedAt: string;
}

