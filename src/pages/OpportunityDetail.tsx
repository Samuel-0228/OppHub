import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { Opportunity } from '../types';
import { Calendar, MapPin, Building2, Globe, ExternalLink, ArrowLeft, Share2, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';

interface Props {
  id: string;
  onBack: () => void;
}

export const OpportunityDetail: React.FC<Props> = ({ id, onBack }) => {
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpportunity = async () => {
      const docRef = doc(db, 'opportunities', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setOpportunity({ id: docSnap.id, ...docSnap.data() } as Opportunity);
        // Increment view count
        await updateDoc(docRef, { viewCount: increment(1) });
      }
      setLoading(false);
    };
    fetchOpportunity();
  }, [id]);

  if (loading) return <div className="max-w-4xl mx-auto p-12 animate-pulse space-y-8">
    <div className="h-8 bg-slate-100 rounded w-1/4" />
    <div className="h-12 bg-slate-100 rounded w-3/4" />
    <div className="h-64 bg-slate-100 rounded w-full" />
  </div>;

  if (!opportunity) return <div className="text-center py-24">Opportunity not found.</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto px-4 py-12"
    >
      <button
        onClick={onBack}
        className="flex items-center text-sm font-bold text-slate-400 hover:text-black mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
      </button>

      <div className="mb-12">
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="px-4 py-1.5 bg-black text-white text-xs font-black uppercase tracking-widest rounded-full">
            {opportunity.category}
          </span>
          {opportunity.isRemote && (
            <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-black uppercase tracking-widest rounded-full">
              Remote
            </span>
          )}
        </div>

        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-8 leading-tight">
          {opportunity.title}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 bg-slate-50 rounded-3xl border border-black/5">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Organization</span>
            <div className="flex items-center font-bold text-slate-900">
              <Building2 className="w-4 h-4 mr-2 text-slate-400" /> {opportunity.organization || 'N/A'}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Location</span>
            <div className="flex items-center font-bold text-slate-900">
              <MapPin className="w-4 h-4 mr-2 text-slate-400" /> {opportunity.location || 'N/A'}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Deadline</span>
            <div className="flex items-center font-bold text-slate-900">
              <Calendar className="w-4 h-4 mr-2 text-slate-400" /> {opportunity.deadline ? new Date(opportunity.deadline).toLocaleDateString() : 'N/A'}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          <section>
            <h2 className="text-xl font-black uppercase tracking-tight mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" /> Description
            </h2>
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap">
              {opportunity.description}
            </div>
          </section>

          {opportunity.seoArticle && (
            <section className="p-8 bg-black text-white rounded-3xl">
              <h2 className="text-xl font-black uppercase tracking-tight mb-6 text-amber-400">
                Application Guide & Tips
              </h2>
              <div className="prose prose-invert max-w-none text-slate-300">
                <ReactMarkdown>{opportunity.seoArticle}</ReactMarkdown>
              </div>
            </section>
          )}

          <section className="p-8 border-2 border-dashed border-slate-200 rounded-3xl text-center">
            <h3 className="text-lg font-bold mb-2">Join our Telegram Community</h3>
            <p className="text-slate-500 mb-6">Get real-time updates and more opportunities like this.</p>
            <a
              href="https://t.me/your_channel"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-3 bg-[#0088cc] text-white font-bold rounded-full hover:bg-[#0077b5] transition-all"
            >
              Join Telegram Channel
            </a>
          </section>
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            <a
              href={opportunity.applyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-4 bg-black text-white font-black uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-black/10 active:scale-95"
            >
              Apply Now <ExternalLink className="w-4 h-4" />
            </a>
            
            <button className="w-full flex items-center justify-center gap-2 py-4 bg-white border border-black/5 text-slate-900 font-bold rounded-2xl hover:bg-slate-50 transition-all">
              <Share2 className="w-4 h-4" /> Share Opportunity
            </button>

            <div className="p-6 bg-slate-50 rounded-2xl border border-black/5">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {opportunity.tags?.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-white border border-black/5 text-[10px] font-bold text-slate-600 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
