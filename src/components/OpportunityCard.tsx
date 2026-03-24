import React from 'react';
import { Opportunity } from '../types';
import { Calendar, MapPin, Building2, ArrowRight, Bookmark, BookmarkCheck } from 'lucide-react';
import { formatDistanceToNow, isAfter, subDays, isBefore, addDays } from 'date-fns';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative curvetree-card cursor-pointer flex flex-col h-full"
      onClick={() => onClick?.(opportunity.id)}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center border border-border group-hover:border-primary transition-colors">
          <Building2 className="w-7 h-7 text-muted group-hover:text-primary transition-colors" />
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBookmark?.(opportunity.id);
          }}
          className="p-2.5 hover:bg-secondary rounded-xl transition-all active:scale-90"
        >
          {isBookmarked ? (
            <BookmarkCheck className="w-5 h-5 text-primary fill-primary" />
          ) : (
            <Bookmark className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
          )}
        </button>
      </div>

      <div className="flex-grow">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-lg">
            {opportunity.category}
          </span>
          {isNew && (
            <span className="px-3 py-1 bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-widest rounded-lg">
              New
            </span>
          )}
          {isClosingSoon && (
            <span className="px-3 py-1 bg-red-500/10 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded-lg">
              Closing Soon
            </span>
          )}
        </div>

        <h3 className="text-xl font-display font-bold text-foreground mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
          {opportunity.title}
        </h3>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          {opportunity.organization && (
            <div className="flex items-center text-sm font-semibold text-muted">
              <Building2 className="w-4 h-4 mr-1.5 opacity-50" />
              {opportunity.organization}
            </div>
          )}
          {opportunity.location && (
            <div className="flex items-center text-sm font-semibold text-muted">
              <MapPin className="w-4 h-4 mr-1.5 opacity-50" />
              {opportunity.location}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-border mt-auto">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Deadline</span>
          <span className={cn("text-sm font-bold", isExpired ? "text-red-500" : "text-foreground")}>
            {opportunity.deadline ? new Date(opportunity.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Open'}
          </span>
        </div>
        <button className="btn-primary !px-5 !py-2.5 text-xs">
          Apply Now
        </button>
      </div>
    </motion.div>
  );
};
