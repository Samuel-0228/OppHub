import React from 'react';
import { Filter, Check, Globe, Clock, Zap } from 'lucide-react';

interface Props {
  isRemoteOnly: boolean;
  setIsRemoteOnly: (val: boolean) => void;
  sortBy: 'newest' | 'deadline' | 'views';
  setSortBy: (val: 'newest' | 'deadline' | 'views') => void;
}

const pillInactive =
  'bg-[var(--oh-surface)] border-[var(--oh-border)] text-[var(--oh-text-muted)] hover:border-[rgba(255,255,255,0.25)]';
const pillActive =
  'bg-[var(--oh-accent-dim)] border-[var(--oh-border-strong)] text-[var(--oh-accent-bright)]';

export const Filters: React.FC<Props> = ({
  isRemoteOnly,
  setIsRemoteOnly,
  sortBy,
  setSortBy,
}) => {
  return (
    <div className="space-y-8">
      <div>
        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--oh-text-subtle)] mb-3">
          Location
        </h4>
        <button
          type="button"
          onClick={() => setIsRemoteOnly(!isRemoteOnly)}
          className={`w-full flex items-center justify-between px-4 py-3.5 rounded-[var(--oh-radius)] transition-all duration-[var(--oh-transition)] border ${
            isRemoteOnly ? pillActive : pillInactive
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                isRemoteOnly ? 'bg-[var(--oh-accent)] border-[var(--oh-accent)]' : 'bg-[var(--oh-elevated)] border-[var(--oh-border)]'
              }`}
            >
              {isRemoteOnly && <Check className="w-3.5 h-3.5 text-[var(--oh-primary-foreground,#041018)]" strokeWidth={3} />}
            </div>
            <span className="text-sm font-semibold text-[var(--oh-text)]">Remote only</span>
          </div>
          <Globe className={`w-4 h-4 ${isRemoteOnly ? 'text-[var(--oh-accent)]' : 'text-[var(--oh-text-subtle)]'}`} />
        </button>
      </div>

      <div>
        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--oh-text-subtle)] mb-3">
          Sort by
        </h4>
        <div className="space-y-2">
          {[
            { id: 'newest' as const, label: 'Newest first', icon: Clock },
            { id: 'deadline' as const, label: 'Deadline soon', icon: Zap },
            { id: 'views' as const, label: 'Most viewed', icon: Filter },
          ].map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setSortBy(option.id)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-[var(--oh-radius)] transition-all duration-[var(--oh-transition)] border ${
                sortBy === option.id ? pillActive : pillInactive
              }`}
            >
              <div className="flex items-center gap-3">
                <option.icon
                  className={`w-4 h-4 ${sortBy === option.id ? 'text-[var(--oh-accent)]' : 'text-[var(--oh-text-subtle)]'}`}
                />
                <span className="text-sm font-semibold text-[var(--oh-text)]">{option.label}</span>
              </div>
              {sortBy === option.id && <div className="w-2 h-2 rounded-full bg-[var(--oh-accent)] shadow-[0_0_10px_var(--oh-accent-glow)]" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
