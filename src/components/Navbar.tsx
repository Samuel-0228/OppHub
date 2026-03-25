import React from 'react';
import { LogOut, Menu, X, LayoutDashboard, Newspaper, Bookmark } from 'lucide-react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { UserProfile } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { OppHubLogo } from './OppHubLogo';

interface Props {
  user: UserProfile | null;
  onNavigate: (page: 'home' | 'detail' | 'admin' | 'bookmarks' | 'weekly-digest', id?: string) => void;
  currentPage: 'home' | 'detail' | 'admin' | 'bookmarks' | 'weekly-digest';
}

const navLinkBase =
  'relative text-sm font-semibold transition-colors duration-[var(--oh-transition)] after:absolute transition-[color,opacity] after:left-0 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-[var(--oh-accent)] after:transition-transform after:duration-[var(--oh-transition)] after:origin-left';

export const Navbar: React.FC<Props> = ({ user, onNavigate, currentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [authMode, setAuthMode] = React.useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);

  const formatAuthError = (error: unknown, fallback: string) => {
    const message = error instanceof Error ? error.message : fallback;

    if (message.includes('auth/invalid-credential')) return 'The email or password is incorrect.';
    if (message.includes('auth/invalid-email')) return 'Enter a valid email address.';
    if (message.includes('auth/email-already-in-use')) return 'That email is already registered. Try signing in instead.';
    if (message.includes('auth/weak-password')) return 'Use a stronger password with at least 6 characters.';
    if (message.includes('auth/popup-closed-by-user')) return 'Google sign-in was closed before it finished.';
    if (message.includes('auth/unauthorized-domain')) return 'This domain is not enabled in Firebase Authentication.';
    if (message.includes('auth/operation-not-allowed')) return 'Enable this sign-in method in Firebase Authentication first.';

    return message;
  };

  const resetFeedback = () => {
    setError(null);
    setSuccess(null);
  };

  const handleGoogleLogin = async () => {
    resetFeedback();
    setBusy(true);
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      setSuccess(authMode === 'signup' ? 'Account created with Google.' : 'Signed in with Google.');
    } catch (error) {
      setError(formatAuthError(error, 'Google sign-in failed.'));
      console.error('Login failed:', error);
    } finally {
      setBusy(false);
    }
  };

  const handleEmailSignUp = async () => {
    resetFeedback();
    setBusy(true);

    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      setSuccess('Account created successfully.');
    } catch (error) {
      setError(formatAuthError(error, 'Sign up failed.'));
    } finally {
      setBusy(false);
    }
  };

  const handleEmailLogin = async () => {
    resetFeedback();
    setBusy(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setSuccess('Signed in successfully.');
    } catch (error) {
      setError(formatAuthError(error, 'Sign in failed.'));
    } finally {
      setBusy(false);
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

  const authHeadline = authMode === 'signup' ? 'Create your account' : 'Welcome back';

  const AuthPanel = (
    <div className="w-full max-w-[22rem]">
      <div className="space-y-3 rounded-[var(--oh-radius-xl)] border border-[var(--oh-border)] bg-[var(--oh-surface)]/80 p-4 backdrop-blur-xl">
        <div className="space-y-1">
          <p className="text-sm font-bold text-[var(--oh-text)]">{authHeadline}</p>
          <p className="text-xs text-[var(--oh-text-muted)]">
            Use your email and password first, or continue with Google if you prefer.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-[var(--oh-radius)] bg-[var(--oh-canvas)]/70 p-1">
          <button
            type="button"
            onClick={() => {
              setAuthMode('signin');
              resetFeedback();
            }}
            className={`flex-1 rounded-[calc(var(--oh-radius)-0.1rem)] px-3 py-2 text-xs font-bold transition-all duration-[var(--oh-transition)] ${
              authMode === 'signin'
                ? 'bg-[var(--oh-accent)] text-[var(--oh-primary-foreground,#041018)] shadow-[0_10px_24px_var(--oh-accent-glow)]'
                : 'text-[var(--oh-text-muted)]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('signup');
              resetFeedback();
            }}
            className={`flex-1 rounded-[calc(var(--oh-radius)-0.1rem)] px-3 py-2 text-xs font-bold transition-all duration-[var(--oh-transition)] ${
              authMode === 'signup'
                ? 'bg-[var(--oh-accent)] text-[var(--oh-primary-foreground,#041018)] shadow-[0_10px_24px_var(--oh-accent-glow)]'
                : 'text-[var(--oh-text-muted)]'
            }`}
          >
            Sign Up
          </button>
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--oh-text-subtle)]">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className="w-full rounded-[var(--oh-radius)] border border-[var(--oh-border)] bg-transparent px-3.5 py-2 text-[var(--oh-text)] outline-none placeholder:text-[var(--oh-text-muted)] focus:ring-2 focus:ring-[var(--oh-accent-bright)]"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--oh-text-subtle)]">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'}
            className="w-full rounded-[var(--oh-radius)] border border-[var(--oh-border)] bg-transparent px-3.5 py-2 text-[var(--oh-text)] outline-none placeholder:text-[var(--oh-text-muted)] focus:ring-2 focus:ring-[var(--oh-accent-bright)]"
          />
        </div>

        {success && (
          <div className="text-xs font-semibold text-[var(--oh-success)]" role="status">
            {success}
          </div>
        )}

        {error && (
          <div className="text-xs font-semibold text-[var(--oh-danger)]" role="alert">
            {error}
          </div>
        )}

        <div className="pt-1">
          <button
            type="button"
            onClick={authMode === 'signup' ? handleEmailSignUp : handleEmailLogin}
            disabled={busy || !email.trim() || !password}
            className="w-full rounded-[var(--oh-radius)] bg-[var(--oh-accent)] px-3 py-2.5 text-xs font-bold text-[var(--oh-primary-foreground,#041018)] shadow-[0_10px_32px_var(--oh-accent-glow)] transition-all duration-[var(--oh-transition)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? 'Working...' : authMode === 'signup' ? 'Create account with email' : 'Sign in with email'}
          </button>
        </div>
      </div>

      <div className="mt-3">
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={busy}
          className="btn-primary w-full !px-6 !py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
        >
          {authMode === 'signup' ? 'Sign up with Google' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--oh-border)] bg-[var(--oh-canvas)]/85 backdrop-blur-xl">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--oh-accent)]/40 to-transparent" />
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex min-h-[4.25rem] items-center justify-between">
          <div className="flex items-center gap-8 lg:gap-12">
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="group flex items-center gap-3"
            >
              <div className="relative flex h-10 w-10 items-center justify-center rounded-[var(--oh-radius)] bg-gradient-to-br from-[var(--oh-accent)] to-[var(--oh-accent-bright)] shadow-[0_8px_28px_var(--oh-accent-glow)] transition-transform duration-[var(--oh-transition)] group-hover:-rotate-3 group-hover:scale-[1.04]">
                <OppHubLogo className="h-5 w-5 text-[var(--oh-primary-foreground,#041018)]" />
              </div>
              <span
                className="text-lg font-bold tracking-tight text-[var(--oh-text)]"
                style={{ fontFamily: 'var(--oh-font-display)' }}
              >
                OppHub
              </span>
            </button>

            <div className="hidden items-center gap-2 md:flex">
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

          <div className="hidden items-center gap-3 md:flex">
            {user?.role === 'admin' && (
              <button
                type="button"
                onClick={() => onNavigate('admin')}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-[var(--oh-transition)] ${
                  currentPage === 'admin'
                    ? 'border border-[var(--oh-border-strong)] bg-[var(--oh-accent-dim)] text-[var(--oh-accent-bright)]'
                    : 'border border-transparent text-[var(--oh-text-muted)] hover:border-[var(--oh-border)] hover:bg-[var(--oh-surface)] hover:text-[var(--oh-text)]'
                }`}
                title="Admin Dashboard"
              >
                <LayoutDashboard className="h-4 w-4" />
                Admin
              </button>
            )}
            {user ? (
              <div className="ml-2 flex items-center gap-3 border-l border-[var(--oh-border)] pl-4">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || user.email}
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-[var(--oh-border)] ring-offset-2 ring-offset-[var(--oh-canvas)]"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--oh-accent-dim)] text-xs font-bold uppercase text-[var(--oh-accent-bright)] ring-2 ring-[var(--oh-border)] ring-offset-2 ring-offset-[var(--oh-canvas)]">
                    {(user.displayName || user.email || 'U').slice(0, 1)}
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-[var(--oh-radius)] p-2.5 text-[var(--oh-text-muted)] transition-all duration-[var(--oh-transition)] hover:bg-[var(--oh-danger-dim)] hover:text-[var(--oh-danger)]"
                  aria-label="Sign out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="w-full">{AuthPanel}</div>
            )}
          </div>

          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-[var(--oh-radius)] border border-[var(--oh-border)] bg-[var(--oh-surface)] p-2.5 text-[var(--oh-text)]"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
            className="overflow-hidden border-t border-[var(--oh-border)] bg-[var(--oh-surface)] md:hidden"
          >
            <div className="space-y-1 px-5 py-6">
              <button
                type="button"
                onClick={() => {
                  onNavigate('home');
                  setIsMenuOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-[var(--oh-radius)] px-4 py-3 text-left font-semibold text-[var(--oh-text)] hover:bg-[var(--oh-elevated)]"
              >
                <Newspaper className="h-5 w-5 text-[var(--oh-accent)]" />
                Opportunities
              </button>
              <button
                type="button"
                onClick={() => {
                  onNavigate('weekly-digest');
                  setIsMenuOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-[var(--oh-radius)] px-4 py-3 text-left font-semibold text-[var(--oh-text-muted)] hover:bg-[var(--oh-elevated)] hover:text-[var(--oh-text)]"
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
                  className="flex w-full items-center gap-3 rounded-[var(--oh-radius)] px-4 py-3 text-left font-semibold text-[var(--oh-text-muted)] hover:bg-[var(--oh-elevated)] hover:text-[var(--oh-text)]"
                >
                  <Bookmark className="h-5 w-5 text-[var(--oh-accent)]" />
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
                  className="flex w-full items-center gap-3 rounded-[var(--oh-radius)] px-4 py-3 text-left font-semibold text-[var(--oh-text-muted)] hover:bg-[var(--oh-elevated)] hover:text-[var(--oh-text)]"
                >
                  <LayoutDashboard className="h-5 w-5 text-[var(--oh-accent)]" />
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
                  className="flex w-full items-center gap-3 rounded-[var(--oh-radius)] px-4 py-3 text-left font-semibold text-[var(--oh-danger)] hover:bg-[var(--oh-danger-dim)]"
                >
                  Sign Out
                </button>
              ) : (
                <div className="pt-2">{AuthPanel}</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
