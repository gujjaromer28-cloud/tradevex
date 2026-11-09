"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the user is actually logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        // If no session, kick them back to the login page
        router.push("/login");
        return;
      }

      // Set their email
      setUserEmail(session.user.email || null);
      setLoading(false);
    };

    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/"); // Send back to homepage after logout
  };

  // Show a loading screen while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-[#05080f] flex items-center justify-center">
        <div className="text-[#d4af37] text-sm animate-pulse">
          Verifying secure session…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05080f] text-gray-100">
      {/* Top Navbar */}
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
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 border border-[#2d4260] hover:border-[#d4af37] text-gray-300 hover:text-white rounded-md transition-colors"
            >
              Log out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 py-12">
        <div className="mb-10">
          <h2 className="text-3xl font-black text-white mb-2">Dashboard</h2>
          <p className="text-gray-400">
            Welcome back. Ready to analyze a chart?
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#0a1628] border border-[#1a2d4a] rounded-xl p-6">
            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">
              Free Analyses Remaining
            </p>
            <p className="text-3xl font-black text-[#d4af37]">3</p>
          </div>
          <div className="bg-[#0a1628] border border-[#1a2d4a] rounded-xl p-6">
            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">
              Total Analyses Used
            </p>
            <p className="text-3xl font-black text-white">0</p>
          </div>
          <div className="bg-[#0a1628] border border-[#1a2d4a] rounded-xl p-6">
            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider">
              Current Plan
            </p>
            <p className="text-xl font-bold text-gray-300 mt-1">Free Tier</p>
          </div>
        </div>

        {/* The Main Feature */}
        <div className="bg-[#0a1628] border border-[#1a2d4a] rounded-2xl p-8 text-center border-dashed">
          <div className="w-16 h-16 rounded-full bg-[#1a2d4a] flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📸</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            AI Chart Analyser
          </h3>
          <p className="text-sm text-gray-400 max-w-md mx-auto mb-6">
            Upload a screenshot from TradingView, MT4, or Binance. Our AI will
            analyze the structure, liquidity, and patterns.
          </p>
          <button className="px-6 py-3 bg-[#d4af37] hover:bg-[#e0c368] text-[#0a1628] font-bold rounded-lg transition-colors opacity-50 cursor-not-allowed">
            Upload Chart (Coming Next)
          </button>
        </div>
      </main>
    </div>
  );
}