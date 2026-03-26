import Link from 'next/link';
import { ArrowRight, Briefcase, Calendar, GraduationCap, TrendingUp, Globe, ShieldCheck, Zap } from 'lucide-react';
import OpportunityCard from '@/components/cards/OpportunityCard';
import { supabase } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const { data: featuredOpps } = await supabase
    .from('opportunities')
    .select('*')
    .eq('status', 'approved')
    .eq('is_featured', true)
    .limit(3);

  const categories = [
    { name: 'Internships', icon: Briefcase, color: 'bg-blue-50 text-blue-600', count: '120+', href: '/internships' },
    { name: 'Events', icon: Calendar, color: 'bg-purple-50 text-purple-600', count: '45+', href: '/events' },
    { name: 'Scholarships', icon: GraduationCap, color: 'bg-green-50 text-green-600', count: '30+', href: '/scholarships' },
    { name: 'Competitions', icon: TrendingUp, color: 'bg-orange-50 text-orange-600', count: '15+', href: '/competitions' },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative bg-white pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                <span className="block">Your Gateway to</span>
                <span className="block text-blue-600">Global Opportunities</span>
              </h1>
              <p className="mt-6 text-lg text-gray-500 sm:text-xl">
                OppHub centralizes internships, events, and scholarships from across the web. Powered by AI to bring you the most relevant opportunities first.
              </p>
              <div className="mt-10 sm:flex sm:justify-center lg:justify-start space-x-4">
                <Link href="/opportunities" className="flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-all shadow-lg hover:shadow-xl">
                  Explore Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <Link href="/about" className="flex items-center justify-center px-8 py-3 border border-gray-200 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-all">
                  How it works
                </Link>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-2xl shadow-2xl overflow-hidden bg-gray-100 aspect-video">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <Globe className="w-24 h-24 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-white">500+</p>
              <p className="text-blue-100 text-sm mt-1 uppercase tracking-wider">Active Opps</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">50+</p>
              <p className="text-blue-100 text-sm mt-1 uppercase tracking-wider">Organizations</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">10k+</p>
              <p className="text-blue-100 text-sm mt-1 uppercase tracking-wider">Monthly Users</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">24/7</p>
              <p className="text-blue-100 text-sm mt-1 uppercase tracking-wider">AI Sync</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Browse by Category</h2>
            <p className="mt-4 text-lg text-gray-500">Find exactly what you're looking for</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat) => (
              <Link key={cat.name} href={cat.href} className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-blue-200">
                <div className={`${cat.color} w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <cat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{cat.name}</h3>
                <p className="mt-2 text-gray-500">{cat.count} opportunities</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Opportunities</h2>
              <p className="mt-2 text-gray-500">Hand-picked premium opportunities for you</p>
            </div>
            <Link href="/opportunities" className="hidden md:flex items-center text-blue-600 font-semibold hover:text-blue-700">
              View all
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredOpps?.map((opp: any) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
            {!featuredOpps?.length && (
              <div className="col-span-3 py-12 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl">
                No featured opportunities at the moment.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-16">Why choose OppHub?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-4 rounded-full mb-6">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI-Powered</h3>
              <p className="text-gray-500">We use Gemini to automatically categorize and extract details from raw posts.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-green-100 p-4 rounded-full mb-6">
                <ShieldCheck className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Verified Only</h3>
              <p className="text-gray-500">Every opportunity is reviewed by our admin team before going live.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-purple-100 p-4 rounded-full mb-6">
                <Globe className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Centralized</h3>
              <p className="text-gray-500">Stop scrolling through dozens of Telegram channels. We bring them all here.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
