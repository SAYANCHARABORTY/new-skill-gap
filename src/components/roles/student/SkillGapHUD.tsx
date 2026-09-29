import React, { useState } from 'react';
import { StudentProfile, AIAnalysisResult } from '../../../types';
import { analyzeSkillGapWithGroq, hasGroqApiKey } from '../../../services/groq';
import { StorageService } from '../../../services/storage';
import { EmptyState } from '../../common/EmptyState';
import { 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Cpu, 
  ArrowRight, 
  RotateCw, 
  Target, 
  Code2, 
  FolderGit2, 
  Compass, 
  AlertCircle,
  Clock,
  Layers,
  Zap
} from 'lucide-react';

interface SkillGapHUDProps {
  student: StudentProfile;
  onRefreshStudent: () => void;
  onOpenNirvana: () => void;
}

export const SkillGapHUD: React.FC<SkillGapHUDProps> = ({
  student,
  onRefreshStudent,
  onOpenNirvana
}) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Editable target role if student wants to test a different career path on the fly
  const [targetRole, setTargetRole] = useState(student.targetCareer || 'Full Stack Developer');
  const [editingTarget, setEditingTarget] = useState(false);

  // Opportunities for live recruiter requirements
  const opportunities = StorageService.getOpportunities();
  const industryReqs = Array.from(
    new Set(opportunities.flatMap(o => o.requiredSkills || []))
  );

  const currentAnalysis = student.latestAnalysis;

  const handleAnalyzeSkills = async () => {
    if (!student.skills || student.skills.length === 0) {
      setAnalysisError('Please register at least one skill in "Skills" before running AI analysis.');
      return;
    }

    setAnalyzing(true);
    setAnalysisError(null);

    try {
      const res = await analyzeSkillGapWithGroq({
        studentName: student.name,
        targetRole: targetRole || student.targetCareer,
        skills: student.skills.map(s => ({ name: s.name, proficiency: s.proficiency })),
        college: student.college,
        degree: `${student.degree} ${student.branch}`,
        learningInterests: student.learningInterests,
        activeIndustryRequirements: industryReqs
      });

      if (!res.success || !res.data) {
        throw new Error(res.error || 'Failed to generate skill telemetry.');
      }

      // Save to localStorage under student record
      StorageService.saveStudentSkillAnalysis(student.id, res.data);
      if (targetRole !== student.targetCareer) {
        StorageService.updateStudentProfile(student.id, { targetCareer: targetRole });
      }

      onRefreshStudent();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown AI evaluation failure';
      setAnalysisError(msg);
    } finally {
      setAnalyzing(false);
    }
  };

  const hasKey = hasGroqApiKey();

  // Helper for circular progress calculation
  const score = currentAnalysis?.score ?? 0;
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (sc: number) => {
    if (sc >= 75) return '#00FF66'; // Neon Green
    if (sc >= 50) return '#38bdf8'; // Cyan
    if (sc >= 30) return '#dfa260'; // Bronze/Amber
    return '#f87171'; // Red
  };

  const scoreColor = getScoreColor(score);

  return (
    <div className="space-y-6">
      
      {/* Top HUD Telemetry Banner */}
      <div className="hud-corner rounded-2xl border border-[#00FF66]/30 bg-[#090b0a]/90 backdrop-blur-xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] text-[#00FF66] font-bold px-2 py-0.5 rounded bg-[#00FF66]/10 border border-[#00FF66]/30">
                GROQ AI TELEMETRY ENGINE
              </span>
              <span className="font-mono text-xs text-slate-400">MODEL // LLAMA-3.3-70B-VERSATILE</span>
            </div>
            <h2 className="hud-heading text-xl sm:text-2xl font-black text-white flex items-center gap-3">
              <span>SKILL READINESS ANALYSIS</span>
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-400">Target Role:</span>
              {editingTarget ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={targetRole}
                    onChange={e => setTargetRole(e.target.value)}
                    className="px-2.5 py-1 rounded bg-black border border-[#00FF66] text-xs text-white font-mono focus:outline-none"
                  />
                  <button
                    onClick={() => setEditingTarget(false)}
                    className="text-xs px-2 py-1 rounded bg-[#00FF66] text-black font-rajdhani font-bold"
                  >
                    Set
                  </button>
                </div>
              ) : (
                <span 
                  onClick={() => setEditingTarget(true)}
                  className="font-mono text-xs text-[#00FF66] font-bold underline cursor-pointer hover:text-white"
                  title="Click to change target role"
                >
                  {targetRole} (Edit)
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleAnalyzeSkills}
              disabled={analyzing}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#00FF66] hover:bg-[#05DF72] text-black font-rajdhani font-bold text-xs uppercase tracking-wider transition-all neon-glow-btn cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {analyzing ? (
                <>
                  <RotateCw className="h-4 w-4 animate-spin text-black" />
                  <span>ANALYZING YOUR SKILL PROFILE...</span>
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 fill-black" />
                  <span>{currentAnalysis ? 'RE-ANALYZE WITH GROQ AI' : 'ANALYZE MY SKILLS'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Missing API Key Warning */}
        {!hasKey && (
          <div className="mt-4 p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
              <span>Groq API Key is not detected. Please verify your .env file or add the key via NIRVANA AI settings.</span>
            </div>
            <button
              onClick={onOpenNirvana}
              className="underline font-bold text-white cursor-pointer"
            >
              Configure Key
            </button>
          </div>
        )}

        {/* Error Notification */}
        {analysisError && (
          <div className="mt-4 p-4 rounded-xl bg-red-950/50 border border-red-500/40 text-xs text-red-300 space-y-2">
            <div className="flex items-center gap-2 font-bold text-red-400">
              <XCircle className="h-4 w-4 shrink-0" />
              <span>AI ANALYSIS FAILED</span>
            </div>
            <p className="font-sans text-xs text-slate-300">
              {analysisError}
            </p>
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={handleAnalyzeSkills}
                className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white font-rajdhani font-bold text-xs uppercase cursor-pointer"
              >
                TRY AGAIN
              </button>
              <span className="font-mono text-[11px] text-slate-400">CHECK YOUR CONNECTION OR GROQ CONFIGURATION</span>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* LOADING STATE DURING GROQ EXECUTION                          */}
      {/* ============================================================ */}
      {analyzing && (
        <div className="hud-corner rounded-2xl border border-[#00FF66]/50 bg-[#070908] p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00FF66]/10 to-transparent animate-scan" />
          
          <div className="relative z-10 max-w-md mx-auto space-y-4">
            <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-[#00FF66] bg-black shadow-[0_0_30px_rgba(0,255,102,0.3)]">
              <Sparkles className="h-10 w-10 text-[#00FF66] animate-pulse" />
              <div className="absolute -inset-1 rounded-2xl border border-[#00FF66]/40 animate-ping opacity-30" />
            </div>

            <h3 className="hud-heading text-xl font-black text-white tracking-wider">
              ANALYZING YOUR SKILL PROFILE...
            </h3>

            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Groq AI is evaluating your registered skills against the industry requirements for <strong className="text-white">"{targetRole}"</strong> to compute your true Skill Readiness Score.
            </p>

            <div className="flex items-center justify-center gap-2 font-mono text-[11px] text-[#00FF66] pt-2">
              <span className="h-2 w-2 rounded-full bg-[#00FF66] animate-ping" />
              <span>SYNTHESIZING LLAMA-3.3 TELEMETRY...</span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* EMPTY STATE (BEFORE ANY ANALYSIS HAS BEEN RUN)               */}
      {/* ============================================================ */}
      {!analyzing && !currentAnalysis && (
        <EmptyState
          icon={TrendingUp}
          title="NO SKILL DATA AVAILABLE YET"
          description={
            student.skills && student.skills.length > 0
              ? `You have registered ${student.skills.length} skills. Click "ANALYZE MY SKILLS" above to trigger Groq AI and calculate your dynamic 0–100 Skill Readiness Score.`
              : "COMPLETE YOUR PROFILE TO BEGIN. Add your registered skills in the Skills tab, then analyze them against industry standards."
          }
          actionText={student.skills && student.skills.length > 0 ? "ANALYZE MY SKILLS NOW" : "ADD SKILLS FIRST"}
          onAction={student.skills && student.skills.length > 0 ? handleAnalyzeSkills : undefined}
          variant="green"
        />
      )}

      {/* ============================================================ */}
      {/* VISUAL SKILL GAP HUD RESULTS (FROM REAL GROQ AI)             */}
      {/* ============================================================ */}
      {!analyzing && currentAnalysis && (
        <div className="space-y-6">
          
          {/* Top Score & Summary Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Circular Animated HUD Score */}
            <div className="lg:col-span-4 hud-corner rounded-2xl border border-slate-800 bg-[#0c0f0d] p-6 flex flex-col items-center justify-center text-center shadow-lg relative">
              <div className="absolute top-3 left-3 font-mono text-[9px] text-slate-500 uppercase">
                TELEMETRY // SCORE_GAUGE
              </div>

              {/* Circular Gauge SVG */}
              <div className="relative my-4 flex items-center justify-center">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    stroke={scoreColor}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span 
                    className="font-mono text-4xl sm:text-5xl font-black tracking-tight"
                    style={{ color: scoreColor }}
                  >
                    {currentAnalysis.score}
                  </span>
                  <span className="font-mono text-xs text-slate-400">/ 100</span>
                </div>
              </div>

              <h4 className="hud-heading text-sm font-bold text-white tracking-wider">
                SKILL READINESS SCORE
              </h4>
              <p className="font-mono text-[10px] text-slate-400 mt-1">
                Role: <strong className="text-white">{targetRole}</strong>
              </p>
              <div className="font-mono text-[9px] text-slate-500 mt-2">
                Calculated on {new Date(currentAnalysis.analyzedAt).toLocaleDateString()}
              </div>
            </div>

            {/* AI Summary & High-Level Breakdown */}
            <div className="lg:col-span-8 hud-corner rounded-2xl border border-slate-800 bg-[#0c0f0d] p-6 flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#00FF66]" />
                    <span className="hud-heading text-sm font-bold text-white">AI EVALUATION SUMMARY</span>
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30">
                    GROQ LLAMA-3.3-70B
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed mb-6">
                  {currentAnalysis.summary}
                </p>

                {/* 4 Category Count Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-black/60 border border-[#00FF66]/30">
                    <div className="text-[#00FF66] font-bold text-lg">{currentAnalysis.strongSkills.length}</div>
                    <div className="text-[10px] text-slate-400 uppercase">Strong Skills</div>
                  </div>
                  <div className="p-3 rounded-xl bg-black/60 border border-amber-500/30">
                    <div className="text-[#dfa260] font-bold text-lg">{currentAnalysis.moderateSkills.length}</div>
                    <div className="text-[10px] text-slate-400 uppercase">Moderate</div>
                  </div>
                  <div className="p-3 rounded-xl bg-black/60 border border-orange-500/30">
                    <div className="text-orange-400 font-bold text-lg">{currentAnalysis.weakSkills.length}</div>
                    <div className="text-[10px] text-slate-400 uppercase">Needs Depth</div>
                  </div>
                  <div className="p-3 rounded-xl bg-black/60 border border-red-500/30">
                    <div className="text-red-400 font-bold text-lg">{currentAnalysis.missingSkills.length}</div>
                    <div className="text-[10px] text-slate-400 uppercase">Missing Skills</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Want interactive coaching on bridging this deficit?</span>
                <button
                  onClick={onOpenNirvana}
                  className="px-3.5 py-1.5 rounded-lg bg-black border border-[#00FF66] text-[#00FF66] hover:bg-[#00FF66]/10 font-rajdhani font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>CONSULT NIRVANA</span>
                </button>
              </div>
            </div>

          </div>

          {/* ============================================================ */}
          {/* SKILL CLASSIFICATION: STRONG / MODERATE / WEAK / MISSING     */}
          {/* ============================================================ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* STRONG SKILLS */}
            <div className="hud-corner rounded-2xl border border-[#00FF66]/30 bg-[#0a0f0c] p-5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-4 w-4 text-[#00FF66]" />
                <h4 className="hud-heading text-sm font-bold text-white">YOUR STRENGTHS</h4>
              </div>
              {currentAnalysis.strongSkills.length === 0 ? (
                <p className="text-xs text-slate-400 font-sans">No production-ready strengths identified for this specific role yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {currentAnalysis.strongSkills.map((sk, i) => (
                    <span
                      key={i}
                      className="font-mono text-xs px-2.5 py-1 rounded-lg bg-[#00FF66]/15 border border-[#00FF66]/40 text-[#00FF66] flex items-center gap-1.5"
                    >
                      <span>✓</span> {sk}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* MODERATE & WEAK AREAS */}
            <div className="hud-corner rounded-2xl border border-amber-500/30 bg-[#120f0a] p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-[#dfa260]" />
                <h4 className="hud-heading text-sm font-bold text-white">YOUR WEAK & MODERATE AREAS</h4>
              </div>
              <div className="space-y-3">
                {currentAnalysis.moderateSkills.length > 0 && (
                  <div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Moderate Competency:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {currentAnalysis.moderateSkills.map((sk, i) => (
                        <span key={i} className="font-mono text-xs px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/40 text-[#dfa260]">
                          ~ {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {currentAnalysis.weakSkills.length > 0 && (
                  <div>
                    <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Requires Production Depth:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {currentAnalysis.weakSkills.map((sk, i) => (
                        <span key={i} className="font-mono text-xs px-2.5 py-1 rounded-lg bg-orange-500/15 border border-orange-500/40 text-orange-300">
                          ! {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {currentAnalysis.moderateSkills.length === 0 && currentAnalysis.weakSkills.length === 0 && (
                  <p className="text-xs text-slate-400 font-sans">No partial skills identified.</p>
                )}
              </div>
            </div>

            {/* MISSING INDUSTRY SKILLS */}
            <div className="hud-corner rounded-2xl border border-red-500/30 bg-[#140a0a] p-5">
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="h-4 w-4 text-red-400" />
                <h4 className="hud-heading text-sm font-bold text-white">MISSING INDUSTRY SKILLS</h4>
              </div>
              {currentAnalysis.missingSkills.length === 0 ? (
                <p className="text-xs text-slate-400 font-sans">No critical skills missing for this role!</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {currentAnalysis.missingSkills.map((sk, i) => (
                    <span
                      key={i}
                      className="font-mono text-xs px-2.5 py-1 rounded-lg bg-red-500/15 border border-red-500/40 text-red-300 flex items-center gap-1.5"
                    >
                      <span>✗</span> {sk}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* INDUSTRY REQUIREMENTS BENCHMARK */}
            <div className="hud-corner rounded-2xl border border-cyan-500/30 bg-[#071118] p-5">
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-4 w-4 text-cyan-400" />
                <h4 className="hud-heading text-sm font-bold text-white">INDUSTRY REQUIREMENTS</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentAnalysis.industryRequiredSkills.map((sk, i) => (
                  <span
                    key={i}
                    className="font-mono text-xs px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* ============================================================ */}
          {/* RECOMMENDED NEXT STEPS & SUGGESTED PROJECTS                  */}
          {/* ============================================================ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Action Recommendations */}
            <div className="hud-corner rounded-2xl border border-slate-800 bg-[#0c0f0d] p-6 shadow-lg">
              <h4 className="hud-heading text-sm font-bold text-white mb-4 flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-[#00FF66]" />
                <span>RECOMMENDED NEXT STEPS</span>
              </h4>
              <ul className="space-y-2.5 font-sans text-xs text-slate-300">
                {currentAnalysis.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-3 p-2.5 rounded-lg bg-black/40 border border-slate-800">
                    <span className="font-mono text-xs font-bold text-[#00FF66] shrink-0">{i + 1}.</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Projects */}
            <div className="hud-corner rounded-2xl border border-slate-800 bg-[#0c0f0d] p-6 shadow-lg">
              <h4 className="hud-heading text-sm font-bold text-white mb-4 flex items-center gap-2">
                <FolderGit2 className="h-4 w-4 text-cyan-400" />
                <span>RECOMMENDED REAL-WORLD PROJECTS</span>
              </h4>
              <div className="space-y-3 font-sans text-xs text-slate-300">
                {currentAnalysis.projects.map((proj, i) => (
                  <div key={i} className="p-3 rounded-lg bg-black/40 border border-slate-800">
                    <div className="font-bold text-white mb-1 flex items-center gap-2">
                      <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                        PROJECT 0{i + 1}
                      </span>
                      <span>{proj}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ============================================================ */}
          {/* SUGGESTED LEARNING ROADMAP                                   */}
          {/* ============================================================ */}
          <div className="hud-corner rounded-2xl border border-slate-800 bg-[#090b0a] p-6 shadow-lg">
            <h4 className="hud-heading text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Compass className="h-4 w-4 text-purple-400" />
              <span>SUGGESTED LEARNING ROADMAP</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {currentAnalysis.roadmap.map((phase, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-black/60 border border-purple-500/30">
                  <div className="font-mono text-[10px] text-purple-400 uppercase font-bold mb-1">
                    PHASE {i + 1}
                  </div>
                  <div className="text-xs text-slate-200 font-sans">
                    {phase}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
