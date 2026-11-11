"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type AnalysisResult = {
  status: "VALID" | "NO_SETUP" | "INVALID";
  direction: "BUY" | "SELL" | "NONE";
  entry?: number;
  stopLoss?: number;
  takeProfit?: number;
  confidence?: number;
  reasoning?: string;
  error?: string;
};

const CRYPTO_PAIRS = [
  "BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "XRPUSDT",
  "ADAUSDT", "DOGEUSDT", "AVAXUSDT", "DOTUSDT", "LINKUSDT",
  "MATICUSDT", "LTCUSDT", "TRXUSDT", "ATOMUSDT", "ETCUSDT",
  "XLMUSDT", "BCHUSDT", "FILUSDT", "APTUSDT", "ARBUSDT"
];

const FOREX_PAIRS = [
  "EURUSDT", "GBPUSDT", "AUDUSDT", "USDTTRY", "USDTBRL"
];

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [market, setMarket] = useState("Crypto");
  const [pair, setPair] = useState("BTCUSDT");
  const [timeframe, setTimeframe] = useState("1H");

  // Analysis State
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  
  // Free Limit State
  const [analysesLeft, setAnalysesLeft] = useState(3);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      setUserEmail(session.user.email || null);
      
      // Check local storage for usage limits
      const used = parseInt(localStorage.getItem("tv_free_analyses_used") || "0", 10);
      setAnalysesLeft(Math.max(0, 3 - used));
      
      setLoading(false);
    };
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleAnalyze = async () => {
    if (analysesLeft <= 0) {
      setShowUpgradeModal(true);
      return;
    }

    if (!pair) return alert("Please select a pair.");
    
    setAnalyzing(true);
    setResult(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not logged in");

      const formData = new FormData();
      formData.append("market", market);
      formData.append("pair", pair);
      formData.append("timeframe", timeframe);

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: formData,
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      
      setResult(data);

      // Decrease limit
      const used = parseInt(localStorage.getItem("tv_free_analyses_used") || "0", 10);
      const newUsed = used + 1;
      localStorage.setItem("tv_free_analyses_used", newUsed.toString());
      setAnalysesLeft(Math.max(0, 3 - newUsed));

    } catch (err) {
      setResult({ 
        status: "INVALID", 
        direction: "NONE", 
        error: String(err) 
      });
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05080f] flex items-center justify-center">
        <div className="text-[#d4af37] text-sm animate-pulse">Verifying session…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05080f] text-gray-100">
      {/* Navbar */}
      <nav className="border-b border-[#1a2d4a] bg-[#0a1628] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d4af37] to-[#b8942a] flex items-center justify-center">
              <span className="text-[#0a1628] font-black text-sm">T</span>
            </div>
            <h1 className="text-lg font-black tracking-tight text-white">
              TRADE<span className="text-[#d4af37]">VEX</span>
            </h1>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-400 hidden sm:block">{userEmail}</span>
            <button onClick={handleLogout} className="px-3 py-1.5 border border-[#2d4260] hover:border-[#d4af37] text-gray-300 hover:text-white rounded-md transition-colors">
              Log out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto p-6 py-12">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black text-white mb-2">Dashboard</h2>
            <p className="text-gray-400">Select a market to get AI-powered analysis.</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Free Analyses Left</p>
            <p className={`text-2xl font-black ${analysesLeft > 0 ? 'text-[#d4af37]' : 'text-red-400'}`}>
              {analysesLeft} / 3
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Side - Form */}
          <div className="space-y-6">
            <div className="bg-[#0a1628] border border-[#1a2d4a] rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4">Chart Details</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Market</label>
                    <select value={market} onChange={(e) => setMarket(e.target.value)} className="w-full bg-[#05080f] border border-[#1a2d4a] rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-[#d4af37]">
                      <option>Crypto</option>
                      <option>Forex</option>
                      <option>Stocks</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Timeframe</label>
                    <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)} className="w-full bg-[#05080f] border border-[#1a2d4a] rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-[#d4af37]">
                      <option>1M</option>
                      <option>5M</option>
                      <option>15M</option>
                      <option>1H</option>
                      <option>4H</option>
                      <option>1D</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Pair</label>
                  <select value={pair} onChange={(e) => setPair(e.target.value)} className="w-full bg-[#05080f] border border-[#1a2d4a] rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-[#d4af37]">
                    <optgroup label="Crypto">
                      {CRYPTO_PAIRS.map(p => <option key={p} value={p}>{p}</option>)}
                    </optgroup>
                    <optgroup label="Forex (via Binance)">
                      {FOREX_PAIRS.map(p => <option key={p} value={p}>{p}</option>)}
                    </optgroup>
                  </select>
                </div>
              </div>
            </div>

            <button 
              onClick={handleAnalyze} 
              disabled={analyzing || !pair}
              className="w-full py-3 bg-[#d4af37] hover:bg-[#e0c368] disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed text-[#0a1628] font-bold rounded-lg transition-colors flex justify-center items-center gap-2"
            >
              {analyzing ? (
                <><span className="w-4 h-4 border-2 border-[#0a1628] border-t-transparent rounded-full animate-spin"></span> Analyzing Market Data…</>
              ) : (
                "Run Analysis"
              )}
            </button>
          </div>

          {/* Right Side - Result */}
          <div className="bg-[#0a1628] border border-[#1a2d4a] rounded-2xl p-6 h-full min-h-[400px]">
            <h3 className="text-white font-bold mb-4 border-b border-[#1a2d4a] pb-4">Analysis Result</h3>
            
            {!result && !analyzing && (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <span className="text-4xl mb-4 opacity-20">📊</span>
                <p className="text-sm">Select a pair to run the engine.</p>
              </div>
            )}

            {analyzing && (
              <div className="flex flex-col items-center justify-center h-64 text-[#d4af37]">
                <span className="w-8 h-8 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin mb-4"></span>
                <p className="text-sm animate-pulse">Fetching live data and calculating...</p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                {result.error ? (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-sm text-red-400">
                    {result.error}
                  </div>
                ) : result.status === "INVALID" || result.status === "NO_SETUP" ? (
                  <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 text-center">
                    <p className="text-amber-400 font-bold mb-2">{result.status.replace("_", " ")}</p>
                    <p className="text-sm text-gray-400">{result.reasoning}</p>
                  </div>
                ) : (
                  <>
                    <div className={`p-4 rounded-lg border ${result.direction === 'BUY' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                      <div className="flex justify-between items-center">
                        <span className={`text-xl font-black ${result.direction === 'BUY' ? 'text-emerald-400' : 'text-red-400'}`}>{result.direction}</span>
                        <span className="text-xs text-gray-400">Confidence: {result.confidence}%</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-sm">
                      <div className="bg-[#05080f] p-3 rounded border border-[#1a2d4a]">
                        <p className="text-xs text-gray-500 mb-1">Entry</p>
                        <p className="font-mono text-white">{result.entry}</p>
                      </div>
                      <div className="bg-[#05080f] p-3 rounded border border-[#1a2d4a]">
                        <p className="text-xs text-gray-500 mb-1">Stop Loss</p>
                        <p className="font-mono text-red-400">{result.stopLoss}</p>
                      </div>
                      <div className="bg-[#05080f] p-3 rounded border border-[#1a2d4a]">
                        <p className="text-xs text-gray-500 mb-1">Take Profit</p>
                        <p className="font-mono text-emerald-400">{result.takeProfit}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">Reasoning</p>
                      <p className="text-sm text-gray-300 leading-relaxed bg-[#05080f] p-3 rounded border border-[#1a2d4a]">{result.reasoning}</p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#0a1628] border border-[#d4af37] rounded-2xl p-8 max-w-md w-full text-center relative">
            <button onClick={() => setShowUpgradeModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">✕</button>
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-2xl font-black text-white mb-2">Upgrade to Premium</h3>
            <p className="text-sm text-gray-400 mb-6">
              You've used all 3 of your free analyses. Upgrade to Premium to get unlimited AI market analysis.
            </p>
            <button className="w-full py-3 bg-[#d4af37] hover:bg-[#e0c368] text-[#0a1628] font-bold rounded-lg mb-3 transition-colors">
              Upgrade for $29/month
            </button>
            <button onClick={() => setShowUpgradeModal(false)} className="text-xs text-gray-500 hover:text-white">
              Maybe later
            </button>
          </div>
        </div>
      )}
    </div>
  );
}