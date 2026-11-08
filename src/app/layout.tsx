import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TRADEVEX — See the Setup. Know the Trade.",
  description:
    "AI-powered chart analysis. Upload any trading chart screenshot and get professional trade setups with validation, entry, stop-loss, and take-profit levels.",
  keywords: [
    "AI trading",
    "chart analysis",
    "trading signals",
    "forex",
    "crypto",
    "technical analysis",
  ],
  openGraph: {
    title: "TRADEVEX — See the Setup. Know the Trade.",
    description:
      "AI-powered chart analysis for traders. Upload a screenshot, get a validated setup in 60 seconds.",
    siteName: "TRADEVEX",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}