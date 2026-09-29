import { AnyUserProfile, UserRole, StudentProfile, MentorProfile, RecruiterProfile, AcademicAdminProfile } from '../types';
import { StorageService } from './storage';

const SESSION_KEY = 'skillbridge_v1_active_session_id';

export interface RegisterStudentData {
  name: string;
  email: string;
  college: string;
  degree: string;
  branch: string;
  year: string;
  skills: string[]; // initial skill tags if entered during registration
  targetCareer: string;
  learningInterests: string[];
}

export interface RegisterMentorData {
  name: string;
  email: string;
  professionalRole: string;
  industry: string;
  experienceYears: number;
  subjectsTaught: string[];
  bio: string;
  teachingPreference: MentorProfile['teachingPreference'];
  availability: string;
  portfolioUrl?: string;
  instagramId?: string;
  whatsAppNumber?: string;
  telegramUrl?: string;
  otherLinks?: string[];
}

export interface RegisterRecruiterData {
  name: string;
  company: string;
  email: string;
  industry: string;
  recruiterRole: string;
  companyWebsite?: string;
  location?: string;
  companyDescription?: string;
}

export interface RegisterAcademicAdminData {
  institution: string;
  adminName: string;
  email: string;
  department: string;
}

export const AuthService = {
  getCurrentUser(): AnyUserProfile | null {
    const activeId = localStorage.getItem(SESSION_KEY);
    if (!activeId) return null;
    return StorageService.getUserById(activeId);
  },

  setCurrentUser(userId: string): void {
    localStorage.setItem(SESSION_KEY, userId);
  },

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
  },

  login(email: string, role: UserRole): AnyUserProfile {
    const existing = StorageService.getUserByEmail(email);
    if (!existing) {
      throw new Error(`No account found for email "${email}". Please register first.`);
    }
    if (existing.role !== role) {
      throw new Error(`This email is registered as "${existing.role.toUpperCase()}", not "${role.toUpperCase()}".`);
    }

    this.setCurrentUser(existing.id);
    return existing;
  },

  // Role-Specific Registrations
  registerStudent(data: RegisterStudentData): StudentProfile {
    const existing = StorageService.getUserByEmail(data.email);
    if (existing) {
      throw new Error(`An account with email "${data.email}" already exists.`);
    }

    const studentSkills = (data.skills || []).map(skillName => ({
      id: 'skill_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      name: skillName.trim(),
      proficiency: 'Intermediate' as const,
      addedAt: new Date().toISOString()
    }));

    const newStudent: StudentProfile = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      role: 'student',
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      college: data.college.trim(),
      degree: data.degree.trim(),
      branch: data.branch.trim(),
      year: data.year,
      skills: studentSkills,
      targetCareer: data.targetCareer.trim(),
      learningInterests: data.learningInterests || [],
      createdAt: new Date().toISOString()
    };

    StorageService.saveUser(newStudent);
    this.setCurrentUser(newStudent.id);
    return newStudent;
  },

  registerMentor(data: RegisterMentorData): MentorProfile {
    const existing = StorageService.getUserByEmail(data.email);
    if (existing) {
      throw new Error(`An account with email "${data.email}" already exists.`);
    }

    const newMentor: MentorProfile = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      role: 'mentor',
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      professionalRole: data.professionalRole.trim(),
      industry: data.industry.trim(),
      experienceYears: Number(data.experienceYears) || 1,
      subjectsTaught: data.subjectsTaught.map(s => s.trim()).filter(Boolean),
      bio: data.bio.trim(),
      teachingPreference: data.teachingPreference,
      availability: data.availability.trim(),
      portfolioUrl: data.portfolioUrl?.trim(),
      instagramId: data.instagramId?.trim(),
      whatsAppNumber: data.whatsAppNumber?.trim(),
      telegramUrl: data.telegramUrl?.trim(),
      otherLinks: data.otherLinks,
      createdAt: new Date().toISOString()
    };

    StorageService.saveUser(newMentor);
    this.setCurrentUser(newMentor.id);
    return newMentor;
  },

  registerRecruiter(data: RegisterRecruiterData): RecruiterProfile {
    const existing = StorageService.getUserByEmail(data.email);
    if (existing) {
      throw new Error(`An account with email "${data.email}" already exists.`);
    }

    const newRecruiter: RecruiterProfile = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      role: 'recruiter',
      name: data.name.trim(),
      company: data.company.trim(),
      email: data.email.trim().toLowerCase(),
      industry: data.industry.trim(),
      recruiterRole: data.recruiterRole.trim(),
      companyWebsite: data.companyWebsite?.trim(),
      location: data.location?.trim(),
      companyDescription: data.companyDescription?.trim(),
      createdAt: new Date().toISOString()
    };

    StorageService.saveUser(newRecruiter);
    this.setCurrentUser(newRecruiter.id);
    return newRecruiter;
  },

  registerAcademicAdmin(data: RegisterAcademicAdminData): AcademicAdminProfile {
    const existing = StorageService.getUserByEmail(data.email);
    if (existing) {
      throw new Error(`An account with email "${data.email}" already exists.`);
    }

    const newAdmin: AcademicAdminProfile = {
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      role: 'academic',
      name: data.adminName.trim(),
      email: data.email.trim().toLowerCase(),
      institution: data.institution.trim(),
      department: data.department.trim(),
      createdAt: new Date().toISOString()
    };

    StorageService.saveUser(newAdmin);
    this.setCurrentUser(newAdmin.id);
    return newAdmin;
  }
};
