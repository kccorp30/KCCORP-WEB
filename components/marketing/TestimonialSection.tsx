import { fetchWithFallback } from '@/lib/sanity/fetch-with-fallback';
import { APPROVED_TESTIMONIALS_QUERY } from '@/lib/sanity/queries';
import { urlForImage } from '@/lib/sanity/image';

// Renders NOTHING if there are zero approved testimonials — no
// placeholder text ships publicly. This is a server component so
// the check happens before any HTML reaches the client, not a
// client-side hide-after-render.
export async function TestimonialSection() {
  const testimonials = await fetchWithFallback<any>(APPROVED_TESTIMONIALS_QUERY, {}, []);

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-11 md:py-24 px-5 md:px-10 max-w-wide mx-auto border-t border-white/[0.08]">
      <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-2.5">Trust</span>
      <h2 className="font-display font-bold uppercase text-[26px] md:text-[38px] tracking-tight">
        Trust Is Earned on Every Vessel.
      </h2>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.slice(0, 4).map((t: any) => (
          <div key={t._id} className="border-l-2 border-gold pl-5">
            <p className="font-display text-lg font-medium leading-snug text-marine-white">&ldquo;{t.quote}&rdquo;</p>
            <div className="mt-3 flex items-center gap-3">
              {t.customerPhoto && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={urlForImage(t.customerPhoto).width(40).height(40).url()} alt={t.customerName} className="w-8 h-8 rounded-full object-cover" />
              )}
              <span className="font-mono text-[10.5px] uppercase tracking-[0.06em] text-cool-gray">
                {t.customerName} {t.location && `— ${t.location}`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
