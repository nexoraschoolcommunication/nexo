-- ============================================================
-- Nexo — schema.sql
-- Run once against your Supabase Postgres instance.
-- Enables Row-Level Security on every table; no table is left open.
-- ============================================================

create extension if not exists "uuid-ossp";

-- ---------- USERS ----------
-- Supabase already provides auth.users. This is the public profile row.
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  headline text,
  avatar_url text,
  profession text,
  intent text check (intent in ('learn','teach','hybrid')) default 'hybrid',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles are publicly readable"
  on public.profiles for select
  using (true);

create policy "users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ---------- SKILL CATALOG ----------
create table public.skill_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  slug text not null unique
);

create table public.skills (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid not null references public.skill_categories(id) on delete cascade,
  name text not null,
  slug text not null unique,
  icon text
);

alter table public.skill_categories enable row level security;
alter table public.skills enable row level security;

create policy "catalog is publicly readable"
  on public.skill_categories for select using (true);
create policy "skills are publicly readable"
  on public.skills for select using (true);
-- No insert/update/delete policies for anon/authenticated: catalog is
-- managed only via the service-role key from a trusted admin context.

-- ---------- USER SKILLS (the skill matrix) ----------
create table public.user_skills (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  level text check (level in ('Beginner','Intermediate','Advanced')) not null,
  mode text check (mode in ('learning','teaching')) not null,
  created_at timestamptz not null default now(),
  unique(user_id, skill_id, mode)
);

alter table public.user_skills enable row level security;

create policy "user skills are publicly readable"
  on public.user_skills for select using (true);

create policy "users manage their own skills"
  on public.user_skills for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------- CONNECTIONS ----------
create table public.connections (
  id uuid primary key default uuid_generate_v4(),
  requester_id uuid not null references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  status text check (status in ('pending','accepted','declined')) default 'pending',
  created_at timestamptz not null default now(),
  unique(requester_id, recipient_id)
);

alter table public.connections enable row level security;

create policy "participants can view their connections"
  on public.connections for select
  using (auth.uid() = requester_id or auth.uid() = recipient_id);

create policy "users can create outgoing connection requests"
  on public.connections for insert
  with check (auth.uid() = requester_id);

create policy "participants can update connection status"
  on public.connections for update
  using (auth.uid() = requester_id or auth.uid() = recipient_id);

-- ---------- MESSAGES ----------
create table public.messages (
  id uuid primary key default uuid_generate_v4(),
  connection_id uuid not null references public.connections(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

create policy "participants can read messages on their connection"
  on public.messages for select
  using (
    exists (
      select 1 from public.connections c
      where c.id = connection_id
        and (c.requester_id = auth.uid() or c.recipient_id = auth.uid())
        and c.status = 'accepted'
    )
  );

create policy "participants can send messages on their connection"
  on public.messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from public.connections c
      where c.id = connection_id
        and (c.requester_id = auth.uid() or c.recipient_id = auth.uid())
        and c.status = 'accepted'
    )
  );

-- ---------- MEETINGS ----------
create table public.meetings (
  id uuid primary key default uuid_generate_v4(),
  connection_id uuid not null references public.connections(id) on delete cascade,
  created_by uuid not null references public.profiles(id) on delete cascade,
  meet_url text not null,
  started_at timestamptz not null default now(),
  ended_at timestamptz
);

alter table public.meetings enable row level security;

create policy "participants can view meetings on their connection"
  on public.meetings for select
  using (
    exists (
      select 1 from public.connections c
      where c.id = connection_id
        and (c.requester_id = auth.uid() or c.recipient_id = auth.uid())
    )
  );

create policy "participants can create meetings on their connection"
  on public.meetings for insert
  with check (
    auth.uid() = created_by
    and exists (
      select 1 from public.connections c
      where c.id = connection_id
        and (c.requester_id = auth.uid() or c.recipient_id = auth.uid())
        and c.status = 'accepted'
    )
  );

-- ---------- SESSION REFLECTIONS (AI Study Hub input) ----------
create table public.session_reflections (
  id uuid primary key default uuid_generate_v4(),
  meeting_id uuid not null references public.meetings(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text check (role in ('teacher','learner')) not null,
  topics_covered text,
  homework_assigned text,
  takeaways text,
  created_at timestamptz not null default now()
);

alter table public.session_reflections enable row level security;

create policy "users manage their own reflections"
  on public.session_reflections for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------- RATE LIMITING SUPPORT ----------
-- Tracks login attempts per identifier (email/IP hash) for server-side throttling.
-- Written only by the service role from the auth API route, never from the client.
create table public.login_attempts (
  id uuid primary key default uuid_generate_v4(),
  identifier text not null,
  attempted_at timestamptz not null default now()
);

alter table public.login_attempts enable row level security;
-- Intentionally no policies: only the service-role key (server-side) can touch this table.

create index idx_login_attempts_identifier_time
  on public.login_attempts (identifier, attempted_at desc);

create index idx_skills_category on public.skills(category_id);
create index idx_user_skills_user on public.user_skills(user_id);
create index idx_messages_connection on public.messages(connection_id, created_at);
