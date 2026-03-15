import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockOpportunities } from '../data/mockData';
import { 
  Calendar, MapPin, Building2, ExternalLink, Bookmark, 
  Clock, ArrowLeft, Send, CheckCircle2, Share2, Info, Sparkles,
  Award, Globe, ShieldCheck
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Button, Badge, Card } from '../components/ui-elements';

export const OpportunityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const opp = mockOpportunities.find(o => o.id === id);

  if (!opp) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <Info className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Opportunity not found</h2>
        <Button variant="primary" asChild>
          <Link to="/">Return Home</Link>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-24 transition-colors duration-500">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden border-b border-border/50 bg-card/30 backdrop-blur-3xl pt-12 pb-16 md:pt-20 md:pb-28">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-all mb-12 group">
              <div className="p-2 bg-secondary rounded-lg group-hover:scale-110 transition-transform">
                <ArrowLeft className="w-4 h-4 text-primary" />
              </div>
              Back to Discover
            </Link>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-32 h-32 md:w-48 md:h-48 rounded-[2.5rem] bg-secondary flex items-center justify-center border border-border/50 shadow-2xl shadow-primary/5 p-4 overflow-hidden relative group shrink-0"
            >
               <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              {opp.image ? (
                <img src={opp.image} alt={opp.organization} className="w-full h-full object-cover rounded-[1.8rem]" />
              ) : (
                <Building2 className="w-16 h-16 text-primary/40" />
              )}
            </motion.div>

            <div className="flex-1 space-y-8">
              <div className="flex flex-wrap gap-3">
                <Badge variant="accent">{opp.category}</Badge>
                <Badge variant="secondary">{opp.field}</Badge>
                {opp.isRemote && <Badge variant="outline" className="border-emerald-500/30 text-emerald-500 bg-emerald-500/5">Remote Friendly</Badge>}
              </div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-[1.1]"
              >
                {opp.title}
              </motion.h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-muted-foreground font-semibold">
                <div className="flex items-center gap-3 bg-secondary/30 p-3 rounded-2xl border border-border/50">
                  <Building2 className="w-5 h-5 text-primary" />
                  <span className="text-sm">{opp.organization}</span>
                </div>
                <div className="flex items-center gap-3 bg-secondary/30 p-3 rounded-2xl border border-border/50">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="text-sm">{opp.location}</span>
                </div>
                <div className="flex items-center gap-3 bg-secondary/30 p-3 rounded-2xl border border-border/50">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="text-sm">Deadline: {format(new Date(opp.deadline), 'MMM dd, yyyy')}</span>
                </div>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full lg:w-auto flex flex-col gap-4"
            >
              <Button 
                size="lg"
                onClick={() => toast.success('Opportunity saved to your dashboard!')}
                variant="outline"
                className="w-full h-16 rounded-2xl text-base font-bold gap-3 border-border/60 hover:border-primary"
              >
                <Bookmark className="w-5 h-5" />
                Save for Later
              </Button>
              <a 
                href={opp.applyLink}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-primary text-primary-foreground h-16 px-10 rounded-2xl text-lg font-bold hover:opacity-90 transition-all shadow-xl shadow-primary/25"
              >
                Apply Directly
                <ExternalLink className="w-5 h-5" />
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="max-w-7xl mx-auto px-4 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            <section className="bg-card/40 border border-border/50 p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-black/5">
              <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Info className="w-5 h-5 text-primary" />
                </div>
                Detailed Description
              </h2>
              <div className="text-muted-foreground leading-[1.8] text-lg space-y-6">
                <p>{opp.description}</p>
                <p>The {opp.organization} is looking for highly motivated individuals who are passionate about {opp.field}. This opportunity provides a unique platform to develop professional skills and network with industry leaders.</p>
              </div>

              <div className="mt-12 pt-12 border-t border-border/50">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent" />
                  Key Highlights
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <HighlightItem icon={<Globe className="w-4 h-4" />} text="Global Exposure" />
                   <HighlightItem icon={<ShieldCheck className="w-4 h-4" />} text="Verified Poster" />
                   <HighlightItem icon={<Award className="w-4 h-4" />} text="Certificate Included" />
                   <HighlightItem icon={<Sparkles className="w-4 h-4" />} text="AI-Matched for You" />
                </div>
              </div>
            </section>

            <section className="bg-card/40 border border-border/50 p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-black/5">
              <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-primary" />
                </div>
                Spread the Word
              </h2>
              <p className="text-muted-foreground mb-8">Know someone who would be a perfect fit? Help them find their next big move.</p>
              <div className="flex flex-wrap gap-4">
                <Button variant="secondary" className="rounded-xl font-bold">Copy Link</Button>
                <Button variant="secondary" className="rounded-xl font-bold">Share to LinkedIn</Button>
                <Button variant="secondary" className="rounded-xl font-bold">Twitter / X</Button>
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <div className="bg-primary rounded-[2.5rem] p-10 text-primary-foreground shadow-2xl shadow-primary/30 sticky top-28 overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 blur-[60px] rounded-full -mr-20 -mt-20" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 blur-[40px] rounded-full -ml-16 -mb-16" />
              
              <div className="relative z-10 space-y-8">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8">
                  <Send className="w-8 h-8 text-white shadow-lg" />
                </div>
                <h3 className="text-2xl font-black leading-tight">Stay ahead <br /> of the curve.</h3>
                <p className="text-primary-foreground/80 leading-relaxed font-medium">
                  Join 50,000+ humans getting daily opportunity alerts directly from Telegram networks.
                </p>
                <a 
                  href="https://t.me/yourchannel"
                  className="block w-full text-center bg-white text-primary font-black py-5 rounded-2xl hover:scale-[1.02] transition-all shadow-xl shadow-black/10 text-lg uppercase tracking-wider"
                >
                  Join Telegram Now
                </a>
                <p className="text-center text-[10px] uppercase font-bold tracking-widest opacity-60">100% Free • No Spam • Real-time</p>
              </div>
            </div>

            <Card className="p-8 rounded-[2rem] border-border/40">
               <h4 className="font-bold mb-6">Related Skills</h4>
               <div className="flex flex-wrap gap-2">
                 {opp.tags.map(tag => (
                   <span key={tag} className="px-3 py-1.5 bg-secondary rounded-lg text-xs font-bold text-muted-foreground border border-border/50 hover:text-primary transition-colors cursor-default">
                     #{tag}
                   </span>
                 ))}
               </div>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
};

const HighlightItem = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
  <div className="flex items-center gap-3 p-4 bg-background/50 rounded-2xl border border-border/40">
    <div className="p-2 bg-primary/5 rounded-lg text-primary">
      {icon}
    </div>
    <span className="text-sm font-bold text-foreground">{text}</span>
  </div>
);