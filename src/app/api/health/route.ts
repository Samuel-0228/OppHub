import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { authenticate } from '@/lib/auth';

export async function GET(request: Request) {
  const user = await authenticate(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const health: any = {
    status: "ok",
    timestamp: new Date().toISOString(),
    supabase: {
      configured: !!supabase,
      opportunities_table: false,
      settings_table: false
    },
    gemini: {
      configured: !!(process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY)
    }
  };

  if (supabase) {
    try {
      const { error: oppError } = await supabase.from("opportunities").select("id").limit(1);
      health.supabase.opportunities_table = !oppError;
      
      const { error: settingsError } = await supabase.from("settings").select("key").limit(1);
      health.supabase.settings_table = !settingsError;
    } catch (err) {
      console.error("Health check Supabase error:", err);
    }
  }

  return NextResponse.json(health);
}
