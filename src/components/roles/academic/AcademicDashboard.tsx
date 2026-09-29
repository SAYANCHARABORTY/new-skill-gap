import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { AcademicAdminProfile } from '../../../types';
import { StorageService } from '../../../services/storage';
import { EmptyState } from '../../common/EmptyState';
import { 
  Building, 
  GraduationCap, 
  TrendingUp, 
  Briefcase, 
  Layers, 
  PieChart, 
  Search,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export const AcademicDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const admin = currentUser as AcademicAdminProfile;

  const [activeTab, setActiveTab] = useState<'students' | 'skillgap' | 'market' | 'insights'>('students');
  const [studentSearch, setStudentSearch] = useState('');

  // Fetch real data
  const students = StorageService.getStudents();
  const opportunities = StorageService.getOpportunities();

  // Aggregate student skills
  const studentSkillsMap = new Map<string, number>();
  for (const s of students) {
    for (const sk of s.skills || []) {
      const key = sk.name.trim().toLowerCase();
      studentSkillsMap.set(key, (studentSkillsMap.get(key) || 0) + 1);
    }
  }

  // Aggregate industry required skills
  const industrySkillsMap = new Map<string, number>();
  for (const opp of opportunities) {
    for (const sk of opp.requiredSkills || []) {
      const key = sk.trim().toLowerCase();
      industrySkillsMap.set(key, (industrySkillsMap.get(key) || 0) + 1);
    }
  }

  // Calculate institutional skill-gap
  const totalMarketSkills = industrySkillsMap.size;
  let matchingMarketSkills = 0;
  const gapAnalysis: Array<{
    skill: string;
    studentCount: number;
    industryDemandCount: number;
    status: 'ALIGNED' | 'DEFICIT' | 'SURPLUS';
  }> = [];

  for (const [skillName, demand] of industrySkillsMap.entries()) {
    const studentCount = studentSkillsMap.get(skillName) || 0;
    if (studentCount > 0) matchingMarketSkills++;

    gapAnalysis.push({
      skill: skillName.charAt(0).toUpperCase() + skillName.slice(1),
      studentCount,
      industryDemandCount: demand,
      status: studentCount === 0 ? 'DEFICIT' : 'ALIGNED'
    });
  }

  // Filter students
  const filteredStudents = students.filter(s =>
    !studentSearch.trim() ||
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.branch.toLowerCase().includes(studentSearch.toLowerCase()) ||
    (s.skills || []).some(sk => sk.name.toLowerCase().includes(studentSearch.toLowerCase()))
  );

  const hasInsightsData = students.length > 0 && opportunities.length > 0;
  const alignmentRate = totalMarketSkills > 0 ? Math.round((matchingMarketSkills / totalMarketSkills) * 100) : 0;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Academic Banner */}
      <div className="hud-corner rounded-2xl border border-[#c48746]/30 bg-[#140c07] p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] text-[#dfa260] font-bold px-2 py-0.5 rounded bg-[#c48746]/10 border border-[#c48746]/30">
              ACADEMIC GOVERNANCE
            </span>
            <span className="font-mono text-xs text-slate-400">{admin?.institution} // {admin?.department}</span>
          </div>
          <h1 className="hud-heading text-2xl sm:text-3xl font-black text-white">
            {admin?.name}
          </h1>
          <p className="font-mono text-xs text-slate-400 mt-1">
            Institutional Oversight: <strong className="text-[#dfa260]">{admin?.institution}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-black border border-[#c48746]/40 text-center font-mono text-xs">
            <div className="text-xl font-bold text-[#dfa260]">{students.length}</div>
            <div className="text-[10px] text-slate-400 uppercase">Enrolled Students</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex rounded-xl bg-black/60 p-1 border border-slate-800 mb-8 overflow-x-auto no-scrollbar">
        {[
          { id: 'students', label: 'STUDENT ROSTER', icon: GraduationCap, count: students.length },
          { id: 'skillgap', label: 'CURRICULUM GAP ANALYSIS', icon: TrendingUp },
          { id: 'market', label: 'INDUSTRY DEMANDS', icon: Briefcase, count: opportunities.length },
          { id: 'insights', label: 'INSTITUTIONAL INSIGHTS', icon: PieChart }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-rajdhani font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#c48746] text-black shadow-[0_0_15px_rgba(223,162,96,0.3)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${isActive ? 'bg-black text-[#dfa260]' : 'bg-slate-800 text-slate-300'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: STUDENT ROSTER */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          <div className="hud-corner rounded-2xl border border-slate-800 bg-[#0d0a07] p-6">
            <h3 className="hud-heading text-lg font-bold text-white mb-1">
              ENROLLED STUDENT TALENT DIRECTORY
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Real registered students and their self-attested technical skill inventories.
            </p>

            <div className="relative max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={studentSearch}
                onChange={e => setStudentSearch(e.target.value)}
                placeholder="Search students by name, email, branch, or skill..."
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-black border border-slate-700 text-xs text-white"
              />
            </div>
          </div>

          {students.length === 0 ? (
            <EmptyState
              icon={GraduationCap}
              title="No students registered yet."
              description="Student records only display here when students register their verified credentials. No mock student profiles exist."
              variant="chocolate"
            />
          ) : filteredStudents.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No students match search filter."
              description="Try adjusting your search criteria."
              variant="neutral"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredStudents.map(s => (
                <div key={s.id} className="hud-corner rounded-xl border border-slate-800 bg-[#0c0906] p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h4 className="font-bold text-white text-base">{s.name}</h4>
                      <div className="font-mono text-xs text-[#dfa260]">{s.college}</div>
                      <div className="text-xs text-slate-400">{s.degree} • {s.branch} ({s.year})</div>
                    </div>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-black border border-slate-700 text-slate-300">
                      {s.targetCareer || 'Career Unset'}
                    </span>
                  </div>

                  <div className="mt-3">
                    <div className="font-mono text-[10px] text-slate-500 uppercase mb-1">Registered Skills ({s.skills?.length || 0}):</div>
                    <div className="flex flex-wrap gap-1">
                      {(s.skills || []).map(sk => (
                        <span key={sk.id} className="font-mono text-[10px] px-2 py-0.5 rounded bg-black border border-slate-700 text-[#00FF66]">
                          {sk.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CURRICULUM GAP ANALYSIS */}
      {activeTab === 'skillgap' && (
        <div className="space-y-6">
          <div className="hud-corner rounded-2xl border border-slate-800 bg-[#0d0a07] p-6">
            <h3 className="hud-heading text-lg font-bold text-white mb-1">
              CURRICULUM DEFICIT TELEMETRY
            </h3>
            <p className="text-xs text-slate-400">
              Aggregated across all registered students vs active industry job requirements.
            </p>
          </div>

          {gapAnalysis.length === 0 ? (
            <EmptyState
              icon={TrendingUp}
              title="No skill-gap data available yet."
              description="Institutional gap calculations require at least one registered corporate opening with skill requirements."
              variant="chocolate"
            />
          ) : (
            <div className="hud-corner rounded-2xl border border-slate-800 bg-[#0c0906] p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="font-mono text-xs text-slate-400 uppercase">Industry Skill Requisition</span>
                <span className="font-mono text-xs text-slate-400 uppercase">Institutional Status</span>
              </div>

              {gapAnalysis.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-slate-800">
                  <div>
                    <span className="font-bold text-white text-sm">{item.skill}</span>
                    <div className="font-mono text-[11px] text-slate-400">
                      Demanded by {item.industryDemandCount} active corporate role(s) • Known by {item.studentCount} student(s)
                    </div>
                  </div>

                  <div>
                    <span className={`font-mono text-xs px-2.5 py-1 rounded font-bold uppercase ${
                      item.status === 'ALIGNED'
                        ? 'bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30'
                        : 'bg-red-500/10 text-red-400 border border-red-500/30'
                    }`}>
                      {item.status === 'ALIGNED' ? 'CURRICULUM ALIGNED' : 'CURRICULUM DEFICIT'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: INDUSTRY DEMANDS */}
      {activeTab === 'market' && (
        <div className="space-y-6">
          <div className="hud-corner rounded-2xl border border-slate-800 bg-[#0d0a07] p-6">
            <h3 className="hud-heading text-lg font-bold text-white mb-1">
              ACTIVE INDUSTRY REQUISITIONS ({opportunities.length})
            </h3>
            <p className="text-xs text-slate-400">
              Live corporate vacancies where your students can be placed.
            </p>
          </div>

          {opportunities.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No jobs posted yet."
              description="No recruiters have published opportunities yet. Once recruiters register and post roles, they will be tracked here."
              variant="neutral"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {opportunities.map(opp => (
                <div key={opp.id} className="hud-corner rounded-xl border border-slate-800 bg-[#0c0906] p-5">
                  <span className="font-mono text-[10px] text-cyan-400 uppercase">{opp.companyName} • {opp.type}</span>
                  <h4 className="font-bold text-white text-base mt-1">{opp.title}</h4>
                  <p className="text-xs text-slate-300 mt-2 font-sans line-clamp-2">{opp.description}</p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {opp.requiredSkills.map((sk, i) => (
                      <span key={i} className="font-mono text-[10px] px-2 py-0.5 rounded bg-black border border-slate-700 text-slate-300">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: INSTITUTIONAL INSIGHTS */}
      {activeTab === 'insights' && (
        <div className="space-y-6">
          <div className="hud-corner rounded-2xl border border-slate-800 bg-[#0d0a07] p-6">
            <h3 className="hud-heading text-lg font-bold text-white mb-1">
              INSTITUTIONAL TELEMETRY & INSIGHTS
            </h3>
            <p className="text-xs text-slate-400">
              Data science metrics calculated strictly from genuine registered records.
            </p>
          </div>

          {!hasInsightsData ? (
            <EmptyState
              icon={PieChart}
              title="Not enough data available yet."
              description="Institutional insights require both registered students and active recruiter requisitions to generate statistical telemetry without fabricating numbers."
              variant="chocolate"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="hud-corner rounded-xl border border-[#c48746]/40 bg-black/60 p-6 text-center">
                <div className="font-mono text-3xl font-black text-[#dfa260]">{alignmentRate}%</div>
                <div className="font-mono text-xs text-slate-400 uppercase mt-2">Curriculum-to-Industry Alignment</div>
              </div>
              <div className="hud-corner rounded-xl border border-slate-800 bg-black/60 p-6 text-center">
                <div className="font-mono text-3xl font-black text-white">{students.length}</div>
                <div className="font-mono text-xs text-slate-400 uppercase mt-2">Active Candidates</div>
              </div>
              <div className="hud-corner rounded-xl border border-slate-800 bg-black/60 p-6 text-center">
                <div className="font-mono text-3xl font-black text-cyan-400">{opportunities.length}</div>
                <div className="font-mono text-xs text-slate-400 uppercase mt-2">Corporate Requisitions</div>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
