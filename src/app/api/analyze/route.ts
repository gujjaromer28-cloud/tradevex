import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Initialize the new Google Gen AI SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;
    const pair = formData.get("pair") as string;
    const timeframe = formData.get("timeframe") as string;
    const market = formData.get("market") as string;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Convert image to base64
    const bytes = await file.arrayBuffer();
    const base64Data = Buffer.from(bytes).toString("base64");

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

    // Use the new gemini-3.8-flash model as required by the API
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [
        prompt,
        {
          inlineData: {
            data: base64Data,
            mimeType: file.type,
          },
        },
      ],
    });

    const responseText = response.text || "";
    
    // Parse the JSON response
    let analysisData;
    try {
      // Clean up potential markdown formatting if the AI adds it anyway
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

    return NextResponse.json(analysisData);

  } catch (error) {
    console.error("AI Analysis Error:", error);
    return NextResponse.json(
      { error: "Failed to analyze image. Check API key or server logs." },
      { status: 500 }
    );
  }
}