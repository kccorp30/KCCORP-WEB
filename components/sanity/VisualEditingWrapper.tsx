'use client';

import VisualEditing from 'next-sanity/visual-editing/client-component';

// SEGUNDO HALLAZGO REAL de este diagnóstico: antes se usaba
// `@sanity/visual-editing/react` directo, sin adaptador de historial
// — ese paquete necesita que VOS conectes el router de Next.js a mano
// (prop `history`) para que la sincronización de navegación y el
// refresh-sin-publicar funcionen dentro de App Router. Sin eso, aunque
// los overlays llegaran a aparecer, el "cambiá el título sin publicar
// y mirá cómo se actualiza el preview" del punto 9 no tenía garantía
// de funcionar.
//
// `next-sanity/visual-editing/client-component` es el wrapper oficial
// para Next.js — ya trae ese adaptador resuelto (según sus propios
// tipos: "The history adapter is already implemented"), además de
// detectar basePath/trailingSlash solo.
export function VisualEditingWrapper() {
  return <VisualEditing />;
}
