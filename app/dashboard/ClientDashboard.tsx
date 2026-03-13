"use client";

import { useState, useEffect } from "react";
import {
  Lock, Key, Loader2, Sparkles, Code, CheckCircle,
  Zap, Target, DollarSign, RotateCcw, AlertTriangle,
  ChevronDown, HelpCircle
} from "lucide-react";
import { fetchPrivateRepos, analyzeSelectedRepos } from "@/app/actions";
import { CostEstimator } from "@/components/CostEstimator";

// ── Score Ring (CSS only via SVG) ──────────────────────────
function ScoreRing({ score }: { score: number }) {
  const r = 58;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const hue = score >= 70 ? "stroke-emerald-400" : score >= 40 ? "stroke-amber-400" : "stroke-red-400";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="180" height="180" viewBox="0 0 160 160" className="-rotate-90">
        <circle cx="80" cy="80" r={r} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="10" />
        <circle
          cx="80" cy="80" r={r} fill="none"
          className={hue} strokeWidth="10"
          strokeDasharray={c} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1)", filter: "drop-shadow(0 0 12px currentColor)" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-7xl font-black text-white leading-none tracking-tighter">{score}</span>
        <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-2 ml-1">Score</span>
      </div>
    </div>
  );
}

// ── Paywall ────────────────────────────────────────────────
function Paywall({ userId }: { userId: string }) {
  const checkoutUrl = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_CHECKOUT_URL;
  const isAvailable = !!checkoutUrl && checkoutUrl !== "undefined";

  return (
    <div className="relative rounded-[2.5rem] overflow-hidden border border-white/[0.08] bg-zinc-950">
      {/* Faux blurred bento underneath */}
      <div className="pointer-events-none select-none blur-2xl opacity-20 p-8 grid grid-cols-3 gap-4 h-[500px]">
        <div className="col-span-2 rounded-3xl bg-zinc-800/40 border border-white/5" />
        <div className="rounded-3xl bg-zinc-800/40 border border-white/5" />
        <div className="col-span-3 rounded-3xl bg-zinc-800/40 border border-white/5" />
      </div>

      {/* Cinematic glass overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-3xl z-10 flex flex-col items-center justify-center p-8 sm:p-12 text-center">
        <div className="w-16 h-16 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-8 shadow-2xl">
          <Lock className="w-8 h-8 text-zinc-400" />
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter text-white mb-4">Unlock Your Hidden MRR</h2>
        <p className="text-zinc-400 max-w-md mb-10 text-base sm:text-lg leading-relaxed">
          One-time payment. Lifetime access. Plug in your OpenAI key and discover your
          most profitable abandoned project instantly.
        </p>

        {/* Premium checkout CTA */}
        <div className="flex flex-col items-center gap-4 w-full max-w-sm">
          {isAvailable ? (
            <a
              id="paywall-checkout-btn"
              href={`${checkoutUrl}?checkout[custom][user_id]=${userId}`}
              className="w-full inline-flex items-center justify-center gap-3 rounded-2xl px-8 py-5 text-[15px] font-bold text-white
                         bg-white/[0.05] border border-white/10
                         hover:bg-white/[0.08] hover:border-white/20 hover:-translate-y-1
                         active:translate-y-0 shadow-2xl transition-all duration-300 group"
            >
              <Sparkles className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              Unlock Full AI Analysis — $29
            </a>
          ) : (
            <button
              disabled
              className="w-full inline-flex items-center justify-center gap-3 rounded-2xl px-8 py-5 text-[15px] font-bold text-zinc-600
                         bg-zinc-900/50 border border-white/5 cursor-not-allowed"
            >
              <AlertTriangle className="w-5 h-5" />
              Checkout Currently Unavailable
            </button>
          )}
          <p className="text-[10px] text-zinc-600 uppercase tracking-[0.25em] font-bold">BYOK · Secured by Lemon Squeezy</p>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────
export default function ClientDashboard({ hasPaid, userId }: { hasPaid: boolean; userId: string }) {
  const [apiKey, setApiKey] = useState("");
  const [provider, setProvider] = useState<'openai' | 'anthropic' | 'google'>("openai");
  const [model, setModel] = useState("gpt-4o-mini");
  const [showCostEstimator, setShowCostEstimator] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [repos, setRepos] = useState<any[]>([]);
  const [results, setResults] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadingPhrases = [
    "Fetching repository metadata...",
    "Scanning project architecture...",
    "Analyzing market demand...",
    "Calculating monetization potential...",
    "Structuring launch plan...",
    "Finalizing brutal honesty..."
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnalyzing) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % loadingPhrases.length);
      }, 3000);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  if (!hasPaid) return <Paywall userId={userId} />;

  const handleStartAnalysis = async () => {
    if (!apiKey) { setError(`Please provide a ${provider === 'google' ? 'Gemini' : provider === 'anthropic' ? 'Anthropic' : 'OpenAI'} API Key.`); return; }
    setError(null);
    setIsAnalyzing(true);
    try {
      const fetchedRepos = await fetchPrivateRepos();
      setRepos(fetchedRepos || []);
      const topRepoNames = fetchedRepos.slice(0, 5).map((r: any) => r.full_name);
      // Now passing provider and model
      const analysisData = await analyzeSelectedRepos(topRepoNames, apiKey, provider, model);
      setResults(analysisData);
    } catch (err: any) {
      setError(err.message || "Failed to analyze repositories.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const modelOptions: Record<string, { label: string; value: string; recommended?: boolean }[]> = {
    openai: [
      { label: "GPT-4o Mini", value: "gpt-4o-mini", recommended: true },
      { label: "GPT-4.5 Turbo", value: "gpt-4.5-turbo" },
    ],
    anthropic: [
      { label: "Claude 3.5 Haiku", value: "claude-3-5-haiku-latest", recommended: true },
      { label: "Claude 3.7 Sonnet", value: "claude-3-7-sonnet-latest" },
    ],
    google: [
      { label: "Gemini 2.5 Flash", value: "gemini-2.5-flash", recommended: true },
      { label: "Gemini 3.1 Pro", value: "gemini-3.1-pro" },
    ],
  };

  return (
    <div className="space-y-12 pb-20">

      {/* ── BYOK Input ────────────────────────────────── */}
      {!results && (
        <div className="max-w-xl mx-auto rounded-3xl border border-white/[0.08] bg-zinc-950 p-8 sm:p-10 shadow-3xl space-y-8">
          
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 shrink-0 shadow-inner">
                <Key className="w-5 h-5 text-zinc-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Step 1: AI Provider</h2>
                <p className="text-sm text-zinc-500 mt-1 leading-relaxed">
                  Choose your brain. Your key is <strong className="text-zinc-300">never stored</strong>.
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowCostEstimator(true)}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
              title="View Cost Estimates"
            >
              <HelpCircle className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {(['openai', 'anthropic', 'google'] as const).map((p) => (
              <button
                key={p}
                onClick={() => {
                  setProvider(p);
                  setModel(modelOptions[p][0].value);
                }}
                className={`px-4 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider border transition-all
                  ${provider === p 
                    ? "bg-white/10 border-white/20 text-white shadow-lg" 
                    : "bg-white/[0.02] border-white/5 text-zinc-500 hover:border-white/10"}`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div className="relative">
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full appearance-none bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3.5
                           focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/5
                           transition-all text-sm text-zinc-300 shadow-inner cursor-pointer"
              >
                {modelOptions[provider].map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-zinc-950">
                    {opt.label} {opt.recommended ? "— Recommended (Fast & Cheap)" : ""}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                {modelOptions[provider].find(m => m.value === model)?.recommended && (
                    <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase tracking-widest">
                        Recommended
                    </span>
                )}
                <ChevronDown className="w-4 h-4 text-zinc-600" />
              </div>
            </div>

            <input
              id="api-key-input"
              type="password"
              placeholder={provider === 'google' ? 'Enter Gemini API Key' : provider === 'anthropic' ? 'Enter Anthropic Key (sk-ant-...)' : 'Enter OpenAI Key (sk-...)'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3.5
                         focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/5
                         transition-all font-mono text-sm text-zinc-300 placeholder:text-zinc-800 shadow-inner"
            />
            {error && (
              <p className="text-red-400 text-xs font-semibold flex items-center gap-2 px-1">
                <Zap className="w-3.5 h-3.5 shrink-0" />{error}
              </p>
            )}
            <button
              id="analyze-repos-btn"
              onClick={handleStartAnalysis}
              disabled={isAnalyzing || !apiKey}
              className="w-full rounded-xl px-4 py-4 text-[15px] font-bold text-white flex items-center justify-center gap-3
                         bg-zinc-900 border border-white/[0.1]
                         hover:bg-zinc-800 hover:border-white/20
                         disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-zinc-900
                         transition-all duration-300 shadow-2xl"
            >
              {isAnalyzing
                ? <><Loader2 className="w-5 h-5 animate-spin text-primary" /> <span className="animate-pulse">{loadingPhrases[loadingStep]}</span></>
                : <><Sparkles className="w-5 h-5 text-primary" /> Analyze My Repositories</>
              }
            </button>
          </div>
        </div>
      )}

      <CostEstimator 
        isOpen={showCostEstimator} 
        onClose={() => setShowCostEstimator(false)} 
      />

      {/* ── Results Bento Grid ──────── */}
      {results && results.topProjectName && (
        <div className="animate-fade-in-up max-w-5xl mx-auto space-y-6 px-4 sm:px-0">

          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-white mb-2">
              The Verdict
            </h2>
            <p className="text-sm text-zinc-500 font-medium uppercase tracking-[0.2em]">
              Analyzed {repos.length} Repositories · 1 Winner Found
            </p>
          </div>

          {/* ── Bento Grid ───────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">

            {/* Card 1: Niche/Tags (col-span-4) */}
            <div className="md:col-span-4 rounded-[2rem] border border-white/[0.08] bg-zinc-950 p-8 flex flex-col justify-between min-h-[280px]">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 shrink-0">
                    <Code className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-600">Primary Candidate</span>
                </div>
                <h3 className="text-4xl sm:text-5xl font-black tracking-tighter text-white mb-4">{results.topProjectName}</h3>
                <p className="text-zinc-500 text-lg font-medium">Fastest path to revenue in your current portfolio.</p>
              </div>
              <div className="flex flex-wrap gap-3 mt-8">
                <span className="inline-flex items-center gap-2 text-xs font-bold
                                 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2 text-zinc-400">
                  <Target className="w-3.5 h-3.5 text-primary" />
                  {results.targetNiche}
                </span>
                <span className="inline-flex items-center gap-2 text-xs font-bold
                                 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2 text-zinc-400">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                  {results.monetizationModel}
                </span>
              </div>
            </div>

            {/* Card 2: Massive Completeness Score (col-span-2) */}
            <div className="md:col-span-2 rounded-[2rem] border border-white/[0.08] bg-zinc-950 p-8 flex flex-col items-center justify-center gap-4 text-center">
              <ScoreRing score={Number(results.completenessScore)} />
              <div className="space-y-1">
                <p className="text-white font-bold text-lg tracking-tight">
                  {Number(results.completenessScore) >= 70
                    ? "Production Ready"
                    : Number(results.completenessScore) >= 40
                    ? "Strong Foundation"
                    : "Architectural POC"}
                </p>
                <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">Readiness Level</p>
              </div>
            </div>

            {/* Card 3: The Brutal Truth (col-span-6) */}
            <div className="md:col-span-6 rounded-[2rem] border border-white/[0.05] bg-white/[0.02] p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                 <Zap className="w-32 h-32 text-primary -rotate-12" />
              </div>
              <h4 className="text-[11px] font-black text-white uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                The Brutal Truth
              </h4>
              <p className="text-xl sm:text-2xl text-zinc-300 leading-tight font-medium italic relative z-10 max-w-3xl">
                &ldquo;{results.brutalTruth}&rdquo;
              </p>
            </div>

            {/* Card 4: Launch Plan (col-span-6) */}
            <div className="md:col-span-6 rounded-[3rem] border border-white/[0.08] bg-zinc-950 p-8 sm:p-12">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
                <h4 className="text-2xl font-bold text-white tracking-tighter flex items-center gap-3">
                  <CheckCircle className="w-7 h-7 text-primary" />
                  Weekend Launch Strategy
                </h4>
                <div className="px-5 py-2 rounded-full bg-white/[0.03] border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-center">
                  Priority Action Items
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                {/* Horizontal line for desktop */}
                <div className="hidden md:block absolute top-[18px] left-8 right-8 h-px bg-white/[0.05]" />

                {results.weekendLaunchPlan.map((step: string, i: number) => {
                  const splitIdx = step.indexOf(':');
                  const prefix  = splitIdx > -1 ? step.substring(0, splitIdx) : `Phase ${i + 1}`;
                  const content = splitIdx > -1 ? step.substring(splitIdx + 1).trim() : step;

                  return (
                    <div key={i} className="relative space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center text-xs font-black text-white shadow-xl relative z-10">
                          0{i + 1}
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-zinc-600">{prefix}</span>
                      </div>
                      <p className="text-lg text-zinc-300 leading-relaxed font-medium pl-1">
                        {content}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Reset */}
          <div className="flex justify-center pt-10">
            <button
              onClick={() => { setResults(null); setApiKey(""); }}
              className="group flex items-center gap-3 text-zinc-600 hover:text-zinc-200 text-xs font-bold uppercase tracking-[0.2em]
                         px-8 py-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
            >
              <RotateCcw className="w-4 h-4 group-hover:-rotate-90 transition-transform duration-500" />
              Analyze New Repositories
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
