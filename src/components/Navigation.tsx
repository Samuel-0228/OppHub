import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Bookmark, Home, Calendar, Send, Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { useOpportunities } from '../hooks/useOpportunities';

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { isAdmin, setIsAdmin } = useOpportunities();
  const location = useLocation();

  const navLinks = [
    { name: 'Discover', path: '/', icon: Home },
    { name: 'Weekly Digest', path: '/weekly', icon: Calendar },
    { name: 'Bookmarks', path: '/bookmarks', icon: Bookmark },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-primary p-1.5 rounded-lg">
            <Send className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:inline-block">OpPortals</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary flex items-center gap-2",
                location.pathname === link.path ? "text-primary" : "text-muted-foreground"
              )}
            >
              <link.icon className="w-4 h-4" />
              {link.name}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary flex items-center gap-2",
                location.pathname === '/admin' ? "text-primary" : "text-muted-foreground"
              )}
            >
              <LayoutDashboard className="w-4 h-4" />
              Admin
            </Link>
          )}
          <button 
            onClick={() => setIsAdmin(!isAdmin)}
            className="text-[10px] px-2 py-1 rounded bg-muted hover:bg-muted/80 transition-colors border"
          >
            {isAdmin ? 'Admin View' : 'User View'}
          </button>
        </div>

        {/* Mobile Nav Toggle */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b bg-background px-4 py-4 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center gap-3 text-sm font-medium p-2 rounded-lg",
                location.pathname === link.path ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
              )}
            >
              <link.icon className="w-5 h-5" />
              {link.name}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center gap-3 text-sm font-medium p-2 rounded-lg",
                location.pathname === '/admin' ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
              )}
            >
              <LayoutDashboard className="w-5 h-5" />
              Admin
            </Link>
          )}
          <button 
            onClick={() => setIsAdmin(!isAdmin)}
            className="w-full text-left text-xs px-2 py-2 rounded bg-muted"
          >
            Switch to {isAdmin ? 'User' : 'Admin'} Mode
          </button>
        </div>
      )}
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="border-t bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Send className="w-5 h-5 text-primary" />
              <span className="font-bold text-xl">OpPortals</span>
            </div>
            <p className="text-muted-foreground max-w-sm">
              Your automated gateway to the world's best opportunities. 
              Syncing directly from Telegram to bring you curated listings in real-time.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/">Browse All</Link></li>
              <li><Link to="/weekly">Weekly Digest</Link></li>
              <li><Link to="/bookmarks">Saved Items</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Telegram Channel</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Admin Dashboard</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact Support</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} OpPortals. All rights reserved.
        </div>
      </div>
    </footer>
  );
}