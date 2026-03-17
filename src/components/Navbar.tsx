import React from 'react';
import { Search, Bell, User, LogIn, LogOut, Menu, X, LayoutDashboard } from 'lucide-react';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  user: UserProfile | null;
  onSearch: (query: string) => void;
}

export const Navbar: React.FC<Props> = ({ user, onSearch }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = () => signOut(auth);

  return (
    <nav className="sticky top-0 z-50 bg-paper/80 backdrop-blur-xl border-b border-ink/5">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="flex justify-between items-center h-24">
          <div className="flex items-center gap-12">
            <a href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-ink rounded-full flex items-center justify-center transition-transform group-hover:rotate-12">
                <div className="w-5 h-5 bg-paper rounded-sm rotate-45" />
              </div>
              <span className="text-2xl font-serif italic font-bold tracking-tight">OppHub</span>
            </a>

            <div className="hidden lg:flex relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/30 group-focus-within:text-ink transition-colors" />
              <input
                type="text"
                placeholder="Search opportunities..."
                onChange={(e) => onSearch(e.target.value)}
                className="pl-12 pr-6 py-3 bg-ink/5 border-none rounded-full text-sm w-80 focus:ring-1 focus:ring-ink/10 focus:bg-white transition-all outline-none font-display"
              />
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="/weekly-digest" className="text-sm font-display font-medium text-ink/60 hover:text-ink transition-colors uppercase tracking-widest">Weekly Digest</a>
            {user?.role === 'admin' && (
              <a href="/admin" className="p-3 hover:bg-ink/5 rounded-full transition-colors text-ink/60 hover:text-ink" title="Admin Dashboard">
                <LayoutDashboard className="w-5 h-5" />
              </a>
            )}
            {user ? (
              <div className="flex items-center gap-6">
                <a href="/bookmarks" className="text-sm font-display font-medium text-ink/60 hover:text-ink transition-colors uppercase tracking-widest">Bookmarks</a>
                <div className="flex items-center gap-4 pl-6 border-l border-ink/10">
                  <img src={user.photoURL || ''} alt="" className="w-10 h-10 rounded-full border border-ink/10 grayscale hover:grayscale-0 transition-all cursor-pointer" />
                  <button onClick={handleLogout} className="p-3 hover:bg-red-50 rounded-full transition-colors text-red-400 hover:text-red-600">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="btn-primary !py-3 !px-6 text-sm"
              >
                Sign In
              </button>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-3 bg-ink/5 rounded-full">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-black/5 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              <input
                type="text"
                placeholder="Search..."
                onChange={(e) => onSearch(e.target.value)}
                className="w-full pl-4 pr-4 py-3 bg-slate-100 border-none rounded-xl text-sm outline-none"
              />
              <div className="flex flex-col gap-4">
                <a href="/weekly-digest" className="text-lg font-bold">Weekly Digest</a>
                {user ? (
                  <>
                    <a href="/bookmarks" className="text-lg font-bold">My Bookmarks</a>
                    {user.role === 'admin' && <a href="/admin" className="text-lg font-bold">Admin Dashboard</a>}
                    <button onClick={handleLogout} className="text-lg font-bold text-red-500 text-left">Sign Out</button>
                  </>
                ) : (
                  <button onClick={handleLogin} className="w-full py-4 bg-black text-white font-bold rounded-xl">Sign In with Google</button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
