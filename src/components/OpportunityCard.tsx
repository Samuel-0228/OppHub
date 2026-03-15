import React from 'react';
import { Opportunity } from '../types';
import { Calendar, MapPin, Building2, ExternalLink, Bookmark, Clock, ArrowRight, Zap, Sparkles, Globe, Briefcase } from 'lucide-react';
import { formatDistanceToNow, differenceInDays } from 'date-fns';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Badge, Card } from './ui-elements';
import { cn } from '../lib/utils';

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
    if (daysLeft <= 0) return { label: 'Archive', variant: 'outline' as const };
    if (daysLeft <= 3) return { label: 'Ending soon', variant: 'default' as const };
    return { label: 'Open Now', variant: 'accent' as const };
  };

  const badge = getDeadlineBadge();

  return (
    <Card 
      className="group flex flex-col h-full bg-card hover:bg-card transition-all duration-700 p-4"
    >
      <div className="relative h-64 overflow-hidden rounded-[2.5rem]">
        <img 
          src={opportunity.image || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400&auto=format&fit=crop'} 
          alt={opportunity.title}
          className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
        
        <div className="absolute top-6 left-6 flex gap-2">
          <Badge variant="secondary" className="bg-white/20 backdrop-blur-2xl border-white/20 text-white shadow-xl lowercase lowercase-first tracking-normal text-xs font-bold">
            {opportunity.category}
          </Badge>
        </div>

        <button 
          onClick={(e) => {
            e.preventDefault();
            onBookmark?.(opportunity.id);
            toast.success(isBookmarked ? 'Removed from favorites' : 'Saved to favorites');
          }}
          className={cn(
            "absolute top-6 right-6 p-3.5 rounded-full backdrop-blur-3xl transition-all duration-500 hover:scale-110 active:scale-90",
            isBookmarked 
              ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/30" 
              : "bg-white/10 text-white border border-white/20 hover:bg-white hover:text-black"
          )}
        >
          <Bookmark className={cn("w-5 h-5 transition-colors", isBookmarked ? "fill-current" : "")} />
        </button>

        <div className="absolute bottom-6 left-6 flex items-center gap-2 group/verify">
           <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),1)]" />
           <span className="text-[9px] font-black text-white/90 uppercase tracking-[0.2em] group-hover/verify:text-white transition-colors">
              Verified Intelligence
           </span>
        </div>
      </div>

      <div className="px-6 py-8 flex-1 flex flex-col">
        <div className="flex items-center gap-4 mb-4">
           <span className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.1em] flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            {formatDistanceToNow(new Date(opportunity.postedAt))} ago
          </span>
          <div className="w-1 h-1 rounded-full bg-border" />
          <Badge variant={badge.variant} className="text-[9px] lowercase font-bold tracking-tight px-3 py-1">
            {badge.label}
          </Badge>
        </div>

        <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-6 tracking-tighter leading-tight">
          {opportunity.title}
        </h3>

        <div className="flex items-center gap-6 mb-8">
          <div className="flex items-center gap-2.5 text-muted-foreground group/meta">
            <div className="p-2 bg-secondary rounded-xl transition-colors group-hover/meta:bg-primary/10 group-hover/meta:text-primary">
              <Briefcase className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold truncate max-w-[120px]">{opportunity.organization}</span>
          </div>
          <div className="flex items-center gap-2.5 text-muted-foreground group/meta">
            <div className="p-2 bg-secondary rounded-xl transition-colors group-hover/meta:bg-primary/10 group-hover/meta:text-primary">
              <MapPin className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold">{opportunity.location}</span>
          </div>
        </div>

        <p className="text-base text-muted-foreground line-clamp-2 mb-8 flex-1 leading-relaxed font-medium opacity-80 group-hover:opacity-100 transition-opacity">
          {opportunity.description}
        </p>

        <div className="flex items-center justify-between pt-8 border-t border-border/20 mt-auto">
          <Link 
            to={`/opportunity/${opportunity.id}`}
            className="group/btn flex items-center gap-4"
          >
             <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center transition-all duration-500 group-hover/btn:bg-primary group-hover/btn:text-primary-foreground group-hover/btn:rotate-[-45deg]">
               <ArrowRight className="w-5 h-5" />
            </div>
            <span className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground group-hover/btn:text-foreground transition-colors">
              Details
            </span>
          </Link>
          
          <div className="flex -space-x-3 group/avatars transition-transform hover:translate-x-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-10 h-10 rounded-full border-4 border-card bg-secondary overflow-hidden shadow-lg">
                <img src={`https://i.pravatar.cc/100?u=${opportunity.id}${i}`} alt="avatar" />
              </div>
            ))}
            <div className="w-10 h-10 rounded-full border-4 border-card bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-black shadow-lg">
              +12
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};