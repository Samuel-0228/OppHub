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

  if (loading) return (
    <div className="max-w-7xl mx-auto p-12">
      <div className="h-8 w-64 bg-black/5 animate-pulse rounded mb-4" />
      <div className="h-4 w-96 bg-black/5 animate-pulse rounded" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent px-2 py-1 bg-accent/10 rounded">Weekly Selection</span>
            <div className="h-[1px] w-12 bg-accent/30" />
          </div>
          <h1 className="text-6xl md:text-7xl font-serif font-light leading-tight tracking-tight text-ink mb-4">
            The Weekly <span className="italic">Digest</span>
          </h1>
          <p className="text-ink/60 font-sans max-w-xl text-lg">
            A curated selection of the most impactful opportunities from the last seven days, hand-picked for the community.
          </p>
        </div>
        
        {user?.role === 'admin' && (
          <button
            onClick={handleShareToTelegram}
            className="group flex items-center gap-3 px-8 py-4 bg-ink text-paper font-sans font-bold rounded-full hover:bg-accent hover:text-ink transition-all duration-300 shadow-xl shadow-ink/10 active:scale-95"
          >
            <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            <span>Share to Telegram</span>
          </button>
        )}
      </div>

      <div className="space-y-24">
        {/* Internships */}
        {topInternships.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-10 border-b border-ink/10 pb-6">
              <h2 className="text-3xl font-serif italic text-ink flex items-center gap-4">
                <Briefcase className="w-6 h-6 text-accent" /> Top Internships
              </h2>
              <span className="text-xs font-mono text-ink/40 uppercase tracking-widest">{topInternships.length} Picks</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {topInternships.map(o => (
                <OpportunityCard key={o.id} opportunity={o} onClick={onSelectOpportunity} />
              ))}
            </div>
          </section>
        )}

        {/* Scholarships */}
        {topScholarships.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-10 border-b border-ink/10 pb-6">
              <h2 className="text-3xl font-serif italic text-ink flex items-center gap-4">
                <GraduationCap className="w-6 h-6 text-accent" /> Top Scholarships
              </h2>
              <span className="text-xs font-mono text-ink/40 uppercase tracking-widest">{topScholarships.length} Picks</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {topScholarships.map(o => (
                <OpportunityCard key={o.id} opportunity={o} onClick={onSelectOpportunity} />
              ))}
            </div>
          </section>
        )}

        {/* Events */}
        {topEvents.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-10 border-b border-ink/10 pb-6">
              <h2 className="text-3xl font-serif italic text-ink flex items-center gap-4">
                <Calendar className="w-6 h-6 text-accent" /> Top Events
              </h2>
              <span className="text-xs font-mono text-ink/40 uppercase tracking-widest">{topEvents.length} Picks</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {topEvents.map(o => (
                <OpportunityCard key={o.id} opportunity={o} onClick={onSelectOpportunity} />
              ))}
            </div>
          </section>
        )}

        {/* Competitions */}
        {topCompetitions.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-10 border-b border-ink/10 pb-6">
              <h2 className="text-3xl font-serif italic text-ink flex items-center gap-4">
                <Trophy className="w-6 h-6 text-accent" /> Top Competitions
              </h2>
              <span className="text-xs font-mono text-ink/40 uppercase tracking-widest">{topCompetitions.length} Picks</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {topCompetitions.map(o => (
                <OpportunityCard key={o.id} opportunity={o} onClick={onSelectOpportunity} />
              ))}
            </div>
          </section>
        )}

        {topInternships.length === 0 && topScholarships.length === 0 && topEvents.length === 0 && topCompetitions.length === 0 && (
          <div className="text-center py-32 bg-ink/5 rounded-[2rem] border border-dashed border-ink/20">
            <h3 className="text-2xl font-serif italic text-ink mb-2">Quiet on the horizon</h3>
            <p className="text-ink/60 font-sans">Check back later for this week's top picks.</p>
          </div>
        )}
      </div>
    </div>
  );
};
