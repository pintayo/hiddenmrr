"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Github, Loader2, LogOut } from "lucide-react";

export function LoginButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <button disabled className="bg-primary/50 text-primary-foreground rounded-full px-8 py-4 text-lg font-semibold flex flex-row items-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin" /> Loading
      </button>
    );
  }

  if (session) {
    return (
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link 
          href="/dashboard"
          className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-4 text-lg font-semibold shadow-[0_0_30px_-5px] shadow-primary/50 transition-all hover:scale-105"
        >
          Go to Dashboard
        </Link>
        <button 
          onClick={() => signOut()}
          className="text-muted-foreground hover:text-foreground flex items-center gap-2 px-4 py-2 mt-4 sm:mt-0"
        >
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
      className="bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 rounded-full px-10 py-5 text-xl font-bold shadow-[0_0_40px_-5px] shadow-primary/60 transition-all hover:scale-105 active:scale-95 flex flex-row items-center gap-3"
    >
      <Github className="w-6 h-6" /> Scan My Private Repos &rarr;
    </button>
  );
}
