import React, { useState, useEffect } from 'react';
import { Search, Bell, Menu, User, Zap, X, ChevronRight, Sparkles, LayoutDashboard, Bookmark, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Discover', path: '/', icon: Zap },
    { name: 'Weekly', path: '/digest', icon: Sparkles },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Saved', path: '/bookmarks', icon: Bookmark },
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-700",
        isScrolled ? "py-4" : "py-8"
      )}
    >
      <nav className={cn(
        "max-w-7xl mx-auto px-4 transition-all duration-700",
        isScrolled ? "max-w-5xl" : "max-w-7xl"
      )}>
        <div className={cn(
          "relative px-6 py-4 rounded-[2.5rem] flex justify-between items-center transition-all duration-700",
          isScrolled 
            ? "bg-card/60 backdrop-blur-3xl border border-border/50 shadow-2xl shadow-black/10" 
            : "bg-transparent"
        )}>
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-4 group relative">
            <div className="bg-primary p-3 rounded-2xl shadow-2xl shadow-primary/30 group-hover:rotate-[360deg] transition-transform duration-1000">
              <Zap className="w-6 h-6 text-primary-foreground fill-current" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-foreground tracking-tighter leading-none">
                OpporTunix
              </span>
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/80 mt-1">
                Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 bg-secondary/30 backdrop-blur-3xl border border-border/30 p-1.5 rounded-full">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={cn(
                  "relative px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500",
                  location.pathname === link.path 
                    ? "text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-primary rounded-full -z-10 shadow-lg shadow-primary/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {link.name}
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-4">
              <ThemeToggle />
              <div className="w-px h-6 bg-border/50 mx-1" />
              <button className="p-3 text-muted-foreground hover:bg-secondary rounded-2xl transition-all">
                <Bell className="w-5 h-5" />
              </button>
            </div>
            
            <button className="relative p-1 group">
               <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700" />
               <button className="relative flex items-center gap-3 bg-foreground text-background px-6 py-3.5 rounded-2xl text-sm font-black tracking-tighter hover:bg-primary hover:text-primary-foreground transition-all duration-500 shadow-2xl shadow-black/10">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Profile</span>
               </button>
            </button>

            <button 
              className="lg:hidden p-3.5 text-foreground bg-secondary/80 backdrop-blur-xl border border-border/50 rounded-2xl transition-all"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="absolute top-[100%] left-4 right-4 bg-card/95 backdrop-blur-3xl mt-4 rounded-[3rem] border border-border/50 shadow-2xl shadow-black/20 p-8 z-[200] overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
             <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between mb-8 px-4">
                  <span className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">Menu</span>
                  <ThemeToggle />
                </div>
                {navLinks.map((link) => (
                  <Link 
                    key={link.path} 
                    to={link.path} 
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex items-center justify-between p-6 rounded-[2rem] transition-all duration-500",
                      location.pathname === link.path 
                        ? "bg-primary text-primary-foreground shadow-2xl shadow-primary/20" 
                        : "bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-4">
                       <link.icon className="w-6 h-6" />
                       <span className="text-xl font-black tracking-tighter">{link.name}</span>
                    </div>
                    <ChevronRight className={cn("w-5 h-5", location.pathname === link.path ? "opacity-100" : "opacity-30")} />
                  </Link>
                ))}
                
                <div className="pt-8 mt-8 border-t border-border/50 flex flex-col gap-4">
                   <button className="flex items-center gap-4 p-6 bg-secondary/30 rounded-[2rem] text-muted-foreground">
                      <Settings className="w-5 h-5" />
                      <span className="font-bold">Account Settings</span>
                   </button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};