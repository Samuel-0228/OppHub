import { NextResponse } from 'next/server';
import axios from 'axios';
import { authenticate } from '@/lib/auth';

export async function POST(request: Request) {
  const user = await authenticate(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { botToken, chatId } = await request.json();
  try {
    const response = await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: "🔔 *OppHub Connection Test*\n\nIf you are seeing this message, your Telegram Bot is successfully connected to the OppHub Admin Dashboard!",
      parse_mode: 'Markdown'
    });
    if (response.data.ok) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: response.data.description }, { status: 400 });
    }
  } catch (error: any) {
    const msg = error.response?.data?.description || error.message;
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
