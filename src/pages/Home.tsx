import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { Opportunity, Category, UserProfile } from '../types';
import { OpportunityCard } from '../components/OpportunityCard';
import { Filters } from '../components/Filters';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, TrendingUp, Calendar as CalendarIcon, Trophy, Search, Zap } from 'lucide-react';

interface Props {
  user: UserProfile | null;
  onSelectOpportunity: (id: string) => void;
}

export const Home: React.FC<Props> = ({ user, onSelectOpportunity }) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [isRemoteOnly, setIsRemoteOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'deadline' | 'views'>('newest');
  const [loading, setLoading] = useState(true);
  const [localSearch, setLocalSearch] = useState('');

  useEffect(() => {
    let q = query(collection(db, 'opportunities'), where('isApproved', '==', true));

    if (selectedCategory !== 'All') {
      q = query(q, where('category', '==', selectedCategory));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Opportunity));

      const effectiveSearch = localSearch;
      if (isRemoteOnly) {
        data = data.filter((o) => o.isRemote);
      }
      if (effectiveSearch) {
        const lowQuery = effectiveSearch.toLowerCase();
        data = data.filter(
          (o) =>
            o.title.toLowerCase().includes(lowQuery) ||
            o.organization?.toLowerCase().includes(lowQuery) ||
            o.description.toLowerCase().includes(lowQuery) ||
            o.tags?.some((t) => t.toLowerCase().includes(lowQuery))
        );
      }

      data.sort((a, b) => {
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === 'views') return (b.viewCount || 0) - (a.viewCount || 0);
        if (sortBy === 'deadline') {
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        }
        return 0;
      });

      setOpportunities(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedCategory, isRemoteOnly, sortBy, localSearch]);

  useEffect(() => {
    if (!user) {
      setBookmarks([]);
      return;
    }
    const unsubscribe = onSnapshot(collection(db, `users/${user.uid}/bookmarks`), (snapshot) => {
      setBookmarks(snapshot.docs.map((d) => d.data().opportunityId));
    });
    return () => unsubscribe();
  }, [user]);

  const handleBookmark = async (opportunityId: string) => {
    if (!user) {
      alert('Please sign in to bookmark opportunities');
      return;
    }

    const bookmarkId = `${user.uid}_${opportunityId}`;
    const bookmarkRef = doc(db, `users/${user.uid}/bookmarks`, bookmarkId);
    const docSnap = await getDoc(bookmarkRef);

    if (docSnap.exists()) {
      await deleteDoc(bookmarkRef);
    } else {
      await setDoc(bookmarkRef, {
        userId: user.uid,
        opportunityId,
        createdAt: new Date().toISOString(),
      });
    }
  };

  const categories: { name: Category | 'All'; icon: React.ElementType }[] = [
    { name: 'All', icon: Sparkles },
    { name: 'Internships', icon: TrendingUp },
    { name: 'Scholarships', icon: Trophy },
    { name: 'Events', icon: CalendarIcon },
    { name: 'Jobs', icon: Zap },
    { name: 'Competitions', icon: Trophy },
  ];

  return (
    <div className="oh-page-fade max-w-7xl mx-auto px-5 lg:px-8 py-12 md:py-16">
      <section className="relative mb-16 md:mb-24 rounded-[var(--oh-radius-xl)] overflow-hidden border border-[var(--oh-border)] oh-hero-gradient oh-grid-bg">
        <div className="relative px-6 py-16 md:py-24 md:px-12 text-center">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-3xl mx-auto">
            <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-[var(--oh-accent-bright)] mb-5">Live from Telegram · Curated for you</p>
            <h1
              className="text-[2.35rem] sm:text-5xl md:text-6xl lg:text-[3.5rem] font-extrabold text-[var(--oh-text)] mb-6 leading-[1.05]"
              style={{ fontFamily: 'var(--oh-font-display)' }}
            >
              Discover your next{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--oh-accent)] via-sky-300 to-[var(--oh-accent-bright)]">
                breakthrough
              </span>{' '}
              opportunity
            </h1>
            <p className="text-base md:text-lg text-[var(--oh-text-muted)] mb-10 max-w-xl mx-auto leading-relaxed">
              Internships, scholarships, jobs, and events — aggregated from trusted channels and published in a clean, editorial feed.
            </p>

            <div className="relative max-w-2xl mx-auto group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--oh-text-subtle)] group-focus-within:text-[var(--oh-accent)] transition-colors" />
              <input
                type="text"
                placeholder="Search title, organization, tags…"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="search-input pl-14 pr-[7.5rem]"
              />
              <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary !py-2.5 !px-5 text-xs uppercase tracking-wide">
                Search
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mb-12 overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex gap-3 min-w-max md:justify-center md:flex-wrap md:min-w-0">
          {categories.map((cat) => {
            const active = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-[var(--oh-transition)] border ${
                  active
                    ? 'bg-[var(--oh-accent-dim)] text-[var(--oh-accent-bright)] border-[var(--oh-border-strong)] shadow-[0_0_24px_var(--oh-accent-glow)]'
                    : 'bg-[var(--oh-surface)] text-[var(--oh-text-muted)] border-[var(--oh-border)] hover:border-[rgba(56,189,248,0.3)] hover:text-[var(--oh-text)]'
                }`}
              >
                <cat.icon className="w-4 h-4 opacity-80" />
                {cat.name}
              </button>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
        <aside className="lg:col-span-3 order-2 lg:order-1">
          <div className="lg:sticky lg:top-28 space-y-6">
            <div className="oh-card !shadow-none p-7 !transform-none hover:!transform-none hover:!border-[var(--oh-border)]">
              <h3 className="text-xs font-bold text-[var(--oh-text-muted)] uppercase tracking-[0.2em] mb-6">Refine</h3>
              <Filters
                isRemoteOnly={isRemoteOnly}
                setIsRemoteOnly={setIsRemoteOnly}
                sortBy={sortBy}
                setSortBy={setSortBy}
              />
            </div>
          </div>
        </aside>

        <main className="lg:col-span-9 order-1 lg:order-2">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--oh-text)]" style={{ fontFamily: 'var(--oh-font-display)' }}>
                {selectedCategory === 'All' ? 'Latest opportunities' : selectedCategory}
              </h2>
              <p className="text-sm text-[var(--oh-text-muted)] mt-1">Updated as new posts arrive from the wire</p>
            </div>
            <span className="text-sm font-semibold tabular-nums text-[var(--oh-accent-bright)] bg-[var(--oh-accent-dim)] border border-[var(--oh-border)] px-4 py-2 rounded-full w-fit">
              {opportunities.length} {opportunities.length === 1 ? 'result' : 'results'}
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-72 rounded-[var(--oh-radius-lg)] bg-[var(--oh-surface)] border border-[var(--oh-border)] animate-pulse"
                />
              ))}
            </div>
          ) : opportunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {opportunities.map((o) => (
                  <OpportunityCard
                    key={o.id}
                    opportunity={o}
                    isBookmarked={bookmarks.includes(o.id)}
                    onBookmark={handleBookmark}
                    onClick={onSelectOpportunity}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-20 px-6 oh-card !transform-none hover:!transform-none border-dashed border-[var(--oh-border)]">
              <div className="w-14 h-14 rounded-2xl bg-[var(--oh-accent-dim)] flex items-center justify-center mx-auto mb-5 border border-[var(--oh-border)]">
                <Sparkles className="w-7 h-7 text-[var(--oh-accent)]" />
              </div>
              <h3 className="text-xl font-bold text-[var(--oh-text)] mb-2" style={{ fontFamily: 'var(--oh-font-display)' }}>
                No matches yet
              </h3>
              <p className="text-[var(--oh-text-muted)] max-w-sm mx-auto">Try another keyword or clear filters to see the full feed.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
