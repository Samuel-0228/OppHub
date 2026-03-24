import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { Opportunity, UserProfile } from '../types';
import { OpportunityCard } from '../components/OpportunityCard';
import { Send, Calendar, Trophy, Briefcase, GraduationCap } from 'lucide-react';
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
      const all = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Opportunity));

      const sorted = [...all].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));

      setTopInternships(sorted.filter((o) => o.category === 'Internships').slice(0, 3));
      setTopScholarships(sorted.filter((o) => o.category === 'Scholarships').slice(0, 3));
      setTopEvents(sorted.filter((o) => o.category === 'Events').slice(0, 3));
      setTopCompetitions(sorted.filter((o) => o.category === 'Competitions').slice(0, 3));

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
          internships: topInternships.map((o) => o.title),
          scholarships: topScholarships.map((o) => o.title),
          events: topEvents.map((o) => o.title),
          competitions: topCompetitions.map((o) => o.title),
        }),
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

  if (loading) {
    return (
      <div className="oh-page-fade max-w-7xl mx-auto px-5 py-24">
        <div className="h-9 w-56 bg-[var(--oh-surface)] rounded-lg mb-4 animate-pulse border border-[var(--oh-border)]" />
        <div className="h-4 w-80 max-w-full bg-[var(--oh-surface)] rounded-lg animate-pulse border border-[var(--oh-border)]" />
      </div>
    );
  }

  const sectionHeader = (icon: React.ElementType, title: string, count: number) => {
    const Icon = icon;
    return (
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8 pb-6 border-b border-[var(--oh-border)]">
        <h2
          className="text-xl md:text-2xl font-bold text-[var(--oh-text)] flex items-center gap-3"
          style={{ fontFamily: 'var(--oh-font-display)' }}
        >
          <Icon className="w-7 h-7 text-[var(--oh-accent)] shrink-0" />
          {title}
        </h2>
        <span className="text-[10px] font-bold text-[var(--oh-text-subtle)] uppercase tracking-[0.2em]">{count} picks</span>
      </div>
    );
  };

  const hasAny =
    topInternships.length > 0 ||
    topScholarships.length > 0 ||
    topEvents.length > 0 ||
    topCompetitions.length > 0;

  return (
    <div className="oh-page-fade max-w-7xl mx-auto px-5 lg:px-8 py-12 md:py-16">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 md:mb-20">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--oh-accent-bright)] mb-3">Last 7 days</p>
          <h1
            className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-[var(--oh-text)] mb-4 tracking-tight"
            style={{ fontFamily: 'var(--oh-font-display)' }}
          >
            Weekly digest
          </h1>
          <p className="text-[var(--oh-text-muted)] max-w-2xl text-lg leading-relaxed">
            High-signal opportunities ranked by engagement — the same pipeline that powers the public feed, distilled for scanning.
          </p>
        </div>

        {user?.role === 'admin' && (
          <button
            type="button"
            onClick={handleShareToTelegram}
            className="group inline-flex items-center justify-center gap-2 btn-primary px-7 py-3.5 text-sm w-full sm:w-auto"
          >
            <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            Share to Telegram
          </button>
        )}
      </div>

      <div className="space-y-20 md:space-y-24">
        {topInternships.length > 0 && (
          <section>
            {sectionHeader(Briefcase, 'Top internships', topInternships.length)}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {topInternships.map((o) => (
                <OpportunityCard key={o.id} opportunity={o} onClick={onSelectOpportunity} />
              ))}
            </div>
          </section>
        )}

        {topScholarships.length > 0 && (
          <section>
            {sectionHeader(GraduationCap, 'Top scholarships', topScholarships.length)}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {topScholarships.map((o) => (
                <OpportunityCard key={o.id} opportunity={o} onClick={onSelectOpportunity} />
              ))}
            </div>
          </section>
        )}

        {topEvents.length > 0 && (
          <section>
            {sectionHeader(Calendar, 'Top events', topEvents.length)}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {topEvents.map((o) => (
                <OpportunityCard key={o.id} opportunity={o} onClick={onSelectOpportunity} />
              ))}
            </div>
          </section>
        )}

        {topCompetitions.length > 0 && (
          <section>
            {sectionHeader(Trophy, 'Top competitions', topCompetitions.length)}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {topCompetitions.map((o) => (
                <OpportunityCard key={o.id} opportunity={o} onClick={onSelectOpportunity} />
              ))}
            </div>
          </section>
        )}

        {!hasAny && (
          <div className="text-center py-24 md:py-32 rounded-[var(--oh-radius-xl)] border border-dashed border-[var(--oh-border)] bg-[var(--oh-surface)]/80">
            <h3 className="text-xl font-bold text-[var(--oh-text)] mb-2" style={{ fontFamily: 'var(--oh-font-display)' }}>
              Quiet week
            </h3>
            <p className="text-[var(--oh-text-muted)]">Check back after new posts land from Telegram.</p>
          </div>
        )}
      </div>
    </div>
  );
};
