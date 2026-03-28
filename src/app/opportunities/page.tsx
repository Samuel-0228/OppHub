import { supabase } from '@/lib/supabaseClient';
import { Post } from '@/lib/types';
import OpportunityCard from '@/components/cards/OpportunityCard';

export const dynamic = 'force-dynamic';

export default async function OpportunitiesPage() {
  const { data: opportunities } = await supabase
    .from('opportunities')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  return (
    <div className="flex flex-col w-full min-h-screen bg-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-black leading-[0.85] uppercase mb-16">
          All <br />
          <span className="text-purple-600 italic">Opportunities</span>
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-24">
          {opportunities?.map((opp: Post) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
          {!opportunities?.length && (
            <div className="col-span-3 py-20 text-center">
              <p className="text-2xl font-black italic tracking-tighter text-gray-300 uppercase">
                No opportunities found.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
