import React, { useState } from 'react';
import { 
  BarChart3, Settings, Search, 
  CheckCircle, Edit3, Pin, Trash2, 
  CheckCircle2, AlertCircle, LayoutDashboard,
  RefreshCw, Filter, ChevronRight, MoreHorizontal,
  Building2
} from 'lucide-react';
import { mockOpportunities } from '../data/mockData';
import { Opportunity } from '../types';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Button, Card, Badge, Input } from '../components/ui-elements';

export const Admin: React.FC = () => {
  const [items, setItems] = useState<Opportunity[]>(mockOpportunities);
  const [search, setSearch] = useState('');

  const stats = [
    { label: 'Total Imported', value: '1,284', icon: BarChart3, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Pending Review', value: '42', icon: AlertCircle, color: 'text-accent', bg: 'bg-accent/10' },
    { label: 'Live Now', value: '856', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.organization.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background transition-colors duration-500 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-primary">
               <LayoutDashboard className="w-6 h-6" />
               <span className="text-xs font-black uppercase tracking-[0.3em]">System Control</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter">Admin Intelligence</h1>
            <p className="text-muted-foreground font-medium">Overseeing the flow of global opportunities.</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Button variant="secondary" className="flex-1 md:flex-none rounded-2xl h-14 px-8 font-bold gap-3">
              <RefreshCw className="w-4 h-4" />
              Sync Channel
            </Button>
            <Button variant="primary" className="flex-1 md:flex-none rounded-2xl h-14 px-8 font-bold gap-3 shadow-xl shadow-primary/20">
              <Settings className="w-4 h-4" />
              Config
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={stat.label}
            >
              <Card className="p-8 rounded-[2.5rem] border-border/40 hover:scale-[1.02] transition-transform">
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <Badge variant="outline" className="text-[10px]">Real-time</Badge>
                </div>
                <p className="text-muted-foreground text-xs font-black uppercase tracking-widest mb-2">{stat.label}</p>
                <p className="text-4xl font-black text-foreground tracking-tighter">{stat.value}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="rounded-[2.5rem] border-border/40 overflow-hidden shadow-2xl shadow-black/5 bg-card/50 backdrop-blur-xl">
          <div className="p-8 border-b border-border/50 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="relative w-full md:w-[400px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search in database..." 
                className="w-full bg-secondary/50 border border-border/50 rounded-2xl pl-12 pr-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
               <Button variant="ghost" className="rounded-xl font-bold text-xs uppercase tracking-widest">
                 <Filter className="w-4 h-4 mr-2" /> Filter
               </Button>
               <Button variant="ghost" className="rounded-xl font-bold text-xs uppercase tracking-widest">Export</Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-muted/30 border-b border-border/50">
                  <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Opportunity Identity</th>
                  <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Classification</th>
                  <th className="px-8 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-primary/5 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center overflow-hidden shrink-0">
                          {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <Building2 className="w-5 h-5 text-primary/40" />}
                        </div>
                        <div>
                          <p className="text-sm font-black text-foreground group-hover:text-primary transition-colors mb-0.5">{item.title}</p>
                          <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{item.organization}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <Badge variant="secondary" className="rounded-lg px-2 py-1">{item.category}</Badge>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => toast.success('Approved')}
                          className="p-3 text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-all active:scale-90"
                          title="Approve"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button 
                          className="p-3 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all active:scale-90"
                          title="Edit"
                        >
                          <Edit3 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => toast.error('Deleted')}
                          className="p-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all active:scale-90"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <button className="p-3 text-muted-foreground hover:text-foreground rounded-xl transition-all">
                           <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-8 border-t border-border/50 flex justify-between items-center">
             <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Page 1 of 12</p>
             <div className="flex gap-2">
                <Button variant="outline" size="sm" className="rounded-lg">Prev</Button>
                <Button variant="outline" size="sm" className="rounded-lg">Next</Button>
             </div>
          </div>
        </Card>
      </div>
    </div>
  );
};