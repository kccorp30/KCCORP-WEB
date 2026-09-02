-- =========================================================
-- 002_organizations.sql
-- KCCORP Marine Cloud — Migration 002
-- =========================================================

-- ---------------------------------------------------------
-- organizations — el tenant raíz (la compañía de botes)
-- ---------------------------------------------------------
create table organizations (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  legal_name        text,
  slug              text not null unique,
  branding_json     jsonb not null default '{}'::jsonb,  -- { logo_url, accent_color, tagline }
  status            text not null default 'active' check (status in ('active','suspended','archived')),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  created_by        uuid,  -- referencia a profiles(id), FK se agrega en 003 (orden de creación)
  deleted_at        timestamptz
);

create trigger trg_organizations_updated_at
  before update on organizations
  for each row execute function set_updated_at();

create index idx_organizations_status on organizations(status) where deleted_at is null;

-- ---------------------------------------------------------
-- organization_locations — sucursales / marinas / bases operativas
-- ---------------------------------------------------------
create table organization_locations (
  id                uuid primary key default gen_random_uuid(),
  organization_id   uuid not null references organizations(id) on delete cascade,
  name              text not null,
  address           text,
  marina_name       text,
  lat               double precision,
  lng               double precision,
  is_primary        boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  deleted_at        timestamptz
);

create trigger trg_org_locations_updated_at
  before update on organization_locations
  for each row execute function set_updated_at();

create index idx_org_locations_org on organization_locations(organization_id) where deleted_at is null;

-- Solo una ubicación primaria por organización
create unique index uq_org_locations_one_primary
  on organization_locations(organization_id)
  where is_primary = true and deleted_at is null;

-- ---------------------------------------------------------
-- organization_settings — configuración regional, 1:1 con organization
-- ---------------------------------------------------------
create table organization_settings (
  organization_id   uuid primary key references organizations(id) on delete cascade,
  timezone          text not null default 'America/New_York',
  currency          text not null default 'USD',
  locale            text not null default 'es',
  units_system      text not null default 'imperial' check (units_system in ('imperial','metric')),
  tax_config        jsonb not null default '{}'::jsonb,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create trigger trg_org_settings_updated_at
  before update on organization_settings
  for each row execute function set_updated_at();

-- ---------------------------------------------------------
-- RLS: se ACTIVA aquí mismo (sin políticas todavía) para que
-- Supabase deniegue todo acceso por API por defecto. Las
-- políticas específicas (quién puede leer/escribir qué) se
-- agregan en el pase 033, pero la tabla nunca queda expuesta
-- mientras tanto — esto corrige el plan original, que dejaba
-- una ventana insegura entre esta migración y la 033.
-- ---------------------------------------------------------
alter table organizations enable row level security;
alter table organization_locations enable row level security;
alter table organization_settings enable row level security;
