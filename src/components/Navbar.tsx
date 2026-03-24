import React from 'react';
import { LogOut, Menu, X, LayoutDashboard, Sparkles, Newspaper, Bookmark } from 'lucide-react';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  user: UserProfile | null;
  onNavigate: (page: 'home' | 'detail' | 'admin' | 'bookmarks' | 'weekly-digest', id?: string) => void;
  currentPage: 'home' | 'detail' | 'admin' | 'bookmarks' | 'weekly-digest';
}

const navLinkBase =
  'relative text-sm font-semibold transition-colors duration-[var(--oh-transition)] after:absolute transition-[color,opacity] after:left-0 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-[var(--oh-accent)] after:transition-transform after:duration-[var(--oh-transition)] after:origin-left';

export const Navbar: React.FC<Props> = ({ user, onNavigate, currentPage }) => {
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

  const linkClass = (page: typeof currentPage | 'home-match') => {
    const active =
      page === 'home-match'
        ? currentPage === 'home' || currentPage === 'detail'
        : currentPage === page;
    return `${navLinkBase} ${active ? 'text-[var(--oh-accent-bright)] after:w-full scale-100' : 'text-[var(--oh-text-muted)] hover:text-[var(--oh-text)] after:w-full after:scale-x-0 hover:after:scale-x-100'}`;
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--oh-border)] bg-[var(--oh-canvas)]/85 backdrop-blur-xl">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--oh-accent)]/40 to-transparent" />
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex justify-between items-center h-[4.25rem]">
          <div className="flex items-center gap-8 lg:gap-12">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 group"
            >
              <div className="relative w-10 h-10 rounded-[var(--oh-radius)] bg-gradient-to-br from-[var(--oh-accent)] to-sky-600 flex items-center justify-center shadow-[0_8px_28px_var(--oh-accent-glow)] transition-transform duration-[var(--oh-transition)] group-hover:scale-[1.04] group-hover:-rotate-3">
                <Sparkles className="w-5 h-5 text-[var(--oh-primary-foreground,#041018)]" strokeWidth={2.2} />
              </div>
              <span
                className="text-lg font-bold tracking-tight text-[var(--oh-text)]"
                style={{ fontFamily: 'var(--oh-font-display)' }}
              >
                OppHub
              </span>
            </button>

            <div className="hidden md:flex items-center gap-2">
              <button type="button" onClick={() => onNavigate('home')} className={linkClass('home-match')}>
                Opportunities
              </button>
              <button type="button" onClick={() => onNavigate('weekly-digest')} className={`${linkClass('weekly-digest')} ml-6`}>
                Weekly Digest
              </button>
              {user && (
                <button type="button" onClick={() => onNavigate('bookmarks')} className={`${linkClass('bookmarks')} ml-6`}>
                  Bookmarks
                </button>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user?.role === 'admin' && (
              <button
                type="button"
                onClick={() => onNavigate('admin')}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-[var(--oh-transition)] ${
                  currentPage === 'admin'
                    ? 'bg-[var(--oh-accent-dim)] text-[var(--oh-accent-bright)] border border-[var(--oh-border-strong)]'
                    : 'text-[var(--oh-text-muted)] hover:text-[var(--oh-text)] border border-transparent hover:border-[var(--oh-border)] hover:bg-[var(--oh-surface)]'
                }`}
                title="Admin Dashboard"
              >
                <LayoutDashboard className="w-4 h-4" />
                Admin
              </button>
            )}
            {user ? (
              <div className="flex items-center gap-3 pl-4 ml-2 border-l border-[var(--oh-border)]">
                <img
                  src={user.photoURL || ''}
                  alt=""
                  className="w-9 h-9 rounded-full ring-2 ring-[var(--oh-border)] ring-offset-2 ring-offset-[var(--oh-canvas)]"
                />
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2.5 rounded-[var(--oh-radius)] transition-all duration-[var(--oh-transition)] text-[var(--oh-text-muted)] hover:text-[var(--oh-danger)] hover:bg-[var(--oh-danger-dim)]"
                  aria-label="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button type="button" onClick={handleLogin} className="btn-primary !py-2.5 !px-6 text-sm">
                Sign In
              </button>
            )}
          </div>

          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 rounded-[var(--oh-radius)] bg-[var(--oh-surface)] border border-[var(--oh-border)] text-[var(--oh-text)]"
              aria-expanded={isMenuOpen}
            >
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
            className="md:hidden border-t border-[var(--oh-border)] bg-[var(--oh-surface)] overflow-hidden"
          >
            <div className="px-5 py-6 space-y-1">
              <button
                type="button"
                onClick={() => {
                  onNavigate('home');
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-[var(--oh-radius)] text-[var(--oh-text)] font-semibold hover:bg-[var(--oh-elevated)]"
              >
                <Newspaper className="w-5 h-5 text-[var(--oh-accent)]" />
                Opportunities
              </button>
              <button
                type="button"
                onClick={() => {
                  onNavigate('weekly-digest');
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-[var(--oh-radius)] text-[var(--oh-text-muted)] font-semibold hover:bg-[var(--oh-elevated)] hover:text-[var(--oh-text)]"
              >
                Weekly Digest
              </button>
              {user && (
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('bookmarks');
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-[var(--oh-radius)] text-[var(--oh-text-muted)] font-semibold hover:bg-[var(--oh-elevated)] hover:text-[var(--oh-text)]"
                >
                  <Bookmark className="w-5 h-5 text-[var(--oh-accent)]" />
                  Bookmarks
                </button>
              )}
              {user?.role === 'admin' && (
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('admin');
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-[var(--oh-radius)] text-[var(--oh-text-muted)] font-semibold hover:bg-[var(--oh-elevated)] hover:text-[var(--oh-text)]"
                >
                  <LayoutDashboard className="w-5 h-5 text-[var(--oh-accent)]" />
                  Admin
                </button>
              )}
              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-[var(--oh-radius)] text-[var(--oh-danger)] font-semibold hover:bg-[var(--oh-danger-dim)]"
                >
                  Sign Out
                </button>
              ) : (
                <button type="button" onClick={handleLogin} className="btn-primary w-full mt-2">
                  Sign In with Google
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
