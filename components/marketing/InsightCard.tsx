import { Link } from '@/i18n/navigation';

interface InsightCardProps {
  category: string;
  readTime: string;
  title: string;
  excerpt: string;
  href: string;
  imageColor: string;
}

export function InsightCard({ category, readTime, title, excerpt, href, imageColor }: InsightCardProps) {
  return (
    <div className="bg-navy">
      <div className="aspect-[3/2] relative overflow-hidden">
        <svg width="100%" height="100%" viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice">
          <rect width="300" height="200" fill={imageColor} />
          <path d="M40 150 L260 150 L220 110 L80 110 Z" fill="#050A11" />
        </svg>
      </div>
      <div className="pt-[18px] pb-6 px-5">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-[9.5px] text-gold uppercase tracking-[0.1em]">{category}</span>
          <span className="font-mono text-[9.5px] text-cool-gray before:content-['·'] before:mr-2.5 before:text-cool-gray">
            {readTime}
          </span>
        </div>
        <div className="font-display text-[17px] font-semibold mt-2.5 leading-tight">{title}</div>
        <p className="text-[12.5px] text-cool-gray mt-2 leading-relaxed">{excerpt}</p>
        <Link href={href} className="inline-flex items-center gap-1.5 mt-3.5 font-mono text-[10px] uppercase tracking-[0.1em] text-gold">
          Read Article →
        </Link>
      </div>
    </div>
  );
}
