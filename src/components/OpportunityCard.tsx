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
      className="group relative bg-white border border-black/5 rounded-2xl p-5 hover:shadow-md transition-all cursor-pointer"
      onClick={() => onClick?.(opportunity.id)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
            {opportunity.category}
          </span>
          {isNew && (
            <span className="px-3 py-1 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
              New
            </span>
          )}
          {isClosingSoon && (
            <span className="px-3 py-1 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
              Deadline Soon
            </span>
          )}
          {isClosingThisWeek && (
            <span className="px-3 py-1 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
              Closing This Week
            </span>
          )}
          {isExpired && (
            <span className="px-3 py-1 bg-slate-400 text-white text-[10px] font-bold uppercase tracking-wider rounded-full">
              Expired
            </span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBookmark?.(opportunity.id);
          }}
          className="p-2 hover:bg-black/5 rounded-full transition-colors"
        >
          {isBookmarked ? (
            <BookmarkCheck className="w-5 h-5 text-black fill-black" />
          ) : (
            <Bookmark className="w-5 h-5 text-black/40 group-hover:text-black" />
          )}
        </button>
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-black transition-colors">
        {opportunity.title}
      </h3>

      <div className="space-y-2 mb-4">
        {opportunity.organization && (
          <div className="flex items-center text-sm text-slate-500">
            <Building2 className="w-4 h-4 mr-2" />
            {opportunity.organization}
          </div>
        )}
        {opportunity.location && (
          <div className="flex items-center text-sm text-slate-500">
            <MapPin className="w-4 h-4 mr-2" />
            {opportunity.location}
          </div>
        )}
        {opportunity.deadline && (
          <div className={cn("flex items-center text-sm", isExpired ? "text-red-400" : "text-slate-500")}>
            <Calendar className="w-4 h-4 mr-2" />
            Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
          </div>
        )}
      </div>

      <p className="text-sm text-slate-600 line-clamp-3 mb-6 leading-relaxed">
        {opportunity.description}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-black/5">
        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">
          Posted {formatDistanceToNow(new Date(opportunity.createdAt))} ago
        </div>
        <div className="flex items-center text-sm font-bold text-black group-hover:translate-x-1 transition-transform">
          View Details <ArrowRight className="w-4 h-4 ml-1" />
        </div>
      </div>
    </motion.div>
  );
};
