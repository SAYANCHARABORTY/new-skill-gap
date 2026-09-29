import React from 'react';
import { UserRole } from '../../types';
import { StorageService } from '../../services/storage';
import { 
  Sparkles, 
  ArrowRight, 
  GraduationCap, 
  Briefcase, 
  Building, 
  Compass, 
  CheckCircle2, 
  Cpu, 
  Code2, 
  Layers, 
  ShieldCheck, 
  Search,
  ExternalLink
} from 'lucide-react';

interface LandingPageProps {
  onOpenRoleModal: () => void;
  onOpenNirvana: () => void;
  onSelectRole: (role: UserRole) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenRoleModal,
  onOpenNirvana,
  onSelectRole,
}) => {
  // Real counts strictly from StorageService (0 at launch!)
  const studentsCount = StorageService.getStudents().length;
  const mentorsCount = StorageService.getMentors().length;
  const recruitersCount = StorageService.getRecruiters().length;
  const oppsCount = StorageService.getOpportunities().length;

  return (
    <div id="home" className="w-full text-slate-100 overflow-x-hidden selection:bg-[#00FF66] selection:text-black">
      
      {/* ============================================================ */}
      {/* 1. CINEMATIC FULLSCREEN HERO SECTION (100vw × 100vh / 100dvh) */}
      {/* ============================================================ */}
      <section className="relative w-screen min-h-screen min-h-[100dvh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-12 pt-20 pb-12">
        
        {/* ========================================== */}
        {/* LAYER 0: SkillBridge Responsive Artwork     */}
        {/* (Crops cleanly via object-cover across     */}
        {/*  16:9, Ultrawide, Tablet, & Mobile)        */}
        {/* ========================================== */}
        <div className="absolute inset-0 z-0 w-full h-full pointer-events-none overflow-hidden">
          <img
            src="/assets/skillbridge-hero.png"
            alt="SkillBridge Cybernetic Nexus"
            className="w-full h-full object-cover object-[50%_35%] sm:object-center filter brightness-[0.38] contrast-[1.15] scale-[1.02] transform transition-transform duration-1000"
          />
        </div>

        {/* ========================================== */}
        {/* LAYER 1: Dark Cinematic Overlays            */}
        {/* (#000000, #050505, #0A0A08, Chocolate)     */}
        {/* ========================================== */}
        <div className="absolute inset-0 z-1 pointer-events-none bg-gradient-to-t from-[#050505] via-[#050505]/50 to-[#000000]/70" />
        <div className="absolute inset-0 z-1 pointer-events-none bg-gradient-to-r from-[#050505]/90 via-transparent to-[#050505]/90" />
        {/* Radial Dark Chocolate vignette aura */}
        <div className="absolute inset-0 z-1 pointer-events-none bg-[radial-gradient(circle_at_50%_35%,rgba(22,12,7,0.45)_0%,rgba(5,5,5,0.92)_85%)]" />

        {/* ========================================== */}
        {/* LAYER 2: Subtle Green Glow & HUD Effects   */}
        {/* ========================================== */}
        <div className="absolute inset-0 z-2 pointer-events-none cyber-grid opacity-25" />
        <div className="absolute inset-0 z-2 pointer-events-none scanlines opacity-20" />
        {/* Ambient Neon Green Aura behind Hero */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] max-w-[90vw] h-[350px] bg-[radial-gradient(ellipse,rgba(0,255,102,0.08)_0%,transparent_70%)] blur-3xl pointer-events-none z-2" />

        {/* HUD Technical Corner Coordinates */}
        <div className="absolute top-24 left-6 sm:left-10 font-mono text-[10px] text-[#00FF66]/70 hidden md:block tracking-widest z-10 select-none">
          <div>LOC // LAT: 18.9224° N • LNG: 72.8347° E</div>
          <div>SECTOR // ACADEMY_SPHERE_NEXUS</div>
          <div className="text-slate-500">SYS_ID // 0xSB_ZERO_MOCK_PROTOTYPE</div>
        </div>

        <div className="absolute top-24 right-6 sm:right-10 font-mono text-[10px] text-[#dfa260]/80 hidden md:block tracking-widest text-right z-10 select-none">
          <div>TELEMETRY // LIVE_GRID_ACTIVE</div>
          <div>STATUS // 100% EMPTY DATA BASELINE</div>
          <div className="text-slate-500">AI_CORE // GROQ LLAMA-3.3-70B</div>
        </div>

        {/* ========================================== */}
        {/* LAYER 4: Hero Content with Motion Sequence */}
        {/* (EYEBROW -> TITLE -> DESC -> CTA)          */}
        {/* ========================================== */}
        <div className="relative z-10 w-full max-w-5xl mx-auto text-center flex flex-col items-center justify-center my-auto">
          
          {/* Eyebrow: "BRIDGING EDUCATION × INDUSTRY" */}
          <div className="motion-eyebrow inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#00FF66]/40 bg-black/80 backdrop-blur-md mb-6 shadow-[0_0_20px_rgba(0,255,102,0.2)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF66] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF66]"></span>
            </span>
            <span className="font-mono text-xs sm:text-xs font-bold text-[#00FF66] tracking-widest uppercase">
              BRIDGING EDUCATION × INDUSTRY
            </span>
          </div>

          {/* Main Title: SKILLBRIDGE (Cinematic typography + metallic + glow + mask entrance) */}
          <h1 className="motion-title hud-heading text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-wider mb-3 leading-none select-none">
            <span className="metallic-text">SKILL</span>
            <span className="text-[#00FF66] neon-text-glow">BRIDGE</span>
          </h1>

          {/* Subheading: "Bridge Your Skills to Your Career" */}
          <div className="motion-title font-orbitron text-lg sm:text-2xl md:text-3xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#00FF66] via-[#E2E8F0] to-[#dfa260] mb-3">
            "Bridge Your Skills to Your Career"
          </div>

          {/* Supporting text: "Learn. Practice. Get Guidance. Get Placed." */}
          <div className="motion-desc font-rajdhani text-sm sm:text-base font-semibold uppercase tracking-widest text-[#00FF66] mb-3">
            Learn. Practice. Get Guidance. Get Placed.
          </div>

          {/* Description */}
          <p className="motion-desc max-w-2xl mx-auto text-sm sm:text-base text-slate-300 font-sans font-light leading-relaxed mb-8 sm:mb-10 px-4">
            Connect academic learning with practical skills, mentors and real industry opportunities in an AI-powered telemetry ecosystem.
          </p>

          {/* CTAs: GET STARTED / EXPLORE SKILLBRIDGE */}
          <div className="motion-cta flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-md sm:max-w-none">
            <button
              onClick={onOpenRoleModal}
              className="w-full sm:w-auto px-8 sm:px-10 py-4 rounded-xl font-rajdhani font-bold text-sm sm:text-base uppercase tracking-widest text-black bg-[#00FF66] hover:bg-[#05DF72] transition-all duration-300 neon-glow-btn transform hover:-translate-y-1 flex items-center justify-center gap-3 cursor-pointer shadow-lg"
            >
              <span>GET STARTED</span>
              <ArrowRight className="h-5 w-5" />
            </button>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-8 sm:px-10 py-4 rounded-xl font-rajdhani font-bold text-sm sm:text-base uppercase tracking-widest text-white border border-[#c48746]/50 bg-[#170e08]/60 hover:bg-[#22120b] hover:border-[#dfa260] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer backdrop-blur-md"
            >
              <span>EXPLORE SKILLBRIDGE</span>
            </a>
          </div>


          {/* Live System Telemetry Status (STRICTLY REAL 0 COUNTERS) */}
          <div className="motion-cta mt-12 sm:mt-16 pt-6 border-t border-white/10 w-full max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 px-2">
            <div className="hud-corner p-3 sm:p-4 rounded-xl bg-black/60 border border-slate-800/80 backdrop-blur-md">
              <div className="font-mono text-xl sm:text-2xl font-bold text-[#00FF66]">{studentsCount}</div>
              <div className="font-mono text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wider mt-0.5">Students Registered</div>
            </div>
            <div className="hud-corner p-3 sm:p-4 rounded-xl bg-black/60 border border-slate-800/80 backdrop-blur-md">
              <div className="font-mono text-xl sm:text-2xl font-bold text-purple-400">{mentorsCount}</div>
              <div className="font-mono text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wider mt-0.5">Verified Mentors</div>
            </div>
            <div className="hud-corner p-3 sm:p-4 rounded-xl bg-black/60 border border-slate-800/80 backdrop-blur-md">
              <div className="font-mono text-xl sm:text-2xl font-bold text-cyan-400">{recruitersCount}</div>
              <div className="font-mono text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wider mt-0.5">Industry Recruiters</div>
            </div>
            <div className="hud-corner p-3 sm:p-4 rounded-xl bg-black/60 border border-slate-800/80 backdrop-blur-md">
              <div className="font-mono text-xl sm:text-2xl font-bold text-[#dfa260]">{oppsCount}</div>
              <div className="font-mono text-[10px] sm:text-[11px] text-slate-400 uppercase tracking-wider mt-0.5">Live Requisitions</div>
            </div>
          </div>

        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
          <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400">SCROLL DOWN</span>
          <div className="w-4 h-7 rounded-full border border-slate-600 flex items-start justify-center p-1">
            <div className="w-1 h-2 rounded-full bg-[#00FF66] animate-bounce" />
          </div>
        </div>

      </section>

      {/* ============================================================ */}
      {/* 2. HOW IT WORKS: END-TO-END PIPELINE                         */}
      {/* ============================================================ */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto border-t border-[#00FF66]/15">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00FF66]/30 bg-[#00FF66]/10 font-mono text-[10px] text-[#00FF66] uppercase mb-3">
            PIPELINE ARCHITECTURE
          </div>
          <h2 className="hud-heading text-3xl sm:text-4xl md:text-5xl font-black text-white">
            HOW SKILLBRIDGE WORKS
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3 font-sans">
            A continuous loop bridging academic foundations with live corporate hiring demands.
          </p>
        </div>

        {/* 7-Stage Talent Pipeline Sequence */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 sm:gap-4 relative items-stretch">
          {[
            { step: '01', title: 'STUDENT', desc: 'Register verified academic & tech profiles.', icon: GraduationCap, color: '#00FF66' },
            { step: '02', title: 'SKILLS', desc: 'Add tech proficiencies with real rating scales.', icon: Code2, color: '#00FF66' },
            { step: '03', title: 'PRACTICE', desc: 'Build hands-on tasks and solve industry briefs.', icon: Cpu, color: '#38bdf8' },
            { step: '04', title: 'NIRVANA', desc: 'Groq AI clarifies gaps and crafts roadmaps.', icon: Sparkles, color: '#00FF66' },
            { step: '05', title: 'MENTORS', desc: '1-on-1 guidance via verified industry leads.', icon: Compass, color: '#c084fc' },
            { step: '06', title: 'INDUSTRY', desc: 'Recruiters post real verified job demands.', icon: Briefcase, color: '#dfa260' },
            { step: '07', title: 'PLACED', desc: 'Match verified skills with real openings.', icon: CheckCircle2, color: '#00FF66' }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="hud-corner relative rounded-xl border border-slate-800 bg-[#0c0f0d]/90 p-4 sm:p-5 flex flex-col justify-between hover:border-[#00FF66]/50 transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-slate-500 group-hover:text-white transition-colors">{item.step}</span>
                    <Icon className="h-5 w-5" style={{ color: item.color }} />
                  </div>
                  <h4 className="hud-heading text-sm font-bold text-white mb-1.5 group-hover:text-[#00FF66] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-4 pt-2 border-t border-white/5 font-mono text-[9px] text-slate-600">
                  NODE // {item.step}
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* ============================================================ */}
      {/* 3. ROLES DEEP-DIVE: SKILLS, MENTORS, JOBS & RECRUITERS       */}
      {/* ============================================================ */}
      <section id="skills" className="py-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto border-t border-slate-800/80">
        
        {/* STUDENTS / SKILLS */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-28">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00FF66]/30 bg-[#00FF66]/10 font-mono text-[10px] text-[#00FF66] uppercase mb-4">
              ROLE TELEMETRY // 01
            </div>
            <h3 className="hud-heading text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
              FOR STUDENTS
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-light">
              Stop guessing what recruiters want. SkillBridge benchmarks your exact registered skills against active hiring requisitions and calculates your precise Skill Gap.
            </p>
            <ul className="space-y-3 font-sans text-sm text-slate-300 mb-8">
              <li className="flex items-center gap-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00FF66]/20 text-[#00FF66] text-xs font-mono">✓</span>
                Real-time Skill Gap Analysis against registered corporate posts
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00FF66]/20 text-[#00FF66] text-xs font-mono">✓</span>
                Direct mentor reach-out via WhatsApp, Telegram, & Instagram
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#00FF66]/20 text-[#00FF66] text-xs font-mono">✓</span>
                Integrated NIRVANA AI Guide answering with your real profile context
              </li>
            </ul>
            <button
              onClick={() => onSelectRole('student')}
              className="px-7 py-3.5 rounded-xl bg-[#00FF66] text-black font-rajdhani font-bold text-xs uppercase tracking-wider hover:bg-[#05DF72] transition-all neon-glow-btn cursor-pointer inline-flex items-center gap-2"
            >
              <span>ENTER AS STUDENT</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="hud-corner rounded-2xl border border-[#00FF66]/30 bg-black/75 p-6 md:p-8 backdrop-blur-xl">
            <div className="font-mono text-xs text-[#00FF66] mb-4 flex items-center justify-between">
              <span>TELEMETRY // REAL_TIME_GAP_ANALYSIS</span>
              <span className="h-2 w-2 rounded-full bg-[#00FF66] animate-pulse" />
            </div>
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-black/80 border border-slate-800">
                <div className="text-slate-500 mb-1">// DYNAMIC SKILL FORMULA</div>
                <div className="text-white">Active Student Skills: <span className="text-[#00FF66]">User Added</span></div>
                <div className="text-white">Recruiter Demands: <span className="text-cyan-400">Live Postings</span></div>
                <div className="text-slate-400 mt-2 text-[11px]">Skill Gap = Student Skills ∩ Market Requirements</div>
              </div>
              <div className="p-3.5 rounded-xl bg-black/80 border border-slate-800">
                <div className="text-slate-500 mb-1">// NIRVANA AI ADVICE</div>
                <div className="text-slate-300">"Personalized learning roadmaps without hallucinating fake credentials."</div>
              </div>
            </div>
          </div>
        </div>

        {/* MENTORS & RECRUITERS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {/* Mentors */}
          <div id="mentors" className="hud-corner rounded-2xl border border-purple-500/30 bg-[#0f0a14]/90 p-6 sm:p-8 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-purple-950/60 border border-purple-500/40 text-purple-400">
                <Compass className="h-6 w-6" />
              </div>
              <div>
                <span className="font-mono text-[10px] text-purple-400 uppercase">ROLE TELEMETRY // 02</span>
                <h3 className="hud-heading text-xl sm:text-2xl font-bold text-white">FOR MENTORS</h3>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-6 font-light">
              Register yourself directly to become discoverable by students seeking your specific skills. Share your real contact channels (WhatsApp, Telegram, Instagram, Portfolio) and conduct sessions on your schedule.
            </p>
            <button
              onClick={() => onSelectRole('mentor')}
              className="px-6 py-3 rounded-lg border border-purple-500/50 text-purple-300 hover:bg-purple-900/30 font-rajdhani font-bold text-xs uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>REGISTER AS MENTOR</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Recruiters / Jobs & Internships */}
          <div id="jobs" className="hud-corner rounded-2xl border border-cyan-500/30 bg-[#071118]/90 p-6 sm:p-8 backdrop-blur-md">
            <span id="internships" className="sr-only">Internships</span>
            <div className="flex items-center gap-3 mb-4">

              <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <span className="font-mono text-[10px] text-cyan-400 uppercase">ROLE TELEMETRY // 03</span>
                <h3 className="hud-heading text-xl sm:text-2xl font-bold text-white">FOR RECRUITERS</h3>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-6 font-light">
              Post verified internships and full-time engineering jobs. Specify mandatory technical skills and immediately receive applications from candidates whose profiles match your tech stack.
            </p>
            <button
              onClick={() => onSelectRole('recruiter')}
              className="px-6 py-3 rounded-lg border border-cyan-500/50 text-cyan-300 hover:bg-cyan-900/30 font-rajdhani font-bold text-xs uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>POST OPPORTUNITY</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* ACADEMIC ADMINS */}
        <div className="hud-corner rounded-2xl border border-[#c48746]/30 bg-[#140c07]/90 p-6 sm:p-10 mb-20 backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Building className="h-5 w-5 text-[#dfa260]" />
                <span className="font-mono text-[10px] text-[#dfa260] uppercase">INSTITUTIONAL GOVERNANCE // 04</span>
              </div>
              <h3 className="hud-heading text-2xl sm:text-3xl font-black text-white">
                FOR ACADEMIC ADMINS & UNIVERSITIES
              </h3>
              <p className="text-sm text-slate-300 max-w-2xl mt-2 font-light leading-relaxed">
                Gain macro-level telemetry on student competencies across your departments. Compare batch skills against current recruiter requisitions to update course syllabi proactively.
              </p>
            </div>
            <button
              onClick={() => onSelectRole('academic')}
              className="px-7 py-3.5 rounded-xl bg-[#c48746] text-black font-rajdhani font-bold text-xs uppercase tracking-wider hover:bg-[#dfa260] transition-all cursor-pointer shrink-0"
            >
              ACCESS ACADEMIC PORTAL →
            </button>
          </div>
        </div>

      </section>

      {/* ============================================================ */}
      {/* 4. ABOUT SECTION                                             */}
      {/* ============================================================ */}
      <section id="about" className="py-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto border-t border-slate-800 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00FF66]/30 bg-[#00FF66]/10 font-mono text-[10px] text-[#00FF66] uppercase mb-4">
            DESIGN THINKING MANIFESTO
          </div>
          <h2 className="hud-heading text-3xl sm:text-4xl font-black text-white mb-6">
            WHY SKILLBRIDGE?
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-light">
            Conventional education platforms are flooded with pre-baked mock datasets, simulated hiring statistics, and generic course recommendations that disconnect students from actual market reality.
          </p>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-10">
            SkillBridge operates on absolute data integrity: <strong className="text-white">Zero mock data</strong>, <strong className="text-white">Zero fake scores</strong>, and <strong className="text-[#00FF66]">100% genuine user-generated connections</strong>.
          </p>

          <button
            onClick={onOpenRoleModal}
            className="px-9 py-4 rounded-xl bg-[#00FF66] text-black font-rajdhani font-bold text-sm uppercase tracking-wider hover:bg-[#05DF72] transition-all neon-glow-btn cursor-pointer inline-flex items-center gap-2"
          >
            <span>JOIN THE SKILLBRIDGE NETWORK</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#00FF66]/20 bg-[#000000] py-8 px-4 text-center font-mono text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            SKILLBRIDGE // LEARN × PRACTICE × GET PLACED
          </div>
          <div>
            POWERED BY NIRVANA AI (GROQ ENGINE)
          </div>
          <div>
            PROTOTYPE v1.2 // ZERO MOCK DATA // 100VW RESPONSIVE
          </div>
        </div>
      </footer>

    </div>
  );
};
