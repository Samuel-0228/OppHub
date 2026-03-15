import React from 'react';
import { mockOpportunities } from '../data/mockData';
import { OpportunityCard } from '../components/OpportunityCard';
import { Trophy, Star, Sparkles, TrendingUp, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export const WeeklyDigest: React.FC = () => {
  const topInternships = mockOpportunities.filter(o => o.category === 'Internships').slice(0, 2);
  const topScholarships = mockOpportunities.filter(o => o.category === 'Scholarships').slice(0, 2);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="bg-indigo-600 pt-16 pb-32 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl -ml-32 -mb-32"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-indigo-500/30 text-indigo-100 px-4 py-2 rounded-full text-sm font-bold mb-6 backdrop-blur-md">
            <Sparkles className="w-4 h-4" />
            Issue #24: Sept 1-7, 2025
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">Top Opportunities This Week</h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            Our curation engine selected the most impactful opportunities from across global networks.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-16 relative z-20">
        <div className="space-y-16">
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Featured Opportunities</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockOpportunities.slice(0, 2).map(opp => (
                <OpportunityCard key={opp.id} opportunity={opp} />
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">
            <div className="space-y-12">
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-xl font-bold text-slate-900">Top Internships</h3>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {topInternships.map(opp => (
                    <OpportunityCard key={opp.id} opportunity={opp} />
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-8">
              <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  Scholarships
                </h3>
                <div className="space-y-6">
                  {topScholarships.map(opp => (
                    <div key={opp.id} className="group border-b border-slate-50 pb-4 last:border-0">
                      <p className="text-xs font-bold text-indigo-600 uppercase mb-1">{opp.organization}</p>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">{opp.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2">{opp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};