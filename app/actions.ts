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

export async function analyzeSelectedRepos(
  repoFullNames: string[], 
  apiKey: string, 
  provider: 'openai' | 'anthropic' | 'google' = 'openai',
  model: string = 'gpt-4o-mini'
) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) throw new Error("Unauthorized");
  if (!apiKey) throw new Error("No API key provided");

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

  const systemPrompt = `You are a ruthless, highly successful indie hacker and software appraiser. The user is feeding you README.md and package.json files from their abandoned side projects. Your job is to identify the single project with the fastest path to Monthly Recurring Revenue (MRR). Ignore technical debt; focus purely on market demand, B2B potential, and monetization.

You MUST return a RAW JSON object. 
- NO markdown formatting.
- NO backticks.
- NO preamble or conversational text.
- ONLY the JSON object.

Structure:
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
}`;

  const userPrompt = `Repositories Data:\n${JSON.stringify(reposData, null, 2)}`;

  let rawContent = "";

  try {
    if (provider === 'openai') {
      const openai = new OpenAI({ apiKey });
      const completion = await openai.chat.completions.create({
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" }
      });
      rawContent = completion.choices[0].message.content || '{}';
    } 
    else if (provider === 'anthropic') {
      const anthropic = new Anthropic({ apiKey });
      const message = await anthropic.messages.create({
        model: model,
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      });
      if (message.content[0].type === 'text') {
        rawContent = message.content[0].text;
      }
    } 
    else if (provider === 'google') {
      const genAI = new GoogleGenerativeAI(apiKey);
      const googleModel = genAI.getGenerativeModel({ model: model });
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
    } catch (e) {
      console.error("Failed to parse AI response:", rawContent);
      throw new Error("The AI returned an invalid response format. Please try again.");
    }

    // Persist to Supabase
    if (result.topProjectName) {
      const { error: saveError } = await supabaseAdmin
        .from('analyses')
        .insert({
          user_id: session.user.id,
          top_project_name: result.topProjectName,
          completeness_score: result.completenessScore,
          target_niche: result.targetNiche,
          monetization_model: result.monetizationModel,
          brutal_truth: result.brutalTruth,
          launch_plan: result.weekendLaunchPlan
        });
      
      if (saveError) console.error("Error saving analysis to Supabase:", saveError);
    }

    return result;
  } catch (error: any) {
    console.error("AI API Error:", error);
    
    const isQuotaError = error.status === 429 || error.message?.includes('429');

    if (isQuotaError) {
      if (provider === 'google') {
        throw new Error("Google API Error: Quota Exceeded. You are either hitting the free-tier limit (20 requests/day) or trying to use a Pro model without billing enabled in Google AI Studio. Switch to Gemini Flash or enable billing.");
      } else if (provider === 'openai') {
        throw new Error("OpenAI Error: Quota Exceeded. Your OpenAI account has run out of credits or you need to add a payment method at platform.openai.com.");
      } else if (provider === 'anthropic') {
        throw new Error("Anthropic Error: Quota Exceeded. Please check your console.anthropic.com billing dashboard to ensure you have active credits.");
      }
    }

    if (error.status === 401 || error.name === 'AuthenticationError') {
      throw new Error("Invalid API Key. Please check your key and try again.");
    } else {
      throw new Error(error.message || "Failed to analyze repositories. Please try again later.");
    }
  }
}
