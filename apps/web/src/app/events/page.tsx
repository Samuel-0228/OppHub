import { supabase } from '@/lib/supabaseClient';
import OpportunityCard from '@/components/cards/OpportunityCard';

export const dynamic = 'force-dynamic';

export default async function EventsPage() {
  const { data: events } = await supabase
    .from('opportunities')
    .select('*')
    .eq('status', 'approved')
    .eq('category', 'Events')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-gray-900">Upcoming Events</h1>
        <p className="mt-2 text-gray-500">Conferences, workshops, and networking events</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events?.map((opp: any) => (
          <OpportunityCard key={opp.id} opportunity={opp} />
        ))}
      </div>

      {events?.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 text-lg">No upcoming events found.</p>
        </div>
      )}
    </div>
  );
}
