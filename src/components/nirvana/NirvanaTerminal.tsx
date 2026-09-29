import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { askNirvana, getGroqApiKey, setGroqApiKey, hasGroqApiKey } from '../../services/groq';
import { StorageService } from '../../services/storage';
import { StudentProfile } from '../../types';
import { 
  Sparkles, 
  Send, 
  X, 
  Key, 
  Terminal, 
  Cpu, 
  AlertCircle, 
  CheckCircle2, 
  RotateCcw,
  Zap,
  HelpCircle
} from 'lucide-react';

interface NirvanaTerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'nirvana';
  text: string;
  timestamp: string;
}

export const NirvanaTerminal: React.FC<NirvanaTerminalProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showKeyConfig, setShowKeyConfig] = useState(false);
  const [customKey, setCustomKey] = useState('');
  const [savedKeySuccess, setSavedKeySuccess] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const studentProfile = currentUser && currentUser.role === 'student' 
    ? (currentUser as StudentProfile) 
    : null;

  // Real skill gap calculation
  const skillGapData = studentProfile 
    ? StorageService.calculateSkillGapForStudent(studentProfile.id)
    : null;

  // Initial welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialGreeting: Message = {
        id: 'init_msg',
        sender: 'nirvana',
        text: studentProfile
          ? `Greetings, ${studentProfile.name}. NIRVANA v2.4 initialized. I have loaded your real academic profile (${studentProfile.degree || 'Degree unspecified'}, ${studentProfile.college || 'College unspecified'}) and registered skills: [${(studentProfile.skills || []).map(s => s.name).join(', ') || 'None registered yet'}]. How can I assist your engineering progression today?`
          : 'NIRVANA v2.4 initialized. No student is currently logged in. Complete your SkillBridge profile so NIRVANA can provide personalized guidance, or ask any general industry skill question.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([initialGreeting]);
      setCustomKey(getGroqApiKey());
    }
  }, [isOpen, studentProfile]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const response = await askNirvana(
        textToSend.trim(),
        messages.map(m => ({ sender: m.sender, text: m.text })),
        {
          studentProfile,
          activeSkillGaps: skillGapData?.gapItems,
          latestAnalysis: studentProfile?.latestAnalysis
        }
      );


      const nirvanaMsg: Message = {
        id: 'nirv_' + Date.now(),
        sender: 'nirvana',
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, nirvanaMsg]);
    } catch (e: unknown) {
      const err = e instanceof Error ? e.message : 'Unknown link error';
      setMessages(prev => [
        ...prev,
        {
          id: 'err_' + Date.now(),
          sender: 'nirvana',
          text: `Neural telemetry error: ${err}. Please check your Groq API configuration.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    setGroqApiKey(customKey);
    setSavedKeySuccess(true);
    setTimeout(() => {
      setSavedKeySuccess(false);
      setShowKeyConfig(false);
    }, 1200);
  };

  const promptChips = [
    'Analyze my current skill gap against live industry postings',
    'Generate a 90-day learning roadmap for my target career',
    'What real-world projects should I build to bridge my gap?',
    'Give me 5 technical interview questions for my skills'
  ];

  const hasKey = hasGroqApiKey();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-2xl">
      <div className="hud-corner relative flex flex-col w-full max-w-4xl h-[88vh] rounded-2xl border border-[#00FF66]/40 bg-[#090b0a] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-[#00FF66]/20 bg-[#060807] px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black border border-[#00FF66] shadow-[0_0_12px_rgba(0,255,102,0.3)]">
              <Sparkles className="h-5 w-5 text-[#00FF66] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="hud-heading text-sm sm:text-base font-bold text-white tracking-wide">
                  NIRVANA // AI GUIDE
                </span>
                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#00FF66]/10 border border-[#00FF66]/30 text-[#00FF66]">
                  GROQ ENGINE (LLAMA-3.3-70B)
                </span>
              </div>
              <div className="font-mono text-[10px] text-slate-400">
                {studentProfile ? `LINKED CONTEXT: ${studentProfile.name} (${studentProfile.targetCareer || 'Career Unset'})` : 'CONTEXT: GENERAL (UNAUTHENTICATED)'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowKeyConfig(!showKeyConfig)}
              className={`p-2 rounded-lg border text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                hasKey 
                  ? 'border-slate-700 bg-slate-900/60 text-slate-300 hover:text-white' 
                  : 'border-amber-500/50 bg-amber-950/30 text-amber-300 animate-pulse'
              }`}
              title="Configure Groq API Key"
            >
              <Key className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{hasKey ? 'GROQ KEY CONFIGURED' : 'ADD GROQ KEY'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* API Key Drawer (if requested or missing) */}
        {showKeyConfig && (
          <div className="p-4 border-b border-[#00FF66]/20 bg-[#120905] text-xs">
            <form onSubmit={handleSaveApiKey} className="flex flex-col sm:flex-row items-center gap-3">
              <div className="w-full sm:flex-1">
                <label className="block font-mono text-[10px] text-slate-400 mb-1 uppercase">
                  Groq API Key (Stored in session / local storage for current prototype):
                </label>
                <input
                  type="password"
                  value={customKey}
                  onChange={e => setCustomKey(e.target.value)}
                  placeholder="gsk_..."
                  className="w-full px-3 py-1.5 rounded-lg bg-black border border-slate-700 font-mono text-white text-xs focus:outline-none focus:border-[#00FF66]"
                />
              </div>
              <div className="flex items-center gap-2 mt-2 sm:mt-5 self-end">
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#00FF66] text-black font-rajdhani font-bold text-xs uppercase cursor-pointer"
                >
                  SAVE KEY
                </button>
                <button
                  type="button"
                  onClick={() => setShowKeyConfig(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 font-rajdhani text-xs uppercase hover:text-white cursor-pointer"
                >
                  CLOSE
                </button>
              </div>
            </form>
            {savedKeySuccess && (
              <p className="font-mono text-[11px] text-[#00FF66] mt-2 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Groq API Key verified and saved.
              </p>
            )}
          </div>
        )}

        {/* Telemetry Warning if API Key is not set */}
        {!hasKey && !showKeyConfig && (
          <div className="p-2.5 bg-amber-950/40 border-b border-amber-500/30 px-6 flex items-center justify-between text-xs text-amber-300">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
              <span>Groq API Key is not configured yet. Add your key to activate live NIRVANA AI responses.</span>
            </div>
            <button
              onClick={() => setShowKeyConfig(true)}
              className="underline font-bold hover:text-white cursor-pointer"
            >
              Configure Key
            </button>
          </div>
        )}

        {/* Chat History Box */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 font-sans text-sm">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black border border-[#00FF66]/50 shadow-[0_0_10px_rgba(0,255,102,0.2)] shrink-0 mt-1">
                    <Sparkles className="h-4 w-4 text-[#00FF66]" />
                  </div>
                )}
                
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 leading-relaxed ${
                    isUser
                      ? 'bg-[#00FF66]/10 border border-[#00FF66]/40 text-slate-100 rounded-tr-none'
                      : 'hud-corner bg-[#0f1210] border border-slate-800 text-slate-200 rounded-tl-none shadow-lg'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-1.5 font-mono text-[10px] text-slate-500">
                    <span className={isUser ? 'text-[#00FF66]' : 'text-[#c48746]'}>
                      {isUser ? 'STUDENT' : 'NIRVANA AI'}
                    </span>
                    <span>{m.timestamp}</span>
                  </div>
                  
                  <div className="whitespace-pre-wrap font-sans text-sm">
                    {m.text}
                  </div>
                </div>

                {isUser && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00FF66]/20 border border-[#00FF66] shrink-0 mt-1">
                    <span className="font-mono text-[10px] font-bold text-[#00FF66]">ME</span>
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black border border-[#00FF66]/50 shrink-0">
                <Sparkles className="h-4 w-4 text-[#00FF66] animate-spin" />
              </div>
              <div className="p-3 rounded-xl bg-[#0f1210] border border-slate-800 font-mono text-xs text-[#00FF66] flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#00FF66] animate-ping" />
                <span>NIRVANA synthesising Groq neural telemetry...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 border-t border-slate-800 bg-[#070908] flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="font-mono text-[10px] text-slate-500 shrink-0 uppercase">TELEMETRY PROMPTS:</span>
          {promptChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="px-2.5 py-1 rounded-md bg-black/60 border border-slate-800 hover:border-[#00FF66]/50 text-slate-300 hover:text-white font-mono text-[11px] whitespace-nowrap transition-colors cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-[#00FF66]/20 bg-[#060807]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  studentProfile
                    ? `Ask NIRVANA about ${studentProfile.targetCareer || 'your skills'}...`
                    : 'Ask NIRVANA career or skill questions...'
                }
                className="w-full px-4 py-3 rounded-xl bg-black/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00FF66] font-sans transition-colors"
              />
            </div>
            
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-5 py-3 rounded-xl bg-[#00FF66] hover:bg-[#05DF72] text-black font-rajdhani font-bold text-xs uppercase tracking-wider transition-all neon-glow-btn cursor-pointer disabled:opacity-40 flex items-center gap-2"
            >
              <span>TRANSMIT</span>
              <Send className="h-4 w-4" />
            </button>
          </form>
          
          <div className="flex items-center justify-between mt-2 font-mono text-[10px] text-slate-500">
            <span>SkillBridge NIRVANA does not hallucinate credentials or promise guaranteed placements.</span>
            <span>DATA ENGINE: GROQ / LLAMA 3.3 70B</span>
          </div>
        </div>

      </div>
    </div>
  );
};
