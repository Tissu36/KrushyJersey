import { NextResponse } from "next/server";

export async function POST(req) {
  // This is where Moneris integration will go.
  // For now, it safely blocks checkout so no fake payments happen.
  return NextResponse.json({ 
    error: "Moneris payment gateway is not configured yet. Please contact support." 
  }, { status: 503 });
}
