import React, { useEffect, useState } from 'react';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { UserProfile } from './types';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { OpportunityDetail } from './pages/OpportunityDetail';
import { Admin } from './pages/Admin';
import { Bookmarks } from './pages/Bookmarks';
import { WeeklyDigest } from './pages/WeeklyDigest';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<'home' | 'detail' | 'admin' | 'bookmarks' | 'weekly-digest'>('home');
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUser(userSnap.data() as UserProfile);
        } else {
          // Create new user profile
          const isAdmin = firebaseUser.email === 'ytsamuael@gmail.com';
          const newUser: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || '',
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
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle URL changes for simple routing
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin') setCurrentPage('admin');
    else if (path === '/bookmarks') setCurrentPage('bookmarks');
    else if (path === '/weekly-digest') setCurrentPage('weekly-digest');
    else if (path.startsWith('/opportunity/')) {
      const id = path.split('/')[2];
      setSelectedOpportunityId(id);
      setCurrentPage('detail');
    } else {
      setCurrentPage('home');
    }
  }, []);

  const navigate = (page: 'home' | 'detail' | 'admin' | 'bookmarks' | 'weekly-digest', id?: string) => {
    setCurrentPage(page);
    if (id) setSelectedOpportunityId(id);
    
    const url = page === 'home' ? '/' : page === 'detail' ? `/opportunity/${id}` : `/${page}`;
    window.history.pushState({}, '', url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 bg-accent/20 rounded-full animate-ping" />
            <div className="relative w-16 h-16 bg-ink rounded-2xl flex items-center justify-center rotate-45">
              <div className="w-6 h-6 bg-paper rounded-sm -rotate-45" />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs font-mono text-ink/40 uppercase tracking-[0.3em] animate-pulse">Initializing</span>
            <span className="text-2xl font-serif italic text-ink mt-2">OppHub</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper text-ink font-sans selection:bg-accent selection:text-ink">
      <Navbar user={user} onSearch={setSearchQuery} />
      
      <main className="pt-24">
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            >
              <Home 
                user={user} 
                searchQuery={searchQuery} 
                onSelectOpportunity={(id) => navigate('detail', id)} 
              />
            </motion.div>
          )}

          {currentPage === 'detail' && selectedOpportunityId && (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            >
              <OpportunityDetail 
                id={selectedOpportunityId} 
                onBack={() => navigate('home')} 
              />
            </motion.div>
          )}

          {currentPage === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
            >
              <Admin user={user} />
            </motion.div>
          )}

          {currentPage === 'bookmarks' && (
            <motion.div
              key="bookmarks"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Bookmarks 
                user={user} 
                onSelectOpportunity={(id) => navigate('detail', id)} 
              />
            </motion.div>
          )}

          {currentPage === 'weekly-digest' && (
            <motion.div
              key="weekly-digest"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <WeeklyDigest 
                user={user} 
                onSelectOpportunity={(id) => navigate('detail', id)} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-ink text-paper py-24 mt-32 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-accent/30" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center rotate-12">
                  <div className="w-4 h-4 bg-ink rounded-sm -rotate-12" />
                </div>
                <span className="text-3xl font-serif italic tracking-tight">OppHub</span>
              </div>
              <p className="text-paper/60 font-sans max-w-md text-lg leading-relaxed">
                Empowering the next generation of Ethiopian talent through automated opportunity discovery and community-driven insights.
              </p>
            </div>
            <div className="flex flex-col md:items-end gap-8">
              <div className="flex gap-12 text-sm font-mono uppercase tracking-widest">
                <a href="#" className="hover:text-accent transition-colors">Privacy</a>
                <a href="#" className="hover:text-accent transition-colors">Terms</a>
                <a href="#" className="hover:text-accent transition-colors">Contact</a>
              </div>
              <div className="h-[1px] w-full md:w-64 bg-paper/10" />
              <p className="text-paper/40 font-mono text-xs uppercase tracking-[0.2em]">
                © 2026 OppHub. Crafted with Habesha Elegance.
              </p>
            </div>
          </div>
          
          <div className="pt-16 border-t border-paper/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-paper/40">System Status: Operational</span>
            </div>
            <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-paper/20">
              v2.4.0-habesha-refined
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
