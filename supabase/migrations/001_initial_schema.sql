-- Grace Fund initial schema

create extension if not exists "pgcrypto";

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  goal_amount numeric(12, 2),
  status text not null default 'active' check (status in ('active', 'completed', 'draft')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.donations (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references public.campaigns (id) on delete set null,
  donor_name text not null,
  donor_email text not null,
  amount numeric(12, 2) not null check (amount > 0),
  message text,
  is_anonymous boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists donations_created_at_idx on public.donations (created_at desc);
create index if not exists donations_donor_email_idx on public.donations (donor_email);
create index if not exists donations_campaign_id_idx on public.donations (campaign_id);

alter table public.campaigns enable row level security;
alter table public.donations enable row level security;

create policy "Anyone can view active campaigns"
  on public.campaigns
  for select
  using (status = 'active');

create policy "Authenticated users can manage campaigns"
  on public.campaigns
  for all
  to authenticated
  using (true)
  with check (true);

create policy "Anyone can submit donations"
  on public.donations
  for insert
  with check (true);

create policy "Authenticated users can view donations"
  on public.donations
  for select
  to authenticated
  using (true);

insert into public.campaigns (title, description, goal_amount, status)
values
  (
    'General Ministry Fund',
    'Support worship, pastoral care, and day-to-day church operations.',
    50000,
    'active'
  ),
  (
    'Building & Facilities',
    'Help maintain and improve our church facilities for the community.',
    75000,
    'active'
  ),
  (
    'Missions & Outreach',
    'Fund local outreach programs and global mission partnerships.',
    30000,
    'active'
  )
on conflict do nothing;
