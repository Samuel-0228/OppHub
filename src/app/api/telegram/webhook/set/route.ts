import { NextResponse } from 'next/server';
import axios from 'axios';
import { supabase, supabaseAdmin } from '@/lib/supabaseClient';
import { authenticate } from '@/lib/auth';

export async function POST(request: Request) {
  const user = await authenticate(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = supabaseAdmin || supabase;
  const { botToken } = await request.json();
  
  if (!botToken) {
    return NextResponse.json({ error: "Bot Token is required" }, { status: 400 });
  }

  // Use the APP_URL from environment or construct it
  const appUrl = process.env.APP_URL || request.headers.get('origin') || "";
  if (!appUrl) {
    return NextResponse.json({ error: "Could not determine App URL" }, { status: 500 });
  }

  const webhookUrl = `${appUrl}/api/telegram`;

  try {
    const response = await axios.get(`https://api.telegram.org/bot${botToken}/setWebhook?url=${webhookUrl}`);
    if (response.data.ok) {
      return NextResponse.json({ success: true, description: response.data.description });
    } else {
      return NextResponse.json({ error: response.data.description }, { status: 400 });
    }
  } catch (error: any) {
    const msg = error.response?.data?.description || error.message;
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
