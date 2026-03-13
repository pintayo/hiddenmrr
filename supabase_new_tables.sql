-- Table for persisting repository analyses
create table public.analyses (
  id uuid default gen_random_uuid() primary key,
  user_id text references public.profiles(id),
  top_project_name text not null,
  completeness_score integer,
  target_niche text,
  monetization_model text,
  brutal_truth text,
  launch_plan jsonb, -- Storing the array as JSONB
  full_results jsonb, -- Complete AI response for historical reference
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.analyses enable row level security;

-- RLS Policies
create policy "Users can view own analyses" on public.analyses for select using (user_id = auth.uid()::text);
create policy "Service role can manage all analyses" on public.analyses for all using (true);
