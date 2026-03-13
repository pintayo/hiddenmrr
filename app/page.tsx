"use client";

import { LoginButton } from "@/components/AuthButtons";
import { Lock, ShieldCheck, Zap, Code, Target, Sparkles, ChevronDown, CheckCircle2, Shield, EyeOff, Search, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
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

export default function Home() {
  const [progress, setProgress] = useState(0);
  const [isFound, setIsFound] = useState(false);

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

  return (
    <main className="flex-1 flex flex-col items-center bg-zinc-950 selection:bg-primary/30 selection:text-white font-sans overflow-x-hidden">

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
            <span className="text-white font-black tracking-tighter italic">HiddenMRR</span> scans your abandoned projects and identifies the highest-margin 
            B2B opportunities hidden in your logic.
          </p>

          <div className="flex flex-col items-start gap-6">
            <LoginButton />

            {/* Trust pill */}
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-xl px-4 py-2 text-[10px] text-zinc-500 font-bold tracking-widest uppercase">
              <Lock className="w-3.5 h-3.5" />
              <span>GitHub OAuth</span>
              <span className="text-zinc-800 mx-1">|</span>
              <span>BYOK Privacy</span>
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
          <span className="text-white font-black tracking-tighter italic">HiddenMRR</span> is built for indie hackers who value their IP. We never store your code, 
          we only read metadata via secure GitHub API calls, and your API Key (BYOK) powers 
          the analysis directly.
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

      {/* ── FAQ ──────────────────────────────────────── */}
      <section className="w-full max-w-3xl px-6 py-24 sm:py-32">
        <h2 className="text-3xl font-bold text-white mb-10 tracking-tight text-center">Frequently Asked</h2>
        <div className="space-y-2">
          <FAQItem 
            question="Why a $29 one-time fee?" 
            answer="Subscription models are for maintenance. We are a catalyst. Pay once, use it for every ghost repo you start this year. No hidden costs beyond your own LLM usage." 
          />
          <FAQItem 
            question="What repositories can you analyze?" 
            answer="If it's on GitHub, we can scan it. Private or public. We focus on Node.js/Python/Next.js/React projects as they have the clearest SaaS monetization paths." 
          />
          <FAQItem 
            question="How does BYOK work?" 
            answer="You provide your OpenAI API key in the dashboard. We use it to perform the analysis on your behalf. This keeps HiddenMRR cheap and ensures you control your AI costs." 
          />
          <FAQItem 
            question="Is my code safe?" 
            answer="We use the official GitHub OAuth flow. We do not clones repos. We only read the file structure, README, and package.json to understand context." 
          />
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
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Support</a>
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
