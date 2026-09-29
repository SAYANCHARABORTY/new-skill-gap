import React from 'react';
import { LucideIcon, ShieldAlert } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  variant?: 'green' | 'chocolate' | 'neutral';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = ShieldAlert,
  title,
  description,
  actionText,
  onAction,
  variant = 'green'
}) => {
  const borderClass = 
    variant === 'green' 
      ? 'border-[#00FF66]/20 bg-[#00FF66]/5' 
      : variant === 'chocolate' 
      ? 'border-[#c48746]/25 bg-[#22120b]/30' 
      : 'border-slate-800 bg-slate-900/40';

  const glowClass = 
    variant === 'green'
      ? 'text-[#00FF66] shadow-[0_0_20px_rgba(0,255,102,0.2)]'
      : 'text-[#dfa260] shadow-[0_0_20px_rgba(223,162,96,0.2)]';

  return (
    <div className={`hud-corner relative rounded-xl border p-8 md:p-12 text-center backdrop-blur-md ${borderClass} transition-all duration-300`}>
      {/* Technical HUD crosshairs */}
      <div className="absolute top-2 right-3 font-mono text-[10px] text-slate-500 uppercase tracking-widest">
        SYSTEM_ID // 0xNULL_STATE
      </div>
      <div className="absolute bottom-2 left-3 font-mono text-[10px] text-slate-600">
        [NO_DATA_STREAM_ACTIVE]
      </div>

      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-black/50 mb-4">
        <Icon className={`h-8 w-8 ${glowClass}`} />
      </div>

      <h3 className="hud-heading text-lg md:text-xl font-bold tracking-wide text-white mb-2">
        {title}
      </h3>
      
      <p className="max-w-md mx-auto text-sm text-slate-400 font-sans leading-relaxed mb-6">
        {description}
      </p>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-rajdhani font-semibold text-sm uppercase tracking-wider text-black bg-[#00FF66] hover:bg-[#05DF72] transition-all duration-200 neon-glow-btn transform hover:-translate-y-0.5 cursor-pointer"
        >
          <span>+</span> {actionText}
        </button>
      )}
    </div>
  );
};
