import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;
    
    // Check if the key exists
    if (!apiKey) {
      return NextResponse.json({ reply: "System Error: API key missing in Vercel settings." });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // Updated model!
        messages: [
          { role: "system", content: "You are Krushy, the support bot for KrushyJersey. We sell football jerseys. Shipping takes 7-14 days. Customized jerseys cannot be returned. Answer concisely and coolly." },
          ...messages
        ],
      }),
    });
    
    const data = await response.json();
    
    // If Groq returns an error, show it
    if (!response.ok) {
      return NextResponse.json({ reply: `Groq Error: ${data.error?.message || "Unknown error"}` });
    }
    
    return NextResponse.json({ reply: data.choices[0].message.content });
  } catch (err) {
    return NextResponse.json({ reply: "Error connecting to AI." }, { status: 500 });
  }
}
