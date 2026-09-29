import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { X, Sparkles, Building, GraduationCap, Compass, Briefcase, Plus, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole: UserRole;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialRole,
  onSuccess
}) => {
  const { login, registerStudent, registerMentor, registerRecruiter, registerAcademicAdmin } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'register' | 'login'>('register');
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Common Login State
  const [loginEmail, setLoginEmail] = useState('');

  // Student Form State
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    college: '',
    degree: '',
    branch: '',
    year: '1st Year',
    skills: '', // comma separated input
    targetCareer: '',
    learningInterests: '',
  });

  // Mentor Form State
  const [mentorForm, setMentorForm] = useState({
    name: '',
    email: '',
    professionalRole: '',
    industry: '',
    experienceYears: 3,
    subjectsTaught: '',
    bio: '',
    teachingPreference: '1-on-1 Mentorship' as const,
    availability: '',
    portfolioUrl: '',
    instagramId: '',
    whatsAppNumber: '',
    telegramUrl: '',
  });

  // Recruiter Form State
  const [recruiterForm, setRecruiterForm] = useState({
    name: '',
    company: '',
    email: '',
    industry: '',
    recruiterRole: '',
    companyWebsite: '',
    location: '',
    companyDescription: '',
  });

  // Academic Admin Form State
  const [academicForm, setAcademicForm] = useState({
    institution: '',
    adminName: '',
    email: '',
    department: '',
  });

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (!loginEmail.trim()) {
        throw new Error('Please enter your registered email address.');
      }
      await login(loginEmail.trim(), selectedRole);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (selectedRole === 'student') {
        if (!studentForm.name || !studentForm.email || !studentForm.college || !studentForm.degree || !studentForm.branch || !studentForm.targetCareer) {
          throw new Error('Please fill in all mandatory student credentials.');
        }
        const skillsArray = studentForm.skills
          ? studentForm.skills.split(',').map(s => s.trim()).filter(Boolean)
          : [];
        const interestsArray = studentForm.learningInterests
          ? studentForm.learningInterests.split(',').map(s => s.trim()).filter(Boolean)
          : [];

        await registerStudent({
          name: studentForm.name,
          email: studentForm.email,
          college: studentForm.college,
          degree: studentForm.degree,
          branch: studentForm.branch,
          year: studentForm.year,
          skills: skillsArray,
          targetCareer: studentForm.targetCareer,
          learningInterests: interestsArray,
        });
      } else if (selectedRole === 'mentor') {
        if (!mentorForm.name || !mentorForm.email || !mentorForm.professionalRole || !mentorForm.industry || !mentorForm.subjectsTaught || !mentorForm.bio || !mentorForm.availability) {
          throw new Error('Please fill in all required mentor profile fields.');
        }
        const subjectsArray = mentorForm.subjectsTaught.split(',').map(s => s.trim()).filter(Boolean);
        if (subjectsArray.length === 0) {
          throw new Error('Please provide at least one subject/skill you teach.');
        }

        await registerMentor({
          name: mentorForm.name,
          email: mentorForm.email,
          professionalRole: mentorForm.professionalRole,
          industry: mentorForm.industry,
          experienceYears: Number(mentorForm.experienceYears),
          subjectsTaught: subjectsArray,
          bio: mentorForm.bio,
          teachingPreference: mentorForm.teachingPreference,
          availability: mentorForm.availability,
          portfolioUrl: mentorForm.portfolioUrl,
          instagramId: mentorForm.instagramId,
          whatsAppNumber: mentorForm.whatsAppNumber,
          telegramUrl: mentorForm.telegramUrl,
        });
      } else if (selectedRole === 'recruiter') {
        if (!recruiterForm.name || !recruiterForm.company || !recruiterForm.email || !recruiterForm.industry || !recruiterForm.recruiterRole) {
          throw new Error('Please fill in all company and recruiter details.');
        }

        await registerRecruiter({
          name: recruiterForm.name,
          company: recruiterForm.company,
          email: recruiterForm.email,
          industry: recruiterForm.industry,
          recruiterRole: recruiterForm.recruiterRole,
          companyWebsite: recruiterForm.companyWebsite,
          location: recruiterForm.location,
          companyDescription: recruiterForm.companyDescription,
        });
      } else if (selectedRole === 'academic') {
        if (!academicForm.institution || !academicForm.adminName || !academicForm.email || !academicForm.department) {
          throw new Error('Please fill in all academic institution fields.');
        }

        await registerAcademicAdmin({
          institution: academicForm.institution,
          adminName: academicForm.adminName,
          email: academicForm.email,
          department: academicForm.department,
        });
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const getRoleHeader = () => {
    switch (selectedRole) {
      case 'student':
        return {
          title: 'STUDENT REGISTRATION',
          subtitle: 'Initialize your learning path, track real skills, and connect with industry.',
          icon: GraduationCap,
          color: '#00FF66'
        };
      case 'mentor':
        return {
          title: 'MENTOR REGISTRATION',
          subtitle: 'Share your industry expertise and guide the next generation of engineers.',
          icon: Compass,
          color: '#c084fc'
        };
      case 'recruiter':
        return {
          title: 'INDUSTRY RECRUITER REGISTRATION',
          subtitle: 'Post verified internships and jobs to discover students with proven skills.',
          icon: Briefcase,
          color: '#38bdf8'
        };
      case 'academic':
        return {
          title: 'ACADEMIC ADMIN REGISTRATION',
          subtitle: 'Monitor student body skill-gaps and align curricula with industry demands.',
          icon: Building,
          color: '#dfa260'
        };
    }
  };

  const header = getRoleHeader();
  const Icon = header.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
      <div className="hud-corner relative w-full max-w-2xl rounded-2xl border border-[#00FF66]/30 bg-[#0c0d0c] p-6 md:p-8 shadow-2xl my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4 mb-6">
          <div 
            className="flex h-12 w-12 items-center justify-center rounded-xl border bg-black/60 shadow-lg shrink-0"
            style={{ borderColor: `${header.color}66` }}
          >
            <Icon className="h-6 w-6" style={{ color: header.color }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="hud-heading text-lg md:text-xl font-bold tracking-wide text-white">
                {header.title}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {header.subtitle}
            </p>
          </div>
        </div>

        {/* Tab switcher: REGISTER vs LOGIN */}
        <div className="flex rounded-xl bg-black/50 p-1 border border-white/10 mb-6">
          <button
            type="button"
            onClick={() => { setActiveTab('register'); setError(null); }}
            className={`flex-1 py-2 text-xs font-rajdhani font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'bg-[#00FF66] text-black shadow-[0_0_15px_rgba(0,255,102,0.3)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            New Registration
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setError(null); }}
            className={`flex-1 py-2 text-xs font-rajdhani font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'bg-[#00FF66] text-black shadow-[0_0_15px_rgba(0,255,102,0.3)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Existing User Login
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg border border-red-500/40 bg-red-950/30 text-red-400 text-xs mb-4">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {activeTab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="p-3 rounded-lg bg-black/30 border border-slate-800 text-xs text-slate-400">
              Note: SkillBridge starts completely empty. You must register an account first before logging in.
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase tracking-wider">
                Registered Email Address *
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                placeholder="Enter your registered email..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-black/60 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00FF66] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-[#00FF66] hover:bg-[#05DF72] text-black font-rajdhani font-bold text-sm uppercase tracking-wider transition-all neon-glow-btn cursor-pointer disabled:opacity-50"
            >
              {loading ? 'AUTHENTICATING...' : `ACCESS ${selectedRole.toUpperCase()} DASHBOARD`}
            </button>
          </form>
        ) : (
          /* REGISTRATION FORM PER ROLE */
          <form onSubmit={handleRegister} className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            {/* STUDENT FORM */}
            {selectedRole === 'student' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={studentForm.name}
                      onChange={e => setStudentForm({ ...studentForm, name: e.target.value })}
                      placeholder="e.g. Alex Mercer"
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-sm text-white focus:outline-none focus:border-[#00FF66]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={studentForm.email}
                      onChange={e => setStudentForm({ ...studentForm, email: e.target.value })}
                      placeholder="alex@college.edu"
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-sm text-white focus:outline-none focus:border-[#00FF66]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">College / University *</label>
                    <input
                      type="text"
                      required
                      value={studentForm.college}
                      onChange={e => setStudentForm({ ...studentForm, college: e.target.value })}
                      placeholder="e.g. IIT Bombay, NIT"
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-sm text-white focus:outline-none focus:border-[#00FF66]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">Degree *</label>
                    <input
                      type="text"
                      required
                      value={studentForm.degree}
                      onChange={e => setStudentForm({ ...studentForm, degree: e.target.value })}
                      placeholder="e.g. B.Tech, B.E., BCA"
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-sm text-white focus:outline-none focus:border-[#00FF66]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">Branch / Major *</label>
                    <input
                      type="text"
                      required
                      value={studentForm.branch}
                      onChange={e => setStudentForm({ ...studentForm, branch: e.target.value })}
                      placeholder="e.g. Computer Science, AI & DS"
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-sm text-white focus:outline-none focus:border-[#00FF66]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">Academic Year *</label>
                    <select
                      value={studentForm.year}
                      onChange={e => setStudentForm({ ...studentForm, year: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-sm text-white focus:outline-none focus:border-[#00FF66]"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="Final Year">Final Year</option>
                      <option value="Postgraduate">Postgraduate</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">Target Career / Role *</label>
                  <input
                    type="text"
                    required
                    value={studentForm.targetCareer}
                    onChange={e => setStudentForm({ ...studentForm, targetCareer: e.target.value })}
                    placeholder="e.g. Full Stack Developer, ML Engineer, Cloud Architect"
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-sm text-white focus:outline-none focus:border-[#00FF66]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">
                    Your Current Skills (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={studentForm.skills}
                    onChange={e => setStudentForm({ ...studentForm, skills: e.target.value })}
                    placeholder="e.g. React, Python, TypeScript, SQL"
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-sm text-white focus:outline-none focus:border-[#00FF66]"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    You can also add or update individual skills later in your dashboard.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">
                    Learning Interests (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={studentForm.learningInterests}
                    onChange={e => setStudentForm({ ...studentForm, learningInterests: e.target.value })}
                    placeholder="e.g. System Design, Kubernetes, LLMs"
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-sm text-white focus:outline-none focus:border-[#00FF66]"
                  />
                </div>
              </>
            )}

            {/* MENTOR FORM */}
            {selectedRole === 'mentor' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">Mentor Full Name *</label>
                    <input
                      type="text"
                      required
                      value={mentorForm.name}
                      onChange={e => setMentorForm({ ...mentorForm, name: e.target.value })}
                      placeholder="e.g. Sarah Connor"
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-sm text-white focus:outline-none focus:border-[#c084fc]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={mentorForm.email}
                      onChange={e => setMentorForm({ ...mentorForm, email: e.target.value })}
                      placeholder="sarah@industry.io"
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-sm text-white focus:outline-none focus:border-[#c084fc]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">Professional Role *</label>
                    <input
                      type="text"
                      required
                      value={mentorForm.professionalRole}
                      onChange={e => setMentorForm({ ...mentorForm, professionalRole: e.target.value })}
                      placeholder="e.g. Senior Backend Architect"
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-sm text-white focus:outline-none focus:border-[#c084fc]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">Industry *</label>
                    <input
                      type="text"
                      required
                      value={mentorForm.industry}
                      onChange={e => setMentorForm({ ...mentorForm, industry: e.target.value })}
                      placeholder="e.g. Fintech, Cloud, AI"
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-sm text-white focus:outline-none focus:border-[#c084fc]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">Experience (Years) *</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={mentorForm.experienceYears}
                      onChange={e => setMentorForm({ ...mentorForm, experienceYears: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-sm text-white focus:outline-none focus:border-[#c084fc]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">Teaching Preference *</label>
                    <select
                      value={mentorForm.teachingPreference}
                      onChange={e => setMentorForm({ ...mentorForm, teachingPreference: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-sm text-white focus:outline-none focus:border-[#c084fc]"
                    >
                      <option value="1-on-1 Mentorship">1-on-1 Mentorship</option>
                      <option value="Group Sessions">Group Sessions</option>
                      <option value="Async Code Review">Async Code Review</option>
                      <option value="Career Guidance">Career Guidance</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">
                    Subjects / Skills You Teach (Comma-separated) *
                  </label>
                  <input
                    type="text"
                    required
                    value={mentorForm.subjectsTaught}
                    onChange={e => setMentorForm({ ...mentorForm, subjectsTaught: e.target.value })}
                    placeholder="e.g. React, Node.js, System Design, Docker"
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-sm text-white focus:outline-none focus:border-[#c084fc]"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Students will discover your mentor profile when searching for these exact subjects.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">Short Bio *</label>
                  <textarea
                    rows={2}
                    required
                    value={mentorForm.bio}
                    onChange={e => setMentorForm({ ...mentorForm, bio: e.target.value })}
                    placeholder="Share your background and how you guide students..."
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-sm text-white focus:outline-none focus:border-[#c084fc]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">Availability Schedule *</label>
                  <input
                    type="text"
                    required
                    value={mentorForm.availability}
                    onChange={e => setMentorForm({ ...mentorForm, availability: e.target.value })}
                    placeholder="e.g. Weekends 4:00 PM - 7:00 PM IST"
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-sm text-white focus:outline-none focus:border-[#c084fc]"
                  />
                </div>

                {/* Connection Channels */}
                <div className="border-t border-slate-800 pt-3">
                  <h4 className="text-xs font-mono text-[#c084fc] uppercase mb-2">Student Connection Channels</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">WhatsApp Number</label>
                      <input
                        type="text"
                        value={mentorForm.whatsAppNumber}
                        onChange={e => setMentorForm({ ...mentorForm, whatsAppNumber: e.target.value })}
                        placeholder="+91 9876543210"
                        className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-slate-700 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Telegram URL</label>
                      <input
                        type="text"
                        value={mentorForm.telegramUrl}
                        onChange={e => setMentorForm({ ...mentorForm, telegramUrl: e.target.value })}
                        placeholder="https://t.me/yourusername"
                        className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-slate-700 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Instagram ID</label>
                      <input
                        type="text"
                        value={mentorForm.instagramId}
                        onChange={e => setMentorForm({ ...mentorForm, instagramId: e.target.value })}
                        placeholder="@mentor_handle"
                        className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-slate-700 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Portfolio / Profile Link</label>
                      <input
                        type="url"
                        value={mentorForm.portfolioUrl}
                        onChange={e => setMentorForm({ ...mentorForm, portfolioUrl: e.target.value })}
                        placeholder="https://portfolio.dev"
                        className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-slate-700 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* RECRUITER FORM */}
            {selectedRole === 'recruiter' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">Recruiter Name *</label>
                    <input
                      type="text"
                      required
                      value={recruiterForm.name}
                      onChange={e => setRecruiterForm({ ...recruiterForm, name: e.target.value })}
                      placeholder="e.g. Jordan Hayes"
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">Work Email *</label>
                    <input
                      type="email"
                      required
                      value={recruiterForm.email}
                      onChange={e => setRecruiterForm({ ...recruiterForm, email: e.target.value })}
                      placeholder="jordan@techcorp.com"
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">Company Name *</label>
                    <input
                      type="text"
                      required
                      value={recruiterForm.company}
                      onChange={e => setRecruiterForm({ ...recruiterForm, company: e.target.value })}
                      placeholder="e.g. CyberFlow Systems"
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">Industry *</label>
                    <input
                      type="text"
                      required
                      value={recruiterForm.industry}
                      onChange={e => setRecruiterForm({ ...recruiterForm, industry: e.target.value })}
                      placeholder="e.g. Artificial Intelligence, SaaS, Cloud"
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">Your Recruiter Role *</label>
                    <input
                      type="text"
                      required
                      value={recruiterForm.recruiterRole}
                      onChange={e => setRecruiterForm({ ...recruiterForm, recruiterRole: e.target.value })}
                      placeholder="e.g. Technical Talent Acquisition Lead"
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">Company Location</label>
                    <input
                      type="text"
                      value={recruiterForm.location}
                      onChange={e => setRecruiterForm({ ...recruiterForm, location: e.target.value })}
                      placeholder="e.g. Bengaluru, India / Remote"
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">Company Website</label>
                  <input
                    type="url"
                    value={recruiterForm.companyWebsite}
                    onChange={e => setRecruiterForm({ ...recruiterForm, companyWebsite: e.target.value })}
                    placeholder="https://company.com"
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </>
            )}

            {/* ACADEMIC ADMIN FORM */}
            {selectedRole === 'academic' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">Institution / University *</label>
                    <input
                      type="text"
                      required
                      value={academicForm.institution}
                      onChange={e => setAcademicForm({ ...academicForm, institution: e.target.value })}
                      placeholder="e.g. National Institute of Technology"
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-sm text-white focus:outline-none focus:border-[#dfa260]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">Admin Name *</label>
                    <input
                      type="text"
                      required
                      value={academicForm.adminName}
                      onChange={e => setAcademicForm({ ...academicForm, adminName: e.target.value })}
                      placeholder="e.g. Dr. Arthur Vance"
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-sm text-white focus:outline-none focus:border-[#dfa260]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">Official Institutional Email *</label>
                    <input
                      type="email"
                      required
                      value={academicForm.email}
                      onChange={e => setAcademicForm({ ...academicForm, email: e.target.value })}
                      placeholder="dean.placements@nit.edu"
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-sm text-white focus:outline-none focus:border-[#dfa260]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1 uppercase">Department / Deanery *</label>
                    <input
                      type="text"
                      required
                      value={academicForm.department}
                      onChange={e => setAcademicForm({ ...academicForm, department: e.target.value })}
                      placeholder="e.g. Training & Placement Cell / CSE"
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-slate-700 text-sm text-white focus:outline-none focus:border-[#dfa260]"
                    />
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 rounded-xl bg-[#00FF66] hover:bg-[#05DF72] text-black font-rajdhani font-bold text-sm uppercase tracking-wider transition-all neon-glow-btn cursor-pointer disabled:opacity-50"
            >
              {loading ? 'INITIALIZING PROFILE...' : `COMPLETE ${selectedRole.toUpperCase()} REGISTRATION`}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
