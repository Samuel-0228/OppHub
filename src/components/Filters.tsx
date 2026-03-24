import React from 'react';
import { Category } from '../types';
import { Filter, X, Check, Globe, MapPin, Clock, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  selectedCategory: Category | 'All';
  setSelectedCategory: (cat: Category | 'All') => void;
  isRemoteOnly: boolean;
  setIsRemoteOnly: (val: boolean) => void;
  sortBy: 'newest' | 'deadline' | 'views';
  setSortBy: (val: 'newest' | 'deadline' | 'views') => void;
}

const CATEGORIES: (Category | 'All')[] = [
  'All', 'Internships', 'Events', 'Competitions', 'Scholarships', 'Jobs', 'Fellowships', 'Conferences', 'Grants', 'General'
];

export const Filters: React.FC<Props> = ({
  selectedCategory,
  setSelectedCategory,
  isRemoteOnly,
  setIsRemoteOnly,
  sortBy,
  setSortBy
}) => {
  return (
    <div className="space-y-10">
      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest text-muted mb-4">
          Location
        </h4>
        <button
          onClick={() => setIsRemoteOnly(!isRemoteOnly)}
          className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all border ${
            isRemoteOnly 
              ? 'bg-primary/5 border-primary text-primary' 
              : 'bg-white border-border text-muted hover:border-primary/30'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
              isRemoteOnly ? 'bg-primary border-primary' : 'bg-white border-border'
            }`}>
              {isRemoteOnly && <Check className="w-3.5 h-3.5 text-white" />}
            </div>
            <span className="text-sm font-semibold">Remote Only</span>
          </div>
          <Globe className={`w-4 h-4 ${isRemoteOnly ? 'text-primary' : 'text-muted/40'}`} />
        </button>
      </div>

      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest text-muted mb-4">
          Sort By
        </h4>
        <div className="space-y-2">
          {[
            { id: 'newest', label: 'Newest First', icon: Clock },
            { id: 'deadline', label: 'Deadline Soon', icon: Zap },
            { id: 'views', label: 'Most Viewed', icon: Filter }
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => setSortBy(option.id as any)}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all border ${
                sortBy === option.id 
                  ? 'bg-primary/5 border-primary text-primary' 
                  : 'bg-white border-border text-muted hover:border-primary/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <option.icon className={`w-4 h-4 ${sortBy === option.id ? 'text-primary' : 'text-muted/40'}`} />
                <span className="text-sm font-semibold">{option.label}</span>
              </div>
              {sortBy === option.id && <div className="w-1.5 h-1.5 bg-primary rounded-full" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
