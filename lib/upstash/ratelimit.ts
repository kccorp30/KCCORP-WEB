import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Server-only. Nunca importar esto desde un componente cliente.

const redis = Redis.fromEnv();

// Protección progresiva (sección 30 del brief):
// Nivel 1 — límite por IP, silencioso, sin fricción visible.
// Nivel 2 — si se excede repetidamente, se marca la IP como "suspicious"
//           en Redis con TTL; los siguientes endpoints protegidos pueden
//           consultar ese flag y, solo entonces, exigir un paso adicional
//           (ej. Turnstile) — no implementado todavía, solo el gancho.
export const requestServiceLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '10 m'),
  prefix: 'ratelimit:request-service',
});

export const contactFormLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '10 m'),
  prefix: 'ratelimit:contact',
});

export const mediaUploadLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 m'),
  prefix: 'ratelimit:media-upload',
});

export async function flagSuspicious(ip: string) {
  await redis.set(`suspicious:${ip}`, true, { ex: 60 * 60 * 24 }); // 24h
}

export async function isSuspicious(ip: string): Promise<boolean> {
  return Boolean(await redis.get(`suspicious:${ip}`));
}
