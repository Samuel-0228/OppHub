import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabaseClient';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const type = searchParams.get('type');
  const search = searchParams.get('search');
  const status = searchParams.get('status');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');

  const db = supabaseAdmin || supabase;
  let query = db
    .from('opportunities')
    .select('*', { count: 'exact' });

  if (status && status !== 'all') {
    query = query.eq('status', status);
  } else if (!status) {
    query = query.eq('status', 'approved');
  }

  query = query.order('created_at', { ascending: false });

  if (category && category !== 'All') {
    query = query.eq('category', category);
  }

  if (type && type !== 'All') {
    query = query.eq('type', type);
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,organization.ilike.%${search}%`);
  }

  const { data, error, count } = await query.range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, count });
}
