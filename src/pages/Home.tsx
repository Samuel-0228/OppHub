import React, { useState, useMemo } from 'react';
import { OpportunityCard } from '../components/OpportunityCard';
import { Filters } from '../components/Filters';
import { mockOpportunities } from '../data/mockData';
import { Category } from '../types';
import { Search, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Home: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedField, setSelectedField] = useState('All');
  const [isRemote, setIsRemote] = useState<boolean | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [bookmarks, setBookmarks] = useState<string[]>([]);

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
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="bg-white border-b border-slate-100 pt-12 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight"
          >
            Find Your Next <span className="text-indigo-600">Opportunity</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto mb-10"
          >
            The ultimate platform for internships, scholarships, and events. Automatically pulled from global Telegram networks and structured for you.
          </motion.p>
          
          <div className="max-w-2xl mx-auto relative">
            <div className="flex items-center bg-white rounded-2xl shadow-xl shadow-indigo-500/10 border border-slate-100 p-2">
              <div className="flex-1 flex items-center px-4">
                <Search className="w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search by role, company, or keywords..." 
                  className="w-full bg-transparent border-none focus:ring-0 text-slate-900 placeholder:text-slate-400 px-3 py-3 font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-72 flex-shrink-0">
            <Filters 
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedField={selectedField}
              setSelectedField={setSelectedField}
              isRemote={isRemote}
              setIsRemote={setIsRemote}
            />
          </aside>

          <main className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {selectedCategory === 'All' ? 'Latest Opportunities' : `${selectedCategory} Opportunities`}
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                  Showing {filteredOpportunities.length} results
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-slate-600 bg-white border border-slate-100 px-4 py-2 rounded-xl shadow-sm">
                  <ArrowUpDown className="w-4 h-4" />
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 p-0 font-semibold cursor-pointer"
                  >
                    <option value="newest">Newest First</option>
                    <option value="deadline">Deadline Soon</option>
                    <option value="views">Most Viewed</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredOpportunities.map((opp) => (
                  <OpportunityCard 
                    key={opp.id} 
                    opportunity={opp} 
                    isBookmarked={bookmarks.includes(opp.id)}
                    onBookmark={toggleBookmark}
                  />
                ))}
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};