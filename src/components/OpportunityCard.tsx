import React from 'react';
import { Opportunity } from '../types';
import { Calendar, MapPin, Building2, ExternalLink, Bookmark, Clock, ArrowRight } from 'lucide-react';
import { formatDistanceToNow, differenceInDays } from 'date-fns';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

interface OpportunityCardProps {
  opportunity: Opportunity;
  isBookmarked?: boolean;
  onBookmark?: (id: string) => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({ 
  opportunity, 
  isBookmarked,
  onBookmark 
}) => {
  const deadlineDate = new Date(opportunity.deadline);
  const daysLeft = differenceInDays(deadlineDate, new Date());

  const getDeadlineBadge = () => {
    if (daysLeft <= 0) return { label: 'Expired', color: 'bg-slate-200 text-slate-600' };
    if (daysLeft <= 3) return { label: 'Deadline soon', color: 'bg-red-100 text-red-700 border border-red-200' };
    if (daysLeft <= 7) return { label: 'Closing this week', color: 'bg-amber-100 text-amber-700 border border-amber-200' };
    return { label: 'Active', color: 'bg-emerald-100 text-emerald-700 border border-emerald-200' };
  };

  const badge = getDeadlineBadge();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 overflow-hidden flex flex-col h-full"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={opportunity.image || '/api/placeholder/400/200'} 
          alt={opportunity.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-indigo-600 text-xs font-bold rounded-full shadow-sm">
            {opportunity.category}
          </span>
        </div>
        <button 
          onClick={(e) => {
            e.preventDefault();
            onBookmark?.(opportunity.id);
            toast.success(isBookmarked ? 'Removed from bookmarks' : 'Opportunity saved!');
          }}
          className={`absolute top-4 right-4 p-2 rounded-full shadow-sm backdrop-blur-sm transition-all ${
            isBookmarked 
            ? 'bg-indigo-600 text-white' 
            : 'bg-white/90 text-slate-400 hover:text-indigo-600'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${badge.color}`}>
            {badge.label}
          </span>
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatDistanceToNow(new Date(opportunity.postedAt))} ago
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2">
          {opportunity.title}
        </h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Building2 className="w-4 h-4 text-slate-400" />
            <span className="truncate">{opportunity.organization}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span>{opportunity.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Deadline: {new Date(opportunity.deadline).toLocaleDateString()}</span>
          </div>
        </div>

        <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
          {opportunity.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {opportunity.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-[11px] font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
          <Link 
            to={`/opportunity/${opportunity.id}`}
            className="text-sm font-bold text-slate-900 flex items-center gap-1 group/btn"
          >
            Details
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
          <a 
            href={opportunity.applyLink}
            target="_blank"
            rel="noreferrer"
            className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};