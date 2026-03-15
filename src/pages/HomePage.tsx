import React, { useState, useMemo } from 'react';
import { useOpportunities } from '../hooks/useOpportunities';
import { OpportunityCard } from '../components/OpportunityCard';
import { OpportunityFilters } from '../components/Filters';
import { Category } from '../types';
import { Send, TrendingUp, Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function HomePage() {
  const { opportunities } = useOpportunities();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category | 'All'>('All');
  const [type, setType] = useState<'All' | 'Remote' | 'Onsite' | 'Hybrid'>('All');
  const [sort, setSort] = useState<'newest' | 'deadline' | 'views'>('newest');

  const filtered = useMemo(() => {
    return opportunities
      .filter(o => o.isApproved)
      .filter(o => {
        const matchesSearch = o.title.toLowerCase().includes(search.toLowerCase()) || 
                             o.organization.toLowerCase().includes(search.toLowerCase());
        const matchesCat = category === 'All' || o.category === category;
        const matchesType = type === 'All' || o.type === type;
        return matchesSearch && matchesCat && matchesType;
      })
      .sort((a, b) => {
        if (sort === 'newest') return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
        if (sort === 'deadline') return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        if (sort === 'views') return b.views - a.views;
        return 0;
      });
  }, [opportunities, search, category, type, sort]);

  const pinned = filtered.filter(o => o.isPinned);
  const regular = filtered.filter(o => !o.isPinned);

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary px-8 py-20 text-primary-foreground rounded-3xl mt-6">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
          <Send className="w-full h-full -rotate-12 translate-x-1/4" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-extrabold uppercase tracking-widest mb-6">
            <Sparkles className="w-3 h-3 mr-2" /> Real-time opportunities from Telegram
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-[1.1]">
            Your Next Career <br />
            <span className="text-yellow-300">Starts Right Here.</span>
          </h1>
          <p className="text-lg text-primary-foreground/90 mb-8 max-w-lg font-medium">
            We automatically sync and organize the best internships, scholarships, and events from Telegram channels into a single, clean platform.
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <a 
              href="#" 
              className="bg-white text-primary px-8 py-4 rounded-2xl font-black hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/30 text-sm uppercase tracking-wider"
            >
              Join Our Telegram
            </a>
            <div className="flex -space-x-3 items-center ml-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-primary bg-muted flex items-center justify-center text-[10px] font-bold overflow-hidden ring-2 ring-white/10">
                  <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                </div>
              ))}
              <span className="pl-6 text-sm font-bold opacity-90">10k+ members active</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="sticky top-24">
            <OpportunityFilters 
              selectedCategory={category}
              selectedType={type}
              onSearch={setSearch}
              onCategoryChange={setCategory}
              onTypeChange={setType}
              onSortChange={setSort}
            />
            
            <div className="mt-8 bg-blue-50/50 p-6 rounded-2xl border border-blue-100 border-dashed text-center">
              <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h4 className="font-bold mb-1 text-sm">Opportunity Digest</h4>
              <p className="text-xs text-muted-foreground mb-4">Get the top 10 handpicked opportunities in your inbox every Monday.</p>
              <div className="space-y-2">
                <input type="email" placeholder="you@example.com" className="w-full px-3 py-2 text-xs border rounded-lg bg-white" />
                <button className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-xs font-bold shadow-md shadow-primary/20">Subscribe Now</button>
              </div>
            </div>
          </div>
        </aside>

        {/* Results */}
        <main className="lg:col-span-9">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <h2 className="text-2xl font-black tracking-tight">
              {category === 'All' ? 'Latest Opportunities' : `${category}`}
              <span className="ml-3 text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded-full">{filtered.length} listings</span>
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Displaying:</span>
              <div className="flex bg-muted p-1 rounded-lg">
                <div className="px-2 py-1 bg-white text-xs font-bold rounded shadow-sm">Grid</div>
                <div className="px-2 py-1 text-xs font-bold text-muted-foreground">List</div>
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-24 text-center bg-card border border-dashed rounded-3xl"
            >
              <div className="bg-muted p-6 rounded-full mb-4">
                <AlertCircle className="w-12 h-12 text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-bold mb-2">No matching opportunities</h3>
              <p className="text-muted-foreground max-w-xs">We couldn't find anything matching your filters. Try clearing them or broaden your search.</p>
              <button 
                onClick={() => {setCategory('All'); setType('All'); setSearch('');}}
                className="mt-6 bg-primary/10 text-primary px-6 py-2 rounded-xl text-sm font-bold hover:bg-primary/20 transition-colors"
              >
                Clear all filters
              </button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {pinned.map(opp => (
                <OpportunityCard key={opp.id} opportunity={opp} />
              ))}
              {regular.map(opp => (
                <OpportunityCard key={opp.id} opportunity={opp} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}