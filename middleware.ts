import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // /studio is explicitly excluded — it has no locale of its own and
  // must never be processed by next-intl's locale-prefix rewriting
  // (it now also has its own independent root layout — see
  // app/studio/layout.tsx and app/[locale]/layout.tsx).
  matcher: ['/((?!api|_next|_vercel|studio|.*\\..*).*)'],
};
