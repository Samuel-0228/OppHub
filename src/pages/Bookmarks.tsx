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
    <div className="max-w-7xl mx-auto px-6 py-32 text-center">
      <h2 className="text-4xl font-serif font-bold text-foreground mb-4">A private collection</h2>
      <p className="text-muted mb-8">Please sign in to view your saved opportunities.</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-16">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary px-3 py-1 bg-primary/10 rounded-full">Saved</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4 tracking-tight">
          My Bookmarks
        </h1>
        <p className="text-muted max-w-md">
          A personal archive of opportunities you've curated for your future.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-96 bg-muted/5 rounded-3xl animate-pulse border border-border" />
          ))}
        </div>
      ) : opportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
        <div className="text-center py-32 bg-white border border-dashed border-border rounded-[2.5rem] shadow-sm">
          <div className="w-24 h-24 bg-muted/5 rounded-full flex items-center justify-center mx-auto mb-8">
            <BookmarkIcon className="w-10 h-10 text-muted/20" />
          </div>
          <h3 className="text-3xl font-serif font-bold text-foreground mb-4">Your archive is empty</h3>
          <p className="text-muted max-w-xs mx-auto mb-10">
            Explore the platform and save opportunities that resonate with your goals.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-10 py-4 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
          >
            Explore Opportunities
          </button>
        </div>
      )}
    </div>
  );
};
