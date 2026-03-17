import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import Link from 'next/link';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HiddenMRR | Find the $1,000/mo SaaS Hiding in Your GitHub',
  description: 'Stop starting new projects. Connect your GitHub, let AI appraise your abandoned code, and get a step-by-step blueprint to launch your most profitable repo this weekend.',
  alternates: {
    canonical: 'https://www.hiddenmrr.com',
  },
  openGraph: {
    title: 'HiddenMRR | Find the $1,000/mo SaaS Hiding in Your GitHub',
    description: 'Stop starting new projects. Connect your GitHub, let AI appraise your abandoned code, and get a step-by-step blueprint to launch your most profitable repo this weekend.',
    images: [{ url: '/og-image.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HiddenMRR | Find the $1,000/mo SaaS Hiding in Your GitHub',
    description: 'Stop starting new projects. Connect your GitHub, let AI appraise your abandoned code, and get a step-by-step blueprint to launch your most profitable repo this weekend.',
    images: ['/og-image.jpg'],
  },
};

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "HiddenMRR",
    "url": "https://www.hiddenmrr.com",
    "description": "AI-powered platform that scans abandoned GitHub repositories and identifies high-margin B2B SaaS opportunities.",
    "sameAs": ["https://twitter.com/HiddenMRR"],
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className={`${inter.variable} bg-background text-foreground antialiased min-h-screen flex flex-col font-sans`}>
        <Providers>
          {/* ── Navbar ─────────────────────────────────────── */}
          <header className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-xl">
            <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
              {/* Left: logo + wordmark */}
              <Link href="/" className="flex items-center gap-2.5">
                <span className="text-white font-black text-lg tracking-tighter">
                  HiddenMRR
                </span>
              </Link>

              {/* Right: Auth buttons */}
              {session ? (
                <Link
                  href="/dashboard"
                  className="rounded-lg border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary
                             hover:bg-primary/20 transition-all duration-150"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/api/auth/signin"
                  className="rounded-lg border border-white/15 bg-white/[0.04] px-4 py-1.5 text-sm font-medium text-white
                             hover:bg-white/[0.08] hover:border-white/25 transition-all duration-150"
                >
                  Login
                </Link>
              )}
            </div>
          </header>

          {/* ── Page content (offset for fixed navbar) ───── */}
          <div className="flex flex-col flex-1 pt-16">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
