-- =========================================================
-- 003_identity.sql
-- KCCORP Marine Cloud — Migration 003
-- =========================================================

-- ---------------------------------------------------------
-- profiles — identidad de UNA persona, separada de cualquier
-- organización. Extiende auth.users (mismo id).
-- ---------------------------------------------------------
create table profiles (
  id                uuid primary key references auth.users(id) on delete cascade,
  full_name         text,
  phone             text,
  email             text,
  avatar_url        text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create trigger trg_profiles_updated_at
  before update on profiles
  for each row execute function set_updated_at();

alter table profiles enable row level security;

-- Trigger: crea automáticamente el profile cuando alguien se
-- registra en auth.users (patrón estándar de Supabase)
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ---------------------------------------------------------
-- Ahora sí completamos la FK que quedó pendiente en 002
-- ---------------------------------------------------------
alter table organizations
  add constraint fk_organizations_created_by
  foreign key (created_by) references profiles(id);

-- ---------------------------------------------------------
-- organization_memberships — vínculo persona↔organización con rol
-- ---------------------------------------------------------
create type membership_role as enum (
  'kcc_admin', 'company_owner', 'company_admin', 'manager', 'technician', 'customer'
);

create table organization_memberships (
  id                uuid primary key default gen_random_uuid(),
  profile_id        uuid not null references profiles(id) on delete cascade,
  organization_id   uuid not null references organizations(id) on delete cascade,
  role              membership_role not null,
  status            text not null default 'active' check (status in ('active','invited','suspended')),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (profile_id, organization_id, role)
);

create trigger trg_org_memberships_updated_at
  before update on organization_memberships
  for each row execute function set_updated_at();

create index idx_org_memberships_org_role on organization_memberships(organization_id, role) where status = 'active';
create index idx_org_memberships_profile on organization_memberships(profile_id) where status = 'active';

alter table organization_memberships enable row level security;

-- ---------------------------------------------------------
-- technician_relationships — datos del técnico dentro de una organización
-- ---------------------------------------------------------
create table technician_relationships (
  id                uuid primary key default gen_random_uuid(),
  profile_id        uuid not null references profiles(id) on delete cascade,
  organization_id   uuid not null references organizations(id) on delete cascade,
  skills            text[] not null default '{}',
  certifications    jsonb not null default '[]'::jsonb,
  service_areas     jsonb not null default '[]'::jsonb,
  pay_type          text not null default 'hourly' check (pay_type in ('hourly','daily')),
  pay_rate          numeric(10,2),
  hire_date         date,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (profile_id, organization_id)
);

create trigger trg_technician_rel_updated_at
  before update on technician_relationships
  for each row execute function set_updated_at();

alter table technician_relationships enable row level security;

-- ---------------------------------------------------------
-- customer_relationships — datos del cliente dentro de una organización
-- ---------------------------------------------------------
create table customer_relationships (
  id                    uuid primary key default gen_random_uuid(),
  profile_id            uuid not null references profiles(id) on delete cascade,
  organization_id       uuid not null references organizations(id) on delete cascade,
  billing_address       text,
  notes                 text,
  loyalty_points_balance integer not null default 0,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  unique (profile_id, organization_id)
);

create trigger trg_customer_rel_updated_at
  before update on customer_relationships
  for each row execute function set_updated_at();

alter table customer_relationships enable row level security;
