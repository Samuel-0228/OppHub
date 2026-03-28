import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';
import { Building2, MapPin, Calendar, Globe, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface OpportunityPageProps {
  params: Promise<{ id: string }>;
}

export default async function OpportunityPage({ params }: OpportunityPageProps) {
  const { id } = await params;
  
  const { data: opp } = await supabase
    .from('opportunities')
    .select('*')
    .eq('id', id)
    .single();

  if (!opp) {
    return notFound();
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-white pt-24 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          href="/"
          className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors mb-12"
        >
          <ArrowLeft className="mr-2 w-3 h-3" />
          Back to all
        </Link>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-widest rounded-full">
              {opp.category}
            </span>
            {opp.is_featured && (
              <span className="px-3 py-1 bg-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                Featured
              </span>
            )}
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-black leading-[0.9] uppercase mb-8">
            {opp.title}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-gray-50 border-l-8 border-black">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Organization</span>
              <div className="flex items-center font-black text-black uppercase tracking-tight">
                <Building2 className="w-4 h-4 mr-2" />
                {opp.organization}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Location</span>
              <div className="flex items-center font-black text-black uppercase tracking-tight">
                <MapPin className="w-4 h-4 mr-2" />
                {opp.location}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Deadline</span>
              <div className="flex items-center font-black text-orange-600 uppercase tracking-tight">
                <Calendar className="w-4 h-4 mr-2" />
                {opp.deadline || 'Ongoing'}
              </div>
            </div>
          </div>
        </div>

        <div className="prose prose-2xl max-w-none mb-16">
          <h2 className="text-2xl font-black uppercase tracking-tighter mb-6">Description</h2>
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap font-medium">
            {opp.description}
          </p>
        </div>

        {opp.apply_link && (
          <div className="flex flex-col sm:flex-row items-center gap-6 p-12 bg-black text-white">
            <div className="flex-grow">
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-2 italic">Ready to apply?</h3>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Click the button to visit the official website</p>
            </div>
            <a 
              href={opp.apply_link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-12 py-6 bg-orange-600 text-white font-black uppercase tracking-tighter hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3"
            >
              <Globe className="w-5 h-5" />
              Apply Now
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
