import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { Opportunity, UserProfile } from '../types';
import { Check, X, Edit2, Trash2, ExternalLink, Eye, Star, StarOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  user: UserProfile | null;
}

export const Admin: React.FC<Props> = ({ user }) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') return;

    const q = query(collection(db, 'opportunities'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOpportunities(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Opportunity)));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleApprove = (id: string, status: boolean) => {
    updateDoc(doc(db, 'opportunities', id), { isApproved: status });
  };

  const handleFeature = (id: string, status: boolean) => {
    updateDoc(doc(db, 'opportunities', id), { isFeatured: status });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this opportunity?')) {
      deleteDoc(doc(db, 'opportunities', id));
    }
  };

  if (user?.role !== 'admin') {
    return <div className="text-center py-24">Access Denied.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent px-2 py-1 bg-accent/10 rounded">Control Center</span>
            <div className="h-[1px] w-12 bg-accent/30" />
          </div>
          <h1 className="text-6xl font-serif font-light tracking-tight text-ink mb-4">
            Admin <span className="italic">Dashboard</span>
          </h1>
          <p className="text-ink/60 font-sans max-w-md">
            Review, approve, and curate the best opportunities for the community.
          </p>
        </div>
        <div className="flex gap-6">
          <div className="px-8 py-6 bg-white border border-ink/5 rounded-[2rem] shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30 block mb-1">Pending</span>
            <span className="text-3xl font-serif italic text-amber-600">{opportunities.filter(o => !o.isApproved).length}</span>
          </div>
          <div className="px-8 py-6 bg-white border border-ink/5 rounded-[2rem] shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30 block mb-1">Total</span>
            <span className="text-3xl font-serif italic text-ink">{opportunities.length}</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-ink/10 rounded-[2.5rem] overflow-hidden shadow-xl shadow-ink/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-ink/5 border-b border-ink/10">
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40">Opportunity</th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40">Category</th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40">Status</th>
                <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              <AnimatePresence mode="popLayout">
                {opportunities.map((o) => (
                  <motion.tr
                    key={o.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="hover:bg-ink/[0.02] transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="font-serif text-xl text-ink mb-1 group-hover:text-accent transition-colors">{o.title}</div>
                      <div className="text-xs font-sans text-ink/40 uppercase tracking-widest">{o.organization || 'Independent'}</div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-ink/5 text-[10px] font-bold uppercase tracking-widest rounded-full text-ink/60">
                        {o.category}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      {o.isApproved ? (
                        <div className="flex items-center gap-2 text-emerald-600">
                          <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-pulse" />
                          <span className="text-xs font-bold uppercase tracking-widest">Approved</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-amber-600">
                          <div className="w-1.5 h-1.5 bg-amber-600 rounded-full" />
                          <span className="text-xs font-bold uppercase tracking-widest">Pending</span>
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleApprove(o.id, !o.isApproved)}
                          className={`p-3 rounded-2xl transition-all duration-300 ${
                            o.isApproved 
                              ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' 
                              : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                          }`}
                          title={o.isApproved ? "Unapprove" : "Approve"}
                        >
                          {o.isApproved ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleFeature(o.id, !o.isFeatured)}
                          className={`p-3 rounded-2xl transition-all duration-300 ${
                            o.isFeatured 
                              ? 'bg-accent text-ink shadow-lg shadow-accent/20' 
                              : 'bg-ink/5 text-ink/30 hover:bg-ink/10'
                          }`}
                          title={o.isFeatured ? "Unfeature" : "Feature"}
                        >
                          {o.isFeatured ? <Star className="w-4 h-4 fill-current" /> : <Star className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDelete(o.id)}
                          className="p-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-2xl transition-all duration-300"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <a
                          href={o.applyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-ink/5 text-ink/60 hover:bg-ink/10 rounded-2xl transition-all duration-300"
                          title="View Source"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Clock = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
