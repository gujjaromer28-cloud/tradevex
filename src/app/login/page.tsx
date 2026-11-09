"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    // Success! Redirect to dashboard
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#05080f] text-gray-100 flex flex-col">
      {/* Top nav */}
      <nav className="border-b border-[#1a2d4a] bg-[#0a1628]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#d4af37] to-[#b8942a] flex items-center justify-center">
              <span className="text-[#0a1628] font-black text-lg">T</span>
            </div>
            <h1 className="text-lg font-black tracking-tight text-white">
              TRADE<span className="text-[#d4af37]">VEX</span>
            </h1>
          </Link>
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </nav>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white mb-2">
              Welcome Back
            </h2>
            <p className="text-sm text-gray-400">
              Sign in to your TRADEVEX account.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-[#0a1628] border border-[#1a2d4a] rounded-2xl p-8 space-y-4"
          >
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-[#05080f] border border-[#1a2d4a] rounded-md px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
                className="w-full bg-[#05080f] border border-[#1a2d4a] rounded-md px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#d4af37] transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2 text-xs text-red-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#d4af37] hover:bg-[#e0c368] disabled:bg-gray-700 disabled:cursor-not-allowed text-[#0a1628] font-bold py-2.5 rounded-md transition-colors"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>

            <p className="text-xs text-gray-500 text-center pt-2">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-[#d4af37] hover:text-[#e0c368]"
              >
                Sign up free
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}