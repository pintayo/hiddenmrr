import { LoginButton } from "@/components/AuthButtons";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-8 text-center sm:p-20 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-primary/15 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="z-10 max-w-4xl space-y-6 animate-fade-in-up">
        {/* Urgent Hook */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 text-destructive border border-destructive/20 text-sm font-semibold mb-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
          </span>
          Your dormant repos are losing money
        </div>

        <h1 className="text-5xl font-black tracking-tighter sm:text-7xl !leading-[1.1] text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/40">
          Find the <span className="text-primary italic">$1,000/mo SaaS</span> Hiding in Your GitHub Graveyard.
        </h1>
        
        <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
          Stop starting new projects. Connect your GitHub, let AI appraise your abandoned code, and get a step-by-step blueprint to launch your most profitable repo this weekend.
        </p>
        
        <div className="pt-10 flex flex-col items-center justify-center space-y-4">
          <LoginButton />
          
          {/* Trust Badge / Info */}
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground bg-secondary/50 px-4 py-2 rounded-full border border-border">
            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            100% Private. We never read your source code. BYOK (Bring Your Own Key) architecture.
          </div>
        </div>
      </div>
    </main>
  );
}
