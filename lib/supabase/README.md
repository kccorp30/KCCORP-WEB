# Supabase — proyecto compartido con KCC Marine Cloud

Decisión (confirmada): el sitio web y KCC Marine Cloud usan el
MISMO proyecto Supabase — no dos proyectos separados con puente
por API.

Esto significa:
- Las env vars de este proyecto (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`)
  apuntan al mismo proyecto que usa la app de KCC Marine Cloud.
- La tabla `leads` vive en ese proyecto compartido — ver
  `/mnt/user-data/outputs/migrations/004_leads.sql`.
- El sitio web SOLO usa la service role key en Route Handlers
  server-side (`/api/leads`, `/api/media-upload`) — nunca se expone
  al navegador. Esto no cambia por compartir proyecto; es la misma
  regla de seguridad que ya teníamos.
- El sitio web NO tiene (ni debe tener) acceso a las tablas
  operativas de Marine Cloud (work_orders, vessels, invoices, etc.)
  — RLS restringe el acceso por rol igual que dentro de la app.
  Compartir proyecto no significa compartir permisos.

Conversión lead → customer → vessel → work_order: se hace desde el
panel de KCC Admin (Marine Cloud), no desde el código del sitio
web. El sitio web solo escribe en `leads`.
