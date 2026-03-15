import React from 'react';
import { Filter, Globe, Laptop, Building, GraduationCap, Users, Trophy, Radio, Briefcase } from 'lucide-react';
import { Category } from '../types';

interface FiltersProps {
  selectedCategory: Category | 'All';
  setSelectedCategory: (cat: Category | 'All') => void;
  selectedField: string;
  setSelectedField: (field: string) => void;
  isRemote: boolean | null;
  setIsRemote: (val: boolean | null) => void;
}

const categories: { label: Category | 'All'; icon: any }[] = [
  { label: 'All', icon: Globe },
  { label: 'Internships', icon: Briefcase },
  { label: 'Events', icon: Users },
  { label: 'Competitions', icon: Trophy },
  { label: 'Scholarships', icon: GraduationCap },
  { label: 'Jobs', icon: Briefcase },
  { label: 'Fellowships', icon: Radio },
  { label: 'Conferences', icon: Users },
  { label: 'Grants', icon: Trophy },
];

export const Filters: React.FC<FiltersProps> = ({
  selectedCategory,
  setSelectedCategory,
  selectedField,
  setSelectedField,
  isRemote,
  setIsRemote
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 sticky top-24 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filters
        </h3>
        <button 
          onClick={() => {
            setSelectedCategory('All');
            setSelectedField('All');
            setIsRemote(null);
          }}
          className="text-xs text-indigo-600 font-semibold hover:underline"
        >
          Reset
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">Category</label>
          <div className="space-y-1">
            {categories.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setSelectedCategory(cat.label)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                  selectedCategory === cat.label 
                    ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm border-indigo-100 border' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <cat.icon className={`w-4 h-4 ${selectedCategory === cat.label ? 'text-indigo-600' : 'text-slate-400'}`} />
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">Field of Study</label>
          <select 
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
          >
            <option value="All">All Fields</option>
            <option value="Tech">Technology</option>
            <option value="Business">Business</option>
            <option value="Engineering">Engineering</option>
            <option value="Research">Research</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">Location Type</label>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsRemote(true)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                isRemote === true 
                  ? 'bg-indigo-600 border-indigo-600 text-white' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              Remote
            </button>
            <button 
              onClick={() => setIsRemote(false)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                isRemote === false 
                  ? 'bg-indigo-600 border-indigo-600 text-white' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              On-site
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};