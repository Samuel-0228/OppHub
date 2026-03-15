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

  if (!user) return <div className="text-center py-24">Please sign in to view your bookmarks.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-black italic uppercase tracking-tight mb-2">My Bookmarks</h1>
        <p className="text-slate-500">Opportunities you've saved for later.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : opportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimatePresence>
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
        <div className="text-center py-24 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookmarkIcon className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No bookmarks yet</h3>
          <p className="text-slate-500">Start saving opportunities to see them here.</p>
          <a href="/" className="inline-block mt-6 px-8 py-3 bg-black text-white font-bold rounded-full">
            Explore Opportunities
          </a>
        </div>
      )}
    </div>
  );
};
