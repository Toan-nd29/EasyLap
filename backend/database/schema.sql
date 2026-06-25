-- Enable UUID extension
create extension if not exists "pgcrypto";

-- 1. Profiles Table
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text unique not null,
  role text not null default 'user',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table laptops (
  id uuid primary key default gen_random_uuid(),
  external_id text unique,
  original_csv_row text,
  name text not null,
  brand text not null,
  type_name text,
  price numeric not null check (price >= 0),
  price_usd numeric,
  price_vnd numeric,
  price_vnd_million numeric,
  cpu text not null,
  cpu_score numeric default 5 check (cpu_score >= 0 and cpu_score <= 10),
  ram integer not null check (ram > 0),
  ssd integer default 0,
  hdd integer default 0,
  total_storage_gb integer default 0,
  storage_type text,
  storage_category text,
  gpu text,
  gpu_type text,
  dedicated_gpu boolean default false,
  screen text,
  inches numeric,
  x_res integer,
  y_res integer,
  ppi numeric,
  ips boolean default false,
  touch_screen boolean default false,
  screen_score numeric default 5 check (screen_score >= 0 and screen_score <= 10),
  operating_system text,
  weight numeric,
  battery_score numeric default 5 check (battery_score >= 0 and battery_score <= 10),
  upgradeable boolean default false,
  warranty text default '12 tháng',
  suitable_for text[] default '{}',
  tags text[] default '{}',
  pros text[] default '{}',
  cons text[] default '{}',
  image_url text,
  shop_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 3. Quiz Questions Table
create table quiz_questions (
  id uuid primary key default gen_random_uuid(),
  question_key text unique not null,
  question text not null,
  question_group text not null,
  type text not null check (type in ('single', 'multiple')),
  options jsonb not null,
  display_order integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 4. Quiz Attempts Table
create table quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  user_group text not null,
  common_answers jsonb not null,
  specific_answers jsonb,
  summary text,
  recommended_config jsonb,
  created_at timestamp with time zone default now()
);

-- 5. Recommendations Table
create table recommendations (
  id uuid primary key default gen_random_uuid(),
  quiz_attempt_id uuid not null references quiz_attempts(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  laptop_id uuid not null references laptops(id) on delete cascade,
  final_score integer not null check (final_score >= 0 and final_score <= 100),
  match_reasons text[] default '{}',
  trade_offs text[] default '{}',
  created_at timestamp with time zone default now()
);

-- 6. Favorite Laptops Table
create table favorite_laptops (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  laptop_id uuid not null references laptops(id) on delete cascade,
  created_at timestamp with time zone default now(),
  unique(user_id, laptop_id)
);

-- Row Level Security (RLS) setup
alter table profiles enable row level security;
alter table laptops enable row level security;
alter table quiz_questions enable row level security;
alter table quiz_attempts enable row level security;
alter table recommendations enable row level security;
alter table favorite_laptops enable row level security;

-- Policies for Profiles
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Policies for Laptops
create policy "Anyone authenticated can view active laptops" on laptops for select using (auth.role() = 'authenticated');
create policy "Only admins can modify laptops" on laptops for all using (
  exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);

-- Policies for Quiz Questions
create policy "Anyone authenticated can view active quiz questions" on quiz_questions for select using (auth.role() = 'authenticated' and is_active = true);
create policy "Only admins can modify quiz questions" on quiz_questions for all using (
  exists (select 1 from profiles where profiles.id = auth.uid() and profiles.role = 'admin')
);

-- Policies for Quiz Attempts
create policy "Users can view own quiz attempts" on quiz_attempts for select using (auth.uid() = user_id);
create policy "Users can insert own quiz attempts" on quiz_attempts for insert with check (auth.uid() = user_id);

-- Policies for Recommendations
create policy "Users can view own recommendations" on recommendations for select using (auth.uid() = user_id);
create policy "Users can insert own recommendations" on recommendations for insert with check (auth.uid() = user_id);

-- Policies for Favorite Laptops
create policy "Users can view own favorites" on favorite_laptops for select using (auth.uid() = user_id);
create policy "Users can insert own favorites" on favorite_laptops for insert with check (auth.uid() = user_id);
create policy "Users can delete own favorites" on favorite_laptops for delete using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'user');
  return new;
end;
$$;

-- Revoke execute from public for security
revoke execute on function public.handle_new_user() from public;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Indexes for Laptops
create index if not exists idx_laptops_brand on laptops(brand);
create index if not exists idx_laptops_price on laptops(price);
create index if not exists idx_laptops_ram on laptops(ram);
create index if not exists idx_laptops_ssd on laptops(ssd);
create index if not exists idx_laptops_gpu_type on laptops(gpu_type);
create index if not exists idx_laptops_suitable_for on laptops using gin(suitable_for);
create index if not exists idx_laptops_tags on laptops using gin(tags);

create extension if not exists pg_trgm;
create index if not exists idx_laptops_name_trgm on laptops using gin(name gin_trgm_ops);
