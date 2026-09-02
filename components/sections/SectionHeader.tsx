import { Eyebrow } from './Eyebrow';

interface SectionHeaderProps {
  eyebrow?: string;
  headline: string;
  body?: string;
  align?: 'left' | 'center';
}

export function SectionHeader({ eyebrow, headline, body, align = 'left' }: SectionHeaderProps) {
  return (
    <div className={align === 'center' ? 'text-center max-w-2xl mx-auto' : 'max-w-2xl'}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="font-display font-bold uppercase text-3xl md:text-5xl leading-[1.05] tracking-tight text-marine-white">
        {headline}
      </h2>
      {body && <p className="mt-5 text-base leading-relaxed text-cool-gray">{body}</p>}
    </div>
  );
}
