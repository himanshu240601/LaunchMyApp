create extension if not exists pgcrypto;

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  role text not null,
  message text not null,
  rating integer not null check (rating between 1 and 5),
  export_name text,
  show_on_landing boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

create policy "Anyone can read landing reviews"
on public.reviews
for select
using (show_on_landing = true);

create policy "Authenticated users can submit reviews"
on public.reviews
for insert
to authenticated
with check (auth.uid() = user_id or user_id is null);
