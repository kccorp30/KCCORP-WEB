// Second independent Next.js root layout — see app/[locale]/layout.tsx
// for the detailed explanation. /studio sits outside the [locale]
// segment (it has no site locale of its own; Sanity Studio's UI is
// always English), so it needs its own <html>/<body> shell. There is
// no shared app/layout.tsx above either of these two root layouts.
export default function StudioRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
