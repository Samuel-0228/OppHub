import React from 'react';
import { useOpportunities } from '../hooks/useOpportunities';
import { OpportunityCard } from '../components/OpportunityCard';
import { Bookmark, Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function BookmarksPage() {
  const { opportunities, savedIds } = useOpportunities();
  const saved = opportunities.filter(o => savedIds.includes(o.id));

  return (
    <div className="py-12 space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-8">
        <div>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
            <Bookmark className="w-3 h-3 mr-2" /> Personal Dashboard
          </div>
          <h1 className="text-4xl font-black tracking-tight">Your Saved Items</h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Keep track of the opportunities you're interested in and never miss a deadline.
          </p>
        </div>
        <div className="text-sm font-bold px-6 py-3 bg-card border rounded-2xl shadow-sm">
          {saved.length} {saved.length === 1 ? 'Opportunity' : 'Opportunities'} Saved
        </div>
      </div>

      {saved.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-24 text-center bg-card border border-dashed rounded-3xl"
        >
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
            <Bookmark className="w-8 h-8 text-muted-foreground/30" />
          </div>
          <h2 className="text-2xl font-black mb-2">Your watchlist is empty</h2>
          <p className="text-muted-foreground max-w-sm mb-10 font-medium">
            Explore the latest opportunities and click the bookmark icon to save them for later.
          </p>
          <Link 
            to="/" 
            className="bg-primary text-primary-foreground px-10 py-4 rounded-2xl font-black hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 flex items-center uppercase tracking-wider text-sm"
          >
            <Search className="w-5 h-5 mr-3" /> Start Exploring
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {saved.map(opp => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
          
          <Link 
            to="/" 
            className="group flex flex-col items-center justify-center p-8 bg-muted/20 border-2 border-dashed rounded-3xl hover:bg-muted/40 transition-all border-muted hover:border-primary/50"
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
              <Search className="w-6 h-6 text-primary" />
            </div>
            <p className="font-bold text-center">Find more opportunities</p>
            <p className="text-xs text-muted-foreground text-center mt-2 group-hover:translate-x-1 transition-transform flex items-center font-bold">
              Return to Discovery <ArrowRight className="w-3 h-3 ml-2" />
            </p>
          </Link>
        </div>
      )}
    </div>
  );
}