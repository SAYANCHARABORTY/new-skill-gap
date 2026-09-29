import {
  AnyUserProfile,
  StudentProfile,
  MentorProfile,
  RecruiterProfile,
  AcademicAdminProfile,
  Opportunity,
  Application,
  MentorConnection,
  LearningResource,
  PracticeProject,
  SkillGapItem,
  StudentSkill,
  AIAnalysisResult
} from '../types';


const STORAGE_KEYS = {
  USERS: 'skillbridge_v1_users',
  OPPORTUNITIES: 'skillbridge_v1_opportunities',
  APPLICATIONS: 'skillbridge_v1_applications',
  MENTOR_CONNECTIONS: 'skillbridge_v1_mentor_connections',
  RESOURCES: 'skillbridge_v1_resources',
  PROJECTS: 'skillbridge_v1_projects',
  CURRENT_SESSION: 'skillbridge_v1_current_user_id',
};

// Safe JSON parser
function getStored<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return defaultValue;
  }
}

function setStored<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error writing ${key} to storage:`, e);
  }
}

export const StorageService = {
  // ==================== USERS & PROFILES ====================
  getUsersMap(): Record<string, AnyUserProfile> {
    return getStored<Record<string, AnyUserProfile>>(STORAGE_KEYS.USERS, {});
  },

  getAllUsers(): AnyUserProfile[] {
    return Object.values(this.getUsersMap());
  },

  getUserById(id: string): AnyUserProfile | null {
    const map = this.getUsersMap();
    return map[id] || null;
  },

  getUserByEmail(email: string): AnyUserProfile | null {
    const users = this.getAllUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase().trim()) || null;
  },

  saveUser(user: AnyUserProfile): void {
    const map = this.getUsersMap();
    map[user.id] = user;
    setStored(STORAGE_KEYS.USERS, map);
  },

  getStudents(): StudentProfile[] {
    return this.getAllUsers().filter((u): u is StudentProfile => u.role === 'student');
  },

  getMentors(): MentorProfile[] {
    return this.getAllUsers().filter((u): u is MentorProfile => u.role === 'mentor');
  },

  getRecruiters(): RecruiterProfile[] {
    return this.getAllUsers().filter((u): u is RecruiterProfile => u.role === 'recruiter');
  },

  getAcademicAdmins(): AcademicAdminProfile[] {
    return this.getAllUsers().filter((u): u is AcademicAdminProfile => u.role === 'academic');
  },

  // Student Skills Management
  addStudentSkill(studentId: string, skill: Omit<StudentSkill, 'id' | 'addedAt'>): StudentProfile | null {
    const user = this.getUserById(studentId);
    if (!user || user.role !== 'student') return null;

    const newSkill: StudentSkill = {
      ...skill,
      id: 'skill_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      addedAt: new Date().toISOString()
    };

    const currentSkills = user.skills || [];
    // Prevent duplicate skill names (case insensitive)
    const exists = currentSkills.some(s => s.name.toLowerCase() === skill.name.toLowerCase().trim());
    if (exists) {
      throw new Error(`Skill "${skill.name}" is already in your profile.`);
    }

    const updatedUser: StudentProfile = {
      ...user,
      skills: [...currentSkills, newSkill]
    };

    this.saveUser(updatedUser);
    return updatedUser;
  },

  removeStudentSkill(studentId: string, skillId: string): StudentProfile | null {
    const user = this.getUserById(studentId);
    if (!user || user.role !== 'student') return null;

    const updatedUser: StudentProfile = {
      ...user,
      skills: (user.skills || []).filter(s => s.id !== skillId)
    };

    this.saveUser(updatedUser);
    return updatedUser;
  },

  updateStudentProfile(studentId: string, partial: Partial<StudentProfile>): StudentProfile | null {
    const user = this.getUserById(studentId);
    if (!user || user.role !== 'student') return null;

    const updatedUser: StudentProfile = {
      ...user,
      ...partial
    };

    this.saveUser(updatedUser);
    return updatedUser;
  },

  saveStudentSkillAnalysis(studentId: string, analysis: AIAnalysisResult): StudentProfile | null {
    const user = this.getUserById(studentId);
    if (!user || user.role !== 'student') return null;

    const updatedUser: StudentProfile = {
      ...user,
      latestAnalysis: analysis
    };

    this.saveUser(updatedUser);
    return updatedUser;
  },

  // ==================== OPPORTUNITIES (JOBS & INTERNSHIPS) ====================

  getOpportunities(): Opportunity[] {
    return getStored<Opportunity[]>(STORAGE_KEYS.OPPORTUNITIES, []);
  },

  getOpportunityById(id: string): Opportunity | null {
    const all = this.getOpportunities();
    return all.find(o => o.id === id) || null;
  },

  getOpportunitiesByRecruiter(recruiterId: string): Opportunity[] {
    return this.getOpportunities().filter(o => o.recruiterId === recruiterId);
  },

  saveOpportunity(opp: Omit<Opportunity, 'id' | 'createdAt'>): Opportunity {
    const all = this.getOpportunities();
    const newOpp: Opportunity = {
      ...opp,
      id: 'opp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString()
    };
    all.unshift(newOpp);
    setStored(STORAGE_KEYS.OPPORTUNITIES, all);
    return newOpp;
  },

  deleteOpportunity(id: string): void {
    const all = this.getOpportunities().filter(o => o.id !== id);
    setStored(STORAGE_KEYS.OPPORTUNITIES, all);
  },

  // ==================== APPLICATIONS ====================
  getApplications(): Application[] {
    return getStored<Application[]>(STORAGE_KEYS.APPLICATIONS, []);
  },

  getApplicationsByStudent(studentId: string): Application[] {
    return this.getApplications().filter(a => a.studentId === studentId);
  },

  getApplicationsByOpportunity(oppId: string): Application[] {
    return this.getApplications().filter(a => a.opportunityId === oppId);
  },

  getApplicationsForRecruiter(recruiterId: string): Array<{ application: Application; opportunity: Opportunity }> {
    const recruiterOpps = this.getOpportunitiesByRecruiter(recruiterId);
    const oppMap = new Map(recruiterOpps.map(o => [o.id, o]));
    const allApps = this.getApplications();

    return allApps
      .filter(app => oppMap.has(app.opportunityId))
      .map(app => ({
        application: app,
        opportunity: oppMap.get(app.opportunityId)!
      }));
  },

  submitApplication(params: {
    opportunityId: string;
    student: StudentProfile;
    coverLetter?: string;
    resumeUrl?: string;
  }): Application {
    const all = this.getApplications();

    // Check if already applied
    const existing = all.find(
      a => a.opportunityId === params.opportunityId && a.studentId === params.student.id
    );
    if (existing) {
      throw new Error('You have already applied for this opportunity.');
    }

    const newApp: Application = {
      id: 'app_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      opportunityId: params.opportunityId,
      studentId: params.student.id,
      studentName: params.student.name,
      studentEmail: params.student.email,
      studentCollege: params.student.college || 'Not specified',
      studentDegree: `${params.student.degree || ''} ${params.student.branch || ''}`.trim() || 'Not specified',
      studentSkills: (params.student.skills || []).map(s => s.name),
      coverLetter: params.coverLetter,
      resumeUrl: params.resumeUrl,
      status: 'applied',
      appliedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    all.unshift(newApp);
    setStored(STORAGE_KEYS.APPLICATIONS, all);
    return newApp;
  },

  updateApplicationStatus(applicationId: string, status: Application['status']): Application | null {
    const all = this.getApplications();
    const index = all.findIndex(a => a.id === applicationId);
    if (index === -1) return null;

    all[index].status = status;
    all[index].updatedAt = new Date().toISOString();
    setStored(STORAGE_KEYS.APPLICATIONS, all);
    return all[index];
  },

  // ==================== MENTOR CONNECTIONS ====================
  getMentorConnections(): MentorConnection[] {
    return getStored<MentorConnection[]>(STORAGE_KEYS.MENTOR_CONNECTIONS, []);
  },

  getConnectionRequestsByMentor(mentorId: string): MentorConnection[] {
    return this.getMentorConnections().filter(c => c.mentorId === mentorId);
  },

  getConnectionRequestsByStudent(studentId: string): MentorConnection[] {
    return this.getMentorConnections().filter(c => c.studentId === studentId);
  },

  createConnectionRequest(params: {
    mentorId: string;
    student: StudentProfile;
    subjectOfInterest: string;
    message: string;
  }): MentorConnection {
    const all = this.getMentorConnections();
    const newReq: MentorConnection = {
      id: 'conn_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      mentorId: params.mentorId,
      studentId: params.student.id,
      studentName: params.student.name,
      studentEmail: params.student.email,
      subjectOfInterest: params.subjectOfInterest,
      message: params.message,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    all.unshift(newReq);
    setStored(STORAGE_KEYS.MENTOR_CONNECTIONS, all);
    return newReq;
  },

  updateConnectionStatus(connectionId: string, status: MentorConnection['status']): void {
    const all = this.getMentorConnections();
    const index = all.findIndex(c => c.id === connectionId);
    if (index !== -1) {
      all[index].status = status;
      setStored(STORAGE_KEYS.MENTOR_CONNECTIONS, all);
    }
  },

  // ==================== LEARNING RESOURCES ====================
  getLearningResources(): LearningResource[] {
    return getStored<LearningResource[]>(STORAGE_KEYS.RESOURCES, []);
  },

  saveLearningResource(res: Omit<LearningResource, 'id' | 'createdAt'>): LearningResource {
    const all = this.getLearningResources();
    const newRes: LearningResource = {
      ...res,
      id: 'res_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString()
    };
    all.unshift(newRes);
    setStored(STORAGE_KEYS.RESOURCES, all);
    return newRes;
  },

  deleteLearningResource(id: string): void {
    const all = this.getLearningResources().filter(r => r.id !== id);
    setStored(STORAGE_KEYS.RESOURCES, all);
  },

  // ==================== PRACTICE PROJECTS ====================
  getPracticeProjects(): PracticeProject[] {
    return getStored<PracticeProject[]>(STORAGE_KEYS.PROJECTS, []);
  },

  savePracticeProject(proj: Omit<PracticeProject, 'id' | 'createdAt' | 'submissionsCount'>): PracticeProject {
    const all = this.getPracticeProjects();
    const newProj: PracticeProject = {
      ...proj,
      id: 'proj_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      submissionsCount: 0,
      createdAt: new Date().toISOString()
    };
    all.unshift(newProj);
    setStored(STORAGE_KEYS.PROJECTS, all);
    return newProj;
  },

  incrementProjectSubmissions(projectId: string): void {
    const all = this.getPracticeProjects();
    const item = all.find(p => p.id === projectId);
    if (item) {
      item.submissionsCount += 1;
      setStored(STORAGE_KEYS.PROJECTS, all);
    }
  },

  // ==================== DYNAMIC REAL SKILL GAP CALCULATION ====================
  /**
   * Generates skill gap analysis based on ACTUAL STUDENT SKILLS vs ACTUAL REGISTERED RECRUITER OPPORTUNITIES.
   * If student has no skills or no recruiter opportunities exist, returns empty state.
   */
  calculateSkillGapForStudent(studentId: string): {
    hasData: boolean;
    studentSkillsCount: number;
    industrySkillsCount: number;
    gapItems: SkillGapItem[];
    matchingPercentage: number;
  } {
    const user = this.getUserById(studentId);
    if (!user || user.role !== 'student') {
      return { hasData: false, studentSkillsCount: 0, industrySkillsCount: 0, gapItems: [], matchingPercentage: 0 };
    }

    const studentSkills = (user.skills || []).map(s => s.name.trim().toLowerCase());
    const opportunities = this.getOpportunities();

    // Check if industry requirements exist
    const industrySkillsMap = new Map<string, number>();
    for (const opp of opportunities) {
      if (Array.isArray(opp.requiredSkills)) {
        for (const req of opp.requiredSkills) {
          const clean = req.trim().toLowerCase();
          if (clean) {
            industrySkillsMap.set(clean, (industrySkillsMap.get(clean) || 0) + 1);
          }
        }
      }
    }

    if (studentSkills.length === 0 || industrySkillsMap.size === 0) {
      return {
        hasData: false,
        studentSkillsCount: studentSkills.length,
        industrySkillsCount: industrySkillsMap.size,
        gapItems: [],
        matchingPercentage: 0
      };
    }

    // Build skill gap items
    const gapItems: SkillGapItem[] = [];
    let matchedCount = 0;

    for (const [skillName, demandCount] of industrySkillsMap.entries()) {
      const hasSkill = studentSkills.includes(skillName);
      if (hasSkill) matchedCount++;

      gapItems.push({
        skill: skillName.charAt(0).toUpperCase() + skillName.slice(1),
        marketDemandScore: demandCount,
        isPossessedByStudent: hasSkill,
        category: 'Industry Requisite'
      });
    }

    // Sort by market demand high-to-low
    gapItems.sort((a, b) => b.marketDemandScore - a.marketDemandScore);

    const matchingPercentage = Math.round((matchedCount / industrySkillsMap.size) * 100);

    return {
      hasData: true,
      studentSkillsCount: studentSkills.length,
      industrySkillsCount: industrySkillsMap.size,
      gapItems,
      matchingPercentage
    };
  },

  // Reset database completely (for fresh presentations or zero-data tests)
  clearAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.OPPORTUNITIES);
    localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
    localStorage.removeItem(STORAGE_KEYS.MENTOR_CONNECTIONS);
    localStorage.removeItem(STORAGE_KEYS.RESOURCES);
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
  }
};
