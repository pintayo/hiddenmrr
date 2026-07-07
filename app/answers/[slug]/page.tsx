import { getAllAnswers, getAnswer } from '@/lib/answers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return getAllAnswers().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = getAnswer(slug);
  if (!a) return {};
  return {
    title: a.metaTitle,
    description: a.metaDescription,
    keywords: a.keywords,
    alternates: { canonical: `https://www.hiddenmrr.com/answers/${a.slug}` },
    openGraph: {
      title: a.metaTitle,
      description: a.metaDescription,
      type: 'article',
      publishedTime: a.datePublished,
      modifiedTime: a.dateModified,
    },
  };
}

export default async function AnswerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = getAnswer(slug);
  if (!a) notFound();

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.question,
    description: a.metaDescription,
    datePublished: a.datePublished,
    dateModified: a.dateModified,
    author: { '@type': 'Organization', name: 'HiddenMRR', url: 'https://www.hiddenmrr.com' },
    publisher: { '@type': 'Organization', name: 'HiddenMRR', url: 'https://www.hiddenmrr.com' },
    mainEntityOfPage: `https://www.hiddenmrr.com/answers/${a.slug}`,
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: a.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <main className="w-full bg-zinc-950 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <article className="max-w-3xl mx-auto px-6 py-16">
        <nav className="text-sm text-zinc-500 mb-8">
          <Link href="/answers" className="hover:text-zinc-300 transition-colors">
            Answers
          </Link>{' '}
          <span className="mx-1">/</span> {a.question}
        </nav>

        <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
          {a.question}
        </h1>
        <p className="mt-3 text-sm text-zinc-500">
          Updated {a.dateModified} · by HiddenMRR
        </p>

        <div className="mt-8 rounded-xl border border-primary/30 bg-primary/10 p-6">
          <p className="text-xs font-black uppercase tracking-widest text-primary mb-2">
            Short answer
          </p>
          <p className="text-zinc-100 leading-relaxed">{a.tldr}</p>
        </div>

        {a.sections.map((s) => (
          <section key={s.h2} className="mt-12">
            <h2 className="text-xl md:text-2xl font-bold text-zinc-100">{s.h2}</h2>
            {s.body.map((p, i) => (
              <p key={i} className="mt-4 text-zinc-400 leading-relaxed">
                {p}
              </p>
            ))}
          </section>
        ))}

        <section className="mt-12">
          <h2 className="text-xl md:text-2xl font-bold text-zinc-100">
            Frequently asked questions
          </h2>
          {a.faq.map((f) => (
            <div key={f.q} className="mt-6 border-b border-white/5 pb-6">
              <h3 className="text-lg font-semibold text-zinc-100">{f.q}</h3>
              <p className="mt-3 text-zinc-400 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </section>

        <div className="mt-14 rounded-xl border border-white/10 bg-zinc-900 p-8 text-center">
          <p className="text-lg font-bold text-white">
            Which of your abandoned repos is closest to money?
          </p>
          <p className="mt-2 text-zinc-400">
            HiddenMRR scans your GitHub and scores each project on real B2B revenue
            potential. First scan is free, no card. €9 one-time for unlimited scans.
          </p>
          <Link
            href="/"
            className="inline-block mt-5 px-6 py-3 rounded-lg bg-primary text-black font-black hover:opacity-90 transition-opacity"
          >
            Run a free scan
          </Link>
        </div>

        {a.related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg font-bold text-zinc-100">Related answers</h2>
            <ul className="mt-4 space-y-2">
              {a.related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/answers/${r.slug}`}
                    className="text-primary hover:underline"
                  >
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    </main>
  );
}
