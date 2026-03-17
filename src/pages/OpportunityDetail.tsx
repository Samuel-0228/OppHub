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
      className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-12 py-16"
    >
      <button
        onClick={onBack}
        className="group flex items-center text-xs font-display font-bold text-ink/30 hover:text-ink mb-12 transition-colors uppercase tracking-[0.2em]"
      >
        <ArrowLeft className="w-4 h-4 mr-3 transition-transform group-hover:-translate-x-1" /> Back to List
      </button>

      <div className="mb-20">
        <div className="flex flex-wrap gap-3 mb-10">
          <span className="px-5 py-2 bg-ink text-paper text-[10px] font-display font-bold uppercase tracking-[0.2em] rounded-full">
            {opportunity.category}
          </span>
          {opportunity.isRemote && (
            <span className="px-5 py-2 bg-accent/10 text-accent text-[10px] font-display font-bold uppercase tracking-[0.2em] rounded-full">
              Remote Available
            </span>
          )}
        </div>

        <h1 className="text-5xl md:text-7xl font-serif font-bold text-ink mb-12 leading-[1.1] tracking-tight">
          {opportunity.title}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 sloth-card overflow-hidden">
          <div className="p-10 border-r border-ink/5">
            <span className="text-[10px] font-display font-bold uppercase tracking-[0.3em] text-ink/30 block mb-4">Organization</span>
            <div className="flex items-center font-serif text-2xl font-bold text-ink">
              <Building2 className="w-5 h-5 mr-3 text-accent" /> {opportunity.organization || 'N/A'}
            </div>
          </div>
          <div className="p-10 border-r border-ink/5">
            <span className="text-[10px] font-display font-bold uppercase tracking-[0.3em] text-ink/30 block mb-4">Location</span>
            <div className="flex items-center font-serif text-2xl font-bold text-ink">
              <MapPin className="w-5 h-5 mr-3 text-accent" /> {opportunity.location || 'N/A'}
            </div>
          </div>
          <div className="p-10">
            <span className="text-[10px] font-display font-bold uppercase tracking-[0.3em] text-ink/30 block mb-4">Deadline</span>
            <div className="flex items-center font-serif text-2xl font-bold text-ink">
              <Calendar className="w-5 h-5 mr-3 text-accent" /> {opportunity.deadline ? new Date(opportunity.deadline).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : 'Open'}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
        <div className="lg:col-span-8 space-y-20">
          <section>
            <h2 className="text-[10px] font-display font-bold uppercase tracking-[0.4em] text-ink/30 mb-10 flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-accent rounded-full" /> Description
            </h2>
            <div className="prose prose-lg max-w-none text-ink/70 leading-relaxed font-sans font-light whitespace-pre-wrap">
              {opportunity.description}
            </div>
          </section>

          {opportunity.seoArticle && (
            <section className="p-12 bg-earth text-paper rounded-[3rem] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -mr-32 -mt-32" />
              <h2 className="text-3xl font-serif font-bold mb-10 text-accent">
                Application Guide
              </h2>
              <div className="prose prose-invert prose-lg max-w-none text-paper/80 font-sans font-light">
                <ReactMarkdown>{opportunity.seoArticle}</ReactMarkdown>
              </div>
            </section>
          )}

          <section className="p-12 bg-accent/5 rounded-[3rem] text-center border border-accent/10">
            <h3 className="text-2xl font-serif font-bold text-ink mb-4">Join our Telegram Community</h3>
            <p className="text-ink/50 font-display uppercase tracking-widest text-xs mb-10">Get real-time updates and more opportunities</p>
            <a
              href="https://t.me/your_channel"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-3"
            >
              Join Channel <ExternalLink className="w-4 h-4" />
            </a>
          </section>
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-32 space-y-8">
            <a
              href={opportunity.applyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full btn-primary flex items-center justify-center gap-3 !py-6 text-lg"
            >
              Apply Now <ExternalLink className="w-5 h-5" />
            </a>
            
            <button className="w-full btn-secondary flex items-center justify-center gap-3 !py-6 text-lg">
              <Share2 className="w-5 h-5" /> Share
            </button>

            <div className="p-10 sloth-card">
              <h4 className="text-[10px] font-display font-bold uppercase tracking-[0.3em] text-ink/30 mb-8">Tags</h4>
              <div className="flex flex-wrap gap-3">
                {opportunity.tags?.map(tag => (
                  <span key={tag} className="px-4 py-2 bg-ink/5 text-[10px] font-display font-bold text-ink/60 rounded-full uppercase tracking-widest hover:bg-ink hover:text-paper transition-all cursor-pointer">
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
