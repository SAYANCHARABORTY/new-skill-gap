import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { RecruiterProfile, Opportunity, Application } from '../../../types';
import { StorageService } from '../../../services/storage';
import { EmptyState } from '../../common/EmptyState';
import { 
  Building, 
  Briefcase, 
  Users, 
  Plus, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  MapPin,
  FileText
} from 'lucide-react';

export const RecruiterDashboard: React.FC = () => {
  const { currentUser, refreshUser } = useAuth();
  const recruiter = currentUser as RecruiterProfile;

  const [activeTab, setActiveTab] = useState<'openings' | 'create' | 'applications' | 'company'>('openings');

  // Create Opportunity Form State
  const [oppTitle, setOppTitle] = useState('');
  const [oppType, setOppType] = useState<'job' | 'internship'>('internship');
  const [oppLocation, setOppLocation] = useState('');
  const [oppIsRemote, setOppIsRemote] = useState(true);
  const [oppSkills, setOppSkills] = useState('');
  const [oppExperience, setOppExperience] = useState('Fresher / 0-1 years');
  const [oppStipend, setOppStipend] = useState('');
  const [oppDescription, setOppDescription] = useState('');
  const [createSuccess, setCreateSuccess] = useState(false);

  // Live real data
  const myOpportunities = StorageService.getOpportunitiesByRecruiter(recruiter?.id || '');
  const recruiterApplications = StorageService.getApplicationsForRecruiter(recruiter?.id || '');

  const handleCreateOpportunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oppTitle.trim() || !oppSkills.trim() || !oppDescription.trim()) return;

    const skillsArray = oppSkills.split(',').map(s => s.trim()).filter(Boolean);

    StorageService.saveOpportunity({
      recruiterId: recruiter.id,
      companyName: recruiter.company,
      title: oppTitle.trim(),
      type: oppType,
      industry: recruiter.industry,
      location: oppLocation.trim() || 'Remote',
      isRemote: oppIsRemote,
      requiredSkills: skillsArray,
      experienceRequirement: oppExperience,
      stipendOrSalary: oppStipend.trim(),
      description: oppDescription.trim(),
      responsibilities: ['Collaborate with engineering squad', 'Design and implement features']
    });

    setCreateSuccess(true);
    refreshUser();

    setTimeout(() => {
      setCreateSuccess(false);
      setOppTitle('');
      setOppSkills('');
      setOppLocation('');
      setOppStipend('');
      setOppDescription('');
      setActiveTab('openings');
    }, 1200);
  };

  const handleDeleteOpportunity = (oppId: string) => {
    StorageService.deleteOpportunity(oppId);
    refreshUser();
  };

  const handleUpdateAppStatus = (appId: string, status: Application['status']) => {
    StorageService.updateApplicationStatus(appId, status);
    refreshUser();
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Recruiter Banner */}
      <div className="hud-corner rounded-2xl border border-cyan-500/30 bg-[#071118] p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] text-cyan-300 font-bold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
              INDUSTRY HIRING TELEMETRY
            </span>
            <span className="font-mono text-xs text-slate-400">{recruiter?.company} // {recruiter?.industry}</span>
          </div>
          <h1 className="hud-heading text-2xl sm:text-3xl font-black text-white">
            {recruiter?.name}
          </h1>
          <p className="font-mono text-xs text-slate-400 mt-1">
            Role: <strong className="text-cyan-300">{recruiter?.recruiterRole}</strong>
          </p>
        </div>

        <button
          onClick={() => setActiveTab('create')}
          className="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-rajdhani font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>POST NEW REQUISITION</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex rounded-xl bg-black/60 p-1 border border-slate-800 mb-8 overflow-x-auto no-scrollbar">
        {[
          { id: 'openings', label: 'ACTIVE OPPORTUNITIES', icon: Briefcase, count: myOpportunities.length },
          { id: 'create', label: 'CREATE REQUISITION', icon: Plus },
          { id: 'applications', label: 'CANDIDATE APPLICATIONS', icon: Users, count: recruiterApplications.length },
          { id: 'company', label: 'COMPANY PROFILE', icon: Building }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-rajdhani font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${isActive ? 'bg-black text-cyan-400' : 'bg-slate-800 text-slate-300'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: ACTIVE OPPORTUNITIES */}
      {activeTab === 'openings' && (
        <div className="space-y-6">
          <div className="hud-corner rounded-2xl border border-slate-800 bg-[#0c0f12] p-6">
            <h3 className="hud-heading text-lg font-bold text-white mb-1">
              POSTED REQUISITIONS ({myOpportunities.length})
            </h3>
            <p className="text-xs text-slate-400">
              Active engineering job and internship listings published by {recruiter.company}.
            </p>
          </div>

          {myOpportunities.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No jobs posted yet."
              description="You have not published any job or internship requisitions yet. Create an opportunity with your desired skill requirements to start receiving verified student applications."
              actionText="CREATE FIRST REQUISITION"
              onAction={() => setActiveTab('create')}
              variant="neutral"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myOpportunities.map(opp => (
                <div
                  key={opp.id}
                  className="hud-corner rounded-xl border border-slate-800 bg-[#090e12] p-5 hover:border-cyan-400/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <span className={`font-mono text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                          opp.type === 'internship' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30' : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                        }`}>
                          {opp.type}
                        </span>
                        <h4 className="font-bold text-white text-base mt-1">{opp.title}</h4>
                      </div>
                      <button
                        onClick={() => handleDeleteOpportunity(opp.id)}
                        className="p-1.5 text-slate-500 hover:text-red-400"
                        title="Delete Requisition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-3 mb-4 font-sans">
                      {opp.description}
                    </p>

                    <div className="mb-4">
                      <div className="font-mono text-[10px] text-slate-500 uppercase mb-1">Required Skills:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {opp.requiredSkills.map((req, i) => (
                          <span key={i} className="font-mono text-[10px] px-2 py-0.5 rounded bg-black border border-slate-700 text-cyan-300">
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>

                    {opp.stipendOrSalary && (
                      <div className="font-mono text-xs text-[#00FF66] mb-3">
                        Compensation: {opp.stipendOrSalary}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>{opp.location} {opp.isRemote && '(Remote)'}</span>
                    <span>Posted {new Date(opp.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CREATE REQUISITION */}
      {activeTab === 'create' && (
        <form onSubmit={handleCreateOpportunity} className="hud-corner rounded-2xl border border-slate-800 bg-[#0c0f12] p-6 max-w-2xl mx-auto space-y-4">
          <h3 className="hud-heading text-lg font-bold text-white mb-1">POST JOB OR INTERNSHIP</h3>
          <p className="text-xs text-slate-400 mb-4">
            Required skills listed here will directly feed the live Skill Gap telemetry across all registered students.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Position Title *</label>
              <input
                type="text"
                required
                value={oppTitle}
                onChange={e => setOppTitle(e.target.value)}
                placeholder="e.g. Junior Full Stack Engineer"
                className="w-full px-3 py-2 rounded-lg bg-black border border-slate-700 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Opportunity Type *</label>
              <select
                value={oppType}
                onChange={e => setOppType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-black border border-slate-700 text-xs text-white"
              >
                <option value="internship">Internship</option>
                <option value="job">Full-Time Job</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              Required Skills (Comma-separated) *
            </label>
            <input
              type="text"
              required
              value={oppSkills}
              onChange={e => setOppSkills(e.target.value)}
              placeholder="e.g. React, TypeScript, Node.js, PostgreSQL"
              className="w-full px-3 py-2 rounded-lg bg-black border border-slate-700 text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Location</label>
              <input
                type="text"
                value={oppLocation}
                onChange={e => setOppLocation(e.target.value)}
                placeholder="e.g. Bengaluru / Hybrid"
                className="w-full px-3 py-2 rounded-lg bg-black border border-slate-700 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Experience Level</label>
              <input
                type="text"
                value={oppExperience}
                onChange={e => setOppExperience(e.target.value)}
                placeholder="e.g. 0-1 years"
                className="w-full px-3 py-2 rounded-lg bg-black border border-slate-700 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Stipend / Salary</label>
              <input
                type="text"
                value={oppStipend}
                onChange={e => setOppStipend(e.target.value)}
                placeholder="e.g. ₹40,000/mo or ₹8-12 LPA"
                className="w-full px-3 py-2 rounded-lg bg-black border border-slate-700 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Role Description *</label>
            <textarea
              rows={4}
              required
              value={oppDescription}
              onChange={e => setOppDescription(e.target.value)}
              placeholder="Detail the technical responsibilities, engineering stack, and hiring requirements..."
              className="w-full px-3 py-2 rounded-lg bg-black border border-slate-700 text-xs text-white"
            />
          </div>

          {createSuccess && (
            <p className="font-mono text-xs text-[#00FF66] flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" /> Opportunity published to SkillBridge!
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-black font-rajdhani font-bold text-xs uppercase tracking-wider cursor-pointer"
          >
            TRANSMIT REQUISITION TO LIVE MARKETPLACE
          </button>
        </form>
      )}

      {/* TAB 3: CANDIDATE APPLICATIONS */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          <div className="hud-corner rounded-2xl border border-slate-800 bg-[#0c0f12] p-6">
            <h3 className="hud-heading text-lg font-bold text-white mb-1">
              CANDIDATE APPLICATIONS ({recruiterApplications.length})
            </h3>
            <p className="text-xs text-slate-400">
              Verified applications submitted by students for your posted opportunities.
            </p>
          </div>

          {recruiterApplications.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No applications yet."
              description="When students review your active requisitions and apply with their verified skill stacks, candidate files will appear here."
              variant="neutral"
            />
          ) : (
            <div className="space-y-4">
              {recruiterApplications.map(({ application: app, opportunity: opp }) => (
                <div
                  key={app.id}
                  className="hud-corner rounded-xl border border-slate-800 bg-[#090e12] p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h4 className="font-bold text-white text-base">{app.studentName}</h4>
                      <span className="font-mono text-xs text-cyan-400">Applying for: {opp.title}</span>
                    </div>

                    <div className="font-mono text-xs text-slate-400">
                      {app.studentEmail} • {app.studentCollege} ({app.studentDegree})
                    </div>

                    {/* Candidate skills */}
                    <div className="flex flex-wrap gap-1">
                      {app.studentSkills.map((sk, i) => (
                        <span key={i} className="font-mono text-[10px] px-2 py-0.5 rounded bg-black border border-slate-700 text-[#00FF66]">
                          {sk}
                        </span>
                      ))}
                    </div>

                    {app.coverLetter && (
                      <p className="text-xs text-slate-300 font-sans italic">
                        "{app.coverLetter}"
                      </p>
                    )}

                    {app.resumeUrl && (
                      <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="text-xs text-cyan-400 hover:underline inline-flex items-center gap-1">
                        Inspect Candidate Resume <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 shrink-0">
                    <span className="font-mono text-xs px-2.5 py-1 rounded border uppercase bg-cyan-500/10 text-cyan-300 border-cyan-500/30">
                      {app.status.replace('_', ' ')}
                    </span>

                    <select
                      value={app.status}
                      onChange={e => handleUpdateAppStatus(app.id, e.target.value as any)}
                      className="px-2.5 py-1.5 rounded-lg bg-black border border-slate-700 text-xs text-white"
                    >
                      <option value="applied">Applied</option>
                      <option value="under_review">Under Review</option>
                      <option value="interview_scheduled">Schedule Interview</option>
                      <option value="accepted">Accepted / Offer</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: COMPANY PROFILE */}
      {activeTab === 'company' && (
        <div className="hud-corner rounded-2xl border border-slate-800 bg-[#0c0f12] p-6 max-w-xl mx-auto space-y-4">
          <h3 className="hud-heading text-lg font-bold text-white mb-2">COMPANY TELEMETRY</h3>
          <div className="space-y-3 font-mono text-xs">
            <div>
              <span className="text-slate-500 block">ORGANIZATION NAME:</span>
              <span className="text-white font-bold">{recruiter.company}</span>
            </div>
            <div>
              <span className="text-slate-500 block">SECTOR:</span>
              <span className="text-white">{recruiter.industry}</span>
            </div>
            <div>
              <span className="text-slate-500 block">RECRUITER REPRESENTATIVE:</span>
              <span className="text-white">{recruiter.name} ({recruiter.recruiterRole})</span>
            </div>
            <div>
              <span className="text-slate-500 block">WORK EMAIL:</span>
              <span className="text-white">{recruiter.email}</span>
            </div>
            {recruiter.companyWebsite && (
              <div>
                <span className="text-slate-500 block">URL:</span>
                <a href={recruiter.companyWebsite} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">
                  {recruiter.companyWebsite}
                </a>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
