"use client";

import { useEffect, useState, useRef } from "react";
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

// Helper to compress the image before uploading to make it faster
const compressImage = (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1200;
        const scale = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const newFile = new File([blob], file.name, { type: "image/jpeg", lastModified: Date.now() });
              resolve(newFile);
            } else {
              resolve(file);
            }
          },
          "image/jpeg",
          0.8
        );
      };
    };
  });
};

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [market, setMarket] = useState("Crypto");
  const [pair, setPair] = useState("BTC/USDT");
  const [timeframe, setTimeframe] = useState("1H");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Analysis State
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      setUserEmail(session.user.email || null);
      setLoading(false);
    };
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return alert("Please upload an image first.");
    
    setAnalyzing(true);
    setResult(null);

    try {
      // 1. Get the current session (so we can send the token to the backend)
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not logged in");

      // 2. Compress the image
      const compressedImage = await compressImage(image);

      // 3. Prepare the form data
      const formData = new FormData();
      formData.append("image", compressedImage);
      formData.append("market", market);
      formData.append("pair", pair);
      formData.append("timeframe", timeframe);

      // 4. Send to our API with the Auth token
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
        <div className="mb-8">
          <h2 className="text-3xl font-black text-white mb-2">Dashboard</h2>
          <p className="text-gray-400">Upload a chart to get AI-powered analysis.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Side - Upload Form */}
          <div className="space-y-6">
            <div className="bg-[#0a1628] border border-[#1a2d4a] rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4">1. Chart Details</h3>
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
                  <input type="text" value={pair} onChange={(e) => setPair(e.target.value)} placeholder="e.g. BTC/USDT or EUR/USD" className="w-full bg-[#05080f] border border-[#1a2d4a] rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-[#d4af37]" />
                </div>
              </div>
            </div>

            <div className="bg-[#0a1628] border border-[#1a2d4a] rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4">2. Upload Screenshot</h3>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#2d4260] hover:border-[#d4af37] rounded-xl p-8 text-center cursor-pointer transition-colors"
              >
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
                {preview ? (
                  <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-md" />
                ) : (
                  <>
                    <span className="text-3xl block mb-2">📸</span>
                    <p className="text-sm text-gray-400">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-600 mt-1">PNG, JPG up to 5MB</p>
                  </>
                )}
              </div>
            </div>

            <button 
              onClick={handleAnalyze} 
              disabled={analyzing || !image}
              className="w-full py-3 bg-[#d4af37] hover:bg-[#e0c368] disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed text-[#0a1628] font-bold rounded-lg transition-colors flex justify-center items-center gap-2"
            >
              {analyzing ? (
                <><span className="w-4 h-4 border-2 border-[#0a1628] border-t-transparent rounded-full animate-spin"></span> Analyzing Chart…</>
              ) : (
                "Analyze with AI"
              )}
            </button>
          </div>

          {/* Right Side - AI Result */}
          <div className="bg-[#0a1628] border border-[#1a2d4a] rounded-2xl p-6 h-full min-h-[400px]">
            <h3 className="text-white font-bold mb-4 border-b border-[#1a2d4a] pb-4">AI Analysis</h3>
            
            {!result && !analyzing && (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <span className="text-4xl mb-4 opacity-20">🤖</span>
                <p className="text-sm">Upload a chart to see the AI setup.</p>
              </div>
            )}

            {analyzing && (
              <div className="flex flex-col items-center justify-center h-64 text-[#d4af37]">
                <span className="w-8 h-8 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin mb-4"></span>
                <p className="text-sm animate-pulse">Scanning structure, liquidity, and trend…</p>
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
    </div>
  );
}