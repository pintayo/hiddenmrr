import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

import { getUserProfile } from "@/app/actions";
export const maxDuration = 60;
import ClientDashboard from "./ClientDashboard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const profile = await getUserProfile();

  return (
    <div className="flex-1 p-6 md:p-10 w-full max-w-5xl mx-auto space-y-8">

      {/* ── Dashboard header ─────────────────────────── */}
      <header className="flex items-center justify-between pb-6 border-b border-white/[0.07]">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
            Profit Dashboard
          </h1>
          <p className="text-sm text-white/35 mt-0.5">
            Discover hidden MRR in your private repositories.
          </p>
        </div>

        {/* Avatar */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-br from-primary to-accent">
            <img
              src={session.user?.image || ''}
              alt="Avatar"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>
      </header>

      <ClientDashboard hasPaid={profile?.has_paid || false} userId={session.user.id} />
    </div>
  );
}

