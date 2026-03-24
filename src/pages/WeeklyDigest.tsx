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
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="h-8 w-64 bg-muted/10 animate-pulse rounded-lg mb-4" />
      <div className="h-4 w-96 bg-muted/10 animate-pulse rounded-lg" />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary px-3 py-1 bg-primary/10 rounded-full">Weekly Selection</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-4 tracking-tight">
            The Weekly Digest
          </h1>
          <p className="text-muted max-w-xl text-lg">
            A curated selection of the most impactful opportunities from the last seven days, hand-picked for the community.
          </p>
        </div>
        
        {user?.role === 'admin' && (
          <button
            onClick={handleShareToTelegram}
            className="group flex items-center gap-3 px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
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
            <div className="flex items-center justify-between mb-8 border-b border-border pb-6">
              <h2 className="text-2xl font-serif font-bold text-foreground flex items-center gap-4">
                <Briefcase className="w-6 h-6 text-primary" /> Top Internships
              </h2>
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{topInternships.length} Picks</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {topInternships.map(o => (
                <OpportunityCard key={o.id} opportunity={o} onClick={onSelectOpportunity} />
              ))}
            </div>
          </section>
        )}

        {/* Scholarships */}
        {topScholarships.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8 border-b border-border pb-6">
              <h2 className="text-2xl font-serif font-bold text-foreground flex items-center gap-4">
                <GraduationCap className="w-6 h-6 text-primary" /> Top Scholarships
              </h2>
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{topScholarships.length} Picks</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {topScholarships.map(o => (
                <OpportunityCard key={o.id} opportunity={o} onClick={onSelectOpportunity} />
              ))}
            </div>
          </section>
        )}

        {/* Events */}
        {topEvents.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8 border-b border-border pb-6">
              <h2 className="text-2xl font-serif font-bold text-foreground flex items-center gap-4">
                <Calendar className="w-6 h-6 text-primary" /> Top Events
              </h2>
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{topEvents.length} Picks</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {topEvents.map(o => (
                <OpportunityCard key={o.id} opportunity={o} onClick={onSelectOpportunity} />
              ))}
            </div>
          </section>
        )}

        {/* Competitions */}
        {topCompetitions.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8 border-b border-border pb-6">
              <h2 className="text-2xl font-serif font-bold text-foreground flex items-center gap-4">
                <Trophy className="w-6 h-6 text-primary" /> Top Competitions
              </h2>
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{topCompetitions.length} Picks</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {topCompetitions.map(o => (
                <OpportunityCard key={o.id} opportunity={o} onClick={onSelectOpportunity} />
              ))}
            </div>
          </section>
        )}

        {topInternships.length === 0 && topScholarships.length === 0 && topEvents.length === 0 && topCompetitions.length === 0 && (
          <div className="text-center py-32 bg-muted/5 rounded-[2.5rem] border border-dashed border-border">
            <h3 className="text-2xl font-serif font-bold text-foreground mb-2">Quiet on the horizon</h3>
            <p className="text-muted">Check back later for this week's top picks.</p>
          </div>
        )}
      </div>
    </div>
  );
};
