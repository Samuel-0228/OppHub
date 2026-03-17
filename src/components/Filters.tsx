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
    <div className="space-y-12">
      <div>
        <h4 className="text-[10px] font-display font-bold uppercase tracking-[0.3em] text-ink/30 mb-6 flex items-center gap-2">
          Categories
        </h4>
        <div className="flex flex-col gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`group flex items-center justify-between px-6 py-4 rounded-2xl text-sm font-display font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-ink text-paper'
                  : 'bg-transparent text-ink/60 hover:bg-ink/5'
              }`}
            >
              <span className="tracking-wide">{cat}</span>
              {selectedCategory === cat && <div className="w-1.5 h-1.5 bg-accent rounded-full" />}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-[10px] font-display font-bold uppercase tracking-[0.3em] text-ink/30 mb-6 flex items-center gap-2">
          Location
        </h4>
        <button
          onClick={() => setIsRemoteOnly(!isRemoteOnly)}
          className={`w-full flex items-center justify-between px-6 py-5 rounded-2xl transition-all ${
            isRemoteOnly ? 'bg-ink text-paper' : 'bg-transparent text-ink/60 hover:bg-ink/5 border border-ink/5'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
              isRemoteOnly ? 'bg-accent border-accent' : 'bg-transparent border-ink/20'
            }`}>
              {isRemoteOnly && <Check className="w-3 h-3 text-ink" />}
            </div>
            <span className="text-sm font-display font-bold uppercase tracking-widest">Remote Only</span>
          </div>
          <Globe className={`w-4 h-4 ${isRemoteOnly ? 'text-accent' : 'text-ink/20'}`} />
        </button>
      </div>

      <div>
        <h4 className="text-[10px] font-display font-bold uppercase tracking-[0.3em] text-ink/30 mb-6 flex items-center gap-2">
          Sort By
        </h4>
        <div className="grid grid-cols-1 gap-2">
          {[
            { id: 'newest', label: 'Newest First' },
            { id: 'deadline', label: 'Deadline Soon' },
            { id: 'views', label: 'Most Viewed' }
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => setSortBy(option.id as any)}
              className={`flex items-center justify-between px-6 py-5 rounded-2xl transition-all ${
                sortBy === option.id ? 'bg-ink text-paper' : 'bg-transparent text-ink/60 hover:bg-ink/5 border border-ink/5'
              }`}
            >
              <span className="text-sm font-display font-bold uppercase tracking-widest">{option.label}</span>
              {sortBy === option.id && <div className="w-2 h-2 bg-accent rounded-full" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
