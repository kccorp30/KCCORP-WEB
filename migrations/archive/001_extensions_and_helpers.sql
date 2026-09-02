-- =========================================================
-- 001_extensions_and_helpers.sql
-- KCCORP Marine Cloud — Migration 001
-- =========================================================
-- Ejecutar primero. Requiere permisos de owner del proyecto
-- (normal en el SQL Editor de Supabase).

-- Extensiones necesarias
create extension if not exists "pgcrypto";   -- gen_random_uuid()
create extension if not exists "pg_trgm";    -- búsqueda de texto (nombres, HIN) más adelante

-- ---------------------------------------------------------
-- Trigger genérico para mantener updated_at
-- ---------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ---------------------------------------------------------
-- current_organization_id()
-- Lee la organización activa desde una variable de sesión
-- que el backend (Edge Function / API) fija por request con:
--   SET LOCAL app.current_organization_id = '<uuid>';
-- después de validar que auth.uid() tiene membresía activa
-- en esa organización. Esto evita ambigüedad cuando un
-- usuario pertenece a más de una organización.
-- ---------------------------------------------------------
create or replace function current_organization_id()
returns uuid
language sql
stable
as $$
  select nullif(current_setting('app.current_organization_id', true), '')::uuid;
$$;

-- ---------------------------------------------------------
-- is_kcc_admin()
-- true si el usuario autenticado tiene una membresía activa
-- con rol kcc_admin en cualquier organización (acceso cross-tenant).
-- SECURITY DEFINER porque necesita leer organization_memberships
-- sin quedar bloqueada por la propia RLS de esa tabla.
-- ---------------------------------------------------------
create or replace function is_kcc_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from organization_memberships
    where profile_id = auth.uid()
      and role = 'kcc_admin'
      and status = 'active'
  );
$$;

-- Nota: is_kcc_admin() se crea aquí pero solo funcionará después
-- de la migración 003 (organization_memberships). Postgres permite
-- crear la función referenciando una tabla que aún no existe
-- SOLO si es un cuerpo de función (no se valida hasta el primer
-- uso) — si tu editor se queja, ejecuta esta función de nuevo
-- después de 003_identity.sql.
