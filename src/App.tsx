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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-black rounded-xl animate-bounce flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded-sm rotate-45" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest animate-pulse">Loading OppHub...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-black selection:text-white">
      <Navbar user={user} onSearch={setSearchQuery} />
      
      <main>
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Admin user={user} />
            </motion.div>
          )}

          {currentPage === 'bookmarks' && (
            <motion.div
              key="bookmarks"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <WeeklyDigest 
                user={user} 
                onSelectOpportunity={(id) => navigate('detail', id)} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="bg-slate-50 border-t border-black/5 py-12 mt-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-6">
            <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-sm rotate-45" />
            </div>
            <span className="text-lg font-black tracking-tighter uppercase italic">OppHub</span>
          </div>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-8">
            The automated platform for finding your next big opportunity. 
            Join our Telegram for real-time alerts.
          </p>
          <div className="flex justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <a href="#" className="hover:text-black">Privacy Policy</a>
            <a href="#" className="hover:text-black">Terms of Service</a>
            <a href="#" className="hover:text-black">Contact Us</a>
          </div>
          <div className="mt-12 text-[10px] text-slate-300">
            © 2026 OppHub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
