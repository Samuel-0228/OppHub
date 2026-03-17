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
  const isClosingThisWeek = deadlineDate && !isExpired && !isClosingSoon && isBefore(deadlineDate, addDays(new Date(), 7));
  const isNew = isAfter(new Date(opportunity.createdAt), subDays(new Date(), 2));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative sloth-card p-8 cursor-pointer overflow-hidden"
      onClick={() => onClick?.(opportunity.id)}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-wrap gap-2">
          <span className="px-4 py-1.5 bg-ink text-paper text-[10px] font-display font-bold uppercase tracking-widest rounded-full">
            {opportunity.category}
          </span>
          {isNew && (
            <span className="px-4 py-1.5 bg-accent text-ink text-[10px] font-display font-bold uppercase tracking-widest rounded-full">
              New
            </span>
          )}
          {isClosingSoon && (
            <span className="px-4 py-1.5 bg-red-500 text-white text-[10px] font-display font-bold uppercase tracking-widest rounded-full">
              Deadline Soon
            </span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBookmark?.(opportunity.id);
          }}
          className="p-3 hover:bg-ink/5 rounded-full transition-all active:scale-90"
        >
          {isBookmarked ? (
            <BookmarkCheck className="w-5 h-5 text-ink fill-ink" />
          ) : (
            <Bookmark className="w-5 h-5 text-ink/20 group-hover:text-ink transition-colors" />
          )}
        </button>
      </div>

      <h3 className="text-2xl font-serif font-bold text-ink mb-4 line-clamp-2 leading-tight group-hover:text-accent transition-colors">
        {opportunity.title}
      </h3>

      <div className="grid grid-cols-1 gap-3 mb-8">
        {opportunity.organization && (
          <div className="flex items-center text-xs font-display font-medium text-ink/40 uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5 mr-2 opacity-50" />
            {opportunity.organization}
          </div>
        )}
        {opportunity.location && (
          <div className="flex items-center text-xs font-display font-medium text-ink/40 uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 mr-2 opacity-50" />
            {opportunity.location}
          </div>
        )}
        {opportunity.deadline && (
          <div className={cn("flex items-center text-xs font-display font-medium uppercase tracking-wider", isExpired ? "text-red-400" : "text-ink/40")}>
            <Calendar className="w-3.5 h-3.5 mr-2 opacity-50" />
            {new Date(opportunity.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        )}
      </div>

      <p className="text-base text-ink/60 line-clamp-3 mb-10 leading-relaxed font-sans font-light">
        {opportunity.description}
      </p>

      <div className="flex items-center justify-between pt-6 border-t border-ink/5">
        <div className="text-[10px] text-ink/30 uppercase tracking-[0.2em] font-display font-bold">
          {formatDistanceToNow(new Date(opportunity.createdAt))} ago
        </div>
        <div className="flex items-center text-xs font-display font-bold text-ink uppercase tracking-widest group-hover:translate-x-2 transition-transform">
          Details <ArrowRight className="w-4 h-4 ml-2" />
        </div>
      </div>
    </motion.div>
  );
};
