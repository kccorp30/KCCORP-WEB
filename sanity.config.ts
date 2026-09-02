import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { presentationTool } from 'sanity/presentation';
import { visionTool } from '@sanity/vision';
import { muxInput } from 'sanity-plugin-mux-input';
import { schemaTypes } from './sanity/schemas';
import { structure } from './sanity/structure';
import { presentationLocations } from './sanity/presentation';

export default defineConfig({
  name: 'kccorp',
  title: 'KCCORP Content',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  basePath: '/studio',
  plugins: [
    structureTool({ structure }), // edición estructurada — sigue existiendo tal cual, sin cambios
    presentationTool({
      previewUrl: {
        // ROOT CAUSE encontrado: `previewUrl.draftMode` está deprecado
        // en la versión instalada de `sanity` (redirige a
        // `previewMode`, y sus propios tipos marcan `disable`/`check`
        // como "API todavía no implementada" incluso bajo el shape
        // viejo). El shape deprecado probablemente nunca conectaba
        // correctamente con la máquina de estados interna que
        // Presentation usa para resolver la URL de preview — lo que
        // explica por qué el iframe cargaba el sitio pero draft mode
        // nunca quedaba realmente activo, y por lo tanto VisualEditing
        // nunca se montaba (ver VisualEditingWrapper: solo se monta si
        // isPreview es true).
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
      resolve: presentationLocations,
    }),
    muxInput(), // video uploads, backed by the same Mux abstraction used elsewhere (lib/mux/client.ts)
    visionTool(), // GROQ playground — useful for KCC's dev partner, not customer-facing
  ],
  schema: { types: schemaTypes },
});
