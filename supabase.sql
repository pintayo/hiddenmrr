create table public.profiles (
  id text primary key, -- Text to match GitHub ID from NextAuth
  email text,
  has_paid boolean default false,
  lemon_squeezy_order_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.profiles enable row level security;

-- Setup RLS so only owners can read/update their own profile, or using service key
create policy "Users can view own profile" on public.profiles for select using (auth.uid()::text = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid()::text = id);
