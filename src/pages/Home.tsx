import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot, orderBy, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { Opportunity, Category, UserProfile, Bookmark } from '../types';
import { OpportunityCard } from '../components/OpportunityCard';
import { Filters } from '../components/Filters';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, TrendingUp, Calendar as CalendarIcon, Trophy, Search } from 'lucide-react';

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
  const [localSearch, setLocalSearch] = useState('');

  useEffect(() => {
    let q = query(collection(db, 'opportunities'), where('isApproved', '==', true));

    if (selectedCategory !== 'All') {
      q = query(q, where('category', '==', selectedCategory));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Opportunity));
      
      const effectiveSearch = localSearch || searchQuery;
      if (isRemoteOnly) {
        data = data.filter(o => o.isRemote);
      }
      if (effectiveSearch) {
        const lowQuery = effectiveSearch.toLowerCase();
        data = data.filter(o => 
          o.title.toLowerCase().includes(lowQuery) || 
          o.organization?.toLowerCase().includes(lowQuery) ||
          o.description.toLowerCase().includes(lowQuery) ||
          o.tags?.some(t => t.toLowerCase().includes(lowQuery))
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
  }, [selectedCategory, isRemoteOnly, sortBy, searchQuery, localSearch]);

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

  const categories: { name: Category | 'All'; icon: any }[] = [
    { name: 'All', icon: Sparkles },
    { name: 'Internships', icon: TrendingUp },
    { name: 'Scholarships', icon: Trophy },
    { name: 'Events', icon: CalendarIcon },
    { name: 'Jobs', icon: TrendingUp },
    { name: 'Competitions', icon: Trophy },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <section className="text-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground mb-6 leading-[1.1]">
            Find your <span className="text-primary">dream</span> <br />
            opportunity today
          </h1>
          <p className="text-lg text-muted mb-10 max-w-xl mx-auto">
            Discover curated internships, scholarships, and events tailored for the ambitious Ethiopian youth.
          </p>

          <div className="relative max-w-2xl mx-auto group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search by title, company, or category..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="search-input pl-14 pr-32"
            />
            <button className="absolute right-2 top-2 bottom-2 btn-primary !px-6 !py-0 text-sm">
              Search
            </button>
          </div>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="mb-16 overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex justify-center gap-4 min-w-max">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                selectedCategory === cat.name
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-white text-muted hover:bg-secondary border border-border'
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-3">
          <div className="sticky top-32 space-y-8">
            <div className="curvetree-card !p-8">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-widest mb-6">Filters</h3>
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
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-display font-bold text-foreground">
              {selectedCategory === 'All' ? 'Latest Opportunities' : `${selectedCategory}`}
            </h2>
            <span className="text-sm font-semibold text-muted">{opportunities.length} Results</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-64 bg-secondary rounded-[1.5rem] animate-pulse" />
              ))}
            </div>
          ) : opportunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div className="text-center py-24 curvetree-card">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-muted" />
              </div>
              <h3 className="text-xl font-display font-bold text-foreground mb-2">No opportunities found</h3>
              <p className="text-muted">Try adjusting your search or filters</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
