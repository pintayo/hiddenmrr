import { getAllAnswers } from '@/lib/answers';
import Link from 'next/link';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Answers for founders with unfinished side projects | HiddenMRR',
  description:
    'Honest, practical answers to the questions technical founders ask about turning abandoned side projects and GitHub repos into revenue.',
  alternates: { canonical: 'https://www.hiddenmrr.com/answers' },
};

export default function AnswersHub() {
  const answers = getAllAnswers();
  return (
    <main className="w-full bg-zinc-950 font-sans">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
          Answers
        </h1>
        <p className="mt-4 text-zinc-400 leading-relaxed">
          Straight answers to the questions founders ask about unfinished side
          projects, pricing, and finding revenue in old code.
        </p>
        <ul className="mt-10 space-y-6">
          {answers.map((a) => (
            <li key={a.slug} className="rounded-xl border border-white/10 bg-zinc-900 p-6">
              <Link href={`/answers/${a.slug}`} className="group">
                <h2 className="text-lg font-bold text-zinc-100 group-hover:text-primary transition-colors">
                  {a.question}
                </h2>
                <p className="mt-2 text-zinc-400 leading-relaxed">{a.metaDescription}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
