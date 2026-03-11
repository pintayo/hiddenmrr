'use server';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import OpenAI from "openai";

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

export async function fetchPrivateRepos() {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) throw new Error("Unauthorized");

  // Fetch repositories
  const res = await fetch('https://api.github.com/user/repos?visibility=private&sort=updated&per_page=10', {
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

export async function analyzeSelectedRepos(repoFullNames: string[], apiKey: string) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) throw new Error("Unauthorized");
  if (!apiKey) throw new Error("No API key provided");

  const openai = new OpenAI({ apiKey });

  const reposData = await Promise.all(repoFullNames.map(async (fullName) => {
    // Fetch critical files: README and package.json/requirements.txt
    const headers = { Authorization: `Bearer ${session.accessToken}` };
    
    const [repoReq, readmeReq, pkgReq] = await Promise.all([
      fetch(`https://api.github.com/repos/${fullName}`, { headers }),
      fetch(`https://api.github.com/repos/${fullName}/readme`, { headers }).catch(() => null),
      fetch(`https://api.github.com/repos/${fullName}/contents/package.json`, { headers }).catch(() => null)
    ]);

    const repo = await repoReq.json().catch(() => ({}));
    
    // Decode base64
    let readme = "";
    if (readmeReq?.ok) {
        const body = await readmeReq.json();
        if (body.content) readme = Buffer.from(body.content, 'base64').toString('utf-8');
    }

    let pkg = "";
    if (pkgReq?.ok) {
        const body = await pkgReq.json();
        if (body.content) pkg = Buffer.from(body.content, 'base64').toString('utf-8');
    }

    return {
      name: repo.name || fullName,
      description: repo.description,
      language: repo.language,
      readme: readme.substring(0, 1500), // Truncate to save tokens
      package_json: pkg.substring(0, 500)
    };
  }));

  const prompt = `You are a ruthless, highly successful indie hacker and software appraiser. The user is feeding you README.md and package.json files from their abandoned side projects. Your job is to identify the single project with the fastest path to Monthly Recurring Revenue (MRR). Ignore technical debt; focus purely on market demand, B2B potential, and monetization.

You MUST return a raw JSON object with this exact structure (no markdown formatting, just parseable JSON):
{
"topProjectName": "String",
"completenessScore": "Number 1-100",
"targetNiche": "String (Be ultra-specific, e.g., 'B2B SEO Agencies')",
"monetizationModel": "String (e.g., '$49 Lifetime Deal' or '$15/mo SaaS')",
"brutalTruth": "String (1 sentence on why they abandoned it and why they need to get over it)",
"weekendLaunchPlan": [
"Step 1: Actionable technical step to finish the MVP",
"Step 2: Exact marketing action (where to post, what to say)",
"Step 3: How to acquire the first paying customer"
]
}

  Repositories Data:
  ${JSON.stringify(reposData, null, 2)}`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Cost efficient for BYOK
      messages: [
        { role: "system", content: "You output strict JSON. No markdown backticks." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(completion.choices[0].message.content || '{}');
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    
    if (error.status === 401) {
      throw new Error("Invalid API Key. Please check your OpenAI API key and try again.");
    } else if (error.status === 429) {
      throw new Error("API Quota Exceeded. Please check your OpenAI billing details or add credits.");
    } else {
      throw new Error("Failed to analyze repositories. Please try again later.");
    }
  }
}
