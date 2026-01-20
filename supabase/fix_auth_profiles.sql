-- 1. Fix RLS Policy for Profiles
-- Allow users to insert their own profile row (required if client-side creation is used)
create policy "Users can insert their own profile" 
on profiles 
for insert 
with check (auth.uid() = id);

-- 2. Create a Trigger for Automatic Profile Creation (Best Practice)
-- This ensures a profile is created even if the client-side fails or if the user is not yet verified.

create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id, 
    new.email, 
    coalesce(new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'customer')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists to avoid conflicts
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
