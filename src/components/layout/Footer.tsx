import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center">
              <span className="text-3xl font-black italic tracking-tighter text-white">
                OPPHUB
              </span>
            </Link>
            <p className="mt-6 text-gray-400 text-sm leading-relaxed max-w-xs">
              The most advanced automated platform for finding internships, scholarships, and professional opportunities.
            </p>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-6">Explore</h3>
            <ul className="space-y-4">
              <li><Link href="/opportunities" className="text-sm font-bold text-white hover:text-orange-600 transition-colors">Browse All</Link></li>
              <li><Link href="/categories" className="text-sm font-bold text-white hover:text-orange-600 transition-colors">Categories</Link></li>
              <li><Link href="/blogs" className="text-sm font-bold text-white hover:text-orange-600 transition-colors">Weekly Digest</Link></li>
            </ul>
          </div>

          <div className="md:col-span-6">
            <h3 className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-6">Community</h3>
            <p className="text-gray-400 text-sm italic mb-6">
              Join 10,000+ students and professionals on our Telegram channel.
            </p>
            <Link 
              href="https://t.me/your_telegram_channel" 
              target="_blank"
              className="flex items-center gap-2 text-sm font-black uppercase tracking-widest hover:text-orange-600 transition-colors"
            >
              Join Telegram
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            © {new Date().getFullYear()} OPPORTUNITY HUB. ALL RIGHTS RESERVED.
          </p>
          <div className="flex space-x-8">
            <Link href="/privacy" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
