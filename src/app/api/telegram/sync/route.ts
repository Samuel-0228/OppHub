import { NextResponse } from 'next/server';
import axios from 'axios';
import { supabase, supabaseAdmin } from '@/lib/supabaseClient';
import { categorizeOpportunity } from '@/lib/telegram/categorize';
import { authenticate } from '@/lib/auth';
import { slugify } from '@/lib/utils/slugify';

export async function POST(request: Request) {
  const user = await authenticate(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { botToken, chatId } = await request.json();
  const db = supabaseAdmin || supabase;

  if (!db) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  console.log(`Sync started for chat: ${chatId}`);

  try {
    const { data: offsetData } = await db
      .from("settings")
      .select("value")
      .eq("key", "telegram_offset")
      .maybeSingle();

    const offset = offsetData ? parseInt(offsetData.value) : 0;
    
    // 1. Check if webhook is set. If so, we MUST delete it to use getUpdates
    try {
      const webhookInfo = await axios.get(`https://api.telegram.org/bot${botToken}/getWebhookInfo`);
      if (webhookInfo.data.result.url) {
        console.log("Webhook is active. Deleting temporarily for manual sync...");
        await axios.get(`https://api.telegram.org/bot${botToken}/deleteWebhook`);
      }
    } catch (err: any) {
      console.warn("Webhook check failed:", err.message);
    }

    // 2. Fetch Updates
    const response = await axios.get(`https://api.telegram.org/bot${botToken}/getUpdates?offset=${offset}&limit=100`);
    if (!response.data.ok) {
      throw new Error(`Telegram API error: ${response.data.description}`);
    }

    const updates = response.data.result;
    console.log(`Found ${updates.length} new updates from Telegram.`);

    let importedCount = 0;
    let skippedCount = 0;
    let failedCount = 0;
    let lastUpdateId = offset - 1;

    for (const update of updates) {
      lastUpdateId = update.update_id;
      const message = update.channel_post || update.message;
      if (!message) continue;

      const text = message.text || message.caption || "";
      if (!text) continue;

      const telegramId = message.message_id.toString();
      
      // Skip if already exists
      const { data: existing } = await db
        .from("opportunities")
        .select("id")
        .eq("telegram_id", telegramId)
        .maybeSingle();

      if (existing) {
        skippedCount++;
        continue;
      }

      // Handle Photo
      let imageUrl = null;
      if (message.photo) {
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

      console.log(`Categorizing message ${telegramId}...`);
      const data = await categorizeOpportunity(text);
      
      if (!data) {
        console.warn(`Categorization failed for message ${telegramId}. Skipping.`);
        failedCount++;
        continue;
      }

      const title = data.title || text.split("\n")[0] || "Untitled Opportunity";
      const slug = slugify(title) + "-" + telegramId;

      const { error: insertError } = await db.from("opportunities").insert({
        telegram_id: telegramId,
        title: title,
        slug: slug,
        image_url: imageUrl,
        type: data.type || "General",
        organization: data.organization || "Unknown",
        location: data.location || "Remote",
        deadline: data.deadline || "",
        apply_link: data.apply_link || (text.match(/https?:\/\/\S+/g)?.[0] || ""),
        description: data.description || text,
        category: data.category || "General",
        tags: data.tags || (text.match(/#\w+/g) || []),
        status: 'pending'
      });

      if (insertError) {
        console.error(`Failed to insert opportunity ${telegramId}:`, insertError.message);
        failedCount++;
      } else {
        importedCount++;
      }
    }

    // 3. Update Offset
    if (lastUpdateId >= offset) {
      await db.from("settings").upsert({ key: "telegram_offset", value: (lastUpdateId + 1).toString() });
    }

    let finalMessage = "";
    if (updates.length === 0) {
      finalMessage = "No new messages found in the last 24 hours.";
    } else {
      finalMessage = `Sync complete: ${importedCount} imported, ${skippedCount} already existed, ${failedCount} failed categorization.`;
      if (failedCount > 0) {
        finalMessage += " Check your Gemini API key if many failed.";
      }
    }

    return NextResponse.json({ 
      success: true, 
      importedCount,
      message: finalMessage
    });
  } catch (error: any) {
    console.error("Sync failed:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
