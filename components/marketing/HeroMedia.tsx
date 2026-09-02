import { VideoPlayer } from './VideoPlayer';

interface HeroMediaProps {
  videoPlaybackId?: string;
  videoAspect?: 'portrait' | 'landscape' | null;
  imageUrl?: string;
}

// Composición cinematográfica de pantalla completa — restaurada a la
// composición anterior a pedido explícito (menos rígida que un split
// 42/58, la media se integra a todo el Hero en vez de vivir en su
// propia columna). El editor de Sanity nunca configura layout/CSS —
// el aspecto real del video (que Mux reporta) sigue decidiendo el
// tratamiento, eso SÍ se conserva.
//
// Landscape (16:9, 4:3, o sin metadata todavía): cubre todo el Hero,
// exactamente como en la versión original.
//
// Portrait (9:16): NO se estira ni se recorta agresivamente — un
// fondo de pantalla completa (la misma miniatura del video, agrandada
// y oscurecida) le da la sensación cinematográfica de fondo, y el
// video nítido se integra hacia el costado derecho de la escena, a su
// aspecto real, SIN forma de "tarjeta" (sin bordes redondeados, sin
// sombra, sin marco) — se funde con el degradado oscuro en vez de
// verse pegado encima.
export function HeroMedia({ videoPlaybackId, videoAspect, imageUrl }: HeroMediaProps) {
  if (videoPlaybackId && videoAspect === 'portrait') {
    return (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://image.mux.com/${videoPlaybackId}/thumbnail.jpg?width=480&time=1`}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-3xl brightness-[0.38] saturate-125"
        />
        <div className="absolute inset-0 flex items-center justify-end">
          <div className="relative h-[92%] md:h-full w-auto aspect-[9/16] max-w-[78%] md:max-w-[42%] lg:max-w-[38%] mr-0 md:mr-[4%]">
            <VideoPlayer playbackId={videoPlaybackId} className="absolute inset-0 w-full h-full" ariaLabel="" objectFit="contain" />
          </div>
        </div>
      </>
    );
  }

  if (videoPlaybackId) {
    return <VideoPlayer playbackId={videoPlaybackId} className="absolute inset-0 w-full h-full" ariaLabel="" />;
  }

  if (imageUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />;
  }

  return (
    <div
      className="absolute inset-0"
      style={{ background: 'linear-gradient(180deg, #332921 0%, #1A2733 40%, #0D1A28 75%, #070E18 100%)' }}
    />
  );
}
