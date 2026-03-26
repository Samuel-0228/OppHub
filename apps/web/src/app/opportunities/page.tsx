import { supabase } from '@/lib/supabaseClient';
import OpportunityCard from '@/components/cards/OpportunityCard';
import SearchBar from '@/components/filters/SearchBar';
import CategoryFilter from '@/components/filters/CategoryFilter';

export const dynamic = 'force-dynamic';

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const query = q || '';
  const selectedCategory = category || '';

  let supabaseQuery = supabase
    .from('opportunities')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (query) {
    supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,organization.ilike.%${query}%,description.ilike.%${query}%`);
  }

  if (selectedCategory && selectedCategory !== 'All') {
    supabaseQuery = supabaseQuery.eq('category', selectedCategory);
  }

  const { data: opportunities } = await supabaseQuery;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Opportunities</h1>
          <p className="mt-2 text-gray-500">Discover your next career move</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <SearchBar defaultValue={query} />
          <CategoryFilter defaultValue={selectedCategory} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {opportunities?.map((opp: any) => (
          <OpportunityCard key={opp.id} opportunity={opp} />
        ))}
      </div>

      {opportunities?.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 text-lg">No opportunities found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
