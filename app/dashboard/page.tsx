import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/app/actions";
import ClientDashboard from "./ClientDashboard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/");
  }

  const profile = await getUserProfile();

  return (
    <div className="flex-1 p-6 md:p-12 w-full max-w-7xl mx-auto space-y-8">
      <header className="flex items-center justify-between border-b border-border/50 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Profit Dashboard</h1>
          <p className="text-muted-foreground mt-1">Discover hidden MRR in your private repositories.</p>
        </div>
        <div className="flex items-center gap-4">
          <img 
            src={session.user?.image || ''} 
            alt="Avatar" 
            className="w-10 h-10 rounded-full border border-border"
          />
        </div>
      </header>
      
      <ClientDashboard hasPaid={profile?.has_paid || false} userId={session.user.id} />
    </div>
  );
}
