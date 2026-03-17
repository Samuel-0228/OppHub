import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot, orderBy, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { Opportunity, Category, UserProfile, Bookmark } from '../types';
import { OpportunityCard } from '../components/OpportunityCard';
import { Filters } from '../components/Filters';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, TrendingUp, Calendar as CalendarIcon, Trophy } from 'lucide-react';

interface Props {
  user: UserProfile | null;
  searchQuery: string;
  onSelectOpportunity: (id: string) => void;
}

export const Home: React.FC<Props> = ({ user, searchQuery, onSelectOpportunity }) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [isRemoteOnly, setIsRemoteOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'deadline' | 'views'>('newest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q = query(collection(db, 'opportunities'), where('isApproved', '==', true));

    if (selectedCategory !== 'All') {
      q = query(q, where('category', '==', selectedCategory));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Opportunity));
      
      // Client-side filtering for remote and search
      if (isRemoteOnly) {
        data = data.filter(o => o.isRemote);
      }
      if (searchQuery) {
        const lowQuery = searchQuery.toLowerCase();
        data = data.filter(o => 
          o.title.toLowerCase().includes(lowQuery) || 
          o.organization?.toLowerCase().includes(lowQuery) ||
          o.description.toLowerCase().includes(lowQuery) ||
          o.tags?.some(t => t.toLowerCase().includes(lowQuery))
        );
      }

      // Sorting
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
  }, [selectedCategory, isRemoteOnly, sortBy, searchQuery]);

  useEffect(() => {
    if (!user) {
      setBookmarks([]);
      return;
    }
    const unsubscribe = onSnapshot(collection(db, `users/${user.uid}/bookmarks`), (snapshot) => {
      setBookmarks(snapshot.docs.map(doc => doc.data().opportunityId));
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
        createdAt: new Date().toISOString()
      });
    }
  };

  const featured = opportunities.filter(o => o.isFeatured).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-12">
      {/* Hero Section */}
      {!searchQuery && selectedCategory === 'All' && (
        <section className="mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-[10px] font-display font-bold uppercase tracking-[0.2em] mb-8"
              >
                <Sparkles className="w-3 h-3" /> Curated for Ethiopian Talent
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-6xl md:text-8xl font-serif font-bold leading-[0.9] tracking-tighter text-ink mb-10"
              >
                Find Your <br />
                <span className="italic text-accent">Next Big</span> <br />
                Move.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-ink/60 font-light leading-relaxed max-w-md mb-12"
              >
                The most refined collection of internships, scholarships, and events for the ambitious.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <button className="btn-primary">Explore All</button>
                <button className="btn-secondary">Post Opportunity</button>
              </motion.div>
            </div>
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="aspect-[4/5] bg-ink/5 rounded-[3rem] overflow-hidden relative"
              >
                <img 
                  src="https://picsum.photos/seed/ethiopia/800/1000" 
                  alt="Ethiopian Talent" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
                <div className="absolute bottom-10 left-10 right-10">
                  <div className="p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20">
                    <div className="text-[10px] font-display font-bold text-white/60 uppercase tracking-widest mb-2">Featured Today</div>
                    <div className="text-xl font-serif font-bold text-white">Global Tech Internship 2026</div>
                  </div>
                </div>
              </motion.div>
              {/* Decorative Elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl -z-10" />
              <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-ink/5 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Sidebar */}
        <aside className="lg:col-span-3">
          <div className="sticky top-32">
            <div className="mb-12">
              <h3 className="text-[10px] font-display font-bold text-ink/30 uppercase tracking-[0.3em] mb-8">Refine Search</h3>
              <Filters
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                isRemoteOnly={isRemoteOnly}
                setIsRemoteOnly={setIsRemoteOnly}
                sortBy={sortBy}
                setSortBy={setSortBy}
              />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-9">
          <section>
            <div className="flex items-end justify-between mb-12 border-b border-ink/5 pb-8">
              <div>
                <h2 className="text-4xl font-serif font-bold text-ink">
                  {selectedCategory === 'All' ? 'Latest' : `${selectedCategory}`}
                </h2>
                <p className="text-sm text-ink/40 font-display uppercase tracking-widest mt-2">Discover new opportunities</p>
              </div>
              <span className="text-xs font-display font-bold text-ink/20 uppercase tracking-widest">{opportunities.length} Results</span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 4, 5, 6].map(i => (
                  <div key={i} className="h-[400px] bg-ink/5 rounded-[2rem] animate-pulse" />
                ))}
              </div>
            ) : opportunities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <AnimatePresence mode="popLayout">
                  {opportunities.map(o => (
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
              <div className="text-center py-32 sloth-card">
                <div className="w-20 h-20 bg-ink/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-ink/20" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-ink mb-2">No matches found</h3>
                <p className="text-ink/40 font-display uppercase tracking-widest text-xs">Try adjusting your filters</p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};
