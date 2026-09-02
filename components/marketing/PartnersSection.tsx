import { urlForImage } from '@/lib/sanity/image';
import { pickLocale } from '@/lib/sanity/fetch-with-fallback';

interface PartnerDoc {
  _id: string;
  companyName: string;
  logo: any;
  websiteUrl?: string;
  relationshipLabel?: { en?: string; es?: string };
  location?: string;
}

interface PartnersSectionProps {
  section: {
    enabled?: boolean;
    eyebrow?: { en?: string; es?: string };
    title?: { en?: string; es?: string };
    subcopy?: { en?: string; es?: string };
    partners?: PartnerDoc[];
  } | null;
  locale: string;
}

// No implica sociedad legal formal, certificación, ni endoso más allá
// de lo que el copy del CMS diga explícitamente (regla de marca
// pedida) — por eso el título por defecto es neutral.
const DEFAULT_TITLE: Record<string, string> = {
  en: 'Partners & Collaborators',
  es: 'Socios y colaboradores',
};

export function PartnersSection({ section, locale }: PartnersSectionProps) {
  const partners = (section?.partners ?? []).filter(Boolean);

  // Apagado por defecto (enabled inicia en false en el schema) y sin
  // renderizar nada si no hay partners seleccionados — mismo patrón
  // que TestimonialSection: nunca un placeholder visible en producción.
  if (!section?.enabled || partners.length === 0) return null;

  const eyebrow = pickLocale(section.eyebrow, locale) || (locale === 'es' ? 'Colaboraciones de confianza' : 'Trusted Collaborations');
  const title = pickLocale(section.title, locale) || DEFAULT_TITLE[locale] || DEFAULT_TITLE.en;
  const subcopy = pickLocale(section.subcopy, locale);

  return (
    <section className="relative border-t border-b border-white/[0.07] bg-[#0A1420] py-14 md:py-20">
      <div className="max-w-wide mx-auto px-5 md:px-10">
        <div className="text-center max-w-[560px] mx-auto mb-10 md:mb-14">
          <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-2.5">{eyebrow}</span>
          <h2 className="font-display font-bold uppercase text-[24px] md:text-[32px] tracking-tight text-marine-white">{title}</h2>
          {subcopy && <p className="mt-3 text-sm text-cool-gray leading-relaxed">{subcopy}</p>}
        </div>

        {/* Desktop: grilla balanceada, 4-6 cómodos según ancho.
            Mobile: scroll horizontal contenido, sin overflow de página. */}
        <div className="flex md:grid md:grid-cols-4 lg:grid-cols-6 gap-px overflow-x-auto md:overflow-visible -mx-5 px-5 md:mx-0 md:px-0 snap-x snap-mandatory md:snap-none">
          {partners.map((partner) => {
            const label = pickLocale(partner.relationshipLabel, locale);
            const content = (
              <div className="group flex flex-col items-center justify-center gap-3 min-w-[148px] md:min-w-0 shrink-0 md:shrink px-6 py-8 snap-start border border-transparent hover:border-white/[0.08] hover:bg-white/[0.02] transition-colors rounded-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={urlForImage(partner.logo).width(200).height(80).fit('max').url()}
                  alt={partner.companyName}
                  className="max-h-9 md:max-h-10 w-auto object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                />
                {label && (
                  <span className="font-mono text-[8.5px] uppercase tracking-[0.1em] text-cool-gray/70 group-hover:text-gold transition-colors text-center">
                    {label}
                  </span>
                )}
              </div>
            );

            return partner.websiteUrl ? (
              <a key={partner._id} href={partner.websiteUrl} target="_blank" rel="noopener noreferrer" aria-label={partner.companyName}>
                {content}
              </a>
            ) : (
              <div key={partner._id}>{content}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
