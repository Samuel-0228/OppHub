import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { Opportunity, Category, UserProfile } from '../types';
import { OpportunityCard } from '../components/OpportunityCard';
import { Sparkles, Send, Calendar, Trophy, Briefcase, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';
import { subDays } from 'date-fns';

interface Props {
  user: UserProfile | null;
  onSelectOpportunity: (id: string) => void;
}

export const WeeklyDigest: React.FC<Props> = ({ user, onSelectOpportunity }) => {
  const [topInternships, setTopInternships] = useState<Opportunity[]>([]);
  const [topScholarships, setTopScholarships] = useState<Opportunity[]>([]);
  const [topEvents, setTopEvents] = useState<Opportunity[]>([]);
  const [topCompetitions, setTopCompetitions] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const lastWeek = subDays(new Date(), 7).toISOString();
    const q = query(
      collection(db, 'opportunities'),
      where('isApproved', '==', true),
      where('createdAt', '>=', lastWeek),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const all = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Opportunity));
      
      // Sort by viewCount for "Top" picks
      const sorted = [...all].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));

      setTopInternships(sorted.filter(o => o.category === 'Internships').slice(0, 3));
      setTopScholarships(sorted.filter(o => o.category === 'Scholarships').slice(0, 3));
      setTopEvents(sorted.filter(o => o.category === 'Events').slice(0, 3));
      setTopCompetitions(sorted.filter(o => o.category === 'Competitions').slice(0, 3));
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleShareToTelegram = async () => {
    if (!user || user.role !== 'admin') return;
    
    try {
      const response = await fetch('/api/share-digest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          internships: topInternships.map(o => o.title),
          scholarships: topScholarships.map(o => o.title),
          events: topEvents.map(o => o.title),
          competitions: topCompetitions.map(o => o.title)
        })
      });
      
      if (response.ok) {
        alert('Digest shared to Telegram channel!');
      } else {
        alert('Failed to share digest.');
      }
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  if (loading) return <div className="max-w-7xl mx-auto p-12 animate-pulse">Loading Weekly Digest...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tight mb-2 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-amber-500" /> Top Opportunities This Week
          </h1>
          <p className="text-slate-500">Hand-picked best opportunities from the last 7 days.</p>
        </div>
        
        {user?.role === 'admin' && (
          <button
            onClick={handleShareToTelegram}
            className="flex items-center gap-2 px-6 py-3 bg-[#0088cc] text-white font-bold rounded-full hover:bg-[#0077b5] transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <Send className="w-4 h-4" /> Share to Telegram
          </button>
        )}
      </div>

      <div className="space-y-16">
        {/* Internships */}
        {topInternships.length > 0 && (
          <section>
            <h2 className="text-2xl font-black uppercase tracking-tight mb-8 flex items-center gap-3 border-b border-black/5 pb-4">
              <Briefcase className="w-6 h-6" /> Top Internships
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {topInternships.map(o => (
                <OpportunityCard key={o.id} opportunity={o} onClick={onSelectOpportunity} />
              ))}
            </div>
          </section>
        )}

        {/* Scholarships */}
        {topScholarships.length > 0 && (
          <section>
            <h2 className="text-2xl font-black uppercase tracking-tight mb-8 flex items-center gap-3 border-b border-black/5 pb-4">
              <GraduationCap className="w-6 h-6" /> Top Scholarships
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {topScholarships.map(o => (
                <OpportunityCard key={o.id} opportunity={o} onClick={onSelectOpportunity} />
              ))}
            </div>
          </section>
        )}

        {/* Events */}
        {topEvents.length > 0 && (
          <section>
            <h2 className="text-2xl font-black uppercase tracking-tight mb-8 flex items-center gap-3 border-b border-black/5 pb-4">
              <Calendar className="w-6 h-6" /> Top Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {topEvents.map(o => (
                <OpportunityCard key={o.id} opportunity={o} onClick={onSelectOpportunity} />
              ))}
            </div>
          </section>
        )}

        {/* Competitions */}
        {topCompetitions.length > 0 && (
          <section>
            <h2 className="text-2xl font-black uppercase tracking-tight mb-8 flex items-center gap-3 border-b border-black/5 pb-4">
              <Trophy className="w-6 h-6" /> Top Competitions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {topCompetitions.map(o => (
                <OpportunityCard key={o.id} opportunity={o} onClick={onSelectOpportunity} />
              ))}
            </div>
          </section>
        )}

        {topInternships.length === 0 && topScholarships.length === 0 && topEvents.length === 0 && topCompetitions.length === 0 && (
          <div className="text-center py-24 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">No top picks this week yet</h3>
            <p className="text-slate-500">Check back later for the weekly digest.</p>
          </div>
        )}
      </div>
    </div>
  );
};
