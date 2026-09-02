-- =========================================================
-- 004_leads.sql
-- KCCORP Marine Cloud — Migration 004
-- =========================================================
-- Decisión: leads vive en el MISMO proyecto Supabase que el resto
-- de KCC Marine Cloud (no un proyecto separado). Esto es lo que
-- permite que un lead se convierta realmente en customer → vessel
-- → work_order sin sincronizar dos bases.
--
-- IMPORTANTE: esta tabla NO tiene organization_id. Un lead nace
-- sin compañía asignada — es KCC Admin quien decide a cuál
-- compañía va, por eso vive fuera del modelo multi-tenant estándar
-- hasta el momento de la conversión.

create table leads (
  id                          uuid primary key default gen_random_uuid(),
  reference_code              text not null unique,   -- KCC-REQ-XXXX, generado por la app
  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now(),
  status                      text not null default 'new'
    check (status in ('new','contacted','qualified','estimate','booked','lost','converted')),

  country                     text,
  city                        text,
  service_type                text,
  vessel_make                 text,
  vessel_model                text,
  vessel_year                 integer,
  vessel_name                 text,
  hin                         text,
  description                 text,

  name                        text,
  phone                       text,
  email                       text,
  preferred_contact_method    text,

  source                      text,
  campaign                    text,
  medium                      text,
  utm_source                  text,
  utm_campaign                text,
  utm_medium                  text,
  utm_content                 text,
  referrer                    text,
  landing_page                text,

  media                       jsonb not null default '[]'::jsonb,
  notes                       text,

  -- Conversión — se llenan SOLO cuando KCC Admin asigna el lead
  -- a una compañía. FKs reales ahora que comparten proyecto.
  assigned_organization_id    uuid references organizations(id),
  marine_cloud_customer_id    uuid references profiles(id),
  marine_cloud_vessel_id      uuid,   -- FK se agrega cuando exista la tabla vessels (migración 005+)
  marine_cloud_work_order_id  uuid,   -- FK se agrega cuando exista la tabla work_orders

  converted_at                timestamptz,
  converted_by                uuid references profiles(id)
);

create trigger trg_leads_updated_at
  before update on leads
  for each row execute function set_updated_at();

create index idx_leads_status on leads(status);
create index idx_leads_assigned_org on leads(assigned_organization_id) where assigned_organization_id is not null;
create index idx_leads_created_at on leads(created_at desc);

alter table leads enable row level security;

-- RLS: nadie lee/escribe directo salvo kcc_admin. La inserción
-- pública desde el sitio web NUNCA pasa por aquí con la anon key —
-- pasa por un Route Handler server-side con la service role key,
-- que ignora RLS por diseño (igual que si fuera un proyecto aparte).
create policy "kcc_admin_full_access_leads"
  on leads for all
  using (is_kcc_admin())
  with check (is_kcc_admin());

-- ---------------------------------------------------------
-- Nota de conversión (para cuando construyamos la UI):
-- convertir un lead = crear/vincular profile (customer) +
-- crear vessel + crear work_order, todo en una transacción,
-- y luego marcar status='converted', converted_at, converted_by,
-- assigned_organization_id, y los tres marine_cloud_*_id.
-- Esto se hace desde el panel de administración (KCC Admin),
-- nunca automáticamente.
-- ---------------------------------------------------------
