import React from 'react';
import { Send, Twitter, Github, Linkedin, Mail, Zap, ExternalLink, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GlassCard, Button } from './ui-elements';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-background text-foreground py-24 px-4 mt-20 border-t border-border/30 transition-all duration-700">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          <div className="lg:col-span-5 space-y-10">
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="bg-primary p-4 rounded-[1.5rem] shadow-2xl shadow-primary/30 transition-transform duration-1000 group-hover:rotate-[360deg]">
                <Zap className="w-8 h-8 text-primary-foreground fill-current" />
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black text-foreground tracking-tighter leading-none">
                  OpporTunix
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/80 mt-1.5">
                   Intelligence for Humans
                </span>
              </div>
            </div>
            
            <p className="text-xl text-muted-foreground max-w-md leading-relaxed font-medium tracking-tight">
              The smartest way to stay updated with global opportunities. We curate and structure posts directly from global Telegram networks using deep learning.
            </p>
            
            <div className="flex gap-4 pt-4">
              {[Twitter, Linkedin, Github, Mail].map((Icon, i) => (
                <button 
                  key={i}
                  className="p-5 bg-secondary hover:bg-primary hover:text-primary-foreground rounded-2xl transition-all duration-500 shadow-xl shadow-black/5 hover:scale-110 group"
                >
                  <Icon className="w-6 h-6 transition-transform group-hover:rotate-12" />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground">Resources</h4>
            <ul className="space-y-6 text-base font-black tracking-tight">
              <li><Link to="/" className="text-foreground hover:text-primary transition-all flex items-center gap-2 group">Browse <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" /></Link></li>
              <li><Link to="/digest" className="text-foreground hover:text-primary transition-all flex items-center gap-2 group">Weekly Digest <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" /></Link></li>
              <li><Link to="/dashboard" className="text-foreground hover:text-primary transition-all flex items-center gap-2 group">Dashboard <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" /></Link></li>
              <li><Link to="/admin" className="text-foreground hover:text-primary transition-all flex items-center gap-2 group">Admin <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" /></Link></li>
            </ul>
          </div>

          <div className="lg:col-span-5">
            <GlassCard className="p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(var(--primary),1)]" />
                   <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">Global Network</span>
                </div>
                <h3 className="text-3xl font-black tracking-tighter leading-tight">
                  Join 50,000+ ambitious humans building their future.
                </h3>
                <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                  Get the latest internship and scholarship updates directly in your Telegram inbox with our real-time notification engine.
                </p>
                <Button size="lg" className="w-full flex items-center gap-3 group/btn">
                   <Send className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                   Connect on Telegram
                </Button>
              </div>
            </GlassCard>
          </div>
        </div>

        <div className="pt-12 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              \u00a9 2025 OpporTunix AI Lab.
            </p>
            <div className="flex gap-8">
               <a href="#" className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
               <a href="#" className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground px-6 py-3 rounded-full bg-secondary/30 backdrop-blur-xl border border-border/50 text-[10px] font-black uppercase tracking-[0.2em]">
             Built with <Zap className="w-3 h-3 text-primary fill-current mx-1" /> for Humans
          </div>
        </div>
      </div>
    </footer>
  );
};