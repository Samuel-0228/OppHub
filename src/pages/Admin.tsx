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
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tight">Admin Dashboard</h1>
          <p className="text-slate-500">Manage imported opportunities from Telegram.</p>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-3 bg-slate-100 rounded-2xl">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Pending</span>
            <span className="text-xl font-bold">{opportunities.filter(o => !o.isApproved).length}</span>
          </div>
          <div className="px-6 py-3 bg-slate-100 rounded-2xl">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Total</span>
            <span className="text-xl font-bold">{opportunities.length}</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-black/5 rounded-3xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-black/5">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Opportunity</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            <AnimatePresence>
              {opportunities.map((o) => (
                <motion.tr
                  key={o.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 mb-1">{o.title}</div>
                    <div className="text-xs text-slate-400">{o.organization || 'No Organization'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-slate-100 text-[10px] font-bold uppercase tracking-wider rounded-full">
                      {o.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {o.isApproved ? (
                      <span className="flex items-center gap-1 text-emerald-500 text-xs font-bold">
                        <Check className="w-3 h-3" /> Approved
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                        <Clock className="w-3 h-3" /> Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(o.id, !o.isApproved)}
                        className={`p-2 rounded-xl transition-all ${
                          o.isApproved ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        }`}
                        title={o.isApproved ? "Unapprove" : "Approve"}
                      >
                        {o.isApproved ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleFeature(o.id, !o.isFeatured)}
                        className={`p-2 rounded-xl transition-all ${
                          o.isFeatured ? 'bg-amber-400 text-white' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                        }`}
                        title={o.isFeatured ? "Unfeature" : "Feature"}
                      >
                        {o.isFeatured ? <Star className="w-4 h-4 fill-white" /> : <Star className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete(o.id)}
                        className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <a
                        href={o.applyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl transition-all"
                        title="View Link"
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
  );
};

const Clock = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
