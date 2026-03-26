import { supabase } from '@/lib/supabaseClient';
import OpportunityCard from '@/components/cards/OpportunityCard';

export const dynamic = 'force-dynamic';

export default async function ScholarshipsPage() {
  const { data: scholarships } = await supabase
    .from('opportunities')
    .select('*')
    .eq('status', 'approved')
    .eq('category', 'Scholarships')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900">Scholarships & Grants</h1>
        <p className="mt-2 text-gray-500">Funding for your education and research</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {scholarships?.map((opp: any) => (
          <OpportunityCard key={opp.id} opportunity={opp} />
        ))}
      </div>

      {scholarships?.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 text-lg">No scholarships found.</p>
        </div>
      )}
    </div>
  );
}
