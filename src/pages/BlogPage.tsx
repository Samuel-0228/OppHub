import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockOpportunities } from '../data/mockData';
import { 
  ArrowLeft, Clock, Facebook, Twitter, Linkedin, 
  Send, MessageCircle, Share2, Sparkles, BookOpen,
  Bookmark
} from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Button, Card, Badge } from '../components/ui-elements';

export const BlogPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const opp = mockOpportunities.find(o => o.id === id) || mockOpportunities[0];

  return (
    <div className="min-h-screen bg-background transition-colors duration-500 pb-24">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link to="/" className="inline-flex items-center gap-3 text-sm font-bold text-muted-foreground hover:text-primary transition-all mb-16 group">
            <div className="p-2.5 bg-secondary rounded-xl group-hover:scale-110 transition-transform">
              <ArrowLeft className="w-4 h-4 text-primary" />
            </div>
            Back to Feed
          </Link>
        </motion.div>

        <header className="mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 text-xs font-black text-primary mb-8"
          >
            <Badge variant="accent">Human Guide</Badge>
            <span className="flex items-center gap-2 text-muted-foreground uppercase tracking-widest">
              <Clock className="w-4 h-4 text-primary/60" />
              8 Minute Deep Dive
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-foreground mb-12 tracking-tighter leading-[1]"
          >
            Winning at <br /> {opp.title}.
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between pb-10 border-b border-border/50"
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-primary/20">
                OT
              </div>
              <div>
                <p className="text-lg font-black text-foreground tracking-tight">OpporTunix Editorial</p>
                <p className="text-sm text-muted-foreground font-medium">Published {format(new Date(opp.postedAt), 'MMMM dd, yyyy')}</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2">
               <Button variant="outline" size="sm" className="rounded-xl"><Bookmark className="w-4 h-4 mr-2" /> Save Guide</Button>
               <Button variant="outline" size="sm" className="rounded-xl"><Share2 className="w-4 h-4" /></Button>
            </div>
          </motion.div>
        </header>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="aspect-[16/9] w-full rounded-[3rem] overflow-hidden mb-20 border border-border/40 shadow-2xl relative group"
        >
          <div className="absolute inset-0 bg-primary/10 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity" />
          <img 
            src={opp.image || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4'} 
            alt={opp.title}
            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
          />
          <div className="absolute bottom-8 left-8 right-8">
            <div className="bg-white/10 backdrop-blur-3xl border border-white/20 p-6 rounded-[2rem] text-white flex justify-between items-center">
               <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-1">Cover Organization</p>
                  <p className="text-xl font-bold">{opp.organization}</p>
               </div>
               <Sparkles className="w-8 h-8 text-accent animate-pulse" />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-20">
          <article className="space-y-12">
            <div className="prose prose-xl dark:prose-invert max-w-none">
              <p className="text-2xl text-foreground font-medium leading-relaxed mb-12 tracking-tight">
                Finding the right role is only half the battle. Securing the {opp.title} requires a blend of strategic preparation and human intuition. In this comprehensive breakdown, we'll explore why this program is a career-defining move.
              </p>

              <h2 className="text-3xl font-black text-foreground mt-16 mb-8 tracking-tight flex items-center gap-4">
                <div className="w-8 h-1 bg-primary rounded-full" />
                Decoding the Mission
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Hosted by {opp.organization}, this initiative is more than just a typical {opp.category.toLowerCase()}. It's an ecosystem designed to accelerate {opp.tags.join(' and ')} excellence. Based in {opp.location}, it serves as a central hub for innovation.
              </p>

              <div className="my-16 bg-card border border-border/50 rounded-[2.5rem] p-10 md:p-14 relative overflow-hidden">
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/5 blur-3xl rounded-full" />
                <h3 className="text-2xl font-black mb-8 relative z-10">Strategic Advantages</h3>
                <ul className="space-y-6 relative z-10">
                  <li className="flex gap-4">
                    <div className="shrink-0 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-bold">1</div>
                    <p className="text-muted-foreground font-medium">Access to internal {opp.organization} proprietary toolkits and mentors.</p>
                  </li>
                  <li className="flex gap-4">
                    <div className="shrink-0 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-bold">2</div>
                    <p className="text-muted-foreground font-medium">Networking with global cohorts from top-tier institutions.</p>
                  </li>
                  <li className="flex gap-4">
                    <div className="shrink-0 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-bold">3</div>
                    <p className="text-muted-foreground font-medium">Pathways to full-time roles or continued research funding.</p>
                  </li>
                </ul>
              </div>

              <h2 className="text-3xl font-black text-foreground mt-16 mb-8 tracking-tight flex items-center gap-4">
                <div className="w-8 h-1 bg-primary rounded-full" />
                The Deadline Context
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg mb-10">
                Precision is key. The application portal closes on {format(new Date(opp.deadline), 'PPPP')}. We recommend submitting at least 48 hours early to avoid technical bottlenecks.
              </p>
            </div>
          </article>

          <aside className="space-y-12">
            <Card className="p-8 rounded-[2rem] bg-secondary/30 border-border/40">
              <h4 className="text-xs font-black text-foreground uppercase tracking-[0.2em] mb-8">Quick Navigation</h4>
              <div className="space-y-6">
                 <NavPoint label="Overview" active />
                 <NavPoint label="Eligibility" />
                 <NavPoint label="Application Steps" />
                 <NavPoint label="Internal Insights" />
              </div>
            </Card>

            <div className="bg-primary rounded-[2rem] p-8 text-primary-foreground text-center relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
               <Send className="w-10 h-10 mx-auto mb-6 opacity-80" />
               <h4 className="font-black text-xl mb-4 leading-tight">Get the <br /> Human Edge.</h4>
               <p className="text-xs font-medium opacity-80 mb-8 leading-relaxed">Daily curation of 1,000+ sources delivered to your Telegram.</p>
               <Button className="w-full bg-white text-primary rounded-xl font-black text-xs uppercase tracking-widest">Join Telegram</Button>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-4">Share</h4>
              <div className="flex flex-wrap gap-2">
                 <ShareIcon icon={<Twitter className="w-4 h-4" />} />
                 <ShareIcon icon={<Linkedin className="w-4 h-4" />} />
                 <ShareIcon icon={<Facebook className="w-4 h-4" />} />
                 <ShareIcon icon={<MessageCircle className="w-4 h-4" />} />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

const NavPoint = ({ label, active = false }: { label: string, active?: boolean }) => (
  <div className={`flex items-center gap-3 text-sm font-bold cursor-pointer transition-colors ${active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
    <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]' : 'bg-border'}`} />
    {label}
  </div>
);

const ShareIcon = ({ icon }: { icon: React.ReactNode }) => (
  <button className="w-12 h-12 flex items-center justify-center bg-card border border-border/50 rounded-2xl text-muted-foreground hover:text-primary hover:border-primary/50 transition-all">
    {icon}
  </button>
);