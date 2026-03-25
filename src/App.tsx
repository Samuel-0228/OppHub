import React, { useEffect, useState, useCallback } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { UserProfile } from './types';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { OpportunityDetail } from './pages/OpportunityDetail';
import { Admin } from './pages/Admin';
import { Bookmarks } from './pages/Bookmarks';
import { WeeklyDigest } from './pages/WeeklyDigest';
import { motion, AnimatePresence } from 'motion/react';
import { OppHubLogo } from './components/OppHubLogo';

function syncPathToState(
  setPage: React.Dispatch<React.SetStateAction<'home' | 'detail' | 'admin' | 'bookmarks' | 'weekly-digest'>>,
  setId: React.Dispatch<React.SetStateAction<string | null>>
) {
  const path = window.location.pathname;
  if (path === '/admin') setPage('admin');
  else if (path === '/bookmarks') setPage('bookmarks');
  else if (path === '/weekly-digest') setPage('weekly-digest');
  else if (path.startsWith('/opportunity/')) {
    const id = path.split('/')[2];
    setId(id || null);
    setPage('detail');
  } else {
    setPage('home');
    setId(null);
  }
}

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<'home' | 'detail' | 'admin' | 'bookmarks' | 'weekly-digest'>('home');
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data() as UserProfile;
            const isAdmin = firebaseUser.email === 'ytsamuael@gmail.com';
            const hydratedUser: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || userData.email || '',
              displayName: firebaseUser.displayName || userData.displayName || firebaseUser.email?.split('@')[0] || 'Member',
              photoURL: firebaseUser.photoURL || userData.photoURL || '',
              role: isAdmin ? 'admin' : userData.role,
              createdAt: userData.createdAt,
            };

            if (isAdmin && userData.role !== 'admin') {
              await updateDoc(userRef, { role: 'admin' });
            }

            setUser(hydratedUser);
          } else {
            const isAdmin = firebaseUser.email === 'ytsamuael@gmail.com';
            const newUser: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Member',
              photoURL: firebaseUser.photoURL || '',
              role: isAdmin ? 'admin' : 'user',
              createdAt: new Date().toISOString(),
            };
            await setDoc(userRef, newUser);
            setUser(newUser);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to synchronize auth user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    syncPathToState(setCurrentPage, setSelectedOpportunityId);
    const onPop = () => syncPathToState(setCurrentPage, setSelectedOpportunityId);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback((page: 'home' | 'detail' | 'admin' | 'bookmarks' | 'weekly-digest', id?: string) => {
    setCurrentPage(page);
    if (id) setSelectedOpportunityId(id);
    if (page === 'home') setSelectedOpportunityId(null);

    const url = page === 'home' ? '/' : page === 'detail' ? `/opportunity/${id}` : `/${page}`;
    window.history.pushState({}, '', url);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--oh-canvas)] oh-grid-bg">
        <div className="flex flex-col items-center gap-8">
          <div className="relative w-[5.5rem] h-[5.5rem]">
            <div className="absolute inset-0 rounded-3xl bg-[var(--oh-accent-dim)] animate-ping opacity-40" />
            <div className="relative w-[5.5rem] h-[5.5rem] rounded-3xl bg-gradient-to-br from-[var(--oh-accent)] to-[var(--oh-accent-bright)] flex items-center justify-center shadow-[0_12px_48px_var(--oh-accent-glow)]">
              <OppHubLogo className="w-9 h-9 text-[var(--oh-primary-foreground,#041018)]" />
            </div>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="text-[10px] font-bold text-[var(--oh-text-subtle)] uppercase tracking-[0.4em] animate-pulse">Loading</span>
            <span className="text-3xl font-extrabold text-[var(--oh-text)] mt-4 tracking-tight" style={{ fontFamily: 'var(--oh-font-display)' }}>
              OppHub
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--oh-canvas)] text-[var(--oh-text)] font-sans antialiased">
      <Navbar user={user} onNavigate={navigate} currentPage={currentPage} />

      <main>
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.38, ease: [0.23, 1, 0.32, 1] }}
            >
              <Home user={user} onSelectOpportunity={(id) => navigate('detail', id)} />
            </motion.div>
          )}

          {currentPage === 'detail' && selectedOpportunityId && (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
            >
              <OpportunityDetail
                id={selectedOpportunityId}
                onBack={() => navigate('home')}
                onNavigateHome={() => navigate('home')}
                onSelectRelated={(rid) => navigate('detail', rid)}
              />
            </motion.div>
          )}

          {currentPage === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.35 }}
            >
              <Admin user={user} />
            </motion.div>
          )}

          {currentPage === 'bookmarks' && (
            <motion.div
              key="bookmarks"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.38 }}
            >
              <Bookmarks user={user} onSelectOpportunity={(id) => navigate('detail', id)} />
            </motion.div>
          )}

          {currentPage === 'weekly-digest' && (
            <motion.div
              key="weekly-digest"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.38 }}
            >
              <WeeklyDigest user={user} onSelectOpportunity={(id) => navigate('detail', id)} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="relative mt-24 border-t border-[var(--oh-border)] bg-[var(--oh-surface)] overflow-hidden">
        <div className="absolute inset-0 oh-hero-gradient opacity-50 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16 md:py-20 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-[var(--oh-radius)] bg-gradient-to-br from-[var(--oh-accent)] to-[var(--oh-accent-bright)] flex items-center justify-center shadow-[0_8px_28px_var(--oh-accent-glow)]">
                  <OppHubLogo className="w-5 h-5 text-[var(--oh-primary-foreground,#041018)]" />
                </div>
                <span className="text-2xl font-extrabold tracking-tight text-[var(--oh-text)]" style={{ fontFamily: 'var(--oh-font-display)' }}>
                  OppHub
                </span>
              </div>
              <p className="text-[var(--oh-text-muted)] max-w-md leading-relaxed">
                Telegram-native opportunity intelligence — surfaced as a sharp editorial feed for builders, students, and early-career talent.
              </p>
            </div>
            <div className="flex flex-col md:items-end gap-6">
              <div className="flex flex-wrap gap-x-10 gap-y-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--oh-text-muted)]">
                <a href="#" className="hover:text-[var(--oh-accent-bright)] transition-colors">
                  Privacy
                </a>
                <a href="#" className="hover:text-[var(--oh-accent-bright)] transition-colors">
                  Terms
                </a>
                <a href="#" className="hover:text-[var(--oh-accent-bright)] transition-colors">
                  Contact
                </a>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--oh-text-subtle)]">© 2026 OppHub</p>
            </div>
          </div>
          <div className="mt-14 pt-8 border-t border-[var(--oh-border)] flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--oh-text-subtle)]">
              <span className="w-2 h-2 rounded-full bg-[var(--oh-success)] shadow-[0_0_10px_var(--oh-success)]" />
              Systems operational
            </div>
            <span className="text-[10px] text-[var(--oh-text-subtle)]">Design system: black premium / Syne + DM Sans</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
