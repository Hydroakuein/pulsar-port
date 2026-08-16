-- Replace the email address after creating the first user in Supabase Auth.
insert into public.user_roles (user_id, role)
select id, 'admin'::public.app_role
from auth.users
where email = 'admin@example.com'
on conflict (user_id) do update set role = excluded.role;
