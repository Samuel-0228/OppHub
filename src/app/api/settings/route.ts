import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabaseClient';
import { authenticate } from '@/lib/auth';

export async function GET(request: Request) {
  const user = await authenticate(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = supabaseAdmin || supabase;
  if (!db) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  
  const { data, error } = await db.from("settings").select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const settings = data.reduce((acc: any, row: any) => ({ ...acc, [row.key]: row.value }), {});
  return NextResponse.json(settings);
}

export async function POST(request: Request) {
  const user = await authenticate(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = supabaseAdmin || supabase;
  if (!db) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  
  const { telegram_bot_token, telegram_chat_id } = await request.json();
  const updates = [];
  if (telegram_bot_token) updates.push({ key: "telegram_bot_token", value: telegram_bot_token });
  if (telegram_chat_id) updates.push({ key: "telegram_chat_id", value: telegram_chat_id });
  if (updates.length > 0) {
    const { error } = await db.from("settings").upsert(updates);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
