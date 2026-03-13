# HiddenMRR: Find the $1,000/mo SaaS Hiding in Your GitHub

**HiddenMRR** is a premium, AI-powered "ghost repository" appraiser. It scans your abandoned side projects, audits your code (via BYOK OpenAI), and identifies the highest-margin B2B opportunities hidden in your logic. 

Stop starting new projects. Connect your GitHub, let AI appraise your abandoned code, and get a step-by-step blueprint to launch your most profitable repo this weekend.

![HiddenMRR Hero](public/logo.png)

## ✨ Features

- **AI-Powered Revenue Discovery**: Uses GPT-4o to scan your `README.md`, `package.json`, and directory structure to identify business potential.
- **BYOK (Bring Your Own Key)**: Privacy-focused and cost-efficient. Users provide their own OpenAI key for the analysis.
- **Cinematic Experience**: High-fidelity "Repo Scan" simulation with Framer Motion animations to build tension and excitement.
- **Premium Bento Dashboard**: A high-end, data-driven interface for reviewing analysis results, completeness scores, and launch plans.
- **Secure Persistence**: Integrated with Supabase to persist user profiles and analysis history.
- **Conversion Optimized**: Mobile-first, "Vercel/Linear" deep dark mode aesthetic designed to justify a premium price point.
- **Secure Auth**: GitHub OAuth integration via NextAuth.js.

## 🛠 Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styles**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database**: [Supabase](https://supabase.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **AI**: [OpenAI SDK](https://github.com/openai/openai-node)
- **Payments**: [Lemon Squeezy](https://www.lemonsqueezy.com/)

## 🚀 Getting Started

### 1. Prerequisites

Ensure you have the following accounts and credentials:
- **GitHub OAuth App**: For authentication (requires `repo` scope).
- **Supabase**: A project with the schema provided in `supabase.sql` and `supabase_new_tables.sql`.
- **Lemon Squeezy**: A store with a configured product and webhook.
- **OpenAI**: An API key (for development analysis).

### 2. Environment Variables

Create a `.env` file in the root directory (refer to `.env.example`):

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_super_secret_string

# GitHub OAuth App
GITHUB_ID=your_github_oauth_client_id
GITHUB_SECRET=your_github_oauth_client_secret

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Lemon Squeezy
LEMON_SQUEEZY_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_LEMON_SQUEEZY_CHECKOUT_URL=your_checkout_url
```

### 3. Database Setup

Run the SQL found in `supabase.sql` and `supabase_new_tables.sql` within your Supabase SQL Editor to initialize the `profiles` and `analyses` tables.

### 4. Installation & Development

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

### 5. Build for Production

```bash
npm run build
npm run start
```

## 🔒 Privacy & Security

We take your IP seriously:
- **No Code Storage**: We never clone or store your repositories. We only read metadata via secure GitHub API calls.
- **Encrypted Keys**: Your OpenAI API Key is used only on the client side for analysis and is never persisted on our servers.
- **Secure Auth**: We use official GitHub OAuth flows to manage access.

## 📄 License

© 2026 Pintayo Studio. Built for Builders.
