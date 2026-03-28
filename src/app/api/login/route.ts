import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  const { email, password } = await request.json();
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email || process.env.ADMIN_EMAIL,
      password: password
    });
    if (error) throw error;
    return NextResponse.json({ token: data.session?.access_token });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Invalid credentials" }, { status: 401 });
  }
}
