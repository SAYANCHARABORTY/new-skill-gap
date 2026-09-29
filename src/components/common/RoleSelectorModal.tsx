import React from 'react';
import { UserRole } from '../../types';
import { GraduationCap, Briefcase, Building, Compass, Sparkles, X, ChevronRight } from 'lucide-react';

interface RoleSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: UserRole) => void;
  onOpenNirvana: () => void;
}

export const RoleSelectorModal: React.FC<RoleSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectRole,
  onOpenNirvana,
}) => {
  if (!isOpen) return null;

  const roles = [
    {
      id: 'student' as UserRole,
      title: 'STUDENT',
      badge: 'TALENT PORTAL',
      description: 'Audit your skill gaps, access structured resources, connect with verified mentors, and apply to real recruiter jobs.',
      icon: GraduationCap,
      color: '#00FF66',
      accentBorder: 'hover:border-[#00FF66]/80 hover:shadow-[0_0_25px_rgba(0,255,102,0.25)]',
      gradient: 'from-[#00FF66]/10 to-transparent'
    },
    {
      id: 'recruiter' as UserRole,
      title: 'INDUSTRY RECRUITER',
      badge: 'HIRING PORTAL',
      description: 'Create real job and internship requisitions, specify required skill stacks, and review qualified student applicants.',
      icon: Briefcase,
      color: '#38bdf8',
      accentBorder: 'hover:border-cyan-400/80 hover:shadow-[0_0_25px_rgba(56,189,248,0.25)]',
      gradient: 'from-cyan-500/10 to-transparent'
    },
    {
      id: 'academic' as UserRole,
      title: 'ACADEMIC ADMIN',
      badge: 'INSTITUTION OVERSIGHT',
      description: 'Monitor college talent pools, evaluate aggregate skill gaps against real market demand, and bridge curriculum deficits.',
      icon: Building,
      color: '#dfa260',
      accentBorder: 'hover:border-[#c48746]/80 hover:shadow-[0_0_25px_rgba(223,162,96,0.25)]',
      gradient: 'from-[#c48746]/10 to-transparent'
    },
    {
      id: 'mentor' as UserRole,
      title: 'MENTOR',
      badge: 'EXPERT SQUAD',
      description: 'Register your industry credentials, publish teaching subjects, establish WhatsApp/Telegram links, and mentor students.',
      icon: Compass,
      color: '#c084fc',
      accentBorder: 'hover:border-purple-400/80 hover:shadow-[0_0_25px_rgba(192,132,252,0.25)]',
      gradient: 'from-purple-500/10 to-transparent'
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl overflow-y-auto">
      <div className="hud-corner relative w-full max-w-4xl rounded-2xl border border-[#00FF66]/30 bg-[#090b0a] p-6 sm:p-10 shadow-2xl my-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00FF66]/30 bg-[#00FF66]/10 font-mono text-[11px] text-[#00FF66] mb-3">
            IDENTITY_GATEWAY // PROTOCOL_SELECT
          </div>
          <h2 className="hud-heading text-2xl sm:text-3xl font-black tracking-wider text-white">
            CHOOSE YOUR PATH
          </h2>
          <p className="text-sm text-slate-400 mt-2 font-sans">
            What brings you to SkillBridge? Select your role to unlock customized tools, real data flows, and secure role-specific dashboards.
          </p>
        </div>

        {/* 4 Primary Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {roles.map((r) => {
            const Icon = r.icon;
            return (
              <div
                key={r.id}
                onClick={() => {
                  onSelectRole(r.id);
                  onClose();
                }}
                className={`hud-corner group relative cursor-pointer rounded-xl border border-slate-800 bg-[#0f1210] p-5 transition-all duration-300 ${r.accentBorder}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${r.gradient} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div 
                      className="flex h-11 w-11 items-center justify-center rounded-xl border bg-black/60 shadow-md group-hover:scale-105 transition-transform"
                      style={{ borderColor: `${r.color}55` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: r.color }} />
                    </div>
                    <span 
                      className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase"
                      style={{ color: r.color, borderColor: `${r.color}40`, backgroundColor: `${r.color}10` }}
                    >
                      {r.badge}
                    </span>
                  </div>

                  <h3 className="hud-heading text-lg font-bold text-white group-hover:text-white transition-colors flex items-center justify-between">
                    <span>{r.title}</span>
                    <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </h3>

                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {r.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 5th Special Card: AI GUIDE — NIRVANA */}
        <div
          onClick={() => {
            onClose();
            onOpenNirvana();
          }}
          className="hud-corner group cursor-pointer relative rounded-xl border border-[#00FF66]/40 bg-gradient-to-r from-[#00FF66]/10 via-[#120905] to-[#c48746]/10 p-5 transition-all duration-300 hover:border-[#00FF66] hover:shadow-[0_0_30px_rgba(0,255,102,0.3)]"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black border border-[#00FF66] shadow-[0_0_15px_rgba(0,255,102,0.3)] shrink-0">
                <Sparkles className="h-6 w-6 text-[#00FF66] animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-[#00FF66] font-bold px-2 py-0.5 rounded bg-[#00FF66]/10 border border-[#00FF66]/30">
                    AI AGENT 01
                  </span>
                  <span className="hud-heading text-base font-bold text-white">
                    5. AI GUIDE — NIRVANA
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  Consult NIRVANA directly for real-time skill-gap explanations, roadmaps, and career guidance grounded in actual user profile data.
                </p>
              </div>
            </div>
            <button className="px-4 py-2 rounded-lg bg-[#00FF66] text-black font-rajdhani font-bold text-xs uppercase tracking-wider group-hover:bg-[#05DF72] transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer">
              <span>LAUNCH NIRVANA</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
