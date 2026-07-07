import fs from 'fs';
import path from 'path';

export type AnswerSection = { h2: string; body: string[] };
export type AnswerFaq = { q: string; a: string };
export type AnswerRelated = { slug: string; title: string };
export type Answer = {
  slug: string;
  question: string;
  metaTitle: string;
  metaDescription: string;
  datePublished: string;
  dateModified: string;
  keywords: string[];
  tldr: string;
  sections: AnswerSection[];
  faq: AnswerFaq[];
  related: AnswerRelated[];
};

const answersDir = path.join(process.cwd(), 'content', 'answers');

export function getAllAnswers(): Answer[] {
  return fs
    .readdirSync(answersDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(answersDir, f), 'utf8')) as Answer)
    .sort((a, b) => a.question.localeCompare(b.question));
}

export function getAnswer(slug: string): Answer | undefined {
  return getAllAnswers().find((a) => a.slug === slug);
}
