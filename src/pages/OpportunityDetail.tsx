import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { Opportunity } from '../types';
import { Calendar, MapPin, Building2, Globe, ExternalLink, ArrowLeft, Share2, MessageSquare, X } from 'lucide-react';
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

  if (loading) return (
    <div className="max-w-7xl mx-auto px-6 py-24 space-y-12">
      <div className="h-4 w-32 bg-muted/10 animate-pulse rounded-full" />
      <div className="space-y-4">
        <div className="h-16 w-3/4 bg-muted/10 animate-pulse rounded-2xl" />
        <div className="h-16 w-1/2 bg-muted/10 animate-pulse rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="h-32 bg-muted/10 animate-pulse rounded-3xl" />
        <div className="h-32 bg-muted/10 animate-pulse rounded-3xl" />
        <div className="h-32 bg-muted/10 animate-pulse rounded-3xl" />
      </div>
    </div>
  );

  if (!opportunity) return (
    <div className="max-w-7xl mx-auto px-6 py-32 text-center">
      <div className="w-24 h-24 bg-muted/5 rounded-full flex items-center justify-center mx-auto mb-8">
        <X className="w-10 h-10 text-muted/20" />
      </div>
      <h2 className="text-4xl font-serif font-bold text-foreground mb-4">Lost in the archive</h2>
      <p className="text-muted mb-10">This opportunity could not be found or has been removed.</p>
      <button 
        onClick={onBack}
        className="px-10 py-4 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
      >
        Back to Opportunities
      </button>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-6 py-12"
    >
      <button
        onClick={onBack}
        className="group flex items-center text-xs font-bold text-muted hover:text-primary mb-12 transition-colors uppercase tracking-widest"
      >
        <ArrowLeft className="w-4 h-4 mr-3 transition-transform group-hover:-translate-x-1" /> Back to List
      </button>

      <div className="mb-16">
        <div className="flex flex-wrap gap-3 mb-8">
          <span className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full">
            {opportunity.category}
          </span>
          {opportunity.isRemote && (
            <span className="px-4 py-1.5 bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-widest rounded-full">
              Remote Available
            </span>
          )}
        </div>

        <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-10 leading-tight tracking-tight max-w-4xl">
          {opportunity.title}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 bg-white border border-border rounded-3xl shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted block mb-3">Organization</span>
            <div className="flex items-center text-xl font-bold text-foreground">
              <Building2 className="w-5 h-5 mr-3 text-primary" /> {opportunity.organization || 'N/A'}
            </div>
          </div>
          <div className="p-8 bg-white border border-border rounded-3xl shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted block mb-3">Location</span>
            <div className="flex items-center text-xl font-bold text-foreground">
              <MapPin className="w-5 h-5 mr-3 text-primary" /> {opportunity.location || 'N/A'}
            </div>
          </div>
          <div className="p-8 bg-white border border-border rounded-3xl shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted block mb-3">Deadline</span>
            <div className="flex items-center text-xl font-bold text-foreground">
              <Calendar className="w-5 h-5 mr-3 text-primary" /> {opportunity.deadline ? new Date(opportunity.deadline).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : 'Open'}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-16">
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted mb-8 flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" /> Description
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {opportunity.description}
            </div>
          </section>

          {opportunity.seoArticle && (
            <section className="p-10 bg-secondary rounded-[2.5rem] relative overflow-hidden border border-border">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
              <h2 className="text-2xl font-serif font-bold mb-8 text-foreground">
                Application Guide
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <ReactMarkdown>{opportunity.seoArticle}</ReactMarkdown>
              </div>
            </section>
          )}

          <section className="p-10 bg-primary/5 rounded-[2.5rem] text-center border border-primary/10">
            <h3 className="text-2xl font-serif font-bold text-foreground mb-3">Join our Telegram Community</h3>
            <p className="text-muted uppercase tracking-widest text-[10px] font-bold mb-8">Get real-time updates and more opportunities</p>
            <a
              href="https://t.me/your_channel"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
              Join Channel <ExternalLink className="w-4 h-4" />
            </a>
          </section>
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-32 space-y-6">
            <a
              href={opportunity.applyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-3 py-5 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
            >
              Apply Now <ExternalLink className="w-5 h-5" />
            </a>
            
            <button className="w-full flex items-center justify-center gap-3 py-5 bg-white border border-border text-foreground rounded-2xl font-bold text-lg hover:bg-muted/5 transition-all">
              <Share2 className="w-5 h-5 text-muted" /> Share
            </button>

            <div className="p-8 bg-white border border-border rounded-3xl shadow-sm">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted mb-6">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {opportunity.tags?.map(tag => (
                  <span key={tag} className="px-3 py-1.5 bg-muted/5 text-[10px] font-bold text-muted rounded-lg uppercase tracking-widest hover:bg-primary hover:text-white transition-all cursor-pointer">
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
