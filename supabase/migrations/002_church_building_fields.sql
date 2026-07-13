-- Church building campaign fields

alter table public.donations
  add column if not exists donor_phone text,
  add column if not exists payment_method text,
  add column if not exists purpose text default 'Church Building Project',
  add column if not exists receipt_url text;

alter table public.donations
  alter column donor_email drop not null;

update public.campaigns
set
  title = 'Church Building Project',
  description = 'Constructing a new house of worship for Halwot Emmanuel United Church.',
  goal_amount = 25000000,
  status = 'active'
where title = 'General Ministry Fund';

delete from public.campaigns
where title in ('Building & Facilities', 'Missions & Outreach');

insert into public.campaigns (title, description, goal_amount, status)
select
  'Church Building Project',
  'Constructing a new house of worship for Halwot Emmanuel United Church.',
  25000000,
  'active'
where not exists (
  select 1 from public.campaigns where title = 'Church Building Project'
);
