'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    setIsAdmin(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAdmin(false);
    router.push('/');
    router.refresh();
  };

  return (
    <nav className="bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-black italic tracking-tighter text-black">
                OPPHUB
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-900 hover:text-orange-600 text-sm font-semibold transition-colors">
              Home
            </Link>
            <Link href="/events" className="text-gray-900 hover:text-orange-600 text-sm font-semibold transition-colors">
              Events
            </Link>
            <Link href="/internships" className="text-gray-900 hover:text-orange-600 text-sm font-semibold transition-colors">
              Internships
            </Link>
            <Link href="/opportunities" className="text-gray-900 hover:text-orange-600 text-sm font-semibold transition-colors">
              Opportunities
            </Link>
            <Link href="/blogs" className="text-gray-900 hover:text-orange-600 text-sm font-semibold transition-colors">
              Blogs
            </Link>
            {isAdmin ? (
              <div className="flex items-center space-x-6">
                <Link href="/admin" className="text-gray-900 hover:text-orange-600 text-sm font-semibold transition-colors">
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-600 text-sm font-semibold transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className="text-gray-500 hover:text-orange-600 text-sm font-semibold transition-colors">
                Admin Login
              </Link>
            )}
            <Link 
              href="https://t.me/your_telegram_channel" 
              target="_blank"
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all"
            >
              <Send className="w-4 h-4" />
              Join Telegram
            </Link>
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-900 hover:text-orange-600 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-orange-600 rounded-md">
              Home
            </Link>
            <Link href="/events" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-orange-600 rounded-md">
              Events
            </Link>
            <Link href="/internships" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-orange-600 rounded-md">
              Internships
            </Link>
            <Link href="/opportunities" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-orange-600 rounded-md">
              Opportunities
            </Link>
            <Link href="/blogs" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-orange-600 rounded-md">
              Blogs
            </Link>
            {isAdmin ? (
              <>
                <Link href="/admin" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-orange-600 rounded-md">
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-500 hover:text-red-600 rounded-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-orange-600 rounded-md">
                Admin Login
              </Link>
            )}
            <Link 
              href="https://t.me/your_telegram_channel" 
              target="_blank"
              className="flex items-center gap-2 px-3 py-2 text-base font-bold text-black uppercase tracking-widest"
            >
              <Send className="w-4 h-4" />
              Join Telegram
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
