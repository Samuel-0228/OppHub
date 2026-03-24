import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, increment, collection, query, where, limit, getDocs } from 'firebase/firestore';
import { Opportunity } from '../types';
import { Calendar, MapPin, Building2, ExternalLink, ChevronRight, Radio } from 'lucide-react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { OpportunityCard } from '../components/OpportunityCard';
import { format } from 'date-fns';

interface Props {
  id: string;
  onBack: () => void;
  onNavigateHome: () => void;
  onSelectRelated: (id: string) => void;
}

export const OpportunityDetail: React.FC<Props> = ({ id, onBack, onNavigateHome, onSelectRelated }) => {
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [related, setRelated] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpportunity = async () => {
      const docRef = doc(db, 'opportunities', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setOpportunity({ id: docSnap.id, ...docSnap.data() } as Opportunity);
        await updateDoc(docRef, { viewCount: increment(1) });
      }
      setLoading(false);
    };
    fetchOpportunity();
  }, [id]);

  useEffect(() => {
    if (!opportunity) return;
    let cancelled = false;
    (async () => {
      const q = query(
        collection(db, 'opportunities'),
        where('isApproved', '==', true),
        where('category', '==', opportunity.category),
        limit(16)
      );
      try {
        const snap = await getDocs(q);
        if (cancelled) return;
        const list = snap.docs
          .map((d) => ({ id: d.id, ...d.data() } as Opportunity))
          .filter((o) => o.id !== opportunity.id)
          .slice(0, 3);
        setRelated(list);
      } catch {
        setRelated([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [opportunity?.id, opportunity?.category]);

  if (loading) {
    return (
      <div className="oh-page-fade max-w-7xl mx-auto px-5 py-16 space-y-10">
        <div className="h-3 w-40 bg-[var(--oh-surface)] rounded-full animate-pulse border border-[var(--oh-border)]" />
        <div className="space-y-4 max-w-3xl">
          <div className="h-14 w-full bg-[var(--oh-surface)] rounded-[var(--oh-radius-lg)] animate-pulse border border-[var(--oh-border)]" />
          <div className="h-14 w-2/3 bg-[var(--oh-surface)] rounded-[var(--oh-radius-lg)] animate-pulse border border-[var(--oh-border)]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-[var(--oh-surface)] rounded-[var(--oh-radius-lg)] animate-pulse border border-[var(--oh-border)]" />
          ))}
        </div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="oh-page-fade max-w-7xl mx-auto px-5 py-28 text-center">
        <div className="w-20 h-20 rounded-2xl bg-[var(--oh-accent-dim)] border border-[var(--oh-border)] flex items-center justify-center mx-auto mb-8">
          <span className="text-3xl text-[var(--oh-accent)]">?</span>
        </div>
        <h2 className="text-3xl font-bold text-[var(--oh-text)] mb-3" style={{ fontFamily: 'var(--oh-font-display)' }}>
          Post not found
        </h2>
        <p className="text-[var(--oh-text-muted)] mb-10 max-w-md mx-auto">This opportunity may have been removed or the link is outdated.</p>
        <button type="button" onClick={onBack} className="btn-primary px-8">
          Back to feed
        </button>
      </div>
    );
  }

  const sourceLabel = opportunity.sourceChannel?.trim() || 'Telegram';
  const published = format(new Date(opportunity.createdAt), 'MMMM d, yyyy');

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="oh-page-fade max-w-7xl mx-auto px-5 py-10 md:py-14">
      <nav className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--oh-text-muted)] mb-10">
        <button type="button" onClick={onNavigateHome} className="hover:text-[var(--oh-accent-bright)] transition-colors">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-[var(--oh-text-subtle)] shrink-0" />
        <button type="button" onClick={onBack} className="hover:text-[var(--oh-accent-bright)] transition-colors">
          Opportunities
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-[var(--oh-text-subtle)] shrink-0" />
        <span className="text-[var(--oh-text-subtle)] truncate max-w-[min(52vw,240px)] normal-case tracking-normal font-medium">
          {opportunity.title}
        </span>
      </nav>

      <header className="mb-14">
        <div className="flex flex-wrap gap-2 mb-8">
          <span className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full bg-[var(--oh-accent-dim)] text-[var(--oh-accent-bright)] border border-[var(--oh-border)]">
            {opportunity.category}
          </span>
          {opportunity.isRemote && (
            <span className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full bg-[var(--oh-success-dim)] text-[var(--oh-success)] border border-[var(--oh-border)]">
              Remote
            </span>
          )}
        </div>

        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-[var(--oh-text)] mb-8 leading-[1.08] max-w-4xl"
          style={{ fontFamily: 'var(--oh-font-display)' }}
        >
          {opportunity.title}
        </h1>

        <div className="flex flex-wrap gap-4 text-sm text-[var(--oh-text-muted)] mb-10">
          <span className="inline-flex items-center gap-2">
            <Radio className="w-4 h-4 text-[var(--oh-accent)]" />
            <span className="font-medium text-[var(--oh-text)]">{sourceLabel}</span>
          </span>
          <span className="text-[var(--oh-text-subtle)]">·</span>
          <span className="tabular-nums">{published}</span>
          {opportunity.tags && opportunity.tags.length > 0 && (
            <>
              <span className="text-[var(--oh-text-subtle)] hidden sm:inline">·</span>
              <span className="text-[var(--oh-text-subtle)] w-full sm:w-auto">
                {opportunity.tags.slice(0, 4).join(' · ')}
              </span>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Organization', value: opportunity.organization || '—', icon: Building2 },
            { label: 'Location', value: opportunity.location || '—', icon: MapPin },
            {
              label: 'Deadline',
              value: opportunity.deadline
                ? format(new Date(opportunity.deadline), 'MMM d, yyyy')
                : 'Open',
              icon: Calendar,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="p-6 rounded-[var(--oh-radius-lg)] bg-[var(--oh-elevated)] border border-[var(--oh-border)] flex gap-4 items-start"
            >
              <div className="p-2.5 rounded-[var(--oh-radius)] bg-[var(--oh-accent-dim)] border border-[var(--oh-border)]">
                <item.icon className="w-5 h-5 text-[var(--oh-accent)]" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--oh-text-subtle)] block mb-1">{item.label}</span>
                <p className="text-lg font-bold text-[var(--oh-text)] leading-snug">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        <article className="lg:col-span-8 space-y-14">
          <section>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--oh-text-subtle)] mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-[var(--oh-accent)]/60" />
              Overview
            </h2>
            <div className="oh-prose whitespace-pre-wrap">{opportunity.description}</div>
          </section>

          {opportunity.seoArticle && (
            <section className="relative p-8 md:p-10 rounded-[var(--oh-radius-xl)] bg-[var(--oh-surface)] border border-[var(--oh-border)] overflow-hidden">
              <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[var(--oh-accent-dim)] blur-3xl opacity-60 pointer-events-none" />
              <h2 className="text-2xl font-bold text-[var(--oh-text)] mb-6 relative" style={{ fontFamily: 'var(--oh-font-display)' }}>
                Application guide
              </h2>
              <div className="oh-prose relative">
                <ReactMarkdown>{opportunity.seoArticle}</ReactMarkdown>
              </div>
            </section>
          )}

          <section className="relative p-8 rounded-[var(--oh-radius-xl)] text-center border border-[var(--oh-border-strong)] bg-gradient-to-br from-[var(--oh-accent-dim)] to-transparent overflow-hidden">
            <h3 className="text-xl font-bold text-[var(--oh-text)] mb-2" style={{ fontFamily: 'var(--oh-font-display)' }}>
              Get alerts on Telegram
            </h3>
            <p className="text-sm text-[var(--oh-text-muted)] mb-8 max-w-md mx-auto">
              Join the channel for raw drops before they hit the blog.
            </p>
            <a
              href="https://t.me/your_channel"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 btn-primary"
            >
              Join channel <ExternalLink className="w-4 h-4" />
            </a>
          </section>
        </article>

        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-28 space-y-5">
            {opportunity.applyLink ? (
              <a
                href={opportunity.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 py-4 rounded-[var(--oh-radius-lg)] btn-primary text-base"
              >
                Apply now <ExternalLink className="w-5 h-5" />
              </a>
            ) : (
              <p className="text-center text-sm text-[var(--oh-text-subtle)] py-4 rounded-[var(--oh-radius-lg)] border border-dashed border-[var(--oh-border)]">
                Application link not available
              </p>
            )}

            <div className="p-6 rounded-[var(--oh-radius-lg)] bg-[var(--oh-elevated)] border border-[var(--oh-border)]">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--oh-text-subtle)] mb-4">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {opportunity.tags?.length ? (
                  opportunity.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-[var(--oh-surface)] border border-[var(--oh-border)] text-[var(--oh-text-muted)]"
                    >
                      #{tag}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-[var(--oh-text-subtle)]">No tags</span>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-20 pt-16 border-t border-[var(--oh-border)]">
          <h2 className="text-2xl font-bold text-[var(--oh-text)] mb-2" style={{ fontFamily: 'var(--oh-font-display)' }}>
            Related opportunities
          </h2>
          <p className="text-sm text-[var(--oh-text-muted)] mb-10">More in {opportunity.category}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((o) => (
              <OpportunityCard key={o.id} opportunity={o} onClick={onSelectRelated} />
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
};
