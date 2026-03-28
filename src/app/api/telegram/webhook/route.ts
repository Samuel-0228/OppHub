import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabaseClient';
import { categorizeOpportunity } from '@/lib/telegram/categorize';

export async function POST(request: Request) {
  try {
    const db = supabaseAdmin || supabase;
    if (!db) return NextResponse.json({ ok: true });

    const update = await request.json();
    const message = update.channel_post || update.message;

    if (!message || !message.text) {
      return NextResponse.json({ ok: true });
    }

    const telegramId = message.message_id.toString();
    const { data: existing } = await db
      .from("opportunities")
      .select("id")
      .eq("telegram_id", telegramId)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ ok: true });
    }

    const data = await categorizeOpportunity(message.text);
    if (!data) {
      return NextResponse.json({ ok: true });
    }

    await db.from("opportunities").insert({
      telegram_id: telegramId,
      title: data.title || "Untitled Opportunity",
      type: data.type || "General",
      organization: data.organization || "Unknown",
      location: data.location || "Remote",
      deadline: data.deadline || "",
      apply_link: data.apply_link || "",
      description: data.description || message.text,
      category: data.category || "General",
      tags: data.tags || [],
      status: 'pending'
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Webhook processing failed:", error.message);
    return NextResponse.json({ ok: true }); // Always return 200 to Telegram
  }
}
