"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);

    setTimeout(() => router.push("/dashboard"), 1500);
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
              Start Free
            </h2>
            <p className="text-sm text-gray-400">
              3 free analyses. No credit card required.
            </p>
          </div>

          {success ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-6 text-center">
              <p className="text-emerald-400 font-bold mb-2">
                ✅ Account created!
              </p>
              <p className="text-sm text-gray-400">
                Redirecting to dashboard…
              </p>
            </div>
          ) : (
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
                  placeholder="Min. 6 characters"
                  required
                  minLength={6}
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
                {loading ? "Creating account…" : "Create Free Account"}
              </button>

              <p className="text-xs text-gray-500 text-center pt-2">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-[#d4af37] hover:text-[#e0c368]"
                >
                  Sign in
                </Link>
              </p>
            </form>
          )}

          <p className="text-xs text-gray-600 text-center mt-6">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="text-gray-500 hover:text-white">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-gray-500 hover:text-white">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}