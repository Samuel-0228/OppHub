import React from 'react';
import { useOpportunities } from '../hooks/useOpportunities';
import { OpportunityCard } from '../components/OpportunityCard';
import { 
  CheckCircle2, Trash2, Pin, 
  ExternalLink, LayoutDashboard, Search,
  TrendingUp, Clock, AlertTriangle, Send
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDate, cn } from '../lib/utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export function AdminDashboard() {
  const { opportunities, setOpportunities } = useOpportunities();
  const [activeTab, setActiveTab] = React.useState<'all' | 'pending' | 'approved'>('all');
  const [search, setSearch] = React.useState('');

  const stats = {
    total: opportunities.length,
    pending: opportunities.filter(o => !o.isApproved).length,
    approved: opportunities.filter(o => o.isApproved).length,
    pinned: opportunities.filter(o => o.isPinned).length,
  };

  const handleApprove = (id: string) => {
    setOpportunities(prev => prev.map(o => o.id === id ? { ...o, isApproved: true } : o));
    toast.success('Opportunity approved and published');
  };

  const handlePin = (id: string) => {
    setOpportunities(prev => prev.map(o => o.id === id ? { ...o, isPinned: !o.isPinned } : o));
    toast.info('Feature status updated');
  };

  const handleDelete = (id: string) => {
    setOpportunities(prev => prev.filter(o => o.id !== id));
    toast.error('Post deleted');
  };

  const filtered = opportunities
    .filter(o => {
      if (activeTab === 'pending') return !o.isApproved;
      if (activeTab === 'approved') return o.isApproved;
      return true;
    })
    .filter(o => o.title.toLowerCase().includes(search.toLowerCase()) || o.organization.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="py-12 space-y-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest mb-4">
            <LayoutDashboard className="w-3 h-3 mr-2" /> Admin Console
          </div>
          <h1 className="text-4xl font-black tracking-tight">Telegram Import Manager</h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Review and manage opportunities automatically imported from your Telegram channel.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-primary text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center shadow-lg shadow-primary/20">
            <Send className="w-4 h-4 mr-2" /> Sync Manual Post
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Imported Total', value: stats.total, color: 'bg-white text-slate-900 border-slate-200' },
          { label: 'Pending Review', value: stats.pending, color: 'bg-yellow-50 text-yellow-700 border-yellow-100', icon: Clock },
          { label: 'Published Live', value: stats.approved, color: 'bg-green-50 text-green-700 border-green-100', icon: CheckCircle2 },
          { label: 'Pinned Today', value: stats.pinned, color: 'bg-blue-50 text-blue-700 border-blue-100', icon: Pin },
        ].map((s, idx) => (
          <div key={idx} className={cn("p-6 rounded-3xl border-2 shadow-sm transition-all hover:shadow-md", s.color)}>
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80">{s.label}</p>
              {s.icon && <s.icon className="w-4 h-4 opacity-50" />}
            </div>
            <p className="text-3xl font-black">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border-2 rounded-[32px] overflow-hidden shadow-sm">
        <div className="border-b px-8 py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-muted/20">
          <div className="flex p-1 bg-muted rounded-2xl w-fit">
            {(['all', 'pending', 'approved'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all",
                  activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative w-full lg:w-96">
            <input 
              type="text" 
              placeholder="Search in backlog..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 pr-4 py-3 text-sm border-2 rounded-2xl w-full focus:ring-4 focus:ring-primary/10 transition-all font-medium"
            />
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-muted/30 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b-2">
              <tr>
                <th className="px-8 py-5">Opportunity Details</th>
                <th className="px-8 py-5">Classification</th>
                <th className="px-8 py-5">Imported Date</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence mode="popLayout">
                {filtered.map((opp) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={opp.id} 
                    className="group hover:bg-muted/10 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900 group-hover:text-primary transition-colors">{opp.title}</span>
                        <span className="text-xs text-muted-foreground font-bold flex items-center mt-1">
                          <TrendingUp className="w-3 h-3 mr-1" /> {opp.organization} • {opp.views} views
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-black px-3 py-1 bg-muted border-2 rounded-full uppercase tracking-wider">
                        {opp.category}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-xs font-bold text-muted-foreground">
                      {formatDate(opp.postedDate)}
                    </td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "text-[9px] font-black px-3 py-1 rounded-full border-2 tracking-widest uppercase",
                        opp.isApproved ? "bg-green-50 text-green-700 border-green-200" : "bg-yellow-50 text-yellow-700 border-yellow-200"
                      )}>
                        {opp.isApproved ? 'LIVE' : 'PENDING'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end space-x-3">
                        {!opp.isApproved && (
                          <button 
                            onClick={() => handleApprove(opp.id)}
                            className="p-2.5 rounded-xl bg-green-600 text-white hover:bg-green-700 shadow-md shadow-green-100 transition-all active:scale-90"
                            title="Approve & Publish"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                        )}
                        <button 
                          onClick={() => handlePin(opp.id)}
                          className={cn(
                            "p-2.5 rounded-xl border-2 transition-all active:scale-90",
                            opp.isPinned ? "bg-primary text-white border-primary shadow-md shadow-primary/20" : "bg-white hover:bg-muted"
                          )}
                          title="Pin to Homepage"
                        >
                          <Pin className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(opp.id)}
                          className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border-2 border-red-100 transition-all active:scale-90"
                          title="Delete Permanently"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <Link 
                          to={`/opportunity/${opp.id}`}
                          className="p-2.5 rounded-xl bg-white border-2 hover:bg-muted transition-all active:scale-90"
                          title="Preview details"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </Link>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        {filtered.length === 0 && (
          <div className="py-24 flex flex-col items-center text-center">
            <AlertTriangle className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-black">Nothing found in moderation</h3>
            <p className="text-muted-foreground font-medium max-w-xs mt-2">Try changing your filter or sync your Telegram bot to fetch new posts.</p>
          </div>
        )}
      </div>
    </div>
  );
}