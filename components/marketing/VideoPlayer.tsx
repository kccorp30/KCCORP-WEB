'use client';

import MuxPlayer from '@mux/mux-player-react';

// BUG REAL #2 del hero (ver reporte): un <video src="....m3u8"> nativo
// SOLO reproduce HLS en Safari — en Chrome/Firefox/Edge no pasa nada,
// sin ningún error visible. mux-player-react ya maneja HLS.js por
// debajo en los navegadores que lo necesitan. Es el único componente
// del sitio que debe reproducir video de Mux — igual que ya decía el
// comentario en lib/mux/client.ts (nunca <video> directo), que hasta
// ahora ningún componente respetaba en la práctica.
//
// playbackId, no videoUrl completa — mux-player arma la URL de stream
// internamente, así no duplicamos esa lógica acá.
export function VideoPlayer({
  playbackId,
  className,
  ariaLabel,
  objectFit = 'cover',
}: {
  playbackId: string;
  className?: string;
  ariaLabel?: string;
  objectFit?: 'cover' | 'contain';
}) {
  return (
    <MuxPlayer
      playbackId={playbackId}
      streamType="on-demand"
      autoPlay="muted"
      muted
      loop
      playsInline
      preload="auto"
      thumbnailTime={0}
      aria-label={ariaLabel}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        objectFit,
        // Fondo decorativo, sin controles — oculta la barra de
        // controles completa vía la custom property documentada de
        // mux-player, en vez de superponer algo encima con CSS frágil.
        '--controls': 'none',
      }}
    />
  );
}
