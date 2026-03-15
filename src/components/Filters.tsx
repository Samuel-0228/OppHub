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
    <div className="space-y-8">
      <div>
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
          <Filter className="w-3 h-3" /> Categories
        </h4>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-black text-white shadow-lg shadow-black/10 scale-105'
                  : 'bg-white text-slate-600 border border-black/5 hover:border-black/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
          <Globe className="w-3 h-3" /> Location
        </h4>
        <button
          onClick={() => setIsRemoteOnly(!isRemoteOnly)}
          className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
            isRemoteOnly ? 'bg-black border-black text-white' : 'bg-white border-black/5 text-slate-600'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
              isRemoteOnly ? 'bg-white border-white' : 'bg-slate-100 border-black/10'
            }`}>
              {isRemoteOnly && <Check className="w-3 h-3 text-black" />}
            </div>
            <span className="text-sm font-bold">Remote Only</span>
          </div>
          <Zap className={`w-4 h-4 ${isRemoteOnly ? 'text-amber-400' : 'text-slate-300'}`} />
        </button>
      </div>

      <div>
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
          <Clock className="w-3 h-3" /> Sort By
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
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                sortBy === option.id ? 'bg-black border-black text-white' : 'bg-white border-black/5 text-slate-600'
              }`}
            >
              <span className="text-sm font-bold">{option.label}</span>
              {sortBy === option.id && <div className="w-2 h-2 bg-white rounded-full" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
