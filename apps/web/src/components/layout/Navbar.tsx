'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Search, Bell } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                OppHub
              </span>
            </Link>
            <div className="hidden md:ml-8 md:flex md:space-x-8">
              <Link href="/opportunities" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                All Opportunities
              </Link>
              <Link href="/internships" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                Internships
              </Link>
              <Link href="/events" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                Events
              </Link>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <Link href="/login" className="ml-4 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
              Admin Login
            </Link>
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-blue-600 hover:bg-gray-100 focus:outline-none"
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
            <Link href="/opportunities" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md">
              All Opportunities
            </Link>
            <Link href="/internships" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md">
              Internships
            </Link>
            <Link href="/events" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md">
              Events
            </Link>
            <Link href="/login" className="block px-3 py-2 text-base font-medium text-blue-600 font-semibold">
              Admin Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
