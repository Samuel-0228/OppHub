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
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase italic">OppHub</span>
            </a>

            <div className="hidden md:flex relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-black transition-colors" />
              <input
                type="text"
                placeholder="Search opportunities..."
                onChange={(e) => onSearch(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-black/5 focus:bg-white transition-all outline-none"
              />
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <a href="/weekly-digest" className="text-sm font-medium text-slate-600 hover:text-black transition-colors">Weekly Digest</a>
            {user?.role === 'admin' && (
              <a href="/admin" className="p-2 hover:bg-black/5 rounded-full transition-colors text-slate-600 hover:text-black" title="Admin Dashboard">
                <LayoutDashboard className="w-5 h-5" />
              </a>
            )}
            {user ? (
              <div className="flex items-center gap-4">
                <a href="/bookmarks" className="text-sm font-medium text-slate-600 hover:text-black transition-colors">Bookmarks</a>
                <div className="flex items-center gap-3 pl-4 border-l border-black/5">
                  <img src={user.photoURL || ''} alt="" className="w-8 h-8 rounded-full border border-black/5" />
                  <button onClick={handleLogout} className="p-2 hover:bg-red-50 rounded-full transition-colors text-red-500">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="flex items-center gap-2 px-6 py-2 bg-black text-white text-sm font-bold rounded-full hover:bg-black/80 transition-all active:scale-95"
              >
                <LogIn className="w-4 h-4" /> Sign In
              </button>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
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
