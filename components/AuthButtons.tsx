"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Github, Loader2, LogOut, LayoutDashboard, ArrowRight } from "lucide-react";

export function LoginButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <button disabled
        className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-medium
                   bg-zinc-900 text-zinc-500 border border-white/10 cursor-not-allowed">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading...
      </button>
    );
  }

  if (session) {
    return (
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold text-white
                     bg-zinc-900 border border-white/15
                     hover:bg-zinc-800 hover:border-white/25
                     transition-all duration-150"
        >
          <LayoutDashboard className="w-4 h-4" />
          Go to Dashboard
        </Link>
        <button
          onClick={() => signOut()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign out
        </button>
      </div>
    );
  }

  /* ── CTA matching reference: dark rounded-full, clean border ── */
  return (
    <button
      id="cta-signin-btn"
      onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
      className="inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-semibold text-white
                 bg-zinc-900 border border-white/15
                 hover:bg-zinc-800 hover:border-white/25
                 active:scale-[0.98]
                 transition-all duration-150"
    >
      Scan My Private Repos
      <ArrowRight className="w-4 h-4 text-zinc-400" />
    </button>
  );
}
