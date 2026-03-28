import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabaseClient';
import { authenticate } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = supabaseAdmin || supabase;
  const { data, error } = await db.from("opportunities").select("*").eq("id", id).single();
  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  
  // Increment views in background
  db.rpc("increment_view_count", { row_id: id }).catch((err: any) => console.error("Failed to increment views:", err));
  
  return NextResponse.json(data);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await authenticate(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { title, category, organization, deadline, description, apply_link, is_pinned, is_featured } = body;
  
  const db = supabaseAdmin || supabase;
  const { error } = await db.from("opportunities").update({
    title, category, organization, deadline, description, apply_link, 
    is_pinned: !!is_pinned, 
    is_featured: !!is_featured
  }).eq("id", id);
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await authenticate(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const db = supabaseAdmin || supabase;
  const { error } = await db.from("opportunities").delete().eq("id", id);
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
