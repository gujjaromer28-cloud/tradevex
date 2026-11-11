import { EMA, RSI, ATR } from "technicalindicators";

// Define the type of data we work with
export type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

export type TradeSetup = {
  status: "VALID" | "NO_SETUP";
  direction: "BUY" | "SELL" | "NONE";
  entry: number;
  stopLoss: number;
  takeProfit: number;
  confidence: number;
  reasoning: string;
};

export function analyzeMarket(candles: Candle[], pair: string): TradeSetup {
  // 1. Get the closing prices
  const closes = candles.map((c) => c.close);
  const highs = candles.map((c) => c.high);
  const lows = candles.map((c) => c.low);
  
  const currentPrice = closes[closes.length - 1];

  // 2. Calculate Indicators using the library
  const ema50 = EMA.calculate({ period: 50, values: closes });
  const ema200 = EMA.calculate({ period: 200, values: closes });
  const rsi = RSI.calculate({ period: 14, values: closes });
  const atr = ATR.calculate({ period: 14, high: highs, low: lows, close: closes });

  const currentEma50 = ema50[ema50.length - 1];
  const currentEma200 = ema200[ema200.length - 1];
  const currentRsi = rsi[rsi.length - 1];
  const currentAtr = atr[atr.length - 1];

  // 3. OUR CUSTOM TRADING RULES
  
  // RULE 1: Bullish Trend (EMA 50 > EMA 200)
  const isBullishTrend = currentEma50 > currentEma200;
  const isBearishTrend = currentEma50 < currentEma200;

  // RULE 2: Pullback (RSI must be below 50 for buy, above 50 for sell)
  const isBullishPullback = currentRsi < 50 && currentRsi > 30;
  const isBearishPullback = currentRsi > 50 && currentRsi < 70;

  // RULE 3: Setup Logic
  if (isBullishTrend && isBullishPullback) {
    // BUY SETUP
    const entry = currentPrice;
    const stopLoss = entry - (currentAtr * 1.5); // Risk 1.5x ATR
    const takeProfit = entry + (currentAtr * 3.0); // Reward 3x ATR

    return {
      status: "VALID",
      direction: "BUY",
      entry: Number(entry.toFixed(5)),
      stopLoss: Number(stopLoss.toFixed(5)),
      takeProfit: Number(takeProfit.toFixed(5)),
      confidence: 80,
      reasoning: `${pair} is in a strong bullish trend (EMA50 > EMA200). RSI has pulled back to ${currentRsi.toFixed(1)}, indicating a prime buying opportunity. Stop loss is placed 1.5x ATR away.`,
    };
  } else if (isBearishTrend && isBearishPullback) {
    // SELL SETUP
    const entry = currentPrice;
    const stopLoss = entry + (currentAtr * 1.5);
    const takeProfit = entry - (currentAtr * 3.0);

    return {
      status: "VALID",
      direction: "SELL",
      entry: Number(entry.toFixed(5)),
      stopLoss: Number(stopLoss.toFixed(5)),
      takeProfit: Number(takeProfit.toFixed(5)),
      confidence: 80,
      reasoning: `${pair} is in a strong bearish trend (EMA50 < EMA200). RSI has pulled back to ${currentRsi.toFixed(1)}, indicating a prime selling opportunity. Stop loss is placed 1.5x ATR away.`,
    };
  }

  // RULE 4: No Setup
  return {
    status: "NO_SETUP",
    direction: "NONE",
    entry: 0,
    stopLoss: 0,
    takeProfit: 0,
    confidence: 0,
    reasoning: `${pair} is currently choppy or overextended. No clear trend or pullback detected. Wait for a better setup.`,
  };
}