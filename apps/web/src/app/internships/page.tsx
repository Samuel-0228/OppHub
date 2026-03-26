import { supabase } from '@/lib/supabaseClient';
import OpportunityCard from '@/components/cards/OpportunityCard';
import SearchBar from '@/components/filters/SearchBar';
import { Briefcase } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function InternshipsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q || '';

  let supabaseQuery = supabase
    .from('opportunities')
    .select('*')
    .eq('status', 'approved')
    .eq('category', 'Internships')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false });

  if (query) {
    supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,organization.ilike.%${query}%,description.ilike.%${query}%`);
  }

  const { data: opportunities } = await supabaseQuery;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
          <Briefcase size={16} />
          <span>Internships</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight leading-tight">
          Find Your Next <span className="text-blue-600">Internship</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl">Discover the best internships from top organizations worldwide.</p>
      </div>

      <div className="mb-12">
        <SearchBar defaultValue={query} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {opportunities?.map((opp: any) => (
          <OpportunityCard key={opp.id} opportunity={opp} />
        ))}
      </div>

      {opportunities?.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 text-lg">No internships found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
