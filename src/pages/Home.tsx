import React, { useState, useMemo } from 'react';
import { OpportunityCard } from '../components/OpportunityCard';
import { Filters } from '../components/Filters';
import { mockOpportunities } from '../data/mockData';
import { Category } from '../types';
import { Search, ArrowUpDown, Sparkles, Filter, Zap, Globe, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Input, GlassCard } from '../components/ui-elements';

export const Home: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedField, setSelectedField] = useState('All');
  const [isRemote, setIsRemote] = useState<boolean | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredOpportunities = useMemo(() => {
    let result = [...mockOpportunities];

    if (selectedCategory !== 'All') {
      result = result.filter(o => o.category === selectedCategory);
    }

    if (selectedField !== 'All') {
      result = result.filter(o => o.field === selectedField);
    }

    if (isRemote !== null) {
      result = result.filter(o => o.isRemote === isRemote);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(o => 
        o.title.toLowerCase().includes(q) || 
        o.organization.toLowerCase().includes(q) ||
        o.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
    } else if (sortBy === 'deadline') {
      result.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    } else if (sortBy === 'views') {
      result.sort((a, b) => b.views - a.views);
    }

    return result;
  }, [selectedCategory, selectedField, isRemote, searchQuery, sortBy]);

  const toggleBookmark = (id: string) => {
    setBookmarks(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-700 pb-32">
      {/* Hero Section - AI Human Centric Aesthetic */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
           <img 
             src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/018564a2-3c2e-49e4-b8cf-a7247087d862/hero-abstract-bg-9b4803ea-1773609287403.webp" 
             className="w-full h-full object-cover opacity-20 dark:opacity-10 blur-2xl scale-110 transition-transform duration-[10s] hover:scale-100"
             alt="Background"
           />
           <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-xl mb-4"
            >
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                Intelligence for Modern Ambition
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-8xl font-black text-foreground tracking-tighter leading-[0.9] max-w-4xl"
            >
              Unlock your <br />
              <span className="text-primary italic font-serif">potential</span> today.
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-muted-foreground max-w-2xl font-medium leading-relaxed"
            >
              The world's most curated network for internships, scholarships, and career-defining events. Human-vetted, AI-structured.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="w-full max-w-3xl mt-12"
            >
              <GlassCard className="p-2 flex flex-col sm:flex-row items-center gap-2 group hover:border-primary/40 transition-all duration-700">
                <div className="flex-1 flex items-center px-6 w-full">
                  <Search className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search by role, company, or keywords..." 
                    className="w-full bg-transparent border-none focus:ring-0 text-foreground placeholder:text-muted-foreground/40 px-4 py-6 text-lg font-bold"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button size="lg" className="w-full sm:w-auto">
                  Discover Now
                </Button>
              </GlassCard>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-12 mt-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
               <div className="flex items-center gap-2">
                 <Zap className="w-5 h-5" />
                 <span className="font-black text-xs uppercase tracking-widest">Fast Apply</span>
               </div>
               <div className="flex items-center gap-2">
                 <Globe className="w-5 h-5" />
                 <span className="font-black text-xs uppercase tracking-widest">Global Reach</span>
               </div>
               <div className="flex items-center gap-2">
                 <Users className="w-5 h-5" />
                 <span className="font-black text-xs uppercase tracking-widest">Community Vetted</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar - Filter */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-32">
              <GlassCard className="p-8 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full" />
                <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Refine Results
                </h3>
                <Filters 
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedField={selectedField}
                  setSelectedField={setSelectedField}
                  isRemote={isRemote}
                  setIsRemote={setIsRemote}
                />
              </GlassCard>
            </div>
          </aside>

          {/* Main Feed */}
          <main className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
              <div>
                <h2 className="text-3xl font-black text-foreground tracking-tight">
                  {selectedCategory === 'All' ? 'Latest Opportunities' : `${selectedCategory} Roles`}
                </h2>
                <p className="text-sm text-muted-foreground font-black uppercase tracking-widest mt-1">
                  {filteredOpportunities.length} curated matches found
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="lg:hidden p-4 bg-secondary border border-border/50 rounded-2xl text-foreground"
                >
                  <Filter className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3 bg-secondary/30 backdrop-blur-xl border border-border/40 px-6 py-3 rounded-2xl">
                  <ArrowUpDown className="w-4 h-4 text-primary" />
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 p-0 text-sm font-black uppercase tracking-widest cursor-pointer outline-none"
                  >
                    <option value="newest">Newest</option>
                    <option value="deadline">Soon</option>
                    <option value="views">Popular</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredOpportunities.map((opp, index) => (
                  <motion.div
                    key={opp.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <OpportunityCard 
                      opportunity={opp} 
                      isBookmarked={bookmarks.includes(opp.id)}
                      onBookmark={toggleBookmark}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredOpportunities.length === 0 && (
              <div className="text-center py-32 bg-secondary/20 rounded-[3rem] border-2 border-dashed border-border/50">
                 <Sparkles className="w-12 h-12 text-muted-foreground/30 mx-auto mb-6" />
                 <h3 className="text-2xl font-black text-foreground mb-2">No matches found</h3>
                 <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
                 <Button 
                   variant="secondary" 
                   className="mt-8"
                   onClick={() => {
                     setSelectedCategory('All');
                     setSelectedField('All');
                     setSearchQuery('');
                   }}
                 >
                   Clear all filters
                 </Button>
              </div>
            )}
          </main>
        </div>
      </div>
      
      {/* Mobile Filter Sheet (Simplified for now as a toggle) */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            className="fixed inset-0 z-[200] lg:hidden bg-background p-8 overflow-y-auto"
          >
             <div className="flex items-center justify-between mb-12">
                <h2 className="text-3xl font-black tracking-tighter">Filters</h2>
                <button onClick={() => setIsFilterOpen(false)} className="p-4 bg-secondary rounded-2xl">
                  <Zap className="w-6 h-6 rotate-180" />
                </button>
             </div>
             <Filters 
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedField={selectedField}
                setSelectedField={setSelectedField}
                isRemote={isRemote}
                setIsRemote={setIsRemote}
              />
              <Button className="w-full mt-12" size="lg" onClick={() => setIsFilterOpen(false)}>
                Apply Filters
              </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};