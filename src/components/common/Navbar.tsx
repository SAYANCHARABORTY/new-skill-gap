import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Terminal, LogOut, RefreshCw, UserCheck, Menu, X, Shield, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onOpenRoleModal: () => void;
  onOpenNirvana: () => void;
  onNavigate?: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenRoleModal,
  onOpenNirvana,
  onNavigate,
}) => {
  const { currentUser, role, logout, clearAllSystemData } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const getRoleBadge = () => {
    switch (role) {
      case 'student':
        return { label: 'STUDENT', color: 'bg-emerald-500/20 text-[#00FF66] border-[#00FF66]/40' };
      case 'recruiter':
        return { label: 'RECRUITER', color: 'bg-blue-500/20 text-cyan-400 border-cyan-400/40' };
      case 'academic':
        return { label: 'ACADEMIC ADMIN', color: 'bg-amber-500/20 text-[#dfa260] border-[#c48746]/40' };
      case 'mentor':
        return { label: 'MENTOR', color: 'bg-purple-500/20 text-purple-300 border-purple-400/40' };
      default:
        return null;
    }
  };

  const badge = getRoleBadge();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 w-full glass-nav motion-nav">
        <div className="w-full max-w-7xl mx-auto flex h-16 sm:h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* LEFT: SB logo + SKILLBRIDGE */}
          <div 
            onClick={() => onNavigate ? onNavigate('landing') : undefined}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-black border border-[#00FF66]/50 shadow-[0_0_15px_rgba(0,255,102,0.3)] group-hover:border-[#00FF66] transition-all">
              <span className="font-mono text-xs font-black text-[#00FF66]">SB</span>
              <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-[#00FF66] animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="hud-heading text-base sm:text-lg font-black tracking-widest text-white group-hover:text-[#00FF66] transition-colors">
                  SKILLBRIDGE
                </span>
                <span className="hidden lg:inline-block font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#170e08] border border-[#c48746]/40 text-[#dfa260]">
                  v1.2 HUD
                </span>
              </div>
              <p className="font-mono text-[9px] text-slate-400 tracking-wider hidden sm:block">
                LEARN × PRACTICE × GET PLACED
              </p>
            </div>
          </div>

          {/* CENTER: Home, How It Works, Students, Mentors, Recruiters, About */}
          {!currentUser ? (
            <nav className="hidden lg:flex items-center gap-5 xl:gap-7 font-rajdhani text-sm font-semibold tracking-wider text-slate-300">
              <a href="#home" className="hover:text-[#00FF66] transition-colors">
                Home
              </a>
              <a href="#how-it-works" className="hover:text-[#00FF66] transition-colors">
                How It Works
              </a>
              <a href="#skills" className="hover:text-[#00FF66] transition-colors">
                Skills
              </a>
              <a href="#mentors" className="hover:text-[#00FF66] transition-colors">
                Mentors
              </a>
              <a href="#jobs" className="hover:text-[#00FF66] transition-colors">
                Jobs
              </a>
              <a href="#internships" className="hover:text-[#00FF66] transition-colors">
                Internships
              </a>
              <button 
                onClick={onOpenNirvana}
                className="hover:text-[#00FF66] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>NIRVANA</span>
                <Sparkles className="h-3 w-3 text-[#00FF66]" />
              </button>
            </nav>

          ) : (
            <div className="hidden md:flex items-center gap-2 font-mono text-xs text-slate-400">
              <span>TELEMETRY SESSION:</span>
              <span className="text-white font-bold max-w-[160px] truncate">{currentUser.name}</span>
              {badge && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${badge.color}`}>
                  {badge.label}
                </span>
              )}
            </div>
          )}

          {/* RIGHT: Login | Get Started | NIRVANA */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* NIRVANA AI Button */}
            <button
              onClick={onOpenNirvana}
              className="relative inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:py-2 rounded-lg border border-[#00FF66]/50 bg-black/70 font-rajdhani font-bold text-xs uppercase tracking-wider text-[#00FF66] hover:bg-[#00FF66]/10 transition-all shadow-[0_0_15px_rgba(0,255,102,0.2)] cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#00FF66] animate-pulse" />
              <span>NIRVANA AI</span>
            </button>

            {!currentUser ? (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={onOpenRoleModal}
                  className="px-3.5 py-1.5 sm:py-2 rounded-lg border border-slate-700 hover:border-slate-500 font-rajdhani font-bold text-xs uppercase tracking-wider text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={onOpenRoleModal}
                  className="px-4 py-1.5 sm:py-2 rounded-lg font-rajdhani font-bold text-xs uppercase tracking-wider text-black bg-[#00FF66] hover:bg-[#05DF72] transition-all neon-glow-btn cursor-pointer"
                >
                  Get Started
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenRoleModal}
                  title="Switch Role Portal"
                  className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900/60 font-mono text-[11px] text-slate-300 hover:text-white hover:border-[#00FF66]/50 transition-all cursor-pointer hidden sm:inline-flex items-center gap-1"
                >
                  <UserCheck className="h-3 w-3 text-[#00FF66]" />
                  <span>SWITCH ROLE</span>
                </button>
                <button
                  onClick={logout}
                  title="Disconnect Session"
                  className="p-2 rounded-lg border border-red-500/30 bg-red-950/20 text-red-400 hover:bg-red-900/40 transition-all cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            {/* Reset Data Button (for Presentation/Evaluation Testing) */}
            <button
              onClick={() => setShowResetConfirm(true)}
              title="Reset System to Zero Data"
              className="p-2 rounded-lg border border-[#c48746]/30 bg-[#22120b]/40 text-[#dfa260] hover:border-[#c48746] transition-all cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>

            {/* Animated Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg border border-slate-800 text-slate-300 hover:text-[#00FF66] hover:border-[#00FF66]/40 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Glass HUD Panel */}
        {mobileMenuOpen && (
          <div className="lg:hidden glass-hud-panel border-t border-[#00FF66]/20 px-6 py-6 space-y-4">
            {!currentUser ? (
              <>
                <nav className="flex flex-col space-y-3 font-rajdhani text-base font-semibold tracking-wider text-slate-200">
                  <a 
                    href="#home" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-[#00FF66] transition-colors py-1"
                  >
                    Home
                  </a>
                  <a 
                    href="#how-it-works" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-[#00FF66] transition-colors py-1"
                  >
                    How It Works
                  </a>
                  <a 
                    href="#skills" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-[#00FF66] transition-colors py-1"
                  >
                    Skills
                  </a>
                  <a 
                    href="#mentors" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-[#00FF66] transition-colors py-1"
                  >
                    Mentors
                  </a>
                  <a 
                    href="#jobs" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-[#00FF66] transition-colors py-1"
                  >
                    Jobs
                  </a>
                  <a 
                    href="#internships" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-[#00FF66] transition-colors py-1"
                  >
                    Internships
                  </a>
                  <button 
                    onClick={() => { setMobileMenuOpen(false); onOpenNirvana(); }}
                    className="hover:text-[#00FF66] transition-colors py-1 text-left flex items-center justify-between cursor-pointer"
                  >
                    <span>NIRVANA AI GUIDE</span>
                    <Sparkles className="h-4 w-4 text-[#00FF66]" />
                  </button>
                </nav>


                <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => { setMobileMenuOpen(false); onOpenRoleModal(); }}
                    className="w-full py-2.5 rounded-lg border border-slate-700 text-slate-300 font-rajdhani font-bold text-xs uppercase"
                  >
                    LOGIN
                  </button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); onOpenRoleModal(); }}
                    className="w-full py-2.5 rounded-lg bg-[#00FF66] text-black font-rajdhani font-bold text-xs uppercase"
                  >
                    GET STARTED
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <div className="text-xs font-mono text-slate-400">
                  Logged in as: <span className="text-white font-bold">{currentUser.name}</span> ({currentUser.role})
                </div>
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenRoleModal(); }}
                  className="w-full py-2.5 rounded-lg border border-[#00FF66]/40 text-[#00FF66] font-rajdhani font-bold text-xs uppercase"
                >
                  SWITCH ROLE
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); logout(); }}
                  className="w-full py-2.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-400 font-rajdhani font-bold text-xs uppercase"
                >
                  LOGOUT
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="hud-corner max-w-md w-full rounded-2xl border border-red-500/40 bg-[#120905] p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400 mb-3">
              <Shield className="h-6 w-6" />
              <h3 className="hud-heading text-lg font-bold">RESET TO ZERO DATA?</h3>
            </div>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              This action strictly wipes all locally registered students, recruiters, mentors, posted opportunities, and applications, returning SkillBridge to its pristine <strong className="text-[#00FF66]">COMPLETELY EMPTY ZERO-DATA</strong> baseline as required.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-lg border border-slate-700 font-rajdhani font-bold text-xs uppercase text-slate-400 hover:text-white"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  setShowResetConfirm(false);
                  clearAllSystemData();
                }}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-rajdhani font-bold text-xs uppercase shadow-[0_0_15px_rgba(239,68,68,0.4)]"
              >
                CONFIRM WIPE
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
