import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, MessageCircle, FileText, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Support | HiddenMRR',
  description: 'Get help with HiddenMRR. Contact our support team or find answers in our FAQ.',
  alternates: {
    canonical: 'https://www.hiddenmrr.com/support',
  },
};

const faqs = [
  {
    q: 'How do I get started after purchasing?',
    a: 'Sign in with your GitHub account, enter your OpenAI API key in the dashboard, select the repositories you want to analyse, and click Scan. Your report will be ready within minutes.',
  },
  {
    q: 'I paid but I cannot access the dashboard.',
    a: 'Payment confirmation can take up to 60 seconds to propagate. Try signing out and back in. If the issue persists after 5 minutes, email us with your order ID from the Lemon Squeezy receipt.',
  },
  {
    q: 'Where do I find my order ID?',
    a: 'Your order ID is in the receipt email sent by Lemon Squeezy immediately after purchase. It begins with "LS-" followed by a number.',
  },
  {
    q: 'The analysis returned an error. What should I do?',
    a: 'Ensure your OpenAI API key is valid and has sufficient credit. Check that the repository is accessible with your GitHub account. If the problem continues, include the error message in your support email.',
  },
  {
    q: 'Can I analyse private repositories?',
    a: 'Yes. We request the repo OAuth scope from GitHub, which grants read access to your private repositories. We never clone or store your code — only metadata is read during analysis.',
  },
  {
    q: 'What is your refund policy?',
    a: 'HiddenMRR is a digital product that is consumed immediately upon use. All sales are final once the service has been accessed. Please review our full Terms of Service before purchasing.',
  },
];

export default function SupportPage() {
  return (
    <main className="flex-1 flex flex-col items-center bg-zinc-950 text-zinc-300 font-sans">
      <div className="w-full max-w-3xl px-6 py-20 sm:py-28">

        {/* Header */}
        <div className="mb-14">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Help Centre</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tighter text-white mb-4">
            Support
          </h1>
          <p className="text-zinc-500 text-lg max-w-xl">
            We&rsquo;re a small team. We read every email and reply within one business day.
          </p>
        </div>

        {/* Contact card */}
        <div className="rounded-[2rem] border border-primary/20 bg-primary/5 p-8 mb-16 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-white font-bold text-lg mb-1">Email Support</h2>
            <p className="text-zinc-400 text-sm mb-3">
              For account issues, billing questions, or anything else — drop us a line.
            </p>
            <a
              href="mailto:support@pintayo.com"
              className="inline-flex items-center gap-2 rounded-xl bg-primary/10 border border-primary/20 px-5 py-2.5 text-sm font-bold text-primary hover:bg-primary/20 transition-all duration-150"
            >
              <Mail className="w-4 h-4" />
              support@pintayo.com
            </a>
          </div>
          <div className="flex items-center gap-2 text-zinc-600 text-xs font-medium shrink-0">
            <Clock className="w-4 h-4" />
            <span>Replies within 24 h</span>
          </div>
        </div>

        {/* What to include */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <MessageCircle className="w-5 h-5 text-zinc-500" />
            <h2 className="text-white font-bold text-xl">What to include in your email</h2>
          </div>
          <div className="rounded-2xl border border-white/5 bg-zinc-900/50 divide-y divide-white/5 overflow-hidden">
            {[
              { label: 'GitHub username', desc: 'The account you signed in with.' },
              { label: 'Order ID', desc: 'Found in your Lemon Squeezy receipt email (starts with LS-).' },
              { label: 'Description', desc: 'What you expected to happen vs. what actually happened.' },
              { label: 'Error message', desc: 'Copy and paste any error text shown on screen, if applicable.' },
            ].map(({ label, desc }) => (
              <div key={label} className="px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-1">
                <p className="text-white font-semibold text-sm">{label}</p>
                <p className="sm:col-span-2 text-zinc-400 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <FileText className="w-5 h-5 text-zinc-500" />
            <h2 className="text-white font-bold text-xl">Common Questions</h2>
          </div>
          <div className="space-y-0 divide-y divide-white/5 border-t border-white/5">
            {faqs.map(({ q, a }) => (
              <div key={q} className="py-6">
                <p className="text-white font-semibold text-sm mb-2">{q}</p>
                <p className="text-zinc-400 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Legal links */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <Link href="/" className="text-sm text-zinc-500 hover:text-primary transition-colors">
            ← Back to HiddenMRR
          </Link>
          <div className="flex gap-6 text-xs text-zinc-600">
            <Link href="/privacy" className="hover:text-zinc-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-zinc-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 py-10 px-6">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
            © 2026 Pintayo Studio · Built for Builders
          </p>
          <div className="flex gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link href="/support" className="text-primary">Support</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
