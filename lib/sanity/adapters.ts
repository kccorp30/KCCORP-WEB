import { urlForImage } from './image';
import { pickLocale } from './fetch-with-fallback';
import { getVideoStreamUrl } from '@/lib/mux/client';

// Resolves a `mediaAsset` object (image OR Mux video) into the flat
// { imageUrl?, videoUrl? } shape that MediaSurface/ProductScreenshot
// already expect — components built in Sprint 2/3 don't change.
// Mux guarda el aspect_ratio real del asset (ej. "9:16", "16:9") en
// el campo `data` que ya pedimos en la query — esto es lo que permite
// que el hero se adapte solo, sin que el editor de Sanity tenga que
// configurar layout/CSS a mano (pedido explícito de esta implementación).
function classifyVideoAspect(data: any): 'portrait' | 'landscape' | null {
  const raw = data?.aspect_ratio;
  if (!raw || typeof raw !== 'string' || !raw.includes(':')) return null;
  const [w, h] = raw.split(':').map(Number);
  if (!w || !h) return null;
  return w < h ? 'portrait' : 'landscape';
}

export function resolveMedia(media: any): {
  imageUrl?: string;
  videoUrl?: string;
  videoPlaybackId?: string;
  videoAspect?: 'portrait' | 'landscape' | null;
} {
  if (!media) return {};
  if (media.type === 'video' && media.video?.asset?.playbackId) {
    const playbackId = media.video.asset.playbackId;
    return {
      videoPlaybackId: playbackId,
      videoUrl: getVideoStreamUrl({ provider: 'mux', playbackId, posterUrl: '', aspectRatio: '16:9' }),
      videoAspect: classifyVideoAspect(media.video.asset.data),
    };
  }
  if (media.type === 'image' && media.image) {
    return { imageUrl: urlForImage(media.image).width(1600).url() };
  }
  return {};
}

export function adaptSanityService(raw: any, locale: string) {
  return {
    slug: raw.slug,
    num: raw.num ?? '',
    title: pickLocale(raw.title, locale),
    spec: pickLocale(raw.shortDescription, locale),
    color: '#12233A', // Sanity services don't carry a placeholder color — real media takes over via imageUrl below
    icon: raw.icon ?? 'wrench',
    description: pickLocale(raw.fullContent, locale) || pickLocale(raw.shortDescription, locale),
    ...resolveMedia(raw.heroMedia),
  };
}

export function adaptSanityProject(raw: any, locale: string) {
  return {
    slug: raw.slug,
    index: raw.index ?? '',
    title: pickLocale(raw.title, locale),
    vessel: [raw.vesselMake, raw.vesselModel].filter(Boolean).join(' ') || raw.vesselName || '',
    location: [raw.region, raw.country].filter(Boolean).join(', '),
    year: raw.vesselYear ? String(raw.vesselYear) : '',
    services: (raw.services ?? []).map((s: any) => s.slug),
    tags: (raw.services ?? []).map((s: any) => pickLocale(s.title, locale)),
    color: '#1C2C40',
    problem: pickLocale(raw.problem, locale),
    diagnosis: pickLocale(raw.diagnosis, locale),
    solution: pickLocale(raw.solution, locale),
    equipmentInstalled: raw.installedEquipment ?? [],
    result: pickLocale(raw.result, locale),
    ...resolveMedia(raw.coverImage),
    videoUrl: resolveMedia(raw.heroVideo).videoUrl ?? resolveMedia(raw.coverImage).videoUrl,
    videoPlaybackId: resolveMedia(raw.heroVideo).videoPlaybackId ?? resolveMedia(raw.coverImage).videoPlaybackId,
  };
}

export function adaptSanityLocation(raw: any, locale: string) {
  return {
    slug: raw.slug,
    country: raw.country,
    primaryCity: raw.primaryCity,
    coordinates: raw.coordinates,
    isServiceRegionOnly: raw.isServiceRegionOnly,
    description: pickLocale(raw.description, locale),
    servicesAvailable: (raw.servicesAvailable ?? []).map((s: any) => s.slug),
  };
}
