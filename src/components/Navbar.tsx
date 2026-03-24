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
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-10">
            <a href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center transition-transform group-hover:rotate-6 shadow-lg shadow-primary/20">
                <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
              </div>
              <span className="text-xl font-display font-bold tracking-tight text-foreground">OppHub</span>
            </a>

            <div className="hidden md:flex items-center gap-8">
              <a href="/" className="text-sm font-semibold text-foreground hover:text-primary transition-colors">Find Opportunities</a>
              <a href="/weekly-digest" className="text-sm font-semibold text-muted hover:text-primary transition-colors">Weekly Digest</a>
              {user && (
                <a href="/bookmarks" className="text-sm font-semibold text-muted hover:text-primary transition-colors">Bookmarks</a>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {user?.role === 'admin' && (
              <a href="/admin" className="p-2.5 hover:bg-secondary rounded-xl transition-colors text-muted hover:text-primary" title="Admin Dashboard">
                <LayoutDashboard className="w-5 h-5" />
              </a>
            )}
            {user ? (
              <div className="flex items-center gap-4 pl-6 border-l border-border">
                <img src={user.photoURL || ''} alt="" className="w-9 h-9 rounded-full border border-border hover:border-primary transition-all cursor-pointer" />
                <button onClick={handleLogout} className="p-2.5 hover:bg-red-50 rounded-xl transition-colors text-muted hover:text-red-500">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="btn-primary !py-2.5 !px-6 text-sm"
              >
                Sign In
              </button>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2.5 bg-secondary rounded-xl">
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
            className="md:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="px-6 py-8 space-y-6">
              <div className="flex flex-col gap-4">
                <a href="/" className="text-lg font-semibold text-foreground">Find Opportunities</a>
                <a href="/weekly-digest" className="text-lg font-semibold text-muted">Weekly Digest</a>
                {user && (
                  <>
                    <a href="/bookmarks" className="text-lg font-semibold text-muted">My Bookmarks</a>
                    {user.role === 'admin' && <a href="/admin" className="text-lg font-semibold text-muted">Admin Dashboard</a>}
                    <button 
                      onClick={handleLogout} 
                      className="text-lg font-semibold text-red-500 text-left"
                    >
                      Sign Out
                    </button>
                  </>
                )}
                {!user && (
                  <button 
                    onClick={handleLogin} 
                    className="btn-primary w-full"
                  >
                    Sign In with Google
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
