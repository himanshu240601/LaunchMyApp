create extension if not exists pgcrypto;

create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  email text not null,
  company text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'reviewed', 'closed')),
  created_at timestamptz not null default now()
);

alter table public.feedback enable row level security;

create policy "Authenticated users can submit feedback"
on public.feedback
for insert
to authenticated
with check (auth.uid() = user_id or user_id is null);

create policy "Authenticated users can read their own feedback"
on public.feedback
for select
to authenticated
using (auth.uid() = user_id);
