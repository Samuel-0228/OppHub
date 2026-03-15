import React from 'react';
import { Category } from '../types';
import { cn } from '../lib/utils';
import { Briefcase, GraduationCap, Trophy, Users, Layout, Globe, Cpu, Target, Rocket } from 'lucide-react';

interface FiltersProps {
  selectedCategory: Category | 'All';
  setSelectedCategory: (category: Category | 'All') => void;
  selectedField: string;
  setSelectedField: (field: string) => void;
  isRemote: boolean | null;
  setIsRemote: (isRemote: boolean | null) => void;
}

export const Filters: React.FC<FiltersProps> = ({
  selectedCategory,
  setSelectedCategory,
  selectedField,
  setSelectedField,
  isRemote,
  setIsRemote,
}) => {
  const categories: { label: Category | 'All', icon: any }[] = [
    { label: 'All', icon: Layout },
    { label: 'Internships', icon: Briefcase },
    { label: 'Scholarships', icon: GraduationCap },
    { label: 'Events', icon: Trophy },
    { label: 'Jobs', icon: Target },
  ];

  const fields = ['All', 'Technology', 'Medicine', 'Art', 'Education', 'Business', 'Law'];

  return (
    <div className="space-y-10">
      <div>
        <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground mb-6 flex items-center gap-2">
           Categories
        </h4>
        <div className="grid gap-2">
          {categories.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => setSelectedCategory(label)}
              className={cn(
                "group flex items-center gap-4 w-full p-4 rounded-2xl transition-all duration-500 border-2",
                selectedCategory === label
                  ? "bg-primary/5 border-primary/20 text-primary shadow-lg shadow-primary/5"
                  : "bg-transparent border-transparent text-muted-foreground hover:bg-secondary/50"
              )}
            >
              <div className={cn(
                "p-2.5 rounded-xl transition-all duration-500",
                selectedCategory === label ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground group-hover:bg-muted group-hover:text-foreground"
              )}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm tracking-tight">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground mb-6">
          Field of Interest
        </h4>
        <div className="flex flex-wrap gap-2">
          {fields.map(field => (
            <button
              key={field}
              onClick={() => setSelectedField(field)}
              className={cn(
                "px-5 py-2.5 rounded-full text-xs font-bold transition-all border-2",
                selectedField === field
                  ? "bg-primary text-primary-foreground border-primary shadow-xl shadow-primary/20"
                  : "bg-secondary/50 border-transparent text-muted-foreground hover:border-border hover:bg-secondary"
              )}
            >
              {field}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground mb-6">
          Working Style
        </h4>
        <div className="flex gap-3">
          <button
            onClick={() => setIsRemote(null)}
            className={cn(
              "flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-widest border-2 transition-all",
              isRemote === null ? "bg-primary text-primary-foreground border-primary shadow-lg" : "bg-secondary/50 border-transparent text-muted-foreground"
            )}
          >
            Any
          </button>
          <button
            onClick={() => setIsRemote(true)}
            className={cn(
              "flex-1 py-4 rounded-2xl text-xs font-black uppercase tracking-widest border-2 transition-all",
              isRemote === true ? "bg-primary text-primary-foreground border-primary shadow-lg" : "bg-secondary/50 border-transparent text-muted-foreground"
            )}
          >
            Remote
          </button>
        </div>
      </div>

      <div className="pt-8">
         <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <Rocket className="w-16 h-16" />
            </div>
            <p className="text-xs font-medium text-muted-foreground leading-relaxed mb-4 relative z-10">
               Our AI agents analyze thousands of channels daily to find the best opportunities for you.
            </p>
            <button className="text-xs font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2 hover:gap-3 transition-all">
               Learn more <Globe className="w-3 h-3" />
            </button>
         </div>
      </div>
    </div>
  );
};