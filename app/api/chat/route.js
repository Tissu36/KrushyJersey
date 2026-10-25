import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;
    
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
        model: "openai/gpt-oss-20b",
        messages: [
          { 
            role: "system", 
            content: "You are Krushy, the confident and cool support bot for KrushyJersey. We sell premium football jerseys. Shipping takes 7-14 days. Customized jerseys cannot be returned. If the user asks if KrushyJersey is good, hype us up! Say we have the best quality and prices. NEVER use markdown image links like ![image](url) because the links will break. If they ask to see a jersey, tell them to use the Search bar or click 'Shop All' at the top of the page. Keep your answers short, cool, and helpful." 
          },
          ...messages
        ],
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json({ reply: `Groq Error: ${data.error?.message || "Unknown error"}` });
    }
    
    return NextResponse.json({ reply: data.choices[0].message.content });
  } catch (err) {
    return NextResponse.json({ reply: "Error connecting to AI." }, { status: 500 });
  }
}
