import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                OppHub
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-500 leading-relaxed">
              Empowering students and professionals by centralizing opportunities from across the web. Never miss a chance to grow.
            </p>
            <div className="mt-6 flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <Github className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Explore</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/opportunities" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">All Opportunities</Link></li>
              <li><Link href="/internships" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Internships</Link></li>
              <li><Link href="/events" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Events</Link></li>
              <li><Link href="/scholarships" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Scholarships</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/blog" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Blog</Link></li>
              <li><Link href="/faq" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">FAQ</Link></li>
              <li><Link href="/support" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Support</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Contact</h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center text-sm text-gray-500">
                <Mail className="w-4 h-4 mr-2" />
                hello@opphub.com
              </li>
              <li className="flex items-center text-sm text-gray-500">
                <Globe className="w-4 h-4 mr-2" />
                opphub.com
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} OppHub. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link href="/privacy" className="text-sm text-gray-400 hover:text-blue-600 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-gray-400 hover:text-blue-600 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
