import { supabase } from '@/lib/supabaseClient';
import { Post } from '@/lib/types';
import OpportunityCard from '@/components/cards/OpportunityCard';
import SearchBar from '@/components/filters/SearchBar';
import CategoryFilter from '@/components/filters/CategoryFilter';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

interface HomePageProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { q, category } = await searchParams;

  let query = supabase
    .from('opportunities')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (q) {
    query = query.or(`title.ilike.%${q}%,organization.ilike.%${q}%,description.ilike.%${q}%`);
  }

  if (category && category !== 'ALL') {
    query = query.eq('category', category.charAt(0).toUpperCase() + category.slice(1).toLowerCase());
  }

  const { data: opportunities } = await query;

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-black leading-[0.85] uppercase">
              Find Your <br />
              <span className="text-orange-600 italic">Next Big</span> <br />
              Opportunity.
            </h1>
          </div>

          <div className="flex flex-col gap-8">
            <SearchBar defaultValue={q || ''} />
            <CategoryFilter defaultValue={category || ''} />
          </div>
        </div>
      </section>

      {/* Opportunities Grid */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      </section>
    </div>
  );
}
