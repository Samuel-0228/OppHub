import React from 'react';
import { mockOpportunities } from '../data/mockData';
import { OpportunityCard } from '../components/OpportunityCard';
import { 
  Bookmark, LayoutDashboard, History, Settings, Bell, 
  ChevronRight, User, Sparkles, TrendingUp, Zap, LogOut,
  Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, Card, Badge } from '../components/ui-elements';

export const Dashboard: React.FC = () => {
  const savedItems = mockOpportunities.slice(0, 2);

  return (
    <div className="min-h-screen bg-background transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-[320px] sticky top-28 space-y-6">
            <Card className="p-8 rounded-[2.5rem] bg-card border-border/40 shadow-2xl shadow-black/5 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[40px] rounded-full -mr-16 -mt-16" />
              
              <div className="flex flex-col items-center text-center relative z-10 mb-10">
                <div className="relative mb-6">
                   <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-primary/30">
                    JD
                   </div>
                   <div className="absolute -bottom-2 -right-2 bg-accent text-accent-foreground p-1.5 rounded-xl border-4 border-card shadow-lg">
                      <Zap className="w-4 h-4 fill-current" />
                   </div>
                </div>
                <h2 className="text-2xl font-black text-foreground tracking-tight">John Doe</h2>
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-2">Premium Explorer</p>
              </div>

              <div className="space-y-2">
                <NavItem icon={<LayoutDashboard className="w-4 h-4" />} label="Overview" active />
                <NavItem icon={<Bookmark className="w-4 h-4" />} label="Saved Items" />
                <NavItem icon={<History className="w-4 h-4" />} label="Application History" />
                <NavItem icon={<Bell className="w-4 h-4" />} label="Alerts" count={3} />
                <NavItem icon={<Settings className="w-4 h-4" />} label="Preferences" />
              </div>

              <div className="mt-10 pt-10 border-t border-border/50">
                <button className="w-full flex items-center gap-3 px-6 py-4 text-muted-foreground hover:text-destructive hover:bg-destructive/5 rounded-2xl text-sm font-bold transition-all">
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            </Card>

            <div className="bg-primary rounded-[2rem] p-8 text-primary-foreground">
               <h4 className="font-bold mb-3 flex items-center gap-2">
                 <Sparkles className="w-4 h-4" />
                 Pro Tip
               </h4>
               <p className="text-xs leading-relaxed opacity-80 font-medium">
                 Completing your profile increases your chance of getting matched by 45%.
               </p>
               <Button variant="secondary" className="w-full mt-6 rounded-xl text-xs py-2 bg-white text-primary">
                 Update Profile
               </Button>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter mb-4">Welcome back, <br className="md:hidden" /> John.</h1>
                <p className="text-muted-foreground font-medium">Here is what's happening with your applications today.</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest bg-secondary/50 px-4 py-2 rounded-full border border-border/50">
                <Calendar className="w-4 h-4 text-primary" />
                September 12, 2025
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard label="Saved Opportunities" value="24" trend="+2 this week" />
              <StatCard label="Applications Sent" value="12" trend="In Review" />
              <StatCard label="Success Rate" value="85%" trend="Excellence" />
            </div>

            <section className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <Bookmark className="w-5 h-5 fill-current" />
                  </div>
                  Your Saved Gems
                </h3>
                <Button variant="ghost" className="text-xs font-bold uppercase tracking-widest text-primary">View All</Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {savedItems.map(opp => (
                  <OpportunityCard key={opp.id} opportunity={opp} isBookmarked={true} />
                ))}
              </div>
            </section>

            <section className="bg-card border border-border/50 p-10 rounded-[2.5rem] shadow-xl shadow-black/5">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black text-foreground tracking-tight">Recommended For You</h3>
               </div>
               <div className="bg-secondary/30 border border-border/40 p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8">
                 <div className="space-y-2">
                    <h4 className="text-xl font-bold">Senior UX Researcher @ Meta</h4>
                    <p className="text-sm text-muted-foreground">Based on your interests in User Experience and Human Factors.</p>
                 </div>
                 <Button size="lg" className="rounded-2xl px-10 shadow-lg shadow-primary/20">Explore Meta</Button>
               </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, active = false, count }: { icon: React.ReactNode, label: string, active?: boolean, count?: number }) => (
  <button className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${active ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/20' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
    <div className="flex items-center gap-4">
      {icon}
      {label}
    </div>
    {count && <span className={`px-2 py-0.5 rounded-lg text-[10px] ${active ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>{count}</span>}
  </button>
);

const StatCard = ({ label, value, trend }: { label: string, value: string, trend: string }) => (
  <Card className="p-8 rounded-[2rem] border-border/40 bg-card/50 backdrop-blur-sm relative overflow-hidden group">
    <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 blur-2xl rounded-full group-hover:scale-150 transition-transform duration-700" />
    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">{label}</p>
    <div className="flex items-end justify-between">
      <span className="text-5xl font-black text-foreground tracking-tighter">{value}</span>
      <span className="text-[10px] font-bold text-accent uppercase tracking-widest pb-1">{trend}</span>
    </div>
  </Card>
);