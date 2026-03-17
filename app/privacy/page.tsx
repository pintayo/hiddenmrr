import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | HiddenMRR',
  description: 'Learn how HiddenMRR collects, uses, and protects your data.',
  alternates: {
    canonical: 'https://www.hiddenmrr.com/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <main className="flex-1 flex flex-col items-center bg-zinc-950 text-zinc-300 font-sans">
      <div className="w-full max-w-3xl px-6 py-20 sm:py-28">

        {/* Header */}
        <div className="mb-14">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Legal</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-zinc-500 text-sm">Last updated: March 17, 2026</p>
        </div>

        <div className="prose prose-sm prose-invert max-w-none space-y-10">

          {/* 1 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Who We Are</h2>
            <p>
              HiddenMRR is a product operated by <strong className="text-white">Pintayo Studio</strong>
              (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;). We provide an AI-powered
              platform that analyses GitHub repositories to surface B2B SaaS monetisation
              opportunities. Our website is{' '}
              <a href="https://www.hiddenmrr.com" className="text-primary hover:underline">
                https://www.hiddenmrr.com
              </a>
              . For any privacy-related questions please contact us at{' '}
              <a href="mailto:support@pintayo.com" className="text-primary hover:underline">
                support@pintayo.com
              </a>
              .
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Data We Collect</h2>
            <p className="mb-4">
              We only collect what is strictly necessary to provide the service.
            </p>
            <div className="rounded-2xl border border-white/5 bg-zinc-900/50 divide-y divide-white/5 overflow-hidden">
              {[
                {
                  category: 'Account data',
                  detail:
                    'Name, email address, GitHub username, and profile avatar. Provided by GitHub during OAuth sign-in.',
                },
                {
                  category: 'Repository metadata',
                  detail:
                    'Repository names, descriptions, README content, and package.json files you explicitly select for analysis. We do not clone, copy, or persistently store your source code.',
                },
                {
                  category: 'Payment data',
                  detail:
                    'Order ID and payment status provided by our payment processor Lemon Squeezy. We never see or store your card details.',
                },
                {
                  category: 'Usage data',
                  detail:
                    'Pages visited, features used, and error logs — collected to improve reliability.',
                },
                {
                  category: 'Session cookies',
                  detail:
                    'Secure, HTTP-only session cookies managed by NextAuth.js to keep you signed in. No third-party advertising cookies are used.',
                },
              ].map(({ category, detail }) => (
                <div key={category} className="px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <p className="text-white font-semibold text-sm">{category}</p>
                  <p className="sm:col-span-2 text-zinc-400 text-sm">{detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Your OpenAI API Key (BYOK)</h2>
            <p>
              HiddenMRR operates a Bring Your Own Key model. Your OpenAI API key is submitted
              directly from your browser for the duration of an analysis session and is
              <strong className="text-white"> never written to our database</strong>. It exists in
              server memory only for the time required to complete a request, after which it is
              discarded. You retain full control and can revoke the key from your OpenAI account at
              any time.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. How We Use Your Data</h2>
            <ul className="list-disc list-outside ml-5 space-y-2 text-zinc-400">
              <li>To authenticate you via GitHub OAuth and maintain your session.</li>
              <li>To perform AI analysis of the repositories you select.</li>
              <li>To verify payment status and gate access to paid features.</li>
              <li>To send transactional emails (receipt, account notifications) — no marketing emails without explicit consent.</li>
              <li>To diagnose errors and improve service reliability.</li>
            </ul>
            <p className="mt-4">
              We do <strong className="text-white">not</strong> sell, rent, or broker your personal
              data to any third party.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Third-Party Services</h2>
            <div className="rounded-2xl border border-white/5 bg-zinc-900/50 divide-y divide-white/5 overflow-hidden">
              {[
                {
                  name: 'GitHub (OAuth)',
                  purpose: 'Authentication and repository metadata access.',
                  link: 'https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement',
                },
                {
                  name: 'Supabase',
                  purpose: 'Secure database storage of account and payment status.',
                  link: 'https://supabase.com/privacy',
                },
                {
                  name: 'Lemon Squeezy',
                  purpose: 'Payment processing. Operates as Merchant of Record.',
                  link: 'https://www.lemonsqueezy.com/privacy',
                },
                {
                  name: 'OpenAI',
                  purpose: 'AI analysis using your own API key. Subject to your OpenAI account terms.',
                  link: 'https://openai.com/policies/privacy-policy',
                },
                {
                  name: 'Vercel',
                  purpose: 'Hosting and edge infrastructure.',
                  link: 'https://vercel.com/legal/privacy-policy',
                },
              ].map(({ name, purpose }) => (
                <div key={name} className="px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <p className="text-white font-semibold text-sm">{name}</p>
                  <p className="sm:col-span-2 text-zinc-400 text-sm">{purpose}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Data Retention</h2>
            <p>
              Account data is retained for as long as your account is active. If you request
              deletion, we will permanently erase your personal data from our systems within{' '}
              <strong className="text-white">30 days</strong>, except where we are legally obliged
              to retain certain records (e.g. payment records for tax purposes, typically 7 years).
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Your Rights</h2>
            <p className="mb-4">Depending on your location you may have the right to:</p>
            <ul className="list-disc list-outside ml-5 space-y-2 text-zinc-400">
              <li><strong className="text-zinc-200">Access</strong> — request a copy of the personal data we hold about you.</li>
              <li><strong className="text-zinc-200">Rectification</strong> — ask us to correct inaccurate data.</li>
              <li><strong className="text-zinc-200">Erasure</strong> — request deletion of your account and associated data.</li>
              <li><strong className="text-zinc-200">Portability</strong> — receive your data in a structured, machine-readable format.</li>
              <li><strong className="text-zinc-200">Objection / Restriction</strong> — object to or restrict certain processing activities.</li>
              <li><strong className="text-zinc-200">Withdraw consent</strong> — at any time, where processing is based on consent.</li>
            </ul>
            <p className="mt-4">
              To exercise any right, email{' '}
              <a href="mailto:support@pintayo.com" className="text-primary hover:underline">
                support@pintayo.com
              </a>
              . We will respond within 30 days. EU/UK residents may also lodge a complaint with
              their local data protection authority.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. California Residents (CCPA)</h2>
            <p>
              California residents have the right to know what personal information we collect and
              how it is used, the right to delete personal information, and the right to opt out of
              the sale of personal information. We do not sell personal information. To exercise
              your rights, contact{' '}
              <a href="mailto:support@pintayo.com" className="text-primary hover:underline">
                support@pintayo.com
              </a>
              .
            </p>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">9. Cookies</h2>
            <p>
              We use only essential cookies required for authentication and security. We do not use
              advertising, tracking, or analytics cookies. You can disable cookies in your browser
              settings, but this will prevent you from signing in.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">10. Security</h2>
            <p>
              All data in transit is encrypted via TLS. Database records are encrypted at rest via
              Supabase. We follow industry-standard security practices including least-privilege
              access controls and regular dependency audits.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">11. Changes to This Policy</h2>
            <p>
              We may update this policy from time to time. We will notify registered users of
              material changes by email or via an in-app notice. The &ldquo;Last updated&rdquo;
              date at the top of this page always reflects the current version.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-xl font-bold text-white mb-3">12. Contact</h2>
            <p>
              For any questions about this Privacy Policy, contact Pintayo Studio at{' '}
              <a href="mailto:support@pintayo.com" className="text-primary hover:underline">
                support@pintayo.com
              </a>
              .
            </p>
          </section>

        </div>

        {/* Back link */}
        <div className="mt-16 pt-8 border-t border-white/5">
          <Link href="/" className="text-sm text-zinc-500 hover:text-primary transition-colors">
            ← Back to HiddenMRR
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 py-10 px-6">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
            © 2026 Pintayo Studio · Built for Builders
          </p>
          <div className="flex gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
            <Link href="/privacy" className="text-primary">Privacy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/support" className="hover:text-primary transition-colors">Support</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
