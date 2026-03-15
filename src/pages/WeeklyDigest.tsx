import React from 'react';
import { mockOpportunities } from '../data/mockData';
import { OpportunityCard } from '../components/OpportunityCard';
import { Trophy, Star, Sparkles, TrendingUp, Calendar, Zap, ArrowRight, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, Card, Badge } from '../components/ui-elements';

export const WeeklyDigest: React.FC = () => {
  const topInternships = mockOpportunities.filter(o => o.category === 'Internships').slice(0, 2);
  const topScholarships = mockOpportunities.filter(o => o.category === 'Scholarships').slice(0, 2);

  return (
    <div className="min-h-screen bg-background pb-24 transition-colors duration-500">
      <div className="relative bg-primary pt-24 pb-48 px-4 overflow-hidden">
        {/* Animated background shapes */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1], 
            opacity: [0.1, 0.2, 0.1], 
            rotate: [0, 90, 0] 
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-white rounded-full blur-[100px] -mr-64 -mt-64 pointer-events-none"
        />
        <motion.div 
           animate={{ 
            scale: [1, 1.3, 1], 
            opacity: [0.05, 0.1, 0.05], 
            x: [0, 100, 0] 
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-300 rounded-full blur-[100px] -ml-48 -mb-48 pointer-events-none"
        />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-xl text-white border border-white/20 px-6 py-2.5 rounded-full text-sm font-black mb-10 shadow-2xl"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="uppercase tracking-[0.2em]">The Weekly Insight • Issue #24</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-black text-white mb-10 tracking-tighter leading-[1]"
          >
            Picks of <br className="hidden md:block" /> the Week.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto font-medium leading-relaxed"
          >
            Hand-picked opportunities curated by our intelligence engine to accelerate your career growth.
          </motion.p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-24 relative z-20">
        <div className="space-y-24">
          <section>
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-card rounded-[1.5rem] shadow-xl border border-border/50 text-accent">
                  <Star className="w-8 h-8 fill-current" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-foreground tracking-tight">Featured Spotlight</h2>
                  <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs mt-1">Highly Recommended by Humans</p>
                </div>
              </div>
              <Button variant="outline" className="hidden sm:flex rounded-xl font-bold uppercase tracking-widest text-[10px]">
                View Archive
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {mockOpportunities.slice(0, 2).map((opp, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  key={opp.id}
                >
                  <OpportunityCard opportunity={opp} />
                </motion.div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
            <div className="lg:col-span-2 space-y-16">
              <section>
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-black text-foreground">Trending Internships</h3>
                </div>
                <div className="grid grid-cols-1 gap-8">
                  {topInternships.map(opp => (
                    <OpportunityCard key={opp.id} opportunity={opp} />
                  ))}
                </div>
                <div className="mt-12">
                  <Button variant="secondary" className="w-full py-8 rounded-2xl text-lg font-bold gap-3">
                    View All Internships <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </section>
            </div>

            <aside className="space-y-12">
              <Card className="p-10 rounded-[2.5rem] bg-card border-border/40 shadow-2xl shadow-black/5">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Elite Scholarships</h3>
                </div>
                <div className="space-y-10">
                  {topScholarships.map(opp => (
                    <div key={opp.id} className="group relative pl-6 border-l-2 border-border/50 hover:border-accent transition-colors">
                      <div className="absolute -left-[5px] top-0 w-[8px] h-[8px] rounded-full bg-border/50 group-hover:bg-accent transition-colors" />
                      <p className="text-[10px] font-black text-primary uppercase mb-2 tracking-[0.15em]">{opp.organization}</p>
                      <h4 className="text-base font-bold text-foreground group-hover:text-accent transition-colors mb-3 leading-tight">{opp.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{opp.description}</p>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-10 rounded-xl font-bold">
                  Browse All
                </Button>
              </Card>

              <div className="bg-secondary/50 backdrop-blur-xl rounded-[2.5rem] p-10 border border-border/50">
                <h4 className="font-black text-foreground text-xl mb-6 tracking-tight">Share this Digest</h4>
                <p className="text-muted-foreground mb-8 text-sm leading-relaxed font-medium">Help your network discover these curated opportunities.</p>
                <div className="flex gap-4">
                   <Button className="flex-1 rounded-xl" variant="secondary"><Share2 className="w-4 h-4 mr-2" /> Link</Button>
                   <Button className="flex-1 rounded-xl" variant="secondary">Twitter</Button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};