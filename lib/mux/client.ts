// Capa de abstracción de video.
// La UI SIEMPRE importa desde aquí, nunca directamente de '@mux/*'.
// Si en el futuro cambiamos de proveedor, este es el único archivo que cambia.
//
// Los videos master/originales NUNCA se consideran almacenados solo en Mux —
// deben existir también en storage propio (ej. Supabase Storage o similar)
// antes de subirse a Mux para transcodificación. Ver content-placeholder-map.md.

export interface VideoAsset {
  provider: 'mux';
  playbackId: string;
  posterUrl: string;
  aspectRatio: '16:9' | '9:16' | '4:5';
}

export function getVideoStreamUrl(asset: VideoAsset): string {
  // Mux HLS playback URL
  return `https://stream.mux.com/${asset.playbackId}.m3u8`;
}

export function getVideoPosterUrl(asset: VideoAsset): string {
  return asset.posterUrl;
}

// Uso esperado en componentes: <VideoPlayer asset={video} /> — nunca <mux-player> directo.
