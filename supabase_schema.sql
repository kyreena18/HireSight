-- Resume Management Schema for HireSight

-- Create resumes table
create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  file_name text not null,
  file_url text not null,
  file_size bigint not null,
  file_type text not null check (file_type in ('pdf', 'docx', 'doc')),
  upload_date timestamptz not null default now(),
  status text not null default 'uploaded' check (status in ('uploaded', 'parsing', 'parsed', 'analyzed', 'error')),
  tags text[] default array[]::text[],
  parsed_data jsonb,
  analysis_data jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.resumes enable row level security;

-- Policy: Users can view their own resumes
create policy "Users can view own resumes"
on public.resumes
for select
using (auth.uid() = user_id);

-- Policy: Users can insert their own resumes
create policy "Users can insert own resumes"
on public.resumes
for insert
with check (auth.uid() = user_id);

-- Policy: Users can update their own resumes
create policy "Users can update own resumes"
on public.resumes
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Policy: Users can delete their own resumes
create policy "Users can delete own resumes"
on public.resumes
for delete
using (auth.uid() = user_id);

-- Policy: Recruiters can view all resumes (if role is recruiter)
create policy "Recruiters can view all resumes"
on public.resumes
for select
using (
  exists (
    select 1 from public.profiles
    where profiles.id = auth.uid()
    and profiles.role = 'recruiter'
  )
);

-- Trigger to update updated_at timestamp
create or replace function public.set_resumes_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists handle_resumes_updated_at on public.resumes;

create trigger handle_resumes_updated_at
before update on public.resumes
for each row
execute procedure public.set_resumes_updated_at();

-- Create index for faster queries
create index if not exists idx_resumes_user_id on public.resumes(user_id);
create index if not exists idx_resumes_status on public.resumes(status);
create index if not exists idx_resumes_upload_date on public.resumes(upload_date desc);




