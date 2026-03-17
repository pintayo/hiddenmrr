"use client";

import { useState, useEffect } from "react";
import {
  Lock, Key, Loader2, Sparkles, Code, CheckCircle,
  Zap, Target, DollarSign, RotateCcw, AlertTriangle,
  ChevronDown, HelpCircle, AlertCircle, Scissors, Rocket,
  Clock, ArrowRight, Trophy, History, Crown
} from "lucide-react";
import { fetchUserRepos, analyzeSelectedRepos, getUserAnalyses } from "@/app/actions";
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

        <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter text-white mb-4">You Saw What&apos;s Possible</h2>
        <p className="text-zinc-400 max-w-md mb-10 text-base sm:text-lg leading-relaxed">
          Your free scan showed real potential. Unlock unlimited scans to compare your entire portfolio and find the highest-ROI project.
        </p>

        <div className="flex flex-col items-center gap-4 w-full max-w-sm">
          {isAvailable ? (
            <a
              id="paywall-checkout-btn"
              href={`${checkoutUrl}?checkout[custom][user_id]=${userId}`}
              className="w-full inline-flex items-center justify-center gap-3 rounded-2xl px-8 py-5 text-[15px] font-bold text-black
                         bg-white hover:bg-zinc-200 hover:-translate-y-1
                         active:translate-y-0 shadow-2xl transition-all duration-300 group"
            >
              <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Go Pro — €19 Lifetime
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
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-3 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
              <span>Unlimited scans</span>
              <span className="text-zinc-800">·</span>
              <span>Up to 20 repos</span>
              <span className="text-zinc-800">·</span>
              <span>Lifetime access</span>
            </div>
            <p className="text-[10px] text-zinc-600 uppercase tracking-[0.25em] font-bold">
              Launch price <span className="line-through text-zinc-700">€29</span> → <span className="text-primary">€19</span> · Use <span className="text-primary font-mono">FIRST10</span> for 50% off
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────
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

export default function ClientDashboard({ hasPaid, userId, freeScansUsed }: { hasPaid: boolean; userId: string; freeScansUsed: number }) {
  const [apiKey, setApiKey] = useState("");
  const [provider, setProvider] = useState<'openai' | 'anthropic' | 'google'>("openai");
  const [model, setModel] = useState("gpt-4o-mini");
  const [showCostEstimator, setShowCostEstimator] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [repos, setRepos] = useState<any[]>([]);
  const [results, setResults] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pastAnalyses, setPastAnalyses] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);
  const [isFetchingRepos, setIsFetchingRepos] = useState(false);
  const [showByok, setShowByok] = useState(false);
  const [step, setStep] = useState<'config' | 'selection' | 'results'>('config');

  const canFreeScan = !hasPaid && freeScansUsed < 1;
  const maxRepos = hasPaid ? 20 : 1;

  // ── Sync with LocalStorage ──────────────────────────
  useEffect(() => {
    const lastProvider = localStorage.getItem('hiddenmrr_last_provider') as any;
    if (lastProvider && ['openai', 'anthropic', 'google'].includes(lastProvider)) {
      setProvider(lastProvider);
      
      const savedKey = localStorage.getItem(`hiddenmrr_${lastProvider}_key`);
      if (savedKey) setApiKey(savedKey);

      const savedModel = localStorage.getItem(`hiddenmrr_${lastProvider}_model`);
      if (savedModel) setModel(savedModel);
      else setModel(modelOptions[lastProvider][0].value);
    }
  }, []);

  const handleProviderChange = (p: 'openai' | 'anthropic' | 'google') => {
    setProvider(p);
    localStorage.setItem('hiddenmrr_last_provider', p);
    
    // Restore Key
    const savedKey = localStorage.getItem(`hiddenmrr_${p}_key`) || "";
    setApiKey(savedKey);

    // Restore Model
    const savedModel = localStorage.getItem(`hiddenmrr_${p}_model`);
    if (savedModel) {
      setModel(savedModel);
    } else {
      const defaultModel = modelOptions[p][0].value;
      setModel(defaultModel);
      localStorage.setItem(`hiddenmrr_${p}_model`, defaultModel);
    }
  };

  const handleApiKeyChange = (val: string) => {
    setApiKey(val);
    localStorage.setItem(`hiddenmrr_${provider}_key`, val);
  };

  const handleModelChange = (val: string) => {
    setModel(val);
    localStorage.setItem(`hiddenmrr_${provider}_model`, val);
  };

  const handleClearKey = () => {
    setApiKey("");
    localStorage.removeItem(`hiddenmrr_${provider}_key`);
  };

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

  // Show hard paywall only if unpaid AND free scan already used
  if (!hasPaid && freeScansUsed >= 1 && step === 'config' && !results) return <Paywall userId={userId} />;

  const handleFetchRepos = async () => {
    // For free scan, API key is optional (server provides one)
    if (!canFreeScan && !apiKey) {
      setError(`Please provide a ${provider === 'google' ? 'Gemini' : provider === 'anthropic' ? 'Anthropic' : 'OpenAI'} API Key.`);
      return;
    }
    setError(null);
    setIsFetchingRepos(true);
    try {
      const fetchedRepos = await fetchUserRepos();
      setRepos(fetchedRepos || []);
      // Pre-select repos up to limit
      setSelectedRepos(fetchedRepos.slice(0, maxRepos).map((r: any) => r.full_name));
      setStep('selection');
    } catch (err: any) {
      setError(err.message || "Failed to fetch repositories.");
    } finally {
      setIsFetchingRepos(false);
    }
  };

  const handleStartAnalysis = async () => {
    if (selectedRepos.length === 0) {
      setError("Please select at least one repository to analyze.");
      return;
    }
    if (selectedRepos.length > 20) {
      setError("Maximum 20 repos per scan to ensure deep AI analysis.");
      return;
    }
    setError(null);
    setIsAnalyzing(true);
    try {
      const analysisData = await analyzeSelectedRepos(selectedRepos, apiKey, provider, model);
      setResults(analysisData);
      setStep('results');
    } catch (err: any) {
      setError(err.message || "Failed to analyze repositories.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleRepo = (fullName: string) => {
    setSelectedRepos(prev => {
      if (prev.includes(fullName)) {
        setError(null);
        return prev.filter(r => r !== fullName);
      }
      if (prev.length >= maxRepos) {
        setError(hasPaid
          ? "Maximum 20 repos per scan to ensure deep AI analysis."
          : "Free tier: 1 repo per scan. Upgrade to analyze up to 20."
        );
        return prev;
      }
      setError(null);
      return [...prev, fullName];
    });
  };

  const handleLoadHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const analyses = await getUserAnalyses();
      setPastAnalyses(analyses);
      setShowHistory(true);
    } catch {
      setError("Failed to load scan history.");
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleViewPastAnalysis = (analysis: any) => {
    if (analysis.full_results) {
      setResults(analysis.full_results);
      setStep('results');
      setShowHistory(false);
    }
  };


  return (
    <div className="space-y-12 pb-20">

      {/* ── SCAN HISTORY ────────────────────────────────── */}
      {step === 'config' && (
        <div className="max-w-xl mx-auto flex justify-end">
          <button
            onClick={handleLoadHistory}
            disabled={isLoadingHistory}
            className="flex items-center gap-2 text-zinc-500 hover:text-zinc-200 text-xs font-bold uppercase tracking-[0.15em]
                       px-4 py-2 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
          >
            {isLoadingHistory
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : <History className="w-3.5 h-3.5" />
            }
            Past Scans
          </button>
        </div>
      )}

      {/* ── HISTORY PANEL ────────────────────────────────── */}
      {showHistory && (
        <div className="max-w-xl mx-auto rounded-3xl border border-white/[0.08] bg-zinc-950 p-8 shadow-3xl space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-3">
              <History className="w-5 h-5 text-zinc-400" />
              Scan History
            </h3>
            <button
              onClick={() => setShowHistory(false)}
              className="text-[10px] font-black text-zinc-600 uppercase tracking-widest hover:text-zinc-300 transition-colors"
            >
              Close
            </button>
          </div>

          {pastAnalyses.length === 0 ? (
            <p className="text-sm text-zinc-600 text-center py-8">No scans yet. Run your first analysis below.</p>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {pastAnalyses.map((analysis) => (
                <button
                  key={analysis.id}
                  onClick={() => handleViewPastAnalysis(analysis)}
                  className="w-full text-left p-4 rounded-xl border border-white/[0.05] bg-white/[0.02] hover:border-white/15 transition-all group space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                      {analysis.top_project_name}
                    </h4>
                    <div className="flex items-center gap-2">
                      {analysis.is_free_scan && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest bg-primary/10 text-primary border border-primary/20">Free</span>
                      )}
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-black border tracking-widest
                        ${(analysis.completeness_score || 0) >= 70 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : (analysis.completeness_score || 0) >= 40 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                        {analysis.completeness_score}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-zinc-600">
                    <span>{analysis.target_niche}</span>
                    <span>·</span>
                    <span>{new Date(analysis.created_at).toLocaleDateString()}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── STEP 1: CONFIG ────────────────────────────────── */}
      {step === 'config' && (
        <div className="max-w-xl mx-auto space-y-6 animate-fade-in">

          {/* Free Scan CTA — zero friction */}
          {canFreeScan && (
            <div className="rounded-3xl border border-primary/20 bg-gradient-to-b from-primary/5 to-zinc-950 p-8 sm:p-10 shadow-3xl space-y-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tighter text-white">
                  Get Your Free Scan
                </h2>
                <p className="text-zinc-400 text-base max-w-md mx-auto leading-relaxed">
                  No API key needed. We&apos;ll analyze your repo and show you exactly what to build, who to sell to, and how to get your first customer.
                </p>
              </div>
              <button
                onClick={handleFetchRepos}
                disabled={isFetchingRepos}
                className="w-full max-w-sm mx-auto rounded-2xl px-6 py-5 text-[15px] font-bold text-black flex items-center justify-center gap-3
                           bg-white hover:bg-zinc-200
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-all duration-300 shadow-2xl"
              >
                {isFetchingRepos
                  ? <><Loader2 className="w-5 h-5 animate-spin" /> <span className="animate-pulse">Connecting GitHub...</span></>
                  : <><Zap className="w-5 h-5" /> Scan My Repos — Free</>
                }
              </button>
              <p className="text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-bold">
                No credit card · No API key · 1 free deep scan
              </p>
              {error && (
                <p className="text-red-400 text-xs font-semibold flex items-center justify-center gap-2">
                  <Zap className="w-3.5 h-3.5 shrink-0" />{error}
                </p>
              )}

              {/* Optional: use own key toggle */}
              <button
                onClick={() => setShowByok(!showByok)}
                className="text-[10px] text-zinc-600 hover:text-zinc-400 uppercase tracking-widest font-bold transition-colors"
              >
                {showByok ? 'Hide' : 'Or use your own API key'}
              </button>
            </div>
          )}

          {/* BYOK Config — shown for paid users, or if free user opts in */}
          {(!canFreeScan || showByok) && (
          <div className="rounded-3xl border border-white/[0.08] bg-zinc-950 p-8 sm:p-10 shadow-3xl space-y-8">

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 shrink-0 shadow-inner">
                <Key className="w-5 h-5 text-zinc-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">{canFreeScan ? 'Use Your Own Key' : 'AI Provider'}</h2>
                <p className="text-sm text-zinc-500 mt-1 leading-relaxed">
                  Choose your brain. Your key is <strong className="text-zinc-300">never sent to our servers</strong>.
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
                onClick={() => handleProviderChange(p)}
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
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                  API Configuration
                </label>
                {apiKey && (
                  <button 
                    onClick={handleClearKey}
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500/60 hover:text-red-400 transition-colors"
                  >
                    Clear Saved Key
                  </button>
                )}
              </div>
              <div className="relative">
                <select
                  value={model}
                  onChange={(e) => handleModelChange(e.target.value)}
                  className="w-full appearance-none bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3.5
                             focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/5
                             transition-all text-base md:text-sm text-zinc-300 shadow-inner cursor-pointer"
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
                onChange={(e) => handleApiKeyChange(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3.5
                           focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/5
                           transition-all font-mono text-base md:text-sm text-zinc-300 placeholder:text-zinc-800 shadow-inner"
              />
            {error && (
              <p className="text-red-400 text-xs font-semibold flex items-center gap-2 px-1">
                <Zap className="w-3.5 h-3.5 shrink-0" />{error}
              </p>
            )}
            <button
              onClick={handleFetchRepos}
              disabled={isFetchingRepos || !apiKey}
              className="w-full rounded-xl px-4 py-4 text-[15px] font-bold text-white flex items-center justify-center gap-3
                         bg-zinc-900 border border-white/[0.1]
                         hover:bg-zinc-800 hover:border-white/20
                         disabled:opacity-20 disabled:cursor-not-allowed
                         transition-all duration-300 shadow-2xl"
            >
              {isFetchingRepos
                ? <><Loader2 className="w-5 h-5 animate-spin text-primary" /> <span className="animate-pulse">Accessing GitHub...</span></>
                : <><Sparkles className="w-5 h-5 text-primary" /> Fetch My Repositories</>
              }
            </button>
          </div>
        </div>
          )}
        </div>
      )}

      {/* ── STEP 2: SELECTION GATE ────────────────────────── */}
      {step === 'selection' && (
        <div className="max-w-2xl mx-auto rounded-3xl border border-white/[0.08] bg-zinc-950 p-8 sm:p-10 shadow-3xl space-y-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 shrink-0 shadow-inner">
                <Code className="w-5 h-5 text-zinc-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Step 2: Selection Gate</h2>
                <p className="text-sm text-zinc-500 mt-1">
                  {hasPaid ? "Select up to 20 repos for deep analysis." : "Pick your best repo for a free analysis."}
                </p>
              </div>
            </div>
            <div className="px-3 py-1 rounded-lg bg-white/[0.02] border border-white/10 text-[10px] font-black uppercase tracking-widest text-zinc-500">
               {selectedRepos.length} / {maxRepos} Selected
            </div>
          </div>

          {!hasPaid && (
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-primary shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-bold text-white">Free Analysis — Pick Your Best Repo</p>
                <p className="text-xs text-zinc-400 mt-0.5">Get the full Market Readiness Plan for 1 repo. Upgrade to scan your entire portfolio.</p>
              </div>
            </div>
          )}

          <div className="max-h-[400px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
            {repos.map((repo) => (
              <div 
                key={repo.full_name}
                onClick={() => toggleRepo(repo.full_name)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between group
                  ${selectedRepos.includes(repo.full_name) 
                    ? "bg-white/[0.05] border-white/20" 
                    : "bg-white/[0.01] border-white/[0.03] hover:border-white/10"}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all
                    ${selectedRepos.includes(repo.full_name) 
                      ? "bg-primary border-primary text-black" 
                      : "bg-black border-white/10 group-hover:border-white/20"}`}>
                    {selectedRepos.includes(repo.full_name) && <CheckCircle className="w-4 h-4" />}
                  </div>
                  <div className="space-y-0.5">
                    <p className={`text-sm font-bold tracking-tight transition-colors
                      ${selectedRepos.includes(repo.full_name) ? "text-white" : "text-zinc-400"}`}>
                      {repo.name}
                    </p>
                    <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">{repo.language || 'Markdown'}</p>
                  </div>
                </div>
                {selectedRepos.includes(repo.full_name) && (
                   <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Active</span>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {error && (
              <p className="text-red-400 text-xs font-semibold flex items-center gap-2 px-1">
                <Zap className="w-3.5 h-3.5 shrink-0" />{error}
              </p>
            )}
            <div className="flex gap-4">
              <button
                onClick={() => setStep('config')}
                className="flex-1 rounded-xl px-4 py-4 text-xs font-bold text-zinc-500 uppercase tracking-widest
                           bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all"
              >
                Back
              </button>
              <button
                onClick={handleStartAnalysis}
                disabled={isAnalyzing || selectedRepos.length === 0}
                className="flex-[2] rounded-xl px-4 py-4 text-[15px] font-bold flex items-center justify-center gap-3
                           bg-white text-black hover:bg-zinc-200
                           disabled:opacity-20 disabled:cursor-not-allowed
                           transition-all duration-300 shadow-2xl"
              >
                {isAnalyzing
                  ? <><Loader2 className="w-5 h-5 animate-spin text-black" /> <span className="animate-pulse">{loadingPhrases[loadingStep]}</span></>
                  : <><Sparkles className="w-5 h-5 text-black" /> Run AI Appraisal</>
                }
              </button>
            </div>
          </div>
        </div>
      )}

      <CostEstimator 
        isOpen={showCostEstimator} 
        onClose={() => setShowCostEstimator(false)} 
      />

      {/* ── STEP 3: RESULTS ─────────────────────────────── */}
      {step === 'results' && results && results.winner && (
        <div className="animate-fade-in-up max-w-5xl mx-auto space-y-16 px-4 sm:px-0">

          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-white mb-2">
              The Verdict
            </h2>
            <p className="text-sm text-zinc-500 font-medium uppercase tracking-[0.2em]">
              Analyzed {selectedRepos.length} Repositories · Winner & Runner-Ups Found
            </p>
          </div>

          {/* ── WINNER BENTO GRID ────────────────────────── */}
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
                <h3 className="text-4xl sm:text-5xl font-black tracking-tighter text-white mb-4">{results.winner.topProjectName}</h3>
                <p className="text-zinc-500 text-lg font-medium">Fastest path to revenue in your current portfolio.</p>
              </div>
              <div className="flex flex-wrap gap-3 mt-8">
                <span className="inline-flex items-center gap-2 text-xs font-bold
                                 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2 text-zinc-400">
                  <Target className="w-3.5 h-3.5 text-primary" />
                  {results.winner.targetNiche}
                </span>
                <span className="inline-flex items-center gap-2 text-xs font-bold
                                 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2 text-zinc-400">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                  {results.winner.monetizationModel}
                </span>
              </div>
            </div>

            {/* Card 2: Massive Completeness Score (col-span-2) */}
            <div className="md:col-span-2 rounded-[2rem] border border-white/[0.08] bg-zinc-950 p-8 flex flex-col items-center justify-center gap-4 text-center">
              <ScoreRing score={Number(results.winner.completenessScore) || 0} />
              <div className="space-y-1">
                <p className="text-white font-bold text-lg tracking-tight">
                  {Number(results.winner.completenessScore) >= 70
                    ? "Production Ready"
                    : Number(results.winner.completenessScore) >= 40
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
                &ldquo;{results.winner.brutalTruth}&rdquo;
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
                <div className="hidden md:block absolute top-[18px] left-8 right-8 h-px bg-white/[0.05]" />

                {(Array.isArray(results.winner.weekendLaunchPlan) ? results.winner.weekendLaunchPlan : []).map((step: string, i: number) => {
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

          {/* ── MARKET READINESS PLAN ────────────────────── */}
          {results.marketReadiness && (
            <div className="space-y-8 animate-fade-in-up">
              <div className="text-center space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black tracking-tighter text-white">
                  Market Readiness Plan
                </h3>
                <p className="text-sm text-zinc-500 font-medium uppercase tracking-[0.2em]">
                  Your actionable blueprint from code to first paying customer
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Must Fix First */}
                {Array.isArray(results.marketReadiness.mustFix) && results.marketReadiness.mustFix.length > 0 && (
                  <div className="md:col-span-1 rounded-[2rem] border border-red-500/10 bg-zinc-950 p-8 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 shrink-0">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white tracking-tight">Must Fix First</h4>
                        <p className="text-[10px] font-black text-red-400/60 uppercase tracking-[0.2em]">Critical blockers before launch</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {results.marketReadiness.mustFix.map((fix: any, i: number) => (
                        <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-2">
                          <div className="flex items-center justify-between gap-3">
                            <h5 className="text-sm font-bold text-white flex items-center gap-2">
                              <span className="w-5 h-5 rounded-md bg-red-500/10 border border-red-500/20 flex items-center justify-center text-[10px] font-black text-red-400">{i + 1}</span>
                              {fix.item}
                            </h5>
                            <span className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border
                              ${fix.effort === 'hours' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : fix.effort === 'days' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                              <Clock className="w-3 h-3" />
                              {fix.effort}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-500 leading-relaxed">{fix.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cut From MVP */}
                {Array.isArray(results.marketReadiness.cutFromMVP) && results.marketReadiness.cutFromMVP.length > 0 && (
                  <div className="md:col-span-1 rounded-[2rem] border border-amber-500/10 bg-zinc-950 p-8 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 shrink-0">
                        <Scissors className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white tracking-tight">Cut From MVP</h4>
                        <p className="text-[10px] font-black text-amber-400/60 uppercase tracking-[0.2em]">Skip these for now — ship faster</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {results.marketReadiness.cutFromMVP.map((cut: any, i: number) => (
                        <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-start gap-3">
                          <div className="w-5 h-5 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                            <Scissors className="w-3 h-3 text-amber-400" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-zinc-300 line-through decoration-amber-500/40">{cut.feature}</p>
                            <p className="text-xs text-zinc-500 leading-relaxed">{cut.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Go-To-Market Roadmap */}
              {Array.isArray(results.marketReadiness.goToMarket) && results.marketReadiness.goToMarket.length > 0 && (
                <div className="rounded-[3rem] border border-white/[0.08] bg-zinc-950 p-8 sm:p-12 space-y-10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <h4 className="text-2xl font-bold text-white tracking-tighter flex items-center gap-3">
                      <Rocket className="w-7 h-7 text-primary" />
                      Go-To-Market Roadmap
                    </h4>
                    <div className="px-5 py-2 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-[0.2em] text-primary text-center">
                      Code → First Customer
                    </div>
                  </div>

                  <div className="relative space-y-0">
                    {/* Vertical timeline line */}
                    <div className="absolute left-[19px] top-4 bottom-4 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent hidden sm:block" />

                    {results.marketReadiness.goToMarket.map((gtm: any, i: number) => (
                      <div key={i} className="relative flex gap-6 group">
                        {/* Timeline node */}
                        <div className="shrink-0 relative z-10">
                          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 group-hover:border-primary/30 flex items-center justify-center text-xs font-black text-white shadow-xl transition-colors">
                            {String(gtm.step || i + 1).padStart(2, '0')}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="pb-8 flex-1 space-y-3">
                          <h5 className="text-lg font-bold text-white tracking-tight group-hover:text-primary transition-colors">
                            {gtm.title}
                          </h5>
                          <p className="text-sm text-zinc-400 leading-relaxed">
                            {gtm.detail}
                          </p>
                          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400/70">
                            <Trophy className="w-3.5 h-3.5" />
                            <span>{gtm.milestone}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── RUNNER-UPS ─────────────────────────────── */}
          {Array.isArray(results.runnerUps) && results.runnerUps.length > 0 && (
            <div className="space-y-8 animate-fade-in-up">
              <div className="flex items-center gap-4 px-2">
                <h4 className="text-xl font-bold text-white tracking-tighter uppercase tracking-[0.1em]">High-Potential Runner-Ups</h4>
                <div className="h-px flex-1 bg-white/[0.05]" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {results.runnerUps.map((runner: any, i: number) => (
                    <div key={i} className="rounded-[2rem] border border-white/[0.08] bg-zinc-950 p-6 space-y-4 hover:border-white/20 transition-colors group">
                       <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest bg-white/[0.03] px-2 py-1 rounded border border-white/5">0{i + 2} Candidate</span>
                          <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">{runner.score}% Match</span>
                       </div>
                       <h5 className="text-2xl font-black text-white tracking-tight group-hover:text-primary transition-colors">{runner.projectName}</h5>
                       <div className="flex items-center gap-2">
                          <Target className="w-3 h-3 text-zinc-500" />
                          <span className="text-[11px] font-bold text-zinc-500">{runner.niche}</span>
                       </div>
                       <p className="text-sm text-zinc-400 leading-relaxed italic border-l-2 border-primary/20 pl-4">
                          &ldquo;{runner.shortReason}&rdquo;
                       </p>
                    </div>
                 ))}
              </div>
            </div>
          )}

          {/* ── GRAVEYARD LEADERBOARD ──────────────────── */}
          {Array.isArray(results.leaderboard) && results.leaderboard.length > 0 && (
            <div className="space-y-6 animate-fade-in-up">
              <div className="flex items-center gap-4 px-2">
                <h4 className="text-xl font-bold text-white tracking-tighter uppercase tracking-[0.1em]">The Graveyard Leaderboard</h4>
                <div className="h-px flex-1 bg-white/[0.05]" />
              </div>
              <div className="rounded-[1.5rem] overflow-hidden border border-white/[0.08] bg-zinc-950">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-white/[0.02] border-b border-white/[0.08]">
                      <tr>
                        <th className="px-6 py-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest">Project Name</th>
                        <th className="px-6 py-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest text-right">Potential Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {results.leaderboard.map((item: any, i: number) => {
                        const scoreColor = item.score >= 50 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                         : item.score >= 30 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                         : 'bg-red-500/10 text-red-400 border-red-500/20';
                        return (
                          <tr key={i} className="hover:bg-white/[0.01] transition-colors group">
                            <td className="px-6 py-4 font-bold text-zinc-400 group-hover:text-white transition-colors">{item.projectName}</td>
                            <td className="px-6 py-4 text-right">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black border tracking-widest ${scoreColor}`}>
                                {item.score}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Upgrade CTA for free scan users */}
          {results._isFreeScan && (
            <div className="rounded-[2.5rem] border border-primary/20 bg-gradient-to-b from-primary/5 to-transparent p-8 sm:p-12 text-center space-y-6 animate-fade-in-up">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
                <Crown className="w-7 h-7 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black tracking-tighter text-white">
                  Now compare all {repos.length > 0 ? repos.length : 'your'} repos
                </h3>
                <p className="text-zinc-400 max-w-lg mx-auto text-base leading-relaxed">
                  You saw what 1 repo looks like. Scan your entire portfolio — ranked, scored, and compared — to find the real winner.
                </p>
              </div>

              {(() => {
                const checkoutUrl = process.env.NEXT_PUBLIC_LEMON_SQUEEZY_CHECKOUT_URL;
                return checkoutUrl && checkoutUrl !== "undefined" ? (
                  <a
                    href={`${checkoutUrl}?checkout[custom][user_id]=${userId}`}
                    className="inline-flex items-center justify-center gap-3 rounded-2xl px-10 py-5 text-[15px] font-bold text-black
                               bg-white hover:bg-zinc-200 hover:-translate-y-1
                               active:translate-y-0 shadow-2xl transition-all duration-300"
                  >
                    <Sparkles className="w-5 h-5" /> Go Pro — €19 Lifetime
                  </a>
                ) : null;
              })()}
              <p className="text-[10px] text-zinc-600 uppercase tracking-[0.25em] font-bold">
                Launch price <span className="line-through text-zinc-700">€29</span> · Use <span className="text-primary font-mono">FIRST10</span> for 50% off · No subscription
              </p>
            </div>
          )}

          {/* Reset */}
          <div className="flex justify-center pt-6">
            <button
              onClick={() => { setStep('config'); setResults(null); }}
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
