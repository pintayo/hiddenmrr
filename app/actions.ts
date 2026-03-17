'use server';



import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function getUserProfile() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const { data } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  return data;
}

export async function getUserAnalyses() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return [];

  const { data } = await supabaseAdmin
    .from('analyses')
    .select('id, top_project_name, completeness_score, target_niche, monetization_model, brutal_truth, is_free_scan, created_at, full_results')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })
    .limit(20);

  return data || [];
}

export async function fetchUserRepos() {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) throw new Error("Unauthorized");

  // Fetch repositories (up to 100, public and private)
  const res = await fetch('https://api.github.com/user/repos?type=owner&sort=updated&per_page=100', {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      Accept: 'application/vnd.github.v3+json'
    }
  });

  if (!res.ok) throw new Error("Failed to fetch repos");
  
  const repos = await res.json();
  
  // Minimal representation for UI
  return repos.map((r: any) => ({
    id: r.id,
    name: r.name,
    full_name: r.full_name,
    description: r.description,
    language: r.language,
    updated_at: r.updated_at
  }));
}

export async function analyzeSelectedRepos(
  repoFullNames: string[],
  apiKey: string,
  provider: 'openai' | 'anthropic' | 'google' = 'openai',
  model: string = 'gpt-4o-mini'
) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken || !session?.user?.id) throw new Error("Unauthorized");

  // SERVER-SIDE PAYWALL CHECK with free tier support
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('has_paid, free_scans_used, single_scans_purchased')
    .eq('id', session.user.id)
    .single();

  const freeScansUsed = profile?.free_scans_used || 0;
  const singleScans = profile?.single_scans_purchased || 0;
  const FREE_SCAN_LIMIT = 1;
  const isFreeEligible = !profile?.has_paid && repoFullNames.length === 1 && freeScansUsed < FREE_SCAN_LIMIT;
  const isSingleScanEligible = !profile?.has_paid && repoFullNames.length === 1 && singleScans > freeScansUsed;

  if (!profile?.has_paid && !isFreeEligible && !isSingleScanEligible) {
    if (repoFullNames.length > 1) {
      throw new Error("Multi-repo scan requires the Pro plan ($19). Or grab a single deep scan for $9.");
    }
    throw new Error("You've used your free scan. Grab another deep scan for $9, or go Pro for $19 (unlimited).");
  }

  // For free scans, use the server-side managed Gemini API key (no BYOK friction)
  const useServerKey = isFreeEligible && !apiKey;
  const serverApiKey = process.env.GEMINI_API_KEY;

  let effectiveApiKey = apiKey;
  let effectiveProvider = provider;
  let effectiveModel = model;

  if (useServerKey) {
    if (!serverApiKey) throw new Error("Free scan is temporarily unavailable. Please provide your own API key.");
    effectiveApiKey = serverApiKey;
    effectiveProvider = 'google';
    effectiveModel = 'gemini-2.5-flash';
  }

  if (!effectiveApiKey) throw new Error("No API key provided. Enter your API key or use your free scan.");


  const reposData = await Promise.all(repoFullNames.map(async (fullName) => {
    // Fetch critical files: README and package.json/requirements.txt
    const headers = { Authorization: `Bearer ${session.accessToken}` };
    
    const [repoReq, readmeReq, pkgReq] = await Promise.all([
      fetch(`https://api.github.com/repos/${fullName}`, { headers }),
      fetch(`https://api.github.com/repos/${fullName}/readme`, { headers }).catch(() => null),
      fetch(`https://api.github.com/repos/${fullName}/contents/package.json`, { headers }).catch(() => null)
    ]);

    let repo: any = {};
    try {
      if (repoReq.ok) repo = await repoReq.json();
    } catch {
      // Non-critical: repo metadata unavailable, continue with defaults
    }

    // Decode base64
    let readme = "";
    try {
      if (readmeReq?.ok) {
          const body = await readmeReq.json();
          if (body && body.content) readme = Buffer.from(body.content, 'base64').toString('utf-8');
      }
    } catch {
      // Non-critical: README unavailable
    }

    let pkg = "";
    try {
      if (pkgReq?.ok) {
          const body = await pkgReq.json();
          if (body && body.content) pkg = Buffer.from(body.content, 'base64').toString('utf-8');
      }
    } catch {
      // Non-critical: package.json unavailable
    }

    return {
      name: repo.name || fullName,
      description: repo.description || "",
      language: repo.language || "Unknown",
      readme: (readme || "No README provided").substring(0, 1500),
      package_json: (pkg || "{}").substring(0, 500)
    };
  }));

  const systemPrompt = `You are a ruthless, highly successful indie hacker and software appraiser. The user is feeding you README.md and package.json files from their abandoned side projects. Your job is to rank every single project based on market demand, B2B potential, and monetization — then deliver a brutally actionable market readiness plan for the winner.

You MUST return a RAW JSON object with the following structure:
{
  "winner": {
    "topProjectName": "String",
    "completenessScore": Number (1-100),
    "targetNiche": "String (Be ultra-specific)",
    "monetizationModel": "String",
    "brutalTruth": "String (1 sentence)",
    "weekendLaunchPlan": ["Step 1", "Step 2", "Step 3"]
  },
  "marketReadiness": {
    "mustFix": [
      { "item": "Short title (e.g. Add Stripe billing)", "reason": "1 sentence why this blocks launch", "effort": "hours|days|week" }
    ],
    "cutFromMVP": [
      { "feature": "Feature name to skip", "reason": "1 sentence why it can wait" }
    ],
    "goToMarket": [
      { "step": Number (1-based), "title": "Short action title", "detail": "2-3 sentences of specific, actionable instructions. Include concrete platforms, tools, or strategies.", "milestone": "What success looks like after this step" }
    ]
  },
  "runnerUps": [
    {
      "projectName": "String",
      "score": Number,
      "niche": "String",
      "shortReason": "1 sentence on why it has potential but lost to the winner."
    }
  ],
  "leaderboard": [
    { "projectName": "String", "score": Number }
  ]
}

MARKET READINESS RULES:
- mustFix: List 3-5 CRITICAL blockers only. These are things that absolutely prevent charging money (e.g. no auth, no billing, no deploy, critical bugs). Be specific to what you see in the code/README.
- cutFromMVP: List 3-5 features the dev should NOT build yet. Kill scope creep. Be opinionated.
- goToMarket: List 5-7 concrete steps from current state to first paying customer. Be ultra-specific: name real platforms (Product Hunt, Indie Hackers, X/Twitter, cold email), real tools (Stripe, Vercel, Resend), and real tactics. No generic advice.
- effort field must be one of: "hours", "days", "week"

- NO markdown formatting.
- NO backticks.
- NO preamble or conversational text.
- Rank EVERY repository passed to you.
- Ensure the runnerUps array has the 2nd and 3rd best projects.
- Include ALL remaining projects in the leaderboard array.
`;

  const userPrompt = `Repositories Data:\n${JSON.stringify(reposData, null, 2)}`;

  let rawContent = "";

  try {
    if (effectiveProvider === 'openai') {
      const openai = new OpenAI({ apiKey: effectiveApiKey });
      const completion = await openai.chat.completions.create({
        model: effectiveModel,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" }
      });
      rawContent = completion.choices[0].message.content || '{}';
    } 
    else if (effectiveProvider === 'anthropic') {
      const anthropic = new Anthropic({ apiKey: effectiveApiKey });
      const message = await anthropic.messages.create({
        model: effectiveModel,
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      });
      const firstBlock = message.content?.[0];
      if (firstBlock && firstBlock.type === 'text') {
        rawContent = firstBlock.text;
      }
      if (!rawContent) {
        throw new Error("Anthropic returned an empty response. Please try again.");
      }
    } 
    else if (effectiveProvider === 'google') {
      const genAI = new GoogleGenerativeAI(effectiveApiKey);
      const googleModel = genAI.getGenerativeModel({ model: effectiveModel || 'gemini-2.5-flash' });
      const result = await googleModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: systemPrompt + "\n\n" + userPrompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      });
      rawContent = result.response.text();
    }

    // Attempt to parse and clean markdown if provider didn't handle it
    let result;
    try {
      const cleanJson = rawContent.replace(/```json\n?|\n?```/g, '').trim();
      result = JSON.parse(cleanJson);
    } catch {
      throw new Error("The AI returned an invalid response format. Please try again.");
    }

    // Normalize: ensure arrays exist even if the LLM omitted them
    if (result.winner) {
      if (!Array.isArray(result.winner.weekendLaunchPlan)) {
        result.winner.weekendLaunchPlan = [];
      }
      if (typeof result.winner.completenessScore === 'string') {
        result.winner.completenessScore = parseInt(result.winner.completenessScore, 10) || 0;
      }
    }
    if (!Array.isArray(result.runnerUps)) result.runnerUps = [];
    if (!Array.isArray(result.leaderboard)) result.leaderboard = [];

    // Normalize marketReadiness
    if (!result.marketReadiness) result.marketReadiness = {};
    if (!Array.isArray(result.marketReadiness.mustFix)) result.marketReadiness.mustFix = [];
    if (!Array.isArray(result.marketReadiness.cutFromMVP)) result.marketReadiness.cutFromMVP = [];
    if (!Array.isArray(result.marketReadiness.goToMarket)) result.marketReadiness.goToMarket = [];

    // Persist to Supabase
    if (result.winner && result.winner.topProjectName) {
      const { error: saveError } = await supabaseAdmin
        .from('analyses')
        .insert({
          user_id: session.user.id,
          top_project_name: result.winner.topProjectName,
          completeness_score: Number(result.winner.completenessScore) || 0,
          target_niche: result.winner.targetNiche || '',
          monetization_model: result.winner.monetizationModel || '',
          brutal_truth: result.winner.brutalTruth || '',
          launch_plan: result.winner.weekendLaunchPlan,
          full_results: result,
          is_free_scan: isFreeEligible
        });

      if (saveError) {
        // Log only the error code/message, never the full result payload
        console.error("Supabase save error:", saveError.code, saveError.message);
      }

      // Increment free scan counter for free-tier users
      if (isFreeEligible) {
        await supabaseAdmin
          .from('profiles')
          .update({ free_scans_used: (profile?.free_scans_used || 0) + 1 })
          .eq('id', session.user.id);
      }
    }

    // Tag the result so the UI knows if this was a free scan
    result._isFreeScan = isFreeEligible;

    return result;
  } catch (error: any) {
    
    const status = error.status || error.statusCode;
    const isQuotaError = status === 429 || error.message?.includes('429');

    if (isQuotaError) {
      if (useServerKey) {
        throw new Error("Free scan is temporarily at capacity. Please try again in a few minutes, or use your own API key for instant results.");
      } else if (effectiveProvider === 'google') {
        throw new Error("Google API Error: Quota Exceeded. You are either hitting the free-tier limit or trying to use a Pro model without billing enabled in Google AI Studio. Switch to Gemini Flash or enable billing.");
      } else if (effectiveProvider === 'openai') {
        throw new Error("OpenAI Error: Quota Exceeded. Your OpenAI account has run out of credits or you need to add a payment method at platform.openai.com.");
      } else if (effectiveProvider === 'anthropic') {
        throw new Error("Anthropic Error: Quota Exceeded. Please check your console.anthropic.com billing dashboard to ensure you have active credits.");
      }
    }

    if (status === 401 || error.name === 'AuthenticationError') {
      if (useServerKey) {
        throw new Error("Free scan is temporarily unavailable. Please provide your own API key.");
      }
      throw new Error("Invalid API Key. Please check your key and try again.");
    }

    if (status === 404 || error.message?.includes('not found') || error.message?.includes('does not exist')) {
      throw new Error(`Model "${effectiveModel}" not found for ${effectiveProvider}. Please select a different model.`);
    }

    // Re-throw user-facing errors (from inner try blocks) as-is
    if (error.message && !error.status) {
      throw error;
    }

    throw new Error("Failed to analyze repositories. Please try again later.");
  }
}
