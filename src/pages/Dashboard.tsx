import React from 'react';
import { mockOpportunities } from '../data/mockData';
import { OpportunityCard } from '../components/OpportunityCard';
import { Bookmark, LayoutDashboard, History, Settings, Bell, ChevronRight } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const savedItems = mockOpportunities.slice(0, 2);

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">
          <aside className="space-y-4">
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-black text-white mb-4">
                  JD
                </div>
                <h2 className="text-lg font-bold text-slate-900">John Doe</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Free Member</p>
              </div>

              <div className="space-y-1">
                <button className="w-full flex items-center gap-3 px-4 py-3 bg-indigo-50 text-indigo-700 rounded-2xl text-sm font-bold">
                  <LayoutDashboard className="w-4 h-4" />
                  Overview
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-2xl text-sm font-bold">
                  <Bookmark className="w-4 h-4" />
                  Saved
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:bg-slate-50 rounded-2xl text-sm font-bold">
                  <Settings className="w-4 h-4" />
                  Account
                </button>
              </div>
            </div>
          </aside>

          <main className="space-y-10">
            <div>
              <h1 className="text-3xl font-black text-slate-900 mb-8">My Dashboard</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-4">Total Saved</p>
                  <span className="text-4xl font-black text-slate-900">12</span>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-4">Profile Strength</p>
                  <span className="text-4xl font-black text-slate-900">85%</span>
                </div>
              </div>
            </div>

            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-indigo-600" />
                Saved Opportunities
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedItems.map(opp => (
                  <OpportunityCard key={opp.id} opportunity={opp} isBookmarked={true} />
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};