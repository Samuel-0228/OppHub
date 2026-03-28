import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: "OppHub API is running",
    version: "1.0.0"
  });
}
