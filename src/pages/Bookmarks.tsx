import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { Opportunity, UserProfile } from '../types';
import { OpportunityCard } from '../components/OpportunityCard';
import { Bookmark as BookmarkIcon, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
      const opportunityIds = snapshot.docs.map(doc => doc.data().opportunityId);
      
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

  if (!user) return (
    <div className="max-w-7xl mx-auto px-4 py-32 text-center">
      <h2 className="text-4xl font-serif italic text-ink mb-4">A private collection</h2>
      <p className="text-ink/60 mb-8">Please sign in to view your saved opportunities.</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <div className="mb-16">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent px-2 py-1 bg-accent/10 rounded">Saved</span>
          <div className="h-[1px] w-12 bg-accent/30" />
        </div>
        <h1 className="text-6xl font-serif font-light tracking-tight text-ink mb-4">
          My <span className="italic">Bookmarks</span>
        </h1>
        <p className="text-ink/60 font-sans max-w-md">
          A personal archive of opportunities you've curated for your future.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-96 bg-ink/5 rounded-[2rem] animate-pulse border border-ink/10" />
          ))}
        </div>
      ) : opportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <AnimatePresence mode="popLayout">
            {opportunities.map(o => (
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
        <div className="text-center py-32 bg-white border border-dashed border-ink/10 rounded-[3rem] shadow-sm">
          <div className="w-24 h-24 bg-ink/5 rounded-full flex items-center justify-center mx-auto mb-8">
            <BookmarkIcon className="w-10 h-10 text-ink/20" />
          </div>
          <h3 className="text-3xl font-serif italic text-ink mb-4">Your archive is empty</h3>
          <p className="text-ink/60 font-sans max-w-xs mx-auto mb-10">
            Explore the platform and save opportunities that resonate with your goals.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-10 py-4 bg-ink text-paper rounded-full font-sans font-bold hover:bg-accent hover:text-ink transition-all duration-300 shadow-xl shadow-ink/10 active:scale-95"
          >
            Explore Opportunities
          </button>
        </div>
      )}
    </div>
  );
};
