import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { analyzeMarket, type Candle } from "@/lib/engine";

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
    const pair = (formData.get("pair") as string) || "BTCUSDT";
    const timeframe = (formData.get("timeframe") as string) || "1H";
    const market = (formData.get("market") as string) || "Crypto";

    // 3. Fetch Market Data from Binance (Free, No Key Required)
    // We format the pair (e.g. EUR/USD -> EURUSDT)
    let binancePair = pair.replace("/", "").toUpperCase();
    if (!binancePair.endsWith("USDT") && !binancePair.endsWith("BUSD")) {
      binancePair = binancePair.replace("USD", "USDT");
    }
    
    let interval = "1h";
    if (timeframe === "1M") interval = "1m";
    if (timeframe === "5M") interval = "5m";
    if (timeframe === "15M") interval = "15m";
    if (timeframe === "4H") interval = "4h";
    if (timeframe === "1D") interval = "1d";

    const binanceUrl = `https://api.binance.com/api/v3/klines?symbol=${binancePair}&interval=${interval}&limit=250`;
    
    const marketRes = await fetch(binanceUrl);
    if (!marketRes.ok) {
      throw new Error(`Failed to fetch live data for ${pair}. Make sure the pair exists on Binance (e.g. BTCUSDT).`);
    }
    
    const rawData = await marketRes.json();
    
    // 4. Format the data for our engine
    const candles: Candle[] = rawData.map((d: any) => ({
      time: d[0],
      open: parseFloat(d[1]),
      high: parseFloat(d[2]),
      low: parseFloat(d[3]),
      close: parseFloat(d[4]),
    }));

    // 5. Run OUR Custom Engine
    const analysisData = analyzeMarket(candles, pair);

    // 6. Save the analysis to Supabase
    await supabase.from("analyses").insert({
      user_id: user.id,
      market: market,
      pair: pair,
      timeframe: timeframe,
      status: analysisData.status,
      direction: analysisData.direction,
      entry: analysisData.entry || null,
      stop_loss: analysisData.stopLoss || null,
      take_profit: analysisData.takeProfit || null,
      confidence: analysisData.confidence || null,
      reasoning: analysisData.reasoning || null,
    });

    return NextResponse.json(analysisData);

  } catch (error: any) {
    console.error("Analysis Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze market." }, 
      { status: 500 }
    );
  }
}