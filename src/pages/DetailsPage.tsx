import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOpportunities } from '../hooks/useOpportunities';
import { 
  Building2, MapPin, Calendar, ExternalLink, 
  ArrowLeft, Share2, Bookmark, Send, Info,
  CheckCircle2, AlertCircle, Clock, GraduationCap,
  Trophy, Users, Globe, Briefcase, TrendingUp
} from 'lucide-react';
import { formatDate, getDeadlineStatus, cn } from '../lib/utils';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export function DetailsPage() {
  const { id } = useParams();
  const { opportunities, savedIds, toggleSave } = useOpportunities();
  const opportunity = opportunities.find(o => o.id === id);

  if (!opportunity) {
    return (
      <div className="py-20 text-center max-w-xl mx-auto px-6">
        <div className="bg-red-50 text-red-600 p-8 rounded-3xl mb-8">
          <AlertCircle className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl font-black mb-2 tracking-tight">Post Not Found</h2>
          <p className="font-medium text-red-700/70 leading-relaxed">The opportunity you are looking for might have been removed or the link is invalid.</p>
        </div>
        <Link to="/" className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm inline-flex items-center shadow-lg shadow-slate-200">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const isSaved = savedIds.includes(opportunity.id);
  const status = getDeadlineStatus(opportunity.deadline);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const getCategoryIcon = () => {
    switch(opportunity.category) {
      case 'Internships': return <GraduationCap className="w-5 h-5" />;
      case 'Competitions': return <Trophy className="w-5 h-5" />;
      case 'Events': 
      case 'Conferences': return <Users className="w-5 h-5" />;
      case 'Jobs': return <Briefcase className="w-5 h-5" />;
      default: return <Globe className="w-5 h-5" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="pb-20 max-w-6xl mx-auto px-4"
    >
      <div className="mt-8 mb-8 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all">
          <ArrowLeft className="w-4 h-4 mr-2" /> All Opportunities
        </Link>
        <div className="flex gap-3">
          <button 
            onClick={handleShare}
            className="p-3 rounded-2xl border-2 bg-white hover:bg-muted transition-all shadow-sm active:scale-90"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button 
            onClick={() => toggleSave(opportunity.id)}
            className={cn(
              "p-3 rounded-2xl border-2 transition-all shadow-sm active:scale-90",
              isSaved ? "bg-primary/10 text-primary border-primary/20" : "bg-white hover:bg-muted border-border"
            )}
          >
            <Bookmark className={cn("w-5 h-5", isSaved && "fill-primary")} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <section className="bg-card border-2 rounded-[40px] overflow-hidden shadow-sm">
            {opportunity.featuredImageUrl && (
              <div className="h-80 w-full relative">
                <img src={opportunity.featuredImageUrl} alt={opportunity.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-10 left-10 right-10">
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-widest mb-4 shadow-lg shadow-primary/20">
                    {getCategoryIcon()}
                    <span className="ml-2">{opportunity.category}</span>
                  </span>
                  <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.1] tracking-tight">
                    {opportunity.title}
                  </h1>
                </div>
              </div>
            )}
            
            <div className="p-10">
              {!opportunity.featuredImageUrl && (
                <div className="mb-8">
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-4 border-2 border-primary/10">
                    {getCategoryIcon()}
                    <span className="ml-2">{opportunity.category}</span>
                  </span>
                  <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-slate-900">
                    {opportunity.title}
                  </h1>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                <div className="flex items-center p-5 bg-muted/20 rounded-3xl">
                  <div className="bg-white p-3 rounded-2xl shadow-sm mr-4">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-0.5">Organization</p>
                    <p className="font-bold text-lg text-slate-800">{opportunity.organization}</p>
                  </div>
                </div>
                <div className="flex items-center p-5 bg-muted/20 rounded-3xl">
                  <div className="bg-white p-3 rounded-2xl shadow-sm mr-4">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-0.5">Location</p>
                    <p className="font-bold text-lg text-slate-800">{opportunity.location} • {opportunity.type}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-10 mb-12 border-y py-8 border-slate-100">
                <div className="space-y-1.5">
                  <div className="flex items-center text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    <Clock className="w-3.5 h-3.5 mr-2 text-primary" /> Deadline
                  </div>
                  <p className="font-black text-2xl text-slate-900">{formatDate(opportunity.deadline)}</p>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    <TrendingUp className="w-3.5 h-3.5 mr-2 text-primary" /> Views
                  </div>
                  <p className="font-black text-2xl text-slate-900">{opportunity.views.toLocaleString()}</p>
                </div>
              </div>

              <div className="prose prose-slate prose-lg max-w-none">
                <h3 className="text-2xl font-black mb-6 flex items-center tracking-tight">
                  <Info className="w-7 h-7 mr-3 text-primary" /> Description
                </h3>
                <p className="text-slate-600 font-medium whitespace-pre-wrap leading-relaxed mb-10 text-lg">
                  {opportunity.description}
                </p>

                {opportunity.eligibility && (
                  <div className="mb-10 bg-primary/5 p-8 rounded-[32px] border-2 border-primary/10 shadow-inner">
                    <h4 className="text-xl font-black mb-4 flex items-center text-primary uppercase tracking-tight">
                      <CheckCircle2 className="w-6 h-6 mr-3" /> Eligibility
                    </h4>
                    <p className="text-slate-700 font-bold leading-relaxed">{opportunity.eligibility}</p>
                  </div>
                )}
              </div>

              <div className="mt-12 pt-10 border-t-2 border-slate-100">
                <h4 className="font-black mb-6 text-xs uppercase tracking-[0.2em] text-muted-foreground">Tags</h4>
                <div className="flex flex-wrap gap-3">
                  {opportunity.tags.map(tag => (
                    <span key={tag} className="px-6 py-2.5 bg-muted/40 rounded-2xl text-xs font-black uppercase tracking-widest border-2 border-transparent hover:border-primary/20">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-slate-900 text-white rounded-[48px] p-12 md:p-16 relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-none">Application Guide</h2>
              <p className="text-slate-400 mb-12 text-lg font-medium">Step by step instructions for {opportunity.title}.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="flex items-start gap-5">
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center font-black text-primary text-xl">1</div>
                  <div>
                    <h4 className="font-black mb-2 text-xl tracking-tight">Check Eligibility</h4>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed">Ensure you meet all requirements before applying.</p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center font-black text-primary text-xl">2</div>
                  <div>
                    <h4 className="font-black mb-2 text-xl tracking-tight">Prepare Docs</h4>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed">Update your CV and collect necessary certificates.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="lg:col-span-4 space-y-8">
          <div className="sticky top-24 space-y-8">
            <div className="bg-card border-2 rounded-[40px] p-10 shadow-2xl border-t-8 border-t-primary">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  <Clock className="w-4 h-4 mr-2 text-primary" /> Status
                </div>
                <span className={cn(
                  "text-[10px] px-3 py-1.5 font-black rounded-full border-2 tracking-widest uppercase",
                  status === 'soon' ? "bg-red-50 text-red-700 border-red-200" :
                  status === 'this-week' ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                  "bg-green-50 text-green-700 border-green-200"
                )}>
                  {status}
                </span>
              </div>
              
              <div className="space-y-5 mb-10">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">Deadline</span>
                  <span className="font-black text-lg text-slate-900">{formatDate(opportunity.deadline)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">Field</span>
                  <span className="font-black text-lg text-slate-900">{opportunity.field}</span>
                </div>
              </div>

              <div className="space-y-4">
                <a 
                  href={opportunity.applyLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-[1.03] transition-all shadow-xl shadow-primary/20"
                >
                  Apply Now <ExternalLink className="w-4 h-4 ml-3" />
                </a>
                <button 
                  onClick={() => toggleSave(opportunity.id)}
                  className={cn(
                    "w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] border-2 transition-all flex items-center justify-center gap-2",
                    isSaved ? "bg-muted text-muted-foreground border-muted" : "bg-white hover:bg-muted text-slate-900 border-slate-100"
                  )}
                >
                  <Bookmark className={cn("w-4 h-4", isSaved && "fill-current")} />
                  {isSaved ? 'Saved' : 'Save'}
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-800 text-white rounded-[40px] p-10 shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="font-black text-2xl mb-4 tracking-tight leading-tight">Join Telegram</h4>
                <p className="text-blue-100 text-sm font-medium mb-8 leading-relaxed">Get real-time alerts for opportunities.</p>
                <a href="#" className="inline-flex items-center bg-white text-blue-800 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]">
                  Join Now <Send className="w-4 h-4 ml-2" />
                </a>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </motion.div>
  );
}