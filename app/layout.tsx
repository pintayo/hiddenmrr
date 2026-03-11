import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'HiddenMRR | Find the $1,000/mo SaaS Hiding in Your GitHub',
  description: 'Stop starting new projects. Connect your GitHub, let AI appraise your abandoned code, and get a step-by-step blueprint to launch your most profitable repo this weekend.',
  openGraph: {
    title: 'HiddenMRR | Find the $1,000/mo SaaS Hiding in Your GitHub',
    description: 'Stop starting new projects. Connect your GitHub, let AI appraise your abandoned code, and get a step-by-step blueprint to launch your most profitable repo this weekend.',
    images: [{ url: '/og-image.jpg' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HiddenMRR | Find the $1,000/mo SaaS Hiding in Your GitHub',
    description: 'Stop starting new projects. Connect your GitHub, let AI appraise your abandoned code, and get a step-by-step blueprint to launch your most profitable repo this weekend.',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} bg-background text-foreground antialiased min-h-screen flex flex-col`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
