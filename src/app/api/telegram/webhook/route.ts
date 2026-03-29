import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabaseClient';
import { categorizeOpportunity } from '@/lib/telegram/categorize';
import { slugify } from '@/lib/utils/slugify';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const db = supabaseAdmin || supabase;
    if (!db) return NextResponse.json({ ok: true });

    const update = await request.json();
    const message = update.channel_post || update.message;

    if (!message) {
      return NextResponse.json({ ok: true });
    }

    const text = message.text || message.caption || "";
    if (!text) {
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

    // 1. Get Bot Token for Image Handling
    const { data: tokenData } = await db
      .from("settings")
      .select("value")
      .eq("key", "telegram_bot_token")
      .maybeSingle();
    
    const botToken = tokenData?.value;

    // 2. Handle Photo
    let imageUrl = null;
    if (message.photo && botToken) {
      try {
        const fileId = message.photo[message.photo.length - 1].file_id;
        const fileRes = await axios.get(`https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`);
        if (fileRes.data.ok) {
          const filePath = fileRes.data.result.file_path;
          imageUrl = `https://api.telegram.org/file/bot${botToken}/${filePath}`;
        }
      } catch (err) {
        console.error("Failed to fetch Telegram photo:", err);
      }
    }

    // 3. Categorize with Gemini
    const data = await categorizeOpportunity(text);
    
    // 4. Save to DB
    const title = data?.title || text.split("\n")[0] || "Untitled Opportunity";
    const slug = slugify(title) + "-" + telegramId;

    await db.from("opportunities").insert({
      telegram_id: telegramId,
      title: title,
      slug: slug,
      image_url: imageUrl,
      type: data?.type || "General",
      organization: data?.organization || "Unknown",
      location: data?.location || "Remote",
      deadline: data?.deadline || "",
      apply_link: data?.apply_link || (text.match(/https?:\/\/\S+/g)?.[0] || ""),
      description: data?.description || text,
      category: data?.category || "General",
      tags: data?.tags || (text.match(/#\w+/g) || []),
      status: 'pending'
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Webhook processing failed:", error.message);
    return NextResponse.json({ ok: true }); // Always return 200 to Telegram
  }
}
