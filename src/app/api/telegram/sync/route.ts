import { NextResponse } from 'next/server';
import axios from 'axios';
import { supabase, supabaseAdmin } from '@/lib/supabaseClient';
import { categorizeOpportunity } from '@/lib/telegram/categorize';
import { authenticate } from '@/lib/auth';

export async function POST(request: Request) {
  const user = await authenticate(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { botToken, chatId } = await request.json();
  const db = supabaseAdmin || supabase;

  if (!db) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  console.log(`Sync started with botToken: ${botToken?.substring(0, 5)}... and chatId: ${chatId}`);

  try {
    const { data: offsetData, error: offsetError } = await db
      .from("settings")
      .select("value")
      .eq("key", "telegram_offset")
      .maybeSingle();

    if (offsetError) {
      console.error("Failed to fetch telegram_offset:", offsetError);
      return NextResponse.json({ error: `Supabase error (settings): ${offsetError.message}` }, { status: 500 });
    }

    const offset = offsetData ? parseInt(offsetData.value) : 0;
    console.log(`Fetching updates from Telegram with offset: ${offset}`);

    // Ensure no webhook is active before polling to avoid 409 Conflict
    try {
      await axios.get(`https://api.telegram.org/bot${botToken}/deleteWebhook`);
    } catch (webhookError: any) {
      console.warn("Failed to delete webhook (might not be set):", webhookError.message);
    }

    const response = await axios.get(`https://api.telegram.org/bot${botToken}/getUpdates?offset=${offset}`);
    if (!response.data.ok) {
      console.error("Telegram API error:", response.data);
      return NextResponse.json({ error: `Telegram API error: ${response.data.description}` }, { status: 500 });
    }

    const updates = response.data.result;
    console.log(`Found ${updates.length} updates from Telegram.`);

    let importedCount = 0;
    let lastUpdateId = offset - 1;

    for (const update of updates) {
      lastUpdateId = update.update_id;
      const message = update.channel_post || update.message;
      if (!message || !message.text) continue;

      // Handle /start command for connection verification
      if (message.text.trim() === '/start') {
        console.log(`Received /start from chat ${message.chat.id}. Sending confirmation...`);
        try {
          await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            chat_id: message.chat.id,
            text: "✅ *OppHub Bot is successfully connected!*\n\nI am now ready to sync opportunities from this channel/chat to the OppHub platform. \n\nClick 'Sync Now' in your Admin Dashboard to begin importing posts.",
            parse_mode: 'Markdown'
          });
        } catch (replyError: any) {
          console.error("Failed to send /start reply:", replyError.message);
        }
        continue; // Skip categorization for command messages
      }

      const telegramId = message.message_id.toString();
      const { data: existing, error: existingError } = await db
        .from("opportunities")
        .select("id")
        .eq("telegram_id", telegramId)
        .maybeSingle();

      if (existingError) {
        console.error("Failed to check existing opportunity:", existingError);
        continue;
      }
      if (existing) continue;

      console.log(`Categorizing message: ${message.text.substring(0, 50)}...`);
      const data = await categorizeOpportunity(message.text);
      if (!data) {
        console.warn("Categorization returned null for message:", telegramId);
        continue;
      }

      const { error: insertError } = await db.from("opportunities").insert({
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

      if (insertError) {
        console.error("Failed to insert opportunity:", insertError);
      } else {
        importedCount++;
      }
    }

    if (lastUpdateId >= offset) {
      const { error: upsertError } = await db
        .from("settings")
        .upsert({ key: "telegram_offset", value: (lastUpdateId + 1).toString() });
      if (upsertError) {
        console.error("Failed to update telegram_offset:", upsertError);
      }
    }

    console.log(`Sync completed. Imported ${importedCount} opportunities.`);
    return NextResponse.json({ success: true, importedCount });
  } catch (error: any) {
    console.error("Sync failed with error:", error.message);
    if (error.response) {
      console.error("Telegram API response error:", error.response.data);
      return NextResponse.json({ error: `Telegram API error: ${error.response.data.description || error.message}` }, { status: 500 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
