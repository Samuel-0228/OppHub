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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sidebar */}
        <aside className="lg:col-span-3">
          <div className="sticky top-24">
            <Filters
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              isRemoteOnly={isRemoteOnly}
              setIsRemoteOnly={setIsRemoteOnly}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-9">
          {featured.length > 0 && selectedCategory === 'All' && !searchQuery && (
            <section className="mb-12">
              <h2 className="text-2xl font-black italic uppercase tracking-tight mb-6 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-amber-500" /> Featured Picks
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featured.map(o => (
                  <OpportunityCard
                    key={o.id}
                    opportunity={o}
                    isBookmarked={bookmarks.includes(o.id)}
                    onBookmark={handleBookmark}
                    onClick={onSelectOpportunity}
                  />
                ))}
              </div>
            </section>
          )}

          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black italic uppercase tracking-tight">
                {selectedCategory === 'All' ? 'Latest Opportunities' : `${selectedCategory}`}
              </h2>
              <span className="text-sm font-bold text-slate-400">{opportunities.length} Results</span>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 4, 5, 6].map(i => (
                  <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
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
              <div className="text-center py-24 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No opportunities found</h3>
                <p className="text-slate-500">Try adjusting your filters or search query.</p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};
