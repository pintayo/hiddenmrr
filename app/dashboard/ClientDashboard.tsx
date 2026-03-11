"use client";

import { useState } from "react";
import { Lock, Unlock, Key, Loader2, Sparkles, Code, CheckCircle, ArrowRight } from "lucide-react";
import { fetchPrivateRepos, analyzeSelectedRepos } from "@/app/actions";

export default function ClientDashboard({ hasPaid, userId }: { hasPaid: boolean; userId: string }) {
  const [apiKey, setApiKey] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [repos, setRepos] = useState<any[]>([]);
  const [results, setResults] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  // If user hasn't paid, show the paywall layer
  if (!hasPaid) {
    return (
      <div className="relative rounded-2xl border border-border bg-card p-12 overflow-hidden text-center">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-md z-10 flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-primary/20 p-4 rounded-full mb-6">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-3">Unlock Your Hidden MRR</h2>
          <p className="text-muted-foreground max-w-md mb-8">
            Get lifetime access to our AI evaluation engine. Connect your OpenAI key and instantly find your next $1k/mo venture.
          </p>
          {/* Replace this href with actual LemonSqueezy Checkout URL injected with custom data (user_id) */}
          <a
            href={`#lemonsqueezy-checkout-url?checkout[custom][user_id]=${userId}`}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-4 text-lg font-semibold shadow-[0_0_30px_-5px] shadow-primary/50 transition-all hover:scale-105"
          >
            Get Lifetime Access - $49
          </a>
          <p className="text-xs text-muted-foreground mt-4 uppercase tracking-wider">One-time payment. Bring Your Own Key.</p>
        </div>

        {/* Dummy Blurred Content underneath */}
        <div className="opacity-30 pointer-events-none select-none filter blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
             {[1,2,3].map(i => (
               <div key={i} className="h-48 rounded-xl bg-secondary/50 border border-border p-6" />
             ))}
          </div>
        </div>
      </div>
    );
  }

  const handleStartAnalysis = async () => {
    if (!apiKey) {
      setError("Please provide an OpenAI API Key.");
      return;
    }
    setError(null);
    setIsAnalyzing(true);
    
    try {
      // 1. Fetch repos
      const fetchedRepos = await fetchPrivateRepos();
      setRepos(fetchedRepos || []);
      
      // 2. We automatically analyze the 5 most recently updated ones to save tokens
      const topRepoNames = fetchedRepos.slice(0, 5).map((r: any) => r.full_name);
      
      // 3. Trigger LLM Analysis
      const analysisData = await analyzeSelectedRepos(topRepoNames, apiKey);
      setResults(analysisData);
    } catch (err: any) {
      setError(err.message || "Failed to analyze repositories.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      
      {/* BYOK Input Section (Only show if we haven't successfully analyzed yet to save space) */}
      {!results && (
        <div className="bg-card border border-border rounded-2xl p-8 max-w-2xl mx-auto shadow-sm">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-secondary p-3 rounded-lg"><Key className="w-6 h-6 text-primary" /></div>
            <div>
              <h2 className="text-xl font-bold">Bring Your Own Key</h2>
              <p className="text-sm text-muted-foreground mt-1">
                We use your OpenAI API key to run the analysis. We <strong>never</strong> store this key on our servers.
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <input 
              type="password" 
              placeholder="sk-..." 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono text-sm"
            />
            {error && <p className="text-destructive text-sm font-medium">{error}</p>}
            <button 
              onClick={handleStartAnalysis}
              disabled={isAnalyzing || !apiKey}
              className="w-full bg-primary text-primary-foreground rounded-xl px-4 py-3 font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isAnalyzing ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing Private GitHub Data...</>
              ) : (
                <><Sparkles className="w-5 h-5" /> Analyze My Repositories</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Results Section */}
      {results && results.topProjectName && (
        <div className="space-y-8 animate-fade-in-up max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Your Next $1k/mo Venture</h2>
            <p className="text-lg text-muted-foreground">We appraised {repos.length} of your repositories. Here is the undeniable winner.</p>
          </div>
          
          <div className="bg-card border border-border rounded-2xl p-8 shadow-xl shadow-primary/5 flex flex-col relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 border-b border-border/50 pb-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-primary/20 text-primary p-2.5 rounded-xl">
                    <Code className="w-6 h-6" />
                  </div>
                  <h3 className="text-3xl font-bold">{results.topProjectName}</h3>
                </div>
                <div className="flex flex-wrap gap-3 mt-4">
                  <span className="text-sm font-semibold bg-secondary px-4 py-1.5 rounded-full text-secondary-foreground border border-border flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Target: {results.targetNiche}
                  </span>
                  <span className="text-sm font-semibold bg-secondary px-4 py-1.5 rounded-full text-secondary-foreground border border-border flex items-center gap-1.5">
                    🤑 {results.monetizationModel}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground uppercase tracking-widest font-semibold mb-1">Completeness</p>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-extrabold text-primary">{results.completenessScore}</span>
                    <span className="text-xl text-muted-foreground font-bold pb-1">/100</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative z-10 mb-10 bg-destructive/10 border border-destructive/20 rounded-xl p-6">
              <h4 className="text-sm font-bold text-destructive uppercase tracking-wider mb-2 flex items-center gap-2">
                The Brutal Truth
              </h4>
              <p className="text-foreground/90 font-medium italic">{results.brutalTruth}</p>
            </div>
            
            <div className="relative z-10">
              <h4 className="text-xl font-bold mb-6 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-primary" />
                Weekend Launch Plan
              </h4>
              <div className="grid gap-4">
                {results.weekendLaunchPlan.map((step: string, i: number) => {
                  // Split the step prefix (e.g. "Step 1: ") from the content
                  const splitIdx = step.indexOf(':');
                  const prefix = splitIdx > -1 ? step.substring(0, splitIdx + 1) : `Step ${i+1}:`;
                  const content = splitIdx > -1 ? step.substring(splitIdx + 1).trim() : step;
                  
                  return (
                    <div key={i} className="bg-secondary/30 rounded-xl p-5 border border-border/50 flex gap-4 items-start">
                      <div className="bg-primary text-primary-foreground font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                        {i+1}
                      </div>
                      <div>
                        <span className="font-semibold text-foreground block mb-1">{prefix}</span>
                        <span className="text-muted-foreground leading-relaxed">{content}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-12">
            <button 
              onClick={() => {setResults(null); setApiKey("");}}
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors text-sm font-medium px-4 py-2 rounded-full hover:bg-secondary"
            >
              Analyze different repos <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
