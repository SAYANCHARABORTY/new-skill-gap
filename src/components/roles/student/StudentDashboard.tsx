import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { StudentProfile, Opportunity, MentorProfile, LearningResource, PracticeProject } from '../../../types';
import { StorageService } from '../../../services/storage';
import { EmptyState } from '../../common/EmptyState';
import { SkillGapHUD } from './SkillGapHUD';

import { 
  User, 
  Code2, 
  TrendingUp, 
  BookOpen, 
  Terminal, 
  Compass, 
  Briefcase, 
  Sparkles, 
  Plus, 
  Trash2, 
  Search, 
  ExternalLink, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  LayoutDashboard,
  Layers,
  GraduationCap,
  Building,
  Menu,
  X
} from 'lucide-react';

interface StudentDashboardProps {
  onOpenNirvana: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onOpenNirvana }) => {
  const { currentUser, refreshUser } = useAuth();
  const student = currentUser as StudentProfile;

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'skills' | 'skillgap' | 'learn' | 'practice' | 'mentors' | 'internships' | 'jobs' | 'profile'
  >('dashboard');

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Skill input state
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('Frontend');
  const [newSkillProficiency, setNewSkillProficiency] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Intermediate');
  const [skillError, setSkillError] = useState<string | null>(null);

  // Mentor Discovery Search & Filter
  const [mentorSearch, setMentorSearch] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('');
  const [selectedIndustryFilter, setSelectedIndustryFilter] = useState('');
  const [selectedMentor, setSelectedMentor] = useState<MentorProfile | null>(null);
  const [connectSubject, setConnectSubject] = useState('');
  const [connectMessage, setConnectMessage] = useState('');
  const [connectSuccess, setConnectSuccess] = useState(false);

  // Opportunity Application Modal
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);

  // Learning Resource creation
  const [showAddResource, setShowAddResource] = useState(false);
  const [newResTitle, setNewResTitle] = useState('');
  const [newResUrl, setNewResUrl] = useState('');
  const [newResDesc, setNewResDesc] = useState('');
  const [newResCategory, setNewResCategory] = useState('Engineering');

  // Practice Project creation
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjSkills, setNewProjSkills] = useState('');

  // Live Real Data
  const opportunities = StorageService.getOpportunities();
  const internships = opportunities.filter(o => o.type === 'internship');
  const jobs = opportunities.filter(o => o.type === 'job');
  const mentors = StorageService.getMentors();
  const resources = StorageService.getLearningResources();
  const projects = StorageService.getPracticeProjects();
  const myApplications = StorageService.getApplicationsByStudent(student?.id || '');

  // Calculate Real Skill Gap
  const skillGapAnalysis = StorageService.calculateSkillGapForStudent(student?.id || '');

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    setSkillError(null);
    if (!newSkillName.trim()) return;

    try {
      StorageService.addStudentSkill(student.id, {
        name: newSkillName.trim(),
        category: newSkillCategory,
        proficiency: newSkillProficiency
      });
      setNewSkillName('');
      refreshUser();
    } catch (err: unknown) {
      setSkillError(err instanceof Error ? err.message : 'Failed to add skill');
    }
  };

  const handleRemoveSkill = (skillId: string) => {
    StorageService.removeStudentSkill(student.id, skillId);
    refreshUser();
  };

  // Mentor connection request
  const handleSendMentorRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentor) return;

    StorageService.createConnectionRequest({
      mentorId: selectedMentor.id,
      student,
      subjectOfInterest: connectSubject || (selectedMentor.subjectsTaught[0] || 'Mentorship'),
      message: connectMessage
    });

    setConnectSuccess(true);
    setTimeout(() => {
      setConnectSuccess(false);
      setSelectedMentor(null);
      setConnectSubject('');
      setConnectMessage('');
    }, 1500);
  };

  // Submit Job/Internship Application
  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOpportunity) return;
    setApplyError(null);

    try {
      StorageService.submitApplication({
        opportunityId: selectedOpportunity.id,
        student,
        coverLetter,
        resumeUrl
      });
      setApplySuccess(true);
      setTimeout(() => {
        setApplySuccess(false);
        setSelectedOpportunity(null);
        setCoverLetter('');
        setResumeUrl('');
      }, 1500);
    } catch (err: unknown) {
      setApplyError(err instanceof Error ? err.message : 'Application submission failed');
    }
  };

  // Add learning resource
  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResTitle.trim() || !newResDesc.trim()) return;

    StorageService.saveLearningResource({
      title: newResTitle.trim(),
      authorId: student.id,
      authorName: student.name,
      authorRole: 'student',
      category: newResCategory,
      url: newResUrl.trim(),
      description: newResDesc.trim(),
      tags: [newResCategory],
      difficulty: 'Intermediate'
    });

    setShowAddResource(false);
    setNewResTitle('');
    setNewResUrl('');
    setNewResDesc('');
  };

  // Add practice project
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle.trim() || !newProjDesc.trim()) return;

    StorageService.savePracticeProject({
      creatorId: student.id,
      creatorName: student.name,
      title: newProjTitle.trim(),
      description: newProjDesc.trim(),
      targetSkills: newProjSkills.split(',').map(s => s.trim()).filter(Boolean),
      difficulty: 'Intermediate'
    });

    setShowAddProject(false);
    setNewProjTitle('');
    setNewProjDesc('');
    setNewProjSkills('');
  };

  // Filtered real mentors
  const filteredMentors = mentors.filter(m => {
    const matchesSearch = 
      !mentorSearch.trim() || 
      m.name.toLowerCase().includes(mentorSearch.toLowerCase()) ||
      m.subjectsTaught.some(s => s.toLowerCase().includes(mentorSearch.toLowerCase())) ||
      m.professionalRole.toLowerCase().includes(mentorSearch.toLowerCase());

    const matchesSubject = 
      !selectedSubjectFilter || 
      m.subjectsTaught.some(s => s.toLowerCase() === selectedSubjectFilter.toLowerCase());

    const matchesIndustry = 
      !selectedIndustryFilter || 
      m.industry.toLowerCase() === selectedIndustryFilter.toLowerCase();

    return matchesSearch && matchesSubject && matchesIndustry;
  });

  // Sidebar items as required by prompt section 22
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'skills', label: 'Skills', icon: Code2, count: student?.skills?.length || 0 },
    { id: 'skillgap', label: 'Skill Gap', icon: TrendingUp },
    { id: 'learn', label: 'Learn', icon: BookOpen, count: resources.length },
    { id: 'practice', label: 'Practice', icon: Terminal, count: projects.length },
    { id: 'mentors', label: 'Mentors', icon: Compass, count: mentors.length },
    { id: 'internships', label: 'Internships', icon: Briefcase, count: internships.length },
    { id: 'jobs', label: 'Jobs', icon: Briefcase, count: jobs.length },
    { id: 'nirvana', label: 'NIRVANA', icon: Sparkles, isAction: true },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <div className="w-full min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Mobile Sidebar Toggle Button */}
      <div className="lg:hidden mb-4 flex items-center justify-between p-3 rounded-xl bg-black/60 border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-[#00FF66]">MENU //</span>
          <span className="font-rajdhani font-bold text-sm text-white uppercase">{activeTab}</span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1.5 rounded-lg border border-slate-700 text-slate-300 hover:text-[#00FF66]"
        >
          {mobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ============================================================ */}
        {/* SIDEBAR: DESKTOP + COLLAPSIBLE MOBILE HUD                    */}
        {/* ============================================================ */}
        <aside className={`lg:col-span-3 ${mobileSidebarOpen ? 'block' : 'hidden lg:block'} space-y-4`}>
          <div className="hud-corner rounded-2xl border border-slate-800 bg-[#090b0a]/90 backdrop-blur-xl p-4 shadow-xl">
            
            {/* Student Quick Profile Card */}
            <div className="pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black border border-[#00FF66]/50 shadow-[0_0_12px_rgba(0,255,102,0.25)] text-[#00FF66] font-mono font-bold text-sm">
                  {student.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-white text-sm truncate">{student.name}</h3>
                  <div className="font-mono text-[10px] text-slate-400 truncate">{student.college}</div>
                  <div className="font-mono text-[9px] text-[#00FF66] uppercase mt-0.5">STUDENT // ONLINE</div>
                </div>
              </div>
            </div>

            {/* Sidebar Navigation Items */}
            <nav className="space-y-1 font-rajdhani">
              {sidebarItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                if (item.isAction) {
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setMobileSidebarOpen(false);
                        onOpenNirvana();
                      }}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-[#00FF66] bg-black/60 border border-[#00FF66]/30 hover:bg-[#00FF66]/10 hover:border-[#00FF66] transition-all cursor-pointer shadow-[0_0_12px_rgba(0,255,102,0.15)] group my-2"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4 text-[#00FF66] animate-pulse" />
                        <span>NIRVANA AI</span>
                      </div>
                      <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-[#00FF66]/20 text-[#00FF66]">AI GUIDE</span>
                    </button>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as any);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer relative ${
                      isActive
                        ? 'bg-[#00FF66] text-black shadow-[0_0_18px_rgba(0,255,102,0.3)]'
                        : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>

                    {typeof item.count === 'number' && (
                      <span className={`font-mono text-[10px] px-1.5 py-0.2 rounded-full ${
                        isActive ? 'bg-black text-[#00FF66]' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {item.count}
                      </span>
                    )}

                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r bg-white" />
                    )}
                  </button>
                );
              })}
            </nav>

          </div>

          {/* Telemetry Status Widget */}
          <div className="hud-corner rounded-2xl border border-slate-800 bg-[#070908]/90 p-4 text-xs font-mono">
            <div className="text-slate-400 mb-2 flex items-center justify-between">
              <span>CORE PROTOCOL</span>
              <span className="h-2 w-2 rounded-full bg-[#00FF66] animate-ping" />
            </div>
            <div className="text-white">Active Target: <span className="text-[#00FF66]">{student.targetCareer || 'Unset'}</span></div>
            <div className="text-slate-500 mt-1">Verified Skills: {student.skills?.length || 0}</div>
            <div className="text-slate-500">Live Postings: {opportunities.length}</div>
          </div>
        </aside>

        {/* ============================================================ */}
        {/* MAIN HUD CONTENT PANEL                                       */}
        {/* ============================================================ */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* ============================================================ */}
          {/* TAB: DASHBOARD OVERVIEW                                      */}
          {/* ============================================================ */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Header Telemetry Banner */}
              <div className="hud-corner rounded-2xl border border-[#00FF66]/30 bg-[#090b0a]/90 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] text-[#00FF66] font-bold px-2 py-0.5 rounded bg-[#00FF66]/10 border border-[#00FF66]/30">
                      TELEMETRY OVERVIEW
                    </span>
                    <span className="font-mono text-xs text-slate-400">{student.degree} ({student.branch})</span>
                  </div>
                  <h2 className="hud-heading text-2xl sm:text-3xl font-black text-white">
                    WELCOME, {student.name.toUpperCase()}
                  </h2>
                  <p className="font-sans text-xs text-slate-400 mt-1">
                    Target Career: <strong className="text-[#00FF66]">{student.targetCareer || 'Unset'}</strong> • {student.college}
                  </p>
                </div>

                <button
                  onClick={onOpenNirvana}
                  className="px-4 py-2.5 rounded-xl bg-black border border-[#00FF66] text-[#00FF66] hover:bg-[#00FF66]/10 font-rajdhani font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,102,0.2)] cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 animate-pulse" />
                  <span>CONSULT NIRVANA</span>
                </button>
              </div>

              {/* 4 Stat Telemetry Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div 
                  onClick={() => setActiveTab('skills')}
                  className="hud-corner p-4 rounded-xl bg-[#0c0f0d] border border-slate-800 hover:border-[#00FF66]/50 cursor-pointer transition-all"
                >
                  <div className="font-mono text-2xl font-bold text-[#00FF66]">{student.skills?.length || 0}</div>
                  <div className="font-mono text-[11px] text-slate-400 uppercase mt-1">My Skills Added</div>
                </div>

                <div 
                  onClick={() => setActiveTab('skillgap')}
                  className="hud-corner p-4 rounded-xl bg-[#0c0f0d] border border-slate-800 hover:border-cyan-400/50 cursor-pointer transition-all flex flex-col justify-center"
                >
                  {student.latestAnalysis ? (
                    <>
                      <div className="font-mono text-2xl font-bold text-[#00FF66]">
                        {student.latestAnalysis.score} <span className="text-xs text-slate-400">/ 100</span>
                      </div>
                      <div className="font-mono text-[11px] text-slate-400 uppercase mt-1">Skill Readiness Score</div>
                    </>
                  ) : (
                    <>
                      <div className="font-mono text-xs text-[#00FF66] font-bold uppercase tracking-wider">
                        ANALYZE YOUR SKILLS
                      </div>
                      <div className="font-mono text-[10px] text-slate-400 uppercase mt-1">To Get Readiness Score</div>
                    </>
                  )}
                </div>


                <div 
                  onClick={() => setActiveTab('mentors')}
                  className="hud-corner p-4 rounded-xl bg-[#0c0f0d] border border-slate-800 hover:border-purple-500/50 cursor-pointer transition-all"
                >
                  <div className="font-mono text-2xl font-bold text-purple-400">{mentors.length}</div>
                  <div className="font-mono text-[11px] text-slate-400 uppercase mt-1">Verified Mentors</div>
                </div>

                <div 
                  onClick={() => setActiveTab('jobs')}
                  className="hud-corner p-4 rounded-xl bg-[#0c0f0d] border border-slate-800 hover:border-[#dfa260]/50 cursor-pointer transition-all"
                >
                  <div className="font-mono text-2xl font-bold text-[#dfa260]">{opportunities.length}</div>
                  <div className="font-mono text-[11px] text-slate-400 uppercase mt-1">Live Openings</div>
                </div>
              </div>

              {/* Quick Action Panels */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="hud-corner rounded-xl border border-slate-800 bg-[#0c0f0d] p-5">
                  <h4 className="hud-heading text-sm font-bold text-white mb-2 flex items-center justify-between">
                    <span>MY SKILL TELEMETRY</span>
                    <button 
                      onClick={() => setActiveTab('skills')}
                      className="text-xs font-mono text-[#00FF66] hover:underline"
                    >
                      + Add Skills
                    </button>
                  </h4>
                  {(!student.skills || student.skills.length === 0) ? (
                    <p className="text-xs text-slate-400 font-sans">
                      No skills added yet. Add verified technical proficiencies to calculate your Skill Gap.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {student.skills.slice(0, 8).map(s => (
                        <span key={s.id} className="font-mono text-[11px] px-2 py-0.5 rounded bg-black border border-slate-700 text-[#00FF66]">
                          {s.name} ({s.proficiency})
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="hud-corner rounded-xl border border-slate-800 bg-[#0c0f0d] p-5">
                  <h4 className="hud-heading text-sm font-bold text-white mb-2 flex items-center justify-between">
                    <span>LATEST OPPORTUNITIES</span>
                    <button 
                      onClick={() => setActiveTab('internships')}
                      className="text-xs font-mono text-cyan-400 hover:underline"
                    >
                      View All ({opportunities.length})
                    </button>
                  </h4>
                  {opportunities.length === 0 ? (
                    <p className="text-xs text-slate-400 font-sans">
                      No recruiters have posted opportunities yet.
                    </p>
                  ) : (
                    <div className="space-y-2 mt-2">
                      {opportunities.slice(0, 2).map(opp => (
                        <div key={opp.id} className="text-xs p-2 rounded bg-black/60 border border-slate-800 flex items-center justify-between">
                          <div>
                            <span className="font-bold text-white">{opp.title}</span>
                            <span className="text-slate-500 font-mono ml-2">@{opp.companyName}</span>
                          </div>
                          <span className="font-mono text-[10px] text-cyan-400 uppercase">{opp.type}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* ============================================================ */}
          {/* TAB: MY SKILLS                                               */}
          {/* ============================================================ */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="hud-corner rounded-2xl border border-slate-800 bg-[#0c0e0d] p-6">
                <h3 className="hud-heading text-lg font-bold text-white mb-2">ADD REAL SKILL</h3>
                <p className="text-xs text-slate-400 mb-4">
                  Add genuine technical skills you possess. SkillBridge never pre-fills dummy or fake scores.
                </p>

                <form onSubmit={handleAddSkill} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      required
                      value={newSkillName}
                      onChange={e => setNewSkillName(e.target.value)}
                      placeholder="e.g. React, Python, Docker, PostgreSQL"
                      className="w-full px-3 py-2 rounded-lg bg-black border border-slate-700 text-sm text-white focus:outline-none focus:border-[#00FF66]"
                    />
                  </div>

                  <div>
                    <select
                      value={newSkillProficiency}
                      onChange={e => setNewSkillProficiency(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg bg-black border border-slate-700 text-sm text-white focus:outline-none focus:border-[#00FF66]"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full py-2 rounded-lg bg-[#00FF66] hover:bg-[#05DF72] text-black font-rajdhani font-bold text-xs uppercase tracking-wider transition-all neon-glow-btn cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Plus className="h-4 w-4" />
                      <span>ADD TO PROFILE</span>
                    </button>
                  </div>
                </form>

                {skillError && (
                  <p className="font-mono text-xs text-red-400 mt-2">{skillError}</p>
                )}
              </div>

              <div>
                <h3 className="hud-heading text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <span>REGISTERED SKILL STACK</span>
                  <span className="font-mono text-xs text-[#00FF66]">({student?.skills?.length || 0})</span>
                </h3>

                {(!student?.skills || student.skills.length === 0) ? (
                  <EmptyState
                    icon={Code2}
                    title="No skills added yet."
                    description="Complete your profile to start your SkillBridge journey. Add your verified skills above to unlock real-time skill-gap calculation."
                    variant="green"
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {student.skills.map((s) => (
                      <div
                        key={s.id}
                        className="hud-corner rounded-xl border border-slate-800 bg-[#0d100e] p-4 flex items-center justify-between hover:border-[#00FF66]/40 transition-all"
                      >
                        <div>
                          <h4 className="font-bold text-white text-base">{s.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/20">
                              {s.proficiency}
                            </span>
                            <span className="font-mono text-[10px] text-slate-500">
                              {new Date(s.addedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveSkill(s.id)}
                          className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/30 transition-all cursor-pointer"
                          title="Remove Skill"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB: SKILL GAP (GROQ AI READINESS SCORE 0-100)               */}
          {/* ============================================================ */}
          {activeTab === 'skillgap' && (
            <SkillGapHUD
              student={student}
              onRefreshStudent={refreshUser}
              onOpenNirvana={onOpenNirvana}
            />
          )}


          {/* ============================================================ */}
          {/* TAB: MENTORS                                                 */}
          {/* ============================================================ */}
          {activeTab === 'mentors' && (
            <div className="space-y-6">
              <div className="hud-corner rounded-2xl border border-purple-500/30 bg-[#0c0a12] p-6">
                <h3 className="hud-heading text-lg font-bold text-white mb-1">
                  FIND A MENTOR
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Connect directly with verified mentors registered on SkillBridge. Filter by actual subjects taught and reach out via their provided communication links.
                </p>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      value={mentorSearch}
                      onChange={e => setMentorSearch(e.target.value)}
                      placeholder="Search by subject, skill, or name..."
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-black border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      value={selectedSubjectFilter}
                      onChange={e => setSelectedSubjectFilter(e.target.value)}
                      placeholder="Filter by subject (e.g. React)..."
                      className="w-full px-3 py-2 rounded-lg bg-black border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      value={selectedIndustryFilter}
                      onChange={e => setSelectedIndustryFilter(e.target.value)}
                      placeholder="Filter by industry (e.g. Fintech)..."
                      className="w-full px-3 py-2 rounded-lg bg-black border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>
              </div>

              {mentors.length === 0 ? (
                <EmptyState
                  icon={Compass}
                  title="No mentors available yet."
                  description="Mentor profiles are only listed when real industry professionals register themselves. Check back soon or encourage your mentors to sign up."
                  variant="chocolate"
                />
              ) : filteredMentors.length === 0 ? (
                <EmptyState
                  icon={Search}
                  title="No mentors match your search criteria."
                  description="Try adjusting your subject or industry filters to discover other available registered mentors."
                  variant="neutral"
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredMentors.map((m) => (
                    <div
                      key={m.id}
                      className="hud-corner rounded-xl border border-slate-800 bg-[#0d0f12] p-5 hover:border-purple-500/50 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <h4 className="font-bold text-white text-base">{m.name}</h4>
                            <div className="text-xs text-purple-400 font-mono">{m.professionalRole}</div>
                            <div className="text-[11px] text-slate-400">{m.industry} • {m.experienceYears} Years Exp.</div>
                          </div>
                          <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30">
                            {m.teachingPreference}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 line-clamp-3 mb-4 font-sans">
                          {m.bio}
                        </p>

                        <div className="mb-4">
                          <div className="font-mono text-[10px] text-slate-500 uppercase mb-1">Teaches Subjects:</div>
                          <div className="flex flex-wrap gap-1.5">
                            {m.subjectsTaught.map((sub, i) => (
                              <span key={i} className="font-mono text-[10px] px-2 py-0.5 rounded bg-black border border-slate-700 text-slate-300">
                                {sub}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="font-mono text-[10px] text-slate-400 mb-4">
                          Schedule: <strong className="text-white">{m.availability}</strong>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                        <button
                          onClick={() => setSelectedMentor(m)}
                          className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-rajdhani font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                        >
                          VIEW PROFILE & CONNECT
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Mentor Profile / Connect Modal */}
              {selectedMentor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
                  <div className="hud-corner relative w-full max-w-lg rounded-2xl border border-purple-500/40 bg-[#0e0a14] p-6 shadow-2xl">
                    <button
                      onClick={() => setSelectedMentor(null)}
                      className="absolute top-4 right-4 text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>

                    <h3 className="hud-heading text-lg font-bold text-white mb-1">{selectedMentor.name}</h3>
                    <div className="text-xs text-purple-400 font-mono mb-4">{selectedMentor.professionalRole} ({selectedMentor.industry})</div>
                    
                    <p className="text-xs text-slate-300 leading-relaxed mb-4">{selectedMentor.bio}</p>

                    <div className="p-3 rounded-lg bg-black/60 border border-slate-800 space-y-2 mb-4 font-mono text-xs">
                      <div className="text-slate-400 font-bold uppercase text-[10px]">Direct Connection Channels:</div>
                      {selectedMentor.whatsAppNumber && (
                        <div className="flex items-center justify-between text-slate-200">
                          <span>WhatsApp:</span>
                          <a href={`https://wa.me/${selectedMentor.whatsAppNumber.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-[#00FF66] hover:underline flex items-center gap-1">
                            {selectedMentor.whatsAppNumber} <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                      {selectedMentor.telegramUrl && (
                        <div className="flex items-center justify-between text-slate-200">
                          <span>Telegram:</span>
                          <a href={selectedMentor.telegramUrl} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline flex items-center gap-1">
                            {selectedMentor.telegramUrl} <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                      {selectedMentor.instagramId && (
                        <div className="flex items-center justify-between text-slate-200">
                          <span>Instagram:</span>
                          <span className="text-pink-400">{selectedMentor.instagramId}</span>
                        </div>
                      )}
                      {selectedMentor.portfolioUrl && (
                        <div className="flex items-center justify-between text-slate-200">
                          <span>Portfolio:</span>
                          <a href={selectedMentor.portfolioUrl} target="_blank" rel="noreferrer" className="text-purple-400 hover:underline flex items-center gap-1">
                            Visit Portfolio <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                    </div>

                    <form onSubmit={handleSendMentorRequest} className="space-y-3">
                      <div>
                        <label className="block text-xs font-mono text-slate-300 mb-1">Subject of Interest</label>
                        <input
                          type="text"
                          value={connectSubject}
                          onChange={e => setConnectSubject(e.target.value)}
                          placeholder={selectedMentor.subjectsTaught[0] || 'e.g. React Architecture'}
                          className="w-full px-3 py-1.5 rounded-lg bg-black border border-slate-700 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-slate-300 mb-1">Message / Questions</label>
                        <textarea
                          rows={3}
                          required
                          value={connectMessage}
                          onChange={e => setConnectMessage(e.target.value)}
                          placeholder="Explain what guidance you are seeking..."
                          className="w-full px-3 py-1.5 rounded-lg bg-black border border-slate-700 text-xs text-white"
                        />
                      </div>

                      {connectSuccess && (
                        <p className="font-mono text-xs text-[#00FF66] flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4" /> Mentorship request recorded!
                        </p>
                      )}

                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-rajdhani font-bold text-xs uppercase tracking-wider cursor-pointer"
                      >
                        SEND IN-PLATFORM REQUEST
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB: INTERNSHIPS                                             */}
          {/* ============================================================ */}
          {activeTab === 'internships' && (
            <div className="space-y-6">
              <div className="hud-corner rounded-2xl border border-amber-500/30 bg-[#120e07] p-6">
                <h3 className="hud-heading text-lg font-bold text-white mb-1">
                  INTERNSHIP OPPORTUNITIES ({internships.length})
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Hands-on industry internships posted directly by verified recruiters.
                </p>
              </div>

              {internships.length === 0 ? (
                <EmptyState
                  icon={Briefcase}
                  title="NO INTERNSHIPS AVAILABLE YET."
                  description="No recruiters have published internship openings yet. Opportunities will appear here as soon as an industry partner registers an internship role."
                  variant="chocolate"
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {internships.map(opp => (
                    <div
                      key={opp.id}
                      className="hud-corner rounded-xl border border-slate-800 bg-[#090e12] p-5 hover:border-amber-400/50 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <span className="font-mono text-[9px] px-2 py-0.5 rounded font-bold uppercase bg-amber-500/10 text-amber-300 border border-amber-500/30">
                              INTERNSHIP
                            </span>
                            <h4 className="font-bold text-white text-base mt-1">{opp.title}</h4>
                            <div className="text-xs text-amber-400 font-mono">{opp.companyName}</div>
                          </div>
                          <div className="text-right text-xs font-mono text-slate-400">
                            {opp.location} {opp.isRemote && '(Remote)'}
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 line-clamp-3 mb-4 font-sans">
                          {opp.description}
                        </p>

                        <div className="mb-4">
                          <div className="font-mono text-[10px] text-slate-500 uppercase mb-1">Required Skills:</div>
                          <div className="flex flex-wrap gap-1.5">
                            {opp.requiredSkills.map((req, i) => {
                              const hasSkill = (student?.skills || []).some(
                                s => s.name.toLowerCase() === req.toLowerCase()
                              );
                              return (
                                <span
                                  key={i}
                                  className={`font-mono text-[10px] px-2 py-0.5 rounded border ${
                                    hasSkill
                                      ? 'bg-[#00FF66]/15 border-[#00FF66]/40 text-[#00FF66]'
                                      : 'bg-black border-slate-800 text-slate-400'
                                  }`}
                                >
                                  {req} {hasSkill && '✓'}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        {opp.stipendOrSalary && (
                          <div className="font-mono text-xs text-[#00FF66] mb-3">
                            Stipend: {opp.stipendOrSalary}
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                        <span className="font-mono text-[10px] text-slate-500">Exp: {opp.experienceRequirement}</span>
                        <button
                          onClick={() => setSelectedOpportunity(opp)}
                          className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-rajdhani font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                        >
                          APPLY NOW
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB: JOBS                                                    */}
          {/* ============================================================ */}
          {activeTab === 'jobs' && (
            <div className="space-y-6">
              <div className="hud-corner rounded-2xl border border-cyan-500/30 bg-[#071118] p-6">
                <h3 className="hud-heading text-lg font-bold text-white mb-1">
                  FULL-TIME JOB VACANCIES ({jobs.length})
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Direct entry and graduate engineer job requisitions posted by industry talent leads.
                </p>
              </div>

              {jobs.length === 0 ? (
                <EmptyState
                  icon={Briefcase}
                  title="NO JOB OPPORTUNITIES YET"
                  description="No corporate recruiters have posted full-time job openings yet. Verified listings will populate here when recruiters publish them."
                  variant="neutral"
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {jobs.map(opp => (
                    <div
                      key={opp.id}
                      className="hud-corner rounded-xl border border-slate-800 bg-[#090e12] p-5 hover:border-cyan-400/50 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <span className="font-mono text-[9px] px-2 py-0.5 rounded font-bold uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                              FULL-TIME JOB
                            </span>
                            <h4 className="font-bold text-white text-base mt-1">{opp.title}</h4>
                            <div className="text-xs text-cyan-400 font-mono">{opp.companyName}</div>
                          </div>
                          <div className="text-right text-xs font-mono text-slate-400">
                            {opp.location} {opp.isRemote && '(Remote)'}
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 line-clamp-3 mb-4 font-sans">
                          {opp.description}
                        </p>

                        <div className="mb-4">
                          <div className="font-mono text-[10px] text-slate-500 uppercase mb-1">Required Skills:</div>
                          <div className="flex flex-wrap gap-1.5">
                            {opp.requiredSkills.map((req, i) => {
                              const hasSkill = (student?.skills || []).some(
                                s => s.name.toLowerCase() === req.toLowerCase()
                              );
                              return (
                                <span
                                  key={i}
                                  className={`font-mono text-[10px] px-2 py-0.5 rounded border ${
                                    hasSkill
                                      ? 'bg-[#00FF66]/15 border-[#00FF66]/40 text-[#00FF66]'
                                      : 'bg-black border-slate-800 text-slate-400'
                                  }`}
                                >
                                  {req} {hasSkill && '✓'}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        {opp.stipendOrSalary && (
                          <div className="font-mono text-xs text-[#00FF66] mb-3">
                            Compensation: {opp.stipendOrSalary}
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                        <span className="font-mono text-[10px] text-slate-500">Exp: {opp.experienceRequirement}</span>
                        <button
                          onClick={() => setSelectedOpportunity(opp)}
                          className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-rajdhani font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                        >
                          APPLY NOW
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB: LEARN                                                   */}
          {/* ============================================================ */}
          {activeTab === 'learn' && (
            <div className="space-y-6">
              <div className="hud-corner rounded-2xl border border-slate-800 bg-[#0a0d0b] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="hud-heading text-lg font-bold text-white mb-1">
                    KNOWLEDGE NEXUS
                  </h3>
                  <p className="text-xs text-slate-400">
                    Peer and mentor curated technical learning resources. Starts with zero fake courses.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddResource(true)}
                  className="px-4 py-2 rounded-lg bg-[#00FF66] text-black font-rajdhani font-bold text-xs uppercase cursor-pointer"
                >
                  + SHARE RESOURCE
                </button>
              </div>

              {showAddResource && (
                <div className="hud-corner rounded-xl border border-[#00FF66]/30 bg-[#0f1210] p-5">
                  <h4 className="font-bold text-white text-sm mb-3">Add Genuine Learning Material</h4>
                  <form onSubmit={handleAddResource} className="space-y-3">
                    <input
                      type="text"
                      required
                      value={newResTitle}
                      onChange={e => setNewResTitle(e.target.value)}
                      placeholder="Resource Title (e.g. Complete System Design Primer)"
                      className="w-full px-3 py-2 rounded-lg bg-black border border-slate-700 text-xs text-white"
                    />
                    <input
                      type="url"
                      value={newResUrl}
                      onChange={e => setNewResUrl(e.target.value)}
                      placeholder="URL link (e.g. GitHub repo, documentation, video)"
                      className="w-full px-3 py-2 rounded-lg bg-black border border-slate-700 text-xs text-white"
                    />
                    <textarea
                      rows={2}
                      required
                      value={newResDesc}
                      onChange={e => setNewResDesc(e.target.value)}
                      placeholder="Brief summary of what this teaches..."
                      className="w-full px-3 py-2 rounded-lg bg-black border border-slate-700 text-xs text-white"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddResource(false)}
                        className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-400"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg bg-[#00FF66] text-black font-rajdhani font-bold text-xs uppercase"
                      >
                        Publish Resource
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {resources.length === 0 ? (
                <EmptyState
                  icon={BookOpen}
                  title="NO LEARNING RESOURCES AVAILABLE YET."
                  description="No predefined fake courses exist here. Students, mentors, and academic faculty can publish verified roadmaps, guides, and tutorials."
                  actionText="ADD FIRST RESOURCE"
                  onAction={() => setShowAddResource(true)}
                  variant="green"
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resources.map((res) => (
                    <div key={res.id} className="hud-corner rounded-xl border border-slate-800 bg-[#0d100e] p-5">
                      <span className="font-mono text-[10px] text-[#00FF66] uppercase">{res.category}</span>
                      <h4 className="font-bold text-white text-base mt-1">{res.title}</h4>
                      <p className="text-xs text-slate-300 mt-2 font-sans">{res.description}</p>
                      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                        <span>Added by: {res.authorName} ({res.authorRole})</span>
                        {res.url && (
                          <a href={res.url} target="_blank" rel="noreferrer" className="text-[#00FF66] hover:underline flex items-center gap-1">
                            Open Link <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB: PRACTICE                                                */}
          {/* ============================================================ */}
          {activeTab === 'practice' && (
            <div className="space-y-6">
              <div className="hud-corner rounded-2xl border border-slate-800 bg-[#0a0d0b] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="hud-heading text-lg font-bold text-white mb-1">
                    PRACTICE & CHALLENGES
                  </h3>
                  <p className="text-xs text-slate-400">
                    Real-world project challenges. Starts empty to eliminate fictional projects.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddProject(true)}
                  className="px-4 py-2 rounded-lg bg-cyan-400 text-black font-rajdhani font-bold text-xs uppercase cursor-pointer"
                >
                  + PROPOSE PROJECT
                </button>
              </div>

              {showAddProject && (
                <div className="hud-corner rounded-xl border border-cyan-500/30 bg-[#0f1210] p-5">
                  <h4 className="font-bold text-white text-sm mb-3">Add Real Engineering Project Challenge</h4>
                  <form onSubmit={handleAddProject} className="space-y-3">
                    <input
                      type="text"
                      required
                      value={newProjTitle}
                      onChange={e => setNewProjTitle(e.target.value)}
                      placeholder="Project Title (e.g. Distributed Key-Value Store)"
                      className="w-full px-3 py-2 rounded-lg bg-black border border-slate-700 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={newProjSkills}
                      onChange={e => setNewProjSkills(e.target.value)}
                      placeholder="Target Skills (e.g. Go, Raft, Networking)"
                      className="w-full px-3 py-2 rounded-lg bg-black border border-slate-700 text-xs text-white"
                    />
                    <textarea
                      rows={3}
                      required
                      value={newProjDesc}
                      onChange={e => setNewProjDesc(e.target.value)}
                      placeholder="Project specifications and requirements..."
                      className="w-full px-3 py-2 rounded-lg bg-black border border-slate-700 text-xs text-white"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddProject(false)}
                        className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-400"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg bg-cyan-400 text-black font-rajdhani font-bold text-xs uppercase"
                      >
                        Post Project
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {projects.length === 0 ? (
                <EmptyState
                  icon={Terminal}
                  title="NO PRACTICE PROJECTS YET."
                  description="No fake mock projects are injected. Propose a new challenge or wait for industry partners & mentors to assign briefs."
                  actionText="PROPOSE A PROJECT"
                  onAction={() => setShowAddProject(true)}
                  variant="neutral"
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map((p) => (
                    <div key={p.id} className="hud-corner rounded-xl border border-slate-800 bg-[#0d100e] p-5">
                      <h4 className="font-bold text-white text-base">{p.title}</h4>
                      <p className="text-xs text-slate-300 mt-2 font-sans">{p.description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {p.targetSkills.map((sk, i) => (
                          <span key={i} className="font-mono text-[10px] px-2 py-0.5 rounded bg-black border border-slate-700 text-cyan-300">
                            {sk}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
                        <span>Proposed by: {p.creatorName}</span>
                        <button
                          onClick={() => {
                            StorageService.incrementProjectSubmissions(p.id);
                            refreshUser();
                          }}
                          className="px-3 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold"
                        >
                          LOG SUBMISSION ({p.submissionsCount})
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB: PROFILE                                                 */}
          {/* ============================================================ */}
          {activeTab === 'profile' && (
            <div className="hud-corner rounded-2xl border border-slate-800 bg-[#0c0e0d] p-6 max-w-2xl mx-auto space-y-4">
              <h3 className="hud-heading text-lg font-bold text-white mb-4">STUDENT DOSSIER</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                <div>
                  <span className="text-slate-500 block">FULL NAME:</span>
                  <span className="text-white font-bold">{student.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">EMAIL:</span>
                  <span className="text-white">{student.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">COLLEGE / UNIVERSITY:</span>
                  <span className="text-white">{student.college}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">DEGREE & BRANCH:</span>
                  <span className="text-white">{student.degree} ({student.branch})</span>
                </div>
                <div>
                  <span className="text-slate-500 block">YEAR OF STUDY:</span>
                  <span className="text-white">{student.year}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">TARGET ROLE:</span>
                  <span className="text-[#00FF66] font-bold">{student.targetCareer}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 font-mono text-xs">
                <span className="text-slate-500 block mb-1">LEARNING INTERESTS:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(student.learningInterests || []).map((interest, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-black border border-slate-700 text-slate-300">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Apply Modal */}
      {selectedOpportunity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
          <div className="hud-corner relative w-full max-w-lg rounded-2xl border border-cyan-500/40 bg-[#090e12] p-6 shadow-2xl">
            <button
              onClick={() => setSelectedOpportunity(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <h3 className="hud-heading text-lg font-bold text-white mb-1">
              APPLY TO {selectedOpportunity.title}
            </h3>
            <div className="text-xs text-cyan-400 font-mono mb-4">
              {selectedOpportunity.companyName} • {selectedOpportunity.type.toUpperCase()}
            </div>

            <div className="p-3 rounded-lg bg-black/50 border border-slate-800 text-xs text-slate-300 mb-4">
              Your registered profile (<span className="text-[#00FF66]">{student.name}</span>, {student.college}, {student.skills?.length || 0} Skills) will be submitted automatically to the recruiter.
            </div>

            {applyError && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-xs text-red-400 mb-3">
                {applyError}
              </div>
            )}

            <form onSubmit={handleSubmitApplication} className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Resume / Portfolio Link</label>
                <input
                  type="url"
                  value={resumeUrl}
                  onChange={e => setResumeUrl(e.target.value)}
                  placeholder="https://drive.google.com/... or portfolio URL"
                  className="w-full px-3 py-2 rounded-lg bg-black border border-slate-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Cover Note / Why you are a fit</label>
                <textarea
                  rows={3}
                  value={coverLetter}
                  onChange={e => setCoverLetter(e.target.value)}
                  placeholder="Highlight relevant projects or coursework..."
                  className="w-full px-3 py-2 rounded-lg bg-black border border-slate-700 text-xs text-white"
                />
              </div>

              {applySuccess && (
                <p className="font-mono text-xs text-[#00FF66] flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" /> Application submitted successfully!
                </p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-rajdhani font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                CONFIRM & TRANSMIT APPLICATION
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
