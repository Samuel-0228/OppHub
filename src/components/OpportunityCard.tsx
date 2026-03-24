import React from 'react';
import { Opportunity } from '../types';
import { Calendar, Radio, ArrowRight, Bookmark, BookmarkCheck } from 'lucide-react';
import { formatDistanceToNow, isAfter, subDays, isBefore, addDays, format } from 'date-fns';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function excerptFrom(text: string, max = 140) {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  return t.slice(0, max).trim() + '…';
}

interface Props {
  opportunity: Opportunity;
  isBookmarked?: boolean;
  onBookmark?: (id: string) => void;
  onClick?: (id: string) => void;
}

export const OpportunityCard: React.FC<Props> = ({ opportunity, isBookmarked, onBookmark, onClick }) => {
  const deadlineDate = opportunity.deadline ? new Date(opportunity.deadline) : null;
  const isExpired = deadlineDate && isBefore(deadlineDate, new Date());
  const isClosingSoon = deadlineDate && !isExpired && isBefore(deadlineDate, addDays(new Date(), 3));
  const isNew = isAfter(new Date(opportunity.createdAt), subDays(new Date(), 2));
  const sourceLabel = opportunity.sourceChannel?.trim() || 'Telegram';
  const published = format(new Date(opportunity.createdAt), 'MMM d, yyyy');

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
      className="group relative oh-card cursor-pointer flex flex-col h-full overflow-hidden p-0"
      onClick={() => onClick?.(opportunity.id)}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--oh-transition)] pointer-events-none bg-gradient-to-br from-[var(--oh-accent-dim)] via-transparent to-transparent" />

      <div className="relative p-6 md:p-7 flex flex-col flex-1 gap-5">
        <div className="flex justify-between items-start gap-3">
          <div className="flex flex-wrap gap-2">
            <span
              className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md bg-[var(--oh-accent-dim)] text-[var(--oh-accent-bright)] border border-[var(--oh-border)]"
            >
              {opportunity.category}
            </span>
            {isNew && (
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md bg-[var(--oh-success-dim)] text-[var(--oh-success)] border border-[var(--oh-border)]">
                New
              </span>
            )}
            {isClosingSoon && (
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md bg-[var(--oh-warning-dim)] text-[var(--oh-warning)] border border-[var(--oh-border)]">
                Closing Soon
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onBookmark?.(opportunity.id);
            }}
            className="shrink-0 p-2 rounded-[var(--oh-radius)] transition-all duration-[var(--oh-transition)] text-[var(--oh-text-muted)] hover:text-[var(--oh-accent-bright)] hover:bg-[var(--oh-accent-dim)] active:scale-95"
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-5 h-5 text-[var(--oh-accent)] fill-[var(--oh-accent)]/25" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="space-y-3 flex-1 min-h-0">
          <h3
            className="text-xl md:text-[1.35rem] font-bold text-[var(--oh-text)] leading-snug line-clamp-2 group-hover:text-[var(--oh-accent-bright)] transition-colors duration-[var(--oh-transition)]"
            style={{ fontFamily: 'var(--oh-font-display)' }}
          >
            {opportunity.title}
          </h3>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-[var(--oh-text-muted)]">
            <span className="inline-flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-[var(--oh-accent)] opacity-80" />
              {sourceLabel}
            </span>
            <span className="inline-flex items-center gap-1.5 tabular-nums">
              <Calendar className="w-3.5 h-3.5 opacity-70" />
              {published}
            </span>
          </div>

          <p className="text-sm leading-relaxed text-[var(--oh-text-muted)] line-clamp-3">
            {excerptFrom(opportunity.description)}
          </p>
        </div>

        <div className="relative flex items-center justify-between gap-4 pt-5 border-t border-[var(--oh-border)]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--oh-text-subtle)] block mb-1">
              Apply by
            </span>
            <span className={cn('text-sm font-semibold tabular-nums', isExpired ? 'text-[var(--oh-danger)]' : 'text-[var(--oh-text)]')}>
              {opportunity.deadline
                ? new Date(opportunity.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                : 'Open'}
            </span>
          </div>
          <span
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-[var(--oh-surface-glow)] border border-[var(--oh-border)] text-[var(--oh-accent-bright)] transition-all duration-[var(--oh-transition)] group-hover:border-[var(--oh-border-strong)] group-hover:bg-[var(--oh-accent-dim)] group-hover:gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            Read More
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </motion.article>
  );
};
