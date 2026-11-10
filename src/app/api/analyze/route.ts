import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { createClient } from "@supabase/supabase-js";

// Initialize Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function POST(req: Request) {
  try {
    // 1. Auth Check
    const authHeader = req.headers.get("authorization");
    if (!authHeader) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    // 2. Get Data
    const formData = await req.formData();
    const file = formData.get("image") as File;
    const pair = formData.get("pair") as string;
    const timeframe = formData.get("timeframe") as string;
    const market = formData.get("market") as string;

    if (!file) return NextResponse.json({ error: "No image provided" }, { status: 400 });

    // 3. Convert Image
    const bytes = await file.arrayBuffer();
    const base64Data = Buffer.from(bytes).toString("base64");
    const imageUrl = `data:${file.type};base64,${base64Data}`;

    // 4. Send to Groq
    const prompt = `
      You are an expert technical analyst. Analyze this ${timeframe} chart for ${pair} in the ${market} market.
      Look for trend, structure (BOS/CHoCH), liquidity sweeps, and key support/resistance.
      If the image is unreadable or not a chart, return INVALID.
      If there is no valid setup, return NO_SETUP.
      Otherwise, return a strict JSON object with:
      {
        "status": "VALID" | "NO_SETUP" | "INVALID",
        "direction": "BUY" | "SELL" | "NONE",
        "entry": number,
        "stopLoss": number,
        "takeProfit": number,
        "confidence": number (0-100),
        "reasoning": "explain the setup in 2 sentences"
      }
      Do not include markdown formatting like \`\`\`json. Return raw JSON only.
    `;

    // Using the new Qwen vision model
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
      model: "qwen/qwen3.8-27b",
      temperature: 0.1,
    });

    const responseText = completion.choices[0]?.message?.content || "";
    let analysisData;

    try {
      const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      analysisData = JSON.parse(cleanJson);
    } catch (e) {
      analysisData = {
        status: "INVALID",
        direction: "NONE",
        confidence: 0,
        reasoning: "AI returned unreadable data. Try a clearer image.",
      };
    }

    // 5. Save to Database
    await supabase.from("analyses").insert({
      user_id: user.id,
      market, pair, timeframe,
      status: analysisData.status,
      direction: analysisData.direction,
      entry: analysisData.entry || null,
      stop_loss: analysisData.stopLoss || null,
      take_profit: analysisData.takeProfit || null,
      confidence: analysisData.confidence || null,
      reasoning: analysisData.reasoning || null,
    });

    return NextResponse.json(analysisData);

  } catch (error) {
    console.error("AI Analysis Error:", error);
    return NextResponse.json({ error: "Failed to analyze image." }, { status: 500 });
  }
}