create type public.app_role as enum ('member', 'admin');
create type public.announcement_category as enum ('announcement', 'release');

create table public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role public.app_role not null default 'member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 120),
  content text not null check (char_length(content) between 1 and 10000),
  category public.announcement_category not null default 'announcement',
  version text check (version is null or char_length(version) <= 32),
  pinned boolean not null default false,
  published boolean not null default false,
  published_at timestamptz,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index announcements_feed_idx
  on public.announcements (pinned desc, published_at desc, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_user_roles_updated_at
before update on public.user_roles
for each row execute function public.set_updated_at();

create trigger set_announcements_updated_at
before update on public.announcements
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = (select auth.uid())
      and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

alter table public.user_roles enable row level security;
alter table public.announcements enable row level security;

create policy "Users can read their own role"
on public.user_roles for select
to authenticated
using (user_id = (select auth.uid()));

create policy "Admins can manage roles"
on public.user_roles for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Members can read published announcements"
on public.announcements for select
to authenticated
using (published or (select public.is_admin()));

create policy "Admins can insert announcements"
on public.announcements for insert
to authenticated
with check ((select public.is_admin()) and created_by = (select auth.uid()));

create policy "Admins can update announcements"
on public.announcements for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Admins can delete announcements"
on public.announcements for delete
to authenticated
using ((select public.is_admin()));

grant usage on schema public to authenticated;
grant select on public.user_roles to authenticated;
grant select, insert, update, delete on public.announcements to authenticated;
