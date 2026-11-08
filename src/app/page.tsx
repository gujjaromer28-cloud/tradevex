import Link from "next/link";

// ═══════════════════════════════════════════════════════════
// TRADEVEX — Landing Page
// See the Setup. Know the Trade.
// ═══════════════════════════════════════════════════════════

export default function Home() {
  return (
    <div className="min-h-screen bg-[#05080f] text-gray-100">
      {/* ─── Top nav ─────────────────────────────────────── */}
      <nav className="border-b border-[#1a2d4a] bg-[#0a1628]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#d4af37] to-[#b8942a] flex items-center justify-center">
              <span className="text-[#0a1628] font-black text-lg">T</span>
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white">
                TRADE<span className="text-[#d4af37]">VEX</span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a href="#features" className="text-gray-400 hover:text-white transition-colors hidden sm:block">
              Features
            </a>
            <a href="#pricing" className="text-gray-400 hover:text-white transition-colors hidden sm:block">
              Pricing
            </a>
            <Link
              href="/login"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-[#d4af37] hover:bg-[#e0c368] text-[#0a1628] font-bold rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628] via-[#05080f] to-[#05080f]" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#d4af37]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1a2d4a] border border-[#2d4260] text-xs text-[#d4af37] font-medium mb-8 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
            AI-Powered Chart Analysis
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-tight mb-6 animate-slide-up">
            See the Setup.
            <br />
            <span className="bg-gradient-to-r from-[#d4af37] via-[#e0c368] to-[#d4af37] bg-clip-text text-transparent">
              Know the Trade.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 animate-slide-up">
            Upload any trading chart screenshot. Get professional AI analysis
            with validated trade setups, entry zones, stop-loss, and
            take-profit levels — in 60 seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
            <Link
              href="/register"
              className="px-8 py-3 bg-[#d4af37] hover:bg-[#e0c368] text-[#0a1628] font-bold rounded-lg text-lg transition-colors animate-pulse-gold"
            >
              Start Free — 3 Analyses
            </Link>
            <a
              href="#features"
              className="px-8 py-3 border border-[#2d4260] hover:border-[#d4af37] text-gray-300 hover:text-white rounded-lg text-lg transition-colors"
            >
              See How It Works
            </a>
          </div>

          <p className="text-xs text-gray-600 mt-6">
            No credit card required · Free tier included
          </p>
        </div>
      </section>

      {/* ─── Supported platforms ─────────────────────────── */}
      <section className="border-y border-[#1a2d4a] bg-[#0a1628]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="text-center text-xs text-gray-500 mb-4 uppercase tracking-widest">
            Works with screenshots from
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-gray-400 font-semibold">
            <span>TradingView</span>
            <span className="text-gray-700">·</span>
            <span>MT4 / MT5</span>
            <span className="text-gray-700">·</span>
            <span>Binance</span>
            <span className="text-gray-700">·</span>
            <span>Bybit</span>
            <span className="text-gray-700">·</span>
            <span>OKX</span>
            <span className="text-gray-700">·</span>
            <span>Any platform</span>
          </div>
        </div>
      </section>

      {/* ─── Features ────────────────────────────────────── */}
      <section id="features" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Professional Analysis.{" "}
              <span className="text-[#d4af37]">Instantly.</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Not a random signal generator. Real chart reading powered by AI
              vision + rule-based validation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: "🎯",
                title: "Validated Setups",
                desc: "Every analysis passes through a rule-based validation engine. No forced trades. If there's no setup, we say so.",
              },
              {
                icon: "🧠",
                title: "AI Vision Reading",
                desc: "Trend, structure, support/resistance, candlestick patterns, liquidity sweeps, BOS, CHOCH, order blocks.",
              },
              {
                icon: "⏱️",
                title: "60-Second Reports",
                desc: "Complete analysis with entry, SL, TP1/2/3, risk-to-reward, and confidence score.",
              },
              {
                icon: "📊",
                title: "Full History",
                desc: "Every analysis saved. Track your performance, review past setups, learn from outcomes.",
              },
              {
                icon: "🔒",
                title: "Honest Reasoning",
                desc: "We explain WHY a setup is valid — including invalidation conditions. No black-box signals.",
              },
              {
                icon: "🌍",
                title: "Any Market",
                desc: "Forex, crypto, gold, indices, stocks. Any chart. Any timeframe. Any platform.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-[#0a1628] border border-[#1a2d4a] hover:border-[#d4af37]/40 rounded-xl p-6 transition-all hover:-translate-y-1"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-white font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it works ────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-[#0a1628]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Three Steps.{" "}
              <span className="text-[#d4af37]">One Trade.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Upload Screenshot",
                desc: "Any chart from any platform. TradingView, MT5, Binance, Bybit — we handle it.",
              },
              {
                step: "02",
                title: "Select Market & Pair",
                desc: "Pick Forex, Crypto, or Stocks. Set your pair and timeframe. That's all we need.",
              },
              {
                step: "03",
                title: "Get Analysis",
                desc: "In 60 seconds, receive a full trade setup — or an honest 'no valid setup' answer.",
              },
            ].map((s) => (
              <div key={s.step} className="relative">
                <div className="text-6xl font-black text-[#d4af37]/20 mb-2">
                  {s.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-gray-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ─────────────────────────────────────── */}
      <section id="pricing" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Simple.{" "}
              <span className="text-[#d4af37]">Honest Pricing.</span>
            </h2>
            <p className="text-gray-400">
              Start free. Upgrade when you're ready.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Free plan */}
            <div className="bg-[#0a1628] border border-[#1a2d4a] rounded-2xl p-8">
              <h3 className="text-xl font-bold text-white mb-2">Free</h3>
              <p className="text-sm text-gray-400 mb-6">
                Try TRADEVEX before you commit.
              </p>
              <div className="mb-6">
                <span className="text-4xl font-black text-white">$0</span>
                <span className="text-gray-400"> / forever</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-[#d4af37]">✓</span> 3 free analyses
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-[#d4af37]">✓</span> Full trade reports
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-[#d4af37]">✓</span> Analysis history
                </li>
              </ul>
              <Link
                href="/register"
                className="block text-center py-3 border border-[#2d4260] hover:border-[#d4af37] text-white rounded-lg transition-colors"
              >
                Start Free
              </Link>
            </div>

            {/* Premium plan */}
            <div className="bg-gradient-to-br from-[#0a1628] to-[#0f1e38] border-2 border-[#d4af37] rounded-2xl p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#d4af37] text-[#0a1628] text-xs font-bold rounded-full">
                MOST POPULAR
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Premium</h3>
              <p className="text-sm text-gray-400 mb-6">
                For active traders who need more.
              </p>
              <div className="mb-6">
                <span className="text-4xl font-black text-white">$29</span>
                <span className="text-gray-400"> / month</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-[#d4af37]">✓</span> Unlimited analyses
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-[#d4af37]">✓</span> Advanced analytics
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-[#d4af37]">✓</span> Priority processing
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-[#d4af37]">✓</span> Saved reports
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="text-[#d4af37]">✓</span> Email support
                </li>
              </ul>
              <Link
                href="/register"
                className="block text-center py-3 bg-[#d4af37] hover:bg-[#e0c368] text-[#0a1628] font-bold rounded-lg transition-colors"
              >
                Upgrade to Premium
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────────── */}
      <section className="py-20 bg-[#0a1628]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Ready to see your setup?
          </h2>
          <p className="text-gray-400 mb-8">
            Start with 3 free analyses. No credit card required.
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-3 bg-[#d4af37] hover:bg-[#e0c368] text-[#0a1628] font-bold rounded-lg text-lg transition-colors animate-pulse-gold"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────── */}
      <footer className="border-t border-[#1a2d4a] py-12 bg-[#05080f]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#d4af37] to-[#b8942a] flex items-center justify-center">
                <span className="text-[#0a1628] font-black text-sm">T</span>
              </div>
              <span className="text-white font-black">
                TRADE<span className="text-[#d4af37]">VEX</span>
              </span>
            </div>
            <div className="flex gap-6 text-sm text-gray-500">
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/disclaimer" className="hover:text-white transition-colors">
                Disclaimer
              </Link>
            </div>
          </div>
          <p className="text-xs text-gray-600 text-center md:text-left mt-8 max-w-2xl">
            ⚠️ Trading involves substantial risk. TRADEVEX provides educational
            chart analysis only. Past performance does not guarantee future
            results. Not financial advice.
          </p>
          <p className="text-xs text-gray-700 text-center md:text-left mt-4">
            © 2026 TRADEVEX. See the Setup. Know the Trade.
          </p>
        </div>
      </footer>
    </div>
  );
}