import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "opsz"],
});

export const metadata: Metadata = {
  title: "LT Lightbourn — AI-powered SaaS in 14 days",
  description:
    "Fixed-price MVP builds for founders. Next.js, Supabase, Stripe, Claude API. Shipped, deployed, live in two weeks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased dark`}
    >
      <body className="min-h-full overflow-x-hidden bg-[#0a0a0a] font-sans text-[#f5f1e8]">
        {children}
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
