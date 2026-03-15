import React from 'react';
import { Send, Twitter, Github, Linkedin, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 px-4 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-indigo-500 p-1.5 rounded-lg">
                <Send className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">OpporTunix</span>
            </div>
            <p className="text-slate-400 max-w-sm mb-6">
              The smartest way to stay updated with global opportunities. We curate and categorize posts directly from your favorite Telegram channels.
            </p>
            <div className="flex gap-4">
              <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                <Twitter className="w-5 h-5" />
              </button>
              <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                <Linkedin className="w-5 h-5" />
              </button>
              <button className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                <Mail className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Browse Internships</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Tech Events</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Scholarship Board</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Startup Competitions</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Join Us</h4>
            <div className="bg-indigo-600/10 border border-indigo-500/20 p-4 rounded-xl">
              <p className="text-xs text-indigo-300 font-medium mb-2 uppercase tracking-wider">Community</p>
              <p className="text-sm text-white mb-4">Get real-time updates directly in your Telegram inbox.</p>
              <a 
                href="https://t.me/yourchannel" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all"
              >
                <Send className="w-4 h-4" />
                Join Telegram
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2025 OpporTunix. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};