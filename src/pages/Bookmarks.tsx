import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { Opportunity, UserProfile } from '../types';
import { OpportunityCard } from '../components/OpportunityCard';
import { Bookmark as BookmarkIcon } from 'lucide-react';
import { AnimatePresence } from 'motion/react';

interface Props {
  user: UserProfile | null;
  onSelectOpportunity: (id: string) => void;
}

export const Bookmarks: React.FC<Props> = ({ user, onSelectOpportunity }) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(collection(db, `users/${user.uid}/bookmarks`), async (snapshot) => {
      const opportunityIds = snapshot.docs.map((d) => d.data().opportunityId);

      const opps: Opportunity[] = [];
      for (const id of opportunityIds) {
        const oppDoc = await getDoc(doc(db, 'opportunities', id));
        if (oppDoc.exists()) {
          opps.push({ id: oppDoc.id, ...oppDoc.data() } as Opportunity);
        }
      }

      setOpportunities(opps);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleRemoveBookmark = async (opportunityId: string) => {
    if (!user) return;
    const bookmarkId = `${user.uid}_${opportunityId}`;
    await deleteDoc(doc(db, `users/${user.uid}/bookmarks`, bookmarkId));
  };

  if (!user) {
    return (
      <div className="oh-page-fade max-w-2xl mx-auto px-5 py-28 text-center">
        <div className="oh-card p-12 md:p-14 !transform-none hover:!transform-none">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--oh-text)] mb-4" style={{ fontFamily: 'var(--oh-font-display)' }}>
            Sign in to save posts
          </h2>
          <p className="text-[var(--oh-text-muted)] leading-relaxed">
            Bookmarks stay in sync across devices so you can shortlist roles and programs in one place.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="oh-page-fade max-w-7xl mx-auto px-5 lg:px-8 py-12 md:py-16">
      <header className="mb-12 md:mb-16">
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--oh-accent-bright)] mb-3">Library</p>
        <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--oh-text)] tracking-tight mb-4" style={{ fontFamily: 'var(--oh-font-display)' }}>
          My bookmarks
        </h1>
        <p className="text-[var(--oh-text-muted)] max-w-xl text-lg leading-relaxed">
          Your private shortlist — revisit deadlines and links without losing context.
        </p>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-96 rounded-[var(--oh-radius-lg)] bg-[var(--oh-surface)] border border-[var(--oh-border)] animate-pulse"
            />
          ))}
        </div>
      ) : opportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {opportunities.map((o) => (
              <OpportunityCard
                key={o.id}
                opportunity={o}
                isBookmarked={true}
                onBookmark={handleRemoveBookmark}
                onClick={onSelectOpportunity}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-20 md:py-28 px-6 oh-card !transform-none hover:!transform-none border-dashed">
          <div className="w-16 h-16 rounded-2xl bg-[var(--oh-accent-dim)] border border-[var(--oh-border)] flex items-center justify-center mx-auto mb-6">
            <BookmarkIcon className="w-8 h-8 text-[var(--oh-accent)] opacity-90" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-[var(--oh-text)] mb-3" style={{ fontFamily: 'var(--oh-font-display)' }}>
            Nothing saved yet
          </h3>
          <p className="text-[var(--oh-text-muted)] max-w-md mx-auto mb-10">
            Tap the bookmark icon on any card to build your list.
          </p>
          <button type="button" onClick={() => (window.location.href = '/')} className="btn-primary px-8">
            Browse opportunities
          </button>
        </div>
      )}
    </div>
  );
};
