"use client";

import { LoginButton } from "@/components/AuthButtons";
import { Lock, ShieldCheck, Zap, Code, Target, Sparkles, ChevronDown, CheckCircle2, Shield, EyeOff, Search, TrendingUp, AlertCircle, Scissors, Rocket, Trophy, DollarSign, Clock, Timer } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/5 py-6 font-sans">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left group"
      >
        <span className="text-lg font-semibold text-zinc-100 group-hover:text-primary transition-colors">{question}</span>
        <ChevronDown className={`w-5 h-5 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-zinc-400 leading-relaxed"
        >
          {answer}
        </motion.div>
      )}
    </div>
  );
}

// Countdown: 2 weeks from March 17, 2026. After expiry, just hide the countdown.
const PROMO_END = new Date("2026-03-31T23:59:59Z").getTime();

function useCountdown() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, PROMO_END - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds, expired: diff === 0 };
}

export default function Home() {
  const [progress, setProgress] = useState(0);
  const [isFound, setIsFound] = useState(false);
  const countdown = useCountdown();

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev < 30) return prev + 2.5; 
        if (prev < 75) return prev + 1.2; 
        if (prev < 99.5) return prev + 0.3; // Slower at the end for tension
        return 100;
      });
    }, 40);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => setIsFound(true), 150);
      return () => clearTimeout(timeout);
    }
  }, [progress]);

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "HiddenMRR | Find the $1,000/mo SaaS Hiding in Your GitHub",
      "url": "https://www.hiddenmrr.com",
      "description": "Stop starting new projects. Connect your GitHub, let AI appraise your abandoned code, and get a step-by-step blueprint to launch your most profitable repo this weekend.",
      "publisher": {
        "@type": "Organization",
        "name": "HiddenMRR",
        "url": "https://www.hiddenmrr.com",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is the free scan actually free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, 100% free. No API key, no credit card. Connect GitHub, pick a repo, get a full Market Readiness Plan. We cover the AI cost for your first scan.",
          },
        },
        {
          "@type": "Question",
          "name": "What repositories can you analyze?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "If it's on GitHub, we can scan it. Private or public. We focus on Node.js/Python/Next.js/React projects as they have the clearest SaaS monetization paths.",
          },
        },
        {
          "@type": "Question",
          "name": "Do I need an API key?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Not for the free scan. For paid scans, you can optionally bring your own API key (BYOK) from OpenAI, Anthropic, or Google to choose your preferred AI model.",
          },
        },
        {
          "@type": "Question",
          "name": "Is my code safe?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We use the official GitHub OAuth flow. We do not clone repos. We only read the file structure, README, and package.json to understand context.",
          },
        },
        {
          "@type": "Question",
          "name": "What does the analysis report include?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You receive a winner selection (the repo with the highest revenue potential), a Completeness Score, a Brutal Truth AI verdict, a 3-phase Weekend Launch Blueprint, a list of high-potential runner-up projects, and a ranked Graveyard Leaderboard covering every repo you scanned.",
          },
        },
        {
          "@type": "Question",
          "name": "How long does an analysis take?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Usually 2–5 minutes depending on the number of repos selected and the AI model you choose. GPT-4o Mini and Gemini Flash are the fastest options. You can scan up to 20 repositories per run.",
          },
        },
      ],
    },
  ];

  return (
    <main className="flex-1 flex flex-col items-center bg-zinc-950 selection:bg-primary/30 selection:text-white font-sans overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* ── Launch Promo Banner ──────────────────────── */}
      <div className="w-full bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 border-b border-primary/20">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-center gap-3 text-sm flex-wrap">
          <span className="px-2 py-0.5 rounded-full bg-primary text-black text-[10px] font-black uppercase tracking-widest">Launch Deal</span>
          <span className="text-zinc-300 font-medium">
            Pro: <span className="text-white font-black">€19</span> <span className="line-through text-zinc-500">€29</span>
          </span>
          <span className="text-zinc-600">·</span>
          <span className="text-zinc-300 font-medium">
            First 10 users: <span className="font-mono text-primary font-black">FIRST10</span> for 50% off
          </span>
          {!countdown.expired && (
            <>
              <span className="text-zinc-600">·</span>
              <span className="inline-flex items-center gap-1.5 text-zinc-300 font-medium">
                <Timer className="w-3.5 h-3.5 text-primary" />
                <span className="font-mono text-white font-black tabular-nums">
                  {countdown.days}d {String(countdown.hours).padStart(2, '0')}h {String(countdown.minutes).padStart(2, '0')}m {String(countdown.seconds).padStart(2, '0')}s
                </span>
                <span className="text-zinc-400 text-xs">left</span>
              </span>
            </>
          )}
        </div>
      </div>

      {/* ── Hero (Split Layout) ───────────────────────── */}
      <section className="relative w-full max-w-6xl px-6 py-12 sm:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
        {/* Glow behind hero */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none opacity-40" />
        
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="z-10 space-y-8"
        >
          <div className="inline-flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-tighter">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Revenue Discovery</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.05]">
            Turn your ghost <br/>repos into <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent italic px-1">
              Real MRR.
            </span>
          </h1>

          <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
            You already wrote the code. <span className="text-white font-black tracking-tighter italic">HiddenMRR</span> tells you which repo to ship,
            who will pay for it, and exactly how to get your first customer this weekend.
          </p>

          <div className="flex flex-col items-start gap-6">
            <LoginButton />

            {/* Trust pill */}
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-xl px-4 py-2 text-[10px] text-zinc-500 font-bold tracking-widest uppercase">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span>Free scan · No API key</span>
              <span className="text-zinc-800 mx-1">|</span>
              <span>30 seconds to results</span>
            </div>
          </div>
        </motion.div>

        {/* Visual Mock/Preview (Simulation) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative rounded-[2.5rem] bg-zinc-900 border border-white/5 p-8 overflow-hidden group shadow-2xl"
        >
          {/* Flash Effect on Discovery */}
          <AnimatePresence>
            {isFound && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-br from-primary/30 via-white/10 to-transparent"
              />
            )}
          </AnimatePresence>

          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingUp className="w-40 h-40 text-primary" />
          </div>

          <div className="space-y-8 relative z-10">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
                      <Code className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">Repo Scanned</p>
                      <p className="text-primary/70 text-[10px] font-mono tracking-tight">/ghost-auth-v2</p>
                    </div>
                </div>
                {isFound && (
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5"
                  >
                    <Target className="w-3 h-3" />
                    Found Idea
                  </motion.div>
                )}
             </div>
             
             <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                   <span>Scanning Logic...</span>
                   <span>{Math.floor(progress)}%</span>
                </div>
                <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-white/5 p-0.5">
                    <motion.div 
                      className="h-full bg-primary rounded-full relative"
                      initial={{ width: "0%" }}
                      animate={{ width: `${progress}%` }}
                      transition={{ ease: "easeOut" }}
                    >
                      <div className="absolute top-0 right-0 bottom-0 w-24 bg-gradient-to-r from-transparent to-white/30" />
                    </motion.div>
                </div>
             </div>

             <div className="pt-6 border-t border-white/5 min-h-[80px] flex items-center">
                <AnimatePresence mode="wait">
                  {!isFound ? (
                    <motion.p 
                      key="scanning"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-zinc-500 font-medium italic leading-relaxed"
                    >
                      "Extracting business intent from legacy imports. Cross-referencing 
                       market demand for niche auth middleware..."
                    </motion.p>
                  ) : (
                    <motion.div 
                      key="found"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-2 p-4 rounded-2xl bg-primary/10 border border-primary/20 shadow-[0_0_30px_-10px_rgba(153,102,255,0.4)]"
                    >
                      <p className="text-white font-black text-sm tracking-tight">
                        <span className="text-primary">$1,000/mo SaaS Idea Found!</span>
                      </p>
                      <p className="text-zinc-400 text-[10px] leading-tight font-medium">
                        Your abandoned auth logic is perfect for a <b>High-Compliance SaaS Proxy.</b> Potential valuation: <span className="text-white">$45k</span>.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>
          </div>
        </motion.div>
      </section>

      {/* ── How It Works ──────────────────────────────── */}
      <section className="w-full max-w-6xl px-6 py-24 sm:py-32">
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tighter text-white mb-6">The 3-Step Blueprint</h2>
          <p className="text-zinc-500 text-lg sm:text-xl max-w-xl mx-auto">From forgotten repo to revenue-ready product in 15 minutes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-12 left-24 right-24 h-px bg-white/5" />
          
          {[
            { step: "01", title: "Connect GitHub", desc: "Select the repositories you've abandoned. Our AI scans private and public repos safely.", icon: Code },
            { step: "02", title: "AI Appraisal", desc: "GPT-4o audits your code, assesses market demand, and identifies high-margin niches.", icon: Sparkles },
            { step: "03", title: "Weekend Plan", desc: "Get a brutal reality check and a tactical 48-hour plan to acquire your first customer.", icon: Target },
          ].map((item, i) => (
            <div key={i} className="relative group">
              <div className="w-24 h-24 rounded-3xl bg-zinc-900 border border-white/10 flex items-center justify-center mb-8 mx-auto relative z-10 
                              group-hover:border-primary/50 group-hover:shadow-[0_0_30px_-10px_rgba(153,102,255,0.4)] transition-all duration-500">
                <item.icon className="w-10 h-10 text-zinc-100 group-hover:text-primary transition-colors" />
              </div>
              <div className="text-center">
                <span className="text-primary font-black text-sm tracking-widest uppercase mb-2 block">{item.step}</span>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-zinc-500 leading-relaxed text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Social Proof ────────────────────────────── */}
      <section className="w-full max-w-5xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { quote: "Found a $1.5k/mo idea in a 2022 repo I completely forgot about. The GTM roadmap alone was worth it.", author: "Solo dev, 47 repos scanned", highlight: "$1.5k/mo idea" },
            { quote: "Ran the free scan skeptically. It identified my auth middleware as a compliance SaaS. Now I'm building it.", author: "Indie hacker, YC S23 alum", highlight: "compliance SaaS" },
            { quote: "I was about to start ANOTHER new project. HiddenMRR showed me I already had 80% of a product built.", author: "Full-stack dev, 3 years of ghost repos", highlight: "80% of a product" },
          ].map((t, i) => (
            <div key={i} className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 space-y-4">
              <p className="text-sm text-zinc-300 leading-relaxed italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{t.author}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-8 mt-10 text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em]">
          <span>Featured on Hacker News</span>
          <span className="text-zinc-800">|</span>
          <span>Discussed on r/SaaS</span>
          <span className="text-zinc-800">|</span>
          <span>r/microsaas</span>
        </div>
      </section>

      {/* ── Example Results Preview ──────────────────── */}
      <section className="w-full max-w-5xl px-6 py-24 sm:py-32">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-tighter mb-6">
            <Target className="w-4 h-4" />
            <span>Real Output Preview</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tighter text-white mb-4">See What You Get</h2>
          <p className="text-zinc-500 text-lg max-w-xl mx-auto">Not a mockup — this is real AI output. Your free scan delivers all of this.</p>
        </div>

        <div className="space-y-6">
          {/* Winner Card Preview */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-4 rounded-[2rem] border border-white/[0.08] bg-zinc-950 p-8 flex flex-col justify-between min-h-[240px]">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-white/[0.03] border border-white/10 shrink-0">
                    <Code className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-600">Primary Candidate</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-black tracking-tighter text-white mb-3">invoice-parser-cli</h3>
                <p className="text-zinc-500 text-base font-medium">Fastest path to revenue in your current portfolio.</p>
              </div>
              <div className="flex flex-wrap gap-3 mt-6">
                <span className="inline-flex items-center gap-2 text-xs font-bold rounded-xl border border-white/10 bg-white/[0.02] px-3 py-1.5 text-zinc-400">
                  <Target className="w-3 h-3 text-primary" />
                  Small Accounting Firms (1-10 employees)
                </span>
                <span className="inline-flex items-center gap-2 text-xs font-bold rounded-xl border border-white/10 bg-white/[0.02] px-3 py-1.5 text-zinc-400">
                  <DollarSign className="w-3 h-3 text-emerald-500" />
                  Usage-based SaaS ($49-199/mo)
                </span>
              </div>
            </div>

            <div className="md:col-span-2 rounded-[2rem] border border-white/[0.08] bg-zinc-950 p-8 flex flex-col items-center justify-center gap-3 text-center">
              <div className="relative inline-flex items-center justify-center">
                <svg width="130" height="130" viewBox="0 0 160 160" className="-rotate-90">
                  <circle cx="80" cy="80" r="58" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="10" />
                  <circle cx="80" cy="80" r="58" fill="none" className="stroke-amber-400" strokeWidth="10"
                    strokeDasharray={`${2 * Math.PI * 58}`} strokeDashoffset={`${2 * Math.PI * 58 - (62 / 100) * 2 * Math.PI * 58}`}
                    strokeLinecap="round" style={{ filter: "drop-shadow(0 0 12px currentColor)" }} />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-5xl font-black text-white leading-none tracking-tighter">62</span>
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1">Score</span>
                </div>
              </div>
              <p className="text-white font-bold text-sm tracking-tight">Strong Foundation</p>
            </div>
          </div>

          {/* Brutal Truth Preview */}
          <div className="rounded-[2rem] border border-white/[0.05] bg-white/[0.02] p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Zap className="w-24 h-24 text-primary -rotate-12" />
            </div>
            <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              The Brutal Truth
            </h4>
            <p className="text-lg sm:text-xl text-zinc-300 leading-tight font-medium italic relative z-10 max-w-3xl">
              &ldquo;You built 80% of a product that accountants would kill for, then pivoted to yet another todo app. The OCR pipeline alone is worth $2k MRR if you slap a Stripe checkout on it.&rdquo;
            </p>
          </div>

          {/* Market Readiness Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Must Fix */}
            <div className="rounded-[2rem] border border-red-500/10 bg-zinc-950 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 shrink-0">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white tracking-tight">Must Fix First</h4>
                  <p className="text-[9px] font-black text-red-400/60 uppercase tracking-[0.2em]">Critical blockers</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { item: "Add Stripe billing", effort: "days" },
                  { item: "Deploy to production", effort: "hours" },
                  { item: "Add user authentication", effort: "days" },
                ].map((fix, i) => (
                  <div key={i} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05] flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-300">{fix.item}</span>
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border
                      ${fix.effort === 'hours' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                      <Clock className="w-2.5 h-2.5" />{fix.effort}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cut From MVP */}
            <div className="rounded-[2rem] border border-amber-500/10 bg-zinc-950 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 shrink-0">
                  <Scissors className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white tracking-tight">Cut From MVP</h4>
                  <p className="text-[9px] font-black text-amber-400/60 uppercase tracking-[0.2em]">Skip these — ship faster</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  "Multi-language OCR support",
                  "Team collaboration features",
                  "Custom PDF template builder",
                ].map((feature, i) => (
                  <div key={i} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05] flex items-center gap-2">
                    <Scissors className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="text-xs font-bold text-zinc-400 line-through decoration-amber-500/40">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Go-To-Market Preview (first 3 steps) */}
          <div className="rounded-[2.5rem] border border-white/[0.08] bg-zinc-950 p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-xl font-bold text-white tracking-tighter flex items-center gap-3">
                <Rocket className="w-6 h-6 text-primary" />
                Go-To-Market Roadmap
              </h4>
              <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[9px] font-black uppercase tracking-[0.2em] text-primary">
                Code → First Customer
              </div>
            </div>

            <div className="relative space-y-0">
              <div className="absolute left-[15px] top-4 bottom-4 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent hidden sm:block" />
              {[
                { step: "01", title: "Deploy MVP on Vercel", detail: "Strip the CLI interface, wrap it in a Next.js API route with file upload. Deploy to Vercel with a custom domain.", milestone: "Live URL accepting invoice uploads" },
                { step: "02", title: "Add Stripe Checkout", detail: "Implement usage-based pricing: $0.10/invoice processed. Free tier: 10 invoices/month to hook users.", milestone: "First test payment received" },
                { step: "03", title: "Launch on Indie Hackers + HN", detail: "Post a Show HN with a demo video. Cross-post to r/smallbusiness and accounting Twitter.", milestone: "50 signups in first week" },
              ].map((gtm, i) => (
                <div key={i} className="relative flex gap-5 group">
                  <div className="shrink-0 relative z-10">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-[10px] font-black text-white shadow-xl">
                      {gtm.step}
                    </div>
                  </div>
                  <div className="pb-6 flex-1 space-y-2">
                    <h5 className="text-base font-bold text-white tracking-tight">{gtm.title}</h5>
                    <p className="text-xs text-zinc-400 leading-relaxed">{gtm.detail}</p>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400/70">
                      <Trophy className="w-3 h-3" />
                      <span>{gtm.milestone}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Blur fade + CTA */}
            <div className="relative -mt-4">
              <div className="h-20 bg-gradient-to-t from-zinc-950 to-transparent" />
              <div className="text-center -mt-6">
                <p className="text-xs text-zinc-500 font-bold mb-4">+ 4 more steps in the full report</p>
                <LoginButton />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Bento ────────────────────────────── */}
      <section className="w-full max-w-6xl px-6 py-24 sm:py-32 bg-white/[0.01] rounded-[3rem] border border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-4 rounded-[2.5rem] bg-zinc-900/50 border border-white/5 p-10 flex flex-col justify-between group overflow-hidden relative">
            <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
              <Zap className="w-64 h-64 text-primary" />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
                Market Logic
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tighter mb-4 leading-tight">Ruthless Market <br/> Appraisal Engine.</h3>
              <p className="text-zinc-500 text-lg max-w-md">Our AI doesn't just look for bugs. It looks for money. It identifies B2B pain points buried in your logic.</p>
            </div>
            <div className="mt-12 flex gap-4">
               <div className="px-4 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs font-bold text-zinc-300">Niche Score</div>
               <div className="px-4 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs font-bold text-zinc-300">GTM Strategy</div>
            </div>
          </div>

          <div className="md:col-span-2 rounded-[2.5rem] bg-zinc-900 border border-white/10 p-10 flex flex-col items-center justify-center text-center group">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform">
              <ShieldCheck2 className="w-8 h-8 text-primary" />
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Verified Stack</h4>
            <p className="text-zinc-500 text-sm">We assess tech readiness so you know if it's a 2-hour or 20-hour launch.</p>
          </div>

          <div className="md:col-span-3 rounded-[2.5rem] bg-zinc-900/50 border border-white/5 p-10 flex flex-col justify-center gap-6 group">
             <div className="flex items-center gap-4">
                <Search className="w-6 h-6 text-primary" />
                <h4 className="text-xl font-bold text-white">Deep Context Scanning</h4>
             </div>
             <p className="text-zinc-500 text-sm leading-relaxed">We read your <code>README.md</code> and <code>package.json</code> to understand the objective you forgot about six months ago.</p>
          </div>

          <div className="md:col-span-3 rounded-[2.5rem] bg-zinc-900/50 border border-white/5 p-10 flex flex-col justify-center gap-6 group relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="flex items-center gap-4 relative z-10">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                <h4 className="text-xl font-bold text-white">48-Hour Execution</h4>
             </div>
             <p className="text-zinc-500 text-sm leading-relaxed relative z-10">Forget perfection. Our AI gives you the minimum technical steps required to ship a paid beta by Sunday.</p>
          </div>
        </div>
      </section>

      {/* ── Privacy section ───────────────────────────── */}
      <section className="w-full max-w-4xl px-6 py-24 sm:py-32 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 mb-8">
           <Shield className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-3xl font-bold text-white tracking-tight mb-4">Your Code is Yours. Period.</h2>
        <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl mx-auto mb-12">
          <span className="text-white font-black tracking-tighter italic">HiddenMRR</span> is built for indie hackers who value their IP. We never store your code —
          we only read metadata via secure GitHub API calls. Your free scan runs on our servers;
          paid scans can optionally use your own API key for full control.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-center">
          <div className="space-y-2">
            <EyeOff className="w-5 h-5 text-zinc-600 mx-auto" />
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">No Storage</p>
          </div>
          <div className="space-y-2">
            <Lock className="w-5 h-5 text-zinc-600 mx-auto" />
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Encrypted Keys</p>
          </div>
          <div className="col-span-2 sm:col-span-1 space-y-2">
            <ShieldCheck className="w-5 h-5 text-zinc-600 mx-auto" />
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">OAuth Secured</p>
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────── */}
      <section className="w-full max-w-4xl px-6 py-24 sm:py-32 text-center">
        <div className="inline-flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-tighter mb-6">
          <Sparkles className="w-4 h-4" />
          <span>Simple Pricing</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tighter text-white mb-4">
          Free scan. No API key needed.
        </h2>
        <p className="text-zinc-500 text-lg mb-6 max-w-md mx-auto">
          See if your code has hidden revenue. Then decide.
        </p>
        <p className="text-xs text-zinc-400 mb-16 max-w-lg mx-auto leading-relaxed">
          Most users find 1-2 viable ideas worth €500–€5k+ MRR if revived. One good revival pays for HiddenMRR 100x over.
        </p>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free tier */}
          <div className="relative rounded-[2.5rem] border border-white/10 bg-zinc-900/40 p-8 text-left">
            <div className="relative z-10">
              <div className="flex items-end gap-3 mb-1">
                <span className="text-5xl font-black text-white tracking-tighter">Free</span>
              </div>
              <p className="text-zinc-600 text-sm mb-8">No API key. No credit card.</p>

              <ul className="space-y-3 mb-8">
                {[
                  'Analyze 1 repository',
                  'Full Market Readiness Plan',
                  'Completeness score + niche ID',
                  'Go-to-market roadmap',
                  'Brutal Truth verdict',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-zinc-400">
                    <CheckCircle2 className="w-4 h-4 text-zinc-600 shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="flex justify-center">
                <LoginButton />
              </div>

              <p className="text-center text-zinc-700 text-[10px] font-black uppercase tracking-widest mt-5">
                Just connect GitHub · 30 seconds
              </p>
            </div>
          </div>

          {/* Pro tier */}
          <div className="relative rounded-[2.5rem] border border-primary/25 bg-zinc-900/60 p-8 text-left shadow-[0_0_80px_-20px_rgba(153,102,255,0.25)]">
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
            <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-primary text-black text-[9px] font-black uppercase tracking-widest z-20">
              {!countdown.expired ? (
                <span className="inline-flex items-center gap-1.5">
                  <Timer className="w-3 h-3" />
                  {countdown.days}d {String(countdown.hours).padStart(2, '0')}:{String(countdown.minutes).padStart(2, '0')}:{String(countdown.seconds).padStart(2, '0')} left
                </span>
              ) : "Launch Price"}
            </div>
            <div className="relative z-10">
              <div className="flex items-end gap-3 mb-1">
                <span className="text-5xl font-black text-white tracking-tighter">€19</span>
                <span className="text-zinc-500 text-sm font-medium pb-2">lifetime</span>
                <span className="text-zinc-700 text-sm line-through pb-2">€29</span>
              </div>
              <p className="text-zinc-600 text-sm mb-8">Unlimited scans. Full portfolio. Forever.</p>

              <ul className="space-y-3 mb-8">
                {[
                  'Everything in Free',
                  'Scan up to 20 repos at once',
                  'Use your own AI key (BYOK)',
                  'Portfolio comparison & ranking',
                  'Unlimited re-scans forever',
                  'Full scan history dashboard',
                  'Winner + runner-ups + leaderboard',
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="flex justify-center">
                <LoginButton />
              </div>

              <p className="text-center text-zinc-600 text-[10px] font-black uppercase tracking-widest mt-5">
                Use <span className="text-primary font-mono">FIRST10</span> for 50% off
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────── */}
      <section className="w-full max-w-3xl px-6 py-24 sm:py-32">
        <h2 className="text-3xl font-bold text-white mb-10 tracking-tight text-center">Frequently Asked</h2>
        <div className="space-y-2">
          <FAQItem
            question="Is the free scan actually free?"
            answer="Yes, 100% free. No API key, no credit card. Connect GitHub, pick a repo, get a full Market Readiness Plan with go-to-market roadmap, brutally honest scoring, and actionable next steps. We cover the AI cost for your first scan."
          />
          <FAQItem
            question="Why €19?"
            answer="€19 one-time unlocks unlimited scans forever: compare up to 20 repos at once, find your best project, and rescan as your code evolves. No subscriptions. That's less than a month of most SaaS tools — and one good revival easily pays for it 100x over. Use code FIRST10 for 50% off (first 10 users only)."
          />
          <FAQItem
            question="What repositories can you analyze?"
            answer="If it's on GitHub, we can scan it. Private or public. We focus on Node.js/Python/Next.js/React projects as they have the clearest SaaS monetization paths."
          />
          <FAQItem
            question="Do I need an API key?"
            answer="Not for the free scan — we handle it. For paid scans, you can optionally bring your own API key (BYOK) from OpenAI, Anthropic, or Google to choose your preferred AI model. This gives you full control over model quality and cost."
          />
          <FAQItem
            question="Is my code safe?"
            answer="We use the official GitHub OAuth flow. We do not clone repos. We only read the file structure, README, and package.json to understand context."
          />
          <FAQItem
            question="What does the analysis report include?"
            answer="A winner selection, Completeness Score, Brutal Truth AI verdict, Must Fix First blockers with effort estimates, Cut From MVP list, step-by-step Go-To-Market Roadmap to your first paying customer, Weekend Launch Blueprint, runner-ups with reasoning, and a ranked Graveyard Leaderboard."
          />
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────── */}
      <section className="w-full max-w-3xl px-6 py-24 sm:py-32 text-center">
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tighter text-white mb-4 leading-[1.05]">
          Your best idea is already written.<br/>You just abandoned it.
        </h2>
        <p className="text-zinc-500 text-lg mb-10 max-w-sm mx-auto">
          Free scan. No API key. Find out which repo is worth shipping this weekend.
        </p>
        <div className="flex flex-col items-center gap-4">
          <LoginButton />
          <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
            Free · No API key · 30 seconds to your blueprint
          </p>
        </div>
      </section>

      {/* ── Final Footer ────────────────────────────── */}
      <footer className="w-full border-t border-white/5 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-white font-black text-lg tracking-tighter">
              HiddenMRR
            </span>
            <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">© 2026 Pintayo Studio · Built for Builders</p>
          </div>
          <div className="flex gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
            <a href="/privacy" className="hover:text-primary transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-primary transition-colors">Terms</a>
            <a href="/support" className="hover:text-primary transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function ShieldCheck2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
